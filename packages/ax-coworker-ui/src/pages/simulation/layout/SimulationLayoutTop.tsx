import { Avatar, Divider, Flex, Layout, Space, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import avatarLight from '@/assets/avatar-light.png'
import { useStore } from '@/acore/store/store.context'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import { AxMenuBox } from '@/shared/menu-box/AxMenuBox.tsx'
import { useSimulationContext } from '../store/simulation.context'

export const SimulationLayoutTop = observer(() => {
  const { t } = useTranslation('app')
  const { app } = useStore()
  const simulation = useSimulationContext()
  const line = simulation.activeProductionLine
  const plan = simulation.activeSimulationPlan
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
            <AxMenuBox
              icon="mdiDnsOutline"
              label={line.name}
              title={`Production Line: ${line.name}`}
              placement="bottom"
              onClick={() => simulation.openProductionLineModal()}
            />
            <AxMenuBox
              icon="mdiCardBulletedOutline"
              label={plan.name}
              title={`Simulation: ${plan.name}`}
              placement="bottom"
              onClick={() => simulation.openSimulationPlanModal()}
            />
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small">
          <Space size={8}>
            <AxMenuIcon icon="mdiBookOpenOutline" title={t('tooltip.splitView')} placement="bottom" />
          </Space>
          <Divider vertical style={{ height: '24px', margin: '0' }} className="ax-menu-divider" />
          <Space size={8}>
            <AxMenuIcon
              icon="mdiBellOutline"
              title={t('tooltip.notification')}
              placement="bottom"
              isActive={app.notifyModalOpen}
              onClick={() => app.openNotifyModal()}
            />
            <AxMenuIcon
              icon="mdiAccountCircleOutline"
              title={t('tooltip.userAccount')}
              placement="bottomRight"
              isActive={app.accountModalOpen}
              onClick={() => app.openAccountModal()}
            />
            <AxMenuIcon
              icon="mdiCogOutline"
              title={t('tooltip.systemSettings')}
              placement="bottomRight"
              isActive={app.settingModalOpen}
              onClick={() => app.openSettingModal()}
            />
          </Space>
        </Flex>
      </Flex>
    </Layout.Header>
  )
})
