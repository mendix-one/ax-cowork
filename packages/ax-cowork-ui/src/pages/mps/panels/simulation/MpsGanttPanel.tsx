import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { MpsGanttToolbar } from './MpsGanttToolbar'
import { MpsGanttFilterSidebar } from './MpsGanttFilterSidebar'
import { MpsGanttQuickAnalysis } from './MpsGanttQuickAnalysis'
import { MpsGanttChart } from './MpsGanttChart'
// import { MpsGanttRisksStrip } from './MpsGanttRisksStrip'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const MpsGanttPanel = observer((props: MainPanelControls) => {
  const simulation = useMpsContext()
  const gantt = simulation.gantt

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title={simulation.activeMpsPlan.name} tools={<MpsGanttToolbar />} {...props}>
      <div className="ax-gantt">
        <div className="ax-gantt_body">
          {/* Filter sidebar — always mounted, width-animates open/closed so the planner sees a continuous
              slide rather than a hard insertion. */}
          <div className={`ax-gantt_side_wrap ${gantt.filterSidebarOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!gantt.filterSidebarOpen}>
            <MpsGanttFilterSidebar />
          </div>
          <div className="ax-gantt_body_content">
            <MpsGanttChart />
            {/* Quick analysis (capacity overlay) — height-animates so the chart re-flows smoothly. */}
            <div className={`ax-gantt_analysis_wrap ${gantt.quickAnalysisOpen ? 'is-open' : 'is-collapsed'}`} aria-hidden={!gantt.quickAnalysisOpen}>
              <MpsGanttQuickAnalysis />
            </div>
            {/*<MpsGanttRisksStrip />*/}
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
