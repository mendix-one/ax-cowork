import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { type Db, MongoClient, ObjectId } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { SourceMetadataRepository } from '../src/domain/source-metadata/source-metadata.repository'

const API_KEY = 'e2e-test-key'

interface ListBody {
  items: { id: string; schemaHash: string; fieldCount: number }[]
  total: number
  page: number
  pageSize: number
}
interface DetailBody {
  id: string
  schemaHash: string
  fieldCount: number
  schema: { fields: { name: string; type: string; nullable: boolean }[]; raw: Record<string, unknown> }
}

describe('SourceMetadataController (e2e)', () => {
  let app: INestApplication<App>
  let metadata: SourceMetadataRepository
  let client: MongoClient
  let db: Db

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    metadata = app.get(SourceMetadataRepository)

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
    await db.collection('source_metadata').deleteMany({})
  })

  async function seed(args: {
    jobConfigId: ObjectId
    syncRunId?: ObjectId
    schemaHash?: string
    fieldNames?: string[]
    detectedAt?: Date
  }): Promise<ObjectId | null> {
    const now = args.detectedAt ?? new Date()
    return metadata.insertIfNew({
      jobConfigId: args.jobConfigId,
      syncRunId: args.syncRunId ?? new ObjectId(),
      schemaHash: args.schemaHash ?? `hash-${Math.random().toString(16).slice(2)}`,
      schema: {
        fields: (args.fieldNames ?? ['id', 'name']).map((n) => ({ name: n, type: 'string', nullable: false })),
        raw: { sampleSize: 10 },
      },
      detectedAt: now,
      createdAt: now,
    })
  }

  describe('auth', () => {
    it('GET /source-metadata returns 401 without API key', async () => {
      await request(app.getHttpServer()).get(`/source-metadata?jobConfigId=${new ObjectId().toHexString()}`).expect(401)
    })

    it('GET /source-metadata/latest returns 401 without API key', async () => {
      await request(app.getHttpServer()).get(`/source-metadata/latest?jobConfigId=${new ObjectId().toHexString()}`).expect(401)
    })

    it('GET /source-metadata/:id returns 401 without API key', async () => {
      await request(app.getHttpServer()).get(`/source-metadata/${new ObjectId().toHexString()}`).expect(401)
    })
  })

  describe('GET /source-metadata', () => {
    it('returns 400 when jobConfigId is missing', async () => {
      await request(app.getHttpServer()).get('/source-metadata').set('x-api-key', API_KEY).expect(400)
    })

    it('returns 400 when jobConfigId is malformed', async () => {
      await request(app.getHttpServer()).get('/source-metadata?jobConfigId=bogus').set('x-api-key', API_KEY).expect(400)
    })

    it('returns empty page when no snapshots exist', async () => {
      const res = await request(app.getHttpServer()).get(`/source-metadata?jobConfigId=${new ObjectId().toHexString()}`).set('x-api-key', API_KEY).expect(200)
      expect(res.body).toEqual({ items: [], total: 0, page: 1, pageSize: 50 })
    })

    it('scopes results to the requested jobConfigId', async () => {
      const jobA = new ObjectId()
      const jobB = new ObjectId()
      await seed({ jobConfigId: jobA, schemaHash: 'aaa', fieldNames: ['id'] })
      await seed({ jobConfigId: jobB, schemaHash: 'bbb', fieldNames: ['name'] })

      const res = (await request(app.getHttpServer()).get(`/source-metadata?jobConfigId=${jobA.toHexString()}`).set('x-api-key', API_KEY).expect(200))
        .body as ListBody
      expect(res.total).toBe(1)
      expect(res.items[0].schemaHash).toBe('aaa')
    })

    it('filters by schemaHash exact match', async () => {
      const job = new ObjectId()
      await seed({ jobConfigId: job, schemaHash: 'abc-123', fieldNames: ['id'] })
      await seed({ jobConfigId: job, schemaHash: 'xyz-789', fieldNames: ['id', 'name'] })

      const res = (
        await request(app.getHttpServer()).get(`/source-metadata?jobConfigId=${job.toHexString()}&schemaHash=xyz-789`).set('x-api-key', API_KEY).expect(200)
      ).body as ListBody
      expect(res.total).toBe(1)
      expect(res.items[0].fieldCount).toBe(2)
    })

    it('sorts newest detected first and exposes fieldCount but not full schema', async () => {
      const job = new ObjectId()
      const older = new Date('2026-01-01T00:00:00Z')
      const newer = new Date('2026-06-01T00:00:00Z')
      await seed({ jobConfigId: job, schemaHash: 'older', detectedAt: older, fieldNames: ['a'] })
      await seed({ jobConfigId: job, schemaHash: 'newer', detectedAt: newer, fieldNames: ['a', 'b', 'c'] })

      const res = (await request(app.getHttpServer()).get(`/source-metadata?jobConfigId=${job.toHexString()}`).set('x-api-key', API_KEY).expect(200))
        .body as ListBody
      expect(res.items[0].schemaHash).toBe('newer')
      expect(res.items[0].fieldCount).toBe(3)
      expect(res.items[0]).not.toHaveProperty('schema')
    })

    it('caps pageSize at 200', async () => {
      const res = (
        await request(app.getHttpServer())
          .get(`/source-metadata?jobConfigId=${new ObjectId().toHexString()}&pageSize=999`)
          .set('x-api-key', API_KEY)
          .expect(200)
      ).body as ListBody
      expect(res.pageSize).toBe(200)
    })
  })

  describe('GET /source-metadata/latest', () => {
    it('returns 400 when jobConfigId is missing', async () => {
      await request(app.getHttpServer()).get('/source-metadata/latest').set('x-api-key', API_KEY).expect(400)
    })

    it('returns 404 when no snapshot exists', async () => {
      await request(app.getHttpServer()).get(`/source-metadata/latest?jobConfigId=${new ObjectId().toHexString()}`).set('x-api-key', API_KEY).expect(404)
    })

    it('returns the most-recent snapshot with full schema', async () => {
      const job = new ObjectId()
      await seed({ jobConfigId: job, schemaHash: 'older', detectedAt: new Date('2026-01-01T00:00:00Z'), fieldNames: ['a'] })
      await seed({ jobConfigId: job, schemaHash: 'newer', detectedAt: new Date('2026-06-01T00:00:00Z'), fieldNames: ['a', 'b', 'c'] })

      const res = await request(app.getHttpServer()).get(`/source-metadata/latest?jobConfigId=${job.toHexString()}`).set('x-api-key', API_KEY).expect(200)
      const body = res.body as DetailBody
      expect(body.schemaHash).toBe('newer')
      expect(body.fieldCount).toBe(3)
      expect(body.schema.fields).toHaveLength(3)
    })
  })

  describe('GET /source-metadata/:id', () => {
    it('returns 404 for a missing id', async () => {
      await request(app.getHttpServer()).get(`/source-metadata/${new ObjectId().toHexString()}`).set('x-api-key', API_KEY).expect(404)
    })

    it('returns 400 for a malformed id', async () => {
      await request(app.getHttpServer()).get('/source-metadata/not-an-id').set('x-api-key', API_KEY).expect(400)
    })

    it('returns the full detail including schema fields + raw', async () => {
      const job = new ObjectId()
      const id = await seed({ jobConfigId: job, schemaHash: 'h1', fieldNames: ['id', 'name', 'created_at'] })
      expect(id).not.toBeNull()

      const res = await request(app.getHttpServer()).get(`/source-metadata/${id!.toHexString()}`).set('x-api-key', API_KEY).expect(200)
      const body = res.body as DetailBody
      expect(body.id).toBe(id!.toHexString())
      expect(body.schema.fields.map((f) => f.name)).toEqual(['id', 'name', 'created_at'])
      expect(body.schema.raw).toEqual({ sampleSize: 10 })
    })
  })
})
