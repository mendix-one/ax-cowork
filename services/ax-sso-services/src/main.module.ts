import { Module } from '@nestjs/common'
import { ConfigModule } from './acore/config/config.module'
import { DatabaseModule } from './acore/database/database.module'
import { WorkersModule } from './workers/workers.module'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [ConfigModule, DatabaseModule, WorkersModule, ServicesModule],
})
export class MainModule {}
