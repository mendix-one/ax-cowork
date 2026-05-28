# Affinity Map — IRIS for Samsung DSR

> **AX Transformation Framework v2.0.0** | DISCOVER Phase — Deliverable D3a
> **Role**: CXO (User Experience, Empathy Mapping, Usability, Design)

---

## Metadata

| Field                 | Value                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------- |
| Project               | IRIS DISCOVER Phase — Resource Planning System New Build                              |
| Product               | IRIS (Intelligent Resources Information System) for Samsung DSR                       |
| Date                  | 2026-03-21                                                                            |
| Facilitator           | CXO — Amoza SWAT Team                                                                 |
| Participants          | CXO (lead), CPO, CAO, AI Production Team                                              |
| Duration              | 4 hours (2h extraction + 1.5h clustering + 0.5h synthesis)                            |
| Method                | Digital affinity mapping — silent clustering, group review, dot-voting prioritization |
| Number of Data Points | 148 observations extracted from 10 interviews                                         |
| Tool Used             | FigJam (digital sticky notes with color-coding by source)                             |

---

## Data Sources

| Source                                         | Type                                             | Count                      | Date Range               |
| ---------------------------------------------- | ------------------------------------------------ | -------------------------- | ------------------------ |
| User Interviews (INT-IRIS-001 to INT-IRIS-010) | Semi-structured 1:1 interviews (Five-Act Method) | 10 sessions across 7 roles | 2026-03-18 to 2026-03-22 |
| Samsung Requirements Document                  | Requirements specification (Req 0-12)            | 13 requirement groups      | 2026-03                  |
| Existing PM Planner Documentation              | System architecture, data model, process model   | 5 documents                | Pre-existing             |
| Screener Survey (D2a)                          | Online survey                                    | 15 responses               | 2026-03-15 to 2026-03-17 |

### Interview Coverage

| ID           | Role             | Site       | Key Pain Areas                                                       |
| ------------ | ---------------- | ---------- | -------------------------------------------------------------------- |
| INT-IRIS-001 | Senior Planner   | Hwaseong   | Concurrent editing, Excel simulation, P/M grid                       |
| INT-IRIS-002 | Planner          | Pyeongtaek | Version tracking, simulation abandonment, Gantt reuse                |
| INT-IRIS-003 | Overseas Planner | Austin     | Time zone conflicts, cross-site blindness, overnight overwrites      |
| INT-IRIS-004 | Planning Manager | Hwaseong   | Approval gaps, cross-department overlap, review overhead             |
| INT-IRIS-005 | Planning Manager | Pyeongtaek | PROMIS sync integrity, N-PLM delays, change management               |
| INT-IRIS-006 | Division Manager | Hwaseong   | Executive blindness, strategic scenario delays, cross-site questions |
| INT-IRIS-007 | HR Planner       | Hwaseong   | GHRP merge, naming conventions, portfolio view                       |
| INT-IRIS-008 | Resource Analyst | Hwaseong   | Reporting burden, personal ES cluster, multi-dimensional analysis    |
| INT-IRIS-009 | Site Admin       | Pyeongtaek | Factor control rigidity, reorg pain, role management                 |
| INT-IRIS-010 | System Engineer  | Hwaseong   | Infrastructure limits, ETL failures, migration strategy              |

---

## Theme Clusters

### Theme 1: Overwrite Anxiety

> The visceral fear of losing hours of work because another planner saved after you. Concurrent editing in PM Planner has no locking, no merge, no conflict detection — just last-write-wins. Planners have internalized this as an occupational hazard and built elaborate social protocols to cope.

| #   | Observation / Quote                                                                                                                                        | Source                    | Tags                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | --------------------------- |
| 1   | "I spent three hours entering P/M adjustments. My colleague saved five minutes before me. My three hours — gone."                                          | INT-001                   | [PAIN] [QUOTE] [EMOTION]    |
| 2   | Team maintains a shared "editing calendar" in Outlook to reserve time slots for editing specific projects — a social protocol to prevent technical failure | INT-001                   | [PAIN] [INSIGHT] [WORKFLOW] |
| 3   | Team loses 4-6 hours/week due to overwrite conflicts and editing calendar coordination overhead                                                            | INT-001                   | [PAIN] [METRIC]             |
| 4   | Overnight changes from Korea overwrite Austin planner's work with no notification — discovered only upon next login                                        | INT-003                   | [PAIN] [METRIC]             |
| 5   | 5+ hours/week lost to discovering and reconciling overnight changes at Austin site                                                                         | INT-003                   | [PAIN] [METRIC]             |
| 6   | Two departments allocate 80-100% of the same engineer simultaneously with no system detection or warning                                                   | INT-004                   | [PAIN] [INSIGHT]            |
| 7   | Multiple planners describe saving anxiety — "will my changes survive?" — a question that should never need asking                                          | INT-001, INT-002, INT-003 | [EMOTION] [PAIN]            |
| 8   | Time zone asymmetry (KST vs CST, 15-hour gap) amplifies conflict severity — Korean planners' end-of-day is Austin's start-of-day                           | INT-003                   | [INSIGHT] [PAIN]            |
| 9   | Planner opens PM Planner each morning and immediately exports to Excel "just in case" before making any changes                                            | INT-002                   | [PAIN] [WORKFLOW] [EMOTION] |
| 10  | Monthly reconciliation meeting (3-4 hours) to resolve cross-department overlaps using printed Excel sheets — a human conflict resolution layer             | INT-004                   | [PAIN] [WORKFLOW] [METRIC]  |

**Emotional signature**: Fear, resignation, distrust of the system. Planners treat data loss not as a bug but as an inevitability to be managed.

---

### Theme 2: Version Confusion

> "Which version is real?" — No per-project version history, no change tracking, no diff view. Planners resort to physical notebooks, Excel exports, and manual line-by-line comparison. The system offers only "current state" with no memory of how it got there.

| #   | Observation / Quote                                                                                                               | Source  | Tags                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------- |
| 1   | "Version management in PM Planner is a fiction. There's just 'current state' and whatever I wrote in my notebook."                | INT-002 | [PAIN] [QUOTE]               |
| 2   | 3 hours/week spent on manual version comparison — opening each project against Excel snapshots side by side                       | INT-002 | [PAIN] [METRIC]              |
| 3   | Planner maintains physical paper "version notebook" with timestamps and project IDs — analog version control for a digital system | INT-002 | [PAIN] [SURPRISE] [WORKFLOW] |
| 4   | Cannot distinguish draft from permanent versions — managers accidentally act on draft data that looks identical to finalized data | INT-004 | [PAIN] [INSIGHT]             |
| 5   | "What changed since the last version?" requires line-by-line Excel comparison — no system support whatsoever                      | INT-001 | [PAIN] [WORKFLOW]            |
| 6   | Planning Manager compares against personal Excel exports for approval review — 40% of review time consumed by manual comparison   | INT-004 | [PAIN] [METRIC]              |
| 7   | "Change log spreadsheet" — Pyeongtaek team maintains manual version control in a shared Excel file alongside PM Planner           | INT-005 | [PAIN] [WORKFLOW]            |
| 8   | Admin has separate "configuration change log" for tracking admin changes — a parallel audit trail outside the system              | INT-009 | [PAIN] [WORKFLOW]            |
| 9   | Want diff view: "Show me two versions side by side with changes highlighted — like Track Changes in Word"                         | INT-002 | [FEATURE]                    |
| 10  | Want explicit change tracking: "Who changed what, when, and why" — audit trail as a basic expectation                             | INT-005 | [FEATURE]                    |

**Emotional signature**: Frustration and incredulity. Users cannot believe a planning system has no version history. The notebook workaround is not creative — it is desperate.

---

### Theme 3: Manual Reporting Burden

> PM Planner is where data goes to hide. Getting it out for analysis, reporting, or decision-making requires manual extraction, Excel pivoting, and multi-day compilation cycles. Analysts spend 70% of their time on data wrangling, not analysis. The system was built for input, not output.

| #   | Observation / Quote                                                                                                                                      | Source  | Tags                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------- |
| 1   | "PM Planner is where data goes to hide. Getting it out is like performing an extraction."                                                                | INT-008 | [PAIN] [QUOTE]              |
| 2   | Weekly reporting cycle: 8-10 hours; 70% on data extraction and formatting, only 30% on actual analysis                                                   | INT-008 | [PAIN] [METRIC]             |
| 3   | Monthly comprehensive analysis: 3-4 full days of analyst time, repeated identically each month                                                           | INT-008 | [PAIN] [METRIC]             |
| 4   | "I am a human cron job. Every month, same reports, same recipients, built from scratch."                                                                 | INT-008 | [PAIN] [QUOTE]              |
| 5   | Senior Planner's "Oracle" Excel workbook — 45 tabs mirroring PM Planner data plus simulation models she built herself                                    | INT-001 | [PAIN] [SURPRISE] [INSIGHT] |
| 6   | "PM Planner is a data entry tool pretending to be a planning tool. Real planning I do in Excel."                                                         | INT-001 | [PAIN] [QUOTE]              |
| 7   | No multi-dimensional analysis in PM Planner — analyst builds pivot tables in Python/Excel to slice data by project, team, skill, and time                | INT-008 | [PAIN] [FEATURE]            |
| 8   | Analyst built personal Elasticsearch cluster on local machine to query PM Planner data 100x faster than official reporting                               | INT-008 | [SURPRISE] [INSIGHT]        |
| 9   | No scheduled report generation or auto-distribution — periodic reports are manually compiled and emailed to distribution lists                           | INT-008 | [PAIN] [WORKFLOW]           |
| 10  | Division Manager's information flow: PM Planner -> Excel -> PowerPoint -> meeting — data is always 3-5 days stale by the time it reaches decision-makers | INT-006 | [PAIN] [WORKFLOW]           |

**Emotional signature**: Weariness and wasted potential. The analyst knows he could deliver strategic value but is trapped in a data extraction loop. The 45-tab Excel workbook is a monument to unmet needs.

---

### Theme 4: Cross-Site Blindness

> Stakeholders at different Samsung DS sites (Hwaseong, Pyeongtaek, Austin, Xi'an) operate in information silos. No one can see another site's resource allocations in real time. Global views require days of manual compilation. Executive decisions are postponed because the data is not ready.

| #   | Observation / Quote                                                                                                             | Source  | Tags                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------- |
| 1   | "How many engineers are allocated to NAND development across all sites?" — this simple question takes 5 business days to answer | INT-006 | [PAIN] [QUOTE] [METRIC] |
| 2   | Monthly global resource summary: 40 person-hours to compile across 4 planners at 4 sites                                        | INT-006 | [PAIN] [METRIC]         |
| 3   | Austin planner cannot see Hwaseong/Pyeongtaek plans — relies on weekly 6 AM video call and shared spreadsheet                   | INT-003 | [PAIN] [WORKFLOW]       |
| 4   | Shared cross-site Excel spreadsheet is "always out of date by the time I open it"                                               | INT-003 | [PAIN] [INSIGHT]        |
| 5   | Shared resources over-allocated at 120% across sites — discovered only in monthly meeting, weeks after the conflict began       | INT-004 | [PAIN] [METRIC]         |
| 6   | HR Planner compiles global staffing view manually in PowerPoint — stale the moment it is saved                                  | INT-007 | [PAIN] [WORKFLOW]       |
| 7   | Executive decisions postponed because data compilation from all sites is not ready in time                                      | INT-006 | [PAIN] [INSIGHT]        |
| 8   | Decisions made in Hwaseong communicated in Korean — Austin site is "last to know" about resource changes                        | INT-003 | [PAIN] [SURPRISE]       |
| 9   | Want world map dashboard showing real-time resource distribution across all global sites with drill-down                        | INT-006 | [FEATURE]               |
| 10  | Want change feed: "Here's what changed across all sites since you last logged in" — a morning briefing view                     | INT-003 | [FEATURE]               |

**Emotional signature**: Isolation and powerlessness. Non-HQ sites feel structurally disadvantaged. The Division Manager feels blind — making resource decisions worth millions based on week-old PowerPoint slides.

---

### Theme 5: Master Data Drift

> Master data from N-PLM (organization structure, project info) frequently lags behind reality by 24-48 hours or more. New projects cannot start until sync completes. Plans reference teams and structures that no longer exist. The gap between organizational reality and system reality creates a constant undercurrent of data distrust.

| #   | Observation / Quote                                                                                                               | Source  | Tags              |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------- |
| 1   | N-PLM updates take 24-48 hours to reflect in PM Planner — new projects blocked until sync completes                               | INT-005 | [PAIN] [METRIC]   |
| 2   | New projects cannot start in PM Planner until N-PLM sync completes — 2-3 days lost waiting for master data                        | INT-005 | [PAIN] [METRIC]   |
| 3   | Team restructured 2 weeks ago but N-PLM still shows old organizational structure                                                  | INT-002 | [PAIN] [INSIGHT]  |
| 4   | Plans reference teams that technically no longer exist in master data — ghost teams in the system                                 | INT-002 | [PAIN]            |
| 5   | N-PLM sync format does not always match PM Planner's expected structure — 5-10 records require manual correction per monthly sync | INT-009 | [PAIN] [METRIC]   |
| 6   | 3-page lookup table required to translate naming conventions between PM Planner and GHRP — maintained manually                    | INT-007 | [PAIN] [SURPRISE] |
| 7   | Data format mismatches between PM Planner and GHRP create monthly reconciliation overhead of 4-8 hours                            | INT-007 | [PAIN] [WORKFLOW] |
| 8   | Want real-time N-PLM integration — not batch, not daily, real-time event-driven sync                                              | INT-005 | [FEATURE]         |
| 9   | Planner sometimes creates "placeholder projects" manually when N-PLM sync is delayed, then merges later — error-prone             | INT-002 | [PAIN] [WORKFLOW] |
| 10  | "We plan against a reality that the system doesn't know about yet" — organizational changes outpace data sync                     | INT-005 | [QUOTE] [INSIGHT] |

**Emotional signature**: Resignation and low-grade distrust. Users have learned that the system's organizational picture is always slightly wrong. They compensate by double-checking everything against informal channels.

---

### Theme 6: Approval Ambiguity

> PM Planner has no system-supported approval process. No draft/permanent distinction, no notification, no queue, no audit trail. Approval happens entirely through email and verbal communication. Plans that should be "under review" look identical to finalized plans. Accountability gaps emerge when things go wrong.

| #   | Observation / Quote                                                                                                                             | Source  | Tags                      |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------- |
| 1   | "My approval process: email saying 'please review,' I compare by eye, reply 'approved' by email. The system doesn't know any of this happened." | INT-004 | [PAIN] [QUOTE] [WORKFLOW] |
| 2   | No queue, no notification, no draft/permanent distinction in PM Planner — all data looks the same regardless of status                          | INT-004 | [PAIN]                    |
| 3   | Plans fall through the cracks — no systematic way to track which plans need review or are awaiting approval                                     | INT-004 | [PAIN] [INSIGHT]          |
| 4   | Manager accidentally bases staffing decision on draft data because it looks identical to finalized data — no visual distinction                 | INT-004 | [PAIN] [SURPRISE]         |
| 5   | No audit trail — cannot answer "who approved this?" when issues arise months later                                                              | INT-004 | [PAIN] [EMOTION]          |
| 6   | Want draft -> review -> approve -> permanent workflow with automatic notifications at each stage                                                | INT-004 | [FEATURE]                 |
| 7   | Want auto-email notification when a plan is submitted for approval — "I shouldn't have to remember to check"                                    | INT-005 | [FEATURE]                 |
| 8   | 6-8 hours/week on plan reviews; 40% of that time is manual comparison overhead, not actual review judgment                                      | INT-004 | [PAIN] [METRIC]           |
| 9   | "No approval button in PM Planner. Approval is a human process — email, conversation, handshake"                                                | INT-004 | [PAIN] [QUOTE]            |
| 10  | Planning manager requests read-only mode for submitted plans — prevent changes during review period                                             | INT-005 | [FEATURE]                 |

**Emotional signature**: Unease and lack of control. Managers feel they are governing a system that offers no governance tools. The informal email-based approval creates a sense of fragility — things work until they do not, and then no one can trace what happened.

---

### Theme 7: Integration Distrust

> Full sync to PROMIS sends all 200+ projects regardless of changes, wasting hours and introducing recalculation artifacts that confuse downstream systems. Finance teams spend days verifying whether "changes" are real or noise. The integration pipe works — but it has no filter.

| #   | Observation / Quote                                                                                                          | Source  | Tags                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------- |
| 1   | Full sync sends all 200+ projects to PROMIS; only 3 had actual changes — over 98% of transmitted data is unchanged           | INT-001 | [PAIN] [METRIC]           |
| 2   | PROMIS sync takes 4+ hours bi-weekly; delta sync estimated to reduce to 30 minutes                                           | INT-001 | [PAIN] [METRIC]           |
| 3   | "Full sync to PROMIS is not just wasteful — it's dangerous." Triggered false profit margin changes for 30+ projects          | INT-005 | [PAIN] [QUOTE] [SURPRISE] |
| 4   | Finance team spent 2 full days verifying that downstream "changes" were recalculation artifacts, not actual planning changes | INT-005 | [PAIN] [METRIC]           |
| 5   | PROMIS team asks planners after every full sync: "Which ones actually changed?" — defeating the purpose of automated sync    | INT-002 | [PAIN] [WORKFLOW]         |
| 6   | Delta sync is a correctness fix, not just efficiency — "Only sending changes means only real changes flow downstream"        | INT-005 | [INSIGHT] [QUOTE]         |
| 7   | Want automatic change detection: "Tag which projects changed so only those get sent to PROMIS"                               | INT-002 | [FEATURE]                 |
| 8   | Reverse sync (IRIS to N-PLM for confirmed plans) works well structurally — the pipe is fine, the filtering is the issue      | INT-005 | [INSIGHT] [REUSE]         |
| 9   | Downstream teams have learned to distrust sync outputs — they verify everything manually regardless                          | INT-005 | [PAIN] [EMOTION]          |
| 10  | "Every sync day is anxiety day for finance" — downstream impact of integration noise                                         | INT-005 | [QUOTE] [EMOTION]         |

**Emotional signature**: Distrust propagating downstream. The integration is not broken — it is noisy. And noise, in a financial system, erodes confidence across the entire chain.

---

### Theme 8: Factor Control Fragmentation

> Dimension-based filtering (factor control) is hardcoded, making Samsung's frequent organizational restructurings (2-3x/year) a multi-week administrative ordeal. During reconfiguration, users may see stale or incorrect filtered data. Access control is binary — "see everything" or "see nothing."

| #   | Observation / Quote                                                                                                            | Source  | Tags                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ------- | ----------------------- |
| 1   | "Every organizational restructuring is my nightmare. I spend 2-3 weeks updating factor control configurations."                | INT-009 | [PAIN] [QUOTE] [METRIC] |
| 2   | Factor control dimensions (site, team, group, function, stage, block) are hardcoded — adding or renaming requires code changes | INT-009 | [PAIN]                  |
| 3   | During 2-3 week reconfiguration period, planners may see stale or incorrect filtered data — they do not always know            | INT-009 | [PAIN] [METRIC]         |
| 4   | Samsung DS reorganizes 2-3 times per year — every reorg triggers the same painful multi-week cycle                             | INT-009 | [PAIN] [METRIC]         |
| 5   | User role management is too coarse — "see everything" or "see nothing," no granular site-based or team-based access            | INT-009 | [PAIN] [FEATURE]        |
| 6   | Want flexible dimension management — add, rename, merge, split dimensions in admin panel in minutes, not weeks                 | INT-009 | [FEATURE]               |
| 7   | Want site-based access control with granular role permissions — planner sees their site, manager sees their division           | INT-009 | [FEATURE]               |
| 8   | During reorg transition, some planners inadvertently plan against old organizational boundaries — errors compound              | INT-009 | [PAIN] [INSIGHT]        |
| 9   | Admin maintains separate documentation of all factor control configurations outside PM Planner — another shadow system         | INT-009 | [PAIN] [WORKFLOW]       |
| 10  | "The system is the last to know about a reorg. Everyone else adjusts in days. The system takes weeks."                         | INT-009 | [QUOTE] [INSIGHT]       |

**Emotional signature**: Burden and isolation. The Site Admin feels personally responsible for a systemic shortcoming. Every reorg is a solo endurance test with organization-wide consequences for failure.

---

### Theme 9: PM Planner Nostalgia

> Not everything about PM Planner is broken. Several UX patterns and architectural decisions are well-liked and should be preserved or evolved in IRIS. Users want evolution, not revolution. Familiarity reduces migration risk and adoption resistance.

| #   | Observation / Quote                                                                                                  | Source  | Tags                      |
| --- | -------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------- |
| 1   | P/M editing grid (cell-based month-by-month input) is intuitive, well-liked, and central to planners' daily workflow | INT-001 | [REUSE]                   |
| 2   | xDHTML Gantt chart for resource roadmap timeline visualization is useful and familiar — planners rely on it          | INT-002 | [REUSE]                   |
| 3   | Oracle 19c schema design is "reasonably well-structured for operational data" — sound foundation                     | INT-010 | [REUSE]                   |
| 4   | Data sync pipe structure from IRIS to N-PLM (confirmed plans) is architecturally sound — filtering is the only issue | INT-005 | [REUSE]                   |
| 5   | Basic user management interface (create users, assign roles) is adequate — needs extension, not replacement          | INT-009 | [REUSE]                   |
| 6   | Data model structure (org hierarchy, skill dimensions, PM values by month) is logically sound and well-understood    | INT-004 | [REUSE]                   |
| 7   | "Don't take away my grid. Just make it smarter." — planner values the editing paradigm but wants it enhanced         | INT-001 | [QUOTE] [REUSE]           |
| 8   | Planners are accustomed to keyboard-heavy navigation within the grid — IRIS should preserve keyboard shortcuts       | INT-002 | [REUSE] [INSIGHT]         |
| 9   | Color-coding conventions in PM Planner (red = over-allocated, green = available) are understood across all sites     | INT-003 | [REUSE]                   |
| 10  | "If IRIS looks completely different, you'll have a revolt. Keep the bones, fix the guts."                            | INT-004 | [QUOTE] [REUSE] [EMOTION] |

**Emotional signature**: Cautious protectiveness. Users have invested years learning PM Planner's quirks. They want their pain fixed, not their familiarity destroyed. The grid is "theirs" — they do not want it taken away.

---

### Theme 10: AI Curiosity & Skepticism

> AI-Based Reporting (Req 11) generates genuine interest from analytically-minded users but skepticism from planners who prioritize fixing fundamental workflow gaps first. Trust is the central concern — users want to understand how AI reaches its conclusions before acting on them.

| #   | Observation / Quote                                                                                                                  | Source           | Tags                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------------------- |
| 1   | Analyst sees AI as eliminating 70% of manual reporting work — enthusiastic about natural language queries                            | INT-008          | [FEATURE] [INSIGHT] |
| 2   | "Show me AI that explains itself. If it says 'allocate 30 engineers,' I need to see why."                                            | INT-001          | [QUOTE] [INSIGHT]   |
| 3   | Planners prioritize concurrent editing and version management over AI — "fix the basics first"                                       | INT-001, INT-002 | [INSIGHT]           |
| 4   | Division Manager interested in AI-generated trend analysis — "tell me what's changing before I have to ask"                          | INT-006          | [FEATURE]           |
| 5   | HR Planner wants AI to detect planned-vs-actual staffing anomalies automatically                                                     | INT-007          | [FEATURE]           |
| 6   | "AI is great for reports nobody asked for yet — the insights you didn't know you needed"                                             | INT-008          | [QUOTE] [INSIGHT]   |
| 7   | Skepticism about AI accuracy for resource planning — "one wrong recommendation and managers lose trust forever"                      | INT-004          | [EMOTION] [INSIGHT] |
| 8   | Want AI to suggest, not decide — keep human in the loop for all planning changes                                                     | INT-001, INT-004 | [FEATURE] [INSIGHT] |
| 9   | System Engineer notes AI features need proper data foundation first — ES cluster and analytics layer must exist before AI adds value | INT-010          | [INSIGHT]           |
| 10  | "I'd love AI that says 'three projects are competing for the same 5 engineers next quarter — here are your options'"                 | INT-006          | [QUOTE] [FEATURE]   |

**Emotional signature**: Intrigued but guarded. Users see AI's potential but have not yet earned trust. They want transparency (explainability), control (suggest, not decide), and sequencing (fix the foundation first). The analyst is the early adopter; planners are the cautious majority.

---

## Frequency x Severity Priority Matrix

> Themes ranked by combining frequency (how many interviews referenced the theme) and severity (business impact when the pain occurs). Frequency and severity scored 1-5.

| Rank | Theme                        | Frequency (of 10) | Freq Score | Severity | Sev Score | Combined | Rationale                                                                             |
| ---- | ---------------------------- | ----------------- | ---------- | -------- | --------- | -------- | ------------------------------------------------------------------------------------- |
| 1    | Overwrite Anxiety            | 8/10              | 5          | H        | 5         | 10       | Causes actual data loss; forces elaborate workarounds; highest emotional intensity    |
| 2    | Version Confusion            | 9/10              | 5          | H        | 5         | 10       | Universal pain; drives manual tracking overhead; blocks accountability and audit      |
| 3    | Manual Reporting Burden      | 8/10              | 5          | H        | 5         | 10       | 70% of analyst time on extraction; 45-tab shadow system; executives get stale data    |
| 4    | Cross-Site Blindness         | 8/10              | 5          | H        | 5         | 10       | 40 person-hours/month to compile global view; executive decisions delayed by days     |
| 5    | Integration Distrust         | 7/10              | 4          | H        | 5         | 9        | Beyond efficiency — causes data integrity issues; finance teams distrust sync outputs |
| 6    | Approval Ambiguity           | 6/10              | 3          | H        | 4         | 7        | No governance layer; draft/permanent confusion; accountability gaps                   |
| 7    | Master Data Drift            | 5/10              | 3          | M        | 4         | 7        | 24-48hr lag blocks new projects; plans reference ghost organizational structures      |
| 8    | Factor Control Fragmentation | 3/10              | 2          | H        | 5         | 7        | Few users affected but cascading impact — wrong filters mean wrong data for everyone  |
| 9    | AI Curiosity & Skepticism    | 7/10              | 4          | M        | 3         | 7        | High interest but lower urgency; requires data foundation; trust must be earned       |
| 10   | PM Planner Nostalgia         | 8/10              | 5          | L        | 2         | 7        | Positive signal; informs continuity strategy; reduces migration risk                  |

### Priority Tiers

**Tier 1 — Must Solve (Combined 9-10)**: Overwrite Anxiety, Version Confusion, Manual Reporting Burden, Cross-Site Blindness, Integration Distrust. These five themes represent existential pain — users have built entire parallel systems to cope. IRIS must eliminate the need for these workarounds.

**Tier 2 — Should Solve (Combined 7-8)**: Approval Ambiguity, Master Data Drift, Factor Control Fragmentation. These are governance and infrastructure gaps that amplify Tier 1 pain. Solving them prevents regression.

**Tier 3 — Enhance (Combined 6-7)**: AI Curiosity & Skepticism, PM Planner Nostalgia. These inform how IRIS is built (preserve familiar patterns, layer AI on a solid foundation) rather than what is built.

---

## Cross-Cutting UX Patterns

> Observations that span multiple themes and reveal deeper systemic issues.

### 1. The Shadow System Ecosystem

Every persona has built independent workarounds outside PM Planner — editing calendars (Theme 1), version notebooks (Theme 2), change log spreadsheets (Theme 2), 45-tab Excel workbooks (Theme 3), personal ES clusters (Theme 3), naming convention lookup tables (Theme 5), PowerPoint compilations (Theme 4), configuration documentation (Theme 8). These shadow systems collectively represent hundreds of hours of unproductive work per month and are the strongest possible validation that PM Planner serves less than half of its users' actual needs. _(Themes: 1, 2, 3, 4, 5, 8)_

### 2. The Trust Deficit

Planners do not trust PM Planner to preserve their work (concurrent save), track their changes (version management), provide accurate data (PROMIS sync artifacts), or reflect organizational reality (N-PLM lag). This deficit drives defensive behaviors: pre-save exports, triple-checking, personal backups, verbal confirmations. Trust is not a feature — it is the absence of accumulated negative experiences. IRIS must be designed so that users never need to ask "did it work?" _(Themes: 1, 2, 5, 7)_

### 3. The Data Compilation Tax

Multiple personas (Planner, Manager, Analyst, HR Planner, Division Manager) spend disproportionate time on data gathering, merging, and reconciliation rather than on analysis, planning, or decision-making. The Analyst spends 70% of time on extraction. The HR Planner spends 2 full days monthly on manual joins. The Division Manager waits 5 days for a cross-site answer. This is the highest-cost systemic issue — it turns knowledge workers into data plumbers. _(Themes: 3, 4, 5, 7)_

### 4. The Time Zone Multiplier

Every pain point is amplified for non-HQ sites (Austin, Xi'an). Concurrent editing becomes overnight overwrites. Cross-site visibility becomes structural information disadvantage. Approval delays become missed decision windows. Language barriers compound the problem — Korean-language change notes exclude English-speaking sites from the information flow. Non-HQ sites are not just inconvenienced — they are systematically disadvantaged. _(Themes: 1, 4, 6)_

### 5. The Governance Vacuum

PM Planner has no workflow layer. No drafts, no approvals, no audit trail, no notifications. Governance has been pushed entirely into informal channels — email, chat, phone calls, meetings. These channels are not auditable, not traceable, and not scalable. When something goes wrong, no one can reconstruct what happened. The governance vacuum creates risk that grows with organizational scale. _(Themes: 2, 6, 7)_

### 6. The Input-Output Asymmetry

PM Planner was designed for data input. It has reasonable data entry interfaces (the P/M grid, basic navigation). But it was never designed for data output — no reporting, no analytics, no dashboards, no cross-site views, no scenario comparison. Users pour data into PM Planner and then must extract it through manual export to do anything useful with it. IRIS must be as good at delivering insights as it is at collecting data. _(Themes: 3, 4, 9)_

---

## CXO Synthesis

### Emotional Patterns Across Personas

| Emotion                          | Expressed By                                         | Manifestation                                                                                       |
| -------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Fear / Anxiety**               | Planners (INT-001, 002, 003)                         | Saving anxiety, pre-save exports, editing calendars — fear of data loss drives defensive rituals    |
| **Frustration / Weariness**      | Analyst (INT-008), HR Planner (INT-007)              | Trapped in repetitive data wrangling; know they could deliver more value but the system prevents it |
| **Isolation / Powerlessness**    | Austin Planner (INT-003), Division Manager (INT-006) | Structurally cut off from information; decisions delayed or made with stale data                    |
| **Burden / Lone Responsibility** | Site Admin (INT-009)                                 | Every reorg falls on one person; weeks of solo reconfiguration with organization-wide consequences  |
| **Unease / Lack of Control**     | Planning Managers (INT-004, 005)                     | Governing a system that offers no governance tools; informal approval with no accountability        |
| **Cautious Protectiveness**      | All planners                                         | Want pain fixed but familiar patterns preserved; fear of losing what works alongside what does not  |
| **Guarded Curiosity**            | Analyst, Division Manager                            | See AI potential but need transparency and control; will not adopt what they cannot understand      |

### Behavioral Contradictions

1. **Users both love and hate PM Planner.** They value the P/M grid, Gantt chart, and familiar workflows (Theme 9) while simultaneously building elaborate systems to circumvent PM Planner's limitations (Themes 1-8). They want IRIS to feel familiar while solving everything that is broken — evolution, not revolution.

2. **Users demand real-time data but tolerate days-old information.** Cross-site and executive users want real-time dashboards (Theme 4) but have normalized working with 3-5 day stale PowerPoint slides. The gap between stated desire and tolerated reality suggests they will accept near-real-time (hourly refresh) if it is reliable, over theoretical real-time that is fragile.

3. **Users want automation but distrust autonomous action.** AI interest is high (Theme 10) but paired with insistence on human-in-the-loop control. Users want AI to surface patterns, not make decisions. This contradiction reflects a deeper pattern: years of system unreliability have made users reluctant to cede control to any automated process.

4. **Planners resist change but have already changed.** Every shadow system — the 45-tab workbook, the personal ES cluster, the version notebook — represents voluntary adoption of a new tool. Users are not change-resistant; they resist change that does not solve their actual problems.

### Unspoken Needs

These needs were not explicitly stated by interviewees but are strongly implied by the evidence:

1. **Psychological safety when saving.** Users need to know, without checking, that their work is safe. This means real-time conflict detection, auto-save, change merge, and undo — not just locking.

2. **Role-appropriate information density.** The Division Manager does not want the same interface as the Planner. IRIS needs at least three information layers: operational (planners), governance (managers), strategic (executives). Same data, different lenses.

3. **Organizational change resilience.** Samsung reorganizes 2-3x/year. IRIS must treat reorganization not as an exception but as a routine event — first-class support for structural changes that propagate instantly.

4. **Cross-system identity resolution.** The 3-page naming convention lookup table between PM Planner and GHRP is a symptom. IRIS needs a master entity resolution layer that maps identities across N-PLM, GHRP, SMDM, and PROMIS without manual translation.

5. **Proactive anomaly detection.** Users did not ask for alerts, but every persona described discovering problems too late — overnight overwrites, over-allocation, sync artifacts, stale data. IRIS should surface anomalies before users stumble on them.

6. **Graceful degradation of trust.** AI features should start with low-stakes, high-transparency use cases (anomaly highlighting, trend visualization) and earn trust before progressing to higher-stakes recommendations (resource optimization, scenario comparison). Trust is earned incrementally.

---

## Key Insights

### Insight 1

- **We observed**: 9 of 10 interviewees described some form of manual version tracking workaround — physical notebooks, Excel exports, change log spreadsheets, personal backup files.
- **We believe**: PM Planner's complete absence of version management has created a universal "shadow version control" ecosystem that consumes significant time and introduces risk of working on stale data.
- **This means**: IRIS must implement per-project version history with automatic change tracking, diff views, and audit trails as a core capability — not an add-on or Phase 2 feature. This maps to Samsung Req 1, 2, and 4.

### Insight 2

- **We observed**: The PROMIS full-sync process not only wastes 4+ hours bi-weekly but actively introduced false profit margin changes for 30+ projects, requiring 2 days of finance verification.
- **We believe**: Full sync is not merely inefficient — it is a data integrity threat. Sending unchanged data triggers unnecessary downstream recalculations that produce noise indistinguishable from real changes.
- **This means**: Delta sync (only changed projects) for IRIS-to-PROMIS integration is a correctness requirement, not an optimization. It must be a launch requirement for data integrity. Maps to Req 6.

### Insight 3

- **We observed**: Every persona type has built independent shadow systems outside PM Planner — editing calendars, version notebooks, personal ES clusters, 45-tab Excel workbooks, 3-page lookup tables, PowerPoint compilations.
- **We believe**: The breadth and sophistication of these workarounds proves that PM Planner satisfies less than half of its users' actual workflow needs. Users have effectively built a parallel planning infrastructure at enormous time cost.
- **This means**: IRIS feature requirements should be validated not just against stated needs but against the workarounds users have already built. If a shadow system exists, the corresponding IRIS feature is validated by default.

### Insight 4

- **We observed**: The Division Manager (INT-006) never opens PM Planner and makes resource allocation decisions worth millions based on PowerPoint slides that are 3-5 days stale. A simple cross-site question takes 5 business days and 40 person-hours to answer.
- **We believe**: PM Planner was designed for data entry, not for decision support. Executive users are completely unserved by the current system, creating a dangerous gap between data and decisions.
- **This means**: IRIS needs a role-based experience layer — operational views for planners, governance views for managers, strategic dashboards for executives. The world map (Req 7) and analysis views (Req 8) directly address executive blindness.

### Insight 5

- **We observed**: The Austin-based planner (INT-003) spends 5+ hours/week as a "morning detective" reconstructing overnight changes from Korean colleagues. Language barriers in change notes add friction. Austin is systematically "last to know."
- **We believe**: Time zone asymmetry does not just inconvenience overseas sites — it creates a structural information disadvantage. Non-HQ sites are systematically excluded from the real-time information flow.
- **This means**: IRIS must include a real-time change feed with structured, language-neutral change logging. Cross-site notification and change awareness should be a first-class feature, not an afterthought.

### Insight 6

- **We observed**: The HR Planner (INT-007) spends 2 full days monthly performing a manual data merge between PM Planner and GHRP, using a 3-page naming convention lookup table. Errors in this merge directly influence hiring decisions costing $200K per position.
- **We believe**: The gap between planned allocation (PM Planner) and actual staffing (GHRP) represents a high-stakes integration failure where manual merging introduces financial risk at scale.
- **This means**: IRIS HeadCount Portfolio (Req 9) must integrate directly with GHRP and SMDM, providing automated planned-vs-actual reconciliation with standardized entity resolution.

### Insight 7

- **We observed**: The Analyst (INT-008) built a personal Elasticsearch cluster on his local machine to query PM Planner data because the built-in reporting was inadequate and the official ES deployment was a single-node with frequent outages.
- **We believe**: User-built infrastructure workarounds are the strongest possible validation of unmet analytical needs. When users build their own database, the system has categorically failed at data delivery.
- **This means**: IRIS must have a proper ES cluster architecture (Req 12) as the foundation for in-system analytics (Req 10), with multi-dimensional OLAP-style query capabilities that eliminate the need for personal analytical environments.

### Insight 8

- **We observed**: Planning managers (INT-004, INT-005) spend 40% of their review time on manual comparison because PM Planner has no diff view, no draft/permanent distinction, and no approval workflow. Governance lives entirely in email.
- **We believe**: The absence of workflow in PM Planner forces governance into informal channels that are not auditable, not traceable, and create accountability gaps that grow with organizational scale.
- **This means**: IRIS must implement a complete governance layer: draft -> submit -> review (with auto-diff) -> approve/reject -> permanent. This is the management backbone of the entire system. Maps to Req 3.

### Insight 9

- **We observed**: Samsung DS reorganizes 2-3 times per year, and each reorganization requires 2-3 weeks of manual factor control reconfiguration by a single Site Admin. During this period, users may see incorrect filtered data without knowing it.
- **We believe**: Factor control rigidity is a multiplier problem — when dimensions change, every user's view is potentially wrong until reconfiguration is complete, and users cannot tell the difference.
- **This means**: IRIS must support dynamic dimension management where administrators can add, rename, merge, or split organizational dimensions through an admin interface with immediate propagation — minutes, not weeks.

### Insight 10

- **We observed**: Multiple interviewees positively mentioned specific PM Planner elements: the P/M editing grid, the Gantt chart, the Oracle schema, the N-PLM sync pipe, keyboard navigation, and color-coding conventions (red = over-allocated, green = available).
- **We believe**: PM Planner's UX patterns have become part of planners' muscle memory over years of daily use. Discarding familiar patterns creates unnecessary migration risk and user resistance.
- **This means**: IRIS should preserve proven UX patterns (cell-based P/M editing, Gantt visualization, keyboard shortcuts, color conventions) while rebuilding the workflow, version management, analytics, and governance layers around them. Continuity reduces adoption risk.

### Insight 11

- **We observed**: 5 of 10 interviewees have effectively abandoned PM Planner's simulation module and do all scenario planning in Excel. The simulation module is "basically dead" at Pyeongtaek.
- **We believe**: PM Planner's simulation was designed as an extension of data entry, not as a proper scenario planning tool. Users need isolated sandbox environments with cloning, comparison, and commit/discard workflows.
- **This means**: IRIS simulation (Req 1, F3) should be designed as a separate sandbox module — clone a roadmap, modify freely, compare multiple scenarios side by side, and commit only the chosen scenario back to the live roadmap.

### Insight 12

- **We observed**: AI-Based Reporting (Req 11) received enthusiastic response from the Analyst who sees it eliminating 70% of manual work, but lukewarm response from planners who want fundamental workflow fixes first. Skepticism centers on explainability and trust.
- **We believe**: AI reporting is a high-value but lower-urgency capability that requires both a solid data foundation and earned user trust. Deploying AI before fixing the basics would confirm users' skepticism.
- **This means**: AI features should be sequenced after the data foundation (ES cluster, analytics layer) and after core workflow improvements (concurrent editing, version management). Start with transparent, low-stakes AI use cases (anomaly highlighting, trend detection) to build trust before progressing to recommendations.

### Insight 13

- **We observed**: Every pain point documented in Themes 1-8 is amplified for non-HQ sites. Austin experiences overnight overwrites, language-barrier change notes, 6 AM coordination calls, and being "last to know" about decisions made in Korean.
- **We believe**: IRIS is being designed for a global organization, but PM Planner was designed for a single-site team. Global-first design is not a feature — it is an architectural requirement.
- **This means**: IRIS must be designed with multi-site, multi-timezone, multi-language awareness from the architecture level — not bolted on later. Time-zone-aware notifications, language-neutral structured data, and location-aware dashboards should be foundational.

---

## Next Steps

- [ ] Create empathy maps for 4 persona archetypes based on theme clusters (D3b)
- [ ] Develop 4 research-grounded personas from affinity clusters and empathy maps (D4)
- [ ] Draft 5 problem statements in POV format grounded in affinity themes (D5a)
- [ ] Score problem statements on validation scorecard (D5b)
- [ ] Share findings with Samsung DSR project sponsor for alignment
- [ ] Identify hypotheses to validate in DESIGN phase (T10 Hypothesis Cards)
- [ ] Archive raw interview data and recordings per Samsung data governance policy

---

## Related Documents

| Document               | Path                                                       | Relationship               |
| ---------------------- | ---------------------------------------------------------- | -------------------------- |
| T06 Template           | `.ax/templates/T06_AFFINITY_MAP.md`                        | Template reference         |
| D3 Reference           | `.command/000_init_project/output/D3_AFFINITY_MAP_IRIS.md` | Initial draft reference    |
| D3b Empathy Maps       | `01_DISCOVER/d3b-empathy-maps.md`                          | Next synthesis step        |
| D4 Personas            | `01_DISCOVER/d4-personas.md`                               | Informed by theme clusters |
| D5a Problem Statements | `01_DISCOVER/d5a-problem-statements.md`                    | Derived from key insights  |

---

_AX Transformation Framework v2.0.0 — Amoza SWAT Team_
_"AI for Real Life. Real Impact."_
