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

describe('SigninController (e2e)', () => {
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

  it('rejects requests without the API key', async () => {
    await request(app.getHttpServer()).post('/signin').send({ username: USERNAME, password: PASSWORD }).expect(401)
  })

  it('rejects malformed bodies with 400', async () => {
    await request(app.getHttpServer()).post('/signin').set(API_KEY_HEADER, API_KEY).send({ username: USERNAME }).expect(400)
  })

  it('rejects unknown users with 401', async () => {
    await request(app.getHttpServer()).post('/signin').set(API_KEY_HEADER, API_KEY).send({ username: 'nobody', password: PASSWORD }).expect(401)
  })

  it('rejects wrong passwords with 401', async () => {
    await request(app.getHttpServer()).post('/signin').set(API_KEY_HEADER, API_KEY).send({ username: USERNAME, password: 'wrong' }).expect(401)
  })

  it('returns a token + expiresAt on valid credentials and persists the session', async () => {
    const res = await request(app.getHttpServer()).post('/signin').set(API_KEY_HEADER, API_KEY).send({ username: USERNAME, password: PASSWORD }).expect(201)

    const body = res.body as { token: string; expiresAt: string }
    expect(body.token).toMatch(/^[a-f0-9]{64}$/)
    expect(new Date(body.expiresAt).getTime()).toBeGreaterThan(Date.now())

    const persisted = await sessionModel.findOne({ token: body.token }).lean().exec()
    expect(persisted).not.toBeNull()
    expect(persisted?.username).toBe(USERNAME)
  })
})
