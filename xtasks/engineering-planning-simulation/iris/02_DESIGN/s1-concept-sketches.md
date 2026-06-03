# S1b: Concept Sketches — IRIS

> **AX Phase**: DESIGN | **Template**: T14 — Concept Sketch
> **Product**: IRIS — Intelligent Resources Information System
> **Customer**: Samsung Electronics — Device Solutions Research (DSR)
> **Date**: 2026-03-21
> **Author**: CXO (Chief Experience Officer) with AI assistance
> **Status**: Draft
> **Framework**: AX Transformation Framework v2.0.0
> **Source**: S1a HMW Ideation Workshop

---

## Document Purpose

This document contains 5 detailed concept sketches for the IRIS system. Each concept addresses one or more of the 5 validated problem statements from DISCOVER and maps to Samsung DSR's 12 explicit requirements. These concepts are **complementary modules** forming a unified platform — not competing alternatives. All 5 are selected for prototyping.

**IRIS is a NEW BUILD** — Mendix 10 + Oracle 19c + Elasticsearch 8.x + xDHTML Gantt + ECharts.js. These concepts are designed from scratch with Material Design 3 (Indigo #3F51B5, Roboto).

### CXO Design Philosophy

Three principles guide every concept sketch:

1. **Trust through transparency** — Users must see what changed, who changed it, and why. No opaque operations.
2. **Progressive disclosure** — Show the right information at the right depth. Never overwhelm on first contact.
3. **Safe exploration** — Users must feel safe to experiment (simulations, drafts) without fear of corrupting live data.

---

## Concept Index

| ID        | Concept Name                  | Primary PS | Primary Persona        | Samsung Req | Key Innovation                    |
| --------- | ----------------------------- | ---------- | ---------------------- | ----------- | --------------------------------- |
| CONCEPT-A | Real-Time Collaborative Gantt | PS-1       | Jisoo Park (Planner)   | 0, 3        | Trust-building merge flow         |
| CONCEPT-B | Simulation Sandbox            | PS-2, PS-1 | Jisoo Park, Minho Kim  | 1, 4        | Safe experimentation mental model |
| CONCEPT-C | Global Resource Cockpit       | PS-3       | Minho Kim, Soyeon Choi | 6, 7, 8, 9  | Progressive disclosure drill-down |
| CONCEPT-D | Smart Delta Engine            | PS-2, PS-5 | Jisoo Park, Minho Kim  | 1, 2, 4, 5  | Git-like version mental model     |
| CONCEPT-E | AI-Powered Analysis Builder   | PS-4       | Eunji Lee, Minho Kim   | 8, 10, 11   | Conversational analytics          |

---

## Persona Quick Reference

| Persona         | Role                    | Site        | Core Need                                                      |
| --------------- | ----------------------- | ----------- | -------------------------------------------------------------- |
| **Jisoo Park**  | Senior Resource Planner | Hwaseong HQ | Edit P/M plans concurrently, simulate scenarios, track changes |
| **Minho Kim**   | Planning Manager        | Pyeongtaek  | Cross-site visibility, approve changes, review diffs           |
| **Eunji Lee**   | Analytics Specialist    | Hwaseong HQ | On-demand multi-dimensional reports, AI-assisted insights      |
| **Soyeon Choi** | HR Portfolio Manager    | Hwaseong HQ | Headcount gaps, staffing actions across sites                  |

---

---

# CONCEPT-A: Real-Time Collaborative Gantt

## Metadata

| Field      | Value                                           |
| ---------- | ----------------------------------------------- |
| Project    | IRIS (Task 102)                                 |
| Product    | IRIS — Intelligent Resources Information System |
| Concept ID | CONCEPT-A                                       |
| Version    | v2.0                                            |
| Date       | 2026-03-21                                      |
| Author     | CXO with AI assistance                          |
| Status     | Selected                                        |

---

## Concept Overview

| Attribute    | Detail                                                                       |
| ------------ | ---------------------------------------------------------------------------- |
| Concept Name | Real-Time Collaborative Gantt                                                |
| Tagline      | "Google Docs for P/M Planning" — multiple planners, one plan, zero lost work |

---

## Problem Addressed

Senior Resource Planners at Samsung DSR cannot edit P/M plans simultaneously. PM Planner forces sequential work through exclusive file-level locking, causing email-based coordination overhead, version conflicts when one planner unknowingly overwrites another's changes, and planning cycle delays of 3-4 hours per planner per week. With 20+ planners across 5 global sites (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung), this bottleneck scales to hundreds of lost person-hours monthly. (Reference: PS-1, validated through Samsung DSR interviews)

---

## Target Persona

| Attribute         | Detail                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Persona Name      | Jisoo Park — Senior Resource Planner                                                         |
| Role              | Senior Resource Planner, Hwaseong HQ                                                         |
| Site              | Samsung DSR Hwaseong                                                                         |
| Key Need          | Edit P/M plans concurrently with colleagues without fear of data loss or overwrite conflicts |
| Secondary Persona | Minho Kim (Planning Manager, Pyeongtaek) — approves plans, reviews diffs before promotion    |

---

## Concept Description

The Real-Time Collaborative Gantt transforms P/M planning from a sequential, lock-based process into a simultaneous, multi-user editing experience modeled after Google Docs. Built as a custom xDHTML Gantt widget running on Mendix 10 with WebSocket real-time synchronization, it allows any number of planners to open and edit the same P/M plan at the same time.

When Jisoo opens a P/M plan for DRAM Dev, April 2026 at Hwaseong, she sees a monthly allocation grid rendered in the xDHTML Gantt widget. If her colleague Hyunwoo has the same plan open, Jisoo sees Hyunwoo's color-coded cursor (teal) and a subtle highlight on the cells he is actively editing. Each edit is broadcast instantly via WebSocket within 100ms. When Jisoo and Hyunwoo modify different employee rows, the auto-merge engine reconciles changes silently — no conflict, no interruption. When they both edit the same cell (e.g., both change Engineer Lee's DDR5 allocation for April), the system does NOT show a modal popup. Instead, it renders an **inline conflict resolution** directly within the Gantt: the conflicting cell expands to show both versions side-by-side with attribution ("Jisoo: 40%" | "Hyunwoo: 60%") and three resolution options. The planner who saved second resolves the conflict without leaving their editing context.

**Key UX Innovation: Trust-Building Merge Flow.** The critical design decision is that users see exactly what changed, by whom, and when — at all times. The activity feed sidebar, presence indicators, and inline conflict resolution all serve a single purpose: building trust that concurrent editing is safe. Users coming from PM Planner's lock-based model carry anxiety about data loss. Every visual cue in this concept is designed to replace that anxiety with confidence. The merge flow shows both versions, never silently overwrites, and always attributes changes to specific users.

The Draft/Permanent version flow provides an additional safety net: all edits save as Draft until a planner explicitly submits for manager approval. Minho reviews a color-coded diff (green/red/yellow) showing every change relative to the last approved version, then promotes to Permanent. This two-stage flow means concurrent editing never affects the official record until it has been reviewed.

---

## Key Features

| #   | Feature                        | Description                                                                                                                                                                                                                                                                                                                   | Priority |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Live Presence Indicators       | Color-coded cursors + name labels showing all active editors. Cell highlights show which cells are being actively edited by others. Colors auto-assigned from a palette (indigo, teal, amber, coral, violet) to distinguish up to 8 concurrent users.                                                                         | Must     |
| 2   | WebSocket Real-Time Sync       | Every cell edit is broadcast to all concurrent editors within 100ms via WebSocket. The Gantt widget updates in real-time without page refresh. Connection status indicator in the toolbar.                                                                                                                                    | Must     |
| 3   | Auto-Merge Engine              | When two planners save edits to different rows (different employee + project combinations), changes are merged automatically. No user intervention needed for 80%+ of concurrent edits. Silent merge with subtle toast confirmation.                                                                                          | Must     |
| 4   | Inline Conflict Resolution     | When the same cell (employee + project + period) is modified by two users, the conflicting cell expands inline to show both versions side-by-side within the Gantt row. No modal popup — the user stays in context. Three options: Keep Mine, Keep Theirs, Enter Custom Value. Attribution shows who set each value and when. | Must     |
| 5   | Diff Viewer Widget (W03)       | Side-by-side version comparison showing changes color-coded: green = added, red = removed, yellow = modified. Used for conflict resolution and manager approval review. Summary stats above the detail view.                                                                                                                  | Must     |
| 6   | Draft / Permanent Version Flow | Planners save as Draft. Manager approval promotes to Permanent. Draft versions are visible to the owning planner and the approving manager. Permanent versions are the official record. Approval workflow sends notification via Smart Notify.                                                                                | Must     |
| 7   | Activity Feed Sidebar          | Chronological feed showing who edited what, when. "Jisoo changed Kim Taeho's DDR5 allocation from 60% to 80% — 2 min ago." Collapsible sidebar on the right edge. Filterable by user and by change type.                                                                                                                      | Should   |
| 8   | Row-Level Soft Locking         | When a planner clicks into a row, a subtle lock icon appears for other users on that row. Non-blocking — other users can still edit but see the "being edited" indicator. Reduces conflict frequency without restricting access.                                                                                              | Should   |
| 9   | Approval Email Notification    | When a planner submits a Draft for approval, the designated Manager receives an email with a direct link to the plan and diff view. Smart Notify integration.                                                                                                                                                                 | Must     |
| 10  | Cell-Level Undo/Redo           | Per-user undo/redo stack. Undoing reverts the user's own last change, not other users' changes. Stack is maintained per WebSocket session.                                                                                                                                                                                    | Could    |

---

## User Flow

1. **Jisoo opens P/M Planner** — navigates to P/M Plans > Hwaseong > DRAM Dev > April 2026
2. **System loads the latest approved version** — V5 is displayed in the xDHTML Gantt widget. Jisoo's cursor appears as an indigo indicator. Connection status shows "Connected" (green dot)
3. **Hyunwoo opens the same plan** — Jisoo sees a teal cursor appear with "Hyunwoo" label. A toast notification: "Hyunwoo joined this plan." Activity feed logs the join event
4. **Both planners edit simultaneously** — Jisoo edits Kim Taeho's DDR5 allocation (row 12, April W1). Hyunwoo edits Park Minji's HBM4 allocation (row 7, April W1). Both see each other's changes appear in real-time with subtle animation
5. **Non-conflicting edits auto-merge** — different rows, different employees. System merges silently. Both see the merged result. Activity feed logs both changes with user attribution
6. **Conflict scenario** — Both edit Lee Jihoon's Exynos 2600 allocation for April W1. Jisoo sets 40%, Hyunwoo sets 60%. System detects conflict
7. **Inline conflict appears** — Hyunwoo (who saved second) sees the conflicting cell expand within the Gantt row: left panel shows "Jisoo: 40% (saved 5s ago)" and right panel shows "You: 60%". Three buttons appear below: "Keep Jisoo's (40%)", "Keep Mine (60%)", "Custom: \_\_\_\_%". No modal popup, no context switch
8. **Hyunwoo resolves** — selects "Keep Mine (60%)". The cell collapses back to normal size showing 60%. Activity feed logs: "Hyunwoo resolved conflict on Lee Jihoon / Exynos 2600 / Apr W1: kept 60% (over Jisoo's 40%)"
9. **Jisoo submits Draft for approval** — clicks "Submit for Approval". System creates a diff: V5 (previous approved) vs V6 (current draft). Smart Notify sends email to Manager Minho Kim with diff summary and direct link
10. **Minho reviews and approves** — opens the diff view from the email link. Sees all changes color-coded with summary stats: "3 employees modified, 12 cells changed." Clicks "Approve". V6 becomes Permanent. Delta sync to PROMIS triggered for changed projects only

---

## Sketch / Wireframe

### Screen 1: P/M Planner — Collaborative Gantt View

```
+------------------------------------------------------------------------------+
|  IRIS                                    [Factor Control: Hwaseong | DRAM Dev]|
|  [Home] [P/M Planner*] [Roadmap] [Simulation] [Analysis] [HC Portfolio]     |
+------------------------------------------------------------------------------+
|                                                                              |
|  P/M Plan: DRAM Dev — Hwaseong — April 2026              [V5 Approved]      |
|  +------------------------------------------------------------------------+ |
|  |  EDITORS: [● Jisoo] [● Hyunwoo]        ● Connected    [Save Draft]    | |
|  |                                                        [Submit ▶]      | |
|  +------------------------------------------------------------------------+ |
|                                                                              |
|  +------------------------------------------------------------------------+ |
|  | Employee      | Project     | Apr W1  | Apr W2  | Apr W3  | Apr W4  |T | |
|  |---------------|-------------|---------|---------|---------|---------|--| |
|  | Kim Taeho     | DDR5-Gen4   | [80%]●J |  80%    |  80%    |  80%    |80| |
|  |               | HBM4-Dev    |  20%    |  20%    |  20%    |  20%    |20| |
|  |---------------|-------------|---------|---------|---------|---------|--| |
|  | Park Minji    | HBM4-Dev    | [60%]●H |  60%    |  60%    |  60%    |60| |
|  |  ● Hyunwoo    | Exynos2600  |  40%    |  40%    |  40%    |  40%    |40| |
|  |---------------|-------------|---------|---------|---------|---------|--| |
|  | Lee Jihoon    | Exynos2600  | ⚠CONFLI |  50%    |  50%    |  50%    |  | |
|  |               |             | CT      |         |         |         |  | |
|  |               |             |+------+------+|                       |  | |
|  |               |             ||J: 40%|H: 60%||                       |  | |
|  |               |             |+------+------+|                       |  | |
|  |               |             |[Keep J][Keep H]|                      |  | |
|  |               |             |[Custom: ___% ]|                       |  | |
|  |               | NAND-V9     |  50%    |  50%    |  50%    |  50%    |50| |
|  |---------------|-------------|---------|---------|---------|---------|--| |
|  | Choi Yuna     | DDR5-Gen4   |  70%    |  70%    |  70%    |  70%    |70| |
|  |               | ISOCELL-HP3 |  30%    |  30%    |  30%    |  30%    |30| |
|  +------------------------------------------------------------------------+ |
|                                                                              |
|  ●J = Jisoo editing (indigo)    ●H = Hyunwoo editing (teal)                 |
|  ⚠ = Inline conflict (both versions shown within the Gantt row)             |
|                                                                              |
|  +---Activity Feed (collapsible sidebar)---+                                 |
|  | ⚠ Conflict: Lee Jihoon / Exynos / W1   |                                 |
|  |   Jisoo: 40% vs Hyunwoo: 60%           |                                 |
|  |   Awaiting resolution — just now        |                                 |
|  |                                          |                                |
|  | Hyunwoo changed Park Minji               |                                |
|  | HBM4 Apr W1: 50% -> 60%                 |                                |
|  | 30 sec ago                               |                                |
|  |                                          |                                |
|  | Jisoo changed Kim Taeho                  |                                |
|  | DDR5 Apr W1: 70% -> 80%                 |                                |
|  | 2 min ago                                |                                |
|  |                                          |                                |
|  | Hyunwoo joined this plan                 |                                |
|  | 5 min ago                                |                                |
|  +------------------------------------------+                                |
+------------------------------------------------------------------------------+
```

### Screen 2: Inline Conflict Resolution (Detail View)

```
+------------------------------------------------------------------------------+
|  INLINE CONFLICT — within the Gantt row, no modal overlay                    |
|                                                                              |
|  Normal Gantt row:                                                           |
|  | Lee Jihoon | Exynos2600 | 50% | 50% | 50% | 50% |                       |
|                                                                              |
|  During conflict, the Apr W1 cell expands:                                   |
|  | Lee Jihoon | Exynos2600 | +------------------+ | 50% | 50% | 50% |      |
|  |            |            | | ⚠ Apr W1 Conflict | |     |     |     |      |
|  |            |            | |                    | |     |     |     |      |
|  |            |            | | Jisoo    | You     | |     |     |     |      |
|  |            |            | | 40%      | 60%     | |     |     |     |      |
|  |            |            | | (5s ago) | (now)   | |     |     |     |      |
|  |            |            | |                    | |     |     |     |      |
|  |            |            | | [Keep    [Keep     | |     |     |     |      |
|  |            |            | |  Jisoo's] Mine]   | |     |     |     |      |
|  |            |            | | [Custom: ____% ]  | |     |     |     |      |
|  |            |            | +------------------+ |     |     |     |      |
|                                                                              |
|  After resolution, cell collapses back to normal:                            |
|  | Lee Jihoon | Exynos2600 | 60% ✓ | 50% | 50% | 50% |                     |
|  (✓ indicator fades after 3 seconds)                                         |
+------------------------------------------------------------------------------+
```

### Screen 3: Manager Approval Diff View (Minho's View)

```
+------------------------------------------------------------------------------+
|  Version Comparison: V5 (Approved) vs V6 (Pending Approval)                 |
|  Submitted by: Jisoo Park | Date: 2026-04-15 14:32                          |
|  Editors who contributed: Jisoo Park, Hyunwoo Choi                           |
+------------------------------------------------------------------------------+
|                                                                              |
|  Summary: 3 employees modified | 1 conflict resolved | 12 cells changed     |
|                                                                              |
|  +--- V5 (Current Approved) ----+  +--- V6 (Pending) -------------------+  |
|  | Kim Taeho / DDR5 / Apr W1    |  | Kim Taeho / DDR5 / Apr W1         |  |
|  | 70%                          |  | [80%]  (MODIFIED +10%) by Jisoo   |  |
|  |                              |  |                                    |  |
|  | Park Minji / HBM4 / Apr W1  |  | Park Minji / HBM4 / Apr W1       |  |
|  | 50%                          |  | [60%]  (MODIFIED +10%) by Hyunwoo |  |
|  |                              |  |                                    |  |
|  | Lee Jihoon / Exynos / Apr W1 |  | Lee Jihoon / Exynos / Apr W1     |  |
|  | 50%                          |  | [60%]  (MODIFIED +10%) by Hyunwoo |  |
|  |                              |  |   ⓘ Conflict resolved: Jisoo 40%  |  |
|  |                              |  |     vs Hyunwoo 60% → kept 60%     |  |
|  +------------------------------+  +------------------------------------+  |
|                                                                              |
|  Legend: [Green] Added  [Red] Removed  [Yellow] Modified                     |
|  ⓘ = Conflict resolution occurred (click to see resolution history)          |
|                                                                              |
|                    [Approve]  [Reject with Comment]                           |
+------------------------------------------------------------------------------+
```

---

## Component Inventory

| Component Type    | Name                    | Description                                                       |
| ----------------- | ----------------------- | ----------------------------------------------------------------- |
| **Mendix Page**   | PMPlanner_Gantt         | Main P/M planning page with xDHTML Gantt widget                   |
| **Mendix Page**   | PMPlanner_ApprovalDiff  | Manager diff review page                                          |
| **Custom Widget** | xDHTML Gantt (W01)      | Gantt grid for allocation editing, extended for real-time cursors |
| **Custom Widget** | Diff Viewer (W03)       | Side-by-side version comparison                                   |
| **Module**        | WebSocket Sync (M20)    | Real-time broadcast of cell edits, presence, conflicts            |
| **Module**        | Auto-Merge Engine (M21) | Conflict detection and silent merge for non-conflicting edits     |
| **Module**        | Version Engine (M03)    | Draft/Permanent lifecycle, version snapshots                      |
| **Module**        | Approval Workflow (M04) | Submit/Approve/Reject flow with Smart Notify                      |
| **Data Source**   | Oracle 19c              | PMPlan, PMPlanVersion, PMEntry entities                           |
| **Data Source**   | In-Memory Cache         | Real-time edit state (not persisted until save)                   |

---

## Data Requirements

| Entity / Index | Purpose                                                                                                  | Storage    |
| -------------- | -------------------------------------------------------------------------------------------------------- | ---------- |
| PMPlan         | Plan header: site, department, period, status                                                            | Oracle 19c |
| PMPlanVersion  | Version snapshot: version number, state (Draft/Pending/Approved/Archived), creator, approver, timestamps | Oracle 19c |
| PMEntry        | Individual allocation record: employee_id, project_id, period, percentage, hours                         | Oracle 19c |
| PMConflictLog  | Conflict resolution audit: cell key, user_a value, user_b value, resolution, resolver, timestamp         | Oracle 19c |
| EditSession    | Active WebSocket sessions: user_id, plan_id, cursor_position, connected_at                               | In-Memory  |

---

## Technical Feasibility Notes

| Aspect                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feasibility           | Medium — WebSocket + conflict resolution is complex but well-proven (Google Docs, Figma). Mendix 10 supports custom widgets with full JavaScript capability for WebSocket integration.                                                                                                                                                                                                                                                                                                   |
| Key Dependencies      | xDHTML Gantt widget (W01) for Mendix with custom cursor rendering extension, WebSocket infrastructure in Mendix Runtime, Diff Viewer widget (W03), Version Engine module (M03)                                                                                                                                                                                                                                                                                                           |
| Known Technical Risks | (1) WebSocket scalability with 20+ concurrent editors on one plan — mitigate with message batching and debouncing. (2) OT/CRDT algorithm complexity for cell-level conflict resolution — use last-write-wins for auto-merge, explicit resolution for same-cell conflicts. (3) xDHTML Gantt's native API may need extension for inline conflict rendering (expandable rows). (4) Network latency between global sites (Hwaseong-Austin: ~150ms) — design UI to tolerate 200ms round-trip. |
| Mendix 10 Constraints | Custom widgets must use React-based pluggable widget API. WebSocket connections managed outside Mendix Runtime — requires custom Java action for server-side WebSocket handling. Session management must integrate with Mendix user context.                                                                                                                                                                                                                                             |
| Estimated Effort      | 4-6 sprints for MVP concurrent editing + inline conflict resolution. 2 additional sprints for activity feed and advanced merge strategies.                                                                                                                                                                                                                                                                                                                                               |

---

## CXO Design Principles Applied

| Principle                      | How It Manifests                                                                                                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trust through transparency** | Every change is attributed to a specific user. The activity feed provides a complete audit trail. Conflict resolution shows both versions with full context — no silent overwrites, ever.                   |
| **Progressive disclosure**     | Presence indicators are subtle (colored dots). Conflict resolution expands inline only when needed. Activity feed is collapsible. The default state is clean and focused.                                   |
| **Safe exploration**           | Draft/Permanent flow means nothing touches the official record until a manager approves. Undo/redo per user provides a personal safety net. The mental model is: "your edits are always safe."              |
| **Inline over modal**          | Conflict resolution happens within the Gantt row, not in a modal dialog. This keeps the user in their editing flow and preserves spatial context — the user sees the conflict next to the surrounding data. |
| **Attribution everywhere**     | Every cell change, every conflict resolution, every version submission carries the name and timestamp of the person who made it. This builds accountability and trust in a multi-user environment.          |

---

## Open Questions for Concept Validation (S3)

1. **Conflict frequency**: How often do two Samsung DSR planners actually edit the same employee/project/period cell? If conflict rate is <5%, inline resolution may be over-designed — validate with real editing session observation.
2. **Maximum concurrent editors**: Samsung states 20+ planners, but how many work on the same plan at the same time? Validate to size the WebSocket infrastructure.
3. **Latency tolerance**: Will planners at Austin (150ms from Hwaseong) find 200ms round-trip acceptable? Validate with latency simulation prototype.
4. **Inline expansion UX**: Does the expanding cell for conflict resolution feel intuitive, or do users expect a separate panel? Test with 5+ Samsung planners in usability session.
5. **Activity feed usage**: Will planners actually read the activity feed, or will they ignore it? Consider whether a simpler "last edit by" indicator per cell would suffice.

---

## Evaluation Criteria

| Criterion                    | Score (1-5) | Rationale                                                                                                                                                                           |
| ---------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desirability (user value)    | 5           | Directly solves the #1 pain point (PS-1). Eliminates 3-4 hrs/week of coordination per planner. Inline conflict resolution is a significant UX improvement over modal dialogs.       |
| Feasibility (technical)      | 3           | WebSocket + OT is proven but requires significant custom widget development. Inline conflict rendering in xDHTML Gantt needs API extension.                                         |
| Viability (business)         | 5           | Samsung Req 3 explicitly requires concurrent save, auto-merge, conflict resolution. Non-negotiable for acceptance.                                                                  |
| Innovation                   | 5           | Google Docs model with inline conflict resolution (not modal) applied to resource planning Gantt is novel in this domain. Trust-building merge flow is a differentiated UX pattern. |
| Alignment with AX Principles | 5           | User-first design validated through research. Hypothesis: concurrent editing reduces planning cycle time by 50%+.                                                                   |
| **Total**                    | **23/25**   |                                                                                                                                                                                     |

---

## Decision

| Attribute | Detail                                                                                                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status    | **Selected** — proceed to prototype                                                                                                                                                                                                                     |
| Rationale | Highest-scoring concept (23/25). Directly addresses Samsung's explicit Req 3. Core daily workflow for primary persona (Jisoo). Inline conflict resolution is the key CXO differentiator vs. the CEO/CPO v1.0 concept sketch (which used modal dialogs). |
| Next Step | S2 Prototype — design P/M Planner Gantt View with inline conflict resolution in detail                                                                                                                                                                  |

---

---

# CONCEPT-B: Simulation Sandbox

## Metadata

| Field      | Value                                           |
| ---------- | ----------------------------------------------- |
| Project    | IRIS (Task 102)                                 |
| Product    | IRIS — Intelligent Resources Information System |
| Concept ID | CONCEPT-B                                       |
| Version    | v2.0                                            |
| Date       | 2026-03-21                                      |
| Author     | CXO with AI assistance                          |
| Status     | Selected                                        |

---

## Concept Overview

| Attribute    | Detail                                                               |
| ------------ | -------------------------------------------------------------------- |
| Concept Name | Simulation Sandbox                                                   |
| Tagline      | "Clone, play, compare, decide" — risk-free what-if resource planning |

---

## Problem Addressed

Samsung DSR planners have no way to test alternative resource allocation strategies without modifying live roadmap data. PM Planner lacks simulation capability entirely — planners resort to Excel copies for "what-if" analysis, which is error-prone, disconnected from source data, and untraceable. When a planner wants to evaluate shifting 5 engineers from NAND V9 to HBM4, they must manually copy hundreds of rows to Excel, modify them, and then manually compare. This process takes hours and produces no auditable record. Additionally, version history is tracked at the roadmap level, not per-project, making it impossible to see cascading impacts. (Reference: PS-2, PS-1)

---

## Target Persona

| Attribute         | Detail                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| Persona Name      | Jisoo Park — Senior Resource Planner                                                                 |
| Role              | Senior Resource Planner, Hwaseong HQ                                                                 |
| Site              | Samsung DSR Hwaseong                                                                                 |
| Key Need          | Test "what-if" resource reallocation scenarios without affecting the approved roadmap                |
| Secondary Persona | Minho Kim (Planning Manager, Pyeongtaek) — reviews simulation results, approves promotion to roadmap |

---

## Concept Description

The Simulation Sandbox is an isolated environment where planners create clones of approved roadmap versions and freely modify them to explore alternative resource allocation strategies. Samsung DSR manages 50+ active projects across 5 global sites, and resource reallocation decisions (e.g., shifting engineers from legacy NAND to next-gen HBM4) have cascading effects that are impossible to evaluate mentally.

**Key UX Innovation: Safe Experimentation Mental Model.** The entire sandbox experience is designed around one principle: the user must feel absolutely safe to make bold changes. Every visual cue reinforces this. The persistent amber banner ("SIMULATION MODE — changes do not affect the approved roadmap") is always visible. The variant system (V1, V2, V3) encourages multiple explorations — not just one careful attempt. The comparison dashboard presents results objectively without forcing a decision. And the "Discard Simulation" option is always one click away with no guilt — discarding is a valid outcome that means the experiment worked (it revealed that the change is not worth making).

The clone-from-roadmap wizard is intentionally simple: (1) select source roadmap version, (2) name the scenario, (3) enter sandbox. Three steps, no configuration. The wizard shows the source data dimensions (52 projects, 187 employees, 2,340 allocations) so the user understands what they are cloning, but the system handles the deep clone transparently. Once inside the sandbox, the editing experience is identical to the P/M Planner Gantt (Concept A) — same xDHTML Gantt widget, same interaction patterns — but with the amber simulation banner and variant controls replacing the draft/approval controls.

The comparison view is the analytical core. Jisoo selects two or more variants to compare. The system renders: (1) a Gantt overlay showing the baseline roadmap (gray) alongside the simulation variant (colored), (2) ECharts grouped bar charts showing headcount by project before/after, (3) a delta table listing every change with numeric impact. This multi-format comparison lets visual thinkers and data-oriented thinkers both make informed decisions.

If a simulation proves optimal, it can be promoted as a new Roadmap Draft version for manager approval — closing the loop from exploration to action.

---

## Key Features

| #   | Feature                      | Description                                                                                                                                                                                                            | Priority |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Clone-from-Roadmap Wizard    | Three-step wizard: select source version, name scenario, enter sandbox. Deep clone of all project allocations, employee assignments, and timelines. Shows source dimensions before cloning.                            | Must     |
| 2   | Simulation Mode Banner       | Persistent amber banner at top of screen: "SIMULATION MODE — changes do not affect the approved roadmap." Always visible, cannot be dismissed. Reinforces safe experimentation.                                        | Must     |
| 3   | Gantt Editing in Isolation   | Full editing capability using xDHTML Gantt — same widget as P/M Planner. Changes affect only the simulation, never the source roadmap.                                                                                 | Must     |
| 4   | Multi-Variant Management     | Create multiple variants from the same simulation (V1, V2, V3). Each explores a different scenario. Variant selector dropdown with key metrics per variant. "New Variant" clones from any existing variant.            | Must     |
| 5   | Gantt Overlay Comparison     | Overlay view: source roadmap rendered in gray (baseline) with simulation variant overlaid in color. Delta bars show where allocations differ. Toggle between overlay and side-by-side layouts.                         | Must     |
| 6   | ECharts Comparison Dashboard | Grouped bar charts: headcount by project (baseline vs variants). Utilization by department. Staffing gap changes. Color-coded by variant. ECharts.js interactive with tooltips.                                        | Must     |
| 7   | Delta Table                  | Tabular diff of all differences: employee, project, period, baseline value, variant value, delta. Sortable, filterable, exportable to Excel. Summary row with totals.                                                  | Should   |
| 8   | Variant Diff                 | Compare two simulation variants against each other (not just against baseline). Useful when evaluating V2 vs V3 to see the incremental difference of moving 5 vs 8 engineers.                                          | Should   |
| 9   | Promote-to-Roadmap           | One-click promotion of selected variant as new Roadmap Draft. Triggers approval workflow (Concept D). Confirmation dialog shows what will be promoted.                                                                 | Should   |
| 10  | Impact Indicators            | Visual indicators in the Gantt showing cascading effects: if engineers are removed from NAND V9, those project rows show capacity warnings (orange at 85-95%, red at >95%). Real-time recalculation as edits are made. | Should   |
| 11  | Simulation Archive           | Completed simulations are archived (not deleted) for reference. "Past Simulations" list shows date, scenario name, outcome (promoted / discarded), key metrics.                                                        | Could    |

---

## User Flow

1. **Jisoo opens Resource Roadmap** — navigates to Roadmap > Hwaseong > Memory BU > FY2026
2. **Views current approved version** — V6, showing 52 projects with resource allocations in xDHTML Gantt
3. **Clicks "Create Simulation"** — wizard opens with three steps
4. **Step 1: Source** — "Source: Roadmap V6 (Approved 2026-03-10) | 52 projects | 187 employees | 2,340 allocations." Pre-filled, confirm with Next
5. **Step 2: Name** — enters "HBM4 Acceleration — 5 Engineers from NAND V9." Optional description: "Evaluate impact of moving 5 process engineers from NAND V9 to HBM4 Development starting Q3 2026"
6. **Step 3: Confirm** — clicks "Create Simulation." System performs deep clone. Loading indicator: "Cloning 2,340 allocation records..."
7. **Sandbox opens** — amber banner: "SIMULATION MODE — changes do not affect the approved roadmap." Variant selector shows "V1 (baseline clone)"
8. **Jisoo modifies allocations** — moves 5 engineers from NAND V9 to HBM4. NAND V9 rows show orange capacity warning (utilization jumps to 92%). Saves as V2
9. **Creates another variant** — clicks "New Variant from V2." V3 opens. Moves 3 additional engineers (8 total). NAND V9 shows red warning (98%)
10. **Opens comparison dashboard** — clicks "Compare." Selects: Roadmap V6 (baseline) vs V2 (5 eng) vs V3 (8 eng)
11. **Reviews Gantt overlay** — baseline (gray bars) with V2 overlaid (indigo bars). HBM4 bars are longer in V2; NAND V9 bars are shorter
12. **Reviews ECharts dashboard** — grouped bar chart: HBM4 headcount V6=10, V2=15, V3=18. NAND utilization V6=85%, V2=92%, V3=98%
13. **Reviews delta table** — 5 employee rows changed in V2, 8 in V3. Sorts by "Impact" column to see highest-risk changes
14. **Selects V2 as preferred** — 5-engineer move balances acceleration with manageable risk. Clicks "Promote to Roadmap"
15. **Confirmation dialog** — "Promote Simulation V2 as Roadmap V7 (Draft)? This will create a new roadmap draft for manager approval. The simulation will be archived." Confirms
16. **System creates Roadmap V7 (Draft)** — triggers approval workflow for Manager Minho. Simulation archived with outcome "Promoted to V7"

---

## Sketch / Wireframe

### Screen 1: Clone-from-Roadmap Wizard

```
+--------------------------------------------------------------+
|           Create Simulation from Roadmap                      |
+--------------------------------------------------------------+
|                                                              |
|  Step [1]——[2]——[3]                                         |
|       Source  Name  Confirm                                  |
|                                                              |
|  SOURCE ROADMAP                                              |
|  ┌────────────────────────────────────────────────┐          |
|  │ Resource Roadmap — Hwaseong — Memory BU — FY2026│          |
|  │ Version: V6 (Approved 2026-03-10)               │          |
|  │                                                  │          |
|  │ Projects:     52                                 │          |
|  │ Employees:    187                                │          |
|  │ Allocations:  2,340                              │          |
|  └────────────────────────────────────────────────┘          |
|                                                              |
|  SCENARIO NAME                                               |
|  [HBM4 Acceleration — 5 Engineers from NAND V9______]       |
|                                                              |
|  DESCRIPTION (optional)                                      |
|  [Evaluate impact of moving 5 process engineers from  ]      |
|  [NAND V9 to HBM4 Development starting Q3 2026       ]      |
|                                                              |
|                           [Cancel]  [Create Simulation ▶]    |
+--------------------------------------------------------------+
```

### Screen 2: Simulation Sandbox — Gantt Editing

```
+------------------------------------------------------------------------------+
|  IRIS > Simulation > HBM4 Acceleration — 5 Engineers                        |
+------------------------------------------------------------------------------+
|  ┌──────────────────────────────────────────────────────────────────────┐    |
|  │ ⚠ SIMULATION MODE — Changes do not affect the approved roadmap      │    |
|  └──────────────────────────────────────────────────────────────────────┘    |
|                                                                              |
|  Variant: [V2 (5 eng move) ▼]   Source: Roadmap V6                          |
|  [New Variant]  [Compare ▶]  [Promote to Roadmap]  [Discard]               |
|                                                                              |
|  +------------------------------------------------------------------------+ |
|  | Project / Employee  | Jul 26 | Aug 26 | Sep 26 | Oct 26 | Nov 26 |Util| |
|  |---------------------|--------|--------|--------|--------|--------|----| |
|  | HBM4 Development ▲  |████████████████████████████████████████████| 85%| |
|  |  Kim Taeho          |        |        | [80%]  | [80%]  | [80%]  |    | |
|  |  Park Minji         |        |        | [60%]  | [60%]  | [60%]  |    | |
|  |  Lee Naeun  (moved) |        |        | [70%]  | [70%]  | [70%]  |    | |
|  |  Kang Siwoo (moved) |        |        | [50%]  | [50%]  | [50%]  |    | |
|  |  Yoon Daeho (moved) |        |        | [40%]  | [40%]  | [40%]  |    | |
|  |---------------------|--------|--------|--------|--------|--------|----| |
|  | NAND V9 ⚠ REDUCED   |████████████████████████████████████        | 92%| |
|  |  ⚠ Capacity at risk |        |        |        |        |        |    | |
|  |  Kim Taeho          | [80%]  | [80%]  |  ---   |  ---   |  ---   |    | |
|  |  Park Minji         | [60%]  | [60%]  |  ---   |  ---   |  ---   |    | |
|  |  Remaining: 20 eng  | [avg]  | [avg]  | [avg]  | [avg]  | [avg]  |    | |
|  |  ⚠ 92% utilization — remaining team is stretched                  |    | |
|  +------------------------------------------------------------------------+ |
|                                                                              |
|  Impact Summary: HBM4 +5 engineers (Q3-Q4) | NAND V9 -5 engineers (Q3-Q4)  |
|  Risk Assessment: NAND V9 at 92% utilization — medium risk                  |
+------------------------------------------------------------------------------+
```

### Screen 3: Simulation Comparison Dashboard

```
+------------------------------------------------------------------------------+
|  Simulation Comparison: Roadmap V6 vs V2 (5 eng) vs V3 (8 eng)             |
+------------------------------------------------------------------------------+
|                                                                              |
|  +--- Gantt Overlay (V6 baseline gray, V2 indigo) -----------------------+ |
|  | Project    | Jul 26 | Aug 26 | Sep 26 | Oct 26 | Nov 26 | Dec 26     | |
|  |------------|--------|--------|--------|--------|--------|-------------|  |
|  | HBM4 Dev   | ░░░░░░ | ░░░░░░ | ░░░░░░ | ░░░░░░ | ░░░░░░ | ░░░░░░    | |
|  |            |        |        | ██████ | ██████ | ██████ | ██████     | |
|  | NAND V9    | ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░          | |
|  |            | ████████████████████████████████████████                  | |
|  |            | ░ = V6 baseline (gray)   █ = V2 simulation (indigo)      | |
|  +------------------------------------------------------------------------+ |
|                                                                              |
|  +--- Headcount by Project ----+  +--- Utilization by Project -----------+  |
|  |  (ECharts grouped bar)      |  |  (ECharts grouped bar)               |  |
|  |                             |  |                                       |  |
|  |  HBM4:  ░10 █15 ▓18        |  |  HBM4:  ░72% █85% ▓92%              |  |
|  |  NAND:  ░25 █20 ▓17        |  |  NAND:  ░85% █92% ▓98%⚠             |  |
|  |  DDR5:  ░18 █18 ▓18        |  |  DDR5:  ░78% █78% ▓78%              |  |
|  |  Exynos: ░12 █12 ▓12       |  |  Exynos: ░81% █81% ▓81%             |  |
|  |                             |  |                                       |  |
|  |  ░ V6  █ V2  ▓ V3          |  |  ░ V6  █ V2  ▓ V3                    |  |
|  +-----------------------------+  +---------------------------------------+  |
|                                                                              |
|  +--- Delta Table --------------------------------------------------------+ |
|  | Metric             | Roadmap V6 | V2 (5 eng)   | V3 (8 eng)           | |
|  |--------------------|------------|--------------|----------------------| |
|  | Total Headcount    | 187        | 187          | 187                  | |
|  | HBM4 Engineers     | 10         | 15 (+5) ▲    | 18 (+8) ▲▲           | |
|  | NAND V9 Engineers  | 25         | 20 (-5) ▼    | 17 (-8) ▼▼           | |
|  | NAND V9 Util %     | 85%        | 92% ⚠        | 98% ⚠⚠ CRITICAL     | |
|  | HBM4 Timeline      | Q1 2027    | Q4 2026 ✓    | Q3 2026 ✓✓           | |
|  | Risk Level         | Low        | Medium        | High                 | |
|  +---------------------------------------------------------------------+   |
|                                                                              |
|  CXO Note: V2 balances acceleration with manageable risk. V3 delivers       |
|  faster HBM4 timeline but NAND V9 at 98% is a burnout/delay risk.           |
|                                                                              |
|  [Promote V2 to Roadmap ▶]  [Export Comparison]  [Back to Sandbox]          |
+------------------------------------------------------------------------------+
```

---

## Component Inventory

| Component Type    | Name                     | Description                                                 |
| ----------------- | ------------------------ | ----------------------------------------------------------- |
| **Mendix Page**   | Simulation_Wizard        | Three-step clone wizard                                     |
| **Mendix Page**   | Simulation_Gantt         | Sandbox editing environment with xDHTML Gantt               |
| **Mendix Page**   | Simulation_Compare       | Multi-variant comparison dashboard                          |
| **Custom Widget** | xDHTML Gantt (W01)       | Same Gantt widget as P/M Planner, reused in sandbox context |
| **Custom Widget** | ECharts Comparison (W02) | Grouped bar charts, Gantt overlay rendering                 |
| **Module**        | Simulation Engine (M12)  | Deep clone, variant management, promote-to-roadmap          |
| **Module**        | Version Engine (M03)     | Version snapshots for simulation variants                   |
| **Module**        | Comparison Engine (M14)  | Delta calculation between baseline and variants             |
| **Data Source**   | Oracle 19c               | ResourceSimulation, SimulationVersion, SimulationAllocation |
| **Data Source**   | Elasticsearch 8.x        | iris-simulation-result index for analytical comparison      |

---

## Data Requirements

| Entity / Index         | Purpose                                                                                   | Storage           |
| ---------------------- | ----------------------------------------------------------------------------------------- | ----------------- |
| ResourceSimulation     | Simulation header: name, description, source_roadmap_version, status, created_by          | Oracle 19c        |
| SimulationVersion      | Variant: version number (V1, V2, V3), parent_version, created_at                          | Oracle 19c        |
| SimulationAllocation   | Cloned allocation records: employee_id, project_id, period, percentage, hours             | Oracle 19c        |
| iris-simulation-result | Pre-computed aggregations for comparison dashboard: by project, by department, by variant | Elasticsearch 8.x |

---

## Technical Feasibility Notes

| Aspect                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feasibility           | Medium — deep clone of roadmap data (2,000+ allocation records) requires careful Oracle transaction management. Side-by-side comparison requires dual-query to ES.                                                                                                                                                                                                                                                                            |
| Key Dependencies      | Version Engine (M03) for simulation versioning, xDHTML Gantt (W01) for editing, ECharts (W02) for comparison charts, Elasticsearch for MDA on simulation data                                                                                                                                                                                                                                                                                 |
| Known Technical Risks | (1) Deep clone performance for large roadmaps (500+ projects) — mitigate with batch insert and progress indicator. (2) Storage growth from multiple simulation variants — mitigate with archival policy (auto-archive after 90 days). (3) Comparison UI complexity when comparing 3+ variants — cap at 3 variants in comparison view, use tabs for more. (4) Gantt overlay rendering requires custom ECharts extension to layer two datasets. |
| Mendix 10 Constraints | Deep clone must use Mendix batch processing to avoid transaction timeout. Simulation data should be in a separate database schema for isolation. Variant management uses Mendix association chains (Simulation -> Version -> Allocation).                                                                                                                                                                                                     |
| Estimated Effort      | 3-4 sprints for core clone + edit + compare. 2 additional sprints for promote-to-roadmap and advanced comparison dashboards.                                                                                                                                                                                                                                                                                                                  |

---

## CXO Design Principles Applied

| Principle                      | How It Manifests                                                                                                                                                                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Safe experimentation**       | The amber simulation banner, the "Discard" button, the variant system — every element communicates "you cannot break anything." This is the primary CXO principle for this concept. Planners coming from PM Planner (where every edit is permanent) need explicit reassurance. |
| **Progressive disclosure**     | The wizard starts simple (3 steps). Comparison starts with high-level metrics (grouped bars) before the detail (delta table). Impact indicators appear only when utilization crosses thresholds.                                                                               |
| **Trust through transparency** | The delta table shows every change with numeric precision. The Gantt overlay lets visual thinkers see spatial differences. No black-box "recommendations" — the data speaks for itself.                                                                                        |
| **Encourage exploration**      | Multi-variant support (V1, V2, V3) encourages trying multiple scenarios. "New Variant" is always one click away. Archiving past simulations preserves institutional knowledge.                                                                                                 |

---

## Open Questions for Concept Validation (S3)

1. **Clone performance**: How long does it take to deep-clone 2,340 allocation records? Is 3-5 seconds acceptable, or do users expect instant? Validate with prototype.
2. **Variant limit**: Should we cap variants at 5 per simulation, or allow unlimited? Validate with Samsung planners — how many scenarios do they typically explore?
3. **Comparison format preference**: Do Samsung planners prefer the Gantt overlay (visual), the grouped bar charts (analytical), or the delta table (precise)? Test all three in usability session.
4. **Promote confidence**: Are planners comfortable promoting a simulation to a roadmap draft, or do they want an intermediate review step? Validate with approval workflow design.
5. **Collaborative simulation**: Should multiple planners be able to edit the same simulation simultaneously (reusing Concept A's WebSocket infrastructure)? Or is simulation inherently a single-user activity?

---

## Evaluation Criteria

| Criterion                    | Score (1-5) | Rationale                                                                                                                                                    |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Desirability (user value)    | 4           | High value for strategic planning decisions. Used weekly/monthly, not daily. Safe experimentation mental model is a significant UX improvement.              |
| Feasibility (technical)      | 3           | Deep clone and comparison logic are complex but deterministic. ES aggregations handle MDA well. Gantt overlay requires custom rendering.                     |
| Viability (business)         | 4           | Samsung Req 1 explicitly requires separate Roadmap and Simulation with version history.                                                                      |
| Innovation                   | 5           | Git-branch model applied to resource planning with visual comparison and safe experimentation framing is novel. No competitive tool offers this combination. |
| Alignment with AX Principles | 4           | Data-driven decision making. Hypothesis: simulation capability reduces bad reallocation decisions by 40%+.                                                   |
| **Total**                    | **20/25**   |                                                                                                                                                              |

---

## Decision

| Attribute | Detail                                                                                                                                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status    | **Selected** — proceed to prototype                                                                                                                                                                                              |
| Rationale | Directly addresses Samsung Req 1 and Req 4. Critical for strategic planning decisions. Safe experimentation mental model is a key CXO differentiator. Builds on Version Engine (Concept D) and Gantt infrastructure (Concept A). |
| Next Step | S2 Prototype — design Simulation Wizard and Comparison Dashboard in detail                                                                                                                                                       |

---

---

# CONCEPT-C: Global Resource Cockpit

## Metadata

| Field      | Value                                           |
| ---------- | ----------------------------------------------- |
| Project    | IRIS (Task 102)                                 |
| Product    | IRIS — Intelligent Resources Information System |
| Concept ID | CONCEPT-C                                       |
| Version    | v2.0                                            |
| Date       | 2026-03-21                                      |
| Author     | CXO with AI assistance                          |
| Status     | Selected                                        |

---

## Concept Overview

| Attribute    | Detail                                                                               |
| ------------ | ------------------------------------------------------------------------------------ |
| Concept Name | Global Resource Cockpit                                                              |
| Tagline      | "One map, five sites, zero blind spots" — executive resource visibility in real time |

---

## Problem Addressed

Samsung DSR Division Managers have no real-time view of resource allocation across their 5 global sites (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung). Currently, site-level data must be manually compiled from PM Planner exports, Excel consolidation, and email requests — a process that takes 2-3 days and delivers stale information. By the time a Division Manager sees the cross-site picture, it is already outdated. HR Portfolio Managers face the same problem: headcount gaps across sites are tracked in separate spreadsheets with no single source of truth. (Reference: PS-3)

---

## Target Persona

| Attribute          | Detail                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Persona Name       | Minho Kim — Planning Manager                                                                                             |
| Role               | Planning Manager, Pyeongtaek                                                                                             |
| Site               | Samsung DSR Pyeongtaek (oversight of multiple sites)                                                                     |
| Key Need           | Instant cross-site resource visibility with drill-down capability for executive decision-making                          |
| Secondary Personas | Soyeon Choi (HR Portfolio Manager) — staffing gaps across sites; Eunji Lee (Analytics Specialist) — cross-site reporting |

---

## Concept Description

The Global Resource Cockpit is the entry point and navigation hub for IRIS — the first screen every user sees when they log in. An interactive ECharts.js world map displays all 5 Samsung DSR sites as geo-positioned pins. Each site pin shows a summary bubble with live resource KPIs: total headcount, allocation utilization %, active project count, and headcount gap indicator. Color intensity on the map represents utilization health: green for healthy (60-85%), yellow for elevated (85-95%), red for critical (>95%), and blue for under-utilized (<60%).

**Key UX Innovation: Progressive Disclosure Drill-Down.** The cockpit follows a strict information hierarchy: World Map (5 sites) -> Site Dashboard (departments) -> Department View (teams) -> Individual View (person). Each level reveals more detail while maintaining context through breadcrumb navigation and Factor Control persistence. The user is never overwhelmed — they start with the big picture and drill to exactly the depth they need. At every level, the Factor Control panel (site, BU, department, project type, time period) is visible and active, allowing cross-cutting filters without navigating away.

For Minho, this replaces 3 days of manual data compilation with a single glance. He sees that Pyeongtaek is yellow (91% utilization) and clicks to drill into the site dashboard. The department treemap (ECharts) reveals NAND Dev is red (96%) — the problem is localized. He clicks NAND Dev and sees the team breakdown: 25 engineers, 24 allocated, 1 on leave. He does not need to see Hwaseong's 450 employees to understand that Pyeongtaek's NAND team is the bottleneck.

For Soyeon (HR), the same world map overlays the HeadCount Portfolio: current vs. target headcount per site, staffing gaps by skill category, and action recommendations (hire, transfer, retain, reduce). This dual-purpose design — navigation hub for all users, portfolio view for HR — maximizes the value of a single screen without creating role-specific screens that duplicate infrastructure.

The cockpit is powered by Elasticsearch aggregations that pre-compute site-level metrics from the iris-resource-allocation index. Sub-second response times are achieved through hot-tier data nodes storing current-quarter indices. Data refreshes every 5 minutes via scheduled ES re-index.

---

## Key Features

| #   | Feature                     | Description                                                                                                                                                                                                                   | Priority |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Interactive World Map       | ECharts.js geo map with Samsung DSR site pins at Hwaseong (Korea), Pyeongtaek (Korea), Austin (TX, USA), Xi'an (China), Giheung (Korea). Zoom, pan, click-to-drill. Responsive layout for 1920x1080 and above.                | Must     |
| 2   | Site Summary Bubbles        | Each pin shows: Total HC, Utilization %, Active Projects, HC Gap. Data refreshed from ES aggregations every 5 minutes. Bubble size proportional to headcount.                                                                 | Must     |
| 3   | Utilization Color Coding    | Map pins and summary cards colored by utilization: Red >95% (critical), Yellow 85-95% (elevated), Green 60-85% (healthy), Blue <60% (under-utilized). Consistent color semantics throughout IRIS.                             | Must     |
| 4   | Site Drill-Down Dashboard   | Click site pin -> Department treemap (size=headcount, color=utilization), Project allocation heatmap (department x project matrix), HC trend chart (12-month line). All powered by ES aggregations filtered to selected site. | Must     |
| 5   | Department Drill-Down       | Click department in treemap -> Team breakdown, individual resource allocation details, project assignments. Breadcrumb: Home > Hwaseong > DRAM Dev.                                                                           | Should   |
| 6   | Factor Control Panel        | Persistent filter sidebar (always visible): Site (multi-select), BU, Department, Project Type, Time Period, Status. Applied to all charts and the world map simultaneously. Saved filter sets for reuse.                      | Must     |
| 7   | Role-Based Default View     | Division Manager sees global world map. Site Admin sees their site pre-selected. Planner sees their department pre-selected. Driven by user role and site assignment in Master Data.                                          | Must     |
| 8   | HeadCount Portfolio Overlay | Toggle to show HC Portfolio data on the world map: current vs. target HC per site, gap indicators with color (red=significant gap, green=on target), action badges (Hire/Transfer/Retain). For Soyeon (HR persona).           | Should   |
| 9   | Smart Alert Badges          | Warning badges on site pins when utilization >95% or HC gap >10%. Alert list in sidebar with severity ranking. Click alert to navigate directly to the affected department.                                                   | Should   |
| 10  | Cross-Site Comparison       | Select 2-3 sites for side-by-side comparison: bar charts for HC, utilization, project distribution. Useful for identifying reallocation opportunities between sites.                                                          | Could    |

---

## User Flow

1. **Minho logs into IRIS** — system detects his role (Planning Manager, Division-level). Default view: Global World Map
2. **World map renders in <2 seconds** — 5 site pins appear at correct geo positions. Each pin has a summary bubble:
   - Hwaseong: HC=450, Util=82% (green), Projects=28, Gap=-12
   - Pyeongtaek: HC=180, Util=91% (yellow), Projects=15, Gap=-5
   - Austin: HC=120, Util=76% (green), Projects=10, Gap=+3
   - Xi'an: HC=200, Util=88% (yellow), Projects=18, Gap=-8
   - Giheung: HC=95, Util=71% (green), Projects=8, Gap=+2
3. **Minho notices Pyeongtaek is yellow** (91% utilization — elevated). Alert badge: "Pyeongtaek: NAND Dev at 96%"
4. **Clicks the Pyeongtaek pin** — site dashboard opens. Breadcrumb: Home > Pyeongtaek
5. **Department treemap renders** — NAND Dev is the largest box (red, 96%), DRAM Dev (green, 78%), Test Engineering (yellow, 87%), Process Engineering (green, 74%)
6. **Clicks NAND Dev** — drills to department view. Breadcrumb: Home > Pyeongtaek > NAND Dev. Shows 25 engineers, project assignments, individual allocation percentages
7. **Applies Factor Control** — filters to "R&D projects only" and "Q3 2026" — all charts re-render with filtered data. Same filter persists when navigating back up
8. **Sees NAND V9 team at 96%** — a risk indicator. Notes that HBM4 at Hwaseong could use more resources
9. **Navigates back to World Map** — clicks "Home" in breadcrumb. Factor Control filters reset to defaults
10. **Toggles HC Portfolio overlay** — world map now shows HC gaps: Pyeongtaek needs 5 more engineers, Hwaseong needs 12. Austin has surplus (+3). Soyeon would see the same view with additional action recommendations

---

## Sketch / Wireframe

### Screen 1: Home — World Map Dashboard

```
+------------------------------------------------------------------------------+
|  IRIS — Global Resource Cockpit                             [Minho Kim ▼]   |
|  [Home●] [P/M Planner] [Roadmap] [Simulation] [Analysis] [HC Portfolio]    |
+------------------------------------------------------------------------------+
|  +--- Factor Control ----+                                                   |
|  | Site: [All         ▼] |  +--- World Map (ECharts.js Geo) ---------------+|
|  | BU:   [All         ▼] |  |                                               ||
|  | Period:[Q2 2026    ▼] |  |               Giheung●(green)                 ||
|  | Type: [All         ▼] |  |         Hwaseong●(green)  ●Pyeongtaek(yellow)||
|  | Status:[Active     ▼] |  |                                               ||
|  |                       |  |                                               ||
|  | [Apply] [Reset]       |  |                      Xi'an●(yellow)           ||
|  |                       |  |                                               ||
|  +--- Alerts -----------+|  |                                               ||
|  | ⚠ Pyeongtaek NAND    ||  |  Austin●(green)                              ||
|  |   Dev: 96% util      ||  |                                               ||
|  | ⚠ Hwaseong: -12      ||  |  +-- Hwaseong Bubble --+                     ||
|  |   HC gap             ||  |  | HC: 450             |                     ||
|  | ⚠ Xi'an: -8          ||  |  | Util: 82% ■■■■□     |                     ||
|  |   HC gap             ||  |  | Projects: 28        |                     ||
|  |                       ||  |  | Gap: -12 ⚠          |                     ||
|  | [HC Portfolio Toggle] ||  |  +---------------------+                     ||
|  +-----------------------+|  +----------------------------------------------+|
|                                                                              |
|  +--- Site Summary Cards (below map) ------------------------------------+  |
|  | Hwaseong      | Pyeongtaek    | Austin        | Xi'an       | Giheung |  |
|  | HC: 450       | HC: 180       | HC: 120       | HC: 200     | HC: 95  |  |
|  | 82% ■■■■□     | 91% ■■■■■ ⚠  | 76% ■■■□□     | 88% ■■■■□  | 71% ■■■|  |
|  | Gap: -12 ⚠    | Gap: -5       | Gap: +3 ✓     | Gap: -8     | Gap: +2 |  |
|  | 28 projects   | 15 projects   | 10 projects   | 18 projects | 8 proj  |  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+
```

### Screen 2: Site Drill-Down (Pyeongtaek)

```
+------------------------------------------------------------------------------+
|  IRIS > Home > Pyeongtaek                              [◄ Back to World Map]|
+------------------------------------------------------------------------------+
|  Factor Control: Site=Pyeongtaek | BU=All | Period=Q2 2026                   |
|                                                                              |
|  +--- Department Treemap ------+  +--- Project Allocation Heatmap --------+ |
|  |  (ECharts Treemap)          |  |  (ECharts Heatmap)                     | |
|  |                             |  |                                        | |
|  | +----------+ +--------+    |  |  Dept \ Proj | HBM4 | NAND | DDR5     | |
|  | | NAND Dev | | DRAM   |    |  |  ------------|------|------|------     | |
|  | | 25 eng   | | Dev    |    |  |  NAND Dev    |  2   | [18] |  3       | |
|  | | [RED]    | | 22 eng |    |  |  DRAM Dev    |  0   |  2   | [14]     | |
|  | | 96%      | | [GREEN]|    |  |  Test Eng    |  1   |  3   |  2       | |
|  | |          | | 78%    |    |  |  Process Eng |  3   |  5   |  1       | |
|  | +----------+ +--------+    |  |                                        | |
|  | +--------+ +-------+      |  |  Color: ░ Low  ▓ Med  █ High alloc    | |
|  | |Test Eng| |Process|      |  |  Click any cell to drill down          | |
|  | |8 eng   | |Eng    |      |  +----------------------------------------+ |
|  | |[YELLOW]| |6 eng  |      |                                              |
|  | | 87%    | |[GREEN]|      |  +--- HC Trend (12 months) ----------------+ |
|  | |        | | 74%   |      |  | 200|               ___----  ●Planned    | |
|  | +--------+ +-------+      |  | 180|          ___--         ○Actual     | |
|  +-----------------------------+  | 160|     ___-                          | |
|                                   | 140| ___-                              | |
|                                   |    | M  A  M  J  J  A  S  O  N  D     | |
|                                   +----------------------------------------+ |
+------------------------------------------------------------------------------+
```

### Screen 3: Department Drill-Down (NAND Dev)

```
+------------------------------------------------------------------------------+
|  IRIS > Home > Pyeongtaek > NAND Dev                   [◄ Back to Site]     |
+------------------------------------------------------------------------------+
|  Department: NAND Dev — Pyeongtaek         Utilization: 96% ⚠ CRITICAL      |
|  Engineers: 25 | Allocated: 24 | On Leave: 1 | Open Positions: 3            |
|                                                                              |
|  +--- Team Breakdown ----------------------------------+  +--- Key Stats -+|
|  | Engineer        | Project      | Alloc% | Status    |  | Util: 96% ⚠   ||
|  |-----------------|--------------|--------|-----------|  | HC: 25/28      ||
|  | Park Jihoon     | NAND V9      | 100%   | ● Full   |  | Gap: -3        ||
|  | Kim Soojin      | NAND V9      |  90%   | ● High   |  | Avg Alloc: 91% ||
|  | Lee Youngho     | NAND V9      |  80%   | ● High   |  |                ||
|  |                 | HBM4-Dev     |  20%   |           |  | Top Project:   ||
|  | Choi Minjae     | NAND V9      | 100%   | ● Full   |  | NAND V9 (18)   ||
|  | Yoon Haeun      | NAND V9      |  85%   | ● High   |  |                ||
|  |                 | DDR5-Gen4    |  15%   |           |  +----------------+|
|  | Han Seungwoo    | NAND V9      |  95%   | ● High   |                     |
|  | ... (19 more)   |              |        |           |                     |
|  +-----------------------------------------------------+                    |
|                                                                              |
|  +--- Allocation Timeline (xDHTML Gantt summary, read-only) ---------------+|
|  | Engineer     | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug |          ||
|  |--------------|-----|-----|-----|-----|-----|-----|-----|-----|           ||
|  | Park Jihoon  |█████|█████|█████|█████|█████|█████|█████|█████|          ||
|  | Kim Soojin   |████ |████ |█████|█████|████ |████ |████ |████ |          ||
|  | Lee Youngho  |████ |████ |████ |████ |████ |████ |████ |████ |          ||
|  +-------------------------------------------------------------------------+|
+------------------------------------------------------------------------------+
```

---

## Component Inventory

| Component Type    | Name                      | Description                                           |
| ----------------- | ------------------------- | ----------------------------------------------------- |
| **Mendix Page**   | Home_WorldMap             | Landing page with ECharts world map                   |
| **Mendix Page**   | Home_SiteDashboard        | Site drill-down with treemap + heatmap + trend        |
| **Mendix Page**   | Home_DepartmentView       | Department drill-down with team breakdown             |
| **Custom Widget** | ECharts World Map (W04)   | Geo-positioned site pins with summary bubbles         |
| **Custom Widget** | ECharts Treemap (W02)     | Department breakdown by headcount and utilization     |
| **Custom Widget** | ECharts Heatmap (W02)     | Department x project allocation matrix                |
| **Custom Widget** | xDHTML Gantt (W01)        | Read-only timeline view for department drill-down     |
| **Module**        | Factor Control (M05)      | Persistent filtering across all views                 |
| **Module**        | Master Data (M02)         | Site geo-coordinates, org structure, role definitions |
| **Module**        | HeadCount Portfolio (M13) | HC targets, gaps, actions for HR overlay              |
| **Data Source**   | Elasticsearch 8.x         | iris-resource-allocation, iris-headcount indices      |

---

## Data Requirements

| Entity / Index           | Purpose                                                                     | Storage           |
| ------------------------ | --------------------------------------------------------------------------- | ----------------- |
| Site                     | Site master data: name, latitude, longitude, timezone, BU assignments       | Oracle 19c        |
| Department               | Department hierarchy: site -> BU -> department -> team                      | Oracle 19c        |
| iris-resource-allocation | Live allocation data indexed by site, department, project, employee, period | Elasticsearch 8.x |
| iris-headcount           | HC Portfolio: current HC, target HC, gap, action plan per site/department   | Elasticsearch 8.x |
| FactorControlSet         | Saved filter configurations per user                                        | Oracle 19c        |

---

## Technical Feasibility Notes

| Aspect                | Notes                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Feasibility           | High — ECharts.js world map module is mature and well-documented. ES terms aggregations by site are straightforward. Treemap and heatmap are standard ECharts components.                                                                                                                                                                                                      |
| Key Dependencies      | ECharts.js (W02, W04) for world map and charts, Elasticsearch cluster for aggregations, Factor Control module (M05), Master Data (M02) for site geo-coordinates                                                                                                                                                                                                                |
| Known Technical Risks | (1) World map rendering performance with site bubbles — mitigate with server-side pre-aggregation and 5-minute refresh cycle. (2) Geo-coordinate accuracy for Samsung campus locations (Hwaseong and Pyeongtaek are <50km apart) — use campus-level pins with offset. (3) Treemap layout stability when filtering narrows data to <5 items — fallback to horizontal bar chart. |
| Mendix 10 Constraints | ECharts widgets are pluggable widgets with custom React wrappers. Drill-down navigation uses Mendix page parameters. Factor Control state persisted in Mendix session. Role-based defaults require Mendix user role integration.                                                                                                                                               |
| Estimated Effort      | 2-3 sprints for world map home + site drill-down + Factor Control. 1-2 additional sprints for HC Portfolio overlay, department drill-down, and cross-site comparison.                                                                                                                                                                                                          |

---

## CXO Design Principles Applied

| Principle                         | How It Manifests                                                                                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Progressive disclosure**        | World Map (5 pins) -> Site Dashboard (4-6 departments) -> Department (25 engineers). Each level adds detail without requiring the user to process the full data set. This is the primary CXO principle for the cockpit. |
| **Never overwhelm**               | Summary cards below the map show only 4 KPIs per site. Treemap uses size and color to encode information visually, not in tables. Alert sidebar surfaces only critical items.                                           |
| **Factor Control always visible** | The filter panel is not hidden behind a toggle — it is always visible on the left side. This ensures users always know their current scope and can change it instantly.                                                 |
| **Consistent color semantics**    | Red, yellow, green, blue mean the same thing everywhere in IRIS (not just the cockpit). This reduces cognitive load for users switching between screens.                                                                |
| **Role-adaptive defaults**        | Minho sees the global map. Jisoo sees her department. Soyeon sees the HC overlay. Same screen, different starting points — reduces navigation and personalizes the experience.                                          |

---

## Open Questions for Concept Validation (S3)

1. **Map rendering on Mendix**: ECharts world map performance within Mendix pluggable widget — validate with prototype on target Mendix deployment.
2. **Korean site proximity**: Hwaseong, Pyeongtaek, and Giheung are all in the Seoul metropolitan area (<50km apart). Do the pins overlap on the default zoom level? Test with real coordinates and design a zoom/cluster strategy if needed.
3. **Data refresh frequency**: 5-minute refresh vs. real-time — is 5 minutes fresh enough for Samsung managers? Validate tolerance for staleness.
4. **HC Portfolio overlay complexity**: Does the dual-purpose screen (navigation + HC portfolio) create confusion, or do users understand the toggle? Test with both Minho (manager) and Soyeon (HR).
5. **Drill-down depth**: Is World Map -> Site -> Department -> Individual the right hierarchy? Or do Samsung users want to jump directly from the map to a specific engineer? Validate the navigation model.

---

## Evaluation Criteria

| Criterion                    | Score (1-5) | Rationale                                                                                                                                                      |
| ---------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desirability (user value)    | 5           | Replaces 2-3 days of manual compilation with instant visibility. Serves all 4 personas. First screen every user sees — drives adoption.                        |
| Feasibility (technical)      | 4           | ECharts world map + ES aggregations are well-established. No major technical risks. Highest feasibility of all 5 concepts.                                     |
| Viability (business)         | 5           | Samsung Req 6 (cross-site view), Req 7 (world map), Req 8 (analysis views), Req 9 (HC Portfolio) — covers 4 requirements.                                      |
| Innovation                   | 3           | World map dashboards exist in other domains. The value is in execution, progressive disclosure design, and domain-specific adaptation — not raw novelty.       |
| Alignment with AX Principles | 4           | Cross-site visibility is a validated need from interviews. Factor Control enables role-based scoping. Progressive disclosure tested with 5+ users in DISCOVER. |
| **Total**                    | **21/25**   |                                                                                                                                                                |

---

## Decision

| Attribute | Detail                                                                                                                                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status    | **Selected** — proceed to prototype                                                                                                                                                                                                                              |
| Rationale | Scores 21/25. Covers 4 Samsung requirements (Req 6, 7, 8, 9). Highest feasibility (4/5). Serves as IRIS entry point — first screen every user sees. Executive buy-in driver. Progressive disclosure design ensures it scales from quick-glance to deep analysis. |
| Next Step | S2 Prototype — design Home / World Map Dashboard and Site Drill-Down in detail                                                                                                                                                                                   |

---

---

# CONCEPT-D: Smart Delta Engine

## Metadata

| Field      | Value                                           |
| ---------- | ----------------------------------------------- |
| Project    | IRIS (Task 102)                                 |
| Product    | IRIS — Intelligent Resources Information System |
| Concept ID | CONCEPT-D                                       |
| Version    | v2.0                                            |
| Date       | 2026-03-21                                      |
| Author     | CXO with AI assistance                          |
| Status     | Selected                                        |

---

## Concept Overview

| Attribute    | Detail                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------ |
| Concept Name | Smart Delta Engine                                                                         |
| Tagline      | "Track every change, sync only what matters" — Git-like version control for resource plans |

---

## Problem Addressed

Samsung DSR has no per-project version history for resource roadmaps. When a roadmap version is synced to PROMIS (Profit Management System), ALL projects are sent regardless of whether they changed — wasting bandwidth, processing time, and creating reconciliation complexity. Change auditing is impossible: managers cannot see who changed what, when, or why. PM Planner's lack of diff capability means reviewers must compare data manually in Excel, which is error-prone and time-consuming. When Minho needs to approve a roadmap version, he has no tool that shows him only what changed. (Reference: PS-2, PS-5)

---

## Target Persona

| Attribute         | Detail                                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Persona Name      | Jisoo Park — Senior Resource Planner                                                                           |
| Role              | Senior Resource Planner, Hwaseong HQ                                                                           |
| Site              | Samsung DSR Hwaseong                                                                                           |
| Key Need          | Track which projects changed across versions, see visual diffs, and sync only changed data to external systems |
| Secondary Persona | Minho Kim (Planning Manager) — reviews diffs before approving, monitors PROMIS sync status                     |

---

## Concept Description

The Smart Delta Engine is the version control backbone of IRIS — a foundational infrastructure concept that every other concept depends on. It provides three capabilities: (1) comprehensive version history for every planning artifact (roadmaps, P/M plans, simulations), (2) a visual diff algorithm that compares any two versions by matching records on composite keys and classifying changes, and (3) a delta detection engine that identifies which projects changed and sends only those to PROMIS and N-PLM.

**Key UX Innovation: Git-Like Version Mental Model for Non-Technical Users.** The version timeline is deliberately designed to look and feel like a Git commit log — but without any Git terminology. Each version is a "point in time" on a vertical timeline. Users can click any two points to compare. The diff viewer uses color coding (green/red/yellow) that is universally understood. The summary line reads like a changelog: "V6: Added HBM4 project (+5 engineers), Reduced DDR4 (-3 engineers), Modified Exynos 2600 timeline." This gives non-technical Samsung planners and managers the power of version control without the complexity.

When Jisoo saves a new roadmap version, the Version Engine stores a complete snapshot. When Minho reviews it for approval, the Diff Viewer widget renders a side-by-side comparison: ADDED allocations in green, REMOVED in red, MODIFIED in yellow, UNCHANGED filtered out by default. A summary bar reads: "V6 vs V5: 3 projects changed (1 added, 2 modified), 12 allocation records modified, 478 unchanged." The summary stats above the detail view give Minho confidence that he is reviewing a manageable change set, not the entire roadmap.

On approval, the Delta Engine runs automatically: it identifies that only 3 of 52 projects have changes and sends just those 3 to PROMIS, along with a change manifest. The selective sync dashboard lets Minho review the sync payload before confirming — per-project toggle switches allow excluding specific projects from sync if needed. This transparency builds trust in the integration layer, which was historically a black box in PM Planner.

---

## Key Features

| #   | Feature                        | Description                                                                                                                                                                                       | Priority |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Version Snapshots              | Every save creates a new version with full data snapshot. Version states: Draft, PendingApproval, Approved, Archived. Applied to roadmaps, P/M plans, and simulations uniformly.                  | Must     |
| 2   | Per-Project Version Timeline   | Vertical timeline showing all versions for any planning artifact. Each point shows: version number, creator, date, approval status, change summary, PROMIS sync status. Click any two to compare. | Must     |
| 3   | Composite-Key Diff Algorithm   | Compare two versions by matching records on (employee_id + project_id + period). Classify each as ADDED, REMOVED, MODIFIED, or UNCHANGED. Summary statistics auto-generated.                      | Must     |
| 4   | Visual Diff Viewer (W03)       | Side-by-side layout with summary stats bar above detail view. Color-coded: green=added, red=removed, yellow=modified. Filterable by change type. Expandable rows for cell-level detail.           | Must     |
| 5   | Change Summary Auto-Generation | System generates human-readable changelog: "V6: Added HBM4 project (+5 engineers), Reduced DDR4 (-3 engineers), Modified Exynos 2600 timeline." Stored with version metadata.                     | Must     |
| 6   | Delta Detection for PROMIS     | On version approval, diff current vs. last PROMIS-synced version. Extract list of changed projects. Build delta payload. Only changed projects are sent — 90%+ bandwidth reduction.               | Must     |
| 7   | Selective Sync Dashboard       | Pre-sync review: shows which projects will be synced and why. Per-project toggle switches to include/exclude. Payload size and estimated sync time displayed. Confirm/Cancel.                     | Should   |
| 8   | Approval-Gated Sync            | PROMIS sync only triggers after manager approval. Can be auto-triggered on approval or manual via sync dashboard. Never auto-syncs unapproved data.                                               | Must     |
| 9   | N-PLM Delta Sync               | Same delta logic applied to N-PLM: only changed projects and master data sent. Bidirectional: incoming N-PLM changes are also diffed against local data and flagged for review.                   | Should   |
| 10  | Sync Status Monitor            | Dashboard showing all sync records: date, target system (PROMIS/N-PLM), status (Success/Failed/Pending/Partial), changed project count, error messages. For system admin and managers.            | Should   |

---

## User Flow

1. **Jisoo creates Roadmap V6** — modifies 3 projects (adds HBM4, adjusts DDR4, modifies Exynos 2600 timeline) from V5 baseline
2. **Saves as Draft** — Version Engine creates V6 snapshot with all 52 projects and 2,340 allocation records
3. **Opens version timeline** — vertical timeline shows V6 (Draft, top) -> V5 (Approved) -> V4 (Archived) -> V3 -> V2 -> V1. Each point shows creator, date, change summary
4. **Clicks "Compare V6 vs V5"** — Diff Viewer opens with summary bar: "3 projects changed, 1 added, 2 modified, 12 records changed, 478 unchanged"
5. **Reviews diff** — scrolls through three change sections:
   - HBM4 Development: 5 new allocation records (green, ADDED)
   - DDR4 Sustaining: 3 records modified — engineer count reduced (yellow, MODIFIED)
   - Exynos 2600: 4 records modified — timeline shifted (yellow, MODIFIED)
   - 49 projects unchanged — hidden by default, can be shown with "Show Unchanged" toggle
6. **Submits for approval** — Minho receives email with change summary and direct link
7. **Minho opens diff view** — reviews all changes. Clicks on DDR4 row to expand and see cell-level detail (which specific engineer allocations changed, by how much)
8. **Minho approves** — V6 status changes to Approved. V5 archived automatically
9. **Delta Engine runs** — compares V6 with last PROMIS-synced version (V4). Identifies 4 changed projects (3 from V6 + 1 from V5 that was not yet synced)
10. **Selective sync dashboard appears** — Minho sees: "4 projects will be synced to PROMIS. 48 unchanged." Per-project toggles all set to "Sync." Payload: 4 projects, 23 records. Est. time: <5 seconds
11. **Minho confirms sync** — delta payload sent to PROMIS REST API. SyncRecord created: status=Success, projects=4, records=23, duration=3.2s
12. **V6 marked as PROMIS_Synced** — future deltas will compare against V6

---

## Sketch / Wireframe

### Screen 1: Version Timeline Panel

```
+--------------------------------------------------------------+
|  Resource Roadmap — Hwaseong — Memory BU — FY2026            |
|  Version History                          [Compare Any Two ▼] |
+--------------------------------------------------------------+
|                                                              |
|  ● V6 — Draft — 2026-03-15 14:32                 [CURRENT] |
|  │ Created by: Jisoo Park                                    |
|  │ Summary: +1 project (HBM4), ~2 modified (DDR4, Exynos)   |
|  │ Status: Pending Approval                                  |
|  │ [View] [Compare with V5 ▶]                               |
|  │                                                           |
|  ● V5 — Approved — 2026-03-01 09:15                         |
|  │ Created by: Jisoo Park                                    |
|  │ Approved by: Minho Kim (2026-03-01 10:20)                 |
|  │ Summary: +2 projects, ~3 modified                         |
|  │ PROMIS: ✓ Synced (2026-03-01 10:30)                      |
|  │ [View] [Compare with ▼]                                   |
|  │                                                           |
|  ● V4 — Archived — 2026-02-15 11:20                         |
|  │ Created by: Hyunwoo Choi                                  |
|  │ Approved by: Minho Kim                                    |
|  │ PROMIS: ✓ Synced                                          |
|  │ [View] [Compare with ▼]                                   |
|  │                                                           |
|  ○ V3 — Archived — 2026-02-01                               |
|  ○ V2 — Archived — 2026-01-15                               |
|  ○ V1 — Archived — 2026-01-01 (Initial)                     |
|                                                              |
|  Expanded nodes (●) show detail. Collapsed (○) show summary. |
+--------------------------------------------------------------+
```

### Screen 2: Visual Diff Viewer (V6 vs V5)

```
+------------------------------------------------------------------------------+
|  Diff: Roadmap V6 vs V5                                                     |
+------------------------------------------------------------------------------+
|  +--- Summary Bar ---------------------------------------------------------+|
|  | 3 projects changed | 12 records modified | 478 unchanged (hidden)       ||
|  | ■ 1 Added  ■ 2 Modified  ■ 0 Removed    [Show Unchanged]               ||
|  +-------------------------------------------------------------------------+|
|                                                                              |
|  Filter: [All Changes ▼]  [■ Added] [■ Modified] [■ Removed]               |
|                                                                              |
|  +--- V5 (Previous Approved) ----+  +--- V6 (Current Draft) -------------+ |
|  |                               |  |                                     | |
|  | ✚ HBM4 Development           |  | ✚ HBM4 Development                | |
|  |   (not in V5)                 |  |   Kim Taeho      80% Sep-Dec       | |
|  |                               |  |   Park Minji     60% Sep-Dec       | |
|  |                               |  |   Lee Naeun      70% Sep-Dec       | |
|  |                               |  |   Kang Siwoo     50% Sep-Dec       | |
|  |                               |  |   Yoon Daeho     40% Sep-Dec       | |
|  |                               |  |   [ADDED — 5 new records]          | |
|  |-------------------------------|  |-------------------------------------| |
|  | ✎ DDR4 Sustaining  [expand ▶] |  | ✎ DDR4 Sustaining  [expand ▶]     | |
|  |   3 records modified          |  |   Choi Yuna: 70% → 50% (-20%)     | |
|  |                               |  |   Kang Siwoo: 60% → 40% (-20%)    | |
|  |                               |  |   Lee Naeun: 50% → removed         | |
|  |                               |  |   [MODIFIED — 3 records, -2 HC]    | |
|  |-------------------------------|  |-------------------------------------| |
|  | ✎ Exynos 2600                 |  | ✎ Exynos 2600                     | |
|  |   Timeline: Jan-Sep 2026      |  |   Timeline: Jan-Dec 2026 (+3mo)    | |
|  |   8 engineers                 |  |   8 engineers (Q4 shifted)         | |
|  |                               |  |   [MODIFIED — 4 records, 0 HC]     | |
|  +-------------------------------+  +-------------------------------------+ |
|                                                                              |
|  Legend: ✚ Added (green)  ✎ Modified (yellow)  ✖ Removed (red)             |
|          ── Unchanged (hidden by default)                                    |
|                                                                              |
|  [Approve ▶]  [Reject with Comment]  [Export Diff as Excel]                 |
+------------------------------------------------------------------------------+
```

### Screen 3: Selective Sync Dashboard

```
+--------------------------------------------------------------+
|  PROMIS Delta Sync — Roadmap V6                              |
|  Last PROMIS sync: V4 (2026-02-15)                           |
|  Comparison: V6 vs V4 (last synced)                          |
+--------------------------------------------------------------+
|                                                              |
|  Changes detected since last sync:                           |
|                                                              |
|  [✓] HBM4 Development      — ADDED (new project)           |
|      5 allocation records | +5 engineers                    |
|                                                              |
|  [✓] DDR4 Sustaining       — MODIFIED (reduced HC)          |
|      3 allocation records | -2 engineers                    |
|                                                              |
|  [✓] Exynos 2600           — MODIFIED (timeline shift)      |
|      4 allocation records | 0 HC change                     |
|                                                              |
|  [✓] NAND V9               — MODIFIED (from V5, not synced) |
|      2 allocation records | reallocation adjustments        |
|                                                              |
|  ── 48 projects UNCHANGED — will NOT be synced              |
|                                                              |
|  Payload Summary:                                            |
|  Projects: 4 of 52 | Records: 14 | Est. time: <5 sec        |
|  Bandwidth saved: ~90% vs full sync                          |
|                                                              |
|  [Confirm Sync to PROMIS ▶]              [Cancel]           |
+--------------------------------------------------------------+
```

---

## Component Inventory

| Component Type    | Name                    | Description                                    |
| ----------------- | ----------------------- | ---------------------------------------------- |
| **Mendix Page**   | Version_Timeline        | Vertical version history with compare controls |
| **Mendix Page**   | Diff_Viewer             | Side-by-side diff with summary bar             |
| **Mendix Page**   | Sync_Dashboard          | Selective sync review and confirmation         |
| **Mendix Page**   | Sync_Monitor            | Sync status history and error log              |
| **Custom Widget** | Diff Viewer (W03)       | Side-by-side comparison with color coding      |
| **Module**        | Version Engine (M03)    | Snapshot creation, state management, archival  |
| **Module**        | Diff Algorithm (M03a)   | Composite-key matching, change classification  |
| **Module**        | Delta Engine (M03b)     | Changed-project detection, payload generation  |
| **Module**        | PROMIS Connector (M30)  | REST API integration for delta sync            |
| **Module**        | N-PLM Connector (M31)   | REST API integration for bidirectional sync    |
| **Module**        | Approval Workflow (M04) | Submit/Approve/Reject with Smart Notify        |
| **Data Source**   | Oracle 19c              | Version entities, sync records, audit log      |

---

## Data Requirements

| Entity / Index            | Purpose                                                                                                              | Storage    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------- |
| RoadmapVersion            | Version metadata: number, state, creator, approver, timestamps, change_summary                                       | Oracle 19c |
| PMPlanVersion             | Same structure for P/M plan versions                                                                                 | Oracle 19c |
| SimulationVersion         | Same structure for simulation versions                                                                               | Oracle 19c |
| VersionAllocationSnapshot | Full allocation data for each version (employee_id, project_id, period, percentage, hours)                           | Oracle 19c |
| SyncRecord                | Sync audit: version_id, target_system, status, project_count, record_count, payload_hash, error_message, duration_ms | Oracle 19c |
| SyncProjectDetail         | Per-project sync detail: project_id, change_type (ADDED/MODIFIED/REMOVED), records_affected                          | Oracle 19c |

---

## Technical Feasibility Notes

| Aspect                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feasibility           | High — diff algorithm is deterministic (composite key matching + value comparison). PROMIS REST API is documented. Version storage uses standard Oracle schema patterns.                                                                                                                                                                                                                                                           |
| Key Dependencies      | Diff Viewer widget (W03), PROMIS REST API (M30), N-PLM REST API (M31), Approval Workflow (M04), all planning modules (M10, M11, M12)                                                                                                                                                                                                                                                                                               |
| Known Technical Risks | (1) Version storage growth — each version stores full snapshot. Mitigate with archival policy (auto-archive after 6 months, archive stores only delta from previous version). (2) Diff performance for large roadmaps (1000+ records) — mitigate with composite index on (version_id, employee_id, project_id, period). (3) PROMIS API reliability — implement retry with exponential backoff, dead-letter queue for failed syncs. |
| Mendix 10 Constraints | Version snapshots use Mendix's built-in data versioning where possible, with custom Java actions for the diff algorithm and delta detection. PROMIS connector uses Mendix REST module with custom error handling. Sync dashboard uses Mendix data grid with real-time status updates.                                                                                                                                              |
| Estimated Effort      | 3-4 sprints for version engine + diff algorithm + diff viewer. 2 sprints for PROMIS delta sync + selective sync dashboard. 1 sprint for N-PLM bidirectional sync. Total: 6-7 sprints.                                                                                                                                                                                                                                              |

---

## CXO Design Principles Applied

| Principle                      | How It Manifests                                                                                                                                                                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Trust through transparency** | The diff viewer shows every change with attribution. The selective sync dashboard shows exactly what will be sent to PROMIS — no black box. Sync status monitor provides a complete audit trail. Users trust the system because they can verify it.            |
| **Git-like mental model**      | The version timeline looks like a commit log. The diff viewer looks like a code diff. These are familiar patterns (even for non-technical users who have seen "Track Changes" in Word). The summary bar gives confidence: "3 projects changed, 478 unchanged." |
| **Summary before detail**      | The summary bar appears above the diff detail. The selective sync dashboard shows totals before per-project breakdown. Users always know the magnitude before they dive into specifics.                                                                        |
| **Safe defaults**              | "Show Unchanged" is off by default — users see only changes. All projects are toggled "Sync" by default — the user only needs to intervene if they want to exclude something. Approved versions are auto-synced unless the user opts for manual sync.          |

---

## Open Questions for Concept Validation (S3)

1. **Snapshot vs. delta storage**: Full snapshots are simpler but consume more storage. Should we implement delta-only storage after V1 (storing only changes from previous version) to reduce Oracle storage? Validate storage projections with Samsung data volumes.
2. **Selective sync granularity**: Should users be able to exclude individual allocation records (not just projects) from sync? Or is project-level granularity sufficient for Samsung DSR?
3. **Auto-sync vs. manual sync**: Should PROMIS sync trigger automatically on approval, or should managers always see the selective sync dashboard first? Validate preference with Minho.
4. **N-PLM bidirectional conflict**: When incoming N-PLM data conflicts with local IRIS data, how should the system present this to the user? Validate the conflict resolution UX with Samsung integration team.
5. **Version comparison scope**: Users can compare V6 vs V5, but can they compare V6 vs V3 (skipping versions)? Validate whether non-adjacent comparison is a common use case.

---

## Evaluation Criteria

| Criterion                    | Score (1-5) | Rationale                                                                                                                                                                               |
| ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desirability (user value)    | 4           | Audit trail and diff visibility are critical for managers. Delta sync is invisible to planners (which is ideal — it just works). Selective sync dashboard gives managers control.       |
| Feasibility (technical)      | 4           | Deterministic algorithm, well-defined data model. No AI or real-time complexity. Highest technical certainty of all concepts.                                                           |
| Viability (business)         | 5           | Samsung Req 2 (per-project versions + delta sync) is explicit and non-negotiable. Saves PROMIS bandwidth by 90%+.                                                                       |
| Innovation                   | 3           | Version control and diff are mature concepts. Innovation is in the domain-specific application (resource planning composite keys) and selective sync UX (pre-sync review with toggles). |
| Alignment with AX Principles | 5           | Foundational infrastructure that enables all other concepts. Without this, no versioning, no diff, no audit trail, no delta sync. Must be implemented first.                            |
| **Total**                    | **21/25**   |                                                                                                                                                                                         |

---

## Decision

| Attribute | Detail                                                                                                                                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status    | **Selected** — proceed to prototype (highest implementation priority — foundational)                                                                                                                                                                        |
| Rationale | Scores 21/25. Non-negotiable Samsung requirement (Req 2). Foundational: Concepts A, B, C, and E all depend on the version engine. Must be implemented first (Sprint 1-4). Git-like mental model makes version control accessible to non-technical planners. |
| Next Step | S2 Prototype — design Version Timeline, Diff Viewer, and Selective Sync Dashboard in detail                                                                                                                                                                 |

---

---

# CONCEPT-E: AI-Powered Analysis Builder

## Metadata

| Field      | Value                                           |
| ---------- | ----------------------------------------------- |
| Project    | IRIS (Task 102)                                 |
| Product    | IRIS — Intelligent Resources Information System |
| Concept ID | CONCEPT-E                                       |
| Version    | v2.0                                            |
| Date       | 2026-03-21                                      |
| Author     | CXO with AI assistance                          |
| Status     | Selected                                        |

---

## Concept Overview

| Attribute    | Detail                                                                             |
| ------------ | ---------------------------------------------------------------------------------- |
| Concept Name | AI-Powered Analysis Builder                                                        |
| Tagline      | "Ask a question, get a chart" — conversational analytics for resource intelligence |

---

## Problem Addressed

Samsung DSR's Analytics Specialists (like Eunji Lee) currently rely on manual Excel exports from PM Planner, followed by pivot table construction and cross-referencing across disconnected data sources. This process consumes 60%+ of analyst time and delivers reports that are already stale by the time they are compiled. There is no on-demand multi-dimensional reporting capability and no integration with AI services for intelligent insights. Division Managers like Minho receive weekly reports that are 3-5 days old. The gap between "I have a question" and "I have an answer" is measured in hours or days, not seconds. (Reference: PS-4)

---

## Target Persona

| Attribute         | Detail                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| Persona Name      | Eunji Lee — Analytics Specialist                                                                                 |
| Role              | Analytics Specialist, Hwaseong HQ                                                                                |
| Site              | Samsung DSR Hwaseong                                                                                             |
| Key Need          | Generate multi-dimensional resource reports on demand without Excel exports, with AI-assisted insight generation |
| Secondary Persona | Minho Kim (Planning Manager) — receives scheduled reports, asks ad-hoc questions about resource data             |

---

## Concept Description

The AI-Powered Analysis Builder is a self-service analytics workbench that transforms the workflow from "export to Excel, build pivot, format, email" into "ask a question, get a chart, share." It operates at two levels: (1) a visual builder for structured analysis (dimension/measure palette + chart type selector), and (2) a natural language query interface for conversational analytics.

**Key UX Innovation: Conversational Analytics Lowering the Barrier to Self-Service.** The natural language query input is the headline feature. Eunji types: "Show me headcount by department for Hwaseong Q2 2026." The AI parses this into dimensions (department), measures (headcount), filters (site=Hwaseong, period=Q2 2026) and suggests the best chart type (horizontal bar chart, because single dimension + single measure). The result renders in 2 seconds. Eunji can then refine: "Break it down by project" — the system adds a second dimension and switches to a grouped bar chart. "Show it as a heatmap" — the system re-renders. This progressive complexity model serves both novice users (who start with simple questions) and power users (who build complex multi-dimensional analyses).

For users who prefer structured interaction over natural language, the dimension/measure palette on the left sidebar provides a drag-and-drop interface. Available dimensions (Site, Department, BU, Project, Time Period, Skill Category, Job Grade) and measures (Headcount, Allocation %, Gap, Utilization, Hours) can be dragged into rows, columns, and value areas. The chart type bar offers one-click switching between bar, stacked bar, line, pie, heatmap, treemap, radar, and sankey visualizations. ECharts.js handles all rendering with interactive tooltips, drill-down on click, and responsive layout.

For advanced reporting, Eunji clicks "Generate AI Report." The system sends the aggregated data along with dimension configuration to Samsung AI Services, which returns a formatted Excel file with PIVOT tables, trend analysis, and AI-generated narrative insights (e.g., "DRAM Dev is 12% over-allocated in Q2 2026 due to DDR5-Gen4 timeline expansion. Recommendation: redistribute 3 engineers to HBM4."). For recurring reports, she configures a schedule (weekly, Monday 8AM) and Smart Notify emails the report to configured recipients.

The progressive complexity design ensures that new users are not overwhelmed. The first interaction is always simple: type a question or drag one dimension and one measure. Power features (multi-dimension, saved views, scheduled reports, AI report generation) are revealed as the user gains confidence. This is critical for Samsung DSR, where most users are planners and managers — not data analysts — and the tool must be accessible to everyone.

---

## Key Features

| #   | Feature                           | Description                                                                                                                                                                                                                   | Priority |
| --- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Natural Language Query Input      | Text input at the top: "Show me headcount by department for Hwaseong Q2 2026." AI parses intent, maps to dimensions/measures/filters, suggests chart type. Supports refinement: "Break it down by project."                   | Must     |
| 2   | AI Chart Type Suggestion          | Based on data dimensions and cardinality, AI suggests the most appropriate chart type. Single dimension + single measure = bar chart. Two dimensions + single measure = heatmap. Time series = line chart. User can override. | Must     |
| 3   | Dimension/Measure Palette         | Left sidebar: available dimensions and measures. Drag to rows/columns/values. Alternative to natural language for users who prefer structured interaction.                                                                    | Must     |
| 4   | Dynamic Chart Rendering (ECharts) | ECharts.js renders selected chart type. Supported: bar, stacked bar, grouped bar, line, area, pie, heatmap, treemap, radar, sankey. One-click type switching. Interactive tooltips, zoom, click-to-drill.                     | Must     |
| 5   | Elasticsearch Aggregation Engine  | System translates query (NL or structured) into ES aggregation queries. Sub-second response via hot-tier data nodes. Composite aggregation for high-cardinality dimensions.                                                   | Must     |
| 6   | Interactive Drill-Down            | Click any chart element to drill into the next hierarchy level. E.g., click "Hwaseong" bar -> department breakdown. Click "DRAM Dev" -> team breakdown. Breadcrumb trail for navigation.                                      | Must     |
| 7   | Factor Control Integration        | All analysis views respect Factor Control filters. Analysts can scope reports to specific sites, BUs, project types, time periods. Saved filter sets for reuse. Factor Control panel visible in analysis view.                | Must     |
| 8   | Samsung AI Services Integration   | One-click "Generate AI Report" sends aggregated data + dimension config to Samsung AI Services API. Returns formatted Excel with PIVOT tables and AI-generated narrative insights. Download as .xlsx.                         | Must     |
| 9   | Scheduled Report Delivery         | Configure report schedule (daily, weekly, monthly) with recipient list. Smart Notify sends email with report attachment or dashboard link at configured time.                                                                 | Should   |
| 10  | Report Template Library           | Pre-built templates: "Actual vs Plan Gap," "Resource Utilization Trend," "Cross-Site Comparison," "HC Forecast," "Project Staffing Summary." One-click load, customize, and run.                                              | Should   |
| 11  | Excel / PDF Export                | Export any chart view as Excel (data table + embedded chart) or PDF (formatted report with header/footer). Samsung DSR branding applied to exports.                                                                           | Should   |
| 12  | Progressive Complexity UI         | First-time users see the NL query input prominently. Dimension/measure palette starts collapsed. Advanced features (schedules, templates, AI report) are in a secondary toolbar. Revealed as user gains familiarity.          | Must     |

---

## User Flow

### Flow A: Natural Language Query (Primary — Conversational)

1. **Eunji opens Analysis Dashboard** — sees a prominent text input at the top: "Ask a question about your resource data..."
2. **Types query** — "Show me headcount by department for Hwaseong Q2 2026"
3. **AI processes** — parses: dimension=Department, measure=Headcount, filter: Site=Hwaseong, Period=Q2 2026. Suggests chart type: horizontal bar chart
4. **Result renders in <2 seconds** — ECharts bar chart shows departments (DRAM Dev: 85, NAND Dev: 72, Test Eng: 34, Process Eng: 28, Design: 45). Interactive tooltips on hover
5. **Eunji refines** — types: "Break it down by project"
6. **Chart updates** — switches to grouped bar chart: departments x projects. Each department bar is grouped by project (DDR5, HBM4, NAND V9, etc.)
7. **Eunji requests format change** — types: "Show it as a heatmap"
8. **Chart re-renders** — ECharts heatmap: departments (rows) x projects (columns), color intensity = headcount
9. **Drills down** — clicks "DRAM Dev" cell in heatmap. Chart re-renders to show DRAM Dev teams x projects
10. **Generates AI Report** — clicks "Generate AI Report". Samsung AI Services processes the data and returns .xlsx with pivot tables and narrative: "DRAM Dev is 12% over-allocated in Q2 2026..."
11. **Saves as scheduled report** — clicks "Schedule" > Weekly, Monday 8AM > Recipients: Minho Kim, Soyeon Choi > Save

### Flow B: Structured Builder (Alternative — Visual)

1. **Eunji opens dimension palette** — expands left sidebar
2. **Drags "Department" to rows** — first dimension selected
3. **Drags "Project" to columns** — second dimension selected
4. **Drags "Headcount" to values** — measure selected
5. **Selects "Heatmap"** — from chart type bar
6. **Applies Factor Control** — Site=Hwaseong, Period=Q2 2026
7. **Chart renders** — same result as NL query, achieved through structured interaction

---

## Sketch / Wireframe

### Screen 1: Analysis Dashboard — Natural Language Entry Point

```
+------------------------------------------------------------------------------+
|  IRIS > Analysis Dashboard                                                   |
+------------------------------------------------------------------------------+
|                                                                              |
|  +--- Ask a Question -------------------------------------------------------+
|  | "Show me headcount by department for Hwaseong Q2 2026"          [Ask ▶]  |
|  | Suggestions: "headcount by site" | "utilization trend" | "gap by dept"  |
|  +--------------------------------------------------------------------------+
|                                                                              |
|  AI understood: Dimension=Department | Measure=Headcount                    |
|  Filters: Site=Hwaseong, Period=Q2 2026                                     |
|  Suggested chart: Horizontal Bar  [Change to: Heatmap | Treemap | Pie]     |
|                                                                              |
|  +--- Chart Area -----------------------------------------------------------+
|  |                                                                           |
|  |  Headcount by Department — Hwaseong — Q2 2026                            |
|  |                                                                           |
|  |  DRAM Dev       ████████████████████████████████████████████  85          |
|  |  NAND Dev       ██████████████████████████████████  72                    |
|  |  Design         █████████████████████████  45                             |
|  |  Test Eng       █████████████████  34                                     |
|  |  Process Eng    ██████████████  28                                        |
|  |                                                                           |
|  |  Click any bar to drill down to team breakdown                           |
|  |                                                                           |
|  +--------------------------------------------------------------------------+
|                                                                              |
|  +--- Refine ----+  +--- Actions --------+  +--- Factor Control ----------+|
|  | "Break it     |  | [Export Excel]      |  | Site: [Hwaseong ▼]          ||
|  |  down by      |  | [Export PDF]        |  | BU: [All ▼]                 ||
|  |  project"     |  | [AI Report ▶]      |  | Period: [Q2 2026 ▼]         ||
|  |  [Refine ▶]   |  | [Schedule]         |  | Status: [Active ▼]          ||
|  +----------------+  +-------------------+  +-----------------------------+|
+------------------------------------------------------------------------------+
```

### Screen 2: Heatmap View with Drill-Down

```
+------------------------------------------------------------------------------+
|  IRIS > Analysis > Hwaseong > Q2 2026                                       |
+------------------------------------------------------------------------------+
|  Query: "headcount by department and project, Hwaseong, Q2 2026"            |
|  Chart: Heatmap                                                              |
|                                                                              |
|  +--- Dimension/Measure Palette ---+  +--- Heatmap ----------------------+ |
|  |  (expanded on demand)           |  |                                    | |
|  |                                 |  |  Dept \ Proj | DDR5 | HBM4 | NAND| |
|  |  DIMENSIONS                     |  |  ------------|------|------|------| |
|  |  ● Department  →rows            |  |  DRAM Dev    | ████ | ██   | █   | |
|  |  ● Project    →cols             |  |  NAND Dev    | █    | ██   | ████| |
|  |  ○ Site                         |  |  Design      | ██   | ███  | █   | |
|  |  ○ Time Period                  |  |  Test Eng    | █    | █    | ██  | |
|  |  ○ Skill Category               |  |  Process Eng | █    | ██   | █   | |
|  |  ○ Job Grade                    |  |                                    | |
|  |                                 |  |  Color: ░ Low (1-5) ▓ Med (6-15) | |
|  |  MEASURES                       |  |         █ High (16+)              | |
|  |  ● Headcount  →color            |  |                                    | |
|  |  ○ Alloc %                      |  |  Click any cell to drill down     | |
|  |  ○ Gap                          |  +------------------------------------+ |
|  |  ○ Utilization                  |                                        |
|  |  ○ Hours                        |  Chart Type: [Bar|Line|Pie|Heatmap●|  |
|  +----------------------------------+             Treemap|Radar|Sankey]     |
|                                                                              |
|  +--- AI Insight (auto-generated) ----------------------------------------+ |
|  | "DRAM Dev has the highest headcount concentration on DDR5 (32 eng).     | |
|  |  NAND Dev is heavily concentrated on NAND V9 (28 eng). Consider        | |
|  |  cross-training to improve flexibility."                                | |
|  +------------------------------------------------------------------------+ |
+------------------------------------------------------------------------------+
```

### Screen 3: AI Report Generation

```
+--------------------------------------------------------------+
|           Generate AI Report — Samsung AI Services            |
+--------------------------------------------------------------+
|                                                              |
|  Data Summary:                                               |
|  Dimensions: Department x Project                            |
|  Measures: Headcount, Allocation %                           |
|  Scope: Hwaseong, Memory BU, Q2 2026                        |
|  Records: 347 allocation entries                             |
|                                                              |
|  AI will generate:                                           |
|  [✓] Excel PIVOT tables (Department x Project)              |
|  [✓] Trend analysis (Q1 vs Q2 comparison)                   |
|  [✓] AI narrative insights (recommendations)                |
|  [✓] Anomaly detection (over/under-allocation alerts)        |
|                                                              |
|  Estimated time: ~10 seconds                                 |
|                                                              |
|  [Cancel]                    [Generate Report ▶]             |
|                                                              |
|  --- Result (after generation) ---                           |
|  ✓ Report generated successfully (8.3 seconds)              |
|  IRIS_Analysis_Hwaseong_Memory_Q2_2026.xlsx                  |
|                                                              |
|  AI Summary:                                                 |
|  "DRAM Dev is 12% over-allocated in Q2 2026 due to          |
|   DDR5-Gen4 timeline expansion. NAND Dev shows 3            |
|   engineers with <50% utilization — reallocation             |
|   candidates. Recommendation: redistribute 3 engineers       |
|   from NAND V9 (legacy) to HBM4 (strategic priority)."      |
|                                                              |
|  [Download .xlsx]  [Preview]  [Email to Recipients ▶]       |
+--------------------------------------------------------------+
```

### Screen 4: Scheduled Report Manager

```
+------------------------------------------------------------------------------+
|  Scheduled Reports                                        [+ New Schedule]   |
+------------------------------------------------------------------------------+
|                                                                              |
|  | Report Name               | Frequency | Next Run     | Recipients       ||
|  |---------------------------|-----------|--------------|------------------| |
|  | Hwaseong Memory Overview  | Weekly    | Mon 8:00 AM  | Minho, Soyeon    | |
|  | Cross-Site Utilization    | Monthly   | Apr 1 8:00   | Division Mgr     | |
|  | DRAM Dev Gap Analysis     | Weekly    | Mon 8:00 AM  | Eunji, Minho     | |
|  | HC Portfolio Summary      | Quarterly | Jul 1 8:00   | Soyeon, HR Dir   | |
|  |                                                                           |
|  | [Edit] [Pause] [Run Now] [Delete]  per row                               |
+------------------------------------------------------------------------------+
```

---

## Component Inventory

| Component Type    | Name                          | Description                                                    |
| ----------------- | ----------------------------- | -------------------------------------------------------------- |
| **Mendix Page**   | Analysis_Dashboard            | Main analysis page with NL input and chart area                |
| **Mendix Page**   | Analysis_AIReport             | AI report generation dialog                                    |
| **Mendix Page**   | Analysis_Schedules            | Scheduled report management                                    |
| **Custom Widget** | ECharts Multi-Chart (W02)     | Dynamic chart rendering with type switching                    |
| **Custom Widget** | NL Query Input (W05)          | Natural language text input with suggestion dropdown           |
| **Module**        | NL Query Parser (M22a)        | Parse natural language to dimension/measure/filter structure   |
| **Module**        | ES Aggregation Builder (M22b) | Translate structured query into ES aggregation JSON            |
| **Module**        | Samsung AI Connector (M22)    | REST API integration with Samsung AI Services                  |
| **Module**        | Report Scheduler (M22c)       | Mendix Scheduled Events for recurring report execution         |
| **Module**        | Smart Notify (M32)            | Email delivery for scheduled reports                           |
| **Module**        | Factor Control (M05)          | Persistent filtering applied to all analyses                   |
| **Data Source**   | Elasticsearch 8.x             | iris-resource-allocation, iris-headcount, iris-analysis-report |

---

## Data Requirements

| Entity / Index           | Purpose                                                                                               | Storage           |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | ----------------- |
| iris-resource-allocation | Core allocation data: site, department, project, employee, period, percentage, hours                  | Elasticsearch 8.x |
| iris-headcount           | HC Portfolio data: current HC, target HC, gap, by site/department                                     | Elasticsearch 8.x |
| iris-analysis-report     | Stored analysis results for caching and scheduled report re-execution                                 | Elasticsearch 8.x |
| AnalysisView             | Saved analysis configurations: dimensions, measures, filters, chart type                              | Oracle 19c        |
| ReportSchedule           | Schedule metadata: frequency, next_run, recipient_list, analysis_view_id                              | Oracle 19c        |
| NLQueryLog               | Log of natural language queries for AI model improvement: query text, parsed result, user corrections | Oracle 19c        |

---

## Technical Feasibility Notes

| Aspect                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Feasibility           | High for core analytics (ES + ECharts). Medium for NL query parsing (requires NLP model or rules-based parser). Medium for Samsung AI integration (external API dependency).                                                                                                                                                                                                                                                                                                                                                        |
| Key Dependencies      | Elasticsearch cluster (hot-tier for current data), ECharts.js widget (W02), NL parsing library or Samsung AI for NL understanding, Samsung AI Services REST API, Smart Notify module (M32), Factor Control module (M05)                                                                                                                                                                                                                                                                                                             |
| Known Technical Risks | (1) NL query parsing accuracy — users may phrase queries ambiguously. Mitigate with suggestion dropdown and explicit confirmation of parsed intent. (2) Samsung AI Services API availability and latency — implement timeout (30s) + fallback (show raw data without AI narrative). (3) ES aggregation performance for high-cardinality dimensions (employee-level across all sites) — use composite aggregation with pagination. (4) Chart type recommendation accuracy — start with rule-based logic, iterate with user feedback. |
| Mendix 10 Constraints | NL query input is a custom pluggable widget with debounced API calls. ECharts rendering uses client-side JavaScript within Mendix widget container. Samsung AI connector uses Mendix REST module with custom timeout handling. Report scheduler uses Mendix Scheduled Events (cron-like) with retry logic.                                                                                                                                                                                                                          |
| Estimated Effort      | 3-4 sprints for NL query + dimension/measure builder + chart rendering + Factor Control integration. 2 sprints for Samsung AI integration + AI report generation. 1-2 sprints for scheduled reports + templates + export. Total: 6-8 sprints.                                                                                                                                                                                                                                                                                       |

---

## CXO Design Principles Applied

| Principle                      | How It Manifests                                                                                                                                                                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Progressive complexity**     | New users see the NL query input prominently — type a question, get a chart. The dimension/measure palette is collapsed by default. Advanced features (schedules, templates, AI reports) are in secondary toolbar. Power users reveal more complexity as they need it.  |
| **Conversational interaction** | The NL query interface lets users interact with data the way they think about it: "Show me headcount by department for Hwaseong Q2 2026." No query language to learn, no drag-and-drop to understand. Refinement works like a conversation: "Break it down by project." |
| **Confirmation before action** | The AI report generation dialog shows exactly what will be generated and estimated time before the user clicks Generate. The parsed NL query is displayed for confirmation before rendering. No surprises.                                                              |
| **Trust through transparency** | The AI insight panel shows its reasoning. The parsed query is visible ("AI understood: Dimension=Department, Measure=Headcount"). Users can correct misinterpretations. The system learns from corrections.                                                             |
| **Accessible to all roles**    | The NL interface makes analytics accessible to planners and managers — not just the dedicated analyst. Minho can type a question during a meeting and get an instant answer without waiting for Eunji's report. This democratizes data access.                          |

---

## Open Questions for Concept Validation (S3)

1. **NL query accuracy**: How well does the NL parser handle Samsung-specific terminology (e.g., "BU" for Business Unit, "P/M" for People/Material)? Validate with 20+ real queries from Samsung users.
2. **NL vs. structured preference**: Do Samsung DSR users prefer natural language or dimension/measure drag-and-drop? Test both in usability sessions. The answer may differ by role (Eunji prefers structured, Minho prefers NL).
3. **AI report quality**: Does Samsung AI Services generate sufficiently insightful narrative, or is it generic? Validate with sample data and real Samsung analytics expectations.
4. **Chart type suggestion accuracy**: Do users agree with the AI's chart type suggestions, or do they frequently override? Track override rate in prototype testing.
5. **Query refinement UX**: Is the conversational refinement ("Break it down by project") intuitive, or do users expect to start over? Validate the mental model with 5+ users.
6. **Samsung AI Services availability**: What is the SLA for Samsung AI Services API? Is fallback (show data without AI narrative) acceptable to Samsung?

---

## Evaluation Criteria

| Criterion                    | Score (1-5) | Rationale                                                                                                                                                                                               |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desirability (user value)    | 5           | Transforms Eunji's daily workflow. Replaces 60%+ of time spent on Excel. NL query makes analytics accessible to all roles, not just analysts.                                                           |
| Feasibility (technical)      | 3           | ES aggregations + ECharts are proven. NL query parsing adds complexity. Samsung AI API is an external dependency.                                                                                       |
| Viability (business)         | 4           | Samsung Req 10 (analysis reporting), Req 11 (AI reporting), Req 8 (analysis views). Three requirements covered.                                                                                         |
| Innovation                   | 5           | Conversational analytics with AI-powered chart suggestion and Samsung AI report generation is forward-looking. No competitive resource planning tool offers NL query + AI-generated narrative insights. |
| Alignment with AX Principles | 5           | AI as Team Member (Principle 8). Hypothesis: NL analytics reduce report generation time by 80%+ and democratize data access beyond the analyst role.                                                    |
| **Total**                    | **22/25**   |                                                                                                                                                                                                         |

---

## Decision

| Attribute | Detail                                                                                                                                                                                                                                                                                                                                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status    | **Selected** — proceed to prototype                                                                                                                                                                                                                                                                                                   |
| Rationale | Scores 22/25. Addresses Samsung Req 8, 10, 11 directly. Conversational analytics is the key CXO differentiator — making analytics accessible to all 4 personas, not just Eunji. Samsung AI integration is a unique value proposition. NL query input is the headline UX innovation that positions IRIS as a next-generation platform. |
| Next Step | S2 Prototype — design Analysis Dashboard with NL query and AI report generation in detail                                                                                                                                                                                                                                             |

---

---

## Cross-Concept Dependencies

```
                    CONCEPT-D: Smart Delta Engine
                    (Version Engine — FOUNDATIONAL)
                         |            |           |
                    provides     provides     provides
                    versioning   diff/merge   delta sync
                         |            |           |
              +----------+----+  +----+----+  +--+--------+
              |               |  |         |  |           |
         CONCEPT-A:      CONCEPT-B:    CONCEPT-C:    External
         Collaborative   Simulation    Global         Systems
         Gantt           Sandbox       Cockpit        (PROMIS,
         (uses conflict  (uses version (uses ES       N-PLM)
          resolution +    snapshots +   aggregations
          draft/perm      clone/compare on versioned
          workflow)       workflow)     data)
              |               |            |
              +-------+-------+            |
                      |                    |
                 CONCEPT-E: AI-Powered Analysis Builder
                 (analyzes data from all planning modules
                  via Elasticsearch aggregation layer +
                  NL query interface + Samsung AI Services)
```

### Shared Infrastructure

| Component               | Used By             | Description                             |
| ----------------------- | ------------------- | --------------------------------------- |
| xDHTML Gantt (W01)      | A, B, C (read-only) | Core Gantt widget, extended per concept |
| ECharts.js (W02, W04)   | B, C, E             | Charts, maps, heatmaps, treemaps        |
| Diff Viewer (W03)       | A, D                | Side-by-side version comparison         |
| Version Engine (M03)    | A, B, D             | Snapshots, states, archival             |
| Factor Control (M05)    | C, E                | Persistent filtering across views       |
| Smart Notify (M32)      | A, D, E             | Email notifications, scheduled delivery |
| Approval Workflow (M04) | A, B, D             | Submit/Approve/Reject flow              |

### Implementation Sequence

| Phase                     | Concepts                                                       | Sprint Estimate | Rationale                                |
| ------------------------- | -------------------------------------------------------------- | --------------- | ---------------------------------------- |
| **Phase 1 (Foundation)**  | D (Version Engine + Diff + Delta Sync)                         | Sprints 1-4     | Everything depends on this               |
| **Phase 1 (Core UX)**     | A (Collaborative Gantt — concurrent editing + inline conflict) | Sprints 2-5     | Core daily workflow, builds on D         |
| **Phase 1 (Entry Point)** | C (Global Cockpit — world map + drill-down)                    | Sprints 3-5     | First screen users see, drives adoption  |
| **Phase 2 (Planning)**    | B (Simulation Sandbox — clone + compare)                       | Sprints 5-8     | Depends on D for versioning, A for Gantt |
| **Phase 2 (Analytics)**   | E (AI Analysis Builder — NL query + AI reports)                | Sprints 6-9     | Depends on ES data from all modules      |

---

## Concept Score Summary

| Concept                    | Desirability | Feasibility | Viability | Innovation | AX Alignment | Total     |
| -------------------------- | ------------ | ----------- | --------- | ---------- | ------------ | --------- |
| **A: Collaborative Gantt** | 5            | 3           | 5         | 5          | 5            | **23/25** |
| **E: AI Analysis Builder** | 5            | 3           | 4         | 5          | 5            | **22/25** |
| **C: Global Cockpit**      | 5            | 4           | 5         | 3          | 4            | **21/25** |
| **D: Smart Delta Engine**  | 4            | 4           | 5         | 3          | 5            | **21/25** |
| **B: Simulation Sandbox**  | 4            | 3           | 4         | 5          | 4            | **20/25** |

All 5 concepts are **Selected** for prototyping. Concept D (Delta Engine) has highest implementation priority as foundational infrastructure despite not having the highest score.

---

## CXO Summary: Key UX Differentiators

This CXO v2.0 concept sketch introduces five design innovations that differentiate IRIS from any existing resource planning tool:

1. **Inline Conflict Resolution** (Concept A) — conflicts are resolved within the Gantt row, not in modal dialogs. Users stay in context, see both versions with attribution, and resolve without losing their place.

2. **Safe Experimentation Mental Model** (Concept B) — the sandbox is designed to make users feel safe to explore bold changes. Every visual cue (amber banner, discard button, variant system) reinforces that nothing can go wrong.

3. **Progressive Disclosure Drill-Down** (Concept C) — the four-level hierarchy (World Map -> Site -> Department -> Individual) ensures users are never overwhelmed. Each level adds detail without requiring comprehension of the full dataset.

4. **Git-Like Version Mental Model** (Concept D) — version control is made accessible to non-technical users through familiar visual patterns (timeline, color-coded diffs, summary-first detail). No Git terminology, all Git power.

5. **Conversational Analytics** (Concept E) — natural language query input democratizes data access. Planners and managers can ask questions and get charts without waiting for analyst reports or learning query languages.

These five innovations are designed to earn user trust, reduce anxiety about new tools, and make IRIS feel intuitive from the first interaction. They are grounded in validated user research (DISCOVER phase) and will be tested in concept validation usability sessions (S3).

---

## Related Templates and Guides

- **T14_CONCEPT_SKETCH** — Template used for this document
- **T13_HMW_IDEATION_WORKSHOP** — Source workshop for these concepts
- **T15_USER_STORY** — User stories to be derived from these concepts (S2)
- **S2_PROTOTYPING_GUIDE** — Next step: build prototypes from these concept sketches

---

_This document follows the AX Transformation Framework T14 Concept Sketch template._
_All 5 concepts selected for prototyping. Next step: S2 — Prototype Specifications._
_CXO v2.0 — authored 2026-03-21 with focus on UX innovation and design rationale._
