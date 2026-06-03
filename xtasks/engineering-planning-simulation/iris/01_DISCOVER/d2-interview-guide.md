# Interview Guide — IRIS for Samsung DSR

> **AX Transformation Framework v2.0.0** | DISCOVER Phase — Task D2b
>
> **How to Use**: Practice this guide before your first session. Use section headings as time markers to stay on track. Customize probes per participant based on screener responses and assigned track.

---

## Interview Metadata

| Field              | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| Project            | IRIS DISCOVER Phase — Resource Planning System New Build        |
| Product            | IRIS (Intelligent Resources Information System) for Samsung DSR |
| AX Phase           | DISCOVER                                                        |
| Interviewer        | [Name]                                                          |
| Date               | [YYYY-MM-DD]                                                    |
| Participant        | [Name / ID]                                                     |
| Participant Role   | [Title, Samsung DSR]                                            |
| Participant Site   | [Hwaseong / Pyeongtaek / Austin / Xi'an / Giheung]              |
| Participant Track  | [Planner / Manager / Division Manager / HR / Analyst / IT]      |
| Interview Duration | 45-60 minutes                                                   |
| Interview Format   | [Remote (Teams) / In-person]                                    |
| Interview Language | [Korean / English / Mandarin]                                   |

---

## Interview Objectives

This guide addresses seven research objectives from the D1 Research Plan:

| ID       | Research Objective                                                                                                                                            | Key Questions          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **RO-1** | Validate P/M concurrent editing pain — Confirm planners experience data loss, overwrite conflicts, or coordination overhead with PM Planner's save mechanism  | Q3.2, Q4.1, Q4.2       |
| **RO-2** | Map end-to-end resource planning workflow — Document how planners use PM Planner for P/M planning, roadmap management, and simulation across Samsung DS sites | Q2.1, Q2.2, Q2.3, Q3.1 |
| **RO-3** | Quantify version reconciliation burden — Measure time spent on manual version tracking, diff comparison, and PROMIS/N-PLM sync                                | Q3.3, Q3.4, Q4.5       |
| **RO-4** | Prioritize Samsung's 13 requirement groups — Determine which of Req 0-12 have the highest pain severity and business impact from a user perspective           | Q5.1, Q5.2             |
| **RO-5** | Assess adoption readiness for AI-based reporting — Gauge willingness to use Samsung AI Services for automated Excel PIVOT generation                          | Q5.3                   |
| **RO-6** | Map stakeholder ecosystem and approval chains — Identify all roles involved in IRIS usage decisions and cross-site coordination                               | Q2.3, Q4.3, QM.1       |
| **RO-7** | Assess integration constraints — Understand data accessibility, API stability, and operational limitations for N-PLM, PROMIS, and Samsung AI Services         | Q3.4, QT.1             |

---

## Tagging System

Apply these tags in interview notes to accelerate synthesis. A single observation may carry multiple tags.

| Tag              | When to Use                                                      | Example                                                             |
| ---------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| `[QUOTE]`        | Verbatim participant language worth preserving                   | "I always lose my changes when someone else saves first."           |
| `[PAIN]`         | Explicit frustration, friction, or failure                       | Data loss from concurrent editing                                   |
| `[INSIGHT]`      | Non-obvious finding that reframes understanding                  | Planners coordinate edits via KakaoTalk, not PM Planner             |
| `[FEATURE]`      | Stated or implied capability request                             | "I wish I could compare two plan versions side by side."            |
| `[SURPRISE]`     | Something unexpected that challenges assumptions                 | A workaround that works better than the official tool               |
| `[EMOTION]`      | Strong emotional reaction (frustration, excitement, resignation) | Visible frustration when describing version conflicts               |
| `[WORKFLOW]`     | Step-by-step process or sequence description                     | The 7-step plan approval flow from draft to PROMIS sync             |
| `[METRIC]`       | Quantitative data: time, frequency, volume, cost                 | "I spend 3 hours per week reconciling versions manually."           |
| `[REUSE]`        | PM Planner capability or pattern to preserve in IRIS             | The P/M grid layout that planners navigate by muscle memory         |
| `[WORKAROUND]`   | Manual process built to compensate for system limitation         | Personal Excel file tracking which planner is editing which project |
| `[MENTAL-MODEL]` | How the participant conceptualizes their work or the system      | "I think of it as a giant spreadsheet, not a database."             |
| `[DELIGHT]`      | Something the participant enjoys or values in current workflow   | "The color-coding in the roadmap view is actually really helpful."  |

---

## Pre-Interview Checklist

> Complete all items before the interview begins.

- [ ] Confirm participant's screener survey responses (review D2a Screener answers)
- [ ] Research participant's site, division (Memory / System LSI / Foundry), and team composition
- [ ] Assign interview track (Planner / Manager / Division Manager / HR / Analyst / IT) based on screener
- [ ] Test recording setup (Microsoft Teams recording + backup local recording)
- [ ] Prepare consent acknowledgment — Samsung DSR project NDA covers research; obtain verbal consent for recording
- [ ] Open interview notes template (T04) with participant info pre-filled
- [ ] Brief note-taker on tagging conventions (see Tagging System above)
- [ ] Prepare screen-share option for contextual inquiry participants
- [ ] Confirm time zone alignment (KST / CST-US / CST-China)
- [ ] Print or load this guide on a second screen
- [ ] Review behavioral observation guide (see section below) with note-taker
- [ ] Prepare Req 0-12 rating card (Section 5) as handout or screen-share

---

## Interview Script

### Section 1: Opening (5 minutes)

**[Read aloud or paraphrase]**

> "Thank you for making time today. My name is [Interviewer Name], and I'm part of the Amoza team working with Samsung DSR to build IRIS — the Intelligent Resources Information System — as a completely new platform to replace the current PM Planner.
>
> Today, I want to learn about your experience with resource planning — the challenges you face, the tools you use, and what your ideal system would look like. Your input will directly shape what we build.
>
> A few housekeeping items:
>
> - This interview will take about 45-60 minutes. I'll keep us on track.
> - **There are no right or wrong answers.** I'm genuinely interested in your real day-to-day experience, including the messy parts.
> - **Everything you share is confidential.** Your responses will be anonymized in any reports. We will not attribute specific quotes to you without your permission.
> - **I'd like to record this session** so I don't miss any details. The recording will be used only by our project team. Is that okay with you?
> - You can skip any question or stop at any time.
> - At the end, I'll leave time for any questions you have about the IRIS project.
>
> Do you have any questions before we start?"

**[Start recording after verbal consent]**

**Interviewer Note**: IRIS is a NEW BUILD from scratch on Mendix 10 + Oracle 19c + Elasticsearch 8.x. PM Planner (Mendix 7/8) is reference only — it cannot be upgraded. Frame questions about pain around "the current system" or "PM Planner," but frame future-state questions around "the new IRIS system."

---

### Section 2: Background & Context (5 minutes)

> **Goal**: Establish participant context — role, site, department, team size, PM Planner experience.
> **Research Objectives**: RO-2, RO-6

**Q2.1** "Tell me about your current role at Samsung DSR. What does a typical week look like for you in terms of resource planning?"

_Probes:_

- How long have you been in this role?
- How many people are on your team?
- Which division or department do you belong to — Memory, System LSI, Foundry, or another?
- Which site are you based at?

_Tags to watch for: `[WORKFLOW]`, `[METRIC]`, `[MENTAL-MODEL]`_

> [Space for notes]

**Q2.2** "How often do you interact with the current PM Planner system, and what do you primarily use it for?"

_Probes:_

- Daily? Multiple times a day? Only during planning cycles?
- Which features do you use most — P/M editing, roadmap, simulation, reporting, approvals?
- Do you use PM Planner across multiple projects simultaneously?
- How many resources or projects do you manage at any given time?

_Tags to watch for: `[WORKFLOW]`, `[METRIC]`, `[MENTAL-MODEL]`_

> [Space for notes]

**Q2.3** "Who do you work most closely with when it comes to resource planning? Walk me through your key collaborators."

_Probes:_

- Same team? Cross-department? Cross-site?
- How do you coordinate with planners at other Samsung DS sites — Hwaseong, Pyeongtaek, Austin, Xi'an?
- Who approves your plans? Who consumes the output of your plans?
- What communication channels do you use — email, Teams, KakaoTalk, in-person?

_Tags to watch for: `[WORKFLOW]`, `[INSIGHT]`, `[MENTAL-MODEL]`_

> [Space for notes]

---

### Section 3: Current PM Planner Experience (15 minutes)

> **Goal**: Map the existing workflow in detail. Identify what works, what doesn't, workarounds, and why the upgrade path failed.
> **Research Objectives**: RO-1, RO-2, RO-3, RO-7

**Q3.1** "Walk me through the full lifecycle of a P/M plan — from when you first open PM Planner to when the plan is approved and synced to PROMIS or N-PLM."

_Probes:_

- How many steps from start to finish?
- How long does the full cycle typically take?
- Where do you spend the most time?
- What triggers you to start a new plan or revision?
- Is the process the same across all Samsung DS sites, or does each site do it differently?

_Tags to watch for: `[WORKFLOW]`, `[METRIC]`, `[PAIN]`, `[MENTAL-MODEL]`_

> [Space for notes]

**Q3.2** "What happens when you and a colleague need to edit the same P/M plan at the same time?"

_Probes:_

- Has your work ever been overwritten by someone else's save?
- How do you currently coordinate to avoid conflicts — email, chat, verbal agreement, time slots?
- How often do concurrent editing situations arise — daily, weekly, during peak planning?
- What is the impact when a conflict occurs — time lost, rework, frustration, incorrect data pushed downstream?
- Have you ever lost significant work due to a save conflict?

_Tags to watch for: `[PAIN]`, `[QUOTE]`, `[METRIC]`, `[EMOTION]`, `[WORKAROUND]`_

_Interviewer Note: This maps directly to Req 3 (concurrent save, auto-merge, conflict detect/resolve). Let the participant describe the pain naturally before probing on specific requirements. Watch for emotional intensity — this is expected to be a top pain point._

> [Space for notes]

**Q3.3** "Tell me about how you manage versions of your plans today. Can you track what changed between versions?"

_Probes:_

- Is there a version history feature in PM Planner? If not, how do you track changes?
- Can you compare a current version with a previous version?
- How do you roll back if a plan version has errors?
- How do you know which changes were made by whom, and when?
- How much time per week do you spend on version-related activities?

_Tags to watch for: `[PAIN]`, `[WORKFLOW]`, `[FEATURE]`, `[METRIC]`, `[WORKAROUND]`_

_Interviewer Note: Maps to Req 1 (version history per resource), Req 2 (version history per project), Req 4 (Roadmap & Simulation versioning)._

> [Space for notes]

**Q3.4** "How does data sync between PM Planner and PROMIS or N-PLM work today? Describe the process."

_Probes:_

- Is it manual or automatic? One-way or two-way?
- How often does sync happen?
- What happens if only 2 projects changed but all projects are sent to PROMIS — is there unnecessary full-sync overhead?
- How much time is wasted on unnecessary sync operations?
- What happens when sync fails or produces inconsistent data?
- How do you verify the data made it across correctly?

_Tags to watch for: `[PAIN]`, `[METRIC]`, `[INSIGHT]`, `[REUSE]`, `[WORKFLOW]`_

_Interviewer Note: Maps to Req 2 (delta sync to PROMIS & N-PLM) and Req 5 (N-PLM integration). Probe for quantitative data on sync frequency and failure rates._

> [Space for notes]

**Q3.5** "What tools do you use alongside PM Planner? Walk me through everything — Excel, email, chat, any other systems."

_Probes:_

- Do you export data to Excel for analysis? How often?
- Do you use Excel for things PM Planner should handle but cannot?
- How do you generate reports today — manual compilation, export, copy-paste?
- What other Samsung internal systems do you interact with — Teamcenter, SMDM, GHRP?
- Do you have any personal spreadsheets or tools you've built to fill gaps?

_Tags to watch for: `[WORKFLOW]`, `[PAIN]`, `[REUSE]`, `[WORKAROUND]`_

> [Space for notes]

**Q3.6** "What aspects of the current PM Planner actually work well? What would you want to preserve in the new IRIS system?"

_Probes:_

- Any features you rely on daily that must not be lost?
- Any workflows that are smooth and efficient despite other problems?
- What would break your work if it were missing from IRIS?
- Are there UI patterns, layouts, or navigation flows you've learned that should carry over?

_Tags to watch for: `[INSIGHT]`, `[REUSE]`, `[FEATURE]`, `[DELIGHT]`_

_Interviewer Note: Critical question. Understanding what to preserve prevents us from breaking things that work. Watch for features described with comfort or fondness — these are candidates for `[DELIGHT]` tagging._

> [Space for notes]

**Q3.7** "The current PM Planner runs on Mendix 7/8 and could not be upgraded. Do you know why? What was your experience when the upgrade was attempted or discussed?"

_Probes:_

- Were you involved in any discussions about upgrading PM Planner?
- What was communicated to users about why the upgrade path failed?
- How did that decision affect your confidence in the current system?
- What are your expectations for the new IRIS build given that experience?

_Tags to watch for: `[INSIGHT]`, `[EMOTION]`, `[MENTAL-MODEL]`_

_Interviewer Note: This question captures institutional memory about the failed upgrade path and sets expectations for the new build. Handle with care — it may surface frustration about past decisions._

> [Space for notes]

---

### Section 4: Pain Points & Unmet Needs (15 minutes)

> **Goal**: Uncover frustrations, quantify impact, and discover hidden needs beyond the 13 stated requirements.
> **Research Objectives**: RO-1, RO-3, RO-4, RO-5

**Q4.1** "What is the single most frustrating thing about resource planning with the current PM Planner?"

_Probes:_

- How often does this frustration occur — daily, weekly, monthly, during specific cycles?
- What does it cost you in time? In accuracy? In stress?
- Have you raised this issue before? What happened?
- On a scale of 1-10, how painful is this?

_Tags to watch for: `[PAIN]`, `[QUOTE]`, `[EMOTION]`, `[METRIC]`_

> [Space for notes]

**Q4.2** "Tell me about a specific time when something went wrong with PM Planner — a concrete incident where the system failed you."

_Probes:_

- What happened? What was the trigger?
- How long did it take to recover?
- What was the business impact — delayed plans, wrong data sent to PROMIS, missed deadlines, incorrect resource allocation?
- Could it have been prevented with better tools?
- How did it make you feel?

_Tags to watch for: `[PAIN]`, `[QUOTE]`, `[METRIC]`, `[SURPRISE]`, `[EMOTION]`_

_Interviewer Note: Storytelling question. Let the participant narrate fully. Do not interrupt. The specific incident often reveals systemic issues better than general complaints._

> [Space for notes]

**Q4.3** "How do you currently get visibility into resource plans across other Samsung DS sites — say, seeing Pyeongtaek data from Hwaseong, or Austin data from Korea?"

_Probes:_

- Can you see other sites' data in PM Planner at all?
- How do you compile a cross-site view — manual Excel consolidation, meetings, email requests?
- What decisions require cross-site visibility?
- What happens when you cannot get this visibility quickly?
- How often do you need cross-site data?

_Tags to watch for: `[PAIN]`, `[WORKFLOW]`, `[FEATURE]`, `[METRIC]`_

_Interviewer Note: Maps to Req 7 (Main screen renewal — world map), Req 8 (Analysis views — world map), and F4 (HR Portfolio). Cross-site blindness is a hypothesized top pain — validate or challenge here._

> [Space for notes]

**Q4.4** "Describe how you run a simulation or what-if scenario today. For example, 'What if we shift 10 engineers from Project A to Project B for Q3?'"

_Probes:_

- Is simulation possible in PM Planner, or do you use Excel or other tools?
- How long does it take to set up and run a simulation?
- Can you compare multiple scenarios side by side?
- How often do you need simulation capabilities — weekly, monthly, quarterly?
- What decisions depend on simulation results?
- Who consumes the output of your simulations?

_Tags to watch for: `[PAIN]`, `[FEATURE]`, `[METRIC]`, `[WORKFLOW]`, `[WORKAROUND]`_

_Interviewer Note: Maps to Req 1 (separate Roadmap & Simulation), F3 (Resource Roadmap — Simulation & Planning). This is a high-value capability area for IRIS._

> [Space for notes]

**Q4.5** "How do you currently generate reports and analysis from resource planning data?"

_Probes:_

- What types of reports do you create — utilization, gap analysis, headcount, staffing plans, forecasts?
- How much time do you spend on report generation per week?
- Do you export to Excel and create pivot tables manually?
- Who are the consumers of these reports — your manager, division leadership, HR?
- What information is missing from your current reports?
- What would "real-time reporting" mean for your work?

_Tags to watch for: `[PAIN]`, `[METRIC]`, `[FEATURE]`, `[WORKFLOW]`, `[WORKAROUND]`_

_Interviewer Note: Maps to Req 10 (Analysis Reporting), Req 11 (AI-Based Reporting), F5 (Actual vs Plan Gap), F6 (Regular Reporting)._

> [Space for notes]

**Q4.6** "What workarounds have you built to cope with PM Planner's limitations? Be specific — I want to understand the 'shadow processes' that keep your work running."

_Probes:_

- Personal Excel files? Shared spreadsheets? Shadow tracking systems?
- Email or chat-based coordination for concurrent editing — "are you done editing Project X?"
- Manual comparison of plan versions — printing, side-by-side screens?
- Custom scripts, macros, or formulas?
- Meeting-heavy processes that compensate for system gaps?
- Any tools or templates you've created yourself?

_Tags to watch for: `[PAIN]`, `[INSIGHT]`, `[SURPRISE]`, `[REUSE]`, `[WORKAROUND]`_

_Interviewer Note: Workarounds are confirmed active pain. Every workaround represents a feature gap. Ask to see artifacts if the participant is willing (screenshots, spreadsheets). These are gold for design._

> [Space for notes]

**Q4.7** "Is there anything you need for resource planning that nobody has asked you about — a capability that isn't in the current system and hasn't been mentioned in any requirements discussions?"

_Probes:_

- Think about what would make your job dramatically easier.
- Any emerging needs related to new Samsung DS sites, new divisions, or organizational changes?
- Anything related to how resource planning is evolving in the semiconductor industry?
- If you could automate one part of your job entirely, what would it be?

_Tags to watch for: `[SURPRISE]`, `[INSIGHT]`, `[FEATURE]`, `[MENTAL-MODEL]`_

_Interviewer Note: This is the "hidden needs" question. Give the participant time to think. Use silence — wait 5-7 seconds before probing. Some of the most valuable insights come from this question._

> [Space for notes]

---

### Section 5: Requirements Validation (10 minutes)

> **Goal**: Walk through Samsung's stated requirements (Req 0-12) and feature areas (F1-F7). Gauge priority from user perspective.
> **Research Objectives**: RO-4, RO-5

**Q5.1** "Samsung has identified 13 requirement areas for the new IRIS system. I'd like to walk through them quickly and get your reaction. For each one, tell me: **Critical**, **Important**, **Nice-to-have**, or **Not relevant** to your work."

| #      | Requirement                                                                             | Rating | Notes |
| ------ | --------------------------------------------------------------------------------------- | ------ | ----- |
| Req 0  | Upgrade to Mendix 10 with new custom widgets and UI standards                           | [ ]    |       |
| Req 1  | Separate Resource Roadmap & Simulation, with version history per resource               | [ ]    |       |
| Req 2  | Per-project version history + delta sync (only changed projects sync to PROMIS/N-PLM)   | [ ]    |       |
| Req 3  | Concurrent save — auto-merge, conflict detection/resolution, draft-to-approval workflow | [ ]    |       |
| Req 4  | Roadmap & Simulation versioning (same concurrency expectations as Req 3)                | [ ]    |       |
| Req 5  | N-PLM integration for Master Data Management                                            | [ ]    |       |
| Req 6  | Factor Control — dimension-based filtering across views                                 | [ ]    |       |
| Req 7  | Main screen renewal — world map with resource stats, role-based navigation              | [ ]    |       |
| Req 8  | Analysis views — world map, personal dashboard                                          | [ ]    |       |
| Req 9  | HeadCount Portfolio — staffing plan + analysis                                          | [ ]    |       |
| Req 10 | Analysis Reporting — charts, tables, periodic auto-email (Smart Notify)                 | [ ]    |       |
| Req 11 | AI-Based Reporting — Excel PIVOT via Samsung AI Services                                | [ ]    |       |
| Req 12 | New QA/Prod server setup with ES cluster architecture                                   | [ ]    |       |

_Tags to watch for: `[FEATURE]`, `[PAIN]`, `[INSIGHT]`_

> [Space for notes]

**Q5.2** "Of those 13, which THREE would have the biggest positive impact on your daily work? And which one, if not implemented, would be a dealbreaker?"

_Probes:_

- Why those three specifically?
- What would change for you day-to-day if they were implemented?
- Is there a requirement you expected to see that is missing?
- How do these map to the 7 feature areas — F1 Master Data, F2 Project Mgmt, F3 Roadmap/Simulation, F4 HR Portfolio, F5 Actual vs Plan Gap, F6 Reporting, F7 AI?

_Tags to watch for: `[FEATURE]`, `[INSIGHT]`, `[QUOTE]`, `[PAIN]`_

> [Space for notes]

**Q5.3** "How do you feel about AI being used for resource planning reports and analysis? Have you interacted with Samsung AI Services before?"

_Probes:_

- What would you want AI to do — generate reports, suggest resource allocations, flag anomalies, predict bottlenecks?
- What would you NOT want AI to do — make allocation decisions, override your plans?
- What would it take for you to trust an AI-generated report enough to share it with leadership?
- Any concerns about accuracy, control, transparency, or data privacy?
- Have you used any AI tools in your work already — ChatGPT, Copilot, Samsung internal AI?

_Tags to watch for: `[FEATURE]`, `[INSIGHT]`, `[EMOTION]`, `[SURPRISE]`, `[MENTAL-MODEL]`_

_Interviewer Note: Maps to Req 11 (AI-Based Reporting) and F7 (AI for Intelligent Resource Planning). Samsung DSR plans to use Samsung's internal AI services. Assess both the general concept of AI in resource planning and the specific Samsung AI platform. Watch for trust signals — enthusiasm vs. skepticism._

> [Space for notes]

---

### Section 6: Closing (5 minutes)

> **Goal**: Capture anything missed, understand the ideal end state, identify follow-up opportunities.

**Q6.1** "If the new IRIS system could be anything you wanted — no technical constraints, no budget limits — what would your ideal resource planning day look like?"

_Probes:_

- What would your morning look like when you open IRIS?
- What information would be at your fingertips without clicking?
- How would collaboration with your team work differently?
- What tasks would be eliminated entirely?
- How would IRIS interact with your other systems?

_Tags to watch for: `[FEATURE]`, `[INSIGHT]`, `[QUOTE]`, `[MENTAL-MODEL]`, `[DELIGHT]`_

> [Space for notes]

**Q6.2** "What would success look like for the IRIS project? How would you know, 6 months after launch, that it was a success?"

_Probes:_

- Specific metrics — time saved, fewer conflicts, faster approvals, fewer Excel exports?
- Qualitative outcomes — less stress, more strategic work, better cross-site alignment, fewer fire drills?
- What would make you recommend IRIS to a colleague at another site?

_Tags to watch for: `[METRIC]`, `[INSIGHT]`, `[QUOTE]`_

> [Space for notes]

**Q6.3** "Is there anything about your resource planning experience that we haven't covered that you think is important for us to know?"

_Tags to watch for: `[SURPRISE]`, `[INSIGHT]`, `[PAIN]`_

_Interviewer Note: Give 5-7 seconds of silence. Some of the best insights come here when the participant feels the formal interview is ending and relaxes._

> [Space for notes]

**Q6.4** "Are there colleagues at your site or other Samsung DS sites who would be particularly valuable for us to speak with?"

_Probes:_

- Who is the most experienced PM Planner user at your site?
- Who has the strongest opinions about what needs to change?
- Any manager or leader who is championing the IRIS project?
- Anyone who has built particularly creative workarounds?

> [Space for notes]

**[Closing Statement]**

> "Thank you so much for your time and insights. This has been incredibly valuable. We're committed to building IRIS from the ground up to solve the real problems your team faces every day. If you think of anything else after this conversation, please don't hesitate to reach out.
>
> We may also follow up with a brief contextual inquiry session where we observe your actual PM Planner workflow — would you be open to that?"

**[Stop recording]**

---

## Track-Specific Supplemental Questions

> Add these to Section 4 based on the participant's assigned track from the screener survey.

### Planning Manager Track

**QM.1** "Walk me through the approval workflow for a P/M plan. What do you review, how do you approve, and what are the bottlenecks?"

_Probes:_

- How do you distinguish a draft version from a permanent (approved) version today?
- How are you notified when a plan needs your review?
- What do you look for when reviewing — data accuracy, completeness, alignment with targets?
- What would make the review process faster?
- How many plans are you reviewing in a typical week?

_Tags: `[WORKFLOW]`, `[PAIN]`, `[FEATURE]`, `[METRIC]`_

> [Space for notes]

**QM.2** "How do you maintain oversight across multiple planners and projects? What's your visibility like?"

_Probes:_

- Can you see the status of all plans under your responsibility in one view?
- How do you track which plans are draft, pending approval, or approved?
- What escalation paths exist when a planner falls behind?
- Do you receive alerts or notifications, or must you manually check?

_Tags: `[PAIN]`, `[WORKFLOW]`, `[FEATURE]`, `[WORKAROUND]`_

> [Space for notes]

**QM.3** "When a plan is rejected or needs revision, what does the feedback loop look like?"

_Probes:_

- How do you communicate what needs to change?
- Can you annotate specific cells or sections in PM Planner?
- How long does a typical revision cycle take?

_Tags: `[WORKFLOW]`, `[PAIN]`, `[FEATURE]`_

> [Space for notes]

---

### Division Manager Track

**QD.1** "What resource information do you need to see across all Samsung DS sites? How do you get it today?"

_Probes:_

- Do you need real-time data or periodic summaries?
- What decisions depend on cross-site visibility — reallocation, hiring, capacity planning?
- How does the lack of a unified view impact your decision-making speed?
- What format do you prefer — dashboards, reports, briefings?

_Tags: `[PAIN]`, `[FEATURE]`, `[METRIC]`, `[MENTAL-MODEL]`_

> [Space for notes]

**QD.2** "How do you compare resource utilization across divisions — Memory vs. System LSI vs. Foundry?"

_Probes:_

- Is this comparison possible today, or is it assembled manually?
- What KPIs do you track at the division level?
- How often do you need this data — weekly, monthly, quarterly?

_Tags: `[PAIN]`, `[FEATURE]`, `[METRIC]`, `[WORKFLOW]`_

> [Space for notes]

**QD.3** "When you need to make a resource reallocation decision across sites or divisions, what is the process?"

_Probes:_

- How long does the decision cycle take from identification to execution?
- What data do you wish you had to make these decisions faster?
- How do you validate the impact of reallocation decisions after the fact?

_Tags: `[WORKFLOW]`, `[PAIN]`, `[FEATURE]`, `[METRIC]`_

> [Space for notes]

---

### HR Planner Track

**QH.1** "Walk me through how you create a staffing plan and track headcount allocation versus actuals."

_Probes:_

- What data sources do you use — IRIS, GHRP, SMDM, Excel?
- Can you see the gap between planned and actual resource utilization today?
- How do you generate recommendations for staffing adjustments?
- How do you handle transfers between sites or divisions?

_Tags: `[WORKFLOW]`, `[PAIN]`, `[FEATURE]`, `[METRIC]`_

> [Space for notes]

**QH.2** "How do you track skill profiles and competency data for resource matching?"

_Probes:_

- Is skill data available in PM Planner, or only in GHRP?
- Can you match available resources to project requirements based on skills?
- How do you handle confidential HR data in the context of resource planning?

_Tags: `[WORKFLOW]`, `[FEATURE]`, `[INSIGHT]`_

> [Space for notes]

**QH.3** "What is your process for quarterly or annual workforce planning — and how does PM Planner support or hinder it?"

_Probes:_

- How far ahead do you plan — 1 quarter, 1 year, 3 years?
- What inputs do you need from resource planners to do workforce planning?
- Where does the handoff between resource planning and HR planning break down?

_Tags: `[WORKFLOW]`, `[PAIN]`, `[FEATURE]`, `[METRIC]`_

> [Space for notes]

---

### Analyst Track

**QA.1** "Describe the most common analysis you perform. How do you gather the data, and how do you present findings?"

_Probes:_

- Do you use multi-dimensional analysis — slice by site, division, project type, time period?
- What are the key dimensions you filter by?
- How long does it take to produce a standard analysis report?
- What tools do you use — PM Planner directly, Excel export, BI tools?

_Tags: `[WORKFLOW]`, `[PAIN]`, `[FEATURE]`, `[METRIC]`_

> [Space for notes]

**QA.2** "What is the biggest gap between the data you have and the data you need?"

_Probes:_

- Is the issue data availability, data quality, data timeliness, or data granularity?
- What data do you wish PM Planner tracked but doesn't?
- How do you handle missing or inconsistent data?

_Tags: `[PAIN]`, `[FEATURE]`, `[INSIGHT]`_

> [Space for notes]

**QA.3** "How do you create and distribute periodic reports today — weekly, monthly, quarterly?"

_Probes:_

- Is report generation automated or manual?
- How much time do you spend formatting vs. analyzing?
- Who receives these reports and what do they do with them?
- Would automated scheduled reports (Smart Notify) change your workflow?

_Tags: `[WORKFLOW]`, `[PAIN]`, `[FEATURE]`, `[METRIC]`, `[WORKAROUND]`_

> [Space for notes]

---

### System Admin / IT Track

**QT.1** "Describe the current PM Planner infrastructure. What are the pain points from an operations perspective?"

_Probes:_

- Server architecture — how many environments (Dev/QA/Prod)?
- Elasticsearch cluster configuration and performance?
- Oracle database — version, size, performance issues?
- What does the deployment process look like — frequency, downtime, risk?
- Backup and disaster recovery — current state?

_Tags: `[PAIN]`, `[INSIGHT]`, `[METRIC]`, `[REUSE]`_

> [Space for notes]

**QT.2** "What are the integration points between PM Planner and other Samsung systems — N-PLM, PROMIS, GHRP, SMDM? How stable are they?"

_Probes:_

- API-based or file-based integration? Batch or real-time?
- Error rates, latency, failure handling?
- Who maintains each integration — your team, the other system's team, a vendor?
- What would need to change for IRIS to integrate with Samsung AI Services?

_Tags: `[PAIN]`, `[INSIGHT]`, `[METRIC]`, `[WORKFLOW]`_

> [Space for notes]

**QT.3** "What are your concerns about the Mendix 10 migration from a technical perspective?"

_Probes:_

- Custom widget compatibility — how many custom widgets exist in PM Planner?
- Data migration strategy — volume, complexity, validation?
- Performance requirements — concurrent users, response times, data volumes?
- Security and access control requirements — Samsung's internal security standards?

_Tags: `[PAIN]`, `[INSIGHT]`, `[FEATURE]`, `[METRIC]`_

> [Space for notes]

**QT.4** "What monitoring and alerting capabilities do you need for IRIS that you don't have for PM Planner?"

_Probes:_

- Application performance monitoring?
- User activity tracking and audit logs?
- Automated health checks?

_Tags: `[FEATURE]`, `[PAIN]`, `[INSIGHT]`_

> [Space for notes]

---

## Probing Prompts (Quick Reference)

> Use these when you need to go deeper on a response. Keep them open-ended. Numbered for easy reference during the interview.

| #   | Prompt                                                                | When to Use                              |
| --- | --------------------------------------------------------------------- | ---------------------------------------- |
| P1  | "Tell me more about that."                                            | General depth — works everywhere         |
| P2  | "Can you give me a specific example from the last week?"              | When answers are abstract or general     |
| P3  | "Why is that important to you personally?"                            | To uncover emotional drivers             |
| P4  | "What happened next?"                                                 | During incident narratives               |
| P5  | "How did that make you feel?"                                         | When sensing frustration or delight      |
| P6  | "What do you mean by [term they used]?"                               | When jargon or ambiguous terms appear    |
| P7  | "How often does that happen? Can you estimate?"                       | To quantify frequency                    |
| P8  | "Who else is affected when that happens?"                             | To map impact radius                     |
| P9  | "What did you try before you found that workaround?"                  | When workarounds are mentioned           |
| P10 | "If that problem was solved, what would change for you?"              | To understand outcome value              |
| P11 | "On a scale of 1-10, how painful is that? Why that number?"           | To calibrate severity                    |
| P12 | "Is that specific to your site, or does it happen across Samsung DS?" | To distinguish local vs. systemic issues |
| P13 | "Show me how you do that — can you share your screen?"                | During contextual inquiry moments        |
| P14 | "What would you do differently if you had no constraints?"            | To surface latent needs                  |
| P15 | "Walk me through the last time that happened, step by step."          | To get granular process detail           |

---

## CXO Behavioral Observation Guide

> For the interviewer and note-taker. Observe and record these behavioral signals throughout the interview. These are as important as the verbal responses.

### Emotional Cue Checklist

Watch for and note the following non-verbal and tonal signals:

| Signal                             | What It Indicates                                                     | When Most Likely                                 | Action                                                                                                 |
| ---------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Voice rises / speeds up**        | Frustration or passion about a topic                                  | Sections 3-4 (pain points)                       | Tag `[EMOTION]`, probe deeper                                                                          |
| **Long pause before answering**    | Difficult or sensitive topic; participant is choosing words carefully | Section 4 (workarounds), Section 5 (AI)          | Wait. Do not fill the silence.                                                                         |
| **Laughter (nervous or resigned)** | Coping mechanism for a painful situation                              | Concurrent editing questions, version chaos      | Tag `[EMOTION]`, ask "why do you laugh at that?"                                                       |
| **Leaning forward / nodding**      | Strong agreement or engagement                                        | When describing ideal state or validating a pain | Probe: "I can see this matters — tell me more."                                                        |
| **Eye roll or head shake**         | Dismissal or deep frustration                                         | Current system limitations                       | Tag `[EMOTION]`, probe: "What's behind that reaction?"                                                 |
| **Glancing at other screens**      | May be checking the actual system to reference something              | Process walkthrough questions                    | Ask: "Are you looking at PM Planner? Can you share your screen?"                                       |
| **Uses "we always" / "we never"**  | Absolutes may signal strong organizational norms                      | Any section                                      | Probe: "Always? Has there ever been an exception?"                                                     |
| **Contradicts earlier statement**  | Evolving understanding or complex reality                             | Later sections vs. earlier sections              | Note both statements. Do not confront. Probe gently: "Earlier you mentioned X — how does that relate?" |

### Workaround Documentation Checklist

When a workaround is mentioned, capture all of the following:

- [ ] **What**: What is the workaround? (Describe the action)
- [ ] **Why**: What system limitation does it compensate for?
- [ ] **Who**: Who uses this workaround — just this person, their team, or their entire site?
- [ ] **How often**: Frequency of use (daily, weekly, per planning cycle)
- [ ] **Time cost**: How much time does this workaround consume?
- [ ] **Artifact**: Is there a file, spreadsheet, template, or tool? Can they share it?
- [ ] **Risk**: What goes wrong when the workaround fails?
- [ ] **Satisfaction**: Does the participant view the workaround as adequate, or as a frustrating necessity?

### Mental Model Probes

Use these to understand how participants conceptualize their work and the system:

| Probe                                                                                                        | What It Reveals                                               |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| "If you had to explain PM Planner to a new colleague in 30 seconds, what would you say?"                     | Core mental model of the system's purpose                     |
| "Do you think of resource planning as a spreadsheet task, a project management task, or something else?"     | Conceptual frame — influences UI expectations                 |
| "When you say 'version,' what exactly do you mean — a snapshot in time, a named release, a draft vs. final?" | Terminology mapping — critical for Req 1-4 design             |
| "How do you picture the relationship between a roadmap, a simulation, and a plan?"                           | Conceptual hierarchy — shapes F3 information architecture     |
| "If IRIS were a physical workspace, what would it look like?"                                                | Spatial metaphor — reveals navigation and layout expectations |
| "What does 'real-time' mean to you in the context of resource data?"                                         | Latency expectations — shapes performance requirements        |

---

## Post-Interview Debrief Form

> Complete within 30 minutes of the interview while it is fresh. Discuss with note-taker before filling in.

| Field                           | Response                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------- |
| **Participant ID**              | [ID]                                                                             |
| **Interview Date**              | [YYYY-MM-DD]                                                                     |
| **Interviewer**                 | [Name]                                                                           |
| **Note-Taker**                  | [Name]                                                                           |
| **Track**                       | [Planner / Manager / Division Manager / HR / Analyst / IT]                       |
| **Site**                        | [Hwaseong / Pyeongtaek / Austin / Xi'an / Giheung]                               |
| **Division**                    | [Memory / System LSI / Foundry / Other]                                          |
| **Overall Pain Level (1-10)**   | [Rating]                                                                         |
|                                 |                                                                                  |
| **Top 3 Insights**              | 1. [Insight]                                                                     |
|                                 | 2. [Insight]                                                                     |
|                                 | 3. [Insight]                                                                     |
| **Biggest Surprise**            | [What was unexpected?]                                                           |
| **Strongest Quotes**            | 1. "[Quote]" — context: [where in interview]                                     |
|                                 | 2. "[Quote]" — context: [where in interview]                                     |
|                                 | 3. "[Quote]" — context: [where in interview]                                     |
| **Assumptions Confirmed**       | [Which assumptions about PM Planner pain were supported?]                        |
| **Assumptions Challenged**      | [Which assumptions were contradicted or nuanced?]                                |
| **Req 0-12 Priority Signal**    | Top 3: [Req #, Req #, Req #] — Dealbreaker: [Req #]                              |
| **Feature Area Signal (F1-F7)** | Most emphasized: [F#] — Least mentioned: [F#]                                    |
| **Workarounds Documented**      | Count: [#] — Most significant: [Description]                                     |
| **Reuse Opportunities**         | [What from PM Planner should be preserved in IRIS?]                              |
| **Mental Model Notes**          | [How does this participant conceptualize resource planning?]                     |
| **Emotional Hotspots**          | [Which topics triggered the strongest emotional reactions?]                      |
| **AI Readiness Signal**         | [Enthusiastic / Cautious / Skeptical / Resistant] — Notes: [Details]             |
| **Follow-Up Needed**            | [Clarification questions, contextual inquiry candidates, artifacts to request]   |
| **Snowball Referrals**          | [Names and roles suggested by participant]                                       |
| **Participant Quality**         | [How well did this participant match our target? Would we interview them again?] |

---

## Post-Interview Checklist

- [ ] Complete debrief form within 30 minutes
- [ ] Finalize interview notes (T04 template) within 2 hours while memory is fresh
- [ ] Tag all observations using the tagging system
- [ ] Rate participant's overall pain level (1-10) and record top 3 priorities
- [ ] Flag key quotes for empathy map (D3b) and persona development (D4)
- [ ] Document all workarounds using the workaround documentation checklist
- [ ] Note reusable patterns from PM Planner that should be preserved in IRIS
- [ ] Add snowball referrals to recruitment pipeline
- [ ] Debrief with note-taker — capture immediate impressions and cross-reference patterns with previous interviews
- [ ] Update participant tracking spreadsheet with completion status
- [ ] If contextual inquiry was agreed to, schedule follow-up session within 1 week

---

## Question-to-Research-Objective Mapping

> Quick reference to ensure every research objective receives adequate coverage.

| Research Objective                | Core Questions               | Track Supplements      | Minimum Coverage                   |
| --------------------------------- | ---------------------------- | ---------------------- | ---------------------------------- |
| **RO-1**: Concurrent editing pain | Q3.2, Q4.1, Q4.2, Q4.6       | QM.1                   | At least 2 questions per interview |
| **RO-2**: End-to-end workflow     | Q2.1, Q2.2, Q2.3, Q3.1, Q3.5 | QM.2, QH.1, QA.1       | Full walkthrough in Section 3      |
| **RO-3**: Version reconciliation  | Q3.3, Q3.4, Q4.5             | QA.3                   | At least 2 questions per interview |
| **RO-4**: Req 0-12 prioritization | Q5.1, Q5.2                   | All tracks             | Full Req card in Section 5         |
| **RO-5**: AI readiness            | Q5.3                         | QA.2                   | At least 1 question per interview  |
| **RO-6**: Stakeholder ecosystem   | Q2.3, Q4.3                   | QM.1, QM.2, QD.1, QD.3 | At least 2 questions per interview |
| **RO-7**: Integration constraints | Q3.4                         | QT.1, QT.2, QT.3       | Full coverage in IT track          |

---

## Interview Tips (Quick Reference)

- **Listen more, talk less.** Aim for 80/20 participant-to-interviewer ratio.
- **Follow the energy.** If a participant gets animated about a topic, probe deeper even if it's off-script.
- **Ask "why" five times.** Surface-level answers often hide deeper insights.
- **Use silence.** Pause 5-7 seconds after an answer — participants often elaborate.
- **Avoid leading questions.** Say "Tell me about..." not "Don't you think that..."
- **Capture exact words.** Paraphrase back to confirm: "So what I'm hearing is..."
- **Note body language.** (Video on) Frustration, excitement, hesitation are all data.
- **Distinguish role-specific vs. universal pain.** Ask "Is this specific to your role, or do other teams experience it too?"
- **Probe every workaround.** Workarounds = confirmed active pain. Use the workaround documentation checklist.
- **Remember: IRIS is NEW BUILD.** Do not anchor on "upgrading PM Planner." Frame it as "building the ideal system informed by PM Planner experience."
- **Record time stamps.** Note the recording timestamp when strong quotes or insights emerge for easy retrieval.
- **Watch for contradictions.** They reveal complexity, not dishonesty. Probe gently.

---

## Related Documents

| Document            | Path                                                          | Relationship                              |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| D1 Research Plan    | `01_DISCOVER/d1-research-plan.md`                             | Parent plan with research objectives      |
| D2a Screener Survey | `01_DISCOVER/d2-screener-survey.md`                           | Pre-interview qualification and profiling |
| T03 Template        | `.ax/templates/T03_INTERVIEW_GUIDE.md`                        | AX template this guide is based on        |
| T04 Interview Notes | `.ax/templates/T04_INTERVIEW_NOTES.md`                        | Notes template for use during interviews  |
| D2 Reference        | `.command/000_init_project/output/D2_INTERVIEW_GUIDE_IRIS.md` | Initial reference version (v1.0)          |

---

_AX Transformation Framework v2.0.0 — Amoza_
_"AI for Real Life. Real Impact."_
