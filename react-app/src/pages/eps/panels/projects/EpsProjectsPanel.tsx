import { useState } from 'react'
import { Button, Empty, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { EpsFactorsFilter } from '../../views/EpsFactorsFilter'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Projects view — project portfolio for the selected production line. The body is still a placeholder, but it
// already carries the shared Factors filter sidebar (so the planner scopes by organization / process factors
// the same way as on the Simulation and Analysis screens).
export const EpsProjectsPanel = observer((props: MainPanelControls) => {
  const [filterOpen, setFilterOpen] = useState(true)

  return (
    <AxDisplayPanel
      type="main"
      icon="mdiFolderMultipleOutline"
      title="Projects"
      tools={
        <Tooltip title={filterOpen ? 'Hide factors' : 'Show factors'}>
          <Button
            size="small"
            type={filterOpen ? 'primary' : 'default'}
            icon={<AxMuiIcon icon="mdiFilterVariant" size={14} />}
            onClick={() => setFilterOpen((o) => !o)}
          />
        </Tooltip>
      }
      {...props}
    >
      <div className="ax-eps-simulation">
        <div className="ax-eps-simulation_body">
          <div className={`ax-eps-simulation_side_wrap ${filterOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!filterOpen}>
            <EpsFactorsFilter onClose={() => setFilterOpen(false)} />
          </div>
          <div className="ax-eps-simulation_body_content">
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Project portfolio for the selected production line — coming soon." />
            </div>
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
