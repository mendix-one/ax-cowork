import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { App } from '../../../src/acore/database/schemas/app.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { SessionService } from '../../../src/services/session/session.service'

const APP_KEY = 'SSO'
const STUB_APP = {
  uuid: 'app-uuid-0000',
  key: APP_KEY,
  type: 'INTERNAL_SERVICES' as const,
  name: 'AX SSO',
  description: 'SSO admin',
  avatar: 'https://cdn.example/sso.png',
}

const STUB_JWT = 'header.payload.signature'
const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function mockAppModel(found: typeof STUB_APP | null = STUB_APP) {
  return {
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(found) }),
    }),
  }
}

function mockSessionModel() {
  return {
    create: jest.fn().mockImplementation((doc: Record<string, unknown>) => Promise.resolve(doc)),
  }
}

function mockJwtService() {
  return { signAsync: jest.fn().mockResolvedValue(STUB_JWT) }
}

describe('SessionService', () => {
  async function buildService(
    appModel: ReturnType<typeof mockAppModel> = mockAppModel(),
    sessionModel: ReturnType<typeof mockSessionModel> = mockSessionModel(),
    jwt: ReturnType<typeof mockJwtService> = mockJwtService(),
  ): Promise<{ service: SessionService; jwt: ReturnType<typeof mockJwtService>; sessionModel: ReturnType<typeof mockSessionModel> }> {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: getModelToken(App.name), useValue: appModel },
        { provide: getModelToken(Session.name), useValue: sessionModel },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile()
    return { service: moduleRef.get(SessionService), jwt, sessionModel }
  }

  it('throws UnauthorizedException when the app key is unknown', async () => {
    const appModel = mockAppModel(null)
    const sessionModel = mockSessionModel()
    const { service } = await buildService(appModel, sessionModel)

    await expect(service.initialize('UNKNOWN')).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
  })

  it('creates an anonymous session with ~1-year expiry, mints a JWT with ses+app claims, returns app snapshot', async () => {
    const { service, sessionModel, jwt } = await buildService()
    const before = Date.now()

    const result = await service.initialize(APP_KEY)
    const after = Date.now()

    // Session inserted with no account, empty roles, ~1y expiresAt.
    expect(sessionModel.create).toHaveBeenCalledTimes(1)
    const created = (sessionModel.create.mock.calls[0] as [{ uuid: string; app: Record<string, unknown>; roles: string[]; expiresAt: Date }])[0]
    expect(created.uuid).toMatch(UUID_V7_PATTERN)
    expect(created.roles).toEqual([])
    expect(created.app).toEqual({
      uuid: STUB_APP.uuid,
      key: STUB_APP.key,
      type: STUB_APP.type,
      name: STUB_APP.name,
      description: STUB_APP.description,
      avatar: STUB_APP.avatar,
    })
    const oneYearMs = 365 * 24 * 60 * 60 * 1000
    expect(created.expiresAt.getTime()).toBeGreaterThanOrEqual(before + oneYearMs - 1000)
    expect(created.expiresAt.getTime()).toBeLessThanOrEqual(after + oneYearMs + 1000)
    // No `account` key on an anonymous session.
    expect(Object.prototype.hasOwnProperty.call(created, 'account')).toBe(false)

    // JWT payload: only ses + app, expiresIn ~ 1 year.
    const [payload, options] = jwt.signAsync.mock.calls[0] as [Record<string, unknown>, { expiresIn: number }]
    expect(payload).toEqual({ ses: created.uuid, app: APP_KEY })
    const expectedRemaining = Math.floor(oneYearMs / 1000)
    expect(options.expiresIn).toBeGreaterThan(expectedRemaining - 5)
    expect(options.expiresIn).toBeLessThanOrEqual(expectedRemaining + 1)

    // Result shape.
    expect(result.uuid).toBe(created.uuid)
    expect(result.token).toBe(STUB_JWT)
    expect(result.app.key).toBe(APP_KEY)
    expect(result.expiresAt).toBe(created.expiresAt)
  })
})
