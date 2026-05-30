# 03 DEVELOP — Can We Build It and Does It Work?

> **Version**: 1.0.0
> **Dominant Lenses**: Speed + Governance
> **Duration**: 6-8 weeks typical (3-4 two-week sprints)
> **Exit**: Gate 3 Review (higher bar: >= 75% weighted score)

```
DEVELOP Lens Dominance:
  ██████████ SPEED        — Ship fast. Time-box everything. Scope is variable, time is not.
  ██████░░░░ GOVERNANCE   — CI/CD, code review, ADRs, WIP limits. Speed without chaos.
  ██░░░░░░░░ EMPATHY      — Keep users visible. Sprint demos with real users.
  ██░░░░░░░░ VALIDATION   — Track hypothesis cards. Validate through working software.
```

---

## Kickoff Checklist

Complete before beginning DEVELOP work.

### DESIGN Gate Passed

- [ ] Gate 2 completed with GO or CONDITIONAL GO decision
- [ ] Gate 2 decision document archived
- [ ] Conditional items documented (if CONDITIONAL GO) with timeline:
  - [ ] Condition 1: ******\_\_\_******
  - [ ] Condition 2: ******\_\_\_******

### DESIGN Deliverables Carried Forward

- [ ] Prioritized MVP backlog with MoSCoW tags
- [ ] Hi-fi prototypes (Figma) for core user flows
- [ ] User stories with acceptance criteria for all Must-Have features
- [ ] Technical feasibility assessment completed by CDO
- [ ] MVP type confirmed with rationale
- [ ] Lean Canvas validated (Value + Growth Hypotheses articulated)
- [ ] Hypothesis cards linked to user stories
- [ ] CDO has presented "Build Plan" (architecture, sprint breakdown, risk register)
- [ ] CXO and CDO have agreed on "design fidelity contract"

### Sprint 0 Planning (Architecture + CI/CD)

- [ ] Tech stack selected and documented (ADR)
- [ ] CI/CD pipeline configured (build, test, deploy automation)
- [ ] Data model initiated (conceptual level per RAD)
- [ ] Shared repository created with branching strategy defined
- [ ] Monitoring, logging, and error tracking configured
- [ ] Development environment setup documented
- [ ] Sprint 0 duration: {{SPRINT_0_DURATION}} (typically 1 week)

### SWAT Team and Parallel Workstreams

- [ ] SWAT team confirmed and dedicated to IRIS
- [ ] Parallel workstreams assigned:
  - [ ] **Frontend**: {{FRONTEND_LEAD}} — UI, design system implementation
  - [ ] **Backend**: {{BACKEND_LEAD}} — APIs, business logic
  - [ ] **Data**: {{DATA_LEAD}} — Pipeline, storage, analytics
  - [ ] **AI-ML**: {{AI_ML_LEAD}} — Models, inference, AI workflows
- [ ] API contracts defined for cross-workstream synchronization
- [ ] Kanban WIP limits set (2-3 items per person per stage)
- [ ] Daily standup scheduled (15 minutes, all workstreams)
- [ ] Weekly demo scheduled (open to all stakeholders)

### AI-Assisted Development

- [ ] Claude Code configured for the project
- [ ] AI coding standards defined (same review bar for AI and human code)
- [ ] AI-assisted code ratio tracking in place (target 70%+)
- [ ] AI tools available: Claude Code, Cursor, or equivalent

### Sprint Execution Setup

- [ ] Sprint cadence set: 2-week sprints (or 1-week for first sprint)
- [ ] Sprint planning ceremony scheduled
- [ ] Sprint retrospective ceremony scheduled
- [ ] Definition of Done agreed by team
- [ ] Tech debt register initialized
- [ ] Quality gates: lint, test, security scan automated in CI pipeline

### Gate 3 Preparation

- [ ] Gate 3 criteria reviewed by team
- [ ] Gate 3 review meeting scheduled: {{GATE_3_DATE}}

**Kickoff Decision**: [ ] GO | [ ] GO WITH RISKS | [ ] DELAY

---

## Activities

| #   | Activity                | Guide                                                                 | Description                                                          | Owner     |
| --- | ----------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- | --------- |
| V1  | Sprint Planning         | [V1 Guide](.ax/framework/develop/V1_SPRINT_PLANNING_GUIDE.md)         | Plan, execute, and close 2-week sprints with parallel workstreams    | CDO       |
| V2  | AI-Assisted Development | [V2 Guide](.ax/framework/develop/V2_AI_ASSISTED_DEVELOPMENT_GUIDE.md) | Code generation targeting 70%+ AI-assisted ratio using CRAFT prompts | CDO + AI  |
| V3  | Code Review             | [V3 Guide](.ax/framework/develop/V3_CODE_REVIEW_GUIDE.md)             | Review all code (AI and human) against same quality bar              | CDO       |
| V4  | CI/CD Pipeline          | [V4 Guide](.ax/framework/develop/V4_CICD_GUIDE.md)                    | Automated build, test, deploy pipeline                               | CDO       |
| V5  | Architecture Decisions  | [V5 Guide](.ax/framework/develop/V5_ADR_GUIDE.md)                     | Record Architecture Decision Records (ADRs)                          | CDO       |
| V6  | MVP Execution           | [V6 Guide](.ax/framework/develop/V6_MVP_EXECUTION_GUIDE.md)           | Build the validated MVP across parallel workstreams                  | CDO + CPO |
| V7  | Gate 3 Preparation      | [V7 Guide](.ax/framework/develop/V7_GATE_3_REVIEW_GUIDE.md)           | Compile evidence for Gate 3 review                                   | CDO + CPO |

---

## AI Workflows for This Phase

| Workflow                | File                                                           | What It Does                                                    | Collaboration Level   |
| ----------------------- | -------------------------------------------------------------- | --------------------------------------------------------------- | --------------------- |
| **AI Pair Programming** | [ai-pair-programming.md](.ax/workflows/ai-pair-programming.md) | Code generation across parallel workstreams using CRAFT prompts | AI Leads              |
| **Sprint Execution**    | [sprint-execution.md](.ax/workflows/sprint-execution.md)       | Full sprint cycle: planning, standups, execution, review, retro | AI Leads + AI Assists |
| **Document Drafting**   | [document-drafting.md](.ax/workflows/document-drafting.md)     | ADRs, sprint plans, technical docs, API documentation           | AI Leads              |

### Available Skills

| Skill                 | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `/develop-sprint`     | Create sprint plan with parallel workstreams and WIP limits |
| `/develop-review`     | AI-assisted code review against T26 checklist               |
| `/develop-adr`        | Generate Architecture Decision Records                      |
| `/develop-data-model` | RAD 3-level data modeling guidance                          |

---

## Parallel Workstreams

All four workstreams run simultaneously, synchronized through API contracts and daily standups.

```
Sprint N
+------------------------------------------------------------------+
|                                                                    |
|  FRONTEND          BACKEND           DATA            AI-ML        |
|  +-----------+     +-----------+     +-----------+   +---------+  |
|  | UI comps  |     | APIs      |     | Migrations|   | Models  |  |
|  | Pages     |<--->| Services  |<--->| Pipelines |   | Inference|  |
|  | State mgmt|     | Auth      |     | Analytics |   | Features|  |
|  +-----------+     +-----------+     +-----------+   +---------+  |
|       |                 |                 |               |        |
|       +------------ API Contracts --------+---------------+        |
|                                                                    |
+------------------------------------------------------------------+
         |                                          |
    Daily Standup                              Sprint Demo
    (15 min, all workstreams)                  (working software)
```

**WIP Limits** — Prevent task-switching waste:

| Stage       | WIP Limit            | Rule                                       |
| ----------- | -------------------- | ------------------------------------------ |
| In Progress | 2-3 items per person | Focus on completion over starting new work |
| In Review   | 2 items per reviewer | Reviews do not become bottlenecks          |
| Done        | No limit             | Celebrate completions                      |

**If WIP limit is reached**: Team members must help clear the bottleneck before pulling new work.

---

## Sprint Rhythm

```
Week 1                              Week 2
+--------------------------------+  +--------------------------------+
| Mon: Sprint Planning (2h)      |  | Mon: Standup (15m)             |
| Tue-Fri: Build + Daily Standup |  | Tue-Wed: Build + Standup       |
|                                |  | Thu: Sprint Review / Demo (1h) |
|                                |  | Fri: Retrospective (1h)        |
|                                |  |      Backlog Grooming (1h)     |
+--------------------------------+  +--------------------------------+
```

**Sprint 0** is special: architecture setup, CI/CD pipeline, dev environment, initial ADRs. No user-facing features.

---

## Templates

| #   | Template                                | Purpose                                           |
| --- | --------------------------------------- | ------------------------------------------------- |
| T21 | [Sprint Plan](.ax/templates/)           | Sprint backlog, goals, and workstream assignments |
| T22 | [Retrospective](.ax/templates/)         | 4Ls format sprint retrospective                   |
| T23 | [Sprint Report](.ax/templates/)         | Sprint summary with metrics                       |
| T24 | [ADR](.ax/templates/)                   | Architecture Decision Record                      |
| T25 | [Technical Doc](.ax/templates/)         | Technical documentation template                  |
| T26 | [Code Review Checklist](.ax/templates/) | Review criteria for AI and human code             |

## Samples

| #   | Sample                                 | Description                                       |
| --- | -------------------------------------- | ------------------------------------------------- |
| X16 | [Sprint Plan (aPlanner)](.ax/samples/) | Sprint planning example with parallel workstreams |

---

## Deliverables Checklist

Everything the team must produce before Gate 3. Track status in `PROGRESS.md`.

- [ ] **Working MVP** — Feature-complete (all Must-Have stories done)
- [ ] **Automated Test Suite** — Coverage report meeting 80%+ on critical paths
- [ ] **CI/CD Pipeline** — Operational for staging + production
- [ ] **P0/P1 Bugs Resolved** — P2 bugs documented with workarounds
- [ ] **Performance Baselines** — Established and documented
- [ ] **Security Review** — No critical/high vulnerabilities
- [ ] **API Documentation** — Complete for all endpoints
- [ ] **Architecture Decision Records** — All major decisions documented
- [ ] **Deployment Runbook** — Written and tested
- [ ] **Sprint Reports** — All sprints documented with velocity and AI-assisted ratio
- [ ] **Tech Debt Register** — Current debt items documented with priorities
- [ ] **Gate 3 Evidence Package** — Compiled and ready for review

---

## Exit: Gate 3 Review

When all deliverables are complete, proceed to the Gate 3 Review.

**Gate 3 Location**: [06_GOVERNANCE/](../06_GOVERNANCE/)

**Important: Gate 3 has a higher bar — >= 75% weighted score required (vs 70% for other gates).**

**Gate 3 Criteria**:

- Working MVP feature-complete against Must-Have backlog
- All P0 and P1 bugs resolved
- Automated test suite with 80%+ coverage on critical paths
- CI/CD pipeline operational
- Security review passed (no critical/high vulnerabilities)
- Performance baselines established
- API documentation complete
- Deployment runbook written and tested
- Production Readiness Review completed by CDO

**Gate Decisions**: GO | CONDITIONAL GO | NO-GO | PAUSE

**After Gate 3 GO --> proceed to [04_DELIVER/README.md](../04_DELIVER/README.md)**

---

_AX Kit v3.0 — DEVELOP Phase Working Guide_
