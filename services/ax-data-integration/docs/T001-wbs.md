Work Breakdown Structure for the Data Integration Service (phase 1).

Aligned with the implementation order in [P002 §14](P002-design-proposal.md) and the decisions in [P001 §12](P001-requirement-summary.md) + [P002 §15](P002-design-proposal.md).

**How to use**:

- Each task has an ID like `T-X##`. Tick `[x]` in the Status column when done.
- **Outcome** = acceptance criteria (the condition to consider the task done).
- **Depends** = task(s) that must finish first.
- Update start/end dates on the parent task row when useful (manual).

---

## Phase A — Foundation (T-A01 → T-A06)

| ID    | Status | Task                                                                                 | Refs                  | Depends |
| ----- | ------ | ------------------------------------------------------------------------------------ | --------------------- | ------- |
| T-A01 | `[x]`  | Bootstrap NestJS project `services/ax-data-integration`                              | P002 §3, §4           | -       |
| T-A02 | `[ ]`  | Mongo connection module + GridFS service                                             | P002 §4 (acore/mongo) | T-A01   |
| T-A03 | `[ ]`  | Config module with joi validation for all env vars                                   | P002 §16              | T-A01   |
| T-A04 | `[ ]`  | Logger (pino structured) + credential mask interceptor                               | P002 §13.1            | T-A01   |
| T-A05 | `[ ]`  | API Key guard (`x-api-key` header)                                                   | P002 §11              | T-A03   |
| T-A06 | `[ ]`  | Index migration script (create partial unique index for sync_runs and other indexes) | P002 §5               | T-A02   |

### T-A01 — Bootstrap NestJS project

- [x] Create project at `services/ax-data-integration` (mirror `ax-cdn-services`)
- [x] `package.json name = "ax-data-integration"`, port 3012
- [x] `main.ts` with global `ValidationPipe({ whitelist:true, transform:true })`
- [x] Swagger UI mounted at `/api-docs`
- [x] ESLint config self-contained (mirror pattern from `ax-cdn-services/eslint.config.mjs`)
- [x] Prettier extends root `.prettierrc.json` (no per-package file)
- [x] Scripts: `dev`, `start`, `build`, `lint`, `test`, `test:e2e`
- [x] Update root `.lintstagedrc.json` with pattern `services/ax-data-integration/**`
- [x] Create `services/ax-data-integration/CLAUDE.md` so Claude Code does not miss context when working in this project's scope. Required sections:
  - Service purpose + 1-line architecture summary (single-node, NestJS + Mongo, no Redis/queue)
  - Links to `docs/O001`, `P001`, `P002`, `T001` (source of truth for design + WBS)
  - Folder structure (`acore/`, `domain/`, `adapters/`, `workers/`) and import rules between layers
  - Conventions for adding a new adapter (implement interface + register, write Outcome test before merge)
  - Notes on the `identity` strategies (see P002 §9.1) — never pick `hash` without understanding the caveat
  - Security note: NEVER log credentials, all sensitive fields must be masked
  - Commands: `pnpm --filter ax-data-integration dev/test/build/lint`

**Outcome**: `pnpm dev:di` runs, GET `/api-docs` shows the Swagger UI, and `services/ax-data-integration/CLAUDE.md` exists with all the sections above.

### T-A02 — Mongo connection + GridFS

- [ ] `acore/mongo/mongo.module.ts` connects via env `MONGO_URI` / `MONGO_DB_NAME`
- [ ] `gridfs.service.ts` with methods `upload(stream, meta)`, `download(fileId)`, `delete(fileId)`
- [ ] Health check ping
- [ ] Connection pool size configurable via env

**Outcome**: GET `/health/ready` reports Mongo connected.

### T-A06 — Index migration

- [ ] Script `npm run migrate:indexes` is idempotent
- [ ] Create: partial unique `sync_runs(jobConfigId, status='running')`, unique `raw_records(jobConfigId, recordKey)`, unique `source_metadata(jobConfigId, schemaHash)`, unique `job_configs(name)`, unique `secrets(name)`, and all other indexes per P002 §5
- [ ] Log each index as either created or already-exists

**Outcome**: Running the script twice in a row produces no errors; `db.collection.getIndexes()` shows all expected indexes.

---

## Phase B — Security & secrets (T-B01 → T-B03)

| ID    | Status | Task                                                           | Refs      | Depends      |
| ----- | ------ | -------------------------------------------------------------- | --------- | ------------ |
| T-B01 | `[ ]`  | `SecretService` (AES-256-GCM encrypt/decrypt + key versioning) | P002 §10  | T-A03        |
| T-B02 | `[ ]`  | Secrets domain (schema + repo + service)                       | P002 §5.6 | T-A02, T-B01 |
| T-B03 | `[ ]`  | Secrets controller (POST/GET/PATCH/DELETE /secrets)            | P002 §11  | T-B02, T-A05 |

### T-B01 — SecretService

- [ ] Load all `INTEGRATION_MASTER_KEY_V<N>` from env at startup; fail-fast if missing or wrong length
- [ ] Method `encrypt(plaintext: string): { iv, authTag, ciphertext, keyVersion }`
- [ ] Method `decrypt(payload): string`
- [ ] Use `INTEGRATION_MASTER_KEY_CURRENT` for new encryption
- [ ] Decrypt must support every `keyVersion` still present in env (multi-version rotation)
- [ ] Unit tests: encrypt-decrypt round-trip, wrong key version, tampered ciphertext → throw

**Outcome**: Unit tests pass; encrypting the same plaintext twice produces different ciphertext (random IV).

### T-B03 — Secrets controller

- [ ] POST `/secrets` accepts `{ name, type, plaintext }` → encrypt → insert
- [ ] GET `/secrets` returns only `_id, name, type, createdAt, updatedAt` (no plaintext, no ciphertext)
- [ ] PATCH `/secrets/:id` re-encrypts if a new plaintext is provided
- [ ] DELETE allowed only when no `job_configs.credentialsRef` points to it
- [ ] All endpoints behind `ApiKeyGuard`

**Outcome**: Create a secret via API; GET does not leak plaintext; logs mask credentials.

---

## Phase C — Job config & source files (T-C01 → T-C04)

| ID    | Status | Task                                                  | Refs              | Depends      |
| ----- | ------ | ----------------------------------------------------- | ----------------- | ------------ |
| T-C01 | `[ ]`  | JobConfig domain (schema + repo + service)            | P002 §5.1, §6     | T-A02        |
| T-C02 | `[ ]`  | JobConfig controller (CRUD + enable/disable)          | P002 §11          | T-C01, T-A05 |
| T-C03 | `[ ]`  | SourceFile domain + GridFS upload/download            | P002 §5.5, §11    | T-A02        |
| T-C04 | `[ ]`  | Per-strategy validation rules for the identity config | P002 §9.1, §9.1.1 | T-C01        |

### T-C02 — JobConfig controller

- [ ] POST `/job-configs` validates schema by `source.type` (discriminated union DTO)
- [ ] GET `/job-configs` filters by `enabled`, `source.type`, with pagination
- [ ] PATCH uses optimistic concurrency (`updatedAt` check)
- [ ] DELETE is soft delete (`enabled=false`)
- [ ] POST `/:id/enable`, `/:id/disable`

**Outcome**: Full CRUD; creating an Excel job config with a non-existent `sourceFileId` is rejected.

### T-C04 — Per-strategy validation

- [ ] `strategy='primary-key'` → `fields.length === 1`
- [ ] `strategy='composite'` → `fields.length >= 2`
- [ ] `strategy='hash'` → require `identity.acknowledgeHashSemantics === true`
- [ ] `strategy='row-number'` → require `source.type IN ('excel', 'csv')`
- [ ] Log warn when `strategy='hash'` (semantic insert+delete warning)

**Outcome**: Unit test for each rule.

---

## Phase D — Adapter framework + Excel (T-D01 → T-D03)

| ID    | Status | Task                                                | Refs            | Depends      |
| ----- | ------ | --------------------------------------------------- | --------------- | ------------ |
| T-D01 | `[ ]`  | `SourceAdapter` interface + `SourceAdapterRegistry` | P002 §7.1, §7.2 | T-A01        |
| T-D02 | `[ ]`  | `ExcelAdapter` (streaming reader via `exceljs`)     | P002 §6.1, §7.3 | T-D01, T-C03 |
| T-D03 | `[ ]`  | `computeRecordKey` utility with 4 strategies        | P002 §9.1       | T-D01        |

### T-D02 — ExcelAdapter

- [ ] `discoverMetadata`: read header row → field list + type guess (sample N rows)
- [ ] `stream`: `exceljs.stream.xlsx.WorkbookReader` reads row-by-row, yields records
- [ ] Support `sheetName` (default: first sheet), `headerRow`, `startRow`
- [ ] Map field types per `fieldTypes` config when provided (string/number/date/boolean)
- [ ] Field names with spaces or special chars are kept as-is (no sanitization)
- [ ] Test with a 10MB+ file without blowing memory

**Outcome**: Stream a 100k-row Excel with heap < 200MB.

### T-D03 — computeRecordKey

- [ ] Implement all 4 strategies per P002 §9.1
- [ ] `composite`: escape `||` in values before joining (e.g. `value.replaceAll('||', '\\|\\|')`)
- [ ] `primary-key`: throw error if value is null/undefined
- [ ] `hash`: use `stableStringify` (key-sorted) before sha256
- [ ] Unit tests for each strategy + edge cases (null, empty, special chars)

**Outcome**: Test coverage for every edge case listed in the P002 §9.1 caveats.

---

## Phase E — Sync executor (T-E01 → T-E06)

| ID    | Status | Task                                                        | Refs            | Depends      |
| ----- | ------ | ----------------------------------------------------------- | --------------- | ------------ |
| T-E01 | `[ ]`  | `ConcurrencyService` (Set fast-path + semaphore)            | P002 §8.2, §8.5 | T-A01        |
| T-E02 | `[ ]`  | `SyncExecutor.execute` — claim run via partial unique index | P002 §8.2       | T-E01, T-A02 |
| T-E03 | `[ ]`  | Heartbeat (setInterval every 30s updates `heartbeatAt`)     | P002 §8.3       | T-E02        |
| T-E04 | `[ ]`  | Main loop — insert/update/unchanged classification          | P002 §9 step 2  | T-E02, T-D03 |
| T-E05 | `[ ]`  | Delete detection (`detectDeleted` toggle)                   | P002 §9 step 3  | T-E04        |
| T-E06 | `[ ]`  | Changelog buffer & flush (per-record audit)                 | P002 §9.3       | T-E04        |

### T-E02 — Claim run

- [ ] Try `insertOne` into `sync_runs` with `status:'running'`
- [ ] Catch `DuplicateKeyError` (E11000) → return `SKIPPED_DB`
- [ ] Fast-path: check `concurrency.fastPath.has(jobConfigId)` first
- [ ] Always clean up the fast-path Set in a `finally` block

**Outcome**: Two callers invoking `executeSync(jobConfigId)` simultaneously result in 1 run + 1 skip.

### T-E04 — Main loop

- [ ] Fetch credentials if `credentialsRef` is set (decrypt via `SecretService`)
- [ ] Adapter discovers metadata → upsert `source_metadata` (by `schemaHash`)
- [ ] Loop the async iterator from `adapter.stream()`
- [ ] Per record: compute key + hash, findOne, classify insert/update/unchanged
- [ ] Per-record try/catch → push errors, abort when `errorThreshold` is exceeded
- [ ] Update `sync_runs.counts` periodically (every 1000 records) so UI can show progress

**Outcome**: Two sequential sync runs against unchanged data → `counts.unchanged = total`, no insert/update.

### T-E06 — Changelog buffer

- [ ] In-memory buffer Array; flush when reaching `INTEGRATION_CHANGELOG_BUFFER_SIZE` (default 100)
- [ ] Flush via `insertMany` (unordered)
- [ ] Flush error → retry once; if it still fails, push to `sync_runs.errors` with stage='audit', continue the run
- [ ] Mandatory flush points: end of main loop, end of delete detection, before finalizing sync_runs
- [ ] Toggle via `jobConfig.options.auditChanges` — when false, do not buffer

**Outcome**: Sync a 1000-record file; changelog contains exactly 1000 entries with matching recordKey/payloadHash.

---

## Phase F — Stale sweeper & scheduler (T-F01 → T-F03)

| ID    | Status | Task                                                          | Refs          | Depends      |
| ----- | ------ | ------------------------------------------------------------- | ------------- | ------------ |
| T-F01 | `[ ]`  | `StaleRunSweeperService` (startup + interval)                 | P002 §8.4     | T-E02        |
| T-F02 | `[ ]`  | `SchedulerService` (dynamic `@nestjs/schedule` cron registry) | P002 §2, §6.2 | T-C01, T-E02 |
| T-F03 | `[ ]`  | Manual trigger API (POST `/job-configs/:id/trigger`)          | P002 §11      | T-E02        |

### T-F01 — Stale sweeper

- [ ] On `OnApplicationBootstrap`: query `status='running' AND heartbeatAt < now - INTEGRATION_STALE_HEARTBEAT_TIMEOUT_MS`, mark `stale` + push error stage='heartbeat'
- [ ] `@Interval(INTEGRATION_STALE_SWEEP_INTERVAL_MS)` runs the same sweep
- [ ] Log the number of runs swept each cycle

**Outcome**: Kill the process mid-run, restart → the stuck run is marked stale within 2 minutes.

### T-F02 — Scheduler

- [ ] On bootstrap: load all `job_configs.enabled = true`, register `CronJob` via `SchedulerRegistry`
- [ ] Cron callback only calls `executor.execute(jobConfigId, 'schedule')` — does not await
- [ ] Listen for events `jobConfig.created/updated/deleted/enabled/disabled` → re-register
- [ ] Timezone: use `job.schedule.timezone` if set, fallback `INTEGRATION_DEFAULT_TIMEZONE`

**Outcome**: Create a job with cron `*/2 * * * *`; after 2 minutes a new run appears in sync_runs.

---

## Phase G — Remaining adapters (T-G01 → T-G06)

| ID    | Status | Task                                                            | Refs            | Depends               |
| ----- | ------ | --------------------------------------------------------------- | --------------- | --------------------- |
| T-G01 | `[ ]`  | `CsvAdapter` (`papaparse` stream)                               | P002 §6.1, §7.3 | T-D01, T-C03          |
| T-G02 | `[ ]`  | `RestApiAdapter` (axios + pagination + rate limit)              | P002 §6.3, §7.3 | T-D01, T-B01          |
| T-G03 | `[ ]`  | `PostgresAdapter` (`pg` cursor query)                           | P002 §6.2, §7.3 | T-D01, T-B01          |
| T-G04 | `[ ]`  | `MysqlAdapter` (`mysql2`)                                       | P002 §6.2, §7.3 | T-G03 (reuse pattern) |
| T-G05 | `[ ]`  | `MssqlAdapter` (`mssql`/tedious)                                | P002 §6.2, §7.3 | T-G03 (reuse pattern) |
| T-G06 | `[ ]`  | `OracleAdapter` (`oracledb` + Dockerfile Oracle Instant Client) | P002 §6.2, §7.3 | T-G03                 |

### T-G02 — REST API adapter

- [ ] Support pagination: `offset` / `page` / `cursor` / `none`
- [ ] Token bucket rate limit per `config.rateLimit.rps`
- [ ] Exponential backoff retry for status codes in `retryOnStatus`
- [ ] `responsePath` parsed as JSON path (use lodash `get`)
- [ ] Credentials from `secrets`: scheme bearer/basic/api-key

**Outcome**: Sync an API returning 1000 records across 10 pages with no miss / no duplicate.

### T-G06 — Oracle adapter

- [ ] Add `oracledb` dependency
- [ ] Update Dockerfile to install Oracle Instant Client (e.g. base image `ghcr.io/oracle/oraclelinux9-instantclient`)
- [ ] Image size will grow significantly (~500MB) — note this in README
- [ ] Smoke-test connection against Oracle 19c

**Outcome**: Sync a 10k-row Oracle table into `raw_records`.

---

## Phase H — Remaining admin APIs (T-H01 → T-H04)

| ID    | Status | Task                                          | Refs            | Depends |
| ----- | ------ | --------------------------------------------- | --------------- | ------- |
| T-H01 | `[ ]`  | SyncRuns API (list, detail, retry)            | P002 §11, §12.2 | T-E02   |
| T-H02 | `[ ]`  | RawRecords API (list, detail, query by run)   | P002 §11        | T-E04   |
| T-H03 | `[ ]`  | SourceMetadata API                            | P002 §11        | T-E04   |
| T-H04 | `[ ]`  | Health endpoints (`/health`, `/health/ready`) | P002 §11        | T-A02   |

### T-H01 — SyncRuns API

- [ ] GET `/sync-runs` filters `jobConfigId`, `status`, `from`, `to`, pagination
- [ ] GET `/sync-runs/:id` returns counts + full errors
- [ ] POST `/sync-runs/:id/retry` creates a new run with `parentRunId=:id`, `triggeredBy='retry'`
- [ ] Retry uses the CURRENT job_config snapshot (does not freeze the one from the parent run)

**Outcome**: Retry a failed run → a new run executes successfully and the parent reference is correct.

---

## Phase I — Polish & deploy (T-I01 → T-I05)

| ID    | Status | Task                                                    | Refs              | Depends      |
| ----- | ------ | ------------------------------------------------------- | ----------------- | ------------ |
| T-I01 | `[ ]`  | Swagger docs for every endpoint (with DTO descriptions) | P002 §11          | T-H01..T-H04 |
| T-I02 | `[ ]`  | README — quick start, env vars, architecture summary    | -                 | T-I01        |
| T-I03 | `[ ]`  | Multi-stage Dockerfile                                  | P002 §7 (Phase 1) | T-G06        |
| T-I04 | `[ ]`  | docker-compose template (Mongo + service)               | -                 | T-I03        |
| T-I05 | `[ ]`  | Smoke test local docker-compose deploy                  | -                 | T-I04        |

---

## Phase J — Tests (T-J01 → T-J04)

Tests are written IN PARALLEL with each phase above — not deferred to the end. Phase J is an aggregate list, not a sequential one.

| ID    | Status | Task                                                           | Refs | Depends      |
| ----- | ------ | -------------------------------------------------------------- | ---- | ------------ |
| T-J01 | `[ ]`  | Unit tests for crypto (T-B01) + computeRecordKey (T-D03)       | -    | T-B01, T-D03 |
| T-J02 | `[ ]`  | E2E: create Excel job → manual trigger → assert counts         | -    | T-F03, T-D02 |
| T-J03 | `[ ]`  | E2E: two syncs detect correct insert/update/delete             | -    | T-E05        |
| T-J04 | `[ ]`  | E2E: kill process mid-run → restart → stale sweeper handles it | -    | T-F01        |

---

## Phase summary

| Phase                    | Task count    | Goal                                                              |
| ------------------------ | ------------- | ----------------------------------------------------------------- |
| A — Foundation           | 6             | Project runs, Mongo connected, env validated, log + API key ready |
| B — Security             | 3             | Encryption works, Secrets API CRUD                                |
| C — Job config & file    | 4             | Create job configs, upload files into GridFS                      |
| D — Adapter base + Excel | 3             | Stream Excel, computeRecordKey for 4 strategies                   |
| E — Sync executor        | 6             | Run jobs, correct I/U/D classification, per-record audit          |
| F — Sweeper + scheduler  | 3             | Cron auto-trigger, stale recovery                                 |
| G — Remaining adapters   | 6             | CSV, REST API, 4 DB adapters                                      |
| H — Admin APIs           | 4             | History trace, query raw, health                                  |
| I — Polish & deploy      | 5             | Swagger, README, Docker, compose                                  |
| J — Tests                | 4 (aggregate) | Basic unit + E2E coverage                                         |

**Total**: ~40 tasks. Phases A–F form the **critical path** that gets one end-to-end Excel sync working (the first demo-able milestone). Phases G–I add breadth and production-readiness.

---

## Open items outside phase 1 WBS

Tracked separately, not part of phase 1:

- [ ] Webhook integration (manager's form #2)
- [ ] MQTT/event adapter (manager's form #3)
- [ ] Schema drift alert channel (Slack/email)
- [ ] Migrate secrets master key from env → Docker secret / Vault
- [ ] Migrate to BullMQ + Redis if scaling to ≥2 workers becomes necessary
- [ ] Retention/TTL policy
- [ ] GraphQL adapter
- [ ] SOAP adapter
- [ ] Prometheus metrics endpoint
- [ ] Admin UI
