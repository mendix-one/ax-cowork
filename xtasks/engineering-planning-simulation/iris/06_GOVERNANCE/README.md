# 06 GOVERNANCE

> **Version**: 1.0.0
> Evidence-based decision-making across all 4 phase gates.
>
> **AX Principle**: Governance Enables Speed

---

## Purpose

Governance is not bureaucracy. Done correctly, phase gates **accelerate** delivery by preventing costly rework, forcing evidence-based decisions, aligning the team, and creating accountability. This folder contains the project-level governance artifacts: gate review records, organizational readiness assessments, and metrics framework configuration.

---

## Three-Level Governance

AX operates a three-level governance model to ensure decisions are made at the right level, at the right cadence:

| Level           | Cadence   | Focus                                                         | Attendees         | Decision Scope                                        |
| --------------- | --------- | ------------------------------------------------------------- | ----------------- | ----------------------------------------------------- |
| **Strategic**   | Monthly   | Portfolio health, North Star trajectory, investment decisions | CEO + Leadership  | Portfolio rebalancing, strategic pivots               |
| **Program**     | Bi-weekly | Phase progress, gate readiness, OMTM tracking                 | CPO + Phase Owner | Phase transitions, OMTM changes, resource allocation  |
| **Application** | Weekly    | Sprint execution, engineering health, blocker resolution      | CDO + Dev Team    | Sprint scope, technical decisions, impediment removal |

---

## The Four Gates

| Gate       | Transition        | Core Question                          | GO Threshold | Decision Options                 |
| ---------- | ----------------- | -------------------------------------- | ------------ | -------------------------------- |
| **Gate 1** | DISCOVER → DESIGN | "Is this a problem worth solving?"     | ≥ 70%        | GO / CONDITIONAL / NO-GO / PAUSE |
| **Gate 2** | DESIGN → DEVELOP  | "Is our solution the right approach?"  | ≥ 70%        | GO / CONDITIONAL / NO-GO / PAUSE |
| **Gate 3** | DEVELOP → DELIVER | "Is the product ready for real users?" | ≥ 75%        | GO / CONDITIONAL / NO-GO / PAUSE |
| **Gate 4** | DELIVER → ITERATE | "Did we create measurable value?"      | ≥ 70%        | GO / CONDITIONAL / NO-GO / PAUSE |

**Gate 3 has a higher threshold (75%)** because it gates production deployment. The cost of a production-quality failure is significantly higher than earlier-phase rework.

### Decision Options

| Decision           | Definition                                     | Next Action                                                           |
| ------------------ | ---------------------------------------------- | --------------------------------------------------------------------- |
| **GO**             | All criteria met at threshold                  | Transition to next phase within 3 days                                |
| **CONDITIONAL GO** | Most criteria met with minor gaps              | Proceed but track conditions; resolve within 1-2 weeks                |
| **NO-GO**          | Significant gaps or any Fail score             | Return to current phase; address gaps; reschedule review in 1-2 weeks |
| **PAUSE**          | Insufficient evidence for a confident decision | Extend current phase by 1 week with targeted evidence-gathering plan  |

---

## Metrics Framework Overview

AX uses a 3-tier metrics framework to ensure every product measures what matters:

| Tier                    | Metric Type                        | Cadence        | Purpose                                                                                    |
| ----------------------- | ---------------------------------- | -------------- | ------------------------------------------------------------------------------------------ |
| **Tier 1: Strategic**   | **North Star Metric**              | Monthly        | Single, stable metric reflecting core value delivery. Changes rarely (12+ months).         |
| **Tier 2: Program**     | **OMTM** (One Metric That Matters) | Bi-weekly      | Tactical, short-term focus metric aligned with current AX phase. Changes every 2-6 months. |
| **Tier 3: Application** | **AARRR Funnel**                   | Weekly         | Operational product health — Acquisition, Activation, Retention, Revenue, Referral.        |
| **Cross-cutting**       | **DORA Metrics**                   | Per deployment | Engineering health — Deployment Frequency, Lead Time, MTTR, Change Failure Rate.           |

---

## Files in This Folder

| File                                                     | Purpose                                                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [gate-reviews.md](gate-reviews.md)                       | Gate review tracker — record scores, decisions, and conditions for all 4 gates             |
| [five-pillars-assessment.md](five-pillars-assessment.md) | Organizational readiness assessment across People, Portfolio, Process, Platform, Promotion |
| [metrics-setup.md](metrics-setup.md)                     | 3-tier metrics framework configuration (North Star, OMTM, AARRR, DORA, Growth Engine)      |

---

## Available Skills

| Skill          | Purpose                                                                                 |
| -------------- | --------------------------------------------------------------------------------------- |
| `/gate-review` | Automated gate review preparation — compiles evidence, scores criteria, identifies gaps |

## Workflow

| Workflow         | Purpose                                                                          |
| ---------------- | -------------------------------------------------------------------------------- |
| Gate Preparation | Automates compilation and scoring of phase gate evidence (see `.ax/governance/`) |

---

## Reference Guides

Detailed governance guides live in the `.ax/` framework directory:

| Guide                                                                                   | Description                                                                     |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [G1 Phase Gate Governance Guide](../.ax/governance/G1_PHASE_GATE_GOVERNANCE_GUIDE.md)   | Complete gate criteria, scoring rubrics, meeting format, and decision framework |
| [G2 Metrics and Validation Guide](../.ax/governance/G2_METRICS_AND_VALIDATION_GUIDE.md) | Three-tier metrics model, validation scorecards, measurement cadence            |
| [G3 Portfolio and Backlog Guide](../.ax/governance/G3_PORTFOLIO_AND_BACKLOG_GUIDE.md)   | Portfolio management, backlog prioritization, resource allocation               |
