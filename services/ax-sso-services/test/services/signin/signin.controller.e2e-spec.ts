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

describe('SigninController (e2e)', () => {
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

  function postSignin(extras?: { skipApiKey?: boolean; skipAppKey?: boolean; appKey?: string }) {
    const req = request(app.getHttpServer()).post('/signin')
    if (!extras?.skipApiKey) req.set(API_KEY_HEADER, API_KEY)
    if (!extras?.skipAppKey) req.set(APP_KEY_HEADER, extras?.appKey ?? APP_KEY)
    return req
  }

  it('rejects requests without the API key', async () => {
    await postSignin({ skipApiKey: true }).send({ username: USERNAME, password: PASSWORD }).expect(401)
  })

  it('rejects requests without the ax-app-key header with 400', async () => {
    await postSignin({ skipAppKey: true }).send({ username: USERNAME, password: PASSWORD }).expect(400)
  })

  it('rejects an unknown app key with 401', async () => {
    await postSignin({ appKey: 'NOPE' }).send({ username: USERNAME, password: PASSWORD }).expect(401)
  })

  it('rejects malformed bodies with 400', async () => {
    await postSignin().send({ username: USERNAME }).expect(400)
  })

  it('rejects unknown accounts with 401', async () => {
    await postSignin().send({ username: 'nobody', password: PASSWORD }).expect(401)
  })

  it('rejects wrong passwords with 401', async () => {
    await postSignin().send({ username: USERNAME, password: 'wrong' }).expect(401)
  })

  it('returns { uuid, token, account, app, roles } on valid credentials and persists the session', async () => {
    const res = await postSignin().send({ username: USERNAME, password: PASSWORD }).expect(201)

    const body = res.body as {
      uuid: string
      token: string
      account: { uuid: string; username: string; email: string; display: string; status: string }
      app: { uuid: string; type: string; name: string }
      roles: string[]
    }

    // JWT format: three base64url segments separated by dots.
    expect(body.token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)

    const uuidV7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(body.uuid).toMatch(uuidV7)
    expect(body.account.username).toBe(USERNAME)
    expect(body.account.email).toBe(`${USERNAME}@example.com`)
    expect(body.account.display).toBe('Alice')
    expect(body.account.status).toBe('ACTIVE')
    expect(body.app.type).toBe('INTERNAL_SERVICES')
    expect(body.app.name).toBe('AX SSO')
    expect(body.roles).toEqual(['ADMIN'])

    // Session persisted with the same payload.
    const persisted = await sessionModel.findOne({ token: body.token }).lean().exec()
    expect(persisted?.uuid).toBe(body.uuid)
    expect(persisted?.roles).toEqual(['ADMIN'])
    const seedAccount = await accountModel.findOne({ username: USERNAME }).lean().exec()
    expect(persisted?.account.uuid).toBe(seedAccount?.uuid)
    expect(persisted?.app.name).toBe('AX SSO')

    // JWT payload carries the minimal claims: sub, app, ses, sta, roles (plus standard iat/exp).
    const [, payloadSegment] = body.token.split('.')
    const claims = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf8')) as Record<string, unknown>
    expect(claims.sub).toBe(seedAccount?.uuid)
    expect(claims.app).toBe(APP_KEY)
    expect(claims.ses).toBe(body.uuid)
    expect(claims.sta).toBe('ACTIVE')
    expect(claims.roles).toEqual(['ADMIN'])
    expect(typeof claims.iat).toBe('number')
    expect(typeof claims.exp).toBe('number')
  })
})
