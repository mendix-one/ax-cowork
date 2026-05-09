import { Avatar, Button, Divider, Input, List, Space, Typography, theme } from 'antd'
import { EllipsisOutlined, MessageOutlined, PaperClipOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons'
import { comments } from '../data'

const { Text } = Typography

export function CommentsPanel() {
  const { token } = theme.useToken()

  return (
    <section className="panel" style={{ background: token.colorBgContainer }}>
      <header className="panel__head" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <Space size={6}>
          <MessageOutlined style={{ color: token.colorPrimary }} />
          <Text strong>Comments</Text>
        </Space>
        <Button type="text" size="small" icon={<EllipsisOutlined />} />
      </header>
      <div className="panel__body panel__body--scroll panel__body--padded">
        <Space size={8} align="center">
          <Avatar size="small">M</Avatar>
          <div>
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
              Opened by
            </Text>
            <div>
              <Text strong>Marcus W.</Text>
            </div>
          </div>
        </Space>
        <Divider style={{ margin: `${token.marginSM}px 0` }} />
        <List
          size="small"
          split={false}
          dataSource={comments}
          renderItem={(c) => (
            <List.Item style={{ alignItems: 'flex-start', padding: '6px 0' }}>
              <List.Item.Meta
                avatar={<Avatar size="small">{c.initial}</Avatar>}
                title={
                  <Space size={6}>
                    <Text strong>{c.author}</Text>
                    <Text type="secondary" style={{ fontSize: token.fontSizeSM, fontWeight: 400 }}>
                      {c.time}
                    </Text>
                  </Space>
                }
                description={<Text>{c.body}</Text>}
              />
            </List.Item>
          )}
        />
      </div>
      <footer className="panel__foot" style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}>
        <Input.TextArea rows={2} placeholder="Reply…" autoSize={{ minRows: 2, maxRows: 4 }} />
        <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: token.marginXS }}>
          <Space size={2}>
            <Button type="text" size="small" icon={<PaperClipOutlined />} />
            <Button type="text" size="small" icon={<SmileOutlined />} />
          </Space>
          <Button type="primary" size="small" icon={<SendOutlined />}>
            Send
          </Button>
        </Space>
      </footer>
    </section>
  )
}
