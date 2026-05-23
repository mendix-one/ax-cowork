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
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'
const USERNAME = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('SignoutController (e2e)', () => {
  let app: INestApplication<App>
  let accountModel: Model<Account>
  let appModel: Model<AppDoc>
  let sessionModel: Model<Session>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    accountModel = moduleFixture.get<Model<Account>>(getModelToken(Account.name))
    appModel = moduleFixture.get<Model<AppDoc>>(getModelToken(AppDoc.name))
    sessionModel = moduleFixture.get<Model<Session>>(getModelToken(Session.name))
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    await Promise.all([accountModel.deleteMany({}).exec(), appModel.deleteMany({}).exec(), sessionModel.deleteMany({}).exec()])
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

  async function signinAndGetToken(): Promise<string> {
    const res = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set(APP_KEY_HEADER, 'SSO')
      .send({ username: USERNAME, password: PASSWORD })
      .expect(201)
    return (res.body as { token: string }).token
  }

  it('rejects requests without the API key', async () => {
    await request(app.getHttpServer()).post('/signout').expect(401)
  })

  it('rejects requests without a bearer token', async () => {
    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).expect(401)
  })

  it('rejects requests with a malformed Authorization header', async () => {
    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', 'NotBearer xyz').expect(401)
  })

  it('invalidates the session and returns 204', async () => {
    const token = await signinAndGetToken()
    expect(await sessionModel.findOne({ token }).lean().exec()).not.toBeNull()

    await request(app.getHttpServer()).post('/signout').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${token}`).expect(204)

    expect(await sessionModel.findOne({ token }).lean().exec()).toBeNull()
  })

  it('is idempotent — signing out an unknown token still returns 204', async () => {
    await request(app.getHttpServer())
      .post('/signout')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', 'Bearer unknown-token-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
      .expect(204)
  })
})
