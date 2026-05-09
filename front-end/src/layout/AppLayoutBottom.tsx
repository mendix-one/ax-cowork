import { Flex, Layout, Space } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxBreadcrumb } from '../shared/breadcrumb/AxBreadcrumb.tsx'
import { AxIconBox } from '../shared/icon-box/AxIconBox.tsx'
import { AxChatItem } from '../shared/chat-item/AxChatItem.tsx'
import { AxMenuIcon } from '../shared/menu-icon/AxMenuIcon.tsx'

export const AppLayoutBottom = observer(() => {
  return (
    <Layout.Footer>
      <Flex align="center" justify="space-between" gap="small" style={{ height: '36px' }}>
        <Flex align="center" justify="start" gap="small">
          <AxBreadcrumb icon="mdiCardTextOutline" label="aPlanner" />
          <AxIconBox icon="mdiChevronRight" size={20} className="ax-breadcrumb_divider" />
          <AxBreadcrumb icon="mdiCardTextOutline" label="Discover" />
          <AxIconBox icon="mdiChevronRight" size={20} className="ax-breadcrumb_divider" />
          <AxBreadcrumb icon="mdiCardTextOutline" label="Planning" />
          <AxIconBox icon="mdiChevronRight" size={20} className="ax-breadcrumb_divider" />
          <AxBreadcrumb icon="mdiCardTextOutline" label="Objectives & Plan" />
        </Flex>
        <Flex align="center" justify="end" gap="small">
          <Space>
            <AxChatItem name="Logan Ng - CPO" count={3} title={`Logan Ng - CPO: 3 messages`} />
            <AxChatItem name="Logan Ng - CPO" count={3} title={`Logan Ng - CPO: 3 messages`} />
            <AxChatItem name="Logan Ng - CPO" count={3} title={`Logan Ng - CPO: 3 messages`} />
            <AxChatItem name="Logan Ng - CPO" count={3} title={`Logan Ng - CPO: 3 messages`} />
            <AxMenuIcon icon="mdiArrowUpDropCircleOutline" title={'More Items'} placement="topRight" onClick={() => console.log('click')} />
          </Space>
        </Flex>
      </Flex>
    </Layout.Footer>
  )
})
