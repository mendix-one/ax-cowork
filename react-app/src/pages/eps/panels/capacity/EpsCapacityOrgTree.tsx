import type { ReactNode } from 'react'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { type Division } from '../../data/mock-plan'
import { cellsUnderNode } from '../../helpers/capacity.helpers'

// Organization hierarchy navigator — Department › Site › Team › Group › Part (the same org dimension the
// Factors Control schema defines). Headcount rolls up from the Cells beneath each node. Selecting a node
// scopes the summary box + detail table; the per-Cell skill detail lives in the table, so the tree stops
// at Part.
type Level = 'division' | 'site' | 'team' | 'group' | 'part'

const headcountOf = (id: string) => cellsUnderNode(id).reduce((sum, e) => sum + e.cell.headcount, 0)

const OrgNode = observer(
  ({
    id,
    label,
    level,
    isActive,
    onSelect,
    children,
  }: {
    id: string
    label: string
    level: Level
    isActive: boolean
    onSelect: (id: string) => void
    children?: ReactNode
  }) => (
    <div className={`ax-eps-capacity_tree_node ax-eps-capacity_tree_node__${level}`}>
      <button type="button" className={`ax-eps-capacity_tree_label ${isActive ? 'is-active' : ''}`} onClick={() => onSelect(id)}>
        <span className="ax-eps-capacity_tree_label_text">{label}</span>
        <span className="ax-eps-capacity_tree_label_hc">{headcountOf(id)} HC</span>
      </button>
      {children}
    </div>
  ),
)

export const EpsCapacityOrgTree = observer(() => {
  const store = useEpsContext().capacity
  const sel = store.selectedNodeId
  const onSelect = (id: string) => store.selectNode(id)

  const renderDivision = (d: Division) => (
    <OrgNode key={d.id} id={d.id} label={d.name} level="division" isActive={sel === d.id} onSelect={onSelect}>
      {d.sites.map((s) => (
        <OrgNode key={s.id} id={s.id} label={s.name} level="site" isActive={sel === s.id} onSelect={onSelect}>
          {s.teams.map((t) => (
            <OrgNode key={t.id} id={t.id} label={t.name} level="team" isActive={sel === t.id} onSelect={onSelect}>
              {t.groups.map((g) => (
                <OrgNode key={g.id} id={g.id} label={g.name} level="group" isActive={sel === g.id} onSelect={onSelect}>
                  {g.parts.map((p) => (
                    <OrgNode key={p.id} id={p.id} label={p.name} level="part" isActive={sel === p.id} onSelect={onSelect} />
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
