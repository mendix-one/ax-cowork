import { Flex, Space, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { MOCK_FLAT_CELLS, type Division } from '../../data/mock-plan'
import { EpsCapacityChart } from './EpsCapacityChart'
import { EpsCapacityOee } from './EpsCapacityOee'
import { EpsCapacityConstraints } from './EpsCapacityConstraints'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Headcount Portfolio — operational view of the organization hierarchy.
//   • Left sidebar = Division → Site → Team → Group → Part → Cell tree.
//   • Main content = capacity chart + headcount composition card + resource-constraint list for
//     the selected node.

const CapacityToolbar = () => (
  <Flex align="center" justify="space-between" gap="small" className="ax-eps-simulation_toolbar" style={{ width: '100%' }}>
    <Space size={10}>
      <Typography.Text type="secondary" className="text-sm">
        Read-only Headcount Portfolio — pick an organization node on the left to inspect its capacity,
        composition and resource constraints.
      </Typography.Text>
    </Space>
  </Flex>
)

// Recursive org tree — each clickable label sets `selectedNodeId` on the capacity store. The selected
// node's id can be a cellId, partId, groupId, teamId, siteId, or divisionId. Per-level CSS class drives
// indentation + colour.
type Level = 'division' | 'site' | 'team' | 'group' | 'part' | 'cell'

const OrgNode = observer(
  ({ id, label, level, headcount, children, isActive, onSelect }: { id: string; label: string; level: Level; headcount: number; children?: React.ReactNode; isActive: boolean; onSelect: (id: string) => void }) => (
    <div className={`ax-eps-capacity_tree_node ax-eps-capacity_tree_node__${level}`}>
      <button type="button" className={`ax-eps-capacity_tree_label ${isActive ? 'is-active' : ''}`} onClick={() => onSelect(id)}>
        <span className="ax-eps-capacity_tree_label_text">{label}</span>
        <span className="ax-eps-capacity_tree_label_hc">{headcount} HC</span>
      </button>
      {children}
    </div>
  ),
)

const CapacityOrgTree = observer(() => {
  const store = useEpsContext().capacity
  const sumCellsUnder = (filter: (e: typeof MOCK_FLAT_CELLS[number]) => boolean) =>
    MOCK_FLAT_CELLS.filter(filter).reduce((s, e) => s + e.cell.headcount, 0)
  const renderDivision = (d: Division) => (
    <OrgNode
      key={d.id}
      id={d.id}
      label={d.name}
      level="division"
      headcount={sumCellsUnder((e) => e.ref.divisionId === d.id)}
      isActive={store.selectedNodeId === d.id}
      onSelect={(id) => store.selectNode(id)}
    >
      {d.sites.map((s) => (
        <OrgNode
          key={s.id}
          id={s.id}
          label={s.name}
          level="site"
          headcount={sumCellsUnder((e) => e.ref.divisionId === d.id && e.ref.siteId === s.id)}
          isActive={store.selectedNodeId === s.id}
          onSelect={(id) => store.selectNode(id)}
        >
          {s.teams.map((t) => (
            <OrgNode
              key={t.id}
              id={t.id}
              label={t.name}
              level="team"
              headcount={sumCellsUnder((e) => e.ref.teamId === t.id)}
              isActive={store.selectedNodeId === t.id}
              onSelect={(id) => store.selectNode(id)}
            >
              {t.groups.map((g) => (
                <OrgNode
                  key={g.id}
                  id={g.id}
                  label={g.name}
                  level="group"
                  headcount={sumCellsUnder((e) => e.ref.groupId === g.id)}
                  isActive={store.selectedNodeId === g.id}
                  onSelect={(id) => store.selectNode(id)}
                >
                  {g.parts.map((p) => (
                    <OrgNode
                      key={p.id}
                      id={p.id}
                      label={p.name}
                      level="part"
                      headcount={sumCellsUnder((e) => e.ref.partId === p.id)}
                      isActive={store.selectedNodeId === p.id}
                      onSelect={(id) => store.selectNode(id)}
                    >
                      {p.cells.map((c) => (
                        <OrgNode
                          key={c.id}
                          id={c.id}
                          label={c.name}
                          level="cell"
                          headcount={c.headcount}
                          isActive={store.selectedNodeId === c.id}
                          onSelect={(id) => store.selectNode(id)}
                        />
                      ))}
                    </OrgNode>
                  ))}
                </OrgNode>
              ))}
            </OrgNode>
          ))}
        </OrgNode>
      ))}
    </OrgNode>
  )
  return (
    <div className="ax-eps-capacity_tree">
      <div className="ax-eps-capacity_tree_header">
        <span>Organization</span>
      </div>
      <div className="ax-eps-capacity_tree_body">{store.divisions.map(renderDivision)}</div>
    </div>
  )
})

export const EpsCapacityPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiAccountGroupOutline" title="Headcount Portfolio" tools={<CapacityToolbar />} {...props}>
      <div className="ax-eps-capacity">
        <div className="ax-eps-capacity_body">
          <CapacityOrgTree />
          <div className="ax-eps-capacity_main">
            <div className="ax-eps-analysis_scroll">
              <div className="ax-eps-analysis_section">
                <div className="ax-eps-analysis_section_title">Capacity vs Planned Demand (MTO timeline)</div>
                <EpsCapacityChart />
              </div>
              <div className="ax-eps-analysis_section">
                <div className="ax-eps-analysis_section_title">Headcount Composition</div>
                <EpsCapacityOee />
              </div>
              <div className="ax-eps-analysis_section">
                <div className="ax-eps-analysis_section_title">Resource Constraints</div>
                <EpsCapacityConstraints />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
