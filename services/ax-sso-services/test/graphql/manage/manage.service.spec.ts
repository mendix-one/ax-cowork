import { ConflictException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Account } from '../../../src/acore/database/schemas/account.schema'
import { ManageService } from '../../../src/graphql/manage/manage.service'

function mockAccountModel() {
  // find().sort().skip().limit().lean().exec() — list()
  const findExec = jest.fn()
  const findLean = jest.fn().mockReturnValue({ exec: findExec })
  const findLimit = jest.fn().mockReturnValue({ lean: findLean })
  const findSkip = jest.fn().mockReturnValue({ limit: findLimit })
  const findSort = jest.fn().mockReturnValue({ skip: findSkip })
  const find = jest.fn().mockReturnValue({ sort: findSort })

  const findOneExec = jest.fn()
  const findOneLean = jest.fn().mockReturnValue({ exec: findOneExec })
  const findOne = jest.fn().mockReturnValue({ lean: findOneLean })

  const findOneAndUpdateExec = jest.fn()
  const findOneAndUpdateLean = jest.fn().mockReturnValue({ exec: findOneAndUpdateExec })
  const findOneAndUpdate = jest.fn().mockReturnValue({ lean: findOneAndUpdateLean })

  const create = jest.fn()

  return {
    model: { find, findOne, findOneAndUpdate, create },
    find,
    findSort,
    findSkip,
    findLimit,
    findExec,
    findOne,
    findOneExec,
    findOneAndUpdate,
    findOneAndUpdateExec,
    create,
  }
}

describe('ManageService', () => {
  let mocks: ReturnType<typeof mockAccountModel>
  let service: ManageService

  beforeEach(async () => {
    mocks = mockAccountModel()
    const moduleRef = await Test.createTestingModule({
      providers: [ManageService, { provide: getModelToken(Account.name), useValue: mocks.model }],
    }).compile()
    service = moduleRef.get(ManageService)
  })

  describe('list', () => {
    it('uses default limit=50/skip=0, newest first, no status filter when none provided', async () => {
      mocks.findExec.mockResolvedValueOnce([{ uuid: 'a' }])

      const result = await service.list()

      expect(mocks.model.find).toHaveBeenCalledWith({})
      expect(mocks.findSort).toHaveBeenCalledWith({ createdAt: -1 })
      expect(mocks.findSkip).toHaveBeenCalledWith(0)
      expect(mocks.findLimit).toHaveBeenCalledWith(50)
      expect(result).toEqual([{ uuid: 'a' }])
    })

    it('honors status filter and custom pagination', async () => {
      mocks.findExec.mockResolvedValueOnce([])
      await service.list({ status: 'LOCKED', limit: 10, skip: 20 })
      expect(mocks.model.find).toHaveBeenCalledWith({ status: 'LOCKED' })
      expect(mocks.findSkip).toHaveBeenCalledWith(20)
      expect(mocks.findLimit).toHaveBeenCalledWith(10)
    })
  })

  describe('findByUuid', () => {
    it('returns the lean document, or null when missing', async () => {
      mocks.findOneExec.mockResolvedValueOnce({ uuid: 'u1' })
      await expect(service.findByUuid('u1')).resolves.toEqual({ uuid: 'u1' })
      expect(mocks.model.findOne).toHaveBeenCalledWith({ uuid: 'u1' })

      mocks.findOneExec.mockResolvedValueOnce(null)
      await expect(service.findByUuid('missing')).resolves.toBeNull()
    })
  })

  describe('create', () => {
    it('bcrypt-hashes the password, defaults status to ACTIVE, and returns the new doc', async () => {
      mocks.create.mockResolvedValueOnce({
        toObject: () => ({ uuid: 'new-uuid', username: 'bob', display: 'Bob', email: 'bob@ex.com', status: 'ACTIVE' }),
      })

      const result = await service.create({ username: 'bob', password: 'hunter2hunter2', display: 'Bob', email: 'bob@ex.com' })

      expect(mocks.create).toHaveBeenCalledTimes(1)
      const createArg = (mocks.create.mock.calls[0] as [{ passwordHash: string; status: string; username: string }])[0]
      expect(createArg.username).toBe('bob')
      expect(createArg.status).toBe('ACTIVE')
      // bcrypt hash format: $2[a|b|y]$<cost>$<22-char-salt><31-char-hash>
      expect(createArg.passwordHash).toMatch(/^\$2[aby]\$\d{2}\$/)
      expect(createArg.passwordHash).not.toBe('hunter2hunter2')
      expect(result.username).toBe('bob')
    })

    it('honors an explicit status when provided', async () => {
      mocks.create.mockResolvedValueOnce({ toObject: () => ({ uuid: 'new-uuid', status: 'LOCKED' }) })
      await service.create({ username: 'a', password: 'hunter2hunter2', display: 'A', email: 'a@ex.com', status: 'LOCKED' })
      const createArg = (mocks.create.mock.calls[0] as [{ status: string }])[0]
      expect(createArg.status).toBe('LOCKED')
    })

    it('translates duplicate-key Mongo errors (code 11000) into ConflictException', async () => {
      const dupErr = Object.assign(new Error('duplicate key'), { code: 11000 })
      mocks.create.mockRejectedValueOnce(dupErr)
      await expect(service.create({ username: 'bob', password: 'hunter2hunter2', display: 'Bob', email: 'bob@ex.com' })).rejects.toBeInstanceOf(
        ConflictException,
      )
    })
  })

  describe('update', () => {
    it('strips undefined keys before $set and returns the updated record', async () => {
      const updated = { uuid: 'u1', display: 'Alice', status: 'LOCKED' }
      mocks.findOneAndUpdateExec.mockResolvedValueOnce(updated)

      const result = await service.update('u1', { display: 'Alice', email: undefined, status: 'LOCKED' })

      expect(mocks.model.findOneAndUpdate).toHaveBeenCalledWith({ uuid: 'u1' }, { $set: { display: 'Alice', status: 'LOCKED' } }, { new: true })
      expect(result).toBe(updated)
    })

    it('throws NotFoundException when the uuid does not exist', async () => {
      mocks.findOneAndUpdateExec.mockResolvedValueOnce(null)
      await expect(service.update('missing', { display: 'X' })).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
