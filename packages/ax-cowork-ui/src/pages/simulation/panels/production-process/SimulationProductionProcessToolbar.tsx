import { Button, Flex, Space, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Process view is read-only — no date picker, no save/undo. Just the adjustment toggle so the planner
// can re-filter what POs are in scope and see the tech rollups respond live.
export const SimulationProductionProcessToolbar = observer(() => {
  const process = useSimulationContext().productionProcess
  return (
    <Flex align="center" justify="space-between" gap="small" className="ax-gantt_toolbar" style={{ width: '100%' }}>
      <Space size={10}>
        <Tooltip title={process.filterSidebarOpen ? 'Hide adjustment sidebar' : 'Show adjustment sidebar'}>
          <Button
            size="small"
            type={process.filterSidebarOpen ? 'primary' : 'default'}
            icon={<AxMuiIcon icon="mdiFilterMenuOutline" size={14} />}
            onClick={() => process.toggleFilterSidebar()}
          />
        </Tooltip>
        <Typography.Text type="secondary" className="text-sm">
          Read-only view of the manufacturing routing per technology.
        </Typography.Text>
      </Space>
    </Flex>
  )
})
