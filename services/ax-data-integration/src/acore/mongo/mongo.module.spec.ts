import { ConfigService } from '@nestjs/config'
import type { Db, MongoClient } from 'mongodb'

import * as indexesModule from './indexes'
import { MongoModule } from './mongo.module'

/**
 * Unit-level test for the `onApplicationBootstrap` hook. The hook owns three branches:
 *
 *  1. `INTEGRATION_AUTO_ENSURE_INDEXES=false` → skip ensureIndexes, log warn.
 *  2. Happy path → call ensureIndexes, log a summary line.
 *  3. ensureIndexes takes longer than the timeout → log warn, boot continues, the in-flight
 *     promise must NOT throw an unhandled rejection.
 */
describe('MongoModule.onApplicationBootstrap', () => {
  const fakeClient = {} as unknown as MongoClient
  const fakeDb = {} as unknown as Db

  function buildConfig(overrides: Record<string, unknown> = {}): ConfigService {
    const values: Record<string, unknown> = {
      INTEGRATION_AUTO_ENSURE_INDEXES: true,
      INTEGRATION_INDEX_ENSURE_TIMEOUT_MS: 30_000,
      ...overrides,
    }
    return { get: (key: string) => values[key] } as unknown as ConfigService
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('skips ensureIndexes when INTEGRATION_AUTO_ENSURE_INDEXES=false', async () => {
    const spy = jest.spyOn(indexesModule, 'ensureIndexes').mockResolvedValue([])
    const mod = new MongoModule(fakeClient, fakeDb, buildConfig({ INTEGRATION_AUTO_ENSURE_INDEXES: false }))

    await mod.onApplicationBootstrap()

    expect(spy).not.toHaveBeenCalled()
  })

  it('calls ensureIndexes once on the happy path', async () => {
    const spy = jest.spyOn(indexesModule, 'ensureIndexes').mockResolvedValue([
      { collection: 'sync_runs', name: 'running_lock_unique', action: 'created' },
      { collection: 'sync_runs', name: 'createdAt_ttl', action: 'existed' },
    ])
    const mod = new MongoModule(fakeClient, fakeDb, buildConfig())

    await mod.onApplicationBootstrap()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(fakeDb, expect.any(Function))
  })

  it('returns without throwing when ensureIndexes exceeds the configured timeout', async () => {
    // ensureIndexes that never resolves within the test window
    const ensureNeverFinishes = new Promise<indexesModule.IndexEnsureResult[]>(() => {})
    jest.spyOn(indexesModule, 'ensureIndexes').mockReturnValue(ensureNeverFinishes)
    const mod = new MongoModule(fakeClient, fakeDb, buildConfig({ INTEGRATION_INDEX_ENSURE_TIMEOUT_MS: 50 }))

    // Hook must resolve (not throw) within a small margin past the timeout — proves it
    // doesn't block boot indefinitely.
    const start = Date.now()
    await mod.onApplicationBootstrap()
    expect(Date.now() - start).toBeLessThan(1_000)
  })

  it('does not crash when the timed-out ensureIndexes later rejects', async () => {
    // Simulate the in-flight promise rejecting after the timeout fired.
    const rejectAfterTimeout = new Promise<indexesModule.IndexEnsureResult[]>((_, reject) => {
      setTimeout(() => reject(new Error('mongo gone')), 30)
    })
    jest.spyOn(indexesModule, 'ensureIndexes').mockReturnValue(rejectAfterTimeout)
    const mod = new MongoModule(fakeClient, fakeDb, buildConfig({ INTEGRATION_INDEX_ENSURE_TIMEOUT_MS: 10 }))

    await mod.onApplicationBootstrap()
    // Give the background promise a tick to settle so the catch handler runs without
    // surfacing an unhandled rejection in the test process.
    await new Promise((r) => setTimeout(r, 60))
  })
})
