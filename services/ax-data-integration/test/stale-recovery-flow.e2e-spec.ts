import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { type Db, MongoClient, ObjectId } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { ensureIndexes } from '../src/acore/mongo/indexes'
import { JobConfigsService } from '../src/domain/job-config/job-config.service'
import { SyncRunRepository } from '../src/domain/sync-run/sync-run.repository'
import { StaleRunSweeperService } from '../src/workers/stale-run-sweeper.service'

const API_KEY = 'e2e-test-key'

interface TriggerResp {
  runId: string
  status: string
}

/**
 * "Worker dies mid-run → restart → stale sweeper recovers" scenario, end-to-end via the
 * MainModule + HTTP layer.
 *
 * "Killing" a real Node process from a Jest worker is not feasible (and forking a child
 * would make the test flaky). Instead we *simulate* a dead worker by inserting a fake
 * `running` sync_run with a backdated `heartbeatAt`, which is exactly the state a crashed
 * worker would leave behind. The recovery path under test is identical: the sweeper sees
 * the stale heartbeat, flips status → `stale`, and the partial-unique `(jobConfigId, status='running')`
 * index releases so a fresh trigger can claim a new run.
 */
describe('Stale-worker recovery flow (T-J04)', () => {
  let app: INestApplication<App>
  let jobConfigs: JobConfigsService
  let runs: SyncRunRepository
  let sweeper: StaleRunSweeperService
  let client: MongoClient
  let db: Db

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    jobConfigs = app.get(JobConfigsService)
    runs = app.get(SyncRunRepository)
    sweeper = app.get(StaleRunSweeperService)

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
    await Promise.all([db.collection('sync_runs').deleteMany({}), db.collection('job_configs').deleteMany({})])
  })

  async function backdateHeartbeat(id: ObjectId, msAgo: number): Promise<void> {
    await db.collection('sync_runs').updateOne({ _id: id }, { $set: { heartbeatAt: new Date(Date.now() - msAgo) } })
  }

  it('trigger is blocked while a stale running doc holds the lock, succeeds after one sweep', async () => {
    // 1. Set up a real job_config (we'll trigger it via the HTTP endpoint).
    const job = await jobConfigs.create({
      name: 'stale-recovery-flow',
      source: { type: 'rest', config: { baseUrl: 'https://x' } },
      schedule: { cronExpression: '0 0 1 1 *' },
      identity: { strategy: 'primary-key', fields: ['id'] },
      createdBy: 'test',
    })
    const jobId = new ObjectId(job.id)

    // 2. Simulate a dead worker: insert a `running` doc, then push its heartbeat far enough
    //    into the past that the sweeper's threshold will fire on it.
    const ghost = await runs.insertRunning({ jobConfigId: jobId, triggeredBy: 'manual', workerId: 'dead-worker:1' })
    await backdateHeartbeat(ghost._id, 10 * 60_000) // 10 min ago — well past the 120s default

    // 3. The fresh worker's trigger attempt fails with 409 — the partial-unique lock is still
    //    held by the stale doc. This is the "restart but sweeper hasn't run yet" window.
    await request(app.getHttpServer()).post(`/job-configs/${job.id}/trigger`).set('x-api-key', API_KEY).expect(409)

    // 4. Sweeper tick: same service the scheduler invokes on the cron interval. Tagging the
    //    sweep label 'manual' surfaces nicely in logs for debug.
    const swept = await sweeper.sweepOnce('manual')
    expect(swept).toBe(1)

    // 5. Stale doc was finalized correctly — status=stale + finishedAt + heartbeat-timeout error.
    const refreshedGhost = await runs.findById(ghost._id)
    expect(refreshedGhost?.status).toBe('stale')
    expect(refreshedGhost?.finishedAt).toBeDefined()
    expect(refreshedGhost?.errors).toHaveLength(1)
    expect(refreshedGhost?.errors[0].stage).toBe('heartbeat')

    // 6. Lock released → a fresh trigger now succeeds (the no-REST-adapter path means the run
    //    finalizes as 'failed' for the same harmless reason as the other trigger e2e tests).
    const trigger = (await request(app.getHttpServer()).post(`/job-configs/${job.id}/trigger`).set('x-api-key', API_KEY).expect(200)).body as TriggerResp
    expect(trigger.runId).not.toBe(ghost._id.toHexString())

    // 7. Two sync_runs exist for the same job: the old stale one + the fresh one.
    const total = await db.collection('sync_runs').countDocuments({ jobConfigId: jobId })
    expect(total).toBe(2)
  })

  it('fresh runs that have not yet missed a heartbeat are left alone (no false positives)', async () => {
    const job = await jobConfigs.create({
      name: 'fresh-run-untouched',
      source: { type: 'rest', config: { baseUrl: 'https://x' } },
      schedule: { cronExpression: '0 0 1 1 *' },
      identity: { strategy: 'primary-key', fields: ['id'] },
      createdBy: 'test',
    })
    const fresh = await runs.insertRunning({ jobConfigId: new ObjectId(job.id), triggeredBy: 'manual', workerId: 'alive' })
    // No backdate — heartbeatAt is `now`.

    const swept = await sweeper.sweepOnce()
    expect(swept).toBe(0)

    const refreshed = await runs.findById(fresh._id)
    expect(refreshed?.status).toBe('running')
  })

  it('SyncRuns list reflects the recovered state — old run is "stale", new one is "failed" (no adapter)', async () => {
    const job = await jobConfigs.create({
      name: 'visible-via-list',
      source: { type: 'rest', config: { baseUrl: 'https://x' } },
      schedule: { cronExpression: '0 0 1 1 *' },
      identity: { strategy: 'primary-key', fields: ['id'] },
      createdBy: 'test',
    })
    const jobId = new ObjectId(job.id)

    const ghost = await runs.insertRunning({ jobConfigId: jobId, triggeredBy: 'schedule', workerId: 'dead:2' })
    await backdateHeartbeat(ghost._id, 10 * 60_000)
    await sweeper.sweepOnce()
    await request(app.getHttpServer()).post(`/job-configs/${job.id}/trigger`).set('x-api-key', API_KEY).expect(200)

    interface ListBody {
      items: { id: string; status: string; triggeredBy: string; workerId?: string }[]
      total: number
    }
    const list = (await request(app.getHttpServer()).get(`/sync-runs?jobConfigId=${job.id}`).set('x-api-key', API_KEY).expect(200)).body as ListBody
    expect(list.total).toBe(2)
    const statuses = list.items.map((i) => i.status).sort()
    expect(statuses).toEqual(['failed', 'stale'])
    // The fresh run carries the live workerId (`hostname:pid`); the stale one carries 'dead:2'.
    const staleItem = list.items.find((i) => i.status === 'stale')
    expect(staleItem?.id).toBe(ghost._id.toHexString())
  })
})
