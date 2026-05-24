import { NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { CronjobManager } from '../../../src/acore/cronjob/cronjob.manager'
import { Cronjob } from '../../../src/acore/database/schemas/cronjob.schema'

function mockCronjobModel() {
  const createdDoc = { toObject: jest.fn() }
  const create = jest.fn().mockResolvedValue(createdDoc)

  // find().sort().lean().exec() chain
  const findExec = jest.fn()
  const findLean = jest.fn().mockReturnValue({ exec: findExec })
  const findSort = jest.fn().mockReturnValue({ lean: findLean })
  const find = jest.fn().mockReturnValue({ sort: findSort })

  // findOne().lean().exec() chain (used by `create(..., checkDuplicated=true)`)
  const findOneExec = jest.fn().mockResolvedValue(null)
  const findOneLean = jest.fn().mockReturnValue({ exec: findOneExec })
  const findOne = jest.fn().mockReturnValue({ lean: findOneLean })

  // findOneAndUpdate().lean().exec() chain
  const updateExec = jest.fn()
  const updateLean = jest.fn().mockReturnValue({ exec: updateExec })
  const findOneAndUpdate = jest.fn().mockReturnValue({ lean: updateLean })

  return {
    model: { create, find, findOne, findOneAndUpdate },
    createdDoc,
    findSort,
    findLean,
    findExec,
    findOne,
    findOneExec,
    findOneAndUpdate,
    updateExec,
  }
}

describe('CronjobManager', () => {
  let mocks: ReturnType<typeof mockCronjobModel>
  let manager: CronjobManager

  beforeEach(async () => {
    mocks = mockCronjobModel()
    const moduleRef = await Test.createTestingModule({
      providers: [CronjobManager, { provide: getModelToken(Cronjob.name), useValue: mocks.model }],
    }).compile()
    manager = moduleRef.get(CronjobManager)
  })

  describe('create', () => {
    it('inserts a READY job with retries=0 and issuedAt now, then returns the plain object', async () => {
      const persisted = { uuid: 'u1', name: 'demo', status: 'READY', retries: 0, parameters: { x: 1 } }
      mocks.createdDoc.toObject.mockReturnValue(persisted)

      const result = await manager.create('demo', { x: 1 })

      expect(mocks.model.create).toHaveBeenCalledTimes(1)
      expect(mocks.model.create).toHaveBeenCalledWith({
        name: 'demo',
        parameters: { x: 1 },
        status: 'READY',
        retries: 0,
        issuedAt: expect.any(Date) as Date,
      })
      expect(result).toBe(persisted)
    })

    it('defaults parameters to an empty object', async () => {
      mocks.createdDoc.toObject.mockReturnValue({})
      await manager.create('demo')
      expect(mocks.model.create).toHaveBeenCalledWith(expect.objectContaining({ parameters: {} }))
    })

    it('does not dedupe by default (checkDuplicated=false) — never calls findOne', async () => {
      mocks.createdDoc.toObject.mockReturnValue({})
      await manager.create('demo')
      expect(mocks.model.findOne).not.toHaveBeenCalled()
      expect(mocks.model.create).toHaveBeenCalledTimes(1)
    })

    it('with checkDuplicated=true and an existing job by name, returns the existing job without creating', async () => {
      const existing = { uuid: 'existing-uuid', name: 'demo', status: 'PROCESSING' }
      mocks.findOneExec.mockResolvedValueOnce(existing)

      const result = await manager.create('demo', { x: 1 }, true)

      expect(mocks.model.findOne).toHaveBeenCalledWith({ name: 'demo' })
      expect(mocks.model.create).not.toHaveBeenCalled()
      expect(result).toBe(existing)
    })

    it('with checkDuplicated=true and no existing job, falls through to a normal create', async () => {
      const persisted = { uuid: 'new-uuid', name: 'demo' }
      mocks.findOneExec.mockResolvedValueOnce(null)
      mocks.createdDoc.toObject.mockReturnValue(persisted)

      const result = await manager.create('demo', { x: 1 }, true)

      expect(mocks.model.findOne).toHaveBeenCalledWith({ name: 'demo' })
      expect(mocks.model.create).toHaveBeenCalledTimes(1)
      expect(result).toBe(persisted)
    })
  })

  describe('scan', () => {
    it('queries READY and INTERRUPTED with default retries cap of 5, sorted by issuedAt ascending', async () => {
      const jobs = [{ uuid: 'a' }, { uuid: 'b' }]
      mocks.findExec.mockResolvedValueOnce(jobs)

      const result = await manager.scan()

      expect(mocks.model.find).toHaveBeenCalledWith({ status: { $in: ['READY', 'INTERRUPTED'] }, retries: { $lte: 5 } })
      expect(mocks.findSort).toHaveBeenCalledWith({ issuedAt: 1 })
      expect(result).toBe(jobs)
    })

    it('honors a custom retries cap', async () => {
      mocks.findExec.mockResolvedValueOnce([])
      await manager.scan(2)
      expect(mocks.model.find).toHaveBeenCalledWith({ status: { $in: ['READY', 'INTERRUPTED'] }, retries: { $lte: 2 } })
    })
  })

  describe('start', () => {
    it('only matches READY or INTERRUPTED, transitions to PROCESSING, sets startedAt, increments retries', async () => {
      const updated = { uuid: 'u1', status: 'PROCESSING', retries: 1 }
      mocks.updateExec.mockResolvedValueOnce(updated)

      const result = await manager.start('u1')

      expect(mocks.model.findOneAndUpdate).toHaveBeenCalledWith(
        { uuid: 'u1', status: { $in: ['READY', 'INTERRUPTED'] } },
        { $set: { status: 'PROCESSING', startedAt: expect.any(Date) as Date }, $inc: { retries: 1 } },
        { returnDocument: 'after' },
      )
      expect(result).toBe(updated)
    })

    it('returns undefined when no job matches (missing uuid or wrong current status)', async () => {
      mocks.updateExec.mockResolvedValueOnce(null)
      await expect(manager.start('missing')).resolves.toBeUndefined()
    })
  })

  describe('complete', () => {
    it('sets status=COMPLETED and completedAt=now', async () => {
      mocks.updateExec.mockResolvedValueOnce({ uuid: 'u1' })

      await manager.complete('u1')

      expect(mocks.model.findOneAndUpdate).toHaveBeenCalledWith(
        { uuid: 'u1' },
        { $set: { status: 'COMPLETED', completedAt: expect.any(Date) as Date } },
        { returnDocument: 'after' },
      )
    })

    it('throws NotFoundException when the job does not exist', async () => {
      mocks.updateExec.mockResolvedValueOnce(null)
      await expect(manager.complete('missing')).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('abort', () => {
    it('sets status=ABORTED, remark, and completedAt=now', async () => {
      mocks.updateExec.mockResolvedValueOnce({ uuid: 'u1' })

      await manager.abort('u1', 'manual cancel')

      expect(mocks.model.findOneAndUpdate).toHaveBeenCalledWith(
        { uuid: 'u1' },
        { $set: { status: 'ABORTED', remark: 'manual cancel', completedAt: expect.any(Date) as Date } },
        { returnDocument: 'after' },
      )
    })

    it('throws NotFoundException when the job does not exist', async () => {
      mocks.updateExec.mockResolvedValueOnce(null)
      await expect(manager.abort('missing', 'reason')).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('interrupt', () => {
    it('sets status=INTERRUPTED, message, and increments retries (no completedAt)', async () => {
      mocks.updateExec.mockResolvedValueOnce({ uuid: 'u1' })

      await manager.interrupt('u1', 'boom')

      expect(mocks.model.findOneAndUpdate).toHaveBeenCalledWith(
        { uuid: 'u1' },
        {
          $set: { status: 'INTERRUPTED', message: 'boom' },
          $inc: { retries: 1 },
        },
        { returnDocument: 'after' },
      )
    })

    it('throws NotFoundException when the job does not exist', async () => {
      mocks.updateExec.mockResolvedValueOnce(null)
      await expect(manager.interrupt('missing', 'boom')).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
