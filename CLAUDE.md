# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace layout

pnpm monorepo (`pnpm-workspace.yaml` globs: `shared/*`, `packages/*`, `services/*`) with five packages:

| Path                        | Package name               | Stack                                                               |
| --------------------------- | -------------------------- | ------------------------------------------------------------------- |
| `shared/ax-common/`         | `@ax-cowork/shared`        | Plain TypeScript library; emits to `dist/`                          |
| `shared/ax-control-table/`  | `@ax-cowork/control-table` | React component library (AntD-based table); Vite-bundled to `dist/` |
| `packages/ax-coworker-ui/`  | `ax-cowork-ui`             | Vite + React 19 + Ant Design v6 + MobX + Tailwind 3 + i18n + Sass   |
| `packages/ax-coworker-be/`  | `ax-cowork-be`             | NestJS 11 (Express + Handlebars views)                              |
| `services/ax-cdn-services/` | `ax-cdn-services`          | NestJS 11 (Express + Swagger + class-validator)                     |

Both NestJS packages and the UI consume `@ax-cowork/shared` via `workspace:*`; the UI also consumes `@ax-cowork/control-table`. Both shared packages point their `main`/`types`/`exports` at `dist/`, so **shared libraries must be built before consumers can type-check**:

- `pnpm --filter @ax-cowork/shared build` (or `... dev` for `tsc --watch`)
- `pnpm --filter @ax-cowork/control-table build` (or `... dev` for `vite build --watch`)

`pnpm dev` from the repo root runs both shared packages in watch mode in parallel. Import from the documented subpaths only (e.g. `import { ... } from '@ax-cowork/shared/utils'`) — no deep paths.

## Commands (run from repo root)

- `pnpm dev` — runs `dev` in every package in parallel (`shared` watch + Vite + Nest watch ×2)
- `pnpm dev:fe` / `pnpm dev:be` / `pnpm dev:cdn` — single-package dev
- `pnpm build` — builds all packages (`tsc -b && vite build` for UI, `nest build` for each Nest app, `tsc` for shared)
- `pnpm lint` — runs each package's `lint` script
- `pnpm test` — runs each package's `test` script: BE + CDN use Jest, UI uses Vitest (co-located `*.test.{ts,tsx}` under `src/`). Shared has no tests yet.
- `pnpm format` / `pnpm format:check` — Prettier across the whole repo

Per-package commands (run with `pnpm --filter <name> <script>` or inside the package dir):

- `ax-cowork-be`: `pnpm --filter ax-cowork-be test` (Jest), `... test:e2e`, `... test:cov`, `... start:debug`
- `ax-cdn-services`: same script set as BE (`test`, `test:e2e`, `test:cov`, `start:debug`)
- `ax-cowork-ui`: `pnpm --filter ax-cowork-ui preview` (serve production build)
- Single Jest test in a Nest package: `pnpm --filter <name> exec jest path/to/file.spec.ts -t "test name"`

A Husky `pre-commit` hook runs `lint-staged` (`.lintstagedrc.json`): per-package ESLint `--fix` on changed TS files plus Prettier on everything else. The lint-staged config addresses each package by its real path (`packages/ax-coworker-ui/**`, `packages/ax-coworker-be/**`, `services/ax-cdn-services/**`, `shared/ax-common/src/**`, `shared/ax-control-table/src/**`) — keep these patterns in sync with the workspace layout when adding or renaming packages, and keep each package's `eslint.config.*` self-contained because `lint-staged` invokes them by package filter.

## Architecture notes that span files

### Front-end (`packages/ax-coworker-ui/`)

The UI has many conventions — **read `packages/ax-coworker-ui/CLAUDE.md` first** before non-trivial changes. Highlights worth knowing at this level:

- **Layer rules are enforced by `eslint-plugin-boundaries`** (`pages → acore/shared/layout`, `acore → acore/shared`, `shared → shared` only, etc.). Violations fail lint. See the per-package doc for the full table.
- **State is domain-organized**, not page-organized: `RootStore` aggregates `auth`, `ui`, `tasks`, `documents`, `comments`. Don't create `<Page>Store` — extend the matching domain store. `AuthStore` persists to `localStorage` via `acore/storage/`.
- **Path alias `@/` → `src/`** is configured in both `tsconfig.app.json` and `vite.config.ts`. Prefer `@/` for cross-folder imports; relative `./` is fine within the same folder.
- **Theme tokens single source of truth = AntD `axTheme`** (`src/acore/theme/theme.ts`, raw colors in `token.ts`); Tailwind config (`tailwind.config.js`) mirrors brand colors. `src/styles/_ax-variables.scss` is intentionally retained but **not consumed** — don't add color refs there.
- **Strict TS dialect**: `tsconfig.app.json` enables `verbatimModuleSyntax` + `erasableSyntaxOnly`, so type-only imports must use `import type` and TS-runtime constructs (enums, parameter properties, value-bearing namespaces) won't compile. `noUnusedLocals`/`noUnusedParameters` are on — prefix unused params with `_`.
- Routing lives in `src/acore/router/index.tsx` (named export `index`). Routes use `lazy: () => ({ Component })` for code-splitting, with `RequireAuth` / `RedirectIfAuthed` guards and `RouteError` `errorElement` per layout group. Two layouts: `SimulationLayout` (4-vùng app shell) and `AuthLayout` (centered card with EN/KO language switcher). The `<AxApp>` tree wires `StoreContext` → `ConfigProvider(axTheme)` → `AntApp` → `RouterProvider`.
- i18n: 3 namespaces (`common` default, `auth`, `app`) × 2 languages (`en` fallback, `ko`). Use `useTranslation('ns')` for non-default namespaces. Adding a key → update both `en/` and `ko/` JSON.

### Back-end (`packages/ax-coworker-be/`)

NestJS 11 app bootstrapped from `src/main.ts` (listens on `PORT ?? 3000`). The root is `MainModule` (not the default `AppModule`), which wires:

- `ConfigModule` (`src/acore/config/`) — `@nestjs/config` + `joi` validation
- `GatewayModule`, `WebhookModule`, `WebsocketModule`, `WorkersModule` — feature module slots (mostly stubs today; add controllers/providers inside the matching folder)
- `WebappModule` (`src/webapp/`) — Handlebars-rendered web UI. `main.ts` serves static assets from `public/` and sets `pages/` as the views directory (`hbs` view engine), so server-rendered pages go in `packages/ax-coworker-be/pages/*.hbs`.

ESLint is configured with `recommendedTypeChecked` + `projectService`, so type-aware lint rules apply — imports from `@ax-cowork/shared` will fail lint until `shared/ax-common/dist` exists.

### CDN service (`services/ax-cdn-services/`)

Separate NestJS 11 app bootstrapped from `src/main.ts` (listens on `PORT ?? 3011`). Its root `MainModule` wires `ConfigModule` (`src/acore/config/`), `WorkersModule`, and `ServicesModule` (under which feature folders like `services/health-check/` live). Differences from `ax-cowork-be` worth knowing before touching it:

- Global `ValidationPipe` is enabled with `whitelist: true, transform: true` — request DTOs need `class-validator` decorators or fields are stripped.
- CORS is wide-open (`origin: '*'`) with custom headers `cdn-owner-id`, `timezone`, `lang` (plus `authorization`) allowed.
- Swagger UI is mounted at `/api-docs` via `@nestjs/swagger`; document controllers with the Swagger decorators or they won't appear there.
- No Handlebars / static assets — this app is API-only.

### Shared — `shared/ax-common/`

Pure utility library with three subpath exports (`./utils`, `./formatters`, `./converters`). The barrel `src/index.ts` re-exports all three. When adding a new category, add a new subpath export in `shared/ax-common/package.json` rather than encouraging deep imports. Built with plain `tsc` → `dist/`.

### Shared — `shared/ax-control-table/`

React component library wrapping AntD `Table` with column toggle, controlled pagination/sort/filter, and a typed change event. Single entry `.` exports `AxControlTable` + types (`ControlTableColumn`, `ControlTablePagination`, `ControlTableSort`, `ControlTableFilters`, `ControlTableChangeEvent`). Built with Vite library mode (`vite build`) + `tsc --emitDeclarationOnly` → `dist/ax-control-table.js` + `dist/index.d.ts`. Peer deps: `antd >=6`, `react >=19`. Consumers (currently `ax-cowork-ui`) must build this once before type-checking. When extending the table API, keep public types in `src/types.ts` and re-export from `src/index.ts` so consumers don't deep-import.

## Task-driven workflow convention

Incremental scaffolding work is captured in per-package `tasks/<NNN>_<short-name>/` directories. Each contains a `note.txt` (sometimes `index.txt`) with the spec, plus any reference assets (images, mocks). When the user asks you to "run a task" or names one of these folders, **read the note before making non-trivial changes** — those notes are the source of truth for what the package is supposed to become, ahead of the current code state. Active task lists:

- `packages/ax-coworker-ui/tasks/001_setup-react-ant-design/` — initial scaffold + brand assets (DONE)
- `packages/ax-coworker-ui/tasks/002_make-ui-concept/` — main page UI from `sample-page.png` (DONE for concept; data is currently mocked inside domain stores)

The repo root `tasks/` directory does not exist yet — task folders live inside the package they apply to.

## Formatting

Single Prettier source of truth at the repo root: `.prettierrc.json` (`printWidth: 160`, `semi: false`, `singleQuote: true`, `trailingComma: 'all'`, `endOfLine: 'lf'`) and `.prettierignore`. Per-package Prettier files were removed. Prettier is **not** wired into ESLint — `eslint-plugin-prettier` is intentionally excluded (avoids the MAL-2025-6023 supply-chain risk and follows Prettier's own current guidance). Run formatting via `pnpm format`, the editor's Prettier integration, or the `lint-staged` hook. Each package's ESLint config extends `eslint-config-prettier` (turns off conflicting stylistic rules) and re-asserts `indent` / `quotes` / `comma-dangle` as a safety net — those three rules are mirrored across `packages/ax-coworker-ui/eslint.config.js`, `packages/ax-coworker-be/eslint.config.mjs`, `services/ax-cdn-services/eslint.config.mjs`, `shared/ax-common/eslint.config.mjs`, and `shared/ax-control-table/eslint.config.mjs`, so update all five together.
