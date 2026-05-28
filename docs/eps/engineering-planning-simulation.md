# Engineering Planning Simulation (EPS)

> Internal codename: **IRIS — Intelligent Resources Information System**. Customer: **Samsung Electronics — Device Solution Research (DSR)**. Primary persona: **Jisoo Park** (Senior Resource Planner, Memory BU, Hwaseong).

A workspace for the **Senior Resource Planner** (Jisoo Park archetype) of Samsung DSR to build, adjust, validate, and commit the engineering resource plan for new electronic products across product requirements (from N-PLM), engineering processes (Block → Stage → Function → Action), organisation skill groups (Division → Site → Team → Group, from SMDM), and the engineer head-count portfolio (from GHRP / PROMIS) — without leaving the page.

---

## 1. Summary

### Problem

R&D planning leads at Samsung DSR own the master plan for research, design and engineering of new electronic products (SoC, sensor, memory, display IC, foundry process). Today the job is done across half a dozen disconnected systems:

- A spreadsheet of product requirements forwarded from the marketing team (new product ideas + flagship enhancements).
- A separate roadmap tool that doesn't know about engineer skills or head-count caps.
- An HR / organisation tool (SMDM, GHRP) for the Division → Site → Team → Group hierarchy and skill groups.
- A PLM tool (N-PLM) for product specs and prior generations.
- A profit / capacity tool (PROMIS) for the head-count portfolio and cost loading.
- Email threads for escalations and weekly status with the engineering directors.

A single what-if (e.g. _"can we pull the 232L QLC silicon validation in by six weeks without breaking the DRAM Design group?"_) costs the planner half a day of cross-tab aggregation. Mistakes carry six- to seven-figure downstream costs (a missed tape-out, an over-hired group, a slipped flagship launch).

### Solution

A single workspace, **EPS**, that unifies all the views the R&D planning lead needs to build, validate and commit an engineering plan, with one shared adjustment model so what-if scenarios reflect everywhere instantly.

The planner can:

- See the engineering schedule on a Gantt timeline (`R&D Simulation`)
- See the head-count load / milestone risk / portfolio fit that schedule implies (`Plan Analysis`)
- See the product requirements driving it (`Product Requirements`)
- See the engineering process for each product family (`Engineering Processes`)
- See the headcount portfolio per organisation node + skill group (`Headcount Capacity`)
- Adjust which requirements are included via a shared `Adjustment` sidebar
- Compare scenarios, get AI suggestions, leave notes for the next planning cycle
- Save with pre-flight validation; save as a new scenario; submit to baseline
- Tune the engineering process or the headcount portfolio via the `Process Tuning` / `Headcount Tuning` panels
- Sync upstream from N-PLM (requirements / specs) and SMDM (organisation / skills) via the `Integration` panel

---

## 2. Background

### 2.1 Main user pains today

| Pain                           | Symptom                                                                 | Cost                                                            |
| ------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------- |
| Spreadsheet-driven roadmap     | One file per planner, error-prone, no audit trail                       | Lost edits, conflicting sources of truth                        |
| No what-if support             | Testing a scenario means manual copies of the whole plan                | What-ifs rarely get tested → planner under-shoots headroom      |
| No cross-domain view           | Requirement ↔ skill ↔ schedule ↔ process all in different tools         | Half-day context switches; bottleneck blindness on design teams |
| Skills + headcount opacity     | SMDM/GHRP shows numbers but not load                                    | Over-/under-hired groups; chronic over-time on hot skills       |
| Engineering process spread out | Block → Stage → Function → Action lives in a different document per fam | Hard to compare cycle time across families                      |
| Save flow has no validation    | Plans go to directors with broken portfolio constraints                 | Director surprises, weekly plan churn                           |

### 2.2 Main user gains after EPS

- **One workspace, one source of truth.** Same `Roadmap V6 (Approved)` across all panels; the top-bar `N unsaved` chip shows aggregate dirty state. The `IRIS · EPS` badge + active-editor avatar pile remind the planner whose work is mid-flight.
- **Real-time concurrent editing** (IRIS Concept A). Avatar ring + cell border show co-editors live, eliminating Jisoo's three-hours-of-work-lost incident.
- **Resource roadmap with version history** (IRIS Concept D — Diff & Delta). Every change is versioned; the Compare sub-panel runs a side-by-side V6↔V5 (or any pair) diff with `green / amber / red` chrome.
- **Simulation sandbox** (IRIS Concept B). Sandbox variants (`S1-V2 · HBM4 Acceleration`, `S2-V1 · DDR5-Gen5 Pull-in`) stay isolated from approved data until promoted to a draft roadmap version.
- **Headcount portfolio across sites** (Hwaseong / Pyeongtaek / Austin / Xi'an). Surfaces cross-site over-allocation before the monthly reconciliation meeting.
- **Delta sync to PROMIS** — only changed allocations sync downstream; eliminates the artifact noise of full sync.
- **AI co-pilot (Samsung AI Services)** for "what if HBM4 +5 engineers" suggestions, plan generation from a requirement bundle, and over-allocation triage.

### 2.3 Decision & information gap

The Engineering Plan is _the_ commit-level decision the R&D planning lead makes each planning cycle (monthly P/M cycle at Samsung DSR). The decision requires four kinds of information simultaneously:

1. **Demand**: product requirements from marketing (new product, flagship enhancement) — with commit dates, priorities, milestones.
2. **Supply**: per-skill-group engineer head-count over the horizon, including hiring ramps and reserved buffer.
3. **Process**: which Block → Stage → Function → Action steps each product family consumes, and which skill group does each step.
4. **State**: current in-flight projects, hot fixes, escalations.

Today these live in four different systems (N-PLM, SMDM, GHRP, PROMIS + spreadsheets). The planner has to mentally aggregate them every time. **EPS closes the gap by binding all four into one workspace with shared filters and a shared edit history** — when the planner asks "can we take this requirement?", every relevant view answers in the same instant.

### 2.4 Domain knowledge

#### Samsung DSR — Device Solution Research

**Device Solution Research (DSR)** is the R&D arm of Samsung Electronics' Device Solution division. It covers the research, design and engineering of new electronic products across:

- **Mobile AP (Application Processor)** — flagship phone SoC family.
- **Image Sensor (CIS / Auto)** — CMOS image sensors for mobile and automotive.
- **Mobile DRAM / LPDDR** — low-power memory roadmap.
- **Display Driver IC (DDI / OLED)** — display interface ICs.
- **Foundry process nodes** — process IP feeding the above families.

Each family follows a **Block → Stage → Function → Action** decomposition:

| Layer        | Example (Mobile AP)                                    | Owner                                |
| ------------ | ------------------------------------------------------ | ------------------------------------ |
| **Block**    | "Architecture", "RTL", "Physical", "Validation"        | Block lead                           |
| **Stage**    | "Front-end design", "Back-end PnR", "Silicon bring-up" | Stage lead                           |
| **Function** | "Power delivery", "Memory subsystem", "CPU core"       | Skill-group lead                     |
| **Action**   | "Power grid analysis", "DDR PHY IP integration"        | Engineer (with a specific skill tag) |

Cycle time from concept to tape-out is **12–24 months** for a flagship SoC, **6–12 months** for a sensor or DDI, **18–36 months** for a new memory generation. The mock data compresses this into weeks but preserves the relative cost ratios — design and verification dominate cycle, silicon bring-up dominates risk.

#### Organisation & skill groups

- **Hierarchy**: Division → Site → Team → Group. A single product family typically draws from 4–8 groups across 2–3 sites (Korea HQ + India / Vietnam / US satellite labs).
- **Skill groups**: cross-cutting skill pools (e.g. "Analog IP", "DDR PHY", "RTL verification", "Place & Route", "Validation board bring-up"). One skill group serves multiple product families.
- **Head-count portfolio**: the monthly allocation of engineer-days by (skill group × product family × month). Coming from SMDM + GHRP.
- **Three time buckets** (every action has all three):
  - **Effort**: engineer-days of actual work. Fixed by complexity.
  - **Handoff**: queue time across the org boundary (design → verif, verif → physical, etc.). Tunable via dispatch policy — **this is where most of the planning lift is**.
  - **Wait**: blocked on a shared IP, blocked on a tape-out slot, blocked on a tool/license. Tunable via reservation.

#### Key integrations

| System                  | Provides                                          | Direction |
| ----------------------- | ------------------------------------------------- | --------- |
| **N-PLM**               | Product requirements, prior-gen specs, family map | Inbound   |
| **SMDM**                | Organisation hierarchy + skill groups             | Inbound   |
| **GHRP**                | Headcount snapshot + hiring plan                  | Inbound   |
| **PROMIS**              | Profit / cost model, committed portfolio          | Bi-dir    |
| **Samsung AI Services** | Demand forecast + recommendation                  | Inbound   |

---

## 3. Solution

### 3.1 Primary use cases

1. **Build / adjust the engineering plan** for the next 1–3 planning cycles.
2. **Investigate a director escalation** — see impact across views (commit date, head-count, process step).
3. **What-if** — drop a low-priority requirement, see if the DRAM Design bottleneck eases.
4. **Validate before commit** — pre-flight runs, then save / save-as-scenario / submit to baseline.
5. **Compare scenarios** side-by-side (Compare sub-panel).
6. **Cross-cycle handoff** via per-Requirement / per-Family / per-Block notes.
7. **AI assist** for "what if?" suggestions and AI-generated plans from a fresh requirement bundle.

### 3.2 Usage flow (primary path)

```
1. The planner opens EPS                              → lands on R&D Simulation
2. Inspects the timeline                              → spots a milestone slip on REQ-2026-119
3. Switches to Plan Analysis                          → confirms DRAM PHY group is over-allocated in week 8
4. Opens Product Requirements panel                   → drills into REQ-2026-119, reads the per-Req note
5. Opens Engineering Processes                        → confirms LPDDR6 family routes through DRAM PHY
6. Toggles a low-priority requirement off in Adjust   → every panel re-derives; DRAM PHY moves back into safe
7. Saves                                              → pre-flight runs validation
   ├─ All-clear → Save draft (or Submit to baseline)
   └─ Issues   → review highlighted constraints, fix, re-save
8. Adds a Note on REQ-2026-119                        → next cycle sees the context tomorrow
9. Logs out                                           → state persists (localStorage); top-bar chip "0 unsaved"
```

### 3.3 Workspace layout

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [Avatar] Hwaseong · Memory BU ▾  [Roadmap V6 (Approved) ▾]  APPROVED  IRIS·EPS  JP HC  • N unsaved [User]│  ← Top bar
├────┬───────────────────────────────────────────────────────────────────────────────────┤
│ G  │  [Panel header: title + toolbar + close]                                            │
│ A  │ ┌───────────────────────────────────────────────────────────────────────────────┐  │
│ PJ │ │  [Persistent left sidebar — view-specific (Adjustment / Project list)]        │  │
│ EP │ │ ┌─────────────────────────────────────────────────────────────────────────────┐│  │
│ HC │ │ │  [Main content — Gantt grid / Analysis sections / P/M table / …]            ││  │
│ PT │ │ │                                                                              ││  │
│ HT │ │ │  [Bottom dock — info panel (Summary or row detail)]                          ││  │
│ NI │ │ └─────────────────────────────────────────────────────────────────────────────┘│  │
│    │ └───────────────────────────────────────────────────────────────────────────────┘  │
├────┴───────────────────────────────────────────────────────────────────────────────────┤
│  [Bottom — Compare versions / AI co-pilot / Sync queue / Version history / Recs]       │  ← Sub-panel dock
└────────────────────────────────────────────────────────────────────────────────────────┘
```

The left rail (`G A PJ EP HC PT HT NI`) switches the main panel between **Resource Roadmap (Gantt)**, **HR Portfolio Analysis**, **Projects · P/M Planner**, **Engineering Process (Block / Stage)**, **Headcount Portfolio**, **Process Tuning**, **Headcount Tuning**, **N-PLM · SMDM · GHRP · PROMIS Integration**.

### 3.4 Main panels — function reference

#### R&D Simulation (Gantt)

- Skill-group / family rows × time. Bars = engineering actions. Colors encode schedule lineage (Fixed / Changes / New).
- Right toolbar: Undo / Redo / Reset / Save split-button (Save / Save as new scenario / Submit to baseline).
- Adjustment sidebar (shared) on the left.
- Quick-analysis dock at the bottom (head-count strip + violations chip).

#### Plan Analysis (read-only summary view)

- Sections: Site head-count load (area chart) · Skill-group load (bars) · Workload heatmap (skill × time) · Milestone analysis · Product Family · Function / Skill analysis · Routing matrix (family × skill group).
- Each section's header is sticky as the planner scrolls.

#### Product Requirements

- Filter-style adjustment sidebar (shared).
- Table with — Selection · Requirement / Family / Block tree (sticky) · State (Fixed/Changes/New/Exclude, sticky) · Sponsor (marketing / customer) · Family · Effort · Start/End · Milestones · Status · Progress · Engineering-days started/processing/completed · Remark.
- Per-row tune popover (show/hide, reorder, sticky, sort, filter per column).
- Bottom info panel: **Summary** (4 KPI cards) when no row is selected; **Detail card** with Code · Sponsor · Priority · State chips + Exclude action when a row is selected.

#### Engineering Processes (read-only routing reference)

- Left sidebar: **Family routings** list (persistent — selecting a family drives the main).
- Main panel, vertically stacked, with sticky section headers + edge-to-edge layout:
  1. **Summary KPI strip** — End-to-end clock · Blocks × stages · Handoff + Wait · End-to-end yield.
  2. **Overall pipeline · block to block** — block cards with proportion bars (effort / handoff / wait split) + inter-block transition chips + per-block rollup table.
  3. **Architecture · stage by stage** — flow diagram of stage tiles + per-stage detail table.
  4. **RTL · stage by stage** — same shape.
  5. **Physical · stage by stage**.
  6. **Verification · stage by stage**.
  7. **Silicon bring-up · stage by stage**.
- Each stage tile is clickable → opens its skill group in Headcount Capacity.

#### Headcount Capacity (per skill-group operational view)

- Tree of skill groups under Division → Site → Team → Group with utilization breakdown, hiring ramp, reserved buffer, in-flight projects.

### 3.5 Shared system features

- **Adjustment sidebar** (Simulation + Analysis + Requirements + Processes): one shared check-tree backed by `gantt.checkedKeys`. Uncheck a Requirement / Family / Block anywhere → every view re-derives. Pending/Apply flow on the sidebar; one-shot include/exclude from the Requirement info panel.
- **Top-bar chips**:
  - `Mobile AP` — product family (modal selector).
  - `Plan A (Baseline)` — scenario / plan selector (modal selector).
  - `DRAFT` — status pill.
  - `EPS` — workspace badge.
  - `• N unsaved` — aggregate dirty count across Simulation + Requirement edits. Click any panel's Save to commit.
- **Save flow** (shared component `SimulationScheduleActions`):
  - **Save** → pre-flight validation modal → commit.
  - **Save draft** → same path.
  - **Save as new scenario…** → opens the plan modal to spawn a fresh scenario.
  - **Submit to baseline** → enabled only when there are unsaved edits.
- **Per-entity notes** (Requirement / Family / Block): list of timestamped notes, add inline, delete inline. Persisted to localStorage. Surfaces in the info panel's Notes section.
- **Sticky section headers + edge-to-edge layout** (shared between Analysis and Process scroll containers).

### 3.6 Data model (conceptual)

```
ProductFamily
  └── EpsPlan ( = scenario, e.g. "Plan A (Baseline)" )
       └── ProductRequirement       (marketing request — id, sponsor, priority, effort, milestones)
            └── EngineeringFamily   ( = product variant on a family, e.g. AP-Flagship-2027 on Mobile AP)
                 └── EngineeringBatch (block-level work package — engineer-days, start/end, scheduleClass)

ProcessRouting (per family)
  └── ProcessStep[]                  (block, skillGroup, recipe, qualRequired, effortDays, handoffDays, waitDays, expectedYield)

SkillGroup (per organisation node)
  └── { name, total, used }          (head-count in engineer-days/cycle equivalent)

HeadcountConstraint                  ( hiring-ramp | reserved-buffer | shared-IP-lock | tape-out-slot | tooling )
```

Three orthogonal concept layers:

| Layer       | Owns                                         | Drives                                    |
| ----------- | -------------------------------------------- | ----------------------------------------- |
| **Demand**  | ProductRequirement → Family → Batch          | Gantt bars, Requirement table, milestones |
| **Routing** | ProcessRouting → ProcessStep                 | Engineering Processes panel, load calc    |
| **Supply**  | SkillGroup head-count + HeadcountConstraints | Analysis bars, Headcount Capacity view    |

The Engineering Plan is the **assignment** of Demand against Supply respecting the engineering process. EPS makes that assignment visible, editable, and committable.

---

## 4. Design principles (cross-panel)

1. **One adjustment model, many derived views.** Every "what does my plan actually look like?" question reads from `gantt.checkedKeys` + the active Plan. Never duplicate edit state.
2. **Progressive disclosure.** Summary KPIs → category overview → row detail. The planner can stop at the layer that answers their question.
3. **Sticky section headers in long scrolls.** The planner always knows where they are.
4. **Consistent chrome across panels.** Shared with MPS so a planner moving between workspaces (PPS → EPS → MPS) feels at home. Same Stone-100 box headers, Indigo 50 selection, Amber 50 hover.
5. **Reserved color semantics.** Indigo = primary brand · Teal = secondary · Deep Purple = primary-action hover · Amber = hover / warning · Red = violation · Stone = neutral chrome. The top-bar `EPS` chip uses `geekblue` to differentiate from MPS at a glance.
6. **Reach-into-other-views via shared state.** Clicking a stage tile in Engineering Processes opens the skill group in Headcount Capacity. Selecting a row in Requirements opens its detail in the dock. Excluding a requirement from the info panel flips its State chip in the table AND its bar in the Gantt.
7. **Concept-first, BE-later.** Mock data is structured to match what N-PLM / SMDM / GHRP will return; UI talks to MobX stores, not the network, so the wiring stays clean when the BE lands.

---

## 5. Open questions / not yet covered

- **AI plan generation** — given a requirement bundle + portfolio constraints, generate a Plan B candidate. UI hook exists in the AI Chat sub-panel; prompt design pending.
- **Headcount Capacity panel** — copied from MPS Shop Floor; needs DSR-specific OEE replaced with engineer utilization and hiring-ramp burn-down.
- **Compare panel** — currently a sub-panel with side-by-side plan selectors; needs deeper KPI diff treatment focused on portfolio fit and milestone delta.
- **AI Chat** — mocked; needs real prompt design for "suggest a scenario that ships REQ-X without overloading DRAM Design".
- **Recommendations panel** — placeholder.
- **Real-time effort tracking** — wire to GHRP / time-sheet feed when available.
- **Per-engineer (not per-skill-group) modelling** — qual state per (engineer, skill), not per group, for late-stage validation planning.
- **N-PLM / SMDM integration** — currently mocked in the Integration panel; needs real connectors and delta sync.
