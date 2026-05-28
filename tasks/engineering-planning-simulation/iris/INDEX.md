# IRIS — Project Index

> The complete map of the IRIS (Intelligent Resources Information System) project. Find anything from here.

---

## Project Info

| Field                 | Value                                                       |
| --------------------- | ----------------------------------------------------------- |
| **Product**           | IRIS                                                        |
| **Pillar**            | PLAN                                                        |
| **Team Size**         | 6                                                           |
| **Current Phase**     | DISCOVER / DESIGN                                           |
| **North Star Metric** | Resource plans optimized per month across Samsung DSR sites |
| **OMTM**              | Planning cycle time (roadmap creation to confirmation)      |
| **Growth Engine**     | Sticky                                                      |
| **Next Gate**         | Gate 1 — TBD                                                |

---

## Phase Progress

| #   | Phase          | Folder                           | Status      | Key Question                |
| --- | -------------- | -------------------------------- | ----------- | --------------------------- |
| 0   | **INTRO**      | [00_INTRO/](00_INTRO/)           | Completed   | Project setup complete?     |
| 1   | **DISCOVER**   | [01_DISCOVER/](01_DISCOVER/)     | In Progress | Is this problem real?       |
| 2   | **DESIGN**     | [02_DESIGN/](02_DESIGN/)         | In Progress | Is this the right solution? |
| 3   | **DEVELOP**    | [03_DEVELOP/](03_DEVELOP/)       | Not Started | Can we build it?            |
| 4   | **DELIVER**    | [04_DELIVER/](04_DELIVER/)       | Not Started | Are users getting value?    |
| 5   | **ITERATE**    | [05_ITERATE/](05_ITERATE/)       | Not Started | What's next?                |
| 6   | **GOVERNANCE** | [06_GOVERNANCE/](06_GOVERNANCE/) | Ongoing     | Gates passing?              |
| 7   | **MANAGE**     | [07_MANAGE/](07_MANAGE/)         | Ongoing     | On track?                   |

---

## Document Map

### Root Files

| File                     | Purpose                                |
| ------------------------ | -------------------------------------- |
| [README.md](README.md)   | Project overview and quick start       |
| [INDEX.md](INDEX.md)     | This file — full project map           |
| [CLAUDE.md](CLAUDE.md)   | Master AI instructions for Claude Code |
| [claude.sh](claude.sh)   | One-time setup script                  |
| [.gitignore](.gitignore) | Git ignore rules                       |
| [LICENSE](LICENSE)       | Amoza proprietary license              |

### .claude/ — AI Configuration

| File                                                                     | Purpose                           |
| ------------------------------------------------------------------------ | --------------------------------- |
| [.claude/skills/](/.claude/skills/)                                      | 18 slash command definitions      |
| [.claude/memory/MEMORY.md](.claude/memory/MEMORY.md)                     | Memory index                      |
| [.claude/memory/project_context.md](.claude/memory/project_context.md)   | Product and phase context         |
| [.claude/memory/team_roles.md](.claude/memory/team_roles.md)             | Team members and RACI             |
| [.claude/memory/milestones.md](.claude/memory/milestones.md)             | Sprint and launch schedule        |
| [.claude/memory/decisions_log.md](.claude/memory/decisions_log.md)       | ADRs and strategy decisions       |
| [.claude/memory/metrics_baseline.md](.claude/memory/metrics_baseline.md) | North Star, OMTM, AARRR baselines |
| [.claude/settings.json](.claude/settings.json)                           | Permissions and hooks config      |

### 00_INTRO/ — Project Setup

| File                                     | Purpose                              |
| ---------------------------------------- | ------------------------------------ |
| [00_INTRO/README.md](00_INTRO/README.md) | Onboarding guide and setup checklist |

### 01_DISCOVER/ — Problem Validation

| File                                                                                         | Purpose                                     |
| -------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [01_DISCOVER/README.md](01_DISCOVER/README.md)                                               | Phase guide: research, interviews, personas |
| Skills: `/discover-research` `/discover-synthesize` `/discover-validate` `/discover-compete` |                                             |

### 02_DESIGN/ — Solution Design

| File                                                                         | Purpose                                     |
| ---------------------------------------------------------------------------- | ------------------------------------------- |
| [02_DESIGN/README.md](02_DESIGN/README.md)                                   | Phase guide: ideation, prototyping, stories |
| Skills: `/design-hmw` `/design-sprint` `/design-usability` `/design-stories` |                                             |

### 03_DEVELOP/ — Build and Test

| File                                                                             | Purpose                                  |
| -------------------------------------------------------------------------------- | ---------------------------------------- |
| [03_DEVELOP/README.md](03_DEVELOP/README.md)                                     | Phase guide: sprints, architecture, code |
| Skills: `/develop-sprint` `/develop-review` `/develop-adr` `/develop-data-model` |                                          |

### 04_DELIVER/ — Ship and Onboard

| File                                         | Purpose                                         |
| -------------------------------------------- | ----------------------------------------------- |
| [04_DELIVER/README.md](04_DELIVER/README.md) | Phase guide: deployment, onboarding, monitoring |
| Skills: `/deliver-deploy` `/deliver-onboard` |                                                 |

### 05_ITERATE/ — Learn and Adapt

| File                                         | Purpose                                                |
| -------------------------------------------- | ------------------------------------------------------ |
| [05_ITERATE/README.md](05_ITERATE/README.md) | Phase guide: retros, pivot analysis, re-prioritization |
| Skills: `/iterate-retro` `/iterate-pivot`    |                                                        |

### 06_GOVERNANCE/ — Gate Reviews and Metrics

| File                                               | Purpose                                     |
| -------------------------------------------------- | ------------------------------------------- |
| [06_GOVERNANCE/README.md](06_GOVERNANCE/README.md) | Governance guide: gates, metrics, readiness |
| Skills: `/gate-review`                             |                                             |

### 07_MANAGE/ — Progress Tracking

| File                                       | Purpose                                   |
| ------------------------------------------ | ----------------------------------------- |
| [07_MANAGE/README.md](07_MANAGE/README.md) | Management guide: status, issues, reports |
| Skills: `/weekly-status`                   |                                           |

### .ax/ — Framework Library (Read-Only Reference)

The `.ax/` directory contains the full AX Framework v2.0.0 library (111 documents). See **[.ax/00_INDEX.md](.ax/00_INDEX.md)** for the complete index.

| Directory              | Contents                                     | Count |
| ---------------------- | -------------------------------------------- | ----- |
| `.ax/` (root)          | Framework overviews and comprehensive guides | 3     |
| `.ax/parts/`           | Modular deep-dive sections                   | 5     |
| `.ax/handbooks/`       | Role-specific handbooks (HB01-HB06)          | 6     |
| `.ax/discover/`        | D1-D8 research and validation guides         | 8     |
| `.ax/design/`          | S1-S7 ideation and prototyping guides        | 7     |
| `.ax/develop/`         | V1-V7 sprint and architecture guides         | 7     |
| `.ax/deliver/`         | L1-L5 deployment and onboarding guides       | 5     |
| `.ax/iterate/`         | I1-I4 retrospective and pivot guides         | 4     |
| `.ax/governance/`      | G1-G3 gate and governance guides             | 3     |
| `.ax/analysis/`        | A1-A5 analysis and data modeling guides      | 5     |
| `.ax/quick-reference/` | QR01-QR11 cheat sheets                       | 11    |
| `.ax/templates/`       | T01-T30 artifact templates                   | 30    |
| `.ax/samples/`         | X01-X16 completed examples (IRIS + aPlanner) | 16    |
| `.ax/workflows/`       | AI-human collaboration patterns              | 10    |
| `.ax/starter/`         | New product launcher files                   | 6     |

---

## Quick Links

| I want to...               | Go to                                                 |
| -------------------------- | ----------------------------------------------------- |
| Set up a new project       | [00_INTRO/README.md](00_INTRO/README.md)              |
| Plan user research         | [01_DISCOVER/](01_DISCOVER/) + `/discover-research`   |
| Synthesize interview data  | [01_DISCOVER/](01_DISCOVER/) + `/discover-synthesize` |
| Validate a problem         | [01_DISCOVER/](01_DISCOVER/) + `/discover-validate`   |
| Analyze competitors        | [01_DISCOVER/](01_DISCOVER/) + `/discover-compete`    |
| Run How-Might-We ideation  | [02_DESIGN/](02_DESIGN/) + `/design-hmw`              |
| Run a design sprint        | [02_DESIGN/](02_DESIGN/) + `/design-sprint`           |
| Test usability             | [02_DESIGN/](02_DESIGN/) + `/design-usability`        |
| Write user stories         | [02_DESIGN/](02_DESIGN/) + `/design-stories`          |
| Plan a sprint              | [03_DEVELOP/](03_DEVELOP/) + `/develop-sprint`        |
| Review code                | [03_DEVELOP/](03_DEVELOP/) + `/develop-review`        |
| Write an ADR               | [03_DEVELOP/](03_DEVELOP/) + `/develop-adr`           |
| Model data                 | [03_DEVELOP/](03_DEVELOP/) + `/develop-data-model`    |
| Prepare deployment         | [04_DELIVER/](04_DELIVER/) + `/deliver-deploy`        |
| Onboard early adopters     | [04_DELIVER/](04_DELIVER/) + `/deliver-onboard`       |
| Run a retrospective        | [05_ITERATE/](05_ITERATE/) + `/iterate-retro`         |
| Decide pivot or persevere  | [05_ITERATE/](05_ITERATE/) + `/iterate-pivot`         |
| Prepare a gate review      | [06_GOVERNANCE/](06_GOVERNANCE/) + `/gate-review`     |
| Generate weekly status     | [07_MANAGE/](07_MANAGE/) + `/weekly-status`           |
| Find a framework reference | [.ax/00_INDEX.md](.ax/00_INDEX.md)                    |
| Find a template            | [.ax/templates/](.ax/templates/)                      |
| Find an example            | [.ax/samples/](.ax/samples/)                          |
| Read my role handbook      | [.ax/handbooks/](.ax/handbooks/)                      |

---

_AX Kit v3.0.0 — Amoza Transformation Kit_
