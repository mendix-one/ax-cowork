import { Space, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { ScheduleBatch } from '../../data/mock-plan'
import { DAY_WIDTH, SIDEBAR_DATE, SIDEBAR_TASK } from './gantt-styles'
import { SimulationGanttBar } from './SimulationGanttBar'

type Props = {
  batch: ScheduleBatch
  anchor: string
}

export const SimulationGanttBatchRow = observer(({ batch, anchor }: Props) => {
  const gantt = useSimulationContext().gantt
  return (
    <tr>
      <td className="ax-gantt_task_cell" style={{ left: 0, minWidth: SIDEBAR_TASK, width: SIDEBAR_TASK, paddingInlineStart: 44 }}>
        <Space size={6} align="center" wrap={false}>
          <Typography.Text className="ax-gantt_batch_text">{batch.name}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            {batch.waferCount} wafers
          </Typography.Text>
        </Space>
      </td>
      <td className="ax-gantt_num_cell" style={{ left: SIDEBAR_TASK, minWidth: SIDEBAR_DATE, width: SIDEBAR_DATE }}>
        {batch.start}
      </td>
      <td className="ax-gantt_num_cell" style={{ left: SIDEBAR_TASK + SIDEBAR_DATE, minWidth: SIDEBAR_DATE, width: SIDEBAR_DATE }}>
        {batch.end}
      </td>
      {gantt.horizonLabels.map((_, idx) => (
        <td key={idx} className="ax-gantt_day_cell" style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}>
          {idx === 0 && (
            <SimulationGanttBar
              variant="batch"
              start={batch.start}
              durationDays={batch.durationDays}
              status={batch.status}
              anchor={anchor}
              label={batch.name}
              note={batch.note}
            />
          )}
        </td>
      ))}
    </tr>
  )
})
