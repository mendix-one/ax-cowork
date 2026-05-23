import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import type { Model } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

import { Account } from '../../acore/database/schemas/account.schema'
import { AccountRole } from '../../acore/database/schemas/account-role.schema'
import { App } from '../../acore/database/schemas/app.schema'
import { Session } from '../../acore/database/schemas/session.schema'
import { SigninResDto } from './dto/signin.res-dto'

const SESSION_TTL_MS = 24 * 60 * 60 * 1000

@Injectable()
export class SigninService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(AccountRole.name) private readonly accountRoleModel: Model<AccountRole>,
    @InjectModel(App.name) private readonly appModel: Model<App>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    private readonly jwtService: JwtService,
  ) {}

  async signin(appKey: string, username: string, password: string): Promise<SigninResDto> {
    // 1. Resolve the target app first. Missing app is its own error so clients can surface a clear "wrong app" message.
    const app = await this.appModel.findOne({ key: appKey }).lean().exec()
    if (!app) {
      throw new UnauthorizedException('Unknown app')
    }

    // 2. Resolve the account by username.
    const account = await this.accountModel.findOne({ username }).lean().exec()
    if (!account) {
      // Same message as the wrong-password branch below so callers can't enumerate usernames.
      throw new UnauthorizedException('Invalid credentials')
    }

    // 3. Verify the supplied password matches the stored bcrypt hash.
    const passwordMatched = await compare(password, account.passwordHash)
    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // 4. Only `ACTIVE` accounts may sign in — `LOCKED` and `CLOSED` block here with a distinct message
    //    (safe because the caller has already proven they know the password).
    if (account.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active')
    }

    // 5. Resolve granted roles for (account, app). Empty array is allowed — the account simply has no roles for this app.
    const roleRows = await this.accountRoleModel.find({ account: account.uuid, app: app.key }).lean<{ role: string }[]>().exec()
    const roles = roleRows.map((r) => r.role)

    // 6. Issue JWT with roles in the payload; persist the session document carrying the same snapshot.
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
    const accountSnapshot = {
      uuid: account.uuid,
      username: account.username,
      display: account.display,
      avatar: account.avatar,
      phone: account.phone,
      email: account.email,
      status: account.status,
    }
    const appSnapshot = {
      uuid: app.uuid,
      key: app.key,
      type: app.type,
      name: app.name,
      description: app.description,
      avatar: app.avatar,
    }

    // Reuse-or-create: one session per (account, app). If a session already exists for this pair,
    // refresh it in place — same `uuid`, new token + expiresAt + snapshots + roles — so callers
    // signing in twice don't accumulate stale rows. Otherwise mint a new UUID and insert.
    const existingSession = await this.sessionModel
      .findOne({ 'account.uuid': account.uuid, 'app.uuid': app.uuid }, { uuid: 1 })
      .lean<{ uuid: string } | null>()
      .exec()

    const sessionUuid = existingSession?.uuid ?? uuidv7()
    const token = await this.jwtService.signAsync({
      sub: account.uuid,
      app: app.key,
      ses: sessionUuid,
      sta: account.status,
      roles,
    })

    if (existingSession) {
      await this.sessionModel.updateOne({ uuid: sessionUuid }, { $set: { token, account: accountSnapshot, app: appSnapshot, roles, expiresAt } }).exec()
    } else {
      await this.sessionModel.create({
        uuid: sessionUuid,
        token,
        account: accountSnapshot,
        app: appSnapshot,
        roles,
        expiresAt,
      })
    }

    return {
      uuid: sessionUuid,
      token,
      account: accountSnapshot,
      app: appSnapshot,
      roles,
    }
  }
}
