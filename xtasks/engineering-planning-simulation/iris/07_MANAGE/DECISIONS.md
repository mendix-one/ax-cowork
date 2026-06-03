# Decision Log — IRIS

> **Version**: 1.0.0
> Record all significant decisions with rationale, alternatives considered, and accountability.

---

## Decisions

| #   | Date | Decision | Type | Rationale | Alternatives | Decided By |
| --- | ---- | -------- | ---- | --------- | ------------ | ---------- |
|     |      |          |      |           |              |            |

### Decision Types

| Type         | Description                                                                | Typical Decision Maker |
| ------------ | -------------------------------------------------------------------------- | ---------------------- |
| **ARCH**     | Architecture and technology choices (frameworks, patterns, infrastructure) | CDO                    |
| **PRODUCT**  | Feature scope, user stories, MVP boundaries, backlog priorities            | CPO                    |
| **STRATEGY** | Market positioning, target persona, pricing, go-to-market                  | CEO + CPO              |
| **PROCESS**  | Workflow changes, ceremony adjustments, tool adoption                      | CPO + COO              |
| **GATE**     | Phase transition decisions (GO / CONDITIONAL / NO-GO / PAUSE)              | CEO + CPO              |
| **PIVOT**    | Direction changes based on validated learning (pivot, persevere, stop)     | CEO + CPO              |

---

## Gate Decisions

| Gate                      | Date | Score | Decision | Conditions |
| ------------------------- | ---- | ----- | -------- | ---------- |
| Gate 1: DISCOVER → DESIGN |      | /100  |          |            |
| Gate 2: DESIGN → DEVELOP  |      | /100  |          |            |
| Gate 3: DEVELOP → DELIVER |      | /100  |          |            |
| Gate 4: DELIVER → ITERATE |      | /100  |          |            |

---

## Decision Template

When adding a new decision, include:

```
| [#] | [YYYY-MM-DD] | [What was decided] | [Type] | [Why this option] | [What else was considered] | [Who made the call] |
```

**Best practices**:

- Record the decision **within 48 hours** of it being made
- Include alternatives that were explicitly rejected — future team members will want to know why
- Link to supporting evidence (research findings, metrics, prototypes) where available
- For gate decisions, reference the full gate review record in [../06_GOVERNANCE/gate-reviews.md](../06_GOVERNANCE/gate-reviews.md)

---

## References

- Gate reviews: [../06_GOVERNANCE/gate-reviews.md](../06_GOVERNANCE/gate-reviews.md)
- Progress: [PROGRESS.md](PROGRESS.md)
- Issues: [ISSUES.md](ISSUES.md)
