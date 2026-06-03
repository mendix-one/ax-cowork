# A1 — Business Model Specification

> **IRIS** (Intelligent Resources Information System)
> **Version**: 1.0.0
> **Date**: 2026-03-22
> **Author**: CXO (UX & Business Analysis)
> **AX Phase**: DEVELOP — Analysis Handoff
> **Status**: Complete
> **Gate 1**: GO (4.90/5.00) | **Gate 2**: GO (4.70/5.00)

---

## 1. Information Flow Diagram

### 1.1 System Context — Data Flows

```
+==========================================================================================+
|                              EXTERNAL SYSTEMS                                             |
|                                                                                           |
|  +-----------+     +----------+     +---------------+     +------------------+            |
|  | N-PLM     |     | SMDM /   |     | Samsung AI    |     | Email / SMTP     |            |
|  | (MDM)     |     | GHRP     |     | Services      |     | Smart Notify     |            |
|  +-----+-----+     +----+-----+     +-------+-------+     +--------+---------+            |
|        |                |                    |                       |                     |
|    [D1: Master      [D2: Org           [D3: AI Excel           [D4: Notifications]       |
|     Data Sync]       Hierarchy          PIVOT response]         Approval alerts,          |
|     Projects,        Departments,       .xlsx files             periodic reports,          |
|     Products,        Teams,                                     event-driven emails        |
|     Employees,       Positions                                                             |
|     Sites]                                                                                |
|        |                |                    ^                       ^                     |
+========|================|====================|=======================|=====================+
         |                |                    |                       |
         v                v                    |                       |
+========|================|====================|=======================|=====================+
|        |                |                    |                       |                     |
|  +-----v-----+   +-----v-----+              |                       |                     |
|  |   F1       |   |   F1       |              |                       |                     |
|  | Master     |   | Org Sync   |              |                       |                     |
|  | Data Mgmt  |<--+           |              |                       |                     |
|  +-+--+-------+               |              |                       |                     |
|    |  |                       |              |                       |                     |
|    |  +--- [D5: Standard PM, Project registry, Org hierarchy] ---+  |                     |
|    |                                                              |  |                     |
|    v                                                              v  |                     |
|  +-----------+     +-----------+     +-----------+      +---------+-+-------+             |
|  |   F2       |     |   F3       |     |   F4       |      |   F5 / F6 / F7   |             |
|  | Project/   |     | Resource   |     | HR         |      | Reporting &      |             |
|  | Product    |     | Planning   |     | Portfolio  |      | Analytics        |             |
|  | Management |     | Roadmap &  |     | HeadCount  |      | Gap, Periodic,   |             |
|  |            |     | Simulation |     | Planning   |      | AI Reporting     |             |
|  +---+--+-----+     +---+---+----+     +---+---+----+      +---+---+----+-----+             |
|      |  |               |   |              |   |                |   |    |                   |
|      |  |  [D6: PM      |   |  [D8: HC     |   |   [D10: Agg   |   |    |                   |
|      |  |  schedule     |   |  current     |   |   data for    |   |    |                   |
|      |  |  confirmed]   |   |  vs target]  |   |   analysis]   |   |    |                   |
|      |  |               |   |              |   |                |   |    |                   |
|      |  +---[D7: Actual PM from N-PLM]-----+   |                |   |    |                   |
|      |                  |                      |                |   |    |                   |
|      |     [D9: Changed projects — delta only] |                |   |    |                   |
|      |                  |                      |                |   |    |                   |
|      v                  v                      v                |   |    |                   |
|  +---+------------------+----------------------+---+            |   |    |                   |
|  |            Oracle 19c (Transactional SoT)       |            |   |    |                   |
|  |  Mendix Domain Model — Version Store — Workflow |            |   |    |                   |
|  +---+---------------------------------------------+            |   |    |                   |
|      |                                                          |   |    |                   |
|      | [D11: ETL — Denormalized sync]                           |   |    |                   |
|      v                                                          |   |    |                   |
|  +---+---------------------------------------------+            |   |    |                   |
|  |         Elasticsearch 8.x (Analytical Engine)   |<-----------+   |    |                   |
|  |  iris-resource-allocation, iris-headcount,      |                |    |                   |
|  |  iris-simulation-result, iris-analysis-report   |                |    |                   |
|  +---+---------------------------------------------+                |    |                   |
|      |                                                              |    |                   |
|      +--------------------------------------------------------------+    |                   |
|                                                                          |                   |
|      [D12: Aggregation results for charts/dashboards]                    |                   |
|      [D13: AI data payload for Samsung AI]    --->  [D3 response]        |                   |
|      [D14: Report content for Smart Notify]   --->  [D4 email]           |                   |
|                                                                          |                   |
|                           IRIS PLATFORM (Mendix 10)                      |                   |
+==========================================================================================+

               +-------+                             +---------+
               |PROMIS |  <---  [D9: Delta sync] --- | IRIS    |
               |(Profit)|      Changed projects only  | M30     |
               +-------+                             +---------+
```

### 1.2 Data Flow Catalog

| Flow ID | Name               | Source        | Target             | Direction | Trigger                        | Payload                                             |
| ------- | ------------------ | ------------- | ------------------ | --------- | ------------------------------ | --------------------------------------------------- |
| D1      | Master Data Sync   | N-PLM         | IRIS (M02, M31)    | Inbound   | Daily scheduled + event-driven | Projects, products, employees, sites, org structure |
| D2      | Org Hierarchy Sync | SMDM / GHRP   | IRIS (M02)         | Inbound   | Daily scheduled                | Departments, teams, positions, grades               |
| D3      | AI PIVOT Response  | Samsung AI    | IRIS (M22)         | Response  | On-demand (user request)       | Excel .xlsx with PIVOT tables                       |
| D4      | Notifications      | IRIS (M32)    | Email/SMTP         | Outbound  | Event-driven + scheduled       | Approval alerts, periodic reports, report delivery  |
| D5      | Master-to-Planning | F1 (M02)      | F2, F3, F4, F5-F7  | Internal  | On load                        | Standard PM data, project registry, org hierarchy   |
| D6      | Confirmed Schedule | F2 (M10)      | N-PLM (M31)        | Outbound  | On approval                    | PM planning schedules (confirmed)                   |
| D7      | Actual PM Import   | N-PLM         | F2 (M10)           | Inbound   | Daily sync                     | Actual PM records per project                       |
| D8      | HC Gap Data        | F3, F4        | F5, F6             | Internal  | On calculation                 | Current vs target headcount, gap entries            |
| D9      | PROMIS Delta       | IRIS (M30)    | PROMIS             | Outbound  | On version approval            | Changed projects only (added, modified, removed)    |
| D10     | Aggregation Data   | All features  | F5, F6, F7         | Internal  | On query                       | Resource allocation data for analysis               |
| D11     | ETL Sync           | Oracle 19c    | Elasticsearch 8.x  | Internal  | Event-driven (30s) + nightly   | Denormalized flat documents (12-table join)         |
| D12     | Analytical Results | Elasticsearch | UI widgets         | Internal  | On user request                | Aggregation buckets for ECharts, Gantt, WorldMap    |
| D13     | AI Data Payload    | IRIS (M22)    | Samsung AI         | Outbound  | On-demand                      | Aggregated data + dimension config + format spec    |
| D14     | Report Content     | IRIS (M21)    | Smart Notify (M32) | Internal  | Scheduled + on-demand          | Rendered report content (charts, tables, summary)   |

---

## 2. Business Function Decomposition

### 2.1 Function Hierarchy

```
IRIS Resources Planning
|
+-- F1: Master Data Management
|   +-- F1.1: Standard PM Management
|   |   +-- F1.1.1: Standard Production Type CRUD (code, name, milestones, timelines)
|   |   +-- F1.1.2: Standard PM Definition (org x dimension = shift + PM value)
|   |   +-- F1.1.3: Extra RF Type Management (same attributes)
|   |   +-- F1.1.4: Extra Certification Type Management (same attributes)
|   +-- F1.2: Organization Hierarchy Sync
|   |   +-- F1.2.1: SMDM Organization Import (Line > Site > Team > Group > Part)
|   |   +-- F1.2.2: GHRP HR Data Import
|   |   +-- F1.2.3: Manual Org Override & Merge
|   +-- F1.3: Revision Management
|   |   +-- F1.3.1: Change Tracking (every edit creates revision)
|   |   +-- F1.3.2: Revision History View
|   |   +-- F1.3.3: Revision Compare (diff view)
|   +-- F1.4: Merge Strategy
|   |   +-- F1.4.1: Auto-merge from external sync (N-PLM + manual data)
|   |   +-- F1.4.2: Conflict Detection (sync data vs manual edits)
|   |   +-- F1.4.3: User-driven Merge Resolution
|   +-- F1.5: Skills Group Structure Management
|       +-- F1.5.1: Stage Management (Stage 1, Stage 2, ...)
|       +-- F1.5.2: Block Management (Block 1, Block 2, ...)
|       +-- F1.5.3: Function Management (Function 1, Function 2, ...)
|       +-- F1.5.4: Activity Management (Activity 1, Activity 2, ...)
|
+-- F2: Project/Product Management
|   +-- F2.1: Project Lifecycle
|   |   +-- F2.1.1: Project Registry (code, name, type, leader, manager, status)
|   |   +-- F2.1.2: Project Status Management (Open, In Progress, Drop, Hold/Release)
|   |   +-- F2.1.3: Product Line & Application Linking
|   +-- F2.2: Actual PM Tracking
|   |   +-- F2.2.1: Record Actual PM per Dept/Team/Group/Part x Activity x Month
|   |   +-- F2.2.2: Actual vs Planned Variance Calculation
|   +-- F2.3: N-PLM Bidirectional Sync
|       +-- F2.3.1: Inbound — Project info, status, actual PM from N-PLM
|       +-- F2.3.2: Outbound — PM Planning/Schedule (confirmed) to N-PLM
|       +-- F2.3.3: Sync Status Monitoring & Error Handling
|
+-- F3: Resource Planning — Roadmap, Simulation & PM Planning
|   +-- F3.1: P/M Planning (Standard PM)
|   |   +-- F3.1.1: Monthly Allocation Editing (Gantt view)
|   |   +-- F3.1.2: Concurrent Edit (multi-planner, soft lock)
|   |   +-- F3.1.3: Auto-Merge (non-conflicting changes)
|   |   +-- F3.1.4: Conflict Detection & Resolution (Pass/Overwrite via Diff Viewer)
|   |   +-- F3.1.5: Draft Save (Planner role)
|   |   +-- F3.1.6: Permanent Save (Manager role — no approval needed)
|   |   +-- F3.1.7: Approval Request & Workflow
|   +-- F3.2: Resource Roadmap Management
|   |   +-- F3.2.1: Roadmap Creation & Editing (Gantt view)
|   |   +-- F3.2.2: Version Creation (clone current approved)
|   |   +-- F3.2.3: Version History & Browsing
|   |   +-- F3.2.4: Diff View (version-to-version comparison)
|   |   +-- F3.2.5: Approval Workflow (Draft -> PendingApproval -> Approved)
|   |   +-- F3.2.6: Changed Project Detection (for delta sync)
|   +-- F3.3: Resource Simulation
|       +-- F3.3.1: Clone Roadmap to Simulation
|       +-- F3.3.2: What-If Scenario Editing (Gantt view)
|       +-- F3.3.3: Simulation Versioning (S1-V1, S1-V2, ...)
|       +-- F3.3.4: Compare Simulation vs Roadmap (overlay, ECharts)
|       +-- F3.3.5: Compare Simulation Variants (S1-V2 vs S1-V3)
|       +-- F3.3.6: Promote Simulation to Roadmap Version
|
+-- F4: HR Portfolio
|   +-- F4.1: HeadCount Planning
|   |   +-- F4.1.1: Current Staffing View (by grade, skill, department)
|   |   +-- F4.1.2: Target Headcount Entry (per category per quarter)
|   |   +-- F4.1.3: Gap Calculation (target - current = gap)
|   |   +-- F4.1.4: Action Assignment (Hire, Transfer, Retain, Reduce)
|   +-- F4.2: Gap Analysis
|   |   +-- F4.2.1: Stacked Bar — Current vs Planned vs Target
|   |   +-- F4.2.2: Line Chart — Headcount Trend (8 quarters)
|   |   +-- F4.2.3: Pie Chart — Gap Distribution by Action Type
|   +-- F4.3: World Map Visualization
|   |   +-- F4.3.1: Global Site Pins (ECharts map)
|   |   +-- F4.3.2: Site Summary Bubbles (headcount, utilization %, projects, gap)
|   |   +-- F4.3.3: Drill-Down to Site View (department treemap, heatmap, trend)
|   |   +-- F4.3.4: Drill-Down to Team/Person View
|   +-- F4.4: Staffing Recommendations
|       +-- F4.4.1: Resource Optimization Suggestions (per site)
|       +-- F4.4.2: Actual vs Plan Effectiveness Metrics
|
+-- F5: Actual vs Plan Gap Reporting
|   +-- F5.1: Actual vs Plan Analysis
|   |   +-- F5.1.1: Period-over-Period Gap Calculation
|   |   +-- F5.1.2: Gap Breakdown by Dimension (site, dept, project, person)
|   |   +-- F5.1.3: Gap Trend Visualization (ECharts line)
|   +-- F5.2: Resource Utilization Dashboard
|       +-- F5.2.1: Utilization Heatmap (dept x project)
|       +-- F5.2.2: Over/Under Allocation Alerts
|       +-- F5.2.3: Personal Workload View
|
+-- F6: Regular Reporting
|   +-- F6.1: Periodic Reports (Scheduled)
|   |   +-- F6.1.1: Report Template Configuration (dimensions, measures, filters, recipients)
|   |   +-- F6.1.2: Scheduled Execution (weekly, monthly, quarterly)
|   |   +-- F6.1.3: Server-Side Chart Rendering (ECharts to image)
|   |   +-- F6.1.4: Report Storage (iris-analysis-report index)
|   +-- F6.2: Manual Reports (Ad-Hoc)
|   |   +-- F6.2.1: Dimension & Measure Selection
|   |   +-- F6.2.2: Chart Type Selection (bar, line, pie, heatmap, treemap)
|   |   +-- F6.2.3: Factor Control Filter Application
|   |   +-- F6.2.4: Interactive Visualization (drill-down, zoom)
|   |   +-- F6.2.5: Excel Export
|   +-- F6.3: Smart Notify
|       +-- F6.3.1: Email Delivery of Periodic Reports
|       +-- F6.3.2: Event-Driven Alerts (approval needed, version approved, sync failure)
|       +-- F6.3.3: Recipient List Management
|
+-- F7: AI Analytics
    +-- F7.1: Samsung AI Integration
    |   +-- F7.1.1: Data Payload Preparation (aggregated data + dimension config)
    |   +-- F7.1.2: AI Service Invocation (POST /analyze)
    |   +-- F7.1.3: Response Handling (Excel .xlsx download)
    +-- F7.2: Excel PIVOT Generation
    |   +-- F7.2.1: Multi-Dimensional PIVOT Table Creation
    |   +-- F7.2.2: PIVOT Configuration (rows, columns, values, filters)
    +-- F7.3: AI-Assisted Insights
        +-- F7.3.1: Resource Optimization Recommendations
        +-- F7.3.2: Trend-Based Forecasting
        +-- F7.3.3: Anomaly Detection in Allocation Patterns
```

### 2.2 Function-to-Module Mapping

| Function                   | Mendix Module(s)              | Widget(s)                   | External System     |
| -------------------------- | ----------------------------- | --------------------------- | ------------------- |
| F1.1 Standard PM CRUD      | M02 MasterData                | —                           | N-PLM (M31)         |
| F1.2 Org Sync              | M02 MasterData                | —                           | SMDM, GHRP          |
| F1.3 Revision Mgmt         | M03 VersionEngine             | W03 DiffViewer              | —                   |
| F1.4 Merge Strategy        | M03 VersionEngine             | W03 DiffViewer              | —                   |
| F2.1 Project Lifecycle     | M02 MasterData                | —                           | N-PLM (M31)         |
| F2.2 Actual PM             | M10 PMPlanner                 | W01 Gantt                   | N-PLM (M31)         |
| F2.3 N-PLM Sync            | M31 NPLMConnector             | —                           | N-PLM               |
| F3.1 P/M Planning          | M10 PMPlanner, M03, M04       | W01 Gantt, W03 DiffViewer   | —                   |
| F3.2 Roadmap Mgmt          | M11 ResourceRoadmap, M03, M04 | W01 Gantt, W03 DiffViewer   | PROMIS (M30)        |
| F3.3 Simulation            | M12 ResourceSimulation, M03   | W01 Gantt, W02 ECharts      | —                   |
| F4.1 HC Planning           | M13 HeadCountPortfolio        | W02 ECharts                 | —                   |
| F4.2 Gap Analysis          | M13 HeadCountPortfolio, M20   | W02 ECharts                 | —                   |
| F4.3 World Map             | M23 WorldMapView              | W04 WorldMap                | —                   |
| F4.4 Recommendations       | M13, M20                      | W02 ECharts                 | —                   |
| F5.1 Gap Reporting         | M20 AnalysisEngine, M21       | W02 ECharts                 | —                   |
| F5.2 Utilization Dashboard | M20, M24 PersonalView         | W02 ECharts                 | —                   |
| F6.1 Periodic Reports      | M21 AnalysisReporting, M32    | W02 ECharts                 | Email/SMTP          |
| F6.2 Manual Reports        | M21 AnalysisReporting         | W02 ECharts, W05 PivotTable | —                   |
| F6.3 Smart Notify          | M32 SmartNotify               | —                           | Email/SMTP          |
| F7.1 Samsung AI            | M22 AIReporting               | —                           | Samsung AI Services |
| F7.2 PIVOT Generation      | M22 AIReporting               | W05 PivotTable              | Samsung AI Services |
| F7.3 AI Insights           | M22 AIReporting, M20          | W02 ECharts                 | Samsung AI Services |

---

## 3. Business Rules Catalog

### 3.1 Version Lifecycle Rules (BR-VER)

| Rule ID    | Rule Name                       | Description                                                                                                                                                                                                       | Scope                        | Enforcement            |
| ---------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------- |
| BR-VER-001 | Version State Machine           | Valid state transitions: Draft -> PendingApproval -> Approved -> Archived. Additionally: PendingApproval -> Rejected -> Draft (returns to editing). No other transitions allowed.                                 | Roadmap, PM Plan, Simulation | M03 VersionEngine      |
| BR-VER-002 | Draft Creator                   | Only users with Planner or Manager role can create Draft versions.                                                                                                                                                | All versioned entities       | M03, M01               |
| BR-VER-003 | Approval Authority              | Only users with Manager role can transition PendingApproval to Approved or Rejected.                                                                                                                              | All versioned entities       | M04 ApprovalWorkflow   |
| BR-VER-004 | Single Active Version           | At most one version per scope (site + dept + period for PM; site + BU + FY for Roadmap) can be in Approved/Active state. When a new version is approved, the previous Approved version is automatically archived. | PM Plan, Roadmap             | M03 VersionEngine      |
| BR-VER-005 | Archived Immutability           | Archived versions are read-only. No modifications allowed. They remain accessible for diff comparison and audit trail.                                                                                            | All versioned entities       | M03 VersionEngine      |
| BR-VER-006 | Version Numbering               | Versions are auto-numbered sequentially within their parent scope (V1, V2, V3...). Numbers never reset or reuse.                                                                                                  | All versioned entities       | M03 VersionEngine      |
| BR-VER-007 | Draft Overwrite                 | A scope can have at most one active Draft. Creating a new Draft while one exists requires explicit confirmation to discard the existing Draft.                                                                    | PM Plan, Roadmap             | M03 VersionEngine      |
| BR-VER-008 | Rejection Comment               | Rejecting a PendingApproval version requires a non-empty comment explaining the rejection reason.                                                                                                                 | All versioned entities       | M04 ApprovalWorkflow   |
| BR-VER-009 | PROMIS Sync Flag                | Approved versions carry an independent PROMIS_Synced boolean flag, set to true after successful PROMIS delta sync. This flag is independent of the version state machine.                                         | Roadmap, PM Plan             | M03, M30               |
| BR-VER-010 | Simulation Version Independence | Simulation versions do not follow the approval workflow. They remain in Draft or Closed state. Only promoted simulations enter the Roadmap approval flow.                                                         | Simulation                   | M12 ResourceSimulation |

### 3.2 Concurrent Editing Rules (BR-CON)

| Rule ID    | Rule Name                       | Description                                                                                                                                                                                      | Scope       | Enforcement         |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ------------------- |
| BR-CON-001 | Soft Lock Acquisition           | When a user opens a PM plan for editing, a soft lock record is created with the user ID and timestamp. The lock does not prevent other users from editing — it serves as an awareness indicator. | PM Planning | M10 PMPlanner       |
| BR-CON-002 | Concurrent Edit Allowed         | Multiple planners can edit the same PM plan scope simultaneously. The system displays a "concurrent edit" notice to all editors after the first.                                                 | PM Planning | M10 PMPlanner       |
| BR-CON-003 | Base Version Check on Save      | When a user saves, the system checks if the base version (loaded at open time) has changed. If unchanged, save proceeds normally. If changed, the auto-merge process starts.                     | PM Planning | M10, M03            |
| BR-CON-004 | Auto-Merge Non-Conflicting      | Changes to different employee-project-period combinations (different rows) are auto-merged without user intervention. The merged result creates a new version.                                   | PM Planning | M03 VersionEngine   |
| BR-CON-005 | Conflict Definition             | A conflict exists when two users modify the same record, identified by the composite key: (employee_id + project_id + period).                                                                   | PM Planning | M03 VersionEngine   |
| BR-CON-006 | Conflict Resolution — Pass      | When a user selects "Pass" in the conflict dialog, the other user's value is kept and the current user's change for that record is discarded.                                                    | PM Planning | M03, W03 DiffViewer |
| BR-CON-007 | Conflict Resolution — Overwrite | When a user selects "Overwrite" in the conflict dialog, the current user's value replaces the other user's value for that record.                                                                | PM Planning | M03, W03 DiffViewer |
| BR-CON-008 | Conflict-by-Conflict Resolution | Each conflicting record is resolved independently. A user can Pass on some conflicts and Overwrite others within the same save operation.                                                        | PM Planning | W03 DiffViewer      |
| BR-CON-009 | Soft Lock Timeout               | Soft locks expire after 30 minutes of inactivity (no save or heartbeat). Expired locks are automatically released.                                                                               | PM Planning | M10 PMPlanner       |
| BR-CON-010 | WebSocket Broadcast             | All changes saved by one concurrent editor are broadcast via WebSocket to other active editors of the same scope, enabling real-time visual updates.                                             | PM Planning | M10, W01 Gantt      |

### 3.3 Role-Based Save Rules (BR-ROLE)

| Rule ID     | Rule Name                  | Description                                                                                                                                                                     | Scope          | Enforcement        |
| ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------ |
| BR-ROLE-001 | Planner Save as Draft      | When a user with Planner role saves a PM plan, the version is saved as Draft. It does not become active until approved by a Manager.                                            | PM Planning    | M10, M01           |
| BR-ROLE-002 | Manager Save as Permanent  | When a user with Manager role saves a PM plan, the version is saved directly as Permanent (Approved). No separate approval step is required.                                    | PM Planning    | M10, M01           |
| BR-ROLE-003 | Planner Triggers Approval  | After a Planner saves a Draft, they can submit it for approval. This changes the version state to PendingApproval and triggers an email notification to the designated Manager. | PM Planning    | M04, M32           |
| BR-ROLE-004 | Role Hierarchy for Roadmap | Roadmap versions always require Manager approval regardless of who creates them (Planner or Manager).                                                                           | Roadmap        | M11, M04           |
| BR-ROLE-005 | Site-Scoped Roles          | Planner and Manager roles are scoped to specific sites and departments. A Planner at Hwaseong cannot edit PM plans for Austin.                                                  | All planning   | M01 UserManagement |
| BR-ROLE-006 | Division Manager Read-Only | Division Manager role has read-only access to all planning data across sites. They can view but not edit plans, roadmaps, or simulations.                                       | All features   | M01 UserManagement |
| BR-ROLE-007 | HR Planner HC Scope        | HR Planner can edit HeadCount portfolio data for their assigned sites but cannot edit PM plans or roadmaps.                                                                     | HC Portfolio   | M01, M13           |
| BR-ROLE-008 | System Admin Full Access   | System Admin has access to all administrative functions (N-PLM sync config, ES cluster management, server setup) but does not have planning edit access by default.             | Admin features | M01 UserManagement |

### 3.4 PROMIS Delta Sync Rules (BR-PROM)

| Rule ID     | Rule Name               | Description                                                                                                                                                                 | Scope            | Enforcement         |
| ----------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------- |
| BR-PROM-001 | Trigger on Approval     | PROMIS delta sync is triggered automatically when a Roadmap or PM Plan version transitions to Approved state.                                                               | Roadmap, PM Plan | M30, M04            |
| BR-PROM-002 | Delta-Only Transmission | Only projects that changed between the newly approved version V(n) and the last PROMIS-synced version V(promis) are sent. Unchanged projects are never transmitted.         | PROMIS sync      | M30 PROMISConnector |
| BR-PROM-003 | Change Categories       | Changed projects are classified as: Added (in V(n) but not V(promis)), Modified (in both but values differ), Removed (in V(promis) but not V(n)).                           | PROMIS sync      | M30, M03            |
| BR-PROM-004 | Sync Success Marking    | On successful PROMIS API response (HTTP 200), the current version V(n) is marked with PROMIS_Synced = true.                                                                 | PROMIS sync      | M30                 |
| BR-PROM-005 | Sync Failure Handling   | On PROMIS API failure, the system retries up to 3 times with exponential backoff (30s, 60s, 120s). After 3 failures: mark as FAILED, alert System Admin.                    | PROMIS sync      | M30                 |
| BR-PROM-006 | No Full Resend          | The system never sends the complete project list to PROMIS. Even if the delta calculation fails, it does not fall back to a full send — it alerts the admin instead.        | PROMIS sync      | M30                 |
| BR-PROM-007 | Sync Record Audit       | Every PROMIS sync attempt (success or failure) is logged in the SyncRecord entity with timestamp, version IDs, changed project count, API response code, and error details. | PROMIS sync      | M30                 |
| BR-PROM-008 | No Simulation Sync      | Simulations are never synced to PROMIS. Only approved Roadmap and PM Plan versions trigger PROMIS sync.                                                                     | Simulation       | M12, M30            |

### 3.5 N-PLM Sync Rules (BR-NPLM)

| Rule ID     | Rule Name                   | Description                                                                                                                                                                                                                                                 | Scope       | Enforcement       |
| ----------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ----------------- |
| BR-NPLM-001 | Daily Scheduled Pull        | N-PLM master data is pulled daily at 02:00 AM via REST API. Scope: projects, products, employees, sites, org structure.                                                                                                                                     | Master Data | M31 NPLMConnector |
| BR-NPLM-002 | Event-Driven Sync           | For critical changes (new project creation, project status change), N-PLM can push events to IRIS via webhook. IRIS processes these within 30 seconds.                                                                                                      | Master Data | M31               |
| BR-NPLM-003 | N-PLM as MDM                | N-PLM is the Master Data Management source of truth for project and product data. IRIS does not create projects — it only receives and references them.                                                                                                     | Master Data | M02, M31          |
| BR-NPLM-004 | Merge Priority              | When N-PLM data conflicts with manually entered IRIS data, the merge strategy applies: N-PLM data takes precedence for core attributes (code, name, status), IRIS data is preserved for planning-specific attributes (PM allocations, roadmap assignments). | Master Data | M02               |
| BR-NPLM-005 | Soft Delete on Removal      | Projects removed from N-PLM are soft-deleted in IRIS (marked inactive), never hard-deleted. Historical planning data referencing those projects is preserved.                                                                                               | Master Data | M02               |
| BR-NPLM-006 | ES Reindex on Master Change | When master data changes (N-PLM import), all affected Elasticsearch indices are reindexed because master data is denormalized into every analytical document.                                                                                               | Data Sync   | M33 ESClient      |
| BR-NPLM-007 | Bidirectional for PM        | Confirmed PM schedules (Approved versions) are sent back to N-PLM. This is the only outbound data flow to N-PLM.                                                                                                                                            | PM Planning | M31, M10          |
| BR-NPLM-008 | Sync Monitoring Dashboard   | System Admin can view N-PLM sync status, last sync time, record counts, and error logs via the Admin Dashboard.                                                                                                                                             | Admin       | M31               |

### 3.6 Factor Control Rules (BR-FC)

| Rule ID   | Rule Name                    | Description                                                                                                                                                                                                                    | Scope                 | Enforcement       |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------------- |
| BR-FC-001 | Universal Filter Application | Factor Control filters apply to ALL analytical views: World Map, Gantt, ECharts, Reports, HeadCount views. When a filter is set, every data query includes the filter criteria.                                                | All analytical views  | M05 FactorControl |
| BR-FC-002 | Supported Dimensions         | Factor Control supports these filter dimensions: Site (multi-select), Department (multi-select, cascaded by site), Business Unit (multi-select), Project Type (multi-select), Time Period (range picker), Status (active/all). | All analytical views  | M05               |
| BR-FC-003 | Cascading Filters            | Department filter cascades from Site selection. When a site is selected, only departments belonging to that site are shown.                                                                                                    | All analytical views  | M05               |
| BR-FC-004 | Saved Filter Sets            | Users can save named filter combinations (e.g., "Memory BU — Hwaseong — Q2 2026") and recall them. Each user has their own saved sets.                                                                                         | All analytical views  | M05               |
| BR-FC-005 | Role-Based Scope Restriction | Factor Control respects role-based data visibility. A Planner scoped to Hwaseong cannot select Austin in the Site filter. The filter pre-restricts options based on role.                                                      | All views             | M05, M01          |
| BR-FC-006 | Default Filter               | When a user opens an analytical view, Factor Control defaults to their assigned site and current quarter. Users can expand scope if their role permits.                                                                        | All analytical views  | M05               |
| BR-FC-007 | ES Query Integration         | Factor Control selections are translated into Elasticsearch query filters (bool must clauses) and applied to every aggregation query.                                                                                          | Elasticsearch queries | M05, M33          |

### 3.7 Approval Workflow Rules (BR-APP)

| Rule ID    | Rule Name                  | Description                                                                                                                                                            | Scope                | Enforcement   |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------- |
| BR-APP-001 | Single Approver            | Each approval request is routed to a single designated Manager based on the site + department scope.                                                                   | Roadmap, PM Plan, HC | M04           |
| BR-APP-002 | Approval with Diff         | The approval interface always shows the diff between the submitted version and the current approved version. The Manager must view the diff before approving.          | Roadmap, PM Plan     | M04, W03      |
| BR-APP-003 | Approval Email             | Submitting for approval triggers an email notification to the designated Manager with a direct link to the approval page in IRIS.                                      | All approvals        | M04, M32      |
| BR-APP-004 | Rejection Returns to Draft | Rejecting a version returns it to Draft state with the rejection comment attached. The original submitter receives an email notification with the rejection reason.    | All approvals        | M04, M32      |
| BR-APP-005 | Approval Cascades          | Approving a Roadmap version triggers: (1) archive previous approved version, (2) detect changed projects, (3) trigger PROMIS delta sync.                               | Roadmap              | M04, M03, M30 |
| BR-APP-006 | Approval Audit Trail       | Every approval action (submit, approve, reject) is logged in ApprovalHistory with timestamp, user, action, and comment.                                                | All approvals        | M04           |
| BR-APP-007 | No Self-Approval           | A Planner cannot approve their own submitted version, even if they also hold a Manager role for a different scope. The submitter and approver must be different users. | All approvals        | M04           |
| BR-APP-008 | Pending Timeout Alert      | If an approval request remains in PendingApproval state for more than 48 hours, a reminder email is sent to the Manager. A second reminder is sent at 72 hours.        | All approvals        | M04, M32      |

### 3.8 HeadCount Gap Calculation Rules (BR-HC)

| Rule ID   | Rule Name             | Description                                                                                                                                                                    | Scope        | Enforcement |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ----------- |
| BR-HC-001 | Gap Formula           | Gap = Target Headcount - Current Headcount per (site, department, grade, skill_category, quarter). Positive gap means understaffed; negative gap means overstaffed.            | HC Portfolio | M13         |
| BR-HC-002 | Action Types          | Each gap entry must be assigned exactly one action: Hire (new positions), Transfer (internal movement in or out), Retain (keep current), Reduce (natural attrition or layoff). | HC Portfolio | M13         |
| BR-HC-003 | Current from GHRP     | "Current Headcount" is derived from GHRP sync data. It is not manually editable.                                                                                               | HC Portfolio | M13, M02    |
| BR-HC-004 | Target Editable       | "Target Headcount" is manually entered by the HR Planner per category per quarter.                                                                                             | HC Portfolio | M13         |
| BR-HC-005 | Quarterly Granularity | HeadCount planning operates at quarterly granularity (Q1-Q4 per fiscal year).                                                                                                  | HC Portfolio | M13         |
| BR-HC-006 | Approval Required     | HeadCount plans require Manager approval before they are considered official.                                                                                                  | HC Portfolio | M13, M04    |

### 3.9 Notification Rules (BR-NOT)

| Rule ID    | Rule Name                 | Description                                                                                                                                                                     | Scope             | Enforcement   |
| ---------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------- |
| BR-NOT-001 | Approval Request Email    | Sent immediately when a version is submitted for approval. Contains: version scope, submitter name, link to IRIS approval page.                                                 | All approvals     | M32           |
| BR-NOT-002 | Approval Decision Email   | Sent immediately when a version is approved or rejected. Contains: decision, approver name, rejection reason (if rejected), link to IRIS.                                       | All approvals     | M32           |
| BR-NOT-003 | Periodic Report Email     | Sent on configured schedule (weekly, monthly, quarterly). Contains: report summary, key metrics, inline charts or PDF attachment, link to full report in IRIS.                  | Reporting         | M32, M21      |
| BR-NOT-004 | Sync Failure Alert        | Sent immediately when PROMIS or N-PLM sync fails after max retries. Contains: sync type, error details, affected version/entity. Recipients: System Admin.                      | Sync operations   | M32, M30, M31 |
| BR-NOT-005 | Concurrent Edit Notice    | Displayed in-app (not email) when a second user opens a PM plan that is being edited by another user. Shows: other editor's name and edit start time.                           | PM Planning       | M10           |
| BR-NOT-006 | Pending Approval Reminder | Sent at 48h and 72h if an approval request is still pending. Contains: same info as BR-NOT-001 plus time elapsed.                                                               | All approvals     | M32, M04      |
| BR-NOT-007 | No Duplicate Emails       | The system deduplicates notifications. If the same event triggers multiple notification rules, only one email is sent per recipient per event.                                  | All notifications | M32           |
| BR-NOT-008 | Email Rate Limit          | Maximum 10 notification emails per user per hour (excluding periodic reports). If exceeded, remaining notifications are batched into a digest email sent at the next hour mark. | All notifications | M32           |

### 3.10 Data Integrity Rules (BR-DATA)

| Rule ID     | Rule Name                       | Description                                                                                                                                                                                       | Scope            | Enforcement   |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------- |
| BR-DATA-001 | Oracle is Source of Truth       | All writes go to Oracle 19c. Elasticsearch is a read-optimized projection. ES is never written to directly by business logic — only by the sync engine (M33).                                     | System-wide      | Architecture  |
| BR-DATA-002 | Transactional Reads from Oracle | All editing views (PM plan edit, roadmap edit, simulation edit) read from Oracle via Mendix ORM.                                                                                                  | Planning modules | M10, M11, M12 |
| BR-DATA-003 | Analytical Reads from ES        | All dashboard, chart, world map, and report views read from Elasticsearch via M33 REST client.                                                                                                    | Analysis modules | M20-M24, M33  |
| BR-DATA-004 | Acceptable Sync Lag             | 1-5 second delay between Oracle commit and Elasticsearch visibility is acceptable for analytical views. Dashboards display "Data as of: [timestamp]" indicator.                                   | Analytics        | M33           |
| BR-DATA-005 | Allocation Constraint           | An employee's total allocation across all projects for a given period must not exceed 100% without explicit override by a Manager. The system warns but does not block.                           | PM Planning      | M10           |
| BR-DATA-006 | Referential Integrity           | No planning record (allocation, roadmap entry, simulation entry) can reference a project, employee, or site that does not exist in master data. Foreign key constraints enforced at Oracle level. | All planning     | Oracle 19c    |
| BR-DATA-007 | Nightly Reconciliation          | Full sync runs at 02:00 AM daily. After sync, Oracle vs ES document counts are compared. If delta exceeds 0.1%, automatic reindex is triggered and admin is alerted.                              | Data Sync        | M33           |

---

## 4. Business Model Canvas

### 4.1 IRIS Business Model Canvas

```
+=============================+=================================+==============================+
|     KEY PARTNERSHIPS        |      KEY ACTIVITIES             |     VALUE PROPOSITIONS       |
|                             |                                 |                              |
| - Samsung AI Services       | - P/M Planning with concurrent | - Unified resource planning  |
|   (AI PIVOT generation)     |   multi-planner editing         |   across 5 global sites      |
|                             |                                 |                              |
| - N-PLM (Teamcenter)       | - Resource roadmap creation    | - Real-time concurrent       |
|   Master Data Management    |   with version control          |   planning with auto-merge   |
|                             |                                 |   (eliminates serial waits)  |
| - PROMIS (Profit System)   | - What-if simulation with      |                              |
|   Profit management data    |   roadmap-based cloning         | - Version-controlled         |
|                             |                                 |   planning with diff view    |
| - SMDM / GHRP              | - Headcount portfolio gap      |   (full audit trail)         |
|   Org & HR data systems     |   analysis and staffing         |                              |
|                             |                                 | - Delta-only sync to PROMIS  |
| - Mendix (Platform)        | - Multi-dimensional analysis   |   (reduced data volume,      |
|   Low-code development      |   and reporting via ES          |   faster processing)         |
|                             |                                 |                              |
| - xDHTML Gantt / ECharts   | - AI-powered Excel PIVOT       | - World map executive        |
|   Visualization libraries   |   reporting                     |   visibility across all      |
|                             |                                 |   Samsung DS sites           |
|                             | - Master data integration      |                              |
|                             |   (N-PLM bidirectional)         | - AI-assisted analytics &    |
|                             |                                 |   intelligent reporting      |
|                             | - PROMIS delta sync on         |                              |
|                             |   version approval              | - What-if simulation for     |
|                             |                                 |   data-driven resource       |
|                             |                                 |   allocation decisions       |
+=============================+=================================+==============================+
|     KEY RESOURCES           |                                 |     CUSTOMER RELATIONSHIPS   |
|                             |                                 |                              |
| - Mendix 10 platform       |                                 | - Enterprise embedded tool   |
|   (low-code runtime)       |                                 |   (daily use by planners)    |
|                             |                                 |                              |
| - Oracle 19c database      |                                 | - Samsung SSO integration    |
|   (transactional SoT)      |                                 |   (seamless authentication)  |
|                             |                                 |                              |
| - Elasticsearch 8.x        |                                 | - Role-based UX (Planner,   |
|   cluster (analytics)      |                                 |   Manager, Division Mgr,    |
|                             |                                 |   HR, Analyst, Admin)        |
| - HA infrastructure        |                                 |                              |
|   (QA + Prod clusters)     |                                 | - Smart Notify proactive     |
|                             |                                 |   email communication        |
| - SWAT development team    |                                 |                              |
|   (Amoza + Samsung SMEs)   |                                 | - Onsite support at Samsung  |
|                             |                                 |   Hwaseong HQ                |
+=============================+=================================+==============================+
|     CUSTOMER SEGMENTS       |                                 |     CHANNELS                 |
|                             |                                 |                              |
| Primary:                    |                                 | - Samsung intranet web app   |
| - Resource Planners         |                                 |   (Mendix 10 browser-based)  |
|   (daily P/M planning)     |                                 |                              |
|                             |                                 | - Email (Smart Notify for    |
| - Department Managers       |                                 |   approvals, reports, alerts)|
|   (approvals, oversight)   |                                 |                              |
|                             |                                 | - Direct IRIS URL (role-     |
| Secondary:                  |                                 |   based landing pages)       |
| - Division Managers         |                                 |                              |
|   (cross-site analytics)   |                                 |                              |
|                             |                                 |                              |
| - HR Planners               |                                 |                              |
|   (headcount portfolio)    |                                 |                              |
|                             |                                 |                              |
| - Analysts                  |                                 |                              |
|   (reports, AI analytics)  |                                 |                              |
|                             |                                 |                              |
| Sites: Hwaseong, Pyeongtaek,|                                |                              |
| Austin, Xi'an, Giheung      |                                |                              |
|                             |                                 |                              |
| Divisions: Memory (DRAM,   |                                 |                              |
| NAND), System LSI, Foundry  |                                 |                              |
+=============================+=================================+==============================+
|     COST STRUCTURE                                            |     REVENUE STREAMS          |
|                                                               |                              |
| - Mendix platform license (per-user, per-environment)         | - Project-based engagement   |
| - Oracle 19c database license                                 |   (Samsung DSR contract)     |
| - Elasticsearch cluster infrastructure (3M + 6D nodes)        |                              |
| - xDHTML Gantt license (commercial widget)                    | - Phase-gated delivery       |
| - Samsung AI Services API consumption fees                    |   milestones (AX framework)  |
| - SWAT team (6 FTEs: CEO, CPO, CXO, CAO, CDO, COO)         |                              |
| - HA infrastructure (QA + Prod servers, load balancers)       | - Ongoing maintenance &      |
| - Integration development (N-PLM, PROMIS, SMDM, GHRP APIs)  |   support contract (post-    |
| - Training & onboarding (Samsung DSR end users)              |   DELIVER phase)             |
|                                                               |                              |
+===============================================================+==============================+
```

### 4.2 Value Proposition Detail

| Value Proposition                                | Target Persona                   | Problem Solved                                              | Measurable Outcome                                           |
| ------------------------------------------------ | -------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| Concurrent multi-planner editing with auto-merge | Planner (Jinwoo Park)            | Serial wait times (planners queue for access)               | Planning cycle time reduced from days to hours               |
| Version-controlled roadmaps with diff view       | Planner + Manager                | No visibility into what changed between versions            | Every change tracked, auditable, comparable                  |
| Delta-only PROMIS sync                           | System Admin + Manager           | Full resend of all projects wastes bandwidth and processing | Only changed projects transmitted (estimated 5-15% of total) |
| What-if simulation from roadmap                  | Planner (Jinwoo Park)            | No safe space for scenario testing                          | Unlimited scenarios without affecting production data        |
| World map executive visibility                   | Division Manager (Donghyun Choi) | Cross-site data siloed in spreadsheets                      | Single view of all 5 sites with drill-down                   |
| AI-powered Excel PIVOT reports                   | Analyst (Yuna Kim)               | Manual PIVOT table creation takes hours                     | AI generates formatted PIVOT in seconds                      |
| HeadCount gap analysis                           | HR Planner (Soyeon Lee)          | Gap calculations done manually in Excel                     | Automated gap calculation with action assignment             |

---

## 5. Actor-Feature Matrix

### 5.1 CRUD Permission Matrix

Legend: **C** = Create, **R** = Read, **U** = Update, **D** = Delete, **A** = Approve, **X** = Execute (trigger action), **—** = No access

| Feature / Function        | Planner | Manager | Div Mgr | HR Planner | Analyst | Site Admin | Sys Admin | PROMIS | N-PLM | Samsung AI |
| ------------------------- | ------- | ------- | ------- | ---------- | ------- | ---------- | --------- | ------ | ----- | ---------- |
| **F1: Master Data**       |         |         |         |            |         |            |           |        |       |            |
| Standard PM — View        | R       | R       | R       | R          | R       | R          | R         | —      | —     | —          |
| Standard PM — Edit        | CRU     | CRUD    | —       | —          | —       | CRUD       | —         | —      | —     | —          |
| Org Hierarchy — View      | R       | R       | R       | R          | R       | R          | R         | —      | —     | —          |
| Org Hierarchy — Sync      | —       | —       | —       | —          | —       | —          | X         | —      | CRU   | —          |
| Revision History — View   | R       | R       | R       | R          | R       | R          | R         | —      | —     | —          |
| **F2: Project/Product**   |         |         |         |            |         |            |           |        |       |            |
| Project Registry — View   | R       | R       | R       | R          | R       | R          | R         | —      | —     | —          |
| Project Registry — Sync   | —       | —       | —       | —          | —       | —          | X         | —      | CRU   | —          |
| Actual PM — Record        | CRU     | CRU     | —       | —          | —       | —          | —         | —      | CRU   | —          |
| Actual PM — View          | R       | R       | R       | R          | R       | R          | R         | —      | —     | —          |
| **F3: Resource Planning** |         |         |         |            |         |            |           |        |       |            |
| P/M Plan — Edit           | CRU     | CRUA    | —       | —          | —       | —          | —         | —      | —     | —          |
| P/M Plan — View           | R       | R       | R       | —          | R       | R          | R         | —      | —     | —          |
| P/M Plan — Approve        | —       | A       | —       | —          | —       | —          | —         | —      | —     | —          |
| Roadmap — Edit            | CRU     | CRU     | —       | —          | —       | —          | —         | —      | —     | —          |
| Roadmap — View            | R       | R       | R       | —          | R       | R          | R         | —      | —     | —          |
| Roadmap — Approve         | —       | A       | —       | —          | —       | —          | —         | —      | —     | —          |
| Simulation — Create/Edit  | CRUD    | CRUD    | —       | —          | —       | —          | —         | —      | —     | —          |
| Simulation — View         | R       | R       | R       | —          | R       | —          | —         | —      | —     | —          |
| Simulation — Promote      | —       | X       | —       | —          | —       | —          | —         | —      | —     | —          |
| **F4: HR Portfolio**      |         |         |         |            |         |            |           |        |       |            |
| HC Plan — Edit            | —       | —       | —       | CRU        | —       | —          | —         | —      | —     | —          |
| HC Plan — View            | R       | R       | R       | R          | R       | R          | —         | —      | —     | —          |
| HC Plan — Approve         | —       | A       | —       | —          | —       | —          | —         | —      | —     | —          |
| World Map — View          | R       | R       | R       | R          | R       | R          | —         | —      | —     | —          |
| Gap Analysis — View       | R       | R       | R       | R          | R       | R          | —         | —      | —     | —          |
| **F5: Gap Reporting**     |         |         |         |            |         |            |           |        |       |            |
| Actual vs Plan — View     | R       | R       | R       | R          | R       | R          | —         | —      | —     | —          |
| Utilization Dashboard     | R       | R       | R       | —          | R       | R          | —         | —      | —     | —          |
| Personal View             | R       | R       | —       | —          | —       | —          | —         | —      | —     | —          |
| **F6: Regular Reporting** |         |         |         |            |         |            |           |        |       |            |
| Periodic Report — Config  | —       | —       | —       | —          | CRU     | R          | —         | —      | —     | —          |
| Periodic Report — View    | R       | R       | R       | R          | R       | R          | —         | —      | —     | —          |
| Manual Report — Create    | —       | —       | —       | —          | CRUD    | —          | —         | —      | —     | —          |
| Manual Report — View      | R       | R       | R       | R          | R       | R          | —         | —      | —     | —          |
| Smart Notify — Config     | —       | —       | —       | —          | CRU     | CRU        | CRU       | —      | —     | —          |
| **F7: AI Analytics**      |         |         |         |            |         |            |           |        |       |            |
| AI Report — Generate      | —       | —       | —       | —          | X       | —          | —         | —      | —     | X          |
| AI Report — View          | R       | R       | R       | R          | R       | R          | —         | —      | —     | —          |
| AI Report — Download      | R       | R       | R       | R          | R       | —          | —         | —      | —     | —          |
| **Cross-Cutting**         |         |         |         |            |         |            |           |        |       |            |
| Factor Control — Use      | R       | R       | R       | R          | R       | R          | R         | —      | —     | —          |
| Factor Control — Config   | —       | CRU     | —       | —          | —       | CRU        | —         | —      | —     | —          |
| N-PLM Sync — Monitor      | —       | —       | —       | —          | —       | R          | RX        | —      | —     | —          |
| N-PLM Sync — Configure    | —       | —       | —       | —          | —       | —          | CRU       | —      | —     | —          |
| PROMIS Sync — Monitor     | —       | —       | —       | —          | —       | R          | RX        | —      | —     | —          |
| Server Management         | —       | —       | —       | —          | —       | —          | CRUD      | —      | —     | —          |
| User Management           | —       | —       | —       | —          | —       | CRU        | CRUD      | —      | —     | —          |

### 5.2 Data Visibility Scope

| Actor               | Site Scope                | Department Scope                           | Division Scope    |
| ------------------- | ------------------------- | ------------------------------------------ | ----------------- |
| Planner             | Assigned site only        | Assigned department(s) only                | Assigned BU only  |
| Manager             | Assigned site only        | Assigned department(s) + subordinate depts | Assigned BU only  |
| Division Manager    | All sites                 | All departments (read-only)                | All divisions     |
| HR Planner          | Assigned site(s)          | Assigned department(s) — HC data only      | Assigned BU       |
| Analyst             | All sites (read-only)     | All departments (read-only)                | All divisions     |
| Site Admin          | Assigned site only        | All departments at site                    | Site's BU         |
| System Admin        | All sites                 | All departments                            | All divisions     |
| PROMIS (System)     | All (outbound delta only) | All (outbound delta only)                  | All               |
| N-PLM (System)      | All (bidirectional sync)  | All (bidirectional sync)                   | All               |
| Samsung AI (System) | Per request scope         | Per request scope                          | Per request scope |

---

## 6. Use Case Catalog

### 6.1 Core Use Cases (from DISCOVER/DESIGN)

#### UC01: Standard P/M Planning with Concurrent Editing

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                | UC01                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Name**              | Standard P/M Planning with Concurrent Editing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Primary Actor**     | Planner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Secondary Actors**  | Manager (approval), PROMIS (delta sync)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Trigger**           | Monthly planning cycle begins                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Preconditions**     | (1) Planner has edit access for the target site + department. (2) Master data is current (N-PLM synced). (3) Current approved version exists or first version is being created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Flow**         | 1. Planner opens P/M plan for (site, department, month). 2. System loads latest approved version into Gantt widget (W01). 3. System acquires soft lock, records edit session. 4. Planner modifies employee-project allocations (drag, edit cells). 5. Planner clicks Save. 6. System checks if base version changed since load. 7a. If unchanged: save as new Draft version. 7b. If changed: run auto-merge. 8. If auto-merge succeeds (no conflicts): save merged version. 9. If conflicts exist: show Diff Viewer (W03) with per-record Pass/Overwrite options. 10. Planner resolves each conflict. 11. Save resolved version as Draft. 12. Planner submits for approval. 13. Email notification sent to Manager. 14. Manager reviews diff (submitted vs current approved). 15. Manager approves. 16. Version marked Permanent/Approved. 17. Previous approved version archived. 18. Changed projects detected and delta-synced to PROMIS. |
| **Alternative Flows** | 7c. Manager saves directly as Permanent (no approval step — BR-ROLE-002). 9a. Planner selects "Pass" on all conflicts (accepts other user's changes). 9b. Planner selects "Overwrite" on all conflicts (keeps own changes). 15a. Manager rejects — version returns to Draft with rejection comment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Postconditions**    | (1) New approved P/M plan version exists. (2) Previous version archived. (3) Changed projects synced to PROMIS. (4) All editors notified.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Business Rules**    | BR-CON-001 through BR-CON-010, BR-ROLE-001 through BR-ROLE-003, BR-VER-001 through BR-VER-009, BR-PROM-001 through BR-PROM-007                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **MVP Epic**          | E01 (P/M Planning)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Priority**          | Must-Have                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

#### UC02: Resource Roadmap with Version Control

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                | UC02                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Name**              | Resource Roadmap with Version Control                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Primary Actor**     | Planner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Secondary Actors**  | Manager (approval), PROMIS (delta sync), N-PLM (outbound)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Trigger**           | Annual or quarterly roadmap update needed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Preconditions**     | (1) Current approved roadmap version exists (or first creation). (2) Master data current. (3) Planner has edit access for target site + BU + FY.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Flow**         | 1. Planner opens Roadmap for (site, BU, FY). 2. System displays current approved version in Gantt + Table view. 3. Planner clicks "Create New Version." 4. System clones current approved version data into new Draft. 5. Planner edits in Gantt: add/remove projects, adjust employee assignments, modify timelines. 6. Planner saves Draft. 7. Planner opens Diff View: Draft vs Current Approved. 8. Diff shows: added (green), removed (red), modified (yellow), unchanged (grey). 9. Planner submits for approval. 10. Manager reviews diff, approves. 11. New version becomes Active/Approved. 12. Previous approved version archived. 13. System detects changed projects (added, modified, removed). 14. Only changed projects sent to PROMIS (delta sync). 15. Only changed projects sent to N-PLM (confirmed schedule). |
| **Alternative Flows** | 7a. Planner not satisfied — continues editing, saves again. 10a. Manager rejects — returns to Draft with comment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Postconditions**    | (1) New roadmap version active. (2) Previous version archived. (3) PROMIS updated with delta. (4) N-PLM updated with confirmed schedule changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Business Rules**    | BR-VER-001 through BR-VER-009, BR-PROM-001 through BR-PROM-008, BR-NPLM-007, BR-APP-001 through BR-APP-006                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **MVP Epic**          | E03 (Resource Roadmap)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Priority**          | Must-Have                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

#### UC03: Resource Simulation (What-If)

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                | UC03                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Name**              | Resource Simulation (What-If Scenario)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Primary Actor**     | Planner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Secondary Actors**  | Manager (promote decision)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Trigger**           | Need to evaluate alternative resource allocation scenarios                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Preconditions**     | (1) Approved roadmap version exists to clone from. (2) Planner has simulation access for target scope.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Flow**         | 1. Planner selects approved Roadmap version. 2. Clicks "Create Simulation." 3. System clones roadmap data into Simulation S1-V1. 4. Planner names simulation and sets scenario description. 5. Planner edits in Gantt view (move resources, adjust allocations). 6. Planner saves as S1-V2. 7. Planner views comparison dashboard: Gantt overlay (Roadmap vs Simulation), ECharts bar chart (headcount before/after), Delta table (affected employees, hours shifted). 8. (Optional) Planner creates another variant S1-V3. 9. Planner compares S1-V2 vs S1-V3 in Diff View. 10. Planner selects preferred scenario. 11. (Optional) Manager promotes simulation to new Roadmap version. |
| **Alternative Flows** | 8a. Planner creates multiple variants (S1-V4, V5, ...) for extensive analysis. 11a. Simulation is kept as-is without promotion (preserved for record). 11b. Promotion creates a new Roadmap Draft that enters the UC02 approval flow.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Postconditions**    | (1) Simulation versions preserved with scenario descriptions. (2) If promoted: new Roadmap Draft created, enters approval workflow. (3) Original roadmap unaffected unless simulation is promoted and approved.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Business Rules**    | BR-VER-010, BR-VER-006                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **MVP Epic**          | E04 (Simulation)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Priority**          | Must-Have                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

#### UC04: World Map Home Screen

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                | UC04                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Name**              | World Map Home Screen with Drill-Down                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Primary Actor**     | Division Manager                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Secondary Actors**  | All users (view-only)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Trigger**           | User opens IRIS home page                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Preconditions**     | (1) User is authenticated via Samsung SSO. (2) ES analytical data is available and current.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Main Flow**         | 1. System displays ECharts world map with Samsung DS site pins (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung). 2. Each pin shows summary bubble: total headcount, allocation utilization %, active project count, headcount gap indicator. 3. Manager clicks a site pin (e.g., Hwaseong). 4. System drills into site view: department breakdown (treemap), project allocation heatmap (dept x project), headcount trend (12-month line chart). 5. Manager applies Factor Control filter (e.g., "Memory" BU only). 6. All charts re-query ES with updated filters and refresh. 7. Manager clicks a specific department to drill to team/person view. 8. Personal allocation view shows individual workload distribution. |
| **Alternative Flows** | 3a. User with Planner role sees only their assigned site highlighted; other sites shown but not drillable. 5a. Factor Control pre-restricts to user's permitted scope (BR-FC-005).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Postconditions**    | (1) Executive has multi-level resource visibility. (2) Factor Control state preserved for session.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Business Rules**    | BR-FC-001 through BR-FC-007, BR-DATA-003, BR-DATA-004                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **MVP Epic**          | E11 (Home & Navigation)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Priority**          | Must-Have                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

#### UC05: Analysis Reporting (Periodic + Manual + AI)

| Field                    | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                   | UC05                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Name**                 | Analysis Reporting                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Primary Actor**        | Analyst                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Secondary Actors**     | Smart Notify (email), Samsung AI (PIVOT)                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Trigger**              | Scheduled report cycle OR ad-hoc analysis request OR AI report request                                                                                                                                                                                                                                                                                                                                                                                |
| **Preconditions**        | (1) Analyst has reporting access. (2) ES data is current. (3) For AI reports: Samsung AI Services is available.                                                                                                                                                                                                                                                                                                                                       |
| **Main Flow — Periodic** | 1. Scheduled event fires (configured: weekly Monday 08:00, monthly 1st, quarterly). 2. System loads report configuration (dimensions, measures, filters, recipients). 3. Builds ES aggregation query. 4. Executes query against ES cluster. 5. Generates report with ECharts visualizations (server-side rendering). 6. Stores report in iris-analysis-report index. 7. Smart Notify sends email with report summary + link/attachment to recipients. |
| **Main Flow — Manual**   | 1. Analyst opens Analysis Reporting module. 2. Selects dimensions (Site x Department x Project Type). 3. Selects measures (Headcount, Allocation %, Gap). 4. Selects chart type (bar, line, pie, heatmap, treemap). 5. Applies Factor Control filters. 6. System builds and executes ES aggregation query. 7. ECharts widget renders interactive visualization. 8. Analyst can drill down, zoom, pivot. 9. Analyst exports to Excel.                  |
| **Main Flow — AI**       | 1. Analyst clicks "Generate AI Report." 2. System prepares aggregated data + dimension config payload. 3. POST to Samsung AI Services /analyze endpoint. 4. AI service generates formatted Excel with PIVOT tables. 5. IRIS receives .xlsx file. 6. Analyst downloads the Excel.                                                                                                                                                                      |
| **Alternative Flows**    | 7a. Periodic email delivery fails — retry 3 times, then alert admin. 3a. AI service unavailable — show error message, suggest manual report alternative.                                                                                                                                                                                                                                                                                              |
| **Postconditions**       | (1) Report delivered (email, screen, or download). (2) Report stored in ES for historical access.                                                                                                                                                                                                                                                                                                                                                     |
| **Business Rules**       | BR-FC-001, BR-DATA-003, BR-DATA-004, BR-NOT-003                                                                                                                                                                                                                                                                                                                                                                                                       |
| **MVP Epic**             | E13 (Analysis & Reporting)                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Priority**             | Must-Have                                                                                                                                                                                                                                                                                                                                                                                                                                             |

#### UC06: HeadCount Portfolio & Staffing

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**                | UC06                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Name**              | HeadCount Portfolio and Staffing Plan                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Primary Actor**     | HR Planner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Secondary Actors**  | Manager (approval)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Trigger**           | Quarterly headcount review cycle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Preconditions**     | (1) HR Planner has HC access for target site + department. (2) Current headcount data synced from GHRP.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Flow**         | 1. HR Planner opens HC Portfolio for (site, department, quarter). 2. System displays current staffing by department, grade, skill category (from GHRP sync). 3. HR Planner enters target headcount numbers per category. 4. System calculates gaps: target - current = gap. 5. HR Planner assigns action per gap entry: Hire, Transfer, Retain, Reduce. 6. HR Planner saves staffing plan. 7. System displays analysis: stacked bar (Current vs Planned vs Target), trend line (8 quarters), pie (gap by action type). 8. HR Planner submits plan for Manager approval. 9. Manager reviews and approves. |
| **Alternative Flows** | 9a. Manager rejects with comment — HR Planner revises and resubmits.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Postconditions**    | (1) Approved staffing plan with gap analysis. (2) Actions documented per gap entry.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Business Rules**    | BR-HC-001 through BR-HC-006, BR-APP-001 through BR-APP-006                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **MVP Epic**          | Non-MVP (E09)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Priority**          | Should-Have                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### 6.2 Supporting Use Cases

#### UC07: Master Data Sync (N-PLM)

| Field                | Value                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**               | UC07                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Name**             | Master Data Synchronization from N-PLM                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Primary Actor**    | N-PLM (System)                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Secondary Actors** | System Admin (monitoring)                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Trigger**          | Daily schedule (02:00 AM) or event-driven webhook                                                                                                                                                                                                                                                                                                                                                                                              |
| **Main Flow**        | 1. Sync job triggers (scheduled or webhook). 2. IRIS calls N-PLM REST API to fetch: projects, products, employees, sites, org structure. 3. IRIS compares incoming data with existing Mendix DB records. 4. New records: INSERT. Changed records: UPDATE. Removed records: SOFT DELETE (mark inactive). 5. Log sync results in SyncRecord. 6. Trigger ES reindex for all analytical indices (master data is denormalized into every document). |
| **Business Rules**   | BR-NPLM-001 through BR-NPLM-008                                                                                                                                                                                                                                                                                                                                                                                                                |

#### UC08: Factor Control Configuration

| Field                | Value                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**               | UC08                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Name**             | Factor Control Filter Configuration and Usage                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Primary Actor**    | Manager / Site Admin                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Secondary Actors** | All users (apply filters)                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Trigger**          | User opens any analytical view                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Main Flow**        | 1. User opens Factor Control panel (persistent sidebar or header). 2. Selects dimension values: Site(s), Department(s), BU(s), Project Type(s), Time Period, Status. 3. Departments cascade based on selected sites. 4. User clicks "Apply." 5. All visible charts, Gantt views, and data tables re-query with updated filters. 6. (Optional) User saves current filter combination as named set. 7. User can switch between saved filter sets. |
| **Business Rules**   | BR-FC-001 through BR-FC-007                                                                                                                                                                                                                                                                                                                                                                                                                     |

#### UC09: PROMIS Delta Sync

| Field                | Value                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**               | UC09                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Name**             | PROMIS Delta Synchronization                                                                                                                                                                                                                                                                                                                                                                                  |
| **Primary Actor**    | IRIS (System — triggered by approval)                                                                                                                                                                                                                                                                                                                                                                         |
| **Secondary Actors** | System Admin (monitoring, error handling)                                                                                                                                                                                                                                                                                                                                                                     |
| **Trigger**          | Roadmap or PM Plan version approval (UC01 step 16, UC02 step 11)                                                                                                                                                                                                                                                                                                                                              |
| **Main Flow**        | 1. Load newly approved version V(n). 2. Find last PROMIS-synced version V(promis). 3. Run Diff Engine: V(n) vs V(promis). 4. Extract changed projects (added, modified, removed). 5. If no changes: log and exit. 6. Build delta payload JSON. 7. POST to PROMIS REST API. 8. On success (200): mark V(n) as PROMIS_Synced, log in SyncRecord. 9. On failure: retry up to 3 times, then FAILED + alert admin. |
| **Business Rules**   | BR-PROM-001 through BR-PROM-008                                                                                                                                                                                                                                                                                                                                                                               |

#### UC10: Personal View

| Field              | Value                                                                                                                                                                                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**             | UC10                                                                                                                                                                                                                                                                             |
| **Name**           | Personal Resource Allocation View                                                                                                                                                                                                                                                |
| **Primary Actor**  | Planner / Manager                                                                                                                                                                                                                                                                |
| **Trigger**        | User navigates to Personal View                                                                                                                                                                                                                                                  |
| **Main Flow**      | 1. System displays the logged-in user's resource allocation across all projects. 2. Shows: Gantt timeline of assigned projects, allocation % per month, total workload indicator. 3. Highlights over-allocation periods (>100%). 4. User can view but not edit from this screen. |
| **Business Rules** | BR-DATA-003, BR-DATA-005                                                                                                                                                                                                                                                         |

#### UC11: Version Diff View

| Field              | Value                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**             | UC11                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Name**           | Version Comparison (Diff View)                                                                                                                                                                                                                                                                                                                                                                                      |
| **Primary Actor**  | Planner / Manager                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Trigger**        | User selects two versions for comparison                                                                                                                                                                                                                                                                                                                                                                            |
| **Main Flow**      | 1. User selects Version A and Version B from version history. 2. System loads all allocation records for both versions. 3. Records matched by composite key (employee_id + project_id + period). 4. Classification: ADDED (green), REMOVED (red), MODIFIED (yellow), UNCHANGED (grey). 5. Rendered in Diff Viewer widget (W03) with side-by-side table. 6. Summary stats displayed: X added, Y removed, Z modified. |
| **Business Rules** | BR-VER-005 (archived versions viewable for diff)                                                                                                                                                                                                                                                                                                                                                                    |

#### UC12: Smart Notify Configuration

| Field              | Value                                                                                                                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ID**             | UC12                                                                                                                                                                                                                                                                                             |
| **Name**           | Smart Notify Configuration and Delivery                                                                                                                                                                                                                                                          |
| **Primary Actor**  | Analyst / Site Admin                                                                                                                                                                                                                                                                             |
| **Trigger**        | Configuration setup or scheduled delivery                                                                                                                                                                                                                                                        |
| **Main Flow**      | 1. Admin configures notification schedule: report type, frequency, time, recipients. 2. Admin configures event-driven alerts: trigger events, recipient roles. 3. System stores configuration in NotificationSchedule entity. 4. On schedule/event: system generates content and sends via SMTP. |
| **Business Rules** | BR-NOT-001 through BR-NOT-008                                                                                                                                                                                                                                                                    |

---

## 7. CXO UX Business Rules

These rules directly affect the user experience and must be implemented precisely to meet usability and responsiveness expectations established during DESIGN phase (SUS 74, target >= 68).

### 7.1 Response Time & Feedback Rules (UX-RT)

| Rule ID   | Rule Name                | Description                                                                                                                                                       | Target                    |
| --------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| UX-RT-001 | Save Feedback            | User sees "Saved" confirmation within 100ms of clicking Save. The Oracle commit occurs synchronously; ES sync happens asynchronously (user does not wait for ES). | < 100ms UI feedback       |
| UX-RT-002 | Gantt Load Time          | Gantt chart (xDHTML Gantt) must render within 2 seconds for up to 200 tasks and 50 resources per view. Factor Control re-filter must complete within 1 second.    | < 2s initial, < 1s filter |
| UX-RT-003 | ECharts Render Time      | All ECharts visualizations must render within 1.5 seconds after data is received from ES. Drill-down re-render must complete within 1 second.                     | < 1.5s render, < 1s drill |
| UX-RT-004 | World Map Load           | World map with all site pins and summary bubbles must load within 3 seconds on initial page load.                                                                 | < 3s initial load         |
| UX-RT-005 | Diff Viewer Load         | Version diff calculation and rendering must complete within 3 seconds for up to 5,000 allocation records per version.                                             | < 3s for 5K records       |
| UX-RT-006 | Search & Filter Response | Factor Control filter application must return refreshed data within 2 seconds across all visible widgets on the page.                                             | < 2s end-to-end           |

### 7.2 Auto-Save & Data Loss Prevention Rules (UX-AS)

| Rule ID   | Rule Name                  | Description                                                                                                                                                                                       | Target                    |
| --------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| UX-AS-001 | Auto-Save Interval         | P/M planning and roadmap editing auto-save user changes as a local draft every 60 seconds. The auto-save does not create a new version — it preserves unsaved edits in case of session loss.      | Every 60s                 |
| UX-AS-002 | Unsaved Changes Warning    | If a user navigates away from an editing page with unsaved changes, a browser confirmation dialog is shown: "You have unsaved changes. Are you sure you want to leave?"                           | On navigation/close       |
| UX-AS-003 | Session Recovery           | If a user's session is interrupted (network loss, browser crash) and they return within 30 minutes, their auto-saved local draft is restored. After 30 minutes, the local draft is discarded.     | 30-minute recovery window |
| UX-AS-004 | Save Conflict Notification | When a concurrent save conflict is detected, the user sees a clear modal dialog within 500ms showing: "Another planner has saved changes. Reviewing differences..." before the Diff Viewer opens. | < 500ms conflict notice   |

### 7.3 Error Handling Rules (UX-ERR)

| Rule ID    | Rule Name               | Description                                                                                                                                                                                                     | Target                |
| ---------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| UX-ERR-001 | Inline Validation       | Form validation errors are shown inline next to the field, in red text, immediately on blur or on save attempt. No alert dialogs for validation errors.                                                         | Inline, on blur       |
| UX-ERR-002 | Save Error Recovery     | If a save operation fails (server error), the user sees a toast notification: "Save failed. Your changes are preserved locally. Please try again." The unsaved changes are not lost.                            | Non-destructive error |
| UX-ERR-003 | Sync Error Isolation    | PROMIS or N-PLM sync failures do not block user actions. Sync runs asynchronously. If sync fails, the user is not interrupted. Admin is notified separately.                                                    | Async, non-blocking   |
| UX-ERR-004 | ES Unavailable Fallback | If Elasticsearch is unavailable, analytical dashboards show a graceful "Analytics temporarily unavailable. Data is being refreshed." message. Editing views (Oracle-backed) continue working normally.          | Graceful degradation  |
| UX-ERR-005 | AI Service Unavailable  | If Samsung AI Services is unavailable, the "Generate AI Report" button shows a tooltip: "AI service is currently unavailable. Please try again later or use manual reporting." The button is visually disabled. | Graceful disable      |
| UX-ERR-006 | Network Error Toast     | All network errors display a dismissible toast notification at the top-right of the screen. The toast auto-dismisses after 5 seconds.                                                                           | 5s auto-dismiss       |

### 7.4 Notification UX Rules (UX-NOT)

| Rule ID    | Rule Name                | Description                                                                                                                                                                             | Target            |
| ---------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| UX-NOT-001 | In-App Notification Bell | All event-driven notifications (approval needed, version approved, sync alerts) appear in an in-app notification bell icon with unread count badge.                                     | Real-time badge   |
| UX-NOT-002 | Notification Panel       | Clicking the bell opens a notification panel showing the last 50 notifications with timestamp, type icon, and one-line summary. Clicking a notification navigates to the relevant page. | Last 50 items     |
| UX-NOT-003 | Concurrent Edit Banner   | When another user is editing the same PM plan, a persistent info banner appears at the top of the Gantt view: "[User Name] is also editing this plan. Changes will be merged on save."  | Persistent banner |
| UX-NOT-004 | Approval Badge           | Managers see a badge on the "Approvals" menu item showing the count of pending approvals. The badge updates in real-time via WebSocket.                                                 | Real-time count   |
| UX-NOT-005 | Toast Duration           | Success toasts: 3 seconds auto-dismiss. Warning toasts: 5 seconds auto-dismiss. Error toasts: manual dismiss required (user must click X).                                              | 3s / 5s / manual  |

### 7.5 Accessibility & Usability Rules (UX-ACC)

| Rule ID    | Rule Name            | Description                                                                                                                                                                   | Target              |
| ---------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| UX-ACC-001 | Color-Blind Safe     | Diff View colors (green/red/yellow) must be supplemented with icons or patterns. Added: + icon, Removed: - icon, Modified: ~ icon. Never rely on color alone.                 | WCAG 2.1 AA         |
| UX-ACC-002 | Keyboard Navigation  | All major actions (save, submit, approve, reject, filter apply) must be accessible via keyboard shortcuts. Gantt widget must support keyboard navigation for task selection.  | Keyboard accessible |
| UX-ACC-003 | Loading States       | Every data-loading action shows a skeleton loader or spinner. No blank screens during data fetch. The loader appears within 100ms if data is not immediately available.       | < 100ms loader      |
| UX-ACC-004 | Empty States         | When a view has no data (new department, no allocations), show a clear empty state message with guidance: "No P/M plans exist for this period. Click 'Create Plan' to start." | Guided empty states |
| UX-ACC-005 | Responsive Tables    | All data tables support horizontal scrolling when content exceeds viewport width. Column headers remain sticky during horizontal scroll.                                      | Sticky headers      |
| UX-ACC-006 | Confirmation Dialogs | Destructive actions (discard draft, overwrite conflict, delete simulation) require explicit confirmation dialogs with clear primary and secondary action buttons.             | Confirm destructive |
| UX-ACC-007 | Consistent Layout    | Factor Control panel occupies a consistent position (left sidebar or top bar) across all pages. Its state is preserved across page navigation within a session.               | Persistent position |

### 7.6 Gantt-Specific UX Rules (UX-GANTT)

| Rule ID      | Rule Name               | Description                                                                                                                                                                                            | Target            |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| UX-GANTT-001 | Drag Precision          | Gantt task bar drag snaps to month boundaries. No sub-month precision — the minimum allocation unit is one calendar month.                                                                             | Month granularity |
| UX-GANTT-002 | Undo Support            | Gantt editing supports single-level undo (Ctrl+Z) for the last action. Undo reverts the last drag, cell edit, or task move.                                                                            | Single undo       |
| UX-GANTT-003 | Zoom Levels             | Gantt supports 3 zoom levels: Year view (12-month columns), Quarter view (3-month columns), Month view (individual month columns). Default zoom depends on context: Roadmap = Year, PM Plan = Quarter. | 3 zoom levels     |
| UX-GANTT-004 | Resource Row Highlight  | When a user hovers over a resource row, all related task bars across the timeline are highlighted. This helps identify scattered allocations.                                                          | Hover highlight   |
| UX-GANTT-005 | Allocation Color Coding | Task bars in Gantt are color-coded by allocation %: 0-50% = light blue, 51-80% = blue, 81-100% = dark blue, >100% = red (over-allocated).                                                              | Color by %        |

---

## Appendix A: Requirement Traceability

| Samsung Req# | Requirement                            | Features       | Use Cases        | Business Rules                  |
| ------------ | -------------------------------------- | -------------- | ---------------- | ------------------------------- |
| Req-0        | Enhance P/M Planner, upgrade Mendix 10 | F1, F3         | UC01             | BR-CON-_, BR-ROLE-_             |
| Req-1        | Separate Roadmap & Simulation          | F3             | UC02, UC03       | BR-VER-010                      |
| Req-2        | Version history, delta sync, diff view | F3, F6         | UC02, UC09, UC11 | BR-VER-_, BR-PROM-_             |
| Req-3        | Concurrent save, auto-merge, conflict  | F3             | UC01             | BR-CON-001 through BR-CON-010   |
| Req-4        | Roadmap + Simulation versioning        | F3             | UC02, UC03       | BR-VER-001 through BR-VER-010   |
| Req-5        | N-PLM integration (MDM)                | F1, F2         | UC07             | BR-NPLM-001 through BR-NPLM-008 |
| Req-6        | Factor Control filtering               | Cross-cutting  | UC08             | BR-FC-001 through BR-FC-007     |
| Req-7        | Main screen renewal (world map)        | F4             | UC04             | BR-FC-\*                        |
| Req-8        | Analysis views (world map, personal)   | F4, F5         | UC04, UC10       | BR-DATA-003, BR-DATA-004        |
| Req-9        | HeadCount Portfolio                    | F4             | UC06             | BR-HC-001 through BR-HC-006     |
| Req-10       | Analysis Reporting (periodic + manual) | F6             | UC05             | BR-NOT-003, BR-FC-\*            |
| Req-11       | AI-Based Reporting (Excel PIVOT)       | F7             | UC05 (AI flow)   | —                               |
| Req-12       | Server install & config                | Infrastructure | —                | —                               |

## Appendix B: Glossary

| Term                    | Definition                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| P/M (Personnel Monthly) | Monthly effort allocation of an employee to a project/task                                  |
| Draft                   | Version state — editable, not yet submitted for approval                                    |
| Permanent               | Approved version that represents the official plan                                          |
| Delta Sync              | Transmitting only records that changed between two versions (not full dataset)              |
| Soft Lock               | Awareness indicator that a user is editing; does not prevent concurrent access              |
| Auto-Merge              | Automatic combination of non-conflicting changes from concurrent editors                    |
| Factor Control          | Universal filter panel with multi-dimensional filtering (site, dept, BU, time, etc.)        |
| Diff View               | Side-by-side visual comparison of two versions showing added, removed, and modified records |
| Simulation              | What-if scenario cloned from an approved roadmap, with independent versioning               |
| PROMIS_Synced           | Flag on a version indicating successful delta sync to PROMIS                                |
| SUS                     | System Usability Scale — standardized usability score (0-100, target >= 68)                 |
| HC                      | HeadCount — staffing numbers by grade and skill category                                    |

---

## Sources

- Samsung IRIS Customer Note (Requirements 0-12)
- Input: [03-business-modeling.md](../.command/000_init_project/input/docs/03-business-modeling.md)
- Input: [04-process-modeling.md](../.command/000_init_project/input/docs/04-process-modeling.md)
- Input: [01-solution-architecture.md](../.command/000_init_project/input/docs/01-solution-architecture.md)
- Input: [05-data-sync-etl.md](../.command/000_init_project/input/docs/05-data-sync-etl.md)
- Input: [features_list.txt](../.command/000_init_project/input/features_list.txt)
- AX Framework: DEVELOP Phase — Analysis Handoff A1
- DISCOVER Phase Deliverables: Gate 1 GO (4.90/5.00)
- DESIGN Phase Deliverables: Gate 2 GO (4.70/5.00), SUS 74
