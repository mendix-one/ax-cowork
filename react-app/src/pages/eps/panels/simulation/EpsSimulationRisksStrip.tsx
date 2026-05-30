import { Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { MOCK_ORG_DEMAND_BY_TEAM, type OrgDemandRow } from '../../data/mock-plan'
import { useEpsContext } from '../../stores/eps.context'
import { AxMuiIcon, type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Risks strip — under the Gantt, lists the most pressing org-node violations and high-load warnings.
// Each entry routes the planner to the Headcount Portfolio panel for that org node.

type RiskRow = {
  key: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  org: OrgDemandRow
  kind: string
}

const SEVERITY_RANK: Record<RiskRow['severity'], number> = { critical: 0, warning: 1, info: 2 }
const SEVERITY_ICON: Record<RiskRow['severity'], MdiIconName> = {
  critical: 'mdiAlertOctagonOutline',
  warning: 'mdiAlertOutline',
  info: 'mdiInformationOutline',
}

const SAFE_THRESHOLD = 0.8

const collectRisks = (): RiskRow[] => {
  const out: RiskRow[] = []
  for (const o of MOCK_ORG_DEMAND_BY_TEAM) {
    if (o.headcount === 0) continue
    const ratio = o.demand / o.headcount
    if (o.demand > o.headcount) {
      const pct = Math.round(ratio * 100)
      out.push({
        key: `overload::${o.label}`,
        severity: 'critical',
        kind: 'Violation',
        org: o,
        title: `${o.label} · ${pct}% planned`,
        detail: `Demand ${o.demand} P/M exceeds headcount ${o.headcount} P/M.`,
      })
    } else if (ratio >= SAFE_THRESHOLD) {
      out.push({
        key: `highload::${o.label}`,
        severity: 'warning',
        kind: 'High-load',
        org: o,
        title: `${o.label} · ${Math.round(ratio * 100)}% planned`,
        detail: `Demand ${o.demand} P/M is at or above the 80% safety threshold.`,
      })
    }
  }
  out.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
  return out
}

export const EpsSimulationRisksStrip = observer(() => {
  const sim = useEpsContext()
  const open = sim.simulation.risksStripOpen
  const risks = collectRisks()
  const criticalCount = risks.filter((r) => r.severity === 'critical').length

  return (
    <div className={`ax-eps-simulation_risks ${open ? 'is-open' : 'is-collapsed'}`}>
      <button type="button" className="ax-eps-simulation_risks_header" onClick={() => sim.simulation.toggleRisksStrip()} aria-expanded={open}>
        <AxMuiIcon icon={open ? 'mdiChevronDown' : 'mdiChevronUp'} size={14} />
        <AxMuiIcon icon="mdiShieldAlertOutline" size={14} className="ax-eps-simulation_risks_header_icon" />
        <span className="ax-eps-simulation_risks_header_title">Risks</span>
        <span className="ax-eps-simulation_risks_header_count">
          {risks.length} total
          {criticalCount > 0 && <span className="ax-eps-simulation_risks_header_critical"> · {criticalCount} critical</span>}
        </span>
        <span className="ax-eps-simulation_risks_header_hint">Click an item to open it in Headcount Portfolio</span>
      </button>
      {open && (
        <div className="ax-eps-simulation_risks_list">
          {risks.length === 0 ? (
            <div className="ax-eps-simulation_risks_empty">No active risks — the plan is clean.</div>
          ) : (
            risks.map((r) => (
              <Tooltip key={r.key} title={r.detail} mouseEnterDelay={0.35}>
                <button
                  type="button"
                  className={`ax-eps-simulation_risks_row ax-eps-simulation_risks_row__${r.severity}`}
                  onClick={() => sim.navigateToOrgNode(r.org.ref.teamId ?? r.org.ref.divisionId)}
                  aria-label={`${r.kind} on ${r.org.label}: ${r.title}`}
                >
                  <AxMuiIcon icon={SEVERITY_ICON[r.severity]} size={14} className="ax-eps-simulation_risks_row_severity" />
                  <span className="ax-eps-simulation_risks_row_kind">{r.kind}</span>
                  <span className="ax-eps-simulation_risks_row_group">{r.org.label}</span>
                  <span className="ax-eps-simulation_risks_row_title">{r.title}</span>
                  <AxMuiIcon icon="mdiArrowTopRight" size={12} className="ax-eps-simulation_risks_row_arrow" />
                </button>
              </Tooltip>
            ))
          )}
        </div>
      )}
    </div>
  )
})
