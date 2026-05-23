import { Module } from '@nestjs/common'

import { CronjobModule } from '../acore/cronjob'
import { CronjobListener } from './cronjob.listener'
import { InitializationHandler } from './initialization/initialization.handler'

@Module({
  imports: [CronjobModule],
  providers: [CronjobListener, InitializationHandler],
})
export class WorkersModule {}
