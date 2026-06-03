# Interview Notes — IRIS Resource Planning Platform for Samsung DSR

> **AX Transformation Framework v2.0.0** | DISCOVER Phase — Task D2c: Synthesized Interview Notes
>
> **Product**: IRIS (Intelligent Resources Information System)
> **Client**: Samsung Electronics — Device Solutions Research (DSR)
> **Role**: CXO (User Experience Lead)
> **Date**: 2026-03-21

---

## Document Purpose

This document contains synthesized interview notes from 10 semi-structured sessions with Samsung DSR stakeholders across all actor roles, sites, and divisions relevant to the IRIS project. Interviews were conducted following the Five-Act Interview Method per the D2 Interview Guide, with role-specific supplemental questions.

**Context**: IRIS is a NEW BUILD resource planning platform on Mendix 10, replacing the current PM Planner (Mendix 7/8) which cannot be upgraded. These interviews explore PM Planner pain points, workflow patterns, and unmet needs to inform IRIS design.

**Sites Covered**: Hwaseong (HQ), Pyeongtaek, Austin (TX), Xi'an (referenced), Giheung (referenced)
**Divisions Covered**: Memory (DRAM), Memory (NAND), System LSI, Foundry, HR Operations, Resource Analytics, IT/Admin, Infrastructure

---

## Tagging Legend

| Tag              | Meaning                                                   |
| ---------------- | --------------------------------------------------------- |
| `[PAIN]`         | A frustration, problem, or unmet need                     |
| `[QUOTE]`        | A notable verbatim quote worth preserving                 |
| `[INSIGHT]`      | A non-obvious observation or learning                     |
| `[FEATURE]`      | A desired capability or feature request                   |
| `[SURPRISE]`     | Something unexpected that challenges assumptions          |
| `[WORKFLOW]`     | Process step, handoff, or tool-switching moment           |
| `[METRIC]`       | Quantifiable data (time, frequency, cost, error rate)     |
| `[EMOTION]`      | Emotional response (frustration, anxiety, satisfaction)   |
| `[REUSE]`        | Pattern from current PM Planner worth preserving in IRIS  |
| `[WORKAROUND]`   | User-created solution to compensate for system gaps       |
| `[MENTAL-MODEL]` | How the user conceptualizes their work or the system      |
| `[DELIGHT]`      | Something that would genuinely excite or satisfy the user |

---

## Interview Summary Matrix

| ID      | Participant   | Role             | Site               | Division           | Duration | Pain Score | Top Priority                           |
| ------- | ------------- | ---------------- | ------------------ | ------------------ | -------- | ---------- | -------------------------------------- |
| INT-001 | Jisoo Park    | Resource Planner | Hwaseong           | Memory (DRAM)      | 58 min   | 9/10       | Req 3 (Concurrent save + merge)        |
| INT-002 | Daniel Choi   | Resource Planner | Pyeongtaek         | Memory (NAND)      | 52 min   | 8/10       | Req 2 (Version history + delta sync)   |
| INT-003 | Mike Sullivan | Resource Planner | Austin             | System LSI         | 55 min   | 9/10       | Req 7/8 (Cross-site visibility)        |
| INT-004 | Minho Kim     | Planning Manager | Hwaseong           | Memory (DRAM)      | 60 min   | 8/10       | Req 3 (Approval workflow)              |
| INT-005 | Eunji Baek    | Planning Manager | Pyeongtaek         | Memory (NAND)      | 50 min   | 7/10       | Req 2 (Delta sync to PROMIS)           |
| INT-006 | Taehyung Yoon | Division Manager | Hwaseong HQ        | Cross-division     | 45 min   | 8/10       | Req 7 (World map dashboard)            |
| INT-007 | Yuna Han      | HR Planner       | Hwaseong           | HR Operations      | 48 min   | 7/10       | Req 9 (HeadCount Portfolio)            |
| INT-008 | Donghyun Bae  | Analyst          | Pyeongtaek         | Resource Analytics | 56 min   | 9/10       | Req 10/11 (Reporting + AI)             |
| INT-009 | Jihye Kang    | Site Admin       | Hwaseong           | IT/Admin           | 46 min   | 6/10       | Req 5/6 (Master data + Factor Control) |
| INT-010 | Seungwoo Park | IT System Admin  | Samsung IT (Suwon) | Infrastructure     | 52 min   | 7/10       | Req 12 (Server + ES cluster)           |

---

## INT-001: Jisoo Park — Resource Planner, Hwaseong, Memory (DRAM)

### Session Metadata

| Field            | Value                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| Interview ID     | INT-001                                                                 |
| Date             | 2026-03-17                                                              |
| Time             | 10:00 - 10:58 KST (58 minutes)                                          |
| Format           | In-person — Samsung DSR Hwaseong, Building 17, Meeting Room 3F-A        |
| Interviewer      | CXO (Amoza)                                                             |
| Note-Taker       | AI Production Team                                                      |
| Observer         | CPO (Amoza) — silent observer                                           |
| Recording        | Yes — verbal consent at 10:02. Video recording of screen share segments |
| Consent Obtained | Yes — written consent form signed before session                        |
| Screener Score   | 21/23                                                                   |
| Pain Score       | 9/10                                                                    |

### Participant Background

Jisoo Park is a Senior Resource Planner at Samsung DSR's Hwaseong site, Memory (DRAM) division. She has worked at Samsung for 9 years, spending the last 6 in resource planning. She manages P/M planning for DDR5 and HBM4 development projects — 18 active projects simultaneously across 4 groups with a combined headcount allocation of ~320 personnel. She is the most experienced individual contributor on her 9-person planning team and is informally called the "PM Planner oracle" by colleagues. She uses PM Planner 6-7 hours daily, supplemented by extensive Excel modeling.

### Section 1 — Background & Daily Workflow

| Time  | Topic          | Notes                                                                                                                                                                                                                                                                                                                                                           | Tags                    |
| ----- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 10:03 | Daily routine  | Arrives at 8:15 AM. Opens PM Planner first, then her personal Excel workbook ("The Command Center" — 52 tabs), then email. Checks overnight change requests from DDR5 and HBM4 project managers. Morning ritual takes 30-40 minutes before she begins actual planning work.                                                                                     | `[WORKFLOW]`            |
| 10:07 | Team structure | 9-person planning team, 4 groups under Memory DRAM. Each planner owns 2-4 projects. Jisoo owns the most complex ones (DDR5 Gen3, HBM4 Phase 1, HBM4 Phase 2) because "nobody else wants to touch them — the P/M models are enormous."                                                                                                                           | `[INSIGHT]`             |
| 10:10 | Tool ecosystem | PM Planner for data entry, Excel for simulation and analysis, email and Teams for approval coordination, N-PLM for master data verification, PROMIS reports for profit validation. "I have 6 browser tabs and 3 Excel files open at all times. My desktop looks like mission control."                                                                          | `[WORKFLOW]` `[QUOTE]`  |
| 10:14 | Planning cycle | Project managers submit resource requests via email/Teams -> Jisoo enters/updates P/M data in PM Planner -> Creates or updates resource roadmap -> Runs what-if scenarios in Excel -> Submits for manager approval via email -> After verbal approval, data syncs to PROMIS and N-PLM. Full cycle: 3-5 business days. For HBM4: up to 7 days due to complexity. | `[WORKFLOW]` `[METRIC]` |

**CXO Behavioral Observation**: Jisoo spoke with authority and precision. She gestured toward her monitor instinctively when describing workflows — muscle memory from years of repetition. Her posture was relaxed during background questions, indicating comfort with the interview setting. She made eye contact consistently and frequently used specific numbers (not estimates), suggesting high confidence in her process knowledge.

### Section 2 — Current PM Planner Experience

| Time  | Topic                            | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                          | Tags                                         |
| ----- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 10:18 | Concurrent editing — the #1 pain | "We have 9 planners on this team. HBM4 is the hottest project at Samsung right now. Three of us edit HBM4's P/M simultaneously — different groups, same project. When two of us save at the same time, one person's work vanishes. No warning, no merge dialog, just gone. We've lost entire afternoons of work." Severity: 10/10. Frequency: 2-3 times per week.                                                                              | `[PAIN]` `[QUOTE]` `[EMOTION]`               |
| 10:23 | The editing calendar workaround  | Team uses a shared Excel spreadsheet — "the editing calendar" — where planners reserve 2-hour time slots to edit specific projects. "We schedule who can touch which project at what hour. It's like booking a meeting room, except the room is a database record. If someone forgets to check the calendar and edits out of turn, their changes get eaten."                                                                                   | `[WORKAROUND]` `[QUOTE]`                     |
| 10:27 | Impact quantification            | Estimates team loses 6-8 hours per week to overwrite incidents and coordination overhead of the editing calendar. "That's almost a full person's productivity just managing conflict avoidance. We've essentially hired someone to prevent the system from destroying our work."                                                                                                                                                               | `[METRIC]` `[INSIGHT]`                       |
| 10:30 | Version tracking                 | No per-project version history in PM Planner. "When my manager asks 'what changed in HBM4 since last Tuesday?' I go to my personal Excel backup, open both snapshots, and compare cell by cell across 200+ rows. There's no diff view, no change log, no audit trail."                                                                                                                                                                         | `[PAIN]` `[WORKFLOW]`                        |
| 10:34 | The Command Center workbook      | Jisoo maintains a 52-tab Excel workbook she calls "The Command Center" — mirrors PM Planner data plus simulation models, cross-project resource summaries, scenario comparisons, and reporting templates. She updates it in parallel with PM Planner. "If PM Planner crashed permanently tomorrow, I could keep DRAM planning going for three weeks on this Excel file alone. That tells you everything about how much value PM Planner adds." | `[WORKAROUND]` `[SURPRISE]` `[MENTAL-MODEL]` |
| 10:38 | P/M editing grid — what to keep  | "The cell-based input grid for month-by-month PM values is actually quite good. The layout makes sense — project on the Y-axis, months on the X-axis, P/M values in the cells. Don't change this. Just add real-time conflict detection on top of it."                                                                                                                                                                                         | `[REUSE]` `[FEATURE]`                        |

**CXO Behavioral Observation**: Jisoo's voice elevated noticeably when discussing concurrent editing — her speech accelerated and she leaned forward. This was the emotional peak of the interview. When describing the editing calendar workaround, she laughed with a mixture of pride (clever solution) and frustration (shouldn't be necessary). When showing her "Command Center" Excel workbook (screen share at 10:34), she navigated the 52 tabs with muscle-memory fluency — no hesitation, no searching. This workbook IS her planning tool; PM Planner is secondary.

### Section 3 — Pain Points Deep Dive

| Time  | Topic                    | Notes                                                                                                                                                                                                                                                                                                                                                                       | Tags                             |
| ----- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 10:40 | PROMIS full sync waste   | "We sync to PROMIS every two weeks. It takes 4+ hours because it sends all 230+ projects. For HBM4's last cycle, only 5 projects had actual changes. The other 225 were just wasted processing time. And worse — the full sync sometimes triggers PROMIS recalculations on unchanged projects, which confuses the finance team."                                            | `[PAIN]` `[METRIC]`              |
| 10:43 | Simulation is 100% Excel | "PM Planner has zero simulation capability for DRAM planning. What if we accelerate HBM4 Phase 2 by pulling 30 engineers from DDR5 Gen3? What's the cascade impact on DDR5 timeline? I model this entirely in Excel — 40+ tabs, thousands of VLOOKUP formulas. One scenario takes a full day to set up. If management asks for 3 scenarios, that's 3 days of my week gone." | `[PAIN]` `[METRIC]` `[WORKFLOW]` |
| 10:47 | N-PLM master data lag    | "When Samsung restructured the DRAM team in January — merged two groups, created a new HBM-dedicated group — it took 3 weeks for N-PLM to reflect the new structure. For those 3 weeks, my PM Planner plans referenced teams that no longer existed. I was planning for ghosts."                                                                                            | `[PAIN]` `[INSIGHT]`             |
| 10:50 | Cross-site blindness     | "Austin has 40 DRAM engineers that sometimes get pulled into Hwaseong projects. I have no visibility into Austin's allocation. I find out they're unavailable when the project manager tells me at the weekly meeting. By then I've already built a plan assuming those engineers are available."                                                                           | `[PAIN]` `[WORKFLOW]`            |

**CXO Behavioral Observation**: During the simulation discussion, Jisoo pulled up her Excel workbook again to show the VLOOKUP formulas — she wanted to prove the complexity. Her frustration was directed at the system, not at Samsung or her management. She drew a clear distinction: "PM Planner is a data entry tool. I need a planning tool." This mental model — data entry vs. planning — appeared repeatedly and is likely shared across planners.

### Section 4 — Ideal Solution & Feature Priorities

| Time  | Topic                   | Notes                                                                                                                                                                                                                                                                                     | Tags                         |
| ----- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 10:52 | Real-time collaboration | "Like Google Docs for resource planning. I see your cursor, you see mine. If we're editing the same cell, the system warns us and lets us resolve it. No more editing calendar. No more lost work. This is non-negotiable for IRIS."                                                      | `[FEATURE]` `[DELIGHT]`      |
| 10:54 | Simulation sandboxes    | "Let me clone the current HBM4 roadmap into a sandbox. Make changes. See the impact on capacity across all DRAM projects — not just the one I'm editing. Then decide whether to commit those changes to the live plan. Don't force me to choose between my live data and my experiments." | `[FEATURE]` `[MENTAL-MODEL]` |
| 10:55 | Version diff view       | "Show me what changed between version 7 and version 9 of HBM4's plan. Highlight additions in green, deletions in red, modifications in yellow. Like track changes in Word. I should see this in 2 seconds, not after 45 minutes of manual comparison."                                    | `[FEATURE]`                  |

### Section 5 — Requirements Validation

| Req                                          | Rating         | Notes                                                                                        |
| -------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| 0 (Mendix 10)                                | Important      | "UI upgrade would be nice, but not if it delays the features I actually need"                |
| 1 (Separate Roadmap/Simulation)              | **Critical**   | "This is fundamental. Separating roadmap from simulation unlocks my entire workflow"         |
| 2 (Version history per project + delta sync) | **Critical**   | "Per-project versioning and delta sync would save me 6+ hours every sync cycle"              |
| 3 (Concurrent save + merge)                  | **Critical**   | "THE most important requirement. Concurrent editing with intelligent merge is life-changing" |
| 4 (Roadmap versioning)                       | **Critical**   | "Same importance as Req 3 — I need both"                                                     |
| 5 (N-PLM integration)                        | Important      | "Master data freshness is a real issue but it's not my daily pain"                           |
| 6 (Factor Control)                           | Important      | "Would help filter views when I have 18 projects across 4 groups"                            |
| 7 (World map)                                | Nice-to-have   | "Cool for management but I need the editing grid and simulation more"                        |
| 8 (Analysis views)                           | Nice-to-have   | "Not my primary use case — I plan, I don't analyze at the global level"                      |
| 9 (HeadCount Portfolio)                      | Nice-to-have   | "Not my domain — HR handles this"                                                            |
| 10 (Analysis Reporting)                      | Important      | "Would save me from building Excel reports every Friday"                                     |
| 11 (AI Reporting)                            | Nice-to-have   | "Interesting but I need to see it work before I trust it for HBM4 data"                      |
| 12 (Server/ES)                               | Not my concern | "IT handles infrastructure"                                                                  |

**Top 3 Priorities**: Req 3, Req 1, Req 2

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)                                        | Rebuild (Replace Entirely)                           |
| -------------------------------------------------------------- | ---------------------------------------------------- |
| P/M editing grid layout (month-by-month cell-based input)      | Concurrent editing model (currently: last-save-wins) |
| Project-level data structure (org hierarchy, skill dimensions) | Version management (currently: nonexistent)          |
| Basic Gantt timeline view (concept, not implementation)        | Simulation capability (currently: absent)            |
|                                                                | Sync model to PROMIS (currently: full sync only)     |
|                                                                | Approval workflow (currently: email-based)           |

### Post-Interview Debrief

**Top 3 Insights:**

1. Concurrent editing is not a minor inconvenience — it causes actual data loss on HBM4 (Samsung's highest-priority DRAM program) and forces a manual "editing calendar" workaround that consumes ~1 FTE of productivity weekly
2. The 52-tab "Command Center" Excel workbook is a fully parallel shadow system, proving PM Planner is fundamentally insufficient for planning. If a planner can operate for 3 weeks without PM Planner, the system's value proposition is critically weak
3. Simulation needs are entirely unmet — every what-if scenario for HBM4 resource allocation is built from scratch in Excel, costing full days per scenario

**Biggest Surprise**: The editing calendar — planners literally schedule 2-hour time slots to avoid overwriting each other. This is organizational overhead masquerading as process. The fact that this workaround exists at all means the concurrent editing problem has moved from "frustrating" to "structurally embedded."

**Assumptions Confirmed**: Concurrent editing (Req 3) is the universal #1 pain. Version management (Req 1, 2, 4) is the universal #2 pain. Simulation is done entirely outside PM Planner.

**Assumptions Challenged**: We assumed PM Planner's Gantt view would be criticized. Jisoo actually likes the concept — her objection is to the lack of interactivity and simulation, not the visualization itself.

**Follow-Up Needed**:

- [ ] Request screen-share walkthrough of "The Command Center" workbook to map shadow planning patterns
- [ ] Document the editing calendar protocol — may inform IRIS's conflict resolution UX
- [ ] Validate HBM4 planning cycle timeline (7 days) with project manager for cross-reference

---

## INT-002: Daniel Choi — Resource Planner, Pyeongtaek, Memory (NAND)

### Session Metadata

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| Interview ID     | INT-002                                 |
| Date             | 2026-03-17                              |
| Time             | 14:00 - 14:52 KST (52 minutes)          |
| Format           | Remote — Microsoft Teams, video on      |
| Interviewer      | CXO (Amoza)                             |
| Note-Taker       | AI Production Team                      |
| Observer         | CPO (Amoza) — silent observer           |
| Recording        | Yes — verbal consent at 14:02           |
| Consent Obtained | Yes — digital consent form acknowledged |
| Screener Score   | 19/23                                   |
| Pain Score       | 8/10                                    |

### Participant Background

Daniel Choi is a Resource Planner at Samsung DSR's Pyeongtaek site, Memory (NAND) division. He has been at Samsung for 5 years, the last 3 in resource planning. He manages P/M planning for 10 NAND flash development projects (V-NAND 9th generation, QLC optimization, CXL-enabled NAND) and is part of a 6-person planning team. He transferred from Samsung's manufacturing planning department and brings a production-line mindset to resource planning — efficiency-focused, process-oriented, frustrated by waste.

### Section 1 — Background & Daily Workflow

| Time  | Topic                   | Notes                                                                                                                                                                                                                                                                                                                         | Tags                     |
| ----- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 14:03 | Daily routine           | Starts at 8:30 AM. First action: check if N-PLM pushed any organization structure changes overnight. "I start every morning by checking if reality has changed while I was asleep. If N-PLM reorganized a team, my plans might reference people who no longer exist in that structure." Opens PM Planner second, email third. | `[WORKFLOW]` `[INSIGHT]` |
| 14:07 | Project portfolio       | 10 active NAND projects. V-NAND 9th gen is the flagship — 120 engineers across 3 groups. QLC optimization is smaller but politically sensitive (direct VP attention). CXL-enabled NAND is new — started 2 months ago, still ramping resources.                                                                                | `[WORKFLOW]`             |
| 14:10 | Cross-site coordination | Works closely with Hwaseong NAND planners. "Pyeongtaek handles the newer NAND technologies. Hwaseong has the legacy lines plus HBM. When V-NAND 9th gen needs specialized engineers from Hwaseong, I have to coordinate through email and weekly meetings. There's no system-level view of shared resources."                 | `[WORKFLOW]` `[PAIN]`    |

**CXO Behavioral Observation**: Daniel is methodical and precise. He spoke in numbered lists — "first I check N-PLM, second I open PM Planner, third I review emails." His manufacturing background is evident in how he frames problems: in terms of waste, cycle time, and throughput. He treats planning as a production process and measures its efficiency.

### Section 2 — Current PM Planner Experience

| Time  | Topic                           | Notes                                                                                                                                                                                                                                                                                                                           | Tags                                 |
| ----- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 14:14 | Version tracking pain           | "I manage 10 projects. Each goes through 3-5 revisions per month. That's 30-50 versions I need to mentally track. PM Planner doesn't show me which projects changed since the last PROMIS sync. I have to open each project individually and compare against my personal snapshots."                                            | `[PAIN]` `[METRIC]`                  |
| 14:18 | The version notebook            | Daniel keeps a physical paper notebook where he records every change he makes to PM Planner — timestamp, project ID, what changed, why. "If the system won't track my changes, I will. But it's medieval. I'm a planner at one of the world's most advanced semiconductor companies, and I track versions in a paper notebook." | `[WORKAROUND]` `[QUOTE]` `[EMOTION]` |
| 14:22 | PROMIS full sync frustration    | "PROMIS receives all 150 projects from Pyeongtaek even when only 6 changed. The PROMIS team calls me: 'which ones actually changed?' I tell them. They manually filter. This happens every two weeks. It's a process that shouldn't exist."                                                                                     | `[PAIN]` `[METRIC]` `[WORKFLOW]`     |
| 14:26 | N-PLM master data inconsistency | "The V-NAND 9th gen team was restructured 3 weeks ago — split into two sub-groups for process and design. N-PLM still shows the old single group. My plans reference a group that technically doesn't exist anymore in the master data. I'm planning for a phantom organization."                                               | `[PAIN]` `[INSIGHT]`                 |
| 14:29 | Gantt view — what works         | "The xDHTML Gantt chart is one of the few things I like. I can see V-NAND timelines overlapping with QLC timelines and spot resource conflicts visually. The timeline visualization concept is good. The implementation is slow and buggy, but the concept is right."                                                           | `[REUSE]`                            |

**CXO Behavioral Observation**: Daniel tapped his paper notebook when discussing version tracking — it was sitting on his desk during the Teams call. He held it up to the camera briefly. The notebook had color-coded tabs (one per project). This level of manual effort to compensate for system gaps is striking. He was calm throughout — not angry, but resigned. His emotional register was "acceptance of a broken system" rather than "frustration demanding change."

### Section 3 — Pain Points Deep Dive

| Time  | Topic                         | Notes                                                                                                                                                                                                                                                                                                                                                                      | Tags                             |
| ----- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 14:32 | Simulation module abandoned   | "We used to try PM Planner's simulation. The entire Pyeongtaek NAND team stopped using it 2 years ago. It's so limited — can't handle multi-project scenarios, can't model engineer skill transitions, can't simulate timeline shifts. We all moved to Excel. The simulation module in PM Planner is dead to us."                                                          | `[PAIN]` `[SURPRISE]`            |
| 14:36 | Cross-site resource conflicts | "Last quarter, V-NAND 9th gen needed 15 specialized process engineers. I allocated them. What I didn't know: Hwaseong had already allocated 10 of those same engineers to DDR5. We discovered this at the monthly reconciliation meeting — 6 weeks after both plans were made. Six weeks of planning based on a fiction."                                                  | `[PAIN]` `[METRIC]` `[WORKFLOW]` |
| 14:40 | Data entry errors compound    | "No undo in PM Planner. If I accidentally overwrite a cell with wrong data and save, that wrong number is now the truth. I have to find the right number from my notebook or Excel backup. Last month, an accidental overwrite on QLC's Q3 allocation went undetected for 2 weeks. It showed 45 engineers when the correct number was 54. Nine phantom missing engineers." | `[PAIN]` `[METRIC]` `[SURPRISE]` |

**CXO Behavioral Observation**: Daniel's voice dropped when describing the QLC allocation error — quieter, more serious. This was the anxiety moment. The idea that incorrect data can persist undetected in a system managing hundreds of engineers clearly weighs on him. He checked his notebook reflexively when recounting the incident, as if confirming the correct number for comfort.

### Section 4 — Ideal Solution & Feature Priorities

| Time  | Topic                | Notes                                                                                                                                                                                                                              | Tags                    |
| ----- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 14:43 | Diff view            | "Show me two versions side by side with changes highlighted. Red for removals, green for additions, yellow for modifications. Like track changes in Word or a code diff. I shouldn't have to export to Excel to compare versions." | `[FEATURE]`             |
| 14:45 | Delta sync tagging   | "Let me tag which projects changed so only those go to PROMIS. Better yet — detect changes automatically. If V-NAND was modified but QLC wasn't, only V-NAND goes to PROMIS. Simple checkbox or automatic change detection."       | `[FEATURE]`             |
| 14:47 | Undo/rollback        | "Give me an undo button. Let me roll back to any previous state within a project. Not just Ctrl+Z in a cell — system-level rollback with full history."                                                                            | `[FEATURE]` `[DELIGHT]` |
| 14:49 | Change notifications | "When Hwaseong modifies a plan that affects shared NAND resources, notify me. Real-time. Don't make me discover it at the monthly meeting."                                                                                        | `[FEATURE]`             |

### Section 5 — Requirements Validation

| Req | Rating         | Notes                                                                                                       |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| 0   | Important      | "Mendix 10 is an IT concern, but if it means faster UI, I'm for it"                                         |
| 1   | **Critical**   | "Separating roadmap from simulation would bring me back to using the system for actual planning"            |
| 2   | **Critical**   | "Per-project versioning and delta sync are my top two. Would save me a full day per week"                   |
| 3   | **Critical**   | "Concurrent save with merge — essential. But I rank versioning higher because I work solo on most projects" |
| 4   | **Critical**   | "Roadmap versioning — yes, same as Req 2 in importance"                                                     |
| 5   | Important      | "N-PLM lag causes real problems. 3-week delay after reorg is unacceptable"                                  |
| 6   | Important      | "Factor control filtering would help when I have 10 projects open"                                          |
| 7   | Nice-to-have   | "World map is for managers, not planners"                                                                   |
| 8   | Nice-to-have   | "Same — analysis views are for the analytics team"                                                          |
| 9   | Nice-to-have   | "HR domain, not mine"                                                                                       |
| 10  | Important      | "Would eliminate my Friday reporting ritual"                                                                |
| 11  | Nice-to-have   | "Interesting, but I need reliable basics before AI"                                                         |
| 12  | Not my concern | "IT handles this"                                                                                           |

**Top 3 Priorities**: Req 2, Req 3, Req 1

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)              | Rebuild (Replace Entirely)                              |
| ------------------------------------ | ------------------------------------------------------- |
| Gantt timeline visualization concept | Version management (currently: paper notebook)          |
| P/M data entry grid layout           | PROMIS sync model (currently: full sync)                |
| Project-level data organization      | Simulation module (currently: abandoned)                |
|                                      | Undo/rollback capability (currently: nonexistent)       |
|                                      | Cross-site resource visibility (currently: email-based) |

### Post-Interview Debrief

**Top 3 Insights:**

1. The physical version notebook with color-coded project tabs is the most tangible evidence of PM Planner's version management failure — a planner at one of the world's most advanced semiconductor companies tracking system changes on paper
2. Pyeongtaek's entire NAND planning team abandoned PM Planner's simulation module 2 years ago — it's not just underused, it's actively rejected
3. The QLC allocation error (45 vs. 54 engineers) going undetected for 2 weeks demonstrates that PM Planner lacks basic data integrity safeguards — no change detection, no anomaly alerting, no audit trail

**Biggest Surprise**: The 9-engineer phantom allocation error on QLC. An incorrect number persisted for 2 weeks in a system managing semiconductor resource allocation worth millions. This is a data integrity risk, not just a usability problem.

**Assumptions Confirmed**: Version management is universally manual. Simulation module is abandoned. PROMIS full sync is wasteful.

**Assumptions Challenged**: We assumed concurrent editing would be Daniel's #1 pain. It's #2 — he prioritizes version tracking because he often works solo on his 10 projects. This suggests pain ranking varies by work pattern (solo vs. collaborative).

**Follow-Up Needed**:

- [ ] Photograph Daniel's version notebook (with consent) as a design artifact for IRIS version management UX
- [ ] Investigate the QLC allocation error incident in more detail — understand detection pathway
- [ ] Ask Pyeongtaek team when exactly they abandoned PM Planner simulation and what triggered the decision

---

## INT-003: Mike Sullivan — Resource Planner, Austin, System LSI

### Session Metadata

| Field            | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Interview ID     | INT-003                                              |
| Date             | 2026-03-18                                           |
| Time             | 09:00 - 09:55 CST / 00:00 - 00:55 KST+1 (55 minutes) |
| Format           | Remote — Microsoft Teams, video on                   |
| Interviewer      | CXO (Amoza)                                          |
| Note-Taker       | AI Production Team                                   |
| Observer         | CDO (Amoza) — silent observer                        |
| Recording        | Yes — verbal consent at 09:02                        |
| Consent Obtained | Yes — digital consent form acknowledged              |
| Screener Score   | 20/23                                                |
| Pain Score       | 9/10                                                 |

### Participant Background

Mike Sullivan is a Senior Resource Planner at Samsung Austin Semiconductor (SAS), System LSI division. He has been at Samsung for 6 years, having joined from Texas Instruments where he spent 8 years in program management. He is one of only two planners at the Austin site, managing P/M planning for 12 System LSI projects including Exynos 2600, ISOCELL next-gen, and custom SoC designs. His unique challenge: the 15-hour time zone gap between Austin (CST) and Hwaseong (KST) means he operates in a permanently asynchronous environment where changes happen while he sleeps.

### Section 1 — Background & Daily Workflow

| Time  | Topic                          | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Tags                                   |
| ----- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 09:03 | The morning detective ritual   | "Every morning I come in at 7:30 AM Austin time. Hwaseong has been working for 15 hours while I was asleep. My first 60-90 minutes are spent figuring out what changed overnight. I check PM Planner — did any numbers move? I check email — did anyone send change notifications? I check Teams — any messages from Korean colleagues? PM Planner gives me zero help with this. No change log, no notification, no 'what's different since yesterday' view."     | `[WORKFLOW]` `[PAIN]` `[QUOTE]`        |
| 09:08 | Team size and isolation        | "There are only two of us at Austin. My colleague handles the custom SoC designs. I handle Exynos and ISOCELL. When I'm out sick, nobody covers my projects. When Hwaseong has 9 planners online simultaneously, I'm alone. The system wasn't designed for this asymmetry."                                                                                                                                                                                       | `[INSIGHT]` `[PAIN]`                   |
| 09:12 | Cross-site coordination method | Weekly 30-minute call with Hwaseong counterpart at 6:00 AM CST (9:00 PM KST). "Neither of us is happy with the time. It's the only overlapping window that isn't lunch or midnight. We discuss resource conflicts, share changes, and try to align plans — in 30 minutes, for 12+ projects." A shared Excel spreadsheet on Samsung's internal cloud supplements the call. "It's always out of date. The spreadsheet shows last week's data, not today's reality." | `[WORKFLOW]` `[METRIC]` `[WORKAROUND]` |

**CXO Behavioral Observation**: Mike spoke with the directness of someone who has adapted to a problem rather than accepted it. His tone was pragmatic — he wasn't complaining, he was describing a structural disadvantage. When he said "morning detective ritual," he smiled ruefully. This is someone who has built coping mechanisms and is efficient within a broken system, but recognizes that efficiency has a ceiling. His body language was open and engaged — he leaned into the camera when making key points, particularly about cross-site blindness.

### Section 2 — Current PM Planner Experience

| Time  | Topic                              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                              | Tags                                   |
| ----- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 09:16 | Overnight overwrites               | "Last month, I spent two hours adjusting Exynos 2600's Q3 resource allocation — moving 8 engineers between groups to optimize for the tape-out timeline. I saved at 5 PM Austin time. When I came in the next morning, the numbers were different. A Hwaseong planner had made different changes to the same project at 9 AM KST — 6 PM my time, one hour after my save. My changes were gone. No notification. No conflict dialog. Just... gone." | `[PAIN]` `[QUOTE]` `[EMOTION]`         |
| 09:21 | The time zone multiplier           | "For Hwaseong planners, concurrent editing is bad but at least they're all online at the same time — they can shout across the office. For Austin, it's worse because the conflict happens while I'm asleep. I discover it 12 hours later. The time zone doesn't just add a delay — it multiplies every single PM Planner limitation."                                                                                                             | `[INSIGHT]` `[QUOTE]` `[MENTAL-MODEL]` |
| 09:25 | Cross-site resource double-booking | "ISOCELL has engineers shared between Austin and Hwaseong. I allocate 60% of Engineer Kim's time for Austin. Hwaseong allocates 80% of the same engineer for their ISOCELL project. Total: 140%. Nobody catches it until the engineer flags it to their manager. The system doesn't know about the conflict because it can't see across sites."                                                                                                    | `[PAIN]` `[METRIC]` `[WORKFLOW]`       |
| 09:29 | Language barrier in change notes   | "When changes are documented — which is rare — sometimes the notes are in Korean. PM Planner doesn't translate. I have to ask a bilingual colleague to interpret. Sometimes the notes use Samsung-internal abbreviations I don't recognize because they're Korean-language acronyms."                                                                                                                                                              | `[PAIN]` `[SURPRISE]`                  |

**CXO Behavioral Observation**: Mike's frustration peaked during the Exynos 2600 overwrite story. He paused, took a breath, and said quietly: "Two hours of work. Gone." The pause was significant — this is someone who has processed the emotion but hasn't resolved the underlying anger. When discussing the language barrier, he was matter-of-fact — it's a problem he's learned to work around but shouldn't have to. His most animated moment was describing the 140% engineer allocation — he gestured with both hands as if trying to physically demonstrate the impossibility.

### Section 3 — Pain Points Deep Dive

| Time  | Topic                               | Notes                                                                                                                                                                                                                                                                                                      | Tags                                  |
| ----- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 09:33 | Information asymmetry               | "Decisions are made in Hwaseong. Communicated in Korean. Documented in PM Planner without structured change notes. By the time the decision reaches Austin — if it reaches Austin — I've already planned against outdated assumptions. Austin is always the last to know."                                 | `[PAIN]` `[INSIGHT]` `[MENTAL-MODEL]` |
| 09:37 | Exynos 2600 tape-out crunch         | "We're 4 months from Exynos 2600 tape-out. Resource allocation changes daily. I need to see changes in real-time from all sites. Currently, I get a weekly snapshot that's 3-5 days stale. In semiconductor, a 5-day-stale resource plan is dangerous — it's like flying with a 5-day-old weather report." | `[PAIN]` `[METRIC]` `[QUOTE]`         |
| 09:41 | Workaround: personal change tracker | Mike maintains a Teams channel called "Austin PM Changes" where he posts every change he makes to PM Planner. He's asked Hwaseong counterparts to do the same. "About half of them post consistently. The other half forget or don't have time. So my change feed is 50% complete at best."                | `[WORKAROUND]` `[METRIC]`             |
| 09:44 | What-if scenarios for SoC projects  | "Custom SoC clients request resource allocation scenarios — 'what if we accelerate by 2 months?' 'what if we add a second variant?' I build these in Excel. The client sees a polished PowerPoint. They don't know it took me 2 days to model what should be a 10-minute simulation."                      | `[PAIN]` `[WORKFLOW]` `[METRIC]`      |

### Section 4 — Ideal Solution & Feature Priorities

| Time  | Topic                                  | Notes                                                                                                                                                                                                                                                                                                      | Tags                                     |
| ----- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 09:47 | Morning dashboard                      | "I want to open IRIS at 7:30 AM and see: 'Here's what changed across all sites since you last logged in. 5 projects were modified at Hwaseong, 2 at Pyeongtaek. Click to see differences.' That eliminates my 90-minute morning detective work and replaces it with a 5-minute review."                    | `[FEATURE]` `[DELIGHT]` `[METRIC]`       |
| 09:49 | World map as equalizer                 | "The world map dashboard (Req 7) isn't just 'nice for executives.' For Austin, it levels the playing field. If I can see all sites' resource data in real time, I don't need the weekly 6 AM call. I can be proactive instead of reactive. I can catch the 140% allocation before the engineer complains." | `[FEATURE]` `[INSIGHT]` `[MENTAL-MODEL]` |
| 09:51 | Structured change logging              | "Every change should have: who changed it, when, what project, what field, old value, new value, and a mandatory reason field. Language-neutral — structured data, not free-text notes in Korean. This one feature would transform my mornings."                                                           | `[FEATURE]`                              |
| 09:53 | Real-time cross-site allocation alerts | "If any engineer exceeds 100% allocation across all sites, alert all relevant planners immediately. Don't wait for the monthly reconciliation meeting."                                                                                                                                                    | `[FEATURE]`                              |

### Section 5 — Requirements Validation

| Req | Rating         | Notes                                                                               |
| --- | -------------- | ----------------------------------------------------------------------------------- |
| 0   | Important      | "Better UI is always welcome"                                                       |
| 1   | **Critical**   | "Simulation needs to work across sites, not just within one site"                   |
| 2   | **Critical**   | "Version history and delta sync — critical for cross-site coordination"             |
| 3   | **Critical**   | "Concurrent save with merge is essential, especially for overseas planners"         |
| 4   | **Critical**   | "Roadmap versioning across sites"                                                   |
| 5   | Important      | "N-PLM integration matters but it's not my daily pain"                              |
| 6   | Important      | "Factor control for filtering by site would help"                                   |
| 7   | **Critical**   | "For overseas sites, world map visibility is survival, not a nice-to-have"          |
| 8   | **Critical**   | "Cross-site analysis views — I need to see Austin + Hwaseong + Pyeongtaek together" |
| 9   | Nice-to-have   | "HR domain"                                                                         |
| 10  | Important      | "Would help with client-facing reports for custom SoC projects"                     |
| 11  | Nice-to-have   | "Could be useful but basics first"                                                  |
| 12  | Not my concern | "IT handles this"                                                                   |

**Top 3 Priorities**: Req 7 (Cross-site visibility), Req 3 (Concurrent save), Req 8 (Analysis views)

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)           | Rebuild (Replace Entirely)                                                      |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Basic Gantt timeline view concept | Cross-site visibility (currently: nonexistent)                                  |
| P/M data entry structure          | Change notification system (currently: email/Teams workaround)                  |
|                                   | Multi-timezone awareness (currently: no timezone context)                       |
|                                   | Structured change logging (currently: free-text or none)                        |
|                                   | Resource allocation conflict detection across sites (currently: manual monthly) |

### Post-Interview Debrief

**Top 3 Insights:**

1. The time zone gap acts as a MULTIPLIER for every PM Planner limitation — concurrent editing conflicts become overnight overwrites, information delays become 12-hour blindness, and weekly meetings become the only coordination mechanism for 12 projects across 2 continents
2. The "morning detective ritual" (60-90 minutes daily) is a universal pattern for overseas planners — a real-time change feed would reclaim 7.5+ hours per week
3. Cross-site visibility is re-framed as an equity issue: Austin planners are structurally disadvantaged by the system's inability to show multi-site data, making Req 7/8 a fairness requirement, not just a feature request

**Biggest Surprise**: The 140% engineer allocation going undetected until the engineer complained. The system literally cannot detect a person being allocated more than 100% across sites. This is a fundamental data model limitation, not a UI issue.

**Assumptions Confirmed**: Cross-site visibility (Req 7, 8) is the #1 pain for overseas planners. Time zone amplifies all other pain points.

**Assumptions Challenged**: We assumed the world map (Req 7) was primarily an executive feature. Mike reframes it as an operational necessity for non-HQ sites — it's how overseas planners gain parity with Hwaseong.

**Follow-Up Needed**:

- [ ] Interview the second Austin planner to validate Mike's perspective
- [ ] Document the "Austin PM Changes" Teams channel protocol as a design input for IRIS's change notification UX
- [ ] Investigate: can IRIS's data model support cross-site allocation conflict detection at the individual engineer level?

---

## INT-004: Minho Kim — Planning Manager, Hwaseong, Memory (DRAM)

### Session Metadata

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Interview ID     | INT-004                                                          |
| Date             | 2026-03-18                                                       |
| Time             | 14:00 - 15:00 KST (60 minutes)                                   |
| Format           | In-person — Samsung DSR Hwaseong, Building 17, Meeting Room 5F-B |
| Interviewer      | CXO (Amoza)                                                      |
| Note-Taker       | AI Production Team                                               |
| Observer         | CEO (Amoza) — silent observer                                    |
| Recording        | Yes — verbal consent at 14:02                                    |
| Consent Obtained | Yes — written consent form signed                                |
| Screener Score   | 20/23                                                            |
| Pain Score       | 8/10                                                             |

### Participant Background

Minho Kim is a Planning Manager at Samsung DSR's Hwaseong site, Memory (DRAM) division. He has been in this role for 10 years and oversees the same 9-person planning team that includes INT-001 (Jisoo Park). He is responsible for reviewing and approving all P/M plans for DDR5, HBM4, and LPDDR6 development programs — a combined portfolio of 22 active projects. He does not edit P/M data directly but reviews, approves, escalates, and reports to the Division Manager. He is the gateway between planners and executives.

### Section 1 — Background & Daily Workflow

| Time  | Topic                             | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                 | Tags                            |
| ----- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 14:03 | Manager vs. planner role          | "I haven't entered a P/M value in 6 years. My job is governance — make sure the right people are planning the right numbers, catch errors before they propagate to PROMIS, and give the Division Manager a trustworthy picture. PM Planner is designed for data entry. It's not designed for what I do."                                                                                                                              | `[MENTAL-MODEL]` `[INSIGHT]`    |
| 14:07 | Approval workflow (current state) | Planners submit completed P/M plans via email with an Excel summary attached. Minho opens PM Planner, reviews the data, compares against the previous version using his own exported Excel files, and verbally approves via email or Teams. "There is no approve button in PM Planner. Approval is a human process — email, conversation, then someone updates a status field manually. The system doesn't know I approved anything." | `[WORKFLOW]` `[PAIN]` `[QUOTE]` |
| 14:12 | Review queue                      | "I have 9 planners submitting plans. On a typical week, 8-12 plans need my review. There's no queue, no notification, no priority ordering. I rely entirely on email to know when something needs my review. If a planner forgets to email me, their plan sits unreviewed until someone asks why it hasn't been approved."                                                                                                            | `[PAIN]` `[METRIC]`             |

**CXO Behavioral Observation**: Minho's demeanor was that of a seasoned manager — measured, analytical, focused on process rather than individual tasks. He spoke in terms of governance, accountability, and risk. When describing the approval workflow, he shook his head slowly — not in anger but in genuine bewilderment that a system used by Samsung's semiconductor division lacks basic workflow capabilities. His authority was evident; he is clearly the decision-maker for his team and expects tools to support that role.

### Section 2 — Current PM Planner Experience

| Time  | Topic                         | Notes                                                                                                                                                                                                                                                                                                                                                                                                             | Tags                             |
| ----- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 14:16 | Manual comparison process     | "When I review a plan, I open PM Planner and look at the current data. Then I open my Excel export from the last approved version. I compare cell by cell — 200+ rows for HBM4. I'm looking for anomalies: did someone accidentally zero out a group? Did the Q3 numbers jump by 50%? Is the total headcount within budget? All of this is visual comparison. My eyes are the diff tool."                         | `[WORKFLOW]` `[PAIN]` `[METRIC]` |
| 14:21 | Time cost of reviews          | 6-8 hours per week on plan reviews and approvals. Estimates 40% (2.5-3 hours) is the manual comparison process. "If IRIS had an automatic diff view, I'd cut my review time in half."                                                                                                                                                                                                                             | `[METRIC]`                       |
| 14:25 | Draft vs. permanent confusion | "A planner saves work-in-progress that's not ready for review. It looks exactly the same as a finalized plan in PM Planner. I've made decisions based on draft data because I couldn't tell the difference. Once, I reported HBM4 Q2 numbers to the Division Manager based on what turned out to be Jisoo's work-in-progress. She hadn't finished her changes yet. The numbers were wrong. I looked incompetent." | `[PAIN]` `[EMOTION]` `[QUOTE]`   |
| 14:30 | Accountability gap            | "When something goes wrong — wrong data synced to PROMIS, resources double-booked, allocation exceeds budget — people ask me 'who approved this?' I can't answer precisely. The approval trail is email threads scattered across months. I sometimes have to search through hundreds of emails to prove that I did or didn't approve a specific change."                                                          | `[PAIN]` `[INSIGHT]`             |

**CXO Behavioral Observation**: The HBM4 draft data incident was the emotional low point. Minho's voice tightened and he broke eye contact briefly when describing reporting incorrect numbers to the Division Manager. This was shame — a manager who prides himself on accuracy being undermined by his tools. When discussing accountability, he straightened in his chair — this is a matter of professional integrity for him. His posture shifted from relaxed to rigid, signaling how seriously he takes the governance gap.

### Section 3 — Pain Points Deep Dive

| Time  | Topic                            | Notes                                                                                                                                                                                                                                                                                                     | Tags                                       |
| ----- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 14:34 | Cross-department over-allocation | "Two departments allocate the same HBM4 engineer at 80-100% each. Total: 160-200%. No system detection. I discover it at the monthly reconciliation meeting when the engineer's manager complains. By then, two departments have been planning against a fiction for 4 weeks."                            | `[PAIN]` `[METRIC]`                        |
| 14:38 | Monthly reconciliation meeting   | "Four hours, once a month. Planning managers from all Memory departments sit in a conference room with printed Excel sheets and go project by project looking for conflicts. In 2026, at Samsung, we resolve resource conflicts with paper printouts."                                                    | `[PAIN]` `[QUOTE]` `[WORKFLOW]` `[METRIC]` |
| 14:42 | Reporting to Division Manager    | "I compile a weekly resource summary for the DM. It takes my analyst 3 hours to prepare. The data is 2-3 days stale by the time I present it. The DM asks questions I can't answer on the spot because the answers require going back to PM Planner and running manual calculations."                     | `[PAIN]` `[METRIC]` `[WORKFLOW]`           |
| 14:46 | LPDDR6 new project onboarding    | "When LPDDR6 was approved last month, it took 5 business days to set up in PM Planner because the project's organization structure wasn't yet in N-PLM. We had engineers assigned to LPDDR6 but no way to record their allocation in the system. For 5 days, LPDDR6 planning happened entirely in Excel." | `[PAIN]` `[METRIC]` `[WORKFLOW]`           |

### Section 4 — Ideal Solution & Feature Priorities

| Time  | Topic                               | Notes                                                                                                                                                                                                                                                             | Tags                         |
| ----- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 14:49 | Formal approval workflow            | "Draft -> Submit for Review -> Manager Reviews (with automatic diff) -> Approve or Request Changes -> Permanent. The approved version syncs to PROMIS. Everything else stays internal. Full audit trail — who submitted, when, who approved, when, what changed." | `[FEATURE]` `[DELIGHT]`      |
| 14:52 | Manager dashboard                   | "Traffic light view of all plans: green = approved, yellow = submitted and awaiting review, red = overdue or has conflicts. Click to drill down. I shouldn't need to open 22 separate projects to understand my portfolio's status."                              | `[FEATURE]` `[MENTAL-MODEL]` |
| 14:55 | Automated over-allocation detection | "If any engineer exceeds 100% allocation across all departments and sites, flag it immediately with an alert. Don't wait for the monthly reconciliation meeting. Kill that meeting entirely — replace it with real-time conflict detection."                      | `[FEATURE]` `[DELIGHT]`      |
| 14:57 | Role-based views                    | "I should see a different IRIS interface than Jisoo. She needs the editing grid. I need governance dashboards, approval queues, and reporting tools. Same system, different experiences based on role."                                                           | `[FEATURE]` `[MENTAL-MODEL]` |

### Section 5 — Requirements Validation

| Req | Rating         | Notes                                                                                                                                |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | Important      | "Platform upgrade is IT's concern, but faster UI helps review efficiency"                                                            |
| 1   | **Critical**   | "Separation of roadmap and simulation supports governance — I can review approved roadmaps separately from experimental simulations" |
| 2   | **Critical**   | "Version history per project with diff view — essential for my review process"                                                       |
| 3   | **Critical**   | "THE most important. Concurrent save + approval workflow is the core of governance"                                                  |
| 4   | **Critical**   | "Roadmap versioning feeds directly into my approval workflow"                                                                        |
| 5   | Important      | "N-PLM integration affects new project onboarding speed"                                                                             |
| 6   | Important      | "Factor control would help me filter by my department's projects vs. all projects"                                                   |
| 7   | Important      | "World map is useful for my DM reports"                                                                                              |
| 8   | Important      | "Analysis views would help me answer DM questions on the spot"                                                                       |
| 9   | Nice-to-have   | "HR handles staffing — I handle allocation within existing headcount"                                                                |
| 10  | **Critical**   | "Automated reporting would save my analyst 3 hours per week"                                                                         |
| 11  | Nice-to-have   | "AI reporting is future — I need reliable basics first"                                                                              |
| 12  | Not my concern | "IT infrastructure decision"                                                                                                         |

**Top 3 Priorities**: Req 3 (Approval workflow + concurrent save), Req 2 (Version history), Req 10 (Reporting)

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)                                   | Rebuild (Replace Entirely)                                    |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| Data model (org hierarchy, PM by month, skill dimensions) | Approval workflow (currently: email-based, no system record)  |
| Project-level data organization                           | Draft/permanent version distinction (currently: nonexistent)  |
|                                                           | Over-allocation detection (currently: manual monthly meeting) |
|                                                           | Role-based views (currently: one-size-fits-all)               |
|                                                           | Audit trail (currently: email thread archaeology)             |

### Post-Interview Debrief

**Top 3 Insights:**

1. The manager persona has fundamentally different needs from planners — governance, visibility, accountability vs. editing and simulation. IRIS must serve both with role-based UX, not a single interface
2. The 4-hour monthly reconciliation meeting with printed Excel sheets is a massive hidden cost that automated conflict detection could eliminate entirely
3. The draft-vs-permanent confusion caused Minho to report incorrect HBM4 data to the Division Manager — this is a trust and credibility issue, not just a usability problem

**Biggest Surprise**: Minho's shame when describing the HBM4 draft data incident. This is a manager who takes pride in accuracy, and his tools betrayed him. The emotional weight of this incident suggests that draft/permanent versioning in IRIS must be visually unambiguous — no possibility of confusion.

**Assumptions Confirmed**: Approval workflow is absent from PM Planner. Managers spend significant time on manual comparison. Cross-department conflicts are resolved through monthly meetings.

**Assumptions Challenged**: We expected managers to prioritize world map/dashboard features (Req 7, 8). Minho prioritizes governance features (Req 3, 2, 10) — he wants to manage his team's work effectively before seeing global views.

**Follow-Up Needed**:

- [ ] Shadow Minho during one review cycle to document the exact comparison workflow
- [ ] Attend the monthly reconciliation meeting (with permission) to observe conflict resolution patterns
- [ ] Interview the Division Manager (Minho's superior) to understand reporting expectations

---

## INT-005: Eunji Baek — Planning Manager, Pyeongtaek, Memory (NAND)

### Session Metadata

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| Interview ID     | INT-005                                 |
| Date             | 2026-03-19                              |
| Time             | 10:00 - 10:50 KST (50 minutes)          |
| Format           | Remote — Microsoft Teams, video on      |
| Interviewer      | CXO (Amoza)                             |
| Note-Taker       | AI Production Team                      |
| Observer         | COO (Amoza) — silent observer           |
| Recording        | Yes — verbal consent at 10:02           |
| Consent Obtained | Yes — digital consent form acknowledged |
| Screener Score   | 18/23                                   |
| Pain Score       | 7/10                                    |

### Participant Background

Eunji Baek is a Planning Manager at Samsung DSR's Pyeongtaek site, Memory (NAND) division. She has been in this role for 6 years and oversees a team of 7 planners managing P/M for NAND development projects including V-NAND 9th generation and 3D NAND advanced packaging. She is particularly focused on PROMIS integration quality because Pyeongtaek's Foundry-adjacent NAND operations have tight profit margin reporting requirements — any error in PROMIS data cascades into quarterly financial reviews.

### Section 1 — Background & Daily Workflow

| Time  | Topic                  | Notes                                                                                                                                                                                                                                                                                                                 | Tags                          |
| ----- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 10:03 | Managerial focus       | "I spend 60% of my time on governance — reviewing plans, resolving conflicts, preparing reports for the Division Head. The other 40% is on PROMIS integration — making sure what we sync to the profit system is accurate, complete, and timely. PM Planner helps with neither."                                      | `[WORKFLOW]` `[MENTAL-MODEL]` |
| 10:07 | Team operations        | 7 planners, each managing 3-5 NAND projects. Combined portfolio: 28 active projects. Pyeongtaek runs on a bi-weekly review cycle synced to PROMIS sync schedule. "Our planning rhythm is dictated by PROMIS sync, not by project needs. That's backwards."                                                            | `[WORKFLOW]` `[INSIGHT]`      |
| 10:11 | Change log spreadsheet | Eunji has implemented a mandatory "change log spreadsheet" that her planners update whenever they modify any project in PM Planner. "Every change gets logged: project ID, field, old value, new value, who, when, why. It's our version control system. Completely manual, but it's all we have. I audit it weekly." | `[WORKAROUND]` `[WORKFLOW]`   |

**CXO Behavioral Observation**: Eunji is process-oriented and systematic. She described her workarounds with the efficiency of someone who has refined them over years. Unlike Minho (INT-004) who expressed frustration at the governance gap, Eunji has built compensating processes and takes quiet pride in their effectiveness. Her emotional register is pragmatic acceptance — she's less angry than resigned, and her focus is on making the current system work rather than lamenting its failures. This suggests she'll be an excellent requirements validator because she's already designed the process she wants — it just needs systemization.

### Section 2 — Current PM Planner Experience

| Time  | Topic                            | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Tags                             |
| ----- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 10:14 | PROMIS full sync — the core pain | "Every two weeks, PM Planner sends ALL 160 NAND projects to PROMIS. Only 8-15 actually changed. PROMIS receives the full set and triggers recalculation on everything. Last quarter, a full sync changed the displayed profit margin on 40+ unchanged projects — by fractions of a percent, but enough to trigger review queries from finance. My team spent 3 days proving that nothing actually changed. Three days, for a problem that shouldn't exist." | `[PAIN]` `[METRIC]` `[QUOTE]`    |
| 10:19 | Financial impact of sync errors  | "When PROMIS shows a profit margin change — even 0.1% — it triggers a review chain. Finance asks the planning team, planning asks IT, IT checks the sync logs, everyone wastes time. The cost of a false positive in our profit system isn't just hours — it's credibility. After enough false alarms, finance stops trusting our numbers. That's the real damage."                                                                                         | `[PAIN]` `[INSIGHT]` `[EMOTION]` |
| 10:23 | N-PLM integration delays         | "Master data from N-PLM takes 24-48 hours to reflect in PM Planner. When V-NAND 9th gen added a new packaging sub-team, it took 3 business days for that team to appear in PM Planner. My planners couldn't record allocations for that sub-team for 3 days. They tracked it in Excel until the sync caught up."                                                                                                                                            | `[PAIN]` `[METRIC]`              |
| 10:27 | What works in PM Planner         | "The data push from PM Planner back to N-PLM — confirmed plans going to the product lifecycle system — works reasonably well. The pipe is fine; the filter is broken. We push everything instead of just changes. Fix the filter and the existing integration architecture can survive."                                                                                                                                                                    | `[REUSE]` `[INSIGHT]`            |

**CXO Behavioral Observation**: Eunji's voice hardened when discussing the PROMIS recalculation incident. The phrase "3 days proving nothing changed" was delivered with controlled intensity — this incident clearly cost her personal credibility with the finance team and she hasn't forgotten. When she said "finance stops trusting our numbers," she looked directly at the camera with emphasis. Trust erosion is her deepest concern. When discussing N-PLM integration, she was more relaxed — this is an annoyance, not a crisis. The PROMIS issue is the crisis.

### Section 3 — Pain Points Deep Dive

| Time  | Topic                        | Notes                                                                                                                                                                                                                                                                                                                                                                    | Tags                             |
| ----- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| 10:30 | Audit trail absence          | "When the Division Head asks 'who changed V-NAND Q3 numbers and why?', I check my change log spreadsheet. If the planner forgot to log the change — which happens about 20% of the time — I have no answer. PM Planner has zero audit trail. The system that manages resource allocation for Samsung's NAND division has less change tracking than a shared Google Doc." | `[PAIN]` `[QUOTE]` `[METRIC]`    |
| 10:34 | Approval notification gap    | "I find out a plan needs my review in three ways: (1) a planner emails me, (2) a planner messages me on Teams, or (3) I accidentally notice something changed when I open PM Planner. Option 3 happens more often than it should. There's no submission queue, no notification, no inbox."                                                                               | `[PAIN]` `[WORKFLOW]`            |
| 10:37 | Cross-site NAND coordination | "Hwaseong and Pyeongtaek both have NAND teams. We share engineers for specialized tasks — especially advanced packaging and testing. Coordinating shared resources is a monthly manual process: email thread, shared Excel, 2-hour meeting. If one site changes allocation without telling the other, we discover it weeks later."                                       | `[PAIN]` `[WORKFLOW]` `[METRIC]` |

### Section 4 — Ideal Solution & Feature Priorities

| Time  | Topic                        | Notes                                                                                                                                                                                                                                                                    | Tags                    |
| ----- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| 10:40 | Delta sync to PROMIS         | "Only send changed projects to PROMIS. Automatically detect what changed since the last sync. Show me a preview: 'These 8 projects will be synced. These 152 are unchanged and will be skipped.' Let me confirm before the sync runs. That's the feature I dream about." | `[FEATURE]` `[DELIGHT]` |
| 10:43 | Automatic change audit trail | "Every change — who, when, what, why — recorded by the system, not by my spreadsheet. Mandatory reason field for any P/M modification. Exportable audit log for compliance reviews. This isn't a feature, it's a foundational capability."                               | `[FEATURE]`             |
| 10:45 | Approval email notifications | "Auto-email when a planner submits a plan for review. Include: project name, summary of changes (diff from previous version), and a link to the review screen in IRIS. I should be able to approve or request changes from the email itself for simple cases."           | `[FEATURE]`             |
| 10:48 | Cross-site change alerts     | "If Hwaseong modifies a plan that involves shared NAND engineers, alert me. I shouldn't discover cross-site changes at a monthly meeting."                                                                                                                               | `[FEATURE]`             |

### Section 5 — Requirements Validation

| Req | Rating         | Notes                                                                                            |
| --- | -------------- | ------------------------------------------------------------------------------------------------ |
| 0   | Important      | "Mendix 10 is a technical necessity, not a feature"                                              |
| 1   | Important      | "Separation matters for governance — keep approved roadmaps clean from experimental simulations" |
| 2   | **Critical**   | "Delta sync is THE fix for PROMIS. Per-project versioning is THE fix for audit"                  |
| 3   | **Critical**   | "Concurrent save + approval workflow — yes, essential"                                           |
| 4   | **Critical**   | "Roadmap versioning with audit trail"                                                            |
| 5   | Important      | "N-PLM delays are annoying but manageable"                                                       |
| 6   | Important      | "Factor control helps filter, useful but not urgent"                                             |
| 7   | Nice-to-have   | "World map is for the DM and Division Manager, not for me"                                       |
| 8   | Nice-to-have   | "Analysis views — my analyst handles this"                                                       |
| 9   | Nice-to-have   | "HR domain"                                                                                      |
| 10  | Important      | "Reporting automation would help my weekly reports"                                              |
| 11  | Nice-to-have   | "AI is future — basics first"                                                                    |
| 12  | Not my concern | "IT decision"                                                                                    |

**Top 3 Priorities**: Req 2 (Delta sync + version history), Req 3 (Concurrent save + approval), Req 4 (Roadmap versioning)

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)                   | Rebuild (Replace Entirely)                             |
| ----------------------------------------- | ------------------------------------------------------ |
| N-PLM confirmed plan push architecture    | PROMIS sync model (full -> delta)                      |
| Data structure and organization hierarchy | Audit trail (currently: manual spreadsheet)            |
|                                           | Approval notification system (currently: email/Teams)  |
|                                           | Change tracking (currently: 80% compliance manual log) |

### Post-Interview Debrief

**Top 3 Insights:**

1. PROMIS full sync is not just wasteful — it actively damages data credibility. False profit margin changes cause multi-day investigations and erode finance team trust. Delta sync is a data integrity requirement, not an optimization
2. The manual change log spreadsheet achieves 80% compliance — 20% of changes go unlogged, creating audit gaps. This validates the need for system-enforced change tracking
3. Eunji's planning rhythm is "dictated by PROMIS sync, not project needs" — this is a process inversion where the downstream system controls the upstream workflow

**Biggest Surprise**: The credibility erosion with finance. Eunji framed PROMIS full sync not as a time problem but as a trust problem. When finance stops trusting planning data, the entire governance chain weakens. This elevates Req 2 from "efficiency" to "organizational trust."

**Assumptions Confirmed**: Delta sync (Req 2) is critical for data integrity. Approval workflow gaps exist across all manager personas.

**Assumptions Challenged**: We assumed Pyeongtaek's NAND team would prioritize concurrent editing (Req 3) as #1. Eunji ranks delta sync (Req 2) higher because PROMIS credibility affects her quarterly reviews more directly than editing conflicts.

**Follow-Up Needed**:

- [ ] Document the PROMIS recalculation incident in detail — timeline, impact, resolution
- [ ] Request a copy of Eunji's change log spreadsheet template to inform IRIS audit trail design
- [ ] Quantify the financial review cost triggered by false PROMIS changes

---

## INT-006: Taehyung Yoon — Division Manager, Hwaseong HQ, Cross-division

### Session Metadata

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Interview ID     | INT-006                                                          |
| Date             | 2026-03-19                                                       |
| Time             | 15:00 - 15:45 KST (45 minutes)                                   |
| Format           | In-person — Samsung DSR Hwaseong, Executive Building, Room 12F-A |
| Interviewer      | CXO (Amoza)                                                      |
| Note-Taker       | AI Production Team                                               |
| Observer         | CEO (Amoza) — silent observer                                    |
| Recording        | Yes — verbal consent at 15:03                                    |
| Consent Obtained | Yes — written consent form signed                                |
| Screener Score   | 17/23                                                            |
| Pain Score       | 8/10                                                             |

### Participant Background

Taehyung Yoon is a Division Manager at Samsung DSR's Hwaseong HQ, overseeing resource allocation strategy across all Samsung DS divisions — Memory (DRAM and NAND), System LSI, and Foundry. He has been at Samsung for 18 years, the last 12 in executive resource strategy. He does not use PM Planner directly — his information flow is entirely mediated through reports compiled by planning managers and analysts. He makes decisions about thousands of engineers across 5 global sites based on presentations that are typically 3-5 days stale. He reports directly to the DS Division President.

### Section 1 — Background & Daily Workflow

| Time  | Topic                      | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                    | Tags                             |
| ----- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 15:04 | Executive information flow | "I never open PM Planner. My information comes in three forms: (1) Weekly Excel summaries from planning managers at each site, (2) Monthly PowerPoint presentations compiled by the analytics team, (3) Ad hoc requests where I ask a question and wait 2-5 days for someone to compile the answer. I make decisions about 3,000+ engineers based on data that's between 3 and 30 days old."                                             | `[WORKFLOW]` `[PAIN]` `[METRIC]` |
| 15:08 | Decision velocity          | "In semiconductor, resource allocation speed directly affects time-to-market. When I need to decide whether to shift 100 engineers from DDR5 to HBM4, the answer requires data from 3 sites, 4 divisions, and 50+ projects. Getting that data takes a week. Making the decision takes a day. By the time I have the data, the decision window may have passed. We've postponed resource decisions because the information wasn't ready." | `[PAIN]` `[METRIC]` `[INSIGHT]`  |
| 15:12 | Strategic planning cycle   | "Quarterly strategic resource allocation reviews are the most data-intensive event in my calendar. The analytics team spends 2-3 weeks preparing. 40+ person-hours of data compilation across sites. The resulting presentation is 80+ slides. And I still ask questions nobody can answer on the spot."                                                                                                                                 | `[WORKFLOW]` `[METRIC]`          |

**CXO Behavioral Observation**: Taehyung is measured and executive in bearing. He spoke in strategic terms — "decision velocity," "time-to-market impact," "investment justification." He rarely mentioned specific tools or features; his frame is entirely outcomes-based. When discussing postponed decisions, his tone became serious but not frustrated — he accepts the current limitation as a systemic reality he wants to change, not a personal grievance. He is clearly accustomed to making high-stakes decisions with imperfect information, and his ask is simply: make the information less imperfect, faster.

### Section 2 — Strategic Needs & Pain Points

| Time  | Topic                       | Notes                                                                                                                                                                                                                                                                                                             | Tags                              |
| ----- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 15:16 | The $400 billion question   | "I ask a simple question: 'How many engineers are allocated to HBM4 development across all sites?' The answer takes 5 business days. Involves 4-5 planners compiling data into Excel, an analyst consolidating it, and my team formatting a response. For a $400 billion company, this is embarrassing."          | `[PAIN]` `[QUOTE]` `[METRIC]`     |
| 15:21 | Cross-division blind spots  | "Memory and System LSI share specialized engineers — RF design, advanced packaging, test development. When HBM4 pulls packaging engineers, it affects Exynos 2600 timelines. I should see this cascade in real time. Today, I discover it at the quarterly review — 3 months after the allocation was made."      | `[PAIN]` `[INSIGHT]` `[WORKFLOW]` |
| 15:25 | Strategic what-if scenarios | "What if Samsung opens a new fab in Taylor, Texas, and we need to allocate 500 engineers over 18 months? Where do they come from? Which projects are affected? What's the timeline impact? Currently, this analysis takes my team 3-4 weeks. By the time the analysis is done, the strategic window has shifted." | `[PAIN]` `[METRIC]`               |
| 15:29 | Xi'an site visibility gap   | "Xi'an is our largest production site in China. Resource allocation data from Xi'an follows a different process, different format, and arrives 5-7 days later than Korean site data. I literally cannot see Xi'an in the same view as Hwaseong. For cross-site decisions, this is a critical blind spot."         | `[PAIN]` `[SURPRISE]` `[METRIC]`  |

**CXO Behavioral Observation**: Taehyung's most emphatic moment was the "$400 billion company" quote. He leaned forward, made direct eye contact, and his voice carried genuine incredulity. This isn't frustration — it's a strategic leader who cannot believe his organization lacks basic analytical capability. When discussing Xi'an, he mentioned it almost as an aside, then paused and said "actually, that's important" — suggesting the Xi'an visibility gap is a pain he's normalized. The casual mention followed by self-correction reveals how deeply embedded these limitations are.

### Section 3 — Ideal Solution & Feature Priorities

| Time  | Topic                       | Notes                                                                                                                                                                                                                                                                                                                                                                  | Tags                                     |
| ----- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 15:32 | World map dashboard         | "I want to open my browser, see a world map with all Samsung DS sites — Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung. Click on Hwaseong: see its resource breakdown by division, by project, by trend. Click on Austin: compare. Live data, not last week's snapshot. Color-coded: green = on plan, yellow = needs attention, red = critical gap. That's IRIS for me." | `[FEATURE]` `[DELIGHT]` `[MENTAL-MODEL]` |
| 15:36 | Strategic scenario modeling | "Model the HBM4 ramp-up: if we accelerate by 2 quarters, show me the resource impact across all sites and divisions. Show me which projects are affected. Show me alternatives — can we hire, can we transfer, can we defer lower-priority projects? This should take 10 minutes, not 3 weeks."                                                                        | `[FEATURE]` `[DELIGHT]`                  |
| 15:39 | Role-based experience       | "I should see a completely different IRIS than a planner. My screen should be strategic — aggregated metrics, trend lines, cross-site comparisons, alert flags, scenario tools. The planner's screen should be operational. Same platform, different lenses."                                                                                                          | `[FEATURE]` `[MENTAL-MODEL]`             |
| 15:42 | AI-assisted insight         | "If IRIS can proactively tell me 'HBM4 headcount is trending 15% below plan — at current trajectory, you'll be short 45 engineers by Q3' without me asking — that's the kind of intelligence that justifies the investment."                                                                                                                                           | `[FEATURE]` `[INSIGHT]`                  |

### Section 5 — Requirements Validation

| Req | Rating       | Notes                                                                                                 |
| --- | ------------ | ----------------------------------------------------------------------------------------------------- |
| 0   | Nice-to-have | "Technical concern — I don't interact with the platform layer"                                        |
| 1   | Important    | "Simulation capability would reduce my team's scenario analysis time"                                 |
| 2   | Important    | "Version history matters for audit and change tracking"                                               |
| 3   | Important    | "Concurrent save affects planner productivity, which affects my data freshness"                       |
| 4   | Important    | "Roadmap versioning supports quarterly review preparation"                                            |
| 5   | Important    | "N-PLM integration affects master data freshness"                                                     |
| 6   | Nice-to-have | "Factor control is operational — not my level"                                                        |
| 7   | **Critical** | "World map + resource stats — THE executive feature. This alone justifies IRIS"                       |
| 8   | **Critical** | "Analysis views — cross-site, cross-division, cross-time. My primary use case"                        |
| 9   | Important    | "HeadCount Portfolio feeds into my strategic staffing decisions"                                      |
| 10  | **Critical** | "Automated reporting would eliminate weeks of manual compilation"                                     |
| 11  | Important    | "AI-based insight generation is a differentiator — not critical for launch but important for roadmap" |
| 12  | Nice-to-have | "Infrastructure is IT's domain"                                                                       |

**Top 3 Priorities**: Req 7 (World map dashboard), Req 8 (Analysis views), Req 10 (Analysis Reporting)

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)                         | Rebuild (Replace Entirely)                                       |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| Underlying data model and dimensional structure | Executive reporting layer (currently: nonexistent)               |
|                                                 | Cross-site consolidated view (currently: manual compilation)     |
|                                                 | Strategic scenario modeling (currently: 3-4 week manual process) |
|                                                 | Real-time data access (currently: 3-30 day stale reports)        |

### Post-Interview Debrief

**Top 3 Insights:**

1. The Division Manager persona never touches PM Planner and has fundamentally different needs — strategic dashboards, scenario modeling, and real-time cross-site visibility. IRIS must serve the executive layer with dedicated UX, not repurpose the operational interface
2. 40+ person-hours monthly for global resource summaries represents an enormous hidden cost. A real-time dashboard eliminates this entirely and accelerates decision velocity from "weeks" to "minutes"
3. Resource allocation decisions are being postponed because data isn't ready — this directly connects IRIS capabilities to Samsung's semiconductor time-to-market, the ultimate business metric

**Biggest Surprise**: Xi'an site data arrives 5-7 days later than Korean sites, in a different format, through a different process. This means the Division Manager's "global view" is structurally incomplete. IRIS must solve the Xi'an integration challenge to deliver on the world map promise.

**Assumptions Confirmed**: Executives want strategic dashboards (Req 7, 8) and don't use PM Planner directly. Data staleness is a decision-making bottleneck.

**Assumptions Challenged**: We expected Taehyung to view AI reporting (Req 11) as a "nice-to-have." He sees it as a strategic differentiator — proactive insights ("you'll be short 45 engineers by Q3") are more valuable than reactive reports.

**Follow-Up Needed**:

- [ ] Document the Xi'an data flow and integration challenges in detail
- [ ] Quantify: how many resource allocation decisions were postponed in the last 4 quarters due to data unavailability?
- [ ] Identify the quarterly strategic review process — can we attend as observers?

---

## INT-007: Yuna Han — HR Planner, Hwaseong, HR Operations

### Session Metadata

| Field            | Value                                   |
| ---------------- | --------------------------------------- |
| Interview ID     | INT-007                                 |
| Date             | 2026-03-20                              |
| Time             | 10:00 - 10:48 KST (48 minutes)          |
| Format           | Remote — Microsoft Teams, video on      |
| Interviewer      | CXO (Amoza)                             |
| Note-Taker       | AI Production Team                      |
| Observer         | CPO (Amoza) — silent observer           |
| Recording        | Yes — verbal consent at 10:02           |
| Consent Obtained | Yes — digital consent form acknowledged |
| Screener Score   | 18/23                                   |
| Pain Score       | 7/10                                    |

### Participant Background

Yuna Han is an HR Planner at Samsung DSR's Hwaseong site, HR Operations department. She has been at Samsung for 7 years, the last 4 in HR resource planning. She is responsible for headcount portfolio management — tracking planned vs. actual staffing across divisions, analyzing resource utilization gaps, forecasting hiring needs, and generating staffing recommendations that directly influence multi-million-dollar recruitment decisions. She uses PM Planner data as an input but does not edit P/M values — her primary tools are GHRP (Global HR Platform), SMDM (Samsung Master Data Management), and Excel.

### Section 1 — Background & Daily Workflow

| Time  | Topic              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Tags                                      |
| ----- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 10:03 | Role definition    | "I'm the bridge between resource planning and human resources. PM Planner knows what's planned — how many engineers each project needs. GHRP knows what's real — how many engineers are actually on payroll, who's been hired, who's leaving. My job is to find the gap and recommend actions. No system does this automatically. I am the integration layer."                                                                                                                                       | `[WORKFLOW]` `[MENTAL-MODEL]` `[INSIGHT]` |
| 10:07 | Data merge process | "Step 1: Export PM Planner data — planned allocation by project, team, time period. Step 2: Export GHRP data — actual headcount, hiring status, attrition pipeline. Step 3: Export SMDM data — current organization structure. Step 4: Open three Excel files side by side. Step 5: Manually match and merge using my 4-page lookup table. Step 6: Identify gaps. Step 7: Generate recommendations in PowerPoint. This takes 2 full days every month. For the quarterly deep analysis, 4 full days." | `[WORKFLOW]` `[METRIC]` `[PAIN]`          |
| 10:12 | The lookup table   | "PM Planner uses one naming convention for teams and groups. GHRP uses another. SMDM uses a third. My 4-page lookup table maps between all three. When any system changes its naming — which happens with every Samsung reorg — my lookup table breaks. Last reorg in January, I spent 3 days just updating the lookup table before I could start actual analysis."                                                                                                                                  | `[PAIN]` `[WORKAROUND]` `[METRIC]`        |

**CXO Behavioral Observation**: Yuna described her role with a mixture of pride and exhaustion. She clearly sees herself as essential — "the integration layer" — but recognizes the absurdity of being a human database join operation. When she described the 4-page lookup table, she pulled it up on screen: a dense, color-coded Excel sheet with hundreds of rows mapping team names across three systems. The complexity was visually striking. She navigated it with practiced efficiency but rolled her eyes when explaining it — a gesture that said "I'm good at this, but I shouldn't have to be."

### Section 2 — Current Pain Points

| Time  | Topic                              | Notes                                                                                                                                                                                                                                                                                                                                                   | Tags                              |
| ----- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 10:16 | No integrated plan vs. actual view | "PM Planner knows the plan. GHRP knows reality. No system combines them. I am the human JOIN operation between two databases. Every month. For 200+ projects. It's soul-crushing."                                                                                                                                                                      | `[PAIN]` `[QUOTE]` `[EMOTION]`    |
| 10:20 | Data format mismatches             | "PM Planner calls it 'Advanced Packaging Group A.' GHRP calls it 'Adv. Pkg. Team Alpha.' SMDM calls it 'AP-GRP-01.' Same team, three names, zero automatic matching. I match them manually. If I get one wrong, my gap analysis is off, and we might hire or defer the wrong number of engineers."                                                      | `[PAIN]` `[METRIC]` `[INSIGHT]`   |
| 10:24 | Financial stakes of errors         | "My gap analysis directly influences hiring decisions. If I say 'hire 20 engineers for Pyeongtaek NAND,' that triggers a recruitment process costing approximately $200K per hire — salary, relocation, onboarding. An error in my Excel merge could mean $4M in misguided hiring. I triple-check everything, which is why my analysis is always late." | `[PAIN]` `[METRIC]` `[EMOTION]`   |
| 10:28 | World map staffing view — manual   | "The Division Manager asks for a global staffing view — all sites on a map showing headcount status, planned vs. actual, hiring pipeline. I build this in PowerPoint with manually updated circles and arrows. It's stale the moment I save it. I present it knowing the numbers have already changed."                                                 | `[PAIN]` `[WORKFLOW]`             |
| 10:32 | Attrition visibility gap           | "When engineers leave Samsung, GHRP knows immediately. PM Planner doesn't know for weeks because nobody updates the allocation. So my plan vs. actual gap shows a surplus that doesn't exist — the person is gone, but the plan still allocates them. This phantom allocation can persist for an entire planning cycle."                                | `[PAIN]` `[INSIGHT]` `[SURPRISE]` |

**CXO Behavioral Observation**: Yuna's anxiety about accuracy was palpable throughout. She spoke carefully, qualifying numbers with "approximately" and "I verify this." The $4M hiring error scenario clearly haunts her — she mentioned it twice during the interview. When discussing the global staffing view in PowerPoint, she showed her screen briefly: circles on a world map with manually typed numbers. The contrast between the importance of the information (global Samsung DS staffing) and the primitiveness of the tool (PowerPoint shapes) was jarring. Her emotional peak was the "human SQL JOIN" quote — she laughed, but it was the laugh of someone who has made peace with absurdity.

### Section 3 — Ideal Solution & Feature Priorities

| Time  | Topic                         | Notes                                                                                                                                                                                                                                                                                                                                                                                 | Tags                                     |
| ----- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 10:35 | HeadCount Portfolio dashboard | "Show me, on a single screen: Hwaseong has 1,200 planned engineers, 1,145 actual, gap of 55. Broken down by division: Memory DRAM has a surplus of 10, Memory NAND has a deficit of 35, System LSI has a deficit of 30. With trend lines: is the gap growing or shrinking? And recommendations: 'Hire 15 in Q2 for NAND, transfer 8 from DDR5 wind-down, defer 12 from Q4 projects.'" | `[FEATURE]` `[DELIGHT]` `[MENTAL-MODEL]` |
| 10:39 | Integrated plan vs. actual    | "Connect PM Planner (plan) with GHRP (actual) and SMDM (organization) inside IRIS. Automatic matching using employee IDs, not team names. Real-time gap calculation. No more manual merge, no more lookup table, no more 2-day monthly ritual."                                                                                                                                       | `[FEATURE]` `[DELIGHT]`                  |
| 10:42 | Attrition alerts              | "When an engineer leaves (GHRP status change), automatically flag the affected projects in IRIS. Show me: 'Engineer Kim left on March 15. Projects affected: HBM4 (allocated 50%), DDR5 Gen3 (allocated 30%). Combined gap: 0.8 FTE.' Immediately, not weeks later."                                                                                                                  | `[FEATURE]`                              |
| 10:45 | Hiring pipeline integration   | "Show me the hiring pipeline alongside the gap analysis. For each deficit: how many requisitions are open, how many candidates are in pipeline, expected fill date. So I can tell the Division Manager: 'NAND is 35 engineers short, but 20 requisitions are in progress with expected fill by Q2.'"                                                                                  | `[FEATURE]`                              |

### Section 5 — Requirements Validation

| Req | Rating         | Notes                                                                              |
| --- | -------------- | ---------------------------------------------------------------------------------- |
| 0   | Nice-to-have   | "I don't use PM Planner directly"                                                  |
| 1   | Nice-to-have   | "Simulation is a planner tool"                                                     |
| 2   | Important      | "Version history helps me understand plan changes that affect my gap analysis"     |
| 3   | Important      | "Concurrent save affects data quality I consume downstream"                        |
| 4   | Important      | "Roadmap versioning"                                                               |
| 5   | Important      | "N-PLM integration affects master data I depend on"                                |
| 6   | Nice-to-have   | "Factor control is a planner concern"                                              |
| 7   | **Critical**   | "World map with headcount data — this is my quarterly deliverable"                 |
| 8   | **Critical**   | "Analysis views for plan vs. actual — my daily work"                               |
| 9   | **Critical**   | "HeadCount Portfolio IS my job. Without it, I'm just an Excel operator"            |
| 10  | **Critical**   | "Reporting automation for recurring HR analyses"                                   |
| 11  | Important      | "AI-generated gap analysis and staffing recommendations would be transformational" |
| 12  | Not my concern | "IT infrastructure"                                                                |

**Top 3 Priorities**: Req 9 (HeadCount Portfolio), Req 8 (Analysis views), Req 10 (Reporting)

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)                                            | Rebuild (Replace Entirely)                                          |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| P/M data as input source (as long as IRIS integrates it with GHRP) | Plan vs. actual integration (currently: manual Excel merge)         |
|                                                                    | HR system connectivity (currently: separate export + lookup table)  |
|                                                                    | World map staffing view (currently: PowerPoint)                     |
|                                                                    | Attrition impact detection (currently: phantom allocation persists) |

### Post-Interview Debrief

**Top 3 Insights:**

1. The HR Planner is a unique persona — consumer of PM Planner data, not producer. Her entire workflow is a compensatory process for the absence of system integration between planning (PM Planner) and HR (GHRP/SMDM)
2. The 4-page lookup table for cross-system name matching is a data governance failure that IRIS must solve architecturally through unified identifiers, not UI improvements
3. Errors in manual data merge have direct financial consequences — $200K per hire x potential miscount. Yuna's triple-checking is a quality control mechanism that adds days to her timeline, creating a speed-vs-accuracy tradeoff that system integration would eliminate

**Biggest Surprise**: Phantom allocation from attrition — engineers who have left Samsung still appear as allocated in PM Planner because nobody updates the allocation. This means gap analysis based on PM Planner data is inherently inaccurate until someone manually reconciles. IRIS must integrate attrition events from GHRP in real time.

**Assumptions Confirmed**: HeadCount Portfolio (Req 9) is the HR Planner's primary need. Plan vs. actual integration is entirely manual. The lookup table workaround confirms data naming inconsistency across systems.

**Assumptions Challenged**: We assumed HR Planner would have lower pain scores because their interaction with PM Planner is indirect. Yuna's pain is high (7/10) because she depends on PM Planner data quality but has zero ability to influence it — she's a hostage to upstream data accuracy.

**Follow-Up Needed**:

- [ ] Request a copy of Yuna's 4-page lookup table — it maps the data governance gaps IRIS must resolve
- [ ] Quantify: how many hiring decisions per quarter are influenced by Yuna's gap analysis?
- [ ] Investigate GHRP API capabilities for real-time attrition event integration

---

## INT-008: Donghyun Bae — Analyst, Pyeongtaek, Resource Analytics

### Session Metadata

| Field            | Value                                                                     |
| ---------------- | ------------------------------------------------------------------------- |
| Interview ID     | INT-008                                                                   |
| Date             | 2026-03-20                                                                |
| Time             | 14:00 - 14:56 KST (56 minutes)                                            |
| Format           | Remote — Microsoft Teams, video on + screen share                         |
| Interviewer      | CXO (Amoza)                                                               |
| Note-Taker       | AI Production Team                                                        |
| Observer         | CDO (Amoza) — silent observer, particularly interested in ES architecture |
| Recording        | Yes — verbal consent at 14:02. Screen share recorded for ES demo          |
| Consent Obtained | Yes — digital consent form acknowledged                                   |
| Screener Score   | 22/23                                                                     |
| Pain Score       | 9/10                                                                      |

### Participant Background

Donghyun Bae is a Senior Analyst in Samsung DSR's Planning Analytics team at Pyeongtaek. He has been at Samsung for 7 years, the last 5 in resource analytics. He holds an MS in Statistics from KAIST and is the most technically sophisticated stakeholder interviewed — proficient in SQL, Python, Jupyter, Elasticsearch, and data visualization tools (Tableau, Power BI). He is responsible for generating multi-dimensional analysis reports, resource utilization dashboards, periodic executive summaries, and ad hoc analytical queries across all Pyeongtaek projects. His frustration with PM Planner is the highest recorded (9/10) because his entire job consists of working around the system's analytical limitations.

### Section 1 — Background & Daily Workflow

| Time  | Topic                     | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Tags                                       |
| ----- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 14:03 | The data plumbing problem | "My job title is 'Analyst.' My actual job is 70% data plumber, 30% analyst. I spend most of my time extracting, cleaning, transforming, and preparing data from PM Planner — work that shouldn't exist if the system had proper reporting capabilities. The actual analysis — the part that creates value — gets a fraction of my time."                                                                                                                                         | `[WORKFLOW]` `[PAIN]` `[QUOTE]` `[METRIC]` |
| 14:07 | Analysis pipeline         | "Step 1: Export PM Planner data to CSV — limited export options, no API. Step 2: Import into Jupyter notebook. Step 3: Transform and enrich with N-PLM master data and GHRP actuals. Step 4: Build analytical models — pivot tables, trend analysis, gap detection, utilization calculations. Step 5: Generate visualizations — charts, heatmaps, sparklines. Step 6: Package into Excel or PowerPoint. Step 7: Distribute via email. Every week. Same pipeline. No automation." | `[WORKFLOW]` `[METRIC]`                    |
| 14:12 | Weekly cycle              | Weekly reporting: 8-10 hours. Monthly comprehensive analysis: 3-4 full days. Quarterly strategic analysis for DM: 1.5 weeks including data preparation and presentation. "I'm the most expensive CSV exporter at Samsung."                                                                                                                                                                                                                                                       | `[METRIC]` `[QUOTE]` `[EMOTION]`           |

**CXO Behavioral Observation**: Donghyun is animated and technically precise. He uses technical jargon fluently — OLAP cubes, snowflake schemas, cardinality, query optimization. His frustration is that of a highly skilled professional forced to use primitive tools. He alternated between genuine excitement (when discussing what's possible) and deep frustration (when describing current reality). He screen-shared his Jupyter environment at 14:07, showing a notebook with 200+ cells processing PM Planner data. The volume of compensatory code is remarkable.

### Section 2 — Current PM Planner Experience

| Time  | Topic                                   | Notes                                                                                                                                                                                                                                                                                                                                                                                                     | Tags                                       |
| ----- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 14:16 | Reporting capabilities                  | "PM Planner's built-in reports are so basic they're useless for anything beyond a raw data dump. No pivot capability, no cross-dimensional analysis, no charts, no trend lines, no conditional formatting, no drill-down. I export everything and rebuild it myself. PM Planner is where data goes to hide."                                                                                              | `[PAIN]` `[QUOTE]`                         |
| 14:21 | Multi-dimensional analysis gap          | "I need to slice resource data by 8+ dimensions simultaneously: site, division, project type, function, stage, block, SW/HW, and time period. PM Planner supports maybe 2 dimensions at a time through its filter panel. For real analysis — 'show me Memory DRAM utilization at Hwaseong for process engineers in Stage 2 across Q1-Q3, compared to plan' — I write Python scripts."                     | `[PAIN]` `[METRIC]`                        |
| 14:25 | Periodic reporting — the human cron job | "Every Monday, I compile 5 standard reports: (1) Weekly resource summary by division, (2) Plan vs. actual gap by site, (3) Utilization heatmap by function, (4) Project status with resource trend, (5) Critical gap alert digest. Same structure every week, different data. I email these to 25 stakeholders. There's no scheduled generation, no auto-distribution, no templating. I am the cron job." | `[PAIN]` `[QUOTE]` `[METRIC]` `[WORKFLOW]` |
| 14:30 | Personal Elasticsearch index            | [Screen share] "I set up a personal ES cluster on my workstation — 3 shards, 1 replica, 2 years of PM Planner history indexed. My queries run 100x faster than the SQL reports IT provides. I've been asking IT for a proper ES analytical layer for 3 years. They say 'budget.' Meanwhile, I'm running a production-grade analytical engine from under my desk."                                         | `[WORKAROUND]` `[SURPRISE]` `[QUOTE]`      |

**CXO Behavioral Observation**: When Donghyun showed his personal ES cluster during screen share, he grinned — genuine pride in building something that works. The CDO observer (silently) leaned forward. This is someone who has solved the problem for himself but can't scale it to the organization. His "human cron job" comment was delivered with theatrical exasperation — he even pointed to a calendar reminder on his screen that said "Monday 8 AM: Run reports" with a recurring schedule stretching into the future. The contrast between his technical sophistication and the primitiveness of his reporting workflow is the most striking gap encountered in all 10 interviews.

### Section 3 — Pain Points Deep Dive

| Time  | Topic                              | Notes                                                                                                                                                                                                                                                                                                                                                                | Tags                                |
| ----- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 14:34 | Data freshness                     | "When I export PM Planner data on Monday morning, I'm working with whatever state existed at that moment. If a planner makes a change at 10 AM and I exported at 8 AM, my report is already wrong. There's no real-time data feed. No change stream. No webhook. Just static exports."                                                                               | `[PAIN]` `[METRIC]`                 |
| 14:38 | Chart widget limitations           | "PM Planner has some basic chart rendering, but the widgets are limited — bar charts and pie charts from 2015. No interactive charts, no heatmaps, no sparklines, no waterfall charts. I can't build a resource utilization heatmap (site x function x month) inside PM Planner. I do it in Python with seaborn. Every. Single. Time."                               | `[PAIN]` `[METRIC]`                 |
| 14:42 | Ad hoc query response time         | "When the Division Manager asks an unexpected question — 'what's our SW engineer utilization trend across all NAND projects for the last 6 quarters?' — it takes me 4-6 hours to answer. Extract data, write a query, build a visualization, format for presentation. With a proper OLAP-style analytical layer, this should take 5 minutes."                        | `[PAIN]` `[METRIC]` `[INSIGHT]`     |
| 14:46 | AI potential — Samsung AI Services | "Samsung has internal AI services — large language models, data analysis APIs. If IRIS integrated with Samsung AI Services, I could query resource data in natural language: 'show me resource utilization by site for Q2, broken down by function, excluding dropped projects.' Instead of 2 hours of Python code, 10 seconds of typing. That's the future I want." | `[FEATURE]` `[DELIGHT]` `[INSIGHT]` |

### Section 4 — Ideal Solution & Feature Priorities

| Time  | Topic                            | Notes                                                                                                                                                                                                                                                                                                                                          | Tags                    |
| ----- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 14:48 | In-system OLAP analytics         | "Let me drag and drop dimensions into rows, columns, and filters — like a proper OLAP cube. Show me utilization by site x division x function. Show me trend over 12 months. Show me actual vs. plan gap with conditional color coding. Drill down from Samsung-wide to site to division to project to individual. All without leaving IRIS."  | `[FEATURE]` `[DELIGHT]` |
| 14:50 | Smart Notify — automated reports | "Schedule the 5 weekly reports to run automatically every Monday at 7 AM. Populate with latest data. Send to the distribution list. Alert me only if something anomalous is detected — utilization above 110%, gap exceeding threshold, sudden headcount changes. I review exceptions, not routine reports."                                   | `[FEATURE]` `[DELIGHT]` |
| 14:52 | AI-Based Reporting               | "Natural language query interface connected to Samsung AI Services. 'Create a pivot table: rows = site, columns = quarter, values = average utilization rate, filter = DRAM division only.' Generate. Download. That replaces 2 hours of my Python work per query."                                                                            | `[FEATURE]` `[DELIGHT]` |
| 14:54 | ES cluster architecture          | "The ES analytical layer should be a first-class component of IRIS architecture, not an afterthought. Dedicated data nodes for analytical queries, separated from operational data. Cross-cluster replication for multi-site query performance. Real-time indexing from the operational database so analytics always reflect the latest data." | `[FEATURE]` `[INSIGHT]` |

### Section 5 — Requirements Validation

| Req | Rating       | Notes                                                                                        |
| --- | ------------ | -------------------------------------------------------------------------------------------- |
| 0   | Important    | "Mendix 10 enables better widget capabilities for charts and dashboards"                     |
| 1   | Important    | "Simulation separation matters for analytical data consistency"                              |
| 2   | Important    | "Version history helps me track analytical baselines"                                        |
| 3   | Important    | "Concurrent save affects data consistency I analyze downstream"                              |
| 4   | Important    | "Roadmap versioning"                                                                         |
| 5   | Important    | "N-PLM integration affects master data I enrich my analyses with"                            |
| 6   | Important    | "Factor control dimensions are my analytical slicing dimensions"                             |
| 7   | Important    | "World map is one of the visualizations I build manually in PowerPoint"                      |
| 8   | **Critical** | "Analysis views are my entire job. This is the requirement that replaces my Python pipeline" |
| 9   | Important    | "HeadCount analysis is one of my standard reports"                                           |
| 10  | **Critical** | "Reporting automation eliminates the human cron job — my Monday mornings get free"           |
| 11  | **Critical** | "AI-Based Reporting with Samsung AI Services — this is transformational for ad hoc queries"  |
| 12  | **Critical** | "ES cluster is the engine. Without proper ES infrastructure, Req 8 and 10 can't perform"     |

**Top 3 Priorities**: Req 10 (Analysis Reporting), Req 11 (AI-Based Reporting), Req 8 (Analysis views)

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)                                         | Rebuild (Replace Entirely)                                       |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| Underlying data model (dimensional structure is sound for OLAP) | Reporting engine (currently: basic dumps)                        |
| CSV export capability (as fallback)                             | Analytical layer (currently: nonexistent)                        |
|                                                                 | Chart/visualization widgets (currently: 2015-era basic charts)   |
|                                                                 | Data access layer (currently: static export only, no API/stream) |
|                                                                 | Report scheduling/distribution (currently: manual email)         |

### Post-Interview Debrief

**Top 3 Insights:**

1. The Analyst persona has the highest pain rating (9/10) because their ENTIRE job consists of compensating for PM Planner's analytical limitations — 70% of their time is data plumbing, 30% is actual analysis. IRIS analytics must be a first-class capability, not an afterthought
2. The personal ES cluster on a workstation proves demand for proper analytical infrastructure from the user side, not just the technical architecture side. This validates ES cluster architecture (Req 12) through user need, not just system design
3. AI-Based Reporting (Req 11) has an enthusiastic, technically sophisticated early adopter. Donghyun's KAIST statistics background and Python proficiency mean he can serve as both beta tester and internal champion. He is the ideal first user for AI-powered analytics

**Biggest Surprise**: The personal ES cluster running under his desk. Donghyun has essentially built a shadow analytical infrastructure for himself because the organization couldn't or wouldn't provide one. The gap between his personal toolchain (Jupyter, Python, ES, seaborn) and PM Planner's reporting capabilities is the widest we've seen — perhaps 10-15 years of technology difference.

**Assumptions Confirmed**: Reporting capabilities in PM Planner are effectively nonexistent for analytical use. Analysts spend the majority of their time on data preparation, not analysis. Multi-dimensional analytical capability is urgently needed.

**Assumptions Challenged**: We assumed Donghyun would dismiss AI-Based Reporting (Req 11) as "hype." He's the most enthusiastic advocate for it — his technical sophistication means he understands both the potential and the realistic limitations. He's not naive about AI; he's pragmatic about what natural language query would save him.

**Follow-Up Needed**:

- [ ] Document Donghyun's Jupyter pipeline in detail — it's a specification for what IRIS analytics must replicate
- [ ] Get Donghyun's personal ES cluster config as input for Req 12 architecture
- [ ] Connect Donghyun with CDO to discuss IRIS ES architecture — he's a technical stakeholder, not just a user
- [ ] Explore Samsung AI Services integration capabilities with Samsung IT

---

## INT-009: Jihye Kang — Site Admin, Hwaseong, IT/Admin

### Session Metadata

| Field            | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| Interview ID     | INT-009                                                          |
| Date             | 2026-03-21                                                       |
| Time             | 10:00 - 10:46 KST (46 minutes)                                   |
| Format           | In-person — Samsung DSR Hwaseong, IT Building, Meeting Room 2F-C |
| Interviewer      | CXO (Amoza)                                                      |
| Note-Taker       | AI Production Team                                               |
| Observer         | CDO (Amoza) — silent observer                                    |
| Recording        | Yes — verbal consent at 10:02                                    |
| Consent Obtained | Yes — written consent form signed                                |
| Screener Score   | 17/23                                                            |
| Pain Score       | 6/10                                                             |

### Participant Background

Jihye Kang is a Site Administrator for PM Planner at Samsung DSR's Hwaseong site, IT Operations department. She has been at Samsung for 5 years, the last 3 in site administration. She manages user accounts, role assignments, factor control configurations, data integrity tasks, and master data synchronization for approximately 180 PM Planner users at Hwaseong. She is the bridge between business users who want things to "just work" and IT infrastructure that requires careful configuration. Her pain score is the lowest among interviewees (6/10) not because her challenges are minor, but because she has developed robust operational procedures that mitigate most issues — until Samsung reorganizes.

### Section 1 — Background & Daily Workflow

| Time  | Topic                    | Notes                                                                                                                                                                                                                                                                                                                                                                  | Tags                    |
| ----- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 10:03 | Admin responsibilities   | "I manage 180 PM Planner users at Hwaseong. User creation, role assignment, password resets, factor control configuration, data integrity checks, N-PLM sync monitoring, and escalation to IT infrastructure when the system misbehaves. I'm the first responder when something goes wrong."                                                                           | `[WORKFLOW]`            |
| 10:06 | Daily routine            | "Check N-PLM sync status first — did last night's batch job succeed? If not, diagnose and re-run. Check user access requests — typically 2-3 new users or role changes per week. Monitor factor control — are the dimension filters correct for the current org structure? Review data integrity alerts — duplicate records, orphaned allocations, broken references." | `[WORKFLOW]`            |
| 10:10 | Configuration change log | Jihye maintains a separate Excel spreadsheet logging every admin change she makes to PM Planner: user additions, role changes, factor control modifications, data corrections. "PM Planner doesn't log admin actions. If something breaks after a config change, I need to trace what I changed and when. My log is the only audit trail."                             | `[WORKAROUND]` `[PAIN]` |

**CXO Behavioral Observation**: Jihye is calm, methodical, and speaks with the precision of someone who has learned that small configuration errors have large downstream consequences. She doesn't dramatize problems — she describes them with clinical clarity. Her body language was neutral and professional throughout. She treats PM Planner administration as an engineering discipline, not an IT chore, and takes visible pride in the operational procedures she's built. Her lower pain score reflects competence, not complacency — she's solved most problems herself, but recognizes the solutions are brittle.

### Section 2 — Current PM Planner Experience

| Time  | Topic                   | Notes                                                                                                                                                                                                                                                                                                                                                                                                                               | Tags                             |
| ----- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 10:14 | Factor control rigidity | "Factor control dimensions — site, team, group, function, stage, block — are hardcoded in PM Planner's Mendix model. When Samsung reorganizes — which happens 2-3 times per year — I have to manually reconfigure ALL factor control filters. A typical reorg: 15 teams renamed, 8 groups merged or split, 3 new functions created. I update each factor control rule individually. There's no bulk edit, no import, no scripting." | `[PAIN]` `[METRIC]`              |
| 10:19 | Reorg response time     | "After the January 2026 reorg — Memory division restructured HBM into a standalone group — it took me 2.5 weeks to fully update PM Planner. During that time, planners saw stale organization structures in their filter dropdowns. Some planners selected the old group name, which mapped to a now-incorrect set of engineers. Their plans were built on wrong assignments."                                                      | `[PAIN]` `[METRIC]` `[INSIGHT]`  |
| 10:23 | N-PLM sync issues       | "N-PLM pushes organization structure changes via nightly batch. The format doesn't always match PM Planner's expected schema. Approximately 5-10 records per sync cycle require manual correction — mismatched codes, truncated names, encoding issues for Korean characters. I fix these before planners notice, but it costs me 2-3 hours per sync."                                                                              | `[PAIN]` `[METRIC]` `[WORKFLOW]` |
| 10:27 | User role management    | "Basic user creation and role assignment works adequately in PM Planner. But the role model is too coarse — it's either 'can edit everything' or 'can view everything.' I need granular permissions: 'can edit DRAM projects at Hwaseong only' or 'can view all sites but edit only Pyeongtaek.' Currently, role-based data filtering is binary."                                                                                   | `[PAIN]` `[FEATURE]`             |
| 10:31 | SMDM integration gap    | "SMDM (Samsung Master Data Management) has the authoritative organization structure. N-PLM has a subset. PM Planner gets its org data from N-PLM, not directly from SMDM. So there are two translation layers between the truth (SMDM) and PM Planner. Each translation can introduce errors or delays."                                                                                                                            | `[INSIGHT]` `[PAIN]`             |

**CXO Behavioral Observation**: Jihye's most animated moment was discussing the January 2026 reorg. She opened her admin log spreadsheet and scrolled through 3 pages of changes she made over 2.5 weeks — methodically highlighted in yellow for completed, red for issues, green for verified. The volume of manual work was visually compelling. She was not frustrated in the way planners are; she was frustrated in the way an engineer is when the tools don't match the requirements. Her ask is not "make my job easier" but "make the system configurable so reorgs don't break everything."

### Section 3 — Pain Points Deep Dive

| Time  | Topic                  | Notes                                                                                                                                                                                                                                                                                                                                                                                                            | Tags                            |
| ----- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 10:33 | Cascading reorg impact | "When I update a factor control dimension — say, rename 'DRAM Group B' to 'HBM Dedicated Group' — I have to check: (1) all plans that reference the old name, (2) all reports that filter by the old name, (3) all role-based views that use the old name, (4) all sync mappings to N-PLM and PROMIS. One dimension rename touches 20+ configuration points. If I miss one, someone downstream gets wrong data." | `[PAIN]` `[INSIGHT]` `[METRIC]` |
| 10:36 | No admin audit log     | "PM Planner doesn't record admin actions. If I accidentally assign wrong permissions to a user, and that user modifies data they shouldn't have access to, there's no system-level trace. My personal Excel log is the only record. If I forget to log something — and under time pressure during a reorg, I sometimes do — it's as if the change never happened."                                               | `[PAIN]` `[INSIGHT]`            |
| 10:39 | Testing after reorg    | "After a reorg update, I have no automated way to verify correctness. I manually check 10-15 representative scenarios: 'Does Planner A still see only DRAM projects? Does Manager B's dashboard still show the right teams?' This testing takes half a day. If I had automated regression tests for factor control configurations, it would take minutes."                                                       | `[PAIN]` `[FEATURE]` `[METRIC]` |

### Section 4 — Ideal Solution & Feature Priorities

| Time  | Topic                      | Notes                                                                                                                                                                                                                                                                                             | Tags                    |
| ----- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 10:40 | Flexible factor control    | "Let me define and modify dimensions through an admin UI, not code changes. If Samsung adds a new division or renames a team, I update it in the admin panel — add the new entity, map it to the old one for historical continuity, publish the change. Done in minutes, not weeks."              | `[FEATURE]` `[DELIGHT]` |
| 10:42 | Granular role-based access | "Define permissions at the intersection of role + site + division + project scope. 'Resource Planner for DRAM at Hwaseong' can edit DRAM projects at Hwaseong, view NAND projects at Hwaseong, and view DRAM projects at other sites. This granularity prevents accidental cross-division edits." | `[FEATURE]`             |
| 10:44 | Admin audit trail          | "Every admin action logged automatically: who, when, what changed, previous value, new value. Searchable. Exportable for compliance. Rollback capability — if a factor control change causes problems, let me revert to the previous state with one click."                                       | `[FEATURE]`             |

### Section 5 — Requirements Validation

| Req | Rating       | Notes                                                                                          |
| --- | ------------ | ---------------------------------------------------------------------------------------------- |
| 0   | **Critical** | "Mendix 10 is essential — Mendix 7/8 custom widgets are unmaintainable"                        |
| 1   | Nice-to-have | "Not my operational domain"                                                                    |
| 2   | Important    | "Version history helps me track data changes that might be config-related"                     |
| 3   | Important    | "Concurrent save affects my data integrity monitoring"                                         |
| 4   | Nice-to-have | "Roadmap versioning is a planner concern"                                                      |
| 5   | **Critical** | "N-PLM integration is my daily workflow — better sync = fewer manual corrections"              |
| 6   | **Critical** | "Factor Control is the backbone of the system. If filters are wrong, every feature is useless" |
| 7   | Nice-to-have | "World map is an end-user feature"                                                             |
| 8   | Nice-to-have | "Analysis views are for analysts"                                                              |
| 9   | Nice-to-have | "HR domain"                                                                                    |
| 10  | Nice-to-have | "Reporting is for analysts and managers"                                                       |
| 11  | Nice-to-have | "AI reporting is end-user facing"                                                              |
| 12  | Important    | "Server architecture affects system performance, which affects my support workload"            |

**Top 3 Priorities**: Req 6 (Factor Control), Req 5 (N-PLM integration), Req 0 (Mendix 10 platform)

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)                                        | Rebuild (Replace Entirely)                                                |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Basic user management interface (CRUD for users and roles)     | Factor control configuration (currently: hardcoded, manual, no bulk edit) |
| Data model dimensional structure (org, skill, production type) | Role permission model (currently: too coarse, binary)                     |
|                                                                | Admin audit logging (currently: nonexistent)                              |
|                                                                | N-PLM sync error handling (currently: manual correction)                  |
|                                                                | Reorg change propagation (currently: 2-3 weeks manual)                    |

### Post-Interview Debrief

**Top 3 Insights:**

1. Samsung reorganizes 2-3 times per year, and each reorg requires 2-3 weeks of manual admin reconfiguration. Factor control flexibility is not a convenience feature — it's an operational necessity that directly affects data accuracy for all users downstream
2. Admin actions have no system audit log — the only record is Jihye's personal Excel spreadsheet. This is an accountability and compliance gap, especially for a system handling Samsung's semiconductor resource data
3. The Site Admin is an underappreciated stakeholder whose configuration accuracy directly determines data quality for planners, managers, analysts, and executives. A configuration error doesn't just affect one user — it cascades through every downstream workflow

**Biggest Surprise**: One dimension rename touches 20+ configuration points across plans, reports, views, and sync mappings. The blast radius of a simple renaming operation is enormous, and there's no automation to propagate changes or verify correctness.

**Assumptions Confirmed**: Factor control rigidity is a real operational pain. Reorg response time is measured in weeks, not hours. N-PLM sync requires manual correction.

**Assumptions Challenged**: We expected the Site Admin to focus on technical infrastructure concerns. Jihye's focus is entirely on configurability and data governance — she wants tools that let her manage change, not infrastructure improvements. Her needs are closer to a business operations role than a traditional IT admin.

**Follow-Up Needed**:

- [ ] Document the January 2026 reorg response in detail — timeline, effort, errors encountered
- [ ] Request Jihye's admin change log as input for IRIS admin audit trail design
- [ ] Investigate: can factor control dimension changes be modeled as a configurable metadata layer in Mendix 10?

---

## INT-010: Seungwoo Park — IT System Admin, Samsung IT, Infrastructure

### Session Metadata

| Field            | Value                                                                            |
| ---------------- | -------------------------------------------------------------------------------- |
| Interview ID     | INT-010                                                                          |
| Date             | 2026-03-21                                                                       |
| Time             | 14:00 - 14:52 KST (52 minutes)                                                   |
| Format           | Remote — Microsoft Teams, video on + architecture diagrams shared                |
| Interviewer      | CXO (Amoza)                                                                      |
| Note-Taker       | AI Production Team                                                               |
| Observer         | CDO (Amoza) — active listener (asked 2 clarifying questions with CXO permission) |
| Recording        | Yes — verbal consent at 14:02                                                    |
| Consent Obtained | Yes — digital consent form acknowledged                                          |
| Screener Score   | 19/23                                                                            |
| Pain Score       | 7/10                                                                             |

### Participant Background

Seungwoo Park is a Senior System Administrator in Samsung IT's infrastructure team, based at the Suwon campus. He has been at Samsung for 8 years, the last 6 managing PM Planner's server infrastructure. He is responsible for the application servers (Mendix runtime), database management (Oracle 19c), Elasticsearch cluster (currently single-node), integration pipeline orchestration (ETL jobs for N-PLM, PROMIS, SMDM), and the QA/Production environment lifecycle. He manages both environments and is the escalation point for all PM Planner infrastructure incidents. He has strong opinions about IRIS architecture based on years of operating PM Planner's infrastructure limitations.

### Section 1 — Background & Daily Workflow

| Time  | Topic                | Notes                                                                                                                                                                                                                                                                                                                                                                                                           | Tags                  |
| ----- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 14:03 | Infrastructure scope | "I manage 2 environments: QA and Production. PM Planner runs on Mendix 9.x with Oracle 19c as the primary database and a single Elasticsearch node for analytical queries. Integration with N-PLM, PROMIS, and SMDM is via batch ETL jobs scheduled through Samsung's enterprise job scheduler. I'm responsible for uptime, performance, data integrity, and incident response."                                | `[WORKFLOW]`          |
| 14:07 | Daily monitoring     | "Check ETL job logs first — did the overnight N-PLM sync succeed? Did the PROMIS export complete? Check ES node health — is it responding, is the index size growing normally? Check Oracle database metrics — connection pool, query latency, tablespace utilization. Check Mendix application logs — any runtime errors, memory warnings, session timeouts? All manual. All log-based. No unified dashboard." | `[WORKFLOW]` `[PAIN]` |
| 14:11 | Incident frequency   | "In the last 12 months: 3 ES outages (total 14 hours downtime), 12 ETL job failures (average 2-3 hours to diagnose and resolve), 2 Oracle performance incidents (slow queries locking tables), 1 Mendix out-of-memory crash. Each incident is a fire drill — I find out from user complaints, not from alerts."                                                                                                 | `[METRIC]` `[PAIN]`   |

**CXO Behavioral Observation**: Seungwoo is technical, detail-oriented, and speaks in infrastructure terms — uptime percentages, failover configurations, cluster topologies. He is less emotionally engaged than the business users (planners, managers) because his pain is operational, not personal. He doesn't lose work or make wrong decisions because of PM Planner's limitations; he manages the system that causes those problems for others. His perspective is valuable because it's architectural — he sees the systemic root causes that business users experience as symptoms.

### Section 2 — Current Infrastructure Challenges

| Time  | Topic                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                | Tags                             |
| ----- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 14:14 | ES single-node risk      | "We have one Elasticsearch node in production. Single point of failure. No failover, no replication, no cluster. If that node goes down — disk failure, OS crash, memory exhaustion — all analytical queries fail. Last year, 3 outages totaling 14 hours. During those hours, analysts couldn't run queries, managers couldn't generate reports, and my phone didn't stop ringing."                                 | `[PAIN]` `[METRIC]`              |
| 14:19 | ES outage impact chain   | [Shared architecture diagram] "When ES goes down: (1) analytical dashboard shows 'service unavailable,' (2) analysts switch to raw SQL against Oracle, (3) Oracle performance degrades because those analytical queries aren't optimized for OLTP, (4) planners experience slower PM Planner response times, (5) I get escalation calls from 3 different teams. One node failure cascades across the entire system." | `[PAIN]` `[INSIGHT]` `[METRIC]`  |
| 14:24 | Mendix version challenge | "PM Planner is on Mendix 9.x. Mendix 9 extended support ends within the next cycle. Custom widgets — the Gantt chart (xDHTML), the P/M editing grid, the factor control filters — are built with Mendix 9 APIs. They won't automatically work on Mendix 10. Since IRIS is a new build, this is the right time to start on Mendix 10 natively and avoid the migration debt."                                          | `[INSIGHT]` `[PAIN]`             |
| 14:28 | ETL pipeline fragility   | "ETL jobs run nightly. They fail approximately once per week — data format changes in N-PLM, timeout issues during PROMIS export, encoding errors for Korean/Chinese characters from Xi'an. I check logs every morning. If a job failed at 2 AM and I don't check until 8 AM, planners have been working with stale data for 6 hours without knowing it."                                                            | `[PAIN]` `[METRIC]` `[WORKFLOW]` |
| 14:32 | Data migration concern   | "PM Planner's Oracle database contains 5 years of historical P/M data — resource allocation history, project histories, approval records (such as they are), and trend data. IRIS needs a migration strategy that preserves this history. Some of it is critical for trend analysis and year-over-year comparison reporting. Losing it would set the analytics team back significantly."                             | `[INSIGHT]` `[PAIN]`             |

**CXO Behavioral Observation**: Seungwoo became most animated when discussing the ES cluster architecture (Section 3). He shared an architecture diagram he had drawn himself — a proper cluster topology with master-eligible nodes, data nodes, and availability zones. This was not a wish list; it was a detailed technical design he's been thinking about for years. He spoke about it with the passion of someone who has a solution ready but lacks organizational support to implement it. When discussing ETL failures, he was matter-of-fact — this is his Monday morning routine, and he's efficient at it, but recognizes it shouldn't be necessary.

### Section 3 — IRIS Infrastructure Vision

| Time  | Topic                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Tags                    |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| 14:35 | ES cluster architecture  | [Shared detailed diagram] "For IRIS: 3 master-eligible nodes for quorum, minimum 2 data nodes (scalable to 4), separate from the application tier. Master-data node separation so index management doesn't compete with query execution. Cross-cluster replication if we want to serve analytics from multiple Samsung DS sites with local performance. This eliminates the single-point-of-failure risk and enables horizontal scaling for analytical workloads." | `[FEATURE]` `[INSIGHT]` |
| 14:40 | Application architecture | "Mendix 10 with proper containerization. Multiple application instances behind a load balancer for horizontal scaling. Session management through distributed cache (Redis). This supports concurrent users — currently PM Planner struggles with 50+ simultaneous users during peak planning periods."                                                                                                                                                            | `[FEATURE]` `[INSIGHT]` |
| 14:44 | ETL modernization        | "Replace batch ETL with event-driven integration where possible. N-PLM pushes changes as events (CDC — Change Data Capture), not nightly bulk exports. PROMIS receives change events, not full datasets. This aligns with the delta sync requirement (Req 2) from the infrastructure side."                                                                                                                                                                        | `[FEATURE]` `[INSIGHT]` |
| 14:47 | Monitoring and alerting  | "Unified monitoring dashboard: application health, database metrics, ES cluster status, ETL job status, integration pipeline health. Automated alerts via Teams and email when thresholds are breached. Runbook links for common incidents. I should never discover a failure from a user complaint — the system should tell me first."                                                                                                                            | `[FEATURE]`             |
| 14:50 | Data migration strategy  | "Phased migration: (1) Freeze PM Planner writes, (2) Export full Oracle dataset with referential integrity checks, (3) Transform to IRIS schema, (4) Load into IRIS database + ES index, (5) Validate with checksum comparison, (6) Parallel run for 2-4 weeks before PM Planner decommission. We need a dedicated migration sprint in the DEVELOP phase."                                                                                                         | `[INSIGHT]` `[FEATURE]` |

### Section 5 — Requirements Validation

| Req | Rating       | Notes                                                                                               |
| --- | ------------ | --------------------------------------------------------------------------------------------------- |
| 0   | **Critical** | "Mendix 10 native build is essential — no migration debt from Mendix 9"                             |
| 1   | Important    | "Separation of roadmap and simulation affects data architecture"                                    |
| 2   | **Critical** | "Delta sync aligns with event-driven integration — reduces ETL load and PROMIS processing"          |
| 3   | **Critical** | "Concurrent save requires proper session management and optimistic locking — architecture decision" |
| 4   | Important    | "Roadmap versioning needs schema support for version chains"                                        |
| 5   | **Critical** | "N-PLM integration pipeline is my daily operational concern"                                        |
| 6   | Important    | "Factor control should be metadata-driven, not hardcoded — less maintenance for admins"             |
| 7   | Important    | "World map requires spatial data and multi-site aggregation — architecture consideration"           |
| 8   | Important    | "Analysis views require proper ES infrastructure (Req 12)"                                          |
| 9   | Important    | "HeadCount Portfolio requires HR system integration pipeline"                                       |
| 10  | Important    | "Reporting requires ES analytical layer + scheduling engine"                                        |
| 11  | Important    | "AI integration requires Samsung AI Services connectivity — API architecture"                       |
| 12  | **Critical** | "Server + ES cluster is THE foundation. Beautiful features on broken infrastructure = failure"      |

**Top 3 Priorities**: Req 12 (Server + ES cluster), Req 0 (Mendix 10), Req 5 (N-PLM integration pipeline)

### PM Planner — Keep vs. Rebuild

| Keep (Preserve in IRIS)                                                  | Rebuild (Replace Entirely)                                           |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Oracle schema design for operational data (reasonably well-structured)   | ES deployment (single node -> proper cluster)                        |
| Data model dimensional structure                                         | ETL pipelines (batch -> event-driven where possible)                 |
| Integration endpoints to N-PLM and PROMIS (concepts, not implementation) | Monitoring and alerting (currently: manual log checking)             |
|                                                                          | Application scaling (currently: single instance, session bottleneck) |
|                                                                          | Mendix platform (currently: 9.x end-of-life -> 10 native)            |

### Post-Interview Debrief

**Top 3 Insights:**

1. Single-node ES is not a theoretical risk — 3 documented outages in 12 months, 14 hours total downtime, with cascading impact on Oracle performance and planner experience. ES cluster architecture (Req 12) is operationally validated through incident history
2. ETL failures occur weekly and are discovered through manual log review 6+ hours after the failure. This means planners regularly work with stale data unknowingly. Event-driven integration (CDC) would eliminate this entire class of failures
3. Seungwoo has a detailed ES cluster design ready — he's been advocating for this upgrade for 3 years. This is not a design challenge; it's an organizational commitment challenge. IRIS gives the opportunity to build it right from the start

**Biggest Surprise**: The cascade failure chain — when ES goes down, analysts hit Oracle with analytical queries, Oracle slows down, and planners experience degraded performance. A single ES node failure affects every user persona. The infrastructure is more fragile and interconnected than we assumed.

**Assumptions Confirmed**: ES single-node is a reliability risk. ETL pipelines are fragile. Mendix upgrade path from 9 to 10 requires a new build.

**Assumptions Challenged**: We assumed infrastructure would be a "nice-to-have" background requirement. Seungwoo's cascade failure chain proves that Req 12 is foundational — every user-facing feature depends on infrastructure reliability. Without Req 12, features like real-time analytics (Req 8), automated reporting (Req 10), and concurrent editing (Req 3) cannot be delivered reliably.

**Follow-Up Needed**:

- [ ] Obtain Seungwoo's ES cluster architecture diagram as formal input to IRIS technical design
- [ ] Document the 3 ES outage incidents — timeline, impact, root cause, resolution
- [ ] Validate the data migration volume estimate — how many records, what size, what referential complexity?
- [ ] Schedule a technical deep-dive between Seungwoo and CDO on IRIS infrastructure architecture

---

## Cross-Interview Pattern Analysis

### Strong Patterns (6+ of 10 interviews)

| Pattern                                                     | Frequency | Avg Severity | Key Interviews                                  | Primary Req |
| ----------------------------------------------------------- | --------- | ------------ | ----------------------------------------------- | ----------- |
| Concurrent editing causes data loss / coordination overhead | 8/10      | 8.4          | INT-001, 002, 003, 004, 005, 006, 008, 009      | Req 3       |
| Version management is manual or nonexistent                 | 9/10      | 8.0          | INT-001, 002, 003, 004, 005, 006, 007, 008, 009 | Req 1, 2, 4 |
| Manual reporting / Excel dependency for analysis            | 8/10      | 8.1          | INT-001, 002, 003, 004, 006, 007, 008, 010      | Req 10, 11  |
| Cross-site visibility gap                                   | 8/10      | 7.6          | INT-001, 002, 003, 004, 005, 006, 007, 008      | Req 7, 8    |
| PROMIS full sync is wasteful and introduces errors          | 7/10      | 7.9          | INT-001, 002, 004, 005, 006, 008, 010           | Req 2       |
| Approval workflow is email-based, not system-supported      | 6/10      | 7.3          | INT-001, 004, 005, 006, 007, 008                | Req 3       |
| Shadow systems / workarounds compensate for PM Planner gaps | 8/10      | —            | INT-001, 002, 003, 004, 005, 007, 008, 009      | All         |

### Moderate Patterns (4-5 of 10 interviews)

| Pattern                                         | Frequency | Avg Severity | Key Interviews              | Primary Req |
| ----------------------------------------------- | --------- | ------------ | --------------------------- | ----------- |
| N-PLM master data sync lag (24h-3wk)            | 5/10      | 7.0          | INT-002, 005, 007, 009, 010 | Req 5       |
| Simulation abandoned in PM Planner (100% Excel) | 5/10      | 7.8          | INT-001, 002, 003, 006, 008 | Req 1       |
| Factor control rigidity during Samsung reorgs   | 4/10      | 6.8          | INT-002, 006, 009, 010      | Req 6       |
| Time zone amplifies all pain for overseas sites | 4/10      | 8.3          | INT-003, 005, 006, 007      | Req 7, 8    |

### Weak Patterns (< 4 of 10 interviews)

| Pattern                                                   | Frequency | Avg Severity | Key Interviews | Primary Req |
| --------------------------------------------------------- | --------- | ------------ | -------------- | ----------- |
| ES single-node reliability risk                           | 2/10      | 7.5          | INT-008, 010   | Req 12      |
| Mendix 9 end-of-support concern                           | 2/10      | 6.0          | INT-009, 010   | Req 0       |
| Language barrier in change notes (Korean/English)         | 1/10      | 7.0          | INT-003        | —           |
| HR system naming mismatch across PM Planner / GHRP / SMDM | 1/10      | 8.0          | INT-007        | Req 9       |

---

## Shadow Systems & Workarounds Inventory

| #   | Workaround                                              | Owner                       | Purpose                                         | Effort                                   | Compensates For                                 |
| --- | ------------------------------------------------------- | --------------------------- | ----------------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| 1   | "The Command Center" — 52-tab Excel workbook            | Jisoo (INT-001)             | Mirror PM Planner data + simulation + reporting | 3-4 hrs/week maintenance                 | Simulation gap, reporting gap, version tracking |
| 2   | "Editing Calendar" — shared Excel time-slot booking     | Hwaseong DRAM team          | Avoid concurrent editing conflicts              | 6-8 hrs/week team overhead               | Concurrent editing data loss (Req 3)            |
| 3   | Physical version notebook (color-coded by project)      | Daniel (INT-002)            | Track changes made to PM Planner                | 30 min/day                               | Version management absence (Req 2)              |
| 4   | "Austin PM Changes" Teams channel                       | Mike (INT-003)              | Share cross-site change notifications           | 15 min/day                               | Cross-site visibility gap (Req 7)               |
| 5   | Change log spreadsheet (mandatory for team)             | Eunji (INT-005)             | Audit trail for plan changes                    | 2-3 hrs/week team overhead               | Audit trail absence (Req 3)                     |
| 6   | 4-page cross-system lookup table                        | Yuna (INT-007)              | Map names between PM Planner / GHRP / SMDM      | 3 days per reorg to update               | Data governance / naming inconsistency          |
| 7   | Personal ES cluster (under desk)                        | Donghyun (INT-008)          | 100x faster analytical queries                  | Setup: 2 weeks; Maintenance: 2 hrs/month | Reporting/analytics limitations (Req 10, 12)    |
| 8   | Admin configuration change log                          | Jihye (INT-009)             | Track admin changes for rollback                | 15 min/day                               | Admin audit trail absence                       |
| 9   | Monthly reconciliation meeting (4 hours, printed Excel) | Planning managers           | Detect cross-department over-allocation         | 4 hrs/month x 6-8 managers               | Cross-department conflict detection (Req 3)     |
| 10  | "Editing slots" verbal coordination (Austin-Hwaseong)   | Mike + Hwaseong counterpart | Coordinate changes across time zones            | 30 min weekly call at 6 AM               | Cross-site concurrent editing (Req 3, 7)        |

**Total estimated weekly overhead across all workarounds: 25-35 person-hours**

---

## Aggregate Pain Points (Ranked by Severity x Frequency)

| Rank | Pain Point                                     | Avg Severity | Frequency | Combined Score | Primary Req |
| ---- | ---------------------------------------------- | ------------ | --------- | -------------- | ----------- |
| 1    | No version management / change tracking        | 8.0          | 9/10      | 72.0           | Req 1, 2, 4 |
| 2    | Concurrent editing conflicts / data loss       | 8.4          | 8/10      | 67.2           | Req 3       |
| 3    | Manual reporting / Excel dependency            | 8.1          | 8/10      | 64.8           | Req 10, 11  |
| 4    | Cross-site visibility gap                      | 7.6          | 8/10      | 60.8           | Req 7, 8    |
| 5    | PROMIS full sync waste / data integrity errors | 7.9          | 7/10      | 55.3           | Req 2       |
| 6    | No approval workflow in system                 | 7.3          | 6/10      | 43.8           | Req 3       |
| 7    | Simulation abandoned in PM Planner             | 7.8          | 5/10      | 39.0           | Req 1       |
| 8    | N-PLM master data sync lag                     | 7.0          | 5/10      | 35.0           | Req 5       |
| 9    | Factor control rigidity during reorgs          | 6.8          | 4/10      | 27.2           | Req 6       |
| 10   | ES infrastructure single-point-of-failure      | 7.5          | 2/10      | 15.0           | Req 12      |

---

## Requirements Priority (Aggregated from All 10 Interviews)

| Req                                          | Critical | Important | Nice-to-have | Not needed | Weighted Priority |
| -------------------------------------------- | -------- | --------- | ------------ | ---------- | ----------------- |
| 3 (Concurrent save + approval workflow)      | 7        | 2         | 1            | 0          | **9.4**           |
| 2 (Version history per project + delta sync) | 7        | 2         | 1            | 0          | **9.4**           |
| 1 (Separate Roadmap & Simulation)            | 5        | 4         | 1            | 0          | **8.4**           |
| 10 (Analysis Reporting + Smart Notify)       | 4        | 4         | 2            | 0          | **8.0**           |
| 7 (Main screen — World map + resource stats) | 4        | 3         | 3            | 0          | **7.4**           |
| 8 (Analysis views — World map + Personal)    | 4        | 4         | 2            | 0          | **7.8**           |
| 5 (N-PLM integration — Master Data)          | 3        | 5         | 2            | 0          | **7.4**           |
| 4 (Roadmap versioning — same as Req 3 save)  | 5        | 3         | 1            | 1          | **7.6**           |
| 9 (HeadCount Portfolio)                      | 2        | 4         | 3            | 1          | **6.4**           |
| 6 (Factor Control — filtering)               | 2        | 4         | 3            | 1          | **6.2**           |
| 0 (Mendix 10 platform upgrade)               | 2        | 3         | 3            | 2          | **5.0**           |
| 11 (AI-Based Reporting)                      | 2        | 3         | 4            | 1          | **5.8**           |
| 12 (Server + ES cluster infrastructure)      | 3        | 2         | 2            | 3          | **5.0**           |

---

## Key Quotes Collection

1. _"I once spent three hours entering detailed P/M adjustments for HBM4. My colleague saved her changes five minutes before me. My three hours of work — gone. No warning, no merge, just gone."_ — Jisoo Park (INT-001), on concurrent editing

2. _"PM Planner is a data entry tool pretending to be a planning tool. Real planning — simulation, optimization, trade-off analysis — I do all of that in Excel."_ — Jisoo Park (INT-001), on simulation capability

3. _"Version management in PM Planner is a fiction. There's no version. There's just 'current state' and whatever I wrote down in my paper notebook."_ — Daniel Choi (INT-002), on version tracking

4. _"I come into work every morning and play detective. What changed overnight? Who changed it? Why? PM Planner gives me zero answers. I spend the first 90 minutes of every day reconstructing what happened while Austin was asleep."_ — Mike Sullivan (INT-003), on cross-site visibility

5. _"For overseas sites, cross-site visibility isn't a nice-to-have — it's survival. Without it, we're flying blind."_ — Mike Sullivan (INT-003), on the world map dashboard

6. _"My approval process is: someone sends me an email saying 'please review HBM4.' I open PM Planner, open my previous Excel export, compare by eye, and then reply 'approved' by email. The system doesn't know I approved anything."_ — Minho Kim (INT-004), on approval workflow

7. _"In 2026, at Samsung, we resolve resource conflicts with paper printouts in a conference room."_ — Minho Kim (INT-004), on the monthly reconciliation meeting

8. _"Full sync to PROMIS is not just wasteful — it's dangerous. Last quarter, it triggered recalculations that changed profit margin displays for 40+ projects that hadn't actually changed. My team spent 3 days proving nothing was wrong."_ — Eunji Baek (INT-005), on PROMIS sync

9. _"I ask a simple question: 'How many engineers are allocated to HBM4 development across all sites?' The answer takes 5 business days and involves 4-5 planners. For a $400 billion company, this is embarrassing."_ — Taehyung Yoon (INT-006), on cross-site visibility

10. _"I'm a human SQL JOIN. PM Planner has the plan, GHRP has the actuals, and I sit in the middle with Excel, trying to match them up. Every month. For 200+ projects. It's soul-crushing."_ — Yuna Han (INT-007), on plan vs. actual integration

11. _"PM Planner is where data goes to hide. Getting it out is like performing an extraction. I export, I clean, I transform, I analyze — all outside the system. I'm the most expensive CSV exporter at Samsung."_ — Donghyun Bae (INT-008), on reporting

12. _"I am a human cron job. Every Monday, same reports, same recipients, same format — but I have to build them from scratch because PM Planner has no report scheduling."_ — Donghyun Bae (INT-008), on periodic reporting

13. _"Every organizational restructuring is my nightmare. Samsung reorganizes 2-3 times a year. I spend 2-3 weeks updating factor control configurations. If one mapping is wrong, planners see the wrong data."_ — Jihye Kang (INT-009), on factor control

14. _"Running a single-node Elasticsearch in production for a company like Samsung is like driving a Ferrari with bicycle tires. It works until it doesn't, and then everyone notices."_ — Seungwoo Park (INT-010), on infrastructure

---

## CXO Behavioral Summary Across All Interviews

### Emotional Peaks (Highest Frustration / Passion)

| Interview | Moment                                    | Emotion                 | Signal                                                       |
| --------- | ----------------------------------------- | ----------------------- | ------------------------------------------------------------ |
| INT-001   | Concurrent editing data loss on HBM4      | Intense frustration     | Voice elevated, leaned forward, accelerated speech           |
| INT-002   | QLC 9-engineer phantom allocation         | Anxiety                 | Voice dropped, reflexively checked notebook                  |
| INT-003   | Exynos 2600 overnight overwrite           | Controlled anger        | Paused, took breath, said "two hours of work — gone" quietly |
| INT-004   | Reported draft HBM4 data as final to DM   | Shame                   | Broke eye contact, voice tightened                           |
| INT-005   | 3-day PROMIS false positive investigation | Controlled intensity    | Direct camera eye contact, emphasis on "credibility"         |
| INT-006   | "$400 billion company" question           | Genuine incredulity     | Leaned forward, emphatic delivery                            |
| INT-007   | $4M hiring error scenario                 | Anxiety                 | Mentioned twice, qualified with "approximately"              |
| INT-008   | "Human cron job" routine                  | Theatrical exasperation | Pointed to recurring calendar reminder                       |
| INT-009   | January 2026 reorg — 2.5 weeks of changes | Controlled frustration  | Scrolled through 3 pages of admin log                        |
| INT-010   | ES cascade failure chain                  | Technical passion       | Shared detailed architecture diagram                         |

### Confidence vs. Anxiety Patterns

| High Confidence                                                  | High Anxiety                                |
| ---------------------------------------------------------------- | ------------------------------------------- |
| Jisoo (INT-001): Deep system knowledge, "Command Center" mastery | Data loss from concurrent editing           |
| Daniel (INT-002): Methodical process, notebook system            | Undetected allocation errors                |
| Mike (INT-003): Adapted coping mechanisms                        | Morning uncertainty about overnight changes |
| Minho (INT-004): Strong governance instincts                     | Accountability when things go wrong         |
| Eunji (INT-005): Robust compensating processes                   | PROMIS credibility with finance team        |
| Taehyung (INT-006): Strategic decision authority                 | Decisions delayed by data unavailability    |
| Yuna (INT-007): Essential organizational role                    | $4M error potential in manual merge         |
| Donghyun (INT-008): Technical mastery (Python, ES)               | Stale data in published reports             |
| Jihye (INT-009): Systematic admin procedures                     | Cascade impact of configuration errors      |
| Seungwoo (INT-010): Detailed architecture vision                 | Single-node failure scenarios               |

---

## Follow-Up Actions (Consolidated)

### Contextual Inquiries / Deep Dives

- [ ] Screen-share walkthrough of Jisoo's "Command Center" Excel workbook (INT-001)
- [ ] Photograph Daniel's version notebook with color-coded tabs (INT-002)
- [ ] Document the "Austin PM Changes" Teams channel protocol (INT-003)
- [ ] Shadow Minho during one review cycle to document comparison workflow (INT-004)
- [ ] Attend the monthly reconciliation meeting as observers (INT-004)
- [ ] Document Donghyun's Jupyter pipeline and personal ES config (INT-008)
- [ ] Document January 2026 reorg admin response timeline (INT-009)

### Artifact Collection

- [ ] Request Eunji's change log spreadsheet template (INT-005)
- [ ] Request Yuna's 4-page cross-system lookup table (INT-007)
- [ ] Request Jihye's admin change log spreadsheet (INT-009)
- [ ] Obtain Seungwoo's ES cluster architecture diagram (INT-010)

### Technical Validation

- [ ] Investigate cross-site allocation conflict detection at individual engineer level (INT-003)
- [ ] Investigate GHRP API capabilities for real-time attrition event integration (INT-007)
- [ ] Validate data migration volume — records, size, referential complexity (INT-010)
- [ ] Explore Samsung AI Services integration capabilities (INT-008)

### Stakeholder Engagement

- [ ] Interview the second Austin planner to validate Mike's perspective (INT-003)
- [ ] Interview the Division Manager above Minho for reporting expectations (INT-004)
- [ ] Schedule technical deep-dive between Seungwoo and CDO on IRIS infrastructure (INT-010)
- [ ] Identify Donghyun as AI-Based Reporting beta tester and champion (INT-008)

---

## Related Documents

| Document            | Path                                                | Relationship                     |
| ------------------- | --------------------------------------------------- | -------------------------------- |
| D1 Research Plan    | `01_DISCOVER/d1-research-plan.md`                   | Parent plan                      |
| D2b Interview Guide | `01_DISCOVER/d2-interview-guide.md`                 | Script used for these sessions   |
| D3 Empathy Map      | `01_DISCOVER/d3-empathy-map.md`                     | Synthesis of these notes (next)  |
| D4 Affinity Map     | `01_DISCOVER/d4-affinity-map.md`                    | Clustering of these notes (next) |
| Features List       | `.command/000_init_project/input/features_list.txt` | Feature reference                |
| Samsung Note        | `.command/000_init_project/input/note.txt`          | Samsung requirements reference   |
| T04 Template        | `.ax/templates/T04_INTERVIEW_NOTES.md`              | Template reference               |

---

_AX Transformation Framework v2.0.0 — DISCOVER Phase, Task D2c_
_IRIS by Amoza — "AI for Real Life. Real Impact."_
_CXO: Interview Notes — 10 Synthesized Sessions, Samsung DSR Stakeholders_
_Date: 2026-03-21_
