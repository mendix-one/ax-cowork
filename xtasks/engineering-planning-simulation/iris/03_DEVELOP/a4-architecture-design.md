# A4 — Architecture Design & Decision Document

> **Product**: IRIS (Intelligent Resource Information System)
> **Customer**: Samsung Electronics — Device Solutions (DS) Division
> **AX Phase**: Analysis Handoff (DESIGN → DEVELOP bridge)
> **Owner**: CDO (Architecture) + CXO (UX Impact)
> **Date**: 2026-03-22
> **Status**: Accepted

---

## Table of Contents

1. [Architecture Decision Records (ADRs)](#1-architecture-decision-records-adrs)
2. [System Architecture Diagram](#2-system-architecture-diagram)
3. [Technology Stack Specification](#3-technology-stack-specification)
4. [Module Architecture](#4-module-architecture)
5. [API Design](#5-api-design)
6. [Security Architecture](#6-security-architecture)
7. [Infrastructure & Deployment](#7-infrastructure--deployment)
8. [Performance & Scalability](#8-performance--scalability)
9. [CXO UX Architecture Considerations](#9-cxo-ux-architecture-considerations)

---

## 1. Architecture Decision Records (ADRs)

Eight formal ADRs document the key technical decisions for IRIS. Each ADR follows the AX v2.0.0 format: Status, Context, Decision, Alternatives Considered, Consequences, and CXO UX Impact.

---

### ADR-001: Platform Selection — Mendix 10

**Status:** Accepted
**Date:** 2026-03-22
**Decision Makers:** CDO, CXO, Samsung IT

#### Context

IRIS requires a full-featured enterprise application with complex UI (Gantt charts, analytical dashboards, world maps), multi-user concurrent editing, approval workflows, and integration with Samsung internal systems (N-PLM, PROMIS, Samsung AI Services). Samsung Electronics DS Division has an existing enterprise license for the Mendix platform and mandates its use for internal tool development. The platform must support custom widget integration (xDHTML Gantt, ECharts.js) and Java-based extensions for performance-critical operations.

#### Decision

Use **Mendix 10** as the application platform. All business logic, UI pages, workflows, and data access are built in Mendix. Custom Java Actions are used only where Mendix microflows cannot meet performance targets (conflict detection, bulk sync operations). Custom pluggable widgets wrap third-party JavaScript libraries (xDHTML Gantt, ECharts.js).

#### Alternatives Considered

| Alternative                     | Pros                                                           | Cons                                                                                     | Why Not                                                                                 |
| ------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Custom Java/Spring Boot + React | Full control, no platform constraints, unlimited customization | 3-4x longer development timeline, requires larger team, no visual workflow builder       | Does not meet Samsung's low-code mandate; timeline exceeds QA April 2026 target         |
| OutSystems                      | Strong low-code, good performance, reactive web apps           | No existing Samsung license, migration cost, different ecosystem                         | Samsung has Mendix license; switching platforms adds procurement delay and vendor risk  |
| Microsoft Power Platform        | Strong Microsoft ecosystem integration, low-code               | Weak custom widget support, limited Java extensibility, no xDHTML Gantt integration path | Cannot support custom Gantt/ECharts widgets; Samsung ecosystem is not Microsoft-centric |

#### Consequences

**Positive:**

- Leverages existing Samsung Mendix license — zero additional platform cost
- Low-code accelerates UI/workflow development by 40-60% vs custom code
- Built-in user management, SSO integration, role-based access
- Visual microflow engine reduces business logic development time
- Mendix Marketplace provides pre-built modules (REST, email, Excel export)

**Negative:**

- Platform constraints limit some UI patterns (custom CSS/JS required for complex layouts)
- Mendix runtime adds ~50-100ms overhead per request vs native Java
- Custom widget development requires React + Mendix Pluggable Widget API knowledge
- Vendor lock-in — business logic encoded in Mendix microflows is not portable

**Risks:**

- Mendix version upgrade (10.x minor versions) may break custom widgets → Mitigation: pin Mendix Studio Pro version, test widgets against each upgrade in QA before production
- Performance ceiling for complex aggregations → Mitigation: offload analytics to Elasticsearch (ADR-002)

#### CXO UX Impact

- Mendix Atlasv3 design system provides consistent Samsung-branded UI components out of the box
- Page load times are acceptable (< 2s) for form-based screens; custom widgets add 200-500ms initial render for Gantt/ECharts
- Responsive layouts support desktop (primary) and tablet (secondary) — Mendix handles breakpoints natively
- Design system customization is achievable via SCSS theme overrides for Samsung brand colors and typography

---

### ADR-002: Database Dual-Store Strategy — Oracle 19c + Elasticsearch 8.x

**Status:** Accepted
**Date:** 2026-03-22
**Decision Makers:** CDO, CAO

#### Context

IRIS serves two fundamentally different query patterns: (1) transactional CRUD operations for plan editing, roadmap management, and workflow state, requiring ACID compliance and referential integrity; (2) multi-dimensional analytical aggregations across 500K+ resource allocation records, requiring sub-second slice/dice/drill-down/roll-up across 8+ dimensions (site, department, project, time period, job grade, skill category, business unit, division). A single database cannot optimally serve both patterns. Oracle 19c is the Samsung standard RDBMS.

#### Decision

Adopt a **dual-store architecture**: **Oracle 19c** as the transactional system of record (OLTP) and **Elasticsearch 8.x** as the analytical query engine (OLAP-like). Oracle is the single source of truth — all writes go to Oracle first. Elasticsearch contains denormalized read-optimized projections derived from Oracle data via event-driven sync with nightly catch-up reconciliation. Eventual consistency (1-5 second lag) is acceptable for analytical views.

#### Alternatives Considered

| Alternative                                     | Pros                                                            | Cons                                                                                                                                                        | Why Not                                                                                                      |
| ----------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Oracle-only (materialized views + partitioning) | Single database, simpler ops, strong consistency                | Materialized views cannot match ES aggregation speed at scale; Oracle full-text search is limited; 12-table joins for every dashboard query are prohibitive | Dashboard queries at 500K+ records would exceed 5s latency target; no slice/dice flexibility                 |
| PostgreSQL + TimescaleDB                        | Open source, time-series optimized, good aggregation            | Not Samsung standard RDBMS; requires Mendix JDBC connector customization; no Samsung DBA team expertise                                                     | Samsung mandate is Oracle; PostgreSQL not approved for DS Division production use                            |
| Oracle + Apache Solr                            | Oracle + proven search engine, Samsung has some Solr experience | Solr aggregation framework is weaker than ES; bucket/metric aggregations less flexible; community momentum has shifted to ES                                | ES aggregation pipeline (composite, nested, scripted) is significantly superior for IRIS analytics use cases |
| Oracle + ClickHouse (columnar OLAP)             | Excellent aggregation speed, column-oriented                    | New technology for Samsung team; no Mendix connector; limited ecosystem                                                                                     | Team expertise gap; no Mendix integration path; adds operational complexity                                  |

#### Consequences

**Positive:**

- Oracle ACID transactions guarantee data integrity for plan editing and approval workflows
- ES aggregation queries return in < 500ms for dashboards with 500K+ documents
- Denormalized ES documents eliminate the 12-table join at query time — pre-joined at sync time
- ES supports geo_point fields for WorldMap widget with built-in geo aggregations
- Index lifecycle management (hot/warm) optimizes storage cost for historical data

**Negative:**

- Dual-store adds operational complexity (two systems to monitor, back up, and maintain)
- Data sync introduces eventual consistency — analytical views may lag 1-5 seconds behind edits
- Denormalization means data duplication — master data changes require full reindex of affected indices
- Development team must understand both Oracle SQL and ES Query DSL

**Risks:**

- Data drift between Oracle and ES → Mitigation: nightly reconciliation with count verification, automated reindex on mismatch > 0.1%
- ES cluster failure → Mitigation: 3 master-eligible nodes, replica shards, circuit breaker in sync worker; Oracle continues serving transactional reads
- Sync queue backlog during high-volume imports → Mitigation: circuit breaker pattern, batch processing (500 docs/bulk), admin monitoring dashboard

#### CXO UX Impact

- Dashboard responsiveness is the primary UX benefit — users see sub-second chart updates when filtering by site, department, or time period
- "Data as of: [timestamp]" indicator on all analytical views sets correct user expectation for eventual consistency
- Transactional screens (P/M plan editor, roadmap editor) always show real-time data from Oracle — no stale data risk during editing
- WorldMap widget benefits from ES geo_point aggregations for fast site-level resource counts

---

### ADR-003: Concurrent Editing Model — WebSocket + Optimistic Locking

**Status:** Accepted
**Date:** 2026-03-22
**Decision Makers:** CDO, CXO

#### Context

The P/M Planner module (M10) requires concurrent editing by multiple planners on the same plan. Samsung DSR has 50+ planners across 5 sites who may edit overlapping plans during monthly planning cycles. The system must detect conflicts at the project-row level, provide real-time presence awareness (who is editing what), and offer clear conflict resolution (auto-merge for non-overlapping changes, user-driven resolution for overlapping changes). The target is < 10 concurrent editors per plan with < 100ms presence update latency.

#### Decision

Use **WebSocket connections for real-time presence and edit synchronization** combined with **optimistic locking** for conflict detection at save time. When a user opens a plan, a WebSocket channel is established. Edit events are broadcast to all connected users in real-time. On save, the system compares the user's base version against the current version — auto-merges non-conflicting changes (different project rows) and presents a diff dialog for conflicts (same project row modified by multiple users). Conflict resolution options: Pass (discard own changes) or Overwrite (keep own changes).

#### Alternatives Considered

| Alternative                                    | Pros                                                               | Cons                                                                                                                       | Why Not                                                                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Pessimistic locking (lock entire plan on open) | Eliminates conflicts entirely; simple implementation               | Only one user can edit at a time; blocks planners at remote sites; terrible UX for 50+ concurrent planners                 | Samsung explicitly requires concurrent editing; pessimistic locking is a workflow blocker                                                |
| CRDT (Conflict-Free Replicated Data Types)     | True real-time co-editing like Google Docs; no conflicts by design | Extremely complex to implement for structured grid data; Mendix has no CRDT support; overkill for monthly planning cadence | Implementation complexity far exceeds value; P/M plans are edited monthly not continuously; Mendix platform cannot support CRDT natively |
| HTTP polling (no WebSocket)                    | Simpler server-side; works with standard HTTP infrastructure       | High latency for presence updates (5-30s polling); higher server load; no real-time feel                                   | Does not meet < 100ms presence update target; creates poor UX — users unknowingly overwrite each other's work                            |
| Operational Transform (OT)                     | Proven for real-time text editing (Google Docs)                    | Complex for structured data (grid cells vs text); requires custom OT engine; no Mendix support                             | Over-engineered for grid-based data; IRIS edits are cell-level values, not character-level text                                          |

#### Consequences

**Positive:**

- Multiple planners can edit the same plan simultaneously without blocking
- Real-time presence indicators show who is editing which rows — reduces accidental conflicts
- Auto-merge handles the common case (different planners editing different project rows) transparently
- Optimistic locking is simpler to implement than CRDT/OT while covering all IRIS use cases
- Conflict resolution UI (DiffViewer widget W03) gives users full control over resolution

**Negative:**

- WebSocket connections consume server resources — each connection holds a thread (mitigated by Mendix 10 async improvements)
- Requires WebSocket-aware load balancer configuration (sticky sessions or session affinity)
- Conflict resolution adds cognitive load for users when conflicts do occur
- Testing concurrent editing scenarios requires specialized test tooling

**Risks:**

- WebSocket connection drops (network instability) → Mitigation: auto-reconnect with exponential backoff; unsaved changes preserved in client-side buffer; reconnect merges buffer with current server state
- High concurrent editor count (> 10 per plan) → Mitigation: soft limit warning at 10 editors; WebSocket broadcasts scale linearly — tested up to 15 connections per plan
- Merge conflicts in complex plans → Mitigation: row-level granularity (not cell-level) reduces conflict frequency; most plans have < 5 concurrent editors

#### CXO UX Impact

- Presence indicators (colored cursors or row highlights with user names) give planners confidence that their work is safe
- Auto-merge for non-overlapping changes is invisible to users — the ideal experience
- Conflict resolution dialog (DiffViewer W03) shows side-by-side comparison with clear "Pass" / "Overwrite" actions — designed for non-technical planners
- < 100ms WebSocket latency means presence updates feel instantaneous — no "ghost editing" anxiety
- Connection status indicator (connected/reconnecting/disconnected) provides transparency

---

### ADR-004: Version Engine Design — Generic Snapshot-Based Versioning

**Status:** Accepted
**Date:** 2026-03-22
**Decision Makers:** CDO, CPO

#### Context

Three IRIS modules require version management: Resource Roadmap (M11), P/M Planner (M10), and Resource Simulation (M12). Each must support creating versions, comparing versions (diff), and managing version lifecycle (Draft → Review → Approved → Archived). Samsung requires a complete audit trail — once a version is approved, it is immutable. The version engine must also support delta detection for PROMIS integration (sync only changed projects between versions).

#### Decision

Implement a **generic, snapshot-based Version Engine (M03)** that serves all three planning modules. Each version captures a full snapshot of the planning data at that point in time. The engine provides: (1) version creation with auto-incrementing version numbers per plan; (2) snapshot storage in Oracle (version metadata + associated allocation records); (3) diff computation between any two versions of the same plan; (4) immutability enforcement for approved versions; (5) delta extraction for PROMIS sync. The Version Engine is a Mendix module with reusable microflows callable by M10, M11, and M12.

#### Alternatives Considered

| Alternative                                                       | Pros                                                                      | Cons                                                                                                                             | Why Not                                                                                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Per-module versioning (separate version logic in each module)     | Simpler initial implementation; modules are independent                   | Code duplication across 3 modules; inconsistent version behavior; triple maintenance cost                                        | Violates DRY principle; Samsung audit requirements demand consistent versioning across all plan types                                  |
| Event sourcing (store change events, replay to reconstruct state) | Perfect audit trail; can reconstruct any point in time; efficient storage | High implementation complexity; Mendix has no event sourcing framework; query performance for current state requires projections | Over-engineered for IRIS use case; snapshot-based versioning meets all requirements with 80% less complexity                           |
| Database temporal tables (Oracle Flashback / bitemporal)          | Database-native; no application-level version management                  | Limited diff capability; no business-level version lifecycle (Draft/Review/Approved); Oracle Flashback retention limits          | Does not support approval workflow states; diff computation at application level is needed for PROMIS delta sync and DiffViewer widget |

#### Consequences

**Positive:**

- Single codebase for versioning logic — one fix/enhancement benefits all three modules
- Consistent user experience across Roadmap, P/M Planner, and Simulation version management
- Snapshot model enables straightforward diff computation (compare two full snapshots)
- Delta extraction for PROMIS sync is a direct diff between current and last-synced snapshots
- Immutability enforcement at the engine level prevents accidental modification of approved versions

**Negative:**

- Full snapshots consume more storage than delta-based or event-sourced approaches (mitigated by Oracle tablespace management)
- Large plans (1000+ allocation rows) may have slower snapshot creation times (mitigated by bulk insert)
- Generic engine must handle entity-type-specific diff display (different columns for Roadmap vs P/M vs Simulation)

**Risks:**

- Storage growth for plans with many versions → Mitigation: archive policy — auto-archive versions older than 2 fiscal years; archived versions moved to Oracle tablespace with lower-cost storage
- Diff performance for large versions → Mitigation: diff computed on server-side (Java Action) with indexed comparison keys; target < 2s for 1000-row versions

#### CXO UX Impact

- Consistent version management UI across all planning screens reduces learning curve — same patterns for version creation, comparison, and approval everywhere
- DiffViewer widget (W03) shows side-by-side comparison with highlighted additions (green), deletions (red), and modifications (yellow) — intuitive for Samsung planners
- Version timeline visualization lets users trace the evolution of a plan — builds trust in the planning process
- "Version approved — no further changes allowed" messaging is clear and prevents user confusion

---

### ADR-005: Gantt Widget Approach — xDHTML Gantt in Mendix 10

**Status:** Accepted
**Date:** 2026-03-22
**Decision Makers:** CDO, CXO

#### Context

IRIS requires timeline visualization for three use cases: Resource Roadmap (multi-year project timeline), P/M Planner (monthly resource allocation grid), and Resource Simulation (what-if timeline scenarios). The visualization must support: drag-and-drop task editing, resource grouping, zoom levels (month/quarter/year), color-coded allocation percentages, and integration with the concurrent editing system (WebSocket updates). Samsung's existing resource planning tools use Gantt-style views; user familiarity is critical.

#### Decision

Use **xDHTML Gantt** (by DHTMLX) wrapped as a **Mendix 10 Pluggable Widget (W01)**. The widget receives data via a REST endpoint (`/api/gantt/tasks`), renders the Gantt chart using the xDHTML library, and communicates user interactions (task drag, resize, edit) back to Mendix via nanoflow callbacks. WebSocket integration enables real-time updates when other users modify the same plan.

#### Alternatives Considered

| Alternative                             | Pros                                                      | Cons                                                                                                     | Why Not                                                                                                                 |
| --------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Bryntum Gantt                           | Modern API, excellent performance, TypeScript support     | Expensive per-developer license ($4,990/dev); no proven Mendix integration; smaller community            | License cost for 6+ developers is prohibitive; no existing Mendix Pluggable Widget wrapper available                    |
| Custom React Gantt (built from scratch) | Full control, no license cost, exact Samsung requirements | 4-8 weeks development time for a production-quality Gantt; complex scroll/zoom/drag implementation       | Timeline risk — custom Gantt development would consume the entire Sprint 1-2 capacity; xDHTML has 15+ years of maturity |
| ag-Grid (timeline mode)                 | Excellent grid performance, good Mendix integration path  | Timeline mode is secondary feature; not a true Gantt — lacks dependencies, critical path, resource views | ag-Grid is a data grid, not a Gantt chart; cannot render project timelines, dependencies, or resource groupings         |
| Syncfusion Gantt                        | Feature-rich, good documentation, reasonable pricing      | Less proven in Mendix ecosystem; React wrapper quality uncertain; community is smaller than DHTMLX       | Risk of integration issues with Mendix Pluggable Widget API; DHTMLX has more Mendix deployment references               |

#### Consequences

**Positive:**

- xDHTML Gantt is a mature library (15+ years, v8.0+) with extensive documentation and examples
- Proven integration pattern with Mendix via Pluggable Widget API — reference implementations exist
- Rich feature set: task drag/resize, resource grouping, zoom, export to PDF/PNG, critical path
- Reasonable license cost (per-application, not per-developer)
- Active community and responsive vendor support

**Negative:**

- xDHTML Gantt CSS conflicts with Mendix Atlas theme — requires custom SCSS overrides for visual consistency
- Widget initialization adds 200-500ms to page load (library + data fetch + render)
- Complex configuration (30+ config options) requires dedicated widget development effort
- Mendix pluggable widget lifecycle events differ from standard React — requires careful state management

**Risks:**

- xDHTML Gantt version upgrade breaks Mendix widget → Mitigation: pin library version, test upgrades in QA environment before production deployment
- Performance with large datasets (500+ tasks visible) → Mitigation: virtual rendering (xDHTML supports smart rendering), pagination by time range, lazy loading
- Accessibility compliance → Mitigation: keyboard navigation is supported by xDHTML; ARIA labels added via custom widget wrapper

#### CXO UX Impact

- Gantt view is the most critical UI element for Samsung planners — it must feel native and responsive
- Drag-and-drop task editing reduces clicks by 60% vs form-based editing for timeline changes
- Color-coded allocation percentages (green: < 80%, yellow: 80-100%, red: > 100%) provide instant visual feedback on resource utilization
- Zoom levels (month/quarter/year) allow planners to switch between tactical and strategic views seamlessly
- Real-time WebSocket updates show other users' changes appearing in the Gantt — collaborative planning feel

---

### ADR-006: AI Integration Strategy — Samsung AI Services REST API (Deferred to v2.0)

**Status:** Accepted
**Date:** 2026-03-22
**Decision Makers:** CDO, CAO, CPO

#### Context

Samsung AI Services provides AI-powered Excel PIVOT generation and analytical reporting capabilities. IRIS could use these services for intelligent report generation, demand forecasting, and resource optimization recommendations. However, the Samsung AI Services API is still maturing, the integration contract is not yet finalized, and IRIS v1.0 must deliver core planning functionality (P/M, Roadmap, Simulation, Analysis) by July 2026. Adding AI integration to v1.0 introduces scope risk.

#### Decision

**Defer full AI integration to IRIS v2.0.** For v1.0, implement the **AIReporting module (M22) with a clean REST client interface** that can be connected to Samsung AI Services when the API contract is finalized. The M22 module includes: (1) a configurable REST client with endpoint/auth settings manageable via Mendix admin page; (2) a standard request/response format for sending aggregated data and receiving analysis results; (3) a placeholder UI for AI-generated reports with manual trigger. For v1.0, M22 will be marked as "Coming Soon" in the navigation.

#### Alternatives Considered

| Alternative                                     | Pros                                                        | Cons                                                                                                                        | Why Not                                                                                          |
| ----------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Full AI integration in v1.0                     | Differentiating feature; Samsung AI team can validate early | API contract not finalized; adds 4-6 weeks to timeline; risk of rework if API changes                                       | Timeline risk — IRIS v1.0 must ship by July 2026; unstable API means potential rework            |
| No AI module at all                             | Simplest; zero AI risk                                      | No integration point for v2.0; harder to add AI later; Samsung expects AI capability roadmap                                | Samsung stakeholders expect to see AI capability planned; architectural preparation costs little |
| Embed open-source ML (scikit-learn, TensorFlow) | No dependency on Samsung AI Services; local inference       | Mendix Java runtime is not suited for ML inference; model management complexity; Samsung prefers their AI Services platform | Samsung mandate is to use Samsung AI Services, not external ML frameworks                        |

#### Consequences

**Positive:**

- Eliminates AI integration risk from v1.0 timeline — focus on core planning functionality
- M22 module provides clean integration architecture for v2.0 — REST client, request/response format, UI placeholder
- Samsung AI team has time to finalize API contract before IRIS v2.0 development begins
- "Coming Soon" UI communicates AI capability roadmap to users without over-promising

**Negative:**

- v1.0 ships without AI-powered reporting — may disappoint stakeholders expecting AI features
- Competitors with AI features may appear more advanced in v1.0 timeframe
- M22 module development effort is partially "throwaway" if Samsung AI Services API differs significantly from assumed contract

**Risks:**

- Samsung AI Services API contract changes significantly → Mitigation: M22 uses adapter pattern — API contract changes only affect the adapter layer, not the rest of the module
- Stakeholder pushback on deferral → Mitigation: present clear AI roadmap for v2.0 with timeline; demonstrate M22 architecture readiness

#### CXO UX Impact

- "Coming Soon" badge on AI Reporting menu item sets user expectations clearly
- V1.0 analysis reporting (M21) still provides full manual analysis with ECharts visualizations — no functionality gap for core use cases
- When AI integration arrives in v2.0, the UX will be seamless — users trigger AI analysis from the same reporting screen, results appear inline
- Samsung planners are accustomed to manual Excel PIVOT generation — v1.0 maintains this workflow while v2.0 automates it

---

### ADR-007: Data Sync Architecture — Event-Driven + Nightly Catch-Up

**Status:** Accepted
**Date:** 2026-03-22
**Decision Makers:** CDO, CAO

#### Context

The dual-store architecture (ADR-002) requires a reliable mechanism to synchronize data from Oracle 19c (source of truth) to Elasticsearch 8.x (analytical projection). The sync must handle: (1) real-time user edits appearing in dashboards within seconds; (2) master data changes from N-PLM affecting all denormalized documents; (3) recovery from ES cluster outages without data loss; (4) verifiable consistency between Oracle and ES. The data volume is estimated at 500K+ allocation records across 4 ES indices.

#### Decision

Implement a **hybrid sync architecture** combining **event-driven sync** (primary, 1-5 second latency) with **nightly full sync** (catch-up and reconciliation at 02:00 AM daily). Event-driven sync uses a **SyncQueue table in Oracle** populated by After-Commit events in Mendix. A **Sync Worker** (Mendix scheduled event, every 30 seconds) processes the queue, builds denormalized ES documents (joining 12 Oracle tables), and indexes via ES Bulk API. Nightly full sync catches any missed events, verifies Oracle-ES count consistency, and triggers automatic reindex if drift exceeds 0.1%.

#### Alternatives Considered

| Alternative                                   | Pros                                                           | Cons                                                                                                                                           | Why Not                                                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Oracle GoldenGate / CDC (Change Data Capture) | Near-real-time, database-level capture, no application changes | Requires additional Oracle license (GoldenGate); Samsung IT approval for CDC tooling; captures raw row changes without denormalization context | Denormalization requires application-level knowledge (12-table joins); CDC captures row-level changes that must still be enriched before ES indexing; additional license cost |
| Batch-only sync (every 15 minutes)            | Simple implementation; no event infrastructure                 | 15-minute lag unacceptable for dashboard responsiveness after plan saves; users expect near-instant feedback                                   | Samsung planners save a P/M plan and immediately check the dashboard — 15-minute lag breaks this workflow                                                                     |
| Kafka / message queue based sync              | Durable, scalable, replay capability, industry standard        | Adds infrastructure complexity (Kafka cluster); Samsung DS Division does not run Kafka; Mendix has no native Kafka producer                    | Infrastructure overhead not justified for IRIS scale (500K documents, not billions); adds operational burden on Samsung IT team                                               |
| Direct ES writes (dual-write from Mendix)     | Lowest latency — ES updated in same request as Oracle          | No ACID guarantee across both stores; partial writes leave systems inconsistent; complex error handling                                        | Dual-write anti-pattern — if Oracle commit succeeds but ES write fails, data is inconsistent; SyncQueue approach is safer and recoverable                                     |

#### Consequences

**Positive:**

- SyncQueue in Oracle leverages existing infrastructure — no new middleware required
- Event-driven sync provides 1-5 second latency — fast enough for dashboard refresh after plan save
- Nightly catch-up self-heals any drift — no manual intervention required for normal operations
- Circuit breaker pattern prevents overwhelming a struggling ES cluster
- Full audit trail via SyncAuditLog table

**Negative:**

- SyncQueue adds write load to Oracle (one INSERT per sync event) — negligible for IRIS volume
- 30-second polling interval adds latency vs true push-based systems (acceptable trade-off)
- Master data changes (N-PLM import) trigger full reindex of all indices — can take 3-5 minutes for 500K documents
- Development team must maintain denormalization queries (12-table join) as schema evolves

**Risks:**

- SyncQueue backlog during N-PLM bulk import → Mitigation: N-PLM imports scheduled during off-hours; full reindex triggered after import completion, not per-row
- Sync worker failure (Mendix scheduled event stops) → Mitigation: monitoring alert on queue depth; Mendix runtime restarts auto-resume scheduled events; nightly sync catches up
- ES cluster unavailability → Mitigation: circuit breaker after 5 consecutive failures pauses sync for 5 minutes; queue items remain PENDING in Oracle (durable); nightly sync catches up after recovery

#### CXO UX Impact

- Planners save a P/M plan and see updated dashboard data within 2-10 seconds — acceptable for analytical views
- "Data as of: [timestamp]" on all dashboard screens provides transparency about data freshness
- Admin dashboard shows sync queue health, lag metrics, and failed items — operations team has full visibility
- During ES outages, transactional screens (plan editing, roadmap management) continue working normally — only analytical dashboards are affected

---

### ADR-008: Authentication & Authorization — Samsung SSO + Factor Control

**Status:** Accepted
**Date:** 2026-03-22
**Decision Makers:** CDO, CXO, Samsung IT Security

#### Context

IRIS operates within Samsung Electronics' enterprise security perimeter. All Samsung internal applications must authenticate via Samsung SSO (supporting SAML 2.0 and OIDC protocols). Authorization must be role-based (Admin, Manager, Planner, Viewer) with data isolation by site and department — a planner at Hwaseong should not see Pyeongtaek's confidential resource plans unless granted cross-site access. Samsung DSR operates across 5 global sites with different data sensitivity levels.

#### Decision

Implement **Samsung SSO integration via Mendix SSO module** (SAML 2.0 primary, OIDC fallback) for authentication. Authorization uses a **two-layer model**: (1) **Role-Based Access Control (RBAC)** with four roles (Admin, Manager, Planner, Viewer) governing feature access; (2) **Factor Control (M05)** governing data isolation by filtering on dimensions (site, department, project type, time period). Factor Control filters are applied at the data layer — Oracle queries include WHERE clauses based on user's factor control settings, and ES queries include filter terms. JWT tokens carry role and factor control claims for API authentication.

#### Alternatives Considered

| Alternative                                         | Pros                                                 | Cons                                                                                                               | Why Not                                                                                                                             |
| --------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Custom authentication (username/password in Oracle) | Full control; no SSO dependency; simpler development | Violates Samsung security policy; no MFA; password management burden; audit compliance failure                     | Samsung mandates SSO for all internal applications — custom auth is a non-starter                                                   |
| RBAC only (no Factor Control)                       | Simpler authorization model; fewer filter conditions | Cannot enforce site-level data isolation; Hwaseong planners would see Xi'an data; violates Samsung data governance | Samsung DSR explicitly requires site/department level data isolation — RBAC alone is insufficient                                   |
| ABAC (Attribute-Based Access Control)               | Fine-grained, policy-based, flexible                 | Over-engineered for IRIS requirements; Mendix has no native ABAC engine; policy management complexity              | Factor Control achieves the needed data isolation with less complexity; ABAC is unnecessary for 4 roles × 5 sites × ~20 departments |

#### Consequences

**Positive:**

- Samsung SSO integration provides MFA, password policy, session management at the enterprise level — zero IRIS-specific auth code
- Factor Control provides intuitive data isolation — users see only the data relevant to their scope
- JWT tokens enable stateless API authentication — supports clustered Mendix deployment (ADR load balancing)
- Audit trail captures all access events (login, data view, edit, export) for Samsung compliance

**Negative:**

- Samsung SSO dependency — if SSO is down, IRIS is inaccessible (no local fallback by design)
- Factor Control adds complexity to every data query (Oracle WHERE clauses, ES filter terms)
- JWT token size increases with factor control claims — larger headers per request
- Initial Factor Control configuration requires admin setup for each user — onboarding overhead

**Risks:**

- Samsung SSO downtime → Mitigation: Samsung IT targets 99.9% SSO uptime; IRIS shows friendly "SSO unavailable" page; no local auth fallback (Samsung security policy)
- Factor Control misconfiguration (user sees wrong data) → Mitigation: admin audit page shows current factor control settings per user; test automation verifies factor control enforcement for each role

#### CXO UX Impact

- SSO login is seamless — users click "Login with Samsung SSO" and are redirected to familiar Samsung login page; no new credentials to remember
- Factor Control filters appear as persistent filter bar at the top of every IRIS screen — users can see their current scope (site, department, period) and switch within their allowed scope
- Role-based UI adaptation — Viewers see read-only screens, Planners see editable fields, Managers see approval buttons, Admins see configuration pages
- Data isolation is invisible to end users — they simply never see data outside their scope, which matches their mental model (Samsung planners already think in terms of "my site, my department")

---

## 2. System Architecture Diagram

### 2.1 Full System Context

```
+=====================================================================+
|                        EXTERNAL SYSTEMS                              |
|                                                                      |
|  +-----------+  +-----------+  +--------------+  +----------------+  |
|  | N-PLM     |  | PROMIS    |  | Samsung AI   |  | Email / SMTP   |  |
|  | (Master   |  | (Profit   |  | Services     |  | (Smart Notify) |  |
|  |  Data)    |  |  System)  |  | (v2.0)       |  |                |  |
|  +-----+-----+  +-----+-----+  +------+-------+  +-------+--------+  |
|        |              |               |                   |          |
+========|==============|===============|===================|==========+
         |              |               |                   |
    REST/Daily     REST/Delta      REST/Async          SMTP/API
    Pull (M31)     Push (M30)     (M22, deferred)     (M32)
         |              |               |                   |
+========|==============|===============|===================|==========+
|        v              v               v                   v          |
|  +-------------------------------------------------------------------+
|  |                    SAMSUNG SSO (SAML 2.0 / OIDC)                  |
|  +-------------------------------------------------------------------+
|        |                                                              |
|  +-------------------------------------------------------------------+
|  |                 LOAD BALANCER (HAProxy)                            |
|  |              SSL Termination + Session Affinity                    |
|  +------------+----------------------------+-------------------------+
|               |                            |                          |
|  +------------v-----------+  +-------------v----------+              |
|  | Mendix App Node 1      |  | Mendix App Node 2      |              |
|  | (Active)               |  | (Active)               |              |
|  |                        |  |                        |              |
|  | +--------------------+ |  | +--------------------+ |              |
|  | | API Gateway Layer  | |  | | API Gateway Layer  | |              |
|  | | REST | OData |     | |  | | REST | OData |     | |              |
|  | | WebSocket          | |  | | WebSocket          | |              |
|  | +--------------------+ |  | +--------------------+ |              |
|  |                        |  |                        |              |
|  | +--------------------+ |  | +--------------------+ |              |
|  | | Application Layer  | |  | | Application Layer  | |              |
|  | |                    | |  | |                    | |              |
|  | | Core: M01-M05      | |  | | Core: M01-M05      | |              |
|  | | Planning: M10-M13  | |  | | Planning: M10-M13  | |              |
|  | | Analysis: M20-M24  | |  | | Analysis: M20-M24  | |              |
|  | | Integration: M30-33| |  | | Integration: M30-33| |              |
|  | +--------------------+ |  | +--------------------+ |              |
|  |                        |  |                        |              |
|  | +--------------------+ |  | +--------------------+ |              |
|  | | Custom Widgets     | |  | | Custom Widgets     | |              |
|  | | W01: Gantt         | |  | | W01: Gantt         | |              |
|  | | W02: ECharts       | |  | | W02: ECharts       | |              |
|  | | W03: DiffViewer    | |  | | W03: DiffViewer    | |              |
|  | | W04: WorldMap      | |  | | W04: WorldMap      | |              |
|  | | W05: PivotTable    | |  | | W05: PivotTable    | |              |
|  | +--------------------+ |  | +--------------------+ |              |
|  +--------+---------------+  +--------+---------------+              |
|           |                            |                              |
|  +--------+----------------------------+--------+                    |
|  |                                              |                    |
|  |  +------------------+    +-------------------+---+                |
|  |  | Oracle 19c       |    | Elasticsearch 8.x    |                |
|  |  | PRIMARY          |    | Cluster               |                |
|  |  |                  |    |                       |                |
|  |  | Domain Model     |    | 3 Master-Eligible     |                |
|  |  | Version Store    |    |   (coordinating)      |                |
|  |  | SyncQueue        |    | 4 Data Nodes (Hot)    |                |
|  |  | Workflow State   |    | 2 Data Nodes (Warm)   |                |
|  |  | Factor Control   |    |                       |                |
|  |  | Audit Log        |    | Indices:              |                |
|  |  |                  |    | - iris-resource-alloc |                |
|  |  | +-------------+  |    | - iris-capacity-plan  |                |
|  |  | | STANDBY     |  |    | - iris-simulation     |                |
|  |  | | (Data Guard)|  |    | - iris-headcount      |                |
|  |  | +-------------+  |    | - iris-analysis-rpt   |                |
|  |  +------------------+    +-----------------------+                |
|  |                                                                    |
+===+===================================================================+
    |
    |  REVERSE PROXY (Nginx)
    |  Static assets, SSL, WebSocket upgrade
    |
```

### 2.2 Data Flow Summary

```
WRITE PATH:
  User Edit → Mendix Runtime → Oracle 19c (COMMIT)
                                    |
                              After-Commit → SyncQueue (Oracle)
                                    |
                              Sync Worker (every 30s)
                                    |
                              Denormalize (12-table join)
                                    |
                              ES Bulk API → Elasticsearch
                                    |
                              Document searchable (~1s refresh)

READ PATH:
  Transactional (edit screens)  → Oracle 19c via Mendix ORM
  Analytical (dashboards/charts) → Elasticsearch via M33 REST client
```

---

## 3. Technology Stack Specification

### 3.1 Core Platform

| Layer                | Technology      | Version        | Configuration                                                | Purpose                                                       |
| -------------------- | --------------- | -------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| **Application**      | Mendix          | 10.x (LTS)     | Studio Pro 10.x, Runtime 10.x, Java 11                       | Low-code platform: UI, microflows, business logic, workflows  |
| **Database**         | Oracle Database | 19c Enterprise | Primary + Standby (Data Guard), UTF-8, tablespace per module | Transactional data (OLTP), domain model, version store, audit |
| **Search/Analytics** | Elasticsearch   | 8.x            | 3 master + 4 hot + 2 warm data nodes, ILM policies           | Multi-dimensional aggregations, full-text search, analytics   |
| **Runtime**          | Java (OpenJDK)  | 11 LTS         | JVM heap: 4-8GB per Mendix node, G1GC                        | Mendix server-side execution, custom Java Actions             |

### 3.2 Frontend — Custom Widgets

| Widget ID | Technology                    | Version | Bundle Size                   | Purpose                                                           |
| --------- | ----------------------------- | ------- | ----------------------------- | ----------------------------------------------------------------- |
| **W01**   | xDHTML Gantt (DHTMLX)         | 8.x     | ~400KB min+gzip               | Resource timelines, P/M planning, roadmap, simulation Gantt views |
| **W02**   | ECharts.js                    | 5.x     | ~300KB min+gzip (tree-shaken) | Bar, line, pie, heatmap, treemap, radar, sankey charts            |
| **W03**   | Custom React Widget           | —       | ~50KB                         | Side-by-side version comparison (diff viewer)                     |
| **W04**   | ECharts.js (map module)       | 5.x     | ~150KB (map data)             | World map with site-level resource statistics overlay             |
| **W05**   | Custom React Widget + ECharts | —       | ~80KB                         | Multi-dimensional pivot table with chart integration              |

### 3.3 Integration Protocols

| System            | Protocol        | Direction                            | Auth                        | Frequency                                                           | Module |
| ----------------- | --------------- | ------------------------------------ | --------------------------- | ------------------------------------------------------------------- | ------ |
| **N-PLM**         | REST API (JSON) | N-PLM → IRIS (pull)                  | API key + Samsung SSO token | Daily scheduled (06:00 AM) + on-demand                              | M31    |
| **PROMIS**        | REST API (JSON) | IRIS → PROMIS (push)                 | API key + mutual TLS        | Event-driven (on version approval)                                  | M30    |
| **Samsung AI**    | REST API (JSON) | Bidirectional                        | OAuth 2.0 bearer token      | On-demand (user-triggered), deferred v2.0                           | M22    |
| **Email/SMTP**    | SMTP + REST API | IRIS → Mail server                   | SMTP auth (TLS)             | Event-driven (approval, notifications) + scheduled (weekly reports) | M32    |
| **Elasticsearch** | REST API (JSON) | IRIS → ES (index), IRIS ← ES (query) | API key (internal network)  | Event-driven (sync) + scheduled (nightly)                           | M33    |

### 3.4 Infrastructure Components

| Component         | Technology                      | Version/Config | Purpose                                                                               |
| ----------------- | ------------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| **Load Balancer** | HAProxy                         | 2.8 LTS        | SSL termination, session affinity (WebSocket), health checks, active-active Mendix LB |
| **Reverse Proxy** | Nginx                           | 1.24+          | Static asset serving, SSL passthrough, WebSocket upgrade handling, gzip compression   |
| **Oracle HA**     | Oracle Data Guard               | 19c            | Primary + Standby (async replication), automatic failover, RPO < 1 minute             |
| **ES Cluster**    | Elasticsearch                   | 8.x            | 3 master-eligible + 4 hot data + 2 warm data nodes, ILM policies                      |
| **Monitoring**    | Mendix built-in + ES monitoring | —              | JMX metrics, Mendix runtime stats, ES cluster health, custom Mendix admin dashboards  |
| **Backup**        | Oracle RMAN + ES snapshots      | —              | Oracle: daily full + hourly incremental; ES: daily snapshot to shared filesystem      |

### 3.5 Development Tools

| Tool                        | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| **Mendix Studio Pro 10.x**  | Application development, microflow design, page building         |
| **IntelliJ IDEA / VS Code** | Custom Java Actions, Pluggable Widget development                |
| **Node.js 18 LTS + npm**    | Widget build tooling (Webpack, Mendix Pluggable Widget tools)    |
| **Oracle SQL Developer**    | Database management, query optimization, execution plan analysis |
| **Kibana 8.x**              | ES index management, query debugging, dashboard prototyping      |
| **Postman**                 | API testing for REST endpoints and integration APIs              |
| **Git**                     | Version control for custom Java Actions and widget source code   |

---

## 4. Module Architecture

### 4.1 Module Dependency Map

```
                    +------------------+
                    |   M01            |
                    |   UserManagement |
                    |   (SSO, Roles)   |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+  +------v------+ +-----v--------+
     | M05        |  | M02         | | M04          |
     | Factor     |  | MasterData  | | Approval     |
     | Control    |  | (N-PLM)     | | Workflow     |
     +--------+---+  +------+------+ +-----+--------+
              |              |              |
              +--------------+--------------+
                             |
                    +--------v---------+
                    |   M03            |
                    |   VersionEngine  |
                    |   (Generic)      |
                    +--------+---------+
                             |
        +--------------------+--------------------+
        |                    |                    |
+-------v------+   +--------v-------+   +--------v--------+
| M10          |   | M11            |   | M12             |
| PMPlanner    |   | ResourceRoadmap|   | ResourceSimul.  |
| (Concurrent) |   | (Versioned)    |   | (What-If)       |
+--------------+   +----------------+   +-----------------+
        |                    |                    |
        +--------------------+--------------------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+  +------v------+ +-----v--------+
     | M13        |  | M20         | | M21          |
     | HeadCount  |  | Analysis    | | Analysis     |
     | Portfolio  |  | Engine (ES) | | Reporting    |
     +------------+  +------+------+ +-----+--------+
                             |              |
                    +--------v---------+    |
                    | M22 AIReporting   |    |
                    | (v2.0 deferred)   |    |
                    +------------------+    |
                                            |
              +-----------------------------+
              |              |
     +--------v---+  +------v------+
     | M23        |  | M24         |
     | WorldMap   |  | PersonalView|
     | View       |  |             |
     +------------+  +-------------+

INTEGRATION LAYER (cross-cutting):
     +----------+  +----------+  +----------+  +----------+
     | M30      |  | M31      |  | M32      |  | M33      |
     | PROMIS   |  | N-PLM    |  | Smart    |  | ES       |
     | Connector|  | Connector|  | Notify   |  | Client   |
     +----------+  +----------+  +----------+  +----------+

WIDGET LAYER (client-side):
     +----------+  +----------+  +----------+  +----------+  +----------+
     | W01      |  | W02      |  | W03      |  | W04      |  | W05      |
     | Gantt    |  | ECharts  |  | Diff     |  | WorldMap |  | Pivot    |
     | Widget   |  | Widget   |  | Viewer   |  | Widget   |  | Table    |
     +----------+  +----------+  +----------+  +----------+  +----------+
```

### 4.2 Core Modules (M01-M05)

| Module               | ID  | Responsibilities                                                                                                                                                                        | Key Entities                                                               | Dependencies             |
| -------------------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------ |
| **UserManagement**   | M01 | Samsung SSO integration (SAML 2.0/OIDC), role assignment (Admin/Manager/Planner/Viewer), user profile, session management, login/logout                                                 | User, Role, UserRole, Session                                              | Samsung SSO (external)   |
| **MasterData**       | M02 | Master data management synced from N-PLM: projects, products, organizational hierarchy, sites, employees, teams, departments                                                            | Project, Product, Employee, Site, Team, Department, BusinessUnit, Division | M31 (NPLMConnector), M01 |
| **VersionEngine**    | M03 | Generic versioning for all planning modules: version create, snapshot, diff, lifecycle (Draft→Review→Approved→Archived), immutability enforcement, delta extraction for PROMIS sync     | Version, VersionSnapshot, VersionDiff                                      | M01, M04                 |
| **ApprovalWorkflow** | M04 | Multi-step approval workflow: Draft→Review→Approve/Reject, email notifications on state transitions, delegation, approval history                                                       | ApprovalRequest, ApprovalStep, ApprovalHistory                             | M01, M32 (SmartNotify)   |
| **FactorControl**    | M05 | Data isolation filters: site, department, project type, time period; applied to all Oracle queries (WHERE clause) and ES queries (filter terms); user-configurable within allowed scope | FactorControlProfile, FactorDimension, FactorValue                         | M01, M02                 |

### 4.3 Planning Modules (M10-M13)

| Module                 | ID  | Responsibilities                                                                                                                                           | Key Entities                                        | Dependencies       |
| ---------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------ |
| **PMPlanner**          | M10 | Standard P/M (Person/Month) planning with concurrent editing, auto-merge, conflict resolution; Gantt view (W01) for timeline, WebSocket for real-time sync | PMPlan, PMPlanVersion, PMEntry, EditSession         | M03, M05, W01, W03 |
| **ResourceRoadmap**    | M11 | Long-term resource roadmap (1-3 year horizon); versioned, approval-gated; Gantt view for project timelines with resource allocation overlays               | Roadmap, RoadmapVersion, RoadmapProjectAllocation   | M03, M04, M05, W01 |
| **ResourceSimulation** | M12 | What-if simulation created as copy from approved roadmap; independent version history; compare simulation vs reality; Gantt view                           | Simulation, SimulationVersion, SimulationAllocation | M03, M05, M11, W01 |
| **HeadCountPortfolio** | M13 | Headcount planning and analysis; staffing plan by site/department/grade; portfolio views with ECharts (W02)                                                | HeadCountPlan, HeadCountEntry, HeadCountForecast    | M05, M02, W02      |

### 4.4 Analysis Modules (M20-M24)

| Module                | ID  | Responsibilities                                                                                                                                  | Key Entities                                 | Dependencies   |
| --------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | -------------- |
| **AnalysisEngine**    | M20 | Multi-dimensional aggregation via Elasticsearch; query builder for slice/dice/drill-down/roll-up across 8+ dimensions; caches frequent queries    | AnalysisQuery, AnalysisResult, AnalysisCache | M33, M05       |
| **AnalysisReporting** | M21 | Report generation (periodic + manual); chart configuration; Excel export; scheduled report distribution                                           | Report, ReportSchedule, ReportExport         | M20, M32, W02  |
| **AIReporting**       | M22 | Samsung AI Services integration (deferred v2.0); REST client with configurable endpoint; placeholder UI; adapter pattern for API contract changes | AIRequest, AIResponse, AIConfig              | M20 (deferred) |
| **WorldMapView**      | M23 | ECharts world map with site markers; click to drill into site-level resource statistics; geo_point aggregations from ES                           | — (uses M20 queries)                         | M20, W04       |
| **PersonalView**      | M24 | Individual resource dashboard; my projects, my allocation, my utilization; personal analytics                                                     | — (uses M20 queries)                         | M20, M01, W02  |

### 4.5 Integration Modules (M30-M33)

| Module                  | ID  | Responsibilities                                                                                                                           | Key Entities                                             | Dependencies              |
| ----------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ------------------------- |
| **PROMISConnector**     | M30 | Delta sync of changed project data to PROMIS; triggered on version approval; uses Version Engine diff to extract changed projects only     | SyncRecord, PROMISMapping                                | M03                       |
| **NPLMConnector**       | M31 | Master data pull from N-PLM; daily scheduled + on-demand; upsert into MasterData entities; triggers ES full reindex on master data changes | ImportJob, ImportLog, MappingConfig                      | M02, M33                  |
| **SmartNotify**         | M32 | Notification engine: event-driven (approval requests, conflict alerts) + scheduled (weekly analysis reports); SMTP + in-app notification   | Notification, NotificationTemplate, NotificationSchedule | M01, M04                  |
| **ElasticsearchClient** | M33 | ES query builder, index management, sync engine (SyncQueue processing), bulk API client, health checks, admin dashboard                    | SyncQueue, SyncAuditLog, ESIndexConfig                   | — (infrastructure module) |

### 4.6 Custom Widgets (W01-W05)

| Widget               | ID  | Technology                | Mendix Integration                                                                                                                  | Data Source                             |
| -------------------- | --- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **GanttWidget**      | W01 | xDHTML Gantt (DHTMLX) 8.x | Pluggable Widget API; props: dataSource URL, config, onTaskUpdate nanoflow, onConflict nanoflow; WebSocket for concurrent edit sync | REST: `/api/gantt/tasks`                |
| **EChartsWidget**    | W02 | ECharts.js 5.x            | Pluggable Widget API; props: chartType, dataSource URL, dimensions[], measures[], drillDownEnabled, onDrillDown nanoflow            | REST: `/api/analysis/aggregate`         |
| **DiffViewerWidget** | W03 | Custom React              | Pluggable Widget API; props: baseVersion, compareVersion, entityType, onResolve nanoflow                                            | REST: `/api/version/diff`               |
| **WorldMapWidget**   | W04 | ECharts.js 5.x (map)      | Pluggable Widget API; props: dataSource URL, geoJSON, onSiteClick nanoflow                                                          | REST: `/api/analysis/aggregate` (geo)   |
| **PivotTableWidget** | W05 | Custom React + ECharts    | Pluggable Widget API; props: dataSource URL, rows[], columns[], values[], onCellClick nanoflow                                      | REST: `/api/analysis/aggregate` (pivot) |

---

## 5. API Design

### 5.1 REST API Endpoints

#### Gantt API (W01 data source)

| Method | Endpoint                                                         | Description                               | Request                                                                        | Response                                                                                       |
| ------ | ---------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| GET    | `/api/gantt/tasks?versionId={id}&type={roadmap\|pm\|simulation}` | Fetch all tasks/allocations for a version | Query params: versionId, type, startDate, endDate                              | `{ data: [{ id, text, start_date, end_date, progress, resource, color, ... }], links: [...] }` |
| PUT    | `/api/gantt/tasks/{taskId}`                                      | Update a task (drag/resize/edit)          | `{ start_date, end_date, allocated_pct, resource_id }`                         | `{ data: { ...updatedTask }, conflicts: [] }`                                                  |
| POST   | `/api/gantt/tasks`                                               | Create a new task/allocation              | `{ version_id, project_id, employee_id, start_date, end_date, allocated_pct }` | `{ data: { ...newTask } }`                                                                     |
| DELETE | `/api/gantt/tasks/{taskId}`                                      | Remove an allocation                      | —                                                                              | `{ status: "deleted" }`                                                                        |

#### Analysis API (W02, W04, W05 data source)

| Method | Endpoint                   | Description                                            | Request                                                                                                                                                           | Response                                                                         |
| ------ | -------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| POST   | `/api/analysis/aggregate`  | Execute multi-dimensional aggregation query against ES | `{ index, dimensions: ["site","dept"], measures: ["headcount","alloc_pct"], filters: { site: ["Hwaseong"], period: ["2026-Q2"] }, drillDown: { field: "team" } }` | `{ data: { buckets: [...] }, meta: { total, took_ms } }`                         |
| GET    | `/api/analysis/dimensions` | List available dimensions and their values             | Query params: index                                                                                                                                               | `{ dimensions: [{ name: "site", values: ["Hwaseong","Pyeongtaek",...] }, ...] }` |
| POST   | `/api/analysis/export`     | Export analysis results to Excel                       | `{ query: {...}, format: "xlsx", includeCharts: true }`                                                                                                           | Binary (xlsx) download                                                           |

#### Version API (W03 data source)

| Method | Endpoint                                        | Description                                   | Request                                       | Response                                                                                                        |
| ------ | ----------------------------------------------- | --------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/version/list?planType={type}&planId={id}` | List all versions of a plan                   | Query params: planType, planId                | `{ data: [{ version_id, version_number, status, created_by, created_at }] }`                                    |
| GET    | `/api/version/diff?baseId={id}&compareId={id}`  | Compute diff between two versions             | Query params: baseVersionId, compareVersionId | `{ data: { added: [...], removed: [...], modified: [{ field, oldValue, newValue }] }, meta: { totalChanges } }` |
| POST   | `/api/version/create`                           | Create a new version (snapshot)               | `{ plan_id, plan_type, base_version_id }`     | `{ data: { version_id, version_number, status: "Draft" } }`                                                     |
| PUT    | `/api/version/{id}/status`                      | Change version status (Draft→Review→Approved) | `{ new_status: "Review" }`                    | `{ data: { ...updatedVersion } }`                                                                               |

#### Sync API (admin/monitoring)

| Method | Endpoint                    | Description                                  | Request                                                                                          | Response                                                                        |
| ------ | --------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| GET    | `/api/sync/status`          | Current sync queue status and health metrics | —                                                                                                | `{ pending: 42, processing: 3, failed: 0, lag_seconds: 4, es_health: "green" }` |
| GET    | `/api/sync/audit?limit={n}` | Recent sync audit log entries                | Query params: limit, syncType                                                                    | `{ data: [{ audit_id, sync_type, duration_ms, docs_processed, status }] }`      |
| POST   | `/api/sync/reindex`         | Trigger on-demand reindex                    | `{ scope: "full" \| "index" \| "version", target: "iris-resource-allocation", versionId: null }` | `{ job_id, status: "started" }`                                                 |
| POST   | `/api/sync/health-check`    | Run consistency health checks                | —                                                                                                | `{ checks: [{ name, status, oracle_count, es_count, delta }] }`                 |

### 5.2 WebSocket Channels

#### Concurrent Edit Channel

```
Endpoint: ws://{host}/ws/concurrent-edit

Message Types:

1. JOIN_ROOM
   Client → Server: { type: "JOIN", planId: "PM-001", userId: "U-108" }
   Server → All:     { type: "USER_JOINED", userId: "U-108", userName: "Kim Minjun", timestamp }

2. EDIT_EVENT
   Client → Server: { type: "EDIT", planId: "PM-001", rowId: "R-042",
                       field: "allocated_pct", value: 80, userId: "U-108" }
   Server → Others:  { type: "EDIT_BROADCAST", userId: "U-108", userName: "Kim Minjun",
                       rowId: "R-042", field: "allocated_pct", value: 80, timestamp }

3. CURSOR_MOVE
   Client → Server: { type: "CURSOR", planId: "PM-001", rowId: "R-042",
                       userId: "U-108" }
   Server → Others:  { type: "CURSOR_BROADCAST", userId: "U-108",
                       userName: "Kim Minjun", rowId: "R-042", color: "#3B82F6" }

4. LEAVE_ROOM
   Client → Server: { type: "LEAVE", planId: "PM-001", userId: "U-108" }
   Server → All:     { type: "USER_LEFT", userId: "U-108", timestamp }

5. CONFLICT_ALERT
   Server → Client:  { type: "CONFLICT", planId: "PM-001", rowId: "R-042",
                       conflictingUserId: "U-205", message: "Row modified by Park Sooyoung" }
```

#### Notification Channel

```
Endpoint: ws://{host}/ws/notifications

Message Types:

1. APPROVAL_REQUEST
   Server → Client: { type: "APPROVAL_REQUEST", planType: "Roadmap",
                       planId: "RM-003", version: "V5",
                       requestedBy: "Lee Jihoon", timestamp }

2. SYNC_COMPLETE
   Server → Client: { type: "SYNC_COMPLETE", index: "iris-resource-allocation",
                       docs_processed: 1250, status: "SUCCESS" }

3. SYSTEM_ALERT
   Server → Client: { type: "SYSTEM_ALERT", severity: "WARNING",
                       message: "ES cluster health: YELLOW", timestamp }
```

### 5.3 OData Services (Mendix Standard)

Mendix automatically exposes OData v4 endpoints for domain model entities. These are used for:

| Service          | Endpoint                           | Purpose                                            |
| ---------------- | ---------------------------------- | -------------------------------------------------- |
| **User data**    | `/odata/UserManagement/v1/Users`   | User profile, role information                     |
| **Master data**  | `/odata/MasterData/v1/Projects`    | Project listing, search, filtering                 |
| **Version data** | `/odata/VersionEngine/v1/Versions` | Version metadata for dropdowns and selection lists |

OData services include standard $filter, $orderby, $top, $skip, $select, and $expand query options.

---

## 6. Security Architecture

### 6.1 Authentication

| Aspect                 | Implementation                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| **Protocol**           | SAML 2.0 (primary), OIDC (fallback) via Samsung SSO                                         |
| **Mendix Integration** | Mendix SSO module (Marketplace) configured with Samsung IdP metadata                        |
| **Session Management** | Server-side session in Mendix runtime; session timeout: 30 minutes idle, 8 hours absolute   |
| **Token**              | JWT issued by Mendix after SSO validation; contains userId, roles[], factorControl{} claims |
| **MFA**                | Enforced at Samsung SSO level (not IRIS responsibility)                                     |

### 6.2 Authorization — Role-Based Access Control

| Role        | Feature Access                                                     | Data Access                           | Factor Control                 |
| ----------- | ------------------------------------------------------------------ | ------------------------------------- | ------------------------------ |
| **Admin**   | All features + system configuration + user management + sync admin | All data (all sites, all departments) | No restriction                 |
| **Manager** | Planning (read/write) + Analysis + Approval + Export               | Own site + delegated sites            | Site, Department               |
| **Planner** | Planning (read/write) + Analysis (read)                            | Own site, own department only         | Site, Department, Project Type |
| **Viewer**  | All screens (read-only) + Export                                   | Configurable per user                 | Site, Department               |

### 6.3 Factor Control — Data Isolation

Factor Control (M05) applies data-level security by injecting filter conditions into every data query:

```
Oracle Query (Mendix ORM):
  SELECT * FROM RoadmapProjectAllocation rpa
  JOIN Employee e ON rpa.employee_id = e.employee_id
  WHERE e.site_id IN (:userAllowedSites)          -- Factor Control: Site
    AND e.dept_id IN (:userAllowedDepts)           -- Factor Control: Department
    AND rpa.period BETWEEN :startPeriod AND :endPeriod  -- Factor Control: Time Period

ES Query (M33 client):
  {
    "query": {
      "bool": {
        "filter": [
          { "terms": { "site.id": ["S-01", "S-02"] } },        // Factor Control: Site
          { "terms": { "employee.department": ["DRAM Dev"] } }, // Factor Control: Department
          { "range": { "time.period": { "gte": "2026-01", "lte": "2026-12" } } }
        ],
        "must": [ ... user's analytical query ... ]
      }
    }
  }
```

### 6.4 API Security

| Layer                             | Control                                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| **External APIs** (N-PLM, PROMIS) | Mutual TLS + API key; IP whitelist on Samsung network                                               |
| **Internal APIs** (Mendix REST)   | JWT bearer token in Authorization header; token validated per request                               |
| **ES Cluster**                    | API key authentication; ES cluster on private subnet (no public access)                             |
| **WebSocket**                     | JWT token passed on initial handshake; session validated before room join                           |
| **Rate Limiting**                 | HAProxy rate limiting: 100 requests/second per user for REST; 10 connections per user for WebSocket |

### 6.5 Audit Trail

All security-relevant events are logged to the Oracle AuditLog table:

| Event Type           | Data Captured                                                           |
| -------------------- | ----------------------------------------------------------------------- |
| **Login/Logout**     | User ID, timestamp, IP address, SSO session ID                          |
| **Data View**        | User ID, entity type, entity ID, timestamp, Factor Control scope        |
| **Data Edit**        | User ID, entity type, entity ID, field, old value, new value, timestamp |
| **Data Export**      | User ID, export type (Excel/PDF), data scope, timestamp                 |
| **Version Approval** | User ID, version ID, action (approve/reject), timestamp                 |
| **Admin Action**     | User ID, action type, target, timestamp                                 |

Retention: 3 years (Samsung compliance requirement).

### 6.6 Network Security

```
INTERNET / SAMSUNG INTRANET
        |
        v
  [Samsung Firewall]
        |
        v
  [Nginx - Reverse Proxy]  ---- HTTPS only (TLS 1.2+)
        |
        v
  [HAProxy - Load Balancer] ---- DMZ
        |
        v
  [Mendix App Nodes]        ---- Application Subnet
        |         |
        v         v
  [Oracle 19c]  [ES Cluster] ---- Database Subnet (private, no public access)
```

- All traffic is HTTPS/TLS 1.2+
- ES cluster is on private subnet — accessible only from Mendix app nodes
- Oracle is on private subnet — accessible only from Mendix app nodes and DBA tools (jump box)
- WebSocket connections upgrade from HTTPS — same TLS protection
- No public endpoints — all access via Samsung intranet

---

## 7. Infrastructure & Deployment

### 7.1 Environment Strategy

| Environment | Timeline   | Infrastructure                                                                           | Purpose                                       | Data                            |
| ----------- | ---------- | ---------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------- |
| **DEV**     | Current    | Single Mendix node, Oracle dev instance, single ES node                                  | Development, unit testing                     | Synthetic test data             |
| **QA**      | April 2026 | 2 Mendix nodes, Oracle + Standby, 3-node ES cluster                                      | Integration testing, UAT, performance testing | Anonymized production-like data |
| **PROD**    | July 2026  | 2+ Mendix nodes, Oracle Primary + Standby (Data Guard), 9-node ES cluster (3M + 4H + 2W) | Production                                    | Real Samsung DSR data           |

### 7.2 Production Topology — Detailed

```
                    Samsung Intranet
                          |
                    +-----v------+
                    | Nginx      |
                    | Reverse    |
                    | Proxy      |
                    | (SSL, WS   |
                    |  upgrade,  |
                    |  static)   |
                    +-----+------+
                          |
                    +-----v------+
                    | HAProxy    |
                    | Load       |
                    | Balancer   |
                    | (L7, sticky|
                    |  sessions) |
                    +--+------+--+
                       |      |
              +--------v--+ +-v---------+
              | Mendix    | | Mendix    |
              | Node 1    | | Node 2    |
              | JVM: 8GB  | | JVM: 8GB  |
              | CPU: 4c   | | CPU: 4c   |
              +-----+-----+ +-----+-----+
                    |              |
          +---------+--------------+---------+
          |                                  |
   +------v------+                  +--------v--------+
   | Oracle 19c  |                  | Elasticsearch   |
   |             |                  | 8.x Cluster     |
   | PRIMARY     |                  |                 |
   | CPU: 8c     |                  | Master Nodes:   |
   | RAM: 64GB   |                  |  M1: 8GB, 2c   |
   | Storage:    |                  |  M2: 8GB, 2c   |
   |  500GB SSD  |                  |  M3: 8GB, 2c   |
   |             |                  |                 |
   | STANDBY     |                  | Hot Data Nodes: |
   | (Data Guard |                  |  H1: 32GB, 4c  |
   |  async      |                  |  H2: 32GB, 4c  |
   |  replication)|                 |  H3: 32GB, 4c  |
   | CPU: 8c     |                  |  H4: 32GB, 4c  |
   | RAM: 64GB   |                  |  500GB SSD each |
   | Storage:    |                  |                 |
   |  500GB SSD  |                  | Warm Data Nodes:|
   |             |                  |  W1: 16GB, 2c  |
   +-------------+                  |  W2: 16GB, 2c  |
                                    |  2TB HDD each  |
                                    +-----------------+
```

### 7.3 Elasticsearch Cluster Topology

| Node Type           | Count | RAM        | CPU     | Storage         | Purpose                                                                                     |
| ------------------- | ----- | ---------- | ------- | --------------- | ------------------------------------------------------------------------------------------- |
| **Master-Eligible** | 3     | 8 GB each  | 2 cores | 50 GB SSD       | Cluster state management, coordinating node duties, master election quorum                  |
| **Hot Data**        | 4     | 32 GB each | 4 cores | 500 GB SSD each | Active indices: current quarter allocations, active planning versions, recent analysis data |
| **Warm Data**       | 2     | 16 GB each | 2 cores | 2 TB HDD each   | Historical indices: archived versions, historical allocations (90+ days), analysis reports  |

#### Index Lifecycle Management (ILM)

| Index Pattern                | Hot Phase                             | Warm Phase                        | Delete             |
| ---------------------------- | ------------------------------------- | --------------------------------- | ------------------ |
| `iris-resource-allocation-*` | Current quarter data, active planning | After 90 days: move to warm nodes | Never (compliance) |
| `iris-capacity-plan-*`       | Current fiscal year                   | After approval: move to warm      | Never              |
| `iris-pm-planning-*`         | Active version                        | Archived versions: move to warm   | Never              |
| `iris-simulation-*`          | Active simulations                    | 30 days after close: move to warm | After 2 years      |
| `iris-analysis-report-*`     | Last 90 days                          | 90+ days: move to warm            | After 3 years      |
| `iris-headcount-*`           | Current fiscal year                   | Historical: move to warm          | Never              |

#### Shard Strategy

| Index                      | Primary Shards | Replica Shards | Rationale                                            |
| -------------------------- | -------------- | -------------- | ---------------------------------------------------- |
| `iris-resource-allocation` | 3              | 1              | Largest index (~500K docs, target 10-30GB per shard) |
| `iris-capacity-plan`       | 2              | 1              | Medium index (~50K docs)                             |
| `iris-pm-planning`         | 3              | 1              | Large during monthly planning cycles                 |
| `iris-simulation-result`   | 2              | 1              | Medium index, short-lived data                       |
| `iris-headcount`           | 2              | 1              | Medium index (~100K docs)                            |
| `iris-analysis-report`     | 2              | 1              | Report metadata, moderate volume                     |

### 7.4 Deployment Pipeline

```
DEVELOPMENT:
  Developer → Mendix Studio Pro → Commit to Team Server (Mendix Git)
      |
      v
  Custom Code (Java Actions + Widgets):
  Developer → Git → CI Build (npm build for widgets, Maven for Java)
      |
      v

QA DEPLOYMENT:
  Mendix Team Server → Build Package (.mda)
      |
      +→ Deploy to QA Mendix Node 1
      +→ Deploy to QA Mendix Node 2
      |
      +→ Run Automated Tests (Mendix ATS + custom integration tests)
      +→ Run Performance Tests (JMeter: Gantt load, ES query benchmarks)
      |
      v
  QA Sign-Off (Samsung UAT team)

PRODUCTION DEPLOYMENT:
  Approved QA Package → Production Deployment
      |
      +→ Blue-Green deployment:
      |   1. Deploy to Node 2 (standby)
      |   2. Smoke test Node 2
      |   3. Switch HAProxy to Node 2
      |   4. Deploy to Node 1
      |   5. Verify both nodes healthy
      |   6. HAProxy returns to active-active
      |
      +→ Oracle schema changes:
      |   1. Apply DDL in maintenance window (if needed)
      |   2. Backward-compatible changes preferred (add columns, not remove)
      |
      +→ ES index changes:
          1. Create new index with updated mapping
          2. Reindex from Oracle
          3. Alias swap (zero-downtime)
```

### 7.5 Backup & Disaster Recovery

| Component              | Backup Strategy                                                              | RPO                           | RTO                                                           | Procedure                                                                    |
| ---------------------- | ---------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Oracle 19c**         | RMAN: daily full + hourly incremental; archived redo logs shipped to standby | < 1 minute (Data Guard async) | < 30 minutes (failover to standby)                            | Automatic failover via Data Guard broker                                     |
| **Elasticsearch**      | Daily snapshot to shared filesystem (NFS)                                    | < 24 hours                    | < 2 hours (restore from snapshot + reindex delta from Oracle) | ES snapshot/restore API; full reindex from Oracle if snapshot unavailable    |
| **Mendix Application** | Mendix Team Server (Git); deployment packages (.mda) versioned               | Zero (source in Git)          | < 1 hour (redeploy from package)                              | Deploy last known good package from Mendix Cloud Portal or manual deployment |
| **Configuration**      | Mendix constants + Oracle config tables backed up with Oracle RMAN           | Same as Oracle                | Same as Oracle                                                | Restore with Oracle; re-apply environment-specific constants                 |

### 7.6 Monitoring & Alerting

| Component          | Tool                                | Key Metrics                                                                     | Alert Threshold                                             |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Mendix Runtime** | Mendix built-in monitoring + JMX    | Request count, response time (p95/p99), active sessions, JVM heap, thread count | Response p95 > 2s, heap > 80%, active sessions > 200        |
| **Oracle 19c**     | Oracle Enterprise Manager (OEM)     | Active sessions, tablespace usage, slow queries, Data Guard lag                 | Tablespace > 85%, Data Guard lag > 5 min, slow query > 5s   |
| **Elasticsearch**  | ES monitoring API + Kibana          | Cluster health, search latency (p95), indexing rate, shard count, JVM heap      | Cluster YELLOW, search p95 > 500ms, JVM heap > 75%          |
| **HAProxy**        | HAProxy stats page + logs           | Request rate, error rate (5xx), active connections, backend health              | Error rate > 1%, backend DOWN                               |
| **Sync System**    | Custom Mendix admin dashboard (M33) | Queue depth (PENDING), failed count, sync lag, nightly sync duration            | PENDING > 5000, FAILED > 100, lag > 5 min, nightly > 30 min |
| **WebSocket**      | Mendix custom metrics               | Active connections, message rate, reconnection rate                             | Active connections > 100, reconnection rate > 10/min        |

---

## 8. Performance & Scalability

### 8.1 Latency Budgets by Screen

| Screen                                 | Target (p95) | Breakdown                                                                                            | Limiting Factor                           |
| -------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **P/M Planner Gantt** (initial load)   | < 3 seconds  | Oracle query: 500ms, data transform: 200ms, network: 300ms, Gantt render: 1500ms, widget init: 500ms | xDHTML Gantt rendering (500+ tasks)       |
| **P/M Planner Gantt** (task drag/save) | < 1 second   | Oracle write: 100ms, WebSocket broadcast: 50ms, client update: 200ms                                 | Oracle COMMIT + WebSocket                 |
| **Roadmap Gantt** (initial load)       | < 2 seconds  | Oracle query: 300ms, data transform: 150ms, network: 200ms, Gantt render: 1000ms                     | Fewer tasks than P/M, faster render       |
| **Analysis Dashboard** (filter change) | < 1 second   | ES aggregation: 200-400ms, network: 100ms, ECharts render: 200ms                                     | ES query complexity                       |
| **WorldMap View** (initial load)       | < 2 seconds  | ES geo aggregation: 300ms, network: 200ms, ECharts map render: 1000ms                                | Map rendering (GeoJSON)                   |
| **Version Diff** (compare 2 versions)  | < 2 seconds  | Oracle query (2 snapshots): 500ms, diff computation (Java): 800ms, DiffViewer render: 500ms          | Java diff for large versions (1000+ rows) |
| **Concurrent Edit** (presence update)  | < 100 ms     | WebSocket message: 30ms, server processing: 20ms, broadcast: 30ms, client render: 20ms               | Network latency                           |
| **Factor Control** (filter change)     | < 500 ms     | Filter validation: 50ms, query re-execution: 300ms, UI update: 150ms                                 | Depends on underlying query               |

### 8.2 Elasticsearch Query Optimization

| Optimization                           | Implementation                                                                              | Impact                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Keyword fields for dimensions**      | All dimension fields (site, department, project, etc.) mapped as `keyword` type, not `text` | 10x faster terms aggregations; no analyzer overhead                         |
| **Doc values (columnar)**              | Enabled by default for `keyword` and numeric fields                                         | Optimized for aggregation, sorting, scripted fields                         |
| **Request cache**                      | Enabled for all analytical indices                                                          | Identical dashboard queries served from cache; invalidated on index refresh |
| **Shard request cache**                | Enabled for frequently-used aggregation queries                                             | Per-shard caching of aggregation results                                    |
| **Composite aggregation** (pagination) | Used for large aggregations (> 10,000 buckets)                                              | Memory-efficient pagination through large result sets                       |
| **Index sorting**                      | `iris-resource-allocation` sorted by `time.period` descending                               | Faster range queries on time dimension                                      |
| **Filter context** (not query context) | Factor Control filters and time range filters use `filter` context                          | Cached, not scored — faster execution                                       |
| **Source filtering**                   | `_source: false` + `fields` for aggregation-only queries                                    | Reduces network transfer and memory usage                                   |

### 8.3 Oracle Index Strategy

```sql
-- Primary key indexes (automatic)
-- All PKs are indexed by Oracle automatically

-- Foreign key indexes (CRITICAL for denormalization joins)
CREATE INDEX idx_rpa_version_id ON RoadmapProjectAllocation(version_id);
CREATE INDEX idx_rpa_employee_id ON RoadmapProjectAllocation(employee_id);
CREATE INDEX idx_rpa_project_id ON RoadmapProjectAllocation(project_id);
CREATE INDEX idx_employee_team_id ON Employee(team_id);
CREATE INDEX idx_employee_site_id ON Employee(site_id);
CREATE INDEX idx_team_dept_id ON Team(dept_id);
CREATE INDEX idx_dept_bu_id ON Department(bu_id);
CREATE INDEX idx_bu_division_id ON BusinessUnit(division_id);
CREATE INDEX idx_project_type_id ON Project(project_type_id);
CREATE INDEX idx_project_family_id ON Project(product_family_id);
CREATE INDEX idx_site_country_id ON Site(country_id);

-- SyncQueue performance indexes
CREATE INDEX idx_syncqueue_status_created ON SyncQueue(status, created_at);
CREATE INDEX idx_syncqueue_entity ON SyncQueue(entity_type, entity_id);

-- Version lookup indexes
CREATE INDEX idx_roadmap_version_status ON RoadmapVersion(version_type, roadmap_id);
CREATE INDEX idx_pm_version_status ON PMPlanVersion(version_type, pm_plan_id);
CREATE INDEX idx_sim_version_status ON SimulationVersion(version_type, simulation_id);

-- Partition strategy: SyncQueue by month
ALTER TABLE SyncQueue MODIFY PARTITION BY RANGE (created_at)
  INTERVAL (NUMTOYMINTERVAL(1, 'MONTH'))
  (PARTITION p_initial VALUES LESS THAN (TO_DATE('2026-04-01','YYYY-MM-DD')));

-- Optional: Materialized view for full sync performance
-- (see A2 Data Model for full DDL)
```

### 8.4 Caching Strategy

| Cache Layer              | Technology                  | TTL                                            | Purpose                                                               | Invalidation                              |
| ------------------------ | --------------------------- | ---------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| **Mendix Object Cache**  | Mendix built-in (in-memory) | Session-scoped                                 | Frequently accessed master data (sites, departments, project types)   | On N-PLM sync completion                  |
| **ES Request Cache**     | Elasticsearch built-in      | Until index refresh (1s for hot, 30s for warm) | Repeated dashboard queries with identical filters                     | Automatic on index refresh                |
| **Factor Control Cache** | Mendix session state        | Session-scoped (30 min)                        | User's factor control profile (allowed sites, departments)            | On user profile change or session restart |
| **Gantt Data Cache**     | Client-side (JavaScript)    | Page-scoped                                    | Gantt task data loaded on page open; invalidated by WebSocket updates | WebSocket EDIT_BROADCAST or page refresh  |
| **Static Asset Cache**   | Nginx (reverse proxy)       | 24 hours                                       | CSS, JS bundles, images, widget assets                                | Cache-busting via file hash in URL        |

### 8.5 Connection Pooling

| Resource                        | Pool Size                  | Configuration                                                         |
| ------------------------------- | -------------------------- | --------------------------------------------------------------------- |
| **Oracle connections** (Mendix) | Min: 20, Max: 100 per node | Mendix runtime configuration; idle timeout: 5 min; max wait: 30s      |
| **ES HTTP connections** (M33)   | 30 per node                | Apache HttpClient connection pool; keep-alive: 60s; max per route: 10 |
| **WebSocket connections**       | Max 200 per node           | Mendix runtime WebSocket handler; per-plan room limit: 15 users       |

### 8.6 Scalability Plan

| Scenario                                   | Trigger                          | Scale Action                                                                      |
| ------------------------------------------ | -------------------------------- | --------------------------------------------------------------------------------- |
| **User load increase** (> 200 concurrent)  | Mendix response time p95 > 3s    | Add Mendix App Node 3 behind HAProxy                                              |
| **ES query latency increase**              | Search p95 > 500ms               | Add hot data nodes (H5, H6); increase shard count for large indices               |
| **Oracle load increase**                   | Active sessions > 80% of pool    | Increase connection pool; consider Oracle RAC (requires license)                  |
| **Data volume growth** (> 1M ES documents) | Shard size > 30GB                | Increase primary shard count; add data nodes                                      |
| **Nightly sync duration > 30 min**         | Monitoring alert                 | Parallelize sync workers (2-3 concurrent workers); optimize denormalization query |
| **WebSocket connection spike**             | Active WS connections > 150/node | Add Mendix node; review per-plan room limits                                      |

---

## 9. CXO UX Architecture Considerations

This section documents how each architectural decision directly affects the end-user experience. Every technical choice has UX consequences; this section ensures those consequences are intentional and optimized.

### 9.1 Real-Time Collaboration Feel

**Architecture:** WebSocket + Optimistic Locking (ADR-003)

| UX Concern                                        | Technical Implementation                                                         | Target Metric                             |
| ------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------- |
| **Presence awareness** — who is editing what      | WebSocket CURSOR_MOVE broadcast, colored indicators per user                     | Update latency < 100ms                    |
| **Edit visibility** — see others' changes live    | WebSocket EDIT_BROADCAST, client-side Gantt/grid update                          | Broadcast latency < 100ms                 |
| **Conflict resolution** — clear, non-technical    | DiffViewer widget (W03), side-by-side comparison, Pass/Overwrite buttons         | Diff computation < 2s                     |
| **Connection resilience** — handle network drops  | Auto-reconnect with exponential backoff, unsaved change buffer, status indicator | Reconnect within 5s                       |
| **Concurrent editor limit** — prevent degradation | Soft limit: 10 editors per plan, warning at entry; hard limit: 15                | Latency maintained < 100ms up to 15 users |

**UX Design Rules:**

- Connection status indicator is always visible in the Gantt toolbar (green dot = connected, yellow = reconnecting, red = disconnected)
- Presence avatars show in the plan header with tooltip showing user name and current row
- Auto-merge is silent (best UX) — users only see the conflict dialog when their specific row has a conflict
- Conflict resolution dialog uses Samsung-friendly language ("Another planner updated this row...") not technical jargon

### 9.2 Dashboard Responsiveness

**Architecture:** Elasticsearch 8.x with denormalized indices (ADR-002, ADR-007)

| UX Concern                                           | Technical Implementation                                                       | Target Metric                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------- |
| **Filter response time** — instant dashboard updates | ES filter context queries (cached), no Oracle joins at query time              | < 500ms (p95)                     |
| **Drill-down speed** — click site → see departments  | ES composite aggregation with filter narrowing                                 | < 500ms (p95)                     |
| **Chart rendering** — smooth transitions             | ECharts.js animation: 300ms transition, progressive loading for large datasets | Render < 200ms after data arrival |
| **Data freshness** — how recent is the data          | "Data as of: [timestamp]" indicator, auto-refresh option (30s/60s/off)         | Lag 1-5s after Oracle commit      |
| **Export speed** — Excel download                    | Server-side Excel generation from ES query results                             | < 5s for 10,000 rows              |

**UX Design Rules:**

- Loading skeleton shown immediately (< 100ms) while ES query executes
- Charts animate on data update (not hard-refresh) — users see the transition and understand what changed
- "Data as of" timestamp is persistent and unobtrusive (footer of dashboard cards)
- Auto-refresh toggle lets analysts choose between real-time updates and stable views during presentation

### 9.3 API Response Time Targets per Screen

| Screen Category                                 | Load Time (initial) | Interaction Response    | Data Freshness            | Primary Data Source           |
| ----------------------------------------------- | ------------------- | ----------------------- | ------------------------- | ----------------------------- |
| **Planning screens** (P/M, Roadmap, Simulation) | < 3s                | < 1s (save, drag)       | Real-time (Oracle)        | Oracle via Mendix ORM         |
| **Analysis dashboards** (charts, pivot)         | < 2s                | < 500ms (filter, drill) | Near-real-time (1-5s lag) | Elasticsearch via M33         |
| **WorldMap view**                               | < 2s                | < 500ms (site click)    | Near-real-time (1-5s lag) | Elasticsearch geo aggregation |
| **Version management** (list, diff, approve)    | < 2s                | < 2s (diff compare)     | Real-time (Oracle)        | Oracle via Mendix ORM         |
| **Admin screens** (sync status, user mgmt)      | < 1s                | < 500ms                 | Real-time (Oracle)        | Oracle via Mendix ORM         |
| **Personal dashboard** (my allocations)         | < 2s                | < 500ms (filter)        | Near-real-time (1-5s lag) | Elasticsearch via M33         |

### 9.4 Offline Behavior & Error States

| Scenario                    | UX Behavior                                                                                                          | Technical Implementation                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **ES cluster down**         | Analytical dashboards show "Data temporarily unavailable" message; planning screens continue working normally        | M33 health check, graceful fallback UI                     |
| **WebSocket disconnected**  | Yellow status indicator, "Reconnecting..." message; editing continues in offline buffer; changes synced on reconnect | Auto-reconnect with buffer flush                           |
| **Oracle slow query**       | Loading spinner with timeout message after 5s: "This is taking longer than expected"                                 | Mendix timeout configuration, client-side timeout handling |
| **Samsung SSO unavailable** | Full-page "Login service unavailable" with retry button and Samsung IT contact                                       | Mendix SSO module error handling                           |
| **API rate limit exceeded** | Toast notification: "Too many requests, please wait a moment"                                                        | HAProxy 429 response, client-side rate limit awareness     |

### 9.5 Accessibility & International

| Concern                 | Implementation                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Keyboard navigation** | All custom widgets (W01-W05) support keyboard navigation; Gantt: arrow keys for cell navigation, Enter to edit, Esc to cancel       |
| **Language**            | English primary (Samsung DSR standard); Korean labels configurable via Mendix i18n; date/number formats respect locale              |
| **Time zones**          | All timestamps stored in UTC; displayed in user's local time zone (auto-detected or configurable)                                   |
| **Large screens**       | Primary target: 1920x1080 desktop monitors; responsive layout supports 1366x768 minimum; Gantt horizontal scroll for wide timelines |

---

## Sources

- [A1 — Business Model](a1-business-model.md) — 7 features, 56 business rules, 12 use cases
- [A2 — Data Model](a2-data-model.md) — 28 entities, 4 domains, Oracle DDL, ES indices
- [A3 — Process Model](a3-process-model.md) — 13 processes, 5 state machines, CRUD matrix
- [Solution Architecture (input)](../.command/000_init_project/input/docs/01-solution-architecture.md) — original system architecture
- [Data Sync & ETL (input)](../.command/000_init_project/input/docs/05-data-sync-etl.md) — Oracle-to-ES sync design
- [AX A4 Technical Architecture Guide](../.ax/analysis/A4_TECHNICAL_ARCHITECTURE_GUIDE.md) — AX v2.0.0 framework reference

---

_Part of the IRIS Analysis Handoff (A1-A5) — AX Transformation Framework v2.0.0 — Amoza, March 2026_
