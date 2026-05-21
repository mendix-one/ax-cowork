import { Module } from '@nestjs/common'

import { JobConfigController } from './job-config.controller'
import { JobConfigRepository } from './job-config.repository'
import { JobConfigsService } from './job-config.service'

@Module({
  controllers: [JobConfigController],
  providers: [JobConfigRepository, JobConfigsService],
  exports: [JobConfigsService, JobConfigRepository],
})
export class JobConfigModule {}
