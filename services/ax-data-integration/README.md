# ax-data-integration

AX Cowork Data Integration Service — pull-based sync jobs from files / databases / APIs into a MongoDB raw store, with a per-record audit changelog.

## Quick start

```bash
pnpm install
pnpm --filter ax-data-integration dev     # or: pnpm dev:di (from repo root)
```

Default port: `3012`. Swagger UI: <http://localhost:3012/api-docs>.

## Scripts

| Script                                         | Purpose                              |
| ---------------------------------------------- | ------------------------------------ |
| `pnpm --filter ax-data-integration dev`        | Start in watch mode                  |
| `pnpm --filter ax-data-integration build`      | Production build                     |
| `pnpm --filter ax-data-integration start:prod` | Run the built artifact (`dist/main`) |
| `pnpm --filter ax-data-integration lint`       | ESLint --fix                         |
| `pnpm --filter ax-data-integration test`       | Jest unit tests                      |
| `pnpm --filter ax-data-integration test:e2e`   | Jest e2e tests                       |

## Design documentation

- [O001 — Original requirements](./docs/O001-data-integration.md)
- [P001 — Requirement summary + technical decisions](./docs/P001-requirement-summary.md)
- [P002 — Detailed design proposal](./docs/P002-design-proposal.md)
- [T001 — WBS tracking](./docs/T001-wbs.md)
- [CLAUDE.md](./CLAUDE.md) — context for Claude Code when working in this scope

## Architecture summary

Single-node NestJS service with all state in MongoDB (no Redis, no queue). Scheduling via `@nestjs/schedule`; overlap protection via a partial unique index on `sync_runs`. See [P002](./docs/P002-design-proposal.md) for full detail.
