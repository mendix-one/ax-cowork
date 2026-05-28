import { Button, Card, Col, Descriptions, Flex, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import type { DataSource, SourceStatus } from '../../stores/integration.store'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    overflow: 'auto',
    padding: token.padding,
    background: token.colorBgContainer,
  },
}))

const STATUS_COLOR: Record<SourceStatus, string> = {
  healthy: 'green',
  delayed: 'orange',
  stale: 'orange',
  down: 'red',
  'not-configured': 'default',
}

const STATUS_LABEL: Record<SourceStatus, string> = {
  healthy: '● Healthy',
  delayed: '⚠ Delayed',
  stale: '⚠ Stale',
  down: '✗ Down',
  'not-configured': 'Not configured',
}

export const MpsIntegrationPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const store = useMpsContext().integration

  const columns: ColumnsType<DataSource> = [
    { title: 'Source', dataIndex: 'name', key: 'name', render: (v) => <Typography.Text strong>{v}</Typography.Text> },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Last sync', dataIndex: 'lastSync', key: 'lastSync' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s: SourceStatus) => <Tag color={STATUS_COLOR[s]}>{STATUS_LABEL[s]}</Tag>,
    },
    { title: 'Latency', dataIndex: 'latency', key: 'latency' },
  ]

  return (
    <AxDisplayPanel type="main" icon="mdiTransitConnectionVariant" title="Integration" {...props}>
      <div className={styles.root}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Connected sources
          </Typography.Title>
          <Space size={6}>
            <Button size="small" icon={<AxMuiIcon icon="mdiSync" size={14} />}>
              Sync now
            </Button>
            <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiPlus" size={14} />}>
              Add source
            </Button>
          </Space>
        </Flex>
        <Table<DataSource>
          size="small"
          rowKey="id"
          columns={columns}
          dataSource={store.sources}
          pagination={false}
          onRow={(r) => ({ onClick: () => store.select(r.id), style: { cursor: 'pointer' } })}
          rowClassName={(r) => (r.id === store.selectedId ? 'ant-table-row-selected' : '')}
        />

        {store.selected && (
          <Card size="small" title={`Source detail — ${store.selected.name}`} style={{ marginTop: 16 }}>
            <Descriptions size="small" column={2} bordered>
              <Descriptions.Item label="Connector">SAP RFC + custom IDoc</Descriptions.Item>
              <Descriptions.Item label="Sync cadence">Real-time (event) + 5-min reconciliation</Descriptions.Item>
              <Descriptions.Item label="Schema version">v2.3 — validated 2026-05-20</Descriptions.Item>
              <Descriptions.Item label="Recent issues">None</Descriptions.Item>
              <Descriptions.Item label="Field mapping" span={2}>
                <code>PRD_ORD.PO_NO → ProductionOrder.id</code>
                <br />
                <code>PRD_ORD.PROD_FAM → ProductionOrder.family</code>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  … 87 more mappings · <a>View all</a>
                </Typography.Text>
              </Descriptions.Item>
            </Descriptions>
            <Space style={{ marginTop: 12 }}>
              <Button size="small">Test connection</Button>
              <Button size="small">Re-sync</Button>
              <Button size="small">Edit mapping</Button>
              <Button size="small">View logs</Button>
            </Space>
          </Card>
        )}

        <Typography.Title level={5} style={{ marginTop: 16 }}>
          Data health at a glance
        </Typography.Title>
        <Row gutter={[12, 12]}>
          <Col xs={12} md={6}>
            <Card size="small">
              <Statistic title="POs synced today" value={342} suffix="✓" />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small">
              <Statistic title="Lots tracked" value={8420} suffix="✓" />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small">
              <Statistic title="Tool states" value="< 1 min" />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small">
              <Statistic title="Probe yield" value="16-min lag" valueStyle={{ color: '#faad14' }} />
            </Card>
          </Col>
        </Row>
      </div>
    </AxDisplayPanel>
  )
})
