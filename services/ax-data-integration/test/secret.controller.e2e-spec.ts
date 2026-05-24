import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { MongoClient, ObjectId } from 'mongodb'
import request from 'supertest'
import { App } from 'supertest/types'

import { MainModule } from '../src/main.module'
import { JOB_CONFIGS_COLLECTION } from '../src/domain/job-config/job-config.schema'
import { SECRETS_COLLECTION } from '../src/domain/secret/secret.schema'

const API_KEY = 'e2e-test-key' // matches global-setup.ts

describe('SecretsController (e2e)', () => {
  let app: INestApplication<App>
  let cleanupClient: MongoClient

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
    if (cleanupClient) await cleanupClient.close()
  })

  beforeEach(async () => {
    // Wipe the shared collection so tests start clean.
    const uri = process.env.MONGO_URI
    const dbName = process.env.MONGO_DB_NAME
    if (!uri || !dbName) throw new Error('MONGO env not set by global-setup')
    cleanupClient = new MongoClient(uri)
    await cleanupClient.connect()
    await cleanupClient.db(dbName).collection(SECRETS_COLLECTION).deleteMany({})
    await cleanupClient.db(dbName).collection(JOB_CONFIGS_COLLECTION).deleteMany({})
    await cleanupClient.close()
  })

  it('rejects requests with no x-axios-key header (401)', async () => {
    await request(app.getHttpServer()).post('/secrets').send({ name: 'n', type: 'db', plaintext: 'p' }).expect(401)
  })

  it('rejects requests with an invalid x-axios-key (401)', async () => {
    await request(app.getHttpServer()).get('/secrets').set('x-axios-key', 'wrong-key').expect(401)
  })

  it('POST /secrets creates a secret and returns a summary (no ciphertext)', async () => {
    const res = await request(app.getHttpServer())
      .post('/secrets')
      .set('x-axios-key', API_KEY)
      .send({ name: 'oracle-prod', type: 'db', plaintext: 'super-secret' })
      .expect(201)

    const body = res.body as { id: string; name: string; type: string; keyVersion: number }
    expect(body).toMatchObject({ name: 'oracle-prod', type: 'db', keyVersion: 1 })
    expect(body).not.toHaveProperty('encrypted')
    expect(body).not.toHaveProperty('plaintext')
    expect(typeof body.id).toBe('string')
  })

  it('POST /secrets with a duplicate name returns 409', async () => {
    await request(app.getHttpServer()).post('/secrets').set('x-axios-key', API_KEY).send({ name: 'dup', type: 'axios', plaintext: 'a' }).expect(201)
    await request(app.getHttpServer()).post('/secrets').set('x-axios-key', API_KEY).send({ name: 'dup', type: 'axios', plaintext: 'b' }).expect(409)
  })

  it('POST /secrets with an unknown type returns 400 (DTO validation)', async () => {
    await request(app.getHttpServer()).post('/secrets').set('x-axios-key', API_KEY).send({ name: 'x', type: 'bogus', plaintext: 'p' }).expect(400)
  })

  it('POST /secrets without plaintext returns 400 (DTO validation)', async () => {
    await request(app.getHttpServer()).post('/secrets').set('x-axios-key', API_KEY).send({ name: 'x', type: 'axios' }).expect(400)
  })

  it('GET /secrets lists existing summaries; no ciphertext leakage', async () => {
    await request(app.getHttpServer()).post('/secrets').set('x-axios-key', API_KEY).send({ name: 'a', type: 'axios', plaintext: '1' }).expect(201)
    await request(app.getHttpServer()).post('/secrets').set('x-axios-key', API_KEY).send({ name: 'b', type: 'axios', plaintext: '2' }).expect(201)

    const res = await request(app.getHttpServer()).get('/secrets').set('x-axios-key', API_KEY).expect(200)
    expect(res.body).toHaveLength(2)
    for (const item of res.body) {
      expect(item).not.toHaveProperty('encrypted')
      expect(item).not.toHaveProperty('plaintext')
    }
  })

  it('GET /secrets/:id returns 400 for malformed ObjectId and 404 for missing id', async () => {
    await request(app.getHttpServer()).get('/secrets/not-an-id').set('x-axios-key', API_KEY).expect(400)
    await request(app.getHttpServer()).get('/secrets/507f1f77bcf86cd799439011').set('x-axios-key', API_KEY).expect(404)
  })

  it('PATCH /secrets/:id updates fields; subsequent GET reflects the change', async () => {
    const created = await request(app.getHttpServer())
      .post('/secrets')
      .set('x-axios-key', API_KEY)
      .send({ name: 'old', type: 'db', plaintext: '1' })
      .expect(201)
    const { id } = created.body as { id: string }

    await request(app.getHttpServer()).patch(`/secrets/${id}`).set('x-axios-key', API_KEY).send({ name: 'new', plaintext: '2' }).expect(200)

    const fetched = await request(app.getHttpServer()).get(`/secrets/${id}`).set('x-axios-key', API_KEY).expect(200)
    const fetchedBody = fetched.body as { name: string }
    expect(fetchedBody.name).toBe('new')
  })

  it('DELETE /secrets/:id returns 204; subsequent GET returns 404', async () => {
    const created = await request(app.getHttpServer())
      .post('/secrets')
      .set('x-axios-key', API_KEY)
      .send({ name: 'goodbye', type: 'file', plaintext: 'x' })
      .expect(201)
    const { id } = created.body as { id: string }

    await request(app.getHttpServer()).delete(`/secrets/${id}`).set('x-axios-key', API_KEY).expect(204)
    await request(app.getHttpServer()).get(`/secrets/${id}`).set('x-axios-key', API_KEY).expect(404)
    await request(app.getHttpServer()).delete(`/secrets/${id}`).set('x-axios-key', API_KEY).expect(404)
  })

  it('DELETE /secrets/:id returns 409 when a job_config still references it', async () => {
    const created = await request(app.getHttpServer())
      .post('/secrets')
      .set('x-axios-key', API_KEY)
      .send({ name: 'in-use', type: 'db', plaintext: 'x' })
      .expect(201)
    const { id } = created.body as { id: string }

    // Insert a job_config that references the secret directly (controller for job_configs lands in T-C02).
    const uri = process.env.MONGO_URI!
    const dbName = process.env.MONGO_DB_NAME!
    const refClient = new MongoClient(uri)
    await refClient.connect()
    try {
      await refClient
        .db(dbName)
        .collection(JOB_CONFIGS_COLLECTION)
        .insertOne({
          name: 'uses-secret',
          enabled: true,
          source: { type: 'postgres', config: {} },
          schedule: { cronExpression: '0 0 * * *' },
          identity: { strategy: 'primary-key', fields: ['id'] },
          options: { detectDeleted: true, auditChanges: true },
          credentialsRef: new ObjectId(id),
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'test',
        })
    } finally {
      await refClient.close()
    }

    await request(app.getHttpServer()).delete(`/secrets/${id}`).set('x-axios-key', API_KEY).expect(409)
  })
})
