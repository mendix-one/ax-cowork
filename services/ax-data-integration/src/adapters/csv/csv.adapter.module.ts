import { Module, type OnModuleInit } from '@nestjs/common'

import { SourceAdapterRegistry } from '../source-adapter.registry'
import { CsvAdapter } from './csv.adapter'

@Module({
  providers: [CsvAdapter],
  exports: [CsvAdapter],
})
export class CsvAdapterModule implements OnModuleInit {
  constructor(
    private readonly registry: SourceAdapterRegistry,
    private readonly adapter: CsvAdapter,
  ) {}

  onModuleInit(): void {
    this.registry.register(this.adapter)
  }
}
