import { Avatar, Button, Space, Tabs, theme } from 'antd'
import { EllipsisOutlined, FileTextOutlined, ShareAltOutlined } from '@ant-design/icons'

const items = [
  {
    key: 'doc1',
    label: (
      <Space size={6}>
        <FileTextOutlined />
        Document Name
      </Space>
    ),
    closable: false,
  },
  {
    key: 'doc2',
    label: (
      <Space size={6}>
        <FileTextOutlined />
        Document Name
      </Space>
    ),
  },
  {
    key: 'doc3',
    label: (
      <Space size={6}>
        <FileTextOutlined />
        Document Name
      </Space>
    ),
  },
  {
    key: 'doc4',
    label: (
      <Space size={6}>
        <FileTextOutlined />
        Document Name
      </Space>
    ),
  },
]

export function DocumentTabs() {
  const { token } = theme.useToken()
  return (
    <div
      className="main-page__tabs"
      style={{
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Tabs type="editable-card" activeKey="doc1" items={items} hideAdd={false} className="main-page__tabs-bar" />
      <Space size="small">
        <Avatar.Group max={{ count: 4 }} size="small">
          {['L', 'M', 'P', 'R', 'K'].map((c) => (
            <Avatar key={c} size="small">
              {c}
            </Avatar>
          ))}
        </Avatar.Group>
        <Button type="primary" size="small" icon={<ShareAltOutlined />}>
          Share
        </Button>
        <Button type="text" size="small" icon={<EllipsisOutlined />} />
      </Space>
    </div>
  )
}
