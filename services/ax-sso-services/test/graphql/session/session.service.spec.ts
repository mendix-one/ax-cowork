import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Session } from '../../../src/acore/database/schemas/session.schema'
import { SessionService } from '../../../src/graphql/session/session.service'

function mockSessionModel() {
  const findOneExec = jest.fn()
  const findOneLean = jest.fn().mockReturnValue({ exec: findOneExec })
  const findOne = jest.fn().mockReturnValue({ lean: findOneLean })

  const deleteExec = jest.fn()
  const deleteOne = jest.fn().mockReturnValue({ exec: deleteExec })

  return { model: { findOne, deleteOne }, findOne, findOneExec, deleteOne, deleteExec }
}

describe('SessionService (graphql)', () => {
  let mocks: ReturnType<typeof mockSessionModel>
  let service: SessionService

  beforeEach(async () => {
    mocks = mockSessionModel()
    const moduleRef = await Test.createTestingModule({
      providers: [SessionService, { provide: getModelToken(Session.name), useValue: mocks.model }],
    }).compile()
    service = moduleRef.get(SessionService)
  })

  describe('findByToken', () => {
    it('queries by token via lean and returns the session', async () => {
      const session = { token: 't1', uuid: 's1' }
      mocks.findOneExec.mockResolvedValueOnce(session)

      const result = await service.findByToken('t1')

      expect(mocks.model.findOne).toHaveBeenCalledWith({ token: 't1' })
      expect(result).toBe(session)
    })

    it('returns null when the token does not match', async () => {
      mocks.findOneExec.mockResolvedValueOnce(null)
      await expect(service.findByToken('missing')).resolves.toBeNull()
    })
  })

  describe('removeByToken', () => {
    it('returns true when a session was removed', async () => {
      mocks.deleteExec.mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 })

      const result = await service.removeByToken('t1')

      expect(mocks.model.deleteOne).toHaveBeenCalledWith({ token: 't1' })
      expect(result).toBe(true)
    })

    it('returns false when nothing matched the token', async () => {
      mocks.deleteExec.mockResolvedValueOnce({ acknowledged: true, deletedCount: 0 })
      await expect(service.removeByToken('missing')).resolves.toBe(false)
    })
  })
})
