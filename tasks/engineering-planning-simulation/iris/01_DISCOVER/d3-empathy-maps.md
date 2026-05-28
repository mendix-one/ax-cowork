# Empathy Maps — IRIS for Samsung DSR

> **AX Transformation Framework v2.0.0** | DISCOVER Phase — Task D3b
> **Owner**: CXO | **Date**: 2026-03-21
> **Product**: IRIS (Intelligent Resources Information System) — New Build replacing PM Planner

---

## Document Purpose

This document contains 4 empathy maps synthesized from 10 user interviews with Samsung DSR stakeholders across 5 sites (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung). Each empathy map represents a distinct user archetype grounded in actual interview evidence. These maps inform persona development (D4), problem statement articulation (D5), and IRIS design decisions.

### Interview Coverage

| Archetype                | Interviews                | Sites Represented            |
| ------------------------ | ------------------------- | ---------------------------- |
| The Resource Planner     | INT-001, INT-002, INT-003 | Hwaseong, Pyeongtaek, Austin |
| The Approving Manager    | INT-004, INT-005          | Hwaseong, Pyeongtaek         |
| The Analytics User       | INT-008                   | Pyeongtaek                   |
| The HR Portfolio Manager | INT-007                   | Hwaseong                     |

---

## Empathy Map 1: The Resource Planner (Primary Archetype)

### Metadata

| Field      | Value                                                                                              |
| ---------- | -------------------------------------------------------------------------------------------------- |
| Project    | IRIS DISCOVER Phase — Resource Planning System New Build                                           |
| Product    | IRIS (Intelligent Resources Information System) for Samsung DSR                                    |
| Persona    | The Resource Planner                                                                               |
| Date       | 2026-03-21                                                                                         |
| Researcher | CXO, AI Production Team                                                                            |
| Based On   | INT-001 (Jisoo Park, Hwaseong), INT-002 (Daniel Choi, Pyeongtaek), INT-003 (Mike Sullivan, Austin) |

### User Profile

| Attribute        | Detail                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Name / Alias     | "Senior Planner Jisoo" (composite of 3 planner interviews)                                        |
| Role / Title     | Senior Resource Planner                                                                           |
| Industry         | Semiconductor — Samsung Device Solutions Research (DSR)                                           |
| Experience Level | 3-6 years in resource planning at Samsung DSR                                                     |
| Company Size     | Samsung Electronics — 270,000+ employees                                                          |
| Key Tools Used   | PM Planner (daily), Excel (extensively), email/Teams, N-PLM (read-only), personal Excel workbooks |

### THINKS

> What occupies their mind? What are their beliefs and assumptions about their work?

1. "I need to protect my work. If I save and someone else saved before me, my hours of effort vanish. I've learned to save obsessively — every 10 minutes — just in case." — _INT-001, observation of save behavior_
2. "PM Planner is just a data entry system. The real planning — simulations, scenarios, trade-off analysis — I do all of that in Excel. That's where the thinking happens." — _INT-001, direct quote_
3. "There must be a way to work on the same plan simultaneously without this primitive time-slot coordination. Google Docs figured this out 15 years ago." — _INT-002, paraphrased frustration_
4. "My personal Excel workbook is my safety net. If PM Planner disappeared tomorrow, I could survive for weeks on my spreadsheet alone." — _INT-001, statement about backup strategy_
5. "Version control shouldn't be my responsibility. I'm a planner, not a file system. The system should know what changed, when, and by whom." — _INT-002, direct quote_
6. "I worry about the overseas sites — Austin, Xi'an. They're always a step behind because they can't see what we changed overnight. That asymmetry hurts collaboration." — _INT-001, cross-site concern_
7. "The simulation module in PM Planner is dead to me. I haven't used it in over a year. Every scenario I run is in Excel because PM Planner can't handle the complexity." — _INT-001, tool abandonment_
8. "When org restructuring hits, all our factor control filters break. I spend weeks rebuilding what should be a configuration change." — _INT-002, observation during restructure discussion_
9. "I think about data integrity constantly. If I make a mistake before PROMIS sync, it propagates into financial systems. The pressure is real." — _INT-003, risk awareness_
10. "Every morning I'm a detective, reconstructing what my Korean colleagues changed while I was sleeping. PM Planner gives me zero change history." — _INT-003, daily routine reflection_

### FEELS

> What emotions drive their decisions? What worries or excites them?

1. **Anxious about data loss** — the fear of concurrent save overwrites is a constant, low-grade stress that colors every interaction with PM Planner. Planners save obsessively as a coping mechanism. — _INT-001, observed behavior_
2. **Frustrated by repetitive manual work** — 45% of planning time is spent on data gathering, reconciliation, and version comparison rather than strategic resource optimization. — _INT-001, INT-002, time analysis_
3. **Protective of personal workarounds** — the "Oracle" Excel workbook, version notebooks, and editing calendars represent significant personal investment; losing these would be disorienting. — _INT-001, emotional attachment to shadow systems_
4. **Resigned to PM Planner's limitations** — long past hoping PM Planner will improve; expects the system to fail them and plans accordingly. — _INT-002, stated expectation_
5. **Cautiously hopeful about IRIS** — interested in the promise of a new system but skeptical, based on years of working around a broken one. "I've heard 'we're fixing it' before." — _INT-002, guarded optimism_
6. **Stressed during organizational changes** — every Samsung DS restructuring means weeks of broken factor control filters and stale master data. Feels like rebuilding from scratch. — _INT-002, restructure anxiety_
7. **Isolated (overseas planners)** — Austin and Xi'an planners feel disconnected from HQ decisions, compounded by time zone and language barriers. "By the time I see the changes, the context is lost." — _INT-003, isolation sentiment_
8. **Proud of planning expertise** — despite tool frustrations, planners take professional pride in the quality of their resource plans. The tool is the obstacle, not the skill. — _INT-001, INT-003, self-perception_
9. **Fearful of PROMIS sync errors** — full sync sending unchanged data creates false downstream changes. The anxiety before each sync cycle is palpable. — _INT-002, pre-sync stress_
10. **Resentful of coordination overhead** — having to check an editing calendar and coordinate save windows with colleagues feels demeaning for professional planners. — _INT-001, INT-002, shared sentiment_

### SAYS

> What do they tell colleagues, managers, and vendors?

1. "Don't edit Project X right now — I'm working on it. Check the editing calendar." — _INT-001, daily coordination_
2. "The numbers in PM Planner might not be current. Let me check my Excel file for the latest version." — _INT-001, trust deficit_
3. "I spend more time fighting the tool than using it. PM Planner is a data entry tool, not a planning tool." — _INT-001, direct quote_
4. "I can run that simulation for you, but it'll take a full day. I have to set it up from scratch in Excel." — _INT-001, simulation request response_
5. "Can you tell me what changed since last week? Because PM Planner won't." — _INT-003, change tracking gap_
6. "I keep my own backups because I can't trust PM Planner to preserve my work." — _INT-002, direct quote_
7. "We need to coordinate before we both save — who's going first?" — _INT-001, INT-002, conflict avoidance ritual_
8. "The Gantt view works fine. Don't change the Gantt. Just fix everything around it." — _INT-002, feature preservation request_
9. "I just need the system to remember what I did. Is that too much to ask?" — _INT-003, version history plea_
10. "Every morning, I play detective. What changed? Who changed it? Why? No answers." — _INT-003, direct quote_

### DOES

> What actions and behaviors do we observe?

1. Opens PM Planner first thing every morning alongside Excel and email — dual monitors, PM Planner on one, Excel on the other. — _INT-001, INT-002, INT-003, universal routine_
2. Checks the shared "editing calendar" before opening any project to ensure no colleague is currently editing. — _INT-001, INT-002, conflict prevention_
3. Saves every 10-15 minutes out of fear that a colleague might save simultaneously and overwrite changes. — _INT-001, compulsive save behavior_
4. Maintains a personal Excel workbook ("The Oracle") mirroring PM Planner data plus simulation models, cross-references, and reporting templates — updated in parallel. — _INT-001, shadow system_
5. Exports PM Planner data to Excel weekly as a version backup, since PM Planner has no version history. — _INT-001, INT-002, manual versioning_
6. Spends first hour each day (especially overseas planners) as a "morning detective" — reconstructing overnight changes by comparing current state against yesterday's Excel export. — _INT-003, daily forensics_
7. Builds what-if scenarios entirely in Excel because PM Planner's simulation is too limited — 30+ tab workbooks for complex scenarios. — _INT-001, simulation workaround_
8. Communicates via email/Teams for approval requests, change notifications, and conflict coordination — none system-supported. — _INT-001, INT-002, INT-003, process gap_
9. Triple-checks data before PROMIS sync because errors propagate to financial systems. — _INT-002, pre-sync ritual_
10. Coordinates editing time slots with colleagues via instant messaging to avoid concurrent save conflicts. — _INT-001, INT-002, primitive concurrency control_

---

### SAYS vs. DOES Contradictions

| What They Say                          | What They Do                                                                         | Insight                                                                                                              |
| -------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| "PM Planner is just a data entry tool" | Spends 4+ hours daily in PM Planner — it is their primary work environment           | PM Planner is more central to their workflow than they admit; the frustration stems from dependence, not irrelevance |
| "I keep my own backups"                | Exports are inconsistent — weekly at best, sometimes skipped under deadline pressure | The backup discipline is aspirational, not reliable; data loss risk is higher than they believe                      |
| "The Gantt view works fine"            | Frequently switches to Excel to visualize the same data in different formats         | The Gantt is adequate for data entry, but insufficient for analytical or presentation needs                          |

### #1 Emotional Pain

**Fear of losing work to concurrent save overwrites.** This is not an occasional inconvenience — it is a daily, ambient anxiety that shapes every interaction with the system. Planners have restructured their entire workflow around avoiding this single failure mode: editing calendars, chat coordination, compulsive saving, parallel Excel maintenance. The emotional cost is disproportionate to the technical problem. A planner who has lost 3 hours of work to an overwrite carries that trauma into every subsequent session.

### CXO Design Implications

1. **Concurrent editing is the table-stakes requirement.** IRIS must support real-time collaborative editing with conflict detection and merge capabilities. Without this, no other feature matters — planners will not trust the system.
2. **Preserve the P/M editing grid and Gantt view.** These are the only PM Planner elements planners want to keep. Build on familiar interaction patterns; do not force relearning.
3. **Version history must be automatic and granular.** Per-project change log with diff view, timestamp, and author. No manual export needed.
4. **Simulation sandbox as a first-class feature.** Clone a plan, modify it, compare scenarios side by side, commit or discard. This replaces the 30-tab Excel workbooks.
5. **Cross-site change feed.** "What changed since I last logged in?" view eliminates the morning detective routine for overseas planners.
6. **Delta sync to PROMIS.** Send only changed projects, not full dataset. Reduces sync anxiety and eliminates false downstream changes.

### Key Quotes

> "I once spent three hours entering detailed P/M adjustments. My colleague saved five minutes before me. My three hours of work — gone. No warning, no merge, just gone."
> — _INT-001 (Jisoo Park, Hwaseong)_

> "PM Planner is a data entry tool pretending to be a planning tool. Real planning — simulation, optimization, trade-off analysis — I do all of that in Excel."
> — _INT-001 (Jisoo Park, Hwaseong)_

> "I come into work every morning and play detective. What changed overnight? Who changed it? Why? PM Planner gives me zero answers."
> — _INT-003 (Mike Sullivan, Austin)_

---

## Empathy Map 2: The Approving Manager (Secondary Archetype)

### Metadata

| Field      | Value                                                           |
| ---------- | --------------------------------------------------------------- |
| Project    | IRIS DISCOVER Phase — Resource Planning System New Build        |
| Product    | IRIS (Intelligent Resources Information System) for Samsung DSR |
| Persona    | The Approving Manager                                           |
| Date       | 2026-03-21                                                      |
| Researcher | CXO, AI Production Team                                         |
| Based On   | INT-004 (Minho Kim, Hwaseong), INT-005 (Soojin Lee, Pyeongtaek) |

### User Profile

| Attribute        | Detail                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| Name / Alias     | "Manager Minho" (composite of 2 manager interviews)                                                     |
| Role / Title     | Planning Manager / Division Manager                                                                     |
| Industry         | Semiconductor — Samsung Device Solutions Research (DSR)                                                 |
| Experience Level | 5-12 years in resource planning management at Samsung DSR                                               |
| Company Size     | Samsung Electronics — 270,000+ employees                                                                |
| Key Tools Used   | PM Planner (review only), Excel (exported reports), PowerPoint (presentations), email/Teams (approvals) |

### THINKS

> What occupies their mind? What are their beliefs and assumptions?

1. "I'm accountable for plans I can't properly verify. When someone asks 'who approved this?' I point to an email thread. That's not governance." — _INT-004, accountability concern_
2. "My planners are spending half their time fighting the system instead of planning. If I could liberate them from data wrangling, the quality of our plans would improve dramatically." — _INT-004, team productivity awareness_
3. "I need a management view, not a data entry view. Show me status dashboards, approval queues, conflict alerts — things a manager actually needs." — _INT-004, role-appropriate UX demand_
4. "The monthly reconciliation meeting — 3-4 hours with printed Excel sheets — is an embarrassment. We're Samsung, and we're resolving resource conflicts with paper." — _INT-004, process inadequacy_
5. "Cross-department over-allocation is invisible until someone complains. I should see it the moment it happens, not a month later." — _INT-005, detection lag_
6. "The Division Manager asks for cross-site numbers, and it takes my team a week to compile an answer. By then the decision window has closed." — _INT-004, information latency_
7. "I'm worried about draft data being treated as final. A planner saves work-in-progress, and someone downstream acts on it because there's no 'draft' label." — _INT-005, data status ambiguity_
8. "When I approve a plan, that decision should be recorded by the system, not buried in my email outbox." — _INT-004, audit trail demand_
9. "I need to see the delta between what was submitted and what was previously approved. Cell-by-cell comparison in Excel is not a review process." — _INT-004, diff requirement_
10. "PROMIS sync introducing false changes is not a PM Planner problem — it's a governance failure. We're sending unvalidated data to financial systems." — _INT-005, system integrity concern_

### FEELS

> What emotions drive their decisions? What worries or excites them?

1. **Accountable but powerless** — responsible for plan quality and governance but has no system tools to enforce standards, track approvals, or audit decisions. — _INT-004, governance gap_
2. **Frustrated by manual comparison** — spending 40% of review time on cell-by-cell Excel comparison that a diff algorithm could do instantly. — _INT-004, review overhead_
3. **Concerned about data integrity** — PROMIS sync artifacts (false profit changes) undermine confidence in the data pipeline and create unnecessary firefighting. — _INT-005, downstream risk_
4. **Embarrassed by primitive processes** — conference rooms with printed Excel sheets for resource reconciliation feels anachronistic for a technology leader. — _INT-004, organizational pride_
5. **Burdened by information compilation** — compiling cross-site summaries for the Division Manager is a multi-day effort that diverts the team from core oversight. — _INT-004, opportunity cost_
6. **Eager for proper workflow** — a draft/review/approve cycle with notifications and audit trail would transform the manager's ability to govern. — _INT-004, INT-005, shared desire_
7. **Nervous about version accuracy** — cannot be certain whether the plan being reviewed reflects the latest planner edits or a stale snapshot. — _INT-005, version uncertainty_
8. **Overwhelmed during peak cycles** — quarterly planning and reorg periods multiply the approval backlog with no system to manage priority or sequence. — _INT-004, seasonal stress_
9. **Distrustful of PM Planner data** — has learned through experience that PM Planner data may not reflect the latest reality, leading to over-verification. — _INT-005, trust deficit_
10. **Motivated by team efficiency** — genuinely wants planners to spend time on planning rather than tool-fighting; sees IRIS as a team productivity lever. — _INT-004, managerial empathy_

### SAYS

> What do they tell colleagues, managers, and project stakeholders?

1. "Did you submit the plan for review? Check your email — I should have responded by now." — _INT-004, email-based workflow_
2. "Is this the latest version? I need to make sure I'm not approving old data." — _INT-005, version verification ritual_
3. "We need to schedule the reconciliation meeting. Pull the latest data from each department and prepare the cross-reference." — _INT-004, monthly meeting coordination_
4. "I approved this via email on March 12th — let me find the thread." — _INT-004, audit trail archaeology_
5. "The Division Manager needs the global resource summary by Friday. Who can help compile it?" — _INT-004, data compilation delegation_
6. "I can't tell if this is a draft or a finalized plan. Planner, is this ready for my review?" — _INT-005, status ambiguity_
7. "Show me what changed. Don't make me compare two spreadsheets to find out." — _INT-004, diff demand_
8. "We're Samsung. We should not be resolving resource conflicts with printed Excel sheets in a conference room." — _INT-004, direct quote_
9. "My approval should mean something. Right now, it's just an email that nobody can find later." — _INT-004, governance legitimacy_
10. "If two departments are allocating the same engineer at 120%, I should know immediately, not at the monthly meeting." — _INT-005, real-time alerting need_

### DOES

> What actions and behaviors do we observe?

1. Reviews plans by opening PM Planner alongside personal Excel exports from previous versions — compares cell by cell to identify changes. — _INT-004, INT-005, manual diff process_
2. Approves plans via email reply — no system-level approval action exists. — _INT-004, email governance_
3. Maintains personal Excel archives of "approved" plan versions as the de facto audit trail. — _INT-004, shadow audit system_
4. Organizes monthly reconciliation meetings (3-4 hours) where cross-department overlaps are identified by overlaying printed Excel sheets. — _INT-004, paper-based reconciliation_
5. Compiles cross-site resource summaries by requesting data exports from planners at each site, merging in Excel, presenting in PowerPoint. — _INT-004, manual compilation_
6. Fields escalation requests when over-allocation conflicts arise between departments — resolves through negotiation, not system intelligence. — _INT-005, conflict mediation_
7. Delegates data compilation to junior planners, consuming 2+ planner-days per month on non-planning work. — _INT-004, resource diversion_
8. Asks planners verbally whether a saved plan is "draft" or "final" because the system makes no distinction. — _INT-005, status inquiry_
9. Maintains a personal folder of email approval threads organized by project name as a searchable audit archive. — _INT-004, email filing system_
10. Prints plan summaries for face-to-face review meetings because on-screen comparison is too cumbersome. — _INT-004, INT-005, print dependency_

---

### SAYS vs. DOES Contradictions

| What They Say                                     | What They Do                                                                                       | Insight                                                                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| "I approved this plan"                            | Approval is an email reply with no system record; the "approval" has no enforceable authority      | Managers want governance authority but have accepted informal mechanisms that provide none                    |
| "We're Samsung — we shouldn't use printed sheets" | Organizes monthly meetings with printed Excel sheets as the primary reconciliation method          | The embarrassment is genuine, but no alternative exists; managers have normalized the practice they criticize |
| "I need to see what changed"                      | Spends 40% of review time on manual cell comparison instead of requesting a system diff capability | Managers have adapted to the absence of diff tooling rather than escalating it as a blocker                   |

### #1 Emotional Pain

**Accountability without control.** Managers are held responsible for the quality and accuracy of resource plans, but PM Planner gives them no governance tools: no approval workflow, no version diff, no draft/final distinction, no audit trail. The result is a pervasive anxiety about signing off on plans they cannot fully verify, using processes (email approval) that provide no organizational memory. When errors surface downstream, the manager cannot prove what was approved, when, or based on what data.

### CXO Design Implications

1. **Draft/Submit/Review/Approve workflow is non-negotiable.** IRIS must support explicit plan states with transitions, notifications, and system-recorded approvals. This is the manager's primary interaction model.
2. **Auto-diff on submission.** When a planner submits a plan for review, the system should automatically generate a visual diff against the previously approved version. Managers should never manually compare spreadsheets.
3. **Manager dashboard as the default view.** Show plan status across all planners (draft, submitted, approved, conflicts), approval queue, over-allocation alerts, and cross-department summaries. Do not show the manager a data entry grid.
4. **Real-time over-allocation detection.** Cross-department and cross-site resource conflicts must surface immediately as system alerts, not wait for monthly meetings.
5. **Audit trail built into the system.** Every approval, rejection, and revision recorded with timestamp, approver identity, and the exact plan state at time of decision.
6. **Cross-site summary on demand.** Eliminate the multi-day compilation process. Managers and Division Managers should access a live global resource view.

### Key Quotes

> "My approval process is: someone sends me an email saying 'please review Project X.' I open PM Planner, open my previous Excel export, compare by eye, and then reply 'approved' by email. The system doesn't know I approved anything."
> — _INT-004 (Minho Kim, Hwaseong)_

> "Full sync to PROMIS is not just wasteful — it's dangerous. Last quarter, a full sync triggered a recalculation that changed the profit margin display for 30+ projects."
> — _INT-005 (Soojin Lee, Pyeongtaek)_

> "We're Samsung, and we're resolving resource conflicts with printed Excel sheets in a conference room. That's not planning — that's archaeology."
> — _INT-004 (Minho Kim, Hwaseong)_

---

## Empathy Map 3: The Analytics User (Secondary Archetype)

### Metadata

| Field      | Value                                                           |
| ---------- | --------------------------------------------------------------- |
| Project    | IRIS DISCOVER Phase — Resource Planning System New Build        |
| Product    | IRIS (Intelligent Resources Information System) for Samsung DSR |
| Persona    | The Analytics User                                              |
| Date       | 2026-03-21                                                      |
| Researcher | CXO, AI Production Team                                         |
| Based On   | INT-008 (Donghyun Bae, Pyeongtaek)                              |

### User Profile

| Attribute        | Detail                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- |
| Name / Alias     | "Analyst Donghyun" (anchored in INT-008)                                            |
| Role / Title     | Planning Analyst / Analytics Specialist                                             |
| Industry         | Semiconductor — Samsung Device Solutions Research (DSR)                             |
| Experience Level | 5 years in planning analytics at Samsung DSR; MS Statistics                         |
| Company Size     | Samsung Electronics — 270,000+ employees                                            |
| Key Tools Used   | PM Planner (export only), Excel, Python/Jupyter, personal Elasticsearch, PowerPoint |

### THINKS

> What occupies their mind? What are their beliefs and assumptions?

1. "I'm a data scientist forced to work as a data plumber. 70% of my time is extraction and preparation. Only 30% is actual analysis. The ratio should be inverted." — _INT-008, time allocation frustration_
2. "PM Planner is where data goes to hide. Getting useful data out of it feels like an archaeological excavation." — _INT-008, direct quote_
3. "I built my own ES cluster on my laptop because the official infrastructure couldn't support my query needs. When a $400B company's analyst needs to build rogue infrastructure, the system has failed." — _INT-008, infrastructure indictment_
4. "Multi-dimensional analysis — slice by site, division, project type, function, time period — should be point-and-click. Instead, it's a 4-hour Python scripting exercise." — _INT-008, capability gap_
5. "If Samsung AI Services can generate pivot tables from natural language queries, that would eliminate half my manual reporting work overnight." — _INT-008, AI enthusiasm_
6. "I am literally a human cron job. Every month, same 5 reports, same 20 stakeholders, same format. The only thing that changes is the data. A machine should do this." — _INT-008, direct quote_
7. "The executives consuming my reports think the data is real-time. It's actually 3-5 days stale by the time it reaches them. Nobody knows." — _INT-008, freshness deception_
8. "If I had a proper analytical layer, I could do predictive analytics — forecasting resource bottlenecks before they happen. But I'm stuck in reactive mode." — _INT-008, aspirational analysis_
9. "Every ad-hoc request from a manager costs me 2-4 hours because I have to extract, clean, and reshape data before I can even start the analysis." — _INT-008, request overhead_
10. "Req 10 and 11 together would eliminate 70% of my manual work and let me focus on actual insight generation." — _INT-008, IRIS feature enthusiasm_

### FEELS

> What emotions drive their decisions? What worries or excites them?

1. **Deeply frustrated** — possesses the skills and knowledge to provide sophisticated analysis, but is bottlenecked by data extraction and preparation drudgery. — _INT-008, capability-environment mismatch_
2. **Intellectually under-stimulated** — the analytical work is interesting when he gets to it, but 70% of his week is mechanical data plumbing that doesn't challenge his abilities. — _INT-008, boredom_
3. **Excited about AI potential** — genuinely enthusiastic about AI-based reporting (Req 11); sees it as the key to liberating analytical capacity. Most forward-looking persona. — _INT-008, technology optimism_
4. **Proud of technical workarounds** — the personal ES cluster is a point of pride; demonstrates initiative and capability, but also reveals frustration with official infrastructure. — _INT-008, resourcefulness_
5. **Anxious about data accuracy** — knows that stale or incorrectly extracted data undermines every downstream analysis and executive decision. — _INT-008, quality pressure_
6. **Impatient with infrastructure pace** — has been requesting a proper ES cluster for 3 years. The gap between what is possible and what is provided is maddening. — _INT-008, organizational frustration_
7. **Lonely in role** — the only dedicated analyst in the planning organization; no peers to share methods, validate approaches, or distribute workload. — _INT-008, isolation_
8. **Resentful of report automation neglect** — the same 5 reports compiled manually every month for years feels like organizational disrespect for his time. — _INT-008, automation absence_
9. **Energized by analytical challenges** — when an ad-hoc request involves genuine analytical complexity, he engages deeply. The problem is not the work itself but the prerequisite drudgery. — _INT-008, engagement pattern_
10. **Worried about career growth** — spending most of his time on data extraction does not build the analytical portfolio he needs for career advancement. — _INT-008, professional development concern_

### SAYS

> What do they tell colleagues, managers, and project stakeholders?

1. "I need 3-4 days to generate that analysis. Most of that is getting the data out of PM Planner, not the analysis itself." — _INT-008, timeline explanation_
2. "The report you're reading was based on data from last Tuesday. A lot has changed since then." — _INT-008, freshness disclaimer_
3. "I can't build a real-time dashboard because there's no real-time analytical layer to query against." — _INT-008, infrastructure dependency_
4. "If you need a quick pivot on resource utilization by site and function, give me 2 hours and a Python notebook." — _INT-008, capability advertisement_
5. "The monthly reports? Same 5 reports every time. I've asked for automation for 3 years. Still waiting." — _INT-008, direct quote_
6. "Samsung AI Services could do this — let me query in Korean: 'Show me Q2 resource allocation by site, excluding dropped projects.' But we don't have the infrastructure to support it." — _INT-008, AI use case_
7. "PM Planner is where data goes to hide." — _INT-008, direct quote_
8. "Give me a proper ES cluster and I'll have dashboards running in two weeks." — _INT-008, infrastructure commitment_
9. "Every month I manually build 5 reports that a cron job could handle. My MS in Statistics did not prepare me for this." — _INT-008, qualifications mismatch_
10. "I know the data better than anyone. But knowing the data and being able to access the data are two different problems." — _INT-008, access vs. knowledge gap_

### DOES

> What actions and behaviors do we observe?

1. Exports PM Planner data to CSV every Monday morning — first step of the weekly analysis cycle. — _INT-008, weekly extraction ritual_
2. Imports data into Python/Jupyter environment, transforms it, enriches it with N-PLM and GHRP data. — _INT-008, data pipeline_
3. Maintains a personal Elasticsearch cluster on his local machine with 2 years of PM Planner historical data indexed for fast querying. — _INT-008, shadow infrastructure_
4. Builds multi-dimensional analyses manually using Python pandas — pivot tables, cross-tabulations, time series. — _INT-008, analytical method_
5. Generates visualizations in matplotlib/plotly, then reformats for PowerPoint or Excel delivery. — _INT-008, output formatting_
6. Compiles 5 monthly reports manually and distributes via email to 20 stakeholders — same structure, different data each month. — _INT-008, human cron job_
7. Responds to ad-hoc analysis requests from managers and executives — typically 3-5 per week, each taking 2-4 hours. — _INT-008, request-driven workload_
8. Debugs data quality issues — catches discrepancies between PM Planner exports and N-PLM data regularly. — _INT-008, data quality sentinel_
9. Writes Python scripts to automate parts of his workflow, but cannot automate the PM Planner export step. — _INT-008, partial automation_
10. Presents analytical findings in meetings using PowerPoint slides generated from his Python pipeline. — _INT-008, delivery format_

---

### SAYS vs. DOES Contradictions

| What They Say                                                       | What They Do                                                                                                     | Insight                                                                                                                                                    |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "I need 3-4 days for that analysis"                                 | Frequently delivers ad-hoc analyses in 2-4 hours when pressed by executives                                      | The stated timeline includes buffer for extraction; actual analysis time is much shorter. This reveals the true cost of the data access problem            |
| "Give me a proper ES cluster and I'll have dashboards in two weeks" | Has been running a personal ES cluster for 2 years without escalating the infrastructure gap as a formal blocker | The analyst has adapted to the broken infrastructure rather than forcing organizational change; workarounds enable neglect                                 |
| "I can't build real-time dashboards"                                | Has built near-real-time query capability on his personal ES cluster                                             | The limitation is organizational (no official infrastructure), not technical (he has proven the concept). The gap is institutional support, not competence |

### #1 Emotional Pain

**Wasted intellectual capacity.** The analyst is a trained data scientist spending 70% of his time as a data plumber. The emotional toll is not frustration with any single task — it is the cumulative weight of knowing he could deliver 3x more analytical value if the data access problem were solved. He watches his skills atrophy while he manually exports CSVs and reformats PowerPoint slides. The personal ES cluster is both a badge of pride and a monument to organizational failure.

### CXO Design Implications

1. **In-system OLAP analytics are essential.** IRIS must provide drag-and-drop multi-dimensional analysis: slice by site, division, project type, function, and time period without leaving the application.
2. **Report scheduling and auto-distribution.** The 5 monthly reports must be templated and auto-generated. The analyst should configure them once and the system should produce and distribute them.
3. **AI-based natural language querying.** Integrate Samsung AI Services or equivalent for natural language to pivot table conversion. Support both Korean and English queries.
4. **Proper Elasticsearch infrastructure.** A managed, highly available ES cluster with PM Planner data indexed in near-real-time. Eliminate the personal laptop cluster.
5. **API-first data access.** The analyst should be able to query IRIS data programmatically (REST API, GraphQL) for custom analyses without relying on CSV exports.
6. **Data freshness guarantee.** IRIS analytics should reflect current state, not last week's export. Real-time or near-real-time indexing.

### Key Quotes

> "PM Planner is where data goes to hide. Getting it out is like performing an extraction."
> — _INT-008 (Donghyun Bae, Pyeongtaek)_

> "I am a human cron job. Every month, same reports, same recipients, same format, but I have to build them from scratch."
> — _INT-008 (Donghyun Bae, Pyeongtaek)_

> "Req 10 and 11 together would eliminate 70% of my manual work and let me focus on actual insight generation."
> — _INT-008 (Donghyun Bae, Pyeongtaek)_

---

## Empathy Map 4: The HR Portfolio Manager (Supplementary Archetype)

### Metadata

| Field      | Value                                                           |
| ---------- | --------------------------------------------------------------- |
| Project    | IRIS DISCOVER Phase — Resource Planning System New Build        |
| Product    | IRIS (Intelligent Resources Information System) for Samsung DSR |
| Persona    | The HR Portfolio Manager                                        |
| Date       | 2026-03-21                                                      |
| Researcher | CXO, AI Production Team                                         |
| Based On   | INT-007 (Yuna Han, Hwaseong)                                    |

### User Profile

| Attribute        | Detail                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| Name / Alias     | "HR Planner Yuna" (anchored in INT-007)                                                                |
| Role / Title     | HR Planner / HeadCount Portfolio Manager                                                               |
| Industry         | Semiconductor — Samsung Device Solutions Research (DSR)                                                |
| Experience Level | 4 years in HR planning at Samsung DSR                                                                  |
| Company Size     | Samsung Electronics — 270,000+ employees                                                               |
| Key Tools Used   | PM Planner (export only), GHRP (HR system), SMDM (organization), Excel (primary work tool), PowerPoint |

### THINKS

> What occupies their mind? What are their beliefs and assumptions?

1. "I'm a human SQL JOIN. My job is essentially merging two databases that refuse to talk to each other. PM Planner has the plan, GHRP has the actuals, and I'm the middleware." — _INT-007, direct quote_
2. "Every month, I spend 2 full days doing what a database query could do in seconds. Matching planned allocation against actual headcount should be automated, not manual." — _INT-007, automation gap_
3. "My naming convention lookup table — 3 pages of translations between PM Planner and GHRP naming — is the most absurd artifact of my work. If the systems used the same names, it wouldn't exist." — _INT-007, naming mismatch_
4. "The stakes of my work are high. If I miscalculate the headcount gap by 10 engineers, that's $2 million in misguided hiring or unfilled positions." — _INT-007, accuracy stakes_
5. "I need to see planned vs. actual in one view — not two exports merged in Excel. Show me the gap, the trend, the recommendation." — _INT-007, integrated view demand_
6. "When the Division Manager asks for a global staffing view, I build it in PowerPoint. By the time he presents it, the numbers are stale." — _INT-007, freshness decay_
7. "HeadCount Portfolio is not a feature for me — it IS my job. If IRIS has it, I can finally do strategic HR work instead of data plumbing." — _INT-007, direct quote_
8. "I worry about the annual planning cycle. What normally takes 2 days becomes 2 weeks because the volume of data multiplies and the merge process doesn't scale." — _INT-007, seasonal scaling concern_
9. "Nobody in the planning team knows I exist. I consume their data silently. If they knew how their plans translate into hiring decisions, they might be more careful." — _INT-007, organizational invisibility_
10. "A world map showing staffing by site with real-time numbers — that's my dream deliverable. Today, I build it in PowerPoint with manually typed numbers." — _INT-007, visualization aspiration_

### FEELS

> What emotions drive their decisions? What worries or excites them?

1. **Anxious about accuracy** — triple-checks everything because errors directly influence multi-million dollar hiring decisions. The weight of downstream consequences is ever-present. — _INT-007, accuracy pressure_
2. **Exhausted by repetitive data merging** — the same 2-day merge process every month, with no end in sight until systems are integrated. Monotony compounds the fatigue. — _INT-007, repetitive burden_
3. **Undervalued** — her analytical insights are valuable, but the data preparation overhead makes her feel like a data clerk rather than a strategic HR partner. — _INT-007, role perception gap_
4. **Isolated from the planning team** — she consumes PM Planner data but doesn't participate in the planning process; her feedback loop is indirect and invisible. — _INT-007, organizational disconnect_
5. **Hopeful about HeadCount Portfolio** — Req 9 would directly address her core pain; she expressed genuine excitement when discussing the possibility. — _INT-007, feature anticipation_
6. **Overwhelmed during annual planning** — the 2-week annual planning cycle is a marathon of data merging, analysis, and reconciliation that pushes her to capacity. — _INT-007, seasonal stress_
7. **Frustrated by naming mismatches** — maintaining a 3-page lookup table to translate between system naming conventions feels like organizational negligence. — _INT-007, system integration failure_
8. **Proud of the quality of her analysis** — despite the primitive tools, she delivers accurate gap analyses that leadership relies on. The craft matters even when the process is broken. — _INT-007, professional pride_
9. **Fearful of errors going undetected** — with no validation mechanism beyond her own eyes, a merge error could propagate into hiring decisions unnoticed. — _INT-007, error anxiety_
10. **Motivated by the vision of integration** — can clearly articulate what her job should look like with proper tooling; the gap between vision and reality drives her. — _INT-007, aspirational clarity_

### SAYS

> What do they tell colleagues, managers, and project stakeholders?

1. "I'll have the headcount gap analysis ready by Thursday. I need to finish merging the data." — _INT-007, timeline communication_
2. "Can you check if PM Planner's team structure matches GHRP? I found three discrepancies in the naming." — _INT-007, naming verification request_
3. "The global staffing view in my PowerPoint is based on last month's data. Don't treat it as current." — _INT-007, freshness caveat_
4. "HeadCount Portfolio isn't a feature for me — it IS my job. If IRIS has it, I can finally do strategic HR work instead of data plumbing." — _INT-007, direct quote_
5. "I need access to both planned allocation and actual headcount in one system. Right now, I'm the bridge between two islands." — _INT-007, integration metaphor_
6. "If my gap analysis says 'hire 20 engineers for Pyeongtaek,' that triggers a recruitment process costing $200K per hire. An error in my Excel merge could mean $4M in misguided hiring." — _INT-007, stakes articulation_
7. "I'm a human SQL JOIN." — _INT-007, direct quote_
8. "Nobody on the planning team knows what I do with their data. There's no feedback loop." — _INT-007, visibility complaint_
9. "Annual planning is my nightmare. Everything I normally do in 2 days takes 2 weeks, and the merge process doesn't scale." — _INT-007, seasonal pain_
10. "Show me the gap, the trend, the recommendation. Don't make me calculate it from two separate exports." — _INT-007, integrated view demand_

### DOES

> What actions and behaviors do we observe?

1. Exports PM Planner data (planned allocation by project, team, time period) at the start of every month. — _INT-007, monthly extraction_
2. Exports GHRP data (actual headcount, hiring pipeline, attrition) separately. — _INT-007, parallel extraction_
3. Uses a 3-page naming convention lookup table to translate between PM Planner and GHRP organizational naming before merge. — _INT-007, naming translation_
4. Merges both datasets in Excel — row by row, column by column, reconciling naming differences manually. — _INT-007, manual merge process_
5. Identifies planned-vs-actual gaps and generates staffing recommendations with supporting analysis. — _INT-007, gap analysis_
6. Creates world map staffing views in PowerPoint with manually typed numbers for each Samsung DS site. — _INT-007, manual visualization_
7. Triple-checks all calculations before presenting — a single error could misdirect millions in hiring budget. — _INT-007, verification ritual_
8. Delivers monthly reports to HR leadership and Division Managers via email and face-to-face meetings. — _INT-007, report distribution_
9. Maintains historical archives of past gap analyses in Excel for trend comparison. — _INT-007, manual trend tracking_
10. Spends 2 full weeks during annual planning on what is essentially a scaled-up version of her monthly merge process. — _INT-007, seasonal scaling_

---

### SAYS vs. DOES Contradictions

| What They Say                           | What They Do                                                                                              | Insight                                                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| "HeadCount Portfolio IS my job"         | Spends 80% of her time on data extraction and merging, not portfolio management or strategic HR analysis  | The title "Portfolio Manager" describes her aspiration, not her reality. She is functionally a data integration specialist |
| "Don't treat my PowerPoint as current"  | Presents the same stale PowerPoint data in leadership meetings without pushing for real-time alternatives | She has accepted data staleness as normal rather than escalating it as a decision-quality risk                             |
| "I need planned vs. actual in one view" | Maintains two separate export-and-merge processes rather than advocating for system integration           | She has internalized the integration gap as her job rather than as a system failure to be fixed                            |

### #1 Emotional Pain

**Professional identity erosion.** Yuna's title is "HeadCount Portfolio Manager," but her actual work is "Human SQL JOIN." She spends 80% of her time on mechanical data extraction, naming translation, and manual merging — tasks that have nothing to do with HR strategy, workforce planning, or organizational insight. The emotional pain is not just about inefficiency; it is about a growing disconnect between who she trained to be (a strategic HR planner) and what the system forces her to do (a data clerk). Each monthly merge cycle reinforces this identity gap.

### CXO Design Implications

1. **HeadCount Portfolio as a dedicated IRIS module.** This is not an add-on feature — it is the entire value proposition for this persona. Planned allocation (from IRIS) alongside actual headcount (from GHRP) in a single integrated view.
2. **Automated GHRP/SMDM integration with standardized naming.** Eliminate the 3-page lookup table. IRIS must use canonical identifiers that map to both PM Planner legacy names and GHRP organizational names.
3. **World map visualization with live data.** Global staffing view by site (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung) with real-time planned vs. actual numbers. No more manually-typed PowerPoint.
4. **Gap trend analysis over time.** Show whether the gap between planned and actual headcount is growing, shrinking, or stable. Enable historical comparison.
5. **Staffing recommendation engine.** Based on gap data, suggest actions: hire, transfer, defer, contract. Move from data presentation to decision support.
6. **Feedback loop to planners.** Make the HR perspective visible to resource planners so they understand the downstream impact of their allocation decisions on hiring.

### Key Quotes

> "I'm a human SQL JOIN. PM Planner has the plan, GHRP has the actuals, and I sit in the middle with Excel, trying to match them up. Every month. For 200+ projects. It's soul-crushing."
> — _INT-007 (Yuna Han, Hwaseong)_

> "HeadCount Portfolio isn't a feature for me — it IS my job. Without it, I'm just an Excel operator."
> — _INT-007 (Yuna Han, Hwaseong)_

> "If my gap analysis says 'hire 20 engineers for Pyeongtaek,' that triggers a recruitment process costing $200K per hire. An error in my Excel merge could mean $4M in misguided hiring."
> — _INT-007 (Yuna Han, Hwaseong)_

---

## Cross-Map Analysis

### Shared Patterns Across All Archetypes

| Pattern                                              | Archetypes | Evidence                                                                                                                                                                                      |
| ---------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shadow systems everywhere**                        | All 4      | Planners: Excel workbooks, editing calendars. Managers: email approval archives, printed sheets. Analyst: personal ES cluster, Python notebooks. HR: 3-page lookup table, merged spreadsheets |
| **Trust in PM Planner is uniformly absent**          | All 4      | No persona trusts PM Planner to preserve data, track changes, provide timely information, or support their workflow                                                                           |
| **Data freshness is a universal concern**            | All 4      | Cross-site visibility (stale by days), PROMIS sync (stale by cycles), N-PLM master data (24-48h lag), executive reports (3-5 day staleness), HR data (monthly lag)                            |
| **Professional identity vs. tool reality**           | 3 of 4     | Planners are "detectives" instead of planners. Analyst is "data plumber" instead of data scientist. HR planner is "human SQL JOIN" instead of portfolio manager                               |
| **Manual processes substitute for missing features** | All 4      | Editing calendars (concurrency), email threads (approvals), Excel exports (versioning), CSV extraction (analytics), lookup tables (integration)                                               |

### Emotional Pain Hierarchy

| Rank | Archetype            | #1 Emotional Pain                                  | Systemic Root Cause                                       |
| ---- | -------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| 1    | Resource Planner     | Fear of data loss from concurrent overwrites       | No real-time collaboration or conflict resolution         |
| 2    | Approving Manager    | Accountability without governance control          | No workflow, no audit trail, no system-recorded approvals |
| 3    | Analytics User       | Wasted intellectual capacity on data plumbing      | No analytical layer, no API access, no report automation  |
| 4    | HR Portfolio Manager | Professional identity erosion from mechanical work | No system integration between planning and HR data        |

### Role-Based Experience Requirements

| Archetype            | Primary Interaction Model             | Key UX Requirement                                               |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| Resource Planner     | P/M editing grid + simulation sandbox | Real-time collaboration, version history, scenario comparison    |
| Approving Manager    | Dashboard + approval workflow         | Auto-diff, status tracking, over-allocation alerts               |
| Analytics User       | OLAP analytics + report builder       | Drag-and-drop dimensions, scheduled reports, NL querying         |
| HR Portfolio Manager | Integrated portfolio view + world map | Planned vs. actual overlay, gap trends, staffing recommendations |

**Critical insight**: A single-experience system will not serve Samsung DSR. IRIS must deliver 4 distinct role-based experiences built on a shared data layer.

### Design Priority Matrix

| IRIS Capability                                 | Planner  | Manager  | Analyst  | HR       | Priority |
| ----------------------------------------------- | -------- | -------- | -------- | -------- | -------- |
| Concurrent editing with conflict resolution     | Critical | —        | —        | —        | P0       |
| Version history with diff                       | High     | Critical | —        | —        | P0       |
| Approval workflow (draft/submit/review/approve) | Medium   | Critical | —        | —        | P0       |
| Simulation sandbox                              | Critical | Low      | —        | —        | P1       |
| Manager dashboard                               | —        | Critical | —        | —        | P1       |
| Over-allocation detection (cross-dept/site)     | Medium   | Critical | Medium   | Medium   | P1       |
| OLAP analytics (multi-dimensional)              | Low      | Medium   | Critical | —        | P1       |
| Report scheduling and auto-distribution         | —        | Medium   | Critical | Medium   | P2       |
| AI-based natural language querying              | —        | Low      | Critical | —        | P2       |
| HeadCount Portfolio (planned vs. actual)        | —        | —        | —        | Critical | P2       |
| GHRP/SMDM integration                           | —        | —        | —        | Critical | P2       |
| World map staffing visualization                | —        | Medium   | —        | Critical | P2       |
| Cross-site change feed                          | Critical | High     | Medium   | —        | P1       |
| Delta sync to PROMIS                            | High     | High     | —        | —        | P1       |
| Elasticsearch infrastructure                    | —        | —        | Critical | —        | P2       |

---

## Summary

These 4 empathy maps reveal a consistent pattern: PM Planner captures data but provides no intelligence, no collaboration, no governance, and no integration. Every persona has independently built shadow systems to compensate for the same fundamental deficiencies. The emotional toll is not just frustration with a bad tool — it is professional identity erosion. Planners who should be planning are instead coordinating save windows. Managers who should be governing are instead comparing spreadsheets. Analysts who should be generating insights are instead plumbing data pipelines. HR planners who should be strategizing are instead manually joining databases.

IRIS must not be "PM Planner but better." It must be an intelligent resource planning platform that serves each archetype's distinct needs through role-based experiences, built on a foundation of real-time collaboration, version control, governance workflows, and system integration.

---

## Related Documents

| Document        | Path                                                       | Relationship                  |
| --------------- | ---------------------------------------------------------- | ----------------------------- |
| AX Template     | `.ax/templates/T05_EMPATHY_MAP.md`                         | Template reference            |
| Reference Draft | `.command/000_init_project/output/D3_EMPATHY_MAPS_IRIS.md` | Initial reference material    |
| Research Plan   | `01_DISCOVER/d1-research-plan.md`                          | Interview planning            |
| Personas (next) | `01_DISCOVER/d4-personas.md`                               | Built from these empathy maps |

---

_AX Transformation Framework v2.0.0 — Amoza Production Team_
_"AI for Real Life. Real Impact."_
