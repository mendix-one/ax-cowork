# S3: Concept Validation Report — IRIS

> **AX Phase**: DESIGN | **Template**: T16 — Usability Test Report (adapted for Concept Validation)
> **System**: IRIS (Intelligent Resources Information System)
> **Customer**: Samsung Electronics — Device Solutions Research (DSR)
> **Date**: 2026-03-21
> **Author**: CXO (Amoza) with AI assistance
> **Status**: Completed
> **Classification**: DESIGN deliverable — Concept Validation with Samsung DSR participants

---

## Document Purpose

This document captures the results of concept validation testing for the IRIS system. Five concepts (A-E) and one supplementary feature scenario (F1: Master Data) were tested with 6 Samsung DSR participants across concept walkthroughs and task-based testing. The findings determine which concepts proceed to user story decomposition (S4), wireframing (S5), and high-fidelity prototyping (S6), and which require iteration before advancing.

---

## Metadata

| Field             | Value                                                               |
| ----------------- | ------------------------------------------------------------------- |
| Project           | IRIS — Intelligent Resources Information System                     |
| Product           | IRIS by Amoza (for Samsung DSR)                                     |
| Test Dates        | 2026-03-17 to 2026-03-19 (3 days)                                   |
| Facilitator       | CXO (Amoza), assisted by CPO                                        |
| Prototype Version | v0.4 — Mid-fidelity clickable prototype (Mendix Studio Pro + Figma) |
| Prototype Link    | Internal: iris-prototype-v04.mendix.app (Samsung VPN required)      |
| Test Round        | Round 1 — Concept Validation                                        |

---

## Validation Methodology

### Approach: Concept Walkthrough + Task-Based Testing

Each session followed a two-part structure designed to evaluate both conceptual understanding and task execution:

| Phase                           | Duration  | Description                                                                                                                                                |
| ------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Introduction & Consent**      | 5 min     | Project overview, session objectives, recording consent, think-aloud protocol briefing                                                                     |
| **Part 1: Concept Walkthrough** | 15 min    | CXO presents each concept via annotated prototype screens; participant provides initial reactions, asks questions, rates desirability/clarity/completeness |
| **Part 2: Task-Based Testing**  | 25-30 min | Participant attempts 3-4 assigned tasks independently (think-aloud); facilitator observes, records time, errors, emotional responses                       |
| **Debrief & Scoring**           | 10 min    | Concept scorecard completion, preference ranking, open-ended feedback, SUS questionnaire                                                                   |

### Session Parameters

| Parameter            | Value                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Total sessions       | 6                                                                                                                                     |
| Session duration     | 45-60 min                                                                                                                             |
| Format               | On-site moderated (Hwaseong: CV-001, CV-005, CV-006); Remote moderated via Samsung Teams (Austin: CV-002; Pyeongtaek: CV-003, CV-004) |
| Recording            | Screen + audio with participant consent                                                                                               |
| Data capture         | Facilitator notes, timestamped observations, post-session scoring forms                                                               |
| Think-aloud protocol | Yes — participants verbalized their thought process during tasks                                                                      |
| Prototype data       | Realistic Samsung DSR data: Hwaseong org structure, V-NAND 9th Gen project, 12-month P/M allocations                                  |

### Task Assignment Matrix

Not all participants attempted all tasks. Tasks were assigned based on persona relevance:

| Task                     | CV-001 (Planner) | CV-002 (Planner) | CV-003 (Manager) | CV-004 (Analyst) | CV-005 (HR) | CV-006 (Admin) |
| ------------------------ | :--------------: | :--------------: | :--------------: | :--------------: | :---------: | :------------: |
| T1 — Collaborative Gantt |        X         |        X         |        X         |        X         |      —      |       —        |
| T2 — Delta Engine        |        X         |        X         |        X         |        —         |      —      |       X        |
| T3 — Simulation Sandbox  |        X         |        X         |        X         |        X         |      —      |       —        |
| T4 — Global Cockpit      |        X         |        —         |        X         |        X         |      X      |       X        |
| T5 — AI Analysis Builder |        —         |        X         |        —         |        X         |      X      |       X        |
| T6 — Master Data (F1)    |        X         |        —         |        X         |        —         |      —      |       X        |

---

## Participants

### Session Metadata

| ID     | Role             | Site       | Division           | Persona Match | Session Date | Duration | Method                    | Facilitator    |
| ------ | ---------------- | ---------- | ------------------ | ------------- | ------------ | -------- | ------------------------- | -------------- |
| CV-001 | Resource Planner | Hwaseong   | Memory (DRAM)      | Jisoo         | 2026-03-17   | 58 min   | On-site, Hwaseong DSR Lab | CXO            |
| CV-002 | Resource Planner | Austin     | System LSI         | Jisoo         | 2026-03-17   | 52 min   | Remote, Samsung Teams     | CXO            |
| CV-003 | Planning Manager | Pyeongtaek | Memory (NAND)      | Minho         | 2026-03-18   | 61 min   | Remote, Samsung Teams     | CXO            |
| CV-004 | Analyst          | Pyeongtaek | Resource Analytics | Eunji         | 2026-03-18   | 55 min   | Remote, Samsung Teams     | CPO (assisted) |
| CV-005 | HR Planner       | Hwaseong   | HR Operations      | Soyeon        | 2026-03-19   | 48 min   | On-site, Hwaseong DSR Lab | CXO            |
| CV-006 | Site Admin       | Hwaseong   | IT/Admin           | —             | 2026-03-19   | 53 min   | On-site, Hwaseong DSR Lab | CXO            |

### Participant Profiles

| ID     | Experience                                                         | Current Tools                                             | Key Pain Points                                            |
| ------ | ------------------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------- |
| CV-001 | 8 years semiconductor resource planning, daily PM Planner user     | PM Planner, Excel, PROMIS                                 | No real-time collaboration; blind full-sync to PROMIS      |
| CV-002 | 5 years resource planning at Austin fab, familiar with PROMIS sync | PM Planner, Excel, email-based coordination               | Cross-site visibility limited; time zone coordination gaps |
| CV-003 | 12 years planning management, approves roadmaps for 3 teams        | PM Planner, Excel dashboards, manual reporting            | No version control; no diff view for approval decisions    |
| CV-004 | 3 years resource analytics, heavy Excel/pivot user                 | Excel, PowerPoint, manual data extraction from PM Planner | Report creation takes days; no self-service analytics      |
| CV-005 | 6 years HR staffing and gap analysis across DSR sites              | Excel, Samsung GHRP, manual consolidation                 | 4 separate spreadsheets for headcount tracking             |
| CV-006 | 4 years IT admin, manages master data and system configurations    | PM Planner admin module, Excel, manual sync scripts       | No revision tracking for master data; sync status opaque   |

---

## Tasks & Scenarios

### Task 1: Edit P/M Plan Concurrently, Resolve Conflict (Concept A — Collaborative Gantt)

**Scenario**: You are a Resource Planner at the Hwaseong site. You need to update P/M allocations for the V-NAND 9th Gen project for Q2 2026. Another planner (simulated by the facilitator) is editing the same plan concurrently. You must: (1) open the P/M plan and see who else is editing, (2) make your allocation changes, (3) when a conflict is detected on cell "Stage 2 / Block B / April 2026", resolve it using the conflict resolution dialog, and (4) save your changes as a Draft version.

**Success Criteria**: Conflict resolved within 3 minutes. Participant sees co-editor indicator, edits cells, resolves conflict via dialog, and saves as Draft.

| Participant | Completed | Time (mm:ss) | Errors | Difficulty (1-5) | Observations                                                                                                                                                                                              |
| ----------- | --------- | ------------ | ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CV-001      | Y         | 02:35        | 0      | 2                | Immediately spotted co-editor badge. "This is what we've been asking for." Chose Pass on first conflict, then asked "Can I see what they changed before deciding?" Wanted diff preview in conflict dialog |
| CV-002      | Y         | 02:50        | 1      | 3                | Took 45 seconds to locate conflict resolution button — expected it in the cell context menu, not the top toolbar. One mis-click on wrong toolbar icon before finding it                                   |
| CV-003      | Y         | 01:55        | 0      | 2                | Fastest completion. Familiar with approval concepts. Quickly resolved conflict. Asked: "Can I see all conflicts at once, not one by one?"                                                                 |
| CV-004      | Y         | 02:45        | 1      | 3                | Not a daily editor. Slight hesitation on cell selection in the Gantt grid. Resolved conflict but noted: "As an analyst I wouldn't normally edit, but the collaboration indicator is reassuring"           |
| CV-005      | —         | —            | —      | —                | Not assigned (HR role, not applicable)                                                                                                                                                                    |
| CV-006      | —         | —            | —      | —                | Not assigned (Admin role, not applicable)                                                                                                                                                                 |

| Metric                        | Value      |
| ----------------------------- | ---------- |
| Success Rate                  | 4/4 = 100% |
| Avg Completion Time           | 2:31       |
| Avg Difficulty                | 2.5/5      |
| Total Errors                  | 2          |
| Within Time Threshold (3 min) | 4/4 = 100% |

**Key Observations**:

- Co-editor presence indicators generated immediate positive reactions from all 4 participants
- Conflict resolution button placement was the primary friction point — 2/4 expected cell-level access
- Request for batch conflict resolution and diff preview within dialog are recurring themes

**Participant Quotes**:

- **CV-001**: "This is what we've been asking for. Today we just pray nobody else is editing the same sheet."
- **CV-003**: "Can I see all conflicts at once? With 200 allocations, resolving them one by one would be painful."

---

### Task 2: Create Roadmap Version, View Diff, Submit for Approval (Concept D — Delta Engine)

**Scenario**: You are a Planning Manager. The V-NAND 9th Gen project roadmap has been updated by two planners this week. You need to: (1) open the version history panel for this project, (2) select version 3.1 and version 3.2 to generate a diff view, (3) review the diff highlighting added/removed/modified allocations (green/red/yellow), and (4) submit version 3.2 for approval with a delta sync request to PROMIS.

**Success Criteria**: Diff view opened and approval submitted within 4 minutes.

| Participant | Completed | Time (mm:ss) | Errors | Difficulty (1-5) | Observations                                                                                                                                                                                                                           |
| ----------- | --------- | ------------ | ------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CV-001      | Y         | 03:25        | 1      | 3                | Found version history panel easily. Diff view color coding was clear. Took time to find "Approve for PROMIS Sync" button — expected it within the diff view, not back in the version list. One navigation error (clicked wrong button) |
| CV-002      | Y         | 03:40        | 1      | 3                | Similar navigation confusion on approval button. "The diff view is excellent — exactly what we need. Today we sync everything blindly to PROMIS." Wanted to filter diff by department/team                                             |
| CV-003      | Y         | 02:20        | 0      | 2                | Primary approval workflow. Quick and confident. "The delta sync checkbox is critical — we waste hours syncing unchanged data today." Suggested comment field on approval                                                               |
| CV-006      | Y         | 03:50        | 2      | 3                | Could view version history and diff, but the PROMIS sync approval concept was partially unfamiliar. Two mis-clicks before finding approval action. Completed within threshold                                                          |

| Metric                        | Value      |
| ----------------------------- | ---------- |
| Success Rate                  | 4/4 = 100% |
| Avg Completion Time           | 3:19       |
| Avg Difficulty                | 2.8/5      |
| Total Errors                  | 4          |
| Within Time Threshold (4 min) | 4/4 = 100% |

**Key Observations**:

- Diff view color coding (green/red/yellow) was universally praised — clear and professional
- Approval button location is the primary UX issue — 3/4 expected it in the diff view context
- Delta sync concept generated the strongest governance-related enthusiasm

**Participant Quotes**:

- **CV-003**: "The delta sync checkbox is critical. We waste hours syncing unchanged data to PROMIS today. If IRIS can send only what changed, that alone justifies the new build."
- **CV-001**: "Per-project versioning solves our biggest governance problem. Today one planner changes one project and we sync the entire roadmap — 200 projects — to PROMIS."

---

### Task 3: Create Simulation from Roadmap, Compare Scenarios (Concept B — Simulation Sandbox)

**Scenario**: You are a Resource Planner. The Q2 2026 Resource Roadmap (v3.2) has been approved. Your manager asks you to explore "What if we shift 5 engineers from Pyeongtaek Block A to Hwaseong Block B for June-August?" Create a simulation from the approved roadmap, modify the allocations, and compare the simulation against the original roadmap to see the impact on resource utilization.

**Success Criteria**: Simulation created, modified, and compared within 5 minutes.

| Participant | Completed | Time (mm:ss) | Errors | Difficulty (1-5) | Observations                                                                                                                                                                                                              |
| ----------- | --------- | ------------ | ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CV-001      | Y         | 03:30        | 0      | 2                | Found "Clone to Simulation" button quickly. "This is exactly the sandbox we needed — before, we'd copy to Excel." Liked side-by-side comparison view                                                                      |
| CV-002      | Y         | 04:15        | 1      | 3                | Hesitated at "Clone" vs "Copy" terminology — expected "Create What-If Scenario." Once in the simulation, workflow was clear. Wanted utilization % in comparison, not just headcount delta                                 |
| CV-003      | Y         | 02:45        | 0      | 1                | As a manager, appreciated "read-only original vs. editable simulation" paradigm. Asked: "Can I compare 3 simulations at once?"                                                                                            |
| CV-004      | Y         | 04:40        | 1      | 3                | Completed but took time to understand that simulation is a separate entity from roadmap. Suggested clearer visual distinction (color-coded tabs). One error: tried to edit the original roadmap instead of the simulation |

| Metric                        | Value      |
| ----------------------------- | ---------- |
| Success Rate                  | 4/4 = 100% |
| Avg Completion Time           | 3:48       |
| Avg Difficulty                | 2.3/5      |
| Total Errors                  | 2          |
| Within Time Threshold (5 min) | 4/4 = 100% |

**Key Observations**:

- The simulation concept was immediately understood by all participants — addresses the #1 requested capability
- "Clone to Simulation" label caused mild confusion; "Create What-If Scenario" resonated better
- Multi-simulation comparison (3+ way) is a strong enhancement request

**Participant Quotes**:

- **CV-002**: "This simulation sandbox is exactly what we needed. Before, we'd copy the roadmap to Excel, play with numbers, then manually re-enter the winning scenario. It took a full day. This would take 20 minutes."
- **CV-003**: "Can I compare 3 simulations at once? When we're deciding between hiring plans, I usually have 3-4 options."

---

### Task 4: Navigate World Map, Drill to Site-Level Resource Data (Concept C — Global Cockpit)

**Scenario**: You are reviewing global resource allocations for Q2 2026. Starting from the IRIS home screen: (1) view the world map showing all Samsung DS sites, (2) click on the Hwaseong pin to see site-level statistics, (3) drill down to the Memory Division, then to the V-NAND Development department, and finally to the Design Verification team to see individual resource allocations.

**Success Criteria**: Navigate from world map to team-level resource view through 4 drill-down levels within 2 minutes.

| Participant | Completed | Time (mm:ss) | Errors | Difficulty (1-5) | Observations                                                                                                                   |
| ----------- | --------- | ------------ | ------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| CV-001      | Y         | 01:25        | 0      | 1                | Intuitive navigation. "The breadcrumb trail is helpful — I always know where I am." Wanted to pin frequently visited teams     |
| CV-003      | Y         | 01:35        | 0      | 1                | "Finally I can see the full picture without asking each site lead to send me an Excel." Wanted export at each level            |
| CV-004      | Y         | 01:10        | 0      | 1                | Most enthusiastic response. "This is the #1 thing I've wanted for 5 years." Immediately asked about cross-site comparison view |
| CV-005      | Y         | 01:50        | 0      | 1                | Completed smoothly. Wanted to see staffing gap indicators directly on the map pins (red/yellow/green traffic lights)           |
| CV-006      | Y         | 01:20        | 0      | 1                | Familiar with hierarchical navigation. Wanted to see system health/sync status overlaid on the map view                        |

| Metric                        | Value      |
| ----------------------------- | ---------- |
| Success Rate                  | 5/5 = 100% |
| Avg Completion Time           | 1:28       |
| Avg Difficulty                | 1.0/5      |
| Total Errors                  | 0          |
| Within Time Threshold (2 min) | 5/5 = 100% |

**Key Observations**:

- Zero errors across all participants — this is the highest-performing concept
- Breadcrumb trail praised universally; drill-down hierarchy matches Samsung's org mental model
- Every participant had enhancement requests (favorites, cross-site comparison, export) — a sign of high engagement
- The world map generated visible emotional reactions: leaning forward, raised eyebrows, spontaneous comments

**Participant Quotes**:

- **CV-004**: "This world map view is the #1 thing I've wanted for 5 years. I manage resources across 5 sites and today I compile reports from each site lead manually every week."
- **CV-003**: "Finally I can see the full picture without asking each site lead to send me an Excel."

---

### Task 5: Build Analysis Report with Custom Dimensions (Concept E — AI Analysis Builder)

**Scenario**: Your division manager has requested a report showing "P/M utilization by Site and Production Stage for Q1-Q2 2026, filtered to V-NAND products only." Using the analysis builder: (1) select dimensions (Site, Production Stage) and measure (P/M Utilization %), (2) apply a Factor Control filter to restrict to V-NAND products, (3) generate the chart, and (4) save the analysis view for reuse.

**Success Criteria**: Dimensions configured, filter applied, chart generated, and view saved within 4 minutes.

| Participant | Completed | Time (mm:ss) | Errors | Difficulty (1-5) | Observations                                                                                                                                                                                                          |
| ----------- | --------- | ------------ | ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CV-002      | Y         | 03:45        | 2      | 3                | Dimension selector panel was crowded — too many dimensions visible. Two mis-clicks selecting wrong dimensions before finding the right ones. Liked chart output. Asked: "Can I switch between bar chart and heatmap?" |
| CV-004      | Y         | 02:15        | 0      | 1                | Fastest completion — this is her core workflow. "The Factor Control concept is powerful — much better than Excel pivot filters." Wanted presets and cross-analysis application                                        |
| CV-005      | Partial   | 04:30        | 3      | 4                | Could select dimensions but struggled to locate Factor Control panel. Generated chart but did not save the view within the time limit. Not her primary workflow                                                       |
| CV-006      | Partial   | 04:45        | 3      | 4                | Found dimension selector confusing — too many options without grouping. Generated chart with facilitator hint on Factor Control location. Did not complete save step                                                  |

| Metric                        | Value                                                         |
| ----------------------------- | ------------------------------------------------------------- |
| Success Rate                  | 2/4 = 50% (full); 4/4 = 100% (partial — all generated charts) |
| Avg Completion Time           | 3:49                                                          |
| Avg Difficulty                | 3.0/5                                                         |
| Total Errors                  | 8                                                             |
| Within Time Threshold (4 min) | 2/4 = 50%                                                     |

**Key Observations**:

- Strongest performance from the Analyst persona (CV-004) — confirms concept alignment with target user
- Dimension selector overload is the most significant usability issue across all concepts
- Factor Control placement is not discoverable for non-analyst users
- The concept itself is validated (all participants generated charts), but the interface needs iteration

**Participant Quotes**:

- **CV-004**: "The Factor Control concept is powerful — much better than Excel pivot filters. If I can save presets and apply them across analyses, this replaces 80% of my weekly Excel work."
- **CV-002**: "There are too many dimensions visible at once — I want to see the most-used ones first, then expand for advanced options."

---

### Task 6: Manage Master Data Revision, View Sync Status (F1 — Master Data Management)

**Scenario**: You are responsible for master data at the Hwaseong site. A new production stage "EUV Lithography v2" needs to be added to the master data registry. You must: (1) navigate to the Master Data management screen, (2) create a new revision for the Production Stage reference table, (3) add the new entry "EUV Lithography v2" with required attributes, and (4) view the sync status dashboard to confirm the revision is queued for synchronization across sites.

**Success Criteria**: Revision created and sync status verified within 2 minutes.

| Participant | Completed | Time (mm:ss) | Errors | Difficulty (1-5) | Observations                                                                                                                                                                                                                            |
| ----------- | --------- | ------------ | ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CV-001      | Y         | 01:45        | 0      | 2                | Found master data section quickly via sidebar navigation. "Having revision history on reference data is something we've needed — today changes just happen silently." Wanted rollback capability                                        |
| CV-003      | Y         | 01:30        | 0      | 1                | Quick completion. As a manager, appreciated the audit trail. "I approve resource plans but never know if the underlying master data changed. This visibility is overdue."                                                               |
| CV-006      | Y         | 01:10        | 0      | 1                | This is her core workflow. Fastest completion. "The sync status dashboard is exactly what I build manually in Excel today — tracking which sites have received the latest reference data." Wanted notification alerts for sync failures |

| Metric                        | Value      |
| ----------------------------- | ---------- |
| Success Rate                  | 3/3 = 100% |
| Avg Completion Time           | 1:28       |
| Avg Difficulty                | 1.3/5      |
| Total Errors                  | 0          |
| Within Time Threshold (2 min) | 3/3 = 100% |

**Key Observations**:

- Clean task with zero errors — the revision and sync status workflow is intuitive
- Site Admin (CV-006) confirmed this directly replaces manual Excel tracking
- Revision history on master data is a governance feature that resonated with the Manager persona

**Participant Quotes**:

- **CV-006**: "The sync status dashboard is exactly what I build manually in Excel today. One view showing which sites have the latest data — this saves me hours every week."
- **CV-003**: "I approve resource plans but never know if the underlying master data changed beneath me. This visibility is overdue."

---

## Per-Concept Scorecard

Each participant scored each concept they tested on four criteria using a 1-5 scale during the debrief phase.

### Concept A: Collaborative Gantt

| Criteria        | CV-001 | CV-002 | CV-003 | CV-004 | Avg     |
| --------------- | ------ | ------ | ------ | ------ | ------- |
| Desirability    | 5      | 5      | 5      | 4      | **4.8** |
| Clarity         | 4      | 3      | 4      | 3      | **3.5** |
| Completeness    | 4      | 3      | 3      | 3      | **3.3** |
| Preference Rank | 2      | 3      | 3      | 4      | **3.0** |

**Decision**: **PROCEED** with iteration on conflict resolution UX

| Assessment     | Detail                                                                                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What Worked    | Co-editor presence badges; Draft/Permanent save model; real-time visual feedback                                                                                                                                                                                          |
| What Confused  | Conflict resolution button location (toolbar vs. cell); no batch conflict view                                                                                                                                                                                            |
| What's Missing | Diff preview in conflict dialog; notification when co-editors join; batch resolution                                                                                                                                                                                      |
| Rationale      | High desirability (4.8) confirms the concept addresses a critical pain point. Clarity (3.5) and completeness (3.3) scores indicate UX placement issues, not conceptual flaws. Fix conflict resolution discoverability and batch resolution, then proceed to user stories. |

---

### Concept B: Simulation Sandbox

| Criteria        | CV-001 | CV-002 | CV-003 | CV-004 | Avg     |
| --------------- | ------ | ------ | ------ | ------ | ------- |
| Desirability    | 5      | 5      | 5      | 4      | **4.8** |
| Clarity         | 4      | 3      | 5      | 3      | **3.8** |
| Completeness    | 4      | 3      | 4      | 3      | **3.5** |
| Preference Rank | 1      | 1      | 2      | 3      | **1.8** |

**Decision**: **PROCEED** with minor iteration

| Assessment     | Detail                                                                                                                                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What Worked    | Clone-from-roadmap paradigm; side-by-side comparison; read-only original vs. editable simulation                                                                                                                                                                                |
| What Confused  | "Clone" vs. "Copy" terminology; simulation as separate entity not immediately obvious                                                                                                                                                                                           |
| What's Missing | Multi-simulation comparison (3+ way); utilization % in comparison view; color-coded tabs                                                                                                                                                                                        |
| Rationale      | Highest preference rank (1.8 avg) — the concept participants most want to see built. 100% success rate with 3:48 avg time (well within 5 min threshold). Terminology and visual distinction are quick fixes. Proceed to user stories with "Create What-If Scenario" relabeling. |

---

### Concept C: Global Cockpit

| Criteria        | CV-001 | CV-003 | CV-004 | CV-005 | CV-006 | Avg     |
| --------------- | ------ | ------ | ------ | ------ | ------ | ------- |
| Desirability    | 5      | 5      | 5      | 5      | 5      | **5.0** |
| Clarity         | 5      | 5      | 5      | 4      | 5      | **4.8** |
| Completeness    | 4      | 4      | 4      | 4      | 4      | **4.0** |
| Preference Rank | 3      | 1      | 1      | 2      | 2      | **1.8** |

**Decision**: **PROCEED** as-is (no iteration required)

| Assessment     | Detail                                                                                                                                                                                                                                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What Worked    | World map with drill-down; breadcrumb navigation; hierarchical org alignment; intuitive 4-level navigation                                                                                                                                                                                                             |
| What Confused  | Nothing — 0 errors, 1.0/5 difficulty, 100% success                                                                                                                                                                                                                                                                     |
| What's Missing | Cross-site comparison; favorite/pinned teams; export at each level; traffic-light status on map pins                                                                                                                                                                                                                   |
| Rationale      | Perfect desirability score (5.0), highest clarity (4.8), zero errors, 100% success in under 2 minutes. This is the validation gold standard. Completeness at 4.0 reflects enhancement requests (favorites, comparison) which are additive, not corrective. Proceed directly to user stories without further iteration. |

---

### Concept D: Delta Engine

| Criteria        | CV-001 | CV-002 | CV-003 | CV-006 | Avg     |
| --------------- | ------ | ------ | ------ | ------ | ------- |
| Desirability    | 5      | 5      | 5      | 4      | **4.8** |
| Clarity         | 4      | 3      | 4      | 3      | **3.5** |
| Completeness    | 3      | 3      | 4      | 3      | **3.3** |
| Preference Rank | 3      | 2      | 1      | 3      | **2.3** |

**Decision**: **PROCEED** with iteration on approval button placement

| Assessment     | Detail                                                                                                                                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What Worked    | Diff view color coding (green/red/yellow); per-project versioning; delta sync concept                                                                                                                                                                                                                     |
| What Confused  | "Approve for PROMIS Sync" button not in diff view — requires navigation back to version list                                                                                                                                                                                                              |
| What's Missing | Approval button in diff context; department filter on diff; change summary statistics; comment on approval                                                                                                                                                                                                |
| Rationale      | Desirability matches Concepts A and B (4.8). The delta sync concept generated the most governance-oriented enthusiasm. Clarity (3.5) is impacted solely by approval button placement — a one-fix UX problem. Move approval action into the diff view toolbar and add change summary header, then proceed. |

---

### Concept E: AI Analysis Builder

| Criteria        | CV-002 | CV-004 | CV-005 | CV-006 | Avg     |
| --------------- | ------ | ------ | ------ | ------ | ------- |
| Desirability    | 4      | 5      | 3      | 3      | **3.8** |
| Clarity         | 3      | 5      | 2      | 2      | **3.0** |
| Completeness    | 3      | 4      | 2      | 2      | **2.8** |
| Preference Rank | 4      | 2      | 4      | 5      | **3.8** |

**Decision**: **ITERATE** then proceed

| Assessment     | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What Worked    | Factor Control concept (praised by analyst); self-service chart generation; save-for-reuse capability                                                                                                                                                                                                                                                                                                                                                                      |
| What Confused  | Dimension selector panel overloaded with options; Factor Control panel not discoverable                                                                                                                                                                                                                                                                                                                                                                                    |
| What's Missing | Dimension grouping/search/recently-used; chart type switching; shared views; Factor Control presets                                                                                                                                                                                                                                                                                                                                                                        |
| Rationale      | Lowest scores across all concepts — but critically, the Analyst persona (CV-004) scored it highest (5/5 desirability, 5/5 clarity). The concept works for its primary audience. Non-analyst users struggled because the interface assumes domain familiarity. Iteration required: group dimensions into categories, add search, surface "Recently Used" section, make Factor Control prominent. Re-validate with CV-004 after iteration before proceeding to user stories. |

---

### Supplementary: F1 Master Data Management

| Criteria        | CV-001 | CV-003 | CV-006 | Avg     |
| --------------- | ------ | ------ | ------ | ------- |
| Desirability    | 4      | 4      | 5      | **4.3** |
| Clarity         | 4      | 5      | 5      | **4.7** |
| Completeness    | 3      | 4      | 5      | **4.0** |
| Preference Rank | —      | —      | 1      | —       |

**Decision**: **PROCEED** as-is

| Assessment     | Detail                                                                                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What Worked    | Revision history on reference data; sync status dashboard; intuitive sidebar navigation                                                                                                                                    |
| What Confused  | Nothing — 0 errors, 100% success, 1:28 avg time                                                                                                                                                                            |
| What's Missing | Rollback capability; sync failure notifications; bulk import for master data                                                                                                                                               |
| Rationale      | Clean validation with zero errors. The Site Admin (CV-006) confirmed this replaces 4+ hours of weekly manual Excel tracking. Proceed to user stories. Missing items (rollback, notifications) are enhancement-level scope. |

---

## Concept Ranking Summary

| Rank | Concept                    | Avg Desirability | Avg Clarity | Avg Completeness | Success Rate | Avg Time | Decision                             |
| ---- | -------------------------- | :--------------: | :---------: | :--------------: | :----------: | :------: | ------------------------------------ |
| 1    | **C: Global Cockpit**      |       5.0        |     4.8     |       4.0        |     100%     |   1:28   | **Proceed**                          |
| 2    | **B: Simulation Sandbox**  |       4.8        |     3.8     |       3.5        |     100%     |   3:48   | **Proceed**                          |
| 3    | **D: Delta Engine**        |       4.8        |     3.5     |       3.3        |     100%     |   3:19   | **Proceed** (fix approval button)    |
| 4    | **A: Collaborative Gantt** |       4.8        |     3.5     |       3.3        |     100%     |   2:31   | **Proceed** (fix conflict UX)        |
| 5    | **E: AI Analysis Builder** |       3.8        |     3.0     |       2.8        |     50%      |   3:49   | **Iterate** (fix dimension selector) |
| —    | F1: Master Data            |       4.3        |     4.7     |       4.0        |     100%     |   1:28   | **Proceed**                          |

---

## Cross-Concept Findings

### Patterns Observed Across All Concepts

| #   | Pattern                                                                                                                                  | Frequency           | Concepts Affected | Implication                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **"Replaces our Excel workflow"** — every participant referenced Excel as the tool IRIS displaces                                        | 6/6 participants    | All               | IRIS's primary competitive benchmark is Excel, not other planning tools. UX must be at least as flexible as Excel for adoption                                                     |
| 2   | **Action buttons not where users expect them** — conflict resolution, approval, Factor Control all had discoverability issues            | 4/6 participants    | A, D, E           | Consistent pattern: users expect actions in-context (near the data they're acting on), not in separate toolbars. Apply a "contextual actions" design principle across all concepts |
| 3   | **Enhancement requests as a signal of buy-in** — participants who completed tasks quickly immediately asked "Can it also do X?"          | 6/6 participants    | All               | High engagement. Users are already imagining IRIS in their daily workflow, which is a strong adoption signal                                                                       |
| 4   | **Role-specific performance gap** — users performed best on tasks matching their persona, struggled on tasks outside their domain        | Clear in Tasks 5, 6 | E, F1             | Validates the persona model. Role-based UI customization (showing relevant features by role) should be a DEVELOP priority                                                          |
| 5   | **Governance features generate emotional enthusiasm** — version control, delta sync, revision history got the strongest verbal reactions | 4/6 participants    | A, D, F1          | Samsung DSR's governance pain is deeper than initially assumed. These features may be the adoption tipping point                                                                   |

### Surprises

| #   | Finding                                                                                                              | Why It Was Unexpected                                                                                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Global Cockpit scored perfect 5.0 desirability with zero errors                                                      | Expected some friction with the 4-level drill-down; instead it was the most intuitive concept                                                                |
| 2   | The Manager persona (CV-003) was the most enthusiastic overall                                                       | Expected Planners to be most engaged since they're the daily users; Manager sees IRIS as solving governance/visibility gaps that are his biggest frustration |
| 3   | "Clone to Simulation" label caused confusion despite being technically accurate                                      | Assumed technical accuracy = clarity; users think in workflow terms ("What-If") not system terms ("Clone")                                                   |
| 4   | CV-006 (Site Admin, no persona match) completed F1 tasks faster than persona-matched participants on their own tasks | Admin users have strong muscle memory for system configuration; IRIS's master data UX aligns well with admin mental models                                   |

### Contradictions

| #   | Finding                                                                                                        | Resolution                                                                                                                                                                           |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | CV-004 (Analyst) rated Concept E 5/5 clarity; CV-005 and CV-006 rated it 2/5                                   | Not a contradiction but a role-alignment signal. The interface is clear for analysts but opaque for non-analysts. Solution: role-aware defaults, not concept redesign                |
| 2   | Participants want IRIS to replace Excel but also want Excel-like flexibility (pivot, chart switching, presets) | Users want the flexibility of Excel with the governance and collaboration of IRIS. The Analysis Builder (Concept E) must deliver Excel-level flexibility within a governed framework |

---

## CXO Behavioral Observations

### Emotional Reactions by Concept

| Concept                |        Dominant Emotion         | Indicators                                                                                                  | CXO Assessment                                                                                                                                 |
| ---------------------- | :-----------------------------: | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| A: Collaborative Gantt |       Relief + Validation       | Head nodding, verbal affirmation ("finally"), immediate recall of past pain incidents                       | Users have been waiting for this. The emotional response is "about time" — validates urgency                                                   |
| B: Simulation Sandbox  |    Excitement + Imagination     | Leaning forward, asking "Can it also...?", spontaneous comparison to current workflow duration              | Users are already imagining daily use. The excitement is generative — they see possibilities                                                   |
| C: Global Cockpit      |          Delight + Awe          | Raised eyebrows, audible "wow" from CV-004, immediate engagement with drill-down, no hesitation             | This is a "delight moment." The world map visualization creates an immediate emotional connection to global resource visibility                |
| D: Delta Engine        |     Determination + Urgency     | Focused attention, detailed questions about PROMIS integration, references to specific governance incidents | Users see this as "mission-critical." The tone shifts from excitement to determined advocacy                                                   |
| E: AI Analysis Builder | Curiosity + Frustration (mixed) | CV-004 showed curiosity and flow; others showed brow furrowing, pauses, verbal confusion                    | Split experience. For analysts: flow state. For non-analysts: cognitive overload. The concept is right but the interface needs role adaptation |
| F1: Master Data        |       Quiet Satisfaction        | Steady engagement, no confusion, immediate recognition of value, no dramatic reactions                      | Utility-grade satisfaction. Not exciting but deeply appreciated by those who manage this data daily                                            |

### Confidence Levels During Tasks

| Participant | High Confidence Tasks | Low Confidence Tasks                         | CXO Note                                                                  |
| ----------- | --------------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| CV-001      | T1, T3, T6            | T2 (approval step)                           | Confident planner; slight hesitation on manager-level approval actions    |
| CV-002      | T3                    | T1 (conflict button), T5 (dimensions)        | Competent but less familiar with toolbar-heavy interfaces                 |
| CV-003      | T1, T2, T4, T6        | None                                         | Most confident participant overall; strong mental model alignment         |
| CV-004      | T4, T5                | T1 (cell selection), T3 (simulation concept) | Expert in analysis; needs onboarding for planning-specific concepts       |
| CV-005      | T4                    | T5 (Factor Control)                          | Comfortable with navigation; struggled with technical configuration tasks |
| CV-006      | T6                    | T2 (PROMIS concept), T5 (dimensions)         | Expert in admin tasks; unfamiliar with planning-specific business logic   |

### Delight Moments

| #   | Moment                                                      | Participant | Concept | CXO Interpretation                                                                                              |
| --- | ----------------------------------------------------------- | ----------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | Seeing the world map with all 5 DS sites for the first time | CV-004      | C       | Visualization of global resources creates an immediate "aha" — transforms abstract data into tangible geography |
| 2   | Watching the co-editor avatar appear in real-time           | CV-001      | A       | Real-time presence is a trust-builder — users feel confident they won't corrupt each other's work               |
| 3   | Side-by-side simulation comparison showing headcount delta  | CV-002      | B       | The before/after view makes the value of "what-if" analysis tangible and immediate                              |
| 4   | Diff view showing only the changed allocations in color     | CV-003      | D       | Precision of delta — managers can focus on what matters instead of reviewing 200 unchanged rows                 |
| 5   | Factor Control filter instantly reshaping the chart         | CV-004      | E       | For the analyst persona, this is the "Excel replacement" moment — faster and more intuitive than pivot tables   |
| 6   | Sync status dashboard showing site-by-site data freshness   | CV-006      | F1      | Admin visibility into system health — replaces hours of manual tracking                                         |

---

## Participant Feedback Themes

### Theme 1: "Replace Excel, Don't Replicate It"

**Frequency**: 6/6 participants
**Summary**: Every participant referenced Excel as the current tool for tasks IRIS aims to support. They want IRIS to be better than Excel (governed, collaborative, real-time), but they also expect the flexibility they're accustomed to (pivot, filter, export, ad-hoc analysis).
**Design Implication**: IRIS must match Excel's flexibility for individual work while adding governance, collaboration, and real-time capabilities that Excel lacks. Never force users into rigid workflows where Excel offered freedom.

### Theme 2: "Show Me What Changed"

**Frequency**: 5/6 participants
**Summary**: Participants consistently asked for diff views, version comparisons, change summaries, and audit trails. Samsung DSR's governance culture demands transparency — who changed what, when, and why.
**Design Implication**: Build version comparison and change tracking into every editable entity, not just roadmaps. Master data, simulations, and analysis views should all support revision history.

### Theme 3: "Let Me See Across Sites"

**Frequency**: 4/6 participants
**Summary**: Cross-site visibility is a primary driver for IRIS adoption. The Global Cockpit validated this, but participants want cross-site comparison capabilities in all concepts (simulation comparison across sites, analysis by site, headcount gaps by site).
**Design Implication**: "Site" should be a first-class dimension available in every view, filter, and comparison throughout IRIS.

### Theme 4: "Different Roles Need Different Views"

**Frequency**: 4/6 participants
**Summary**: Performance and satisfaction varied sharply by role-task alignment. Planners excelled at planning tasks; analysts at analysis tasks; admins at admin tasks. Non-aligned tasks caused confusion.
**Design Implication**: Implement role-based landing pages and feature surfacing. Show each persona the features most relevant to their workflow. Don't hide anything — but prioritize what's visible by role.

### Theme 5: "Make Actions Contextual"

**Frequency**: 4/6 participants
**Summary**: Across concepts A, D, and E, participants expected action buttons (conflict resolve, approve, filter) to be located near the data they were acting on, not in separate toolbars.
**Design Implication**: Adopt a "contextual actions" design principle: primary actions appear in-context (cell menu, inline toolbar, data-adjacent panels). Keep global toolbars as secondary access paths.

### Theme 6: "Integrate with Samsung Systems"

**Frequency**: 3/6 participants
**Summary**: PROMIS sync, GHRP integration, and master data synchronization were mentioned as critical for adoption. IRIS must fit into Samsung's existing ecosystem, not exist as an island.
**Design Implication**: Integration touchpoints (PROMIS, GHRP, master data sources) should be visible in the UI — show sync status, last sync time, and integration health. Users need confidence that IRIS and Samsung systems are in sync.

---

## Findings Summary

### Critical Issues (Must Fix Before S4)

| #   | Finding                                                                                               | Affected Concept       | Participants Affected | Recommendation                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------- | ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| C1  | Conflict resolution button not discoverable — users expected it in cell context menu, not top toolbar | A: Collaborative Gantt | 3/4                   | Move conflict resolution to cell-level context menu with pulsing border on conflicted cells. Maintain toolbar as secondary path      |
| C2  | Dimension selector overload in Analysis Builder — too many dimensions without organization            | E: AI Analysis Builder | 3/4                   | Group dimensions into categories (Organization, Time, Product, Skill), add search, show "Recently Used" section. Role-based defaults |

### Major Issues (Should Fix)

| #   | Finding                                                                | Affected Concept | Participants Affected | Recommendation                                                             |
| --- | ---------------------------------------------------------------------- | ---------------- | --------------------- | -------------------------------------------------------------------------- |
| M1  | No batch conflict resolution — conflicts must be resolved one by one   | A                | 2/4                   | Add "Resolve All" panel with batch Accept Mine / Accept Theirs             |
| M2  | "Approve for PROMIS Sync" button not in diff view context              | D                | 3/4                   | Add approval action directly in diff view toolbar                          |
| M3  | Factor Control panel not prominent enough for non-analyst users        | E                | 2/4                   | Persistent Factor Control chip in analysis toolbar with onboarding tooltip |
| M4  | No multi-simulation comparison (3+ way)                                | B                | 2/4                   | Support up to 4-way simulation comparison in tabular/overlay view          |
| M5  | "Clone to Simulation" label unclear — users expected workflow language | B                | 2/4                   | Rename to "Create What-If Scenario" with explanatory subtitle              |

### Minor Issues (Nice to Fix)

| #   | Finding                                              | Affected Concept | Recommendation                                             |
| --- | ---------------------------------------------------- | ---------------- | ---------------------------------------------------------- |
| m1  | No diff preview in conflict resolution dialog        | A                | Show "Your value" vs. "Their value" with timestamp         |
| m2  | Comparison view lacks utilization % and cost metrics | B                | Add configurable metrics beyond headcount                  |
| m3  | Simulation and roadmap tabs not visually distinct    | B                | Color-coded tabs (blue for roadmap, orange for simulation) |
| m4  | No department/team filter in diff view               | D                | Add scope filter for focused review                        |
| m5  | No change summary statistics in diff header          | D                | "X changed, Y added, Z removed across N departments"       |
| m6  | No comment field on approval action                  | D                | Optional justification text in approval dialog             |
| m7  | No chart type switching after generation             | E                | Toggle between chart types without re-querying             |
| m8  | No shared analysis view capability                   | E                | "Share" button generating deep link                        |
| m9  | No cross-site comparison from world map              | C                | "Compare Sites" mode: select 2-3 pins for side-by-side     |
| m10 | No favorite/pinned navigation in Global Cockpit      | C                | Bookmark frequently visited teams                          |
| m11 | Map pin status indicators too subtle                 | C                | Traffic-light coloring (red/yellow/green)                  |
| m12 | No rollback capability for master data revisions     | F1               | Undo last revision with confirmation                       |
| m13 | No sync failure notifications                        | F1               | Alert admin when site sync fails                           |

### Positive Findings

| #   | Finding                                                                                          | Concept | Participants Who Noted            |
| --- | ------------------------------------------------------------------------------------------------ | ------- | --------------------------------- |
| P+1 | World map drill-down navigation was perfectly intuitive — 100% success, 0 errors, 1.0 difficulty | C       | 5/5                               |
| P+2 | Simulation sandbox "clone from roadmap" concept immediately understood and desired               | B       | 4/4                               |
| P+3 | Diff view color coding (green/red/yellow) was clear and professional                             | D       | 4/4                               |
| P+4 | Co-editor presence indicators provided confidence in real-time collaboration                     | A       | 4/4                               |
| P+5 | Factor Control praised by analyst persona as replacing Excel pivot filters                       | E       | 2/4 (but 5/5 from target persona) |
| P+6 | Draft/Permanent save distinction matches Samsung governance model                                | A, D    | 4/6                               |
| P+7 | Master data revision history and sync status directly replace manual tracking                    | F1      | 3/3                               |
| P+8 | Per-project versioning with delta PROMIS sync addresses #1 governance complaint                  | D       | 4/4                               |

---

## Key Quotes

1. **CV-001**: "This is what we've been asking for — seeing who else is editing the same plan in real time. Today we just pray nobody else is editing the same sheet." — _Context: First time seeing co-editor presence indicators (Task 1)_

2. **CV-004**: "This world map view is the #1 thing I've wanted for 5 years. I manage analytics across 5 sites and today I compile reports from each site lead manually every week." — _Context: Navigating the Global Cockpit (Task 4)_

3. **CV-003**: "The delta sync checkbox is critical. We waste hours syncing unchanged data to PROMIS today. If IRIS can send only what changed, that alone justifies the new build." — _Context: Reviewing PROMIS approval workflow (Task 2)_

4. **CV-002**: "This simulation sandbox is exactly what we needed. Before, we'd copy the roadmap to Excel, play with numbers, then manually re-enter the winning scenario. It took a full day. This would take 20 minutes." — _Context: Completing simulation comparison (Task 3)_

5. **CV-004**: "The Factor Control concept is powerful — much better than Excel pivot filters. If I can save presets and apply them across analyses, this replaces 80% of my weekly Excel work." — _Context: Using Factor Control in Analysis Builder (Task 5)_

6. **CV-006**: "The sync status dashboard is exactly what I build manually in Excel today. One view showing which sites have the latest data — this saves me hours every week." — _Context: Viewing master data sync status (Task 6)_

7. **CV-003**: "If analysts can build these reports themselves, I don't need to wait 3 days for someone to pull data and format it in PowerPoint. Self-service analytics is the future." — _Context: Watching Analysis Builder generate a chart (Task 5)_

8. **CV-001**: "Per-project versioning solves our biggest governance problem. Today one planner changes one project and we sync the entire roadmap — 200 projects — to PROMIS. It's madness." — _Context: Reviewing version history and diff (Task 2)_

---

## SUS Score (System Usability Scale)

Each participant completed the standard 10-question SUS questionnaire after the session.

### Individual Scores

| Participant | SUS Score | Notes                                                                                 |
| ----------- | --------- | ------------------------------------------------------------------------------------- |
| CV-001      | 77.5      | High marks on learnability; lower on conflict resolution discoverability              |
| CV-002      | 72.5      | Solid overall; cited label confusion and dimension overload                           |
| CV-003      | 82.5      | Strong — concept alignment with management workflow was high                          |
| CV-004      | 80.0      | Very positive on world map and analysis; lower on direct editing tasks (not her role) |
| CV-005      | 70.0      | Good on navigation concepts; lower on technical configuration tasks                   |
| CV-006      | 72.5      | Strongest on admin tasks; lower on planning-specific workflows                        |

### Overall SUS Score

| Metric                           | Value                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------- |
| **Overall SUS Score**            | **75.8**                                                                      |
| Benchmark: Industry Average      | 68                                                                            |
| Benchmark: "Good" Threshold      | 72                                                                            |
| Benchmark: "Excellent" Threshold | 85                                                                            |
| Assessment                       | **Above Average — Good** (exceeds both industry average and "Good" threshold) |

### SUS Score by Persona Alignment

| Persona            | Participants   | Avg SUS (aligned tasks) | Interpretation                                                |
| ------------------ | -------------- | ----------------------- | ------------------------------------------------------------- |
| Jisoo (Planner)    | CV-001, CV-002 | 75.0                    | Good — daily users will adopt with minor UX fixes             |
| Minho (Manager)    | CV-003         | 82.5                    | Strong — management workflow alignment is excellent           |
| Eunji (Analyst)    | CV-004         | 80.0                    | Strong — analysis concepts resonate with target user          |
| Soyeon (HR)        | CV-005         | 70.0                    | Adequate — needs role-based customization to improve          |
| No persona (Admin) | CV-006         | 72.5                    | Good — admin tasks are clean; non-admin tasks drag score down |

---

## Overall Assessment

| Metric                        | Value                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| Overall Task Success Rate     | 22/24 = 92% (full success); 24/24 = 100% (including partial) |
| Average Difficulty            | 2.2/5                                                        |
| Average Completion Time       | 2:44 (across all tasks)                                      |
| SUS Score                     | 75.8/100 (Above Average — Good)                              |
| Critical Issues Found         | 2                                                            |
| Major Issues Found            | 5                                                            |
| Minor Issues Found            | 13                                                           |
| Positive Findings             | 8                                                            |
| Concepts Validated (Proceed)  | 4 of 5 directly; 1 after iteration                           |
| Total Errors Across All Tasks | 16                                                           |
| Participant Satisfaction      | All 6 confirmed IRIS addresses real workflow gaps            |

---

## Recommendation

- [x] **ALL 5 CONCEPTS VALIDATED — PROCEED WITH ITERATIONS**

### Per-Concept Decision

| Concept                | Decision                 | Condition                                                                                                             |
| ---------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| A: Collaborative Gantt | **Proceed**              | Fix conflict resolution UX (move to cell context menu, add batch resolution)                                          |
| B: Simulation Sandbox  | **Proceed**              | Rename "Clone" to "Create What-If Scenario"; add utilization % to comparison                                          |
| C: Global Cockpit      | **Proceed**              | No changes required — proceed directly to user stories                                                                |
| D: Delta Engine        | **Proceed**              | Move approval button into diff view toolbar; add change summary header                                                |
| E: AI Analysis Builder | **Iterate then Proceed** | Redesign dimension selector (grouping, search, recently used); make Factor Control prominent; re-validate with CV-004 |
| F1: Master Data        | **Proceed**              | No changes required — proceed directly to user stories                                                                |

### Overall Rationale

The SUS score of 75.8 exceeds both the industry average (68) and the "Good" threshold (72), confirming overall concept viability. The 92% full task success rate (100% including partial) demonstrates that all concepts are fundamentally sound. The 2 critical issues and 5 major issues are UX placement problems (button location, panel organization) rather than conceptual flaws — they can be resolved in 3-5 working days of design iteration without rethinking any concept.

The strongest validation signals are:

1. **Global Cockpit** achieved perfect scores (5.0 desirability, 0 errors, 100% success in <2 min)
2. **Simulation Sandbox** was ranked #1 preference by 2 of 4 testers — the most-desired new capability
3. **Delta Engine** generated the most passionate governance-related responses — "justifies the new build"
4. **Every participant** independently confirmed IRIS replaces painful Excel workflows
5. **Delight moments** were observed in 5 of 6 concepts — users are emotionally invested

All 5 concepts are validated for progression through the DESIGN phase. Concept E requires one focused iteration cycle before user story decomposition. All others proceed directly.

---

## Design Iteration Recommendations for S4/S5/S6

### Immediate Iterations (Before S4 — User Stories)

| #   | Action                                                                          | Concept | Owner | Est. Effort | Priority |
| --- | ------------------------------------------------------------------------------- | ------- | ----- | ----------- | -------- |
| 1   | Relocate conflict resolution to cell context menu with pulsing border indicator | A       | CXO   | 1 day       | Critical |
| 2   | Redesign dimension selector with category groups, search, and "Recently Used"   | E       | CXO   | 2 days      | Critical |
| 3   | Move "Approve for PROMIS Sync" button into diff view toolbar                    | D       | CXO   | 0.5 day     | Major    |
| 4   | Rename "Clone to Simulation" to "Create What-If Scenario"                       | B       | CXO   | 0.5 day     | Major    |
| 5   | Add persistent Factor Control chip with onboarding tooltip                      | E       | CXO   | 1 day       | Major    |

### S4 User Story Inputs

| Concept | Key Stories to Derive from Validation                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A       | Real-time co-editor presence; in-cell conflict resolution; batch conflict panel; Draft/Permanent save                                                         |
| B       | Clone roadmap to simulation; side-by-side comparison with utilization %; multi-simulation comparison (3+ way); color-coded simulation tabs                    |
| C       | World map with 5 DS sites; 4-level drill-down; breadcrumb navigation; favorites/pinned teams; cross-site comparison; traffic-light status pins                |
| D       | Per-project version history; diff view with color coding; in-context approval; delta PROMIS sync; change summary header; department filter; approval comments |
| E       | Dimension selector with grouping and search; Factor Control with presets; chart type switching; save and share analysis views; role-based defaults            |
| F1      | Master data revision history; sync status dashboard; bulk import; rollback; sync failure alerts                                                               |

### S5 Wireframe Priorities

1. **Conflict resolution in-cell interaction pattern** — new interaction not in current prototype
2. **Dimension selector reorganization** — new information architecture for Analysis Builder
3. **Multi-simulation comparison layout** — 3-4 way comparison view design
4. **Role-based landing pages** — different home views for Planner, Manager, Analyst, HR, Admin

### S6 Usability Testing Focus

1. Re-test conflict resolution flow with updated in-cell placement (target: 100% success in <2 min)
2. Re-test Analysis Builder dimension selector with grouped/searchable interface (target: 80%+ success in <3 min)
3. Test role-based navigation — do users find their relevant features faster with role-based defaults?
4. Full SUS re-measurement — target score increase from 75.8 to 80+

---

## Related Artifacts

| Artifact                             | Reference                                    |
| ------------------------------------ | -------------------------------------------- |
| S1 — HMW & Concept Sketches          | `02_DESIGN/s1-hmw-concepts.md`               |
| S2 — Prototype Screens               | `02_DESIGN/s2-prototype-screens.md`          |
| S4 — User Stories (next)             | `02_DESIGN/s4-user-stories.md`               |
| S5 — Wireframes (next)               | `02_DESIGN/s5-wireframes.md`                 |
| S6 — Usability Test (next)           | `02_DESIGN/s6-usability-testing.md`          |
| D4 — Personas                        | `01_DISCOVER/d4-personas.md`                 |
| T16 — Usability Test Report Template | `.ax/templates/T16_USABILITY_TEST_REPORT.md` |

---

_Part of the AX Transformation Framework v2.0.0 — Amoza. CXO-led concept validation for IRIS DESIGN phase._
