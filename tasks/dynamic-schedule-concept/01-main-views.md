# Dynamic Schedule — Main Views

> Wireframes for the seven main views, selected from the **Left Rail**. Shell, tokens, and conventions defined in [README.md](README.md). All screens assume a 1440×900 viewport with both rails expanded; the Right Panel is shown collapsed unless a screen needs it.

| #   | View                                              | Purpose                                                                                       |
| --- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | [Gantt (Simulation)](#1-gantt-simulation)         | The default canvas. PO → Family → Stage → Step on a timeline. Drag to shift, see ripple.      |
| 2   | [Analysis View](#2-analysis-view)                 | Decision support: workload heatmap, commitment risk, bottleneck shift, constraint validation. |
| 3   | [Production Order](#3-production-order)           | List/edit POs, customer commits, priorities, status.                                          |
| 4   | [Shop Floor Capacity](#4-shop-floor-capacity)     | Tool-group / tool / chamber capacity, qualification matrix, PM calendar.                      |
| 5   | [Process Tuning Logic](#5-process-tuning-logic)   | SPC-driven process-time tune suggestions. Send to Process Engineering.                        |
| 6   | [Capacity Tuning Logic](#6-capacity-tuning-logic) | Capacity tune suggestions for Equipment Engineering.                                          |
| 7   | [Data Integration](#7-data-integration)           | Source feeds, sync status, mapping.                                                           |

---

## 1. Gantt (Simulation)

**Purpose** — Sarah's default canvas. Visualize the MPS as Production Order → Production Family → Stage → Step on a timeline. Drag to shift; ripple analysis updates in real time. Color-encoded by status (on-track / at-risk / slipped / hot-lot). Compare against another plan via the right panel.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔ⓘ3] [👤] [⚙]          |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊◀│  Gantt (Simulation)              [left]  [Apr 2026 ▾]  [Day|Wk|Mo]  [Filter ▾] [+]  | 🤖 |
| 📈 +-+----------------------------------------------------------------------------------+-+ ⇄ |
| 📦 |Task / Lot          Start    Days |  29 Mon  30 Tue  31 Wed  1 Thu  2 Fri  3 Sat  4 |  ⏳|
| 🏭 |▼ PO-2025-118 (Cust A)                |[━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]| | 🕘|
| 🔧 |  ▼ Family V9-QLC-A   2026-04-29 28  |  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]   | 💡|
| ⚙️ |   ▸ FEOL Dep         2026-04-29  6  |  [━━━━━━━]                                |    |
| 🔌 |   ▸ HARC Etch        2026-05-05  8  |          [━━━━━━━━━━━] ★HOT              |    |
|    |   ▸ WL Fill          2026-05-13  5  |                       [━━━━━━]            |    |
|    |   ▸ BEOL             2026-05-18  7  |                              [━━━━━━━━]  |    |
|    |   ◆ M1: 1,000 wafers out  2026-05-25                                  ◆        |    |
|    |▼ PO-2025-119 (Cust B)                |          [━━━━━━━━━━━━━━━━━━━━━━━━]      |    |
|    |  ▼ Family V9-TLC-B   2026-05-02 22  |          [━━━━━━━━━━━━━━━━━━━━━━━━] AT-RISK|   |
|    |   ▸ FEOL Dep         2026-05-02  6  |          [━━━━━━━]                        |    |
|    |   ▸ HARC Etch        2026-05-08  9  |                  [━━━━━━━━━━] ⚠ Cap-overload|  |
|    |   ▸ WL Fill          2026-05-17  4  |                              [━━━━━]      |    |
|    |   ▸ BEOL             2026-05-21  3  |                                   [━━━]   |    |
|    |   ◆ M1: 500 wafers out    2026-05-24                                  ◆ SLIP 2d  |    |
|    |▶ PO-2025-120 (Cust C)         …     |  (collapsed)                              |    |
|    +-+----------------------------------------------------------------------------------+-+    |
|    | Workload mini-strip  HARC ▮▮▮▮▮▯▯▯ 78% | WL Fill ▮▮▮▯▯▯▯▯ 41% | Probe ▮▮▮▮▮▮▮▯ 89% ⚠|    |
|    +-----------------------------------------------------------------------------------+    |
+----+--------------------------------------------------------------------------------------+----+
```

### Components

| Region                  | Detail                                                                                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View header             | Plan tab (active plan); horizon picker (Day / Week / Month); date scrubber; filter (by customer, family, status, tool group); `+` adds a manual override                                                             |
| Task tree (left column) | Hierarchical: PO → Family → Stage → Step → Milestone (◆). Indent collapses/expands per row.                                                                                                                          |
| Start / Days columns    | Computed dates from the optimizer (P50). Hover shows P50/P80/P95.                                                                                                                                                    |
| Gantt canvas            | Time axis (day labels). Bars are stage/step segments. Color encodes status: blue (on-track), amber (at-risk), red (slipped), purple (hot lot ★). Diamonds = milestones (commitments).                                |
| Bar interactions        | Click → opens **Batch Detail Drawer** (modal-on-right). Drag → ripple preview (downstream commits shift in real time; confirm to apply). Right-click → context menu (split, pin, mark hot lot, reroute, send to AI). |
| Workload mini-strip     | Sticky footer of the canvas. Top 3 tool-group utilizations for the visible horizon. Click → jumps to Analysis View focused on that tool group.                                                                       |
| Inline alerts           | `⚠ Cap-overload`, `SLIP 2d`, `★ HOT` chips inline with bars; click for explainability popover.                                                                                                                       |

### AI / data dependencies

- Optimizer must return `(lot, step_index, tool_group, recipe) → (start_p50, p80, p95, end_p50, p80, p95, status)`
- Constraint engine evaluates the plan continuously and emits validation alerts (`Cap-overload`, `Unqualified route`, `Qual expiring`)
- Drag-ripple call: optimistic local recompute → server confirmation within ~1 s
- Color/status fed from commitment-risk model + tool-group workload

### Open questions

- Granularity in the canvas: stage-level vs step-level by default? Step-level may overwhelm; stage-level may hide reentrant detail. Validate with planners.
- Show all WIP or filter by date window?
- Drag for slipping a milestone: should commit-impact propagate to Cust comms automatically or queue for review?

---

## 2. Analysis View

**Purpose** — Decision support. Sarah opens this to _defend_ a plan to Jennifer (Ops Mgr) or assess risk before commit. Combines workload heatmap, bottleneck shift indicator, commitment-risk panel, and constraint validation.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔ⓘ3] [👤] [⚙]          |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  Analysis View                                  [Horizon: 14 wk ▾]  [Plan A ▾]      |    |
| 📈◀+----------------------------------------------------------------------------------+    |    |
| 📦 |  KPI ROW                                                                          |    |    |
| 🏭 |  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐|    |    |
| 🔧 |  │ Plan adher. │ │ Commit at   │ │ Bottleneck  │ │ X-factor    │ │ Yield Δ     ││    |    |
| ⚙️ |  │  87% ▲2.1%  │ │  risk: 3    │ │  HARC Etch  │ │  3.2  (▼)   │ │ −1.4% on   ││    |    |
| 🔌 |  │             │ │   (Cust B,C)│ │  → WL Fill  │ │             │ │  232L QLC   ││    |    |
|    |  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘|    |    |
|    +----------------------------------------------------------------------------------+    |    |
|    |  WORKLOAD HEATMAP — Tool Group × Day                            [Filter group ▾]|    |    |
|    |                                                                                  |    |    |
|    |  Tool Group       29 30 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18    |    |    |
|    |  HARC Etch       ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ⚠⚠ ⚠⚠ ⚠⚠ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮     |    |    |
|    |  ONON CVD        ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮     |    |    |
|    |  WL Tungsten     ░░ ░░ ░░ ░░ ░░ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ░░ ░░ ░░ ░░ ░░ ░░ ░░ ░░     |    |    |
|    |  ArFi Litho      ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮     |    |    |
|    |  CMP             ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮     |    |    |
|    |  Probe           ▮▮ ▮▮ ⚠⚠ ⚠⚠ ⚠⚠ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮ ▮▮     |    |    |
|    |  Legend  ░ idle <40   ▮ safe 40-70   ▮▮ warning 70-85   ⚠ overload >85           |    |    |
|    +-+-------------------------------------------+-+-------------------------------+--+    |    |
|    | | COMMITMENT-RISK PANEL                     | | BOTTLENECK SHIFT TIMELINE     |  |    |    |
|    | | Cust  PO/M     P50    P80    P95   Slip  | | wk1  wk2  wk3  wk4  wk5  wk6 |  |    |    |
|    | | A     P-118/M1 05-25  05-26  05-28   ok  | | HARC HARC HARC HARC HARC WL  |  |    |    |
|    | | B     P-119/M1 05-24  05-26  05-29  +2d  | |                              |  |    |    |
|    | | C     P-120/M1 06-01  06-04  06-08  +4d  | | (HARC dominates through wk 5,|  |    |    |
|    | |                                          | |  shifts to WL Fill in wk 6)  |  |    |    |
|    | +------------------------------------------+ +------------------------------+  |    |    |
|    | | CONSTRAINT VALIDATION (3 issues)                                            |  |    |    |
|    | |  ⚠ HARC overload days 08-10 (Plan A)        → Reroute 6 lots to ETC-07/09?  |  |    |    |
|    | |  ⚠ Recipe R-QLC-CH qual expires 2026-06-12 (Tool ETC-44 chamber C)          |  |    |    |
|    | |  ⚠ Probe over-capacity days 01-03 (sampling rule mismatch?)                 |  |    |    |
|    | +-----------------------------------------------------------------------------+  |    |    |
+----+--------------------------------------------------------------------------------------+----+
```

### Components

| Region                     | Detail                                                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| KPI row                    | Plan adherence, commits-at-risk count, current bottleneck (with predicted shift), live X-factor, yield delta vs plan |
| Workload heatmap           | Tool Group × Day. Cell color = utilization band. Hover = exact %; click = drill into Tool Group view                 |
| Commitment-risk panel      | Per customer commitment: P50/P80/P95 dates; slip days; color row by severity                                         |
| Bottleneck-shift timeline  | Predicted bottleneck per week across horizon. Helps Sarah see "the constraint is moving"                             |
| Constraint validation list | All current rule violations; one-click "ask AI to fix" → triggers a Replan in the Right Panel                        |

### AI / data dependencies

- OEE / workload time-series per tool group (MES + APC)
- Probe yield SPC stream → yield-delta KPI
- Cycle-time distribution per (tool group, recipe) → X-factor calc
- Bottleneck identifier (recomputed on each replan): the most binding tool-group across the horizon

### Open questions

- Heatmap density: how many tool groups visible without overwhelming? Default-show top 8, expandable?
- Bottleneck timeline horizon: 14 wk standard. Multi-bottleneck or single dominant?

---

## 3. Production Order

**Purpose** — Manage the input demand side of the plan. Sarah reviews/edit POs, customer commitments, priorities, and statuses. Filterable list with detail panel.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔] [👤] [⚙]            |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  Production Order                  [+ New PO] [Import] [Search 🔍] [Filter: Active ▾]|    |
| 📈 +-------------------------------------------------------------+------------------------+    |
| 📦◀|  PO #     Customer  Family       Qty    Priority  M1 Date  | DETAIL — P-2025-119    |    |
| 🏭 |  P-118    Cust A    V9-QLC-A     12,000  P1 ★HOT  05-25 ok | Customer: Cust B       |    |
| 🔧 |  P-119▶   Cust B    V9-TLC-B      8,000  P2       05-24 +2 | Product: V9-TLC-B (TLC)|    |
| ⚙️ |  P-120    Cust C    V9-QLC-A     15,000  P3       06-01 +4 | Spec: SP-TLC-V9 v3.2   |    |
| 🔌 |  P-121    Cust D    V9-TLC-C      5,000  P3       06-12 ok | Wafer Start: 2026-05-02|    |
|    |  P-122    Cust E    V9-QLC-B      9,500  P2       06-20 ok | Lot Size: 25 wafers    |    |
|    |  P-123    Cust A    V10-QLC-A   (NPI) 4k  P-NPI   07-30 plan| Lots: 320 (8,000 / 25) |    |
|    |                                                              |                        |    |
|    |                                                              | Commitments / Milestones|   |
|    |                                                              | ◆ M1  500 w/o  2026-05-24|  |
|    |                                                              |    Status: At-risk +2d  |   |
|    |                                                              |    Cause: HARC overload |   |
|    |                                                              | ◆ M2  3,000 w/o 2026-06-15|  |
|    |                                                              |    Status: on track     |   |
|    |                                                              |                          |   |
|    |                                                              | Process flow (master)    |   |
|    |                                                              | FEOL Dep → HARC → WL Fill→ |   |
|    |                                                              | … → BEOL → Probe → Asm   |   |
|    |                                                              | (245 step entries)       |   |
|    |                                                              |                          |   |
|    |                                                              | [Replan this PO] [Edit]  |   |
+----+-------------------------------------------------------------+--------------------------+--+
```

### Components

| Region        | Detail                                                                                                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Toolbar       | New / Import / Search / Filter (status, customer, priority, family)                                                                                                                                               |
| Order list    | Columns: PO#, customer, family, qty, priority chip (P1/P2/P3/P-NPI/★HOT), M1 date with slip indicator                                                                                                             |
| Detail pane   | Selected PO: customer, product/spec, wafer-start date, lot/FOUP count, every commitment milestone with status, process-flow summary (link to full master process), actions: replan, edit, set hot lot, send to AI |
| Inline status | ★HOT chip for hot lots; `(NPI)` tag for new-product introductions; `plan` for forecasted POs                                                                                                                      |

### AI / data dependencies

- POs read from ERP (SAP / Oracle) via integration layer; cache + sync state
- Master process flow loaded from Process Engineering system
- Commitment milestones cross-referenced with current plan to compute status/slip

### Open questions

- Edit-in-place vs always-modal-edit?
- Should "Replan this PO" be local (only this PO) or full-plan? Likely local + a global option.
- How to surface NPI/tech-transition planning differently?

---

## 4. Shop Floor Capacity

**Purpose** — The capacity side of the plan. Inspect/edit tool-group, tool, and chamber capacity. See qualification matrix, PM calendar, and OEE history.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔] [👤] [⚙]            |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  Shop Floor Capacity                  [Tree ▾]  [Search 🔍]  [PM cal] [Export]      |    |
| 📈 +----------------------------+--------------------------------------------------------+    |
| 📦 |  Tool Group Tree           |  TOOL GROUP — HARC Etch                                |    |
| 🏭◀|  ▼ FEOL                    |  ┌───────────────────────────────────────────────────┐|    |
| 🔧 |   ▸ ONON CVD     ▮▮▮▮▯ 71% |  │ Effective WSPM   24,300   (theor. 32,400)         ││   |
| ⚙️ |   ▸ ArFi Litho   ▮▮▮▯▯ 64% |  │ OEE       82%    Avail 91% × Perf 95% × Qual 95%  ││   |
| 🔌 |   ▸ HARC Etch▶   ⚠⚠⚠⚠⚠ 89% │  │ Bottleneck role: Days 8–10 (this horizon)         │ │   |
|    |   ▸ CMP          ▮▮▮▮▯ 73% │  │ Qual matrix: 8/10 tools qualified for R-QLC-CH    │ │   |
|    |   ▸ Clean        ▮▮▮▯▯ 58% │  └───────────────────────────────────────────────────┘ │   |
|    |  ▼ BEOL                    │  Tools (10) — Chamber detail                            │   |
|    |   ▸ Metal CVD    ▮▮▮▮▯ 76% │  Tool ID   Chambers (A/B/C/D)  Quals      Last PM   Status│  |
|    |   ▸ Cu Plate     ▮▮▮▯▯ 62% │  ETC-41    ●●●●               R-1,2,3   04-28    Running│  |
|    |  ▼ Probe                   │  ETC-42    ●●●○ (C down)      R-1,2,3   04-22    Down C │  |
|    |   ▸ E-Test       ⚠▮▮▮▮ 85% │  ETC-43    ●●●●               R-1,2,3,4 04-30    Running│  |
|    |                            │  ETC-44    ●●○● (B drift)     R-1,2,4   05-12    SPC alm│  |
|    |                            │  ETC-45    ●●●●               R-2,3     05-08    Running│  |
|    |                            │  ETC-46    ●●●●               R-1,3,4   05-02    Running│  |
|    |                            │  ETC-47    ●●●●               R-2,3,4   04-25    Running│  |
|    |                            │  ETC-48    ●●●●               R-1,2,3,4 05-15    Running│  |
|    |                            │  ETC-49    ●●●●               R-1,2,3   05-09    Running│  |
|    |                            │  ETC-50    ●●●○ (qual exp.)   R-1,2     04-20    PM due │  |
|    |                            │                                                          │  |
|    |                            │  Qualification matrix (recipe × tool × chamber)         │   |
|    |                            │              Tool  41 42 43 44 45 46 47 48 49 50        │   |
|    |                            │  R-1 / QLC-CH      ✓  ✓  ✓  ✓     ✓     ✓  ✓           │   |
|    |                            │  R-2 / TLC-CH      ✓  ✓  ✓  ✓  ✓  ✓  ✓  ✓  ✓  ✓        │   |
|    |                            │  R-3 / TLC-SL      ✓  ✓  ✓     ✓  ✓  ✓  ✓  ✓           │   |
|    |                            │  R-4 / QLC-SL            ✓        ✓  ✓  ✓              │   |
|    |                            │                                                          │   |
|    |                            │  [PM calendar] [SPC trends] [Tune capacity →]            │   |
+----+----------------------------+----------------------------------------------------------+--+
```

### Components

| Region               | Detail                                                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tool-group tree      | Module → tool group, with current utilization band. Click any group to load detail on the right.                                                    |
| Detail header        | Effective WSPM, theoretical, OEE breakdown (Availability × Performance × Quality), bottleneck role this horizon, qual coverage summary              |
| Tools table          | Per tool: chambers (●=up, ○=down/drifting), qualified recipes, last PM, current status (Running, Down, SPC alarm, PM due)                           |
| Qualification matrix | Recipe × Tool grid (✓ = qualified). Empty cell = not qualified — this lot cannot run there. Click cell to see qual expiry date and re-qual history. |
| Action buttons       | PM calendar, SPC trends, "Tune capacity" → opens Capacity Tuning view scoped to this group                                                          |

### AI / data dependencies

- MES feed: tool state (Running/Down/PM/Engineering)
- APC/SPC feed: chamber drift flags
- Qual database: recipe-tool-chamber qualification status with expiry dates
- OEE calculator (SEMI E79 definition)

### Open questions

- Chamber detail at this level vs lazy-load? Cluster tools can have 6+ chambers.
- Editing capacity: planner can adjust, or only Equipment Engineer can? Likely planner can simulate; only EE can commit a structural change.

---

## 5. Process Tuning Logic

**Purpose** — Reviews and acts on AI-detected process-time tunes. When SPC data shows a tool group consistently running faster/slower than spec, the system proposes a tune. Sarah reviews evidence, accepts/rejects, and sends evidence to Process Engineering.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔ⓘ7] [👤] [⚙]          |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  Process Tuning Logic              [Pending 7] [Accepted 12] [Sent to PE 9]         |    |
| 📈 +----------------------------+--------------------------------------------------------+    |
| 📦 |  Pending tune suggestions  | TUNE SG-014 — HARC Etch / Recipe R-QLC-CH              |    |
| 🏭 |  ▸ SG-014  HARC R-QLC-CH ▶ | ┌──────────────────────────────────────────────────────┐|    |
| 🔧◀|     Δ −8.2% (faster)       | │ Spec process time   34 min/chamber                   ││   |
| ⚙️ |     Confidence 96%         | │ Actual median        31.2 min  (last 90 days, n=412)││   |
| 🔌 |  ▸ SG-015  ONON CVD R-N1   | │ Suggested tune      −8.2% → 31.2 min                ││   |
|    |     Δ +5.1% (slower)       | │ Confidence          96%  (well outside 3σ control)  ││   |
|    |     Confidence 81%         | └──────────────────────────────────────────────────────┘│   |
|    |  ▸ SG-016  CMP R-CMP-3     │                                                          │   |
|    |     Δ −3.4% (faster)       │  SPC RUN CHART — last 90 days                            │   |
|    |     Confidence 74%         │                                                          │   |
|    |  ▸ SG-017  Probe T-1       │   40 ┤                                                   │   |
|    |     Δ +2.8% (slower)       │      │     ╴UCL                                          │   |
|    |     Confidence 68%         │   34 ┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ spec          │   |
|    |  ▸ SG-018  Litho L-2       │      │       •        •  •      •  •  •                  │   |
|    |     Δ −4.6% (faster)       │   31 ┤   •  ── ── ── ── ── ── ── ── ── ── ── ── median   │   |
|    |     Confidence 89%         │      │ •         •          •                            │   |
|    |  ▸ SG-019  Anneal A-2      │   28 ┤     ╴LCL                                          │   |
|    |     Δ −6.1% (faster)       │      └──────────────────────────────────────────         │   |
|    |     Confidence 92%         │       Mar               Apr             May              │   |
|    |  ▸ SG-020  Clean Wet-3     │                                                          │   |
|    |     Δ +3.9% (slower)       │  Schedule impact if accepted                              │   |
|    |     Confidence 71%         │   • 412 lots affected, avg cycle time −1.3 hr per pass   │   |
|    |                            │   • Frees ~520 wafer-passes/wk on HARC capacity          │   |
|    |                            │   • Improves Cust B M1 commit by ~12 hr (P50)            │   |
|    |                            │                                                          │   |
|    |                            │ [Accept tune] [Reject] [Send evidence to Process Eng ▶] │   |
|    |                            │                                                          │   |
|    |                            │ History: SG-014 raised by AI 2026-05-23 09:14            │   |
+----+----------------------------+----------------------------------------------------------+--+
```

### Components

| Region          | Detail                                                                                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status tabs     | Pending / Accepted / Sent to PE (workflow stages)                                                                                                        |
| Suggestion list | Compact summary: ID, tool group + recipe, delta (signed %), confidence                                                                                   |
| Detail view     | Spec vs actual, suggested new value, confidence, SPC run chart with control limits, schedule impact (lots affected, capacity freed, commit improvements) |
| Actions         | Accept (use in this plan) · Reject · Send evidence to PE (workflow: triggers PE review task with attached SPC data)                                      |
| History         | Audit trail: who raised, when, what evidence package                                                                                                     |

### AI / data dependencies

- SPC stream per tool group / recipe (from APC / FDC layer)
- Statistical test: out-of-control rules (Western Electric / Nelson rules), confidence band
- Schedule-impact simulator: incremental what-if on cycle time
- Workflow integration to PE system (email or REST hook)

### Open questions

- Auto-accept threshold? E.g. ≥98% confidence + |Δ|<5% could auto-apply (with audit), saving planner time
- How does a rejected suggestion get re-raised? After more data? After threshold?
- Cross-team review SLA before a tune becomes the new spec?

---

## 6. Capacity Tuning Logic

**Purpose** — Same workflow pattern as Process Tuning, but for **effective capacity** of tool groups. When actual throughput consistently exceeds (or falls below) modeled effective capacity, AI proposes a capacity tune. Evidence sent to Equipment Engineering.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔ⓘ4] [👤] [⚙]          |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  Capacity Tuning Logic              [Pending 4] [Accepted 6] [Sent to EE 3]         |    |
| 📈 +----------------------------+--------------------------------------------------------+    |
| 📦 |  Pending capacity tunes    | TUNE CG-005 — HARC Etch                                |    |
| 🏭 |  ▸ CG-005  HARC Etch    ▶  | ┌──────────────────────────────────────────────────────┐|    |
| 🔧 |     Δ +4.5% capacity       | │ Modeled effective capacity   24,300 WSPM            ││   |
| ⚙️◀|     Confidence 91%         | │ Realized (last 12 wk avg)    25,400 WSPM (+4.5%)    ││   |
| 🔌 |  ▸ CG-006  ONON CVD        | │ Suggested tune              25,400 WSPM            ││   |
|    |     Δ −2.1% capacity       | │ Driver hypothesis           OEE improvement on      ││   |
|    |     Confidence 77%         | │                             ETC-43 / ETC-48 (+3 pp Avail) ││  |
|    |  ▸ CG-007  Probe E-Test    | └──────────────────────────────────────────────────────┘│   |
|    |     Δ +6.8% capacity       │                                                          │   |
|    |     Confidence 88%         │  REALIZED WSPM — last 12 weeks                           │   |
|    |  ▸ CG-008  Clean Wet-3     │                                                          │   |
|    |     Δ +1.8% capacity       │  26000┤                              •  •     •  •     │   |
|    |     Confidence 69%         │  25400┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ realized   │   |
|    |                            │  24300┤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ modeled    │   |
|    |                            │  23000┤   •                                              │   |
|    |                            │       └──────────────────────────────────────────        │   |
|    |                            │        wk1  wk3  wk5  wk7  wk9   wk11                    │   |
|    |                            │                                                          │   |
|    |                            │  Schedule impact if accepted                              │   |
|    |                            │   • Allows 4 more lots/wk on HARC                        │   |
|    |                            │   • Removes Cust C M1 slip (06-01 +4d → on time)         │   |
|    |                            │   • Bottleneck role unchanged                            │   |
|    |                            │                                                          │   |
|    |                            │ [Accept tune] [Reject] [Send evidence to Equip Eng ▶]   │   |
+----+----------------------------+----------------------------------------------------------+--+
```

### Components

| Region            | Detail                                                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tabs              | Pending / Accepted / Sent to EE                                                                                                                                          |
| Suggestion list   | Per tool group: Δ% capacity, confidence                                                                                                                                  |
| Detail view       | Modeled vs realized capacity, suggested new value, driver hypothesis (which factor changed: OEE? availability? performance?), realized WSPM trend chart, schedule impact |
| Actions           | Accept · Reject · Send to EE                                                                                                                                             |
| Driver hypothesis | AI-attributed cause (OEE up/down, specific tool contribution, recipe-mix shift). Helps EE diagnose.                                                                      |

### AI / data dependencies

- WSPM realized (from MES move history)
- OEE per tool history (SEMI E79)
- Attribution model: regress realized capacity on tool-level OEE components
- Schedule-impact simulator

### Open questions

- Capacity tunes are higher-stakes than process tunes (they reshape the whole plan). Should they require co-approval from EE before being usable, or be usable-as-simulation-only until EE approves?
- Cadence: monthly review vs continuous flow?

---

## 7. Data Integration

**Purpose** — Operational view of where the data comes from. Sarah, the data engineer, and IT use this to confirm sync health, see latency, and remap fields when a source schema changes.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔] [👤] [⚙]            |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  Data Integration                                  [Sync now] [+ Add source]        |    |
| 📈 +----------------------------------------------------------------------------------+    |    |
| 📦 |  CONNECTED SOURCES                                                                |    |    |
| 🏭 |  Source              Type            Last sync         Status        Latency     |    |    |
| 🔧 |  SAP S/4 PP/APO      ERP             2026-05-25 06:01  ● Healthy     1.4s        |    |    |
| ⚙️ |  Camstar MES         MES             2026-05-25 06:01  ● Healthy     2.0s        |    |    |
| 🔌◀|  Applied SmartFact.  Dispatching/RTD 2026-05-25 06:00  ● Healthy     0.8s        |    |    |
|    |  E3 APC / SPC        Process control 2026-05-25 06:01  ● Healthy     1.2s        |    |    |
|    |  KLA Yield Mgmt      Probe yield     2026-05-25 05:45  ⚠ Delayed     16 min ▲    |    |    |
|    |  PM Calendar (XLSX)  Equip eng       2026-05-22 09:00  ⚠ Stale        3 days     |    |    |
|    |  Demand Plan         Internal        2026-05-25 04:00  ● Healthy     2 hr        |    |    |
|    |  Customer Portal     CRM             —                  — Not config —             |    |    |
|    +----------------------------------------------------------------------------------+    |    |
|    |  SOURCE DETAIL — SAP S/4 PP/APO                                                  |    |    |
|    |  Connector         SAP RFC + custom IDoc                                         |    |    |
|    |  Sync cadence      Real-time (event) + 5-min reconciliation                      |    |    |
|    |  Schema version    v2.3 — last validated 2026-05-20                              |    |    |
|    |  Field mapping     PRD_ORD.PO_NO → ProductionOrder.id                            |    |    |
|    |                    PRD_ORD.PROD_FAM → ProductionOrder.family                    |    |    |
|    |                    … 87 more mappings  [View all]                                |    |    |
|    |  Recent issues     None                                                          |    |    |
|    |  [Test connection]  [Re-sync]  [Edit mapping]  [View logs]                       |    |    |
|    +----------------------------------------------------------------------------------+    |    |
|    |  DATA HEALTH AT A GLANCE                                                          |    |    |
|    |  POs synced today        342 (✓)    Lots tracked   8,420 (✓)                     |    |    |
|    |  Tool states fresh        ✓ <1 min  Probe yield     ⚠ 16-min lag                 |    |    |
|    |  Qual matrix age          14 d      PM calendar     ⚠ 3-day stale                |    |    |
+----+--------------------------------------------------------------------------------------+----+
```

### Components

| Region         | Detail                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Sources list   | One row per integration: name, type, last sync, status pill (Healthy / Delayed / Stale / Down), latency                          |
| Detail         | Selected source: connector type, sync cadence, schema version, field mappings (collapsible), recent issues, action buttons       |
| Health summary | At-a-glance counts and freshness across critical data dimensions (POs, lots, tool states, probe yield, qual matrix, PM calendar) |

### AI / data dependencies

- Connector framework (SAP RFC, REST, file polling)
- Schema-validation layer (alert on schema drift)
- Health monitor (latency, error rate, sync gaps)

### Open questions

- Self-service mapping editor for non-engineer planners, or admin-only?
- Failure-mode UX: when a source is down, what happens to the plan? Stale-banner everywhere? Lock replanning? Best-effort?

---

_End of main views. Right-panel modes documented in [02-right-panels.md](02-right-panels.md)._
