import { Injectable, NotFoundException } from '@nestjs/common'

import type { SourceAdapter } from './source-adapter.interface'

/**
 * In-memory registry of source adapters keyed by `adapter.type`. Concrete adapter
 * modules register themselves at module init time; the sync executor calls `get(type)`
 * to look one up by job_config.source.type.
 */
@Injectable()
export class SourceAdapterRegistry {
  private readonly adapters = new Map<string, SourceAdapter>()

  /** Registers an adapter. Throws if another adapter has already claimed the same `type`. */
  register(adapter: SourceAdapter): void {
    if (this.adapters.has(adapter.type)) {
      throw new Error(`SourceAdapter with type "${adapter.type}" is already registered`)
    }
    this.adapters.set(adapter.type, adapter)
  }

  /** Returns the adapter for the given type. Throws `NotFoundException` if none is registered. */
  get(type: string): SourceAdapter {
    const adapter = this.adapters.get(type)
    if (!adapter) {
      throw new NotFoundException(`No SourceAdapter registered for type "${type}"`)
    }
    return adapter
  }

  has(type: string): boolean {
    return this.adapters.has(type)
  }

  /** Sorted list of registered types. Useful for diagnostics and Swagger enums. */
  registeredTypes(): string[] {
    return [...this.adapters.keys()].sort()
  }
}
