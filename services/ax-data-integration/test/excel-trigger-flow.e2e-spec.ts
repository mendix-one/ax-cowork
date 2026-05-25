import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import ExcelJS from 'exceljs'
import { type Db, MongoClient } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { ensureIndexes } from '../src/acore/mongo/indexes'

const API_KEY = 'e2e-test-key'

async function buildExcelBuffer(headers: string[], rows: unknown[][], sheet = 'Data'): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet(sheet)
  ws.addRow(headers)
  for (const r of rows) ws.addRow(r)
  const ab = await wb.xlsx.writeBuffer()
  return Buffer.from(ab)
}

interface UploadResp {
  id: string
}
interface CreateJobResp {
  id: string
}
interface TriggerResp {
  runId: string
  status: string
}
interface RunDetail {
  id: string
  status: string
  counts: { read: number; inserted: number; updated: number; unchanged: number; deleted: number; errors: number }
  workerId: string
  errors: { stage: string; message: string }[]
}
interface RawList {
  items: { recordKey: string; status: string; version: number; payload?: Record<string, unknown> }[]
  total: number
}
interface RawDetail {
  recordKey: string
  payload: Record<string, unknown>
  version: number
}
interface MetadataLatest {
  schemaHash: string
  schema: { fields: { name: string; type: string; nullable: boolean }[] }
}

/**
 * Full HTTP path: upload an Excel file, create a job_config pointing at it, manually trigger
 * the sync, then verify everything from the admin API surface (sync_runs, raw_records, source_metadata).
 *
 * Sister test to `sync-executor-main-loop.e2e-spec.ts`, which exercises the executor in-process.
 * This one validates that the controllers + API key auth + DTO validation all glue together.
 */
describe('Excel job → manual trigger (HTTP e2e)', () => {
  let app: INestApplication<App>
  let client: MongoClient
  let db: Db

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
    await ensureIndexes(db)
  }, 60_000)

  afterAll(async () => {
    if (app) await app.close()
    if (client) await client.close()
  })

  beforeEach(async () => {
    await Promise.all([
      db.collection('sync_runs').deleteMany({}),
      db.collection('job_configs').deleteMany({}),
      db.collection('raw_records').deleteMany({}),
      db.collection('source_metadata').deleteMany({}),
      db.collection('raw_record_changelog').deleteMany({}),
      db.collection('source_files').deleteMany({}),
      db.collection('fs.files').deleteMany({}),
      db.collection('fs.chunks').deleteMany({}),
    ])
  })

  async function uploadExcel(name: string, headers: string[], rows: unknown[][]): Promise<string> {
    const buf = await buildExcelBuffer(headers, rows)
    const res = await request(app.getHttpServer())
      .post('/source-files')
      .set('x-api-key', API_KEY)
      .attach('file', buf, { filename: `${name}.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      .expect(201)
    return (res.body as UploadResp).id
  }

  async function createExcelJob(name: string, sourceFileId: string, pkField = 'id'): Promise<string> {
    const res = await request(app.getHttpServer())
      .post('/job-configs')
      .set('x-api-key', API_KEY)
      .send({
        name,
        source: { type: 'excel', config: { sourceFileId, sheetName: 'Data', headerRow: 1, startRow: 2 } },
        schedule: { cronExpression: '0 0 1 1 *' },
        identity: { strategy: 'primary-key', fields: [pkField] },
      })
      .expect(201)
    return (res.body as CreateJobResp).id
  }

  it('upload → create job → trigger → counts.inserted = row count, status = success', async () => {
    const fileId = await uploadExcel(
      'initial-insert',
      ['id', 'name', 'amount'],
      [
        [1, 'Alice', 100],
        [2, 'Bob', 200],
        [3, 'Carol', 300],
      ],
    )
    const jobId = await createExcelJob('initial-insert', fileId)

    const trigger = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as TriggerResp
    expect(trigger.status).toBe('success')
    expect(typeof trigger.runId).toBe('string')

    // Counts come back from the admin API, not directly from the repo — proves the controller
    // serializes them correctly + ApiKeyGuard isn't stripping anything.
    const detail = (await request(app.getHttpServer()).get(`/sync-runs/${trigger.runId}`).set('x-api-key', API_KEY).expect(200)).body as RunDetail
    expect(detail.counts).toEqual({ read: 3, inserted: 3, updated: 0, unchanged: 0, deleted: 0, errors: 0 })
    expect(detail.errors).toEqual([])
    expect(detail.workerId).toMatch(/^.+:\d+$/) // hostname:pid

    const rawList = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobId}`).set('x-api-key', API_KEY).expect(200)).body as RawList
    expect(rawList.total).toBe(3)
    expect(rawList.items.map((r) => r.recordKey).sort()).toEqual(['1', '2', '3'])
    expect(rawList.items.every((r) => r.status === 'active' && r.version === 1)).toBe(true)

    // T2-A09: a successful run feeds the Prometheus metrics. Scrape `/metrics` and assert
    // both the total counter and a per-op records counter materialized with non-zero values.
    // Label order in prom-client output is alphabetical-ish but interleaves the registry's
    // defaultLabels (service=…), so assertions use line-anchored regex rather than a
    // brittle full-prefix match.
    const metrics = (await request(app.getHttpServer()).get('/metrics').expect(200)).text
    expect(metrics).toMatch(new RegExp(`^sync_run_total\\{[^}]*status="success"[^}]*jobConfigId="${jobId}"[^}]*\\} 1`, 'm'))
    expect(metrics).toMatch(new RegExp(`^sync_run_records_total\\{[^}]*op="inserted"[^}]*jobConfigId="${jobId}"[^}]*\\} 3`, 'm'))
    // Duration histogram observation recorded (sum > 0).
    expect(metrics).toMatch(new RegExp(`^sync_run_duration_seconds_sum\\{[^}]*status="success"[^}]*jobConfigId="${jobId}"[^}]*\\} \\d`, 'm'))
  })

  it('second trigger on unchanged file: counts.unchanged = row count, version stays at 1', async () => {
    const fileId = await uploadExcel(
      'unchanged',
      ['id', 'name'],
      [
        [1, 'Alice'],
        [2, 'Bob'],
      ],
    )
    const jobId = await createExcelJob('unchanged', fileId)

    const first = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as TriggerResp
    expect(first.status).toBe('success')

    const second = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as TriggerResp
    expect(second.status).toBe('success')

    const detail = (await request(app.getHttpServer()).get(`/sync-runs/${second.runId}`).set('x-api-key', API_KEY).expect(200)).body as RunDetail
    expect(detail.counts).toMatchObject({ read: 2, inserted: 0, updated: 0, unchanged: 2, deleted: 0 })

    // raw_records version still 1 because no payload changed.
    const rawList = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobId}`).set('x-api-key', API_KEY).expect(200)).body as RawList
    expect(rawList.items.every((r) => r.version === 1)).toBe(true)
  })

  it('trigger creates a source_metadata snapshot reachable via GET /source-metadata/latest', async () => {
    const fileId = await uploadExcel(
      'schema-snapshot',
      ['id', 'price', 'active'],
      [
        [1, 19.99, true],
        [2, 25.0, false],
      ],
    )
    const jobId = await createExcelJob('schema-snapshot', fileId)

    await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)

    const latest = (await request(app.getHttpServer()).get(`/source-metadata/latest?jobConfigId=${jobId}`).set('x-api-key', API_KEY).expect(200))
      .body as MetadataLatest
    expect(latest.schema.fields.map((f) => f.name).sort()).toEqual(['active', 'id', 'price'])
    expect(latest.schemaHash).toMatch(/^[a-f0-9]{64}$/)
  })

  it('raw_records detail returns the cell values as they came out of the adapter', async () => {
    const fileId = await uploadExcel('values', ['id', 'name', 'amount'], [[42, 'Alice', 100]])
    const jobId = await createExcelJob('values', fileId)

    const trigger = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as TriggerResp
    expect(trigger.status).toBe('success')

    const list = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobId}`).set('x-api-key', API_KEY).expect(200)).body as RawList
    expect(list.total).toBe(1)
    const id = (list.items[0] as { id: string }).id

    const detail = (await request(app.getHttpServer()).get(`/raw-records/${id}`).set('x-api-key', API_KEY).expect(200)).body as RawDetail
    expect(detail.recordKey).toBe('42')
    expect(detail.payload.id).toBe(42)
    expect(detail.payload.name).toBe('Alice')
    expect(detail.payload.amount).toBe(100)
    expect(detail.version).toBe(1)
  })

  // T-J03: two consecutive syncs that exercise all four classification outcomes in one go.
  // Pattern: run 1 inserts 3 rows; run 2 sees rec#1 modified, rec#2 unchanged, rec#3 missing
  // (→ deleted), rec#4 new (→ inserted). Asserts via HTTP all the way through.
  describe('two syncs detect insert / update / unchanged / delete in one run (T-J03)', () => {
    async function patchSource(jobId: string, newSourceFileId: string): Promise<void> {
      await request(app.getHttpServer())
        .patch(`/job-configs/${jobId}`)
        .set('x-api-key', API_KEY)
        .send({ source: { type: 'excel', config: { sourceFileId: newSourceFileId, sheetName: 'Data', headerRow: 1, startRow: 2 } } })
        .expect(200)
    }

    it('all four classification outcomes resolve correctly in a single follow-up run', async () => {
      // Run 1: baseline insert of three records.
      const fileV1 = await uploadExcel(
        'iud-v1',
        ['id', 'name', 'amount'],
        [
          [1, 'Alice', 100],
          [2, 'Bob', 200],
          [3, 'Carol', 300],
        ],
      )
      const jobId = await createExcelJob('iud', fileV1)
      const first = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as TriggerResp
      expect(first.status).toBe('success')
      const firstDetail = (await request(app.getHttpServer()).get(`/sync-runs/${first.runId}`).set('x-api-key', API_KEY).expect(200)).body as RunDetail
      expect(firstDetail.counts).toMatchObject({ read: 3, inserted: 3, updated: 0, unchanged: 0, deleted: 0 })

      // Run 2: rec#1 updated (amount 100→150), rec#2 unchanged, rec#3 removed, rec#4 new.
      const fileV2 = await uploadExcel(
        'iud-v2',
        ['id', 'name', 'amount'],
        [
          [1, 'Alice', 150],
          [2, 'Bob', 200],
          [4, 'Dave', 400],
        ],
      )
      await patchSource(jobId, fileV2)
      const second = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as TriggerResp
      expect(second.status).toBe('success')

      const secondDetail = (await request(app.getHttpServer()).get(`/sync-runs/${second.runId}`).set('x-api-key', API_KEY).expect(200)).body as RunDetail
      expect(secondDetail.counts).toEqual({ read: 3, inserted: 1, updated: 1, unchanged: 1, deleted: 1, errors: 0 })

      // raw_records state: 1/2/4 active, 3 deleted; rec#1 version bumped to 2.
      const active = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobId}&status=active`).set('x-api-key', API_KEY).expect(200))
        .body as RawList
      expect(active.total).toBe(3)
      expect(active.items.map((r) => r.recordKey).sort()).toEqual(['1', '2', '4'])
      const deleted = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobId}&status=deleted`).set('x-api-key', API_KEY).expect(200))
        .body as RawList
      expect(deleted.total).toBe(1)
      expect(deleted.items[0].recordKey).toBe('3')

      // Pull each affected record's detail to verify version + payload alignment.
      const lookup = async (rk: string): Promise<RawDetail> => {
        const list = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobId}&recordKey=${rk}`).set('x-api-key', API_KEY).expect(200))
          .body as RawList
        expect(list.total).toBe(1)
        const id = (list.items[0] as { id: string }).id
        return (await request(app.getHttpServer()).get(`/raw-records/${id}`).set('x-api-key', API_KEY).expect(200)).body as RawDetail
      }
      const rec1 = await lookup('1')
      expect(rec1.version).toBe(2) // updated → bumped
      expect(rec1.payload.amount).toBe(150)
      const rec2 = await lookup('2')
      expect(rec2.version).toBe(1) // unchanged → not bumped
      const rec3 = await lookup('3')
      expect(rec3.version).toBe(1) // delete doesn't bump version (only flips status + deletedInRunId)
      const rec4 = await lookup('4')
      expect(rec4.version).toBe(1) // newly inserted in run 2

      // Filter by runId — the second run should have touched all four records
      // (firstSeenRunId for #4, lastUpdatedRunId for #1, lastUpdatedRunId for #2 via lastSeenAt-only
      // touch — but that doesn't update lastUpdatedRunId, so #2 won't appear here; and deletedInRunId for #3).
      // Concretely: run 2 = firstSeen(4) ∪ lastUpdated(1) ∪ deletedIn(3) = 3 records.
      const byRun2 = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobId}&runId=${second.runId}`).set('x-api-key', API_KEY).expect(200))
        .body as RawList
      expect(byRun2.total).toBe(3)
      expect(byRun2.items.map((r) => r.recordKey).sort()).toEqual(['1', '3', '4'])
    })

    it('detectDeleted=false: missing rows stay active across re-syncs', async () => {
      const fileV1 = await uploadExcel(
        'no-delete-v1',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ],
      )
      // Custom job (cannot use createExcelJob helper because we need detectDeleted=false).
      const createRes = await request(app.getHttpServer())
        .post('/job-configs')
        .set('x-api-key', API_KEY)
        .send({
          name: 'no-delete-http',
          source: { type: 'excel', config: { sourceFileId: fileV1, sheetName: 'Data', headerRow: 1, startRow: 2 } },
          schedule: { cronExpression: '0 0 1 1 *' },
          identity: { strategy: 'primary-key', fields: ['id'] },
          options: { detectDeleted: false },
        })
        .expect(201)
      const jobId = (createRes.body as CreateJobResp).id

      await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)

      const fileV2 = await uploadExcel(
        'no-delete-v2',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
        ],
      )
      await patchSource(jobId, fileV2)
      const second = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as TriggerResp

      const detail = (await request(app.getHttpServer()).get(`/sync-runs/${second.runId}`).set('x-api-key', API_KEY).expect(200)).body as RunDetail
      expect(detail.counts.deleted).toBe(0)
      expect(detail.counts.unchanged).toBe(2)

      // rec#3 should still be active even though it's missing from v2.
      const active = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobId}&status=active`).set('x-api-key', API_KEY).expect(200))
        .body as RawList
      expect(active.total).toBe(3)
    })
  })
})
