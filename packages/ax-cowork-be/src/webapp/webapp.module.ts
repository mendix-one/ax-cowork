import { Module } from '@nestjs/common'

import { ErrorController } from './error/error.controller'
import { IndexController } from './index/index.controller'

@Module({
  controllers: [ErrorController, IndexController],
})
export class WebappModule {}
