import { Avatar, Divider, Flex, Layout, Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import avatarLight from '@/assets/avatar-light.png'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import { AxMenuBox } from '@/shared/menu-box/AxMenuBox.tsx'
import { AxDocItem } from '@/shared/doc-item/AxDocItem.tsx'

export const SimulationLayoutTop = () => {
  const { t } = useTranslation('app')
  const navigate = useNavigate()
  return (
    <Layout.Header className="ax-layout-top">
      <Flex align="center" justify="space-between" gap="small" style={{ height: '100%' }}>
        <Flex align="center" justify="start" gap="medium">
          <Space>
            <Flex align="center" justify="center" style={{ width: '24px', height: '24px' }}>
              <Tooltip title={t('tooltip.amai')} placement="bottomLeft">
                <Avatar size={22} src={<img draggable={false} src={avatarLight} alt="avatar" />} />
              </Tooltip>
            </Flex>
          </Space>
          <Space size={8}>
            <AxMenuIcon icon="mdiApps" title="Home" placement="bottom" />
            <AxMenuIcon icon="mdiEarth" title="World Map" placement="bottom" />
          </Space>
          <Space size={8}>
            <AxMenuBox icon="mdiDnsOutline" label="M-SOC" title="Production Line: M-SOC" placement="bottom" />
            <AxMenuBox icon="mdiCardBulletedOutline" label="Plan A (Simulation)" title="Simulation: Plan A" placement="bottom" />
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small">
          <Space size={8}>
            <AxDocItem icon="mdiFileDocumentOutline" name="Q1 status report" title="Markdown demo (chart + table)" onClick={() => navigate('/docs/demo')} />
            <AxDocItem icon="mdiFileDocumentOutline" name="Document Name" title="Document Name" />
            <AxDocItem icon="mdiFileDocumentOutline" name="Document Name" title="Document Name" />
            <AxDocItem icon="mdiFileDocumentOutline" name="Document Name" title="Document Name" />
            <AxMenuIcon icon="mdiArrowDownDropCircleOutline" title={t('tooltip.moreItems')} placement="bottom" />
          </Space>
          <Divider vertical style={{ height: '24px', margin: '0' }} className="ax-menu-divider" />
          <Space size={8}>
            <AxMenuIcon icon="mdiBookOpenOutline" title={t('tooltip.splitView')} placement="bottom" />
          </Space>
          <Divider vertical style={{ height: '24px', margin: '0' }} className="ax-menu-divider" />
          <Space size={8}>
            <AxMenuIcon icon="mdiMagnify" title={t('tooltip.globalSearch')} placement="bottom" />
            <AxMenuIcon icon="mdiBellOutline" title={t('tooltip.notification')} placement="bottom" />
            <AxMenuIcon icon="mdiAccountCircleOutline" title={t('tooltip.userAccount')} placement="bottomRight" />
            <AxMenuIcon icon="mdiCogOutline" title={t('tooltip.systemSettings')} placement="bottomRight" />
          </Space>
        </Flex>
      </Flex>
    </Layout.Header>
  )
}
