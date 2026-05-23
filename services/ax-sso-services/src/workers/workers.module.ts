import { Module } from '@nestjs/common'

import { CronjobModule } from '../acore/cronjob'
import { CronjobListener } from './cronjob.listener'

@Module({
  imports: [CronjobModule],
  providers: [CronjobListener],
})
export class WorkersModule {}
