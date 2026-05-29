import { makeAutoObservable } from 'mobx'
import { MOCK_PRODUCTION_FAMILIES, MOCK_ORG_DEMAND_BY_TEAM } from '../data/mock-plan'

// Compare mode: Plan A (live) vs Plan B (candidate). Plan B is a *seeded variation* of the live data so
// the diff reads consistently for the concept demo.

export type DiffEntry = {
  id: string
  text: string
  reason: string
  weight: number
}

export type PlanSnapshot = {
  planId: string
  totalSpm: number
  taskCount: number
  atRiskPfCount: number
  endDate: string
  bottleneckOrg: string
}

const sumSpm = () =>
  MOCK_PRODUCTION_FAMILIES.reduce(
    (s, pf) => s + pf.tasks.reduce((ss, t) => ss + t.spm + t.subTasks.reduce((sss, x) => sss + x.spm, 0), 0),
    0,
  )
const countTasks = () => MOCK_PRODUCTION_FAMILIES.reduce((s, pf) => s + pf.tasks.length, 0)
const countAtRisk = () => MOCK_PRODUCTION_FAMILIES.filter((p) => p.scheduleClass === 'changes').length
const maxEnd = () =>
  MOCK_PRODUCTION_FAMILIES.flatMap((p) => p.tasks).reduce((a, t) => (t.end > a ? t.end : a), '')

const VARIATIONS: Record<string, { spmMul: number; atRiskDelta: number; endShiftDays: number; bottleneck: string }> = {
  'plan-a': { spmMul: 1.0, atRiskDelta: 0, endShiftDays: 0, bottleneck: MOCK_ORG_DEMAND_BY_TEAM[0]?.label ?? '—' },
  'plan-b': { spmMul: 0.95, atRiskDelta: -1, endShiftDays: -3, bottleneck: MOCK_ORG_DEMAND_BY_TEAM[1]?.label ?? '—' },
  'plan-c': { spmMul: 1.05, atRiskDelta: 1, endShiftDays: 7, bottleneck: MOCK_ORG_DEMAND_BY_TEAM[2]?.label ?? '—' },
  published: { spmMul: 0.92, atRiskDelta: 1, endShiftDays: 14, bottleneck: MOCK_ORG_DEMAND_BY_TEAM[0]?.label ?? '—' },
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
    totalSpm: Math.round(sumSpm() * v.spmMul),
    taskCount: countTasks(),
    atRiskPfCount: Math.max(0, countAtRisk() + v.atRiskDelta),
    endDate: shiftDate(maxEnd(), v.endShiftDays),
    bottleneckOrg: v.bottleneck,
  }
}

const DIFFS_PLAN_B: DiffEntry[] = [
  { id: 'd1', text: 'NPU RTL Design pulled in 6 weeks', reason: 'capacity freed', weight: -2 },
  { id: 'd2', text: 'Post-Si validation team rebalanced to AV Cell', reason: 'skill match', weight: -1 },
]
const DIFFS_PUBLISHED: DiffEntry[] = [
  { id: 'd1', text: 'MTO(0) slipped to 2027-08 (+2 months)', reason: 'PnR timing closure', weight: 2 },
]

const diffsFor = (planId: string): DiffEntry[] => (planId === 'published' ? DIFFS_PUBLISHED : DIFFS_PLAN_B)

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
