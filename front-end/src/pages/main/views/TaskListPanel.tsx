import { Badge, Button, List, Segmented, Space, Tag, Typography, theme } from 'antd'
import { CheckCircleFilled, EllipsisOutlined, FlagOutlined, PlusOutlined } from '@ant-design/icons'
import { tasks } from '../data'

const { Text } = Typography

export function TaskListPanel() {
  const { token } = theme.useToken()

  return (
    <section className="panel" style={{ background: token.colorBgContainer }}>
      <header className="panel__head" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <Space size={6}>
          <FlagOutlined style={{ color: token.colorPrimary }} />
          <Text strong>Task List</Text>
        </Space>
        <Space size={2}>
          <Button type="text" size="small" icon={<PlusOutlined />} />
          <Button type="text" size="small" icon={<EllipsisOutlined />} />
        </Space>
      </header>
      <div className="panel__toolbar">
        <Segmented size="small" block options={['Status', 'Priority']} defaultValue="Status" />
      </div>
      <div className="panel__body">
        <List
          size="small"
          dataSource={tasks}
          renderItem={(t) => (
            <List.Item className="panel__row">
              <Space size={8} style={{ flex: 1, minWidth: 0 }}>
                {t.status === 'done' ? (
                  <CheckCircleFilled style={{ color: token.colorSuccess }} />
                ) : (
                  <Badge status={t.status === 'doing' ? 'processing' : 'default'} />
                )}
                <Text ellipsis style={{ flex: 1 }}>
                  {t.title}
                </Text>
              </Space>
              <Tag color={t.priority === 'P1' ? 'red' : 'blue'} style={{ marginInlineEnd: 0 }}>
                {t.priority}
              </Tag>
            </List.Item>
          )}
        />
      </div>
    </section>
  )
}
