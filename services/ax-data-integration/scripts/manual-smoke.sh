#!/usr/bin/env bash
# Automated manual-smoke test for ax-data-integration.
# Runs S0-S9 from docs/MANUAL-TEST.md and verifies each expected output.
#
# Spins up a dedicated docker-compose stack on non-default ports so it does not
# collide with any running dev stack on 3012/27017.
#
# Usage (from anywhere — script resolves its own path):
#   ./scripts/manual-smoke.sh
#
# Overridable env vars:
#   HOST_PORT          (default 3912)  — host port the service listens on
#   MONGO_HOST_PORT    (default 27917) — host port Mongo listens on
#   API_KEY            (default smoke-key-<pid>) — INTEGRATION_API_KEYS value
#   PROJECT_NAME       (default axdi-smoke)      — docker-compose project name
#   WAIT_STALE_SEC     (default 65)    — sleep before S7 retry; 0 = skip S7
#   KEEP_RUNNING       (default 0)     — 1 = skip teardown for debugging

set -uo pipefail

# ─── Locate the service folder (script lives in services/ax-data-integration/scripts/) ───
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

HOST_PORT=${HOST_PORT:-3912}
MONGO_HOST_PORT=${MONGO_HOST_PORT:-27917}
API_KEY=${API_KEY:-"smoke-key-$$"}
PROJECT_NAME=${PROJECT_NAME:-axdi-smoke}
WAIT_STALE_SEC=${WAIT_STALE_SEC:-65}
KEEP_RUNNING=${KEEP_RUNNING:-0}

SERVICE_URL="http://localhost:${HOST_PORT}"
# Compose pins these via `container_name:` so they're stable regardless of project name.
SERVICE_CONTAINER=ax-di-service
MONGO_CONTAINER=ax-di-mongo

# ─── Output helpers ───
if [[ -t 1 ]]; then
  GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'
else
  GREEN=''; RED=''; YELLOW=''; BOLD=''; NC=''
fi

PASS=0; FAIL=0
FAILED_CHECKS=()

section() { echo; echo -e "${BOLD}${YELLOW}=== $* ===${NC}"; }
info()    { echo -e "  ${YELLOW}…${NC} $*"; }

# Assert substring match
check_contains() {
  local name="$1"; local actual="$2"; local expected="$3"
  if [[ "$actual" == *"$expected"* ]]; then
    echo -e "  ${GREEN}✓${NC} $name"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}✗${NC} $name"
    echo "      expected to contain: $expected"
    echo "      actual:              ${actual:0:300}"
    FAIL=$((FAIL + 1))
    FAILED_CHECKS+=("$name")
  fi
}

# Assert exact equality
check_eq() {
  local name="$1"; local actual="$2"; local expected="$3"
  if [[ "$actual" == "$expected" ]]; then
    echo -e "  ${GREEN}✓${NC} $name"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}✗${NC} $name"
    echo "      expected: $expected"
    echo "      actual:   $actual"
    FAIL=$((FAIL + 1))
    FAILED_CHECKS+=("$name")
  fi
}

http_status() {
  local method="$1"; shift
  curl -s -o /dev/null -w '%{http_code}' -X "$method" "$@"
}

# Extract a top-level JSON string field. POSIX sed (works in Git Bash on Windows
# where grep -P fails with the "unibyte/UTF-8 locales" error). JSON-naive but
# adequate for { "id": "..." } shapes the admin API returns.
json_field() {
  local body="$1"; local field="$2"
  echo "$body" | sed -n "s/.*\"$field\":\"\\([^\"]*\\)\".*/\\1/p" | head -1
}

# Same idea for numeric fields: { "total": 42 }
json_number() {
  local body="$1"; local field="$2"
  echo "$body" | sed -n "s/.*\"$field\":\\([0-9][0-9]*\\).*/\\1/p" | head -1
}

# ─── Teardown trap ───
cleanup() {
  local rc=$?
  if [[ "$KEEP_RUNNING" == "1" ]]; then
    section "Skipping teardown (KEEP_RUNNING=1) — stack still running on :$HOST_PORT"
  else
    section "Teardown"
    docker compose -p "$PROJECT_NAME" -f "$SERVICE_DIR/docker-compose.yml" down -v >/dev/null 2>&1 || true
    # Hard nuke in case compose-down missed pinned name resources
    docker rm -f ax-di-service ax-di-mongo >/dev/null 2>&1 || true
    docker volume rm ax-di-mongo-data >/dev/null 2>&1 || true
    rm -f "$SERVICE_DIR/.env.smoke" "$SERVICE_DIR/v1.xlsx" "$SERVICE_DIR/v2.xlsx" 2>/dev/null || true
    echo "  cleaned"
  fi

  section "Summary"
  echo -e "  Passed: ${GREEN}${PASS}${NC}    Failed: ${RED}${FAIL}${NC}"
  if [[ $FAIL -gt 0 ]]; then
    echo -e "  ${RED}Failed checks:${NC}"
    for c in "${FAILED_CHECKS[@]}"; do echo "    - $c"; done
    exit 1
  fi
  echo -e "  ${GREEN}All checks passed.${NC}"
  exit "$rc"
}
trap cleanup EXIT

# ─── Pre-flight ───
command -v docker >/dev/null 2>&1 || { echo "docker not found"; exit 2; }
docker compose version >/dev/null 2>&1 || { echo "docker compose plugin not available"; exit 2; }
command -v curl >/dev/null 2>&1 || { echo "curl not found"; exit 2; }
command -v openssl >/dev/null 2>&1 || { echo "openssl not found"; exit 2; }

# ════════════════════════════════════════════════════════════════════════════
# S0 — Setup
# ════════════════════════════════════════════════════════════════════════════
section "S0 — Setup"

info "purging any leftover state from prior runs (container_name + named volume are pinned in compose, so they survive even compose-down)"
docker rm -f ax-di-service ax-di-mongo >/dev/null 2>&1 || true
docker volume rm ax-di-mongo-data >/dev/null 2>&1 || true

info "writing .env.smoke (host:$HOST_PORT  mongo:$MONGO_HOST_PORT  project:$PROJECT_NAME)"
cat > "$SERVICE_DIR/.env.smoke" <<EOF
INTEGRATION_API_KEYS=$API_KEY
INTEGRATION_MASTER_KEY_V1=$(openssl rand -base64 32)
INTEGRATION_MASTER_KEY_CURRENT=1
SERVICE_HOST_PORT=$HOST_PORT
MONGO_HOST_PORT=$MONGO_HOST_PORT
EOF

info "docker compose up --build -d (may take a few minutes on first run)"
( cd "$SERVICE_DIR" && docker compose -p "$PROJECT_NAME" --env-file .env.smoke up --build -d ) >/tmp/smoke-build.log 2>&1 \
  || { echo "compose up failed — see /tmp/smoke-build.log"; tail -40 /tmp/smoke-build.log; exit 2; }

info "waiting for /health"
for i in {1..60}; do
  if curl -fsS "$SERVICE_URL/health" >/dev/null 2>&1; then break; fi
  sleep 2
done
curl -fsS "$SERVICE_URL/health" >/dev/null || { echo "service never reported healthy"; exit 2; }
echo -e "  ${GREEN}✓${NC} service healthy at $SERVICE_URL"

# Indexes are NOT auto-created on service boot — operator runs `migrate-indexes`
# explicitly (see src/migrate-indexes.ts). Without the partial-unique index on
# (jobConfigId, status='running'), the concurrency lock in S6/S7 doesn't fire.
info "running ensureIndexes (matches production deploy step)"
docker exec "$SERVICE_CONTAINER" node dist/migrate-indexes 2>&1 | tail -3 | sed 's/^/    /'

K=(-H "x-api-key: $API_KEY")

# ════════════════════════════════════════════════════════════════════════════
# S1 — Public probes + API-key gate
# ════════════════════════════════════════════════════════════════════════════
section "S1 — Public probes + API-key gate"

check_contains "GET /health → ok"            "$(curl -sS "$SERVICE_URL/health")"        '"status":"ok"'
check_contains "GET /health/ready → mongo"   "$(curl -sS "$SERVICE_URL/health/ready")"  '"mongo":"connected"'
check_contains "GET / → service identity"    "$(curl -sS "$SERVICE_URL/")"              '"name":"ax-data-integration"'
check_eq       "GET /job-configs no key → 401" "$(http_status GET "$SERVICE_URL/job-configs")" "401"
check_contains "GET /job-configs with key → empty list" \
               "$(curl -sS "${K[@]}" "$SERVICE_URL/job-configs")"   '"total":0'

# ════════════════════════════════════════════════════════════════════════════
# S2 — Secret CRUD + AES-GCM + delete protection
# ════════════════════════════════════════════════════════════════════════════
section "S2 — Secret CRUD + crypto"

SECRET_RESP=$(curl -sS -X POST "$SERVICE_URL/secrets" "${K[@]}" -H "content-type: application/json" \
  -d '{"name":"smoke-secret","type":"axios","plaintext":"hunter2"}')
SECRET_ID=$(json_field "$SECRET_RESP" id)

check_contains "POST /secrets returns keyVersion:1"   "$SECRET_RESP" '"keyVersion":1'
check_contains "POST /secrets returns id"             "$SECRET_RESP" '"id":"'

LIST=$(curl -sS "${K[@]}" "$SERVICE_URL/secrets")
LEAK_COUNT=$(echo "$LIST" | grep -c 'hunter2' || true)
check_eq "GET /secrets does NOT leak plaintext" "$LEAK_COUNT" "0"

DETAIL=$(curl -sS "${K[@]}" "$SERVICE_URL/secrets/$SECRET_ID")
check_contains "GET /secrets/:id returns metadata only" "$DETAIL" '"name":"smoke-secret"'
check_eq "GET /secrets/:id has no encrypted/ciphertext/plaintext field" \
         "$(echo "$DETAIL" | grep -cE 'encrypted|ciphertext|plaintext' || true)" "0"

PATCH_STATUS=$(http_status PATCH "$SERVICE_URL/secrets/$SECRET_ID" "${K[@]}" \
                 -H "content-type: application/json" -d '{"plaintext":"rotated"}')
check_eq "PATCH /secrets/:id re-encrypt → 200" "$PATCH_STATUS" "200"

DEL_STATUS=$(http_status DELETE "$SERVICE_URL/secrets/$SECRET_ID" "${K[@]}")
check_eq "DELETE /secrets/:id (no refs) → 204" "$DEL_STATUS" "204"

# ════════════════════════════════════════════════════════════════════════════
# S3 — Excel sync end-to-end
# ════════════════════════════════════════════════════════════════════════════
section "S3 — Excel sync end-to-end"

info "building v1.xlsx inside the service container"
docker exec "$SERVICE_CONTAINER" node -e "
const x = require('exceljs');
const wb = new x.Workbook();
const ws = wb.addWorksheet('Data');
ws.addRow(['id','name','amount']);
ws.addRow([1,'Alice',100]); ws.addRow([2,'Bob',200]); ws.addRow([3,'Carol',300]);
wb.xlsx.writeBuffer().then(b => require('fs').writeFileSync('/tmp/v1.xlsx', b));
" >/dev/null
docker cp "$SERVICE_CONTAINER:/tmp/v1.xlsx" "$SERVICE_DIR/v1.xlsx" >/dev/null

UPLOAD_RESP=$(curl -sS -X POST "$SERVICE_URL/source-files" "${K[@]}" -F "file=@$SERVICE_DIR/v1.xlsx")
FILE_ID=$(json_field "$UPLOAD_RESP" id)
check_contains "POST /source-files returns id" "$UPLOAD_RESP" '"id":"'

JOB_RESP=$(curl -sS -X POST "$SERVICE_URL/job-configs" "${K[@]}" -H "content-type: application/json" -d "{
  \"name\":\"smoke-excel\",
  \"source\":{\"type\":\"excel\",\"config\":{\"sourceFileId\":\"$FILE_ID\",\"sheetName\":\"Data\",\"headerRow\":1,\"startRow\":2}},
  \"schedule\":{\"cronExpression\":\"0 0 1 1 *\"},
  \"identity\":{\"strategy\":\"primary-key\",\"fields\":[\"id\"]}
}")
JOB_ID=$(json_field "$JOB_RESP" id)
check_contains "POST /job-configs returns id" "$JOB_RESP" '"id":"'

TRIGGER_RESP=$(curl -sS -X POST "${K[@]}" "$SERVICE_URL/job-configs/$JOB_ID/trigger")
RUN_ID=$(json_field "$TRIGGER_RESP" runId)
check_contains "POST /job-configs/:id/trigger → success" "$TRIGGER_RESP" '"status":"success"'

DETAIL=$(curl -sS "${K[@]}" "$SERVICE_URL/sync-runs/$RUN_ID")
check_contains "run counts read=3"     "$DETAIL" '"read":3'
check_contains "run counts inserted=3" "$DETAIL" '"inserted":3'
check_contains "run counts unchanged=0" "$DETAIL" '"unchanged":0'

RAW=$(curl -sS "${K[@]}" "$SERVICE_URL/raw-records?jobConfigId=$JOB_ID")
check_contains "GET /raw-records total=3" "$RAW" '"total":3'

META=$(curl -sS "${K[@]}" "$SERVICE_URL/source-metadata/latest?jobConfigId=$JOB_ID")
check_contains "schema includes 'amount' field" "$META" '"name":"amount"'
check_contains "schemaHash is hex" "$META" '"schemaHash":"'

# ════════════════════════════════════════════════════════════════════════════
# S4 — Re-sync with changes → I/U/D classification
# ════════════════════════════════════════════════════════════════════════════
section "S4 — I/U/D classification on follow-up run"

info "building v2.xlsx (1 modified, 2 unchanged, 3 removed, 4 new)"
docker exec "$SERVICE_CONTAINER" node -e "
const x = require('exceljs');
const wb = new x.Workbook();
const ws = wb.addWorksheet('Data');
ws.addRow(['id','name','amount']);
ws.addRow([1,'Alice',150]); ws.addRow([2,'Bob',200]); ws.addRow([4,'Dave',400]);
wb.xlsx.writeBuffer().then(b => require('fs').writeFileSync('/tmp/v2.xlsx', b));
" >/dev/null
docker cp "$SERVICE_CONTAINER:/tmp/v2.xlsx" "$SERVICE_DIR/v2.xlsx" >/dev/null

FILE_V2=$(json_field "$(curl -sS -X POST "$SERVICE_URL/source-files" "${K[@]}" -F "file=@$SERVICE_DIR/v2.xlsx")" id)

PATCH_STATUS=$(http_status PATCH "$SERVICE_URL/job-configs/$JOB_ID" "${K[@]}" -H "content-type: application/json" \
  -d "{\"source\":{\"type\":\"excel\",\"config\":{\"sourceFileId\":\"$FILE_V2\",\"sheetName\":\"Data\",\"headerRow\":1,\"startRow\":2}}}")
check_eq "PATCH /job-configs/:id swap source → 200" "$PATCH_STATUS" "200"

RUN2_RESP=$(curl -sS -X POST "${K[@]}" "$SERVICE_URL/job-configs/$JOB_ID/trigger")
RUN2_ID=$(json_field "$RUN2_RESP" runId)
check_contains "Run #2 trigger → success" "$RUN2_RESP" '"status":"success"'

DETAIL2=$(curl -sS "${K[@]}" "$SERVICE_URL/sync-runs/$RUN2_ID")
check_contains "Run #2 inserted=1 (rec#4)"  "$DETAIL2" '"inserted":1'
check_contains "Run #2 updated=1 (rec#1)"   "$DETAIL2" '"updated":1'
check_contains "Run #2 unchanged=1 (rec#2)" "$DETAIL2" '"unchanged":1'
check_contains "Run #2 deleted=1 (rec#3)"   "$DETAIL2" '"deleted":1'

ACTIVE=$(curl -sS "${K[@]}" "$SERVICE_URL/raw-records?jobConfigId=$JOB_ID&status=active")
check_contains "active records total=3" "$ACTIVE" '"total":3'
DELETED=$(curl -sS "${K[@]}" "$SERVICE_URL/raw-records?jobConfigId=$JOB_ID&status=deleted")
check_contains "deleted records total=1" "$DELETED" '"total":1'

# runId filter — run #2 touched [1, 3, 4] (not 2 — unchanged only touches lastSeenAt)
BY_RUN=$(curl -sS "${K[@]}" "$SERVICE_URL/raw-records?jobConfigId=$JOB_ID&runId=$RUN2_ID")
check_contains "runId filter total=3" "$BY_RUN" '"total":3'

# ════════════════════════════════════════════════════════════════════════════
# S5 — Source-file delete protection
# ════════════════════════════════════════════════════════════════════════════
section "S5 — Source-file delete protection"

DEL_STATUS=$(http_status DELETE "$SERVICE_URL/source-files/$FILE_V2" "${K[@]}")
check_eq "DELETE referenced file → 409" "$DEL_STATUS" "409"
DEL_STATUS=$(http_status DELETE "$SERVICE_URL/source-files/$FILE_ID" "${K[@]}")
check_eq "DELETE unreferenced file → 204" "$DEL_STATUS" "204"

# ════════════════════════════════════════════════════════════════════════════
# S6 — Concurrency lock (force collision via ghost insert)
# ════════════════════════════════════════════════════════════════════════════
section "S6 — Concurrency lock"

info "injecting fresh ghost running doc (heartbeat now — sweeper won't touch)"
docker exec "$MONGO_CONTAINER" mongosh ax_data_integration --quiet --eval "
db.sync_runs.insertOne({
  _id: ObjectId(), jobConfigId: ObjectId('$JOB_ID'), triggeredBy: 'manual',
  status: 'running', startedAt: new Date(), heartbeatAt: new Date(),
  workerId: 'concurrent-worker:42',
  counts: {read:0, inserted:0, updated:0, unchanged:0, deleted:0, errors:0},
  errors: [], createdAt: new Date()
})
" >/dev/null

TRIGGER_STATUS=$(http_status POST "$SERVICE_URL/job-configs/$JOB_ID/trigger" "${K[@]}")
check_eq "trigger while lock held → 409" "$TRIGGER_STATUS" "409"

docker exec "$MONGO_CONTAINER" mongosh ax_data_integration --quiet --eval \
  "db.sync_runs.deleteOne({ workerId: 'concurrent-worker:42' })" >/dev/null

# ════════════════════════════════════════════════════════════════════════════
# S7 — Stale-worker recovery (optional — gated by WAIT_STALE_SEC)
# ════════════════════════════════════════════════════════════════════════════
if [[ "$WAIT_STALE_SEC" -le 0 ]]; then
  section "S7 — Stale recovery (SKIPPED — WAIT_STALE_SEC=0)"
else
  section "S7 — Stale-worker recovery (waits ${WAIT_STALE_SEC}s for sweeper)"

  info "injecting ghost with 10-min-old heartbeat"
  docker exec "$MONGO_CONTAINER" mongosh ax_data_integration --quiet --eval "
  db.sync_runs.insertOne({
    _id: ObjectId(), jobConfigId: ObjectId('$JOB_ID'), triggeredBy: 'manual',
    status: 'running', startedAt: new Date(),
    heartbeatAt: new Date(Date.now() - 10*60*1000),
    workerId: 'dead-worker:9999',
    counts: {read:0, inserted:0, updated:0, unchanged:0, deleted:0, errors:0},
    errors: [], createdAt: new Date()
  })
  " >/dev/null

  TRIGGER_STATUS=$(http_status POST "$SERVICE_URL/job-configs/$JOB_ID/trigger" "${K[@]}")
  check_eq "trigger while ghost holds lock → 409" "$TRIGGER_STATUS" "409"

  info "sleeping ${WAIT_STALE_SEC}s for one sweeper tick…"
  sleep "$WAIT_STALE_SEC"

  RECOVERY=$(curl -sS -X POST "${K[@]}" "$SERVICE_URL/job-configs/$JOB_ID/trigger")
  check_contains "trigger after sweep → success" "$RECOVERY" '"status":"success"'

  STALE=$(curl -sS "${K[@]}" "$SERVICE_URL/sync-runs?jobConfigId=$JOB_ID&status=stale")
  check_contains "stale list non-empty" "$STALE" '"total":'
  STALE_TOTAL=$(json_number "$STALE" total)
  if [[ "${STALE_TOTAL:-0}" -ge 1 ]]; then
    echo -e "  ${GREEN}✓${NC} sweeper marked ≥1 run stale (total=$STALE_TOTAL)"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}✗${NC} expected ≥1 stale run, got $STALE_TOTAL"
    FAIL=$((FAIL + 1))
    FAILED_CHECKS+=("stale sweeper recovery")
  fi
fi

# ════════════════════════════════════════════════════════════════════════════
# S8 — Retry endpoint
# ════════════════════════════════════════════════════════════════════════════
section "S8 — Retry endpoint"

# Pick any finished run for the job (skip status=running ones).
FINISHED_RUN=$(json_field "$(curl -sS "${K[@]}" "$SERVICE_URL/sync-runs?jobConfigId=$JOB_ID&status=success")" id)
if [[ -z "$FINISHED_RUN" ]]; then
  echo -e "  ${RED}✗${NC} no finished run available to retry"
  FAIL=$((FAIL + 1))
  FAILED_CHECKS+=("retry pre-condition")
else
  RETRY_RESP=$(curl -sS -X POST "${K[@]}" "$SERVICE_URL/sync-runs/$FINISHED_RUN/retry")
  check_contains "retry returns new runId" "$RETRY_RESP" '"runId":"'
  check_contains "retry returns parentRunId=$FINISHED_RUN" "$RETRY_RESP" "\"parentRunId\":\"$FINISHED_RUN\""
fi

# ════════════════════════════════════════════════════════════════════════════
# (cleanup runs from the EXIT trap)
# ════════════════════════════════════════════════════════════════════════════
