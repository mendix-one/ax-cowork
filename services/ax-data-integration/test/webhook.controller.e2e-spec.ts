import { createHmac } from 'crypto'

import { ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { MongoClient, ObjectId } from 'mongodb'
import request from 'supertest'

import { JOB_CONFIGS_COLLECTION } from '../src/domain/job-config'
import { SECRETS_COLLECTION } from '../src/domain/secret'
import { MainModule } from '../src/main.module'

const API_KEY = 'e2e-test-key'

interface CreatedJob {
  id: string
}

interface CreatedSecret {
  id: string
}

async function createSecret(app: NestExpressApplication, plaintext: string): Promise<CreatedSecret> {
  const res = await request(app.getHttpServer())
    .post('/secrets')
    .set('x-api-key', API_KEY)
    .send({ name: `wh-secret-${new ObjectId().toHexString()}`, type: 'api', plaintext })
    .expect(201)
  return res.body as CreatedSecret
}

function hmacHex(plaintext: string, body: string): string {
  return createHmac('sha256', plaintext).update(body).digest('hex')
}

async function createWebhookJob(app: NestExpressApplication, overrides: Record<string, unknown> = {}): Promise<CreatedJob> {
  const body = {
    name: `webhook-${new ObjectId().toHexString()}`,
    source: { type: 'webhook', config: {} },
    schedule: {},
    identity: { strategy: 'hash', fields: [], acknowledgeHashSemantics: true },
    ...overrides,
  }
  const res = await request(app.getHttpServer()).post('/job-configs').set('x-api-key', API_KEY).send(body).expect(201)
  return res.body as CreatedJob
}

async function createRestJob(app: NestExpressApplication): Promise<CreatedJob> {
  const body = {
    name: `rest-${new ObjectId().toHexString()}`,
    source: { type: 'rest', config: { baseUrl: 'https://api.example', endpoint: '/x', method: 'GET' } },
    schedule: { cronExpression: '0 0 * * *' },
    identity: { strategy: 'primary-key', fields: ['id'] },
  }
  const res = await request(app.getHttpServer()).post('/job-configs').set('x-api-key', API_KEY).send(body).expect(201)
  return res.body as CreatedJob
}

describe('WebhookController (e2e)', () => {
  let app: NestExpressApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    // `rawBody: true` mirrors main.ts so HMAC verify (T2-B03) and the body-parser default carry the
    // same semantics here as in production.
    app = moduleFixture.createNestApplication<NestExpressApplication>({ rawBody: true })
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
    await client.db(dbName).collection(SECRETS_COLLECTION).deleteMany({})
    await client.close()
  })

  it('202 with a hex runId on a happy webhook POST (no x-api-key required)', async () => {
    const job = await createWebhookJob(app)
    const res = await request(app.getHttpServer())
      .post(`/webhooks/${job.id}`)
      .set('content-type', 'application/json')
      .send({ event: 'user.created', user: { id: 7 } })
      .expect(202)
    const body = res.body as { runId: string }
    expect(typeof body.runId).toBe('string')
    expect(ObjectId.isValid(body.runId)).toBe(true)
  })

  it('404 when no job_config exists for the id', async () => {
    const unknown = new ObjectId().toHexString()
    await request(app.getHttpServer()).post(`/webhooks/${unknown}`).send({}).expect(404)
  })

  it('404 when the job_config exists but source.type !== "webhook"', async () => {
    const job = await createRestJob(app)
    await request(app.getHttpServer()).post(`/webhooks/${job.id}`).send({}).expect(404)
  })

  it('400 when the path id is malformed', async () => {
    await request(app.getHttpServer()).post('/webhooks/not-a-mongo-id').send({}).expect(400)
  })

  it('400 when the body is malformed JSON', async () => {
    const job = await createWebhookJob(app)
    await request(app.getHttpServer()).post(`/webhooks/${job.id}`).set('content-type', 'application/json').send('{"event": ').expect(400)
  })

  it('open webhook (no secretRef) accepts the request without any signature', async () => {
    const job = await createWebhookJob(app)
    await request(app.getHttpServer()).post(`/webhooks/${job.id}`).set('content-type', 'application/json').send({ event: 'ok' }).expect(202)
  })

  describe('HMAC signature verification (T2-B03)', () => {
    const PLAINTEXT = 'test-shared-secret'

    it('202 when the signature header matches HMAC-SHA256(rawBody, plaintext)', async () => {
      const secret = await createSecret(app, PLAINTEXT)
      const job = await createWebhookJob(app, {
        source: { type: 'webhook', config: { secretRef: secret.id } },
      })
      const payload = { event: 'user.created', id: 7 }
      const rawJson = JSON.stringify(payload)
      const sig = hmacHex(PLAINTEXT, rawJson)
      await request(app.getHttpServer())
        .post(`/webhooks/${job.id}`)
        .set('content-type', 'application/json')
        .set('x-webhook-signature', sig)
        .send(rawJson)
        .expect(202)
    })

    it('401 when the signature header is missing on a signed job', async () => {
      const secret = await createSecret(app, PLAINTEXT)
      const job = await createWebhookJob(app, {
        source: { type: 'webhook', config: { secretRef: secret.id } },
      })
      await request(app.getHttpServer()).post(`/webhooks/${job.id}`).set('content-type', 'application/json').send({ event: 'no-sig' }).expect(401)
    })

    it('401 when the payload is tampered after signing', async () => {
      const secret = await createSecret(app, PLAINTEXT)
      const job = await createWebhookJob(app, {
        source: { type: 'webhook', config: { secretRef: secret.id } },
      })
      const originalJson = JSON.stringify({ event: 'a' })
      const sig = hmacHex(PLAINTEXT, originalJson)
      await request(app.getHttpServer())
        .post(`/webhooks/${job.id}`)
        .set('content-type', 'application/json')
        .set('x-webhook-signature', sig)
        .send(JSON.stringify({ event: 'b' }))
        .expect(401)
    })

    it('401 when x-webhook-timestamp is outside the skew window', async () => {
      const secret = await createSecret(app, PLAINTEXT)
      const job = await createWebhookJob(app, {
        source: { type: 'webhook', config: { secretRef: secret.id } },
      })
      const rawJson = JSON.stringify({ event: 'old' })
      const sig = hmacHex(PLAINTEXT, rawJson)
      const stale = String(Math.floor(Date.now() / 1000) - 60 * 60 * 24)
      await request(app.getHttpServer())
        .post(`/webhooks/${job.id}`)
        .set('content-type', 'application/json')
        .set('x-webhook-signature', sig)
        .set('x-webhook-timestamp', stale)
        .send(rawJson)
        .expect(401)
    })

    it('202 when x-webhook-timestamp is fresh', async () => {
      const secret = await createSecret(app, PLAINTEXT)
      const job = await createWebhookJob(app, {
        source: { type: 'webhook', config: { secretRef: secret.id } },
      })
      const rawJson = JSON.stringify({ event: 'fresh' })
      const sig = hmacHex(PLAINTEXT, rawJson)
      const now = String(Math.floor(Date.now() / 1000))
      await request(app.getHttpServer())
        .post(`/webhooks/${job.id}`)
        .set('content-type', 'application/json')
        .set('x-webhook-signature', sig)
        .set('x-webhook-timestamp', now)
        .send(rawJson)
        .expect(202)
    })

    it('honours a custom signatureHeader from job_config.source.config', async () => {
      const secret = await createSecret(app, PLAINTEXT)
      const job = await createWebhookJob(app, {
        source: { type: 'webhook', config: { secretRef: secret.id, signatureHeader: 'x-acme-signature' } },
      })
      const rawJson = JSON.stringify({ event: 'custom-header' })
      const sig = hmacHex(PLAINTEXT, rawJson)
      // Sending under the default header should fail
      await request(app.getHttpServer())
        .post(`/webhooks/${job.id}`)
        .set('content-type', 'application/json')
        .set('x-webhook-signature', sig)
        .send(rawJson)
        .expect(401)
      // Sending under the configured header should pass
      await request(app.getHttpServer())
        .post(`/webhooks/${job.id}`)
        .set('content-type', 'application/json')
        .set('x-acme-signature', sig)
        .send(rawJson)
        .expect(202)
    })
  })
})
