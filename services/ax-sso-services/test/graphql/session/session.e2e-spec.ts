import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import type { Model } from 'mongoose'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER } from '../../../src/acore/security'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'

describe('GraphQL — session (e2e)', () => {
  let app: INestApplication<App>
  let sessionModel: Model<Session>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    sessionModel = moduleFixture.get<Model<Session>>(getModelToken(Session.name))
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    await sessionModel.deleteMany({}).exec()
  })

  async function seedSession(token: string): Promise<Session> {
    const doc = await sessionModel.create({
      token,
      account: {
        uuid: '0190a1b2-c3d4-7e5f-8901-234567890abc',
        username: 'alice',
        display: 'Alice',
        email: 'alice@example.com',
        status: 'ACTIVE',
      },
      app: {
        uuid: 'app-uuid-stub',
        type: 'INTERNAL_SERVICES',
        name: 'AX SSO',
        description: 'Single sign-on administration',
      },
      roles: [],
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })
    return doc.toObject()
  }

  function gql(query: string, variables?: Record<string, unknown>) {
    return request(app.getHttpServer()).post('/graphql').set(API_KEY_HEADER, API_KEY).send({ query, variables })
  }

  it('rejects requests without the API key', async () => {
    // Apollo surfaces guard-thrown exceptions as GraphQL errors at HTTP 200, not as a top-level 401.
    const query = '{ session(token: "anything") { uuid } }'
    const res = await request(app.getHttpServer()).post('/graphql').send({ query }).expect(200)
    const body = res.body as { errors?: { message: string }[]; data: unknown }
    expect(body.errors).toBeDefined()
    expect(body.errors?.[0].message).toMatch(/api key/i)
  })

  describe('query session', () => {
    it('returns the session and embedded account by token', async () => {
      const session = await seedSession('t-abc')

      const query = `
        query GetSession($token: String!) {
          session(token: $token) { uuid token account { username status email } }
        }
      `
      const res = await gql(query, { token: 't-abc' }).expect(200)
      const body = res.body as { data: { session: Record<string, unknown> | null } }
      expect(body.data.session).toEqual({
        uuid: session.uuid,
        token: 't-abc',
        account: { username: 'alice', status: 'ACTIVE', email: 'alice@example.com' },
      })
    })

    it('returns null when the token does not match a session', async () => {
      const query = `query { session(token: "missing") { uuid } }`
      const res = await gql(query).expect(200)
      const body = res.body as { data: { session: unknown } }
      expect(body.data.session).toBeNull()
    })
  })

  describe('mutation removeSession', () => {
    it('removes the session and returns true', async () => {
      await seedSession('to-remove')

      const mutation = 'mutation Remove($token: String!) { removeSession(token: $token) }'
      const res = await gql(mutation, { token: 'to-remove' }).expect(200)
      const body = res.body as { data: { removeSession: boolean } }
      expect(body.data.removeSession).toBe(true)

      const persisted = await sessionModel.findOne({ token: 'to-remove' }).lean().exec()
      expect(persisted).toBeNull()
    })

    it('returns false when the token does not match anything', async () => {
      const mutation = 'mutation Remove($token: String!) { removeSession(token: $token) }'
      const res = await gql(mutation, { token: 'unknown' }).expect(200)
      const body = res.body as { data: { removeSession: boolean } }
      expect(body.data.removeSession).toBe(false)
    })
  })
})
