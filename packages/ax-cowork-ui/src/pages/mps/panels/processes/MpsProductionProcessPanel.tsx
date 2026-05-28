import { observer } from 'mobx-react-lite'
import { MpsProductionProcessToolbar } from './MpsProductionProcessToolbar'
import { MpsProductionProcessTechList } from './MpsProductionProcessTechList'
import { MpsProductionProcessPipeline } from './MpsProductionProcessPipeline'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Production Processes panel. Layout mirrors the gantt / analysis / production-order panels: a persistent
// left sidebar + a main content area that scrolls. Here the left sidebar is the Technology Routings list
// (always visible — it's the primary navigation for the panel), the main area is the per-tech pipeline.
// The cross-tech Routing matrix that used to live here has moved into the Analysis view, alongside the
// other tech-level rollups — the Process panel now focuses on the selected tech's pipeline only.
export const MpsProductionProcessPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiSitemapOutline" title="Processes" tools={<MpsProductionProcessToolbar />} {...props}>
      <div className="ax-gantt">
        <div className="ax-gantt_body">
          <MpsProductionProcessTechList />
          <div className="ax-gantt_body_content ax-analysis_scroll ax-process_scroll">
            <MpsProductionProcessPipeline />
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
