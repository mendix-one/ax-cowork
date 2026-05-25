# T14 — Concept: Dynamic Scheduling / Master Production Schedule

> **Task ID**: T14 (companion to [T14 — Concept Sketch Cards](T14-concept-sketches.md), Concept 1: _Smart Scheduler_)
> **Phase**: DESIGN — Ideation deep-dive for the Dynamic Scheduling feature
> **Status**: Draft v1 — for SWAT review
> **Date**: 2026-05-25
> **Author**: CPO (with AI assistance)
> **Inputs**:
>
> - [`ideation-note.txt`](ideation-note.txt) — Idea 1 seed
> - [`aPlanner - Ideation Workshop 2.vtt`](aPlanner%20-%20Ideation%20Workshop%202.vtt) — full workshop transcript
> - [`08_RESEARCH/wafer-nand-manufacturing-for-mps.md`](../../08_RESEARCH/wafer-nand-manufacturing-for-mps.md) — domain synthesis (this doc's primary technical reference)
> - [T08 Problem Statement PS-1](../../01_DISCOVER/validation/T08-problem-statements.md), [T07 Persona — Sarah Chen](../../01_DISCOVER/synthesis/T07-personas.md)
>   **AX Lens Dominance**: Empathy (High) · Speed (High) · Validation (Medium) · Governance (Medium)

---

## 1. What this document is

This is the concept deep-dive for **Dynamic Scheduling** — aPlanner's flagship feature for Sarah Chen, the Senior Production Planner. It expands on Concept 1 _Smart Scheduler_ from [T14 concept-sketches](T14-concept-sketches.md) by grounding the design in (a) the workshop conversation about the actual planner workflow and (b) the wafer + NAND manufacturing research in [`08_RESEARCH/wafer-nand-manufacturing-for-mps.md`](../../08_RESEARCH/wafer-nand-manufacturing-for-mps.md).

The point of this doc: lock the concept tight enough that we can prototype it, but flexible enough that DESIGN-phase validation with real planners can still reshape it. Every numbered claim points back to a source.

> **Reminder**: The DISCOVER artifacts that anchor PS-1 and Sarah Chen are flagged SYNTHETIC (banner from command 024, reset 2026-04-27). Treat the persona/problem framing as design hypotheses to validate, not validated requirements.

---

## 2. Problem framing — what "Dynamic Scheduling" must solve

| Dimension           | Today (PS-1)                                          | Target with Dynamic Scheduling                                              |
| ------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------- |
| MPS generation time | 3–5 days, manual + Excel                              | < 4 hours initial; minutes per replan                                       |
| Replan cadence      | Weekly batch + ad-hoc manual patching                 | Continuous, event-triggered                                                 |
| Plan obsolescence   | Plan is wrong by Wednesday                            | Plan is current to last event ≤ minutes                                     |
| Scenario generation | 2–3 hrs/scenario in Excel                             | 3 ranked scenarios in < 60 s                                                |
| Constraint coverage | Tool-group capacity only; yield/qual handled mentally | Tool-group × recipe × chamber-qual; reentrant flow; cycle-time distribution |
| Communication       | Email 15+ stakeholders                                | Commit/diff workflow with auto-notify                                       |
| Trust model         | "I'll re-check everything in Excel"                   | Every recommendation explainable to floor + ops manager                     |

The shift is **from a batch artifact (the weekly plan) to a living artifact (the current plan + an event-driven re-optimization engine)**.

---

## 3. Persona anchor — Sarah Chen's day with Dynamic Scheduling

Sarah arrives at 6:45 am. Instead of opening five Excel workbooks, she opens aPlanner's **MPS view**. Overnight, three events fired (an unplanned ETC-04 chamber failure, a +3% yield drop on 232L QLC at probe, and a hot-lot insertion request from Customer A). The system has already drafted a **proposed re-plan**, ranked alongside the current published plan and one alternative. Each option shows:

- **Commitment impact**: which customer milestones move, by how much
- **Workload impact**: which tool groups go red, which stay green
- **Risk impact**: P50/P80/P95 wafer-out dates per affected lot
- **Why**: the constraint chain ("ETC-04 chamber B down 6 h → 12 lots reroute to ETC-07 and ETC-09, both qualified for this recipe → +4 h on L2 critical path; QLC yield drop offset by +400 wafer starts in 232L next 48 h")

She reviews, edits two batches manually (drags one earlier on the Gantt to honor a hot lot, sees ripple analysis live), commits. The system fans out notifications to the 15 stakeholders she'd have emailed by hand today. Time spent: ~25 minutes vs the 3–4 hours she'd have lost to Monday morning rebuilds.

---

## 4. Concept vision

**Dynamic Scheduling** turns the Master Production Schedule from a weekly batch artifact into a **living, event-driven plan** that re-optimizes continuously against real-time fab constraints, presents the planner with a small set of ranked, fully explainable scenarios, and supports a planner-in-the-loop commit workflow with cross-functional fan-out.

> **Tagline**: _"Plan that breathes with the fab — not one that breaks at noon."_

Three properties non-negotiable from day one:

1. **NAND-native** — reentrant flow, tool-group × recipe × chamber-qualification, batch-tool formation, cycle-time as distribution are first-class. (See [research §5, §6, §7](../../08_RESEARCH/wafer-nand-manufacturing-for-mps.md#5-reentrant-flow--the-defining-property-of-semiconductor-scheduling))
2. **Explainable** — every recommendation surfaces its constraint chain, data source, confidence, and next-best alternative. Sarah must be able to defend the plan to Jennifer (Ops Mgr) and the floor on demand. (See [DISCOVER Insight 3](../../01_DISCOVER/synthesis/T06-affinity-map.md#insight-3-explainability-is-the-gatekeeper-for-ai-adoption))
3. **Stable enough to trust** — anchored replanning: the next 24–72 h is pinned; 1–4 weeks is flexible; 4–14 weeks is fully malleable. No 5-minute reoptimization whiplash.

---

## 5. Five feature pillars

### Pillar A — Living MPS generation (continuous re-plan engine)

- **Auto-generate** the MPS from all active production orders, current WIP/equipment state, manufacturing process constraints, and capacity constraints.
- **Event-driven re-optimization**: each replan trigger (see §9) re-runs the optimizer incrementally, never from scratch.
- **Anchored zones**:
  - **Frozen zone** (0–72 h): committed; only critical events (hot lot, equipment down) can move it; every move requires planner confirm
  - **Flex zone** (72 h–4 wk): re-optimized freely on event; planner sees diffs
  - **Far zone** (4–14 wk): full malleability; AI explores
- **Monday isn't from scratch**: weekend events have already been folded into the current plan + a digest is waiting for Sarah.

### Pillar B — Multi-scenario simulation (Gantt + scenario tabs)

- **Gantt chart** as the primary canvas. Hierarchy: Production Order → Production Family / Batch → Stage → Step. Each batch shows its milestones (with date + shipment commitment).
- **Scenario versions** generated by AI with different objective weights:
  - **Best-case / Throughput** — maximize wafer-out
  - **Cost-optimized** — minimize tool utilization + workforce + energy
  - **Lead-time-optimized** — minimize cycle time / X-factor
  - (Planner can request custom weights via the AI prompt — see Pillar D)
- **Side-by-side diff view** — compare two scenarios, highlight which batches moved, which tool groups flipped color, which commitments shifted.
- **Drag-to-shift** a batch on the Gantt → real-time workload recompute → ripple analysis (which downstream commits move, by how much).

### Pillar C — Analysis view (decision support)

The view Sarah uses to _defend_ a plan to Jennifer or the VP. Includes:

| Panel                                | What it shows                                                                                    | Why it matters                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| **Workload-per-tool-group heatmap**  | Daily stacked workload vs effective capacity (with OEE applied), safe / warning / overload bands | Surfaces the bottleneck and any constraint violation at a glance |
| **Bottleneck shift indicator**       | Live indicator of which tool group is the binding constraint right now and over the horizon      | In reentrant flow, bottleneck moves; planner must see it move    |
| **Commitment risk panel**            | P50 / P80 / P95 wafer-out dates per customer commitment                                          | Cycle time is a distribution; single dates lie                   |
| **Constraint chain breakdown**       | For a selected batch: every qualification, chamber match, PM window, recipe-tool eligibility     | Sarah can answer "why this slot?" instantly                      |
| **Workforce / cost / material view** | Optional overlays for those optimization axes                                                    | Lets ops + finance see their angle on the same plan              |
| **Process & capacity validation**    | Lists any over-capacity day, any unqualified route, any expired qualification                    | Pre-commit safety net                                            |

### Pillar D — AI-directed optimization (planner-in-the-loop)

- **Conversational "ask the AI"**: Sarah types ("what if ETC-04 down 6 h + insert hot lot HL-22 + yield −3% on 232L QLC?") → system returns 2–3 ranked options with tradeoff explanations in seconds. Replaces the 2–3 hours per scenario in Excel today.
- **Planner-requested optimizations**:
  - "Pull Customer A's Milestone 1 in by 5 days — show me what gives."
  - "I want to keep Batch B17 on its current commit; reroute the rest."
  - "Apply hot-lot priority to lots tagged HL-\* and re-optimize."
- **Constrained AI**: every AI suggestion is filtered through the constraint engine before display. No "physically impossible" plans.
- **Shadow → Suggest → Auto** progression:
  - Days 1–30: AI computes alongside Sarah's plan; she sees the delta
  - Days 31–90: AI proposes, Sarah one-click approves
  - Day 91+: bounded auto-execute within a pre-approved policy envelope (e.g., auto-reroute hot lots ≤ 2 routes deep, auto-replan on PM events under N hours)

### Pillar E — Tuning Logic (process & capacity calibration loop)

Captured from the workshop: planners know the spec process time often diverges from actual SPC/FPC data. Tuning Logic systematizes this:

1. Planner enters a batch into a tool group.
2. System compares **spec process time** (e.g., 30 min/chamber from Process Engineering) against **historical SPC/FPC data** for that tool group + recipe (last N weeks).
3. If actuals are consistently faster/slower (statistically significant against control limits), system offers a **tuning suggestion** ("Tool Group HARC-A running 8% faster than spec; tune −8% on this step?").
4. Planner reviews evidence (run chart + SPC limits) and accepts/rejects.
5. Tuned parameter is used for _this plan_; tuning evidence + run-chart context is **sent back to Process Engineering** for spec update consideration.
6. Symmetric logic for **capacity tuning** (Equipment Engineering) — if a tool group consistently delivers more/fewer wafer-passes than nominal, suggest a capacity tune.

This is the **knowledge-capture loop** from DISCOVER Insight 4 ("knowledge cliff") in production form — Sarah's tacit knowledge of "Tool Group X runs hot lately" becomes structured tuning evidence that survives her retirement.

---

## 6. Domain data model (the schedulable unit)

The model the AI scheduler operates on. Derived from the workshop hierarchy + research §5–§6:

```
Production Order  (from customer or top-down)
├─ Customer / Product Line / Priority
├─ Commitments (milestones: date + quantity + shipment terms)
└─ Production Family  (= "best" / batch group; one PO can spawn many)
   ├─ Spec  (product specification)
   └─ Process  (master process flow for this family)
      └─ Stage  (major phase: e.g., FEOL Lithography, BEOL Metallization)
         └─ Step  (sub-process; one entry per visit, NOT per logical op)
            ├─ step_index             ← first-class; the same lot revisits the same (tool_group, recipe) many times
            ├─ Recipe                 ← exact processing parameters
            ├─ Tool Group             ← e.g., "232L HARC Etch"
            │   ├─ Tool (machine)     ← e.g., ETCH-44
            │   │   └─ Chamber        ← multi-chamber cluster tools (A/B/C/D)
            │   └─ Qualification matrix  (recipe × tool × chamber → qualified? expiry date)
            ├─ Process Time           ← distribution (P50/P80/P95), not point estimate
            ├─ Capacity               ← effective wafers/hr after OEE + utilization target
            └─ PM Calendar            ← planned + predicted unplanned downtime
```

Flow units: **Wafer Start → Move (per step completion) → Wafer Out**.

**Schedulable unit = `(lot, step_index, tool_group, recipe)`** — not `(lot, operation)`. Reentrancy makes step_index first-class. (See research §5, design implication 1.)

---

## 7. Key screens (concept-level)

1. **MPS Home (Gantt canvas)** — primary canvas. Production Orders → Families → Stages → Steps. Toggle: by customer / by tool group / by stage. Drag-to-shift. Color = on-track / at-risk / slipped / hot-lot.
2. **Scenario Tabs** — Plan A (current published) / Plan B / Plan C. Each has its own Gantt; **Compare** button opens side-by-side diff.
3. **Analysis View** — workload heatmap, bottleneck indicator, commitment-risk panel, constraint validation list (see Pillar C).
4. **Batch Detail Drawer** — click a batch on the Gantt → drawer shows recipe, tool groups, process times (with distributions), chamber qualification, current WIP, predicted milestones with P50/P80/P95.
5. **Replan Inbox** — feed of events that triggered replans, with each event's proposed change + planner action (review / approve / reject / ignore).
6. **What-If Prompt** — chat-style input docked beside the Gantt. Sarah types natural language; AI returns ranked options.
7. **Tuning Console** — list of pending tuning suggestions (process-time tunes, capacity tunes) with SPC evidence + send-to-PE/EE workflow.
8. **Commit & Diff View** — git-style review of the proposed plan vs the currently published plan. Sarah comments / approves / merges; commit fans out notifications.
9. **Tool Group Drilldown** — selecting a tool group on the heatmap → daily wafer count, SPC chart, equipment status (running / holding / down), qualified recipes, current chamber states.
10. **Sarah's Daily Digest** (Monday morning view) — what changed over the weekend, what the system already replanned, what needs her judgment.

---

## 8. AI roles by feature pillar

| Pillar                       | AI role                                                    | Trust level (DISCOVER)  | Validation gate                                                                                          |
| ---------------------------- | ---------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------- |
| A. Living MPS engine         | Optimizer (constraint solver + ML for objective weighting) | Medium → High over time | Plan must pass constraint engine before display; no infeasible plans ever shown                          |
| B. Multi-scenario generation | Generator (objective-weighted variants)                    | Medium                  | Planner picks; AI never auto-commits in MVP                                                              |
| C. Analysis view             | Surfacer (bottleneck, risk, ripple)                        | High (read-only)        | Confidence + data source shown for every projected number                                                |
| D. Conversational what-if    | Co-pilot (natural-language → constrained scenario)         | Medium                  | All AI suggestions filtered through constraint engine; explainability chain mandatory                    |
| E. Tuning Logic              | Detector + Suggester (statistical anomaly → tune proposal) | Medium                  | SPC evidence + control-limit visualization shown; planner approves; cross-team review before spec change |

No AI feature ships without (a) explainability spine, (b) shadow-mode option, (c) override + capture loop.

---

## 9. Replan trigger taxonomy

What events the Living MPS reacts to and at what scope (full breakdown in [research §9](../../08_RESEARCH/wafer-nand-manufacturing-for-mps.md#9-disruption-events-that-should-trigger-a-replan)):

| Event                                 | Detection                            | Replan scope                        | Urgency             | Frozen-zone override?      |
| ------------------------------------- | ------------------------------------ | ----------------------------------- | ------------------- | -------------------------- |
| Equipment down — unplanned            | MES / equipment monitor              | Local + downstream WIP              | High (within shift) | Yes, with planner confirm  |
| Equipment down — planned PM           | PM calendar                          | Local                               | Low                 | No (already in baseline)   |
| Yield excursion (≥3σ at probe)        | SPC / probe data                     | Cross-fab; affected step            | High                | Yes                        |
| SPC alarm / chamber drift             | APC / SPC system                     | Local + chamber-match constraint    | Medium              | Sometimes                  |
| Hot-lot insertion                     | Planner action (customer escalation) | Cross-fab; bumps lower-priority WIP | High                | Yes, with ripple analysis  |
| Demand forecast revision              | Demand planner publish               | Full MPS regeneration               | Low–Medium          | No (next cycle)            |
| Material shortage                     | ERP / supply alert                   | Cross-fab; recipes using material   | Medium–High         | Yes for critical materials |
| Tech transition / NPI ramp            | Roadmap                              | Cross-fab; multi-month              | Medium (months)     | No                         |
| Customer order pull-in / cancellation | CRM / S&OP                           | Full MPS regeneration               | High                | Yes                        |

**Highest-leverage trio**: yield excursion · hot-lot insertion · equipment-down-unplanned. These are where Dynamic Scheduling earns its keep relative to a weekly batch APS.

---

## 10. Cross-team communication touchpoints

Captured from the workshop — the planner's coordination surface. Dynamic Scheduling must support each handoff:

| Counterpart                       | What flows in                                          | What flows out                                        | Where the feature touches it                                           |
| --------------------------------- | ------------------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| **Business Development**          | New PO; priority changes; customer-supply-chain shifts | Revised commitment dates; replan options for customer | Commit & Diff view → auto-notify; commitment-risk panel                |
| **Process Engineer**              | Standard process spec; recipe updates                  | Tuning suggestions with SPC evidence                  | Tuning Console → send-to-PE workflow                                   |
| **Equipment Engineer**            | Tool capacity; PM schedule; tool on/off authorizations | Capacity tuning evidence; tool-bring-up requests      | Capacity tuning; PM calendar sync; tool-bring-up replan trigger        |
| **Manufacturing Engineer**        | Dispatch translation; replan execution feedback        | Updated dispatch instructions                         | Batch Detail Drawer (structured dispatch card)                         |
| **Shop Floor Supervisor**         | Lot status; tool exceptions; informal pings            | Batch instructions in ≤ 10 min digest                 | Mobile/chat-style dispatch card; WhatsApp/Teams integration (deferred) |
| **Operations Manager (Jennifer)** | Strategic priorities; escalations                      | Plan-status digest; commitment-risk dashboard         | Daily digest; commitment-risk panel; analysis view                     |

---

## 11. MVP cut (Sprint-level scope hypothesis)

The smallest cut that lets us collapse the 3–5 day cycle and build the trust runway. Drawn from concept pillars A + B + C + D, deferring E and some of B.

**MVP (P0)**

- A1 — Auto-generate MPS from PO + current state + constraints; load demand from import (no live ERP integration yet)
- A2 — Anchored replanning (frozen / flex / far zones); event-triggered for the highest-leverage trio (yield, hot lot, equipment-down-unplanned)
- B1 — Gantt canvas with PO → Family → Stage → Step hierarchy; milestones + shipment commitments visible
- B2 — Two scenarios per replan: **current published** + **AI-proposed**; diff view (side-by-side)
- C1 — Workload-per-tool-group heatmap with capacity bands
- C2 — Commitment-risk panel (P50/P80/P95)
- C3 — Constraint validation list (over-capacity, unqualified routes, expired quals)
- D1 — "Explain this slot" — constraint chain breakdown for any selected step
- D2 — Shadow mode: AI plan computed alongside planner's plan; delta dashboard
- Replan Inbox; Commit & Diff workflow with email fan-out

**Fast-follow (P1)**

- B3 — Third scenario (cost-optimized or lead-time-optimized — pick one based on Sarah validation)
- D3 — Conversational what-if (natural-language prompt)
- E1 — Tuning Console (process-time tunes only, capacity tunes deferred)
- A3 — Auto-execute envelope for hot-lot reroute within pre-approved policy

**Out of MVP**

- Full multi-fab coordination (single fab first)
- Back-end (probe + assembly) integration beyond commit visibility
- Knowledge-capture override loop (Pillar E follow-on)
- WhatsApp / Teams integration
- Demand forecasting (separate feature)

---

## 12. Non-goals

Things this feature deliberately **does not** try to be:

- A **MES replacement** — read WIP/equipment state from Camstar/Promis/etc.; don't try to be one.
- An **RTD replacement** — push policies / weights to RTD; let it execute per-tool dispatch.
- A **demand forecasting system** — consume demand from the demand-planning feature or external S&OP; don't forecast.
- A **fancy Gantt** — the workshop explicitly rejected "treat semi like any other factory." We're not shipping a polished Gantt with AI bolted on; we're shipping a NAND-native constraint model with a Gantt as one view.
- An **autonomous scheduler in MVP** — planner-in-the-loop from day one; bounded automation only after trust is earned.

---

## 13. Success metrics (hypothesis-level)

Tied to PS-1 success metrics + DISCOVER Insight 1:

| Metric                                 | Today          | Target (12 mo post-deploy)                                             | Measurement                                |
| -------------------------------------- | -------------- | ---------------------------------------------------------------------- | ------------------------------------------ |
| MPS generation cycle time              | 3–5 days       | < 4 hours initial; < 5 min event replan                                | Time-tracking from event to committed plan |
| Plan adherence at 48 h                 | 65–75%         | > 90%                                                                  | MES wafer-out vs planned                   |
| Planner time on strategic work         | 30–40%         | > 60%                                                                  | Weekly time-allocation survey              |
| Scenario generation time               | 2–3 h/scenario | < 60 s/scenario                                                        | System latency                             |
| Stakeholder fan-out latency            | Manual; 1–24 h | Auto; < 5 min from commit                                              | Audit log                                  |
| Tuning suggestions accepted            | n/a            | ≥ 20% of suggestions converted to spec/capacity updates within 90 days | Cross-team workflow tracking               |
| Shadow-mode plan-delta vs planner plan | n/a            | < 10% commit-date delta after 30 days                                  | Comparison report                          |

---

## 14. Open questions for DESIGN validation

To resolve in prototype testing + planner interviews (mirrors [research §12 gap list](../../08_RESEARCH/wafer-nand-manufacturing-for-mps.md#12-open-knowledge-gaps--to-confirm-in-design-phase-planner-interviews)):

1. **Anchored-zone boundaries** — Are 72 h frozen / 4 wk flex / 14 wk far the right thresholds? Each planner may tune these per fab.
2. **Scenario count** — Two scenarios or three in MVP? Workshop suggested three (Throughput / Cost / Lead-time); user-research insight: cognitive overload risk above two.
3. **Tuning Logic governance** — Who has authority to approve a process-time tune? Planner alone, or co-approval with PE/EE? Workshop unresolved.
4. **What-if input modality** — Natural-language chat vs structured form. Cognitive cost of chat-first for a 35-year-old non-power-user? Test both.
5. **Hot-lot UX** — Drag-to-insert + ripple preview vs structured form. What feels right under customer-call pressure?
6. **Commit & Diff workflow granularity** — Per-batch commits or whole-plan commits? Affects audit/notification volume.
7. **Override capture** — When Sarah overrides an AI recommendation, how invasive should the "why?" prompt be? One question vs structured form vs silent log.
8. **Reentrancy depth** — Confirm with real planner: do Samsung V9 / SK hynix 321L lots really hit 30–50 HARC visits? Affects scheduler complexity.
9. **MES / RTD integration sequence** — Which MES (Camstar vs Promis vs other) and which RTD do we target first? Depends on pilot customer.
10. **Multi-fab in MVP** — Single fab or multi-fab? Workshop unresolved. Material design difference.

---

## 15. Related artifacts

| Artifact                                                                                                   | Relationship                                                                                      |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [T13 HMW Workshop](T13-hmw-ideation-workshop.md)                                                           | Source HMWs (esp. HMW #1: "reduce plan creation from days to hours")                              |
| [T14 Concept Sketches](T14-concept-sketches.md)                                                            | This is the deep-dive on Concept 1 _Smart Scheduler_; concepts 2–5 are sibling features           |
| [`ideation-note.txt`](ideation-note.txt)                                                                   | Seed idea — Pillars A/B/C/E originate here                                                        |
| [`aPlanner - Ideation Workshop 2.vtt`](aPlanner%20-%20Ideation%20Workshop%202.vtt)                         | Workshop transcript — data model + Tuning Logic + cross-team flow originate here                  |
| [`08_RESEARCH/wafer-nand-manufacturing-for-mps.md`](../../08_RESEARCH/wafer-nand-manufacturing-for-mps.md) | Domain reference — design implications §11 are the foundation of pillars A/C/D and the data model |
| [T07 Personas — Sarah Chen](../../01_DISCOVER/synthesis/T07-personas.md)                                   | Primary persona anchor                                                                            |
| [T08 Problem Statement PS-1](../../01_DISCOVER/validation/T08-problem-statements.md)                       | Problem framing — manual production planning                                                      |
| [T10 Hypothesis Cards](../../01_DISCOVER/validation/T10-hypothesis-cards.md)                               | H-04 (data accessibility) + H-05 (AI trust via explainability) gate this feature                  |

---

## 16. Next steps

1. **SWAT review** of this concept (CEO, CPO, CXO, CAO, CDO, COO) — agree on MVP cut + open-question priorities.
2. **Convert MVP scope** into hypothesis cards + acceptance criteria.
3. **Prototype** the top three screens (MPS Home + Gantt, Analysis View, Replan Inbox) in Figma for usability testing with planners.
4. **Validate** open questions 1, 2, 4, 5, 7 via moderated prototype tests (target: 5–8 planners).
5. **Technical spike** on the constraint engine — can we model (lot, step_index, tool_group, recipe) reentrant routing with chamber-qualification matrix and produce a feasible plan in < 60 s on a realistic problem size? Owner: CDO.
6. **Tuning Logic prototype** — paper-prototype the SPC → suggestion → PE-handoff workflow with one planner + one process engineer to validate cross-team buy-in.

---

_Status: Draft v1 — open for SWAT comments._
_AX Transformation Framework v2.0.0 — DESIGN phase concept artifact._
