import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import type { Model } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

import { AccountRole } from '../../acore/database/schemas/account-role.schema'
import { Session } from '../../acore/database/schemas/session.schema'
import { Token } from '../../acore/database/schemas/token.schema'
import { TokenResDto } from './dto/token.res-dto'

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(AccountRole.name) private readonly accountRoleModel: Model<AccountRole>,
    private readonly jwtService: JwtService,
  ) {}

  // Reuse-or-create: one token per (account, session, scope). If a token already exists for this
  // triple, refresh it in place — same `uuid`, new JWT + expiresAt + roles — so repeat calls don't
  // accumulate stale rows. Otherwise mint a new UUID and insert.
  //
  // The token's expiresAt is anchored to the backing session's expiresAt: callers cannot use a
  // derived app token past the lifetime of the session that minted it. If the session no longer
  // exists (signed out elsewhere, TTL-expired), the bearer is orphaned — refuse to issue.
  async issue(account: string, session: string, state: string, scope: string): Promise<TokenResDto> {
    const sessionDoc = await this.sessionModel.findOne({ uuid: session }, { uuid: 1, expiresAt: 1 }).lean<{ uuid: string; expiresAt: Date } | null>().exec()
    if (!sessionDoc) {
      throw new UnauthorizedException('Session no longer exists')
    }
    const expiresAt = sessionDoc.expiresAt

    // Resolve the account's roles within `scope` (the target app). Empty array is allowed —
    // the account simply has no roles granted for this app. Roles are re-read on every issue
    // so a refreshed token reflects role changes since the original signin.
    const roleRows = await this.accountRoleModel.find({ account, app: scope }).lean<{ role: string }[]>().exec()
    const roles = roleRows.map((r) => r.role)

    // JWT `exp` is set in seconds-from-now. Clamp to ≥1s in case the session is on the edge of expiry.
    const remainingSec = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000))

    const existing = await this.tokenModel.findOne({ account, session, app: scope }, { uuid: 1 }).lean<{ uuid: string } | null>().exec()
    const tokenUuid = existing?.uuid ?? uuidv7()
    const jwt = await this.jwtService.signAsync(
      {
        app: scope,
        sub: account,
        ses: session,
        sta: state,
        roles,
      },
      { expiresIn: remainingSec },
    )

    if (existing) {
      await this.tokenModel.updateOne({ uuid: tokenUuid }, { $set: { token: jwt, expiresAt, roles } }).exec()
    } else {
      await this.tokenModel.create({
        uuid: tokenUuid,
        token: jwt,
        expiresAt,
        account,
        session,
        app: scope,
        roles,
      })
    }

    return {
      uuid: tokenUuid,
      token: jwt,
      account,
      session,
      app: scope,
      roles,
      expiresAt,
    }
  }
}
