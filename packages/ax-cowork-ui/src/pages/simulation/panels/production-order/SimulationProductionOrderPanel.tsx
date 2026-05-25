import { Button, Card, Descriptions, Flex, Input, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { ProductionOrder } from '../../data/mock-plan'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    background: token.colorBgContainer,
  },
  list: {
    flex: 1.4,
    minWidth: 0,
    padding: token.padding,
    overflow: 'auto',
    borderRight: `1px solid ${token.colorBorderSecondary}`,
  },
  detail: {
    flex: 1,
    minWidth: 320,
    padding: token.padding,
    overflow: 'auto',
    background: token.colorFillAlter,
  },
  toolbar: {
    marginBottom: token.padding,
  },
  milestone: {
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusSM,
    border: `1px solid ${token.colorBorderSecondary}`,
    marginBottom: token.paddingXS,
  },
}))

const priorityTag = (p: ProductionOrder) => {
  if (p.hotLot) return <Tag color="purple">★ HOT</Tag>
  if (p.npi) return <Tag color="cyan">P-NPI</Tag>
  return <Tag color={p.priority === 'P1' ? 'red' : p.priority === 'P2' ? 'orange' : 'blue'}>{p.priority}</Tag>
}

const statusTag = (po: ProductionOrder) => {
  if (po.m1Slip) return <Tag color="red">+{po.m1Slip}d</Tag>
  return <Tag color="green">ok</Tag>
}

const Detail = observer(({ order }: { order: ProductionOrder }) => {
  const { styles } = useStyles()
  return (
    <>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        {order.id} · {order.customer}
      </Typography.Title>
      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="Product">{order.family}</Descriptions.Item>
        <Descriptions.Item label="Spec">{order.spec}</Descriptions.Item>
        <Descriptions.Item label="Wafer start">{order.waferStart}</Descriptions.Item>
        <Descriptions.Item label="Lot size">{order.lotSize} wafers</Descriptions.Item>
        <Descriptions.Item label="Lots">
          {Math.round(order.qty / order.lotSize)} ({order.qty.toLocaleString()} / {order.lotSize})
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        Commitments / Milestones
      </Typography.Title>
      {order.milestones.map((m) => (
        <div key={m.id} className={styles.milestone}>
          <Flex justify="space-between" align="center">
            <div>
              <Typography.Text strong>◆ {m.label}</Typography.Text>
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {m.date}
                </Typography.Text>
              </div>
            </div>
            <div>
              {m.slipDays ? (
                <Tag color="red">
                  +{m.slipDays}d · {m.cause}
                </Tag>
              ) : (
                <Tag color="green">on track</Tag>
              )}
            </div>
          </Flex>
        </div>
      ))}

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        Process flow (master)
      </Typography.Title>
      <Card size="small" style={{ background: 'transparent' }}>
        <Typography.Text>FEOL Dep → HARC Etch → WL Fill → … → BEOL → Probe → Asm</Typography.Text>
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            (245 step entries)
          </Typography.Text>
        </div>
      </Card>

      <Space style={{ marginTop: 16 }}>
        <Button type="primary" size="small">
          Replan this PO
        </Button>
        <Button size="small">Edit</Button>
        <Button size="small" icon={<AxMuiIcon icon="mdiCreationOutline" size={14} />}>
          Send to AI
        </Button>
      </Space>
    </>
  )
})

export const SimulationProductionOrderPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const store = useSimulationContext().productionOrder

  const columns: ColumnsType<ProductionOrder> = [
    { title: 'PO #', dataIndex: 'id', key: 'id', width: 110, render: (v) => <Typography.Text strong>{v}</Typography.Text> },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 90 },
    { title: 'Family', dataIndex: 'family', key: 'family', width: 120 },
    { title: 'Qty', dataIndex: 'qty', key: 'qty', width: 100, render: (v: number) => v.toLocaleString() },
    { title: 'Priority', key: 'priority', width: 100, render: (_, p) => priorityTag(p) },
    { title: 'M1 Date', dataIndex: 'm1Date', key: 'm1Date', width: 110 },
    { title: 'Status', key: 'status', width: 90, render: (_, p) => statusTag(p) },
  ]

  return (
    <AxDisplayPanel type="main" icon="mdiClipboardListOutline" title="Production Order" {...props}>
      <div className={styles.root}>
        <div className={styles.list}>
          <Flex className={styles.toolbar} justify="space-between" align="center" gap="small" wrap>
            <Space size={6}>
              <Button type="primary" size="small" icon={<AxMuiIcon icon="mdiPlus" size={14} />}>
                New PO
              </Button>
              <Button size="small" icon={<AxMuiIcon icon="mdiTrayArrowDown" size={14} />}>
                Import
              </Button>
            </Space>
            <Space size={6}>
              <Input.Search size="small" placeholder="Search PO/customer" style={{ width: 200 }} />
              <Button size="small" icon={<AxMuiIcon icon="mdiFilterOutline" size={14} />}>
                Active
              </Button>
            </Space>
          </Flex>
          <Table<ProductionOrder>
            size="small"
            rowKey="id"
            columns={columns}
            dataSource={store.orders}
            pagination={false}
            onRow={(r) => ({ onClick: () => store.selectOrder(r.id), style: { cursor: 'pointer' } })}
            rowClassName={(r) => (r.id === store.selectedOrderId ? 'ant-table-row-selected' : '')}
          />
        </div>
        <div className={styles.detail}>
          {store.selectedOrder ? <Detail order={store.selectedOrder} /> : <Typography.Text type="secondary">Select an order</Typography.Text>}
        </div>
      </div>
    </AxDisplayPanel>
  )
})
