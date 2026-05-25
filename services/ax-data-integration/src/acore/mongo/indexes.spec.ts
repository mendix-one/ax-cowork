import { buildTtlIndexSpecs, readTtlOptionsFromEnv } from './indexes'

/**
 * Unit tests for the TTL helpers (T2-A05, T2-A06, T2-A07).
 *
 * - `readTtlOptionsFromEnv` is the only place env → seconds conversion lives, so the
 *   day/seconds precedence and the NODE_ENV=test gate need explicit coverage.
 * - `buildTtlIndexSpecs` is small but worth a smoke test so a refactor that drops
 *   a collection from the TTL pair is caught immediately.
 *
 * Recreate-on-TTL-mismatch behaviour of `ensureIndexes` itself is covered by the e2e
 * suite (`test/indexes.e2e-spec.ts`) — needs a real Mongo to exercise the drop+create.
 */
describe('readTtlOptionsFromEnv', () => {
  const DAY = 86400

  it('uses defaults when no env vars are set', () => {
    const opts = readTtlOptionsFromEnv({})
    expect(opts.changelogTtlSec).toBe(90 * DAY)
    expect(opts.syncRunTtlSec).toBe(30 * DAY)
  })

  it('respects *_DAYS variants', () => {
    const opts = readTtlOptionsFromEnv({
      INTEGRATION_TTL_CHANGELOG_DAYS: '7',
      INTEGRATION_TTL_SYNC_RUN_DAYS: '14',
    })
    expect(opts.changelogTtlSec).toBe(7 * DAY)
    expect(opts.syncRunTtlSec).toBe(14 * DAY)
  })

  it('ignores *_SECONDS overrides when NODE_ENV is not "test"', () => {
    const opts = readTtlOptionsFromEnv({
      NODE_ENV: 'production',
      INTEGRATION_TTL_CHANGELOG_DAYS: '90',
      INTEGRATION_TTL_CHANGELOG_SECONDS: '5',
    })
    expect(opts.changelogTtlSec).toBe(90 * DAY)
  })

  it('honours *_SECONDS overrides only when NODE_ENV=test', () => {
    const opts = readTtlOptionsFromEnv({
      NODE_ENV: 'test',
      INTEGRATION_TTL_CHANGELOG_DAYS: '90',
      INTEGRATION_TTL_CHANGELOG_SECONDS: '5',
      INTEGRATION_TTL_SYNC_RUN_SECONDS: '7',
    })
    expect(opts.changelogTtlSec).toBe(5)
    expect(opts.syncRunTtlSec).toBe(7)
  })

  it('falls back to days even in test mode when only one *_SECONDS override is given', () => {
    const opts = readTtlOptionsFromEnv({
      NODE_ENV: 'test',
      INTEGRATION_TTL_CHANGELOG_SECONDS: '5',
      INTEGRATION_TTL_SYNC_RUN_DAYS: '15',
    })
    expect(opts.changelogTtlSec).toBe(5)
    expect(opts.syncRunTtlSec).toBe(15 * DAY)
  })
})

describe('buildTtlIndexSpecs', () => {
  it('returns the two TTL specs with the supplied expireAfterSeconds', () => {
    const specs = buildTtlIndexSpecs({ changelogTtlSec: 100, syncRunTtlSec: 200 })
    expect(specs).toHaveLength(2)

    const changelog = specs.find((s) => s.collection === 'raw_record_changelog')
    expect(changelog?.name).toBe('createdAt_ttl')
    expect(changelog?.key).toEqual({ createdAt: 1 })
    expect(changelog?.options?.expireAfterSeconds).toBe(100)

    const syncRuns = specs.find((s) => s.collection === 'sync_runs')
    expect(syncRuns?.name).toBe('createdAt_ttl')
    expect(syncRuns?.key).toEqual({ createdAt: 1 })
    expect(syncRuns?.options?.expireAfterSeconds).toBe(200)
  })
})
