import { DAILY_TOOL_GROUP_USAGE, TOOL_GROUP_CAPACITIES, TOOLING_CONSTRAINTS, type ToolingConstraint } from '../data/mock-plan'

// Per-tool-group OEE breakdown — illustrative numbers tuned per group's nominal utilisation.
// In a real wire-up these come from MES; here they shape the "Effective vs Theoretical" card.
export type OeeBreakdown = {
  theoretical: number // wafer-moves/day if everything ran 24/7
  effective: number // wafer-moves/day given availability × performance × quality
  availability: number // 0..1
  performance: number // 0..1
  quality: number // 0..1
  oee: number // availability * performance * quality
}

export const calcOee = (toolGroup: string): OeeBreakdown => {
  const cap = TOOL_GROUP_CAPACITIES.find((g) => g.name === toolGroup)
  const theoretical = cap ? Math.round(cap.total * 1.35) : 0
  // Tuned per group: HARC and Probe run hotter on PM/qual loss, BEOL/CMP run cleaner.
  const profile: Record<string, { a: number; p: number; q: number }> = {
    'HARC Etch': { a: 0.88, p: 0.92, q: 0.97 },
    'ONON CVD': { a: 0.92, p: 0.95, q: 0.98 },
    'FEOL Dep': { a: 0.94, p: 0.96, q: 0.99 },
    'WL Fill': { a: 0.95, p: 0.95, q: 0.99 },
    CMP: { a: 0.96, p: 0.97, q: 0.99 },
    BEOL: { a: 0.95, p: 0.97, q: 0.99 },
    Probe: { a: 0.89, p: 0.93, q: 0.96 },
    Asm: { a: 0.93, p: 0.96, q: 0.98 },
  }
  const def = profile[toolGroup] ?? { a: 0.9, p: 0.95, q: 0.97 }
  const oee = def.a * def.p * def.q
  return {
    theoretical,
    effective: cap?.total ?? Math.round(theoretical * oee),
    availability: def.a,
    performance: def.p,
    quality: def.q,
    oee,
  }
}

// Capacity vs demand timeline for a selected tool group.
// Capacity = effective daily ceiling (TOOL_GROUP_CAPACITIES.total).
// Demand = the deterministic daily usage curve from DAILY_TOOL_GROUP_USAGE.
// `over` flags whether demand crossed capacity that day — drives a red point overlay in the chart.
export type CapacityDemandPoint = {
  date: string
  capacity: number
  demand: number
  over: boolean
}

export const calcCapacityVsDemand = (toolGroup: string): CapacityDemandPoint[] => {
  const cap = TOOL_GROUP_CAPACITIES.find((g) => g.name === toolGroup)
  const capacity = cap?.total ?? 0
  return DAILY_TOOL_GROUP_USAGE.map((d) => {
    const demand = d.usage[toolGroup] ?? 0
    return { date: d.date, capacity, demand, over: demand > capacity }
  })
}

// Pull constraints that overlap a tool group, sorted by start date for chronological reading.
export const constraintsFor = (toolGroup: string): ToolingConstraint[] => {
  return TOOLING_CONSTRAINTS.filter((c) => c.toolGroup === toolGroup).sort((a, b) => a.start.localeCompare(b.start))
}

// All constraints, sorted — used by the "all-shop" constraint pane when no tool group filter is applied.
export const allConstraints = (): ToolingConstraint[] => [...TOOLING_CONSTRAINTS].sort((a, b) => a.start.localeCompare(b.start))
