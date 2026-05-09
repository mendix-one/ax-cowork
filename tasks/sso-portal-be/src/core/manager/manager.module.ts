import { JwtModule } from '@nestjs/jwt'
import { Global, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ScheduleModule } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '../config/config.module'

import { Job } from '../database/job.model'
import { Session } from '../database/session.model'
import { SessionManager } from './session.manager'
import { SessionHistory } from '../database/session-history.model'
import { Short } from '../database/short.model'

import { JwtManager } from './jwt.manager'
import { CryptoManager } from './crypto.manager'
import { HashingManager } from './hashing.manager'
import { PartitionManager } from './partition.manager'
import { TransactionManager } from './transaction.manager'
import { DateTimeManager } from './date-time.manager'
import { TaskManager } from './task.manager'
import { JobManager } from './job.manager'
import { ShortLinkManager } from './short-link.manager'

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([Job, Session, SessionHistory, Short]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    JwtManager,
    CryptoManager,
    HashingManager,
    DateTimeManager,
    TransactionManager,
    PartitionManager,
    SessionManager,
    TaskManager,
    JobManager,
    ShortLinkManager
  ],
  exports: [
    JwtManager,
    CryptoManager,
    HashingManager,
    DateTimeManager,
    TransactionManager,
    PartitionManager,
    SessionManager,
    TaskManager,
    JobManager,
    ShortLinkManager
  ]
})
export class ManagerModule {}
