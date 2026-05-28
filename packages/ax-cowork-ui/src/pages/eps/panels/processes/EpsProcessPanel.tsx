import { observer } from 'mobx-react-lite'
import { EpsProcessToolbar } from './EpsProcessToolbar'
import { EpsProcessTechList } from './EpsProcessTechList'
import { EpsProcessPipeline } from './EpsProcessPipeline'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Production Processes panel. Layout mirrors the simulation / analysis / production-order panels: a persistent
// left sidebar + a main content area that scrolls. Here the left sidebar is the Technology Routings list
// (always visible — it's the primary navigation for the panel), the main area is the per-tech pipeline.
// The cross-tech Routing matrix that used to live here has moved into the Analysis view, alongside the
// other tech-level rollups — the Process panel now focuses on the selected tech's pipeline only.
export const EpsProcessPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiSitemapOutline" title="Processes" tools={<EpsProcessToolbar />} {...props}>
      <div className="ax-simulation">
        <div className="ax-simulation_body">
          <EpsProcessTechList />
          <div className="ax-simulation_body_content ax-analysis_scroll ax-process_scroll">
            <EpsProcessPipeline />
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
