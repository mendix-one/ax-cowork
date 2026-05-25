# Dynamic Schedule — Wireframe Sketches

> **Phase**: DESIGN — Prototype (low-fi)
> **Date**: 2026-05-25
> **Owner**: CXO (with CPO + AI assistance)
> **Status**: Draft v1 — for SWAT review and planner validation
> **Anchors**: [T14 Concept — Dynamic Schedule](../../ideation/T14-concept-dynamic-schedule.md) · [Wafer/NAND research](../../../08_RESEARCH/wafer-nand-manufacturing-for-mps.md) · [note.txt](note.txt) · [dynamic-schedule-01.png](dynamic-schedule-01.png)

---

## What's in this folder

| File                                               | Purpose                                                                                                                                                                    |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [README.md](README.md)                             | (this file) Shell layout, design tokens, navigation map, icon legend                                                                                                       |
| [01-main-views.md](01-main-views.md)               | Wireframes for the **7 main views** (Gantt / Analysis / Production Order / Shop Floor Capacity / Process Tuning / Capacity Tuning / Data Integration)                      |
| [02-right-panels.md](02-right-panels.md)           | Wireframes for the **5 right-panel modes** (Compare Split / AI Chatbox / Background Tasks / Change History / Recommendations)                                              |
| [03-screen-flow.md](03-screen-flow.md)             | Mermaid screen-flow + state diagrams: navigation graph, Monday-morning flow, yield-excursion replan, hot-lot insertion, tuning workflow, plan-version state, event routing |
| [dynamic-schedule-01.png](dynamic-schedule-01.png) | Reference mockup — Gantt + AI Assistant shell                                                                                                                              |
| [note.txt](note.txt)                               | Source brief from the planner-facing UI concept session                                                                                                                    |

---

## Shell layout

Three regions: **Top Bar** · **Left Rail** (view selector) · **Workspace** (Main + optional Right Panel).

```
+--------------------------------------------------------------------------------------------------------+
|  TOP BAR                                                                                                |
|  [≡] [▦] M-SOC ▾ | Plan A (Simulation) ▾                  [⊟] [🔔] [👤] [⚙]              |
+----+---------------------------------------------------------------------------+----+------------------+
| L  |   MAIN VIEW (left workspace)                                              | R  |  RIGHT PANEL    |
| E  |                                                                           | I  |  (optional)     |
| F  |   ┌─ View tabs / header ────────────────────────────┐                     | G  |                 |
| T  |   │  Plan A (Simulation)  | left  | Apr 2026  …  ▾ │                     | H  |                 |
|    |   ├──────────────────────────────────────────────────┤                     | T  |  (Compare /      |
| R  |   │                                                  │                     |    |   AI Chat /     |
| A  |   │   (Gantt / Analysis / etc.)                      │                     | R  |   Bg Tasks /    |
| I  |   │                                                  │                     | A  |   History /     |
| L  |   │                                                  │                     | I  |   Recs)         |
|    |   │                                                  │                     | L  |                 |
|    |   └──────────────────────────────────────────────────┘                     |    |                 |
+----+---------------------------------------------------------------------------+----+------------------+
```

Hide the Right Panel by toggling its rail; the Workspace expands. Same for the Left Rail (collapses to icons only, as in the reference PNG).

### Top Bar

| Region    | Component                                | Purpose                                                       |
| --------- | ---------------------------------------- | ------------------------------------------------------------- |
| Top-left  | App menu `[≡]`                           | Open app menu (modules, settings, account)                    |
| Top-left  | Apps grid `[▦]`                          | Cross-module switcher (aPlanner ↔ other Amoza products)       |
| Top-left  | Shop floor selector `M-SOC ▾`            | Switch shop floor / fab (single-fab MVP; multi-fab later)     |
| Top-left  | Schedule version `Plan A (Simulation) ▾` | Pick a plan: _Published_, _Plan A/B/C (Simulation)_, branches |
| Top-right | Layout toggles `[⊟]`                     | Toggle left rail / right panel / fullscreen                   |
| Top-right | Notifications `[🔔]`                     | System events, replan alerts, commitment-risk pings           |
| Top-right | User `[👤]`                              | Profile, sign-out                                             |
| Top-right | Settings `[⚙]`                           | Preferences (zones, weights, integrations)                    |

### Left Rail — Main view selector (icon column)

Vertical strip with one icon per view. Active view is highlighted. Hover/click expands a tooltip with the label.

```
┌────┐
│ 📊 │  Gantt (Simulation)         <— default view
│ 📈 │  Analysis View
│ 📦 │  Production Order
│ 🏭 │  Shop Floor Capacity
│ 🔧 │  Process Tuning Logic
│ ⚙️ │  Capacity Tuning Logic
│ 🔌 │  Data Integration
│ …  │  Extensible (future modules)
└────┘
```

> **Icons in the reference PNG** are abstract glyphs (calendar, chart, list, factory, sliders, plug). The emoji set above is a placeholder for the wireframe stage; pick final glyphs in the Figma pass. Same applies to the Right Rail.

### Right Rail — Right panel mode selector (icon column)

```
┌────┐
│ ⇄  │  Split / Compare schedule (right view)
│ 🤖 │  AI Chatbox / Assistant      <— default when right panel opens
│ ⏳ │  Background Tasks
│ 🕘 │  Schedule Change History
│ 💡 │  Recommendations
└────┘
```

Only one Right Panel mode active at a time. Right panel collapses when no icon is selected.

---

## Navigation map

```
                           [Top Bar — global]
                                    │
                ┌───────────────────┼───────────────────┐
                │                                       │
        ─── LEFT RAIL (main views) ──        ── RIGHT RAIL (panel modes) ──
                │                                       │
                ▼                                       ▼
  ┌─────────────────────────────────┐     ┌─────────────────────────────────┐
  │ 1. Gantt (Simulation)           │     │ A. Split / Compare (right view) │
  │ 2. Analysis View                │     │ B. AI Chatbox                   │
  │ 3. Production Order             │ ◀── │ C. Background Tasks             │
  │ 4. Shop Floor Capacity          │     │ D. Schedule Change History      │
  │ 5. Process Tuning Logic         │     │ E. Recommendations              │
  │ 6. Capacity Tuning Logic        │     └─────────────────────────────────┘
  │ 7. Data Integration             │
  └─────────────────────────────────┘

Right panel state is INDEPENDENT of main view — Sarah can have Gantt + AI Chat,
or Analysis + Recommendations, etc. Compare/Split is the only mode that takes
over the full workspace (it splits the main view into Left Plan vs Right Plan).
```

---

## Design tokens (placeholder — align with [`design-system-tokens.md`](../design-system-tokens.md))

| Token                 | Value                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------- |
| Primary               | `#1976D2` (aPlanner blue — same as hi-fi spec)                                         |
| Surface / canvas      | `#FAFAFA`                                                                              |
| Border                | `#E0E0E0`                                                                              |
| Text / primary        | `#1F1F1F`                                                                              |
| Text / secondary      | `#5F6368`                                                                              |
| Gantt bar fill        | `#1976D2` (on-track) · `#F9A825` (at-risk) · `#D32F2F` (slipped) · `#7E57C2` (hot lot) |
| Workload band         | `#43A047` (safe ≤70%) · `#FBC02D` (warning 70–85%) · `#D32F2F` (overload >85%)         |
| Font / UI             | Inter                                                                                  |
| Font / data           | JetBrains Mono                                                                         |
| Grid base             | 8 px                                                                                   |
| Top bar height        | 48 px                                                                                  |
| Left/right rail width | 48 px (collapsed) · 240 px (expanded)                                                  |
| Right panel width     | 360 px default · resizable                                                             |
| Max canvas width      | 1440 px (responsive down to 1024 px)                                                   |

---

## Wireframe conventions

- ASCII boxes are layout-faithful (proportions ≈ real). Final pixel sizing happens in Figma.
- `▾` = dropdown · `[ ]` = button · `[ ▮ ]` = toggle · `…` = overflow / truncate · `▮▮▮▯▯` = progress / capacity band
- `<placeholder>` = dynamic content the AI or data layer fills in
- "Sarah" appears throughout — Senior Production Planner persona from [T07](../../../01_DISCOVER/synthesis/T07-personas.md)

---

## What each wireframe answers

For every screen, the file documents:

1. **Purpose** — one sentence on what Sarah uses it for
2. **Layout** — ASCII wireframe matching the shell
3. **Components** — table of regions / interactions
4. **AI / data dependencies** — what the back end has to provide
5. **Open questions** — design decisions still to validate

---

_Next step: SWAT review of structure, then commission Figma hi-fi pass and moderated planner walkthrough._
