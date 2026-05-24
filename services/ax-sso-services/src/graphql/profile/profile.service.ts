import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Account } from '../../acore/database/schemas/account.schema'
import { AccountRole } from '../../acore/database/schemas/account-role.schema'
import { App } from '../../acore/database/schemas/app.schema'
import { AppRole } from '../../acore/database/schemas/app-role.schema'
import { Session } from '../../acore/database/schemas/session.schema'
import { Token } from '../../acore/database/schemas/token.schema'
import { ProfileAppRolesType, ProfileSessionType, ProfileType } from './profile.type'
import { UpdateProfileInput } from './update-profile.input'

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(AccountRole.name) private readonly accountRoleModel: Model<AccountRole>,
    @InjectModel(App.name) private readonly appModel: Model<App>,
    @InjectModel(AppRole.name) private readonly appRoleModel: Model<AppRole>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  // Returns the caller's account record + active sessions + the apps and roles they're
  // assigned to. The TTL index on `sessions.expiresAt` removes expired rows automatically,
  // so a simple "all sessions for this account" lookup is sufficient — no extra
  // `expiresAt > now` predicate needed.
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

    const appRoles = await this.buildAppRoles(callerAccountUuid)

    return { account, sessions, appRoles }
  }

  // Build the "apps + roles" projection. AccountRole stores (account, app, role) — we join
  // each row against the parent App + AppRole records so the client gets human-friendly
  // names/descriptions/avatars without N round trips.
  //
  // Two queries instead of one per (app, role) pair: we fetch all referenced Apps and
  // AppRoles in `$in` batches, then assemble the response from in-memory maps. AppRoles
  // referenced by AccountRole rows but missing from the AppRole collection (data drift)
  // are still surfaced — their `name` falls back to the role key — rather than dropping
  // the role and silently telling the caller they have fewer permissions than they do.
  private async buildAppRoles(callerAccountUuid: string): Promise<ProfileAppRolesType[]> {
    const accountRoles = await this.accountRoleModel.find({ account: callerAccountUuid }).lean<Array<{ app: string; role: string }>>().exec()
    if (accountRoles.length === 0) return []

    // Group role keys by app, preserving insertion order so the output is stable.
    const roleKeysByApp = new Map<string, string[]>()
    for (const row of accountRoles) {
      const list = roleKeysByApp.get(row.app) ?? []
      if (!list.includes(row.role)) list.push(row.role)
      roleKeysByApp.set(row.app, list)
    }

    const appKeys = Array.from(roleKeysByApp.keys())

    const [appDocs, appRoleDocs] = await Promise.all([
      this.appModel
        .find({ key: { $in: appKeys } })
        .lean<Array<{ uuid: string; key: string; name: string; avatar?: string; description?: string }>>()
        .exec(),
      this.appRoleModel
        .find({ app: { $in: appKeys } })
        .lean<Array<{ app: string; key: string; name: string; description?: string }>>()
        .exec(),
    ])

    const appByKey = new Map(appDocs.map((a) => [a.key, a]))
    // Nested map: appKey → (roleKey → AppRole document).
    const appRolesByApp = new Map<string, Map<string, { name: string; description?: string }>>()
    for (const r of appRoleDocs) {
      let inner = appRolesByApp.get(r.app)
      if (!inner) {
        inner = new Map()
        appRolesByApp.set(r.app, inner)
      }
      inner.set(r.key, { name: r.name, description: r.description })
    }

    return appKeys.map((appKey) => {
      const appDoc = appByKey.get(appKey)
      const roleKeys = roleKeysByApp.get(appKey) ?? []
      const roleLookup = appRolesByApp.get(appKey)
      return {
        app: {
          uuid: appDoc?.uuid ?? '',
          key: appKey,
          name: appDoc?.name ?? appKey,
          avatar: appDoc?.avatar,
          description: appDoc?.description,
        },
        roles: roleKeys.map((rk) => {
          const meta = roleLookup?.get(rk)
          return {
            key: rk,
            name: meta?.name ?? rk,
            description: meta?.description,
          }
        }),
      }
    })
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
