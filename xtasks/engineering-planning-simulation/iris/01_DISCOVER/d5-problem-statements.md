# Problem Statements — IRIS

> **AX Transformation Framework v2.0.0** | DISCOVER Phase — Deliverable D5a
> **Author**: CXO (User Experience Lead) | **Date**: 2026-03-21
> **Status**: Validated

---

## Document Purpose

This document captures 5 validated problem statements for the IRIS project (Intelligent Resources Information System), a NEW BUILD resource planning platform replacing PM Planner for Samsung Electronics Device Solution Research (DSR). Each problem statement synthesizes findings from 10 customer interviews, 10 affinity themes, 4 empathy maps, and 4 personas. Problems are stated in Point of View (POV) format with CXO empathy framing — centering the emotional experience of users alongside quantitative evidence.

**Critical Context**: IRIS is a new build from scratch on Mendix 10. PM Planner (Mendix 7/8) is reference only — it will not be upgraded.

**Samsung DS Sites**: Hwaseong (HQ), Pyeongtaek, Austin (TX), Xi'an (China), Giheung

---

## Problem Statement 1: Concurrency & Collaboration

### Metadata

| Field          | Value                 |
| -------------- | --------------------- |
| Project        | IRIS                  |
| Product        | IRIS by Amoza         |
| Problem ID     | PS-IRIS-001           |
| Version        | v1.0                  |
| Date           | 2026-03-21            |
| Author         | CXO                   |
| Status         | Validated             |
| Pain Score     | 9.1/10                |
| Frequency      | Daily                 |
| Emotional Core | **Overwrite Anxiety** |

### Problem Statement (POV Format)

**Jisoo Park, a Resource Planner at Hwaseong (Memory/DRAM division),** needs a way to **collaboratively edit P/M plans with her team in real time without fear of losing her work** because **PM Planner's last-save-wins model silently destroys hours of careful allocation adjustments, forcing her team into an exhausting cycle of defensive saving every 10 minutes, maintaining a shared "editing calendar" that costs 4-6 hours per week, and coordinating through email and chat channels that break down entirely across time zones.**

### Problem Context

Samsung DSR's resource planning teams consist of 5-10 planners per site who frequently need to edit the same P/M projects simultaneously. PM Planner operates on a last-save-wins model with zero conflict detection, no auto-merge, and no notification when another user is editing the same data. When two planners save changes to the same project, the second save silently overwrites the first. This problem is amplified by time zone asymmetry across Samsung DS sites — overnight changes from Korea overwrite work done in Austin with no trace. The emotional toll is severe: planners describe a persistent state of anxiety about whether their work will survive, leading to defensive behaviors that waste time and erode trust in the system.

### Evidence

| #   | Evidence Type | Source           | Summary                                                                                                                         |
| --- | ------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Interview     | INT-IRIS-001     | Jisoo lost 3 hours of P/M adjustments when a colleague saved 5 minutes before her — no warning, no merge, no recovery           |
| 2   | Interview     | INT-IRIS-001     | Team maintains shared "editing calendar" (Google Sheet) to reserve time slots for editing; costs 4-6 hours/week in coordination |
| 3   | Interview     | INT-IRIS-003     | Austin planner spends 5+ hours/week as "morning detective" — reconstructing overnight changes made by Korea team                |
| 4   | Interview     | INT-IRIS-003     | Time zone asymmetry (KST vs CST) makes concurrent conflicts invisible until the next morning                                    |
| 5   | Interview     | INT-IRIS-004     | Over-allocation of shared engineer (120% across departments) detected only in monthly reconciliation meeting                    |
| 6   | Interview     | INT-IRIS-004     | Monthly reconciliation meeting: 3-4 hours with printed Excel sheets to resolve cross-department overlaps                        |
| 7   | Interview     | INT-IRIS-002     | Daniel describes team anxiety: "Will my changes survive?" — defensive save behavior every 10-15 minutes                         |
| 8   | Interview     | INT-IRIS-005     | Soojin's team at Pyeongtaek maintains manual change log spreadsheet as coordination mechanism                                   |
| 9   | Observation   | Affinity Theme 1 | 8/10 interviewees reported concurrent editing conflicts; average severity 8.1/10 across interviews                              |
| 10  | Empathy Map   | Planner Persona  | "I've learned to save obsessively — every 10 minutes — just in case someone else is working on the same project"                |

### Emotional Impact Analysis (CXO Perspective)

**Emotional Core: Overwrite Anxiety**

The concurrency problem is not merely a productivity issue — it is an emotional and trust-destroying experience. Planners describe a persistent state of vigilance: the dread that careful, thoughtful work will vanish without warning. This anxiety manifests in several damaging behaviors:

- **Defensive saving** every 10-15 minutes disrupts analytical flow and deep planning work
- **Territorial editing** — planners avoid touching projects others might be editing, leading to planning delays
- **Learned distrust** of PM Planner — users assume the system will fail them, lowering engagement
- **Cross-site resentment** — overseas sites (Austin, Xi'an) feel structurally disadvantaged because Korea edits during their night

When Jisoo says "I've learned to save obsessively," she is describing a user who has been trained by the system to expect betrayal. This is the antithesis of a tool that supports her work. IRIS must transform this emotional experience from anxiety to confidence — users must feel that their work is safe, visible, and respected by the system.

### Impact Assessment

| Dimension         | Current State                                                          | Desired State                                             | Gap                                        |
| ----------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------ |
| Time              | 4-6 hrs/week per team on conflict avoidance coordination               | 0 hrs — system handles concurrency natively               | 4-6 hrs/week recovered per team            |
| Data Loss         | Unquantified hours of P/M edits lost weekly to silent overwrites       | 0 data loss — all changes preserved via merge/conflict UI | 100% improvement in data preservation      |
| Coordination      | Manual "editing calendar" + email/Teams coordination                   | Real-time presence awareness + auto-merge                 | Eliminate human coordination overhead      |
| Trust             | Planners do not trust PM Planner to preserve their work                | System earns trust through reliable concurrency           | Foundational trust shift for IRIS adoption |
| Cross-Site Impact | Overseas sites (Austin, Xi'an) structurally disadvantaged by time zone | Concurrent editing works equally across all time zones    | Level playing field for all 5 sites        |

### Affected Personas & Feature Areas

| Attribute                 | Detail                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| Primary Persona(s)        | **Jisoo Park** — The Operational Planner (Hwaseong, Memory/DRAM)                                |
| Secondary Persona(s)      | **Minho Kim** — The Governance Leader (approval workflow within concurrency); all site planners |
| Estimated People Impacted | 40-60 planners across all Samsung DS sites                                                      |
| Organizational Scope      | Enterprise-wide — every site, every division                                                    |
| Feature Areas             | **F1** (Standard P/M Management), **F2** (Project Management)                                   |
| Samsung Requirements      | **Req 3** (Concurrent Editing), **Req 1** (Data Integrity)                                      |

### Root Cause Analysis (5 Whys)

1. **Why?** Planners lose hours of work when saving concurrently → Because PM Planner uses a last-save-wins model with no conflict detection
2. **Why?** No conflict detection exists → Because PM Planner was designed as a single-user data entry tool, not a collaborative planning platform
3. **Why?** Single-user design was accepted → Because PM Planner was originally built for small teams at single sites before Samsung DS expanded globally
4. **Why?** No upgrade to multi-user collaboration → Because PM Planner on Mendix 7/8 would require fundamental architectural changes to support real-time collaboration
5. **Why?** (Root cause) PM Planner's architecture cannot support concurrent editing, auto-merge, or real-time presence — which is why IRIS must be built from scratch on Mendix 10

### Current Workarounds & Their Cost

| Workaround                         | Description                                                                      | Cost / Limitation                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Editing calendar**               | Shared Google Sheet where planners reserve time slots to edit specific projects  | 4-6 hrs/week per team; only prevents known conflicts; fails for unexpected edits |
| **Defensive saving**               | Planners save every 10-15 minutes to minimize loss window                        | Disrupts planning flow; doesn't prevent conflicts; increases server load         |
| **Email/Teams coordination**       | Planners message colleagues before editing shared projects                       | Breaks down across time zones; relies on all parties being responsive and online |
| **Manual change logs**             | Teams maintain spreadsheets logging every PM Planner change                      | Time-consuming; incomplete; no system enforcement; human error-prone             |
| **Monthly reconciliation meeting** | 3-4 hour meeting with printed Excel sheets to resolve cross-department conflicts | Reactive (detects month-old conflicts); 3-4 hours of senior planner time wasted  |

### Design Challenge (CXO Framing)

**How might we** design a real-time collaborative editing experience for P/M plans that:

- Provides instant visual awareness of who is editing what (presence indicators)
- Handles concurrent changes through intelligent auto-merge with clear conflict resolution UI
- Works seamlessly across time zones so no site is disadvantaged
- Rebuilds planner trust through visible proof that their work is safe

**UX Design Implications**: The conflict resolution interface must be intuitive enough that planners understand merge/overwrite options without training. Presence indicators must be ambient (visible but not distracting). The system must communicate clearly: "Your work is safe."

### Problem Severity

| Attribute      | Value                                                                                                                                                                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severity Score | **9.1/10**                                                                                                                                                                                                                                                                                               |
| Rationale      | Highest-frequency, highest-severity pain across all 10 interviews. Affects daily operations of every planner at every site. Creates data loss, coordination overhead, and systemic trust deficit. This is the foundation problem — if IRIS does not solve concurrency, nothing else matters to planners. |

### Success Metrics

| #   | Metric                                      | Target                                | Measurement Method                |
| --- | ------------------------------------------- | ------------------------------------- | --------------------------------- |
| 1   | Data loss incidents from concurrent editing | 0 per month                           | System conflict resolution log    |
| 2   | Coordination overhead for editing           | < 30 min/week per team (from 4-6 hrs) | Team self-report survey           |
| 3   | Cross-site change awareness latency         | < 5 minutes (from next-morning)       | System notification delivery time |
| 4   | Planner trust score for data preservation   | > 8/10 (estimated current: 3-4/10)    | Post-launch user survey           |
| 5   | Time to resolve editing conflict            | < 2 minutes via UI                    | System UX analytics               |

### Constraints

- **Technical**: Must support concurrent editing across geographically distributed sites with 100-500ms latency
- **Business**: Must not slow down save operations for single-user editing scenarios
- **UX**: Conflict resolution UI must be intuitive without training — zero learning curve for merge/overwrite decisions
- **Data**: Must preserve complete change history for audit trail (links to PS-IRIS-002)
- **Timeline**: Must be addressable in Year 1 MVP scope (Req 3 is Samsung P0)

---

## Problem Statement 2: Versioning & Change Tracking

### Metadata

| Field          | Value                  |
| -------------- | ---------------------- |
| Project        | IRIS                   |
| Product        | IRIS by Amoza          |
| Problem ID     | PS-IRIS-002            |
| Version        | v1.0                   |
| Date           | 2026-03-21             |
| Author         | CXO                    |
| Status         | Validated              |
| Pain Score     | 8.5/10                 |
| Frequency      | Daily                  |
| Emotional Core | **Decision Paralysis** |

### Problem Statement (POV Format)

**Jisoo Park, a Resource Planner at Hwaseong,** needs a way to **track per-project version history with clear change attribution and selective sync to downstream systems** because **PM Planner stores only "current state" with no version history, forcing planners to maintain physical paper notebooks, personal Excel archives, and manual change log spreadsheets — while full sync to PROMIS wastes 4+ hours bi-weekly, triggers false recalculation artifacts that take finance teams 2 days to investigate, and makes it impossible for anyone to trust "the current version."**

### Problem Context

PM Planner stores only the current state of each P/M plan — there is no version history, no change log, no diff view, and no ability to roll back. When planners or managers need to understand what changed, they must compare the current state against manually exported Excel snapshots. The lack of version control also impacts downstream integration: syncing to PROMIS and N-PLM sends all projects (including unchanged ones) because the system cannot identify which have been modified. This full sync wastes processing time and triggers recalculation artifacts in PROMIS that misrepresent profit margins for unchanged projects. The emotional result is decision paralysis — managers cannot distinguish draft from final, planners cannot prove what they changed, and nobody trusts "the current version."

### Evidence

| #   | Evidence Type | Source               | Summary                                                                                                            |
| --- | ------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 1   | Interview     | INT-IRIS-002         | "Version management in PM Planner is a fiction. There's just 'current state' and whatever I wrote in my notebook." |
| 2   | Interview     | INT-IRIS-002         | Physical paper "version notebook" — planner records every change with timestamps and project IDs by hand           |
| 3   | Interview     | INT-IRIS-002         | 3 hours/week on manual version comparison against personal Excel snapshots                                         |
| 4   | Interview     | INT-IRIS-004         | Manager spends 40% of review time (2.5-3 hrs/week) on cell-by-cell comparison of plan versions                     |
| 5   | Interview     | INT-IRIS-004         | Cannot distinguish draft from permanent — manager accidentally acted on draft data, causing downstream confusion   |
| 6   | Interview     | INT-IRIS-005         | Pyeongtaek team maintains manual "change log spreadsheet" shared across the site                                   |
| 7   | Interview     | INT-IRIS-005         | PROMIS full sync triggered false profit margin changes for 30+ unchanged projects                                  |
| 8   | Interview     | INT-IRIS-005         | Finance team spent 2 full days verifying recalculation artifacts were not real changes                             |
| 9   | Interview     | INT-IRIS-001         | PROMIS sync sends all 200+ projects; 90%+ data is unchanged; takes 4+ hours per cycle                              |
| 10  | Observation   | Affinity Themes 2, 3 | 9/10 interviewees affected by version management void; 7/10 by PROMIS sync waste                                   |

### Emotional Impact Analysis (CXO Perspective)

**Emotional Core: Decision Paralysis**

The absence of version control creates a pervasive uncertainty that paralyzes decision-making at every level:

- **Planners** cannot prove what they changed or when — they resort to physical notebooks as personal audit trails, a practice that signals deep distrust of the digital system
- **Managers** cannot distinguish draft from final data — when Minho accidentally acted on draft data, the consequence was not just an error but a loss of confidence in the planning process itself
- **Finance teams** spend 2 days chasing phantom changes caused by full sync artifacts — this is not just wasted time but accumulated frustration with a system that creates false signals
- **Everyone** experiences a version of "Is this the right data?" anxiety before every decision

When Daniel records changes in a physical paper notebook, he is performing a ritual of self-protection against a system that offers no accountability. This is a user who has given up on the tool and created a parallel analog system. IRIS must make version history so effortless and trustworthy that the paper notebook becomes unnecessary.

### Impact Assessment

| Dimension           | Current State                                                                                        | Desired State                                                           | Gap                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| Time                | 3+ hrs/week per planner on manual version tracking; 2.5+ hrs/week per manager on comparison          | < 15 min/week — automatic diff and change log                           | 5+ hrs/week recovered per planner-manager pair |
| Data Integrity      | PROMIS full sync creates false recalculation artifacts; 2 days of finance investigation per incident | Delta sync eliminates artifacts; only real changes propagate            | 100% elimination of sync-induced false changes |
| Sync Efficiency     | 4+ hours bi-weekly for full sync of 200+ projects                                                    | < 30 minutes for delta sync of changed projects only                    | 87%+ time reduction                            |
| Accountability      | No audit trail — cannot prove who changed what or when                                               | Complete change attribution with timestamps, user IDs, and reasons      | From zero accountability to full traceability  |
| Decision Confidence | Draft data mistaken for final; decisions based on ambiguous plan status                              | Draft/final distinction with clear visual indicators and workflow gates | Elimination of status ambiguity                |

### Affected Personas & Feature Areas

| Attribute                 | Detail                                                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Primary Persona(s)        | **Jisoo Park** — The Operational Planner (version tracking daily); **Minho Kim** — The Governance Leader (review, approval, audit) |
| Secondary Persona(s)      | **Soojin Lee** — Integration Specialist (PROMIS sync integrity); all planners and managers                                         |
| Estimated People Impacted | 40-60 planners + 10-15 managers + finance teams (~75 total)                                                                        |
| Organizational Scope      | Enterprise-wide — affects planning, approval, sync, and finance workflows                                                          |
| Feature Areas             | **F1** (Standard P/M), **F2** (Project Management), **F6** (Reporting)                                                             |
| Samsung Requirements      | **Req 1** (Data Management), **Req 2** (Version Control), **Req 4** (Approval Workflow)                                            |

### Root Cause Analysis (5 Whys)

1. **Why?** Planners maintain manual version tracking → Because PM Planner has no per-project version history
2. **Why?** No version history exists → Because PM Planner's data model stores only current state, not historical states
3. **Why?** Only current state is stored → Because the original design assumed single-version, single-user operation at a single site
4. **Why?** PROMIS sync sends everything → Because PM Planner cannot identify which projects changed since the last sync (no change flags, no timestamps)
5. **Why?** (Root cause) PM Planner lacks change tracking at the data layer — no timestamps, no change flags, no version chains — making both version history and delta sync architecturally impossible without a complete redesign

### Current Workarounds & Their Cost

| Workaround                     | Description                                                                | Cost / Limitation                                                           |
| ------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Personal Excel archives**    | Planners export PM Planner data weekly as version backups                  | Manual; fragile; no structured diff; version files proliferate uncontrolled |
| **Physical version notebooks** | Planner records changes with timestamps in paper notebook                  | Not searchable, shareable, or auditable; single point of failure            |
| **Change log spreadsheets**    | Team-maintained shared log of all PM Planner changes                       | Relies on discipline; consistently incomplete; no system enforcement        |
| **Cell-by-cell comparison**    | Managers compare current PM Planner state against old Excel exports by eye | Consumes 40% of review time (2.5-3 hrs/week); error-prone; unsustainable    |
| **Post-sync verification**     | PROMIS team asks planners "which projects actually changed?" after sync    | Defeats purpose of system integration; adds manual overhead to both teams   |

### Design Challenge (CXO Framing)

**How might we** design a version management experience that:

- Automatically captures every change with who, what, when, and why — without burdening planners with extra steps
- Provides instant visual diffs between any two versions so managers can review changes in seconds, not hours
- Clearly distinguishes draft from final with visual status indicators and workflow gates
- Enables delta sync to PROMIS/N-PLM so only real changes propagate downstream
- Makes the paper notebook obsolete by being more trustworthy and accessible

**UX Design Implications**: Version history must be zero-friction — captured automatically, not through explicit save-as-version actions. The diff view must be scannable at a glance (color-coded cells, change summaries). Draft/final status must be visually unambiguous in every view where plan data appears.

### Problem Severity

| Attribute      | Value                                                                                                                                                                                                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severity Score | **8.5/10**                                                                                                                                                                                                                                                                                                                    |
| Rationale      | Universal pain (9/10 interviewees). Drives massive time waste across planners and managers, creates accountability gaps, and uniquely introduces data integrity risks through PROMIS sync artifacts. The physical notebook workaround signals that users have fundamentally given up on the digital system for this function. |

### Success Metrics

| #   | Metric                                  | Target                                       | Measurement Method                     |
| --- | --------------------------------------- | -------------------------------------------- | -------------------------------------- |
| 1   | Manual version tracking time            | 0 hrs/week (from 3+ hrs/week per planner)    | System auto-tracks all changes         |
| 2   | Manager review comparison time          | < 5 min per plan (from 30-45 min)            | Auto-diff eliminates manual comparison |
| 3   | PROMIS sync time                        | < 30 min (from 4+ hrs bi-weekly)             | Delta sync performance measurement     |
| 4   | False recalculation incidents from sync | 0 per quarter (from at least 1)              | PROMIS data integrity monitoring       |
| 5   | Change attribution completeness         | 100% of changes have user, timestamp, reason | System change log audit                |

### Constraints

- **Technical**: Version storage must scale to 200+ projects with 5 years of history without performance degradation
- **Business**: Delta sync must be compatible with PROMIS and N-PLM integration APIs
- **UX**: Version capture must be automatic — planners should not need to "create a version" manually
- **Regulatory**: Samsung requires full audit trail for resource allocation decisions (internal compliance)
- **Timeline**: Must be addressable in Year 1 MVP scope (Req 2 is Samsung P0)

---

## Problem Statement 3: Cross-Site Visibility

### Metadata

| Field          | Value                     |
| -------------- | ------------------------- |
| Project        | IRIS                      |
| Product        | IRIS by Amoza             |
| Problem ID     | PS-IRIS-003               |
| Version        | v1.0                      |
| Date           | 2026-03-21                |
| Author         | CXO                       |
| Status         | Validated                 |
| Pain Score     | 7.8/10                    |
| Frequency      | Weekly                    |
| Emotional Core | **Strategic Frustration** |

### Problem Statement (POV Format)

**Minho Kim, a Division Manager overseeing resource allocation across Samsung DS sites,** needs a way to **see real-time resource allocation across all global sites in a single unified view** because **the current lack of cross-site visibility forces 40 person-hours monthly for manual data compilation, causes shared resource over-allocation (120%+ across sites) to go undetected for weeks, and delays his executive resource decisions by 5+ business days — turning strategic planning into a frustrating exercise of assembling stale data from disparate sources.**

### Problem Context

Samsung DS operates resource planning across 5 global sites — Hwaseong (HQ), Pyeongtaek, Austin (TX), Xi'an (China), and Giheung. PM Planner provides no cross-site view; each site sees only its own data. When a Division Manager asks "How many engineers are allocated to NAND development across all sites?" it takes 4 planners across sites a combined 5 business days to compile the answer manually. Shared resources — engineers allocated to projects at multiple sites — are frequently over-allocated (80% at Hwaseong + 40% at Austin = 120% total) because no system detects the overlap. The information asymmetry particularly disadvantages non-HQ sites, which are structurally "last to know" about allocation decisions made at Hwaseong.

### Evidence

| #   | Evidence Type | Source           | Summary                                                                                        |
| --- | ------------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Interview     | INT-IRIS-006     | "How many engineers allocated to NAND across all sites? Answer takes 5 business days."         |
| 2   | Interview     | INT-IRIS-006     | Monthly global resource summary: 40 person-hours to compile (4 planners x 2 days across sites) |
| 3   | Interview     | INT-IRIS-006     | Executive decisions postponed because cross-site data compilation was not ready in time        |
| 4   | Interview     | INT-IRIS-003     | Austin planner cannot see Hwaseong/Pyeongtaek plans — weekly 6 AM call (CST) as workaround     |
| 5   | Interview     | INT-IRIS-003     | Shared cross-site Excel spreadsheet is "always out of date" within hours of creation           |
| 6   | Interview     | INT-IRIS-003     | Decisions made at Hwaseong communicated in Korean — Austin is structurally "last to know"      |
| 7   | Interview     | INT-IRIS-004     | Shared engineer allocated 120% across departments — detected only in monthly reconciliation    |
| 8   | Interview     | INT-IRIS-007     | HR Planner compiles global staffing view manually in PowerPoint — stale the moment it is saved |
| 9   | Observation   | Affinity Theme 4 | 8/10 interviewees affected by cross-site visibility gaps; average severity 7.2/10              |
| 10  | Empathy Map   | Manager Persona  | "I make resource decisions based on PowerPoint slides that are 3 days stale"                   |

### Emotional Impact Analysis (CXO Perspective)

**Emotional Core: Strategic Frustration**

Minho Kim is a Division Manager responsible for allocating hundreds of engineers across global sites — and he cannot see his own data. The frustration is not about missing a feature; it is about being unable to perform the core function of his role:

- **Strategic impotence** — He knows the answer to his question exists in the system, but it takes 5 business days and 4 people to assemble it. By the time he gets it, the data is stale and the decision window may have closed.
- **Invisible conflicts** — Shared resources are over-allocated across sites and nobody knows until a monthly meeting reveals the problem weeks later. These are not edge cases — they affect critical engineering talent.
- **Site inequity** — Non-HQ sites (Austin, Xi'an) are systematically disadvantaged. They cannot see what Hwaseong is planning. Decisions are communicated in Korean. They find out about changes that affect them only after the fact.
- **Performative planning** — When the HR Planner creates a manual PowerPoint world map of staffing, she is performing the appearance of visibility without the substance. The slide is stale the moment she saves it.

IRIS must transform cross-site visibility from a painful, manual, multi-day assembly process into an ambient, always-available capability. Minho should be able to answer his own questions in seconds.

### Impact Assessment

| Dimension        | Current State                                              | Desired State                                                 | Gap                                   |
| ---------------- | ---------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------- |
| Time             | 40 person-hours monthly for cross-site compilation         | Instant — real-time dashboard query                           | 40 person-hours/month recovered       |
| Decision Speed   | 5 business days to answer a cross-site resource question   | < 1 minute via dashboard                                      | 5 days → instant                      |
| Over-Allocation  | Shared resources over-allocated 120%+ undetected for weeks | Real-time over-allocation alerts with threshold configuration | Weeks → immediate detection           |
| Site Equity      | Overseas sites structurally disadvantaged (last to know)   | All sites see same real-time data simultaneously              | Level playing field across 5 sites    |
| Decision Quality | Executives decide on 3-5 day stale PowerPoint data         | Executives decide on live, current data                       | Data freshness from days to real-time |

### Affected Personas & Feature Areas

| Attribute                 | Detail                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Primary Persona(s)        | **Minho Kim** — The Governance Leader (cross-site resource decisions)                                                 |
| Secondary Persona(s)      | **Jisoo Park** (cross-site coordination); **Eunji Lee** (global analytics); **Soyeon Choi** (HR global staffing view) |
| Estimated People Impacted | 50-80 across all sites (planners, managers, HR, executives)                                                           |
| Organizational Scope      | Enterprise-wide — all 5 Samsung DS sites globally                                                                     |
| Feature Areas             | **F3** (Roadmap), **F5** (HR Portfolio), **F6** (Reporting)                                                           |
| Samsung Requirements      | **Req 7** (Cross-Site View), **Req 8** (Dashboard/Visualization)                                                      |

### Root Cause Analysis (5 Whys)

1. **Why?** Division Manager cannot see cross-site data → Because PM Planner has no cross-site view
2. **Why?** No cross-site view exists → Because each site operates an independent PM Planner instance with no shared data layer
3. **Why?** No shared data layer → Because PM Planner was deployed as a site-local application, not an enterprise platform
4. **Why?** Site-local deployment chosen → Because Samsung DS was smaller when PM Planner was adopted; global coordination was managed through meetings and email
5. **Why?** (Root cause) PM Planner's architecture does not support a unified, multi-site data model with real-time aggregation — IRIS must be built as an enterprise platform with a single data layer from day one

### Current Workarounds & Their Cost

| Workaround                          | Description                                                                    | Cost / Limitation                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Manual cross-site compilation**   | 4 planners export data from their sites, merge in Excel, present in PowerPoint | 40 person-hours monthly; always stale by delivery; error-prone merging          |
| **Weekly cross-site calls**         | 30-min call between site planners (6 AM CST / 9 PM KST)                        | Painful timing for all parties; verbal-only data sharing; not scalable          |
| **Shared Excel on Samsung cloud**   | Spreadsheet with cross-site allocation data                                    | "Always out of date"; no real-time sync; manual update discipline fails         |
| **Monthly reconciliation meetings** | Conference room, printed Excel sheets, cross-department review                 | Reactive (monthly frequency); 3-4 hours per meeting; detects month-old problems |
| **Manual PowerPoint world maps**    | HR Planner creates staffing global view manually in PowerPoint                 | Stale on save; time-consuming to create; no drill-down or filtering capability  |

### Design Challenge (CXO Framing)

**How might we** design a unified cross-site visibility experience that:

- Provides a real-time global dashboard showing resource allocation across all 5 Samsung DS sites
- Automatically detects and alerts on over-allocation of shared resources across sites
- Enables drill-down from global overview to site-specific and project-specific detail
- Treats all sites equitably — no information advantage for HQ over remote sites
- Supports both executive-level summary views and planner-level operational detail

**UX Design Implications**: The dashboard must support multiple levels of abstraction (global → site → division → project). Over-allocation alerts must be prominent but not alarming — they are decision inputs, not error messages. The interface must work across languages and time zones without privileging any single site.

### Problem Severity

| Attribute      | Value                                                                                                                                                                                                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severity Score | **7.8/10**                                                                                                                                                                                                                                                                                                        |
| Rationale      | Affects 8/10 interviewees. Executive decision-making directly impacted by data staleness and compilation delays. 40 person-hours monthly is a major hidden cost. Over-allocation of shared resources creates downstream conflicts and rework. Most impactful for non-HQ sites who are structurally disadvantaged. |

### Success Metrics

| #   | Metric                                   | Target                            | Measurement Method                |
| --- | ---------------------------------------- | --------------------------------- | --------------------------------- |
| 1   | Cross-site resource query response time  | < 1 minute (from 5 business days) | Dashboard query performance       |
| 2   | Cross-site data compilation person-hours | 0 hrs/month (from 40)             | Eliminated by real-time dashboard |
| 3   | Over-allocation detection latency        | < 1 hour (from weeks/months)      | System alert generation time      |
| 4   | Cross-site data freshness                | < 5 minutes (from days to weeks)  | Data pipeline latency measurement |

### Constraints

- **Technical**: Must support real-time data aggregation across 5 geographically distributed sites
- **Business**: Role-based access control must respect Samsung's organizational hierarchy and data sensitivity
- **UX**: Must support Korean and English interfaces; no information asymmetry between language settings
- **Infrastructure**: Requires unified data model — cannot be bolted onto site-local PM Planner instances
- **Timeline**: Year 1 MVP must include at minimum read-only cross-site visibility

---

## Problem Statement 4: Analytical Intelligence

### Metadata

| Field          | Value                |
| -------------- | -------------------- |
| Project        | IRIS                 |
| Product        | IRIS by Amoza        |
| Problem ID     | PS-IRIS-004          |
| Version        | v1.0                 |
| Date           | 2026-03-21           |
| Author         | CXO                  |
| Status         | Validated            |
| Pain Score     | 7.4/10               |
| Frequency      | Weekly               |
| Emotional Core | **Wasted Expertise** |

### Problem Statement (POV Format)

**Eunji Lee, an Analytical Specialist at Samsung DSR,** needs a way to **perform multi-dimensional analysis and generate reports directly within the planning system** because **PM Planner has virtually no analytical capability, forcing her to spend 70% of her time on data extraction and preparation rather than insight generation — manually compiling the same 5 reports for 20 stakeholders every month like a "human cron job" — while delivering analyses to executives that are 3-5 days stale by the time they arrive.**

### Problem Context

PM Planner stores rich resource planning data — allocations by project, team, function, site, and time period — but provides no meaningful way to analyze it. Built-in reports are basic data dumps with no pivot capability, no cross-dimensional analysis, no charts, and no trend visualization. Analysts must export data to CSV, transform it in Python/Jupyter, build analyses, and format results in Excel/PowerPoint for distribution. This pipeline consumes 70% of the analyst's week. Monthly recurring reports (same 5 reports to same 20 stakeholders) are compiled manually each month. The result: decision-makers receive analyses that are inherently stale, and the analyst's domain expertise is wasted on data plumbing rather than strategic insight.

### Evidence

| #   | Evidence Type | Source           | Summary                                                                                                        |
| --- | ------------- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Interview     | INT-IRIS-008     | "PM Planner is where data goes to hide. Getting it out is like performing an extraction."                      |
| 2   | Interview     | INT-IRIS-008     | 70% of analyst time on data extraction/preparation; only 30% on actual analysis and insight                    |
| 3   | Interview     | INT-IRIS-008     | Weekly reporting cycle: 8-10 hours. Monthly comprehensive: 3-4 full days.                                      |
| 4   | Interview     | INT-IRIS-008     | "I am a human cron job. Same 5 reports, same 20 recipients, built from scratch every month."                   |
| 5   | Interview     | INT-IRIS-008     | Built personal Elasticsearch cluster on laptop — 2 years of data indexed for 100x faster queries               |
| 6   | Interview     | INT-IRIS-008     | No multi-dimensional analysis in PM Planner — builds all pivots in Python/Excel externally                     |
| 7   | Interview     | INT-IRIS-006     | Division Manager's information flow: PM Planner → Excel → PPT → meeting = 3-5 days stale                       |
| 8   | Interview     | INT-IRIS-006     | "I make decisions about hundreds of engineers based on a PowerPoint that's 3 days old"                         |
| 9   | Interview     | INT-IRIS-001     | Jisoo maintains "Oracle" Excel workbook: 45 tabs mirroring PM Planner data + custom reports — shadow analytics |
| 10  | Observation   | Affinity Theme 5 | 8/10 interviewees affected by analytical gaps; average severity 7.9/10                                         |

### Emotional Impact Analysis (CXO Perspective)

**Emotional Core: Wasted Expertise**

Eunji Lee is a skilled analytical specialist — she understands semiconductor resource planning deeply, can identify trends, and knows what questions to ask of the data. But she spends 70% of her time on data plumbing — extracting, cleaning, transforming, formatting — before she can begin the analytical work she was hired to do:

- **Professional diminishment** — When Eunji describes herself as a "human cron job," she is articulating a fundamental misuse of her expertise. The system has reduced a strategic analyst to a data extraction technician.
- **Shadow infrastructure** — She built a personal Elasticsearch cluster on her laptop to work around PM Planner's limitations. This is not a workaround; it is an act of professional desperation. Rogue infrastructure on a personal laptop is a data governance risk that exists because the official system failed her.
- **Stale insights** — By the time her analysis reaches Minho or the Division Manager, it is 3-5 days old. She knows this. They know this. Everyone pretends the data is current because there is no better option.
- **The "Oracle" workbook** — Jisoo's 45-tab Excel workbook that mirrors PM Planner data represents the same phenomenon from a different role: a planner who built a parallel analytical system because the official one offers nothing.

IRIS must liberate Eunji from data plumbing and give her the tools to do what she does best — think, analyze, and advise.

### Impact Assessment

| Dimension        | Current State                                                           | Desired State                                                     | Gap                                          |
| ---------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| Time             | 70% of analyst week on data plumbing (28+ hrs/week)                     | < 20% on data access (8 hrs/week)                                 | 20+ hours/week recovered for actual analysis |
| Report Freshness | 3-5 days stale by the time reports reach executives                     | Real-time or < 1 hour stale                                       | Days → minutes                               |
| Report Cycle     | Monthly reports: 3-4 full analyst days of manual work                   | Automated generation and distribution (minutes)                   | 3-4 days → minutes                           |
| Analytical Depth | Multi-dimensional analysis requires Python scripting and external tools | Point-and-click OLAP-style analytics within IRIS                  | From code to clicks                          |
| AI Readiness     | No analytical infrastructure for AI-based reporting                     | ES cluster + analytics layer supports AI natural language queries | Foundation for Samsung Req 11                |

### Affected Personas & Feature Areas

| Attribute                 | Detail                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Primary Persona(s)        | **Eunji Lee** — The Intelligence Architect                                                                 |
| Secondary Persona(s)      | **Minho Kim** (report consumer); Division Managers (executive consumers); all managers who receive reports |
| Estimated People Impacted | 5-10 analysts + 30-40 report consumers across Samsung DSR                                                  |
| Organizational Scope      | Enterprise-wide — analytics serve all divisions and sites                                                  |
| Feature Areas             | **F6** (Reporting), **F7** (AI Analytics)                                                                  |
| Samsung Requirements      | **Req 10** (Multi-dimensional Analysis), **Req 11** (AI-based Reporting)                                   |

### Root Cause Analysis (5 Whys)

1. **Why?** Analysts spend 70% of time on data extraction → Because PM Planner has no analytical layer
2. **Why?** No analytical layer → Because PM Planner was designed for data entry and storage, not analysis
3. **Why?** Design focused on data entry → Because original requirements did not include analytical use cases
4. **Why?** No analytical infrastructure → Because single-node ES cannot support complex queries; Oracle DB queries are too slow for interactive analysis
5. **Why?** (Root cause) PM Planner lacks both the analytical engine (proper ES cluster) and the analytical interface (OLAP-style views, dashboards, report scheduling) — IRIS must build analytics as a first-class capability, not an afterthought

### Current Workarounds & Their Cost

| Workaround                            | Description                                                                           | Cost / Limitation                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **CSV export + Python pipeline**      | Analyst exports PM Planner to CSV, transforms in Jupyter, generates analysis          | 70% of week on plumbing; output is static snapshots; not shareable          |
| **Personal Elasticsearch cluster**    | Analyst built local ES cluster with 2 years of indexed data for fast queries          | Rogue infrastructure; not maintainable; not shareable; data governance risk |
| **Monthly manual report compilation** | 5 reports compiled manually, formatted in Excel/PPT, emailed to 20 stakeholders       | 3-4 days/month; analyst is "human cron job"; inherently stale               |
| **Excel pivot tables**                | Cross-dimensional analysis built as Excel pivots from exported data                   | Slow to build; limited scale; not interactive; disconnected from live data  |
| **45-tab "Oracle" workbook**          | Personal Excel with PM Planner data mirrors + report templates maintained by planners | Fragile; single-user; not auditable; creates data governance risk           |

### Design Challenge (CXO Framing)

**How might we** design an analytical experience within IRIS that:

- Enables point-and-click multi-dimensional analysis (pivot, filter, drill-down) without requiring data export
- Automates recurring report generation and distribution to eliminate the "human cron job"
- Provides real-time or near-real-time data freshness so executives act on current information
- Supports natural language queries as a path toward AI-powered analytics (Req 11)
- Makes the personal ES cluster and "Oracle" workbook unnecessary by being faster and more capable

**UX Design Implications**: The analytics interface must serve two distinct user types — the analytical specialist (Eunji) who needs depth and flexibility, and the executive consumer (Minho, Division Manager) who needs clarity and speed. Dashboard design must prioritize scanability. Report scheduling must be self-service (not IT-dependent). AI query capabilities should feel conversational, not technical.

### Problem Severity

| Attribute      | Value                                                                                                                                                                                                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severity Score | **7.4/10**                                                                                                                                                                                                                                                                                                                 |
| Rationale      | Highest single-persona pain (analyst rates 9/10 personally). Affects both analysts directly and 30-40 report consumers indirectly. The shadow analytical infrastructure (personal ES cluster, Python pipelines, "Oracle" workbook) represents massive unmet demand. Foundation for AI-based capabilities (Samsung Req 11). |

### Success Metrics

| #   | Metric                                                | Target                                        | Measurement Method                  |
| --- | ----------------------------------------------------- | --------------------------------------------- | ----------------------------------- |
| 1   | Analyst time on data extraction                       | < 20% of work week (from 70%)                 | Time tracking / self-report survey  |
| 2   | Multi-dimensional query response time                 | < 30 seconds (from hours via Python pipeline) | System query performance monitoring |
| 3   | Monthly recurring report generation                   | Fully automated (from 3-4 manual days)        | Report scheduler completion time    |
| 4   | Report data freshness for executives                  | < 1 hour (from 3-5 days)                      | Data pipeline latency measurement   |
| 5   | Analytical queries requiring export to external tools | < 10% (from ~100%)                            | System analytics coverage tracking  |

### Constraints

- **Technical**: ES cluster must support complex aggregation queries at interactive speeds (< 30 seconds)
- **Business**: Reports must match Samsung's existing format expectations initially; gradual UX evolution
- **UX**: Analytics must be accessible to non-technical report consumers (managers, executives)
- **AI**: Natural language query layer must be accurate enough that users trust it for decision-making
- **Timeline**: Basic reporting and dashboards in Year 1 MVP; AI analytics in Year 2

---

## Problem Statement 5: Architecture Limitations

### Metadata

| Field          | Value                    |
| -------------- | ------------------------ |
| Project        | IRIS                     |
| Product        | IRIS by Amoza            |
| Problem ID     | PS-IRIS-005              |
| Version        | v1.0                     |
| Date           | 2026-03-21               |
| Author         | CXO                      |
| Status         | Validated                |
| Pain Score     | 8.0/10                   |
| Frequency      | Permanent constraint     |
| Emotional Core | **Learned Helplessness** |

### Problem Statement (POV Format)

**All Samsung DSR stakeholders — planners, managers, analysts, and administrators —** need a **modern, scalable system architecture that can grow with their needs** because **PM Planner's Mendix 7/8 platform is a confirmed dead end — its single-node Elasticsearch creates 14+ hours of analytical downtime per year, manual ETL monitoring misses weekly pipeline failures, rigid factor control requires 2-3 weeks to reconfigure after each Samsung DS reorganization, and everyone from IT to leadership knows the system cannot be upgraded — yet they must use it every day, creating a pervasive sense of learned helplessness.**

### Problem Context

PM Planner's technical infrastructure has not kept pace with Samsung DSR's growth. The Elasticsearch deployment is a single node with no failover (3 outages/year, 14+ hours of analytical downtime). The Mendix 7/8 platform cannot be upgraded to modern versions. ETL pipelines between PM Planner, N-PLM, PROMIS, and GHRP fail weekly and are discovered only through manual log review. Factor control dimensions are hardcoded, making Samsung's frequent organizational restructurings (2-3x/year) a 2-3 week administrative reconfiguration process. N-PLM master data updates take 24-48 hours to propagate. Critically, these infrastructure limitations are not standalone problems — they are the foundation that blocks solutions to all four preceding problem statements. IT has confirmed the platform cannot be upgraded. Samsung leadership has confirmed the need for a new build. Users know the system is a dead end.

### Evidence

| #   | Evidence Type | Source       | Summary                                                                                            |
| --- | ------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| 1   | Interview     | INT-IRIS-010 | Single-node ES: 3 outages/year, avg 4.7 hours each = 14+ hours analytical downtime annually        |
| 2   | Interview     | INT-IRIS-010 | "Running single-node ES in production for Samsung is like driving a Ferrari with bicycle tires"    |
| 3   | Interview     | INT-IRIS-010 | ETL pipeline fails weekly; failures discovered only via manual log review the next morning         |
| 4   | Interview     | INT-IRIS-010 | 5 years of historical PM Planner data needs migration strategy — cannot be abandoned               |
| 5   | Interview     | INT-IRIS-009 | Factor control reconfiguration takes 2-3 weeks after each Samsung DS reorganization                |
| 6   | Interview     | INT-IRIS-009 | Samsung DS reorganizes 2-3x/year — each triggers full reconfiguration cycle (4-6 weeks/year total) |
| 7   | Interview     | INT-IRIS-009 | User role management is too coarse: "see everything" or "see nothing" — no granular permissions    |
| 8   | Interview     | INT-IRIS-005 | N-PLM master data updates take 24-48 hours to propagate — plans reference non-existent teams       |
| 9   | Interview     | INT-IRIS-002 | N-PLM shows stale organizational structure — plans reference teams that have been reorganized      |
| 10  | Interview     | INT-IRIS-008 | Personal ES cluster on analyst's laptop proves demand for proper analytical infrastructure         |

### Emotional Impact Analysis (CXO Perspective)

**Emotional Core: Learned Helplessness**

This problem statement is unique because the emotional damage is not about a single frustrating interaction — it is about a pervasive, system-wide resignation. Every user knows PM Planner is a dead end:

- **IT knows** — The system admin describes single-node ES in production for Samsung as "bicycle tires on a Ferrari." He knows the infrastructure is inadequate. He has no path to fix it within the current platform.
- **Leadership knows** — Samsung IT and leadership have confirmed PM Planner cannot be upgraded. The Mendix 7/8 platform is approaching unsupported status. The decision to build IRIS is itself evidence of this problem statement.
- **Users know** — Every workaround described in PS-001 through PS-004 (editing calendars, paper notebooks, personal ES clusters, manual PowerPoint maps) exists because users have given up expecting the system to improve. They have learned that the system will not help them and have adapted accordingly.
- **The cost of resignation** — When users stop reporting bugs, stop requesting features, and stop believing the system can improve, the organization loses the feedback loop that drives product improvement. PM Planner has reached this state.

IRIS must not only deliver better technology — it must rebuild users' belief that their planning tools can serve them. The first impression of IRIS must signal: "This is different. This system was built for you."

### Impact Assessment

| Dimension         | Current State                                                         | Desired State                                                         | Gap                                           |
| ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------- |
| ES Reliability    | 14+ hours/year analytical downtime (single-node, no failover)         | 99.9% uptime with 3-master HA cluster                                 | From single point of failure to enterprise HA |
| ETL Monitoring    | Weekly failures discovered manually via next-morning log review       | Automated monitoring with real-time alerts and auto-retry             | From reactive to proactive                    |
| Reorg Response    | 2-3 weeks to reconfigure factor control per restructuring (2-3x/year) | < 1 day — flexible dimension management via admin configuration panel | 2-3 weeks → hours                             |
| Master Data Lag   | 24-48 hours for N-PLM updates to propagate; stale org references      | < 1 hour (near-real-time sync)                                        | 24-48 hours → < 1 hour                        |
| Platform Currency | Mendix 7/8 approaching end of support; custom widgets need rewriting  | Mendix 10 with modern widget framework and long-term support          | Technical debt eliminated                     |
| Data Migration    | 5 years of historical data at risk if migration is not planned        | Full history preserved and accessible in IRIS                         | Zero historical data loss                     |

### Affected Personas & Feature Areas

| Attribute                 | Detail                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Primary Persona(s)        | **System Administrators** (IT operations, infrastructure); **Site Administrators** (factor control, user management)  |
| Secondary Persona(s)      | **All personas** — infrastructure underpins every IRIS capability; every user is affected indirectly                  |
| Estimated People Impacted | 150+ PM Planner users across all Samsung DS sites                                                                     |
| Organizational Scope      | Enterprise-wide — foundation layer for all capabilities                                                               |
| Feature Areas             | **F1-F7** (all features depend on architecture); infrastructure layer                                                 |
| Samsung Requirements      | **Req 0** (Mendix 10 Migration), **Req 5** (Factor Control), **Req 6** (ETL/Integration), **Req 12** (Data Migration) |

### Root Cause Analysis (5 Whys)

1. **Why?** ES has outages and ETL fails weekly → Because infrastructure was not designed for production-grade enterprise reliability
2. **Why?** Single-node ES and manual ETL → Because PM Planner was deployed as a departmental tool, not enterprise infrastructure
3. **Why?** Factor control takes weeks to reconfigure → Because dimensions are hardcoded in application logic, not stored as configurable metadata
4. **Why?** N-PLM lag is 24-48 hours → Because sync is batch-based (scheduled jobs), not event-driven (real-time)
5. **Why?** (Root cause) PM Planner was built as a small-scale departmental application that has been stretched far beyond its architectural limits — IRIS must be architected as an enterprise-grade platform from inception, with proper HA, monitoring, flexible configuration, and real-time integration

### Current Workarounds & Their Cost

| Workaround                                | Description                                                                     | Cost / Limitation                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Manual log review for ETL failures**    | Admin checks logs every morning to detect pipeline failures                     | Failures go undetected overnight; reactive discovery adds hours to resolution                        |
| **Manual factor control reconfiguration** | Admin manually updates hardcoded dimension values after each Samsung reorg      | 2-3 weeks per reconfiguration; 2-3x/year = 4-6 weeks/year of admin time                              |
| **Coarse access control**                 | Users get "see everything" or "see nothing" permissions                         | Over-permissioned users create data sensitivity risks; under-permissioned users cannot do their jobs |
| **Personal ES cluster**                   | Analyst built personal ES on laptop to compensate for production ES limitations | Rogue infrastructure; data governance violation; proves demand for proper analytics backend          |
| **Manual data reconciliation**            | Planners manually verify N-PLM data freshness before using it in plans          | Time waste; error-prone; stale org references still appear in plans                                  |

### Design Challenge (CXO Framing)

**How might we** architect IRIS to:

- Deliver enterprise-grade reliability (99.9% uptime, automated monitoring, real-time alerting)
- Make organizational restructuring a configuration change, not a multi-week reconfiguration project
- Provide granular, role-based access control that respects Samsung's organizational hierarchy
- Support near-real-time integration with N-PLM, PROMIS, SMDM, and GHRP
- Migrate 5 years of historical PM Planner data without loss
- Signal to users from the first interaction: "This system was built for enterprise scale"

**UX Design Implications**: While architecture is primarily a technical concern, the UX impact is profound. System reliability builds trust. Fast data propagation means users see current information. Flexible factor control means the system adapts to organizational reality instead of lagging behind it. The admin experience (factor control, user management, monitoring) must be designed with the same care as the planner experience — admins are users too.

### Problem Severity

| Attribute      | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severity Score | **8.0/10**                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Rationale      | Lower direct user-facing pain than concurrency or versioning, but highest systemic importance — every other problem statement depends on infrastructure. ES cluster enables analytics (PS-004). Real-time sync enables visibility (PS-003). Flexible dimensions enable governance (PS-002). Mendix 10 platform enables concurrency features (PS-001). The confirmed dead-end status of PM Planner elevates this from a technical concern to an organizational imperative. |

### Success Metrics

| #   | Metric                                 | Target                                    | Measurement Method                  |
| --- | -------------------------------------- | ----------------------------------------- | ----------------------------------- |
| 1   | ES cluster uptime                      | 99.9% (from ~99.8% with 14+ hrs downtime) | Infrastructure monitoring dashboard |
| 2   | ETL failure detection time             | < 5 minutes (from next morning)           | Automated alerting SLA measurement  |
| 3   | Factor control reconfiguration time    | < 1 business day (from 2-3 weeks)         | Admin task completion tracking      |
| 4   | N-PLM data propagation latency         | < 1 hour (from 24-48 hours)               | Sync pipeline latency monitoring    |
| 5   | Historical data migration completeness | 100% of 5-year history preserved          | Data validation post-migration      |

### Constraints

- **Technical**: Mendix 10 platform selection is fixed (Samsung requirement); ES 8.x cluster architecture must support HA
- **Business**: 5-year historical data migration is non-negotiable — Samsung requires continuity
- **Security**: Must comply with Samsung's data residency and access control requirements across jurisdictions
- **Integration**: Must maintain compatibility with N-PLM, PROMIS, SMDM, GHRP integration APIs
- **Timeline**: Architecture and migration planning must begin in DESIGN phase; execution spans DEVELOP and DELIVER

---

## Cross-Problem Summary

### Priority Matrix

| #   | Problem Statement            | Severity | Frequency | Emotional Core        | Primary Personas      | Primary Reqs    | Priority                |
| --- | ---------------------------- | -------- | --------- | --------------------- | --------------------- | --------------- | ----------------------- |
| 1   | Concurrency & Collaboration  | 9.1/10   | Daily     | Overwrite Anxiety     | Jisoo Park            | Req 3           | **P0 — Foundation**     |
| 2   | Versioning & Change Tracking | 8.5/10   | Daily     | Decision Paralysis    | Jisoo Park, Minho Kim | Req 1, 2, 4     | **P0 — Foundation**     |
| 3   | Cross-Site Visibility        | 7.8/10   | Weekly    | Strategic Frustration | Minho Kim             | Req 7, 8        | **P0 — Strategic**      |
| 4   | Analytical Intelligence      | 7.4/10   | Weekly    | Wasted Expertise      | Eunji Lee             | Req 10, 11      | **P1 — Differentiator** |
| 5   | Architecture Limitations     | 8.0/10   | Permanent | Learned Helplessness  | All personas          | Req 0, 5, 6, 12 | **P0 — Infrastructure** |

### Feature Area Coverage

| Feature Area                 | PS-001 | PS-002 | PS-003 | PS-004 | PS-005 |
| ---------------------------- | ------ | ------ | ------ | ------ | ------ |
| F1 — Standard P/M Management | X      | X      |        |        | X      |
| F2 — Project Management      | X      | X      |        |        | X      |
| F3 — Roadmap                 |        |        | X      |        | X      |
| F4 — Simulation              |        |        |        |        | X      |
| F5 — HR Portfolio            |        |        | X      |        | X      |
| F6 — Reporting               |        | X      | X      | X      | X      |
| F7 — AI Analytics            |        |        |        | X      | X      |

### Samsung Requirements Coverage

| Requirement                         | PS-001 | PS-002 | PS-003 | PS-004 | PS-005 |
| ----------------------------------- | ------ | ------ | ------ | ------ | ------ |
| Req 0 — Mendix 10 Migration         |        |        |        |        | X      |
| Req 1 — Data Management             | X      | X      |        |        |        |
| Req 2 — Version Control             |        | X      |        |        |        |
| Req 3 — Concurrent Editing          | X      |        |        |        |        |
| Req 4 — Approval Workflow           |        | X      |        |        |        |
| Req 5 — Factor Control              |        |        |        |        | X      |
| Req 6 — ETL/Integration             |        |        |        |        | X      |
| Req 7 — Cross-Site View             |        |        | X      |        |        |
| Req 8 — Dashboard/Visualization     |        |        | X      |        |        |
| Req 10 — Multi-dimensional Analysis |        |        |        | X      |        |
| Req 11 — AI-based Reporting         |        |        |        | X      |        |
| Req 12 — Data Migration             |        |        |        |        | X      |

### Dependency Map

```
PS-005 (Architecture) ─── foundation for ──> PS-001 (Concurrency)
                     ├── foundation for ──> PS-002 (Versioning)
                     ├── foundation for ──> PS-003 (Visibility)
                     └── foundation for ──> PS-004 (Analytics)

PS-001 (Concurrency) ─── requires ──> PS-002 (Versioning) for change tracking
PS-003 (Visibility)  ─── requires ──> PS-004 (Analytics) for dashboards
PS-002 (Versioning)  ─── enables  ──> PS-003 (Visibility) via delta sync
```

### CXO Emotional Landscape Summary

| Problem | Emotional Core        | User Experience Today             | IRIS Must Deliver                        |
| ------- | --------------------- | --------------------------------- | ---------------------------------------- |
| PS-001  | Overwrite Anxiety     | "Will my changes survive?"        | Confidence that work is safe             |
| PS-002  | Decision Paralysis    | "Is this the right version?"      | Trust that data is current and traceable |
| PS-003  | Strategic Frustration | "I can't see my own organization" | Ambient visibility across all sites      |
| PS-004  | Wasted Expertise      | "I'm a human cron job"            | Tools worthy of analytical talent        |
| PS-005  | Learned Helplessness  | "The system will never improve"   | Proof that things can be different       |

### Combined Opportunity

For Samsung DSR:

- **Total addressable pain**: 100+ person-hours/week in workaround overhead across all sites
- **Estimated annual cost**: $2-5M in lost planner productivity, plus unquantified executive decision delays
- **Risk reduction**: Elimination of data integrity issues (PROMIS sync artifacts), accountability gaps (no audit trail), and over-allocation blindness (shared resources across sites)
- **Strategic value**: Transform resource planning from a reactive data entry exercise into a proactive, intelligence-driven decision platform
- **Emotional transformation**: From learned helplessness and system distrust to confidence, clarity, and strategic empowerment

---

## Related Documents

| Document                 | Path                                                             | Relationship                               |
| ------------------------ | ---------------------------------------------------------------- | ------------------------------------------ |
| D3a Affinity Map         | `01_DISCOVER/d3a-affinity-map.md`                                | Evidence themes feeding problem statements |
| D3b Empathy Maps         | `01_DISCOVER/d3b-empathy-maps.md`                                | Persona emotional grounding                |
| D4 Personas              | `01_DISCOVER/d4-personas.md`                                     | Affected user profiles                     |
| D5b Validation Scorecard | `01_DISCOVER/d5b-validation-scorecard.md`                        | Scoring of these problem statements        |
| T08 Template             | `.ax/templates/T08_PROBLEM_STATEMENT.md`                         | AX template reference                      |
| Reference Draft          | `.command/000_init_project/output/D5_PROBLEM_STATEMENTS_IRIS.md` | Initial reference document                 |

---

_AX Transformation Framework v2.0.0 — Amoza Production Team_
_"AI for Real Life. Real Impact."_
