import type { MilestoneState, ScheduleClass } from '../../data/mock-plan'

// Update 3 — canonical colour set for the Gantt panel.
export const AX_COLORS = {
  violation: '#f44336',
  highload: '#ff9800',
  normal: '#2196f3',
  capacity: '#73d13d',
  fixedSchedule: '#2f54eb',
  changesSchedule: '#1677ff',
  newSchedule: '#36cfc9',
} as const

// Bar fill colour by schedule class — applied via inline `task_class` (CSS) and tooltip styling.
export const SCHEDULE_COLOR: Record<ScheduleClass, string> = {
  fixed: AX_COLORS.fixedSchedule,
  changes: AX_COLORS.changesSchedule,
  new: AX_COLORS.newSchedule,
}

// Milestone marker colour by state.
export const MILESTONE_COLOR: Record<MilestoneState, string> = {
  new: AX_COLORS.newSchedule,
  normal: AX_COLORS.normal,
  late: AX_COLORS.highload,
  cannot: AX_COLORS.violation,
}

export const utilColor = (u: number) => (u > 85 ? AX_COLORS.violation : u > 80 ? AX_COLORS.highload : AX_COLORS.capacity)
