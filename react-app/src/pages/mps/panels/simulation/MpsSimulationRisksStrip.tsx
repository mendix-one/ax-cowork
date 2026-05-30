import { Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { TOOLING_CONSTRAINTS, TOOL_GROUP_CAPACITIES } from '../../data/mock-plan'
import { useMpsContext } from '../../stores/mps.context'
import { AxMuiIcon, type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Risks strip — a low-profile dock under the Gantt that lists the most pressing constraints and overloads
// affecting the current planning horizon. Every entry is clickable and routes the planner straight to the
// owning detail panel (Shop Floor Capacity with the right tool group selected), so chasing "where does this
// come from?" stops being a navigation puzzle.
//
// Source of truth:
//   • TOOLING_CONSTRAINTS — pm windows, downtime, qual expiries, ramp-ups (severity provided by the data)
//   • TOOL_GROUP_CAPACITIES — derived overloads when used > total
//
// Sort order: critical first, then warning, then info. Capacity overloads slot into "critical" since they
// already break the plan.

type RiskRow = {
  key: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  toolGroup: string
  kind: string
  window?: string
}

const SEVERITY_RANK: Record<RiskRow['severity'], number> = { critical: 0, warning: 1, info: 2 }
const SEVERITY_ICON: Record<RiskRow['severity'], MdiIconName> = {
  critical: 'mdiAlertOctagonOutline',
  warning: 'mdiAlertOutline',
  info: 'mdiInformationOutline',
}

const formatWindow = (start: string, end: string): string => {
  if (start === end) return start.slice(5) // MM-DD
  return `${start.slice(5)} → ${end.slice(5)}`
}

const collectRisks = (horizonStart: string, horizonEnd: string): RiskRow[] => {
  const out: RiskRow[] = []

  // Capacity overloads — show whenever any tool group consumes more than its total over the horizon.
  for (const g of TOOL_GROUP_CAPACITIES) {
    if (g.used <= g.total) continue
    const pct = Math.round((g.used / g.total) * 100)
    out.push({
      key: `overload::${g.name}`,
      severity: 'critical',
      kind: 'Overload',
      toolGroup: g.name,
      title: `${g.name} · ${pct}% utilization`,
      detail: `Demand ${g.used.toLocaleString()} exceeds capacity ${g.total.toLocaleString()} wafer-moves.`,
    })
  }

  // Constraints (PM, downtime, qual expiry, ramp-up) that touch the horizon.
  const horizonStartMs = new Date(horizonStart).getTime()
  const horizonEndMs = new Date(horizonEnd).getTime()
  for (const c of TOOLING_CONSTRAINTS) {
    const cStart = new Date(c.start).getTime()
    const cEnd = new Date(c.end).getTime()
    // Skip constraints that fall entirely outside the planning horizon (with a 14d grace before/after so
    // imminent items still surface).
    const GRACE = 14 * 24 * 60 * 60 * 1000
    if (cEnd < horizonStartMs - GRACE || cStart > horizonEndMs + GRACE) continue
    out.push({
      key: c.id,
      severity: c.severity,
      kind: c.kind === 'pm' ? 'PM' : c.kind === 'qual-expiry' ? 'Qual' : c.kind === 'downtime' ? 'Down' : c.kind === 'ramp-up' ? 'Ramp' : c.kind,
      toolGroup: c.toolGroup,
      title: c.title,
      detail: c.detail,
      window: formatWindow(c.start, c.end),
    })
  }

  out.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
  return out
}

export const MpsSimulationRisksStrip = observer(() => {
  const sim = useMpsContext()
  const open = sim.simulation.risksStripOpen
  const risks = collectRisks(sim.simulation.startDate, sim.simulation.endDate)
  const criticalCount = risks.filter((r) => r.severity === 'critical').length

  return (
    <div className={`ax-mps-simulation_risks ${open ? 'is-open' : 'is-collapsed'}`}>
      <button type="button" className="ax-mps-simulation_risks_header" onClick={() => sim.simulation.toggleRisksStrip()} aria-expanded={open}>
        <AxMuiIcon icon={open ? 'mdiChevronDown' : 'mdiChevronUp'} size={14} />
        <AxMuiIcon icon="mdiShieldAlertOutline" size={14} className="ax-mps-simulation_risks_header_icon" />
        <span className="ax-mps-simulation_risks_header_title">Risks</span>
        <span className="ax-mps-simulation_risks_header_count">
          {risks.length} total
          {criticalCount > 0 && <span className="ax-mps-simulation_risks_header_critical"> · {criticalCount} critical</span>}
        </span>
        <span className="ax-mps-simulation_risks_header_hint">Click an item to open it in Shop Floor Capacity</span>
      </button>
      {open && (
        <div className="ax-mps-simulation_risks_list">
          {risks.length === 0 ? (
            <div className="ax-mps-simulation_risks_empty">No active risks in this horizon — the plan is clean.</div>
          ) : (
            risks.map((r) => (
              <Tooltip key={r.key} title={r.detail} mouseEnterDelay={0.35}>
                <button
                  type="button"
                  className={`ax-mps-simulation_risks_row ax-mps-simulation_risks_row__${r.severity}`}
                  onClick={() => sim.navigateToToolGroup(r.toolGroup)}
                  aria-label={`${r.kind} on ${r.toolGroup}: ${r.title}`}
                >
                  <AxMuiIcon icon={SEVERITY_ICON[r.severity]} size={14} className="ax-mps-simulation_risks_row_severity" />
                  <span className="ax-mps-simulation_risks_row_kind">{r.kind}</span>
                  <span className="ax-mps-simulation_risks_row_group">{r.toolGroup}</span>
                  <span className="ax-mps-simulation_risks_row_title">{r.title}</span>
                  {r.window && <span className="ax-mps-simulation_risks_row_window">{r.window}</span>}
                  <AxMuiIcon icon="mdiArrowTopRight" size={12} className="ax-mps-simulation_risks_row_arrow" />
                </button>
              </Tooltip>
            ))
          )}
        </div>
      )}
    </div>
  )
})
