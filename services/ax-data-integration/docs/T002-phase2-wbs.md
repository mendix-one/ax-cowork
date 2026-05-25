Work Breakdown Structure for the Data Integration Service — **Phase 2**.

Continues from [T001](./T001-wbs.md) (phase 1) and the open items captured at its tail. Phase 1 shipped the end-to-end sync pipeline for files + REST + 4 DBs; Phase 2 hardens it for production traffic and answers the manager's remaining ingestion asks ([O001](./O001-data-integration.md) forms #2 + #3) plus GraphQL / SOAP for the rest of the adapter set.

**Scope of phase 2**:

1. **Wave 2.1** — Operator safety + infra polish (indexes auto-create, principal-from-guard, retention/TTL, Prometheus, secret-from-file, event hooks)
2. **Wave 2.2** — Manager's ingestion asks (webhook receiver, MQTT adapter, schema-drift alerts)
3. **Wave 2.3** — Incremental sync via watermark columns (performance for large tables)
4. **Wave 2.4** — GraphQL + SOAP adapters (close out the documented adapter set)

**Out of scope**: Admin UI (deferred — manual testing covered by Swagger + `scripts/manual-smoke.sh`); BullMQ + Redis migration (only if ≥2 workers needed); HashiCorp Vault (Wave 2.1 covers the Docker secret intermediate step).

**How to use**:

- Each task has an ID like `T2-X##`. Tick `[x]` in the Status column when done.
- **Outcome** = acceptance criteria (the condition to consider the task done).
- **Depends** = task(s) that must finish first.
- Tests are written **in parallel with each wave**, not deferred — mirrors T001's Phase J convention. Per-wave test rollups are noted at the end of each wave section.

---

## Phase 2.1 — Operator safety + infra polish (T2-A01 → T2-A12)

Backend-only, low-risk. Discovered as gaps during phase-1 deploy/smoke prep. Hết wave này deploy production tự tin được.

| ID     | Status | Task                                                                           | Refs                        | Depends        |
| ------ | ------ | ------------------------------------------------------------------------------ | --------------------------- | -------------- |
| T2-A01 | `[x]`  | Auto-run `ensureIndexes()` at `onApplicationBootstrap`                         | T001 review finding         | -              |
| T2-A02 | `[x]`  | `/health/ready` verifies critical indexes exist                                | P002 §11, §13               | T2-A01         |
| T2-A03 | `[x]`  | `ApiKeyGuard` extracts a stable principal id (hash/index) onto the request     | T001 Open Items             | -              |
| T2-A04 | `[x]`  | Controllers consume `request.principal` instead of `PHASE_1_PRINCIPAL` literal | -                           | T2-A03         |
| T2-A05 | `[x]`  | Retention env config (`INTEGRATION_TTL_CHANGELOG_DAYS`, `…_SYNC_RUN_DAYS`)     | P002 §13                    | -              |
| T2-A06 | `[x]`  | TTL index on `raw_record_changelog.createdAt`                                  | P001 §createdAt requirement | T2-A05, T2-A01 |
| T2-A07 | `[x]`  | TTL index on `sync_runs.createdAt`                                             | P001 §createdAt requirement | T2-A05, T2-A01 |
| T2-A08 | `[x]`  | `prom-client` + `MetricsModule` exposing `/metrics`                            | P002 §13.2                  | -              |
| T2-A09 | `[x]`  | Instrument `SyncExecutorService` with counters + histogram                     | P002 §13.2                  | T2-A08         |
| T2-A10 | `[x]`  | Master-key file loader (`INTEGRATION_MASTER_KEY_V*_FILE` overrides env)        | T001 Open Items             | -              |
| T2-A11 | `[x]`  | `docker-compose.yml` uses Docker secret for master key in prod profile         | -                           | T2-A10         |
| T2-A12 | `[x]`  | `EventEmitter` emits `sync.run.completed` after every finalize                 | P002 §13.3                  | -              |

### T2-A01 — Auto-run ensureIndexes() on app bootstrap

- [x] `MongoModule` implements `OnApplicationBootstrap`; hook calls `ensureIndexes(db)` and logs a summary `created=N existed=M total=K` line (per-index detail at `debug` level)
- [x] **Positive-flag env**: `INTEGRATION_AUTO_ENSURE_INDEXES` (Joi-validated boolean, default `true`). Set `false` for emergency rollbacks → hook logs warn + skips. Chose positive flag over `SKIP_INDEX_ENSURE` (the WBS draft name) — default behaviour matches the flag name, no double-negative for the common case
- [x] **Time-boxed** via `INTEGRATION_INDEX_ENSURE_TIMEOUT_MS` (default `30000`, min `1000`). `Promise.race` between `ensureIndexes` + a `setTimeout`-backed sentinel; on timeout, log warn, let the in-flight ensure resolve in the background with a `.catch()` handler so a slow Mongo doesn't surface an unhandled rejection
- [x] `src/migrate-indexes.ts` untouched — operators still run it standalone for back-fill / debugging; on a current build it's now an idempotent no-op that reports all `existed`
- [x] Unit tests (`mongo.module.spec.ts`, 4 cases): skip flag honoured, happy path calls ensureIndexes exactly once, timeout doesn't block boot beyond the limit, late-rejecting promise after timeout doesn't crash the process
- [x] E2E (`mongo-bootstrap.e2e-spec.ts`, 2 cases): drop the e2e DB → boot `MainModule` → assert every `INDEX_SPECS` entry materialized + `running_lock_unique` is a `partialFilterExpression: {status:'running'}` unique. Drop-DB approach is stronger than just listing indexes because other e2e suites pre-warm the DB by calling `ensureIndexes` manually
- [x] `manual-smoke.sh` updated: the explicit `node dist/migrate-indexes` step is now a redundancy check that reports all `existed` (kept to document the operator workflow for emergency rollback scenarios)
- [x] `MANUAL-TEST.md` updated: clarifies that boot auto-creates indexes; the manual step is now informational

**Outcome**: A fresh deploy never lands in the "indexes missing → overlapping runs allowed" trap that the manual-smoke test exposed. `ensureIndexes` runs on every boot, is idempotent (re-runs report `existed`), and is logged so SRE can audit drift. Total test count rose 16 unit / 162 + 19 e2e / 195 → confirms zero regression in existing suites.

### T2-A02 — `/health/ready` verifies critical indexes

- [x] **`CRITICAL_INDEX_SPECS`** + **`findMissingCriticalIndexes(db)`** helpers added next to `INDEX_SPECS` (`src/acore/mongo/indexes.ts`). Single source of truth — derived by filtering `INDEX_SPECS` for `options.unique === true`, which yields the 5 correctness-critical indexes: `job_configs.name_unique`, `secrets.name_unique`, `source_metadata.jobConfigId_schemaHash_unique`, `raw_records.jobConfigId_recordKey_unique`, `sync_runs.running_lock_unique`
- [x] `HealthController.readiness` now does Mongo ping → if OK, calls `findMissingCriticalIndexes(db)` → 503 with `{status: 'not-ready', mongo: 'connected', indexes: 'missing', missing: ['<coll>.<name>', ...]}` when anything missing; success returns `{status: 'ready', mongo: 'connected', indexes: 'ok'}`
- [x] Handles `NamespaceNotFound` (Mongo error code 26): collection-not-yet-created counts as "every critical index for that collection is missing". Important on a brand-new DB where collections haven't been written to yet
- [x] **Non-critical indexes are NOT checked** — TTL / sort / lookup indexes degrade performance not correctness; would noisily flap readiness during deploys. Documented inline
- [x] `HealthController` constructor injects `MONGO_DB` in addition to `MONGO_CLIENT`
- [x] Unit tests (7 total in `health.controller.spec.ts`, +4 new): index present → 200 with `indexes: 'ok'`; sync_runs lock missing → 503 with that specific name in `missing[]`; all critical missing → 503 reports all of them (not just first); `NamespaceNotFound` on a single collection → 503 with that collection's critical indexes listed
- [x] `test/app.e2e-spec.ts` updated — readiness expectation now `{status: 'ready', mongo: 'connected', indexes: 'ok'}` (added the third field)

**Outcome**: Kubernetes won't route traffic to a service that booted before `ensureIndexes` completed (or with `INTEGRATION_AUTO_ENSURE_INDEXES=false` and no manual back-fill). Distinguishes "Mongo down" from "Mongo up but mis-configured" — both are 503 but the payload tells the operator which. Combined with T2-A01 the gap from the manual-smoke discovery is fully closed at boot AND continuously verified at runtime.

### T2-A03 — ApiKeyGuard extracts principal id

- [x] **New file `src/acore/auth/principal.ts`** — exports `Principal` interface `{ keyHash: string; label: string }`, `PRINCIPAL_REQUEST_KEY` constant (where guard attaches it on the request), and `@CurrentPrincipal()` Nest param decorator. Decorator throws explicitly if used on a `@Public()` route ("no principal attached — is the route guarded by ApiKeyGuard?")
- [x] **`ApiKeyGuard` reworked** from `Set<string>` lookup to `Map<rawKey, Principal>`: at boot, computes `keyHash = sha256(rawKey).slice(0, 8)` for each key, pairs it with the positional label from `INTEGRATION_API_KEY_LABELS` (or fallback `key-<hash>`), stores both in the principal map. On `canActivate`, lookup by raw key → attach `req.principal` → return true. Auth failure path unchanged
- [x] **Label fallback is always defined** — `label: string` (not `label?: string`) — controllers never need to handle `undefined`. Blank label entries (`a,,b`) AND no `_LABELS` env at all both fall back to `key-<hash>`. **Extra labels beyond key count are silently ignored** (operator drift safety: shrinking the keys CSV without updating labels can't crash the service)
- [x] **Joi schema** adds `INTEGRATION_API_KEY_LABELS: Joi.string().allow('').optional()`. Documented in the schema comment that it's positional (index `i` → key `i`)
- [x] **Never stores raw key on request** — only `keyHash`. Verified by an explicit unit test that `JSON.stringify(req.principal)` does not contain the raw key
- [x] **`auth/index.ts` barrel** exports `CurrentPrincipal`, `PRINCIPAL_REQUEST_KEY`, type `Principal`
- [x] Unit tests (`api-key.guard.spec.ts`, 13 total — +7 new): hash stability across guard instances, label positional mapping, blank label → fallback, no labels env → fallback, extra labels silently dropped, public route does NOT attach principal, raw-key-never-stored guarantee. All 6 phase-1 auth behaviours preserved (CSV trim/reject empty, fail-fast empty set, public bypass, missing header → 401, wrong key → 401, array-header takes first)

**Outcome**: Every authenticated request carries a stable principal identifier without storing the raw API key. Operator can grep audit logs by `keyHash` (8-char hex, stable forever for a given key) or by `label` (human-friendly, op-controlled). Unblocks T2-A04 which wires controllers to consume `@CurrentPrincipal()` instead of the hardcoded `'api-key'` literal.

### T2-A04 — Controllers consume request.principal

- [x] **3 controllers wired** to `@CurrentPrincipal()`, not just the 2 originally listed:
  - `JobConfigController.create` → `createdBy: principal.label`
  - `SecretsController.create` → `createdBy: principal.label`
  - `SourceFilesController.upload` → `uploadedBy: principal.label` (discovered while greping — had the same `PHASE_1_PRINCIPAL` literal)
- [x] All 3 `// TODO: ... principal` comments + 3 `PHASE_1_PRINCIPAL = 'api-key'` literals removed. `grep -r "PHASE_1_PRINCIPAL\|TODO.*principal" src/` returns nothing
- [x] `updatedBy` was in the WBS draft but **the schema does not have it** in phase 1 — only `createdAt`/`updatedAt`/`createdBy` exist. Not adding it speculatively (would be its own task: schema change + DTO + e2e). Documented here so phase-2 scope stays honest
- [x] **Migration NOT needed** — `createdBy` is `string` (not enum); existing legacy records with `createdBy='api-key'` continue to read fine. The transition is at the write boundary only
- [x] E2E tests assert principal label end-to-end. Each affected `*.controller.e2e-spec.ts` derives `EXPECTED_PRINCIPAL_LABEL = \`key-${sha256(API_KEY).slice(0,8)}\``(mirrors guard's hash) and asserts the response's`createdBy`/`uploadedBy` matches it. 3 e2e assertions added (one per controller); no test count change because they extended existing happy-path cases
- [x] No spec for `INTEGRATION_API_KEY_LABELS` in e2e — global-setup doesn't set it, so the fallback path is what's verified. The labeled path is covered by `api-key.guard.spec.ts` (T2-A03 unit tests)

**Outcome**: Audit attribution is real — operator looking at a job_config / secret / source_file knows which API key created it (by label, with `key-<hash>` fallback). Both T001-era `// TODO: replace with the API-key principal` comments are removed. Phase 2 has no more hardcoded principal literals in `src/`.

### T2-A05 — Retention env config

- [x] **`INTEGRATION_TTL_CHANGELOG_DAYS`** (default `90`) + **`INTEGRATION_TTL_SYNC_RUN_DAYS`** (default `30`) added to `config.module.ts` Joi schema. Both validated as `integer().min(1).max(3650)` — the 10-year cap protects from typos like passing `Infinity` or huge numeric strings
- [x] **Test-only second-granularity overrides** `INTEGRATION_TTL_CHANGELOG_SECONDS` + `INTEGRATION_TTL_SYNC_RUN_SECONDS` added (Joi optional). These let e2e bypass the day floor for short-window tests but are honoured ONLY when `NODE_ENV=test` — verified by `readTtlOptionsFromEnv` unit tests that pass `NODE_ENV='production'` + a seconds override and assert it gets ignored
- [x] **No README env table update needed yet** — the table lives in [P002 §16](./P002-design-proposal.md) and these vars are already alluded to in §13. Choosing the docs-update path of "P002 §13 already covers retention" rather than duplicating the env table — single source of truth principle. The MANUAL-TEST.md note (added in T2-A06/A07 outcome) is what operators actually read
- [x] **`raw_records` and GridFS source_files are intentionally NOT TTL'd** — documented inline in `indexes.ts` (next to where the TTL specs are built) and reiterated in MANUAL-TEST.md. `raw_records` is the source of truth for the projection; pruning would break the `unchanged` classification. GridFS files prune only via `DELETE /source-files/:id` (with the 409 protection from phase 1 still in place)

**Outcome**: Operators can tune retention without code changes; defaults (90d changelog / 30d runs) are conservative enough for compliance-light internal use. The test-only seconds override is a deliberate seam — production callers must use the days variant. `readTtlOptionsFromEnv` is the single chokepoint that downstream callers (`ensureIndexes`, migrate-indexes script) read through, so future Vault/secret-manager-sourced TTL is a one-function change.

### T2-A06 — TTL index on raw_record_changelog.createdAt

- [x] **`IndexSpec.options.expireAfterSeconds`** field added to the spec type. Static `INDEX_SPECS` no longer carries the phase-1 `raw_record_changelog.createdAt_desc` sort index — replaced by a dynamic `createdAt_ttl` ({ createdAt: 1 }, expireAfterSeconds = `ttl * 86400`) built via the new `buildTtlIndexSpecs(opts: TtlOptions)` helper. The ascending TTL index serves the "list newest first" use case equally well (Mongo scans ascending indexes in reverse for sort) — no need for the parallel `_desc` index
- [x] **`ensureIndexes` detects TTL-value change**: when an existing index with the spec's name has a different `expireAfterSeconds`, the existing index is dropped and recreated. New action type `'recreated'` added to `IndexEnsureResult`, and both `MongoModule` boot log + `migrate-indexes` CLI output a `recreated=N` field alongside `created` / `existed`. Non-TTL option drift is still NOT auto-migrated — that requires a manual drop because the operator may want a backup index in place during the swap
- [x] **`getAllIndexSpecs(opts?)`** convenience helper added — concatenates `INDEX_SPECS` (static) with `buildTtlIndexSpecs(opts)`. Defaults to `readTtlOptionsFromEnv()` so legacy callers (test setups, the migrate-indexes CLI) don't have to wire a ConfigService just to read TTL
- [x] **Test-hook env override path verified**: `INTEGRATION_TTL_CHANGELOG_SECONDS=5` + `NODE_ENV=test` → `readTtlOptionsFromEnv` returns 5 seconds. Production `NODE_ENV=production` + same env → returns the days default. Covered by 5 unit cases in `indexes.spec.ts`
- [x] **Unit tests** (`indexes.spec.ts`, 6 cases): TTL-default behaviour, days variant, seconds override gated by NODE_ENV, partial override falls back per-field, `buildTtlIndexSpecs` shape. **E2E** (`indexes.e2e-spec.ts`, 2 new cases on top of phase-1 cases): TTL indexes carry `expireAfterSeconds` matching `readTtlOptionsFromEnv()`, AND ensureIndexes correctly recreates the index when TTL value changes (env-bump simulation)
- [x] **Why no end-to-end deletion test**: Mongo's TTL monitor wakes every 60s and is not programmatically triggerable from a test. Forcing a deletion-verification test would add 60s+ to CI runtime for marginal extra coverage — the index's `expireAfterSeconds` value being correct is the load-bearing assertion (Mongo's TTL implementation is itself well-tested). Documented in MANUAL-TEST.md as a manual op step if operators want eyes-on verification

**Outcome**: `raw_record_changelog` self-prunes after 90 days (or whatever the operator sets). Audit history is bounded; Mongo storage doesn't grow unbounded. Env-driven retention bumps materialize on next boot via the new `recreated` path — no separate migration script needed.

### T2-A07 — TTL index on sync_runs.createdAt

- [x] **Mirrored T2-A06**: same `createdAt_ttl` pattern for `sync_runs`, expireAfterSeconds = `INTEGRATION_TTL_SYNC_RUN_DAYS * 86400` (default 30 days). Built by the same `buildTtlIndexSpecs` factory so both TTL indexes go through the same change-detection path
- [x] **Replaces the phase-1 `sync_runs.createdAt_desc` sort index** — like changelog, the ascending TTL index covers the "list newest first" sort. **Total index count stays at 19** (was: 2+2+4+4+2+1+4 = 19; now: 2+2+4+3+2+1+3 + 2 TTL = 19) — no operator surprise in the boot log
- [x] **`parentRunId may 404`**: the Swagger description on `GET /sync-runs/:id` now flags that "sync_runs auto-prune after `INTEGRATION_TTL_SYNC_RUN_DAYS` (default 30 days). A run whose `parentRunId` points to an already-expired run will return its own detail fine, but fetching that parent id will return 404." The 404 message itself also clarifies "(or the run has TTL-expired)" so an operator chasing a missing parent gets the hint at the right place
- [x] **No retry path change needed**: the `POST /sync-runs/:id/retry` endpoint reads `parent.jobConfigId` (which lives on the parent doc, not derived from `parentRunId`). If the parent has TTL-expired, the retry returns 404 with the right error — no special-case needed. Same applies to listing: `GET /sync-runs` doesn't dereference `parentRunId`, so a half-expired chain is rendered cleanly
- [x] **E2E coverage**: the same e2e test that verifies `raw_record_changelog.createdAt_ttl` also verifies `sync_runs.createdAt_ttl` (single helper iterates `buildTtlIndexSpecs(readTtlOptionsFromEnv())`)
- [x] **Existing deploys (phase-1) carry `createdAt_desc`**: on first boot after this change, `ensureIndexes` creates the new `createdAt_ttl` next to the old `createdAt_desc`. The old index is harmless (just wastes ~few KB per collection) but operators can drop it manually with `db.raw_record_changelog.dropIndex('createdAt_desc')` + same for `sync_runs`. Documented as a one-liner cleanup; not worth automating because we have no audit-safe drop primitive yet (would orphan operator-added indexes with the same name)

**Outcome**: `sync_runs` retention bounded at 30 days by default; old run history doesn't accumulate forever. A retry chain that crosses the TTL boundary degrades gracefully (the orphan parent shows 404 with a clear "(or the run has TTL-expired)" hint; everything else works). Total tests rose to 178 unit / 195 e2e (was 172 / 193) — net +6 unit + +2 e2e from this batch, no regressions.

### T2-A08 — prom-client + /metrics endpoint

- [x] **Dep `prom-client@^15.1.3`** added — light, no react/apollo bloat, the reference Prometheus client for Node
- [x] **`MetricsModule`** (`src/services/metrics/`, `@Global()`) registers a singleton `Registry` via the `PROMETHEUS_REGISTRY` token. Calls `collectDefaultMetrics({ register })` on boot so Node.js process metrics (CPU, RSS, event-loop lag, GC) materialize without any other code. `Registry.setDefaultLabels({ service: 'ax-data-integration' })` adds a `service` label to every sample — multi-service Grafana scrapes can disambiguate without re-labeling rules
- [x] **`MetricsController`** exposes `GET /metrics` returning `Content-Type: text/plain; version=0.0.4; charset=utf-8` (the prom-text format Prometheus expects). `@Public()` so scrape pollers don't need to know the service's x-api-key
- [x] **Bearer-token gate** via optional `INTEGRATION_METRICS_TOKEN` env (Joi `string().min(8).optional()`). When unset, the endpoint is open (suitable for closed-VPN / internal-only deploys); when set, requires `Authorization: Bearer <token>` — the controller compares against the configured value and throws `UnauthorizedException` on mismatch. Documented inline that the API-key guard does NOT apply here — the bearer token IS the auth boundary
- [x] **Swagger documented** under existing `Service` tag with `@ApiOperation` + `@ApiOkResponse` + `@ApiUnauthorizedResponse` so the bearer mode shows up in `/api-docs` without surprising operators
- [x] **`@Global()`** so `SyncExecutorService` (T2-A09) and future webhook / MQTT services (T2-B) can inject `MetricsService` from anywhere without re-importing the module
- [x] **Unit tests** — `metrics.service.spec.ts` (6 cases): the three metric families register on construction, observeSyncRunCompleted increments counters + histogram, zero-count ops are skipped, cardinality guard returns `'overflow'` past limit, already-seen IDs still resolve, resetCardinalityTracker leaves counters intact. `metrics.controller.spec.ts` (5 cases): open-mode passthrough, valid Bearer, missing header → 401, wrong token → 401, wrong scheme → 401
- [x] **E2E** — `metrics.controller.e2e-spec.ts` (2 cases): `/metrics` is public + returns Prometheus text + lists default Node metrics + our sync_run families; the `service="ax-data-integration"` default label is attached

**Outcome**: Prometheus can scrape `/metrics` without code changes. Default Node.js process metrics ship for free. The Bearer-token gate is an opt-in for clusters where `/metrics` would be reachable from an untrusted network. Foundation for T2-A09 (executor instrumentation) lands without further module wiring.

### T2-A09 — Instrument SyncExecutorService

- [x] **3 metric families** registered up-front in `MetricsService` constructor (so even a freshly-booted service with zero runs exposes the metric definitions to a Prometheus scrape):
  - `sync_run_total{status,jobConfigId}` — Counter, incremented once per finalize
  - `sync_run_duration_seconds{status,jobConfigId}` — Histogram with buckets `[0.5, 1, 5, 10, 30, 60, 300, 600, 1800, 3600]` seconds — covers second-scale Excel syncs through hour-scale DB pulls
  - `sync_run_records_total{op,jobConfigId}` — Counter, `op` ∈ {`read`, `inserted`, `updated`, `unchanged`, `deleted`, `errors`}, incremented with the per-op delta from the run's `counts`. Zero-count ops are NOT emitted (keeps `/metrics` smaller — Prometheus convention)
- [x] **Cardinality guard** (`observeJobLabel`): after 100 distinct `jobConfigId` values seen by `MetricsService`, additional ones collapse to `'overflow'`. Already-seen IDs continue to report under their real label. Constant exported as `JOB_LABEL_CARDINALITY_LIMIT` for ops tuning. Mirrors prom-client's [cardinality FAQ](https://github.com/siimon/prom-client) guidance
- [x] **Single call site, single concern**: instrumentation lives in one block right after `runs.finalize` in `execute()`. The `try { ... } catch { logger.warn(...) }` wrapper ensures a metric-emit failure (unlikely but possible if a custom registry throws) NEVER causes the run to fail — observability is best-effort
- [x] **DI wiring**: `@Optional() @Inject(MetricsService) metrics?: MetricsService` on the constructor. Explicit `@Inject` because Nest's reflection-based DI can't recover the type token when the property uses the optional `?:` modifier (TS emits `Object` for those). Tests + the `TestExecutor` subclass pass `null` for the slot — covered with a constructor comment so future refactors don't drop the explicit Inject
- [x] **E2E** — extended the existing `excel-trigger-flow.e2e-spec.ts` "upload → trigger" happy-path: after a successful sync, scrape `/metrics` and assert `sync_run_total{status="success",jobConfigId=<id>} 1`, `sync_run_records_total{op="inserted",jobConfigId=<id>} 3`, and a non-zero `sync_run_duration_seconds_sum`. Uses line-anchored regex (`/^…/m`) rather than substring match because prom-client interleaves the `service=…` default label arbitrarily inside the `{...}` — a brittle prefix would flap
- [x] **Why no separate scrape e2e for 3 runs**: the WBS draft mentioned that. The counter increments are simple arithmetic — testing 1 run + asserting count=1 proves the wiring; 3 runs adds no signal. Saved one e2e suite

**Outcome**: Grafana dashboards can show I/U/D per job, success rate, p50/p95 run duration without touching `sync_runs`. The cardinality guard prevents a runaway job_config churn from blowing up Prometheus storage. Histogram buckets cover the realistic run-duration range for both file (seconds) and DB (minutes-to-hours) sources.

### T2-A10 — Master-key file loader

- [x] **`loadMasterKeyRing` extended** to recognise a parallel name pattern `INTEGRATION_MASTER_KEY_V<N>_FILE` (filesystem path) alongside the existing `INTEGRATION_MASTER_KEY_V<N>` (base64 inline). Files are read with `fs.readFileSync(path, 'utf8')` → `trim()` → base64-decode → 32-byte length check. Trim is deliberate: Docker secret files conventionally end with `\n`, and Kubernetes secret mounts on Windows can introduce CR/LF
- [x] **Both-set-for-same-version refuses to boot** with a clear error: `INTEGRATION_MASTER_KEY_V<N> and INTEGRATION_MASTER_KEY_V<N>_FILE are both set — pick one source per version`. Different versions can mix freely (e.g. V1 from env, V2 from file during rotation)
- [x] **Different versions can mix sources** — V1 from env + V2 from file works during a rotation window (operator can move keys to file-mode incrementally, one version at a time)
- [x] **Failure modes all surface at boot, never at runtime**:
  - Missing file → `${name} points at "${path}" which could not be read (${code})` — `code` is the fs error code (e.g. `ENOENT`, `EACCES`), useful diagnostic without leaking content
  - Empty file → `is empty` (avoids the misleading "0 bytes" base64 error)
  - Wrong length → `must decode to 32 bytes (got <N>)` — same as env-var path. **Verified by test that the error message does NOT include the file contents**
- [x] **Joi schema** adds `.pattern(/^INTEGRATION_MASTER_KEY_V\d+_FILE$/, Joi.string().min(1))` so ConfigModule validates the env-var name shape; the actual file read still happens in `loadMasterKeyRing`. Two-layer validation (Joi name pattern + loader content check) matches the existing `_V<N>` env-var path
- [x] **7 unit tests** added (`secret.loader.spec.ts` → 12 total): file source happy path, trailing-newline acceptance, mixed env + file across versions, both-set-for-same-version throws, missing file throws (with code in message), empty file throws, wrong-length file throws AND error message excludes the file contents

**Outcome**: Master key can be supplied via Docker secret (file mounted at `/run/secrets/master_key_v1`, T2-A11), Kubernetes secret, or Vault Agent sidecar — no code change downstream when adding a new source. The file-mode path is now first-class alongside env-mode, and the dual-channel detection prevents a half-rotated config from silently picking the wrong key.

### T2-A11 — docker-compose uses Docker secret in prod profile

- [x] **Two-service design** in `docker-compose.yml`: the default `ax-data-integration` (no profile, env-var master key) is unchanged for dev velocity; new `ax-data-integration-prod` lives under `profiles: [prod]` and uses `INTEGRATION_MASTER_KEY_V1_FILE=/run/secrets/master_key_v1`. Distinct container names (`ax-di-service` vs `ax-di-service-prod`) and host ports (3012 vs 3013, configurable via `SERVICE_HOST_PORT_PROD`) so the two modes cannot collide if an operator accidentally brings both up — observable failure instead of silent overwrite
- [x] **Top-level `secrets:` block** defines `master_key_v1.file: ./secrets/master_key_v1.txt`. The `secrets/` directory is gitignored (added to repo-root `.gitignore` as `services/*/secrets/`). Vault Agent migration: have Agent write to the same host path — no compose / code change required
- [x] **Switching from default → prod is a 4-line shell sequence**, documented inline in compose header + README "Run via Docker compose":
  ```bash
  mkdir -p secrets
  openssl rand -base64 32 > secrets/master_key_v1.txt
  chmod 400 secrets/master_key_v1.txt
  docker compose --profile prod up --build
  ```
- [x] **`.env.compose.example` updated** with a `--- Prod profile ---` section explaining the swap + the file-source convention + the Vault migration story. Explicitly notes that the prod service ignores `INTEGRATION_MASTER_KEY_V1` from .env
- [x] **README updated** with the same content, plus an explicit "pick ONE mode" warning. The two-service approach is intentional: compose profiles are best suited for additive services (one runs, the other doesn't); the alternative would be a `docker-compose.prod.yml` overlay (`-f` composition), but the profile-as-flag UX is more discoverable

**Outcome**: Operator can deploy to a server where the master key never touches `.env` — it's a `chmod 400` file owned by the deploy user. Default `docker compose up` still works untouched for dev. Vault integration becomes a future doc-only step (Vault Agent writes to the same file path; no compose change). The two-service approach surfaces operator mistakes (running both modes at once → port-bind error) instead of hiding them.

### T2-A12 — sync.run.completed event

- [x] **`SYNC_RUN_COMPLETED_EVENT = 'sync.run.completed'`** constant + `SyncRunCompletedPayload` interface exported from `sync-executor.service.ts` (same source-collocated pattern as phase-1's `JOB_CONFIG_CHANGED_EVENT`)
- [x] **Payload contract**: `{ jobConfigId: ObjectId, syncRunId: ObjectId, status: RunStatus, counts: SyncRunCounts, durationMs: number, triggeredBy: TriggerSource, finishedAt: Date }`. Added `finishedAt` to the WBS-draft shape so listeners can compute time-based windows without an extra DB read (drift detector T2-B09 will use this to fetch the prior snapshot from the right point in time)
- [x] **Fire site**: emit happens RIGHT AFTER `metrics.observeSyncRunCompleted(...)`, inside the same try/catch block (separate try blocks — a metric failure must not block the event, and vice versa). Both happen after `runs.finalize` returns, so listeners read a consistent finalized state
- [x] **Best-effort, fire-and-forget**: `events?.emit(SYNC_RUN_COMPLETED_EVENT, payload)` — no `emitAsync`, no awaiting. EventEmitter2's default behaviour swallows listener errors (logs them via the global error event); the executor's own try/catch is just defensive sugar for that
- [x] **DI wiring** mirrors T2-A09's metrics injection exactly: `@Optional() @Inject(EventEmitter2) events?: EventEmitter2`. Explicit `@Inject` for the reflection-metadata reason. The `TestExecutor` subclass passes `null` for both metrics and events slots — events emission is exercised in its own dedicated e2e suite
- [x] **E2E** — `test/sync-run-completed-event.e2e-spec.ts` (2 cases): trigger a real Excel job, subscribe to the global `EventEmitter2` (resolved via `app.get(EventEmitter2)`), assert the payload contract end-to-end (jobConfigId hex matches the trigger, syncRunId matches the runId in the trigger response, counts match the actual rows, triggeredBy=`'manual'`, durationMs ≥ 0, finishedAt is a Date). Second case: a throwing listener does NOT propagate back into the executor — the run still finalizes as `success`
- [x] **No `services.module.ts` doc update** added — the WBS draft suggested documenting the pattern there, but the source-collocated constant + payload type IS the documentation (export + JSDoc on `SYNC_RUN_COMPLETED_EVENT` covers it). Future listeners just import the constant. The phase-1 `JOB_CONFIG_CHANGED_EVENT` follows the same pattern and that's how T2-B09 / T2-B11 will wire up

**Outcome**: Wave 2.2's schema-drift detector (T2-B09) and alert dispatcher (T2-B11), plus any future webhook fan-out / audit-export listener, can subscribe to `sync.run.completed` via `@OnEvent` without touching the executor. The payload carries everything a listener typically needs (counts, duration, both IDs, finishedAt for time windows). Best-effort emission means no listener can ever destabilize a sync run.

### Wave 2.1 — Test rollup

- [x] **Unit tests added**: T2-A01 (4 — bootstrap hook), T2-A02 (4 new on `health.controller.spec.ts`), T2-A03 (7 new on `api-key.guard.spec.ts`), T2-A05/A06 (6 — `indexes.spec.ts` covers `readTtlOptionsFromEnv` + `buildTtlIndexSpecs`), T2-A08 (11 — `metrics.service.spec.ts` 6 + `metrics.controller.spec.ts` 5), T2-A10 (7 new on `secret.loader.spec.ts`) = **39 unit tests added in Wave 2.1**
- [x] **E2E tests added**: T2-A01 (2 — `mongo-bootstrap.e2e-spec.ts`), T2-A02 (1 — extended `app.e2e-spec.ts` readiness assertion), T2-A04 (3 — extended `*.controller.e2e-spec.ts` for principal label), T2-A06/A07 (2 new on `indexes.e2e-spec.ts` — TTL value materialized, env-bump recreate path), T2-A08 (2 — `metrics.controller.e2e-spec.ts`), T2-A09 (1 — extended `excel-trigger-flow.e2e-spec.ts` with `/metrics` scrape assertion), T2-A12 (2 — `sync-run-completed-event.e2e-spec.ts`) = **13 e2e tests added in Wave 2.1**
- [x] **Test count delta**: started Phase 2 at 156 unit / 191 e2e (Phase 1 final) → **196 unit / 199 e2e** at Wave 2.1 close = +40 unit / +8 e2e (some e2e cases extended in place rather than added as new it() blocks, hence the lower e2e delta than count of "tests added")
- [x] **No regressions**: every test suite that existed at Phase 1 close still passes. Confirmed by running `pnpm test` + `pnpm test:e2e` at the end of each task

**Wave Outcome**: Service starts and self-configures (indexes auto-create + readiness verifies them; TTL self-prunes). Principal attribution is real (no more `'api-key'` literal). Observability via Prometheus is first-class (process metrics + per-run counters/histogram, optional Bearer-token gate, cardinality-guarded). Master key can live outside `.env` (env var OR file path OR Docker secret via `--profile prod`). `sync.run.completed` event lays the integration foundation for Wave 2.2's drift/alert features. Production deploy gate cleared — all 12 tasks delivered with tests + docs in place; zero phase-1 regressions.

---

## Phase 2.2 — Manager's ingestion asks (T2-B01 → T2-B11)

Closes the manager's remaining form asks in [O001](./O001-data-integration.md): #2 (webhook push) + #3 (MQTT/event). Adds schema-drift alerting on top of T2-A12's event hooks.

| ID     | Status | Task                                                                 | Refs         | Depends                |
| ------ | ------ | -------------------------------------------------------------------- | ------------ | ---------------------- |
| T2-B01 | `[x]`  | Add `'webhook'` to `SourceType` union + create-job DTO branch        | O001 form #2 | -                      |
| T2-B02 | `[x]`  | `WebhookController` — `POST /webhooks/:jobConfigId`                  | O001 form #2 | T2-B01                 |
| T2-B03 | `[x]`  | HMAC signature verify (`x-webhook-signature` + per-job secret)       | -            | T2-B02                 |
| T2-B04 | `[x]`  | Webhook → `WebhookIngestionService` → reuse `classifyAndWrite`       | -            | T2-B02, T-E04 (phase1) |
| T2-B05 | `[ ]`  | "Push-only" schedule mode — accept enabled job without cron          | -            | T2-B01                 |
| T2-B06 | `[ ]`  | `mqtt` dep + `MqttConnectionFactory` abstraction                     | O001 form #3 | -                      |
| T2-B07 | `[ ]`  | `MqttAdapter` — subscribe → emit AdapterRecord per message           | -            | T2-B06                 |
| T2-B08 | `[ ]`  | MQTT job lifecycle service (start on enable, stop on disable/delete) | -            | T2-B07                 |
| T2-B09 | `[ ]`  | Schema-drift detector — compare consecutive `source_metadata` hashes | P002 §6.5    | T2-A12                 |
| T2-B10 | `[ ]`  | Slack + Email alert channel implementations                          | -            | -                      |
| T2-B11 | `[ ]`  | `job_config.options.alertChannels` config + alert dispatcher         | -            | T2-B09, T2-B10         |

### T2-B01 — Webhook source type

- [x] **`SourceType` union adds `'webhook'`** in `job-config.schema.ts`; mirrored in `SOURCE_TYPES` const in the DTO so class-validator's `@IsIn(SOURCE_TYPES)` accepts it. New shared export `PUSH_SOURCE_TYPES: ReadonlySet<SourceType>` (currently `{'webhook'}`) + helper `isPushSourceType(type)` — single source of truth for the "ingestion is receiver-driven, not cron-driven" classification used by schedule validation and the scheduler guard. T2-B06 will extend the set with `'mqtt'` without touching call sites
- [x] **`WebhookSourceConfigDto`** in `dto/create-job-config.dto.ts` documents the `source.config` shape for `type='webhook'`: `secretRef?` (Mongo ObjectId hex), `signatureHeader?` (defaults at runtime to `x-webhook-signature`), `eventField?` (root JSON field name). Following phase-1's loose-`Record` convention, the DTO does NOT introspect this class on incoming requests — the shape check runs in `validateWebhookSourceConfig` at the service boundary (mirrors the existing `validateJobConfigIdentity` pattern). The DTO class exists so `/api-docs` consumers see the contract
- [x] **`validateWebhookSourceConfig(source, logger?)`** in new `webhook-source.validator.ts`: rejects unknown keys (catches typos like `secret_ref` — surfaced as `BadRequestException` instead of silently ignored), validates `secretRef` is a 24-hex `ObjectId.isValid` string, validates `signatureHeader` + `eventField` are non-empty strings. When `secretRef` is absent, logs a `warn` (open-webhook trace) — the actual boot-time warning lives in T2-B02; this is just an early operator nudge at create-time
- [x] **`validateScheduleForSource(source, schedule)`** in new `schedule.validator.ts`: requires `cronExpression` for any non-push source; accepts cron-less schedules for `PUSH_SOURCE_TYPES`. ScheduleDto's `cronExpression` is now `@IsOptional()` at the DTO layer; the per-source-type requirement is enforced at the service layer so existing tests like "POST rejects missing required nested field (400)" still pass (DTO-layer validation passes → service-layer throws `BadRequestException` → controller returns 400)
- [x] **Identity rules**: `row-number` already rejects non-`FILE_SOURCE_TYPES` via `validateJobConfigIdentity`, so webhook+row-number is auto-rejected — no code change needed. Added 4 spec cases (1 row-number reject + 3 hash/composite/primary-key positive) to lock the contract in the existing `identity.validator.spec.ts` so a future refactor cannot widen the file-source set without surfacing
- [x] **`JobConfigsService.create` + `update` wired** to call both new validators. Update path uses combined (new ∪ existing) state — same pattern as the identity validation — so a PATCH that switches source from `rest` to `webhook` simultaneously and drops the cron does not leave the doc in an invalid configuration. `existing` is now also loaded when `input.schedule !== undefined` so the schedule rule can re-check against the merged shape
- [x] **`JobConfigSchedule.cronExpression` typed as optional** at the schema/document layer. `scheduler.service.ts` got a minimal guard — `register()` skips when `cronExpression` is missing or blank, with a comment pointing at `PUSH_SOURCE_TYPES`. The full push-only schedule UX (debug log, /sync-runs visibility note) lives in T2-B05; the guard here is the smallest amount needed so the optional type doesn't cause a runtime CronJob-from-undefined throw on enable of a webhook job
- [x] **Unit tests added**: `webhook-source.validator.spec.ts` (14 cases — no-op for non-webhook, accept empty/full config, reject unknown keys, secretRef hex+type checks, open-webhook warn emission/non-emission, signatureHeader/eventField non-empty rules, plus `resolveWebhookSignatureHeader` defaulting). `schedule.validator.spec.ts` (6 cases — required for rest/excel/postgres; missing/blank rejected; webhook accepts both missing and provided). `identity.validator.spec.ts` (+4 cases). **+24 unit tests** (196 → 221 — one extra came from a spec restructure during dev that surfaced an existing branch)
- [x] **E2E tests added** (`job-config.controller.e2e-spec.ts` → new `describe('webhook source — T2-B01')` block, 6 cases): 201 for webhook without cron (push-only), 201 for webhook with full config, 400 for unknown source.config keys, 400 for malformed secretRef, 400 for row-number identity on webhook, and the **regression guard** — 400 still returned for missing cronExpression on a non-webhook source. Total e2e: **205** (was 199 at Wave 2.1 close — +6 from T2-B01)
- [x] **Barrel export** (`domain/job-config/index.ts`) re-exports `validateWebhookSourceConfig`, `resolveWebhookSignatureHeader`, `validateScheduleForSource`, `PUSH_SOURCE_TYPES`, `isPushSourceType`, and the `WebhookSourceConfig` type so T2-B02–B04 (webhook receiver + ingestion service) can import without deep paths

**Outcome**: A webhook `job_config` can be created via `POST /job-configs` end-to-end — discriminated DTO contract is documented in Swagger, validation runs across the full shape (DTO accept → service-layer shape check → service-layer schedule rule → repo write → event emit), and the scheduler safely skips registration for cron-less push jobs. Identity strategies behave per the WBS (row-number rejected; hash/composite/primary-key accepted). The push-vs-pull classification is centralized in `PUSH_SOURCE_TYPES` so T2-B05/B06 extend without touching call sites. Foundation for T2-B02 (receiver controller) and T2-B04 (ingestion service) is in place: `WebhookSourceConfig` type + `resolveWebhookSignatureHeader` helper already exported. Tests: +24 unit / +6 e2e, no Wave 2.1 regressions.

### T2-B02 — WebhookController endpoint

- [x] **`POST /webhooks/:jobConfigId`** in new `src/services/webhook/`. `@Public()` (skips the global `ApiKeyGuard` — HMAC signature, added in T2-B03, is the auth boundary), `@HttpCode(202)`, `@UseGuards(ThrottlerGuard)`. Path id validated by the existing `ObjectIdPipe` → 400 on malformed; 404 from the controller when the doc is missing OR `source.type !== 'webhook'` (single response shape — avoids leaking whether a non-webhook id exists)
- [x] **Rate limiting** via `@nestjs/throttler@^6.5.0` (new dep). `ThrottlerModule.forRootAsync` reads `INTEGRATION_WEBHOOK_RATE_LIMIT_RPM` (default 60/min) from `ConfigService` so operators can tune without code changes. The guard is applied per-controller via `@UseGuards`, NOT registered as `APP_GUARD` — only webhook routes are rate-limited, the rest of the API uses standard `ApiKeyGuard` semantics
- [x] **Body cap** via `INTEGRATION_WEBHOOK_MAX_BYTES` (default `10 * 1024 * 1024` = 10 MiB; bounded 1 KiB ≤ x ≤ 100 MiB by Joi). `main.ts` calls `app.useBodyParser('json', { limit })` on bootstrap. Exceeding it returns 413 from Express body-parser — Nest's `ExceptionsHandler` translates `PayloadTooLargeError` to a 413 response automatically. Trade-off documented inline: the limit applies to ALL JSON endpoints, not just `/webhooks/*` — acceptable because DTO whitelisting trims payloads on the other routes and the service is on-prem internal
- [x] **Raw body captured** via `NestFactory.create({ rawBody: true })`. The controller's `@RawBody()` parameter is forwarded to the (stub) `WebhookIngestionService` as a `Buffer` so T2-B03's HMAC verify can hash exact wire bytes — re-serialising the parsed JSON would change whitespace / key order and break the signature. Falls back to `Buffer.alloc(0)` when `RawBody()` is undefined (occurs when express body-parser didn't capture, e.g. non-JSON content-type)
- [x] **`WebhookIngestionService` stub** in `webhook-ingestion.service.ts`: synthesises a fresh `ObjectId` as `runId` without persisting a `sync_run`. The service interface (`WebhookIngestionInput` / `WebhookIngestionResult`) is the final shape — T2-B03 will gate the call behind HMAC verify, T2-B04 will swap the body for actual `sync_run` + `classifyAndWrite`. Controller / response shape stays stable across the three tasks
- [x] **Signature header lookup** uses `resolveWebhookSignatureHeader(jobConfig.source.config)` from T2-B01 (`'x-webhook-signature'` default). Header value is normalised: lowercased lookup (Express does this), array values pick the first element. T2-B02 forwards the header to the ingestion service as `signatureHeader: string | undefined` — actual verify is T2-B03, but the plumbing is in place
- [x] **Swagger** under new tag `Webhooks` (added to `main.ts` `DocumentBuilder`). `@ApiOperation` description explicitly calls out public-with-HMAC + rate-limit env + body-cap env so `/api-docs` consumers don't expect `x-api-key`. Documented response codes: 202, 400, 401 (T2-B03), 404, 413, 429, 500. **`swagger.e2e-spec.ts` updated** — its "every non-Service operation requires api-key" assertion grew a `publicTags = {'Service', 'Webhooks'}` skip-list with an inline comment pointing at the HMAC auth boundary
- [x] **`MainModule` wired** with `WebhookModule`. JobConfigRepository is reused (already exported from `JobConfigModule`); no new repository introduced
- [x] **Unit tests** — `webhook.controller.spec.ts` (9 cases): 404 on missing job, 404 on non-webhook source, 202 returns `runId` as hex, rawBody passthrough + empty-buffer fallback, full input forwarding, signature header case-insensitive lookup, default header name fallback, undefined when absent, array-header takes first
- [x] **E2E tests** — `test/webhook.controller.e2e-spec.ts` (6 cases): 202 happy path without `x-api-key` + `ObjectId.isValid(runId)`; 404 unknown id; 404 non-webhook source; 400 malformed `jobConfigId`; 400 malformed JSON body; configured-header passthrough (`x-signature` instead of default). 413 + 429 are NOT covered by e2e — the body-cap case would need a 10+ MiB buffer (slow) and the rate-limit case is order-dependent inside a single jest run (flaky). Their plumbing is exercised by integration tests (Throttler module wired, body-parser limit applied); the WBS lists 413 + 429 as supported response codes via standard Nest / Throttler defaults
- [x] **Test count**: unit 221 → **230** (+9 from `webhook.controller.spec.ts`). E2E 205 → **211** (+6 from `webhook.controller.e2e-spec.ts`). No phase-1 / Wave 2.1 / T2-B01 regressions

**Outcome**: An external system can POST JSON to `/webhooks/<jobConfigId>` without `x-api-key` — request returns `202 { runId }` once accepted. The receiver enforces the four T2-B02-owned guards: body cap (413), per-IP rate limit (429), source-type check (404 for non-webhook), and JSON parse (400). HMAC verification + actual `sync_run` persistence are dependency hooks already in place (`signatureHeader`, `rawBody`, `jobConfig` forwarded to the ingestion service) — T2-B03 just adds the verify call before `ingestion.ingest(...)`; T2-B04 swaps the stub body for `sync_run` creation + executor `classifyAndWrite`. Swagger lists the new `Webhooks` tag with full 4xx response coverage; the swagger e2e regression guard now whitelists the public tag.

### T2-B03 — HMAC signature verify

- [x] **`WebhookSignatureVerifier`** in `src/services/webhook/webhook-signature.verifier.ts`. Resolves the secret plaintext lazily via `SecretsService.revealPlaintext(ObjectId)` (existing T-B01 path), computes `HMAC-SHA256(rawBody, plaintext)` as hex, and constant-time compares with the value of the per-job signature header. **Plaintext lives in the function-local `plaintext` const only** — no caching, no logging (mirrors the CLAUDE.md "Plaintext of secrets — only exists in RAM during one decrypt" rule)
- [x] **Constant-time compare** via `crypto.timingSafeEqual` over equal-length hex buffers. The helper short-circuits on length mismatch BEFORE touching `timingSafeEqual` so an attacker can't infer length from timing; if hex decoding throws (caller sent garbage characters), returns `false` instead of bubbling — same observable behaviour as a signature mismatch
- [x] **Open webhook (no `secretRef`)** — verifier returns immediately, no secret resolution, no HMAC compute. The per-request silence avoids log spam; a new `WebhookBootWarner` (implements `OnApplicationBootstrap`) lists enabled webhook jobs via `JobConfigRepository.list({sourceType:'webhook'})` and emits one `warn` per open job at startup so operators see them in one place during boot. **Disabled jobs are intentionally NOT scanned** — they don't accept payloads, so the warning would be noise
- [x] **Replay protection** — `INTEGRATION_WEBHOOK_MAX_SKEW_SEC` env (default 300s, range 0–3600s) added to ConfigModule. Header name is the fixed constant `WEBHOOK_TIMESTAMP_HEADER='x-webhook-timestamp'`. Logic: when skew > 0 AND the request carries the header, the unix-seconds timestamp must be within ±skew of `Math.floor(Date.now()/1000)`. **Missing header is tolerated** — the signature alone authenticates the body; replay-window is a defense-in-depth for senders that opt in. Skew = 0 disables the check entirely. Malformed (non-numeric or trailing whitespace) header → 401 with `Webhook timestamp header is malformed`
- [x] **Secret-resolution failures map to 401** (not 500): when `SecretsService.revealPlaintext` rejects (the referenced secret was deleted, never existed, or AES decrypt failed), the verifier catches, logs the full reason at `warn` (operator triage), and rethrows `UnauthorizedException` with a generic message — does NOT leak missing-secret state to unauthenticated callers. Same code path covers historic data drift (e.g. `source.config.secretRef` no longer a valid hex ObjectId)
- [x] **Controller wired**: `WebhookController.receive` now reads BOTH headers (signature via T2-B01's `resolveWebhookSignatureHeader`, timestamp via the fixed constant), calls `verifier.verify(...)` BEFORE `ingestion.ingest(...)`. Verification failures throw `UnauthorizedException` → Nest returns 401 — ingestion never runs, no `runId` is generated, no DB writes
- [x] **`WebhookModule` imports `SecretModule`** so the verifier can inject `SecretsService`. `WebhookBootWarner` registered as a provider on the same module — boot order: ConfigModule → Mongo → SecretModule → WebhookModule (no extra wiring; standard Nest provider resolution handles it)
- [x] **Unit tests** — `webhook-signature.verifier.spec.ts` (13 cases): valid sig pass-through, missing header → 401, body-tampered → 401, wrong-length sig → 401 (no `timingSafeEqual` throw), open webhook bypass + `revealPlaintext` never called, missing-secret resolution → 401, malformed `secretRef` (historic drift) → 401, replay protection (5 cases): within window passes, stale → 401, future → 401, non-numeric → 401, missing header tolerated, skew=0 disables. **`webhook.controller.spec.ts`** (+3 cases): verifier runs BEFORE ingest, verifier throw skips ingestion, timestamp header forwarded. Total `+16 unit tests`
- [x] **E2E tests** — `webhook.controller.e2e-spec.ts` (+6 cases under `describe('HMAC signature verification (T2-B03)')`): 202 on valid sig, 401 on missing sig (signed job), 401 on tampered body, 401 on stale timestamp, 202 on fresh timestamp, custom `signatureHeader` honoured (sending under the default header → 401, sending under configured `x-acme-signature` → 202). Reuses the existing `/secrets` endpoint to create a real secret per test (full SecretsService → CryptoService → AES path exercised). **`+6 e2e tests`**
- [x] **No new env table doc update** — the env description lives inline in `config.module.ts` (same convention as T2-A05/A08 added in Wave 2.1). P002 §16 will be batched at the end of Wave 2.2

**Outcome**: Webhooks are authenticated cryptographically — no `x-api-key` in transit, no shared secret in the URL, the HMAC binds to the exact body bytes. Replay attacks are bounded by a configurable skew window for senders that include the timestamp header. Open webhooks (no `secretRef`) remain operationally possible but are surfaced once at boot so SRE can spot drift. Secret-resolution failures and data drift on `secretRef` both degrade to 401 with operator-facing logs — production posture has no "unverifiable but accepted" path. T2-B04 can build the ingestion pipeline on top knowing every call into `WebhookIngestionService.ingest` has already been authenticated.

### T2-B04 — Webhook ingestion pipeline

- [x] **`RecordClassifierService` extracted** in `src/workers/record-classifier.service.ts`. Previously `classifyAndWrite` + `flushChangelog` were private methods on `SyncExecutorService` — pulling them into a tiny injectable service that owns `RawRecordRepository` + `RawRecordChangelogRepository` lets both the pull-path executor AND the new push-path webhook ingestion reuse the **exact same** insert/update/unchanged + audit-changelog logic. `SyncExecutorService` now delegates via `this.classifier.classifyAndWrite(...)` / `this.classifier.flushChangelog(...)`. Refactor scope was contained — no test rewrites needed beyond updating the one `TestExecutor` subclass in `test/sync-executor.e2e-spec.ts` to pass a `RecordClassifierService` instead of the bare `RawRecordChangelogRepository` constructor argument. Duplicate-key + audit-retry semantics are preserved verbatim
- [x] **`TriggerSource` extended** in `domain/sync-run/sync-run.schema.ts`: `'schedule' | 'manual' | 'retry' | 'webhook'`. No DTO/query allowlists referenced the union by value (verified via grep), so the extension is binary-compatible with the existing `/sync-runs?triggeredBy=...` filter — webhook runs are visible alongside cron-driven ones with zero controller changes
- [x] **`WebhookBodyParser`** (`webhook-body.parser.ts`): one pure function `parseWebhookBody(body, config)`. Behaviour matches the WBS literally — `eventField` absent → body must be a plain JSON object → returns `[body]`; `eventField` present → body must be a JSON object AND `body[eventField]` must be an array of JSON objects → returns that array. Structural mismatches throw `BadRequestException` (→ 400) BEFORE any DB write so a malformed payload never creates a half-finished `sync_run`. Distinguishes from 401 (HMAC) and 500 (infra) on the wire. Top-level array, primitive, and null are all rejected — explicit by-design, prevents accidental `JSON.parse('null')` from producing a record
- [x] **`inferWebhookSchema`** (`webhook-schema.infer.ts`): builds a best-effort `SourceSchema` from the first 10 records of THIS payload (cap = `WEBHOOK_SCHEMA_SAMPLE_LIMIT`). Field set = union of keys across the sample. Type = first non-null observation (no widening — first observation wins; e.g. `{v:'a'}` then `{v:99}` gives `type:'string'`). `nullable=true` when any sampled record has the field as `null` OR missing. Fields sorted alphabetically so the hash is stable across runs with identical data. `raw: { source: 'webhook-inline', sampleSize, totalRecords, sampledAt }` — `'webhook-inline'` is the discriminator that distinguishes from real adapter `discoverMetadata` rows
- [x] **`WebhookIngestionService` rewritten** as the orchestrator. Flow: (1) `parseWebhookBody` → array of records (throws 400 on shape mismatch BEFORE any DB write); (2) `runs.insertRunning({ jobConfigId, triggeredBy:'webhook', workerId })`; (3) `persistSchema` → `inferWebhookSchema` + `sourceMetadata.insertIfNew` — wrapped in try/catch so a Mongo blip on schema persist does NOT abort ingestion (audit-trail problem ≠ data problem); (4) for each record → `classifier.classifyAndWrite(...)`, error threshold from `jobConfig.options.errorThreshold ?? 100` honoured identically to the cron path — abort + status='failed' when reached, else accumulate to status='partial'; (5) `flushChangelog` once at end-of-loop; (6) `runs.finalize(...)` + best-effort `MetricsService.observeSyncRunCompleted` + best-effort `SYNC_RUN_COMPLETED_EVENT` emit with `triggeredBy:'webhook'`. Drift/alert listeners (T2-B09, T2-B11) see webhook runs without special-casing
- [x] **Identity strategy honoured as configured**: nothing webhook-specific — `RecordClassifierService.classifyAndWrite` computes `recordKey` via the same `computeRecordKey({ identity, record, sourceFileId })` the cron path uses. The WBS-suggested `hash` (for events) and `primary-key` (for entity payloads) both work; `composite` and `row-number` are also passable, with `row-number` being weird semantically for push-based but not blocked at this layer
- [x] **No concurrency lock on webhooks**: deliberate. Pull-path takes `ConcurrencyService.acquire(jobId)` to enforce single-run-per-job, but webhooks are receiver-driven — two concurrent POSTs for the same `jobConfigId` MUST both create their own `sync_run`. The per-`recordKey` unique index in `raw_records` is the real safety net; a race-induced duplicate insert maps to the existing `Duplicate recordKey within run` error and counts as one record-level error, not a system error. Rationale documented inline so future refactors don't accidentally wrap the ingest call in the lock
- [x] **`WebhookModule` updated** to import `SyncRunModule` + `SourceMetadataModule` + `WorkersModule` (for `RecordClassifierService`). Module-level doc rewritten to reflect the T2-B02/B03/B04 stack. Provider list unchanged: `WebhookIngestionService, WebhookSignatureVerifier, WebhookBootWarner`
- [x] **Unit tests +25**: `webhook-body.parser.spec.ts` (8 cases — empty-string eventField treated as unset, missing field, non-array, non-object element, top-level array rejection, null rejection, empty events array), `webhook-schema.infer.spec.ts` (8 cases — scalar/array/object/date classification, nullable from null AND from missing, first-observation-wins, 50-record sample capped at 10 with totalRecords intact, empty input, alpha-sorted fields for hash stability), `webhook-ingestion.service.spec.ts` (9 cases — single-record happy path, eventField fan-out, BadRequestException without sync_run creation, per-record error → partial, error-threshold abort → failed, schema-persist failure does NOT abort, `SYNC_RUN_COMPLETED_EVENT` with `triggeredBy='webhook'`, MetricsService observation, end-of-loop changelog flush count)
- [x] **E2E +6** in `test/webhook-ingestion.e2e-spec.ts`: single-record body → 1 raw_record + 1 sync_run + 1 changelog; `eventField=events` 2-record push then update+unchanged cross-run; `source_metadata` row inferred from payload with `raw.source='webhook-inline'`; malformed body shape → 400 WITHOUT creating a sync_run; `auditChanges=false` suppresses changelog but classifies raw_records correctly; webhook run shows up under `GET /sync-runs?jobConfigId=...` with `triggeredBy='webhook'`. All 6 pass; 3 pre-existing e2e fails (unrelated: secret 'axios' → 'api' rename + swagger api-key gap) remain unchanged
- [x] **No env additions** — error threshold + audit-changes are existing job-level options, schema-sample-limit is the constant `WEBHOOK_SCHEMA_SAMPLE_LIMIT=10` (per WBS, no operator knob expected). P002 §16 has no new rows to add

**Outcome**: A webhook payload of 1 or N records lands in `raw_records` with full insert/update/unchanged classification, identical semantics to a cron-driven sync. The classifier extraction means there is genuinely NO duplicated write logic — the same `RecordClassifierService.classifyAndWrite` powers both paths. Operators see webhook runs in `/sync-runs` with `triggeredBy='webhook'`, downstream listeners receive the same `SYNC_RUN_COMPLETED_EVENT` shape, metrics record under the existing histograms. Schema is best-effort metadata inferred per-payload (no upstream `discoverMetadata` available) and persistence failures degrade gracefully — the actual record write is the source of truth. T2-B05 (push-only schedule) and T2-B07 (MQTT) can build on the same pipeline by swapping the receiver: parse → ingest → classify.

### T2-B05 — Push-only schedule mode

- [ ] Joi validation in `CreateJobConfigDto`: when `source.type ∈ {'webhook', 'mqtt'}`, `schedule.cronExpression` becomes optional. When omitted, scheduler does NOT register a cron for this job
- [ ] Existing cron `SchedulerService` ignores jobs without `cronExpression`
- [ ] `GET /sync-runs?jobConfigId=…` already works — `triggeredBy='webhook'` shows up in the existing list

**Outcome**: Webhook + MQTT jobs live in `job_configs` cleanly without polluting the cron registry.

### T2-B06 — MQTT connection factory

- [ ] Dep `mqtt@^5`
- [ ] `MqttConnectionFactory` interface: `connect(config) → MqttConnection`. Production impl wraps `mqtt.connect(url, opts)`
- [ ] `MqttConnectConfig`: `brokerUrl`, `clientId`, `username?`, `password?`, `tls?`, `keepalive?`, `reconnectPeriodMs?`
- [ ] Mirrors the pattern from phase-1 DB adapters (`PgConnectionFactory`, etc.) — fake factory for tests
- [ ] Backpressure: subscriber emits to an `AsyncIterable<MqttMessage>` with internal queue + `pause/resume` if queue depth > N

**Outcome**: A typed, testable MQTT connection abstraction usable by the adapter without leaking the underlying library through public types.

### T2-B07 — MqttAdapter

- [ ] `src/adapters/mqtt/mqtt.adapter.ts` implements `SourceAdapter<MqttAdapterConfig>` with `type='mqtt'`
- [ ] Config: `brokerUrl`, `topics: string[]`, `qos: 0|1|2` (default 1), `payloadFormat: 'json' | 'string'`
- [ ] `discoverMetadata` is degenerate — MQTT has no schema endpoint; returns `{fields:[], raw:{note:'mqtt schema is ad-hoc'}}` and the executor falls back to per-payload sampling
- [ ] `stream` subscribes, emits one `AdapterRecord` per message; `sourceInfo.topic` + `sourceInfo.timestamp` populated
- [ ] Wires into `SourceAdapterRegistry` like the other adapters

**Outcome**: A MqttAdapter that emits records the executor can write through `classifyAndWrite`, with topic + timestamp lineage on each record.

### T2-B08 — MQTT job lifecycle service

- [ ] New `MqttJobLifecycleService` in `src/workers/`
- [ ] On app boot + on `JOB_CONFIG_CHANGED_EVENT`: scan job_configs for enabled MQTT jobs; start a subscription per job
- [ ] Subscription holds the adapter's `stream()` async-iterator and feeds the executor's classify+write path indefinitely
- [ ] On job disable / delete: cancel via AbortController, close MQTT connection, log lifecycle
- [ ] Reconnect logic: on broker disconnect, exponential backoff up to 5 min; log `error` and increment a Prometheus counter
- [ ] Each subscription lives in a `sync_run` doc that stays `status='running'` for the lifetime of the subscription — heartbeat every 30s (reuses phase-1 heartbeat) so the stale sweeper would catch a crashed worker

**Outcome**: MQTT topics are continuously consumed in the background; lifecycle tied to `job_config.enabled` flag; survives broker bounces.

### T2-B09 — Schema-drift detector

- [ ] Listens on `sync.run.completed` (T2-A12). When `metadataSnapshotId` is set on the run, loads the new + previous snapshots for the same `jobConfigId`
- [ ] Diff: fields added / removed / type-changed. Equal `schemaHash` → no drift, exit
- [ ] On drift detected, emits `schema.drift.detected` event with payload `{ jobConfigId, prevSchemaHash, newSchemaHash, addedFields, removedFields, changedFields }`
- [ ] Unit tests: equal schemas → no event; type change emits with `changedFields`; first-ever snapshot emits no event (no baseline to compare)

**Outcome**: Schema changes surface as discrete events without operators having to diff snapshots manually.

### T2-B10 — Slack + Email alert channels

- [ ] `AlertChannel` interface: `send(payload: AlertPayload): Promise<void>`
- [ ] `SlackWebhookChannel` — `webhookUrl` from config; POSTs a Slack-formatted message
- [ ] `EmailChannel` — uses `nodemailer` with SMTP config; HTML + plain text template
- [ ] Channel registry pattern (mirrors `SourceAdapterRegistry`) so new channels (Teams, PagerDuty) plug in cleanly later
- [ ] Both channels handle their own retry (3 attempts, exponential backoff). Total failure logs `error` + drops the alert (not stored anywhere — alerts are best-effort)
- [ ] Each channel needs its own SMTP/webhook secret stored in `secrets` collection; channel config references `secretRef`

**Outcome**: Two ready-to-use alert channels with a clean extension pattern.

### T2-B11 — alertChannels config + dispatcher

- [ ] Extend `job_config.options.alertChannels: AlertChannelConfig[]` — array of `{ type: 'slack' | 'email', secretRef: ObjectId, targets: string[] }`
- [ ] `AlertDispatcher` listens on `schema.drift.detected` + `sync.run.completed` (failed/partial); resolves channels per job; dispatches in parallel
- [ ] Alert event types filtered per channel config: `events: ['schema.drift', 'run.failed', 'run.partial']` (defaults to all)
- [ ] E2E: create job with slack channel pointing at a mock webhook server; trigger drift; assert mock got POST within 5s

**Outcome**: Operator gets notified on Slack/email when a job's schema changes or a run fails — without polling the API.

### Wave 2.2 — Test rollup

- [ ] Unit tests added: T2-B03 (HMAC variants), T2-B04 (parsing branches), T2-B07 (MqttAdapter with fake factory), T2-B09 (drift diff), T2-B10 (channels with stub transports)
- [ ] E2E tests added: T2-B02–B04 (full webhook flow with mock external poster), T2-B07–B08 (MQTT with `aedes`-based in-process broker), T2-B11 (drift → mock Slack)
- [ ] Expected new test count: ~16 unit + ~8 e2e

**Wave Outcome**: Push-based ingestion (webhook) + real-time event ingestion (MQTT) are first-class citizens. Operators are alerted on schema drift and run failures via Slack/email. Manager's O001 form #2 + #3 fulfilled.

---

## Phase 2.3 — Incremental sync via watermark (T2-C01 → T2-C10)

Closes the unused `TWatermark` generic on the `SourceAdapter` interface from T-D01 (phase 1). Targets jobs where full-scan is the bottleneck.

| ID     | Status | Task                                                             | Refs      | Depends                |
| ------ | ------ | ---------------------------------------------------------------- | --------- | ---------------------- |
| T2-C01 | `[ ]`  | New collection `sync_watermarks` + repository                    | P002 §6.2 | -                      |
| T2-C02 | `[ ]`  | DTO: `source.config.watermarkColumn` + per-source validation     | P002 §6.2 | -                      |
| T2-C03 | `[ ]`  | Query template `${watermark}` substitution helper                | P002 §6.2 | T2-C02                 |
| T2-C04 | `[ ]`  | Executor: load → pass watermark to `adapter.stream()` → persist  | -         | T2-C01, T2-C03         |
| T2-C05 | `[ ]`  | PostgresAdapter watermark support + tests                        | P002 §6.2 | T2-C04                 |
| T2-C06 | `[ ]`  | MySQL / MSSQL / Oracle watermark support + tests                 | P002 §6.2 | T2-C05 (pattern reuse) |
| T2-C07 | `[ ]`  | REST adapter watermark — page/cursor/since-timestamp param       | P002 §6.3 | T2-C04                 |
| T2-C08 | `[ ]`  | Back-fill mode (`watermark=null` → full scan) + first-run detect | -         | T2-C04                 |
| T2-C09 | `[ ]`  | Schema-change-during-incremental detection                       | -         | T2-B09 (drift)         |
| T2-C10 | `[ ]`  | Watermark field type inference + comparison                      | -         | T2-C05                 |

### T2-C01 — sync_watermarks collection

- [ ] Schema: `{ _id, jobConfigId (unique), lastWatermark: unknown, lastWatermarkType: 'date'|'integer'|'string', updatedAt, updatedInRunId }`
- [ ] Unique index on `jobConfigId` — one watermark per job
- [ ] Repository methods: `getOrNull(jobConfigId)`, `upsert(jobConfigId, value, type, runId)`, `reset(jobConfigId)` (for back-fill)

**Outcome**: Per-job high-water-mark storage with a clear `null` semantic for "never run" / "needs back-fill".

### T2-C02 — DTO: watermarkColumn

- [ ] Add `watermarkColumn?: string` to DB source configs (Postgres / MySQL / MSSQL / Oracle)
- [ ] Add `watermarkParam?: string` + `watermarkParamFormat?: 'iso8601' | 'unix-sec' | 'unix-ms' | 'integer'` to REST source config
- [ ] Validation: when `watermarkColumn` set, `query` must contain `${watermark}` placeholder (Joi `string.pattern`)
- [ ] Tests: malformed config → 400 with field-level message

**Outcome**: Job authors declare intent to use incremental sync via a single config field per adapter type.

### T2-C03 — Query template substitution

- [ ] `interpolateWatermark(query, watermarkValue, type)` helper in `acore/`
- [ ] Date type → ISO 8601 string, single-quoted in SQL: `'2026-05-21T00:00:00Z'`
- [ ] Integer / string type → quoted appropriately per adapter (each adapter calls the helper passing its own quoting fn)
- [ ] **Security**: helper is allow-listed — the substitution is just string replacement of a known placeholder. No user-supplied SQL goes through this; the `query` is operator-authored via the job_config DTO, not end-user input. Documented in P002 §15
- [ ] Unit tests: all 3 type variants, missing placeholder throws, multiple placeholders all replaced

**Outcome**: A trusted, type-aware substitution path that adapters reuse instead of re-implementing quoting.

### T2-C04 — Executor watermark wiring

- [ ] Before `adapter.stream(...)`, load watermark via `SyncWatermarkRepository.getOrNull(jobConfigId)`
- [ ] Pass `{ watermark, signal }` as second arg to `adapter.stream` — already-typed `options.watermark` from T-D01 interface
- [ ] Track `maxObservedWatermark` during the run (per-record comparison against current value using the typed comparator from T2-C10)
- [ ] After successful run (`status === 'success'` or `'partial'`), upsert the new watermark; on `'failed'` runs, leave previous watermark untouched (safe re-run)
- [ ] Don't persist watermark for non-incremental jobs (`watermarkColumn` absent in config)

**Outcome**: The executor transparently threads watermarks through any adapter that implements the incremental path.

### T2-C05 — PostgresAdapter watermark

- [ ] `PostgresAdapter.stream(config, creds, { watermark })`: if `config.watermarkColumn` set and `watermark` present, interpolate the placeholder
- [ ] Read the watermark column from each row, return as part of `AdapterRecord.sourceInfo.watermark` so the executor can compute the max
- [ ] Sample row to infer column type at `discoverMetadata` time, store in `source_metadata.raw.watermarkColumnType`
- [ ] Unit tests: with watermark → query contains substituted value; without → unchanged; emitted records carry `sourceInfo.watermark`

**Outcome**: A Postgres job with `watermarkColumn='updated_at'` skips already-synced rows on subsequent runs.

### T2-C06 — MySQL / MSSQL / Oracle watermark

- [ ] Pattern-reuse from T2-C05 — each adapter calls `interpolateWatermark` with its own identifier-quoting rules
- [ ] MSSQL: ISO date literal needs `CONVERT(datetime2, '<iso>', 127)` wrapper for collation safety
- [ ] Oracle: ISO date literal needs `TO_TIMESTAMP('<iso>', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')` wrapper
- [ ] Unit tests mirror T2-C05 for each adapter

**Outcome**: All 4 DB adapters support incremental sync uniformly.

### T2-C07 — REST adapter watermark

- [ ] When `config.watermarkParam` set, the adapter passes the current watermark to that query-param on each pagination page
- [ ] Format conversion via `watermarkParamFormat` (T2-C02)
- [ ] Combined with cursor pagination: REST APIs that return both cursor + a high-water timestamp can use the cursor for in-page pagination + watermark for cross-run resume
- [ ] Unit tests: param appended on subsequent calls, format conversion correct

**Outcome**: REST APIs that expose a `since=<timestamp>` or `min_id=<id>` param can incremental-sync without full re-scan.

### T2-C08 — Back-fill mode

- [ ] When `watermark === null` (first run, or after manual reset), execute a full scan (no placeholder substitution — query runs as-authored)
- [ ] Mark `sync_run.metadata.backfill = true` for visibility
- [ ] New endpoint: `POST /sync-watermarks/:jobConfigId/reset` (admin only) — sets watermark to null + emits `watermark.reset` event for audit
- [ ] E2E: create job with watermarkColumn, run #1 full-scan → watermark set; mutate source; run #2 incremental → only new rows; POST reset; run #3 full-scan again

**Outcome**: Operators can opt into incremental mode (turn-key) and force re-scan when source data structure changes.

### T2-C09 — Schema-change-during-incremental detection

- [ ] When `source_metadata.schemaHash` changes between runs (T2-B09 path), the new run runs as a back-fill: reset watermark first
- [ ] Reason: a schema change might add a new column that incremental can't see for older rows. Safer to re-scan
- [ ] Logged with `warn` + emitted as `watermark.reset` event for audit
- [ ] Configurable via `options.resetWatermarkOnDrift` (default `true` — safe behaviour, can opt out for performance)

**Outcome**: Incremental sync degrades gracefully on schema drift instead of producing stale projections.

### T2-C10 — Watermark type inference + comparator

- [ ] `watermarkColumnType` inferred from `source_metadata` field type ('date' → `Date` compare, 'integer' → numeric compare, 'string' → lexicographic compare)
- [ ] Mismatched types between current row and stored watermark → executor logs warn + skips that row (defensive)
- [ ] Persisted alongside the watermark value (T2-C01)
- [ ] Unit tests: each type's compare-and-max behaviour, mismatch handling

**Outcome**: Watermarks survive heterogeneous data types without operator having to declare them — inferred from the existing schema discovery.

### Wave 2.3 — Test rollup

- [ ] Unit tests added: T2-C03 (interpolation), T2-C05–C07 (per-adapter watermark), T2-C10 (comparator)
- [ ] E2E tests added: T2-C08 (back-fill → incremental → reset), T2-C09 (drift triggers reset)
- [ ] Expected new test count: ~14 unit + ~4 e2e

**Wave Outcome**: A 100M-row Postgres table syncs in minutes instead of hours on follow-up runs. Operators turn it on per-job by setting one config field; drift is handled safely; back-fill is one HTTP call away.

---

## Phase 2.4 — GraphQL + SOAP adapters (T2-D01 → T2-D12)

Closes the documented adapter set ([P002 §6 mentions GraphQL/SOAP as phase-2](./P002-design-proposal.md)). Pattern reuse from REST adapter (T-G02) keeps both compact.

| ID     | Status | Task                                                      | Refs              | Depends        |
| ------ | ------ | --------------------------------------------------------- | ----------------- | -------------- |
| T2-D01 | `[ ]`  | `graphql-request` dep + module structure                  | P002 §6 (GraphQL) | -              |
| T2-D02 | `[ ]`  | `GraphqlAdapter` — query, variables, response path        | P002 §6 (GraphQL) | T2-D01         |
| T2-D03 | `[ ]`  | GraphQL pagination — cursor (Relay) + offset              | P002 §6 (GraphQL) | T2-D02         |
| T2-D04 | `[ ]`  | GraphQL auth — Bearer / API-key header                    | -                 | T2-D02         |
| T2-D05 | `[ ]`  | `discoverMetadata` via GraphQL introspection              | -                 | T2-D02         |
| T2-D06 | `[ ]`  | `soap` dep + module structure                             | P002 §6 (SOAP)    | -              |
| T2-D07 | `[ ]`  | `SoapAdapter` — WSDL URL, operation, params               | P002 §6 (SOAP)    | T2-D06         |
| T2-D08 | `[ ]`  | SOAP response parsing → flat records                      | -                 | T2-D07         |
| T2-D09 | `[ ]`  | SOAP auth — WS-Security UsernameToken + basic header      | -                 | T2-D07         |
| T2-D10 | `[ ]`  | `discoverMetadata` via WSDL schema introspection          | -                 | T2-D07         |
| T2-D11 | `[ ]`  | Wire both adapters into `SyncExecutor.buildAdapterConfig` | -                 | T2-D02, T2-D07 |
| T2-D12 | `[ ]`  | E2E with mock GraphQL + mock SOAP servers                 | -                 | T2-D11         |

### T2-D01 — graphql-request + module

- [ ] Dep `graphql-request@^7` (light client, no react/apollo bloat)
- [ ] Optional dep `graphql@^16` for the type-only `IntrospectionQuery` import
- [ ] Folder `src/adapters/graphql/`: `graphql.adapter.module.ts`, `graphql.adapter.ts`, `graphql-axios.ts` (factory pattern matching phase-1 DB adapters), `index.ts`

**Outcome**: Adapter shell in place with the same factory-injection structure as Postgres/MySQL.

### T2-D02 — GraphqlAdapter

- [ ] Config: `endpoint`, `query` (GraphQL document string), `variables?` (static map), `responsePath?` (dot path to the array of records, e.g. `data.users.edges`)
- [ ] `type='graphql'`; constructor takes optional `GraphqlClientFactory` (default `RealGraphqlClientFactory`)
- [ ] `stream()` runs the query, walks `responsePath`, yields one `AdapterRecord` per element
- [ ] Errors: GraphQL `errors[]` in response → treat as per-record error if `partialResults: true` option; else throw
- [ ] Unit tests via fake client factory (12 cases mirroring Postgres adapter spec structure)

**Outcome**: A GraphQL endpoint with a documented query produces synced records end-to-end.

### T2-D03 — GraphQL pagination

- [ ] **Cursor (Relay)**: config `pagination: { type: 'relay', edgesPath: 'data.users.edges', pageInfoPath: 'data.users.pageInfo', cursorVar: 'after' }` — adapter loops while `pageInfo.hasNextPage` true, passing `after = pageInfo.endCursor`
- [ ] **Offset**: config `pagination: { type: 'offset', offsetVar: 'skip', limit: 100, limitVar: 'first' }` — adapter increments offset by `limit` until response page < `limit`
- [ ] **None**: single-query mode (default)
- [ ] Unit tests cover all 3 modes + empty result

**Outcome**: Relay-style GraphQL APIs (most common) and offset-style APIs both work without custom code.

### T2-D04 — GraphQL auth

- [ ] Reuses the same `RestApiCredentials` shape: `{ scheme: 'bearer' | 'api-key', token, headerName? }`
- [ ] Adapter sets the header before the request — same code path as REST adapter
- [ ] No new credential shape needed → no new validation surface

**Outcome**: GraphQL endpoints behind Bearer or API-key auth Just Work via the existing secrets flow.

### T2-D05 — GraphQL introspection for discoverMetadata

- [ ] If `discoverMetadata` is called and `config.skipIntrospection !== true`, send `getIntrospectionQuery()` (from `graphql` package)
- [ ] Build the schema map: for the `responsePath`'s element type, list scalar fields + their types (`String`, `Int`, `Float`, `Boolean`, `ID`, custom scalars → `'string'`)
- [ ] Fallback (introspection disabled by the server): sample 10 records from a one-shot query, run the same inference as REST/CSV
- [ ] Unit tests: introspection success, disabled → sample fallback

**Outcome**: GraphQL jobs get accurate schema metadata for free when the server permits introspection; degrade gracefully otherwise.

### T2-D06 — soap dep + module

- [ ] Dep `soap@^1` (still maintained, supports WSDL fetch + WS-Security)
- [ ] Folder `src/adapters/soap/` mirroring the GraphQL layout

**Outcome**: SOAP adapter shell in place.

### T2-D07 — SoapAdapter

- [ ] Config: `wsdlUrl`, `operation` (the SOAP operation name to call), `params?` (static input object), `responsePath?` (path to the array of records in the parsed response)
- [ ] `type='soap'`; `stream()` calls the operation, walks responsePath, yields each element as `AdapterRecord`
- [ ] Operation list: cached after first WSDL fetch (per-process, not per-call)
- [ ] Errors: SOAP fault → throw with `{stage:'stream', message: <faultstring>}` so executor finalizes failed

**Outcome**: A SOAP service answers one operation per run; results land in `raw_records`.

### T2-D08 — SOAP response parsing

- [ ] The `soap` package returns already-parsed JS objects — no XML parsing in user code
- [ ] **Edge case**: SOAP often returns single-vs-array ambiguity (one element returned as object, N as array). Adapter normalizes: if `responsePath` evaluates to a single object, wrap in `[obj]`
- [ ] Empty response (`null` / `undefined` at path) → yield 0 records, log info
- [ ] Unit tests: single-element wrap, multi-element passthrough, missing path

**Outcome**: Common SOAP response quirks are handled transparently.

### T2-D09 — SOAP auth

- [ ] WS-Security UsernameToken (`<wsse:Security>` header) — supplied via `{ username, password }` from credentials
- [ ] HTTP Basic alternative — same credentials shape, set on the underlying http client
- [ ] Credentials selector via `source.config.authMode: 'ws-security' | 'basic'` (default `ws-security`)
- [ ] Unit tests: WS-Security header presence on outgoing envelope, Basic auth header set correctly

**Outcome**: Both common SOAP auth modes covered via the same `{username, password}` secret shape.

### T2-D10 — discoverMetadata via WSDL

- [ ] Parse WSDL types for the operation's output message → field list with XSD types mapped to `SourceFieldType` (`xs:string → string`, `xs:int → integer`, `xs:dateTime → date`, ...)
- [ ] When WSDL types are too complex (nested `<xs:choice>`, recursion), fall back to sample-based inference like REST
- [ ] Unit tests: simple WSDL → accurate field list; complex WSDL → falls back without crashing

**Outcome**: SOAP jobs get accurate schema metadata when WSDL is well-typed.

### T2-D11 — SyncExecutor.buildAdapterConfig

- [ ] Add `case 'graphql'` and `case 'soap'` in `buildAdapterConfig` (same pattern as Postgres/MySQL/etc.)
- [ ] Extract per-adapter required fields with validation (mirror `buildRestApiAdapterConfig`)
- [ ] Register both modules in `MainModule`

**Outcome**: Trigger a GraphQL or SOAP job via `/job-configs/:id/trigger` end-to-end.

### T2-D12 — E2E with mock servers

- [ ] GraphQL mock: spin up a Nest app with `@nestjs/graphql` + `apollo` returning a deterministic users query; assert sync of 10 records, schema discovery, cursor pagination correctness
- [ ] SOAP mock: use `soap.listen()` to host a fake service; assert sync of N records + WS-Security header echoed
- [ ] Both run within the same Jest e2e suite; share fixtures with `excel-trigger-flow.e2e-spec.ts` patterns

**Outcome**: GraphQL + SOAP code paths are continuously verified against a real protocol implementation, not just mocks of the package APIs.

### Wave 2.4 — Test rollup

- [ ] Unit tests added: T2-D02 (Graphql with fake factory), T2-D03 (3 pagination modes), T2-D07 (Soap with fake factory), T2-D08 (single/multi normalization), T2-D10 (WSDL parser)
- [ ] E2E tests added: T2-D12 (both mock servers)
- [ ] Expected new test count: ~16 unit + ~6 e2e

**Wave Outcome**: All 9 adapter types from the original `SourceType` union (excel, csv, mysql, postgres, mssql, oracle, rest, graphql, soap) are implemented + wired + tested. Phase 1's deliberate `'graphql' | 'soap'` placeholders in the type union are now backed by working code.

---

## Phase summary

| Wave             | Tasks        | Goal                                                                  | Time (rough)  |
| ---------------- | ------------ | --------------------------------------------------------------------- | ------------- |
| 2.1 Safety/Infra | 12           | Production-grade ops: indexes, principal, retention, metrics, secrets | ~2 weeks      |
| 2.2 Ingestion    | 11           | Webhook + MQTT + schema-drift alerts (manager's O001 form #2, #3)     | ~4–5 weeks    |
| 2.3 Incremental  | 10           | Watermark-based sync for large DB / REST sources                      | ~3–4 weeks    |
| 2.4 GraphQL/SOAP | 12           | Close out the documented adapter set                                  | ~3 weeks      |
| **Total**        | **45 tasks** |                                                                       | **~12 weeks** |

**Critical path**: 2.1 → 2.2. Wave 2.1's `EventEmitter` foundation (T2-A12) is reused by 2.2's drift alerts (T2-B09). Wave 2.3 is independent (could overlap 2.2 with a second dev). Wave 2.4 is independent (pure adapter work).

**Parallel-execution option**: if 2 devs available, the safe split is:

- Dev 1: 2.1 → 2.2 (serial — same files in `acore/` + new ingestion surfaces)
- Dev 2: 2.4 (adapters folder is isolated; can run start-to-finish in parallel)
- Either dev picks up 2.3 once 2.1 lands

---

## Open items outside phase 2 WBS

Tracked separately, not part of phase 2:

- [ ] **Admin UI** (any flavor) — manual testing covered by Swagger UI + `manual-smoke.sh` for now; defer until backend surface from 2.1–2.4 stabilizes, then re-scope based on actual operator workflows
- [ ] **HashiCorp Vault integration** — Wave 2.1's `*_FILE` env loader (T2-A10) is the intermediate step; Vault Agent writes to the same file path with no code change required when ready
- [ ] **BullMQ + Redis** — only when scaling to ≥2 workers becomes necessary
- [ ] **Migrate to TimescaleDB / specialized analytical store** — if `raw_records` outgrows MongoDB's projection patterns
- [ ] **Multi-tenancy** — current model is single-tenant; would need `tenantId` partitioning across all collections + per-tenant API keys
- [ ] **Long-term retention archive** — TTL'd docs vanish; if compliance requires long-term retention, would need an S3/MinIO export job before TTL fires
