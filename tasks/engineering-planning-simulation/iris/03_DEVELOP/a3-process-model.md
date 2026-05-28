# A3 — Process Model Specification

> **IRIS — Intelligent Resource Information System**
> **Customer**: Samsung Electronics DS Division
> **AX Phase**: DEVELOP — Analysis Handoff
> **Owner**: CXO + CDO
> **Date**: 2026-03-22
> **Status**: Complete
> **Ref**: AX Guide A3 — Process Modeling

---

## Table of Contents

1. [Process Landscape Map](#1-process-landscape-map)
2. [Detailed Process Flows](#2-detailed-process-flows)
3. [As-Is to To-Be Analysis](#3-as-is-to-to-be-analysis)
4. [State Machines](#4-state-machines)
5. [Concurrent Edit Sequence Diagram](#5-concurrent-edit-sequence-diagram)
6. [Integration Sequence Diagrams](#6-integration-sequence-diagrams)
7. [CRUD Matrix](#7-crud-matrix)
8. [Process Metrics](#8-process-metrics)
9. [Gantt Widget Data Flow](#9-gantt-widget-data-flow-xdhtml)
10. [ECharts Widget Data Flow](#10-echarts-widget-data-flow)
11. [Definition of Done](#11-definition-of-done)

---

## 1. Process Landscape Map

```
+===========================================================================+
|                     IRIS Process Landscape (13 Processes)                  |
|                                                                           |
|  PLANNING PROCESSES            MANAGEMENT PROCESSES                       |
|  +--------------------------+  +----------------------------+             |
|  | P01  P/M Planning        |  | P05  Version Management    |             |
|  |   Concurrent edit, merge |  |   Lifecycle, diff engine    |             |
|  | P02  Roadmap Management  |  | P06  Approval Workflow      |             |
|  |   Version-controlled     |  |   Submit, approve, reject   |             |
|  | P03  Resource Simulation |  | P07  Master Data Sync       |             |
|  |   What-if scenarios      |  |   N-PLM daily import        |             |
|  | P04  HeadCount Planning  |  +----------------------------+             |
|  |   Gap analysis, actions  |                                             |
|  +--------------------------+                                             |
|                                                                           |
|  ANALYSIS PROCESSES            INTEGRATION PROCESSES                      |
|  +--------------------------+  +----------------------------+             |
|  | P08  Ad-Hoc Analysis     |  | P11  PROMIS Delta Sync     |             |
|  |   On-demand dashboards   |  |   Changed projects only     |             |
|  | P09  Periodic Reporting  |  | P12  N-PLM Sync             |             |
|  |   Scheduled delivery     |  |   Master data refresh       |             |
|  | P10  AI Reporting        |  | P13  Smart Notify            |             |
|  |   Samsung AI generation  |  |   Email alerts & delivery   |             |
|  +--------------------------+  +----------------------------+             |
+===========================================================================+
```

### Process Category Summary

| Category        | IDs                | Primary Actors               | Frequency            |
| --------------- | ------------------ | ---------------------------- | -------------------- |
| **Planning**    | P01, P02, P03, P04 | Jisoo (Planner), Soyeon (HR) | Daily to Quarterly   |
| **Management**  | P05, P06, P07      | Minho (Manager), System      | Per-save to Daily    |
| **Analysis**    | P08, P09, P10      | Eunji (Analyst)              | On-demand to Monthly |
| **Integration** | P11, P12, P13      | System (automated)           | On-event to Daily    |

### Process Dependency Graph

```
P07 (N-PLM Sync)
  |
  | master data feeds all planning
  v
P01 (P/M Planning) -----> P05 (Version Mgmt) -----> P06 (Approval Flow)
P02 (Roadmap Mgmt) -----> P05 (Version Mgmt) -----> P06 (Approval Flow)
P03 (Simulation) -------> P05 (Version Mgmt)               |
P04 (HC Planning) -------> P06 (Approval Flow)              |
                                                             v
                                                      P11 (PROMIS Delta Sync)
                                                             |
                                                             v
                                                      P13 (Smart Notify)
                                                             ^
P08 (Ad-Hoc Analysis) -----> ES Query                       |
P09 (Periodic Reporting) --> ES Query --> P13 (Smart Notify) |
P10 (AI Reporting) ---------> Samsung AI Service             |

P12 (N-PLM Sync) = bidirectional variant of P07
```

---

## 2. Detailed Process Flows

### P01: Standard P/M Planning

**Purpose**: Create and edit monthly personnel/project allocation plans with concurrent multi-user editing support.

**Actors**: Jisoo (Planner), Minho (Manager)
**Trigger**: Monthly planning cycle begins, or Planner needs to modify allocations
**Frequency**: Daily during planning cycles (typically first week of month)
**Input**: Current approved P/M plan version, master data (employees, projects, sites)
**Output**: New draft version with allocations, submitted for approval

```
Start
  |
  v
[Planner opens P/M plan for site + dept + month]
  |
  v
<Plan exists for this site/dept/month?>
  |NO                           |YES
  v                              v
[Create new PMPlan entity]     [Load PMPlan]
[Status = Editing]               |
  |                              v
  +----->  [Load latest approved version (or empty)]
                |
                v
           <Is plan locked by another user?>
             |YES                      |NO
             v                          v
           [Show concurrent edit      [Acquire soft lock]
            notice: "User X is       [Set lock_owner_id]
            also editing"]            [Set lock_timestamp]
           [Allow edit anyway]          |
             |                          v
             +-------> [Render xDHTML Gantt widget]
                        [Show employee rows x project columns x month]
                          |
                          v
                       [User edits allocations]
                        - Drag task bars (change hours/days)
                        - Add new employee-project assignment
                        - Remove assignment
                        - Modify allocation percentage
                          |
                          v
                       [User clicks Save]
                          |
                          v
                       <Has base version changed since load?>
                         |NO                        |YES
                         v                           v
                       [Save as new Draft version] [Run auto-merge algorithm]
                       [PMPlanVersion created]       |
                         |                           v
                         |                   <Merge conflicts exist?>
                         |                     |NO                |YES
                         |                     v                   v
                         |                  [Save merged         [Show Diff Viewer (W03)]
                         |                   version]            [Highlight conflicting cells]
                         |                     |                   |
                         |                     |                   v
                         |                     |              <User choice per conflict?>
                         |                     |               |Pass           |Overwrite
                         |                     |               v                v
                         |                     |           [Keep other       [Keep user's
                         |                     |            user's value]     value, discard
                         |                     |               |              other's]
                         |                     |               |                |
                         +------+--------------+---------------+----------------+
                                |
                                v
                         [Draft Version Saved in Oracle]
                         [Trigger ES sync via SyncQueue]
                                |
                                v
                         <User role?>
                          |Planner                |Manager
                          v                        v
                       [Save as Draft]          [Save as Permanent]
                       [Status = Draft]         [Skip approval]
                          |                        |
                          v                        |
                       <Submit for approval?>      |
                        |NO         |YES           |
                        v            v             |
                      End     [Create ApprovalRequest]
                              [Status = Pending]   |
                              [Email to Manager]   |
                                    |              |
                                    v              |
                              (P06: Approval) -----+
                                    |
                                    v
                              [Permanent Version Created]
                                    |
                                    v
                              (P11: PROMIS Delta Sync)
                                    |
                                    v
                                  End
```

**Business Rules**:

- BR-P01-01: Soft lock expires after 30 minutes of inactivity
- BR-P01-02: Auto-merge operates at cell level (employee + project + period = cell key)
- BR-P01-03: Conflict detection must complete within 2 seconds
- BR-P01-04: All conflict resolutions logged with original values from both users
- BR-P01-05: Allocation percentage per employee across all projects must not exceed 100% per period
- BR-P01-06: Manager can save directly as Permanent (bypasses approval)
- BR-P01-07: WebSocket broadcasts save events to concurrent editors in real time

**Error Handling**:

- Lock acquisition fails (stale lock): System forces lock release after 30 min timeout, retry
- Save fails (Oracle error): Show error toast, retain in-memory data, allow retry
- ES sync fails: Queued in SyncQueue, retries automatically, does not block user
- WebSocket disconnected: Fallback to polling (30s interval), show "offline" indicator

---

### P02: Resource Roadmap Management

**Purpose**: Manage long-term resource allocation plans across projects with versioned snapshots and diff capability.

**Actors**: Jisoo (Planner), Minho (Manager)
**Trigger**: Annual/quarterly planning cycle, or need to rebalance allocations
**Frequency**: Weekly during active planning, monthly otherwise
**Input**: Current approved roadmap version, master data
**Output**: New roadmap version (Draft or Approved)

```
Start
  |
  v
[Planner opens Roadmap for site + BU + fiscal year]
  |
  v
[View current approved version in Gantt + Table view]
  |
  v
[Planner clicks "Create New Version"]
  |
  v
[System clones current version data into new Draft]
[RoadmapVersion created: version_type = Draft]
[All RoadmapProjectAllocation records cloned]
  |
  v
[Planner edits in Gantt view]
  | - Add/remove project allocations
  | - Adjust employee assignments (drag-drop)
  | - Modify timelines (drag task bars)
  | - Change allocation percentages
  |
  v
[Save Draft]
[Version saved to Oracle, SyncQueue entry created]
  |
  v
<View diff before submitting?>
  |NO                    |YES
  |                       v
  |                 [Open Diff Viewer (W03)]
  |                 [Compare: Draft vs Current Approved]
  |                 [Show: ADDED (green), REMOVED (red), MODIFIED (yellow)]
  |                 [Summary: X added, Y removed, Z modified]
  |                       |
  +<------<--- <Satisfied?>
  |             |NO
  |             v
  |          [Continue editing]
  |             |
  |             +-----> (back to edit step)
  |
  v (YES or skipped diff)
[Submit for Approval]
  |
  v
(P06: Approval Flow)
  |
  +-------+--------+
  |                 |
  v                 v
Approved          Rejected
  |                 |
  v                 v
[Set as Active   [Return to Draft]
 Version]        [Planner notified with
[Archive prev     rejection reason]
 approved]          |
  |                 v
  v              (back to edit step)
[Detect changed projects via Diff Engine]
[List: added_projects, modified_projects, removed_projects]
  |
  v
(P11: PROMIS Delta Sync — changed projects only)
  |
  v
End
```

**Business Rules**:

- BR-P02-01: Only one Draft version per roadmap at a time
- BR-P02-02: Cloning copies all allocation records but assigns new PKs
- BR-P02-03: Diff engine matches by composite key (employee_id + project_id + period)
- BR-P02-04: Only changed projects are sent to PROMIS (not full roadmap)
- BR-P02-05: Archived versions are immutable and retained for audit

**Error Handling**:

- Clone fails (Oracle space): Alert admin, show error, abort clone
- Diff engine timeout (> 5s): Show partial results with warning
- Approval timeout (> 48 hours): Auto-escalation notification

---

### P03: Resource Simulation

**Purpose**: Run what-if scenarios by cloning roadmap data into simulation space, enabling risk-free exploration.

**Actors**: Jisoo (Planner)
**Trigger**: Need to evaluate alternative staffing plans before committing to roadmap changes
**Frequency**: Weekly to monthly, more during major reorg events
**Input**: Approved roadmap version
**Output**: Simulation versions with comparison data, optional promotion to roadmap

```
Start
  |
  v
[Planner selects approved Roadmap Version]
  |
  v
[Click "Create Simulation"]
  |
  v
[System clones roadmap data into ResourceSimulation]
[SimulationVersion V1 created]
[All SimulationAllocation records cloned from source]
[delta_vs_roadmap = 0 for all records initially]
  |
  v
[Planner names simulation, sets scenario description]
[e.g., "What if 5 engineers move from NAND to HBM4?"]
  |
  v
[Edit simulation in Gantt view]
  | - Move resources between projects
  | - Add/remove allocations
  | - Test alternative staffing configurations
  | - System auto-calculates delta_vs_roadmap
  |
  v
[Save Simulation Version]
  |
  v
<Create another variant?>
  |YES                          |NO
  v                              v
[Clone current version         [View comparison dashboard]
 as new variant V(n+1)]          |
  |                              v
[Edit variant]                 [ECharts: Simulation vs Roadmap]
  |                            [  - Stacked bar: headcount comparison]
  |                            [  - Delta waterfall chart]
  +------>                     [Gantt: Overlay view (baseline + sim)]
                               [Delta Table: employees affected, hours shifted]
                                 |
                                 v
                           <Promote to Roadmap?>
                             |NO                 |YES
                             v                    v
                           [Keep as             [Create new Roadmap Draft]
                            simulation          [Copy SimulationAllocation]
                            for reference]      [  -> RoadmapProjectAllocation]
                             |                    |
                             v                    v
                           End               (P02: Roadmap process
                                              from Submit step)
```

**Business Rules**:

- BR-P03-01: Simulations never trigger PROMIS sync (isolated sandbox)
- BR-P03-02: delta_vs_roadmap auto-calculated on every save
- BR-P03-03: Promotion to roadmap creates a new Draft version requiring approval
- BR-P03-04: Simulation status: Draft -> Running -> Completed (optional promotion)
- BR-P03-05: Multiple variants can exist per simulation

**Error Handling**:

- Clone fails: Show error, allow retry
- Comparison data too large (> 10,000 records): Paginate results, show summary first

---

### P04: HeadCount Portfolio Planning

**Purpose**: Manage workforce staffing plans with gap analysis between current headcount and targets.

**Actors**: Soyeon (HR Planner), Minho (Manager)
**Trigger**: Quarterly headcount review cycle
**Frequency**: Quarterly (primary), monthly adjustments
**Input**: Current headcount data (from master data), previous HC plan
**Output**: Approved staffing plan with gap actions

```
Start
  |
  v
[HR Planner opens HC Portfolio for site + dept + quarter]
  |
  v
[View current headcount matrix: grade x skill_category]
[Data source: Employee table aggregated by grade + skill_category]
  |
  v
[Enter target headcount numbers per cell]
  |
  v
[System calculates gaps: target_count - current_count = gap]
[Positive gap = need more, Negative gap = surplus]
  |
  v
[Assign actions per gap entry]
  | - Hire: Open new positions (positive gap)
  | - Transfer: Internal movement from other dept/site (positive gap)
  | - Retain: Ensure key talent stays (zero gap, retention risk)
  | - Reduce: Natural attrition or managed reduction (negative gap)
  |
  v
[Save HeadCountPlan]
[HeadCountEntry records created/updated]
  |
  v
[View analytics dashboard]
  | - ECharts stacked bar: Current vs Planned vs Target by dept
  | - ECharts trend line: Historical headcount (8 quarters)
  | - ECharts pie: Gap distribution by action type
  | - ECharts heatmap: Grade x SkillCategory gap severity
  |
  v
[Submit for approval]
  |
  v
(P06: Approval Flow)
  |
  v
End
```

**Business Rules**:

- BR-P04-01: Gap = target_count - current_count (system-calculated, not editable)
- BR-P04-02: Every positive gap must have an action assigned (Hire or Transfer)
- BR-P04-03: Total planned_count must equal current_count + net actions
- BR-P04-04: HC plans are quarterly but can be adjusted monthly
- BR-P04-05: Current headcount auto-populated from master data (Employee entity)

**Error Handling**:

- Stale headcount data: Show "Last synced" timestamp, warn if > 24 hours old
- Arithmetic validation: If planned_count does not reconcile with actions, block save

---

### P05: Version Management

**Purpose**: Create, store, and compare immutable version snapshots for all planning artifacts.

**Actors**: System (automated), all user roles (consumers)
**Trigger**: Any save action on P/M plan, roadmap, or simulation
**Frequency**: Multiple times daily
**Input**: Changed allocation data
**Output**: New version record with full snapshot

```
Start
  |
  v
[User saves plan/roadmap/simulation (trigger from P01/P02/P03)]
  |
  v
[Create new version entity]
  | - PMPlanVersion, RoadmapVersion, or SimulationVersion
  | - version_number auto-incremented
  | - version_type = Draft (default)
  | - parent_version_id = previous version ID (for diff chain)
  |
  v
[Snapshot all child records under new version]
  | - PMEntry records linked to PMPlanVersion
  | - RoadmapProjectAllocation records linked to RoadmapVersion
  | - SimulationAllocation records linked to SimulationVersion
  |
  v
[Auto-generate change_summary]
  | - Run diff: new version vs parent version
  | - Count: X added, Y removed, Z modified
  | - Store summary text on version entity
  |
  v
[Insert SyncQueue entry for ES reindex]
  |
  v
End
```

#### P05 Sub-Process: Diff Engine

```
[User requests diff: Version A vs Version B]
  |
  v
[Load all allocation records for Version A]
[Load all allocation records for Version B]
  |
  v
[Match records by composite key: (employee_id + project_id + period)]
  |
  v
[Classify each record:]
  +-- ADDED:     in B but not in A (new allocation)
  +-- REMOVED:   in A but not in B (deleted allocation)
  +-- MODIFIED:  in both, but values differ (hours, percentage changed)
  +-- UNCHANGED: in both, values identical
  |
  v
[Render in Diff Viewer Widget (W03)]
  | - Side-by-side table view
  | - Color coding: green = ADDED, red = REMOVED, yellow = MODIFIED
  | - Summary stats: X added, Y removed, Z modified
  |
  v
[Return diff data structure for downstream use]
  | - P11 (PROMIS delta detection)
  | - P06 (Approval review)
  |
  v
End
```

**Business Rules**:

- BR-P05-01: Approved versions are immutable (no edits permitted)
- BR-P05-02: Version numbers auto-increment per parent entity (V1, V2, V3...)
- BR-P05-03: Diff comparison allowed between any two versions of the same entity
- BR-P05-04: parent_version_id maintains a linked list for traversal
- BR-P05-05: change_summary auto-generated, max 500 characters
- BR-P05-06: PROMIS_Synced flag set independently after successful delta sync

**Error Handling**:

- Diff on very large versions (> 50,000 records): Paginate, show progress indicator
- Version snapshot partial failure: Roll back entire version creation (ACID)

---

### P06: Approval Workflow

**Purpose**: Route planning artifacts through manager review with approve/reject decisions.

**Actors**: Jisoo (Planner, requester), Minho (Manager, approver)
**Trigger**: Planner submits a Draft version for approval
**Frequency**: Multiple times weekly during planning cycles
**Input**: Draft version of P/M plan, roadmap, or HC plan
**Output**: Approved (Permanent) or Rejected version

```
Requester                   System                       Approver
    |                          |                             |
[Submit for Approval] ------->|                             |
    |                    [Create ApprovalRequest]            |
    |                    [entity_type = PMPlan/Roadmap/HC]   |
    |                    [status = Pending]                  |
    |                    [Record requester_id, approver_id]  |
    |                          |                             |
    |                    [Send email notification] --------->|
    |                    [Include: entity name, version,     |
    |                     change summary, deep link to IRIS] |
    |                          |                             |
    |                          |                        [Open IRIS]
    |                          |                        [View pending approvals list]
    |                          |                             |
    |                          |                        [Select approval request]
    |                          |                        [View Diff: submitted vs
    |                          |                         previous approved version]
    |                          |                             |
    |                          |                        <Decision?>
    |                          |                         |Approve        |Reject
    |                          |                         v                v
    |                    [Update ApprovalRequest] <--[Approve]     [Reject + Comment]
    |                    [Record resolved_date]                   [Comment mandatory]
    |                          |                                       |
    |                    <Approved?>                                    |
    |                     |YES                    |NO                   |
    |                     v                        v                    |
    |              [Mark version as Permanent]  [Return version to     |
    |              [Archive previous approved]   Draft status]         |
    |              [Trigger P11: PROMIS sync]   [Send rejection email  |
    |                     |                      with comment to       |
    |                     |                      requester]            |
    |                     v                        |                   |
    |              [Send approval email            |                   |
    |               to requester]                  |                   |
    |<-----------------------------------------+---+                   |
    |                                                                  |
  End                                                                  |
```

**Business Rules**:

- BR-P06-01: Rejection requires a mandatory comment (comments field non-empty)
- BR-P06-02: Approval must be completed within 48 hours or auto-escalated
- BR-P06-03: Approver sees full diff before making decision
- BR-P06-04: On approval, previous Approved version moves to Archived status
- BR-P06-05: Approval creates an ApprovalHistory record for audit trail
- BR-P06-06: Approver determined by department hierarchy (Manager of the dept)

**Error Handling**:

- Approver unavailable (out of office): Delegate mechanism or escalation after 48h
- Email delivery failure: Log error, show in-app notification as fallback
- Concurrent approval (two approvers on same request): First write wins, second sees conflict

---

### P07: Master Data Sync (N-PLM)

**Purpose**: Synchronize master data (employees, projects, sites, org structure) from N-PLM into IRIS.

**Actors**: System (scheduled), System Admin (monitoring)
**Trigger**: Scheduled daily at 02:00 AM, or manual trigger by admin
**Frequency**: Daily
**Input**: N-PLM REST API response (Projects, Products, OrgStructure, Employees, Sites)
**Output**: Updated master data in Oracle, ES reindex triggered

```
+------- Scheduled (Daily, 02:00 AM) --------+
|                                             |
|  [Trigger N-PLM sync job]                   |
|       |                                     |
|       v                                     |
|  [Call N-PLM REST API]                      |
|  [Fetch endpoints:]                         |
|  [  GET /api/projects     (all active)]     |
|  [  GET /api/employees    (all active)]     |
|  [  GET /api/org-units    (hierarchy)]      |
|  [  GET /api/sites        (all)]            |
|       |                                     |
|       v                                     |
|  <API response OK?>                         |
|    |NO                   |YES               |
|    v                      v                 |
|  [Log error]           [Compare with        |
|  [Alert admin]          Mendix DB records]  |
|  [Retry in 1h]              |               |
|    |                        v               |
|    |    +-- New records ----> INSERT         |
|    |    +-- Changed records -> UPDATE        |
|    |    +-- Missing records -> SOFT DELETE   |
|    |    |   (set is_active = false)          |
|    |    |                                    |
|    |    v                                    |
|    |  [Create SyncRecord]                    |
|    |  [target_system = 'N-PLM']              |
|    |  [Log: records_inserted,                |
|    |   records_updated, records_deleted]      |
|    |       |                                 |
|    |       v                                 |
|    |  [Trigger ES full reindex]              |
|    |  [Master data change affects ALL        |
|    |   denormalized documents]               |
|    |       |                                 |
|    |       v                                 |
|    +-> End                                   |
+---------------------------------------------+
```

**Business Rules**:

- BR-P07-01: N-PLM is the master for employee, project, site, and org data
- BR-P07-02: Never hard-delete master data; use soft delete (is_active = false)
- BR-P07-03: Master data changes trigger full ES reindex (master data is denormalized into every document)
- BR-P07-04: Sync runs daily at 02:00 AM to minimize user impact
- BR-P07-05: Retry up to 3 times with 1-hour interval on API failure

**Error Handling**:

- N-PLM API unavailable: Retry 3 times (1h interval), alert admin, IRIS continues with existing data
- Partial response (some endpoints fail): Process successful responses, log failures separately
- Data validation error (invalid FK reference): Skip record, log warning, continue sync

---

### P08: Ad-Hoc Analysis

**Purpose**: Enable on-demand multi-dimensional analysis with interactive charts and drill-down.

**Actors**: Eunji (Analyst), Minho (Manager)
**Trigger**: User opens Analysis module and builds a query
**Frequency**: Multiple times daily per analyst
**Input**: Dimension/measure selection, Factor Control filters
**Output**: Interactive ECharts visualization with drill-down

```
Start
  |
  v
[Analyst opens Analysis Reporting module]
  |
  v
[Select analysis dimensions]
  | - Available: site, department, business_unit, division
  |             project, project_type, product_family
  |             employee, team, job_grade, skill_category
  |             period (month, quarter, year)
  |
  v
[Select measures]
  | - Available: headcount, allocation_pct, allocated_hours
  |             planned_days, actual_days, gap, utilization_pct
  |
  v
[Select chart type]
  | - Bar (stacked/grouped), Line, Pie, Heatmap,
  |   Treemap, Scatter, World Map, Pivot Table
  |
  v
[Apply Factor Control filters]
  | - Load saved FactorControlSet or create new
  | - Filter dimensions: site IN (...), dept = ..., period BETWEEN ...
  |
  v
[System builds Elasticsearch aggregation query]
  | - Map dimensions to ES field paths
  | - Map measures to ES metrics (sum, avg, count, cardinality)
  | - Apply Factor Control as ES query filters
  |
  v
[Execute POST to ES cluster via M33 REST client]
  |
  v
[Transform ES aggregation response to ECharts option format]
  | - Build xAxis, yAxis, series arrays
  | - Apply number formatting, labels, colors
  |
  v
[ECharts widget renders chart]
[chart.setOption(option)]
  |
  v
<User clicks chart element (drill-down)?>
  |NO                     |YES
  v                        v
End (or export)       [Capture click event: dimension value, level]
                      [Add sub-dimension to query]
                      [Re-execute ES aggregation]
                      [Re-render chart with deeper level]
                           |
                           v
                      (loop back to render step)
```

**Business Rules**:

- BR-P08-01: All analytical reads go to Elasticsearch (never Oracle for dashboards)
- BR-P08-02: Factor Control filters persist per user session
- BR-P08-03: Drill-down hierarchy: Region -> Country -> Site -> BU -> Dept -> Team -> Employee
- BR-P08-04: Maximum 3 dimensions and 2 measures per chart to avoid visual overload
- BR-P08-05: Results capped at 10,000 buckets per aggregation

**Error Handling**:

- ES query timeout (> 10s): Show "Query too complex" message, suggest adding filters
- ES cluster unavailable: Show cached last result with "stale data" warning
- Empty result set: Show "No data matches your filters" with suggestion to broaden filters

---

### P09: Periodic Reporting

**Purpose**: Generate and deliver scheduled reports to configured recipients via email.

**Actors**: System (automated), Eunji (Analyst, configuration)
**Trigger**: NotificationSchedule entity (cron-like schedule)
**Frequency**: Weekly (Monday 08:00 AM) or Monthly (1st of month)
**Input**: Report configuration (dimensions, measures, filters, recipients)
**Output**: Report stored in ES, email delivered

```
Start
  |
  v
[Scheduled trigger fires: NotificationSchedule entity]
[e.g., Every Monday 08:00 AM for weekly report]
  |
  v
[Load report configuration]
  |-- dimensions: site, department, project_type
  |-- measures: headcount, allocation_pct, gap
  |-- filters: FactorControlSet reference
  |-- recipients: email address list
  |-- format: chart types, layout template
  |
  v
[Build ES aggregation query from config]
  |
  v
[Execute against Elasticsearch cluster]
  |
  v
<Query successful?>
  |NO                    |YES
  v                       v
[Log error]             [Generate report content]
[Retry once in 10 min]   |-- ECharts rendered to PNG (server-side)
[If retry fails,          |-- Data tables formatted as HTML
 alert admin]             |-- Summary text auto-generated
  |                       |
  v                       v
End (failed)            [Store report document in iris-analysis-report index]
                          |
                          v
                        (P13: Smart Notify)
                        [Send email to recipients]
                        [  Email body: summary + key metrics]
                        [  Attachment: report link to IRIS dashboard]
                          |
                          v
                        [Log delivery status per recipient]
                          |
                          v
                        End
```

**Business Rules**:

- BR-P09-01: Report configuration editable only by Analyst role
- BR-P09-02: Reports always use latest approved version data
- BR-P09-03: Report stored in ES for historical access and search
- BR-P09-04: Email includes deep link to interactive version in IRIS
- BR-P09-05: Delivery failures logged but do not block report generation

**Error Handling**:

- ES query failure: Retry once after 10 min, then alert admin
- Email delivery failure: Log per recipient, continue sending to others
- Report generation timeout (> 60s): Abort, alert admin

---

### P10: AI Reporting (Samsung AI)

**Purpose**: Generate AI-powered Excel PIVOT reports via Samsung AI Services.

**Actors**: Eunji (Analyst)
**Trigger**: Analyst clicks "Generate AI Report" in Analysis module
**Frequency**: Weekly to monthly, on-demand
**Input**: Aggregated data from ES, dimension configuration
**Output**: Formatted Excel file with PIVOT tables

```
Start
  |
  v
[Analyst clicks "Generate AI Report"]
  |
  v
[System gathers context:]
  |-- Current dimension selection and filters
  |-- ES aggregation result data (JSON)
  |-- Metadata: site names, dept names, period range
  |
  v
[Build AI request payload]
  |-- data: aggregated result set
  |-- dimensions: selected dimension list
  |-- measures: selected measure list
  |-- format: "Excel PIVOT"
  |-- language: "en" or "ko"
  |
  v
[POST to Samsung AI Services REST API]
  |
  v
<API response?>
  |Error/Timeout         |200 OK
  v                       v
[Show error message]    [Receive Excel file (binary)]
[Suggest retry or         |
 manual export]           v
  |                     [Store file temporarily]
  v                     [Show download link to Analyst]
End (failed)              |
                          v
                        [Analyst downloads Excel]
                          |
                          v
                        [Log AI report generation event]
                          |
                          v
                        End
```

**Business Rules**:

- BR-P10-01: AI reports are on-demand only (not scheduled)
- BR-P10-02: Data sent to Samsung AI is aggregated only (no raw employee PII)
- BR-P10-03: AI service call timeout: 30 seconds
- BR-P10-04: Generated file retained for 24 hours, then auto-deleted

**Error Handling**:

- Samsung AI unavailable: Show error, suggest manual Excel export as fallback
- Response too large (> 50MB): Suggest narrower filters
- Invalid AI response format: Log error, show generic failure message

---

### P11: PROMIS Delta Sync

**Purpose**: Send only changed project data to PROMIS after version approval (not full dataset).

**Actors**: System (automated, triggered by P06 approval)
**Trigger**: Version approval event in P06
**Frequency**: Per approval event (multiple times per week)
**Input**: Newly approved version, last PROMIS-synced version
**Output**: Delta payload sent to PROMIS, SyncRecord updated

```
[Triggered by: Version Approval (P06)]
  |
  v
[Load newly approved version V(n)]
  |
  v
[Find last PROMIS-synced version V(promis)]
[Query: SyncRecord WHERE target_system = 'PROMIS' AND sync_status = 'Success']
[ORDER BY sync_date DESC, LIMIT 1]
  |
  v
<V(promis) found?>
  |NO (first sync)        |YES
  v                        v
[Treat all records       [Run Diff Engine: V(n) vs V(promis)]
 as ADDED]                  |
  |                         v
  +-------> [Extract changed projects list]
               |-- added_projects:    [{project_id, allocation_data}, ...]
               |-- modified_projects: [{project_id, old_data, new_data}, ...]
               |-- removed_projects:  [{project_id}, ...]
                  |
                  v
               <Any changes?>
                |NO                    |YES
                v                       v
              [Log: "No changes       [Build delta payload JSON]
               to sync to PROMIS"]     |
              [Create SyncRecord:      v
               status = 'Success',   [POST to PROMIS REST API]
               changed_projects = []] [Endpoint: /api/resource-sync]
                |                    [Payload: {added, modified, removed}]
                |                      |
                |                      v
                |                   <API Response?>
                |                    |200 OK              |Error (4xx/5xx)
                |                    v                     v
                |              [Mark V(n) as            [Create SyncRecord:
                |               PROMIS_Synced]           status = 'Failed']
                |              [Set promis_synced=true]  [Log error_message]
                |              [Set promis_sync_date]    [Alert System Admin]
                |              [Create SyncRecord:         |
                |               status = 'Success']        v
                |                    |                   [Add to retry queue]
                |                    |                   [Max 3 attempts]
                |                    |                   [Backoff: 5m, 15m, 60m]
                +------+-------------+                     |
                       |                                   v
                       v                              <Retry successful?>
                     End                                |YES    |NO
                                                        v       v
                                                     [Mark    [Mark Failed]
                                                      Success] [Manual intervention
                                                      |        required]
                                                      v        |
                                                    End       End
```

**Business Rules**:

- BR-P11-01: Only changed projects are synced (delta, not full)
- BR-P11-02: Changes detected by Diff Engine comparing approved vs last PROMIS-synced
- BR-P11-03: Retry max 3 times with exponential backoff (5m, 15m, 60m)
- BR-P11-04: PROMIS_Synced flag is independent of version_type (set on Approved versions)
- BR-P11-05: If PROMIS is unavailable for > 24h, alert COO for manual coordination

**Error Handling**:

- PROMIS API error (4xx): Log payload validation error, do not retry (fix payload first)
- PROMIS API error (5xx): Retry with backoff
- Diff Engine failure: Fallback to full sync for this version, log warning
- Network timeout: Retry, include in next sync attempt

---

### P12: N-PLM Sync (Bidirectional)

**Purpose**: Bidirectional master data synchronization with N-PLM.

**Actors**: System (automated)
**Trigger**: Daily schedule (02:00 AM) for inbound; on-demand for outbound
**Frequency**: Daily (inbound), on-event (outbound)
**Input**: N-PLM REST API (inbound); IRIS changed records (outbound)
**Output**: Synchronized master data

```
+===== INBOUND (N-PLM -> IRIS) Daily 02:00 AM =====+
|                                                    |
|  [Same as P07 flow — see P07 for details]          |
|  [Inbound is the primary sync direction]           |
|                                                    |
+====================================================+

+===== OUTBOUND (IRIS -> N-PLM) On-Event ============+
|                                                     |
|  [Triggered when IRIS roadmap version approved]     |
|       |                                             |
|       v                                             |
|  [Detect changed projects in approved version]      |
|       |                                             |
|       v                                             |
|  [Build project update payload]                     |
|  [  project_id, resource_allocation_summary,        |
|  [  headcount_by_role, timeline_update]              |
|       |                                             |
|       v                                             |
|  [POST to N-PLM REST API: /api/project-resources]   |
|       |                                             |
|       v                                             |
|  [Log SyncRecord: target_system = 'N-PLM']          |
|       |                                             |
|       v                                             |
|  End                                                |
+=====================================================+
```

**Business Rules**:

- BR-P12-01: Inbound sync identical to P07 (N-PLM is master for employee/org data)
- BR-P12-02: Outbound sync sends resource allocation summaries per project
- BR-P12-03: Outbound triggered only on roadmap version approval (not P/M plan)
- BR-P12-04: Outbound sync is best-effort (failure does not block IRIS operations)

**Error Handling**:

- Same as P07 for inbound; same as P11 for outbound

---

### P13: Smart Notify

**Purpose**: Send email notifications for system events, approvals, and scheduled report delivery.

**Actors**: System (automated)
**Trigger**: Various system events (approval request, approval decision, report ready, sync failure)
**Frequency**: Event-driven, multiple times daily
**Input**: Event payload (recipient, subject, body template, data)
**Output**: Email delivered, delivery logged

```
Start
  |
  v
[Notification event received]
[Source: P06 (approval), P09 (report), P11 (sync), P07 (master data)]
  |
  v
[Load notification template by event_type]
  | - approval_request:  "New approval pending: {entity_name} {version}"
  | - approval_decision: "{entity_name} {approved/rejected} by {approver}"
  | - report_ready:      "Your {report_name} report is ready"
  | - sync_failure:      "PROMIS sync failed for {entity_name}"
  | - escalation:        "Approval overdue (48h): {entity_name}"
  |
  v
[Resolve recipients]
  | - From ApprovalRequest (requester or approver)
  | - From NotificationSchedule (configured email list)
  | - From System Admin list (for alerts)
  |
  v
[Build email content]
  | - Subject from template
  | - Body: HTML formatted with data values
  | - Include deep link to relevant IRIS page
  |
  v
[Send via email service (SMTP / SendGrid / Samsung mail)]
  |
  v
<Delivery successful?>
  |NO                     |YES
  v                        v
[Log failure]            [Log success]
[In-app notification     [Delivery timestamp recorded]
 as fallback]              |
  |                        v
  v                      End
End
```

**Business Rules**:

- BR-P13-01: All notifications include deep link to IRIS
- BR-P13-02: In-app notification created as fallback for every email
- BR-P13-03: Notification templates managed by System Admin
- BR-P13-04: Escalation notifications auto-trigger at 48h for pending approvals
- BR-P13-05: Recipients can configure notification preferences (email/in-app/both)

**Error Handling**:

- Email service unavailable: Queue notification, retry in 5 min
- Invalid email address: Log warning, skip recipient, continue with others
- Template not found: Use generic template, log error

---

## 3. As-Is to To-Be Analysis

### P01: P/M Planning — Sequential to Concurrent

| Aspect                | As-Is (PM Planner)                           | To-Be (IRIS)                                                       | Improvement                    |
| --------------------- | -------------------------------------------- | ------------------------------------------------------------------ | ------------------------------ |
| **Editing model**     | Sequential: one user locks plan, others wait | Concurrent: multiple users edit simultaneously with auto-merge     | Eliminates planning bottleneck |
| **Conflict handling** | Last save wins (data loss risk)              | Cell-level auto-merge + diff viewer + user choice (Pass/Overwrite) | Zero data loss                 |
| **Save mechanism**    | Single overwrite                             | Versioned snapshots, every save creates new version                | Full audit trail               |
| **Notification**      | None (user must check manually)              | WebSocket real-time push to concurrent editors                     | Instant awareness              |
| **Time to complete**  | 2-4 hours (waiting for lock)                 | 30-60 minutes (parallel editing)                                   | 60-75% faster                  |
| **Data format**       | Excel spreadsheet                            | Gantt widget (xDHTML) with drag-drop                               | Visual, intuitive              |

```
AS-IS: Sequential Lock Model
  Planner A opens plan --> LOCKS --> Planner B waits (30-120 min)
  Planner A saves -------> UNLOCKS --> Planner B opens --> edits --> saves
  Total time: 2-4 hours for 2 planners

TO-BE: Concurrent Edit Model
  Planner A opens plan --> soft lock (informational)
  Planner B opens plan --> concurrent notice --> edits in parallel
  Both save --> auto-merge --> resolve conflicts (if any) --> done
  Total time: 30-60 minutes for 2 planners
```

### P02: Roadmap Management — No Versioning to Full Lifecycle

| Aspect              | As-Is (PM Planner)         | To-Be (IRIS)                                                             | Improvement           |
| ------------------- | -------------------------- | ------------------------------------------------------------------------ | --------------------- |
| **Versioning**      | No version history         | Full version lifecycle: Draft -> PendingApproval -> Approved -> Archived | Complete audit trail  |
| **Diff capability** | Manual comparison in Excel | Automated diff engine with visual color-coded viewer                     | 95% faster comparison |
| **Rollback**        | Not possible               | Any previous version viewable and restorable                             | Risk reduction        |
| **Change tracking** | None                       | Every change recorded with who, when, what                               | Compliance ready      |
| **Approval**        | Email + verbal             | Structured workflow with mandatory review                                | Governance            |

```
AS-IS: Roadmap as Flat File
  Excel file --> email to manager --> verbal approval --> overwrite file
  No history, no diff, no audit trail

TO-BE: Version-Controlled Roadmap
  Draft V6 --> Diff View (V6 vs V5) --> Submit --> Manager reviews diff
  --> Approve --> V6 = Active, V5 = Archived --> Delta sync to PROMIS
  Full history: V1, V2, V3, V4, V5, V6 all preserved and comparable
```

### P11: PROMIS Sync — Full Sync to Delta

| Aspect               | As-Is (PM Planner)                          | To-Be (IRIS)                                            | Improvement                  |
| -------------------- | ------------------------------------------- | ------------------------------------------------------- | ---------------------------- |
| **Sync scope**       | Full dataset export on every sync           | Delta only: changed projects detected via diff engine   | 90-95% less data transferred |
| **Sync trigger**     | Manual or scheduled (regardless of changes) | Event-driven: triggered by version approval             | Only syncs when meaningful   |
| **Change detection** | None (send everything)                      | Diff engine classifies: ADDED, MODIFIED, REMOVED        | Precise change tracking      |
| **Performance**      | 15-30 min for full sync                     | 1-5 seconds for delta (typically 3-10 projects)         | 99% faster                   |
| **Error impact**     | Full sync failure = total data gap          | Delta failure = only missed delta, next sync catches up | Graceful degradation         |

```
AS-IS: Full PROMIS Sync
  Every sync: send ALL 50+ projects with ALL allocations
  Payload: ~500KB-2MB, Duration: 15-30 min
  PROMIS processes all records (even unchanged ones)

TO-BE: Delta PROMIS Sync
  On approval: Diff Engine detects 3 changed projects
  Payload: ~5-20KB (added: 1, modified: 1, removed: 1)
  Duration: 1-5 seconds
  PROMIS processes only 3 project records
```

---

## 4. State Machines

### 4.1 Version Lifecycle State Machine

Applies to: RoadmapVersion, PMPlanVersion

```
                        +-------+
            +---------->| Draft |<-----------+
            |           +---+---+            |
            |               |                |
            |         [Submit for            |
            |          Approval]         [Rejected:
            |               |             Return to
            |               v             Draft]
            |       +---------------+        |
            |       | PendingApproval|--------+
            |       +-------+-------+
            |               |
            |         [Manager Approves]
            |               |
            |               v
            |       +---------------+
            |       |   Approved    |
            |       |   (Active)    |
            |       +-------+-------+
            |               |
            |         [Newer version approved]
            |               |
            |               v
            |       +---------------+
            |       |   Archived    |
            |       +---------------+
            |
     [New Draft created
      from Approved]
```

**State Transition Table**:

| From            | To              | Trigger                | Guard                      | Action                                                            |
| --------------- | --------------- | ---------------------- | -------------------------- | ----------------------------------------------------------------- |
| —               | Draft           | User saves new version | Valid allocation data      | Create version entity, snapshot records                           |
| Draft           | PendingApproval | Planner submits        | All required fields filled | Create ApprovalRequest, send email to approver                    |
| PendingApproval | Approved        | Manager approves       | Approver has authority     | Archive previous approved, set PROMIS_Synced = false, trigger P11 |
| PendingApproval | Draft           | Manager rejects        | Rejection comment provided | Notify requester with rejection reason                            |
| Approved        | Archived        | New version approved   | New version exists         | Set status = Archived, retain for audit                           |

**Special Flag**: `PROMIS_Synced` (boolean) is set independently on Approved versions after successful P11 completion. It is not a state but a flag.

---

### 4.2 PMPlan Status State Machine

Applies to: PMPlan entity (the plan container, not the version)

```
+----------+        +---------+        +------------------+        +----------+
| Editing  |------->|  Draft  |------->| PendingApproval  |------->| Approved |
+----------+        +---------+        +------------------+        +----------+
     ^                   ^                      |
     |                   |                      |
     |                   +------[Rejected]------+
     |
[Plan opened
 for editing]
```

**State Transition Table**:

| From            | To              | Trigger                        | Guard                  | Action                                      |
| --------------- | --------------- | ------------------------------ | ---------------------- | ------------------------------------------- |
| —               | Editing         | Planner opens plan for editing | Plan exists or created | Acquire soft lock                           |
| Editing         | Draft           | Planner saves                  | Valid data             | Create PMPlanVersion (version_type = Draft) |
| Draft           | PendingApproval | Planner submits                | Draft version exists   | Create ApprovalRequest                      |
| PendingApproval | Approved        | Manager approves               | Approver authority     | Mark version Permanent, trigger PROMIS sync |
| PendingApproval | Draft           | Manager rejects                | Comment provided       | Notify requester, allow re-editing          |

---

### 4.3 Simulation Status State Machine

Applies to: ResourceSimulation entity

```
+---------+        +---------+        +------------+
|  Draft  |------->| Running |------->| Completed  |
+---------+        +---------+        +------+-----+
                                             |
                                     [Promote to Roadmap]
                                             |
                                             v
                                     +----------------+
                                     | Promoted       |
                                     | (linked to new |
                                     |  Roadmap Draft)|
                                     +----------------+
```

**State Transition Table**:

| From      | To        | Trigger                                 | Guard                        | Action                                        |
| --------- | --------- | --------------------------------------- | ---------------------------- | --------------------------------------------- |
| —         | Draft     | Create simulation from roadmap          | Valid source roadmap version | Clone data, calculate initial deltas          |
| Draft     | Running   | Planner starts editing/running scenario | At least one variant created | Enable Gantt editing                          |
| Running   | Completed | Planner marks as finalized              | All variants saved           | Lock simulation from further editing          |
| Completed | Promoted  | Planner promotes to roadmap             | Selected variant finalized   | Create new Roadmap Draft from simulation data |

---

### 4.4 SyncRecord Status State Machine

Applies to: SyncRecord entity (PROMIS and N-PLM sync tracking)

```
+---------+        +------------+        +---------+
| Pending |------->| Processing |------->| Success |
+---------+        +------+-----+        +---------+
                          |
                     [Error occurs]
                          |
                          v
                   +------+-----+
                   |   Failed   |
                   +------+-----+
                          |
                   [retry_count < 3]
                          |
                          v
                   +---------+
                   | Pending |  (re-queued)
                   +---------+
```

**State Transition Table**:

| From       | To                | Trigger                                   | Guard                    | Action                                   |
| ---------- | ----------------- | ----------------------------------------- | ------------------------ | ---------------------------------------- |
| —          | Pending           | Sync event triggered (approval, schedule) | Target system configured | Create SyncRecord                        |
| Pending    | Processing        | Sync worker picks up record               | Worker available         | Set processing timestamp                 |
| Processing | Success           | API call returns 200 OK                   | Response validated       | Set PROMIS_Synced flag on version        |
| Processing | Failed            | API call returns error                    | —                        | Log error_message, increment retry_count |
| Failed     | Pending           | Retry scheduled                           | retry_count < 3          | Re-queue with backoff delay              |
| Failed     | Failed (terminal) | Max retries exceeded                      | retry_count >= 3         | Alert admin, await manual intervention   |

---

### 4.5 SyncQueue Status State Machine

Applies to: SyncQueue entity (Oracle-to-ES sync tracking)

```
+---------+        +------------+        +-----------+
| PENDING |------->| PROCESSING |------->| COMPLETED |
+---------+        +------+-----+        +-----------+
                          |
                     [ES error]
                          |
                          v
                   +------+-----+
                   |   RETRY    |
                   +------+-----+
                          |
                   <retry_count < 3?>
                    |YES          |NO
                    v              v
              +---------+    +--------+
              | PENDING |    | FAILED |
              +---------+    +--------+
```

---

## 5. Concurrent Edit Sequence Diagram

This is the most critical process in IRIS — the #1 technical challenge.

### 5.1 Happy Path (No Conflict)

```
Planner A             IRIS Server (Mendix)           Oracle DB          WebSocket         Planner B
    |                        |                          |                   |                   |
    |-- Open P/M Plan ------>|                          |                   |                   |
    |                        |-- SELECT PMPlan -------->|                   |                   |
    |                        |<-- Plan data + V5 -------|                   |                   |
    |                        |-- UPDATE lock_owner=A -->|                   |                   |
    |<-- Load V5, Lock(A) ---|                          |                   |                   |
    |                        |                          |                   |                   |
    |   [Editing in Gantt]   |                          |                   |                   |
    |                        |                          |                   |                   |
    |                        |<------- Open P/M Plan ---|---|---|-----------|--- Planner B -----|
    |                        |-- SELECT PMPlan -------->|                   |                   |
    |                        |<-- Plan data + V5 -------|                   |                   |
    |                        |-- Note: lock_owner=A --->|                   |                   |
    |                        |--- Send: "Concurrent  --|---|-------------->|                   |
    |                        |    edit notice" ---------|---|---|-----------|------------------>|
    |                        |--- Load V5 to B ---------|---|---|-----------|------------------>|
    |                        |                          |                   |                   |
    |   [Editing...]         |                          |                   |  [Editing...]     |
    |                        |                          |                   |                   |
    |-- Save (changes A) --->|                          |                   |                   |
    |   [Employee Kim:       |-- Check base version --->|                   |                   |
    |    Project DDR5,       |<-- V5 (unchanged) -------|                   |                   |
    |    hours=120]          |                          |                   |                   |
    |                        |-- No conflict (base=V5)  |                   |                   |
    |                        |-- INSERT PMPlanVersion ->|                   |                   |
    |                        |   V6 (Draft, by A)       |                   |                   |
    |                        |-- INSERT PMEntry recs -->|                   |                   |
    |                        |<-- COMMIT OK ------------|                   |                   |
    |<-- V6 Created ---------|                          |                   |                   |
    |                        |-- Broadcast: "V6 saved  |                   |                   |
    |                        |   by Planner A" ---------|-->|               |                   |
    |                        |                          |   |-- Push ------>|                   |
    |                        |                          |                   |------------------>|
    |                        |                          |                   |  [B sees: "A saved|
    |                        |                          |                   |   new version"]   |
    |                        |                          |                   |                   |
    |                        |<---------- Save (changes B, base=V5) -------|-------------------|
    |                        |   [Employee Park:        |                   |                   |
    |                        |    Project HBM4,         |                   |                   |
    |                        |    hours=160]            |                   |                   |
    |                        |                          |                   |                   |
    |                        |-- Check base version --->|                   |                   |
    |                        |<-- Latest = V6 (A's) ----|                   |                   |
    |                        |                          |                   |                   |
    |                   [Detect: B's base=V5, latest=V6]|                   |                   |
    |                   [Run auto-merge: A changed Kim/DDR5]               |                   |
    |                   [                  B changed Park/HBM4]            |                   |
    |                   [No overlap -> clean merge]     |                   |                   |
    |                        |                          |                   |                   |
    |                        |-- INSERT PMPlanVersion ->|                   |                   |
    |                        |   V7 (Draft, merged A+B) |                   |                   |
    |                        |<-- COMMIT OK ------------|                   |                   |
    |                        |                          |                   |                   |
    |                        |-- Broadcast: "V7 saved" -|-->|               |                   |
    |                        |   (merged)               |   |-- Push ------>|                   |
    |<-- V7 notification ----|                          |   |-------------->|--- V7 Saved ----->|
    |                        |                          |                   |                   |
```

### 5.2 Conflict Path (Same Cell Edited)

```
Planner A             IRIS Server (Mendix)                              Planner B
    |                        |                                               |
    |   [Both loaded V5, both editing]                                       |
    |                        |                                               |
    |-- Save: Kim/DDR5=120 ->|                                               |
    |<-- V6 Created ---------|                                               |
    |                        |                                               |
    |                        |<----- Save: Kim/DDR5=80 (base=V5) ------------|
    |                        |                                               |
    |                   [Detect: base=V5, latest=V6]                         |
    |                   [Auto-merge attempt:]                                |
    |                   [  A changed Kim/DDR5: 100->120]                     |
    |                   [  B changed Kim/DDR5: 100->80]                      |
    |                   [  CONFLICT: same cell, different values]            |
    |                        |                                               |
    |                        |-- Send conflict to B: ----------------------->|
    |                        |   {                                           |
    |                        |     conflicting_cells: [{                     |
    |                        |       employee: "Kim",                        |
    |                        |       project: "DDR5",                        |
    |                        |       period: "2026-04",                      |
    |                        |       base_value: 100,                        |
    |                        |       version_A_value: 120,                   |
    |                        |       version_B_value: 80                     |
    |                        |     }],                                       |
    |                        |     non_conflicting: [auto-merged]            |
    |                        |   }                                           |
    |                        |                                               |
    |                        |                               [Diff Viewer opens]
    |                        |                               [Shows side-by-side:]
    |                        |                               [  A: Kim/DDR5=120]
    |                        |                               [  B: Kim/DDR5=80]
    |                        |                                    |
    |                        |                               <User B choice?>
    |                        |                                |Pass    |Overwrite
    |                        |                                v         v
    |                        |                           [Accept A's [Keep B's
    |                        |                            value=120]  value=80]
    |                        |                                |         |
    |                        |<------ Resolution: {cell, chosen_value} -|
    |                        |                                          |
    |                   [Apply resolution]                              |
    |                   [Create V7 with resolved values]                |
    |                        |                                          |
    |<-- V7 notification ----|--- V7 Saved --------------------------->|
    |                        |                                          |
```

### 5.3 WebSocket Real-Time Flow

```
[On Plan Open]
  Browser --> WebSocket CONNECT: ws://iris/ws/pmplan/{plan_id}
  Server --> Register connection in session map

[On Save Event]
  Server --> Iterate session map for plan_id
  Server --> WS SEND to all connected clients (except saver):
    {
      event: "version_saved",
      version_id: "V6",
      saved_by: "Planner A",
      timestamp: "2026-04-01T10:22:15Z",
      change_summary: "Modified 3 allocations"
    }

[On Concurrent User Join]
  Server --> WS SEND to existing clients:
    {
      event: "user_joined",
      user: "Planner B",
      timestamp: "2026-04-01T10:25:00Z"
    }

[On User Leave / Disconnect]
  Server --> Remove from session map
  Server --> WS SEND to remaining clients:
    {
      event: "user_left",
      user: "Planner B"
    }
  Server --> If last user leaves, release soft lock

[On Lock Timeout (30 min inactivity)]
  Server --> Release lock_owner_id
  Server --> WS SEND: { event: "lock_released", reason: "timeout" }
```

---

## 6. Integration Sequence Diagrams

### 6.1 N-PLM Daily Sync Sequence

```
Scheduler            IRIS Server           N-PLM REST API         Oracle DB           Elasticsearch
    |                     |                      |                    |                      |
[02:00 AM] ------------->|                      |                    |                      |
    |                     |                      |                    |                      |
    |                [Create SyncRecord]         |                    |                      |
    |                [status = Pending]           |                    |                      |
    |                     |                      |                    |                      |
    |                     |-- GET /api/projects ->|                    |                      |
    |                     |<-- 200 [{...}, ...]---|                    |                      |
    |                     |                      |                    |                      |
    |                     |-- GET /api/employees->|                    |                      |
    |                     |<-- 200 [{...}, ...]---|                    |                      |
    |                     |                      |                    |                      |
    |                     |-- GET /api/org-units->|                    |                      |
    |                     |<-- 200 [{...}, ...]---|                    |                      |
    |                     |                      |                    |                      |
    |                     |-- GET /api/sites ---->|                    |                      |
    |                     |<-- 200 [{...}, ...]---|                    |                      |
    |                     |                      |                    |                      |
    |                [Compare N-PLM data          |                    |                      |
    |                 vs Oracle records]           |                    |                      |
    |                     |                      |                    |                      |
    |                     |-- New: INSERT --------|---------------->|                      |
    |                     |-- Changed: UPDATE ----|---------------->|                      |
    |                     |-- Removed: SOFT DEL --|---------------->|                      |
    |                     |<-- COMMIT OK ---------|----------------|                      |
    |                     |                      |                    |                      |
    |                [Log sync results:           |                    |                      |
    |                 inserted=12, updated=5,     |                    |                      |
    |                 deleted=2]                   |                    |                      |
    |                     |                      |                    |                      |
    |                     |-- Trigger full ES reindex --|------------|----> POST _bulk     |
    |                     |  (master data affects all   |            |     [{index docs}]   |
    |                     |   denormalized documents)   |            |                      |
    |                     |                             |            |<---- 200 OK ---------|
    |                     |                             |            |                      |
    |                [Update SyncRecord:                |            |                      |
    |                 status = Success]                  |            |                      |
    |                     |                             |            |                      |
```

### 6.2 PROMIS Delta Sync Sequence (Triggered by Approval)

```
P06 Approval          IRIS Server           Diff Engine          PROMIS REST API       Oracle DB
    |                     |                      |                      |                   |
[Version Approved] ----->|                      |                      |                   |
    |                     |                      |                      |                   |
    |                     |-- Load V(n) ---------|------|------|--------|---------------->|
    |                     |<-- V(n) data --------|------|------|--------|-----------------|
    |                     |                      |                      |                   |
    |                     |-- Find last PROMIS-synced version -------->|                   |
    |                     |   SELECT FROM SyncRecord                   |                   |
    |                     |   WHERE target_system='PROMIS'             |                   |
    |                     |   AND sync_status='Success'                |                   |
    |                     |   ORDER BY sync_date DESC LIMIT 1          |                   |
    |                     |<-- V(promis) data ---------|----------------|                   |
    |                     |                      |                      |                   |
    |                     |-- Diff: V(n) vs V(promis) -->|              |                   |
    |                     |                      |                      |                   |
    |                     |                 [Match by composite key]    |                   |
    |                     |                 [employee_id + project_id   |                   |
    |                     |                  + period]                  |                   |
    |                     |                      |                      |                   |
    |                     |<-- Diff result: -----|                      |                   |
    |                     |    added: [{P-099}]  |                      |                   |
    |                     |    modified: [{P-042, P-055}]               |                   |
    |                     |    removed: [{P-011}]|                      |                   |
    |                     |                      |                      |                   |
    |                     |-- Build delta JSON --|                      |                   |
    |                     |   {                  |                      |                   |
    |                     |     added: [{project_id: "P-099",          |                   |
    |                     |              allocations: [...]}],          |                   |
    |                     |     modified: [{project_id: "P-042",       |                   |
    |                     |                 changes: [...]}],           |                   |
    |                     |     removed: ["P-011"]                     |                   |
    |                     |   }                  |                      |                   |
    |                     |                      |                      |                   |
    |                     |-- POST /api/resource-sync -->|              |                   |
    |                     |<-- 200 OK -------------------|              |                   |
    |                     |                      |                      |                   |
    |                     |-- UPDATE V(n):  PROMIS_Synced=true ------->|                   |
    |                     |-- INSERT SyncRecord: status=Success ------>|                   |
    |                     |                      |                      |                   |
```

### 6.3 Samsung AI Report Generation Sequence

```
Eunji (Analyst)       IRIS Server (Mendix)      Elasticsearch         Samsung AI API
    |                        |                        |                      |
    |-- Click "Generate      |                        |                      |
    |   AI Report" --------->|                        |                      |
    |                        |                        |                      |
    |                        |-- Build ES agg query   |                      |
    |                        |   from current          |                      |
    |                        |   dimension/filter      |                      |
    |                        |   selection              |                      |
    |                        |                        |                      |
    |                        |-- POST ES agg query -->|                      |
    |                        |<-- Aggregation result --|                      |
    |                        |                        |                      |
    |                   [Build AI request payload]    |                      |
    |                   [  data: agg_result,          |                      |
    |                   [  dimensions: [...],          |                      |
    |                   [  measures: [...],            |                      |
    |                   [  format: "Excel PIVOT"]      |                      |
    |                        |                        |                      |
    |                        |-- POST /api/ai/report --|----->|              |
    |                        |                        |      |              |
    |                        |                        | [AI processes data] |
    |                        |                        | [Generates PIVOT    |
    |                        |                        |  tables, formatting]|
    |                        |                        |      |              |
    |                        |<-- 200 + Excel binary --|-----|              |
    |                        |                        |                      |
    |                   [Store file temporarily]      |                      |
    |                   [Generate download URL]       |                      |
    |                        |                        |                      |
    |<-- "Report ready,      |                        |                      |
    |    click to download" -|                        |                      |
    |                        |                        |                      |
    |-- Download Excel ----->|                        |                      |
    |<-- Excel file ---------|                        |                      |
    |                        |                        |                      |
```

---

## 7. CRUD Matrix

Processes (rows) vs Entities (columns). **C** = Create, **R** = Read, **U** = Update, **D** = Delete (soft).

| Process                 | Site  | Country | Division | BU    | Dept  | Team  | Employee | Project | ProjType | ProdFamily | ResRoadmap | RoadmapVer | RoadmapProjAlloc | ResSim | SimVer | SimAlloc | PMPlan | PMPlanVer | PMEntry | HCPlan | HCEntry | ApprovalReq | ApprovalHist | FactorCtlSet | FactorCtlItem | SyncRecord | NotifSchedule | SyncQueue |
| ----------------------- | ----- | ------- | -------- | ----- | ----- | ----- | -------- | ------- | -------- | ---------- | ---------- | ---------- | ---------------- | ------ | ------ | -------- | ------ | --------- | ------- | ------ | ------- | ----------- | ------------ | ------------ | ------------- | ---------- | ------------- | --------- |
| **P01** P/M Planning    | R     | -       | -        | -     | R     | R     | R        | R       | -        | -          | -          | -          | -                | -      | -      | -        | R/U    | C/R       | C/R/U   | -      | -       | -           | -            | R            | -             | -          | -             | C         |
| **P02** Roadmap Mgmt    | R     | -       | -        | R     | R     | -     | R        | R       | R        | R          | R/U        | C/R        | C/R/U/D          | -      | -      | -        | -      | -         | -       | -      | -       | -           | -            | R            | -             | -          | -             | C         |
| **P03** Simulation      | R     | -       | -        | R     | R     | -     | R        | R       | -        | -          | R          | R          | R                | C/R/U  | C/R    | C/R/U    | -      | -         | -       | -      | -       | -           | -            | -            | -             | -          | -             | C         |
| **P04** HC Planning     | R     | -       | -        | -     | R     | -     | R        | -       | -        | -          | -          | -          | -                | -      | -      | -        | -      | -         | -       | C/R/U  | C/R/U   | -           | -            | -            | -             | -          | -             | -         |
| **P05** Version Mgmt    | -     | -       | -        | -     | -     | -     | -        | -       | -        | -          | R          | C/R/U      | C/R              | R      | C/R    | C/R      | R      | C/R/U     | C/R     | -      | -       | -           | -            | -            | -             | -          | -             | C         |
| **P06** Approval        | -     | -       | -        | -     | -     | -     | R        | -       | -        | -          | R          | R/U        | R                | -      | -      | -        | R      | R/U       | R       | R      | -       | C/R/U       | C            | -            | -             | -          | -             | -         |
| **P07** Master Data     | C/U/D | C/U     | C/U/D    | C/U/D | C/U/D | C/U/D | C/U/D    | C/U/D   | C/U      | C/U        | -          | -          | -                | -      | -      | -        | -      | -         | -       | -      | -       | -           | -            | -            | -             | C          | -             | C         |
| **P08** Ad-Hoc Analysis | R     | R       | R        | R     | R     | R     | R        | R       | R        | R          | -          | R          | R                | -      | R      | R        | -      | R         | R       | -      | R       | -           | -            | R            | R             | -          | -             | -         |
| **P09** Periodic Report | R     | R       | R        | R     | R     | R     | R        | R       | R        | R          | -          | R          | R                | -      | -      | -        | -      | R         | R       | -      | R       | -           | -            | R            | R             | -          | R             | -         |
| **P10** AI Report       | R     | R       | R        | R     | R     | R     | R        | R       | R        | R          | -          | R          | R                | -      | -      | -        | -      | R         | R       | -      | R       | -           | -            | R            | R             | -          | -             | -         |
| **P11** PROMIS Sync     | -     | -       | -        | -     | -     | -     | -        | R       | -        | -          | R          | R          | R                | -      | -      | -        | R      | R         | R       | -      | -       | -           | -            | -            | -             | C/R/U      | -             | -         |
| **P12** N-PLM Sync      | C/U/D | C/U     | C/U/D    | C/U/D | C/U/D | C/U/D | C/U/D    | C/U/D   | C/U      | C/U        | -          | -          | -                | -      | -      | -        | -      | -         | -       | -      | -       | -           | -            | -            | -             | C/R/U      | -             | C         |
| **P13** Smart Notify    | -     | -       | -        | -     | -     | -     | R        | -       | -        | -          | -          | -          | -                | -      | -      | -        | -      | -         | -       | -      | -       | R           | R            | -            | -             | -          | R             | -         |

### CRUD Validation Summary

| Check                           | Result                                                               |
| ------------------------------- | -------------------------------------------------------------------- |
| Every entity has at least one C | PASS — All entities are created by at least one process              |
| Every entity has at least one R | PASS — All entities are read by at least one process                 |
| Orphaned entities (C but no R)  | NONE                                                                 |
| Write-only entities             | NONE                                                                 |
| Read-only processes             | P08, P09, P10 are read-only (analysis/reporting) — correct by design |
| Soft-delete only                | Master data entities: soft delete via is_active flag (P07, P12)      |

---

## 8. Process Metrics

### 8.1 Planning Processes

| Process              | Frequency          | Target Duration                        | Success Criteria                            | Error Rate Threshold                             |
| -------------------- | ------------------ | -------------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **P01** P/M Planning | Daily during cycle | < 60 min per plan (2 concurrent users) | Plan saved with zero data loss              | < 1% merge conflicts requiring manual resolution |
| **P02** Roadmap Mgmt | Weekly             | < 30 min per version edit              | Version saved, diff accurate                | < 0.5% diff engine errors                        |
| **P03** Simulation   | Weekly-Monthly     | < 45 min per simulation scenario       | Simulation saved, comparison renders        | < 1% clone failures                              |
| **P04** HC Planning  | Quarterly          | < 2 hours per dept plan                | Gaps calculated correctly, actions assigned | < 0.1% calculation errors                        |

### 8.2 Management Processes

| Process              | Frequency      | Target Duration                  | Success Criteria                             | Error Rate Threshold         |
| -------------------- | -------------- | -------------------------------- | -------------------------------------------- | ---------------------------- |
| **P05** Version Mgmt | Per save event | < 2 sec (version creation)       | Version snapshot complete, diff chain intact | < 0.01% snapshot failures    |
| **P06** Approval     | Multiple/week  | < 48 hours (approval turnaround) | Decision recorded, notifications sent        | < 1% email delivery failures |
| **P07** Master Data  | Daily          | < 15 min (full sync)             | All master data current, ES reindexed        | < 0.1% record sync failures  |

### 8.3 Analysis Processes

| Process                 | Frequency      | Target Duration                 | Success Criteria                          | Error Rate Threshold     |
| ----------------------- | -------------- | ------------------------------- | ----------------------------------------- | ------------------------ |
| **P08** Ad-Hoc Analysis | Multiple/day   | < 3 sec (chart render)          | ES query returns, chart renders correctly | < 2% query timeouts      |
| **P09** Periodic Report | Weekly/Monthly | < 5 min (generation + delivery) | Report generated, email delivered         | < 1% generation failures |
| **P10** AI Report       | Weekly-Monthly | < 30 sec (AI response)          | Excel file generated and downloadable     | < 5% AI service failures |

### 8.4 Integration Processes

| Process              | Frequency        | Target Duration                         | Success Criteria                                | Error Rate Threshold    |
| -------------------- | ---------------- | --------------------------------------- | ----------------------------------------------- | ----------------------- |
| **P11** PROMIS Sync  | Per approval     | < 10 sec (delta sync)                   | Changed projects synced, PROMIS_Synced flag set | < 2% sync failures      |
| **P12** N-PLM Sync   | Daily + on-event | < 15 min (inbound), < 10 sec (outbound) | Data synchronized, SyncRecord logged            | < 0.1% inbound failures |
| **P13** Smart Notify | Event-driven     | < 5 sec (email queued)                  | Email sent, delivery logged                     | < 3% delivery failures  |

### 8.5 As-Is vs To-Be Comparison

| Metric                             | As-Is (PM Planner)       | To-Be (IRIS)                    | Improvement            |
| ---------------------------------- | ------------------------ | ------------------------------- | ---------------------- |
| P/M Plan completion time (2 users) | 2-4 hours                | 30-60 min                       | 60-75%                 |
| PROMIS sync duration               | 15-30 min (full)         | 1-10 sec (delta)                | 99%                    |
| Version comparison                 | 30-60 min (manual Excel) | 2-5 sec (automated diff)        | 99%                    |
| Report generation                  | 2-4 hours (manual)       | < 5 min (automated)             | 95%                    |
| Master data freshness              | Weekly (manual import)   | Daily (automated N-PLM)         | 7x more current        |
| Conflict detection                 | None (last write wins)   | < 2 sec (cell-level auto-merge) | From zero to real-time |

---

## 9. Gantt Widget Data Flow (xDHTML)

### 9.1 Page Load Sequence

```
User Browser                Mendix Page                  REST API                  xDHTML Gantt
    |                            |                          |                          |
    |-- Navigate to              |                          |                          |
    |   P/M Planning page ------>|                          |                          |
    |                            |                          |                          |
    |                       [Mendix loads page]             |                          |
    |                       [Initialize Gantt widget]       |                          |
    |                            |                          |                          |
    |                            |-- GET /gantt/config ----->|                          |
    |                            |<-- {columns, scale,       |                          |
    |                            |     resources, view_mode} |                          |
    |                            |                          |                          |
    |                            |-- GET /gantt/tasks ------>|                          |
    |                            |<-- {                      |                          |
    |                            |     tasks: [              |                          |
    |                            |       {id, text, start,   |                          |
    |                            |        end, resource_id,  |                          |
    |                            |        progress, parent}, |                          |
    |                            |       ...                 |                          |
    |                            |     ],                    |                          |
    |                            |     links: [              |                          |
    |                            |       {id, source,        |                          |
    |                            |        target, type},     |                          |
    |                            |       ...                 |                          |
    |                            |     ]                     |                          |
    |                            |   }                       |                          |
    |                            |                          |                          |
    |                            |-- Pass data to widget --->|-->  gantt.config(...)    |
    |                            |                          |     gantt.parse(data)     |
    |                            |                          |     [Render timeline]     |
    |<------------------------------------------------------------|                    |
    |   [Gantt chart visible     |                          |                          |
    |    with all tasks]         |                          |                          |
```

### 9.2 User Interaction Sequence

```
User                    xDHTML Gantt               Mendix Nanoflow          Oracle DB         WebSocket
  |                          |                          |                      |                  |
  |-- Drag task bar -------->|                          |                      |                  |
  |   (change allocation     |                          |                      |                  |
  |    period or hours)      |                          |                      |                  |
  |                          |                          |                      |                  |
  |                     [onBeforeTaskDrag event]        |                      |                  |
  |                     [Validate: within bounds?]      |                      |                  |
  |                          |                          |                      |                  |
  |                     [User drops task bar]           |                      |                  |
  |                          |                          |                      |                  |
  |                     [onAfterTaskDrag event fires]   |                      |                  |
  |                          |-- Call nanoflow: ------->|                      |                  |
  |                          |   {task_id: "T-042",     |                      |                  |
  |                          |    new_start: "2026-04", |                      |                  |
  |                          |    new_end: "2026-06",   |                      |                  |
  |                          |    resource_id: "E-108", |                      |                  |
  |                          |    new_hours: 160}       |                      |                  |
  |                          |                          |                      |                  |
  |                          |                     [Validate:]                 |                  |
  |                          |                     [- allocation <= 100%]     |                  |
  |                          |                     [- dates within FY]        |                  |
  |                          |                     [- employee active]        |                  |
  |                          |                          |                      |                  |
  |                          |                     <Valid?>                    |                  |
  |                          |                      |NO         |YES          |                  |
  |                          |                      v            v            |                  |
  |                          |<-- Revert task ---[Show error] [UPDATE ------->|                  |
  |                          |    position       toast]       PMEntry]       |                  |
  |                          |                                [INSERT ------->|                  |
  |                          |                                SyncQueue]     |                  |
  |                          |                                  |            |                  |
  |                          |                                  |<-- OK -----|                  |
  |                          |                                  |            |                  |
  |                          |<-- Confirm save: visual ---------|            |                  |
  |                          |    feedback (green flash)         |            |                  |
  |                          |                                  |            |                  |
  |                          |                                  |-- Broadcast: "task updated" ->|
  |                          |                                  |            |     [Push to     |
  |                          |                                  |            |      concurrent  |
  |                          |                                  |            |      editors]    |
```

### 9.3 Real-Time Update Reception (Concurrent Editor)

```
WebSocket                  Mendix                   xDHTML Gantt (Other User's Browser)
    |                        |                            |
    |-- WS message: -------->|                            |
    |   {event: "task_       |                            |
    |    updated",           |                            |
    |    task_id: "T-042",   |                            |
    |    new_data: {...}}    |                            |
    |                        |                            |
    |                   [Nanoflow: process WS event]      |
    |                        |                            |
    |                        |-- gantt.updateTask( ------>|
    |                        |     "T-042",               |
    |                        |     {start, end, hours})   |
    |                        |                       [Task bar moves]
    |                        |                       [Highlight: yellow flash]
    |                        |                       [Tooltip: "Updated by A"]
```

---

## 10. ECharts Widget Data Flow

### 10.1 Initial Chart Render

```
User Browser              Mendix Page              M33 ES Client          Elasticsearch
    |                          |                        |                       |
    |-- Open Analysis page -->|                        |                       |
    |                          |                        |                       |
    |                     [Load page with ECharts widget]                       |
    |                     [Load saved FactorControlSet]                         |
    |                          |                        |                       |
    |-- Select dimensions: -->|                        |                       |
    |   site x department      |                        |                       |
    |-- Select measures: ---->|                        |                       |
    |   headcount, alloc_pct   |                        |                       |
    |-- Select chart: ------->|                        |                       |
    |   stacked bar            |                        |                       |
    |-- Apply filters: ------>|                        |                       |
    |   site IN [Hwaseong,     |                        |                       |
    |   Pyeongtaek]            |                        |                       |
    |                          |                        |                       |
    |                     [Nanoflow: buildEsQuery()]     |                       |
    |                     [Map dimensions to ES terms]   |                       |
    |                     [Map measures to ES metrics]   |                       |
    |                     [Map filters to ES query]      |                       |
    |                          |                        |                       |
    |                          |-- POST /es/query ----->|                       |
    |                          |   {                    |                       |
    |                          |     "size": 0,         |                       |
    |                          |     "query": {         |-- POST iris-resource- |
    |                          |       "bool": {        |   allocation/_search  |
    |                          |         "filter": [    |                       |
    |                          |           {"terms":    |                       |
    |                          |            {"site.name"|                       |
    |                          |             :["Hwaseong|                       |
    |                          |             ","Pyeong- |                       |
    |                          |              taek"]}}  |                       |
    |                          |         ]              |                       |
    |                          |       }                |                       |
    |                          |     },                 |                       |
    |                          |     "aggs": {          |                       |
    |                          |       "by_site": {     |                       |
    |                          |         "terms":       |                       |
    |                          |          {"field":     |                       |
    |                          |           "site.name"},|                       |
    |                          |         "aggs": {      |                       |
    |                          |           "by_dept": { |                       |
    |                          |             "terms":   |                       |
    |                          |              {"field": |                       |
    |                          |               "employee|                       |
    |                          |               .department"}                    |
    |                          |           },           |                       |
    |                          |           "headcount": |                       |
    |                          |            {"cardinality"|                     |
    |                          |             :{"field": |                       |
    |                          |              "employee.|                       |
    |                          |               id"}}    |                       |
    |                          |         }              |                       |
    |                          |       }                |                       |
    |                          |     }                  |                       |
    |                          |   }                    |                       |
    |                          |                        |                       |
    |                          |<-- ES agg result ------|<-- 200 agg result ---|
    |                          |                        |                       |
    |                     [Nanoflow: transformToECharts()]                      |
    |                     [Build ECharts option:]                               |
    |                     [{                                                    |
    |                     [  xAxis: {data: ["DRAM Dev","Logic","Foundry"]},     |
    |                     [  yAxis: {},                                         |
    |                     [  series: [                                          |
    |                     [    {name:"Hwaseong", type:"bar", stack:"total",     |
    |                     [     data: [245, 180, 120]},                         |
    |                     [    {name:"Pyeongtaek", type:"bar", stack:"total",   |
    |                     [     data: [198, 95, 88]}                            |
    |                     [  ]                                                  |
    |                     [}]                                                   |
    |                          |                        |                       |
    |                          |-- chart.setOption(option) -->  [ECharts.js]    |
    |                          |                                [Render chart]  |
    |<---------------------------------------------------------|               |
    |   [Interactive stacked bar chart visible]                 |               |
```

### 10.2 Drill-Down Interaction

```
User                    ECharts Widget            Mendix Nanoflow          Elasticsearch
  |                          |                          |                       |
  |-- Click bar segment ---->|                          |                       |
  |   "Hwaseong / DRAM Dev"  |                          |                       |
  |                          |                          |                       |
  |                     [onClick event fires]           |                       |
  |                     [params: {                      |                       |
  |                       seriesName: "Hwaseong",       |                       |
  |                       name: "DRAM Dev",             |                       |
  |                       value: 245                    |                       |
  |                     }]                              |                       |
  |                          |                          |                       |
  |                          |-- Call nanoflow: ------->|                       |
  |                          |   drillDown(              |                       |
  |                          |     dimension: "dept",    |                       |
  |                          |     value: "DRAM Dev",    |                       |
  |                          |     parentFilter:         |                       |
  |                          |       site="Hwaseong")    |                       |
  |                          |                          |                       |
  |                          |                     [Add sub-dimension: "team"]  |
  |                          |                     [Add filter: dept="DRAM Dev"]|
  |                          |                     [Rebuild ES agg query]       |
  |                          |                          |                       |
  |                          |                          |-- POST ES query ----->|
  |                          |                          |   (now grouped by team|
  |                          |                          |    within DRAM Dev,   |
  |                          |                          |    Hwaseong)          |
  |                          |                          |                       |
  |                          |                          |<-- Agg result --------|
  |                          |                          |                       |
  |                          |                     [Transform to ECharts]       |
  |                          |                     [New option: teams as x-axis]|
  |                          |                          |                       |
  |                          |<-- chart.setOption(new) -|                       |
  |                     [Chart re-renders]              |                       |
  |                     [Shows: teams within DRAM Dev]  |                       |
  |                     [Breadcrumb: Site > Dept > Team]|                       |
  |<-----------------------------------------------------|                     |
  |                                                     |                       |
```

### 10.3 Chart Types and ES Mapping

| Chart Type  | ES Aggregation           | ECharts Series Type           | Use Case                   |
| ----------- | ------------------------ | ----------------------------- | -------------------------- |
| Stacked Bar | Terms agg + sub-agg      | `type: "bar", stack: "total"` | Headcount by site x dept   |
| Grouped Bar | Terms agg + sub-agg      | `type: "bar"` (no stack)      | Allocation comparison      |
| Line        | Date histogram           | `type: "line"`                | Headcount trend over time  |
| Pie         | Terms agg                | `type: "pie"`                 | Gap distribution by action |
| Heatmap     | Terms x Terms matrix     | `type: "heatmap"`             | Dept x Project utilization |
| Treemap     | Terms agg (hierarchical) | `type: "treemap"`             | Org hierarchy breakdown    |
| World Map   | Terms by site with geo   | `type: "map"`                 | Global site overview       |
| Scatter     | Two metrics per bucket   | `type: "scatter"`             | Utilization vs headcount   |

---

## 11. Definition of Done

Per AX Guide A3, this specification is complete when:

### Completeness

- [x] All 13 processes identified and documented with detailed flows
- [x] ASCII flowcharts created for each process (happy path + exception paths)
- [x] As-Is process maps completed for 3 key workflows (P01, P02, P11)
- [x] To-Be process maps completed for all 13 processes
- [x] CRUD matrix populated for all 13 processes x 28 entities
- [x] State transition diagrams for all stateful entities (5 state machines)
- [x] Integration specifications for all 3 external systems (N-PLM, PROMIS, Samsung AI)

### Validation

- [x] Processes trace to 4 personas (Jisoo, Minho, Eunji, Soyeon)
- [x] CRUD matrix cross-checked: every entity has C and R
- [x] State transitions verified: all states reachable, terminal states intentional
- [x] Concurrent edit sequence covers happy path and conflict path

### Metrics

- [x] Process metrics defined for all 13 processes
- [x] As-Is baselines documented for key workflows
- [x] To-Be targets set with improvement rationale

### Widget Data Flows

- [x] xDHTML Gantt lifecycle: load -> render -> interact -> save -> broadcast
- [x] ECharts lifecycle: select -> query -> transform -> render -> drill-down

### Traceability

- [x] Processes trace to business capabilities from A1
- [x] Entities in CRUD matrix match A2 data model
- [x] Integration specs align with solution architecture

---

## Cross-References

| Reference                   | Document                                                                    |
| --------------------------- | --------------------------------------------------------------------------- |
| **A1 — Business Model**     | `03_DEVELOP/a1-business-model.md` — Business capabilities and rules         |
| **A2 — Data Model**         | `03_DEVELOP/a2-data-model.md` — Entity definitions and ERD                  |
| **A4 — Architecture**       | `03_DEVELOP/a4-architecture-design.md` — Technical architecture (next)      |
| **A5 — Backlog**            | `03_DEVELOP/a5-production-backlog.md` — User stories derived from processes |
| **Input: Process Modeling** | `.command/000_init_project/input/docs/04-process-modeling.md`               |
| **Input: Data Sync**        | `.command/000_init_project/input/docs/05-data-sync-etl.md`                  |
| **AX Guide**                | `.ax/analysis/A3_PROCESS_MODELING_GUIDE.md`                                 |

---

_A3 Process Model Specification — IRIS by Amoza — AX Framework v2.0.0_
