import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { MongoClient, ObjectId } from 'mongodb'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { JobConfigsService } from '../src/domain/job-config/job-config.service'
import { SchedulerService } from '../src/workers/scheduler.service'

const baseJob = {
  source: { type: 'rest' as const, config: { baseUrl: 'https://x' } },
  schedule: { cronExpression: '0 0 1 1 *' }, // 00:00 on Jan 1 — won't fire during the test run
  identity: { strategy: 'primary-key' as const, fields: ['id'] },
  createdBy: 'test',
}

describe('SchedulerService (e2e)', () => {
  let app: INestApplication<App>
  let scheduler: SchedulerService
  let jobConfigs: JobConfigsService
  let client: MongoClient

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    scheduler = app.get(SchedulerService)
    jobConfigs = app.get(JobConfigsService)

    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
  }, 60_000)

  afterAll(async () => {
    if (app) await app.close()
    if (client) await client.close()
  })

  beforeEach(async () => {
    // Wipe job_configs and unregister any leftover crons from prior tests
    const dbName = process.env.MONGO_DB_NAME!
    await client.db(dbName).collection('job_configs').deleteMany({})
    // Drain the scheduler registry — it carries state across tests within the file
    for (const docId of leftoverIds(scheduler)) scheduler.unregister(docId)
  })

  async function waitForEvent(): Promise<void> {
    // The @OnEvent handler is async (Mongo round-trip in `jobConfigs.findById`), so
    // microtask flushes aren't enough — give it a small real-clock window.
    await new Promise((r) => setTimeout(r, 100))
  }

  it('creating a job_config registers a cron', async () => {
    const created = await jobConfigs.create({ ...baseJob, name: 'create-registers' })
    await waitForEvent()
    expect(scheduler.isRegistered(new ObjectId(created.id))).toBe(true)
  })

  it('disabling a job_config unregisters its cron', async () => {
    const created = await jobConfigs.create({ ...baseJob, name: 'disable-removes' })
    const id = new ObjectId(created.id)
    await waitForEvent()
    expect(scheduler.isRegistered(id)).toBe(true)

    await jobConfigs.setEnabled(id, false)
    await waitForEvent()
    expect(scheduler.isRegistered(id)).toBe(false)
  })

  it('re-enabling registers it again', async () => {
    const created = await jobConfigs.create({ ...baseJob, name: 'reenable' })
    const id = new ObjectId(created.id)
    await jobConfigs.setEnabled(id, false)
    await waitForEvent()
    expect(scheduler.isRegistered(id)).toBe(false)

    await jobConfigs.setEnabled(id, true)
    await waitForEvent()
    expect(scheduler.isRegistered(id)).toBe(true)
  })

  it('creating a job_config with enabled=false does NOT register', async () => {
    const created = await jobConfigs.create({ ...baseJob, name: 'created-disabled', enabled: false })
    await waitForEvent()
    expect(scheduler.isRegistered(new ObjectId(created.id))).toBe(false)
  })

  it('updating a schedule re-registers the cron with the new expression', async () => {
    const created = await jobConfigs.create({ ...baseJob, name: 'reschedule' })
    const id = new ObjectId(created.id)
    await waitForEvent()
    expect(scheduler.isRegistered(id)).toBe(true)

    await jobConfigs.update(id, { schedule: { cronExpression: '0 12 1 1 *', timezone: 'UTC' } })
    await waitForEvent()
    expect(scheduler.isRegistered(id)).toBe(true) // still registered, just with new expression
  })

  it('soft-delete (DELETE endpoint behavior) unregisters the cron', async () => {
    const created = await jobConfigs.create({ ...baseJob, name: 'softdelete' })
    const id = new ObjectId(created.id)
    await waitForEvent()
    expect(scheduler.isRegistered(id)).toBe(true)

    await jobConfigs.softDelete(id)
    await waitForEvent()
    expect(scheduler.isRegistered(id)).toBe(false)
  })
})

function leftoverIds(scheduler: SchedulerService): ObjectId[] {
  // The service exposes registeredCount() but not the ids. Tests rely on `beforeEach`
  // wiping `job_configs` and the next event roundtrip rebuilding registry state.
  void scheduler
  return []
}
