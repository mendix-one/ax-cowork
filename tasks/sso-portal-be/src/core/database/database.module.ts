import { Global, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigService } from '@nestjs/config'

import { Job } from './job.model'
import { Country } from './country.model'
import { Region } from './region.model'
import { District } from './district.model'
import { Ward } from './ward.model'
import { Language } from './language.model'
import { Display } from './display.model'
import { Timezone } from './timezone.model'
import { Currency } from './currency.model'
import { Artifact } from './artifact.model'
import { Client } from './client.model'
import { User } from './user.model'
import { Setting } from './setting.model'
import { Account } from './account.model'
import { Connection } from './connection.model'
import { Access } from './access.model'
import { Session } from './session.model'
import { Unit } from './unit.model'
import { ArtifactAccount } from './artifact-account.model'
import { UnitAccount } from './unit-account.model'
import { Role } from './role.model'
import { AccountRole } from './account-role.model'
import { SessionHistory } from './session-history.model'
import { Code } from './code.model'
import { Short } from './short.model'

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        timezone: 'UTC',
        dialect: configService.get('DB_TYPE'),
        logging: configService.get('DB_LOGGING') !== 'DISABLED',
        replication: {
          write: {
            host: configService.get('DB_HOST'),
            port: +configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE')
          },
          read: [
            {
              host: configService.get('DB_REPLICA_HOST'),
              port: +configService.get('DB_REPLICA_PORT'),
              username: configService.get('DB_REPLICA_USERNAME'),
              password: configService.get('DB_REPLICA_PASSWORD'),
              database: configService.get('DB_REPLICA_DATABASE')
            }
          ]
        },
        pool: {
          max: +configService.get('DB_POOL_MAX'),
          min: +configService.get('DB_POOL_MIN'),
          acquire: +configService.get('DB_POOL_ACQUIRE'),
          idle: +configService.get('DB_POOL_IDLE')
        },
        dialectOptions: {
          connectTimeout: +configService.get('DB_CONNECT_TIMEOUT')
        },
        autoLoadModels: true,
        synchronize: true,
        models: [
          Job,
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
          Code,
          Artifact,
          ArtifactAccount,
          Unit,
          UnitAccount,
          Role,
          AccountRole,
          Client,
          Session,
          SessionHistory,
          Connection,
          Access,
          Short
        ]
      })
    })
  ]
})
export class DatabaseModule {}
