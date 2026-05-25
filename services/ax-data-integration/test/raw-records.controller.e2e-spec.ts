import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { type Db, MongoClient, ObjectId } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { RawRecordRepository } from '../src/domain/raw-record/raw-record.repository'
import type { RawRecordInsert } from '../src/domain/raw-record/raw-record.schema'

const API_KEY = 'e2e-test-key'

interface ListBody {
  items: { id: string; recordKey: string; status: string; payloadHash: string }[]
  total: number
  page: number
  pageSize: number
}
interface DetailBody {
  id: string
  recordKey: string
  payload: Record<string, unknown>
  version: number
  status: string
}

describe('RawRecordController (e2e)', () => {
  let app: INestApplication<App>
  let rawRecords: RawRecordRepository
  let client: MongoClient
  let db: Db

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    rawRecords = app.get(RawRecordRepository)

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
    await db.collection('raw_records').deleteMany({})
  })

  // Helper to insert a row through the repo with sensible defaults the tests can override.
  async function seed(
    overrides: Partial<RawRecordInsert> & { jobConfigId: ObjectId; recordKey: string; firstSeenRunId: ObjectId; lastUpdatedRunId: ObjectId },
  ): Promise<ObjectId> {
    const now = new Date()
    const doc = await rawRecords.insertNew({
      payloadHash: 'h',
      payload: { x: 1 },
      status: 'active',
      version: 1,
      firstSeenAt: now,
      lastSeenAt: now,
      createdAt: now,
      ...overrides,
    })
    return doc._id
  }

  describe('auth', () => {
    it('GET /raw-records returns 401 without API key', async () => {
      await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${new ObjectId().toHexString()}`).expect(401)
    })

    it('GET /raw-records/:id returns 401 without API key', async () => {
      await request(app.getHttpServer()).get(`/raw-records/${new ObjectId().toHexString()}`).expect(401)
    })
  })

  describe('GET /raw-records', () => {
    it('returns 400 when jobConfigId is missing', async () => {
      await request(app.getHttpServer()).get('/raw-records').set('x-api-key', API_KEY).expect(400)
    })

    it('returns 400 when jobConfigId is malformed', async () => {
      await request(app.getHttpServer()).get('/raw-records?jobConfigId=bogus').set('x-api-key', API_KEY).expect(400)
    })

    it('returns 400 for an invalid status enum', async () => {
      await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${new ObjectId().toHexString()}&status=archived`).set('x-api-key', API_KEY).expect(400)
    })

    it('returns empty page when no records match', async () => {
      const res = await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${new ObjectId().toHexString()}`).set('x-api-key', API_KEY).expect(200)
      expect(res.body).toEqual({ items: [], total: 0, page: 1, pageSize: 50 })
    })

    it('filters by jobConfigId scope (does not leak across configs)', async () => {
      const jobA = new ObjectId()
      const jobB = new ObjectId()
      const run = new ObjectId()
      await seed({ jobConfigId: jobA, recordKey: 'a-1', firstSeenRunId: run, lastUpdatedRunId: run })
      await seed({ jobConfigId: jobB, recordKey: 'b-1', firstSeenRunId: run, lastUpdatedRunId: run })

      const res = await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${jobA.toHexString()}`).set('x-api-key', API_KEY).expect(200)
      const body = res.body as ListBody
      expect(body.total).toBe(1)
      expect(body.items[0].recordKey).toBe('a-1')
    })

    it('filters by status', async () => {
      const job = new ObjectId()
      const run = new ObjectId()
      await seed({ jobConfigId: job, recordKey: 'k-1', firstSeenRunId: run, lastUpdatedRunId: run, status: 'active' })
      await seed({ jobConfigId: job, recordKey: 'k-2', firstSeenRunId: run, lastUpdatedRunId: run, status: 'deleted', deletedInRunId: run })

      const deleted = (
        await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${job.toHexString()}&status=deleted`).set('x-api-key', API_KEY).expect(200)
      ).body as ListBody
      expect(deleted.total).toBe(1)
      expect(deleted.items[0].recordKey).toBe('k-2')
    })

    it('filters by recordKey (exact match)', async () => {
      const job = new ObjectId()
      const run = new ObjectId()
      await seed({ jobConfigId: job, recordKey: 'alpha', firstSeenRunId: run, lastUpdatedRunId: run })
      await seed({ jobConfigId: job, recordKey: 'beta', firstSeenRunId: run, lastUpdatedRunId: run })

      const res = (
        await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${job.toHexString()}&recordKey=alpha`).set('x-api-key', API_KEY).expect(200)
      ).body as ListBody
      expect(res.total).toBe(1)
      expect(res.items[0].recordKey).toBe('alpha')
    })

    it('filters by runId — matches records first-seen, last-updated, or deleted in that run', async () => {
      const job = new ObjectId()
      const runA = new ObjectId()
      const runB = new ObjectId()
      const runC = new ObjectId()
      // firstSeenRunId == runA
      await seed({ jobConfigId: job, recordKey: 'first-a', firstSeenRunId: runA, lastUpdatedRunId: runC })
      // lastUpdatedRunId == runA
      await seed({ jobConfigId: job, recordKey: 'update-a', firstSeenRunId: runC, lastUpdatedRunId: runA })
      // deletedInRunId == runA
      await seed({ jobConfigId: job, recordKey: 'delete-a', firstSeenRunId: runC, lastUpdatedRunId: runC, status: 'deleted', deletedInRunId: runA })
      // Unrelated run — should be filtered out
      await seed({ jobConfigId: job, recordKey: 'other-b', firstSeenRunId: runB, lastUpdatedRunId: runB })

      const res = (
        await request(app.getHttpServer())
          .get(`/raw-records?jobConfigId=${job.toHexString()}&runId=${runA.toHexString()}`)
          .set('x-api-key', API_KEY)
          .expect(200)
      ).body as ListBody
      expect(res.total).toBe(3)
      expect(res.items.map((i) => i.recordKey).sort()).toEqual(['delete-a', 'first-a', 'update-a'])
    })

    it('honors page + pageSize and caps pageSize at 200', async () => {
      const job = new ObjectId()
      const run = new ObjectId()
      for (let i = 0; i < 5; i++) {
        await seed({ jobConfigId: job, recordKey: `k-${i}`, firstSeenRunId: run, lastUpdatedRunId: run })
      }

      const page1 = (
        await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${job.toHexString()}&page=1&pageSize=2`).set('x-api-key', API_KEY).expect(200)
      ).body as ListBody
      expect(page1.items).toHaveLength(2)
      expect(page1.total).toBe(5)
      expect(page1.pageSize).toBe(2)

      const capped = (
        await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${job.toHexString()}&pageSize=999`).set('x-api-key', API_KEY).expect(200)
      ).body as ListBody
      expect(capped.pageSize).toBe(200)
    })

    it('omits payload from list response to keep it light', async () => {
      const job = new ObjectId()
      const run = new ObjectId()
      await seed({ jobConfigId: job, recordKey: 'k-1', firstSeenRunId: run, lastUpdatedRunId: run, payload: { huge: 'x'.repeat(100) } })
      const res = (await request(app.getHttpServer()).get(`/raw-records?jobConfigId=${job.toHexString()}`).set('x-api-key', API_KEY).expect(200))
        .body as ListBody
      expect(res.items[0]).not.toHaveProperty('payload')
    })
  })

  describe('GET /raw-records/:id', () => {
    it('returns 404 for a missing id', async () => {
      await request(app.getHttpServer()).get(`/raw-records/${new ObjectId().toHexString()}`).set('x-api-key', API_KEY).expect(404)
    })

    it('returns 400 for a malformed id', async () => {
      await request(app.getHttpServer()).get('/raw-records/not-an-id').set('x-api-key', API_KEY).expect(400)
    })

    it('returns the full detail including payload', async () => {
      const job = new ObjectId()
      const run = new ObjectId()
      const id = await seed({
        jobConfigId: job,
        recordKey: 'k-1',
        firstSeenRunId: run,
        lastUpdatedRunId: run,
        payload: { name: 'Alice', balance: 42 },
        version: 3,
      })

      const res = await request(app.getHttpServer()).get(`/raw-records/${id.toHexString()}`).set('x-api-key', API_KEY).expect(200)
      const body = res.body as DetailBody
      expect(body.id).toBe(id.toHexString())
      expect(body.recordKey).toBe('k-1')
      expect(body.version).toBe(3)
      expect(body.payload).toEqual({ name: 'Alice', balance: 42 })
    })
  })
})
