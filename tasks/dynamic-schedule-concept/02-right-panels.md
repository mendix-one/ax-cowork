# Dynamic Schedule — Right Panels

> Wireframes for the five **Right Panel** modes, selected from the **Right Rail**. Shell, tokens, and conventions defined in [README.md](README.md). Right Panel is independent of the Main View (e.g. Gantt + AI Chat, Analysis + Recommendations) — except **Compare / Split**, which takes over the workspace as a two-pane view.

| #   | Mode                                                   | Purpose                                                         |
| --- | ------------------------------------------------------ | --------------------------------------------------------------- |
| A   | [Split / Compare schedule](#a-split--compare-schedule) | Two plans side-by-side with diff highlighting                   |
| B   | [AI Chatbox](#b-ai-chatbox)                            | Conversational what-if; the default Right Panel                 |
| C   | [Background Tasks](#c-background-tasks)                | Running jobs (replans, simulations, exports), progress, results |
| D   | [Schedule Change History](#d-schedule-change-history)  | Audit trail of commits and AI replans (git-style log)           |
| E   | [Recommendations](#e-recommendations)                  | AI-surfaced suggestions ranked by impact: replan, tune, reroute |

---

## A. Split / Compare schedule

**Purpose** — Compare two plans side-by-side: published vs proposed, Plan A vs Plan B, or Plan A vs "Plan A 24 hours ago." Diff highlights what moved. Used at decision time to commit a re-plan.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | COMPARE: Plan A (Sim) ↔ Plan B (Sim)         [⊟] [🔔] [👤] [⚙]           |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  LEFT: Plan A (Published)                  |  RIGHT: Plan B (AI-proposed 06:14)      | ⇄◀ |
| 📈 |  [Pick view ▾ Gantt]                       |  [Pick view ▾ Gantt]                    | 🤖 |
| 📦 +------+-----------------------------------+-+-+--------------------------------------+ ⏳ |
| 🏭 | Task | Apr 29-30  May 1-7   May 8-14    | | | Apr 29-30  May 1-7   May 8-14         | 🕘 |
| 🔧 |PO-118| [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] | | | [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]      | 💡 |
| ⚙️ |HARC  |   [━━━━━━]                      | | |   [━━━━━━]                          |    |
| 🔌 |WL    |        [━━━━]                   | | |        [━━━━]                       |    |
|    |PO-119| [━━━━━━━━━━━━━━━━━━━━━━━━]      | | | [━━━━━━━━━━━━━━━━━━━━━━━━━━]  ★MOVED |    |
|    |HARC  |    [━━━━━━━━━━] ⚠ overlap      | | |    [━━━━━━━━━━━]  → rerouted ETC-07 |    |
|    |WL    |              [━━━━━]            | | |               [━━━━━]                |    |
|    |PO-120| [━━━━━━━━━━━━━━━━━━━━━━━━━━━━]  | | | [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━] +24h|    |
|    |HARC  |       [━━━━━━━━━━━━]            | | |          [━━━━━━━━━━━━] ★SHIFTED +1d |    |
|    +------+-----------------------------------+-+-+--------------------------------------+    |
|    |                                                                                     |    |
|    |  DIFF SUMMARY                                                                       |    |
|    |  Plan A (current)              vs  Plan B (proposed)                                |    |
|    |  Commits at risk:  3              Commits at risk:  1 (−2)                          |    |
|    |  Bottleneck util:  89% HARC      Bottleneck util:  76% HARC                         |    |
|    |  Plan adherence:   87%            Plan adherence:   91% (+4%)                       |    |
|    |  Lots affected:                   Lots affected:   18 moves                         |    |
|    |                                                                                     |    |
|    |  CHANGES (18)              ➜ Filter [All ▾]   [Show only diffs ▮]                  |    |
|    |  • PO-119 HARC      ETC-44 chamber B  →  ETC-07 chamber A (chamber drift)           |    |
|    |  • PO-120 HARC      Start 05-08  →  05-09 (+1d) (capacity)                          |    |
|    |  • PO-118 M1        on time, no change                                              |    |
|    |  • PO-122 WL        ETC-44 → ETC-09 (qual expiry)                                    |    |
|    |  • … 14 more                                                                        |    |
|    |                                                                                     |    |
|    |  [Discard Plan B]   [Edit Plan B]   [Commit Plan B → publish]                       |    |
+----+--------------------------------------------------------------------------------------+----+
```

### Components

| Region                    | Detail                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| Header                    | Plan picker for each side (any version: published, sim, branch, snapshot from time T)      |
| View-mode picker per side | Each side can independently show Gantt / Analysis / Workload (gives mixed comparisons too) |
| Synchronized scroll/zoom  | Time axis is shared; both sides scroll together                                            |
| Diff highlighting         | Bars that moved or rerouted get a `★` tag and a tooltip explaining the change              |
| Diff summary block        | KPI delta: commits-at-risk, bottleneck utilization, plan adherence, lot moves              |
| Changes list              | Itemized diff with rationale (chamber drift, capacity, qual expiry, hot lot, yield)        |
| Actions                   | Discard / Edit / Commit. Commit pushes Plan B to _Published_ and fans out notifications.   |

### AI / data dependencies

- Plan diff engine: compute (lot, step) deltas across two plan snapshots
- Rationale tagger: each diff gets a reason chain from the optimizer's log

### Open questions

- Three-way compare ever needed (published vs A vs B)?
- Diff at what granularity by default — step, stage, or family?
- Allow per-change "accept" (cherry-pick from Plan B into A) or only whole-plan commit?

---

## B. AI Chatbox

**Purpose** — Conversational what-if. Sarah types in natural language; AI returns ranked scenarios, explains tradeoffs, links to plan changes. The default Right Panel mode (matches the reference PNG).

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔] [👤] [⚙]            |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  Gantt (Simulation)                                                  |  🤖 AI Assistant◀⇄|
| 📈 +-----------------------------------------------------------------------+------------------+
| 📦 | (Gantt canvas from view 1)                                            | Plan A · M-SOC   |
| 🏭 |                                                                       | Context: 2 lots  |
| 🔧 |                                                                       | selected (PO-119 |
| 🌐 |                                                                       | PO-120)          |
| 🔌 |                                                                       |                  |
|    |                                                                       | ┌──────────────┐ |
|    |                                                                       | │ You          │ |
|    |                                                                       | │ What if      │ |
|    |                                                                       | │ ETC-44 down  │ |
|    |                                                                       | │ 6h and we    │ |
|    |                                                                       | │ insert hot   │ |
|    |                                                                       | │ lot HL-22?   │ |
|    |                                                                       | └──────────────┘ |
|    |                                                                       |                  |
|    |                                                                       | ┌──────────────┐ |
|    |                                                                       | │ 🤖 aPlanner  │ |
|    |                                                                       | │              │ |
|    |                                                                       | │ I found 3    │ |
|    |                                                                       | │ options:     │ |
|    |                                                                       | │              │ |
|    |                                                                       | │ ▶ A: Reroute │ |
|    |                                                                       | │   to ETC-07. │ |
|    |                                                                       | │   12 lots    │ |
|    |                                                                       | │   slip 2h.   │ |
|    |                                                                       | │   Cust B M1: │ |
|    |                                                                       | │   on time.   │ |
|    |                                                                       | │   [Preview]  │ |
|    |                                                                       | │              │ |
|    |                                                                       | │ ▶ B: Split   │ |
|    |                                                                       | │   to ETC-09. │ |
|    |                                                                       | │   Yield risk │ |
|    |                                                                       | │   +0.4% on   │ |
|    |                                                                       | │   QLC. [Pre.]│ |
|    |                                                                       | │              │ |
|    |                                                                       | │ ▶ C: Hold +  │ |
|    |                                                                       | │   pull-fwd 8 │ |
|    |                                                                       | │   wafer-     │ |
|    |                                                                       | │   starts. M1 │ |
|    |                                                                       | │   slips 18h. │ |
|    |                                                                       | │   [Preview]  │ |
|    |                                                                       | │              │ |
|    |                                                                       | │ Why A first? │ |
|    |                                                                       | │  • ETC-07    │ |
|    |                                                                       | │    qualified │ |
|    |                                                                       | │  • capacity  │ |
|    |                                                                       | │    available │ |
|    |                                                                       | │  • no yield  │ |
|    |                                                                       | │    impact    │ |
|    |                                                                       | └──────────────┘ |
|    |                                                                       |                  |
|    |                                                                       | [Quick prompts ▾]|
|    |                                                                       | • Insert hot lot |
|    |                                                                       | • Tool down     |
|    |                                                                       | • Pull commit   |
|    |                                                                       | • Yield drop    |
|    +-----------------------------------------------------------------------+ ┌──────────────┐ |
|    |                                                                       | │Ask AI…    [↑]│ |
|    +-----------------------------------------------------------------------+ └──────────────┘ |
+----+--------------------------------------------------------------------------------------+----+
```

### Components

| Region                                  | Detail                                                                                                                                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Panel header                            | Active plan, current selection context (what's selected in the Main View), `⇄` to switch panel mode                                                                                          |
| Conversation thread                     | Standard chat (user bubble + AI bubble). Long answers collapsible.                                                                                                                           |
| Scenario cards                          | Each scenario from AI is a card with: name, headline tradeoff (commitment, yield risk, capacity), `[Preview]` button. Preview opens Compare / Split mode with current Plan vs this scenario. |
| Explainability footer in each AI answer | "Why A first?" bullet list (constraint chain, data source, confidence). Same explainability spine as Concept §4.                                                                             |
| Quick prompts                           | Pre-built templates ("insert hot lot…", "tool down…", "pull commit…", "yield drop…") to reduce blank-input anxiety                                                                           |
| Input                                   | Free text + Send. Future: voice + image attachments.                                                                                                                                         |

### AI / data dependencies

- LLM with tool-use: optimizer is one of the tools (the LLM never makes infeasible recommendations because it must call the constraint engine)
- Selection context bridge: what's selected in the Main View flows into the chat session as system context
- Preview integration: scenario card `Preview` opens Split/Compare view pre-loaded with current plan + scenario

### Open questions

- Should the chatbox volunteer suggestions (push notifications) or only respond to prompts?
- Conversation memory across sessions — per planner? per shop floor?
- Voice input — useful for floor walks?
- Explainability depth: always show full chain, or expandable on click?

---

## C. Background Tasks

**Purpose** — Show running jobs: replans, simulations, exports, integrations. Sarah uses this to know "is the AI still thinking?" without blocking on a spinner.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔] [👤] [⚙]            |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  (Main view — any)                                                     | ⏳ Tasks      ◀⇄|
| 📈 |                                                                        +------------------+
| 📦 |                                                                        | RUNNING (2)     |
| 🏭 |                                                                        |                  |
| 🔧 |                                                                        | ⏳ Replan        |
| ⚙️ |                                                                        | Trigger: HARC PM |
| 🔌 |                                                                        | Started 06:18    |
|    |                                                                        | Progress ▮▮▮▮▮▯▯ |
|    |                                                                        | ETA ~12 s        |
|    |                                                                        | [Cancel]         |
|    |                                                                        |                  |
|    |                                                                        | ⏳ Simulation    |
|    |                                                                        | Plan B build     |
|    |                                                                        | Started 06:14    |
|    |                                                                        | ▮▮▮▮▮▮▮▮▮▯ 92%  |
|    |                                                                        | ETA ~3 s         |
|    |                                                                        |                  |
|    |                                                                        | RECENT (5)       |
|    |                                                                        |                  |
|    |                                                                        | ✓ Replan         |
|    |                                                                        | Trigger: yield Δ |
|    |                                                                        | 06:04 — 41 s     |
|    |                                                                        | Result: 12 mvs   |
|    |                                                                        | [Open in Compare]|
|    |                                                                        |                  |
|    |                                                                        | ✓ Export CSV     |
|    |                                                                        | 05:51 — 8 s      |
|    |                                                                        | [Download]       |
|    |                                                                        |                  |
|    |                                                                        | ✓ Sync SAP       |
|    |                                                                        | 05:30 — 1.4 s    |
|    |                                                                        |                  |
|    |                                                                        | ⚠ Sync KLA Yield |
|    |                                                                        | 05:15 — 16 min   |
|    |                                                                        | delay (retry…)   |
|    |                                                                        |                  |
|    |                                                                        | ✗ Replan         |
|    |                                                                        | 04:48 — failed   |
|    |                                                                        | (qual matrix     |
|    |                                                                        | inconsistency)   |
|    |                                                                        | [View logs]      |
+----+--------------------------------------------------------------------------------------+----+
```

### Components

| Region         | Detail                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Running list   | Active jobs with progress bar, ETA, cancel button, started-at timestamp                                                               |
| Recent list    | Last N completed jobs with status pill (✓ success, ⚠ warning, ✗ failed), duration, quick result, action (open / download / view logs) |
| Job categories | Replan · Simulation · Export · Sync · Tune-evidence send · Notification fan-out                                                       |

### AI / data dependencies

- Job queue with progress events (server-sent or WebSocket)
- Retry / failure capture; structured error messages tied to user-facing remediation

### Open questions

- Filtering by category? Sort order (latest-first vs in-progress-first)?
- Push notifications when a long job completes vs just badging the icon?
- "Re-run" affordance for failed jobs?

---

## D. Schedule Change History

**Purpose** — Audit trail. Sarah can answer "what changed between yesterday's plan and today's, who/what caused it, and can I revert?"

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔] [👤] [⚙]            |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  (Main view — any)                                                     | 🕘 History  ◀⇄|
| 📈 |                                                                        +------------------+
| 📦 |                                                                        | Filter [All ▾]   |
| 🏭 |                                                                        |                  |
| 🔧 |                                                                        | Today            |
| ⚙️ |                                                                        | ┌──────────────┐ |
| 🔌 |                                                                        | │06:18 commit  │ |
|    |                                                                        | │Sarah Chen    │ |
|    |                                                                        | │"Reroute      │ |
|    |                                                                        | │ ETC-44 → 07" │ |
|    |                                                                        | │12 lot moves  │ |
|    |                                                                        | │[Diff][Revert]│ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        |                  |
|    |                                                                        | ┌──────────────┐ |
|    |                                                                        | │06:04 replan  │ |
|    |                                                                        | │🤖 AI         │ |
|    |                                                                        | │Trigger:      │ |
|    |                                                                        | │ yield Δ −1.4%│ |
|    |                                                                        | │5 lot moves   │ |
|    |                                                                        | │Sarah approved│ |
|    |                                                                        | │[Diff]        │ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        |                  |
|    |                                                                        | ┌──────────────┐ |
|    |                                                                        | │04:48 replan  │ |
|    |                                                                        | │🤖 AI failed  │ |
|    |                                                                        | │Trigger:      │ |
|    |                                                                        | │ qual expiry  │ |
|    |                                                                        | │[View logs]   │ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        |                  |
|    |                                                                        | Yesterday        |
|    |                                                                        | ┌──────────────┐ |
|    |                                                                        | │18:22 commit  │ |
|    |                                                                        | │Sarah Chen    │ |
|    |                                                                        | │End-of-day    │ |
|    |                                                                        | │publish       │ |
|    |                                                                        | │47 lot moves  │ |
|    |                                                                        | │[Diff][Revert]│ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        | ┌──────────────┐ |
|    |                                                                        | │14:11 tune    │ |
|    |                                                                        | │📈 Process    │ |
|    |                                                                        | │SG-014 −8.2%  │ |
|    |                                                                        | │HARC R-QLC-CH │ |
|    |                                                                        | │Sent to PE    │ |
|    |                                                                        | │[Evidence]    │ |
|    |                                                                        | └──────────────┘ |
+----+--------------------------------------------------------------------------------------+----+
```

### Components

| Region     | Detail                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| Filter     | All / Commits / AI replans / Tunes / Imports                                                               |
| Grouping   | By day (Today, Yesterday, This Week, Older)                                                                |
| Entry card | Time · type · actor (Sarah, AI, system) · trigger / label · summary (lot moves count, or tune Δ) · actions |
| Actions    | Diff (open Compare with this snapshot) · Revert · View logs · Evidence (for tunes)                         |

### AI / data dependencies

- Append-only event store of plan mutations (git-like)
- Each entry links to the snapshot it produced so Diff works cleanly

### Open questions

- Retention window? 30 days? 1 year?
- Revert semantics — fully revert vs cherry-pick changes back?
- Authorization — can anyone revert, or only the original author + Ops Mgr?

---

## E. Recommendations

**Purpose** — AI-pushed (proactive) suggestions ranked by impact. Sarah skims here when she's not actively replanning to catch high-leverage opportunities the AI noticed.

### Wireframe

```
+----+--------------------------------------------------------------------------------------+----+
| ≡▦ |  M-SOC ▾ | Plan A (Simulation) ▾                       [⊟] [🔔ⓘ5] [👤] [⚙]          |    |
+----+--------------------------------------------------------------------------------------+----+
| 📊 |  (Main view — any)                                                     | 💡 Recs     ◀⇄|
| 📈 |                                                                        +------------------+
| 📦 |                                                                        | New (5)          |
| 🏭 |                                                                        |                  |
| 🔧 |                                                                        | ┌──────────────┐ |
| ⚙️ |                                                                        | │ HIGH         │ |
| 🔌 |                                                                        | │ ★★★★         │ |
|    |                                                                        | │ Hot-lot      │ |
|    |                                                                        | │ HL-22        │ |
|    |                                                                        | │              │ |
|    |                                                                        | │ Cust A req.  │ |
|    |                                                                        | │ Insert       │ |
|    |                                                                        | │ before 06-01.│ |
|    |                                                                        | │              │ |
|    |                                                                        | │ Impact:      │ |
|    |                                                                        | │ +1 lot ripple│ |
|    |                                                                        | │ 4 commits ok │ |
|    |                                                                        | │              │ |
|    |                                                                        | │[Preview][Skip│ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        |                  |
|    |                                                                        | ┌──────────────┐ |
|    |                                                                        | │ HIGH         │ |
|    |                                                                        | │ ★★★★         │ |
|    |                                                                        | │ Probe        │ |
|    |                                                                        | │ over-cap     │ |
|    |                                                                        | │              │ |
|    |                                                                        | │ Days 01-03   │ |
|    |                                                                        | │ Probe E-Test │ |
|    |                                                                        | │ 89% (warn).  │ |
|    |                                                                        | │              │ |
|    |                                                                        | │ Suggestion:  │ |
|    |                                                                        | │ shift Cust C │ |
|    |                                                                        | │ 5 lots −1d.  │ |
|    |                                                                        | │              │ |
|    |                                                                        | │ [Preview]    │ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        |                  |
|    |                                                                        | ┌──────────────┐ |
|    |                                                                        | │ MED  ★★★     │ |
|    |                                                                        | │ Tune SG-014  │ |
|    |                                                                        | │ HARC R-QLC-CH│ |
|    |                                                                        | │ −8.2% time   │ |
|    |                                                                        | │ +12h on Cust │ |
|    |                                                                        | │ B M1 commit  │ |
|    |                                                                        | │ [Open tune]  │ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        |                  |
|    |                                                                        | ┌──────────────┐ |
|    |                                                                        | │ LOW  ★★      │ |
|    |                                                                        | │ Qual expiry  │ |
|    |                                                                        | │ ETC-44 ch C  │ |
|    |                                                                        | │ R-QLC-CH     │ |
|    |                                                                        | │ exp 06-12    │ |
|    |                                                                        | │ Schedule re- │ |
|    |                                                                        | │ qual?        │ |
|    |                                                                        | │ [Open]       │ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        |                  |
|    |                                                                        | ┌──────────────┐ |
|    |                                                                        | │ LOW  ★       │ |
|    |                                                                        | │ Idle capac.  │ |
|    |                                                                        | │ WL Tungsten  │ |
|    |                                                                        | │ days 1-5     │ |
|    |                                                                        | │ Pull-fwd     │ |
|    |                                                                        | │ candidates?  │ |
|    |                                                                        | │ [Preview]    │ |
|    |                                                                        | └──────────────┘ |
|    |                                                                        |                  |
|    |                                                                        | [Skipped (12) ▾] |
+----+--------------------------------------------------------------------------------------+----+
```

### Components

| Region              | Detail                                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recommendation card | Priority chip (HIGH/MED/LOW) + star score + headline title + one-paragraph rationale with impact + actions                                                                  |
| Actions per card    | `Preview` (opens Compare view if it's a plan change, or the right tuning/qual screen otherwise) · `Skip` (dismiss; learn from this) · `Open` for non-plan recs (tune, qual) |
| Skipped accordion   | Collapsible section of dismissed recommendations; affects model learning                                                                                                    |
| Priority logic      | High = directly impacts a committed milestone; Med = improves a KPI; Low = housekeeping                                                                                     |

### AI / data dependencies

- Recommendation engine: continuously scans plan + data for opportunities (hot lots, over-capacity, tunes, qual expiry, idle capacity, yield offset)
- Scoring model: impact (commitment risk, lot count, capacity freed) × confidence × urgency
- Feedback loop: skip behavior trains the model to suppress similar recs

### Open questions

- Frequency — push throttle? Sarah shouldn't see 50 new recs every morning.
- Whose authority on "skip"? Personal preference vs shop-floor-wide?
- How to surface high-impact recs that need cross-team action (qual re-cert needs EE)?
- Mix between proactive recs and AI-Chatbox conversational use — is there overlap risk?

---

_End of right-panel modes. Cross-reference the main views in [01-main-views.md](01-main-views.md). Shell + design tokens in [README.md](README.md)._
