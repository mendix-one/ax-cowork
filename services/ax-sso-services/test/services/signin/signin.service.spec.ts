import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'

import { Account } from '../../../src/acore/database/schemas/account.schema'
import type { AccountStatus } from '../../../src/acore/database/schemas/account.schema'
import { AccountRole } from '../../../src/acore/database/schemas/account-role.schema'
import { App } from '../../../src/acore/database/schemas/app.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { SigninService } from '../../../src/services/signin/signin.service'

const APP_KEY = 'SSO'
const STUB_APP = {
  uuid: 'app-uuid-0000',
  key: APP_KEY,
  type: 'INTERNAL_SERVICES' as const,
  name: 'AX SSO',
  description: 'SSO admin',
  avatar: 'https://cdn.example/sso.png',
}

function mockAppModel(found: typeof STUB_APP | null = STUB_APP) {
  return {
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(found) }),
    }),
  }
}

const STUB_JWT = 'header.payload.signature'

function mockJwtService() {
  return {
    signAsync: jest.fn().mockResolvedValue(STUB_JWT),
  }
}

interface FoundAccount {
  uuid: string
  username: string
  passwordHash: string
  display: string
  email: string
  phone?: string
  avatar?: string
  status: AccountStatus
}

const baseAccount = (overrides: Partial<FoundAccount> = {}): FoundAccount => ({
  uuid: '0190a1b2-c3d4-7e5f-8901-234567890abc',
  username: 'alice',
  passwordHash: '__set in beforeAll__',
  display: 'Alice',
  email: 'alice@example.com',
  phone: '+1-555-0100',
  avatar: 'https://cdn.example/alice.png',
  status: 'ACTIVE',
  ...overrides,
})

function mockAccountModel(found: FoundAccount | null) {
  return {
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(found) }),
    }),
  }
}

function mockAccountRoleModel(roles: string[] = []) {
  return {
    find: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(roles.map((role) => ({ role }))) }),
    }),
  }
}

// UUIDv7 pattern: `<service-generated>` is the actual sessionUuid the service produces via uuidv7().
// Tests assert on shape, not on a fixed value.
const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function mockSessionModel(existing: { uuid: string } | null = null) {
  return {
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(existing) }),
    }),
    updateOne: jest.fn().mockReturnValue({
      exec: () => Promise.resolve({ acknowledged: true, matchedCount: 1, modifiedCount: 1 }),
    }),
    create: jest.fn().mockImplementation((doc: Record<string, unknown>) => Promise.resolve(doc)),
  }
}

describe('SigninService', () => {
  const username = 'alice'
  const password = 'correct horse'
  let passwordHash: string

  beforeAll(async () => {
    passwordHash = await hash(password, 4)
  })

  async function buildService(
    accountModel: ReturnType<typeof mockAccountModel>,
    sessionModel: ReturnType<typeof mockSessionModel>,
    jwt: ReturnType<typeof mockJwtService> = mockJwtService(),
    appModel: ReturnType<typeof mockAppModel> = mockAppModel(),
    accountRoleModel: ReturnType<typeof mockAccountRoleModel> = mockAccountRoleModel(),
  ): Promise<{ service: SigninService; jwt: ReturnType<typeof mockJwtService> }> {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SigninService,
        { provide: getModelToken(Account.name), useValue: accountModel },
        { provide: getModelToken(AccountRole.name), useValue: accountRoleModel },
        { provide: getModelToken(App.name), useValue: appModel },
        { provide: getModelToken(Session.name), useValue: sessionModel },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile()
    return { service: moduleRef.get(SigninService), jwt }
  }

  it('throws UnauthorizedException when the app key is unknown', async () => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const sessionModel = mockSessionModel()
    const appModel = mockAppModel(null)
    const { service } = await buildService(accountModel, sessionModel, mockJwtService(), appModel)

    await expect(service.signin('UNKNOWN', username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
  })

  it('throws UnauthorizedException when the account does not exist (account-lookup branch)', async () => {
    const accountModel = mockAccountModel(null)
    const sessionModel = mockSessionModel()
    const accountRoleModel = mockAccountRoleModel()
    const { service } = await buildService(accountModel, sessionModel, mockJwtService(), mockAppModel(), accountRoleModel)

    await expect(service.signin(APP_KEY, username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
    // Downstream steps (role lookup, JWT signing, session insert) must not run when the account is missing.
    expect(accountRoleModel.find).not.toHaveBeenCalled()
  })

  it('throws UnauthorizedException when the password does not match (password-compare branch)', async () => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const sessionModel = mockSessionModel()
    const accountRoleModel = mockAccountRoleModel()
    const { service } = await buildService(accountModel, sessionModel, mockJwtService(), mockAppModel(), accountRoleModel)

    await expect(service.signin(APP_KEY, username, 'wrong password')).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
    // The status check and role lookup must not run when the password mismatch already disqualifies signin.
    expect(accountRoleModel.find).not.toHaveBeenCalled()
  })

  it('signs a JWT (carrying roles), persists a session, and returns the new response shape', async () => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const sessionModel = mockSessionModel()
    const accountRoleModel = mockAccountRoleModel(['ADMIN', 'MEMBER'])
    const { service, jwt } = await buildService(accountModel, sessionModel, mockJwtService(), mockAppModel(), accountRoleModel)

    const result = await service.signin(APP_KEY, username, password)

    // Role lookup keyed by (account.uuid, app.key)
    expect(accountRoleModel.find).toHaveBeenCalledWith({ account: '0190a1b2-c3d4-7e5f-8901-234567890abc', app: APP_KEY })

    expect(jwt.signAsync).toHaveBeenCalledWith({
      sub: '0190a1b2-c3d4-7e5f-8901-234567890abc',
      app: APP_KEY,
      ses: expect.stringMatching(UUID_V7_PATTERN) as string,
      sta: 'ACTIVE',
      roles: ['ADMIN', 'MEMBER'],
    })

    const expectedAccount = {
      uuid: '0190a1b2-c3d4-7e5f-8901-234567890abc',
      username,
      display: 'Alice',
      email: 'alice@example.com',
      phone: '+1-555-0100',
      avatar: 'https://cdn.example/alice.png',
      status: 'ACTIVE',
    }
    const expectedApp = {
      uuid: STUB_APP.uuid,
      type: STUB_APP.type,
      name: STUB_APP.name,
      description: STUB_APP.description,
      avatar: STUB_APP.avatar,
    }

    expect(sessionModel.create).toHaveBeenCalledTimes(1)
    expect(sessionModel.create).toHaveBeenCalledWith({
      uuid: expect.stringMatching(UUID_V7_PATTERN) as string,
      token: STUB_JWT,
      account: expectedAccount,
      app: expectedApp,
      roles: ['ADMIN', 'MEMBER'],
      expiresAt: expect.any(Date) as Date,
    })

    expect(result.uuid).toMatch(UUID_V7_PATTERN)
    expect(result).toEqual({
      uuid: result.uuid,
      token: STUB_JWT,
      account: expectedAccount,
      app: expectedApp,
      roles: ['ADMIN', 'MEMBER'],
    })

    // The JWT's `ses` claim must equal the session uuid persisted to Mongo.
    const signedArg = (jwt.signAsync.mock.calls[0] as [{ ses: string }])[0]
    const createdArg = (sessionModel.create.mock.calls[0] as [{ uuid: string }])[0]
    expect(signedArg.ses).toBe(createdArg.uuid)
    expect(signedArg.ses).toBe(result.uuid)
  })

  it('reuses the existing session for (account, app) and updates instead of inserting', async () => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const existingUuid = '0190a1b2-c3d4-7e5f-8901-existing0000'
    const sessionModel = mockSessionModel({ uuid: existingUuid })
    const accountRoleModel = mockAccountRoleModel(['ADMIN'])
    const { service, jwt } = await buildService(accountModel, sessionModel, mockJwtService(), mockAppModel(), accountRoleModel)

    const result = await service.signin(APP_KEY, username, password)

    expect(sessionModel.findOne).toHaveBeenCalledWith({ 'account.uuid': '0190a1b2-c3d4-7e5f-8901-234567890abc', 'app.uuid': STUB_APP.uuid }, { uuid: 1 })
    expect(sessionModel.create).not.toHaveBeenCalled()
    expect(sessionModel.updateOne).toHaveBeenCalledTimes(1)
    expect(sessionModel.updateOne).toHaveBeenCalledWith(
      { uuid: existingUuid },
      {
        $set: {
          token: STUB_JWT,
          account: expect.objectContaining({ uuid: '0190a1b2-c3d4-7e5f-8901-234567890abc' }) as unknown,
          app: expect.objectContaining({ uuid: STUB_APP.uuid }) as unknown,
          roles: ['ADMIN'],
          expiresAt: expect.any(Date) as Date,
        },
      },
    )

    // The refreshed JWT must reference the *existing* session uuid (not a fresh one).
    expect(jwt.signAsync).toHaveBeenCalledWith(expect.objectContaining({ ses: existingUuid }))
    expect(result.uuid).toBe(existingUuid)
    expect(result.token).toBe(STUB_JWT)
  })

  it.each(['LOCKED', 'CLOSED'] as const)('throws UnauthorizedException when the account status is %s', async (status) => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash, status }))
    const sessionModel = mockSessionModel()
    const { service } = await buildService(accountModel, sessionModel)

    await expect(service.signin(APP_KEY, username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
  })

  it('passes an empty roles array when the account has none for this app', async () => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const sessionModel = mockSessionModel()
    const accountRoleModel = mockAccountRoleModel([])
    const { service, jwt } = await buildService(accountModel, sessionModel, mockJwtService(), mockAppModel(), accountRoleModel)

    const result = await service.signin(APP_KEY, username, password)
    expect(result.roles).toEqual([])
    expect(jwt.signAsync).toHaveBeenCalledWith(expect.objectContaining({ roles: [] }))
  })
})
