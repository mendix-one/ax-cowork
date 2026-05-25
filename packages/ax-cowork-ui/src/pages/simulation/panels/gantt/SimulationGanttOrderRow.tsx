import { Space, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { ProductionOrder } from '../../data/mock-plan'
import { DAY_WIDTH, SIDEBAR_DATE, SIDEBAR_TASK, dayOffset } from './gantt-styles'
import { SimulationGanttBar } from './SimulationGanttBar'
import { SimulationGanttMilestoneMarker } from './SimulationGanttMilestoneMarker'
import { SimulationGanttPriorityTag } from './SimulationGanttPriorityTag'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

type Props = {
  order: ProductionOrder
  anchor: string
}

export const SimulationGanttOrderRow = observer(({ order, anchor }: Props) => {
  const gantt = useSimulationContext().gantt
  const expanded = gantt.isExpanded(order.id)
  return (
    <tr>
      <td className="ax-gantt_task_cell" style={{ left: 0, minWidth: SIDEBAR_TASK, width: SIDEBAR_TASK }}>
        <Space size={4} align="center" wrap={false}>
          <span className="ax-gantt_toggle_icon" onClick={() => gantt.toggleExpanded(order.id)}>
            <AxMuiIcon icon={expanded ? 'mdiChevronDown' : 'mdiChevronRight'} size={14} />
          </span>
          <Typography.Text className="ax-gantt_po_text" ellipsis>
            {order.id}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {order.customerShort}
          </Typography.Text>
          <SimulationGanttPriorityTag p={order.priority} hot={order.hotLot} />
        </Space>
      </td>
      <td className="ax-gantt_num_cell" style={{ left: SIDEBAR_TASK, minWidth: SIDEBAR_DATE, width: SIDEBAR_DATE }}>
        {order.waferStart}
      </td>
      <td className="ax-gantt_num_cell" style={{ left: SIDEBAR_TASK + SIDEBAR_DATE, minWidth: SIDEBAR_DATE, width: SIDEBAR_DATE }}>
        {order.end}
      </td>
      {gantt.horizonLabels.map((_, idx) => (
        <td key={idx} className="ax-gantt_day_cell" style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}>
          {idx === 0 && (
            <SimulationGanttBar
              variant="po"
              start={order.waferStart}
              durationDays={dayOffset(order.end, order.waferStart) + 1}
              status={order.status}
              anchor={anchor}
              label={order.id}
            />
          )}
          {order.milestones.map((m) => {
            const offset = dayOffset(m.date, anchor)
            if (offset !== idx) return null
            const family = order.schedule.find((f) => f.id === m.familyId)
            return <SimulationGanttMilestoneMarker key={m.id} m={m} order={order} family={family} />
          })}
        </td>
      ))}
    </tr>
  )
})
