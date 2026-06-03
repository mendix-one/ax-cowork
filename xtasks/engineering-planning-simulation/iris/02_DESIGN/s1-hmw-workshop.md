# HMW Ideation Workshop — IRIS

> **AX Phase**: DESIGN | **Template**: T13 — HMW Ideation Workshop
> **Product**: IRIS — Intelligent Resources Information System
> **Customer**: Samsung Electronics — Device Solutions Research (DSR)
> **Date**: 2026-03-21
> **Author**: CXO (Soyeon Choi) with AI assistance
> **Status**: Completed
> **Framework**: AX Transformation Framework v2.0.0

---

## Document Purpose

This document captures the complete output of the HMW Ideation Workshop for the IRIS project, conducted as the first deliverable of the AX DESIGN phase. The workshop transforms five validated problem statements from the DISCOVER phase (all GO, average score 85.2/100) into actionable solution concepts for a **new-build** resource planning platform replacing PM Planner.

**Key constraint**: IRIS is a NEW BUILD on Mendix 10 + Oracle 19c + Elasticsearch 8.x + xDHTML Gantt + ECharts.js. PM Planner (Mendix 7/8) is reference only. All concepts must be designed fresh, not incremental upgrades.

**Key principle**: Every concept traces back to validated user pain. No solution without a problem. No feature without a hypothesis.

---

## Metadata

| Field        | Value                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Project      | IRIS (Task 102)                                                                                                                 |
| Product      | IRIS — Intelligent Resources Information System                                                                                 |
| Customer     | Samsung Electronics — Device Solutions Research (DSR)                                                                           |
| Date         | 2026-03-21                                                                                                                      |
| Facilitator  | CXO (Soyeon Choi)                                                                                                               |
| Participants | CXO (Soyeon Choi, Facilitator), CEO/CPO (Danniel Ng), CDO (Tech Lead), CAO (AI Strategy), COO (Operations), AI Design Assistant |
| Duration     | 2.5 hours                                                                                                                       |
| Location     | Remote — Amoza Design Studio (Zoom + Miro Board)                                                                                |
| Method       | How-Might-We (HMW) Ideation — AX DESIGN Phase S1                                                                                |

---

## Problem Statements (POV)

> Five validated problem statements from the DISCOVER phase. All scored GO at Gate 1 (scores 78-92/100). Each is referenced by ID throughout this workshop.

### PS-001: Concurrency & Collaboration (Pain Score: 9.1/10)

**Senior Resource Planners** (like Jisoo Park, Hwaseong) need a way to **edit P/M plans simultaneously without overwriting each other's work** because PM Planner forces sequential editing, causing email-based coordination overhead, version conflicts, and delayed planning cycles that waste 3-4 hours per planner per week.

_Source_: PS-001 (DISCOVER Phase — Validation Score: 92/100)
_Emotion_: Overwrite anxiety — planners live in fear of losing hours of work

### PS-002: Versioning & Change Tracking (Pain Score: 8.5/10)

**Planning Managers** (like Minho Kim, Pyeongtaek) need a way to **track changes per project with version history and delta sync** because PM Planner has no per-project versioning, syncs all projects to PROMIS regardless of changes, and provides no audit trail for change accountability.

_Source_: PS-002 (DISCOVER Phase — Validation Score: 88/100)
_Emotion_: Decision paralysis — managers cannot confidently approve without knowing what changed

### PS-003: Cross-Site Visibility (Pain Score: 7.8/10)

**Division Managers** need a way to **view real-time resource allocation across all global sites** because manual data compilation from 5 sites (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung) takes 2-3 days, making executive resource decisions based on stale information.

_Source_: PS-003 (DISCOVER Phase — Validation Score: 82/100)
_Emotion_: Strategic frustration — decisions made on data that is already outdated

### PS-004: Analytical Intelligence (Pain Score: 7.4/10)

**Analytics Specialists** (like Eunji Lee, Hwaseong) need a way to **generate multi-dimensional reports and AI-assisted insights on demand** because current analysis requires manual Excel exports, pivot table construction, and cross-referencing across disconnected data sources, consuming 60%+ of analyst time.

_Source_: PS-004 (DISCOVER Phase — Validation Score: 78/100)
_Emotion_: Wasted expertise — analysts spend time on mechanics, not on insight

### PS-005: Architecture Limitations (Pain Score: 8.0/10)

**All stakeholders** need **a modern, extensible platform** because PM Planner's legacy Mendix 7/8 architecture cannot support concurrent editing, real-time analytics, or integration with Samsung AI Services, and cannot be incrementally upgraded.

_Source_: PS-005 (DISCOVER Phase — Validation Score: 85/100)
_Emotion_: Learned helplessness — users have stopped requesting features they know the system cannot support

---

## Workshop Agenda

| #         | Activity                       | Duration       | Description                                                                                                                                                                                                        |
| --------- | ------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1         | Opening & Ground Rules         | 10 min         | CXO opened with workshop objectives: design IRIS from scratch, no PM Planner constraints. "Yes, and..." mindset. Introduced the four CXO lenses: empathy, clarity, delight, trust.                                 |
| 2         | Problem Statement Review       | 15 min         | Reviewed all 5 validated problem statements with pain scores. Persona profiles for Jisoo (Planner 40%), Minho (Manager 25%), Eunji (Analyst 20%), Soyeon (HR 15%) presented. Emotional anchors shared for each PS. |
| 3         | HMW Question Generation        | 20 min         | Silent brainstorm — each participant wrote HMW questions covering all 5 problem statements (3 per PS, 15 total). Focus on reframing pain as opportunity.                                                           |
| 4         | HMW Clustering & Voting        | 15 min         | Affinity grouped 15 HMW questions into 5 clusters aligned to problem statements. Dot-voted to rank within clusters.                                                                                                |
| 5         | Brainstorming Round 1          | 25 min         | Crazy-8s for all 15 HMW questions — 7+ ideas per HMW cluster. Emphasis on quantity over quality.                                                                                                                   |
| 6         | Brainstorming Round 2          | 15 min         | Build on ideas, combine and remix across problem statements. Provoke wild ideas. "What would Google/Figma/Notion do?" prompts.                                                                                     |
| 7         | Dot Voting & Concept Formation | 20 min         | 6 dots per participant. Top-voted ideas clustered into 5 complementary concepts. Concept outlines sketched.                                                                                                        |
| 8         | Concept Evaluation & Selection | 15 min         | Evaluated 5 concepts on Desirability/Feasibility/Viability. All 5 selected as complementary modules. MVP phasing agreed.                                                                                           |
| **Total** |                                | **~2.5 hours** |                                                                                                                                                                                                                    |

---

## HMW Questions

> 15 HMW questions generated, 3 per validated problem statement. Each reframes a specific pain point as a design opportunity.

### PS-001: Concurrency & Collaboration

| #   | Pain Point                                                                     | HMW Question                                                                          | Votes |
| --- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ----- |
| 1   | Concurrent editing impossible — sequential access forces coordination overhead | How might we enable planners to edit P/M plans simultaneously without data conflicts? | 8     |
| 2   | Overwrite anxiety — planners fear losing hours of work                         | How might we make concurrent editing feel safe rather than anxiety-inducing?          | 6     |
| 3   | Non-conflicting changes require manual coordination                            | How might we auto-resolve non-conflicting changes transparently?                      | 5     |

### PS-002: Versioning & Change Tracking

| #   | Pain Point                                                         | HMW Question                                                               | Votes |
| --- | ------------------------------------------------------------------ | -------------------------------------------------------------------------- | ----- |
| 4   | No per-project version history — cannot audit who changed what     | How might we track version changes per project with minimal sync overhead? | 6     |
| 5   | Manager uncertainty — cannot tell which version is current         | How might we give managers instant confidence in which version is current? | 5     |
| 6   | No diff capability — cannot compare versions to understand changes | How might we show what changed between any two versions at a glance?       | 7     |

### PS-003: Cross-Site Visibility

| #   | Pain Point                                                                      | HMW Question                                                                     | Votes |
| --- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----- |
| 7   | No real-time cross-site view — decisions based on stale data                    | How might we give Division Managers instant cross-site resource visibility?      | 8     |
| 8   | Data compilation takes 2-3 days via email and Excel                             | How might we eliminate the 2-day email-and-Excel compilation cycle?              | 4     |
| 9   | No progressive drill-down — either global overview or detailed data, never both | How might we enable drill-down from global to individual without losing context? | 5     |

### PS-004: Analytical Intelligence

| #   | Pain Point                                                       | HMW Question                                                                      | Votes |
| --- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----- |
| 10  | Manual Excel exports consume 60%+ of analyst time                | How might we enable analysts to generate multi-dimensional reports without Excel? | 7     |
| 11  | Analytical insights locked inside specialist workflows           | How might we make analytical insights available to non-analysts?                  | 4     |
| 12  | No AI-assisted analysis despite Samsung AI Services availability | How might we leverage AI to reduce manual reporting by 80%?                       | 5     |

### PS-005: Architecture Limitations

| #   | Pain Point                                                    | HMW Question                                                                     | Votes |
| --- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----- |
| 13  | PM Planner architecture cannot support modern capabilities    | How might we design IRIS architecture to evolve beyond PM Planner's limitations? | 4     |
| 14  | Good patterns from PM Planner lost if we start entirely fresh | How might we reuse the best of PM Planner without inheriting its constraints?    | 3     |
| 15  | Users fear disruption from a completely new system            | How might we ensure the new system feels familiar enough for smooth adoption?    | 5     |

---

## Selected HMW (Top 5 by Vote)

> Selected by dot-voting across all participants. These 5 questions represent the highest-impact design opportunities for IRIS.

1. **HMW #1** (8 votes): How might we enable planners to edit P/M plans simultaneously without data conflicts?
2. **HMW #7** (8 votes): How might we give Division Managers instant cross-site resource visibility?
3. **HMW #6** (7 votes): How might we show what changed between any two versions at a glance?
4. **HMW #10** (7 votes): How might we enable analysts to generate multi-dimensional reports without Excel?
5. **HMW #2** (6 votes): How might we make concurrent editing feel safe rather than anxiety-inducing?

**Runner-up**: HMW #4 (6 votes) — track version changes per project with minimal sync overhead.

---

## Brainstorm Ideas

> For each of the 15 HMW questions, ideas generated during Crazy-8s and remix rounds. 37 total ideas generated. Organized by HMW cluster.

### Cluster 1: Concurrency & Collaboration (HMW #1, #2, #3)

| #   | Idea                          | Description                                                                                                                                                                       | Primary Persona | HMW Ref    | Author  |
| --- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- | ------- |
| 1.1 | Live Cursor Gantt             | Real-time collaborative Gantt with live cursors and cell highlights — each planner sees colored avatars and highlights showing where others are editing, exactly like Google Docs | Jisoo (Planner) | HMW #1     | Danniel |
| 1.2 | WebSocket Change Broadcasting | Every cell edit pushed to all concurrent users via WebSocket, with Operational Transform (OT) for conflict resolution at the data layer                                           | Jisoo (Planner) | HMW #1     | CDO     |
| 1.3 | Row-Level Soft Locking        | When Planner A clicks into a project row, that row shows a subtle lock indicator to others; others can still edit different rows freely. Lock auto-releases after 30s idle.       | Jisoo (Planner) | HMW #2     | CXO     |
| 1.4 | Auto-Merge Engine             | Detects non-conflicting changes (different employees, different projects, different months) and merges silently. Only surfaces true conflicts requiring human resolution.         | Jisoo (Planner) | HMW #3     | CAO     |
| 1.5 | Conflict Resolution Dialog    | When same cell is edited by two planners, show side-by-side diff with "Keep Mine / Keep Theirs / Merge" options. Include context: who changed it, when, and the previous value.   | Jisoo (Planner) | HMW #1, #2 | CXO     |
| 1.6 | Draft-to-Permanent Workflow   | All planner saves create Draft versions. Drafts follow approval workflow (Planner saves Draft -> Manager reviews diff -> Approves to Permanent). Prevents accidental overwrites.  | Jisoo, Minho    | HMW #2     | Danniel |
| 1.7 | Activity Feed Sidebar         | Real-time feed showing who is editing what, like Figma's presence panel. "Jisoo edited HBM4 Q3 allocation" appears in real-time. Clicking an entry navigates to that cell.        | Jisoo (Planner) | HMW #2     | CXO     |
| 1.8 | Offline-Tolerant Editing      | Planner can work offline; system reconciles changes on reconnect using three-way merge (base + local + remote). Conflict notification on reconnect.                               | Jisoo (Planner) | HMW #3     | CDO     |

### Cluster 2: Versioning & Change Tracking (HMW #4, #5, #6)

| #   | Idea                            | Description                                                                                                                                                 | Primary Persona | HMW Ref | Author  |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------- | ------- |
| 2.1 | Per-Project Diff Engine         | Compare any two versions and see exactly which employees/allocations changed for each project. Composite-key matching on employee_id + project_id + period. | Minho (Manager) | HMW #6  | CDO     |
| 2.2 | Change Timeline Panel           | Chronological list of all changes to a project across all roadmap versions, with who/what/when and change magnitude indicators.                             | Minho (Manager) | HMW #4  | Danniel |
| 2.3 | Delta Detection for PROMIS Sync | On version approval, diff engine identifies changed projects and sends ONLY those to PROMIS and N-PLM via REST API, eliminating full-sync waste.            | Minho (Manager) | HMW #4  | CDO     |
| 2.4 | Color-Coded Diff Viewer         | Visual diff with color coding: green = added allocations, red = removed, yellow = modified, gray = unchanged. Side-by-side layout.                          | Minho (Manager) | HMW #6  | CXO     |
| 2.5 | Auto-Generated Change Summary   | System generates human-readable summary: "V6: Added HBM4 project (+5 engineers), Reduced DDR4 (-3 engineers), Modified Exynos 2600 timeline."               | Minho (Manager) | HMW #5  | CAO     |
| 2.6 | Approval-Gated Diff Review      | Manager must view diff between submitted version and last approved before they can approve/reject. Mandatory review prevents blind approvals.               | Minho (Manager) | HMW #5  | Danniel |
| 2.7 | Selective Sync Dashboard        | After diff is computed, planner/manager reviews which projects will be synced to PROMIS before confirming. Checkbox per project with change summary.        | Minho (Manager) | HMW #4  | COO     |

### Cluster 3: Cross-Site Visibility (HMW #7, #8, #9)

| #   | Idea                            | Description                                                                                                                                           | Primary Persona | HMW Ref    | Author  |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- | ------- |
| 3.1 | Interactive World Map Home      | ECharts.js world map with geo-positioned site pins (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung). Click to drill into site dashboard.                | Minho (Manager) | HMW #7     | Danniel |
| 3.2 | Resource Heatmap Overlay        | Color intensity on world map shows utilization rate per site — red = over-allocated (>95%), amber = high (80-95%), green = available capacity (<80%). | Minho (Manager) | HMW #7     | CXO     |
| 3.3 | Cross-Site Comparison Dashboard | Select 2-3 sites and compare headcount, allocation %, project distribution, gap analysis side-by-side in synchronized charts.                         | Minho (Manager) | HMW #8     | Danniel |
| 3.4 | ES-Powered Aggregation Engine   | Elasticsearch pre-computes site-level metrics and serves them in sub-second response times. Background refresh every 5 minutes.                       | Minho (Manager) | HMW #8     | CDO     |
| 3.5 | Role-Based Default Navigation   | Division Manager sees global view by default; Planner sees their site/department by default. Factor Control drives scope.                             | All             | HMW #9     | COO     |
| 3.6 | Site Summary Bubbles            | Portfolio summary cards per site on world map — total HC, allocation %, active projects, HC gap — arranged around the map pins.                       | Minho (Manager) | HMW #7     | CXO     |
| 3.7 | Department Treemap Drill-Down   | Treemap visualization for department-level resource distribution — size = headcount, color = utilization, click to drill into team/person level.      | Minho (Manager) | HMW #9     | Danniel |
| 3.8 | Smart Alert Badges              | Flag sites where allocation exceeds 95% or gap exceeds 10% with warning badges on world map. Click badge to see root cause.                           | Minho (Manager) | HMW #7, #9 | CAO     |

### Cluster 4: Analytical Intelligence (HMW #10, #11, #12)

| #   | Idea                         | Description                                                                                                                                                                      | Primary Persona | HMW Ref | Author  |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------- | ------- |
| 4.1 | Dimension/Measure Palette    | Interactive selector — analyst picks dimensions (site, department, project, time, skill) and measures (headcount, allocation %, gap) from a palette, chart builds automatically. | Eunji (Analyst) | HMW #10 | Danniel |
| 4.2 | Chart Type Switcher          | Same data displayed as bar, line, pie, heatmap, treemap, or table with one click. ECharts.js renders all types from the same dataset.                                            | Eunji (Analyst) | HMW #10 | CXO     |
| 4.3 | Factor Control for Analytics | Analyst can scope any report to specific sites, departments, BUs, time periods with persistent filter sets. Filters apply across all charts.                                     | Eunji (Analyst) | HMW #11 | Danniel |
| 4.4 | Samsung AI PIVOT Generation  | One-click "Generate AI Report" sends aggregated data to Samsung AI Services and returns formatted Excel PIVOT table with trend annotations.                                      | Eunji (Analyst) | HMW #12 | CAO     |
| 4.5 | Scheduled Report Delivery    | Analyst configures a report once, system runs it weekly/monthly and emails results via Smart Notify. Reduces recurring manual work to zero.                                      | Eunji (Analyst) | HMW #12 | COO     |
| 4.6 | Natural Language Query       | Analyst types "Show me headcount by department for Hwaseong Q2 2026" and system generates the chart. Samsung AI Services NLP integration.                                        | Eunji, Minho    | HMW #11 | CAO     |
| 4.7 | Report Template Library      | Pre-built templates for common analyses: actual vs. plan gap, resource utilization trend, staffing forecast, cross-site comparison. One-click launch.                            | Eunji (Analyst) | HMW #11 | CXO     |

### Cluster 5: Architecture & Adoption (HMW #13, #14, #15)

| #   | Idea                           | Description                                                                                                                                             | Primary Persona | HMW Ref | Author |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------- | ------ |
| 5.1 | Mendix 10 Modular Architecture | Microservice-oriented Mendix 10 modules with clear boundaries. Each concept becomes an independent module communicating via internal APIs.              | All             | HMW #13 | CDO    |
| 5.2 | PM Planner UX Patterns Audit   | Catalog PM Planner's best UX patterns (Factor Control, Gantt layout, menu structure) and deliberately adopt them in IRIS. Familiarity reduces training. | All             | HMW #14 | CXO    |
| 5.3 | Progressive Disclosure         | New capabilities (simulation, AI analytics) introduced progressively. Day 1 looks familiar; advanced features revealed through guided discovery.        | All             | HMW #15 | CXO    |

---

## Idea Summary

| Cluster                         | HMW Questions | Ideas Generated | Key Insight                                                                                                    |
| ------------------------------- | ------------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| 1: Concurrency & Collaboration  | #1, #2, #3    | 8               | Planners need Google Docs-like collaborative editing with intelligent conflict resolution and emotional safety |
| 2: Versioning & Change Tracking | #4, #5, #6    | 7               | Every change must be tracked, visualized, and auditable — with smart delta sync to external systems            |
| 3: Cross-Site Visibility        | #7, #8, #9    | 8               | Executives need a single entry point (world map) with progressive drill-down to any level of detail            |
| 4: Analytical Intelligence      | #10, #11, #12 | 7               | Analysts need a self-service analytics workbench powered by Elasticsearch and Samsung AI Services              |
| 5: Architecture & Adoption      | #13, #14, #15 | 3               | Architecture must enable evolution; adoption must honor familiarity                                            |
| **Total**                       | **15**        | **37**          |                                                                                                                |

---

## Dot Voting Results

> Each participant received 6 dots. Results determine which ideas form the nucleus of each concept.

| Rank | Idea                                        | Cluster       | Votes | Feasibility | Impact |
| ---- | ------------------------------------------- | ------------- | ----- | ----------- | ------ |
| 1    | 1.1 — Live Cursor Gantt (Google Docs model) | Collaboration | 8     | Medium      | High   |
| 2    | 3.1 — Interactive World Map Home            | Cross-Site    | 8     | High        | High   |
| 3    | 2.1 — Per-Project Diff Engine               | Versioning    | 7     | High        | High   |
| 4    | 4.1 — Dimension/Measure Palette             | Analytics     | 7     | High        | High   |
| 5    | 2.4 — Color-Coded Diff Viewer               | Versioning    | 6     | High        | High   |
| 6    | 1.4 — Auto-Merge Engine                     | Collaboration | 6     | Medium      | High   |
| 7    | 3.2 — Resource Heatmap Overlay              | Cross-Site    | 6     | High        | High   |
| 8    | 2.3 — Delta Detection for PROMIS Sync       | Versioning    | 6     | High        | High   |
| 9    | 1.5 — Conflict Resolution Dialog            | Collaboration | 5     | Medium      | High   |
| 10   | 3.7 — Department Treemap Drill-Down         | Cross-Site    | 5     | High        | High   |
| 11   | 4.4 — Samsung AI PIVOT Generation           | Analytics     | 5     | Medium      | Medium |
| 12   | 1.7 — Activity Feed Sidebar                 | Collaboration | 5     | High        | Medium |
| 13   | 2.6 — Approval-Gated Diff Review            | Versioning    | 4     | High        | High   |
| 14   | 3.6 — Site Summary Bubbles                  | Cross-Site    | 4     | High        | Medium |
| 15   | 4.5 — Scheduled Report Delivery             | Analytics     | 4     | High        | Medium |
| 16   | 5.2 — PM Planner UX Patterns Audit          | Architecture  | 4     | High        | Medium |
| 17   | 1.3 — Row-Level Soft Locking                | Collaboration | 3     | High        | Medium |
| 18   | 3.3 — Cross-Site Comparison Dashboard       | Cross-Site    | 3     | High        | Medium |
| 19   | 2.5 — Auto-Generated Change Summary         | Versioning    | 3     | Medium      | Medium |
| 20   | 4.2 — Chart Type Switcher                   | Analytics     | 3     | High        | Medium |
| 21   | 5.3 — Progressive Disclosure                | Architecture  | 3     | High        | Medium |
| 22   | 4.6 — Natural Language Query                | Analytics     | 2     | Low         | Medium |
| 23   | 1.8 — Offline-Tolerant Editing              | Collaboration | 2     | Low         | Medium |
| 24   | 2.7 — Selective Sync Dashboard              | Versioning    | 2     | High        | Low    |
| 25   | 4.7 — Report Template Library               | Analytics     | 2     | High        | Low    |

---

## Feasibility / Impact Matrix

```
                        HIGH IMPACT
                            |
                            |
    BIG BETS                |    QUICK WINS
    [Low Feas / High Imp]   |    [High Feas / High Imp]
                            |
    - NL query interface    |    - World map home (3.1)
      (4.6, future phase)   |    - Per-project diff engine (2.1)
    - Offline-tolerant      |    - Color-coded diff viewer (2.4)
      editing (1.8)         |    - Dimension/measure palette (4.1)
                            |    - Delta sync to PROMIS (2.3)
                            |    - Resource heatmap (3.2)
                            |    - Treemap drill-down (3.7)
                            |    - Approval-gated diff (2.6)
                            |
   -------------------------+---------------------------
                            |
    TIME SINKS              |    FILL-INS
    [Low Feas / Low Imp]    |    [High Feas / Low Imp]
                            |
    - Simulation parameter  |    - Change summary auto-gen (2.5)
      optimizer             |    - Report template library (4.7)
    - Three-way merge       |    - Selective sync dashboard (2.7)
      (offline mode)        |    - PM Planner UX audit (5.2)
                            |    - Progressive disclosure (5.3)
                            |
                       LOW IMPACT

   MEDIUM FEASIBILITY / HIGH IMPACT (Invest & Build):
    - Live Cursor Gantt (1.1) — WebSocket + OT complexity
    - Auto-Merge Engine (1.4) — conflict detection algorithms
    - Conflict Resolution Dialog (1.5) — multi-user UX design
    - Samsung AI PIVOT integration (4.4) — external API dependency
```

### Matrix Analysis

| Quadrant                                       | Count | Strategy                              | Items                                                                                                   |
| ---------------------------------------------- | ----- | ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Quick Wins** (High Feas / High Impact)       | 8     | Build first — foundation layer        | World map, diff engine, diff viewer, analytics palette, delta sync, heatmap, treemap, approval workflow |
| **Invest & Build** (Medium Feas / High Impact) | 4     | Engineer carefully — differentiators  | Live cursor Gantt, auto-merge, conflict dialog, Samsung AI                                              |
| **Big Bets** (Low Feas / High Impact)          | 2     | Defer to post-MVP — future value      | NL queries, offline editing                                                                             |
| **Fill-Ins** (High Feas / Low Impact)          | 5     | Include when time allows — low effort | Change summary, templates, selective sync, UX audit, progressive disclosure                             |
| **Time Sinks** (Low Feas / Low Impact)         | 2     | Avoid — poor ROI                      | Simulation optimizer, three-way merge                                                                   |

---

## Concept Formation

> Top-voted ideas clustered into 5 coherent solution concepts. These are **complementary modules** of a unified IRIS system, not competing alternatives. Each concept addresses 1-2 primary problem statements and maps to specific IRIS epics and Samsung requirements.

### Concept A: Real-time Collaborative Gantt

| Attribute            | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                 | Real-time Collaborative Gantt                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Tagline              | "Google Docs for P/M Planning" — multiple planners, one plan, zero conflicts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Primary PS           | PS-001 (Concurrency & Collaboration)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Secondary PS         | PS-005 (Architecture Limitations)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Description          | A WebSocket-powered xDHTML Gantt editor where multiple planners simultaneously edit the same P/M plan. Each user sees live cursors and cell highlights showing where others are editing. When planners modify different rows (different employees/projects), changes auto-merge silently. When the same cell is edited by two planners, a conflict resolution dialog appears with a side-by-side diff, letting the user choose "Keep Mine," "Keep Theirs," or manually merge. All saves create Draft versions that follow the approval workflow (Planner saves as Draft, Manager approves to Permanent). An activity feed sidebar shows real-time editing history. Row-level soft locking provides a gentle coordination signal without blocking. |
| Key Features         | Live cursors + presence indicators, WebSocket real-time sync, auto-merge for non-conflicting edits (1.4), conflict detection + diff dialog (1.5), row-level soft locking (1.3), Draft/Permanent version workflow (1.6), activity feed sidebar (1.7)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Core Ideas           | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Epics                | E03 (P/M Planner Concurrent Edit), E01 (Standard PM)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Samsung Req          | Req 0 (Mendix 10 + custom widgets), Req 3 (concurrent save, auto-merge, conflict resolve)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Target Persona       | Jisoo Park (Planner) — daily use, primary workflow                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Pros                 | Directly solves the #1 pain point (9.1/10 pain score); enables real-time collaboration impossible in PM Planner; familiar UX pattern (Google Docs/Figma); builds user trust through transparency; activity feed reduces coordination overhead                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Cons                 | WebSocket + OT/CRDT adds architectural complexity; requires custom Mendix 10 widget development; performance at scale (50+ concurrent users per plan) needs validation; offline scenarios add complexity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| CXO Design Principle | **Emotional safety first** — the UI must make concurrent editing feel safe, not stressful. Presence indicators, soft locks, and undo create a trust foundation before any data merges.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

**Selection Rationale**: This concept addresses the highest-severity pain point (9.1/10) and the most frequently cited frustration across all interviews. Real-time collaboration is the defining capability that differentiates IRIS from PM Planner. It earned 8 votes in ideation and maps directly to Samsung Req 3, which is a non-negotiable requirement. The Google Docs mental model is universally understood, reducing the learning curve.

---

### Concept B: Simulation Sandbox

| Attribute            | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name                 | Simulation Sandbox                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Tagline              | "Clone, play, compare, decide" — risk-free what-if resource planning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Primary PS           | PS-002 (Versioning & Change Tracking)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Secondary PS         | PS-001 (Collaboration — what-if without affecting live data)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Description          | A simulation environment where planners create isolated copies of approved roadmap versions to test alternative resource allocation strategies. The planner clones a roadmap, gives the simulation a scenario name (e.g., "HBM4 Acceleration"), and freely modifies allocations in a Gantt view. Multiple simulation variants can be created and compared side-by-side with the source roadmap and each other. An overlay Gantt shows baseline vs. simulation with color-coded deltas. A comparison dashboard displays key metrics (total HC, utilization %, project coverage, gap analysis) across all variants. When the optimal simulation is identified, it can be promoted to a new roadmap draft version for approval. Each simulation is independently versioned. |
| Key Features         | Clone-from-roadmap wizard, isolated simulation editing environment, multi-variant management, side-by-side Gantt overlay with color-coded deltas, comparison dashboard with KPIs, promote-to-roadmap workflow, independent simulation versioning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Core Ideas           | (from HMW #15 brainstorm — cross-referenced from reference document)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Epics                | E05 (Resource Simulation), E04 (Resource Roadmap & Versioning)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Samsung Req          | Req 1 (separate Roadmap & Simulation), Req 4 (Roadmap/Simulation versioning)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Target Persona       | Jisoo Park (Planner), Minho Kim (Manager) — planning decisions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Pros                 | Enables data-driven resource allocation decisions; risk-free exploration without live data impact; strong differentiator vs. PM Planner; supports Samsung's explicit requirement for separate roadmap/simulation; versioned simulations create audit trail; comparison view supports manager review                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Cons                 | Deep clone of large roadmaps may be expensive (Oracle + Elasticsearch); comparison UI is complex to design well; users must understand the clone-edit-compare mental model; storage growth with many simulation variants                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| CXO Design Principle | **Safety through isolation** — the sandbox metaphor must make planners feel they cannot break anything. Visual cues (border color, "SIMULATION" badge, watermark) clearly distinguish simulation from live data at all times.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

**Selection Rationale**: Simulation capability is explicitly required by Samsung (Req 1, Req 4) and directly enables Minho's need for data-driven planning decisions. The clone-compare-promote workflow addresses the decision paralysis identified in PS-002 by letting teams explore options without risk. This concept scored 19/25 in evaluation but is essential for the complete system.

---

### Concept C: Global Resource Cockpit

| Attribute            | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name                 | Global Resource Cockpit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Tagline              | "One map, five sites, zero blind spots" — executive resource visibility in real time                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Primary PS           | PS-003 (Cross-Site Visibility)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Secondary PS         | PS-004 (Analytical Intelligence)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Description          | An ECharts.js-powered world map home screen showing all Samsung DSR sites (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung) with live resource statistics. Each site pin displays a summary bubble with total headcount, allocation utilization %, active project count, and headcount gap. A resource heatmap overlay shows utilization intensity by color (red = over-allocated >95%, amber = high 80-95%, green = available <80%). Clicking a site drills into a site dashboard with department breakdown (treemap), project allocation heatmap (department x project), and headcount trend (12-month line chart). Factor Control filters are persistent across all views. The world map doubles as the HeadCount Portfolio view for Soyeon (HR), showing staffing plans, current vs. target headcount, and gap analysis. Smart alert badges flag sites with critical metrics. |
| Key Features         | ECharts world map with geo-positioned site pins (3.1), resource heatmap overlay (3.2), site summary bubbles (3.6), drill-down: site > department > team > person (3.7), cross-site comparison dashboard (3.3), HeadCount Portfolio overlay, Factor Control integration (3.5), smart alert badges (3.8), role-based default views                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Core Ideas           | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Epics                | E07 (World Map & Navigation), E06 (HeadCount Portfolio), E10 (Factor Control)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Samsung Req          | Req 6 (Factor Control), Req 7 (world map + role-based menu), Req 8 (analysis views), Req 9 (HeadCount Portfolio)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Target Persona       | Minho Kim (Manager), Soyeon Choi (HR) — executive visibility                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Pros                 | Immediate executive value — replaces 2-3 days of manual compilation; familiar map metaphor; serves multiple personas (Division Manager, HR, Analyst); Elasticsearch aggregations enable sub-second response; portfolio and navigation combined in one screen; progressive drill-down preserves context                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Cons                 | World map is primarily read-only (value is visibility, not action); heatmap color scales need careful calibration for Samsung's data ranges; requires clean, up-to-date master data from N-PLM sync                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| CXO Design Principle | **Progressive revelation** — the world map starts simple (5 pins, key metrics) and reveals complexity only when the user asks for it. No information overload on first view. Every click deepens understanding.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

**Selection Rationale**: This concept received the joint-highest votes (8) in ideation and addresses the "strategic frustration" emotion documented in PS-003. It serves as the entry point and navigation hub for the entire IRIS system, making it architecturally essential. It maps to four Samsung requirements (Req 6-9) and serves both Minho (executive decisions) and Soyeon (HR portfolio management). The ECharts.js + Elasticsearch stack makes it technically straightforward while delivering high visual impact.

---

### Concept D: Smart Delta Engine

| Attribute            | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                 | Smart Delta Engine                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Tagline              | "Track every change, sync only what matters" — precision version control for resource plans                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Primary PS           | PS-002 (Versioning & Change Tracking)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Secondary PS         | PS-005 (Architecture — foundational infrastructure)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Description          | A version control system purpose-built for resource planning data. Every roadmap, P/M plan, and simulation is versioned with full change history. A diff engine compares any two versions by matching records on composite keys (employee_id + project_id + period) and classifies changes as ADDED (green), REMOVED (red), MODIFIED (yellow), or UNCHANGED (gray). The diff is displayed in a side-by-side viewer widget with color coding. On version approval, the delta detection engine identifies which projects changed and sends ONLY those to PROMIS and N-PLM via REST API, eliminating the current full-sync waste. A selective sync dashboard lets managers review what will be synced before confirming. Change summaries are auto-generated in human-readable format. An approval workflow requires mandatory diff review before sync. |
| Key Features         | Per-project version history (2.1), composite-key diff algorithm, side-by-side diff viewer widget (2.4), color-coded change visualization, delta detection for PROMIS/N-PLM sync (2.3), selective sync dashboard (2.7), auto-generated change summaries (2.5), approval-gated sync trigger (2.6), change timeline panel (2.2)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Core Ideas           | 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Epics                | E04 (Resource Roadmap & Versioning), E11 (Integration N-PLM/PROMIS/SMDM/GHRP), E12 (Smart Notifications)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Samsung Req          | Req 1 (version history), Req 2 (per-project versions + delta sync), Req 4 (Roadmap/Simulation versioning), Req 5 (N-PLM integration)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Target Persona       | Jisoo Park (Planner), Minho Kim (Manager) — version governance                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Pros                 | Foundational infrastructure — every other concept depends on versioning and diff; directly addresses Samsung's strongest technical request (Req 2: delta sync); eliminates wasted PROMIS bandwidth; audit trail enables compliance and accountability; diff viewer widget is reusable across all planning modules                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Cons                 | Version storage grows with each version (requires archival strategy at Oracle layer); diff algorithm complexity for large datasets (1000+ allocation records per version); the diff viewer is a custom Mendix widget requiring dedicated development effort                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| CXO Design Principle | **Clarity through comparison** — the diff viewer must make changes instantly scannable. Color coding, magnitude indicators, and human-readable summaries ensure that managers never need to "figure out" what changed. Confidence in the data drives faster decisions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

**Selection Rationale**: This is the foundational infrastructure concept that all other concepts depend on. Without reliable versioning and diff capability, Concepts A (collaboration), B (simulation), and the approval workflows cannot function. Delta sync (Req 2) is Samsung's strongest technical requirement and the single largest operational inefficiency in the current PM Planner workflow. The diff engine is architecturally straightforward (deterministic composite-key comparison) but delivers outsized value.

---

### Concept E: AI-Powered Analysis Builder

| Attribute            | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name                 | AI-Powered Analysis Builder                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Tagline              | "From question to chart in seconds" — self-service analytics with AI intelligence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Primary PS           | PS-004 (Analytical Intelligence)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Secondary PS         | PS-003 (Cross-Site Visibility — analysis enables understanding)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Description          | A self-service analytics workbench where analysts interactively select dimensions (site, department, project, time, skill category) and measures (headcount, allocation %, gap, utilization) from a palette. The system builds Elasticsearch aggregation queries dynamically and renders results using ECharts.js in the user's chosen chart type (bar, line, pie, heatmap, treemap, table). Factor Control filters scope the data. For advanced reporting, one-click integration with Samsung AI Services generates formatted Excel PIVOT tables from the aggregated data with trend annotations. Analysts can save report configurations and schedule automatic delivery via Smart Notify email. Pre-built report templates cover common analyses (actual vs. plan gap, resource utilization trend, cross-site comparison, staffing forecast). Natural language query ("Show me headcount by department for Hwaseong Q2 2026") is a post-MVP stretch goal. |
| Key Features         | Dimension/measure palette with drag-and-drop (4.1), dynamic chart type switching (4.2), Elasticsearch-powered aggregations, Samsung AI Services PIVOT generation (4.4), scheduled report delivery via Smart Notify (4.5), Factor Control integration (4.3), report template library (4.7), Excel/PDF export, natural language query (4.6, post-MVP)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Core Ideas           | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Epics                | E08 (Analysis & Reporting), E09 (AI-Based Reporting), E12 (Smart Notifications)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Samsung Req          | Req 8 (analysis views), Req 10 (analysis reporting), Req 11 (AI-based reporting)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Target Persona       | Eunji Lee (Analyst), Minho Kim (Manager) — analytics and reporting                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Pros                 | Eliminates Excel dependency for 60%+ of analyst workflows; Samsung AI Services integration is a strong competitive differentiator; scheduled delivery reduces recurring manual overhead to zero; Elasticsearch makes aggregations fast at any scale; self-service model democratizes analytics beyond specialists                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Cons                 | Samsung AI Services is an external dependency (availability, latency, API stability); natural language query is aspirational and should be deferred to post-MVP; report template design requires domain expertise from Samsung DSR analysts; dimension/measure palette UX must be carefully designed to avoid overwhelming non-analysts                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| CXO Design Principle | **Democratized insight** — analytics should not require analyst expertise for basic questions. The palette and templates make self-service accessible. AI amplifies capability without replacing judgment. Reports should answer questions, not create more.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

**Selection Rationale**: This concept transforms Eunji's daily workflow by eliminating the Excel export cycle that consumes 60%+ of analyst time. It maps to three Samsung requirements (Req 8, 10, 11) and is the primary vehicle for AI integration in IRIS (AX Principle 8: AI as Team Member). The Elasticsearch + ECharts.js stack is well-proven for this use case. Samsung AI Services integration positions IRIS as a forward-looking platform. The scheduled delivery feature (Smart Notify) has cross-concept value.

---

## Concept Evaluation: Desirability / Feasibility / Viability

| Criterion                                                           | A: Collaborative Gantt | B: Simulation Sandbox | C: Global Cockpit | D: Smart Delta Engine | E: AI Analysis Builder |
| ------------------------------------------------------------------- | :--------------------: | :-------------------: | :---------------: | :-------------------: | :--------------------: |
| **Desirability** (user value, pain addressed)                       |           5            |           4           |         5         |           4           |           5            |
| **Feasibility** (technical complexity, team capability)             |           3            |           3           |         4         |           4           |           4            |
| **Viability** (business value, Samsung req alignment)               |           5            |           4           |         5         |           5           |           4            |
| **Innovation** (differentiation vs. PM Planner/market)              |           4            |           4           |         3         |           3           |           4            |
| **AX Alignment** (evidence-driven, user-first, hypothesis-testable) |           5            |           4           |         4         |           5           |           4            |
| **Total**                                                           |       **22/25**        |       **19/25**       |     **21/25**     |       **21/25**       |       **21/25**        |

### Scoring Rationale

| Rank | Concept                              | Score | System Role                                                          |
| ---- | ------------------------------------ | ----- | -------------------------------------------------------------------- |
| 1    | **A: Real-time Collaborative Gantt** | 22/25 | Primary differentiator — core planning UX that defines IRIS          |
| 2    | **C: Global Resource Cockpit**       | 21/25 | Executive entry point — drives adoption from the top down            |
| 2    | **D: Smart Delta Engine**            | 21/25 | Foundational infrastructure — all concepts depend on versioning/diff |
| 2    | **E: AI-Powered Analysis Builder**   | 21/25 | Analytics transformation — replaces Excel-centric workflow           |
| 5    | **B: Simulation Sandbox**            | 19/25 | Strategic planning tool — high value, medium complexity              |

---

## Decision

| Attribute         | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Selected Concepts | **All 5 concepts selected for prototyping** — they form a complete IRIS system, not competing alternatives                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Rationale         | Unlike a typical HMW workshop where you select 1-2 competing concepts, the 5 IRIS concepts are **complementary modules** of a unified system. Concept D (Smart Delta Engine) is foundational infrastructure that all other concepts depend on. Concept A (Collaborative Gantt) is the core planning UX. Concept C (Global Cockpit) is the entry point and navigation hub. Concept B (Simulation Sandbox) extends planning with what-if capability. Concept E (AI Analysis Builder) transforms reporting. Removing any one would leave a Samsung requirement unaddressed. The phasing strategy below manages complexity and risk. |
| MVP Phasing       | **Phase 1 (MVP)**: D (version engine + diff + delta sync) + A (concurrent Gantt) + C (world map + basic navigation). Delivers foundation, core planning UX, and executive entry point. **Phase 2**: B (simulation sandbox) + E (analytics + AI reporting). **Phase 3**: NL queries, advanced simulation optimization, offline mode.                                                                                                                                                                                                                                                                                              |
| Next Step         | Create detailed concept sketches (S1b — T14) for all 5 concepts, then proceed to S2 Prototype Specs with 10 key screens.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

---

## CXO Design Principles

> Five design principles emerged from the workshop ideation process. These will guide all subsequent design decisions in IRIS.

### Principle 1: Emotional Safety First

Concurrent editing must feel safe, not stressful. Before asking users to trust auto-merge algorithms, the UI must build confidence through visible presence indicators, soft locks, undo capability, and clear conflict resolution flows. Overwrite anxiety (PS-001, 9.1/10 pain) is an emotional problem, not just a technical one.

_Applies to_: Concept A (Collaborative Gantt)

### Principle 2: Safety Through Isolation

The simulation sandbox must make planners feel they cannot break anything. Visual cues — border color, "SIMULATION" badge, watermark — must clearly distinguish simulation from live data at all times. The clone-edit-compare mental model must be immediately obvious.

_Applies to_: Concept B (Simulation Sandbox)

### Principle 3: Progressive Revelation

The world map starts simple (5 pins, key metrics) and reveals complexity only when the user asks for it. No information overload on first view. Every click deepens understanding without losing the navigation context. Breadcrumbs and back navigation must be seamless.

_Applies to_: Concept C (Global Cockpit)

### Principle 4: Clarity Through Comparison

The diff viewer must make changes instantly scannable. Color coding (green/red/yellow/gray), magnitude indicators, and human-readable summaries ensure that managers never need to "figure out" what changed. Confidence in the data drives faster approval decisions.

_Applies to_: Concept D (Smart Delta Engine)

### Principle 5: Democratized Insight

Analytics should not require specialist expertise for basic questions. The dimension/measure palette and report templates make self-service accessible to planners and managers, not just analysts. AI amplifies capability without replacing human judgment.

_Applies to_: Concept E (AI Analysis Builder)

---

## Traceability Matrix

| Concept                | Problem Statements | Samsung Req | Feature Areas | Epics         | Primary Persona        | HMW Questions |
| ---------------------- | ------------------ | ----------- | ------------- | ------------- | ---------------------- | ------------- |
| A: Collaborative Gantt | PS-001, PS-005     | 0, 3        | F1, F3        | E03, E01      | Jisoo Park (Planner)   | #1, #2, #3    |
| B: Simulation Sandbox  | PS-002, PS-001     | 1, 4        | F3            | E05, E04      | Jisoo Park, Minho Kim  | #4, #6        |
| C: Global Cockpit      | PS-003, PS-004     | 6, 7, 8, 9  | F4            | E07, E06, E10 | Minho Kim, Soyeon Choi | #7, #8, #9    |
| D: Smart Delta Engine  | PS-002, PS-005     | 1, 2, 4, 5  | F1, F2, F3    | E04, E11, E12 | Jisoo Park, Minho Kim  | #4, #5, #6    |
| E: AI Analysis Builder | PS-004, PS-003     | 8, 10, 11   | F5, F6, F7    | E08, E09, E12 | Eunji Lee, Minho Kim   | #10, #11, #12 |

### Coverage Verification

| Samsung Requirement                                  | Covered By Concept                |
| ---------------------------------------------------- | --------------------------------- |
| Req 0: Mendix 10 + custom widgets                    | A (Gantt widget), D (diff widget) |
| Req 1: Separate Roadmap & Simulation                 | B, D                              |
| Req 2: Per-project versions + delta sync             | D                                 |
| Req 3: Concurrent save, auto-merge, conflict resolve | A                                 |
| Req 4: Roadmap/Simulation versioning                 | B, D                              |
| Req 5: N-PLM integration                             | D                                 |
| Req 6: Factor Control                                | C                                 |
| Req 7: World map + role-based menu                   | C                                 |
| Req 8: Analysis views                                | C, E                              |
| Req 9: HeadCount Portfolio                           | C                                 |
| Req 10: Analysis reporting                           | E                                 |
| Req 11: AI-based reporting                           | E                                 |
| Req 12: Smart Notifications                          | D, E                              |

**Result**: All 13 Samsung requirements (Req 0-12) are covered by the 5 selected concepts.

---

## Action Items

| #   | Action                                                                    | Owner    | Due Date   | Status  |
| --- | ------------------------------------------------------------------------- | -------- | ---------- | ------- |
| 1   | Create detailed T14 Concept Sketches for all 5 concepts (S1b deliverable) | CXO + AI | 2026-03-22 | Pending |
| 2   | Create S2 Prototype Specs with 10 key IRIS screens                        | CXO + AI | 2026-03-23 | Pending |
| 3   | Architecture validation: confirm WebSocket + OT feasibility in Mendix 10  | CDO      | 2026-03-24 | Pending |
| 4   | Deep clone performance benchmark: test cloning a 500-project roadmap      | CDO      | 2026-03-24 | Pending |
| 5   | Samsung AI Services API review: confirm PIVOT generation capability       | CAO      | 2026-03-24 | Pending |
| 6   | Review concept sketches with Samsung DSR stakeholders (Jisoo, Minho)      | CEO/CPO  | 2026-03-25 | Pending |
| 7   | Prepare concept validation test plan (S3) for 4-6 Samsung DSR users       | CXO      | 2026-03-26 | Pending |

---

## Related Templates

- **T08_PROBLEM_STATEMENT** — Source problem statements for this workshop
- **T14_CONCEPT_SKETCH** — Detailed concept documentation (next deliverable)

## Related Guides

- **S1_IDEATION_WORKSHOP_GUIDE** — Detailed guidance on facilitating HMW ideation workshops within the AX DESIGN phase
- **S2_PROTOTYPING_GUIDE** — Guidance on building prototypes from concept sketches

---

_This document follows the AX Transformation Framework T13 HMW Ideation Workshop template (v2.0.0)._
_Workshop facilitated by CXO with AI assistance on 2026-03-21._
_Next step: Proceed to S1b — Concept Sketches (T14) for all 5 selected concepts._
