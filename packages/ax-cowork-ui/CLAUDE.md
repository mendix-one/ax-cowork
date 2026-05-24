# CLAUDE.md (`packages/ax-coworker-ui/`)

This file provides UI-specific guidance to Claude Code. **Read it before non-trivial edits.** Cross-cutting workspace info lives in the repo-root `CLAUDE.md`.

## Commands

- `pnpm dev` — Vite dev server with HMR (default http://localhost:5173)
- `pnpm build` — `tsc -b && vite build`; both must pass
- `pnpm lint` — ESLint over `src/` (includes the boundary rules below)
- `pnpm test` / `test:watch` / `test:ui` — Vitest, co-located `*.test.{ts,tsx}` files
- `pnpm preview` — serve the production build

## Layer rules (enforced by ESLint — violations fail lint)

```
root    → root, acore, router, shared, layout, page, asset
router  → acore, shared, layout, page, asset            (= the one file src/acore/router/index.tsx)
page    → acore, shared, layout, asset                  (NO cross-page imports)
layout  → acore, shared, layout, asset                  (NO page)
acore   → acore, shared, asset                          (NO page, NO layout — kernel doesn't know UI)
shared  → shared, asset                                 (leaf — design system primitives)
test    → acore, shared, layout, page, asset            (tests can pull anything)
asset   → (nothing)
```

Element types are derived from folder pattern, defined in `eslint.config.js`:

| Folder                       | Type     | Notes                                                                        |
| ---------------------------- | -------- | ---------------------------------------------------------------------------- |
| `src/{AxApp,main}.tsx`       | `root`   | composition root                                                             |
| `src/acore/router/index.tsx` | `router` | special-case ONE file — only this can import pages                           |
| `src/acore/**`               | `acore`  | kernel: api, i18n, router primitives, storage, store, theme                  |
| `src/shared/<name>/`         | `shared` | each `<name>/` is its own element ⇒ cross-`shared/X` ↔ `shared/Y` is allowed |
| `src/layouts/<name>/`        | `layout` | each `<name>/` is its own element                                            |
| `src/pages/<name>/`          | `page`   | each `<name>/` is its own element ⇒ cross-page imports are blocked           |
| `src/assets/**`              | `asset`  | static                                                                       |
| `src/test/`                  | `test`   | vitest setup                                                                 |

**Adding a new layer** (e.g. `features/`, `entities/`, `widgets/`) → update both `boundaries/elements` and the rules array in `eslint.config.js`. Keep the table above in sync.

## Source structure

```
src/
├── AxApp.tsx, main.tsx              # composition root: StoreContext → ConfigProvider → AntApp → RouterProvider
├── acore/                            # kernel (no UI feature awareness)
│   ├── api/                          # HTTP client + typed errors (request, api.get/post/..., ApiError, NetworkError)
│   ├── i18n/                         # i18next + LanguageDetector, locales/{en,ko}/{common,auth,app}.json
│   ├── router/                       # createBrowserRouter config + RequireAuth + RedirectIfAuthed + RouteError + PageFallback
│   ├── storage/                      # readJson/writeJson localStorage helpers with type guard
│   ├── store/                        # RootStore + StoreContext/useStore + {auth,ui,task,document,comment}.store
│   └── theme/                        # axTheme (AntD ThemeConfig) + token.ts raw values
├── assets/                           # static files (icon, avatar)
├── layouts/
│   ├── SimulationLayout/                    # SimulationLayout + Top/Left/Right/Bottom (4-vùng shell, behind RequireAuth)
│   └── AuthLayout/                   # centered card + EN/KO language switcher (behind RedirectIfAuthed)
├── pages/                            # route entries; each <name>/ is its own boundary element
│   ├── home/HomePage.tsx + views/*
│   ├── auth/SignInPage.tsx
│   └── error/NotFoundPage.tsx
├── shared/                           # design system primitives (Ax*)
│   └── <kebab>/Ax<Name>.tsx          # AxMuiIcon, AxMenuIcon, AxMenuBox, AxSimplePanel, AxBreadcrumb, AxDocItem, AxIconBox, AxChatItem, AxScrollBox
├── styles/                           # global SCSS reset + Tailwind entry
└── test/setup.ts                     # vitest setup (jest-dom matchers, ResizeObserver polyfill, storage clear)
```

## State (MobX domain stores)

`RootStore` aggregates by **data shape**, not by page:

```ts
class RootStore {
  auth = new AuthStore() // currentUser, isAuthed, login flow, localStorage persist
  ui = new UiStore() // theme mode, error queue
}
```

Currently only `auth` and `ui` exist. Domain stores like `tasks`, `documents`, `comments` were removed when the MainPage they served was retired — bring them back (under the same domain naming) when the next consuming page lands.

**Rules**:

- Component access state via `const { auth } = useStore()` (from `@/acore/store/store.context`). Wrap with `observer()` from `mobx-react-lite` for reactivity.
- Adding a new data domain → add a new `<X>.store.ts` next to the others + wire into `RootStore`. **Do NOT create `<Page>Store`** — page is the consumer, not the owner.
- Async pattern: store has `loading: boolean`, `error: string | null`, and `setX` mutators. When `acore/api` is connected to BE, add `load()` actions that flip these flags around `api.get(...)`.
- **Persistence**: see `auth.store.ts` for the canonical pattern — hydrate via `readJson(KEY, guard)` in the field initializer; sync inside each mutator via `writeJson(KEY, value)`. Use `acore/storage/` helpers, not raw `localStorage`.

## Routing

`src/acore/router/index.tsx` exports `index = createBrowserRouter([...])`. Two layout groups + 404:

| Path           | Layout                 | Guard                  | Pages    |
| -------------- | ---------------------- | ---------------------- | -------- |
| `/`            | `<SimulationLayout />` | `<RequireAuth />`      | Home     |
| `/auth/signin` | `<AuthLayout />`       | `<RedirectIfAuthed />` | SignIn   |
| `*`            | none                   | none                   | NotFound |

Conventions:

- **Lazy load**: every route uses `lazy: async () => ({ Component: (await import('@/pages/.../X')).X })`. Layout wraps `<Outlet />` in `<Suspense fallback={<PageFallback />}>`.
- **Error boundary**: each layout has `errorElement: <RouteError />` — `useRouteError()` → `Result` with reload button.
- **Auth flow**: `RequireAuth` redirects unauth → `/auth/signin` with `state.from`; `SignInPage` reads `from` and `navigate(from, { replace: true })` after `setUser`. `RedirectIfAuthed` bounces signed-in users out of `/auth/*`.
- Adding a protected route → place it under the `<RequireAuth />` child group in router config. Public route → place outside.

## Theme & styling

- **Source of truth = AntD tokens** in `src/acore/theme/theme.ts`. Raw `axColors` (primary `#3F51B5`, secondary `#009688`, tertiary `#673AB7`, error/warning/info/success) live in `token.ts`. Consume in components via `theme.useToken()`, never hard-code hex.
- **Tailwind** (`tailwind.config.js`) defines `ax-primary` etc. — these should mirror `axColors`. Update both when adding/changing a brand color.
- **Sass** is minimal — global reset in `src/styles/index.scss` (imports `_ax-layout.scss`, `_ax-shared.scss`). `src/styles/_ax-variables.scss` is **orphan but intentionally retained** for future Sass-based features — do not add new color references there until it has a consumer.
- **antd-style `createStyles`** is fine for component-scoped CSS that needs pseudo/animation (see `MainPage.tsx` dragger styles).
- Avoid inline `style={{}}` for static spacing/color — use AntD `token.padding…` or className.

## i18n

- Setup: `acore/i18n/index.ts` registers **3 namespaces** (`common` default, `auth`, `app`) × **2 languages** (`en` fallback, `ko`). LanguageDetector reads `i18nextLng` from localStorage, then navigator.
- Locale files: `src/acore/i18n/locales/<lang>/<ns>.json`. **Adding a key → update both `en/` and `ko/`** (no auto-translation).
- Usage:
  - Default `common` namespace: `useTranslation()` → `t('actions.send')`
  - Specific namespace: `useTranslation('app')` → `t('tooltip.project')`
  - Cross namespace: `t('app:tooltip.project')` or `useTranslation(['auth', 'common'])`
- Switcher: `AuthLayout` footer toggles EN ↔ KO via `i18n.changeLanguage(lng)`. New languages: extend `supportedLngs` + add `<lang>/` folder.

## Testing

- **Vitest** with jsdom + `@testing-library/react` + `jest-dom` matchers.
- Co-located: `Foo.test.ts(x)` next to `Foo.ts(x)`. `src/test/setup.ts` clears storage and polyfills `ResizeObserver` (AntD Dropdown needs it in jsdom).
- Explicit imports (`import { describe, it, expect, vi } from 'vitest'`) — `globals: false` in config.
- Patterns:
  - **Store**: `new XStore()` in each `it()`, mutate + assert. localStorage auto-cleared by `beforeEach`.
  - **Component**: `render(<X />)` → `screen.getByText` / `container.querySelector` / `userEvent.setup()`.
- Add `*.test.ts(x)` files freely — vitest picks them up via the `include` glob.

## TypeScript strict notes

`tsconfig.app.json` enables:

- `verbatimModuleSyntax` — type-only imports MUST use `import type { ... }`. Mixing breaks build.
- `erasableSyntaxOnly` — no enums, parameter properties, or value-bearing namespaces. Use `const` objects + `as const` or string-literal union types instead.
- `noUnusedLocals` / `noUnusedParameters` — prefix unused params with `_` (e.g. `(_event, value) => ...`).
- `paths: { "@/*": ["./src/*"] }` — `@/` alias to `src/`. Vite mirrors this in `vite.config.ts`.

## Icon convention

`src/shared/mui-icon/AxMuiIcon.tsx` exports `type MdiIconName = keyof typeof mdiPaths`. All `Ax*` components that accept icons type their `icon` prop as `MdiIconName`, so typos are caught at compile time. To pass an icon: `<AxMenuIcon icon="mdiBellOutline" />`. Custom SVG / non-MDI icons → drop down to raw JSX inside the component, don't try to widen the prop type.

## Task-driven workflow

`tasks/<NNN>_<name>/note.txt` is the source of truth for what the package is supposed to become. Read it before non-trivial changes. Current active notes:

- `001_setup-react-ant-design/` — initial scaffold + brand assets (DONE)
- `002_make-ui-concept/` — main page UI from `sample-page.png` (concept DONE; data flow into stores partially mocked)
