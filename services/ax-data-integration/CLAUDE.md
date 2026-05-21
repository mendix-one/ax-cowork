# CLAUDE.md — ax-data-integration

Context for Claude Code when working in the `services/ax-data-integration` scope. Read this file FIRST before any non-trivial change — the authoritative design lives in `./docs/`, not in the code.

## Service purpose

Pull-based Data Integration Service for aPlanner. Pulls data from files (Excel/CSV upload), external databases (Postgres / MySQL / MSSQL / Oracle), and external APIs (REST), stores it raw in MongoDB, classifies insert/update/delete between syncs, and audits per-record via a changelog. Internal service, deployed on-prem on a single node.

**One-line architecture summary**: NestJS 11 + MongoDB (state) + `@nestjs/schedule` (cron) — NO Redis, NO queue, NO multi-worker in phase 1.

## Source of truth for design

The files below are the **authoritative design docs** — they take priority over the current code when there is a conflict:

| File                                                                     | Contents                                                                                      |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [`docs/O001-data-integration.md`](./docs/O001-data-integration.md)       | Manager's original requirements                                                               |
| [`docs/P001-requirement-summary.md`](./docs/P001-requirement-summary.md) | Requirement summary + technical decisions (drop BullMQ, use DB-state lock, etc.)              |
| [`docs/P002-design-proposal.md`](./docs/P002-design-proposal.md)         | Detailed design: schema, algorithms, API surface, env vars                                    |
| [`docs/T001-wbs.md`](./docs/T001-wbs.md)                                 | Work breakdown structure for phase 1 — task tracking (✓ complete)                             |
| [`docs/T002-phase2-wbs.md`](./docs/T002-phase2-wbs.md)                   | Work breakdown structure for phase 2 — 4 waves (safety, ingestion, incremental, GraphQL/SOAP) |
| [`docs/MANUAL-TEST.md`](./docs/MANUAL-TEST.md)                           | Hands-on test playbook (S0–S9 scenarios) + reference to `scripts/manual-smoke.sh`             |

## Folder structure

```text
src/
├── main.ts                     // bootstrap, port 3012, Swagger /api-docs
├── main.module.ts
├── acore/                      // cross-cutting infrastructure
│   ├── config/                 // ConfigModule + joi env validation
│   ├── auth/                   // ApiKeyGuard (T-A05)
│   ├── mongo/                  // connection + GridFS (T-A02)
│   ├── crypto/                 // AES-256-GCM SecretService (T-B01)
│   └── logging/                // pino + credential mask (T-A04)
├── domain/                     // one folder per collection: schema + repo + service + controller
│   ├── job-config/
│   ├── sync-run/
│   ├── raw-record/
│   ├── source-metadata/
│   ├── source-file/
│   ├── secret/
│   └── raw-record-changelog/
├── adapters/                   // source adapter implementations
│   ├── source-adapter.interface.ts
│   ├── source-adapter.registry.ts
│   ├── excel.adapter.ts
│   ├── csv.adapter.ts
│   ├── rest-api.adapter.ts
│   ├── postgres.adapter.ts
│   ├── mysql.adapter.ts
│   ├── mssql.adapter.ts
│   └── oracle.adapter.ts
├── workers/                    // background runtime
│   ├── workers.module.ts
│   ├── scheduler.service.ts        // dynamic cron registry
│   ├── sync-executor.service.ts    // core sync logic
│   ├── stale-run-sweeper.service.ts
│   └── concurrency.service.ts      // in-RAM Set + semaphore
└── services/                   // misc API surface (health, index)
```

**Current phase 1 state** has only the skeleton: `acore/config/`, `services/{index,health-check}/`, and an empty `workers/`. `domain/`, `adapters/`, and the rest of the `acore/*` modules are added incrementally per the T001 WBS.

### Import rules between layers

| Layer       | Allowed imports from                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `acore/`    | Standalone — does not import `domain/`, `adapters/`, or `workers/`                                     |
| `domain/`   | `acore/`                                                                                               |
| `adapters/` | `acore/`, must NOT import `domain/` (adapters only emit raw data; they know nothing about persistence) |
| `workers/`  | `acore/`, `domain/`, `adapters/` (workers are the orchestration layer)                                 |
| `services/` | `acore/`, `domain/` (admin APIs; do NOT call adapters directly)                                        |

Not yet enforced via ESLint in phase 1, but following the rules keeps the code testable and easy to migrate later.

## Conventions for adding a new adapter

1. Implement the `SourceAdapter` interface (see `adapters/source-adapter.interface.ts` — created in T-D01).
2. Register it in `SourceAdapterRegistry` via a DI provider in `adapters/<your-adapter>.module.ts`.
3. Add the config schema to `JobConfig.source.config` DTO (discriminated union by `source.type`).
4. Write an E2E test per the T001 Phase J pattern — sync a sample source, assert counts and changelog correctness.
5. Update [P002 §6](./docs/P002-design-proposal.md) with the new config schema if you add non-trivial fields.

## Identity strategy — read caveats before choosing

[P002 §9.1](./docs/P002-design-proposal.md) lists all 4 strategies with their caveats. Quick summary:

- `primary-key` — the safest. Validate that the PK is NOT NULL and types are consistent.
- `composite` — escape `||` in values; field order is **immutable** after the first run.
- `hash` — **insert+delete on every change**, never UPDATE. Only use when the source has no entity concept. The API requires `acknowledgeHashSemantics: true`.
- `row-number` — file sources only; re-upload means every key is new; fragile to file edits.

Never silently suggest `hash` without warning about the trade-off.

## Security — NEVER log

- **Credentials** (passwords, tokens, API keys, secrets) — in any context: log line, error message, exception stack, `sync_runs.errors`. A pino interceptor masks these keys automatically (T-A04), but still be careful with ad-hoc `console.log` while debugging.
- **Master key** (`INTEGRATION_MASTER_KEY_*` env) — never log, never expose through any API.
- **Plaintext of secrets** — only exists in RAM during one decrypt + adapter call. Do not cache.

## Env vars

Full list in [P002 §16](./docs/P002-design-proposal.md). Minimum required: `MONGO_URI`, `MONGO_DB_NAME`, `INTEGRATION_API_KEYS`, `INTEGRATION_MASTER_KEY_V1`, `INTEGRATION_MASTER_KEY_CURRENT`. Validated via joi inside `acore/config/config.module.ts`.

## Commands

```bash
pnpm --filter ax-data-integration dev          # watch mode (port 3012)
pnpm --filter ax-data-integration build        # production build
pnpm --filter ax-data-integration test         # jest unit
pnpm --filter ax-data-integration test:e2e     # jest e2e
pnpm --filter ax-data-integration lint         # eslint --fix
pnpm dev:di                                     # root alias for dev
```

Single test file:

```bash
pnpm --filter ax-data-integration exec jest path/to/file.spec.ts -t "test name"
```
