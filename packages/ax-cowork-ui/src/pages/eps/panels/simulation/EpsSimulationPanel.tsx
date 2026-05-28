import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsSimulationToolbar } from './EpsSimulationToolbar'
import { EpsSimulationFilterSidebar } from './EpsSimulationFilterSidebar'
import { EpsSimulationQuickAnalysis } from './EpsSimulationQuickAnalysis'
import { EpsSimulationChart } from './EpsSimulationChart'
// import { EpsSimulationRisksStrip } from './EpsSimulationRisksStrip'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const EpsSimulationPanel = observer((props: MainPanelControls) => {
  const sim = useEpsContext()
  const simulation = sim.simulation

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title={sim.activeEpsPlan.name} tools={<EpsSimulationToolbar />} {...props}>
      <div className="ax-simulation">
        <div className="ax-simulation_body">
          {/* Filter sidebar — always mounted, width-animates open/closed so the planner sees a continuous
              slide rather than a hard insertion. */}
          <div className={`ax-simulation_side_wrap ${simulation.filterSidebarOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!simulation.filterSidebarOpen}>
            <EpsSimulationFilterSidebar />
          </div>
          <div className="ax-simulation_body_content">
            <EpsSimulationChart />
            {/* Quick analysis (capacity overlay) — height-animates so the chart re-flows smoothly. */}
            <div className={`ax-simulation_analysis_wrap ${simulation.quickAnalysisOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!simulation.quickAnalysisOpen}>
              <EpsSimulationQuickAnalysis />
            </div>
            {/*<EpsSimulationRisksStrip />*/}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
