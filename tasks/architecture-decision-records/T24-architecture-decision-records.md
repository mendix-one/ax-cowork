# T24 — Architecture Decision Records

> **A4 Technical Architecture** deliverable for aPlanner.

| Field       | Value                                          |
| ----------- | ---------------------------------------------- |
| Product     | aPlanner                                       |
| Version     | 2.0                                            |
| Date        | 2026-05-25                                     |
| Author      | CDO                                            |
| Status      | Accepted (v2 — tech stack realigned)           |
| AX Phase    | DEVELOP                                        |
| Artifact ID | T24                                            |
| Supersedes  | T24 v1.0 (2026-05-22 — Python-ML / PostgreSQL) |

---

## Stack Summary (canonical from `note.txt`)

| Tier                           | Stack                                                                                                                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Front-End**                  | React, React Router, MobX, Ant Design, TailwindCSS, Material Design Icons, Roboto font                                                                                             |
| **Back-End (Edge / App tier)** | Node.js, Express, NestJS — `WebApp`, `Gateway`, `Websocket`, `Webhook` modules — Cookie session + JWT                                                                              |
| **Business Internal Services** | Node.js, Express, NestJS — REST + GraphQL — Cron Job (Worker), EventBus — MongoDB (primary), Redis (cache + pub/sub), Elasticsearch (search + analytics), RabbitMQ (message queue) |
| **AI**                         | TBD — deferred ADR; see [ADR-005](#adr-005-ai-tech-stack-deferred)                                                                                                                 |

> **What changed vs. v1**: Python/FastAPI, OR-Tools, PostgreSQL, TimescaleDB, MUI, Redux Toolkit, React Query, DHTMLX Gantt were all replaced. The platform is now a uniform **Node.js + NestJS** runtime on the back-end and **React + AntD v6 + MobX** on the front-end. ADR-005 is now a placeholder (was OR-Tools).

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Technology Stack Selection](#2-technology-stack-selection)
3. [Architecture Decision Records](#3-architecture-decision-records)
   - [ADR-001: pnpm Monorepo + Modular NestJS Services](#adr-001-pnpm-monorepo--modular-nestjs-services)
   - [ADR-002: MongoDB as Primary Database](#adr-002-mongodb-as-primary-database)
   - [ADR-003: Node.js + NestJS for All Back-End Services](#adr-003-nodejs--nestjs-for-all-back-end-services)
   - [ADR-004: React + Ant Design + MobX for Frontend](#adr-004-react--ant-design--mobx-for-frontend)
   - [ADR-005: AI Tech-Stack (Deferred)](#adr-005-ai-tech-stack-deferred)
   - [ADR-006: Cookie Session + JWT Authentication](#adr-006-cookie-session--jwt-authentication)
   - [ADR-007: Event-Driven Architecture with RabbitMQ + In-Process EventBus](#adr-007-event-driven-architecture-with-rabbitmq--in-process-eventbus)
   - [ADR-008: Containerized Deployment (Docker + Reverse Proxy)](#adr-008-containerized-deployment-docker--reverse-proxy)
4. [REST + GraphQL API Standards](#4-rest--graphql-api-standards)
5. [Core API Endpoints](#5-core-api-endpoints)
6. [Security Architecture](#6-security-architecture)
7. [Infrastructure and Deployment](#7-infrastructure-and-deployment)
8. [Performance Targets](#8-performance-targets)

---

## 1. System Architecture Overview

aPlanner is delivered as a **pnpm monorepo** with two NestJS applications (`ax-cowork-be`, `ax-cdn-services`), one Vite + React 19 SPA (`ax-cowork-ui`), and two shared TypeScript libraries (`@ax-cowork/shared`, `@ax-cowork/control-table`). All runtime services are **Node.js + NestJS** — there is no Python service tier. Long-running work runs on Workers consuming **RabbitMQ** queues; cross-module fan-out is handled by an in-process **EventBus** (NestJS `CqrsModule` / Nest event-emitter). Persistence is **MongoDB** (primary), with **Redis** for cache / sessions / pub-sub and **Elasticsearch** for search and analytics.

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                            CLIENTS                                 │
│  React SPA (ax-cowork-ui)   |   Mobile (future)   |   External API │
└────────────────────────────────┬───────────────────────────────────┘
                                 │ HTTPS  (TLS 1.3)
┌────────────────────────────────┴───────────────────────────────────┐
│                   CDN / EDGE: ax-cdn-services                      │
│      Static asset edge, signed-URL minting, CORS, auth headers     │
│              NestJS 11  ·  Swagger /api-docs                       │
└────────────────────────────────┬───────────────────────────────────┘
                                 │
┌────────────────────────────────┴───────────────────────────────────┐
│                EDGE / APP TIER: ax-cowork-be (NestJS 11)           │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ ┌───────────┐         │
│  │ Webapp   │ │ Gateway  │ │  Websocket   │ │  Webhook  │         │
│  │ (Handle- │ │ (REST    │ │  (Socket.IO  │ │  (Inbound │         │
│  │  bars +  │ │  + Graph │ │  / ws — push │ │   signed  │         │
│  │  static) │ │  QL)     │ │   updates)   │ │   events) │         │
│  └────┬─────┘ └────┬─────┘ └──────┬───────┘ └─────┬─────┘         │
│       │            │              │               │                │
│       └────────────┴──────────────┴───────────────┘                │
│                              │                                     │
│                       Cookie session  +  JWT                       │
│                       Joi config · class-validator                 │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
┌──────────────────────────────┴─────────────────────────────────────┐
│              BUSINESS INTERNAL SERVICES (NestJS Workers)           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│  │ Schedule     │ │ Forecast     │ │ Analytics    │ │ Integration│ │
│  │ worker       │ │ worker       │ │ worker       │ │ worker     │ │
│  │ (Cron + Q)   │ │ (Cron + Q)   │ │ (Cron + Q)   │ │ (Sync)     │ │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └─────┬──────┘ │
│         └────────────────┴────────────────┴───────────────┘        │
│                              │                                     │
│           EventBus  (in-process / Nest CQRS event emitter)         │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
┌──────────────────────────────┴─────────────────────────────────────┐
│                       MESSAGING / EVENTS                           │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐    │
│  │  RabbitMQ 3.12           │  │  Redis 7 (Pub/Sub)           │    │
│  │  Job queues + DLQ        │  │  Ephemeral fan-out           │    │
│  │  (forecast / schedule    │  │  (real-time UI events)       │    │
│  │   / simulate / notify)   │  │                              │    │
│  └──────────────────────────┘  └──────────────────────────────┘    │
└──────────────────────────────┬─────────────────────────────────────┘
                               │
┌──────────────────────────────┴─────────────────────────────────────┐
│                          DATA LAYER                                │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ MongoDB 7    │  │ Redis 7    │  │ Elasticsearch│  │ Object   │  │
│  │              │  │            │  │ 8            │  │ Storage  │  │
│  │ Orders,      │  │ Cache,     │  │ Full-text    │  │ (S3 /    │  │
│  │ schedules,   │  │ sessions,  │  │ search,      │  │  MinIO)  │  │
│  │ users,       │  │ pub/sub,   │  │ audit logs,  │  │ Uploads, │  │
│  │ time-series  │  │ rate-limit │  │ analytics    │  │ ML       │  │
│  │ (PM data)    │  │            │  │              │  │ artifacts│  │
│  └──────────────┘  └────────────┘  └──────────────┘  └──────────┘  │
├────────────────────────────────────────────────────────────────────┤
│                            AI TIER                                 │
│              ⚠  Deferred — see ADR-005 / note.txt                  │
└────────────────────────────────────────────────────────────────────┘
```

### Service Communication Patterns

| Pattern              | Use Case                                        | Technology                        |
| -------------------- | ----------------------------------------------- | --------------------------------- |
| Synchronous REST     | CRUD operations, real-time queries              | NestJS `Gateway` module + HTTP    |
| Synchronous GraphQL  | Aggregated reads, schema-driven clients         | NestJS `@nestjs/graphql`          |
| Server-pushed events | Schedule changes, recommendation toasts         | WebSocket (Socket.IO / native ws) |
| Inbound integrations | External system callbacks (ERP, MES, AI vendor) | Webhook module (signed payloads)  |
| Async job queue      | Forecast, schedule optimization, simulation     | RabbitMQ                          |
| Domain event fan-out | "Schedule published" → analytics + notify       | Nest EventBus + Redis Pub/Sub     |
| Scheduled work       | Nightly sync, KPI rollups, qual-expiry sweeps   | Cron worker (NestJS `@Cron()`)    |
| Cache-aside          | Hot reads (plan snapshot, qual matrix)          | Redis                             |
| Search & analytics   | Audit log query, free-text PO search            | Elasticsearch                     |

### Data Flow Summary

1. **User request** hits the SPA, which calls `ax-cowork-be` via REST (or GraphQL for aggregated views).
2. The **Gateway module** validates the cookie session + JWT, enforces rate limits, and dispatches.
3. Reads consult Redis cache first, then MongoDB or Elasticsearch; writes go to MongoDB and emit domain events.
4. Long-running operations (forecast, schedule optimize, simulate) enqueue a job on **RabbitMQ** with a `correlationId`. The Worker module consumes it; the client subscribes to a **WebSocket** topic keyed by `correlationId` for progress and final delivery.
5. Domain events (`schedule.published`, `forecast.completed`, `alert.triggered`) fan out via the in-process EventBus inside the Workers module, and via Redis Pub/Sub when the Webapp / Gateway tier needs to broadcast to connected clients.
6. **Webhook module** ingests inbound events from external systems (ERP / MES / AI vendor) — see `services/ax-cdn-services` and `WebhookModule` in `ax-cowork-be` for the implemented entry points.

---

## 2. Technology Stack Selection

Each technology was evaluated against five weighted criteria: team expertise (25%), ecosystem maturity (20%), performance (20%), operational cost (20%), and community support (15%).

| Category             | Technology                    | Score | Runner-Up      | Score |
| -------------------- | ----------------------------- | ----- | -------------- | ----- |
| Frontend Framework   | React 19 + Vite               | 90    | Vue 3 + Vite   | 81    |
| UI Component Library | Ant Design v6                 | 89    | Material UI v5 | 84    |
| Frontend State       | MobX 6                        | 86    | Redux Toolkit  | 83    |
| Frontend Styling     | Tailwind 3 + Sass (minimal)   | 87    | Pure CSS-in-JS | 78    |
| Frontend Icons       | Material Design Icons (MDI)   | 86    | Lucide         | 82    |
| Frontend Font        | Roboto (via `@fontsource`)    | 85    | Inter          | 84    |
| Back-End Framework   | NestJS 11 (Express adapter)   | 90    | Express bare   | 78    |
| Back-End Runtime     | Node.js 20 LTS                | 92    | Deno 1.x       | 74    |
| Primary Database     | MongoDB 7                     | 85    | PostgreSQL 15  | 88\*  |
| Cache / Pub-Sub      | Redis 7                       | 93    | Memcached      | 76    |
| Search & Analytics   | Elasticsearch 8               | 86    | OpenSearch     | 84    |
| Message Queue        | RabbitMQ 3.12                 | 86    | AWS SQS        | 81    |
| API Style            | REST + GraphQL                | 88    | REST only      | 84    |
| Auth                 | Cookie session + JWT          | 87    | JWT only       | 82    |
| Validation           | `class-validator` + Joi       | 88    | Zod            | 86    |
| Templating (Webapp)  | Handlebars (hbs)              | 80    | EJS            | 75    |
| Real-time            | WebSocket (Socket.IO / `ws`)  | 87    | SSE            | 79    |
| Inter-process Events | Nest EventBus + Redis Pub/Sub | 84    | NATS           | 81    |
| Monorepo Manager     | pnpm 8 workspaces             | 90    | npm workspaces | 78    |
| Type System          | TypeScript 5 (strict, ESM)    | 92    | Plain JS       | 60    |
| Test (BE)            | Jest                          | 86    | Vitest         | 85    |
| Test (UI)            | Vitest + Testing Library      | 88    | Jest           | 83    |

> \* PostgreSQL scored marginally higher on raw capability, but MongoDB's schema flexibility for evolving plan/scenario shapes, native time-series collections (Mongo 7), and the team's existing Node.js-driver expertise outweighed it. The migration path to add Postgres later for any service that needs strict relational guarantees is open (see [ADR-002](#adr-002-mongodb-as-primary-database)).

### Selection Rationale Highlights

- **Single language, two runtimes**: TypeScript on both the SPA and the back-end. Removing the Python service tier dropped the ramp-up surface area, simplified CI, removed cross-language data-model duplication, and let us ship one shared library (`@ax-cowork/shared`) for utils/formatters/converters consumed everywhere.
- **NestJS as the BE backbone**: opinionated module system maps directly to the WebApp / Gateway / WebSocket / Webhook / Workers split the note prescribes. Dependency injection, lifecycle hooks, guards, and pipes give a uniform shape across every feature module.
- **MongoDB as primary**: most aPlanner aggregates (plans, scenarios, PO trees) are document-shaped. Time-series collections cover the KPI use case that previously needed TimescaleDB. PostgreSQL remains an option for a future strict-relational shard (e.g. user/tenant directory) if needed.
- **Ant Design v6 + Tailwind**: AntD covers ~90% of the UI primitives needed for a planner workspace (Table, Splitter, Descriptions, Cards, Modals, Form). Tailwind handles layout glue. Brand customization happens via AntD theme tokens — never hard-coded hex.
- **MobX**: domain-organized stores (auth, ui, plus per-page panel stores) without action-creator boilerplate. Better fit than Redux Toolkit for the deeply-nested simulation state.

---

## 3. Architecture Decision Records

### ADR-001: pnpm Monorepo + Modular NestJS Services

| Field          | Value                                |
| -------------- | ------------------------------------ |
| **ID**         | ADR-001                              |
| **Status**     | Accepted                             |
| **Date**       | 2026-05-25                           |
| **Deciders**   | CDO, CAO, CEO                        |
| **Supersedes** | ADR-001 v1 (Python-ML microservices) |

**Context:**
aPlanner needs to ship the WebApp shell, the planner-facing API, real-time push, inbound webhooks, scheduled workers, and a CDN/asset service. The original v1 plan split these into seven Python+Node services on EKS. With the stack narrowing to **Node.js + NestJS** end-to-end and a smaller initial team, that fan-out is no longer justified — but the boundaries between the surface areas (Webapp / Gateway / WebSocket / Webhook / Workers) are still real and worth preserving.

**Decision:**
Adopt a **pnpm monorepo** containing:

| Package path               | Package name               | Role                                                                                             |
| -------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `packages/ax-coworker-ui`  | `ax-cowork-ui`             | React 19 + Vite SPA                                                                              |
| `packages/ax-coworker-be`  | `ax-cowork-be`             | Edge + app tier — Webapp / Gateway / WebSocket / Webhook / Workers modules in one NestJS process |
| `services/ax-cdn-services` | `ax-cdn-services`          | Standalone NestJS for CDN / asset endpoints (Swagger at `/api-docs`)                             |
| `shared/ax-common`         | `@ax-cowork/shared`        | Pure TS utils / formatters / converters                                                          |
| `shared/ax-control-table`  | `@ax-cowork/control-table` | React component lib (AntD-based table)                                                           |

Within `ax-cowork-be`, feature concerns are NestJS modules: `WebappModule`, `GatewayModule`, `WebsocketModule`, `WebhookModule`, `WorkersModule`. They share configuration (`ConfigModule` + Joi) and DI, but each owns its own controllers, providers, and consumers.

`ax-cdn-services` is split out so the CDN/asset surface can scale and be redeployed independently of the planner runtime.

**Consequences:**

| Type     | Consequence                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Positive | One language, one runtime — single CI matrix, single type system                                                                  |
| Positive | Module boundaries (Webapp/Gateway/WebSocket/Webhook/Workers) are real but in-process — no inter-service network hop for hot paths |
| Positive | Shared libs (`@ax-cowork/shared`, `@ax-cowork/control-table`) eliminate FE/BE drift                                               |
| Positive | `pnpm` workspace links make local dev fast — `pnpm dev` runs both shared libs + SPA + both NestJS apps in parallel                |
| Positive | Lower ops footprint than v1 — two long-running services (plus DBs) vs. seven                                                      |
| Negative | A misbehaving module can degrade siblings (mitigated by separating Workers into its own process if/when needed)                   |
| Negative | Coordinated releases — single `ax-cowork-be` image; partial rollouts use feature flags, not service-level deploys                 |
| Negative | Workspace layout discipline required — see workspace `CLAUDE.md` and per-package ESLint `boundaries` rules                        |

**Alternatives Considered:**

| Alternative                            | Reason Rejected                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| Full microservices (v1 plan)           | Operational overhead not justified at MVP scale; team is single-runtime      |
| Polyrepo                               | Type sharing requires manual publishing; FE/BE drift returns                 |
| Single Node process (no modular split) | Real boundaries (push, webhook, batch) deserve isolation at the module level |

**Mitigation / Forward Path:**

- The Workers module is designed so it can extract into a separate NestJS app behind the same RabbitMQ topology if back-pressure or memory pressure warrants it.
- Module boundaries are enforced via NestJS `imports` graphs + ESLint `eslint-plugin-boundaries` on the UI side (`pages → acore | shared | layout`, etc.).
- `services/ax-cdn-services` is already a separate service, proving the extraction pattern.

---

### ADR-002: MongoDB as Primary Database

| Field          | Value                                 |
| -------------- | ------------------------------------- |
| **ID**         | ADR-002                               |
| **Status**     | Accepted                              |
| **Date**       | 2026-05-25                            |
| **Deciders**   | CDO, CAO                              |
| **Supersedes** | ADR-002 v1 (PostgreSQL + TimescaleDB) |

**Context:**
The dominant aPlanner aggregates — Plans (with nested Production Orders → Families → Stages → Steps → Milestones), Scenarios, Recommendations, Background-task logs, History entries — are **document-shaped**, deeply nested, and evolve frequently as new fields are introduced. The team has stronger Node.js / Mongo driver experience than Postgres. Time-series KPI data (per-tool-group utilization, OEE, throughput) is also required and can be served by MongoDB's native **time-series collections** (Mongo 5.0+).

**Decision:**
**MongoDB 7** is the primary database for all business data. Time-series collections handle KPI streams. Indexed text fields cover light search; heavy search and analytics go to Elasticsearch (see [ADR-007](#adr-007-event-driven-architecture-with-rabbitmq--in-process-eventbus)).

**Collection Ownership (initial):**

| Module / Service | Collections                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| Gateway          | `productionOrders`, `families`, `stages`, `steps`, `milestones`, `plans`, `scenarios`              |
| Workers          | `forecasts`, `forecastRuns`, `scheduleRuns`, `simulationRuns`, `recommendations`, `historyEntries` |
| Webhook          | `inboundEvents`, `signatureChecks`                                                                 |
| WebApp / Auth    | `users`, `tenants`, `roles`, `sessions` (also Redis for hot path)                                  |
| Analytics        | `kpiTimeseries` (Mongo time-series), `materializedReports`                                         |
| Integration      | `sourceConnections`, `syncLogs`, `fieldMappings`                                                   |

**Consequences:**

| Type     | Consequence                                                                           |
| -------- | ------------------------------------------------------------------------------------- |
| Positive | Schema evolves with the domain — `Plan` can grow new fields without migrations        |
| Positive | Native time-series collections cover the KPI use case without TimescaleDB             |
| Positive | Strong Node.js driver + ODM (`mongoose` or `@nestjs/mongoose`) ergonomics             |
| Positive | Aggregation pipeline handles most reporting; ES picks up the rest                     |
| Positive | Replica sets give built-in HA; sharding available when tenants grow                   |
| Negative | No ACID across collections (multi-doc transactions exist but cost perf)               |
| Negative | Engineering discipline required — denormalized data drifts if not owned by one writer |
| Negative | Aggregation pipeline DSL has its own learning curve                                   |

**Alternatives Considered:**

| Alternative             | Reason Rejected                                                                   |
| ----------------------- | --------------------------------------------------------------------------------- |
| PostgreSQL 15           | Strong but mismatched to the document-heavy domain; v1's relational pain was real |
| PostgreSQL + JSONB only | JSONB is fine but Mongo's tooling/operators are more direct                       |
| TimescaleDB             | Replaced by Mongo native time-series collections                                  |
| DynamoDB                | Vendor lock-in; weaker query flexibility                                          |

**Operational Notes:**

- ODM: NestJS `@nestjs/mongoose` for schemas; one schema file per collection, co-located with the owning module.
- Indexes: declared in schema metadata, applied via `Schema.index(...)`; reviewed in code review.
- Transactions: only when a write spans `plans` and `historyEntries` (or similar); otherwise rely on event sourcing through the EventBus.
- Migrations: forward-only via `migrate-mongo`; reversible at the data level for at least one release.
- Backups: managed snapshots + oplog tail; see §7.

---

### ADR-003: Node.js + NestJS for All Back-End Services

| Field          | Value                                |
| -------------- | ------------------------------------ |
| **ID**         | ADR-003                              |
| **Status**     | Accepted                             |
| **Date**       | 2026-05-25                           |
| **Deciders**   | CDO, CAO                             |
| **Supersedes** | ADR-003 v1 (Python + FastAPI for ML) |

**Context:**
The v1 plan ran Python services for ML workloads alongside Node.js for integration and user services. The team consolidated to Node.js + TypeScript across the stack; the AI / ML workloads are now either deferred (see [ADR-005](#adr-005-ai-tech-stack-deferred)) or fronted by a **vendor / sidecar** that exposes an HTTP/gRPC contract callable from Node.js.

**Decision:**
**Node.js 20 LTS + NestJS 11** for every back-end runtime in the repo (`ax-cowork-be`, `ax-cdn-services`, and any future extracted Worker app). Express is the underlying HTTP adapter. Modules use TypeScript strict mode.

**Standard module layout (per NestJS app):**

```
src/
├── main.ts                # bootstrap (Nest factory + global pipes)
├── acore/                 # cross-cutting kernel
│   ├── config/            # @nestjs/config + Joi schema
│   ├── logger/            # structured logging
│   └── ...
├── webapp/                # Handlebars views (ax-cowork-be only)
├── gateway/               # REST + GraphQL controllers (Gateway module)
├── websocket/             # ws gateways / rooms
├── webhook/               # signed inbound endpoints
├── workers/               # cron + queue consumers
└── services/              # ax-cdn-services feature folder
```

**Consequences:**

| Type     | Consequence                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Positive | One toolchain (TypeScript, pnpm, ESLint, Prettier, Jest) front-to-back                                   |
| Positive | Shared `@ax-cowork/shared` library is consumed by both BE apps and the SPA                               |
| Positive | NestJS DI + guards + pipes + interceptors form a uniform shape per module                                |
| Positive | `@nestjs/swagger` auto-documents REST; `@nestjs/graphql` covers GraphQL                                  |
| Positive | `class-validator` on every DTO; `whitelist: true, transform: true` enabled globally in `ax-cdn-services` |
| Negative | Node single-threaded — CPU-bound paths must go to Workers / external services                            |
| Negative | Ecosystem gap: heavy numerical / ML libs are still Python — bridged via vendor / sidecar (see ADR-005)   |

**CPU-bound mitigation:**

- Long-running computation → enqueue on RabbitMQ, run in a dedicated Worker pod, push result via WebSocket.
- For any future in-process number crunching, prefer native-backed libs (`@tensorflow/tfjs-node`, `simple-statistics`) over pure-JS implementations.
- AI optimization (when the AI stack lands) runs as a sidecar with an HTTP/gRPC contract that the Workers module calls.

**Alternatives Considered:**

| Alternative           | Reason Rejected                                                     |
| --------------------- | ------------------------------------------------------------------- |
| Python + FastAPI (v1) | Forces polyglot infra; the optimization win didn't justify the cost |
| Bare Express          | No DI / module shape — modules would diverge across teams           |
| Fastify               | Faster, but ecosystem (NestJS adapter) is less mature in v6         |
| Deno                  | Maturing, but smaller deploy/test tooling ecosystem                 |

---

### ADR-004: React + Ant Design + MobX for Frontend

| Field          | Value                                             |
| -------------- | ------------------------------------------------- |
| **ID**         | ADR-004                                           |
| **Status**     | Accepted                                          |
| **Date**       | 2026-05-25                                        |
| **Deciders**   | CDO, CXO                                          |
| **Supersedes** | ADR-004 v1 (React + MUI + Redux Toolkit + DHTMLX) |

**Context:**
The planner UI requires dense data surfaces (Gantt-style schedule, workload heatmap, qual matrix, side-by-side compare), live updates from server-pushed events, and a coherent design system aligned with the Amoza brand. The original MUI / Redux / DHTMLX stack was over-tooled for our needs and didn't match the team's experience with Ant Design.

**Decision:**
**React 19 + Vite + TypeScript** with:

| Concern           | Choice                                                                       |
| ----------------- | ---------------------------------------------------------------------------- |
| Component library | **Ant Design v6** — `antd`, `antd-style`, `@ant-design/icons`                |
| State management  | **MobX 6** + `mobx-react-lite` (domain-organized stores)                     |
| Styling           | **Tailwind 3** for layout glue + AntD theme tokens for chrome                |
| Icons             | **Material Design Icons** via `@mdi/js` + `AxMuiIcon` wrapper                |
| Font              | **Roboto** via `@fontsource/roboto`                                          |
| Routing           | **React Router 7** (named export `index` from `acore/router`)                |
| i18n              | **i18next** + `react-i18next` + `LanguageDetector`                           |
| Gantt             | Custom React table built on AntD + `Splitter` (no DHTMLX commercial license) |
| Markdown          | Tiptap + `tiptap-markdown` (rich editor, samples only)                       |
| Charts            | **ECharts** via `echarts-for-react` (when needed)                            |
| Build             | Vite 8 + Rolldown reporter                                                   |
| Test              | Vitest + Testing Library + jsdom                                             |
| Lint              | ESLint with `eslint-plugin-boundaries` enforcing layer rules                 |

**Layer rules** (enforced by ESLint — violations fail lint):

```
root    → root, acore, router, shared, layout, modal, page, asset
router  → acore, shared, layout, modal, page, asset
page    → acore, shared, layout, modal, asset    (NO cross-page imports)
layout  → acore, shared, layout, modal, asset
modal   → acore, shared, modal, asset
acore   → acore, shared, asset                   (kernel doesn't know UI)
shared  → shared, asset                          (leaf primitives)
asset   → ()
```

**Stores are organized by domain** (`RootStore` aggregates `auth`, `ui`; pages own their own per-feature stores) — never `<Page>Store`.

**Theme tokens single source of truth** = AntD `axTheme` (see `tasks/design-system-tokens/design-system-tokens.md`). Tailwind mirrors the brand colors; do not hard-code hex values in components.

**Consequences:**

| Type     | Consequence                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Positive | AntD covers ~90% of UI primitives needed — Table, Splitter, Descriptions, Card, Modal, Form              |
| Positive | MobX domain stores read naturally for the deeply-nested simulation state                                 |
| Positive | No commercial Gantt license; custom Gantt panel sits on AntD + the Splitter layout primitives            |
| Positive | Tailwind + AntD coexist cleanly — Tailwind for layout, AntD for chrome                                   |
| Positive | `@ax-cowork/control-table` shared library can be reused outside this app                                 |
| Negative | Bundle size — AntD v6 + `@mdi/js` are large; mitigated by tree-shaking, dynamic imports, and lazy routes |
| Negative | Custom Gantt is now our problem — must be maintained internally                                          |

**Alternatives Considered:**

| Alternative                 | Reason Rejected                                                     |
| --------------------------- | ------------------------------------------------------------------- |
| Material UI v5 (v1 plan)    | Mismatched with the team's experience; weaker dense-data primitives |
| Redux Toolkit + React Query | More boilerplate than MobX gave us back in observability            |
| DHTMLX Gantt (commercial)   | $999/year ongoing cost; custom build hit the requirements           |
| Chakra UI / Mantine         | Less dense / less battle-tested for ops-style surfaces              |

---

### ADR-005: AI Tech-Stack (Deferred)

| Field          | Value                        |
| -------------- | ---------------------------- |
| **ID**         | ADR-005                      |
| **Status**     | ⚠ Deferred                   |
| **Date**       | 2026-05-25                   |
| **Deciders**   | CDO, CAO, CEO                |
| **Supersedes** | ADR-005 v1 (Google OR-Tools) |

**Context:**
`note.txt` lists the AI tech-stack as `....` (TBD). The original v1 decision (Python + Google OR-Tools, embedded in `schedule-service`) is no longer compatible with the consolidated Node.js back-end, and the team has not yet selected a vendor / framework / hosting target for the AI / optimization workloads.

**Decision:**
Defer. The aPlanner back-end **must not** ship a hard dependency on a specific AI stack until this ADR is settled.

**Constraints on the future decision:**

1. The AI tier is reached via an **HTTP or gRPC contract** consumed by the `WorkersModule` — never imported in-process.
2. Long-running optimization runs as a queued job. The Worker hands a payload to the AI tier and waits for a callback (push) or polls the AI tier's job status endpoint.
3. The contract must be representable as a TypeScript type and shared via `@ax-cowork/shared` (e.g. `OptimizeRequest`, `OptimizeResponse`).
4. The AI tier must not require synchronous calls from the SPA — every interaction is mediated by the back-end.

**Candidates being evaluated:**

| Candidate                                                      | Shape                            | Notes                                                                                          |
| -------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| Hosted LLM (Anthropic Claude / OpenAI)                         | REST API, structured-output mode | Best fit for conversational what-if and rec generation; requires guardrails for plan mutations |
| Self-hosted optimizer (Python sidecar with OR-Tools or CP-SAT) | gRPC microservice                | Re-introduces Python — only if performance / cost demands it                                   |
| Vendor scheduler (e.g. Decision Optimizer SaaS)                | REST API                         | Faster to adopt; lock-in risk                                                                  |
| Hybrid (LLM for explanation, deterministic solver as a tool)   | REST + RPC                       | Likely direction; matches the Concept doc's "AI calls the optimizer as a tool" pattern         |

**Open items (to be resolved before unblocking):**

- [ ] Pick the optimization engine (LLM-as-orchestrator + deterministic tool, or solver-first).
- [ ] Decide hosting (vendor-managed vs self-hosted) and data-egress posture.
- [ ] Confirm SLA: max solve time, latency for conversational responses, cost per call.
- [ ] Define the cross-language contract (gRPC `.proto` or OpenAPI) and add it to `@ax-cowork/shared`.
- [ ] Document the rollback path if the AI vendor / model is unavailable.

**Until this ADR is accepted**: ML-adjacent UI (Recommendations panel, AI Chatbox, Tuning suggestions) is rendered from **mock data inside MobX stores** — see `packages/ax-cowork-ui/src/pages/simulation/panels/*/`.

---

### ADR-006: Cookie Session + JWT Authentication

| Field          | Value                 |
| -------------- | --------------------- |
| **ID**         | ADR-006               |
| **Status**     | Accepted              |
| **Date**       | 2026-05-25            |
| **Deciders**   | CDO, COO              |
| **Supersedes** | ADR-006 v1 (JWT only) |

**Context:**
`note.txt` explicitly calls out **Cookie session + JWT**. The original v1 plan used JWT only with a Redis deny-list. The note's posture adds an HttpOnly session cookie for the SPA (mitigates XSS by keeping no token in JS) while keeping a JWT for stateless internal validation across NestJS modules and the CDN service.

**Decision:**
A **two-token model** on the browser, validated by NestJS guards:

| Token       | Lifetime   | Storage                               | Purpose                                         |
| ----------- | ---------- | ------------------------------------- | ----------------------------------------------- |
| Session ID  | 7 days     | HttpOnly, Secure, SameSite=Lax cookie | Identifies the user; backed by Redis            |
| Access JWT  | 15 minutes | In-memory (SPA) or short-lived cookie | Stateless validation between modules / services |
| Refresh JWT | 7 days     | HttpOnly cookie                       | Issued alongside session; rotates on use        |

- The session record in Redis is the **authority**. Revocation = delete the Redis key; the next request fails the guard.
- The Access JWT signs `{ userId, roles, sessionId, exp }` and is checked by a NestJS `AuthGuard`. Internal services (`ax-cdn-services`) accept only the JWT (no cookie).
- CSRF: enforced on cookie-bearing endpoints via double-submit token or AntD-issued `X-CSRF-Token` header pattern (covered by NestJS `csurf` middleware or its modern fork).

**Authorization model (RBAC):**

| Role    | Permissions                                                       |
| ------- | ----------------------------------------------------------------- |
| Viewer  | Read schedules, forecasts, dashboards. No modifications.          |
| Planner | All Viewer + create/edit schedules, run forecasts, simulations    |
| Manager | All Planner + approve/publish schedules, manage alerts            |
| Admin   | All Manager + user management, system configuration, integrations |

Implemented as NestJS `@Roles(...)` decorators + `RolesGuard` reading roles from the JWT claims.

**Consequences:**

| Type     | Consequence                                                                  |
| -------- | ---------------------------------------------------------------------------- |
| Positive | XSS no longer leaks the auth credential (cookie HttpOnly)                    |
| Positive | Stateless inter-service auth via JWT — `ax-cdn-services` doesn't share Redis |
| Positive | Revocation is fast — drop a Redis key                                        |
| Positive | Standard pattern for SSO upgrades (Year 2 OIDC plugs into the session flow)  |
| Negative | CSRF protection now matters; covered by middleware + same-site cookies       |
| Negative | Two tokens to debug; mitigated by structured request logs                    |

**Alternatives Considered:**

| Alternative         | Reason Rejected                                                |
| ------------------- | -------------------------------------------------------------- |
| JWT only (v1)       | Token-in-JS exposes refresh/access tokens to XSS               |
| Session only        | Cross-service validation requires every service to hit Redis   |
| OAuth 2.0 full flow | Overkill for MVP; planned as the entry point for SSO in Year 2 |

---

### ADR-007: Event-Driven Architecture with RabbitMQ + In-Process EventBus

| Field        | Value      |
| ------------ | ---------- |
| **ID**       | ADR-007    |
| **Status**   | Accepted   |
| **Date**     | 2026-05-25 |
| **Deciders** | CDO, CAO   |

**Context:**
Long-running operations (forecast generation, schedule optimization, simulation) still cannot complete within an HTTP request. Domain events still need to fan out — when a schedule publishes, the analytics worker must update KPIs and the notify worker must alert stakeholders. With the back-end now in one NestJS process per app, **in-process EventBus** covers fan-out inside that process cheaply; **RabbitMQ** covers durable cross-process / cross-app messaging and async jobs.

**Decision:**

- **In-process EventBus** (NestJS `CqrsModule` `EventBus` or `@nestjs/event-emitter`) for synchronous domain-event fan-out **inside** an app process — typed events, zero infra cost, immediate fan-out.
- **RabbitMQ 3.12** for **durable** job queues and cross-process events, including handoff between the Workers module and any extracted Worker apps in the future. Direct exchanges for jobs; topic exchanges for domain events that cross process boundaries.
- **Redis Pub/Sub** for **ephemeral, real-time** notifications to connected WebSocket clients (e.g. "your background task finished") where loss is acceptable.

**Queues (initial):**

| Queue                       | Exchange Type | Producer         | Consumer                          |
| --------------------------- | ------------- | ---------------- | --------------------------------- |
| `forecast.generate`         | Direct        | Gateway / Worker | Workers.forecast                  |
| `schedule.optimize`         | Direct        | Gateway / Worker | Workers.schedule                  |
| `simulate.run`              | Direct        | Gateway / Worker | Workers.simulate                  |
| `events.schedule.published` | Topic         | Workers.schedule | Workers.notify, Workers.analytics |
| `events.forecast.completed` | Topic         | Workers.forecast | Workers.analytics                 |
| `events.alert.triggered`    | Topic         | Workers.\*       | Workers.notify                    |
| `dlq.*`                     | Direct        | RMQ dead-letter  | Workers.monitoring                |

**Message envelope (canonical):**

```json
{
  "id": "uuid-v4",
  "type": "schedule.optimize",
  "version": "1.0",
  "timestamp": "2026-05-25T10:30:00Z",
  "source": "ax-cowork-be/workers.schedule",
  "correlationId": "request-uuid",
  "userId": "user-uuid",
  "tenantId": "tenant-uuid",
  "payload": {},
  "metadata": { "priority": 5, "retryCount": 0, "maxRetries": 3 }
}
```

**Retry policy:**

| Attempt | Delay     | Action                                |
| ------- | --------- | ------------------------------------- |
| 1st     | Immediate | Retry immediately                     |
| 2nd     | 30 s      | Delayed retry                         |
| 3rd     | 5 min     | Delayed retry                         |
| Failed  | —         | Move to DLQ; alert via Workers.notify |

**Consequences:**

| Type     | Consequence                                                                                |
| -------- | ------------------------------------------------------------------------------------------ |
| Positive | Cheap in-process fan-out for most events                                                   |
| Positive | RabbitMQ persists what must not be lost (jobs, cross-app domain events)                    |
| Positive | DLQ + retry semantics give observable failure mode                                         |
| Positive | Redis Pub/Sub lets the Gateway broadcast to WebSocket clients without going through RMQ    |
| Negative | Two event mechanisms — engineers must pick correctly; documented in `acore/event.md` (TBD) |
| Negative | Consumers must be idempotent — message envelope includes `id` for dedupe                   |

**Alternatives Considered:**

| Alternative        | Reason Rejected                                              |
| ------------------ | ------------------------------------------------------------ |
| Kafka              | Operational overhead too high for MVP volumes                |
| NATS               | Smaller tooling ecosystem; team has no production NATS hours |
| Redis Streams only | No native DLQ, weaker delivery semantics                     |
| AWS SQS            | Vendor lock-in; harder to run in local Docker compose        |

---

### ADR-008: Containerized Deployment (Docker + Reverse Proxy)

| Field          | Value                                     |
| -------------- | ----------------------------------------- |
| **ID**         | ADR-008                                   |
| **Status**     | Accepted (MVP topology)                   |
| **Date**       | 2026-05-25                                |
| **Deciders**   | CDO, COO, CEO                             |
| **Supersedes** | ADR-008 v1 (Kubernetes / EKS / Karpenter) |

**Context:**
The v1 plan landed on EKS + Karpenter to handle bursty Python ML workloads. With the back-end consolidated to Node.js and the AI tier deferred to a vendor / sidecar (ADR-005), the ops surface no longer needs full Kubernetes at MVP. Two long-running Node services + Mongo + Redis + ES + RabbitMQ + a static front-end fit comfortably on a smaller topology.

**Decision:**
For MVP: **Docker images** for `ax-cowork-be` and `ax-cdn-services`, deployed behind a reverse proxy (Nginx or Traefik) on managed VMs or a managed container service (e.g. AWS ECS Fargate / GCP Cloud Run / Fly.io). Data services (Mongo / Redis / Elasticsearch / RabbitMQ) are **managed offerings** (MongoDB Atlas, ElastiCache or upstash Redis, Elastic Cloud, CloudAMQP) — not self-hosted.

| Tier                | Hosting (MVP)                                                 |
| ------------------- | ------------------------------------------------------------- |
| `ax-cowork-ui`      | Static bundle on a CDN (CloudFront / Cloudflare); built by CI |
| `ax-cowork-be`      | Docker container on Cloud Run / ECS Fargate                   |
| `ax-cdn-services`   | Docker container on Cloud Run / ECS Fargate                   |
| MongoDB             | MongoDB Atlas (M10+ replica set)                              |
| Redis               | ElastiCache or upstash (cluster mode disabled at MVP)         |
| Elasticsearch       | Elastic Cloud (3-node hot tier)                               |
| RabbitMQ            | CloudAMQP (standard tier with HA)                             |
| Object storage      | S3 / GCS bucket — signed URLs minted by `ax-cdn-services`     |
| Reverse proxy / TLS | CloudFront (front) → ALB / Cloud Run ingress                  |

**Deployment process:**

- CI (GitHub Actions): `pnpm install` → `pnpm build` → `pnpm test` → Docker build → push to registry.
- CD: image tag pushed → managed service rolls update (zero-downtime: new revision online before old drains).
- Secrets: AWS Secrets Manager / GCP Secret Manager / Doppler — never committed.
- Observability: structured JSON logs → CloudWatch / Logflare; metrics via Prometheus pull or vendor-native (Cloud Run metrics, ElastiCache CloudWatch).

**Forward path:**

- If RPS / cost / scheduling demands it, extract `WorkersModule` into a dedicated Node service behind the same RabbitMQ topology.
- If pod density / cost demands it, move to **Kubernetes (EKS / GKE)** — the Docker artifacts already build; only the deployment manifests change.
- ADR-008 will be revised when (a) we leave MVP, or (b) tenant count crosses a defined threshold (TBD with COO).

**Consequences:**

| Type     | Consequence                                                            |
| -------- | ---------------------------------------------------------------------- |
| Positive | Far smaller ops footprint than full EKS — no cluster to operate at MVP |
| Positive | Managed data services remove DB / queue ops from the team's plate      |
| Positive | Path to Kubernetes is open — same Docker images work                   |
| Negative | Managed services cost more per resource; acceptable at MVP scale       |
| Negative | Less control over networking topology (no VPC-only service mesh yet)   |
| Negative | Provider lock-in if we choose Cloud Run / ECS-specific features        |

**Alternatives Considered:**

| Alternative              | Reason Rejected (at MVP)                                           |
| ------------------------ | ------------------------------------------------------------------ |
| AWS EKS + Karpenter (v1) | Over-engineered for two long-running Node services                 |
| Bare EC2 + systemd       | No zero-downtime deploys; manual scaling                           |
| Vercel / Netlify (FE)    | Front-end fine; doesn't host long-running Node + websocket cleanly |
| Render / Railway         | Reasonable; revisit if Fly / Cloud Run pricing diverges            |

---

## 4. REST + GraphQL API Standards

All aPlanner services follow a unified REST API standard. A subset of read endpoints is also exposed via **GraphQL** in the `GatewayModule` for clients that need aggregation across resources (e.g. "load a plan with all its POs, milestones, and recommendations in one round trip"). Write paths remain REST-first.

### Base URL Convention

| Environment | Base URL                                       |
| ----------- | ---------------------------------------------- |
| Development | `http://localhost:3000/api/v1`                 |
| Staging     | `https://staging-api.aplanner.amoza.ai/api/v1` |
| Production  | `https://api.aplanner.amoza.ai/api/v1`         |

GraphQL endpoint: `/api/v1/graphql` on the same host. Playground enabled in non-prod.

### Naming Conventions

- Resource names are **plural nouns** in **kebab-case**: `/api/v1/production-orders`
- Actions that do not map to CRUD use **verb sub-resources**: `/api/v1/schedules/{id}/publish`
- Query parameters use **camelCase**: `?pageSize=20&sortBy=createdAt`
- All timestamps use **ISO 8601 UTC**: `2026-05-22T10:30:00Z`

### HTTP Methods

| Method | Usage                             | Idempotent | Safe |
| ------ | --------------------------------- | ---------- | ---- |
| GET    | Retrieve resource(s)              | Yes        | Yes  |
| POST   | Create resource or trigger action | No         | No   |
| PUT    | Full resource replacement         | Yes        | No   |
| PATCH  | Partial resource update           | Yes        | No   |
| DELETE | Remove resource                   | Yes        | No   |

### Pagination

```json
{
  "data": [],
  "pagination": { "page": 1, "pageSize": 20, "totalItems": 148, "totalPages": 8 }
}
```

### Validation

- DTOs use `class-validator` decorators (`@IsString`, `@IsInt`, `@IsISO8601`, `@IsEnum`).
- Global pipe: `new ValidationPipe({ whitelist: true, transform: true })` (already enabled in `ax-cdn-services`; same posture in `ax-cowork-be`).
- Joi validates `ConfigModule` startup variables (already wired in `ax-cowork-be/src/acore/config/`).

### Standard Response Format

**Success:**

```json
{ "status": "success", "data": {}, "meta": { "requestId": "uuid", "timestamp": "2026-05-25T10:30:00Z" } }
```

**Error:**

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [{ "field": "startDate", "issue": "Must be a future date" }]
  },
  "meta": { "requestId": "uuid", "timestamp": "2026-05-25T10:30:00Z" }
}
```

### Error Codes

| HTTP Status | Error Code           | Usage                                      |
| ----------- | -------------------- | ------------------------------------------ |
| 400         | VALIDATION_ERROR     | Invalid request payload                    |
| 401         | AUTHENTICATION_ERROR | Missing/invalid session or JWT             |
| 403         | AUTHORIZATION_ERROR  | Insufficient role / not in tenant          |
| 404         | NOT_FOUND            | Resource does not exist                    |
| 409         | CONFLICT             | Duplicate / state conflict / etag mismatch |
| 422         | UNPROCESSABLE_ENTITY | Semantically invalid request               |
| 429         | RATE_LIMIT_EXCEEDED  | Too many requests                          |
| 500         | INTERNAL_ERROR       | Unexpected server error                    |

### Headers

```
Cookie: session=<opaque>; refresh=<jwt>      # set by server, HttpOnly
Authorization: Bearer <access_jwt>           # for service-to-service / mobile / API key
X-Request-ID: <uuid>                         # client-supplied for tracing
X-Tenant-ID: <tenant_uuid>                   # multi-tenant (Year 2)
X-CSRF-Token: <token>                        # required on state-changing cookie requests
```

The CDN service additionally accepts the custom headers `cdn-owner-id`, `timezone`, `lang` (already in CORS allow-list — see `ax-cdn-services/src/main.ts`).

### GraphQL

- Schema-first (SDL) or code-first (`@nestjs/graphql`) — code-first chosen to share TS types with `@ax-cowork/shared`.
- Queries are role-guarded by the same `RolesGuard`.
- Subscriptions ride **WebSocket** (`graphql-ws`) and are restricted to read events (`scheduleUpdated`, `recommendationAdded`).

### Rate Limiting

| Tier     | Requests/min | Burst |
| -------- | ------------ | ----- |
| Free     | 60           | 10    |
| Standard | 300          | 50    |
| Premium  | 1000         | 100   |

Enforced via `@nestjs/throttler` backed by Redis. Headers on every response:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 287
X-RateLimit-Reset: 1716370200
```

---

## 5. Core API Endpoints

### Orders / Plans

| Method | Endpoint                         | Description                     | Auth Role |
| ------ | -------------------------------- | ------------------------------- | --------- |
| GET    | `/api/v1/production-orders`      | List production orders          | Viewer+   |
| POST   | `/api/v1/production-orders`      | Create production order         | Planner+  |
| GET    | `/api/v1/production-orders/{id}` | Get order details               | Viewer+   |
| PUT    | `/api/v1/production-orders/{id}` | Update order                    | Planner+  |
| DELETE | `/api/v1/production-orders/{id}` | Delete order                    | Manager+  |
| GET    | `/api/v1/plans`                  | List plans (Published, Sim A/B) | Viewer+   |
| POST   | `/api/v1/plans/{id}/branch`      | Create a simulation branch      | Planner+  |
| POST   | `/api/v1/plans/{id}/publish`     | Publish a simulation to live    | Manager+  |

### Schedules

| Method | Endpoint                          | Description                           | Auth Role |
| ------ | --------------------------------- | ------------------------------------- | --------- |
| GET    | `/api/v1/schedules`               | List schedules                        | Viewer+   |
| POST   | `/api/v1/schedules`               | Create schedule                       | Planner+  |
| GET    | `/api/v1/schedules/{id}`          | Get schedule details                  | Viewer+   |
| POST   | `/api/v1/schedules/{id}/optimize` | Enqueue optimization (returns job id) | Planner+  |
| POST   | `/api/v1/schedules/{id}/validate` | Validate constraint feasibility       | Planner+  |
| POST   | `/api/v1/schedules/{id}/publish`  | Publish schedule                      | Manager+  |

### Forecasts

| Method | Endpoint                          | Description                   | Auth Role |
| ------ | --------------------------------- | ----------------------------- | --------- |
| GET    | `/api/v1/forecasts`               | List forecasts                | Viewer+   |
| POST   | `/api/v1/forecasts`               | Create forecast configuration | Planner+  |
| GET    | `/api/v1/forecasts/{id}`          | Get forecast results          | Viewer+   |
| POST   | `/api/v1/forecasts/{id}/generate` | Enqueue forecast generation   | Planner+  |

### Scenarios / Simulation

| Method | Endpoint                     | Description            | Auth Role |
| ------ | ---------------------------- | ---------------------- | --------- |
| GET    | `/api/v1/scenarios`          | List scenarios         | Viewer+   |
| POST   | `/api/v1/scenarios`          | Create scenario        | Planner+  |
| POST   | `/api/v1/scenarios/{id}/run` | Enqueue simulation run | Planner+  |
| GET    | `/api/v1/scenarios/compare`  | Diff two scenarios     | Viewer+   |

### Analytics

| Method | Endpoint                        | Description                  | Auth Role |
| ------ | ------------------------------- | ---------------------------- | --------- |
| GET    | `/api/v1/analytics/kpis`        | KPI summary                  | Viewer+   |
| GET    | `/api/v1/analytics/heatmap`     | Tool-group × day utilization | Viewer+   |
| GET    | `/api/v1/analytics/commitments` | Commitment risk panel data   | Viewer+   |
| POST   | `/api/v1/analytics/reports`     | Generate report (async)      | Manager+  |

### Recommendations / Tuning

| Method | Endpoint                                | Description                    | Auth Role |
| ------ | --------------------------------------- | ------------------------------ | --------- |
| GET    | `/api/v1/recommendations`               | List AI-pushed recommendations | Viewer+   |
| POST   | `/api/v1/recommendations/{id}/preview`  | Preview impact (opens Compare) | Planner+  |
| POST   | `/api/v1/recommendations/{id}/skip`     | Skip (trains the model)        | Planner+  |
| GET    | `/api/v1/process-tunes`                 | Process-time tune suggestions  | Viewer+   |
| POST   | `/api/v1/process-tunes/{id}/accept`     | Accept tune                    | Planner+  |
| POST   | `/api/v1/process-tunes/{id}/send-to-pe` | Send evidence to Process Eng   | Planner+  |
| GET    | `/api/v1/capacity-tunes`                | Capacity tune suggestions      | Viewer+   |
| POST   | `/api/v1/capacity-tunes/{id}/accept`    | Accept tune                    | Planner+  |

### Integration / CDN

| Method | Endpoint                      | Description                | Auth Role                         |
| ------ | ----------------------------- | -------------------------- | --------------------------------- |
| POST   | `/api/v1/import/csv`          | Import data from CSV       | Planner+                          |
| GET    | `/api/v1/integrations`        | List source connections    | Manager+                          |
| GET    | `/api/v1/integrations/status` | Integration health summary | Manager+                          |
| POST   | `/api/v1/integrations`        | Configure new source       | Admin                             |
| POST   | `/api/v1/webhooks/{provider}` | Signed inbound webhook     | Public + signature                |
| GET    | `/api/v1/cdn/sign`            | Mint a signed asset URL    | Authenticated (`ax-cdn-services`) |

### Authentication and Users

| Method | Endpoint               | Description                      | Auth Role     |
| ------ | ---------------------- | -------------------------------- | ------------- |
| POST   | `/api/v1/auth/login`   | Authenticate user (sets cookies) | Public        |
| POST   | `/api/v1/auth/refresh` | Rotate access JWT                | Authenticated |
| POST   | `/api/v1/auth/logout`  | Drop session + revoke JWTs       | Authenticated |
| GET    | `/api/v1/users/me`     | Current user                     | Authenticated |
| GET    | `/api/v1/users`        | List users                       | Admin         |
| POST   | `/api/v1/users`        | Create user                      | Admin         |
| PATCH  | `/api/v1/users/{id}`   | Update user                      | Self/Admin    |

### Realtime (WebSocket)

| Channel                      | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| `task:{correlationId}`       | Progress + completion of a background job |
| `plan:{planId}`              | Live edits / publishes on a plan          |
| `recommendations:{tenantId}` | New AI-pushed recommendations             |
| `notifications:{userId}`     | User-specific toasts                      |

---

## 6. Security Architecture

aPlanner implements defense-in-depth with six layers.

### Layer 1: Network Security

| Control         | Implementation                                         |
| --------------- | ------------------------------------------------------ |
| Edge protection | CloudFront / Cloudflare in front of all public hosts   |
| WAF             | Provider-managed WAF — OWASP Top 10 rules              |
| DDoS protection | CloudFront / Cloudflare default                        |
| Service ingress | Cloud Run / ECS / Nginx-Traefik — TLS-terminated       |
| Private mesh    | Managed VPC peering between BE service and managed DBs |

### Layer 2: Transport Security

| Control       | Implementation                                |
| ------------- | --------------------------------------------- |
| TLS 1.3       | All external traffic; HSTS preload            |
| Cookie attrs  | `HttpOnly; Secure; SameSite=Lax`              |
| WebSocket TLS | `wss://` only in non-dev                      |
| Internal TLS  | mTLS between Node services planned for Year 2 |

### Layer 3: Authentication (see [ADR-006](#adr-006-cookie-session--jwt-authentication))

| Control                | Implementation                                    |
| ---------------------- | ------------------------------------------------- |
| Session                | Opaque ID in HttpOnly cookie, Redis-backed        |
| Access JWT             | RS256 signed, 15-minute expiry                    |
| Refresh JWT            | HttpOnly cookie, 7-day expiry, rotating           |
| Password hashing       | `argon2id` (preferred) or bcrypt cost 12 fallback |
| Brute-force protection | Account lockout after 5 failed attempts (15 min)  |
| MFA                    | TOTP for Admin / Manager (Year 1)                 |
| CSRF                   | Double-submit token / `X-CSRF-Token` header       |

### Layer 4: Authorization

| Control                      | Implementation                                       |
| ---------------------------- | ---------------------------------------------------- |
| RBAC                         | Four roles, hierarchical (`@Roles` + `RolesGuard`)   |
| Tenant scoping               | `tenantId` enforced on every query (Mongoose plugin) |
| API surface enforcement      | Gateway module guards before reaching controllers    |
| Principle of least privilege | Default deny; permissions explicitly granted         |

### Layer 5: Data Security

| Control               | Implementation                                                                |
| --------------------- | ----------------------------------------------------------------------------- |
| Encryption at rest    | Provider-managed KMS (Atlas / ElastiCache / Elastic Cloud / S3)               |
| Encryption in transit | TLS 1.3 everywhere                                                            |
| PII handling          | Sensitive fields encrypted at application layer (`mongoose` field encryption) |
| Data retention        | Configurable per tenant; default 2-year retention                             |
| Backup encryption     | Provider-managed encryption with customer-managed keys                        |

### Layer 6: Audit and Monitoring

| Control                | Implementation                                      |
| ---------------------- | --------------------------------------------------- |
| Audit logging          | Write ops emit a domain event → Elasticsearch index |
| Access logging         | NestJS `LoggerMiddleware` logs user + IP + path     |
| Security alerts        | Prometheus / vendor alerts on anomalous patterns    |
| Vulnerability scanning | Trivy / Snyk in CI                                  |
| Dependency scanning    | Dependabot / pnpm audit                             |

---

## 7. Infrastructure and Deployment

### Environment Strategy

| Environment | Purpose                   | Data            | Access         |
| ----------- | ------------------------- | --------------- | -------------- |
| Development | Local + shared dev env    | Synthetic seed  | All developers |
| Staging     | Pre-production validation | Anonymized prod | Team + QA      |
| Production  | Live system               | Real data       | Ops + on-call  |

### CI/CD Pipeline Stages

```
┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
│ Lint │──>│Build │──>│ Test │──>│ Scan │──>│Stage │──>│ Prod │
│      │   │      │   │      │   │      │   │      │   │      │
│ESLint│   │pnpm  │   │Vitest│   │Trivy │   │Auto  │   │Manual│
│Prett.│   │build │   │ +    │   │Snyk  │   │roll- │   │approve│
│TSC   │   │Docker│   │Jest  │   │SAST  │   │out   │   │roll- │
└──────┘   └──────┘   └──────┘   └──────┘   └──────┘   └──────┘
```

| Stage       | Tool                       | Pass Criteria                      |
| ----------- | -------------------------- | ---------------------------------- |
| Lint        | ESLint + Prettier          | Zero errors                        |
| Type check  | `tsc -b`                   | Zero TS errors                     |
| Build       | `pnpm build` (Vite + Nest) | All packages build                 |
| Unit Test   | Jest (BE), Vitest (UI)     | 80%+ coverage on critical modules  |
| Integration | Jest + testcontainers      | Mongo / Redis / RMQ contracts pass |
| Security    | Trivy, Snyk, pnpm audit    | No critical / high CVEs            |
| Staging     | Provider auto-deploy       | Health checks + smoke tests pass   |
| Production  | Manual approve             | Staging validated; change approved |

### Monitoring and Alerting Thresholds

| Metric                | Warning   | Critical | Action                     |
| --------------------- | --------- | -------- | -------------------------- |
| API response p95      | > 500ms   | > 2000ms | Scale instances / triage   |
| Error rate (5xx)      | > 1%      | > 5%     | Page on-call               |
| CPU utilization       | > 70%     | > 90%    | Auto-scale (provider HPA)  |
| Memory utilization    | > 75%     | > 90%    | Alert, investigate leak    |
| Mongo conn pool       | > 80%     | > 95%    | Resize / pool tune         |
| Mongo replication lag | > 5s      | > 30s    | Investigate primary        |
| Redis memory          | > 75%     | > 90%    | Evict policy / resize      |
| Elasticsearch heap    | > 75%     | > 90%    | Add node                   |
| RabbitMQ queue depth  | > 100     | > 500    | Scale Workers              |
| RabbitMQ unacked      | > 50      | > 200    | Investigate consumer stall |
| Certificate expiry    | < 30 days | < 7 days | Renew certificate          |

### Backup and Disaster Recovery

| Component     | Backup Method                       | Frequency  | Retention  | RTO     | RPO       |
| ------------- | ----------------------------------- | ---------- | ---------- | ------- | --------- |
| MongoDB       | Atlas continuous backup + snapshots | Continuous | 30 days    | 1 hour  | 5 min     |
| Redis         | RDB snapshots (provider-managed)    | Every 6h   | 7 days     | 30 min  | 6 hours   |
| Elasticsearch | Snapshot to object storage          | Daily      | 14 days    | 2 hours | 24 hours  |
| RabbitMQ      | Config + queue policy backup        | Daily      | 14 days    | 1 hour  | N/A       |
| S3 / GCS      | Cross-region replication            | Real-time  | Indefinite | Minutes | Near-zero |

**DR strategy** (MVP): provider-native multi-AZ HA for managed services; restore-from-snapshot runbook for compute. Cross-region DR is on the Year-2 roadmap.

---

## 8. Performance Targets

### API and Application Performance

| Metric                         | Target  | Measurement Method     |
| ------------------------------ | ------- | ---------------------- |
| API response time (p50)        | < 100ms | Provider metrics       |
| API response time (p95)        | < 200ms | Provider metrics       |
| API response time (p99)        | < 500ms | Provider metrics       |
| Page load (initial)            | < 2s    | Lighthouse, Web Vitals |
| Page load (subsequent SPA)     | < 500ms | React Profiler         |
| Time to Interactive (TTI)      | < 3s    | Lighthouse             |
| Largest Contentful Paint (LCP) | < 2.5s  | Web Vitals             |
| Cumulative Layout Shift (CLS)  | < 0.1   | Web Vitals             |

### Workload Performance (mediated by Workers + RabbitMQ)

| Metric                          | Target       | Scaling Factor                |
| ------------------------------- | ------------ | ----------------------------- |
| Forecast generation             | < 5 minutes  | Per product family (100 SKUs) |
| Schedule optimization           | < 30 minutes | 2000 tasks, 100 machines      |
| Simulation run                  | < 10 minutes | Per scenario                  |
| Gantt panel render (1000 tasks) | < 2 seconds  | Client-side                   |
| CSV import (10K rows)           | < 30 seconds | Background processing         |

> Optimization target assumes the AI tier defined in [ADR-005](#adr-005-ai-tech-stack-deferred). Real numbers will be set once that ADR lands.

### Scalability Targets

| Metric                     | MVP Target | Year 2 Target |
| -------------------------- | ---------- | ------------- |
| Concurrent users           | 100        | 1000+         |
| API requests per minute    | 1,000      | 10,000        |
| Production orders (active) | 5,000      | 50,000        |
| Historical data retention  | 1 year     | 3 years       |
| Tenants (multi-tenant)     | 1          | 50            |

### Database Performance (MongoDB-centric)

| Metric                       | Target  | Optimization                                 |
| ---------------------------- | ------- | -------------------------------------------- |
| Query response (indexed)     | < 10ms  | Compound indexes per pattern                 |
| Query response (aggregation) | < 100ms | `$match` early, `$lookup` last               |
| Query response (analytics)   | < 2s    | Read from secondary; materialized aggregates |
| Connection pool utilization  | < 80%   | Mongoose pool tuning                         |
| Time-series chunk query      | < 50ms  | Bucket granularity tuned                     |

### Reliability Targets

| Metric                        | Target                        |
| ----------------------------- | ----------------------------- |
| Uptime (monthly)              | 99.9% (43 min downtime/month) |
| Mean Time to Detection (MTTD) | < 5 minutes                   |
| Mean Time to Recovery (MTTR)  | < 1 hour                      |
| Deployment success rate       | > 95%                         |
| Change failure rate           | < 15%                         |
| Deployment frequency          | Multiple per week             |

---

## Appendix: ADR Summary Matrix

| ADR     | Decision                                                     | Status   | Risk Level | Review Date |
| ------- | ------------------------------------------------------------ | -------- | ---------- | ----------- |
| ADR-001 | pnpm monorepo + modular NestJS services                      | Accepted | Low        | 2026-08-25  |
| ADR-002 | MongoDB primary (time-series collections included)           | Accepted | Medium     | 2026-08-25  |
| ADR-003 | Node.js + NestJS for all back-end services                   | Accepted | Low        | 2026-11-25  |
| ADR-004 | React + Ant Design + MobX + Tailwind + MDI + Roboto frontend | Accepted | Low        | 2026-11-25  |
| ADR-005 | AI Tech-Stack — **Deferred**                                 | ⚠ Open   | High       | 2026-06-22  |
| ADR-006 | Cookie session + JWT authentication                          | Accepted | Low        | 2026-11-25  |
| ADR-007 | RabbitMQ jobs + Nest EventBus + Redis Pub/Sub                | Accepted | Low        | 2026-11-25  |
| ADR-008 | Docker + managed services for MVP; K8s deferred              | Accepted | Medium     | 2026-08-25  |

---

> **Document status**: Complete (v2)
> **Last updated**: 2026-05-25
> **Next review**: 2026-08-25 (quarterly architecture review)
> **Open follow-ups**: ADR-005 (AI stack), `acore/event.md` (EventBus selection guide), Kubernetes migration trigger conditions
