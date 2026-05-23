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

describe('SignoutController (e2e)', () => {
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
    await accountRoleModel.create({ account: seeded.uuid, app: APP_KEY, role: 'ADMIN' })
  })

  async function initializeAndSignin(): Promise<{ signedInToken: string; sessionUuid: string }> {
    const init = await request(app.getHttpServer()).post('/session/initialize').set(API_KEY_HEADER, API_KEY).set(APP_KEY_HEADER, APP_KEY).expect(201)
    const initBody = init.body as { token: string; uuid: string }
    const signin = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${initBody.token}`)
      .send({ username: USERNAME, password: PASSWORD })
      .expect(201)
    const signinBody = signin.body as { token: string; uuid: string }
    return { signedInToken: signinBody.token, sessionUuid: signinBody.uuid }
  }

  it('rejects requests without the API key', async () => {
    await request(app.getHttpServer()).post('/signout').expect(401)
  })

  it('rejects requests without a bearer token (SecurityCheckGuard)', async () => {
    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).expect(401)
  })

  it('rejects an arbitrary (non-JWT) bearer with 401', async () => {
    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', 'Bearer not-a-jwt').expect(401)
  })

  it('detaches account + clears roles + cascade-deletes tokens, returning 200', async () => {
    const { signedInToken, sessionUuid } = await initializeAndSignin()

    // Mint a derived app token so we can verify the cascade delete.
    await request(app.getHttpServer()).post('/token').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${signedInToken}`).send({ scope: APP_KEY }).expect(201)
    expect(await tokenModel.find({ session: sessionUuid }).lean().exec()).toHaveLength(1)

    const res = await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${signedInToken}`).expect(200)
    expect(res.body).toEqual({ statusCode: 200, message: 'Signed out successfully' })

    // Session row remains but is now anonymous; tokens are gone.
    const after = await sessionModel.findOne({ uuid: sessionUuid }).lean().exec()
    expect(after).not.toBeNull()
    expect(after?.account).toBeUndefined()
    expect(after?.roles).toEqual([])
    expect(await tokenModel.find({ session: sessionUuid }).lean().exec()).toHaveLength(0)
  })

  it('returns HTTP 200 with a 400 payload when the session was already removed out-of-band', async () => {
    const { signedInToken, sessionUuid } = await initializeAndSignin()
    await sessionModel.deleteOne({ uuid: sessionUuid }).exec()

    const res = await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${signedInToken}`).expect(200)
    expect(res.body).toEqual({ statusCode: 400, message: 'Session not found' })
  })

  it('returns HTTP 200 with a 400 payload on a second signout (session is already anonymous)', async () => {
    const { signedInToken } = await initializeAndSignin()
    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${signedInToken}`).expect(200)

    // Second signout — same bearer, but the session no longer carries an account.
    const res = await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${signedInToken}`).expect(200)
    expect(res.body).toEqual({ statusCode: 400, message: 'Session is not signed in' })
  })
})
