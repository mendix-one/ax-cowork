import { Module } from '@nestjs/common'
import { ConfigModule } from './acore/config/config.module'
import { ServicesModule } from './services/services.module'
import { WorkersModule } from './workers/workers.module'

@Module({
  imports: [ConfigModule, ServicesModule, WorkersModule],
})
export class MainModule {}
