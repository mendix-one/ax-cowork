# Research Plan — IRIS New Build for Samsung DSR

> **AX Transformation Framework v2.0.0** | DISCOVER Phase | Deliverable D1

---

## Project Metadata

| Field        | Value                                                       |
| ------------ | ----------------------------------------------------------- |
| Project Name | IRIS — Intelligent Resources Information System (New Build) |
| Product      | IRIS by Amoza for Samsung Electronics DSR                   |
| AX Phase     | DISCOVER                                                    |
| Cycle Number | Cycle 1                                                     |
| Date Created | 2026-03-21                                                  |
| Owner        | CXO — Amoza SWAT Team                                       |
| Status       | Draft                                                       |

---

## Context & Adaptation

IRIS is a **new build** resource planning platform for Samsung Electronics Device Solutions Research (DSR). This is not an upgrade of the existing PM Planner — it is a ground-up replacement built on Mendix 10, Oracle 19c, and Elasticsearch 8.x. This distinction shapes how we approach DISCOVER research.

| Standard AX Assumption                      | IRIS Reality                                                                                                          | Adaptation                                                                                                            |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Unknown customer, broad market              | Single customer: Samsung DSR across 5 global sites                                                                    | Deep stakeholder mapping within Samsung organizational hierarchy; no market sizing needed                             |
| Problem hypothesis to discover from scratch | 13 requirement groups (Req 0-12) already provided by Samsung; 7 feature areas defined                                 | Validate stated requirements against real pain; uncover hidden needs and unstated assumptions behind the requirements |
| Competitive landscape unknown               | Existing PM Planner is the incumbent; enterprise alternatives exist (SAP, Anaplan, Planview)                          | Alternative approach analysis — why new build on Mendix 10 vs upgrade vs COTS                                         |
| Personas to discover from scratch           | 7 known roles: Resource Planner, Planning Manager, Division Manager, HR Planner, Analyst, Site Admin, IT System Admin | Validate and enrich role definitions with behavioral data, emotional journey, and actual workflow observations        |
| Early adopter identification needed         | Samsung DSR is the committed customer                                                                                 | Focus on site-level rollout sequencing (Hwaseong first?) and champion identification per division                     |
| Greenfield — no legacy constraints          | PM Planner exists with active users, data, and integrations (N-PLM, PROMIS, SMDM, GHRP)                               | Research must capture migration concerns, data continuity expectations, and transition anxiety                        |

**Existing Input Assets**:

- Samsung requirements document (Req 0-12) — 13 expectation areas
- Feature area definitions (F1-F7) — master data, project management, roadmap/simulation, HR portfolio, gap reporting, regular reporting, AI planning
- Solution architecture specifications — Mendix 10, Oracle 19c, Elasticsearch 8.x
- Data modeling documents — snowflake schema, ES analytical indices
- Business modeling — capability map, 10 actors, 6 use cases
- Process modeling — 13 processes with BPMN-style flows

These assets serve as a **head start**. The DISCOVER phase validates and enriches them through direct stakeholder engagement. We must not treat stated requirements as validated needs.

---

## Business Hypothesis

> **We believe that** Samsung DSR resource planners, planning managers, and HR planners **are constrained by** the current PM Planner's limitations in concurrent editing, version management, cross-site visibility, and manual reporting workflows — **and would adopt** a new-build IRIS platform with real-time concurrent editing with auto-merge, per-project version history with diff views, separated roadmap and simulation management, and AI-powered reporting — **if it** reduces planning cycle time by 40% or more, eliminates manual version reconciliation, provides instant multi-dimensional analysis across Hwaseong, Pyeongtaek, Austin, Xi'an, and Giheung, and delivers a seamless transition from the existing PM Planner without data loss or workflow disruption.

### Key Assumptions to Validate

| #   | Assumption                                                                                                         | Risk if Wrong                                                                          | Validation Method                                            |
| --- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| A1  | Concurrent editing conflicts cause measurable data loss and rework in the current PM Planner                       | Building concurrency features that solve a minor annoyance rather than a critical pain | User interviews (RO-1), contextual inquiry                   |
| A2  | Per-project version history (vs full-roadmap versioning) matches how planners actually think about change tracking | Version model that conflicts with mental models; low adoption                          | User interviews (RO-2), contextual inquiry                   |
| A3  | Samsung DSR users are willing to trust AI-generated Excel PIVOT reports for decision-making                        | Building AI reporting that users bypass in favor of manual Excel                       | User interviews (RO-5)                                       |
| A4  | Sending only changed projects to PROMIS/N-PLM (delta sync) is technically feasible and organizationally acceptable | Integration architecture built on invalid assumptions                                  | Technical assessment interviews (RO-7)                       |
| A5  | A new-build platform is preferable to upgrading the existing PM Planner                                            | Organizational resistance to change; migration anxiety undermines adoption             | User interviews (RO-4), requirements workshop                |
| A6  | The 7 feature areas (F1-F7) cover the actual scope of user needs — nothing critical is missing                     | Blind spots in the solution that emerge post-launch                                    | Open-ended interview exploration, "What's missing?" protocol |

---

## Research Objectives

| #    | Objective                                                                                                                                                                                                                                                                                                                | Success Criteria                                                                                                                                                                                                                                                           | Priority (H/M/L) |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| RO-1 | **Validate concurrent editing pain severity** — Confirm that resource planners experience data loss, overwrite conflicts, or significant coordination overhead with the current PM Planner save mechanism. Quantify the frequency and impact.                                                                            | 5+ of 10 interviewees describe concurrent editing problems unprompted; quantified frequency of conflicts (X per week) and time lost per incident; at least 3 specific data-loss stories documented                                                                         | H                |
| RO-2 | **Map end-to-end resource planning workflows across sites** — Document how planners currently perform P/M planning, roadmap management, simulation, and approval workflows at Samsung DS sites. Identify all decision points, handoffs, tool-switching moments, and workarounds.                                         | Complete workflow maps for 3+ sites (Hwaseong, Pyeongtaek, and at least one overseas site) validated by planners; all handoff points and tool-switching moments identified; workaround catalog with frequency data                                                         | H                |
| RO-3 | **Quantify version management and reconciliation burden** — Measure time and effort spent on manual version tracking, diff comparison between roadmap versions, and PROMIS/N-PLM synchronization. Understand the current full-sync pain and the desire for delta-sync.                                                   | Quantified data from 5+ planners: hours/week on version work; error rate and rework frequency after sync operations; documented examples of full-sync waste (all projects sent when only few changed)                                                                      | H                |
| RO-4 | **Prioritize Samsung's 13 requirement groups by user pain and business impact** — Determine which of Req 0-12 have the highest pain severity and business value from the perspective of actual users (not just the project sponsor). Validate that the new-build approach is preferred over upgrade.                     | Rank-ordered priority list validated by 8+ stakeholders across 3+ roles; MoSCoW categorization with pain severity scores (1-10) per requirement; clear evidence for new-build vs upgrade preference                                                                        | H                |
| RO-5 | **Assess adoption readiness for AI-based reporting and planning** — Gauge Samsung DSR analysts' and managers' willingness to use Samsung AI Services for automated Excel PIVOT generation, natural-language reporting, and AI-assisted resource planning (F7).                                                           | AI trust level measured on 1-10 scale across 6+ participants; specific trust barriers identified (data accuracy, explainability, control, job security); conditions for adoption documented; comparison of AI trust for reporting vs AI trust for planning recommendations | M                |
| RO-6 | **Map cross-site coordination patterns and stakeholder ecosystem** — Identify how resource planning decisions flow across Samsung DSR sites, divisions (Memory, System LSI, Foundry), and management levels. Understand who approves what, where bottlenecks exist, and how cross-site visibility gaps affect decisions. | Complete stakeholder map covering 4+ Samsung DS sites; decision-making hierarchy documented with approval chains; cross-site coordination pain points cataloged with frequency; champions and potential blockers identified per site/division                              | M                |
| RO-7 | **Assess technical integration landscape and migration constraints** — Understand real-world data accessibility, API stability, and operational limitations for N-PLM, PROMIS, SMDM, GHRP, and Samsung AI Services integrations. Document migration concerns from PM Planner to IRIS.                                    | Integration constraint matrix from 3+ technical stakeholders; API documentation status, latency requirements, and error handling expectations documented; data migration risk register with volume estimates; current PM Planner data retention requirements clarified     | M                |

---

## Target Participants

| Attribute          | Target                                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Roles              | Resource Planner, Planning Manager, Division Manager, HR Planner, Analyst, Site Admin, IT System Admin                              |
| Organization       | Samsung Electronics — Device Solutions Research (DSR)                                                                               |
| Divisions          | Memory (DRAM, NAND), System LSI, Foundry                                                                                            |
| Experience Level   | 2+ years using current PM Planner or predecessor resource planning tools                                                            |
| Sites              | Hwaseong (HQ), Pyeongtaek, Austin (TX), Xi'an (China), Giheung                                                                      |
| Target Count       | 12-15 recruited to yield 10-12 completed interviews + 2-3 technical interviews                                                      |
| Exclusion Criteria | Samsung employees with < 6 months in current role; contractors without direct PM Planner usage; personnel who have already left DSR |

### Participant Profiles

| #   | Profile              | Role Description                                                                                                                                                       | Key Research Value                                                                                                                                                                                  | Site Priority                       | Target Count | Priority |
| --- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------ | -------- |
| P1  | **Resource Planner** | Daily P/M data entry and editing; creates and manages resource roadmaps; runs simulations; most frequent user of current PM Planner                                    | Primary source for concurrent editing pain (RO-1), workflow mapping (RO-2), version management burden (RO-3); highest-volume user whose daily experience reveals the deepest usability issues       | Hwaseong, Pyeongtaek, Austin, Xi'an | 3-4          | Critical |
| P2  | **Planning Manager** | Reviews and approves resource plans; oversees cross-department alignment; manages version approval workflows; uses diff views to compare plan versions                 | Approval workflow pain points (RO-2); version reconciliation from a review perspective (RO-3); requirements prioritization from management viewpoint (RO-4)                                         | Hwaseong, Pyeongtaek                | 2            | Critical |
| P3  | **Division Manager** | Executive-level view of resource allocation across sites; makes strategic staffing decisions; needs cross-site visibility and summary reporting                        | Cross-site visibility gaps (RO-6); reporting needs (RO-5); strategic prioritization of requirements (RO-4); mental model for how resource data should be presented at executive level               | Hwaseong (HQ)                       | 1            | High     |
| P4  | **HR Planner**       | Manages headcount portfolio; creates staffing plans; analyzes resource gaps between planned and actual allocation; interfaces between HR systems and resource planning | HR Portfolio workflow (F4); actual vs plan gap analysis needs (F5); integration with GHRP and organizational data (RO-7); unique perspective on people-side of resource planning                    | Hwaseong, Pyeongtaek                | 1-2          | High     |
| P5  | **Analyst**          | Generates reports from resource data; uses world map view and multi-dimensional analysis; creates Excel PIVOT reports; primary consumer of analysis outputs            | Reporting workflow pain (F6); AI reporting readiness (RO-5); world map and analysis view usability; understanding of what "good" reporting looks like from the consumer side                        | Any site                            | 1-2          | High     |
| P6  | **Site Admin**       | Configures system settings per site; manages user roles and permissions; controls factors and filters; handles site-level customization of PM Planner                  | Factor control workflows (Req 6); site-level configuration needs; user management pain points; understanding of site-specific variations in how PM Planner is used                                  | Hwaseong, Austin or Xi'an           | 1            | Medium   |
| P7  | **IT System Admin**  | Manages server infrastructure; handles N-PLM, PROMIS, SMDM integrations; operates Elasticsearch cluster; responsible for deployment and data migration                 | Integration constraints and API reality (RO-7); server architecture requirements (Req 12); migration risk assessment; performance and scalability constraints; Elasticsearch operational experience | Samsung IT                          | 1-2          | Medium   |

---

## Research Methods

### Method 1: Semi-Structured User Interviews (Primary)

| Attribute            | Detail                                                                      |
| -------------------- | --------------------------------------------------------------------------- |
| Objectives Addressed | RO-1, RO-2, RO-3, RO-4, RO-5, RO-6                                          |
| Timeline             | Week 1, Day 3 through Week 2, Day 10                                        |
| Owner                | CXO (lead interviewer), with note-taker support                             |
| Format               | 45-60 minute sessions via video call (Teams/Zoom) or on-site at Samsung DSR |
| Participant Count    | 10-12 sessions                                                              |
| Recording            | With participant consent; audio/video for synthesis accuracy                |
| Protocol             | Five-Act Interview structure per AX D1 Research Planning Guide              |

**Interview Structure (Five Acts)**:

| Act                                 | Duration | Purpose                                        | Key Questions                                                                                                                                                         |
| ----------------------------------- | -------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Act 1: Warm-Up**                  | 5 min    | Build rapport; understand role context         | "Walk me through your role at Samsung DSR. What does a typical day look like for you in terms of resource planning?"                                                  |
| **Act 2: Context & Workflow**       | 15 min   | Map current workflow, tools, handoffs          | "Take me through the last time you created or updated a resource roadmap from start to finish. What steps did you follow? Which tools did you use at each step?"      |
| **Act 3: Deep Dive — Pain Points**  | 15 min   | Uncover pain severity, frequency, workarounds  | "Tell me about the last time you experienced a conflict when saving data in PM Planner. What happened? How did you resolve it? How often does this happen?"           |
| **Act 4: Requirements Exploration** | 10 min   | Validate and prioritize stated requirements    | Show Samsung's requirement list; ask: "Which of these would make the biggest difference to your daily work? Which ones surprise you? What is missing from this list?" |
| **Act 5: Future Vision & Close**    | 10 min   | Understand aspirations, AI readiness, concerns | "If you could redesign the resource planning system from scratch, what would it look like? How would you feel about AI generating your Excel reports automatically?"  |

### Method 2: Contextual Inquiry (Observation)

| Attribute            | Detail                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Objectives Addressed | RO-2, RO-3                                                                                                                                      |
| Timeline             | Week 2, Day 6-8                                                                                                                                 |
| Owner                | CXO                                                                                                                                             |
| Format               | 30-45 minute screen-share sessions observing planners using current PM Planner in their real work environment                                   |
| Participant Count    | 2-3 sessions (subset of interview participants)                                                                                                 |
| Focus Areas          | Concurrent editing scenarios; version comparison workflows; tool-switching between PM Planner, Excel, N-PLM; workarounds and "shadow processes" |

**Observation Protocol**:

1. Ask participant to perform a real task (not a demonstration) — e.g., "Can you update the P/M data for a project you are currently working on?"
2. Use "apprentice model" — observe silently, ask clarifying questions only when behavior is unclear
3. Capture: screen recordings (with consent), task completion times, error moments, tool switches, emotional reactions (sighs, frustration, confusion)
4. Tag observations: `[WORKAROUND]`, `[FRICTION]`, `[DELIGHT]`, `[TOOL-SWITCH]`, `[ERROR]`

### Method 3: Requirements Validation Workshop

| Attribute            | Detail                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Objectives Addressed | RO-4, RO-6                                                                                    |
| Timeline             | Week 2, Day 9-10                                                                              |
| Owner                | CXO (facilitator)                                                                             |
| Format               | 90-minute group session with 5-8 Samsung stakeholders (mixed roles) via video call or on-site |
| Participant Count    | 5-8 (drawn from interview participants + Samsung project sponsor)                             |

**Workshop Protocol**:

1. **Present findings so far** (10 min) — Share emerging themes from interviews (without attribution) to ground the discussion
2. **Individual prioritization** (15 min) — Each participant silently ranks Req 0-12 by personal pain severity (1-10 scale)
3. **Dot voting** (15 min) — Each participant gets 5 dots to place on their top requirements; results tallied visually
4. **MoSCoW classification** (30 min) — Group discussion to classify each requirement as Must/Should/Could/Won't for IRIS Phase 1
5. **Gap identification** (15 min) — "What is missing? What did we not ask about?" — capture unspoken needs
6. **Wrap-up and next steps** (5 min)

### Method 4: Technical Assessment Interviews

| Attribute            | Detail                                    |
| -------------------- | ----------------------------------------- |
| Objectives Addressed | RO-7                                      |
| Timeline             | Week 2, Day 8-10                          |
| Owner                | CXO + CDO (if available)                  |
| Format               | 45-60 minute technical deep-dive sessions |
| Participant Count    | 2-3 Samsung IT / infrastructure personnel |

**Focus Areas**:

- N-PLM integration: API maturity, data contract stability, sync frequency, error handling
- PROMIS integration: current full-sync pain, feasibility of delta-sync (changed projects only)
- SMDM / GHRP integration: organizational data quality, sync latency
- Samsung AI Services: API availability, model capabilities, data residency constraints
- Current PM Planner infrastructure: server specs, data volumes, peak load patterns
- Migration constraints: data volume, downtime tolerance, rollback requirements

### Method 5: Document Analysis (Desk Research)

| Attribute            | Detail                                          |
| -------------------- | ----------------------------------------------- |
| Objectives Addressed | RO-1, RO-2, RO-7 (baseline)                     |
| Timeline             | Week 1, Day 1-2                                 |
| Owner                | CAO + AI Production Team                        |
| Format               | Systematic analysis of existing input documents |

**Documents to Analyze**:

- Samsung requirements document (Req 0-12) — extract implicit assumptions
- Feature area definitions (F1-F7) — map to user roles and workflows
- Solution architecture — identify technical constraints and integration points
- Data modeling documents — understand data relationships and volume
- Business and process models — validate actor model and use case coverage

---

## Recruitment Plan

| Attribute          | Detail                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Target Count       | 12-15 qualified participants (to yield 10-12 completed interviews + 2-3 technical)                                |
| Primary Channel    | Direct coordination with Samsung DSR project sponsor                                                              |
| Secondary Channel  | Samsung internal referrals — snowball from initial contacts to reach overseas sites (Austin, Xi'an)               |
| Screener           | Lightweight role-verification screener (see `01_DISCOVER/d2-screener-survey.md` when created)                     |
| Incentive          | N/A — enterprise engagement; participation is part of the IRIS project scope                                      |
| Consent            | Samsung DSR project NDA covers research activities; verbal consent for session recording at start of each session |
| Recruitment Owner  | Samsung DSR project coordinator (client-side), with CXO oversight                                                 |
| Recruitment Window | Week 1, Day 1-3 — all sessions scheduled within first 3 working days                                              |

**Recruitment Strategy**:

Since IRIS is a committed enterprise engagement (not open-market research), recruitment follows a different pattern:

1. **Day 1**: CXO sends participant profile requirements to Samsung DSR project sponsor with scheduling request
2. **Day 1-2**: Samsung coordinator identifies candidates from each role profile across priority sites
3. **Day 2-3**: Confirm participant roster; schedule all sessions across Week 1-2 accounting for time zones:
   - Korea Standard Time (KST) — Hwaseong, Pyeongtaek, Giheung: schedule morning sessions (9-12 KST)
   - Central Standard Time (CST) — Austin: schedule afternoon sessions (2-5 CST = next day 5-8 KST)
   - China Standard Time (CST+1) — Xi'an: schedule afternoon sessions (2-5 CST China = 3-6 KST)
4. **Fallback**: If specific roles are unavailable for live sessions, offer asynchronous written questionnaire as backup (lower quality but better than no data)

**Cross-Timezone Scheduling Matrix**:

| Site          | Timezone    | Preferred Session Window (Local) | Equivalent KST         |
| ------------- | ----------- | -------------------------------- | ---------------------- |
| Hwaseong (HQ) | KST (UTC+9) | 09:00-12:00                      | 09:00-12:00            |
| Pyeongtaek    | KST (UTC+9) | 09:00-12:00                      | 09:00-12:00            |
| Giheung       | KST (UTC+9) | 09:00-12:00                      | 09:00-12:00            |
| Xi'an         | CST (UTC+8) | 10:00-13:00                      | 11:00-14:00            |
| Austin        | CST (UTC-6) | 08:00-11:00                      | 23:00-02:00 (prev day) |

**Note on Austin**: Due to the 15-hour time difference with Korea, Austin sessions require either early-morning Austin slots or late-evening Korea slots. Coordinate with Samsung sponsor for feasible windows.

---

## Schedule

| Week       | Days      | Activities                                                                                                                                                                                                                                                                     | Owner                                        | Deliverables                                                                                                         |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Week 1** | Day 1-2   | Finalize and approve research plan; desk research — analyze all existing input documents (requirements, architecture, data model, business model, process model); draft screener survey; draft interview guide; coordinate with Samsung DSR sponsor for participant scheduling | CXO (plan, coordination), CAO (doc analysis) | Approved D1 Research Plan; draft D2 Screener Survey; draft D3 Interview Guide; document analysis findings            |
| **Week 1** | Day 3-5   | Conduct interviews 1-4: focus on Resource Planners from Hwaseong and Pyeongtaek (highest-volume users first); pilot interview guide on first session and iterate based on learnings; begin concurrent synthesis — code interview notes same day                                | CXO (interviews), note-taker (capture)       | Interview Notes INT-IRIS-001 to INT-IRIS-004; pilot debrief notes; interview guide revisions                         |
| **Week 2** | Day 6-8   | Conduct interviews 5-8: Planning Managers, HR Planner, Analyst; contextual inquiry sessions (2-3 screen-shares observing real PM Planner usage); technical assessment interviews with Samsung IT (1-2 sessions)                                                                | CXO (interviews, contextual inquiry)         | Interview Notes INT-IRIS-005 to INT-IRIS-008; contextual inquiry observation logs; technical assessment notes        |
| **Week 2** | Day 9-10  | Conduct interviews 9-12: Division Manager, Site Admin, overseas site participants (Austin, Xi'an); requirements validation workshop (90-min group session with 5-8 stakeholders)                                                                                               | CXO (interviews, workshop facilitation)      | Interview Notes INT-IRIS-009 to INT-IRIS-012; workshop output (prioritized Req 0-12 with MoSCoW and severity scores) |
| **Week 3** | Day 11-12 | Synthesis sprint: affinity mapping (cluster all coded observations into 8-12 theme groups); empathy map creation for 4 persona archetypes; cross-participant pattern identification                                                                                            | CXO (synthesis lead), full team              | Affinity Map (D3a); Empathy Maps for 4 personas (D3b); pattern frequency report                                      |
| **Week 3** | Day 13-14 | Persona card development grounded in interview evidence; problem statement drafting (POV format); validation scorecard scoring for each problem statement                                                                                                                      | CXO + CPO                                    | 4 Persona Cards (D4); 3-4 Problem Statements (D5a); Validation Scorecard (D5b)                                       |
| **Week 3** | Day 14-15 | Research report compilation; findings presentation preparation; Gate 1 evidence package assembly                                                                                                                                                                               | CXO                                          | Research Report; Gate 1 evidence package; stakeholder presentation deck                                              |

---

## Team Roles

| Role                 | Person                           | Responsibilities                                                                                                                    |
| -------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Research Lead        | CXO                              | Overall research design, interview facilitation, synthesis leadership, empathy map and persona ownership, research report authoring |
| Strategic Oversight  | CEO                              | Samsung relationship management, Gate 1 decision authority, business hypothesis validation                                          |
| Product Integration  | CPO                              | Translate research findings into backlog priorities, hypothesis card creation, requirements traceability                            |
| AI Analysis Support  | CAO                              | Document analysis, interview note coding assistance, pattern identification, AI readiness assessment analysis                       |
| Technical Validation | CDO                              | Technical feasibility review of integration findings (RO-7), architecture constraint validation                                     |
| Samsung Coordinator  | TBD (Samsung DSR-side)           | Participant scheduling, internal Samsung logistics, NDA/consent coordination, interpreter support if needed                         |
| Domain Validator     | Samsung DSR Technical Lead (TBD) | Validate technical assumptions, provide integration API context, confirm data architecture constraints                              |

---

## Analysis Plan

### 1. Data Coding

Tag all interview notes using a consistent taxonomy. Each tag includes participant ID and severity/frequency rating (1-5).

| Tag             | Description                                                    | Example                                                                                            |
| --------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `[PAIN]`        | Pain point or frustration with current PM Planner or workflow  | `[PAIN-P03-4] Planner loses 30 min re-entering data after overwrite conflict`                      |
| `[QUOTE]`       | Verbatim quote from Samsung stakeholder                        | `[QUOTE-P05] "I export to Excel because I cannot trust the version in the system"`                 |
| `[INSIGHT]`     | Non-obvious finding or hidden need behind a stated requirement | `[INSIGHT-P02] Version history need is really about accountability, not just tracking`             |
| `[FEATURE]`     | Desired capability or enhancement request                      | `[FEATURE-P01-3] Wants side-by-side diff view at project level, not roadmap level`                 |
| `[SURPRISE]`    | Unexpected discovery that challenges an assumption             | `[SURPRISE-P07] Austin site uses a completely different workflow from Hwaseong`                    |
| `[WORKFLOW]`    | Process step, handoff, or tool-switching moment                | `[WORKFLOW-P01] After saving in PM Planner, manually exports CSV and emails to manager for review` |
| `[METRIC]`      | Quantifiable data point                                        | `[METRIC-P03] Spends 4 hours/week on manual version reconciliation`                                |
| `[EMOTION]`     | Emotional response observed or expressed                       | `[EMOTION-P06] Visible frustration when describing the full-sync to PROMIS`                        |
| `[INTEGRATION]` | Integration-related observation                                | `[INTEGRATION-P07] N-PLM API times out when syncing > 200 projects`                                |
| `[WORKAROUND]`  | Shadow process or unofficial solution                          | `[WORKAROUND-P01] Maintains personal Excel tracker alongside PM Planner`                           |

### 2. Affinity Mapping

Cluster all coded observations across participants. Target: 8-12 theme clusters.

**Expected theme areas** (to be validated/revised during synthesis):

- Concurrent editing conflicts and data loss
- Version reconciliation overhead and trust issues
- PROMIS/N-PLM sync frustration (full-sync waste)
- Cross-site visibility and coordination gaps
- Approval workflow bottlenecks and workarounds
- Manual reporting burden (Excel pivot workarounds)
- Data quality issues from delayed or inconsistent master data sync
- World map / main screen navigation and usability
- AI trust and adoption barriers
- Migration anxiety — fear of losing data or workflows during PM Planner to IRIS transition

Use template `T06_AFFINITY_MAP.md` for structure.

### 3. Empathy Mapping

Create one empathy map per persona archetype. Four expected personas:

| Persona                      | Primary Source Profiles          | Focus                                                                                                                    |
| ---------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **The Resource Planner**     | P1 interviews (3-4 participants) | Daily P/M editing, roadmap, simulation — the power user whose experience defines system usability                        |
| **The Planning Manager**     | P2 interviews (2 participants)   | Approval workflows, version review, cross-department oversight — the gatekeeper whose efficiency depends on system trust |
| **The Analytics Specialist** | P5 interviews (1-2 participants) | Reporting, world map, multi-dimensional analysis — the insight consumer who transforms data into decisions               |
| **The HC Portfolio Manager** | P4 interviews (1-2 participants) | Headcount portfolio, staffing plans, gap analysis — the bridge between HR strategy and resource operations               |

Populate THINKS / FEELS / SAYS / DOES quadrants from interview data. Use template `T05_EMPATHY_MAP.md`.

### 4. Pattern Identification

Cross-reference pain points and feature requests across all participants:

| Pattern Strength | Threshold                                   | Implication                                        |
| ---------------- | ------------------------------------------- | -------------------------------------------------- |
| **Strong**       | Appears in 60%+ of interviews (6+ of 10)    | Core pain — must address in IRIS Phase 1           |
| **Moderate**     | Appears in 40-59% of interviews (4-5 of 10) | Significant pain — strong candidate for Phase 1    |
| **Weak**         | Appears in < 40% of interviews (< 4 of 10)  | Niche or role-specific — evaluate for later phases |

Document frequency counts, severity ratings, and role distribution for each pattern.

### 5. Requirements Priority Validation

Map interview findings to Samsung's 13 requirement groups (Req 0-12). For each requirement produce:

| Dimension                       | Source                                   | Scale                                                 |
| ------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Pain severity score             | User interviews                          | 1-10 (10 = critical daily pain)                       |
| Frequency of unprompted mention | Interview coding                         | Count of participants who raised it without prompting |
| Business impact estimate        | Workshop dot-voting + manager interviews | H/M/L                                                 |
| Technical complexity            | IT interviews + CDO assessment           | H/M/L                                                 |
| MoSCoW recommendation           | Workshop consensus + interview evidence  | Must/Should/Could/Won't                               |

### 6. Insight Prioritization

Rank findings using a 2x2 matrix:

- **X-axis**: Frequency (how many stakeholders experience it)
- **Y-axis**: Impact (business value if solved)

Top-right quadrant items (high frequency + high impact) become primary problem statements for D5.

### 7. Reporting

All findings synthesized into AX-standard deliverables placed in `01_DISCOVER/`. Evidence package assembled for Gate 1 review. Final research report includes:

- Executive summary (1 page)
- Methodology and participant overview
- Key findings organized by research objective (RO-1 through RO-7)
- Persona profiles with evidence grounding
- Prioritized requirements matrix
- Problem statements (POV format)
- Recommendations for DESIGN phase
- Appendices: interview protocol, participant roster (anonymized), raw affinity clusters

---

## CXO UX Research Focus Areas

As CXO, the following UX-specific research dimensions are woven into all interview and observation sessions. These go beyond functional requirements to understand the human experience of resource planning.

### Emotional Journey Mapping

| Moment                      | What to Capture                                                                                    | Why It Matters                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Start of planning cycle** | How do planners feel when a new planning cycle begins? Anticipation? Dread?                        | Reveals whether the system supports or undermines planning motivation          |
| **During data entry**       | Frustration with repetitive entry? Anxiety about concurrent edits? Flow state during focused work? | Identifies where the UI creates friction vs where it fades into the background |
| **Save/submit moment**      | Fear of overwrite? Uncertainty about version state? Relief when save succeeds?                     | The highest-anxiety moment — directly tied to Req 3 (concurrent saving)        |
| **Approval waiting**        | How do planners feel while waiting for manager approval? Blocked? Productive on other work?        | Reveals whether the approval workflow is a bottleneck or a natural pause       |
| **Cross-site coordination** | Frustration with timezone delays? Lack of visibility into other sites' plans?                      | Emotional cost of the organizational structure interacting with the tool       |
| **Reporting/analysis**      | Pride in delivering insights? Frustration with manual Excel work?                                  | Understanding whether reporting is valued work or dreaded chore                |

### Mental Model Exploration

Key mental model questions to embed in interviews:

1. **Version mental model**: "When you think about 'versions' of a resource plan, what does that mean to you? Is a version tied to a project, a roadmap, a time period, or something else?"
2. **Simulation mental model**: "When you run a simulation, what are you actually trying to learn? Walk me through how you set up a what-if scenario."
3. **Roadmap vs simulation distinction**: "Samsung wants to separate roadmap and simulation. How do you currently think about the difference? Are they the same thing to you, or different?"
4. **Organization mental model**: "If I asked you to draw how resource planning works at Samsung DSR — the people, the systems, the flow — what would that look like?"
5. **AI trust mental model**: "If an AI suggested a resource allocation for next quarter, what would you need to see or know before you trusted that suggestion?"

### Workaround Catalog

Systematically document every workaround observed or described:

| Workaround ID | Description                    | Why It Exists | Frequency | Tool Used | What It Reveals |
| ------------- | ------------------------------ | ------------- | --------- | --------- | --------------- |
| WA-001        | (to be filled during research) |               |           |           |                 |

Workarounds are the most valuable UX research artifact — they reveal what the system fails to do and how users have already designed their own solutions.

### Behavioral Observation Checklist (for Contextual Inquiry)

During screen-share observation sessions, watch for:

- [ ] **Navigation patterns**: How does the user move between screens? Do they use menus, bookmarks, or URL shortcuts?
- [ ] **Data entry patterns**: Copy-paste from Excel? Manual typing? Bulk import? Template-based entry?
- [ ] **Error recovery**: What happens when something goes wrong? Does the user know how to recover? Do they call someone?
- [ ] **Multi-tool workflow**: How many applications are open simultaneously? What triggers switching between them?
- [ ] **Communication during planning**: Do they chat/email colleagues while using PM Planner? About what?
- [ ] **Customization signals**: Have they customized their view, created personal templates, or modified default settings?
- [ ] **Confidence signals**: Do they double-check data before saving? Re-open after saving to verify? Export to Excel to validate?
- [ ] **Micro-frustrations**: Sighs, repeated clicks, scrolling back and forth, muttering, closing and reopening screens

---

## Ethical Considerations

| Aspect               | Detail                                                                                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data Privacy         | All participant data stored in project repository with restricted access; no personal data shared outside the Amoza SWAT team and Samsung DSR project stakeholders                      |
| Consent Process      | Verbal consent obtained at start of each session; participants informed of recording, purpose, and how data will be used; right to withdraw at any time                                 |
| Recording Policy     | Sessions recorded (audio/video) with explicit consent; recordings stored securely and deleted after synthesis is complete (within 30 days of research completion)                       |
| Anonymization        | Participants referenced by role and participant ID (e.g., "P1 — Resource Planner, Hwaseong") in all reports; no names in deliverables shared beyond the immediate project team          |
| Cultural Sensitivity | Respect Samsung corporate culture and hierarchy; be aware of indirect communication styles; do not put junior employees in position of criticizing their organization in group settings |
| Language             | Conduct sessions in English; provide Korean-language summary of key questions in advance if requested; use Samsung-provided interpreter for Xi'an sessions if needed (Mandarin)         |

---

## Risks & Mitigations

| #   | Risk                                                                                                                         | Impact                                                                                   | Likelihood | Mitigation                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1  | Samsung stakeholders unavailable due to scheduling conflicts across timezones (KST/CST/CST-China)                            | Insufficient interview data; overseas site perspectives missing                          | Medium     | Schedule early (Day 1-3); offer flexible time slots; allow async written responses as fallback; prioritize Hwaseong/Pyeongtaek for minimum viable data set                                                               |
| R2  | Interviewees provide "wish list" answers rather than describing actual pain and real behavior                                | Misleading priority data; features built for stated rather than real needs               | Medium     | Use behavioral interview techniques ("Tell me about the last time..."); contextual inquiry to observe actual usage; triangulate stated needs against observed behavior                                                   |
| R3  | Existing input documents (Req 0-12, architecture docs) create confirmation bias — research validates what we already assumed | Miss hidden needs; false confidence in existing requirements                             | Medium     | Start interviews with open-ended exploration before showing requirements list; include explicit "What is missing?" and "What surprised you?" questions; track surprises as a first-class data category                   |
| R4  | Samsung IT restricts access to integration API details (N-PLM, PROMIS, Samsung AI Services) due to security policy           | Cannot validate technical integration assumptions for RO-7                               | Low-Medium | Escalate through Samsung DSR project sponsor; frame questions around operational experience rather than API internals; document as high-uncertainty assumptions if access denied                                         |
| R5  | Language and cultural barriers in interviews (Korean/English; Chinese/English)                                               | Misinterpretation of nuanced responses; participants holding back in non-native language | Low-Medium | Provide interview questions in advance (English + Korean translation); use Samsung interpreter for Xi'an; confirm key findings in writing; validate synthesis with Samsung coordinator                                   |
| R6  | PM Planner users resistant to new-build approach — prefer incremental upgrade                                                | Business hypothesis invalidated; fundamental approach questioned                         | Low        | If detected, treat as critical finding (not a threat); document the reasoning; explore what conditions would make a new build acceptable; feed into Gate 1 decision                                                      |
| R7  | Research scope creep — 13 requirements + 7 feature areas + 7 roles creates an overwhelming research surface                  | Interviews too broad, lack depth on critical topics                                      | Medium     | Prioritize RO-1 through RO-4 (H priority); tailor interview guide by role — planners get deep workflow questions, managers get prioritization questions, IT gets integration questions; time-box every interview section |

---

## Deliverables Checklist

- [x] **D1** Research Plan (this document) — CXO-authored, pending stakeholder approval
- [ ] **D2** Screener Survey — lightweight role-verification for Samsung DSR participants
- [ ] **D3** Interview Guide — role-tailored question sets following Five-Act structure
- [ ] **D4** Interview Notes — 10-12 sessions coded with taxonomy tags
- [ ] **D5** Contextual Inquiry Observations — 2-3 screen-share observation logs
- [ ] **D6** Requirements Workshop Output — prioritized Req 0-12 with MoSCoW and severity scores
- [ ] **D7** Affinity Map — 8-12 theme clusters with frequency and severity data
- [ ] **D8** Empathy Maps — 4 persona archetypes (Planner, Manager, Analyst, HR)
- [ ] **D9** Persona Cards — 4 evidence-grounded personas
- [ ] **D10** Problem Statements — 3-4 POV-format statements with validation scores
- [ ] **D11** Research Report — comprehensive findings, insights, and DESIGN phase recommendations
- [ ] **D12** Gate 1 Evidence Package — compiled evidence for GO/CONDITIONAL/NO-GO decision

---

## Related Templates & Guides

| Document                   | Path                                                        | Relationship                       |
| -------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| T01 Research Plan Template | `.ax/templates/T01_RESEARCH_PLAN.md`                        | Template this document is based on |
| T02 Screener Survey        | `.ax/templates/T02_SCREENER_SURVEY.md`                      | Next deliverable template          |
| T03 Interview Guide        | `.ax/templates/T03_INTERVIEW_GUIDE.md`                      | Interview structure template       |
| T04 Interview Notes        | `.ax/templates/T04_INTERVIEW_NOTES.md`                      | Session capture template           |
| T05 Empathy Map            | `.ax/templates/T05_EMPATHY_MAP.md`                          | Persona synthesis template         |
| T06 Affinity Map           | `.ax/templates/T06_AFFINITY_MAP.md`                         | Theme clustering template          |
| D1 Research Planning Guide | `.ax/guides/discover/D1_RESEARCH_PLANNING_GUIDE.md`         | Detailed methodology reference     |
| Samsung Requirements       | `.command/000_init_project/input/note.txt`                  | Source requirements (Req 0-12)     |
| Feature List               | `.command/000_init_project/input/features_list.txt`         | Feature area definitions (F1-F7)   |
| Reference Output           | `.command/000_init_project/output/D1_RESEARCH_PLAN_IRIS.md` | Previous iteration reference       |

---

_AX Transformation Framework v2.0.0 — Amoza SWAT Team_
_"AI for Real Life. Real Impact."_
