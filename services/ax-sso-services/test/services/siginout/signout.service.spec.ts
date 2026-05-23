import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'

import { Session } from '../../../src/acore/database/schemas/session.schema'
import { SignoutService } from '../../../src/services/signout/signout.service'

function mockSessionModel() {
  const exec = jest.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 })
  const deleteOne = jest.fn().mockReturnValue({ exec })
  return { deleteOne, exec }
}

describe('SignoutService', () => {
  async function buildService(sessionModel: ReturnType<typeof mockSessionModel>): Promise<SignoutService> {
    const moduleRef = await Test.createTestingModule({
      providers: [SignoutService, { provide: getModelToken(Session.name), useValue: sessionModel }],
    }).compile()
    return moduleRef.get(SignoutService)
  }

  it('deletes the session with the supplied token', async () => {
    const sessionModel = mockSessionModel()
    const service = await buildService(sessionModel)

    await service.signout('the-token')

    expect(sessionModel.deleteOne).toHaveBeenCalledWith({ token: 'the-token' })
    expect(sessionModel.exec).toHaveBeenCalledTimes(1)
  })

  it('resolves silently when the token does not match a session', async () => {
    const sessionModel = mockSessionModel()
    sessionModel.exec.mockResolvedValueOnce({ acknowledged: true, deletedCount: 0 })
    const service = await buildService(sessionModel)

    await expect(service.signout('unknown-token')).resolves.toBeUndefined()
    expect(sessionModel.deleteOne).toHaveBeenCalledWith({ token: 'unknown-token' })
  })
})
