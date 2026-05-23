import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import type { Model } from 'mongoose'

import { Account } from '../../acore/database/schemas/account.schema'
import { Session } from '../../acore/database/schemas/session.schema'
import { SigninResDto } from './dto/signin.res-dto'

const SESSION_TTL_MS = 24 * 60 * 60 * 1000

// `Session.app` is required by the schema; until the signin payload carries the target app
// explicitly, every signin is treated as a session against the SSO app itself.
const DEFAULT_APP_KEY = 'sso'

@Injectable()
export class SigninService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private readonly jwtService: JwtService,
  ) {}

  async signin(username: string, password: string): Promise<SigninResDto> {
    const account = await this.accountModel.findOne({ username }).lean().exec()
    // Identical error for unknown account vs wrong password — don't leak which case it is.
    if (!account || !(await compare(password, account.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials')
    }
    // Active is the only signin-eligible status; `LOCKED` and `CLOSED` block here.
    if (account.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active')
    }

    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
    // Standard JWT claim names (`sub`, `iat`, `exp`) — `exp` is auto-populated by JwtService from `signOptions.expiresIn`.
    const payload = {
      sub: account.uuid,
      username: account.username,
      email: account.email,
      status: account.status,
      app: DEFAULT_APP_KEY,
      roles: [] as string[],
    }
    const token = await this.jwtService.signAsync(payload)

    await this.sessionModel.create({
      token,
      account: {
        uuid: account.uuid,
        username: account.username,
        display: account.display,
        avatar: account.avatar,
        phone: account.phone,
        email: account.email,
        status: account.status,
      },
      app: DEFAULT_APP_KEY,
      roles: [],
      expiresAt,
    })

    return { token, expiresAt }
  }
}
