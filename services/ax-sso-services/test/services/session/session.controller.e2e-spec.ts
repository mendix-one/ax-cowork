import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import type { Model } from 'mongoose'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER, APP_KEY_HEADER } from '../../../src/acore/security'
import { App as AppDoc } from '../../../src/acore/database/schemas/app.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'
const APP_KEY = 'SSO'

describe('SessionController (e2e)', () => {
  let app: INestApplication<App>
  let appModel: Model<AppDoc>
  let sessionModel: Model<Session>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    appModel = moduleFixture.get<Model<AppDoc>>(getModelToken(AppDoc.name))
    sessionModel = moduleFixture.get<Model<Session>>(getModelToken(Session.name))
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    await Promise.all([appModel.deleteMany({}).exec(), sessionModel.deleteMany({}).exec()])
    await appModel.create({ key: APP_KEY, type: 'INTERNAL_SERVICES', name: 'AX SSO', description: 'SSO admin' })
  })

  it('rejects requests without the API key', async () => {
    await request(app.getHttpServer()).post('/session/initialize').set(APP_KEY_HEADER, APP_KEY).expect(401)
  })

  it('rejects requests without the ax-app-key header with 400', async () => {
    await request(app.getHttpServer()).post('/session/initialize').set(API_KEY_HEADER, API_KEY).expect(400)
  })

  it('rejects unknown apps with 401', async () => {
    await request(app.getHttpServer()).post('/session/initialize').set(API_KEY_HEADER, API_KEY).set(APP_KEY_HEADER, 'NOPE').expect(401)
  })

  it('returns { uuid, token, app, expiresAt } and persists an anonymous session', async () => {
    const res = await request(app.getHttpServer()).post('/session/initialize').set(API_KEY_HEADER, API_KEY).set(APP_KEY_HEADER, APP_KEY).expect(201)

    const body = res.body as { uuid: string; token: string; app: { uuid: string; key: string; type: string; name: string }; expiresAt: string }
    expect(body.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    expect(body.token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    expect(body.app.key).toBe(APP_KEY)

    // expiresAt ~ 1 year from now.
    const expMs = new Date(body.expiresAt).getTime()
    const oneYearMs = 365 * 24 * 60 * 60 * 1000
    expect(expMs).toBeGreaterThan(Date.now() + oneYearMs - 10_000)
    expect(expMs).toBeLessThan(Date.now() + oneYearMs + 10_000)

    // Session persisted, no account attached.
    const persisted = await sessionModel.findOne({ uuid: body.uuid }).lean().exec()
    expect(persisted).not.toBeNull()
    expect(persisted?.account).toBeUndefined()
    expect(persisted?.roles).toEqual([])
    expect(persisted?.app.key).toBe(APP_KEY)

    // JWT carries ses + app (no sub/sta/roles).
    const [, payloadSegment] = body.token.split('.')
    const claims = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf8')) as Record<string, unknown>
    expect(claims.ses).toBe(body.uuid)
    expect(claims.app).toBe(APP_KEY)
    expect(claims.sub).toBeUndefined()
    expect(claims.sta).toBeUndefined()
    expect(claims.roles).toBeUndefined()
  })
})
