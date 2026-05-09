import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { InitialWorkerService } from './initial-worker.service'
import { InitialWorkerListener } from './initial-worker.listener'
import { Country } from '../../core/database/country.model'
import { Region } from '../../core/database/region.model'
import { District } from '../../core/database/district.model'
import { Ward } from '../../core/database/ward.model'
import { Language } from '../../core/database/language.model'
import { Display } from '../../core/database/display.model'
import { Timezone } from '../../core/database/timezone.model'
import { Currency } from '../../core/database/currency.model'
import { User } from '../../core/database/user.model'
import { Setting } from '../../core/database/setting.model'
import { Account } from '../../core/database/account.model'
import { Artifact } from '../../core/database/artifact.model'
import { Client } from '../../core/database/client.model'
import { Role } from '../../core/database/role.model'
import { AccountRole } from '../../core/database/account-role.model'
import { ArtifactAccount } from '../../core/database/artifact-account.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Country,
      Region,
      District,
      Ward,
      Language,
      Display,
      Timezone,
      Currency,
      User,
      Setting,
      Account,
      Artifact,
      Client,
      Role,
      AccountRole,
      ArtifactAccount
    ])
  ],
  providers: [InitialWorkerService, InitialWorkerListener]
})
export class InitialWorkerModule {}
