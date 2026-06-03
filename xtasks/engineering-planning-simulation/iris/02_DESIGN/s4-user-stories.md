# S4: User Stories — IRIS

> **AX Phase**: DESIGN | **Template**: T15 — User Story
> **System**: IRIS (Intelligent Resources Information System)
> **Customer**: Samsung Electronics — Device Solutions Research (DSR)
> **Date**: 2026-03-21
> **Author**: CXO with AI assistance
> **Status**: Draft
> **Classification**: DESIGN deliverable — Complete user story backlog for IRIS new build

---

## Document Purpose

This document contains the complete user story backlog for IRIS, decomposed from validated concepts (S1/S3) across 13 epics (E01-E13). Each story references Samsung DSR personas, feature areas (F1-F7), and Samsung requirements (Req 0-12). Stories are estimated in Fibonacci story points and prioritized using MoSCoW. CXO UX notes are included for interaction patterns, accessibility, and responsive behavior considerations.

---

## Personas Reference

| Alias      | Name        | Role                    | Site       | Primary Epics           |
| ---------- | ----------- | ----------------------- | ---------- | ----------------------- |
| **Jisoo**  | Jisoo Park  | Senior Resource Planner | Hwaseong   | E01, E02, E03, E04, E05 |
| **Minho**  | Minho Kim   | Planning Manager        | Pyeongtaek | E03, E04, E05, E12      |
| **Eunji**  | Eunji Lee   | Analytics Specialist    | Hwaseong   | E08, E09, E10           |
| **Soyeon** | Soyeon Choi | HR Portfolio Manager    | Hwaseong   | E06, E07                |

### Additional Actors

| Actor                | Scope                                            |
| -------------------- | ------------------------------------------------ |
| **Site Admin**       | Master data management, Factor Control templates |
| **System Admin**     | Infrastructure, server setup, monitoring         |
| **Division Manager** | Cross-department oversight, approval escalation  |

---

## Epic Summary

| Epic | Name                          | Feature | Req     | Stories | Total SP |
| ---- | ----------------------------- | ------- | ------- | ------- | -------- |
| E01  | Master Data & Standard PM     | F1      | 0, 5    | 8       | 39       |
| E02  | Project/Product Management    | F2      | 5       | 5       | 26       |
| E03  | P/M Planner Concurrent Edit   | F1, F3  | 0, 3    | 9       | 55       |
| E04  | Resource Roadmap & Versioning | F3      | 1, 2, 4 | 8       | 47       |
| E05  | Resource Simulation           | F3      | 1, 4    | 6       | 34       |
| E06  | HeadCount Portfolio           | F4      | 9       | 5       | 23       |
| E07  | World Map & Navigation        | F4      | 7, 8    | 6       | 28       |
| E08  | Analysis & Reporting          | F5, F6  | 8, 10   | 7       | 38       |
| E09  | AI-Based Reporting            | F7      | 11      | 4       | 21       |
| E10  | Factor Control                | —       | 6       | 4       | 16       |
| E11  | Integration                   | F1, F2  | 2, 5    | 6       | 34       |
| E12  | Smart Notifications           | F6      | 10      | 3       | 11       |
| E13  | Infrastructure & Server Setup | —       | 12      | 3       | 16       |
|      | **TOTAL**                     |         |         | **74**  | **388**  |

---

## E01: Master Data & Standard PM

### US-E01-001 | Manage Organization Hierarchy

**Epic:** E01 — Master Data & Standard PM
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1 | **Req:** 0

> As a **Resource Planner**, I want to **view and manage the organization hierarchy (Production Line > Site > Division > Department > Team > Group > Part)**, so that **all P/M allocations reference accurate organizational units**.

**Acceptance Criteria:**

1. **Given** I am on the Master Data screen, **When** I navigate to Organization Hierarchy, **Then** I see a tree view showing all levels from Production Line down to Part with current employee counts per node.
2. **Given** I have Admin or Master Data Editor role, **When** I add a new Team under an existing Department, **Then** the tree updates immediately and the new Team is available in all downstream selectors (P/M Planner, Roadmap, Analysis).
3. **Given** an org unit has active P/M allocations, **When** I attempt to deactivate it, **Then** the system warns me with a count of affected allocations and requires confirmation before proceeding.

**Story Points:** 5
**Priority:** Must
**Dependencies:** E13-001 (QA environment), US-E11-002 (SMDM/GHRP sync for org data)
**CXO UX Notes:** Tree widget must support lazy loading for large hierarchies (1000+ nodes). Breadcrumb navigation at the top for context. Keyboard navigation support (arrow keys to expand/collapse). Responsive: tree collapses to accordion on tablet viewports.

---

### US-E01-002 | Manage Standard PM Templates

**Epic:** E01 — Master Data & Standard PM
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1 | **Req:** 0

> As a **Resource Planner**, I want to **create and edit Standard PM templates (defining default P/M values by dimension: Stage, Block, Function, Activity, SW/HW)**, so that **new projects start with baseline allocations instead of blank plans**.

**Acceptance Criteria:**

1. **Given** I am on the Standard PM Management screen, **When** I create a new Standard PM template, **Then** I can define PM values across dimensions (Stage, Block, Function, Activity, SW/HW, SwWorkItem) with Shift and PM values per cell.
2. **Given** a Standard PM template exists, **When** I edit a PM value and save, **Then** a new revision is created automatically with timestamp, editor name, and the previous values preserved in revision history.
3. **Given** I select a Production Type, **When** I associate a Standard PM template, **Then** new projects of that type auto-populate with the template's PM allocations.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E01-001 (org hierarchy must exist)
**CXO UX Notes:** Data grid with inline editing — Tab key moves between cells, Enter commits. Cell focus state clearly visible (blue border). Invalid values show inline validation error (red underline + tooltip). Undo on Ctrl+Z within session.

---

### US-E01-003 | View Revision History for Standard PMs

**Epic:** E01 — Master Data & Standard PM
**Persona:** Minho Kim (Planning Manager)
**Feature:** F1 | **Req:** 0

> As a **Planning Manager**, I want to **view the full revision history of any Standard PM template**, so that **I can audit who changed what and when, and revert if needed**.

**Acceptance Criteria:**

1. **Given** I open a Standard PM template, **When** I click "Revision History", **Then** I see a chronological list of all revisions with: version number, date, editor, and change summary (cells added/modified/removed).
2. **Given** I select two revisions, **When** I click "Compare", **Then** I see a diff view with color-coded changes (green = added, red = removed, yellow = modified) at the cell level.
3. **Given** I identify an incorrect revision, **When** I click "Revert to this version", **Then** the system creates a new revision that restores the selected version's values (non-destructive revert).

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E01-002
**CXO UX Notes:** Diff colors must meet WCAG 2.1 AA contrast (not rely solely on color — add icons: plus for added, minus for removed, delta for modified). Timeline list uses relative timestamps ("2 hours ago"). Revert requires double confirmation.

---

### US-E01-004 | CRUD Production Types with Standard Milestones

**Epic:** E01 — Master Data & Standard PM
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1 | **Req:** 0

> As a **Resource Planner**, I want to **create and manage Production Types with standard milestones (MTO, KO) and timelines (KO, ES, CS, SRA, PmStart, PmEnd)**, so that **every project follows a consistent structure**.

**Acceptance Criteria:**

1. **Given** I am on Production Type management, **When** I create a new type, **Then** I can define: Code, Name, standard milestones, and timeline fields (KO, ES, CS, SRA, PmStart, PmEnd).
2. **Given** a Production Type exists, **When** I edit its milestones, **Then** all projects using this type are notified of the template change but existing project data is not overwritten.
3. **Given** I need Extra RF Type or Extra Certification Type data, **When** I create these types, **Then** they share the same attribute structure as Standard Production Types.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E01-001
**CXO UX Notes:** Form layout uses progressive disclosure — required fields visible immediately, advanced fields (Extra RF, Extra Certification) behind expandable section. Date fields use Samsung-standard date picker (YYYY-MM-DD format).

---

### US-E01-005 | Manage Employee Skills and Profiles

**Epic:** E01 — Master Data & Standard PM
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1 | **Req:** 0

> As a **Resource Planner**, I want to **view and manage employee skill profiles (linked to org hierarchy and skill dimensions)**, so that **I can match resource capabilities to project requirements during planning**.

**Acceptance Criteria:**

1. **Given** I search for an employee, **When** results display, **Then** I see: name, ID, department, team, skill group (Stage/Block/Function), and current allocation status.
2. **Given** GHRP data has been synced, **When** I view an employee profile, **Then** GHRP-sourced fields are read-only with a "Synced from GHRP" indicator and last-sync timestamp.
3. **Given** I need to add a locally-managed skill tag, **When** I edit the profile, **Then** I can add custom skill dimensions that are tracked separately from GHRP data.

**Story Points:** 3
**Priority:** Should
**Dependencies:** US-E01-001, US-E11-004 (GHRP sync)
**CXO UX Notes:** Search with autocomplete (debounced, 300ms). Profile card layout: photo placeholder, key info left, skills right. Read-only fields visually distinct (grey background, lock icon). Mobile: profile cards stack vertically.

---

### US-E01-006 | Sync Master Data from N-PLM/SMDM/GHRP

**Epic:** E01 — Master Data & Standard PM
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1 | **Req:** 5

> As a **Resource Planner**, I want **master data (org structure, production types, employee profiles) to automatically sync from N-PLM, SMDM, and GHRP**, so that **IRIS always reflects the latest Samsung-wide data without manual re-entry**.

**Acceptance Criteria:**

1. **Given** the scheduled sync runs daily at 02:00 KST, **When** new org units are added in SMDM, **Then** they appear in IRIS org hierarchy within 24 hours with a "New — pending review" indicator.
2. **Given** a conflict exists between synced data and a local manual override, **When** the sync detects it, **Then** the conflict is flagged for manual resolution with a side-by-side comparison of IRIS local vs. source system values.
3. **Given** I want to check sync health, **When** I open the Integration Dashboard, **Then** I see last sync timestamp, record counts (synced/failed/skipped), and error details for each source system.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E11-002, US-E11-004, US-E13-001
**CXO UX Notes:** "New — pending review" badge uses attention-drawing but non-alarming style (blue badge, not red). Conflict resolution UI: split-pane with "Keep IRIS" / "Accept Source" buttons. Sync status uses traffic-light icons with tooltips.

---

### US-E01-007 | Search and Filter Master Data

**Epic:** E01 — Master Data & Standard PM
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1 | **Req:** 0

> As a **Resource Planner**, I want to **search and filter across all master data (org units, production types, employees, Standard PMs) using full-text search**, so that **I can quickly find the data I need**.

**Acceptance Criteria:**

1. **Given** I type in the global search bar, **When** I enter 3+ characters, **Then** autocomplete suggests matching results across org units, production types, employees, and Standard PM templates — grouped by category.
2. **Given** I apply a filter on the Production Types list, **When** I select "Extra RF" type category, **Then** only Extra RF production types display, with result count shown.
3. **Given** search results are returned, **When** I click a result, **Then** I navigate directly to that entity's detail view.

**Story Points:** 3
**Priority:** Should
**Dependencies:** US-E01-001, US-E01-002, US-E13-003 (Elasticsearch)
**CXO UX Notes:** Global search bar persistent in top navigation (Cmd/Ctrl+K shortcut). Results grouped with category headers and icons. Keyboard navigation through results (arrow keys + Enter). Empty state: "No results — try broadening your search."

---

### US-E01-008 | Manage Dimension Hierarchies for PM

**Epic:** E01 — Master Data & Standard PM
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1 | **Req:** 0

> As a **Resource Planner**, I want to **manage the dimension hierarchies used in PM allocation (Stage, Block, Function, Activity, SW/HW, SwWorkItem, Others)**, so that **all planning views use consistent, up-to-date dimension values**.

**Acceptance Criteria:**

1. **Given** I open Dimension Management under Master Data, **When** I select a dimension type (e.g., Stage), **Then** I see all values in that dimension with status (Active/Inactive), usage count, and last modified date.
2. **Given** I add a new value to the "Block" dimension, **When** I save, **Then** the new value is immediately available in all PM template editors, P/M Planner filters, and Factor Control selectors.
3. **Given** a dimension value is in use by active allocations, **When** I attempt to deactivate it, **Then** the system shows the count of affected allocations and requires confirmation, preserving existing data while hiding the value from new selections.
4. **Given** I want to reorder dimension values, **When** I drag-and-drop items in the list, **Then** the display order updates across all views that render these dimensions.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E01-001
**CXO UX Notes:** Drag-and-drop reordering with clear grab handle affordance. Deactivated items shown with strikethrough in management view but hidden in selectors. Bulk import option for initial setup (Excel upload).

---

## E02: Project/Product Management

### US-E02-001 | Manage Project Lifecycle

**Epic:** E02 — Project/Product Management
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F2 | **Req:** 5

> As a **Resource Planner**, I want to **create and manage projects with full lifecycle tracking (Open, In Progress, Drop, Hold/Release Hold)**, so that **all resource allocations are tied to active, governed projects**.

**Acceptance Criteria:**

1. **Given** I create a new project, **When** I fill in required fields (Code, Name, Plan End Date, Product Line, Product, Application, Type, Leader, Manager, Status), **Then** the project is created with status "Open" and appears in the project list.
2. **Given** a project is "In Progress", **When** the manager changes status to "Hold", **Then** all associated P/M allocations are visually flagged as "On Hold" in the Roadmap and Gantt views, and a notification is sent to assigned planners.
3. **Given** I view the project detail, **When** I check the timeline section, **Then** I see milestone dates (KO, ES, CS, SRA, PmStart, PmEnd) populated from the project's Production Type template with manual override capability.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E01-004 (Production Types)
**CXO UX Notes:** Project creation uses a multi-step wizard (3 steps: Basic Info, Timeline, Team Assignment). Status transitions use a state machine visualization (clickable status badges). "Hold" state applies a muted overlay to all associated views.

---

### US-E02-002 | View Actual PM Records per Project

**Epic:** E02 — Project/Product Management
**Persona:** Minho Kim (Planning Manager)
**Feature:** F2 | **Req:** 5

> As a **Planning Manager**, I want to **view actual P/M records per project (Department/Team/Group/Part, Activity, Actual PM, Actual YYYYMM)**, so that **I can compare planned vs. actual resource consumption**.

**Acceptance Criteria:**

1. **Given** I open a project's detail view, **When** I navigate to the "Actuals" tab, **Then** I see a grid showing actual PM records: Dept(Line)/Team/Group/Part, Activity, Actual PM value, and Actual Period (YYYYMM).
2. **Given** actual data has been synced from N-PLM, **When** I view the Actuals tab, **Then** each record shows a "Source: N-PLM" badge with sync timestamp.
3. **Given** I want to compare plan vs. actual, **When** I toggle "Show Planned" overlay, **Then** the grid displays both planned P/M (from Roadmap) and actual P/M side by side with variance highlighting (green = under plan, red = over plan).

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E02-001, US-E11-002 (N-PLM sync)
**CXO UX Notes:** Variance highlighting uses color + directional arrows (up-arrow red for over, down-arrow green for under) to avoid reliance on color alone. Toggle button for "Show Planned" clearly indicates active state. Export to Excel available.

---

### US-E02-003 | Sync Project Data Bidirectionally with N-PLM

**Epic:** E02 — Project/Product Management
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F2 | **Req:** 5

> As a **Resource Planner**, I want **project information and status to sync bidirectionally between IRIS and N-PLM**, so that **both systems stay consistent without manual data re-entry**.

**Acceptance Criteria:**

1. **Given** a project is created in N-PLM, **When** the scheduled sync runs, **Then** the project appears in IRIS with all N-PLM fields populated and a "Synced from N-PLM" indicator.
2. **Given** I update a project's status in IRIS to "Confirmed", **When** the outbound sync runs, **Then** the updated status and confirmed P/M schedule are pushed to N-PLM with a sync confirmation log entry.
3. **Given** a sync conflict occurs (project updated in both systems), **When** the conflict is detected, **Then** it is flagged in the Integration Dashboard with side-by-side values for manual resolution.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E11-001, US-E11-003, US-E02-001
**CXO UX Notes:** Sync status indicator always visible in project header (small icon: green check = synced, yellow spinner = syncing, red exclamation = conflict). Conflict resolution dialog: two-column layout, highlight differences, one-click resolution.

---

### US-E02-004 | Track Project Leaders, Managers, and Responsibility

**Epic:** E02 — Project/Product Management
**Persona:** Minho Kim (Planning Manager)
**Feature:** F2 | **Req:** 5

> As a **Planning Manager**, I want to **assign and track project leaders, managers, and responsible parties**, so that **accountability is clear and approval workflows route correctly**.

**Acceptance Criteria:**

1. **Given** I edit a project, **When** I assign a Leader, Manager, and Responsibility fields, **Then** those users appear in the project header and receive role-based permissions for that project.
2. **Given** I am assigned as a project Manager, **When** a planner submits a Roadmap version for approval, **Then** I receive an approval notification and can approve/reject from the notification or project detail view.
3. **Given** I view the project list, **When** I filter by "My Projects", **Then** I see only projects where I am assigned as Leader, Manager, or Responsibility.

**Story Points:** 3
**Priority:** Should
**Dependencies:** US-E02-001, US-E01-005
**CXO UX Notes:** People picker with avatar, name, and department. Assigned users shown as avatar chips in project header. "My Projects" filter as a prominent toggle (not buried in filter panel). Role assignment change triggers confirmation if it affects active approvals.

---

### US-E02-005 | Project Dashboard with Status Overview

**Epic:** E02 — Project/Product Management
**Persona:** Minho Kim (Planning Manager)
**Feature:** F2 | **Req:** 5

> As a **Planning Manager**, I want a **project dashboard showing all projects with status, timeline progress, and resource allocation summary**, so that **I can quickly identify projects that need attention**.

**Acceptance Criteria:**

1. **Given** I open the Project Dashboard, **When** it loads, **Then** I see a sortable/filterable table of all projects with: Code, Name, Status (color-coded), Type, Leader, Timeline (Gantt bar from KO to PmEnd), and Total PM allocated.
2. **Given** a project's actual progress is behind the planned timeline by more than 2 weeks, **When** the dashboard renders, **Then** that project row is highlighted with an amber warning indicator.
3. **Given** I click on a project row, **When** the detail view opens, **Then** I see the full project information with tabs for Timeline, Allocations, Actuals, Versions, and Integration Status.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E02-001, US-E02-002
**CXO UX Notes:** Dashboard uses data grid with conditional formatting. Inline Gantt bar rendered with xDHTML micro-view. Status column uses colored chips (green/amber/red/grey). Responsive: on tablet, Gantt column collapses to date text. Filter persistence across sessions.

---

## E03: P/M Planner Concurrent Edit

### US-E03-001 | Open P/M Plan and See Active Editors

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F3 | **Req:** 0, 3

> As a **Resource Planner**, I want to **see who else is currently editing the same P/M plan when I open it**, so that **I am aware of concurrent activity and can coordinate if needed**.

**Acceptance Criteria:**

1. **Given** I open a P/M plan for editing, **When** other planners are also editing the same plan, **Then** I see avatar badges in the plan header showing their name, role, and the section/cells they are currently editing.
2. **Given** another planner joins the same plan after I opened it, **When** they begin editing, **Then** their avatar badge appears within 3 seconds via WebSocket push.
3. **Given** a planner leaves the plan (navigates away or closes browser), **When** their session ends, **Then** their avatar badge disappears within 10 seconds.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E13-001, US-E13-003 (WebSocket infrastructure)
**CXO UX Notes:** Avatar badges show initials + department color. Cursor position of other editors shown as colored border on the cell they are editing (Google Sheets pattern). Presence indicator uses subtle animation on join/leave. Screen reader announces "Minho Kim joined editing."

---

### US-E03-002 | Edit Allocation Cells with Real-time Sync

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F3 | **Req:** 0, 3

> As a **Resource Planner**, I want to **edit P/M allocation cells and see other planners' changes reflected in near real-time**, so that **we can work on the same plan concurrently without overwriting each other**.

**Acceptance Criteria:**

1. **Given** I edit a cell (Shift or PM value) in the P/M plan, **When** I commit the cell (Tab or Enter), **Then** other active editors see my change within 2 seconds with a brief highlight animation indicating the changed cell and who changed it.
2. **Given** another planner edits a cell I am not currently editing, **When** their change arrives via WebSocket, **Then** the cell updates visually with their value and a "Changed by [Name]" tooltip on hover.
3. **Given** network latency exceeds 5 seconds, **When** my edit cannot be synced, **Then** a warning indicator appears on the cell with "Sync pending" status and the edit is queued for retry.
4. **Given** I am working on the P/M plan, **When** my network connection drops, **Then** I see a non-blocking banner "Offline — changes will sync when reconnected" and can continue editing locally.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E03-001
**CXO UX Notes:** Change animation: brief yellow flash (300ms fade) on remote cell updates. "Sync pending" uses a spinning icon in the cell corner. Offline banner uses amber background, non-dismissible until reconnected. Cell edit input auto-selects content on focus for rapid data entry.

---

### US-E03-003 | Detect and Resolve Cell Conflicts

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F3 | **Req:** 3

> As a **Resource Planner**, I want the **system to detect when two planners edit the same cell simultaneously and present a clear conflict resolution dialog**, so that **no data is silently lost**.

**Acceptance Criteria:**

1. **Given** two planners edit the same cell within a 2-second window, **When** a conflict is detected, **Then** both planners see a conflict indicator (pulsing amber border) on that cell.
2. **Given** I click the conflicted cell, **When** the conflict resolution dialog opens in the cell context menu, **Then** I see: my value, their value, original value, both editors' names, and timestamps — with options to "Keep Mine" or "Accept Theirs".
3. **Given** I resolve the conflict by choosing "Keep Mine", **When** the resolution is applied, **Then** the other planner is notified that their change was overridden and sees the resolved value.
4. **Given** multiple conflicts exist in the plan, **When** I click "View All Conflicts" in the toolbar, **Then** I see a panel listing all conflicted cells with batch resolution options: "Keep All Mine", "Accept All Theirs", or resolve individually.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E03-002
**CXO UX Notes:** Conflict resolution in cell context menu (not a separate modal) per S3 finding C1. Batch conflict panel as slide-in from the right. Pulsing amber border is attention-grabbing but not alarming. Each conflict row shows mini preview of values. Keyboard shortcut: Ctrl+Shift+C opens conflict panel.

---

### US-E03-004 | Save P/M Plan as Draft or Permanent Version

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F3 | **Req:** 3

> As a **Resource Planner**, I want to **save my P/M plan edits as either a Draft (pending approval) or Permanent (auto-approved for authorized roles)**, so that **the system enforces Samsung DSR's governance model**.

**Acceptance Criteria:**

1. **Given** I have made edits to a P/M plan, **When** I click "Save", **Then** I see options: "Save as Draft" (creates a draft version pending manager approval) and "Save as Permanent" (only visible if my role has direct-save permission).
2. **Given** I save as Draft, **When** the draft is created, **Then** the plan shows a "Draft v[X] — Pending Approval" badge, and my edits are visible only to me and the assigned approver until approved.
3. **Given** I save and a diff exists between my version and the last permanent version, **When** the save dialog opens, **Then** I see a diff view showing all my changes vs. the last permanent version before confirming the save.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E03-002, US-E03-003
**CXO UX Notes:** Save dialog uses a split-pane diff view (before/after). "Save as Permanent" button styled differently (primary blue) from "Save as Draft" (secondary outline) to prevent accidental permanent saves. Unsaved changes indicator (dot on tab title).

---

### US-E03-005 | Submit P/M Plan for Manager Approval

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F3 | **Req:** 3

> As a **Resource Planner**, I want to **submit my Draft P/M plan to my manager for approval**, so that **the plan follows the required review process before becoming permanent**.

**Acceptance Criteria:**

1. **Given** I have a Draft version of a P/M plan, **When** I click "Submit for Approval", **Then** the system routes the approval request to the assigned project Manager (from US-E02-004) and sends an email notification.
2. **Given** I am the assigned Manager, **When** I receive an approval request, **Then** I can open the draft, review the diff view (vs. last permanent), and click "Approve" (saves as Permanent) or "Reject" (returns to planner with comments).
3. **Given** the Manager approves, **When** approval is confirmed, **Then** the Draft becomes the new Permanent version, all active editors see the updated plan, and an audit log entry is created.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E03-004, US-E12-001 (email notification)
**CXO UX Notes:** Approval request includes a mandatory comment field for context. Reject requires a reason (mandatory text). Approval panel has prominent Approve (green) and Reject (red) buttons with confirmation step. Approval history visible as a timeline below the diff.

---

### US-E03-006 | View Gantt Timeline of P/M Allocations

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 0

> As a **Resource Planner**, I want to **view P/M allocations as a Gantt timeline (time on X-axis, resources/tasks on Y-axis)**, so that **I can visually understand resource loading across months and identify gaps or overallocations**.

**Acceptance Criteria:**

1. **Given** I open the P/M Planner view, **When** I switch to "Gantt View", **Then** I see a timeline showing allocations per resource/project with monthly granularity, using xDHTML Gantt rendering.
2. **Given** a resource is overallocated (total PM > available capacity) in a given month, **When** the Gantt renders, **Then** that cell/bar is highlighted in red with a tooltip showing "Overallocated: [X] PM over capacity".
3. **Given** I want to adjust the time range, **When** I use the zoom controls, **Then** the Gantt supports quarterly, monthly, and weekly views with smooth transitions.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E03-002, US-E01-002
**CXO UX Notes:** Gantt bars use color intensity to indicate utilization level (light = low, dark = full, red = over). Zoom controls as +/- buttons and a slider. Today marker as a vertical red dashed line. Print-friendly view available. Touch support for scroll and zoom on tablets.

---

### US-E03-007 | Filter P/M Plan by Factor Control Dimensions

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F3 | **Req:** 0, 6

> As a **Resource Planner**, I want to **filter the P/M plan view using Factor Control dimensions (Stage, Block, Function, Activity, SW/HW, etc.)**, so that **I can focus on specific segments without visual overload**.

**Acceptance Criteria:**

1. **Given** I am in the P/M Planner, **When** I open the Factor Control panel, **Then** I see all available dimension filters with checkboxes and search for each dimension.
2. **Given** I select "Stage 2" and "Block B" as Factor Control filters, **When** I apply them, **Then** the P/M plan grid shows only allocations matching those dimensions, with a filter chip bar showing active filters.
3. **Given** I have saved a Factor Control preset (from US-E10-003), **When** I select it from the preset dropdown, **Then** all saved filters are applied instantly.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E03-006, US-E10-001
**CXO UX Notes:** Filter chip bar below toolbar — each chip has an "x" to remove individual filters. "Clear All" button at the end of chip bar. Filter panel slides in from the right, does not obscure the grid. Applied filter count shown as badge on filter button.

---

### US-E03-008 | Undo/Redo Edits in P/M Plan Session

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F3 | **Req:** 0

> As a **Resource Planner**, I want to **undo and redo my own edits within the current editing session**, so that **I can safely experiment with allocation changes without fear of losing my previous values**.

**Acceptance Criteria:**

1. **Given** I have edited cells in the P/M plan, **When** I press Ctrl+Z, **Then** my last edit is undone and the cell reverts to its previous value (my previous value, not another planner's).
2. **Given** I have undone an edit, **When** I press Ctrl+Y, **Then** the edit is re-applied.
3. **Given** I undo an edit that was already synced to other editors, **When** the undo is applied, **Then** other editors see the cell revert and a "Reverted by [Name]" indicator appears briefly.

**Story Points:** 3
**Priority:** Could
**Dependencies:** US-E03-002
**CXO UX Notes:** Undo/redo buttons in toolbar with visible state (greyed out when stack empty). Stack depth: 50 operations. Undo tooltip shows "Undo: change cell [X,Y] from [old] to [new]". Does not cross session boundaries. Redo stack clears if a new edit is made after undo.

---

### US-E03-009 | Bulk Import/Export P/M Allocations

**Epic:** E03 — P/M Planner Concurrent Edit
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F3 | **Req:** 0

> As a **Resource Planner**, I want to **bulk import P/M allocations from Excel and export the current plan to Excel**, so that **I can work offline or integrate with other tools when needed**.

**Acceptance Criteria:**

1. **Given** I have an Excel file following the IRIS P/M template format, **When** I upload it via "Import from Excel", **Then** the system validates the data (org units, dimensions, PM values) and shows a preview with error highlighting before committing.
2. **Given** I want to export the current P/M plan, **When** I click "Export to Excel", **Then** the system generates an Excel file matching the IRIS template format with all current allocations, filters applied, and metadata headers.
3. **Given** the import contains rows that conflict with existing allocations, **When** the preview renders, **Then** conflicting rows are highlighted with "Existing value: [X], Import value: [Y]" and I can choose to skip or overwrite each.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E03-006
**CXO UX Notes:** Import preview as a full-screen modal with scrollable table. Error rows highlighted in red with inline error messages. Progress bar during import. "Download Template" link prominently placed. Export respects current Factor Control filters — export button tooltip states the active scope.

---

## E04: Resource Roadmap & Versioning

### US-E04-001 | Create New Roadmap Version

**Epic:** E04 — Resource Roadmap & Versioning
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 1, 4

> As a **Resource Planner**, I want to **create a new version of a Resource Roadmap for a specific project**, so that **I can propose allocation changes while preserving the history of all previous versions**.

**Acceptance Criteria:**

1. **Given** I am viewing an approved Roadmap for a project, **When** I click "Create New Version", **Then** a new draft version is created with all allocations copied from the latest approved version, and a version number is auto-assigned (e.g., v3.1).
2. **Given** the new version is created, **When** I view the version panel, **Then** I see the new draft at the top of the version list with status "Draft", my name as author, and creation timestamp.
3. **Given** I edit allocations in the new draft version, **When** I save, **Then** only the draft version is modified — the approved version remains unchanged and read-only.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E03-004, US-E02-001
**CXO UX Notes:** "Create New Version" button uses a branch/fork icon metaphor. Version panel as a sidebar with timeline visualization. Draft badge prominently displayed in plan header. Visual distinction between draft (yellow border) and approved (green border) versions.

---

### US-E04-002 | View Version History with Timeline

**Epic:** E04 — Resource Roadmap & Versioning
**Persona:** Minho Kim (Planning Manager)
**Feature:** F3 | **Req:** 2, 4

> As a **Planning Manager**, I want to **view the complete version history of a project's Resource Roadmap as a timeline**, so that **I can track how the plan has evolved over time**.

**Acceptance Criteria:**

1. **Given** I open a project's Roadmap, **When** I click "Version History", **Then** I see a vertical timeline showing all versions with: version number, status (Draft/Approved/Rejected), author, date, and change summary.
2. **Given** the timeline has more than 10 versions, **When** I scroll, **Then** older versions load progressively with smooth infinite scroll.
3. **Given** I click on any version in the timeline, **When** the version loads, **Then** I see the full Roadmap allocations for that point-in-time (read-only for non-draft versions).

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E04-001
**CXO UX Notes:** Timeline uses a vertical rail with nodes (circles for approved, diamonds for draft, X for rejected). Change summary auto-generated: "12 allocations modified across 3 departments." Clicking a version opens it in the main content area. Current version highlighted with "You are here" marker.

---

### US-E04-003 | Compare Two Roadmap Versions (Diff View)

**Epic:** E04 — Resource Roadmap & Versioning
**Persona:** Minho Kim (Planning Manager)
**Feature:** F3 | **Req:** 2

> As a **Planning Manager**, I want to **compare two versions of a project's Resource Roadmap side by side with a diff view**, so that **I can see exactly what changed between versions before approving**.

**Acceptance Criteria:**

1. **Given** I am in Version History, **When** I select two versions and click "Compare", **Then** a side-by-side diff view opens showing: left = older version, right = newer version, with color-coded changes (green = added, red = removed, yellow = modified).
2. **Given** the diff view is open, **When** I look at the header, **Then** I see a change summary: "X allocations added, Y removed, Z modified across N departments".
3. **Given** I want to focus on a specific department, **When** I apply a department filter in the diff view, **Then** only changes within that department are shown.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E04-002
**CXO UX Notes:** Diff color coding paired with icons (plus/minus/delta) for accessibility. Department filter as a dropdown at the top of diff view. Summary stats bar is sticky at top during scroll. "Show unchanged rows" toggle (default: hidden) to reduce visual noise.

---

### US-E04-004 | Submit Roadmap Version for Approval

**Epic:** E04 — Resource Roadmap & Versioning
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 4

> As a **Resource Planner**, I want to **submit a draft Roadmap version for manager approval**, so that **the plan follows Samsung DSR's governance process before it can be synced to PROMIS**.

**Acceptance Criteria:**

1. **Given** I have a Draft Roadmap version with all allocations finalized, **When** I click "Submit for Approval", **Then** the system routes the request to the project Manager and sends an email notification with a deep link to the diff view.
2. **Given** I am the approving Manager, **When** I open the approval request, **Then** I see the diff view (vs. last approved version) with an approval panel where I can add a comment and click "Approve" or "Reject".
3. **Given** the Manager approves, **When** approval is confirmed, **Then** the version status changes to "Approved", it becomes the new baseline, and the delta sync to PROMIS is queued (US-E11-001).

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E04-003, US-E12-001
**CXO UX Notes:** Submission requires a summary comment (mandatory, min 10 characters). Approval panel pinned to the right side of the diff view. Approve/Reject buttons require double-click or confirmation dialog for safety. Approval status reflected immediately in all connected sessions.

---

### US-E04-005 | Trigger Delta Sync to PROMIS on Approval

**Epic:** E04 — Resource Roadmap & Versioning
**Persona:** Minho Kim (Planning Manager)
**Feature:** F3 | **Req:** 2

> As a **Planning Manager**, I want **only changed project allocations to be synced to PROMIS when a Roadmap version is approved**, so that **we stop sending unchanged data and reduce PROMIS processing time**.

**Acceptance Criteria:**

1. **Given** a Roadmap version is approved, **When** the delta sync is triggered, **Then** only allocations that differ from the last synced version are sent to PROMIS (not the full roadmap).
2. **Given** the sync is in progress, **When** I view the Integration Dashboard, **Then** I see real-time sync status: "Syncing X of Y changed records to PROMIS" with a progress indicator.
3. **Given** the sync completes successfully, **When** I view the version in Version History, **Then** it shows a "Synced to PROMIS" badge with timestamp and record count.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E04-004, US-E11-001
**CXO UX Notes:** Sync progress shown as a progress bar with percentage and record count. "Synced to PROMIS" badge uses a cloud-check icon. If sync fails, the badge changes to a red cloud-x icon with a "Retry" action. Non-blocking: user can continue working during sync.

---

### US-E04-006 | Manage Allocation Entries per Resource per Period

**Epic:** E04 — Resource Roadmap & Versioning
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 1

> As a **Resource Planner**, I want to **add, edit, and remove allocation entries for specific resources within a Roadmap version, specifying PM values per period (month)**, so that **I can build detailed resource plans**.

**Acceptance Criteria:**

1. **Given** I am editing a draft Roadmap version, **When** I click on a resource row for a specific month, **Then** I can enter or modify the PM allocation value (Shift + PM) with inline editing.
2. **Given** I add a new allocation for a resource not yet in the Roadmap, **When** I search and select the resource from the master data, **Then** a new row is added to the Roadmap with empty cells ready for PM entry.
3. **Given** I want to remove a resource from the Roadmap, **When** I select the row and click "Remove", **Then** the allocation is soft-deleted (marked as removed in the draft, visible in diff view, reversible before save).

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E04-001, US-E01-002
**CXO UX Notes:** Inline cell editing with numeric input validation (max 2 decimal places). Resource search with autocomplete showing name, department, and current allocation status. Soft-deleted rows shown with strikethrough and reduced opacity. Row drag-and-drop for reordering.

---

### US-E04-007 | Lock Approved Roadmap Version

**Epic:** E04 — Resource Roadmap & Versioning
**Persona:** Minho Kim (Planning Manager)
**Feature:** F3 | **Req:** 4

> As a **Planning Manager**, I want **approved Roadmap versions to be automatically locked (read-only)**, so that **no one can modify historical approved versions and audit integrity is maintained**.

**Acceptance Criteria:**

1. **Given** a Roadmap version has been approved, **When** any user opens it, **Then** all allocation cells are read-only with a "Locked — Approved on [date]" banner.
2. **Given** I need to make changes to an approved Roadmap, **When** I click "Create New Version", **Then** a new draft is created from the approved version (the approved version remains locked).
3. **Given** an admin needs to unlock a version in exceptional circumstances, **When** they use the admin unlock function, **Then** an audit log entry records the unlock with reason, admin name, and timestamp.

**Story Points:** 3
**Priority:** Must
**Dependencies:** US-E04-004
**CXO UX Notes:** Locked banner uses a padlock icon with a subtle grey overlay on the entire grid. "Create New Version" button remains visible and primary-styled as the clear next action. Admin unlock requires multi-factor confirmation (password re-entry + reason text).

---

### US-E04-008 | Roadmap Summary Dashboard per Project

**Epic:** E04 — Resource Roadmap & Versioning
**Persona:** Minho Kim (Planning Manager)
**Feature:** F3 | **Req:** 1, 4

> As a **Planning Manager**, I want a **summary dashboard for each project's Roadmap showing key metrics (total PM, utilization, version count, approval status)**, so that **I can get a quick overview without drilling into details**.

**Acceptance Criteria:**

1. **Given** I open a project's Roadmap section, **When** the summary dashboard loads, **Then** I see KPI cards showing: Total Planned PM, Current Version number, Approval Status, Last Sync to PROMIS date, and Total Resources Allocated.
2. **Given** the dashboard is displayed, **When** I look at the utilization chart, **Then** I see a monthly bar chart showing planned PM vs. capacity with overallocation months highlighted.
3. **Given** I want to navigate to details, **When** I click on any KPI card, **Then** I am taken to the relevant detail view (e.g., clicking "Total Resources" opens the allocation grid).

**Story Points:** 8
**Priority:** Should
**Dependencies:** US-E04-001, US-E04-002
**CXO UX Notes:** KPI cards use large typography with trend indicators (up/down arrows vs. previous version). Utilization chart rendered with ECharts.js. Cards are clickable with hover lift effect. Dashboard fits above the fold on 1080p displays without scrolling.

---

## E05: Resource Simulation

### US-E05-001 | Clone Approved Roadmap to Create Simulation

**Epic:** E05 — Resource Simulation
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 1, 4

> As a **Resource Planner**, I want to **clone an approved Resource Roadmap to create a Simulation (what-if scenario)**, so that **I can freely explore allocation changes without affecting the approved plan**.

**Acceptance Criteria:**

1. **Given** I am viewing an approved Roadmap, **When** I click "Create Simulation", **Then** a new Simulation is created with all allocations copied from the approved Roadmap, labeled "Simulation — [Project] — [Date]".
2. **Given** the Simulation is created, **When** I open it, **Then** I see all allocation data from the source Roadmap with a prominent "SIMULATION" banner and orange color theme (distinct from Roadmap's blue).
3. **Given** I edit allocations in the Simulation, **When** I save, **Then** only the Simulation is modified — the source Roadmap remains unchanged and locked.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E04-001, US-E04-007
**CXO UX Notes:** Orange theme clearly distinguishes Simulation from Roadmap (blue) — applied to header bar, cell borders, and action buttons. "SIMULATION" banner persistent and non-dismissible. Custom name editable after creation. Source Roadmap version shown as a link in the header.

---

### US-E05-002 | Modify Simulation Allocations Freely

**Epic:** E05 — Resource Simulation
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 1

> As a **Resource Planner**, I want to **freely modify resource allocations within a Simulation without approval constraints**, so that **I can rapidly explore what-if scenarios**.

**Acceptance Criteria:**

1. **Given** I have an active Simulation, **When** I edit any allocation cell, **Then** the change is saved immediately (auto-save, no Draft/Permanent workflow required).
2. **Given** I want to make large-scale changes, **When** I select multiple cells and use "Bulk Edit", **Then** I can apply a formula (e.g., "+10%", "-5 PM", "set to 0") to all selected cells at once.
3. **Given** I want to revert all changes, **When** I click "Reset to Source Roadmap", **Then** all allocations revert to the original Roadmap values with a confirmation dialog.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E05-001
**CXO UX Notes:** Auto-save indicator in header ("All changes saved" with timestamp). Bulk Edit dialog with formula preview showing before/after values for selected cells. "Reset to Source" is a destructive action — requires typed confirmation ("RESET"). Multi-cell selection via Shift+click or click-drag.

---

### US-E05-003 | Compare Simulation vs. Original Roadmap

**Epic:** E05 — Resource Simulation
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 1, 4

> As a **Resource Planner**, I want to **compare a Simulation against its source Roadmap**, so that **I can see the impact of my what-if changes on resource utilization and capacity**.

**Acceptance Criteria:**

1. **Given** I am in a Simulation, **When** I click "Compare with Roadmap", **Then** a side-by-side view opens showing Roadmap (left) vs. Simulation (right) with delta highlighting per cell.
2. **Given** the comparison view is open, **When** I look at the summary panel, **Then** I see aggregate metrics: total PM delta, utilization % change, headcount impact, and capacity metrics.
3. **Given** I toggle "Show Differences Only", **When** the view refreshes, **Then** only cells with changes are displayed (unchanged rows/columns are collapsed).

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E05-002, US-E04-003 (diff engine reuse)
**CXO UX Notes:** Comparison uses same diff engine as E04-003 — consistent visual language. Summary panel pinned at top with key delta metrics. "Show Differences Only" toggle as a prominent switch. Delta values shown with +/- prefix and color (green = decrease, red = increase in PM).

---

### US-E05-004 | Compare Multiple Simulations Side by Side

**Epic:** E05 — Resource Simulation
**Persona:** Minho Kim (Planning Manager)
**Feature:** F3 | **Req:** 1

> As a **Planning Manager**, I want to **compare up to 4 simulations side by side**, so that **I can evaluate multiple scenarios and select the best option for the team**.

**Acceptance Criteria:**

1. **Given** I have 2 or more Simulations for the same Roadmap, **When** I select them and click "Multi-Compare", **Then** a tabular comparison view opens showing each simulation as a column with the original Roadmap as the baseline column.
2. **Given** the multi-comparison view is open, **When** I review the summary row, **Then** I see: total PM, utilization %, capacity delta, and a "Recommendation" indicator highlighting the scenario closest to target utilization.
3. **Given** I want to compare specific dimensions, **When** I apply Factor Control filters, **Then** the comparison is scoped to the selected dimensions only.

**Story Points:** 8
**Priority:** Should
**Dependencies:** US-E05-003, US-E10-001
**CXO UX Notes:** Comparison table uses alternating column backgrounds for readability. "Recommendation" indicator is a star badge on the best-fit column. Horizontal scroll with frozen first column (resource names). Limit to 4 simulations enforced with a clear message if user tries to add more.

---

### US-E05-005 | Promote Simulation to New Roadmap Version

**Epic:** E05 — Resource Simulation
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 1, 4

> As a **Resource Planner**, I want to **select a Simulation and promote it as the basis for a new Roadmap version**, so that **the winning scenario becomes the official plan**.

**Acceptance Criteria:**

1. **Given** I have a Simulation with the desired allocations, **When** I click "Promote to Roadmap", **Then** a new Draft Roadmap version is created with all Simulation allocations copied, linked to the source Simulation for audit trail.
2. **Given** the promotion is complete, **When** I view the new Draft version, **Then** it follows the standard Draft/Approval workflow (US-E04-004) — I must submit it for manager approval before it becomes the new approved Roadmap.
3. **Given** the Simulation was promoted, **When** I view the Simulation list, **Then** the promoted Simulation shows a "Promoted to Roadmap v[X]" badge and becomes read-only.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E05-001, US-E04-001
**CXO UX Notes:** "Promote to Roadmap" uses a prominent action button with an upward arrow icon. Promotion confirmation dialog shows a summary of what will happen. Post-promotion, the Simulation card shows a "Promoted" ribbon. Audit trail visible: Simulation source linked in the new Roadmap version metadata.

---

### US-E05-006 | View Simulation Version History

**Epic:** E05 — Resource Simulation
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F3 | **Req:** 1

> As a **Resource Planner**, I want to **view the history of all Simulations created from a Roadmap**, so that **I can revisit previous what-if scenarios and their outcomes**.

**Acceptance Criteria:**

1. **Given** I open a Roadmap's detail view, **When** I navigate to the "Simulations" tab, **Then** I see a list of all Simulations created from any version of this Roadmap: name, creation date, author, status (Active/Promoted/Archived), and source Roadmap version.
2. **Given** I click on a Simulation, **When** it opens, **Then** I see the full allocation data as it was at last save, regardless of current status.
3. **Given** I want to clean up, **When** I archive a Simulation, **Then** it moves to the "Archived" section and no longer appears in the active simulation list but remains accessible for audit.

**Story Points:** 3
**Priority:** Could
**Dependencies:** US-E05-001
**CXO UX Notes:** Simulation list uses card layout with status badges (Active = blue, Promoted = green, Archived = grey). Archive action accessible via three-dot menu — not a primary action. Archived section collapsed by default with a count indicator. Search/filter within simulation list.

---

## E06: HeadCount Portfolio

### US-E06-001 | Define Staffing Targets per Department

**Epic:** E06 — HeadCount Portfolio
**Persona:** Soyeon Choi (HR Portfolio Manager)
**Feature:** F4 | **Req:** 9

> As an **HR Portfolio Manager**, I want to **define target headcount numbers per department and time period**, so that **I can establish the staffing plan baseline for gap analysis**.

**Acceptance Criteria:**

1. **Given** I navigate to HeadCount Portfolio, **When** I select a department and time period (quarter), **Then** I can enter or edit the target headcount by skill group (Stage, Block, Function).
2. **Given** I set targets for V-NAND Development at 85 engineers for Q3 2026, **When** I save, **Then** the target is stored and immediately reflected in the gap analysis view.
3. **Given** targets change between planning cycles, **When** I update a target, **Then** the previous target is preserved in history with the date of change and reason.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E01-001, US-E01-005
**CXO UX Notes:** Target entry uses an editable data grid (department rows, quarter columns). Skill group breakdown as expandable sub-rows. Change reason as a mandatory popup on save. Historical targets viewable via a "History" button per cell. Bulk target import from Excel supported.

---

### US-E06-002 | View Current vs. Target Headcount Dashboard

**Epic:** E06 — HeadCount Portfolio
**Persona:** Soyeon Choi (HR Portfolio Manager)
**Feature:** F4 | **Req:** 9

> As an **HR Portfolio Manager**, I want to **see a dashboard comparing current projected headcount against targets per department**, so that **I can instantly identify departments that are over or under staffed**.

**Acceptance Criteria:**

1. **Given** I open the HeadCount Dashboard, **When** it loads, **Then** I see a summary view showing each department with: Target HC, Current Projected HC, Gap (Target - Current), and a status indicator (green = OK, yellow = minor gap <5%, red = critical gap >10%).
2. **Given** I select a department, **When** the detail view loads, **Then** I see the breakdown by skill group with individual gap values and a stacked bar chart showing target vs. current.
3. **Given** the dashboard displays cross-department data, **When** I view the division rollup, **Then** I see aggregate gaps across all departments under that division.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E06-001, US-E04-006 (roadmap allocations feed projected HC)
**CXO UX Notes:** Status indicators use traffic-light colors + text labels ("OK", "Gap", "Critical") for accessibility. Stacked bar chart uses ECharts.js with target line overlay. Division rollup as a collapsible section above department details. Dashboard refresh interval: 15 minutes with manual refresh option.

---

### US-E06-003 | Identify and Analyze Staffing Gaps by Skill Group

**Epic:** E06 — HeadCount Portfolio
**Persona:** Soyeon Choi (HR Portfolio Manager)
**Feature:** F4 | **Req:** 9

> As an **HR Portfolio Manager**, I want to **drill into staffing gaps by skill group (Stage, Block, Function)**, so that **I can identify exactly which capabilities are missing and prioritize hiring accordingly**.

**Acceptance Criteria:**

1. **Given** I view a department with a gap of 13 engineers, **When** I open the skill breakdown, **Then** I see the gap distributed across skill groups (e.g., Stage 2 / Block B: -5, Stage 1 / Function Design: -3, etc.).
2. **Given** skill group gaps are displayed, **When** I sort by gap severity, **Then** the largest gaps appear first, helping me prioritize.
3. **Given** I want to understand why a gap exists, **When** I click on a skill group gap, **Then** I see contributing factors: planned allocations, current staff count, known departures, pending transfers.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E06-002
**CXO UX Notes:** Skill breakdown uses a treemap or heatmap visualization — larger blocks = larger gaps. Sorting defaults to "most critical first". Contributing factors displayed as a mini-table in a popover. Negative gaps (overstaffed) shown in blue for contrast with red (understaffed).

---

### US-E06-004 | Create Hiring/Transfer/Retention Actions

**Epic:** E06 — HeadCount Portfolio
**Persona:** Soyeon Choi (HR Portfolio Manager)
**Feature:** F4 | **Req:** 9

> As an **HR Portfolio Manager**, I want to **create staffing actions (Hire, Transfer, Retain) to address identified gaps**, so that **I can track remediation efforts and communicate needs to Samsung GHRP**.

**Acceptance Criteria:**

1. **Given** I identify a staffing gap, **When** I click "Create Action", **Then** I can select action type (Hire/Transfer/Retain), specify the number of positions, target skill group, target start date, and justification text.
2. **Given** a non-HR user (e.g., Planning Manager) identifies a gap, **When** they click "Request Headcount" (simplified form), **Then** a lightweight request is created with just: department, count, skill group, and urgency — which HR can then convert to a full action.
3. **Given** an action is created, **When** I view the Actions list, **Then** I see all open actions with status (Requested/In Progress/Filled/Cancelled) and can filter by department, action type, and status.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E06-003
**CXO UX Notes:** Full action form for HR users (multi-section form). Simplified "Request Headcount" for non-HR (single-page form, 4 fields max) per S3 finding M4. Action status uses a Kanban-style column view (Requested > In Progress > Filled). Status transitions via drag-and-drop or dropdown.

---

### US-E06-005 | View HeadCount Trends Over Time

**Epic:** E06 — HeadCount Portfolio
**Persona:** Soyeon Choi (HR Portfolio Manager)
**Feature:** F4 | **Req:** 9

> As an **HR Portfolio Manager**, I want to **view headcount trends (target vs. actual) over the past 12 months and projected 6 months forward**, so that **I can identify patterns and plan proactively**.

**Acceptance Criteria:**

1. **Given** I open HeadCount Trends, **When** I select a department, **Then** I see a line chart with two series: Target HC (dashed) and Actual/Projected HC (solid) over 18 months (12 historical + 6 projected).
2. **Given** the trend shows a growing gap, **When** I hover over the gap area, **Then** a tooltip shows the gap size, month, and contributing factors.
3. **Given** I want to see cross-department trends, **When** I toggle "Division View", **Then** trend lines for all departments within the division are overlaid with a legend.

**Story Points:** 3
**Priority:** Could
**Dependencies:** US-E06-002
**CXO UX Notes:** ECharts.js line chart with shaded area between target and actual (green when above target, red when below). Projected months use dotted line style to distinguish from historical. Legend interactive — click to show/hide individual series. Export chart as PNG for presentations.

---

## E07: World Map & Navigation

### US-E07-001 | View Global World Map with Site Pins

**Epic:** E07 — World Map & Navigation
**Persona:** Soyeon Choi (HR Portfolio Manager)
**Feature:** F4 | **Req:** 7, 8

> As an **HR Portfolio Manager**, I want to **see a world map on the IRIS home screen showing all Samsung DS sites as interactive pins**, so that **I can get a global overview of resource distribution at a glance**.

**Acceptance Criteria:**

1. **Given** I log into IRIS, **When** the home screen loads, **Then** I see a world map with pins at each Samsung DS site: Hwaseong (HQ), Pyeongtaek, Giheung, Austin (TX), Xi'an (China).
2. **Given** the map renders, **When** I look at each pin, **Then** it shows: site name, total headcount, and a traffic-light status indicator (green = healthy, yellow = gaps, red = critical gaps).
3. **Given** I hover over a pin, **When** the popup appears, **Then** I see: site name, total HC, utilization rate, open positions count, and overallocation alerts.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E06-002 (HC data), US-E13-001
**CXO UX Notes:** Map uses a clean, minimal style (light grey land, white ocean). Pins use Samsung brand colors. Pin size proportional to headcount. Popup appears on hover (desktop) or tap (mobile). Map is non-scrollable by default to prevent accidental scroll-jacking — zoom via controls only.

---

### US-E07-002 | Drill Down from Site to Department to Team

**Epic:** E07 — World Map & Navigation
**Persona:** Soyeon Choi (HR Portfolio Manager)
**Feature:** F4 | **Req:** 7, 8

> As an **HR Portfolio Manager**, I want to **click a site pin on the world map and drill down through Division, Department, and Team levels**, so that **I can navigate from a global view to granular resource details**.

**Acceptance Criteria:**

1. **Given** I click on the Hwaseong pin, **When** the site view opens, **Then** I see a list of Divisions at Hwaseong with headcount summaries and status indicators, plus a breadcrumb trail: "Global > Hwaseong".
2. **Given** I click on "Memory Division", **When** the division view opens, **Then** I see all Departments within Memory Division with resource statistics and breadcrumb: "Global > Hwaseong > Memory Division".
3. **Given** I drill down to a Department and then to a Team, **When** the team view opens, **Then** I see individual resource allocations, P/M summary, and can navigate directly to the P/M Planner for that team's plan.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E07-001, US-E01-001
**CXO UX Notes:** Breadcrumb trail always visible at the top. Each drill-down level uses a smooth transition animation (slide left). Back button and breadcrumb both functional for navigation. Each level shows consistent KPI cards (HC, utilization, gaps). Mobile: full-screen drill-down with swipe-back gesture.

---

### US-E07-003 | View Resource Statistics per Site

**Epic:** E07 — World Map & Navigation
**Persona:** Minho Kim (Planning Manager)
**Feature:** F4 | **Req:** 7, 8

> As a **Planning Manager**, I want to **see aggregated resource statistics for each site (total headcount, allocation %, utilization rate, open gaps)**, so that **I can compare site health without drilling into details**.

**Acceptance Criteria:**

1. **Given** I am on the World Map view, **When** I activate "Statistics Overlay", **Then** each site pin expands to show a mini-card with: Total HC, Allocation %, Avg Utilization, Open Gaps count.
2. **Given** I want to compare two sites, **When** I select Hwaseong and Pyeongtaek pins, **Then** a side-by-side comparison card appears at the bottom of the screen.
3. **Given** statistics are loaded, **When** data freshness exceeds 24 hours, **Then** a "Last updated [timestamp]" warning appears with a "Refresh" option.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E07-001, US-E06-002
**CXO UX Notes:** Mini-cards use compact typography to avoid cluttering the map. Site comparison card uses a split layout with sparkline charts. "Refresh" button with spinning animation during data fetch. Statistics overlay toggle as a floating action button on the map.

---

### US-E07-004 | Access Role-Based Menu from Home Screen

**Epic:** E07 — World Map & Navigation
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F4 | **Req:** 7

> As a **Resource Planner**, I want the **IRIS home screen to show a role-based navigation menu that surfaces the features most relevant to my role**, so that **I can quickly access my daily tools**.

**Acceptance Criteria:**

1. **Given** I log in as a Resource Planner, **When** the home screen loads, **Then** I see quick-access cards for: "My P/M Plans", "My Roadmaps", "My Simulations", and "Recent Projects" — tailored to the Planner role.
2. **Given** I log in as a Planning Manager, **When** the home screen loads, **Then** I see: "Pending Approvals", "Team Roadmaps", "Version History", and "Project Dashboard".
3. **Given** I log in as an HR Portfolio Manager, **When** the home screen loads, **Then** I see: "HeadCount Dashboard", "World Map", "Staffing Actions", and "Gap Analysis".

**Story Points:** 3
**Priority:** Should
**Dependencies:** US-E13-001 (authentication/roles)
**CXO UX Notes:** Quick-access cards arranged in a 2x2 grid below the world map. Each card shows an icon, title, and a count badge (e.g., "3 pending approvals"). Cards have hover lift effect and are keyboard-focusable. Role definition drives card selection — admins see all cards with role-switcher.

---

### US-E07-005 | Configure Personal Dashboard Widgets

**Epic:** E07 — World Map & Navigation
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F4 | **Req:** 7

> As an **Analytics Specialist**, I want to **configure my personal dashboard by adding, removing, and rearranging widgets**, so that **I see the most relevant information every time I log in**.

**Acceptance Criteria:**

1. **Given** I am on my home screen, **When** I click "Customize Dashboard", **Then** I enter edit mode where I can drag, resize, add, or remove widget cards from a catalog.
2. **Given** the widget catalog is open, **When** I browse it, **Then** I see available widgets: Recent Analysis, Saved Reports, World Map Mini, HeadCount Summary, Approval Queue, Integration Status, and My Projects.
3. **Given** I arrange my dashboard, **When** I click "Save Layout", **Then** my configuration persists across sessions and devices.

**Story Points:** 5
**Priority:** Could
**Dependencies:** US-E07-004
**CXO UX Notes:** Edit mode adds visible grid lines and drag handles on each widget. Widget catalog as a slide-in panel with preview thumbnails. Widgets snap to grid for clean alignment. "Reset to Default" option available. Widget resize handles at corners. Mobile: widgets stack single-column, no drag-reorder.

---

### US-E07-006 | Responsive Navigation for Tablet and Mobile

**Epic:** E07 — World Map & Navigation
**Persona:** Minho Kim (Planning Manager)
**Feature:** F4 | **Req:** 7

> As a **Planning Manager**, I want **IRIS navigation to adapt gracefully to tablet screen sizes**, so that **I can review approvals and check project status during site visits without a full desktop setup**.

**Acceptance Criteria:**

1. **Given** I access IRIS on a tablet (1024px or smaller viewport), **When** the page renders, **Then** the sidebar navigation collapses to a hamburger menu and the main content area occupies the full width.
2. **Given** I am viewing the P/M Planner on a tablet, **When** the grid is too wide for the viewport, **Then** the first two columns (resource name, department) are frozen and the remaining columns scroll horizontally with a visible scroll indicator.
3. **Given** I am reviewing an approval on a tablet, **When** I tap Approve or Reject, **Then** the touch targets are at least 44x44px and the confirmation dialog is touch-friendly with large buttons.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E07-004
**CXO UX Notes:** Follow Samsung One UI design patterns where applicable. Touch targets minimum 44x44px (WCAG). Swipe gestures for navigation (left = forward, right = back). No horizontal scroll on the page level — only within data grids. Font scaling respects system accessibility settings.

---

## E08: Analysis & Reporting

### US-E08-001 | Build Ad-Hoc Analysis with Dimension/Measure Selector

**Epic:** E08 — Analysis & Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F5, F6 | **Req:** 8, 10

> As an **Analytics Specialist**, I want to **build ad-hoc analyses by selecting dimensions (rows/columns) and measures (values) from a selector panel**, so that **I can create custom reports without IT support**.

**Acceptance Criteria:**

1. **Given** I open the Analysis Builder, **When** the dimension selector panel loads, **Then** dimensions are grouped into categories: Organization (Site, Division, Department, Team), Time (Year, Quarter, Month), Product (Production Type, Project), Skill (Stage, Block, Function, Activity), and a "Recently Used" section at the top.
2. **Given** I select dimensions "Site" and "Stage" with measure "Total PM", **When** I click "Generate", **Then** a pivot table renders with Sites as rows, Stages as columns, and Total PM values in cells.
3. **Given** the dimension list contains 20+ options, **When** I type in the search box, **Then** dimensions are filtered in real-time by name with matching text highlighted.

**Story Points:** 8
**Priority:** Should
**Dependencies:** US-E13-003 (Elasticsearch), US-E10-001
**CXO UX Notes:** Dimension selector as a left sidebar with collapsible category groups. Drag-and-drop dimensions to "Rows" and "Columns" drop zones. Measures as a separate section with aggregation type selector (Sum, Avg, Count, Min, Max). "Recently Used" at top for rapid access per S3 finding C2.

---

### US-E08-002 | Apply Factor Control Filters to Analysis

**Epic:** E08 — Analysis & Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F5, F6 | **Req:** 6, 8

> As an **Analytics Specialist**, I want to **apply Factor Control filters to any analysis view**, so that **I can scope my report to specific products, time ranges, or organizational units**.

**Acceptance Criteria:**

1. **Given** I am in the Analysis Builder, **When** I open the Factor Control panel (prominently placed in the analysis toolbar), **Then** I see all available filter dimensions with multi-select checkboxes.
2. **Given** I select Factor Control: Production Type = "V-NAND" and Time Range = "Q1-Q2 2026", **When** I apply, **Then** the analysis results are filtered to only V-NAND data for Jan-Jun 2026, and filter chips appear below the toolbar showing active filters.
3. **Given** I modify Factor Control filters after generating a chart, **When** I click "Apply", **Then** the chart refreshes with the updated filter scope without re-selecting dimensions and measures.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E08-001, US-E10-001
**CXO UX Notes:** Factor Control button in toolbar with active filter count badge. Filter panel slides in from the right with clear "Apply" and "Clear All" buttons. Filter chips below toolbar — each chip has "x" to remove. Applied filters persist when switching chart types.

---

### US-E08-003 | View Analysis as Multiple Chart Types

**Epic:** E08 — Analysis & Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F5, F6 | **Req:** 8, 10

> As an **Analytics Specialist**, I want to **switch between chart types (bar, line, pie, heatmap, stacked bar) for any generated analysis**, so that **I can choose the best visualization for my data**.

**Acceptance Criteria:**

1. **Given** I have generated an analysis, **When** I click the chart type selector, **Then** I can switch between: Bar, Stacked Bar, Line, Pie, Heatmap, and Pivot Table views.
2. **Given** I switch from bar chart to heatmap, **When** the chart type changes, **Then** the visualization re-renders with the same data — no re-query needed.
3. **Given** the data has more than 2 dimensions, **When** I select "Heatmap", **Then** the system automatically maps the first dimension to rows, second to columns, and the measure to cell color intensity.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E08-001
**CXO UX Notes:** Chart type selector as icon buttons (bar icon, line icon, pie icon, etc.) in a toolbar row. Active type highlighted. Transition between chart types uses a smooth animation. Each chart type has a tooltip explaining when to use it (e.g., "Heatmap: best for comparing two dimensions"). ECharts.js renders all types.

---

### US-E08-004 | Save and Share Analysis Views

**Epic:** E08 — Analysis & Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F5, F6 | **Req:** 8

> As an **Analytics Specialist**, I want to **save my analysis configuration (dimensions, measures, filters, chart type) and share it with colleagues via a link**, so that **I can build reusable report templates**.

**Acceptance Criteria:**

1. **Given** I have configured an analysis, **When** I click "Save", **Then** I can name the view, add a description, and choose visibility: "Private" (only me) or "Shared" (visible to my team/department).
2. **Given** I have a saved analysis, **When** I click "Share", **Then** a deep link URL is generated that other users can open to see the same analysis with current data.
3. **Given** I open a shared analysis link, **When** the view loads, **Then** I see the same dimensions, measures, filters, and chart type — but with live data as of the current moment.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E08-001
**CXO UX Notes:** Save dialog as a compact modal with name, description, and visibility toggle. Share generates a copyable URL with a "Copy Link" button (clipboard feedback). Saved views listed in a "My Reports" section on the home screen. Shared views respect role-based data access — users only see data they are authorized for.

---

### US-E08-005 | View Personal Analysis (My Resources)

**Epic:** E08 — Analysis & Reporting
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F5 | **Req:** 8

> As a **Resource Planner**, I want a **pre-built "My Resources" analysis view that shows allocations, utilization, and gaps for resources in my department/team**, so that **I have a personal dashboard without manual configuration**.

**Acceptance Criteria:**

1. **Given** I navigate to "My Analysis" from the home screen, **When** the personal view loads, **Then** I see a pre-configured dashboard showing: my department's resource allocation by month, utilization rate, and gap indicators — scoped to my department/team automatically.
2. **Given** I want to adjust the personal view, **When** I modify the time range or add filters, **Then** the view refreshes and I can save my customizations.
3. **Given** I am a Planning Manager, **When** my personal view loads, **Then** it shows data for all teams under my management scope, not just one team.

**Story Points:** 5
**Priority:** Could
**Dependencies:** US-E08-001, US-E07-004 (role-based context)
**CXO UX Notes:** Pre-built template auto-scoped to user's org unit — zero-configuration first experience. Customizable time range selector (default: current quarter + next quarter). Management scope expands automatically based on role hierarchy. "Reset to Default" option if user over-customizes.

---

### US-E08-006 | Create Periodic Report Schedule

**Epic:** E08 — Analysis & Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F6 | **Req:** 10

> As an **Analytics Specialist**, I want to **schedule a saved analysis to run periodically (daily, weekly, monthly) and auto-generate a report**, so that **stakeholders receive up-to-date data without manual effort**.

**Acceptance Criteria:**

1. **Given** I have a saved analysis, **When** I click "Schedule", **Then** I can configure: frequency (daily/weekly/monthly), day/time of execution, output format (PDF/Excel), and distribution list (email addresses).
2. **Given** a schedule is configured, **When** the scheduled time arrives, **Then** the system executes the analysis with live data, generates the output file, and sends it via email to the distribution list.
3. **Given** I want to manage my schedules, **When** I open "My Schedules", **Then** I see all active schedules with: analysis name, frequency, next run time, last run status, and options to edit/pause/delete.

**Story Points:** 5
**Priority:** Could
**Dependencies:** US-E08-004, US-E12-001
**CXO UX Notes:** Schedule configuration as a step-by-step wizard (Frequency > Output Format > Distribution List > Review). Distribution list with email autocomplete from IRIS user directory. "Test Run" button to preview the report before activating the schedule. Pause/resume toggle on each schedule card.

---

### US-E08-007 | Actual vs. Plan Gap Reporting Dashboard

**Epic:** E08 — Analysis & Reporting
**Persona:** Minho Kim (Planning Manager)
**Feature:** F5 | **Req:** 8, 10

> As a **Planning Manager**, I want a **dedicated Actual vs. Plan Gap reporting dashboard**, so that **I can see where resource consumption deviates from the approved Roadmap and take corrective action**.

**Acceptance Criteria:**

1. **Given** I open the Gap Reporting dashboard, **When** it loads, **Then** I see a summary showing: total planned PM, total actual PM, overall gap (absolute and %), and a list of top 10 projects with the largest gaps.
2. **Given** I select a project, **When** the detail view opens, **Then** I see a breakdown by department/team with planned vs. actual bars and variance highlighting.
3. **Given** the gap exceeds a configurable threshold (default 15%), **When** the dashboard renders, **Then** an alert icon and recommended actions (reallocate, escalate, hold) appear for that project.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E02-002, US-E04-006
**CXO UX Notes:** Top-10 gap projects displayed as a ranked list with horizontal bar charts (planned = blue, actual = orange). Threshold line shown on charts. Recommended actions as clickable chips that link to relevant workflows (e.g., "Reallocate" opens the P/M Planner for that project). Red/amber severity indicators use icons alongside color.

---

## E09: AI-Based Reporting

### US-E09-001 | Generate Excel PIVOT via Samsung AI Services

**Epic:** E09 — AI-Based Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F7 | **Req:** 11

> As an **Analytics Specialist**, I want to **generate an Excel PIVOT report using Samsung AI Services**, so that **I can create complex pivot tables with AI assistance instead of building them manually**.

**Acceptance Criteria:**

1. **Given** I am in the Analysis Builder, **When** I click "AI Generate PIVOT", **Then** the system sends my current dimension/measure/filter configuration to Samsung AI Services and receives a structured Excel PIVOT layout recommendation.
2. **Given** the AI returns a PIVOT layout, **When** I review the preview, **Then** I see: suggested row fields, column fields, value fields, and a rendered preview — with the option to modify before exporting.
3. **Given** I accept the PIVOT layout, **When** I click "Download", **Then** an Excel file is generated with the PIVOT table populated with live IRIS data.

**Story Points:** 8
**Priority:** Won't (v1)
**Dependencies:** US-E08-001, Samsung AI Services API access
**CXO UX Notes:** "AI Generate PIVOT" button uses an AI icon (sparkle/star). Preview shows editable field assignments. Loading state: "AI is analyzing your data..." with subtle animation. Fallback message if AI service is unavailable: "AI service is currently unavailable — use manual PIVOT builder instead."

---

### US-E09-002 | Natural Language Query to Chart

**Epic:** E09 — AI-Based Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F7 | **Req:** 11

> As an **Analytics Specialist**, I want to **type a natural language query (e.g., "Show me PM utilization by site for Q2 2026") and have the system generate a chart**, so that **I can create reports without manually configuring dimensions and measures**.

**Acceptance Criteria:**

1. **Given** I type "Show me PM utilization by site for Q2 2026" in the AI query bar, **When** I press Enter, **Then** the system interprets the query, maps it to dimensions (Site), measures (PM Utilization %), and filters (Q2 2026), and generates a bar chart.
2. **Given** the AI interpretation is incorrect, **When** I click "Refine", **Then** I see the interpreted dimensions/measures/filters and can manually adjust before re-generating.
3. **Given** the query is ambiguous, **When** the AI cannot determine the exact intent, **Then** it presents 2-3 interpretation options: "Did you mean: (a) Utilization by site, (b) Utilization by department at each site, (c) Utilization trend over Q2 months?"

**Story Points:** 5
**Priority:** Won't (v1)
**Dependencies:** US-E09-001, Samsung AI Services
**CXO UX Notes:** AI query bar prominently placed at the top of Analysis Builder with placeholder text: "Ask a question about your resource data..." Auto-suggest as user types. Disambiguation options as clickable cards. "Refine" shows the mapping between NLQ terms and IRIS dimensions for transparency.

---

### US-E09-003 | AI-Suggested Report Templates

**Epic:** E09 — AI-Based Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F7 | **Req:** 11

> As an **Analytics Specialist**, I want the **AI to suggest report templates based on my role, recent activity, and common patterns across Samsung DSR**, so that **I can discover useful reports I might not have thought to create**.

**Acceptance Criteria:**

1. **Given** I open the Analysis Builder, **When** I click "AI Suggestions", **Then** I see 3-5 recommended report templates based on my role, department, and recent analysis history.
2. **Given** I select a suggested template, **When** it loads, **Then** the dimensions, measures, filters, and chart type are pre-configured and I see a preview with live data.
3. **Given** I want to customize a suggestion, **When** I click "Use as Starting Point", **Then** the template configuration opens in the Analysis Builder for manual adjustment.

**Story Points:** 5
**Priority:** Won't (v1)
**Dependencies:** US-E09-002, US-E08-004
**CXO UX Notes:** Suggestions displayed as horizontal scrollable cards with title, description, and a mini chart preview. "Use as Starting Point" as secondary action (not auto-apply). Cold-start: role-based default templates until sufficient usage data exists. Dismiss/hide individual suggestions.

---

### US-E09-004 | Export AI-Generated Reports

**Epic:** E09 — AI-Based Reporting
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F7 | **Req:** 11

> As an **Analytics Specialist**, I want to **export AI-generated reports (PIVOT, NLQ charts, suggested reports) to Excel and PDF**, so that **I can distribute them through Samsung's existing communication channels**.

**Acceptance Criteria:**

1. **Given** I have an AI-generated chart or PIVOT, **When** I click "Export", **Then** I can choose between Excel (data + formatting) and PDF (visual report with metadata).
2. **Given** I export to Excel, **When** the file generates, **Then** it includes: the chart as an image, the underlying data table, and metadata (query, filters, generation timestamp).
3. **Given** I export to PDF, **When** the file generates, **Then** it includes: a formatted header (IRIS Report, Samsung DSR, date), the chart, a data summary table, and the AI query/interpretation that generated it.

**Story Points:** 3
**Priority:** Won't (v1)
**Dependencies:** US-E09-001
**CXO UX Notes:** Export uses the same engine as E08-006 and E06 exports for consistency. PDF branded with Samsung DSR header and IRIS logo. AI provenance clearly stated in export: "Generated via AI query: [original NLQ]". Export preview available before download.

---

## E10: Factor Control

### US-E10-001 | Create Factor Control Set

**Epic:** E10 — Factor Control
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** — | **Req:** 6

> As an **Analytics Specialist**, I want to **create a Factor Control set (a named collection of dimension filters)**, so that **I can define reusable filter contexts that scope any analytical view to specific segments**.

**Acceptance Criteria:**

1. **Given** I open Factor Control Management, **When** I click "New Factor Control", **Then** I can: name the set, select dimension filters (Production Type, Site, Division, Department, Stage, Block, Function, Time Range, etc.), and set values for each dimension.
2. **Given** I create a Factor Control set "V-NAND Hwaseong Q2", **When** I save it, **Then** it appears in my Factor Control library and is available in all views that support Factor Control (P/M Planner, Roadmap, Analysis, HC Portfolio).
3. **Given** I edit an existing Factor Control set, **When** I modify a filter, **Then** all views currently using that set are flagged for refresh.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E01-001 (org hierarchy), US-E13-003 (Elasticsearch)
**CXO UX Notes:** Factor Control creation as a multi-step form: Name > Select Dimensions > Set Values > Preview Scope. Preview shows "This Factor Control matches X records across Y projects." Dimension selectors use cascading filters (selecting a Site narrows Department options). Validation prevents empty Factor Controls.

---

### US-E10-002 | Apply Factor Control to All Analytical Views

**Epic:** E10 — Factor Control
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** — | **Req:** 6

> As an **Analytics Specialist**, I want to **apply a Factor Control set to any analytical view (Analysis Builder, Gap Report, HC Dashboard, P/M Planner)**, so that **all views show data scoped to the same context**.

**Acceptance Criteria:**

1. **Given** I have a saved Factor Control set, **When** I select it from the Factor Control dropdown in the Analysis Builder toolbar, **Then** the analysis results are immediately filtered to the set's scope.
2. **Given** I apply a Factor Control in the Analysis Builder, **When** I navigate to the Gap Report, **Then** the same Factor Control is preserved across views (global session context).
3. **Given** I want to clear the Factor Control, **When** I click "Clear All Filters" in the toolbar, **Then** all views revert to unfiltered (full data scope).

**Story Points:** 3
**Priority:** Should
**Dependencies:** US-E10-001
**CXO UX Notes:** Active Factor Control shown as a persistent chip/badge in the global toolbar (visible across all pages). Chip shows the Factor Control name and a dropdown arrow to change. "Clear All" as a small "x" button on the chip. Session persistence: Factor Control survives page navigation but clears on logout. Visual indicator: subtle colored top border on all pages when Factor Control is active.

---

### US-E10-003 | Save Personal Factor Control Presets

**Epic:** E10 — Factor Control
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** — | **Req:** 6

> As an **Analytics Specialist**, I want to **save my frequently used Factor Control configurations as personal presets**, so that **I can switch between contexts quickly during my daily analysis work**.

**Acceptance Criteria:**

1. **Given** I have configured a Factor Control, **When** I click "Save as Preset", **Then** I can name the preset and it appears in my personal preset list.
2. **Given** I have 5 saved presets, **When** I open the Factor Control dropdown, **Then** my presets appear at the top under "My Presets" with one-click application.
3. **Given** I want to modify a preset, **When** I click "Edit" on a preset, **Then** I can adjust the filters and save — all views using that preset update on next application.

**Story Points:** 3
**Priority:** Could
**Dependencies:** US-E10-001
**CXO UX Notes:** Presets shown in dropdown with star icon for favorites. Reorder presets by dragging. "My Presets" section separated from "Standard Presets" (E10-004) with a visual divider. Quick-switch keyboard shortcut: Ctrl+F followed by preset number (1-9).

---

### US-E10-004 | Admin Manages Global Factor Control Templates

**Epic:** E10 — Factor Control
**Persona:** Minho Kim (Planning Manager)
**Feature:** — | **Req:** 6

> As a **Planning Manager (with admin privileges)**, I want to **create and manage global Factor Control templates that all users can access**, so that **common reporting contexts (e.g., "V-NAND All Sites", "DRAM Hwaseong Only") are standardized across the team**.

**Acceptance Criteria:**

1. **Given** I have Admin or Factor Control Manager role, **When** I open Factor Control Admin, **Then** I can create, edit, and delete global templates visible to all users.
2. **Given** a global template exists, **When** any user opens the Factor Control dropdown, **Then** global templates appear under "Standard Presets" below personal presets.
3. **Given** I update a global template, **When** users next apply it, **Then** they see the updated filter configuration with an "Updated on [date]" indicator.

**Story Points:** 5
**Priority:** Could
**Dependencies:** US-E10-001
**CXO UX Notes:** Admin panel with table of global templates showing name, scope, last modified, and usage count. "Clone to Personal" option for users who want to customize a global template. "Updated" badge shown for 7 days after modification. Delete requires confirmation with usage count warning.

---

## E11: Integration

### US-E11-001 | Delta Sync Approved Roadmap to PROMIS

**Epic:** E11 — Integration
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1, F2 | **Req:** 2

> As a **Resource Planner**, I want **approved Roadmap changes to be automatically synced to PROMIS using delta sync (only changed data)**, so that **PROMIS stays current without redundant full-data transfers**.

**Acceptance Criteria:**

1. **Given** a Roadmap version is approved (US-E04-004), **When** the delta sync job runs, **Then** only allocation records that differ from the last-synced version are sent to PROMIS via the PROMIS REST API.
2. **Given** the delta sync completes, **When** I check the Integration Dashboard, **Then** I see: sync timestamp, records sent (added/modified/removed), success/failure count, and any error details.
3. **Given** a sync record fails, **When** the failure is logged, **Then** the record is queued for retry (max 3 attempts) and an alert notification is sent to the integration admin.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E04-005, US-E13-001
**CXO UX Notes:** Sync status visible in the Roadmap version detail as a small badge (synced/pending/failed). Integration Dashboard accessible from the global navigation. Failed record count shown as a red badge on the Integration nav item. Retry progress visible in real-time.

---

### US-E11-002 | Receive Master Data Updates from N-PLM and SMDM

**Epic:** E11 — Integration
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F1 | **Req:** 5

> As a **Resource Planner**, I want **IRIS to automatically receive and process master data updates (production types, org hierarchy, project metadata) from N-PLM and SMDM**, so that **IRIS master data stays synchronized with Samsung's authoritative sources**.

**Acceptance Criteria:**

1. **Given** N-PLM publishes a master data update (new production type, modified org unit), **When** the scheduled inbound sync runs (daily 02:00 KST), **Then** IRIS ingests the update and flags new/modified records for review.
2. **Given** SMDM org hierarchy changes, **When** the sync processes them, **Then** IRIS org tree is updated with new nodes/changes and a "Sync Log" entry is created.
3. **Given** a sync conflict exists (IRIS local override vs. source system value), **When** the conflict is detected, **Then** it appears in the Integration Dashboard conflicts queue for manual resolution.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E13-001, US-E01-006
**CXO UX Notes:** New/modified records flagged with a blue "Review" badge in the master data views. Conflict queue as a filtered view in the Integration Dashboard — each conflict shows source vs. local values in a two-column layout. Bulk resolution options for multiple conflicts of the same type.

---

### US-E11-003 | Push Project Updates to N-PLM

**Epic:** E11 — Integration
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F2 | **Req:** 5

> As a **Resource Planner**, I want **IRIS to push confirmed project schedule and status updates to N-PLM**, so that **the N-PLM system reflects IRIS planning decisions without manual re-entry**.

**Acceptance Criteria:**

1. **Given** a project's Roadmap is approved in IRIS, **When** the outbound sync to N-PLM triggers, **Then** the confirmed P/M schedule and project status are pushed to N-PLM via REST API.
2. **Given** the push succeeds, **When** I view the project in IRIS, **Then** a "Synced to N-PLM" badge with timestamp is displayed.
3. **Given** the push fails, **When** the error is logged, **Then** the Integration Dashboard shows the failure with error details and a "Retry" button.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E02-003, US-E04-004
**CXO UX Notes:** "Synced to N-PLM" badge uses a cloud-check icon similar to PROMIS badge — consistent iconography across integrations. Failed sync shows a red banner on the project detail page (not just in the Integration Dashboard) so the responsible planner sees it immediately. One-click retry from the project view.

---

### US-E11-004 | Sync Employee Data from GHRP

**Epic:** E11 — Integration
**Persona:** Soyeon Choi (HR Portfolio Manager)
**Feature:** F1 | **Req:** 5

> As an **HR Portfolio Manager**, I want **IRIS to sync employee data (profiles, department assignments, employment status) from Samsung GHRP**, so that **HeadCount Portfolio and resource views reflect accurate HR data**.

**Acceptance Criteria:**

1. **Given** GHRP employee data is updated (new hire, transfer, departure), **When** the daily sync runs, **Then** IRIS employee records are updated with current: department, team, skills, employment status, and start/end dates.
2. **Given** an employee is transferred between departments, **When** the sync processes, **Then** the employee's allocation in IRIS Roadmap views updates to reflect their new department, and the previous department's headcount decreases.
3. **Given** I view the sync status, **When** I open the Integration Dashboard GHRP tab, **Then** I see: last sync timestamp, records processed (added/updated/departed), and any exceptions.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E13-001, US-E01-005
**CXO UX Notes:** Employee transfer impact shown as a "Movement Alert" in affected department views. GHRP tab in Integration Dashboard uses the same layout pattern as PROMIS/N-PLM tabs for consistency. Departed employees shown with a "Departed" badge (not deleted from historical views).

---

### US-E11-005 | Monitor Integration Health and Sync Status

**Epic:** E11 — Integration
**Persona:** Minho Kim (Planning Manager)
**Feature:** F1, F2 | **Req:** 2, 5

> As a **Planning Manager**, I want an **Integration Dashboard showing the health and sync status of all connected systems (PROMIS, N-PLM, SMDM, GHRP)**, so that **I can ensure data consistency and quickly identify sync failures**.

**Acceptance Criteria:**

1. **Given** I open the Integration Dashboard, **When** it loads, **Then** I see a status card for each connected system: PROMIS, N-PLM, SMDM, GHRP — each showing: connection status (green/red), last sync timestamp, records synced, and error count.
2. **Given** a system shows errors, **When** I click on the error count, **Then** I see a detailed error log with: record ID, error message, timestamp, and retry status.
3. **Given** I want to trigger a manual sync, **When** I click "Sync Now" on a system card, **Then** an on-demand sync is initiated and I see real-time progress.

**Story Points:** 5
**Priority:** Must
**Dependencies:** US-E11-001, US-E11-002, US-E11-003, US-E11-004
**CXO UX Notes:** Dashboard layout: 4 system cards in a 2x2 grid. Each card uses consistent layout: status dot (green/red), system name, metrics, action buttons. "Sync Now" with confirmation dialog (prevents accidental triggers). Error log filterable by severity and date range. Auto-refresh every 60 seconds.

---

### US-E11-006 | Handle Integration Error Recovery and Retry

**Epic:** E11 — Integration
**Persona:** Minho Kim (Planning Manager)
**Feature:** F1, F2 | **Req:** 2, 5

> As a **Planning Manager**, I want the **system to automatically retry failed sync operations and notify me if retries are exhausted**, so that **transient failures are handled gracefully without manual intervention**.

**Acceptance Criteria:**

1. **Given** a sync operation fails, **When** the failure is detected, **Then** the system automatically retries up to 3 times with exponential backoff (1 min, 5 min, 30 min).
2. **Given** all retries are exhausted, **When** the final retry fails, **Then** an alert notification is sent to the integration admin and the failed records are moved to a "Dead Letter Queue" for manual review.
3. **Given** I review the Dead Letter Queue, **When** I select failed records, **Then** I can: manually retry, skip (mark as resolved), or escalate to Samsung IT support with a pre-filled error report.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E11-005, US-E12-001
**CXO UX Notes:** Dead Letter Queue as a dedicated view accessible from the Integration Dashboard. Each record shows: system, operation type, payload preview, error details, retry count. Bulk actions: "Retry Selected", "Skip Selected". Escalation opens an email template pre-filled with error context. Queue badge count in the Integration nav item.

---

## E12: Smart Notifications

### US-E12-001 | Receive Email on Approval Request

**Epic:** E12 — Smart Notifications
**Persona:** Minho Kim (Planning Manager)
**Feature:** F6 | **Req:** 10

> As a **Planning Manager**, I want to **receive an email notification when a planner submits a P/M plan or Roadmap version for my approval**, so that **I can review and respond promptly**.

**Acceptance Criteria:**

1. **Given** a planner submits a Draft for approval, **When** the submission is processed, **Then** I receive an email with: subject line "[IRIS] Approval Required — [Project Name] Roadmap v[X]", summary of changes, and a deep link to the approval view.
2. **Given** I click the deep link in the email, **When** my browser opens, **Then** I am taken directly to the diff view with the approval panel ready.
3. **Given** I have already approved the request, **When** another notification arrives for a different project, **Then** the previous project's notification email is not duplicated.

**Story Points:** 3
**Priority:** Must
**Dependencies:** US-E03-005, US-E04-004, US-E13-001
**CXO UX Notes:** Email template uses clean, responsive HTML layout with Samsung branding. Change summary as a mini-table in the email body (not just a link). Deep link includes authentication context for SSO pass-through. Mobile email rendering tested for iOS Mail and Samsung Email app.

---

### US-E12-002 | Configure Notification Preferences

**Epic:** E12 — Smart Notifications
**Persona:** Jisoo Park (Senior Resource Planner)
**Feature:** F6 | **Req:** 10

> As a **Resource Planner**, I want to **configure my notification preferences (which events trigger emails, in-app notifications, or both)**, so that **I receive alerts that are relevant without being overwhelmed**.

**Acceptance Criteria:**

1. **Given** I open Notification Settings, **When** I view the configuration, **Then** I see a matrix of notification types (Approval Request, Approval Decision, Conflict Alert, Sync Status, Report Ready, HC Gap Alert) with toggles for: Email, In-App, and Off.
2. **Given** I disable email for "Sync Status" notifications, **When** a sync completes, **Then** I receive only an in-app notification (no email).
3. **Given** I set "Conflict Alert" to both Email and In-App, **When** a conflict is detected in a plan I am editing, **Then** I receive both an email and a real-time in-app popup.

**Story Points:** 5
**Priority:** Should
**Dependencies:** US-E12-001
**CXO UX Notes:** Notification matrix as a clean table with toggle switches (not checkboxes). Smart defaults: approval = Email + In-App, sync = In-App only, reports = Email only. "Mute All" toggle at the top for temporary silence. In-app notifications as a bell icon in the header with unread count badge. Notification history accessible from the bell dropdown.

---

### US-E12-003 | Scheduled Report Email Delivery

**Epic:** E12 — Smart Notifications
**Persona:** Eunji Lee (Analytics Specialist)
**Feature:** F6 | **Req:** 10

> As an **Analytics Specialist**, I want **scheduled reports to be delivered to a distribution list via email**, so that **stakeholders receive periodic updates automatically**.

**Acceptance Criteria:**

1. **Given** I have configured a report schedule (US-E08-006), **When** the scheduled time arrives, **Then** the report is generated and emailed to all addresses in the distribution list with the report attached (PDF or Excel per configuration).
2. **Given** the email is sent, **When** a recipient opens it, **Then** they see: subject "[IRIS] Scheduled Report — [Report Name] — [Date]", a brief summary, and the report as an attachment.
3. **Given** the report generation fails, **When** the failure is detected, **Then** the schedule owner receives a notification with the error details and the next scheduled run proceeds as planned.

**Story Points:** 3
**Priority:** Could
**Dependencies:** US-E08-006, US-E12-001
**CXO UX Notes:** Email includes inline preview of key metrics (not just attachment). Attachment size limit: 10MB — large reports include a download link instead. Unsubscribe link in footer for distribution list recipients. Failure notification includes a "Run Now" link for manual execution.

---

## E13: Infrastructure & Server Setup

### US-E13-001 | Set Up QA Environment

**Epic:** E13 — Infrastructure & Server Setup
**Persona:** System Admin
**Feature:** — | **Req:** 12

> As a **System Administrator**, I want to **set up the IRIS QA environment with all required infrastructure components**, so that **the development team can deploy and test IRIS features starting April 2026**.

**Acceptance Criteria:**

1. **Given** the QA environment is provisioned, **When** the setup is complete, **Then** the following are running: Mendix 10 runtime, Oracle 19c database, Elasticsearch 8.x cluster, WebSocket server, and Samsung SSO integration.
2. **Given** the QA environment is ready, **When** a developer deploys a Mendix package, **Then** the deployment completes within 10 minutes and the application is accessible via the QA URL.
3. **Given** Samsung VPN is required, **When** a user connects via VPN, **Then** they can access the QA environment with proper authentication.

**Story Points:** 5
**Priority:** Must
**Dependencies:** Samsung IT infrastructure approval
**CXO UX Notes:** N/A (infrastructure story). Ensure QA environment performance is sufficient for UX testing with realistic data volumes (minimum 50 concurrent users, 500 projects, 5000 resources).

---

### US-E13-002 | Set Up Production Environment

**Epic:** E13 — Infrastructure & Server Setup
**Persona:** System Admin
**Feature:** — | **Req:** 12

> As a **System Administrator**, I want to **set up the IRIS Production environment with high-availability configuration**, so that **Samsung DSR users can access IRIS reliably starting July 2026**.

**Acceptance Criteria:**

1. **Given** the Production environment is provisioned, **When** the setup is complete, **Then** the following are running with HA configuration: Mendix 10 (clustered), Oracle 19c (RAC or Data Guard), Elasticsearch 8.x (cluster with master + data nodes), and load balancer.
2. **Given** the production environment is live, **When** 200 concurrent users access IRIS, **Then** response times remain under 3 seconds for standard operations (page load, search, report generation).
3. **Given** a data migration plan is executed, **When** QA-validated data is migrated to Production, **Then** data integrity checks pass (row counts, checksum validation) and the migration is completed within the maintenance window.

**Story Points:** 8
**Priority:** Must
**Dependencies:** US-E13-001 (QA environment as blueprint)
**CXO UX Notes:** Performance target: page load < 2s, search < 500ms, report generation < 5s under full load. These targets directly impact perceived UX quality. Load testing must simulate realistic Samsung DSR usage patterns (heavy Gantt views, large Excel exports).

---

### US-E13-003 | Configure Elasticsearch Cluster

**Epic:** E13 — Infrastructure & Server Setup
**Persona:** System Admin
**Feature:** — | **Req:** 12

> As a **System Administrator**, I want to **configure the Elasticsearch 8.x cluster with dedicated master and data nodes**, so that **IRIS analytical queries and full-text search perform reliably at scale**.

**Acceptance Criteria:**

1. **Given** the ES cluster is provisioned, **When** configuration is complete, **Then** the cluster has: 3 dedicated master nodes (for quorum) + N data nodes (scaled to data volume), with cross-cluster replication if multi-site is required.
2. **Given** the cluster is running, **When** IRIS indexes master data, allocation data, and analytical aggregations, **Then** index creation completes without errors and search queries return results in < 500ms for standard queries.
3. **Given** a data node fails, **When** the cluster detects the failure, **Then** it automatically rebalances shards to remaining nodes and continues serving queries without downtime.

**Story Points:** 3
**Priority:** Must
**Dependencies:** US-E13-001
**CXO UX Notes:** Search performance directly impacts user experience. Target: autocomplete results in < 300ms, analysis queries in < 500ms, full-text search in < 200ms. Index lifecycle management must handle 3+ years of historical data without degradation.

---

## Story Map

The story map organizes all 74 stories by Epic (rows) and User Activity (columns), with the MVP line separating Must Have from Should/Could/Won't.

```
                 DISCOVER           PLAN              EXECUTE           ANALYZE           ADMIN
                 (Navigate/View)    (Create/Config)   (Edit/Process)    (Report/Insight)  (Manage/Monitor)
==============================================================================================================

E01 Master Data  E01-007 Search    E01-004 Prod Type  E01-002 Std PM    E01-003 Revision  E01-001 Org Hier
& Standard PM    E01-006 Sync      E01-005 Skills     Templates         History           E01-008 Dimensions
                                   E01-008 Dimensions

E02 Project      E02-005 Dashboard E02-001 Lifecycle   E02-003 N-PLM    E02-002 Actuals   E02-004 Leaders
Mgmt                                                   Bi-Sync

E03 P/M Planner  E03-001 See       E03-004 Draft/Perm E03-002 Real-time E03-006 Gantt     E03-007 Factor
Concurrent       Editors           E03-005 Approval    Sync             View              Control Filter
                                   E03-009 Import/Exp  E03-003 Conflict                   E03-008 Undo/Redo
                                                       Resolution

E04 Roadmap &    E04-002 Version   E04-001 New        E04-006 Alloc     E04-003 Diff      E04-007 Lock
Versioning       History           Version             Entries           View              Versions
                 E04-008 Summary   E04-004 Approval    E04-005 Delta
                                                       PROMIS Sync

E05 Simulation                     E05-001 Clone       E05-002 Modify   E05-003 Compare   E05-006 Sim
                                   Roadmap             Allocations       vs Roadmap        History
                                   E05-005 Promote     E05-004 Multi-
                                                       Compare

E06 HeadCount    E06-002 Dashboard E06-001 Targets    E06-004 Hiring    E06-005 Trends
Portfolio        E06-003 Gap                           Actions
                 Analysis

E07 World Map    E07-001 Map       E07-004 Role Menu  E07-002 Drill     E07-003 Stats     E07-005 Custom
& Navigation     Pins              E07-006 Responsive  Down              per Site          Dashboard

E08 Analysis &   E08-005 Personal  E08-001 Dimension  E08-002 Factor    E08-003 Chart     E08-006 Schedule
Reporting        View              Selector            Control           Types
                                   E08-004 Save/Share                   E08-007 Gap Rpt

E09 AI-Based                       E09-003 Suggested  E09-001 AI PIVOT  E09-002 NLQ       E09-004 Export
Reporting                          Templates                            to Chart

E10 Factor                         E10-001 Create Set E10-002 Apply     E10-003 Presets   E10-004 Global
Control                                               to Views                            Templates

E11 Integration  E11-005 Dashboard                     E11-001 PROMIS   E11-006 Error     E11-002 N-PLM
                                                       Delta Sync        Recovery          E11-003 Push
                                                       E11-004 GHRP

E12 Notifs       E12-002 Prefs                        E12-001 Approval  E12-003 Report
                                                       Email             Email

E13 Infra                          E13-001 QA Env     E13-002 Prod Env
                                   E13-003 ES Cluster

==============================================================================================================
                                         MVP LINE (Must Have above)
--------------------------------------------------------------------------------------------------------------

MUST HAVE (MVP):  E01 (001-004,006,008), E02 (001-003), E03 (001-006), E04 (001-007),
                  E11 (001-003,005), E12 (001), E13 (001-003)
                  = 36 stories, ~220 SP

SHOULD HAVE:      E01 (005,007), E02 (004-005), E03 (007,009), E04 (008), E05 (001-005),
                  E06 (001-004), E07 (001-004,006), E08 (001-004,007), E10 (001-002),
                  E11 (004,006), E12 (002)
                  = 28 stories, ~133 SP

COULD HAVE:       E03 (008), E05 (006), E06 (005), E07 (005), E08 (005-006),
                  E10 (003-004), E12 (003)
                  = 8 stories, ~27 SP

WON'T (v1):       E09 (001-004)
                  = 4 stories, ~21 SP
```

---

## Priority Summary

| Priority       | Story Count          | Story Points | % of Total SP |
| -------------- | -------------------- | ------------ | ------------- |
| **Must**       | 36                   | ~220         | 57%           |
| **Should**     | 28                   | ~133         | 34%           |
| **Could**      | 8                    | ~27          | 7%            |
| **Won't (v1)** | 4                    | ~21          | —             |
| **TOTAL**      | 74 (excl. Won't: 70) | 388          | 100%          |

---

## Story Point Summary per Epic

| Epic      | Must SP | Should SP | Could SP | Won't SP | Total SP     |
| --------- | ------- | --------- | -------- | -------- | ------------ |
| E01       | 33      | 6         | —        | —        | 39           |
| E02       | 18      | 8         | —        | —        | 26           |
| E03       | 39      | 10        | 3        | —        | 55 (3 Could) |
| E04       | 39      | 8         | —        | —        | 47           |
| E05       | —       | 28        | 3        | —        | 34 (3 Could) |
| E06       | —       | 20        | 3        | —        | 23           |
| E07       | —       | 23        | 5        | —        | 28           |
| E08       | —       | 28        | 10       | —        | 38           |
| E09       | —       | —         | —        | 21       | 21           |
| E10       | —       | 8         | 8        | —        | 16           |
| E11       | 23      | 10        | —        | —        | 34 (1 Could) |
| E12       | 3       | 5         | 3        | —        | 11           |
| E13       | 16      | —         | —        | —        | 16           |
| **Total** | **220** | **133**   | **27**   | **21**   | **388**      |

---

## Traceability Matrix

| Story ID   | Epic | Feature Area | Samsung Req | Problem Statement                                            |
| ---------- | ---- | ------------ | ----------- | ------------------------------------------------------------ |
| US-E01-001 | E01  | F1           | 0           | PS1: Fragmented master data across disconnected systems      |
| US-E01-002 | E01  | F1           | 0           | PS1: No standardized PM templates for consistent planning    |
| US-E01-003 | E01  | F1           | 0           | PS1: Lack of audit trail for master data changes             |
| US-E01-004 | E01  | F1           | 0           | PS1: Inconsistent project structures without standard types  |
| US-E01-005 | E01  | F1           | 0           | PS1: Cannot match employee skills to project requirements    |
| US-E01-006 | E01  | F1           | 5           | PS1: Manual data re-entry from N-PLM/SMDM/GHRP               |
| US-E01-007 | E01  | F1           | 0           | PS1: Slow data retrieval across master data entities         |
| US-E01-008 | E01  | F1           | 0           | PS1: Inconsistent PM dimensions across planning views        |
| US-E02-001 | E02  | F2           | 5           | PS2: No unified project lifecycle management                 |
| US-E02-002 | E02  | F2           | 5           | PS2: Cannot compare planned vs. actual resource consumption  |
| US-E02-003 | E02  | F2           | 5           | PS2: Dual data entry between IRIS and N-PLM                  |
| US-E02-004 | E02  | F2           | 5           | PS2: Unclear project accountability and approval routing     |
| US-E02-005 | E02  | F2           | 5           | PS2: No project-level resource overview dashboard            |
| US-E03-001 | E03  | F1, F3       | 0, 3        | PS3: Planners overwrite each other's work in shared plans    |
| US-E03-002 | E03  | F1, F3       | 0, 3        | PS3: No real-time collaboration on PM allocations            |
| US-E03-003 | E03  | F1, F3       | 3           | PS3: Silent data loss from concurrent edits                  |
| US-E03-004 | E03  | F1, F3       | 3           | PS3: No governance model for save/approve PM plans           |
| US-E03-005 | E03  | F1, F3       | 3           | PS3: Missing approval workflow for PM plan changes           |
| US-E03-006 | E03  | F3           | 0           | PS3: Cannot visualize resource loading over time             |
| US-E03-007 | E03  | F1, F3       | 0, 6        | PS3: Information overload without dimension filtering        |
| US-E03-008 | E03  | F1, F3       | 0           | PS3: Fear of experimentation without undo capability         |
| US-E03-009 | E03  | F1, F3       | 0           | PS3: No offline/bulk data import/export workflow             |
| US-E04-001 | E04  | F3           | 1, 4        | PS4: No version control for resource roadmaps                |
| US-E04-002 | E04  | F3           | 2, 4        | PS4: Cannot track roadmap evolution over time                |
| US-E04-003 | E04  | F3           | 2           | PS4: Cannot compare roadmap versions before approval         |
| US-E04-004 | E04  | F3           | 4           | PS4: No formal approval process for roadmap changes          |
| US-E04-005 | E04  | F3           | 2           | PS4: Full data transfer to PROMIS wastes processing time     |
| US-E04-006 | E04  | F3           | 1           | PS4: Cannot build granular per-resource per-period plans     |
| US-E04-007 | E04  | F3           | 4           | PS4: Approved versions can be accidentally modified          |
| US-E04-008 | E04  | F3           | 1, 4        | PS4: No quick-glance summary of roadmap health               |
| US-E05-001 | E05  | F3           | 1, 4        | PS5: Cannot explore what-if scenarios without risk           |
| US-E05-002 | E05  | F3           | 1           | PS5: Simulation requires same governance as production plans |
| US-E05-003 | E05  | F3           | 1, 4        | PS5: Cannot quantify simulation impact vs. baseline          |
| US-E05-004 | E05  | F3           | 1           | PS5: Cannot compare multiple scenarios side by side          |
| US-E05-005 | E05  | F3           | 1, 4        | PS5: No path from winning simulation to official plan        |
| US-E05-006 | E05  | F3           | 1           | PS5: Previous simulation scenarios lost after closure        |
| US-E06-001 | E06  | F4           | 9           | PS1: No structured staffing target management                |
| US-E06-002 | E06  | F4           | 9           | PS1: Cannot compare current vs. target headcount             |
| US-E06-003 | E06  | F4           | 9           | PS1: Skill-level gaps invisible at department level          |
| US-E06-004 | E06  | F4           | 9           | PS1: No tracking of staffing remediation actions             |
| US-E06-005 | E06  | F4           | 9           | PS1: No historical trend analysis for headcount planning     |
| US-E07-001 | E07  | F4           | 7, 8        | PS2: No global overview of resource distribution             |
| US-E07-002 | E07  | F4           | 7, 8        | PS2: Cannot drill from global to granular resource data      |
| US-E07-003 | E07  | F4           | 7, 8        | PS2: Cannot compare site-level resource health               |
| US-E07-004 | E07  | F4           | 7           | PS2: One-size-fits-all navigation slows daily tasks          |
| US-E07-005 | E07  | F4           | 7           | PS2: Fixed dashboard does not adapt to individual needs      |
| US-E07-006 | E07  | F4           | 7           | PS2: Desktop-only access limits field use                    |
| US-E08-001 | E08  | F5, F6       | 8, 10       | PS4: No self-service ad-hoc analysis capability              |
| US-E08-002 | E08  | F5, F6       | 6, 8        | PS4: Analysis cannot be scoped to relevant segments          |
| US-E08-003 | E08  | F5, F6       | 8, 10       | PS4: Limited visualization options for analysis              |
| US-E08-004 | E08  | F5, F6       | 8           | PS4: Analysis configurations lost between sessions           |
| US-E08-005 | E08  | F5           | 8           | PS4: No personalized resource analysis view                  |
| US-E08-006 | E08  | F6           | 10          | PS4: Manual report generation and distribution               |
| US-E08-007 | E08  | F5           | 8, 10       | PS4: No dedicated planned vs. actual gap dashboard           |
| US-E09-001 | E09  | F7           | 11          | PS5: Complex pivot tables require manual expertise           |
| US-E09-002 | E09  | F7           | 11          | PS5: Non-technical users cannot create ad-hoc reports        |
| US-E09-003 | E09  | F7           | 11          | PS5: Users do not know which reports are useful              |
| US-E09-004 | E09  | F7           | 11          | PS5: AI-generated reports cannot be distributed              |
| US-E10-001 | E10  | —            | 6           | PS3: No reusable filter context across views                 |
| US-E10-002 | E10  | —            | 6           | PS3: Filters reset when navigating between views             |
| US-E10-003 | E10  | —            | 6           | PS3: Frequent filter re-configuration wastes time            |
| US-E10-004 | E10  | —            | 6           | PS3: No standardized filter templates across the team        |
| US-E11-001 | E11  | F1, F2       | 2           | PS1: Full data transfer to PROMIS is redundant               |
| US-E11-002 | E11  | F1           | 5           | PS1: Master data not synced from N-PLM/SMDM                  |
| US-E11-003 | E11  | F2           | 5           | PS1: Project updates not pushed back to N-PLM                |
| US-E11-004 | E11  | F1           | 5           | PS1: Employee data not synced from GHRP                      |
| US-E11-005 | E11  | F1, F2       | 2, 5        | PS1: No visibility into integration health                   |
| US-E11-006 | E11  | F1, F2       | 2, 5        | PS1: Sync failures require manual intervention               |
| US-E12-001 | E12  | F6           | 10          | PS3: Approval requests not communicated promptly             |
| US-E12-002 | E12  | F6           | 10          | PS3: Notification overload without preferences               |
| US-E12-003 | E12  | F6           | 10          | PS4: Manual report distribution by email                     |
| US-E13-001 | E13  | —            | 12          | Enabler: QA infrastructure for development                   |
| US-E13-002 | E13  | —            | 12          | Enabler: Production infrastructure for launch                |
| US-E13-003 | E13  | —            | 12          | Enabler: Search and analytics infrastructure                 |

---

## Sprint Assignment (Preliminary)

| Sprint              | Focus                                                       | Epics                                                              | Estimated SP |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------ | ------------ |
| Sprint 1 (Apr 2026) | Foundation: Infrastructure + Master Data + Core P/M Planner | E13 (all), E01 (001-004,006,008), E03 (001-002)                    | ~56          |
| Sprint 2 (May 2026) | Collaboration + Versioning: Concurrent Edit + Roadmap       | E03 (003-006), E04 (001-005), E02 (001-003)                        | ~65          |
| Sprint 3 (Jun 2026) | Integration + Simulation: PROMIS/N-PLM + Simulation         | E04 (006-008), E05 (001-005), E11 (001-005)                        | ~65          |
| Sprint 4 (Jul 2026) | Analytics + Portfolio: World Map + Analysis + HC            | E07 (001-004,006), E08 (001-004,007), E06 (001-004), E10 (001-002) | ~68          |
| Sprint 5 (Aug 2026) | Polish + Should/Could: Notifications + Remaining            | E12 (all), remaining Should/Could stories                          | ~35          |
| Phase 2 (TBD)       | AI-Based Reporting                                          | E09 (all)                                                          | ~21          |

---

## Definition of Done (All Stories)

- [ ] Code reviewed and approved by at least one team member
- [ ] Unit and integration tests passing (80%+ coverage on new code)
- [ ] Documentation updated (API docs, Mendix module docs, or user guide as applicable)
- [ ] Demo-ready — can be demonstrated to Samsung DSR stakeholders in sprint review
- [ ] Acceptance criteria verified by Product Owner or designated reviewer
- [ ] No critical or major bugs open against this story
- [ ] Performance benchmark met (per technical notes in each story)
- [ ] Samsung DSR data used in demo (realistic Hwaseong/Pyeongtaek context)
- [ ] WCAG 2.1 AA accessibility verified for all UI stories
- [ ] Responsive behavior verified on 1920px (desktop) and 1024px (tablet) viewports
- [ ] AI-generated code flagged and reviewed per T26 Code Review Checklist

---

## CXO Design Principles Applied

The following UX principles are applied consistently across all 74 stories:

| Principle                  | Application                                                                                                                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Consistency**            | Same interaction patterns across all data grids (inline edit, Tab/Enter commit, Ctrl+Z undo). Same diff view across E01, E03, E04, E05. Same integration badge style across E11.    |
| **Accessibility**          | Color coding always paired with icons/text (never color alone). WCAG 2.1 AA contrast. Keyboard navigation for all core workflows. Screen reader announcements for real-time events. |
| **Progressive Disclosure** | Complex forms use multi-step wizards. Advanced options behind expandable sections. "Recently Used" at top of selectors.                                                             |
| **Responsive**             | Core workflows (approvals, dashboards, navigation) functional on 1024px tablet. Data grids use frozen columns + horizontal scroll. Touch targets 44x44px minimum.                   |
| **Feedback**               | Every action produces visible feedback (save confirmation, sync status, conflict alerts). Loading states for all async operations. Error states with recovery guidance.             |
| **Performance**            | Search < 300ms, page load < 2s, Gantt render < 3s for 200 resources. These targets are acceptance criteria, not aspirations.                                                        |

---

## Related Documents

- **T15_USER_STORY** — AX template used for story format
- **S3 Concept Validation** — Usability findings incorporated into acceptance criteria
- **S1 HMW Statements** — Problem framing referenced in traceability matrix
- **IRIS DISCOVER Phase** — Personas, empathy maps, and problem statements

---

_This document follows the AX Transformation Framework T15 User Story template._
_Project: IRIS | Customer: Samsung Electronics DSR | Epics: E01-E13 | Stories: 74_
_CXO Author | Date: 2026-03-21_
