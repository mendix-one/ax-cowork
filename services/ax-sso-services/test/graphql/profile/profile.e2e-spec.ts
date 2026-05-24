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
const APP_KEY = 'SSO'
const USERNAME = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('GraphQL — profile (e2e)', () => {
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
      cdnOwnerId: '00000000-0000-0000-0000-0000000profile',
      status: 'ACTIVE',
    })
    await appModel.create({ key: APP_KEY, type: 'INTERNAL_SERVICES', name: 'AX SSO' })
  })

  async function initializeAndSignin(): Promise<{ token: string; accountUuid: string; sessionUuid: string }> {
    const init = await request(app.getHttpServer()).post('/initialize').set(API_KEY_HEADER, API_KEY).set(APP_KEY_HEADER, APP_KEY).expect(201)
    const initBody = init.body as { token: string }
    const res = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${initBody.token}`)
      .send({ username: USERNAME, password: PASSWORD })
      .expect(201)
    const body = res.body as { token: string; uuid: string; account: { uuid: string } }
    return { token: body.token, accountUuid: body.account.uuid, sessionUuid: body.uuid }
  }

  function gql(query: string, variables?: Record<string, unknown>, bearer?: string) {
    const req = request(app.getHttpServer()).post('/graphql').set(API_KEY_HEADER, API_KEY)
    if (bearer) req.set('Authorization', `Bearer ${bearer}`)
    return req.send({ query, variables })
  }

  it('rejects getProfile without a bearer token (SecurityCheckGuard returns 401 as a GraphQL error)', async () => {
    const res = await gql('{ getProfile { account { uuid } } }').expect(200)
    const body = res.body as { errors?: { message: string }[] }
    expect(body.errors).toBeDefined()
    expect(body.errors?.[0].message).toMatch(/bearer/i)
  })

  it('getProfile returns the caller account and active sessions, never someone else', async () => {
    const { token, accountUuid, sessionUuid } = await initializeAndSignin()

    // Seed a stray session that belongs to a different account — it must NOT appear in the response.
    await sessionModel.create({
      account: {
        uuid: 'a-different-account',
        username: 'bob',
        display: 'Bob',
        email: 'bob@example.com',
        status: 'ACTIVE',
      },
      app: { uuid: 'app-x', key: 'OTHER', type: 'INTERNAL_SERVICES', name: 'Other' },
      roles: [],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })

    const query = `{
      getProfile {
        account { uuid username email status }
        sessions { uuid app { uuid key name } }
      }
    }`
    const res = await gql(query, undefined, token).expect(200)
    const body = res.body as {
      data: {
        getProfile: {
          account: { uuid: string; username: string; email: string; status: string }
          sessions: { uuid: string; app: { uuid: string; key: string; name: string } }[]
        }
      }
    }
    expect(body.data.getProfile.account.uuid).toBe(accountUuid)
    expect(body.data.getProfile.account.username).toBe(USERNAME)
    expect(body.data.getProfile.sessions).toHaveLength(1)
    expect(body.data.getProfile.sessions[0].uuid).toBe(sessionUuid)
    expect(body.data.getProfile.sessions[0].app.name).toBe('AX SSO')
  })

  it('updateProfile mutates the caller record and ignores any client-supplied account header', async () => {
    const { token, accountUuid } = await initializeAndSignin()

    const mutation = `mutation UP($input: UpdateProfileInput!) {
      updateProfile(input: $input) { uuid display phone email }
    }`
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${token}`)
      .set('account', 'a-different-account')
      .send({ query: mutation, variables: { input: { display: 'Alice Updated', phone: '+1-555-9999' } } })
      .expect(200)

    const body = res.body as { data: { updateProfile: { uuid: string; display: string; phone: string; email: string } } }
    expect(body.data.updateProfile.uuid).toBe(accountUuid)
    expect(body.data.updateProfile.display).toBe('Alice Updated')
    expect(body.data.updateProfile.phone).toBe('+1-555-9999')

    const persisted = await accountModel.findOne({ uuid: accountUuid }).lean().exec()
    expect(persisted?.display).toBe('Alice Updated')
  })

  it('killSession removes the caller-owned session and returns true', async () => {
    const { token, sessionUuid } = await initializeAndSignin()

    const mutation = 'mutation Kill($uuid: ID!) { killSession(uuid: $uuid) }'
    const res = await gql(mutation, { uuid: sessionUuid }, token).expect(200)
    const body = res.body as { data: { killSession: boolean } }
    expect(body.data.killSession).toBe(true)

    expect(await sessionModel.findOne({ uuid: sessionUuid }).lean().exec()).toBeNull()
  })

  it('killSession returns a Forbidden error when trying to kill a session belonging to someone else', async () => {
    const { token } = await initializeAndSignin()

    const foreign = await sessionModel.create({
      account: { uuid: 'a-different-account', username: 'bob', display: 'Bob', email: 'bob@example.com', status: 'ACTIVE' },
      app: { uuid: 'app-x', key: 'OTHER', type: 'INTERNAL_SERVICES', name: 'Other' },
      roles: [],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })

    const mutation = 'mutation Kill($uuid: ID!) { killSession(uuid: $uuid) }'
    const res = await gql(mutation, { uuid: foreign.uuid }, token).expect(200)
    const body = res.body as { errors?: { message: string }[] }
    expect(body.errors?.[0].message).toMatch(/does not belong/i)

    expect(await sessionModel.findOne({ uuid: foreign.uuid }).lean().exec()).not.toBeNull()
  })

  it('killSession returns false (no error) when the uuid simply does not exist', async () => {
    const { token } = await initializeAndSignin()
    const mutation = 'mutation Kill($uuid: ID!) { killSession(uuid: $uuid) }'
    const res = await gql(mutation, { uuid: 'never-existed' }, token).expect(200)
    const body = res.body as { data: { killSession: boolean } }
    expect(body.data.killSession).toBe(false)
  })
})
