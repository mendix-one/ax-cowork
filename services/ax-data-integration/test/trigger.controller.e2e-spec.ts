import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { type Db, MongoClient, ObjectId } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { ensureIndexes } from '../src/acore/mongo/indexes'
import { JobConfigsService } from '../src/domain/job-config/job-config.service'
import { SyncRunRepository } from '../src/domain/sync-run/sync-run.repository'

const API_KEY = 'e2e-test-key'

const baseJob = {
  source: { type: 'rest' as const, config: { baseUrl: 'https://x' } },
  schedule: { cronExpression: '0 0 1 1 *' },
  identity: { strategy: 'primary-key' as const, fields: ['id'] },
  createdBy: 'test',
}

describe('Job config manual trigger (e2e)', () => {
  let app: INestApplication<App>
  let jobConfigs: JobConfigsService
  let runs: SyncRunRepository
  let client: MongoClient
  let db: Db

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    jobConfigs = app.get(JobConfigsService)
    runs = app.get(SyncRunRepository)

    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
    await ensureIndexes(db) // needed for the partial-unique 'running' lock
  }, 60_000)

  afterAll(async () => {
    if (app) await app.close()
    if (client) await client.close()
  })

  beforeEach(async () => {
    await Promise.all([db.collection('sync_runs').deleteMany({}), db.collection('job_configs').deleteMany({})])
  })

  it('POST /:id/trigger returns 200 with runId + status (graceful failed for unregistered REST adapter)', async () => {
    const job = await jobConfigs.create({ ...baseJob, name: 'manual-ok' })

    const res = await request(app.getHttpServer()).post(`/job-configs/${job.id}/trigger`).set('x-axios-key', API_KEY).expect(200)

    const body = res.body as { runId: string; status: string }
    expect(typeof body.runId).toBe('string')
    // No REST adapter is registered in phase 1 → executor catches the setup error and finalizes 'failed'.
    expect(body.status).toBe('failed')

    const persisted = await runs.findById(new ObjectId(body.runId))
    expect(persisted?.status).toBe('failed')
    expect(persisted?.triggeredBy).toBe('manual')
  })

  it('POST /:id/trigger returns 404 for a missing job_config id', async () => {
    await request(app.getHttpServer()).post(`/job-configs/${new ObjectId().toHexString()}/trigger`).set('x-axios-key', API_KEY).expect(404)
  })

  it('POST /:id/trigger returns 400 for a malformed id', async () => {
    await request(app.getHttpServer()).post('/job-configs/not-an-id/trigger').set('x-axios-key', API_KEY).expect(400)
  })

  it('POST /:id/trigger returns 409 when another sync_run is already in flight', async () => {
    const job = await jobConfigs.create({ ...baseJob, name: 'manual-conflict' })
    const jobId = new ObjectId(job.id)

    // Simulate a concurrent worker holding the partial-unique 'running' lock.
    await runs.insertRunning({ jobConfigId: jobId, triggeredBy: 'schedule', workerId: 'other-host:9999' })

    await request(app.getHttpServer()).post(`/job-configs/${job.id}/trigger`).set('x-axios-key', API_KEY).expect(409)
  })

  it('POST /:id/trigger requires the axios key (401 without)', async () => {
    const job = await jobConfigs.create({ ...baseJob, name: 'manual-401' })
    await request(app.getHttpServer()).post(`/job-configs/${job.id}/trigger`).expect(401)
  })
})
