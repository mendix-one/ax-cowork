import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { SimulationGanttToolbar } from './SimulationGanttToolbar'
import { SimulationGanttFilterSidebar } from './SimulationGanttFilterSidebar'
import { SimulationGanttQuickAnalysis } from './SimulationGanttQuickAnalysis'
import { SimulationGanttChart } from './SimulationGanttChart'
// import { SimulationGanttRisksStrip } from './SimulationGanttRisksStrip'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationGanttPanel = observer((props: MainPanelControls) => {
  const simulation = useSimulationContext()
  const gantt = simulation.gantt

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title={simulation.activeSimulationPlan.name} tools={<SimulationGanttToolbar />} {...props}>
      <div className="ax-gantt">
        <div className="ax-gantt_body">
          {/* Filter sidebar — always mounted, width-animates open/closed so the planner sees a continuous
              slide rather than a hard insertion. */}
          <div className={`ax-gantt_side_wrap ${gantt.filterSidebarOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!gantt.filterSidebarOpen}>
            <SimulationGanttFilterSidebar />
          </div>
          <div className="ax-gantt_body_content">
            <SimulationGanttChart />
            {/* Quick analysis (capacity overlay) — height-animates so the chart re-flows smoothly. */}
            <div className={`ax-gantt_analysis_wrap ${gantt.quickAnalysisOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!gantt.quickAnalysisOpen}>
              <SimulationGanttQuickAnalysis />
            </div>
            {/*<SimulationGanttRisksStrip />*/}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
