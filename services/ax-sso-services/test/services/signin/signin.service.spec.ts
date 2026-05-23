import { UnauthorizedException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'

import { Account } from '../../../src/acore/database/schemas/account.schema'
import type { AccountStatus } from '../../../src/acore/database/schemas/account.schema'
import { Session } from '../../../src/acore/database/schemas/session.schema'
import { SigninService } from '../../../src/services/signin/signin.service'

interface FoundAccount {
  uuid: string
  username: string
  passwordHash: string
  display: string
  email: string
  phone?: string
  avatar?: string
  status: AccountStatus
}

const baseAccount = (overrides: Partial<FoundAccount> = {}): FoundAccount => ({
  uuid: '0190a1b2-c3d4-7e5f-8901-234567890abc',
  username: 'alice',
  passwordHash: '__set in beforeAll__',
  display: 'Alice',
  email: 'alice@example.com',
  phone: '+1-555-0100',
  avatar: 'https://cdn.example/alice.png',
  status: 'ACTIVE',
  ...overrides,
})

function mockAccountModel(found: FoundAccount | null) {
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

  async function buildService(accountModel: ReturnType<typeof mockAccountModel>, sessionModel: ReturnType<typeof mockSessionModel>): Promise<SigninService> {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SigninService,
        { provide: getModelToken(Account.name), useValue: accountModel },
        { provide: getModelToken(Session.name), useValue: sessionModel },
      ],
    }).compile()
    return moduleRef.get(SigninService)
  }

  it('throws UnauthorizedException when the account does not exist', async () => {
    const accountModel = mockAccountModel(null)
    const sessionModel = mockSessionModel()
    const service = await buildService(accountModel, sessionModel)

    await expect(service.signin(username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
  })

  it('throws UnauthorizedException when the password does not match', async () => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const sessionModel = mockSessionModel()
    const service = await buildService(accountModel, sessionModel)

    await expect(service.signin(username, 'wrong password')).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
  })

  it('returns a token + expiresAt and persists a session on valid credentials', async () => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const sessionModel = mockSessionModel()
    const service = await buildService(accountModel, sessionModel)

    const before = Date.now()
    const result = await service.signin(username, password)
    const after = Date.now()

    expect(result.token).toMatch(/^[a-f0-9]{64}$/)
    expect(result.expiresAt.getTime()).toBeGreaterThanOrEqual(before + 24 * 60 * 60 * 1000)
    expect(result.expiresAt.getTime()).toBeLessThanOrEqual(after + 24 * 60 * 60 * 1000)

    expect(sessionModel.create).toHaveBeenCalledTimes(1)
    expect(sessionModel.create).toHaveBeenCalledWith({
      token: result.token,
      account: {
        uuid: '0190a1b2-c3d4-7e5f-8901-234567890abc',
        username,
        display: 'Alice',
        email: 'alice@example.com',
        phone: '+1-555-0100',
        avatar: 'https://cdn.example/alice.png',
        status: 'ACTIVE',
      },
      expiresAt: result.expiresAt,
    })
  })

  it.each(['LOCKED', 'CLOSED'] as const)('throws UnauthorizedException when the account status is %s', async (status) => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash, status }))
    const sessionModel = mockSessionModel()
    const service = await buildService(accountModel, sessionModel)

    await expect(service.signin(username, password)).rejects.toBeInstanceOf(UnauthorizedException)
    expect(sessionModel.create).not.toHaveBeenCalled()
  })

  it('returns a distinct token on each call', async () => {
    const accountModel = mockAccountModel(baseAccount({ passwordHash }))
    const sessionModel = mockSessionModel()
    const service = await buildService(accountModel, sessionModel)

    const a = await service.signin(username, password)
    const b = await service.signin(username, password)
    expect(a.token).not.toBe(b.token)
  })
})
