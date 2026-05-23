import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Session } from '../../../src/acore/database/schemas/session.schema'
import { Token } from '../../../src/acore/database/schemas/token.schema'
import { SignoutService } from '../../../src/services/signout/signout.service'

function chain<T>(resolved: T) {
  const exec = jest.fn().mockResolvedValue(resolved)
  return { exec }
}

function mockSessionModel() {
  const sessionDelete = jest.fn().mockReturnValue(chain({ acknowledged: true, deletedCount: 1 }))
  return { deleteOne: sessionDelete }
}

function mockTokenModel() {
  const tokenDelete = jest.fn().mockReturnValue(chain({ acknowledged: true, deletedCount: 2 }))
  return { deleteMany: tokenDelete }
}

describe('SignoutService', () => {
  async function buildService(
    sessionModel: ReturnType<typeof mockSessionModel>,
    tokenModel: ReturnType<typeof mockTokenModel>,
  ): Promise<SignoutService> {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SignoutService,
        { provide: getModelToken(Session.name), useValue: sessionModel },
        { provide: getModelToken(Token.name), useValue: tokenModel },
      ],
    }).compile()
    return moduleRef.get(SignoutService)
  }

  it('deletes the session by uuid AND all tokens whose session matches', async () => {
    const sessionModel = mockSessionModel()
    const tokenModel = mockTokenModel()
    const service = await buildService(sessionModel, tokenModel)

    await service.signout('session-uuid-123')

    expect(sessionModel.deleteOne).toHaveBeenCalledWith({ uuid: 'session-uuid-123' })
    expect(tokenModel.deleteMany).toHaveBeenCalledWith({ session: 'session-uuid-123' })
  })

  it('resolves silently when no session/tokens matched (idempotent)', async () => {
    const sessionModel = mockSessionModel()
    const tokenModel = mockTokenModel()
    // Pretend nothing matched.
    sessionModel.deleteOne.mockReturnValueOnce(chain({ acknowledged: true, deletedCount: 0 }))
    tokenModel.deleteMany.mockReturnValueOnce(chain({ acknowledged: true, deletedCount: 0 }))
    const service = await buildService(sessionModel, tokenModel)

    await expect(service.signout('unknown-uuid')).resolves.toBeUndefined()
    expect(sessionModel.deleteOne).toHaveBeenCalledWith({ uuid: 'unknown-uuid' })
    expect(tokenModel.deleteMany).toHaveBeenCalledWith({ session: 'unknown-uuid' })
  })
})
