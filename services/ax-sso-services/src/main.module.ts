import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ScheduleModule } from '@nestjs/schedule'

import { SecurityModule } from './acore/security'
import { ConfigModule } from './acore/config/config.module'
import { DatabaseModule } from './acore/database/database.module'
import { GraphQLModule } from './graphql/graphql.module'
import { WorkersModule } from './workers/workers.module'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule,
    SecurityModule,
    DatabaseModule,
    GraphQLModule,
    WorkersModule,
    ServicesModule,
  ],
})
export class MainModule {}
