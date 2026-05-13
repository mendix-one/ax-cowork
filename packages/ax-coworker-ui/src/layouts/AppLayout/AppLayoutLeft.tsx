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
            <AxMenuIcon icon="mdiDnsOutline" title={t('tooltip.project')} placement="right" />
            <AxMenuIcon icon="mdiInboxFullOutline" title={t('tooltip.inbox')} placement="right" />
            <AxMenuIcon icon="mdiCardTextOutline" title={t('tooltip.task')} placement="right" />
          </Space>
          <Divider style={{ margin: '0' }} className="ax-menu-divider" />
          <Space vertical size={8}>
            <AxMenuIcon icon="mdiSourceCommit" title={t('tooltip.commit')} placement="right" />
            <AxMenuIcon icon="mdiSourcePull" title={t('tooltip.pullRequest')} placement="right" />
            <AxMenuIcon icon="mdiSourceBranch" title={t('tooltip.branch')} placement="right" />
          </Space>
          <Divider style={{ margin: '0' }} className="ax-menu-divider" />
          <Space vertical size={8}>
            <AxMenuIcon icon="mdiCalendarMonthOutline" title={t('tooltip.calendar')} placement="right" />
            <AxMenuIcon icon="mdiHubOutline" title={t('tooltip.channel')} placement="right" />
            <AxMenuIcon icon="mdiMessageTextOutline" title={t('tooltip.chat')} placement="right" />
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
