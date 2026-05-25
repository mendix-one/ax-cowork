import { Space, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import type { ProductionOrder, ScheduleFamily, ScheduleMilestone } from '../../data/mock-plan'
import { DAY_WIDTH } from './gantt-styles'

type Props = {
  m: ScheduleMilestone
  order: ProductionOrder
  family?: ScheduleFamily
}

export const SimulationGanttMilestoneMarker = observer(({ m, order, family }: Props) => {
  return (
    <Tooltip
      title={
        <Space direction="vertical" size={2}>
          <Typography.Text style={{ color: '#fff', fontSize: 12 }}>
            <strong>{order.id}</strong> · {order.customerShort}
          </Typography.Text>
          {family && (
            <Typography.Text style={{ color: '#fff', fontSize: 12 }}>
              Family: {family.label} ({family.tech})
            </Typography.Text>
          )}
          <Typography.Text style={{ color: '#fff', fontSize: 12 }}>
            Milestone: {m.label} · {m.date}
          </Typography.Text>
          <Typography.Text style={{ color: '#fff', fontSize: 12 }}>Shipment: {m.shipmentWafers.toLocaleString()} wafers out</Typography.Text>
          {m.slipDays ? (
            <Typography.Text style={{ color: '#ff7875', fontSize: 12 }}>
              Slip +{m.slipDays}d · {m.cause}
            </Typography.Text>
          ) : null}
        </Space>
      }
    >
      <div
        className="ax-gantt_milestone"
        style={{
          left: DAY_WIDTH / 2 - 6,
          background: m.status === 'slipped' ? '#f5222d' : m.status === 'at-risk' ? '#faad14' : '#3F51B5',
        }}
      />
    </Tooltip>
  )
})
