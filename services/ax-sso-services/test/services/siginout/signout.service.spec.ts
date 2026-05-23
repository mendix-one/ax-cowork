import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Session } from '../../../src/acore/database/schemas/session.schema'
import { Token } from '../../../src/acore/database/schemas/token.schema'
import { SignoutService } from '../../../src/services/signout/signout.service'

function chain<T>(resolved: T) {
  const exec = jest.fn().mockResolvedValue(resolved)
  return { exec }
}

interface SessionRow {
  account?: { uuid: string }
}

function mockSessionModel(existing: SessionRow | null) {
  const findOne = jest.fn().mockReturnValue({
    lean: () => ({ exec: () => Promise.resolve(existing) }),
  })
  const updateOne = jest.fn().mockReturnValue(chain({ acknowledged: true, matchedCount: 1, modifiedCount: 1 }))
  return { findOne, updateOne }
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

  it('detaches the account, clears roles, cascade-deletes tokens, and returns a 200 success payload', async () => {
    const sessionModel = mockSessionModel({ account: { uuid: 'acct-uuid' } })
    const tokenModel = mockTokenModel()
    const service = await buildService(sessionModel, tokenModel)

    const result = await service.signout('session-uuid-123')

    expect(sessionModel.findOne).toHaveBeenCalledWith({ uuid: 'session-uuid-123' }, { account: 1 })
    expect(sessionModel.updateOne).toHaveBeenCalledWith({ uuid: 'session-uuid-123' }, { $unset: { account: '' }, $set: { roles: [] } })
    expect(tokenModel.deleteMany).toHaveBeenCalledWith({ session: 'session-uuid-123' })
    expect(result).toEqual({ statusCode: 200, message: 'Signed out successfully' })
  })

  it('returns a 400 payload (and skips writes) when no session matches', async () => {
    const sessionModel = mockSessionModel(null)
    const tokenModel = mockTokenModel()
    const service = await buildService(sessionModel, tokenModel)

    const result = await service.signout('unknown-uuid')

    expect(result).toEqual({ statusCode: 400, message: 'Session not found' })
    expect(sessionModel.updateOne).not.toHaveBeenCalled()
    expect(tokenModel.deleteMany).not.toHaveBeenCalled()
  })

  it('returns a 400 payload (and skips writes) when the session has no account attached', async () => {
    // Session exists but never signed in — signout is a no-op against an anonymous session.
    const sessionModel = mockSessionModel({})
    const tokenModel = mockTokenModel()
    const service = await buildService(sessionModel, tokenModel)

    const result = await service.signout('anon-session-uuid')

    expect(result).toEqual({ statusCode: 400, message: 'Session is not signed in' })
    expect(sessionModel.updateOne).not.toHaveBeenCalled()
    expect(tokenModel.deleteMany).not.toHaveBeenCalled()
  })
})
