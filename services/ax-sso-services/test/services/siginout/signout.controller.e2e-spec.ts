import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import type { Model } from 'mongoose'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER, APP_KEY_HEADER } from '../../../src/acore/security'
import { Account } from '../../../src/acore/database/schemas/account.schema'
import { App as AppDoc } from '../../../src/acore/database/schemas/app.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { Token } from '../../../src/acore/database/schemas/token.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'
const USERNAME = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('SignoutController (e2e)', () => {
  let app: INestApplication<App>
  let accountModel: Model<Account>
  let appModel: Model<AppDoc>
  let sessionModel: Model<Session>
  let tokenModel: Model<Token>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    accountModel = moduleFixture.get<Model<Account>>(getModelToken(Account.name))
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
      appModel.deleteMany({}).exec(),
      sessionModel.deleteMany({}).exec(),
      tokenModel.deleteMany({}).exec(),
    ])
    await accountModel.create({
      username: USERNAME,
      passwordHash: await hash(PASSWORD, 4),
      display: 'Alice',
      email: `${USERNAME}@example.com`,
      cdnOwnerId: '00000000-0000-0000-0000-000000000001',
      status: 'ACTIVE',
    })
    await appModel.create({ key: 'SSO', type: 'INTERNAL_SERVICES', name: 'AX SSO' })
  })

  async function signinAndGetSession(): Promise<{ token: string; sessionUuid: string }> {
    const res = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set(APP_KEY_HEADER, 'SSO')
      .send({ username: USERNAME, password: PASSWORD })
      .expect(201)
    const body = res.body as { token: string; uuid: string }
    return { token: body.token, sessionUuid: body.uuid }
  }

  it('rejects requests without the API key', async () => {
    await request(app.getHttpServer()).post('/signout').expect(401)
  })

  it('rejects requests without a bearer token (SecurityCheckGuard)', async () => {
    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).expect(401)
  })

  it('rejects requests with a malformed Authorization header', async () => {
    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', 'NotBearer xyz').expect(401)
  })

  it('rejects an arbitrary (non-JWT) bearer string with 401', async () => {
    // The previous controller would silently accept any string and no-op; the guard now rejects.
    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', 'Bearer this-is-not-a-jwt').expect(401)
  })

  it('invalidates the session by uuid (from the `ses` claim) and returns the 200 success payload', async () => {
    const { token, sessionUuid } = await signinAndGetSession()

    // Seed a Token row linked to this session so we can verify the cascade delete.
    await tokenModel.create({
      token: 'derived-token-xyz',
      account: 'acct-uuid',
      session: sessionUuid,
      app: 'SSO',
      roles: [],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })

    expect(await sessionModel.findOne({ uuid: sessionUuid }).lean().exec()).not.toBeNull()
    expect(await tokenModel.findOne({ session: sessionUuid }).lean().exec()).not.toBeNull()

    const res = await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${token}`).expect(200)
    expect(res.body).toEqual({ statusCode: 200, message: 'Signed out successfully' })

    expect(await sessionModel.findOne({ uuid: sessionUuid }).lean().exec()).toBeNull()
    expect(await tokenModel.findOne({ session: sessionUuid }).lean().exec()).toBeNull()
  })

  it('returns HTTP 200 with a 400 payload when the bearer is valid but its session was already removed', async () => {
    const { token, sessionUuid } = await signinAndGetSession()

    // Remove the session out-of-band; the JWT is still cryptographically valid.
    await sessionModel.deleteOne({ uuid: sessionUuid }).exec()

    // Service returns the failure payload in-band (statusCode is a body field, not the HTTP status).
    const res = await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${token}`).expect(200)
    expect(res.body).toEqual({ statusCode: 400, message: 'Session not found' })
  })
})
