import { Avatar, Flex, Layout, Space, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import avatarLight from '@/assets/avatar-light.png'
import { useStore } from '@/acore/store/store.context'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import { useTranslation } from 'react-i18next'

// Top bar — same chrome as the EPS / MPS / App shell (brand on the left, account controls on the right),
// trimmed to what the landing page needs. The notify / account / settings modals are mounted by PageLayout;
// their open state lives in the root app store.
export const HomeLayoutTop = observer(() => {
  const { app } = useStore()
  const { t } = useTranslation('app')
  return (
    <Layout.Header className="ax-layout-top">
      <Flex align="center" justify="space-between" gap="small" style={{ height: '100%' }}>
        <Flex align="center" justify="start" gap="middle">
          <Space>
            <Flex align="center" justify="center" style={{ width: '24px', height: '24px' }}>
              <Tooltip title={t('tooltip.aplanner')} placement="bottomLeft">
                <Avatar size={22} src={<img draggable={false} src={avatarLight} alt="avatar" />} />
              </Tooltip>
            </Flex>
          </Space>
          <Space size={8}>
            <AxMenuIcon icon="mdiApps" title="Home" placement="bottom" />
            <AxMenuIcon icon="mdiEarth" title="World Map" placement="bottom" />
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small">
          <Space size={8}>
            <AxMenuIcon icon="mdiBellOutline" title="Notifications" placement="bottom" isActive={app.notifyModalOpen} onClick={() => app.openNotifyModal()} />
            <AxMenuIcon
              icon="mdiAccountCircleOutline"
              title="Account"
              placement="bottomRight"
              isActive={app.accountModalOpen}
              onClick={() => app.openAccountModal()}
            />
            <AxMenuIcon icon="mdiCogOutline" title="Settings" placement="bottomRight" isActive={app.settingModalOpen} onClick={() => app.openSettingModal()} />
          </Space>
        </Flex>
      </Flex>
    </Layout.Header>
  )
})
