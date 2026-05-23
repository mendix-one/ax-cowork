import { UnauthorizedException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'

import { Session } from '../../../src/acore/database/schemas/session.schema'
import { User } from '../../../src/acore/database/schemas/user.schema'
import { SigninService } from '../../../src/services/signin/signin.service'

interface FoundUser {
  username: string
  passwordHash: string
}

function mockUserModel(found: FoundUser | null) {
  return {
    findOne: jest.fn().mockReturnValue({
      lean: () => ({ exec: () => Promise.resolve(found) }),
    }),
  }
}

function mockSessionModel() {
  return {
    create: jest.fn().mockResolvedValue(undefined),
  }
}

describe('SigninService', () => {
  const username = 'alice'
  const password = 'correct horse'
  let passwordHash: string

  beforeAll(async () => {
    passwordHash = await hash(password, 4)
  })

  async function buildService(userModel: ReturnType<typeof mockUserModel>, sessionModel: ReturnType<typeof mockSessionModel>): Promise<SigninService> {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SigninService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Session.name), useValue: sessionModel },
      ],
    }).compile()
    return moduleRef.get(SigninService)
  }

  it('throws UnauthorizedException when the user does not exist', async () => {
    const userModel = mockUserModel(null)
    const sessionModel = mockSessionModel()
    const service = await buildService(userModel, sessionModel)

    await expect(service.signin(username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
  })

  it('throws UnauthorizedException when the password does not match', async () => {
    const userModel = mockUserModel({ username, passwordHash })
    const sessionModel = mockSessionModel()
    const service = await buildService(userModel, sessionModel)

    await expect(service.signin(username, 'wrong password')).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
  })

  it('returns a token + expiresAt and persists a session on valid credentials', async () => {
    const userModel = mockUserModel({ username, passwordHash })
    const sessionModel = mockSessionModel()
    const service = await buildService(userModel, sessionModel)

    const before = Date.now()
    const result = await service.signin(username, password)
    const after = Date.now()

    expect(result.token).toMatch(/^[a-f0-9]{64}$/)
    expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(before + 24 * 60 * 60 * 1000)
    expect(result.expiresAt.getTime()).toBeLessThanOrEqual(after + 24 * 60 * 60 * 1000)

    expect(sessionModel.create).toHaveBeenCalledTimes(1)
    expect(sessionModel.create).toHaveBeenCalledWith({ token: result.token, username, expiresAt: result.expiresAt })
  })

  it('returns a distinct token on each call', async () => {
    const userModel = mockUserModel({ username, passwordHash })
    const sessionModel = mockSessionModel()
    const service = await buildService(userModel, sessionModel)

    const a = await service.signin(username, password)
    const b = await service.signin(username, password)
    expect(a.token).not.toBe(b.token)
  })
})
