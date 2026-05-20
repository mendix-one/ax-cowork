import { Divider, Flex, Layout, Space } from 'antd'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'

export const SimulationLayoutLeft = () => {
  // const { t } = useTranslation('app')
  return (
    <Layout.Sider width={36}>
      <Flex align="center" justify="space-between" gap="small" vertical style={{ width: '100%', height: '100%', padding: '2px 4px' }}>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space vertical size={8}>
            <AxMenuIcon isActive icon="mdiChartGantt" title="Simulation View" placement="right" />
            <AxMenuIcon icon="mdiChartBar" title="Analysis View" placement="right" />
            <AxMenuIcon icon="mdiFormatListBulletedType" title="Project List" placement="right" />
            <AxMenuIcon icon="mdiTableLarge" title="PM Data" placement="right" />
          </Space>
          <Divider style={{ margin: '0' }} className="ax-menu-divider" />
          <Space vertical size={8}>
            <AxMenuIcon icon="mdiTicketPercentOutline" title="Tunning Logic" placement="right" />
            <AxMenuIcon icon="mdiHubOutline" title="Factors Control" placement="right" />
            <AxMenuIcon icon="mdiAlarmPanelOutline" title="PM Standard" placement="right" />
          </Space>
          <Divider style={{ margin: '0' }} className="ax-menu-divider" />
          <Space vertical size={8}>
            <AxMenuIcon icon="mdiCogs" title="Line Setting" placement="right" />
            <AxMenuIcon icon="mdiTransitConnectionVariant" title="System Integration" placement="right" />
            <AxMenuIcon icon="mdiDatabaseOutline" title="Data Monitor" placement="right" />
          </Space>
        </Flex>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space vertical size={8}></Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
}
