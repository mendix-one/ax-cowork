import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import type { Model } from 'mongoose'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER, APP_KEY_HEADER } from '../../../src/acore/security'
import { Account } from '../../../src/acore/database/schemas/account.schema'
import { AccountRole } from '../../../src/acore/database/schemas/account-role.schema'
import { App as AppDoc } from '../../../src/acore/database/schemas/app.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'
const APP_KEY = 'SSO'
const USERNAME = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('SessionController (e2e)', () => {
  let app: INestApplication<App>
  let accountModel: Model<Account>
  let accountRoleModel: Model<AccountRole>
  let appModel: Model<AppDoc>
  let sessionModel: Model<Session>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    accountModel = moduleFixture.get<Model<Account>>(getModelToken(Account.name))
    accountRoleModel = moduleFixture.get<Model<AccountRole>>(getModelToken(AccountRole.name))
    appModel = moduleFixture.get<Model<AppDoc>>(getModelToken(AppDoc.name))
    sessionModel = moduleFixture.get<Model<Session>>(getModelToken(Session.name))
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    await Promise.all([
      accountModel.deleteMany({}).exec(),
      accountRoleModel.deleteMany({}).exec(),
      appModel.deleteMany({}).exec(),
      sessionModel.deleteMany({}).exec(),
    ])
    await appModel.create({ key: APP_KEY, type: 'INTERNAL_SERVICES', name: 'AX SSO', description: 'SSO admin' })
  })

  // ---------------------------------------------------------------------------
  // POST /session/initialize
  // ---------------------------------------------------------------------------

  describe('POST /session/initialize', () => {
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

      const expMs = new Date(body.expiresAt).getTime()
      const oneYearMs = 365 * 24 * 60 * 60 * 1000
      expect(expMs).toBeGreaterThan(Date.now() + oneYearMs - 10_000)
      expect(expMs).toBeLessThan(Date.now() + oneYearMs + 10_000)

      const persisted = await sessionModel.findOne({ uuid: body.uuid }).lean().exec()
      expect(persisted).not.toBeNull()
      expect(persisted?.account).toBeUndefined()
      expect(persisted?.roles).toEqual([])
      expect(persisted?.app.key).toBe(APP_KEY)

      const [, payloadSegment] = body.token.split('.')
      const claims = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf8')) as Record<string, unknown>
      expect(claims.ses).toBe(body.uuid)
      expect(claims.app).toBe(APP_KEY)
      expect(claims.sub).toBeUndefined()
      expect(claims.sta).toBeUndefined()
      expect(claims.roles).toBeUndefined()
    })
  })

  // ---------------------------------------------------------------------------
  // GET /session
  // ---------------------------------------------------------------------------

  describe('GET /session', () => {
    async function initialize(): Promise<{ token: string; uuid: string }> {
      const res = await request(app.getHttpServer()).post('/session/initialize').set(API_KEY_HEADER, API_KEY).set(APP_KEY_HEADER, APP_KEY).expect(201)
      return res.body as { token: string; uuid: string }
    }

    async function seedAccount(): Promise<{ uuid: string }> {
      const account = await accountModel.create({
        username: USERNAME,
        passwordHash: await hash(PASSWORD, 4),
        display: 'Alice',
        email: `${USERNAME}@example.com`,
        cdnOwnerId: '00000000-0000-0000-0000-00000000sess1',
        status: 'ACTIVE',
        avatar: 'https://cdn.example/alice.png',
        phone: '+1-555-0100',
      })
      await accountRoleModel.create({ account: account.uuid, app: APP_KEY, role: 'ADMIN' })
      return { uuid: account.uuid }
    }

    async function initializeAndSignin(): Promise<{ token: string; uuid: string; accountUuid: string }> {
      const seeded = await seedAccount()
      const init = await initialize()
      const signin = await request(app.getHttpServer())
        .post('/signin')
        .set(API_KEY_HEADER, API_KEY)
        .set('Authorization', `Bearer ${init.token}`)
        .send({ username: USERNAME, password: PASSWORD })
        .expect(201)
      const body = signin.body as { token: string; uuid: string }
      return { token: body.token, uuid: body.uuid, accountUuid: seeded.uuid }
    }

    it('rejects requests without the API key', async () => {
      const { token } = await initialize()
      await request(app.getHttpServer()).get('/session').set('Authorization', `Bearer ${token}`).expect(401)
    })

    it('rejects requests without a bearer token (SecurityCheckGuard)', async () => {
      await request(app.getHttpServer()).get('/session').set(API_KEY_HEADER, API_KEY).expect(401)
    })

    it('rejects an arbitrary (non-JWT) bearer with 401', async () => {
      await request(app.getHttpServer()).get('/session').set(API_KEY_HEADER, API_KEY).set('Authorization', 'Bearer not-a-jwt').expect(401)
    })

    it('anonymous bearer: returns uuid + app + empty roles, omits account + status', async () => {
      const { token, uuid } = await initialize()

      const res = await request(app.getHttpServer()).get('/session').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${token}`).expect(200)
      const body = res.body as {
        uuid: string
        app: { uuid: string; key: string; type: string; name: string }
        account?: unknown
        status?: string
        roles: string[]
        expiresAt: string
      }

      expect(body.uuid).toBe(uuid)
      expect(body.app.key).toBe(APP_KEY)
      expect(body.app.type).toBe('INTERNAL_SERVICES')
      expect(body.account).toBeUndefined()
      expect(body.status).toBeUndefined()
      expect(body.roles).toEqual([])
      expect(new Date(body.expiresAt).getTime()).toBeGreaterThan(Date.now())
    })

    it('signed-in bearer: returns full info with account snapshot, status, and roles', async () => {
      const { token, uuid, accountUuid } = await initializeAndSignin()

      const res = await request(app.getHttpServer()).get('/session').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${token}`).expect(200)
      const body = res.body as {
        uuid: string
        app: { key: string }
        account: { uuid: string; username: string; display: string; email: string; avatar?: string; phone?: string }
        status: string
        roles: string[]
      }

      expect(body.uuid).toBe(uuid)
      expect(body.app.key).toBe(APP_KEY)
      expect(body.account.uuid).toBe(accountUuid)
      expect(body.account.username).toBe(USERNAME)
      expect(body.account.display).toBe('Alice')
      expect(body.account.email).toBe(`${USERNAME}@example.com`)
      expect(body.account.avatar).toBe('https://cdn.example/alice.png')
      expect(body.account.phone).toBe('+1-555-0100')
      expect(body.status).toBe('ACTIVE')
      expect(body.roles).toEqual(['ADMIN'])
    })

    it('rejects with 401 when the bearer is valid but the backing session was already removed', async () => {
      const { token, uuid } = await initialize()
      await sessionModel.deleteOne({ uuid }).exec()

      await request(app.getHttpServer()).get('/session').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${token}`).expect(401)
    })

    it('ignores client-supplied `session` headers — guard strips and overwrites them', async () => {
      const { token, uuid } = await initialize()

      const res = await request(app.getHttpServer())
        .get('/session')
        .set(API_KEY_HEADER, API_KEY)
        .set('Authorization', `Bearer ${token}`)
        .set('session', 'spoofed-session-uuid')
        .expect(200)
      const body = res.body as { uuid: string }
      expect(body.uuid).toBe(uuid)
    })
  })
})
