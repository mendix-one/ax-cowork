import { TOOL_GROUP_CAPACITIES, TOOLING_CONSTRAINTS } from '../data/mock-plan'
import type { MpsStore } from './mps.store'

// Risk badge — a tiny dot on the sidebar nav indicating a panel has something worth attention.
//   • severity 'warning' → orange dot
//   • severity 'critical' → red dot
// The count is optional and rendered next to the dot for the planner to gauge volume.
export type RiskBadge = {
  count: number
  severity: 'warning' | 'critical'
  reason: string
}

const SAFE_THRESHOLD = 0.8

// Number of days from `today` we treat as "imminent" for constraint risk.
const IMMINENT_DAYS = 7

const isWithinDays = (dateA: string, dateB: string, days: number) => {
  const a = new Date(dateA).getTime()
  const b = new Date(dateB).getTime()
  return Math.abs(a - b) <= days * 24 * 60 * 60 * 1000
}

const constraintsInWindow = (today: string) => {
  return TOOLING_CONSTRAINTS.filter((c) => {
    // imminent = ends in the past 7 days OR starts in the next 7 days from "today"
    return isWithinDays(c.start, today, IMMINENT_DAYS) || isWithinDays(c.end, today, IMMINENT_DAYS)
  })
}

// Analysis — overload count across tool groups (used > total).
export const analysisRisk = (): RiskBadge | null => {
  const overloads = TOOL_GROUP_CAPACITIES.filter((g) => g.used > g.total)
  if (overloads.length === 0) return null
  return {
    count: overloads.length,
    severity: 'critical',
    reason: `${overloads.length} tool group${overloads.length > 1 ? 's' : ''} overloaded`,
  }
}

// Shop Floor — critical or warning constraints active within the imminent window.
export const shopFloorRisk = (sim: MpsStore): RiskBadge | null => {
  const today = sim.gantt.today
  const imminent = constraintsInWindow(today)
  const critical = imminent.filter((c) => c.severity === 'critical')
  if (critical.length > 0) {
    return { count: critical.length, severity: 'critical', reason: `${critical.length} critical constraint${critical.length > 1 ? 's' : ''} in the next ${IMMINENT_DAYS} days` }
  }
  const warnings = imminent.filter((c) => c.severity === 'warning')
  if (warnings.length > 0) {
    return { count: warnings.length, severity: 'warning', reason: `${warnings.length} warning constraint${warnings.length > 1 ? 's' : ''} in the next ${IMMINENT_DAYS} days` }
  }
  return null
}

// Production Order — at-risk + slipped POs visible in the current selection.
export const productionOrderRisk = (sim: MpsStore): RiskBadge | null => {
  const orders = sim.productionOrder.filteredOrders
  const slipped = orders.filter((o) => o.status === 'slipped').length
  const atRisk = orders.filter((o) => o.status === 'at-risk').length
  if (slipped > 0) return { count: slipped + atRisk, severity: 'critical', reason: `${slipped} slipped, ${atRisk} at-risk` }
  if (atRisk > 0) return { count: atRisk, severity: 'warning', reason: `${atRisk} at-risk PO${atRisk > 1 ? 's' : ''}` }
  return null
}

// Production Processes — bottleneck step exists when any tool group hits >= SAFE_THRESHOLD utilization.
// The "critical" tier means an overload that the process touches (i.e. visible to that tech).
export const productionProcessRisk = (): RiskBadge | null => {
  const overloads = TOOL_GROUP_CAPACITIES.filter((g) => g.used > g.total)
  if (overloads.length > 0) return { count: overloads.length, severity: 'critical', reason: `${overloads.length} step${overloads.length > 1 ? 's' : ''} hit overloaded tool group${overloads.length > 1 ? 's' : ''}` }
  const high = TOOL_GROUP_CAPACITIES.filter((g) => g.used / g.total >= SAFE_THRESHOLD)
  if (high.length > 0) return { count: high.length, severity: 'warning', reason: `${high.length} high-load step${high.length > 1 ? 's' : ''}` }
  return null
}

// Process / Capacity tuning — pending suggestion count.
export const processTuningRisk = (sim: MpsStore): RiskBadge | null => {
  const count = sim.processTuning.pending.length
  if (count === 0) return null
  return { count, severity: 'warning', reason: `${count} pending process tune${count > 1 ? 's' : ''}` }
}

export const capacityTuningRisk = (sim: MpsStore): RiskBadge | null => {
  const count = sim.capacityTuning.pending.length
  if (count === 0) return null
  return { count, severity: 'warning', reason: `${count} pending capacity tune${count > 1 ? 's' : ''}` }
}
