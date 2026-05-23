import { Module } from '@nestjs/common'
import { ConfigModule } from './acore/config/config.module'
import { WorkersModule } from './workers/workers.module'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [ConfigModule, WorkersModule, ServicesModule],
})
export class MainModule {}
