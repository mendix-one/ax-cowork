import { Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/acore/store/store.context'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import type { MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { useSimulationContext } from '../store/simulation.context'
import type { SubPanelId } from '../store/simulation.store'

type SubMenuItem = {
  id: SubPanelId
  icon: MdiIconName
  title: string
}

const SUB_MENU_ITEMS: SubMenuItem[] = [
  { id: 'compare', icon: 'mdiBookOpenOutline', title: 'Compare / Split' },
  { id: 'aiChat', icon: 'mdiCreationOutline', title: 'AI Chatbox' },
  { id: 'background', icon: 'mdiProgressStarFourPoints', title: 'Background Tasks' },
  { id: 'history', icon: 'mdiHistory', title: 'Schedule Change History' },
  { id: 'recommendations', icon: 'mdiLightbulbOnOutline', title: 'Recommendations' },
]

export const SimulationLayoutRight = observer(() => {
  const { app } = useStore()
  const simulation = useSimulationContext()
  const rightVisible = !simulation.isHidden('regionRight')
  const active = simulation.activeSubPanel
  return (
    <Layout.Sider width={'2.65rem'}>
      <Flex align="center" justify="space-between" gap="small" vertical style={{ width: '100%', height: '100%', paddingTop: '0.25rem' }}>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            {SUB_MENU_ITEMS.map((item) => (
              <AxMenuIcon
                key={item.id}
                isActive={rightVisible && active === item.id}
                icon={item.icon}
                title={item.title}
                placement="left"
                onClick={() => simulation.toggleSubPanel(item.id)}
              />
            ))}
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            <AxMenuIcon icon="mdiFaceAgent" title="Support" placement="left" isActive={app.supportModalOpen} onClick={() => app.openSupportModal()} />
            <AxMenuIcon
              icon="mdiInformationSlabCircleOutline"
              title="Guides"
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
