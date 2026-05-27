import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { SimulationAdjustmentSidebar } from '../../components/SimulationAdjustmentSidebar'
import { SimulationAnalysisToolbar } from './SimulationAnalysisToolbar'
import { SimulationAnalysisSummary } from './SimulationAnalysisSummary'
import { SimulationAnalysisShopFloorArea } from './SimulationAnalysisShopFloorArea'
import { SimulationAnalysisToolGroupBars } from './SimulationAnalysisToolGroupBars'
import { SimulationAnalysisHeatmap } from './SimulationAnalysisHeatmap'
import { SimulationAnalysisMilestones } from './SimulationAnalysisMilestones'
import { SimulationAnalysisFamilyTech } from './SimulationAnalysisFamilyTech'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Mirrors the gantt panel shape: AxDisplayPanel header carries the analysis toolbar (date range + adjustment toggle),
// the body splits into an optional left adjustment sidebar and the main content scroll area on the right.
// There is no bottom panel — per the spec, analysis has no quick-analysis row of its own.
export const SimulationAnalysisPanel = observer((props: MainPanelControls) => {
  const sim = useSimulationContext()
  const analysis = sim.analysis
  return (
    <AxDisplayPanel
      type="main"
      icon="mdiChartBar"
      title={`Analysis · ${sim.activeSimulationPlan.name}`}
      tools={<SimulationAnalysisToolbar />}
      {...props}
    >
      <div className="ax-gantt">
        <div className="ax-gantt_body">
          {analysis.filterSidebarOpen && <SimulationAdjustmentSidebar onClose={() => analysis.toggleFilterSidebar()} />}
          <div className="ax-gantt_body_content ax-analysis_scroll">
            <SimulationAnalysisSummary />
            <SimulationAnalysisShopFloorArea />
            <SimulationAnalysisToolGroupBars />
            <SimulationAnalysisHeatmap />
            <SimulationAnalysisMilestones />
            <SimulationAnalysisFamilyTech />
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
