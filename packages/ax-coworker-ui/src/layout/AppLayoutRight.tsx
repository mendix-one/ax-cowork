import { Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxMenuIcon } from '../shared/menu-icon/AxMenuIcon.tsx'

export const AppLayoutRight = observer(() => {
  return (
    <Layout.Sider width={36}>
      <Flex align="center" justify="space-between" gap="small" vertical style={{ width: '100%', height: '100%', paddingTop: '2px 4px' }}>
        <Flex align="center" justify="start" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            <AxMenuIcon icon="mdiBookOpenOutline" title={'Split View'} placement="left" onClick={() => console.log('click')} />
            <AxMenuIcon icon="mdiCreationOutline" title={'Generative AI'} placement="left" onClick={() => console.log('click')} />
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small" vertical style={{ width: '100%' }}>
          <Space size={8} vertical>
            <AxMenuIcon icon="mdiProgressStarFourPoints" title={'Progress'} placement="left" onClick={() => console.log('click')} />
            <AxMenuIcon icon="mdiFaceAgent" title={'Support'} placement="left" onClick={() => console.log('click')} />
            <AxMenuIcon icon="mdiInformationSlabCircleOutline" title={'Guides'} placement="left" onClick={() => console.log('click')} />
          </Space>
        </Flex>
      </Flex>
    </Layout.Sider>
  )
})
