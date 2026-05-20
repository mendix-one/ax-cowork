import { Divider, Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import type { MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { simulationStore, type MainPanelId } from '../store/simulation.store.ts'

type MenuItem = {
  id: MainPanelId
  icon: MdiIconName
  title: string
}

const GROUP_PRIMARY: MenuItem[] = [
  { id: 'gantt', icon: 'mdiChartGantt', title: 'Simulation View' },
  { id: 'analysis', icon: 'mdiChartBar', title: 'Analysis View' },
  { id: 'project', icon: 'mdiFormatListBulletedType', title: 'Project List' },
  { id: 'dataset', icon: 'mdiTableLarge', title: 'PM Data' },
]

const GROUP_TUNING: MenuItem[] = [
  { id: 'tuning', icon: 'mdiTicketPercentOutline', title: 'Tunning Logic' },
  { id: 'factor', icon: 'mdiHubOutline', title: 'Factors Control' },
  { id: 'standard', icon: 'mdiAlarmPanelOutline', title: 'PM Standard' },
]

const GROUP_SYSTEM: MenuItem[] = [
  { id: 'setting', icon: 'mdiCogs', title: 'Line Setting' },
  { id: 'integration', icon: 'mdiTransitConnectionVariant', title: 'System Integration' },
  { id: 'schema', icon: 'mdiDatabaseOutline', title: 'Data Monitor' },
]

export const SimulationLayoutLeft = observer(() => {
  const active = simulationStore.activeMainPanel
  const renderItem = (item: MenuItem) => (
    <AxMenuIcon
      key={item.id}
      icon={item.icon}
      title={item.title}
      placement="right"
      isActive={active === item.id}
      onClick={() => simulationStore.setActiveMainPanel(item.id)}
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
