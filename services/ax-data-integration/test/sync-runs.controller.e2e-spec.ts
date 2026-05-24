import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { type Db, MongoClient, ObjectId } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { ensureIndexes } from '../src/acore/mongo/indexes'
import { JobConfigsService } from '../src/domain/job-config/job-config.service'
import { SyncRunRepository } from '../src/domain/sync-run/sync-run.repository'

interface ListBody {
  items: { id: string; jobConfigId: string; status: string }[]
  total: number
  page: number
  pageSize: number
}
interface DetailBody {
  status: string
  workerId: string
  errors: { stage: string; message: string }[]
}

const API_KEY = 'e2e-test-key'

const baseJob = {
  source: { type: 'rest' as const, config: { baseUrl: 'https://x' } },
  schedule: { cronExpression: '0 0 1 1 *' },
  identity: { strategy: 'primary-key' as const, fields: ['id'] },
  createdBy: 'test',
}

describe('SyncRunsController (e2e)', () => {
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
    await ensureIndexes(db)
  }, 60_000)

  afterAll(async () => {
    if (app) await app.close()
    if (client) await client.close()
  })

  beforeEach(async () => {
    await Promise.all([db.collection('sync_runs').deleteMany({}), db.collection('job_configs').deleteMany({})])
  })

  describe('auth', () => {
    it('GET /sync-runs returns 401 without API key', async () => {
      await request(app.getHttpServer()).get('/sync-runs').expect(401)
    })

    it('GET /sync-runs/:id returns 401 without API key', async () => {
      await request(app.getHttpServer()).get(`/sync-runs/${new ObjectId().toHexString()}`).expect(401)
    })

    it('POST /sync-runs/:id/retry returns 401 without API key', async () => {
      await request(app.getHttpServer()).post(`/sync-runs/${new ObjectId().toHexString()}/retry`).expect(401)
    })
  })

  describe('GET /sync-runs', () => {
    it('returns empty page when no runs exist', async () => {
      const res = await request(app.getHttpServer()).get('/sync-runs').set('x-axios-key', API_KEY).expect(200)
      expect(res.body).toEqual({ items: [], total: 0, page: 1, pageSize: 50 })
    })

    it('filters by jobConfigId and status, sorts newest first', async () => {
      const jobA = new ObjectId()
      const jobB = new ObjectId()

      await runs.insertRunning({ jobConfigId: jobA, triggeredBy: 'manual', workerId: 'w1' })
      // Inserting a second 'running' for the same job would hit the partial-unique index — finalize the first.
      const first = await runs.findRunning(jobA)
      await runs.finalize(first!._id, { status: 'success', counts: first!.counts, finishedAt: new Date() })

      await runs.insertRunning({ jobConfigId: jobA, triggeredBy: 'schedule', workerId: 'w1' })
      const second = await runs.findRunning(jobA)
      await runs.finalize(second!._id, { status: 'failed', counts: second!.counts, finishedAt: new Date() })

      await runs.insertRunning({ jobConfigId: jobB, triggeredBy: 'manual', workerId: 'w2' })

      const all = await request(app.getHttpServer()).get('/sync-runs').set('x-axios-key', API_KEY).expect(200)
      expect((all.body as ListBody).total).toBe(3)

      const filtered = await request(app.getHttpServer())
        .get(`/sync-runs?jobConfigId=${jobA.toHexString()}&status=failed`)
        .set('x-axios-key', API_KEY)
        .expect(200)
      const filteredBody = filtered.body as ListBody
      expect(filteredBody.total).toBe(1)
      expect(filteredBody.items[0].status).toBe('failed')
      expect(filteredBody.items[0].jobConfigId).toBe(jobA.toHexString())
    })

    it('honors page + pageSize and caps pageSize at 200', async () => {
      const job = new ObjectId()
      for (let i = 0; i < 5; i++) {
        await runs.insertRunning({ jobConfigId: job, triggeredBy: 'manual', workerId: `w${i}` })
        const r = await runs.findRunning(job)
        await runs.finalize(r!._id, { status: 'success', counts: r!.counts, finishedAt: new Date() })
      }

      const page1 = (await request(app.getHttpServer()).get('/sync-runs?page=1&pageSize=2').set('x-axios-key', API_KEY).expect(200)).body as ListBody
      expect(page1.items).toHaveLength(2)
      expect(page1.total).toBe(5)
      expect(page1.pageSize).toBe(2)

      const page2 = (await request(app.getHttpServer()).get('/sync-runs?page=2&pageSize=2').set('x-axios-key', API_KEY).expect(200)).body as ListBody
      expect(page2.items).toHaveLength(2)
      expect(page2.items[0].id).not.toBe(page1.items[0].id)

      const capped = (await request(app.getHttpServer()).get('/sync-runs?pageSize=999').set('x-axios-key', API_KEY).expect(200)).body as ListBody
      expect(capped.pageSize).toBe(200)
    })

    it('rejects invalid status with 400', async () => {
      await request(app.getHttpServer()).get('/sync-runs?status=bogus').set('x-axios-key', API_KEY).expect(400)
    })

    it('rejects malformed jobConfigId with 400', async () => {
      await request(app.getHttpServer()).get('/sync-runs?jobConfigId=not-an-id').set('x-axios-key', API_KEY).expect(400)
    })

    it('filters by startedAt range', async () => {
      const job = new ObjectId()
      const old = await runs.insertRunning({ jobConfigId: job, triggeredBy: 'manual', workerId: 'w1' })
      await db.collection('sync_runs').updateOne({ _id: old._id }, { $set: { startedAt: new Date('2025-01-01T00:00:00Z') } })
      await runs.finalize(old._id, { status: 'success', counts: old.counts, finishedAt: new Date() })

      const recent = await runs.insertRunning({ jobConfigId: job, triggeredBy: 'manual', workerId: 'w2' })
      await db.collection('sync_runs').updateOne({ _id: recent._id }, { $set: { startedAt: new Date('2026-06-01T00:00:00Z') } })

      const res = await request(app.getHttpServer()).get('/sync-runs?from=2026-01-01T00:00:00Z').set('x-axios-key', API_KEY).expect(200)
      const body = res.body as ListBody
      expect(body.total).toBe(1)
      expect(body.items[0].id).toBe(recent._id.toHexString())
    })
  })

  describe('GET /sync-runs/:id', () => {
    it('returns 404 for a missing id', async () => {
      await request(app.getHttpServer()).get(`/sync-runs/${new ObjectId().toHexString()}`).set('x-axios-key', API_KEY).expect(404)
    })

    it('returns 400 for a malformed id', async () => {
      await request(app.getHttpServer()).get('/sync-runs/not-an-id').set('x-axios-key', API_KEY).expect(400)
    })

    it('returns the full detail including errors + workerId', async () => {
      const job = new ObjectId()
      const inserted = await runs.insertRunning({ jobConfigId: job, triggeredBy: 'manual', workerId: 'host-abc:1234' })
      await runs.finalize(inserted._id, {
        status: 'failed',
        counts: inserted.counts,
        finishedAt: new Date(),
        errors: [{ stage: 'write', message: 'duplicate key', occurredAt: new Date() }],
      })

      const res = await request(app.getHttpServer()).get(`/sync-runs/${inserted._id.toHexString()}`).set('x-axios-key', API_KEY).expect(200)
      const body = res.body as DetailBody
      expect(body.status).toBe('failed')
      expect(body.workerId).toBe('host-abc:1234')
      expect(body.errors).toHaveLength(1)
      expect(body.errors[0].message).toBe('duplicate key')
    })
  })

  describe('POST /sync-runs/:id/retry', () => {
    it('returns 404 for a missing sync_run', async () => {
      await request(app.getHttpServer()).post(`/sync-runs/${new ObjectId().toHexString()}/retry`).set('x-axios-key', API_KEY).expect(404)
    })

    it('returns 400 when the run is still in flight', async () => {
      const job = await jobConfigs.create({ ...baseJob, name: 'retry-running' })
      const run = await runs.insertRunning({ jobConfigId: new ObjectId(job.id), triggeredBy: 'manual', workerId: 'w' })

      await request(app.getHttpServer()).post(`/sync-runs/${run._id.toHexString()}/retry`).set('x-axios-key', API_KEY).expect(400)
    })

    it('returns 404 when the underlying job_config was deleted', async () => {
      const ghostJob = new ObjectId()
      const orphan = await runs.insertRunning({ jobConfigId: ghostJob, triggeredBy: 'manual', workerId: 'w' })
      await runs.finalize(orphan._id, { status: 'failed', counts: orphan.counts, finishedAt: new Date() })

      await request(app.getHttpServer()).post(`/sync-runs/${orphan._id.toHexString()}/retry`).set('x-axios-key', API_KEY).expect(404)
    })

    it('creates a new run with parentRunId + triggeredBy=retry', async () => {
      const job = await jobConfigs.create({ ...baseJob, name: 'retry-ok' })
      const parent = await runs.insertRunning({ jobConfigId: new ObjectId(job.id), triggeredBy: 'manual', workerId: 'w' })
      await runs.finalize(parent._id, { status: 'failed', counts: parent.counts, finishedAt: new Date() })

      const res = await request(app.getHttpServer()).post(`/sync-runs/${parent._id.toHexString()}/retry`).set('x-axios-key', API_KEY).expect(200)
      const body = res.body as { runId: string; status: string; parentRunId: string }
      expect(typeof body.runId).toBe('string')
      expect(body.runId).not.toBe(parent._id.toHexString())
      expect(body.parentRunId).toBe(parent._id.toHexString())

      const persisted = await runs.findById(new ObjectId(body.runId))
      expect(persisted?.triggeredBy).toBe('retry')
      expect(persisted?.parentRunId?.toHexString()).toBe(parent._id.toHexString())
    })

    it('returns 409 when another run is already in flight for the job', async () => {
      const job = await jobConfigs.create({ ...baseJob, name: 'retry-conflict' })
      const jobId = new ObjectId(job.id)
      const parent = await runs.insertRunning({ jobConfigId: jobId, triggeredBy: 'manual', workerId: 'w' })
      await runs.finalize(parent._id, { status: 'failed', counts: parent.counts, finishedAt: new Date() })
      // Another worker holds the partial-unique 'running' lock.
      await runs.insertRunning({ jobConfigId: jobId, triggeredBy: 'schedule', workerId: 'other:9' })

      await request(app.getHttpServer()).post(`/sync-runs/${parent._id.toHexString()}/retry`).set('x-axios-key', API_KEY).expect(409)
    })
  })
})
