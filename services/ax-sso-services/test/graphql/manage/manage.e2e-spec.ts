import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { compare, hash } from 'bcryptjs'
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
const ADMIN_USER = 'admin'
const REGULAR_USER = 'alice'
const PASSWORD = 'correct horse battery staple'

describe('GraphQL — manage (e2e)', () => {
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
    const adminDoc = await accountModel.create({
      username: ADMIN_USER,
      passwordHash: await hash(PASSWORD, 4),
      display: 'Admin',
      email: `${ADMIN_USER}@example.com`,
      cdnOwnerId: '00000000-0000-0000-0000-00000manage001',
      status: 'ACTIVE',
    })
    await accountModel.create({
      username: REGULAR_USER,
      passwordHash: await hash(PASSWORD, 4),
      display: 'Alice',
      email: `${REGULAR_USER}@example.com`,
      cdnOwnerId: '00000000-0000-0000-0000-00000manage002',
      status: 'ACTIVE',
    })
    await appModel.create({ key: APP_KEY, type: 'INTERNAL_SERVICES', name: 'AX SSO' })
    // ADMIN role only on the admin account — alice is a regular user.
    await accountRoleModel.create({ account: adminDoc.uuid, app: APP_KEY, role: 'ADMIN' })
  })

  async function signinAs(username: string): Promise<string> {
    // New flow: initialize anonymous session first, then attach an account via /signin.
    const init = await request(app.getHttpServer()).post('/initialize').set(API_KEY_HEADER, API_KEY).set(APP_KEY_HEADER, APP_KEY).expect(201)
    const initBody = init.body as { token: string }
    const res = await request(app.getHttpServer())
      .post('/signin')
      .set(API_KEY_HEADER, API_KEY)
      .set('Authorization', `Bearer ${initBody.token}`)
      .send({ username, password: PASSWORD })
      .expect(201)
    return (res.body as { token: string }).token
  }

  function gql(query: string, variables: Record<string, unknown> | undefined, bearer: string) {
    return request(app.getHttpServer()).post('/graphql').set(API_KEY_HEADER, API_KEY).set('Authorization', `Bearer ${bearer}`).send({ query, variables })
  }

  it('rejects getList for a signed-in caller WITHOUT the ADMIN role (Forbidden GraphQL error)', async () => {
    const aliceBearer = await signinAs(REGULAR_USER)
    const res = await gql('{ getList { uuid username } }', undefined, aliceBearer).expect(200)
    const body = res.body as { errors?: { message: string }[]; data?: unknown }
    expect(body.errors).toBeDefined()
    expect(body.errors?.[0].message).toMatch(/role/i)
  })

  it('getList returns all accounts (newest first) for an ADMIN caller', async () => {
    const adminBearer = await signinAs(ADMIN_USER)
    const res = await gql('{ getList { uuid username status } }', undefined, adminBearer).expect(200)
    const body = res.body as { data: { getList: { uuid: string; username: string; status: string }[] } }
    expect(body.data.getList).toHaveLength(2)
    expect(body.data.getList.map((a) => a.username).sort()).toEqual([ADMIN_USER, REGULAR_USER].sort())
  })

  it('getDetail returns a single account by uuid, or null when missing', async () => {
    const adminBearer = await signinAs(ADMIN_USER)
    const alice = await accountModel.findOne({ username: REGULAR_USER }).lean().exec()

    const found = await gql('query Q($uuid: ID!) { getDetail(uuid: $uuid) { uuid username } }', { uuid: alice!.uuid }, adminBearer).expect(200)
    expect((found.body as { data: { getDetail: { uuid: string } | null } }).data.getDetail?.uuid).toBe(alice!.uuid)

    const missing = await gql('query Q($uuid: ID!) { getDetail(uuid: $uuid) { uuid } }', { uuid: 'never-existed' }, adminBearer).expect(200)
    expect((missing.body as { data: { getDetail: unknown } }).data.getDetail).toBeNull()
  })

  it('createAccount inserts a new bcrypt-hashed account and surfaces it via getDetail', async () => {
    const adminBearer = await signinAs(ADMIN_USER)
    const input = { username: 'bob', password: 'hunter2hunter2', display: 'Bob', email: 'bob@example.com' }

    const res = await gql(
      `mutation Create($input: CreateAccountInput!) {
        createAccount(input: $input) { uuid username display email status }
      }`,
      { input },
      adminBearer,
    ).expect(200)

    const body = res.body as { data: { createAccount: { uuid: string; username: string; status: string } } }
    expect(body.data.createAccount.username).toBe('bob')
    expect(body.data.createAccount.status).toBe('ACTIVE')

    const persisted = await accountModel.findOne({ uuid: body.data.createAccount.uuid }).lean().exec()
    expect(persisted).not.toBeNull()
    // Password is bcrypt-hashed, never stored or surfaced as plaintext.
    expect(persisted!.passwordHash).not.toBe(input.password)
    expect(await compare(input.password, persisted!.passwordHash)).toBe(true)
  })

  it('createAccount rejects duplicates (same username) with a Conflict error', async () => {
    const adminBearer = await signinAs(ADMIN_USER)
    // `alice` is already seeded in beforeEach.
    const res = await gql(
      'mutation Create($input: CreateAccountInput!) { createAccount(input: $input) { uuid } }',
      { input: { username: REGULAR_USER, password: 'hunter2hunter2', display: 'Dup', email: 'dup@example.com' } },
      adminBearer,
    ).expect(200)
    const body = res.body as { errors?: { message: string }[] }
    expect(body.errors).toBeDefined()
    expect(body.errors?.[0].message).toMatch(/already exists/i)
  })

  it('updateAccount mutates the targeted account and returns the new shape', async () => {
    const adminBearer = await signinAs(ADMIN_USER)
    const alice = await accountModel.findOne({ username: REGULAR_USER }).lean().exec()

    const res = await gql(
      `mutation Up($uuid: ID!, $input: UpdateAccountInput!) {
        updateAccount(uuid: $uuid, input: $input) { uuid status display }
      }`,
      { uuid: alice!.uuid, input: { status: 'LOCKED', display: 'Alice (locked)' } },
      adminBearer,
    ).expect(200)

    const body = res.body as { data: { updateAccount: { uuid: string; status: string; display: string } } }
    expect(body.data.updateAccount.uuid).toBe(alice!.uuid)
    expect(body.data.updateAccount.status).toBe('LOCKED')
    expect(body.data.updateAccount.display).toBe('Alice (locked)')

    const persisted = await accountModel.findOne({ uuid: alice!.uuid }).lean().exec()
    expect(persisted?.status).toBe('LOCKED')
  })

  it('updateAccount returns a NotFound error when the uuid does not exist', async () => {
    const adminBearer = await signinAs(ADMIN_USER)
    const res = await gql(
      'mutation Up($uuid: ID!, $input: UpdateAccountInput!) { updateAccount(uuid: $uuid, input: $input) { uuid } }',
      { uuid: 'never-existed', input: { status: 'LOCKED' } },
      adminBearer,
    ).expect(200)
    const body = res.body as { errors?: { message: string }[] }
    expect(body.errors).toBeDefined()
    expect(body.errors?.[0].message).toMatch(/not found/i)
  })

  it('every manage mutation/query is gated — alice (no ADMIN role) cannot createAccount either', async () => {
    const aliceBearer = await signinAs(REGULAR_USER)
    const res = await gql(
      'mutation Create($input: CreateAccountInput!) { createAccount(input: $input) { uuid } }',
      { input: { username: 'charlie', password: 'hunter2hunter2', display: 'Charlie', email: 'charlie@example.com' } },
      aliceBearer,
    ).expect(200)
    const body = res.body as { errors?: { message: string }[] }
    expect(body.errors?.[0].message).toMatch(/role/i)
    // Nothing was inserted as a side effect.
    expect(await accountModel.findOne({ username: 'charlie' }).lean().exec()).toBeNull()
  })
})
