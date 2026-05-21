import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import ExcelJS from 'exceljs'
import { type Db, MongoClient, ObjectId } from 'mongodb'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { ensureIndexes } from '../src/acore/mongo/indexes'
import { JobConfigsService } from '../src/domain/job-config/job-config.service'
import { RawRecordChangelogRepository } from '../src/domain/raw-record-changelog/raw-record-changelog.repository'
import { RawRecordRepository } from '../src/domain/raw-record/raw-record.repository'
import { SourceFilesService } from '../src/domain/source-file/source-file.service'
import { SourceMetadataRepository } from '../src/domain/source-metadata/source-metadata.repository'
import { SyncRunRepository } from '../src/domain/sync-run/sync-run.repository'
import { SyncExecutorService } from '../src/workers/sync-executor.service'

async function buildExcelBuffer(headers: string[], rows: unknown[][], sheet = 'Data'): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet(sheet)
  ws.addRow(headers)
  for (const r of rows) ws.addRow(r)
  const ab = await wb.xlsx.writeBuffer()
  return Buffer.from(ab)
}

describe('SyncExecutorService — main loop (T-E04)', () => {
  let app: INestApplication<App>
  let executor: SyncExecutorService
  let jobConfigs: JobConfigsService
  let sourceFiles: SourceFilesService
  let runs: SyncRunRepository
  let rawRecords: RawRecordRepository
  let sourceMetadata: SourceMetadataRepository
  let changelogs: RawRecordChangelogRepository
  let client: MongoClient
  let db: Db

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    executor = app.get(SyncExecutorService)
    jobConfigs = app.get(JobConfigsService)
    sourceFiles = app.get(SourceFilesService)
    runs = app.get(SyncRunRepository)
    rawRecords = app.get(RawRecordRepository)
    sourceMetadata = app.get(SourceMetadataRepository)
    changelogs = app.get(RawRecordChangelogRepository)

    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
    await ensureIndexes(db) // source_metadata + raw_records dedup require unique indexes
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

  async function setupExcelJob(opts: { name: string; headers: string[]; rows: unknown[][]; errorThreshold?: number; pkField?: string }): Promise<ObjectId> {
    const buffer = await buildExcelBuffer(opts.headers, opts.rows)
    const file = await sourceFiles.upload({
      fileName: `${opts.name}.xlsx`,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: buffer.length,
      content: buffer,
      uploadedBy: 'test',
    })

    const job = await jobConfigs.create({
      name: opts.name,
      source: { type: 'excel', config: { sourceFileId: file.id, sheetName: 'Data', headerRow: 1, startRow: 2 } },
      schedule: { cronExpression: '0 0 * * *' },
      identity: { strategy: 'primary-key', fields: [opts.pkField ?? 'id'] },
      options: opts.errorThreshold ? { errorThreshold: opts.errorThreshold } : undefined,
      createdBy: 'test',
    })
    return new ObjectId(job.id)
  }

  it('initial run: classifies every Excel row as inserted', async () => {
    const jobId = await setupExcelJob({
      name: 'initial-insert',
      headers: ['id', 'name', 'amount'],
      rows: [
        [1, 'Alice', 100],
        [2, 'Bob', 200],
        [3, 'Carol', 300],
      ],
    })

    const result = await executor.execute(jobId, 'manual')
    expect(result.kind).toBe('acquired')

    if (result.kind === 'acquired') {
      const run = await runs.findById(result.runId)
      expect(run?.status).toBe('success')
      expect(run?.counts).toEqual({ read: 3, inserted: 3, updated: 0, unchanged: 0, deleted: 0, errors: 0 })
      expect(await rawRecords.countByJobConfig(jobId)).toBe(3)
    }
  })

  it('re-sync with unchanged data: counts.unchanged = total, no inserts or updates (P002 outcome)', async () => {
    const jobId = await setupExcelJob({
      name: 'idempotent',
      headers: ['id', 'name'],
      rows: [
        [1, 'Alice'],
        [2, 'Bob'],
      ],
    })

    await executor.execute(jobId, 'manual') // populate
    const second = await executor.execute(jobId, 'manual')

    if (second.kind === 'acquired') {
      const run = await runs.findById(second.runId)
      expect(run?.counts).toEqual({ read: 2, inserted: 0, updated: 0, unchanged: 2, deleted: 0, errors: 0 })
    }
  })

  it('update detection: stale payloadHash on a stored record → counts.updated++ and version bumps', async () => {
    const jobId = await setupExcelJob({
      name: 'update-detect',
      headers: ['id', 'name'],
      rows: [
        [1, 'Alice'],
        [2, 'Bob'],
      ],
    })
    await executor.execute(jobId, 'manual') // initial insert

    // Tamper: change payloadHash on Alice so the next sync sees a "different" stored doc.
    await db.collection('raw_records').updateOne({ jobConfigId: jobId, recordKey: '1' }, { $set: { payloadHash: 'forced-mismatch' } })

    const second = await executor.execute(jobId, 'manual')
    expect(second.kind).toBe('acquired')
    if (second.kind === 'acquired') {
      const run = await runs.findById(second.runId)
      expect(run?.counts).toMatchObject({ read: 2, inserted: 0, updated: 1, unchanged: 1, errors: 0 })

      const alice = await db.collection('raw_records').findOne({ jobConfigId: jobId, recordKey: '1' })
      expect(alice?.version).toBe(2)
      expect(alice?.lastUpdatedRunId).toEqual(second.runId)
    }
  })

  it('source_metadata is written for new schemas and skipped for repeated runs of the same schema', async () => {
    const jobId = await setupExcelJob({
      name: 'metadata-test',
      headers: ['id', 'value'],
      rows: [[1, 'x']],
    })

    await executor.execute(jobId, 'manual')
    expect(await sourceMetadata.countByJobConfig(jobId)).toBe(1)

    await executor.execute(jobId, 'manual')
    expect(await sourceMetadata.countByJobConfig(jobId)).toBe(1) // same schema, no new doc
  })

  it('per-record errors are captured; threshold abort moves status to failed', async () => {
    const jobId = await setupExcelJob({
      name: 'error-threshold',
      headers: ['id', 'name'],
      rows: [
        [1, 'Alice'],
        [null, 'NoPK1'], // primary-key null → computeRecordKey throws
        [null, 'NoPK2'], // hits threshold
        [4, 'Dave'],
      ],
      errorThreshold: 2,
    })

    const result = await executor.execute(jobId, 'manual')
    expect(result.kind).toBe('acquired')
    if (result.kind === 'acquired') {
      expect(result.status).toBe('failed')
      const run = await runs.findById(result.runId)
      expect(run?.status).toBe('failed')
      expect(run?.counts.errors).toBeGreaterThanOrEqual(2)
      expect(run?.errors.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('per-record errors below threshold: run finalizes as partial with errors recorded', async () => {
    const jobId = await setupExcelJob({
      name: 'partial-errors',
      headers: ['id', 'name'],
      rows: [
        [1, 'Alice'],
        [null, 'BadOne'],
        [3, 'Carol'],
      ],
      errorThreshold: 5, // higher than bad-row count
    })

    const result = await executor.execute(jobId, 'manual')
    expect(result.kind).toBe('acquired')
    if (result.kind === 'acquired') {
      const run = await runs.findById(result.runId)
      expect(run?.status).toBe('partial')
      expect(run?.counts).toMatchObject({ read: 3, inserted: 2, errors: 1 })
      expect(run?.errors[0].stage).toBe('write')
    }
  })

  describe('delete detection (T-E05)', () => {
    async function uploadExcel(name: string, headers: string[], rows: unknown[][]): Promise<string> {
      const buffer = await buildExcelBuffer(headers, rows)
      const file = await sourceFiles.upload({
        fileName: `${name}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: buffer.length,
        content: buffer,
        uploadedBy: 'test',
      })
      return file.id
    }

    it('detectDeleted=true (default): rows removed from the source are marked deleted', async () => {
      const fileA = await uploadExcel(
        'with-3',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ],
      )
      const job = await jobConfigs.create({
        name: 'delete-default',
        source: { type: 'excel', config: { sourceFileId: fileA, sheetName: 'Data', headerRow: 1, startRow: 2 } },
        schedule: { cronExpression: '0 0 * * *' },
        identity: { strategy: 'primary-key', fields: ['id'] },
        createdBy: 'test',
      })
      const jobId = new ObjectId(job.id)

      await executor.execute(jobId, 'manual')
      expect(await rawRecords.countByJobConfig(jobId, { status: 'active' })).toBe(3)

      const fileB = await uploadExcel(
        'with-2',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
        ],
      )
      await jobConfigs.update(jobId, {
        source: { type: 'excel', config: { sourceFileId: fileB, sheetName: 'Data', headerRow: 1, startRow: 2 } },
      })

      const second = await executor.execute(jobId, 'manual')
      expect(second.kind).toBe('acquired')
      if (second.kind === 'acquired') {
        const run = await runs.findById(second.runId)
        expect(run?.counts.deleted).toBe(1)
        expect(run?.counts.unchanged).toBe(2)

        const removed = await db.collection('raw_records').findOne({ jobConfigId: jobId, recordKey: '3' })
        expect(removed?.status).toBe('deleted')
        expect(removed?.deletedInRunId).toEqual(second.runId)
      }

      expect(await rawRecords.countByJobConfig(jobId, { status: 'active' })).toBe(2)
      expect(await rawRecords.countByJobConfig(jobId, { status: 'deleted' })).toBe(1)
    })

    it('detectDeleted=false: missing rows are left as active', async () => {
      const fileA = await uploadExcel(
        'keep-3',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ],
      )
      const job = await jobConfigs.create({
        name: 'no-delete',
        source: { type: 'excel', config: { sourceFileId: fileA, sheetName: 'Data', headerRow: 1, startRow: 2 } },
        schedule: { cronExpression: '0 0 * * *' },
        identity: { strategy: 'primary-key', fields: ['id'] },
        options: { detectDeleted: false },
        createdBy: 'test',
      })
      const jobId = new ObjectId(job.id)

      await executor.execute(jobId, 'manual')
      const fileB = await uploadExcel(
        'keep-2',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
        ],
      )
      await jobConfigs.update(jobId, {
        source: { type: 'excel', config: { sourceFileId: fileB, sheetName: 'Data', headerRow: 1, startRow: 2 } },
      })

      const second = await executor.execute(jobId, 'manual')
      if (second.kind === 'acquired') {
        const run = await runs.findById(second.runId)
        expect(run?.counts.deleted).toBe(0)
      }

      const stale = await db.collection('raw_records').findOne({ jobConfigId: jobId, recordKey: '3' })
      expect(stale?.status).toBe('active')
    })

    it('already-deleted records are not re-counted on subsequent runs', async () => {
      const fileA = await uploadExcel(
        'once-3',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ],
      )
      const job = await jobConfigs.create({
        name: 'idempotent-delete',
        source: { type: 'excel', config: { sourceFileId: fileA, sheetName: 'Data', headerRow: 1, startRow: 2 } },
        schedule: { cronExpression: '0 0 * * *' },
        identity: { strategy: 'primary-key', fields: ['id'] },
        createdBy: 'test',
      })
      const jobId = new ObjectId(job.id)

      await executor.execute(jobId, 'manual')

      const fileB = await uploadExcel(
        'once-2',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
        ],
      )
      await jobConfigs.update(jobId, {
        source: { type: 'excel', config: { sourceFileId: fileB, sheetName: 'Data', headerRow: 1, startRow: 2 } },
      })
      const second = await executor.execute(jobId, 'manual')
      if (second.kind === 'acquired') {
        const r = await runs.findById(second.runId)
        expect(r?.counts.deleted).toBe(1)
      }

      // Third run with the SAME shrunk file: id=3 already 'deleted', no further deletions.
      const third = await executor.execute(jobId, 'manual')
      if (third.kind === 'acquired') {
        const r = await runs.findById(third.runId)
        expect(r?.counts.deleted).toBe(0)
        expect(r?.counts.unchanged).toBe(2)
      }
    })
  })

  describe('audit changelog (T-E06)', () => {
    async function uploadExcel(name: string, headers: string[], rows: unknown[][]): Promise<string> {
      const buffer = await buildExcelBuffer(headers, rows)
      const file = await sourceFiles.upload({
        fileName: `${name}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: buffer.length,
        content: buffer,
        uploadedBy: 'test',
      })
      return file.id
    }

    it('initial sync writes one insert entry per row (auditChanges=true by default)', async () => {
      const jobId = await setupExcelJob({
        name: 'audit-insert',
        headers: ['id', 'name'],
        rows: [
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ],
      })

      const result = await executor.execute(jobId, 'manual')
      expect(result.kind).toBe('acquired')

      expect(await changelogs.countByJobConfig(jobId)).toBe(3)
      expect(await changelogs.countByJobConfig(jobId, { operation: 'insert' })).toBe(3)

      const trail = await changelogs.findByRecord(jobId, '1')
      expect(trail).toHaveLength(1)
      expect(trail[0].operation).toBe('insert')
      expect(trail[0].versionBefore).toBeNull()
      expect(trail[0].versionAfter).toBe(1)
      expect(trail[0].payloadBefore).toBeNull()
      expect(trail[0].payloadAfter).toMatchObject({ id: 1, name: 'a' })
    })

    it('update writes one update entry with versionBefore/After and payloadBefore/After', async () => {
      const jobId = await setupExcelJob({
        name: 'audit-update',
        headers: ['id', 'name'],
        rows: [[1, 'a']],
      })
      await executor.execute(jobId, 'manual')

      // Force a payloadHash mismatch on the persisted record so the next run treats it as UPDATE.
      await db.collection('raw_records').updateOne({ jobConfigId: jobId, recordKey: '1' }, { $set: { payloadHash: 'stale-hash' } })

      const second = await executor.execute(jobId, 'manual')
      expect(second.kind).toBe('acquired')

      const trail = await changelogs.findByRecord(jobId, '1')
      expect(trail).toHaveLength(2)
      expect(trail[0].operation).toBe('insert')
      expect(trail[1].operation).toBe('update')
      expect(trail[1].versionBefore).toBe(1)
      expect(trail[1].versionAfter).toBe(2)
      expect(trail[1].payloadHashBefore).toBe('stale-hash')
      expect(trail[1].payloadHashAfter).not.toBe('stale-hash')
    })

    it('audit-aware delete: each removed row gets one delete changelog entry', async () => {
      const fileA = await uploadExcel(
        'audit-del-3',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
          [3, 'c'],
        ],
      )
      const job = await jobConfigs.create({
        name: 'audit-delete',
        source: { type: 'excel', config: { sourceFileId: fileA, sheetName: 'Data', headerRow: 1, startRow: 2 } },
        schedule: { cronExpression: '0 0 * * *' },
        identity: { strategy: 'primary-key', fields: ['id'] },
        // auditChanges defaults to true
        createdBy: 'test',
      })
      const jobId = new ObjectId(job.id)

      await executor.execute(jobId, 'manual')
      expect(await changelogs.countByJobConfig(jobId, { operation: 'insert' })).toBe(3)

      const fileB = await uploadExcel(
        'audit-del-2',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
        ],
      )
      await jobConfigs.update(jobId, {
        source: { type: 'excel', config: { sourceFileId: fileB, sheetName: 'Data', headerRow: 1, startRow: 2 } },
      })

      const second = await executor.execute(jobId, 'manual')
      expect(second.kind).toBe('acquired')

      expect(await changelogs.countByJobConfig(jobId, { operation: 'delete' })).toBe(1)
      const deleteEntries = await changelogs.findByRecord(jobId, '3')
      expect(deleteEntries.find((e) => e.operation === 'delete')).toBeDefined()
      const del = deleteEntries.find((e) => e.operation === 'delete')!
      expect(del.payloadBefore).toMatchObject({ id: 3, name: 'c' })
      expect(del.payloadAfter).toMatchObject({ id: 3, name: 'c' })
    })

    it('auditChanges=false: no changelog entries are written', async () => {
      const fileA = await uploadExcel(
        'no-audit-2',
        ['id', 'name'],
        [
          [1, 'a'],
          [2, 'b'],
        ],
      )
      const job = await jobConfigs.create({
        name: 'no-audit',
        source: { type: 'excel', config: { sourceFileId: fileA, sheetName: 'Data', headerRow: 1, startRow: 2 } },
        schedule: { cronExpression: '0 0 * * *' },
        identity: { strategy: 'primary-key', fields: ['id'] },
        options: { auditChanges: false },
        createdBy: 'test',
      })
      const jobId = new ObjectId(job.id)

      await executor.execute(jobId, 'manual')

      const fileB = await uploadExcel('no-audit-1', ['id', 'name'], [[1, 'a']])
      await jobConfigs.update(jobId, {
        source: { type: 'excel', config: { sourceFileId: fileB, sheetName: 'Data', headerRow: 1, startRow: 2 } },
      })
      await executor.execute(jobId, 'manual')

      expect(await changelogs.countByJobConfig(jobId)).toBe(0)
    })

    it('large batch: buffer flushes multiple times and persists every entry', async () => {
      const rows: unknown[][] = []
      for (let i = 1; i <= 250; i++) rows.push([i, `name-${i}`])
      const jobId = await setupExcelJob({ name: 'audit-large', headers: ['id', 'name'], rows })

      const result = await executor.execute(jobId, 'manual')
      expect(result.kind).toBe('acquired')
      if (result.kind === 'acquired') {
        const run = await runs.findById(result.runId)
        expect(run?.counts.inserted).toBe(250)
        expect(await changelogs.countByJobConfig(jobId, { operation: 'insert', syncRunId: result.runId })).toBe(250)
      }
    })
  })

  it('a job_config whose source.config.sourceFileId points to a missing file finalizes the run as failed (no leftover running doc)', async () => {
    const job = await jobConfigs.create({
      name: 'orphan-file',
      source: { type: 'excel', config: { sourceFileId: new ObjectId().toHexString(), sheetName: 'Data', headerRow: 1, startRow: 2 } },
      schedule: { cronExpression: '0 0 * * *' },
      identity: { strategy: 'primary-key', fields: ['id'] },
      createdBy: 'test',
    })
    const jobId = new ObjectId(job.id)

    const result = await executor.execute(jobId, 'manual')
    expect(result.kind).toBe('acquired')
    if (result.kind === 'acquired') {
      expect(result.status).toBe('failed')
      const run = await runs.findById(result.runId)
      expect(run?.status).toBe('failed')
      expect(run?.errors[0].message).toMatch(/source_file.+not found/)
    }

    // No leftover 'running' doc — the partial unique index is released.
    expect(await runs.findRunning(jobId)).toBeNull()
  })
})
