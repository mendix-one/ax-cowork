import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { Account, AccountSchema } from './schemas/account.schema'
import { AccountRole, AccountRoleSchema } from './schemas/account-role.schema'
import { App, AppSchema } from './schemas/app.schema'
import { AppRole, AppRoleSchema } from './schemas/app-role.schema'
import { Cronjob, CronjobSchema } from './schemas/cronjob.schema'
import { Session, SessionSchema } from './schemas/session.schema'

const FEATURE_MODELS = MongooseModule.forFeature([
  { name: Account.name, schema: AccountSchema },
  { name: Session.name, schema: SessionSchema },
  { name: Cronjob.name, schema: CronjobSchema },
  { name: App.name, schema: AppSchema },
  { name: AppRole.name, schema: AppRoleSchema },
  { name: AccountRole.name, schema: AccountRoleSchema },
])

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    FEATURE_MODELS,
  ],
  exports: [FEATURE_MODELS],
})
export class DatabaseModule {}
