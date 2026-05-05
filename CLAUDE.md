# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

pnpm workspace (config in `pnpm-workspace.yaml`, package manager pinned in root `package.json` via `packageManager: pnpm@10.x`):

- `back-end/` — NestJS 11 + TypeScript service (`ax-cowork-be`)
- `front-end/` — React 19 + Vite 8 SPA (`ax-cowork-ui`)
- `shared/` — TypeScript library (`@ax-cowork/shared`) consumed by both apps via `workspace:*`

A single root `node_modules/` and `pnpm-lock.yaml` are shared across packages. **Always use pnpm, not npm/yarn** — mixing package managers will produce a stray lockfile and desync the install.

## Common commands

Run from the repo root unless noted. Root scripts are thin pass-throughs over `pnpm -r` / `pnpm --filter`.

### Workspace-wide (root)

- `pnpm install` — install all packages
- `pnpm dev` — run every package's `dev` script in parallel with streamed output (front-end Vite + back-end Nest watch)
- `pnpm dev:fe` / `pnpm dev:be` — run only one side
- `pnpm build` — recursive build across all packages
- `pnpm lint` — recursive lint
- `pnpm test` — recursive test (only back-end has tests today)
- `pnpm format` / `pnpm format:check` — Prettier write / check across the whole repo (config: root `.prettierrc.json`, `.prettierignore`)

### Targeting a single package

- `pnpm --filter ax-cowork-be <script>` — run a back-end script (e.g. `start:debug`, `format`, `test:e2e`, `test:cov`)
- `pnpm --filter ax-cowork-ui <script>` — run a front-end script (e.g. `preview`)
- Or `cd` into the package and use `pnpm run <script>` directly.

### Back-end-specific notes

- The back-end exposes both `start:dev` and `dev` (alias) — keep them in sync if you change one. `dev` exists so root-level `pnpm -r dev` covers both apps.
- Single test: `pnpm --filter ax-cowork-be test -- path/to/file.spec.ts` or `… -- -t "name pattern"`.
- Jest config is inline in `back-end/package.json` (`rootDir: src`, pattern `*.spec.ts`); e2e uses `test/jest-e2e.json`.
- Default port 3000, override with `PORT`.

### Front-end-specific notes

- `build` is `tsc -b && vite build` — typecheck failures will block the bundle.
- No test runner configured.

### Shared library (`@ax-cowork/shared`)

Compiled to CommonJS + `.d.ts` in `shared/dist/` (the lowest-common-denominator format that works for both Nest's CJS runtime and Vite's bundler). Import as:

```ts
import { formatCurrency, stringToDate, clamp } from '@ax-cowork/shared'
// or by subpath
import { capitalize } from '@ax-cowork/shared/utils'
import { formatRelative } from '@ax-cowork/shared/formatters'
import { stringToNumber } from '@ax-cowork/shared/converters'
```

- **Build is required before consumers can resolve it.** `pnpm install` does not auto-build workspace packages — run `pnpm build` (or `pnpm --filter @ax-cowork/shared build`) once after install. `pnpm -r run build` builds in topological order so shared comes first automatically.
- **For dev workflows that edit the library**, run `pnpm --filter @ax-cowork/shared dev` (tsc watch) alongside the consumer's dev server. Edits to `shared/src/**` are not picked up until `dist/` is rewritten.
- Subpath exports are declared in `shared/package.json` `exports`. To add a new top-level subpath (e.g. `./validators`), create `src/validators/index.ts` and add an entry to the `exports` map.

### Adding dependencies

- To one package: `pnpm --filter ax-cowork-ui add <pkg>` (or `cd front-end && pnpm add <pkg>`)
- Dev dep: append `-D`. Workspace-internal dep: append `--workspace` (e.g. `pnpm --filter ax-cowork-ui add @ax-cowork/shared --workspace`).
- Root-only tooling: `pnpm add -Dw <pkg>`.

### Build scripts approval

pnpm 10 blocks postinstall scripts by default. After `pnpm install` you'll see _"Ignored build scripts: …"_. Run `pnpm approve-builds` (interactive) to whitelist needed ones — currently `@nestjs/core` and `unrs-resolver`.

## Code style

- **Prettier** is the single source of truth for formatting (root `.prettierrc.json`, hoisted `prettier` devDep). Style: no semicolons, single quotes, trailing commas all, printWidth 100, LF line endings. Run `pnpm format` before commits or rely on your editor's Prettier integration; CI should run `pnpm format:check`.
- **EditorConfig** (`.editorconfig`) covers indent / EOL / charset / trim-whitespace / final-newline at the editor level — keeps non-Prettier file types (yaml, scss, etc.) consistent.
- **ESLint integrates with Prettier via `eslint-config-prettier`** (turns off conflicting rules) — *not* `eslint-plugin-prettier`, which is intentionally avoided (it's slow and the project recommends running Prettier separately). Each package has its own flat config:
  - `front-end/eslint.config.js` — JS + ts-eslint recommended + react-hooks + react-refresh (with `useStore` whitelisted under `react-refresh/only-export-components` so the MobX context pattern is allowed). Not type-aware.
  - `back-end/eslint.config.mjs` — JS + `recommendedTypeChecked` + node/jest globals. Type-aware via `projectService: true`.
  - `shared/eslint.config.mjs` — JS + ts-eslint recommended. Not type-aware (kept simple).

## Architecture notes

### Front-end (`front-end/src/`)

Composition is set up in `main.tsx` and is load-bearing — features assume this provider stack exists:

```
ThemeProvider (MUI) → CssBaseline → StoreProvider (MobX) → BrowserRouter → App
```

- **State: MobX with a root-store + context pattern.** `RootStore` aggregates feature stores (currently just `CounterStore`); a singleton `rootStore` is exposed via `StoreProvider` in `stores/context.tsx`. Components read it through the `useStore()` hook and **must be wrapped in `observer(...)` from `mobx-react-lite`** to react to observable changes (see `routes/Home.tsx`). Add new feature stores as fields on `RootStore`.
- **Routing: React Router 7 (data-router-less style).** `App.tsx` declares `<Routes>` with a `Layout` route that renders `<Outlet />`; nested routes are children. Add new pages under `src/routes/` and register them inside the `Layout` route in `App.tsx`.
- **Styling: MUI + SCSS coexist.** Use MUI components and the `sx` prop for layout/theming (theme in `src/theme.ts`). For per-component styles, use co-located SCSS modules (e.g. `Home.module.scss`). Global styles and shared SCSS variables live in `src/styles/` (`global.scss`, `_variables.scss`); SCSS is compiled by `sass-embedded` via Vite. Roboto is loaded through `@fontsource/roboto` in `main.tsx` and wired into the MUI theme.
- **TypeScript project references.** `tsconfig.json` is a thin root that delegates to `tsconfig.app.json` (app code under `src/`) and `tsconfig.node.json` (Vite/ESLint configs). `npm run build` runs `tsc -b`, which builds both — keep new files reachable from the right project's `include`.
- **ESLint is _not_ type-aware** (`front-end/eslint.config.js` uses `tseslint.configs.recommended`, not `recommendedTypeChecked`). Switching it on requires wiring `parserOptions.project` to both tsconfigs — the `front-end/README.md` sketches the exact change.
- **Static assets — two locations with different semantics.** `src/assets/` is imported from TS/TSX (hashed and bundled by Vite). `public/` is served verbatim at the root — e.g. `public/icons.svg` is referenced via `<use href="/icons.svg#…">`.

### Back-end (`back-end/src/`)

Standard NestJS 11 layout — `main.ts` bootstraps `AppModule`, which wires controllers and providers. Currently just the scaffold (`AppController` + `AppService`). When adding features, follow Nest conventions: a feature module per domain, registered in `AppModule.imports`.

ESLint here **is** type-aware (`tseslint.configs.recommendedTypeChecked`), so lint failures often reflect real type issues. `@typescript-eslint/no-explicit-any` is disabled; `no-floating-promises` and `no-unsafe-argument` are warnings.
