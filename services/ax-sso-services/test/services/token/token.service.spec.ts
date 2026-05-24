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

interface SessionRow {
  uuid: string
  expiresAt: Date
  account?: { uuid: string; status: string }
}

function mockSessionModel(existing: SessionRow | null) {
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

  it('throws UnauthorizedException when the backing session no longer exists', async () => {
    const tokenModel = mockTokenModel(null)
    const sessionModel = mockSessionModel(null)
    const accountRoleModel = mockAccountRoleModel(['ADMIN'])
    const { service, jwt } = await buildService(tokenModel, sessionModel, accountRoleModel)

    await expect(service.issue(SESSION, SCOPE)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(accountRoleModel.find).not.toHaveBeenCalled()
    expect(tokenModel.findOne).not.toHaveBeenCalled()
    expect(tokenModel.create).not.toHaveBeenCalled()
    expect(tokenModel.updateOne).not.toHaveBeenCalled()
    expect(jwt.signAsync).not.toHaveBeenCalled()
  })

  it('signed-in session: signs JWT with sub/sta/roles, persists row with account uuid, inherits expiresAt', async () => {
    const tokenModel = mockTokenModel(null)
    const sessionModel = mockSessionModel({ uuid: SESSION, expiresAt: SESSION_EXPIRES_AT, account: { uuid: ACCOUNT, status: 'ACTIVE' } })
    const accountRoleModel = mockAccountRoleModel(['ADMIN', 'MEMBER'])
    const { service, jwt } = await buildService(tokenModel, sessionModel, accountRoleModel)

    const result = await service.issue(SESSION, SCOPE)

    expect(sessionModel.findOne).toHaveBeenCalledWith({ uuid: SESSION }, { uuid: 1, expiresAt: 1, account: 1 })
    expect(accountRoleModel.find).toHaveBeenCalledWith({ account: ACCOUNT, app: SCOPE })
    // Reuse key changed from (account, session, app) to (session, app).
    expect(tokenModel.findOne).toHaveBeenCalledWith({ session: SESSION, app: SCOPE }, { uuid: 1 })

    // JWT payload carries account-bound claims; the underlying impl may pass `sub` last (after
    // `roles`) — order-insensitive comparison via toEqual / objectContaining keeps the assertion stable.
    const [signedPayload, signOptions] = jwt.signAsync.mock.calls[0] as [Record<string, unknown>, { expiresIn: number }]
    expect(signedPayload).toEqual({ app: SCOPE, ses: SESSION, sub: ACCOUNT, sta: 'ACTIVE', roles: ['ADMIN', 'MEMBER'] })
    const expectedRemainingSec = Math.floor((SESSION_EXPIRES_AT.getTime() - Date.now()) / 1000)
    expect(signOptions.expiresIn).toBeGreaterThan(expectedRemainingSec - 5)
    expect(signOptions.expiresIn).toBeLessThanOrEqual(expectedRemainingSec + 1)

    expect(tokenModel.updateOne).not.toHaveBeenCalled()
    expect(tokenModel.create).toHaveBeenCalledTimes(1)
    expect(tokenModel.create).toHaveBeenCalledWith({
      uuid: expect.stringMatching(UUID_V7_PATTERN) as string,
      expiresAt: SESSION_EXPIRES_AT,
      account: ACCOUNT,
      session: SESSION,
      app: SCOPE,
      roles: ['ADMIN', 'MEMBER'],
    })

    expect(result.uuid).toMatch(UUID_V7_PATTERN)
    expect(result.token).toBe(STUB_JWT)
    expect(result.account).toBe(ACCOUNT)
    expect(result.session).toBe(SESSION)
    expect(result.app).toBe(SCOPE)
    expect(result.roles).toEqual(['ADMIN', 'MEMBER'])
    expect(result.expiresAt).toBe(SESSION_EXPIRES_AT)
  })

  it('anonymous session: signs JWT without sub/sta, empty roles, persists row with no account', async () => {
    const tokenModel = mockTokenModel(null)
    const sessionModel = mockSessionModel({ uuid: SESSION, expiresAt: SESSION_EXPIRES_AT })
    const accountRoleModel = mockAccountRoleModel(['ADMIN'])
    const { service, jwt } = await buildService(tokenModel, sessionModel, accountRoleModel)

    const result = await service.issue(SESSION, SCOPE)

    // Roles lookup must NOT run for anonymous sessions — empty array, period.
    expect(accountRoleModel.find).not.toHaveBeenCalled()

    const [signedPayload] = jwt.signAsync.mock.calls[0] as [Record<string, unknown>]
    expect(signedPayload).toEqual({ app: SCOPE, ses: SESSION, roles: [] })

    expect(tokenModel.create).toHaveBeenCalledTimes(1)
    expect(tokenModel.create).toHaveBeenCalledWith({
      uuid: expect.stringMatching(UUID_V7_PATTERN) as string,
      expiresAt: SESSION_EXPIRES_AT,
      account: undefined,
      session: SESSION,
      app: SCOPE,
      roles: [],
    })

    expect(result.account).toBeUndefined()
    expect(result.roles).toEqual([])
    expect(result.token).toBe(STUB_JWT)
  })

  it('reuses the existing token row keyed by (session, app) and updates roles + expiresAt + account in place', async () => {
    const existingUuid = '0190a1b2-c3d4-7e5f-8901-existing0000'
    const tokenModel = mockTokenModel({ uuid: existingUuid })
    const sessionModel = mockSessionModel({ uuid: SESSION, expiresAt: SESSION_EXPIRES_AT, account: { uuid: ACCOUNT, status: 'ACTIVE' } })
    const accountRoleModel = mockAccountRoleModel(['VIEWER'])
    const { service } = await buildService(tokenModel, sessionModel, accountRoleModel)

    const result = await service.issue(SESSION, SCOPE)

    expect(tokenModel.findOne).toHaveBeenCalledWith({ session: SESSION, app: SCOPE }, { uuid: 1 })
    expect(tokenModel.create).not.toHaveBeenCalled()
    expect(tokenModel.updateOne).toHaveBeenCalledTimes(1)
    expect(tokenModel.updateOne).toHaveBeenCalledWith({ uuid: existingUuid }, { $set: { expiresAt: SESSION_EXPIRES_AT, roles: ['VIEWER'], account: ACCOUNT } })

    expect(result.uuid).toBe(existingUuid)
    expect(result.roles).toEqual(['VIEWER'])
  })

  it('on signed-in → anonymous transition (same session, account removed): unsets account on the existing token row', async () => {
    const existingUuid = '0190a1b2-c3d4-7e5f-8901-existing0001'
    const tokenModel = mockTokenModel({ uuid: existingUuid })
    const sessionModel = mockSessionModel({ uuid: SESSION, expiresAt: SESSION_EXPIRES_AT })
    const { service } = await buildService(tokenModel, sessionModel)

    await service.issue(SESSION, SCOPE)

    expect(tokenModel.updateOne).toHaveBeenCalledTimes(1)
    const [query, update] = tokenModel.updateOne.mock.calls[0] as [{ uuid: string }, { $set: Record<string, unknown>; $unset?: Record<string, ''> }]
    expect(query).toEqual({ uuid: existingUuid })
    expect(update.$set.expiresAt).toBe(SESSION_EXPIRES_AT)
    expect(update.$set.roles).toEqual([])
    expect(update.$set.account).toBeUndefined()
    expect(update.$unset).toEqual({ account: '' })
  })

  it('passes an empty roles array when the signed-in account has none for this scope', async () => {
    const tokenModel = mockTokenModel(null)
    const sessionModel = mockSessionModel({ uuid: SESSION, expiresAt: SESSION_EXPIRES_AT, account: { uuid: ACCOUNT, status: 'ACTIVE' } })
    const accountRoleModel = mockAccountRoleModel([])
    const { service, jwt } = await buildService(tokenModel, sessionModel, accountRoleModel)

    const result = await service.issue(SESSION, SCOPE)
    expect(result.roles).toEqual([])
    const [signedPayload] = jwt.signAsync.mock.calls[0] as [Record<string, unknown>]
    expect(signedPayload).toEqual(expect.objectContaining({ roles: [] }))
  })
})
