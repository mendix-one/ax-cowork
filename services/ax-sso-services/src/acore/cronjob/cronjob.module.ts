import { Module } from '@nestjs/common'

import { CronjobManager } from './cronjob.manager'
import { CronjobScheduler } from './cronjob.scheduler'

@Module({
  providers: [CronjobManager, CronjobScheduler],
  exports: [CronjobManager],
})
export class CronjobModule {}
