# 04 DELIVER — Are Users Getting Value?

> **Version**: 1.0.0
> **Dominant Lenses**: Governance + Validation
> **Duration**: 4-6 weeks typical (4-8 weeks range)
> **Exit**: Gate 4 Review

```
DELIVER Lens Dominance:
  ██████████ GOVERNANCE   — Production readiness. Incident response. Deployment discipline.
  ██████░░░░ VALIDATION   — Innovation Accounting. Hypothesis validation with real data.
  ██░░░░░░░░ EMPATHY      — User onboarding. Support. Observe real usage.
  ██░░░░░░░░ SPEED        — Quick incident resolution. Rapid hotfixes. No big new features.
```

---

## Kickoff Checklist

Complete before beginning DELIVER work.

### DEVELOP Gate Passed

- [ ] Gate 3 completed with GO or CONDITIONAL GO decision
- [ ] Gate 3 decision document archived
- [ ] Conditional items documented (if CONDITIONAL GO) with timeline:
  - [ ] Condition 1: ******\_\_\_******
  - [ ] Condition 2: ******\_\_\_******

### DEVELOP Deliverables Carried Forward

- [ ] Working MVP feature-complete (all Must-Have stories done)
- [ ] P0 and P1 bugs resolved; P2 bugs documented with workarounds
- [ ] Automated test suite with coverage report
- [ ] CI/CD pipeline operational (staging + production)
- [ ] Performance baselines established
- [ ] Security review completed (no critical/high vulnerabilities)
- [ ] API documentation complete
- [ ] Deployment runbook written and tested
- [ ] CDO has run "Production Readiness Review"
- [ ] COO has confirmed support and monitoring readiness
- [ ] CPO has confirmed early adopter recruitment

### Staging and Production

- [ ] Staging environment deployed and regression-tested
- [ ] Production environment configured
- [ ] Feature flags configured for controlled rollout
- [ ] Rollback procedures documented and tested
- [ ] Load testing completed
- [ ] Blue-green or canary deployment strategy defined
- [ ] Error tracking and alerting configured

### Early Adopter Cohort

- [ ] Early adopters identified and recruited (target 3-5 organizations)
- [ ] Onboarding materials prepared:
  - [ ] Welcome guide
  - [ ] Getting started video or walkthrough
  - [ ] FAQ document
  - [ ] Support channel established
- [ ] Onboarding schedule set:
  - [ ] Week 1: Welcome and guided setup
  - [ ] Week 2: Guided usage with support
  - [ ] Week 3: Independent usage
  - [ ] Week 4+: Check-in and feedback collection
- [ ] Time-to-value target defined: < 3 days to first core workflow completion
- [ ] White-glove support plan for first week

### Monitoring and Metrics

- [ ] AARRR metrics dashboard configured:
  - [ ] Acquisition: signups, page views, demo requests
  - [ ] Activation: onboarding completion, first key action
  - [ ] Retention: DAU/MAU, session frequency
  - [ ] Revenue: conversion signals, willingness to pay
  - [ ] Referral: NPS, recommendations
- [ ] System health monitoring live (uptime, latency, error rates)
- [ ] Innovation Accounting baseline plan defined
- [ ] Growth engine selected: Sticky / Viral / Paid

### Feedback Collection

- [ ] Feedback collection process defined:
  - [ ] Bi-weekly check-in calls scheduled with early adopters
  - [ ] NPS/CSAT survey prepared
  - [ ] In-context observation sessions planned
- [ ] Hypothesis validation tracker ready (confirmed / partially confirmed / disproved)

### Incident Response

- [ ] Incident response process defined (roles, escalation path, communication)
- [ ] Critical bug SLA: resolved within 24 hours
- [ ] Known-issues communication plan for early adopters
- [ ] MTTR tracking configured

### Gate 4 Preparation

- [ ] Gate 4 criteria reviewed by team
- [ ] Gate 4 review meeting scheduled: {{GATE_4_DATE}}

**Kickoff Decision**: [ ] GO | [ ] GO WITH RISKS | [ ] DELAY

---

## Activities

| #   | Activity                 | Guide                                                                  | Description                                                             | Owner     |
| --- | ------------------------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------- |
| L1  | Deployment Planning      | [L1 Guide](.ax/framework/deliver/L1_DEPLOYMENT_PLANNING_GUIDE.md)      | Environment pipeline, pre-deployment checklist, data migration, go-live | CDO       |
| L2  | Early Adopter Onboarding | [L2 Guide](.ax/framework/deliver/L2_EARLY_ADOPTER_ONBOARDING_GUIDE.md) | Recruit 3-5 orgs, guided onboarding, white-glove support                | CPO + CXO |
| L3  | Usage Monitoring         | [L3 Guide](.ax/framework/deliver/L3_USAGE_MONITORING_GUIDE.md)         | AARRR tracking, system health, feature adoption analytics               | CDO + CPO |
| L4  | Feedback Collection      | [L4 Guide](.ax/framework/deliver/L4_FEEDBACK_COLLECTION_GUIDE.md)      | Check-in calls, NPS/CSAT, observation sessions, hypothesis validation   | CPO + CXO |
| L5  | Gate 4 Preparation       | [L5 Guide](.ax/framework/deliver/L5_GATE_4_REVIEW_GUIDE.md)            | Compile Innovation Accounting data and evidence for Gate 4              | CPO       |

---

## AI Workflows for This Phase

| Workflow                  | File                                                               | What It Does                                                         | Collaboration Level |
| ------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------- |
| **Innovation Accounting** | [innovation-accounting.md](.ax/workflows/innovation-accounting.md) | 3-step process: Baseline, Tune the Engine, Pivot or Persevere signal | AI Analyzes         |
| **Document Drafting**     | [document-drafting.md](.ax/workflows/document-drafting.md)         | Deployment runbooks, onboarding guides, feedback synthesis reports   | AI Leads            |

### Available Skills

| Skill              | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `/deliver-deploy`  | Generate deployment plan and pre-deployment checklist  |
| `/deliver-onboard` | Create early adopter onboarding materials and schedule |

---

## Early Adopter Cohort

The DELIVER phase centers on getting real users to use the product in real environments.

### Cohort Parameters

| Parameter                   | Target                                                          |
| --------------------------- | --------------------------------------------------------------- |
| **Number of organizations** | 3-5                                                             |
| **Minimum usage period**    | 2 weeks active usage                                            |
| **Time-to-value target**    | < 3 days to first core workflow completion                      |
| **Support model**           | White-glove (week 1), guided (weeks 2-3), independent (week 4+) |
| **Feedback cadence**        | Bi-weekly check-in calls                                        |

### Onboarding Schedule

| Week | Activity                         | Goal                                        |
| ---- | -------------------------------- | ------------------------------------------- |
| 1    | Welcome and guided setup         | User can log in and navigate core screens   |
| 2    | Guided usage with support        | User completes first core workflow          |
| 3    | Independent usage                | User operates without hand-holding          |
| 4+   | Check-in and feedback collection | Collect usage data and qualitative feedback |

---

## AARRR Metrics Tracking

Set up the full pirate metrics funnel for the early adopter cohort.

| Metric          | What to Measure                                   | Target                      |
| --------------- | ------------------------------------------------- | --------------------------- |
| **Acquisition** | Signups, page views, demo requests                | _Define baseline_           |
| **Activation**  | Onboarding completion rate, first key action      | >= 60% within first week    |
| **Retention**   | DAU/MAU ratio, session frequency                  | _Track trend_               |
| **Revenue**     | Conversion signals, willingness-to-pay indicators | _Qualitative at this stage_ |
| **Referral**    | NPS score, organic recommendations                | NPS >= 30                   |

### Innovation Accounting Setup

Follow the 3-step process from the Innovation Accounting workflow:

1. **Establish Baseline** — Collect actual metrics after 2 weeks of usage
2. **Tune the Engine** — Make micro-adjustments, measure impact per action
3. **Pivot or Persevere** — Is the growth engine responding to tuning?

**Growth Engine**: {{GROWTH_ENGINE}}

| Engine     | Core Metric       | Key Signal                        |
| ---------- | ----------------- | --------------------------------- |
| **Sticky** | Churn rate        | Churn rate decreasing over time   |
| **Viral**  | Viral coefficient | Coefficient > 1.0 and increasing  |
| **Paid**   | LTV vs CPA        | LTV/CPA ratio > 3:1 and improving |

---

## Templates

| #   | Template                                | Purpose                           |
| --- | --------------------------------------- | --------------------------------- |
| T27 | [Deployment Checklist](.ax/templates/)  | Pre-deployment verification       |
| T28 | [Early Adopter Profile](.ax/templates/) | Track each early adopter org      |
| T29 | [Feedback Synthesis](.ax/templates/)    | Compile and analyze user feedback |

---

## Deliverables Checklist

Everything the team must produce before Gate 4. Track status in `PROGRESS.md`.

- [ ] **Production Deployment** — MVP live in production environment
- [ ] **Early Adopter Onboarding** — 3-5 organizations onboarded and active
- [ ] **Minimum Usage Period** — At least 2 weeks of real-world usage data
- [ ] **AARRR Metrics Dashboard** — Configured and collecting data
- [ ] **Innovation Accounting Baseline** — First baseline report completed
- [ ] **Usage Analytics Report** — Feature adoption, drop-off points, session data
- [ ] **Feedback Synthesis** — Bi-weekly check-in summaries compiled
- [ ] **NPS/CSAT Scores** — Collected from early adopters
- [ ] **Hypothesis Validation Results** — Each hypothesis marked confirmed/partially/disproved
- [ ] **Incident Log** — All production incidents documented with postmortems
- [ ] **System Health Report** — Uptime, latency, error rates during early adopter period
- [ ] **Gate 4 Evidence Package** — Innovation Accounting + user evidence compiled

---

## Exit: Gate 4 Review

When all deliverables are complete, proceed to the Gate 4 Review.

**Gate 4 Location**: [06_GOVERNANCE/](../06_GOVERNANCE/)

**Gate 4 Criteria**:

- MVP deployed and used by early adopters for minimum 2 weeks
- AARRR metrics baseline established with real data
- Innovation Accounting baseline report completed
- At least 3 early adopter organizations providing active feedback
- Hypothesis validation results documented
- NPS/CSAT scores collected
- Production stability demonstrated (uptime, incident response)
- Feedback synthesis report compiled
- Engine of Growth analysis completed

**Gate Decisions**: GO | CONDITIONAL GO | NO-GO | PAUSE

**After Gate 4 GO --> proceed to [05_ITERATE/README.md](../05_ITERATE/README.md)**

---

_AX Kit v3.0 — DELIVER Phase Working Guide_
