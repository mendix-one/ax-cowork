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
const SESSION_UUID = '0190a1b2-c3d4-7e5f-8901-session00000'

function mockAppModel(found: typeof STUB_APP | null = STUB_APP) {
  return {
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(found) }),
    }),
  }
}

interface FoundSession {
  uuid: string
  app: { uuid: string; key: string; type: string; name: string; description?: string; avatar?: string }
  account?: {
    uuid: string
    username: string
    display: string
    email: string
    status: string
    avatar?: string
    phone?: string
  }
  roles: string[]
  expiresAt: Date
}

function mockSessionModel(found: FoundSession | null = null) {
  return {
    create: jest.fn().mockImplementation((doc: Record<string, unknown>) => Promise.resolve(doc)),
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(found) }),
    }),
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

  describe('initialize', () => {
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

  describe('getSession', () => {
    const sessionExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    const baseSession: FoundSession = {
      uuid: SESSION_UUID,
      app: { ...STUB_APP },
      roles: [],
      expiresAt: sessionExpiresAt,
    }

    it('throws UnauthorizedException when the session no longer exists', async () => {
      const sessionModel = mockSessionModel(null)
      const { service } = await buildService(mockAppModel(), sessionModel)

      await expect(service.getSession(SESSION_UUID)).rejects.toBeInstanceOf(UnauthorizedException)
      expect(sessionModel.findOne).toHaveBeenCalledWith({ uuid: SESSION_UUID })
    })

    it('anonymous session: returns uuid + app + empty roles, omits account + status', async () => {
      const sessionModel = mockSessionModel(baseSession)
      const { service } = await buildService(mockAppModel(), sessionModel)

      const result = await service.getSession(SESSION_UUID)

      expect(result.uuid).toBe(SESSION_UUID)
      expect(result.app).toEqual({
        uuid: STUB_APP.uuid,
        key: STUB_APP.key,
        type: STUB_APP.type,
        name: STUB_APP.name,
        description: STUB_APP.description,
        avatar: STUB_APP.avatar,
      })
      expect(result.account).toBeUndefined()
      expect(result.status).toBeUndefined()
      expect(result.roles).toEqual([])
      expect(result.expiresAt).toBe(sessionExpiresAt)
    })

    it('signed-in session: returns full info with account snapshot, status, and roles', async () => {
      const signedInSession: FoundSession = {
        ...baseSession,
        account: {
          uuid: 'acct-uuid-0001',
          username: 'alice',
          display: 'Alice',
          email: 'alice@example.com',
          status: 'ACTIVE',
          avatar: 'https://cdn.example/alice.png',
          phone: '+1-555-0100',
        },
        roles: ['ADMIN', 'MEMBER'],
      }
      const sessionModel = mockSessionModel(signedInSession)
      const { service } = await buildService(mockAppModel(), sessionModel)

      const result = await service.getSession(SESSION_UUID)

      expect(result.account).toEqual({
        uuid: 'acct-uuid-0001',
        username: 'alice',
        display: 'Alice',
        email: 'alice@example.com',
        avatar: 'https://cdn.example/alice.png',
        phone: '+1-555-0100',
      })
      expect(result.status).toBe('ACTIVE')
      expect(result.roles).toEqual(['ADMIN', 'MEMBER'])
      expect(result.app.key).toBe(APP_KEY)
    })

    it('defaults roles to [] if the persisted session has no roles field', async () => {
      const sessionModel = mockSessionModel({ ...baseSession, roles: undefined as unknown as string[] })
      const { service } = await buildService(mockAppModel(), sessionModel)

      const result = await service.getSession(SESSION_UUID)
      expect(result.roles).toEqual([])
    })
  })
})
