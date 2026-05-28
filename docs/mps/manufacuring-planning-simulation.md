# Manufacturing Planning Simulation (MPS)

A workspace for the **Senior Production Planner** of a NAND flash memory wafer fab to build, adjust, validate, and commit the Master Production Schedule across customer commitments, tool capacity, process routings, and shop-floor state — without leaving the page.

---

## 1. Summary

### Problem

Senior production planners (e.g. Sarah) own the master production schedule for a multi-bay, mixed-tech NAND fab. Today the job is done across half a dozen disconnected systems:

- A spreadsheet for customer commitments (POs).
- A Gantt-style tool that doesn't know about routings.
- An OEE dashboard that doesn't know about commitments.
- A separate routing/recipe document for each technology.
- Email threads for hot-lot escalations and cross-shift handoffs.

A single what-if (e.g. _"can we accept this new 232L QLC order without breaking on HARC Etch?"_) costs the planner an hour of switching tabs and mental aggregation. Mistakes carry six- to seven-figure downstream costs (a missed shipment, an unnecessary capacity expansion, a customer slip).

### Solution

A single workspace, **MPS**, that unifies all the views the planner needs to make and commit a schedule, with one shared adjustment model so what-if scenarios reflect everywhere instantly.

The planner can:

- See the schedule on a Gantt timeline (`Gantt`)
- See the capacity / yield / milestone risk that schedule implies (`Analysis`)
- See the customer commitments driving it (`Production Order`)
- See the process routing for each technology (`Production Processes`)
- See the shop-floor state of each tool group (`Shop Floor`)
- Adjust which orders are included via a shared `Adjustment` sidebar
- Compare scenarios, get AI suggestions, leave notes for the next shift
- Save with pre-flight validation; save as a new scenario; submit to baseline

---

## 2. Background

### 2.1 Main user pains today

| Pain                               | Symptom                                                           | Cost                                                                  |
| ---------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| Spreadsheet-driven scheduling      | One file per planner, error-prone, no audit trail                 | Lost edits, conflicting sources of truth                              |
| No what-if support                 | Testing a scenario means manual copies                            | What-ifs rarely get tested → planner under-shoots commitment headroom |
| No cross-domain view               | Commitment ↔ capacity ↔ schedule ↔ routing all in different tools | Hour-long context switches; bottleneck blindness                      |
| Customer escalations               | Hot lots arrive by email, no visual signal                        | Hot lot displaces other work without the planner seeing the cascade   |
| Yield / move / wait time invisible | Spreadsheets only show cycle                                      | Planner over- or under-estimates real wafer flow time by 30%+         |
| Save flow has no validation        | Commits go out with broken constraints                            | Field surprises, schedule churn                                       |

### 2.2 Main user gains after MPS

- **One workspace, one source of truth.** Same `Plan A (Simulation)` across all panels; the top-bar `N unsaved` chip shows aggregate dirty state.
- **Shared adjustment model.** Unchecking a PO in the Adjustment sidebar instantly re-derives capacity bars, milestone risk, family/tech rollups, the Gantt — across every panel.
- **Per-tech bottleneck identification.** The Process panel shows the bottleneck step + tool group per technology routing; the Analysis routing matrix shows cross-tech contention.
- **Per-PO notes + activity log.** Notes survive cross-shift handoff; pre-flight check + scenario branching support safer commits.
- **AI assist (sub-panel)** for "what if?" suggestions and quick-win recommendations.

### 2.3 Decision & information gap

The Master Production Schedule is _the_ commit-level decision the planner makes weekly. The decision requires four kinds of information simultaneously:

1. **Demand**: customer POs and their commit dates, priorities, milestones.
2. **Supply**: per-tool-group capacity over the horizon, including PM / qual-expiry / downtime constraints.
3. **Routing**: which tools/recipes/cycle/yield each technology consumes.
4. **State**: current WIP, in-flight batches, real-time tool status.

Today these live in four different systems. The planner has to mentally aggregate them every time. **MPS closes the gap by binding all four into one workspace with shared filters and a shared edit history** — when the planner asks "can I take this order?", every relevant view answers in the same instant.

### 2.4 Domain knowledge

#### NAND flash memory & wafer production

**NAND flash** stores data as electrical charge in floating-gate or charge-trap transistors arranged in a NAND-gate-style series chain.

- **Bit density**: TLC = 3 bits/cell (8 voltage levels); QLC = 4 bits/cell (16 levels). Denser → more bits/wafer but lower endurance and slower sort.
- **3D NAND layer count**: 128L / 176L / 232L / 300L+. Higher = denser per wafer but exponentially harder to manufacture (the HARC Etch step has to drill straight channels through the entire stack).

**Wafer production stages** (mirrors the data model in this app):

| Stage                        | What it does                                                                                                                                                                       | Typical bottleneck                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **FEOL** — Front-End Of Line | Build transistor structures: FEOL Deposit, ONON Stack (alternating oxide/nitride layers — one pair per memory layer), HARC Etch (high-aspect-ratio channel etch through the stack) | **HARC Etch** — almost always the structural bottleneck on dense 3D NAND |
| **MOL** — Middle Of Line     | WL Tungsten Fill (replace nitride with tungsten to form word lines), CMP (chemical-mechanical planarization)                                                                       | Rarely the bottleneck on its own                                         |
| **BEOL** — Back-End Of Line  | Multi-layer metal interconnect, vias to bond pads                                                                                                                                  | Capacity-bound at high mix                                               |
| **Test**                     | Wafer Probe — electrical sort of every die while still on the wafer; QLC sort is slow because of the 1024 Vt-level granularity                                                     | Qual-gated on each new product                                           |
| **Assembly**                 | Dice, bond dies to package, encapsulate, final test, ship                                                                                                                          | Cross-bay move dominates                                                 |

End-to-end real cycle is **3–4 months** from bare wafer to shipped part. The mock data compresses this into hours but preserves the relative cost ratios — FEOL dominates cycle, HARC dominates queue.

#### Shop floor workflow

- **Cleanroom**: Class 1 / Class 10 (≤100 particles/m³ at 0.5μm). Bunny suits. Tools never see ambient air.
- **Tool groups (bays)**: process equipment grouped by function — Etch bay, Litho bay, CMP bay, etc. Each bay holds multiple identical-ish tools. The app models this as `TOOL_GROUP_CAPACITIES.{name, total, used}` where `total` is daily passes and `used` is current consumed capacity.
- **Material transport**: wafers travel in sealed **FOUPs** (Front-Opening Unified Pods — 25 wafers each) on the **AMHS** (Automated Material Handling System — overhead monorail + stockers). That's why move time between stages is multi-hour even though the building isn't large: AMHS scheduling + stocker queueing + bay handoffs all add up.
- **Recipes & qualification**: each tool runs a recipe (gas flows, RF power, temperature, time) keyed to (process step × technology). Before a tool can run a recipe in production it must be **qualified** (run monitor wafers, prove the tool meets spec). Quals **expire**; qual scarcity is one of the biggest hidden constraints — your HARC capacity isn't "total HARC tools", it's "HARC tools currently qualified for this recipe".
- **Three time buckets** (every step has all three):
  - **Cycle**: time on the tool doing actual work. Fixed by physics.
  - **Move**: AMHS transit to the next tool. Tunable via layout + AMHS scheduling.
  - **Wait**: queue at the next tool (busy, qual expired, batching threshold, etc.). Tunable via dispatch policy — **this is where most of the scheduling lift is**.
- **Three scheduling layers**:
  1. **Master Production Schedule** — multi-week to multi-month allocation. **This app.**
  2. **Shift dispatch** — pick the next lot for each tool given current state. MES + planner override.
  3. **Real-time exceptions** — PM, downtime, recipe failure, quality holds. Cascade back into the schedule as new constraints.

---

## 3. Solution

### 3.1 Primary use cases

1. **Build / adjust the master schedule** for the next 1–3 months.
2. **Investigate a customer escalation** — see impact across views (commit date, capacity, routing).
3. **What-if** — drop a low-priority PO, see if the HARC bottleneck eases.
4. **Validate before commit** — pre-flight runs, then save / save-as-scenario / submit to baseline.
5. **Compare scenarios** side-by-side (Compare sub-panel).
6. **Cross-shift handoff** via per-PO / per-Family / per-Batch notes.
7. **AI assist** for "what if?" suggestions (AI Chat sub-panel).

### 3.2 Usage flow (primary path)

```
1. Sarah opens MPS                                    → lands on Gantt (her default)
2. Inspects the timeline                              → spots a milestone slip on PO-2025-119
3. Switches to Analysis                               → confirms HARC Etch is over capacity in week 2
4. Opens Production Order panel                       → drills into PO-2025-119, reads the per-PO note
5. Opens Production Processes                         → confirms V9-TLC-B technology routes through HARC
6. Toggles a low-priority PO off in Adjustment        → every panel re-derives; HARC moves back into safe
7. Saves                                              → pre-flight runs validation
   ├─ All-clear → Save draft (or Submit to baseline)
   └─ Issues   → review highlighted constraints, fix, re-save
8. Adds a Note on PO-2025-119                         → next shift sees the context tomorrow
9. Logs out                                           → state persists (localStorage); top-bar chip "0 unsaved"
```

### 3.3 Workspace layout

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Avatar] M-SOC ▾  [Plan A (Simulation) ▾]  DRAFT  • N unsaved      [User] │  ← Top bar (scenario + dirty chip)
├────┬─────────────────────────────────────────────────────────────────────────┤
│ G  │  [Panel header: title + toolbar + close]                                 │
│ A  │ ┌─────────────────────────────────────────────────────────────────────┐ │
│ PO │ │  [Persistent left sidebar — view-specific (Adjustment / Tech list)] │ │
│ PP │ │ ┌───────────────────────────────────────────────────────────────────┐│ │
│ SF │ │ │  [Main content — Gantt grid / Analysis sections / PO table / …]  ││ │
│ PT │ │ │                                                                   ││ │
│ CT │ │ │  [Bottom dock — info panel (Summary or row detail)]              ││ │
│ DI │ │ └───────────────────────────────────────────────────────────────────┘│ │
│    │ └─────────────────────────────────────────────────────────────────────┘ │
├────┴─────────────────────────────────────────────────────────────────────────┤
│  [Bottom — Compare / AI Assistant / Background / History / Recommendations]  │  ← Sub-panel dock (optional)
└──────────────────────────────────────────────────────────────────────────────┘
```

The left rail (`G A PO PP SF PT CT DI`) switches the main panel between **Gantt**, **Analysis**, **Production Order**, **Production Processes**, **Shop Floor**, **Process Tuning**, **Capacity Tuning**, **Data Integration**.

### 3.4 Main panels — function reference

#### Gantt

- Tool-group rows × time. Bars = batches. Colors encode schedule lineage (Fixed / Changes / New).
- Right toolbar: Undo / Redo / Reset / Save split-button (Save / Save as new scenario / Submit to baseline).
- Adjustment sidebar (shared) on the left.
- Quick-analysis dock at the bottom (capacity strip).

#### Analysis (read-only summary view)

- Sections: Shop floor capacity (area chart) · Tool-group capacity (bars) · Workload heatmap (tool × time) · Shipment milestone analysis · Production Family · Spec/Tech analysis · Routing matrix (tech × tool group).
- Each section's header is sticky as the planner scrolls.

#### Production Order

- Filter-style adjustment sidebar (shared).
- 14-column table — Selection · PO/Family/Batch tree (sticky) · State (Fixed/Changes/New/Exclude, sticky) · Customer · Tech/Spec · Commitment · Start/End · Milestones · Status · Progress · Started/Processing/Completed Wafers · Remark.
- Per-row tune popover (mdiTune in col 1 header): show/hide, reorder, sticky, sort, filter per column.
- Bottom info panel: **Summary** (4 KPI cards) when no row is selected; **Detail card** (Title bar in panel header with Code · Customer · Priority · State chips + Exclude action · Split/Remove on batch · Meta Info · Children list · Notes list) when a row is selected.

#### Production Processes (read-only routing reference)

- Left sidebar: **Technology routings** list (persistent — selecting a tech drives the main).
- Main panel, vertically stacked, with sticky section headers + edge-to-edge layout:
  1. **Summary KPI strip** — End-to-end clock · Stages × steps · Move + Wait · End-to-end yield.
  2. **Overall pipeline · stage to stage** — stage cards with proportion bars (process / move / wait split) + inter-stage transition chips + per-stage rollup table.
  3. **FEOL · step by step** — flow diagram of step tiles + per-step detail table.
  4. **MOL · step by step** — same shape.
  5. **BEOL · step by step**.
  6. **Test · step by step**.
  7. **Assembly · step by step**.
- Each step tile is clickable → opens its tool group in Shop Floor.

#### Shop Floor (per-tool-group operational view)

- (Out of scope for current iteration's redesign.) Tree of tool groups with OEE breakdown, downtime, qual state, in-flight WIP.

### 3.5 Shared system features

- **Adjustment sidebar** (Gantt + Analysis + Production Order + Process): one shared check-tree backed by `gantt.checkedKeys`. Uncheck a PO/Family/Batch anywhere → every view re-derives. Pending/Apply flow on the sidebar; one-shot include/exclude from the Order info panel.
- **Top-bar chips**:
  - `M-SOC` — production line (modal selector).
  - `Plan A (Simulation)` — scenario / plan selector (modal selector).
  - `DRAFT` — status pill.
  - `• N unsaved` — aggregate dirty count across Gantt + Production Order edits. Click any panel's Save to commit.
- **Save flow** (shared component `SimulationScheduleActions`):
  - **Save** → pre-flight validation modal → commit.
  - **Save draft** → same path.
  - **Save as new scenario…** → opens the plan modal to spawn a fresh scenario.
  - **Submit to baseline** → enabled only when there are unsaved edits.
- **Per-entity notes** (PO / Family / Batch): list of timestamped notes, add inline, delete inline. Persisted to localStorage. Surfaces in the info panel's Notes section.
- **Sticky section headers + edge-to-edge layout** (shared between Analysis and Process scroll containers): sections stack flush; each section's header pins to the top of the scroll context as the planner scrolls through it.

### 3.6 Data model (conceptual)

```
ProductionLine
  └── SimulationPlan ( = scenario, e.g. "Plan A")
       └── ProductionOrder       (customer commitment — id, customer, priority, qty, milestones)
            └── ProductionFamily ( = tech, e.g. V9-QLC-A on T-V9-232L)
                 └── ManufacturingBatch (physical lot — waferCount, start/end, scheduleClass)

TechRouting (per tech)
  └── ProcessStep[]              (stage, toolGroup, recipe, qualRequired, cycleHours, movementHours, waitHours, expectedYield)

ToolGroup (per bay)
  └── { name, total, used }      (capacity in wafer-passes/day equivalent)

ToolingConstraint                ( pm | qual-expiry | downtime | ramp-up | recipe-lock )
```

Three orthogonal concept layers:

| Layer       | Owns                                    | Drives                              |
| ----------- | --------------------------------------- | ----------------------------------- |
| **Demand**  | ProductionOrder → Family → Batch        | Gantt bars, PO table, milestones    |
| **Routing** | TechRouting → ProcessStep               | Process panel, capacity demand calc |
| **Supply**  | ToolGroup capacity + ToolingConstraints | Analysis bars, Shop Floor view      |

The Master Production Schedule is the **assignment** of Demand against Supply respecting Routing. MPS makes that assignment visible, editable, and committable.

---

## 4. Design principles (cross-panel)

1. **One adjustment model, many derived views.** Every "what does my schedule actually look like?" question reads from `gantt.checkedKeys` + the active Plan. Never duplicate edit state.
2. **Progressive disclosure.** Summary KPIs → category overview → row detail. The planner can stop at the layer that answers their question.
3. **Sticky section headers in long scrolls.** The planner always knows where they are.
4. **Consistent chrome across panels.** Same Stone-100 box headers, gray-200 / gray-300 dividers, Indigo 50 selection, Amber 50 hover, Teal 100 selected-hover. Same persistent left sidebar shape. Same right-side action group (Undo / Redo / Reset / Save split).
5. **Reserved color semantics.** Indigo = primary brand · Teal = secondary · Deep Purple = primary-action hover · Amber = hover / warning · Red = violation · Stone = neutral chrome.
6. **Reach-into-other-views via shared state.** Clicking a step tile in Process opens the tool group in Shop Floor. Selecting a row in PO opens its detail in the dock. Excluding a PO from the info panel flips its State chip in the table AND its bar in the Gantt.
7. **Concept-first, BE-later.** Mock data is structured to match what the BE will return; UI talks to MobX stores, not the network, so the wiring stays clean when the BE lands.

---

## 5. Open questions / not yet covered

- **Shop Floor panel** redesign — pending.
- **Compare panel** — currently a sub-panel with side-by-side plan selectors; needs deeper KPI diff treatment.
- **AI Chat** — mocked; needs real prompt design for "suggest a scenario that ships PO-X without breaking HARC".
- **Recommendations panel** — placeholder.
- **Real-time WIP** — currently mocked from `outWafers + scheduleClass`. Wire to MES stream when available.
- **Per-tool (not per-tool-group) modelling** — qual state per (tool, recipe), not per group.
- **Batching constraints** — some tools want a full FOUP before starting; not yet modelled.
