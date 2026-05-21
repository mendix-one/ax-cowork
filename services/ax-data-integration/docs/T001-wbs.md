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
| T-A02 | `[x]`  | Mongo connection module + GridFS service                                             | P002 §4 (acore/mongo) | T-A01   |
| T-A03 | `[x]`  | Config module with joi validation for all env vars                                   | P002 §16              | T-A01   |
| T-A04 | `[x]`  | Logger (pino structured) + credential mask interceptor                               | P002 §13.1            | T-A01   |
| T-A05 | `[x]`  | API Key guard (`x-api-key` header)                                                   | P002 §11              | T-A03   |
| T-A06 | `[x]`  | Index migration script (create partial unique index for sync_runs and other indexes) | P002 §5               | T-A02   |

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

### T-A05 — API Key guard

- [x] `ApiKeyGuard` reads `x-api-key` header, compares against parsed CSV of `INTEGRATION_API_KEYS`
- [x] Registered as a global guard via `APP_GUARD` in `AuthModule`
- [x] `@Public()` decorator marks routes/controllers exempt (via `Reflector` + `PUBLIC_ROUTE_KEY` metadata)
- [x] `IndexController` and `HealthController` marked `@Public()` so liveness/readiness probes don't need credentials
- [x] Constructor validates that the parsed key set is non-empty (fail-fast)
- [x] Header value as array → uses the first entry (defensive)
- [x] Unit tests cover: CSV parsing with whitespace + empty entries, empty-set fail-fast, public bypass, missing header, wrong key, array header

**Outcome**: Any non-public endpoint without a valid `x-api-key` returns 401. Public endpoints (`/`, `/health`, `/health/ready`) continue to work without credentials — verified by existing e2e suite.

### T-A04 — Logger (pino) + credential mask

- [x] `nestjs-pino` + `pino` + `pino-http` integrated; `pino-pretty` for dev output (`NODE_ENV=development`)
- [x] Log level driven by `LOG_LEVEL` env (`trace`/`debug`/`info`/`warn`/`error`/`fatal`/`silent`)
- [x] `src/acore/logging/redact.ts` recursively masks sensitive keys (`password|pwd|token|api[_-]?key|secret|credentials?|authorization`, case-insensitive, full-name match — no substring collateral)
- [x] Mask preserves class instances (Buffer / Date / Error) without recursing
- [x] `LoggingModule.forRootAsync` wires `deepRedact` as a pino `formatters.log`, so all logged objects (including HTTP request bodies via `pino-http`) are masked
- [x] `main.ts` uses `bufferLogs: true` and `app.useLogger(app.get(Logger))` so framework startup logs route through pino
- [x] Unit tests for `deepRedact` (7 cases, covering primitives, nesting, arrays, case-insensitivity, substring-safety, class instances)

**Outcome**: Logging is structured JSON in production and pretty in dev; sensitive field values are replaced with `[REDACTED]` regardless of nesting depth. E2E tests pass with `LOG_LEVEL=silent` to keep test output clean.

### T-A03 — Config module env validation

- [x] All env vars from P002 §16 declared in joi schema (`src/acore/config/config.module.ts`)
- [x] Required: `MONGO_URI`, `MONGO_DB_NAME`, `INTEGRATION_API_KEYS`, `INTEGRATION_MASTER_KEY_V1`, `INTEGRATION_MASTER_KEY_CURRENT`
- [x] Defaults applied: `PORT=3012`, `LOG_LEVEL=info`, `MONGO_POOL_SIZE=10`, timezone, error threshold, max concurrent, heartbeat / stale timings, changelog buffer size
- [x] Master keys validated as base64 length 44 (32-byte AES-256). Additional `INTEGRATION_MASTER_KEY_V<N>` keys validated via joi `.pattern()`
- [x] `LOG_LEVEL` constrained to pino levels (`trace`/`debug`/`info`/`warn`/`error`)

**Outcome**: App startup fails-fast when any required env is missing or malformed; e2e tests inject all required vars via `test/global-setup.ts` and pass.

### T-A02 — Mongo connection + GridFS

- [x] `acore/mongo/mongo.module.ts` connects via env `MONGO_URI` / `MONGO_DB_NAME`
- [x] `gridfs.service.ts` with methods `upload(stream, meta)`, `download(fileId)`, `delete(fileId)` (plus `findById`)
- [x] Health check ping (`/health/ready` uses `admin().ping()`)
- [x] Connection pool size configurable via env (`MONGO_POOL_SIZE`)

**Outcome**: GET `/health/ready` reports Mongo connected. Verified via e2e test using `mongodb-memory-server` (3/3 passing).

### T-A06 — Index migration

- [x] `src/acore/mongo/indexes.ts` exports `INDEX_SPECS` (declarative list, named indexes) and `ensureIndexes(db, log?)`
- [x] All P002 §5 indexes covered across 7 collections: `job_configs`, `source_metadata`, `raw_records`, `sync_runs`, `source_files`, `secrets`, `raw_record_changelog`
- [x] `sync_runs` partial unique `(jobConfigId, status)` with `partialFilterExpression: { status: 'running' }` — the run-lock mechanism
- [x] Idempotent: detects existing index by name and skips; collection-doesn't-exist (NamespaceNotFound code 26) treated as empty so first-run on a fresh DB works
- [x] `src/migrate-indexes.ts` CLI: connects via `MONGO_URI` / `MONGO_DB_NAME`, logs `created/exists` per index, prints summary
- [x] `package.json` script `migrate:indexes` runs the compiled CLI (`node dist/migrate-indexes.js`)
- [x] E2E test (`test/indexes.e2e-spec.ts`) on a fresh DB: first run → all `created`; second run → all `existed`; sync_runs partial index has correct `unique` + `partialFilterExpression`; every spec is materialized

**Outcome**: Running the script twice in a row produces no errors. E2E verifies 19 indexes across 7 collections, idempotency, and the critical partial unique index for the run lock.

---

## Phase B — Security & secrets (T-B01 → T-B03)

| ID    | Status | Task                                                           | Refs      | Depends      |
| ----- | ------ | -------------------------------------------------------------- | --------- | ------------ |
| T-B01 | `[x]`  | `SecretService` (AES-256-GCM encrypt/decrypt + key versioning) | P002 §10  | T-A03        |
| T-B02 | `[x]`  | Secrets domain (schema + repo + service)                       | P002 §5.6 | T-A02, T-B01 |
| T-B03 | `[x]`  | Secrets controller (POST/GET/PATCH/DELETE /secrets)            | P002 §11  | T-B02, T-A05 |

### T-B02 — Secrets domain

- [x] `secret.schema.ts` — `SecretDoc` (Mongo shape, mirrors P002 §5.6), `SecretInsert`, `SecretSummary` (public-safe — no ciphertext/plaintext), `SecretType = 'db' | 'api' | 'file'`, `SECRETS_COLLECTION` constant
- [x] `secret.repository.ts` — `findById`, `findByName`, `list` (newest-first), `insert`, `updateById` (via `findOneAndUpdate { returnDocument: 'after' }`), `deleteById`
- [x] `secret.service.ts` (named `SecretsService` to avoid collision with the crypto-layer `SecretService`):
  - [x] `create` — pre-checks duplicate name, encrypts plaintext, catches E11000 race
  - [x] `update` — re-encrypts only when new plaintext provided; partial updates supported
  - [x] `delete` — hard delete; TODO references job_config dependency check (deferred to T-C01)
  - [x] `getById` / `list` — return summaries only (no ciphertext)
  - [x] `revealPlaintext` — internal-use decryption for adapter execution; never exposed via HTTP
- [x] `SecretModule` wires repo + service, exports both
- [x] E2E (`test/secret.e2e-spec.ts`, 6 cases): create+round-trip, duplicate name → 409, update plaintext re-encrypts, update name without re-encryption, delete + NotFound on subsequent reads, list ordered newest-first with no ciphertext leakage

**Outcome**: Full CRUD over real Mongo (memory server) with encryption integration; all 6 e2e cases green.

### T-B01 — SecretService

- [x] `loadMasterKeyRing(env, currentVersion)` — pure function scans `INTEGRATION_MASTER_KEY_V<N>` env, decodes base64, validates 32-byte length, returns `{ currentVersion, keys: Map }`. Fail-fast if current key missing or any key malformed
- [x] `SecretService.encrypt(plaintext)` → `{ iv, authTag, ciphertext, keyVersion }` (all base64). AES-256-GCM with random 12-byte IV
- [x] `SecretService.decrypt(payload)` → plaintext; throws on unknown key version, tampered ciphertext, tampered authTag
- [x] New encryptions stamped with current version from `INTEGRATION_MASTER_KEY_CURRENT`; decrypt supports any loaded prior version (rotation)
- [x] `CryptoModule` (global) wires `loadMasterKeyRing(process.env, …)` via factory → `MASTER_KEY_RING` token → `SecretService`
- [x] Unit tests (5 loader + 8 service): CSV parsing edge cases, fail-fast paths, round-trip with UTF-8 + emoji, IV randomness, prior-version decrypt after rotation, tamper detection (ciphertext + authTag), wrong-key detection

**Outcome**: Unit tests pass (13 new, 26 total); same plaintext encrypted twice yields different ciphertext; e2e suite still green (`CryptoModule` wired into MainModule).

### T-C01 — JobConfig domain

- [x] `job-config.schema.ts` — `JobConfigDoc` mirrors P002 §5.1 (source, schedule, identity, options, credentialsRef, lastRun\*, audit fields). Types: `SourceType`, `IdentityStrategy`, `RunStatus`, `JobConfigSummary` (ObjectId fields serialized as hex strings)
- [x] `job-config.repository.ts` — `findById`, `findByName`, `list({ enabled, sourceType, skip, limit })` with parallel count, `insert`, `update({ set, unset })` (Mongo `$set` + `$unset` combined), `deleteById`, `countByCredentialsRef`
- [x] `job-config.service.ts` (`JobConfigsService`):
  - [x] `create` — applies defaults (`enabled=true`, `detectDeleted=true`, `auditChanges=true`); only writes optional option fields when explicitly provided (avoids Mongo storing `null` placeholders)
  - [x] `update` — partial update, merges options with existing; `credentialsRef: null` triggers `$unset`; bumps `updatedAt`
  - [x] `setEnabled` + `softDelete` (= `setEnabled(false)`) for the DELETE endpoint semantics
  - [x] `updateLastRun` for SyncExecutor bookkeeping — does NOT bump `updatedAt`
  - [x] `list` with pagination clamp (`pageSize ≤ 200`, default 50)
  - [x] `countReferencesToSecret(secretId)` — drives the secret-delete guard
- [x] Secret-delete reference check wired in `SecretsController.delete` — resolves T-B02 TODO; returns 409 when any job_config references the secret
- [x] `JobConfigModule` exports service + repo; `SecretModule` imports `JobConfigModule`; `MainModule` imports `JobConfigModule`
- [x] E2E (`test/job-config.e2e-spec.ts`, 11 cases): defaults, option overrides, duplicate-name 409, filter+pagination, partial-option merge, `credentialsRef=null` unset, setEnabled toggle, softDelete, updateLastRun preserves updatedAt, NotFound paths, countReferencesToSecret correctness
- [x] E2E (`test/secret.controller.e2e-spec.ts`, new case): DELETE returns 409 when a job_config still references the secret

**Outcome**: JobConfig full CRUD + state transitions on real Mongo; secret-delete now correctly blocks deletion when references exist. All 35 e2e cases green.

### T-B03 — Secrets controller

- [x] `CreateSecretDto` + `UpdateSecretDto` with `class-validator` (IsIn for `type`, IsNotEmpty + MaxLength for `name`, IsNotEmpty for `plaintext`) and Swagger `@ApiProperty` / `@ApiPropertyOptional`
- [x] `SecretsController` with routes:
  - [x] `POST /secrets` → 201, encrypted at rest, returns summary
  - [x] `GET /secrets` → 200, summary list (no plaintext / no ciphertext)
  - [x] `GET /secrets/:id` → 200 or 404
  - [x] `PATCH /secrets/:id` → 200; re-encrypts when `plaintext` supplied
  - [x] `DELETE /secrets/:id` → 204; (TODO T-C01: block when a `job_configs.credentialsRef` references the secret)
- [x] All routes protected by the global `ApiKeyGuard` (no `@Public()`); Swagger marks them with `@ApiSecurity('api-key')`
- [x] Shared `ObjectIdPipe` (`src/acore/mongo/object-id.pipe.ts`) validates path-id strings → 400 on malformed input
- [x] E2E (`test/secret.controller.e2e-spec.ts`, 10 cases): 401 no-key, 401 wrong-key, POST happy + duplicate 409 + DTO validation 400 (unknown type / missing field), list returns summaries with no ciphertext, GET malformed 400 / missing 404, PATCH round-trips, DELETE 204 + 404 on re-fetch

**Outcome**: Full CRUD over HTTP with auth + DTO validation; plaintext never leaks in any response; 10 e2e cases green. Phase B is now complete.

---

## Phase C — Job config & source files (T-C01 → T-C04)

| ID    | Status | Task                                                  | Refs              | Depends      |
| ----- | ------ | ----------------------------------------------------- | ----------------- | ------------ |
| T-C01 | `[x]`  | JobConfig domain (schema + repo + service)            | P002 §5.1, §6     | T-A02        |
| T-C02 | `[x]`  | JobConfig controller (CRUD + enable/disable)          | P002 §11          | T-C01, T-A05 |
| T-C03 | `[x]`  | SourceFile domain + GridFS upload/download            | P002 §5.5, §11    | T-A02        |
| T-C04 | `[x]`  | Per-strategy validation rules for the identity config | P002 §9.1, §9.1.1 | T-C01        |

### T-C03 — SourceFile domain + GridFS

- [x] Deps: `multer@^2.0` (runtime), `@types/multer` (dev)
- [x] `source-file.schema.ts` — `SourceFileDoc` (mirrors P002 §5.5) + `SourceFileSummary` (omits `gridFsFileId` from API surface)
- [x] `source-file.repository.ts` — `findById`, `findByChecksum` (dedup), `list` newest-first, `insert`, `deleteById`
- [x] `source-file.service.ts`:
  - [x] `upload` — computes sha256 from buffer, dedups via `findByChecksum` (returns existing summary without re-uploading), otherwise streams to GridFS + inserts metadata
  - [x] `openDownload` — returns metadata + GridFS readable stream
  - [x] `delete` — checks `JobConfigRepository.countBySourceFileRef` (resolves T-C02 deferral one-way), GridFS file removed before metadata doc
- [x] `source-file.controller.ts`:
  - `POST /source-files` (multipart `file` field, 100 MiB cap via `FileInterceptor` + `ParseFilePipeBuilder` returning 413 on oversize) → 201
  - `GET /source-files` (newest-first), `GET /:id` (404), `GET /:id/download` returns `StreamableFile` with original `Content-Type` + `Content-Disposition`
  - `DELETE /:id` → 204; 409 when a job_config references it; 404 when missing
- [x] `JobConfigRepository.countBySourceFileRef(sourceFileId)` — counts `{ 'source.config.sourceFileId': hexString }`; comment documents the string-storage contract
- [x] SourceFileModule imports JobConfigModule (one-way dep). JobConfig does NOT import SourceFile, sidestepping circular imports. **Outstanding**: cross-checking `sourceFileId` existence at JobConfig create/update time remains deferred (would need `forwardRef`); a sync run will surface the bad ref as a hard error instead
- [x] E2E (`test/source-file.controller.e2e-spec.ts`, 8 cases): 401, POST + sha256 match, dedup by checksum, GET download streams original bytes byte-for-byte, GET list newest-first without GridFS internals, 400 malformed id + 404 missing, DELETE 204/404 lifecycle, DELETE 409 when job_config references it

**Outcome**: Full upload/download/delete pipeline through GridFS with checksum dedup; reference safety on delete. 8 e2e cases green. Total e2e: 57 across 7 suites.

### T-C02 — JobConfig controller

- [x] DTOs with class-validator + Swagger:
  - `CreateJobConfigDto` — nested `SourceDto` / `ScheduleDto` / `IdentityDto` / `OptionsDto` / `RateLimitDto` with `@ValidateNested` + `@Type`
  - `UpdateJobConfigDto` — all fields optional; `description` / `credentialsRef` accept `null` (via `@ValidateIf((_, v) => v !== null)`) to trigger `$unset`; `expectedUpdatedAt` ISO string
  - `ListJobConfigsQuery` — `enabled` (boolean via `@Transform`), `sourceType`, `page`, `pageSize` (numeric via `@Type(() => Number)`)
- [x] `JobConfigController` routes:
  - `POST /job-configs` → 201
  - `GET /job-configs?enabled&sourceType&page&pageSize` → 200 `{ items, total, page, pageSize }`
  - `GET /job-configs/:id` → 200/404
  - `PATCH /job-configs/:id` → 200/404; with `expectedUpdatedAt` mismatch → 409 (optimistic concurrency)
  - `DELETE /job-configs/:id` → 200 returning summary with `enabled=false` (soft delete)
  - `POST /job-configs/:id/enable` and `/disable` → 200
- [x] Repository + service updated to accept `expectedUpdatedAt` and disambiguate stale-409 vs missing-404 by re-querying when update returns null
- [x] **Jest `maxWorkers: 1` in `jest-e2e.json`** — controller e2e specs share `ax_data_integration_e2e` DB so they must run serially (one spec's `deleteMany` would otherwise wipe another's in-flight data)
- [x] E2E (`test/job-config.controller.e2e-spec.ts`, 14 cases): 401 no-key, POST happy/defaults, POST 400 (bad enum / missing nested / malformed credentialsRef), POST 409 dup, GET filter+pagination, GET 400 malformed id / 404 missing, PATCH bumps updatedAt, PATCH 409 on stale optimistic check, PATCH 200 on matching expectedUpdatedAt, DELETE soft-delete, enable/disable toggle, enable on missing → 404

**Note**: Cross-validating `source.config.sourceFileId` against the `source_files` collection is deferred to T-C03 (SourceFile domain doesn't exist yet). The DTO accepts a loose `Record<string, unknown>` for `source.config`; per-type schema validation is the focus of T-C04.

**Outcome**: Full CRUD with auth + DTO validation + optimistic concurrency; soft delete; enable/disable; 14 e2e cases green. Total e2e: 49 across 6 suites.

### T-C04 — Per-strategy validation

- [x] Pure function `validateJobConfigIdentity(source, identity, logger?)` in `src/domain/job-config/identity.validator.ts`:
  - [x] `primary-key` → `fields.length === 1` (multi-field cases must use `composite`)
  - [x] `composite` → `fields.length >= 2`
  - [x] `hash` → requires explicit `identity.acknowledgeHashSemantics === true`; emits `logger.warn` with the insert+delete caveat from P002 §9.1
  - [x] `row-number` → `source.type` must be `excel` or `csv`
- [x] Wired into `JobConfigsService.create` (always) and `JobConfigsService.update` (when `source` or `identity` changes, validates against COMBINED new-∪-existing state so PATCH cannot leave the doc invalid). Service injects `Logger(JobConfigsService.name)` and passes it to the validator
- [x] Unit tests (`identity.validator.spec.ts`, 12 cases): every accept + reject path per strategy + verifies hash warn log is emitted
- [x] E2E (`job-config.controller.e2e-spec.ts`, 7 new cases): POST returns 400 for primary-key with multiple fields, composite with <2 fields, hash without acknowledge, row-number for non-file source; 201 for hash with acknowledge and row-number with excel; PATCH that switches identity into an invalid combination also returns 400

**Outcome**: Every P002 §9.1 caveat is enforced at create AND update time. 12 new unit tests + 7 new e2e cases all green. Phase C now complete.

---

## Phase D — Adapter framework + Excel (T-D01 → T-D03)

| ID    | Status | Task                                                | Refs            | Depends      |
| ----- | ------ | --------------------------------------------------- | --------------- | ------------ |
| T-D01 | `[x]`  | `SourceAdapter` interface + `SourceAdapterRegistry` | P002 §7.1, §7.2 | T-A01        |
| T-D02 | `[x]`  | `ExcelAdapter` (streaming reader via `exceljs`)     | P002 §6.1, §7.3 | T-D01, T-C03 |
| T-D03 | `[x]`  | `computeRecordKey` utility with 4 strategies        | P002 §9.1       | T-D01        |

### T-D01 — Adapter framework

- [x] `src/adapters/source-adapter.interface.ts` — `SourceAdapter<TConfig, TWatermark>` with `type`, `discoverMetadata`, `stream` (async iterable, must honor `options.signal`); supporting types `AdapterRecord` / `AdapterSourceInfo` / `SourceSchema` / `SourceField` / `SourceFieldType`
- [x] `src/adapters/source-adapter.registry.ts` — `SourceAdapterRegistry` (@Injectable): `register` (rejects duplicate type), `get` (throws `NotFoundException`), `has`, `registeredTypes` (sorted)
- [x] `AdaptersModule` is `@Global` so feature modules can inject the registry without re-importing
- [x] Wired into `MainModule`
- [x] Unit tests (5 cases): register+get, duplicate-type rejection, missing-type NotFound, has(), registeredTypes() sorting

**Outcome**: Framework in place for concrete adapters (Excel in T-D02, others in Phase G) to self-register and be looked up by `job_config.source.type`.

### T-D02 — ExcelAdapter

- [x] Dep `exceljs@^4.4`
- [x] `ExcelAdapter` implements `SourceAdapter<ExcelAdapterConfig>` with `type='excel'`
- [x] Runtime config takes `contentStream: () => Readable | Promise<Readable>` factory so the sync executor can resolve `sourceFileId` → GridFS stream without the adapter importing `domain/` (CLAUDE.md import rule)
- [x] `discoverMetadata`: reads header, samples up to 10 data rows, infers types (integer/number/boolean/date/string/object/array/unknown), honors `fieldTypes` override, sets `nullable` per column
- [x] `stream`: yields one record per data row with `sourceInfo.rowNumber`, preserves header field names verbatim, skips fully-blank rows, honors `options.signal.aborted`
- [x] `sheetName` defaults to the first worksheet; missing sheet throws
- [x] **Pragmatic deviation from P002 §7.3**: uses `workbook.xlsx.load(buffer)` instead of `WorkbookReader` (the streaming reader is racy against in-memory Readables). With the 100 MiB upload cap from T-C03, worst-case heap during parse is ~300–500 MB. Switching back to streaming for >100 MiB files is captured in the adapter source comment
- [x] `ExcelAdapterModule` self-registers the adapter via `onModuleInit` on the module (not the class), so unit tests can `new ExcelAdapter()` directly
- [x] Unit tests (`excel.adapter.spec.ts`, 10 cases): type inference, nullable detection, fieldTypes override, missing-sheet, per-row emission with sourceInfo, custom headerRow/startRow, blank-row skip, special-char field names, signal abort, 1000-row round-trip
- [x] ESLint config: added `@typescript-eslint/no-unused-vars` with `_`-prefix ignore pattern so adapter signatures using `_credentials: unknown` lint cleanly

**Outcome**: Excel adapter parses headers + emits records with correct schema inference. 1000-row round-trip passes in ~200 ms. Full suite: unit 53/53, e2e 64/64.

### T-D03 — computeRecordKey

- [x] `src/workers/compute-record-key.ts` exports `computeRecordKey({ identity, record, sourceFileId? })` + `stableStringify(value)` (also reused by `payloadHash` computation in T-E04)
- [x] **primary-key**: returns `String(value)` of `fields[0]`; coerces Date → ISO; throws when value is null/undefined/missing (P002 §9.1 caveat — caller stage='write' logs to `sync_runs.errors`)
- [x] **composite**: joins `escape(value)` per field with `||`; null/undefined/missing field → empty string; values containing `||` are escaped to `\|\|` (prevents the X||Y collision documented in P002 §9.1)
- [x] **hash**: `sha256(stableStringify(payload))` — output is a 64-char hex string; deterministic regardless of payload key insertion order
- [x] **row-number**: `${sourceFileId}:${rowNumber}`; throws when `sourceFileId` missing or `record.sourceInfo.rowNumber` is not a number
- [x] `stableStringify` sorts plain-object keys recursively; preserves array order; class instances (Date / Buffer / Map) passed through to JSON.stringify (Date → ISO string)
- [x] Unit tests (`compute-record-key.spec.ts`, 21 cases): primary-key (5), composite (5 including escape & order sensitivity), hash (3 including determinism), row-number (3), stableStringify (5)

**Outcome**: Every P002 §9.1 edge case has a passing test. Phase D now complete. Unit total: 74; e2e: 64.

---

## Phase E — Sync executor (T-E01 → T-E06)

| ID    | Status | Task                                                        | Refs            | Depends      |
| ----- | ------ | ----------------------------------------------------------- | --------------- | ------------ |
| T-E01 | `[x]`  | `ConcurrencyService` (Set fast-path + semaphore)            | P002 §8.2, §8.5 | T-A01        |
| T-E02 | `[x]`  | `SyncExecutor.execute` — claim run via partial unique index | P002 §8.2       | T-E01, T-A02 |
| T-E03 | `[x]`  | Heartbeat (setInterval every 30s updates `heartbeatAt`)     | P002 §8.3       | T-E02        |
| T-E04 | `[x]`  | Main loop — insert/update/unchanged classification          | P002 §9 step 2  | T-E02, T-D03 |
| T-E05 | `[x]`  | Delete detection (`detectDeleted` toggle)                   | P002 §9 step 3  | T-E04        |
| T-E06 | `[x]`  | Changelog buffer & flush (per-record audit)                 | P002 §9.3       | T-E04        |

### T-E01 — ConcurrencyService

- [x] `src/workers/concurrency.service.ts` with composite API `acquire(jobConfigId): Promise<AcquireResult>`:
  - `kind: 'acquired'` — both fast-path Set entry and a semaphore slot held; caller must invoke `release()`
  - `kind: 'skipped-inmem'` — same jobConfigId already running in this process; caller should short-circuit
- [x] Two-level guard per P002 §8.2 + §8.5:
  - **Fast-path Set**: O(1) reject before DB lookup when an overlapping cron-fire happens in the same process
  - **Promise-based semaphore**: caps total concurrent runs at `MAX_CONCURRENT_RUNS` (default 5 from env). Waiters resume FIFO; slot is handed directly to next waiter on release so cap stays at capacity until drained
- [x] Constructor validates `maxSlots` is a positive integer
- [x] Diagnostic getters: `inFlight`, `fastPathSize`, `capacity`, `isRunning(jobConfigId)`
- [x] `WorkersModule` wires the `MAX_CONCURRENT_RUNS` token via a `ConfigService` factory and exports `ConcurrencyService`
- [x] Unit tests (`concurrency.service.spec.ts`, 8 cases): fast-path acquire+skip, release frees fast-path, distinct ids don't collide, capacity validation, immediate acquires under capacity, blocked acquire resumes on release, FIFO waiter ordering, release without prior acquire clamps at 0

**Outcome**: SyncExecutor (T-E02) can safely call `await concurrency.acquire(id)` and short-circuit on duplicates without touching Mongo. Semaphore caps cross-job concurrency so a midnight swarm cannot exhaust the connection pool.

### T-E02 — Claim run

- [x] **SyncRun domain**: `src/domain/sync-run/` — `SyncRunDoc` schema (mirrors P002 §5.4), `SyncRunCounts` + `ZERO_COUNTS`, `SyncRunErrorEntry` with `stage` union, `TriggerSource` union, `SYNC_RUNS_COLLECTION` constant
- [x] `SyncRunRepository`: `insertRunning` (relies on partial unique index to throw E11000 on overlap), `finalize` (status + counts + finishedAt + optional errors), `touchHeartbeat` (for T-E03), `findById`, `findRunning(jobConfigId)`, `countByJobConfig`
- [x] `SyncRunModule` exports the repository; `WorkersModule` imports `SyncRunModule` so executor can inject it
- [x] `SyncExecutorService.execute(jobConfigId, triggeredBy)` returns a discriminated union:
  - `{ kind: 'acquired', runId, status }`
  - `{ kind: 'skipped-inmem', reason }` (ConcurrencyService fast-path hit)
  - `{ kind: 'skipped-db', reason }` (insert threw E11000 — another worker holds the partial-unique lock)
- [x] Workflow: `ConcurrencyService.acquire(idHex)` → if not skipped, `insertRunning` (catch E11000), then `finalize(status: 'success', counts: ZERO_COUNTS)` (placeholder until T-E03 → T-E06 plug in heartbeat + main loop)
- [x] Error path: any error after insert finalizes the run as `failed` with the error captured in `sync_runs.errors[]` (stage='other'); `handle.release()` always runs in `finally` so fast-path + semaphore are restored
- [x] `workerId` = `${os.hostname()}:${process.pid}` (matches P002 §5.4)
- [x] E2E (`test/sync-executor.e2e-spec.ts`, 5 cases): happy path → status=success + zero counts; concurrent calls → 1 acquired + 1 skipped-inmem + exactly 1 doc; pre-inserted running doc → skipped-db; independent job ids run in parallel; repeated sequential calls each create a new run

**Outcome**: Two concurrent callers result in 1 run + 1 skip (memory-level). A pre-inserted running doc forces the second to skip at the DB level. Successful runs leave the partial-unique 'running' state so the next call can claim again.

### T-E03 — Heartbeat

- [x] `SyncExecutorService` accepts `HEARTBEAT_INTERVAL_MS` DI token (sourced from `INTEGRATION_HEARTBEAT_INTERVAL_MS` env, default 30 s); constructor validates positive number
- [x] `execute()` starts a `setInterval` after `insertRunning` succeeds; each tick calls `SyncRunRepository.touchHeartbeat(runId)`
- [x] Heartbeat write failures are caught and `logger.warn`-ed — a transient DB hiccup never crashes the run
- [x] `clearInterval` runs in `finally` (after `executeRun` + finalize). A heartbeat racing past finalize only touches `heartbeatAt` on an already-completed doc; the stale sweeper queries `status: 'running'` so this is harmless (documented in source)
- [x] Refactored `execute()` to call `protected executeRun(runId, jobConfigId)` — a no-op stub for T-E02/T-E03 that T-E04 will replace with discover + stream + classify. Tests subclass `SyncExecutorService` to inject a slow `executeRun` for timing assertions
- [x] `WorkersModule` provides `HEARTBEAT_INTERVAL_MS` via `ConfigService` factory
- [x] E2E (`test/sync-executor.e2e-spec.ts`, 3 new cases): `heartbeatAt > startedAt` after a 200 ms work step with 25 ms heartbeat interval; `clearInterval` runs (active-handle count does not increase after execute); constructor rejects 0 / negative / NaN intervals

**Outcome**: A long-running execute bumps `heartbeatAt` every interval; on completion no timer leaks; existing T-E02 behaviors unchanged.

### T-E04 — Main loop

- [x] New domain modules:
  - `src/domain/raw-record/` — schema (P002 §5.3), repo (`findByKey`, `insertNew`, `updateChanged`, `touchLastSeen`, `countByJobConfig`)
  - `src/domain/source-metadata/` — schema (P002 §5.2), repo (`insertIfNew` — relies on unique partial index to dedup, swallows E11000)
- [x] `SyncRunRepository.updateCounts` for periodic progress flush
- [x] `SyncExecutorService.executeRun()` is now the real main loop:
  - Load `JobConfigDoc` (404 → fail), fetch adapter from registry, build per-type adapter config (Excel/CSV resolve `sourceFileId` via `SourceFileRepository` + `GridfsService`), decrypt `credentialsRef` via `SecretsService.revealPlaintext` (JSON-parsed if possible)
  - `adapter.discoverMetadata(...)` → sha256(stableStringify(schema)) → `SourceMetadataRepository.insertIfNew` (skipped if unchanged schema)
  - `for await (record of adapter.stream(...))`: compute recordKey + payloadHash, findByKey, classify insert/update/unchanged, write raw_records; the `lastUpdatedRunId` is the current run id, `version` bumps on UPDATE, `status` resurrects to `active` on UPDATE
  - Per-record try/catch → push to `errors[]` with stage='write', `counts.errors++`; when `errors >= errorThreshold`, return `{ aborted: true }` (graceful — no throw)
  - Counts flushed to `sync_runs.counts` every `COUNTS_FLUSH_INTERVAL` (1000) records
  - row-number strategy: `sourceFileId` extracted once outside the loop and passed to `computeRecordKey`
- [x] `execute()` final-status logic: `success` (no errors), `partial` (errors but threshold not hit), `failed` (`aborted=true` from threshold or any setup-time throw — missing job_config / missing source_file / unknown adapter). Setup-time errors are caught and recorded as `acquired + failed` — execute() no longer rethrows on expected per-run failures
- [x] Module wiring: `WorkersModule` imports all required domains; `MainModule` imports `RawRecordModule` + `SourceMetadataModule`
- [x] Refactored existing `sync-executor.e2e-spec.ts` (T-E02 + T-E03) to use a `TestExecutor` subclass that stubs `executeRun` — keeps the claim/heartbeat tests isolated from the new dependency graph
- [x] E2E (`test/sync-executor-main-loop.e2e-spec.ts`, 7 cases via MainModule):
  - initial sync inserts every row + raw_records count matches
  - re-sync on unchanged data: `counts.unchanged = total`, no insert/update (P002 outcome)
  - tampered `payloadHash` → next run classifies UPDATE, `version` bumps, `lastUpdatedRunId` set
  - `source_metadata` dedups across runs of the same schema
  - error threshold abort: status='failed', counts.errors recorded
  - errors below threshold: status='partial' with errors in `sync_runs.errors`
  - missing `sourceFileId` → graceful 'failed' (no leftover 'running' doc)

**Outcome**: All P002 §9 step-2 classification paths covered. Two sequential sync runs against unchanged data report `counts.unchanged = total` with no insert/update — the canonical idempotency property. Suite total: 79 e2e + 82 unit, all green.

### T-E05 — Delete detection

- [x] `RawRecordRepository.markStaleAsDeleted(jobConfigId, runId, startedAt)` — single `updateMany` filter `{ jobConfigId, status: 'active', lastSeenAt: { $lt: startedAt } }`, $set `status='deleted' + deletedInRunId + lastSeenAt=now`; returns `modifiedCount`
- [x] Executor refactor: `executeRun(run, jobConfigId)` now receives the full `SyncRunDoc` (not just `runId`) so `run.startedAt` is available for the delete cutoff
- [x] After the main loop, when `jobConfig.options.detectDeleted` is true → call `markStaleAsDeleted` and set `counts.deleted`
- [x] Audit-aware slow path (one-by-one with `raw_record_changelog` writes) is **deferred to T-E06**. When `auditChanges=true`, T-E05 still uses fast path; T-E06 will branch
- [x] E2E (3 new cases in `sync-executor-main-loop.e2e-spec.ts`):
  - default detectDeleted=true: shrinking the source from 3 rows → 2 rows marks the missing row as `status='deleted'`, `deletedInRunId` set, `counts.deleted=1`, `counts.unchanged=2`
  - `options.detectDeleted=false`: missing rows stay `status='active'`, `counts.deleted=0`
  - already-deleted records are not re-counted on subsequent runs (the `status='active'` filter excludes them)

**Outcome**: Records absent from the source for a full run are transitioned to `status='deleted'`. Idempotent across repeated shrunk runs.

### T-E06 — Changelog buffer

- [x] New domain `src/domain/raw-record-changelog/` (schema mirrors P002 §5.7) — `RawRecordChangelogRepository.insertMany` uses `{ ordered: false }` so one bad doc does not abort the batch; helper queries `countByJobConfig(filter)` and `findByRecord` for tests/admin
- [x] In-memory buffer `RawRecordChangelogInsert[]` lives inside `executeRun` (per-call scope — no shared state across concurrent runs)
- [x] Auto-flush when buffer hits `INTEGRATION_CHANGELOG_BUFFER_SIZE` (default 100, env-driven)
- [x] Mandatory flushes: end of main loop, end of audit-aware delete detection, on threshold-abort before returning. Final flush after delete detection is idempotent (no-op when empty)
- [x] `flushChangelog()` retries the failed batch once; if still failing, pushes a `stage='audit'` entry to `sync_runs.errors[]` and continues — audit failures never crash the run (source-of-truth is `raw_records`)
- [x] `classifyAndWrite` pushes one entry per **insert** (versionBefore=null) and per **update** (versionBefore/After + payloadBefore/After). Unchanged rows write nothing (per P002 §5.7)
- [x] Delete detection has two paths now:
  - `auditChanges=false`: existing fast-path `markStaleAsDeleted` (single updateMany, only count returned)
  - `auditChanges=true`: new `detectDeletionsWithAudit` iterates `RawRecordRepository.findStaleActive`, calls `markOneAsDeleted` per doc, pushes a `delete` changelog entry (payloadBefore/After both equal the doc's payload at deletion time)
- [x] `RawRecordRepository` gains `findStaleActive` (AsyncIterable) + `markOneAsDeleted`
- [x] `WorkersModule` provides `CHANGELOG_BUFFER_SIZE`; `MainModule` imports `RawRecordChangelogModule`
- [x] Existing `sync-executor.e2e-spec.ts` TestExecutor updated with the new constructor args
- [x] E2E (5 new cases in `sync-executor-main-loop.e2e-spec.ts`):
  - initial insert run writes one `insert` entry per row with `versionBefore=null`, `versionAfter=1`, `payloadBefore=null`
  - update path writes an `update` entry with `versionBefore=1`, `versionAfter=2`, `payloadHashBefore` recorded
  - audit-aware delete: shrinking the source writes a `delete` entry per removed row; `payloadBefore=payloadAfter=stored payload`
  - `auditChanges=false` writes ZERO changelog entries even after insert / update / delete cycles
  - 250-row batch with default buffer size 100 → all 250 `insert` entries persisted (buffer auto-flush during loop + mandatory flush at end)

**Outcome**: Per-record audit trail works end-to-end. The buffer auto-flushes through Mongo round-trips while keeping the per-run scope so concurrent jobs cannot mix changelog entries. **Phase E now complete (6/6 tasks).**

---

## Phase F — Stale sweeper & scheduler (T-F01 → T-F03)

| ID    | Status | Task                                                          | Refs          | Depends      |
| ----- | ------ | ------------------------------------------------------------- | ------------- | ------------ |
| T-F01 | `[x]`  | `StaleRunSweeperService` (startup + interval)                 | P002 §8.4     | T-E02        |
| T-F02 | `[x]`  | `SchedulerService` (dynamic `@nestjs/schedule` cron registry) | P002 §2, §6.2 | T-C01, T-E02 |
| T-F03 | `[x]`  | Manual trigger API (POST `/job-configs/:id/trigger`)          | P002 §11      | T-E02        |

### T-F01 — Stale sweeper

- [x] `SyncRunRepository.markStale(heartbeatBefore)` — `updateMany` filter `{ status: 'running', heartbeatAt: { $lt: heartbeatBefore } }`, `$set status='stale' + finishedAt=now`, `$push errors: { stage:'heartbeat', message:'heartbeat timeout', occurredAt:now }`. Returns modifiedCount
- [x] `src/workers/stale-run-sweeper.service.ts` — `StaleRunSweeperService` implements `OnApplicationBootstrap` + `OnApplicationShutdown`:
  - On bootstrap: runs `sweepOnce('startup')` immediately so leftover 'running' docs from a previous crashed process are reclaimed
  - Then installs `setInterval(sweepOnce, intervalMs)` for the lifetime of the process
  - `onApplicationShutdown` clears the interval (no timer leak on graceful shutdown)
  - Periodic sweep failures are caught and logged at `error` — they do not crash the host
  - Public `sweepOnce(reason)` available for tests / manual invocation
- [x] Constructor validates `STALE_HEARTBEAT_TIMEOUT_MS` and `STALE_SWEEP_INTERVAL_MS` are positive finite numbers
- [x] `WorkersModule` provides the two tokens via `ConfigService` factories (defaults 120 s and 60 s, mirroring P002 §16)
- [x] E2E (`test/stale-run-sweeper.e2e-spec.ts`, 6 cases): single stale doc → marks + appends error, fresh doc untouched, non-running doc untouched even with stale heartbeat, batch of 3 stale docs processed, partial-unique lock releases so a fresh `insertRunning` for same `jobConfigId` succeeds, constructor rejects 0 / -1 / NaN

**Outcome**: A run whose host crashed mid-execution is marked `stale` within `STALE_HEARTBEAT_TIMEOUT_MS` of the next sweep (≤ 2 min by default). The next scheduled fire for that job can claim a fresh run.

### T-F02 — Scheduler

- [x] Deps: `@nestjs/schedule@^6`, `@nestjs/event-emitter@^3`, `cron@^4`
- [x] `EventEmitterModule.forRoot()` wired in MainModule; `ScheduleModule.forRoot()` wired in WorkersModule
- [x] `JobConfigsService` now injects `EventEmitter2` (optional with a default isolated instance for tests bypassing DI) and emits `'jobConfig.changed' { id }` on every `create`, `update`, `setEnabled`, `softDelete`
- [x] `src/workers/scheduler.service.ts` — `SchedulerService` implements `OnApplicationBootstrap` + `OnApplicationShutdown`:
  - Bootstrap loads all `enabled: true` job_configs and registers one cron per row
  - `register(doc)` creates a `CronJob.from({ cronTime, onTick, timeZone, start: false })`, adds it to `SchedulerRegistry` under name `sync:<hexId>`, then `cron.start()`. Existing registration replaced
  - `onTick` callback fire-and-forgets `SyncExecutorService.execute(id, 'schedule')`; errors logged but not awaited
  - `@OnEvent('jobConfig.changed')` re-fetches the doc and decides register vs unregister based on `enabled`
  - `onApplicationShutdown` removes all owned cron jobs (no dangling timers)
  - Timezone: `job.schedule.timezone ?? DEFAULT_TIMEZONE` (sourced from `INTEGRATION_DEFAULT_TIMEZONE` env, default `'UTC'`)
- [x] Diagnostic getters `isRegistered(id)` + `registeredCount()` for tests
- [x] E2E (`test/scheduler.e2e-spec.ts`, 6 cases via MainModule): creating registers, disabling unregisters, re-enabling re-registers, `enabled=false` at create does NOT register, PATCH schedule keeps registered, softDelete unregisters

**Outcome**: Cron registry stays in sync with `job_configs` state via the EventEmitter bus — no restart needed after CRUD. Cron callbacks fire-and-forget to keep the scheduler non-blocking.

---

### T-F03 — Manual trigger API

- [x] `src/workers/trigger.controller.ts` (`@Controller('job-configs')` with `@ApiTags('Job configs')` for Swagger grouping) — kept inside `workers/` to break the would-be circular module dep `JobConfigModule ↔ WorkersModule`
- [x] `POST /job-configs/:id/trigger`:
  - 404 when the id does not exist
  - 200 with `{ runId, status }` (the executor finalizes the run; status reflects `success` / `partial` / `failed`)
  - 409 when another sync_run is already in flight (`skipped-inmem` or `skipped-db` from the executor)
  - 400 when the path id is not a valid ObjectId
- [x] Protected by the global `ApiKeyGuard` (no `@Public()`), so 401 without the key
- [x] `WorkersModule.controllers = [TriggerController]`; `ScheduleModule.forRoot()` already imported earlier
- [x] E2E (`test/trigger.controller.e2e-spec.ts`, 5 cases): 200 happy (status='failed' since the REST adapter is unregistered → executor gracefully captures the setup error), 404 missing id, 400 malformed id, 409 when a pre-inserted 'running' run holds the partial-unique lock, 401 without api-key

**Outcome**: Operators can manually kick off a sync without touching the cron schedule. The response carries the `runId` so callers can `GET /sync-runs/:id` for full counts/errors.

**Phase F complete (3/3 tasks).**

## Phase G — Remaining adapters (T-G01 → T-G06)

| ID    | Status | Task                                                       | Refs            | Depends               |
| ----- | ------ | ---------------------------------------------------------- | --------------- | --------------------- |
| T-G01 | `[x]`  | `CsvAdapter` (`papaparse` stream)                          | P002 §6.1, §7.3 | T-D01, T-C03          |
| T-G02 | `[ ]`  | `RestApiAdapter` (axios + pagination + rate limit)         | P002 §6.3, §7.3 | T-D01, T-B01          |
| T-G03 | `[x]`  | `PostgresAdapter` (`pg` cursor query)                      | P002 §6.2, §7.3 | T-D01, T-B01          |
| T-G04 | `[x]`  | `MysqlAdapter` (`mysql2`)                                  | P002 §6.2, §7.3 | T-G03 (reuse pattern) |
| T-G05 | `[x]`  | `MssqlAdapter` (`mssql`/tedious)                           | P002 §6.2, §7.3 | T-G03 (reuse pattern) |
| T-G06 | `[x]`  | `OracleAdapter` (`oracledb` thin mode — no Instant Client) | P002 §6.2, §7.3 | T-G03                 |

### T-G01 — CSV adapter

- [x] Deps: `papaparse@^5.4` (runtime), `@types/papaparse@^5.3` (dev)
- [x] `src/adapters/csv/csv.adapter.ts` — `CsvAdapter` implements `SourceAdapter<CsvAdapterConfig>` with `type='csv'`; runtime config has `contentStream` factory + `headerRow` + `startRow` + optional `delimiter` (auto-detect when omitted) + optional `fieldTypes`
- [x] Phase 1 buffers the full file into memory (`streamToBuffer` → utf-8 string → `Papa.parse`) — same trade-off as `ExcelAdapter`, fine within the 100 MiB upload cap
- [x] `discoverMetadata` extracts header at 1-based `headerRow`, samples up to 10 non-blank data rows after `startRow`, infers types via `dynamicTyping: true` (papaparse returns native numbers/booleans/null); honors `fieldTypes` override
- [x] `stream` yields one `AdapterRecord` per data row with `sourceInfo.rowNumber`, coerces empty strings to `null`, skips fully-blank rows, honors `options.signal.aborted`
- [x] papaparse warnings (delimiter auto-detect fallback, field-mismatch) surface via `logger.warn` rather than aborting — the parser still returns usable rows
- [x] `CsvAdapterModule` self-registers at `onModuleInit`; wired into `MainModule`
- [x] Sync executor refactor: `buildAdapterConfig` branches per `source.type`; new `resolveFileContentStream` helper shared by `buildExcelAdapterConfig` + `buildCsvAdapterConfig`
- [x] Unit tests (`csv.adapter.spec.ts`, 11 cases): header + type inference, fieldTypes override, nullable detection, per-row emit with sourceInfo, custom headerRow/startRow, blank-row skip, empty→null coercion, special-char header names, custom delimiter (semicolon), signal abort, 1000-row round-trip

**Outcome**: CSV files sync through the same pipeline as Excel — schema discovery + raw_records classification + audit changelog all reuse the executor work proven in Phase E.

### T-G02 — REST API adapter

- [x] Dep `axios@^1.7`
- [x] `src/adapters/rest-api/rest-api.adapter.ts` — `RestApiAdapter` implements `SourceAdapter<RestApiAdapterConfig>`; constructor takes optional `AxiosInstance` (default `axios`) — module uses `useFactory: () => new RestApiAdapter()` so NestJS DI doesn't try to resolve `AxiosInstance` from the container
- [x] Pagination types `'none' | 'offset' | 'page' | 'cursor'`. `page` defaults to 1-indexed (`pageStart=1`); `offset` increments by `pageSize`; `cursor` reads `cursorPath` from response, passes back via `cursorParam` until null/empty
- [x] Each request honors `config.rateLimit?.rps` (per-call state, not shared across concurrent jobs)
- [x] Retry: when response status is in `retryOnStatus`, exponential backoff (`250 ms × 2^attempt`) up to 3 attempts. Non-retryable statuses throw immediately. Network errors bubble (no auto-retry)
- [x] `responsePath` is a dot path navigated by an inline `getByPath` helper (no lodash dep added)
- [x] Auth headers from credentials: `bearer` / `basic` / `api-key` with configurable header name
- [x] `RestApiAdapterModule.onModuleInit` self-registers into `SourceAdapterRegistry`; module wired into `MainModule`
- [x] `SyncExecutor.buildAdapterConfig` adds `'rest'` branch — extracts baseUrl/endpoint/method/pagination/retryOnStatus from `source.config`, pulls `rateLimit` from `jobConfig.options.rateLimit`
- [x] Unit tests (`rest-api.adapter.spec.ts`, 15 cases via injected mock axios): discoverMetadata type inference + empty response, pagination none/page/offset/cursor, signal abort, bearer + api-key headers, retry on 503 success, no retry on 400, retries exhaust, rate limit honored, baseUrl+endpoint slash normalization, single-object response wrapping

**Outcome**: REST APIs sync through the existing executor with all four pagination strategies. Run failures from real-world HTTP errors propagate as `acquired + failed` per the executor's graceful-failure contract from T-E04.

### T-G03 — Postgres adapter

- [x] Deps: `pg@^8.13`, `pg-cursor@^2.12` (runtime), `@types/pg@^8.11` (dev) — `pg-cursor` has no published types, declared locally via a `PgCursorLike` interface
- [x] `src/adapters/postgres/pg-connection.ts` — `PgConnection` / `PgConnectionFactory` abstraction so the adapter can swap a fake factory in tests; `RealPgConnectionFactory` is the production impl backed by `pg.Client` + `pg-cursor` (cursor-paged reads keep memory flat regardless of result size)
- [x] `src/adapters/postgres/postgres.adapter.ts` — `PostgresAdapter` implements `SourceAdapter<PostgresAdapterConfig>` with `type='postgres'`; constructor takes optional `PgConnectionFactory` (default `RealPgConnectionFactory`) so DI doesn't try to resolve `pg.Client`
- [x] `discoverMetadata` samples up to 10 rows (`SAMPLE_LIMIT`), infers field types (integer / number / boolean / date / string / array / object), marks fields nullable when any sampled row has `null`/`undefined`
- [x] `stream` reads in `STREAM_CHUNK=100`-row pages, yields one `AdapterRecord` per row with monotonic `sourceInfo.offset`, honors `options.signal.aborted` between rows
- [x] `RealPgConnection.close` uses `client.end()`; cursor `close()` errors are logged to stderr but never propagate (closing a stale cursor can throw on abort)
- [x] If `config.schema` is set, the connection runs `SET search_path TO "<schema>"` after connect (identifier double-quoted, internal `"` escaped); when `ssl: true` we use `{ rejectUnauthorized: false }` to support self-signed on-prem certs
- [x] Credentials shape `{ username, password }` — `buildConnectConfig` throws when missing or non-string before opening any socket
- [x] `PostgresAdapterModule` uses `useFactory: () => new PostgresAdapter()` (same DI pattern as REST/Excel/CSV) and self-registers in `onModuleInit`; wired into `MainModule`
- [x] `SyncExecutor.buildAdapterConfig` adds `'postgres'` branch — `buildPostgresAdapterConfig` extracts host/port/database/schema/query + options.{ssl, connectionTimeoutMs, queryTimeoutMs} from `source.config`
- [x] Unit tests (`postgres.adapter.spec.ts`, 10 cases via injected fake factory): credentials missing / wrong shape, discoverMetadata type inference, nullable detection, empty result, close-on-error, stream emits with sourceInfo.offset, signal pre-aborted, close after stream, connection config propagation (host/port/ssl/timeouts/user/password)

**Outcome**: Postgres sources sync through the executor end-to-end with cursor-paged reads — proves the pattern for the other DB adapters in Phase G (MySQL / MSSQL / Oracle). Real DB connections are exercised by an integration test in Phase J (not phase 1).

### T-G04 — MySQL adapter

- [x] Dep `mysql2@^3.22` (runtime) — ships its own types, no `@types/mysql2`
- [x] `src/adapters/mysql/mysql-connection.ts` — `MysqlConnection` / `MysqlConnectionFactory` abstraction mirroring the Postgres shape; `RealMysqlConnectionFactory` uses `mysql2/promise`. The streaming `.query(…).stream({highWaterMark})` API only exists on the callback-style connection, which the promise wrapper exposes at `.connection` but hides from its `.d.ts` — accessed via a local `PromiseConnectionInternal` type assertion
- [x] `src/adapters/mysql/mysql.adapter.ts` — `MysqlAdapter` implements `SourceAdapter<MysqlAdapterConfig>` with `type='mysql'`; constructor takes optional `MysqlConnectionFactory` (default `RealMysqlConnectionFactory`) so DI doesn't try to resolve `mysql2` from the container
- [x] `discoverMetadata` samples up to 10 rows, infers field types including `bigint → integer` (MySQL `BIGINT UNSIGNED` arrives as `bigint`) and `Buffer → string` (BLOB columns)
- [x] `stream` reads in 100-row pages, yields one `AdapterRecord` per row with monotonic `sourceInfo.offset`, honors `options.signal.aborted` between rows; `stream.destroy()` is called in `finally` so abort releases the cursor immediately
- [x] `queryTimeoutMs` is applied per-query via the `timeout` option (mysql2 has no global query_timeout); `connectionTimeoutMs` → `connectTimeout`; `ssl: true` → `{ rejectUnauthorized: false }` for self-signed on-prem certs
- [x] Credentials shape `{ username, password }` — `buildConnectConfig` throws when missing or non-string before opening any socket (same contract as `PostgresAdapter`)
- [x] `MysqlAdapterModule` uses `useFactory: () => new MysqlAdapter()` and self-registers in `onModuleInit`; wired into `MainModule`
- [x] `SyncExecutor.buildAdapterConfig` adds `'mysql'` branch — `buildMysqlAdapterConfig` extracts host/port/database/query + options.{ssl, connectionTimeoutMs, queryTimeoutMs} from `source.config`. MySQL has no `schema` concept (a connection-level `database` plays that role), so the Postgres `schema → SET search_path` step is intentionally absent
- [x] Unit tests (`mysql.adapter.spec.ts`, 10 cases via injected fake factory): credentials missing / wrong shape, discoverMetadata type inference (including bigint), nullable detection, empty result, close-on-error, stream emits with sourceInfo.offset, signal pre-aborted, close after stream, connection config propagation (host/port/ssl/timeouts/user/password)

**Outcome**: MySQL sources sync through the executor with row-streaming reads — reuses the Postgres adapter pattern almost line-for-line, validating that the abstraction generalizes across DB drivers.

### T-G05 — MSSQL adapter

- [x] Deps: `mssql@^11.0` (runtime, wraps `tedious`), `@types/mssql@^12.3` (dev) — `mssql` v11 dropped bundled types, so `@types/mssql` is required for type-aware lint
- [x] `src/adapters/mssql/mssql-connection.ts` — `MssqlConnection` / `MssqlConnectionFactory` abstraction mirroring Postgres/MySQL; `RealMssqlConnectionFactory` uses `mssql.ConnectionPool`. Streaming is event-based (`request.on('row'|'done'|'error')`) rather than `Readable`, so the real connection bridges it to async iteration via an in-process queue + `resolveWaiter` Promise. Backpressure is bounded by the queue — for very wide result sets we'd add `pause`/`resume`, but adequate for the on-prem volumes targeted
- [x] `MssqlRequestLike` local interface narrows mssql's `Request` (an EventEmitter subclass) to the four methods we use (`stream` flag, `on(row/done/error)`, `query`, `cancel`) — keeps the type-aware lint happy without leaking mssql types through
- [x] `src/adapters/mssql/mssql.adapter.ts` — `MssqlAdapter` implements `SourceAdapter<MssqlAdapterConfig>` with `type='mssql'`; constructor takes optional `MssqlConnectionFactory` (default `RealMssqlConnectionFactory`) so DI doesn't try to resolve `mssql` from the container
- [x] `discoverMetadata` samples up to 10 rows then **cancels the in-flight request** via an internal `AbortController` (so we don't drain the full table just for schema discovery)
- [x] `stream` reads with the connection's iterator, honors `options.signal.aborted` between rows; the connection's `finally` calls `request.cancel()` when the consumer breaks early
- [x] `ssl: true` → `options.encrypt: true`; `trustServerCertificate` defaults to `true` to match on-prem norms (self-signed certs); per-query `requestTimeout` from `queryTimeoutMs`
- [x] Credentials shape `{ username, password }` — `buildConnectConfig` throws when missing or non-string before opening any socket (same contract as Postgres/MySQL)
- [x] `MssqlAdapterModule` uses `useFactory: () => new MssqlAdapter()` and self-registers in `onModuleInit`; wired into `MainModule`
- [x] `SyncExecutor.buildAdapterConfig` adds `'mssql'` branch — `buildMssqlAdapterConfig` extracts host/port/database/schema/query + options.{ssl, connectionTimeoutMs, queryTimeoutMs, trustServerCertificate} from `source.config`
- [x] Unit tests (`mssql.adapter.spec.ts`, 11 cases via injected fake factory): credentials missing / wrong shape, discoverMetadata type inference + nullable detection + empty result, **SAMPLE_LIMIT cap (10 rows even when source has 50)**, close-on-error, stream emits with sourceInfo.offset, signal pre-aborted, close after stream, connection config propagation (host/port/ssl/timeouts/user/password/trustServerCertificate)

**Outcome**: SQL Server sources sync through the executor with event-bridged row streaming. The event→async-iterable bridge in `RealMssqlConnection` is the only place phase 1 differs structurally from Postgres/MySQL — captured behind the same `*Connection` interface so the adapter and tests stay shape-identical.

### T-G06 — Oracle adapter

- [x] Deps: `oracledb@^6.10` (runtime), `@types/oracledb@^6.5` (dev). The package's native install script is intentionally skipped via pnpm's `ignored build scripts` warning — we ship **thin mode only** in phase 1
- [x] **Architectural decision: thin mode, not thick** — `oracledb` v6 ships a pure-JS Oracle Net protocol implementation (thin mode) that supports Oracle DB 12.1+. This sidesteps the Dockerfile work flagged in the original WBS row and saves ~500MB image size. Thick-mode escape hatch is preserved via `OracleAdapterConfig.options.thickMode = true` — when set, `RealOracleConnectionFactory` calls `oracledb.initOracleClient()` (guarded by a process-level `thickModeInitialized` flag to avoid `NJS-077`). Operators who set `thickMode=true` are then responsible for installing Oracle Instant Client on the host and pointing `LD_LIBRARY_PATH` at it
- [x] `src/adapters/oracle/oracle-connection.ts` — `OracleConnection` / `OracleConnectionFactory` abstraction mirroring the other DB adapters; `RealOracleConnectionFactory` uses `oracledb.getConnection()`. Connect string is built as `host:port/serviceName` (Oracle service-name form, not the legacy SID form)
- [x] `RealOracleConnection.stream` uses `connection.queryStream(sql, [], { outFormat: OUT_FORMAT_OBJECT, fetchArraySize })`. The returned `Readable` is already an `AsyncIterable`, so the row loop is plain `for await (const row of stream)`. `stream.destroy()` in `finally` releases the cursor when the consumer breaks early
- [x] `oracledb.fetchAsString = [oracledb.CLOB]` is set per-connect so CLOB columns arrive as strings (vs. Lob streams) — keeps row payloads JSON-serializable for `raw_records`. BLOB stays as Buffer (inferred as `'string'` for schema purposes, matching the MySQL/MSSQL convention)
- [x] `connectionTimeoutMs` maps to `conn.callTimeout` (per-statement, oracledb has no global timeout setting); zero/undefined means no timeout
- [x] Credentials shape `{ username, password }` — `buildConnectConfig` throws when missing or non-string before opening any socket (same contract as Postgres/MySQL/MSSQL)
- [x] `OracleAdapterModule` uses `useFactory: () => new OracleAdapter()` and self-registers in `onModuleInit`; wired into `MainModule`
- [x] `SyncExecutor.buildAdapterConfig` adds `'oracle'` branch — `buildOracleAdapterConfig` extracts host/port/serviceName/query + options.{connectionTimeoutMs, thickMode} from `source.config`. Note: no `database` field (Oracle uses serviceName); no `schema` field (Oracle schema namespacing is baked into the query, e.g. `HR.EMPLOYEES`)
- [x] Unit tests (`oracle.adapter.spec.ts`, 10 cases via injected fake factory): credentials missing / wrong shape, discoverMetadata type inference (integer / string / date / number), nullable detection, empty result, close-on-error, stream emits with sourceInfo.offset, signal pre-aborted, close after stream, connection config propagation (host/port/serviceName/thickMode/connectionTimeoutMs/user/password)

**Outcome**: Oracle sources sync through the executor in thin mode by default — no Dockerfile changes and no ~500MB image bloat. Real Oracle DB connection is exercised by an integration test in Phase J (not phase 1). Phase G is now complete: all 4 DB adapters + REST + Excel + CSV are wired into the executor with the same interface contract.

---

## Phase H — Remaining admin APIs (T-H01 → T-H04)

| ID    | Status | Task                                          | Refs            | Depends |
| ----- | ------ | --------------------------------------------- | --------------- | ------- |
| T-H01 | `[x]`  | SyncRuns API (list, detail, retry)            | P002 §11, §12.2 | T-E02   |
| T-H02 | `[x]`  | RawRecords API (list, detail, query by run)   | P002 §11        | T-E04   |
| T-H03 | `[x]`  | SourceMetadata API                            | P002 §11        | T-E04   |
| T-H04 | `[x]`  | Health endpoints (`/health`, `/health/ready`) | P002 §11        | T-A02   |

### T-H01 — SyncRuns API

- [x] `SyncRunsController` (`src/workers/sync-runs.controller.ts`) — placed in `workers/` (not `domain/sync-run/`) for the same DI cycle reason as `TriggerController`: the retry endpoint needs `SyncExecutorService`, which lives in `WorkersModule`, which already imports `SyncRunModule`. Putting the controller in `workers/` avoids a `SyncRunModule ↔ WorkersModule` cycle. Registered in `WorkersModule.controllers` alongside `TriggerController`
- [x] `GET /sync-runs` filters by `jobConfigId`, `status`, `from`, `to` (ISO 8601 startedAt range); paginated newest-first (`startedAt DESC`); `pageSize` capped server-side at 200. Validation via `ListSyncRunsQuery` DTO (class-validator: `IsMongoId`, `IsIn(RUN_STATUSES)`, `IsDateString`, `IsInt/IsPositive`)
- [x] `GET /sync-runs/:id` returns the full doc (counts + errors + workerId + heartbeatAt + optional `parentRunId`/`metadataSnapshotId`). `ObjectIdPipe` rejects malformed ids with 400; missing id → 404
- [x] `POST /sync-runs/:id/retry` creates a new run with `parentRunId=:id` and `triggeredBy='retry'`. Pre-checks: `404` when parent missing, `400` when parent is still `running`, `404` when the parent's `job_config` was deleted. On `409` the executor reported a concurrent run for the job
- [x] **Retry semantics**: `SyncExecutorService.execute` was extended with `options.parentRunId` — `insertRunning` includes it in the new doc. The executor re-loads the CURRENT `job_config` via `findById(jobConfigId)`; it does not freeze a snapshot from the parent run (matches P002 §12.2 — admins fix configs, then retry)
- [x] List response is shape `{ items, total, page, pageSize }`; `SyncRunSummary` deliberately omits `errors`/`workerId`/`heartbeatAt` to keep list payloads small. `SyncRunDetail` extends `SyncRunSummary` with the full set
- [x] E2E (`sync-runs.controller.e2e-spec.ts`, 17 cases): 401 on all 3 endpoints, GET empty list, filter by jobConfigId+status, page/pageSize + 200 cap, invalid status / malformed ObjectId → 400, startedAt range filter, GET detail 404 / 400 / happy path with errors, retry 404 / 400 (in-flight) / 404 (deleted job) / happy path (new run with parentRunId + triggeredBy=retry) / 409 (concurrent run)

**Outcome**: Admins can list and inspect every sync run from the API, and retry any finished one — the new run picks up the current job_config (so config fixes take effect immediately). All three endpoints are gated by the existing `ApiKeyGuard`.

### T-H02 — RawRecords API

- [x] `RawRecordController` (`src/domain/raw-record/raw-record.controller.ts`) — lives inside the `raw-record` domain folder (no DI cycle since it only needs `RawRecordRepository`). Registered in `RawRecordModule.controllers`
- [x] `GET /raw-records` — `jobConfigId` is **required** (every list scan is scoped per-job to use the `(jobConfigId, recordKey)` unique index efficiently). Optional filters: `status` (active/deleted), `recordKey` (exact match — substring would require a text index and `recordKey` is the natural lookup), `runId` (matches OR across `firstSeenRunId / lastUpdatedRunId / deletedInRunId` — "show me everything this run touched"). Paginated newest-touched-first (`lastSeenAt DESC`); `pageSize` capped server-side at 200
- [x] `GET /raw-records/:id` — returns the full doc including `payload`. 404 on missing, 400 on malformed id (`ObjectIdPipe`)
- [x] List response shape: `{ items: RawRecordSummary[], total, page, pageSize }`. **`RawRecordSummary` deliberately omits `payload`** — list payloads stay light even when records contain large JSON. `RawRecordDetail` extends `Summary` with `payload` + `payloadRef` + `createdAt`
- [x] `RawRecordRepository.list(query)` added — builds the `Filter<RawRecordDoc>` with optional `$or` for `runId`, runs `find().sort({lastSeenAt:-1}).skip().limit()` in parallel with `countDocuments` via `Promise.all`. `findById(id)` added for the detail endpoint
- [x] DTO `ListRawRecordsQuery` (class-validator: `@IsMongoId()` on the required `jobConfigId`, `IsIn(RAW_RECORD_STATUSES)`, optional `@IsString()` recordKey, optional `@IsMongoId()` runId, paged ints)
- [x] E2E (`raw-records.controller.e2e-spec.ts`, 15 cases): 401 on both endpoints, GET 400 when `jobConfigId` missing / malformed / status invalid, empty page, jobConfigId scope isolation, status filter, exact-match recordKey, runId filter matches all three role columns, page/pageSize + 200 cap, payload omitted from list, detail 404 / 400 / happy path with full payload

**Outcome**: Operators can inspect raw_records per job_config, drill into one record's payload, and answer "what did this sync_run change?" without DB shell access. Payload is excluded from list responses to keep the endpoint usable on very wide rows.

### T-H03 — SourceMetadata API

- [x] `SourceMetadataController` (`src/domain/source-metadata/source-metadata.controller.ts`) — lives inside the `source-metadata` domain folder (no DI cycle). Registered in `SourceMetadataModule.controllers`
- [x] `GET /source-metadata` — `jobConfigId` is **required** (snapshots are per-job). Optional filter `schemaHash` (exact match — useful for "show me every run that saw schema X"). Paginated newest-detected first (`detectedAt DESC`); `pageSize` capped server-side at 200
- [x] `GET /source-metadata/latest?jobConfigId=...` — convenience for the common "what schema is this job currently seeing?" lookup; returns 404 if no snapshot recorded yet. **Declared BEFORE `:id`** in the controller so Nest's route matching doesn't try to coerce `latest` through `ObjectIdPipe`
- [x] `GET /source-metadata/:id` — returns the full doc including `schema.fields` + `schema.raw`. 404 on missing, 400 on malformed id
- [x] Response shapes: `SourceMetadataSummary` deliberately exposes only `fieldCount` (not the full `schema`) — list payloads stay light when schemas are wide. `SourceMetadataDetail` extends `Summary` with `schema`. Both surface `syncRunId` so the UI can deep-link from a snapshot back to the run that detected it
- [x] `SourceMetadataRepository.list(query)` added (filter jobConfigId required + optional schemaHash, sort `detectedAt:-1`, `Promise.all([find, count])`); `findById(id)` added for the detail endpoint. Existing `findLatest()` is reused unchanged
- [x] DTOs `ListSourceMetadataQuery` + `LatestSourceMetadataQuery` (class-validator: `@IsMongoId()` on required `jobConfigId`, optional `@IsString()` schemaHash, paged ints)
- [x] E2E (`source-metadata.controller.e2e-spec.ts`, 16 cases): 401 on all 3 endpoints, list 400 (missing/malformed jobConfigId), list empty, list jobConfigId scope isolation, schemaHash filter, sort + fieldCount + schema omitted, pageSize 200 cap, latest 400 (missing jobConfigId) / 404 (none yet) / happy path with full schema, detail 404 / 400 / happy path with `schema.fields` + `schema.raw`

**Outcome**: Operators can answer "what schema is this job currently seeing?", browse the history of schema changes for a job, and inspect any one snapshot's full field list. Combined with `source_metadata.insertIfNew` deduping by `(jobConfigId, schemaHash)`, the list endpoint also serves as a schema-drift audit trail.

### T-H04 — Health endpoints

- [x] `HealthController` (`src/services/health/health.controller.ts`) was **scaffolded back in T-A02** as part of the initial service skeleton and renamed from `health-check/` → `health/` along the way. Matches P002 §11 exactly: `GET /health` (liveness, returns `{status: 'ok'}` without touching Mongo) + `GET /health/ready` (readiness, pings Mongo via `client.db().admin().ping()`, returns `{status: 'ready', mongo: 'connected'}` or `503 ServiceUnavailableException` with `{status: 'not-ready', mongo: 'disconnected', error}`)
- [x] Both endpoints carry `@Public()` so `ApiKeyGuard` does NOT challenge them — kube probes / load balancers should never need an API key. Verified by the existing happy-path coverage in `app.e2e-spec.ts` (anonymous GET → 200)
- [x] Added `health.controller.spec.ts` (4 cases) to close the gap on the **failure path**: liveness stays independent of Mongo even when ping rejects (asserted `ping` was never called); readiness returns 503 with `mongo: 'disconnected'` when ping throws; non-Error rejections are coerced via `String(err)` so the response body always has a `string` `error` field

**Outcome**: K8s/load-balancer probes hit `/health` (cheap, no DB) and `/health/ready` (Mongo-dependent) without API keys, get a 503 with a useful payload when the DB is gone, and never see liveness fail just because Mongo flaps. Phase H complete.

---

## Phase I — Polish & deploy (audit + cross-cut)

### T-I01 — Swagger docs cross-cut

- [x] Audit: every controller (`HealthController`, `IndexController`, `JobConfigController`, `SecretController`, `SourceFilesController`, `TriggerController`, `SyncRunsController`, `RawRecordController`, `SourceMetadataController`) carries `@ApiTags` + `@ApiOperation`; every DTO field carries `@ApiProperty` / `@ApiPropertyOptional` with description (already in good shape from each phase's individual scaffolding work)
- [x] Enriched `main.ts` Swagger config: longer `setDescription` with the API-key contract + pointer to the design docs; `addServer('http://localhost:${port}', 'Local dev')`; `addApiKey` security scheme now carries a description; **explicit `addTag()` calls for all 7 phase-1 tags** with one-line summaries so the Swagger UI landing page is self-documenting instead of an alphabetical wall
- [x] Filled in bare `@ApiOkResponse() / @ApiNotFoundResponse() / @ApiConflictResponse()` decorators on `SourceFilesController` (5 endpoints) — every response now has a 1-line description; download endpoint also marked `@ApiProduces('application/octet-stream')`
- [x] **Smoke test (`swagger.e2e-spec.ts`, 30 cases) builds the OpenAPI document in-process** (`SwaggerModule.createDocument`, no HTTP — supertest doesn't pick up the Swagger middleware cleanly in the testing harness) and asserts: (a) title + version + api-key security scheme are present, (b) all 7 tags exist, (c) every one of the 27 phase-1 endpoint paths is documented with a non-empty `summary` + at least one tag (table-driven so adding a controller forces an update here), (d) every non-Service operation carries `security: [{ 'api-key': [] }]`
- [x] **Tag inventory** (matches `DocumentBuilder.addTag` in `main.ts`): `Service` (public probes + identity), `Job configs` (CRUD + manual trigger), `Secrets` (encrypted credentials), `Source files` (GridFS uploads), `Sync runs` (history + retry), `Raw records` (synced data store), `Source metadata` (schema snapshots / drift audit)

**Outcome**: Swagger UI at `/api-docs` now shows a self-describing landing page with tag groupings and the API-key contract called out. The smoke test means future endpoints can't ship without showing up in the docs — and the api-key requirement on non-Service operations is enforced by test rather than convention.

### T-I02 — README

- [x] Rewrote `services/ax-data-integration/README.md` from a 36-line stub into a complete onboarding doc. Sections: **Quick start** (copy-pasteable `.env` with a base64 placeholder + the `openssl rand -base64 32` recipe to replace it; smoke-test `curl` commands), **Scripts table** (mirrors `package.json` + repo-root `pnpm dev:di` alias + single-test recipe), **Architecture summary** (ASCII diagram of scheduler → executor → adapter / Mongo / GridFS with the 5 key design decisions called out — DB-state lock, heartbeat sweep, per-job identity, AES-GCM with rotation, no queue), **Source adapters table** (7 adapters with `source.type` keys + drivers + per-adapter notes — oracle's thin-mode default is the standout), **Identity strategies table** (4 strategies + when-to-use + caveats — `hash` semantics flagged loud), **API surface table** (7 tag groups → URL prefixes + the public/api-key split), **Environment variables** (split into Required / Optional with defaults, plus a Key-rotation note explaining the `_V<N>` envelope), **Health checks** + **Design documentation** links
- [x] No code changes; build + lint still clean. The Quick-start section assumes a developer has Mongo running locally — single-node on-prem norm. The `INTEGRATION_MASTER_KEY_V1` placeholder (`AAAA…=`) is a length-44 base64 string that passes the `joi` schema, so a new dev can boot the service before they have a real key generated — explicit caveat in the README that this is a fill-me-in default

**Outcome**: A new engineer (or operator) can clone, copy the `.env`, run `pnpm dev:di`, and have the service up + `/health` green in under 5 minutes — without reading P002. The Architecture/API-surface tables give them enough context to know where to start changing things.

### T-I03 — Multi-stage Dockerfile

- [x] `services/ax-data-integration/Dockerfile` — 4-stage BuildKit-only build (`# syntax=docker/dockerfile:1.7`). Build context is **the repo root** (because pnpm workspace + shared packages live above the service); built via `docker build -f services/ax-data-integration/Dockerfile -t ax-data-integration:local .`
- [x] **Stage 1 `base`** (`node:22-alpine`) — enables corepack + activates `pnpm@10.33.0` (matches the repo's `packageManager` setting via the lockfile). Shared by builder + deployer
- [x] **Stage 2 `builder`** — copies the lockfile + every package.json individually first, then `pnpm install --frozen-lockfile --filter @ax-cowork/shared --filter ax-data-integration...` with `--mount=type=cache,id=pnpm-store,target=/pnpm/store` so the pnpm store is cached across builds. Source copied next, then `pnpm --filter @ax-cowork/shared build && pnpm --filter ax-data-integration build`. Layer order keeps the install cacheable across source-only edits
- [x] **Stage 3 `deployer`** — `pnpm deploy --filter ax-data-integration --prod /deploy`. This is the key step: pnpm resolves the `workspace:*` reference to `@ax-cowork/shared` against the already-built `dist/`, strips devDependencies (mongodb-memory-server, @nestjs/cli, eslint, jest, ts-jest, supertest, type packages), and emits a flat node_modules in `/deploy` ready to ship
- [x] **Stage 4 `runner`** (`node:22-alpine`, fresh layer — no pnpm, no source tree, no lockfile) — runs as the built-in `node` user (uid 1000), copies just `/deploy/{dist,node_modules,package.json}` with `--chown=node:node`, exposes 3012, sets `NODE_ENV=production` + `PORT=3012`, `CMD ["node", "dist/main"]`
- [x] **HEALTHCHECK** uses Node 22's built-in `fetch` against `/health` (no extra package, no curl/wget needed): `node -e "fetch(...).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"`. 30s interval, 5s timeout, 10s start period, 3 retries — matches typical k8s probe values
- [x] **No native deps**: oracledb defaults to thin mode (see T-G06), all other adapters are pure JS — alpine is safe and tiny. Saved roughly 500 MB by not needing Oracle Instant Client (the alternative path explicitly rejected in T-G06)
- [x] Created **repo-root `.dockerignore`** — excludes `node_modules`, `dist`, all `*.spec.ts` + `*.test.ts` + `test/`, every `.env*`, `aTaskMngmt.local`, every `CLAUDE.md` (Claude-only context), `services/ax-data-integration/docs` (big design docs not needed at runtime), `.git`, editor noise, other Dockerfiles. Trims the build context from gigabytes to single-digit MB; secret leakage via `.env` is impossible by construction
- [x] **`.npmrc*` glob copy** kept in the Dockerfile (BuildKit no-match-glob is non-fatal) so a future private-registry `.npmrc` Just Works without touching the Dockerfile
- [x] **No `docker build` smoke-run in this task** — actual end-to-end deploy validation lives in T-I05 (`docker-compose` up + curl `/health`)

**Outcome**: A reproducible production image that ships only what the service needs at runtime. `pnpm deploy` cleanly handles the workspace-monorepo edge cases (workspace:\* → real package, devDeps stripped). The image is small enough that the next steps (T-I04 docker-compose template, T-I05 smoke test) can iterate cheaply.

### T-I04 — docker-compose template

- [x] `services/ax-data-integration/docker-compose.yml` — two services: `mongo` (image `mongo:7`, named container `ax-di-mongo`, healthcheck via `mongosh --eval "db.runCommand({ ping: 1 }).ok"` every 10s, 20s start-period) and `ax-data-integration` (built from the T-I03 Dockerfile with `context: ../..` so the build sees the full pnpm workspace, `depends_on: mongo: condition: service_healthy` so the app never boots against a half-ready DB)
- [x] Service-to-mongo URL is hardcoded to `mongodb://mongo:27017` (compose DNS) — the user's `MONGO_URI` env is intentionally NOT used here; the host-side .env supplies _secrets_ (API keys, master key) but the network wiring is owned by compose. `MONGO_DB_NAME` falls back to `ax_data_integration` so a fresh `up` works without touching `.env`
- [x] Host port mapping uses overridable defaults: `${SERVICE_HOST_PORT:-3012}:3012` + `${MONGO_HOST_PORT:-27017}:27017` — multiple stacks can co-exist on one host with no edit
- [x] **Compose-level required-vars guard** via the `${VAR:?error message}` syntax — `INTEGRATION_API_KEYS` and `INTEGRATION_MASTER_KEY_V1` are non-defaultable: compose refuses to start with a clear error if `.env` is missing or unset (vs. the silent-failure trap of `${VAR:-}` with an empty default)
- [x] Mongo data persists in named volume `ax-di-mongo-data` — survives `docker compose down` (only `down -v` drops it)
- [x] Created `services/ax-data-integration/.env.compose.example` — copy-to-`.env` template with the two required vars at the top, every optional var commented out at its default (so changes are diff-visible), and the `openssl rand -base64 32` recipe inline next to `INTEGRATION_MASTER_KEY_V1`
- [x] README updated: added a "Run via Docker compose" subsection between Quick start and Scripts pointing at the new compose file + the .env.example flow
- [x] **Validated**: `docker compose config --quiet` passes locally — confirms YAML + env interpolation syntax. End-to-end `up --build` smoke is T-I05's job (intentionally not run here)

**Outcome**: A single `docker compose up --build` from the service folder brings up a working Mongo + service pair, with secrets enforced by compose-level guard rails. New operators can be productive in 3 commands (`cp`, edit, `up`) without touching pnpm or Node locally.

### T-I05 — Smoke test local docker-compose deploy

- [x] **Bug found and fixed during smoke**: pnpm v10 changed `pnpm deploy` semantics — it now requires `inject-workspace-packages=true` per workspace or it errors out with `ERR_PNPM_DEPLOY_NONINJECTED_WORKSPACE`. Fixed by passing `--legacy` to the deploy step in the T-I03 Dockerfile (opts back into pre-v10 behavior, correct since the repo doesn't use injected workspace deps). This would have shipped silently if T-I05 had skipped a real `up --build`
- [x] End-to-end smoke ran on host: generated test `.env` with `openssl rand -base64 32` master key + non-default host ports (`SERVICE_HOST_PORT=3912`, `MONGO_HOST_PORT=27917` to avoid collisions), `docker compose build` (~9.3s for `nest build` after install), `docker compose up -d` → both containers healthy (mongo via its `mongosh ping` healthcheck, service via the Dockerfile HEALTHCHECK fetching `/health`)
- [x] Public endpoints: `GET /health` → `{"status":"ok"}` ✓, `GET /health/ready` → `{"status":"ready","mongo":"connected"}` ✓ (proves the service-to-mongo network wiring + container DNS works), `GET /` → `{"name":"ax-data-integration","status":"ok"}` ✓
- [x] Auth gate: `GET /job-configs` without key → `401` ✓; with `x-api-key: smoke-key-abc123` → `200 {"items":[],"total":0,"page":1,"pageSize":50}` ✓ (proves `INTEGRATION_API_KEYS` env propagated correctly)
- [x] Swagger surface live: `GET /api-docs` → `200 text/html` ✓, `GET /api-docs-json` returned **7 tags** (Service / Job configs / Secrets / Source files / Sync runs / Raw records / Source metadata) and **21 paths** ✓ (matches the in-process count from T-I01's `swagger.e2e-spec.ts`)
- [x] **End-to-end crypto round-trip**: `POST /secrets {name, type:'api', plaintext:'hunter2'}` → `200 {id, keyVersion:1, …}` ✓ (proves AES-GCM master key was loaded from compose `.env` and the encrypt path works); `GET /secrets` list returned **0 occurrences of `hunter2`** ✓ (proves plaintext never leaks via read endpoints — T-B01's security guarantee verified end-to-end)
- [x] Resource baseline at idle: ax-di-service ~84 MB RSS / 0.21% CPU; ax-di-mongo ~79 MB RSS / 0.66% CPU. Image size **455 MB** (alpine + node + node_modules — acceptable for an internal service; further shrink would require a distroless base or `node:slim` and isn't worth the build complexity in phase 1)
- [x] Teardown clean: `docker compose down -v` removed both containers + the `ax-di-mongo-data` volume + the network; test `.env` deleted from the working tree

**Outcome**: The full phase-1 service stands up end-to-end via Docker compose, every external surface (health probes, API-key auth, Swagger, secret crypto) verified live. Phase I complete. The pnpm-v10 `--legacy` flag fix in the Dockerfile would have escaped review if not for this smoke step.

---

## Phase J — Tests (cross-cut audit)

### T-J01 — Audit: crypto + computeRecordKey unit tests

- [x] **Existing coverage was already substantial** (audited line-by-line, didn't need to write a new file):
  - `src/acore/crypto/secret.service.spec.ts` — 8 cases: UTF-8 round-trip (incl. Vietnamese + JSON), random IV uniqueness, key-version stamping, multi-version rotation decrypt, missing-version throw, ciphertext tamper throw, auth-tag tamper throw, wrong-key throw
  - `src/acore/crypto/secret.loader.spec.ts` — 5 cases: multi-version load + currentVersion select, non-positive-integer currentVersion throw, missing current throw, wrong-length decoded buffer throw, ignore-noise env vars
  - `src/workers/compute-record-key.spec.ts` — 18 cases across all 4 identity strategies + stableStringify
- [x] **Gaps filled** (5 strategic additions, brings total to 39 in these three suites):
  - `secret.service.spec.ts` — **envelope contract test**: pin the exact shape `{ciphertext, iv, authTag, keyVersion}` + GCM IV length (12 bytes) + auth tag length (16 bytes). Any change here is a storage-format break that affects every secret at rest — this test forces an intentional bump
  - `compute-record-key.spec.ts` composite — Date field value serializes via ISO string; object field value serializes via `stableStringify` (deterministic across insertion order). Both paths were live in `primitiveToString` but untested — composite keys built from object fields had no regression guard
  - `compute-record-key.spec.ts` stableStringify — **recursive sort inside array elements** (critical: hash strategy hashes the full payload, and nested-object insertion order must not change the hash, otherwise dedup breaks silently); **undefined-value omission pinned** (`{a:1, b:undefined}` collides with `{a:1}` — documented + tested so any future "surface undefined as null" change has to update both)
- [x] All 39 cases pass; full suite 16 unit / 158 tests ✓, lint ✓

**Outcome**: The two highest-blast-radius modules (crypto envelope + identity key derivation) now have contract-level pins on every observable behaviour — shape, escaping rules, serialization-order determinism, recursive sort, undefined omission. Future refactors that drift these will break a test instead of corrupting persisted data.

### T-J02 — E2E: Excel job → manual trigger → assert counts

- [x] **Existing context**: `sync-executor-main-loop.e2e-spec.ts` (T-E04) already covered initial-insert / unchanged / update / schema dedup / threshold abort / partial / missing-file paths — but **in-process** via `executor.execute()` calls, bypassing controllers + ApiKeyGuard + DTO validation. T-J02 explicitly asks for the HTTP path through `POST /job-configs/:id/trigger`
- [x] New file `test/excel-trigger-flow.e2e-spec.ts` (4 cases) — the full HTTP loop via supertest with `x-api-key: e2e-test-key` on every request:
  - **upload → create job → trigger → assert counts**: builds an Excel buffer with `exceljs`, POSTs to `/source-files`, POSTs `/job-configs` (rest of body assembled per the create DTO contract — `source.type=excel`, `sourceFileId` from upload, `schedule.cronExpression`, `identity.strategy=primary-key fields=[id]`), POSTs `/job-configs/:id/trigger`, then asserts the response is `{runId, status:'success'}`. Verifies the executor's counts via `GET /sync-runs/:id` — `{read:3, inserted:3, updated:0, unchanged:0, deleted:0, errors:0}` — and the resulting `raw_records` via `GET /raw-records?jobConfigId=…` (3 actives, version 1, recordKey ∈ `['1','2','3']`)
  - **re-trigger on unchanged file**: 2× trigger of the same file → second run's `counts = {read:2, inserted:0, updated:0, unchanged:2, deleted:0}`. Validates raw_records `version` stays at 1 (no payload change)
  - **source_metadata snapshot reachable via `/source-metadata/latest`**: trigger → assert `latest.schema.fields` matches the Excel headers + `schemaHash` is a 64-char sha256 hex
  - **raw_records detail returns adapter cell values**: assert `payload.id=42`, `payload.name='Alice'`, `payload.amount=100` after one row sync — pins down "what the adapter emitted is what GET /raw-records/:id returns"
- [x] Helpers `buildExcelBuffer / uploadExcel / createExcelJob` keep the test bodies readable. All response bodies cast through typed interfaces (`UploadResp / CreateJobResp / TriggerResp / RunDetail / RawList / RawDetail / MetadataLatest`) to avoid the `no-unsafe-member-access` lint trap

**Outcome**: The whole user-facing flow — upload, create, trigger, inspect — is verified via HTTP. Combined with the in-process executor coverage in T-E04, the Excel sync path is now covered at both the unit-of-orchestration level and the public-API contract level. 4 e2e suites passing; total e2e count: 17 suites / 186 tests (+4 from this task).

### T-J03 — E2E: two syncs detect insert / update / unchanged / delete

- [x] **Existing context**: `sync-executor-main-loop.e2e-spec.ts` (T-E05) already covered delete detection (3-row → 2-row file) in-process — but isolated to unchanged + deleted only, not the full quad. T-J03 wants all four outcomes resolving in **one** follow-up run via the HTTP path
- [x] Extended `test/excel-trigger-flow.e2e-spec.ts` with `describe('two syncs detect insert / update / unchanged / delete in one run')`, 2 cases (file now has 6 total):
  - **All four outcomes in one run**: run 1 inserts rows `[1, 2, 3]`; PATCH the job's `source.config.sourceFileId` to a v2 file `[1 (amount 100→150), 2 (unchanged), 4 (new)]` via `PATCH /job-configs/:id`; trigger run 2; assert `counts === {read:3, inserted:1, updated:1, unchanged:1, deleted:1, errors:0}`. Then verify per-record state via `GET /raw-records?…&status=…`: 3 active (`1, 2, 4`), 1 deleted (`3`). Per-record version assertions: rec#1 v=2 (bumped on update), rec#2/3/4 v=1 (unchanged / delete-doesn't-bump / newly inserted). **runId filter cross-check**: `GET /raw-records?runId=<run2>` returns exactly `[1, 3, 4]` — proves the `$or(firstSeenRunId, lastUpdatedRunId, deletedInRunId)` filter in T-H02 matches lineage; rec#2 correctly absent because unchanged only touches `lastSeenAt`, not `lastUpdatedRunId`
  - **`detectDeleted: false` honoured via HTTP**: create the job with `options.detectDeleted: false` through the create DTO, run 1 with 3 rows, PATCH to a 2-row file, run 2 → `counts.deleted === 0` and `counts.unchanged === 2`; rec#3 stays `status: 'active'` in `/raw-records`
- [x] `patchSource(jobId, fileId)` helper added to keep the two tests readable

**Outcome**: Insert / update / unchanged / delete classification is now pinned at the HTTP level — and the `runId` filter on `/raw-records` (T-H02) is verified to correctly correlate records back to the run that touched them in any of the three lineage roles. The `detectDeleted=false` flag is also reachable + correct via the create DTO, closing the option-flag end-to-end path. 2 e2e suites passing; total e2e count: 17 suites / 188 tests (+2 from this task).

### T-J04 — E2E: stale-worker recovery flow

- [x] **Real process kill is not feasible** from a Jest worker — forking + killing a child Node process would make the test order-dependent and flaky. The recovery path is identical regardless of _how_ the worker died: it leaves behind a `sync_runs` doc with `status='running'` and a `heartbeatAt` that never advances again. The test simulates this state directly by inserting a fake `running` doc and backdating its heartbeat 10 min into the past (well past the 120s default `STALE_HEARTBEAT_TIMEOUT_MS`). Documented inline in the test header
- [x] New file `test/stale-recovery-flow.e2e-spec.ts` (3 cases) — boots full `MainModule`, uses HTTP for triggers:
  - **Lock-held → sweep → free**: create real job_config; insert ghost `running` doc with backdated heartbeat; **`POST /job-configs/:id/trigger` returns 409** (partial-unique `(jobConfigId, status='running')` lock still held by ghost); call `sweeper.sweepOnce('manual')` (same method the scheduler ticks) → returns 1, ghost flipped to `status='stale'` + `finishedAt` + one `heartbeat` error entry; retrigger → **200 with a new `runId`** ≠ ghost id; final `countDocuments({jobConfigId})` = 2 (ghost + fresh)
  - **No false positives**: insert a _fresh_ running doc (no backdate), `sweepOnce()` returns 0, doc still `status='running'`
  - **Recovered state visible via list**: after the sweep+retrigger sequence, `GET /sync-runs?jobConfigId=…` returns `total=2` with statuses `['failed', 'stale']` sorted — fresh run is 'failed' for the standard no-REST-adapter reason from other e2e suites, ghost is 'stale' as expected. Cross-checks the T-H01 list endpoint correctly surfaces the recovered run
- [x] All 3 cases pass; full e2e count: 18 suites / 191 tests (+3 from this task)

**Outcome**: The full crash-recovery flow is verified end-to-end at the HTTP boundary, including the user-visible window where a trigger gets a clean 409 because the previous run's lock is still held. The simulation (insert + backdate) is a faithful stand-in for an actual process kill — sweeper behaviour is identical and the assertions exercise the same Mongo state. Phase J complete.

---

## Post-phase review fixes (2026-05-21)

Acted on three findings from the cross-cut audit immediately after Phase J closed; carried forward into phase-2 open items:

- **(a) Defense-in-depth for `SecretsService.delete`** — the controller (`SecretsController.delete`) already had the referential check (with e2e coverage at `secret.controller.e2e-spec.ts:113`), but `SecretsService.delete` carried only a stale `TODO(T-C01)` and no service-level guard. Mirrored the `SourceFilesService.delete` pattern by injecting `JobConfigRepository` into `SecretsService`, calling `countByCredentialsRef(id)` → throw `ConflictException` on `refs > 0`, then **removed the now-redundant check from the controller** so any non-HTTP caller (worker, future CLI) gets the same protection automatically. `test/secret.e2e-spec.ts` constructor updated to pass the new dep. Stale TODO removed
- **(b) Pagination constants deduplicated** — `DEFAULT_PAGE_SIZE = 50` + `MAX_PAGE_SIZE = 200` were defined independently in 4 places (`job-config.service.ts`, `raw-record.controller.ts`, `source-metadata.controller.ts`, `sync-runs.controller.ts`). Extracted to a single source of truth at `src/acore/config/pagination.ts` with a `resolvePagination({page, pageSize})` helper that returns `{page, pageSize, skip, limit}` — clamps `page >= 1` and `pageSize <= MAX_PAGE_SIZE` defensively (matches the strictest of the four prior variants). All 4 callsites now use the helper. Net: ~24 lines deleted, 1 module added
- **(d) Two phase-2 items added to the "Open items outside phase 1 WBS" list**: (1) derive a real principal from the authenticated API key (replaces the two `// TODO` hardcoded `'api-key'` literals in `JobConfigController` + `SecretsController` — acceptable phase-1 simplification given small shared internal key set, but masks audit attribution); (2) wire `SourceAdapter.stream` watermark column for incremental DB syncs (the `TWatermark` generic + `options.watermark` already exist in the interface from T-D01 as a forward-compat slot; phase 2 implements the substitution + per-job high-water-mark storage)

**Outcome**: Final phase-1 state — 16 unit suites / 158 tests + 18 e2e suites / 191 tests passing; build + lint clean; no stale TODOs in `src/` related to fixed items; no behavioural regressions (all pre-existing tests pass against the refactored layout).

---

## Phase I — Polish & deploy (T-I01 → T-I05)

| ID    | Status | Task                                                    | Refs              | Depends      |
| ----- | ------ | ------------------------------------------------------- | ----------------- | ------------ |
| T-I01 | `[x]`  | Swagger docs for every endpoint (with DTO descriptions) | P002 §11          | T-H01..T-H04 |
| T-I02 | `[x]`  | README — quick start, env vars, architecture summary    | -                 | T-I01        |
| T-I03 | `[x]`  | Multi-stage Dockerfile                                  | P002 §7 (Phase 1) | T-G06        |
| T-I04 | `[x]`  | docker-compose template (Mongo + service)               | -                 | T-I03        |
| T-I05 | `[x]`  | Smoke test local docker-compose deploy                  | -                 | T-I04        |

---

## Phase J — Tests (T-J01 → T-J04)

Tests are written IN PARALLEL with each phase above — not deferred to the end. Phase J is an aggregate list, not a sequential one.

| ID    | Status | Task                                                           | Refs | Depends      |
| ----- | ------ | -------------------------------------------------------------- | ---- | ------------ |
| T-J01 | `[x]`  | Unit tests for crypto (T-B01) + computeRecordKey (T-D03)       | -    | T-B01, T-D03 |
| T-J02 | `[x]`  | E2E: create Excel job → manual trigger → assert counts         | -    | T-F03, T-D02 |
| T-J03 | `[x]`  | E2E: two syncs detect correct insert/update/delete             | -    | T-E05        |
| T-J04 | `[x]`  | E2E: kill process mid-run → restart → stale sweeper handles it | -    | T-F01        |

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
- [ ] **Derive a real principal from the authenticated API key** (hash / index) instead of the literal `'api-key'` used by `JobConfigController` + `SecretsController`. Acceptable for phase 1 (small shared internal key set) but masks audit attribution. Tracked in two `// TODO` comments
- [ ] **Wire `SourceAdapter.stream` watermark column** for incremental DB syncs ([P002 §6.2 / §7](./docs/P002-design-proposal.md)). The generic parameter `TWatermark` + `options.watermark` are already part of the `SourceAdapter<TConfig, TWatermark>` interface — phase 1 ships every adapter as full-scan only. Phase 2 work: thread `watermarkColumn` + `${watermark}` placeholder substitution through Postgres / MySQL / MSSQL / Oracle / REST adapters, persist the high-water mark per `(job_config, identity)` in a new collection, resume from it on each run
- [ ] **Auto-run `ensureIndexes()` on service boot** instead of relying on the operator to run `node dist/migrate-indexes` after every deploy. Currently the service starts and serves traffic without the partial-unique `(jobConfigId, status='running')` index — silently allows overlapping runs until someone notices. Discovered while building the manual-smoke script (S6/S7 failed when the migration step was skipped). Trade-off: auto on `onApplicationBootstrap` adds boot-time DB writes (~19 indexes) and a cold-start dependency on Mongo being ready; document loudly + add a `/health/ready` extension that verifies critical indexes exist as a middle ground
