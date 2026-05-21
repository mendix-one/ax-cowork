import { NotFoundException } from '@nestjs/common'

import type { AdapterRecord, SourceAdapter, SourceSchema } from './source-adapter.interface'
import { SourceAdapterRegistry } from './source-adapter.registry'

function makeAdapter(type: string): SourceAdapter {
  return {
    type,
    discoverMetadata: (): Promise<SourceSchema> => Promise.resolve({ fields: [], raw: {} }),
    stream: (): AsyncIterable<AdapterRecord> =>
      (async function* () {
        /* no records */
      })(),
  }
}

describe('SourceAdapterRegistry', () => {
  it('registers an adapter and returns it via get()', () => {
    const registry = new SourceAdapterRegistry()
    const adapter = makeAdapter('excel')
    registry.register(adapter)
    expect(registry.get('excel')).toBe(adapter)
    expect(registry.has('excel')).toBe(true)
  })

  it('throws when registering a duplicate type', () => {
    const registry = new SourceAdapterRegistry()
    registry.register(makeAdapter('excel'))
    expect(() => registry.register(makeAdapter('excel'))).toThrow(/already registered/)
  })

  it('throws NotFoundException for an unknown type', () => {
    const registry = new SourceAdapterRegistry()
    expect(() => registry.get('missing')).toThrow(NotFoundException)
  })

  it('has() returns false for unregistered types', () => {
    const registry = new SourceAdapterRegistry()
    expect(registry.has('whatever')).toBe(false)
  })

  it('registeredTypes() returns a sorted list', () => {
    const registry = new SourceAdapterRegistry()
    registry.register(makeAdapter('rest'))
    registry.register(makeAdapter('excel'))
    registry.register(makeAdapter('csv'))
    expect(registry.registeredTypes()).toEqual(['csv', 'excel', 'rest'])
  })
})
