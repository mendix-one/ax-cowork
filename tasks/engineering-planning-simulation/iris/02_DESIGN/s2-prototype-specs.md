# S2: Prototype Specifications — IRIS

> **AX Phase**: DESIGN | **Deliverable**: S2 — Prototype Specifications
> **Product**: IRIS — Intelligent Resources Information System
> **Customer**: Samsung Electronics — Device Solutions Research (DSR)
> **Date**: 2026-03-21
> **Author**: CXO with AI assistance
> **Status**: Draft
> **Framework**: AX Transformation Framework v2.0.0
> **Source**: S1a HMW Workshop + S1b Concept Sketches

---

## Document Purpose

This document provides comprehensive screen-by-screen prototype specifications for the IRIS system. These 10 screens cover all 5 concepts from S1b and address all 7 feature areas (F1-F7) and Samsung requirements (Req 0-12). Each screen is designed fresh for IRIS as a new build on Mendix 10 + Oracle 19c + ES 8.x + xDHTML Gantt + ECharts.js.

**Design System**: Material Design 3 (MD3) | Primary: Indigo #3F51B5 | Font: Roboto | High-density mode for planners
**Tech Stack**: Mendix 10, Oracle 19c, Elasticsearch 8.x, xDHTML Gantt (W01), ECharts.js (W02/W04), DiffViewer (W03), PivotTable (W05)

---

## Screen Index

| #   | Screen Name                      | Concept                | Epic | Feature Areas | Samsung Req | Primary Persona              |
| --- | -------------------------------- | ---------------------- | ---- | ------------- | ----------- | ---------------------------- |
| 1   | World Map Home                   | C: Global Cockpit      | E07  | F4            | 7, 8        | Minho Kim (Division Manager) |
| 2   | P/M Planner — Gantt View         | A: Collaborative Gantt | E03  | F1, F3        | 0, 3        | Jisoo Park (Planner)         |
| 3   | Conflict Resolution Panel        | A: Collaborative Gantt | E03  | F1            | 3           | Jisoo Park (Planner)         |
| 4   | Master Data Management           | Foundation             | E01  | F1            | 0, 5        | Site Admin                   |
| 5   | Resource Roadmap + Version Panel | D: Diff & Delta Engine | E04  | F3            | 1, 2, 4     | Jisoo Park (Planner)         |
| 6   | Simulation Sandbox               | B: Simulation Sandbox  | E05  | F3            | 1, 4        | Jisoo Park (Planner)         |
| 7   | HeadCount Portfolio              | C: Global Cockpit      | E06  | F4            | 9           | Soyeon Choi (HR Planner)     |
| 8   | Analysis Dashboard               | E: AI Analysis Builder | E08  | F5, F6        | 8, 10       | Eunji Lee (Analyst)          |
| 9   | AI Report Builder                | E: AI Analysis Builder | E09  | F7            | 11          | Eunji Lee (Analyst)          |
| 10  | Project Management               | Foundation             | E02  | F2            | 5           | Minho Kim (Manager)          |

---

## Design System Specification

### Color Tokens

| Token                       | Value                        | Usage                                                                     |
| --------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| `--iris-primary`            | `#3F51B5` (Indigo)           | Primary buttons, active navigation, header bars, key interactive elements |
| `--iris-on-primary`         | `#FFFFFF`                    | Text and icons on primary-colored surfaces                                |
| `--iris-primary-container`  | `#E8EAF6` (Indigo-50)        | Selected row highlights, active card backgrounds, chip backgrounds        |
| `--iris-secondary`          | `#7C4DFF` (Deep Purple A200) | Secondary actions, hyperlinks, accent badges                              |
| `--iris-surface`            | `#FFFFFF`                    | Card surfaces, dialog backgrounds, content panels                         |
| `--iris-surface-variant`    | `#F5F5F5` (Gray-100)         | Table header rows, sidebar backgrounds, inactive tabs                     |
| `--iris-on-surface`         | `#1C1B1F`                    | Primary text, headings                                                    |
| `--iris-on-surface-variant` | `#49454F`                    | Secondary text, labels, placeholder text, captions                        |
| `--iris-outline`            | `#79747E`                    | Borders, dividers, input field outlines                                   |
| `--iris-outline-variant`    | `#CAC4D0`                    | Subtle dividers, disabled borders                                         |
| `--iris-error`              | `#B3261E`                    | Validation errors, destructive actions, conflict alerts                   |
| `--iris-success`            | `#2E7D32` (Green-800)        | Success states, healthy utilization, added items                          |
| `--iris-warning`            | `#F57F17` (Amber-900)        | Warning states, approaching limits, elevated utilization                  |
| `--iris-info`               | `#1565C0` (Blue-800)         | Informational badges, neutral status indicators                           |

### Diff Colors (Version Comparison)

| Purpose  | Color | Hex       | Usage                                     |
| -------- | ----- | --------- | ----------------------------------------- |
| Added    | Green | `#4CAF50` | New rows, new allocations, added projects |
| Removed  | Red   | `#F44336` | Deleted rows, removed allocations         |
| Modified | Amber | `#FF9800` | Changed values, updated percentages       |

### Presence Colors (Concurrent Editing)

| User Slot    | Color  | Hex       | Usage                                          |
| ------------ | ------ | --------- | ---------------------------------------------- |
| User A       | Blue   | `#2196F3` | Cell border, avatar ring, activity feed marker |
| User B       | Purple | `#9C27B0` | Cell border, avatar ring, activity feed marker |
| User C       | Teal   | `#009688` | Cell border, avatar ring, activity feed marker |
| User D       | Orange | `#FF5722` | Cell border, avatar ring, activity feed marker |
| Current User | Indigo | `#3F51B5` | Own edits, own cursor, own avatar              |

### Typography

| Level           | Font         | Size | Weight | Line Height | Usage                                                |
| --------------- | ------------ | ---- | ------ | ----------- | ---------------------------------------------------- |
| Display         | Roboto       | 28px | 400    | 36px        | Page titles (rarely used)                            |
| Headline        | Roboto       | 24px | 400    | 32px        | Section headers, modal titles                        |
| Title           | Roboto       | 20px | 500    | 28px        | Card titles, panel headers                           |
| Subtitle        | Roboto       | 16px | 500    | 24px        | Sub-section headings, list group headers             |
| Body            | Roboto       | 14px | 400    | 20px        | Standard body text, table cells, form labels         |
| Caption         | Roboto       | 12px | 400    | 16px        | Timestamps, metadata, helper text, Gantt cell values |
| Korean Fallback | Noto Sans KR | Same | Same   | Same        | Korean characters automatically                      |
| Monospace       | Roboto Mono  | 12px | 400    | 16px        | Code values, IDs, allocation percentages in grid     |

### Spacing and Layout

| Token                | Value                 | Usage                                             |
| -------------------- | --------------------- | ------------------------------------------------- |
| Base unit            | 8px                   | All spacing is a multiple of 8                    |
| Compact density      | 4px internal padding  | High-density Gantt cells, table rows for planners |
| Default density      | 8px internal padding  | Standard UI elements                              |
| Comfortable density  | 12px internal padding | Touch-friendly, mobile, HR/manager views          |
| Card border radius   | 12px                  | All MD3 cards                                     |
| Button border radius | 8px                   | All MD3 buttons                                   |
| Input border radius  | 4px                   | Text inputs, dropdowns                            |
| Elevation dp0        | 0px shadow            | Flat surfaces                                     |
| Elevation dp1        | 1px shadow            | Cards, list items                                 |
| Elevation dp3        | 3px shadow            | Navigation rail, app bar                          |
| Elevation dp6        | 6px shadow            | Dialogs, modals, FABs                             |

### Iconography

| System     | Icon Set                          | Usage                                  |
| ---------- | --------------------------------- | -------------------------------------- |
| Navigation | Material Symbols (Outlined, 24px) | Navigation rail items, top bar actions |
| Status     | Material Symbols (Filled, 20px)   | Status badges, sync indicators         |
| Actions    | Material Symbols (Outlined, 20px) | Toolbar buttons, context menu items    |
| Flags      | Country flag SVGs                 | World map site pins                    |
| Custom     | IRIS-specific SVG                 | Gantt, conflict, simulation icons      |

---

## Navigation Architecture

### Global Navigation Shell (Persistent across all screens)

```
+--------------------------------------------------------------------------+
|  +--- Top App Bar (dp3 elevation, Indigo #3F51B5) -------------------+  |
|  |  [=] IRIS                  [O Search] [! 3] [? Help] [Jisoo Park v]  |
|  |      Intelligent Resources Information System                        |
|  +-------------------------------------------------------------------+  |
|                                                                          |
|  +--- Nav Rail (72px, dp3) ---+  +--- Content Area -----------------+  |
|  |                            |  |                                    |  |
|  |  [#] Home                  |  |  +--- Breadcrumb Bar -----------+ |  |
|  |  [=] P/M Planner           |  |  | Home > P/M Planner > DRAM    | |  |
|  |  [~] Roadmap               |  |  +------------------------------+ |  |
|  |  [%] Simulation            |  |                                    |  |
|  |  [^] Analysis              |  |  (Screen-specific content)        |  |
|  |  [&] HC Portfolio           |  |                                    |  |
|  |  [@] Projects              |  |                                    |  |
|  |  [*] Master Data            |  |                                    |  |
|  |                            |  |                                    |  |
|  |  --- Admin ---             |  |                                    |  |
|  |  [!] Sync Status           |  |                                    |  |
|  |  [>] Settings              |  |                                    |  |
|  +----------------------------+  +------------------------------------+  |
+--------------------------------------------------------------------------+
```

### Role-Based Navigation Visibility

| Nav Item     | Planner | Manager | Analyst | HR Planner | Admin |
| ------------ | ------- | ------- | ------- | ---------- | ----- |
| Home         | Yes     | Yes     | Yes     | Yes        | Yes   |
| P/M Planner  | Yes     | Yes     | No      | No         | Yes   |
| Roadmap      | Yes     | Yes     | No      | No         | Yes   |
| Simulation   | Yes     | Yes     | No      | No         | Yes   |
| Analysis     | No      | Yes     | Yes     | No         | Yes   |
| HC Portfolio | No      | Yes     | Yes     | Yes        | Yes   |
| Projects     | Yes     | Yes     | Yes     | No         | Yes   |
| Master Data  | Yes     | Yes     | No      | No         | Yes   |
| Sync Status  | No      | Yes     | No      | No         | Yes   |
| Settings     | No      | No      | No      | No         | Yes   |

### Breadcrumb Convention

Format: `Home > [Module] > [Context Level 1] > [Context Level 2]`

Examples:

- `Home > P/M Planner > Hwaseong > DRAM Development > April 2026`
- `Home > Roadmap > Hwaseong > Memory BU > FY2026`
- `Home > Analysis > Heatmap: Department x Project`

### Quick Switcher (Keyboard: Ctrl+K)

```
+--- Quick Switcher (Modal, dp6) ---+
| Search IRIS...                [X] |
|                                    |
| RECENT                            |
| [=] P/M Plan: DRAM Dev Apr 2026  |
| [~] Roadmap: Hwaseong FY2026     |
| [^] Analysis: Dept Heatmap        |
|                                    |
| SCREENS                           |
| [#] Home                          |
| [=] P/M Planner                   |
| [~] Roadmap                       |
| ...                                |
+------------------------------------+
```

---

## Factor Control Specification

The Factor Control panel is a reusable filter component that appears on screens 1, 2, 5, 6, 7, and 8. It provides consistent cross-dimensional filtering across the entire application.

### Factor Control Panel Layout

```
+--- Factor Control (collapsible sidebar, 240px) ----+
|  FACTOR CONTROL                          [< Collapse]|
|                                                      |
|  Site                                                |
|  [Hwaseong           v] (multi-select with search)   |
|                                                      |
|  Business Unit                                       |
|  [Memory             v] (multi-select)               |
|                                                      |
|  Department                                          |
|  [All Departments    v] (multi-select, hierarchical) |
|                                                      |
|  Project Type                                        |
|  [All Types          v] (multi-select)               |
|                                                      |
|  Period                                              |
|  [Q2 2026            v] (range picker: month/quarter)|
|                                                      |
|  Status                                              |
|  [Active             v] (single select)              |
|                                                      |
|  +--- Saved Filter Sets --------------------------+  |
|  | [Default           v]  [Save As] [Reset All]   |  |
|  +-------------------------------------------------+ |
|                                                      |
|  [Apply Filters]  (primary button, full-width)       |
+------------------------------------------------------+
```

### Factor Control Behavior

| Aspect             | Specification                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **Module**         | M05 FactorControl                                                                                 |
| **Position**       | Left sidebar, below navigation rail content start                                                 |
| **Default state**  | Expanded on desktop (>1280px), collapsed on tablet                                                |
| **Persistence**    | Selected filters persist in user session (Oracle, M01)                                            |
| **Saved sets**     | Users can save named filter combinations for quick recall                                         |
| **Cascading**      | Site selection filters BU options; BU filters Department options                                  |
| **Apply behavior** | Clicking "Apply Filters" triggers ES re-query; all visualizations on the current screen re-render |
| **Reset**          | "Reset All" returns to default (All Sites, All BU, Current Quarter, Active)                       |
| **Keyboard**       | Ctrl+F focuses the first dropdown; Tab navigates between fields                                   |
| **Collapsed mode** | Shows as 48px icon strip with active filter count badge                                           |

### Factor Control Data Sources

| Field         | Source       | Entity                                                  |
| ------------- | ------------ | ------------------------------------------------------- |
| Site          | Oracle (M02) | Site — site_name, site_code                             |
| Business Unit | Oracle (M02) | BusinessUnit — bu_name, bu_code, site_id                |
| Department    | Oracle (M02) | Department — dept_name, dept_code, bu_id (hierarchical) |
| Project Type  | Oracle (M02) | ProjectType — type_name, type_code                      |
| Period        | Computed     | FiscalPeriod — fiscal_year, quarter, month              |
| Status        | Enum         | Active, On-Hold, Completed, Cancelled, All              |

---

---

## Screen 1: World Map Home

### Metadata

| Field                | Value                                                      |
| -------------------- | ---------------------------------------------------------- |
| Screen ID            | SCR-01                                                     |
| Screen Name          | World Map Home                                             |
| Concept              | C: Global Cockpit                                          |
| Epic                 | E07 — Global Resource Visibility                           |
| Feature Areas        | F4 — Global Cockpit                                        |
| Samsung Requirements | Req 7 (Global View), Req 8 (Analysis/Dashboard)            |
| Primary Persona      | Minho Kim (Division Manager, Hwaseong)                     |
| Secondary Personas   | Soyeon Choi (HR, portfolio view), all users (landing page) |

### Purpose

The primary entry point for IRIS. Displays an interactive ECharts world map with Samsung DS site pins showing live resource KPIs. Serves as both the global navigation hub and the executive summary dashboard. Replaces 2-3 days of manual cross-site data compilation with a single interactive view. Division managers land here to get an instant pulse on headcount, utilization, and gaps across all global sites.

### CXO Design Rationale

The world map anchors spatial awareness — semiconductor planners think in terms of sites and geographies. By placing site pins on a real map with summary bubbles, we create an immediate mental model of global resource distribution. The Factor Control sidebar lets managers slice data by BU/department without leaving the home screen. Site cards below the map provide scannable detail for quick comparison. The alert panel surfaces urgent issues (over-utilization, large HC gaps) so managers do not have to hunt for problems.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS -- Home                            [O Search] [! 3] [Minho Kim v] |
+------------------------------------------------------------------------------+
| Nav  | Factor Control   | WORLD MAP (ECharts W04)                            |
| Rail | +-------------+  | +------------------------------------------------+ |
|      | | Site:       |  | |                                                | |
| [#]. | | [All     v] |  | |                                                | |
| [=]  | |             |  | |                Giheung .                        | |
| [~]  | | BU:         |  | |    [Hwaseong] .     . [Pyeongtaek]              | |
| [%]  | | [All     v] |  | |    +---------------+                            | |
| [^]  | |             |  | |    | Hwaseong      |                            | |
| [&]  | | Dept:       |  | |    | HC: 450       |       Xi'an .               | |
| [@]  | | [All     v] |  | |    | Util: 82%     |                            | |
| [*]  | |             |  | |    | Proj: 28      |                            | |
|      | | Period:     |  | |    | Gap: -12 (!)  |                            | |
|      | | [Q2 2026 v] |  | |    +---------------+                            | |
|      | |             |  | |                                                | |
|      | | Status:     |  | |  Austin .                                      | |
|      | | [Active  v] |  | |                                                | |
|      | |             |  | |  Legend: .Green=OK  .Amber=Watch  .Red=Critical | |
|      | | [Apply]     |  | +------------------------------------------------+ |
|      | | [Reset]     |  |                                                    |
|      | +- Alerts ---+  | SITE SUMMARY CARDS (horizontal scroll)              |
|      | | (!) Pyeong- |  | +--------+ +--------+ +--------+ +--------+ +---+ |
|      | |   taek:     |  | |Hwaseong| |Pyeong- | |Austin  | |Xi'an   | |Gi-| |
|      | |   91% util  |  | |        | |taek    | |        | |        | |heu| |
|      | | (!) Hwa-    |  | | HC:450 | |HC: 180 | |HC: 120 | |HC: 200 | |ng | |
|      | |   seong     |  | | 82%    | |91% (!) | |76%     | |88%     | |95 | |
|      | |   Gap:-12   |  | | ====.. | |=====   | |===...  | |====.   | |71%| |
|      | | (i) Austin  |  | | 28 prj | |15 prj  | |10 prj  | |18 prj  | |8  | |
|      | |   slack     |  | | Gap-12 | |Gap:-5  | |Gap:+3  | |Gap:-8  | |+2 | |
|      | +-------------+  | |[Drill>]| |[Drill>]| |[Drill>]| |[Drill>]| |[>]| |
|      |                  | +--------+ +--------+ +--------+ +--------+ +---+ |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component          | Widget                                   | Module   | Data Source                                  | Interactions                                                              |
| ------------------ | ---------------------------------------- | -------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| World Map          | ECharts.js geo (W04 WorldMapWidget)      | M23      | ES: iris-resource-allocation                 | Pan, zoom, click pin to drill down, hover for tooltip                     |
| Site Pins          | ECharts scatter on geo coordinates       | M23      | ES aggregation by site                       | Hover: summary tooltip. Click: navigate to site drill-down                |
| Color Overlay      | ECharts visualMap                        | M23      | Computed utilization %                       | Continuous: Blue (<60%) > Green (60-85%) > Amber (85-95%) > Red (>95%)    |
| Summary Bubbles    | ECharts tooltip + custom HTML            | M23      | ES aggregation                               | Auto-show on hover, persist on click, dismiss on click-away               |
| Site Cards         | Mendix DataView + MD3 card               | M23      | ES: iris-resource-allocation, iris-headcount | Click card to navigate to site drill-down. Horizontal scroll if > 4 cards |
| Utilization Bar    | CSS progress bar within card             | M23      | Computed                                     | Color-coded: green/amber/red based on threshold                           |
| Alert Panel        | Mendix ListView with conditional display | M23, M32 | Computed from ES aggregation                 | Click alert to navigate to the responsible site/department                |
| Factor Control     | Reusable component (M05)                 | M05      | Oracle (M02)                                 | Apply: re-query ES, all visuals re-render                                 |
| Notification Badge | MD3 badge on bell icon                   | M32      | Oracle (M32)                                 | Click: opens notification drawer                                          |

### Interaction Notes

| Trigger                         | Action                      | Result                                                                        |
| ------------------------------- | --------------------------- | ----------------------------------------------------------------------------- |
| Hover over site pin             | Show summary tooltip        | Tooltip displays: HC, Utilization %, Active Projects, HC Gap                  |
| Click site pin                  | Navigate to site drill-down | New page: department treemap, utilization heatmap, trend charts for that site |
| Click site card "Drill"         | Same as click pin           | Navigate to site drill-down page                                              |
| Click alert item                | Navigate to source          | Opens the specific site/department causing the alert                          |
| Scroll/pinch on map             | Zoom in/out                 | Map zoom level changes. Clusters merge/split based on zoom                    |
| Click "Apply" on Factor Control | Re-filter all data          | ES re-query with new parameters. Map pins, cards, alerts all update           |
| Click "Reset"                   | Clear all filters           | Reverts to default: All Sites, All BU, Current Quarter, Active                |
| Double-click map background     | Zoom in                     | Standard ECharts map interaction                                              |
| Keyboard: Ctrl+K                | Quick Switcher              | Opens Quick Switcher modal for keyboard navigation                            |
| Keyboard: Tab                   | Navigate cards              | Focus moves through site cards sequentially                                   |

### Data Requirements

| Entity               | Source       | Fields                                                           | ES Index                 |
| -------------------- | ------------ | ---------------------------------------------------------------- | ------------------------ |
| Site                 | Oracle (M02) | site_name, site_code, latitude, longitude, country, region       | N/A (reference)          |
| Resource Aggregation | ES           | unique_employees (HC), avg allocation_pct (Util), count projects | iris-resource-allocation |
| HeadCount Gap        | ES           | target_count - current_count = gap, aggregated by site           | iris-headcount           |
| Alerts               | Computed     | Derived from utilization > 90% or abs(gap) > threshold           | Computed from above      |
| Notifications        | Oracle (M32) | notification_type, message, read_status, created_date            | N/A                      |

### Responsive Behavior

| Viewport                | Layout Adaptation                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Large monitor (>1440px) | Full 3-zone layout. Map 60% height. Cards in single row. Factor Control expanded (240px)                             |
| Desktop (1280-1440px)   | Same layout, slightly compressed. Factor Control 200px                                                               |
| Laptop (1024-1280px)    | Factor Control collapses to icon toggle (48px). Map takes more width. Cards 3+scroll                                 |
| Tablet (768-1024px)     | No Factor Control sidebar (bottom sheet instead). Map full width. Cards stack 2x3                                    |
| Mobile (<768px)         | No map (too small for meaningful interaction). Site list cards only with key metrics. Factor Control in bottom sheet |

### Empty, Loading, and Error States

| State                      | Display                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loading**                | Map area shows skeleton shimmer. Cards show placeholder rectangles with pulse animation. "Loading global resource data..." text                   |
| **Empty (no data)**        | Map renders with site pins but no data overlay. Cards show "No data for selected filters" with illustration. Suggest resetting filters            |
| **Error (ES unavailable)** | Map renders from cached data with "Last updated: [timestamp]" banner. Orange alert bar: "Live data temporarily unavailable. Showing cached data." |
| **Error (network)**        | Full-screen error state with retry button. "Unable to connect to IRIS. Check your network connection."                                            |
| **No sites match filter**  | Map renders empty. Message: "No sites match the current filter criteria." Reset button prominent                                                  |

### Accessibility Notes

- Map pins have aria-label: "[Site name]: [HC] headcount, [Util]% utilization, [Gap] gap"
- Site cards are focusable via Tab key with visible focus ring (2px Indigo outline)
- Alert panel items are announced by screen reader as they appear
- Color is never the sole indicator — all colored elements have text labels or icons
- Utilization thresholds have both color and text/icon indicators (green checkmark, amber warning, red alert)
- Map supports keyboard navigation: arrow keys to move between pins, Enter to drill down

### Samsung-Specific Data Examples

| Site       | Coordinates     | HC  | Utilization | Active Projects                      | HC Gap |
| ---------- | --------------- | --- | ----------- | ------------------------------------ | ------ |
| Hwaseong   | 37.2 N, 127.0 E | 450 | 82%         | 28 (DDR5-Gen4, HBM4-Dev, NAND-V9...) | -12    |
| Pyeongtaek | 36.9 N, 127.0 E | 180 | 91%         | 15 (NAND-V9, V8-Opt...)              | -5     |
| Austin     | 30.3 N, 97.7 W  | 120 | 76%         | 10 (3nm GAA, Foundry...)             | +3     |
| Xi'an      | 34.3 N, 108.9 E | 200 | 88%         | 18 (NAND-V9, QLC-Adv...)             | -8     |
| Giheung    | 37.2 N, 127.1 E | 95  | 71%         | 8 (Advanced Packaging, R&D...)       | +2     |

---

---

## Screen 2: P/M Planner -- Gantt View

### Metadata

| Field                | Value                                           |
| -------------------- | ----------------------------------------------- |
| Screen ID            | SCR-02                                          |
| Screen Name          | P/M Planner -- Gantt View                       |
| Concept              | A: Collaborative Gantt                          |
| Epic                 | E03 — P/M Planning with Concurrent Edit         |
| Feature Areas        | F1 (Master Data / P/M), F3 (Roadmap / Planning) |
| Samsung Requirements | Req 0 (Standard PM), Req 3 (Concurrent Edit)    |
| Primary Persona      | Jisoo Park (Senior Resource Planner, Hwaseong)  |
| Secondary Persona    | Minho Kim (Planning Manager, approval review)   |

### Purpose

The core daily-use planning screen where Senior Resource Planners create and edit monthly P/M (Personnel/Monthly) allocation plans. The xDHTML Gantt widget displays an allocation grid with employee rows, project columns, and monthly period cells. Supports concurrent multi-user editing with real-time WebSocket presence indicators, auto-merge, and conflict detection. This is the highest-frequency screen in IRIS — used daily by 20+ planners across all Samsung DS sites.

### CXO Design Rationale

The P/M Planner is the heart of IRIS. Design priorities: (1) Maximum information density — planners manage 50-100 employees across 10-30 projects, so every pixel counts. High-density mode (4px cell padding, 12px font) is the default. (2) Real-time presence — colored avatar rings and cell borders make concurrent editing visible without being distracting. (3) Conflict prevention over conflict resolution — the activity feed and presence indicators reduce conflicts by making others' edits visible. (4) Familiar grid metaphor — planners currently use Excel, so the Gantt grid mimics spreadsheet interaction (click-to-edit, Tab to navigate). (5) Version awareness — the version badge and diff button are always visible so planners know exactly what state they are working in.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS > P/M Planner                        [O Search] [!] [Jisoo Park v]|
+------------------------------------------------------------------------------+
| Nav  | P/M Plan: DRAM Development -- Hwaseong -- April 2026                  |
| Rail | Version: V5 (Approved) -> Editing as V6 (Draft)                       |
|      | +--- Plan Header ------------------------------------------------+    |
| [#]  | | EDITORS: [Jisoo .indigo] [Hyunwoo .teal]  2 active editors     |    |
| [=]. | | Status: Draft (unsaved changes)  |  Auto-save: 30s             |    |
| [~]  | | Scope: Hwaseong > Memory > DRAM Dev > All Teams                |    |
| [%]  | +---------------------------------------------------------------+    |
| [^]  |                                                                       |
| [&]  | +--- Toolbar -----+                                                   |
| [@]  | | [Save Draft] [Undo] [Redo] | [Filter v] [View: Month v]          |  |
| [*]  | | [Submit Approval] [View Diff: V5<>V6] [Discard]                  |  |
|      | +--------------------------------------------------------------+     |
|      |                                                                       |
|      | +--- xDHTML Gantt Widget (W01) -- Allocation Grid ----------------+   |
|      | |                                                                  |   |
|      | | Employee        | Project      |Apr W1|Apr W2|Apr W3|Apr W4|Tot |   |
|      | |-----------------|--------------|------|------|------|------|-----|   |
|      | | Kim Taeho [G1]  |              |      |      |      |      |     |   |
|      | |  +- DDR5-Gen4   |============= | 80%  | 80%  | 80%  | 80%  |     |   |
|      | |  +- HBM4-Dev    |====          | 20%  | 20%  | 20%  | 20%  |     |   |
|      | |     TOTAL       |              | 100% | 100% | 100% | 100% |100% |   |
|      | |-----------------|--------------|------|------|------|------|-----|   |
|      | | Park Minji [G2] |              |      |      |      |      |     |   |
|      | |  +- HBM4-Dev    |============= |[60%]*| 60%  | 60%  | 60%  |     |   |
|      | |  +- Exynos2600  |========      | 40%  | 40%  | 40%  | 40%  |     |   |
|      | |   * .teal border = Hyunwoo     | 100% | 100% | 100% | 100% |100% |   |
|      | |     editing this cell                                        |     |   |
|      | |-----------------|--------------|------|------|------|------|-----|   |
|      | | Lee Jihoon [G2] |              |      |      |      |      |     |   |
|      | |  +- Exynos2600  |============= |(!)40%| 50%  | 50%  | 50%  |     |   |
|      | |  +- NAND-V9     |============= | 50%  | 50%  | 50%  | 50%  |     |   |
|      | |   (!) CONFLICT: Both you and   |  90% | 100% | 100% | 100% | 98% |   |
|      | |       Hyunwoo edited this cell                                |     |   |
|      | |-----------------|--------------|------|------|------|------|-----|   |
|      | | Choi Yuna [G1]  |              |      |      |      |      |     |   |
|      | |  +- DDR5-Gen4   |============= | 70%  | 70%  | 70%  | 70%  |     |   |
|      | |  +- ISOCELL-HP3 |========      | 30%  | 30%  | 30%  | 30%  |     |   |
|      | |     TOTAL       |              | 100% | 100% | 100% | 100% |100% |   |
|      | |-----------------|--------------|------|------|------|------|-----|   |
|      | | [+ Add Employee to Plan]                                      |     |   |
|      | +--------------------------------------------------------------+     |
|      |                                                                       |
|      | +--- Activity Feed (collapsible right sidebar, 280px) -----------+   |
|      | | LIVE ACTIVITY                                          [< Hide] |   |
|      | | .teal Hyunwoo changed Park Minji / HBM4 Apr W1:                |   |
|      | |       50% -> 60%                           30 sec ago          |   |
|      | | .indigo Jisoo changed Kim Taeho / DDR5 Apr W1:                  |   |
|      | |         70% -> 80%                         2 min ago            |   |
|      | | .teal Hyunwoo joined this plan              5 min ago            |   |
|      | +---------------------------------------------------------------+   |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component           | Widget                                      | Module   | Data Source                         | Interactions                                                                                                 |
| ------------------- | ------------------------------------------- | -------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Allocation Grid     | xDHTML Gantt (W01) with monthly scale       | M10      | Oracle: PMEntry, Employee, Project  | Click cell to edit %. Tab to next cell. Drag Gantt bar edge to extend/shorten allocation                     |
| Presence Indicators | Custom WebSocket overlay on Gantt           | M10, M03 | In-memory via WebSocket             | Colored border (2px) on cells being edited by others. Editor name tooltip on hover                           |
| Conflict Marker     | Custom overlay (amber highlight + (!) icon) | M10, M03 | Conflict detection engine           | Amber cell background + warning icon when same cell edited by 2+ users. Click opens Screen 3                 |
| Activity Feed       | Mendix ListView with WebSocket updates      | M10      | WebSocket event stream              | Chronological edits. New edits slide in at top with fade animation. Click entry to scroll Gantt to that cell |
| Version Badge       | MD3 chip in plan header                     | M03      | Oracle: PMPlanVersion               | Shows V5 (Approved) -> V6 (Draft). Click to view version history                                             |
| Total Row           | Computed row in Gantt widget                | M10      | Computed sum of project allocations | Auto-updates. Turns error-red if >100%. Amber if >95%                                                        |
| Toolbar             | MD3 top app bar (secondary)                 | M10      | N/A                                 | Save, Undo, Redo, Filter, View options, Submit Approval, View Diff, Discard                                  |
| Add Employee        | MD3 text button + search dialog             | M10, M02 | Oracle: Employee                    | Opens search dialog. Filter by name/ID/team/skill. Add selected to plan                                      |
| Editor Avatars      | MD3 avatar chips with colored ring          | M10      | WebSocket session                   | Shows all active editors. Ring color = presence color. Tooltip: "Editing [cell]"                             |

### Interaction Notes

| Trigger                   | Action                  | Result                                                                                      |
| ------------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| Click cell                | Enter edit mode         | Cell becomes editable input. Type new %. Press Enter or Tab to confirm                      |
| Tab key                   | Move to next cell       | Focus moves right (next period), then down (next project/employee)                          |
| Shift+Tab                 | Move to previous cell   | Focus moves left                                                                            |
| Enter key                 | Confirm edit, move down | Saves cell value, moves focus to same column next row                                       |
| Escape key                | Cancel edit             | Reverts cell to previous value                                                              |
| Ctrl+Z                    | Undo                    | Reverts last edit. Up to 50 undo levels per session                                         |
| Ctrl+Y                    | Redo                    | Re-applies last undone edit                                                                 |
| Ctrl+S                    | Save Draft              | Triggers auto-merge and save. Shows conflict dialog if conflicts detected                   |
| Drag Gantt bar edge       | Extend/shorten project  | Changes the date range of an allocation. Cells update accordingly                           |
| Hover on presence border  | Show editor info        | Tooltip: "Hyunwoo is editing this cell (changed 30 sec ago)"                                |
| Click conflict icon (!)   | Open conflict modal     | Navigates to Screen 3: Conflict Resolution Panel                                            |
| Click "View Diff: V5<>V6" | Open diff viewer        | Opens W03 DiffViewer modal showing all changes between V5 (approved) and V6 (current draft) |
| Click "Submit Approval"   | Start approval          | Creates approval request. Email to Manager via M32. Version status -> PendingApproval       |
| Click activity feed entry | Scroll to cell          | Gantt scrolls to show the cell referenced in the activity feed entry                        |

### Data Requirements

| Entity                | Source                | Fields                                                                                     | Module        |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------------ | ------------- |
| PMPlan                | Oracle                | pm_plan_id, site, dept, fiscal_month, status, lock_owner                                   | M10           |
| PMPlanVersion         | Oracle                | version_number, version_type (Draft/Permanent), created_by, approved_by, created_date      | M03           |
| PMEntry               | Oracle                | employee_id, project_id, period, planned_days, planned_hours, actual_hours, allocation_pct | M10           |
| Employee              | Oracle                | employee_id, name, team, skill_category, job_grade, site                                   | M02           |
| Project               | Oracle                | project_id, project_name, project_code, project_type, status                               | M02           |
| Concurrent Edit State | In-memory / WebSocket | active_editors[], cell_locks[], pending_changes[], last_heartbeat                          | M10 (runtime) |

### Responsive Behavior

| Viewport                | Layout Adaptation                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Large monitor (>1440px) | Full Gantt grid + Activity Feed sidebar (280px). All weekly columns visible for 1 month. High-density mode default |
| Desktop (1280-1440px)   | Gantt grid full width. Activity Feed in collapsible sidebar. Horizontal scroll for weeks                           |
| Laptop (1024-1280px)    | Activity Feed hidden by default (toggle button). Gantt uses horizontal scroll                                      |
| Tablet (768-1024px)     | Gantt grid takes full width. Activity Feed moves to bottom drawer. 2-week visible window                           |
| Mobile (<768px)         | Not supported for editing (Gantt requires desktop resolution). Read-only summary view with employee cards          |

### Empty, Loading, and Error States

| State                      | Display                                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loading**                | Gantt skeleton: grid lines with shimmer animation. "Loading P/M Plan..." with spinner                                                                       |
| **Empty plan**             | Empty Gantt grid with prominent "+ Add Employee to Plan" button centered. Helper text: "This plan has no allocations yet. Add employees to begin planning." |
| **No plan exists**         | "No P/M plan exists for [Site] [Department] [Period]. [Create New Plan] button"                                                                             |
| **WebSocket disconnected** | Amber banner: "Real-time sync disconnected. Your edits are saved locally. Reconnecting..." Auto-retry every 5 seconds                                       |
| **Conflict on save**       | Opens Screen 3: Conflict Resolution Panel as modal overlay                                                                                                  |
| **Error saving**           | Snackbar (bottom): "Failed to save changes. [Retry] [Save Offline]"                                                                                         |

### Accessibility Notes

- Gantt grid cells are navigable via Tab/Shift+Tab/Arrow keys
- Screen reader announces: "[Employee name], [Project name], [Period]: [allocation]%"
- Presence indicators have aria-live="polite" announcements: "[Editor name] started editing [cell]"
- Conflict markers announced as alerts: "Conflict detected on [employee] [project] [period]"
- Color-coded totals (red for >100%) also have text indicator: "Over-allocated" or warning icon
- High contrast mode available via Settings for planners with low vision

### Samsung-Specific Data Examples

Example P/M Plan for Hwaseong, DRAM Development, April 2026:

| Employee   | Grade | Team         | Project     | Apr W1 | Apr W2 | Apr W3 | Apr W4 |
| ---------- | ----- | ------------ | ----------- | ------ | ------ | ------ | ------ |
| Kim Taeho  | G1    | DRAM Design  | DDR5-Gen4   | 80%    | 80%    | 80%    | 80%    |
| Kim Taeho  | G1    | DRAM Design  | HBM4-Dev    | 20%    | 20%    | 20%    | 20%    |
| Park Minji | G2    | DRAM Process | HBM4-Dev    | 60%    | 60%    | 60%    | 60%    |
| Park Minji | G2    | DRAM Process | Exynos 2600 | 40%    | 40%    | 40%    | 40%    |
| Lee Jihoon | G2    | DRAM Test    | Exynos 2600 | 40%    | 50%    | 50%    | 50%    |
| Lee Jihoon | G2    | DRAM Test    | NAND-V9     | 50%    | 50%    | 50%    | 50%    |
| Choi Yuna  | G1    | DRAM Design  | DDR5-Gen4   | 70%    | 70%    | 70%    | 70%    |
| Choi Yuna  | G1    | DRAM Design  | ISOCELL-HP3 | 30%    | 30%    | 30%    | 30%    |

---

---

## Screen 3: Conflict Resolution Panel

### Metadata

| Field                | Value                                                                    |
| -------------------- | ------------------------------------------------------------------------ |
| Screen ID            | SCR-03                                                                   |
| Screen Name          | Conflict Resolution Panel                                                |
| Concept              | A: Collaborative Gantt                                                   |
| Epic                 | E03 — P/M Planning with Concurrent Edit                                  |
| Feature Areas        | F1 (Master Data / P/M)                                                   |
| Samsung Requirements | Req 3 (Concurrent Edit)                                                  |
| Primary Persona      | Jisoo Park (Planner, resolving a conflict with colleague Hyunwoo)        |
| Secondary Persona    | Hyunwoo Choi (Planner, the other editor whose changes are already saved) |

### Purpose

A modal dialog that appears when two planners edit the same cell in the P/M Planner and the second planner attempts to save. Provides a clear, calm side-by-side visual diff of the conflicting values and three resolution options: Accept Theirs, Keep Mine, or Enter Custom Value. This is a critical UX moment — the system must guide the planner through conflict resolution without punishing them or creating anxiety.

### CXO Design Rationale

Conflict resolution is the highest-stress moment in concurrent editing. Design principles: (1) Calm, not alarming — the amber color and "Conflict Detected" header convey importance without panic. No red backgrounds. (2) Context-rich — the planner sees exactly who changed what, when, and the original value before both edits. (3) Visual comparison — the allocation bars (40% vs 60%) make the difference visceral at a glance. (4) Neutral language — "Accept Hyunwoo's" instead of "Discard your changes." The framing matters for trust. (5) Sequential resolution — if multiple cells conflict, show them one at a time to reduce cognitive load. (6) No "Cancel" — the planner initiated a save and must resolve all conflicts to complete it. "Skip" defaults to the other user's value (safest).

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  (Background: P/M Planner dimmed to 40% opacity)                            |
|                                                                              |
|  +--- Conflict Resolution Modal (680px width, dp6 elevation) -----------+   |
|  |                                                                       |   |
|  |  +--- Header (amber-50 background) --------------------------------+ |   |
|  |  | (!) Conflict Detected                                            | |   |
|  |  |                                                                  | |   |
|  |  | Another planner has modified the same cell since you             | |   |
|  |  | started editing. Please choose how to resolve.                  | |   |
|  |  +------------------------------------------------------------------+ |   |
|  |                                                                       |   |
|  |  +--- Conflict Context --------------------------------------------+ |   |
|  |  | Employee:   Lee Jihoon (G2, DRAM Test, Hwaseong)                 | |   |
|  |  | Project:    Exynos 2600                                          | |   |
|  |  | Period:     April 2026, Week 1                                   | |   |
|  |  | Field:      Allocation Percentage                                | |   |
|  |  +------------------------------------------------------------------+ |   |
|  |                                                                       |   |
|  |  +--- Side-by-Side Comparison -------------------------------------+ |   |
|  |  |                                                                  | |   |
|  |  |  +--- Hyunwoo's Version -----+  +--- Your Version -----------+ | |   |
|  |  |  | .teal border              |  | .indigo border             | | |   |
|  |  |  | Saved 45 seconds ago      |  | Unsaved (your edit)        | | |   |
|  |  |  |                           |  |                            | | |   |
|  |  |  | Previous value: 50%       |  | Previous value: 50%        | | |   |
|  |  |  | Changed to: 40%  (-10%)   |  | Changed to: 60%  (+10%)   | | |   |
|  |  |  |                           |  |                            | | |   |
|  |  |  | ========....  40%         |  | ============  60%          | | |   |
|  |  |  |                           |  |                            | | |   |
|  |  |  +---------------------------+  +----------------------------+ | |   |
|  |  |                                                                  | |   |
|  |  |  Original value (before both edits): 50%                        | |   |
|  |  +------------------------------------------------------------------+ |   |
|  |                                                                       |   |
|  |  +--- Resolution Options ------------------------------------------+ |   |
|  |  |                                                                  | |   |
|  |  |  [Accept Hyunwoo's (40%)]     <-- Keep the saved value          | |   |
|  |  |      MD3 Outlined Button, teal accent                           | |   |
|  |  |                                                                  | |   |
|  |  |  [Keep Mine (60%)]            <-- Overwrite with your value     | |   |
|  |  |      MD3 Filled Button, indigo (recommended)                    | |   |
|  |  |                                                                  | |   |
|  |  |  [Enter Custom Value: [___]%]  <-- Type a compromise value      | |   |
|  |  |      MD3 Outlined Button + inline input                         | |   |
|  |  |                                                                  | |   |
|  |  |  Note: This affects only this cell. Other non-conflicting       | |   |
|  |  |  changes have been auto-merged successfully.                    | |   |
|  |  +------------------------------------------------------------------+ |   |
|  |                                                                       |   |
|  |  Conflicts remaining: 1 of 1                     [Skip] [Resolve]    |   |
|  +-----------------------------------------------------------------------+   |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component          | Widget                                           | Module   | Data Source                        | Interactions                                                                                                                  |
| ------------------ | ------------------------------------------------ | -------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Modal Overlay      | Mendix Modal Dialog (MD3 styling)                | M10, M03 | N/A                                | Centered, dimmed background (40% opacity). Cannot dismiss by clicking outside (forced resolution)                             |
| Header             | MD3 container with amber-50 background           | M10      | N/A                                | Static context. Warning icon (Material Symbols)                                                                               |
| Context Block      | Mendix DataView                                  | M10      | Oracle: Employee, Project, PMEntry | Displays employee name, grade, team, site, project, period, field name                                                        |
| Comparison Cards   | Custom Mendix layout                             | M10, M03 | Conflict detection engine          | Two cards side by side. Left = other user's saved value (.teal border). Right = current user's unsaved value (.indigo border) |
| Allocation Bar     | CSS progress bar                                 | M10      | Computed                           | Visual percentage for quick comparison. Proportional width                                                                    |
| Resolution Buttons | MD3 Buttons (Filled primary, Outlined secondary) | M10      | N/A                                | Click to resolve. Custom value validates 0-100% range                                                                         |
| Custom Value Input | MD3 text input with validation                   | M10      | User input                         | Accepts integer 0-100. Validates on blur. Error state for invalid input                                                       |
| Conflict Counter   | MD3 badge                                        | M10      | Conflict detection engine          | "1 of 3 conflicts" — sequential resolution if multiple conflicts exist                                                        |
| Skip Button        | MD3 Text Button                                  | M10      | N/A                                | Skips conflict, defaults to other user's value. Shows "Skipped" badge                                                         |

### Interaction Notes

| Trigger                             | Action                     | Result                                                                                            |
| ----------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------- |
| Click "Accept Hyunwoo's (40%)"      | Accept saved value         | Cell set to 40%. Conflict resolved. Next conflict (if any) or save completes                      |
| Click "Keep Mine (60%)"             | Override with own value    | Cell set to 60%. Override recorded in audit log. Next conflict or save completes                  |
| Type custom value + click "Resolve" | Set custom value           | Cell set to entered %. Validates 0-100 range. Merge recorded. Next conflict                       |
| Click "Skip"                        | Default to saved value     | Same as "Accept Hyunwoo's" but marked as "Skipped — auto-accepted" in audit                       |
| Press Escape                        | No action                  | Modal does not close (forced resolution). Tooltip: "Please resolve this conflict to save"         |
| All conflicts resolved              | Save completes             | Modal closes. Gantt updates with resolved values. Snackbar: "Plan saved. [N] conflicts resolved." |
| Enter key                           | Confirm highlighted action | Submits the currently focused resolution option                                                   |

### Data Requirements

| Entity           | Source                                | Fields                                                                                                           | Module        |
| ---------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------- |
| Conflict Record  | In-memory (conflict detection engine) | employee_id, project_id, period, original_value, other_user_value, my_value, other_user_id, other_user_timestamp | M03           |
| Employee Context | Oracle                                | employee_name, job_grade, team, site                                                                             | M02           |
| Project Context  | Oracle                                | project_name, project_code                                                                                       | M02           |
| Other Editor     | WebSocket session                     | editor_name, edit_timestamp, session_id                                                                          | M10 (runtime) |

### Responsive Behavior

| Viewport             | Layout Adaptation                                                     |
| -------------------- | --------------------------------------------------------------------- |
| Desktop (>1280px)    | Modal 680px wide, centered. Comparison cards side by side             |
| Laptop (1024-1280px) | Modal 600px wide. Same layout                                         |
| Tablet (768-1024px)  | Modal full-width minus 48px margin. Comparison cards stack vertically |
| Mobile (<768px)      | N/A — P/M Planner editing not supported on mobile                     |

### Empty, Loading, and Error States

| State                         | Display                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Single conflict**           | Counter shows "1 of 1". "Skip" button available but not prominent                                      |
| **Multiple conflicts**        | Counter shows "1 of N". Progress indicator. "Skip All Remaining" button appears after first resolution |
| **Custom value invalid**      | Input field error state: red border, helper text "Enter a value between 0 and 100"                     |
| **Other editor disconnected** | Additional context: "Note: Hyunwoo is no longer editing this plan"                                     |

### Accessibility Notes

- Modal traps focus. Tab cycles through resolution options only
- Screen reader announces: "Conflict detected. [Employee], [Project], [Period]. Hyunwoo changed to 40%. Your value is 60%. Choose a resolution."
- Resolution buttons have aria-label describing the full action
- Escape key does not close modal (by design) — tooltip explains why
- High contrast: comparison card borders are 3px (not 2px) for visibility

### Samsung-Specific Data Examples

Conflict scenario: Jisoo and Hyunwoo both editing Hwaseong DRAM Development April 2026 plan.

| Field            | Value                                          |
| ---------------- | ---------------------------------------------- |
| Employee         | Lee Jihoon (G2, DRAM Test, Hwaseong)           |
| Project          | Exynos 2600                                    |
| Period           | April 2026, Week 1                             |
| Original value   | 50%                                            |
| Hyunwoo's change | 40% (reason: re-allocating to NAND-V9 ramp)    |
| Jisoo's change   | 60% (reason: Exynos 2600 tape-out approaching) |

---

---

## Screen 4: Master Data Management

### Metadata

| Field                | Value                                                |
| -------------------- | ---------------------------------------------------- |
| Screen ID            | SCR-04                                               |
| Screen Name          | Master Data Management                               |
| Concept              | Foundation                                           |
| Epic                 | E01 — Master Data & Org Hierarchy                    |
| Feature Areas        | F1 (Master Data / P/M)                               |
| Samsung Requirements | Req 0 (Standard PM), Req 5 (N-PLM Sync)              |
| Primary Persona      | Site Admin (manages org hierarchy and sync)          |
| Secondary Persona    | Jisoo Park (Planner, manages standard PM structures) |

### Purpose

Manage the organizational hierarchy, standard PM structures, skills taxonomy, and production type configurations that underpin all IRIS planning. Supports CRUD operations with revision history, N-PLM/SMDM/GHRP sync status monitoring, and merge strategy for manual vs. synced data. This is the "foundation settings" screen that admins and planners maintain to keep reference data accurate.

### CXO Design Rationale

Master data is unglamorous but critical — bad reference data corrupts every plan in the system. Design principles: (1) Tab-based organization — three distinct data domains (Org Structure, Standard PM, Sync Status) separated cleanly. (2) Tree-based hierarchy — the org structure uses a collapsible tree that matches how Samsung DSR thinks about their organization (Line > Site > Team > Group). (3) Revision history sidebar — every change is tracked with who/when/what, supporting audit and rollback. (4) Sync status visibility — N-PLM, SMDM, and GHRP sync timestamps and status are prominently displayed so admins can identify stale data immediately. (5) Merge conflict handling — when N-PLM auto-sync conflicts with manual overrides, the UI clearly shows both values and lets the admin choose.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS > Master Data Management             [O Search] [!] [Admin v]     |
+------------------------------------------------------------------------------+
| Nav  |  [Org Structure]  [Standard PM .]  [Skills]  [Sync Status]           |
| Rail |                                                                       |
|      | +--- Tab: Org Structure (tree view) ---------------------------------+|
| [#]  | |                                                                    ||
| [=]  | | +--- Org Tree (left, 320px) -----+  +--- Detail Panel (right) ---+||
| [~]  | | | [-] Samsung DS                 |  | Site: Hwaseong             |||
| [%]  | | |   [-] Hwaseong                 |  |                            |||
| [^]  | | |     [-] Memory                 |  | Code:     HWS              |||
| [&]  | | |       [+] DRAM Development     |  | Country:  South Korea      |||
| [@]  | | |         [+] DRAM Design        |  | Region:   APAC             |||
| [*]. | | |         [+] DRAM Process       |  | Timezone: KST (UTC+9)      |||
|      | | |         [+] DRAM Test          |  | BUs:      Memory, Sys LSI  |||
|      | | |       [+] NAND Development     |  | HC Cap:   500              |||
|      | | |       [+] System LSI           |  | Status:   Active           |||
|      | | |     [-] Foundry                |  |                            |||
|      | | |       [+] Process Engineering  |  | Source: N-PLM (auto-sync)  |||
|      | | |   [-] Pyeongtaek               |  | Last sync: 2026-03-21 02:00|||
|      | | |     [+] Memory (NAND focus)    |  | Manual overrides: 2       |||
|      | | |   [-] Austin                   |  |                            |||
|      | | |     [+] Foundry                |  | [Edit] [View History]      |||
|      | | |   [-] Xi'an                    |  | [View Merge Conflicts (2)] |||
|      | | |     [+] Memory (NAND)          |  +----------------------------+||
|      | | |   [-] Giheung                  |                                 ||
|      | | |     [+] R&D                    |                                 ||
|      | | +--------------------------------+                                 ||
|      | |                                                                    ||
|      | | +--- Revision History (bottom panel) ------------------------------+||
|      | | | Rev | Author    | Date       | Summary                    |Src |||
|      | | |-----|-----------|------------|----------------------------|-----|||
|      | | | R15 | N-PLM     | 2026-03-21 | Auto-sync: updated 3 depts | Sys |||
|      | | | R14 | Admin     | 2026-03-18 | Added Giheung R&D subteam  | Man |||
|      | | | R13 | N-PLM     | 2026-03-14 | Auto-sync: renamed 1 team  | Sys |||
|      | | | [Compare R15 vs R14]  [Restore R14]                        |     ||
|      | | +--------------------------------------------------------------+   ||
|      | +--------------------------------------------------------------------+|
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component             | Widget                               | Module   | Data Source                               | Interactions                                                                   |
| --------------------- | ------------------------------------ | -------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| Tab Bar               | Mendix Tab Container (MD3)           | M02      | N/A                                       | Switch between Org Structure, Standard PM, Skills, Sync Status                 |
| Org Tree              | Mendix TreeView with expand/collapse | M02      | Oracle: Site, BU, Department, Team, Group | Click node to select. Expand/collapse children. Drag to rearrange (admin only) |
| Detail Panel          | Mendix DataView                      | M02      | Oracle: selected entity                   | Shows attributes of selected tree node. Edit button enables inline editing     |
| Standard PM Grid      | Mendix DataGrid (editable)           | M02      | Oracle: StandardPM                        | Hierarchical: Stage > Block > Function > Activity. Inline edit PM values       |
| Skills Tree           | Mendix TreeView                      | M02      | Oracle: SkillCategory, Skill              | Manage skill taxonomy. Add/edit/delete skills                                  |
| Revision History      | Mendix ListView (bottom panel)       | M03      | Oracle: Revision                          | Chronological list. Source badge (N-PLM / Manual). Select two to compare       |
| Diff Compare          | DiffViewer Widget (W03) in modal     | M03      | Oracle: two revision snapshots            | Side-by-side color-coded comparison                                            |
| Sync Status Tab       | Mendix DataGrid                      | M31      | Oracle: SyncRecord                        | Shows N-PLM, SMDM, GHRP sync timestamps, status, error counts                  |
| Data Source Badge     | MD3 chip                             | M02, M31 | Oracle                                    | "N-PLM" or "Manual" badge on each entity indicating data provenance            |
| Merge Conflict Dialog | Mendix Modal                         | M02, M31 | Oracle                                    | N-PLM synced value vs manual override. Choose which to keep                    |

### Interaction Notes

| Trigger                            | Action               | Result                                                                                  |
| ---------------------------------- | -------------------- | --------------------------------------------------------------------------------------- |
| Click tree node                    | Select entity        | Detail Panel loads with entity attributes. Revision History filters to that entity      |
| Expand/collapse tree node          | Toggle children      | Child nodes show/hide with animation                                                    |
| Click "Edit" in detail panel       | Enable editing       | Fields become editable. Save/Cancel buttons appear                                      |
| Save edit                          | Create new revision  | Revision R+1 created with change summary. Source: "Manual"                              |
| Click "Compare R15 vs R14"         | Open diff viewer     | W03 DiffViewer modal shows side-by-side comparison with green/red/amber markers         |
| Click "View Merge Conflicts"       | Open merge dialog    | Modal shows N-PLM value vs manual override for each conflicting field. Choose per field |
| Click "Sync Now" (Sync Status tab) | Force immediate sync | Progress indicator. Results displayed on completion (items added/updated/conflicted)    |
| Click "Restore R14"                | Rollback             | Confirmation dialog. Creates new revision R16 with R14's data. Audit logged             |
| Drag tree node (admin)             | Rearrange hierarchy  | Visual drag indicator. Drop on target parent. Confirmation dialog                       |

### Data Requirements

| Entity        | Source | Fields                                                                                    | Module |
| ------------- | ------ | ----------------------------------------------------------------------------------------- | ------ |
| Site          | Oracle | site_id, site_name, site_code, country, region, timezone, latitude, longitude             | M02    |
| BusinessUnit  | Oracle | bu_id, bu_name, bu_code, site_id                                                          | M02    |
| Department    | Oracle | dept_id, dept_name, dept_code, bu_id, manager_id                                          | M02    |
| Team          | Oracle | team_id, team_name, dept_id                                                               | M02    |
| StandardPM    | Oracle | type_name, stage, block, function, activity, shift, pm_value                              | M02    |
| SkillCategory | Oracle | category_id, category_name, parent_id                                                     | M02    |
| Revision      | Oracle | revision_number, entity_type, entity_id, created_by, created_date, change_summary, source | M03    |
| SyncRecord    | Oracle | sync_id, target_system, last_sync_date, status, changed_items_count, error_message        | M31    |

### Responsive Behavior

| Viewport             | Layout Adaptation                                                       |
| -------------------- | ----------------------------------------------------------------------- |
| Desktop (>1280px)    | Tree (320px) + Detail Panel side by side. Revision History bottom panel |
| Laptop (1024-1280px) | Tree (260px) + Detail Panel. Revision History collapsible               |
| Tablet (768-1024px)  | Tree and Detail stack vertically. Revision History accordion            |
| Mobile (<768px)      | Read-only tree view. Detail in separate page. Editing requires desktop  |

### Empty, Loading, and Error States

| State                       | Display                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------- |
| **Loading**                 | Tree skeleton with shimmer. "Loading master data..."                                    |
| **Empty tree**              | "No organizational structure defined. [Import from N-PLM] or [Create Root Node]"        |
| **Sync failed**             | Red badge on Sync Status tab. Error details in sync log. "Last successful sync: [date]" |
| **Merge conflicts pending** | Amber badge on affected tab: "2 merge conflicts pending resolution"                     |

### Accessibility Notes

- Tree navigation via Arrow keys (Up/Down to move, Left/Right to collapse/expand)
- Detail panel fields have associated labels
- Revision history rows are keyboard-navigable
- Screen reader announces tree level depth: "Level 3: DRAM Development, expanded, 3 children"

### Samsung-Specific Data Examples

| Level         | Example Entries                                         |
| ------------- | ------------------------------------------------------- |
| Line          | Samsung DS (Device Solutions)                           |
| Site          | Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung            |
| Business Unit | Memory (DRAM, NAND), System LSI, Foundry                |
| Department    | DRAM Development, NAND Development, Process Engineering |
| Team          | DRAM Design, DRAM Process, DRAM Test                    |
| Group         | DDR5 Team, HBM Team, Verification Team                  |

---

---

## Screen 5: Resource Roadmap + Version Panel

### Metadata

| Field                | Value                                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| Screen ID            | SCR-05                                                                        |
| Screen Name          | Resource Roadmap + Version Panel                                              |
| Concept              | D: Diff & Delta Engine                                                        |
| Epic                 | E04 — Resource Roadmap with Versioning                                        |
| Feature Areas        | F3 (Roadmap / Planning)                                                       |
| Samsung Requirements | Req 1 (Roadmap Planning), Req 2 (Approval Workflow), Req 4 (Simulation Entry) |
| Primary Persona      | Jisoo Park (Planner, creates and edits roadmap versions)                      |
| Secondary Persona    | Minho Kim (Manager, reviews diffs and approves versions)                      |

### Purpose

Long-term resource roadmap management with Gantt visualization, version history sidebar, integrated diff viewer, and approval workflow. Planners create project allocation roadmaps spanning a fiscal year, submit for approval, and trigger delta sync to PROMIS on approval. The version panel on the right is the primary UI for Concept D (Smart Diff & Delta Engine) — every change is versioned, every version is diffable, every approved version syncs only changed records to PROMIS.

### CXO Design Rationale

The roadmap is where strategic resource decisions become concrete plans. Design principles: (1) Gantt as the primary view — project timelines are inherently visual, and the Gantt bar chart makes duration, overlap, and resource intensity immediately visible. (2) Version panel always visible — unlike version history buried in a menu, the sidebar timeline of V1 through V6 gives planners a constant sense of the plan's evolution. Approval status badges (checkmark, clock, cross) are scannable. (3) Diff-first workflow — the "View Full Diff" link is more prominent than the "Edit" button. This signals that reviewing changes is as important as making them. (4) PROMIS sync visibility — each version shows whether it has been synced to PROMIS, closing the loop on downstream data flow. (5) "Create Simulation" button — one click to clone the roadmap into a sandbox, creating a seamless bridge to Screen 6.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS > Resource Roadmap                   [O Search] [!] [Jisoo Park v]|
+------------------------------------------------------------------------------+
| Nav  | Roadmap: Hwaseong -- Memory BU -- FY2026                              |
| Rail | Version: V6 (Approved)  |  [New Version] [Create Simulation]          |
|      | Factor: [Hwaseong | Memory | All Depts | FY2026 | Active]             |
| [#]  |                                                                       |
| [=]  | +--- Gantt Roadmap (W01, 70% width) ---+  +--- Version Panel (30%)-+ |
| [~]. | |                                      |  |                         | |
| [%]  | | Project       |Q1 26|Q2 26|Q3 26|   |  | VERSIONS                | |
| [^]  | |               |Q4 26|Q1 27|     |   |  |                         | |
| [&]  | |---------------|-----|-----|-----|   |  | . V6 Approved           | |
| [@]  | | DDR5-Gen4     |===================|   |  |   Jisoo | 2026-03-15   | |
| [*]  | |  18 eng       |                    |   |  |   [v] PROMIS Synced    | |
|      | |  Util: 78%    |                    |   |  |   [View] [Diff v]      | |
|      | |  [DRAM Design] |                    |   |  |                         | |
|      | |---------------|-----|-----|-----|   |  | o V5 Archived           | |
|      | | HBM4-Dev      |     |=============|   |  |   Jisoo | 2026-03-01   | |
|      | |  15 eng       |                    |   |  |   [v] PROMIS Synced    | |
|      | |  Util: 85%    |                    |   |  |   [View] [Diff v]      | |
|      | |  [DRAM Process]|                    |   |  |                         | |
|      | |---------------|-----|-----|-----|   |  | o V4 Archived           | |
|      | | NAND-V9       |=================== |   |  |   Hyunwoo | 2026-02-15 | |
|      | |  25 eng       |                    |   |  |   [v] PROMIS Synced    | |
|      | |  Util: 85%    |                    |   |  |   [View] [Diff v]      | |
|      | |  [NAND Dev]   |                    |   |  |                         | |
|      | |---------------|-----|-----|-----|   |  | o V3 Archived           | |
|      | | Exynos 2600   |===================|   |  | o V2 Archived           | |
|      | |  12 eng       |                    |   |  | o V1 Initial            | |
|      | |  Util: 81%    |                    |   |  |                         | |
|      | |  [System LSI] |                    |   |  | --- Diff Summary ---    | |
|      | |---------------|-----|-----|-----|   |  | Compare: [V6 vs V5 v]   | |
|      | | ISOCELL-HP3   |   ========        |   |  |                         | |
|      | |  8 eng        |                    |   |  | 3 projects changed     | |
|      | |  Util: 65%    |                    |   |  | 1 added (#4CAF50)      | |
|      | |  [System LSI] |                    |   |  | 2 modified (#FF9800)   | |
|      | |               |                    |   |  | 12 records changed     | |
|      | | Legend:                             |   |  | [View Full Diff]       | |
|      | | === = Project timeline              |   |  |                         | |
|      | | Darker shade = higher utilization   |   |  | --- Sync Status ---    | |
|      | +--------------------------------------+  | PROMIS: [v] In Sync    | |
|      |                                           | N-PLM:  [v] In Sync    | |
|      | +--- Actions Bar ------------------------+ | Last: 2026-03-15 14:22 | |
|      | | [Save Draft] [Submit Approval]         | | [Sync Dashboard]       | |
|      | | [View Diff]  [Export Excel]             | +-------------------------+ |
|      | +------------------------------------------+                           |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component                | Widget                                              | Module   | Data Source                               | Interactions                                                                                      |
| ------------------------ | --------------------------------------------------- | -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Gantt Roadmap            | xDHTML Gantt (W01) with quarterly scale             | M11      | Oracle: RoadmapProjectAllocation, Project | Horizontal bars = project timelines. Color intensity = utilization. Click bar for detail popup    |
| Version Panel            | Mendix Sidebar (persistent, 30% width, collapsible) | M03      | Oracle: RoadmapVersion                    | Chronological version list. Each version shows: author, date, approval status, PROMIS sync status |
| Version Status Badge     | MD3 chip                                            | M03      | Oracle: RoadmapVersion                    | Filled green (Approved), Outlined amber (Draft), Outlined blue (PendingApproval)                  |
| Diff Summary             | Inline computed in version panel                    | M03      | Computed from two version snapshots       | Quick stats: "3 projects changed, 12 records modified." Color-coded counts                        |
| Full Diff Viewer         | DiffViewer Widget (W03) in modal                    | M03      | Oracle: two version snapshots             | Side-by-side comparison. Added (#4CAF50), Removed (#F44336), Modified (#FF9800)                   |
| Sync Dashboard           | Mendix modal                                        | M30, M31 | Oracle: SyncRecord                        | PROMIS delta preview: changed projects, payload size, confirm/cancel                              |
| Project Detail Popup     | Mendix popover on Gantt bar click                   | M11      | Oracle: RoadmapProjectAllocation          | Shows assigned engineers, allocation %, timeline, department, status                              |
| Create Simulation Button | MD3 Outlined Button                                 | M12      | N/A                                       | Clones current roadmap version into new Simulation. Navigates to Screen 6                         |
| Factor Control           | Reusable (M05) inline                               | M05      | Oracle (M02)                              | Inline bar. Changes trigger Gantt re-render                                                       |

### Interaction Notes

| Trigger                            | Action                    | Result                                                                                        |
| ---------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------- |
| Click Gantt project bar            | Show project detail popup | Popover with engineers, allocation breakdown, timeline, department                            |
| Click "New Version"                | Clone current as draft    | Creates V7 (Draft) from V6 (Approved). Gantt becomes editable                                 |
| Edit in Gantt (draft mode)         | Modify allocations        | Drag bar edges, edit cells. Changes tracked for diff                                          |
| Click "Save Draft"                 | Save                      | Auto-generates change summary. Draft version saved                                            |
| Click "Submit Approval"            | Start approval workflow   | Diff generated (V7 draft vs V6 approved). Email to Manager via M32. Status -> PendingApproval |
| Click "View Full Diff"             | Open diff viewer          | W03 modal with full side-by-side comparison. Green/Red/Amber rows                             |
| Click "Create Simulation"          | Clone to sandbox          | Creates new simulation from current version. Navigates to Screen 6                            |
| Click "Sync Dashboard"             | Preview PROMIS delta      | Modal showing which projects changed since last PROMIS sync. Confirm to trigger sync          |
| Select two versions + compare      | Multi-version diff        | Version panel allows selecting any two versions for comparison                                |
| Click "Diff v" dropdown on version | Compare options           | "V6 vs V5", "V6 vs V4", "V6 vs V1" — quick access to any comparison                           |

### Data Requirements

| Entity                   | Source | Fields                                                                                                                           | Module |
| ------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| ResourceRoadmap          | Oracle | roadmap_id, roadmap_name, site, bu, fiscal_year, status                                                                          | M11    |
| RoadmapVersion           | Oracle | version_id, version_number, version_type (Draft/Permanent), created_by, approved_by, change_summary, promis_synced, created_date | M03    |
| RoadmapProjectAllocation | Oracle | project_id, employee_id, period, allocated_pct, allocated_hours, role_in_project                                                 | M11    |
| Project                  | Oracle | project_name, project_code, project_type, technology_node, priority, status, department                                          | M02    |
| SyncRecord               | Oracle | target_system (PROMIS), sync_status, changed_projects_json, sync_date                                                            | M30    |
| VersionSnapshot          | Oracle | Full serialized state of all allocations at version creation time                                                                | M03    |

### Responsive Behavior

| Viewport                | Layout Adaptation                                                                |
| ----------------------- | -------------------------------------------------------------------------------- |
| Large monitor (>1440px) | Gantt (70%) + Version Panel (30%). All quarters visible. Full detail             |
| Desktop (1280-1440px)   | Same split. Gantt may scroll horizontally for later quarters                     |
| Laptop (1024-1280px)    | Version Panel collapses to 48px icon toggle. Gantt full width                    |
| Tablet (768-1024px)     | Version Panel as bottom drawer. Gantt full width. Horizontal scroll for quarters |
| Mobile (<768px)         | Read-only Gantt summary. Version list as separate page. No editing               |

### Empty, Loading, and Error States

| State                  | Display                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **Loading**            | Gantt skeleton with horizontal bar placeholders. Version panel shimmer             |
| **No roadmap**         | "No roadmap exists for [Site] [BU] [Fiscal Year]. [Create New Roadmap]"            |
| **Empty roadmap**      | Gantt grid with no bars. "+ Add Project to Roadmap" button centered                |
| **PROMIS sync failed** | Red badge on Sync Dashboard. Version shows "(!) Sync Failed" with retry button     |
| **Approval pending**   | Amber banner: "Version V7 is pending approval by Minho Kim. Submitted 2026-03-20." |

### Accessibility Notes

- Gantt bars have aria-label: "[Project name]: [Start date] to [End date], [N] engineers, [Util]%"
- Version panel items navigable via Arrow keys
- Diff viewer has keyboard navigation between changed rows
- Approval status announced by screen reader

### Samsung-Specific Data Examples

| Project     | Type     | Engineers | Utilization | Timeline          | Department       |
| ----------- | -------- | --------- | ----------- | ----------------- | ---------------- |
| DDR5-Gen4   | R&D Core | 18        | 78%         | Q1 2026 - Q4 2026 | DRAM Development |
| HBM4-Dev    | R&D New  | 15        | 85%         | Q2 2026 - Q2 2027 | DRAM Development |
| NAND-V9     | R&D Core | 25        | 85%         | Q1 2026 - Q3 2026 | NAND Development |
| Exynos 2600 | R&D Core | 12        | 81%         | Q1 2026 - Q1 2027 | System LSI       |
| ISOCELL-HP3 | R&D New  | 8         | 65%         | Q2 2026 - Q4 2026 | System LSI       |

---

---

## Screen 6: Simulation Sandbox

### Metadata

| Field                | Value                                                                   |
| -------------------- | ----------------------------------------------------------------------- |
| Screen ID            | SCR-06                                                                  |
| Screen Name          | Simulation Sandbox                                                      |
| Concept              | B: Simulation Sandbox                                                   |
| Epic                 | E05 — What-If Simulation                                                |
| Feature Areas        | F3 (Roadmap / Planning)                                                 |
| Samsung Requirements | Req 1 (Roadmap Planning), Req 4 (Simulation)                            |
| Primary Persona      | Jisoo Park (Planner, creates and evaluates simulations)                 |
| Secondary Persona    | Minho Kim (Manager, reviews simulation results for strategic decisions) |

### Purpose

An isolated sandbox environment where planners clone approved roadmap versions and explore "what-if" resource allocation scenarios without affecting live data. Supports a clone wizard to set up simulations, multiple variants per simulation, side-by-side comparison dashboards, and promotion back to roadmap. Implements Concept B (Simulation Sandbox) — the key innovation that lets planners experiment safely.

### CXO Design Rationale

Simulation is the feature that separates IRIS from spreadsheet-based planning. Design principles: (1) Visual sandbox boundary — the teal/amber banner at the top is unmissable, preventing planners from confusing simulation data with production data. (2) Clone wizard — a 3-step wizard (Select Source > Name & Describe > Configure) makes simulation creation guided rather than error-prone. (3) Split view for comparison — planners can see the baseline roadmap (left) and their simulation (right) simultaneously. This is the "aha moment" that sells the simulation concept. (4) ECharts delta summary — the impact table at the bottom auto-computes and displays headcount shifts, utilization changes, and timeline deltas as colored directional arrows. Managers can evaluate scenarios without reading every cell. (5) Promote button — the path from "interesting simulation" to "official roadmap draft" is a single click, reducing friction.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS > Simulation Sandbox                 [O Search] [!] [Jisoo Park v]|
+------------------------------------------------------------------------------+
| Nav  | +--- SIMULATION MODE (teal-50 banner) ----------------------------+  |
| Rail | | (%) Simulation: HBM4 Acceleration -- 5 Engineers from NAND-V9   |  |
|      | | Source: Roadmap V6 (Hwaseong, Memory BU, FY2026)                 |  |
| [#]  | | Variant: [S1-V2 v]  |  S1-V1 (baseline)  |  S1-V3 (8 eng)     |  |
| [=]  | | [New Variant]  [Compare All]  [Promote to Roadmap]  [Discard]    |  |
| [~]  | +----------------------------------------------------------------+  |
| [%]. |                                                                       |
| [^]  | +--- Split View (toggle) ----------------------------------------+  |
| [&]  | |                                                                 |  |
| [@]  | | BASELINE (Roadmap V6)          | SIMULATION (S1-V2)            |  |
| [*]  | | (read-only, gray overlay)      | (editable, full color)        |  |
|      | |                                |                                |  |
|      | | Project    |Jul|Aug|Sep|Oct|  | Project    |Jul|Aug|Sep|Oct|  |  |
|      | |------------|---|---|---|---|  |------------|---|---|---|---|  |  |
|      | | HBM4-Dev   |           |  | HBM4-Dev   |                |  |  |
|      | |  10 eng    |==========|  |  15 eng    |================|  |  |
|      | |  Util: 78% |           |  |  Util: 82% |  (+5 eng)      |  |  |
|      | |------------|---|---|---|  |------------|---|---|---|---|  |  |
|      | | NAND-V9    |           |  | NAND-V9    |                |  |  |
|      | |  25 eng    |==========|  |  20 eng    |========= (!)   |  |  |
|      | |  Util: 85% |           |  |  Util: 92% |  (-5 eng)      |  |  |
|      | |------------|---|---|---|  |------------|---|---|---|---|  |  |
|      | | DDR5-Gen4  |           |  | DDR5-Gen4  |                |  |  |
|      | |  18 eng    |==========|  |  18 eng    |================|  |  |
|      | |  (no change)|          |  |  (no change)|                |  |  |
|      | +-----------------------------+--------------------------------+  |
|      |                                                                       |
|      | +--- ECharts Delta Summary (W02) ---------------------------------+  |
|      | |                                                                  |  |
|      | | Metric          | Roadmap V6 | S1-V2 (this) | Delta             |  |
|      | |-----------------|------------|--------------|-------------------|  |
|      | | HBM4 Headcount  | 10         | 15           | +5 [^] green      |  |
|      | | NAND-V9 HC      | 25         | 20           | -5 [v] amber      |  |
|      | | NAND-V9 Util    | 85%        | 92% (!)      | +7% [^] red       |  |
|      | | HBM4 Timeline   | Q1 2027    | Q4 2026      | -3 months [v] grn |  |
|      | | Total HC Impact | 0          | 0            | Net zero          |  |
|      | |                                                                  |  |
|      | | [========= HC Shift Bar Chart (ECharts) =========]               |  |
|      | | HBM4:  >>>>>>>>>>>>>>>>  +5                                     |  |
|      | | NAND:  <<<<<<<<<<<<<<<<  -5                                     |  |
|      | | DDR5:  ================   0                                     |  |
|      | +------------------------------------------------------------------+  |
|      |                                                                       |
|      | [Save S1-V2] [New Variant] [Compare All] [Promote to Roadmap]         |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component           | Widget                                      | Module   | Data Source                             | Interactions                                                                          |
| ------------------- | ------------------------------------------- | -------- | --------------------------------------- | ------------------------------------------------------------------------------------- |
| Simulation Banner   | Mendix container (teal-50 background)       | M12      | Oracle: ResourceSimulation              | Persistent reminder of sandbox mode. Shows source, variant selector, actions          |
| Variant Selector    | MD3 segmented button / dropdown             | M12      | Oracle: SimulationVersion               | Switch between simulation variants. Each loads its data into the Gantt                |
| Split View Toggle   | MD3 toggle button                           | M12      | N/A                                     | Toggle between: Split View (baseline + simulation), Full View (simulation only)       |
| Baseline Gantt      | xDHTML Gantt (W01, read-only, gray overlay) | M11      | Oracle: source roadmap version snapshot | Non-editable. Visual reference for comparison                                         |
| Simulation Gantt    | xDHTML Gantt (W01, editable, full color)    | M12      | Oracle: SimulationAllocation            | Full editing: drag, resize, edit cells. Changes auto-saved per variant                |
| Delta Summary Table | Mendix DataGrid                             | M12      | Computed: simulation vs roadmap         | Auto-computed on any edit. Columns: Metric, Baseline, Simulation, Delta               |
| HC Shift Bar Chart  | ECharts.js (W02) horizontal bar             | M12      | Computed                                | Visual delta: positive bars right (green), negative bars left (amber/red)             |
| Risk Indicators     | MD3 conditional styling                     | M12      | Computed                                | Amber when utilization 85-95%, Red when >95%. Applied to Gantt bars and delta table   |
| Promote Button      | MD3 Filled Button (primary, prominent)      | M12, M11 | N/A                                     | Creates new Roadmap Draft from simulation. Confirmation dialog. Navigates to Screen 5 |
| Compare All         | MD3 Outlined Button                         | M12      | All simulation variants                 | Opens comparison dashboard: ECharts bar charts of all variants vs baseline            |
| Clone Wizard        | Mendix multi-step dialog (3 steps)          | M12      | Oracle: roadmap versions                | Step 1: Select source. Step 2: Name/describe. Step 3: Configure initial parameters    |

### Interaction Notes

| Trigger                        | Action                    | Result                                                                                                      |
| ------------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Click "New Variant"            | Clone current variant     | Creates S1-V3 from S1-V2. Opens for modification                                                            |
| Edit cell in simulation Gantt  | Modify allocation         | Value changes. Delta Summary recalculates in real-time                                                      |
| Drag engineer between projects | Reassign resource         | Employee removed from source project, added to target. Both bars update                                     |
| Click "Compare All"            | Open comparison dashboard | Modal/page with ECharts: HC by project (V6 vs S1-V1 vs S1-V2 vs S1-V3). Utilization comparison. Delta table |
| Click "Promote to Roadmap"     | Create roadmap draft      | Confirmation: "Create Roadmap V7 (Draft) from S1-V2?" On confirm, navigates to Screen 5 with new draft      |
| Click "Discard"                | Delete simulation         | Confirmation: "Delete simulation 'HBM4 Acceleration' and all variants?" Permanent action                    |
| Toggle split view              | Switch layout             | Split View: side-by-side baseline + simulation. Full View: simulation only with delta table                 |
| Click risk indicator (!)       | Show risk detail          | Tooltip: "NAND-V9 utilization at 92%. Threshold exceeded. [View affected employees]"                        |
| Click variant tab              | Switch variant            | Gantt and delta summary reload with selected variant's data                                                 |

### Data Requirements

| Entity                  | Source   | Fields                                                                                      | Module        |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------- | ------------- |
| ResourceSimulation      | Oracle   | simulation_id, simulation_name, source_roadmap_version_id, status, created_by, created_date | M12           |
| SimulationVersion       | Oracle   | version_id, version_number, variant_name, parameters_json, created_date                     | M12           |
| SimulationAllocation    | Oracle   | project_id, employee_id, period, allocated_pct, delta_vs_roadmap                            | M12           |
| Source Roadmap Baseline | Oracle   | Full snapshot of source roadmap version (for delta computation)                             | M11, M03      |
| Impact Metrics          | Computed | HC delta, utilization delta, timeline impact per project                                    | M12 (runtime) |

### Responsive Behavior

| Viewport                | Layout Adaptation                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Large monitor (>1440px) | Full split view: baseline (50%) + simulation (50%). Delta summary below. Best experience      |
| Desktop (1280-1440px)   | Split view with smaller Gantt columns. Horizontal scroll for later periods                    |
| Laptop (1024-1280px)    | Split view replaced by tabbed view (Baseline / Simulation tabs). Delta summary always visible |
| Tablet (768-1024px)     | Simulation Gantt only (no split). Delta summary in collapsible bottom panel                   |
| Mobile (<768px)         | Read-only delta summary only. No Gantt editing. "Open on desktop to edit simulation"          |

### Empty, Loading, and Error States

| State                       | Display                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------- |
| **Loading**                 | Split view skeleton with dual Gantt placeholders. "Loading simulation..."               |
| **No simulations**          | "No simulations exist for this roadmap. [Create New Simulation] wizard"                 |
| **Empty simulation**        | Clone wizard auto-populates from source roadmap. Never truly empty                      |
| **Risk threshold exceeded** | Amber/red banner at top of delta summary: "1 project exceeds 90% utilization threshold" |
| **Variant limit reached**   | "Maximum 10 variants per simulation. Delete unused variants to create new ones."        |

### Accessibility Notes

- Simulation banner has role="alert" with aria-label "You are in simulation mode"
- Split view panels labeled: "Baseline roadmap (read-only)" and "Simulation (editable)"
- Delta arrows have text equivalents: "+5" not just an upward arrow icon
- Risk indicators announced by screen reader: "Warning: NAND-V9 utilization at 92%"

### Samsung-Specific Data Examples

Simulation: "HBM4 Acceleration" — Move 5 engineers from NAND-V9 to HBM4-Dev starting September 2026.

| Metric                 | Roadmap V6 | Simulation S1-V2                                         | Delta               |
| ---------------------- | ---------- | -------------------------------------------------------- | ------------------- |
| HBM4-Dev Headcount     | 10         | 15                                                       | +5                  |
| NAND-V9 Headcount      | 25         | 20                                                       | -5                  |
| NAND-V9 Utilization    | 85%        | 92%                                                      | +7% (risk)          |
| HBM4 Target Completion | Q1 2027    | Q4 2026                                                  | -3 months (benefit) |
| Affected Employees     | -          | Kim Taeho, Park Minji, Seo Jiwon, Yoon Daeun, Han Seojun | 5 reassigned        |

---

---

## Screen 7: HeadCount Portfolio

### Metadata

| Field                | Value                                                 |
| -------------------- | ----------------------------------------------------- |
| Screen ID            | SCR-07                                                |
| Screen Name          | HeadCount Portfolio                                   |
| Concept              | C: Global Cockpit                                     |
| Epic                 | E06 — HeadCount Portfolio Planning                    |
| Feature Areas        | F4 (Global Cockpit / HC)                              |
| Samsung Requirements | Req 9 (HC Portfolio)                                  |
| Primary Persona      | Soyeon Choi (HR Portfolio Manager, Hwaseong)          |
| Secondary Persona    | Minho Kim (Manager, reviews staffing recommendations) |

### Purpose

Manage staffing plans with current vs. target headcount analysis, gap identification, and action assignment (Hire, Transfer, Retain, Reduce). Combines a high-density staffing grid with analytical ECharts visualizations (stacked bar, gap pie, trend line). HR planners use this screen quarterly to align workforce capacity with project demand.

### CXO Design Rationale

HR planners think in terms of organizational slots, not individual projects. The staffing grid is organized by Department x Job Grade — the natural mental model for workforce planning. Design principles: (1) Gap as the hero metric — the Gap column is visually prominent with red (deficit) and green (surplus) coloring. This is the single most important number on the screen. (2) Action dropdown — directly in the grid, not behind a modal. Quick assignment of Hire/Transfer/Retain/Reduce per gap entry reduces clicks. (3) Dual-panel layout — grid (left) for data entry, charts (right) for analysis. The charts update in real-time as planners modify targets and actions, creating an immediate feedback loop. (4) Trend line — the 8-quarter historical view provides context for whether gaps are structural or seasonal. (5) Comfortable density — unlike the P/M Planner (high-density for power planners), the HC Portfolio uses comfortable density (12px padding) because HR planners interact with it quarterly, not daily.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS > HeadCount Portfolio                 [O Search] [!] [Soyeon Choi v]|
+------------------------------------------------------------------------------+
| Nav  | Portfolio: Hwaseong -- All Departments -- Q2 2026                     |
| Rail | Factor: [Hwaseong | All BU | Q2 2026 | Active]                        |
|      |                                                                       |
| [#]  | +--- Staffing Grid (60% width) --+  +--- Analytics Panel (40%) ---+  |
| [=]  | |                                |  |                              |  |
| [~]  | | Dept / Grade   |Curr|Tgt|Gap|Act|  | Current vs Target by Dept   |  |
| [%]  | |                |    |   |   |   |  | (Stacked Bar, ECharts W02)  |  |
| [^]  | |----------------|----+---+---+---|  |                              |  |
| [&]. | | DRAM Dev        |    |   |   |   |  | DRAM ============ 120       |  |
| [@]  | |  G1 (Senior)   | 28 | 32| -4|Hir|  |      ............. 135 ^15 |  |
| [*]  | |  G2 (Mid)      | 52 | 55| -3|Hir|  | NAND ========== 95         |  |
|      | |  G3 (Junior)   | 40 | 38| +2|Rtn|  |      ........... 100  ^5  |  |
|      | |  Subtotal      |120 |125| -5|   |  | Test ========== 72          |  |
|      | |----------------|----+---+---+---|  |      ........... 72   --0  |  |
|      | | NAND Dev        |    |   |   |   |  | Proc ======== 55            |  |
|      | |  G1 (Senior)   | 22 | 25| -3|Hir|  |      ........... 60   ^5  |  |
|      | |  G2 (Mid)      | 43 | 45| -2|Xfr|  |                              |  |
|      | |  G3 (Junior)   | 30 | 30|  0|Rtn|  | ==== Current  .... Target   |  |
|      | |  Subtotal      | 95 |100| -5|   |  +------------------------------+  |
|      | |----------------|----+---+---+---|                                    |
|      | | Test Eng        |    |   |   |   |  +--- Gap by Action (Pie) -----+  |
|      | |  G1 (Senior)   | 18 | 18|  0|Rtn|  |                              |  |
|      | |  G2 (Mid)      | 32 | 32|  0|Rtn|  |  Hire:     15 (60%)  ====   |  |
|      | |  G3 (Junior)   | 22 | 22|  0|Rtn|  |  Transfer:  5 (20%)  ==     |  |
|      | |  Subtotal      | 72 | 72|  0|   |  |  Retain:    5 (20%)  ==     |  |
|      | |----------------|----+---+---+---|  |  Reduce:    0 ( 0%)         |  |
|      | | Process Eng     |    |   |   |   |  +------------------------------+  |
|      | |  G1 (Senior)   | 12 | 14| -2|Hir|                                    |
|      | |  G2 (Mid)      | 25 | 26| -1|Xfr|  +--- HC Trend (8 qtrs) ------+  |
|      | |  G3 (Junior)   | 18 | 20| -2|Hir|  |  450|         ___---o Target |  |
|      | |  Subtotal      | 55 | 60| -5|   |  |  420|      __-  .Actual      |  |
|      | |----------------|----+---+---+---|  |  390|   __-                   |  |
|      | | TOTAL           |342 |357|-15|   |  |  360|__-                     |  |
|      | |                 |    |   |   |   |  |     |Q3 Q4 Q1 Q2 Q3 Q4 Q1 Q2|  |
|      | +--- Actions ----+----+---+---+---|  |     |24 24 25 25 25 25 26 26|  |
|      | | [Edit Targets] [Set Actions]    |  +------------------------------+  |
|      | | [Submit Approval] [Export XLSX] |                                    |
|      | | [Print Report]                 |                                    |
|      | +--------------------------------+                                    |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component         | Widget                             | Module | Data Source                        | Interactions                                                                                           |
| ----------------- | ---------------------------------- | ------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Staffing Grid     | Mendix DataGrid (editable columns) | M13    | Oracle: HeadCountEntry, Department | Rows: Dept > Grade. Columns: Current (read-only), Target (editable), Gap (computed), Action (dropdown) |
| Stacked Bar Chart | ECharts.js (W02)                   | M13    | ES: iris-headcount                 | Current vs Target by department. Click bar to filter grid to that department                           |
| Gap Pie Chart     | ECharts.js (W02)                   | M13    | Computed from actions              | Distribution by action type. Click slice to filter grid                                                |
| HC Trend Line     | ECharts.js (W02)                   | M13    | ES: iris-headcount (historical)    | 8-quarter trend: actual vs planned trajectory. Dual Y-axis                                             |
| Factor Control    | Reusable (M05) inline              | M05    | Oracle (M02)                       | Filter by site, BU, period, department                                                                 |
| Target Edit Mode  | MD3 toggle                         | M13    | Oracle: HeadCountEntry             | Click "Edit Targets" to enable target column editing. Gap auto-recalculates                            |
| Action Dropdown   | MD3 dropdown per row               | M13    | Enum                               | Hire, Transfer, Retain, Reduce. Color-coded. Updates pie chart in real-time                            |
| Subtotal Rows     | Computed                           | M13    | Sum of grade rows per department   | Auto-updates. Bold styling. Gap subtotal shows department-level deficit                                |
| Grand Total Row   | Computed                           | M13    | Sum of all departments             | Bottom of grid. Bold. Shows site-wide HC picture                                                       |

### Interaction Notes

| Trigger                                   | Action                    | Result                                                                                               |
| ----------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------- |
| Click "Edit Targets"                      | Enable target editing     | Target cells become editable inputs. Gap column recalculates on each change. Charts update real-time |
| Select action from dropdown               | Assign action per gap row | Pie chart updates. Action saved immediately                                                          |
| Click department bar in stacked bar chart | Filter grid               | Grid shows only that department's grade rows. Breadcrumb: "Filtered: DRAM Dev"                       |
| Click pie slice                           | Filter grid               | Grid shows only rows with that action type. Breadcrumb: "Filtered: Hire"                             |
| Click "Submit for Approval"               | Start approval            | Sends staffing plan to Manager. Email via M32. Status -> PendingApproval                             |
| Click "Export XLSX"                       | Download Excel            | Formatted Excel with grid data + embedded chart images                                               |
| Click "Print Report"                      | Generate PDF              | PDF with grid, charts, and metadata header                                                           |
| Hover on trend line point                 | Show detail               | Tooltip: "Q2 2025: Actual 410, Target 425, Gap -15"                                                  |
| Double-click grid cell (edit mode)        | Edit target               | Direct cell editing. Enter to confirm, Escape to cancel                                              |

### Data Requirements

| Entity         | Source | Fields                                                                                              | Module         |
| -------------- | ------ | --------------------------------------------------------------------------------------------------- | -------------- |
| HeadCountPlan  | Oracle | plan_id, site, bu, fiscal_year, quarter, status, created_by                                         | M13            |
| HeadCountEntry | Oracle | dept_id, job_grade, skill_category, period, current_count, planned_count, target_count, gap, action | M13            |
| Department     | Oracle | dept_name, dept_code, bu_id, site_id                                                                | M02            |
| Historical HC  | ES     | Quarterly aggregations of headcount by site/dept/grade over 8 quarters                              | iris-headcount |

### Responsive Behavior

| Viewport                | Layout Adaptation                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Large monitor (>1440px) | Grid (60%) + Analytics (40%) side by side. All charts visible simultaneously           |
| Desktop (1280-1440px)   | Same layout. Charts may stack within analytics panel                                   |
| Laptop (1024-1280px)    | Grid full width. Analytics in collapsible bottom panel or tab                          |
| Tablet (768-1024px)     | Grid and analytics stack vertically. Grid horizontal scroll for columns                |
| Mobile (<768px)         | Summary cards per department (Current/Target/Gap). No grid editing. Charts in carousel |

### Empty, Loading, and Error States

| State             | Display                                                                                        |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| **Loading**       | Grid skeleton. Chart placeholder with spinner. "Loading headcount data..."                     |
| **No plan**       | "No HC plan for [Site] [Quarter]. [Create from Template] or [Import from GHRP]"                |
| **Empty plan**    | Grid with department rows but all zeros. "Set targets to begin planning."                      |
| **All gaps zero** | Pie chart shows 100% Retain. Trend line flat. Message: "Staffing on target. No gaps detected." |
| **Export error**  | Snackbar: "Export failed. [Retry]"                                                             |

### Accessibility Notes

- Grid cells navigable via Tab/Arrow keys
- Gap values announced with context: "DRAM Development, G1 Senior: Current 28, Target 32, Gap minus 4, Action Hire"
- Charts have descriptive alt text generated from data
- Color coding supplemented by text labels ("+5" vs just green coloring)
- Comfortable density (12px padding) improves touch target size

### Samsung-Specific Data Examples

Staffing plan for Hwaseong, All Departments, Q2 2026:

| Department  | Grade     | Current | Target | Gap | Action   |
| ----------- | --------- | ------- | ------ | --- | -------- |
| DRAM Dev    | G1 Senior | 28      | 32     | -4  | Hire     |
| DRAM Dev    | G2 Mid    | 52      | 55     | -3  | Hire     |
| DRAM Dev    | G3 Junior | 40      | 38     | +2  | Retain   |
| NAND Dev    | G1 Senior | 22      | 25     | -3  | Hire     |
| NAND Dev    | G2 Mid    | 43      | 45     | -2  | Transfer |
| NAND Dev    | G3 Junior | 30      | 30     | 0   | Retain   |
| Test Eng    | All       | 72      | 72     | 0   | Retain   |
| Process Eng | G1 Senior | 12      | 14     | -2  | Hire     |
| Process Eng | G2 Mid    | 25      | 26     | -1  | Transfer |
| Process Eng | G3 Junior | 18      | 20     | -2  | Hire     |

---

---

## Screen 8: Analysis Dashboard

### Metadata

| Field                | Value                                              |
| -------------------- | -------------------------------------------------- |
| Screen ID            | SCR-08                                             |
| Screen Name          | Analysis Dashboard                                 |
| Concept              | E: AI Analysis Builder                             |
| Epic                 | E08 — Multi-Dimensional Analysis                   |
| Feature Areas        | F5 (Analysis Engine), F6 (Reporting)               |
| Samsung Requirements | Req 8 (Analysis/Dashboard), Req 10 (Personal View) |
| Primary Persona      | Eunji Lee (Analytics Specialist, Hwaseong)         |
| Secondary Persona    | Minho Kim (Manager, uses pre-built reports)        |

### Purpose

Self-service analytics workbench where users interactively build multi-dimensional reports by selecting dimensions and measures from a drag-and-drop palette. Powered by Elasticsearch aggregations (M20) and rendered by ECharts.js (W02). Supports 8+ chart types, drill-down via click, saved report configurations, and a template library. Replaces manual Excel pivot table construction. Implements the core interactive analysis capability of Concept E (AI-Powered Analysis Builder).

### CXO Design Rationale

The Analysis Dashboard is designed for two audiences: (1) Power analysts like Eunji who build custom reports by dragging dimensions and measures, and (2) Managers like Minho who consume pre-built templates. Design principles: (1) Drag-and-drop palette — dimensions and measures are draggable chips on the left sidebar. Drag a dimension to "Rows" or "Columns" slot; drag a measure to "Values" or "Color" slot. This is intuitive for anyone who has used Excel pivot tables. (2) Chart type flexibility — the same underlying ES aggregation renders in 8+ chart types. Switch from heatmap to treemap to bar chart with one click. (3) Drill-down as primary interaction — clicking any chart element (bar, cell, slice) drills into the next hierarchy level. Breadcrumbs track the drill path. This enables exploratory analysis. (4) Factor Control integration — the inline filter bar applies to all visualizations, maintaining context. (5) "AI Report" button — the bridge to Screen 9, pre-loaded with the current configuration.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS > Analysis Dashboard                 [O Search] [!] [Eunji Lee v] |
+------------------------------------------------------------------------------+
| Nav  | Dim/Measure     | Chart Canvas (ECharts W02)          | Config Panel  |
| Rail | Palette (220px) |                                      | (200px)       |
|      | +-------------+ | +----------------------------------+ | +-----------+ |
| [#]  | | DIMENSIONS  | | | Chart: Heatmap                    | | | Chart     | |
| [=]  | |             | | | Dept x Project -- Headcount       | | | Type:     | |
| [~]  | | o Site      | | | Hwaseong, Memory BU, Q2 2026      | | | [Heatmap v]| |
| [%]  | | . Dept  >R  | | |                                    | | |           | |
| [^]. | | o BU        | | | Proj:| DDR5 | HBM4 |NAND |Exynos| | | Colors:   | |
| [&]  | | . Proj  >C  | | | -----|------|------|-----|------| | | [Auto v]  | |
| [@]  | | o Time      | | | DRAM | #### | ##   | #   | ##   | | |           | |
| [*]  | | o Skill     | | | NAND | #    | ##   | ####| #    | | | Sort:     | |
|      | | o Grade     | | | Test | ##   | #    | ##  | #    | | | [Desc v]  | |
|      | |             | | | Proc | #    | ###  | #   | ##   | | |           | |
|      | | MEASURES    | | |                                    | | | Legend:   | |
|      | |             | | | Color: Low .. Med %% High ##       | | | [Show v]  | |
|      | | . HC   >clr | | |                                    | | |           | |
|      | | . Alloc%    | | | Click any cell to drill down       | | | Drill:    | |
|      | |   >tooltip  | | +----------------------------------+ | | [Enabled v]| |
|      | | o Gap       | | |                                    | | |           | |
|      | | o Hours     | | | Breadcrumb: [Hwaseong] > [Memory]  | | +-----------+ |
|      | | o Util%     | | |                                    | |              |
|      | +-------------+ | +--- Factor Control (inline bar) --+ | +-----------+ |
|      |                 | | Site:[Hwa v] BU:[Mem v] Q:[Q2 v] | | | ACTIONS   | |
|      | +-------------+ | +----------------------------------+ | |           | |
|      | | TEMPLATES   | |                                      | | [Export    | |
|      | |             | | +--- Data Table (below chart) -----+ | |  Excel]   | |
|      | | o Actual    | | | Dept     | DDR5| HBM4| NAND|Exyn| | | [Export    | |
|      | |   vs Plan   | | |----------|-----|-----|-----|----| | |  PDF]     | |
|      | |             | | | DRAM Dev | 18  | 10  | 3   | 8  | | | [AI       | |
|      | | o Resource  | | | NAND Dev | 3   | 8   | 18  | 2  | | |  Report]  | |
|      | |   Utiliz.   | | | Test Eng | 6   | 4   | 8   | 3  | | | [Schedule]| |
|      | |             | | | Proc Eng | 2   | 12  | 5   | 7  | | | [Save     | |
|      | | o Cross-    | | +----------------------------------+ | |  Config]  | |
|      | |   Site      | |                                      | |           | |
|      | |             | |                                      | +-----------+ |
|      | | o HC Gap    | |                                      |              |
|      | +-------------+ |                                      |              |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component           | Widget                                 | Module   | Data Source                   | Interactions                                                                                                      |
| ------------------- | -------------------------------------- | -------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Dimension Palette   | Mendix sidebar with draggable chips    | M20      | Configuration                 | Drag dimension to Row (R) or Column (C) assignment slot                                                           |
| Measure Palette     | Mendix sidebar with draggable chips    | M20      | Configuration                 | Drag measure to Color, Size, Tooltip, or Values assignment slot                                                   |
| Chart Canvas        | ECharts.js (W02)                       | M20, M21 | ES: iris-resource-allocation  | Renders selected chart type. Auto-resizes. Supports: bar, stacked bar, line, pie, heatmap, treemap, radar, sankey |
| Chart Type Selector | MD3 dropdown in config panel           | M21      | N/A                           | Switch chart type. Same data re-renders. Smooth transition animation                                              |
| Drill-Down          | ECharts click event -> Mendix nanoflow | M20      | ES re-query at next hierarchy | Click element to drill. Breadcrumb updated. "Back" to un-drill                                                    |
| Data Table          | Mendix DataGrid below chart            | M21      | Same ES query as chart        | Tabular view of same data. Sortable columns. Complements visual                                                   |
| Template Library    | Sidebar accordion                      | M21      | Oracle: SavedReportConfig     | Pre-built configurations. Click to load dims/measures/chart/filters                                               |
| Factor Control      | Inline bar below chart                 | M05      | Oracle (M02)                  | Changes trigger ES re-query. All visualizations update                                                            |
| Export Excel        | MD3 button                             | M21      | ES query result               | Downloads data table + chart image as formatted .xlsx                                                             |
| Export PDF          | MD3 button                             | M21      | ES query result               | Generates formatted PDF with chart + data + metadata header                                                       |
| AI Report           | MD3 button (links to Screen 9)         | M22      | Current config                | Navigates to Screen 9 with dims/measures/filters pre-loaded                                                       |
| Schedule            | MD3 button                             | M32      | Oracle: NotificationSchedule  | Opens scheduling dialog: frequency, recipients, delivery method                                                   |
| Save Config         | MD3 button                             | M21      | Oracle: SavedReportConfig     | Saves current dims/measures/chart/filters as named configuration                                                  |
| Breadcrumb          | Mendix text                            | M20      | Drill-down path               | Shows drill path. Click any level to navigate back                                                                |

### Interaction Notes

| Trigger                              | Action                 | Result                                                                        |
| ------------------------------------ | ---------------------- | ----------------------------------------------------------------------------- |
| Drag dimension to Row slot           | Assign dimension       | ES query rebuilds. Chart re-renders with new row dimension. ~1-2s latency     |
| Drag measure to Color slot           | Assign color mapping   | Chart cells/bars colored by measure value. Legend updates                     |
| Click chart element (cell/bar/slice) | Drill down             | ES re-query at next hierarchy level. Breadcrumb extended. Chart re-renders    |
| Click breadcrumb level               | Navigate up            | Returns to that drill level. Restores previous chart state                    |
| Switch chart type                    | Re-render              | Same data, new chart type. Smooth CSS transition                              |
| Click template                       | Load configuration     | Dimensions, measures, chart type, filters all set to template values          |
| Click "AI Report"                    | Navigate to Screen 9   | Current config (dims, measures, filters) passed to AI Report Builder          |
| Click "Schedule"                     | Open scheduling dialog | Set frequency (daily/weekly/monthly), recipients (email), format (.xlsx/.pdf) |
| Click "Save Config"                  | Save current state     | Name input. Saves to template library for future recall                       |
| Resize browser                       | Responsive chart       | ECharts auto-resizes. Labels adjust for available space                       |
| Keyboard: Ctrl+D                     | Toggle data table      | Show/hide the data table below the chart                                      |

### Data Requirements

| Entity               | Source | Fields                                                                                                   | Module                   |
| -------------------- | ------ | -------------------------------------------------------------------------------------------------------- | ------------------------ |
| Resource Aggregation | ES     | All dimensions (site, dept, BU, project, time, skill, grade) and measures (HC, allocation %, hours, gap) | iris-resource-allocation |
| HeadCount Data       | ES     | current_count, planned_count, target_count, gap, action                                                  | iris-headcount           |
| Simulation Results   | ES     | Simulation allocation data for scenario comparison reports                                               | iris-simulation          |
| Report Config        | Oracle | config_name, dimensions_json, measures_json, chart_type, filters_json, created_by                        | M21                      |
| Schedule             | Oracle | schedule_frequency, recipients, format, last_run, next_run                                               | M32                      |

### Responsive Behavior

| Viewport                | Layout Adaptation                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Large monitor (>1440px) | Full 3-column: Palette (220px) + Chart (flex) + Config (200px). Maximum data visibility   |
| Desktop (1280-1440px)   | Same layout, slightly compressed                                                          |
| Laptop (1024-1280px)    | Palette and Config collapse to icon toggles (48px each). Chart takes full width           |
| Tablet (768-1024px)     | Palette as bottom sheet. Config as settings icon. Chart full width                        |
| Mobile (<768px)         | Chart view only. Use saved templates (no palette). Simplified chart types (bar, pie only) |

### Empty, Loading, and Error States

| State                      | Display                                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Loading**                | Chart area: centered spinner with "Running analysis..." Progress indicator if >3 seconds                                          |
| **No data**                | Chart area shows illustration + "No data matches the current dimensions and filters. Try adjusting your Factor Control settings." |
| **No dimensions selected** | "Drag dimensions and measures from the palette to build your analysis" with illustrated guide                                     |
| **ES query timeout**       | "Analysis timed out. Try reducing the date range or number of dimensions." [Retry] button                                         |
| **Template empty**         | Template library shows "No saved configurations. Build an analysis and click 'Save Config' to create your first template."        |
| **Export error**           | Snackbar: "Export failed. [Retry]"                                                                                                |

### Accessibility Notes

- Drag-and-drop has keyboard alternative: select chip, press Enter, choose slot from dropdown
- Chart provides data table alternative (always available below chart)
- Heatmap cells have aria-label: "[Row value], [Column value]: [Measure value]"
- Screen reader announces drill-down navigation: "Drilling into [element]. Now showing [new level]"
- Color legend includes text labels for all values

### Samsung-Specific Data Examples

Example analysis: Department x Project Heatmap — Headcount, Hwaseong Memory BU, Q2 2026:

| Department  | DDR5-Gen4 | HBM4-Dev | NAND-V9 | Exynos 2600 |
| ----------- | --------- | -------- | ------- | ----------- |
| DRAM Dev    | 18        | 10       | 3       | 8           |
| NAND Dev    | 3         | 8        | 18      | 2           |
| Test Eng    | 6         | 4        | 8       | 3           |
| Process Eng | 2         | 12       | 5       | 7           |

---

---

## Screen 9: AI Report Builder

### Metadata

| Field                | Value                                              |
| -------------------- | -------------------------------------------------- |
| Screen ID            | SCR-09                                             |
| Screen Name          | AI Report Builder                                  |
| Concept              | E: AI Analysis Builder                             |
| Epic                 | E09 — AI-Powered Reporting                         |
| Feature Areas        | F7 (AI Reporting)                                  |
| Samsung Requirements | Req 11 (Samsung AI Services Integration)           |
| Primary Persona      | Eunji Lee (Analytics Specialist, Hwaseong)         |
| Secondary Persona    | Minho Kim (Manager, receives AI-generated reports) |

### Purpose

Specialized screen for generating AI-powered reports via Samsung AI Services. Users configure data scope (dimensions, measures, filters), select AI analysis options (PIVOT tables, trend analysis, narrative insights, anomaly detection), and receive a generated Excel report with intelligent analysis. The natural language input field enables conversational report generation ("Show me over-allocated engineers in DRAM for Q2"). Downloads as formatted Excel with multiple sheets.

### CXO Design Rationale

The AI Report Builder is the premium feature that justifies the "Intelligent" in IRIS. Design principles: (1) Wizard flow — three clear steps (Data Scope > AI Options > Result) prevent overwhelm. Most users arrive from Screen 8 with pre-loaded configuration, so Step 1 is often just confirmation. (2) Natural language input — the text field with suggestion chips ("Show me...", "Compare...", "Which engineers...") makes AI accessible to non-technical users. (3) AI insights preview — before downloading, users see a preview of the AI narrative. This builds trust and validates the output. (4) Report history — a list of previously generated reports enables comparison over time. (5) Download-first — the primary output is an Excel file (Samsung's preferred format), not an in-app visualization. This respects the existing workflow where reports are shared via email/chat.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS > AI Report Builder                  [O Search] [!] [Eunji Lee v] |
+------------------------------------------------------------------------------+
| Nav  | AI Report Builder -- Samsung AI Services Integration                   |
| Rail | Step: [1. Data Scope .] ------- [2. AI Options] ------- [3. Result]   |
|      |                                                                       |
| [#]  | +--- Natural Language Input -----------------------------------+      |
| [=]  | | Ask IRIS AI: [Show me over-allocated engineers in DRAM Q2___] |      |
| [~]  | | Suggestions: [Over-allocation] [Cross-site compare] [HC gap]  |      |
| [%]  | +-------------------------------------------------------------+      |
| [^]. |                                                                       |
| [&]  | +--- Step 1: Data Scope (pre-filled from Analysis Dashboard) ----+   |
| [@]  | |                                                                 |   |
| [*]  | |  Data Source:                                                   |   |
|      | |  +--- Dimensions -----------+  +--- Measures ----------------+  |   |
|      | |  | . Department  (rows)     |  | . Headcount  (values)       |  |   |
|      | |  | . Project     (columns)  |  | . Allocation %  (values)    |  |   |
|      | |  | o Time Period (pages)    |  | . Gap          (values)     |  |   |
|      | |  +--------------------------+  +-----------------------------+  |   |
|      | |                                                                 |   |
|      | |  Scope (Factor Control):                                        |   |
|      | |  +--------------------------------------------------------------+  |
|      | |  | Site: Hwaseong | BU: Memory | Period: Q2 2026 | Status: Active|  |
|      | |  +--------------------------------------------------------------+  |
|      | |                                                                 |   |
|      | |  Data Preview:                                                  |   |
|      | |  +--------------------------------------------------------------+  |
|      | |  | Records: 347 allocation entries                               |  |
|      | |  | Departments: 8 | Projects: 28 | Employees: 187              |  |
|      | |  | Date range: April 2026 -- June 2026                          |  |
|      | |  +--------------------------------------------------------------+  |
|      | |                                                                 |   |
|      | |                                          [Next: AI Options ->]  |   |
|      | +-----------------------------------------------------------------+   |
|      |                                                                       |
|      | +--- Step 2: AI Analysis Options (after clicking Next) ------------+   |
|      | |                                                                 |   |
|      | |  Select AI analyses to include:                                 |   |
|      | |                                                                 |   |
|      | |  [x] Excel PIVOT Tables                                        |   |
|      | |      Generate pivot tables with selected dimensions             |   |
|      | |                                                                 |   |
|      | |  [x] Trend Analysis                                             |   |
|      | |      Compare current period with previous (Q1 vs Q2)           |   |
|      | |                                                                 |   |
|      | |  [x] AI Narrative Insights                                      |   |
|      | |      Samsung AI generates written analysis with key findings    |   |
|      | |                                                                 |   |
|      | |  [x] Anomaly Detection                                          |   |
|      | |      Flag over/under-allocation and unusual patterns            |   |
|      | |                                                                 |   |
|      | |  [ ] Forecast Projection                                        |   |
|      | |      Project headcount needs for next 2 quarters                |   |
|      | |                                                                 |   |
|      | |  Output Format: [Excel (.xlsx) v]                               |   |
|      | |  Report Name: [IRIS_Hwaseong_Memory_Q2_2026__________]          |   |
|      | |                                                                 |   |
|      | |                          [<- Back]  [Generate Report ->]        |   |
|      | +-----------------------------------------------------------------+   |
|      |                                                                       |
|      | +--- Step 3: Result (after generation completes) ------------------+   |
|      | |                                                                 |   |
|      | |  [v] Report generated successfully (8.3 seconds)               |   |
|      | |                                                                 |   |
|      | |  Report: IRIS_Hwaseong_Memory_Q2_2026.xlsx                      |   |
|      | |  Generated: 2026-03-21 15:42                                    |   |
|      | |  Size: 2.4 MB | 5 sheets                                      |   |
|      | |                                                                 |   |
|      | |  Contents:                                                      |   |
|      | |  Sheet 1: PIVOT -- Dept x Project (Headcount)                   |   |
|      | |  Sheet 2: PIVOT -- Dept x Project (Allocation %)                |   |
|      | |  Sheet 3: Trend -- Q1 2026 vs Q2 2026 Comparison                |   |
|      | |  Sheet 4: AI Insights -- Narrative Analysis                      |   |
|      | |  Sheet 5: Anomalies -- 3 flagged items                          |   |
|      | |                                                                 |   |
|      | |  AI Insights Preview:                                            |   |
|      | |  +--------------------------------------------------------------+  |
|      | |  | "DRAM Dev is 12% over-allocated in Q2 2026 due to DDR5-Gen4  |  |
|      | |  | timeline expansion. 3 engineers (Kim Taeho, Park Minji,      |  |
|      | |  | Choi Yuna) exceed 95% utilization. Recommendation:           |  |
|      | |  | redistribute 2 engineers from DDR4 Sustaining (currently     |  |
|      | |  | at 62% utilization) to balance workload across DRAM          |  |
|      | |  | projects."                                                   |  |
|      | |  +--------------------------------------------------------------+  |
|      | |                                                                 |   |
|      | |  [Download .xlsx]  [Email to Recipients]  [Schedule Recurring]  |   |
|      | +-----------------------------------------------------------------+   |
|      |                                                                       |
|      | +--- Report History (bottom panel, collapsible) -------------------+   |
|      | | Date       | Report Name                     | Size  | Status  |   |
|      | |------------|-------------------------------|-------|---------|   |
|      | | 2026-03-21 | IRIS_Hwaseong_Memory_Q2_2026  | 2.4MB | Ready   |   |
|      | | 2026-03-14 | IRIS_Hwaseong_Memory_Q1_2026  | 2.1MB | Ready   |   |
|      | | 2026-03-07 | IRIS_CrossSite_Compare_Q1     | 3.8MB | Ready   |   |
|      | | [View] [Download] [Delete] [Re-generate]                       |   |
|      | +-----------------------------------------------------------------+   |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component                 | Widget                                    | Module   | Data Source                             | Interactions                                                              |
| ------------------------- | ----------------------------------------- | -------- | --------------------------------------- | ------------------------------------------------------------------------- |
| Natural Language Input    | MD3 text field with autocomplete          | M22      | Samsung AI Services                     | Type query. AI parses intent. Auto-configures dims/measures/filters       |
| Suggestion Chips          | MD3 chip row                              | M22      | Pre-defined templates                   | Click chip to populate natural language field                             |
| Wizard Steps              | Mendix Tab Container with step indicators | M22      | N/A                                     | Linear: Data Scope -> AI Options -> Result. Back/Next navigation          |
| Dimension/Measure Summary | MD3 chips (read-only)                     | M22      | Passed from Screen 8 or configured here | Shows selected dimensions and measures with assignment labels             |
| Factor Control Summary    | Inline display                            | M05      | Oracle (M02)                            | Shows current scope. Editable if user wants to modify                     |
| Data Preview              | Mendix computed                           | M22, M20 | ES count query                          | Record count, entity counts, date range. Validates scope before AI        |
| AI Option Checkboxes      | MD3 checkbox group                        | M22      | N/A                                     | Select analysis types. Default: PIVOT, Trend, Insights, Anomalies checked |
| Progress Indicator        | MD3 circular progress with timer          | M22      | Samsung AI API                          | Shows during API call: "Generating report... 5s"                          |
| Result Panel              | Mendix container                          | M22      | Samsung AI API response                 | Report details, sheet list, AI insights preview                           |
| AI Insights Preview       | MD3 text area (read-only)                 | M22      | Samsung AI API response                 | Narrative excerpt. Full content in downloaded Excel                       |
| Download Button           | MD3 Filled Button (primary)               | M22      | Generated file URL                      | Browser downloads .xlsx file                                              |
| Email Button              | MD3 Outlined Button                       | M32      | Oracle: recipients                      | Opens recipient selector. Sends via Smart Notify                          |
| Schedule Button           | MD3 Outlined Button                       | M32      | Oracle: NotificationSchedule            | Opens scheduling dialog                                                   |
| Report History            | Mendix DataGrid (bottom panel)            | M22      | Oracle: AIReportHistory                 | Chronological list. Download, delete, re-generate                         |

### Interaction Notes

| Trigger                             | Action                  | Result                                                                   |
| ----------------------------------- | ----------------------- | ------------------------------------------------------------------------ |
| Type in natural language field      | AI interprets query     | Dims/measures/filters auto-configured. User can modify before generating |
| Click suggestion chip               | Populate query          | Natural language field filled. Configuration auto-set                    |
| Click "Next: AI Options"            | Advance to Step 2       | Step 2 shown. Checkbox options displayed                                 |
| Click "Generate Report"             | Call Samsung AI API     | Progress indicator. 5-15 seconds. Result panel on completion             |
| Click "Download .xlsx"              | Browser download        | Excel file downloaded. Filename from report name                         |
| Click "Email to Recipients"         | Open recipient selector | Multi-select from IRIS users. Custom email addresses. Send via M32       |
| Click "Schedule Recurring"          | Open scheduling dialog  | Frequency: Weekly/Monthly. Day/time. Recipients. Creates schedule        |
| Click "Back"                        | Return to previous step | Step 1 re-displayed with current configuration preserved                 |
| Click report in history             | View details            | Expands to show sheet list, insights preview, download button            |
| Click "Re-generate" on history item | Re-run with same config | Calls Samsung AI API again with original configuration                   |

### Data Requirements

| Entity                   | Source                  | Fields                                                                                     | Module |
| ------------------------ | ----------------------- | ------------------------------------------------------------------------------------------ | ------ |
| Aggregated Analysis Data | ES                      | Pre-aggregated data matching dims/measures/filters                                         | M20    |
| AI Report Response       | Samsung AI Services API | report_url, sheets_generated[], insights_text, anomalies_count, generation_time_ms         | M22    |
| Report Config            | Oracle                  | report_name, dimensions_json, measures_json, filters_json, ai_options_json, generated_date | M22    |
| AI Report History        | Oracle                  | report_id, report_name, file_url, file_size, created_by, created_date, status              | M22    |
| Scheduled Reports        | Oracle                  | schedule_id, report_config_id, frequency, recipients, last_run, next_run                   | M32    |

### Responsive Behavior

| Viewport             | Layout Adaptation                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Desktop (>1280px)    | Full wizard layout. Natural language input prominent. Report history as bottom panel               |
| Laptop (1024-1280px) | Same layout, slightly compressed. Report history collapsible                                       |
| Tablet (768-1024px)  | Wizard steps stack. Natural language input full-width. History in separate tab                     |
| Mobile (<768px)      | Simplified: natural language input + generate button only. Download link. No configuration details |

### Empty, Loading, and Error States

| State                          | Display                                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Loading (AI generation)**    | Full-width progress bar with timer: "Generating AI report... 5s". Cancel button                          |
| **AI timeout**                 | "Samsung AI Services did not respond within 30 seconds. [Retry] or [Download raw data instead]"          |
| **AI error**                   | "AI analysis failed. Error: [message]. [Retry] [Report Issue] [Download raw data]"                       |
| **No report history**          | "No reports generated yet. Configure your first analysis above."                                         |
| **Natural language ambiguous** | AI shows clarification: "Did you mean: (A) Over-allocated by headcount, or (B) Over-allocated by hours?" |

### Accessibility Notes

- Natural language input has aria-label "Enter your analysis question for IRIS AI"
- Wizard steps announced: "Step 1 of 3: Data Scope. Current step."
- AI insights preview has role="article" for screen reader
- Checkbox group uses fieldset/legend pattern
- Progress indicator announces percentage: "Generating report, 60% complete"

### Samsung-Specific Data Examples

Example AI-generated report: IRIS_Hwaseong_Memory_Q2_2026.xlsx

| Sheet                   | Content                                                          | Source         |
| ----------------------- | ---------------------------------------------------------------- | -------------- |
| Sheet 1: PIVOT (HC)     | Dept x Project pivot with headcount values                       | ES aggregation |
| Sheet 2: PIVOT (Alloc%) | Dept x Project pivot with allocation percentages                 | ES aggregation |
| Sheet 3: Trend          | Q1 2026 vs Q2 2026 comparison, delta columns                     | ES time-series |
| Sheet 4: AI Insights    | Narrative analysis paragraph identifying DRAM over-allocation    | Samsung AI     |
| Sheet 5: Anomalies      | 3 flagged items: Kim Taeho 100%, NAND-V9 understaffed, DDR4 idle | Samsung AI     |

---

---

## Screen 10: Project Management

### Metadata

| Field                | Value                                                     |
| -------------------- | --------------------------------------------------------- |
| Screen ID            | SCR-10                                                    |
| Screen Name          | Project Management                                        |
| Concept              | Foundation                                                |
| Epic                 | E02 — Project & Product Lifecycle                         |
| Feature Areas        | F2 (Project Management)                                   |
| Samsung Requirements | Req 5 (N-PLM Sync)                                        |
| Primary Persona      | Minho Kim (Division Manager, Hwaseong)                    |
| Secondary Persona    | Jisoo Park (Planner, views project context when planning) |

### Purpose

Manage the project/product lifecycle within IRIS. View all projects, their status, assigned resources, actual vs. planned P/M comparison, and N-PLM sync status. This screen bridges IRIS planning data and the external N-PLM system with bidirectional sync support. Managers use this screen to monitor project health, check resource alignment, and trigger sync operations. Quick actions enable status updates, allocation viewing, and version history access.

### CXO Design Rationale

The Project Management screen is the manager's control center. Design principles: (1) Master-detail layout — the project list (left) provides scannable overview, while the detail panel (right) provides deep context. This is a proven pattern that managers are familiar with from email and file managers. (2) Status as the primary sort/filter — projects are sorted by status (Active first, then On-Hold, then Completed) because status drives attention. (3) Resource alignment — the "Assigned Resources" table shows planned vs actual allocation, immediately revealing projects that are under- or over-resourced. (4) N-PLM sync prominently displayed — the sync status block shows at a glance whether IRIS and N-PLM are aligned. Stale data (>3 days since sync) gets an amber warning. (5) Quick actions — "Update Status", "View Allocations", "View Version History" are one-click actions, not buried in menus.

### ASCII Wireframe

```
+------------------------------------------------------------------------------+
|  [=] IRIS > Project Management                 [O Search] [!] [Minho Kim v] |
+------------------------------------------------------------------------------+
| Nav  | Projects -- Hwaseong -- Memory BU                    [+ New Project]  |
| Rail | Filter: [All Status v] [All Types v] [Search: __________________]    |
|      |                                                                       |
| [#]  | +--- Project List (40%) ------+  +--- Project Detail (60%) -------+  |
| [=]  | |                            |  |                                  |  |
| [~]  | | . DDR5-Gen4                 |  | DDR5 Generation 4                |  |
| [%]  | |   Active | R&D             |  |                                  |  |
| [^]  | |   18 eng | 78% util        |  | +--- Overview ------------------+|  |
| [&]  | |   [v] N-PLM synced          |  | | Code:      DDR5G4             ||  |
| [@]. | |                            |  | | Type:      R&D / Core         ||  |
| [*]  | | o HBM4-Dev                  |  | | Family:    DRAM               ||  |
|      | |   Active | R&D             |  | | Node:      1a nm              ||  |
|      | |   15 eng | 85% util        |  | | Priority:  1 (Highest)        ||  |
|      | |   [v] N-PLM synced          |  | | Leader:    Kim Taeho          ||  |
|      | |                            |  | | Manager:   Minho Kim          ||  |
|      | | o NAND-V9                   |  | | Status:    Active             ||  |
|      | |   Active | R&D             |  | | Division:  Memory / DRAM      ||  |
|      | |   25 eng | 85% util        |  | | Timeline:  2025-09 -- 2026-12 ||  |
|      | |   [v] N-PLM synced          |  | | Site:      Hwaseong           ||  |
|      | |                            |  | +--------------------------------+|  |
|      | | o Exynos 2600               |  |                                  |  |
|      | |   Active | R&D             |  | +--- Assigned Resources --------+|  |
|      | |   12 eng | 81% util        |  | | Employee     | Role    |Plan|Act||  |
|      | |   [v] N-PLM synced          |  | |--------------|---------|----|----|  |
|      | |                            |  | | Kim Taeho    | Lead    | 80%| 72%|  |
|      | | o DDR4-Sustaining           |  | | Park Minji   | Member  | 60%| 58%|  |
|      | |   Active | Sustaining      |  | | Choi Yuna    | Member  | 70%| 65%|  |
|      | |   8 eng  | 62% util        |  | | Lee Naeun    | Support | 50%| 48%|  |
|      | |   (!) Stale (5 days)        |  | | + 14 more engineers             |  |
|      | |                            |  | | Total: 18 | Avg Plan: 78%       |  |
|      | | o ISOCELL-HP3               |  | |             Avg Actual: 72%     |  |
|      | |   On-Hold | R&D            |  | +--------------------------------+|  |
|      | |   8 eng  | 65% util        |  |                                  |  |
|      | |   [v] N-PLM synced          |  | +--- Actual vs Plan PM ----------+|  |
|      | |                            |  | | Month  |Plan |Actual| Gap|Status||  |
|      | | o HBM3-Production           |  | |--------|-----|------|----|------|  |
|      | |   Completed | Prod         |  | | Jan 26 | 45  | 43   | -2 | [v]  |  |
|      | |   0 eng  | --              |  | | Feb 26 | 48  | 46   | -2 | [v]  |  |
|      | |   [v] N-PLM synced          |  | | Mar 26 | 50  | 47   | -3 | (!)  |  |
|      | |                            |  | | Apr 26 | 52  | --   | -- | o    |  |
|      | +--- Summary ---------------+  | |                                  |  |
|      | | Total: 52 projects         |  | | Gap trend: Widening (!)         |  |
|      | | Active: 45 | Hold: 4      |  | +--------------------------------+|  |
|      | | Complete: 3                |  |                                  |  |
|      | +----------------------------+  | +--- N-PLM Sync Status ----------+|  |
|      |                               | | Last sync: 2026-03-21 02:00     ||  |
|      |                               | | Status: [v] In Sync             ||  |
|      |                               | | Changes pending: 0              ||  |
|      |                               | | [Force Sync] [View Sync Log]    ||  |
|      |                               | +--------------------------------+|  |
|      |                               |                                  |  |
|      |                               | [Edit Project] [View in Roadmap] |  |
|      |                               | [Update Status v] [View History] |  |
|      |                               +----------------------------------+  |
+------------------------------------------------------------------------------+
```

### Component Inventory

| Component            | Widget                                 | Module   | Data Source                          | Interactions                                                                                    |
| -------------------- | -------------------------------------- | -------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Project List         | Mendix ListView with search and filter | M02      | Oracle: Project                      | Scrollable list. Status badge, resource count, utilization bar, sync indicator. Click to select |
| Project Detail Panel | Mendix DataView with sections          | M02      | Oracle: Project, ResourceAllocation  | Overview, Assigned Resources, Actual vs Plan, Sync Status. Sections are collapsible             |
| Overview Section     | Mendix DataView                        | M02      | Oracle: Project                      | Project attributes: code, type, family, node, priority, leader, manager, status, timeline, site |
| Resource Table       | Mendix DataGrid                        | M10, M11 | Oracle: ResourceAllocation, Employee | Employee rows with role, planned %, actual %. Click employee to see cross-project allocation    |
| Actual vs Plan       | Mendix DataGrid + computed gap         | M10      | Oracle: PMEntry, N-PLM actual data   | Monthly comparison. Gap color: green (<5%), amber (5-10%), red (>10%)                           |
| Gap Trend            | Computed indicator                     | M10      | Derived from Actual vs Plan          | "Narrowing", "Stable", "Widening" with directional arrow                                        |
| N-PLM Sync Status    | Mendix status block                    | M31      | Oracle: SyncRecord                   | Last sync date/time, sync status badge, pending changes count                                   |
| Status Filter        | MD3 dropdown                           | M02      | Enum                                 | Active, On-Hold, Completed, Cancelled, All                                                      |
| Type Filter          | MD3 dropdown                           | M02      | Oracle: ProjectType                  | R&D Core, R&D New, Sustaining, Production, All                                                  |
| Search               | MD3 text field                         | M02      | Oracle: Project                      | Searches project name, code, leader name                                                        |
| New Project Button   | MD3 FAB                                | M02      | N/A                                  | Opens creation form. On save, creates in IRIS, optionally pushes to N-PLM                       |
| Quick Actions        | MD3 button row                         | M02, M11 | N/A                                  | Edit Project, View in Roadmap, Update Status, View History                                      |
| Utilization Badge    | MD3 conditional chip                   | Computed | Derived from allocation %            | Green (60-85%), Amber (85-95%), Red (>95%)                                                      |
| Stale Indicator      | MD3 chip with warning                  | M31      | Computed from last sync date         | Amber "Stale (N days)" when sync >3 days old                                                    |

### Interaction Notes

| Trigger                        | Action                        | Result                                                                   |
| ------------------------------ | ----------------------------- | ------------------------------------------------------------------------ |
| Click project in list          | Select and load detail        | Detail panel loads. Resource table, Actual vs Plan, Sync status populate |
| Click "Edit Project"           | Open edit form                | Inline editing of project metadata. Save triggers sync check             |
| Click "View in Roadmap"        | Navigate to Screen 5          | Opens Roadmap filtered to this project. Highlights project bar in Gantt  |
| Click "Update Status" dropdown | Change status                 | Select: Active -> On-Hold -> Completed -> Cancelled. Confirmation dialog |
| Click "View History"           | Open version history          | Modal/page showing all versions where this project appeared. Diff-able   |
| Click employee name            | View cross-project allocation | Opens employee detail: all projects, total allocation, utilization chart |
| Click "Force Sync"             | Trigger immediate N-PLM sync  | Progress indicator. Shows sync results (items updated/added/conflicted)  |
| Click "View Sync Log"          | Open sync history             | Chronological sync records: date, status, items changed, errors          |
| Click "+ New Project"          | Open creation form            | Form: code, name, type, family, node, priority, leader, timeline, site   |
| Search/filter                  | Update project list           | List filters in real-time. Summary counts update                         |

### Data Requirements

| Entity              | Source         | Fields                                                                                                                                                                         | Module   |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Project             | Oracle         | project_id, project_name, project_code, project_type, product_family, technology_node, priority, status, leader_id, manager_id, site_id, start_date, target_end_date, division | M02      |
| Resource Assignment | Oracle         | employee_id, project_id, role_in_project, allocated_pct, allocated_hours                                                                                                       | M11, M10 |
| Actual PM           | Oracle / N-PLM | actual_days, actual_hours per month per project                                                                                                                                | M10, M31 |
| Planned PM          | Oracle         | planned_days, planned_hours per month per project                                                                                                                              | M10      |
| SyncRecord          | Oracle         | sync_id, target_system, sync_status, last_sync_date, changed_count, error_message                                                                                              | M31      |
| Employee            | Oracle         | employee_id, name, team, job_grade                                                                                                                                             | M02      |

### Responsive Behavior

| Viewport                | Layout Adaptation                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Large monitor (>1440px) | Full master-detail (40/60 split). All sections visible. Resource table shows all columns |
| Desktop (1280-1440px)   | Same layout. Resource table may need horizontal scroll                                   |
| Laptop (1024-1280px)    | List (35%) + Detail (65%). Sections collapsible                                          |
| Tablet (768-1024px)     | List and detail stack vertically. List as collapsed cards. Detail in separate view       |
| Mobile (<768px)         | List-only with summary cards. Tap project to navigate to full-page detail                |

### Empty, Loading, and Error States

| State                        | Display                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| **Loading**                  | List skeleton with 6 placeholder rows. Detail panel shimmer                          |
| **No projects**              | "No projects found for [Site] [BU]. [+ Create First Project] or [Import from N-PLM]" |
| **No projects match filter** | "No projects match your search/filter criteria. [Reset Filters]"                     |
| **Sync failed**              | Red badge on sync status: "Last sync failed: [error]. [Retry] [View Log]"            |
| **No actuals data**          | Actual column shows "--" with tooltip: "No actuals data from N-PLM for this period"  |
| **Project detail loading**   | Detail panel shows spinner: "Loading project details..."                             |

### Accessibility Notes

- Project list items navigable via Arrow keys
- Detail panel sections have heading levels (h3 for section titles)
- Status badges have text labels, not just color
- Resource table sortable via keyboard (Shift+click column header alternative: Ctrl+Arrow)
- Sync status announced by screen reader: "N-PLM sync status: In Sync. Last synced 2026-03-21 at 02:00"

### Samsung-Specific Data Examples

| Project         | Type       | Family     | Node   | Division   | Engineers | Utilization | Status    |
| --------------- | ---------- | ---------- | ------ | ---------- | --------- | ----------- | --------- |
| DDR5-Gen4       | R&D Core   | DRAM       | 1a nm  | Memory     | 18        | 78%         | Active    |
| HBM4-Dev        | R&D New    | DRAM       | 1b nm  | Memory     | 15        | 85%         | Active    |
| NAND-V9         | R&D Core   | NAND       | V9     | Memory     | 25        | 85%         | Active    |
| Exynos 2600     | R&D Core   | System LSI | 3nm    | System LSI | 12        | 81%         | Active    |
| DDR4-Sustaining | Sustaining | DRAM       | 1y nm  | Memory     | 8         | 62%         | Active    |
| ISOCELL-HP3     | R&D New    | ISOCELL    | 0.56um | System LSI | 8         | 65%         | On-Hold   |
| HBM3-Production | Production | DRAM       | 1b nm  | Memory     | 0         | --          | Completed |

---

---

## Cross-Screen Navigation Map

```
                        +-------------------+
                        | Screen 1: HOME    |
                        | World Map         |
                        +--------+----------+
                                 |
                    Click site   |   Click nav item
                    drill-down   |
                +-------+--------+--------+--------+
                |       |        |        |        |
                v       v        v        v        v
         +------+  +---+---+ +--+---+ +--+---+ +--+---+
         |Scr 2 |  |Scr 5  | |Scr 6 | |Scr 7 | |Scr 8 |
         |P/M   |  |Roadmap| |Simul.| |HC     | |Analys|
         |Planner|  |       | |      | |Portfl.| |Dashbd|
         +---+---+  +---+---+ +--+---+ +------+ +--+---+
             |           |        |                  |
         Conflict    Compare   Promote           AI Report
             |       versions  to roadmap            |
             v           v        v                  v
         +---+---+  +---+---+ +--+---+         +---+---+
         |Scr 3  |  |Diff   | |Scr 5 |         |Scr 9  |
         |Conflict|  |Viewer | |Roadmap|         |AI Rpt |
         |Resolve |  |(modal)| |(draft)|         |Builder|
         +--------+  +-------+ +------+         +-------+

         +--------+  +--------+
         |Scr 4   |  |Scr 10  |
         |Master  |  |Project |
         |Data    |  |Mgmt    |
         +--------+  +--------+
         (standalone, accessed via nav rail)
```

### Primary User Journey: Jisoo (Planner)

1. **Login** -> Screen 1 (Home) — sees global site overview
2. **Navigate** -> Screen 2 (P/M Planner) — opens Hwaseong DRAM Development April 2026 plan
3. **Edit** allocations in Gantt grid — sees Hyunwoo's presence indicators
4. **Save** -> Screen 3 (Conflict Resolution) — resolves 1 conflict with Hyunwoo
5. **Navigate** -> Screen 5 (Roadmap) — views FY2026 roadmap, creates new version
6. **Create Simulation** -> Screen 6 (Simulation Sandbox) — tests HBM4 acceleration scenario
7. **Promote** simulation -> Screen 5 (Roadmap) — submits new roadmap draft for approval

### Secondary User Journey: Eunji (Analyst)

1. **Login** -> Screen 1 (Home) — sees global overview
2. **Navigate** -> Screen 8 (Analysis Dashboard) — builds heatmap: Dept x Project x HC
3. **Drill down** into DRAM Development — sees per-engineer allocation
4. **Click AI Report** -> Screen 9 (AI Report Builder) — generates Excel PIVOT with insights
5. **Download** and **email** report to Minho (Manager)

### Tertiary User Journey: Soyeon (HR)

1. **Login** -> Screen 1 (Home) — sees site-level HC gaps
2. **Navigate** -> Screen 7 (HC Portfolio) — opens Hwaseong Q2 2026 staffing plan
3. **Edit targets** — sets Q2 headcount goals by department and grade
4. **Assign actions** — marks gaps as Hire, Transfer, or Retain
5. **Submit for approval** -> email to Minho

---

## Clickable Prototype Flow Description

The clickable prototype connects the 10 screens into a navigable flow for Samsung DSR usability testing. Built in Mendix Studio (or Figma for early validation), the prototype simulates the core workflows without backend integration.

### Prototype Scope

| Flow          | Screens               | Interactions                                                                       | Data                               |
| ------------- | --------------------- | ---------------------------------------------------------------------------------- | ---------------------------------- |
| Planning Flow | 1 -> 2 -> 3 -> 5 -> 6 | Full navigation, cell editing, conflict resolution, version comparison, simulation | Static JSON mimicking ES responses |
| Analysis Flow | 1 -> 8 -> 9           | Dashboard building, drill-down, AI report generation                               | Static heatmap data                |
| HR Flow       | 1 -> 7                | Grid editing, chart interaction, approval                                          | Static staffing data               |
| Admin Flow    | 4 -> 10               | Tree navigation, project detail, sync status                                       | Static master data                 |

### Prototype Fidelity

| Aspect             | Fidelity Level                                                              |
| ------------------ | --------------------------------------------------------------------------- |
| Visual design      | High — full MD3 styling, Indigo palette, Roboto typography                  |
| Navigation         | High — all nav rail items clickable, breadcrumbs functional                 |
| Data               | Medium — realistic Samsung DSR data but static (not connected to ES/Oracle) |
| Editing            | Medium — cells editable, values change, but no persistence                  |
| Concurrent editing | Low — simulated presence indicators, pre-scripted conflict scenario         |
| AI features        | Low — static AI insights preview, no actual Samsung AI API call             |
| Responsive         | Medium — desktop and tablet breakpoints implemented                         |

### Test Scenarios for Usability

| #   | Scenario                                         | Primary Screen | Success Criteria                                                         |
| --- | ------------------------------------------------ | -------------- | ------------------------------------------------------------------------ |
| 1   | "Find Pyeongtaek utilization"                    | Screen 1       | User locates Pyeongtaek pin/card and reads 91% within 30 seconds         |
| 2   | "Edit Kim Taeho's DDR5 allocation to 90%"        | Screen 2       | User navigates to P/M Planner, finds cell, edits value within 60 seconds |
| 3   | "Resolve the conflict with Hyunwoo"              | Screen 3       | User understands the conflict and selects a resolution within 45 seconds |
| 4   | "Compare Roadmap V6 vs V5"                       | Screen 5       | User opens diff viewer and identifies changes within 60 seconds          |
| 5   | "Create a simulation moving 5 engineers to HBM4" | Screen 6       | User completes clone wizard and modifies allocations within 3 minutes    |
| 6   | "Find the HC gap for DRAM Development"           | Screen 7       | User reads gap value (-5) within 30 seconds                              |
| 7   | "Build a heatmap of Dept x Project"              | Screen 8       | User configures dimensions and renders chart within 90 seconds           |
| 8   | "Check DDR5-Gen4 N-PLM sync status"              | Screen 10      | User navigates to project and reads sync status within 45 seconds        |

---

## Requirement Coverage Matrix

| Screen                | F1  | F2  | F3  | F4  | F5  | F6  | F7  | Req 0 | Req 1 | Req 2 | Req 3 | Req 4 | Req 5 | Req 6 | Req 7 | Req 8 | Req 9 | Req 10 | Req 11 | Req 12 |
| --------------------- | --- | --- | --- | --- | --- | --- | --- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ------ | ------ | ------ |
| 1. World Map Home     |     |     |     | x   |     |     |     |       |       |       |       |       |       | x     | x     | x     |       |        |        |        |
| 2. P/M Planner        | x   |     | x   |     |     |     |     | x     |       |       | x     |       |       |       |       |       |       |        |        |        |
| 3. Conflict Resolve   | x   |     |     |     |     |     |     | x     |       |       | x     |       |       |       |       |       |       |        |        |        |
| 4. Master Data        | x   |     |     |     |     |     |     | x     |       |       |       |       | x     |       |       |       |       |        |        |        |
| 5. Roadmap + Version  |     |     | x   |     |     |     |     |       | x     | x     |       | x     |       |       |       |       |       |        |        |        |
| 6. Simulation         |     |     | x   |     |     |     |     |       | x     |       |       | x     |       |       |       |       |       |        |        |        |
| 7. HC Portfolio       |     |     |     | x   |     |     |     |       |       |       |       |       |       |       |       |       | x     |        |        |        |
| 8. Analysis Dashboard |     |     |     |     | x   | x   |     |       |       |       |       |       |       | x     |       | x     |       | x      |        |        |
| 9. AI Report Builder  |     |     |     |     |     |     | x   |       |       |       |       |       |       |       |       |       |       |        | x      |        |
| 10. Project Mgmt      |     | x   |     |     |     |     |     |       |       |       |       |       | x     |       |       |       |       |        |        |        |
| Infra (implicit)      |     |     |     |     |     |     |     |       |       |       |       |       |       |       |       |       |       |        |        | x      |

**Coverage**: All 7 feature areas (F1-F7) covered. All 13 Samsung requirements (Req 0-12) addressed by at least one screen. Req 6 (Mobile/Responsive) is addressed across all screens via responsive behavior specifications. Req 12 (Infrastructure) is addressed by the deployment architecture, not a UI screen.

---

## Samsung DSR Contextual Data Summary

> Used throughout all screens for realistic prototype data.

### Sites

| Site       | Country     | Region   | Key BUs                 | HC Range |
| ---------- | ----------- | -------- | ----------------------- | -------- |
| Hwaseong   | South Korea | APAC     | Memory, System LSI      | 400-500  |
| Pyeongtaek | South Korea | APAC     | Memory (NAND focus)     | 150-200  |
| Austin     | USA         | Americas | Foundry, System LSI     | 100-150  |
| Xi'an      | China       | APAC     | Memory (NAND)           | 180-220  |
| Giheung    | South Korea | APAC     | R&D, Advanced Packaging | 80-100   |

### Divisions & Product Families

| Division   | Business Unit | Example Projects                             |
| ---------- | ------------- | -------------------------------------------- |
| Memory     | DRAM          | DDR5-Gen4, HBM4-Dev, DDR4-Sustaining, LPDDR6 |
| Memory     | NAND          | V9 3D NAND, V8 Optimization, QLC Advanced    |
| System LSI | System LSI    | Exynos 2600, Exynos 2700, Modem 6G           |
| System LSI | ISOCELL       | HP3, HP5, Auto Vision                        |
| Foundry    | Foundry       | 3nm GAA, 2nm Process, Multi-Die              |

### Personnel Names (Korean, realistic)

| Name         | Grade | Role                           | Team          | Site       |
| ------------ | ----- | ------------------------------ | ------------- | ---------- |
| Kim Taeho    | G1    | Senior Engineer / Project Lead | DRAM Design   | Hwaseong   |
| Park Minji   | G2    | Process Engineer               | DRAM Process  | Hwaseong   |
| Lee Jihoon   | G2    | Test Engineer                  | DRAM Test     | Hwaseong   |
| Choi Yuna    | G1    | Design Engineer                | DRAM Design   | Hwaseong   |
| Kang Siwoo   | G1    | Senior Engineer                | NAND Dev      | Pyeongtaek |
| Seo Jiwon    | G2    | Process Engineer               | NAND Process  | Pyeongtaek |
| Yoon Daeun   | G3    | Junior Engineer                | DRAM Design   | Hwaseong   |
| Han Seojun   | G2    | Test Engineer                  | Test Eng      | Austin     |
| Lee Naeun    | G3    | Support Engineer               | DRAM Design   | Hwaseong   |
| Hyunwoo Choi | G2    | Resource Planner               | DRAM Planning | Hwaseong   |

### Personas

| Persona | Full Name   | Role                      | Primary Screens |
| ------- | ----------- | ------------------------- | --------------- |
| Jisoo   | Jisoo Park  | Senior Resource Planner   | 2, 3, 5, 6      |
| Minho   | Minho Kim   | Division Planning Manager | 1, 5, 7, 10     |
| Eunji   | Eunji Lee   | Analytics Specialist      | 8, 9            |
| Soyeon  | Soyeon Choi | HR Portfolio Manager      | 7               |

---

## Related Guides

- **S2_PROTOTYPING_GUIDE** (.ax/guides/) — Detailed guidance on building prototypes within the AX DESIGN phase
- **S1_IDEATION_WORKSHOP_GUIDE** (.ax/guides/) — Source workshop methodology
- **S3_CONCEPT_VALIDATION_GUIDE** (.ax/guides/) — Next step: validate these prototypes with Samsung DSR users
- **T14_CONCEPT_SKETCH** (.ax/templates/) — Concept sketch template used as input

---

_This document follows the AX Transformation Framework v2.0.0 DESIGN phase methodology._
_All 10 screens designed fresh for IRIS (new build on Mendix 10). PM Planner is reference only, not a derivative._
_Next step: S3 — Concept Validation with 4-6 Samsung DSR users across Hwaseong, Pyeongtaek, and Austin sites._
