import { Statistic, Tag, Typography } from 'antd'
import type { ReactNode } from 'react'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { EpsStore } from '../../stores/eps.store'
import { calcCapacityStats, calcTotals, calcViolations } from '../../helpers/analysis.helpers'
import { AxMuiIcon, type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'

const renderCardTitle = (args: { icon: MdiIconName; label: ReactNode; openLabel: string; onOpen?: () => void }) => (
  <div className="ax-eps-analysis_summary_card_title">
    <AxMuiIcon icon={args.icon} size={16} />
    <span style={{ flex: 1 }}>{args.label}</span>
    {args.onOpen && (
      <button type="button" onClick={args.onOpen} aria-label={args.openLabel} className="ax-eps-analysis_summary_card_open" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 2, display: 'inline-flex', alignItems: 'center', color: 'inherit' }}>
        <AxMuiIcon icon="mdiArrowTopRight" size={14} />
      </button>
    )}
  </div>
)

// Top summary strip — 4 cards aligned with the new EPS IA:
//   • Totals: PF / Task / SubTask counts + total SPM
//   • Avg org demand vs Safe / Limit
//   • Engineering Process spread (# stages × # activities used)
//   • Violations / High-load (org nodes)
export const EpsAnalysisSummary = observer(() => {
  const sim: EpsStore = useEpsContext()
  const families = sim.simulation.filteredFamilies
  const totals = calcTotals(families)
  const cap = calcCapacityStats()
  const violations = calcViolations()
  const violationTarget = violations[0]?.org.ref.teamId ?? violations[0]?.org.ref.divisionId

  return (
    <div className="ax-eps-analysis_summary">
      <div className="ax-eps-analysis_summary_card">
        {renderCardTitle({ icon: 'mdiViewListOutline', label: 'Totals', openLabel: 'Open Production Requirements', onOpen: () => sim.setActiveMainPanel('orders') })}
        <div className="ax-eps-analysis_summary_card_body">
          <div className="ax-eps-analysis_totals">
            <div className="ax-eps-analysis_totals_tile ax-eps-analysis_totals_tile__po">
              <div className="ax-eps-analysis_totals_tile_value">{totals.pf}</div>
              <div className="ax-eps-analysis_totals_tile_label">Production Families</div>
            </div>
            <AxMuiIcon icon="mdiChevronRight" size={16} className="ax-eps-analysis_totals_arrow" />
            <div className="ax-eps-analysis_totals_tile ax-eps-analysis_totals_tile__pf">
              <div className="ax-eps-analysis_totals_tile_value">{totals.task}</div>
              <div className="ax-eps-analysis_totals_tile_label">Engineering Tasks</div>
            </div>
            <AxMuiIcon icon="mdiChevronRight" size={16} className="ax-eps-analysis_totals_arrow" />
            <div className="ax-eps-analysis_totals_tile ax-eps-analysis_totals_tile__mb">
              <div className="ax-eps-analysis_totals_tile_value">{totals.sub}</div>
              <div className="ax-eps-analysis_totals_tile_label">Sub-Tasks</div>
            </div>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            Total SPM demand · {totals.spm.toLocaleString()} P/M
          </Typography.Text>
        </div>
      </div>

      <div className="ax-eps-analysis_summary_card">
        {renderCardTitle({ icon: 'mdiSpeedometer', label: 'Avg org demand', openLabel: 'Open Headcount Portfolio', onOpen: () => sim.setActiveMainPanel('capacity') })}
        <div className="ax-eps-analysis_summary_card_body">
          <Statistic
            value={cap.avgDemand}
            suffix={<Typography.Text type="secondary" className="text-sm"> P/M / division</Typography.Text>}
            styles={{ content: { fontSize: 22, color: cap.avgVsLimitPct > 100 ? '#f44336' : cap.avgVsSafePct > 100 ? '#ff9800' : '#2196f3' } }}
          />
          <Typography.Text type="secondary" className="text-sm">
            vs Safe {cap.safe} · {cap.avgVsSafePct}% · vs Limit {cap.limit} · {cap.avgVsLimitPct}%
          </Typography.Text>
          {cap.bottleneckOrg && (
            <div className="ax-eps-analysis_summary_card_chips">
              <Tag color="orange" style={{ margin: 0 }}>
                Bottleneck · {cap.bottleneckOrg}
              </Tag>
            </div>
          )}
        </div>
      </div>

      <div className="ax-eps-analysis_summary_card">
        {renderCardTitle({ icon: 'mdiSitemapOutline', label: <>Engineering Process</>, openLabel: 'Open Engineering Process', onOpen: () => sim.setActiveMainPanel('processes') })}
        <div className="ax-eps-analysis_summary_card_body">
          <Statistic value={totals.task} suffix={<Typography.Text type="secondary" className="text-sm"> tasks routed</Typography.Text>} styles={{ content: { fontSize: 22, color: '#3F51B5' } }} />
          <Typography.Text type="secondary" className="text-sm">
            Across {totals.pf} families · {totals.sub} sub-tasks
          </Typography.Text>
        </div>
      </div>

      <div className="ax-eps-analysis_summary_card">
        {renderCardTitle({ icon: 'mdiAlertOctagonOutline', label: <>Violations &amp; High-load</>, openLabel: 'Open Headcount Portfolio', onOpen: () => (violationTarget ? sim.navigateToOrgNode(violationTarget) : sim.setActiveMainPanel('capacity')) })}
        <div className="ax-eps-analysis_summary_card_body ax-eps-analysis_summary_card_body__list">
          {violations.length === 0 ? (
            <Typography.Text type="secondary">All org nodes within safe range.</Typography.Text>
          ) : (
            violations.slice(0, 4).map((v) => (
              <div key={v.org.label} className={`ax-eps-analysis_summary_violation ${v.kind}`} role="button" tabIndex={0} style={{ cursor: 'pointer' }} onClick={() => sim.navigateToOrgNode(v.org.ref.teamId ?? v.org.ref.divisionId)}>
                <Tag color={v.kind === 'violation' ? 'red' : 'orange'} style={{ margin: 0 }}>
                  {v.kind === 'violation' ? 'Violation' : 'Highload'}
                </Tag>
                <span className="ax-eps-analysis_summary_violation_label">{v.org.label}</span>
                <Typography.Text strong style={{ color: v.kind === 'violation' ? '#f44336' : '#ff9800' }}>
                  {Math.round(v.ratio * 100)}%
                </Typography.Text>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
})
