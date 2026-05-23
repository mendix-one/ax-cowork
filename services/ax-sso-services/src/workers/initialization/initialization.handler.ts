import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { hash } from 'bcryptjs'
import type { Model } from 'mongoose'

import { Account } from '../../acore/database/schemas/account.schema'
import { AccountRole } from '../../acore/database/schemas/account-role.schema'
import { App } from '../../acore/database/schemas/app.schema'
import { AppRole } from '../../acore/database/schemas/app-role.schema'

interface AppSeed {
  key: string
  type: string
  name: string
  description?: string
  cdnOwnerId?: string
}

interface AccountSeed {
  username: string
  display: string
  email: string
  password: string // TODO: source from env before going to prod.
  cdnOwnerId?: string
}

const APPS: AppSeed[] = [
  { key: 'SSO', type: 'INTERNAL_SERVICES', name: 'AX SSO', description: 'Single sign-on administration' },
  { key: 'CDN', type: 'INTERNAL_SERVICES', name: 'AX CDN', description: 'Content Delivery Network' },
  { key: 'NOTIFY', type: 'INTERNAL_SERVICES', name: 'AX Notify', description: 'Notification Adapter' },
  { key: 'APLANNER', type: 'WEB_APP', name: 'AX Notify', description: 'aPlanner - WebApp' },
]

const APP_ROLES: { app: string; key: string; name: string; description?: string }[] = [
  { app: 'SSO', key: 'ADMIN', name: 'Administrator', description: 'Full administrative access' },
]

const ACCOUNTS: AccountSeed[] = [
  { username: 'axadmin', display: 'Administrator', email: 'admin@amoza.ai', password: 'TestPassword123' },
  { username: 'axuser', display: 'User', email: 'user@amoza.ai', password: 'TestPassword123' },
]

const ADMIN_ROLES: { app: string; role: string }[] = [{ app: 'SSO', role: 'ADMIN' }]

@Injectable()
export class InitializationHandler {
  private readonly logger = new Logger(InitializationHandler.name)

  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(AccountRole.name) private readonly accountRoleModel: Model<AccountRole>,
    @InjectModel(App.name) private readonly appModel: Model<App>,
    @InjectModel(AppRole.name) private readonly appRoleModel: Model<AppRole>,
  ) {}

  // Runs the one-shot service initialization routine. Invoked by `CronjobListener` when a
  // cronjob named "initialization" fires. Throw to signal failure — the listener will catch
  // it and transition the cronjob to INTERRUPTED with the stack trace recorded.
  //
  // Every step uses upsert semantics so the handler is safe to retry: if the seed already
  // exists, no document is written.
  async execute(parameters: Record<string, unknown> = {}): Promise<void> {
    this.logger.log(`Running initialization (parameters=${JSON.stringify(parameters)})`)

    await this.seedApps()
    await this.seedAppRoles()
    await this.seedAccounts()
    await this.seedAccountRoles()

    this.logger.log('Initialization complete')
  }

  private async seedApps(): Promise<void> {
    for (const app of APPS) {
      // `$set` (not `$setOnInsert`) for mutable fields so re-running initialization migrates
      // existing rows to the current schema shape — e.g. backfilling `type` on docs created
      // before the schema rename from `status` to `type`.
      await this.appModel
        .updateOne(
          { key: app.key },
          {
            $set: {
              type: app.type,
              name: app.name,
              description: app.description,
            },
          },
          { upsert: true },
        )
        .exec()
    }
    this.logger.log(`Ensured ${APPS.length} app(s)`)
  }

  private async seedAppRoles(): Promise<void> {
    for (const role of APP_ROLES) {
      await this.appRoleModel.updateOne({ app: role.app, key: role.key }, { $setOnInsert: role }, { upsert: true }).exec()
    }
    this.logger.log(`Ensured ${APP_ROLES.length} app role(s)`)
  }

  private async seedAccounts(): Promise<void> {
    let created = 0
    for (const seed of ACCOUNTS) {
      // bcrypt is expensive — skip hashing entirely when the account already exists.
      const existing = await this.accountModel.findOne({ username: seed.username }).lean().exec()
      if (existing) continue

      const passwordHash = await hash(seed.password, 10)
      await this.accountModel.create({
        username: seed.username,
        passwordHash,
        display: seed.display,
        email: seed.email,
        status: 'ACTIVE',
      })
      created += 1
      this.logger.warn(`Seeded account "${seed.username}" with default password — rotate immediately.`)
    }
    this.logger.log(`Ensured ${ACCOUNTS.length} account(s) (${created} newly created)`)
  }

  private async seedAccountRoles(): Promise<void> {
    // Find AxAdmin
    const axadmin = await this.accountModel.findOne({ username: 'axadmin' }).lean().exec()
    if (!axadmin) {
      return
    }

    // Note: the current `account_roles` schema has no `account` field, so each row just
    // records that an (app, role) pair is in use — mirrors the AppRole entries.
    for (const pair of ADMIN_ROLES) {
      const params = { account: axadmin.uuid, app: pair.app, role: pair.role }
      await this.accountRoleModel.updateOne(params, { $setOnInsert: params }, { upsert: true }).exec()
    }
    this.logger.log(`Ensured ${ADMIN_ROLES.length} account-role row(s)`)
  }
}
