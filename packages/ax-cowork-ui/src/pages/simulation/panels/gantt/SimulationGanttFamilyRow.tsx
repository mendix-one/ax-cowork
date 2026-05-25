import { Space, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { ScheduleFamily } from '../../data/mock-plan'
import { DAY_WIDTH, SIDEBAR_DATE, SIDEBAR_TASK } from './gantt-styles'
import { SimulationGanttBar } from './SimulationGanttBar'
import { SimulationGanttPriorityTag } from './SimulationGanttPriorityTag'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

type Props = {
  family: ScheduleFamily
  anchor: string
}

export const SimulationGanttFamilyRow = observer(({ family, anchor }: Props) => {
  const gantt = useSimulationContext().gantt
  const expanded = gantt.isFamilyExpanded(family.id)
  return (
    <tr>
      <td className="ax-gantt_task_cell" style={{ left: 0, minWidth: SIDEBAR_TASK, width: SIDEBAR_TASK, paddingInlineStart: 20 }}>
        <Space size={4} align="center" wrap={false}>
          <span className="ax-gantt_toggle_icon" onClick={() => gantt.toggleFamilyExpanded(family.id)}>
            <AxMuiIcon icon={expanded ? 'mdiChevronDown' : 'mdiChevronRight'} size={14} />
          </span>
          <Typography.Text className="ax-gantt_family_text" ellipsis>
            {family.label}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            {family.tech}
          </Typography.Text>
          <SimulationGanttPriorityTag p={family.priority} hot={family.hotLot} />
        </Space>
      </td>
      <td className="ax-gantt_num_cell" style={{ left: SIDEBAR_TASK, minWidth: SIDEBAR_DATE, width: SIDEBAR_DATE }}>
        {family.start}
      </td>
      <td className="ax-gantt_num_cell" style={{ left: SIDEBAR_TASK + SIDEBAR_DATE, minWidth: SIDEBAR_DATE, width: SIDEBAR_DATE }}>
        {family.end}
      </td>
      {gantt.horizonLabels.map((_, idx) => (
        <td key={idx} className="ax-gantt_day_cell" style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}>
          {idx === 0 && (
            <SimulationGanttBar
              variant="family"
              start={family.start}
              durationDays={family.durationDays}
              status={family.status}
              anchor={anchor}
              label={family.label}
            />
          )}
        </td>
      ))}
    </tr>
  )
})
