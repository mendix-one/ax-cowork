import { DAILY_TOOL_GROUP_USAGE, TOOL_GROUP_CAPACITIES, TOOLING_CONSTRAINTS, type ProductionOrder, type ToolingConstraint } from '../data/mock-plan'

// A pre-flight check evaluates the current plan against constraints + capacity. The result feeds the
// "Save" confirmation modal so the planner can spot issues before persisting.
//
// Severity ladder:
//   • pass     — green, informational only
//   • warning  — orange, planner should look but can proceed
//   • critical — red, planner *probably* shouldn't proceed; Save-anyway still allowed (concept-level)

export type PreflightSeverity = 'pass' | 'warning' | 'critical'

export type PreflightFinding = {
  id: string
  severity: PreflightSeverity
  category: 'capacity' | 'constraint' | 'shape'
  title: string
  detail: string
  // Optional pointer for a "Fix" affordance — caller maps it to navigateTo* on the simulation store.
  drillTarget?: { kind: 'toolGroup'; name: string } | { kind: 'order'; id: string }
}

const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => aStart <= bEnd && bStart <= aEnd

export type PreflightArgs = {
  orders: ProductionOrder[]
}

export const runPreflight = ({ orders }: PreflightArgs): PreflightFinding[] => {
  const out: PreflightFinding[] = []

  // 1. Capacity overload — per tool group, peak daily demand vs total capacity.
  for (const tg of TOOL_GROUP_CAPACITIES) {
    let peak = 0
    let peakDate = ''
    for (const day of DAILY_TOOL_GROUP_USAGE) {
      const v = day.usage[tg.name] ?? 0
      if (v > peak) {
        peak = v
        peakDate = day.date
      }
    }
    if (peak > tg.total) {
      out.push({
        id: `cap-${tg.name}`,
        severity: 'critical',
        category: 'capacity',
        title: `${tg.name} overloaded`,
        detail: `Peak demand ${peak} on ${peakDate} exceeds capacity ${tg.total}.`,
        drillTarget: { kind: 'toolGroup', name: tg.name },
      })
    } else if (peak / tg.total >= 0.95) {
      out.push({
        id: `cap-near-${tg.name}`,
        severity: 'warning',
        category: 'capacity',
        title: `${tg.name} near limit`,
        detail: `Peak demand ${peak} on ${peakDate} is within 5% of capacity ${tg.total}.`,
        drillTarget: { kind: 'toolGroup', name: tg.name },
      })
    }
  }

  // 2. Constraint overlap — every new/changed batch checked against PM windows / downtime / recipe lock.
  const blockingKinds: ToolingConstraint['kind'][] = ['pm', 'downtime', 'recipe-lock']
  for (const order of orders) {
    for (const family of order.schedule) {
      for (const batch of family.batches) {
        if (batch.scheduleClass === 'fixed') continue
        const stepGroup = batch.toolGroup ?? null
        // Match constraints whose tool group plausibly affects this family/batch. Without a per-step tool
        // mapping in the mock, we conservatively check tool groups that match the family's tech namespace.
        const candidates = TOOLING_CONSTRAINTS.filter(
          (c) => blockingKinds.includes(c.kind) && (stepGroup ? c.toolGroup === stepGroup : true) && overlaps(batch.start, batch.end, c.start, c.end),
        )
        for (const c of candidates) {
          out.push({
            id: `cons-${order.id}-${family.id}-${batch.id}-${c.id}`,
            severity: c.severity === 'critical' ? 'critical' : 'warning',
            category: 'constraint',
            title: `${order.id} / ${family.label} / ${batch.name} overlaps ${c.title}`,
            detail: `Batch window ${batch.start} → ${batch.end} overlaps ${c.kind.toUpperCase()} on ${c.toolGroup} (${c.start} → ${c.end}).`,
            drillTarget: { kind: 'order', id: order.id },
          })
        }
      }
    }
  }

  // 3. Shape check — every PO must have at least one family with batches.
  for (const order of orders) {
    const hasBatches = order.schedule.some((f) => f.batches.length > 0)
    if (!hasBatches) {
      out.push({
        id: `shape-${order.id}-empty`,
        severity: 'warning',
        category: 'shape',
        title: `${order.id} has no batches`,
        detail: 'After current edits this PO has no scheduled batches. Save will publish an empty PO.',
        drillTarget: { kind: 'order', id: order.id },
      })
    }
  }

  return out
}

export const summarize = (findings: PreflightFinding[]) => {
  const critical = findings.filter((f) => f.severity === 'critical').length
  const warning = findings.filter((f) => f.severity === 'warning').length
  return { critical, warning, total: findings.length, ok: critical === 0 && warning === 0 }
}
