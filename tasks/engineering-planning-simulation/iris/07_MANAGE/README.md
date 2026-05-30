# 07 MANAGE

> **Version**: 1.0.0
> Track progress, manage issues, and generate reports across the project lifecycle.
>
> **AX Principle**: Time-Box Everything

---

## Purpose

This folder contains the operational management artifacts for the project: progress tracking, issue management, decision logging, and weekly status reporting. These files provide a single source of truth for project health, enabling the team to stay aligned and stakeholders to stay informed.

---

## Cadence

| Ceremony                     | Frequency | Duration | Participants             | Purpose                                                      |
| ---------------------------- | --------- | -------- | ------------------------ | ------------------------------------------------------------ |
| **Daily Standup**            | Daily     | 15 min   | Dev team + CPO           | Blockers, progress, coordination                             |
| **Weekly Status**            | Weekly    | 30 min   | Full team                | OMTM update, completed/in-progress/blocked items             |
| **Sprint Review**            | Bi-weekly | 60 min   | Full team + stakeholders | Demo working software, collect feedback                      |
| **Sprint Retro**             | Bi-weekly | 45 min   | Dev team + CPO           | Continuous improvement, action items                         |
| **Monthly Strategic Review** | Monthly   | 90 min   | CEO + Leadership         | North Star trajectory, portfolio health, strategic decisions |

---

## Files in This Folder

| File                                 | Purpose                                                                             |
| ------------------------------------ | ----------------------------------------------------------------------------------- |
| [PROGRESS.md](PROGRESS.md)           | Master progress tracker — phase status, sprint tracking, key metrics, team roster   |
| [ISSUES.md](ISSUES.md)               | Issue tracker — open and resolved issues with priority, owner, and status           |
| [DECISIONS.md](DECISIONS.md)         | Decision log — architectural, product, strategy, process, gate, and pivot decisions |
| [WEEKLY-STATUS.md](WEEKLY-STATUS.md) | Weekly status report template — TL;DR, OMTM update, completed/in-progress/blockers  |

---

## Available Skills

| Skill            | Purpose                                                                               |
| ---------------- | ------------------------------------------------------------------------------------- |
| `/weekly-status` | Automated weekly status report generation — pulls metrics, summarizes sprint progress |

## Workflow

| Workflow          | Purpose                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Metrics Dashboard | Automated continuous reporting on product health, engineering performance, and business progress |

---

## How to Use

1. **PROGRESS.md** — Update phase status at each gate transition. Update sprint table at each sprint boundary. Keep metrics current weekly.
2. **ISSUES.md** — Log issues as they arise. Assign priority and owner immediately. Move to resolved when closed.
3. **DECISIONS.md** — Record every significant decision with rationale and alternatives considered. This is your audit trail.
4. **WEEKLY-STATUS.md** — Generate a new section each week (use `/weekly-status` skill or fill manually). Previous weeks accumulate as a running log.

---

## Links

- Governance: [../06_GOVERNANCE/](../06_GOVERNANCE/) — gate reviews, Five Pillars assessment, metrics setup
- Phase folders: [../01_DISCOVER/](../01_DISCOVER/) through [../05_ITERATE/](../05_ITERATE/) — phase-specific deliverables
- Framework reference: [../.ax/governance/](../.ax/governance/) — detailed governance guides
