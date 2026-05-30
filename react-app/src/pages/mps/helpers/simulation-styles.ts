import { axRisk, axSchedule } from '@/acore/theme/theme'
import type { MilestoneState, ScheduleClass } from '../data/mock-plan'

// Single source of truth for Gantt colors — re-exports the planner theme so SCSS, JS, and Tailwind agree.
// If the palette changes, edit src/acore/theme/theme.ts (axSchedule / axRisk) and tailwind.config.js together.
export const AX_COLORS = {
  violation: axRisk.critical.solid,
  highload: axRisk.warning.solid,
  normal: axRisk.info.solid,
  capacity: axRisk.ok.solid,
  fixedSchedule: axSchedule.fixed.bar,
  changesSchedule: axSchedule.changes.bar,
  newSchedule: axSchedule.new.bar,
} as const

// Bar fill colour by schedule class — kept in sync with the SCSS overrides under .ax-mps-simulation-row__<cls>.
export const SCHEDULE_COLOR: Record<ScheduleClass, string> = {
  fixed: axSchedule.fixed.bar,
  changes: axSchedule.changes.bar,
  new: axSchedule.new.bar,
}

// Milestone marker colour by state.
export const MILESTONE_COLOR: Record<MilestoneState, string> = {
  new: axSchedule.new.bar,
  normal: axRisk.info.solid,
  late: axRisk.warning.solid,
  cannot: axRisk.critical.solid,
}

export const utilColor = (u: number) => (u > 85 ? AX_COLORS.violation : u > 80 ? AX_COLORS.highload : AX_COLORS.capacity)
