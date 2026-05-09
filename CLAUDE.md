# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace layout

pnpm monorepo (`pnpm-workspace.yaml`) with three packages:

| Path         | Package name        | Stack                                               |
| ------------ | ------------------- | --------------------------------------------------- |
| `shared/`    | `@ax-cowork/shared` | Plain TypeScript library, emits to `dist/`          |
| `front-end/` | `ax-cowork-ui`      | Vite + React 19 + Ant Design v6 + MobX + Tailwind 3 |
| `back-end/`  | `ax-cowork-be`      | NestJS 11 (Express)                                 |

`back-end` and (where needed) `front-end` consume `shared` via `workspace:*`. Because `shared/package.json` points its `main`/`types`/subpath `exports` (`./utils`, `./formatters`, `./converters`) at `dist/`, **`shared` must be built before consumers can type-check** — run `pnpm --filter @ax-cowork/shared run build` once, or `pnpm --filter @ax-cowork/shared run dev` to keep it in `tsc --watch`. Import from the subpaths (e.g. `import { ... } from '@ax-cowork/shared/utils'`), not deep paths.

## Commands (run from repo root)

- `pnpm dev` — runs `dev` in every package in parallel (`shared` watch + Vite + Nest watch)
- `pnpm dev:fe` / `pnpm dev:be` — single-package dev
- `pnpm build` — builds all packages (`tsc -b && vite build` for FE, `nest build` for BE, `tsc` for shared)
- `pnpm lint` — runs each package's `lint` script
- `pnpm test` — runs each package's `test` script (only `back-end` has Jest wired up; FE/shared have none yet, so this is effectively the BE test suite)
- `pnpm format` / `pnpm format:check` — Prettier across the whole repo

Per-package commands (run with `pnpm --filter <name> <script>` or inside the package dir):

- `back-end`: `pnpm --filter ax-cowork-be test` (Jest), `... test:e2e`, `... test:cov`, `... start:debug`
- `front-end`: `pnpm --filter ax-cowork-ui preview` (serve production build)
- Single Jest test in BE: `pnpm --filter ax-cowork-be exec jest path/to/file.spec.ts -t "test name"`

A Husky `pre-commit` hook runs `lint-staged` (`.lintstagedrc.json`): per-package ESLint `--fix` on changed TS files plus Prettier on everything else. Keep the per-package `eslint.config.*` files self-contained — `lint-staged` invokes them by package filter.

## Architecture notes that span files

### Front-end

See `front-end/CLAUDE.md` for the FE-specific structure (`acore/` framework wiring, feature folders with `store/` + `views/`, RootStore/StoreContext via `useStore()`, planned dependency list). Key points to keep in mind from this level:

- **Theme is duplicated in three layers and must be edited together**: Ant Design tokens in `front-end/src/acore/theme/theme.ts` (with raw `axColors` constants), Tailwind theme in `front-end/tailwind.config.js` (`ax-primary`, `ax-secondary`, …), and Sass variables in `front-end/src/styles/_ax-variables.scss`. A color change in one place without the others will silently diverge.
- **Strict TS dialect**: `tsconfig.app.json` enables `verbatimModuleSyntax` and `erasableSyntaxOnly`, so type-only imports must use `import type`, and TS-runtime constructs (enums, parameter properties, value-bearing namespaces) won't compile. `noUnusedLocals`/`noUnusedParameters` are on — prefix unused params with `_`.
- Routing lives in `front-end/src/acore/router/index.tsx` (the export is named `index`); pages register here. The `<AxApp>` tree wires `StoreContext` → `ConfigProvider(theme)` → `AntApp` → `RouterProvider` in that order, so anything depending on a store, antd context, or router must sit inside it.

### Back-end

Stock NestJS 11 scaffold (`AppModule` → `AppController` + `AppService`, bootstrapped in `src/main.ts` listening on `PORT ?? 3000`). No domain modules yet. ESLint is configured with `recommendedTypeChecked` + `projectService`, so type-aware lint rules apply — imports from `@ax-cowork/shared` will fail lint until `shared/dist` exists.

### Shared

Pure utility library with three subpath exports (`./utils`, `./formatters`, `./converters`). The barrel `src/index.ts` re-exports all three. When adding a new category, add a new subpath export in `shared/package.json` rather than encouraging deep imports.

## Task-driven workflow convention

Incremental scaffolding work is captured in per-package `tasks/<NNN>_<short-name>/` directories. Each contains a `note.txt` (sometimes `index.txt`) with the spec, plus any reference assets (images, mocks). When the user asks you to "run a task" or names one of these folders, **read the note before making non-trivial changes** — those notes are the source of truth for what the package is supposed to become, ahead of the current code state. Active task lists:

- `front-end/tasks/001_setup-react-ant-design/` — initial scaffold + brand assets
- `front-end/tasks/002_make-ui-concept/` — main page UI from `sample-page.png`

The repo root `tasks/` directory exists but is currently empty.

## Formatting

Single Prettier source of truth at the repo root: `.prettierrc.json` (`printWidth: 160`, `semi: false`, `singleQuote: true`, `trailingComma: 'all'`, `endOfLine: 'lf'`) and `.prettierignore`. Per-package Prettier files were removed. Prettier is **not** wired into ESLint — `eslint-plugin-prettier` is intentionally excluded (avoids the MAL-2025-6023 supply-chain risk and follows Prettier's own current guidance). Run formatting via `pnpm format`, the editor's Prettier integration, or the `lint-staged` hook. Each package's ESLint config extends `eslint-config-prettier` (turns off conflicting stylistic rules) and re-asserts `indent` / `quotes` / `comma-dangle` as a safety net — those three rules are mirrored across `front-end/eslint.config.js`, `back-end/eslint.config.mjs`, and `shared/eslint.config.mjs`, so update all three together.
