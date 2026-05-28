import { Flex, Space, Tag, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import type { QualMatrixRow, ToolGroup, ToolRow } from '../../stores/capacity.store'
import { calcOee } from '../../helpers/capacity.helpers'
import { EpsCapacityChart } from './EpsCapacityChart'
import { EpsCapacityOee } from './EpsCapacityOee'
import { EpsCapacityConstraints } from './EpsCapacityConstraints'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Shop Floor — operational view of one tool group at a time.
// Layout mirrors Gantt / Analysis / Production Order / Production Processes:
//   • Persistent left sidebar = Tool Group Tree (always visible — primary navigation).
//   • Main content = vertically-stacked sections inside .ax-eps-analysis_scroll so it inherits the
//     edge-to-edge + sticky-section-header behaviour shared with the other panels.
//   • Detail tables (Tools / Qualification matrix) pick up the same PO-table look (Stone-100 header,
//     gray-300 bottom separator, zebra rows, Amber-50 hover, gray-200 grid).

// ----- Helpers -------------------------------------------------------------------------------------
const utilColor = (u: number) => (u > 85 ? '#f5222d' : u > 70 ? '#faad14' : '#52c41a')
const utilLabel = (u: number) => (u > 85 ? 'Overload' : u > 70 ? 'Highload' : u >= 40 ? 'Normal' : 'Idle')

const chamberDot = (s: 'up' | 'down' | 'drift') =>
  s === 'up' ? (
    <span style={{ color: '#52c41a' }}>●</span>
  ) : s === 'drift' ? (
    <span style={{ color: '#faad14' }}>◐</span>
  ) : (
    <span style={{ color: '#f5222d' }}>○</span>
  )

// ----- Toolbar (matches process panel — read-only hint) -------------------------------------------
const CapacityToolbar = observer(() => (
  <Flex align="center" justify="space-between" gap="small" className="ax-eps-simulation_toolbar" style={{ width: '100%' }}>
    <Space size={10}>
      <Typography.Text type="secondary" className="text-sm">
        Read-only operational view per tool group — pick a tool group on the left to inspect its capacity, OEE, constraints, tools and qualifications.
      </Typography.Text>
    </Space>
  </Flex>
))

// ----- Left sidebar: Tool Group Tree --------------------------------------------------------------
// Persistent, same chrome as the Production Process tech-list sidebar.
const CapacityToolGroupTree = observer(() => {
  const store = useEpsContext().capacity
  const grouped = store.groups.reduce<Record<string, ToolGroup[]>>((acc, g) => {
    if (!acc[g.module]) acc[g.module] = []
    acc[g.module].push(g)
    return acc
  }, {})
  return (
    <div className="ax-eps-capacity_tree">
      <div className="ax-eps-capacity_tree_header">
        <span>Tool groups</span>
      </div>
      <div className="ax-eps-capacity_tree_body">
        {Object.entries(grouped).map(([mod, items]) => (
          <div key={mod} className="ax-eps-capacity_tree_module">
            <div className="ax-eps-capacity_tree_module_label">{mod}</div>
            {items.map((g) => {
              const isActive = g.id === store.selectedGroupId
              return (
                <button
                  key={g.id}
                  type="button"
                  className={`ax-eps-capacity_tree_card ${isActive ? 'is-active' : ''}`}
                  onClick={() => store.selectGroup(g.id)}
                >
                  <div className="ax-eps-capacity_tree_card_top">
                    <span className="ax-eps-capacity_tree_card_name">{g.name}</span>
                    <Typography.Text className="text-sm" style={{ color: utilColor(g.utilization) }} strong>
                      {g.utilization}%
                    </Typography.Text>
                  </div>
                  <div className="ax-eps-capacity_tree_card_bar">
                    <div className="ax-eps-capacity_tree_card_bar_fill" style={{ width: `${g.utilization}%`, background: utilColor(g.utilization) }} />
                  </div>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
})

// ----- KPI strip -----------------------------------------------------------------------------------
type KpiCardProps = { label: string; value: string; sub?: string; tone?: 'default' | 'warn' | 'good' }
const KpiCard = ({ label, value, sub, tone = 'default' }: KpiCardProps) => (
  <div className={`ax-eps-capacity_kpi ax-eps-capacity_kpi__${tone}`}>
    <div className="ax-eps-capacity_kpi_label">{label}</div>
    <div className="ax-eps-capacity_kpi_value">{value}</div>
    {sub && <div className="ax-eps-capacity_kpi_sub">{sub}</div>}
  </div>
)

const KpiStrip = observer(({ group }: { group: ToolGroup }) => {
  const store = useEpsContext().capacity
  const oee = calcOee(group.name)
  const oeePct = Math.round(oee.oee * 100)
  const runningTools = store.tools.filter((t) => t.status === 'Running').length
  const totalTools = store.tools.length
  return (
    <div className="ax-eps-capacity_kpis">
      <KpiCard
        label="Utilization"
        value={`${group.utilization}%`}
        sub={`${utilLabel(group.utilization)} · capacity ceiling state`}
        tone={group.utilization > 85 ? 'warn' : group.utilization >= 40 ? 'default' : 'good'}
      />
      <KpiCard
        label="OEE"
        value={`${oeePct}%`}
        sub={`A ${Math.round(oee.availability * 100)}% × P ${Math.round(oee.performance * 100)}% × Q ${Math.round(oee.quality * 100)}%`}
        tone={oeePct < 70 ? 'warn' : oeePct >= 85 ? 'good' : 'default'}
      />
      <KpiCard
        label="Effective WSPM"
        value={`${Math.round(oee.effective * 30).toLocaleString()}`}
        sub={`Theoretical ${Math.round(oee.theoretical * 30).toLocaleString()} · gap ${(Math.round((oee.theoretical - oee.effective) * 30)).toLocaleString()}`}
      />
      <KpiCard
        label="Tools online"
        value={`${runningTools} / ${totalTools}`}
        sub={`${store.qualMatrix.length} qualified recipes · module ${group.module}`}
        tone={runningTools < totalTools - 1 ? 'warn' : 'default'}
      />
    </div>
  )
})

// ----- Tools table (PO-style via .ax-eps-capacity_detail scope, see SCSS) ----------------------------------
const ToolsTable = observer(({ tools }: { tools: ToolRow[] }) => (
  <table className="ax-eps-analysis_table">
    <thead>
      <tr>
        <th>Tool ID</th>
        <th>Chambers (A/B/C/D)</th>
        <th>Qualified recipes</th>
        <th>Last PM</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {tools.map((t) => {
        const statusColor = t.status === 'Running' ? 'green' : t.status === 'PM due' ? 'orange' : 'red'
        return (
          <tr key={t.id}>
            <td>
              <Typography.Text code>{t.id}</Typography.Text>
            </td>
            <td>
              <Space size={2}>
                {t.chambers.map((c, i) => (
                  <span key={i}>{chamberDot(c)}</span>
                ))}
              </Space>
            </td>
            <td>
              <Space size={4} wrap>
                {t.recipes.map((r) => (
                  <Tag key={r} style={{ margin: 0 }}>
                    {r}
                  </Tag>
                ))}
              </Space>
            </td>
            <td>{t.lastPm}</td>
            <td>
              <Tag color={statusColor} style={{ margin: 0 }}>
                {t.status}
              </Tag>
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
))

// ----- Qualification matrix (PO-style table) -----------------------------------------------------
const QualMatrix = observer(({ rows, tools }: { rows: QualMatrixRow[]; tools: ToolRow[] }) => (
  <table className="ax-eps-analysis_table">
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
          <td>
            <b>{row.recipe}</b>
          </td>
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

// ----- Main detail (right side stacked sections) -------------------------------------------------
const CapacityDetail = observer(({ group }: { group: ToolGroup }) => {
  const store = useEpsContext().capacity
  return (
    <>
      {/* 1. Summary KPI strip */}
      <KpiStrip group={group} />

      {/* 2. Tool group identity + meta */}
      <div className="ax-eps-analysis_section">
        <div className="ax-eps-analysis_section_header">
          <div className="ax-eps-analysis_section_header_title">
            <AxMuiIcon icon="mdiFactory" size={18} />
            <span>{group.name} · {group.module}</span>
          </div>
          <Tooltip title={`${utilLabel(group.utilization)} — utilisation against effective capacity`}>
            <Tag color={group.utilization > 85 ? 'red' : group.utilization > 70 ? 'orange' : 'green'} style={{ margin: 0 }}>
              {group.utilization}% utilised · {utilLabel(group.utilization)}
            </Tag>
          </Tooltip>
        </div>
        <div className="ax-eps-analysis_section_body">
          <Typography.Text type="secondary" className="text-sm">
            {store.tools.length} tools in this group · {store.qualMatrix.length} recipes qualified across the group.
            Use the charts below to drill into capacity / OEE / constraints, then the Tools and Qualification
            tables for per-tool state.
          </Typography.Text>
        </div>
      </div>

      {/* 3. Capacity chart (existing component, already wraps itself as a section) */}
      <EpsCapacityChart />

      {/* 4. OEE breakdown */}
      <EpsCapacityOee />

      {/* 5. Constraints */}
      <EpsCapacityConstraints />

      {/* 6. Tools — chamber detail */}
      <div className="ax-eps-analysis_section">
        <div className="ax-eps-analysis_section_header">
          <div className="ax-eps-analysis_section_header_title">
            <AxMuiIcon icon="mdiToolboxOutline" size={18} />
            <span>Tools ({store.tools.length}) · Chamber detail</span>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            Per-tool chamber state, qualified recipes, last PM, current status.
          </Typography.Text>
        </div>
        <div className="ax-eps-analysis_section_body">
          <ToolsTable tools={store.tools} />
        </div>
      </div>

      {/* 7. Qualification matrix */}
      <div className="ax-eps-analysis_section">
        <div className="ax-eps-analysis_section_header">
          <div className="ax-eps-analysis_section_header_title">
            <AxMuiIcon icon="mdiShieldCheckOutline" size={18} />
            <span>Qualification matrix · recipe × tool</span>
          </div>
          <Typography.Text type="secondary" className="text-sm">
            ✓ = tool is currently qualified to run the recipe. Empty = no qual; the planner can't dispatch this recipe on that tool until a qual run lands.
          </Typography.Text>
        </div>
        <div className="ax-eps-analysis_section_body">
          <QualMatrix rows={store.qualMatrix} tools={store.tools} />
        </div>
      </div>
    </>
  )
})

// ----- Panel root ---------------------------------------------------------------------------------
export const EpsCapacityPanel = observer((props: MainPanelControls) => {
  const store = useEpsContext().capacity
  return (
    <AxDisplayPanel type="main" icon="mdiFactory" title="Capacity" tools={<CapacityToolbar />} {...props}>
      <div className="ax-eps-simulation">
        <div className="ax-eps-simulation_body">
          <CapacityToolGroupTree />
          <div className="ax-eps-simulation_body_content ax-eps-analysis_scroll ax-eps-capacity_detail">
            {store.selectedGroup ? <CapacityDetail group={store.selectedGroup} /> : null}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
