# IRIS — Intelligent Resources Information System

> **Customer**: Samsung Electronics — Device Solution Research (DSR)
>
> **Framework**: AX v2.0.0 | **Pillar**: PLAN | **Team**: Amoza Production (SWAT, 6 members)
>
> _"AI for Real Life. Real Impact."_

---

## What Is IRIS?

IRIS is an enterprise resource planning and simulation platform built for Samsung Electronics' Device Solution Research division. It replaces and extends the legacy P/M (Personal Monthly) Planner to provide:

- **Standard P/M Management** — Revision-controlled effort data with concurrent editing, conflict detection, and approval workflows
- **Resource Roadmap & Simulation** — Gantt-based roadmaps with what-if scenarios and multi-dimensional analysis
- **Multi-System Integration** — Bidirectional sync with N-PLM, SMDM, GHRP, and PROMIS
- **HR Portfolio & World Map** — Global Samsung site visualization with resource utilization metrics
- **AI-Powered Intelligence** — Demand forecasting, constraint scheduling, and automated reporting

### Technology Stack

| Layer                | Technology               |
| -------------------- | ------------------------ |
| Application Platform | Mendix 10                |
| Primary Database     | Oracle 19c               |
| Analytics Engine     | Elasticsearch 8.x        |
| Visualization        | xDHTML Gantt, ECharts.js |
| Infrastructure       | HA cluster (QA + Prod)   |

---

## Project Structure

```
.ax/              Framework library (111 reference docs — read-only)
.claude/          AI config (skills, memory, settings)
.command/         Command execution history and audit trail
00_INTRO/         Project setup — IRIS product brief and team formation
01_DISCOVER/      Problem validation — Samsung stakeholder research
02_DESIGN/        Solution design — prototyping and usability testing
03_DEVELOP/       Build and test — Mendix development sprints
04_DELIVER/       Deployment — Samsung QA/Prod server rollout
05_ITERATE/       Retrospective and optimization
06_GOVERNANCE/    Gate reviews and metrics
07_MANAGE/        Progress tracking, issues, reports
CLAUDE.md         Master AI instructions
INDEX.md          Full project map
```

---

## AX Framework

IRIS follows the **AX Transformation Framework v2.0.0** — a five-phase, evidence-gated lifecycle.

### Five Phases

| Phase        | Key Question                            | Status      |
| ------------ | --------------------------------------- | ----------- |
| **DISCOVER** | Is this problem real and worth solving? | In Progress |
| **DESIGN**   | Does our solution actually solve it?    | In Progress |
| **DEVELOP**  | Can we build it fast and well?          | Not Started |
| **DELIVER**  | Does it create measurable value?        | Not Started |
| **ITERATE**  | Should we pivot, persevere, or scale?   | Not Started |

### Four Lenses

| Lens           | Core Question                                |
| -------------- | -------------------------------------------- |
| **Empathy**    | What does the Samsung planner actually need? |
| **Validation** | What evidence supports this decision?        |
| **Speed**      | What is the fastest path to learning?        |
| **Governance** | Are we on track and spending wisely?         |

---

## Feature Areas

| #   | Feature                    | Description                                                   |
| --- | -------------------------- | ------------------------------------------------------------- |
| F1  | Standard P/M Management    | CRUD, revision history, concurrent editing, approval          |
| F2  | Project/Product Management | N-PLM sync, version history, delta sync to PROMIS             |
| F3  | Resource Roadmap           | Gantt-based planning, versioning, multi-planner collaboration |
| F4  | Resource Simulation        | What-if scenarios, capacity analysis, profit optimization     |
| F5  | HR Portfolio & World Map   | Global site view, headcount planning, staffing analysis       |
| F6  | Analysis & Reporting       | Actual vs Plan gap, dashboards, auto-email reports            |
| F7  | AI-Powered Intelligence    | Demand forecasting, AI reporting via Samsung AI Services      |

---

## AI Skills (18 Commands)

| Phase           | Commands                                                                             |
| --------------- | ------------------------------------------------------------------------------------ |
| **DISCOVER**    | `/discover-research` `/discover-synthesize` `/discover-validate` `/discover-compete` |
| **DESIGN**      | `/design-hmw` `/design-sprint` `/design-usability` `/design-stories`                 |
| **DEVELOP**     | `/develop-sprint` `/develop-review` `/develop-adr` `/develop-data-model`             |
| **DELIVER**     | `/deliver-deploy` `/deliver-onboard`                                                 |
| **ITERATE**     | `/iterate-retro` `/iterate-pivot`                                                    |
| **Cross-Phase** | `/gate-review` `/weekly-status`                                                      |

---

## Getting Started

1. Read the product brief: [00_INTRO/README.md](00_INTRO/README.md)
2. Review the full project map: [INDEX.md](INDEX.md)
3. Explore the framework library: [.ax/00_INDEX.md](.ax/00_INDEX.md)
4. Start DISCOVER phase: [01_DISCOVER/README.md](01_DISCOVER/README.md)

---

_IRIS by Amoza — Intelligent Resources Information System_
_AX Kit v3.0.0 — Amoza Transformation Kit_
