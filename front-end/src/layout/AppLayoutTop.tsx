import { Avatar, Divider, Flex, Layout, Space, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxMenuIcon } from '../shared/menu-icon/AxMenuIcon.tsx'

import avatarLight from '../assets/avatar-light.png'
import { AxMenuBox } from '../shared/menu-box/AxMenuBox.tsx'
import { AxDocItem } from '../shared/doc-item/AxDocItem.tsx'

export const AppLayoutTop = observer(() => {
  return (
    <Layout.Header className="ax-layout-top">
      <Flex align="center" justify="space-between" gap="small" style={{ height: '100%' }}>
        <Flex align="center" justify="start" gap="medium">
          <Space>
            <Flex align="center" justify="center" style={{ width: '24px', height: '24px' }}>
              <Tooltip title="AMAI - Amoza AI Assistant" placement="bottomLeft">
                <Avatar size={22} src={<img draggable={false} src={avatarLight} alt="avatar" />} />
              </Tooltip>
            </Flex>
          </Space>
          <Space size={8}>
            <AxMenuBox icon="mdiFolderOutline" label="aPlanner" />
            <AxMenuBox icon="mdiSourceBranch" label="Main" />
          </Space>
        </Flex>
        <Flex align="center" justify="end" gap="small">
          <Space size={8}>
            <AxDocItem icon="mdiFileDocumentOutline" name="Document Name" title={`Document Name`} />
            <AxDocItem icon="mdiFileDocumentOutline" name="Document Name" title={`Document Name`} />
            <AxDocItem icon="mdiFileDocumentOutline" name="Document Name" title={`Document Name`} />
            <AxDocItem icon="mdiFileDocumentOutline" name="Document Name" title={`Document Name`} />
            <AxMenuIcon icon="mdiArrowDownDropCircleOutline" title={'More Items'} placement="bottom" onClick={() => console.log('click')} />
          </Space>
          <Divider vertical style={{ height: '24px', margin: '0' }} className="ax-menu-divider" />
          <Space size={8}>
            <AxMenuIcon icon="mdiBookOpenOutline" title={'Split View'} placement="bottom" onClick={() => console.log('click')} />
          </Space>
          <Divider vertical style={{ height: '24px', margin: '0' }} className="ax-menu-divider" />
          <Space size={8}>
            <AxMenuIcon icon="mdiMagnify" title={'Global Search'} placement="bottom" onClick={() => console.log('click')} />
            <AxMenuIcon icon="mdiBellOutline" title={'Notification'} placement="bottom" onClick={() => console.log('click')} />
            <AxMenuIcon icon="mdiAccountCircleOutline" title={'User Account'} placement="bottomRight" onClick={() => console.log('click')} />
            <AxMenuIcon icon="mdiCogOutline" title={'System Settings'} placement="bottomRight" onClick={() => console.log('click')} />
          </Space>
        </Flex>
      </Flex>
    </Layout.Header>
  )
})
