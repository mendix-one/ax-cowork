import { Module } from '@nestjs/common'

import { IndexController } from './index/index.controller'
import { HealthController } from './health/health.controller'

@Module({
  controllers: [IndexController, HealthController],
})
export class ServicesModule {}
