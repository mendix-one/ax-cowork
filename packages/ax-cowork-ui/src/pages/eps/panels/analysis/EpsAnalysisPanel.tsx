import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsAdjustmentSidebar } from '../../views/EpsAdjustmentSidebar'
import { EpsAnalysisToolbar } from './EpsAnalysisToolbar'
import { EpsAnalysisSummary } from './EpsAnalysisSummary'
import { EpsAnalysisShopFloorArea } from './EpsAnalysisShopFloorArea'
import { EpsAnalysisToolGroupBars } from './EpsAnalysisToolGroupBars'
import { EpsAnalysisHeatmap } from './EpsAnalysisHeatmap'
import { EpsAnalysisMilestones } from './EpsAnalysisMilestones'
import { EpsAnalysisFamilyTech } from './EpsAnalysisFamilyTech'
import { EpsAnalysisRoutingMatrix } from './EpsAnalysisRoutingMatrix'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

// Mirrors the simulation panel shape: AxDisplayPanel header carries the analysis toolbar (date range + adjustment toggle),
// the body splits into an optional left adjustment sidebar and the main content scroll area on the right.
// There is no bottom panel — per the spec, analysis has no quick-analysis row of its own.
export const EpsAnalysisPanel = observer((props: MainPanelControls) => {
  const sim = useEpsContext()
  const analysis = sim.analysis
  return (
    <AxDisplayPanel
      type="main"
      icon="mdiChartBar"
      title={`Analysis · ${sim.activeEpsPlan.name}`}
      tools={<EpsAnalysisToolbar />}
      {...props}
    >
      <div className="ax-simulation">
        <div className="ax-simulation_body">
          {analysis.filterSidebarOpen && <EpsAdjustmentSidebar onClose={() => analysis.toggleFilterSidebar()} />}
          <div className="ax-simulation_body_content ax-analysis_scroll">
            <EpsAnalysisSummary />
            <EpsAnalysisShopFloorArea />
            <EpsAnalysisToolGroupBars />
            <EpsAnalysisHeatmap />
            <EpsAnalysisMilestones />
            <EpsAnalysisFamilyTech />
            <EpsAnalysisRoutingMatrix />
          </div>
        </div>
      </div>
    </AxDisplayPanel>
  )
})
