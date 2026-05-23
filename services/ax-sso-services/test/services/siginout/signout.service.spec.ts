import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Session } from '../../../src/acore/database/schemas/session.schema'
import { Token } from '../../../src/acore/database/schemas/token.schema'
import { SignoutService } from '../../../src/services/signout/signout.service'

function chain<T>(resolved: T) {
  const exec = jest.fn().mockResolvedValue(resolved)
  return { exec }
}

function mockSessionModel(existing: { uuid: string } | null = { uuid: 'session-uuid-123' }) {
  const findOne = jest.fn().mockReturnValue({
    lean: () => ({ exec: () => Promise.resolve(existing) }),
  })
  const deleteOne = jest.fn().mockReturnValue(chain({ acknowledged: true, deletedCount: 1 }))
  return { findOne, deleteOne }
}

function mockTokenModel() {
  const deleteMany = jest.fn().mockReturnValue(chain({ acknowledged: true, deletedCount: 2 }))
  return { deleteMany }
}

describe('SignoutService', () => {
  async function buildService(sessionModel: ReturnType<typeof mockSessionModel>, tokenModel: ReturnType<typeof mockTokenModel>): Promise<SignoutService> {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SignoutService,
        { provide: getModelToken(Session.name), useValue: sessionModel },
        { provide: getModelToken(Token.name), useValue: tokenModel },
      ],
    }).compile()
    return moduleRef.get(SignoutService)
  }

  it('deletes the session by uuid, cascades token deletes, and returns a 200 success payload', async () => {
    const sessionModel = mockSessionModel({ uuid: 'session-uuid-123' })
    const tokenModel = mockTokenModel()
    const service = await buildService(sessionModel, tokenModel)

    const result = await service.signout('session-uuid-123')

    expect(sessionModel.findOne).toHaveBeenCalledWith({ uuid: 'session-uuid-123' }, { uuid: 1 })
    expect(sessionModel.deleteOne).toHaveBeenCalledWith({ uuid: 'session-uuid-123' })
    expect(tokenModel.deleteMany).toHaveBeenCalledWith({ session: 'session-uuid-123' })
    expect(result).toEqual({ statusCode: 200, message: 'Signed out successfully' })
  })

  it('returns a 400 payload (and skips the cascade delete) when no session matches', async () => {
    const sessionModel = mockSessionModel(null)
    const tokenModel = mockTokenModel()
    const service = await buildService(sessionModel, tokenModel)

    const result = await service.signout('unknown-uuid')

    expect(result).toEqual({ statusCode: 400, message: 'Session not found' })
    expect(sessionModel.findOne).toHaveBeenCalledWith({ uuid: 'unknown-uuid' }, { uuid: 1 })
    // No deletes happen when the session was never there in the first place.
    expect(sessionModel.deleteOne).not.toHaveBeenCalled()
    expect(tokenModel.deleteMany).not.toHaveBeenCalled()
  })
})
