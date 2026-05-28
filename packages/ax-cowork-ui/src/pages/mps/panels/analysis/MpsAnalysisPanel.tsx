import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { MpsAdjustmentSidebar } from '../../components/MpsAdjustmentSidebar'
import { MpsAnalysisToolbar } from './MpsAnalysisToolbar'
import { MpsAnalysisSummary } from './MpsAnalysisSummary'
import { MpsAnalysisShopFloorArea } from './MpsAnalysisShopFloorArea'
import { MpsAnalysisToolGroupBars } from './MpsAnalysisToolGroupBars'
import { MpsAnalysisHeatmap } from './MpsAnalysisHeatmap'
import { MpsAnalysisMilestones } from './MpsAnalysisMilestones'
import { MpsAnalysisFamilyTech } from './MpsAnalysisFamilyTech'
import { MpsAnalysisRoutingMatrix } from './MpsAnalysisRoutingMatrix'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Mirrors the gantt panel shape: AxDisplayPanel header carries the analysis toolbar (date range + adjustment toggle),
// the body splits into an optional left adjustment sidebar and the main content scroll area on the right.
// There is no bottom panel — per the spec, analysis has no quick-analysis row of its own.
export const MpsAnalysisPanel = observer((props: MainPanelControls) => {
  const sim = useMpsContext()
  const analysis = sim.analysis
  return (
    <AxDisplayPanel
      type="main"
      icon="mdiChartBar"
      title={`Analysis · ${sim.activeMpsPlan.name}`}
      tools={<MpsAnalysisToolbar />}
      {...props}
    >
      <div className="ax-gantt">
        <div className="ax-gantt_body">
          {analysis.filterSidebarOpen && <MpsAdjustmentSidebar onClose={() => analysis.toggleFilterSidebar()} />}
          <div className="ax-gantt_body_content ax-analysis_scroll">
            <MpsAnalysisSummary />
            <MpsAnalysisShopFloorArea />
            <MpsAnalysisToolGroupBars />
            <MpsAnalysisHeatmap />
            <MpsAnalysisMilestones />
            <MpsAnalysisFamilyTech />
            <MpsAnalysisRoutingMatrix />
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
