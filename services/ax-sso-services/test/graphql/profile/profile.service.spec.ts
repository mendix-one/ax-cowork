import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Account } from '../../../src/acore/database/schemas/account.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { Token } from '../../../src/acore/database/schemas/token.schema'
import { ProfileService } from '../../../src/graphql/profile/profile.service'

const CALLER = '0190a1b2-c3d4-7e5f-8901-callerooooo0'

function chain<T>(value: T) {
  return { exec: jest.fn().mockResolvedValue(value) }
}

function mockAccountModel() {
  const findOneAndUpdateExec = jest.fn()
  const findOneAndUpdateLean = jest.fn().mockReturnValue({ exec: findOneAndUpdateExec })
  const findOneAndUpdate = jest.fn().mockReturnValue({ lean: findOneAndUpdateLean })

  const findOneExec = jest.fn()
  const findOneLean = jest.fn().mockReturnValue({ exec: findOneExec })
  const findOne = jest.fn().mockReturnValue({ lean: findOneLean })

  return { model: { findOne, findOneAndUpdate }, findOne, findOneExec, findOneAndUpdate, findOneAndUpdateExec }
}

function mockSessionModel() {
  // find().sort().lean().exec() chain (used by getProfile).
  const findExec = jest.fn()
  const findLean = jest.fn().mockReturnValue({ exec: findExec })
  const findSort = jest.fn().mockReturnValue({ lean: findLean })
  const find = jest.fn().mockReturnValue({ sort: findSort })

  // findOne().lean().exec() chain (used by killSession).
  const findOneExec = jest.fn()
  const findOneLean = jest.fn().mockReturnValue({ exec: findOneExec })
  const findOne = jest.fn().mockReturnValue({ lean: findOneLean })

  const deleteOne = jest.fn().mockReturnValue(chain({ acknowledged: true, deletedCount: 1 }))

  return { model: { find, findOne, deleteOne }, find, findSort, findExec, findOne, findOneExec, deleteOne }
}

function mockTokenModel() {
  const deleteMany = jest.fn().mockReturnValue(chain({ acknowledged: true, deletedCount: 2 }))
  return { model: { deleteMany }, deleteMany }
}

describe('ProfileService', () => {
  async function buildService() {
    const accountMocks = mockAccountModel()
    const sessionMocks = mockSessionModel()
    const tokenMocks = mockTokenModel()
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getModelToken(Account.name), useValue: accountMocks.model },
        { provide: getModelToken(Session.name), useValue: sessionMocks.model },
        { provide: getModelToken(Token.name), useValue: tokenMocks.model },
      ],
    }).compile()
    return { service: moduleRef.get(ProfileService), accountMocks, sessionMocks, tokenMocks }
  }

  describe('getProfile', () => {
    it('returns the caller account and active sessions, newest first', async () => {
      const { service, accountMocks, sessionMocks } = await buildService()
      accountMocks.findOneExec.mockResolvedValueOnce({ uuid: CALLER, username: 'alice' })
      const exp1 = new Date('2026-05-24T10:00:00Z')
      const exp2 = new Date('2026-05-24T09:00:00Z')
      sessionMocks.findExec.mockResolvedValueOnce([
        { uuid: 's1', app: { uuid: 'app-uuid-1', key: 'SSO', name: 'AX SSO', avatar: 'a1', description: 'd1' }, expiresAt: exp1 },
        { uuid: 's2', app: { uuid: 'app-uuid-2', key: 'BILLING', name: 'Billing', avatar: 'a2', description: 'd2' }, expiresAt: exp2 },
      ])

      const result = await service.getProfile(CALLER)

      expect(accountMocks.model.findOne).toHaveBeenCalledWith({ uuid: CALLER })
      expect(sessionMocks.model.find).toHaveBeenCalledWith({ 'account.uuid': CALLER })
      expect(sessionMocks.findSort).toHaveBeenCalledWith({ createdAt: -1 })
      expect(result.account.uuid).toBe(CALLER)
      expect(result.sessions).toEqual([
        { uuid: 's1', app: { uuid: 'app-uuid-1', key: 'SSO', name: 'AX SSO', avatar: 'a1', description: 'd1' }, expiresAt: exp1 },
        { uuid: 's2', app: { uuid: 'app-uuid-2', key: 'BILLING', name: 'Billing', avatar: 'a2', description: 'd2' }, expiresAt: exp2 },
      ])
    })

    it('throws NotFoundException when the caller account no longer exists', async () => {
      const { service, accountMocks, sessionMocks } = await buildService()
      accountMocks.findOneExec.mockResolvedValueOnce(null)

      await expect(service.getProfile(CALLER)).rejects.toBeInstanceOf(NotFoundException)
      expect(sessionMocks.model.find).not.toHaveBeenCalled()
    })
  })

  describe('updateProfile', () => {
    it('strips undefined keys from $set and returns the updated record', async () => {
      const { service, accountMocks } = await buildService()
      const updated = { uuid: CALLER, display: 'Alice', phone: '+1' }
      accountMocks.findOneAndUpdateExec.mockResolvedValueOnce(updated)

      const result = await service.updateProfile(CALLER, { display: 'Alice', email: undefined, phone: '+1' })

      expect(accountMocks.model.findOneAndUpdate).toHaveBeenCalledWith({ uuid: CALLER }, { $set: { display: 'Alice', phone: '+1' } }, { returnDocument: 'after' })
      expect(result).toBe(updated)
    })

    it('throws NotFoundException when the caller account no longer exists', async () => {
      const { service, accountMocks } = await buildService()
      accountMocks.findOneAndUpdateExec.mockResolvedValueOnce(null)

      await expect(service.updateProfile(CALLER, { display: 'X' })).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('killSession', () => {
    it('deletes the caller-owned session and cascades token deletes; returns true', async () => {
      const { service, sessionMocks, tokenMocks } = await buildService()
      sessionMocks.findOneExec.mockResolvedValueOnce({ account: { uuid: CALLER } })

      const result = await service.killSession(CALLER, 'sess-1')

      expect(result).toBe(true)
      expect(sessionMocks.deleteOne).toHaveBeenCalledWith({ uuid: 'sess-1' })
      expect(tokenMocks.deleteMany).toHaveBeenCalledWith({ session: 'sess-1' })
    })

    it('returns false (no-op) when the session does not exist', async () => {
      const { service, sessionMocks, tokenMocks } = await buildService()
      sessionMocks.findOneExec.mockResolvedValueOnce(null)

      const result = await service.killSession(CALLER, 'missing')

      expect(result).toBe(false)
      expect(sessionMocks.deleteOne).not.toHaveBeenCalled()
      expect(tokenMocks.deleteMany).not.toHaveBeenCalled()
    })

    it('throws ForbiddenException when the session belongs to a different account', async () => {
      const { service, sessionMocks, tokenMocks } = await buildService()
      sessionMocks.findOneExec.mockResolvedValueOnce({ account: { uuid: 'someone-else' } })

      await expect(service.killSession(CALLER, 'sess-1')).rejects.toBeInstanceOf(ForbiddenException)
      expect(sessionMocks.deleteOne).not.toHaveBeenCalled()
      expect(tokenMocks.deleteMany).not.toHaveBeenCalled()
    })

    it('throws ForbiddenException on anonymous sessions (no account attached)', async () => {
      const { service, sessionMocks, tokenMocks } = await buildService()
      sessionMocks.findOneExec.mockResolvedValueOnce({})

      await expect(service.killSession(CALLER, 'anon-sess')).rejects.toBeInstanceOf(ForbiddenException)
      expect(sessionMocks.deleteOne).not.toHaveBeenCalled()
      expect(tokenMocks.deleteMany).not.toHaveBeenCalled()
    })
  })
})
