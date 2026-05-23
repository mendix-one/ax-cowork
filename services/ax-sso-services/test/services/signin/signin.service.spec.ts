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
import { Token } from '../../../src/acore/database/schemas/token.schema'
import { SigninService } from '../../../src/services/signin/signin.service'

const APP_KEY = 'SSO'
const SESSION_UUID = '0190a1b2-c3d4-7e5f-8901-session00000'

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

interface ExistingSession {
  uuid: string
  app: { key: string }
  account?: { uuid: string }
}

const anonymousSession = (overrides: Partial<ExistingSession> = {}): ExistingSession => ({
  uuid: SESSION_UUID,
  app: { key: APP_KEY },
  ...overrides,
})

function mockSessionModel(existing: ExistingSession | null = anonymousSession()) {
  return {
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(existing) }),
    }),
    updateOne: jest.fn().mockReturnValue({
      exec: () => Promise.resolve({ acknowledged: true, matchedCount: 1, modifiedCount: 1 }),
    }),
  }
}

function mockTokenModel() {
  return {
    deleteMany: jest.fn().mockReturnValue({
      exec: () => Promise.resolve({ acknowledged: true, deletedCount: 0 }),
    }),
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
    tokenModel: ReturnType<typeof mockTokenModel> = mockTokenModel(),
    jwt: ReturnType<typeof mockJwtService> = mockJwtService(),
    appModel: ReturnType<typeof mockAppModel> = mockAppModel(),
    accountRoleModel: ReturnType<typeof mockAccountRoleModel> = mockAccountRoleModel(),
  ): Promise<{
    service: SigninService
    jwt: ReturnType<typeof mockJwtService>
    sessionModel: ReturnType<typeof mockSessionModel>
    tokenModel: ReturnType<typeof mockTokenModel>
  }> {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SigninService,
        { provide: getModelToken(Account.name), useValue: accountModel },
        { provide: getModelToken(AccountRole.name), useValue: accountRoleModel },
        { provide: getModelToken(App.name), useValue: appModel },
        { provide: getModelToken(Session.name), useValue: sessionModel },
        { provide: getModelToken(Token.name), useValue: tokenModel },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile()
    return { service: moduleRef.get(SigninService), jwt, sessionModel, tokenModel }
  }

  it('throws UnauthorizedException when the session is unknown', async () => {
    const sessionModel = mockSessionModel(null)
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const { service } = await buildService(accountModel, sessionModel)

    await expect(service.signin(APP_KEY, SESSION_UUID, username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    // Downstream lookups never run — bail before app/account resolution.
    expect(accountModel.findOne).not.toHaveBeenCalled()
  })

  it('throws UnauthorizedException when the session belongs to a different app', async () => {
    const sessionModel = mockSessionModel(anonymousSession({ app: { key: 'OTHER_APP' } }))
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const { service } = await buildService(accountModel, sessionModel)

    await expect(service.signin(APP_KEY, SESSION_UUID, username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(accountModel.findOne).not.toHaveBeenCalled()
  })

  it('throws UnauthorizedException when the target app no longer exists', async () => {
    const sessionModel = mockSessionModel()
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const appModel = mockAppModel(null)
    const { service } = await buildService(accountModel, sessionModel, mockTokenModel(), mockJwtService(), appModel)

    await expect(service.signin(APP_KEY, SESSION_UUID, username, password)).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('throws UnauthorizedException when the account does not exist', async () => {
    const sessionModel = mockSessionModel()
    const accountModel = mockAccountModel(null)
    const accountRoleModel = mockAccountRoleModel()
    const { service } = await buildService(accountModel, sessionModel, mockTokenModel(), mockJwtService(), mockAppModel(), accountRoleModel)

    await expect(service.signin(APP_KEY, SESSION_UUID, username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    // Role lookup and session update must not run when the account is missing.
    expect(accountRoleModel.find).not.toHaveBeenCalled()
    expect(sessionModel.updateOne).not.toHaveBeenCalled()
  })

  it('throws UnauthorizedException on password mismatch', async () => {
    const sessionModel = mockSessionModel()
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const accountRoleModel = mockAccountRoleModel()
    const { service } = await buildService(accountModel, sessionModel, mockTokenModel(), mockJwtService(), mockAppModel(), accountRoleModel)

    await expect(service.signin(APP_KEY, SESSION_UUID, username, 'wrong password')).rejects.toBeInstanceOf(UnauthorizedException)
    expect(accountRoleModel.find).not.toHaveBeenCalled()
    expect(sessionModel.updateOne).not.toHaveBeenCalled()
  })

  it.each(['LOCKED', 'CLOSED'] as const)('throws UnauthorizedException when the account status is %s', async (status) => {
    const sessionModel = mockSessionModel()
    const accountModel = mockAccountModel(baseAccount({ passwordHash, status }))
    const { service } = await buildService(accountModel, sessionModel)

    await expect(service.signin(APP_KEY, SESSION_UUID, username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.updateOne).not.toHaveBeenCalled()
  })

  it('attaches the account to the existing anonymous session, extends expiry 1 year out, and mints a signed-in JWT', async () => {
    const sessionModel = mockSessionModel()
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const accountRoleModel = mockAccountRoleModel(['ADMIN', 'MEMBER'])
    const { service, jwt, tokenModel } = await buildService(accountModel, sessionModel, mockTokenModel(), mockJwtService(), mockAppModel(), accountRoleModel)

    const before = Date.now()
    const result = await service.signin(APP_KEY, SESSION_UUID, username, password)
    const after = Date.now()

    // Role lookup keyed by (account.uuid, app.key).
    expect(accountRoleModel.find).toHaveBeenCalledWith({ account: '0190a1b2-c3d4-7e5f-8901-234567890abc', app: APP_KEY })

    // No token cleanup on first signin (no prior account on the session).
    expect(tokenModel.deleteMany).not.toHaveBeenCalled()

    // Session updated once: attach account snapshot, set roles, extend expiresAt ~ 1 year from now.
    expect(sessionModel.updateOne).toHaveBeenCalledTimes(1)
    const updateCall = sessionModel.updateOne.mock.calls[0] as [{ uuid: string }, { $set: { account: { uuid: string }; roles: string[]; expiresAt: Date } }]
    expect(updateCall[0]).toEqual({ uuid: SESSION_UUID })
    expect(updateCall[1].$set.account.uuid).toBe('0190a1b2-c3d4-7e5f-8901-234567890abc')
    expect(updateCall[1].$set.roles).toEqual(['ADMIN', 'MEMBER'])
    const oneYearMs = 365 * 24 * 60 * 60 * 1000
    expect(updateCall[1].$set.expiresAt.getTime()).toBeGreaterThanOrEqual(before + oneYearMs - 1000)
    expect(updateCall[1].$set.expiresAt.getTime()).toBeLessThanOrEqual(after + oneYearMs + 1000)

    // JWT payload carries account-bound claims.
    expect(jwt.signAsync).toHaveBeenCalledWith(
      {
        sub: '0190a1b2-c3d4-7e5f-8901-234567890abc',
        app: APP_KEY,
        ses: SESSION_UUID,
        sta: 'ACTIVE',
        roles: ['ADMIN', 'MEMBER'],
      },
      expect.objectContaining({ expiresIn: expect.any(Number) as number }),
    )

    expect(result.uuid).toBe(SESSION_UUID)
    expect(result.token).toBe(STUB_JWT)
    expect(result.account.uuid).toBe('0190a1b2-c3d4-7e5f-8901-234567890abc')
    expect(result.app.key).toBe(APP_KEY)
    expect(result.roles).toEqual(['ADMIN', 'MEMBER'])
  })

  it('on account switch: clears the prior account, cascade-deletes tokens, then attaches the new account', async () => {
    const sessionModel = mockSessionModel(anonymousSession({ account: { uuid: 'prior-account-uuid' } }))
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const accountRoleModel = mockAccountRoleModel(['VIEWER'])
    const { service, tokenModel } = await buildService(accountModel, sessionModel, mockTokenModel(), mockJwtService(), mockAppModel(), accountRoleModel)

    await service.signin(APP_KEY, SESSION_UUID, username, password)

    // Two updateOne calls: first to $unset the old account, second to $set the new one.
    expect(sessionModel.updateOne).toHaveBeenCalledTimes(2)
    expect(sessionModel.updateOne.mock.calls[0]).toEqual([{ uuid: SESSION_UUID }, { $unset: { account: '' }, $set: { roles: [] } }])
    const [secondQuery, secondUpdate] = sessionModel.updateOne.mock.calls[1] as [{ uuid: string }, { $set: { account: { uuid: string } } }]
    expect(secondQuery).toEqual({ uuid: SESSION_UUID })
    expect(secondUpdate.$set.account.uuid).toBe('0190a1b2-c3d4-7e5f-8901-234567890abc')

    // Tokens minted for the prior account are cascade-deleted.
    expect(tokenModel.deleteMany).toHaveBeenCalledWith({ session: SESSION_UUID })
  })

  it('skips the account-switch cleanup when re-signing the same account on the same session', async () => {
    const sessionModel = mockSessionModel(anonymousSession({ account: { uuid: '0190a1b2-c3d4-7e5f-8901-234567890abc' } }))
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const accountRoleModel = mockAccountRoleModel(['ADMIN'])
    const { service, tokenModel } = await buildService(accountModel, sessionModel, mockTokenModel(), mockJwtService(), mockAppModel(), accountRoleModel)

    await service.signin(APP_KEY, SESSION_UUID, username, password)

    // Only the single $set updateOne (no $unset for same-account re-signin).
    expect(sessionModel.updateOne).toHaveBeenCalledTimes(1)
    expect(tokenModel.deleteMany).not.toHaveBeenCalled()
  })

  it('passes an empty roles array when the account has none for this app', async () => {
    const sessionModel = mockSessionModel()
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const accountRoleModel = mockAccountRoleModel([])
    const { service, jwt } = await buildService(accountModel, sessionModel, mockTokenModel(), mockJwtService(), mockAppModel(), accountRoleModel)

    const result = await service.signin(APP_KEY, SESSION_UUID, username, password)
    expect(result.roles).toEqual([])
    expect(jwt.signAsync).toHaveBeenCalledWith(expect.objectContaining({ roles: [] }), expect.any(Object))
  })
})
