import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { MongoClient } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { JOB_CONFIGS_COLLECTION } from '../src/domain/job-config/job-config.schema'

const API_KEY = 'e2e-test-key'

const validBody = {
  name: 'daily-sales-api',
  source: { type: 'rest', config: { baseUrl: 'https://api.example', endpoint: '/sales', method: 'GET' } },
  schedule: { cronExpression: '0 0 * * *' },
  identity: { strategy: 'primary-key', fields: ['id'] },
}

describe('JobConfigController (e2e)', () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    const client = new MongoClient(uri)
    await client.connect()
    await client.db(dbName).collection(JOB_CONFIGS_COLLECTION).deleteMany({})
    await client.close()
  })

  it('401 without API key', async () => {
    await request(app.getHttpServer()).get('/job-configs').expect(401)
  })

  it('POST creates a job config with defaults', async () => {
    const res = await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(201)
    const body = res.body as { id: string; enabled: boolean; options: { detectDeleted: boolean; auditChanges: boolean } }
    expect(body.enabled).toBe(true)
    expect(body.options.detectDeleted).toBe(true)
    expect(body.options.auditChanges).toBe(true)
  })

  it('POST rejects unknown source.type (400)', async () => {
    await request(app.getHttpServer())
      .post('/job-configs')
      .set('x-axios-key', API_KEY)
      .send({ ...validBody, source: { type: 'bogus', config: {} } })
      .expect(400)
  })

  it('POST rejects missing required nested field (400)', async () => {
    await request(app.getHttpServer())
      .post('/job-configs')
      .set('x-axios-key', API_KEY)
      .send({ ...validBody, schedule: { timezone: 'UTC' } })
      .expect(400)
  })

  it('POST rejects malformed credentialsRef (400)', async () => {
    await request(app.getHttpServer())
      .post('/job-configs')
      .set('x-axios-key', API_KEY)
      .send({ ...validBody, name: 'with-bad-ref', credentialsRef: 'not-a-mongo-id' })
      .expect(400)
  })

  it('POST duplicate name → 409', async () => {
    await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(201)
    await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(409)
  })

  it('GET list filters by enabled and sourceType with pagination', async () => {
    await request(app.getHttpServer())
      .post('/job-configs')
      .set('x-axios-key', API_KEY)
      .send({ ...validBody, name: 'a' })
      .expect(201)
    await request(app.getHttpServer())
      .post('/job-configs')
      .set('x-axios-key', API_KEY)
      .send({ ...validBody, name: 'b', source: { type: 'excel', config: {} } })
      .expect(201)
    await request(app.getHttpServer())
      .post('/job-configs')
      .set('x-axios-key', API_KEY)
      .send({ ...validBody, name: 'c' })
      .expect(201)
    await request(app.getHttpServer())
      .post(`/job-configs/${(await getIdByName(app, 'b')).id}/disable`)
      .set('x-axios-key', API_KEY)
      .expect(200)

    const allRest = await request(app.getHttpServer()).get('/job-configs?sourceType=rest').set('x-axios-key', API_KEY).expect(200)
    const allRestBody = allRest.body as { total: number; items: { source: { type: string } }[] }
    expect(allRestBody.total).toBe(2)
    expect(allRestBody.items.every((i) => i.source.type === 'rest')).toBe(true)

    const enabledOnly = await request(app.getHttpServer()).get('/job-configs?enabled=true').set('x-axios-key', API_KEY).expect(200)
    const enabledBody = enabledOnly.body as { total: number }
    expect(enabledBody.total).toBe(2)

    const paged = await request(app.getHttpServer()).get('/job-configs?page=2&pageSize=1').set('x-axios-key', API_KEY).expect(200)
    const pagedBody = paged.body as { page: number; pageSize: number; items: unknown[] }
    expect(pagedBody.page).toBe(2)
    expect(pagedBody.pageSize).toBe(1)
    expect(pagedBody.items).toHaveLength(1)
  })

  it('GET by malformed id → 400, missing id → 404', async () => {
    await request(app.getHttpServer()).get('/job-configs/not-an-id').set('x-axios-key', API_KEY).expect(400)
    await request(app.getHttpServer()).get('/job-configs/507f1f77bcf86cd799439011').set('x-axios-key', API_KEY).expect(404)
  })

  it('PATCH updates and bumps updatedAt', async () => {
    const created = await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(201)
    const { id, updatedAt } = created.body as { id: string; updatedAt: string }

    await new Promise((r) => setTimeout(r, 5))
    const updated = await request(app.getHttpServer())
      .patch(`/job-configs/${id}`)
      .set('x-axios-key', API_KEY)
      .send({ description: 'now described' })
      .expect(200)
    const body = updated.body as { updatedAt: string; description: string }
    expect(body.description).toBe('now described')
    expect(new Date(body.updatedAt).getTime()).toBeGreaterThan(new Date(updatedAt).getTime())
  })

  it('PATCH with stale expectedUpdatedAt → 409', async () => {
    const created = await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(201)
    const { id } = created.body as { id: string }
    const stale = new Date(Date.now() - 60_000).toISOString()
    await request(app.getHttpServer()).patch(`/job-configs/${id}`).set('x-axios-key', API_KEY).send({ description: 'x', expectedUpdatedAt: stale }).expect(409)
  })

  it('PATCH with matching expectedUpdatedAt → 200', async () => {
    const created = await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(201)
    const { id, updatedAt } = created.body as { id: string; updatedAt: string }
    await request(app.getHttpServer())
      .patch(`/job-configs/${id}`)
      .set('x-axios-key', API_KEY)
      .send({ description: 'ok', expectedUpdatedAt: updatedAt })
      .expect(200)
  })

  it('DELETE soft-deletes (enabled=false)', async () => {
    const created = await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(201)
    const { id } = created.body as { id: string }
    const res = await request(app.getHttpServer()).delete(`/job-configs/${id}`).set('x-axios-key', API_KEY).expect(200)
    const body = res.body as { enabled: boolean }
    expect(body.enabled).toBe(false)
  })

  it('enable / disable toggle works', async () => {
    const created = await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(201)
    const { id } = created.body as { id: string }

    const disabled = await request(app.getHttpServer()).post(`/job-configs/${id}/disable`).set('x-axios-key', API_KEY).expect(200)
    expect((disabled.body as { enabled: boolean }).enabled).toBe(false)

    const enabled = await request(app.getHttpServer()).post(`/job-configs/${id}/enable`).set('x-axios-key', API_KEY).expect(200)
    expect((enabled.body as { enabled: boolean }).enabled).toBe(true)
  })

  it('enable / disable on missing id → 404', async () => {
    await request(app.getHttpServer()).post('/job-configs/507f1f77bcf86cd799439011/enable').set('x-axios-key', API_KEY).expect(404)
  })

  describe('per-strategy identity validation (T-C04)', () => {
    it('rejects primary-key with multiple fields (400)', async () => {
      await request(app.getHttpServer())
        .post('/job-configs')
        .set('x-axios-key', API_KEY)
        .send({ ...validBody, name: 'bad-pk', identity: { strategy: 'primary-key', fields: ['a', 'b'] } })
        .expect(400)
    })

    it('rejects composite with fewer than 2 fields (400)', async () => {
      await request(app.getHttpServer())
        .post('/job-configs')
        .set('x-axios-key', API_KEY)
        .send({ ...validBody, name: 'bad-composite', identity: { strategy: 'composite', fields: ['only-one'] } })
        .expect(400)
    })

    it('rejects hash without acknowledgeHashSemantics (400)', async () => {
      await request(app.getHttpServer())
        .post('/job-configs')
        .set('x-axios-key', API_KEY)
        .send({ ...validBody, name: 'bad-hash', identity: { strategy: 'hash', fields: [] } })
        .expect(400)
    })

    it('accepts hash when acknowledgeHashSemantics=true (201)', async () => {
      await request(app.getHttpServer())
        .post('/job-configs')
        .set('x-axios-key', API_KEY)
        .send({ ...validBody, name: 'good-hash', identity: { strategy: 'hash', fields: [], acknowledgeHashSemantics: true } })
        .expect(201)
    })

    it('rejects row-number for non-file source (400)', async () => {
      await request(app.getHttpServer())
        .post('/job-configs')
        .set('x-axios-key', API_KEY)
        .send({ ...validBody, name: 'bad-rownum', identity: { strategy: 'row-number', fields: [] } })
        .expect(400)
    })

    it('accepts row-number for excel source (201)', async () => {
      await request(app.getHttpServer())
        .post('/job-configs')
        .set('x-axios-key', API_KEY)
        .send({
          ...validBody,
          name: 'good-rownum',
          source: { type: 'excel', config: { sheetName: 'Sheet1', headerRow: 1, startRow: 2 } },
          identity: { strategy: 'row-number', fields: [] },
        })
        .expect(201)
    })

    it('PATCH that switches to invalid identity is also rejected (400)', async () => {
      const created = await request(app.getHttpServer()).post('/job-configs').set('x-axios-key', API_KEY).send(validBody).expect(201)
      const { id } = created.body as { id: string }
      await request(app.getHttpServer())
        .patch(`/job-configs/${id}`)
        .set('x-axios-key', API_KEY)
        .send({ identity: { strategy: 'composite', fields: ['only'] } })
        .expect(400)
    })
  })
})

async function getIdByName(app: INestApplication<App>, name: string): Promise<{ id: string }> {
  const res = await request(app.getHttpServer()).get('/job-configs').set('x-axios-key', API_KEY).expect(200)
  const body = res.body as { items: { id: string; name: string }[] }
  const item = body.items.find((i) => i.name === name)
  if (!item) throw new Error(`No job_config named ${name}`)
  return { id: item.id }
}
