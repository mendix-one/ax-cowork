import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { SimulationGanttToolbar } from './SimulationGanttToolbar'
import { SimulationGanttFilterSidebar } from './SimulationGanttFilterSidebar'
import { SimulationGanttQuickAnalysis } from './SimulationGanttQuickAnalysis'
import { SimulationGanttChart } from './SimulationGanttChart'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationGanttPanel = observer((props: MainPanelControls) => {
  const simulation = useSimulationContext()
  const gantt = simulation.gantt

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title={simulation.activeSimulationPlan.name} tools={<SimulationGanttToolbar />} {...props}>
      <div className="ax-gantt">
        <div className="ax-gantt_body">
          {gantt.filterSidebarOpen && <SimulationGanttFilterSidebar />}
          <div className="ax-gantt_body_content">
            <SimulationGanttChart />
            {gantt.quickAnalysisOpen && <SimulationGanttQuickAnalysis />}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
