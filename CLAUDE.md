# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

pnpm workspace (`pnpm-workspace.yaml`) with three top-level package roots:

- `react-app/` — `@ax/react-app`, the web client (React 19 + Ant Design v6 + Vite). The bulk of the application code lives here. See `react-app/CLAUDE.md` for layer rules, routing, store, theming, i18n, and TS strictness details — read it before non-trivial edits inside `react-app/`.
- `shared/` — internal libraries consumed by the app via `workspace:*`:
  - `ax-common` (`@ax-cowork/shared`) — utilities, formatters, converters. Built with `tsc` (no bundler). Consumers import from `./utils`, `./formatters`, `./converters` subpaths.
  - `ax-control-table` (`@ax-cowork/control-table`) — virtualized data grid (TanStack Table + Virtual + AntD). Vite library build + `tsc --emitDeclarationOnly`. Has React/AntD as peer deps.
  - `ax-markdown` (`@ax-cowork/markdown`) — markdown renderer that embeds `ax-control-table` and ECharts blocks (the format the AI produces in snapshots). Vite lib build; peer-depends on `control-table`, antd, echarts.
  - `dhx-gantt` (`@dhx/gantt`) and `dhx-react-gantt` (`@dhx/react-gantt`) — vendored DHTMLX Gantt + a React wrapper. `dhx-react-gantt` depends on `@dhx/gantt` via `workspace:*`.
- `widgets/` — declared in the workspace glob but currently empty (reserved for Mendix widget packages).

Shared libs are consumed pre-built (`main`/`types` point at `dist/`). When you change a shared package, run its `build` (or `dev`) before the app picks up the change — `pnpm dev` does not transparently rebuild them.

## Common commands (run from repo root)

- `pnpm dev` — runs `dev` in every package in parallel (`pnpm -r --parallel --stream run dev`). Use this when you want shared libs in watch mode alongside the app.
- `pnpm dev:app` — only the react-app Vite server.
- `pnpm dev:simulation` — only the simulation package (`@ax/simulation` — not present in the current tree; this script is reserved).
- `pnpm build` — `pnpm -r run build` across all packages.
- `pnpm build:shared` — `ax-cowork-ui` only (legacy filter name kept for backwards compat).
- `pnpm lint` / `pnpm test` — recursive over all packages.
- `pnpm format` / `pnpm format:check` — Prettier on the whole tree. `pnpm format:app` is a Prettier-only shortcut for `react-app/`.

There is no top-level test runner; tests live inside packages that opt in (currently `ax-markdown` via Vitest, and `react-app` if/when test files are present).

## Per-package work

Use pnpm filters to scope commands to one package, e.g.

- `pnpm --filter @ax/react-app run lint`
- `pnpm --filter @ax-cowork/control-table run build`
- `pnpm add <pkg> --filter @ax/react-app` to install into a single package (see `note` in repo root).

Inside `react-app/`, the package-local scripts (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm preview`) work as you'd expect. The build pipeline is `tsc -b && vite build && node scripts/postbuild.mjs`.

## Pre-commit hooks

Husky runs `lint-staged` on commit (`.husky/pre-commit`). `.lintstagedrc.json` is **out of date** — it references paths like `packages/ax-coworker-ui/**` and `services/**` that don't exist in the current layout. When you touch lint-staged behavior, update the globs to match the actual `react-app/`, `shared/<name>/`, `widgets/` paths. Until then, expect lint-staged to be a no-op for most edits and rely on `pnpm lint` / Prettier manually.

## Route map (for orientation)

The app exposes four authed pages plus auth/error/sample routes — defined in `react-app/src/acore/router/index.tsx`:

- `/` → `HomePage`
- `/pps` → `PpsPage`, `/eps` → `EpsPage`, `/mps` → `MpsPage` (the three core planning/simulation surfaces; each owns `data/`, `helpers/`, `layout/`, `modals/`, `panels/`, `stores/`, `views/` subfolders under `src/pages/<name>/`)
- `/sample/*` → demos for `control-table` and `markdown-view` (uses `AppLayout` instead of `PageLayout`)
- `/auth/signin`, `/system-error`, `/system-exception`, `/access-denied`, `*` (NotFound)

`InterruptionGuard` wraps the whole tree — when `auth.isInterrupted` flips true, navigation is forced to `/system-error`. Boot blocks the router until `auth.init()` resolves (see `AxApp.tsx`).

## Conventions worth knowing before editing

- TS strictness in `react-app` (`verbatimModuleSyntax`, `erasableSyntaxOnly`, no unused locals): type-only imports must use `import type`, no enums/namespaces, prefix unused params with `_`. The `@/` alias maps to `react-app/src/`.
- Boundary rules in `react-app/` are enforced by `eslint-plugin-boundaries` (see `eslint.config.js`). Cross-page imports and `acore → page/layout` imports fail lint, not just review. The full table is in `react-app/CLAUDE.md`.
- Shared design-system primitives in `react-app/src/shared/<kebab>/Ax<Name>.tsx` consume AntD tokens via `theme.useToken()` and MDI icon names typed by `MdiIconName` — don't widen those types.
- i18n requires both `en/` and `ko/` locale files when adding keys (three namespaces: `common`, `auth`, `app`).
- MobX stores are organized by **data shape** under `react-app/src/acore/store/`, not per-page. Add new domain stores there and wire into `RootStore`; do not create page-scoped stores.

## Task notes

Per-task scratch notes live in `react-app/tasks/<NNN>_<name>/note.txt` and are treated as the source of truth for what an in-progress task is supposed to deliver. Check the relevant `note.txt` before non-trivial work on a page or feature that has one.
