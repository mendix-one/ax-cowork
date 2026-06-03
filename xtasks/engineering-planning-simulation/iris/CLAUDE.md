# CLAUDE.md — AX Kit

> Master instruction file for Claude Code in any Amoza product project using the AX Transformation Framework v2.0.0.

## Project Overview

This is an **IRIS** project under the **Amoza Transformation Framework (AX) v2.0.0**.

| Field                 | Value                                                             |
| --------------------- | ----------------------------------------------------------------- |
| **Company**           | Amoza — "AI for Real Life. Real Impact."                          |
| **Framework**         | AX (Amoza Transformation) v2.0.0 — "Transform. Deliver. Delight." |
| **Product Ecosystem** | 36 products across 7 pillars                                      |
| **Seven Pillars**     | PLAN, MAKE, MOVE, SELL, CARE, SEE, THINK                          |
| **Current Product**   | IRIS (PLAN pillar)                                                |
| **Stage**             | Check `.claude/memory/project_context.md` for current AX phase    |

AX is a working system — not an academic exercise. It answers three questions every day:

1. **Where are we?** Which phase, which gate, which lens dominates now.
2. **What evidence do we need?** What must be true before we move forward.
3. **Who does what?** Which role owns which activity right now.

## Project Structure

```
.ax/              Framework library (111 docs) — READ-ONLY reference
.claude/          AI config (skills, memory, settings)
.command/         Command execution history — trace all commands here
00_INTRO/         Project setup and onboarding
01_DISCOVER/      Problem validation working files
02_DESIGN/        Solution design working files
03_DEVELOP/       Build and test working files
04_DELIVER/       Deployment and onboarding working files
05_ITERATE/       Retrospective and pivot working files
06_GOVERNANCE/    Gate reviews and metrics
07_MANAGE/        Progress tracking, issues, reports
```

### Working Files vs Reference Files

- **`.ax/`** is the read-only reference library. It contains the full AX Framework v2.0.0 (111 documents): guides, templates, samples, handbooks, and quick-reference cards. Always reference these documents rather than recreating content. Use `.ax/templates/` as starting points for all artifacts.
- **Phase folders (`00_INTRO/` through `07_MANAGE/`)** are the working space. This is where project-specific artifacts, decisions, and deliverables go. Create and edit files here.
- **`.claude/`** contains AI configuration. Skills define slash commands, memory provides persistent context, settings control permissions.
- **`.command/`** is the command execution log. Every command executed with Claude is traced here. See "Command Tracing" section below.

## AX Framework Summary

AX synthesizes four proven methodologies (Design Thinking, Lean Startup, RAD, Digital Execution) into a five-phase, evidence-gated lifecycle.

### The Five Phases

| Phase        | Key Question                                   | Dominant Lenses        | Duration   |
| ------------ | ---------------------------------------------- | ---------------------- | ---------- |
| **DISCOVER** | Are we solving a real problem worth solving?   | Empathy, Validation    | 3-6 weeks  |
| **DESIGN**   | Does our proposed solution actually solve it?  | Empathy, Speed         | 3-5 weeks  |
| **DEVELOP**  | Can we build it fast and well?                 | Speed, Governance      | 4-8 weeks  |
| **DELIVER**  | Does it create measurable value in production? | Governance, Validation | 3-4 weeks  |
| **ITERATE**  | Should we pivot, persevere, or scale?          | Validation, Empathy    | Continuous |

### Phase Gates

Four evidence-based gates govern phase transitions. Every gate results in GO / CONDITIONAL / NO-GO / PAUSE.

| Gate       | Transition         | Key Evidence Required                                        |
| ---------- | ------------------ | ------------------------------------------------------------ |
| **Gate 1** | DISCOVER -> DESIGN | 5+ interviews, validated personas, Lean Canvas draft         |
| **Gate 2** | DESIGN -> DEVELOP  | SUS >= 68, MVP scope locked, user stories ready              |
| **Gate 3** | DEVELOP -> DELIVER | 80%+ test coverage, security passed, MVP complete            |
| **Gate 4** | DELIVER -> ITERATE | 3+ early adopters, NPS >= 30, Innovation Accounting baseline |

No gate-skipping. Catching a flawed assumption at Gate 1 saves weeks of wasted development.

## Four Lenses

Every significant decision is examined through all four lenses. The weight shifts by phase but none is ever absent.

| Lens           | Source            | Core Question                                         |
| -------------- | ----------------- | ----------------------------------------------------- |
| **Empathy**    | Design Thinking   | "What does the user actually need?"                   |
| **Validation** | Lean Startup      | "What evidence supports this decision?"               |
| **Speed**      | RAD               | "What is the fastest path to learning?"               |
| **Governance** | Digital Execution | "Are we on track, within scope, and spending wisely?" |

### Lens Dominance by Phase

| Phase    | Empathy | Validation | Speed  | Governance |
| -------- | ------- | ---------- | ------ | ---------- |
| DISCOVER | High    | High       | Medium | Low        |
| DESIGN   | High    | Medium     | High   | Medium     |
| DEVELOP  | Medium  | Medium     | High   | High       |
| DELIVER  | Medium  | High       | Medium | High       |
| ITERATE  | High    | High       | Medium | Medium     |

## Five Pillars of Execution

These ensure AX is an organizational capability, not just a process.

| Pillar        | Focus                                                                    | Maturity Journey            |
| ------------- | ------------------------------------------------------------------------ | --------------------------- |
| **People**    | Cross-functional SWAT teams, executive buy-in, talent pool               | Start -> Structure -> Scale |
| **Portfolio** | Align products with strategy, continuous value assessment                | Start -> Structure -> Scale |
| **Process**   | BizDevOps, rapid iterative delivery, sprint execution                    | Start -> Structure -> Scale |
| **Platform**  | Scale with minimal tech debt, AI/GenAI integration, shared design system | Start -> Structure -> Scale |
| **Promotion** | Share success, celebrate wins, build community, drive adoption           | Start -> Structure -> Scale |

## 12 AX Principles

These principles are non-negotiable. Apply them in every decision.

| #   | Principle                         | Summary                                                                              |
| --- | --------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | **User Truth Over Opinion**       | Decisions backed by user evidence, not stakeholder assumptions                       |
| 2   | **Validated Learning**            | Every feature starts as a hypothesis; ship the smallest thing that tests it          |
| 3   | **Prototype Before Perfect**      | A rough prototype tested with 5 users beats a polished product tested with zero      |
| 4   | **Time-Box Everything**           | If scope exceeds the timebox, reduce scope — never extend time                       |
| 5   | **Continuous User Involvement**   | Users participate across all phases, not consulted once and forgotten                |
| 6   | **Hypothesis-Driven Development** | Every backlog item traces to a hypothesis card with measurable success criteria      |
| 7   | **Parallel Workstreams**          | Frontend, backend, data, AI/ML advance simultaneously via shared contracts           |
| 8   | **AI as Team Member**             | AI tools are first-class team members; target 70%+ AI-assisted code in DEVELOP       |
| 9   | **Governance Enables Speed**      | Phase gates are quality accelerators, not bureaucratic obstacles                     |
| 10  | **Value Over Features**           | Ship fewer features that deliver measurable value                                    |
| 11  | **Fail Fast, Learn Faster**       | Rapid experiments test assumptions; small batches reduce risk                        |
| 12  | **Promote Success**               | Celebrate wins, share learnings, build community; without promotion, adoption stalls |

## Team Structure

AX uses the **SWAT Team** model (Skilled With Advanced Tools) — small, highly productive teams of 6 people.

### Core Roles

| Role    | Primary Responsibility                                           |
| ------- | ---------------------------------------------------------------- |
| **CEO** | Strategic direction, gate decisions, Lean Canvas ownership       |
| **CPO** | Product ownership, research, backlog, hypothesis management      |
| **CXO** | User experience, empathy mapping, usability testing, design      |
| **CAO** | AI strategy, AI-powered analysis, model evaluation               |
| **CDO** | Technical architecture, feasibility, data modeling, code quality |
| **COO** | Operations, scheduling, logistics, process efficiency            |

### Role Engagement by Phase

| Role | DISCOVER | DESIGN | DEVELOP | DELIVER | ITERATE |
| ---- | -------- | ------ | ------- | ------- | ------- |
| CEO  | Medium   | Low    | Low     | Medium  | High    |
| CPO  | High     | High   | Medium  | Medium  | High    |
| CXO  | High     | High   | Low     | Medium  | Medium  |
| CAO  | Medium   | Medium | High    | Medium  | Medium  |
| CDO  | Low      | Medium | High    | High    | Medium  |
| COO  | Low      | Low    | Medium  | High    | Medium  |

## AI Collaboration Standards

AI is a force multiplier (Principle 8). Every process in AX is designed for human-AI collaboration.

### The 70% Target

Amoza targets **70%+ AI-assisted code** in DEVELOP. AI generates initial drafts; humans review, refine, and architect. Same quality bar for all code regardless of author.

### AI Quality Standards

- **Code**: Must pass automated tests, linting, and code review
- **Documents**: Must be reviewed by the responsible role owner
- **Analysis**: Must be validated against source data by CDO
- **Designs**: Must be reviewed by CXO for brand and usability

### Collaboration Levels by Phase

| Phase        | AI Role                                                               | Collaboration Level |
| ------------ | --------------------------------------------------------------------- | ------------------- |
| **DISCOVER** | Research Analyst — transcription, theme extraction, competitive scan  | AI Analyzes         |
| **DESIGN**   | Design Partner — ideation variations, content drafting, story writing | AI Assists          |
| **DEVELOP**  | Code Partner — generation, testing, review, debugging, docs           | AI Leads            |
| **DELIVER**  | Operations Analyst — anomaly detection, feedback analysis, reporting  | AI Analyzes         |
| **ITERATE**  | Learning Partner — cohort analysis, retro prep, backlog re-ranking    | AI Assists          |

### Parallel Workstreams (DEVELOP)

Four workstreams execute simultaneously, synchronized through API contracts and daily standups:

- **Frontend** — UI components, design system integration
- **Backend** — APIs, business logic, services
- **Data** — Pipeline, storage, analytics
- **AI/ML** — Models, inference, training

## Key Metrics Frameworks

### North Star Metric

Stable, company-wide metric reflecting core value delivery. Does not change frequently.

### OMTM (One Metric That Matters)

Tactical, short-term metric. Changes every 2-6 months based on current focus.

### AARRR Pirate Metrics

| Stage           | What It Measures                                     |
| --------------- | ---------------------------------------------------- |
| **Acquisition** | How users find us (signups, visits)                  |
| **Activation**  | First value moment (core workflow completed)         |
| **Retention**   | Users keep coming back (weekly/monthly active usage) |
| **Referral**    | Users recommend us (NPS, word-of-mouth)              |
| **Revenue**     | Users pay us (conversion, LTV, willingness to pay)   |

### DORA Metrics (DEVELOP + DELIVER)

| Metric                       | Target            |
| ---------------------------- | ----------------- |
| Deployment Frequency         | Multiple per week |
| Lead Time for Changes        | < 1 day           |
| Mean Time to Recovery (MTTR) | < 1 hour          |
| Change Failure Rate          | < 15%             |

### Three Engines of Growth

Focus on one at a time:

- **Sticky** — Retention-driven; reduce churn rate
- **Viral** — Sharing-driven; viral coefficient > 1
- **Paid** — Revenue-driven; LTV > CPA

## Conventions

- Write in clear, concise English aligned with Amoza Brand Voice ("AI for Real Life. Real Impact.")
- Use Markdown for all documentation files
- Keep file and folder names lowercase with hyphens (kebab-case)
- Reference AX phases by name: DISCOVER, DESIGN, DEVELOP, DELIVER, ITERATE
- Use role titles (CEO, CPO, etc.) alongside names for clarity
- Product naming: "IRIS" (internal), "IRIS by Amoza" (external)
- Hypothesis format: "We believe [feature] will increase [metric] by [amount] within [timeframe]"
- Problem statement format: "[Persona] needs a way to [need] because [insight]"

## Available Skills

Invoke these slash commands for AX workflow automation. Skills are defined in `.claude/skills/`.

### DISCOVER Phase

| Command                | What It Does                                                                   |
| ---------------------- | ------------------------------------------------------------------------------ |
| `/discover-research`   | Creates research plan, applies Five-Act Interview Method                       |
| `/discover-synthesize` | Processes interview notes into empathy maps, affinity clusters, persona drafts |
| `/discover-validate`   | Scores problem statements, risk-ranks assumptions                              |
| `/discover-compete`    | Generates competitive landscape analysis                                       |

### DESIGN Phase

| Command             | What It Does                                                          |
| ------------------- | --------------------------------------------------------------------- |
| `/design-hmw`       | Facilitates How-Might-We reframing, generates concept sketches        |
| `/design-sprint`    | Runs compressed Google Design Sprint (4-5 day) workflow               |
| `/design-usability` | Analyzes usability test results, calculates SUS scores (target >= 68) |
| `/design-stories`   | Generates user stories with acceptance criteria                       |

### DEVELOP Phase

| Command               | What It Does                                                         |
| --------------------- | -------------------------------------------------------------------- |
| `/develop-sprint`     | Creates sprint plan with parallel workstreams and Kanban WIP limits  |
| `/develop-review`     | AI-assisted code review against quality checklist                    |
| `/develop-adr`        | Generates Architecture Decision Records                              |
| `/develop-data-model` | Guides RAD 3-level data modeling (conceptual -> logical -> physical) |

### DELIVER Phase

| Command            | What It Does                                              |
| ------------------ | --------------------------------------------------------- |
| `/deliver-deploy`  | Generates deployment checklist and staging rehearsal plan |
| `/deliver-onboard` | Creates early adopter onboarding journey (Week 1-3+)      |

### ITERATE Phase

| Command          | What It Does                                                                |
| ---------------- | --------------------------------------------------------------------------- |
| `/iterate-retro` | Facilitates 4Ls retrospective + 5 Whys root cause analysis                  |
| `/iterate-pivot` | Runs Innovation Accounting, evaluates 10 Pivot Types, Feature Health Matrix |

### Cross-Phase

| Command          | What It Does                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `/gate-review`   | Compiles phase evidence, scores against gate criteria, prepares GO/CONDITIONAL/NO-GO recommendation |
| `/weekly-status` | Generates weekly status report with OMTM tracking, blockers, next actions                           |

## Framework Library

The `.ax/` directory contains the **full AX v2.0.0 library** (111 documents). See [.ax/00_INDEX.md](.ax/00_INDEX.md) for the complete index.

**Always reference framework documents rather than recreating content.** Use `.ax/templates/` as starting points for all artifacts.

## Command Tracing

**All commands executed with Claude MUST be traced in `.command/`.** This provides a full audit trail of what was requested, what was done, and what was produced.

### When a team member asks you to execute a command:

1. **Create a numbered folder** in `.command/` — use the next sequential number (e.g., `001_command_name/`)
2. **Create `index.md`** inside the folder with:
   - Command name and description
   - Status (⬜ Pending → 🔄 In Progress → ✅ Completed)
   - Date and who requested it
   - Which AX phase it relates to
   - The full request/instructions
   - Sub-tasks table tracking each step (status, owner, notes)
   - Output summary and links to produced files
3. **Create `input/` and `output/` subfolders** if the command has input files or produces output files
4. **Update `.command/INDEX.md`** — add a row to the Command History table
5. **Update sub-tasks** as you work — mark each sub-task done as you complete it
6. **Mark command completed** when all sub-tasks are done

### Command folder structure:

```
.command/
├── INDEX.md                    # Master command history
├── 000_init_project/           # Sample command (template)
│   └── index.md
├── 001_run_discovery/          # Example: real command
│   ├── index.md
│   ├── input/
│   └── output/
└── ...
```

### Rules:

- **Every significant action gets traced** — skill executions, research tasks, generation tasks, reviews
- **Sub-tasks are tracked granularly** — each discrete step is a row in the sub-tasks table
- **Never skip tracing** — even if the command is small, create the record
- **Update status in real-time** — mark sub-tasks as you complete them, not all at the end
- See `.command/000_init_project/index.md` for the template format

## Workflow

- Branch from `main` for changes
- Commit messages: concise and descriptive
- Guides should be practical and team-actionable, not theoretical
- Time-box everything — cut scope rather than extend time
- Every feature traces to a hypothesis card
- Gate reviews before phase transitions — no skipping
- Sprint demos weekly to the full team including non-engineering
- Retrospectives within 3 days of cycle completion
- 15-20% sprint capacity reserved for technical debt reduction
