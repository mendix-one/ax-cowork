import { Layout, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import { AxMuiIcon, type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { useSimulationContext } from '../store/simulation.context'
import type { MainPanelId } from '../store/simulation.store'

// The left rail is the planner's primary "where am I" surface. Two modes:
//   • compact (default)  — icon-only, 2.65rem wide. Tooltip-on-hover gives the label. Pixel-tight; preferred
//                          when the planner is working in the Gantt and wants every horizontal pixel.
//   • expanded           — labels visible, group captions visible, ~10rem wide. Toggled via the chevron at the
//                          bottom of the rail. Preferred when learning the app or working in Analysis.
//
// Risk badges are intentionally NOT shown on every panel (would create alarm fatigue) — they belong to a
// single high-priority risk surface in a future iteration. The AxMenuIcon `badge` prop is preserved for that.

type MenuItem = {
  id: MainPanelId
  icon: MdiIconName
  title: string
}

type Group = {
  caption: string
  items: MenuItem[]
}

const GROUPS: Group[] = [
  {
    caption: 'Plan',
    items: [
      { id: 'gantt', icon: 'mdiChartGantt', title: 'Gantt' },
      { id: 'analysis', icon: 'mdiChartBar', title: 'Analysis' },
      { id: 'productionOrder', icon: 'mdiClipboardListOutline', title: 'Production Order' },
      { id: 'productionProcess', icon: 'mdiSitemapOutline', title: 'Processes' },
      { id: 'shopFloor', icon: 'mdiFactory', title: 'Shop Floor' },
    ],
  },
  {
    caption: 'Tuning',
    items: [
      { id: 'processTuning', icon: 'mdiTuneVerticalVariant', title: 'Process Tuning' },
      { id: 'capacityTuning', icon: 'mdiCogTransferOutline', title: 'Capacity Tuning' },
    ],
  },
  {
    caption: 'System',
    items: [{ id: 'dataIntegration', icon: 'mdiTransitConnectionVariant', title: 'Data Integration' }],
  },
]

// Expanded-mode row — icon + label sitting on one line with the active indicator on the left edge.
const RailRow = observer(({ item, active, onClick }: { item: MenuItem; active: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className={`ax-rail_row ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
    <span className="ax-rail_row_accent" aria-hidden />
    <AxMuiIcon icon={item.icon} size="18px" className="ax-rail_row_icon" />
    <span className="ax-rail_row_label">{item.title}</span>
  </button>
))

export const SimulationLayoutLeft = observer(() => {
  const simulation = useSimulationContext()
  const active = simulation.activeMainPanel
  const expanded = simulation.leftRailExpanded
  return (
    <Layout.Sider width={expanded ? '10rem' : '2.65rem'} className={`ax-rail ${expanded ? 'is-expanded' : 'is-compact'}`}>
      <div className="ax-rail_inner">
        <div className="ax-rail_groups">
          {GROUPS.map((group, gi) => (
            <div key={group.caption} className="ax-rail_group">
              {expanded ? (
                <div className="ax-rail_group_caption">{group.caption}</div>
              ) : (
                gi > 0 && <div className="ax-rail_group_divider" aria-hidden />
              )}
              <div className="ax-rail_group_items">
                {group.items.map((item) =>
                  expanded ? (
                    <RailRow key={item.id} item={item} active={active === item.id} onClick={() => simulation.setActiveMainPanel(item.id)} />
                  ) : (
                    <AxMenuIcon
                      key={item.id}
                      icon={item.icon}
                      title={item.title}
                      placement="right"
                      isActive={active === item.id}
                      onClick={() => simulation.setActiveMainPanel(item.id)}
                    />
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Bottom-anchored toggle — collapses or expands the rail. The icon flips to communicate direction. */}
        <div className="ax-rail_toggle">
          <Tooltip title={expanded ? 'Collapse navigation' : 'Expand navigation'} placement="right">
            <button type="button" onClick={() => simulation.toggleLeftRail()} className="ax-rail_toggle_btn" aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}>
              <AxMuiIcon icon={expanded ? 'mdiChevronLeft' : 'mdiChevronRight'} size="16px" />
              {expanded && <span className="ax-rail_toggle_label">Collapse</span>}
            </button>
          </Tooltip>
        </div>
      </div>
    </Layout.Sider>
  )
})
