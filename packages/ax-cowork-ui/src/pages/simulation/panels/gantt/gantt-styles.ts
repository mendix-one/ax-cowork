import type { LotStatus } from '../../data/mock-plan'

// Layout sizing — consumed both by SCSS (via inline styles applied from TS) and JS positioning math.
export const DAY_WIDTH = 56
export const SIDEBAR_TASK = 240
export const SIDEBAR_DATE = 100

// Status → bar fill colour. Kept in TS because bars get the colour via inline style.
export const STATUS_COLOR: Record<LotStatus, string> = {
  'on-track': '#1677ff',
  'at-risk': '#faad14',
  slipped: '#f5222d',
  'hot-lot': '#722ed1',
}

export const dayOffset = (date: string, anchor: string): number => {
  const a = new Date(anchor).getTime()
  const b = new Date(date).getTime()
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

export const utilColor = (u: number) => (u > 85 ? '#f5222d' : u > 70 ? '#faad14' : '#52c41a')
