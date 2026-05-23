import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import type { Model } from 'mongoose'
import request from 'supertest'
import { App } from 'supertest/types'

import { API_KEY_HEADER } from '../../../src/acore/security'
import { Account } from '../../../src/acore/database/schemas/account.schema'
import { MainModule } from '../../../src/main.module'

const API_KEY = 'e2e-test-key'

describe('GraphQL — account (e2e)', () => {
  let app: INestApplication<App>
  let accountModel: Model<Account>

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [MainModule] }).compile()
    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
    await app.init()

    accountModel = moduleFixture.get<Model<Account>>(getModelToken(Account.name))
  }, 30_000)

  afterAll(async () => {
    if (app) await app.close()
  })

  beforeEach(async () => {
    await accountModel.deleteMany({}).exec()
  })

  async function seedAccount(overrides: Partial<Account> = {}): Promise<Account> {
    const doc = await accountModel.create({
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
    const query = '{ accountInfo(uuid: "anything") { uuid } }'
    const res = await request(app.getHttpServer()).post('/graphql').send({ query }).expect(200)
    const body = res.body as { errors?: { message: string }[]; data: unknown }
    expect(body.errors).toBeDefined()
    expect(body.errors?.[0].message).toMatch(/api key/i)
  })

  describe('query accountInfo', () => {
    it('returns the account fields by uuid', async () => {
      const account = await seedAccount({ display: 'Alice A.', phone: '+1-555-0100' })

      const query = `
        query GetAccount($uuid: ID!) {
          accountInfo(uuid: $uuid) { uuid username display email phone status }
        }
      `
      const res = await gql(query, { uuid: account.uuid }).expect(200)
      const body = res.body as { data: { accountInfo: Record<string, unknown> | null } }
      expect(body.data.accountInfo).toEqual({
        uuid: account.uuid,
        username: 'alice',
        display: 'Alice A.',
        email: 'alice@example.com',
        phone: '+1-555-0100',
        status: 'ACTIVE',
      })
    })

    it('returns null when the uuid does not exist', async () => {
      const query = `query { accountInfo(uuid: "missing-uuid") { uuid } }`
      const res = await gql(query).expect(200)
      const body = res.body as { data: { accountInfo: unknown } }
      expect(body.data.accountInfo).toBeNull()
    })
  })

  describe('query accounts (list)', () => {
    it('returns all accounts', async () => {
      const a = await seedAccount({ username: 'a', email: 'a@ex.com', display: 'A' })
      const b = await seedAccount({ username: 'b', email: 'b@ex.com', display: 'B' })
      const c = await seedAccount({ username: 'c', email: 'c@ex.com', display: 'C' })

      const query = `{ accounts { uuid username } }`
      const res = await gql(query).expect(200)
      const body = res.body as { data: { accounts: { uuid: string; username: string }[] } }
      const usernames = body.data.accounts.map((u) => u.username)
      // Sort order can't be asserted here — three sub-millisecond inserts share the same `createdAt`.
      expect(new Set(usernames)).toEqual(new Set([a.username, b.username, c.username]))
    })

    it('filters by status', async () => {
      await seedAccount({ username: 'active1', email: 'ac1@ex.com', status: 'ACTIVE' })
      await seedAccount({ username: 'locked1', email: 'lk1@ex.com', status: 'LOCKED' })

      const query = `query Accounts($status: AccountStatus) { accounts(status: $status) { username status } }`
      const res = await gql(query, { status: 'LOCKED' }).expect(200)
      const body = res.body as { data: { accounts: { username: string; status: string }[] } }
      expect(body.data.accounts).toEqual([{ username: 'locked1', status: 'LOCKED' }])
    })

    it('respects limit and skip', async () => {
      await seedAccount({ username: 'u1', email: 'u1@ex.com' })
      await seedAccount({ username: 'u2', email: 'u2@ex.com' })
      await seedAccount({ username: 'u3', email: 'u3@ex.com' })

      const query = `query Accounts($limit: Int, $skip: Int) { accounts(limit: $limit, skip: $skip) { username } }`
      const res = await gql(query, { limit: 1, skip: 1 }).expect(200)
      const body = res.body as { data: { accounts: { username: string }[] } }
      expect(body.data.accounts).toHaveLength(1)
    })
  })

  describe('mutation updateAccountInfo', () => {
    it('updates the listed fields and leaves others intact', async () => {
      const account = await seedAccount({ display: 'Original', phone: '+1' })

      const mutation = `
        mutation Update($uuid: ID!, $input: UpdateAccountInfoInput!) {
          updateAccountInfo(uuid: $uuid, input: $input) { display email phone }
        }
      `
      const res = await gql(mutation, { uuid: account.uuid, input: { display: 'Updated' } }).expect(200)
      const body = res.body as { data: { updateAccountInfo: Record<string, unknown> } }
      expect(body.data.updateAccountInfo).toEqual({ display: 'Updated', email: 'alice@example.com', phone: '+1' })

      // Verify persistence: phone stayed, display changed.
      const persisted = await accountModel.findOne({ uuid: account.uuid }).lean().exec()
      expect(persisted?.display).toBe('Updated')
      expect(persisted?.phone).toBe('+1')
    })

    it('rejects invalid email with a validation error from the GraphQL layer', async () => {
      const account = await seedAccount()
      const mutation = `
        mutation Update($uuid: ID!, $input: UpdateAccountInfoInput!) {
          updateAccountInfo(uuid: $uuid, input: $input) { email }
        }
      `
      const res = await gql(mutation, { uuid: account.uuid, input: { email: 'not-an-email' } }).expect(200)
      const body = res.body as { errors?: unknown[]; data: unknown }
      expect(body.errors).toBeDefined()
    })

    it('returns a NotFound error for an unknown uuid', async () => {
      const mutation = `
        mutation Update($uuid: ID!, $input: UpdateAccountInfoInput!) {
          updateAccountInfo(uuid: $uuid, input: $input) { display }
        }
      `
      const res = await gql(mutation, { uuid: 'missing-uuid', input: { display: 'X' } }).expect(200)
      const body = res.body as { errors?: unknown[]; data: { updateAccountInfo: unknown } | null }
      expect(body.errors).toBeDefined()
      expect(body.data?.updateAccountInfo ?? null).toBeNull()
    })
  })
})
