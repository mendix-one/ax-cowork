import { Global, Module } from '@nestjs/common'

import { SourceAdapterRegistry } from './source-adapter.registry'

/**
 * Hosts the singleton {@link SourceAdapterRegistry}. Concrete adapter modules
 * (Excel, CSV, REST API, …) register their adapters into this registry at module
 * init time.
 *
 * Global so any feature module can inject the registry without re-importing this module.
 */
@Global()
@Module({
  providers: [SourceAdapterRegistry],
  exports: [SourceAdapterRegistry],
})
export class AdaptersModule {}
