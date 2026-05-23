import { Module } from '@nestjs/common'

import { HealthCheckController } from './health-check/health-check.controller'
import { IndexController } from './index/index.controller'
import { SigninController } from './signin/signin.controller'
import { SigninService } from './signin/signin.service'
import { SignoutController } from './signout/signout.controller'
import { SignoutService } from './signout/signout.service'

@Module({
  controllers: [IndexController, HealthCheckController, SigninController, SignoutController],
  providers: [SigninService, SignoutService],
})
export class ServicesModule {}
