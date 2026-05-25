# Dynamic Schedule — Screen Flow Diagrams

> Mermaid screen-flow and state diagrams showing how Sarah (Senior Production Planner) moves between the views during typical Dynamic Scheduling tasks. Companion to [README.md](README.md), [01-main-views.md](01-main-views.md), [02-right-panels.md](02-right-panels.md).
>
> **Date**: 2026-05-25 · **Status**: Draft v1

---

## 1. Top-level navigation graph

How the views relate. Main views (left rail) are independent of right panels (right rail) — Sarah can pair any main view with any right panel — except **Compare / Split**, which takes over the workspace.

```mermaid
flowchart LR
    classDef main fill:#E3F2FD,stroke:#1976D2,stroke-width:2px,color:#0D47A1
    classDef right fill:#FFF3E0,stroke:#F9A825,stroke-width:2px,color:#5D4037
    classDef takeover fill:#FCE4EC,stroke:#C2185B,stroke-width:2px,color:#880E4F
    classDef entry fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,color:#1B5E20

    subgraph Entry [Entry points]
        Login[Login / Daily digest]
        Notif[🔔 Notification click]
        Replan[Replan event fired]
    end

    subgraph MainViews [Main Views — Left Rail]
        Gantt[📊 Gantt - Simulation]
        Analysis[📈 Analysis View]
        PO[📦 Production Order]
        Cap[🏭 Shop Floor Capacity]
        PTune[🔧 Process Tuning]
        CTune[⚙️ Capacity Tuning]
        Data[🔌 Data Integration]
    end

    subgraph RightPanels [Right Panels — Right Rail]
        AI[🤖 AI Chatbox]
        Bg[⏳ Background Tasks]
        Hist[🕘 Change History]
        Recs[💡 Recommendations]
    end

    Compare[⇄ Compare / Split — takeover]:::takeover

    Login --> Gantt
    Notif --> Recs
    Replan --> Recs

    Gantt -.pair.-> AI
    Gantt -.pair.-> Recs
    Gantt -.pair.-> Bg
    Gantt -.pair.-> Hist
    Analysis -.pair.-> AI
    Analysis -.pair.-> Recs
    PO -.pair.-> AI
    Cap -.pair.-> AI

    Gantt -- click bar --> BatchDrawer[Batch Detail Drawer]
    Gantt -- bottleneck click --> Analysis
    Analysis -- tool group click --> Cap
    PO -- replan PO --> Gantt
    Cap -- tune capacity --> CTune
    Cap -- spc trends --> PTune

    Recs -- Preview --> Compare
    AI -- Preview scenario --> Compare
    Hist -- Diff --> Compare

    Compare -- Commit --> Gantt
    Compare -- Discard --> Gantt

    PTune -- Send to PE --> Data
    CTune -- Send to EE --> Data

    class Gantt,Analysis,PO,Cap,PTune,CTune,Data main
    class AI,Bg,Hist,Recs right
    class Login,Notif,Replan entry
```

---

## 2. Monday-morning flow — "what happened over the weekend?"

Sarah arrives at 6:45 am. The system already replanned overnight on three events; she reviews, edits, commits.

```mermaid
flowchart TD
    classDef sys fill:#E3F2FD,stroke:#1976D2,color:#0D47A1
    classDef sarah fill:#E8F5E9,stroke:#2E7D32,color:#1B5E20
    classDef ai fill:#FFF3E0,stroke:#F9A825,color:#5D4037
    classDef decide fill:#FCE4EC,stroke:#C2185B,color:#880E4F

    Start([Sarah logs in 06:45]):::sarah
    Digest[/Daily Digest banner: 3 weekend events,<br/>AI proposed replan ready/]:::sys
    OpenRecs[Open 💡 Recommendations panel]:::sarah
    SeeRecs[3 HIGH recs:<br/>• Hot-lot HL-22<br/>• HARC overload days 8-10<br/>• Yield Δ -1.4% on 232L QLC]:::ai
    PreviewA{Preview rec #2:<br/>HARC overload}:::decide
    Compare1[⇄ Compare opens:<br/>Published vs Plan B AI-proposed]:::sys
    Review[Sarah reviews 18 diffs:<br/>12 reroutes ETC-44 to ETC-07/09<br/>6 timing shifts]:::sarah
    Edit{Need edits?}:::decide
    EditGantt[Back to 📊 Gantt:<br/>drag PO-119 Batch 3 to honor<br/>customer A request]:::sarah
    AskAI[🤖 AI Chatbox:<br/>'shift PO-119/B3 by -1d, ripple?']:::sarah
    AIReply[AI returns 2 options<br/>with ripple analysis]:::ai
    PickB[Pick option B,<br/>Preview in Compare]:::sarah
    Compare2[⇄ Compare:<br/>Plan B vs Plan B-edited]:::sys
    Commit[Click 'Commit Plan B-edited']:::sarah
    Fanout[/Auto-fanout:<br/>email to 15 stakeholders,<br/>dispatch cards to floor,<br/>commitment updates to BizDev/]:::sys
    Done([Done in ~25 min<br/>vs 3-4 hr today]):::sarah

    Start --> Digest --> OpenRecs --> SeeRecs --> PreviewA
    PreviewA --> Compare1 --> Review --> Edit
    Edit -- No, accept as-is --> Commit
    Edit -- Yes --> EditGantt --> AskAI --> AIReply --> PickB --> Compare2 --> Commit
    Commit --> Fanout --> Done
```

---

## 3. Mid-day yield excursion replan

A 232L QLC yield drop fires at probe. The system raises a HIGH recommendation; Sarah investigates and replans.

```mermaid
sequenceDiagram
    autonumber
    participant Probe as KLA Yield (probe)
    participant Engine as aPlanner replan engine
    participant Recs as 💡 Recommendations
    participant Sarah as Sarah Chen
    participant Gantt as 📊 Gantt
    participant Analysis as 📈 Analysis
    participant AI as 🤖 AI Chatbox
    participant Compare as ⇄ Compare
    participant BizDev as BizDev / Customer

    Probe->>Engine: Yield -3σ on 232L QLC (lot L-5512)
    Engine->>Engine: Detect event, propose Plan B
    Engine->>Recs: HIGH rec: 'Yield excursion → 12-lot quarantine + replan?'
    Recs-->>Sarah: 🔔 notification
    Sarah->>Recs: Open panel, click rec
    Sarah->>Analysis: Drill into KPI 'Yield Δ -1.4%'
    Analysis-->>Sarah: Show affected lots, suspected chamber (ETC-44/B)
    Sarah->>AI: 'Quarantine ETC-44 ch B lots from last 24h, replan'
    AI->>Engine: Tool-use: re-optimize with quarantine constraint
    Engine-->>AI: 2 scenarios returned
    AI-->>Sarah: Scenario A (reroute) / Scenario B (split + holdback)
    Sarah->>Compare: Preview Scenario A
    Compare-->>Sarah: Plan A vs Scenario A diff (12 moves, Cust B M1 +6h)
    Sarah->>Compare: Edit one batch manually
    Sarah->>Compare: Click 'Commit'
    Compare->>Engine: Publish new plan version
    Engine->>BizDev: Auto-update Cust B commitment (M1 06h slip)
    Engine-->>Sarah: ✓ Committed. 12 lots quarantined. Cust B notified.
```

---

## 4. Hot-lot insertion flow

A customer escalation arrives. Sarah inserts a hot lot directly on the Gantt with ripple preview.

```mermaid
flowchart TD
    classDef sarah fill:#E8F5E9,stroke:#2E7D32,color:#1B5E20
    classDef sys fill:#E3F2FD,stroke:#1976D2,color:#0D47A1
    classDef ai fill:#FFF3E0,stroke:#F9A825,color:#5D4037
    classDef decide fill:#FCE4EC,stroke:#C2185B,color:#880E4F

    Trigger([Customer A escalates HL-22<br/>via Account Mgmt → Sarah]):::sarah
    OpenPO[Open 📦 Production Order]:::sarah
    FindPO[Find PO-2025-118<br/>mark lot HL-22 as ★HOT P1]:::sarah
    BackGantt[Switch to 📊 Gantt]:::sarah
    DragHot[Drag HL-22 to target slot<br/>before 06-01 milestone]:::sarah
    Ripple[/Real-time ripple preview:<br/>3 downstream lots shift +18h<br/>1 commitment at risk/]:::sys
    OK{Ripple acceptable?}:::decide
    AskAI[🤖 AI: 'minimize impact<br/>of inserting HL-22 before 06-01']:::sarah
    Suggest[AI suggests:<br/>insert HL-22 + bump PO-120/B2 by -1d<br/>(idle capacity available on day -1)]:::ai
    PreviewB[⇄ Compare:<br/>preview AI plan]:::sys
    Confirm[Click 'Commit']:::sarah
    Fanout[/Notify Cust A + floor + BizDev<br/>HL-22 confirmed before 06-01/]:::sys
    History[🕘 History entry:<br/>'06:42 commit · Sarah · Hot lot HL-22']:::sys
    Done([Done ~8 min]):::sarah

    Trigger --> OpenPO --> FindPO --> BackGantt --> DragHot --> Ripple --> OK
    OK -- Yes --> Confirm
    OK -- No --> AskAI --> Suggest --> PreviewB --> Confirm
    Confirm --> Fanout --> History --> Done
```

---

## 5. Process Tuning workflow

AI detects HARC etch consistently running faster than spec. Sarah reviews evidence, accepts the tune, and sends the package to Process Engineering.

```mermaid
flowchart LR
    classDef ai fill:#FFF3E0,stroke:#F9A825,color:#5D4037
    classDef sarah fill:#E8F5E9,stroke:#2E7D32,color:#1B5E20
    classDef sys fill:#E3F2FD,stroke:#1976D2,color:#0D47A1
    classDef pe fill:#F3E5F5,stroke:#7B1FA2,color:#4A148C

    SPC[/SPC stream: HARC R-QLC-CH<br/>median 31.2 min vs spec 34 min<br/>n=412, 96% confidence/]:::ai
    Detect[Auto-detect: out of control<br/>raise SG-014]:::ai
    Notify[🔔 badge on 🔧 Process Tuning]:::sys
    Open[Sarah opens 🔧 Process Tuning]:::sarah
    Review[Review SG-014:<br/>SPC chart, schedule impact<br/>+520 wafer-passes/wk freed,<br/>Cust B M1 -12h]:::sarah
    Decide{Accept?}:::sarah
    Accept[Click 'Accept tune']:::sarah
    Apply[/System applies tune<br/>to current Plan A simulation/]:::sys
    Send[Click 'Send evidence to PE']:::sarah
    Pkg[/Evidence package:<br/>SPC run chart,<br/>control limits,<br/>schedule impact analysis/]:::sys
    PE[Process Engineer<br/>review task created]:::pe
    Confirm{PE approves?}:::pe
    Spec[Spec updated:<br/>R-QLC-CH process time 31.2 min]:::pe
    Reject[Tune marked rejected<br/>plan reverts to spec value]:::sys

    SPC --> Detect --> Notify --> Open --> Review --> Decide
    Decide -- Yes --> Accept --> Apply --> Send --> Pkg --> PE --> Confirm
    Confirm -- Yes --> Spec
    Confirm -- No --> Reject
    Decide -- No --> Reject
```

---

## 6. Plan version state diagram

The lifecycle of a plan. Multiple simulations can exist in parallel; only one is _Published_ at a time.

```mermaid
stateDiagram-v2
    [*] --> Draft: New plan / branch from Published

    Draft --> Simulation: Optimizer run completes
    Simulation --> Simulation: Manual edit or AI refinement
    Simulation --> Comparing: Open in ⇄ Compare
    Comparing --> Simulation: Continue editing
    Comparing --> Published: Commit (fan-out fires)

    Published --> Active: Floor receives dispatch
    Active --> Active: Move events update WIP
    Active --> Simulation: New event fires (auto-replan)
    Active --> Archived: Superseded by new Published plan

    Simulation --> Discarded: Sarah discards
    Discarded --> [*]
    Archived --> [*]

    note right of Published
        Only ONE plan can be
        in this state at a time
        (per shop floor)
    end note

    note right of Active
        Anchored zones:
        Frozen 0-72h · Flex 72h-4w · Far 4-14w
    end note
```

---

## 7. Event → response routing

Which events trigger which UI surface. Keeps Sarah in control without overwhelming her.

```mermaid
flowchart LR
    classDef event fill:#FFEBEE,stroke:#C62828,color:#B71C1C
    classDef ai fill:#FFF3E0,stroke:#F9A825,color:#5D4037
    classDef ui fill:#E3F2FD,stroke:#1976D2,color:#0D47A1
    classDef action fill:#E8F5E9,stroke:#2E7D32,color:#1B5E20

    subgraph Events
        EvEqDown[Equipment down<br/>unplanned]:::event
        EvYield[Yield excursion<br/>3σ]:::event
        EvHot[Hot-lot insertion]:::event
        EvSPC[SPC alarm /<br/>chamber drift]:::event
        EvDemand[Demand revision]:::event
        EvMat[Material shortage]:::event
        EvQual[Qual expiry approaching]:::event
        EvPM[Planned PM]:::event
    end

    subgraph Engine
        Severity{Severity<br/>+ scope}:::ai
    end

    subgraph Surfaces
        FrozenAlert[🔔 + auto-replan<br/>frozen-zone override<br/>requires confirm]:::ui
        HighRec[💡 HIGH recommendation]:::ui
        MedRec[💡 MED recommendation]:::ui
        LowRec[💡 LOW recommendation]:::ui
        Tune[🔧 Tuning queue]:::ui
        Quiet[Silent log<br/>next batch replan]:::ui
    end

    Done[Sarah action:<br/>preview / commit / skip]:::action

    EvEqDown --> Severity
    EvYield --> Severity
    EvHot --> Severity
    EvSPC --> Severity
    EvDemand --> Severity
    EvMat --> Severity
    EvQual --> Severity
    EvPM --> Severity

    Severity -- HIGH + frozen zone --> FrozenAlert
    Severity -- HIGH + flex zone --> HighRec
    Severity -- MED --> MedRec
    Severity -- LOW --> LowRec
    Severity -- statistical tune --> Tune
    Severity -- planned PM in baseline --> Quiet

    FrozenAlert --> Done
    HighRec --> Done
    MedRec --> Done
    LowRec --> Done
    Tune --> Done
```

---

## 8. How to read these diagrams

- **Solid arrows** = mandatory transitions or data flow
- **Dotted arrows** (`-.->`) = optional pairings (e.g. any main view can pair with any right panel)
- **Color coding**:
  - 🟦 Blue = system / UI surface
  - 🟩 Green = Sarah's action
  - 🟧 Orange = AI / engine
  - 🟪 Purple = cross-team handoff (Process Eng, Equipment Eng, BizDev)
  - 🟥 Pink = decision point / takeover view
- All flows assume the **anchored-replan** stability model (frozen 0–72h · flex 72h–4w · far 4–14w) from [T14 Concept §5 Pillar A](../../ideation/T14-concept-dynamic-schedule.md#pillar-a--living-mps-generation-continuous-re-plan-engine).

---

## 9. Open questions for flow validation

1. **Daily digest entry point** — banner on first login, or separate "Inbox" surface? Diagram 2 assumes banner.
2. **AI Chat vs Recommendations overlap** — when does the AI proactively push to Recs vs wait to be asked in Chat? Severity matters; cadence is the open question.
3. **Frozen-zone override UX** — should a high-severity event in the frozen zone _auto-apply_ with banner-after, or _always require_ explicit Sarah confirm? Diagram 7 assumes the latter.
4. **Cross-team async** — when Sarah sends a tune to PE (diagram 5), does she keep working in the same simulation, or does the plan branch? Diagram 5 assumes simulation continues; PE approval back-merges later.
5. **Multi-event coincidence** — if 3 high-severity events fire within 10 minutes, do we batch into one replan recommendation or surface three? Diagram 7 lacks this nuance.

---

_Diagrams are illustrative and tied to T14 v1. Update alongside the concept doc as flows are validated with real planners._
