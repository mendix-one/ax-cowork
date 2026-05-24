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
const TARGET_SCOPE = 'BILLING'
const USERNAME = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('TokenController (e2e)', () => {
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
    await appModel.create({ key: APP_KEY, type: 'INTERNAL_SERVICES', name: 'AX SSO' })
    await appModel.create({ key: TARGET_SCOPE, type: 'WEB_APP', name: 'Billing' })
    await accountRoleModel.create({ account: seeded.uuid, app: TARGET_SCOPE, role: 'ADMIN' })
    await accountRoleModel.create({ account: seeded.uuid, app: TARGET_SCOPE, role: 'MEMBER' })
  })

  async function initializeSession(): Promise<{ token: string; uuid: string }> {
    const res = await request(app.getHttpServer()).post('/initialize').set(API_KEY_HEADER, API_KEY).set(APP_KEY_HEADER, APP_KEY).expect(201)
    return res.body as { token: string; uuid: string }
  }

  async function initializeAndSignin(): Promise<{ signedInToken: string; sessionUuid: string; accountUuid: string }> {
    const init = await initializeSession()
    const signin = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${init.token}`)
      .send({ username: USERNAME, password: PASSWORD })
      .expect(201)
    const body = signin.body as { token: string; uuid: string; account: { uuid: string } }
    return { signedInToken: body.token, sessionUuid: body.uuid, accountUuid: body.account.uuid }
  }

  it('rejects requests without the API key', async () => {
    await request(app.getHttpServer()).post('/token').send({ scope: TARGET_SCOPE }).expect(401)
  })

  it('rejects requests without a bearer token (SecurityCheckGuard)', async () => {
    await request(app.getHttpServer()).post('/token').set(API_KEY_HEADER, API_KEY).send({ scope: TARGET_SCOPE }).expect(401)
  })

  it('rejects malformed bodies (missing `scope`) with 400', async () => {
    const { signedInToken } = await initializeAndSignin()
    await request(app.getHttpServer()).post('/token').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${signedInToken}`).send({}).expect(400)
  })

  it('signed-in bearer: issues a token with sub/sta/roles and persists a row keyed by (session, app)', async () => {
    const { signedInToken, sessionUuid, accountUuid } = await initializeAndSignin()
    const sessionRow = await sessionModel.findOne({ uuid: sessionUuid }).lean().exec()

    const res = await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .send({ scope: TARGET_SCOPE })
      .expect(201)

    const body = res.body as {
      uuid: string
      token: string
      account?: string
      session: string
      app: string
      roles: string[]
      expiresAt: string
    }

    expect(body.token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    expect(body.account).toBe(accountUuid)
    expect(body.session).toBe(sessionUuid)
    expect(body.app).toBe(TARGET_SCOPE)
    expect(body.roles.sort()).toEqual(['ADMIN', 'MEMBER'])
    expect(new Date(body.expiresAt).getTime()).toBe(sessionRow!.expiresAt.getTime())

    const [, payloadSegment] = body.token.split('.')
    const claims = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf8')) as Record<string, unknown>
    expect(claims.app).toBe(TARGET_SCOPE)
    expect(claims.sub).toBe(accountUuid)
    expect(claims.ses).toBe(sessionUuid)
    expect(claims.sta).toBe('ACTIVE')
    expect((claims.roles as string[]).sort()).toEqual(['ADMIN', 'MEMBER'])

    const persisted = await tokenModel.findOne({ uuid: body.uuid }).lean().exec()
    expect(persisted?.account).toBe(accountUuid)
    expect(persisted?.session).toBe(sessionUuid)
    expect(persisted?.app).toBe(TARGET_SCOPE)
    expect(persisted?.roles.sort()).toEqual(['ADMIN', 'MEMBER'])
    expect(persisted?.expiresAt?.getTime()).toBe(sessionRow!.expiresAt.getTime())
  })

  it('anonymous bearer (from /initialize): issues a token with NO sub/sta and empty roles', async () => {
    const { token, uuid } = await initializeSession()

    const res = await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${token}`)
      .send({ scope: TARGET_SCOPE })
      .expect(201)

    const body = res.body as { uuid: string; token: string; account?: string; session: string; app: string; roles: string[] }
    expect(body.account).toBeUndefined()
    expect(body.session).toBe(uuid)
    expect(body.app).toBe(TARGET_SCOPE)
    expect(body.roles).toEqual([])

    const [, payloadSegment] = body.token.split('.')
    const claims = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf8')) as Record<string, unknown>
    expect(claims.sub).toBeUndefined()
    expect(claims.sta).toBeUndefined()
    expect(claims.roles).toEqual([])
    expect(claims.app).toBe(TARGET_SCOPE)
    expect(claims.ses).toBe(uuid)

    const persisted = await tokenModel.findOne({ uuid: body.uuid }).lean().exec()
    expect(persisted?.account).toBeUndefined()
    expect(persisted?.roles).toEqual([])
  })

  it('reuses the existing row keyed by (session, app) — refreshes JWT + roles in place', async () => {
    const { signedInToken } = await initializeAndSignin()

    const first = await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .send({ scope: TARGET_SCOPE })
      .expect(201)
    const firstBody = first.body as { uuid: string; token: string }

    await new Promise((r) => setTimeout(r, 1100))

    const second = await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .send({ scope: TARGET_SCOPE })
      .expect(201)
    const secondBody = second.body as { uuid: string; token: string }

    expect(secondBody.uuid).toBe(firstBody.uuid)
    expect(secondBody.token).not.toBe(firstBody.token)
    const rows = await tokenModel.find({ app: TARGET_SCOPE }).lean().exec()
    expect(rows).toHaveLength(1)
  })

  it('writes separate token rows for different scopes under the same session', async () => {
    const { signedInToken } = await initializeAndSignin()
    await appModel.create({ key: 'ANALYTICS', type: 'WEB_APP', name: 'Analytics' })

    await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .send({ scope: TARGET_SCOPE })
      .expect(201)
    await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .send({ scope: 'ANALYTICS' })
      .expect(201)

    const rows = await tokenModel.find({}).lean().exec()
    expect(rows.map((r) => r.app).sort()).toEqual(['ANALYTICS', TARGET_SCOPE].sort())
  })

  it('re-reads roles on each issue — token rotation reflects role changes', async () => {
    const { signedInToken, accountUuid } = await initializeAndSignin()

    const first = await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .send({ scope: TARGET_SCOPE })
      .expect(201)
    expect((first.body as { roles: string[] }).roles.sort()).toEqual(['ADMIN', 'MEMBER'])

    await accountRoleModel.deleteOne({ account: accountUuid, app: TARGET_SCOPE, role: 'MEMBER' }).exec()
    await accountRoleModel.create({ account: accountUuid, app: TARGET_SCOPE, role: 'VIEWER' })

    const second = await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .send({ scope: TARGET_SCOPE })
      .expect(201)

    const body = second.body as { roles: string[]; uuid: string }
    expect(body.roles.sort()).toEqual(['ADMIN', 'VIEWER'])
    expect(body.uuid).toBe((first.body as { uuid: string }).uuid)
  })

  it('rejects with 401 when the bearer is valid but the backing session was already removed', async () => {
    const { signedInToken, sessionUuid } = await initializeAndSignin()
    await sessionModel.deleteOne({ uuid: sessionUuid }).exec()

    await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .send({ scope: TARGET_SCOPE })
      .expect(401)

    const rows = await tokenModel.find({}).lean().exec()
    expect(rows).toHaveLength(0)
  })

  it('ignores client-supplied `account`/`session`/`state` headers — guard strips and overwrites them', async () => {
    const { signedInToken, sessionUuid, accountUuid } = await initializeAndSignin()

    const res = await request(app.getHttpServer())
      .post('/token')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${signedInToken}`)
      .set('account', 'spoofed-account')
      .set('session', 'spoofed-session')
      .set('state', 'LOCKED')
      .send({ scope: TARGET_SCOPE })
      .expect(201)

    const body = res.body as { account?: string; session: string; token: string }
    expect(body.account).toBe(accountUuid)
    expect(body.session).toBe(sessionUuid)
    const [, payloadSegment] = body.token.split('.')
    const claims = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf8')) as Record<string, unknown>
    expect(claims.sta).toBe('ACTIVE')
  })
})
