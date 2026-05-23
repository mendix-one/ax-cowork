import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Account } from '../../acore/database/schemas/account.schema'
import { Session } from '../../acore/database/schemas/session.schema'
import { Token } from '../../acore/database/schemas/token.schema'
import { ProfileSessionType, ProfileType } from './profile.type'
import { UpdateProfileInput } from './update-profile.input'

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  // Returns the caller's account record plus all their currently-active sessions. The TTL index on
  // `sessions.expiresAt` removes expired rows automatically, so a simple "all sessions for this
  // account" lookup is sufficient — no extra `expiresAt > now` predicate needed.
  async getProfile(callerAccountUuid: string): Promise<ProfileType> {
    const account = await this.accountModel.findOne({ uuid: callerAccountUuid }).lean<Account>().exec()
    if (!account) {
      throw new NotFoundException('Account not found')
    }

    const sessionRows = await this.sessionModel
      .find({ 'account.uuid': callerAccountUuid })
      .sort({ createdAt: -1 })
      .lean<Array<{ uuid: string; app: { uuid: string; key: string; name: string; avatar: string; description: string }; expiresAt: Date; createdAt?: Date }>>()
      .exec()
    const sessions: ProfileSessionType[] = sessionRows.map((s) => ({
      uuid: s.uuid,
      app: {
        uuid: s.app.uuid,
        key: s.app.key,
        name: s.app.name,
        avatar: s.app.avatar,
        description: s.app.description,
      },
      expiresAt: s.expiresAt,
    }))

    return { account, sessions }
  }

  async updateProfile(callerAccountUuid: string, input: UpdateProfileInput): Promise<Account> {
    // Strip undefined keys so omitting a field leaves the stored value intact.
    const $set: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input)) {
      if (v !== undefined) $set[k] = v
    }

    const updated = await this.accountModel.findOneAndUpdate({ uuid: callerAccountUuid }, { $set }, { returnDocument: 'after' }).lean<Account>().exec()
    if (!updated) throw new NotFoundException('Account not found')
    return updated
  }

  // Kills one of the caller's own sessions. The session must belong to the caller (matched by
  // embedded `account.uuid`) — otherwise we 403 so callers can't enumerate or terminate someone
  // else's sessions. Anonymous sessions (no account yet) are treated as "not yours". Tokens
  // minted from the killed session cascade-delete alongside it.
  async killSession(callerAccountUuid: string, sessionUuid: string): Promise<boolean> {
    const session = await this.sessionModel.findOne({ uuid: sessionUuid }, { 'account.uuid': 1 }).lean<{ account?: { uuid: string } } | null>().exec()
    if (!session) return false
    if (session.account?.uuid !== callerAccountUuid) {
      throw new ForbiddenException('Session does not belong to the caller')
    }
    await this.sessionModel.deleteOne({ uuid: sessionUuid }).exec()
    await this.tokenModel.deleteMany({ session: sessionUuid }).exec()
    return true
  }
}
