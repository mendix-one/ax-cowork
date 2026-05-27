import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { SimulationAdjustmentSidebar } from '../../components/SimulationAdjustmentSidebar'
import { SimulationProductionProcessToolbar } from './SimulationProductionProcessToolbar'
import { SimulationProductionProcessTechList } from './SimulationProductionProcessTechList'
import { SimulationProductionProcessPipeline } from './SimulationProductionProcessPipeline'
import { SimulationProductionProcessRouting } from './SimulationProductionProcessRouting'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Production Processes panel. Shell mirrors the gantt/analysis panels (header tools + side+content body)
// so the planner doesn't have to relearn the layout. Three regions inside the content scroll:
//   1. Tech list (left) — selectable summary cards.
//   2. Pipeline (right top) — visual horizontal flow of process steps for the selected tech, plus a step table.
//   3. Routing matrix (right bottom) — tech × tool group, exposes shared/competing groups.
export const SimulationProductionProcessPanel = observer((props: MainPanelControls) => {
  const sim = useSimulationContext()
  const process = sim.productionProcess
  return (
    <AxDisplayPanel type="main" icon="mdiSitemapOutline" title="Production Processes" tools={<SimulationProductionProcessToolbar />} {...props}>
      <div className="ax-gantt">
        <div className="ax-gantt_body">
          {process.filterSidebarOpen && <SimulationAdjustmentSidebar onClose={() => process.toggleFilterSidebar()} />}
          <div className="ax-gantt_body_content ax-analysis_scroll ax-process_scroll">
            <div className="ax-process_split">
              <SimulationProductionProcessTechList />
              <div className="ax-process_split_right">
                <SimulationProductionProcessPipeline />
              </div>
            </div>
            <SimulationProductionProcessRouting />
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
