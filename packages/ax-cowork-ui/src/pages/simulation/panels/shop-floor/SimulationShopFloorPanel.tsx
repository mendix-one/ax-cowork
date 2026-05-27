import { Button, Card, Descriptions, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { createStyles } from 'antd-style'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import type { QualMatrixRow, ToolGroup, ToolRow } from './shop-floor.store'
import { calcOee } from './shop-floor.helpers'
import { SimulationShopFloorCapacityChart } from './SimulationShopFloorCapacityChart'
import { SimulationShopFloorOee } from './SimulationShopFloorOee'
import { SimulationShopFloorConstraints } from './SimulationShopFloorConstraints'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Local utility palette used by the tree util-bar and the chamber status dots — kept in this file because
// it's the only consumer.
const useStyles = createStyles(({ token }) => ({
  tree: {
    width: 240,
    padding: token.padding,
    borderRight: `1px solid ${token.colorBorderSecondary}`,
    overflow: 'auto',
    flex: '0 0 240px',
  },
  detail: {
    flex: 1,
    minWidth: 0,
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
          <Typography.Text type="secondary" className="text-sm" style={{ textTransform: 'uppercase' }}>
            ▼ {mod}
          </Typography.Text>
          <div style={{ marginTop: 4 }}>
            {items.map((g) => {
              const isActive = g.id === store.selectedGroupId
              return (
                <div key={g.id} className={cx(styles.groupItem, isActive && styles.groupItemActive)} onClick={() => store.selectGroup(g.id)}>
                  <Typography.Text style={{ color: 'inherit' }}>{g.name}</Typography.Text>
                  <Space size={6}>
                    <div className={styles.utilBar}>
                      <div style={{ width: `${g.utilization}%`, height: '100%', background: utilColor(g.utilization) }} />
                    </div>
                    <Typography.Text className="text-sm" style={{ color: utilColor(g.utilization) }} strong>
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
  <table className="ax-analysis_table">
    <thead>
      <tr>
        <th>Recipe</th>
        {tools.map((t) => (
          <th key={t.id} style={{ textAlign: 'center' }}>
            {t.id.replace('ETC-', '')}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.recipe}>
          <td>{row.recipe}</td>
          {tools.map((t) => (
            <td key={t.id} style={{ textAlign: 'center' }}>
              {row.toolQuals[t.id] ? <span style={{ color: '#52c41a' }}>✓</span> : <span style={{ color: 'rgba(0,0,0,0.25)' }}>—</span>}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
))

const Detail = observer(({ group }: { group: ToolGroup }) => {
  const store = useSimulationContext().shopFloor
  const oee = calcOee(group.name)
  return (
    <div className="ax-sf_detail_scroll">
      {/* Tool group header card — quick descriptive read */}
      <div className="ax-analysis_section">
        <div className="ax-analysis_section_header">
          <div className="ax-analysis_section_header_title">
            <AxMuiIcon icon="mdiFactory" size={18} />
            <span>Tool Group · {group.name}</span>
          </div>
          <Space size={4}>
            <Tag color="blue">{group.module}</Tag>
            <Tag color={group.utilization > 85 ? 'red' : group.utilization > 70 ? 'orange' : 'green'}>{group.utilization}% util</Tag>
          </Space>
        </div>
        <div className="ax-analysis_section_body">
          <Descriptions size="small" column={3} bordered>
            <Descriptions.Item label="Effective WSPM">{(oee.effective * 30).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Theoretical">{(oee.theoretical * 30).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="OEE">{Math.round(oee.oee * 100)}%</Descriptions.Item>
            <Descriptions.Item label="A × P × Q">
              {Math.round(oee.availability * 100)}% × {Math.round(oee.performance * 100)}% × {Math.round(oee.quality * 100)}%
            </Descriptions.Item>
            <Descriptions.Item label="Tools">{store.tools.length}</Descriptions.Item>
            <Descriptions.Item label="Qual recipes">{store.qualMatrix.length}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      {/* Charts */}
      <SimulationShopFloorCapacityChart />
      <SimulationShopFloorOee />

      {/* Constraints */}
      <SimulationShopFloorConstraints />

      {/* Tools + qual matrix — kept from the previous version, restyled into section cards */}
      <div className="ax-analysis_section">
        <div className="ax-analysis_section_header">
          <div className="ax-analysis_section_header_title">
            <AxMuiIcon icon="mdiToolboxOutline" size={18} />
            <span>Tools ({store.tools.length}) · Chamber detail</span>
          </div>
        </div>
        <div className="ax-analysis_section_body">
          <ToolsTable tools={store.tools} />
        </div>
      </div>

      <div className="ax-analysis_section">
        <div className="ax-analysis_section_header">
          <div className="ax-analysis_section_header_title">
            <AxMuiIcon icon="mdiShieldCheckOutline" size={18} />
            <span>Qualification matrix (recipe × tool)</span>
          </div>
        </div>
        <div className="ax-analysis_section_body">
          <Card size="small">
            <QualMatrix rows={store.qualMatrix} tools={store.tools} />
          </Card>
        </div>
      </div>

      <Space style={{ padding: '0 12px 12px' }}>
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
    </div>
  )
})

export const SimulationShopFloorPanel = observer((props: MainPanelControls) => {
  const { styles } = useStyles()
  const store = useSimulationContext().shopFloor
  return (
    <AxDisplayPanel type="main" icon="mdiFactory" title="Shop Floor Capacity" {...props}>
      <div className="ax-sf">
        <div className={styles.tree}>
          <Typography.Text strong>Tool Group Tree</Typography.Text>
          <div style={{ marginTop: 8 }}>
            <GroupTree />
          </div>
        </div>
        <div className={styles.detail}>{store.selectedGroup ? <Detail group={store.selectedGroup} /> : null}</div>
      </div>
    </AxDisplayPanel>
  )
})
