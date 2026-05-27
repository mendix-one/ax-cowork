import { Avatar, Divider, Flex, Layout, Space, Tag, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import avatarLight from '@/assets/avatar-light.png'
import { useStore } from '@/acore/store/store.context'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import { AxMenuBox } from '@/shared/menu-box/AxMenuBox.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { useSimulationContext } from '../store/simulation.context'

// Compact day-count between two ISO-date strings (inclusive). Used by the header horizon chip so the planner
// always knows the working window without leaving for the Gantt toolbar.
const formatHorizon = (start: string, end: string): string => {
  const s = new Date(start)
  const e = new Date(end)
  const days = Math.max(1, Math.round((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000)) + 1)
  if (days % 7 === 0) return `${days / 7} week${days === 7 ? '' : 's'}`
  return `${days} day${days === 1 ? '' : 's'}`
}

const formatShortDate = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const SimulationLayoutTop = observer(() => {
  const { t } = useTranslation('app')
  const { app } = useStore()
  const simulation = useSimulationContext()
  const line = simulation.activeProductionLine
  const plan = simulation.activeSimulationPlan
  const edits = simulation.totalUnsavedEdits
  const horizonStart = simulation.gantt.startDate
  const horizonEnd = simulation.gantt.endDate
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
            {/* Draft / scenario status pill — for now every Simulation plan is a draft. Wired to plan.status when BE lands. */}
            <Tag color="purple" className="ax-top_chip">
              DRAFT
            </Tag>
            {/* Horizon chip — the working time window in human form. Same instant feedback as the date pickers
                inside the Gantt toolbar, but visible from every panel so the planner never forgets the scope. */}
            <Tooltip title={`Planning horizon: ${horizonStart} → ${horizonEnd}`}>
              <Tag bordered className="ax-top_chip ax-top_chip__horizon">
                <AxMuiIcon icon="mdiCalendarRange" size={12} />
                <span>
                  {formatShortDate(horizonStart)} → {formatShortDate(horizonEnd)}
                </span>
                <span className="ax-top_chip_muted">· {formatHorizon(horizonStart, horizonEnd)}</span>
              </Tag>
            </Tooltip>
            {edits > 0 && (
              <Tooltip title={`${edits} unsaved edit${edits === 1 ? '' : 's'} — open Save menu on the Gantt to commit`}>
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
