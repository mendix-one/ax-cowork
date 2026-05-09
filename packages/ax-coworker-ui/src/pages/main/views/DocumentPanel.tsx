import { Breadcrumb, Button, Space, Table, Tag, Typography, theme } from 'antd'
import { EditOutlined, EllipsisOutlined, FileTextOutlined, HistoryOutlined, StarOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { stack, type StackRow } from '../data'

const { Title, Paragraph, Text } = Typography

export function DocumentPanel() {
  const { token } = theme.useToken()

  const columns: ColumnsType<StackRow> = [
    { title: 'Category', dataIndex: 'category', key: 'category', width: 200 },
    { title: 'Tech Stack', dataIndex: 'tech', key: 'tech' },
    { title: 'Version', dataIndex: 'version', key: 'version', width: 110 },
    {
      title: 'Run-up',
      dataIndex: 'runUp',
      key: 'runUp',
      width: 130,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      align: 'right',
      render: (v: string) => <Text strong>{v}</Text>,
    },
  ]

  return (
    <section className="panel" style={{ background: token.colorBgContainer }}>
      <header className="panel__head" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
        <Breadcrumb
          items={[{ title: <FileTextOutlined /> }, { title: 'Project Name' }, { title: 'Architecture' }, { title: <Text strong>Document Name</Text> }]}
        />
        <Space size={2}>
          <Button type="text" size="small" icon={<StarOutlined />} />
          <Button type="text" size="small" icon={<HistoryOutlined />} />
          <Button type="text" size="small" icon={<EditOutlined />} />
          <Button type="text" size="small" icon={<EllipsisOutlined />} />
        </Space>
      </header>
      <div className="panel__body panel__body--scroll">
        <article className="document">
          <Text type="secondary">Section 2</Text>
          <Title level={2} style={{ marginTop: token.marginXXS, marginBottom: token.marginMD }}>
            2. Technology Stack Selection
          </Title>
          <Paragraph>
            Each technology was evaluated against five weighted criteria: team expertise (25%), ecosystem maturity (20%), performance (20%), operational cost
            (20%), and community support (15%).
          </Paragraph>
          <Table columns={columns} dataSource={stack} pagination={false} size="small" bordered scroll={{ x: 'max-content' }} className="document__stack" />
          <Paragraph type="secondary" style={{ fontSize: token.fontSizeSM, marginTop: token.marginSM }}>
            * CPLEX scored higher on raw capability but was rejected for $50K+ annual licensing. Datadog scored competitively but was rejected for cost; we use
            the open-source Prometheus + Grafana stack instead.
          </Paragraph>
          <Title level={3}>Selection Rationale Highlights</Title>
          <ul className="document__rationale">
            <li>
              <Text strong>Polyglot backend.</Text> Python dominates ML workloads (TensorFlow, OR-Tools, SciPy are Python-native); Node.js handles I/O-bound
              integration and user services efficiently. Splitting by domain avoids forcing one language to do both.
            </li>
            <li>
              <Text strong>PostgreSQL.</Text> Using TimescaleDB as a Postgres extension avoids operating a separate time-series database while delivering strong
              time-series query performance.
            </li>
            <li>
              <Text strong>DHTMLX Gantt.</Text> The only mature JavaScript Gantt library with drag-and-drop editing, critical-path visualization, and resource
              loading.
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}
