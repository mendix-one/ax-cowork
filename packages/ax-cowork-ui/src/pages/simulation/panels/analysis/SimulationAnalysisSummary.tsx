import { Statistic, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { calcCapacityStats, calcShipmentSummary, calcTotals, calcViolations } from './analysis.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Top summary strip — 4 cards mirroring the spec:
//   • Totals: PO / PF / MB counts (reflects the current Adjustment selection)
//   • Avg shop-floor capacity: avg daily usage with vs-safe / vs-limit + bottleneck tool group
//   • Shipment & milestones: total wafers out, monthly average, next upcoming milestone
//   • Violations / High-load: compact list of tool groups outside the safe envelope
export const SimulationAnalysisSummary = observer(() => {
  const sim = useSimulationContext()
  const orders = sim.gantt.filteredOrders
  const today = sim.gantt.today
  const totals = calcTotals(orders)
  const cap = calcCapacityStats(sim.analysis.startDate, sim.analysis.endDate)
  const ship = calcShipmentSummary(orders, today)
  const violations = calcViolations()

  return (
    <div className="ax-analysis_summary">
      {/* Totals — three tiles showing the PO → PF → MB hierarchy, plus a one-line ratio caption. */}
      <div className="ax-analysis_summary_card">
        <div className="ax-analysis_summary_card_title">
          <AxMuiIcon icon="mdiViewListOutline" size={16} />
          <span>Totals</span>
        </div>
        <div className="ax-analysis_summary_card_body">
          <div className="ax-analysis_totals">
            <div className="ax-analysis_totals_tile ax-analysis_totals_tile__po">
              <div className="ax-analysis_totals_tile_icon">
                <AxMuiIcon icon="mdiClipboardListOutline" size={20} />
              </div>
              <div className="ax-analysis_totals_tile_value">{totals.po}</div>
              <div className="ax-analysis_totals_tile_label">Production Orders</div>
            </div>
            <AxMuiIcon icon="mdiChevronRight" size={16} className="ax-analysis_totals_arrow" />
            <div className="ax-analysis_totals_tile ax-analysis_totals_tile__pf">
              <div className="ax-analysis_totals_tile_icon">
                <AxMuiIcon icon="mdiCubeOutline" size={20} />
              </div>
              <div className="ax-analysis_totals_tile_value">{totals.pf}</div>
              <div className="ax-analysis_totals_tile_label">Product Families</div>
            </div>
            <AxMuiIcon icon="mdiChevronRight" size={16} className="ax-analysis_totals_arrow" />
            <div className="ax-analysis_totals_tile ax-analysis_totals_tile__mb">
              <div className="ax-analysis_totals_tile_icon">
                <AxMuiIcon icon="mdiLayersTripleOutline" size={20} />
              </div>
              <div className="ax-analysis_totals_tile_value">{totals.mb}</div>
              <div className="ax-analysis_totals_tile_label">Mfg Batches</div>
            </div>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            Avg {totals.po > 0 ? (totals.pf / totals.po).toFixed(1) : '0.0'} PF/PO · {totals.pf > 0 ? (totals.mb / totals.pf).toFixed(1) : '0.0'} MB/PF
          </Typography.Text>
        </div>
      </div>

      {/* Avg shop-floor capacity */}
      <div className="ax-analysis_summary_card">
        <div className="ax-analysis_summary_card_title">
          <AxMuiIcon icon="mdiSpeedometer" size={16} />
          <span>Avg shop-floor capacity</span>
        </div>
        <div className="ax-analysis_summary_card_body">
          <Statistic
            value={cap.avgDaily}
            suffix={<Typography.Text type="secondary" className="text-sm"> wafer-moves/day</Typography.Text>}
            valueStyle={{ fontSize: 22, color: cap.avgVsLimitPct > 100 ? '#f44336' : cap.avgVsSafePct > 100 ? '#ff9800' : '#2196f3' }}
          />
          <Typography.Text type="secondary" className="text-sm">
            vs Safe {cap.safe} · {cap.avgVsSafePct}% · vs Limit {cap.limit} · {cap.avgVsLimitPct}%
          </Typography.Text>
          {cap.bottleneckGroup && (
            <div className="ax-analysis_summary_card_chips">
              <Tag color="orange" style={{ margin: 0, cursor: 'pointer' }} onClick={() => sim.navigateToToolGroup(cap.bottleneckGroup!)} title="Open in Shop Floor Capacity">
                Bottleneck · {cap.bottleneckGroup}
              </Tag>
              {cap.highloadGroup && cap.highloadGroup !== cap.bottleneckGroup && (
                <Tag color="red" style={{ margin: 0, cursor: 'pointer' }} onClick={() => sim.navigateToToolGroup(cap.highloadGroup!)} title="Open in Shop Floor Capacity">
                  Highload · {cap.highloadGroup}
                </Tag>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shipment & milestone */}
      <div className="ax-analysis_summary_card">
        <div className="ax-analysis_summary_card_title">
          <AxMuiIcon icon="mdiTruckDeliveryOutline" size={16} />
          <span>Shipment &amp; milestone</span>
        </div>
        <div className="ax-analysis_summary_card_body">
          <Statistic
            value={ship.totalWafersOut}
            suffix={<Typography.Text type="secondary" className="text-sm"> wafers planned</Typography.Text>}
            valueStyle={{ fontSize: 22, color: '#2196f3' }}
          />
          <Typography.Text type="secondary" className="text-sm">
            Avg {ship.avgWafersPerMonth.toLocaleString()} wafers / month
          </Typography.Text>
          {ship.nextMilestone && (
            <Typography.Text>
              Next: <b>{ship.nextMilestone.po}</b> {ship.nextMilestone.label} ·{' '}
              <Typography.Text type="secondary" className="text-sm">
                {ship.nextMilestone.date} · {ship.nextMilestone.wafers.toLocaleString()} w
              </Typography.Text>
            </Typography.Text>
          )}
        </div>
      </div>

      {/* Violations / Highload list */}
      <div className="ax-analysis_summary_card">
        <div className="ax-analysis_summary_card_title">
          <AxMuiIcon icon="mdiAlertOctagonOutline" size={16} />
          <span>Violations &amp; High-load</span>
        </div>
        <div className="ax-analysis_summary_card_body ax-analysis_summary_card_body__list">
          {violations.length === 0 ? (
            <Typography.Text type="secondary">All tool groups within safe range.</Typography.Text>
          ) : (
            violations.slice(0, 4).map((v) => (
              <div
                key={v.group.name}
                className={`ax-analysis_summary_violation ${v.kind}`}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                title="Open in Shop Floor Capacity"
                onClick={() => sim.navigateToToolGroup(v.group.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    sim.navigateToToolGroup(v.group.name)
                  }
                }}
              >
                <Tag color={v.kind === 'violation' ? 'red' : 'orange'} style={{ margin: 0 }}>
                  {v.kind === 'violation' ? 'Violation' : 'Highload'}
                </Tag>
                <span className="ax-analysis_summary_violation_label">{v.group.name}</span>
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
