import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { AccountRole } from '../../../src/acore/database/schemas/account-role.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { Token } from '../../../src/acore/database/schemas/token.schema'
import { TokenService } from '../../../src/services/token/token.service'

const STUB_JWT = 'header.payload.signature'

function mockJwtService() {
  return { signAsync: jest.fn().mockResolvedValue(STUB_JWT) }
}

function mockTokenModel(existing: { uuid: string } | null = null) {
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

function mockSessionModel(existing: { uuid: string; expiresAt: Date } | null) {
  return {
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(existing) }),
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

const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('TokenService', () => {
  const ACCOUNT = '0190a1b2-c3d4-7e5f-8901-account00000'
  const SESSION = '0190a1b2-c3d4-7e5f-8901-session00000'
  const STATE = 'ACTIVE'
  const SCOPE = 'BILLING'
  // Fixed ~24h-from-now session expiry so assertions can compare against a known instant.
  const SESSION_EXPIRES_AT = new Date(Date.now() + 24 * 60 * 60 * 1000)

  async function buildService(
    tokenModel: ReturnType<typeof mockTokenModel>,
    sessionModel: ReturnType<typeof mockSessionModel>,
    accountRoleModel: ReturnType<typeof mockAccountRoleModel> = mockAccountRoleModel(),
    jwt: ReturnType<typeof mockJwtService> = mockJwtService(),
  ): Promise<{ service: TokenService; jwt: ReturnType<typeof mockJwtService>; accountRoleModel: ReturnType<typeof mockAccountRoleModel> }> {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: getModelToken(Token.name), useValue: tokenModel },
        { provide: getModelToken(Session.name), useValue: sessionModel },
        { provide: getModelToken(AccountRole.name), useValue: accountRoleModel },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile()
    return { service: moduleRef.get(TokenService), jwt, accountRoleModel }
  }

  it('signs a JWT carrying scope-resolved roles, inserts a new token row, and inherits expiresAt from the session', async () => {
    const tokenModel = mockTokenModel(null)
    const sessionModel = mockSessionModel({ uuid: SESSION, expiresAt: SESSION_EXPIRES_AT })
    const accountRoleModel = mockAccountRoleModel(['ADMIN', 'MEMBER'])
    const { service, jwt } = await buildService(tokenModel, sessionModel, accountRoleModel)

    const result = await service.issue(ACCOUNT, SESSION, STATE, SCOPE)

    expect(sessionModel.findOne).toHaveBeenCalledWith({ uuid: SESSION }, { uuid: 1, expiresAt: 1 })
    // Roles are looked up by (account, app: scope) — the scope from the body is the app key here.
    expect(accountRoleModel.find).toHaveBeenCalledWith({ account: ACCOUNT, app: SCOPE })
    expect(tokenModel.findOne).toHaveBeenCalledWith({ account: ACCOUNT, session: SESSION, app: SCOPE }, { uuid: 1 })

    // JWT payload carries the scope-resolved roles. `expiresIn` is remaining seconds until session.expiresAt.
    const [signedPayload, signOptions] = jwt.signAsync.mock.calls[0] as [Record<string, unknown>, { expiresIn: number }]
    expect(signedPayload).toEqual({ app: SCOPE, sub: ACCOUNT, ses: SESSION, sta: STATE, roles: ['ADMIN', 'MEMBER'] })
    const expectedRemainingSec = Math.floor((SESSION_EXPIRES_AT.getTime() - Date.now()) / 1000)
    expect(signOptions.expiresIn).toBeGreaterThan(expectedRemainingSec - 5)
    expect(signOptions.expiresIn).toBeLessThanOrEqual(expectedRemainingSec + 1)

    expect(tokenModel.updateOne).not.toHaveBeenCalled()
    expect(tokenModel.create).toHaveBeenCalledTimes(1)
    expect(tokenModel.create).toHaveBeenCalledWith({
      uuid: expect.stringMatching(UUID_V7_PATTERN) as string,
      token: STUB_JWT,
      expiresAt: SESSION_EXPIRES_AT,
      account: ACCOUNT,
      session: SESSION,
      app: SCOPE,
      roles: ['ADMIN', 'MEMBER'],
    })

    expect(result.uuid).toMatch(UUID_V7_PATTERN)
    expect(result).toEqual({
      uuid: result.uuid,
      token: STUB_JWT,
      account: ACCOUNT,
      session: SESSION,
      app: SCOPE,
      roles: ['ADMIN', 'MEMBER'],
      expiresAt: SESSION_EXPIRES_AT,
    })

    const createdArg = (tokenModel.create.mock.calls[0] as [{ uuid: string }])[0]
    expect(createdArg.uuid).toBe(result.uuid)
  })

  it('reuses the existing token row for (account, session, scope) and updates roles + token + expiresAt in place', async () => {
    const existingUuid = '0190a1b2-c3d4-7e5f-8901-existing0000'
    const tokenModel = mockTokenModel({ uuid: existingUuid })
    const sessionModel = mockSessionModel({ uuid: SESSION, expiresAt: SESSION_EXPIRES_AT })
    const accountRoleModel = mockAccountRoleModel(['VIEWER'])
    const { service, jwt } = await buildService(tokenModel, sessionModel, accountRoleModel)

    const result = await service.issue(ACCOUNT, SESSION, STATE, SCOPE)

    expect(tokenModel.findOne).toHaveBeenCalledWith({ account: ACCOUNT, session: SESSION, app: SCOPE }, { uuid: 1 })
    expect(tokenModel.create).not.toHaveBeenCalled()
    expect(tokenModel.updateOne).toHaveBeenCalledTimes(1)
    expect(tokenModel.updateOne).toHaveBeenCalledWith(
      { uuid: existingUuid },
      { $set: { token: STUB_JWT, expiresAt: SESSION_EXPIRES_AT, roles: ['VIEWER'] } },
    )

    expect(jwt.signAsync).toHaveBeenCalledWith(
      { app: SCOPE, sub: ACCOUNT, ses: SESSION, sta: STATE, roles: ['VIEWER'] },
      expect.objectContaining({ expiresIn: expect.any(Number) as number }),
    )
    expect(result.uuid).toBe(existingUuid)
    expect(result.token).toBe(STUB_JWT)
    expect(result.roles).toEqual(['VIEWER'])
    expect(result.expiresAt).toBe(SESSION_EXPIRES_AT)
  })

  it('throws UnauthorizedException when the backing session no longer exists', async () => {
    const tokenModel = mockTokenModel(null)
    const sessionModel = mockSessionModel(null)
    const accountRoleModel = mockAccountRoleModel(['ADMIN'])
    const { service, jwt } = await buildService(tokenModel, sessionModel, accountRoleModel)

    await expect(service.issue(ACCOUNT, SESSION, STATE, SCOPE)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.findOne).toHaveBeenCalledWith({ uuid: SESSION }, { uuid: 1, expiresAt: 1 })
    // No token-side work runs when the session lookup fails — not even the role lookup.
    expect(accountRoleModel.find).not.toHaveBeenCalled()
    expect(tokenModel.findOne).not.toHaveBeenCalled()
    expect(tokenModel.create).not.toHaveBeenCalled()
    expect(tokenModel.updateOne).not.toHaveBeenCalled()
    expect(jwt.signAsync).not.toHaveBeenCalled()
  })

  it('passes an empty roles array (and payload) when the account has none for this scope', async () => {
    const tokenModel = mockTokenModel(null)
    const sessionModel = mockSessionModel({ uuid: SESSION, expiresAt: SESSION_EXPIRES_AT })
    const accountRoleModel = mockAccountRoleModel([])
    const { service, jwt } = await buildService(tokenModel, sessionModel, accountRoleModel)

    const result = await service.issue(ACCOUNT, SESSION, STATE, SCOPE)

    expect(result.roles).toEqual([])
    expect(jwt.signAsync).toHaveBeenCalledWith(expect.objectContaining({ roles: [] }), expect.objectContaining({ expiresIn: expect.any(Number) as number }))
    const createdArg = (tokenModel.create.mock.calls[0] as [{ roles: string[] }])[0]
    expect(createdArg.roles).toEqual([])
  })
})
