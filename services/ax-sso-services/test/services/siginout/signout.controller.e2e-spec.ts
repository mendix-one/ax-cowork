import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import type { Model } from 'mongoose'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER } from '../../../src/acore/security'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { User } from '../../../src/acore/database/schemas/user.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'
const USERNAME = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('SignoutController (e2e)', () => {
  let app: INestApplication<App>
  let userModel: Model<User>
  let sessionModel: Model<Session>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name))
    sessionModel = moduleFixture.get<Model<Session>>(getModelToken(Session.name))
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    await Promise.all([userModel.deleteMany({}).exec(), sessionModel.deleteMany({}).exec()])
    await userModel.create({ username: USERNAME, passwordHash: await hash(PASSWORD, 4) })
  })

  async function signinAndGetToken(): Promise<string> {
    const res = await request(app.getHttpServer()).post('/signin').set(API_KEY_HEADER, API_KEY).send({ username: USERNAME, password: PASSWORD }).expect(201)
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
