# Gate Review Tracker

> **Version**: 1.0.0
> **Product**: IRIS
>
> Track gate review outcomes for all 4 phase transitions.

---

## Gate Review History

### Gate 1: DISCOVER → DESIGN

> **Core Question**: "Is this a problem worth solving?"

- **Date**: \_\_\_
- **Score**: \_\_\_/100 (threshold: ≥70%)
- **Decision**: ⬜ GO | ⬜ CONDITIONAL | ⬜ NO-GO | ⬜ PAUSE
- **Conditions (if any)**: \_\_\_
- **Attendees**: \_\_\_
- **Key Evidence**:
  - Problem validated by real users (6+ interviews): \_\_\_
  - Pain severity (avg ≥ 7/10): \_\_\_
  - Market opportunity (TAM/SAM/SOM): \_\_\_
  - Target persona agreed: \_\_\_
  - Early adopters identified (3+): \_\_\_
  - Critical assumptions addressed (top 5): \_\_\_
- **Notes**: \_\_\_

---

### Gate 2: DESIGN → DEVELOP

> **Core Question**: "Is our solution the right approach?"

- **Date**: \_\_\_
- **Score**: \_\_\_/100 (threshold: ≥70%)
- **Decision**: ⬜ GO | ⬜ CONDITIONAL | ⬜ NO-GO | ⬜ PAUSE
- **Conditions (if any)**: \_\_\_
- **Attendees**: \_\_\_
- **Key Evidence**:
  - Solution validated with users (4+ tested prototype): \_\_\_
  - Usability meets baseline (SUS ≥ 68): \_\_\_
  - Critical usability issues resolved (no severity-1 open): \_\_\_
  - Architecture approved (tech lead review): \_\_\_
  - Backlog ready (2+ sprints of "ready" stories): \_\_\_
  - Resources allocated (team, tools, infrastructure): \_\_\_
- **Notes**: \_\_\_

---

### Gate 3: DEVELOP → DELIVER

> **Core Question**: "Is the product ready for real users?"

- **Date**: \_\_\_
- **Score**: \_\_\_/100 (threshold: ≥75%)
- **Decision**: ⬜ GO | ⬜ CONDITIONAL | ⬜ NO-GO | ⬜ PAUSE
- **Conditions (if any)**: \_\_\_
- **Attendees**: \_\_\_
- **Key Evidence**:
  - Features meet acceptance criteria (all MVP stories pass): \_\_\_
  - Test coverage adequate (≥ 80%): \_\_\_
  - Performance benchmarks met: \_\_\_
  - Security review passed (no critical/high vulnerabilities): \_\_\_
  - Pilot customers identified (2+ confirmed): \_\_\_
  - Deployment plan ready (infrastructure, rollback, monitoring): \_\_\_
- **Notes**: \_\_\_

---

### Gate 4: DELIVER → ITERATE

> **Core Question**: "Did we create measurable value?"

- **Date**: \_\_\_
- **Score**: \_\_\_/100 (threshold: ≥70%)
- **Decision**: ⬜ GO | ⬜ CONDITIONAL | ⬜ NO-GO | ⬜ PAUSE
- **Conditions (if any)**: \_\_\_
- **Attendees**: \_\_\_
- **Key Evidence**:
  - Pilot deployed and stable (uptime ≥ 99%): \_\_\_
  - Users actively using system (≥ 60% active weekly): \_\_\_
  - Success metrics collected (Tier 2 baselines + actuals): \_\_\_
  - User feedback synthesized (≥ 80% of pilot users): \_\_\_
  - Value documented (quantified improvement): \_\_\_
  - Next cycle plan drafted (hypothesis defined): \_\_\_
- **Notes**: \_\_\_

---

## Scoring Reference

Each gate has 6 weighted criteria. Score each criterion 1-10:

| Score | Label       | Meaning                                                         |
| ----- | ----------- | --------------------------------------------------------------- |
| 8-10  | **Pass**    | Evidence clearly meets or exceeds the threshold                 |
| 5-7   | **Partial** | Evidence exists but does not fully meet the threshold           |
| 1-4   | **Fail**    | Evidence is missing, insufficient, or contradicts the threshold |

**Weighted score** = sum of (criterion score x criterion weight).

### Decision Rules

| Decision           | Criteria                                            |
| ------------------ | --------------------------------------------------- |
| **GO**             | Weighted score ≥ threshold, no Fail scores          |
| **CONDITIONAL GO** | Score ≥ threshold minus 10%, max 2 Partial, no Fail |
| **NO-GO**          | Score below conditional threshold or any Fail       |
| **PAUSE**          | Insufficient evidence to assess confidently         |

---

## Condition Tracking

Track any conditions attached to CONDITIONAL GO decisions:

| Gate | Condition | Owner | Deadline | Status                |
| ---- | --------- | ----- | -------- | --------------------- |
|      |           |       |          | ⬜ Open / ✅ Resolved |

---

## References

- Gate criteria details: [G1 Phase Gate Governance Guide](../.ax/governance/G1_PHASE_GATE_GOVERNANCE_GUIDE.md)
- Scoring methodology: [G2 Metrics and Validation Guide](../.ax/governance/G2_METRICS_AND_VALIDATION_GUIDE.md)
- Gate preparation workflow: `/gate-review` skill
