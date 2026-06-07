import { Avatar, Flex, Layout, Space, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import avatarLight from '@/assets/avatar-light.png'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'

export const AuthLayoutTop = () => {
  const { t } = useTranslation('app')
  return (
    <Layout.Header
      className="ax-layout-top"
      // Float over the full-screen main with a transparent background so the animated layer shows through.
      style={{ position: 'absolute', top: 0, insetInline: 0, zIndex: 20, background: 'transparent' }}
    >
      <Flex align="center" justify="space-between" gap="small" style={{ height: '100%' }}>
        <Flex align="center" justify="start" gap="medium">
          <Space>
            <Flex align="center" justify="center" style={{ width: '24px', height: '24px' }}>
              <Tooltip title={t('tooltip.amai')} placement="bottomLeft">
                <Avatar size={22} src={<img draggable={false} src={avatarLight} alt="avatar" />} />
              </Tooltip>
            </Flex>
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small">
          <Space size={8}>
            <AxMenuIcon icon="mdiCogOutline" title={t('tooltip.systemSettings')} placement="bottomRight" />
          </Space>
        </Flex>
      </Flex>
    </Layout.Header>
  )
}
