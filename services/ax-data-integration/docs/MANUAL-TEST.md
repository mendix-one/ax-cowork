# Manual test playbook

Hands-on scenarios for verifying every Phase-1 surface end-to-end. Pairs with [`scripts/manual-smoke.sh`](../scripts/manual-smoke.sh) which automates S0–S9 with output verification.

## Contents

- [How you can interact with the service](#how-you-can-interact-with-the-service)
- [S0 — Setup](#s0--setup-3-min)
- [S1 — Public probes + API-key gate](#s1--public-probes--api-key-gate)
- [S2 — Secret CRUD + AES-GCM round-trip + delete protection](#s2--secret-crud--aes-gcm-round-trip--delete-protection)
- [S3 — Excel sync end-to-end (the hero scenario)](#s3--excel-sync-end-to-end-the-hero-scenario)
- [S4 — Re-sync with changes → verify I/U/D classification](#s4--re-sync-with-changes--verify-iud-classification)
- [S5 — Source-file delete blocked while a job references it](#s5--source-file-delete-blocked-while-a-job-references-it)
- [S6 — Concurrency lock (no overlapping runs per job)](#s6--concurrency-lock-no-overlapping-runs-per-job)
- [S7 — Stale-worker recovery (simulate a crashed worker)](#s7--stale-worker-recovery-simulate-a-crashed-worker)
- [S8 — Retry a finished run](#s8--retry-a-finished-run)
- [S9 — Teardown](#s9--teardown)
- [Negative tests](#negative-tests-worth-running)
- [Bonus — REST adapter scenario (no Excel needed)](#bonus--rest-adapter-scenario-no-excel-needed)
- [Automation](#automation)

---

## How you can interact with the service

You have three options — pick whichever fits your comfort level. The scenarios below are written in `curl` form for portability, but every endpoint also works from the other two.

### 1. Command line (`curl`) — what this playbook uses

Scriptable, copy-paste, no extra tools. Best for smoke tests and CI. **On Windows: run from Git Bash or WSL** (PowerShell `curl` is an alias for `Invoke-WebRequest` and behaves differently).

### 2. Swagger UI — built in, easiest for first-time exploration

Open `http://localhost:3012/api-docs` in a browser.

- Click **Authorize** (top right), paste your API key — every subsequent request sends `x-api-key` automatically.
- Try requests directly from the browser, see response body + status code inline.
- File uploads for `POST /source-files` work via a normal form field — no `-F` needed.

This is the easiest path for **non-technical users** and the recommended way for the first manual test.

### 3. API client GUI (Postman / Insomnia / Bruno / VS Code REST Client)

Import the OpenAPI spec from `http://localhost:3012/api-docs-json` → instant collection of all 27 endpoints with schemas. Set an env var `apiKey = demo-key` and you're good.

### What is NOT bundled (yet)

There is **no Admin UI for data browsing** in Phase 1 (planned for Phase 2). To browse `raw_records` as a table with filters/sort, either:

- Call `GET /raw-records?jobConfigId=…` and read the JSON, or
- Use a MongoDB GUI (Compass / Studio 3T / `mongosh`) against `mongodb://localhost:27017/ax_data_integration` and browse the 7 collections directly.

---

## S0 — Setup (3 min)

```bash
cd services/ax-data-integration

# Generate a fresh master key (32 random bytes → 44-char base64) and write .env.
# The .env is gitignored — never commit it.
cat > .env <<EOF
INTEGRATION_API_KEYS=demo-key
INTEGRATION_MASTER_KEY_V1=$(openssl rand -base64 32)
INTEGRATION_MASTER_KEY_CURRENT=1
SERVICE_HOST_PORT=3012
MONGO_HOST_PORT=27017
EOF

docker compose up --build -d

# Wait for the service to report healthy
until curl -fsS http://localhost:3012/health >/dev/null; do sleep 1; done
echo "✓ service up"

# ⚠️ Required: indexes are NOT auto-created on service boot. Production deploy MUST
# run this script after `docker compose up` (or as a one-shot job alongside it).
# Without it the partial-unique `(jobConfigId, status='running')` lock does NOT exist,
# so overlapping runs are silently allowed — scenarios S6 and S7 below will fail.
docker exec ax-di-service node dist/migrate-indexes
```

Expected: two containers running (`ax-di-mongo`, `ax-di-service`), service healthy within ~10s of Mongo coming up, `migrate-indexes` reports `created=19 existed=0` on the first run (or all `existed` on re-runs).

---

## S1 — Public probes + API-key gate

```bash
# Liveness — no DB, no key
curl http://localhost:3012/health
# → {"status":"ok"}

# Readiness — pings Mongo
curl http://localhost:3012/health/ready
# → {"status":"ready","mongo":"connected"}

# Service identity
curl http://localhost:3012/
# → {"name":"ax-data-integration","status":"ok"}

# Auth gate: no key → 401
curl -i http://localhost:3012/job-configs | head -1
# → HTTP/1.1 401 Unauthorized

# Auth gate: valid key → 200 with empty list
curl -H "x-api-key: demo-key" http://localhost:3012/job-configs
# → {"items":[],"total":0,"page":1,"pageSize":50}
```

Verifies: `@Public()` decorator works on `/health*` + `/`; `ApiKeyGuard` blocks everything else; `INTEGRATION_API_KEYS` env was parsed correctly.

---

## S2 — Secret CRUD + AES-GCM round-trip + delete protection

```bash
K='x-axios-key: demo-key'

# Create
SECRET=$(curl -sS -X POST http://localhost:3012/secrets -H "$K" -H "content-type: application/json" \
  -d '{"name":"oracle-readonly","type":"db","plaintext":"hunter2"}')
echo "$SECRET"
# → {"id":"...","name":"oracle-readonly","type":"db","keyVersion":1,...}

SECRET_ID=$(echo "$SECRET" | grep -oP '"id":"\K[^"]+')

# Plaintext must NEVER appear in any read endpoint
curl -sS -H "$K" http://localhost:3012/secrets | grep -c hunter2
# → 0  (zero leak — T-B01 guarantee)

# Detail returns metadata only
curl -sS -H "$K" "http://localhost:3012/secrets/$SECRET_ID"
# → name / type / keyVersion / createdAt — no encrypted/ciphertext/plaintext

# Re-encrypt under current master key
curl -sS -X PATCH -H "$K" -H "content-type: application/json" \
  -d '{"plaintext":"new-password"}' "http://localhost:3012/secrets/$SECRET_ID"

# Delete (no references yet) → 204
curl -i -X DELETE -H "$K" "http://localhost:3012/secrets/$SECRET_ID" | head -1
# → HTTP/1.1 204 No Content
```

Verifies: AES-256-GCM encrypt/decrypt with master key from env; plaintext never leaks via list/detail; `SecretsService.delete` succeeds when no references exist (the 409 path is checked in S5).

---

## S3 — Excel sync end-to-end (the hero scenario)

### Build a demo Excel file

The service container has `exceljs` available, so we can build the file in-container and copy it out:

```bash
docker exec ax-di-service node -e "
const x = require('exceljs');
const wb = new x.Workbook();
const ws = wb.addWorksheet('Data');
ws.addRow(['id','name','amount']);
ws.addRow([1,'Alice',100]); ws.addRow([2,'Bob',200]); ws.addRow([3,'Carol',300]);
wb.xlsx.writeBuffer().then(b => require('fs').writeFileSync('/tmp/v1.xlsx', b));
"
docker cp ax-di-service:/tmp/v1.xlsx ./v1.xlsx
```

### Wire upload → job → trigger → inspect

```bash
K='x-axios-key: demo-key'

# 1. Upload via multipart form
FILE_ID=$(curl -sS -X POST http://localhost:3012/source-files -H "$K" -F file=@v1.xlsx | grep -oP '"id":"\K[^"]+')
echo "file: $FILE_ID"

# 2. Create job_config pointing at the file
JOB_ID=$(curl -sS -X POST http://localhost:3012/job-configs -H "$K" -H "content-type: application/json" -d "{
  \"name\":\"demo-excel\",
  \"source\":{\"type\":\"excel\",\"config\":{\"sourceFileId\":\"$FILE_ID\",\"sheetName\":\"Data\",\"headerRow\":1,\"startRow\":2}},
  \"schedule\":{\"cronExpression\":\"0 0 1 1 *\"},
  \"identity\":{\"strategy\":\"primary-key\",\"fields\":[\"id\"]}
}" | grep -oP '"id":"\K[^"]+')
echo "job: $JOB_ID"

# 3. Manual trigger via HTTP
RUN=$(curl -sS -X POST -H "$K" "http://localhost:3012/job-configs/$JOB_ID/trigger")
echo "$RUN"
# → {"runId":"...","status":"success"}

RUN_ID=$(echo "$RUN" | grep -oP '"runId":"\K[^"]+')

# 4. Inspect run counts
curl -sS -H "$K" "http://localhost:3012/sync-runs/$RUN_ID"
# Expected counts: read:3, inserted:3, updated:0, unchanged:0, deleted:0, errors:0

# 5. Inspect raw_records
curl -sS -H "$K" "http://localhost:3012/raw-records?jobConfigId=$JOB_ID"
# Expected: 3 items, recordKey ∈ ["1","2","3"], status:active, version:1

# 6. Inspect detected schema
curl -sS -H "$K" "http://localhost:3012/source-metadata/latest?jobConfigId=$JOB_ID"
# Expected fields: [{name:"id",type:"integer"}, {name:"name",type:"string"}, {name:"amount",type:"integer"}]
```

Verifies: GridFS upload + dedup; job-config CRUD; sync executor end-to-end; classification (insert path); source-metadata snapshot; admin API surface.

---

## S4 — Re-sync with changes → verify I/U/D classification

```bash
# Build v2: rec#1 amount changed, rec#2 unchanged, rec#3 removed, rec#4 new
docker exec ax-di-service node -e "
const x = require('exceljs');
const wb = new x.Workbook();
const ws = wb.addWorksheet('Data');
ws.addRow(['id','name','amount']);
ws.addRow([1,'Alice',150]); ws.addRow([2,'Bob',200]); ws.addRow([4,'Dave',400]);
wb.xlsx.writeBuffer().then(b => require('fs').writeFileSync('/tmp/v2.xlsx', b));
"
docker cp ax-di-service:/tmp/v2.xlsx ./v2.xlsx

K='x-axios-key: demo-key'
FILE_V2=$(curl -sS -X POST http://localhost:3012/source-files -H "$K" -F file=@v2.xlsx | grep -oP '"id":"\K[^"]+')

# Point the job at v2
curl -sS -X PATCH -H "$K" -H "content-type: application/json" \
  -d "{\"source\":{\"type\":\"excel\",\"config\":{\"sourceFileId\":\"$FILE_V2\",\"sheetName\":\"Data\",\"headerRow\":1,\"startRow\":2}}}" \
  "http://localhost:3012/job-configs/$JOB_ID"

# Trigger run #2
RUN2=$(curl -sS -X POST -H "$K" "http://localhost:3012/job-configs/$JOB_ID/trigger")
RUN2_ID=$(echo "$RUN2" | grep -oP '"runId":"\K[^"]+')

# Expected counts: read:3, inserted:1 (#4), updated:1 (#1), unchanged:1 (#2), deleted:1 (#3)
curl -sS -H "$K" "http://localhost:3012/sync-runs/$RUN2_ID"

# 3 active (1, 2, 4) + 1 deleted (3)
curl -sS -H "$K" "http://localhost:3012/raw-records?jobConfigId=$JOB_ID&status=active"
curl -sS -H "$K" "http://localhost:3012/raw-records?jobConfigId=$JOB_ID&status=deleted"

# runId filter → records touched by run #2 should be [1 (updated), 3 (deleted), 4 (inserted)]
# rec#2 is NOT in the result because "unchanged" only touches lastSeenAt, not lastUpdatedRunId
curl -sS -H "$K" "http://localhost:3012/raw-records?jobConfigId=$JOB_ID&runId=$RUN2_ID"
```

Verifies: full I/U/D classification in one follow-up run; PATCH `/job-configs/:id` works for swapping `sourceFileId`; `runId` filter on `/raw-records` correctly correlates records to the run that touched them.

---

## S5 — Source-file delete blocked while a job references it

```bash
K='x-axios-key: demo-key'

# Current job references $FILE_V2 → delete must be rejected
curl -i -X DELETE -H "$K" "http://localhost:3012/source-files/$FILE_V2" | head -1
# → HTTP/1.1 409 Conflict

# v1 has no referrers anymore → delete succeeds
curl -i -X DELETE -H "$K" "http://localhost:3012/source-files/$FILE_ID" | head -1
# → HTTP/1.1 204 No Content
```

Verifies: `SourceFilesService.delete` referential check via `JobConfigRepository.countBySourceFileRef`.

---

## S6 — Concurrency lock (no overlapping runs per job)

Excel finishes very fast so the two triggers can both succeed before the second arrives. Force a lock collision by injecting a fake `running` doc first:

```bash
docker exec ax-di-mongo mongosh ax_data_integration --quiet --eval "
db.sync_runs.insertOne({
  _id: ObjectId(),
  jobConfigId: ObjectId('$JOB_ID'),
  triggeredBy: 'manual',
  status: 'running',
  startedAt: new Date(),
  heartbeatAt: new Date(),   // fresh — sweeper will NOT touch it
  workerId: 'other-worker:42',
  counts: {read:0, inserted:0, updated:0, unchanged:0, deleted:0, errors:0},
  errors: [],
  createdAt: new Date()
})
"

K='x-axios-key: demo-key'
curl -i -X POST -H "$K" "http://localhost:3012/job-configs/$JOB_ID/trigger" | head -1
# → HTTP/1.1 409 Conflict

# Cleanup the ghost
docker exec ax-di-mongo mongosh ax_data_integration --quiet --eval "
db.sync_runs.deleteOne({ workerId: 'other-worker:42' })
"
```

Verifies: the partial-unique `(jobConfigId, status='running')` index throws E11000 on overlap, and the controller maps it to 409.

---

## S7 — Stale-worker recovery (simulate a crashed worker)

```bash
K='x-axios-key: demo-key'

# 1. Inject a fake "dead worker" run with an old heartbeat (10 min ago)
docker exec ax-di-mongo mongosh ax_data_integration --quiet --eval "
db.sync_runs.insertOne({
  _id: ObjectId(),
  jobConfigId: ObjectId('$JOB_ID'),
  triggeredBy: 'manual',
  status: 'running',
  startedAt: new Date(),
  heartbeatAt: new Date(Date.now() - 10*60*1000),
  workerId: 'dead-worker:9999',
  counts: {read:0, inserted:0, updated:0, unchanged:0, deleted:0, errors:0},
  errors: [],
  createdAt: new Date()
})
"

# 2. Trigger now → 409 (ghost holds the partial-unique lock)
curl -i -X POST -H "$K" "http://localhost:3012/job-configs/$JOB_ID/trigger" | head -1
# → HTTP/1.1 409

# 3. Wait for one sweeper tick (default interval 60s, timeout 120s — a 10-min-old
#    heartbeat triggers immediately on the next tick).
sleep 65

# 4. Trigger succeeds — lock has been released
curl -sS -X POST -H "$K" "http://localhost:3012/job-configs/$JOB_ID/trigger"
# → {"runId":"...","status":"success"}

# 5. Ghost is now status=stale + finishedAt + heartbeat-timeout error
curl -sS -H "$K" "http://localhost:3012/sync-runs?jobConfigId=$JOB_ID&status=stale"
```

Verifies: stale-run sweeper detects orphaned `running` docs, flips them to `stale`, releases the lock — the crash-recovery path that the executor relies on.

---

## S8 — Retry a finished run

```bash
K='x-axios-key: demo-key'

# Pick any finished sync_run for the job
RUN_ID=$(curl -sS -H "$K" "http://localhost:3012/sync-runs?jobConfigId=$JOB_ID" | grep -oP '"id":"\K[^"]+' | head -1)

# Retry creates a new run with parentRunId pointing at the original
curl -sS -X POST -H "$K" "http://localhost:3012/sync-runs/$RUN_ID/retry"
# → {"runId":"<new>","status":"success","parentRunId":"<old>"}
```

Verifies: retry endpoint creates a fresh `sync_run` with `triggeredBy='retry'` + `parentRunId`; uses the CURRENT `job_config` snapshot (not a frozen copy from the parent).

---

## S9 — Teardown

```bash
docker compose down -v       # -v also drops the Mongo volume
rm -f .env v1.xlsx v2.xlsx
```

---

## Negative tests worth running

| Scenario                                                                                 | Expected                                                                            |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `POST /job-configs` missing `identity`                                                   | 400 with field-level message                                                        |
| `POST /job-configs` with `identity.strategy=hash` and no `acknowledgeHashSemantics:true` | 400 (P002 §9.1 enforcement)                                                         |
| `POST /secrets` with the same `name` twice                                               | 201 first, **409** second (unique constraint)                                       |
| Trigger a job whose `credentialsRef` points at a deleted secret                          | run finalizes `failed`, `errors[0].stage='other'`, message names the missing secret |
| Upload a file > 100 MB                                                                   | `413 Payload Too Large`                                                             |
| `GET /raw-records` without `jobConfigId`                                                 | 400 (required filter)                                                               |
| `GET /source-metadata/:id` with malformed id                                             | 400 (`ObjectIdPipe`)                                                                |
| `POST /sync-runs/:id/retry` on a run that is still `status=running`                      | 400 with "still in flight" message                                                  |
| `POST /sync-runs/:id/retry` after deleting the underlying job_config                     | 404                                                                                 |

---

## Bonus — REST adapter scenario (no Excel needed)

Use any public JSON API to exercise the full pipeline without building a file:

```bash
K='x-axios-key: demo-key'

JOB_ID=$(curl -sS -X POST http://localhost:3012/job-configs -H "$K" -H "content-type: application/json" -d '{
  "name":"demo-rest",
  "source":{"type":"rest","config":{
    "baseUrl":"https://jsonplaceholder.typicode.com",
    "endpoint":"/users","method":"GET"
  }},
  "schedule":{"cronExpression":"0 0 1 1 *"},
  "identity":{"strategy":"primary-key","fields":["id"]}
}' | grep -oP '"id":"\K[^"]+')

curl -sS -X POST -H "$K" "http://localhost:3012/job-configs/$JOB_ID/trigger"
# Adapter hits the API, parses JSON, syncs 10 users into raw_records
```

Then browse `GET /raw-records?jobConfigId=$JOB_ID` to see the synced records.

---

## Automation

`scripts/manual-smoke.sh` runs S0–S9 (skipping S6 — which requires manual ghost injection — and shortening S7 if `WAIT_STALE_SEC=0`) and verifies every expected output. Run from the service folder:

```bash
./scripts/manual-smoke.sh
```

Override defaults via env: `HOST_PORT`, `API_KEY`, `PROJECT_NAME`, `WAIT_STALE_SEC=0` (skip the 65-second wait in S7), `KEEP_RUNNING=1` (skip teardown for debugging).
