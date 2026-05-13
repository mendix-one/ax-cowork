import { Button, Input, Space, Tree, Typography, theme } from 'antd'
import { EllipsisOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/acore/store/store.context'

const { Text } = Typography

export const OutlinePanel = observer(() => {
  const { token } = theme.useToken()
  const { documents } = useStore()

  return (
    <section className="panel" style={{ background: token.colorBgContainer }}>
      <header className="panel__head" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <Space size={6}>
          <UnorderedListOutlined style={{ color: token.colorPrimary }} />
          <Text strong>Outline</Text>
        </Space>
        <Button type="text" size="small" icon={<EllipsisOutlined />} />
      </header>
      <div className="panel__toolbar">
        <Input size="small" prefix={<SearchOutlined />} placeholder="Document Name" allowClear />
      </div>
      <div className="panel__body panel__body--padded">
        <Tree treeData={documents.outline} defaultExpandAll blockNode showLine selectable={false} />
      </div>
    </section>
  )
})
