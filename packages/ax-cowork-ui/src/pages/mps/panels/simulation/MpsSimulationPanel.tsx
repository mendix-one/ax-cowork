import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { MpsSimulationToolbar } from './MpsSimulationToolbar'
import { MpsSimulationFilterSidebar } from './MpsSimulationFilterSidebar'
import { MpsSimulationQuickAnalysis } from './MpsSimulationQuickAnalysis'
import { MpsSimulationChart } from './MpsSimulationChart'
// import { MpsSimulationRisksStrip } from './MpsSimulationRisksStrip'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const MpsSimulationPanel = observer((props: MainPanelControls) => {
  const sim = useMpsContext()
  const simulation = sim.simulation

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title={sim.activeMpsPlan.name} tools={<MpsSimulationToolbar />} {...props}>
      <div className="ax-simulation">
        <div className="ax-simulation_body">
          {/* Filter sidebar — always mounted, width-animates open/closed so the planner sees a continuous
              slide rather than a hard insertion. */}
          <div className={`ax-simulation_side_wrap ${simulation.filterSidebarOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!simulation.filterSidebarOpen}>
            <MpsSimulationFilterSidebar />
          </div>
          <div className="ax-simulation_body_content">
            <MpsSimulationChart />
            {/* Quick analysis (capacity overlay) — height-animates so the chart re-flows smoothly. */}
            <div className={`ax-simulation_analysis_wrap ${simulation.quickAnalysisOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!simulation.quickAnalysisOpen}>
              <MpsSimulationQuickAnalysis />
            </div>
            {/*<MpsSimulationRisksStrip />*/}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
