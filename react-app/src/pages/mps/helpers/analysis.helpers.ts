import type { ProductionOrder, ScheduleMilestone, ToolGroupCapacity } from '../data/mock-plan'
import { DAILY_TOOL_GROUP_USAGE, SHOP_FLOOR_CAPACITY_LIMIT, SHOP_FLOOR_CAPACITY_SAFE, TOOL_GROUP_CAPACITIES } from '../data/mock-plan'

type DailyUsageRow = (typeof DAILY_TOOL_GROUP_USAGE)[number]

export const SAFE_THRESHOLD = 0.8

// === Totals =========================================================================================================

export type Totals = { po: number; pf: number; mb: number }

export const calcTotals = (orders: ProductionOrder[]): Totals => {
  let pf = 0
  let mb = 0
  for (const o of orders) {
    pf += o.schedule.length
    for (const f of o.schedule) mb += f.batches.length
  }
  return { po: orders.length, pf, mb }
}

// === Shop-floor capacity stats =====================================================================================
// Aggregate daily per-tool-group usage to a single daily total, then average across the visible window.

export type CapacityStats = {
  avgDaily: number
  safe: number
  limit: number
  avgVsSafePct: number // % of safe threshold (100% means right at the safe line)
  avgVsLimitPct: number // % of capacity limit
  highloadGroup: string | null // first tool group whose usage exceeds total
  bottleneckGroup: string | null // tool group with highest avg utilisation across the window
}

const sumUsage = (row: DailyUsageRow['usage']): number => {
  let s = 0
  for (const v of Object.values(row)) s += v
  return s
}

const inRange = (date: string, start: string, end: string) => date >= start && date <= end

export const calcCapacityStats = (start: string, end: string): CapacityStats => {
  const window = DAILY_TOOL_GROUP_USAGE.filter((d) => inRange(d.date, start, end))
  const totalUsage = window.reduce((s, d) => s + sumUsage(d.usage), 0)
  const avgDaily = window.length ? Math.round(totalUsage / window.length) : 0

  // Per-tool-group average over the window — used to surface the bottleneck.
  const perGroupAvg = new Map<string, number>()
  for (const tg of TOOL_GROUP_CAPACITIES) {
    const sum = window.reduce((s, d) => s + (d.usage[tg.name] ?? 0), 0)
    perGroupAvg.set(tg.name, window.length ? sum / window.length : 0)
  }

  const violation = TOOL_GROUP_CAPACITIES.find((g) => g.used > g.total)
  const highloadGroup = violation?.name ?? null

  // Bottleneck = highest utilisation ratio against its own capacity (not absolute throughput).
  let bottleneckGroup: string | null = null
  let bestRatio = 0
  for (const tg of TOOL_GROUP_CAPACITIES) {
    const ratio = tg.total > 0 ? tg.used / tg.total : 0
    if (ratio > bestRatio) {
      bestRatio = ratio
      bottleneckGroup = tg.name
    }
  }

  return {
    avgDaily,
    safe: SHOP_FLOOR_CAPACITY_SAFE,
    limit: SHOP_FLOOR_CAPACITY_LIMIT,
    avgVsSafePct: SHOP_FLOOR_CAPACITY_SAFE > 0 ? Math.round((avgDaily / SHOP_FLOOR_CAPACITY_SAFE) * 100) : 0,
    avgVsLimitPct: SHOP_FLOOR_CAPACITY_LIMIT > 0 ? Math.round((avgDaily / SHOP_FLOOR_CAPACITY_LIMIT) * 100) : 0,
    highloadGroup,
    bottleneckGroup,
  }
}

// === Shipment / milestone summary ===================================================================================

export type ShipmentSummary = {
  totalWafersOut: number
  avgWafersPerMonth: number
  nextMilestone: { po: string; label: string; date: string; wafers: number } | null
}

export const calcShipmentSummary = (orders: ProductionOrder[], today: string): ShipmentSummary => {
  let totalWafersOut = 0
  let upcoming: { po: string; m: ScheduleMilestone } | null = null
  for (const o of orders) {
    for (const m of o.milestones) {
      totalWafersOut += m.shipmentWafers
      if (m.date >= today) {
        if (!upcoming || m.date < upcoming.m.date) upcoming = { po: o.id, m }
      }
    }
  }
  // Approximation: bucket commitments into the month they ship in, then average.
  const perMonth = new Map<string, number>()
  for (const o of orders) {
    for (const m of o.milestones) {
      const key = m.date.slice(0, 7) // "YYYY-MM"
      perMonth.set(key, (perMonth.get(key) ?? 0) + m.shipmentWafers)
    }
  }
  const months = perMonth.size || 1
  return {
    totalWafersOut,
    avgWafersPerMonth: Math.round(totalWafersOut / months),
    nextMilestone: upcoming ? { po: upcoming.po, label: upcoming.m.label, date: upcoming.m.date, wafers: upcoming.m.shipmentWafers } : null,
  }
}

// === Violations / high-load =========================================================================================

export type ViolationRow = {
  kind: 'violation' | 'highload'
  group: ToolGroupCapacity
  ratio: number
}

export const calcViolations = (): ViolationRow[] => {
  const rows: ViolationRow[] = []
  for (const g of TOOL_GROUP_CAPACITIES) {
    const ratio = g.used / g.total
    if (g.used > g.total) rows.push({ kind: 'violation', group: g, ratio })
    else if (ratio >= SAFE_THRESHOLD) rows.push({ kind: 'highload', group: g, ratio })
  }
  rows.sort((a, b) => b.ratio - a.ratio)
  return rows
}

// === Workload heatmap ===============================================================================================

export type HeatBand = 'idle' | 'safe' | 'warning' | 'overload'

export type HeatmapCell = { bucket: string; ratio: number; band: HeatBand }

export type HeatmapRow = { toolGroup: string; cells: HeatmapCell[] }

const classifyRatio = (ratio: number): HeatBand => {
  if (ratio > 1) return 'overload'
  if (ratio >= 0.85) return 'warning'
  if (ratio >= 0.4) return 'safe'
  return 'idle'
}

const bucketKey = (date: string, granularity: 'day' | 'month' | 'quarter' | 'year'): string => {
  // date is "YYYY-MM-DD"
  if (granularity === 'day') return date
  if (granularity === 'month') return date.slice(0, 7) // YYYY-MM
  if (granularity === 'year') return date.slice(0, 4) // YYYY
  // quarter: YYYY-Qn
  const month = Number(date.slice(5, 7))
  const q = Math.floor((month - 1) / 3) + 1
  return `${date.slice(0, 4)}-Q${q}`
}

export const calcHeatmap = (granularity: 'day' | 'month' | 'quarter' | 'year'): HeatmapRow[] => {
  // Group days into buckets per granularity, average each group's usage, ratio by per-group capacity.
  const rows: HeatmapRow[] = []
  for (const tg of TOOL_GROUP_CAPACITIES) {
    const buckets = new Map<string, number[]>()
    for (const d of DAILY_TOOL_GROUP_USAGE) {
      const k = bucketKey(d.date, granularity)
      const list = buckets.get(k) ?? []
      list.push(d.usage[tg.name] ?? 0)
      buckets.set(k, list)
    }
    const cells: HeatmapCell[] = Array.from(buckets.entries()).map(([bucket, vals]) => {
      const avg = vals.reduce((s, v) => s + v, 0) / vals.length
      const ratio = tg.total > 0 ? avg / tg.total : 0
      return { bucket, ratio, band: classifyRatio(ratio) }
    })
    rows.push({ toolGroup: tg.name, cells })
  }
  return rows
}

// === Shipment milestone analysis ====================================================================================

export type MilestoneRow = {
  poId: string
  customerShort: string
  label: string
  date: string
  wafers: number
  state: ScheduleMilestone['state']
  slipDays: number
  cause?: string
  pfList: string[]
}

export const calcMilestoneRows = (orders: ProductionOrder[]): MilestoneRow[] => {
  const rows: MilestoneRow[] = []
  for (const o of orders) {
    for (const m of o.milestones) {
      rows.push({
        poId: o.id,
        customerShort: o.customerShort,
        label: m.label,
        date: m.date,
        wafers: m.shipmentWafers,
        state: m.state,
        slipDays: m.slipDays ?? 0,
        cause: m.cause,
        pfList: (m.commitments ?? []).map((c) => c.pf),
      })
    }
  }
  rows.sort((a, b) => a.date.localeCompare(b.date))
  return rows
}

// === Production Family — Spec / Tech analysis ======================================================================
// Group PFs by tech-code (proxy for spec) and aggregate batches + wafers + duration.

export type FamilyTechRow = {
  tech: string
  family: string
  poCount: number
  batchCount: number
  totalWafers: number
  earliestStart: string
  latestEnd: string
}

export const calcFamilyTechRows = (orders: ProductionOrder[]): FamilyTechRow[] => {
  const acc = new Map<string, FamilyTechRow>()
  for (const o of orders) {
    for (const f of o.schedule) {
      const key = `${f.tech}::${f.label}`
      const row = acc.get(key) ?? {
        tech: f.tech,
        family: f.label,
        poCount: 0,
        batchCount: 0,
        totalWafers: 0,
        earliestStart: f.start,
        latestEnd: f.end,
      }
      row.poCount += 1
      row.batchCount += f.batches.length
      row.totalWafers += f.batches.reduce((s, b) => s + b.waferCount, 0)
      if (f.start < row.earliestStart) row.earliestStart = f.start
      if (f.end > row.latestEnd) row.latestEnd = f.end
      acc.set(key, row)
    }
  }
  return Array.from(acc.values()).sort((a, b) => b.totalWafers - a.totalWafers)
}
