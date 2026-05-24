import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import type { Model } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

import { AccountRole } from '../../acore/database/schemas/account-role.schema'
import { Session } from '../../acore/database/schemas/session.schema'
import { Token } from '../../acore/database/schemas/token.schema'
import { TokenResDto } from './dto/token.res-dto'

// JWT-payload shape: `sub` / `sta` / `roles` are only included for signed-in sessions; anonymous
// sessions get `app` + `ses` + an empty `roles` array. The guard's `sign:false` mode permits both.
interface TokenPayload {
  app: string
  ses: string
  roles: string[]
  sub?: string
  sta?: string
}

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(AccountRole.name) private readonly accountRoleModel: Model<AccountRole>,
    private readonly jwtService: JwtService,
  ) {}

  // Mints (or refreshes) an app-scoped JWT for the calling session. Works for both signed-in
  // and anonymous sessions:
  //   - Signed-in: token row carries account uuid + status-derived roles; JWT includes `sub`/`sta`/`roles`.
  //   - Anonymous: token row has no account; JWT carries `app` + `ses` + empty `roles`.
  //
  // Reuse-or-create is keyed by (session, app) — a session has at most one active token per app,
  // refreshed in place on repeat calls so we don't accumulate stale rows.
  //
  // The token's expiresAt is anchored to the backing session's expiresAt: callers cannot use a
  // derived app token past the lifetime of the session that minted it. If the session no longer
  // exists (signed out, TTL-expired), refuse to issue.
  async issue(session: string, scope: string): Promise<TokenResDto> {
    const sessionDoc = await this.sessionModel
      .findOne({ uuid: session }, { uuid: 1, expiresAt: 1, account: 1 })
      .lean<{ uuid: string; expiresAt: Date; account?: { uuid: string; status: string } } | null>()
      .exec()
    if (!sessionDoc) {
      throw new UnauthorizedException('Session no longer exists')
    }
    const expiresAt = sessionDoc.expiresAt
    const signedIn = Boolean(sessionDoc.account)
    const accountUuid = sessionDoc.account?.uuid
    const accountStatus = sessionDoc.account?.status

    // Roles are only meaningful for signed-in sessions. Anonymous tokens always carry an empty roles list.
    let roles: string[] = []
    if (signedIn && accountUuid) {
      const roleRows = await this.accountRoleModel.find({ account: accountUuid, app: scope }).lean<{ role: string }[]>().exec()
      roles = roleRows.map((r) => r.role)
    }

    // JWT `exp` is set in seconds-from-now. Clamp to ≥1s in case the session is on the edge of expiry.
    const remainingSec = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000))

    const payload: TokenPayload = { app: scope, ses: session, sub: undefined, sta: undefined, roles }
    if (signedIn && accountUuid) payload.sub = accountUuid
    if (signedIn && accountStatus) payload.sta = accountStatus

    const existing = await this.tokenModel.findOne({ session, app: scope }, { uuid: 1 }).lean<{ uuid: string } | null>().exec()
    const tokenUuid = existing?.uuid ?? uuidv7()
    const jwt = await this.jwtService.signAsync(payload, { expiresIn: remainingSec })

    // Account is set/unset deliberately so the row reflects the current session identity even if
    // the session was just signed out (anonymous now) after a previous signed-in token was issued.
    const $set: Record<string, unknown> = { expiresAt, roles }
    const $unset: Record<string, ''> = {}
    if (accountUuid) {
      $set.account = accountUuid
    } else {
      $unset.account = ''
    }

    if (existing) {
      const update: Record<string, unknown> = { $set }
      if (Object.keys($unset).length > 0) update.$unset = $unset
      await this.tokenModel.updateOne({ uuid: tokenUuid }, update).exec()
    } else {
      await this.tokenModel.create({
        uuid: tokenUuid,
        app: scope,
        session,
        account: accountUuid,
        roles,
        expiresAt,
      })
    }

    return {
      uuid: tokenUuid,
      token: jwt,
      app: scope,
      session,
      account: accountUuid,
      roles,
      expiresAt,
    }
  }
}
