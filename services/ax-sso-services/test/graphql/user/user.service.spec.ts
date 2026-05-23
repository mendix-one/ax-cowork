import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { User } from '../../../src/acore/database/schemas/user.schema'
import { UserService } from '../../../src/graphql/user/user.service'

function mockUserModel() {
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

describe('UserService (graphql)', () => {
  let mocks: ReturnType<typeof mockUserModel>
  let service: UserService

  beforeEach(async () => {
    mocks = mockUserModel()
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, { provide: getModelToken(User.name), useValue: mocks.model }],
    }).compile()
    service = moduleRef.get(UserService)
  })

  describe('findByUuid', () => {
    it('queries by uuid via lean and returns the user', async () => {
      const user = { uuid: 'u1', username: 'alice' }
      mocks.findOneExec.mockResolvedValueOnce(user)

      const result = await service.findByUuid('u1')

      expect(mocks.model.findOne).toHaveBeenCalledWith({ uuid: 'u1' })
      expect(result).toBe(user)
    })

    it('returns null when the uuid does not exist', async () => {
      mocks.findOneExec.mockResolvedValueOnce(null)
      await expect(service.findByUuid('missing')).resolves.toBeNull()
    })
  })

  describe('list', () => {
    it('uses default limit=50/skip=0, newest first, no status filter when none provided', async () => {
      const users = [{ uuid: 'a' }, { uuid: 'b' }]
      mocks.findExec.mockResolvedValueOnce(users)

      const result = await service.list()

      expect(mocks.model.find).toHaveBeenCalledWith({})
      expect(mocks.findSort).toHaveBeenCalledWith({ createdAt: -1 })
      expect(mocks.findSkip).toHaveBeenCalledWith(0)
      expect(mocks.findLimit).toHaveBeenCalledWith(50)
      expect(result).toBe(users)
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

    it('throws NotFoundException when the user does not exist', async () => {
      mocks.updateExec.mockResolvedValueOnce(null)
      await expect(service.update('missing', { display: 'X' })).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
