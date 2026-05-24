Below is the consolidated summary of requirements from the work-assignment conversation in [O001](O001-data-integration.md).

## 1. Overall goal

Begin developing the **Data Integration** capability for the **aPlanner** system.

The immediate goal is to build a mechanism / job that can:

> Connect to an external data source, pull data, store it as-is into MongoDB as raw data, and record both metadata and sync history so that later transform / analysis / rule-engine workloads can be served.

---

## 2. Long-term Data Integration categories

In the long run the system will have 3 main forms.

### Form 1: aPlanner actively pulls data from other systems

This is the scope to focus on first.

Possible data sources:

| Source type  | Examples                              |
| ------------ | ------------------------------------- |
| File         | Excel, CSV                            |
| Database     | Oracle, MySQL, SQL Server, PostgreSQL |
| External API | SOAP API, REST API, GraphQL API       |

aPlanner runs jobs that actively read data from these sources.

---

### Form 2: Webhook / Event-based Integration

External systems call a webhook that aPlanner exposes.

General flow:

1. External system calls aPlanner's webhook.
2. The webhook creates an event with a payload.
3. aPlanner may call back the external API for additional detail.
4. The data / event is processed further.

Not in immediate scope, but needs design headroom for later.

---

### Form 3: Event-based Adapter

A more distant direction.

Example:

1. aPlanner builds a dedicated adapter.
2. The adapter listens for events from an external source, e.g. MQTT from IoT devices.
3. When an event arrives, the adapter forwards it into aPlanner.
4. That event then triggers further processing.

Deferred — not in current scope.

---

## 3. Immediate scope

Focus on **Form 1: aPlanner actively pulls data**.

Build a job/worker that can:

| Source       | Action                            |
| ------------ | --------------------------------- |
| Excel / CSV  | Read file, parse structure + data |
| External DB  | Connect, read schema + data       |
| External API | Call API, take response data      |

After fetching:

1. Store raw data into **MongoDB**.
2. No complex transformation yet.
3. Whatever the data looks like, store it as-is for now.
4. Transform, ingestion, analysis or rule-based engine come later.

---

## 4. Job execution mechanism

Initially the sync job can run as one of:

| Mode          | Notes                    |
| ------------- | ------------------------ |
| Cronjob       | Scheduled                |
| Time interval | Runs after each interval |
| Schedule      | Configurable schedule    |

Critical requirements:

1. No overlapping runs of the same job.
2. No duplicate data.
3. Sync history is traceable.
4. Each sync must classify data as insert / update / delete.

---

## 5. Data categories to store

The system manages 3 main data groups.

### 5.1. Metadata

Information describing the structure of the source data.

| Source            | Metadata to store                       |
| ----------------- | --------------------------------------- |
| Excel / CSV       | Header, field list, inferred data types |
| External Database | Schema, tables, columns, data types     |
| API Response      | JSON response structure / schema        |

Example for Excel/CSV:

```text
File name
Sheet name
Header row
Fields
Data type
Sample values
```

Example for a database:

```text
Database type
Schema
Tables
Columns
Primary key
Data type
Nullable
```

Example for an API:

```text
Endpoint
Method
Response structure
JSON fields
Nested object/array structure
```

---

### 5.2. Raw Data

The actual data captured at each sync.

Requirements:

1. Stored in MongoDB.
2. Preserve the original shape as much as possible.
3. No normalization yet.
4. Serves later processing steps.

Example:

```json
{
  "sourceType": "axios",
  "sourceName": "external_sales_api",
  "syncRunId": "xxx",
  "rawPayload": {
    "id": 1,
    "customer": "ABC",
    "amount": 1000
  },
  "syncedAt": "2026-05-18T10:00:00Z"
}
```

---

### 5.3. Sync History

Used to trace the synchronization process.

Must capture:

| Field            | Meaning                       |
| ---------------- | ----------------------------- |
| Which job ran    | Which job/config was executed |
| When             | Start time, end time          |
| Status           | Success, Failed, Partial      |
| Records read     | Total data pulled from source |
| Records inserted | New records                   |
| Records updated  | Changed records               |
| Records deleted  | Records removed at source     |
| Error log        | Errors, if any                |
| Raw trace        | Debug information             |

The goal is to be able to inspect later:

1. Which sync failed.
2. At which step it failed.
3. Which data was inserted / updated / deleted.
4. Why the data changed.
5. Whether the result can be audited or reconciled.

---

## 6. Duplicate-prevention requirements

A critical requirement.

Two types of duplicates must be handled:

### 6.1. Duplicate jobs

The same job must not run concurrently with itself.

Example:

```text
Job A runs every 5 minutes.
A previous run took 10 minutes and is still in progress.
The next run must NOT overlap with it.
```

Possible mechanisms:

1. Job lock.
2. Distributed lock if multiple containers are involved.
3. Statuses: running / pending / completed.
4. Timeout for stuck jobs.

---

### 6.2. Duplicate data

The same data must not be stored twice across multiple syncs.

We need a way to identify each record, for example:

| Identification           | Notes                               |
| ------------------------ | ----------------------------------- |
| Source primary key       | Best when the source has a clear ID |
| Composite key            | Combine multiple fields             |
| Record hash              | Hash the record content             |
| Source + externalId      | Common for API/DB                   |
| File + row number + hash | Works for Excel/CSV                 |

Each record is classified into one of:

```text
New     -> Insert
Changed -> Update
Missing -> Delete / Mark as deleted
Same    -> No change
```

---

## 7. Deployment architecture

The system will later be deployed via Docker.

Possible options:

1. Docker Compose.
2. Kubernetes.

The sync job should be a **separate container**.

If NestJS is used, it can be organized as its own project/service under the `services/` directory.

---

## 8. Service structure direction

The Data Integration Service can be split into 2 main parts:

### 8.1. Workers

Responsible for running sync jobs.

Duties:

1. Read job configs.
2. Connect to the source.
3. Fetch metadata.
4. Fetch raw data.
5. Write to MongoDB.
6. Write sync history.
7. Handle duplicate job / data.
8. Handle retry / error.

---

### 8.2. APIs / GraphQL

Used for administration and for querying operational data.

Likely API groups:

| API group        | Purpose                               |
| ---------------- | ------------------------------------- |
| Job Config API   | Create/update/delete/config sync jobs |
| Sync History API | View job run history                  |
| Sync Detail API  | View detail of a specific sync run    |
| Metadata API     | View captured metadata                |
| Raw Data API     | Inspect stored raw data               |
| Job Trigger API  | Manually run a job                    |
| Job Status API   | View current job status               |

---

## 9. Authentication / Authorization

This is an internal service, so phase-1 authentication can stay simple.

Current requirement:

```text
Use API-Key for internal services.
```

Detailed authorization comes later.

Things explicitly NOT needed now:

1. Role-based access control.
2. Per-job permissions.
3. Per-data-source permissions.
4. Advanced user-action auditing.

---

## 10. Current priority order

In summary:

| Priority | Item                                                |
| -------- | --------------------------------------------------- |
| 1        | A sync job that works against file / database / API |
| 2        | Store raw data in MongoDB                           |
| 3        | Store source metadata                               |
| 4        | Store sync history                                  |
| 5        | Prevent duplicate jobs                              |
| 6        | Prevent duplicate data                              |
| 7        | API / GraphQL for managing config, traces, history  |
| 8        | Containerized deployment                            |
| 9        | Simple API-Key authentication                       |
| 10       | Transform / analysis / rule engine (later)          |

---

## 11. Out of immediate scope

Not currently a focus:

1. Webhook event-based integration.
2. MQTT / event adapter.
3. Complex data transformation.
4. Rule-based engine.
5. Data analysis engine.
6. Advanced authorization.
7. Polished admin UI.
8. Data warehouse / data mart.
9. Real-time processing.
10. Production-grade Kubernetes setup.

---

## 12. Confirmed technical decisions

> This section is **not part of the manager's original request** — it is the engineering team's outcome after analysing the requirements. The point is to lock in foundational choices early so we don't have to refactor heavily later.

### 12.1. Scheduler & job-control stack

| Component                   | Choice                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| Trigger                     | `@nestjs/schedule` (`@Cron(...)` decorator)                                               |
| Job state + lock            | `sync_runs` collection in Mongo, using a partial unique index to prevent overlapping runs |
| Fast-path concurrency guard | `Set<jobConfigId>` in RAM                                                                 |
| Single-run execution        | Sequential, async/await — no chunking / parallelism yet                                   |
| Retry                       | Manual through admin API in phase 1                                                       |

**Rejected**: BullMQ + Redis.

**Why rejected**:

1. Phase 1 deploys on-prem, single node → Redis is unnecessary infrastructure.
2. Pull-then-diff needs sequential ordering within a run; a multi-consumer queue makes data consistency harder, not easier.
3. BullMQ's generic retry does not match the sync-job business semantics → we'd still have to code custom retry logic, so the queue's retry becomes half-useful infra with full complexity.

---

### 12.2. Concurrency model

1. **A single process** (single node).
2. **Different jobs (different sources)** run concurrently — handled naturally by Node's async I/O.
3. **Within one run**: process records sequentially, no chunking / parallelism.
4. **Lock against overlap**: partial unique index on `sync_runs`:

```text
{ jobConfigId: 1, status: 1 }  unique,  partialFilter: { status: 'running' }
```

5. **Heartbeat**: the running job periodically updates `heartbeatAt` (e.g. every 30s). Sweep stale runs (no heartbeat for >2 minutes) at startup + periodically — mark them `failed` so they don't keep the lock.

---

### 12.3. MongoDB collection design for raw data

**Decision**: a single unified `raw_records` collection for every source.

**Rejected**: one collection per source (`raw_excel_sales`, `raw_api_customers`, …).

**Identity & dedup**: use `(sourceId, recordKey)` as the unique index. Classify new/changed/no-change by comparing `payloadHash`. Classify deleted by comparing `lastSeenAt < syncRun.startedAt`.

**Why**: fits the ELT pattern, the number of sources in phase 1 is small, and a generic API is easier to build. If a single source grows too large later, migrating to a dedicated collection is a one-time change — no architectural lock-in.

---

### 12.4. Retention / TTL

- **Phase 1**: no retention policy, keep all data.
- **Hard requirement**: every collection MUST have a `createdAt: Date` field (Date type, not string) from day one — so a future Mongo TTL index can be enabled with a single line of config, without any data migration.

---

### 12.5. Excel/CSV file source

**Decision**: upload via API (multipart endpoint).

- Store in **GridFS** (files can exceed the 16MB Mongo doc limit).
- API returns a `sourceFileId` to reference inside the job config.
- The worker streams the file from GridFS (avoid loading the whole file into RAM).

---

### 12.6. Credentials / secrets

**Decision**: NEVER store plaintext. Must be encrypted at rest.

The exact scheme (key management, rotation, …) is designed in the next step. Minimum requirements:

1. No plaintext appears in Mongo, logs, or error messages.
2. Decrypt only at the moment the adapter executes.
3. The master key can be rotated without recreating job configs.

---

### 12.7. Job config schema

**Decision**: detailed design happens during implementation (will be proposed in P002 / the design phase).

Reason for deferral: it depends heavily on which source adapters get prioritized in phase 1.

---

### 12.8. When to migrate to a queue stack (later)

Signals that mean it's time to migrate to BullMQ or equivalent — **not present in phase 1**, recorded here so we can recognize them when they arise:

1. Need to scale to ≥ 2 worker containers (HA, increased load).
2. Need delayed / scheduled jobs beyond plain cron (e.g. "retry in 1h", "callback after user confirmation").
3. Need queue observability that would cost more to build than installing Bull Board.
4. Another system already runs Redis → marginal cost ~0.

When that time comes, the state is still in Mongo, so we only swap the trigger layer — no architectural rewrite.

---

## 13. Short conclusion

The current requirement is to build a **Data Integration Service** for aPlanner, focusing first on the **pull-data** mechanism from files, databases, and external APIs. This service runs as a scheduled worker / job, pulls raw data from external sources, stores it as-is in MongoDB, and records metadata and sync history so that traceability, auditing, and downstream processing are all possible later.

The technical focus is not on data transformation right now, but on building a stable sync foundation that prevents duplicate jobs and duplicate data, records full history, and is ready to extend toward webhook / event adapters in the future.

The stack for phase 1 is **as simple as possible** — `@nestjs/schedule` + Mongo as the state store + sequential processing — fitting an on-prem single-node deployment, providing sufficient data-consistency control, and offering a clear scaling path if and when real demand materializes.
