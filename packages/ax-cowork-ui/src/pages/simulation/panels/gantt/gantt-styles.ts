import type { LotStatus } from '../../data/mock-plan'

// Bar fill colour by status. Consumed by the DHTMLX `task_class` template (via SCSS) and by quick-analysis helpers.
export const STATUS_COLOR: Record<LotStatus, string> = {
  'on-track': '#1677ff',
  'at-risk': '#faad14',
  slipped: '#f5222d',
  'hot-lot': '#722ed1',
}

export const utilColor = (u: number) => (u > 85 ? '#f5222d' : u > 70 ? '#faad14' : '#52c41a')
