import { Module, type OnModuleInit } from '@nestjs/common'

import { SourceAdapterRegistry } from '../source-adapter.registry'
import { PostgresAdapter } from './postgres.adapter'

@Module({
  // Factory provider so NestJS does not try to resolve the optional `PgConnectionFactory`
  // constructor parameter from the DI container. `new PostgresAdapter()` uses the real
  // `pg` + `pg-cursor`-backed factory by default.
  providers: [
    {
      provide: PostgresAdapter,
      useFactory: () => new PostgresAdapter(),
    },
  ],
  exports: [PostgresAdapter],
})
export class PostgresAdapterModule implements OnModuleInit {
  constructor(
    private readonly registry: SourceAdapterRegistry,
    private readonly adapter: PostgresAdapter,
  ) {}

  onModuleInit(): void {
    this.registry.register(this.adapter)
  }
}
