import { Module } from '@nestjs/common'

import { IndexController } from './index/index.controller'
import { HealthCheckController } from './health-check/health-check.controller'

@Module({
  controllers: [IndexController, HealthCheckController],
})
export class ServicesModule {}
