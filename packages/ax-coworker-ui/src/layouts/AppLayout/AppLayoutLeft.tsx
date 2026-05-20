import { Divider, Flex, Layout, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'

export const AppLayoutLeft = () => {
  const { t } = useTranslation('app')
  return (
    <Layout.Sider width={36}>
      <Flex align="center" justify="space-between" gap="small" vertical style={{ width: '100%', height: '100%', padding: '2px 4px' }}>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space vertical size={8}>
            <AxMenuIcon icon="mdiChartGantt" title="Simulation View" placement="right" />
            <AxMenuIcon icon="mdiChartBar" title="Analysis View" placement="right" />
            <AxMenuIcon icon="mdiFormatListBulletedType" title="Project List" placement="right" />
            <AxMenuIcon icon="mdiTableLarge" title="PM Data" placement="right" />
          </Space>
          <Divider style={{ margin: '0' }} className="ax-menu-divider" />
          <Space vertical size={8}>
            <AxMenuIcon icon="mdiTicketPercentOutline" title="Tunning Logic" placement="right" />
            <AxMenuIcon icon="mdiAlarmPanelOutline" title="PM Standard" placement="right" />
            <AxMenuIcon icon="mdiTicketOutline" title="Factor" placement="right" />
          </Space>
          <Divider style={{ margin: '0' }} className="ax-menu-divider" />
          <Space vertical size={8}>
            <AxMenuIcon icon="mdiDatabaseOutline" title="Data Archving" placement="right" />
            <AxMenuIcon icon="mdiDatabaseOutline" title="Data Integration" placement="right" />
            <AxMenuIcon icon="mdiDatabaseOutline" title="Data Archving" placement="right" />
          </Space>
        </Flex>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space vertical size={8}>
            <AxMenuIcon icon="mdiTrayFull" title={t('tooltip.output')} placement="right" />
            <AxMenuIcon icon="mdiConsole" title={t('tooltip.console')} placement="right" />
          </Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
}
