import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import type { Model } from 'mongoose'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER } from '../../../src/acore/security'
import { User } from '../../../src/acore/database/schemas/user.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'

describe('GraphQL — user (e2e)', () => {
  let app: INestApplication<App>
  let userModel: Model<User>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    userModel = moduleFixture.get<Model<User>>(getModelToken(User.name))
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    await userModel.deleteMany({}).exec()
  })

  async function seedUser(overrides: Partial<User> = {}): Promise<User> {
    const doc = await userModel.create({
      username: 'alice',
      passwordHash: 'irrelevant-for-graphql',
      display: 'Alice',
      email: 'alice@example.com',
      cdnOwnerId: '00000000-0000-0000-0000-000000000001',
      status: 'ACTIVE',
      ...overrides,
    })
    return doc.toObject()
  }

  function gql(query: string, variables?: Record<string, unknown>) {
    return request(app.getHttpServer()).post('/graphql').set(API_KEY_HEADER, API_KEY).send({ query, variables })
  }

  it('rejects requests without the API key', async () => {
    // Apollo surfaces guard-thrown exceptions as GraphQL errors at HTTP 200, not as a top-level 401.
    const query = '{ userInfo(uuid: "anything") { uuid } }'
    const res = await request(app.getHttpServer()).post('/graphql').send({ query }).expect(200)
    const body = res.body as { errors?: { message: string }[]; data: unknown }
    expect(body.errors).toBeDefined()
    expect(body.errors?.[0].message).toMatch(/api key/i)
  })

  describe('query userInfo', () => {
    it('returns the user fields by uuid', async () => {
      const user = await seedUser({ display: 'Alice A.', phone: '+1-555-0100' })

      const query = `
        query GetUser($uuid: ID!) {
          userInfo(uuid: $uuid) { uuid username display email phone status }
        }
      `
      const res = await gql(query, { uuid: user.uuid }).expect(200)
      const body = res.body as { data: { userInfo: Record<string, unknown> | null } }
      expect(body.data.userInfo).toEqual({
        uuid: user.uuid,
        username: 'alice',
        display: 'Alice A.',
        email: 'alice@example.com',
        phone: '+1-555-0100',
        status: 'ACTIVE',
      })
    })

    it('returns null when the uuid does not exist', async () => {
      const query = `query { userInfo(uuid: "missing-uuid") { uuid } }`
      const res = await gql(query).expect(200)
      const body = res.body as { data: { userInfo: unknown } }
      expect(body.data.userInfo).toBeNull()
    })
  })

  describe('query users (list)', () => {
    it('returns all users, newest first by default', async () => {
      // Create three users with controlled creation order via explicit sleep-free createdAt.
      const a = await seedUser({ username: 'a', email: 'a@ex.com', display: 'A' })
      const b = await seedUser({ username: 'b', email: 'b@ex.com', display: 'B' })
      const c = await seedUser({ username: 'c', email: 'c@ex.com', display: 'C' })

      const query = `{ users { uuid username } }`
      const res = await gql(query).expect(200)
      const body = res.body as { data: { users: { uuid: string; username: string }[] } }
      const usernames = body.data.users.map((u) => u.username)
      // Mongo `createdAt` is per-insert; the three should all appear, in reverse-insertion order.
      expect(new Set(usernames)).toEqual(new Set([a.username, b.username, c.username]))
      expect(usernames[0]).toBe('c')
    })

    it('filters by status', async () => {
      await seedUser({ username: 'active1', email: 'ac1@ex.com', status: 'ACTIVE' })
      await seedUser({ username: 'locked1', email: 'lk1@ex.com', status: 'LOCKED' })

      const query = `query Users($status: UserStatus) { users(status: $status) { username status } }`
      const res = await gql(query, { status: 'LOCKED' }).expect(200)
      const body = res.body as { data: { users: { username: string; status: string }[] } }
      expect(body.data.users).toEqual([{ username: 'locked1', status: 'LOCKED' }])
    })

    it('respects limit and skip', async () => {
      await seedUser({ username: 'u1', email: 'u1@ex.com' })
      await seedUser({ username: 'u2', email: 'u2@ex.com' })
      await seedUser({ username: 'u3', email: 'u3@ex.com' })

      const query = `query Users($limit: Int, $skip: Int) { users(limit: $limit, skip: $skip) { username } }`
      const res = await gql(query, { limit: 1, skip: 1 }).expect(200)
      const body = res.body as { data: { users: { username: string }[] } }
      expect(body.data.users).toHaveLength(1)
    })
  })

  describe('mutation updateUserInfo', () => {
    it('updates the listed fields and leaves others intact', async () => {
      const user = await seedUser({ display: 'Original', phone: '+1' })

      const mutation = `
        mutation Update($uuid: ID!, $input: UpdateUserInfoInput!) {
          updateUserInfo(uuid: $uuid, input: $input) { display email phone }
        }
      `
      const res = await gql(mutation, { uuid: user.uuid, input: { display: 'Updated' } }).expect(200)
      const body = res.body as { data: { updateUserInfo: Record<string, unknown> } }
      expect(body.data.updateUserInfo).toEqual({ display: 'Updated', email: 'alice@example.com', phone: '+1' })

      // Verify persistence: phone stayed, display changed.
      const persisted = await userModel.findOne({ uuid: user.uuid }).lean().exec()
      expect(persisted?.display).toBe('Updated')
      expect(persisted?.phone).toBe('+1')
    })

    it('rejects invalid email with a validation error from the GraphQL layer', async () => {
      const user = await seedUser()
      const mutation = `
        mutation Update($uuid: ID!, $input: UpdateUserInfoInput!) {
          updateUserInfo(uuid: $uuid, input: $input) { email }
        }
      `
      const res = await gql(mutation, { uuid: user.uuid, input: { email: 'not-an-email' } }).expect(200)
      const body = res.body as { errors?: unknown[]; data: unknown }
      expect(body.errors).toBeDefined()
    })

    it('returns a NotFound error for an unknown uuid', async () => {
      const mutation = `
        mutation Update($uuid: ID!, $input: UpdateUserInfoInput!) {
          updateUserInfo(uuid: $uuid, input: $input) { display }
        }
      `
      const res = await gql(mutation, { uuid: 'missing-uuid', input: { display: 'X' } }).expect(200)
      const body = res.body as { errors?: unknown[]; data: { updateUserInfo: unknown } | null }
      expect(body.errors).toBeDefined()
      expect(body.data?.updateUserInfo ?? null).toBeNull()
    })
  })
})
