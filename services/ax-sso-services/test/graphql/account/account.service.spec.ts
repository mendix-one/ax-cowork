import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Account } from '../../../src/acore/database/schemas/account.schema'
import { AccountService } from '../../../src/graphql/account/account.service'

function mockAccountModel() {
  const findOneExec = jest.fn()
  const findOneLean = jest.fn().mockReturnValue({ exec: findOneExec })
  const findOne = jest.fn().mockReturnValue({ lean: findOneLean })

  const updateExec = jest.fn()
  const updateLean = jest.fn().mockReturnValue({ exec: updateExec })
  const findOneAndUpdate = jest.fn().mockReturnValue({ lean: updateLean })

  // find().sort().skip().limit().lean().exec() chain (used by `list`)
  const findExec = jest.fn()
  const findLean = jest.fn().mockReturnValue({ exec: findExec })
  const findLimit = jest.fn().mockReturnValue({ lean: findLean })
  const findSkip = jest.fn().mockReturnValue({ limit: findLimit })
  const findSort = jest.fn().mockReturnValue({ skip: findSkip })
  const find = jest.fn().mockReturnValue({ sort: findSort })

  return {
    model: { findOne, findOneAndUpdate, find },
    findOne,
    findOneExec,
    findOneAndUpdate,
    updateExec,
    find,
    findSort,
    findSkip,
    findLimit,
    findExec,
  }
}

describe('AccountService (graphql)', () => {
  let mocks: ReturnType<typeof mockAccountModel>
  let service: AccountService

  beforeEach(async () => {
    mocks = mockAccountModel()
    const moduleRef = await Test.createTestingModule({
      providers: [AccountService, { provide: getModelToken(Account.name), useValue: mocks.model }],
    }).compile()
    service = moduleRef.get(AccountService)
  })

  describe('findByUuid', () => {
    it('queries by uuid via lean and returns the account', async () => {
      const account = { uuid: 'u1', username: 'alice' }
      mocks.findOneExec.mockResolvedValueOnce(account)

      const result = await service.findByUuid('u1')

      expect(mocks.model.findOne).toHaveBeenCalledWith({ uuid: 'u1' })
      expect(result).toBe(account)
    })

    it('returns null when the uuid does not exist', async () => {
      mocks.findOneExec.mockResolvedValueOnce(null)
      await expect(service.findByUuid('missing')).resolves.toBeNull()
    })
  })

  describe('list', () => {
    it('uses default limit=50/skip=0, newest first, no status filter when none provided', async () => {
      const accounts = [{ uuid: 'a' }, { uuid: 'b' }]
      mocks.findExec.mockResolvedValueOnce(accounts)

      const result = await service.list()

      expect(mocks.model.find).toHaveBeenCalledWith({})
      expect(mocks.findSort).toHaveBeenCalledWith({ createdAt: -1 })
      expect(mocks.findSkip).toHaveBeenCalledWith(0)
      expect(mocks.findLimit).toHaveBeenCalledWith(50)
      expect(result).toBe(accounts)
    })

    it('honors status filter and custom pagination', async () => {
      mocks.findExec.mockResolvedValueOnce([])

      await service.list({ status: 'LOCKED', limit: 10, skip: 20 })

      expect(mocks.model.find).toHaveBeenCalledWith({ status: 'LOCKED' })
      expect(mocks.findSkip).toHaveBeenCalledWith(20)
      expect(mocks.findLimit).toHaveBeenCalledWith(10)
    })
  })

  describe('update', () => {
    it('strips undefined keys from the input before passing to $set, with new:true', async () => {
      const updated = { uuid: 'u1', display: 'Alice', email: 'alice@example.com' }
      mocks.updateExec.mockResolvedValueOnce(updated)

      const result = await service.update('u1', { display: 'Alice', email: undefined, phone: '+1' })

      expect(mocks.model.findOneAndUpdate).toHaveBeenCalledWith(
        { uuid: 'u1' },
        { $set: { display: 'Alice', phone: '+1' } },
        { new: true },
      )
      expect(result).toBe(updated)
    })

    it('throws NotFoundException when the account does not exist', async () => {
      mocks.updateExec.mockResolvedValueOnce(null)
      await expect(service.update('missing', { display: 'X' })).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
