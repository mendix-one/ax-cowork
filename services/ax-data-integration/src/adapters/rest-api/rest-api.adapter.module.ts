import { Module, type OnModuleInit } from '@nestjs/common'

import { SourceAdapterRegistry } from '../source-adapter.registry'
import { RestApiAdapter } from './rest-api.adapter'

@Module({
  // Factory so NestJS DI doesn't try to resolve the constructor's optional AxiosInstance
  // parameter from the container — `new RestApiAdapter()` uses the default `axios`.
  providers: [
    {
      provide: RestApiAdapter,
      useFactory: () => new RestApiAdapter(),
    },
  ],
  exports: [RestApiAdapter],
})
export class RestApiAdapterModule implements OnModuleInit {
  constructor(
    private readonly registry: SourceAdapterRegistry,
    private readonly adapter: RestApiAdapter,
  ) {}

  onModuleInit(): void {
    this.registry.register(this.adapter)
  }
}
