import { Avatar, Divider, Flex, Layout, Space, Tag, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import avatarLight from '@/assets/avatar-light.png'
import { useStore } from '@/acore/store/store.context'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import { AxMenuBox } from '@/shared/menu-box/AxMenuBox.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { useMpsContext } from '../stores/mps.context'

export const MpsLayoutTop = observer(() => {
  const { t } = useTranslation('app')
  const { app } = useStore()
  const sim = useMpsContext()
  const navigate = useNavigate()
  const line = sim.activeProductionLine
  const plan = sim.activeMpsPlan
  const edits = sim.totalUnsavedEdits
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
            <AxMenuIcon icon="mdiApps" title="Home" placement="bottom" onClick={() => navigate('/')} />
            <AxMenuIcon icon="mdiEarth" title="World Map" placement="bottom" />
          </Space>
          {/* align="center" so the chips (22px) sit on the same midline as the AxMenuBox controls (28px) —
              without it, AntD Space defaults to baseline alignment and the chips drift up by 1-2px. */}
          <Space size={8} align="center">
            <AxMenuBox
              icon="mdiDnsOutline"
              label={line.name}
              title={`Production Line: ${line.name}`}
              placement="bottom"
              onClick={() => sim.openProductionLineModal()}
            />
            <AxMenuBox
              icon="mdiCardBulletedOutline"
              label={plan.name}
              title={`Simulation: ${plan.name}`}
              placement="bottom"
              onClick={() => sim.openMpsPlanModal()}
            />
            {/* Draft / scenario status pill — for now every Simulation plan is a draft. Wired to plan.status when BE lands. */}
            <Tag color="purple" className="ax-top_chip">
              DRAFT
            </Tag>
            {edits > 0 && (
              <Tooltip title={`${edits} unsaved edit${edits === 1 ? '' : 's'} across this simulation — open the Save menu on any panel to commit`}>
                <Tag bordered color="warning" icon={<AxMuiIcon icon="mdiCircleMedium" size={11} />} className="ax-top_chip ax-top_chip__unsaved">
                  {edits} unsaved
                </Tag>
              </Tooltip>
            )}
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
