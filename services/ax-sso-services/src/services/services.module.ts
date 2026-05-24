import { Module } from '@nestjs/common'

import { HealthCheckController } from './health-check/health-check.controller'
import { IndexController } from './index/index.controller'
import { SessionController } from './session/session.controller'
import { SessionService } from './session/session.service'
import { SigninController } from './signin/signin.controller'
import { SigninService } from './signin/signin.service'
import { SignoutController } from './signout/signout.controller'
import { SignoutService } from './signout/signout.service'
import { TokenController } from './token/token.controller'
import { TokenService } from './token/token.service'

@Module({
  controllers: [IndexController, HealthCheckController, SessionController, SigninController, SignoutController, TokenController],
  providers: [SessionService, SigninService, SignoutService, TokenService],
})
export class ServicesModule {}
