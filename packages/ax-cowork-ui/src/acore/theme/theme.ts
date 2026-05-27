import { type ThemeConfig } from 'antd'
import type { AliasToken } from 'antd/es/theme/interface'
import antDToken from './token'
const myToken = { ...antDToken } as Partial<AliasToken>

export const axColors = {
  primary: '#3F51B5',
  secondary: '#009688',
  tertiary: '#673AB7',

  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  success: '#4CAF50',

  body: '#bfbfbf',
  panel: '#f5f5f5',
  action: '#434343',
} as const
export const axFontFamily = `'Roboto', -apple-system, sans-serif`

// === PLANNER DESIGN TOKENS ===========================================================================================
// Tokens shared by the Simulation page. Lives here (single source of truth) and is mirrored hex-for-hex in
// tailwind.config.js so SCSS, Tailwind utilities, and JS all agree. When extending, update both files.

// Priority palette — used on Production Order rows, Gantt label chips, anywhere a P1/P2/P3 lot is highlighted.
// Each priority has bg/border/text triplet calibrated for AA on white. Pair with a shape badge (letter) so it
// remains readable for color-vision-deficient users.
export const axPriority = {
  p1: { bg: '#fff1f0', border: '#ffa39e', text: '#cf1322', solid: '#f5222d' }, // hot — red
  p2: { bg: '#fff7e6', border: '#ffd591', text: '#d46b08', solid: '#fa8c16' }, // warm — orange
  p3: { bg: '#e6f4ff', border: '#91caff', text: '#0958d9', solid: '#1677ff' }, // normal — blue
  npi: { bg: '#e6fffb', border: '#87e8de', text: '#08979c', solid: '#13c2c2' }, // new product introduction — cyan
} as const

// Schedule-lineage palette — encodes whether a Gantt bar is fixed (already running), changes (edited from
// baseline), or new (added in this scenario). Saturation steps down from fixed → new so the eye is naturally
// pulled to the locked-in work.
export const axSchedule = {
  fixed: { bar: '#3f3d56', barText: '#ffffff', edge: '#1f1d36' }, // deep ink — locked
  changes: { bar: '#3f51b5', barText: '#ffffff', edge: '#283593' }, // brand indigo — edited
  new: { bar: '#26a69a', barText: '#ffffff', edge: '#00796b' }, // teal — proposed
  ghost: { bar: '#cfd8dc', barText: '#37474f', edge: '#90a4ae' }, // muted — filtered/hidden context
} as const

// Risk severity — used for badges, constraint pills, milestone marker tips.
export const axRisk = {
  ok: { bg: '#f6ffed', border: '#b7eb8f', text: '#389e0d', solid: '#52c41a' },
  info: { bg: '#e6f4ff', border: '#91caff', text: '#0958d9', solid: '#1677ff' },
  warning: { bg: '#fff7e6', border: '#ffd591', text: '#d46b08', solid: '#fa8c16' },
  critical: { bg: '#fff1f0', border: '#ffa39e', text: '#cf1322', solid: '#f5222d' },
} as const

// FHD-tuned density. Senior planners run on 1920×1080 (or 2560×1440 scaled to FHD) all day —
// AntD's default 14px / 32px control height eats vertical space, so the planner shell uses tighter rhythm.
export const axDensity = {
  fontSizeXS: 11,
  fontSizeSM: 12,
  fontSize: 13, // body
  fontSizeLG: 15,
  rowH: 28, // table/Gantt row
  rowHCompact: 24,
  headerH: 32, // panel header
  controlH: 28, // small button / input
  iconBtn: 28, // square icon button
  gutter: 8,
  gutterLG: 12,
  paddingPanel: 12,
} as const

myToken.colorPrimary = axColors.primary
myToken.fontFamily = axFontFamily

myToken.colorText = '#262626'
myToken.colorBgLayout = '#bfbfbf'

export const axTheme: ThemeConfig = {
  token: { ...myToken },
  components: {
    Layout: {
      headerHeight: '2.65rem',
      headerPadding: '0 0.45rem',
      footerPadding: '0 2.65rem',
      bodyBg: myToken.colorBgLayout,
      headerBg: myToken.colorBgLayout,
      footerBg: myToken.colorBgLayout,
      siderBg: myToken.colorBgLayout,
    },
    Splitter: {
      splitBarSize: 2,
    },
    Divider: {
      orientationMargin: 0,
      textPaddingInline: 0,
      verticalMarginInline: 0,
    },
  },
}
