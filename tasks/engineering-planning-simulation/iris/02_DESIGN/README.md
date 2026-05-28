# 02 DESIGN — Is This the Right Solution Approach?

> **Version**: 1.0.0
> **Dominant Lenses**: Empathy + Speed
> **Duration**: 3-4 weeks typical (3-5 weeks range)
> **Exit**: Gate 2 Review

```
DESIGN Lens Dominance:
  ██████████ EMPATHY      — Solutions must resonate with users. Test with real people, not assumptions.
  ██████░░░░ SPEED        — Prototype fast. Goldilocks quality — not too rough, not too polished.
  ██░░░░░░░░ VALIDATION   — Test hypotheses through prototypes. Measure SUS scores.
  ██░░░░░░░░ GOVERNANCE   — MVP scope control. MoSCoW prioritization.
```

---

## Kickoff Checklist

Complete before beginning DESIGN work.

### DISCOVER Gate Passed

- [ ] Gate 1 completed with GO or CONDITIONAL GO decision
- [ ] Gate 1 decision document archived
- [ ] Conditional items documented (if CONDITIONAL GO) with timeline for resolution:
  - [ ] Condition 1: ******\_\_\_******
  - [ ] Condition 2: ******\_\_\_******

### DISCOVER Deliverables Carried Forward

- [ ] Validated personas available (primary + secondary)
- [ ] Problem statements scored and validated (>= 7/10 frequency + severity)
- [ ] Assumptions register risk-ranked (minimum 15 assumptions)
- [ ] Competitive analysis and positioning map completed
- [ ] Lean Canvas draft completed
- [ ] CXO has presented "Persona Walk-Through" (30-min day-in-the-life of primary persona)

### Ideation Planning

- [ ] HMW (How Might We) workshop scheduled
- [ ] Ideation participants identified (cross-functional)
- [ ] Ideation materials prepared (Crazy 8s templates, dot-voting supplies)
- [ ] Design sprint option evaluated (4-5 day Google Design Sprint as alternative)

### Prototyping Setup

- [ ] Design tools configured (Figma + Amoza Design System)
- [ ] Prototype approach selected: Throwaway / Evolutionary / Incremental
- [ ] MVP type identified from 6 options: Landing Page / Video / Concierge / Wizard of Oz / Single-Feature / Piecemeal
- [ ] Lo-fi prototype timeline: 2-3 days maximum (time-box enforced)

### Usability Testing

- [ ] Usability test participants recruited (minimum 3 per round, target 5)
- [ ] Test schedule set for 2 rounds:
  - [ ] Round 1 (lo-fi): {{USABILITY_ROUND_1_DATE}}
  - [ ] Round 2 (hi-fi): {{USABILITY_ROUND_2_DATE}}
- [ ] SUS scoring template ready (target >= 68, aspiration >= 75)
- [ ] Test recording and note-taking process established

### User Stories and Prioritization

- [ ] Story writing sessions scheduled with CPO + CDO
- [ ] Prioritization framework selected (MoSCoW + RICE or WSJF)
- [ ] Technical feasibility review scheduled with CDO

### Gate 2 Preparation

- [ ] Gate 2 criteria reviewed by team
- [ ] Gate 2 review meeting scheduled: {{GATE_2_DATE}}

**Kickoff Decision**: [ ] GO | [ ] GO WITH RISKS | [ ] DELAY

---

## Activities

| #   | Activity           | Guide                                                           | Description                                                        | Owner     |
| --- | ------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| S1  | Ideation Workshop  | [S1 Guide](.ax/framework/design/S1_IDEATION_WORKSHOP_GUIDE.md)  | Generate 30+ ideas through HMW questions, Crazy 8s, and dot-voting | CPO + CXO |
| S2  | Prototyping        | [S2 Guide](.ax/framework/design/S2_PROTOTYPING_GUIDE.md)        | Build lo-fi then hi-fi prototypes of top concepts                  | CXO       |
| S3  | Concept Validation | [S3 Guide](.ax/framework/design/S3_CONCEPT_VALIDATION_GUIDE.md) | Test prototypes against validated problem statements               | CPO       |
| S4  | User Stories       | [S4 Guide](.ax/framework/design/S4_USER_STORIES_GUIDE.md)       | Write user stories with acceptance criteria for MVP features       | CPO + CDO |
| S5  | Prioritization     | [S5 Guide](.ax/framework/design/S5_PRIORITIZATION_GUIDE.md)     | Apply MoSCoW + RICE/WSJF to rank MVP backlog                       | CPO       |
| S6  | Usability Testing  | [S6 Guide](.ax/framework/design/S6_USABILITY_TESTING_GUIDE.md)  | Run 2 rounds of usability tests; measure SUS scores                | CXO       |
| S7  | Gate 2 Preparation | [S7 Guide](.ax/framework/design/S7_GATE_2_REVIEW_GUIDE.md)      | Compile evidence for Gate 2 review                                 | CPO       |

---

## AI Workflows for This Phase

| Workflow              | File                                                       | What It Does                                                                              | Collaboration Level |
| --------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------- |
| **Document Drafting** | [document-drafting.md](.ax/workflows/document-drafting.md) | Generates first drafts of HMW outputs, user stories, usability reports, and gate packages | AI Leads            |

### Available Skills

| Skill               | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| `/design-hmw`       | Facilitate How Might We question generation from problem statements |
| `/design-sprint`    | Plan and structure a design sprint (4-5 day format)                 |
| `/design-usability` | Generate usability test plans and analyze SUS scores                |
| `/design-stories`   | Write user stories with acceptance criteria from prototypes         |

---

## Templates

| #   | Template                                       | Purpose                               |
| --- | ---------------------------------------------- | ------------------------------------- |
| T13 | [Business Model (Lean Canvas)](.ax/templates/) | Validate business model assumptions   |
| T14 | [Data Model](.ax/templates/)                   | Conceptual data modeling              |
| T15 | [User Story](.ax/templates/)                   | Story format with acceptance criteria |
| T16 | [Process Model (BPMN)](.ax/templates/)         | Workflow and process documentation    |

## Samples

| #   | Sample                                  | Description                                       |
| --- | --------------------------------------- | ------------------------------------------------- |
| X12 | [HMW Workshop Results](.ax/samples/)    | Ideation workshop output with dot-voting          |
| X13 | [User Stories (aPlanner)](.ax/samples/) | Prioritized user stories with acceptance criteria |

---

## Deliverables Checklist

Everything the team must produce before Gate 2. Track status in `PROGRESS.md`.

- [ ] **HMW Workshop Output** — 30+ ideas generated, top 3-5 concepts selected
- [ ] **Lo-fi Prototype** — Paper or digital wireframe of core flows
- [ ] **Usability Test Results (Round 1)** — Lo-fi test with minimum 3 participants
- [ ] **Hi-fi Prototype** — Figma prototype of core user journeys
- [ ] **Usability Test Results (Round 2)** — Hi-fi test with SUS score >= 68
- [ ] **Prioritized MVP Backlog** — MoSCoW-tagged stories with acceptance criteria
- [ ] **User Stories** — All Must-Have features written with Given/When/Then criteria
- [ ] **Technical Feasibility Assessment** — CDO review of architecture implications
- [ ] **MVP Type Confirmed** — Selected and rationalized MVP approach
- [ ] **Updated Lean Canvas** — Validated with DESIGN phase insights
- [ ] **Hypothesis Cards** — Linked to user stories for traceability
- [ ] **Gate 2 Evidence Package** — Compiled and ready for review

---

## Exit: Gate 2 Review

When all deliverables are complete, proceed to the Gate 2 Review.

**Gate 2 Location**: [06_GOVERNANCE/](../06_GOVERNANCE/)

**Gate 2 Criteria** (all must be met for GO):

- Prototype tested with real users (minimum 2 rounds)
- SUS score >= 68 (aspiration >= 75)
- Prioritized MVP backlog with MoSCoW tags
- User stories with acceptance criteria for all Must-Have features
- Technical feasibility confirmed by CDO
- MVP type selected with rationale
- Hypothesis cards linked to stories

**Gate Decisions**: GO | CONDITIONAL GO | NO-GO | PAUSE

**After Gate 2 GO --> proceed to [03_DEVELOP/README.md](../03_DEVELOP/README.md)**

---

_AX Kit v3.0 — DESIGN Phase Working Guide_
