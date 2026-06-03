# D7b: Hypothesis Cards — IRIS Resources Planning

> **AX Phase**: DISCOVER | **Template**: T10 — Hypothesis Card (6 cards)
> **Project**: IRIS (Intelligent Resource Information System)
> **Customer**: Samsung Electronics — Device Solutions Research (DSR)
> **Builder**: Amoza
> **Date**: 2026-03-21
> **Author**: CXO with AI assistance
> **Status**: All hypotheses Unvalidated (DISCOVER Phase)

---

## Document Purpose

This document contains 6 hypothesis cards for the most critical assumptions identified in the IRIS Assumptions Register (D7a). Each hypothesis is derived from a Critical or High-risk assumption (risk score >= 12) and includes a structured validation plan with clear success criteria, experiment design, timeline, and decision framework.

These hypotheses represent the biggest unknowns in the IRIS project. Validating them early — before committing to full-scale development — is essential for risk management per the AX Framework methodology (Principle 2: Validated Learning; Principle 11: Fail Fast, Learn Faster).

### CXO Perspective

From a user experience standpoint, every hypothesis in this document has direct implications for how Samsung DSR planners will interact with IRIS daily. The CXO lens ensures that technical feasibility is never evaluated in isolation — each validation experiment includes a user trust or usability component, because a technically correct system that planners refuse to use is a failed system.

---

## Hypothesis Index

| ID   | Title                           | Category  | Risk Score | Source Assumption(s) | Status      |
| ---- | ------------------------------- | --------- | :--------: | -------------------- | ----------- |
| H-01 | New Build vs Upgrade            | Solution  |     20     | SO-01, PR-01         | Unvalidated |
| H-02 | Technology Stack                | Technical |     15     | SO-02, TE-05, TE-06  | Unvalidated |
| H-03 | Concurrent Editing Feasibility  | Technical |     20     | SO-03, TE-07, AD-03  | Unvalidated |
| H-04 | Samsung AI Services Integration | Technical |     16     | TE-04, VA-05         | Unvalidated |
| H-05 | PM Planner Component Reuse      | Value     |     15     | SO-01, PR-01         | Unvalidated |
| H-06 | Elasticsearch at Scale          | Technical |     12     | TE-05, TE-10         | Unvalidated |

---

---

## H-01: New Build vs Upgrade

### Metadata

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Hypothesis ID** | H-01                                           |
| **Project**       | IRIS (Intelligent Resource Information System) |
| **Product**       | IRIS by Amoza                                  |
| **Sprint/Phase**  | DISCOVER                                       |
| **Date**          | 2026-03-21                                     |
| **Owner**         | CXO / Amoza Tech Lead                          |

---

### Hypothesis Statement

We believe **building IRIS from scratch on Mendix 10 will deliver value faster than attempting to upgrade PM Planner**.

Will result in **faster time-to-production, lower total cost, and complete coverage of all 13 Samsung requirements (Req 0-12) with a clean, maintainable architecture**.

For **Samsung DSR resource planning teams across 5 global sites (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung)**.

Because **PM Planner's Mendix 7/8 architecture fundamentally cannot support concurrent editing, per-project versioning, or delta sync. These are not incremental features — they require new foundational architecture. Upgrading PM Planner would mean migrating Mendix versions, refactoring tightly coupled code, AND building all missing components on top of legacy technical debt.**

---

### Assumption Category

| Category  | Selected |
| --------- | -------- |
| Market    | [ ]      |
| Customer  | [ ]      |
| Problem   | [ ]      |
| Solution  | [x]      |
| Value     | [ ]      |
| Technical | [ ]      |

**Source Assumption IDs**: SO-01 (New build faster than upgrade), PR-01 (PM Planner cannot be upgraded)

---

### Risk Assessment

| Dimension         |  Score | Rationale                                                                                                                                                                                     |
| ----------------- | -----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Impact (1-5)      |      5 | If upgrading PM Planner is actually faster and cheaper, the new-build decision wastes months and budget. Samsung could question Amoza's judgment and the entire project approach.             |
| Uncertainty (1-5) |      4 | No formal side-by-side effort comparison has been performed. The architectural gap argument is strong but qualitative. PM Planner codebase has not been fully audited for upgrade complexity. |
| **Risk Score**    | **20** | **CRITICAL (Leap of Faith)**                                                                                                                                                                  |

---

### Success Metrics

| #   | Metric                                                  | Target                                                                                   | Measurement Method                                                               | Timeline |
| --- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------- |
| 1   | Effort comparison: new build vs upgrade (person-months) | New build effort <= 120% of upgrade effort                                               | Detailed estimation by Amoza engineering team for both paths                     | 2 weeks  |
| 2   | Requirement coverage: new build vs upgrade              | New build covers 13/13 requirements; upgrade covers < 10/13 within same timeline         | Map each approach against Req 0-12 with feasibility assessment                   | 2 weeks  |
| 3   | Architecture quality score                              | New build scores significantly higher on maintainability, scalability, and extensibility | Architecture review comparing new-build IRIS vs hypothetical upgraded PM Planner | 1 week   |
| 4   | Technical debt identification in PM Planner             | >= 3 significant technical debt items that would complicate upgrade                      | PM Planner codebase audit (if access available)                                  | 1 week   |

---

### Validation Method

Conduct a formal two-track analysis: (1) audit PM Planner's Mendix 9.x architecture to assess migration complexity to Mendix 10, identifying breaking changes, deprecated features, and tightly coupled components; (2) estimate effort for both upgrade and new-build paths against all 13 Samsung requirements. Samsung IT will be consulted for PM Planner source access. The Amoza Tech Lead will produce a risk-adjusted comparison covering effort, timeline, risk, quality, and maintainability.

---

### Minimum Success Criteria

The new-build approach (IRIS) is validated if ALL of the following are true:

1. **New build total effort is <= 150% of upgrade effort** (accounting for the quality advantage of clean architecture)
2. **New build achieves 13/13 requirement coverage** while upgrade path achieves <= 10/13 within the same timeline
3. **PM Planner audit reveals >= 3 significant technical debt items** that would complicate upgrade (e.g., tightly coupled microflows, hardcoded business logic, undocumented customizations)
4. **Mendix 9-to-10 migration for PM Planner is estimated at >= 4 weeks** of effort due to breaking changes and deprecated features

---

### Timeline

| Milestone     | Date                    |
| ------------- | ----------------------- |
| Start Date    | 2026-03-24 (Week 2)     |
| End Date      | 2026-03-31 (Week 3)     |
| Decision Date | 2026-03-31 (Week 3 end) |

---

### Resources Needed

| Resource Type | Detail                                                                             |
| ------------- | ---------------------------------------------------------------------------------- |
| People        | 1 Amoza senior engineer (50%, 2 weeks), 1 Samsung IT contact for PM Planner access |
| Tools         | Mendix Studio Pro 10, Mendix migration toolkit documentation                       |
| Budget        | Minimal (internal effort only)                                                     |
| Time          | 10-15 person-days over 2 weeks                                                     |

---

### Result

| Field  | Value       |
| ------ | ----------- |
| Status | Unvalidated |

---

### Evidence

To be completed after validation experiment is finished.

---

### Decision

| Decision         | Selected                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| Persevere        | [ ] -- Hypothesis confirmed. Proceed with IRIS new-build approach.                                  |
| Pivot            | [ ] -- Hypothesis invalidated. Evaluate upgrading PM Planner with targeted architectural additions. |
| More Data Needed | [ ] -- Results inconclusive. Request PM Planner access and extend validation.                       |

**Decision Rationale**: Pending validation.

---

### Fallback Plan

If this hypothesis is invalidated (upgrade path is significantly faster at < 60% of new build effort AND covers >= 12/13 requirements), then:

- Reconsider the upgrade approach with targeted architectural additions for concurrent editing and versioning
- Commission a detailed PM Planner upgrade plan with phased delivery
- Maintain new-build as backup if upgrade encounters insurmountable technical debt during execution

---

### CXO UX Perspective

This is the foundational UX decision. A new build enables IRIS to deliver a modern, coherent user experience designed from the ground up for Samsung planners' actual workflows. An upgrade path inherits PM Planner's existing UI patterns and interaction models, which were designed for single-user, sequential editing. The concurrent editing experience (Req 3), real-time collaboration indicators, and modern analytical views are significantly easier to implement well in a clean architecture where UX patterns are consistent from day one.

---

### Action Items

| #   | Action                                                   | Owner            | Due Date   |
| --- | -------------------------------------------------------- | ---------------- | ---------- |
| 1   | Request PM Planner Mendix project access from Samsung IT | Danniel Ng (CEO) | 2026-03-24 |
| 2   | Review Mendix 9-to-10 migration documentation            | Amoza Tech Lead  | 2026-03-26 |
| 3   | Complete effort comparison and present recommendation    | Amoza Tech Lead  | 2026-03-31 |
| 4   | Update assumptions register with validation results      | CXO              | 2026-04-01 |

---

---

## H-02: Technology Stack

### Metadata

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Hypothesis ID** | H-02                                           |
| **Project**       | IRIS (Intelligent Resource Information System) |
| **Product**       | IRIS by Amoza                                  |
| **Sprint/Phase**  | DISCOVER                                       |
| **Date**          | 2026-03-21                                     |
| **Owner**         | CXO / Amoza Tech Lead                          |

---

### Hypothesis Statement

We believe **Mendix 10 + Oracle 19c + Elasticsearch 8.x is the optimal stack for IRIS**.

Will result in **a technology platform that satisfies all IRIS requirements — Mendix for rapid UI and workflow development, Oracle for transactional data integrity, and Elasticsearch for sub-second multi-dimensional analytical queries**.

For **Samsung DSR's IRIS system operating across 5 global sites with hundreds of concurrent users**.

Because **Mendix 10 combines Samsung's mandated low-code platform with proven analytical capabilities: Oracle 19c is Samsung's standard enterprise database with proven reliability, and Elasticsearch 8.x is the industry standard for multi-dimensional aggregation queries that Mendix's built-in query capabilities cannot efficiently perform at Samsung's data scale.**

---

### Assumption Category

| Category  | Selected |
| --------- | -------- |
| Market    | [ ]      |
| Customer  | [ ]      |
| Problem   | [ ]      |
| Solution  | [ ]      |
| Value     | [ ]      |
| Technical | [x]      |

**Source Assumption IDs**: SO-02 (Tech stack fit), TE-05 (ES performance), TE-06 (Server provisioning)

---

### Risk Assessment

| Dimension         |  Score | Rationale                                                                                                                                                                                       |
| ----------------- | -----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Impact (1-5)      |      5 | Technology stack is foundational — if any component is wrong, architectural rework is extremely expensive.                                                                                      |
| Uncertainty (1-5) |      3 | Each technology is individually proven and well-understood. The risk lies in their combination and Samsung-specific scale requirements. Mendix 10 + ES integration is less commonly documented. |
| **Risk Score**    | **15** | **HIGH**                                                                                                                                                                                        |

---

### Success Metrics

| #   | Metric                                               | Target                                                                          | Measurement Method                         | Timeline |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------ | -------- |
| 1   | Mendix 10 pluggable widget: xDHTML Gantt integration | Working Gantt widget with data binding and task editing within Mendix 10        | Build and demonstrate widget prototype     | 3 weeks  |
| 2   | Mendix 10 pluggable widget: ECharts.js integration   | Working chart widget with multi-chart-type rendering and drill-down             | Build and demonstrate widget prototype     | 3 weeks  |
| 3   | ES aggregation query performance                     | < 2 second response time for multi-dimensional aggregation across 500K+ records | Performance benchmark with synthetic data  | 2 weeks  |
| 4   | Oracle-to-ES sync latency                            | < 5 seconds for event-driven sync; < 15 minutes for scheduled reconciliation    | Sync prototype with timing measurements    | 2 weeks  |
| 5   | Mendix 10 + Oracle 19c transactional performance     | < 1 second response for save operations with 10+ simultaneous concurrent users  | Load test with concurrent write operations | 2 weeks  |

---

### Validation Method

Build a minimal vertical slice of IRIS that exercises all three technology layers: (1) Mendix 10 layer with a simple planning page, Gantt widget, chart widget, and save microflow; (2) Oracle 19c layer with a subset of the IRIS domain model and 500K synthetic records; (3) ES layer with index patterns loaded with 500K+ synthetic documents; (4) Sync layer with Oracle-to-ES sync using Mendix after-commit events and scheduled reconciliation. End-to-end flow: user edits P/M plan in Gantt, saves to Oracle, syncs to ES, analytical view queries ES.

---

### Minimum Success Criteria

The technology stack is validated if ALL of the following are true:

1. **Gantt and ECharts widgets render correctly** in Mendix 10 with data binding to Mendix entities
2. **ES aggregation queries return in < 2 seconds** for 500K+ records with 3+ dimension grouping
3. **Oracle concurrent writes succeed** with 10+ simultaneous save operations without deadlocks or data corruption
4. **Oracle-to-ES sync completes within 5 seconds** for event-driven updates
5. **No blocking incompatibility discovered** between Mendix 10, Oracle 19c, and ES 8.x

---

### Timeline

| Milestone     | Date                    |
| ------------- | ----------------------- |
| Start Date    | 2026-03-24 (Week 2)     |
| End Date      | 2026-04-14 (Week 5)     |
| Decision Date | 2026-04-14 (Week 5 end) |

---

### Resources Needed

| Resource Type | Detail                                                                                                                                                                |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| People        | 1 Amoza frontend developer (80%, 3 weeks for widgets), 1 Amoza backend developer (60%, 2 weeks for Oracle + ES), 1 Amoza senior engineer (20%, architecture guidance) |
| Tools         | xDHTML Gantt evaluation license, ECharts.js (open source), Mendix development license                                                                                 |
| Budget        | ~$2K for xDHTML Gantt evaluation license + $500 for cloud dev infrastructure                                                                                          |
| Time          | ~40 person-days over 3 weeks                                                                                                                                          |

---

### Result

| Field  | Value       |
| ------ | ----------- |
| Status | Unvalidated |

---

### Evidence

To be completed after validation experiment is finished.

---

### Decision

| Decision         | Selected                                                                   |
| ---------------- | -------------------------------------------------------------------------- |
| Persevere        | [ ] -- All 5 success criteria met. Confirm technology stack.               |
| Pivot            | [ ] -- 1-2 criteria fail. Evaluate alternative for failing component only. |
| More Data Needed | [ ] -- Results inconclusive. Extend integration spike.                     |

**Decision Rationale**: Pending validation.

---

### Fallback Plan

If this hypothesis is invalidated:

- **Partial failure (1-2 components)**: Replace only the failing component (e.g., if ES performance is insufficient, evaluate Oracle OLAP views or Apache Druid as alternative analytical engine; if widget integration fails, evaluate alternative JavaScript libraries compatible with Mendix 10 pluggable widget API)
- **Major failure (3+ components)**: Re-evaluate entire technology stack; consider alternative analytics engine, alternative widget library, or non-Mendix approach (escalate to Samsung as Mendix is their mandated platform)

---

### CXO UX Perspective

The technology stack directly determines the quality ceiling for the user experience. Mendix 10's pluggable widget API defines what is possible for the Gantt chart interactions, ECharts visualizations, and the concurrent editing diff view. If widgets render slowly or behave inconsistently, planners will perceive IRIS as unreliable regardless of the underlying data accuracy. The ES response time target (< 2 seconds) is a UX requirement: analytical views must feel interactive, not like batch-processed reports. The CXO will participate in widget prototype evaluation to assess interaction quality, visual polish, and responsiveness from a planner's perspective.

---

### Action Items

| #   | Action                                             | Owner               | Due Date   |
| --- | -------------------------------------------------- | ------------------- | ---------- |
| 1   | Set up Mendix 10 development environment           | Amoza Tech Lead     | 2026-03-24 |
| 2   | Obtain xDHTML Gantt evaluation license             | Amoza Frontend Lead | 2026-03-24 |
| 3   | Deploy Elasticsearch 8.x dev cluster               | Amoza Backend Lead  | 2026-03-28 |
| 4   | Build synthetic data generator for IRIS test data  | Amoza Backend Lead  | 2026-04-04 |
| 5   | Complete widget prototypes and full vertical slice | Amoza Team          | 2026-04-14 |

---

---

## H-03: Concurrent Editing Feasibility

### Metadata

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Hypothesis ID** | H-03                                           |
| **Project**       | IRIS (Intelligent Resource Information System) |
| **Product**       | IRIS by Amoza                                  |
| **Sprint/Phase**  | DISCOVER                                       |
| **Date**          | 2026-03-21                                     |
| **Owner**         | CXO / Amoza Tech Lead                          |

---

### Hypothesis Statement

We believe **concurrent P/M plan editing with auto-merge and conflict resolution is technically feasible on Mendix 10 and will be trusted by Samsung planners**.

Will result in **Samsung DSR planners being able to simultaneously edit the same P/M plan from different sites without data loss, with auto-merge accuracy >= 99% for non-conflicting changes, and planners trusting the system enough to actually use concurrent editing daily**.

For **Samsung DSR resource planners across 5 global sites who currently wait for single-editor access to P/M plans**.

Because **WebSocket + optimistic locking patterns are proven in collaborative editing systems. The proposed architecture separates changes by project/row, enabling safe auto-merge when different planners edit different projects, and provides clear conflict resolution (diff view with Pass/Overwrite) when they edit the same project.**

---

### Assumption Category

| Category  | Selected |
| --------- | -------- |
| Market    | [ ]      |
| Customer  | [ ]      |
| Problem   | [ ]      |
| Solution  | [ ]      |
| Value     | [ ]      |
| Technical | [x]      |

**Source Assumption IDs**: SO-03 (Concurrent editing feasible), TE-07 (WebSocket in Mendix), AD-03 (Planner trust)

---

### Risk Assessment

| Dimension         |  Score | Rationale                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Impact (1-5)      |      5 | Concurrent editing (Req 3) is the most explicitly demanded capability. If technically infeasible or untrustworthy, IRIS's core value proposition for day-to-day planner workflow is compromised. Samsung may question whether IRIS justifies the investment.                                                                                                                   |
| Uncertainty (1-5) |      4 | Architecture has been designed on paper (WebSocket + conflict detection engine + diff view widget). But no working prototype exists, Mendix 10's WebSocket support for this pattern is unproven, auto-merge correctness at scale with real-world editing patterns is unknown, and user trust in automated merge is highly uncertain. This is the highest-risk feature in IRIS. |
| **Risk Score**    | **20** | **CRITICAL (Leap of Faith)**                                                                                                                                                                                                                                                                                                                                                   |

---

### Success Metrics

| #   | Metric                                        | Target                                                                                  | Measurement Method                                               | Timeline |
| --- | --------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| 1   | Auto-merge accuracy (non-conflicting changes) | >= 99% correct merges across 100+ test scenarios                                        | Automated test suite with diverse editing patterns               | 3 weeks  |
| 2   | Conflict detection accuracy                   | 100% — every true conflict detected, zero false negatives                               | Test suite with intentional same-row edits by 2+ users           | 3 weeks  |
| 3   | False positive rate                           | < 5% conflicts flagged when none exists                                                 | Test suite with near-concurrent but non-overlapping edits        | 3 weeks  |
| 4   | WebSocket connection stability                | Zero dropped connections over 1-hour sustained editing session with 10 concurrent users | Automated WebSocket stability test                               | 2 weeks  |
| 5   | Save-to-sync latency                          | < 3 seconds from one user's save to all other users seeing the change                   | Timing measurement with 5+ concurrent clients                    | 2 weeks  |
| 6   | Planner trust score                           | >= 7/10 average trust rating from Samsung planner user test participants                | Post-test survey after hands-on session with 4+ Samsung planners | Week 5-6 |

---

### Validation Method

Three-phase validation: (1) Technical Prototype (Weeks 2-4) — build WebSocket proof-of-concept in Mendix 10 with conflict detection engine, auto-merge logic, diff view widget, and version snapshot mechanism, then integrate into complete concurrent editing flow with 3+ editors; (2) Stress Testing (Weeks 4-5) — create 100+ test scenarios covering simple non-overlap, adjacent rows, cascading dependencies, simultaneous saves, and Samsung-specific PM dimension patterns, then scale test with 10-20 concurrent editors and simulated 200ms+ WAN latency; (3) User Trust Validation (Weeks 5-6) — demonstrate prototype to 4-6 Samsung planners, conduct hands-on user test with realistic P/M plan, and administer trust survey.

---

### Minimum Success Criteria

This hypothesis is validated if ALL of the following are true:

1. **Technical feasibility**: Auto-merge accuracy >= 99%, conflict detection = 100%, zero data loss across all test scenarios
2. **Scalability**: System supports 10+ concurrent editors for 1+ hours without degradation
3. **User trust**: Average trust score >= 7/10 from Samsung planner user test (minimum 4 participants)
4. **Latency**: Save-to-sync latency < 3 seconds on local network, < 5 seconds with 200ms simulated WAN latency

---

### Timeline

| Milestone     | Date                    |
| ------------- | ----------------------- |
| Start Date    | 2026-03-24 (Week 2)     |
| End Date      | 2026-04-21 (Week 6)     |
| Decision Date | 2026-04-21 (Week 6 end) |

---

### Resources Needed

| Resource Type | Detail                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| People        | 1 Amoza backend engineer (80%, 4 weeks), 1 Amoza frontend engineer (50%, 2 weeks), 1 Amoza UX designer (30%, 1 week), 4-6 Samsung planners (0.5 day for user test) |
| Tools         | WebSocket testing tools (wscat, Postman), browser dev tools, screen recording for user tests                                                                       |
| Budget        | Minimal (internal effort + Samsung planner time)                                                                                                                   |
| Time          | ~50 person-days over 5 weeks                                                                                                                                       |

---

### Result

| Field  | Value       |
| ------ | ----------- |
| Status | Unvalidated |

---

### Evidence

To be completed after validation experiment is finished.

---

### Decision

| Decision         | Selected                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| Persevere        | [ ] -- All success criteria met; planner trust >= 7/10. Proceed with concurrent editing as core Req 3 feature. |
| Pivot            | [ ] -- Technical criteria met but trust < 7/10, or auto-merge accuracy < 95%. Simplify or fall back.           |
| More Data Needed | [ ] -- WebSocket PoC succeeds but scale test not conclusive. Extend Phase 2.                                   |

**Decision Rationale**: Pending validation.

---

### Fallback Plan

If this hypothesis is invalidated:

- **Trust failure (tech works, planners distrust)**: Simplify the UX — show merge preview before applying, add "undo last merge" capability, build trust gradually through transparency. Re-test with simplified flow.
- **Technical failure (auto-merge < 95% or data loss)**: Fall back to pessimistic locking with improved lock management — lock at project level (not entire plan), show lock holder and lock duration, enable lock request/handoff between planners. This is a significant UX downgrade but preserves data integrity.
- **Platform limitation (Mendix WebSocket cannot sustain connections)**: Evaluate polling-based approach with 3-5 second refresh intervals as degraded but functional alternative.

---

### CXO UX Perspective

This is the single most important UX hypothesis in IRIS. Concurrent editing transforms the planner experience from "wait your turn" to "work together in real time." But the UX must earn trust: planners need to see exactly what changed, who changed it, and have confidence that auto-merge is correct. The diff view design is critical — it must be immediately comprehensible to non-technical planners under time pressure. The CXO will lead the user trust validation in Phase 3, designing the test scenarios to represent realistic planner workflows (not just edge cases) and observing behavioral trust signals (do planners hesitate before accepting merges? do they manually verify after auto-merge?). A technically perfect system that planners refuse to trust is a failed system.

---

### Action Items

| #   | Action                                                   | Owner              | Due Date   |
| --- | -------------------------------------------------------- | ------------------ | ---------- |
| 1   | Begin WebSocket PoC implementation in Mendix 10          | Amoza Backend Lead | 2026-03-24 |
| 2   | Design diff view widget wireframes                       | CXO                | 2026-03-28 |
| 3   | Create auto-merge test scenario catalog (100+ scenarios) | Amoza QA           | 2026-04-04 |
| 4   | Schedule Samsung planner user test session               | Danniel Ng (CEO)   | 2026-04-07 |
| 5   | Lead user trust validation and report findings           | CXO                | 2026-04-21 |

---

---

## H-04: Samsung AI Services Integration

### Metadata

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Hypothesis ID** | H-04                                           |
| **Project**       | IRIS (Intelligent Resource Information System) |
| **Product**       | IRIS by Amoza                                  |
| **Sprint/Phase**  | DISCOVER                                       |
| **Date**          | 2026-03-21                                     |
| **Owner**         | CXO / Samsung AI Team + Amoza                  |

---

### Hypothesis Statement

We believe **Samsung AI Services can generate meaningful Excel PIVOT reports from IRIS data**.

Will result in **Samsung DSR managers saving 2+ hours per week on manual report preparation and gaining new analytical perspectives on resource allocation that pre-configured chart reports cannot surface automatically**.

For **Samsung DSR department heads and site directors who currently prepare or commission manual Excel reports for resource analysis**.

Because **the Samsung AI Services API supports structured data input and formatted output, and has been trained on Samsung data patterns to identify resource allocation trends, anomalies, and optimization opportunities.**

---

### Assumption Category

| Category  | Selected |
| --------- | -------- |
| Market    | [ ]      |
| Customer  | [ ]      |
| Problem   | [ ]      |
| Solution  | [ ]      |
| Value     | [x]      |
| Technical | [ ]      |

**Source Assumption IDs**: TE-04 (Samsung AI Services stable), VA-05 (AI reporting adds value)

---

### Risk Assessment

| Dimension         |  Score | Rationale                                                                                                                                                                                                                                                                   |
| ----------------- | -----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Impact (1-5)      |      4 | Req 11 is one of 13 requirements but not architecturally foundational. If AI reporting fails, IRIS still delivers core value through Req 0-10 and Req 12. However, Samsung DSR has highlighted AI as a strategic differentiator, making failure more impactful politically. |
| Uncertainty (1-5) |      4 | Zero visibility into Samsung AI Services: its API, capabilities, maturity, reliability, and output quality are all unknown. This is entirely a Samsung-controlled dependency.                                                                                               |
| **Risk Score**    | **16** | **HIGH**                                                                                                                                                                                                                                                                    |

---

### Success Metrics

| #   | Metric                   | Target                                                                                                             | Measurement Method                                            | Timeline |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- | -------- |
| 1   | API accessibility        | Samsung AI Services API endpoint accessible from IRIS dev environment with valid authentication                    | API connection test                                           | 2 weeks  |
| 2   | API response quality     | AI-generated Excel PIVOT report is structurally valid and contains meaningful data groupings for 3+ test scenarios | Human review of AI output against known data                  | 3 weeks  |
| 3   | Response time            | < 60 seconds from request to Excel file delivery                                                                   | Timing measurement across 10+ requests                        | 3 weeks  |
| 4   | Manager value assessment | >= 3 of 5 Samsung DSR managers rate AI reports as "useful" or "very useful"                                        | Manager feedback session after reviewing AI-generated reports | 4 weeks  |

---

### Validation Method

Four-step integration spike (Weeks 4-7): (1) Obtain Samsung AI Services API documentation from Samsung AI team — review endpoints, authentication, payload format, response format, rate limits; (2) Prepare 3 representative IRIS data payloads — site-level resource allocation summary, project-level P/M breakdown by dimension, actual vs plan gap analysis; (3) Send test payloads to Samsung AI Services and evaluate response quality, structural validity, and response time; (4) Share AI-generated reports with 3-5 Samsung DSR managers and collect feedback on usefulness, accuracy, and comparison to current manual reports.

---

### Minimum Success Criteria

1. **Samsung AI Services API is accessible** and responds to IRIS data payloads within 60 seconds
2. **AI-generated Excel PIVOT reports contain structurally valid data groupings** (not garbage output)
3. **At least 3 of 5 Samsung managers** rate the AI reports as "useful" or better

---

### Timeline

| Milestone     | Date                    |
| ------------- | ----------------------- |
| Start Date    | 2026-04-07 (Week 4)     |
| End Date      | 2026-04-28 (Week 7)     |
| Decision Date | 2026-04-28 (Week 7 end) |

---

### Resources Needed

| Resource Type | Detail                                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| People        | 1 Amoza backend engineer (30%, 2 weeks), Samsung AI team contact (API access + documentation), 3-5 Samsung DSR managers (1 hour for feedback) |
| Tools         | API testing tools (Postman), Samsung AI Services credentials                                                                                  |
| Budget        | Minimal (internal effort only)                                                                                                                |
| Time          | ~10 person-days over 3 weeks                                                                                                                  |

---

### Result

| Field  | Value       |
| ------ | ----------- |
| Status | Unvalidated |

---

### Evidence

To be completed after validation experiment is finished.

---

### Decision

| Decision         | Selected                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| Persevere        | [ ] -- API works, output quality acceptable, managers find value. Proceed with AI reporting module.           |
| Pivot            | [ ] -- Samsung AI Services unavailable. Evaluate alternative AI approach within Samsung security constraints. |
| More Data Needed | [ ] -- API accessible but output quality unclear. Iterate on data payload structure.                          |

**Decision Rationale**: Pending validation.

---

### Fallback Plan

If this hypothesis is invalidated:

- **API unavailable or immature**: Move Req 11 to Phase 2 backlog. Focus Phase 1 on standard reporting (Req 10) using ECharts visualizations and configurable Excel export. Revisit when Samsung AI Services matures.
- **Output quality is low**: Iterate on data payload structure — provide richer context metadata to the AI service. If quality remains unacceptable after 2 iterations, deprioritize to Phase 2.
- **Samsung confirms no AI path is acceptable**: Remove Req 11 from IRIS scope entirely. Document decision. Ensure IRIS delivers full value through Req 0-10 and Req 12.

---

### CXO UX Perspective

AI-generated reports must feel like a productivity upgrade, not a novelty. The UX challenge is managing expectations: planners and managers must understand what the AI can and cannot do. The report request interface should be conversational ("Show me headcount gaps by site for next quarter") rather than form-based. The CXO will evaluate AI output from a usability standpoint: Are the generated PIVOT tables readable? Do the groupings match how Samsung managers actually think about their data? Is the Excel formatting professional enough for Samsung internal distribution? If the AI output requires significant manual cleanup, the time-saving value proposition collapses.

---

### Action Items

| #   | Action                                                               | Owner              | Due Date   |
| --- | -------------------------------------------------------------------- | ------------------ | ---------- |
| 1   | Request Samsung AI Services API documentation and access credentials | Danniel Ng (CEO)   | 2026-04-07 |
| 2   | Identify Samsung AI team contact for IRIS integration support        | Danniel Ng (CEO)   | 2026-04-07 |
| 3   | Prepare test data payloads in representative formats                 | Amoza Backend Lead | 2026-04-14 |
| 4   | Execute integration test and evaluate output quality                 | Amoza + Samsung AI | 2026-04-21 |
| 5   | Conduct manager feedback session                                     | CXO + Danniel Ng   | 2026-04-28 |

---

---

## H-05: PM Planner Component Reuse

### Metadata

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Hypothesis ID** | H-05                                           |
| **Project**       | IRIS (Intelligent Resource Information System) |
| **Product**       | IRIS by Amoza                                  |
| **Sprint/Phase**  | DISCOVER                                       |
| **Date**          | 2026-03-21                                     |
| **Owner**         | CXO / Amoza Tech Lead                          |

---

### Hypothesis Statement

We believe **selected PM Planner components (xDHTML Gantt patterns, ECharts visualizations, PM dimension model) can be adapted for IRIS on Mendix 10, reducing development time by 20-30%**.

Will result in **4-6 weeks of saved development effort compared to building all components from scratch, while preserving institutional knowledge embedded in PM Planner's data structures and interaction patterns**.

For **the IRIS project team and Samsung DSR planners who need continuity of domain concepts and familiar interaction patterns**.

Because **PM Planner, despite its technical limitations, has accumulated years of domain knowledge in its data structures, reference data, and dimension hierarchies. These represent Samsung DSR's actual organizational and planning taxonomy. Additionally, the Gantt chart interaction patterns and ECharts visualization configurations are proven to work for Samsung's planning workflows.**

---

### Assumption Category

| Category  | Selected |
| --------- | -------- |
| Market    | [ ]      |
| Customer  | [ ]      |
| Problem   | [ ]      |
| Solution  | [ ]      |
| Value     | [x]      |
| Technical | [ ]      |

**Source Assumption IDs**: SO-01 (New build faster than upgrade), PR-01 (PM Planner cannot be upgraded)

---

### Risk Assessment

| Dimension         |  Score | Rationale                                                                                                                                                                                                          |
| ----------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Impact (1-5)      |      5 | If reuse saves 20-30% of development time as claimed, failing to reuse means 4-6 weeks of additional effort. If PM Planner components are incompatible with Mendix 10, the team wastes time attempting adaptation. |
| Uncertainty (1-5) |      3 | PM Planner's domain model is partially documented. Gantt and ECharts patterns are JavaScript-based and likely adaptable. Actual compatibility with Mendix 10 pluggable widget API is unknown until tested.         |
| **Risk Score**    | **15** | **HIGH**                                                                                                                                                                                                           |

---

### Success Metrics

| #   | Metric                           | Target                                                                                                                        | Measurement Method                                  | Timeline |
| --- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------- |
| 1   | PM dimension model documentation | Complete mapping of all PM dimensions (Stage, Block, Function, Activity, SW/HW, SwWorkItem) with valid values and hierarchies | Schema analysis + planner validation                | 2 weeks  |
| 2   | Organization hierarchy mapping   | Complete mapping of Production Line > Site > Team > Group > Part for all 5 DS sites                                           | PM Planner data analysis + SMDM/GHRP reconciliation | 2 weeks  |
| 3   | Mendix 10 widget compatibility   | xDHTML Gantt and ECharts patterns from PM Planner can be adapted to Mendix 10 pluggable widget API                            | Widget adaptation prototype                         | 2 weeks  |
| 4   | Effort savings estimate          | Reuse saves >= 20% (4+ weeks) compared to building from scratch                                                               | Effort estimation for both approaches               | 1 week   |
| 5   | Samsung planner validation       | >= 80% of PM dimension model matches Samsung planners' current mental model and terminology                                   | Planner review session                              | 1 week   |

---

### Validation Method

PM Planner domain extraction experiment (Weeks 2-4): (1) Request PM Planner database schema and Mendix project access from Samsung IT; (2) Map PM Planner's domain model entities to IRIS's proposed data model — identify reusable structures, data to migrate, and incompatible patterns; (3) Document all PM dimensions with valid values, hierarchies, and relationships; (4) Assess data quality for migration feasibility; (5) Test xDHTML Gantt and ECharts pattern adaptation to Mendix 10 pluggable widget API; (6) Present extracted dimension model to 2-3 Samsung planners for validation.

---

### Minimum Success Criteria

1. **PM dimension model is documented and validated** by Samsung planners (>= 80% match to current mental model)
2. **Widget patterns are adaptable** to Mendix 10 pluggable widget API (working prototype for at least Gantt OR ECharts)
3. **Data migration from PM Planner to IRIS schema** is technically feasible for reference data
4. **Reuse saves >= 20%** (4+ weeks) of domain modeling and widget development effort

---

### Timeline

| Milestone     | Date                    |
| ------------- | ----------------------- |
| Start Date    | 2026-03-24 (Week 2)     |
| End Date      | 2026-04-07 (Week 4)     |
| Decision Date | 2026-04-07 (Week 4 end) |

---

### Resources Needed

| Resource Type | Detail                                                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| People        | 1 Amoza business analyst (60%, 2 weeks), 1 Amoza frontend developer (40%, 1 week for widget adaptation), 1 Amoza backend engineer (40%, 1 week), 2-3 Samsung planners (2 hours for validation), Samsung IT (database access) |
| Tools         | Mendix Studio Pro 10, PM Planner source access (read-only)                                                                                                                                                                   |
| Budget        | Minimal                                                                                                                                                                                                                      |
| Time          | ~15 person-days over 3 weeks                                                                                                                                                                                                 |

---

### Result

| Field  | Value       |
| ------ | ----------- |
| Status | Unvalidated |

---

### Evidence

To be completed after validation experiment is finished.

---

### Decision

| Decision         | Selected                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Persevere        | [ ] -- Dimension model validated; widget patterns adaptable; >= 20% savings confirmed. Adopt reusable components. |
| Pivot            | [ ] -- Partial reuse only (dimension model but not widgets, or vice versa).                                       |
| More Data Needed | [ ] -- PM Planner access denied. Extend timeline to obtain access.                                                |

**Decision Rationale**: Pending validation.

---

### Fallback Plan

If this hypothesis is invalidated:

- **Full reuse fails (incompatible architecture)**: Model IRIS domain from scratch via Samsung planner interviews and N-PLM master data. Build all widgets from clean implementations. Add 4-6 weeks to domain modeling and widget development timeline.
- **Partial reuse (dimension model works, widgets do not)**: Adopt PM Planner dimension model concepts for IRIS data architecture. Build widgets from scratch using modern Mendix 10 patterns. Savings reduced to ~2 weeks.
- **PM Planner access denied**: Use existing documentation (features list, customer notes, design documents) to reconstruct domain model. Validate with Samsung planners directly. No widget reuse possible.

---

### CXO UX Perspective

Component reuse has a hidden UX benefit: continuity. Samsung planners who have used PM Planner for years have built mental models around its terminology, dimension hierarchies, and Gantt chart interactions. If IRIS preserves these familiar patterns where they work well, adoption friction decreases significantly. However, the CXO must also evaluate which PM Planner UX patterns should NOT be reused — patterns that were confusing, slow, or workaround-inducing. The validation experiment should include asking planners "What do you wish worked differently?" alongside "What do you want to keep the same?" Blind reuse of poor UX patterns would undermine the new-build advantage.

---

### Action Items

| #   | Action                                                          | Owner                 | Due Date   |
| --- | --------------------------------------------------------------- | --------------------- | ---------- |
| 1   | Request PM Planner schema access from Samsung IT                | Danniel Ng (CEO)      | 2026-03-24 |
| 2   | Begin PM dimension model documentation from existing input docs | Amoza BA              | 2026-03-24 |
| 3   | Test xDHTML Gantt pattern adaptation to Mendix 10               | Amoza Frontend Lead   | 2026-03-31 |
| 4   | Schedule Samsung planner validation session                     | Danniel Ng (CEO)      | 2026-04-01 |
| 5   | Complete reuse feasibility assessment                           | CXO + Amoza Tech Lead | 2026-04-07 |

---

---

## H-06: Elasticsearch at Scale

### Metadata

| Field             | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Hypothesis ID** | H-06                                           |
| **Project**       | IRIS (Intelligent Resource Information System) |
| **Product**       | IRIS by Amoza                                  |
| **Sprint/Phase**  | DISCOVER                                       |
| **Date**          | 2026-03-21                                     |
| **Owner**         | CXO / Amoza Tech Lead                          |

---

### Hypothesis Statement

We believe **Elasticsearch can handle multi-dimensional analytical queries across all Samsung DS sites (500K+ allocation records) with sub-second response time**.

Will result in **Samsung DSR managers and analysts experiencing real-time analytical views (world map, headcount portfolio, gap analysis, custom analysis reporting) that feel interactive rather than batch-processed**.

For **Samsung DSR managers and analysts who need multi-dimensional slice-and-dice analysis of resource allocation data across 5 global sites**.

Because **Elasticsearch's columnar aggregation engine is purpose-built for the type of multi-dimensional aggregation queries IRIS requires (grouping by site x department x project x time with sum/avg/count measures), and this query pattern is fundamentally different from Oracle's transactional query optimization. ES enables OLAP-like analytical capability without a traditional data warehouse.**

---

### Assumption Category

| Category  | Selected |
| --------- | -------- |
| Market    | [ ]      |
| Customer  | [ ]      |
| Problem   | [ ]      |
| Solution  | [ ]      |
| Value     | [ ]      |
| Technical | [x]      |

**Source Assumption IDs**: TE-05 (ES performance), TE-10 (Oracle-to-ES sync consistency)

---

### Risk Assessment

| Dimension         |  Score | Rationale                                                                                                                                                                                                                                                               |
| ----------------- | -----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Impact (1-5)      |      4 | If ES cannot deliver required performance, analytical views (Req 8-10) will be slow or require architectural rework. IRIS's analytical capability is a major selling point. However, fallback to Oracle OLAP or materialized views is possible at higher query latency. |
| Uncertainty (1-5) |      3 | ES is well-proven for aggregation workloads at much larger scale than IRIS. The uncertainty is in IRIS-specific factors: index mapping design, query complexity with Samsung's PM dimensions, and Oracle-to-ES sync reliability.                                        |
| **Risk Score**    | **12** | **MEDIUM**                                                                                                                                                                                                                                                              |

---

### Success Metrics

| #   | Metric                                     | Target                                                                                                        | Measurement Method                                                           | Timeline |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------- |
| 1   | Single-dimension aggregation response time | < 500ms for site-level or department-level aggregation across 500K records                                    | ES query benchmark with synthetic data                                       | 2 weeks  |
| 2   | Multi-dimension aggregation response time  | < 2 seconds for 3+ dimension aggregation (site x department x time period) across 500K records                | ES query benchmark with synthetic data                                       | 2 weeks  |
| 3   | Complex aggregation response time          | < 5 seconds for 5+ dimension aggregation with nested sub-aggregations across 1M records                       | ES query benchmark with expanded synthetic data                              | 2 weeks  |
| 4   | World map query performance                | < 1 second for site-level resource statistics (all 5 sites, aggregated by headcount, allocation, utilization) | ES query benchmark simulating world map data load                            | 2 weeks  |
| 5   | Oracle-to-ES sync latency (event-driven)   | < 5 seconds from Oracle commit to ES index update                                                             | Sync prototype with timing measurement                                       | 2 weeks  |
| 6   | Oracle-to-ES sync consistency              | 100% data consistency after scheduled reconciliation (zero missing or stale records)                          | Comparison of Oracle record counts/checksums vs ES document counts/checksums | 2 weeks  |
| 7   | ES cluster stability                       | Zero node failures, zero index corruption over 48-hour continuous operation                                   | Stability test with concurrent read/write load                               | 2 weeks  |

---

### Validation Method

Elasticsearch performance benchmark experiment (Weeks 3-5): (1) Build synthetic data generator producing realistic IRIS P/M records with all dimensions — site (5), department (20+), project (100+), time period (36 months), PM dimensions (Stage, Block, Function, Activity, SW/HW) — targeting 500K-1M records; (2) Design optimized ES index mappings (keyword types for dimensions, date types for time periods, numeric types for measures); (3) Bulk load synthetic data and execute progressively complex aggregation queries — single dimension, multi-dimension, complex nested, and world map simulation; (4) Build Oracle-to-ES sync prototype with event-driven and scheduled reconciliation, measuring latency and consistency; (5) Run 48-hour stability test with concurrent queries and index updates.

---

### Minimum Success Criteria

1. **Single-dimension aggregation < 500ms** for 500K+ records
2. **Multi-dimension aggregation (3+ dims) < 2 seconds** for 500K+ records
3. **World map query < 1 second**
4. **Oracle-to-ES event-driven sync < 5 seconds** latency
5. **100% data consistency** after scheduled reconciliation
6. **48-hour stability** with no cluster issues

---

### Timeline

| Milestone     | Date                    |
| ------------- | ----------------------- |
| Start Date    | 2026-03-31 (Week 3)     |
| End Date      | 2026-04-14 (Week 5)     |
| Decision Date | 2026-04-14 (Week 5 end) |

---

### Resources Needed

| Resource Type | Detail                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| People        | 1 Amoza backend engineer (70%, 3 weeks)                                                                            |
| Tools         | Elasticsearch 8.x cluster (minimum 3 nodes), Kibana (dev tools for query testing), Python/Java for data generation |
| Budget        | ~$300-500 for cloud ES cluster for 3 weeks (if not using Samsung servers)                                          |
| Time          | ~20 person-days over 3 weeks                                                                                       |

---

### Result

| Field  | Value       |
| ------ | ----------- |
| Status | Unvalidated |

---

### Evidence

To be completed after validation experiment is finished.

---

### Decision

| Decision         | Selected                                                                            |
| ---------------- | ----------------------------------------------------------------------------------- |
| Persevere        | [ ] -- All success criteria met. Confirm ES as IRIS analytical engine.              |
| Pivot            | [ ] -- Performance marginal or sync issues. Optimize or evaluate alternatives.      |
| More Data Needed | [ ] -- Results inconclusive at current data volume. Scale test with larger dataset. |

**Decision Rationale**: Pending validation.

---

### Fallback Plan

If this hypothesis is invalidated:

- **Performance marginal (within 2x of targets)**: Invest in index optimization — add caching layer (Redis), pre-aggregate common query patterns into summary indices, optimize mappings with appropriate analyzers. Re-benchmark.
- **Sync consistency issues (queries fine)**: Move to batch sync only (scheduled, not event-driven). Accept higher data latency (15-minute refresh) for guaranteed consistency. Show "data as of" timestamp in UI.
- **Performance consistently > 5x of targets**: Evaluate alternatives — Apache Druid for time-series aggregation, ClickHouse for columnar analytics, or Oracle materialized views for simpler analytical queries with higher latency tolerance.

---

### CXO UX Perspective

Elasticsearch performance directly defines the perceived responsiveness of IRIS's analytical experience. The UX target is "interactive analysis" — when a manager clicks a site on the world map, drills into a department, or filters by time period, the results must appear within the time it takes to shift visual attention (< 2 seconds). If analytical views take 5+ seconds, managers will mentally classify IRIS as a "reporting tool" rather than an "analytical tool," and they will continue preparing manual Excel analyses on the side. The world map view is the flagship analytical experience — it must load in < 1 second to create the impression of a real-time operational dashboard. The CXO will evaluate not just raw query performance but perceived performance: do loading indicators feel responsive? Does progressive loading (show partial results first) improve the experience?

---

### Action Items

| #   | Action                                             | Owner                 | Due Date   |
| --- | -------------------------------------------------- | --------------------- | ---------- |
| 1   | Deploy ES 8.x development cluster                  | Amoza Backend Lead    | 2026-03-28 |
| 2   | Build synthetic data generator                     | Amoza Backend Lead    | 2026-04-04 |
| 3   | Complete query benchmarks                          | Amoza Backend Lead    | 2026-04-07 |
| 4   | Complete sync prototype and stability test         | Amoza Backend Lead    | 2026-04-14 |
| 5   | Present ES benchmark report with CXO UX assessment | CXO + Amoza Tech Lead | 2026-04-14 |

---

---

## Cross-Hypothesis Dependency Map

The 6 hypotheses are interconnected. This map shows validation sequencing and dependencies.

```
H-01 (New Build vs Upgrade) -----> Validates foundation for entire IRIS approach
    |
    +---> H-05 (PM Planner Reuse) -----> Informs what to carry forward from PM Planner
    |
    +---> H-02 (Tech Stack) -----> Validates platform before committing to full build
              |
              +---> H-06 (ES Scale) -----> Deep dive on ES specifically (subset of H-02)
              |
              +---> H-03 (Concurrent Editing) -----> Highest-risk single feature
                        |
                        +---> Validates/Invalidates Req 3 (core Samsung requirement)
                        |
                        +---> Feeds into adoption risk (AD-03: planner trust)

H-04 (AI Reporting) -----> Independent track (Samsung dependency)
                           Can be deprioritized without affecting other hypotheses
```

### Recommended Validation Sequence

| Order | Hypothesis                     | Weeks | Rationale                                                                            |
| :---: | ------------------------------ | :---: | ------------------------------------------------------------------------------------ |
|   1   | **H-01**: New Build vs Upgrade |  2-3  | Must confirm fundamental approach before investing in other validation               |
|   2   | **H-05**: PM Planner Reuse     |  2-4  | Inform IRIS domain modeling; depends on H-01 confirming new build                    |
|   2   | **H-02**: Tech Stack           |  2-5  | Parallel with H-05; validates platform before heavy development                      |
|   3   | **H-03**: Concurrent Editing   |  2-6  | Highest risk; starts early but takes longest; depends on Mendix 10 validation (H-02) |
|   3   | **H-06**: ES Scale             |  3-5  | Subset of H-02; can run in parallel with H-03                                        |
|   4   | **H-04**: AI Reporting         |  4-7  | Samsung dependency; independent; can be deprioritized if needed                      |

---

## Summary

| ID   | Hypothesis           | Category  | Risk | Key Question                                                      | Validation Phase  | Decision By |
| ---- | -------------------- | --------- | :--: | ----------------------------------------------------------------- | :---------------: | :---------: |
| H-01 | New Build vs Upgrade | Solution  |  20  | Is building from scratch really better than upgrading PM Planner? |     DISCOVER      |   Week 3    |
| H-02 | Technology Stack     | Technical |  15  | Does Mendix 10 + Oracle + ES work together for IRIS?              |     DISCOVER      |   Week 5    |
| H-03 | Concurrent Editing   | Technical |  20  | Can we build trustworthy multi-planner auto-merge on Mendix 10?   | DISCOVER / DESIGN |   Week 6    |
| H-04 | AI Reporting         | Value     |  16  | Is Samsung AI Services ready for IRIS integration?                |     DISCOVER      |   Week 7    |
| H-05 | PM Planner Reuse     | Value     |  15  | What can we reuse from PM Planner to accelerate IRIS?             |     DISCOVER      |   Week 4    |
| H-06 | ES Scale             | Technical |  12  | Does ES deliver sub-second analytics at Samsung's data scale?     |     DISCOVER      |   Week 5    |

**Total validation effort**: ~145 person-days over 7 weeks
**Critical path**: H-03 (Concurrent Editing) — longest validation timeline, highest risk, most complex experiment
**CXO critical involvement**: H-03 (user trust validation), H-04 (manager value assessment), H-05 (UX pattern reuse evaluation)

---

## Related Templates

- **T09_ASSUMPTIONS_REGISTER** — Source assumptions (D7a)
- **T10_HYPOTHESIS_CARD** — Template used for each card
- **T11_PROBLEM_VALIDATION_SCORECARD** — Validate problem-level hypotheses

## Related Guides

- **D7_ASSUMPTIONS_AND_HYPOTHESES_GUIDE** — Detailed guidance on hypothesis formulation, testing, and decision-making methodology

---

## Change Log

| Date       | Change                                                                                           | Author                 |
| ---------- | ------------------------------------------------------------------------------------------------ | ---------------------- |
| 2026-03-21 | CXO creation of 6 hypothesis cards with UX perspective, fallback plans, and validation timelines | CXO with AI assistance |

---

_This document follows the AX Transformation Framework T10 Hypothesis Card template._
_All 6 hypotheses are marked "Unvalidated" as of DISCOVER phase._
_Next step: Begin validation sequence starting with H-01 (New Build vs Upgrade) in Week 2._
_Part of the AX Transformation Framework guide system v2.0.0 — Amoza, March 2026_
