import { TECH_ROUTINGS, TOOL_GROUP_CAPACITIES, type ProcessStep, type ProcessStepStage, type ProductionOrder, type TechRouting } from '../../data/mock-plan'

// Per-tech rollup against the currently-checked POs: PO count, total wafers in flight, total cycle time
// breakdown (processing vs move vs wait), end-to-end yield, and the worst-utilisation step.
export type TechSummary = {
  tech: string
  family: string
  description: string
  layers: number
  bitDensity: 'TLC' | 'QLC'
  poCount: number
  totalWafers: number
  totalCycleHours: number // sum of cycleHours (processing only)
  totalMoveHours: number // sum of movementHours across steps
  totalWaitHours: number // sum of waitHours across steps
  totalClockHours: number // cycle + move + wait — end-to-end wall-clock time
  endToEndYield: number
  bottleneckStep: string | null
}

const tg = (name: string) => TOOL_GROUP_CAPACITIES.find((g) => g.name === name)

// Rough bottleneck heuristic: pick the step whose tool group has the highest used/total ratio.
const findBottleneck = (routing: TechRouting): string | null => {
  let bestRatio = 0
  let bestStep: string | null = null
  for (const step of routing.steps) {
    const cap = tg(step.toolGroup)
    if (!cap || cap.total <= 0) continue
    const ratio = cap.used / cap.total
    if (ratio > bestRatio) {
      bestRatio = ratio
      bestStep = step.name
    }
  }
  return bestStep
}

export const calcTechSummaries = (orders: ProductionOrder[]): TechSummary[] => {
  return TECH_ROUTINGS.map((routing) => {
    let poCount = 0
    let totalWafers = 0
    for (const o of orders) {
      const hasMatch = o.schedule.some((f) => f.tech === routing.tech)
      if (!hasMatch) continue
      poCount += 1
      for (const f of o.schedule) {
        if (f.tech !== routing.tech) continue
        for (const b of f.batches) totalWafers += b.waferCount
      }
    }
    const totalCycleHours = routing.steps.reduce((s, st) => s + st.cycleHours, 0)
    const totalMoveHours = routing.steps.reduce((s, st) => s + st.movementHours, 0)
    const totalWaitHours = routing.steps.reduce((s, st) => s + st.waitHours, 0)
    const endToEndYield = routing.steps.reduce((y, st) => y * st.expectedYield, 1)
    return {
      tech: routing.tech,
      family: routing.family,
      description: routing.description,
      layers: routing.layers,
      bitDensity: routing.bitDensity,
      poCount,
      totalWafers,
      totalCycleHours,
      totalMoveHours,
      totalWaitHours,
      totalClockHours: totalCycleHours + totalMoveHours + totalWaitHours,
      endToEndYield,
      bottleneckStep: findBottleneck(routing),
    }
  })
}

// Per-stage rollup — groups the routing's steps by stage so the Pipeline view can render banners
// + nested step tiles. Stages are returned in the routing's natural order (first occurrence wins).
export type StageGroup = {
  stage: ProcessStepStage
  steps: ProcessStep[]
  totalCycleHours: number
  totalMoveHours: number
  totalWaitHours: number
}

export const calcStageGroups = (routing: TechRouting): StageGroup[] => {
  const map = new Map<ProcessStepStage, ProcessStep[]>()
  const order: ProcessStepStage[] = []
  for (const step of routing.steps) {
    if (!map.has(step.stage)) {
      map.set(step.stage, [])
      order.push(step.stage)
    }
    map.get(step.stage)!.push(step)
  }
  return order.map((stage) => {
    const steps = map.get(stage)!
    return {
      stage,
      steps,
      totalCycleHours: steps.reduce((s, st) => s + st.cycleHours, 0),
      totalMoveHours: steps.reduce((s, st) => s + st.movementHours, 0),
      totalWaitHours: steps.reduce((s, st) => s + st.waitHours, 0),
    }
  })
}

// Routing matrix — for each tech × tool group cell, the step(s) that use it.
// Used to render the "which tech needs which group" table at the bottom of the panel.
export type RoutingMatrixCell = {
  tech: string
  toolGroup: string
  stepNames: string[]
  cycleHours: number
}

export const calcRoutingMatrix = (): RoutingMatrixCell[][] => {
  return TECH_ROUTINGS.map((routing) => {
    return TOOL_GROUP_CAPACITIES.map((tgRow) => {
      const matching = routing.steps.filter((s) => s.toolGroup === tgRow.name)
      return {
        tech: routing.tech,
        toolGroup: tgRow.name,
        stepNames: matching.map((m) => m.name),
        cycleHours: matching.reduce((s, m) => s + m.cycleHours, 0),
      }
    })
  })
}

// Helper: format cycle hours as "Xh" or "Xd Yh" for human readability.
export const formatCycle = (hours: number): string => {
  if (hours < 24) return `${hours}h`
  const d = Math.floor(hours / 24)
  const h = hours % 24
  return h === 0 ? `${d}d` : `${d}d ${h}h`
}

// Helper: format yield as percent with one decimal.
export const formatYield = (y: number): string => `${(y * 100).toFixed(1)}%`
