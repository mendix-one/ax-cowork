# CLAUDE.md — `widgets/`

Guidance for Claude Code when developing the Mendix pluggable widgets in this folder. Read the repo-root `CLAUDE.md` first for monorepo-wide rules; this file is the focused guide for the widget-development effort. The root file's "Mendix widget builds" section still applies — the notes here build on it, they don't replace it.

## What this part of the project is for

The mission of this workspace is to **port UI concepts out of `react-app/` into self-contained Mendix pluggable widgets**, then verify them in the `simulation/` host before producing the `.mpk` that drops into a Mendix app.

The pipeline is:

```
react-app/ (UI concept, source of truth for look & behaviour)
        │  port / reimplement as a self-contained widget
        ▼
widgets/<name>/  (the pluggable widget — the deliverable)
        │  consumed via Vite alias for fast iteration
        ▼
simulation/  (renders the widget outside Studio Pro with mocked Mendix APIs)
        │  build:web
        ▼
dist/<version>/<packagePath>.<WidgetName>.mpk  →  Mendix project
```

The widget is the deliverable; `react-app` is the reference design; `simulation` is the test harness. `react-app/` and `shared/` are **not** part of the active pnpm workspace anymore — `pnpm-workspace.yaml` lists only `widgets/*`. Treat `react-app` as a read-only design reference, not a build dependency.

## Current state (read before assuming a widget is "done")

- `widgets/ax-login` is **still the `pluggable-widgets-tools` HelloWorld scaffold.** `AxLogin.xml` declares one prop (`sampleText`); `AxLogin.tsx` just renders `HelloWorldSample`; the generated `typings/AxLoginProps.d.ts` reflects only `sampleText`.
- `simulation/src/pages/AxLoginSimPage.tsx` is written against the **intended** rich prop shape — `accountAttribute`, `passwordAttribute`, `signInAction`, `signUpAction`, `errorMessage`, `isBusy`, `logoUrl`, and the various label props. **None of those exist in the widget yet**, so the sim page is effectively a spec/target and currently won't typecheck against the real typings.
- So "port the login widget" means: define those properties in `AxLogin.xml` → let the build regenerate `typings/AxLoginProps.d.ts` → implement `AxLogin.tsx` against the new typings (porting `react-app/src/pages/auth/SignInPage.tsx`) → confirm in the sim.
- `widgets/` currently contains only `ax-login`. The root `CLAUDE.md` mentions an `ax-layout` placeholder; it does not exist in the tree yet.

## The dev loop

From repo root:

- `pnpm dev:sim` — runs the simulation host on **port 5174**. It imports widget source TSX **directly** through Vite aliases (no `.mpk` build needed), so editing `widgets/<name>/src/**` hot-reloads in the sim. This is the fast inner loop — use it for almost all UI work.
- `pnpm --filter <pkg> run build` — produce the `.mpk` (e.g. `pnpm --filter axlogin run build`). Only needed when you actually want the Mendix-loadable bundle. Note the widget package's `name` is the bare `axlogin` (not scoped), so that's the filter target.
- `pnpm --filter <pkg> run dev` — `pluggable-widgets-tools start:web` watch build that drops the `.mpk` into the Mendix project at `config.projectPath` (`../../../ax-web-app-main`). Use this only when iterating inside an actual Studio Pro app.

Prefer the simulation loop over Studio Pro for anything that isn't specifically about Mendix runtime integration.

## How the simulation wires to a widget (`simulation/`)

- `vite.config.ts` aliases:
  - `@axlogin` → `widgets/ax-login/src` — so a sim page does `import { AxLogin } from '@axlogin/AxLogin'` and renders the container component straight from source.
  - `mendix` → `simulation/src/mock/mendix.ts` — the widget's typings import from the `mendix` module; aliasing it to the mock gives Vite a real module to resolve when stripping types.
- `src/mock/mendix.ts` provides minimal stubs of the Mendix Values APIs the widget consumes: `EditableValue`, `DynamicValue`, `ActionValue`, `WebImage`, plus factories `editable([state,setState])`, `dynamic(v)`, `action(fn)`, `webImage(uri)`. The **sim page owns the state**; the widget mutates it via `EditableValue.setValue`, exactly as it would in Studio Pro.
- To add a widget to the sim: create `src/pages/<Name>SimPage.tsx`, add a route + sidebar entry in `src/App.tsx` (the `widgets` array), and build the container props out of the mock factories so the widget sees its real prop shape.

When you change a widget's `.xml` properties, regenerate the typings (run the widget's `dev`/`build` once) and then update the matching sim page's props object to keep it compiling.

## Anatomy of a widget package (`widgets/ax-login`)

| File                            | Role                                                                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/AxLogin.xml`               | **Property definitions** — the single source of truth for the widget's props. Editing this regenerates `typings/AxLoginProps.d.ts` on the next build/dev. See the property-types doc below. |
| `src/package.xml`               | Client-module manifest: maps `<widgetFile>` and the bundle `<file path>` to the runtime location. Must agree with `packagePath` + widget id.                                                |
| `src/AxLogin.tsx`               | The runtime container component. Receives `AxLoginContainerProps`, renders the UI. This is where ported `react-app` UI lives.                                                               |
| `src/AxLogin.editorPreview.tsx` | Studio Pro design-mode preview (`preview()` + `getPreviewCss()`). `getPreviewCss` uses `require()` on the CSS.                                                                              |
| `src/AxLogin.editorConfig.ts`   | Studio property-pane behaviour: `getProperties()` (conditional visibility), optional `check()` (validation errors/warnings), `getPreview()` (structure-mode rendering).                     |
| `src/ui/AxLogin.css`            | Widget styles.                                                                                                                                                                              |
| `typings/AxLoginProps.d.ts`     | **Generated — do not edit.** Regenerated from `AxLogin.xml`. The header warns changes are overwritten.                                                                                      |
| `package.json`                  | Scripts run via `pluggable-widgets-tools`; key fields `widgetName`, `packagePath`, `config.projectPath`.                                                                                    |

### Identity wiring (must stay consistent)

For `ax-login`: widget id `one.mendix.axlogin.AxLogin`, `packagePath: "one.mendix"`, `widgetName: "AxLogin"`. The id `<vendor>.<package>.<lowercase widgetname>.<WidgetName>` maps to runtime path `one/mendix/axlogin/AxLogin.js`, which is what `package.xml`'s `<file path="one/mendix/axlogin"/>` points at. If you rename or add a widget, keep id ↔ `packagePath` ↔ `package.xml` `<file>` in agreement or the `.mpk` won't load.

## Defining properties (the core skill)

Properties are declared in `<WidgetName>.xml` under `<propertyGroup>`/`<property>`. The build turns each into a typed field on `*ContainerProps`. Common types used when porting interactive UI:

- `string` (with optional `multiline`) → `string` or, for expressions, `DynamicValue<string>`
- `attribute` (bound to an entity attribute) → `EditableValue<T>` — two-way bound form fields. Needs `needsEntityContext="true"` on the `<widget>` (already set for ax-login).
- `action` → `ActionValue` — button/submit handlers; gate the UI on `canExecute`/`isExecuting`.
- `image` → `DynamicValue<WebImage>` — logos etc.
- `expression`, `enumeration`, `boolean`, `integer`, `datasource`, `widgets` (drop zones) — see the property-types reference.

After editing the XML, run the widget's `dev` or `build` once so `typings/` regenerates, then implement against the new `ContainerProps`. The mock (`simulation/src/mock/mendix.ts`) mirrors these value shapes, so the sim page and the widget agree on the API contract.

## Gotchas (carried from root, repeated here because they bite often)

1. **`CI=true` on every `pluggable-widgets-tools` script.** The tools' interactive `checkMigration()` prompts on stdin and fails non-interactively. The root notes say this is baked into the scripts — verify it's present before running a build in CI/headless; the current `package.json` scripts call the tools directly, so prefix with `CI=true` (or `$env:CI="true"` in PowerShell) if a build hangs on a migration prompt.
2. **Extend the tools' tsconfig, don't override.** `tsconfig.json` extends `@mendix/pluggable-widgets-tools/configs/tsconfig.base`, which uses `jsx: "react-jsx"` (automatic runtime) — do **not** `import { createElement } from "react"`; just write JSX. `noUnusedLocals` will flag the unused import.
3. **CSS/SCSS imports need an ambient declaration** (`typings/global.d.ts` declaring `*.css`/`*.scss`) for `getPreviewCss()`'s `require()`. The tools don't ship it; each widget carries its own.
4. **Scope Tailwind if you add it.** Use `important: ".<widget>"` + `corePlugins.preflight: false` so the widget doesn't stomp the host app's AntD defaults or bleed into other widgets. Pick a unique scope class per widget.
5. **AntD bundles into the `.mpk`** if listed in `dependencies`, inflating size to several MB. The current `ax-login` scaffold only depends on `classnames`; decide deliberately before adding `antd` to a widget's deps vs. relying on a host-provided AntD.
6. **React 19 is pinned** via `resolutions`/`overrides` in the widget's `package.json` — keep new widgets on the same pins.

## Reference docs

- Create a pluggable widget (tutorial): https://docs.mendix.com/howto/extensibility/create-a-pluggable-widget-one/
- Property types (the XML `<property>` reference): https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-property-types/
- Pluggable widgets overview & properties definition: https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets/
- Client APIs (Values API — `EditableValue`, `DynamicValue`, `ActionValue`, etc.): https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis/
