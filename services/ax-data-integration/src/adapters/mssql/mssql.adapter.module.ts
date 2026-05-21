import { Module, type OnModuleInit } from '@nestjs/common'

import { SourceAdapterRegistry } from '../source-adapter.registry'
import { MssqlAdapter } from './mssql.adapter'

@Module({
  // Factory provider so NestJS does not try to resolve the optional `MssqlConnectionFactory`
  // constructor parameter from the DI container. `new MssqlAdapter()` uses the real
  // `mssql`-backed factory by default.
  providers: [
    {
      provide: MssqlAdapter,
      useFactory: () => new MssqlAdapter(),
    },
  ],
  exports: [MssqlAdapter],
})
export class MssqlAdapterModule implements OnModuleInit {
  constructor(
    private readonly registry: SourceAdapterRegistry,
    private readonly adapter: MssqlAdapter,
  ) {}

  onModuleInit(): void {
    this.registry.register(this.adapter)
  }
}
