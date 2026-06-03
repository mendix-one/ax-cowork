# 05 ITERATE — What Did We Learn and What's Next?

> **Version**: 1.0.0
> **Dominant Lenses**: Validation + Empathy
> **Duration**: 2-3 weeks typical (2-4 weeks range)
> **Output**: Next Cycle Brief -- decision on which phase to enter next

```
ITERATE Lens Dominance:
  ██████████ VALIDATION   — Data drives decisions. Innovation Accounting. Pivot or Persevere.
  ██████░░░░ EMPATHY      — Revisit personas. Listen to what the data says about users.
  ██░░░░░░░░ SPEED        — Quick experiments. Rapid backlog reprioritization.
  ██░░░░░░░░ GOVERNANCE   — Portfolio review. Next cycle planning. CoE learning.
```

---

## Kickoff Checklist

Complete before beginning ITERATE work.

### DELIVER Gate Passed

- [ ] Gate 4 completed with GO or CONDITIONAL GO decision
- [ ] Gate 4 decision document archived
- [ ] Conditional items documented (if CONDITIONAL GO) with timeline:
  - [ ] Condition 1: **\*\***\_\_\_**\*\***
  - [ ] Condition 2: **\*\***\_\_\_**\*\***

### DELIVER Deliverables Carried Forward

- [ ] Usage analytics data available (minimum 2 weeks of production data)
- [ ] AARRR metrics baseline established
- [ ] Innovation Accounting baseline report completed
- [ ] Feedback synthesis report from early adopters
- [ ] Hypothesis validation results (confirmed / partially confirmed / disproved)
- [ ] Incident log and postmortems
- [ ] NPS/CSAT scores collected
- [ ] Engine of Growth analysis completed
- [ ] CPO has presented "Learning Report" (validated, disproved, uncertain)

### Data Collection and Analysis

- [ ] Usage analytics dashboard has sufficient data for analysis
- [ ] Cohort analysis possible (early vs. later adopters)
- [ ] Feature adoption data available
- [ ] Feature Health Matrix data prepared:
  - [ ] Protect (high adoption + high satisfaction)
  - [ ] Invest (low adoption + high satisfaction)
  - [ ] Grow (high adoption + low satisfaction)
  - [ ] Question (low adoption + low satisfaction)
- [ ] Innovation Accounting 3-step analysis planned:
  - [ ] Step 1: Establish Baseline -- complete
  - [ ] Step 2: Tune the Engine -- experiments identified
  - [ ] Step 3: Pivot or Persevere -- decision criteria defined

### Retrospective Planning

- [ ] Retrospective facilitator assigned (non-lead for psychological safety)
- [ ] Retrospective scheduled within 3 days of cycle completion
- [ ] 4Ls format prepared: Liked, Learned, Lacked, Longed For
- [ ] 5 Whys ready for root cause analysis on chronic issues
- [ ] Sprint metrics compiled for retrospective input
- [ ] Prior retrospective action items reviewed (status check)
- [ ] Celebration planned for wins and milestones

### Pivot/Persevere Framework

- [ ] 10 Pivot Types reference reviewed (see section below)
- [ ] Decision criteria defined:
  - [ ] Are metrics trending toward targets?
  - [ ] Is the rate of improvement sufficient?
  - [ ] Do we have runway to continue?
  - [ ] Is the market signal strong enough?

### Next Cycle Planning

- [ ] North Star Metric reviewed and confirmed (or updated)
- [ ] OMTM selected for next cycle
- [ ] Backlog reprioritization session scheduled
- [ ] Next cycle direction options prepared:
  - [ ] Return to DISCOVER (uncertain assumptions need research)
  - [ ] Return to DESIGN (problem clear but solution needs rethinking)
  - [ ] Mini DEVELOP-DELIVER (incremental improvement)
- [ ] Next Cycle Brief template available (T30)
- [ ] Five Pillars reassessment scheduled

**Kickoff Decision**: [ ] GO | [ ] GO WITH RISKS | [ ] DELAY

---

## Activities

| #   | Activity                 | Guide                                                                    | Description                                                           | Owner             |
| --- | ------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------------- |
| I1  | Retrospective            | [I1 Guide](.ax/framework/iterate/I1_RETROSPECTIVE_AND_LEARNING_GUIDE.md) | 4Ls + 5 Whys: team process reflection and learning extraction         | COO (facilitator) |
| I2  | Data-Driven Analysis     | [I2 Guide](.ax/framework/iterate/I2_DATA_DRIVEN_ITERATION_GUIDE.md)      | Innovation Accounting, Feature Health Matrix, cohort analysis         | CPO + CAO         |
| I3  | Backlog Reprioritization | [I3 Guide](.ax/framework/iterate/I3_BACKLOG_REPRIORITIZATION_GUIDE.md)   | Re-rank backlog based on learning; cut, add, or reprioritize features | CPO               |
| I4  | Next Cycle Planning      | [I4 Guide](.ax/framework/iterate/I4_NEXT_CYCLE_PLANNING_GUIDE.md)        | Write the Next Cycle Brief; decide which phase to enter next          | CPO + CEO         |

---

## AI Workflows for This Phase

| Workflow                       | File                                                                         | What It Does                                                                             | Collaboration Level |
| ------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------- |
| **Retrospective Facilitation** | [retrospective-facilitation.md](.ax/workflows/retrospective-facilitation.md) | Pre-analyzes metrics, prepares starter pack, captures 4Ls and action items               | AI Assists          |
| **Pivot/Persevere Analysis**   | [pivot-persevere-analysis.md](.ax/workflows/pivot-persevere-analysis.md)     | Evaluates all 10 Pivot Types, generates Feature Health Matrix, compiles decision package | AI Analyzes         |
| **Innovation Accounting**      | [innovation-accounting.md](.ax/workflows/innovation-accounting.md)           | 3-step process with AARRR funnel, engine KPIs, and tune vs pivot signal                  | AI Analyzes         |

### Available Skills

| Skill            | Purpose                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `/iterate-retro` | Run automated retrospective facilitation with metrics pre-analysis |
| `/iterate-pivot` | Generate pivot/persevere analysis with 10 Pivot Types evaluation   |

---

## The 10 Pivot Types

When Innovation Accounting signals a "Pivot Alert" (core metrics declining or flat for 3+ periods), evaluate every pivot type before deciding.

| #   | Pivot Type                | Description                                                      | Signal to Watch                                  |
| --- | ------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| 1   | **Zoom-in**               | A single feature becomes the whole product                       | One feature drives disproportionate engagement   |
| 2   | **Zoom-out**              | The whole product becomes a feature of a larger product          | Users request adjacent capabilities constantly   |
| 3   | **Customer Segment**      | Same product, different customers                                | Unexpected user segments show higher engagement  |
| 4   | **Customer Need**         | Same customers, different problem                                | Feedback points to a different pain point        |
| 5   | **Platform**              | Application becomes platform (or vice versa)                     | Third parties want to build on top               |
| 6   | **Business Architecture** | High-margin/low-volume to low-margin/high-volume (or vice versa) | Current pricing/volume model unsustainable       |
| 7   | **Value Capture**         | Different monetization model                                     | Users get value but do not convert to paying     |
| 8   | **Engine of Growth**      | Switch between Sticky/Viral/Paid                                 | Current growth engine not producing results      |
| 9   | **Channel**               | Different distribution channel                                   | Current channels produce low-quality users       |
| 10  | **Technology**            | Same solution, different technology                              | Different tech delivers same value at lower cost |

For each type, score: **Applicable** (strong signals) | **Possible** (some signals) | **Not Applicable** (no signals).

---

## Feature Health Matrix

Map every feature on this 2x2 grid using real adoption and satisfaction data.

```
                    HIGH Satisfaction
                         |
         INVEST          |          PROTECT
    (Low adoption,       |     (High adoption,
     High satisfaction)  |      High satisfaction)
    Users who find it    |     Core value features.
    love it but most     |     Guard these.
    don't discover it.   |
    Improve discovery.   |
                         |
  -----------------------+-------------------------
                         |
         QUESTION        |          GROW
    (Low adoption,       |     (High adoption,
     Low satisfaction)   |      Low satisfaction)
    Nobody uses it and   |     Users need it but
    those who do are     |     it frustrates them.
    unhappy. Cut or      |     Fix the experience.
    radically rethink.   |
                         |
                    LOW Satisfaction
```

| Quadrant     | Action                                                      | Priority |
| ------------ | ----------------------------------------------------------- | -------- |
| **Protect**  | High adoption + High satisfaction -- Maintain and guard     | Highest  |
| **Invest**   | Low adoption + High satisfaction -- Improve discoverability | High     |
| **Grow**     | High adoption + Low satisfaction -- Fix the UX/experience   | High     |
| **Question** | Low adoption + Low satisfaction -- Cut or radically rethink | Lowest   |

---

## Templates

| #   | Template                           | Purpose                                    |
| --- | ---------------------------------- | ------------------------------------------ |
| T22 | [Retrospective](.ax/templates/)    | 4Ls format with 5 Whys root cause analysis |
| T30 | [Next Cycle Brief](.ax/templates/) | Decision document for next cycle direction |

---

## Deliverables Checklist

Everything the team must produce during ITERATE. Track status in `PROGRESS.md`.

- [ ] **Retrospective Report** — 4Ls board, 5 Whys analysis, 3-5 action items with owners
- [ ] **Innovation Accounting Report** — Baseline vs current, engine performance, trend analysis
- [ ] **Feature Health Matrix** — All features categorized (Protect/Invest/Grow/Question)
- [ ] **Pivot/Persevere Decision** — Documented with evidence and rationale
- [ ] **Updated Assumptions Register** — Refreshed based on delivery data
- [ ] **Backlog Reprioritization** — Re-ranked based on learning
- [ ] **Next Cycle Brief** — Direction, hypothesis, OMTM, and phase target for next cycle
- [ ] **Five Pillars Reassessment** — Updated organizational readiness scores
- [ ] **Celebrations** — Wins and milestones acknowledged

---

## Output: Next Cycle Decision

The ITERATE phase does not end with a gate -- it ends with a **decision** about what to do next.

### Decision Options

| Decision      | When                                              | Next Step                                             |
| ------------- | ------------------------------------------------- | ----------------------------------------------------- |
| **Persevere** | Metrics improving; engine responding to tuning    | Mini DEVELOP-DELIVER cycle with tuning actions        |
| **Pivot**     | Metrics flat/declining; fundamental change needed | Return to DISCOVER or DESIGN with new hypothesis      |
| **Stop**      | No viable path forward; value not demonstrated    | Archive learnings, reallocate team to another product |

### Where to Go Next

The team may loop back to **any** phase based on what was learned:

| Situation                                        | Enter Phase                 |
| ------------------------------------------------ | --------------------------- |
| Uncertain assumptions need more research         | **01_DISCOVER**             |
| Problem is clear but solution needs rethinking   | **02_DESIGN**               |
| Solution works but needs incremental improvement | **03_DEVELOP** (mini cycle) |
| New features ready for users                     | **04_DELIVER** (mini cycle) |

### Next Cycle Brief

The output is a **Next Cycle Brief** (template T30) that becomes the input for the next phase's kickoff checklist. It contains:

- What was learned this cycle
- Which hypotheses were validated/disproved
- Updated North Star Metric and OMTM
- Recommended phase to enter next
- Key risks and open questions
- Resource and timeline requirements

**The Next Cycle Brief feeds back into the appropriate phase folder's kickoff checklist.**

---

_AX Kit v3.0 — ITERATE Phase Working Guide_
