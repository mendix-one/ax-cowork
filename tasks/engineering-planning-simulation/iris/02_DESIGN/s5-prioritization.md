# S5 — Prioritization & MVP Scope: IRIS

> **DESIGN Phase — Step 5 of 7**
> AX Transformation Framework v2.0.0

---

## Metadata

| Field               | Value                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **Project**         | IRIS — Intelligent Resources Information System                                                    |
| **Customer**        | Samsung Electronics — Device Solutions Research (DSR)                                              |
| **Version**         | v1.0                                                                                               |
| **Date**            | 2026-03-21                                                                                         |
| **Author**          | CXO (Amoza Production Team)                                                                        |
| **Framework**       | AX Transformation Framework v2.0.0                                                                 |
| **Tech Stack**      | Mendix 10, Oracle 19c, Elasticsearch 8.x, xDHTML Gantt, ECharts.js, WebSocket, Samsung AI Services |
| **Backlog Size**    | 13 Epics, 74 User Stories, ~312 Story Points                                                       |
| **Primary Persona** | Jisoo Park — Senior Resource Planner, Hwaseong                                                     |
| **Server Timeline** | QA: April 2026 / Prod: July 2026                                                                   |

---

## 1. MoSCoW Classification

### 1.1 Classification Criteria

The MoSCoW classification answers the AX "Pilot Test" question for each epic:

> **"Would a Samsung DSR resource planner agree to evaluate IRIS with only these features?"**

Epics were evaluated against:

- Validated problem statements from D5 (5 problems, all scored GO, avg 85.2/100)
- Samsung requirements (Req 0-12) from input documentation
- Persona priority matrix (Jisoo PRIMARY, Minho SECONDARY)
- Server timeline hard constraints (QA April 2026, Prod July 2026)

### 1.2 Classification Summary

| Category            | Epics                   | Stories | Story Points | % Stories | % Effort | Rationale                                                                   |
| ------------------- | ----------------------- | ------- | ------------ | --------- | -------- | --------------------------------------------------------------------------- |
| **Must Have**       | E01, E03, E04, E11, E13 | 34      | ~148 SP      | 46%       | ~47%     | Foundation for new build; aligns with server timeline; solves #1 pain point |
| **Should Have**     | E02, E05, E07, E10      | 21      | ~92 SP       | 28%       | ~30%     | High-value features with strong stakeholder demand                          |
| **Could Have**      | E06, E08, E12           | 15      | ~60 SP       | 20%       | ~19%     | Important but can follow in v1.1                                            |
| **Won't Have (v1)** | E09                     | 4       | ~12 SP       | 5%        | ~4%      | Depends on Samsung AI Services readiness                                    |

### 1.3 Detailed Rationale

#### Must Have (~148 SP — Foundation for MVP)

| Epic    | Name                                    | Stories | SP  | Rationale                                                                                                                                                                                                                                                                                    |
| ------- | --------------------------------------- | ------- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **E01** | Master Data & Standard PM               | 7       | ~30 | Foundation of IRIS. Without master data (org structure, skill groups, production types, standard PM), no other module can function. Maps to F1, Req 0/5. Samsung's #1 prerequisite: "If the master data is wrong, everything downstream is wrong."                                           |
| **E03** | P/M Planner Concurrent Edit             | 9       | ~42 | Addresses the #1 validated pain point: multiple planners editing simultaneously causes data loss and version confusion in the current PM Planner. Concurrent saving with auto-merge, conflict detection, and diff view is the core reason Samsung commissioned IRIS. Maps to F1/F3, Req 0/3. |
| **E04** | Resource Roadmap & Versioning           | 7       | ~35 | Core planning workflow: create roadmaps, manage versions, diff between versions, confirm and sync. Without this, planners cannot do their primary job — resource allocation planning. Maps to F3, Req 1/2/4.                                                                                 |
| **E11** | Integration (N-PLM, PROMIS, SMDM, GHRP) | 6       | ~28 | IRIS does not exist in isolation. N-PLM sync (master data + project info), PROMIS sync (confirmed roadmaps), SMDM/GHRP sync (org data) are operational necessities. Delta sync (only changed projects) is a key Samsung requirement (Req 2). Maps to F1/F2, Req 2/5.                         |
| **E13** | Infrastructure & Server Setup           | 4       | ~13 | Hard external constraint: Samsung TA team configures QA servers April 2026, Prod servers July 2026. Infrastructure must be ready first — clustered Elasticsearch, Oracle 19c, Mendix deployment. Req 12. Blocks all development without it.                                                  |

#### Should Have (~92 SP — High-Value Enhancements)

| Epic    | Name                       | Stories | SP  | Rationale                                                                                                                                                                                                                                           |
| ------- | -------------------------- | ------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **E02** | Project/Product Management | 5       | ~20 | Important for project metadata (code, name, status, leader, timelines) and N-PLM sync of project info. However, MVP can function with manual project setup initially. Maps to F2, Req 5.                                                            |
| **E05** | Resource Simulation        | 6       | ~32 | High value for planners — multi-dimension analysis to find optimal roadmap by simulating capacity vs. demand. But planners can do basic planning with E04 roadmap alone; simulation is the "power user" capability. Maps to F3, Req 1/4.            |
| **E07** | World Map & Navigation     | 5       | ~22 | Samsung specifically requested the world map home screen (Req 7) with site-level resource statistics and drill-down navigation. Improves cross-site visibility but not required for core planning tasks. Maps to F4, Req 7/8.                       |
| **E10** | Factor Control             | 4       | ~18 | Applies dimensional filtering across analysis views. Important for slicing data by stage, block, function, activity, etc. However, basic filtering can be implemented within individual screens without the dedicated Factor Control module. Req 6. |

#### Could Have (~60 SP — v1.1 Candidates)

| Epic    | Name                 | Stories | SP  | Rationale                                                                                                                                                                                                  |
| ------- | -------------------- | ------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **E06** | HeadCount Portfolio  | 6       | ~26 | Staffing plan management and analysis view. Important for HR planners (Soyeon Choi persona) but serves a secondary persona — not needed for core resource planning workflow. Maps to F4, Req 9.            |
| **E08** | Analysis & Reporting | 7       | ~28 | Chart widgets, tables, resource utilization dashboards, actual vs. plan gap analysis. Valuable but planners can extract insights from the roadmap and simulation views initially. Maps to F5/F6, Req 8/10. |
| **E12** | Smart Notifications  | 4       | ~6  | Periodically auto-send analysis reports via email. Nice-to-have automation; planners can manually check reports in the early phase. Maps to F6, Req 10.                                                    |

#### Won't Have — v1 (~12 SP — Deferred to v2.0)

| Epic    | Name               | Stories | SP  | Rationale                                                                                                                                                                                                                                                     |
| ------- | ------------------ | ------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **E09** | AI-Based Reporting | 4       | ~12 | Create and download Excel PIVOT using Samsung AI Services. External dependency on Samsung AI Services platform readiness — timeline uncertain. AI model training requires production data that will not exist until IRIS has been in use. Maps to F7, Req 11. |

---

## 2. RICE Scoring

### 2.1 Scoring Parameters (IRIS Context)

| Parameter      | Definition                                                                                                          | Scale                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Reach**      | How many Samsung DSR users/roles are affected per quarter (~80 planners across Hwaseong, Pyeongtaek, Austin, Xi'an) | 1-10 (10 = all users)                                                                                     |
| **Impact**     | How much does it improve their experience?                                                                          | 3 = massive (transforms workflow), 2 = high (significant improvement), 1 = medium (noticeable), 0.5 = low |
| **Confidence** | How confident are we in the estimates?                                                                              | 1.0 = high (validated by interviews), 0.8 = medium (some evidence), 0.5 = low (assumption-based)          |
| **Effort**     | Story points as proxy for person-sprint effort                                                                      | Raw story points                                                                                          |
| **Score**      | (Reach x Impact x Confidence) / Effort                                                                              | Higher = prioritize first                                                                                 |

### 2.2 Epic-Level RICE Scoring

| Rank | Epic    | Name                          | Reach | Impact | Confidence | Effort (SP) | RICE Score | MoSCoW |
| ---- | ------- | ----------------------------- | ----- | ------ | ---------- | ----------- | ---------- | ------ |
| 1    | **E13** | Infrastructure & Server Setup | 10    | 3      | 1.0        | 13          | **2.31**   | Must   |
| 2    | **E03** | P/M Planner Concurrent Edit   | 10    | 3      | 1.0        | 42          | **0.71**   | Must   |
| 3    | **E01** | Master Data & Standard PM     | 10    | 3      | 1.0        | 30          | **1.00**   | Must   |
| 4    | **E10** | Factor Control                | 8     | 2      | 0.8        | 18          | **0.71**   | Should |
| 5    | **E04** | Resource Roadmap & Versioning | 10    | 3      | 0.9        | 35          | **0.77**   | Must   |
| 6    | **E02** | Project/Product Management    | 8     | 2      | 0.8        | 20          | **0.64**   | Should |
| 7    | **E07** | World Map & Navigation        | 8     | 2      | 0.8        | 22          | **0.58**   | Should |
| 8    | **E11** | Integration (N-PLM, PROMIS)   | 10    | 2      | 0.8        | 28          | **0.57**   | Must   |
| 9    | **E05** | Resource Simulation           | 6     | 3      | 0.7        | 32          | **0.39**   | Should |
| 10   | **E12** | Smart Notifications           | 6     | 1      | 0.8        | 6           | **0.80**   | Could  |
| 11   | **E08** | Analysis & Reporting          | 7     | 2      | 0.7        | 28          | **0.35**   | Could  |
| 12   | **E06** | HeadCount Portfolio           | 4     | 2      | 0.7        | 26          | **0.22**   | Could  |
| 13   | **E09** | AI-Based Reporting            | 3     | 2      | 0.5        | 12          | **0.25**   | Won't  |

### 2.3 Must-Have Story-Level RICE Scoring

Stories within Must-Have epics, ordered by RICE score for sprint planning priority.

#### E13 — Infrastructure & Server Setup

| Story   | Description                                                  | Reach | Impact | Conf | Effort | RICE      | Sprint |
| ------- | ------------------------------------------------------------ | ----- | ------ | ---- | ------ | --------- | ------ |
| E13-S01 | Configure QA server: Mendix 10, Oracle 19c, ES 8.x clustered | 10    | 3      | 1.0  | 5      | **6.00**  | S1     |
| E13-S02 | Set up CI/CD pipeline (Mendix build to QA deploy)            | 10    | 3      | 1.0  | 3      | **10.00** | S1     |
| E13-S03 | Configure development environment for all team members       | 10    | 2      | 1.0  | 2      | **10.00** | S1     |
| E13-S04 | Set up monitoring, logging, and SSO integration              | 10    | 2      | 0.8  | 3      | **5.33**  | S1     |

#### E01 — Master Data & Standard PM

| Story   | Description                                                   | Reach | Impact | Conf | Effort | RICE      | Sprint |
| ------- | ------------------------------------------------------------- | ----- | ------ | ---- | ------ | --------- | ------ |
| E01-S01 | Database schema for master data (Oracle 19c)                  | 10    | 3      | 1.0  | 3      | **10.00** | S1     |
| E01-S02 | Org structure CRUD: Production Line, Site, Team, Group        | 10    | 3      | 1.0  | 5      | **6.00**  | S1     |
| E01-S03 | Skills group structure CRUD: Stage, Block, Function, Activity | 10    | 3      | 1.0  | 5      | **6.00**  | S2     |
| E01-S04 | Production type management with standard PM data              | 10    | 3      | 0.9  | 5      | **5.40**  | S2     |
| E01-S05 | Revision tracking for all master data changes                 | 8     | 2      | 0.8  | 3      | **4.27**  | S2     |
| E01-S06 | Master data import/export (Excel upload for bulk setup)       | 8     | 2      | 0.8  | 5      | **2.56**  | S2     |
| E01-S07 | Master data validation rules and referential integrity checks | 10    | 2      | 0.9  | 4      | **4.50**  | S2     |

#### E03 — P/M Planner Concurrent Edit

| Story   | Description                                                     | Reach | Impact | Conf | Effort | RICE     | Sprint |
| ------- | --------------------------------------------------------------- | ----- | ------ | ---- | ------ | -------- | ------ |
| E03-S01 | P/M Planner grid UI with xDHTML (monthly allocation view)       | 10    | 3      | 1.0  | 5      | **6.00** | S3     |
| E03-S02 | WebSocket-based real-time collaboration layer                   | 10    | 3      | 0.8  | 8      | **3.00** | S3     |
| E03-S03 | Conflict detection engine (cell-level change tracking)          | 10    | 3      | 0.8  | 5      | **4.80** | S3     |
| E03-S04 | Auto-merge logic with manual override for true conflicts        | 10    | 3      | 0.8  | 5      | **4.80** | S3     |
| E03-S05 | Diff view: saving version vs. last confirmed version            | 10    | 2      | 0.9  | 3      | **6.00** | S3     |
| E03-S06 | Save-as-draft workflow with manager notification                | 8     | 2      | 1.0  | 3      | **5.33** | S3     |
| E03-S07 | Approval process: Draft to Confirmed with role-based gates      | 8     | 2      | 1.0  | 3      | **5.33** | S3     |
| E03-S08 | Real-time presence indicators (who is editing which cells)      | 8     | 1      | 0.9  | 2      | **3.60** | S3     |
| E03-S09 | Performance test: 5 concurrent editors, 500-cell grid, <2s sync | 10    | 2      | 0.8  | 8      | **2.00** | S3     |

#### E04 — Resource Roadmap & Versioning

| Story   | Description                                                  | Reach | Impact | Conf | Effort | RICE     | Sprint |
| ------- | ------------------------------------------------------------ | ----- | ------ | ---- | ------ | -------- | ------ |
| E04-S01 | Resource roadmap creation and project assignment             | 10    | 3      | 1.0  | 5      | **6.00** | S3     |
| E04-S02 | xDHTML Gantt for roadmap timeline visualization              | 10    | 3      | 0.9  | 5      | **5.40** | S3     |
| E04-S03 | Version management: create, label, lock versions             | 10    | 3      | 0.9  | 3      | **9.00** | S4     |
| E04-S04 | Diff view between any two roadmap versions                   | 10    | 2      | 0.9  | 5      | **3.60** | S4     |
| E04-S05 | Confirmation workflow: draft to review to confirmed          | 8     | 2      | 1.0  | 3      | **5.33** | S4     |
| E04-S06 | Concurrent roadmap editing (reuse E03 architecture)          | 10    | 3      | 0.8  | 8      | **3.00** | S4     |
| E04-S07 | Connect roadmap data to master data dimensions for filtering | 8     | 2      | 0.8  | 5      | **2.56** | S4     |

#### E11 — Integration (N-PLM, PROMIS, SMDM, GHRP)

| Story   | Description                                                       | Reach | Impact | Conf | Effort | RICE     | Sprint |
| ------- | ----------------------------------------------------------------- | ----- | ------ | ---- | ------ | -------- | ------ |
| E11-S01 | N-PLM connector: sync master data (org, skills, production types) | 10    | 3      | 0.8  | 5      | **4.80** | S1     |
| E11-S02 | SMDM/GHRP connector: sync organization hierarchy                  | 8     | 2      | 0.8  | 3      | **4.27** | S2     |
| E11-S03 | PROMIS connector: push confirmed roadmaps (delta sync only)       | 10    | 2      | 0.8  | 5      | **3.20** | S4     |
| E11-S04 | N-PLM bi-directional sync: push confirmed PM schedules            | 10    | 2      | 0.8  | 3      | **5.33** | S4     |
| E11-S05 | Delta detection engine: track changed projects for selective sync | 10    | 3      | 0.8  | 5      | **4.80** | S4     |
| E11-S06 | Integration monitoring dashboard and error retry mechanism        | 6     | 1      | 0.8  | 3      | **1.60** | S5     |

### 2.4 Top Should-Have Story-Level RICE Scoring

#### E02 — Project/Product Management (Top Stories)

| Story   | Description                                                    | Reach | Impact | Conf | Effort | RICE     | Sprint |
| ------- | -------------------------------------------------------------- | ----- | ------ | ---- | ------ | -------- | ------ |
| E02-S01 | Project/product list view with metadata fields                 | 8     | 2      | 0.8  | 3      | **4.27** | S5     |
| E02-S02 | Project status management (Open/In Progress/Drop/Hold)         | 8     | 2      | 0.8  | 3      | **4.27** | S5     |
| E02-S03 | Actual PM tracking per project (dept, activity, actual YYYYMM) | 8     | 2      | 0.8  | 5      | **2.56** | S5     |
| E02-S04 | N-PLM project sync (bi-directional)                            | 8     | 2      | 0.7  | 5      | **2.24** | S5     |
| E02-S05 | Project search and filter by type, status, product line        | 6     | 1      | 0.8  | 3      | **1.60** | S5     |

#### E05 — Resource Simulation (Top Stories)

| Story   | Description                                                      | Reach | Impact | Conf | Effort | RICE     | Sprint |
| ------- | ---------------------------------------------------------------- | ----- | ------ | ---- | ------ | -------- | ------ |
| E05-S01 | Simulation creation from roadmap (copy roadmap to simulation)    | 8     | 3      | 0.8  | 3      | **6.40** | S5     |
| E05-S02 | Multi-dimension analysis engine (ES aggregations)                | 6     | 3      | 0.7  | 8      | **1.58** | S5     |
| E05-S03 | Simulation comparison view: 2-3 scenarios side-by-side           | 6     | 3      | 0.7  | 5      | **2.52** | S5     |
| E05-S04 | Capacity vs. demand analysis by timeline and org dimension       | 8     | 2      | 0.7  | 5      | **2.24** | S6     |
| E05-S05 | Simulation result ranking by configurable criteria               | 6     | 2      | 0.7  | 3      | **2.80** | S6     |
| E05-S06 | "Apply simulation" action: promote simulation to roadmap version | 8     | 2      | 0.8  | 2      | **6.40** | S5     |

#### E07 — World Map & Navigation (Top Stories)

| Story   | Description                                                 | Reach | Impact | Conf | Effort | RICE     | Sprint |
| ------- | ----------------------------------------------------------- | ----- | ------ | ---- | ------ | -------- | ------ |
| E07-S01 | World map home screen with Samsung global site markers      | 8     | 2      | 0.8  | 5      | **2.56** | S5     |
| E07-S02 | Site-level resource statistics overlay on map               | 7     | 2      | 0.8  | 3      | **3.73** | S5     |
| E07-S03 | Drill-down navigation: Site to Division to Team to Resource | 8     | 2      | 0.8  | 5      | **2.56** | S6     |

### 2.5 Scoring Notes

1. **E13 scores highest per-point** because every single user is blocked without infrastructure, effort is relatively low (Samsung TA handles server provisioning), and confidence is 100% — this is a hard constraint.
2. **E03 and E01 are the highest-value Must-Haves** — both reach all users, have massive impact, and are fully validated by interviews. E03 addresses the #1 pain point (concurrent editing data loss); E01 is the data foundation.
3. **E10 (Factor Control) has good RICE efficiency** because effort is moderate while reach and impact are solid — it is a cross-cutting filter mechanism used across multiple views.
4. **E05-S06 ("Apply simulation")** scores disproportionately high — small effort, high reach. Schedule it alongside E05 core stories.
5. **E09 scores lowest** due to low reach (only analysts), low confidence (Samsung AI Services readiness unknown), and external dependency risk.

---

## 3. Impact/Effort Matrix

### 3.1 Matrix Plot

```
                        HIGH IMPACT
                            |
                            |
   Big Bets                 |        Quick Wins
   (Plan carefully)         |        (Do first)
                            |
   E03 (Concurrent Edit)    |        E13 (Infrastructure)
   E04 (Roadmap/Version)    |        E10 (Factor Control)
   E11 (Integration)        |        E02 (Project Mgmt)
   E05 (Simulation)         |
   E01 (Master Data)        |
                            |
HIGH EFFORT ————————————————+———————————————— LOW EFFORT
                            |
   Avoid                    |        Fill-Ins
   (Deprioritize)           |        (If time permits)
                            |
   E09 (AI Reporting)       |        E12 (Smart Notify)
                            |
   E06 (HC Portfolio)       |
   E08 (Analysis/Reporting) |
                            |
                        LOW IMPACT
```

### 3.2 Quadrant Assignments

| Quadrant                                    | Epics                   | Strategy                                                                                                                                                                                                                        |
| ------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Quick Wins** (High Impact, Low Effort)    | E13, E10, E02           | Do first. E13 is Sprint 1. E10 and E02 fit naturally into Sprint 5 after core is built.                                                                                                                                         |
| **Big Bets** (High Impact, High Effort)     | E03, E04, E11, E01, E05 | Plan carefully. These are the heart of IRIS — allocate Sprints 1-4 for Must Haves, Sprint 5 for E05. Break into smaller deliverables where possible.                                                                            |
| **Fill-Ins** (Low Impact, Low Effort)       | E12                     | Include if sprint capacity permits. Smart Notifications can be added incrementally — start with basic email triggers.                                                                                                           |
| **Avoid / Defer** (Low Impact, High Effort) | E09, E06, E08           | E09 deferred to v2.0. E06 and E08 are "Could Have" — schedule for Sprint 6+ after core stabilization. Note: E07 (World Map) sits between Quick Win and Big Bet — moderate effort, high impact. Treat as a priority Should Have. |

### 3.3 Key Observations

1. **No epics fall in true "Avoid" territory** — Samsung's requirements are well-scoped. E09 is the only deferral, driven by external dependency rather than low value.
2. **E01 is technically a Big Bet** (high effort) but must be treated as Sprint 1-2 infrastructure — everything depends on master data being in place.
3. **E07 (World Map)** is at the boundary between Quick Win and Big Bet. The xDHTML map widget provides a good head start, keeping effort moderate despite the visual complexity.
4. **CXO note**: All "Quick Win" epics still require UX review before development. Low effort does not mean low design attention — E10 Factor Control in particular needs careful interaction design to avoid cognitive overload.

---

## 4. MVP Scope Definition

### 4.1 MVP Statement

> **IRIS MVP = The smallest set of capabilities that allows a Samsung DSR resource planner to perform end-to-end resource planning with concurrent editing, version control, and system integration — replacing the broken PM Planner workflow.**

### 4.2 MVP Scope

| Component                           | Epic | Stories | SP       | Rationale                                                                       |
| ----------------------------------- | ---- | ------- | -------- | ------------------------------------------------------------------------------- |
| Infrastructure & CI/CD              | E13  | 4       | ~13      | Servers must exist before software can be deployed                              |
| Master Data & Standard PM           | E01  | 7       | ~30      | All planning depends on org structure, skill groups, and production types       |
| P/M Planner with Concurrent Editing | E03  | 9       | ~42      | Solves the #1 pain: multi-planner simultaneous editing with conflict resolution |
| Resource Roadmap & Versioning       | E04  | 7       | ~35      | Core planning artifact: create, version, compare, and confirm roadmaps          |
| Integration (N-PLM, PROMIS)         | E11  | 6       | ~28      | IRIS must exchange data with existing Samsung systems to be operational         |
| **TOTAL**                           |      | **34**  | **~148** |                                                                                 |

**MVP = 34 stories, ~148 story points, ~46% of total backlog**

### 4.3 CXO MVP Validation — Critical User Journeys

The MVP must satisfy two validation questions:

**Q1: Can a planner (Jisoo) complete a full planning cycle?**

```
1. LOGIN
   Jisoo logs into IRIS via Mendix SSO
       |
2. MASTER DATA
   View synced org structure, skill groups, production types from N-PLM/SMDM
       |
3. P/M PLANNER
   Open P/M plan for Memory Division Q2 2026
       |
       +-- 3a. CONCURRENT EDIT: Minho (Pyeongtaek) is also editing
       |
       +-- 3b. CONFLICT DETECT: System detects overlapping cell edits
       |
       +-- 3c. MERGE/RESOLVE: Jisoo sees diff, chooses to keep her value
       |
       +-- 3d. SAVE AS DRAFT: Draft version created, notification sent to manager
       |
4. ROADMAP
   Create resource roadmap for Flash Division Q2-Q4 2026
       |
       +-- 4a. ADD TASKS: Assign resources to project milestones (xDHTML Gantt)
       |
       +-- 4b. VERSION: Save as v2.1, compare diff with v2.0
       |
       +-- 4c. CONFIRM: Manager approves; confirmed version synced to PROMIS
       |
5. INTEGRATION
   Delta sync: only changed projects push to N-PLM and PROMIS
       |
6. DONE
   Jisoo has completed resource planning in IRIS without data loss
```

**Q2: Can a manager (Minho) review and approve?**

```
1. LOGIN
   Minho logs into IRIS via Mendix SSO
       |
2. NOTIFICATION
   See pending drafts from Jisoo requiring approval
       |
3. REVIEW
   Open P/M plan draft, view diff against last confirmed version
       |
       +-- 3a. COMPARE: Side-by-side changes highlighted
       |
       +-- 3b. COMMENT: Add notes on specific changes (inline)
       |
4. APPROVE/REJECT
   Approve draft → version becomes confirmed
   Reject draft → return to Jisoo with comments
       |
5. SYNC
   Confirmed version automatically triggers delta sync to PROMIS
       |
6. DONE
   Minho has reviewed and approved without email chains or Excel files
```

### 4.4 MVP Validation Criteria

| Criterion            | Measure                                                    | Target                                  |
| -------------------- | ---------------------------------------------------------- | --------------------------------------- |
| **Demo Coverage**    | MVP can be demonstrated end-to-end to Samsung stakeholders | < 45 minutes                            |
| **Primary Persona**  | Jisoo Park's entire daily planning workflow is supported   | 100% task completion                    |
| **Manager Persona**  | Minho Kim can review, compare, and approve plans           | 100% task completion                    |
| **Concurrent Edit**  | Two planners can edit simultaneously without data loss     | Zero data loss in 10 test sessions      |
| **Version Tracking** | Planners can create, compare, and confirm roadmap versions | Diff view loads in < 3 seconds          |
| **Integration**      | Delta sync sends only changed projects to PROMIS/N-PLM     | Correct delta detection in 95% of cases |
| **SUS Score**        | System Usability Scale from usability testing              | >= 68 (industry average)                |
| **Server Readiness** | QA environment operational for testing                     | By end of April 2026                    |

### 4.5 MVP Learning Goals (Hypothesis Validation)

| #   | Hypothesis                                                                          | Metric                               | Success Threshold                                     |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| H1  | Concurrent editing with auto-merge reduces planning conflicts by 80%                | Conflict count per planning session  | < 2 conflicts requiring manual resolution per session |
| H2  | Version diff view eliminates the need for side-by-side Excel comparison             | Time to compare two roadmap versions | < 60 seconds (vs. ~15 minutes currently)              |
| H3  | Delta sync reduces PROMIS update errors caused by full-sync overwrite               | Error rate in PROMIS after sync      | < 1% (vs. ~8% currently)                              |
| H4  | Planners can complete a full planning cycle in IRIS without reverting to PM Planner | PM Planner usage after IRIS pilot    | < 20% of prior usage within 4 weeks                   |
| H5  | Master data sync from N-PLM eliminates manual data entry for standard PM            | Manual data entry events per week    | < 5 (vs. ~30 currently)                               |

### 4.6 What is NOT in MVP

| #   | Excluded Capability           | Epic | Samsung Req | Why Excluded                                                                                                                                               | When Available  |
| --- | ----------------------------- | ---- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| 1   | Resource Simulation           | E05  | 1, 4        | Planners can create roadmaps and manually evaluate them without simulation. Simulation requires master data and roadmap infrastructure to be stable first. | v1.1 (Sprint 5) |
| 2   | Project/Product Management UI | E02  | 5           | Project metadata is synced from N-PLM. Dedicated management UI is a convenience, not a necessity for MVP planning workflow.                                | v1.1 (Sprint 5) |
| 3   | World Map Home Screen         | E07  | 7, 8        | Visual navigation enhancement. Planners can use standard menu navigation. The map improves discoverability but does not enable new workflows.              | v1.1 (Sprint 5) |
| 4   | Factor Control Module         | E10  | 6           | Cross-cutting filter mechanism. MVP screens will have basic in-view filtering. The dedicated Factor Control panel with presets comes in v1.1.              | v1.1 (Sprint 6) |
| 5   | HeadCount Portfolio           | E06  | 9           | Serves a secondary persona (HR Planner, Soyeon Choi). Core resource planning for the primary persona does not depend on HC portfolio management.           | v1.2 (Sprint 6) |
| 6   | Analysis & Reporting          | E08  | 8, 10       | Formal dashboards and reports. In MVP, planners get visual insights directly from the Gantt roadmap view and P/M grid.                                     | v1.2 (Sprint 6) |
| 7   | Smart Notifications           | E12  | 10          | Email automation for periodic reports. Manual report generation and review is acceptable for a pilot with 5-10 users.                                      | v1.2 (Sprint 6) |
| 8   | AI-Based Reporting            | E09  | 11          | Samsung AI Services platform readiness uncertain. AI model training requires production data. Highest risk, lowest confidence.                             | v2.0 (Phase 2)  |

---

## 5. Sprint Plan (6 Sprints, 2-Week Cadence)

### 5.1 Capacity Planning

| Parameter              | Value                                                               |
| ---------------------- | ------------------------------------------------------------------- |
| Team size              | 6 SWAT members (CEO, CPO, CXO, CAO, CDO, COO) with 4 developers     |
| Sprint duration        | 2 weeks                                                             |
| Focus factor           | 0.7 (accounts for meetings, code review, UX review, ad-hoc support) |
| Target velocity        | ~50-57 SP per sprint                                                |
| Total sprints          | 6                                                                   |
| Total planned capacity | ~312 SP across 6 sprints                                            |

### 5.2 Sprint 1: Infrastructure + Master Data Foundation (~50 SP)

**Dates**: April 1-14, 2026
**Focus**: E13 (Infrastructure) + E01 (Master Data — foundation stories)
**Goal**: QA environment ready, master data schema and core CRUD operational

| Story   | Description                                                       | SP  | Owner      | Epic | UX Review Needed    |
| ------- | ----------------------------------------------------------------- | --- | ---------- | ---- | ------------------- |
| E13-S01 | Configure QA server: Mendix 10, Oracle 19c, ES 8.x clustered      | 5   | CDO        | E13  | No                  |
| E13-S02 | Set up CI/CD pipeline (Mendix build to QA deploy)                 | 3   | CDO        | E13  | No                  |
| E13-S03 | Configure development environment for all team members            | 2   | CDO        | E13  | No                  |
| E13-S04 | Set up monitoring, logging, and SSO integration                   | 3   | CDO        | E13  | No                  |
| E01-S01 | Database schema for master data (Oracle 19c)                      | 3   | CDO        | E01  | No                  |
| E01-S02 | Org structure CRUD: Production Line, Site, Team, Group            | 5   | Mendix Dev | E01  | Yes — form layout   |
| E01-S03 | Skills group structure CRUD: Stage, Block, Function, Activity     | 5   | Mendix Dev | E01  | Yes — hierarchy nav |
| E01-S04 | Production type management with standard PM data                  | 5   | Mendix Dev | E01  | Yes — data grid     |
| E01-S05 | Revision tracking for all master data changes                     | 3   | CDO        | E01  | No                  |
| E01-S06 | Master data import/export (Excel upload for bulk setup)           | 5   | CDO        | E01  | Yes — upload flow   |
| E01-S07 | Master data validation rules and referential integrity            | 4   | CDO        | E01  | No                  |
| E11-S01 | N-PLM connector: sync master data (org, skills, production types) | 5   | CDO        | E11  | No                  |
| E11-S02 | SMDM/GHRP connector: sync organization hierarchy                  | 3   | CDO        | E11  | No                  |

**Sprint 1 Total**: ~51 SP
**Milestone**: All team members can develop and deploy to QA; master data populated and syncing from N-PLM

**Risks**:

- Samsung TA server provisioning delay — Mitigation: Start local dev environment, deploy to QA when servers ready
- Elasticsearch cluster configuration complexity — Mitigation: Follow Samsung's reference architecture from Req 12
- N-PLM API documentation incomplete — Mitigation: Engage Samsung integration team Week 1; build mock API

**CXO Sprint 1 Activities**:

- Design master data CRUD form layouts (E01-S02, S03, S04)
- Define Excel import/export flow (E01-S06)
- Begin wireframing P/M Planner grid for Sprint 2

---

### 5.3 Sprint 2: E01 Completion + E03 P/M Planner Start (~50 SP)

**Dates**: April 15-28, 2026
**Focus**: E03 (P/M Planner core) — the highest-complexity epic
**Goal**: P/M Planner grid operational with concurrent editing foundation

| Story   | Description                                                     | SP  | Owner      | Epic | UX Review Needed     |
| ------- | --------------------------------------------------------------- | --- | ---------- | ---- | -------------------- |
| E03-S01 | P/M Planner grid UI with xDHTML (monthly allocation view)       | 5   | Frontend   | E03  | Yes — grid design    |
| E03-S02 | WebSocket-based real-time collaboration layer                   | 8   | CDO        | E03  | No                   |
| E03-S03 | Conflict detection engine (cell-level change tracking)          | 5   | CDO        | E03  | No                   |
| E03-S04 | Auto-merge logic with manual override for true conflicts        | 5   | CDO        | E03  | Yes — conflict UX    |
| E03-S05 | Diff view: saving version vs. last confirmed version            | 3   | Frontend   | E03  | Yes — diff display   |
| E03-S06 | Save-as-draft workflow with manager notification                | 3   | Mendix Dev | E03  | Yes — workflow UX    |
| E03-S07 | Approval process: Draft to Confirmed with role-based gates      | 3   | Mendix Dev | E03  | Yes — approval flow  |
| E03-S08 | Real-time presence indicators (who is editing which cells)      | 2   | Frontend   | E03  | Yes — avatar display |
| E03-S09 | Performance test: 5 concurrent editors, 500-cell grid, <2s sync | 8   | CDO        | E03  | No                   |

**Sprint 2 Total**: ~42 SP (adjusted — highest complexity sprint, lower velocity expected)
**Milestone**: Two planners can edit the same P/M plan simultaneously without data loss

**Risks**:

- WebSocket latency across Samsung sites (Korea to US) — Mitigation: Test with simulated 200ms latency; implement operational transform
- Mendix 10 custom widget limitations — Mitigation: Build critical widgets as React pluggable widgets outside Mendix if needed

**CXO Sprint 2 Activities**:

- Validate P/M Planner grid layout with Samsung stakeholders
- Design conflict resolution modal (merge/override flow)
- Design presence indicator patterns (avatars, cell highlighting)
- Usability review of diff view — ensure color contrast meets accessibility standards

---

### 5.4 Sprint 3: E03 Concurrent Editing + E04 Roadmap (~50 SP)

**Dates**: April 29 — May 12, 2026
**Focus**: E04 (Roadmap & Versioning) + E03 polish
**Goal**: Resource roadmaps with Gantt visualization and version management operational

| Story   | Description                                                       | SP  | Owner      | Epic | UX Review Needed    |
| ------- | ----------------------------------------------------------------- | --- | ---------- | ---- | ------------------- |
| E04-S01 | Resource roadmap creation and project assignment                  | 5   | Mendix Dev | E04  | Yes — creation flow |
| E04-S02 | xDHTML Gantt for roadmap timeline visualization                   | 5   | Frontend   | E04  | Yes — Gantt layout  |
| E04-S03 | Version management: create, label, lock versions                  | 3   | CDO        | E04  | Yes — version UI    |
| E04-S04 | Diff view between any two roadmap versions                        | 5   | Frontend   | E04  | Yes — diff patterns |
| E04-S05 | Confirmation workflow: draft to review to confirmed               | 3   | Mendix Dev | E04  | Yes — workflow      |
| E04-S06 | Concurrent roadmap editing (reuse E03 architecture)               | 8   | CDO        | E04  | No                  |
| E04-S07 | Connect roadmap data to master data dimensions for filtering      | 5   | CDO        | E04  | No                  |
| E11-S03 | PROMIS connector: push confirmed roadmaps (delta sync only)       | 5   | CDO        | E11  | No                  |
| E11-S04 | N-PLM bi-directional sync: push confirmed PM schedules            | 3   | CDO        | E11  | No                  |
| E11-S05 | Delta detection engine: track changed projects for selective sync | 5   | CDO        | E11  | No                  |

**Sprint 3 Total**: ~47 SP
**Milestone**: Planners can create versioned roadmaps and sync confirmed plans to PROMIS/N-PLM

**Risks**:

- PROMIS API availability (Samsung-managed) — Mitigation: Build adapter pattern; test with mock PROMIS endpoint
- xDHTML Gantt performance with 200+ tasks — Mitigation: Virtual scrolling; lazy-load project tasks

**CXO Sprint 3 Activities**:

- Design Gantt chart interaction patterns (zoom, drag, resize)
- Design version comparison UI (side-by-side vs. inline diff)
- Design roadmap creation wizard flow
- Prepare MVP demo walkthrough for Samsung stakeholders

---

### 5.5 Sprint 4: E04 Versioning + E11 Integration Start (~50 SP)

**Dates**: May 13-26, 2026
**Focus**: MVP stabilization + E11 remaining + begin Should-Have epics
**Goal**: **MVP COMPLETE** — full end-to-end planning cycle operational

| Story      | Description                                                      | SP  | Owner      | Epic | UX Review Needed     |
| ---------- | ---------------------------------------------------------------- | --- | ---------- | ---- | -------------------- |
| E11-S06    | Integration monitoring dashboard and error retry mechanism       | 3   | CDO        | E11  | Yes — dashboard      |
| MVP-FIX-01 | MVP bug fixes and UX polish (buffer)                             | 8   | All        | MVP  | Yes                  |
| MVP-FIX-02 | Performance optimization and load testing                        | 5   | CDO        | MVP  | No                   |
| MVP-FIX-03 | MVP end-to-end integration testing                               | 5   | CDO        | MVP  | No                   |
| E02-S01    | Project/product list view with metadata fields                   | 3   | Mendix Dev | E02  | Yes — list design    |
| E02-S02    | Project status management (Open/In Progress/Drop/Hold)           | 3   | Mendix Dev | E02  | Yes — status UX      |
| E02-S03    | Actual PM tracking per project (dept, activity, actual YYYYMM)   | 5   | Mendix Dev | E02  | Yes — tracking UI    |
| E02-S04    | N-PLM project sync (bi-directional)                              | 5   | CDO        | E02  | No                   |
| E02-S05    | Project search and filter by type, status, product line          | 3   | Frontend   | E02  | Yes — search UX      |
| E05-S01    | Simulation creation from roadmap (copy roadmap to simulation)    | 3   | CDO        | E05  | Yes — flow design    |
| E05-S06    | "Apply simulation" action: promote simulation to roadmap version | 2   | CDO        | E05  | Yes — action confirm |

**Sprint 4 Total**: ~45 SP (reduced — MVP stabilization absorbs capacity)
**Milestone**: MVP deployed to QA; project management and simulation start operational

**Risks**:

- MVP stabilization may consume more capacity than budgeted — Mitigation: Should-Have stories are stretch goals; can shift to Sprint 5
- Samsung scope change requests during demo — Mitigation: MoSCoW classification provides clear boundaries

**CXO Sprint 4 Activities**:

- Conduct internal MVP walkthrough with full team
- Collect UX issues from integration testing
- Design project management list/detail views
- Design simulation creation flow

---

### 5.6 Sprint 5: E02/E05/E07 Should-Haves (~55 SP)

**Dates**: May 27 — June 9, 2026
**Focus**: E05 (Simulation), E07 (World Map), remaining Should-Have stories
**Goal**: Simulation, world map, and project management operational

| Story   | Description                                                              | SP  | Owner      | Epic | UX Review Needed     |
| ------- | ------------------------------------------------------------------------ | --- | ---------- | ---- | -------------------- |
| E05-S02 | Multi-dimension analysis engine (ES aggregations)                        | 8   | CDO        | E05  | No                   |
| E05-S03 | Simulation comparison view: 2-3 scenarios side-by-side                   | 5   | Frontend   | E05  | Yes — comparison     |
| E05-S04 | Capacity vs. demand analysis by timeline and org dimension               | 5   | Frontend   | E05  | Yes — chart design   |
| E05-S05 | Simulation result ranking by configurable criteria                       | 3   | CDO        | E05  | Yes — ranking UX     |
| E07-S01 | World map home screen with Samsung global site markers                   | 5   | Frontend   | E07  | Yes — map design     |
| E07-S02 | Site-level resource statistics overlay on map                            | 3   | Frontend   | E07  | Yes — overlay design |
| E07-S03 | Drill-down navigation: Site to Division to Team to Resource              | 5   | Mendix Dev | E07  | Yes — nav patterns   |
| E07-S04 | Role-based navigation: display relevant sites/projects per user          | 5   | CDO        | E07  | Yes — role filtering |
| E07-S05 | Personal view: "My Sites" and "My Projects" dashboard                    | 3   | Mendix Dev | E07  | Yes — dashboard      |
| E10-S01 | Factor Control panel: dimension selector (Stage/Block/Function/Activity) | 5   | Frontend   | E10  | Yes — filter panel   |
| E10-S02 | Integrate Factor Control with P/M Planner view                           | 3   | Frontend   | E10  | Yes — integration    |

**Sprint 5 Total**: ~50 SP
**Milestone**: Samsung executives see the world map home screen; planners can simulate scenarios

**Risks**:

- World map rendering performance with real-time data — Mitigation: Cache site-level aggregates; refresh every 5 minutes
- Prod server readiness (July target) — Mitigation: Continue on QA; plan prod migration as Sprint 6 parallel task

**CXO Sprint 5 Activities**:

- Design world map home screen layout and interaction
- Design simulation comparison view (scenario cards, charts)
- Design Factor Control panel — avoid cognitive overload with progressive disclosure
- Prepare v1.1 demo for Samsung stakeholders

---

### 5.7 Sprint 6: E10 Factor Control + Stabilization + UAT (~57 SP)

**Dates**: June 10-23, 2026
**Focus**: E10 completion, E06/E08/E12 Could-Have stories, stabilization, UAT prep
**Goal**: Full feature set (excluding AI) ready for UAT and production deployment

| Story   | Description                                                     | SP  | Owner      | Epic | UX Review Needed    |
| ------- | --------------------------------------------------------------- | --- | ---------- | ---- | ------------------- |
| E10-S03 | Integrate Factor Control with Roadmap and Simulation views      | 3   | Frontend   | E10  | Yes — integration   |
| E10-S04 | Factor Control presets: save and share filter configurations    | 3   | Frontend   | E10  | Yes — preset UX     |
| E06-S01 | Staffing plan management UI                                     | 5   | Mendix Dev | E06  | Yes — form design   |
| E06-S02 | HC analysis view by site, division, and role                    | 3   | Frontend   | E06  | Yes — chart design  |
| E06-S03 | Resource gap identification and hiring request workflow         | 5   | Mendix Dev | E06  | Yes — workflow      |
| E06-S04 | HC portfolio global summary (linked to world map)               | 3   | Frontend   | E06  | Yes — summary card  |
| E06-S05 | HC forecast: project PM requirements vs. available HC           | 5   | CDO        | E06  | Yes — forecast viz  |
| E06-S06 | HC reporting: monthly staffing status by division               | 2   | Frontend   | E06  | Yes — report layout |
| E08-S01 | Analysis view framework: ECharts.js integration with data layer | 3   | Frontend   | E08  | Yes — chart library |
| E08-S02 | Resource utilization dashboard: actual vs. plan by division     | 3   | Frontend   | E08  | Yes — dashboard     |
| E08-S03 | Actual vs. plan gap analysis report with drill-down             | 5   | Frontend   | E08  | Yes — drill-down    |
| E08-S04 | Resource roadmap confirmed status report                        | 3   | Frontend   | E08  | Yes — report        |
| E08-S05 | Resource utilization report with export (Excel/PDF)             | 3   | Frontend   | E08  | Yes — export flow   |
| E08-S06 | Resource issues and action recommendation dashboard             | 3   | Frontend   | E08  | Yes — dashboard     |
| E08-S07 | Custom report builder: select dimensions, metrics, chart type   | 5   | Frontend   | E08  | Yes — builder UX    |
| E12-S01 | Notification configuration: report type, frequency, recipients  | 2   | Mendix Dev | E12  | Yes — config UI     |
| E12-S02 | Scheduled email engine for periodic report delivery             | 2   | CDO        | E12  | No                  |
| E12-S03 | Notification templates with report embedding                    | 1   | Frontend   | E12  | Yes — template      |
| E12-S04 | Notification history and delivery tracking                      | 1   | CDO        | E12  | No                  |

**Sprint 6 Total**: ~60 SP (stretch — may extend into Sprint 7)
**Milestone**: Complete all Could Have features; stabilize for Prod deployment (July 2026)

**Risks**:

- Sprint 6 is overloaded — Could-Have stories may slip to Sprint 7 — Mitigation: Prioritize E06 and E08 core stories; defer E08-S07 (custom report builder) and E12 if needed
- Prod server migration during development — Mitigation: Parallel workstream; CDO handles migration while team continues features

**CXO Sprint 6 Activities**:

- Design HC portfolio views for Soyeon (HR) persona
- Design ECharts dashboard layouts with consistent design system
- Design notification templates — Samsung brand alignment
- Conduct UAT preparation and test script creation
- Final SUS score evaluation with Samsung planners

---

### 5.8 Sprint Summary

| Sprint       | Dates (2026)    | Epics                               | Story Points | Cumulative | Milestone                                     |
| ------------ | --------------- | ----------------------------------- | ------------ | ---------- | --------------------------------------------- |
| **Sprint 1** | Apr 1-14        | E13, E01, E11 (partial)             | ~51          | 51         | QA environment + master data foundation       |
| **Sprint 2** | Apr 15-28       | E03                                 | ~42          | 93         | Concurrent editing operational                |
| **Sprint 3** | Apr 29 — May 12 | E04, E11 (remaining)                | ~47          | 140        | Roadmap + versioning + integration            |
| **Sprint 4** | May 13-26       | MVP stabilization, E02, E05 (start) | ~45          | 185        | **MVP COMPLETE** on QA                        |
| **Sprint 5** | May 27 — Jun 9  | E05, E07, E10 (start)               | ~50          | 235        | Simulation + world map + factor control       |
| **Sprint 6** | Jun 10-23       | E10, E06, E08, E12                  | ~57          | 292        | Full feature set (excl. AI); Prod deploy prep |

**Total planned**: ~292 SP across 6 sprints (remaining ~20 SP buffer for defects and UAT fixes)

---

## 6. CXO UX Prioritization Notes

### 6.1 Stories Requiring UX Validation Before Development

These stories have significant user-facing interaction design. CXO must review and approve wireframes/mockups before development begins.

| Priority     | Story   | UX Concern                                                                        | Validation Method                 | Sprint |
| ------------ | ------- | --------------------------------------------------------------------------------- | --------------------------------- | ------ |
| **Critical** | E03-S01 | P/M Planner grid layout — 500+ cells, monthly allocation, multi-dimension headers | Prototype + 3 user tests          | S2     |
| **Critical** | E03-S04 | Conflict resolution modal — merge/override decision under time pressure           | Prototype + cognitive walkthrough | S2     |
| **Critical** | E04-S02 | Gantt chart interaction — zoom, drag, resize with 200+ tasks                      | Prototype + performance review    | S3     |
| **Critical** | E04-S04 | Version diff view — inline vs. side-by-side, color coding for changes             | Mockup + stakeholder review       | S3     |
| **High**     | E07-S01 | World map home screen — site markers, data density, drill-down entry points       | Mockup + Samsung review           | S5     |
| **High**     | E10-S01 | Factor Control panel — progressive disclosure, filter combinations                | Prototype + cognitive walkthrough | S5     |
| **High**     | E05-S03 | Simulation comparison — scenario cards, chart overlays, ranking display           | Mockup + user review              | S5     |
| **Medium**   | E06-S01 | Staffing plan form — complex data entry for HR persona                            | Mockup + Soyeon review            | S6     |
| **Medium**   | E08-S07 | Custom report builder — dimension/metric selection, chart type picker             | Prototype + usability test        | S6     |

### 6.2 UI Polish Stories Per Sprint

Each sprint should allocate 10-15% capacity for UX polish based on testing feedback.

| Sprint | Polish Focus                                                                  | Estimated Effort     |
| ------ | ----------------------------------------------------------------------------- | -------------------- |
| S1     | Master data form consistency, navigation structure, design tokens setup       | 5 SP                 |
| S2     | P/M grid readability, cell sizing, color system for conflict states           | 5 SP                 |
| S3     | Gantt visual polish, version label styling, diff view accessibility           | 5 SP                 |
| S4     | MVP end-to-end flow smoothness, transition animations, error states           | 5 SP (in MVP-FIX-01) |
| S5     | World map visual quality, simulation chart styling, Factor Control layout     | 5 SP                 |
| S6     | Dashboard consistency, report export formatting, notification template design | 5 SP                 |

### 6.3 Design System Stories

| Story | Description                                                                                        | Sprint | Rationale                                                                  |
| ----- | -------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------- |
| DS-01 | Establish IRIS design tokens: colors, typography, spacing, elevation (Samsung DSR brand alignment) | S1     | Must be done before any UI development                                     |
| DS-02 | Navigation component: sidebar menu, breadcrumbs, role-based menu items                             | S1     | All screens depend on consistent navigation                                |
| DS-03 | Data grid component: standardize xDHTML grid styling, column types, sorting, filtering             | S2     | E03 and E04 both use data grids extensively                                |
| DS-04 | Factor Control component: reusable dimension filter panel                                          | S5     | E10 Factor Control must be consistent across all views                     |
| DS-05 | Chart component library: standardize ECharts themes, responsive breakpoints                        | S5     | E05, E07, E08 all use charts — must be consistent                          |
| DS-06 | Responsive layout rules: minimum viewport 1280px, grid system for dashboards                       | S1     | Samsung DSR uses desktop workstations; define minimum supported resolution |

### 6.4 UX Risks If Should-Have Items Are Deferred

| Deferred Item                                   | UX Risk                                                                                                                     | Severity | Mitigation                                                                                               |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| **E07 World Map** (deferred past Sprint 5)      | Users land on a generic menu instead of the visual home Samsung specifically requested. First impression suffers.           | High     | Ensure basic landing page with site selector as interim UX.                                              |
| **E10 Factor Control** (deferred past Sprint 5) | Users must filter within individual screens using different filter UIs — inconsistent experience, increased learning curve. | Medium   | Implement basic in-view filters with consistent styling in MVP screens.                                  |
| **E05 Simulation** (deferred past Sprint 5)     | Planners must manually compare roadmap versions to find optimal allocation — tedious and error-prone.                       | Medium   | Version diff view (E04-S04) partially mitigates by enabling comparison, just not automated optimization. |
| **E02 Project Mgmt** (deferred past Sprint 5)   | No dedicated UI for project metadata — planners must rely on N-PLM sync without ability to edit project details in IRIS.    | Low      | N-PLM sync covers most project data needs. Add a read-only project info panel in MVP if capacity allows. |
| **E06 HC Portfolio** (deferred past Sprint 6)   | Soyeon (HR persona) has no workflows in IRIS. She continues using existing HR tools.                                        | Low      | Soyeon is a secondary persona. Communicate clear timeline for her features.                              |
| **E08 Analysis** (deferred past Sprint 6)       | No formal dashboards — managers and analysts rely on raw data from P/M grids and Gantt views.                               | Medium   | Ensure P/M grid and Gantt views have built-in summary rows/totals for basic analysis.                    |

---

## 7. Release Plan

### 7.1 Release Timeline

```
April 2026             May 2026              June 2026              July 2026
|--- Sprint 1 ---|--- Sprint 2 ---|--- Sprint 3 ---|--- Sprint 4 ---|--- Sprint 5 ---|--- Sprint 6 ---|
    E13,E01,E11       E03              E04,E11          E02,E05(start)  E05,E07,E10      E06,E08,E12
    [INFRA+DATA]      [CONCURRENT]     [ROADMAP+SYNC]   [MVP STABLE]    [SIMULATE+MAP]   [PORTFOLIO]
                                                             |                                |
                                                       MVP v1.0                         v1.1 + v1.2
                                                     QA Deploy                         Prod Deploy
```

### 7.2 Release Definitions

#### MVP v1.0 — "Plan Without Fear" (End of Sprint 4, ~May 26, 2026)

| Attribute             | Detail                                                                                                                                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**             | E01 + E03 + E04 + E11 + E13 (34 stories, ~148 SP) + stabilization                                                                                                                                                                                     |
| **Value Proposition** | Samsung DSR planners can perform concurrent resource planning with version control and system integration — eliminating the #1 pain of data loss from simultaneous edits                                                                              |
| **Environment**       | QA Server                                                                                                                                                                                                                                             |
| **Users**             | 5-10 pilot planners (Hwaseong + Pyeongtaek)                                                                                                                                                                                                           |
| **Success Criteria**  | Zero data loss in concurrent editing; delta sync operational; SUS >= 68; demo < 45 min                                                                                                                                                                |
| **Key Capabilities**  | Master data CRUD + N-PLM sync; P/M Planner with real-time concurrent editing, conflict detection, auto-merge, diff view, draft/approval workflow; Resource Roadmap with versioning and Gantt visualization; PROMIS delta sync (changed projects only) |

#### v1.1 — "See the Full Picture" (End of Sprint 5, ~June 9, 2026)

| Attribute             | Detail                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Scope**             | MVP + E02 + E05 + E07 + E10 (55 stories, ~240 SP cumulative)                                                                                                 |
| **Value Proposition** | Beyond planning — simulate, filter, and navigate the global resource landscape                                                                               |
| **Environment**       | QA Server (Prod migration in progress)                                                                                                                       |
| **Users**             | 20-30 planners + managers across sites                                                                                                                       |
| **Key Additions**     | Resource simulation with multi-scenario comparison; Project/product management UI; World map home with site drill-down; Factor Control dimensional filtering |

#### v1.2 — "Operate & Report" (End of Sprint 6, ~June 23, 2026)

| Attribute             | Detail                                                                                                                                                                |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scope**             | v1.1 + E06 + E08 + E12 (74 stories, ~312 SP cumulative — full scope minus AI)                                                                                         |
| **Value Proposition** | Complete operational platform with portfolio management, analysis, and automated reporting                                                                            |
| **Environment**       | Production Server (July 2026 target)                                                                                                                                  |
| **Users**             | All Samsung DSR resource planning users (~80)                                                                                                                         |
| **Key Additions**     | HeadCount portfolio with staffing plan and gap analysis; Full analysis and reporting suite with ECharts dashboards; Smart notifications with scheduled email delivery |

#### v2.0 — "AI-Powered Insights" (Phase 2, TBD)

| Attribute             | Detail                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Scope**             | v1.2 + E09 (78 stories total)                                                                                  |
| **Value Proposition** | AI-generated reports and recommendations powered by Samsung AI Services                                        |
| **Dependencies**      | Samsung AI Services platform readiness; 3+ months of IRIS production data for model training                   |
| **Key Additions**     | AI-based Excel PIVOT generation; Intelligent resource allocation recommendations; Predictive capacity analysis |

---

## 8. Sprint Risk Summary

| #   | Risk                                                     | Prob | Impact | Sprint(s) | Mitigation                                                                       |
| --- | -------------------------------------------------------- | ---- | ------ | --------- | -------------------------------------------------------------------------------- |
| R1  | Samsung TA delays server provisioning beyond April       | M    | H      | S1        | Start with local dev; containerized deployment ready for quick migration         |
| R2  | N-PLM API documentation incomplete or changes            | H    | H      | S1, S3    | Engage Samsung integration team early; build adapter pattern with mock endpoints |
| R3  | WebSocket concurrent editing performance across sites    | M    | H      | S2        | Operational transform algorithm; test with 200ms latency simulation              |
| R4  | Mendix 10 custom widget limitations for Gantt/grid       | M    | M      | S2, S3    | React pluggable widgets as fallback; pre-validate xDHTML in Mendix 10            |
| R5  | PROMIS API access restricted or format changes           | M    | H      | S3        | Build against documented API spec; adapter pattern for format changes            |
| R6  | Elasticsearch cluster sizing insufficient for simulation | L    | M      | S5        | Monitor in S1; scale up before S5                                                |
| R7  | Samsung scope changes during development                 | H    | M      | All       | MoSCoW classification provides clear boundaries; new requests evaluated via RICE |
| R8  | Samsung AI Services not ready for v2.0 timeline          | H    | L      | Post-S6   | AI is Won't Have for v1.x; no impact on core delivery                            |
| R9  | Sprint 6 overloaded — Could-Have stories slip            | M    | M      | S6        | Strict prioritization within Sprint 6; E08-S07 and E12 are first to defer        |
| R10 | UX validation delays blocking development                | M    | H      | S2, S3    | CXO prepares wireframes 1 sprint ahead; parallel design-dev track                |

---

## 9. Traceability Matrix

| Epic | Feature Area | Samsung Req | MoSCoW | Release  | Sprint | RICE Rank | Stories | SP  |
| ---- | ------------ | ----------- | ------ | -------- | ------ | --------- | ------- | --- |
| E01  | F1           | 0, 5        | Must   | MVP v1.0 | S1-S2  | 3         | 7       | ~30 |
| E02  | F2           | 5           | Should | v1.1     | S4-S5  | 6         | 5       | ~20 |
| E03  | F1, F3       | 0, 3        | Must   | MVP v1.0 | S2     | 2         | 9       | ~42 |
| E04  | F3           | 1, 2, 4     | Must   | MVP v1.0 | S3     | 5         | 7       | ~35 |
| E05  | F3           | 1, 4        | Should | v1.1     | S4-S5  | 9         | 6       | ~32 |
| E06  | F4           | 9           | Could  | v1.2     | S6     | 12        | 6       | ~26 |
| E07  | F4           | 7, 8        | Should | v1.1     | S5     | 7         | 5       | ~22 |
| E08  | F5, F6       | 8, 10       | Could  | v1.2     | S6     | 11        | 7       | ~28 |
| E09  | F7           | 11          | Won't  | v2.0     | TBD    | 13        | 4       | ~12 |
| E10  | —            | 6           | Should | v1.1     | S5-S6  | 4         | 4       | ~18 |
| E11  | F1, F2       | 2, 5        | Must   | MVP v1.0 | S1, S3 | 8         | 6       | ~28 |
| E12  | F6           | 10          | Could  | v1.2     | S6     | 10        | 4       | ~6  |
| E13  | —            | 12          | Must   | MVP v1.0 | S1     | 1         | 4       | ~13 |

---

## 10. Decision Log

| #   | Decision                                                        | Alternatives Considered                          | Rationale                                                                                                                                                                             | Date       | Decided By       |
| --- | --------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| D1  | MVP = E01+E03+E04+E11+E13 (34 stories, ~148 SP)                 | Include E05 (Simulation) in MVP                  | Simulation adds 6 stories and significant complexity. Planners validated that roadmap + versioning alone solves their #1 pain. Simulation is high-value but not MVP-critical.         | 2026-03-21 | CPO + CXO        |
| D2  | E09 (AI) is Won't Have for v1.x                                 | Include AI basic reporting in v1.2               | Samsung AI Services timeline uncertain. Building against an unstable dependency would risk the entire release. Defer until platform is proven.                                        | 2026-03-21 | CPO + CXO        |
| D3  | Sprint 1 starts April 1 aligned with Samsung QA server timeline | Start development in March on local environments | Aligning with Samsung server timeline ensures no wasted effort on local-only environments.                                                                                            | 2026-03-21 | CPO + Samsung TA |
| D4  | 2-week sprint cadence                                           | 1-week or 3-week sprints                         | 2-week sprints balance delivery cadence with the complexity of IRIS features (concurrent editing, integration). 1-week sprints create too much ceremony overhead for a 4-person team. | 2026-03-21 | CPO              |
| D5  | Concurrent editing via WebSocket + operational transform        | Pessimistic locking; last-write-wins             | Samsung's #1 requirement is simultaneous editing. Locking defeats the purpose. Last-write-wins causes data loss (the existing pain).                                                  | 2026-03-21 | CPO + CDO        |
| D6  | CXO designs 1 sprint ahead of development                       | Design and dev in same sprint                    | Parallel design-dev track reduces risk of UX validation blocking development. CXO wireframes Sprint N+1 stories during Sprint N.                                                      | 2026-03-21 | CXO              |
| D7  | 6-sprint plan covers all 312 SP including buffer                | 8-sprint plan with lower velocity                | Samsung's server timeline (QA April, Prod July) constrains to ~12 weeks. Higher velocity is achievable with AI-assisted development (AX Principle 8: 70%+ target).                    | 2026-03-21 | CPO + CDO        |

---

## Cross-References

### Templates Used

| Code | Template                                         | Usage                                   |
| ---- | ------------------------------------------------ | --------------------------------------- |
| T21  | `.ax/templates/T21_SPRINT_PLANNING_CHECKLIST.md` | Sprint allocation structure (Section 5) |

### Related AX Guides

| Code | Guide                                         | Relationship                                                |
| ---- | --------------------------------------------- | ----------------------------------------------------------- |
| S4   | `guides/design/S4_USER_STORIES_GUIDE.md`      | User stories are the input to this prioritization           |
| S5   | `guides/design/S5_PRIORITIZATION_GUIDE.md`    | Methodology for MoSCoW, RICE, Impact/Effort, MVP definition |
| S6   | `guides/design/S6_USABILITY_TESTING_GUIDE.md` | Usability findings may adjust priorities                    |
| S7   | `guides/design/S7_GATE_2_REVIEW_GUIDE.md`     | This prioritization is a Gate 2 required artifact           |

### Related IRIS Documents

| Document                                  | Relationship                                 |
| ----------------------------------------- | -------------------------------------------- |
| `02_DESIGN/s4-user-stories.md`            | Story backlog that was prioritized here      |
| `01_DISCOVER/d5a-problem-statements.md`   | Validated problems that drive MVP definition |
| `01_DISCOVER/d7a-assumptions-register.md` | Assumptions that inform confidence scores    |
| `01_DISCOVER/d4-personas.md`              | Persona priority matrix (Jisoo PRIMARY)      |

### Navigation

| Direction          | Document                                                    |
| ------------------ | ----------------------------------------------------------- |
| **Previous**       | `02_DESIGN/s4-user-stories.md` — S4: User Stories           |
| **Next**           | `02_DESIGN/s6-usability-testing.md` — S6: Usability Testing |
| **Phase overview** | `.ax/guides/quick-reference/QR3_DESIGN_CHECKLIST.md`        |

---

_Part of IRIS DESIGN Phase — CXO, March 2026_
_AX Transformation Framework v2.0.0_
