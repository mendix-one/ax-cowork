# 00 INTRO — IRIS: Intelligent Resources Information System

> **Version**: 1.0.0 | **Date**: 2026-03-21
>
> **Customer**: Samsung Electronics — Device Solution Research (DSR)
>
> IRIS is a next-generation resource planning and simulation platform that replaces and extends Samsung's existing P/M (Personal Monthly) Planner system.

---

## What Is IRIS?

**IRIS** (Intelligent Resources Information System) is an enterprise resource planning platform built for Samsung Electronics' Device Solution Research division. It provides intelligent simulation, capacity-based planning, and multi-dimensional analysis to optimize how Samsung allocates human resources across global semiconductor R&D sites.

IRIS connects to Samsung's existing enterprise ecosystem — **Teamcenter (PLM)**, **Spec Management**, **Master Data Management (N-PLM, SMDM, GHRP)**, and **PROMIS** (Profit Management System) — to create a unified view of resource planning and utilization.

### Core Capabilities

| Capability                        | Description                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Standard P/M Management**       | Manage Personal Monthly effort data with revision history, concurrent editing, conflict detection, and approval workflows |
| **Project/Product Management**    | Sync project information and status between IRIS and N-PLM, with actual PM tracking                                       |
| **Resource Roadmap & Simulation** | Create resource roadmaps per project, run what-if simulations, and select optimal plans by profit capacity                |
| **Multi-Dimensional Analysis**    | Analyze resources across dimensions: Stage, Block, Function, Activity, SW/HW, Organization, Timeline                      |
| **HR Portfolio (World Map)**      | Global view of Samsung sites with resource allocation status, utilization metrics, and optimization recommendations       |
| **Actual vs Plan Gap Reporting**  | Dashboard comparing planned allocations against actuals with variance analysis                                            |
| **AI-Powered Planning**           | Demand forecasting, intelligent constraint scheduling, and automated reporting via Samsung AI Services                    |

### Key Integrations

```
+------------------+        +------------------+        +------------------+
|   N-PLM          |------->|                  |------->|   PROMIS         |
|   (Master Data)  |        |                  |        |   (Profit Mgmt)  |
+------------------+        |                  |        +------------------+
                            |      IRIS        |
+------------------+        |                  |        +------------------+
|   SMDM / GHRP   |------->|   Mendix 10      |------->|   N-PLM          |
|   (Organization) |        |   Oracle 19c     |        |   (PM Schedule)  |
+------------------+        |   Elasticsearch  |        +------------------+
                            |                  |
+------------------+        |                  |
|   Teamcenter     |------->|                  |
|   (PLM)          |        +------------------+
+------------------+
```

---

## Project Context

| Field             | Value                                                |
| ----------------- | ---------------------------------------------------- |
| **Product Name**  | IRIS (Intelligent Resources Information System)      |
| **External Name** | IRIS by Amoza                                        |
| **Pillar**        | PLAN                                                 |
| **Customer**      | Samsung Electronics — Device Solution Research (DSR) |
| **Framework**     | AX (Amoza Transformation) v2.0.0                     |
| **Current Phase** | DISCOVER / DESIGN (combined)                         |
| **Team**          | Amoza Production Team (SWAT, 6 members)              |
| **Approach**      | New build on Mendix 10, replacing legacy PM Planner  |

### Technology Stack

| Layer                    | Technology                                   |
| ------------------------ | -------------------------------------------- |
| **Application Platform** | Mendix 10 (low-code)                         |
| **Primary Database**     | Oracle 19c                                   |
| **Analytics Engine**     | Elasticsearch 8.x (Master-Data Node cluster) |
| **Gantt Visualization**  | xDHTML Gantt                                 |
| **Charts & Dashboards**  | ECharts.js                                   |
| **World Map**            | Map widget with portfolio overlays           |
| **Infrastructure**       | HA cluster topology (QA + Prod)              |

---

## Problem Statement

> **Samsung DSR Resource Planners** need a way to **simulate, plan, and optimize resource allocation across global R&D sites with real-time collaboration and multi-dimensional analysis** because **the current PM Planner lacks version management, concurrent editing support, simulation capabilities, and intelligent analytics — resulting in suboptimal resource utilization and manual, error-prone planning processes.**

### Problem Scoring

| Dimension          | Score       | Evidence                                                                             |
| ------------------ | ----------- | ------------------------------------------------------------------------------------ |
| Frequency          | 9/10        | Daily planning activity across multiple sites and teams                              |
| Severity           | 8/10        | Misallocated resources directly impact semiconductor R&D timelines and profitability |
| Market Size        | 7/10        | All Samsung DSR sites globally (multiple countries, hundreds of planners)            |
| Willingness to Pay | 9/10        | Samsung has existing contract and active investment in solution                      |
| **Average**        | **8.25/10** | **Exceeds 7/10 threshold — proceed**                                                 |

---

## Initial Hypotheses

### Value Hypothesis

> We believe that **Samsung DSR resource planners** will **adopt IRIS as their primary planning tool** because it **provides real-time collaboration, version-managed roadmaps, and multi-dimensional simulation that eliminates manual planning errors**, and we will know this is true when we observe **80%+ of planners using IRIS daily within 3 months of deployment, with a 50% reduction in planning cycle time**.

### Growth Hypothesis

> We believe that **demonstrating measurable resource utilization improvements at pilot sites** will drive expansion to **all Samsung DSR sites globally** because **quantified ROI in semiconductor R&D planning directly impacts profitability**, and we will know this is true when we observe **3+ additional sites requesting IRIS deployment within 6 months of pilot success**.

---

## Feature Areas

| #   | Feature Area               | Samsung Req | Description                                                                       |
| --- | -------------------------- | ----------- | --------------------------------------------------------------------------------- |
| F1  | Standard P/M Management    | Req 3       | CRUD, revision history, concurrent editing, conflict detection, approval workflow |
| F2  | Project/Product Management | Req 2, 5    | Project data sync with N-PLM, version history per project, delta sync to PROMIS   |
| F3  | Resource Roadmap           | Req 1, 4    | Gantt-based roadmap creation, version management, multi-planner collaboration     |
| F4  | Resource Simulation        | Req 1, 4    | What-if scenarios, multi-dimensional analysis, capacity planning                  |
| F5  | HR Portfolio & World Map   | Req 7, 8, 9 | Global site visualization, headcount planning, staffing analysis                  |
| F6  | Analysis & Reporting       | Req 8, 10   | Actual vs Plan gap, utilization dashboards, periodic auto-reports                 |
| F7  | AI-Powered Intelligence    | Req 11      | Demand forecasting, constraint scheduling, AI-generated Excel reports             |

### Samsung-Specific Requirements

| #   | Requirement                                                             | Priority |
| --- | ----------------------------------------------------------------------- | -------- |
| 0   | Upgrade to Mendix 10, enhance custom widgets                            | High     |
| 1   | Separate Resource Roadmap and Resource Simulation management            | High     |
| 2   | Version history per project with delta sync to PROMIS/N-PLM             | High     |
| 3   | Concurrent saving with auto-merge, conflict detection, approval process | High     |
| 4   | Resource Roadmap & Simulation enhancements                              | High     |
| 5   | N-PLM integration (Master Data Management)                              | High     |
| 6   | Factor Control filtering                                                | Medium   |
| 7   | Home screen renewal (World Map + resource statistics)                   | Medium   |
| 8   | Analysis views (World Map, Personal)                                    | Medium   |
| 9   | HeadCount Portfolio (Staffing Plan + Analysis)                          | Medium   |
| 10  | Analysis Reporting with charts, auto-email notifications                | Medium   |
| 11  | AI-based reporting via Samsung AI Services                              | Low      |
| 12  | New server installation & configuration (April–July)                    | High     |

---

## Metrics

### North Star Metric

| Field                 | Value                                                                       |
| --------------------- | --------------------------------------------------------------------------- |
| **North Star Metric** | Resource plans optimized per month across all Samsung DSR sites             |
| **Definition**        | Count of resource roadmaps confirmed and synced to PROMIS/N-PLM per month   |
| **Current Baseline**  | Legacy PM Planner baseline (to be measured in DISCOVER)                     |
| **Year 1 Target**     | 100% of resource planning done through IRIS with measurable efficiency gain |

### OMTM (One Metric That Matters)

**Current OMTM**: Planning cycle time (time from roadmap creation to confirmation)

### Growth Engine

**Selected Engine**: **Sticky** — Daily-use enterprise tool with high switching costs; focus on retention through superior UX and reliability.

---

## SWAT Team Formation

### Core Roles

| #   | AX Role | Primary Domain            | Key Responsibility for IRIS                               |
| --- | ------- | ------------------------- | --------------------------------------------------------- |
| 1   | **CEO** | Strategy + Business       | Samsung relationship, gate decisions, Lean Canvas         |
| 2   | **CPO** | Product + Validation      | IRIS backlog, hypothesis management, Samsung requirements |
| 3   | **CXO** | Experience + Design       | Mendix UI/UX, usability testing, design system            |
| 4   | **CAO** | AI + Analytics            | AI features, multi-dimensional analysis, data modeling    |
| 5   | **CDO** | Development + Data        | Mendix architecture, Oracle/ES design, integrations       |
| 6   | **COO** | Operations + Coordination | Sprint coordination, Samsung communication, deployment    |
| 7   | **AI**  | Code + Research + Docs    | 70%+ code generation, research, document drafting         |

---

## Ecosystem Mapping

### Cross-System Dependencies

| Direction         | System              | Type         | Data Flow                                  | Priority |
| ----------------- | ------------------- | ------------ | ------------------------------------------ | -------- |
| **Receives from** | N-PLM (Teamcenter)  | Master Data  | Product types, standard PM, project info   | High     |
| **Receives from** | SMDM                | Organization | Organization structure data                | High     |
| **Receives from** | GHRP                | Organization | HR/organization data                       | High     |
| **Sends to**      | PROMIS              | Profit Mgmt  | Confirmed resource roadmaps, PM schedules  | High     |
| **Sends to**      | N-PLM               | PM Data      | Confirmed PM planning/schedules            | High     |
| **Uses**          | Samsung AI Services | AI           | Excel PIVOT generation, AI-based reporting | Medium   |

### Data Flow Diagram

```
+------------------+     +------------------+     +------------------+
|   N-PLM          |     |   SMDM           |     |   GHRP           |
|   (Master Data)  |     |   (Organization)  |     |   (HR Data)      |
+--------+---------+     +--------+---------+     +--------+---------+
         |                         |                        |
         v                         v                        v
    +-----------------------------------------------------------------+
    |                                                                 |
    |                    IRIS (Mendix 10)                              |
    |                                                                 |
    |  +------------+  +------------+  +-------------+  +-----------+ |
    |  | Standard   |  | Resource   |  | Simulation  |  | Analysis  | |
    |  | P/M Mgmt   |  | Roadmap    |  | Engine      |  | & Reports | |
    |  +------------+  +------------+  +-------------+  +-----------+ |
    |                                                                 |
    |  +-------------------+  +------------------+                    |
    |  | Oracle 19c        |  | Elasticsearch 8  |                    |
    |  | (Transactional)   |  | (Analytical)     |                    |
    |  +-------------------+  +------------------+                    |
    +-----------+----------------------------+------------------------+
                |                            |
                v                            v
    +------------------+          +------------------+
    |   PROMIS         |          |   N-PLM          |
    |   (Profit Mgmt)  |          |   (PM Schedule)  |
    +------------------+          +------------------+
```

---

## AX Phase Plan

This project executes **DISCOVER** and **DESIGN** phases as the Amoza Production Team.

### Phase Sequence

```
00_INTRO (you are here)
    |
    v
01_DISCOVER ──> Gate 1 ──> 02_DESIGN ──> Gate 2 ──> 03_DEVELOP
    │                           │
    ├── D1: Research Plan       ├── S1: HMW Reframing
    ├── D2: Stakeholder         ├── S2: Concept Prototyping
    │       Interviews          ├── S3: Concept Validation
    ├── D3: Empathy Mapping     ├── S4: User Stories
    ├── D4: Persona Creation    ├── S5: Backlog Prioritization
    ├── D5: Problem Validation  ├── S6: Usability Testing
    ├── D6: Competitive Scan    └── S7: Gate 2 Review
    ├── D7: Assumption Mapping
    └── D8: Gate 1 Review
```

### Analysis Handoff (Design → Develop)

| #   | Deliverable           | Description                                                   |
| --- | --------------------- | ------------------------------------------------------------- |
| A1  | Business Modeling     | Capability map, actor model, use cases, business rules        |
| A2  | Data Modeling         | Oracle domain model, Elasticsearch indices, sync architecture |
| A3  | Process Modeling      | 13 business processes with flowcharts and state machines      |
| A4  | Solution Architecture | Mendix 10 stack, HA cluster, integration patterns             |
| A5  | Technical Backlog     | 13 epics (E01-E13) mapped to feature areas                    |

---

## What's Next?

**--> Go to [01_DISCOVER/README.md](../01_DISCOVER/README.md)**

The DISCOVER phase will validate the problem space through Samsung stakeholder interviews, empathy mapping, and competitive analysis. Key evidence needed for Gate 1:

- 5+ stakeholder interviews with Samsung DSR planners
- Validated personas (Resource Planner, Site Manager, Division Leader)
- Lean Canvas draft for IRIS
- Problem statement scoring >= 7/10 average

---

## References

| Resource              | Location                                                           |
| --------------------- | ------------------------------------------------------------------ |
| Task Description      | `.command/000_init_project/102_iris_analysis_design.md`            |
| Feature List          | `.command/000_init_project/input/features_list.txt`                |
| Samsung Expectations  | `.command/000_init_project/input/note.txt`                         |
| Solution Architecture | `.command/000_init_project/input/docs/01-solution-architecture.md` |
| Data Modeling         | `.command/000_init_project/input/docs/02-data-modeling.md`         |
| Business Modeling     | `.command/000_init_project/input/docs/03-business-modeling.md`     |
| Process Modeling      | `.command/000_init_project/input/docs/04-process-modeling.md`      |
| Data Sync / ETL       | `.command/000_init_project/input/docs/05-data-sync-etl.md`         |
| AX Framework Overview | `.ax/framework/01_AX_FRAMEWORK_OVERVIEW.md`                        |
| AX Quick Start        | `.ax/QUICK-START.md`                                               |

---

_IRIS by Amoza — Intelligent Resources Information System_
_AX Kit v3.0 — Amoza Transformation Kit_
