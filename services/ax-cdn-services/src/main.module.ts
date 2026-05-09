import { Module } from '@nestjs/common'
import { ConfigModule } from './acore/config/config.module'
import { WorkerModule } from './worker/worker.module'
import { ServicesModule } from './services/services.module'

@Module({
  imports: [ConfigModule, WorkerModule, ServicesModule],
})
export class MainModule {}
