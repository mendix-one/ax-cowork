import { Layout } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxMenuIcon } from '@/shared/menu-icon/AxMenuIcon.tsx'
import { type MdiIconName } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { useEpsContext } from '../stores/eps.context'
import type { MainPanelId } from '../stores/eps.store'

// Fixed-width icon rail (2.65rem) — pixel-tight default for FHD planner sessions. Tooltip-on-hover gives
// each panel its label; group dividers separate Plan / Tuning / System sections.
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
      { id: 'simulation', icon: 'mdiChartGantt', title: 'Simulation (Gantt)' },
      { id: 'projects', icon: 'mdiFolderMultipleOutline', title: 'Projects' },
      { id: 'analysis', icon: 'mdiChartBar', title: 'Resource Analysis' },
    ],
  },
  {
    caption: 'Process',
    items: [
      { id: 'processes', icon: 'mdiSitemapOutline', title: 'Engineering Process' },
      { id: 'processTuning', icon: 'mdiTuneVerticalVariant', title: 'Tuning Logic' },
    ],
  },
  {
    caption: 'Resources',
    items: [
      { id: 'standardPm', icon: 'mdiClipboardCheckOutline', title: 'Standard PM' },
      { id: 'capacity', icon: 'mdiAccountGroupOutline', title: 'Headcount' },
      { id: 'factorsControl', icon: 'mdiHubOutline', title: 'Factors Control' },
    ],
  },
  {
    caption: 'System',
    items: [
      { id: 'integration', icon: 'mdiTransitConnectionVariant', title: 'Integration' },
      { id: 'settings', icon: 'mdiCogOutline', title: 'Settings' },
    ],
  },
]

export const EpsLayoutLeft = observer(() => {
  const simulation = useEpsContext()
  const active = simulation.activeMainPanel
  return (
    <Layout.Sider width="2.65rem" className="ax-rail">
      <div className="ax-rail_inner">
        <div className="ax-rail_groups">
          {GROUPS.map((group, gi) => (
            <div key={group.caption} className="ax-rail_group">
              {gi > 0 && <div className="ax-rail_group_divider" aria-hidden />}
              <div className="ax-rail_group_items">
                {group.items.map((item) => (
                  <AxMenuIcon
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    placement="right"
                    isActive={active === item.id}
                    onClick={() => simulation.setActiveMainPanel(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout.Sider>
  )
})
