import { MOCK_ORG_DEMAND_BY_TEAM, MOCK_PRODUCTION_FAMILIES } from '../data/mock-plan'
import type { EpsStore } from './eps.store'

// Risk badge — a tiny dot on the sidebar nav indicating a panel has something worth attention.
export type RiskBadge = {
  count: number
  severity: 'warning' | 'critical'
  reason: string
}

const SAFE_THRESHOLD = 0.8

// Analysis — overload count across organization nodes (planned demand > headcount).
export const analysisRisk = (): RiskBadge | null => {
  const overloads = MOCK_ORG_DEMAND_BY_TEAM.filter((o) => o.demand > o.headcount)
  if (overloads.length === 0) return null
  return {
    count: overloads.length,
    severity: 'critical',
    reason: `${overloads.length} organization node${overloads.length > 1 ? 's' : ''} overloaded`,
  }
}

// Headcount Portfolio — same overload signal, separately surfaced.
export const capacityRisk = (_sim: EpsStore): RiskBadge | null => {
  void _sim
  const overloads = MOCK_ORG_DEMAND_BY_TEAM.filter((o) => o.demand > o.headcount)
  const high = MOCK_ORG_DEMAND_BY_TEAM.filter((o) => o.headcount > 0 && o.demand / o.headcount >= SAFE_THRESHOLD)
  if (overloads.length > 0)
    return { count: overloads.length, severity: 'critical', reason: `${overloads.length} org node${overloads.length > 1 ? 's' : ''} over headcount` }
  if (high.length > 0) return { count: high.length, severity: 'warning', reason: `${high.length} org node${high.length > 1 ? 's' : ''} highload` }
  return null
}

// Production Requirements — count of PFs with `scheduleClass === 'changes'` (modifications pending review).
export const orderRisk = (_sim: EpsStore): RiskBadge | null => {
  void _sim
  const changed = MOCK_PRODUCTION_FAMILIES.filter((p) => p.scheduleClass === 'changes').length
  if (changed === 0) return null
  return { count: changed, severity: 'warning', reason: `${changed} production famil${changed > 1 ? 'ies' : 'y'} with pending changes` }
}

// Engineering Process — same overload signal at the org level (process steps inherit org demand).
export const processRisk = (): RiskBadge | null => {
  const overloads = MOCK_ORG_DEMAND_BY_TEAM.filter((o) => o.demand > o.headcount)
  if (overloads.length === 0) return null
  return { count: overloads.length, severity: 'critical', reason: `${overloads.length} step${overloads.length > 1 ? 's' : ''} affected by org overload` }
}

// Process / Capacity tuning — pending suggestion count.
export const processTuningRisk = (sim: EpsStore): RiskBadge | null => {
  const count = sim.processTuning.pending.length
  if (count === 0) return null
  return { count, severity: 'warning', reason: `${count} pending process tune${count > 1 ? 's' : ''}` }
}

export const capacityTuningRisk = (sim: EpsStore): RiskBadge | null => {
  const count = sim.capacityTuning.pending.length
  if (count === 0) return null
  return { count, severity: 'warning', reason: `${count} pending capacity tune${count > 1 ? 's' : ''}` }
}
