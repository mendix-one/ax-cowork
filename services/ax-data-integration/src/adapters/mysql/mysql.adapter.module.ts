import { Module, type OnModuleInit } from '@nestjs/common'

import { SourceAdapterRegistry } from '../source-adapter.registry'
import { MysqlAdapter } from './mysql.adapter'

@Module({
  // Factory provider so NestJS does not try to resolve the optional `MysqlConnectionFactory`
  // constructor parameter from the DI container. `new MysqlAdapter()` uses the real
  // `mysql2`-backed factory by default.
  providers: [
    {
      provide: MysqlAdapter,
      useFactory: () => new MysqlAdapter(),
    },
  ],
  exports: [MysqlAdapter],
})
export class MysqlAdapterModule implements OnModuleInit {
  constructor(
    private readonly registry: SourceAdapterRegistry,
    private readonly adapter: MysqlAdapter,
  ) {}

  onModuleInit(): void {
    this.registry.register(this.adapter)
  }
}
