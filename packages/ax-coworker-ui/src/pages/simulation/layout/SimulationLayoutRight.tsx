import { Flex, Layout, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { observer } from 'mobx-react-lite'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import { simulationStore, type PanelId } from '../store/simulation.store.ts'

const togglePanel = (id: PanelId) => {
  if (simulationStore.isHidden(id)) {
    simulationStore.restore(id)
  } else {
    simulationStore.hide(id)
  }
}

export const SimulationLayoutRight = observer(() => {
  const { t } = useTranslation('app')
  const rightTopVisible = !simulationStore.isHidden('regionRightTop')
  const rightBottomVisible = !simulationStore.isHidden('regionRightBottom')
  return (
    <Layout.Sider width={36}>
      <Flex align="center" justify="space-between" gap="small" vertical style={{ width: '100%', height: '100%', paddingTop: '2px 4px' }}>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            <AxMenuIcon icon="mdiBookOpenOutline" title={t('tooltip.splitView')} placement="left" />
            <AxMenuIcon
              isActive={rightTopVisible}
              icon="mdiCreationOutline"
              title={t('tooltip.generativeAI')}
              placement="left"
              onClick={() => togglePanel('regionRightTop')}
            />
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            <AxMenuIcon
              isActive={rightBottomVisible}
              icon="mdiProgressStarFourPoints"
              title={t('tooltip.progress')}
              placement="left"
              onClick={() => togglePanel('regionRightBottom')}
            />
            <AxMenuIcon icon="mdiFaceAgent" title={t('tooltip.support')} placement="left" />
            <AxMenuIcon icon="mdiInformationSlabCircleOutline" title={t('tooltip.guides')} placement="left" />
          </Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
})
