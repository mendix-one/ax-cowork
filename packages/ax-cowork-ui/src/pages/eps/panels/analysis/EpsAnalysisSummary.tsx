import { Statistic, Tag, Tooltip, Typography } from 'antd'
import type { ReactNode } from 'react'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { EpsStore } from '../../stores/eps.store'
import { calcCapacityStats, calcShipmentSummary, calcTotals, calcViolations } from '../../helpers/analysis.helpers'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Card title row with an explicit "open detail" chevron — every KPI summary card is a deep-link to the panel
// that owns its underlying data, so the planner can chase a summary number straight to its details.
// Kept as a plain render-function (not a component) so this file stays single-component for fast-refresh.
const renderCardTitle = (args: {
  icon: 'mdiViewListOutline' | 'mdiSpeedometer' | 'mdiTruckDeliveryOutline' | 'mdiAlertOctagonOutline'
  label: ReactNode
  onOpen?: () => void
  openLabel: string
}) => (
  <div className="ax-eps-analysis_summary_card_title">
    <AxMuiIcon icon={args.icon} size={16} />
    <span style={{ flex: 1 }}>{args.label}</span>
    {args.onOpen && (
      <Tooltip title={args.openLabel}>
        <button
          type="button"
          onClick={args.onOpen}
          aria-label={args.openLabel}
          className="ax-eps-analysis_summary_card_open"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
            display: 'inline-flex',
            alignItems: 'center',
            color: 'inherit',
          }}
        >
          <AxMuiIcon icon="mdiArrowTopRight" size={14} />
        </button>
      </Tooltip>
    )}
  </div>
)

// Top summary strip — 4 cards mirroring the spec:
//   • Totals: PO / PF / MB counts (reflects the current Adjustment selection)
//   • Avg shop-floor capacity: avg daily usage with vs-safe / vs-limit + bottleneck tool group
//   • Shipment & milestones: total wafers out, monthly average, next upcoming milestone
//   • Violations / High-load: compact list of tool groups outside the safe envelope
//
// Every card is a deep-link surface: clicking the "↗" chevron in the title jueps to the panel that owns the
// underlying data, pre-selecting the most relevant slice. This eliminates the round-trip "see the number →
// guess where it lives → navigate manually" that the original concept forced on the planner.
export const EpsAnalysisSummary = observer(() => {
  const sim: EpsStore = useEpsContext()
  const orders = sim.simulation.filteredOrders
  const today = sim.simulation.today
  const totals = calcTotals(orders)
  const cap = calcCapacityStats(sim.analysis.startDate, sim.analysis.endDate)
  const ship = calcShipmentSummary(orders, today)
  const violations = calcViolations()

  // Pick the first PO with an upcoming milestone or the first slipped/at-risk PO as the shipment drill target.
  const shipmentTarget = ship.nextMilestone?.po ?? orders.find((o) => o.status === 'at-risk' || o.status === 'slipped')?.id ?? orders[0]?.id
  const violationTarget = violations[0]?.group.name ?? cap.bottleneckGroup ?? cap.highloadGroup

  return (
    <div className="ax-eps-analysis_summary">
      {/* Totals — three tiles showing the PO → PF → MB hierarchy, plus a one-line ratio caption. */}
      <div className="ax-eps-analysis_summary_card">
        {renderCardTitle({ icon: 'mdiViewListOutline', label: 'Totals', openLabel: 'Open Production Order panel', onOpen: () => sim.setActiveMainPanel('orders') })}
        <div className="ax-eps-analysis_summary_card_body">
          <div className="ax-eps-analysis_totals">
            <div className="ax-eps-analysis_totals_tile ax-eps-analysis_totals_tile__po">
              <div className="ax-eps-analysis_totals_tile_icon">
                <AxMuiIcon icon="mdiClipboardListOutline" size={20} />
              </div>
              <div className="ax-eps-analysis_totals_tile_value">{totals.po}</div>
              <div className="ax-eps-analysis_totals_tile_label">Production Orders</div>
            </div>
            <AxMuiIcon icon="mdiChevronRight" size={16} className="ax-eps-analysis_totals_arrow" />
            <div className="ax-eps-analysis_totals_tile ax-eps-analysis_totals_tile__pf">
              <div className="ax-eps-analysis_totals_tile_icon">
                <AxMuiIcon icon="mdiCubeOutline" size={20} />
              </div>
              <div className="ax-eps-analysis_totals_tile_value">{totals.pf}</div>
              <div className="ax-eps-analysis_totals_tile_label">Product Families</div>
            </div>
            <AxMuiIcon icon="mdiChevronRight" size={16} className="ax-eps-analysis_totals_arrow" />
            <div className="ax-eps-analysis_totals_tile ax-eps-analysis_totals_tile__mb">
              <div className="ax-eps-analysis_totals_tile_icon">
                <AxMuiIcon icon="mdiLayersTripleOutline" size={20} />
              </div>
              <div className="ax-eps-analysis_totals_tile_value">{totals.mb}</div>
              <div className="ax-eps-analysis_totals_tile_label">Mfg Batches</div>
            </div>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            Avg {totals.po > 0 ? (totals.pf / totals.po).toFixed(1) : '0.0'} PF/PO · {totals.pf > 0 ? (totals.mb / totals.pf).toFixed(1) : '0.0'} MB/PF
          </Typography.Text>
        </div>
      </div>

      {/* Avg shop-floor capacity */}
      <div className="ax-eps-analysis_summary_card">
        {renderCardTitle({
          icon: 'mdiSpeedometer',
          label: 'Avg shop-floor capacity',
          openLabel: cap.bottleneckGroup ? `Open Shop Floor — ${cap.bottleneckGroup}` : 'Open Shop Floor Capacity',
          onOpen: () => (cap.bottleneckGroup ? sim.navigateToToolGroup(cap.bottleneckGroup) : sim.setActiveMainPanel('capacity')),
        })}
        <div className="ax-eps-analysis_summary_card_body">
          <Statistic
            value={cap.avgDaily}
            suffix={<Typography.Text type="secondary" className="text-sm"> wafer-moves/day</Typography.Text>}
            valueStyle={{ fontSize: 22, color: cap.avgVsLimitPct > 100 ? '#f44336' : cap.avgVsSafePct > 100 ? '#ff9800' : '#2196f3' }}
          />
          <Typography.Text type="secondary" className="text-sm">
            vs Safe {cap.safe} · {cap.avgVsSafePct}% · vs Limit {cap.limit} · {cap.avgVsLimitPct}%
          </Typography.Text>
          {cap.bottleneckGroup && (
            <div className="ax-eps-analysis_summary_card_chips">
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
      <div className="ax-eps-analysis_summary_card">
        {renderCardTitle({
          icon: 'mdiTruckDeliveryOutline',
          label: <>Shipment &amp; milestone</>,
          openLabel: shipmentTarget ? `Open Production Order — ${shipmentTarget}` : 'Open Production Order panel',
          onOpen: () => (shipmentTarget ? sim.navigateToOrder(shipmentTarget) : sim.setActiveMainPanel('orders')),
        })}
        <div className="ax-eps-analysis_summary_card_body">
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
      <div className="ax-eps-analysis_summary_card">
        {renderCardTitle({
          icon: 'mdiAlertOctagonOutline',
          label: <>Violations &amp; High-load</>,
          openLabel: violationTarget ? `Open Shop Floor — ${violationTarget}` : 'Open Shop Floor Capacity',
          onOpen: () => (violationTarget ? sim.navigateToToolGroup(violationTarget) : sim.setActiveMainPanel('capacity')),
        })}
        <div className="ax-eps-analysis_summary_card_body ax-eps-analysis_summary_card_body__list">
          {violations.length === 0 ? (
            <Typography.Text type="secondary">All tool groups within safe range.</Typography.Text>
          ) : (
            violations.slice(0, 4).map((v) => (
              <div
                key={v.group.name}
                className={`ax-eps-analysis_summary_violation ${v.kind}`}
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
                <span className="ax-eps-analysis_summary_violation_label">{v.group.name}</span>
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
