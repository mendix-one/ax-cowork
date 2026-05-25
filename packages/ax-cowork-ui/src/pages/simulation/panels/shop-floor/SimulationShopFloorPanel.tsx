import { Button, Card, Descriptions, Flex, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { QualMatrixRow, ToolGroup, ToolRow } from './shop-floor.store'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

const useStyles = createStyles(({ token }) => ({
  root: {
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    background: token.colorBgContainer,
  },
  tree: {
    width: 240,
    padding: token.padding,
    borderRight: `1px solid ${token.colorBorderSecondary}`,
    overflow: 'auto',
  },
  detail: {
    flex: 1,
    minWidth: 0,
    padding: token.padding,
    overflow: 'auto',
  },
  groupItem: {
    padding: '6px 8px',
    borderRadius: token.borderRadiusSM,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background 0.15s',
  },
  groupItemActive: {
    background: token.colorPrimaryBg,
    color: token.colorPrimary,
  },
  utilBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
    background: token.colorFillSecondary,
    overflow: 'hidden',
  },
}))

const utilColor = (u: number) => (u > 85 ? '#f5222d' : u > 70 ? '#faad14' : '#52c41a')

const chamberDot = (s: 'up' | 'down' | 'drift') =>
  s === 'up' ? (
    <span style={{ color: '#52c41a' }}>●</span>
  ) : s === 'drift' ? (
    <span style={{ color: '#faad14' }}>◐</span>
  ) : (
    <span style={{ color: '#f5222d' }}>○</span>
  )

const GroupTree = observer(() => {
  const { styles, cx } = useStyles()
  const store = useSimulationContext().shopFloor
  const grouped = store.groups.reduce<Record<string, ToolGroup[]>>((acc, g) => {
    if (!acc[g.module]) acc[g.module] = []
    acc[g.module].push(g)
    return acc
  }, {})
  return (
    <div>
      {Object.entries(grouped).map(([mod, items]) => (
        <div key={mod} style={{ marginBottom: 12 }}>
          <Typography.Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase' }}>
            ▼ {mod}
          </Typography.Text>
          <div style={{ marginTop: 4 }}>
            {items.map((g) => {
              const isActive = g.id === store.selectedGroupId
              return (
                <div key={g.id} className={cx(styles.groupItem, isActive && styles.groupItemActive)} onClick={() => store.selectGroup(g.id)}>
                  <Typography.Text style={{ fontSize: 12, color: 'inherit' }}>{g.name}</Typography.Text>
                  <Space size={6}>
                    <div className={styles.utilBar}>
                      <div style={{ width: `${g.utilization}%`, height: '100%', background: utilColor(g.utilization) }} />
                    </div>
                    <Typography.Text style={{ fontSize: 11, color: utilColor(g.utilization) }} strong>
                      {g.utilization}%
                    </Typography.Text>
                  </Space>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
})

const ToolsTable = observer(({ tools }: { tools: ToolRow[] }) => {
  const columns: ColumnsType<ToolRow> = [
    { title: 'Tool ID', dataIndex: 'id', key: 'id', width: 90, render: (v) => <Typography.Text code>{v}</Typography.Text> },
    {
      title: 'Chambers (A/B/C/D)',
      key: 'chambers',
      width: 160,
      render: (_, t) => (
        <Space size={2}>
          {t.chambers.map((c, i) => (
            <span key={i}>{chamberDot(c)}</span>
          ))}
        </Space>
      ),
    },
    {
      title: 'Qualified recipes',
      key: 'recipes',
      render: (_, t) => (
        <Space size={4} wrap>
          {t.recipes.map((r) => (
            <Tag key={r}>{r}</Tag>
          ))}
        </Space>
      ),
    },
    { title: 'Last PM', dataIndex: 'lastPm', key: 'lastPm', width: 80 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: ToolRow['status']) => {
        const color = s === 'Running' ? 'green' : s === 'PM due' ? 'orange' : 'red'
        return <Tag color={color}>{s}</Tag>
      },
    },
  ]
  return <Table<ToolRow> rowKey="id" size="small" columns={columns} dataSource={tools} pagination={false} />
})

const QualMatrix = observer(({ rows, tools }: { rows: QualMatrixRow[]; tools: ToolRow[] }) => (
  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ color: 'rgba(0,0,0,0.45)' }}>
        <th style={{ textAlign: 'left', padding: 4 }}>Recipe</th>
        {tools.map((t) => (
          <th key={t.id} style={{ padding: 4 }}>
            {t.id.replace('ETC-', '')}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.recipe} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <td style={{ padding: 4 }}>{row.recipe}</td>
          {tools.map((t) => (
            <td key={t.id} style={{ padding: 4, textAlign: 'center' }}>
              {row.toolQuals[t.id] ? '✓' : <span style={{ color: 'rgba(0,0,0,0.25)' }}>—</span>}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
))

const Detail = observer(({ group }: { group: ToolGroup }) => {
  const store = useSimulationContext().shopFloor
  return (
    <>
      <Typography.Title level={5} style={{ marginTop: 0 }}>
        Tool Group — {group.name}
      </Typography.Title>
      <Descriptions size="small" column={2} bordered>
        <Descriptions.Item label="Effective WSPM">24,300</Descriptions.Item>
        <Descriptions.Item label="Theoretical">32,400</Descriptions.Item>
        <Descriptions.Item label="OEE">82%</Descriptions.Item>
        <Descriptions.Item label="Avail × Perf × Qual">91% × 95% × 95%</Descriptions.Item>
        <Descriptions.Item label="Bottleneck role">Days 8–10 (this horizon)</Descriptions.Item>
        <Descriptions.Item label="Qual matrix">8/10 tools qualified for R-QLC-CH</Descriptions.Item>
      </Descriptions>

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        Tools ({store.tools.length}) — Chamber detail
      </Typography.Title>
      <ToolsTable tools={store.tools} />

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        Qualification matrix (recipe × tool)
      </Typography.Title>
      <Card size="small">
        <QualMatrix rows={store.qualMatrix} tools={store.tools} />
      </Card>

      <Space style={{ marginTop: 16 }}>
        <Button size="small" icon={<AxMuiIcon icon="mdiCalendarOutline" size={14} />}>
          PM calendar
        </Button>
        <Button size="small" icon={<AxMuiIcon icon="mdiChartLineVariant" size={14} />}>
          SPC trends
        </Button>
        <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiTuneVerticalVariant" size={14} />}>
          Tune capacity
        </Button>
      </Space>
    </>
  )
})

export const SimulationShopFloorPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const store = useSimulationContext().shopFloor
  return (
    <AxDisplayPanel type="main" icon="mdiFactory" title="Shop Floor Capacity" {...props}>
      <div className={styles.root}>
        <div className={styles.tree}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
            <Typography.Text strong style={{ fontSize: 12 }}>
              Tool Group Tree
            </Typography.Text>
          </Flex>
          <GroupTree />
        </div>
        <div className={styles.detail}>{store.selectedGroup ? <Detail group={store.selectedGroup} /> : null}</div>
      </div>
    </AxDisplayPanel>
  )
})
