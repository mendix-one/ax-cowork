import { Statistic, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { ProductionOrder } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Planner roll-up over the *currently visible* POs (after toolbar filter + sidebar filter).
// Surfaces commitment / out / remaining wafer totals and an at-risk count so the planner can see
// the impact of any in-session edit immediately, without scrolling through the table.
const calcSummary = (orders: ProductionOrder[]) => {
  let totalCommitted = 0
  let totalOut = 0
  let atRiskCount = 0
  let runningCount = 0
  let batchCount = 0
  for (const o of orders) {
    totalCommitted += o.qty
    totalOut += o.outWafers
    if (o.status === 'at-risk' || o.status === 'slipped') atRiskCount += 1
    if (o.poStatus === 'RUNNING') runningCount += 1
    for (const f of o.schedule) batchCount += f.batches.length
  }
  return {
    totalCommitted,
    totalOut,
    totalRemaining: Math.max(0, totalCommitted - totalOut),
    atRiskCount,
    runningCount,
    poCount: orders.length,
    batchCount,
  }
}

const safePct = (numerator: number, denominator: number) => (denominator > 0 ? Math.round((numerator / denominator) * 100) : 0)

export const SimulationProductionOrderSummary = observer(() => {
  const po = useSimulationContext().productionOrder
  const s = calcSummary(po.filteredOrders)
  const outPct = safePct(s.totalOut, s.totalCommitted)
  const remainingPct = 100 - outPct

  return (
    <div className="ax-po_summary">
      <div className="ax-po_summary_card">
        <div className="ax-po_summary_card_title">
          <AxMuiIcon icon="mdiClipboardListOutline" size={16} />
          <span>Visible orders</span>
        </div>
        <div className="ax-po_summary_card_body">
          <Statistic value={s.poCount} suffix={<Typography.Text type="secondary" className="text-sm"> POs · {s.batchCount} batches</Typography.Text>} valueStyle={{ fontSize: 22, color: '#2196f3' }} />
          <Typography.Text type="secondary" className="text-sm">
            Running {s.runningCount} · At-risk {s.atRiskCount}
          </Typography.Text>
        </div>
      </div>

      <div className="ax-po_summary_card">
        <div className="ax-po_summary_card_title">
          <AxMuiIcon icon="mdiPackageVariantClosed" size={16} />
          <span>Committed wafers</span>
        </div>
        <div className="ax-po_summary_card_body">
          <Statistic value={s.totalCommitted} suffix={<Typography.Text type="secondary" className="text-sm"> wafers</Typography.Text>} valueStyle={{ fontSize: 22, color: '#3F51B5' }} />
          <Typography.Text type="secondary" className="text-sm">
            Across {s.poCount} production orders
          </Typography.Text>
        </div>
      </div>

      <div className="ax-po_summary_card">
        <div className="ax-po_summary_card_title">
          <AxMuiIcon icon="mdiCheckCircleOutline" size={16} />
          <span>Out</span>
        </div>
        <div className="ax-po_summary_card_body">
          <Statistic value={s.totalOut} suffix={<Typography.Text type="secondary" className="text-sm"> wafers · {outPct}%</Typography.Text>} valueStyle={{ fontSize: 22, color: '#4caf50' }} />
          <div className="ax-po_summary_bar">
            <div className="ax-po_summary_bar_fill ax-po_summary_bar_fill__done" style={{ width: `${outPct}%` }} />
          </div>
        </div>
      </div>

      <div className="ax-po_summary_card">
        <div className="ax-po_summary_card_title">
          <AxMuiIcon icon="mdiClockOutline" size={16} />
          <span>Remaining</span>
        </div>
        <div className="ax-po_summary_card_body">
          <Statistic
            value={s.totalRemaining}
            suffix={<Typography.Text type="secondary" className="text-sm"> wafers · {remainingPct}%</Typography.Text>}
            valueStyle={{ fontSize: 22, color: s.atRiskCount > 0 ? '#ff9800' : '#2196f3' }}
          />
          {s.atRiskCount > 0 ? (
            <Tag color="orange" style={{ margin: 0, alignSelf: 'flex-start' }}>
              {s.atRiskCount} at-risk PO · review priorities
            </Tag>
          ) : (
            <Typography.Text type="secondary" className="text-sm">
              All visible POs on track.
            </Typography.Text>
          )}
        </div>
      </div>
    </div>
  )
})
