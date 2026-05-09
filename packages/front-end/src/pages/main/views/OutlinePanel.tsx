import { Button, Input, Space, Tree, Typography, theme } from 'antd'
import { EllipsisOutlined, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { outlineTree } from '../data'

const { Text } = Typography

export function OutlinePanel() {
  const { token } = theme.useToken()

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
        <Tree treeData={outlineTree} defaultExpandAll blockNode showLine selectable={false} />
      </div>
    </section>
  )
}
