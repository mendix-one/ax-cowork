# AxGantt widget

Mendix pluggable widget that renders the Simulation Gantt panel and accepts tasks/links/config as JSON input.

## Properties

- `tasksJson` (string): JSON array of gantt tasks
- `linksJson` (string): JSON array of gantt links
- `configJson` (string): optional JSON object for gantt config overrides
- `height` (string): optional CSS height (defaults to `100%`)

## Scripts

- `pnpm --dir widgets/ax-simulation-gantt run dev`
- `pnpm --dir widgets/ax-simulation-gantt run build`
- `pnpm --dir widgets/ax-simulation-gantt run type-check`
