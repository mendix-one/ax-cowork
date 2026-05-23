import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import type { Model } from 'mongoose'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER } from '../../../src/acore/security'
import { Account } from '../../../src/acore/database/schemas/account.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'
const USERNAME = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('SigninController (e2e)', () => {
  let app: INestApplication<App>
  let accountModel: Model<Account>
  let sessionModel: Model<Session>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    accountModel = moduleFixture.get<Model<Account>>(getModelToken(Account.name))
    sessionModel = moduleFixture.get<Model<Session>>(getModelToken(Session.name))
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    await Promise.all([accountModel.deleteMany({}).exec(), sessionModel.deleteMany({}).exec()])
    await accountModel.create({
      username: USERNAME,
      passwordHash: await hash(PASSWORD, 4),
      display: 'Alice',
      email: `${USERNAME}@example.com`,
      cdnOwnerId: '00000000-0000-0000-0000-000000000001',
      status: 'ACTIVE',
    })
  })

  it('rejects requests without the API key', async () => {
    await request(app.getHttpServer()).post('/signin').send({ username: USERNAME, password: PASSWORD }).expect(401)
  })

  it('rejects malformed bodies with 400', async () => {
    await request(app.getHttpServer()).post('/signin').set(API_KEY_HEADER, API_KEY).send({ username: USERNAME }).expect(400)
  })

  it('rejects unknown accounts with 401', async () => {
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
    // UUIDv7: 8-4-4(starts with 7)-4-12 hex.
    const uuidV7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(persisted?.uuid).toMatch(uuidV7)
    expect(persisted?.account.uuid).toMatch(uuidV7)
    expect(persisted?.account.username).toBe(USERNAME)
    expect(persisted?.account.email).toBe(`${USERNAME}@example.com`)
    expect(persisted?.account.display).toBe('Alice')
    expect(persisted?.account.status).toBe('ACTIVE')

    // The session's embedded account.uuid must match the source account's uuid in the accounts collection.
    const seedAccount = await accountModel.findOne({ username: USERNAME }).lean().exec()
    expect(persisted?.account.uuid).toBe(seedAccount?.uuid)
  })
})
