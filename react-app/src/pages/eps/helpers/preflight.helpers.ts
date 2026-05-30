import { MOCK_ORG_DEMAND_BY_TEAM, MOCK_PRODUCTION_FAMILIES, type ProductionFamily } from '../data/mock-plan'

// Pre-flight check — runs before Save. Surfaces capacity overloads + empty production families.
export type PreflightSeverity = 'pass' | 'warning' | 'critical'

export type PreflightFinding = {
  id: string
  severity: PreflightSeverity
  category: 'capacity' | 'constraint' | 'shape'
  title: string
  detail: string
  drillTarget?: { kind: 'orgNode'; id: string } | { kind: 'pf'; id: string }
}

export type PreflightArgs = {
  families?: ProductionFamily[]
}

export const runPreflight = ({ families = MOCK_PRODUCTION_FAMILIES }: PreflightArgs = {}): PreflightFinding[] => {
  const out: PreflightFinding[] = []

  // 1. Org node overload — planned SPM > available headcount.
  for (const o of MOCK_ORG_DEMAND_BY_TEAM) {
    if (o.headcount === 0) continue
    const ratio = o.demand / o.headcount
    if (o.demand > o.headcount) {
      out.push({
        id: `cap-${o.label}`,
        severity: 'critical',
        category: 'capacity',
        title: `${o.label} overloaded`,
        detail: `Demand ${o.demand} P/M exceeds headcount ${o.headcount} P/M.`,
        drillTarget: { kind: 'orgNode', id: o.ref.teamId ?? o.ref.divisionId },
      })
    } else if (ratio >= 0.95) {
      out.push({
        id: `cap-near-${o.label}`,
        severity: 'warning',
        category: 'capacity',
        title: `${o.label} near limit`,
        detail: `Demand ${o.demand} P/M is within 5% of headcount ${o.headcount} P/M.`,
        drillTarget: { kind: 'orgNode', id: o.ref.teamId ?? o.ref.divisionId },
      })
    }
  }

  // 2. Shape check — every PF must have at least one Task.
  for (const pf of families) {
    if (pf.tasks.length === 0) {
      out.push({
        id: `shape-${pf.id}`,
        severity: 'warning',
        category: 'shape',
        title: `${pf.code} has no tasks`,
        detail: 'After current edits this Production Family has no engineering tasks.',
        drillTarget: { kind: 'pf', id: pf.id },
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
