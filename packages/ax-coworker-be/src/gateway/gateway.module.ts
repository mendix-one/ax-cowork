import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'

import { GatewayMiddleware } from './gateway.middleware'
import { ServicesRegistry } from './services-registry'

// The gateway runs entirely as an Express middleware — by handling the response itself
// (or returning 4xx/5xx without next()) it never reaches Nest's IndexController wildcard.
// Mounted on `app/*` so only routes starting with /app/ trigger the proxy path.
@Module({
  providers: [ServicesRegistry, GatewayMiddleware],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(GatewayMiddleware).forRoutes({ path: 'app/*splat', method: RequestMethod.ALL })
  }
}
