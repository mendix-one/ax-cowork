import type { ScheduleClass } from '../data/mock-plan'
import type { FlatRow } from '../stores/order.store'

// Map a Production Requirements row to the simulation tree key so we can ask
// `simulation.checkedKeys` whether the row is currently included in the schedule.
// Simulation keys follow the patterns `pfg::<group>`, `pf::<group>::<pfId>`,
// `task::<group>::<pfId>::<taskId>`, `sub::<group>::<pfId>::<taskId>::<subId>`.
// At this layer we don't know the PFG of a row's family — the chips that *need* the key
// pass it down from the InfoPanel where the family object is in scope.

export const noteKeyForFamily = (pfId: string) => `pf::${pfId}`
export const noteKeyForTask = (taskId: string) => `task::${taskId}`
export const noteKeyForSubTask = (taskId: string, subId: string) => `sub::${taskId}::${subId}`

// State for a flat row — falls through to its own scheduleClass. (Exclude state needs the
// simulation key, which the InfoPanel builds where the family group is known.)
export const stateForRow = (row: FlatRow): ScheduleClass | undefined => {
  if (row.kind === 'bizGroup' || row.kind === 'bizTeam' || row.kind === 'pfg') return undefined
  return row.scheduleClass
}

// Format month-anchor (YYYY-MM) → "Jun 2027" for table cells.
export const formatMtoAnchor = (anchorYearMonth?: string): string => {
  if (!anchorYearMonth) return '—'
  const [y, m] = anchorYearMonth.split('-').map(Number)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[m - 1]} ${y}`
}
