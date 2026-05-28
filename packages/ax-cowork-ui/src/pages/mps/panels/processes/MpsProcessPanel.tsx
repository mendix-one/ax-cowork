import { observer } from 'mobx-react-lite'
import { MpsProcessToolbar } from './MpsProcessToolbar'
import { MpsProcessTechList } from './MpsProcessTechList'
import { MpsProcessPipeline } from './MpsProcessPipeline'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Production Processes panel. Layout mirrors the simulation / analysis / production-order panels: a persistent
// left sidebar + a main content area that scrolls. Here the left sidebar is the Technology Routings list
// (always visible — it's the primary navigation for the panel), the main area is the per-tech pipeline.
// The cross-tech Routing matrix that used to live here has moved into the Analysis view, alongside the
// other tech-level rollups — the Process panel now focuses on the selected tech's pipeline only.
export const MpsProcessPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiSitemapOutline" title="Processes" tools={<MpsProcessToolbar />} {...props}>
      <div className="ax-mps-simulation">
        <div className="ax-mps-simulation_body">
          <MpsProcessTechList />
          <div className="ax-mps-simulation_body_content ax-mps-analysis_scroll ax-mps-process_scroll">
            <MpsProcessPipeline />
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
