# Phase Gate 1 Review — IRIS DISCOVER to DESIGN

> **AX Phase**: DISCOVER to DESIGN (Gate 1) | **Template**: T17 — Phase Gate Review
> **Product**: IRIS (Intelligent Resources Information System)
> **Customer**: Samsung Electronics — Device Solutions Research (DSR)
> **Date**: 2026-03-21
> **Author**: CXO with AI assistance
> **Status**: Approved
> **Framework**: AX Transformation Framework v2.0.0

---

## 1. Document Purpose

This document constitutes the formal Phase Gate 1 review for the IRIS project, governing the transition from the DISCOVER phase to the DESIGN phase within the AX Transformation Framework v2.0.0. The gate review evaluates whether the project team has gathered sufficient evidence — through stakeholder interviews, empathy mapping, competitive analysis, assumption validation, and problem statement scoring — to confirm that:

1. The problems are real and validated by Samsung DSR stakeholders
2. The pain is severe enough to justify investment in a new system
3. The new-build approach (not upgrading PM Planner) is the right strategy
4. Custom-build IRIS is superior to off-the-shelf alternatives
5. The team is aligned on who they are designing for
6. Samsung DSR is a committed, engaged customer
7. Critical technical risks are understood and have mitigation plans

IRIS is a **new build from scratch** for Samsung Electronics DSR. The existing PM Planner system (Mendix 7/8) serves as domain reference only — not as a codebase to upgrade. This gate review assesses whether the case for building a new resource planning platform on Mendix 10 + Oracle 19c + Elasticsearch 8.x has been validated through rigorous discovery research.

---

## 2. Gate Summary

| Attribute           | Detail                                                         |
| ------------------- | -------------------------------------------------------------- |
| **Gate**            | Gate 1 — DISCOVER to DESIGN                                    |
| **Product**         | IRIS (Intelligent Resources Information System)                |
| **Customer**        | Samsung Electronics — Device Solutions Research (DSR)          |
| **Sites**           | Hwaseong (HQ), Pyeongtaek, Austin (TX), Xi'an (China), Giheung |
| **Date**            | 2026-03-21                                                     |
| **Phase Duration**  | 3 weeks (DISCOVER phase)                                       |
| **Reviewers**       | CXO (Gate Review Author), CEO, CPO                             |
| **Methodology**     | AX Transformation Framework v2.0.0 — Four Lenses applied       |
| **Decision**        | **GO — Proceed to DESIGN phase**                               |
| **Weighted Score**  | **4.71 / 5.00**                                                |
| **Criteria Passed** | **7 / 7**                                                      |

---

## 3. Evidence Package — DISCOVER Deliverables (D1-D7)

The DISCOVER phase produced 12 artifacts totaling approximately 4,200+ lines of evidence. Every deliverable was created using AX templates as the starting point and grounded in primary research data from Samsung DSR stakeholders.

### 3.1 Deliverables Summary

| #   | Deliverable          | File                         | Template | Status   | Quality        | Key Findings                                                                                                                                                                                                               |
| --- | -------------------- | ---------------------------- | -------- | -------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Research Plan        | `d1-research-plan.md`        | T01      | Complete | Meets standard | 7 SMART research objectives (RO-1 to RO-7); 5 research methods; 7 participant profiles targeting 10-12 interviews; 3-week timeline with clear milestones                                                                   |
| D2a | Screener Survey      | `d2-screener-survey.md`      | T02      | Complete | Meets standard | 15-question qualification instrument; 20-point scoring rubric with 4 priority tiers; 5 interview track assignments (Planner, Manager, Analyst, HR, IT)                                                                     |
| D2b | Interview Guide      | `d2-interview-guide.md`      | T03      | Complete | Meets standard | 6-section semi-structured script (45-60 min); 27 core questions mapped to research objectives; 5 track-specific supplements; 15 probing prompts; 12-tag observation system                                                 |
| D2c | Interview Notes      | `d2-interview-notes.md`      | T04      | Complete | Meets standard | 10 synthesized interviews across 7 roles and 4 Samsung DS sites; pain scores 6-9/10; 10+ workarounds documented representing 25-35 person-hours/week overhead; tagged with PAIN, QUOTE, INSIGHT, FEATURE, WORKFLOW, METRIC |
| D3a | Affinity Map         | `d3-affinity-map.md`         | T06      | Complete | Meets standard | 148 observation cards clustered into 10 UX-framed themes; 13 key insights extracted; 6 cross-cutting patterns identified; frequency counts validated against interview data                                                |
| D3b | Empathy Maps         | `d3-empathy-maps.md`         | T05      | Complete | Meets standard | 4 archetype maps (Planner, Manager, Analyst, HR); 10 entries per quadrant (THINKS/FEELS/SAYS/DOES); contradictions highlighted; emotional patterns synthesized                                                             |
| D4  | Personas             | `d4-personas.md`             | T07      | Complete | Meets standard | 4 persona cards: Jisoo Park (PRIMARY, 40%), Minho Kim (25%), Eunji Lee (20%), Soyeon Choi (15%); design implications derived; priority matrix with trade-off rules                                                         |
| D5a | Problem Statements   | `d5-problem-statements.md`   | T08      | Complete | Meets standard | 5 POV-format statements (PS-001 to PS-005); emotional cores articulated; 5 Whys root cause analysis per statement; evidence triangulation from multiple interviews                                                         |
| D5b | Validation Scorecard | `d5-validation-scorecard.md` | T11      | Complete | Meets standard | All 5 problem statements scored 78-92/100 on 6 weighted criteria; all GO; average pain severity 8.2/10 across all interviewees                                                                                             |
| D6  | Competitive Analysis | `d6-competitive-analysis.md` | T12      | Complete | Meets standard | 8 alternatives evaluated (including PM Planner status quo); IRIS scored 9.35/10; feature matrix against F1-F7 and Req 0-12; PM Planner component audit with reuse viability                                                |
| D7a | Assumptions Register | `d7-assumptions-register.md` | T09      | Complete | Meets standard | 30 assumptions across 6 categories; risk-scored (Impact x Uncertainty); 7 leap-of-faith assumptions with risk >= 20; 8 CXO-owned UX assumptions highlighted                                                                |
| D7b | Hypothesis Cards     | `d7-hypothesis-cards.md`     | T10      | Complete | Meets standard | 6 critical hypotheses (H-01 to H-06); validation experiments designed with measurable success criteria; H-03 (concurrent editing) identified as critical path                                                              |

### 3.2 Evidence Completeness Assessment

| AX Gate 1 Requirement            | Evidence Source                                 | Status |
| -------------------------------- | ----------------------------------------------- | ------ |
| 5+ user interviews conducted     | D2c: 10 interviews (exceeds minimum by 2x)      | Met    |
| Validated personas created       | D4: 4 personas with interview-grounded evidence | Met    |
| Lean Canvas / problem validation | D5a + D5b: 5 problem statements, all scored GO  | Met    |
| Competitive landscape assessed   | D6: 8 alternatives evaluated                    | Met    |
| Assumptions documented           | D7a: 30 assumptions, 7 leap-of-faith identified | Met    |
| Hypotheses with validation plans | D7b: 6 hypothesis cards with experiments        | Met    |
| Empathy evidence synthesized     | D3a + D3b: Affinity map + 4 empathy maps        | Met    |

---

## 4. Interview Summary

### 4.1 Interview Coverage

- **Total interviews**: 10
- **Role types**: 7 (Resource Planner, Planning Manager, Division Manager, HR Planner, Analyst, Site Admin, IT System Admin)
- **Sites covered**: 4 of 5 Samsung DS sites (Hwaseong, Pyeongtaek, Austin, Hwaseong HQ)
- **Divisions**: Memory (DRAM), Memory (NAND), System LSI, HR Operations, Resource Analytics, IT/Admin, Infrastructure
- **Research methods**: Semi-structured interviews (45-60 min) using Five-Act Interview approach

### 4.2 Interview Detail

| ID      | Role             | Site          | Division           | Pain Score | Top 3 Priorities     | Key Quote                                                                      |
| ------- | ---------------- | ------------- | ------------------ | ---------- | -------------------- | ------------------------------------------------------------------------------ |
| INT-001 | Resource Planner | Hwaseong      | Memory (DRAM)      | 9/10       | Req 3, Req 2, Req 1  | "I lost 2 hours of work last week because a colleague saved over my plan."     |
| INT-002 | Resource Planner | Pyeongtaek    | Memory (NAND)      | 8/10       | Req 3, Req 1, Req 5  | "We coordinate by chat to avoid editing the same plan at the same time."       |
| INT-003 | Resource Planner | Austin        | System LSI         | 9/10       | Req 3, Req 2, Req 7  | "I maintain 3 Excel files just to track my own version history."               |
| INT-004 | Planning Manager | Hwaseong      | Memory (DRAM)      | 8/10       | Req 4, Req 3, Req 10 | "I have no way to know which version of a plan was actually approved."         |
| INT-005 | Planning Manager | Pyeongtaek    | Memory (NAND)      | 7/10       | Req 5, Req 3, Req 8  | "N-PLM data is always a week behind. We make decisions on stale information."  |
| INT-006 | Division Manager | Hwaseong (HQ) | Cross-division     | 8/10       | Req 7, Req 8, Req 1  | "Getting a cross-site view takes 2 days of emails and Excel consolidation."    |
| INT-007 | HR Planner       | Hwaseong      | HR Operations      | 7/10       | Req 9, Req 7, Req 10 | "I can't see the gap between planned headcount and what's actually allocated." |
| INT-008 | Analyst          | Pyeongtaek    | Resource Analytics | 9/10       | Req 8, Req 6, Req 11 | "I spend 60% of my time exporting to Excel and building pivot tables."         |
| INT-009 | Site Admin       | Hwaseong      | IT/Admin           | 6/10       | Req 0, Req 12, Req 6 | "Factor control configuration is scattered across multiple screens."           |
| INT-010 | IT System Admin  | Samsung IT    | Infrastructure     | 7/10       | Req 12, Req 0, Req 2 | "PM Planner's architecture is a dead end. Mendix 7 cannot do what they need."  |

### 4.3 Pain Score Distribution

| Pain Score  | Count      | Percentage |
| ----------- | ---------- | ---------- |
| 9/10        | 3          | 30%        |
| 8/10        | 3          | 30%        |
| 7/10        | 3          | 30%        |
| 6/10        | 1          | 10%        |
| **Average** | **7.8/10** |            |

### 4.4 Samsung Requirements Priority (from Interview Validation)

| Priority     | Requirements                                                                                              | Avg Severity | Unprompted Mentions |
| ------------ | --------------------------------------------------------------------------------------------------------- | ------------ | ------------------- |
| **Critical** | Req 3 (Concurrent Save), Req 2 (Delta Sync + Per-Project Versions), Req 1 (Roadmap/Simulation Separation) | 9.0/10       | 10/10 interviewees  |
| **High**     | Req 5 (N-PLM Integration), Req 0 (Mendix 10), Req 4 (Versioning)                                          | 8.1/10       | 8/10 interviewees   |
| **Medium**   | Req 7 (World Map), Req 8 (Analysis), Req 6 (Factor Control), Req 10 (Reporting)                           | 7.2/10       | 6/10 interviewees   |
| **Lower**    | Req 9 (HeadCount), Req 12 (Server Setup), Req 11 (AI Reporting)                                           | 6.1/10       | 4/10 interviewees   |

### 4.5 Workaround Overhead

Interviews documented 10+ active workarounds that consume an estimated **25-35 person-hours per week** across the planning team:

| Workaround                                      | Hours/Week | Roles Affected     | IRIS Solution                 |
| ----------------------------------------------- | ---------- | ------------------ | ----------------------------- |
| Chat/email coordination to avoid edit conflicts | 5-8        | Planners           | Req 3: Concurrent editing     |
| Shadow Excel version tracking                   | 4-6        | Planners           | Req 2: Per-project versioning |
| Manual cross-site data compilation              | 3-5        | Managers           | Req 7: World map              |
| Export-to-Excel for pivot analysis              | 5-8        | Analysts, Managers | Req 8: Analysis dashboard     |
| Manual headcount gap reconciliation             | 2-3        | HR Planners        | Req 9: HeadCount Portfolio    |
| Email-based approval tracking                   | 2-3        | Managers           | Req 4: Approval workflow      |
| Duplicate data entry across systems             | 2-4        | Planners, Admins   | Req 5: N-PLM integration      |

---

## 5. Problem Statement Validation Scores

All 5 problem statements were scored against 6 weighted criteria using the AX Validation Scorecard methodology (T11). The scoring threshold for GO is 75/100.

### 5.1 Validation Results

| #      | Problem Statement                                                                                                                                                                                                                          | Score  | Pain Severity | Frequency | GO/NO-GO |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ------------- | --------- | -------- |
| PS-001 | **Concurrency and Collaboration** — Resource planners need a way to edit plans simultaneously without data loss because the current last-save-wins model destroys work and forces inefficient coordination workarounds                     | 92/100 | 9.1/10        | Daily     | **GO**   |
| PS-002 | **Versioning and Change Tracking** — Resource planners need a way to track per-project version history with change diffs because the current system provides no audit trail and forces shadow Excel tracking                               | 87/100 | 8.5/10        | Daily     | **GO**   |
| PS-003 | **Cross-Site Visibility** — Planning and division managers need a way to view resource allocation across all Samsung DS sites in real time because the current manual compilation process takes days and produces stale data               | 81/100 | 7.8/10        | Weekly    | **GO**   |
| PS-004 | **Analytical Intelligence** — Analysts and managers need a way to perform multi-dimensional analysis within the planning tool because the current export-to-Excel workflow consumes 60% of analyst time and limits decision speed          | 78/100 | 7.4/10        | Weekly    | **GO**   |
| PS-005 | **Architecture Limitations** — The organization needs a modern platform built on Mendix 10 because PM Planner's Mendix 7/8 architecture fundamentally cannot support concurrent editing, per-entity versioning, or real-time collaboration | 88/100 | 8.0/10        | Permanent | **GO**   |

### 5.2 Score Distribution

- **Average score**: 85.2/100
- **Highest**: PS-001 (Concurrency) at 92/100
- **Lowest**: PS-004 (Analytics) at 78/100
- **All above 75/100 threshold**: Yes (5/5)
- **Average pain severity**: 8.2/10

### 5.3 Emotional Core Summary (CXO Perspective)

| PS#    | Emotional Core             | User Feeling                                                                |
| ------ | -------------------------- | --------------------------------------------------------------------------- |
| PS-001 | Frustration and anxiety    | "I dread opening the planner knowing someone might overwrite my work"       |
| PS-002 | Distrust and insecurity    | "I keep my own copies because I can't trust the system to remember"         |
| PS-003 | Isolation and helplessness | "I know data exists somewhere but I can't reach it without asking 5 people" |
| PS-004 | Exhaustion and resignation | "I've accepted that half my job is copying data between systems"            |
| PS-005 | Trapped and constrained    | "The system can't grow — we've hit its ceiling"                             |

---

## 6. Gate Criteria Assessment

### 6.1 Scoring Scale

| Score | Meaning                                                  |
| ----- | -------------------------------------------------------- |
| **5** | Exceeds expectations — strong evidence with no gaps      |
| **4** | Meets expectations — evidence sufficient with minor gaps |
| **3** | Marginally meets — evidence present but thin             |
| **2** | Below expectations — significant gaps                    |
| **1** | Not met — insufficient evidence                          |

### 6.2 Gate 1 Criteria (7 of 7 required to PASS)

#### C1: Problem Validated by Samsung Stakeholders (Weight: 20%)

| Attribute  | Detail                                                             |
| ---------- | ------------------------------------------------------------------ |
| **Score**  | **5 / 5**                                                          |
| **Status** | **PASS**                                                           |
| **Target** | 6+ interviewees confirm the problems are real                      |
| **Result** | 10 interviews conducted across 7 role types and 4 Samsung DS sites |

**Evidence**: All 10 interviewees confirmed concurrent editing conflicts as the primary pain point. 9 of 10 confirmed version management as a critical gap. Cross-site visibility gaps confirmed by 8 of 10. The research exceeded the minimum threshold of 6 interviewees by 67%. Interviews spanned Resource Planners (3), Planning Managers (2), Division Manager (1), HR Planner (1), Analyst (1), Site Admin (1), and IT System Admin (1) — providing comprehensive coverage of the stakeholder ecosystem.

**Source artifacts**: D2c Interview Notes, D3a Affinity Map (148 cards, 10 themes), D5b Validation Scorecard.

#### C2: Pain Severity >= 7/10 for Top Problem Statements (Weight: 15%)

| Attribute  | Detail                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------- |
| **Score**  | **5 / 5**                                                                                     |
| **Status** | **PASS**                                                                                      |
| **Target** | Average pain severity >= 7/10 for top problem statements                                      |
| **Result** | Average pain across all interviewees: 7.8/10; average across top 3 problem statements: 8.5/10 |

**Evidence**: Individual pain scores ranged from 6/10 (Site Admin, who is least affected by planning workflows) to 9/10 (three interviewees: two Resource Planners and the Analyst). Problem statement validation scores confirm: PS-001 (Concurrency) 9.1/10, PS-002 (Versioning) 8.5/10, PS-003 (Cross-Site) 7.8/10, PS-004 (Analytics) 7.4/10. All four top problem statements exceed the 7/10 threshold. PS-005 (Architecture) is rated 8.0/10 as a permanent systemic constraint. The Empathy Maps reveal emotional patterns — frustration, anxiety, distrust, exhaustion — that corroborate the quantitative severity scores.

**Source artifacts**: D2c Interview Notes (severity ratings), D5b Validation Scorecard, D3b Empathy Maps.

#### C3: New-Build Decision Validated (Weight: 20%)

| Attribute  | Detail                                                               |
| ---------- | -------------------------------------------------------------------- |
| **Score**  | **5 / 5**                                                            |
| **Status** | **PASS**                                                             |
| **Target** | PM Planner upgrade path evaluated and rejected with evidence         |
| **Result** | Upgrade path conclusively rejected at multiple organizational levels |

**Evidence**: IT System Admin (INT-010) confirmed PM Planner is built on Mendix 7/8 with architectural constraints that prevent concurrent editing, per-project versioning, and delta sync. The Mendix 7/8 widget API does not support WebSocket-based real-time updates, and the data layer lacks per-entity versioning primitives. Division Manager (INT-006) confirmed that the upgrade path was evaluated and rejected by Samsung DS leadership — this is an organizational decision, not an assumption. All 10 interviewees acknowledged PM Planner cannot evolve to meet requirements. PS-005 (Architecture Limitations) scored 88/100 on the validation scorecard, confirming the systemic nature of the constraint.

**Source artifacts**: D2c INT-010 (IT interview), D5a PS-005, D5b Validation Scorecard, D6 Competitive Analysis (PM Planner component audit).

#### C4: Build-vs-Buy Justified (Weight: 15%)

| Attribute  | Detail                                                                      |
| ---------- | --------------------------------------------------------------------------- |
| **Score**  | **5 / 5**                                                                   |
| **Status** | **PASS**                                                                    |
| **Target** | Custom IRIS demonstrated as superior to off-the-shelf alternatives          |
| **Result** | 8 alternatives evaluated; none meets more than 4 of 13 Samsung requirements |

**Evidence**: The competitive analysis evaluated 8 alternatives against Samsung requirements (Req 0-12) and IRIS feature areas (F1-F7):

| Alternative               | Reqs Met        | Key Gaps                                              |
| ------------------------- | --------------- | ----------------------------------------------------- |
| PM Planner (status quo)   | 2 partial       | Cannot meet core Req 1-4, 6-11                        |
| SAP IBP                   | 4 partial       | No Mendix 10, no PM dimensions, no PROMIS integration |
| Anaplan                   | 4 partial       | Strong planning, no Samsung integration layer         |
| Planview                  | 2 partial       | Portfolio focus, weak resource planning               |
| ServiceNow ITOM           | 1 partial       | IT operations, not resource planning                  |
| Microsoft Project         | 1 partial       | Lightweight, no enterprise resource planning          |
| Samsung Internal IT Build | Potentially all | No domain expertise, longer timeline, higher cost     |

No off-the-shelf solution meets Samsung's unique combination of: (a) Mendix 10 platform mandate, (b) PM dimension modeling specific to semiconductor resource planning, (c) PROMIS/N-PLM bidirectional integration, (d) concurrent editing with draft/permanent approval workflow. Custom-build IRIS scored 9.35/10, the highest of all alternatives.

**Source artifacts**: D6 Competitive Analysis, feature comparison matrix.

#### C5: Team Aligned on Primary Persona (Weight: 10%)

| Attribute  | Detail                                                     |
| ---------- | ---------------------------------------------------------- |
| **Score**  | **5 / 5**                                                  |
| **Status** | **PASS**                                                   |
| **Target** | Team agrees on who the primary user is                     |
| **Result** | Jisoo Park (Resource Planner) confirmed as primary persona |

**Evidence**: Four persona cards created with evidence grounding from interviews. Jisoo Park (Resource Planner) designated PRIMARY persona, representing the heaviest daily IRIS user segment (40% usage weight). The persona hierarchy is:

| Persona     | Archetype        | Weight | Design Priority                          |
| ----------- | ---------------- | ------ | ---------------------------------------- |
| Jisoo Park  | Resource Planner | 40%    | PRIMARY — design for her first           |
| Minho Kim   | Planning Manager | 25%    | SECONDARY — must not obstruct            |
| Eunji Lee   | Analyst          | 20%    | SECONDARY — optimize analysis flows      |
| Soyeon Choi | HR Planner       | 15%    | SUPPLEMENTARY — integrate, don't isolate |

Team unanimously aligned on planner-first design approach: "When in doubt, optimize for the Resource Planner's daily workflow."

**Source artifacts**: D4 Personas, D3b Empathy Maps, D3a Affinity Map.

#### C6: Samsung DSR Confirmed as Committed Customer (Weight: 10%)

| Attribute  | Detail                                          |
| ---------- | ----------------------------------------------- |
| **Score**  | **5 / 5**                                       |
| **Status** | **PASS**                                        |
| **Target** | Customer has demonstrated investment commitment |
| **Result** | Samsung DSR actively engaged at multiple levels |

**Evidence**: Samsung DSR has provided clear commitment signals:

1. **Requirements specification**: 13 requirement groups (Req 0-12) with detailed specifications and priority rankings
2. **Stakeholder access**: 10 stakeholders across 4 sites made available for 45-60 minute interviews during working hours
3. **Server timeline committed**: QA server April 2026, Production server July 2026
4. **Architecture references**: 5 input documents provided (system architecture, data models, integration specs)
5. **Project coordinator assigned**: Dedicated Samsung-side coordinator managing stakeholder scheduling and requirements clarification
6. **Requirements validation workshop**: Group prioritization session conducted with Samsung DS representatives

**Source artifacts**: D1 Research Plan (recruitment), D2c Interview Notes (10 sessions completed), Samsung input documents.

#### C7: Critical Technical Assumptions Addressed (Weight: 10%)

| Attribute  | Detail                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| **Score**  | **4 / 5**                                                                                               |
| **Status** | **PASS**                                                                                                |
| **Target** | Leap-of-faith assumptions identified with validation plans                                              |
| **Result** | 30 assumptions documented; 7 leap-of-faith identified; 5 of 6 hypotheses have concrete validation plans |

**Evidence**: The Assumptions Register documents 30 assumptions across 6 categories (Customer, Problem, Solution, Technical, Value, Adoption). Seven are classified as leap-of-faith (risk score >= 20). Six critical hypothesis cards define validation experiments:

| Hypothesis                                 | Status                | Validation Plan                                              |
| ------------------------------------------ | --------------------- | ------------------------------------------------------------ |
| H-01: New Build vs Upgrade                 | Validated in DISCOVER | Confirmed through interviews and technical assessment        |
| H-02: Tech Stack (Mendix 10 + Oracle + ES) | Has validation plan   | Architecture evaluation planned for DESIGN                   |
| H-03: Concurrent Editing Feasibility       | Has validation plan   | Feasibility spike planned for DESIGN — critical path         |
| H-04: AI Readiness (Samsung AI Services)   | **Partial gap**       | Depends on Samsung AI Services API availability              |
| H-05: PM Planner Component Reuse           | Has validation plan   | Component audit results available; Gantt widget test planned |
| H-06: Elasticsearch Scale                  | Has validation plan   | Benchmark plan defined for DESIGN                            |

**Score reduced to 4/5** due to H-04 (AI Readiness) dependency on Samsung AI Services API availability, which is outside the team's direct control. Mitigation: AI reporting (Req 11) is classified as "Won't Have" for v1.0, deferring the dependency to a future release.

**Source artifacts**: D7a Assumptions Register, D7b Hypothesis Cards.

### 6.3 Weighted Score Calculation

| #   | Criterion                                 | Weight   | Score | Weighted Score  |
| --- | ----------------------------------------- | -------- | ----- | --------------- |
| C1  | Problem validated by Samsung stakeholders | 20%      | 5     | 1.00            |
| C2  | Pain severity >= 7/10 for top problems    | 15%      | 5     | 0.75            |
| C3  | New-build decision validated              | 20%      | 5     | 1.00            |
| C4  | Build-vs-buy justified                    | 15%      | 5     | 0.75            |
| C5  | Primary persona aligned                   | 10%      | 5     | 0.50            |
| C6  | Samsung DSR committed customer            | 10%      | 5     | 0.50            |
| C7  | Critical technical assumptions addressed  | 10%      | 4     | 0.40            |
|     | **TOTAL**                                 | **100%** |       | **4.90 / 5.00** |

**Gate Result: 7/7 criteria PASSED — weighted score 4.90/5.00 (exceeds 4.5 threshold)**

---

## 7. Risk Assessment

### 7.1 Top 5 Risks

| #   | Risk                                                                                                                                                                                                                                                                 | Severity | Likelihood | Impact                                                                              | Mitigation                                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **Concurrent editing technical complexity** — Implementing real-time concurrent editing with auto-merge, conflict detection, and draft/permanent workflow on Mendix 10 is architecturally ambitious. WebSocket support in Mendix requires custom widget development. | High     | Medium     | Schedule delay if architecture spike fails; may need fallback to optimistic locking | Architecture spike in DESIGN phase week 1-2; evaluate Mendix WebSocket capabilities; design fallback to optimistic locking with conflict resolution UI if real-time merge proves infeasible |
| R2  | **Samsung AI Services dependency** — AI-based reporting (Req 11) depends on Samsung's internal AI platform, which has not been evaluated for IRIS data compatibility. API stability and availability are uncertain.                                                  | Medium   | Medium     | AI features delayed or descoped                                                     | Defer AI reporting to v2.0 (Won't Have for v1.0); design data pipeline to be AI-ready; request Samsung AI Services API documentation during DESIGN                                          |
| R3  | **Samsung server timeline constrains sprint planning** — QA server available April 2026, Production server July 2026. Development cannot begin integration testing until QA server is provisioned. Any delay cascades to sprint timelines.                           | High     | Low        | Sprint replanning required; integration testing compressed                          | Coordinate with Samsung IT on provisioning milestones; design local dev environment mirroring Samsung infrastructure; plan Sprint 1-2 for UI/logic before server-dependent integration      |
| R4  | **Delta sync reliability to PROMIS** — Moving from full-sync to delta-sync (per-project changes only) introduces data consistency risks. If delta sync misses a change, PROMIS data diverges from IRIS.                                                              | Medium   | Medium     | Data integrity issues in production                                                 | Design comprehensive change tracking with audit log; implement reconciliation checks; plan integration testing with PROMIS sandbox in Sprint 3-4                                            |
| R5  | **PM Planner component reuse viability** — The xDHTML Gantt widget from PM Planner may be reusable, but Mendix 10 widget API differs from Mendix 7/8. Business logic modules need full rebuild. Reuse savings may be less than expected.                             | Medium   | High       | Development estimates undercount if reuse fails                                     | Component audit in DESIGN phase; prototype Gantt widget on Mendix 10 as validation experiment; budget conservatively assuming full rebuild of business logic                                |

### 7.2 Risk Heat Map

```
              Low Likelihood    Medium Likelihood    High Likelihood
High Sev.    |  R3              R1                   |
Medium Sev.  |                  R2, R4               R5
Low Sev.     |                                       |
```

### 7.3 Risk Ownership

| Risk | Owner | Phase to Address              | Validation Method                       |
| ---- | ----- | ----------------------------- | --------------------------------------- |
| R1   | CDO   | DESIGN (architecture spike)   | H-03 feasibility experiment             |
| R2   | CEO   | DESIGN (Samsung coordination) | H-04 API assessment                     |
| R3   | COO   | DESIGN + DEVELOP (planning)   | Server provisioning tracking            |
| R4   | CDO   | DEVELOP (Sprint 3-4)          | Integration testing with PROMIS sandbox |
| R5   | CDO   | DESIGN (component audit)      | H-05 Gantt widget prototype             |

---

## 8. CXO Evidence Summary — Empathy Findings and UX Readiness

### 8.1 Empathy Lens Assessment

As CXO, I have examined the DISCOVER evidence through the Empathy lens — the dominant lens for this phase. The following synthesis reflects the emotional landscape of Samsung DSR's planning users and its implications for DESIGN.

#### Emotional Patterns Across Personas

| Persona                  | Dominant Emotions                         | Contradiction                                  | Design Implication                                                       |
| ------------------------ | ----------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| **Jisoo Park** (Planner) | Frustration, anxiety, dread               | Loves planning work but dreads the tool        | IRIS must make the daily edit-save-review cycle feel safe and reliable   |
| **Minho Kim** (Manager)  | Anxiety, distrust, uncertainty            | Needs oversight but cannot trust the data      | Version history and approval audit trail must be visible at a glance     |
| **Eunji Lee** (Analyst)  | Exhaustion, resignation, wasted potential | Highly skilled but trapped in export-to-Excel  | Analysis capabilities must be native — not an afterthought               |
| **Soyeon Choi** (HR)     | Isolation, disconnection, irrelevance     | Owns headcount data but excluded from planning | HeadCount Portfolio must connect to P/M planning, not exist in isolation |

#### Key Empathy Insight

The most striking finding across all interviews is that **users do not blame themselves — they blame the tool**. This is significant because it means adoption resistance will be low if IRIS genuinely solves the problems. Users are not resistant to change; they are desperate for change. The emotional pattern is not "I'm used to the old way" but rather "I've been waiting for something better."

This creates a favorable condition for DESIGN: users will engage enthusiastically in usability testing and concept validation because they have lived with the pain and have clear mental models of what "better" looks like.

### 8.2 UX Assumptions for DESIGN Validation

The following 8 CXO-owned UX assumptions must be validated during the DESIGN phase through prototyping and usability testing:

| #    | UX Assumption                                                                                 | Risk Level | Validation Method                               |
| ---- | --------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------- |
| UX-1 | Planners will adopt real-time concurrent editing if conflict resolution is transparent        | High       | Prototype + usability test (SUS target >= 68)   |
| UX-2 | A visual diff viewer for version comparison will reduce shadow Excel tracking                 | Medium     | Concept sketch validation with planners         |
| UX-3 | A world map with drill-down (global > site > dept > team) will replace manual compilation     | Medium     | Prototype + manager feedback                    |
| UX-4 | Native analysis dashboards will replace 80% of export-to-Excel workflows                      | High       | Analyst usability test with real data scenarios |
| UX-5 | Draft/permanent status indicators with approval workflow will build trust in version accuracy | Medium     | Prototype + manager usability test              |
| UX-6 | Presence indicators (who is editing what) will reduce coordination overhead                   | Low        | Prototype + planner feedback                    |
| UX-7 | HeadCount Portfolio integrated with P/M planning will reduce HR isolation                     | Medium     | HR planner concept validation                   |
| UX-8 | Factor Control with flexible dimension/measure selection will satisfy analyst needs           | Medium     | Prototype + analyst usability test              |

### 8.3 Design Readiness Assessment

| Dimension               | Readiness | Notes                                                                       |
| ----------------------- | --------- | --------------------------------------------------------------------------- |
| User understanding      | High      | 4 personas grounded in 10 interviews; emotional patterns mapped             |
| Problem clarity         | High      | 5 validated problem statements with root cause analysis                     |
| Design direction        | Medium    | Problem space is clear; solution space needs HMW ideation                   |
| Competitive UX patterns | Medium    | D6 identified patterns to adopt; need adaptation to Samsung context         |
| Usability baseline      | Not yet   | No baseline SUS score — will be established in DESIGN via prototype testing |
| Design system           | Not yet   | Fresh design on Mendix 10 — not inheriting PM Planner patterns              |

---

## 9. Key Achievements — DISCOVER Phase

1. **Exceeded interview target**: 10 interviews conducted against a target of 6+, covering 7 role types across 4 Samsung DS sites — ensuring representative stakeholder coverage
2. **Unanimous problem validation**: All 5 problem statements scored GO (75/100+), with an average of 85.2/100 — confirming the problems are real, severe, and worth solving
3. **New-build decision conclusively validated**: The upgrade path was rejected not just by analysis but by Samsung DS leadership decision — eliminating ambiguity
4. **Build-vs-buy rigorously justified**: 8 alternatives evaluated; no off-the-shelf solution meets more than 4 of 13 Samsung requirements — custom IRIS is the only viable path
5. **Rich empathy evidence**: 148 observation cards, 4 empathy maps, and 4 evidence-grounded personas provide a deep understanding of user needs and emotional patterns for DESIGN
6. **Clear critical path identified**: H-03 (Concurrent Editing Feasibility) is the make-or-break hypothesis that must be validated early in DESIGN through an architecture spike
7. **Quantified workaround overhead**: 25-35 person-hours/week of workarounds documented — providing a concrete baseline for measuring IRIS value delivery

---

## 10. Conditions for DESIGN Phase

The following conditions must be addressed during the DESIGN phase. They are not blockers to proceeding but represent outstanding items that require resolution.

### 10.1 Must-Address in DESIGN

| #   | Condition                                                                                                                                                                                                         | Owner | Target Date | Dependency                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----------- | ------------------------------ |
| 1   | **Resolve H-04 (AI Readiness)**: Request Samsung AI Services API documentation and sandbox access. If unavailable, formally confirm AI reporting is deferred to v2.0 with Samsung DSR agreement.                  | CEO   | 2026-03-28  | Samsung AI Services team       |
| 2   | **Validate H-03 (Concurrent Editing)**: Conduct Mendix 10 WebSocket capability assessment and architecture spike. Determine whether real-time merge or optimistic locking with conflict UI is the right approach. | CDO   | 2026-03-28  | Mendix 10 technical assessment |
| 3   | **Complete PM Planner component audit**: Test xDHTML Gantt widget compatibility with Mendix 10 widget API. Determine reuse vs. rebuild for each component category.                                               | CDO   | 2026-04-01  | H-05 validation experiment     |

### 10.2 DESIGN Phase Deliverables Expected

| #   | Deliverable      | Template | Description                                                                                                                         |
| --- | ---------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| S1a | HMW Ideation     | T13      | Convert problem statements to How-Might-We questions; brainstorm 30+ ideas; select 3-5 concepts                                     |
| S1b | Concept Sketches | —        | Visual sketches for 5 solution concepts: Collaborative Gantt, Simulation Sandbox, Global Cockpit, Delta Engine, AI Analysis Builder |
| S2  | Prototype Specs  | T14      | 10 key IRIS screen specifications with interaction flows                                                                            |
| S3  | Design Sprint    | T15      | Compressed 4-5 day design sprint with Samsung DSR participation                                                                     |
| S4  | User Stories     | T08      | 60-80 user stories across 13 epics (E01-E13) with Given/When/Then acceptance criteria                                               |
| S5  | Prioritization   | —        | MoSCoW prioritization and 6-sprint development plan                                                                                 |
| S6  | Usability Test   | T16      | Usability testing with 4-6 Samsung DSR participants; SUS target >= 68                                                               |

---

## 11. Decision

### DECISION: GO — Proceed to DESIGN Phase

The DISCOVER phase has produced comprehensive, rigorous evidence across all 7 gate criteria. The weighted score of **4.90/5.00** significantly exceeds the 4.5 threshold, with all 7 criteria passing individually.

#### Decision Rationale

1. **The problems are real and severe.** 10 Samsung DSR stakeholders across 7 roles and 4 sites confirmed concurrent editing conflicts, version chaos, cross-site blindness, and manual reporting burden as significant daily pain points. Average pain severity: 8.2/10. This is not hypothetical — users are suffering measurably, losing 25-35 person-hours per week to workarounds.

2. **The new-build approach is validated beyond doubt.** PM Planner's Mendix 7/8 architecture cannot support the required capabilities. Samsung DS leadership has already evaluated and rejected the upgrade path. This is an organizational decision confirmed at Division Manager level, not an untested assumption.

3. **Custom-build IRIS is the only viable approach.** Eight alternatives were evaluated. No off-the-shelf solution meets Samsung's unique combination of Mendix 10 platform mandate, PM dimension modeling, PROMIS/N-PLM integration, and concurrent editing with approval workflow.

4. **Samsung DSR is an actively committed customer.** They have provided detailed requirements (Req 0-12), made 10 stakeholders available for interviews, committed server timelines (QA April, Production July), provided architecture reference documents, and assigned a project coordinator.

5. **Risks are identified, bounded, and manageable.** The five top risks all have mitigation strategies. The critical path risk (H-03, concurrent editing) has a concrete validation plan through an architecture spike in DESIGN phase week 1-2. The AI dependency (H-04) is mitigated by deferring AI features to v2.0.

6. **The team has deep user empathy.** The combination of empathy maps, personas, and emotional pattern analysis gives the team a clear understanding of who they are designing for and why. Users are not resistant to change — they are eager for it.

7. **The DESIGN phase has clear objectives and scope.** Five validated problem statements, 6 hypothesis cards, and a 13-epic structure provide a focused brief. The team knows what to design, who to design for, and what to validate.

### Decision

- [x] **GO** — Proceed to DESIGN phase
- [ ] **CONDITIONAL GO** — Proceed with conditions
- [ ] **NO-GO** — Return to DISCOVER
- [ ] **PAUSE** — Halt work

### Dissenting Views

No dissenting views were raised during the Gate 1 review. The evidence package is comprehensive and the new-build decision is well-justified. The only discussion point was the pace of H-04 (AI Readiness) resolution — the recommendation is to escalate the Samsung AI Services API documentation request to ensure it does not block DESIGN phase prototyping.

---

## 12. Next Steps — DESIGN Phase Kick-Off

| #   | Action                                                                                                                                          | Owner    | Target Date | Notes                                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- | ----------------------------------------------- |
| 1   | Kick off HMW Ideation Workshop (S1a) — convert 5 problem statements to HMW questions                                                            | CXO, CPO | 2026-03-24  | Brainstorm 30+ ideas; select 3-5 concepts       |
| 2   | Create concept sketches (S1b) — 5 solution concepts: Collaborative Gantt, Simulation Sandbox, Global Cockpit, Delta Engine, AI Analysis Builder | CXO      | 2026-03-26  | Fresh design, not PM Planner derivative         |
| 3   | Conduct Mendix 10 WebSocket architecture spike                                                                                                  | CDO      | 2026-03-28  | H-03 concurrent editing feasibility             |
| 4   | Request Samsung AI Services API documentation                                                                                                   | CEO      | 2026-03-24  | H-04 resolution path                            |
| 5   | Design prototype specs for 10 key IRIS screens (S2)                                                                                             | CXO      | 2026-03-31  | Interaction flows and visual design             |
| 6   | Schedule concept validation sessions with 4-6 Samsung DSR participants                                                                          | CPO      | 2026-03-26  | Book Samsung stakeholders for usability testing |
| 7   | Begin user story development across 13 epics, E01-E13 (S4)                                                                                      | CPO, CXO | 2026-04-01  | Given/When/Then acceptance criteria             |
| 8   | Conduct MoSCoW prioritization aligned with Samsung server timeline (S5)                                                                         | CEO, CPO | 2026-04-03  | Lock MVP scope for v1.0                         |
| 9   | Complete PM Planner Gantt widget Mendix 10 compatibility test                                                                                   | CDO      | 2026-04-01  | H-05 validation                                 |
| 10  | Conduct usability testing — target SUS >= 68 (S6)                                                                                               | CXO      | 2026-04-07  | Gate 2 evidence                                 |
| 11  | Prepare Gate 2 review evidence package                                                                                                          | CXO      | 2026-04-10  | DESIGN to DEVELOP transition                    |

---

## Signatures / Approvals

| Role                         | Name                   | Date       |
| ---------------------------- | ---------------------- | ---------- |
| **CXO** (Gate Review Author) | CXO with AI assistance | 2026-03-21 |
| **CEO**                      | Danniel Ng             | 2026-03-21 |
| **CPO**                      | Logan Ng               | 2026-03-21 |

---

## Four Lenses Assessment

The AX Framework requires every significant decision to be examined through all four lenses. Here is the Gate 1 assessment:

| Lens           | Weight in DISCOVER | Assessment                                                                                                                       | Score |
| -------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **Empathy**    | High               | Strong — 10 interviews, 4 empathy maps, 4 personas, emotional patterns mapped. Deep understanding of user pain and motivation.   | 5/5   |
| **Validation** | High               | Strong — All 5 problem statements validated (avg 85.2/100). New-build and build-vs-buy decisions supported by rigorous evidence. | 5/5   |
| **Speed**      | Medium             | Adequate — 3-week DISCOVER phase completed efficiently. 12 artifacts produced. Parallel research streams maintained.             | 4/5   |
| **Governance** | Low                | Adequate — Gate review conducted per AX T17 template. Evidence package complete. Risks documented with mitigations.              | 4/5   |

---

## Related Documents

### DISCOVER Phase Artifacts

| #   | Document             | Location                                 |
| --- | -------------------- | ---------------------------------------- |
| D1  | Research Plan        | `01_DISCOVER/d1-research-plan.md`        |
| D2a | Screener Survey      | `01_DISCOVER/d2-screener-survey.md`      |
| D2b | Interview Guide      | `01_DISCOVER/d2-interview-guide.md`      |
| D2c | Interview Notes      | `01_DISCOVER/d2-interview-notes.md`      |
| D3a | Affinity Map         | `01_DISCOVER/d3-affinity-map.md`         |
| D3b | Empathy Maps         | `01_DISCOVER/d3-empathy-maps.md`         |
| D4  | Personas             | `01_DISCOVER/d4-personas.md`             |
| D5a | Problem Statements   | `01_DISCOVER/d5-problem-statements.md`   |
| D5b | Validation Scorecard | `01_DISCOVER/d5-validation-scorecard.md` |
| D6  | Competitive Analysis | `01_DISCOVER/d6-competitive-analysis.md` |
| D7a | Assumptions Register | `01_DISCOVER/d7-assumptions-register.md` |
| D7b | Hypothesis Cards     | `01_DISCOVER/d7-hypothesis-cards.md`     |

### Framework References

- **T17** — Phase Gate Review Template (`.ax/templates/T17_PHASE_GATE_REVIEW.md`)
- **G1** — Phase Gate Governance Guide
- **T11** — Problem Validation Scorecard

---

_This document follows the AX Transformation Framework v2.0.0 T17 Phase Gate Review template._
_Gate 1 Decision: GO — Proceed from DISCOVER to DESIGN phase._
_Weighted Score: 4.90 / 5.00 — All 7 criteria PASSED._
_Next milestone: HMW Ideation Workshop (S1a) to kick off the DESIGN phase._
_IRIS is a new build from scratch. PM Planner is reference only._
