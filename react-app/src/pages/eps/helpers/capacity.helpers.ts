import {
  MOCK_FLAT_CELLS,
  MOCK_PRODUCTION_FAMILIES,
  MTO_OFFSETS_STANDARD,
  mtoLabel,
  type Cell,
} from '../data/mock-plan'

// === Headcount composition for a Cell =============================================================
// Each Cell carries `skills: { skill, count }[]`. The composition card shows utilisation per skill
// — utilisation here is mocked as count vs total to keep the chart focused on shape.

export type HeadcountComposition = {
  totalHeadcount: number
  skills: { skill: string; count: number; share: number }[]
}

export const calcHeadcountComposition = (cell: Cell): HeadcountComposition => {
  const total = cell.headcount
  return {
    totalHeadcount: total,
    skills: cell.skills.map((s) => ({ skill: s.skill, count: s.count, share: total > 0 ? s.count / total : 0 })),
  }
}

// === Per-org-node demand timeline (MTO offsets) ==================================================
// For the selected org node (by cellId), aggregate planned SPM demand bucketed by month-offset
// from each PF's own MTO(0). The result is a per-offset { capacity, demand, over } point set.

export type CapacityDemandPoint = {
  offset: number
  label: string
  capacity: number
  demand: number
  over: boolean
}

const offsetCovered = (anchorYearMonth: string, startIso: string, endIso: string): number[] => {
  const [aY, aM] = anchorYearMonth.split('-').map(Number)
  const anchorIdx = aY * 12 + (aM - 1)
  const startD = new Date(startIso)
  const endD = new Date(endIso)
  const startIdx = startD.getUTCFullYear() * 12 + startD.getUTCMonth()
  const endIdx = endD.getUTCFullYear() * 12 + endD.getUTCMonth()
  const out: number[] = []
  for (let i = startIdx; i <= endIdx; i++) out.push(i - anchorIdx)
  return out
}

// Build a set of cell-ids that fall under the given org node (by partial OrgRef).
const cellsUnder = (node: { divisionId?: string; siteId?: string; teamId?: string; groupId?: string; partId?: string; cellId?: string }): Set<string> => {
  const out = new Set<string>()
  for (const e of MOCK_FLAT_CELLS) {
    if (node.cellId && e.ref.cellId !== node.cellId) continue
    if (node.partId && e.ref.partId !== node.partId) continue
    if (node.groupId && e.ref.groupId !== node.groupId) continue
    if (node.teamId && e.ref.teamId !== node.teamId) continue
    if (node.siteId && e.ref.siteId !== node.siteId) continue
    if (node.divisionId && e.ref.divisionId !== node.divisionId) continue
    out.add(e.cell.id)
  }
  return out
}

// Compute capacity vs demand curve over the standard MTO offsets for a given org-node target.
// `nodeRef` is interpreted as a *partial* org ref (e.g. only divisionId, or division+team).
export const calcCapacityVsDemand = (nodeRef: { divisionId?: string; siteId?: string; teamId?: string; groupId?: string; partId?: string; cellId?: string }): CapacityDemandPoint[] => {
  const ids = cellsUnder(nodeRef)
  const headcount = MOCK_FLAT_CELLS.filter((e) => ids.has(e.cell.id)).reduce((s, e) => s + e.cell.headcount, 0)

  // Bucket demand by offset across every Task / SubTask whose owner falls in the set.
  const byOffset = new Map<number, number>()
  for (const pf of MOCK_PRODUCTION_FAMILIES) {
    for (const t of pf.tasks) {
      if (t.ownerCellIds.some((id) => ids.has(id))) {
        const offs = offsetCovered(pf.mtoAnchor, t.start, t.end)
        const per = offs.length ? t.spm / offs.length : 0
        for (const o of offs) byOffset.set(o, (byOffset.get(o) ?? 0) + per)
      }
      for (const s of t.subTasks) {
        if (s.ownerCellIds.some((id) => ids.has(id))) {
          const offs = offsetCovered(pf.mtoAnchor, s.start, s.end)
          const per = offs.length ? s.spm / offs.length : 0
          for (const o of offs) byOffset.set(o, (byOffset.get(o) ?? 0) + per)
        }
      }
    }
  }
  // Use the standard MTO offsets as the axis so every node has the same x-range.
  return MTO_OFFSETS_STANDARD.map((offset) => {
    const demand = Math.round((byOffset.get(offset) ?? 0) * 10) / 10
    return { offset, label: mtoLabel(offset), capacity: headcount, demand, over: demand > headcount }
  })
}

// === Constraints ==================================================================================
// "Resource constraints" — list of skill-group shortfalls (demand exceeds headcount on a skill basis).
// Mock: declare a constraint when a Cell's `Certification` or `RF` capacity is below the demand from
// SubTasks of that kind.

export type ResourceConstraint = {
  id: string
  severity: 'critical' | 'warning' | 'info'
  cellId: string
  cellName: string
  skill: string
  title: string
  detail: string
}

export const constraintsForCell = (cellId: string): ResourceConstraint[] => {
  const e = MOCK_FLAT_CELLS.find((x) => x.cell.id === cellId)
  if (!e) return []
  const out: ResourceConstraint[] = []
  for (const s of e.cell.skills) {
    if (s.count >= 5) continue
    out.push({
      id: `${cellId}::${s.skill}`,
      severity: s.count <= 2 ? 'critical' : 'warning',
      cellId,
      cellName: e.cell.name,
      skill: s.skill,
      title: `${s.skill} thin headcount (${s.count} people)`,
      detail: `Cell ${e.cell.name} carries only ${s.count} ${s.skill} engineers — verify planned coverage on incoming tasks.`,
    })
  }
  return out
}

export const allConstraints = (): ResourceConstraint[] => {
  return MOCK_FLAT_CELLS.flatMap((e) => constraintsForCell(e.cell.id))
}
