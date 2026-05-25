# T15 — User Stories: Dynamic Schedule Epic

> **Task ID:** T15 (Dynamic Schedule epic; companion to [T15 — User Story Backlog (MVP)](T15-user-story-backlog.md))
> **Phase:** DESIGN — Week 7+
> **Status:** Draft v1 — for SWAT review and grooming
> **Date:** 2026-05-25
> **Owner:** CPO
> **Primary persona:** Sarah Chen — Senior Production Planner (NAND Flash fab)
> **Source artifacts:**
>
> - [T14 Concept — Dynamic Schedule](../ideation/T14-concept-dynamic-schedule.md)
> - [Wireframes — README](../prototype/dynamic-schedule/README.md) · [Main Views](../prototype/dynamic-schedule/01-main-views.md) · [Right Panels](../prototype/dynamic-schedule/02-right-panels.md) · [Screen Flow](../prototype/dynamic-schedule/03-screen-flow.md)
> - [Wafer + NAND research](../../08_RESEARCH/wafer-nand-manufacturing-for-mps.md)
> - [T10 Hypothesis Cards](../../01_DISCOVER/validation/T10-hypothesis-cards.md)

---

## Context

This document covers the **Dynamic Schedule epic** for aPlanner — the deepest single-feature backlog in the MVP. It complements (does not duplicate) the broader [T15-user-story-backlog.md](T15-user-story-backlog.md). Stories here use the **DS-NNN** prefix to avoid clashing with the existing US-NNN numbering.

The Dynamic Schedule epic addresses **PS-1** (manual production planning, 3–5 day cycle, plan obsolete by Wednesday) for **Sarah Chen** and the five feature pillars defined in [T14 §5](../ideation/T14-concept-dynamic-schedule.md#5-five-feature-pillars).

### Personas referenced

| Persona                     | Role                            | Stories                | Type      |
| --------------------------- | ------------------------------- | ---------------------- | --------- |
| **Sarah Chen**              | Senior Production Planner       | All DS-NNN             | PRIMARY   |
| **Jennifer Williams**       | Operations Manager              | DS-103, DS-201, DS-203 | SECONDARY |
| **Patricia Lim** (proposed) | Process Engineer (cross-team)   | DS-501, DS-502         | TERTIARY  |
| **Karl Schmidt** (proposed) | Equipment Engineer (cross-team) | DS-511, DS-512         | TERTIARY  |
| **BizDev account manager**  | (system actor)                  | DS-701                 | TERTIARY  |

### Hypothesis links

| Hypothesis                                                                       | Source                                                                                                            | Bound to stories               |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| H-04 — Data accessibility                                                        | [T10](../../01_DISCOVER/validation/T10-hypothesis-cards.md#h-04-manufacturing-data-accessibility-for-ai-training) | DS-001, DS-801–805             |
| H-05 — AI trust via explainability                                               | [T10](../../01_DISCOVER/validation/T10-hypothesis-cards.md#h-05-ai-trust-through-explainability)                  | DS-302, DS-401, DS-402, DS-403 |
| H-DS-1 (new) — Replan cycle < 4 hours                                            | T14 §13                                                                                                           | DS-001, DS-101, DS-602         |
| H-DS-2 (new) — Anchored replanning preserves floor stability                     | T14 §5 Pillar A                                                                                                   | DS-103, DS-104                 |
| H-DS-3 (new) — Conversational what-if reduces scenario time from 2 hrs to < 60 s | T14 §5 Pillar D                                                                                                   | DS-401, DS-402, DS-403         |
| H-DS-4 (new) — Tuning Logic captures planner tacit knowledge                     | T14 §5 Pillar E                                                                                                   | DS-501, DS-502, DS-511         |

### Story-point scale

Fibonacci. **1** = trivial · **2** = simple CRUD or single rule · **3** = small but real engineering · **5** = involves AI/optimization integration · **8** = cross-system orchestration · **13** = epic-level (split before commit).

### Priority scale

**Must (M)** — MVP P0 · **Should (S)** — fast-follow P1 · **Could (C)** — post-MVP

---

## Sub-Epic Map

| #   | Sub-Epic                                                                                     | Stories         | T14 Pillar | Total points (planned) |
| --- | -------------------------------------------------------------------------------------------- | --------------- | ---------- | ---------------------- |
| A   | [Living MPS Engine](#sub-epic-a--living-mps-engine)                                          | DS-001 → DS-104 | A          | 39                     |
| B   | [Gantt + Simulation Canvas](#sub-epic-b--gantt--simulation-canvas)                           | DS-201 → DS-206 | A + B      | 24                     |
| C   | [Analysis View](#sub-epic-c--analysis-view)                                                  | DS-301 → DS-305 | C          | 21                     |
| D   | [AI Co-pilot (Chatbox + Recs)](#sub-epic-d--ai-co-pilot-chatbox--recommendations)            | DS-401 → DS-405 | D          | 26                     |
| E   | [Production Order + Shop Floor Capacity](#sub-epic-e--production-order--shop-floor-capacity) | DS-451 → DS-456 | A + C      | 22                     |
| F   | [Tuning Logic (Process + Capacity)](#sub-epic-f--tuning-logic-process--capacity)             | DS-501 → DS-512 | E          | 26                     |
| G   | [Compare, Commit & History](#sub-epic-g--compare-commit--history)                            | DS-601 → DS-605 | A + B      | 18                     |
| H   | [Background Tasks + Integrations](#sub-epic-h--background-tasks--integrations)               | DS-701 → DS-805 | A + D      | 24                     |
|     | **Total**                                                                                    | **39 stories**  |            | **200 pts**            |

---

## Sub-Epic A — Living MPS Engine

> Continuous, event-driven re-plan with anchored stability zones. The core engine that everything else hangs off.

---

### DS-001 — Generate initial MPS from POs + current state

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Dynamic Schedule / Living MPS Engine                                               |
| **Priority**         | Must (M)                                                                           |
| **Story Points**     | 8                                                                                  |
| **Sprint**           | Sprint 1                                                                           |
| **Dependencies**     | DS-801 (PO sync), DS-802 (MES sync), DS-454 (capacity model loaded)                |
| **Design Reference** | [Gantt view §1](../prototype/dynamic-schedule/01-main-views.md#1-gantt-simulation) |
| **Hypothesis Link**  | H-04 · H-DS-1                                                                      |

**Story:**
As **Sarah Chen**, I want to **auto-generate an MPS from all active Production Orders, current WIP/equipment state, and the master process / capacity constraints**, so that I have a feasible starting plan in **< 4 hours** (target: minutes) instead of 3–5 days of manual work.

**Acceptance Criteria:**

1. **Given** active POs, current WIP, equipment state, and a complete capacity + qualification model are loaded, **When** I click "Generate MPS", **Then** a feasible plan covering the 14-week horizon is produced within 4 hours wall-clock (target P50 < 5 min for a 320-lot / 80-tool-group fab).
2. **Given** the engine cannot place every lot due to over-capacity, **When** generation completes, **Then** unplaced lots are listed separately with the binding constraint named (e.g., "HARC overload days 8–10").
3. **Given** the generated plan, **When** I open the **Gantt (Simulation)** view, **Then** every schedulable unit `(lot, step_index, tool_group, recipe)` is rendered with `start_p50 / p80 / p95` and a status chip (on-track / at-risk / slipped / hot-lot).
4. **Given** the plan satisfies all hard constraints, **When** the constraint engine validates, **Then** zero violations are reported; **Otherwise** the plan is flagged "Draft (with violations)" and never auto-published.

---

### DS-002 — Event-driven incremental replan

| Field                | Value                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Epic**             | Living MPS Engine                                                                                                           |
| **Priority**         | Must (M)                                                                                                                    |
| **Story Points**     | 8                                                                                                                           |
| **Sprint**           | Sprint 2                                                                                                                    |
| **Dependencies**     | DS-001, DS-101 (anchored zones), DS-803 (SPC + yield feed)                                                                  |
| **Design Reference** | [Screen Flow §3 yield-excursion sequence](../prototype/dynamic-schedule/03-screen-flow.md#3-mid-day-yield-excursion-replan) |
| **Hypothesis Link**  | H-DS-1                                                                                                                      |

**Story:**
As **Sarah Chen**, I want the system to **automatically re-optimize the MPS incrementally when a high-leverage event fires** (yield excursion, equipment-down-unplanned, hot-lot insertion), so that the plan stays current without me running a full rebuild.

**Acceptance Criteria:**

1. **Given** a yield-excursion event (≥ 3σ on a probe SPC chart) arrives, **When** the replan engine consumes it, **Then** an incremental re-optimization completes within **60 seconds** (P95) and produces a candidate Plan B.
2. **Given** an unplanned equipment-down event arrives, **When** the engine evaluates routing options, **Then** affected lots are rerouted to qualified surviving tools/chambers respecting the qualification matrix.
3. **Given** Plan B is generated, **When** it changes the published plan, **Then** it is **not auto-published**; instead a HIGH **Recommendation** is raised and Sarah sees a Preview → Compare → Commit flow.
4. **Given** the event has a planned-PM type, **When** the engine processes it, **Then** no Recommendation is raised because planned PM is already baked into the baseline (silent log entry only).

---

### DS-101 — Anchored replan zones (Frozen / Flex / Far)

| Field                | Value                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Epic**             | Living MPS Engine                                                                                                        |
| **Priority**         | Must (M)                                                                                                                 |
| **Story Points**     | 5                                                                                                                        |
| **Sprint**           | Sprint 2                                                                                                                 |
| **Dependencies**     | DS-001                                                                                                                   |
| **Design Reference** | [T14 §5 Pillar A](../ideation/T14-concept-dynamic-schedule.md#pillar-a--living-mps-generation-continuous-re-plan-engine) |
| **Hypothesis Link**  | H-DS-2                                                                                                                   |

**Story:**
As **Sarah Chen**, I want **anchored replan zones** (Frozen 0–72 h · Flex 72 h–4 wk · Far 4–14 wk) so that the AI never whiplashes the floor by reshuffling lots already in dispatch.

**Acceptance Criteria:**

1. **Given** a replan event fires, **When** the optimizer runs, **Then** lots in the Frozen zone are **pinned** (cannot be moved without explicit Sarah confirmation) and Flex/Far zones are optimized freely.
2. **Given** an event has severity HIGH and lands in the Frozen zone (e.g., a hot lot ordered for tomorrow), **When** the engine builds a candidate plan, **Then** Frozen lots that would otherwise move are flagged "requires confirm" and presented in the Compare view with explicit override checkbox.
3. **Given** I want to inspect zone boundaries, **When** I open settings, **Then** I see the current thresholds (default 72h / 4w / 14w) and can edit per shop floor (admin-only in MVP).
4. **Given** the Gantt is rendered, **When** zones are visualized, **Then** the timeline shows three subtle background shades for Frozen / Flex / Far.

---

### DS-102 — Monday-morning weekend digest

| Field                | Value                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Epic**             | Living MPS Engine                                                                                                                      |
| **Priority**         | Should (S)                                                                                                                             |
| **Story Points**     | 3                                                                                                                                      |
| **Sprint**           | Sprint 3                                                                                                                               |
| **Dependencies**     | DS-002, DS-403 (Recs panel)                                                                                                            |
| **Design Reference** | [Screen Flow §2 Monday-morning](../prototype/dynamic-schedule/03-screen-flow.md#2-monday-morning-flow--what-happened-over-the-weekend) |
| **Hypothesis Link**  | H-DS-1                                                                                                                                 |

**Story:**
As **Sarah Chen**, I want a **Monday-morning digest banner** summarizing what fired over the weekend and what the AI already replanned, so I never start a week from scratch.

**Acceptance Criteria:**

1. **Given** I have not opened aPlanner for ≥ 24 hours, **When** I log in, **Then** a digest banner appears with: events that fired (by class + count), plans the AI proposed but did not auto-commit, and a one-click "Open Recommendations".
2. **Given** I click the digest, **When** the Recommendations panel opens, **Then** HIGH recs are sorted first, each linked to the originating event.
3. **Given** I dismiss the digest, **When** I return next session, **Then** the digest does not re-appear for the same set of events.

---

### DS-103 — Frozen-zone override confirmation

| Field                | Value                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **Epic**             | Living MPS Engine                                                                                         |
| **Priority**         | Must (M)                                                                                                  |
| **Story Points**     | 3                                                                                                         |
| **Sprint**           | Sprint 2                                                                                                  |
| **Dependencies**     | DS-101                                                                                                    |
| **Design Reference** | [Screen Flow §7 event routing](../prototype/dynamic-schedule/03-screen-flow.md#7-event--response-routing) |
| **Hypothesis Link**  | H-DS-2 · H-05                                                                                             |

**Story:**
As **Sarah Chen** (or **Jennifer** as escalation owner), I want **explicit confirmation before any change inside the Frozen zone** is published, so that the floor never receives a surprise reroute.

**Acceptance Criteria:**

1. **Given** a candidate plan changes a Frozen-zone lot, **When** I open the Compare view, **Then** Frozen-zone moves are visually distinguished (e.g., red border) and a "Confirm Frozen-zone overrides (N)" checkbox appears.
2. **Given** I have not checked the override box, **When** I click Commit, **Then** the action is blocked with a banner explaining why.
3. **Given** I check the override box and Commit, **When** the plan publishes, **Then** an audit entry records the override with my user ID, the affected lots, and the originating event.

---

### DS-104 — Configurable zone boundaries per shop floor

| Field                | Value                                                                        |
| -------------------- | ---------------------------------------------------------------------------- |
| **Epic**             | Living MPS Engine                                                            |
| **Priority**         | Could (C)                                                                    |
| **Story Points**     | 3                                                                            |
| **Sprint**           | Sprint 5                                                                     |
| **Dependencies**     | DS-101                                                                       |
| **Design Reference** | [README — Top bar settings](../prototype/dynamic-schedule/README.md#top-bar) |
| **Hypothesis Link**  | H-DS-2                                                                       |

**Story:**
As an **admin / Ops Manager**, I want to **configure Frozen/Flex/Far thresholds per shop floor**, so that fabs with different cycle times can tune the stability / agility tradeoff.

**Acceptance Criteria:**

1. **Given** I am an admin, **When** I open Settings → Replan zones, **Then** I see numeric inputs for each zone with the unit (hours / weeks) and current defaults.
2. **Given** I edit a threshold, **When** I save, **Then** the change applies to all future replans for this shop floor and an audit entry is logged.
3. **Given** non-admin users open the settings page, **When** they view it, **Then** the inputs are read-only.

---

## Sub-Epic B — Gantt + Simulation Canvas

> The primary canvas. PO → Family → Stage → Step on a timeline.

---

### DS-201 — Gantt canvas with PO → Family → Stage → Step hierarchy

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Gantt + Simulation                                                                 |
| **Priority**         | Must (M)                                                                           |
| **Story Points**     | 5                                                                                  |
| **Sprint**           | Sprint 1                                                                           |
| **Dependencies**     | DS-001                                                                             |
| **Design Reference** | [Gantt view §1](../prototype/dynamic-schedule/01-main-views.md#1-gantt-simulation) |
| **Hypothesis Link**  | H-DS-1                                                                             |

**Story:**
As **Sarah Chen**, I want a **Gantt canvas displaying PO → Production Family → Stage → Step** with milestones as diamond markers, so that I can see the entire plan structure at a glance.

**Acceptance Criteria:**

1. **Given** a generated plan, **When** I open the Gantt view, **Then** the left task tree shows the four-level hierarchy with collapse/expand per row and the right-side timeline shows bars colored by status (blue / amber / red / purple).
2. **Given** a milestone exists on a Family, **When** rendered, **Then** a diamond (◆) marker appears on the milestone's commitment date with a tooltip showing customer + qty + slip.
3. **Given** the plan has > 200 lots, **When** I open the view, **Then** initial render completes within 2 seconds (virtualized rendering).
4. **Given** I switch the horizon picker (Day / Week / Month), **When** the canvas re-renders, **Then** transition completes within 500 ms and bar widths re-scale appropriately.

---

### DS-202 — Drag-to-shift batch with live ripple preview

| Field                | Value                                                                                                                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Epic**             | Gantt + Simulation                                                                                                                                                                                   |
| **Priority**         | Must (M)                                                                                                                                                                                             |
| **Story Points**     | 8                                                                                                                                                                                                    |
| **Sprint**           | Sprint 2                                                                                                                                                                                             |
| **Dependencies**     | DS-201, DS-001                                                                                                                                                                                       |
| **Design Reference** | [Gantt view §1 interactions](../prototype/dynamic-schedule/01-main-views.md#1-gantt-simulation) · [Screen Flow §4 hot-lot](../prototype/dynamic-schedule/03-screen-flow.md#4-hot-lot-insertion-flow) |
| **Hypothesis Link**  | H-DS-3                                                                                                                                                                                               |

**Story:**
As **Sarah Chen**, I want to **drag a batch on the Gantt and see the downstream ripple in real time**, so that I can evaluate manual schedule edits before committing.

**Acceptance Criteria:**

1. **Given** I drag a batch bar to a new slot, **When** I hold the drag, **Then** an overlay shows the downstream impact (lots shifted, capacity bands flipping color, milestones moving) updating at ≥ 15 fps.
2. **Given** the target slot violates a hard constraint (unqualified route, qual expiry), **When** I attempt to drop, **Then** the drop is rejected with an inline reason and the bar snaps back.
3. **Given** the target slot is feasible but worsens a commit, **When** I drop, **Then** the change is staged in the current Simulation (not Published) and the commitment-risk indicator updates.
4. **Given** I want to undo the drag, **When** I press Ctrl/Cmd+Z within 30 s, **Then** the move reverts.

---

### DS-203 — Bar inline alerts (overload, slip, hot)

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Gantt + Simulation                                                                 |
| **Priority**         | Must (M)                                                                           |
| **Story Points**     | 3                                                                                  |
| **Sprint**           | Sprint 2                                                                           |
| **Dependencies**     | DS-201                                                                             |
| **Design Reference** | [Gantt view §1](../prototype/dynamic-schedule/01-main-views.md#1-gantt-simulation) |
| **Hypothesis Link**  | H-05                                                                               |

**Story:**
As **Sarah Chen** or **Jennifer Williams**, I want **inline alert chips on bars** (⚠ Cap-overload, SLIP 2d, ★ HOT), so that I see risks without leaving the Gantt.

**Acceptance Criteria:**

1. **Given** a step lands in an over-capacity day, **When** rendered, **Then** the bar shows a ⚠ chip and a click opens an explainability popover (cause, suggested fix, "ask AI to fix").
2. **Given** a Family milestone slips past its commit date, **When** rendered, **Then** the diamond turns red and the bar shows "SLIP Nd".
3. **Given** a lot is tagged hot-lot, **When** rendered, **Then** its bar is purple with a ★ chip.

---

### DS-204 — Batch Detail Drawer

| Field                | Value                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **Epic**             | Gantt + Simulation                                                                         |
| **Priority**         | Must (M)                                                                                   |
| **Story Points**     | 3                                                                                          |
| **Sprint**           | Sprint 3                                                                                   |
| **Dependencies**     | DS-201                                                                                     |
| **Design Reference** | [T14 §7 screen 4](../ideation/T14-concept-dynamic-schedule.md#7-key-screens-concept-level) |
| **Hypothesis Link**  | H-05                                                                                       |

**Story:**
As **Sarah Chen**, I want a **Batch Detail Drawer** that opens when I click any bar, showing recipe, tool groups, process-time distribution, chamber qualification, current WIP, and predicted P50/P80/P95, so that I can audit any decision the system made.

**Acceptance Criteria:**

1. **Given** I click a Gantt bar, **When** the drawer opens, **Then** it shows recipe ID, tool group, qualified tools/chambers, process time distribution (P50 / P80 / P95), current WIP count, and predicted milestone dates with confidence bands.
2. **Given** the drawer is open, **When** I click "Explain this slot", **Then** the constraint chain (qualification / capacity / priority / due-date / yield) is rendered as a vertical list with data source per line.
3. **Given** I close the drawer, **When** I re-open another bar, **Then** the previous drawer state is preserved (collapsed/expanded sections).

---

### DS-205 — Scenario tabs (Plan A / Plan B / Plan C)

| Field                | Value                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Epic**             | Gantt + Simulation                                                                                                      |
| **Priority**         | Should (S)                                                                                                              |
| **Story Points**     | 5                                                                                                                       |
| **Sprint**           | Sprint 4                                                                                                                |
| **Dependencies**     | DS-201, DS-402 (AI scenarios)                                                                                           |
| **Design Reference** | [T14 §5 Pillar B](../ideation/T14-concept-dynamic-schedule.md#pillar-b--multi-scenario-simulation-gantt--scenario-tabs) |
| **Hypothesis Link**  | H-DS-3                                                                                                                  |

**Story:**
As **Sarah Chen**, I want **scenario tabs** so I can hold up to 3 plans side-by-side in memory (Published + 2 simulations) and switch between them.

**Acceptance Criteria:**

1. **Given** the AI proposes a scenario, **When** I save it, **Then** it appears as a tab labeled "Plan B (Simulation)" with timestamp.
2. **Given** I have 3 plans, **When** I attempt to open a 4th, **Then** I am asked to close one first.
3. **Given** I switch tabs, **When** the new plan renders, **Then** the workload mini-strip + commitment risk panel update accordingly.

---

### DS-206 — Workload mini-strip (Gantt footer)

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Gantt + Simulation                                                                 |
| **Priority**         | Should (S)                                                                         |
| **Story Points**     | 3                                                                                  |
| **Sprint**           | Sprint 3                                                                           |
| **Dependencies**     | DS-201, DS-301 (heatmap data)                                                      |
| **Design Reference** | [Gantt view §1](../prototype/dynamic-schedule/01-main-views.md#1-gantt-simulation) |
| **Hypothesis Link**  | —                                                                                  |

**Story:**
As **Sarah Chen**, I want a **sticky workload strip** at the bottom of the Gantt showing top-3 tool-group utilizations for the visible horizon, so that I see capacity health without leaving the canvas.

**Acceptance Criteria:**

1. **Given** the Gantt is rendered, **When** I scroll vertically, **Then** the workload strip remains visible at the bottom.
2. **Given** I scroll horizontally (time axis), **When** the visible horizon changes, **Then** the strip recomputes within 1 s.
3. **Given** I click a tool group bar in the strip, **When** it activates, **Then** I navigate to the **Analysis View** filtered on that tool group.

---

## Sub-Epic C — Analysis View

> Decision support: heatmap, commitment risk, bottleneck timeline, constraint validation.

---

### DS-301 — Workload heatmap (tool group × day)

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Analysis View                                                                      |
| **Priority**         | Must (M)                                                                           |
| **Story Points**     | 5                                                                                  |
| **Sprint**           | Sprint 2                                                                           |
| **Dependencies**     | DS-454 (capacity model), DS-001                                                    |
| **Design Reference** | [Analysis View §2](../prototype/dynamic-schedule/01-main-views.md#2-analysis-view) |
| **Hypothesis Link**  | H-05                                                                               |

**Story:**
As **Sarah Chen** or **Jennifer Williams**, I want a **Tool Group × Day workload heatmap** with safe/warning/overload bands, so that I can spot capacity stress at a glance.

**Acceptance Criteria:**

1. **Given** a generated plan, **When** I open Analysis View, **Then** the heatmap renders all monitored tool groups by day for the chosen horizon (default 14 wk) with cells colored per the band rules (≤ 70 safe · 70–85 warning · > 85 overload).
2. **Given** I hover any cell, **When** the tooltip appears, **Then** it shows exact utilization %, effective capacity (WSPM), planned wafer-passes, and OEE breakdown.
3. **Given** I click a cell, **When** it activates, **Then** I drill into the **Shop Floor Capacity** view for that tool group scoped to that day.

---

### DS-302 — Commitment-risk panel (P50/P80/P95)

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Analysis View                                                                      |
| **Priority**         | Must (M)                                                                           |
| **Story Points**     | 5                                                                                  |
| **Sprint**           | Sprint 3                                                                           |
| **Dependencies**     | DS-001                                                                             |
| **Design Reference** | [Analysis View §2](../prototype/dynamic-schedule/01-main-views.md#2-analysis-view) |
| **Hypothesis Link**  | H-05                                                                               |

**Story:**
As **Sarah Chen**, I want to see **P50 / P80 / P95 commit dates per customer milestone**, so that I never communicate a single false-precision date.

**Acceptance Criteria:**

1. **Given** a generated plan, **When** I open Analysis View, **Then** the commitment-risk panel lists every milestone with P50/P80/P95 columns and a slip-days column.
2. **Given** a milestone's P80 falls past its commit date, **When** rendered, **Then** the row is color-coded amber; **Given** P50 itself slips, **Then** red.
3. **Given** I click a row, **When** activated, **Then** I navigate to the originating PO + Family in the Gantt with that milestone highlighted.

---

### DS-303 — Bottleneck shift timeline

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Analysis View                                                                      |
| **Priority**         | Should (S)                                                                         |
| **Story Points**     | 3                                                                                  |
| **Sprint**           | Sprint 4                                                                           |
| **Dependencies**     | DS-001, DS-301                                                                     |
| **Design Reference** | [Analysis View §2](../prototype/dynamic-schedule/01-main-views.md#2-analysis-view) |
| **Hypothesis Link**  | —                                                                                  |

**Story:**
As **Sarah Chen**, I want a **bottleneck shift timeline** showing the binding constraint each week across the horizon, so that I see the constraint moving instead of assuming HARC etch is always the bottleneck.

**Acceptance Criteria:**

1. **Given** the analysis runs, **When** the timeline renders, **Then** each week shows the predicted bottleneck tool-group label.
2. **Given** the bottleneck changes mid-horizon, **When** rendered, **Then** the timeline visually breaks at the transition and a tooltip explains why.

---

### DS-304 — Constraint validation list with auto-fix CTA

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Analysis View                                                                      |
| **Priority**         | Must (M)                                                                           |
| **Story Points**     | 3                                                                                  |
| **Sprint**           | Sprint 2                                                                           |
| **Dependencies**     | DS-001                                                                             |
| **Design Reference** | [Analysis View §2](../prototype/dynamic-schedule/01-main-views.md#2-analysis-view) |
| **Hypothesis Link**  | —                                                                                  |

**Story:**
As **Sarah Chen**, I want a **constraint-violation list with a "ask AI to fix" CTA** per item, so that I can resolve issues without manual reshuffling.

**Acceptance Criteria:**

1. **Given** the plan has rule violations, **When** I open Analysis View, **Then** all violations are listed with type (over-cap / unqualified-route / qual-expiry / probe-overload), affected lots, and severity.
2. **Given** I click "Ask AI to fix" on an item, **When** activated, **Then** the AI Chatbox opens with a pre-filled prompt scoped to that violation; on Run, it returns a Compare preview.

---

### DS-305 — KPI row (adherence, X-factor, yield Δ)

| Field                | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Epic**             | Analysis View                                                                      |
| **Priority**         | Should (S)                                                                         |
| **Story Points**     | 5                                                                                  |
| **Sprint**           | Sprint 4                                                                           |
| **Dependencies**     | DS-001, DS-803 (yield data)                                                        |
| **Design Reference** | [Analysis View §2](../prototype/dynamic-schedule/01-main-views.md#2-analysis-view) |
| **Hypothesis Link**  | —                                                                                  |

**Story:**
As **Sarah Chen** or **Jennifer Williams**, I want a **top KPI row** (plan adherence, commits-at-risk count, current bottleneck, X-factor, yield Δ) so I get a 5-second pulse on plan health.

**Acceptance Criteria:**

1. **Given** the plan is loaded, **When** Analysis View opens, **Then** the KPI row renders within 1 s with each KPI showing the metric, delta vs. last commit, and a sparkline.
2. **Given** I click a KPI, **When** activated, **Then** I jump to the relevant detail panel below (e.g., commits-at-risk → commitment-risk panel).

---

## Sub-Epic D — AI Co-pilot (Chatbox + Recommendations)

> Conversational what-if and proactive suggestions. Every AI surface follows the explainability spine.

---

### DS-401 — AI Chatbox conversational what-if

| Field                | Value                                                                          |
| -------------------- | ------------------------------------------------------------------------------ |
| **Epic**             | AI Co-pilot                                                                    |
| **Priority**         | Should (S)                                                                     |
| **Story Points**     | 8                                                                              |
| **Sprint**           | Sprint 4                                                                       |
| **Dependencies**     | DS-002, DS-601 (Compare view)                                                  |
| **Design Reference** | [AI Chatbox §B](../prototype/dynamic-schedule/02-right-panels.md#b-ai-chatbox) |
| **Hypothesis Link**  | H-DS-3 · H-05                                                                  |

**Story:**
As **Sarah Chen**, I want a **conversational AI co-pilot** I can ask in plain English ("what if ETC-44 down 6h + insert hot lot HL-22?"), so that I get 2–3 ranked scenarios within seconds, with full explainability.

**Acceptance Criteria:**

1. **Given** I type a what-if prompt, **When** I press Send, **Then** the AI returns ranked scenario cards within 10 s (P95) and never proposes a physically infeasible plan (constraint engine gate).
2. **Given** each scenario card, **When** I expand it, **Then** I see the constraint chain explaining why it ranked where it did, plus a `[Preview]` button that opens Compare with current plan vs scenario.
3. **Given** I have lots selected on the Gantt, **When** I open the Chatbox, **Then** the selection is passed as conversational context (visible at the top of the panel).
4. **Given** I dismiss / accept / preview a scenario, **When** I do so, **Then** the action is captured in the conversation log for learning.

---

### DS-402 — Quick-prompt templates

| Field                | Value                                                                          |
| -------------------- | ------------------------------------------------------------------------------ |
| **Epic**             | AI Co-pilot                                                                    |
| **Priority**         | Should (S)                                                                     |
| **Story Points**     | 3                                                                              |
| **Sprint**           | Sprint 4                                                                       |
| **Dependencies**     | DS-401                                                                         |
| **Design Reference** | [AI Chatbox §B](../prototype/dynamic-schedule/02-right-panels.md#b-ai-chatbox) |
| **Hypothesis Link**  | H-DS-3                                                                         |

**Story:**
As **Sarah Chen**, I want **quick-prompt templates** (insert hot lot, tool down, pull commit, yield drop) so that I don't face a blank input and so the AI gets well-structured prompts.

**Acceptance Criteria:**

1. **Given** the Chatbox is open, **When** I click a quick-prompt, **Then** a structured form appears with the slots to fill (tool ID, duration, etc.).
2. **Given** I complete the form and submit, **When** the AI processes, **Then** the prompt that was generated is shown so I learn the prompt structure for next time.

---

### DS-403 — Recommendations panel (proactive suggestions)

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | AI Co-pilot                                                                              |
| **Priority**         | Must (M)                                                                                 |
| **Story Points**     | 8                                                                                        |
| **Sprint**           | Sprint 3                                                                                 |
| **Dependencies**     | DS-002, DS-001                                                                           |
| **Design Reference** | [Recommendations §E](../prototype/dynamic-schedule/02-right-panels.md#e-recommendations) |
| **Hypothesis Link**  | H-05                                                                                     |

**Story:**
As **Sarah Chen**, I want **AI-pushed recommendations ranked by impact** (HIGH / MED / LOW) so that I catch high-leverage opportunities without scanning every dashboard.

**Acceptance Criteria:**

1. **Given** a high-leverage opportunity is detected (yield offset, over-capacity, hot lot pending, qual expiry, idle capacity), **When** the engine evaluates, **Then** a Recommendation card is created with priority chip, headline rationale, and action button.
2. **Given** I click `Preview`, **When** activated, **Then** the relevant detail surface opens (Compare for plan changes, Tuning for tune suggestions, Capacity view for qual issues).
3. **Given** I click `Skip`, **When** activated, **Then** the rec is dismissed and the model records it as suppressed-signal for similar future recs.
4. **Given** my rec inbox would exceed 10 active items, **When** the engine adds a new one, **Then** lower-priority recs are auto-archived (still visible under "Skipped").

---

### DS-404 — Explainability spine (every AI surface)

| Field                | Value                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Epic**             | AI Co-pilot                                                                            |
| **Priority**         | Must (M)                                                                               |
| **Story Points**     | 5                                                                                      |
| **Sprint**           | Sprint 2                                                                               |
| **Dependencies**     | — (cross-cutting)                                                                      |
| **Design Reference** | [T14 §4 non-negotiables](../ideation/T14-concept-dynamic-schedule.md#4-concept-vision) |
| **Hypothesis Link**  | H-05                                                                                   |

**Story:**
As **Sarah Chen**, I want **every AI recommendation and scenario to expose its constraint chain, data source, and confidence**, so that I can defend any decision to Jennifer or the floor.

**Acceptance Criteria:**

1. **Given** any AI-generated artifact (scenario, recommendation, tune suggestion), **When** I expand it, **Then** the explainability block shows: constraint chain (ordered list), data source per claim, model confidence (numeric %), and links to source records (MES lot ID, SPC chart ID, qual record).
2. **Given** confidence is below 70 %, **When** rendered, **Then** the artifact is visually marked "low confidence" and not surfaced as HIGH priority unless explicitly opted in.
3. **Given** an artifact references a fact, **When** I click that line, **Then** the source record opens (MES lot detail, SPC chart, qual record).

---

### DS-405 — Override capture loop

| Field                | Value                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Epic**             | AI Co-pilot                                                                                                           |
| **Priority**         | Should (S)                                                                                                            |
| **Story Points**     | 3                                                                                                                     |
| **Sprint**           | Sprint 5                                                                                                              |
| **Dependencies**     | DS-401, DS-403                                                                                                        |
| **Design Reference** | [T14 §5 Pillar D](../ideation/T14-concept-dynamic-schedule.md#pillar-d--ai-directed-optimization-planner-in-the-loop) |
| **Hypothesis Link**  | H-DS-4                                                                                                                |

**Story:**
As **Sarah Chen**, I want a **one-question prompt when I override the AI**, so that my tacit reasoning is captured and the model learns.

**Acceptance Criteria:**

1. **Given** I reject an AI scenario / recommendation, **When** the dismissal completes, **Then** a single optional input ("why? — 1-line is fine") appears, defaulting to closeable without entry.
2. **Given** I provide text, **When** I submit, **Then** the reason is stored with the override event and feeds into the model retraining queue.
3. **Given** I dismiss the prompt, **When** I close it, **Then** the override is still logged (silently) without a reason.

---

## Sub-Epic E — Production Order + Shop Floor Capacity

> The two data-input views that feed the engine. PO = demand, Capacity = supply.

---

### DS-451 — PO list with filter + detail pane

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | Production Order                                                                         |
| **Priority**         | Must (M)                                                                                 |
| **Story Points**     | 3                                                                                        |
| **Sprint**           | Sprint 1                                                                                 |
| **Dependencies**     | DS-801 (PO sync)                                                                         |
| **Design Reference** | [Production Order §3](../prototype/dynamic-schedule/01-main-views.md#3-production-order) |
| **Hypothesis Link**  | H-04                                                                                     |

**Story:**
As **Sarah Chen**, I want a **PO list with filter + detail pane** showing every active production order with priority, commitment dates, and master process flow, so that I can audit demand inputs.

**Acceptance Criteria:**

1. **Given** POs are synced, **When** I open the PO view, **Then** the list shows PO#, customer, family, qty, priority chip, M1 date with slip indicator.
2. **Given** I select a row, **When** the detail pane updates, **Then** I see customer, spec, wafer-start, lot count, every milestone with status, process flow summary.
3. **Given** I filter by customer / status / priority, **When** I apply, **Then** the list updates within 200 ms.

---

### DS-452 — Mark lot as hot

| Field                | Value                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| **Epic**             | Production Order                                                                                   |
| **Priority**         | Must (M)                                                                                           |
| **Story Points**     | 3                                                                                                  |
| **Sprint**           | Sprint 2                                                                                           |
| **Dependencies**     | DS-451, DS-202                                                                                     |
| **Design Reference** | [Screen Flow §4 hot-lot](../prototype/dynamic-schedule/03-screen-flow.md#4-hot-lot-insertion-flow) |
| **Hypothesis Link**  | H-DS-3                                                                                             |

**Story:**
As **Sarah Chen**, I want to **mark a lot as hot (priority bump)** with a single action from either the PO view or the Gantt, so that I can respond to customer escalations within minutes.

**Acceptance Criteria:**

1. **Given** I select a lot, **When** I click "Mark hot", **Then** a confirmation dialog asks for priority level (P1 / hot) and target before-date.
2. **Given** I confirm, **When** the action commits, **Then** the lot's priority field updates, the engine raises a HIGH Recommendation with the proposed ripple, and the lot's bar on the Gantt turns purple with a ★.
3. **Given** I un-mark hot, **When** the action commits, **Then** priority reverts to original and the system raises a Recommendation to undo ripple effects (if any).

---

### DS-453 — Replan one PO (local scope)

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | Production Order                                                                         |
| **Priority**         | Should (S)                                                                               |
| **Story Points**     | 5                                                                                        |
| **Sprint**           | Sprint 3                                                                                 |
| **Dependencies**     | DS-002, DS-451                                                                           |
| **Design Reference** | [Production Order §3](../prototype/dynamic-schedule/01-main-views.md#3-production-order) |
| **Hypothesis Link**  | —                                                                                        |

**Story:**
As **Sarah Chen**, I want a **"Replan this PO"** action scoped to a single PO, so I can iterate quickly without re-running a full-plan optimization.

**Acceptance Criteria:**

1. **Given** I am viewing a PO detail, **When** I click "Replan this PO", **Then** the engine re-optimizes only this PO's lots holding everything else fixed and returns within 30 s (P95).
2. **Given** the local replan affects shared resources, **When** the result is computed, **Then** the system surfaces cross-impacts (lots from other POs that would move) and asks whether to escalate to a wider replan.

---

### DS-454 — Tool-group tree + qualification matrix

| Field                | Value                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Epic**             | Shop Floor Capacity                                                                            |
| **Priority**         | Must (M)                                                                                       |
| **Story Points**     | 5                                                                                              |
| **Sprint**           | Sprint 1                                                                                       |
| **Dependencies**     | DS-804 (qual data sync)                                                                        |
| **Design Reference** | [Shop Floor Capacity §4](../prototype/dynamic-schedule/01-main-views.md#4-shop-floor-capacity) |
| **Hypothesis Link**  | H-04                                                                                           |

**Story:**
As **Sarah Chen**, I want a **tool-group tree with chamber detail + a recipe × tool × chamber qualification matrix**, so I can see exactly which lots can run where.

**Acceptance Criteria:**

1. **Given** I open Shop Floor Capacity, **When** the tree renders, **Then** each tool group shows current utilization band; expanding shows tools and chambers with status icons (●= up, ○= down/drifting).
2. **Given** a tool group is selected, **When** the right pane renders, **Then** the qualification matrix shows recipes × tools (with chamber notes) and ✓ for qualified cells.
3. **Given** I click a qual ✓ cell, **When** the popover opens, **Then** I see qualification date, expiry date, and re-qual history.

---

### DS-455 — PM calendar overlay

| Field                | Value                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Epic**             | Shop Floor Capacity                                                                            |
| **Priority**         | Should (S)                                                                                     |
| **Story Points**     | 3                                                                                              |
| **Sprint**           | Sprint 3                                                                                       |
| **Dependencies**     | DS-454, DS-805 (PM cal sync)                                                                   |
| **Design Reference** | [Shop Floor Capacity §4](../prototype/dynamic-schedule/01-main-views.md#4-shop-floor-capacity) |
| **Hypothesis Link**  | —                                                                                              |

**Story:**
As **Sarah Chen**, I want a **PM calendar overlay** on the capacity view, so that I see planned downtime and confirm it's already baked into the plan.

**Acceptance Criteria:**

1. **Given** PM calendar data is loaded, **When** I toggle "PM cal", **Then** scheduled PM events are overlaid on the capacity heatmap with hatched cells.
2. **Given** a PM event is missing from the current plan, **When** the system detects, **Then** a Recommendation is raised to incorporate it.

---

### DS-456 — Capacity view: tune capacity entry point

| Field                | Value                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Epic**             | Shop Floor Capacity                                                                                    |
| **Priority**         | Should (S)                                                                                             |
| **Story Points**     | 2                                                                                                      |
| **Sprint**           | Sprint 4                                                                                               |
| **Dependencies**     | DS-454, DS-511 (Capacity Tuning Logic)                                                                 |
| **Design Reference** | [Shop Floor Capacity §4 actions](../prototype/dynamic-schedule/01-main-views.md#4-shop-floor-capacity) |
| **Hypothesis Link**  | —                                                                                                      |

**Story:**
As **Sarah Chen**, I want a **"Tune capacity →"** button on a tool group, so I can jump straight into the Capacity Tuning Logic scoped to that group.

**Acceptance Criteria:**

1. **Given** I am viewing a tool group, **When** I click "Tune capacity →", **Then** I navigate to the Capacity Tuning Logic view with this group pre-selected and any pending suggestion expanded.

---

## Sub-Epic F — Tuning Logic (Process + Capacity)

> The knowledge-capture loop. SPC-driven tune suggestions reviewed by Sarah, sent to PE/EE.

---

### DS-501 — Process Tuning suggestion list

| Field                | Value                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **Epic**             | Process Tuning                                                                             |
| **Priority**         | Should (S)                                                                                 |
| **Story Points**     | 5                                                                                          |
| **Sprint**           | Sprint 4                                                                                   |
| **Dependencies**     | DS-803 (SPC feed)                                                                          |
| **Design Reference** | [Process Tuning §5](../prototype/dynamic-schedule/01-main-views.md#5-process-tuning-logic) |
| **Hypothesis Link**  | H-DS-4                                                                                     |

**Story:**
As **Sarah Chen**, I want the system to **detect process-time drift via SPC and propose tunes** for my review, so that the schedule reflects actual fab performance.

**Acceptance Criteria:**

1. **Given** SPC data for a (tool group, recipe) shows the median process time out of control vs spec for ≥ N data points (config; default 60), **When** the detector runs, **Then** a tune suggestion is raised with: spec time, actual median, suggested new value, confidence %, schedule impact (lots affected, cycle-time delta, commit improvements).
2. **Given** the suggestion list renders, **When** I open it, **Then** items are grouped by status (Pending / Accepted / Sent to PE) and sortable by confidence.

---

### DS-502 — Process Tuning detail with SPC chart + schedule impact

| Field                | Value                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **Epic**             | Process Tuning                                                                             |
| **Priority**         | Should (S)                                                                                 |
| **Story Points**     | 5                                                                                          |
| **Sprint**           | Sprint 4                                                                                   |
| **Dependencies**     | DS-501                                                                                     |
| **Design Reference** | [Process Tuning §5](../prototype/dynamic-schedule/01-main-views.md#5-process-tuning-logic) |
| **Hypothesis Link**  | H-DS-4 · H-05                                                                              |

**Story:**
As **Sarah Chen**, I want the **detail view of a tune suggestion** showing SPC run chart with control limits + simulated schedule impact, so that I can make an informed accept/reject decision.

**Acceptance Criteria:**

1. **Given** I open a tune, **When** the detail renders, **Then** I see the spec vs actual comparison, the SPC run chart with UCL/LCL/median lines and last 90 days of data points, the suggested new value, and the schedule impact (lots affected, capacity freed, commit improvements).
2. **Given** I click "Accept tune", **When** confirmed, **Then** the new value is applied to the current simulation and the suggestion moves to "Accepted".
3. **Given** I click "Reject", **When** confirmed, **Then** the suggestion is dismissed and the cause is captured (one-line text or skip).

---

### DS-503 — Send tuning evidence to Process Engineer

| Field                | Value                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Epic**             | Process Tuning                                                                                                                                                                                   |
| **Priority**         | Should (S)                                                                                                                                                                                       |
| **Story Points**     | 5                                                                                                                                                                                                |
| **Sprint**           | Sprint 5                                                                                                                                                                                         |
| **Dependencies**     | DS-502                                                                                                                                                                                           |
| **Design Reference** | [Process Tuning §5 actions](../prototype/dynamic-schedule/01-main-views.md#5-process-tuning-logic) · [Screen Flow §5](../prototype/dynamic-schedule/03-screen-flow.md#5-process-tuning-workflow) |
| **Hypothesis Link**  | H-DS-4                                                                                                                                                                                           |

**Story:**
As **Sarah Chen**, I want to **send the tuning evidence package to Process Engineering** (Patricia Lim), so they can review and approve the spec change.

**Acceptance Criteria:**

1. **Given** I click "Send evidence to PE", **When** confirmed, **Then** the system packages the SPC chart, control limits, schedule-impact analysis and creates a review task for PE (via email or webhook to PE system).
2. **Given** PE accepts the tune, **When** they confirm, **Then** the master spec for that recipe is updated and the suggestion moves to "Spec updated".
3. **Given** PE rejects the tune, **When** they decline, **Then** the plan-side tune is also reverted to the original spec value and Sarah is notified.

---

### DS-511 — Capacity Tuning suggestion + detail

| Field                | Value                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **Epic**             | Capacity Tuning                                                                              |
| **Priority**         | Could (C)                                                                                    |
| **Story Points**     | 8                                                                                            |
| **Sprint**           | Sprint 5                                                                                     |
| **Dependencies**     | DS-802 (MES move history), DS-454                                                            |
| **Design Reference** | [Capacity Tuning §6](../prototype/dynamic-schedule/01-main-views.md#6-capacity-tuning-logic) |
| **Hypothesis Link**  | H-DS-4                                                                                       |

**Story:**
As **Sarah Chen**, I want **capacity tunes detected and proposed** when realized WSPM consistently diverges from modeled capacity, so that the plan reflects real throughput.

**Acceptance Criteria:**

1. **Given** realized WSPM for a tool group consistently differs from modeled effective capacity by > 2 % for ≥ 12 weeks, **When** the detector runs, **Then** a capacity tune is raised with realized vs modeled, suggested new value, attributed driver (which OEE component changed), and schedule impact.
2. **Given** I open the detail, **When** rendered, **Then** I see a realized-WSPM trend chart against modeled and the driver attribution.
3. **Given** I accept, **When** confirmed, **Then** the value applies to the current simulation only (not the master capacity model) until EE approves.

---

### DS-512 — Send capacity evidence to Equipment Engineer

| Field                | Value                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **Epic**             | Capacity Tuning                                                                              |
| **Priority**         | Could (C)                                                                                    |
| **Story Points**     | 3                                                                                            |
| **Sprint**           | Sprint 6                                                                                     |
| **Dependencies**     | DS-511                                                                                       |
| **Design Reference** | [Capacity Tuning §6](../prototype/dynamic-schedule/01-main-views.md#6-capacity-tuning-logic) |
| **Hypothesis Link**  | H-DS-4                                                                                       |

**Story:**
As **Sarah Chen**, I want to **send capacity evidence to Equipment Engineering** (Karl Schmidt), so EE can validate and update the master capacity model.

**Acceptance Criteria:**

1. **Given** I click "Send evidence to EE", **When** confirmed, **Then** the package (realized trend, modeled comparison, driver attribution, schedule impact) is sent to EE for review.
2. **Given** EE approves, **When** confirmed, **Then** the master capacity model is updated and replan suggestions propagate.

---

## Sub-Epic G — Compare, Commit & History

> The publishing workflow. Diff between plans, commit with fan-out, full audit log.

---

### DS-601 — Compare / Split view (two plans side-by-side)

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | Compare & Commit                                                                         |
| **Priority**         | Must (M)                                                                                 |
| **Story Points**     | 8                                                                                        |
| **Sprint**           | Sprint 3                                                                                 |
| **Dependencies**     | DS-201                                                                                   |
| **Design Reference** | [Compare §A](../prototype/dynamic-schedule/02-right-panels.md#a-split--compare-schedule) |
| **Hypothesis Link**  | H-05                                                                                     |

**Story:**
As **Sarah Chen**, I want **two plans side-by-side with a diff summary and itemized change list**, so that I can decide what to commit.

**Acceptance Criteria:**

1. **Given** I have an active simulation, **When** I click `⇄` (Compare), **Then** the workspace splits into Left (published) / Right (selected simulation) panes with synchronized time axis.
2. **Given** each pane, **When** rendered, **Then** I can independently choose its view mode (Gantt / Analysis / Workload).
3. **Given** the Right pane has changes, **When** the diff summary renders, **Then** it shows: commits-at-risk delta, bottleneck utilization delta, plan adherence delta, lot moves count.
4. **Given** the change list renders, **When** I scan it, **Then** each item shows the lot, the move (e.g., ETC-44 → ETC-07), and the reason (chamber drift, capacity, qual expiry, hot lot, yield).

---

### DS-602 — Commit plan with stakeholder fan-out

| Field                | Value                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **Epic**             | Compare & Commit                                                                                 |
| **Priority**         | Must (M)                                                                                         |
| **Story Points**     | 5                                                                                                |
| **Sprint**           | Sprint 3                                                                                         |
| **Dependencies**     | DS-601, DS-103 (frozen-zone confirm)                                                             |
| **Design Reference** | [Compare §A actions](../prototype/dynamic-schedule/02-right-panels.md#a-split--compare-schedule) |
| **Hypothesis Link**  | H-DS-1                                                                                           |

**Story:**
As **Sarah Chen**, I want **one-click Commit that publishes the new plan and automatically notifies all stakeholders**, so that I never have to email 15 people manually.

**Acceptance Criteria:**

1. **Given** I am in Compare and the proposed plan satisfies all gates, **When** I click "Commit", **Then** the plan version moves to Published, the previous version is Archived, and notifications fan out within 5 minutes (target < 1 min) to: BizDev account managers for affected customers, Manufacturing Engineer, Shop Floor Supervisor, Operations Manager.
2. **Given** the commit message field is shown, **When** I write a one-line summary, **Then** it accompanies the audit entry and the fan-out notifications.
3. **Given** any Frozen-zone overrides are present, **When** I attempt Commit, **Then** I must check the explicit confirmation (DS-103) before the button enables.

---

### DS-603 — Schedule change history (audit log)

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | Compare & Commit                                                                         |
| **Priority**         | Must (M)                                                                                 |
| **Story Points**     | 3                                                                                        |
| **Sprint**           | Sprint 4                                                                                 |
| **Dependencies**     | DS-602                                                                                   |
| **Design Reference** | [History §D](../prototype/dynamic-schedule/02-right-panels.md#d-schedule-change-history) |
| **Hypothesis Link**  | —                                                                                        |

**Story:**
As **Sarah Chen** or an **auditor**, I want a **git-style change history of every commit, AI replan, and tune**, so that I can answer "what changed and why".

**Acceptance Criteria:**

1. **Given** a plan history exists, **When** I open the History panel, **Then** entries are grouped (Today / Yesterday / This Week / Older) with timestamp, type, actor, trigger, summary, and actions.
2. **Given** I click an entry, **When** it expands, **Then** I see the full diff for that entry; **Given** I click "Diff", **Then** it opens Compare scoped to that snapshot vs current.

---

### DS-604 — Revert to previous plan

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | Compare & Commit                                                                         |
| **Priority**         | Could (C)                                                                                |
| **Story Points**     | 5                                                                                        |
| **Sprint**           | Sprint 6                                                                                 |
| **Dependencies**     | DS-603                                                                                   |
| **Design Reference** | [History §D](../prototype/dynamic-schedule/02-right-panels.md#d-schedule-change-history) |
| **Hypothesis Link**  | —                                                                                        |

**Story:**
As **Sarah Chen** (with appropriate role) or **Jennifer Williams**, I want to **revert to a previous committed plan** in case a publish goes wrong, so that I can recover quickly.

**Acceptance Criteria:**

1. **Given** I have authority and a previous commit exists, **When** I click "Revert" on a history entry, **Then** a confirmation dialog enumerates impact (lots that would move, commits that would update) before proceeding.
2. **Given** I confirm, **When** the revert applies, **Then** the previous plan becomes Published and a new history entry is created (Revert is itself an event).

---

### DS-605 — Plan version state machine

| Field                | Value                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Epic**             | Compare & Commit                                                                                             |
| **Priority**         | Must (M)                                                                                                     |
| **Story Points**     | 5                                                                                                            |
| **Sprint**           | Sprint 1                                                                                                     |
| **Dependencies**     | —                                                                                                            |
| **Design Reference** | [Screen Flow §6 state diagram](../prototype/dynamic-schedule/03-screen-flow.md#6-plan-version-state-diagram) |
| **Hypothesis Link**  | —                                                                                                            |

**Story:**
As a **system integrator**, I want a **strict plan version state machine** (Draft → Simulation → Comparing → Published → Active → Archived/Discarded), so that only one plan is ever live and all other states are correctly tracked.

**Acceptance Criteria:**

1. **Given** plans exist in any state, **When** an action requests a transition, **Then** the transition is only allowed if it is in the legal set per [§6 state diagram](../prototype/dynamic-schedule/03-screen-flow.md#6-plan-version-state-diagram).
2. **Given** a Commit happens, **When** the new plan publishes, **Then** the previously-published plan transitions to Archived atomically (no gap where 2 plans are Published).
3. **Given** an AI-proposed plan is dismissed, **When** the user discards, **Then** the plan moves to Discarded with a 30-day retention before purge.

---

## Sub-Epic H — Background Tasks + Integrations

> The plumbing.

---

### DS-701 — Background tasks panel

| Field                | Value                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------ |
| **Epic**             | Background Tasks                                                                           |
| **Priority**         | Should (S)                                                                                 |
| **Story Points**     | 3                                                                                          |
| **Sprint**           | Sprint 4                                                                                   |
| **Dependencies**     | DS-001, DS-002                                                                             |
| **Design Reference** | [Background Tasks §C](../prototype/dynamic-schedule/02-right-panels.md#c-background-tasks) |
| **Hypothesis Link**  | —                                                                                          |

**Story:**
As **Sarah Chen**, I want a **Background Tasks panel** showing running jobs with progress + recent completions, so I know "is the AI still thinking" without staring at a spinner.

**Acceptance Criteria:**

1. **Given** background jobs run (replan, simulation, export, sync), **When** I open the panel, **Then** each running job shows: type, trigger, started-at, progress bar, ETA, cancel button.
2. **Given** a job completes successfully, **When** the result is ready, **Then** it appears in Recent with a quick result + action (Open in Compare, Download).
3. **Given** a job fails, **When** rendered, **Then** the entry shows the error category + a "View logs" action.

---

### DS-801 — SAP / Oracle PO sync integration

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | Integrations                                                                             |
| **Priority**         | Must (M)                                                                                 |
| **Story Points**     | 8                                                                                        |
| **Sprint**           | Sprint 1                                                                                 |
| **Dependencies**     | —                                                                                        |
| **Design Reference** | [Data Integration §7](../prototype/dynamic-schedule/01-main-views.md#7-data-integration) |
| **Hypothesis Link**  | H-04                                                                                     |

**Story:**
As **Sarah Chen** (via system integration), I want **active Production Orders to be auto-synced from SAP / Oracle ERP**, so I never re-key demand data.

**Acceptance Criteria:**

1. **Given** an ERP connector is configured, **When** the sync runs, **Then** all active POs (status: open / partially-fulfilled) are pulled with: PO#, customer, family, qty, priority, commitment milestones, master process flow link.
2. **Given** the sync completes, **When** the next replan runs, **Then** the engine uses the freshest data; **Given** an ERP field is missing, **Then** the data validation layer raises a HIGH alert and the PO is excluded.
3. **Given** the sync fails, **When** the failure persists > 5 min, **Then** the Data Integration view shows a Down status and Sarah receives a notification.

---

### DS-802 — Camstar / Promis MES sync (WIP + tool state)

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | Integrations                                                                             |
| **Priority**         | Must (M)                                                                                 |
| **Story Points**     | 8                                                                                        |
| **Sprint**           | Sprint 1                                                                                 |
| **Dependencies**     | —                                                                                        |
| **Design Reference** | [Data Integration §7](../prototype/dynamic-schedule/01-main-views.md#7-data-integration) |
| **Hypothesis Link**  | H-04                                                                                     |

**Story:**
As **Sarah Chen** (via system integration), I want **current WIP + tool state to be auto-synced from MES (Camstar / Promis)**, so the replan engine has the freshest fab state.

**Acceptance Criteria:**

1. **Given** the MES connector is configured, **When** events fire, **Then** the system receives near-real-time updates of: lot moves, tool state (Running / Down / PM / Engineering), chamber states.
2. **Given** an MES event implies a replan trigger (unplanned-down), **When** the event arrives, **Then** it propagates to the event router within 30 s.

---

### DS-803 — APC / SPC + yield feed

| Field                | Value                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Epic**             | Integrations                                                                             |
| **Priority**         | Must (M)                                                                                 |
| **Story Points**     | 5                                                                                        |
| **Sprint**           | Sprint 2                                                                                 |
| **Dependencies**     | —                                                                                        |
| **Design Reference** | [Data Integration §7](../prototype/dynamic-schedule/01-main-views.md#7-data-integration) |
| **Hypothesis Link**  | H-04                                                                                     |

**Story:**
As the **replan engine** (via SPC + yield feed), I want to **consume SPC alarms and probe-yield deltas in near-real-time**, so that yield-driven replans fire fast.

**Acceptance Criteria:**

1. **Given** APC / SPC and KLA Yield feeds are configured, **When** an out-of-control event fires, **Then** the event reaches the engine within 60 s (P95).
2. **Given** a probe-yield row is published, **When** it deviates ≥ 3σ from forecast, **Then** the engine raises a yield-excursion event for the replan router.

---

### DS-804 — Qualification matrix sync

| Field                | Value                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Epic**             | Integrations                                                                                   |
| **Priority**         | Must (M)                                                                                       |
| **Story Points**     | 5                                                                                              |
| **Sprint**           | Sprint 1                                                                                       |
| **Dependencies**     | —                                                                                              |
| **Design Reference** | [Shop Floor Capacity §4](../prototype/dynamic-schedule/01-main-views.md#4-shop-floor-capacity) |
| **Hypothesis Link**  | H-04                                                                                           |

**Story:**
As **Sarah Chen** (via integration), I want the **recipe × tool × chamber qualification matrix** to be synced from the qual database, so the optimizer never routes a lot to an unqualified tool.

**Acceptance Criteria:**

1. **Given** the qual database connector is configured, **When** the sync runs, **Then** every (recipe, tool, chamber) qualification record is loaded with status + expiry.
2. **Given** a qual expires within the 14-week horizon, **When** the engine detects it, **Then** a Recommendation (LOW or MED depending on impact) is raised.

---

### DS-805 — PM calendar sync

| Field                | Value                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Epic**             | Integrations                                                                                   |
| **Priority**         | Should (S)                                                                                     |
| **Story Points**     | 3                                                                                              |
| **Sprint**           | Sprint 3                                                                                       |
| **Dependencies**     | —                                                                                              |
| **Design Reference** | [Shop Floor Capacity §4](../prototype/dynamic-schedule/01-main-views.md#4-shop-floor-capacity) |
| **Hypothesis Link**  | —                                                                                              |

**Story:**
As **Sarah Chen** (via integration), I want **planned PM events to be synced from the Equipment Engineering calendar**, so they're respected by the baseline plan.

**Acceptance Criteria:**

1. **Given** the PM calendar connector is configured, **When** the sync runs, **Then** all planned PM events for the next 14 weeks are pulled.
2. **Given** the PM calendar is stale (> 24 hr), **When** Sarah opens Data Integration, **Then** the source shows a Stale status with last-sync timestamp.

---

## Sprint allocation summary

| Sprint       | Theme                               | Stories                                                                                | Points      |
| ------------ | ----------------------------------- | -------------------------------------------------------------------------------------- | ----------- |
| **Sprint 1** | Foundation: generate, view, sync    | DS-001, DS-201, DS-451, DS-454, DS-605, DS-801, DS-802, DS-804                         | 47          |
| **Sprint 2** | Replan engine + interactivity       | DS-002, DS-101, DS-103, DS-202, DS-203, DS-301, DS-304, DS-404, DS-452, DS-803         | 53          |
| **Sprint 3** | Decision support + commit           | DS-102, DS-204, DS-206, DS-302, DS-403, DS-453, DS-455, DS-601, DS-602, DS-603, DS-805 | 51          |
| **Sprint 4** | AI co-pilot + tuning                | DS-205, DS-303, DS-305, DS-401, DS-402, DS-456, DS-501, DS-502, DS-701                 | 36          |
| **Sprint 5** | Knowledge capture + advanced tuning | DS-104, DS-405, DS-503, DS-511                                                         | 19          |
| **Sprint 6** | Recovery + capacity workflow        | DS-512, DS-604                                                                         | 8           |
|              | **Total**                           |                                                                                        | **214 pts** |

(Capacity assumption: ~50 points per sprint with a 6-person SWAT team and 70% AI-assisted code targets — see [CLAUDE.md](../../CLAUDE.md) Principle 8. Adjust during grooming.)

---

## Definition of Done (epic-wide)

A story is **Done** when:

1. Acceptance criteria pass automated tests
2. Code review passed (per [CLAUDE.md](../../CLAUDE.md) standards)
3. AI-generated code is reviewed by a human owner (Principle 8 quality bar)
4. Constraint engine integration tested for any plan-mutating story
5. Explainability spine (DS-404) implemented for any AI-generated artifact
6. Audit log entry created for any plan-state transition
7. Documentation updated: data model, API contracts, screen reference
8. Manual planner walkthrough on the demo fab data set (target SUS ≥ 68 per Gate 2 criterion)

---

## Open backlog questions

1. **Frozen-zone defaults** — 72 h universal or fab-specific? (DS-101 / DS-104)
2. **AI auto-execute envelope** (T14 Pillar D progression) — should there be a Sprint-7 story for bounded auto-execute? Not in MVP; capture as DS-2xx future.
3. **Multi-fab support** — out of MVP per T14 §11. Story will be DS-9xx when needed.
4. **Tuning rejection feedback loop** — when a rejected tune fires again later, should the threshold auto-raise? Possible DS-504.
5. **BizDev integration depth** — DS-602 sends notifications; does BizDev need a write-back path for customer ack/reject? Likely fast-follow DS-7xx.
6. **Override capture richness** — DS-405 captures a single-line "why?". Should we tag dismissals with structured categories (e.g., "yield risk too high", "customer reason")? Refinement story.

---

_Status: Draft v1 — for SWAT grooming. After approval, decompose 8-pt and 13-pt stories before Sprint 1 starts._
