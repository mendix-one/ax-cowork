import type { Db, IndexDescription, IndexDescriptionInfo } from 'mongodb'

const NAMESPACE_NOT_FOUND = 26

export interface IndexSpec {
  collection: string
  name: string
  key: Record<string, 1 | -1>
  options?: {
    unique?: boolean
    partialFilterExpression?: Record<string, unknown>
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
  { collection: 'sync_runs', name: 'createdAt_desc', key: { createdAt: -1 } },

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
  { collection: 'raw_record_changelog', name: 'createdAt_desc', key: { createdAt: -1 } },
]

export interface IndexEnsureResult {
  collection: string
  name: string
  action: 'created' | 'existed'
}

/**
 * Idempotently ensures every {@link INDEX_SPECS} entry exists on the given DB.
 * Detection is by index name — passing modified options for an existing name will
 * not migrate the index (drop it manually first).
 */
export async function ensureIndexes(db: Db, log?: (msg: string) => void): Promise<IndexEnsureResult[]> {
  const results: IndexEnsureResult[] = []
  for (const spec of INDEX_SPECS) {
    const coll = db.collection(spec.collection)
    let existing: IndexDescriptionInfo[] = []
    try {
      existing = await coll.indexes()
    } catch (err) {
      // Collection does not exist yet — first run on a fresh DB.
      const code = (err as { code?: number }).code
      if (code !== NAMESPACE_NOT_FOUND) throw err
    }
    const alreadyThere = existing.some((i) => i.name === spec.name)

    if (alreadyThere) {
      log?.(`exists   ${spec.collection}.${spec.name}`)
      results.push({ collection: spec.collection, name: spec.name, action: 'existed' })
      continue
    }

    const description: IndexDescription = {
      key: spec.key,
      name: spec.name,
      ...spec.options,
    }
    await coll.createIndexes([description])
    log?.(`created  ${spec.collection}.${spec.name}`)
    results.push({ collection: spec.collection, name: spec.name, action: 'created' })
  }
  return results
}
