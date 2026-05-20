import { Flex, Layout, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'

export const SimulationLayoutRight = () => {
  const { t } = useTranslation('app')
  return (
    <Layout.Sider width={36}>
      <Flex align="center" justify="space-between" gap="small" vertical style={{ width: '100%', height: '100%', paddingTop: '2px 4px' }}>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            <AxMenuIcon icon="mdiBookOpenOutline" title={t('tooltip.splitView')} placement="left" />
            <AxMenuIcon isActive icon="mdiCreationOutline" title={t('tooltip.generativeAI')} placement="left" />
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            <AxMenuIcon isActive icon="mdiProgressStarFourPoints" title={t('tooltip.progress')} placement="left" />
            <AxMenuIcon icon="mdiFaceAgent" title={t('tooltip.support')} placement="left" />
            <AxMenuIcon icon="mdiInformationSlabCircleOutline" title={t('tooltip.guides')} placement="left" />
          </Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
}
