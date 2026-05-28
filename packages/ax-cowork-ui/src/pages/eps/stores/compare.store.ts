import { makeAutoObservable } from 'mobx'
import { MOCK_PRODUCTION_ORDERS, type ProductionOrder } from '../data/mock-plan'

// Compare mode is conceptually "Plan A (the live one) vs Plan B (a candidate)". For this concept iteration
// Plan B is a *seeded variation* of the same MOCK_PRODUCTION_ORDERS — the variation strategy is captured
// per plan id so the diff is meaningful and reproducible (not random).

export type DiffEntry = {
  id: string
  text: string
  reason: string
  // delta for sorting (positive = worse, negative = better than Plan A); informational only.
  weight: number
}

// Per-plan KPI snapshot — drives the diff strip at the top of the compare panel.
export type PlanSnapshot = {
  planId: string
  committed: number
  out: number
  atRiskPoCount: number
  endDate: string
  bottleneckGroup: string
}

const sumWafersOut = (orders: ProductionOrder[]) => orders.reduce((s, o) => s + o.outWafers, 0)
const sumCommitted = (orders: ProductionOrder[]) => orders.reduce((s, o) => s + o.qty, 0)
const countAtRisk = (orders: ProductionOrder[]) => orders.filter((o) => o.status === 'at-risk' || o.status === 'slipped').length
const maxEnd = (orders: ProductionOrder[]) => orders.reduce((a, o) => (o.end > a ? o.end : a), orders[0]?.end ?? '')

// Lightweight "variation" — multiplicative tweaks applied per plan id so each plan diffs differently.
const VARIATIONS: Record<string, { committedMul: number; outMul: number; atRiskDelta: number; endShiftDays: number; bottleneck: string }> = {
  'plan-a': { committedMul: 1.0, outMul: 1.0, atRiskDelta: 0, endShiftDays: 0, bottleneck: 'HARC Etch' },
  'plan-b': { committedMul: 1.0, outMul: 1.08, atRiskDelta: -2, endShiftDays: -1, bottleneck: 'WL Fill' },
  'plan-c': { committedMul: 0.95, outMul: 0.98, atRiskDelta: -1, endShiftDays: -2, bottleneck: 'BEOL' },
  published: { committedMul: 1.0, outMul: 0.96, atRiskDelta: 1, endShiftDays: 2, bottleneck: 'HARC Etch' },
}

const shiftDate = (date: string, days: number): string => {
  if (!date) return date
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export const snapshotFor = (planId: string): PlanSnapshot => {
  const v = VARIATIONS[planId] ?? VARIATIONS['plan-a']
  return {
    planId,
    committed: Math.round(sumCommitted(MOCK_PRODUCTION_ORDERS) * v.committedMul),
    out: Math.round(sumWafersOut(MOCK_PRODUCTION_ORDERS) * v.outMul),
    atRiskPoCount: Math.max(0, countAtRisk(MOCK_PRODUCTION_ORDERS) + v.atRiskDelta),
    endDate: shiftDate(maxEnd(MOCK_PRODUCTION_ORDERS), v.endShiftDays),
    bottleneckGroup: v.bottleneck,
  }
}

// Mock diff entries — three flavors so the planner sees variety in a Plan B vs Plan A diff.
const DIFFS_PLAN_B: DiffEntry[] = [
  { id: 'd1', text: 'PO-119 HARC ETC-44 chamber B → ETC-07 chamber A', reason: 'chamber drift', weight: -2 },
  { id: 'd2', text: 'PO-120 HARC start 05-08 → 05-09 (+1d)', reason: 'capacity', weight: 1 },
  { id: 'd3', text: 'PO-118 M1 on time, no change', reason: '—', weight: 0 },
  { id: 'd4', text: 'PO-122 WL ETC-44 → ETC-09', reason: 'qual expiry', weight: -1 },
  { id: 'd5', text: 'PO-123 BEOL start 05-12 → 05-13', reason: 'sequencing', weight: 1 },
]
const DIFFS_PLAN_C: DiffEntry[] = [
  { id: 'd1', text: 'PO-119 commitment 8,000 → 7,600 wafers', reason: 'cost-opt cutback', weight: -1 },
  { id: 'd2', text: 'PO-121 deferred B-3 to next cycle', reason: 'BEOL contention', weight: -1 },
  { id: 'd3', text: 'PO-118 M1 brought forward 1d', reason: 'opportunistic', weight: -1 },
]
const DIFFS_PUBLISHED: DiffEntry[] = [
  { id: 'd1', text: 'PO-119 M1 slipped 05-12 → 05-14 (+2d)', reason: 'HARC overload', weight: 2 },
  { id: 'd2', text: 'PO-120 status flipped → ON HOLD', reason: 'qual gap', weight: 2 },
]

const diffsFor = (planId: string): DiffEntry[] => {
  if (planId === 'plan-c') return DIFFS_PLAN_C
  if (planId === 'published') return DIFFS_PUBLISHED
  return DIFFS_PLAN_B
}

export class CompareStore {
  leftPlanId = 'published'
  rightPlanId = 'plan-b'

  constructor() {
    makeAutoObservable(this)
  }

  setLeftPlan(id: string) {
    this.leftPlanId = id
  }

  setRightPlan(id: string) {
    this.rightPlanId = id
  }

  get leftSnapshot(): PlanSnapshot {
    return snapshotFor(this.leftPlanId)
  }

  get rightSnapshot(): PlanSnapshot {
    return snapshotFor(this.rightPlanId)
  }

  get diffs(): DiffEntry[] {
    return diffsFor(this.rightPlanId)
  }
}
