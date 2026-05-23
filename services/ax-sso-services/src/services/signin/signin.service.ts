import { randomBytes } from 'node:crypto'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { compare } from 'bcryptjs'
import type { Model } from 'mongoose'

import { Session } from '../../acore/database/schemas/session.schema'
import { User } from '../../acore/database/schemas/user.schema'
import { SigninResDto } from './dto/signin.res-dto'

const SESSION_TTL_MS = 24 * 60 * 60 * 1000

@Injectable()
export class SigninService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
  ) {}

  async signin(username: string, password: string): Promise<SigninResDto> {
    const user = await this.userModel.findOne({ username }).lean().exec()
    // Identical error for unknown user vs wrong password — don't leak which case it is.
    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials')
    }
    // Active is the only signin-eligible status; `locked` and `closed` block here.
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active')
    }

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
    await this.sessionModel.create({
      token,
      user: {
        username: user.username,
        display: user.display,
        avatar: user.avatar,
        phone: user.phone,
        email: user.email,
        status: user.status,
      },
      expiresAt,
    })

    return { token, expiresAt }
  }
}
