import { Tag } from 'antd'
import { observer } from 'mobx-react-lite'
import type { ProductionOrder } from '../../data/mock-plan'

type Props = {
  p: ProductionOrder['priority']
  hot?: boolean
}

export const SimulationGanttPriorityTag = observer(({ p, hot }: Props) => {
  const color = hot ? 'purple' : p === 'P1' ? 'red' : p === 'P2' ? 'orange' : p === 'P-NPI' ? 'cyan' : 'blue'
  return <Tag color={color}>{hot ? `★ ${p}` : p}</Tag>
})
