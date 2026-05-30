import {
  HEADCOUNT_CAPACITY_LIMIT,
  HEADCOUNT_CAPACITY_SAFE,
  MOCK_DEMAND_MONTH_OFFSETS,
  MOCK_DEMAND_STAGE_CODES,
  MOCK_MONTHLY_DEMAND_BY_STAGE,
  MOCK_MTO_MILESTONES,
  MOCK_ORG_DEMAND_BY_DIVISION,
  MOCK_ORG_DEMAND_BY_TEAM,
  MOCK_PRODUCTION_FAMILIES,
  mtoLabel,
  productionFamilyById,
  type MilestoneState,
  type OrgDemandRow,
  type ProductionFamily,
} from '../data/mock-plan'

export const SAFE_THRESHOLD = 0.8

// === Totals =========================================================================================================
export type Totals = { pf: number; task: number; sub: number; spm: number }

export const calcTotals = (families: ProductionFamily[] = MOCK_PRODUCTION_FAMILIES): Totals => {
  let task = 0
  let sub = 0
  let spm = 0
  for (const pf of families) {
    for (const t of pf.tasks) {
      task += 1
      spm += t.spm
      for (const s of t.subTasks) {
        sub += 1
        spm += s.spm
      }
    }
  }
  return { pf: families.length, task, sub, spm }
}

// === Capacity stats (against MOCK_ORG_DEMAND_BY_TEAM totals) ========================================================
export type CapacityStats = {
  avgDemand: number
  safe: number
  limit: number
  avgVsSafePct: number
  avgVsLimitPct: number
  highloadOrg: string | null
  bottleneckOrg: string | null
}

export const calcCapacityStats = (): CapacityStats => {
  const totalDemand = MOCK_ORG_DEMAND_BY_DIVISION.reduce((s, r) => s + r.demand, 0)
  const avgDemand = MOCK_ORG_DEMAND_BY_DIVISION.length
    ? Math.round(totalDemand / MOCK_ORG_DEMAND_BY_DIVISION.length)
    : 0

  const violation = MOCK_ORG_DEMAND_BY_TEAM.find((r) => r.demand > r.headcount)
  const highloadOrg = violation?.label ?? null

  let bottleneckOrg: string | null = null
  let bestRatio = 0
  for (const r of MOCK_ORG_DEMAND_BY_TEAM) {
    const ratio = r.headcount > 0 ? r.demand / r.headcount : 0
    if (ratio > bestRatio) {
      bestRatio = ratio
      bottleneckOrg = r.label
    }
  }

  return {
    avgDemand,
    safe: HEADCOUNT_CAPACITY_SAFE,
    limit: HEADCOUNT_CAPACITY_LIMIT,
    avgVsSafePct: HEADCOUNT_CAPACITY_SAFE > 0 ? Math.round((avgDemand / HEADCOUNT_CAPACITY_SAFE) * 100) : 0,
    avgVsLimitPct: HEADCOUNT_CAPACITY_LIMIT > 0 ? Math.round((avgDemand / HEADCOUNT_CAPACITY_LIMIT) * 100) : 0,
    highloadOrg,
    bottleneckOrg,
  }
}

// === Violations =====================================================================================================
export type ViolationRow = { kind: 'violation' | 'highload'; org: OrgDemandRow; ratio: number }

export const calcViolations = (): ViolationRow[] => {
  const out: ViolationRow[] = []
  for (const o of MOCK_ORG_DEMAND_BY_TEAM) {
    if (o.headcount === 0) continue
    const ratio = o.demand / o.headcount
    if (o.demand > o.headcount) out.push({ kind: 'violation', org: o, ratio })
    else if (ratio >= SAFE_THRESHOLD) out.push({ kind: 'highload', org: o, ratio })
  }
  out.sort((a, b) => b.ratio - a.ratio)
  return out
}

// === Org heatmap (rows × MTO month offsets) =========================================================================
export type HeatBand = 'idle' | 'safe' | 'warning' | 'overload'
export type HeatmapCell = { bucket: string; ratio: number; band: HeatBand }
export type HeatmapRow = { org: string; cells: HeatmapCell[] }

const classify = (ratio: number): HeatBand => {
  if (ratio > 1) return 'overload'
  if (ratio >= 0.85) return 'warning'
  if (ratio >= 0.4) return 'safe'
  return 'idle'
}

export const calcHeatmap = (): HeatmapRow[] => {
  // For each Team, we approximate per-offset demand by uniformly distributing its `demand` across the
  // standard offsets. Capacity = headcount.
  return MOCK_ORG_DEMAND_BY_TEAM.map((o) => {
    const offsets = MOCK_DEMAND_MONTH_OFFSETS
    const perOffset = offsets.length > 0 ? o.demand / offsets.length : 0
    const cells: HeatmapCell[] = offsets.map((off) => {
      const ratio = o.headcount > 0 ? perOffset / o.headcount : 0
      return { bucket: mtoLabel(off), ratio, band: classify(ratio) }
    })
    return { org: o.label, cells }
  })
}

// === MTO milestone rows =============================================================================================
export type MilestoneRow = {
  pfId: string
  pfCode: string
  label: string
  date: string
  state: MilestoneState
  slipDays: number
  cause?: string
}

export const calcMilestoneRows = (): MilestoneRow[] => {
  const rows: MilestoneRow[] = []
  for (const m of MOCK_MTO_MILESTONES) {
    const pf = productionFamilyById(m.productionFamilyId)
    if (!pf) continue
    rows.push({
      pfId: pf.id,
      pfCode: pf.code,
      label: m.label,
      date: m.date,
      state: m.state,
      slipDays: m.slipDays ?? 0,
      cause: m.cause,
    })
  }
  rows.sort((a, b) => a.date.localeCompare(b.date))
  return rows
}

// === Family × Process matrix ========================================================================================
export type FamilyProcessRow = {
  pfId: string
  pfCode: string
  pfName: string
  stages: { stage: string; spm: number }[]
  totalSpm: number
}

export const calcFamilyProcessRows = (): FamilyProcessRow[] => {
  return MOCK_PRODUCTION_FAMILIES.map((pf) => {
    const perStage = new Map<string, number>()
    for (const t of pf.tasks) {
      const stage = t.processPath[0] ?? 'UNKNOWN'
      perStage.set(stage, (perStage.get(stage) ?? 0) + t.spm)
      for (const s of t.subTasks) perStage.set(stage, (perStage.get(stage) ?? 0) + s.spm)
    }
    return {
      pfId: pf.id,
      pfCode: pf.code,
      pfName: pf.name,
      stages: Array.from(perStage.entries()).map(([stage, spm]) => ({ stage, spm: Math.round(spm) })),
      totalSpm: Math.round(Array.from(perStage.values()).reduce((s, v) => s + v, 0)),
    }
  })
}

// Re-export the demand stage code list for convenience (charts iterate this).
export const ANALYSIS_STAGE_CODES = MOCK_DEMAND_STAGE_CODES
export const ANALYSIS_DEMAND_BY_OFFSET = MOCK_MONTHLY_DEMAND_BY_STAGE
