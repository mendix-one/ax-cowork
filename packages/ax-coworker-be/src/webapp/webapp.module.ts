import { Module } from '@nestjs/common'

import { IndexController } from './index/index.controller'
import { SigninController } from './signin/signin.controller'
import { SignoutController } from './signout/signout.controller'

// Explicit /signin and /signout routes are registered before IndexController's
// wildcard catch-all so they win the route match.
@Module({
  controllers: [SigninController, SignoutController, IndexController],
})
export class WebappModule {}
