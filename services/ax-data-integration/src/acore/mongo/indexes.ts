import type { Db, IndexDescription, IndexDescriptionInfo } from 'mongodb'

const NAMESPACE_NOT_FOUND = 26

export interface IndexSpec {
  collection: string
  name: string
  key: Record<string, 1 | -1>
  options?: {
    unique?: boolean
    partialFilterExpression?: Record<string, unknown>
    expireAfterSeconds?: number
  }
}

/**
 * TTL retention windows (in seconds) for the two collections that self-prune.
 * Wired from env (`INTEGRATION_TTL_CHANGELOG_DAYS`, `INTEGRATION_TTL_SYNC_RUN_DAYS`)
 * with second-granularity overrides (`INTEGRATION_TTL_*_SECONDS`) honoured only
 * in NODE_ENV=test so e2e suites can sidestep the day floor.
 */
export interface TtlOptions {
  changelogTtlSec: number
  syncRunTtlSec: number
}

const DAY_SEC = 86400
const DEFAULT_CHANGELOG_DAYS = 90
const DEFAULT_SYNC_RUN_DAYS = 30

/**
 * Reads TTL config off process.env. Always returns a fully-populated TtlOptions —
 * defaults applied when env vars are absent. Test-mode seconds overrides win over
 * the days variant.
 */
export function readTtlOptionsFromEnv(env: NodeJS.ProcessEnv = process.env): TtlOptions {
  const isTest = env.NODE_ENV === 'test'
  const changelogSec = isTest && env.INTEGRATION_TTL_CHANGELOG_SECONDS ? parseInt(env.INTEGRATION_TTL_CHANGELOG_SECONDS, 10) : undefined
  const syncRunSec = isTest && env.INTEGRATION_TTL_SYNC_RUN_SECONDS ? parseInt(env.INTEGRATION_TTL_SYNC_RUN_SECONDS, 10) : undefined
  const changelogDays = env.INTEGRATION_TTL_CHANGELOG_DAYS ? parseInt(env.INTEGRATION_TTL_CHANGELOG_DAYS, 10) : DEFAULT_CHANGELOG_DAYS
  const syncRunDays = env.INTEGRATION_TTL_SYNC_RUN_DAYS ? parseInt(env.INTEGRATION_TTL_SYNC_RUN_DAYS, 10) : DEFAULT_SYNC_RUN_DAYS
  return {
    changelogTtlSec: changelogSec ?? changelogDays * DAY_SEC,
    syncRunTtlSec: syncRunSec ?? syncRunDays * DAY_SEC,
  }
}

/**
 * Authoritative list of MongoDB indexes for the service, mirroring P002 §5.
 * Adding or changing an index here must be matched by an update to that document.
 *
 * Index names are explicit (not auto-generated) so that {@link ensureIndexes} can
 * idempotently detect existing indexes by name without recreating them.
 */
export const INDEX_SPECS: IndexSpec[] = [
  // job_configs (P002 §5.1)
  { collection: 'job_configs', name: 'enabled_1', key: { enabled: 1 } },
  { collection: 'job_configs', name: 'name_unique', key: { name: 1 }, options: { unique: true } },

  // source_metadata (P002 §5.2)
  { collection: 'source_metadata', name: 'jobConfigId_detectedAt_desc', key: { jobConfigId: 1, detectedAt: -1 } },
  { collection: 'source_metadata', name: 'jobConfigId_schemaHash_unique', key: { jobConfigId: 1, schemaHash: 1 }, options: { unique: true } },

  // raw_records (P002 §5.3)
  { collection: 'raw_records', name: 'jobConfigId_recordKey_unique', key: { jobConfigId: 1, recordKey: 1 }, options: { unique: true } },
  { collection: 'raw_records', name: 'jobConfigId_status_lastSeenAt_desc', key: { jobConfigId: 1, status: 1, lastSeenAt: -1 } },
  { collection: 'raw_records', name: 'jobConfigId_lastUpdatedRunId', key: { jobConfigId: 1, lastUpdatedRunId: 1 } },
  { collection: 'raw_records', name: 'payloadHash', key: { payloadHash: 1 } },

  // sync_runs (P002 §5.4) — partial unique index is the run-lock mechanism
  {
    collection: 'sync_runs',
    name: 'running_lock_unique',
    key: { jobConfigId: 1, status: 1 },
    options: { unique: true, partialFilterExpression: { status: 'running' } },
  },
  { collection: 'sync_runs', name: 'jobConfigId_startedAt_desc', key: { jobConfigId: 1, startedAt: -1 } },
  { collection: 'sync_runs', name: 'status_heartbeatAt', key: { status: 1, heartbeatAt: 1 } },
  // sync_runs.createdAt: TTL index replaces the phase-1 `createdAt_desc` sort index.
  // The ascending single-field index serves the "list newest first" use case equally
  // well (Mongo scans ascending indexes in reverse for sort). TTL spec is built
  // dynamically via buildTtlIndexSpecs() — value depends on INTEGRATION_TTL_SYNC_RUN_DAYS.

  // source_files (P002 §5.5)
  { collection: 'source_files', name: 'checksum', key: { checksum: 1 } },
  { collection: 'source_files', name: 'uploadedAt_desc', key: { uploadedAt: -1 } },

  // secrets (P002 §5.6)
  { collection: 'secrets', name: 'name_unique', key: { name: 1 }, options: { unique: true } },

  // raw_record_changelog (P002 §5.7)
  {
    collection: 'raw_record_changelog',
    name: 'jobConfigId_recordKey_occurredAt_desc',
    key: { jobConfigId: 1, recordKey: 1, occurredAt: -1 },
  },
  { collection: 'raw_record_changelog', name: 'rawRecordId_occurredAt_desc', key: { rawRecordId: 1, occurredAt: -1 } },
  { collection: 'raw_record_changelog', name: 'syncRunId', key: { syncRunId: 1 } },
  // raw_record_changelog.createdAt: TTL index replaces phase-1 `createdAt_desc`.
  // See sync_runs comment above; same reasoning applies. TTL spec is built dynamically
  // — value depends on INTEGRATION_TTL_CHANGELOG_DAYS.
]

/**
 * TTL index specs built from runtime config. Kept separate from {@link INDEX_SPECS}
 * because their `expireAfterSeconds` is operator-tunable via env (T2-A05).
 */
export function buildTtlIndexSpecs(opts: TtlOptions): IndexSpec[] {
  return [
    {
      collection: 'raw_record_changelog',
      name: 'createdAt_ttl',
      key: { createdAt: 1 },
      options: { expireAfterSeconds: opts.changelogTtlSec },
    },
    {
      collection: 'sync_runs',
      name: 'createdAt_ttl',
      key: { createdAt: 1 },
      options: { expireAfterSeconds: opts.syncRunTtlSec },
    },
  ]
}

/**
 * Full index spec list = static {@link INDEX_SPECS} + dynamic TTL specs. Callers that
 * don't have a ConfigService handy (migrate-indexes CLI, e2e setup) can omit `opts`
 * and the helper reads from process.env.
 */
export function getAllIndexSpecs(opts: TtlOptions = readTtlOptionsFromEnv()): IndexSpec[] {
  return [...INDEX_SPECS, ...buildTtlIndexSpecs(opts)]
}

export interface IndexEnsureResult {
  collection: string
  name: string
  action: 'created' | 'existed' | 'recreated'
}

/**
 * Subset of {@link INDEX_SPECS} whose absence violates a correctness invariant — not just
 * performance. Used by `/health/ready` (T2-A02) to fail-fast when the DB is missing an
 * index whose loss would silently allow duplicate keys / overlapping runs / etc.
 *
 * Selection rule: every spec with `options.unique === true` is critical. Sort/lookup
 * indexes are excluded — they degrade performance but not correctness.
 */
export const CRITICAL_INDEX_SPECS: IndexSpec[] = INDEX_SPECS.filter((spec) => spec.options?.unique === true)

export interface MissingCriticalIndex {
  collection: string
  name: string
}

/**
 * Returns the list of critical indexes that are NOT currently materialized in the DB.
 * Empty array means the DB satisfies every correctness invariant. Non-empty array is what
 * `/health/ready` exposes in its 503 payload.
 */
export async function findMissingCriticalIndexes(db: Db): Promise<MissingCriticalIndex[]> {
  const byCollection = new Map<string, IndexSpec[]>()
  for (const spec of CRITICAL_INDEX_SPECS) {
    const list = byCollection.get(spec.collection) ?? []
    list.push(spec)
    byCollection.set(spec.collection, list)
  }

  const missing: MissingCriticalIndex[] = []
  for (const [collection, specs] of byCollection) {
    let existing: IndexDescriptionInfo[] = []
    try {
      existing = await db.collection(collection).indexes()
    } catch (err) {
      const code = (err as { code?: number }).code
      if (code !== NAMESPACE_NOT_FOUND) throw err
      // Collection doesn't exist → every critical index for it is missing
      for (const spec of specs) missing.push({ collection: spec.collection, name: spec.name })
      continue
    }
    const presentNames = new Set(existing.map((i) => i.name))
    for (const spec of specs) {
      if (!presentNames.has(spec.name)) {
        missing.push({ collection: spec.collection, name: spec.name })
      }
    }
  }
  return missing
}

/**
 * Idempotently ensures every static + TTL index spec exists on the given DB.
 * Detection is by index name. Special case: when a spec carries `expireAfterSeconds`
 * (TTL index) and an index with the same name already exists with a different TTL,
 * the existing index is dropped and recreated so an env bump (T2-A05) takes effect on
 * next boot. Non-TTL option drift is NOT auto-migrated — drop the index manually first.
 */
export async function ensureIndexes(db: Db, log?: (msg: string) => void, ttl?: TtlOptions): Promise<IndexEnsureResult[]> {
  const specs = getAllIndexSpecs(ttl)
  const results: IndexEnsureResult[] = []
  for (const spec of specs) {
    const coll = db.collection(spec.collection)
    let existing: IndexDescriptionInfo[] = []
    try {
      existing = await coll.indexes()
    } catch (err) {
      // Collection does not exist yet — first run on a fresh DB.
      const code = (err as { code?: number }).code
      if (code !== NAMESPACE_NOT_FOUND) throw err
    }
    const existingMatch = existing.find((i) => i.name === spec.name)
    const desiredTtl = spec.options?.expireAfterSeconds
    const currentTtl = (existingMatch as { expireAfterSeconds?: number } | undefined)?.expireAfterSeconds

    if (existingMatch) {
      if (desiredTtl !== undefined && desiredTtl !== currentTtl) {
        log?.(`recreate ${spec.collection}.${spec.name} (TTL ${currentTtl ?? 'none'} → ${desiredTtl})`)
        await coll.dropIndex(spec.name)
        await createSpec(coll, spec)
        results.push({ collection: spec.collection, name: spec.name, action: 'recreated' })
        continue
      }
      log?.(`exists   ${spec.collection}.${spec.name}`)
      results.push({ collection: spec.collection, name: spec.name, action: 'existed' })
      continue
    }

    await createSpec(coll, spec)
    log?.(`created  ${spec.collection}.${spec.name}`)
    results.push({ collection: spec.collection, name: spec.name, action: 'created' })
  }
  return results
}

async function createSpec(coll: ReturnType<Db['collection']>, spec: IndexSpec): Promise<void> {
  const description: IndexDescription = {
    key: spec.key,
    name: spec.name,
    ...spec.options,
  }
  await coll.createIndexes([description])
}
