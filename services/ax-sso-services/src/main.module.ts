import { Module } from '@nestjs/common'
import { SecurityModule } from './acore/security'
import { ConfigModule } from './acore/config/config.module'
import { DatabaseModule } from './acore/database/database.module'
import { WorkersModule } from './workers/workers.module'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [ConfigModule, SecurityModule, DatabaseModule, WorkersModule, ServicesModule],
})
export class MainModule {}
