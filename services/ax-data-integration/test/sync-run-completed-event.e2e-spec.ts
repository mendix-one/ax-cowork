import { INestApplication, ValidationPipe } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Test } from '@nestjs/testing'
import ExcelJS from 'exceljs'
import { type Db, MongoClient } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { SYNC_RUN_COMPLETED_EVENT, type SyncRunCompletedPayload } from '../src/workers/sync-executor.service'

const API_KEY = 'e2e-test-key'

/**
 * T2-A12 e2e: every finalized sync_run fires `sync.run.completed` on the global
 * EventEmitter2. Verifies the payload contract that T2-B09 (drift) + T2-B11 (alerts)
 * will rely on.
 *
 * Approach: subscribe via the shared EventEmitter2 (registered in MainModule), trigger
 * a real Excel sync end-to-end, assert the payload shape matches the run that the API
 * just returned. Mirrors the pattern used by phase-1 `scheduler.service.ts` for
 * `JOB_CONFIG_CHANGED_EVENT`.
 */
describe('SYNC_RUN_COMPLETED_EVENT (e2e)', () => {
  let app: INestApplication<App>
  let client: MongoClient
  let db: Db
  let events: EventEmitter2

  async function buildExcelBuffer(): Promise<Buffer> {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Data')
    ws.addRow(['id', 'name'])
    ws.addRow([1, 'Alice'])
    ws.addRow([2, 'Bob'])
    const ab = await wb.xlsx.writeBuffer()
    return Buffer.from(ab)
  }

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()
    events = app.get(EventEmitter2)

    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
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

  it('fires once per finalized run with the full payload contract', async () => {
    const buf = await buildExcelBuffer()
    const uploadRes = await request(app.getHttpServer()).post('/source-files').set('x-api-key', API_KEY).attach('file', buf, 'data.xlsx').expect(201)
    const { id: fileId } = uploadRes.body as { id: string }

    const jobRes = await request(app.getHttpServer())
      .post('/job-configs')
      .set('x-api-key', API_KEY)
      .send({
        name: 'event-job',
        source: { type: 'excel', config: { sourceFileId: fileId, sheetName: 'Data', headerRow: 1, startRow: 2 } },
        schedule: { cronExpression: '0 0 * * *' },
        identity: { strategy: 'primary-key', fields: ['id'] },
      })
      .expect(201)
    const { id: jobId } = jobRes.body as { id: string }

    const received: SyncRunCompletedPayload[] = []
    const handler = (payload: SyncRunCompletedPayload): void => {
      received.push(payload)
    }
    events.on(SYNC_RUN_COMPLETED_EVENT, handler)

    try {
      const trigger = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as {
        runId: string
        status: string
      }

      // Event is fired synchronously inside `execute()` after finalize — by the time the HTTP
      // response returns, the listener has already been invoked. No need to wait.
      expect(received).toHaveLength(1)
      const payload = received[0]
      expect(payload.jobConfigId.toHexString()).toBe(jobId)
      expect(payload.syncRunId.toHexString()).toBe(trigger.runId)
      expect(payload.status).toBe('success')
      expect(payload.counts).toMatchObject({ read: 2, inserted: 2, updated: 0, unchanged: 0, deleted: 0, errors: 0 })
      expect(payload.triggeredBy).toBe('manual')
      expect(payload.durationMs).toBeGreaterThanOrEqual(0)
      expect(payload.finishedAt).toBeInstanceOf(Date)
    } finally {
      events.off(SYNC_RUN_COMPLETED_EVENT, handler)
    }
  })

  it('a listener throwing does NOT propagate back into the executor (best-effort fire)', async () => {
    const buf = await buildExcelBuffer()
    const { id: fileId } = (await request(app.getHttpServer()).post('/source-files').set('x-api-key', API_KEY).attach('file', buf, 'data.xlsx').expect(201))
      .body as { id: string }
    const { id: jobId } = (
      await request(app.getHttpServer())
        .post('/job-configs')
        .set('x-api-key', API_KEY)
        .send({
          name: 'crash-listener-job',
          source: { type: 'excel', config: { sourceFileId: fileId, sheetName: 'Data', headerRow: 1, startRow: 2 } },
          schedule: { cronExpression: '0 0 * * *' },
          identity: { strategy: 'primary-key', fields: ['id'] },
        })
        .expect(201)
    ).body as { id: string }

    const crash = (): never => {
      throw new Error('listener boom')
    }
    events.on(SYNC_RUN_COMPLETED_EVENT, crash)

    try {
      const trigger = (await request(app.getHttpServer()).post(`/job-configs/${jobId}/trigger`).set('x-api-key', API_KEY).expect(200)).body as {
        status: string
      }
      // Listener throwing did not flip the run to failed — the run still finalized as success.
      expect(trigger.status).toBe('success')
    } finally {
      events.off(SYNC_RUN_COMPLETED_EVENT, crash)
    }
  })
})
