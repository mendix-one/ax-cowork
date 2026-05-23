import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import type { Model } from 'mongoose'

import { Account } from '../../acore/database/schemas/account.schema'
import { AccountRole } from '../../acore/database/schemas/account-role.schema'
import { App } from '../../acore/database/schemas/app.schema'
import { Session } from '../../acore/database/schemas/session.schema'
import { Token } from '../../acore/database/schemas/token.schema'
import { SigninResDto } from './dto/signin.res-dto'

// Signin runs against an already-initialized anonymous session: it attaches an
// account to that session rather than creating a new row. Expiry is extended to
// one year from the signin time so the account-bound session lives a full year.
const SESSION_TTL_MS = 365 * 24 * 60 * 60 * 1000

@Injectable()
export class SigninService {
  private readonly logger = new Logger(SigninService.name)

  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(AccountRole.name) private readonly accountRoleModel: Model<AccountRole>,
    @InjectModel(App.name) private readonly appModel: Model<App>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    private readonly jwtService: JwtService,
  ) {}

  async signin(appKey: string, sessionUuid: string, username: string, password: string): Promise<SigninResDto> {
    // 1. Resolve the anonymous session — caller proved ownership via the JWT verified by the guard.
    const session = await this.sessionModel.findOne({ uuid: sessionUuid }).lean().exec()
    if (!session) {
      throw new UnauthorizedException('Session not found')
    }
    // Defense in depth: the JWT's `app` claim and the session's stored app must match.
    if (session.app.key !== appKey) {
      throw new UnauthorizedException('Session app mismatch')
    }

    // 2. Resolve the target app from the session's snapshot key. Missing app would mean the
    //    app was deleted after the session was initialized — surface as a clear error.
    const app = await this.appModel.findOne({ key: appKey }).lean().exec()
    if (!app) {
      throw new UnauthorizedException('Unknown app')
    }

    // 3. Resolve the account by username.
    const account = await this.accountModel.findOne({ username }).lean().exec()
    if (!account) {
      // Same message as the wrong-password branch below so callers can't enumerate usernames.
      throw new UnauthorizedException('Invalid credentials')
    }

    // 4. Verify the supplied password matches the stored bcrypt hash.
    const passwordMatched = await compare(password, account.passwordHash)
    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // 5. Only `ACTIVE` accounts may sign in — `LOCKED` and `CLOSED` block here with a distinct message
    //    (safe because the caller has already proven they know the password).
    if (account.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active')
    }

    // 6. Resolve granted roles for (account, app). Empty array is allowed — the account simply has no roles for this app.
    const roleRows = await this.accountRoleModel.find({ account: account.uuid, app: app.key }).lean<{ role: string }[]>().exec()
    const roles = roleRows.map((r) => r.role)

    // 7. Account-switch guard: if the session is already signed in with a DIFFERENT account,
    //    clear the prior identity and delete every token row tied to this session before attaching
    //    the new account. Deleting the token rows means the next /token call has no stale row to
    //    refresh — a fresh row is minted with the new account.
    if (session.account && session.account.uuid !== account.uuid) {
      this.logger.log(`Session ${sessionUuid}: account switch from ${session.account.uuid} to ${account.uuid}`)
      await this.sessionModel.updateOne({ uuid: sessionUuid }, { $unset: { account: '' }, $set: { roles: [] } }).exec()
      await this.tokenModel.deleteMany({ session: sessionUuid }).exec()
    }

    // 8. Update the existing session: attach account snapshot, set roles, extend expiry one year out.
    //    The session's app snapshot stays intact — it's already pinned to this app from initialize.
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

    await this.sessionModel.updateOne({ uuid: sessionUuid }, { $set: { account: accountSnapshot, roles, expiresAt } }).exec()

    // 9. Mint a fresh signed-in JWT whose lifetime matches the new session expiry.
    const remainingSec = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
    const token = await this.jwtService.signAsync(
      {
        app: app.key,
        ses: sessionUuid,
        sub: account.uuid,
        sta: account.status,
        roles,
      },
      { expiresIn: remainingSec },
    )

    return {
      uuid: sessionUuid,
      token,
      account: accountSnapshot,
      app: appSnapshot,
      roles,
    }
  }
}
