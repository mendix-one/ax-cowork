# Design System Tokens — aPlanner (ax-cowork-ui)

> **Version**: 2.0.0
> **Phase**: DESIGN — aligned with implementation
> **Date**: 2026-05-25
> **Owner**: CXO
> **Status**: ✅ Aligned with `packages/ax-cowork-ui`

---

## Overview

This document mirrors the design tokens actually configured in `packages/ax-cowork-ui`. The system is built on **Ant Design v6** theme tokens, customized with brand colors and layout sizing for manufacturing planning workflows.

**Sources of truth in the repo**:

| File                         | Purpose                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/acore/theme/theme.ts`   | AntD `ThemeConfig` — `axTheme`, `axColors`, `axFontFamily`, per-component overrides                      |
| `src/acore/theme/token.ts`   | Raw AntD token table (palette + sizing + motion + breakpoints + shadows)                                 |
| `tailwind.config.js`         | Mirrors `ax-*` brand colors and a neutral ramp for Tailwind utilities                                    |
| `src/styles/_ax-shared.scss` | `ax-display-panel`, `ax-menu-icon`, `ax-menu-box`, `ax-button`, `ax-chat-item`, `ax-doc-item` primitives |

**Rules**:

- AntD theme tokens are the single source of truth — consume via `theme.useToken()` or `createStyles(({ token }) => …)` (antd-style).
- Tailwind brand colors (`ax-primary`, `ax-secondary`, etc.) **must mirror** `axColors` — update both when a brand color changes.
- Do not hard-code hex values in components. Inline `style={{ color: '#…' }}` is reserved for chart/gantt status colors that don't have a semantic token.

---

## 1. Brand Colors

### 1.1 `axColors` (`src/acore/theme/theme.ts`)

| Token                | Hex       | Tailwind Class | Usage                                                     |
| -------------------- | --------- | -------------- | --------------------------------------------------------- |
| `axColors.primary`   | `#3F51B5` | `ax-primary`   | Brand primary — active nav, primary buttons, focus, links |
| `axColors.secondary` | `#009688` | `ax-secondary` | Secondary accents, success-adjacent (teal)                |
| `axColors.tertiary`  | `#673AB7` | `ax-tertiary`  | Hot-lot / AI-related highlights (deep purple)             |
| `axColors.error`     | `#F44336` | `ax-error`     | Critical alerts, slipped commitments, reject              |
| `axColors.warning`   | `#FF9800` | `ax-warning`   | At-risk states, caution                                   |
| `axColors.info`      | `#2196F3` | `ax-info`      | Informational chips, neutral status                       |
| `axColors.success`   | `#4CAF50` | `ax-success`   | On-track, accepted, healthy                               |
| `axColors.body`      | `#bfbfbf` | `neutral.500`  | App-shell layer background (top bar, rails, gutter)       |
| `axColors.panel`     | `#f5f5f5` | `neutral.200`  | Panel header surface                                      |
| `axColors.action`    | `#434343` | `neutral.800`  | Default icon and action button color                      |

### 1.2 Font family

| Token                         | Value                                                                      | Source                |
| ----------------------------- | -------------------------------------------------------------------------- | --------------------- |
| `axFontFamily`                | `'Roboto', -apple-system, sans-serif`                                      | `theme.ts`            |
| `token.fontFamily` (override) | `axFontFamily`                                                             | merged into `myToken` |
| `token.fontFamilyCode`        | `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace` | `token.ts`            |

> The earlier MD3 draft used Inter + JetBrains Mono. The implementation uses **Roboto** (loaded via `@fontsource/roboto`). Update mockups to Roboto.

### 1.3 Theme override scalars (`axTheme`)

| Token                                                 | Value                          | Effect                                                        |
| ----------------------------------------------------- | ------------------------------ | ------------------------------------------------------------- |
| `token.colorPrimary`                                  | `axColors.primary` (`#3F51B5`) | Drives every AntD primary state                               |
| `token.colorText`                                     | `#262626`                      | Default text (overrides AntD `rgba(0,0,0,0.88)`)              |
| `token.colorBgLayout`                                 | `#bfbfbf`                      | App shell background (`body`) — drives sider/header/footer bg |
| Layout `headerHeight`                                 | `36`                           | Top bar height (px)                                           |
| Layout `headerPadding`                                | `'0 6px'`                      | Top bar horizontal padding                                    |
| Layout `footerPadding`                                | `'0 36px'`                     | Bottom strip horizontal padding                               |
| Layout `bodyBg` / `headerBg` / `footerBg` / `siderBg` | `colorBgLayout`                | Unified shell color                                           |
| Splitter `splitBarSize`                               | `2`                            | Gutter between regions                                        |
| Divider `orientationMargin`                           | `0`                            | Tight dividers                                                |
| Divider `textPaddingInline`                           | `0`                            | —                                                             |
| Divider `verticalMarginInline`                        | `0`                            | —                                                             |
| Collapse `headerPadding`                              | `'4px 8px'`                    | Dense collapse headers                                        |
| Collapse `contentPadding`                             | `'8px'`                        | —                                                             |
| Collapse `borderlessContentPadding`                   | `'8px'`                        | —                                                             |

---

## 2. AntD Color Palette (from `token.ts`)

The full AntD ramp is available through tokens. Use these for chips, tags, status accents — instead of inventing new hex values.

### 2.1 Primary states

| Token                     | Hex                  | Usage                            |
| ------------------------- | -------------------- | -------------------------------- |
| `colorPrimary`            | `#3F51B5` (override) | Active state                     |
| `colorPrimaryBg`          | `#e6f4ff`            | Selected row, active nav tint    |
| `colorPrimaryBgHover`     | `#bae0ff`            | Hover over selected              |
| `colorPrimaryBorder`      | `#91caff`            | Subtle outline of active control |
| `colorPrimaryBorderHover` | `#69b1ff`            | Hover outline                    |
| `colorPrimaryHover`       | `#4096ff`            | Filled hover                     |
| `colorPrimaryActive`      | `#0958d9`            | Pressed                          |
| `colorPrimaryText`        | `#1677ff`            | Link / textual primary           |
| `colorPrimaryTextHover`   | `#4096ff`            | —                                |
| `colorPrimaryTextActive`  | `#0958d9`            | —                                |

> The Primary token chain still carries AntD's stock blue ramp because only `colorPrimary` is overridden. When `colorPrimaryBg` etc. is consumed by an AntD component, AntD recomputes states from the override. For raw use, prefer `axColors.primary` (`#3F51B5`).

### 2.2 Semantic state ramps

| Family  | Base      | Bg        | Border    | Hover     | Active    | Text      |
| ------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Success | `#52c41a` | `#f6ffed` | `#b7eb8f` | `#95de64` | `#389e0d` | `#52c41a` |
| Warning | `#faad14` | `#fffbe6` | `#ffe58f` | `#ffd666` | `#d48806` | `#faad14` |
| Error   | `#ff4d4f` | `#fff2f0` | `#ffccc7` | `#ff7875` | `#d9363e` | `#ff4d4f` |
| Info    | `#1677ff` | `#e6f4ff` | `#91caff` | `#69b1ff` | `#0958d9` | `#1677ff` |

> Brand-level semantic colors (`axColors.success/warning/error/info`) co-exist with the AntD ramp above. Use **`axColors.*`** for branded surfaces (buttons, banners), **AntD `colorXxxBg` / `colorXxxBorder` / `colorXxxText`** for ramp variants inside AntD components.

### 2.3 Full hue palette (1–10 shades)

Each available as `token.<hue>` and `token.<hue>1` … `<hue>10` from `token.ts`:

`blue`, `purple`, `cyan`, `green`, `magenta`, `pink`, `red`, `orange`, `yellow`, `volcano`, `geekblue`, `gold`, `lime`.

Examples used in Dynamic Schedule UI:

- Gantt bar — on-track = `blue.6` (`#1677ff`)
- Gantt bar — at-risk = `gold.6` (`#faad14`)
- Gantt bar — slipped = `red.6` (`#f5222d`)
- Gantt bar — hot lot = `purple.6` (`#722ed1`)
- Workload heatmap — safe = `green.3` (`#b7eb8f`), warning = `orange.3` (`#ffd591`), overload = `red.4` (`#ff7875`), idle = `blue.1` (`#e6f4ff`)

### 2.4 Neutrals — text / fill / background / border

| Token                  | Value                | Usage                                   |
| ---------------------- | -------------------- | --------------------------------------- |
| `colorText`            | `#262626` (override) | Primary body text                       |
| `colorTextSecondary`   | `rgba(0,0,0,0.65)`   | Secondary text                          |
| `colorTextTertiary`    | `rgba(0,0,0,0.45)`   | Captions, hints                         |
| `colorTextQuaternary`  | `rgba(0,0,0,0.25)`   | Disabled / placeholder                  |
| `colorTextDescription` | `rgba(0,0,0,0.45)`   | Description text                        |
| `colorTextLabel`       | `rgba(0,0,0,0.65)`   | Labels                                  |
| `colorTextHeading`     | `rgba(0,0,0,0.88)`   | Headings                                |
| `colorTextLightSolid`  | `#fff`               | Text on filled buttons                  |
| `colorBgLayout`        | `#bfbfbf` (override) | App-shell background                    |
| `colorBgContainer`     | `#ffffff`            | Panels, cards, tables                   |
| `colorBgElevated`      | `#ffffff`            | Dropdowns, popovers, modals             |
| `colorBgSpotlight`     | `rgba(0,0,0,0.85)`   | Tooltip bg                              |
| `colorBgMask`          | `rgba(0,0,0,0.45)`   | Modal overlay                           |
| `colorFill`            | `rgba(0,0,0,0.15)`   | Strong fill                             |
| `colorFillSecondary`   | `rgba(0,0,0,0.06)`   | Subtle fill                             |
| `colorFillTertiary`    | `rgba(0,0,0,0.04)`   | Hover surfaces                          |
| `colorFillQuaternary`  | `rgba(0,0,0,0.02)`   | Faintest fill (zebra rows)              |
| `colorFillAlter`       | `rgba(0,0,0,0.02)`   | Heatmap base / striped surface          |
| `colorBorder`          | `#d9d9d9`            | Default border                          |
| `colorBorderSecondary` | `#f0f0f0`            | Subtle border (cards, splitter borders) |
| `colorSplit`           | `rgba(5,5,5,0.06)`   | Hair splits between rows                |

### 2.5 Tailwind neutral ramp

Defined in `tailwind.config.js`:

| Class         | Hex       |
| ------------- | --------- |
| `neutral-50`  | `#ffffff` |
| `neutral-100` | `#fafafa` |
| `neutral-200` | `#f5f5f5` |
| `neutral-300` | `#f0f0f0` |
| `neutral-400` | `#d9d9d9` |
| `neutral-500` | `#bfbfbf` |
| `neutral-600` | `#8c8c8c` |
| `neutral-700` | `#595959` |
| `neutral-800` | `#434343` |
| `neutral-900` | `#262626` |
| `neutral-950` | `#000000` |

---

## 3. Typography

### 3.1 Font

| Token                  | Value                                   |
| ---------------------- | --------------------------------------- |
| `axFontFamily`         | `'Roboto', -apple-system, sans-serif`   |
| `token.fontFamilyCode` | `'SFMono-Regular', Consolas, monospace` |

Roboto weights loaded via `@fontsource/roboto` (100, 200, 300, 400, 500, 600, 700, 800, 900) — plus `roboto-math` and `roboto-latin` subsets.

### 3.2 Font sizes (AntD scale)

| Token              | Value       |
| ------------------ | ----------- |
| `fontSize`         | `14` (base) |
| `fontSizeSM`       | `12`        |
| `fontSizeLG`       | `16`        |
| `fontSizeXL`       | `20`        |
| `fontSizeIcon`     | `12`        |
| `fontSizeHeading1` | `38`        |
| `fontSizeHeading2` | `30`        |
| `fontSizeHeading3` | `24`        |
| `fontSizeHeading4` | `20`        |
| `fontSizeHeading5` | `16`        |

### 3.3 Line heights

| Token                | Value    |
| -------------------- | -------- |
| `lineHeight`         | `1.5714` |
| `lineHeightLG`       | `1.5`    |
| `lineHeightSM`       | `1.6667` |
| `lineHeightHeading1` | `1.2105` |
| `lineHeightHeading2` | `1.2667` |
| `lineHeightHeading3` | `1.3333` |
| `lineHeightHeading4` | `1.4`    |
| `lineHeightHeading5` | `1.5`    |
| `fontHeight`         | `22`     |
| `fontHeightSM`       | `20`     |
| `fontHeightLG`       | `24`     |

### 3.4 Font weights

| Token              | Value |
| ------------------ | ----- |
| `fontWeightStrong` | `600` |
| (Roboto) `regular` | `400` |
| (Roboto) `medium`  | `500` |
| (Roboto) `bold`    | `700` |

### 3.5 Practical type mapping

| Use case                | Tokens                                                                     |
| ----------------------- | -------------------------------------------------------------------------- |
| Page title              | `Typography.Title level={3}` (`fontSizeHeading3 = 24` / lineHeight 1.3333) |
| Panel header text       | `ax-display-panel_header_title_text` — `font-semibold`, 14px               |
| KPI value               | `Statistic value`, `fontSize: 22` (custom)                                 |
| Table cell              | `fontSize: 14`, `colorText`                                                |
| Captions / hints        | `fontSizeSM = 12`, `colorTextSecondary`                                    |
| Status tags             | `fontSizeSM = 12`                                                          |
| Inline mono / order IDs | `Typography.Text code` (uses `fontFamilyCode`)                             |

---

## 4. Spacing

### 4.1 Base unit and `size*` scale (from `token.ts`)

| Token      | Value | Usage                       |
| ---------- | ----- | --------------------------- |
| `sizeUnit` | `4`   | Atomic unit                 |
| `sizeStep` | `4`   | Step multiplier             |
| `sizeXXS`  | `4`   | Tiny gap (chip → label)     |
| `sizeXS`   | `8`   | Tight (icon → text)         |
| `sizeSM`   | `12`  | Compact (form field gap)    |
| `size`     | `16`  | Standard (card content gap) |
| `sizeMS`   | `16`  | —                           |
| `sizeMD`   | `20`  | Medium block gap            |
| `sizeLG`   | `24`  | Group gap                   |
| `sizeXL`   | `32`  | Section gap                 |
| `sizeXXL`  | `48`  | Hero / empty-state spacing  |

### 4.2 Padding scale

| Token                        | Value | Usage                                             |
| ---------------------------- | ----- | ------------------------------------------------- |
| `paddingXXS`                 | `4`   | Smallest cell padding                             |
| `paddingXS`                  | `8`   | Card / chip internal padding                      |
| `paddingSM`                  | `12`  | Field padding                                     |
| `padding`                    | `16`  | Default card padding (consumed by `createStyles`) |
| `paddingMD`                  | `20`  | Section padding                                   |
| `paddingLG`                  | `24`  | Hero block padding                                |
| `paddingXL`                  | `32`  | Modal padding                                     |
| `paddingContentHorizontal`   | `16`  | Inside content blocks                             |
| `paddingContentVertical`     | `12`  | Inside content blocks                             |
| `paddingContentHorizontalSM` | `16`  | Smaller blocks                                    |
| `paddingContentVerticalSM`   | `8`   | Smaller blocks                                    |
| `paddingContentHorizontalLG` | `24`  | Large blocks                                      |
| `paddingContentVerticalLG`   | `16`  | Large blocks                                      |
| `controlPaddingHorizontal`   | `12`  | Inputs / buttons                                  |
| `controlPaddingHorizontalSM` | `8`   | Small inputs                                      |

### 4.3 Margin scale

| Token       | Value |
| ----------- | ----- |
| `marginXXS` | `4`   |
| `marginXS`  | `8`   |
| `marginSM`  | `12`  |
| `margin`    | `16`  |
| `marginMD`  | `20`  |
| `marginLG`  | `24`  |
| `marginXL`  | `32`  |
| `marginXXL` | `48`  |

---

## 5. Layout

### 5.1 Implemented sizing

| Region             | Size                                                                   | Source                                                     |
| ------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| Top bar height     | `36px`                                                                 | `axTheme.components.Layout.headerHeight`                   |
| Top bar padding    | `0 6px`                                                                | `headerPadding`                                            |
| Left rail width    | `36px`                                                                 | `<Layout.Sider width={36}>` in `SimulationLayoutLeft.tsx`  |
| Right rail width   | `36px`                                                                 | `<Layout.Sider width={36}>` in `SimulationLayoutRight.tsx` |
| Bottom strip       | `8px` content row inside `Layout.Footer`                               | `SimulationLayoutBottom.tsx`                               |
| Footer padding     | `0 36px`                                                               | `footerPadding`                                            |
| Splitter gutter    | `2px` (default) or `4px` (Splitter override inside `SimulationLayout`) | `splitBarSize`                                             |
| Splitter trigger   | `16px` invisible hit area                                              | `splitTriggerSize`                                         |
| Main / right split | `70% / 30%` (normal), `50% / 50%` (Compare mode)                       | `SimulationLayout` `defaultSize`                           |

> The earlier MD3 draft mentioned a 56px top bar and a 240px expanded sidebar. The implementation uses a **dense 36px shell** — the rails are icon-only with tooltips, no expanded label state. Update mockups accordingly.

### 5.2 Breakpoints (from `token.ts`)

| Token        | Min    | Max    |
| ------------ | ------ | ------ |
| `screenXS`   | `480`  | `575`  |
| `screenSM`   | `576`  | `767`  |
| `screenMD`   | `768`  | `991`  |
| `screenLG`   | `992`  | `1199` |
| `screenXL`   | `1200` | `1599` |
| `screenXXL`  | `1600` | `1919` |
| `screenXXXL` | `1920` | —      |

> AntD's responsive grid (`<Row>` / `<Col xs sm md lg xl xxl>`) consumes these directly.

---

## 6. Control sizing

| Token                    | Value |
| ------------------------ | ----- |
| `controlHeight`          | `32`  |
| `controlHeightSM`        | `24`  |
| `controlHeightXS`        | `16`  |
| `controlHeightLG`        | `40`  |
| `controlInteractiveSize` | `16`  |
| `controlOutlineWidth`    | `2`   |
| `lineWidth`              | `1`   |
| `lineWidthBold`          | `2`   |
| `lineWidthFocus`         | `3`   |

> The Dynamic Schedule simulation panels favor `size="small"` AntD controls (24px height) to maximize data density.

---

## 7. Border Radius

| Token               | Value | Usage                             |
| ------------------- | ----- | --------------------------------- |
| `borderRadiusXS`    | `2`   | Status pips, mini bars            |
| `borderRadiusSM`    | `4`   | Buttons, tags, inputs, gantt bars |
| `borderRadius`      | `6`   | Default — cards, panels           |
| `borderRadiusLG`    | `8`   | Larger cards, modals              |
| `borderRadiusOuter` | `4`   | —                                 |

---

## 8. Elevation (Shadow)

| Token                                        | Value                                                                                             | Usage                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `boxShadow`                                  | `0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)` | Floating panels (popovers, dropdowns)  |
| `boxShadowSecondary`                         | same                                                                                              | —                                      |
| `boxShadowTertiary`                          | `0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)`     | Hairline lift (gantt bars, table rows) |
| `boxShadowCard`                              | `0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12), 0 5px 12px 4px rgba(0,0,0,0.09)`  | Cards                                  |
| `boxShadowDrawerRight/Left/Up/Down`          | directional drawer shadows                                                                        | Slide-out panels                       |
| `boxShadowPopoverArrow`                      | `2px 2px 5px rgba(0,0,0,0.05)`                                                                    | Popover arrow                          |
| `boxShadowTabsOverflowLeft/Right/Top/Bottom` | inset gradients                                                                                   | Tab overflow indicators                |

> No `dp2 / dp4 / dp8` MD3 layer naming — AntD ships use-case-specific shadow tokens.

---

## 9. Motion

### 9.1 Duration

| Token                | Value  | Usage                      |
| -------------------- | ------ | -------------------------- |
| `motionDurationFast` | `0.1s` | Tooltips, hovers, chip pop |
| `motionDurationMid`  | `0.2s` | Dropdowns, panel slides    |
| `motionDurationSlow` | `0.3s` | Modals, drawer enter/exit  |
| `motionUnit`         | `0.1`  | Base step                  |
| `motionBase`         | `0`    | —                          |
| `motion`             | `true` | Global motion enabled      |

### 9.2 Easing

| Token                 | Value                                    |
| --------------------- | ---------------------------------------- |
| `motionEaseOutCirc`   | `cubic-bezier(0.08, 0.82, 0.17, 1)`      |
| `motionEaseInOutCirc` | `cubic-bezier(0.78, 0.14, 0.15, 0.86)`   |
| `motionEaseOut`       | `cubic-bezier(0.215, 0.61, 0.355, 1)`    |
| `motionEaseInOut`     | `cubic-bezier(0.645, 0.045, 0.355, 1)`   |
| `motionEaseOutBack`   | `cubic-bezier(0.12, 0.4, 0.29, 1.46)`    |
| `motionEaseInBack`    | `cubic-bezier(0.71, -0.46, 0.88, 0.6)`   |
| `motionEaseInQuint`   | `cubic-bezier(0.755, 0.05, 0.855, 0.06)` |
| `motionEaseOutQuint`  | `cubic-bezier(0.23, 1, 0.32, 1)`         |

### 9.3 Common usage

| Interaction            | Duration             | Easing                |
| ---------------------- | -------------------- | --------------------- |
| Hover / focus tint     | `motionDurationFast` | `motionEaseInOut`     |
| Tooltip / popover      | `motionDurationMid`  | `motionEaseOutCirc`   |
| Dropdown / select menu | `motionDurationMid`  | `motionEaseOutCirc`   |
| Splitter resize        | none                 | —                     |
| Modal show/hide        | `motionDurationSlow` | `motionEaseInOutCirc` |
| Drawer slide           | `motionDurationSlow` | `motionEaseInOutCirc` |
| Skeleton shimmer       | `1.4s` infinite      | AntD default          |

---

## 10. Custom CSS Primitives (`_ax-shared.scss`)

These class-based primitives are tied to the Tailwind theme. They consume `ax-primary` and the `neutral-*` ramp directly — when brand colors change in `axColors`, mirror the change in `tailwind.config.js` so these stay aligned.

### 10.1 `ax-button`

```scss
.ax-button {
  @apply rounded-md cursor-pointer flex items-center justify-center;
  @apply bg-transparent text-inherit transition-colors duration-150 ease-in-out;

  &:hover {
    @apply bg-neutral-300;
  }
  &:active,
  &.is-active {
    @apply bg-neutral-500 text-white;
  }
}
```

### 10.2 `ax-menu-icon` (left/right rail icons)

```scss
.ax-menu-icon {
  @apply w-8 h-8 rounded-md cursor-pointer flex items-center justify-center;
  @apply bg-transparent text-inherit transition-colors duration-150 ease-in-out;

  &:hover {
    @apply bg-neutral-400;
  }
  &:active {
    @apply bg-neutral-600 text-white;
  }
  &.is-active {
    @apply bg-ax-primary text-white;
  }
}
```

| State             | Background              | Foreground |
| ----------------- | ----------------------- | ---------- |
| Rest              | transparent             | inherited  |
| Hover             | `neutral-400` (#d9d9d9) | —          |
| Active (pressed)  | `neutral-600` (#8c8c8c) | white      |
| Active (selected) | `ax-primary` (#3F51B5)  | white      |

### 10.3 `ax-menu-box` (top-bar dropdown trigger with label)

```scss
.ax-menu-box {
  @apply w-auto h-8 rounded-md cursor-pointer flex items-center justify-center gap-2 px-1;
  @apply bg-transparent text-neutral-800 transition-colors duration-150 ease-in-out;

  &:hover {
    @apply bg-neutral-400;
  }
  &:active {
    @apply bg-neutral-600 text-white;
  }
  &.is-active {
    @apply bg-ax-primary text-white;
  }
}
```

### 10.4 `ax-breadcrumb`

Height `h-7`, padded `px-1 pe-2`, hover `bg-neutral-400`, active selected = `bg-ax-primary text-white`.

### 10.5 `ax-display-panel` (main + sub panel chrome)

```scss
.ax-display-panel {
  @apply w-full h-full rounded bg-white;

  &_header {
    @apply w-full h-9 px-2 rounded-t;
    @apply flex items-center justify-between gap-2;
    @apply border-b border-gray-300;
    @apply text-neutral-800 bg-neutral-100;

    &_title_text {
      @apply text-ellipsis font-semibold;
    }
    &_option_button {
      @apply w-6 h-6 ax-button;
    }
  }

  &_body {
    height: calc(100% - 36px);
    @apply w-full rounded-b;
  }
}
```

| Slot                | Size                        |
| ------------------- | --------------------------- |
| Panel header height | `36px` (h-9)                |
| Panel header bg     | `neutral-100` (#fafafa)     |
| Panel header text   | `neutral-800` (#434343)     |
| Panel border        | `border-gray-300` (#d4d4d8) |
| Panel body          | `calc(100% - 36px)`, white  |
| Option button       | `24px × 24px` (`w-6 h-6`)   |

### 10.6 `ax-chat-item` / `ax-doc-item`

Same skeleton (rounded box with left text region + right icon button). Border `border-gray-400`, hover `bg-neutral-400`, active `bg-neutral-500 text-white`. Used by sidebar pickers (chat, document).

### 10.7 `ax-menu-divider`

```scss
.ax-menu-divider {
  @apply bg-gray-400;
}
```

Used to separate icon groups inside the left rail.

---

## 11. Status & Domain Color Mapping (Dynamic Schedule)

These are the **raw color values used inside the simulation panels** (chosen from the AntD palette because they sit outside semantic chip states). Centralize new ones here when adding to the UI.

### 11.1 Gantt bar status

| Status   | Color     | AntD token |
| -------- | --------- | ---------- |
| On-track | `#1677ff` | `blue.6`   |
| At-risk  | `#faad14` | `gold.6`   |
| Slipped  | `#f5222d` | `red.6`    |
| Hot lot  | `#722ed1` | `purple.6` |

### 11.2 Workload heatmap bands

| Band             | Color     | AntD token |
| ---------------- | --------- | ---------- |
| Idle (<40%)      | `#e6f4ff` | `blue.1`   |
| Safe (40–70%)    | `#b7eb8f` | `green.3`  |
| Warning (70–85%) | `#ffd591` | `orange.3` |
| Overload (>85%)  | `#ff7875` | `red.4`    |

### 11.3 Utilization bars

| Threshold | Color                 |
| --------- | --------------------- |
| ≤70%      | `#52c41a` (`green.6`) |
| 70–85%    | `#faad14` (`gold.6`)  |
| >85%      | `#f5222d` (`red.6`)   |

### 11.4 Suggestion / tune chips

| Variant            | Tag color                                  |
| ------------------ | ------------------------------------------ |
| Faster / +capacity | `green`                                    |
| Slower / −capacity | `orange`                                   |
| Confidence pill    | default (neutral)                          |
| Slip indicator     | `red` if ≥2d, `orange` if 1d, else `green` |
| Priority — HIGH    | `red`                                      |
| Priority — MED     | `orange`                                   |
| Priority — LOW     | default (neutral)                          |
| Hot-lot ★          | `purple`                                   |
| Custom NPI         | `cyan`                                     |

### 11.5 Status pills (Data Integration)

| Status         | Color    | Label          |
| -------------- | -------- | -------------- |
| Healthy        | `green`  | ● Healthy      |
| Delayed        | `orange` | ⚠ Delayed      |
| Stale          | `orange` | ⚠ Stale        |
| Down           | `red`    | ✗ Down         |
| Not configured | default  | Not configured |

---

## 12. Component Patterns Used

This catalog is **the implemented surface**, not a wish-list. When a new pattern is introduced, add it here.

| Component                                                      | Source                                                                                                      | Notes                                                        |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `AxDisplayPanel`                                               | `src/shared/display-panel/`                                                                                 | `type='main'                                                 | 'sub'` — wraps every panel in header + body with maximize/restore (main) or close (sub) |
| `AxMenuIcon`                                                   | `src/shared/menu-icon/`                                                                                     | Rail icon button, accepts `MdiIconName`                      |
| `AxMenuBox`                                                    | `src/shared/menu-box/`                                                                                      | Top-bar dropdown trigger with icon + label                   |
| `AxBreadcrumb`                                                 | `src/shared/breadcrumb/`                                                                                    | Breadcrumb chip                                              |
| `AxDocItem` / `AxChatItem`                                     | `src/shared/{doc-item,chat-item}/`                                                                          | Sidebar list items                                           |
| `AxIconBox`                                                    | `src/shared/icon-box/`                                                                                      | Icon wrapper                                                 |
| `AxScrollBox`                                                  | `src/shared/scroll-box/`                                                                                    | Scrollable container with custom track                       |
| AntD `Layout` / `Layout.Sider`                                 | shell composition                                                                                           | Header `36`, Sider `36`                                      |
| AntD `Splitter`                                                | gutter `splitBarSize=4`, trigger `16`                                                                       | Custom dragger styled via `createStyles`                     |
| AntD `Card` (`size='small'`)                                   | dashboards, recommendation cards                                                                            | Default body padding                                         |
| AntD `Table` (`size='small'`)                                  | PO list, sources list, tools table                                                                          | Use `rowClassName` for selected highlight                    |
| AntD `Descriptions` (`size='small'`, `bordered`, `column={2}`) | detail panes                                                                                                | —                                                            |
| AntD `Statistic`                                               | KPI cards                                                                                                   | Override `valueStyle={{ fontSize: 22 }}`                     |
| AntD `Tag`                                                     | status, priority chips                                                                                      | Use semantic colors (`green`/`orange`/`red`/`purple`/`cyan`) |
| AntD `Progress` (`size='small'`)                               | confidence bars                                                                                             | `style={{ width: 80 }}`                                      |
| AntD `Segmented` (`size='small'`, `block`)                     | tab switchers (Pending / Accepted / Sent)                                                                   | —                                                            |
| AntD `Select` (`size='small'`)                                 | horizon, filter, plan picker                                                                                | —                                                            |
| AntD `Button` (`size='small'`)                                 | toolbar / action row                                                                                        | Mix `type='primary'`, default, `type='text'`                 |
| AntD `Tooltip`                                                 | rail icons, bar hover                                                                                       | Default placement varies                                     |
| AntD `Collapse` (custom padding)                               | skipped recommendations                                                                                     | See `axTheme.components.Collapse`                            |
| AntD `Modal`                                                   | `SimulationPlanModal`, `ProductionLineModal`, plus app-level `account/setting/notify/guides/support` modals | width 480 default                                            |
| `antd-style` `createStyles(({ token }) => …)`                  | every panel                                                                                                 | Always reference `token.*`, never hard-code                  |
| MDI icons                                                      | `@mdi/js` via `AxMuiIcon`                                                                                   | Typed by `MdiIconName` (no string typos)                     |

---

## 13. Implementation Snippet

### 13.1 Consuming tokens in code

```tsx
// Inside a panel — antd-style createStyles
import { createStyles } from 'antd-style'

const useStyles = createStyles(({ token }) => ({
  root: {
    padding: token.padding, // 16
    background: token.colorBgContainer, // #ffffff
    border: `1px solid ${token.colorBorderSecondary}`, // #f0f0f0
    borderRadius: token.borderRadiusSM, // 4
  },
  active: {
    background: token.colorPrimaryBg, // #e6f4ff
    color: token.colorPrimary, // #3F51B5 (overridden)
  },
}))
```

```tsx
// Inside a component — useToken
import { theme } from 'antd'

const { token } = theme.useToken()
const cardStyle = { padding: token.paddingLG, background: token.colorBgContainer }
```

### 13.2 Tailwind utility usage

```tsx
<button className="ax-menu-icon is-active">          {/* bg-ax-primary */}
<div className="bg-neutral-100 text-neutral-800" />  {/* mirrors panel header */}
<span className="text-ax-error">…</span>             {/* #f44336 */}
```

### 13.3 i18n note

All visible strings should be added to `src/acore/i18n/locales/{en,ko}/<ns>.json`. The token doc lists English labels for reference only.

---

## 14. Accessibility

### 14.1 Color contrast spot-checks

| Combination                                                     | Ratio   | Pass                                            |
| --------------------------------------------------------------- | ------- | ----------------------------------------------- |
| `colorText` `#262626` on `colorBgContainer` `#ffffff`           | 13.6:1  | AAA                                             |
| `colorTextSecondary` `rgba(0,0,0,0.65)` on `#ffffff`            | ≈ 5.7:1 | AA                                              |
| `colorTextTertiary` `rgba(0,0,0,0.45)` on `#ffffff`             | ≈ 3.4:1 | AA Large only — use for non-essential captions  |
| `colorTextLightSolid` `#ffffff` on `axColors.primary` `#3F51B5` | 8.1:1   | AAA                                             |
| `axColors.primary` `#3F51B5` on `colorBgContainer` `#ffffff`    | 8.1:1   | AAA                                             |
| `axColors.success` `#4CAF50` on white                           | 2.7:1   | ❗ Below AA — pair with text label, not as text |
| `axColors.warning` `#FF9800` on white                           | 2.3:1   | ❗ Below AA — use background, not text          |
| `axColors.error` `#F44336` on white                             | 3.8:1   | AA Large                                        |

**Practice**: never rely on color alone for status — pair with icon + label (e.g. `✓ Healthy`, `⚠ Delayed`, `✗ Down`).

### 14.2 Focus

| Token                 | Value                 |
| --------------------- | --------------------- |
| `lineWidthFocus`      | `3`                   |
| `controlOutline`      | `rgba(5,145,255,0.1)` |
| `controlOutlineWidth` | `2`                   |

AntD components draw a focus ring from `colorPrimary` automatically; do not override unless making a custom interactive primitive.

### 14.3 Touch targets

| Target                                | Min                                                                                 |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| Standard control height               | 32px (`controlHeight`)                                                              |
| Small control height (dense surfaces) | 24px (`controlHeightSM`) — pair with hover-area padding when used on touch surfaces |
| Rail icon                             | 32px (`ax-menu-icon` `w-8 h-8`)                                                     |
| Tap-comfortable                       | 44–48px (consider for primary CTAs on touch devices)                                |

---

## 15. What changed vs. the v1 draft

| Area                         | v1 (MD3 draft)                       | v2 (this doc — implementation)                                                               |
| ---------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| Primary                      | `#1976D2` (MD3 blue)                 | `#3F51B5` (Indigo, `axColors.primary`)                                                       |
| Secondary                    | `#424242` neutral                    | `#009688` (Teal)                                                                             |
| Accent / AI                  | `#00BCD4` (Cyan)                     | `#673AB7` (Deep purple) as `tertiary`                                                        |
| Font UI                      | Inter                                | **Roboto**                                                                                   |
| Font data                    | JetBrains Mono                       | **SFMono / Consolas** via `fontFamilyCode`                                                   |
| Grid base                    | `4px` unit, `space.*` scale          | AntD `size*` + `padding*` + `margin*` scales (also `4px` base)                               |
| Elevation                    | `dp0 / dp2 / dp4 / dp8`              | AntD `boxShadow / boxShadowSecondary / boxShadowTertiary / boxShadowCard / boxShadowDrawer*` |
| Border radius                | `4 / 8 / 12 / pill / circle`         | `borderRadiusXS=2 / SM=4 / =6 / LG=8` (no 12px tier)                                         |
| Top bar                      | `56px`                               | **`36px`** (`headerHeight: 36`)                                                              |
| Sidebar collapsed / expanded | `64 / 240`                           | **`36` only** (icon rail, no expanded label state)                                           |
| Right panel                  | `280–480px`                          | **30% width** (resize via Splitter), **50%** in Compare mode                                 |
| Buttons                      | Custom 40px filled / outlined / text | AntD `Button` `size='small'` (24px), `default` (32px), `large` (40px)                        |
| Animation duration tokens    | `100 / 200 / 300 ms`                 | `motionDurationFast=0.1s / Mid=0.2s / Slow=0.3s` (same values, AntD names)                   |
| Easing                       | MD3 enter / exit / standard          | AntD `motionEase*Circ / Back / Quint / In(Out)`                                              |
| Dark mode section            | Detailed MD3 inversions              | **Deferred** — not yet wired in `axTheme`                                                    |

---

## 16. Maintenance checklist

When adding a new component, color, or surface:

- [ ] Use `theme.useToken()` or `createStyles(({ token }) => …)` — do not hard-code hex.
- [ ] If a brand color changes in `axColors`, mirror the change in `tailwind.config.js` (`ax-primary` / `ax-secondary` / `ax-tertiary` / `ax-error` / `ax-warning` / `ax-info` / `ax-success`).
- [ ] If a new domain status color is introduced (gantt bar variant, heatmap band, etc.), document it in §11.
- [ ] If a new panel pattern appears, register it in §12.
- [ ] Run `pnpm --filter ax-cowork-ui format && pnpm --filter ax-cowork-ui build && pnpm --filter ax-cowork-ui lint` before merging.

---

_This document is now the contract between Design and `packages/ax-cowork-ui`. The deprecated MD3 v1 draft remains in git history for reference, but **do not consume its values** when sketching new flows._
