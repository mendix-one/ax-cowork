import { Module, OnModuleInit } from '@nestjs/common'

import { SourceAdapterRegistry } from '../source-adapter.registry'
import { ExcelAdapter } from './excel.adapter'

/**
 * Module that owns the {@link ExcelAdapter} provider and self-registers it into the
 * global {@link SourceAdapterRegistry} at Nest's `onModuleInit` phase.
 *
 * Keeping the registration in the module (not on the adapter class) lets unit tests
 * instantiate `new ExcelAdapter()` directly without DI plumbing.
 */
@Module({
  providers: [ExcelAdapter],
  exports: [ExcelAdapter],
})
export class ExcelAdapterModule implements OnModuleInit {
  constructor(
    private readonly registry: SourceAdapterRegistry,
    private readonly adapter: ExcelAdapter,
  ) {}

  onModuleInit(): void {
    this.registry.register(this.adapter)
  }
}
