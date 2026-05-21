import { type Db, MongoClient, ObjectId } from 'mongodb'

import { GridfsService } from '../src/acore/mongo'
import { ensureIndexes } from '../src/acore/mongo/indexes'
import { SourceAdapterRegistry } from '../src/adapters'
import { JobConfigRepository } from '../src/domain/job-config/job-config.repository'
import { JobConfigsService } from '../src/domain/job-config/job-config.service'
import { RawRecordChangelogRepository } from '../src/domain/raw-record-changelog/raw-record-changelog.repository'
import { RawRecordRepository } from '../src/domain/raw-record/raw-record.repository'
import { SecretsService } from '../src/domain/secret/secret.service'
import { SourceFileRepository } from '../src/domain/source-file/source-file.repository'
import { SourceMetadataRepository } from '../src/domain/source-metadata/source-metadata.repository'
import { SyncRunRepository } from '../src/domain/sync-run/sync-run.repository'
import { ZERO_COUNTS } from '../src/domain/sync-run/sync-run.schema'
import { ConcurrencyService } from '../src/workers/concurrency.service'
import { SyncExecutorService, type SyncRunWorkResult } from '../src/workers/sync-executor.service'

const DEFAULT_HEARTBEAT_MS = 30_000

const baseJob = {
  source: { type: 'rest' as const, config: { baseUrl: 'https://x' } },
  schedule: { cronExpression: '0 * * * *' },
  identity: { strategy: 'primary-key' as const, fields: ['id'] },
  createdBy: 'test',
}

// Tests in this file isolate the claim + heartbeat behavior from the real main loop.
// The TestExecutor subclass replaces `executeRun` with a no-op or controllable delay so
// constructor deps unrelated to claim/heartbeat (adapter registry, GridFS, etc.) can be
// safely passed as `null`.
class TestExecutor extends SyncExecutorService {
  constructor(
    concurrency: ConcurrencyService,
    runs: SyncRunRepository,
    db: Db,
    heartbeatMs: number,
    private readonly workDelayMs = 0,
  ) {
    super(
      concurrency,
      runs,
      new JobConfigRepository(db),
      new RawRecordRepository(db),
      new SourceMetadataRepository(db),
      new SourceFileRepository(db),
      null as unknown as GridfsService,
      null as unknown as SecretsService,
      null as unknown as SourceAdapterRegistry,
      new RawRecordChangelogRepository(db),
      heartbeatMs,
      100,
      100,
    )
  }

  protected executeRun(): Promise<SyncRunWorkResult> {
    if (this.workDelayMs === 0) return Promise.resolve({ counts: { ...ZERO_COUNTS } })
    return new Promise((resolve) => setTimeout(() => resolve({ counts: { ...ZERO_COUNTS } }), this.workDelayMs))
  }
}

describe('SyncExecutorService (e2e — claim + heartbeat)', () => {
  let client: MongoClient
  let db: Db
  let jobConfigs: JobConfigsService
  let runs: SyncRunRepository
  let executor: SyncExecutorService
  let concurrency: ConcurrencyService

  beforeAll(async () => {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI must be set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(`sync_executor_claim_e2e_${Date.now()}`)
    await ensureIndexes(db)

    jobConfigs = new JobConfigsService(new JobConfigRepository(db))
    runs = new SyncRunRepository(db)
    concurrency = new ConcurrencyService(5)
    executor = new TestExecutor(concurrency, runs, db, DEFAULT_HEARTBEAT_MS)
  }, 30_000)

  afterAll(async () => {
    if (client) {
      await client.db(db.databaseName).dropDatabase()
      await client.close()
    }
  })

  beforeEach(async () => {
    await Promise.all([db.collection('sync_runs').deleteMany({}), db.collection('job_configs').deleteMany({})])
  })

  async function createJob(name: string): Promise<ObjectId> {
    const summary = await jobConfigs.create({ ...baseJob, name })
    return new ObjectId(summary.id)
  }

  it('happy path: execute() inserts one sync_run with status=success and zero counts', async () => {
    const jobId = await createJob('happy')
    const result = await executor.execute(jobId, 'manual')
    expect(result.kind).toBe('acquired')

    if (result.kind === 'acquired') {
      const doc = await runs.findById(result.runId)
      expect(doc?.status).toBe('success')
      expect(doc?.counts).toEqual({ read: 0, inserted: 0, updated: 0, unchanged: 0, deleted: 0, errors: 0 })
      expect(doc?.finishedAt).toBeDefined()
      expect(doc?.triggeredBy).toBe('manual')
      expect(doc?.workerId).toMatch(/.+:\d+/)
    }
  })

  it('two concurrent execute() calls → 1 acquired + 1 skipped-inmem; exactly 1 sync_run persists', async () => {
    const jobId = await createJob('concurrent')
    const [a, b] = await Promise.all([executor.execute(jobId, 'manual'), executor.execute(jobId, 'manual')])
    const kinds = [a.kind, b.kind].sort()
    expect(kinds).toEqual(['acquired', 'skipped-inmem'])

    const count = await runs.countByJobConfig(jobId)
    expect(count).toBe(1)
  })

  it('execute() with another worker already in status=running → skipped-db (partial unique index)', async () => {
    const jobId = await createJob('preinserted')
    await runs.insertRunning({ jobConfigId: jobId, triggeredBy: 'schedule', workerId: 'other-host:9999' })

    const result = await executor.execute(jobId, 'manual')
    expect(result.kind).toBe('skipped-db')

    const total = await runs.countByJobConfig(jobId)
    expect(total).toBe(1)
  })

  it('different jobConfigIds are independent — both succeed concurrently', async () => {
    const jobA = await createJob('parallel-a')
    const jobB = await createJob('parallel-b')

    const [a, b] = await Promise.all([executor.execute(jobA, 'manual'), executor.execute(jobB, 'manual')])
    expect(a.kind).toBe('acquired')
    expect(b.kind).toBe('acquired')
    expect(await runs.countByJobConfig(jobA)).toBe(1)
    expect(await runs.countByJobConfig(jobB)).toBe(1)
  })

  it('after a successful execute, a subsequent execute can claim again', async () => {
    const jobId = await createJob('repeat')
    await executor.execute(jobId, 'manual')
    await executor.execute(jobId, 'manual')

    const count = await runs.countByJobConfig(jobId)
    expect(count).toBe(2)
  })

  describe('heartbeat (T-E03)', () => {
    it('updates heartbeatAt while the work is in flight', async () => {
      const jobId = await createJob('with-heartbeat')
      const slow = new TestExecutor(new ConcurrencyService(5), runs, db, 25, 200)

      const result = await slow.execute(jobId, 'manual')
      expect(result.kind).toBe('acquired')

      if (result.kind === 'acquired') {
        const doc = await runs.findById(result.runId)
        expect(doc).toBeDefined()
        expect(doc!.heartbeatAt.getTime()).toBeGreaterThan(doc!.startedAt.getTime())
      }
    })

    it('clears the interval after execute finishes (no leaked timer keeps the process alive)', async () => {
      const jobId = await createJob('no-leak')
      const slow = new TestExecutor(new ConcurrencyService(5), runs, db, 25, 60)

      const before = countActiveHandles()
      const result = await slow.execute(jobId, 'manual')
      expect(result.kind).toBe('acquired')

      await new Promise((r) => setImmediate(r))
      const after = countActiveHandles()
      expect(after).toBeLessThanOrEqual(before)
    })

    it('rejects construction with a non-positive heartbeat interval', () => {
      const c = new ConcurrencyService(5)
      expect(() => new TestExecutor(c, runs, db, 0)).toThrow(/positive number/)
      expect(() => new TestExecutor(c, runs, db, -1)).toThrow(/positive number/)
      expect(() => new TestExecutor(c, runs, db, Number.NaN)).toThrow(/positive number/)
    })
  })
})

/** Best-effort count of active handles (timers + sockets). Used to assert no timer leaks. */
function countActiveHandles(): number {
  const fn = (process as unknown as { _getActiveHandles?: () => unknown[] })._getActiveHandles
  if (typeof fn !== 'function') return 0
  const handles = fn.call(process) as unknown as unknown[]
  return handles.length
}
