import { type Db, MongoClient, ObjectId } from 'mongodb'

import { ensureIndexes } from '../src/acore/mongo/indexes'
import { SyncRunRepository } from '../src/domain/sync-run/sync-run.repository'
import { ZERO_COUNTS } from '../src/domain/sync-run/sync-run.schema'
import { StaleRunSweeperService } from '../src/workers/stale-run-sweeper.service'

const TIMEOUT_MS = 60_000 // anything older than 1 minute counts as stale in these tests
const INTERVAL_MS = 60_000 // unused — we call sweepOnce() directly

describe('StaleRunSweeperService (e2e)', () => {
  let client: MongoClient
  let db: Db
  let runs: SyncRunRepository
  let sweeper: StaleRunSweeperService

  beforeAll(async () => {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI must be set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(`stale_sweeper_e2e_${Date.now()}`)
    await ensureIndexes(db)
    runs = new SyncRunRepository(db)
    sweeper = new StaleRunSweeperService(runs, TIMEOUT_MS, INTERVAL_MS)
  }, 30_000)

  afterAll(async () => {
    if (client) {
      sweeper.onApplicationShutdown()
      await client.db(db.databaseName).dropDatabase()
      await client.close()
    }
  })

  beforeEach(async () => {
    await db.collection('sync_runs').deleteMany({})
  })

  async function backdateHeartbeat(id: ObjectId, msAgo: number): Promise<void> {
    await db.collection('sync_runs').updateOne({ _id: id }, { $set: { heartbeatAt: new Date(Date.now() - msAgo) } })
  }

  it('marks a running doc with stale heartbeat as status=stale and appends a heartbeat-timeout error', async () => {
    const run = await runs.insertRunning({ jobConfigId: new ObjectId(), triggeredBy: 'manual', workerId: 'dead-worker' })
    await backdateHeartbeat(run._id, 5 * 60_000)

    const swept = await sweeper.sweepOnce('manual')
    expect(swept).toBe(1)

    const refreshed = await runs.findById(run._id)
    expect(refreshed?.status).toBe('stale')
    expect(refreshed?.finishedAt).toBeDefined()
    expect(refreshed?.errors).toHaveLength(1)
    expect(refreshed?.errors[0].stage).toBe('heartbeat')
    expect(refreshed?.errors[0].message).toBe('heartbeat timeout')
  })

  it('leaves fresh runs alone', async () => {
    await runs.insertRunning({ jobConfigId: new ObjectId(), triggeredBy: 'manual', workerId: 'alive' })
    expect(await sweeper.sweepOnce()).toBe(0)
  })

  it('leaves non-running runs alone even if heartbeat is stale', async () => {
    const run = await runs.insertRunning({ jobConfigId: new ObjectId(), triggeredBy: 'manual', workerId: 'finished' })
    await runs.finalize(run._id, { status: 'success', counts: { ...ZERO_COUNTS }, finishedAt: new Date() })
    await backdateHeartbeat(run._id, 5 * 60_000)

    expect(await sweeper.sweepOnce()).toBe(0)
    const refreshed = await runs.findById(run._id)
    expect(refreshed?.status).toBe('success')
  })

  it('processes multiple stale docs in one sweep', async () => {
    for (let i = 0; i < 3; i++) {
      const run = await runs.insertRunning({ jobConfigId: new ObjectId(), triggeredBy: 'manual', workerId: `dead-${i}` })
      await backdateHeartbeat(run._id, 5 * 60_000)
    }

    expect(await sweeper.sweepOnce()).toBe(3)
    expect(await db.collection('sync_runs').countDocuments({ status: 'stale' })).toBe(3)
  })

  it('after marking stale, the partial unique lock releases so a fresh run can claim the same jobConfigId', async () => {
    const jobConfigId = new ObjectId()
    const oldRun = await runs.insertRunning({ jobConfigId, triggeredBy: 'manual', workerId: 'dead' })
    await backdateHeartbeat(oldRun._id, 5 * 60_000)

    await sweeper.sweepOnce()

    // The stale run is no longer 'running', so a fresh `insertRunning` for the same job must succeed.
    const fresh = await runs.insertRunning({ jobConfigId, triggeredBy: 'schedule', workerId: 'next' })
    expect(fresh._id.equals(oldRun._id)).toBe(false)
    expect(fresh.status).toBe('running')
  })

  it('rejects construction with non-positive timeout or interval', () => {
    expect(() => new StaleRunSweeperService(runs, 0, INTERVAL_MS)).toThrow(/STALE_HEARTBEAT_TIMEOUT_MS/)
    expect(() => new StaleRunSweeperService(runs, TIMEOUT_MS, 0)).toThrow(/STALE_SWEEP_INTERVAL_MS/)
    expect(() => new StaleRunSweeperService(runs, -1, INTERVAL_MS)).toThrow(/STALE_HEARTBEAT_TIMEOUT_MS/)
  })
})
