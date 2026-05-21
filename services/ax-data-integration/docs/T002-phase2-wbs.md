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
| T2-A01 | `[ ]`  | Auto-run `ensureIndexes()` at `onApplicationBootstrap`                         | T001 review finding         | -              |
| T2-A02 | `[ ]`  | `/health/ready` verifies critical indexes exist                                | P002 §11, §13               | T2-A01         |
| T2-A03 | `[ ]`  | `ApiKeyGuard` extracts a stable principal id (hash/index) onto the request     | T001 Open Items             | -              |
| T2-A04 | `[ ]`  | Controllers consume `request.principal` instead of `PHASE_1_PRINCIPAL` literal | -                           | T2-A03         |
| T2-A05 | `[ ]`  | Retention env config (`INTEGRATION_TTL_CHANGELOG_DAYS`, `…_SYNC_RUN_DAYS`)     | P002 §13                    | -              |
| T2-A06 | `[ ]`  | TTL index on `raw_record_changelog.createdAt`                                  | P001 §createdAt requirement | T2-A05, T2-A01 |
| T2-A07 | `[ ]`  | TTL index on `sync_runs.createdAt`                                             | P001 §createdAt requirement | T2-A05, T2-A01 |
| T2-A08 | `[ ]`  | `prom-client` + `MetricsModule` exposing `/metrics`                            | P002 §13.2                  | -              |
| T2-A09 | `[ ]`  | Instrument `SyncExecutorService` with counters + histogram                     | P002 §13.2                  | T2-A08         |
| T2-A10 | `[ ]`  | Master-key file loader (`INTEGRATION_MASTER_KEY_V*_FILE` overrides env)        | T001 Open Items             | -              |
| T2-A11 | `[ ]`  | `docker-compose.yml` uses Docker secret for master key in prod profile         | -                           | T2-A10         |
| T2-A12 | `[ ]`  | `EventEmitter` emits `sync.run.completed` after every finalize                 | P002 §13.3                  | -              |

### T2-A01 — Auto-run ensureIndexes() on app bootstrap

- [ ] `MongoModule` implements `OnApplicationBootstrap`; in its hook, call `ensureIndexes(db)` and log per-index `action` (created/existed/changed)
- [ ] Add `INTEGRATION_SKIP_INDEX_ENSURE` env (default `false`) so emergency rollbacks can disable auto-create
- [ ] Time-boxed: if `ensureIndexes` takes >30s, log warning + continue (don't block boot indefinitely)
- [ ] `src/migrate-indexes.ts` keeps working — operators can still run it standalone for back-fill / debugging
- [ ] Unit test: bootstrap hook calls `ensureIndexes` once; respects skip flag
- [ ] E2E: fresh Mongo + service start → all 19 indexes present without operator running migrate-indexes

**Outcome**: A fresh deploy never lands in the "indexes missing → overlapping runs allowed" trap that the manual-smoke test exposed. `ensureIndexes` runs on every boot, is idempotent (re-runs report `existed`), and is logged so SRE can audit drift.

### T2-A02 — `/health/ready` verifies critical indexes

- [ ] `HealthController.readiness` now also calls `collection('sync_runs').indexes()` and asserts the partial-unique `(jobConfigId, status='running')` exists
- [ ] Response on failure: 503 with `{status: 'not-ready', mongo: 'connected', indexes: 'missing', missing: ['<index name>']}`
- [ ] Critical-index list lives next to `indexes.ts` (one source of truth) — readiness asserts on it
- [ ] Unit tests cover: index present → 200; partial-unique missing → 503 with name; index list endpoint can be tested in isolation
- [ ] Don't fail readiness on non-critical indexes (e.g. TTL indexes) — log warn only, return 200

**Outcome**: Kubernetes won't route traffic to a service that booted before `ensureIndexes` completed (or failed). Distinguishes "Mongo down" from "Mongo up but mis-configured" — both are 503 but the payload tells the operator which.

### T2-A03 — ApiKeyGuard extracts principal id

- [ ] Add a per-key SHA-256 hash (first 8 chars) when parsing `INTEGRATION_API_KEYS` at boot
- [ ] On `canActivate`, attach `request.principal = { keyHash: '<8 chars>' }` to the Express request
- [ ] New `@CurrentPrincipal()` param decorator extracts it in controllers
- [ ] `INTEGRATION_API_KEY_LABELS` env (optional CSV, parallel to `INTEGRATION_API_KEYS`) gives each key a human label — surfaces as `request.principal.label` when present
- [ ] Unit tests: hash stability (same key → same hash), label mapping, missing label falls back to `'key-<hash>'`

**Outcome**: Every authenticated request carries a stable principal identifier without storing the raw API key. Operator can grep audit logs by hash or label.

### T2-A04 — Controllers consume request.principal

- [ ] `JobConfigController` + `SecretsController` replace hardcoded `'api-key'` with `@CurrentPrincipal()` decorator
- [ ] `createdBy` / `updatedBy` audit fields now store the principal label (or hash) consistently
- [ ] Migration NOT needed — existing records with `createdBy='api-key'` are accepted as legacy data
- [ ] Update e2e tests: assert `createdBy` matches the principal label of the test API key
- [ ] Both `// TODO: replace with the API-key principal` comments removed

**Outcome**: Audit attribution is real — operator looking at a job_config knows which API key created it (by label, not raw key).

### T2-A05 — Retention env config

- [ ] `INTEGRATION_TTL_CHANGELOG_DAYS` (default `90`)
- [ ] `INTEGRATION_TTL_SYNC_RUN_DAYS` (default `30`)
- [ ] Joi validation: positive integer, max `3650` (10 years — protects from typos like `infinity`)
- [ ] Document in README env vars table that `raw_records` is NOT TTL'd (source of truth) and that GridFS `source_files` are pruned only via `DELETE /source-files/:id` (no automatic retention)

**Outcome**: Operators can tune retention without code changes; defaults are conservative enough for compliance-light internal use.

### T2-A06 — TTL index on raw_record_changelog.createdAt

- [ ] Add to `indexes.ts`: `{ createdAt: 1 }` with `expireAfterSeconds: ttlChangelogDays * 86400`
- [ ] `ensureIndexes` detects TTL-value-changed (env var bumped) and recreates the index in-place
- [ ] E2E test: insert backdated changelog entries, run Mongo's `_lock.checkRoutines` (or wait via `INTEGRATION_TTL_SECONDS_OVERRIDE` test hook), assert deletion
- [ ] Test hook: env override `INTEGRATION_TTL_CHANGELOG_SECONDS` (integer seconds) ONLY honored when `NODE_ENV=test` — lets e2e bypass the day-granularity floor

**Outcome**: `raw_record_changelog` self-prunes after 90 days (or whatever the operator sets). Audit history is bounded; Mongo storage doesn't grow unbounded.

### T2-A07 — TTL index on sync_runs.createdAt

- [ ] Mirror T2-A06 for `sync_runs` with `INTEGRATION_TTL_SYNC_RUN_DAYS` (default 30)
- [ ] **Edge case**: a `parentRunId` may point to an already-expired run after enough time. `GET /sync-runs/:id` returns 404 in that case (correct — the parent run is gone). Document in Swagger
- [ ] E2E: backdated run TTLs out; new run that referenced it as `parentRunId` still resolves

**Outcome**: `sync_runs` retention bounded; old run history doesn't accumulate forever.

### T2-A08 — prom-client + /metrics endpoint

- [ ] Dep `prom-client@^15`
- [ ] `MetricsModule` registers the default Node.js process metrics (memory, CPU, event loop lag) automatically
- [ ] `MetricsController` exposes `GET /metrics` returning `Content-Type: text/plain; version=0.0.4`
- [ ] `@Public()` on the controller (Prometheus scrape doesn't carry the API key)
- [ ] But protect with a separate `INTEGRATION_METRICS_TOKEN` (optional) — if set, requires `Authorization: Bearer <token>`. If unset, public scrape (suitable for closed VPN deploy)
- [ ] Swagger entry under `Service` tag

**Outcome**: Prometheus can scrape `/metrics`; default Node.js process metrics ship for free. Custom metrics come in T2-A09.

### T2-A09 — Instrument SyncExecutorService

- [ ] `sync_run_total{status,jobConfigId}` counter — incremented on `finalize`
- [ ] `sync_run_duration_seconds{status,jobConfigId}` histogram — observed on `finalize` (`finishedAt - startedAt`)
- [ ] `sync_run_records_total{op,jobConfigId}` counter — `op` ∈ `{inserted, updated, unchanged, deleted, errors}`, incremented per `classifyAndWrite`
- [ ] Cardinality guard: when `jobConfigId` label distinct values exceed 100, fall back to summarizing as `'overflow'` (Prometheus best-practice — see [prom-client cardinality FAQ](https://github.com/siimon/prom-client))
- [ ] Unit test: stub clock, execute one run with mixed counts, assert counter values
- [ ] E2E: trigger 3 runs, scrape `/metrics`, assert non-zero values for each metric

**Outcome**: Grafana dashboard can show I/U/D per job, success rate, p50/p95 run duration without touching `sync_runs` collection.

### T2-A10 — Master-key file loader

- [ ] `loadMasterKeyRing` extended: for each `INTEGRATION_MASTER_KEY_V<N>_FILE` env, read file content (trimmed) as the key; falls back to `INTEGRATION_MASTER_KEY_V<N>` env if file env not set
- [ ] Both env styles must NOT be set simultaneously for the same version — startup throws
- [ ] File-read happens once at boot; failures (missing file, wrong permissions) abort boot with a clear message that doesn't leak file contents
- [ ] Unit tests: file precedence, missing file, both set throws, file with trailing newline accepted

**Outcome**: Master key can be supplied via Docker secret (file mounted at `/run/secrets/master_key_v1`), Kubernetes secret, or Vault Agent sidecar. No code change to add a Vault adapter later.

### T2-A11 — docker-compose uses Docker secret in prod profile

- [ ] `docker-compose.yml` adds a `secrets:` section + `secrets.master_key_v1.file` pointing at `./secrets/master_key_v1.txt` (gitignored)
- [ ] Service definition mounts the secret at `/run/secrets/master_key_v1` and sets `INTEGRATION_MASTER_KEY_V1_FILE=/run/secrets/master_key_v1`
- [ ] **Compose profiles**: `prod` profile uses secrets; default profile keeps env-var flow for dev velocity
- [ ] `.env.compose.example` documents both modes with the trade-off
- [ ] README "Run via Docker compose" section updated with `docker compose --profile prod up`

**Outcome**: Operator can ship to a server where the master key never touches `.env` — it's a separate file with `chmod 400`. Vault migration is a future doc-only step (Vault Agent writes to the same file path).

### T2-A12 — sync.run.completed event

- [ ] `SyncExecutorService.execute` emits `sync.run.completed` event right after `runs.finalize`
- [ ] Payload: `{ jobConfigId, syncRunId, status, counts, durationMs, triggeredBy }`
- [ ] Synchronous fire (no `await`), best-effort — listeners that throw must not break the executor (already the default `EventEmitter2` behaviour)
- [ ] Document in `services.module.ts` how downstream wires `@OnEvent('sync.run.completed')` listeners
- [ ] Phase 1's `JOB_CONFIG_CHANGED_EVENT` is the pattern reference — mirror it

**Outcome**: Webhook / MQTT alerts in T2-B and schema-drift alerts in T2-B09 have a clean integration point without coupling to the executor.

### Wave 2.1 — Test rollup

- [ ] Unit tests added: T2-A01 (bootstrap hook), T2-A03 (principal extraction), T2-A09 (metric instrumentation), T2-A10 (file loader)
- [ ] E2E tests added: T2-A02 (readiness with index check), T2-A06/A07 (TTL deletion), T2-A09 (`/metrics` scrape), T2-A12 (event listener integration)
- [ ] Expected new test count: ~12 unit + ~6 e2e

**Wave Outcome**: Service starts and self-configures (indexes, TTL); readiness probe catches mis-configuration before traffic; principal attribution real; storage bounded; observability via Prometheus; secret can live outside `.env`. Production deploy gate cleared.

---

## Phase 2.2 — Manager's ingestion asks (T2-B01 → T2-B11)

Closes the manager's remaining form asks in [O001](./O001-data-integration.md): #2 (webhook push) + #3 (MQTT/event). Adds schema-drift alerting on top of T2-A12's event hooks.

| ID     | Status | Task                                                                 | Refs         | Depends                |
| ------ | ------ | -------------------------------------------------------------------- | ------------ | ---------------------- |
| T2-B01 | `[ ]`  | Add `'webhook'` to `SourceType` union + create-job DTO branch        | O001 form #2 | -                      |
| T2-B02 | `[ ]`  | `WebhookController` — `POST /webhooks/:jobConfigId`                  | O001 form #2 | T2-B01                 |
| T2-B03 | `[ ]`  | HMAC signature verify (`x-webhook-signature` + per-job secret)       | -            | T2-B02                 |
| T2-B04 | `[ ]`  | Webhook → `WebhookIngestionService` → reuse `classifyAndWrite`       | -            | T2-B02, T-E04 (phase1) |
| T2-B05 | `[ ]`  | "Push-only" schedule mode — accept enabled job without cron          | -            | T2-B01                 |
| T2-B06 | `[ ]`  | `mqtt` dep + `MqttConnectionFactory` abstraction                     | O001 form #3 | -                      |
| T2-B07 | `[ ]`  | `MqttAdapter` — subscribe → emit AdapterRecord per message           | -            | T2-B06                 |
| T2-B08 | `[ ]`  | MQTT job lifecycle service (start on enable, stop on disable/delete) | -            | T2-B07                 |
| T2-B09 | `[ ]`  | Schema-drift detector — compare consecutive `source_metadata` hashes | P002 §6.5    | T2-A12                 |
| T2-B10 | `[ ]`  | Slack + Email alert channel implementations                          | -            | -                      |
| T2-B11 | `[ ]`  | `job_config.options.alertChannels` config + alert dispatcher         | -            | T2-B09, T2-B10         |

### T2-B01 — Webhook source type

- [ ] `SourceType` union adds `'webhook'`
- [ ] `WebhookSourceConfigDto`: `secretRef?` (ObjectId of HMAC secret stored in `secrets`), `signatureHeader?` (default `x-webhook-signature`), `eventField?` (root JSON field to wrap, e.g. `data`)
- [ ] Discriminated-union validation in `CreateJobConfigDto` accepts the new branch
- [ ] Identity rules: `hash` / `composite` / `primary-key` allowed; `row-number` rejected (no source-file context)
- [ ] Schedule rules: `cronExpression` becomes OPTIONAL when `source.type='webhook'` — task T2-B05 handles the schedule-less branch

**Outcome**: A webhook job_config can be created via `POST /job-configs` and persisted with the same lifecycle as other source types.

### T2-B02 — WebhookController endpoint

- [ ] `POST /webhooks/:jobConfigId` — `@Public()` (no API key — auth is HMAC) but rate-limited at module level (NestJS Throttler module)
- [ ] Loads job_config by id, verifies `source.type === 'webhook'`, otherwise 404
- [ ] Accepts JSON body up to 10 MiB (configurable via `INTEGRATION_WEBHOOK_MAX_BYTES`)
- [ ] Returns 202 Accepted with `{ runId }` once payload is enqueued (sync run starts immediately)
- [ ] 4xx codes: 400 malformed JSON, 401 bad signature (T2-B03), 404 unknown jobConfigId, 413 oversized, 429 rate-limited
- [ ] Swagger documented under new tag `Webhooks`

**Outcome**: External system POSTs JSON to `/webhooks/<jobConfigId>`, payload is accepted and a sync_run is created.

### T2-B03 — HMAC signature verify

- [ ] When `source.config.secretRef` is set, controller resolves the secret (decrypted plaintext = HMAC key)
- [ ] Compute `HMAC-SHA256(rawBody, key)` → hex string; constant-time compare with header value
- [ ] When `secretRef` is null (open webhook), skip signature check — log a warning at boot
- [ ] Replay protection: optional `x-webhook-timestamp` + `INTEGRATION_WEBHOOK_MAX_SKEW_SEC` (default 300) — request timestamp must be within ±skew of `Date.now()`
- [ ] Unit tests: valid signature, missing header → 401, body-tampered → 401, replay → 401, no-secret bypass with warn log

**Outcome**: Webhooks from untrusted networks are authenticated cryptographically without depending on API key transport.

### T2-B04 — Webhook ingestion pipeline

- [ ] New `WebhookIngestionService` in `src/services/webhook/`
- [ ] Parses body — if `eventField` is set, treats `body[eventField]` as the array of records; else treats body as a single record (wraps in array)
- [ ] Creates a `sync_run` doc with `triggeredBy='webhook'` (extend `TriggerSource` union)
- [ ] Streams records through the executor's existing `classifyAndWrite` path — no new write logic
- [ ] schemaDiscovery: ad-hoc, samples first 10 records of THIS payload (no upstream metadata endpoint available)
- [ ] Identity strategy enforced as configured (most natural: `hash` for events, `primary-key` for entity-style payloads)

**Outcome**: A webhook payload of 1 or N records lands in `raw_records` with full insert/update/unchanged classification, just like a cron-driven sync.

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
- [ ] Folder `src/adapters/graphql/`: `graphql.adapter.module.ts`, `graphql.adapter.ts`, `graphql-client.ts` (factory pattern matching phase-1 DB adapters), `index.ts`

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
