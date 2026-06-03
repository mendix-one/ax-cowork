# Five Pillars Assessment — IRIS

> **Version**: 1.0.0
> Organizational readiness assessment across the Five Pillars of Execution.
>
> **Date**: {{DATE}} | **Assessor**: \_\_\_

---

## Purpose

The Five Pillars of Execution — People, Portfolio, Process, Platform, Promotion — operate at the organizational level to ensure the AX Framework is not just a delivery process but a sustainable capability. This assessment evaluates readiness to build IRIS and identifies gaps to address before or during the DISCOVER phase.

**When to use**: Complete before starting the DISCOVER phase. Reassess at every ITERATE cycle to measure maturity progress.

**Relationship to AX layers**:

- Five Pillars = **Organizational level** (this assessment)
- Four Lenses = Decision level (applied per phase)
- Five Phases = Delivery level (DISCOVER through ITERATE)

---

## Maturity Model

Each pillar is scored across three maturity levels:

| Level | Name          | Description                                                                                        | Typical Timeline |
| ----- | ------------- | -------------------------------------------------------------------------------------------------- | ---------------- |
| **1** | **Start**     | Deliver first application, form core team, establish initial governance, prove the model works     | 2-4 months       |
| **2** | **Structure** | Repeatable process, governance formalized, knowledge sharing between projects, CoE formation       | 4-8 months       |
| **3** | **Scale**     | Enterprise CoE, composable architecture, portfolio management across pillars, federated team model | Ongoing          |

**Scoring**: For each question, rate the current state 1 (Start), 2 (Structure), or 3 (Scale). Average scores per pillar reveal your maturity level.

---

## Pillar 1: PEOPLE

> **Core Question**: "Do we have the right people with the right skills and support?"
>
> **Primary Owners**: CEO + COO
>
> **AX Principle**: "AI as Team Member" — people includes both human team members and AI collaborators.

### Assessment Questions

| #   | Question                                                                                                  | 1 (Start)                                        | 2 (Structure)                                                                 | 3 (Scale)                                                                                     | Score |
| --- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----- |
| P1  | **Executive Sponsorship**: Is there a named executive sponsor with active involvement?                    | No named sponsor or sponsor in name only         | Named sponsor who attends gate reviews                                        | Sponsor actively removes blockers and champions the initiative                                | \_/3  |
| P2  | **Team Composition**: Is the SWAT team fully staffed with clear role owners?                              | Partial team, roles shared or unfilled           | Full team (6-8), all AX roles assigned                                        | Multiple autonomous teams with talent pipeline for scaling                                    | \_/3  |
| P3  | **Skill Coverage**: Does the team have the skills needed for IRIS?                                        | Significant skill gaps, no plan to address       | Gaps identified with development plans; training underway                     | Skills matrix maintained, cross-training active, no single-person dependencies                | \_/3  |
| P4  | **Cross-Functional Collaboration**: Do team members work across role boundaries?                          | Siloed work, handoffs over walls                 | Regular cross-functional ceremonies (standups, demos, JAD sessions)           | Self-organizing teams, fluid collaboration, psychological safety established                  | \_/3  |
| P5  | **AI Collaboration Readiness**: Is the team equipped to work with AI as a team member?                    | No AI tools adopted, skepticism or unfamiliarity | AI tools selected, team trained, initial workflows defined                    | AI integrated into daily work, 70%+ AI-assisted code in DEVELOP, AI-human workflows optimized | \_/3  |
| P6  | **Decision Authority**: Can the team make decisions without excessive escalation?                         | All decisions escalated, slow approval chains    | Application-level decisions made by sprint team; program decisions by CPO+CDO | Three-level governance functioning smoothly; team decides confidently within authority        | \_/3  |
| P7  | **Culture & Psychological Safety**: Can team members raise concerns, admit mistakes, and challenge ideas? | Fear of failure, blame culture, ideas suppressed | Retrospectives happen but discomfort remains                                  | Team openly discusses failures, celebrates learning, runs honest retrospectives               | \_/3  |

**PEOPLE Score**: **\_ / 21 | **Maturity Level**: \_**

| Score Range | Maturity Level |
| ----------- | -------------- |
| 7-11        | Start          |
| 12-16       | Structure      |
| 17-21       | Scale          |

---

## Pillar 2: PORTFOLIO

> **Core Question**: "Are we working on the right things in the right order?"
>
> **Primary Owners**: CEO + CPO
>
> **AX Principle**: "Value Over Features" — portfolio decisions are investment decisions.

### Assessment Questions

| #   | Question                                                                                         | 1 (Start)                                                             | 2 (Structure)                                                             | 3 (Scale)                                                                                       | Score |
| --- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----- |
| Q1  | **Strategic Alignment**: Is IRIS aligned with Amoza's strategic priorities and pillar roadmap?   | No formal alignment check; product started on intuition               | Strategic alignment documented and reviewed at Gate 0                     | Portfolio dashboard tracks alignment scores for all active initiatives                          | \_/3  |
| Q2  | **Ecosystem Awareness**: Are cross-product dependencies mapped and managed?                      | Dependencies unknown or discovered late                               | Ecosystem mapping completed for IRIS; key dependencies identified         | Full 36-product dependency graph maintained; portfolio reviews assess cross-product impact      | \_/3  |
| Q3  | **Resource Allocation**: Are resources focused or spread thin?                                   | Team works on multiple products simultaneously with context switching | Dedicated team for IRIS with clear capacity allocation                    | Portfolio-level resource management; dynamic reallocation based on gate outcomes                | \_/3  |
| Q4  | **Investment Governance**: Do gate reviews function as real investment decisions?                | No gate reviews, or gates are rubber-stamp ceremonies                 | Gate reviews happen with real GO/NO-GO decisions documented               | Gates inform portfolio-level investment rebalancing; NO-GO leads to resource redirect           | \_/3  |
| Q5  | **Sequencing**: Is IRIS launching at the right time relative to ecosystem readiness?             | No sequencing consideration; launching when someone has an idea       | Dependencies checked; launch sequenced after required platform components | Product launch sequence optimized across pillars; new products launch faster than previous ones | \_/3  |
| Q6  | **Complexity Assessment**: Has the strategic value vs. implementation complexity been evaluated? | No formal assessment                                                  | Complexity matrix applied; build/buy/partner decision made                | Portfolio selection criteria applied consistently across all product decisions                  | \_/3  |

**PORTFOLIO Score**: **\_ / 18 | **Maturity Level**: \_**

| Score Range | Maturity Level |
| ----------- | -------------- |
| 6-9         | Start          |
| 10-13       | Structure      |
| 14-18       | Scale          |

---

## Pillar 3: PROCESS

> **Core Question**: "Is work flowing efficiently from idea to impact?"
>
> **Primary Owners**: CPO + COO
>
> **AX Principle**: "Time-Box Everything" — process enables speed, not bureaucracy.

### Assessment Questions

| #   | Question                                                                                                | 1 (Start)                                                      | 2 (Structure)                                                                     | 3 (Scale)                                                                                     | Score |
| --- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----- |
| R1  | **AX Lifecycle Adoption**: Is the team following the 5-phase AX lifecycle (DISCOVER through ITERATE)?   | Ad hoc development; no consistent phase structure              | AX phases followed with gate reviews; ceremonies established                      | Phases optimized based on retrospective learnings; cycle time decreasing quarter-over-quarter | \_/3  |
| R2  | **Sprint Cadence**: Are sprints running consistently with full ceremonies?                              | No sprint structure or inconsistent cadence                    | 2-week sprints with planning, standup, review, retro at >= 90% adherence          | Sprint velocity predictable; ceremonies continuously improved; waste removed                  | \_/3  |
| R3  | **Gate Reviews**: Are phase gates conducted rigorously at every transition?                             | No gate reviews, or frequently skipped                         | Gate reviews at every transition; scoring criteria applied                        | Gate data informs portfolio decisions; gate criteria refined based on outcomes                | \_/3  |
| R4  | **Retrospectives**: Do retrospectives produce actionable improvements?                                  | No retrospectives, or retrospectives with no follow-through    | Retrospectives after every sprint; >= 70% of action items completed by next retro | Continuous improvement culture; process changes tracked and measured                          | \_/3  |
| R5  | **BizDevOps Integration**: Are business, development, and operations aligned in one flow?               | Disconnected teams; business throws requirements over the wall | Regular JAD sessions; business attends sprint demos; shared understanding         | Fully integrated BizDevOps; business and tech make decisions together in real-time            | \_/3  |
| R6  | **Process Documentation**: Are processes documented and accessible?                                     | Tribal knowledge only                                          | Core processes documented; AX framework guides available to team                  | Living documentation updated within 30 days; new team members self-onboard                    | \_/3  |
| R7  | **Parallel Workstreams**: Can multiple workstreams (Frontend, Backend, Data, AI-ML) run simultaneously? | Sequential work; one workstream waits for another              | API contracts defined upfront; workstreams operate in parallel with sync points   | Parallel workstreams are routine; integration issues are rare; contract-first is default      | \_/3  |
| R8  | **Lean Waste Reduction**: Is the team actively identifying and eliminating waste?                       | No waste awareness                                             | 8 wastes understood; major bottlenecks identified and addressed                   | Continuous flow; WIP limits enforced; cycle time measured and optimized                       | \_/3  |

**PROCESS Score**: **\_ / 24 | **Maturity Level**: \_**

| Score Range | Maturity Level |
| ----------- | -------------- |
| 8-13        | Start          |
| 14-19       | Structure      |
| 20-24       | Scale          |

---

## Pillar 4: PLATFORM

> **Core Question**: "Does our technology multiply or constrain our velocity?"
>
> **Primary Owners**: CDO + CAO
>
> **AX Principle**: "AI as Team Member" — the platform must support AI-native development.

### Assessment Questions

| #   | Question                                                                                    | 1 (Start)                                                  | 2 (Structure)                                                                | 3 (Scale)                                                                                      | Score |
| --- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----- |
| T1  | **CI/CD Pipeline**: Is there an automated build, test, and deploy pipeline?                 | Manual deployment; no automation                           | CI/CD pipeline operational with automated tests; >= 95% build reliability    | Continuous deployment; feature flags; blue-green or canary releases                            | \_/3  |
| T2  | **Test Coverage**: Is automated testing in place for critical paths?                        | Minimal or no automated tests                              | >= 70% coverage on critical paths; unit + integration tests                  | Comprehensive test suite; E2E tests for core flows; tests run on every commit                  | \_/3  |
| T3  | **Shared Components**: Are reusable components (design system, auth, analytics) available?  | No shared components; each product builds from scratch     | Design system and core components available; >= 30% UI from shared library   | Composable architecture; new products assemble from existing components                        | \_/3  |
| T4  | **AI Development Tools**: Are AI-assisted development tools configured and adopted?         | No AI tools; traditional development only                  | Claude Code / Cursor configured; team trained; initial AI-assisted workflows | 70%+ AI-assisted code generation; AI integrated into all development phases                    | \_/3  |
| T5  | **Architecture Decision Records**: Are significant technical decisions documented?          | No documentation of technical decisions                    | ADRs written for major decisions; reviewed in sprint planning                | ADR library searchable; new decisions reference prior ADRs; architecture evolves intentionally | \_/3  |
| T6  | **Technical Debt Management**: Is technical debt tracked and addressed?                     | Debt accumulates untracked; periodic crises                | Debt register maintained; >= 15% sprint capacity allocated to debt reduction | Debt ratio stable; proactive debt prevention; architecture reviews prevent accumulation        | \_/3  |
| T7  | **Monitoring & Observability**: Can the team detect and diagnose production issues quickly? | No monitoring; issues discovered by users                  | Error tracking, alerting, and basic dashboards in place                      | Full observability stack; anomaly detection; MTTR < 1 hour                                     | \_/3  |
| T8  | **Data Platform Readiness**: Is the shared data platform (AData) available for IRIS?        | No shared data platform; each product manages its own data | AData available for basic storage and pipelines                              | Full data platform with ETL, analytics, and cross-product data sharing                         | \_/3  |

**PLATFORM Score**: **\_ / 24 | **Maturity Level**: \_**

| Score Range | Maturity Level |
| ----------- | -------------- |
| 8-13        | Start          |
| 14-19       | Structure      |
| 20-24       | Scale          |

---

## Pillar 5: PROMOTION

> **Core Question**: "Are our wins visible and our learnings shared?"
>
> **Primary Owners**: CXO + CEO
>
> **AX Principle**: "Promote Success" — without promotion, adoption stalls and teams burn out.

### Assessment Questions

| #   | Question                                                                                  | 1 (Start)                                 | 2 (Structure)                                                    | 3 (Scale)                                                                                | Score |
| --- | ----------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----- |
| M1  | **Sprint Demos**: Are sprint demos held regularly with stakeholders beyond the core team? | No demos, or demos only for core team     | Demos every sprint with >= 3 additional stakeholders attending   | Demos are a cultural ritual; cross-team attendance; recorded and shared                  | \_/3  |
| M2  | **Go-Live Celebrations**: Are product launches and milestones celebrated visibly?         | Ship and move on; no recognition          | Milestones acknowledged; team recognition at go-live             | Visible celebrations; company-wide announcements; team achievements highlighted          | \_/3  |
| M3  | **Knowledge Sharing**: Are learnings shared across teams?                                 | Knowledge stays within the team           | Learning showcases at end of DISCOVER and ITERATE phases         | Community of practice established; cross-team knowledge base; case studies published     | \_/3  |
| M4  | **Internal Case Studies**: Are product journeys documented for future teams?              | No documentation of what worked or failed | Case studies written for completed product cycles                | Case study library; new teams reference prior product journeys; pattern recognition      | \_/3  |
| M5  | **External Communication**: Is the transformation story shared externally?                | No external communication                 | >= 2 external touchpoints per quarter (blog, social, conference) | Thought leadership established; employer brand strengthened; community engagement active | \_/3  |
| M6  | **Metrics Storytelling**: Are quantitative results paired with qualitative narratives?    | Dashboards shared without context         | Metrics presented with user stories and impact narratives        | Data storytelling is a team skill; stakeholders receive both numbers and narratives      | \_/3  |

**PROMOTION Score**: **\_ / 18 | **Maturity Level**: \_**

| Score Range | Maturity Level |
| ----------- | -------------- |
| 6-9         | Start          |
| 10-13       | Structure      |
| 14-18       | Scale          |

---

## Scoring Summary

### Overall Maturity Dashboard

| Pillar        | Score  | Max | Maturity Level | Target Level | Gap |
| ------------- | ------ | --- | -------------- | ------------ | --- |
| **PEOPLE**    | \_\_\_ | 21  |                |              |     |
| **PORTFOLIO** | \_\_\_ | 18  |                |              |     |
| **PROCESS**   | \_\_\_ | 24  |                |              |     |
| **PLATFORM**  | \_\_\_ | 24  |                |              |     |
| **PROMOTION** | \_\_\_ | 18  |                |              |     |
| **OVERALL**   | \_\_\_ | 105 |                |              |     |

### Overall Maturity Level

| Score Range | Overall Level | Description                                                        |
| ----------- | ------------- | ------------------------------------------------------------------ |
| 35-52       | **Start**     | First product, team forming, processes establishing                |
| 53-73       | **Structure** | Repeatable processes, governance in place, second product possible |
| 74-105      | **Scale**     | Enterprise capability, CoE functioning, portfolio managed          |

---

## Gap Identification and Action Plan

### Priority Gaps

Identify the top 3-5 gaps that pose the highest risk to IRIS delivery.

| #   | Pillar | Question # | Current Score | Target Score | Gap Description | Impact if Not Addressed |
| --- | ------ | ---------- | ------------- | ------------ | --------------- | ----------------------- |
| 1   |        |            |               |              |                 |                         |
| 2   |        |            |               |              |                 |                         |
| 3   |        |            |               |              |                 |                         |
| 4   |        |            |               |              |                 |                         |
| 5   |        |            |               |              |                 |                         |

### Action Plan

| #   | Gap | Action | Owner | Timeline | Success Criteria | Status         |
| --- | --- | ------ | ----- | -------- | ---------------- | -------------- |
| 1   |     |        |       |          |                  | ⬜ Not Started |
| 2   |     |        |       |          |                  | ⬜ Not Started |
| 3   |     |        |       |          |                  | ⬜ Not Started |
| 4   |     |        |       |          |                  | ⬜ Not Started |
| 5   |     |        |       |          |                  | ⬜ Not Started |

### Center of Excellence (CoE) Alignment

| Maturity Level | CoE Model                              | Description                                                                                                                |
| -------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Start**      | **Centralized**                        | One central team owns all standards, tools, and governance. Small team, single product focus.                              |
| **Structure**  | **Centralized → Federated transition** | Standards established centrally; product teams begin autonomous execution with shared guidelines.                          |
| **Scale**      | **Federated**                          | Central team sets principles and guardrails; product teams adapt within boundaries. Pillar representatives on CoE council. |

**Current CoE Model**: \_\_\_

**Target CoE Model**: \_\_\_

---

## Target Maturity Setting

### Year 1 Targets for IRIS

| Pillar        | Current Level | Q1 Target | Q2 Target | Q3 Target | Q4 Target |
| ------------- | ------------- | --------- | --------- | --------- | --------- |
| **PEOPLE**    |               |           |           |           |           |
| **PORTFOLIO** |               |           |           |           |           |
| **PROCESS**   |               |           |           |           |           |
| **PLATFORM**  |               |           |           |           |           |
| **PROMOTION** |               |           |           |           |           |

**AX Year 1 Goal**: Reach Level 2 (Structure) across all pillars by mid-year; approach Level 3 (Scale) in PROCESS and PLATFORM by year-end.

### Reassessment Schedule

| Assessment           | Timing                  | Purpose                      |
| -------------------- | ----------------------- | ---------------------------- |
| Initial assessment   | Before DISCOVER kickoff | Baseline                     |
| Mid-cycle check      | After first DELIVER     | Progress against targets     |
| Quarterly assessment | End of each quarter     | Formal maturity review       |
| ITERATE reassessment | Each ITERATE phase      | Integrate into retrospective |

---

## References

- AX Framework: [02 AX Framework Comprehensive](../.ax/02_AX_FRAMEWORK_COMPREHENSIVE.md) (Section 6: Five Pillars of Execution)
- Gate Reviews: [gate-reviews.md](gate-reviews.md)
- Metrics Setup: [metrics-setup.md](metrics-setup.md)
