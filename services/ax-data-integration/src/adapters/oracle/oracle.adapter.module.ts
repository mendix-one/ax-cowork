import { Module, type OnModuleInit } from '@nestjs/common'

import { SourceAdapterRegistry } from '../source-adapter.registry'
import { OracleAdapter } from './oracle.adapter'

@Module({
  // Factory provider so NestJS does not try to resolve the optional `OracleConnectionFactory`
  // constructor parameter from the DI container. `new OracleAdapter()` uses the real
  // `oracledb`-backed factory by default (thin mode — no Instant Client required).
  providers: [
    {
      provide: OracleAdapter,
      useFactory: () => new OracleAdapter(),
    },
  ],
  exports: [OracleAdapter],
})
export class OracleAdapterModule implements OnModuleInit {
  constructor(
    private readonly registry: SourceAdapterRegistry,
    private readonly adapter: OracleAdapter,
  ) {}

  onModuleInit(): void {
    this.registry.register(this.adapter)
  }
}
