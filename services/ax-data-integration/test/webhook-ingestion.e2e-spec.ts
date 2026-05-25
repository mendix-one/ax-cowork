import { ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { MongoClient, ObjectId, type Db } from 'mongodb'
import request from 'supertest'

import { JOB_CONFIGS_COLLECTION } from '../src/domain/job-config'
import { RAW_RECORDS_COLLECTION } from '../src/domain/raw-record'
import { RAW_RECORD_CHANGELOG_COLLECTION } from '../src/domain/raw-record-changelog'
import { SOURCE_METADATA_COLLECTION } from '../src/domain/source-metadata'
import { SYNC_RUNS_COLLECTION } from '../src/domain/sync-run'
import { MainModule } from '../src/main.module'

const API_KEY = 'e2e-test-key'

interface CreatedJob {
  id: string
}

async function createWebhookJob(app: NestExpressApplication, overrides: Record<string, unknown> = {}): Promise<CreatedJob> {
  const body = {
    name: `webhook-${new ObjectId().toHexString()}`,
    source: { type: 'webhook', config: {} },
    schedule: {},
    identity: { strategy: 'primary-key', fields: ['id'] },
    options: { detectDeleted: false, auditChanges: true },
    ...overrides,
  }
  const res = await request(app.getHttpServer()).post('/job-configs').set('x-api-key', API_KEY).send(body).expect(201)
  return res.body as CreatedJob
}

describe('Webhook ingestion (e2e — T2-B04)', () => {
  let app: NestExpressApplication
  let db: Db
  let client: MongoClient

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication<NestExpressApplication>({ rawBody: true })
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    client = new MongoClient(uri)
    await client.connect()
    db = client.db(dbName)
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
    if (client) await client.close()
  })

  beforeEach(async () => {
    await Promise.all([
      db.collection(JOB_CONFIGS_COLLECTION).deleteMany({}),
      db.collection(SYNC_RUNS_COLLECTION).deleteMany({}),
      db.collection(RAW_RECORDS_COLLECTION).deleteMany({}),
      db.collection(RAW_RECORD_CHANGELOG_COLLECTION).deleteMany({}),
      db.collection(SOURCE_METADATA_COLLECTION).deleteMany({}),
    ])
  })

  it('single-record body inserts 1 raw_record + 1 sync_run + 1 changelog entry (audit on)', async () => {
    const job = await createWebhookJob(app)
    const res = await request(app.getHttpServer()).post(`/webhooks/${job.id}`).send({ id: 42, name: 'alpha' }).expect(202)
    const runId = (res.body as { runId: string }).runId

    const run = await db.collection(SYNC_RUNS_COLLECTION).findOne({ _id: new ObjectId(runId) })
    expect(run).toBeTruthy()
    expect(run?.triggeredBy).toBe('webhook')
    expect(run?.status).toBe('success')
    expect(run?.counts).toMatchObject({ read: 1, inserted: 1, updated: 0, unchanged: 0, errors: 0 })

    const records = await db
      .collection(RAW_RECORDS_COLLECTION)
      .find({ jobConfigId: new ObjectId(job.id) })
      .toArray()
    expect(records).toHaveLength(1)
    expect(records[0].payload).toEqual({ id: 42, name: 'alpha' })
    expect(records[0].status).toBe('active')
    expect(records[0].version).toBe(1)

    const changelog = await db
      .collection(RAW_RECORD_CHANGELOG_COLLECTION)
      .find({ jobConfigId: new ObjectId(job.id) })
      .toArray()
    expect(changelog).toHaveLength(1)
    expect(changelog[0].operation).toBe('insert')
    expect(changelog[0].payloadAfter).toEqual({ id: 42, name: 'alpha' })
  })

  it('eventField=events fans out the array; insert → update → unchanged across runs', async () => {
    const job = await createWebhookJob(app, {
      source: { type: 'webhook', config: { eventField: 'events' } },
    })

    // First push: 2 inserts
    const r1 = await request(app.getHttpServer())
      .post(`/webhooks/${job.id}`)
      .send({
        events: [
          { id: 1, v: 'a' },
          { id: 2, v: 'b' },
        ],
      })
      .expect(202)
    const run1 = await db.collection(SYNC_RUNS_COLLECTION).findOne({ _id: new ObjectId((r1.body as { runId: string }).runId) })
    expect(run1?.counts).toMatchObject({ read: 2, inserted: 2, updated: 0, unchanged: 0 })

    // Second push: 1 update (id:1 changed) + 1 unchanged (id:2 same)
    const r2 = await request(app.getHttpServer())
      .post(`/webhooks/${job.id}`)
      .send({
        events: [
          { id: 1, v: 'A' },
          { id: 2, v: 'b' },
        ],
      })
      .expect(202)
    const run2 = await db.collection(SYNC_RUNS_COLLECTION).findOne({ _id: new ObjectId((r2.body as { runId: string }).runId) })
    expect(run2?.counts).toMatchObject({ read: 2, inserted: 0, updated: 1, unchanged: 1 })

    interface PayloadRec {
      payload: { id: number; v: string }
    }
    const records = (await db
      .collection(RAW_RECORDS_COLLECTION)
      .find({ jobConfigId: new ObjectId(job.id) })
      .sort({ recordKey: 1 })
      .toArray()) as unknown as PayloadRec[]
    expect(records).toHaveLength(2)
    expect(records.find((r) => r.payload.id === 1)?.payload.v).toBe('A')
    expect(records.find((r) => r.payload.id === 2)?.payload.v).toBe('b')
  })

  it('persists a source_metadata entry inferred from the payload', async () => {
    const job = await createWebhookJob(app, {
      source: { type: 'webhook', config: { eventField: 'data' } },
    })
    await request(app.getHttpServer())
      .post(`/webhooks/${job.id}`)
      .send({ data: [{ id: 1, name: 'a', active: true }] })
      .expect(202)

    interface MetaDoc {
      schema: { fields: Array<{ name: string; type: string }>; raw: { source: string; sampleSize: number; totalRecords: number } }
    }
    const metas = (await db
      .collection(SOURCE_METADATA_COLLECTION)
      .find({ jobConfigId: new ObjectId(job.id) })
      .toArray()) as unknown as MetaDoc[]
    expect(metas).toHaveLength(1)
    expect(metas[0].schema.fields.map((f) => f.name).sort()).toEqual(['active', 'id', 'name'])
    expect(metas[0].schema.raw).toMatchObject({ source: 'webhook-inline' })
  })

  it('emits 400 (no sync_run) when the body shape does not match the configured eventField', async () => {
    const job = await createWebhookJob(app, {
      source: { type: 'webhook', config: { eventField: 'events' } },
    })
    await request(app.getHttpServer()).post(`/webhooks/${job.id}`).send({ wrong: 'shape' }).expect(400)
    const runs = await db
      .collection(SYNC_RUNS_COLLECTION)
      .find({ jobConfigId: new ObjectId(job.id) })
      .toArray()
    expect(runs).toHaveLength(0)
  })

  it('audit=false suppresses changelog entries but raw_records still classify correctly', async () => {
    const job = await createWebhookJob(app, {
      source: { type: 'webhook', config: { eventField: 'events' } },
      options: { detectDeleted: false, auditChanges: false },
    })
    await request(app.getHttpServer())
      .post(`/webhooks/${job.id}`)
      .send({ events: [{ id: 1 }, { id: 2 }] })
      .expect(202)
    const records = await db
      .collection(RAW_RECORDS_COLLECTION)
      .find({ jobConfigId: new ObjectId(job.id) })
      .toArray()
    expect(records).toHaveLength(2)
    const changelog = await db
      .collection(RAW_RECORD_CHANGELOG_COLLECTION)
      .find({ jobConfigId: new ObjectId(job.id) })
      .toArray()
    expect(changelog).toHaveLength(0)
  })

  it('sync_run lists the webhook run alongside cron-driven ones (triggeredBy=webhook visible via /sync-runs)', async () => {
    const job = await createWebhookJob(app)
    await request(app.getHttpServer()).post(`/webhooks/${job.id}`).send({ id: 1 }).expect(202)
    const list = await request(app.getHttpServer()).get(`/sync-runs?jobConfigId=${job.id}`).set('x-api-key', API_KEY).expect(200)
    const items = (list.body as { items: Array<{ triggeredBy: string }> }).items
    expect(items).toHaveLength(1)
    expect(items[0].triggeredBy).toBe('webhook')
  })
})
