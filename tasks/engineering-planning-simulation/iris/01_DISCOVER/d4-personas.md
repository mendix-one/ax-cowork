# D4 User Personas — IRIS for Samsung DSR

> **AX Transformation Framework v2.0.0** | DISCOVER Phase | CXO-Owned Deliverable
>
> Personas are the design north star. Every screen, interaction, and feature priority traces back to these four people.

---

## Metadata

| Field           | Value                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Project         | IRIS DISCOVER Phase — Resource Planning System New Build                                          |
| Product         | IRIS (Intelligent Resources Information System) for Samsung DSR                                   |
| Persona Version | v1.0                                                                                              |
| Created         | 2026-03-21                                                                                        |
| Last Updated    | 2026-03-21                                                                                        |
| Author          | CXO (User Experience Lead)                                                                        |
| Research Base   | 10 interviews, 4 archetype empathy maps, affinity clustering                                      |
| Confidence      | Medium-High — grounded in direct user research; to be validated in DESIGN phase usability testing |

---

## How to Read These Personas

Each persona card contains:

1. **Header and Demographics** — who they are and where they sit in Samsung DS
2. **Goals and Frustrations** — what they want and what blocks them
3. **Daily Workflow Narrative** — their current-state experience with PM Planner
4. **Tools and Workarounds** — the shadow systems they have built
5. **IRIS Expectations** — what they need from the new system
6. **Key Quotes** — their voice, in their words
7. **Behavioral Attributes and Tech Savviness** — how they relate to technology
8. **Confidence Level per Attribute** — how well-evidenced each data point is
9. **CXO Design Implications** — what this persona means for UI/UX decisions

**Confidence ratings**: High = directly stated by 2+ interviewees; Medium = stated by 1 interviewee or inferred from consistent behavioral patterns; Low = extrapolated from limited data, needs validation.

---

## Persona 1: Jisoo Park — "The Operational Planner"

### Persona Header

| Field     | Value                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Name      | Jisoo Park — "The Operational Planner"                                                                                        |
| Photo     | [Placeholder: female, early 30s, business casual, dual monitors with Gantt charts and Excel visible, Samsung Hwaseong office] |
| Title     | Senior Resource Planner                                                                                                       |
| Age Range | 30-34                                                                                                                         |
| Type      | **PRIMARY PERSONA** — designs for Jisoo first, always                                                                         |

### Demographics

| Attribute         | Detail                                                           | Confidence |
| ----------------- | ---------------------------------------------------------------- | ---------- |
| Role / Title      | Senior Resource Planner                                          | High       |
| Division          | Memory (DRAM) — DDR5 and HBM4 projects                           | High       |
| Site              | Hwaseong (HQ), South Korea                                       | High       |
| Company           | Samsung Electronics — DS (Device Solutions) Research             | High       |
| Years at Samsung  | 8 years (6 in resource planning, 2 in semiconductor engineering) | High       |
| Team Size Managed | 40+ engineers across DDR5 and HBM4 projects                      | High       |
| Education         | B.S. Industrial Engineering, KAIST                               | Medium     |
| Reporting To      | Planning Manager (Minho Kim archetype), Memory division          | High       |
| Peer Group        | 7 other resource planners on her planning team                   | High       |

### Goals

1. **Eliminate concurrent editing conflicts permanently.** Jisoo manages resource plans across DDR5 and HBM4 projects and coordinates with 7 other planners. The current "editing calendar" workaround (a shared Google Sheet where planners reserve time slots) costs 4-6 hours/week and still fails. She needs real-time concurrent editing with conflict detection and auto-merge — the way Google Docs handles collaborative editing, but for P/M data grids. _(Cited by INT-001, INT-002, INT-003; severity 9/10)_ **[Confidence: High]**

2. **Track every change with per-project version history.** Currently, Jisoo compares plan versions by eye against personal Excel exports she saves at end-of-day. She wants automatic version history per project with visual diff view, change attribution (who changed what, when, why), and one-click rollback capability. _(Cited by INT-001, INT-002, INT-004, INT-005; severity 8/10)_ **[Confidence: High]**

3. **Run what-if simulations without risking live data.** All scenario planning currently happens in a 45-tab Excel workbook ("The Oracle") because PM Planner offers no safe sandbox. Jisoo wants simulation environments: clone a roadmap, modify freely, compare multiple scenarios side-by-side, and commit the winner or discard all. _(Cited by INT-001, INT-002; severity 8/10)_ **[Confidence: High]**

4. **Reduce PROMIS sync to changed projects only.** The current full sync sends 200+ projects bi-weekly regardless of changes, wasting 4+ hours and creating recalculation artifacts downstream. Delta sync would reduce this to approximately 30 minutes. _(Cited by INT-001, INT-005; severity 7/10)_ **[Confidence: Medium]**

### Frustrations

1. **Hours of work destroyed by concurrent save conflicts.** "I spent three hours on P/M adjustments. My colleague saved five minutes before me. My three hours — gone." This is the single most impactful pain point across all interviews. It has eroded trust in PM Planner and created a culture of defensive saving (every 10-15 minutes) and manual coordination overhead. _(INT-001; severity 9/10, frequency: daily)_ **[Confidence: High]**

2. **Manual version tracking wastes 3+ hours/week.** No diff view, no change log, no per-project history exists in PM Planner. Jisoo maintains personal Excel exports as version backups and compares by eye. Version management is "a fiction" in the current system. _(INT-001, INT-002; severity 8/10, frequency: daily)_ **[Confidence: High]**

3. **Simulation is only possible in Excel.** Setting up one what-if scenario takes a full day of manual Excel modeling. PM Planner's simulation module has been "basically dead" for over a year. Every "what if we move 20 engineers from Project A to B?" request means half a day in Excel. _(INT-001, INT-002; severity 8/10, frequency: weekly)_ **[Confidence: High]**

4. **Cross-site visibility is absent.** Jisoo cannot see what planners at Pyeongtaek, Austin, or Xi'an are allocating for shared resources. Over-allocation (120% of an engineer across sites) is only discovered during monthly reconciliation meetings — weeks too late. _(INT-001, INT-003; severity 7/10, frequency: daily)_ **[Confidence: High]**

### Daily Workflow Narrative (Current State)

Jisoo arrives at 8:30 AM at Samsung's Hwaseong campus and opens PM Planner on her primary monitor, Excel on her secondary monitor, and Microsoft Teams for communication. Her first action is to check the shared "editing calendar" — a Google Sheet where the 8-person planning team reserves time slots for editing specific projects. She confirms her allocated projects for the morning, then opens PM Planner to begin P/M data entry for 3 DDR5 development projects.

She saves every 10-15 minutes, driven by the fear that a colleague might overwrite her work. By mid-morning, she receives a request from a project manager: "Can you show me what happens if we shift 20 engineers from HBM4-Alpha to DDR5-Rev3?" She opens "The Oracle" — her personal 45-tab Excel workbook — clones the relevant data, and spends 3-4 hours building a manual scenario analysis.

After lunch, she receives a notification that PROMIS sync is scheduled for this afternoon. She verifies that only 3 of her projects have actual changes but knows all 200+ projects across the site will be synced anyway. She spends 30 minutes documenting which projects she changed in a shared "change log spreadsheet" so the PROMIS team knows which changes are real versus sync artifacts.

Before leaving at 7:00 PM, she exports her updated PM Planner data to Excel as a version backup — the only way to track what changed today versus yesterday. She has spent approximately 6 hours in PM Planner and 4 hours on workarounds that PM Planner should handle natively.

### Tools and Workarounds

| Tool / System                  | Purpose                                                        | Satisfaction (1-5) | Workaround?                                                  |
| ------------------------------ | -------------------------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| PM Planner (Mendix 9)          | P/M data entry, resource roadmaps, Gantt views                 | 2                  | No — primary system                                          |
| Microsoft Excel ("The Oracle") | Version backups, simulation models, cross-references           | 2                  | Yes — compensates for missing version control and simulation |
| Shared Google Sheet            | "Editing calendar" — reserve PM Planner editing slots          | 1                  | Yes — compensates for missing concurrent editing             |
| Microsoft Teams / Email        | Approval requests, change notifications, conflict coordination | 2                  | Yes — compensates for missing workflow                       |
| N-PLM (read-only)              | Master data reference — project info, org structure            | 3                  | No — reference system                                        |
| PROMIS (sync target)           | Profit management — receives plan data from PM Planner         | 2                  | No — downstream system                                       |

### IRIS Expectations

- **Real-time concurrent editing** with visible collaborator presence (cursors, active cell indicators) and automatic conflict resolution — the Google Docs model applied to planning data grids
- **Automatic version history** with visual diff view, change attribution, and one-click rollback per project
- **Simulation sandbox** where she can clone, modify, compare, and commit/discard scenarios without touching live data
- **Cross-site resource visibility** showing allocation across Hwaseong, Pyeongtaek, Austin, and Xi'an in a single view
- **Delta sync to PROMIS** — only changed projects sync, eliminating artifact noise
- **Gantt view that is at least as capable** as PM Planner's current Gantt — this is her primary working interface and any regression would block adoption

### Key Quotes

> "I spent three hours entering detailed P/M adjustments for a critical DDR5 project. My colleague saved her changes to the same plan five minutes before me. My three hours of work — gone. No warning, no merge, just gone."
> — INT-IRIS-001

> "PM Planner is a data entry tool pretending to be a planning tool. Real planning — simulation, optimization, trade-off analysis — I do all of that in Excel."
> — INT-IRIS-001

> "If someone else is editing the same project, show me immediately. Don't wait until save time. Let me see their cursor, their changes, in real time — like Google Docs."
> — INT-IRIS-001

### Tech Savviness

| Dimension           | Rating   | Evidence                                                              |
| ------------------- | -------- | --------------------------------------------------------------------- |
| Overall             | **High** | Power user of PM Planner Gantt; builds complex 45-tab Excel models    |
| Tool Adoption       | High     | Learns new tools quickly if they prove value                          |
| Data Literacy       | High     | Understands data structures, can build cross-references               |
| Technical Curiosity | Medium   | Not interested in technology for its own sake — wants tools that work |

### Behavioral Attributes

| Attribute            | Value                                                                     | Confidence |
| -------------------- | ------------------------------------------------------------------------- | ---------- |
| Tech Savviness       | High — power user of PM Planner Gantt and complex Excel                   | High       |
| Decision-Making Role | End User + Influencer — creates plans, influences adoption                | High       |
| Risk Tolerance       | Low — years of data loss made her defensive                               | High       |
| Change Readiness     | High — deeply frustrated, eager for improvement, but trust must be earned | High       |
| Information Sources  | Samsung internal knowledge sharing, peer planner recommendations          | Medium     |

### Personality Traits

- **Meticulous** — catches data discrepancies others miss; builds extensive cross-checks
- **Collaborative** — coordinates actively with 7 other planners despite system friction
- **Pragmatic** — values reliability over features; tools that work over tools that look good
- **Resilient** — has adapted to PM Planner's failures for 8 years through sophisticated workarounds
- **Protective of expertise** — "The Oracle" represents years of accumulated knowledge; wants IRIS to complement, not discard, her methods

### Scenario: A Day in the Life

It is Tuesday at 10:15 AM, and Jisoo has just finished entering P/M data for 3 DDR5 projects when she notices her colleague Jihyun's name on the editing calendar for HBM4-Alpha — the same project Jisoo needs to update with revised timeline data from the project manager. She messages Jihyun on Teams: "When will you be done with HBM4-Alpha?" Jihyun responds: "30 more minutes." Jisoo waits, opens The Oracle, and starts building a scenario analysis her manager requested yesterday. At 10:50, Jihyun confirms she is done. Jisoo opens the project in PM Planner, makes her updates, saves successfully, and exhales. She then spends 15 minutes manually documenting what she changed in the shared change log. It is 11:10 AM. She has accomplished 20 minutes of actual planning work in the last hour. The rest was coordination overhead.

### Research Basis

| Source Type       | Reference                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Interview IDs     | INT-IRIS-001 (primary anchor), INT-IRIS-002, INT-IRIS-003                                 |
| Empathy Map       | Archetype 1: Resource Planner                                                             |
| Affinity Themes   | Themes 1 (concurrent editing), 2 (version void), 5 (Excel dependency), 8 (simulation gap) |
| Artifact Analysis | "The Oracle" workbook, editing calendar, version backup exports                           |

### CXO Design Implications

| Implication                                        | Design Decision                                                                                                                                                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gantt is the primary workspace**                 | IRIS must lead with a Gantt-based planning view that is at minimum feature-parity with PM Planner. Any regression in Gantt capability will block adoption by the primary persona.                                         |
| **Concurrent editing is table stakes**             | Real-time presence indicators (collaborator cursors, active cells) must be visible in the data grid. Conflict resolution must be automatic with manual override. This is not a feature — it is the minimum bar for trust. |
| **Version history must be visible and effortless** | Diff view accessible from every project with one click. Change attribution (who, what, when) must be scannable without opening a separate screen. Rollback must be reversible (undo the undo).                            |
| **Simulation must feel safe**                      | Visual distinction between live data and sandbox data must be unmistakable (color coding, banner, separate tab). Users must never accidentally commit simulation data to production.                                      |
| **Save anxiety must be eliminated**                | Auto-save with conflict detection replaces manual save-and-pray. The system must never silently overwrite another user's work.                                                                                            |
| **Power users need keyboard shortcuts**            | Jisoo spends 6+ hours/day in the system. Efficiency features (keyboard navigation, bulk operations, quick filters) directly impact her productivity.                                                                      |

---

## Persona 2: Minho Kim — "The Governance Leader"

### Persona Header

| Field     | Value                                                                                                                |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Name      | Minho Kim — "The Governance Leader"                                                                                  |
| Photo     | [Placeholder: male, early 40s, business formal, Samsung conference room with whiteboard behind, Hwaseong/Pyeongtaek] |
| Title     | Planning Manager                                                                                                     |
| Age Range | 38-42                                                                                                                |
| Type      | **SECONDARY PERSONA** — design must serve Minho without compromising Jisoo                                           |

### Demographics

| Attribute         | Detail                                                                       | Confidence |
| ----------------- | ---------------------------------------------------------------------------- | ---------- |
| Role / Title      | Planning Manager                                                             | High       |
| Division          | Memory (DRAM/NAND oversight)                                                 | High       |
| Site              | Hwaseong (HQ), previously Pyeongtaek — represents managers across both sites | High       |
| Company           | Samsung Electronics — DS Research                                            | High       |
| Years at Samsung  | 12 years (8 as Planning Manager, 4 in semiconductor planning)                | High       |
| Team Size Managed | 3 planning teams, ~30 planners total                                         | High       |
| Education         | M.S. Management Engineering, Seoul National University                       | Medium     |
| Reporting To      | Division Manager                                                             | High       |

### Goals

1. **Implement formal approval workflow in-system.** Minho reviews and approves P/M plans via email with no system record. He needs a draft -> submit -> review (with auto-diff) -> approve/reject -> finalize workflow with notifications, comments, and a permanent audit trail. _(Cited by INT-004, INT-005; severity 8/10)_ **[Confidence: High]**

2. **Distinguish draft from approved versions instantly.** Planners save work-in-progress that looks identical to finalized plans. Minho has based decisions on draft data because there was no visual distinction. He needs clear status indicators: Draft / Submitted / Under Review / Approved / Rejected. _(Cited by INT-004; severity 7/10)_ **[Confidence: High]**

3. **Detect cross-department over-allocation automatically.** Two departments sometimes allocate 80-100% of the same engineer. This is currently discovered only during a monthly 3-4 hour reconciliation meeting with printed Excel sheets. He needs real-time alerts when total allocation exceeds thresholds. _(Cited by INT-004; severity 6/10)_ **[Confidence: High]**

4. **Provide cross-site resource dashboards for division leadership.** The Division Manager's question — "How many engineers are allocated to DRAM across all sites?" — currently takes 5 business days and 40 person-hours to answer. A live dashboard would eliminate this entirely. _(Cited by INT-006; severity 7/10)_ **[Confidence: Medium]**

### Frustrations

1. **No system-supported approval process.** "My approval process is email saying 'please review,' compare by eye, reply 'approved.' The system does not know I approved anything." There is no audit trail, no accountability, and no way to verify which version was actually approved. _(INT-004; severity 8/10, frequency: weekly)_ **[Confidence: High]**

2. **Cannot distinguish draft from final versions.** Planners save work-in-progress that is indistinguishable from finalized plans. Minho has approved draft data thinking it was final, and has also delayed approvals because he could not tell if a plan was ready for review. _(INT-004; severity 7/10, frequency: weekly)_ **[Confidence: High]**

3. **Manual cross-site compilation takes 40 person-hours.** Compiling a global resource summary for the Division Manager requires planners at each site to export, standardize, and merge data manually. The result is 3-5 days stale by presentation time. _(INT-006; severity 7/10, frequency: monthly)_ **[Confidence: High]**

4. **PROMIS sync creates downstream confusion.** Full sync triggers recalculation artifacts that the finance team spends 2 days verifying. This erodes trust between planning and finance teams. _(INT-005; severity 9/10, frequency: bi-weekly)_ **[Confidence: Medium]**

### Daily Workflow Narrative (Current State)

Minho arrives at 9:00 AM and starts with email — scanning for plan review requests from his planners. On a typical day, 2-3 plans are submitted for review via email or Teams message. For each, he opens PM Planner to view the current state, then opens his personal Excel archive to find the previous approved version. He places the two windows side by side and compares cell by cell, noting changes in a personal tracking sheet. The comparison process takes 30-45 minutes per plan.

He replies to the planner via email: "Approved" or "Please revise [specifics]." There is no system record of this approval. If someone asks in three months which version he approved, he must search through email history and hope he can reconstruct the answer.

By mid-morning, he attends a cross-departmental coordination meeting where he discovers that two of his groups have allocated 150% of the same senior engineer. He escalates to the engineer's direct manager. After lunch, he receives a request from the Division Manager for a cross-site resource summary. He delegates to two planners who will spend the next 2 days compiling data from Hwaseong, Pyeongtaek, Austin, and Xi'an.

Late afternoon is reserved for the monthly reconciliation meeting — 3-4 hours of resolving overlapping allocations using printed Excel sheets spread across a conference room table. He leaves at 7:30 PM, knowing the cross-site summary will be 3 days stale by the time it reaches the Division Manager.

### Tools and Workarounds

| Tool / System          | Purpose                                    | Satisfaction (1-5) | Workaround?                            |
| ---------------------- | ------------------------------------------ | ------------------ | -------------------------------------- |
| PM Planner (view only) | Review submitted plans                     | 2                  | No                                     |
| Microsoft Excel        | Personal archive of approved plan versions | 2                  | Yes — manual audit trail               |
| Email / Teams          | Approval communication, escalation         | 2                  | Yes — replaces missing workflow        |
| PowerPoint             | Cross-site summary presentations           | 2                  | Yes — static snapshots of dynamic data |
| Printed Excel sheets   | Monthly reconciliation meeting             | 1                  | Yes — physically comparing allocations |

### IRIS Expectations

- **Formal approval workflow**: draft -> submit -> review -> approve/reject with system-recorded audit trail
- **Auto-diff on review**: when a plan is submitted, show Minho exactly what changed since the last approved version — highlighted, scannable, with change attribution
- **Status badges**: clear visual indicators on every plan (Draft, Submitted, Under Review, Approved, Rejected) visible in list views and detail views
- **Over-allocation alerts**: real-time detection when any engineer exceeds 100% allocation across departments or sites, with drill-down to see which plans conflict
- **Cross-site dashboard**: live aggregate view of resource allocation by site, division, project type, and time period — answering the Division Manager's questions in seconds rather than days
- **Notification system**: alerts when plans are submitted for review, when approvals are pending, and when over-allocation is detected

### Key Quotes

> "My approval process is: someone sends me an email saying 'please review Project X.' I open PM Planner, open my previous Excel export, compare by eye, and then reply 'approved' by email. The system does not know I approved anything."
> — INT-IRIS-004

> "I manage the planning process, but the system does not help me manage. It is a data store, not a management tool. I need workflow, notifications, approvals, dashboards — things a manager actually uses."
> — INT-IRIS-004

> "Which version did I approve? I honestly cannot answer that question with certainty. I would have to search through three months of email to reconstruct it."
> — INT-IRIS-004

### Tech Savviness

| Dimension           | Rating      | Evidence                                                                      |
| ------------------- | ----------- | ----------------------------------------------------------------------------- |
| Overall             | **Medium**  | Proficient with Excel and Samsung tools; not a power user                     |
| Tool Adoption       | Medium      | Will adopt tools that clearly support his management workflow                 |
| Data Literacy       | Medium-High | Understands planning data deeply; less comfortable with raw data manipulation |
| Technical Curiosity | Low-Medium  | Cares about outcomes, not technology — wants it to "just work"                |

### Behavioral Attributes

| Attribute            | Value                                                                                 | Confidence |
| -------------------- | ------------------------------------------------------------------------------------- | ---------- |
| Tech Savviness       | Medium — proficient with standard tools, not a power user                             | High       |
| Decision-Making Role | Decision Maker + Influencer — approves plans, recommends tools to division leadership | High       |
| Risk Tolerance       | Low — accountable for plan quality; needs governance tools                            | High       |
| Change Readiness     | High — deeply frustrated with governance vacuum                                       | High       |
| Information Sources  | Division leadership guidance, Samsung internal processes                              | Medium     |

### Personality Traits

- **Systematic** — values process, structure, and accountability above all
- **Diplomatic** — resolves cross-department conflicts through negotiation, not authority
- **Accountable** — takes personal responsibility for plan quality despite having no system tools to enforce it
- **Process-oriented** — his frustration is not with the work itself but with the absence of proper tools to do it

### Scenario: A Day in the Life

It is Wednesday afternoon, and Minho has just received the Division Manager's quarterly question: "What is our total DRAM engineering allocation across all sites for Q3?" He knows the answer requires data from four sites, compiled by different planners using different Excel formats. He assigns two planners to the task, estimating 2 days of work. Meanwhile, he opens an email from a planner requesting approval on an updated HBM4 resource plan. He opens PM Planner, finds the current plan, and opens his Excel archive to locate the previous version he approved two months ago. He finds three Excel files with similar dates and is not sure which one represents the version he actually approved. He picks the most likely one and begins comparing cell by cell. Twenty minutes later, he realizes this is the wrong version — it contains changes he rejected. He searches his email for the approval confirmation, finds it, cross-references the date, and locates the correct file. The comparison can now begin. It is 3:15 PM. He has not yet started the actual review.

### Research Basis

| Source Type     | Reference                                                                                |
| --------------- | ---------------------------------------------------------------------------------------- |
| Interview IDs   | INT-IRIS-004 (primary anchor), INT-IRIS-005, INT-IRIS-006                                |
| Empathy Map     | Archetype 2: Planning Manager                                                            |
| Affinity Themes | Themes 6 (approval absence), 4 (cross-site blindness), 2 (version void), 3 (PROMIS sync) |

### CXO Design Implications

| Implication                                                   | Design Decision                                                                                                                                                                                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Manager view is fundamentally different from planner view** | Minho does not edit plans — he reviews, compares, and approves. His primary interface should be a dashboard with pending reviews, over-allocation alerts, and cross-site summaries. Do not force him through the planner's data entry interface. |
| **Auto-diff must be the default review experience**           | When Minho opens a submitted plan, the system should immediately show what changed since the last approved version. Side-by-side diff with color-coded additions, deletions, and modifications.                                                  |
| **Status must be visible everywhere**                         | Plan status (Draft/Submitted/Approved/Rejected) must appear in list views, search results, and detail headers. It must be impossible to confuse a draft with an approved plan.                                                                   |
| **Approval actions must be one-click**                        | Approve, Reject (with required comment), and Request Changes buttons must be prominent on the review screen. No navigating to a separate workflow module.                                                                                        |
| **Over-allocation alerts must be proactive**                  | Do not wait for Minho to look for conflicts. Surface them as notifications, dashboard alerts, and inline warnings on affected plans.                                                                                                             |

---

## Persona 3: Eunji Lee — "The Intelligence Architect"

### Persona Header

| Field     | Value                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| Name      | Eunji Lee — "The Intelligence Architect"                                                                                  |
| Photo     | [Placeholder: female, late 20s, smart casual, data dashboard and Jupyter notebook visible on monitors, Pyeongtaek office] |
| Title     | Analytics Specialist                                                                                                      |
| Age Range | 28-32                                                                                                                     |
| Type      | **SECONDARY PERSONA** — IRIS analytics must serve Eunji without overcomplicating the planner/manager experience           |

### Demographics

| Attribute        | Detail                                                                                  | Confidence |
| ---------------- | --------------------------------------------------------------------------------------- | ---------- |
| Role / Title     | Analytics Specialist / Planning Analyst                                                 | High       |
| Division         | Resource Analytics team — serves all Samsung DS divisions (Memory, System LSI, Foundry) | High       |
| Site             | Pyeongtaek, South Korea                                                                 | High       |
| Company          | Samsung Electronics — DS Research                                                       | High       |
| Years at Samsung | 5 years in planning analytics                                                           | High       |
| Team Size        | 3-person analytics team serving all Samsung DSR divisions                               | High       |
| Education        | M.S. Statistics, Yonsei University                                                      | Medium     |
| Reporting To     | Planning Manager, Planning Analytics department                                         | High       |

### Goals

1. **Invert the analysis ratio: 70% insight, 30% preparation.** Currently the ratio is inverted — 70% of her week is consumed by extracting data from PM Planner, cleaning it, and transforming it. She wants in-system multi-dimensional analysis (MDA) that eliminates the extraction step entirely. _(Cited by INT-008; severity 9/10)_ **[Confidence: High]**

2. **Slice resource data across multiple dimensions simultaneously.** Site, division, project type, function, stage, team, time period — all filterable and cross-tabulatable without writing Python code or building Excel pivot tables. Self-service analytics, not report requests. _(Cited by INT-008; severity 8/10)_ **[Confidence: High]**

3. **Automate the 5 recurring monthly reports.** The same reports to the same 20 stakeholders in the same format should be scheduled, generated, and distributed automatically. Eunji should only intervene when insights require human interpretation. _(Cited by INT-008; severity 7/10)_ **[Confidence: High]**

4. **Leverage AI for natural language analytics.** Query resource data conversationally: "Show me Q2 DRAM utilization by site, excluding dropped projects." This depends on proper data infrastructure (Req 10, Req 12) being in place first. _(Cited by INT-008; severity conditional)_ **[Confidence: Medium]**

### Frustrations

1. **PM Planner reporting is nearly non-existent.** Built-in reports are "basic data dumps" with no pivot capability, no cross-dimensional analysis, no charts, no trend lines. Everything must be exported and processed externally. _(INT-008; severity 9/10, frequency: daily)_ **[Confidence: High]**

2. **70% of time spent on data plumbing.** The pipeline is: export CSV from PM Planner -> clean in Python -> merge with N-PLM and GHRP data -> transform -> analyze -> visualize -> format for PowerPoint. Only the analysis and visualization steps are her actual job. _(INT-008; severity 9/10, frequency: daily)_ **[Confidence: High]**

3. **Single-node Elasticsearch with recurring outages.** The official ES deployment goes down approximately 3 times per year. Eunji built a personal ES cluster on her laptop as a workaround — "rogue infrastructure" that works but should not be necessary. _(INT-008, INT-010; severity 7/10)_ **[Confidence: High]**

4. **Reports are always stale by delivery.** By the time data is extracted, analyzed, formatted, and distributed, it is 3-5 days old. Executives consuming the reports may not realize they are looking at last week's reality. _(INT-008, INT-006; severity 7/10)_ **[Confidence: High]**

### Daily Workflow Narrative (Current State)

Eunji arrives at 9:00 AM at Samsung's Pyeongtaek campus and begins her weekly analysis cycle by exporting PM Planner data to CSV — a process that takes 20-30 minutes depending on data volume. She imports the CSV into her Jupyter notebook environment, where she runs Python scripts to clean, transform, and merge the data with N-PLM (project master data) and GHRP (actual headcount) exports. This preparation phase typically takes 3-4 hours.

By early afternoon, she begins the actual analysis — building multi-dimensional cross-tabulations, generating visualizations, and identifying anomalies (a team allocated at 140%, a project with zero resources assigned, a site trending toward capacity). She uses her personal Elasticsearch cluster for fast ad-hoc queries that would take hours against PM Planner's database directly.

By late afternoon, she is formatting results for stakeholder consumption — converting Jupyter outputs to Excel and PowerPoint. On the last week of each month, she dedicates 3-4 full days to compiling the 5 standard monthly reports. She manually emails each report to 20 stakeholders, adjusting format and emphasis for different audiences: executive summary for the Division Manager, detailed breakdown for Planning Managers, gap analysis for HR.

She spends approximately 60% of her working time in Excel pivot tables. She wishes every month that the system could just generate these reports itself.

### Tools and Workarounds

| Tool / System            | Purpose                                                | Satisfaction (1-5) | Workaround?                                                     |
| ------------------------ | ------------------------------------------------------ | ------------------ | --------------------------------------------------------------- |
| PM Planner (export only) | Source of raw planning data — CSV export               | 1                  | No — but used only as data source                               |
| Python / Jupyter         | Data transformation, analysis, visualization           | 4                  | Yes — compensates for missing in-system analytics               |
| Personal Elasticsearch   | Fast ad-hoc queries against 2 years of historical data | 4                  | Yes — rogue infrastructure compensating for infrastructure gaps |
| Microsoft Excel          | Report formatting, pivot table delivery                | 3                  | Partial — delivery vehicle                                      |
| PowerPoint               | Executive presentation formatting                      | 2                  | Yes — static snapshots of dynamic data                          |

### IRIS Expectations

- **In-system multi-dimensional analysis (MDA)**: slice and dice resource data by any combination of site, division, project, function, team, time period — without exporting
- **Interactive dashboards**: drill-down from high-level KPIs to individual project and engineer-level detail
- **Automated report generation and distribution**: schedule the 5 monthly reports, generate them automatically, distribute to the right stakeholders in the right format
- **Proper Elasticsearch cluster**: production-grade, multi-node ES infrastructure — not a single node that goes down 3 times a year
- **API access for advanced analytics**: for cases where in-system analytics are insufficient, provide clean API endpoints so Python/Jupyter workflows connect directly rather than going through CSV export
- **AI-powered natural language queries** (future): conversational data exploration for non-technical stakeholders

### Key Quotes

> "PM Planner is where data goes to hide. Getting it out is like performing an extraction."
> — INT-IRIS-008

> "I am a human cron job. Every month, same reports, same recipients, same format, but I have to build them from scratch because PM Planner has no report scheduling."
> — INT-IRIS-008

> "I spend 60% of my time in Excel pivot tables. That is not analytics — that is data plumbing."
> — INT-IRIS-008

### Tech Savviness

| Dimension           | Rating    | Evidence                                                         |
| ------------------- | --------- | ---------------------------------------------------------------- |
| Overall             | **High**  | Excel power user, learning Python, SQL, Elasticsearch            |
| Tool Adoption       | Very High | Built personal ES infrastructure; eager for new analytical tools |
| Data Literacy       | Very High | Statistical background; thinks in dimensions and aggregations    |
| Technical Curiosity | Very High | Actively learning data tools; excited about AI analytics         |

### Behavioral Attributes

| Attribute            | Value                                                                  | Confidence |
| -------------------- | ---------------------------------------------------------------------- | ---------- |
| Tech Savviness       | High — Excel power user, Python, SQL, Elasticsearch                    | High       |
| Decision-Making Role | Influencer — analyses inform executive resource decisions              | High       |
| Risk Tolerance       | High — built rogue infrastructure; experiments with new tools          | High       |
| Change Readiness     | Very High — most enthusiastic about IRIS among all interviewees        | High       |
| Information Sources  | Data science communities, Samsung internal tech forums, online courses | Medium     |

### Personality Traits

- **Analytically curious** — naturally seeks patterns, anomalies, and deeper insights in every dataset
- **Self-reliant** — built personal infrastructure when official tools failed; does not wait for IT
- **Impatient with bureaucratic pace** — has been requesting a proper ES cluster for 3 years without result
- **Technically ambitious** — excited about AI analytics and wants to push the boundaries of what is possible with resource data

### Scenario: A Day in the Life

It is the last Monday of the month, and Eunji has 4 days to produce the 5 standard monthly reports. She starts by exporting PM Planner data — the export takes 25 minutes today because the dataset has grown. She opens Jupyter and runs her cleaning script, but it fails on 12 records because the N-PLM organization structure was updated last week and her mapping table is stale. She spends 90 minutes updating the mapping, re-running the script, and validating the output. By 2:00 PM, she has clean data. She begins the first report — resource utilization by division. The pivot table takes 30 minutes to build, the visualization another 20. She formats it for PowerPoint, adjusting colors to match Samsung's template. She writes the executive summary, highlighting that System LSI is at 112% allocation while Foundry is at 73%. She emails the report to 6 stakeholders. Four more reports to go. It is 4:30 PM on Monday. She will not finish until Thursday afternoon. The data she is presenting will be 4 days old by then.

### Research Basis

| Source Type       | Reference                                                                               |
| ----------------- | --------------------------------------------------------------------------------------- |
| Interview IDs     | INT-IRIS-008 (primary anchor), INT-IRIS-006 (report consumer perspective), INT-IRIS-010 |
| Empathy Map       | Archetype 3: Analytics Specialist                                                       |
| Affinity Themes   | Themes 5 (manual reporting burden), 11 (infrastructure limitations)                     |
| Artifact Analysis | Personal Elasticsearch cluster validates analytical infrastructure demand               |

### CXO Design Implications

| Implication                                                     | Design Decision                                                                                                                                                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Analytics is a separate workspace, not bolted onto planning** | Eunji needs an analytics module with its own navigation, not a "reports" tab buried in the planner interface. Dashboards, pivot views, and report builder should be first-class features.           |
| **Self-service over report requests**                           | Design for exploration, not just consumption. Drag-and-drop dimension selectors, interactive filters, drill-down from any aggregate to detail. Eunji should never need to request a report from IT. |
| **Do not force analysts to export**                             | Every view must be exportable (Excel, PDF, image), but the primary experience must be in-system. If Eunji is exporting to Excel for analysis, IRIS has failed.                                      |
| **Report scheduling is a core feature**                         | Automated generation, formatting, and distribution of recurring reports. This eliminates the "human cron job" pattern.                                                                              |
| **API access for power users**                                  | Provide documented APIs for Jupyter/Python integration. Do not lock data behind a UI-only interface. Eunji represents advanced users who need programmatic access.                                  |
| **Progressive disclosure for analytics**                        | Simple dashboards for managers (Minho), powerful analytics tools for specialists (Eunji). Same data, different interfaces based on role and need.                                                   |

---

## Persona 4: Soyeon Choi — "The Staffing Strategist"

### Persona Header

| Field     | Value                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Name      | Soyeon Choi — "The Staffing Strategist"                                                                                       |
| Photo     | [Placeholder: female, mid-30s, professional attire, Samsung HR department Hwaseong, world map staffing chart visible on wall] |
| Title     | HR Portfolio Manager                                                                                                          |
| Age Range | 33-37                                                                                                                         |
| Type      | **SUPPLEMENTARY PERSONA** — serve Soyeon's core needs without distorting the primary/secondary experience                     |

### Demographics

| Attribute        | Detail                                                           | Confidence |
| ---------------- | ---------------------------------------------------------------- | ---------- |
| Role / Title     | HR Portfolio Manager / HR Planner                                | High       |
| Division         | HR Operations — Memory Business Unit                             | High       |
| Site             | Hwaseong (HQ), South Korea                                       | High       |
| Company          | Samsung Electronics — DS Research                                | High       |
| Years at Samsung | 7 years (4 in HR planning at DSR, 3 in Samsung HR operations)    | High       |
| Team Size        | 2-person headcount portfolio team covering all Samsung DSR sites | High       |
| Education        | B.A. Business Administration, Korea University                   | Medium     |
| Reporting To     | HR Operations Manager, Samsung DSR                               | High       |

### Goals

1. **Automate the planned-vs-actual data merge.** Soyeon spends 2 full days monthly merging PM Planner exports (planned allocation) with GHRP exports (actual headcount). She needs IRIS to integrate directly with GHRP and SMDM, providing a single planned-vs-actual view without manual merging. _(Cited by INT-007; severity 8/10)_ **[Confidence: High]**

2. **Eliminate the naming convention lookup table.** A 3-page document translating between PM Planner and GHRP naming conventions is required for every merge. Standardized naming across systems would make this artifact unnecessary. _(Cited by INT-007; severity 7/10)_ **[Confidence: High]**

3. **Provide a live HeadCount Portfolio dashboard.** Show planned allocation, actual headcount, and the gap across all sites on a single screen, with drill-down by division, team, function, and time period. Include trend lines and gap trajectory. _(Cited by INT-007; severity 10/10)_ **[Confidence: High]**

4. **Enable data-driven staffing recommendations.** Transform from manual gap identification to system-generated recommendations: "Hire 8 in Q2, transfer 5 from Pyeongtaek, defer 7 from Q3 projects." This is aspirational but represents the direction Soyeon wants to move. _(Cited by INT-007; aspiration)_ **[Confidence: Low]**

### Frustrations

1. **"Human SQL JOIN" role is soul-crushing.** Manually merging data from two incompatible systems every month defines Soyeon's working life. "PM Planner has the plan, GHRP has the actuals, and I sit in the middle with Excel." _(INT-007; severity 8/10, frequency: monthly)_ **[Confidence: High]**

2. **Naming convention mismatch between systems.** PM Planner and GHRP use different naming conventions for teams, groups, and functions. A 3-page lookup table is required for every merge — and it breaks whenever either system updates its naming. _(INT-007; severity 7/10, frequency: monthly)_ **[Confidence: High]**

3. **High-stakes accuracy pressure with error-prone tools.** Errors directly influence million-dollar hiring decisions. At $200K per hire, 10 miscounted positions equals $2M in misguided recruitment. Soyeon triple-checks everything, but the manual process is inherently error-prone. _(INT-007; severity 7/10, ongoing)_ **[Confidence: High]**

4. **Isolated from planning data in real time.** Soyeon only sees planning data through monthly exports. She has no visibility into plan changes between export cycles. A planning decision made on the 5th of the month does not reach her until her next export cycle on the 1st of the following month. _(INT-007; severity 6/10, frequency: continuous)_ **[Confidence: Medium]**

### Daily Workflow Narrative (Current State)

Soyeon's work cycle is monthly rather than daily. During the first week of each month, she exports planned allocation data from PM Planner (by project, team, time period) and actual headcount data from GHRP (by employee, department, status).

Day 1-2 of the merge cycle: she opens both datasets in Excel, applies the 3-page naming convention lookup table to standardize organizational labels, and performs row-by-row matching. She resolves naming mismatches (typically 15-20 records per month) by consulting with the Site Admin or checking SMDM directly. Every mismatch requires investigation — is this a new team, a renamed team, or a data error?

Day 3: she calculates gaps (planned minus actual by division, site, and function), generates trend analysis (is the gap growing or shrinking?), and drafts staffing recommendations. She color-codes gaps by severity: green (within 5%), yellow (5-15% gap), red (>15% gap or any gap in critical skill categories).

Day 4: she formats findings into PowerPoint — including a manually created world map view showing Samsung DS sites (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung) with headcount status indicators. She distributes via email to HR leadership, Division Manager, and Planning Managers.

During quarterly deep analysis (4 full days), she adds breakdowns by project type, skill category, and career level. During annual planning (2 weeks), she produces the enterprise-wide staffing forecast that drives Samsung DSR's hiring budget — a document with multi-million dollar consequences.

### Tools and Workarounds

| Tool / System              | Purpose                                          | Satisfaction (1-5) | Workaround?                                  |
| -------------------------- | ------------------------------------------------ | ------------------ | -------------------------------------------- |
| PM Planner (export only)   | Source of planned allocation data                | 2                  | No — but only used as export source          |
| GHRP                       | Source of actual headcount data                  | 3                  | No — primary HR system                       |
| SMDM                       | Organization structure reference                 | 3                  | No — reference system                        |
| Microsoft Excel            | Data merge, gap calculation, analysis            | 2                  | Yes — the "human SQL JOIN" workspace         |
| 3-page naming lookup table | Translating PM Planner names to GHRP names       | 1                  | Yes — compensates for system naming mismatch |
| PowerPoint                 | World map staffing view, executive presentations | 2                  | Yes — static images of dynamic data          |

### IRIS Expectations

- **HeadCount Portfolio dashboard**: single screen showing planned allocation (from IRIS), actual headcount (from GHRP integration), and the gap — with drill-down by site, division, team, function, and time period
- **Automated GHRP/SMDM integration**: standardized naming conventions and automated data merge, eliminating the 3-page lookup table and 2-day manual process
- **World map visualization**: interactive map of Samsung DS sites with real-time headcount indicators, replacing the static PowerPoint slides
- **Gap alerts**: automatic notifications when gaps exceed thresholds (e.g., >15% gap in a critical skill category)
- **Trend analysis**: built-in trend lines showing whether gaps are growing or shrinking over time
- **Export to executive format**: one-click export to PowerPoint-ready format for leadership presentations

### Key Quotes

> "I am a human SQL JOIN. PM Planner has the plan, GHRP has the actuals, and I sit in the middle with Excel, trying to match them up. Every month. For 200+ projects. It is soul-crushing."
> — INT-IRIS-007

> "HeadCount Portfolio is not a feature for me — it IS my job. Without it, I am just an Excel operator."
> — INT-IRIS-007

> "If my gap analysis says 'hire 20 engineers for Pyeongtaek,' that triggers a recruitment process costing $200K per hire. An error in my Excel merge could mean $4M in misguided hiring."
> — INT-IRIS-007

### Tech Savviness

| Dimension           | Rating         | Evidence                                                                                          |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| Overall             | **Medium-Low** | Proficient with Excel for her specific workflow; not comfortable with technical tools beyond that |
| Tool Adoption       | Medium         | Will adopt new tools if they clearly reduce her manual workload                                   |
| Data Literacy       | Medium         | Understands headcount data deeply; less comfortable with multi-dimensional analysis               |
| Technical Curiosity | Low            | Wants the system to work, not to learn technology                                                 |

### Behavioral Attributes

| Attribute            | Value                                                                  | Confidence |
| -------------------- | ---------------------------------------------------------------------- | ---------- |
| Tech Savviness       | Medium-Low — proficient with Excel and HR systems only                 | High       |
| Decision-Making Role | Influencer — her analysis drives hiring budgets and staffing decisions | High       |
| Risk Tolerance       | Very Low — triple-checks everything due to financial stakes            | High       |
| Change Readiness     | High — deeply frustrated with manual process                           | High       |
| Information Sources  | Samsung HR community, direct manager guidance                          | Medium     |

### Personality Traits

- **Detail-oriented** — triple-checks every merge because errors have multi-million dollar consequences
- **Systematic** — follows the same process every month with meticulous documentation
- **Understated** — her role is not visible but her analysis directly influences Samsung's workforce investment
- **Pragmatic** — wants tools that eliminate manual merging first; advanced features are secondary
- **Risk-averse** — will not trust a new system until she has verified its accuracy against her manual process for at least 2-3 cycles

### Scenario: A Day in the Life

It is the second day of Soyeon's monthly merge cycle. She has exported PM Planner data (planned allocation for 200+ projects) and GHRP data (actual headcount for 3,000+ engineers across DSR). She opens both in Excel and begins applying her naming convention lookup table. Row 47: PM Planner lists "Memory DT Team 3" but GHRP calls it "Mem_DevTech_03." She checks the lookup table — this mapping exists. Row 83: PM Planner lists "HBM Advanced Dev" but GHRP has no match. Is this a new team? A renamed team? She opens SMDM and discovers it was created last month after a reorganization. She adds the mapping to her lookup table, knowing it will need updating again next month if anything changes. By 3:00 PM, she has matched 185 of 200 project-team combinations. The remaining 15 require investigation — emails to Site Admins, Teams messages to Planning Managers, and SMDM cross-references. She will finish the matching tomorrow. The gap analysis — the part of her job that actually creates value — will not start until Day 3.

### Research Basis

| Source Type     | Reference                                                    |
| --------------- | ------------------------------------------------------------ |
| Interview IDs   | INT-IRIS-007 (primary and sole anchor for this persona type) |
| Empathy Map     | Archetype 4: HR Portfolio Manager                            |
| Affinity Themes | Theme 10 (HR Portfolio integration gap)                      |
| Supplementary   | INT-IRIS-006 (Division Manager as consumer of staffing data) |

### CXO Design Implications

| Implication                                                 | Design Decision                                                                                                                                                                                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HeadCount Portfolio is a dedicated module, not a report** | This is the digitization of an entire job function. It needs its own navigation entry, its own dashboard, and its own workflow — not a tab inside the planner's interface.                                                          |
| **Simplicity is critical for this persona**                 | Soyeon has the lowest tech savviness of all personas. The HeadCount Portfolio interface must be visually simple: clear labels, obvious drill-down paths, minimal configuration required. No raw data tables — visualizations first. |
| **Integration accuracy is the adoption gate**               | If the GHRP/SMDM integration produces incorrect matches, Soyeon will revert to Excel within one cycle. The naming convention standardization must be thoroughly tested with real Samsung data before launch.                        |
| **World map is an emotional anchor**                        | The global site view (Hwaseong, Pyeongtaek, Austin, Xi'an, Giheung) is how Soyeon thinks about staffing. An interactive map with drill-down to site-level detail will create immediate connection and trust.                        |
| **Parallel-run capability needed**                          | Soyeon will need to run IRIS alongside her Excel process for 2-3 months to build trust. Design for this by providing easy comparison between IRIS output and her manual calculations.                                               |
| **Gap severity color coding**                               | Use Soyeon's existing mental model: green (<5% gap), yellow (5-15%), red (>15%). Do not invent a new scheme.                                                                                                                        |

---

## Persona Priority Matrix

### Design Weight Allocation

| Persona                                | Type          | IRIS Usage                       | Feature Dependencies                                                        | Business Impact                            | Design Weight |
| -------------------------------------- | ------------- | -------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------ | ------------- |
| Jisoo Park — The Operational Planner   | Primary       | Daily, 6+ hrs                    | Concurrent editing, version history, simulation, delta sync                 | Direct plan quality and cycle time         | **40%**       |
| Minho Kim — The Governance Leader      | Secondary     | Daily, 2-3 hrs                   | Approval workflow, diff view, over-allocation alerts, cross-site dashboards | Plan governance and accountability         | **25%**       |
| Eunji Lee — The Intelligence Architect | Secondary     | Weekly, 8-10 hrs analysis cycles | MDA, dashboards, report automation, ES infrastructure, API access           | Analytical intelligence and reporting      | **20%**       |
| Soyeon Choi — The Staffing Strategist  | Supplementary | Monthly, 4-6 days                | HeadCount Portfolio, GHRP/SMDM integration, world map                       | Workforce investment decisions ($M impact) | **15%**       |

### Trade-Off Rules When Persona Needs Conflict

These rules govern design decisions when persona needs pull in different directions:

1. **Jisoo's workflow efficiency always wins over feature richness.** If adding a governance feature for Minho would slow down Jisoo's data entry by even 2 clicks, find a different implementation. The primary persona's daily workflow is sacred.

2. **Minho's governance must not create friction for Jisoo.** Approval workflows, status badges, and audit trails must be transparent to planners. Jisoo should see status changes without being forced to navigate governance screens. Example: auto-save should work regardless of plan status; governance states are metadata, not workflow blockers for data entry.

3. **Eunji's analytics power must not complicate Minho's dashboards.** The analytics module should use progressive disclosure: simple KPI dashboards for managers, powerful drill-down and pivot capabilities for analysts. Same data, role-appropriate interfaces.

4. **Soyeon's HeadCount Portfolio is architecturally separate.** It shares data with the planning core but has its own interface, its own navigation, and its own user experience. Do not force HR users through the planning interface. This separation also prevents HR-specific complexity from bleeding into the planner experience.

5. **When two secondary personas conflict, prefer the one with higher usage frequency.** Minho (daily) takes priority over Eunji (weekly) for shared interface elements. Eunji gets her own analytics workspace where she is the primary user.

6. **Never sacrifice data integrity for any persona.** If Soyeon's integration requirements reveal data quality issues that affect all personas (e.g., naming convention standardization), fix them at the platform level. Data integrity is not a persona-specific need — it is a system-wide requirement.

7. **Adoption risk determines implementation order.** Jisoo will not adopt IRIS if concurrent editing fails. Minho will not adopt if approvals are absent. Eunji will not adopt if she still has to export to Excel. Soyeon will not adopt if GHRP integration is inaccurate. Sequence MVP features by adoption risk: concurrent editing first, then approval workflow, then analytics, then HeadCount Portfolio.

### Cross-Persona Feature Mapping

| Feature Area          | Jisoo (Primary)    | Minho (Secondary)       | Eunji (Secondary)   | Soyeon (Supplementary) |
| --------------------- | ------------------ | ----------------------- | ------------------- | ---------------------- |
| Concurrent Editing    | Core need (daily)  | Awareness (reviews)     | N/A                 | N/A                    |
| Version History       | Core need (daily)  | Core need (diff review) | Data source         | N/A                    |
| Approval Workflow     | Submitter          | Approver (core)         | N/A                 | N/A                    |
| Simulation/Sandbox    | Core need (weekly) | Reviews results         | Analyzes results    | N/A                    |
| Cross-Site Visibility | Wants it           | Core need               | Analyzes it         | Views via HC Portfolio |
| MDA / Analytics       | Basic views        | Dashboard consumer      | Core need (daily)   | Basic gap views        |
| Report Automation     | N/A                | Report consumer         | Core need (monthly) | Report consumer        |
| HeadCount Portfolio   | N/A                | Dashboard consumer      | Data provider       | Core need (monthly)    |
| GHRP Integration      | N/A                | N/A                     | Data source         | Core need              |
| Delta PROMIS Sync     | Core need          | Governance concern      | N/A                 | N/A                    |

---

## Design Implications Summary

1. **Role-based experience is mandatory.** A single-view system will not serve these 4 personas. IRIS must provide: operational editing workspace for Jisoo, governance dashboard for Minho, analytical workspace for Eunji, and HeadCount Portfolio module for Soyeon. Role-based navigation, not a one-size-fits-all interface.

2. **Concurrent editing and version management are table stakes, not features.** Jisoo will not trust IRIS until these foundational capabilities are proven reliable. They are the minimum bar for adoption by the primary persona. Design and test these first.

3. **Workflow and governance must be system-native.** Minho's email-based approvals, printed reconciliation sheets, and personal Excel archives are symptoms of a system without a management layer. IRIS must include workflow as a first-class capability, not a bolt-on.

4. **Analytics must be in-system, not exported.** Eunji's personal ES cluster and Python notebooks prove demand for proper analytical infrastructure. If IRIS forces data export for analysis, it has failed the analytics persona.

5. **Integration with GHRP/SMDM is one persona's lifeline.** Soyeon's entire role depends on data from both planning and HR systems. The HeadCount Portfolio feature is not supplementary — it is the digitization of an entire job function.

6. **Progressive disclosure governs complexity.** Simple views for medium-tech-savvy users (Minho, Soyeon), powerful tools for high-tech-savvy users (Jisoo, Eunji). Same underlying data, different interface depth based on role.

7. **Trust is earned through parallel-run periods.** Every persona has been burned by PM Planner's failures. IRIS must support parallel operation with existing workflows during adoption. Design for graceful coexistence, not forced migration.

---

## Related Documents

| Document               | Path                                                   | Relationship                      |
| ---------------------- | ------------------------------------------------------ | --------------------------------- |
| D3a Affinity Map       | `01_DISCOVER/d3a-affinity-map.md`                      | Theme clusters informing personas |
| D3b Empathy Maps       | `01_DISCOVER/d3b-empathy-maps.md`                      | Empathy data grounding personas   |
| D5a Problem Statements | `01_DISCOVER/d5a-problem-statements.md`                | Problems grounded in persona pain |
| T07 Template           | `.ax/templates/T07_USER_PERSONA.md`                    | AX persona template               |
| Reference Draft        | `.command/000_init_project/output/D4_PERSONAS_IRIS.md` | Initial reference material        |

---

_AX Transformation Framework v2.0.0 — CXO Deliverable_
_"AI for Real Life. Real Impact."_
