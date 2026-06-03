# Competitive / Build-vs-Buy Analysis — IRIS Resources Planning

> **AX Phase**: DISCOVER | **Template**: T12 — Competitive Analysis
> **Project**: IRIS (Intelligent Resource Information System)
> **Customer**: Samsung Electronics — Device Solutions Research (DSR)
> **Builder**: Amoza
> **Date**: 2026-03-21
> **Author**: CXO with AI assistance
> **Status**: Complete

---

## Metadata

| Field        | Value                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Project      | IRIS                                                                                               |
| Product      | IRIS by Amoza                                                                                      |
| Market       | Enterprise resource planning and workforce management software for semiconductor R&D organizations |
| Date         | 2026-03-21                                                                                         |
| Analyst      | CXO, Amoza                                                                                         |
| Last Updated | 2026-03-21                                                                                         |

---

## Market Overview

The enterprise resource and workforce planning market is valued at approximately $10-12B globally (2025), growing at a CAGR of 8-10% driven by AI integration, connected planning, and the shift from spreadsheet-based workforce management to purpose-built platforms. The semiconductor R&D segment represents a specialized niche where generic solutions consistently underperform due to unique organizational structures (production line hierarchies), multi-dimensional skill taxonomies, and tight integration requirements with proprietary manufacturing execution systems. Samsung Electronics, as the world's largest semiconductor manufacturer by revenue, operates at a scale and complexity that sits outside the design parameters of every commercial off-the-shelf (COTS) workforce planning platform. The current PM Planner (Mendix 7/8 era, running on Mendix 9.x) has reached end-of-life for Samsung's needs, creating an immediate replacement imperative aligned with Samsung's Mendix 10 standardization and new server infrastructure (QA April 2026, Production July 2026).

---

## Decision Context

Samsung DSR faces a critical inflection point. The current PM Planner has reached its limits: it cannot support concurrent editing, lacks version history, has no analytical engine, and cannot integrate cleanly with PROMIS or N-PLM for delta sync. Samsung has defined 13 specific requirements (Req 0-12) across 7 feature areas (F1-F7) that the successor system must satisfy.

The question is not _whether_ to act — the status quo is untenable — but _how_: build a new system from scratch (IRIS), adapt a commercial platform, or attempt an incremental upgrade of PM Planner.

### Samsung-Specific Requirements Summary

| Req    | Description                                                                                  |
| ------ | -------------------------------------------------------------------------------------------- |
| Req 0  | Upgrade to Mendix 10 with enhanced and new custom widgets                                    |
| Req 1  | Separate Resource Roadmap and Resource Simulation management                                 |
| Req 2  | Per-project version history with delta sync to PROMIS and N-PLM                              |
| Req 3  | Concurrent saving with auto-merge, conflict detection, and draft/permanent approval workflow |
| Req 4  | Roadmap and Simulation versioning (same pattern as Req 3)                                    |
| Req 5  | N-PLM bidirectional integration for master data management                                   |
| Req 6  | Factor Control — multi-dimensional filtering                                                 |
| Req 7  | Main screen renewal with world map and resource statistics per site                          |
| Req 8  | Analysis views — world map view, personal view                                               |
| Req 9  | HeadCount Portfolio — staffing plan and analysis view                                        |
| Req 10 | Analysis Reporting with periodic auto-email (Smart Notify)                                   |
| Req 11 | AI-Based Reporting using Samsung AI Services (Excel PIVOT generation)                        |
| Req 12 | Install and configure new QA/Prod servers with cluster architecture including Elasticsearch  |

### Feature Areas Summary

| ID  | Feature Area                               | Scope                                                                                                                            |
| --- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Master Data — Standard PM Management       | Organization structure, skill group structure, production types, standard PM dimensions, revision tracking, N-PLM/SMDM/GHRP sync |
| F2  | Project/Product Management                 | Project lifecycle, N-PLM bidirectional sync, actual PM tracking                                                                  |
| F3  | Resource Roadmap — Simulation and Planning | xDHTML Gantt roadmap, multi-dimension simulation, version management, concurrent planning                                        |
| F4  | HR Portfolio                               | World map with site-level resource status, plan vs. actual, optimization recommendations                                         |
| F5  | Actual vs Plan Gap Reporting               | Gap analysis dashboards, resource actual summary                                                                                 |
| F6  | Regular Reporting                          | Confirmed roadmap status, utilization reports, issue and action recommendations                                                  |
| F7  | AI for Intelligent Planning                | Samsung AI Services integration for intelligent resource planning and tracking                                                   |

---

## Competitor Categories

| Category                            | Description                                          | Examples                     |
| ----------------------------------- | ---------------------------------------------------- | ---------------------------- |
| Do Nothing                          | Keep current system with manual workarounds          | PM Planner + Excel           |
| Direct (COTS — ERP Extension)       | Enterprise platforms with workforce planning modules | SAP SuccessFactors / SAP IBP |
| Direct (COTS — Planning Platform)   | Connected planning platforms for resource allocation | Anaplan                      |
| Direct (COTS — Resource Management) | Portfolio and resource management platforms          | Planview                     |
| Indirect (COTS — IT Operations)     | IT operations with resource capacity features        | ServiceNow ITOM/SPM          |
| Alternative (COTS — Lightweight)    | General-purpose project management tools             | Microsoft Project / Planner  |
| Custom Build (Internal)             | Samsung internal IT builds without partner           | Samsung SDS / DSR IT         |
| Custom Build (Recommended)          | Purpose-built system by domain expert partner        | IRIS by Amoza                |

---

## Detailed Alternative Profiles

### Alternative 1: Status Quo — PM Planner + Excel Workarounds

| Attribute   | Detail                                                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| Description | Continue operating PM Planner (Mendix 9.x) supplemented by Excel spreadsheets for analytics, reporting, and simulation |
| Deployment  | Already deployed on Samsung infrastructure                                                                             |
| Cost        | Ongoing maintenance only (~$200-400K/year for Mendix license + internal support)                                       |
| Timeline    | Immediate (no change required)                                                                                         |

**Strengths**:

- Zero transition risk — planners already know the system
- No upfront investment required
- Existing PM data model remains intact
- No vendor selection or procurement process

**Weaknesses**:

- Cannot meet Req 1-4: No version history, no concurrent editing, no conflict resolution, no approval workflow
- Cannot meet Req 5-6: No N-PLM bidirectional integration, no factor control
- Cannot meet Req 7-9: No world map, no headcount portfolio, no analytical views
- Cannot meet Req 10-11: No automated reporting, no AI integration
- Mendix 9.x end-of-life approaching: Req 0 (Mendix 10 upgrade) unfulfilled
- Excel workarounds create data silos, version confusion, and manual reconciliation overhead
- Sends all projects to PROMIS (not delta sync per Req 2)
- Single-planner editing creates bottlenecks across 5 global sites

**UX Benchmark (CXO Assessment)**:

- Concurrent editing: Not supported. Planners must coordinate manually across time zones (Hwaseong, Austin, Xi'an). This is the single most damaging UX gap — it forces sequential workflows in a globally distributed team.
- Version diff: Not available. Planners cannot compare versions of resource plans. Changes are invisible until conflicts surface downstream in PROMIS.
- World map visualization: Absent. Site-level resource status requires manual compilation into Excel charts.
- Gantt interaction: Basic Mendix 9.x Gantt with limited interactivity. No drag-and-drop simulation, no inline editing, no real-time updates.

**Requirement Coverage**: 1 of 13 partially met (Req 12 — servers exist but need upgrade)

**Verdict**: **Not viable.** The status quo fails 12 of 13 requirements and imposes escalating operational cost through manual workarounds.

---

### Alternative 2: SAP SuccessFactors / SAP IBP

| Attribute       | Detail                                                                           |
| --------------- | -------------------------------------------------------------------------------- |
| Company         | SAP SE (FRA: SAP)                                                                |
| Founded         | 1972 (Walldorf, Germany)                                                         |
| Revenue         | ~$35B (total SAP, FY2025)                                                        |
| Employees       | ~107,000                                                                         |
| Product         | SAP SuccessFactors (Workforce Planning) + SAP IBP (Integrated Business Planning) |
| Target Market   | Global enterprises across all industries                                         |
| Pricing Model   | Enterprise license: $500K-$3M/year + $1-5M implementation                        |
| Deployment      | Cloud (SAP BTP) or hybrid                                                        |
| Market Position | Market leader in ERP, challenger in workforce planning                           |

**Key Features**: Workforce planning and headcount management, organizational structure modeling, budget-based resource allocation, SAP HCM integration, S&OP demand/supply planning (IBP), standard analytical dashboards

**Strengths**:

- Samsung already uses SAP for some enterprise functions — potential integration synergy
- Mature workforce planning with org hierarchy support
- Strong headcount budgeting and portfolio capabilities
- Global deployment experience at Samsung's scale
- Robust audit trail and compliance features

**Weaknesses**:

- No P/M dimension model: SAP workforce planning does not natively support Samsung's multi-dimensional PM structure (Stage > Block > Function > Activity > SW/HW > SwWorkItem). Requires extensive customization
- No Gantt-based resource roadmap: SAP IBP uses timeline views but not the xDHTML Gantt-style roadmap Samsung planners require
- No concurrent P/M editing: SuccessFactors does not support multi-planner concurrent edit with auto-merge and conflict resolution per Req 3
- No PROMIS delta sync: Would require custom integration to detect changes and send only deltas
- No N-PLM native integration: Samsung's N-PLM is proprietary; SAP connector would need to be built from scratch
- No Samsung AI Services integration: SAP has its own AI (Joule), but cannot connect to Samsung's internal AI services
- Rigid data model: Adapting SAP's standard workforce planning schema to Samsung's PM dimensions would be extremely expensive
- 12-18 month implementation timeline, far exceeding Samsung's Apr-Jul 2026 server window
- $3-8M total cost (license + implementation + ongoing customization)

**UX Benchmark (CXO Assessment)**:

- Concurrent editing: SAP uses record-level locking with a "check-out / check-in" paradigm. No real-time collaborative editing. Users see "locked by another user" messages — the opposite of the Google Docs-style concurrent experience Samsung needs.
- Version diff: SAP IBP has scenario comparison but at the aggregate level, not at the individual project or PM-cell granularity Samsung requires. No visual diff view for resource plans.
- World map visualization: SAP Analytics Cloud offers geo-visualization, but integrating it with SuccessFactors workforce data requires additional SAC licensing and configuration. Not a native experience.
- Gantt interaction: SAP IBP has basic timeline/Gantt views but they are designed for supply chain planning, not resource roadmap management. Limited interactivity compared to xDHTML Gantt's drag-and-drop, inline editing, and real-time collaboration features.

**Samsung-Specific Requirement Coverage**:

| Requirement                             | Coverage | Gap                                                          |
| --------------------------------------- | -------- | ------------------------------------------------------------ |
| Req 0: Mendix 10 + custom widgets       | N/A      | Platform switch entirely                                     |
| Req 1: Separate Roadmap & Simulation    | Weak     | IBP has scenarios but not Samsung's roadmap model            |
| Req 2: Per-project version + delta sync | None     | No PROMIS/N-PLM awareness                                    |
| Req 3: Concurrent save + auto-merge     | None     | Not designed for multi-planner concurrent PM editing         |
| Req 4: Roadmap & Simulation versioning  | Partial  | IBP version management uses a different paradigm             |
| Req 5: N-PLM integration                | None     | Proprietary Samsung system                                   |
| Req 6: Factor Control                   | Partial  | Has filtering but not Samsung's dimension model              |
| Req 7: Main screen (world map)          | Weak     | Standard dashboards, no ECharts world map                    |
| Req 8: Analysis views                   | Partial  | Analytics exist but not Samsung-specific views               |
| Req 9: HeadCount Portfolio              | Strong   | Native workforce planning strength — best fit among COTS     |
| Req 10: Analysis Reporting              | Partial  | Reporting exists but not Samsung's periodic auto-email model |
| Req 11: AI-Based Reporting              | None     | Uses SAP Joule, not Samsung AI Services                      |
| Req 12: New server setup                | Partial  | Cloud deployment model may conflict with on-prem requirement |

**Requirement Coverage Score**: 2 of 13 adequately met; 4 partially met; 7 not met

**Verdict**: **Poor fit.** SAP SuccessFactors/IBP's strength in headcount planning does not compensate for its inability to support Samsung's PM dimension model, concurrent editing requirements, and proprietary system integrations. Customization cost would likely exceed a clean custom build.

---

### Alternative 3: Anaplan

| Attribute       | Detail                                                             |
| --------------- | ------------------------------------------------------------------ |
| Company         | Anaplan (acquired by Thoma Bravo for $10.7B, 2022)                 |
| Founded         | 2006 (San Francisco, CA)                                           |
| Revenue         | ~$700M (FY2025, est.)                                              |
| Employees       | ~3,000                                                             |
| Product         | Anaplan Connected Planning Platform                                |
| Target Market   | Enterprise planning across finance, supply chain, workforce, sales |
| Pricing Model   | Platform license: $500K-$2M/year + implementation                  |
| Deployment      | Cloud-native (SaaS only)                                           |
| Market Position | Leader in connected planning; strong in scenario modeling          |

**Key Features**: HyperBlock multi-dimensional modeling engine, flexible model building, scenario comparison and what-if analysis, collaborative planning with role-based access, dashboard builder with charts and pivot tables, API integrations

**Strengths**:

- Flexible multi-dimensional modeling could theoretically accommodate Samsung's PM dimension structure
- Strong scenario/simulation capability aligns with Req 1 and Req 4
- Collaborative planning features support multi-user access
- Good visualization and reporting capabilities
- Fast model iteration compared to ERP customization

**Weaknesses**:

- Cloud-only (SaaS): Cannot be deployed on Samsung's on-premise servers per Req 12. Samsung's data sensitivity in semiconductor R&D likely prohibits cloud deployment
- No Gantt-based planning: Anaplan uses grid/table views, not xDHTML Gantt timeline visualization
- No concurrent edit with auto-merge: Anaplan's collaboration model uses locking, not the concurrent-save-auto-merge-conflict-resolve pattern (Req 3)
- No PROMIS/N-PLM integration: Would require custom API development
- No Samsung AI Services connection: Anaplan has its own PlanIQ AI, not Samsung's internal AI
- Performance at scale: Complex multi-dimensional models can become slow; Samsung's PM data across 5 sites with full dimension depth may hit limits
- "Build it yourself" complexity: Flexibility means Samsung must build every PM model, workflow, and view from scratch — essentially a custom build on a different platform
- No Elasticsearch: Analytical queries run against HyperBlock engine, may not match ES performance

**UX Benchmark (CXO Assessment)**:

- Concurrent editing: Anaplan uses cell-level locking within models. Multiple users can work in the same model but not the same cells simultaneously. No auto-merge or conflict resolution — last write wins or lock prevents edit. This falls short of the real-time collaborative pattern Samsung requires.
- Version diff: Anaplan supports model versioning and version comparison, but at the model level, not at Samsung's per-project PM granularity. No visual diff for individual resource plans.
- World map visualization: Anaplan has map chart capabilities in dashboards, but they are presentation-layer only — not interactive ECharts-level world maps with drill-down to site-specific resource data.
- Gantt interaction: Not available. Anaplan's strength is tabular/grid-based planning. No native Gantt widget exists. Users would need to export data to a separate Gantt tool, breaking the integrated workflow.

**Samsung-Specific Requirement Coverage**:

| Requirement                             | Coverage | Gap                                                    |
| --------------------------------------- | -------- | ------------------------------------------------------ |
| Req 0: Mendix 10                        | N/A      | Platform switch                                        |
| Req 1: Separate Roadmap & Simulation    | Moderate | Can model as separate Anaplan models                   |
| Req 2: Per-project version + delta sync | Weak     | Has versions but no PROMIS/N-PLM awareness             |
| Req 3: Concurrent save + auto-merge     | None     | Uses locking model                                     |
| Req 4: Roadmap & Simulation versioning  | Moderate | Supports model versions, different paradigm            |
| Req 5: N-PLM integration                | None     | Custom development required                            |
| Req 6: Factor Control                   | Strong   | Multi-dimensional filtering is Anaplan's core strength |
| Req 7: Main screen (world map)          | Weak     | No native world map, dashboard only                    |
| Req 8: Analysis views                   | Moderate | Dashboards available but not Samsung-specific views    |
| Req 9: HeadCount Portfolio              | Moderate | Can model headcount but must build from scratch        |
| Req 10: Analysis Reporting              | Moderate | Has reports, lacks Samsung's auto-email workflow       |
| Req 11: AI-Based Reporting              | None     | Anaplan PlanIQ, not Samsung AI Services                |
| Req 12: New server setup                | None     | Cloud-only SaaS — deployment blocker                   |

**Requirement Coverage Score**: 0 of 13 fully met; 5 partially met; 8 not met

**Verdict**: **Not viable.** Cloud-only deployment is likely a dealbreaker for Samsung's on-premise semiconductor R&D data requirements. Building Samsung's PM model in Anaplan would be equivalent effort to a custom build — on a platform that lacks Gantt visualization, concurrent editing, and Samsung system integrations.

---

### Alternative 4: Planview

| Attribute       | Detail                                                                   |
| --------------- | ------------------------------------------------------------------------ |
| Company         | Planview, Inc. (acquired by Thoma Bravo, 2023)                           |
| Founded         | 1989 (Austin, TX)                                                        |
| Revenue         | ~$400M (FY2025, est.)                                                    |
| Employees       | ~2,000                                                                   |
| Product         | Planview Portfolios + Planview PPM Pro                                   |
| Target Market   | Enterprise portfolio management, resource management, strategic planning |
| Pricing Model   | Enterprise license: $200K-$1.5M/year                                     |
| Deployment      | Cloud-first; limited on-premise option                                   |
| Market Position | Leader in portfolio management; strong in resource capacity planning     |

**Key Features**: Resource capacity planning and demand management, portfolio management with scenario analysis, time tracking and utilization dashboards, organizational hierarchy-based resource views, integration with Jira/ServiceNow/SAP, resource heatmaps and gap analysis

**Strengths**:

- Purpose-built for resource management — closer conceptual fit than ERP-based alternatives
- Good resource capacity visualization (heatmaps, utilization charts)
- Portfolio-level scenario comparison
- Integration marketplace with connectors
- On-premise option available (though cloud-preferred)

**Weaknesses**:

- Not designed for PM dimension model: Planview's resource model is role/skill-based, not Samsung's multi-dimensional PM structure
- No Gantt-based P/M planning: Resource views use grid/timeline but not detailed xDHTML Gantt-style planning
- No concurrent edit with auto-merge: Standard save/lock model
- No PROMIS/N-PLM integration: Samsung-proprietary systems not supported
- No Samsung AI Services: Uses own analytics
- No Elasticsearch backend: Analytical queries run on Planview's own engine
- Limited customization depth: Low-code extensions available but not as flexible as Mendix
- Weak on-premise support: Cloud-first architecture means on-prem receives less investment

**UX Benchmark (CXO Assessment)**:

- Concurrent editing: Planview uses pessimistic locking. When a resource manager opens a plan for editing, others are blocked. For Samsung's globally distributed planning teams working across Hwaseong, Pyeongtaek, Austin, Xi'an, and Giheung, this creates a serial workflow bottleneck that directly contradicts the concurrent planning vision.
- Version diff: Planview supports portfolio scenario comparison (side-by-side views of resource allocation across scenarios), which is conceptually similar to what Samsung needs but operates at the wrong granularity — portfolio level, not PM-cell level. No diff view for individual project resource changes.
- World map visualization: Planview has geographic resource views showing capacity by location, which is the closest COTS match to Samsung's Req 7. However, these are static dashboard widgets, not the interactive ECharts world map with drill-down, hover statistics, and real-time data that IRIS designs.
- Gantt interaction: Planview has Gantt-style timeline views for project scheduling, but they are project-management Gantt charts, not resource-planning Gantt charts. They show task dependencies and milestones, not PM allocation across dimensions over time.

**Samsung-Specific Requirement Coverage**:

| Requirement                             | Coverage | Gap                                             |
| --------------------------------------- | -------- | ----------------------------------------------- |
| Req 0: Mendix 10                        | N/A      | Platform switch                                 |
| Req 1: Roadmap & Simulation separation  | Moderate | Has portfolio scenarios, different paradigm     |
| Req 2: Per-project version + delta sync | Weak     | Portfolio versioning, no PROMIS delta           |
| Req 3: Concurrent save + auto-merge     | None     | Architecture gap                                |
| Req 4: Roadmap versioning               | Moderate | Scenario management, partial fit                |
| Req 5: N-PLM integration                | None     | Custom development                              |
| Req 6: Factor Control                   | Weak     | Basic filtering, not PM dimension depth         |
| Req 7: Main screen (world map)          | Weak     | Has dashboards, no ECharts world map            |
| Req 8: Analysis views                   | Moderate | Resource analytics available, adaptation needed |
| Req 9: HeadCount Portfolio              | Strong   | Core strength of Planview                       |
| Req 10: Analysis Reporting              | Moderate | Has reporting, limited auto-email               |
| Req 11: AI-Based Reporting              | None     | No Samsung AI Services                          |
| Req 12: New server setup                | Partial  | On-premise possible but not ideal               |

**Requirement Coverage Score**: 1 of 13 adequately met; 4 partially met; 8 not met

**Verdict**: **Poor fit.** Planview is conceptually closer to IRIS's purpose than ERP-based tools, but cannot accommodate Samsung's PM dimension model, concurrent editing pattern, or proprietary system integrations without extensive customization that negates the COTS advantage.

---

### Alternative 5: ServiceNow ITOM / SPM

| Attribute       | Detail                                                               |
| --------------- | -------------------------------------------------------------------- |
| Company         | ServiceNow, Inc. (NYSE: NOW)                                         |
| Founded         | 2003 (Santa Clara, CA)                                               |
| Revenue         | ~$10B (FY2025)                                                       |
| Employees       | ~22,000                                                              |
| Product         | ServiceNow ITOM / Strategic Portfolio Management (SPM)               |
| Target Market   | IT operations, enterprise service management, strategic planning     |
| Pricing Model   | Enterprise license: $300K-$2M/year per module                        |
| Deployment      | Cloud-native (SaaS); no true on-premise option                       |
| Market Position | Market leader in ITSM; expanding into strategic portfolio management |

**Key Features**: Resource capacity and demand management, portfolio project management, IT service management with CMDB, workflow automation engine (Flow Designer), standard reporting and dashboards, Integration Hub

**Strengths**:

- Powerful workflow automation could support approval processes (Req 3 partially)
- Samsung may already use ServiceNow for IT service management — familiarity
- Integration Hub has broad connector library
- Strong audit and compliance capabilities

**Weaknesses**:

- IT-centric, not R&D resource planning: ServiceNow ITOM is designed for IT capacity, not semiconductor R&D PM planning
- Cloud-only: No on-premise deployment — conflicts with Req 12
- No PM dimension model: Resource model is IT-oriented (services, applications, infrastructure)
- No Gantt planning: No native xDHTML Gantt-style resource timeline
- No concurrent P/M editing: Not designed for multi-planner simultaneous planning
- No PROMIS/N-PLM/Samsung AI integration: Samsung-proprietary systems not supported
- Wrong domain: Adapting an ITSM platform for semiconductor R&D resource planning would be a fundamental misuse
- Extremely expensive customization: ServiceNow consulting rates are among the highest in enterprise software

**UX Benchmark (CXO Assessment)**:

- Concurrent editing: ServiceNow uses form-level record locking (standard ITSM pattern). Designed for incident tickets, not multi-dimensional resource plans. The UX paradigm is fundamentally wrong — ticket-by-ticket editing vs. grid-based resource planning.
- Version diff: ServiceNow has audit logs and update history on individual records, but no concept of "version diff" across a resource plan containing thousands of PM cells. The audit trail is record-level, not plan-level.
- World map visualization: ServiceNow Service Mapping has topology views, but these show IT service dependencies, not geographic resource distribution. No ECharts-style world map.
- Gantt interaction: ServiceNow SPM has basic project timeline views, but they are rudimentary compared to xDHTML Gantt. No resource-level Gantt, no drag-and-drop PM allocation, no inline editing.

**Requirement Coverage**: 0 of 13 requirements met. Fundamental domain mismatch.

**Verdict**: **Not applicable.** ServiceNow ITOM is designed for IT operations management, not semiconductor R&D resource planning. Attempting to adapt it for IRIS would be a category error.

---

### Alternative 6: Microsoft Project / Planner

| Attribute       | Detail                                                           |
| --------------- | ---------------------------------------------------------------- |
| Company         | Microsoft Corporation (NASDAQ: MSFT)                             |
| Product         | Microsoft Project (Online/Server) + Microsoft Planner + Power BI |
| Target Market   | General-purpose project management across all industries         |
| Pricing Model   | $10-55/user/month (cloud) or enterprise license (on-premise)     |
| Deployment      | Cloud (M365) or on-premise (Project Server)                      |
| Market Position | Ubiquitous tool; market leader in general project management     |

**Key Features**: Gantt chart project scheduling, resource management and capacity planning, portfolio management (Project Server), Power BI integration for reporting, Microsoft 365 collaboration, Project Online for cloud access

**Strengths**:

- Familiar tool — most planners have used Microsoft Project
- Native Gantt chart visualization
- Low per-user cost compared to enterprise platforms
- Power BI provides strong analytical capabilities
- Project Server offers on-premise deployment option
- Microsoft 365 ecosystem integration (Teams, SharePoint, Outlook)

**Weaknesses**:

- Not designed for enterprise PM dimension model: Microsoft Project's resource model is task-assignment based, not Samsung's multi-dimensional PM structure
- No concurrent P/M editing with auto-merge: Uses file-level or record-level locking
- No version history with diff: No version comparison capability for resource plans
- No PROMIS/N-PLM integration: No Samsung-specific connectors
- No Samsung AI Services: Power BI has AI features, but not Samsung's Excel PIVOT AI
- Scaling limitations: Struggles with data volume and complexity of Samsung's multi-site, multi-dimension PM model
- Not a platform: Cannot build custom workflows (approval, conflict resolution) without separate development
- Consumer-grade perception: May not be taken seriously for Samsung's enterprise semiconductor R&D planning

**UX Benchmark (CXO Assessment)**:

- Concurrent editing: Microsoft Project Online supports multiple editors on a project plan, but uses last-write-wins conflict resolution — no auto-merge, no conflict detection UI, no diff view. Project Server (on-prem) uses check-out/check-in. Neither meets Samsung's Req 3 pattern.
- Version diff: Microsoft Project has no built-in version diff. Users must manually save copies and compare side-by-side. This is precisely the Excel-workaround pattern Samsung wants to eliminate.
- World map visualization: Not available natively. Power BI can create map visualizations, but they are disconnected from Project's resource data and require separate ETL.
- Gantt interaction: Microsoft Project has strong Gantt visualization for project scheduling, but it is task-and-dependency oriented, not resource-planning oriented. Samsung needs a PM allocation Gantt showing person-months across dimensions over time, not a task scheduling Gantt.

**Samsung-Specific Requirement Coverage**:

| Requirement                          | Coverage | Gap                                             |
| ------------------------------------ | -------- | ----------------------------------------------- |
| Req 0: Mendix 10                     | N/A      | Different platform                              |
| Req 1-4: Versioning, concurrent edit | None     | Architecture gap                                |
| Req 5-6: N-PLM, Factor Control       | None     | Not available                                   |
| Req 7: World map                     | None     | Power BI could approximate but disconnected     |
| Req 8-9: Analysis, HeadCount         | Weak     | Power BI visualizes but data model does not fit |
| Req 10: Reporting                    | Partial  | Power BI dashboards, no auto-email              |
| Req 11: AI Reporting                 | None     | Incompatible                                    |
| Req 12: Server setup                 | Partial  | Project Server is on-premise                    |

**Requirement Coverage Score**: 0 of 13 fully met; 2 partially met

**Verdict**: **Not viable.** Microsoft Project is a lightweight project management tool that cannot scale to Samsung's enterprise resource planning complexity, multi-dimensional PM model, or concurrent editing requirements.

---

### Alternative 7: Samsung Internal IT Custom Build (Without Amoza)

| Attribute   | Detail                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| Description | Samsung's internal IT organization (Samsung SDS or DSR IT team) builds IRIS from scratch without Amoza partnership |
| Platform    | Could use Mendix 10 or Samsung's preferred internal technology stack                                               |
| Team        | Samsung internal developers + contractors                                                                          |
| Timeline    | Estimated 12-18 months for comparable scope                                                                        |
| Cost        | $2-5M+ (internal team allocation + Mendix licenses + infrastructure)                                               |

**Strengths**:

- Full internal control — no external vendor dependency
- Deep understanding of Samsung's organizational structure, data, and processes
- Direct access to PROMIS, N-PLM, SMDM, GHRP APIs and documentation
- Existing Samsung SSO and security infrastructure
- Can align with Samsung's internal technology standards and governance
- IP stays entirely within Samsung

**Weaknesses**:

- Capacity constraint: Samsung internal IT teams are typically overcommitted across multiple projects — finding dedicated capacity is challenging
- Mendix 10 expertise gap: If Samsung IT lacks deep Mendix 10 experience, ramp-up time adds 2-4 months
- No PM Planner domain knowledge: Amoza has studied the current PM Planner extensively and understands the domain model, pain points, and user workflows
- Custom widget development: Building xDHTML Gantt and ECharts.js custom Mendix widgets requires specialized frontend expertise
- Concurrent editing architecture: Designing and implementing the concurrent-save-auto-merge-conflict-resolve pattern (Req 3) is architecturally complex
- Elasticsearch expertise: Designing the ES cluster with proper index strategy, hot/warm tiering, and multi-dimensional aggregation requires specialized skills
- Timeline risk: Internal projects at large corporations frequently slip due to competing priorities, organizational changes, and procurement delays. 12-18 months likely extends to 18-24 months
- Total cost may exceed Amoza partnership when fully accounting for internal developer costs and opportunity cost
- Innovation gap: Amoza brings external perspective and AI-first design thinking; internal teams tend to replicate existing patterns

**UX Benchmark (CXO Assessment)**:

- Concurrent editing: Samsung IT could implement this, but the architecture is the single most complex UX engineering challenge in IRIS. Without prior experience implementing Google Docs-style collaboration in Mendix, the learning curve is steep. Risk of falling back to pessimistic locking (which is what PM Planner already has).
- Version diff: Achievable by Samsung IT, but the diff visualization UX — showing cell-level changes across a multi-dimensional PM grid with color-coded additions, deletions, and modifications — requires careful UX design and frontend engineering expertise.
- World map visualization: ECharts.js integration within Mendix 10 as a pluggable widget is achievable but requires Mendix widget API expertise. Samsung IT may default to a simpler dashboard approach rather than the interactive drill-down experience.
- Gantt interaction: xDHTML Gantt as a custom Mendix 10 widget is specialized work. Samsung IT would likely evaluate alternative Gantt libraries or build a simpler timeline view, potentially compromising the user experience planners expect.

**Requirement Coverage**: Technically 12-13/13 achievable — the constraint is speed, cost, and execution quality, not capability.

**Verdict**: **Viable but suboptimal.** Samsung's internal IT could theoretically build IRIS, but faces significant capacity, expertise, and timeline risks. The concurrent editing architecture, Elasticsearch cluster design, custom widget development, and PM Planner domain knowledge represent months of ramp-up that Amoza has already invested.

---

### Alternative 8: IRIS by Amoza (Custom Build — Recommended)

| Attribute      | Detail                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| Builder        | Amoza                                                                     |
| Platform       | Mendix 10 + Oracle 19c + Elasticsearch 8.x                                |
| Visualization  | xDHTML Gantt (custom widget) + ECharts.js (custom widget)                 |
| Integrations   | PROMIS (delta sync), N-PLM (master data), Samsung AI Services, SMDM, GHRP |
| Infrastructure | Samsung on-premise servers (QA Apr 2026, Prod Jul 2026)                   |
| Timeline       | 6-9 months for full scope delivery                                        |
| Cost           | Amoza engagement + Mendix license + infrastructure                        |

**Strengths**:

- Purpose-built for Samsung DSR: Every feature designed for Samsung's PM dimension model, org hierarchy, and planning workflows
- PM Planner domain expertise: Amoza has studied PM Planner's data model, pain points, and user expectations
- Concurrent editing architecture designed: Auto-merge, conflict detection, and diff view with WebSocket real-time sync
- Elasticsearch expertise: Cluster architecture with hot/warm tiering, proper index strategy, multi-dimensional aggregation
- Custom widget capability: xDHTML Gantt and ECharts.js Mendix 10 pluggable widgets are a core competency
- Version engine designed: Generic versioning with diff, snapshot management, and PROMIS delta sync logic
- All 13 requirements addressable with solution architecture explicitly mapping to Req 0-12 and F1-F7
- AX Framework methodology: Structured discovery, design, and delivery reduces risk
- AI integration ready: Samsung AI Services connector for AI-based Excel PIVOT generation (Req 11)
- On-premise deployment aligned with Samsung's server infrastructure
- Faster timeline: 6-9 months vs. 12-18 months for COTS customization or internal build

**Weaknesses**:

- External vendor dependency: Samsung relies on Amoza for delivery and ongoing enhancements
- Amoza is a startup: Less established than SAP, Microsoft, or ServiceNow — execution risk
- Knowledge concentration: Domain knowledge concentrated in Amoza team — knowledge transfer essential
- Mendix platform dependency: IRIS inherits Mendix platform constraints and licensing costs

**UX Benchmark (CXO Assessment)**:

- Concurrent editing: Purpose-designed with WebSocket-based real-time synchronization, edit lock records at the PM-cell level, optimistic concurrency with auto-merge for non-conflicting changes, and a conflict resolution UI showing side-by-side diff with pass/overwrite options. This is the only alternative that directly addresses Samsung's core UX pain point.
- Version diff: Full diff visualization showing cell-level changes across the PM grid with color-coded additions (green), deletions (red), and modifications (amber). Snapshot comparison between any two versions. Draft vs. permanent version comparison for the approval workflow.
- World map visualization: Interactive ECharts.js world map as a Mendix 10 pluggable widget, showing Samsung's 5 global sites with drill-down to site-level resource statistics, plan vs. actual overlays, and real-time data from Elasticsearch aggregations.
- Gantt interaction: xDHTML Gantt as a custom Mendix 10 pluggable widget with drag-and-drop timeline management, inline PM allocation editing, milestone visualization (MTO, KO, ES, CS, SRA), zoom levels (month/quarter/year), and real-time updates reflecting concurrent edits from other planners.

**Samsung-Specific Requirement Coverage**:

| Requirement                                     | Coverage | Notes                                             |
| ----------------------------------------------- | -------- | ------------------------------------------------- |
| Req 0: Mendix 10 + custom widgets               | **Full** | Core platform choice                              |
| Req 1: Separate Roadmap & Simulation + versions | **Full** | M11 + M12 modules designed                        |
| Req 2: Per-project version + delta sync         | **Full** | M03 Version Engine + M30 PROMIS Connector         |
| Req 3: Concurrent save + auto-merge + conflict  | **Full** | WebSocket sync + conflict resolution architecture |
| Req 4: Roadmap & Simulation versioning          | **Full** | M03 Version Engine applies to both                |
| Req 5: N-PLM integration                        | **Full** | M31 NPLMConnector designed                        |
| Req 6: Factor Control                           | **Full** | M05 FactorControl module                          |
| Req 7: Main screen renewal (world map)          | **Full** | W04 WorldMapWidget + M23                          |
| Req 8: Analysis views                           | **Full** | M20 + M23 + M24                                   |
| Req 9: HeadCount Portfolio                      | **Full** | M13 HeadCountPortfolio                            |
| Req 10: Analysis Reporting                      | **Full** | M21 + M32 SmartNotify                             |
| Req 11: AI-Based Reporting                      | **Full** | M22 AIReporting + Samsung AI Services             |
| Req 12: New server setup                        | **Full** | Cluster architecture designed for QA/Prod         |

**Requirement Coverage Score**: 13 of 13 fully addressed

**Verdict**: **Recommended.** IRIS by Amoza is the only alternative that addresses all 13 requirements with purpose-built architecture, domain-specific design, and a delivery timeline aligned with Samsung's server availability.

---

## Feature Comparison Matrix

> Rating scale: **Full** = complete coverage, **Strong** = good coverage with minor gaps, **Moderate** = partial coverage requiring customization, **Weak** = minimal coverage requiring significant work, **None** = not available

### Coverage Against Feature Areas (F1-F7)

| Feature Area                          | IRIS (Amoza) | Status Quo | SAP SF/IBP | Anaplan  | Planview | ServiceNow | MS Project | Samsung IT Build |
| ------------------------------------- | :----------: | :--------: | :--------: | :------: | :------: | :--------: | :--------: | :--------------: |
| **F1: Master Data — Standard PM**     |     Full     |    Weak    |    Weak    | Moderate |   Weak   |    None    |    None    |  Full (slower)   |
| **F2: Project/Product Management**    |     Full     |  Moderate  |  Moderate  | Moderate | Moderate |    Weak    |    Weak    |  Full (slower)   |
| **F3: Resource Roadmap — Simulation** |     Full     |    None    |    Weak    | Moderate | Moderate |    None    |    Weak    |  Full (slower)   |
| **F4: HR Portfolio (world map)**      |     Full     |    None    |  Moderate  |   Weak   | Moderate |    None    |    None    |  Full (slower)   |
| **F5: Actual vs Plan Gap Reporting**  |     Full     |    None    |  Moderate  | Moderate |  Strong  |    None    |    Weak    |  Full (slower)   |
| **F6: Regular Reporting**             |     Full     |    None    |  Moderate  | Moderate | Moderate |    Weak    |  Moderate  |  Full (slower)   |
| **F7: AI for Intelligent Planning**   |     Full     |    None    |    None    |   None   |   None   |    None    |    None    |     Moderate     |

### Coverage Against Requirements (Req 0-12)

| Requirement                                 | IRIS (Amoza) | Status Quo | SAP SF/IBP | Anaplan  | Planview | ServiceNow | MS Project | Samsung IT Build |
| ------------------------------------------- | :----------: | :--------: | :--------: | :------: | :------: | :--------: | :--------: | :--------------: |
| **Req 0**: Mendix 10 + widgets              |     Full     |    None    |    N/A     |   N/A    |   N/A    |    N/A     |    N/A     |       Full       |
| **Req 1**: Roadmap & Sim separation         |     Full     |    None    |    Weak    | Moderate | Moderate |    None    |    None    |       Full       |
| **Req 2**: Per-project version + delta sync |     Full     |    None    |    None    |   Weak   |   Weak   |    None    |    None    |       Full       |
| **Req 3**: Concurrent save + auto-merge     |     Full     |    None    |    None    |   None   |   None   |    None    |    None    |       Full       |
| **Req 4**: Roadmap versioning               |     Full     |    None    |  Moderate  | Moderate | Moderate |    None    |    None    |       Full       |
| **Req 5**: N-PLM integration                |     Full     |    None    |    None    |   None   |   None   |    None    |    None    |       Full       |
| **Req 6**: Factor Control                   |     Full     |    None    |  Moderate  |  Strong  |   Weak   |    None    |    None    |       Full       |
| **Req 7**: World map + stats                |     Full     |    None    |    Weak    |   Weak   |   Weak   |    None    |    None    |       Full       |
| **Req 8**: Analysis views                   |     Full     |    None    |  Moderate  | Moderate | Moderate |    None    |    Weak    |       Full       |
| **Req 9**: HeadCount Portfolio              |     Full     |    None    |   Strong   | Moderate |  Strong  |    None    |    None    |       Full       |
| **Req 10**: Analysis Reporting              |     Full     |    None    |  Moderate  | Moderate | Moderate |    Weak    |  Moderate  |       Full       |
| **Req 11**: AI-Based Reporting              |     Full     |    None    |    None    |   None   |   None   |    None    |    None    |     Moderate     |
| **Req 12**: Server setup (on-prem)          |     Full     |  Partial   |  Partial   |   None   | Partial  |    None    |  Partial   |       Full       |
| **Requirements Met (Full)**                 |    **13**    |   **0**    |   **0**    |  **0**   |  **0**   |   **0**    |   **0**    |      **12**      |
| **Requirements Partially Met**              |    **0**     |   **1**    |   **5**    |  **5**   |  **5**   |   **1**    |   **3**    |      **1**       |

---

## Positioning Map

**X-Axis**: Generic Resource Management <---> Samsung-Specific Resource Planning

**Y-Axis**: Legacy / Manual <---> Modern / AI-Integrated

```
  Modern / AI-Integrated
        ^
        |
        |   IRIS by Amoza ★
        |
        |          Samsung IT Build
        |
  SAP ---+--- Anaplan
        |
  Planview
        |
  ServiceNow
        |
        |                  PM Planner (Status Quo)
  MS Project
        |
        v
  Legacy / Manual

  <--- Generic ---+--- Samsung-Specific --->
```

| Alternative                 | X-Position                 | Y-Position             | Quadrant                                                 |
| --------------------------- | -------------------------- | ---------------------- | -------------------------------------------------------- |
| **IRIS by Amoza**           | Samsung-Specific           | Modern / AI-Integrated | **Top-Right: Samsung-native + AI-ready**                 |
| **Samsung IT Build**        | Samsung-Specific           | Legacy to Moderate     | **Right-Center: Samsung-native but slower to modernize** |
| **Status Quo (PM Planner)** | Samsung-Specific           | Legacy / Manual        | **Bottom-Right: Samsung-native but outdated**            |
| **SAP SF/IBP**              | Generic                    | Moderate               | **Center-Left: Enterprise standard but generic**         |
| **Anaplan**                 | Generic                    | Moderate               | **Center-Left: Flexible but generic**                    |
| **Planview**                | Generic (resource-focused) | Moderate               | **Center: Resource-centric but generic**                 |
| **ServiceNow**              | Generic (IT-focused)       | Moderate               | **Far-Left: Wrong domain entirely**                      |
| **Microsoft Project**       | Generic                    | Legacy                 | **Bottom-Left: Consumer-grade**                          |

**Key Insight**: Only IRIS by Amoza and Samsung Internal IT Build occupy the "Samsung-Specific" side of the map. All COTS platforms sit on the "Generic" side, requiring extensive customization to reach Samsung's needs. IRIS by Amoza additionally occupies the "Modern / AI-Integrated" quadrant, while Samsung IT Build would likely start more conservatively.

---

## Build-vs-Buy Evaluation Matrix

### Weighted Scoring Model

Criteria weights reflect Samsung DSR's stated priorities: requirement coverage, timeline to production, Samsung system integration, and deployment model.

| Criteria                            | Weight | IRIS (Amoza) | Status Quo | SAP SF/IBP | Anaplan  | Planview | ServiceNow | MS Project | Samsung IT |
| ----------------------------------- | -----: | :----------: | :--------: | :--------: | :------: | :------: | :--------: | :--------: | :--------: |
| **Requirement Coverage (Req 0-12)** |    25% |      10      |     1      |     3      |    3     |    3     |     1      |     2      |     9      |
| **Feature Coverage (F1-F7)**        |    20% |      10      |     2      |     4      |    4     |    5     |     1      |     2      |     8      |
| **Samsung System Integration**      |    15% |      10      |     3      |     2      |    1     |    1     |     1      |     1      |     10     |
| **Timeline to Production**          |    15% |      8       |     10     |     3      |    3     |    3     |     2      |     4      |     4      |
| **On-Premise Deployment**           |    10% |      10      |     10     |     5      |    1     |    5     |     1      |     7      |     10     |
| **Total Cost of Ownership (3yr)**   |     5% |      7       |     9      |     3      |    4     |    5     |     3      |     8      |     5      |
| **Customization Depth**             |     5% |      10      |     3      |     4      |    7     |    4     |     3      |     2      |     10     |
| **Vendor Risk**                     |     5% |      5       |     8      |     10     |    7     |    7     |     10     |     10     |     9      |
| **Weighted Score**                  |   100% |   **9.35**   |  **3.70**  |  **3.25**  | **3.00** | **3.35** |  **1.30**  |  **2.70**  |  **7.85**  |
| **Rank**                            |        |   **1st**    |  **3rd**   |  **5th**   | **6th**  | **4th**  |  **8th**   |  **7th**   |  **2nd**   |

### Scoring Notes

- **IRIS by Amoza (9.35)**: Highest score driven by complete requirement coverage, Samsung-specific integration design, and competitive timeline. Only weakness is vendor risk (startup).
- **Samsung IT Build (7.85)**: Second-highest — can theoretically match IRIS on coverage and integration, but loses on timeline (12-18 months vs. 6-9 months) and feature area F7 (AI integration).
- **Status Quo (3.70)**: Third place only because it scores high on timeline (already deployed) and cost — but critically fails on requirement coverage.
- **All COTS platforms (1.30-3.35)**: Score poorly because Samsung's requirements are highly specific and proprietary. Customizing any COTS platform to meet Samsung's needs would exceed a custom build in both cost and timeline.

---

## PM Planner Component Audit: Reuse vs. Build Fresh

### Components to Reuse (with adaptation)

| Component                               | Reuse Approach                                                                                                             | Effort Saved                                       | Risk                                     |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------- |
| **PM domain model concepts**            | Reuse the dimensional structure (Stage > Block > Function > Activity > SW/HW > SwWorkItem) as requirements input, not code | High — avoids re-discovering domain model          | Low — concepts validated by years of use |
| **Organization hierarchy data**         | Migrate org structure data (Production Line > Site > Team > Group > Part) to new Oracle 19c schema                         | Medium — data migration vs. re-entry               | Low — straightforward data migration     |
| **Standard PM reference data**          | Migrate standard production type data, milestone definitions, and PM reference tables                                      | Medium — preserves institutional knowledge         | Low — data validation needed             |
| **Project/product master data**         | Migrate active project records; reconcile with N-PLM as source of truth                                                    | Medium                                             | Medium — data quality issues possible    |
| **User roles and permissions model**    | Reuse role definitions (Admin, Manager, Planner, Viewer) as basis for IRIS RBAC                                            | Low — roles well-defined but implementation is new | Low                                      |
| **Business rules and validation logic** | Document existing PM validation rules, range checks, and business constraints as requirements for IRIS                     | Medium — avoids re-discovering business rules      | Low — may need updating                  |

### Components to Build Fresh

| Component                   | Reason for Rebuild                                                                                                                | IRIS Approach                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Mendix application code** | Mendix 9.x to 10.x is a major version change; PM Planner's pages, microflows, and nanoflows are tightly coupled to old data model | New Mendix 10 application from scratch                                      |
| **Custom widgets**          | Current widgets built for Mendix 9.x; xDHTML Gantt and ECharts.js need Mendix 10 pluggable widget API                             | New W01-W05 custom widgets                                                  |
| **Database schema**         | PM Planner schema lacks versioning tables, ES sync tables, approval workflow states, concurrent edit metadata                     | New Oracle 19c snowflake schema                                             |
| **Integration layer**       | PM Planner sends all projects to PROMIS (not delta); limited N-PLM sync                                                           | New M30-M33 integration modules                                             |
| **Analytics engine**        | PM Planner has no Elasticsearch; analytics are application-level queries                                                          | New ES cluster + M20-M24 analysis modules                                   |
| **UI/UX design**            | PM Planner's UI is functional but dated; Req 7 mandates main screen renewal                                                       | New UI with world map, analytical views, Gantt                              |
| **Concurrent editing**      | Does not exist in PM Planner                                                                                                      | New WebSocket architecture with edit locks, auto-merge, conflict resolution |
| **Version engine**          | Does not exist in PM Planner                                                                                                      | New M03 VersionEngine with diff capability                                  |
| **Notification system**     | PM Planner has no Smart Notify capability                                                                                         | New M32 SmartNotify for periodic auto-email                                 |
| **AI reporting**            | Does not exist in PM Planner                                                                                                      | New M22 AIReporting with Samsung AI Services                                |

### Reuse Summary

| Category                                 | Reuse          | Build Fresh |
| ---------------------------------------- | -------------- | ----------- |
| Domain knowledge and data model concepts | Yes            | --          |
| Reference and master data                | Yes (migrate)  | --          |
| Business rules (as requirements)         | Yes (document) | --          |
| Application code                         | --             | 100% new    |
| Custom widgets                           | --             | 100% new    |
| Database schema                          | --             | 100% new    |
| Integrations                             | --             | 100% new    |
| Analytics                                | --             | 100% new    |
| UI/UX                                    | --             | 100% new    |
| Concurrent editing                       | --             | 100% new    |
| Version engine                           | --             | 100% new    |

**Assessment**: PM Planner's value to IRIS is primarily as a _source of domain knowledge and reference data_, not reusable code. The dimensional PM model, org hierarchy, and standard PM reference data should be preserved through data migration. All technical implementation is new. IRIS is a rebuild, not an upgrade.

---

## CXO UX Patterns Worth Adopting

Beyond the competitive alternatives evaluated above, several best-in-class products from other domains demonstrate UX patterns directly relevant to IRIS's core challenges. As CXO, these are the patterns I recommend studying and adapting.

### Concurrent Editing: Google Docs / Google Sheets

**What they do well**:

- Real-time cursor presence — every active user's cursor and selection is visible, color-coded by user
- Character-level operational transformation — changes merge seamlessly without locks
- Inline change attribution — hover over any cell to see who changed it and when
- Conflict-free by design — the system merges automatically; users only see conflicts when genuinely ambiguous

**What IRIS should adopt**:

- Presence indicators showing which planners are active in the same resource plan, which cells they are editing
- Auto-merge for non-conflicting PM cell changes (different planners editing different projects/dimensions)
- Conflict UI only surfaces when two planners edit the same PM cell — not locking the entire plan
- Change attribution at the PM-cell level so managers can see who allocated what

**Adaptation for IRIS**: Google Docs operates on text; IRIS operates on a multi-dimensional numeric grid. The operational transformation algorithm must work on PM-cell coordinates (project x dimension x month) rather than character positions. The conceptual pattern transfers, but the implementation is domain-specific.

### Version History and Diff: GitHub

**What they do well**:

- Pull request diff view — side-by-side comparison with additions (green), deletions (red), and modifications highlighted
- Line-by-line commenting on changes — reviewers can discuss specific changes
- Branch/version history with clear lineage — every version has a parent, creating an auditable chain
- Merge conflict resolution UI — when automatic merge fails, a clear 3-way merge view shows "theirs," "yours," and "base"

**What IRIS should adopt**:

- Side-by-side diff view for resource plan versions showing PM-cell changes with color coding
- The draft-to-permanent approval workflow should feel like a "pull request review" — the manager sees exactly what changed, can comment, and approves or requests changes
- Version lineage visualization showing the chain from initial roadmap through simulation iterations to confirmed plan
- The conflict resolution UI for Req 3 should present a GitHub-style 3-way merge: "Your change," "Their change," "Last saved version"

**Adaptation for IRIS**: GitHub diffs operate on lines of code; IRIS diffs operate on PM grid cells. The visual pattern (color-coded additions/deletions/modifications) transfers directly. The review workflow (draft > review > approve > merge/permanent) maps cleanly to Samsung's draft/permanent approval process.

### Real-time Collaboration: Figma

**What they do well**:

- "Multiplayer" presence — see other users' cursors and selections on the canvas in real time
- Follow mode — click on another user's avatar to follow their viewport
- Component-level editing — multiple designers can work on different components simultaneously without conflict
- Observation mode — stakeholders can watch designers work without interfering

**What IRIS should adopt**:

- Planner presence on the resource roadmap Gantt — see which planners are viewing/editing which project timelines
- Follow mode for managers — a department head can "follow" a planner's view to understand their planning decisions in context
- Component-level concurrency — planners work on different projects within the same roadmap without locking each other out
- View-only observation mode for executives reviewing plans without edit risk

**Adaptation for IRIS**: Figma's canvas is 2D spatial; IRIS's "canvas" is a multi-dimensional PM grid viewed through Gantt and table views. The presence and follow patterns transfer conceptually, but the viewport is defined by filters (site, team, project, dimension) rather than x/y coordinates.

### Data Visualization: Tableau / Power BI

**What they do well**:

- Interactive drill-down — click on an aggregate to see the underlying detail
- Filter cascading — selecting a dimension value (e.g., "Austin site") updates all connected visualizations simultaneously
- Dashboard composition — multiple chart types (bar, line, heatmap, map) on a single screen, all driven by the same data source
- Natural language queries — "Show me resource utilization for Hwaseong in Q3" returns a visualization

**What IRIS should adopt**:

- Interactive drill-down on the world map: click a site marker to see department-level resource allocation, click a department to see project-level
- Connected filter cascading across IRIS's analysis views: selecting a production line filters the world map, Gantt, headcount portfolio, and reporting views simultaneously
- Multi-chart dashboards for the analysis views (Req 8) combining heatmaps, bar charts, and trend lines

**Adaptation for IRIS**: IRIS uses Elasticsearch as the analytical backend and ECharts.js for visualization. The interaction patterns from Tableau/Power BI should be implemented through ES aggregation queries and ECharts event handlers within the Mendix pluggable widget framework.

### Notification and Workflow: Slack / Microsoft Teams

**What they do well**:

- Contextual notifications — not just "something changed" but "Planner Kim updated PM allocation for Project X, Hwaseong, Q3 2026 — 3 cells modified"
- Action buttons in notifications — approve, reject, or view diff directly from the notification without navigating to the application
- Thread-based discussion on specific changes — keep the conversation attached to the change, not in a separate channel
- Smart digest — batch low-priority notifications into a daily summary, escalate high-priority immediately

**What IRIS should adopt**:

- Smart Notify (Req 10) should include contextual detail: what changed, who changed it, and a direct link to the diff view
- The draft-to-permanent approval notification should include an embedded summary of changes with one-click approve/reject
- Weekly digest emails for analysis reporting should summarize key metrics (plan vs. actual gaps, utilization trends) rather than attaching raw data

**Adaptation for IRIS**: IRIS's M32 SmartNotify module should implement notification templates with embedded data summaries, supporting both email delivery (Samsung's primary channel) and potential future in-app notifications.

---

## Competitive Threats to the Build Decision

| #   | Threat                                                | Probability (H/M/L) | Impact (H/M/L) | Response Strategy                                                                                                                             |
| --- | ----------------------------------------------------- | :-----------------: | :------------: | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Samsung IT proposes internal build after Amoza starts |          M          |       H        | Demonstrate early velocity in Sprint 1-2; involve Samsung IT in architecture reviews; position Amoza as acceleration partner, not replacement |
| 2   | SAP offers bundled SuccessFactors deal to Samsung DS  |          L          |       M        | Demonstrate that SAP cannot meet Req 3 (concurrent edit) and Req 11 (Samsung AI) without equivalent custom build effort                       |
| 3   | Scope creep from Samsung DSR stakeholders             |          H          |       M        | AX Framework phase gates; formal change management; prioritized backlog with Samsung product owner                                            |
| 4   | Budget reduction mid-project                          |          L          |       H        | Phased delivery — each sprint delivers usable functionality; minimum viable scope defined                                                     |
| 5   | Samsung AI Services delayed or cancelled              |          M          |       L        | IRIS AI reporting (Req 11) is a modular feature; core system delivers value without AI                                                        |
| 6   | Mendix 10 introduces breaking changes or limitations  |          L          |       M        | Early prototype validation; custom Java actions as escape hatches; Amoza Mendix expertise                                                     |

---

## Risk Assessment

### Risks of Choosing IRIS by Amoza

| #   | Risk                            | Probability | Impact |  Severity  | Mitigation                                                                                       |
| --- | ------------------------------- | :---------: | :----: | :--------: | ------------------------------------------------------------------------------------------------ |
| 1   | Amoza delivery delay            |      M      |   H    |  **High**  | Phased delivery with clear milestones; sprint-based progress tracking; Samsung QA from Sprint 1  |
| 2   | Amoza business continuity       |      M      |   H    |  **High**  | Source code escrow; knowledge transfer to Samsung team; Mendix platform ensures continuity       |
| 3   | Concurrent editing complexity   |      M      |   M    | **Medium** | Technical spike in Sprint 1; fallback to pessimistic locking; incremental complexity             |
| 4   | Elasticsearch performance       |      L      |   M    | **Medium** | Performance testing in QA (Apr 2026); index strategy with hot/warm tiering; capacity planning    |
| 5   | Samsung AI Services instability |      M      |   L    |  **Low**   | AI reporting is separable (M22); can be added later without blocking core functionality          |
| 6   | Integration API access barriers |      M      |   M    | **Medium** | Early integration spikes; API documentation review in Sprint 0; fallback to batch file exchange  |
| 7   | Mendix 10 platform limitations  |      L      |   H    | **Medium** | Custom Java actions for escape hatches; custom widgets for UI gaps; Amoza Mendix expertise       |
| 8   | User adoption resistance        |      M      |   M    | **Medium** | User involvement in design phase; training program; phased rollout by site; power user champions |

### Risks of NOT Choosing IRIS

| #   | Risk                                                                                                   | Impact |
| --- | ------------------------------------------------------------------------------------------------------ | ------ |
| 1   | Continued operational inefficiency — planners waste time waiting and reconciling across 5 global sites | High   |
| 2   | Data quality degradation — Excel workarounds create version confusion and reconciliation errors        | High   |
| 3   | PROMIS sync overhead — sending all projects instead of deltas wastes bandwidth and creates noise       | Medium |
| 4   | No analytical capability — no multi-dimensional resource analysis or automated reports                 | High   |
| 5   | Mendix 9.x end-of-life — forcing migration under pressure                                              | Medium |
| 6   | COTS customization trap — 12-24 month projects delivering compromised functionality at higher cost     | High   |

---

## Differentiation Summary

### What IRIS Does Better

- Addresses 13/13 Samsung requirements vs. 0/13 for any COTS platform
- Concurrent editing with auto-merge and conflict resolution — no COTS alternative offers this for resource planning
- Samsung AI Services integration for intelligent Excel PIVOT generation — impossible with COTS AI engines
- PROMIS delta sync (only changed projects synced) — eliminates current waste of syncing all projects

### What IRIS Does Differently

- Purpose-built for Samsung's PM dimension model (Stage > Block > Function > Activity > SW/HW > SwWorkItem) — not adapted from a generic resource or workforce model
- Combines xDHTML Gantt (resource timeline) + ECharts.js (world map, analytics) + Elasticsearch (analytical engine) within Mendix 10 — a unique technology combination tailored to Samsung's needs
- Draft/permanent version workflow with manager approval — maps directly to Samsung's organizational governance, not a generic approval engine

### Gaps IRIS Fills

- Concurrent multi-planner editing across 5 global sites (currently impossible)
- Per-project version history with visual diff (currently non-existent)
- World map with real-time resource statistics per site (currently manual Excel compilation)
- Automated periodic analysis reporting via Smart Notify (currently manual)
- AI-powered Excel PIVOT generation via Samsung AI Services (new capability)

### Defensible Moats

- PM Planner domain knowledge — Amoza has invested significant effort understanding Samsung's unique resource planning model, pain points, and workflows. This domain knowledge cannot be quickly replicated by a COTS vendor or new internal team.
- Architecture head start — solution architecture, data model, integration design, and ES cluster architecture are already designed. This represents months of effort that would need to be repeated by any alternative.
- Custom Mendix 10 widget expertise — xDHTML Gantt and ECharts.js pluggable widgets for Mendix 10 are specialized capabilities that require both Mendix platform knowledge and frontend engineering skills.
- Concurrent editing architecture — the WebSocket-based optimistic concurrency with auto-merge and conflict resolution pattern has been designed specifically for Samsung's PM grid. This is architecturally the most complex component and the hardest to replicate.

---

## Final Recommendation

### Decision: Build IRIS as a New System with Amoza

**Rationale**:

1. **No COTS platform fits Samsung's needs.** Samsung's requirements are fundamentally Samsung-specific: the PM dimension model (Stage > Block > Function > Activity > SW/HW > SwWorkItem), the concurrent-save-auto-merge-conflict-resolve editing pattern, PROMIS delta sync, N-PLM integration, and Samsung AI Services. No commercial platform supports even half of these without extensive customization that equals or exceeds the cost and timeline of a custom build.

2. **Custom build is the only path to 13/13 requirement coverage.** Both IRIS by Amoza (13/13) and Samsung Internal IT Build (12-13/13) can theoretically meet all requirements. All COTS alternatives achieve 0/13 full coverage.

3. **Amoza offers faster delivery than Samsung internal build.** Amoza has already invested in architecture design (solution architecture, data model, integration architecture, ES cluster design), PM Planner domain analysis, and custom widget prototyping. This head start translates to an estimated 6-9 month delivery vs. 12-18 months for Samsung internal build.

4. **The PM Planner cannot be upgraded — it must be replaced.** The gap between PM Planner's current capabilities and Req 0-12 is too wide for incremental enhancement. Concurrent editing (Req 3), version engine (Req 1-2), Elasticsearch analytics (Req 8-10), and world map UI (Req 7) are architectural changes that require a new foundation.

5. **Risk is manageable.** Amoza startup risk is mitigated by Mendix platform continuity (Samsung retains the platform regardless of vendor), source code ownership, and phased delivery with Samsung QA involvement. The highest technical risks (concurrent editing, ES performance) can be validated early through technical spikes.

### Key Differentiators No Off-the-Shelf Solution Provides

| #   | Differentiator                                                                            | Why It Matters                                                                                                                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Samsung PM Dimension Model** (Stage > Block > Function > Activity > SW/HW > SwWorkItem) | This multi-level dimensional structure is unique to Samsung semiconductor R&D. No COTS product models resources this way. Every alternative would require rebuilding its data model — which is equivalent to a custom build.                                               |
| 2   | **Concurrent Editing with Auto-Merge and Conflict Resolution**                            | Samsung's 5 global sites need planners to work simultaneously on the same resource plans. No COTS resource planning tool supports Google Docs-style concurrent editing. This is an architectural differentiator, not a feature gap.                                        |
| 3   | **PROMIS Delta Sync**                                                                     | Samsung's PROMIS profit system needs to receive only changed projects, not the full dataset. This per-project change detection with selective sync is a Samsung-proprietary integration that no COTS product addresses.                                                    |
| 4   | **N-PLM Bidirectional Integration**                                                       | Samsung's N-PLM is the master data source for projects and products. Bidirectional sync (N-PLM to IRIS for master data, IRIS to N-PLM for confirmed plans) requires a custom connector that understands Samsung's data model.                                              |
| 5   | **Samsung AI Services Integration**                                                       | Req 11 specifies Samsung's own AI services for Excel PIVOT generation — not SAP Joule, not Anaplan PlanIQ, not Microsoft Copilot. This is a Samsung-internal capability that only a custom build can integrate.                                                            |
| 6   | **Draft/Permanent Approval Workflow**                                                     | Samsung's governance requires that certain user roles save as Draft, with manager approval required to promote to Permanent. This is not a generic approval workflow — it is tied to the version engine, diff view, and notification system in a Samsung-specific pattern. |
| 7   | **Mendix 10 Platform Compliance**                                                         | Samsung's IT standards mandate Mendix 10. This eliminates all non-Mendix alternatives from consideration and means the build must be on Mendix 10 — which is exactly what IRIS by Amoza delivers.                                                                          |

### Recommended Next Steps

| Priority | Action                                                              | Owner                    | Timeline |
| -------- | ------------------------------------------------------------------- | ------------------------ | -------- |
| 1        | Finalize IRIS scope and prioritize features for Phase 1 delivery    | Samsung DSR + Amoza      | Week 1-2 |
| 2        | Execute concurrent editing technical spike to validate architecture | Amoza Engineering        | Week 2-4 |
| 3        | Confirm PROMIS, N-PLM, SMDM, GHRP API access and documentation      | Samsung IT               | Week 1-3 |
| 4        | Set up Mendix 10 development environment and CI/CD pipeline         | Amoza + Samsung IT       | Week 1-2 |
| 5        | Begin QA server provisioning (target: April 2026)                   | Samsung TA               | Ongoing  |
| 6        | Define data migration plan for PM Planner reference data            | Amoza + Samsung Planners | Week 3-5 |
| 7        | Validate Samsung AI Services API availability and capabilities      | Samsung AI Team + Amoza  | Week 4-6 |

---

## Key Takeaways

| #   | Takeaway                                                                                                                                                                                                                                                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Samsung's requirements are too specific for any COTS platform.** The PM dimension model, concurrent editing pattern, PROMIS delta sync, and Samsung AI integration create a unique combination that no commercial product addresses. Customizing a COTS platform would cost more and take longer than a purpose-built system.                                 |
| 2   | **The real competition is Samsung's internal IT team, not SAP or Anaplan.** Samsung could build IRIS internally, but Amoza's head start in architecture, domain analysis, and Mendix + ES expertise translates to a 6-12 month time advantage.                                                                                                                  |
| 3   | **PM Planner is a knowledge source, not a code source.** The dimensional PM model and reference data should be preserved through data migration, but 100% of the technical implementation is new. IRIS is a rebuild, not an upgrade.                                                                                                                            |
| 4   | **Concurrent editing is the hardest technical requirement and the strongest differentiator.** Req 3 (concurrent save, auto-merge, conflict detect/resolve) is architecturally the most complex feature. It is also the feature that no COTS alternative can provide, making it IRIS's most defensible differentiator. Validate via technical spike in Sprint 1. |
| 5   | **UX patterns from Google Docs, GitHub, and Figma should inform IRIS design.** The best UX references for IRIS's core challenges (concurrent editing, version diff, real-time collaboration) come from software development and design tools, not from competing resource planning platforms.                                                                   |
| 6   | **The build decision's biggest risk is delivery, not direction.** Custom build is clearly the right approach. The risk is whether Amoza can deliver on scope, quality, and timeline. Phased delivery, Samsung QA involvement, and early technical validation mitigate this risk.                                                                                |

---

## Related Templates

- **T08_PROBLEM_STATEMENT** -- Validated problems in competitive context
- **T14_CONCEPT_SKETCH** -- Solution concepts vs. competition

## Related Guides

- **D6_COMPETITIVE_ANALYSIS_GUIDE** -- Detailed guidance on competitive research methodology and positioning strategy

---

_This document follows the AX Transformation Framework T12 Competitive Analysis template, adapted for build-vs-buy analysis._
_Analysis should be updated if Samsung requirements change or new alternative solutions emerge._
_Next step: Validate critical assumptions (D7 Assumptions Register) and execute technical spikes for highest-risk features._

_Part of the AX Transformation Framework guide system v2.0.0 -- Amoza, March 2026_
