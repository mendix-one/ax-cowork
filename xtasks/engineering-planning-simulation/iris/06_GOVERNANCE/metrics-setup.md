# Metrics Setup — IRIS

> **Version**: 1.0.0
> Configure the 3-tier metrics framework for IRIS.
>
> **Date**: {{DATE}} | **Owner**: \_\_\_

---

## Purpose

AX uses a 3-tier metrics framework to ensure every product measures what matters — from strategic direction down to daily engineering health. This guide walks you through configuring all three tiers for IRIS, selecting a growth engine, setting up DORA metrics, and establishing the measurement cadence.

**When to use**: Begin during DISCOVER (define North Star). Refine during DESIGN (select OMTM). Instrument during DEVELOP (build dashboards). Activate during DELIVER (collect real data). Analyze during ITERATE (drive decisions).

**AX Principles applied**:

- "Validated Learning" — metrics are evidence, not decoration
- "Value Over Features" — measure business outcomes, not output
- "Hypothesis-Driven Development" — every metric traces to a hypothesis

---

## 1. The Three Tiers

```
+-----------------------------------------------------------------+
|                  3-TIER METRICS FRAMEWORK                       |
|-----------------------------------------------------------------|
|                                                                 |
|  TIER 1: STRATEGIC                                              |
|  +-----------------------------------------------------------+ |
|  |  NORTH STAR METRIC                                         | |
|  |  Stable - Company-wide - Reflects core value delivery      | |
|  |  Changes: Rarely (12+ months)  |  Owner: CEO + CPO         | |
|  +-----------------------------------------------------------+ |
|                            |                                    |
|  TIER 2: PROGRAM           v                                    |
|  +-----------------------------------------------------------+ |
|  |  OMTM (One Metric That Matters)                            | |
|  |  Tactical - Short-term focus - Changes every 2-6 months    | |
|  |  Aligned with current AX phase  |  Owner: CPO              | |
|  +-----------------------------------------------------------+ |
|                            |                                    |
|  TIER 3: APPLICATION       v                                    |
|  +-----------------------------------------------------------+ |
|  |  AARRR FUNNEL METRICS                                      | |
|  |  Operational - Per-phase focus - Tracks funnel health       | |
|  |  Acquisition - Activation - Retention - Revenue - Referral  | |
|  |  Owner: CDO (dashboard) + CPO (interpretation)             | |
|  +-----------------------------------------------------------+ |
|                                                                 |
|  CROSS-CUTTING: DORA METRICS (Engineering Health)               |
|  +-----------------------------------------------------------+ |
|  |  Deployment Frequency - Lead Time - MTTR - Change Failure  | |
|  |  Owner: CDO                                                | |
|  +-----------------------------------------------------------+ |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 2. Tier 1: Strategic — North Star Metric

The North Star Metric is a single, stable metric reflecting the core value IRIS delivers to customers. It does not change frequently. It represents what matters most for long-term success.

### 2.1 Define Your North Star

| Field                  | Value                                             |
| ---------------------- | ------------------------------------------------- |
| **North Star Metric**  | \_\_\_                                            |
| **Precise Definition** | _Exactly how is this calculated? What counts?_    |
| **Unit**               | _e.g., count per week, percentage, dollar amount_ |
| **Measurement Source** | _Where does the data come from?_                  |
| **Current Baseline**   | _Starting value (0 if new product)_               |
| **Year 1 Target**      | _What value indicates product-market fit?_        |
| **Review Cadence**     | Monthly review, annual reset                      |

### 2.2 North Star Validation Checklist

Your North Star must pass all five criteria:

- [ ] **Reflects customer value**: It measures value delivered to the customer, not internal activity.
- [ ] **Leading indicator of revenue**: It predicts future revenue growth.
- [ ] **Measurable**: You can instrument it with available or planned tools.
- [ ] **Understandable**: Every team member can explain it in one sentence.
- [ ] **Stable**: It will remain relevant for 12+ months.

### 2.3 North Star Examples by Pillar

| Pillar            | Product Example   | North Star Example                                   |
| ----------------- | ----------------- | ---------------------------------------------------- |
| **MAKE**          | aPlanner          | Number of production plans optimized per week        |
| **MOVE**          | Supply chain tool | Shipments delivered on-time per week                 |
| **SELL**          | Commerce platform | Transactions completed per day                       |
| **DELIGHT**       | CX tool           | Customer issues resolved without escalation per week |
| **AI FOUNDATION** | ACore             | AI inferences served per day                         |
| **LIFE**          | SoulPlan          | Personal goals completed per month                   |
| **DEVELOPER**     | AForge            | Applications deployed via platform per week          |

---

## 3. Tier 2: Program — OMTM (One Metric That Matters)

The OMTM is a tactical, short-term focus metric. It changes every 2-6 months based on the current AX phase and the biggest lever for growth.

### 3.1 OMTM by AX Phase

| AX Phase     | Recommended OMTM Focus        | Example OMTM                                    | Why This Metric                                                 |
| ------------ | ----------------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| **DISCOVER** | Research depth and validation | Number of validated problem assumptions         | Ensures research is producing evidence, not just interviews     |
| **DESIGN**   | Solution desirability         | Prototype usability score (SUS)                 | Validates that the solution resonates with users                |
| **DEVELOP**  | Delivery velocity and quality | Sprint velocity trend (story points per sprint) | Ensures the team is building at a sustainable, predictable pace |
| **DELIVER**  | User adoption                 | Early adopter activation rate                   | Measures whether real users find value in the first experience  |
| **ITERATE**  | Value confirmation            | Feature adoption rate among pilot users         | Reveals which features deliver value and which to cut           |

### 3.2 Define Your Current OMTM

| Field                  | Value                           |
| ---------------------- | ------------------------------- |
| **Current AX Phase**   | \_\_\_                          |
| **OMTM**               | \_\_\_                          |
| **Precise Definition** | _How is this calculated?_       |
| **Current Value**      | \_\_\_                          |
| **Target Value**       | \_\_\_                          |
| **Target Date**        | \_\_\_                          |
| **Review Cadence**     | Bi-weekly at program governance |
| **Next OMTM Review**   | \_\_\_                          |

### 3.3 OMTM Selection Criteria

- [ ] Directly connected to the North Star (moving the OMTM moves the North Star)
- [ ] Actionable in the current phase (team can influence it)
- [ ] Measurable within the current tooling
- [ ] Has a clear target and timeframe
- [ ] Not a vanity metric (see Section 8 below)

---

## 4. Tier 3: Application — AARRR Funnel Metrics

The AARRR framework (Pirate Metrics) provides a funnel-based view of product health.

### 4.1 AARRR Configuration for IRIS

| Stage           | Definition for IRIS                     | Key Metrics | Target                                    | Owner |
| --------------- | --------------------------------------- | ----------- | ----------------------------------------- | ----- |
| **Acquisition** | How do users find IRIS?                 | \_\_\_      | Growing MoM                               | CXO   |
| **Activation**  | Do users have a great first experience? | \_\_\_      | 70%+ complete onboarding in first session | CPO   |
| **Retention**   | Do users come back?                     | \_\_\_      | DAU/MAU > 30%; monthly churn < 5%         | CPO   |
| **Revenue**     | Do users pay?                           | \_\_\_      | Pilot conversion > 50%; ARPU increasing   | CEO   |
| **Referral**    | Do users tell others?                   | \_\_\_      | NPS > 40; viral coefficient > 0.5         | CXO   |

### 4.2 AARRR by Phase Focus

Not all funnel stages matter equally in every phase:

| AX Phase     | Primary AARRR Focus      | Secondary | Rationale                                                           |
| ------------ | ------------------------ | --------- | ------------------------------------------------------------------- |
| **DISCOVER** | -- (pre-product)         | --        | No product yet; focus on problem validation metrics                 |
| **DESIGN**   | Activation (prototype)   | --        | Usability testing measures activation-like behavior                 |
| **DEVELOP**  | -- (pre-deployment)      | --        | Engineering metrics (DORA) dominate; AARRR instrumentation is built |
| **DELIVER**  | Acquisition + Activation | Retention | Are users signing up and experiencing first value?                  |
| **ITERATE**  | Retention + Revenue      | Referral  | Are users staying and paying? Are they recommending?                |

### 4.3 AARRR Event Definitions

| Stage       | Event Name            | Description                                                   | Trigger | Where Tracked |
| ----------- | --------------------- | ------------------------------------------------------------- | ------- | ------------- |
| Acquisition | `user_signup`         | User creates an account                                       |         |               |
| Acquisition | `demo_request`        | User requests a demo                                          |         |               |
| Activation  | `onboarding_complete` | User finishes onboarding flow                                 |         |               |
| Activation  | `first_value_action`  | User completes core workflow for the first time               |         |               |
| Retention   | `weekly_active`       | User logs in and performs a core action within a 7-day window |         |               |
| Retention   | `feature_return`      | User returns to a specific feature after first use            |         |               |
| Revenue     | `trial_to_paid`       | User converts from trial to paid plan                         |         |               |
| Revenue     | `expansion`           | User upgrades or adds seats                                   |         |               |
| Referral    | `invitation_sent`     | User invites a colleague                                      |         |               |
| Referral    | `nps_promoter`        | User scores NPS 9-10                                          |         |               |

---

## 5. DORA Metrics — Engineering Health

DevOps Research and Assessment (DORA) metrics measure software delivery performance.

### 5.1 DORA Configuration

| DORA Metric                      | Definition                                  | Year 1 Target    | Year 2+ Target     | Owner |
| -------------------------------- | ------------------------------------------- | ---------------- | ------------------ | ----- |
| **Deployment Frequency**         | How often code deploys to production        | Weekly (minimum) | Daily or on-demand | CDO   |
| **Lead Time for Changes**        | Time from commit to production              | < 1 week         | < 1 day            | CDO   |
| **Mean Time to Recovery (MTTR)** | Time from incident detection to restoration | < 4 hours        | < 1 hour           | CDO   |
| **Change Failure Rate**          | % of deployments causing production failure | < 15%            | < 10%              | CDO   |

### 5.2 DORA Maturity Benchmarks

| Metric               | Low        | Medium           | High           | Elite     |
| -------------------- | ---------- | ---------------- | -------------- | --------- |
| Deployment Frequency | < 1/month  | 1/month - 1/week | 1/day - 1/week | On demand |
| Lead Time            | > 6 months | 1-6 months       | 1 day - 1 week | < 1 hour  |
| MTTR                 | > 1 week   | 1 day - 1 week   | < 1 day        | < 1 hour  |
| Change Failure Rate  | > 30%      | 16-30%           | 6-15%          | 0-5%      |

**Year 1 Goal**: Achieve "Medium" across all four metrics by Q2, "High" by Q4.

### 5.3 DORA Tracking Setup

| Metric               | Data Source                    | Collection Method                                | Dashboard Location |
| -------------------- | ------------------------------ | ------------------------------------------------ | ------------------ |
| Deployment Frequency | _CI/CD tool_                   | Automated from pipeline events                   |                    |
| Lead Time            | Git + _CI/CD tool_             | Automated: commit timestamp to deploy timestamp  |                    |
| MTTR                 | _Incident tool_                | Manual entry per incident; automated calculation |                    |
| Change Failure Rate  | _CI/CD tool_ + _Incident tool_ | Automated: failures / total deployments          |                    |

---

## 6. Growth Engine Selection

Select the primary growth engine for IRIS. Focus on one engine at a time.

### 6.1 The Three Engines

| Engine     | How It Works                                                                           | Key Metric                            | When to Choose                                                      |
| ---------- | -------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| **Sticky** | Users come back because the product is indispensable. High switching costs.            | **Churn rate** (target: < 5% monthly) | Enterprise tools, daily-use products, high-switching-cost solutions |
| **Viral**  | Users bring other users through natural product usage. Network effects.                | **Viral coefficient** (target: > 1.0) | Collaboration tools, social features, network-effect products       |
| **Paid**   | Customer lifetime value exceeds customer acquisition cost. Sustainable unit economics. | **LTV:CPA ratio** (target: > 3:1)     | Clear ROI products, enterprise sales, defined buyer persona         |

### 6.2 Engine Selection Worksheet

Rate each engine for IRIS on a 1-5 scale:

| Factor                                        | Sticky | Viral | Paid  |
| --------------------------------------------- | ------ | ----- | ----- |
| Product usage frequency (daily = high Sticky) | \_/5   |       |       |
| Built-in sharing/collaboration features       |        | \_/5  |       |
| Clear, quantifiable ROI for buyer             |        |       | \_/5  |
| Switching costs / data lock-in                | \_/5   |       |       |
| Network effects (more users = more value)     |        | \_/5  |       |
| Defined buyer persona with budget             |        |       | \_/5  |
| **Total**                                     | \_/10  | \_/10 | \_/10 |

**Selected Engine**: \_\_\_

---

## 7. Dashboard Configuration

| Section           | Metrics                               | Update Frequency           |
| ----------------- | ------------------------------------- | -------------------------- |
| **North Star**    | North Star Metric + trend line        | Daily (automated)          |
| **OMTM**          | Current OMTM + target line + progress | Daily (automated)          |
| **AARRR Funnel**  | All 5 stages with conversion rates    | Daily (automated)          |
| **Growth Engine** | Engine-specific metrics               | Weekly (automated)         |
| **DORA**          | All 4 engineering metrics             | Per deployment (automated) |

### Alert Configuration

| Alert              | Trigger                       | Severity | Notify    | Response                           |
| ------------------ | ----------------------------- | -------- | --------- | ---------------------------------- |
| North Star decline | > 10% drop week-over-week     | High     | CEO + CPO | Emergency review within 24 hours   |
| Activation drop    | Onboarding completion < 50%   | High     | CPO + CXO | UX review within 48 hours          |
| Churn spike        | Monthly churn > 10%           | Critical | CEO + CPO | Pivot/Persevere analysis triggered |
| MTTR breach        | Incident unresolved > 4 hours | Critical | CDO       | Escalation to full team            |
| Deployment failure | Change failure rate > 20%     | High     | CDO       | Engineering retrospective          |

---

## 8. Actionable vs. Vanity Metrics

Guard against vanity metrics that look good but do not inform decisions.

| Vanity Metric (Avoid)  | Actionable Alternative (Use)             |
| ---------------------- | ---------------------------------------- |
| Total registered users | Daily/Monthly Active Users (DAU/MAU)     |
| Total downloads        | Activation rate (completed onboarding)   |
| Page views / hits      | Session duration + actions per session   |
| Cumulative revenue     | Revenue per customer (ARPU) / MRR growth |
| Feature count shipped  | Feature adoption rate                    |
| Lines of code written  | Conversion rates per funnel step         |

---

## 9. Measurement Cadence

| Cadence       | Activity                | Metrics Reviewed                                     | Responsible      |
| ------------- | ----------------------- | ---------------------------------------------------- | ---------------- |
| **Daily**     | Morning dashboard check | North Star trend, AARRR funnel, system health        | CDO              |
| **Daily**     | Standup metric mention  | OMTM progress, blockers to metric movement           | All              |
| **Weekly**    | Weekly status report    | North Star, OMTM, AARRR summary, DORA                | CPO + CDO        |
| **Bi-weekly** | Program governance      | OMTM progress, phase exit criteria                   | CPO + CDO        |
| **Monthly**   | Strategic governance    | Portfolio metrics, North Star, cross-product health  | CEO + Leadership |
| **Quarterly** | Full-funnel analysis    | AARRR across all cohorts, NPS, Five Pillars maturity | Full team        |

---

## 10. Metrics Setup Checklist

Complete before DELIVER phase launch:

### Tier 1: Strategic

- [ ] North Star Metric defined and validated (Section 2)
- [ ] North Star passes all 5 validation criteria
- [ ] Baseline value established
- [ ] Year 1 target set

### Tier 2: Program

- [ ] OMTM selected for current phase (Section 3)
- [ ] OMTM target and timeline defined
- [ ] OMTM review cadence established (bi-weekly)

### Tier 3: Application

- [ ] All 5 AARRR stages configured with specific metrics (Section 4)
- [ ] AARRR events defined and instrumented (Section 4.3)
- [ ] Funnel dashboard built and tested

### Engineering Health

- [ ] All 4 DORA metrics instrumented (Section 5)
- [ ] Data sources connected to dashboard
- [ ] Year 1 targets set per DORA metric

### Growth Engine

- [ ] Engine selected with rationale (Section 6)
- [ ] Engine-specific metrics configured

### Dashboard and Alerts

- [ ] Dashboard configured with all sections (Section 7)
- [ ] Alerts configured for critical thresholds
- [ ] Dashboard accessible to all team members

### Cadence

- [ ] Measurement cadence documented and agreed (Section 9)
- [ ] Recurring calendar events created for all review meetings

---

## References

- G2 Metrics and Validation Guide: [../.ax/governance/G2_METRICS_AND_VALIDATION_GUIDE.md](../.ax/governance/G2_METRICS_AND_VALIDATION_GUIDE.md)
- Gate Reviews: [gate-reviews.md](gate-reviews.md)
- Five Pillars Assessment: [five-pillars-assessment.md](five-pillars-assessment.md)
- Weekly Status: [../07_MANAGE/WEEKLY-STATUS.md](../07_MANAGE/WEEKLY-STATUS.md)
