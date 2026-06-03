# A5 — Production Backlog

> **IRIS** (Intelligent Resources Information System)
> **Version**: 1.0.0
> **Date**: 2026-03-22
> **Author**: CXO (UX & Business Analysis)
> **AX Phase**: DEVELOP — Analysis Handoff
> **Status**: Complete
> **Gate 1**: GO (4.90/5.00) | **Gate 2**: GO (4.70/5.00)

---

## Document Purpose

This document is the **final handoff from Analysis to Development**. It contains the complete, prioritized, task-decomposed, sprint-allocated production backlog for IRIS. The Development Team starts Sprint 1 based on this document. Every story is traced to its epic, feature area, Samsung requirement, problem statement, business rule, process, data entity, and module.

**Tech Stack**: Mendix 10 + Oracle 19c + Elasticsearch 8.x + xDHTML Gantt + ECharts.js + WebSocket
**Sites**: Hwaseong (HQ), Pyeongtaek, Austin (TX), Xi'an (China), Giheung
**Team**: 4 developers (2 Mendix, 1 Backend/Integration, 1 Frontend/Widgets) + CXO + CPO

---

## 1. Prioritized Story Registry

All 74 stories in priority order. Priority tiers follow MoSCoW from S5 Prioritization. Sprint assignment follows the 6-sprint plan (Sprint 0-5 + Sprint 6+).

### 1.1 Must-Have Stories (MVP v1.0) — 33 Stories

| #   | Story ID     | Epic | Title                                             | SP  | Sprint | Dependencies              | Module(s)     | Status |
| --- | ------------ | ---- | ------------------------------------------------- | --- | ------ | ------------------------- | ------------- | ------ |
| 1   | IRIS-E13-001 | E13  | Set Up QA Environment                             | 5   | S0     | Samsung IT approval       | M33           | Ready  |
| 2   | IRIS-E13-002 | E13  | Set Up Production Environment                     | 8   | S0     | E13-001                   | M33           | Ready  |
| 3   | IRIS-E13-003 | E13  | Configure Elasticsearch Cluster                   | 3   | S0     | E13-001                   | M33           | Ready  |
| 4   | IRIS-E13-004 | E13  | Set Up Monitoring and Alerting                    | 2   | S0     | E13-001, E13-002, E13-003 | M33           | Ready  |
| 5   | IRIS-E01-001 | E01  | Manage Organization Hierarchy                     | 5   | S1     | E13-001, E11-002          | M01, M02      | Ready  |
| 6   | IRIS-E01-002 | E01  | Manage Standard PM Templates                      | 8   | S1     | E01-001                   | M01, M04      | Ready  |
| 7   | IRIS-E01-003 | E01  | View Revision History for Standard PMs            | 5   | S1     | E01-002                   | M01, M03      | Ready  |
| 8   | IRIS-E01-004 | E01  | CRUD Production Types with Standard Milestones    | 5   | S1     | E01-001                   | M01, M02      | Ready  |
| 9   | IRIS-E01-006 | E01  | Sync Master Data from N-PLM/SMDM/GHRP             | 5   | S1     | E11-002, E11-004, E13-001 | M01, M31      | Ready  |
| 10  | IRIS-E11-002 | E11  | Receive Master Data Updates from N-PLM and SMDM   | 5   | S1     | E13-001, E01-006          | M31           | Ready  |
| 11  | IRIS-E11-003 | E11  | Push Project Updates to N-PLM                     | 5   | S1     | E02-003, E04-004          | M31           | Ready  |
| 12  | IRIS-E03-001 | E03  | Open P/M Plan and See Active Editors              | 5   | S2     | E13-001, E13-003          | M06, M07      | Ready  |
| 13  | IRIS-E03-002 | E03  | Edit Allocation Cells with Real-time Sync         | 8   | S2     | E03-001                   | M06, M07, W01 | Ready  |
| 14  | IRIS-E03-003 | E03  | Detect and Resolve Cell Conflicts                 | 8   | S2     | E03-002                   | M06, M07      | Ready  |
| 15  | IRIS-E03-004 | E03  | Save P/M Plan as Draft or Permanent Version       | 5   | S2     | E03-002, E03-003          | M06, M03      | Ready  |
| 16  | IRIS-E03-005 | E03  | Submit P/M Plan for Manager Approval              | 5   | S2     | E03-004, E12-001          | M06, M08      | Ready  |
| 17  | IRIS-E03-006 | E03  | View Gantt Timeline of P/M Allocations            | 8   | S2     | E03-002, E01-002          | M06, W01      | Ready  |
| 18  | IRIS-E12-001 | E12  | Receive Email on Approval Request                 | 3   | S2     | E03-005, E04-004, E13-001 | M32           | Ready  |
| 19  | IRIS-E04-001 | E04  | Create New Roadmap Version                        | 5   | S3     | E03-004, E02-001          | M09, M03      | Ready  |
| 20  | IRIS-E04-002 | E04  | View Version History with Timeline                | 5   | S3     | E04-001                   | M09, M03      | Ready  |
| 21  | IRIS-E04-003 | E04  | Compare Two Roadmap Versions (Diff View)          | 8   | S3     | E04-002                   | M09, M03      | Ready  |
| 22  | IRIS-E04-004 | E04  | Submit Roadmap Version for Approval               | 5   | S3     | E04-003, E12-001          | M09, M08      | Ready  |
| 23  | IRIS-E04-005 | E04  | Trigger Delta Sync to PROMIS on Approval          | 8   | S3     | E04-004, E11-001          | M09, M30      | Ready  |
| 24  | IRIS-E04-006 | E04  | Manage Allocation Entries per Resource per Period | 5   | S3     | E04-001, E01-002          | M09, M06      | Ready  |
| 25  | IRIS-E04-007 | E04  | Lock Approved Roadmap Version                     | 3   | S3     | E04-004                   | M09, M03      | Ready  |
| 26  | IRIS-E11-001 | E11  | Delta Sync Approved Roadmap to PROMIS             | 8   | S3     | E04-005, E13-001          | M30           | Ready  |
| 27  | IRIS-E11-005 | E11  | Monitor Integration Health and Sync Status        | 5   | S3     | E11-001, E11-002, E11-003 | M31, M30      | Ready  |
| 28  | IRIS-E02-001 | E02  | Manage Project Lifecycle                          | 5   | S4     | E01-004                   | M10           | Ready  |
| 29  | IRIS-E02-002 | E02  | View Actual PM Records per Project                | 5   | S4     | E02-001, E11-001          | M10, M09      | Ready  |
| 30  | IRIS-E02-003 | E02  | Sync Project Data Bidirectionally with N-PLM      | 8   | S4     | E11-001, E11-003, E02-001 | M10, M31      | Ready  |

> **Note**: S4 classified 33 stories as Must-Have for the MVP consisting of E01+E03+E04+E11+E13. Stories E02-001 through E02-003, E11-003, and E12-001 were classified Must in S4 at the story-level despite their parent epic being Should/Could. They are included in the MVP line because the core workflow (approval notifications, project lifecycle, N-PLM push) is essential.

### 1.2 Should-Have Stories (v1.1) — 24 Stories

| #   | Story ID     | Epic | Title                                                 | SP  | Sprint | Dependencies              | Module(s) | Status |
| --- | ------------ | ---- | ----------------------------------------------------- | --- | ------ | ------------------------- | --------- | ------ |
| 31  | IRIS-E01-005 | E01  | Manage Employee Skills and Profiles                   | 3   | S4     | E01-001, E11-004          | M01, M02  | Ready  |
| 32  | IRIS-E01-007 | E01  | Search and Filter Master Data                         | 3   | S4     | E01-001, E01-002, E13-003 | M01, M33  | Ready  |
| 33  | IRIS-E02-004 | E02  | Track Project Leaders, Managers, and Responsibility   | 3   | S4     | E02-001, E01-005          | M10, M08  | Ready  |
| 34  | IRIS-E02-005 | E02  | Project Dashboard with Status Overview                | 5   | S4     | E02-001, E02-002          | M10, W01  | Ready  |
| 35  | IRIS-E03-007 | E03  | Filter P/M Plan by Factor Control Dimensions          | 5   | S4     | E03-006, E10-001          | M06, M05  | Ready  |
| 36  | IRIS-E03-009 | E03  | Bulk Import/Export P/M Allocations                    | 5   | S4     | E03-006                   | M06       | Ready  |
| 37  | IRIS-E05-001 | E05  | Clone Approved Roadmap to Create Simulation           | 5   | S4     | E04-001, E04-007          | M11       | Ready  |
| 38  | IRIS-E05-002 | E05  | Modify Simulation Allocations Freely                  | 5   | S4     | E05-001                   | M11       | Ready  |
| 39  | IRIS-E05-003 | E05  | Compare Simulation vs. Original Roadmap               | 5   | S4     | E05-002, E04-003          | M11, M03  | Ready  |
| 40  | IRIS-E05-004 | E05  | Compare Multiple Simulations Side by Side             | 8   | S4     | E05-003, E10-001          | M11, M05  | Ready  |
| 41  | IRIS-E05-005 | E05  | Promote Simulation to New Roadmap Version             | 5   | S4     | E05-001, E04-001          | M11, M09  | Ready  |
| 42  | IRIS-E10-001 | E10  | Create Factor Control Set                             | 5   | S4     | E01-001, E13-003          | M05       | Ready  |
| 43  | IRIS-E10-002 | E10  | Apply Factor Control to All Analytical Views          | 3   | S4     | E10-001                   | M05       | Ready  |
| 44  | IRIS-E07-001 | E07  | View Global World Map with Site Pins                  | 5   | S5     | E06-002, E13-001          | M14, W03  | Ready  |
| 45  | IRIS-E07-002 | E07  | Drill Down from Site to Department to Team            | 5   | S5     | E07-001, E01-001          | M14       | Ready  |
| 46  | IRIS-E07-003 | E07  | View Resource Statistics per Site                     | 5   | S5     | E07-001, E06-002          | M14, M15  | Ready  |
| 47  | IRIS-E07-004 | E07  | Access Role-Based Menu from Home Screen               | 3   | S5     | E13-001                   | M14       | Ready  |
| 48  | IRIS-E08-001 | E08  | Build Ad-Hoc Analysis with Dimension/Measure Selector | 8   | S5     | E13-003, E10-001          | M20, W04  | Ready  |
| 49  | IRIS-E08-002 | E08  | Apply Factor Control Filters to Analysis              | 5   | S5     | E08-001, E10-001          | M20, M05  | Ready  |
| 50  | IRIS-E08-003 | E08  | View Analysis as Multiple Chart Types                 | 5   | S5     | E08-001                   | M20, W04  | Ready  |
| 51  | IRIS-E08-004 | E08  | Save and Share Analysis Views                         | 5   | S5     | E08-001                   | M20       | Ready  |
| 52  | IRIS-E08-007 | E08  | Actual vs. Plan Gap Reporting Dashboard               | 5   | S5     | E02-002, E04-006          | M20, M21  | Ready  |
| 53  | IRIS-E11-004 | E11  | Sync Employee Data from GHRP                          | 5   | S4     | E13-001, E01-005          | M31       | Ready  |
| 54  | IRIS-E11-006 | E11  | Handle Integration Error Recovery and Retry           | 6   | S4     | E11-005, E12-004          | M31, M30  | Ready  |

### 1.3 Could-Have Stories (v1.2) — 13 Stories

| #   | Story ID     | Epic | Title                                             | SP  | Sprint | Dependencies     | Module(s)     | Status |
| --- | ------------ | ---- | ------------------------------------------------- | --- | ------ | ---------------- | ------------- | ------ |
| 55  | IRIS-E03-008 | E03  | Undo/Redo Edits in P/M Plan Session               | 3   | S6+    | E03-002          | M06           | Ready  |
| 56  | IRIS-E05-006 | E05  | View Simulation Version History                   | 3   | S6+    | E05-001          | M11           | Ready  |
| 57  | IRIS-E06-001 | E06  | Define Staffing Targets per Department            | 5   | S6+    | E01-001, E01-005 | M12           | Ready  |
| 58  | IRIS-E06-002 | E06  | View Current vs. Target Headcount Dashboard       | 5   | S6+    | E06-001, E04-006 | M12, M13, W04 | Ready  |
| 59  | IRIS-E06-003 | E06  | Identify and Analyze Staffing Gaps by Skill Group | 5   | S6+    | E06-002          | M12, M13      | Ready  |
| 60  | IRIS-E06-004 | E06  | Create Hiring/Transfer/Retention Actions          | 5   | S6+    | E06-003          | M12, M13      | Ready  |
| 61  | IRIS-E06-005 | E06  | View HeadCount Trends Over Time                   | 5   | S6+    | E06-002          | M12, W04      | Ready  |
| 62  | IRIS-E06-006 | E06  | Export HeadCount Portfolio Report                 | 4   | S6+    | E06-002, E06-003 | M12           | Ready  |
| 63  | IRIS-E07-005 | E07  | Configure Personal Dashboard Widgets              | 5   | S6+    | E07-004          | M14           | Ready  |
| 64  | IRIS-E08-005 | E08  | View Personal Analysis (My Resources)             | 5   | S6+    | E08-001, E07-004 | M20           | Ready  |
| 65  | IRIS-E08-006 | E08  | Create Periodic Report Schedule                   | 5   | S6+    | E08-004, E12-003 | M20, M32      | Ready  |
| 66  | IRIS-E10-003 | E10  | Save Personal Factor Control Presets              | 3   | S6+    | E10-001          | M05           | Ready  |
| 67  | IRIS-E10-004 | E10  | Admin Manages Global Factor Control Templates     | 5   | S6+    | E10-001          | M05           | Ready  |

### 1.4 Won't-Have v1 Stories (v2.0) — 4 Stories

| #   | Story ID     | Epic | Title                                        | SP  | Sprint | Dependencies            | Module(s) | Status   |
| --- | ------------ | ---- | -------------------------------------------- | --- | ------ | ----------------------- | --------- | -------- |
| 68  | IRIS-E09-001 | E09  | Generate Excel PIVOT via Samsung AI Services | 8   | v2.0   | E08-001, Samsung AI API | M22       | Deferred |
| 69  | IRIS-E09-002 | E09  | Natural Language Query to Chart              | 5   | v2.0   | E09-001                 | M22       | Deferred |
| 70  | IRIS-E09-003 | E09  | AI-Suggested Report Templates                | 5   | v2.0   | E09-002, E08-004        | M22       | Deferred |
| 71  | IRIS-E09-004 | E09  | Export AI-Generated Reports                  | 3   | v2.0   | E09-001                 | M22       | Deferred |

### 1.5 Additional Stories from S4 Detailed Mapping

The following stories are tracked per S4 (E12-002 through E12-004) and complete the 74-story total:

| #   | Story ID     | Epic | Title                                       | SP  | Sprint | Priority | Module(s) | Status |
| --- | ------------ | ---- | ------------------------------------------- | --- | ------ | -------- | --------- | ------ |
| 72  | IRIS-E12-002 | E12  | Configure Notification Preferences          | 3   | S6+    | Should   | M32       | Ready  |
| 73  | IRIS-E12-003 | E12  | Scheduled Report Email Delivery             | 5   | S6+    | Could    | M32       | Ready  |
| 74  | IRIS-E12-004 | E12  | Alert on Sync Failure or Data Quality Issue | 5   | S6+    | Should   | M32, M31  | Ready  |

### 1.6 Registry Summary

| Priority        | Stories | Story Points | % of Total |
| --------------- | ------- | ------------ | ---------- |
| Must Have (MVP) | 30      | ~183         | 47%        |
| Should Have     | 24      | ~118         | 31%        |
| Could Have      | 16      | ~66          | 17%        |
| Won't Have (v1) | 4       | ~21          | 5%         |
| **TOTAL**       | **74**  | **~388**     | **100%**   |

---

## 2. Task Decomposition — Must-Have Stories

Each Must-Have story is broken into development tasks across workstreams. Task estimates are in hours (h). Roles: FE = Frontend Dev, BE = Backend Dev, MX = Mendix Dev, DE = Data Engineer, QA = Quality Assurance.

### 2.1 E13 — Infrastructure & Server Setup (Sprint 0)

#### IRIS-E13-001 | Set Up QA Environment (5 SP)

| Task       | Description                                                            | Hours   | Role |
| ---------- | ---------------------------------------------------------------------- | ------- | ---- |
| E13-001-T1 | Provision QA server (Mendix 10 runtime install + config)               | 8h      | BE   |
| E13-001-T2 | Install and configure Oracle 19c (schema creation, tablespaces, users) | 8h      | DE   |
| E13-001-T3 | Configure Elasticsearch 8.x (basic single-node for QA)                 | 4h      | DE   |
| E13-001-T4 | Set up WebSocket server (Node.js or Mendix-native)                     | 4h      | BE   |
| E13-001-T5 | Integrate Samsung SSO authentication                                   | 6h      | BE   |
| E13-001-T6 | Verify end-to-end deployment (Mendix app → Oracle → ES)                | 4h      | QA   |
|            | **Subtotal**                                                           | **34h** |      |

#### IRIS-E13-002 | Set Up Production Environment (8 SP)

| Task       | Description                                        | Hours   | Role |
| ---------- | -------------------------------------------------- | ------- | ---- |
| E13-002-T1 | Provision Prod servers (Mendix clustered, 2 nodes) | 10h     | BE   |
| E13-002-T2 | Install Oracle 19c with RAC/Data Guard for HA      | 12h     | DE   |
| E13-002-T3 | Configure ES 8.x cluster (3 master + N data nodes) | 8h      | DE   |
| E13-002-T4 | Set up load balancer and SSL termination           | 6h      | BE   |
| E13-002-T5 | Data migration plan (QA → Prod)                    | 8h      | DE   |
| E13-002-T6 | Performance baseline test (200 concurrent users)   | 8h      | QA   |
|            | **Subtotal**                                       | **52h** |      |

#### IRIS-E13-003 | Configure Elasticsearch Cluster (3 SP)

| Task       | Description                                                     | Hours   | Role |
| ---------- | --------------------------------------------------------------- | ------- | ---- |
| E13-003-T1 | Design index mappings (master data, allocations, analytics)     | 6h      | DE   |
| E13-003-T2 | Configure index lifecycle management (ILM) policies             | 3h      | DE   |
| E13-003-T3 | Set up ES security (Samsung SSO integration, role-based access) | 4h      | BE   |
| E13-003-T4 | Create index templates and aliases                              | 3h      | DE   |
| E13-003-T5 | Validate search query performance (<500ms)                      | 2h      | QA   |
|            | **Subtotal**                                                    | **18h** |      |

#### IRIS-E13-004 | Set Up Monitoring and Alerting (2 SP)

| Task       | Description                                                | Hours   | Role |
| ---------- | ---------------------------------------------------------- | ------- | ---- |
| E13-004-T1 | Configure Kibana dashboards for infrastructure metrics     | 4h      | DE   |
| E13-004-T2 | Set up Mendix APM monitoring                               | 3h      | MX   |
| E13-004-T3 | Configure Oracle Enterprise Manager alerts                 | 3h      | DE   |
| E13-004-T4 | Create alert rules (CPU, memory, response time thresholds) | 2h      | BE   |
|            | **Subtotal**                                               | **12h** |      |

### 2.2 E01 — Master Data & Standard PM (Sprint 1)

#### IRIS-E01-001 | Manage Organization Hierarchy (5 SP)

| Task       | Description                                                          | Hours   | Role |
| ---------- | -------------------------------------------------------------------- | ------- | ---- |
| E01-001-T1 | Create Oracle schema: Organization entity (7 levels) + relationships | 4h      | DE   |
| E01-001-T2 | Build Mendix domain model: Organization hierarchy entities           | 4h      | MX   |
| E01-001-T3 | Build tree view UI (Mendix tree widget, lazy loading)                | 8h      | FE   |
| E01-001-T4 | Implement CRUD microflows (add/edit/deactivate org units)            | 6h      | MX   |
| E01-001-T5 | Add deactivation warning for org units with active allocations       | 3h      | MX   |
| E01-001-T6 | Index org units in Elasticsearch                                     | 3h      | DE   |
| E01-001-T7 | Write unit tests + integration tests                                 | 4h      | QA   |
|            | **Subtotal**                                                         | **32h** |      |

#### IRIS-E01-002 | Manage Standard PM Templates (8 SP)

| Task       | Description                                                        | Hours   | Role |
| ---------- | ------------------------------------------------------------------ | ------- | ---- |
| E01-002-T1 | Create Oracle schema: StandardPM, PMDimension, PMValue tables      | 6h      | DE   |
| E01-002-T2 | Build Mendix domain model: StandardPM with dimension relationships | 6h      | MX   |
| E01-002-T3 | Build data grid UI with inline editing (6 dimensions + Shift + PM) | 12h     | FE   |
| E01-002-T4 | Implement auto-revision creation on save                           | 6h      | BE   |
| E01-002-T5 | Associate PM templates to Production Types                         | 4h      | MX   |
| E01-002-T6 | Index PM templates in Elasticsearch                                | 3h      | DE   |
| E01-002-T7 | Write unit tests + integration tests                               | 6h      | QA   |
|            | **Subtotal**                                                       | **43h** |      |

#### IRIS-E01-003 | View Revision History for Standard PMs (5 SP)

| Task       | Description                                                     | Hours   | Role |
| ---------- | --------------------------------------------------------------- | ------- | ---- |
| E01-003-T1 | Build revision history list UI (chronological, version, editor) | 6h      | FE   |
| E01-003-T2 | Build diff engine: cell-level comparison between versions       | 8h      | BE   |
| E01-003-T3 | Build diff view UI (color-coded: green/red/yellow)              | 6h      | FE   |
| E01-003-T4 | Implement non-destructive revert (create new revision from old) | 4h      | BE   |
| E01-003-T5 | Write unit tests                                                | 4h      | QA   |
|            | **Subtotal**                                                    | **28h** |      |

#### IRIS-E01-004 | CRUD Production Types with Standard Milestones (5 SP)

| Task       | Description                                                       | Hours   | Role |
| ---------- | ----------------------------------------------------------------- | ------- | ---- |
| E01-004-T1 | Create Oracle schema: ProductionType, Milestone tables            | 4h      | DE   |
| E01-004-T2 | Build Mendix CRUD pages (Code, Name, milestones, timeline fields) | 6h      | MX   |
| E01-004-T3 | Implement notification on milestone template changes              | 3h      | MX   |
| E01-004-T4 | Support Standard, Extra RF, Extra Certification type categories   | 3h      | MX   |
| E01-004-T5 | Write unit tests                                                  | 3h      | QA   |
|            | **Subtotal**                                                      | **19h** |      |

#### IRIS-E01-006 | Sync Master Data from N-PLM/SMDM/GHRP (5 SP)

| Task       | Description                                             | Hours   | Role |
| ---------- | ------------------------------------------------------- | ------- | ---- |
| E01-006-T1 | Build scheduled sync engine (daily 02:00 KST batch job) | 6h      | BE   |
| E01-006-T2 | Build conflict detection (IRIS local vs. source system) | 6h      | BE   |
| E01-006-T3 | Build conflict resolution UI (side-by-side comparison)  | 6h      | FE   |
| E01-006-T4 | Build Integration Dashboard — sync health panel         | 6h      | FE   |
| E01-006-T5 | Write integration tests with mock APIs                  | 4h      | QA   |
|            | **Subtotal**                                            | **28h** |      |

### 2.3 E11 — Integration (Sprint 1, Sprint 3)

#### IRIS-E11-002 | Receive Master Data Updates from N-PLM and SMDM (5 SP)

| Task       | Description                                                                     | Hours   | Role |
| ---------- | ------------------------------------------------------------------------------- | ------- | ---- |
| E11-002-T1 | Build N-PLM REST API connector (inbound: production types, org units, projects) | 8h      | BE   |
| E11-002-T2 | Build SMDM API connector (inbound: org hierarchy)                               | 6h      | BE   |
| E11-002-T3 | Implement sync logging (records processed, failed, skipped)                     | 4h      | BE   |
| E11-002-T4 | Build conflict queue for manual resolution                                      | 4h      | MX   |
| E11-002-T5 | Write integration tests with mock N-PLM/SMDM endpoints                          | 4h      | QA   |
|            | **Subtotal**                                                                    | **26h** |      |

#### IRIS-E11-003 | Push Project Updates to N-PLM (5 SP)

| Task       | Description                                                            | Hours   | Role |
| ---------- | ---------------------------------------------------------------------- | ------- | ---- |
| E11-003-T1 | Build N-PLM REST API connector (outbound: confirmed schedule + status) | 8h      | BE   |
| E11-003-T2 | Implement push trigger on Roadmap approval                             | 4h      | BE   |
| E11-003-T3 | Build "Synced to N-PLM" badge and status UI                            | 3h      | FE   |
| E11-003-T4 | Implement retry on push failure                                        | 3h      | BE   |
| E11-003-T5 | Write integration tests                                                | 4h      | QA   |
|            | **Subtotal**                                                           | **22h** |      |

#### IRIS-E11-001 | Delta Sync Approved Roadmap to PROMIS (8 SP)

| Task       | Description                                                   | Hours   | Role |
| ---------- | ------------------------------------------------------------- | ------- | ---- |
| E11-001-T1 | Build PROMIS REST API connector                               | 8h      | BE   |
| E11-001-T2 | Build delta detection engine (version diff → changed records) | 10h     | BE   |
| E11-001-T3 | Implement exponential backoff retry (1min, 5min, 30min)       | 4h      | BE   |
| E11-001-T4 | Build sync progress UI on Integration Dashboard               | 6h      | FE   |
| E11-001-T5 | Build "Synced to PROMIS" badge with timestamp                 | 3h      | FE   |
| E11-001-T6 | Write integration tests with mock PROMIS endpoint             | 6h      | QA   |
|            | **Subtotal**                                                  | **37h** |      |

#### IRIS-E11-005 | Monitor Integration Health and Sync Status (5 SP)

| Task       | Description                                                     | Hours   | Role |
| ---------- | --------------------------------------------------------------- | ------- | ---- |
| E11-005-T1 | Build Integration Dashboard main page (status cards per system) | 8h      | FE   |
| E11-005-T2 | Create Oracle integration_log table and logging microflows      | 4h      | DE   |
| E11-005-T3 | Build error detail drill-down with record-level info            | 4h      | FE   |
| E11-005-T4 | Implement "Sync Now" on-demand trigger per system               | 4h      | BE   |
| E11-005-T5 | Write unit tests                                                | 3h      | QA   |
|            | **Subtotal**                                                    | **23h** |      |

### 2.4 E03 — P/M Planner Concurrent Edit (Sprint 2)

#### IRIS-E03-001 | Open P/M Plan and See Active Editors (5 SP)

| Task       | Description                                                | Hours   | Role |
| ---------- | ---------------------------------------------------------- | ------- | ---- |
| E03-001-T1 | Build WebSocket connection manager (per-plan sessions)     | 8h      | BE   |
| E03-001-T2 | Build presence tracking (join/leave events, avatar badges) | 6h      | FE   |
| E03-001-T3 | Implement session timeout detection (10s grace period)     | 3h      | BE   |
| E03-001-T4 | Build P/M Plan header with editor avatar bar               | 4h      | FE   |
| E03-001-T5 | Write unit tests for WebSocket lifecycle                   | 4h      | QA   |
|            | **Subtotal**                                               | **25h** |      |

#### IRIS-E03-002 | Edit Allocation Cells with Real-time Sync (8 SP)

| Task       | Description                                                     | Hours   | Role |
| ---------- | --------------------------------------------------------------- | ------- | ---- |
| E03-002-T1 | Build xDHTML Gantt custom widget for P/M grid (W01)             | 16h     | FE   |
| E03-002-T2 | Implement operational transform (OT) engine for cell-level sync | 12h     | BE   |
| E03-002-T3 | Build WebSocket message protocol (cell edit, sync, acknowledge) | 6h      | BE   |
| E03-002-T4 | Build "Changed by [Name]" tooltip and highlight animation       | 4h      | FE   |
| E03-002-T5 | Implement offline queue for network resilience                  | 4h      | BE   |
| E03-002-T6 | Write unit tests + concurrency tests                            | 6h      | QA   |
|            | **Subtotal**                                                    | **48h** |      |

#### IRIS-E03-003 | Detect and Resolve Cell Conflicts (8 SP)

| Task       | Description                                                            | Hours   | Role |
| ---------- | ---------------------------------------------------------------------- | ------- | ---- |
| E03-003-T1 | Build conflict detection engine (2-second window, same-cell detection) | 8h      | BE   |
| E03-003-T2 | Build cell context menu conflict resolution dialog                     | 8h      | FE   |
| E03-003-T3 | Build batch conflict resolution panel ("View All Conflicts")           | 6h      | FE   |
| E03-003-T4 | Implement resolution notification to other editor                      | 4h      | BE   |
| E03-003-T5 | Write conflict simulation tests                                        | 6h      | QA   |
|            | **Subtotal**                                                           | **32h** |      |

#### IRIS-E03-004 | Save P/M Plan as Draft or Permanent Version (5 SP)

| Task       | Description                                                           | Hours   | Role |
| ---------- | --------------------------------------------------------------------- | ------- | ---- |
| E03-004-T1 | Build save dialog UI (Draft/Permanent options, role-based visibility) | 6h      | FE   |
| E03-004-T2 | Build diff view on save (current vs. last permanent version)          | 6h      | FE   |
| E03-004-T3 | Implement version creation microflow (snapshot to Oracle)             | 6h      | MX   |
| E03-004-T4 | Implement draft isolation (visible only to author + approver)         | 4h      | BE   |
| E03-004-T5 | Write unit tests                                                      | 3h      | QA   |
|            | **Subtotal**                                                          | **25h** |      |

#### IRIS-E03-005 | Submit P/M Plan for Manager Approval (5 SP)

| Task       | Description                                               | Hours   | Role |
| ---------- | --------------------------------------------------------- | ------- | ---- |
| E03-005-T1 | Build Mendix workflow for approval routing                | 6h      | MX   |
| E03-005-T2 | Build approval UI (diff view + approve/reject + comments) | 6h      | FE   |
| E03-005-T3 | Integrate email notification trigger (calls E12-001)      | 3h      | MX   |
| E03-005-T4 | Implement audit log for approval decisions                | 3h      | BE   |
| E03-005-T5 | Write workflow tests                                      | 3h      | QA   |
|            | **Subtotal**                                              | **21h** |      |

#### IRIS-E03-006 | View Gantt Timeline of P/M Allocations (8 SP)

| Task       | Description                                                | Hours   | Role |
| ---------- | ---------------------------------------------------------- | ------- | ---- |
| E03-006-T1 | Integrate xDHTML Gantt library (W01) with Mendix page      | 10h     | FE   |
| E03-006-T2 | Build Gantt data adapter (Oracle microflow → Gantt JSON)   | 6h      | MX   |
| E03-006-T3 | Implement overallocation highlighting (red cells, tooltip) | 4h      | FE   |
| E03-006-T4 | Build zoom controls (quarterly/monthly/weekly)             | 4h      | FE   |
| E03-006-T5 | Performance optimization (200 resources x 12 months <3s)   | 6h      | BE   |
| E03-006-T6 | Write rendering tests                                      | 4h      | QA   |
|            | **Subtotal**                                               | **34h** |      |

#### IRIS-E12-001 | Receive Email on Approval Request (3 SP)

| Task       | Description                                                | Hours   | Role |
| ---------- | ---------------------------------------------------------- | ------- | ---- |
| E12-001-T1 | Configure Samsung SMTP gateway connection                  | 3h      | BE   |
| E12-001-T2 | Build email template (subject, summary, deep link)         | 4h      | MX   |
| E12-001-T3 | Implement notification state tracking (prevent duplicates) | 3h      | BE   |
| E12-001-T4 | Write email delivery tests                                 | 2h      | QA   |
|            | **Subtotal**                                               | **12h** |      |

### 2.5 E04 — Resource Roadmap & Versioning (Sprint 3)

#### IRIS-E04-001 | Create New Roadmap Version (5 SP)

| Task       | Description                                                      | Hours   | Role |
| ---------- | ---------------------------------------------------------------- | ------- | ---- |
| E04-001-T1 | Create Oracle schema: RoadmapVersion, VersionAllocation tables   | 4h      | DE   |
| E04-001-T2 | Build version creation microflow (copy from latest approved)     | 6h      | MX   |
| E04-001-T3 | Build version panel UI (version list, status, author, timestamp) | 6h      | FE   |
| E04-001-T4 | Implement auto-numbering (Major.Minor)                           | 2h      | BE   |
| E04-001-T5 | Write unit tests                                                 | 3h      | QA   |
|            | **Subtotal**                                                     | **21h** |      |

#### IRIS-E04-002 | View Version History with Timeline (5 SP)

| Task       | Description                                                      | Hours   | Role |
| ---------- | ---------------------------------------------------------------- | ------- | ---- |
| E04-002-T1 | Build timeline UI (vertical timeline, Mendix timeline widget)    | 6h      | FE   |
| E04-002-T2 | Generate auto-change-summary per version                         | 4h      | BE   |
| E04-002-T3 | Implement progressive loading (infinite scroll for 10+ versions) | 4h      | FE   |
| E04-002-T4 | Build read-only version viewer for non-draft versions            | 4h      | MX   |
| E04-002-T5 | Write unit tests                                                 | 3h      | QA   |
|            | **Subtotal**                                                     | **21h** |      |

#### IRIS-E04-003 | Compare Two Roadmap Versions — Diff View (8 SP)

| Task       | Description                                                   | Hours   | Role |
| ---------- | ------------------------------------------------------------- | ------- | ---- |
| E04-003-T1 | Build diff engine (cell-by-cell comparison between snapshots) | 10h     | BE   |
| E04-003-T2 | Build side-by-side diff UI (green/red/yellow color coding)    | 10h     | FE   |
| E04-003-T3 | Build change summary header (added/removed/modified counts)   | 4h      | FE   |
| E04-003-T4 | Implement department filter in diff view                      | 3h      | FE   |
| E04-003-T5 | Write diff accuracy tests                                     | 6h      | QA   |
|            | **Subtotal**                                                  | **33h** |      |

#### IRIS-E04-004 | Submit Roadmap Version for Approval (5 SP)

| Task       | Description                                                   | Hours   | Role |
| ---------- | ------------------------------------------------------------- | ------- | ---- |
| E04-004-T1 | Build Mendix approval workflow (reuse E03-005 pattern)        | 4h      | MX   |
| E04-004-T2 | Build approval panel with diff view and comment field         | 6h      | FE   |
| E04-004-T3 | Trigger PROMIS delta sync queue on approval (link to E11-001) | 3h      | BE   |
| E04-004-T4 | Create audit trail entry on approval/rejection                | 3h      | BE   |
| E04-004-T5 | Write workflow tests                                          | 3h      | QA   |
|            | **Subtotal**                                                  | **19h** |      |

#### IRIS-E04-005 | Trigger Delta Sync to PROMIS on Approval (8 SP)

| Task       | Description                                                     | Hours   | Role |
| ---------- | --------------------------------------------------------------- | ------- | ---- |
| E04-005-T1 | Build delta detection: compare approved vs. last-synced version | 8h      | BE   |
| E04-005-T2 | Build sync job scheduler (triggered on approval event)          | 4h      | BE   |
| E04-005-T3 | Build sync progress indicator on Integration Dashboard          | 4h      | FE   |
| E04-005-T4 | Add "Synced to PROMIS" badge on version in Version History      | 3h      | FE   |
| E04-005-T5 | Write delta detection accuracy tests                            | 6h      | QA   |
|            | **Subtotal**                                                    | **25h** |      |

#### IRIS-E04-006 | Manage Allocation Entries per Resource per Period (5 SP)

| Task       | Description                                                | Hours   | Role |
| ---------- | ---------------------------------------------------------- | ------- | ---- |
| E04-006-T1 | Build allocation grid (rows = resources, columns = months) | 8h      | FE   |
| E04-006-T2 | Implement resource search from master data (autocomplete)  | 4h      | FE   |
| E04-006-T3 | Implement soft delete with diff view visibility            | 3h      | BE   |
| E04-006-T4 | Integrate xDHTML Gantt timeline overlay                    | 4h      | FE   |
| E04-006-T5 | Write unit tests                                           | 3h      | QA   |
|            | **Subtotal**                                               | **22h** |      |

#### IRIS-E04-007 | Lock Approved Roadmap Version (3 SP)

| Task       | Description                                           | Hours   | Role |
| ---------- | ----------------------------------------------------- | ------- | ---- |
| E04-007-T1 | Implement automatic lock on approval (read-only flag) | 3h      | BE   |
| E04-007-T2 | Build "Locked — Approved on [date]" banner UI         | 2h      | FE   |
| E04-007-T3 | Build admin emergency unlock with audit logging       | 4h      | MX   |
| E04-007-T4 | Write lock enforcement tests                          | 3h      | QA   |
|            | **Subtotal**                                          | **12h** |      |

### 2.6 Task Decomposition Summary

| Sprint        | Epic(s)              | Total Tasks | Total Hours | Key Deliverables                                              |
| ------------- | -------------------- | ----------- | ----------- | ------------------------------------------------------------- |
| S0            | E13                  | 20          | ~116h       | QA environment, Oracle schema, ES cluster, monitoring         |
| S1            | E01, E11 (partial)   | 32          | ~176h       | Master data CRUD, N-PLM/SMDM connectors, revision tracking    |
| S2            | E03, E12-001         | 30          | ~197h       | P/M Planner with concurrent editing, Gantt, approval workflow |
| S3            | E04, E11 (remaining) | 30          | ~213h       | Roadmap versioning, diff view, PROMIS delta sync              |
| **MVP Total** |                      | **112**     | **~702h**   |                                                               |

---

## 3. Sprint Allocation — 6-Sprint Plan

### 3.1 Capacity Model

| Parameter              | Value                               |
| ---------------------- | ----------------------------------- |
| Team size              | 4 developers                        |
| Sprint duration        | 2 weeks (10 working days)           |
| Focus factor           | 0.7 (meetings, code review, ad-hoc) |
| Available hours/sprint | 4 devs x 80h x 0.7 = 224h           |
| Velocity target        | ~14-25 SP per sprint                |
| Total sprints          | 6 core (S0-S5) + S6+ overflow       |

### 3.2 Sprint 0 — Infrastructure & Environment Setup

**Dates**: April 1-14, 2026
**Capacity**: ~168h (warm-up sprint, 60% focus factor)
**Goal**: All team members can develop and deploy to QA

| Story ID | Title                                                      | SP  | Owner   | Epic |
| -------- | ---------------------------------------------------------- | --- | ------- | ---- |
| E13-001  | Set Up QA Environment                                      | 5   | BE + DE | E13  |
| E13-002  | Set Up Production Environment (blueprint, not full deploy) | 8   | BE + DE | E13  |
| E13-003  | Configure Elasticsearch Cluster                            | 3   | DE      | E13  |
| E13-004  | Set Up Monitoring and Alerting                             | 2   | BE + DE | E13  |

**Sprint 0 Total**: 18 SP
**Key Milestone**: QA server ready for Sprint 1 development
**Risks**: Samsung TA server provisioning delay → Start with local dev + Docker containers

```
Sprint 0 Timeline:
Week 1: Server provisioning, Oracle install, Mendix runtime
Week 2: ES cluster, SSO integration, monitoring, CI/CD pipeline
Milestone: ✓ QA Environment Operational (Apr 14)
```

### 3.3 Sprint 1 — Foundation: Master Data + Integration Start

**Dates**: April 15-28, 2026
**Capacity**: ~224h
**Goal**: Master data populated and syncing from N-PLM

| Story ID | Title                                           | SP  | Owner   | Epic |
| -------- | ----------------------------------------------- | --- | ------- | ---- |
| E01-001  | Manage Organization Hierarchy                   | 5   | MX + FE | E01  |
| E01-002  | Manage Standard PM Templates                    | 8   | FE + MX | E01  |
| E01-003  | View Revision History for Standard PMs          | 5   | FE + BE | E01  |
| E01-004  | CRUD Production Types with Standard Milestones  | 5   | MX      | E01  |
| E01-006  | Sync Master Data from N-PLM/SMDM/GHRP           | 5   | BE + FE | E01  |
| E11-002  | Receive Master Data Updates from N-PLM and SMDM | 5   | BE      | E11  |
| E11-003  | Push Project Updates to N-PLM                   | 5   | BE      | E11  |

**Sprint 1 Total**: 38 SP (stretch — team at full velocity)
**Key Milestone**: Master data entities in Oracle + ES, N-PLM inbound sync operational
**Risks**: N-PLM API docs incomplete → Build mock API for parallel dev

```
Sprint 1 Timeline:
Week 1: Oracle schema (all master data tables), domain model, org tree UI
Week 2: PM templates, revision engine, N-PLM/SMDM connectors, sync jobs
Milestone: ✓ Master Data Syncing (Apr 28)
```

### 3.4 Sprint 2 — Core: P/M Planner with Concurrent Editing

**Dates**: April 29 — May 12, 2026
**Capacity**: ~224h
**Goal**: Two planners can edit the same P/M plan simultaneously without data loss

| Story ID | Title                                       | SP  | Owner   | Epic |
| -------- | ------------------------------------------- | --- | ------- | ---- |
| E03-001  | Open P/M Plan and See Active Editors        | 5   | BE + FE | E03  |
| E03-002  | Edit Allocation Cells with Real-time Sync   | 8   | FE + BE | E03  |
| E03-003  | Detect and Resolve Cell Conflicts           | 8   | BE + FE | E03  |
| E03-004  | Save P/M Plan as Draft or Permanent Version | 5   | FE + MX | E03  |
| E03-005  | Submit P/M Plan for Manager Approval        | 5   | MX + FE | E03  |
| E03-006  | View Gantt Timeline of P/M Allocations      | 8   | FE + MX | E03  |
| E12-001  | Receive Email on Approval Request           | 3   | BE + MX | E12  |

**Sprint 2 Total**: 42 SP (highest complexity sprint)
**Key Milestone**: Concurrent editing working end-to-end
**Risks**: WebSocket latency across Samsung sites → Test with 200ms simulated latency; Mendix 10 custom widget limits → React pluggable widgets as fallback

```
Sprint 2 Timeline:
Week 1: WebSocket layer, xDHTML widget (W01), OT engine, presence indicators
Week 2: Conflict detection + resolution, save workflow, Gantt view, approval email
Milestone: ✓ Concurrent Editing Operational (May 12)
```

### 3.5 Sprint 3 — Core: Resource Roadmap + Versioning + Integration Complete

**Dates**: May 13-26, 2026
**Capacity**: ~224h
**Goal**: Planners can create versioned roadmaps and sync confirmed plans to PROMIS/N-PLM

| Story ID | Title                                             | SP  | Owner   | Epic |
| -------- | ------------------------------------------------- | --- | ------- | ---- |
| E04-001  | Create New Roadmap Version                        | 5   | MX + FE | E04  |
| E04-002  | View Version History with Timeline                | 5   | FE + BE | E04  |
| E04-003  | Compare Two Roadmap Versions (Diff View)          | 8   | BE + FE | E04  |
| E04-004  | Submit Roadmap Version for Approval               | 5   | MX + FE | E04  |
| E04-005  | Trigger Delta Sync to PROMIS on Approval          | 8   | BE      | E04  |
| E04-006  | Manage Allocation Entries per Resource per Period | 5   | FE + BE | E04  |
| E04-007  | Lock Approved Roadmap Version                     | 3   | BE + MX | E04  |
| E11-001  | Delta Sync Approved Roadmap to PROMIS             | 8   | BE      | E11  |
| E11-005  | Monitor Integration Health and Sync Status        | 5   | FE + BE | E11  |

**Sprint 3 Total**: 52 SP (stretch — critical path)
**Key Milestone**: **MVP FEATURE COMPLETE** — roadmap + versioning + PROMIS integration
**Risks**: PROMIS API availability → Adapter pattern with mock endpoint; xDHTML Gantt performance → Virtual scrolling

```
Sprint 3 Timeline:
Week 1: Roadmap CRUD, version management, diff engine, allocation grid
Week 2: Approval workflow, PROMIS connector, delta sync, Integration Dashboard
Milestone: ✓ MVP Complete — QA Deploy (May 26)
```

### 3.6 Sprint 4 — Should-Have: Project Mgmt + Simulation + Factor Control

**Dates**: May 27 — June 9, 2026
**Capacity**: ~224h
**Goal**: Planners can simulate scenarios, manage projects, and filter by dimension

| Story ID | Title                                               | SP  | Owner   | Epic |
| -------- | --------------------------------------------------- | --- | ------- | ---- |
| E02-001  | Manage Project Lifecycle                            | 5   | MX      | E02  |
| E02-002  | View Actual PM Records per Project                  | 5   | MX + FE | E02  |
| E02-003  | Sync Project Data Bidirectionally with N-PLM        | 8   | BE      | E02  |
| E02-004  | Track Project Leaders, Managers, and Responsibility | 3   | MX      | E02  |
| E02-005  | Project Dashboard with Status Overview              | 5   | FE + MX | E02  |
| E01-005  | Manage Employee Skills and Profiles                 | 3   | MX      | E01  |
| E01-007  | Search and Filter Master Data                       | 3   | FE      | E01  |
| E05-001  | Clone Approved Roadmap to Create Simulation         | 5   | BE      | E05  |
| E05-002  | Modify Simulation Allocations Freely                | 5   | FE + BE | E05  |
| E05-003  | Compare Simulation vs. Original Roadmap             | 5   | FE      | E05  |
| E05-004  | Compare Multiple Simulations Side by Side           | 8   | FE + BE | E05  |
| E05-005  | Promote Simulation to New Roadmap Version           | 5   | BE      | E05  |
| E10-001  | Create Factor Control Set                           | 5   | FE + DE | E10  |
| E10-002  | Apply Factor Control to All Analytical Views        | 3   | FE      | E10  |
| E11-004  | Sync Employee Data from GHRP                        | 5   | BE      | E11  |
| E11-006  | Handle Integration Error Recovery and Retry         | 6   | BE      | E11  |
| E03-007  | Filter P/M Plan by Factor Control Dimensions        | 5   | FE      | E03  |
| E03-009  | Bulk Import/Export P/M Allocations                  | 5   | MX + FE | E03  |

**Sprint 4 Total**: 89 SP (across 2 sprints if needed — overflow to Sprint 5)
**Key Milestone**: v1.1 feature set — simulation, project management, factor control
**Risks**: ES aggregation query complexity → Pre-built index mappings; Feature creep → Timebox simulation to basic comparison

```
Sprint 4 Timeline:
Week 1: Project lifecycle CRUD, Factor Control panel, simulation clone + modify
Week 2: Simulation comparison, project dashboard, GHRP sync, error recovery
Milestone: ✓ Simulation + Project Management (Jun 9)
```

> **Note**: Sprint 4 is overloaded at 89 SP. In practice, E03-007, E03-009, E11-006, and E05-004 will spill into Sprint 5. The team should use velocity from S0-S3 to re-plan at sprint boundary.

### 3.7 Sprint 5 — Should-Have: World Map + Analysis Foundation

**Dates**: June 10-23, 2026
**Capacity**: ~224h
**Goal**: Samsung executives see the world map home screen; analysts have basic reporting

| Story ID            | Title                                                 | SP    | Owner   | Epic |
| ------------------- | ----------------------------------------------------- | ----- | ------- | ---- |
| E07-001             | View Global World Map with Site Pins                  | 5     | FE      | E07  |
| E07-002             | Drill Down from Site to Department to Team            | 5     | MX + FE | E07  |
| E07-003             | View Resource Statistics per Site                     | 5     | FE + BE | E07  |
| E07-004             | Access Role-Based Menu from Home Screen               | 3     | MX      | E07  |
| E08-001             | Build Ad-Hoc Analysis with Dimension/Measure Selector | 8     | FE + DE | E08  |
| E08-002             | Apply Factor Control Filters to Analysis              | 5     | FE      | E08  |
| E08-003             | View Analysis as Multiple Chart Types                 | 5     | FE      | E08  |
| E08-004             | Save and Share Analysis Views                         | 5     | FE + MX | E08  |
| E08-007             | Actual vs. Plan Gap Reporting Dashboard               | 5     | FE + BE | E08  |
| _Spillover from S4_ | _(if applicable)_                                     | _~15_ |         |      |

**Sprint 5 Total**: 46 SP (+ spillover)
**Key Milestone**: World map home screen live; basic analysis dashboards
**Risks**: Map rendering performance → Cache site-level aggregates; Prod server readiness (July) → Plan migration as parallel task

```
Sprint 5 Timeline:
Week 1: World map (Leaflet.js), site pins, drill-down, role-based menu
Week 2: Analysis Builder (ECharts.js integration), chart types, gap report
Milestone: ✓ World Map + Analysis Live (Jun 23)
```

### 3.8 Sprint 6+ — Could-Have: HC Portfolio + Reporting + Notifications + Stabilization

**Dates**: June 24+, 2026
**Capacity**: Ongoing
**Goal**: Complete all Could-Have features; stabilize for Prod deployment (July)

| Story ID | Title                                             | SP  | Owner    | Epic |
| -------- | ------------------------------------------------- | --- | -------- | ---- |
| E06-001  | Define Staffing Targets per Department            | 5   | MX       | E06  |
| E06-002  | View Current vs. Target Headcount Dashboard       | 5   | FE + MX  | E06  |
| E06-003  | Identify and Analyze Staffing Gaps by Skill Group | 5   | FE + BE  | E06  |
| E06-004  | Create Hiring/Transfer/Retention Actions          | 5   | MX       | E06  |
| E06-005  | View HeadCount Trends Over Time                   | 5   | FE       | E06  |
| E06-006  | Export HeadCount Portfolio Report                 | 4   | MX + FE  | E06  |
| E07-005  | Configure Personal Dashboard Widgets              | 5   | FE + MX  | E07  |
| E08-005  | View Personal Analysis (My Resources)             | 5   | FE       | E08  |
| E08-006  | Create Periodic Report Schedule                   | 5   | MX + BE  | E08  |
| E10-003  | Save Personal Factor Control Presets              | 3   | FE       | E10  |
| E10-004  | Admin Manages Global Factor Control Templates     | 5   | MX       | E10  |
| E03-008  | Undo/Redo Edits in P/M Plan Session               | 3   | FE       | E03  |
| E05-006  | View Simulation Version History                   | 3   | FE       | E05  |
| E12-002  | Configure Notification Preferences                | 3   | MX       | E12  |
| E12-003  | Scheduled Report Email Delivery                   | 5   | BE + MX  | E12  |
| E12-004  | Alert on Sync Failure or Data Quality Issue       | 5   | BE + MX  | E12  |
| —        | Bug fixes and stabilization                       | —   | All      | —    |
| —        | Performance optimization                          | —   | BE + DE  | —    |
| —        | UAT preparation and execution                     | —   | QA + All | —    |

**Sprint 6+ Total**: ~71 SP + stabilization (across ~2-3 sprints)
**Key Milestone**: Prod deployment (July 2026)

### 3.9 Sprint Summary

| Sprint | Dates (2026)    | Epics                   | SP   | Cumulative SP | Milestone                      |
| ------ | --------------- | ----------------------- | ---- | ------------- | ------------------------------ |
| S0     | Apr 1-14        | E13                     | 18   | 18            | QA Environment Ready           |
| S1     | Apr 15-28       | E01, E11                | 38   | 56            | Master Data Syncing            |
| S2     | Apr 29 - May 12 | E03, E12                | 42   | 98            | Concurrent Editing Operational |
| S3     | May 13-26       | E04, E11                | 52   | 150           | **MVP COMPLETE**               |
| S4     | May 27 - Jun 9  | E02, E05, E10, E03, E11 | 89\* | 239           | Simulation + Project Mgmt      |
| S5     | Jun 10-23       | E07, E08                | 46+  | 285+          | World Map + Analysis           |
| S6+    | Jun 24+         | E06, E08, E10, E12      | ~71  | 356+          | Prod Deploy (July)             |

\*Sprint 4 is intentionally overloaded; spillover planned to Sprint 5.

---

## 4. Development Roadmap — Visual Timeline

### 4.1 Gantt Timeline

```
2026     April                    May                      June                     July
         W1    W2    W3    W4    W5    W6    W7    W8    W9    W10   W11   W12   W13+
         |-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|

Sprint   |== S0 ==|== S1 ==|== S2 ==|== S3 ==|== S4 ==|== S5 ==|==== S6+ =====|

E13 ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     QA Setup      ║ Prod Server Provisioning (Samsung TA) ........... PROD DEPLOY

E01 ░░░░░░░░░░░░░░░████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                    Master Data    ║ Skills + Search (S4)

E03 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████░░░░░░░░░░████░░░░░░░░░░░░░░░░
                                    Concurrent Edit  ║ Gantt  Factor  Import/Export
                                                            Control

E04 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████████░░░░░░░░░░░░░░
                                                     Roadmap + Versioning + Diff

E11 ░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░████████████████░░░░░░░░░░░░░░
                    N-PLM/SMDM     ║                  PROMIS + Dashboard + Recovery

E02 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████░░
                                                                     Project Mgmt

E05 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████░░
                                                                     Simulation

E10 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░░████░░
                                                                     Factor Control

E07 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████░░
                                                                         World Map

E08 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████████
                                                                         Analysis

E06 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
                                                                               HC

E12 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██
                                    Email║                                     Notify

     |     |     |     |     |     |     |     |     |     |     |     |     |
     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼
    QA                        MVP           v1.1              v1.2        PROD
    Env                      v1.0          Scope              Scope      Deploy
    Ready                    May 26        Jun 9              Jul+
```

### 4.2 Key Milestones

| #   | Milestone                      | Target Date    | Gate              | Evidence Required                              |
| --- | ------------------------------ | -------------- | ----------------- | ---------------------------------------------- |
| M1  | QA Environment Operational     | April 14, 2026 | —                 | All infrastructure running, CI/CD verified     |
| M2  | Master Data Syncing            | April 28, 2026 | —                 | Org hierarchy + PM templates in Oracle + ES    |
| M3  | Concurrent Editing Operational | May 12, 2026   | —                 | 2 planners edit same plan without data loss    |
| M4  | **MVP Feature Complete**       | May 26, 2026   | Gate 3 Checkpoint | E01+E03+E04+E11+E13 stories done               |
| M5  | MVP QA Deploy                  | May 28, 2026   | —                 | MVP deployed to QA, smoke tests pass           |
| M6  | Simulation + Project Mgmt Live | June 9, 2026   | —                 | E02+E05+E10 stories done                       |
| M7  | World Map + Analysis Live      | June 23, 2026  | —                 | v1.1 feature complete                          |
| M8  | UAT Start                      | July 1, 2026   | —                 | 5-10 pilot planners (Hwaseong + Pyeongtaek)    |
| M9  | **Production Deploy**          | July 14, 2026  | Gate 3            | 80%+ test coverage, 0 critical bugs, SUS >= 68 |

---

## 5. Dependency Map

### 5.1 Epic-Level Dependencies

```
E13 (Infrastructure)
 ├──► E01 (Master Data)         — cannot build without QA environment
 │     ├──► E03 (P/M Planner)   — planner needs org hierarchy + PM templates
 │     ├──► E04 (Roadmap)       — roadmap references master data dimensions
 │     ├──► E06 (HC Portfolio)  — HC needs org hierarchy + employee profiles
 │     └──► E10 (Factor Control)— factor dimensions come from master data
 │
 ├──► E11 (Integration)         — connectors need infrastructure
 │     ├──► E04 (Roadmap)       — PROMIS sync triggers on roadmap approval
 │     └──► E02 (Project Mgmt)  — N-PLM bidirectional sync
 │
 ├──► E03 (P/M Planner)
 │     └──► E04 (Roadmap)       — roadmap versions build on P/M plan drafts
 │           └──► E05 (Simulation)— simulation clones from approved roadmap
 │
 └──► E07 (World Map)           — needs infrastructure + org hierarchy

E10 (Factor Control) ◄──► E03, E04, E05, E07, E08
     Cross-cutting: filter mechanism used across all analytical views

E12 (Smart Notifications) ◄── E03, E04 (approval triggers)
                           ◄── E11 (sync failure alerts)
                           ──► E08 (scheduled report delivery)

E09 (AI Reporting) ◄── E08 (analysis engine) + Samsung AI Services (external)
```

### 5.2 Critical Path

The longest dependency chain determines the minimum delivery timeline:

```
E13-001 → E01-001 → E01-002 → E03-002 → E03-004 → E04-001 → E04-003 → E04-004 → E04-005 → E11-001
(QA Env)   (Org)     (Std PM)  (RT Sync)  (Draft)   (Version)  (Diff)    (Approve)  (Delta)   (PROMIS)
  S0        S1        S1        S2         S2        S3         S3        S3         S3        S3
```

**Critical path length**: 10 stories across 4 sprints (8 weeks). No slack — any delay on this chain delays MVP.

### 5.3 Story-Level Dependency Matrix

| Blocked Story              | Blocked By                            | Sprint Impact                        |
| -------------------------- | ------------------------------------- | ------------------------------------ |
| E01-002 (PM Templates)     | E01-001 (Org Hierarchy)               | Must complete E01-001 in S1 Week 1   |
| E01-003 (Revision History) | E01-002 (PM Templates)                | Sequential within S1                 |
| E03-001 (Active Editors)   | E13-001 (QA Env), E13-003 (WebSocket) | S0 must complete                     |
| E03-002 (Real-time Sync)   | E03-001 (Active Editors)              | Sequential within S2                 |
| E03-003 (Conflict Detect)  | E03-002 (Real-time Sync)              | Sequential within S2                 |
| E03-004 (Draft/Permanent)  | E03-002, E03-003                      | S2 Week 2                            |
| E03-005 (Approval)         | E03-004, E12-001                      | S2 Week 2                            |
| E03-006 (Gantt)            | E03-002, E01-002                      | Parallel with E03-003                |
| E04-001 (New Version)      | E03-004, E02-001                      | S3 start                             |
| E04-003 (Diff View)        | E04-002 (Version History)             | Sequential within S3                 |
| E04-005 (Delta PROMIS)     | E04-004, E11-001                      | S3 Week 2                            |
| E05-001 (Clone Sim)        | E04-001, E04-007                      | Requires approved roadmap            |
| E07-001 (World Map)        | E06-002 (HC Dashboard)                | Partial dependency — can stub data   |
| E08-001 (Analysis Builder) | E13-003 (ES), E10-001                 | Requires ES indices + factor control |

### 5.4 Shared Component Dependencies

| Component        | Module | Used By                                   | Impact if Delayed               |
| ---------------- | ------ | ----------------------------------------- | ------------------------------- |
| Version Engine   | M03    | E01, E03, E04, E05                        | Blocks all versioning features  |
| Diff Engine      | M03    | E01-003, E03-004, E04-003, E05-003        | Blocks all comparison features  |
| Factor Control   | M05    | E03-007, E05-004, E07, E08, E10           | Blocks cross-view filtering     |
| WebSocket Layer  | M07    | E03-001 through E03-006                   | Blocks all concurrent editing   |
| N-PLM Connector  | M31    | E01-006, E02-003, E11-002, E11-003        | Blocks all N-PLM data flow      |
| PROMIS Connector | M30    | E04-005, E11-001                          | Blocks roadmap sync to PROMIS   |
| Sync Engine      | M33    | E11-001 through E11-006                   | Blocks all integration features |
| Email Service    | M32    | E03-005, E04-004, E12-001 through E12-004 | Blocks approval notifications   |

---

## 6. Traceability Matrix

### 6.1 Complete Story-to-Origin Mapping

| Story ID | Epic | Feature | Samsung Req   | Problem Statement | Business Rules         | Process(es) | Key Entities                                   | Module(s)     |
| -------- | ---- | ------- | ------------- | ----------------- | ---------------------- | ----------- | ---------------------------------------------- | ------------- |
| E01-001  | E01  | F1      | Req-0         | PS-001, PS-004    | BR-001, BR-002         | P01         | Organization, Site, Division, Department, Team | M01, M02      |
| E01-002  | E01  | F1      | Req-0         | PS-001            | BR-003, BR-004, BR-005 | P01, P02    | StandardPM, PMDimension, PMValue               | M01, M04      |
| E01-003  | E01  | F1      | Req-0         | PS-001            | BR-006                 | P02         | Revision, StandardPM                           | M01, M03      |
| E01-004  | E01  | F1      | Req-0         | PS-001            | BR-007, BR-008         | P01         | ProductionType, Milestone                      | M01, M02      |
| E01-005  | E01  | F1      | Req-0         | PS-004            | BR-009                 | P01         | Employee, SkillProfile                         | M01, M02      |
| E01-006  | E01  | F1      | Req-5         | PS-001, PS-005    | BR-010, BR-011, BR-012 | P01, P12    | SyncLog, MasterDataConflict                    | M01, M31      |
| E01-007  | E01  | F1      | Req-0         | PS-001            | BR-013                 | P01         | — (search across entities)                     | M01, M33      |
| E02-001  | E02  | F2      | Req-5         | PS-002            | BR-014, BR-015, BR-016 | P03         | Project, ProjectStatus                         | M10           |
| E02-002  | E02  | F2      | Req-5         | PS-002, PS-003    | BR-017, BR-018         | P03, P04    | ActualPM, Project                              | M10, M09      |
| E02-003  | E02  | F2      | Req-5         | PS-005            | BR-019, BR-020         | P03, P12    | Project, SyncLog                               | M10, M31      |
| E02-004  | E02  | F2      | Req-5         | PS-002            | BR-021                 | P03         | Project, Employee                              | M10, M08      |
| E02-005  | E02  | F2      | Req-5         | PS-002            | BR-022                 | P03         | Project                                        | M10, W01      |
| E03-001  | E03  | F1, F3  | Req-0, Req-3  | PS-001, PS-003    | BR-023, BR-024         | P05         | PMPlan, EditorSession                          | M06, M07      |
| E03-002  | E03  | F1, F3  | Req-0, Req-3  | PS-003            | BR-025, BR-026, BR-027 | P05, P06    | PMPlan, CellEdit, SyncMessage                  | M06, M07, W01 |
| E03-003  | E03  | F1, F3  | Req-3         | PS-003            | BR-028, BR-029, BR-030 | P06         | CellConflict, ConflictResolution               | M06, M07      |
| E03-004  | E03  | F1, F3  | Req-3         | PS-003, PS-001    | BR-031, BR-032         | P05, P07    | PMVersion, DraftVersion                        | M06, M03      |
| E03-005  | E03  | F1, F3  | Req-3         | PS-003, PS-002    | BR-033, BR-034         | P07, P08    | ApprovalRequest, ApprovalDecision              | M06, M08      |
| E03-006  | E03  | F3      | Req-0         | PS-001, PS-003    | BR-035, BR-036         | P05         | PMPlan, Allocation                             | M06, W01      |
| E03-007  | E03  | F1, F3  | Req-0, Req-6  | PS-001            | BR-037                 | P05, P09    | PMPlan, FactorControlSet                       | M06, M05      |
| E03-008  | E03  | F1, F3  | Req-0         | PS-003            | BR-038                 | P05         | EditHistory                                    | M06           |
| E03-009  | E03  | F1, F3  | Req-0         | PS-001            | BR-039, BR-040         | P05         | PMPlan, ImportJob                              | M06           |
| E04-001  | E04  | F3      | Req-1, Req-4  | PS-002, PS-003    | BR-041, BR-042         | P07         | RoadmapVersion, Allocation                     | M09, M03      |
| E04-002  | E04  | F3      | Req-2, Req-4  | PS-002            | BR-043                 | P07         | RoadmapVersion                                 | M09, M03      |
| E04-003  | E04  | F3      | Req-2         | PS-002, PS-003    | BR-044, BR-045         | P07         | VersionDiff                                    | M09, M03      |
| E04-004  | E04  | F3      | Req-4         | PS-002            | BR-046, BR-047         | P07, P08    | ApprovalRequest, RoadmapVersion                | M09, M08      |
| E04-005  | E04  | F3      | Req-2         | PS-005            | BR-048, BR-049         | P07, P12    | SyncJob, DeltaRecord                           | M09, M30      |
| E04-006  | E04  | F3      | Req-1         | PS-001, PS-002    | BR-050, BR-051         | P07         | Allocation, Resource                           | M09, M06      |
| E04-007  | E04  | F3      | Req-4         | PS-002            | BR-052, BR-053         | P07         | RoadmapVersion                                 | M09, M03      |
| E05-001  | E05  | F3      | Req-1, Req-4  | PS-002            | BR-054                 | P10         | Simulation, RoadmapVersion                     | M11           |
| E05-002  | E05  | F3      | Req-1         | PS-002            | BR-055, BR-056         | P10         | Simulation, Allocation                         | M11           |
| E05-003  | E05  | F3      | Req-1, Req-4  | PS-002, PS-003    | BR-057                 | P10         | SimulationDiff                                 | M11, M03      |
| E05-004  | E05  | F3      | Req-1         | PS-002            | BR-058                 | P10         | Simulation                                     | M11, M05      |
| E05-005  | E05  | F3      | Req-1, Req-4  | PS-002            | BR-059, BR-060         | P10, P07    | Simulation, RoadmapVersion                     | M11, M09      |
| E05-006  | E05  | F3      | Req-1         | PS-002            | BR-061                 | P10         | Simulation                                     | M11           |
| E06-001  | E06  | F4      | Req-9         | PS-004            | BR-062                 | P11         | StaffingTarget, Department                     | M12           |
| E06-002  | E06  | F4      | Req-9         | PS-004            | BR-063, BR-064         | P11         | HeadcountDashboard                             | M12, M13, W04 |
| E06-003  | E06  | F4      | Req-9         | PS-004            | BR-065                 | P11         | SkillGap                                       | M12, M13      |
| E06-004  | E06  | F4      | Req-9         | PS-004            | BR-066, BR-067         | P11         | StaffingAction                                 | M12, M13      |
| E06-005  | E06  | F4      | Req-9         | PS-004            | BR-068                 | P11         | HeadcountTrend                                 | M12, W04      |
| E06-006  | E06  | F4      | Req-9         | PS-004            | BR-069                 | P11         | ExportJob                                      | M12           |
| E07-001  | E07  | F4      | Req-7, Req-8  | PS-004            | BR-070, BR-071         | P13         | Site, MapPin                                   | M14, W03      |
| E07-002  | E07  | F4      | Req-7, Req-8  | PS-004            | BR-072                 | P13         | Site, Division, Department                     | M14           |
| E07-003  | E07  | F4      | Req-7, Req-8  | PS-004            | BR-073                 | P13         | SiteStatistics                                 | M14, M15      |
| E07-004  | E07  | F4      | Req-7         | PS-004            | BR-074                 | P13         | UserRole, MenuConfig                           | M14           |
| E07-005  | E07  | F4      | Req-7         | PS-004            | BR-075                 | P13         | DashboardWidget, UserPreference                | M14           |
| E08-001  | E08  | F5, F6  | Req-8, Req-10 | PS-002, PS-004    | BR-076, BR-077         | P09         | AnalysisConfig, Dimension, Measure             | M20, W04      |
| E08-002  | E08  | F5, F6  | Req-6, Req-8  | PS-002            | BR-078                 | P09         | AnalysisConfig, FactorControlSet               | M20, M05      |
| E08-003  | E08  | F5, F6  | Req-8, Req-10 | PS-002            | BR-079                 | P09         | ChartConfig                                    | M20, W04      |
| E08-004  | E08  | F5, F6  | Req-8         | PS-002            | BR-080                 | P09         | SavedAnalysis, ShareLink                       | M20           |
| E08-005  | E08  | F5      | Req-8         | PS-002, PS-004    | BR-081                 | P09         | PersonalView                                   | M20           |
| E08-006  | E08  | F6      | Req-10        | PS-002            | BR-082                 | P09, P08    | ReportSchedule                                 | M20, M32      |
| E08-007  | E08  | F5      | Req-8, Req-10 | PS-003            | BR-083                 | P04, P09    | GapReport                                      | M20, M21      |
| E09-001  | E09  | F7      | Req-11        | PS-002            | BR-084                 | P09         | AIRequest, PIVOTLayout                         | M22           |
| E09-002  | E09  | F7      | Req-11        | PS-002            | BR-085                 | P09         | NLQuery                                        | M22           |
| E09-003  | E09  | F7      | Req-11        | PS-002            | BR-086                 | P09         | ReportTemplate                                 | M22           |
| E09-004  | E09  | F7      | Req-11        | PS-002            | BR-087                 | P09         | ExportJob                                      | M22           |
| E10-001  | E10  | —       | Req-6         | PS-001, PS-002    | BR-088, BR-089         | P09         | FactorControlSet, DimensionFilter              | M05           |
| E10-002  | E10  | —       | Req-6         | PS-001, PS-002    | BR-090                 | P09         | FactorControlSet                               | M05           |
| E10-003  | E10  | —       | Req-6         | PS-001            | BR-091                 | P09         | UserPreset                                     | M05           |
| E10-004  | E10  | —       | Req-6         | PS-002            | BR-092                 | P09         | GlobalTemplate                                 | M05           |
| E11-001  | E11  | F1, F2  | Req-2         | PS-005            | BR-093, BR-094, BR-095 | P12         | SyncJob, DeltaRecord                           | M30           |
| E11-002  | E11  | F1      | Req-5         | PS-005, PS-001    | BR-096, BR-097         | P12         | SyncJob, MasterDataUpdate                      | M31           |
| E11-003  | E11  | F2      | Req-5         | PS-005            | BR-098, BR-099         | P12         | SyncJob, ProjectPush                           | M31           |
| E11-004  | E11  | F1      | Req-5         | PS-004, PS-005    | BR-100, BR-101         | P12         | EmployeeSync, SyncLog                          | M31           |
| E11-005  | E11  | F1, F2  | Req-2, Req-5  | PS-005            | BR-102, BR-103         | P12         | IntegrationStatus                              | M31, M30      |
| E11-006  | E11  | F1, F2  | Req-2, Req-5  | PS-005            | BR-104, BR-105         | P12         | RetryQueue, DeadLetterQueue                    | M31, M30      |
| E12-001  | E12  | F6      | Req-10        | PS-002, PS-003    | BR-106                 | P08         | Notification, EmailMessage                     | M32           |
| E12-002  | E12  | F6      | Req-10        | PS-002            | BR-107                 | P08         | NotificationPreference                         | M32           |
| E12-003  | E12  | F6      | Req-10        | PS-002            | BR-108                 | P08         | ScheduledEmail, ReportAttachment               | M32           |
| E12-004  | E12  | F6      | Req-10        | PS-005            | BR-109                 | P08, P12    | SyncAlert, DataQualityIssue                    | M32, M31      |
| E13-001  | E13  | —       | Req-12        | PS-005            | BR-110                 | P13         | — (infrastructure)                             | M33           |
| E13-002  | E13  | —       | Req-12        | PS-005            | BR-111                 | P13         | — (infrastructure)                             | M33           |
| E13-003  | E13  | —       | Req-12        | PS-005            | BR-112                 | P13         | ESIndex, ESCluster                             | M33           |
| E13-004  | E13  | —       | Req-12        | PS-005            | BR-113                 | P13         | MonitoringAlert                                | M33           |

### 6.2 Feature Area to Problem Statement Mapping

| Feature Area | Name                                               | Problem Statements                                    | Samsung Requirements              |
| ------------ | -------------------------------------------------- | ----------------------------------------------------- | --------------------------------- |
| F1           | Master Data & Standard PM                          | PS-001 (Manual data entry, no single source of truth) | Req-0, Req-5                      |
| F2           | Project/Product Management                         | PS-002 (No integrated project-resource view)          | Req-5                             |
| F3           | Resource Planning (Planner + Roadmap + Simulation) | PS-001, PS-002, PS-003 (Data loss, version chaos)     | Req-0, Req-1, Req-2, Req-3, Req-4 |
| F4           | HeadCount & World Map                              | PS-004 (No global visibility into staffing gaps)      | Req-7, Req-8, Req-9               |
| F5           | Analysis — Actual vs. Plan                         | PS-002, PS-003 (Cannot compare planned vs. actual)    | Req-8                             |
| F6           | Reporting & Notifications                          | PS-002, PS-005 (Manual report creation, no alerts)    | Req-10                            |
| F7           | AI-Based Reporting                                 | PS-002 (Advanced analytics require manual Excel work) | Req-11                            |

### 6.3 Problem Statement Reference

| ID     | Statement                                                                                                                                                                                                                          |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PS-001 | Resource planners need a way to maintain a single source of truth for PM data with concurrent multi-user editing because the current PM Planner causes data loss and version confusion when multiple planners edit simultaneously. |
| PS-002 | Planning managers need a way to create, version, compare, and approve resource roadmaps because the current process relies on manual Excel tracking with no audit trail or approval workflow.                                      |
| PS-003 | Resource planners need a way to resolve editing conflicts in real-time because the current system's last-write-wins approach silently overwrites colleagues' work.                                                                 |
| PS-004 | HR portfolio managers need a way to view global headcount distribution and staffing gaps across Samsung DS sites because current data is fragmented across multiple spreadsheets with no consolidated view.                        |
| PS-005 | System administrators need a way to maintain data synchronization between IRIS and Samsung's existing systems (N-PLM, PROMIS, SMDM, GHRP) because manual data transfer causes errors and consumes significant planner time.        |

---

## 7. Parallel Workstream Plan

AX Principle 7 mandates parallel workstreams in DEVELOP. IRIS uses 4 concurrent workstreams synchronized through API contracts and daily standups.

### 7.1 Workstream Assignments

#### Frontend Workstream

**Owner**: Frontend/Widgets Developer
**Scope**: Mendix pages, custom widgets (W01-W05), design system implementation

| Sprint | Deliverables                                                                                    |
| ------ | ----------------------------------------------------------------------------------------------- |
| S0     | Dev environment setup, design system tokens, component library init                             |
| S1     | Org hierarchy tree widget, PM template data grid, revision diff UI                              |
| S2     | **xDHTML Gantt widget (W01)**, presence indicators, conflict resolution dialog, Gantt view      |
| S3     | Roadmap allocation grid, version timeline, diff view (color-coded), PROMIS sync progress UI     |
| S4     | Project dashboard, simulation comparison views, Factor Control panel, import/export UI          |
| S5     | **World Map widget (W03)**, site drill-down, **ECharts.js integration (W04)**, analysis builder |
| S6+    | HC dashboard, personal dashboard widgets, trend charts, notification preferences                |

**Custom Widgets** (React Pluggable Widgets for Mendix 10):

| Widget | Purpose                                                       | Sprint |
| ------ | ------------------------------------------------------------- | ------ |
| W01    | xDHTML Gantt — P/M allocation grid + Gantt timeline           | S2     |
| W02    | WebSocket Client — real-time collaboration layer              | S2     |
| W03    | World Map — Leaflet.js with Samsung site pins                 | S5     |
| W04    | ECharts Dashboard — analysis charts (bar, line, pie, heatmap) | S5     |
| W05    | Diff Viewer — color-coded version comparison                  | S2-S3  |

#### Backend Workstream

**Owner**: Backend/Integration Developer
**Scope**: Microflows, domain model, business logic, version engine, WebSocket server

| Sprint | Deliverables                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------- |
| S0     | Mendix runtime config, SSO integration, CI/CD pipeline                                            |
| S1     | Master data microflows, revision engine (M03), N-PLM connector (M31 partial)                      |
| S2     | **WebSocket server (M07)**, OT engine, conflict detection, approval workflow, email service (M32) |
| S3     | **Version engine (M03 full)**, diff engine, approval workflow (roadmap), delta detection          |
| S4     | Project lifecycle microflows, simulation engine (M11), GHRP connector, error recovery             |
| S5     | Role-based access, statistics aggregation, gap analysis microflows                                |
| S6+    | Scheduled events, report generation, notification engine                                          |

#### Data Workstream

**Owner**: Data Engineer (shared with Backend)
**Scope**: Oracle schema, ES indices, sync engine (M33), data migration

| Sprint | Deliverables                                                                        |
| ------ | ----------------------------------------------------------------------------------- |
| S0     | **Oracle 19c schema creation** (all 28 entities), ES cluster config, index mappings |
| S1     | Master data tables populated, ES indices for org/PM/employees, sync logging tables  |
| S2     | WebSocket session tables, edit history tables, conflict log                         |
| S3     | Version snapshot tables, allocation tables, sync job tables, delta tracking         |
| S4     | Project tables, simulation tables, factor control tables                            |
| S5     | Analytics aggregation indices, site statistics materialized views                   |
| S6+    | HC tables, report schedule tables, data migration (QA → Prod)                       |

#### Integration Workstream

**Owner**: Backend/Integration Developer (shared)
**Scope**: N-PLM connector (M31), PROMIS connector (M30), Smart Notify (M32)

| Sprint | Deliverables                                                                                |
| ------ | ------------------------------------------------------------------------------------------- |
| S0     | API contract definitions, mock endpoints for N-PLM/PROMIS/SMDM/GHRP                         |
| S1     | **N-PLM inbound connector** (master data sync), SMDM connector (org hierarchy)              |
| S2     | Email notification service (Samsung SMTP gateway)                                           |
| S3     | **PROMIS outbound connector** (delta sync), N-PLM bidirectional sync, Integration Dashboard |
| S4     | GHRP employee sync, error recovery + dead letter queue                                      |
| S5     | Integration stability testing, performance benchmarking                                     |
| S6+    | Monitoring alerts, data quality checks                                                      |

### 7.2 Synchronization Points

| Mechanism           | Frequency                     | Participants                             |
| ------------------- | ----------------------------- | ---------------------------------------- |
| Daily Standup       | Daily 09:00 KST               | All 4 developers + CPO                   |
| API Contract Review | Start of each sprint          | Backend + Frontend + Integration         |
| Sprint Demo         | End of each sprint (biweekly) | Full team including Samsung stakeholders |
| Integration Test    | Mid-sprint (weekly)           | All workstreams                          |
| Code Review         | Continuous                    | Peer review, minimum 1 reviewer          |

### 7.3 API Contract Strategy

All workstreams develop in parallel against **shared API contracts** defined at sprint start:

```
Sprint N Start:
  1. Backend publishes API contract (OpenAPI spec) for Sprint N stories
  2. Frontend builds against contract with mock responses
  3. Integration builds connectors against external API specs (or mocks)
  4. Data creates schema to support the contract's data model
  5. Mid-sprint: integration test — connect real implementations
  6. Sprint end: all workstreams converge for demo
```

---

## 8. Definition of Ready Checklist

Every story must pass this checklist before entering a sprint. The CPO and CXO validate readiness at sprint planning.

### 8.1 Per-Story Checklist

| #   | Criterion                                                           | Verified By |
| --- | ------------------------------------------------------------------- | ----------- |
| 1   | Acceptance criteria defined in Given/When/Then format               | CPO         |
| 2   | Prototype or wireframe available (S2 reference)                     | CXO         |
| 3   | Data entities identified and mapped to Oracle schema (A2 reference) | CDO         |
| 4   | API contracts defined (request/response format, endpoints)          | CDO         |
| 5   | Dependencies resolved or mitigated (no hard blockers)               | CPO         |
| 6   | Story points estimated (Fibonacci: 1, 2, 3, 5, 8, 13)               | Team        |
| 7   | Sprint assigned                                                     | CPO         |
| 8   | Module mapping confirmed (M01-M33)                                  | CDO         |
| 9   | Business rules referenced (BR-xxx from A1)                          | CPO         |
| 10  | Process mapping confirmed (P01-P13 from A3)                         | CXO         |

### 8.2 Current Readiness Status

| Sprint | Stories | Ready | Needs Refinement | Blocked |
| ------ | ------- | ----- | ---------------- | ------- |
| S0     | 4       | 4     | 0                | 0       |
| S1     | 7       | 7     | 0                | 0       |
| S2     | 7       | 7     | 0                | 0       |
| S3     | 9       | 9     | 0                | 0       |
| S4     | 18      | 14    | 4                | 0       |
| S5     | 9+      | 7     | 2                | 0       |
| S6+    | 16      | 8     | 8                | 0       |

**Notes on Needs Refinement**:

- S4: E05-004 (multi-compare) needs UI wireframe finalization; E11-006 (error recovery) needs dead letter queue design; E03-007, E03-009 need Factor Control integration spec
- S5: E08-001 needs ES aggregation query design; E07-001 needs map library selection finalized
- S6+: HC Portfolio stories (E06) need Soyeon persona validation; E08-006 needs schedule engine design

---

## 9. Release Criteria

### 9.1 MVP v1.0 — "Plan Without Fear" (Target: May 26, 2026)

| #   | Criterion                       | Measure                                                     | Target                              | Owner |
| --- | ------------------------------- | ----------------------------------------------------------- | ----------------------------------- | ----- |
| 1   | All Must-Have stories completed | Story completion rate                                       | 100% of E01+E03+E04+E11+E13 stories | CPO   |
| 2   | Automated test coverage         | Code coverage on critical paths                             | >= 80%                              | CDO   |
| 3   | System Usability Scale          | SUS score from usability testing (5+ planners)              | >= 68                               | CXO   |
| 4   | Zero critical bugs              | P0/P1 bugs in production backlog                            | 0 open                              | QA    |
| 5   | Concurrent editing reliability  | Data loss events in 10 concurrent editing sessions          | 0 data loss                         | QA    |
| 6   | Delta sync accuracy             | Correct delta detection rate                                | >= 95%                              | QA    |
| 7   | Performance baseline            | Page load, search, report generation (200 concurrent users) | < 3s response time                  | CDO   |
| 8   | End-to-end demo                 | Full Jisoo persona workflow demonstrated to Samsung         | < 45 minutes                        | CPO   |
| 9   | Security review                 | No critical/high vulnerabilities (OWASP Top 10)             | Pass                                | CDO   |
| 10  | QA deployment verified          | MVP deployed and accessible via Samsung VPN                 | Operational                         | CDO   |

### 9.2 v1.1 — "See the Full Picture" (Target: June 23, 2026)

| #   | Criterion                     | Measure                                                   | Target               | Owner |
| --- | ----------------------------- | --------------------------------------------------------- | -------------------- | ----- |
| 1   | Should-Have stories completed | E02+E05+E07+E10 stories done                              | 100%                 | CPO   |
| 2   | Simulation accuracy           | Simulation clone matches source roadmap data exactly      | 100% match           | QA    |
| 3   | World map rendering           | Map loads with 5 sites and real-time data                 | < 3s load time       | FE    |
| 4   | Factor Control cross-view     | Filters persist across P/M Planner, Roadmap, Analysis     | Verified in 3+ views | QA    |
| 5   | Performance (scale test)      | Response with 20-30 concurrent users + simulation queries | < 3s response time   | CDO   |
| 6   | User satisfaction             | SUS score from expanded pilot (20-30 users)               | >= 72                | CXO   |

### 9.3 v1.2 — "Operate & Report" (Target: July 2026)

| #   | Criterion                    | Measure                                                | Target               | Owner |
| --- | ---------------------------- | ------------------------------------------------------ | -------------------- | ----- |
| 1   | Could-Have stories completed | E06+E08+E12 stories done                               | >= 80%               | CPO   |
| 2   | HC Portfolio validation      | Soyeon persona end-to-end workflow verified            | 100% task completion | CXO   |
| 3   | Report delivery              | Scheduled reports delivered on time via email          | >= 95% delivery rate | QA    |
| 4   | Performance at scale         | 80+ concurrent users across all Samsung DS sites       | < 3s response time   | CDO   |
| 5   | Production deploy            | Prod environment live, data migrated, smoke tests pass | Operational          | CDO   |
| 6   | All sites onboarded          | Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung           | 5 sites active       | COO   |
| 7   | User acceptance              | UAT sign-off from Samsung DSR stakeholders             | Signed               | CPO   |

### 9.4 v2.0 — "AI-Powered Insights" (Phase 2, TBD)

| #   | Criterion                       | Measure                                         | Target          | Owner |
| --- | ------------------------------- | ----------------------------------------------- | --------------- | ----- |
| 1   | Samsung AI Services integration | API connection stable, auth working             | Operational     | CDO   |
| 2   | AI model validation             | AI-generated PIVOT accuracy vs. manual creation | >= 90% accuracy | CAO   |
| 3   | NLQ success rate                | Natural language queries correctly interpreted  | >= 80%          | CAO   |
| 4   | 3+ months production data       | Sufficient data for AI model training           | >= 3 months     | CDO   |
| 5   | User adoption                   | AI features used by >= 30% of analysts          | >= 30% adoption | CPO   |

---

## 10. Risk Register — Development Phase

| #   | Risk                                                     | Probability | Impact | Sprint(s) | Mitigation                                                              |
| --- | -------------------------------------------------------- | ----------- | ------ | --------- | ----------------------------------------------------------------------- |
| R1  | Samsung TA delays server provisioning beyond April       | Medium      | High   | S0        | Start with local dev + Docker; deploy to QA when servers ready          |
| R2  | N-PLM API documentation incomplete or changes            | High        | High   | S1, S3    | Engage Samsung integration team early; adapter pattern + mock endpoints |
| R3  | WebSocket concurrent editing performance across sites    | Medium      | High   | S2        | Operational transform algorithm; test with 200ms latency simulation     |
| R4  | Mendix 10 custom widget limitations for Gantt/grid       | Medium      | Medium | S2, S3    | React pluggable widgets as fallback; pre-validate xDHTML in Mendix 10   |
| R5  | PROMIS API access restricted or format changes           | Medium      | High   | S3        | Adapter pattern; test with mock PROMIS endpoint                         |
| R6  | Elasticsearch cluster sizing insufficient for simulation | Low         | Medium | S4        | Monitor in S1; scale up before S4                                       |
| R7  | Samsung scope changes during development                 | High        | Medium | All       | MoSCoW provides clear boundaries; new requests via RICE scoring         |
| R8  | Sprint 4 overload (89 SP)                                | High        | Medium | S4-S5     | Allow spillover to S5; re-plan at sprint boundary using actual velocity |
| R9  | Production server readiness (July) delayed               | Medium      | High   | S6+       | Continue on QA; plan prod migration as parallel task                    |
| R10 | Data migration integrity (QA → Prod)                     | Low         | High   | S6+       | Checksum validation; row count verification; rollback plan              |

---

## 11. Appendix

### 11.1 Module Reference (M01-M33)

| Module | Name                           | Epics                   |
| ------ | ------------------------------ | ----------------------- |
| M01    | Master Data Management         | E01                     |
| M02    | Organization Hierarchy         | E01, E06                |
| M03    | Version Engine (Shared)        | E01, E03, E04, E05      |
| M04    | Standard PM Engine             | E01                     |
| M05    | Factor Control (Cross-cutting) | E03, E05, E07, E08, E10 |
| M06    | P/M Planner Engine             | E03, E04                |
| M07    | WebSocket Collaboration Layer  | E03                     |
| M08    | Approval Workflow Engine       | E03, E04, E12           |
| M09    | Roadmap & Versioning Engine    | E04, E05                |
| M10    | Project Management             | E02                     |
| M11    | Simulation Engine              | E05                     |
| M12    | HeadCount Portfolio            | E06                     |
| M13    | Gap Analysis Engine            | E06                     |
| M14    | World Map & Navigation         | E07                     |
| M15    | Site Statistics Aggregation    | E07                     |
| M20    | Analysis & Reporting Engine    | E08                     |
| M21    | Gap Reporting Dashboard        | E08                     |
| M22    | AI Analytics Engine            | E09                     |
| M30    | PROMIS Connector               | E04, E11                |
| M31    | N-PLM / SMDM / GHRP Connector  | E01, E02, E11           |
| M32    | Smart Notification Engine      | E03, E04, E08, E12      |
| M33    | Infrastructure & Sync Engine   | E11, E13                |

### 11.2 Process Reference (P01-P13)

| Process | Name                            | Primary Epics      |
| ------- | ------------------------------- | ------------------ |
| P01     | Master Data Management          | E01                |
| P02     | Standard PM Revision Management | E01                |
| P03     | Project Lifecycle Management    | E02                |
| P04     | Actual PM Recording             | E02, E08           |
| P05     | P/M Plan Editing (Concurrent)   | E03                |
| P06     | Conflict Detection & Resolution | E03                |
| P07     | Roadmap Version Management      | E04, E05           |
| P08     | Approval Workflow               | E03, E04, E12      |
| P09     | Analysis & Reporting            | E08, E09, E10      |
| P10     | Resource Simulation             | E05                |
| P11     | HeadCount Portfolio Management  | E06                |
| P12     | System Integration & Sync       | E01, E02, E04, E11 |
| P13     | Infrastructure & Monitoring     | E07, E13           |

### 11.3 Entity Reference (28 Core Entities)

| #   | Entity            | Oracle Table            | ES Index        | Primary Module |
| --- | ----------------- | ----------------------- | --------------- | -------------- |
| 1   | Organization      | iris_organization       | iris_org        | M02            |
| 2   | Site              | iris_site               | iris_org        | M02            |
| 3   | Division          | iris_division           | iris_org        | M02            |
| 4   | Department        | iris_department         | iris_org        | M02            |
| 5   | Team              | iris_team               | iris_org        | M02            |
| 6   | Employee          | iris_employee           | iris_employee   | M01            |
| 7   | SkillProfile      | iris_skill_profile      | iris_employee   | M01            |
| 8   | ProductionType    | iris_production_type    | iris_master     | M01            |
| 9   | Milestone         | iris_milestone          | —               | M01            |
| 10  | StandardPM        | iris_standard_pm        | iris_master     | M04            |
| 11  | PMDimension       | iris_pm_dimension       | —               | M04            |
| 12  | PMValue           | iris_pm_value           | iris_allocation | M04            |
| 13  | Project           | iris_project            | iris_project    | M10            |
| 14  | PMPlan            | iris_pm_plan            | iris_plan       | M06            |
| 15  | Allocation        | iris_allocation         | iris_allocation | M06, M09       |
| 16  | RoadmapVersion    | iris_roadmap_version    | —               | M09            |
| 17  | Simulation        | iris_simulation         | —               | M11            |
| 18  | FactorControlSet  | iris_factor_control     | —               | M05            |
| 19  | StaffingTarget    | iris_staffing_target    | —               | M12            |
| 20  | StaffingAction    | iris_staffing_action    | —               | M12            |
| 21  | ApprovalRequest   | iris_approval_request   | —               | M08            |
| 22  | Notification      | iris_notification       | —               | M32            |
| 23  | SyncJob           | iris_sync_job           | —               | M33            |
| 24  | SyncLog           | iris_sync_log           | —               | M33            |
| 25  | IntegrationStatus | iris_integration_status | —               | M31            |
| 26  | Revision          | iris_revision           | —               | M03            |
| 27  | AnalysisConfig    | iris_analysis_config    | —               | M20            |
| 28  | UserPreference    | iris_user_preference    | —               | M14            |

---

## Cross-References

### Upstream Documents (Input)

| Document               | Artifact                                             | Relationship                                          |
| ---------------------- | ---------------------------------------------------- | ----------------------------------------------------- |
| S4 User Stories        | 74 stories, 13 epics, 388 SP                         | Story source — this backlog operationalizes S4        |
| S5 Prioritization      | MoSCoW, RICE, MVP scope, 6-sprint plan               | Priority source — sprint allocation follows S5        |
| A1 Business Model      | Information flows, business rules (BR-001 to BR-113) | Business rules traced in Section 6                    |
| A2 Data Model          | 28 entities, Oracle schema, ES indices               | Entity mapping in Section 6 and Appendix 11.3         |
| A3 Process Model       | 13 processes (P01-P13)                               | Process mapping in Section 6 and Appendix 11.2        |
| A4 Architecture Design | Modules M01-M33, Widgets W01-W05                     | Module mapping throughout all sections                |
| S2 Prototype Specs     | 10 screens, design system                            | Wireframe reference for Definition of Ready           |
| S3 Concept Validation  | SUS 75.8, 5 concepts validated                       | UX findings incorporated in story acceptance criteria |

### Downstream Documents (Output)

| Document                            | Artifact                                         | Relationship                                  |
| ----------------------------------- | ------------------------------------------------ | --------------------------------------------- |
| Sprint Plan (per sprint)            | Sprint backlog, task assignments, daily standups | Generated from Section 3 at each sprint start |
| ADR (Architecture Decision Records) | Technical decisions during DEVELOP               | Triggered by implementation discoveries       |
| Gate 3 Evidence Package             | Test coverage, bug count, SUS, performance       | Measured against Section 9 release criteria   |

---

_This document completes the Analysis Handoff (A1-A5). The Development Team is authorized to begin Sprint 0 on April 1, 2026._

_Part of IRIS — Amoza AX Transformation Framework v2.0.0_
_CXO Analysis Handoff, March 2026_
