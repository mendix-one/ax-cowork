Detailed design for the **Data Integration Service** for aPlanner, based on the requirements in [O001-data-integration.md](O001-data-integration.md) and the summary + technical decisions in [P001-requirement-summary.md](P001-requirement-summary.md).

Purpose of this document: lock down the **architecture, schema, flow, and implementation order** for phase 1 in enough detail to start coding, while leaving room to extend to later phases (webhook, event adapter, multi-worker scale).

---

## 1. Phase 1 goal & scope

Build a new NestJS service that:

1. Runs sync jobs on cron schedules, pulling data from files / databases / external APIs.
2. Stores raw data in MongoDB as-is (ELT).
3. Detects and marks insert / update / delete after each sync.
4. Stores source metadata + sync history for traceability and auditing.
5. Exposes a REST admin API (CRUD job config, view history, manual trigger).
6. API-Key authentication.

**Out of phase 1 scope**: webhooks, MQTT / event adapter, transform / ingestion, rule engine, data analysis, multi-worker scale, distributed lock, admin UI.

---

## 2. Overall architecture

```text
                ┌────────────────────────────────────────────────────────┐
                │             ax-data-integration (NestJS, single process) │
                │                                                          │
   cron tick ──▶│ SchedulerService ──▶ SyncExecutor ──▶ SourceAdapter      │
                │       │                  │                  │            │
                │       │                  ▼                  ▼            │
                │       │            heartbeat       Excel/CSV/DB/API      │
                │       │            (setInterval)                          │
   POST /trigger│       │                                                  │
   ────────────▶│  ManualTriggerService ──▶ (same SyncExecutor path)       │
                │                                                          │
                │  StaleRunSweeperService  ──▶ scans sync_runs every 60s   │
                │                                                          │
                │  AdminAPI (controllers) ◀── x-api-key guard              │
                └─────────────────────────┬────────────────────────────────┘
                                          │
                                          ▼
                                  ┌───────────────┐
                                  │   MongoDB     │
                                  │ (single node) │
                                  └───────────────┘
```

Key properties:

- **Single process**, multi-job concurrency through Node async I/O.
- **MongoDB is the source of truth** for every piece of state: job config, run history, raw data, metadata, secrets (encrypted).
- **No queue, no Redis** in phase 1.

---

## 3. Workspace location

New project: **`services/ax-data-integration/`** (peer to `services/ax-cdn-services/`).

Why placed under `services/` (not `packages/`):

1. It's an API/worker container that ships independently, not a shared library.
2. Symmetric with `ax-cdn-services` (also an internal NestJS service).
3. The root CLAUDE.md already designates `services/*` as the deploy-unit location.

Package name: `@ax-cowork/data-integration` (`@ax-cowork/<name>` convention) — or the unscoped `ax-data-integration` to match `ax-cdn-services`. **Decided**: `ax-data-integration` (no scope, matches `ax-cdn-services`).

Default port: `3012` (after `ax-cowork-be:3000` and `ax-cdn-services:3011`).

---

## 4. NestJS folder structure

Borrowing from `services/ax-cdn-services/` (MainModule + ConfigModule + ServicesModule + WorkersModule), but organized by domain to scale better:

```text
services/ax-data-integration/
├── src/
│   ├── main.ts                     // bootstrap, port 3012, ValidationPipe, Swagger
│   ├── main.module.ts              // root module
│   │
│   ├── acore/                      // cross-cutting infrastructure
│   │   ├── config/                 // @nestjs/config + joi
│   │   ├── auth/
│   │   │   └── api-key.guard.ts
│   │   ├── mongo/
│   │   │   ├── mongo.module.ts
│   │   │   └── gridfs.service.ts
│   │   ├── crypto/
│   │   │   └── secret.service.ts   // AES-256-GCM
│   │   └── logging/
│   │
│   ├── domain/                     // collections + repositories
│   │   ├── job-config/
│   │   │   ├── job-config.schema.ts
│   │   │   ├── job-config.repository.ts
│   │   │   ├── job-config.service.ts
│   │   │   └── job-config.controller.ts
│   │   ├── sync-run/
│   │   ├── raw-record/
│   │   ├── source-metadata/
│   │   ├── source-file/
│   │   └── secret/
│   │
│   ├── adapters/                   // source adapter implementations
│   │   ├── source-adapter.interface.ts
│   │   ├── source-adapter.registry.ts
│   │   ├── excel.adapter.ts
│   │   ├── csv.adapter.ts
│   │   ├── postgres.adapter.ts
│   │   └── rest-api.adapter.ts
│   │
│   └── workers/
│       ├── workers.module.ts
│       ├── scheduler.service.ts        // dynamic @nestjs/schedule cron registry
│       ├── sync-executor.service.ts    // core run logic
│       ├── stale-run-sweeper.service.ts
│       └── concurrency.service.ts      // in-RAM Set guard + semaphore
│
├── test/
├── nest-cli.json
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

**Module wiring** (`main.module.ts`):

```text
MainModule
├── ConfigModule (joi-validated)
├── MongoModule (connection + GridFS)
├── AcoreModule (crypto, auth, logging)
├── DomainModule (re-exports every domain module)
└── WorkersModule
```

---

## 5. MongoDB schema details

Every collection **MUST have `createdAt: Date`** (per P001 §12.4 — to keep the door open for TTL later).

### 5.1. `job_configs`

```text
{
  _id: ObjectId,
  name: string,                  // human-readable, "Daily sales API sync"
  description: string?,
  enabled: boolean,              // pause/resume the cron without deleting the config
  source: {
    type: 'excel' | 'csv' | 'mysql' | 'postgres' | 'mssql' | 'oracle' | 'rest' | 'graphql' | 'soap',
    config: object               // type-specific schema, see §6
  },
  schedule: {
    cronExpression: string,         // standard 5-field cron, '*/5 * * * *'
    timezone?: string               // optional; fallback env INTEGRATION_DEFAULT_TIMEZONE (default 'UTC')
  },
  identity: {
    strategy: 'primary-key' | 'composite' | 'hash' | 'row-number',
    fields: string[]                // only needed for 'primary-key' and 'composite'
  },
  options: {
    detectDeleted: boolean,         // default true
    auditChanges: boolean,          // default true — writes raw_record_changelog for every change
    errorThreshold?: number,        // optional; fallback env INTEGRATION_DEFAULT_ERROR_THRESHOLD (default 100)
    rateLimit?: { rps: number }     // used for API sources
  },
  credentialsRef: ObjectId?,     // ref → secrets._id (null for Excel/CSV upload)

  lastRunId: ObjectId?,
  lastRunStatus: string?,
  lastRunAt: Date?,

  createdAt: Date,
  updatedAt: Date,
  createdBy: string              // API key principal id
}

Indexes:
- { enabled: 1 }                  // scheduler scan
- { name: 1 } UNIQUE
```

### 5.2. `source_metadata`

```text
{
  _id: ObjectId,
  jobConfigId: ObjectId,
  syncRunId: ObjectId,           // the run that detected this metadata
  schemaHash: string,            // sha256 of stable-stringified schema → detect schema drift
  schema: {
    fields: [{ name, type, nullable?, primaryKey? }],
    raw: object                  // adapter-specific, full original schema
  },
  detectedAt: Date,
  createdAt: Date
}

Indexes:
- { jobConfigId: 1, detectedAt: -1 }
- { jobConfigId: 1, schemaHash: 1 } UNIQUE
```

Store **one document per distinct schema**. If the schema is unchanged between syncs, only one record exists (insert is blocked by the unique index → catch and skip). A schema drift creates a new document — we can alert on it later.

### 5.3. `raw_records`

A single unified collection for every source (per P001 §12.3):

```text
{
  _id: ObjectId,
  jobConfigId: ObjectId,
  recordKey: string,             // computed via the identity strategy
  payloadHash: string,           // sha256(stableStringify(payload))
  payload: object,               // raw, schema-on-read
  payloadRef?: ObjectId,         // GridFS file id when payload > 14MB
  status: 'active' | 'deleted',
  version: number,               // bumped on every in-place update

  firstSeenAt: Date,
  lastSeenAt: Date,
  firstSeenRunId: ObjectId,
  lastUpdatedRunId: ObjectId,
  deletedInRunId?: ObjectId,

  createdAt: Date
}

Indexes:
- { jobConfigId: 1, recordKey: 1 } UNIQUE         // primary dedup
- { jobConfigId: 1, status: 1, lastSeenAt: -1 }   // query "current state" of a source
- { jobConfigId: 1, lastUpdatedRunId: 1 }         // "records changed in run X"
- { payloadHash: 1 }                              // optional, cross-record dedup
```

**Update strategy**: in-place update + bump `version`. Phase 1 does not retain old payload history.

If audit requires tracing every payload change → add a dedicated `raw_record_changelog` collection (append-only). Done in phase 1 per §5.7 below.

### 5.4. `sync_runs`

```text
{
  _id: ObjectId,
  jobConfigId: ObjectId,
  triggeredBy: 'schedule' | 'manual' | 'retry',
  parentRunId?: ObjectId,        // present on retries

  status: 'running' | 'success' | 'partial' | 'failed' | 'stale',

  startedAt: Date,
  finishedAt?: Date,
  heartbeatAt: Date,             // worker updates every 30s
  workerId: string,              // `${hostname}:${pid}`

  counts: {
    read: number,
    inserted: number,
    updated: number,
    unchanged: number,
    deleted: number,
    errors: number
  },

  errors: [
    {
      stage: 'connect' | 'discover' | 'stream' | 'classify' | 'write' | 'detect-deleted',
      recordKey?: string,
      message: string,
      stack?: string,
      occurredAt: Date
    }
  ],

  metadataSnapshotId?: ObjectId, // ref source_metadata

  createdAt: Date
}

Indexes:
- { jobConfigId: 1, status: 1 } UNIQUE
    partialFilterExpression: { status: 'running' }
  → THIS IS THE PRIMARY LOCK MECHANISM, see §8
- { jobConfigId: 1, startedAt: -1 }
- { status: 1, heartbeatAt: 1 }   // stale sweep
- { createdAt: -1 }
```

### 5.5. `source_files`

A metadata layer on top of GridFS, for uploaded files:

```text
{
  _id: ObjectId,
  fileName: string,
  contentType: string,
  size: number,
  checksum: string,              // sha256 of the file
  gridFsFileId: ObjectId,        // → fs.files._id
  uploadedBy: string,
  uploadedAt: Date,
  createdAt: Date
}

Indexes:
- { checksum: 1 }                // detect duplicate uploads
- { uploadedAt: -1 }
```

Excel/CSV job configs reference `source.config.sourceFileId` → `source_files._id`.

### 5.6. `secrets`

```text
{
  _id: ObjectId,
  name: string,                  // "oracle-prod-readonly"
  type: 'db' | 'api' | 'file',
  encrypted: {
    iv: string,                  // base64, 12 bytes for GCM
    authTag: string,             // base64, 16 bytes
    ciphertext: string,          // base64
    keyVersion: number           // which master key version was used
  },
  createdAt: Date,
  updatedAt: Date,
  createdBy: string
}

Indexes:
- { name: 1 } UNIQUE
```

See §10 for the encryption scheme.

### 5.7. `raw_record_changelog`

Per-record audit trail (per §15 row 8). Append-only — write one entry every time `raw_records` changes (insert / update / delete). Not written for `unchanged` rows (those only bump `lastSeenAt` and are not state changes).

```text
{
  _id: ObjectId,
  jobConfigId: ObjectId,
  rawRecordId: ObjectId,         // ref raw_records._id
  recordKey: string,              // denormalized for convenience
  syncRunId: ObjectId,            // run that produced the entry
  operation: 'insert' | 'update' | 'delete',

  versionBefore: number | null,  // null on insert
  versionAfter: number,
  payloadBefore: object | null,  // null on insert
  payloadAfter: object,           // on delete: the payload at the moment of deletion
  payloadHashBefore: string | null,
  payloadHashAfter: string,

  occurredAt: Date,
  createdAt: Date
}

Indexes:
- { jobConfigId: 1, recordKey: 1, occurredAt: -1 }   // trace one record's history
- { rawRecordId: 1, occurredAt: -1 }                  // trace by raw doc
- { syncRunId: 1 }                                    // "what changed in run X"
- { createdAt: -1 }
```

**Storage notes**: a source with 100k records syncing hourly will grow the changelog quickly. Two mitigations to apply when needed (not in phase 1):

1. Per-job toggle `options.auditChanges: false` for sources that do not need an audit trail (e.g. files that get fully replaced each time).
2. TTL index on `createdAt` for retention (whenever P001 §12.4 retention policy is enabled).

**Storage optimization**: with very large payloads (>1MB) and a dense changelog, storing a payload diff (e.g. jsondiffpatch) rather than full before/after will be much cheaper. Phase 1 keeps the full payload for simplicity — monitor disk and optimize when needed.

---

## 6. Job config — `source.config` schema by type

Payload details for each `source.type`:

### 6.1. Excel / CSV

```text
{
  sourceFileId: ObjectId,        // → source_files._id
  sheetName?: string,            // Excel only, defaults to first sheet
  headerRow: number,             // default 1
  startRow: number,              // default 2
  fieldTypes?: { [columnName: string]: 'string'|'number'|'date'|'boolean' }
}
```

`credentialsRef` = null. The file is uploaded via API beforehand.

### 6.2. Database (mysql / postgres / mssql / oracle)

```text
{
  host: string,
  port: number,
  database: string,
  schema?: string,               // postgres / oracle
  query: string,                 // SELECT statement, may contain a ${watermark} placeholder
  watermarkColumn?: string,      // for incremental sync (e.g. 'updated_at')
  options?: {
    connectionTimeoutMs?: number,
    queryTimeoutMs?: number,
    ssl?: boolean
  }
}
```

`credentialsRef` → `secrets` containing `{ username, password }`.

**Phase 1 implements postgres + mysql first**. Oracle / mssql come later (Oracle requires native binaries; mssql needs the `tedious`/`mssql` lib).

### 6.3. REST API

```text
{
  baseUrl: string,
  endpoint: string,              // path, may contain a placeholder
  method: 'GET' | 'POST',
  headers?: object,              // no auth here — auth comes from credentialsRef
  queryParams?: object,
  body?: object,                 // POST only
  responsePath?: string,         // JSON path to the records array, e.g. 'data.items'
  pagination?: {
    type: 'offset' | 'page' | 'cursor' | 'none',
    pageParam?: string,          // 'page', 'offset'
    pageSize: number,
    pageSizeParam?: string,      // 'limit', 'pageSize'
    totalPath?: string,          // 'meta.total'
    cursorPath?: string,         // 'meta.nextCursor'
    cursorParam?: string         // 'cursor'
  },
  timeoutMs?: number,
  retryOnStatus?: number[]       // [429, 502, 503]
}
```

`credentialsRef` → `secrets` containing `{ scheme: 'bearer'|'basic'|'api-key', value }`.

### 6.4. GraphQL / SOAP

**Not implemented in phase 1**. Reserved types — schema validation accepts them, but no adapter exists yet.

---

## 7. Source adapter pattern

### 7.1. Interface

```typescript
interface SourceAdapter<TConfig = object> {
  readonly type: string

  // Read the source schema. Throws if the connection fails.
  discoverMetadata(
    config: TConfig,
    credentials: object,
  ): Promise<SourceSchema>

  // Stream records one by one. Must be an async iterable — do not return Array (the file/query may be huge).
  stream(
    config: TConfig,
    credentials: object,
    options: { watermark?: unknown, signal?: AbortSignal },
  ): AsyncIterable<AdapterRecord>
}

interface AdapterRecord {
  payload: object                    // raw record
  sourceInfo?: { rowNumber?: number; offset?: number; etc.: any }
}

interface SourceSchema {
  fields: Array<{
    name: string
    type: 'string' | 'number' | 'integer' | 'boolean' | 'date' | 'object' | 'array' | 'unknown'
    nullable?: boolean
    primaryKey?: boolean
  }>
  raw: object
}
```

### 7.2. Registry

Single DI provider:

```typescript
@Injectable()
class SourceAdapterRegistry {
  private adapters = new Map<string, SourceAdapter>()
  register(adapter: SourceAdapter): void
  get(type: string): SourceAdapter // throws if not present
}
```

Each adapter implementation registers itself via `OnModuleInit` or as a multi-provider.

### 7.3. Phase 1 adapter list (in priority order)

| #   | Adapter       | Recommended lib             | Notes                                                                     |
| --- | ------------- | --------------------------- | ------------------------------------------------------------------------- |
| 1   | Excel         | `exceljs` (stream API)      | Streaming reader to avoid loading the full file                           |
| 2   | CSV           | `papaparse` (stream)        | Similar to Excel, can be done in parallel                                 |
| 3   | REST API      | `axios` + custom pagination | Supports offset/page/cursor pagination                                    |
| 4   | Postgres      | `pg`                        | Cursor query to stream rows                                               |
| 5   | MySQL         | `mysql2`                    | 80% identical code to Postgres, can be done in parallel                   |
| 6   | MS SQL Server | `mssql` (tedious driver)    | Same DB adapter pattern                                                   |
| 7   | Oracle        | `oracledb`                  | **Has native binaries** — Dockerfile needs Oracle Instant Client, do last |

GraphQL and SOAP are **phase 2** — not implemented in phase 1.

---

## 8. Sync run lifecycle — lock, heartbeat, stale sweeper

### 8.1. State machine

```text
                  ┌─────────┐  insert fail (duplicate key)
   cron fire ───▶│ claim   │──────────────────────────────▶ skip, log "already running"
                  └────┬────┘
                       │ insert OK
                       ▼
                  ┌─────────┐
                  │ running │ ──── heartbeat every 30s ───┐
                  └────┬────┘                              │
                       │                                    │
        ┌──────────────┼──────────────┬─────────────┐      │
        ▼              ▼              ▼             ▼      ▼
    success        partial         failed         stale  (heartbeat
   (no errors)  (some errors)   (hard error)   (killed by   stale >2min)
                                                 sweeper)
```

### 8.2. Claim the lock — atomic via partial unique index

```text
1. SyncExecutor.execute(jobConfigId, triggeredBy):
2.   if concurrency.fastPath.has(jobConfigId): return SKIPPED_INMEM
3.   concurrency.fastPath.add(jobConfigId)
4.   try:
5.     run = await sync_runs.insertOne({
6.        jobConfigId, status:'running', startedAt:now, heartbeatAt:now,
7.        workerId, triggeredBy, counts:{...zeros}, errors:[], createdAt:now
8.     })
9.   catch DuplicateKeyError:
10.     concurrency.fastPath.delete(jobConfigId)
11.     return SKIPPED_DB    // another run is already running; partial index rejects
12.  // run claimed — proceed to executeRun(run)
```

This mechanism fully replaces a distributed lock:

- **DB-level**: the partial unique index prevents two docs with `jobConfigId, status='running'`.
- **RAM-level** (fast-path): avoids hitting the DB on overlapping cron fires within the same process.

### 8.3. Heartbeat

Inside `executeRun`:

```text
heartbeatTimer = setInterval(async () => {
  await sync_runs.updateOne({ _id: run._id }, { $set: { heartbeatAt: now() } })
}, 30_000)

try {
  ...execute logic...
} finally {
  clearInterval(heartbeatTimer)
  concurrency.fastPath.delete(jobConfigId)
}
```

**Why `setInterval`** instead of updating inside the record loop: if the loop blocks for a moment (e.g. parsing a large record), the interval still fires on the next event loop tick — no missed heartbeats.

Caveat: a true event loop block (e.g. synchronous `JSON.parse` of 100MB) will skip the interval. Mitigation: streaming parsers + async I/O for any heavy operation.

### 8.4. Stale run sweeper

`StaleRunSweeperService`:

1. **On app startup**: sweep all `status='running' AND heartbeatAt < now - 2min`.
2. **Periodic every 60s**: same sweep.

Mark stale → `status: 'stale'`, `finishedAt: now`, push error `{ stage: 'heartbeat', message: 'heartbeat timeout' }`.

After marking stale, the partial unique index is released → the next scheduled fire can claim a fresh lock.

### 8.5. Sequential execution with a concurrency cap

If 50 jobs share cron `0 0 * * *` (midnight) and fire simultaneously → 50 concurrent runs → can overwhelm the Mongo connection pool / spam external APIs.

**Cap**: `ConcurrencyService` has a `maxConcurrentRuns: number` semaphore (config, default 5). When a job fires, it waits for a free slot before claiming. Simple, sufficient for phase 1.

---

## 9. Insert / update / delete classification algorithm

The core loop inside `executeRun`:

```text
1. Discover metadata, compare hash, insert if different:
   schema = adapter.discoverMetadata(config, credentials)
   schemaHash = sha256(stableStringify(schema))
   try: insert source_metadata { ..., schemaHash }   // partial unique index will skip duplicates

2. For each record in adapter.stream(config, credentials):
     counts.read++
     recordKey = computeRecordKey(record, jobConfig.identity)
     payloadHash = sha256(stableStringify(record.payload))

     existing = raw_records.findOne({ jobConfigId, recordKey })

     if !existing:
        newDoc = insert raw_records {
          jobConfigId, recordKey, payloadHash, payload,
          status: 'active', version: 1,
          firstSeenAt: now, lastSeenAt: now,
          firstSeenRunId: run._id, lastUpdatedRunId: run._id,
          createdAt: now
        }
        if options.auditChanges:
           changelogBuffer.push({
             jobConfigId, rawRecordId: newDoc._id, recordKey, syncRunId: run._id,
             operation: 'insert',
             versionBefore: null, versionAfter: 1,
             payloadBefore: null, payloadAfter: payload,
             payloadHashBefore: null, payloadHashAfter: payloadHash,
             occurredAt: now, createdAt: now
           })
        counts.inserted++

     else if existing.payloadHash !== payloadHash:
        update raw_records (existing._id) {
          $set: { payload, payloadHash, lastSeenAt: now, lastUpdatedRunId: run._id,
                  status: 'active' },   // resurrect if previously 'deleted'
          $inc: { version: 1 }
        }
        if options.auditChanges:
           changelogBuffer.push({
             jobConfigId, rawRecordId: existing._id, recordKey, syncRunId: run._id,
             operation: 'update',
             versionBefore: existing.version, versionAfter: existing.version + 1,
             payloadBefore: existing.payload, payloadAfter: payload,
             payloadHashBefore: existing.payloadHash, payloadHashAfter: payloadHash,
             occurredAt: now, createdAt: now
           })
        counts.updated++

     else:
        update raw_records (existing._id) { $set: { lastSeenAt: now } }
        // NO changelog: no real state change
        counts.unchanged++

     if changelogBuffer.length >= 100:
        flush changelog buffer to raw_record_changelog (bulk insert)

     try/catch around each record: push errors to sync_runs.errors, counts.errors++
     if counts.errors > options.errorThreshold: throw → abort run

   // End of stream — flush remaining buffer
   if changelogBuffer.length > 0: flush

3. After streaming, detect deletions (if options.detectDeleted):
   if options.auditChanges:
      // need to know which docs are about to be marked deleted → query first, update one by one
      toDelete = raw_records.find({ jobConfigId, status: 'active', lastSeenAt: { $lt: run.startedAt } })
      for each doc in toDelete:
        update raw_records (doc._id) {
          $set: { status: 'deleted', deletedInRunId: run._id, lastSeenAt: now }
        }
        changelogBuffer.push({
          jobConfigId, rawRecordId: doc._id, recordKey: doc.recordKey, syncRunId: run._id,
          operation: 'delete',
          versionBefore: doc.version, versionAfter: doc.version,
          payloadBefore: doc.payload, payloadAfter: doc.payload,
          payloadHashBefore: doc.payloadHash, payloadHashAfter: doc.payloadHash,
          occurredAt: now, createdAt: now
        })
        counts.deleted++
        if buffer >= 100: flush
      flush remaining
   else:
      // fast path: single updateMany, no need to know the IDs
      res = raw_records.updateMany(
        { jobConfigId, status: 'active', lastSeenAt: { $lt: run.startedAt } },
        { $set: { status: 'deleted', deletedInRunId: run._id, lastSeenAt: now } }
      )
      counts.deleted = res.modifiedCount

4. Finalize sync_runs:
   status = counts.errors === 0 ? 'success' : (counts.errors >= errorThreshold ? 'failed' : 'partial')
   $set: { status, finishedAt: now, counts }
```

### 9.1. `computeRecordKey(record, identity)`

```text
switch identity.strategy:
  case 'primary-key':
    return String(record.payload[identity.fields[0]])
  case 'composite':
    return identity.fields.map(f => String(record.payload[f] ?? '')).join('||')
  case 'hash':
    return sha256(stableStringify(record.payload))
  case 'row-number':
    return `${sourceFileId}:${record.sourceInfo.rowNumber}`
```

**Important caveat for the `hash` strategy**: because `recordKey` is computed from the payload itself, any single field change flips `recordKey`, so step 2 of the algorithm always takes the INSERT branch (never UPDATE), and the delete detection marks the old doc as `deleted`. Consequences:

| Aspect                      | Behaviour with `hash`                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| An entity changes one field | Appears as **insert + delete**, not as update                                                 |
| `counts.updated`            | Always 0                                                                                      |
| `raw_records` size          | Grows with every change (not bounded by entity count)                                         |
| Audit changelog             | Two separate entries per change (delete old + insert new); hard to trace one entity over time |

**When `hash` is CORRECT**: the source truly has no entity concept (content snapshots from scraping, non-repeating event logs, "what does the source contain today" without caring whether records match yesterday) — content-addressable semantics.

**When `hash` is WRONG**: the source clearly has entities (e.g. an `id` or `code` column) but someone picked `hash` for convenience → no update tracking at all.

**Validation when creating a job config**:

1. When `strategy === 'hash'`, log a `warn`: "hash strategy treats every payload change as insert+delete; ensure source has no stable entity identity".
2. Require an explicit `identity.acknowledgeHashSemantics: true` in the request body — prevents accidental selection.
3. Make the trade-off explicit in the Swagger field description.

---

**Caveat for the `composite` strategy**:

1. **Delimiter collision**: using `||` as separator. If a field value contains `||`, it can collide. E.g. `{a:'X||Y', b:''}` and `{a:'X', b:'Y||'}` both produce `X||Y||`. Fix: escape `||` in values, or switch to a null char `\0` (not allowed inside JSON strings, so safe).
2. **Null vs empty string collision**: `null` / `undefined` / `''` all map to `''` via `?? ''`. `{a:null, b:'x'}` and `{a:'', b:'x'}` produce the same key.
3. **Field order sensitivity**: the order of fields in `identity.fields` affects the key. Reordering after the first run flips every key → the next sync looks like mass insert+delete. Treat `identity.fields` order as **immutable** after the first run.
4. **All-null composite**: if every field is null → key = a string of empty separators → every all-null record collides.

API validation: warn if any composite field lacks a NOT NULL constraint at the source (e.g. for a DB, check `information_schema`).

---

**Caveat for the `row-number` strategy**:

1. **Only applies to file sources** (Excel/CSV). DB/API have no stable row-number → the API must reject `strategy='row-number'` when `source.type` is not a file.
2. **Re-upload file = every key is new**: `recordKey` includes `sourceFileId`. Re-uploading (even with identical content) creates a new `sourceFileId` → every row looks like an insert, the old file's records get deleted. Fine if each file is an independent snapshot; NOT fine if you want to track updates across re-uploads of the same logical file.
3. **Extremely fragile to file edits**: inserting/removing a row shifts every subsequent row's number → looks like mass insert+delete. Same if the user re-sorts the file.
4. **Sensible use case**: template-based files with fixed row positions (e.g. "row 5 is always Q1 revenue"). Outside that, almost always pick another strategy.

---

**Caveat for the `primary-key` strategy**:

1. The `identity.fields` schema is `string[]` but PK only uses `fields[0]`. The API validates `fields.length === 1` when `strategy === 'primary-key'` (use `composite` if you want multiple fields).
2. **Null/undefined PK**: `String(null)` = `'null'`, `String(undefined)` = `'undefined'` → every PK-null record collides on the key `'null'`. The algorithm should fail per-record with a clear error (push to `sync_runs.errors`, `counts.errors++`) rather than silently merging.
3. **Type coercion**: PK numeric `123` and string `'123'` produce the same key `'123'`. Most sources are type-consistent, but if mixed (e.g. an API that sometimes returns a number, sometimes a string) you get a silent merge. Log `warn` when the same recordKey appears with different `typeof payload[pkField]` across two syncs.

---

### 9.1.1. Quick comparison — which strategy when?

| Source situation                                                        | Strategy to use                                |
| ----------------------------------------------------------------------- | ---------------------------------------------- |
| DB has a clear PRIMARY KEY                                              | `primary-key`                                  |
| DB has a multi-column UNIQUE constraint                                 | `composite`                                    |
| API returns records with a stable ID                                    | `primary-key`                                  |
| API returns records with no ID and an insert+delete cycle is acceptable | `hash` (with `acknowledgeHashSemantics: true`) |
| Template file with fixed row positions                                  | `row-number`                                   |
| Excel file with a clear ID column                                       | `primary-key` (not `row-number`)               |
| Source emits an event log with no ID; each event is independent         | `hash`                                         |

### 9.2. `stableStringify`

`JSON.stringify` with sorted keys, so the hash is deterministic regardless of field order in the payload.

### 9.3. Changelog buffer & flush

- Buffer size: 100 entries (configurable). Flush via `insertMany` to cut round-trips.
- Mandatory flushes:
  1. Buffer full.
  2. End of main loop (after streaming).
  3. End of delete-detection loop.
  4. Before finalizing `sync_runs`.
- If `insertMany` fails (e.g. Mongo connection drop): retry once; on second failure → push to `sync_runs.errors` with stage='audit', continue the run (do not abort just because audit failed).

### 9.4. Edge case: source returns duplicate recordKey inside one run

`raw_records` has a unique index on `(jobConfigId, recordKey)` → the second record throws DuplicateKeyError on insert. Handling:

- Catch, log into `sync_runs.errors` with stage='write', message='duplicate recordKey within run'.
- counts.errors++.

→ source data problem is surfaced rather than crashing the run.

---

## 10. Credentials encryption

### 10.1. Scheme

**AES-256-GCM** with a 32-byte master key from env `INTEGRATION_MASTER_KEY` (base64 encoded).

```text
encrypt(plaintext):
  iv = randomBytes(12)            // 96 bits for GCM
  key = keyVersionToKey[CURRENT_KEY_VERSION]
  cipher = createCipheriv('aes-256-gcm', key, iv)
  ciphertext = cipher.update(plaintext) + cipher.final()
  authTag = cipher.getAuthTag()
  return { iv, authTag, ciphertext, keyVersion: CURRENT_KEY_VERSION }   // all base64

decrypt({iv, authTag, ciphertext, keyVersion}):
  key = keyVersionToKey[keyVersion]
  decipher = createDecipheriv('aes-256-gcm', key, base64decode(iv))
  decipher.setAuthTag(base64decode(authTag))
  return decipher.update(ciphertext) + decipher.final()
```

### 10.2. Key management

- Master key loaded from env at startup, fail-fast on missing or wrong length.
- Multi-version key support via env `INTEGRATION_MASTER_KEY_V1`, `..._V2`, … and `INTEGRATION_MASTER_KEY_CURRENT` (a number).
- Rotation procedure: add a higher-version key → re-encrypt existing secrets via an admin API → switch CURRENT → remove the old key. Not done in phase 1, but the `keyVersion` field is already in place.

### 10.3. Hard rules

1. Plaintext credentials **only exist in RAM for the duration of one adapter-invoking method**.
2. Never log credentials, never include them in error messages, never include them in sync_runs.errors.
3. Each `SourceAdapter` receives credentials as a parameter — never directly accesses env or the DB.

---

## 11. API surface (phase 1)

All endpoints live under `/api/v1`, JSON, protected by `ApiKeyGuard` (header `x-api-key`). Swagger at `/api-docs`.

| Method | Path                         | Purpose                                                                                  |
| ------ | ---------------------------- | ---------------------------------------------------------------------------------------- |
| POST   | `/job-configs`               | Create a job config                                                                      |
| GET    | `/job-configs`               | List (filters: `enabled`, `source.type`)                                                 |
| GET    | `/job-configs/:id`           | Detail                                                                                   |
| PATCH  | `/job-configs/:id`           | Update                                                                                   |
| DELETE | `/job-configs/:id`           | Soft delete (`enabled=false`, history retained)                                          |
| POST   | `/job-configs/:id/trigger`   | Manual trigger (triggeredBy='manual')                                                    |
| POST   | `/job-configs/:id/enable`    | Enable                                                                                   |
| POST   | `/job-configs/:id/disable`   | Disable                                                                                  |
| GET    | `/sync-runs`                 | List (filters: `jobConfigId`, `status`, `from`, `to`)                                    |
| GET    | `/sync-runs/:id`             | Detail including errors                                                                  |
| POST   | `/sync-runs/:id/retry`       | Re-run with the current job config snapshot (parentRunId=:id)                            |
| GET    | `/raw-records`               | List/search (`jobConfigId` required; optional `recordKey`, `status`, `lastUpdatedRunId`) |
| GET    | `/raw-records/:id`           | Detail                                                                                   |
| GET    | `/source-metadata`           | List (`jobConfigId`)                                                                     |
| GET    | `/source-metadata/:id`       | Detail                                                                                   |
| POST   | `/source-files`              | Multipart upload → returns `sourceFileId`                                                |
| GET    | `/source-files`              | List                                                                                     |
| GET    | `/source-files/:id`          | Metadata                                                                                 |
| GET    | `/source-files/:id/download` | Stream from GridFS                                                                       |
| DELETE | `/source-files/:id`          | Delete (only when no job config references it)                                           |
| POST   | `/secrets`                   | Create a secret (encrypt on insert)                                                      |
| GET    | `/secrets`                   | List (no plaintext, metadata only)                                                       |
| PATCH  | `/secrets/:id`               | Update (re-encrypt)                                                                      |
| DELETE | `/secrets/:id`               | Delete (only when no job config references it)                                           |
| GET    | `/health`                    | Liveness                                                                                 |
| GET    | `/health/ready`              | Readiness (Mongo connected)                                                              |

Standard pagination: `?page=1&pageSize=50`, response `{ items, total, page, pageSize }`.

---

## 12. Error handling & retry

### 12.1. Error categories

| Category                                                                                | Behaviour                                                                              |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Per-record error** (validation, dedup conflict)                                       | Log to `sync_runs.errors`, `counts.errors++`, continue                                 |
| **Threshold exceeded** (`counts.errors > errorThreshold`)                               | Abort run, status='failed'                                                             |
| **Hard error** (connect failed, decrypt failed, adapter throws outside the stream loop) | Abort immediately, status='failed'                                                     |
| **Crash / kill**                                                                        | Run stuck in `status='running'` → stale sweeper marks `status='stale'` after 2 minutes |

### 12.2. Retry

**Phase 1: manual retry only**, via `POST /sync-runs/:id/retry`.

Why (per P001 §12.1):

1. Generic auto-retry does not match business semantics — connection errors are different from data errors, each needs its own policy.
2. Errors usually require human intervention at the source (fix credentials, restart an external DB) before retrying makes sense.

Retry implementation:

1. Take the job_config snapshot at the parent run's time (or current — **decided: current**, simpler since configs are typically stable).
2. Create a new run with `triggeredBy='retry'`, `parentRunId` set.
3. Execute normally through SyncExecutor.

### 12.3. Per-record retry inside a run

Not done in phase 1. If an adapter encounters a transient error (e.g. HTTP 503), the **adapter retries** within its own stream scope (e.g. axios retry with backoff). The sync executor does not get involved.

---

## 13. Observability

### 13.1. Logging

- Logger: `pino` (or Nest's built-in logger with a JSON formatter), structured.
- Every log line must carry context: `{ jobConfigId, syncRunId, workerId, stage }`.
- Levels: `info` for lifecycle events (run started/finished), `warn` for per-record errors, `error` for aborts.
- **Do not log full payloads** — only recordKey + hash, to avoid data leakage and log spam.
- **Do not log credentials** — a logger interceptor masks `password|token|apiKey|secret|credentials`.

### 13.2. Metrics

Phase 1: no Prometheus endpoint. The counts in `sync_runs` are enough for ad-hoc queries.

Phase 2 (when needed): expose `/metrics` with:

- `sync_run_total{status}` counter
- `sync_run_duration_seconds` histogram
- `sync_run_records_total{op}` counter (insert/update/delete/unchanged/error)

### 13.3. Event hooks

Phase 1: not needed. Phase 2 (when webhooks land): `EventEmitter` emits `sync.run.completed` → allows downstream hooks.

---

## 14. Phase 1 implementation order

| Step | Work                                                                             | Output                                                                         |
| ---- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1    | Bootstrap NestJS project `services/ax-data-integration`                          | `pnpm dev:di` works, port 3012, Swagger /api-docs                              |
| 2    | MongoModule + connection + GridFS service                                        | Mongo connection works, index migration script                                 |
| 3    | API Key guard + Secrets module (CRUD + encrypt)                                  | `/secrets` API works, encrypt/decrypt unit-tested                              |
| 4    | JobConfig CRUD + validation                                                      | `/job-configs` API works (no trigger yet)                                      |
| 5    | SourceFile upload + GridFS write/read                                            | `/source-files` upload + streaming download                                    |
| 6    | SourceAdapter interface + registry + ExcelAdapter                                | Can stream records from an Excel file                                          |
| 7    | SyncExecutor + claim/heartbeat/concurrency                                       | Can run an Excel job manually via API; sync_runs has a record                  |
| 8    | Insert/update/delete classification + raw_records + raw_record_changelog (audit) | Syncing twice produces correct counts; changelog has entries                   |
| 9    | DetectDeleted (+ changelog for delete op)                                        | Syncing after a source-side deletion marks the row deleted with full changelog |
| 10   | StaleRunSweeper                                                                  | Kill the process mid-run, restart → the run is marked stale                    |
| 11   | SchedulerService (cron auto trigger)                                             | Cron expression works, enable/disable hot-reloads                              |
| 12   | CSV adapter                                                                      | Can sync a CSV file                                                            |
| 13   | REST API adapter (pagination, rate limit)                                        | Can sync an external API                                                       |
| 14   | Postgres adapter (cursor query)                                                  | Can sync a Postgres DB                                                         |
| 15   | MySQL adapter                                                                    | Reuses the Postgres pattern                                                    |
| 16   | MS SQL Server adapter                                                            | Reuses the pattern, adds the `mssql` lib                                       |
| 17   | Oracle adapter                                                                   | Dockerfile adds Oracle Instant Client, done last                               |
| 18   | SyncRuns retry API                                                               | Manual retry creates a new run with parentRunId                                |
| 19   | Polished Swagger docs + README                                                   | Documentation for other teams to consume                                       |
| 20   | Docker image + docker-compose template                                           | Deploys on-prem                                                                |

Each step should ship with **at least one e2e test** before moving on.

---

## 15. Additional decisions (confirmed)

| #   | Item                      | Decision                                                                                                                                                                                             |
| --- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Package name              | `ax-data-integration` (no scope) — matches `ax-cdn-services`                                                                                                                                         |
| 2   | Cron timezone default     | `UTC`. Per-job override via `schedule.timezone`. System-wide override via env `INTEGRATION_DEFAULT_TIMEZONE`                                                                                         |
| 3   | Phase 1 adapter order     | Excel → CSV → REST API → Postgres → MySQL → MS SQL Server → Oracle (see §7.3 & §14)                                                                                                                  |
| 4   | errorThreshold default    | `100`. Override via env `INTEGRATION_DEFAULT_ERROR_THRESHOLD`, or per-job via `options.errorThreshold`                                                                                               |
| 5   | maxConcurrentRuns default | `5`. Override via env `INTEGRATION_MAX_CONCURRENT_RUNS`                                                                                                                                              |
| 6   | Secrets master key        | Env var (`INTEGRATION_MASTER_KEY_V*` + `_CURRENT`) for phase 1. Migrate to Docker secret / Vault during production hardening                                                                         |
| 7   | Schema drift alert        | Phase 1: only insert a new `source_metadata` document + structured log. Alert channel (Slack / email) once the admin UI exists                                                                       |
| 8   | Per-record audit          | **Yes** — add the `raw_record_changelog` collection (see §5.7), write an entry for every insert / update / delete. Toggle via `options.auditChanges` per job, default `true`. Algorithm detail in §9 |

---

## 16. Environment variables

All validated at startup with `joi` (per the `ax-cdn-services` pattern). Missing required env → fail-fast.

| Name                                     | Required | Default  | Meaning                                                |
| ---------------------------------------- | -------- | -------- | ------------------------------------------------------ |
| `PORT`                                   | no       | `3012`   | Listen port                                            |
| `MONGO_URI`                              | yes      | -        | Mongo connection string                                |
| `MONGO_DB_NAME`                          | yes      | -        | Database name                                          |
| `INTEGRATION_API_KEYS`                   | yes      | -        | CSV of valid API keys (`key1,key2,…`)                  |
| `INTEGRATION_MASTER_KEY_V1`              | yes      | -        | Master key version 1, 32 bytes base64                  |
| `INTEGRATION_MASTER_KEY_V<N>`            | no       | -        | Additional versions for key rotation                   |
| `INTEGRATION_MASTER_KEY_CURRENT`         | yes      | -        | Current key version number (e.g. `1`)                  |
| `INTEGRATION_DEFAULT_TIMEZONE`           | no       | `UTC`    | Fallback timezone for job configs that don't set one   |
| `INTEGRATION_DEFAULT_ERROR_THRESHOLD`    | no       | `100`    | Fallback `options.errorThreshold`                      |
| `INTEGRATION_MAX_CONCURRENT_RUNS`        | no       | `5`      | Cap on concurrent sync runs inside the process         |
| `INTEGRATION_HEARTBEAT_INTERVAL_MS`      | no       | `30000`  | Interval to update `heartbeatAt`                       |
| `INTEGRATION_STALE_HEARTBEAT_TIMEOUT_MS` | no       | `120000` | Threshold for marking a run stale                      |
| `INTEGRATION_STALE_SWEEP_INTERVAL_MS`    | no       | `60000`  | Interval for scanning stale runs                       |
| `INTEGRATION_CHANGELOG_BUFFER_SIZE`      | no       | `100`    | Buffer size before flushing changelog (see §9.3)       |
| `LOG_LEVEL`                              | no       | `info`   | pino log level (`trace`/`debug`/`info`/`warn`/`error`) |

---

## 17. Conclusion

Phase 1 deliverable: one NestJS service `ax-data-integration` running 7 adapters (Excel, CSV, REST API, Postgres, MySQL, MSSQL, Oracle in priority order), scheduled via `@nestjs/schedule`, locking + state in Mongo, full insert/update/delete classification + per-record audit via `raw_record_changelog`, admin API, API-Key auth, AES-256-GCM secret encryption, deployable via docker-compose on a single-node on-prem host.

A minimal architecture — **no Redis, no queue, no multi-worker** — is enough to keep data consistency under control for current requirements, with a clear scale-out path when needed (only the trigger layer changes; state stays in Mongo). Every operational parameter (timezone, threshold, concurrency, buffer size, heartbeat) has an env-var override, so tuning never requires a code change.
