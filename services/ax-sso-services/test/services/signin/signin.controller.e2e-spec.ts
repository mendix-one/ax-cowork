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
import { Token } from '../../../src/acore/database/schemas/token.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'
const APP_KEY = 'SSO'
const USERNAME = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('SigninController (e2e)', () => {
  let app: INestApplication<App>
  let accountModel: Model<Account>
  let accountRoleModel: Model<AccountRole>
  let appModel: Model<AppDoc>
  let sessionModel: Model<Session>
  let tokenModel: Model<Token>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    accountModel = moduleFixture.get<Model<Account>>(getModelToken(Account.name))
    accountRoleModel = moduleFixture.get<Model<AccountRole>>(getModelToken(AccountRole.name))
    appModel = moduleFixture.get<Model<AppDoc>>(getModelToken(AppDoc.name))
    sessionModel = moduleFixture.get<Model<Session>>(getModelToken(Session.name))
    tokenModel = moduleFixture.get<Model<Token>>(getModelToken(Token.name))
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
      tokenModel.deleteMany({}).exec(),
    ])
    const seeded = await accountModel.create({
      username: USERNAME,
      passwordHash: await hash(PASSWORD, 4),
      display: 'Alice',
      email: `${USERNAME}@example.com`,
      cdnOwnerId: '00000000-0000-0000-0000-000000000001',
      status: 'ACTIVE',
    })
    await appModel.create({
      key: APP_KEY,
      type: 'INTERNAL_SERVICES',
      name: 'AX SSO',
      description: 'Single sign-on administration',
    })
    await accountRoleModel.create({ account: seeded.uuid, app: APP_KEY, role: 'ADMIN' })
  })

  // Helper: bootstrap an anonymous session via /initialize and return its bearer.
  async function initializeSession(appKey: string = APP_KEY): Promise<{ token: string; uuid: string }> {
    const res = await request(app.getHttpServer()).post('/initialize').set(API_KEY_HEADER, API_KEY).set(APP_KEY_HEADER, appKey).expect(201)
    const body = res.body as { token: string; uuid: string }
    return body
  }

  it('rejects requests without the API key', async () => {
    const { token } = await initializeSession()
    await request(app.getHttpServer()).post('/signin').set('Authorization', `Bearer ${token}`).send({ username: USERNAME, password: PASSWORD }).expect(401)
  })

  it('rejects requests without an anonymous-session bearer (SecurityCheckGuard)', async () => {
    await request(app.getHttpServer()).post('/signin').set(API_KEY_HEADER, API_KEY).send({ username: USERNAME, password: PASSWORD }).expect(401)
  })

  it('rejects malformed bearers with 401', async () => {
    await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', 'Bearer not-a-jwt')
      .send({ username: USERNAME, password: PASSWORD })
      .expect(401)
  })

  it('rejects malformed bodies with 400', async () => {
    const { token } = await initializeSession()
    await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: USERNAME })
      .expect(400)
  })

  it('returns 200 with BusinessException envelope (code=1) for unknown accounts', async () => {
    const { token } = await initializeSession()
    const res = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'nobody', password: PASSWORD })
      .expect(200)
    expect(res.headers.code).toBe('1')
    expect(res.body).toEqual({ code: 1, error: 'Invalid credentials' })
  })

  it('returns 200 with BusinessException envelope (code=1) for wrong passwords', async () => {
    const { token } = await initializeSession()
    const res = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: USERNAME, password: 'wrong' })
      .expect(200)
    expect(res.headers.code).toBe('1')
    expect(res.body).toEqual({ code: 1, error: 'Invalid credentials' })
  })

  it('returns 200 with BusinessException envelope (code=2) when the account is not active', async () => {
    // Lock the seeded account so signin hits the status gate.
    await accountModel.updateOne({ username: USERNAME }, { $set: { status: 'LOCKED' } }).exec()
    const { token } = await initializeSession()

    const res = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: USERNAME, password: PASSWORD })
      .expect(200)
    expect(res.headers.code).toBe('2')
    expect(res.body).toEqual({ code: 2, error: 'Account is not active', data: { status: 'LOCKED' } })
  })

  it('returns { uuid, token, account, app, roles } on valid credentials and attaches the account to the existing session', async () => {
    const initialized = await initializeSession()

    const res = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${initialized.token}`)
      .send({ username: USERNAME, password: PASSWORD })
      .expect(201)

    const body = res.body as {
      uuid: string
      token: string
      account: { uuid: string; username: string; email: string; display: string; status: string }
      app: { uuid: string; key: string; type: string; name: string }
      roles: string[]
    }

    // The signed-in JWT replaces the anonymous one — both are valid JWTs in shape.
    expect(body.token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    expect(body.token).not.toBe(initialized.token)

    // Same session uuid — signin attaches, doesn't create.
    expect(body.uuid).toBe(initialized.uuid)
    expect(body.account.username).toBe(USERNAME)
    expect(body.account.status).toBe('ACTIVE')
    expect(body.app.key).toBe(APP_KEY)
    expect(body.roles).toEqual(['ADMIN'])

    // Session persisted with the account snapshot attached and roles populated.
    const persisted = await sessionModel.findOne({ uuid: body.uuid }).lean().exec()
    expect(persisted?.account?.username).toBe(USERNAME)
    expect(persisted?.roles).toEqual(['ADMIN'])
    // Only one session row was created/kept — signin reuses the initialized one.
    const allSessions = await sessionModel.find({}).lean().exec()
    expect(allSessions).toHaveLength(1)

    // JWT carries account-bound claims.
    const [, payloadSegment] = body.token.split('.')
    const claims = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf8')) as Record<string, unknown>
    expect(claims.sub).toBe(body.account.uuid)
    expect(claims.app).toBe(APP_KEY)
    expect(claims.ses).toBe(body.uuid)
    expect(claims.sta).toBe('ACTIVE')
    expect(claims.roles).toEqual(['ADMIN'])
  })

  it('extends the session expiry to ~1 year on signin', async () => {
    const initialized = await initializeSession()
    const before = await sessionModel.findOne({ uuid: initialized.uuid }).lean().exec()

    await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${initialized.token}`)
      .send({ username: USERNAME, password: PASSWORD })
      .expect(201)

    const after = await sessionModel.findOne({ uuid: initialized.uuid }).lean().exec()
    // Initialize already gives 1 year; signin extends to a new 1-year window starting now, so
    // the new expiry should be at least equal to the previous one (and usually slightly later).
    expect(after?.expiresAt.getTime()).toBeGreaterThanOrEqual(before!.expiresAt.getTime())
  })

  it('on account switch: clears the previous account on the same session and cascade-deletes its tokens', async () => {
    // Seed a second account that we will switch to.
    const bobHash = await hash('bob password', 4)
    const bob = await accountModel.create({
      username: 'bob',
      passwordHash: bobHash,
      display: 'Bob',
      email: 'bob@example.com',
      cdnOwnerId: '00000000-0000-0000-0000-000000000002',
      status: 'ACTIVE',
    })
    await accountRoleModel.create({ account: bob.uuid, app: APP_KEY, role: 'MEMBER' })

    const initialized = await initializeSession()

    // First signin as alice.
    const aliceRes = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${initialized.token}`)
      .send({ username: USERNAME, password: PASSWORD })
      .expect(201)
    const aliceToken = (aliceRes.body as { token: string }).token

    // Mint a derived app token for the session so we can verify cascade-delete on switch.
    await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${aliceToken}`)
      .send({ scope: APP_KEY })
      .expect(201)
    expect(await tokenModel.find({ session: initialized.uuid }).lean().exec()).toHaveLength(1)

    // Switch to bob using the same anonymous bearer (the initialized session is still valid).
    // We use alice's signed-in token here because it shares the same `ses` claim.
    await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${aliceToken}`)
      .send({ username: 'bob', password: 'bob password' })
      .expect(201)

    // Token rows from alice are gone after the switch.
    expect(await tokenModel.find({ session: initialized.uuid }).lean().exec()).toHaveLength(0)
    // Session now carries bob's snapshot.
    const after = await sessionModel.findOne({ uuid: initialized.uuid }).lean().exec()
    expect(after?.account?.username).toBe('bob')
    expect(after?.roles).toEqual(['MEMBER'])
  })
})
