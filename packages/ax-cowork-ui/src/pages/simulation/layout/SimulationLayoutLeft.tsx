import { Divider, Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import type { MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { useSimulationContext } from '../store/simulation.context'
import type { MainPanelId } from '../store/simulation.store'

type MenuItem = {
  id: MainPanelId
  icon: MdiIconName
  title: string
}

const GROUP_PRIMARY: MenuItem[] = [
  { id: 'gantt', icon: 'mdiChartGantt', title: 'Gantt (Simulation)' },
  { id: 'analysis', icon: 'mdiChartBar', title: 'Analysis View' },
  { id: 'productionOrder', icon: 'mdiClipboardListOutline', title: 'Production Order' },
  { id: 'shopFloor', icon: 'mdiFactory', title: 'Shop Floor Capacity' },
]

const GROUP_TUNING: MenuItem[] = [
  { id: 'processTuning', icon: 'mdiTuneVerticalVariant', title: 'Process Tuning Logic' },
  { id: 'capacityTuning', icon: 'mdiCogTransferOutline', title: 'Capacity Tuning Logic' },
]

const GROUP_SYSTEM: MenuItem[] = [{ id: 'dataIntegration', icon: 'mdiTransitConnectionVariant', title: 'Data Integration' }]

export const SimulationLayoutLeft = observer(() => {
  const simulation = useSimulationContext()
  const active = simulation.activeMainPanel
  const renderItem = (item: MenuItem) => (
    <AxMenuIcon
      key={item.id}
      icon={item.icon}
      title={item.title}
      placement="right"
      isActive={active === item.id}
      onClick={() => simulation.setActiveMainPanel(item.id)}
    />
  )
  return (
    <Layout.Sider width={36}>
      <Flex align="center" justify="space-between" gap="small" vertical style={{ width: '100%', height: '100%', padding: '2px 4px' }}>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space vertical size={8}>
            {GROUP_PRIMARY.map(renderItem)}
          </Space>
          <Divider style={{ margin: '0' }} className="ax-menu-divider" />
          <Space vertical size={8}>
            {GROUP_TUNING.map(renderItem)}
          </Space>
          <Divider style={{ margin: '0' }} className="ax-menu-divider" />
          <Space vertical size={8}>
            {GROUP_SYSTEM.map(renderItem)}
          </Space>
        </Flex>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space vertical size={8}></Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
})
