# ax-data-integration

AX Cowork Data Integration Service — pull-based sync jobs from files / databases / APIs into a MongoDB raw store, with a per-record audit changelog.

> Internal service. Single-node, on-prem. NestJS 11 + MongoDB only — **no Redis, no queue, no multi-worker** in phase 1.

## Quick start

```bash
# From the repo root
pnpm install

# Required env (smallest possible .env)
cat > services/ax-data-integration/.env <<'EOF'
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=ax_data_integration
INTEGRATION_API_KEYS=dev-key
INTEGRATION_MASTER_KEY_V1=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
INTEGRATION_MASTER_KEY_CURRENT=1
EOF

# Run
pnpm dev:di              # or: pnpm --filter ax-data-integration dev
```

Default port: `3012`. Swagger UI: <http://localhost:3012/api-docs>.

### Smoke test once it's up

```bash
curl http://localhost:3012/health                            # → {"status":"ok"}
curl http://localhost:3012/health/ready                      # → {"status":"ready","mongo":"connected"}
curl -H "x-api-key: dev-key" http://localhost:3012/job-configs   # → []
```

For the full hands-on flow (upload Excel → trigger → verify I/U/D + stale recovery + retry), see [`docs/MANUAL-TEST.md`](./docs/MANUAL-TEST.md). To run it automatically with output verification:

```bash
./scripts/manual-smoke.sh
```

The script spins up a dedicated compose stack on ports 3912/27917 (overridable via env), runs S0–S8, prints a pass/fail summary, then tears down.

### Run via Docker compose

```bash
cd services/ax-data-integration
cp .env.compose.example .env
# Edit .env — generate a real master key (openssl rand -base64 32) + a real API key
docker compose up --build
```

Compose brings up a Mongo 7 container + the service container (built from `Dockerfile`) on the same network. Mongo data persists in the named volume `ax-di-mongo-data`. Default host ports: service `3012`, Mongo `27017` — override with `SERVICE_HOST_PORT` / `MONGO_HOST_PORT`.

**`prod` profile — master key as a Docker secret (T2-A11)**:

```bash
mkdir -p secrets
openssl rand -base64 32 > secrets/master_key_v1.txt
chmod 400 secrets/master_key_v1.txt
docker compose --profile prod up --build
```

This brings up `ax-di-service-prod` (on port `3013` by default — override via `SERVICE_HOST_PORT_PROD`) which reads the master key from `/run/secrets/master_key_v1` (mounted from `./secrets/master_key_v1.txt`) instead of `INTEGRATION_MASTER_KEY_V1` in `.env`. The `secrets/` directory is gitignored. Vault Agent migration: point the agent at `./secrets/master_key_v1.txt` — no compose change needed. Pick ONE mode (default OR `--profile prod`) — running both simultaneously double-binds Mongo and confuses the lock semantics.

## Scripts

| Script                                         | Purpose                                     |
| ---------------------------------------------- | ------------------------------------------- |
| `pnpm --filter ax-data-integration dev`        | Start in watch mode                         |
| `pnpm --filter ax-data-integration build`      | Production build (`nest build`)             |
| `pnpm --filter ax-data-integration start:prod` | Run the built artifact (`dist/main`)        |
| `pnpm --filter ax-data-integration lint`       | ESLint --fix                                |
| `pnpm --filter ax-data-integration test`       | Jest unit tests                             |
| `pnpm --filter ax-data-integration test:e2e`   | Jest e2e tests (uses mongodb-memory-server) |

The repo-root alias `pnpm dev:di` is equivalent to the watch script above. A single test file:

```bash
pnpm --filter ax-data-integration exec jest path/to/file.spec.ts -t "test name"
```

## Architecture summary

```text
                          ┌────────────────────────┐
                          │   Admin REST API        │  ← x-api-key
                          │  (NestJS controllers)   │
                          └──────────┬──────────────┘
                                     │
   ┌─────────────────────────────────┼─────────────────────────────────┐
   │                                 │                                 │
┌──▼───────────────┐    ┌────────────▼─────────────┐    ┌──────────────▼──┐
│  Scheduler       │    │  SyncExecutor             │    │  Stale-run      │
│  @nestjs/schedule│───▶│  (concurrency lock,       │    │  sweeper        │
│  dynamic cron    │    │   heartbeat, classify,    │    │  (60s tick)     │
│  registry        │    │   write, audit)           │    │                 │
└──────────────────┘    └────────────┬──────────────┘    └─────────────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  │                  │                  │
            ┌─────▼────┐       ┌─────▼────┐       ┌─────▼────┐
            │ Source   │       │ MongoDB  │       │ GridFS   │
            │ adapter  │──────▶│ raw_*    │       │ source   │
            │ registry │       │ + audit  │       │ files    │
            └──────────┘       └──────────┘       └──────────┘
              7 impls:                              (Excel / CSV
              excel csv rest                         uploads)
              postgres mysql
              mssql oracle
```

Key decisions (full rationale in [P002](./docs/P002-design-proposal.md)):

- **DB-state lock, not Redis** — overlap protection is a partial unique index on `sync_runs(jobConfigId, status='running')`. The `SyncExecutor` claims the lock by inserting; the partial-unique index throws E11000 when another worker holds it.
- **Heartbeat + stale sweep** — running runs update `heartbeatAt` every 30s; a separate sweeper marks runs with stale heartbeats as `status='stale'` after 2 min, freeing the lock.
- **Identity is per-job_config**, not per-record-key globally — 4 strategies (see [P002 §9.1](./docs/P002-design-proposal.md)). `hash` requires explicit `acknowledgeHashSemantics: true` because every payload change becomes an insert + delete (no UPDATE).
- **AES-256-GCM for credentials**, multi-version master keys for rotation. Plaintext only ever exists in RAM during one decrypt → adapter call (T-B01).
- **No queue** — direct execution. `MAX_CONCURRENT_RUNS=5` is enforced in-process by `ConcurrencyService` (Set fast-path + semaphore).

## Source adapters (phase 1)

All adapters implement the same `SourceAdapter<C>` interface (`discoverMetadata` + `stream`). Adding a new one is a 5-step recipe — see [CLAUDE.md](./CLAUDE.md#conventions-for-adding-a-new-adapter).

| `source.type` | Driver              | Notes                                                         |
| ------------- | ------------------- | ------------------------------------------------------------- |
| `excel`       | `exceljs`           | Buffered load (not streaming reader — race in exceljs)        |
| `csv`         | `papaparse`         | Auto-detects delimiter; warnings logged, not fatal            |
| `rest`        | `axios`             | Pagination: none / page / offset / cursor; retry + rate limit |
| `postgres`    | `pg` + `pg-cursor`  | Cursor-paged reads, 100-row chunks                            |
| `mysql`       | `mysql2`            | Streaming API on the callback connection                      |
| `mssql`       | `mssql` (+ tedious) | Event-bridged async-iterable                                  |
| `oracle`      | `oracledb`          | **Thin mode by default** — no Instant Client needed           |

## Identity strategies — pick carefully

| Strategy      | When to use                                | Caveat                                                                                        |
| ------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `primary-key` | Source has stable, non-null PK             | Validate the PK column is `NOT NULL`                                                          |
| `composite`   | Logical PK spans 2+ columns                | Escape `\|\|` in values; field order is **immutable**                                         |
| `hash`        | Source has no entity concept (e.g. events) | Every payload change → insert + delete (no UPDATE). Requires `acknowledgeHashSemantics: true` |
| `row-number`  | File sources only                          | Re-upload makes every key new; fragile to edits                                               |

## API surface

| Tag             | Controller              | Endpoints                                                                                     |
| --------------- | ----------------------- | --------------------------------------------------------------------------------------------- |
| Service         | `Health` / `Index`      | `GET /` `GET /health` `GET /health/ready` — public, no API key                                |
| Job configs     | `JobConfig` / `Trigger` | `POST/GET/GET :id/PATCH :id/DELETE :id /job-configs` + `POST /job-configs/:id/trigger`        |
| Secrets         | `Secret`                | CRUD `/secrets` (plaintext never returned by any read)                                        |
| Source files    | `SourceFiles`           | `POST /source-files` (multipart) + list/get/`:id/download`/delete                             |
| Sync runs       | `SyncRuns`              | `GET /sync-runs` `GET /sync-runs/:id` `POST /sync-runs/:id/retry`                             |
| Raw records     | `RawRecord`             | `GET /raw-records?jobConfigId=…` `GET /raw-records/:id`                                       |
| Source metadata | `SourceMetadata`        | `GET /source-metadata?jobConfigId=…` `GET /source-metadata/latest` `GET /source-metadata/:id` |

Every non-Service endpoint requires `x-api-key: <one of INTEGRATION_API_KEYS>`. Full DTOs + response shapes live in `/api-docs`.

## Environment variables

Validated at startup by `joi` (see [`acore/config/config.module.ts`](./src/acore/config/config.module.ts)).

### Required

| Var                              | Type   | Example                       | Notes                                                |
| -------------------------------- | ------ | ----------------------------- | ---------------------------------------------------- |
| `MONGO_URI`                      | string | `mongodb://localhost:27017`   | Connection string                                    |
| `MONGO_DB_NAME`                  | string | `ax_data_integration`         | Database name                                        |
| `INTEGRATION_API_KEYS`           | string | `key1,key2`                   | Comma-separated valid API keys                       |
| `INTEGRATION_MASTER_KEY_V1`      | base64 | `<base64 of 32 random bytes>` | AES-256-GCM master key (`openssl rand -base64 32`)   |
| `INTEGRATION_MASTER_KEY_CURRENT` | int    | `1`                           | Version of the master key to use for NEW encryptions |

### Optional (defaults shown)

| Var                                      | Default       | Purpose                                                                                          |
| ---------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------ |
| `NODE_ENV`                               | `development` | One of `development / production / test`                                                         |
| `PORT`                                   | `3012`        | HTTP port                                                                                        |
| `LOG_LEVEL`                              | `info`        | pino level (`trace / debug / info / warn / error / fatal / silent`)                              |
| `MONGO_POOL_SIZE`                        | `10`          | Mongo client connection pool                                                                     |
| `INTEGRATION_DEFAULT_TIMEZONE`           | `UTC`         | Default cron timezone (per-job override available in `schedule.timezone`)                        |
| `INTEGRATION_DEFAULT_ERROR_THRESHOLD`    | `100`         | Per-run error count that aborts the run (per-job override available in `options.errorThreshold`) |
| `INTEGRATION_MAX_CONCURRENT_RUNS`        | `5`           | In-process cap enforced by `ConcurrencyService`                                                  |
| `INTEGRATION_HEARTBEAT_INTERVAL_MS`      | `30000`       | How often the executor touches `sync_runs.heartbeatAt`                                           |
| `INTEGRATION_STALE_HEARTBEAT_TIMEOUT_MS` | `120000`      | Sweeper marks `running` → `stale` if heartbeat is older than this                                |
| `INTEGRATION_STALE_SWEEP_INTERVAL_MS`    | `60000`       | How often the sweeper ticks                                                                      |
| `INTEGRATION_CHANGELOG_BUFFER_SIZE`      | `100`         | Per-run buffer before `raw_record_changelog.insertMany` flushes                                  |

### Key rotation

Add more master keys as `INTEGRATION_MASTER_KEY_V2`, `INTEGRATION_MASTER_KEY_V3`, … and bump `INTEGRATION_MASTER_KEY_CURRENT`. Old secrets keep decrypting with their original version (recorded inside the ciphertext envelope); new secrets encrypt with `_CURRENT`. The Joi `.pattern(/^INTEGRATION_MASTER_KEY_V\d+$/, masterKeySchema)` rule validates every version at startup. See T-B01 for the envelope format.

## Health checks

- `GET /health` — liveness. Returns `{status: 'ok'}` without touching Mongo. Use for liveness probes.
- `GET /health/ready` — readiness. Pings Mongo; returns `200 {status: 'ready', mongo: 'connected'}` or `503 {status: 'not-ready', mongo: 'disconnected', error}`.

Both endpoints are `@Public()` — they never require `x-api-key`.

## Design documentation

- [O001 — Original requirements](./docs/O001-data-integration.md) (authoritative; manager's brief)
- [P001 — Requirement summary + technical decisions](./docs/P001-requirement-summary.md)
- [P002 — Detailed design proposal](./docs/P002-design-proposal.md) (schema / algorithms / API / env)
- [T001 — WBS tracking](./docs/T001-wbs.md) (per-phase status + outcomes)
- [CLAUDE.md](./CLAUDE.md) — context for Claude Code working in this scope
