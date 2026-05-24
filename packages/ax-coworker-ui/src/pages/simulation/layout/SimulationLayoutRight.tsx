import { Flex, Layout, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/acore/store/store.context'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import type { MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { useSimulationContext } from '../store/simulation.context'
import type { SubPanelId } from '../store/simulation.store'

type SubMenuItem = {
  id: SubPanelId
  icon: MdiIconName
  titleKey: string
}

const SUB_MENU_ITEMS: SubMenuItem[] = [
  { id: 'splitView', icon: 'mdiBookOpenOutline', titleKey: 'tooltip.splitView' },
  { id: 'aiAssistant', icon: 'mdiCreationOutline', titleKey: 'tooltip.generativeAI' },
  { id: 'progress', icon: 'mdiProgressStarFourPoints', titleKey: 'tooltip.tasksProgress' },
]

export const SimulationLayoutRight = observer(() => {
  const { t } = useTranslation('app')
  const { app } = useStore()
  const simulation = useSimulationContext()
  const rightVisible = !simulation.isHidden('regionRight')
  const active = simulation.activeSubPanel
  return (
    <Layout.Sider width={36}>
      <Flex align="center" justify="space-between" gap="small" vertical style={{ width: '100%', height: '100%', paddingTop: '2px 4px' }}>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            {SUB_MENU_ITEMS.map((item) => (
              <AxMenuIcon
                key={item.id}
                isActive={rightVisible && active === item.id}
                icon={item.icon}
                title={t(item.titleKey)}
                placement="left"
                onClick={() => simulation.toggleSubPanel(item.id)}
              />
            ))}
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            <AxMenuIcon
              icon="mdiFaceAgent"
              title={t('tooltip.support')}
              placement="left"
              isActive={app.supportModalOpen}
              onClick={() => app.openSupportModal()}
            />
            <AxMenuIcon
              icon="mdiInformationSlabCircleOutline"
              title={t('tooltip.guides')}
              placement="left"
              isActive={app.guidesModalOpen}
              onClick={() => app.openGuidesModal()}
            />
          </Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
})
