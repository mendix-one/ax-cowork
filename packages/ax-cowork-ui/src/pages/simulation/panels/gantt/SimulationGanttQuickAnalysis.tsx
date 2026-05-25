import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { SimulationGanttQuickAnalysisOverall } from './SimulationGanttQuickAnalysisOverall'
import { SimulationGanttQuickAnalysisToolGroup } from './SimulationGanttQuickAnalysisToolGroup'
import { SimulationGanttQuickAnalysisViolations } from './SimulationGanttQuickAnalysisViolations'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const SimulationGanttQuickAnalysis = observer(() => {
  const gantt = useSimulationContext().gantt
  return (
    <div className="ax-gantt_analysis">
      <div className="ax-gantt_analysis_header">
        <span>Quick Analysis</span>
        <Button
          size="small"
          type="text"
          className="ax-antd-button-icon-small"
          icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
          onClick={() => gantt.toggleQuickAnalysis()}
        />
      </div>
      <div className="ax-gantt_analysis_body">
        <div className="ax-gantt_analysis_grid">
          <div className="ax-gantt_analysis_col ax-gantt_analysis_col__overall">
            <SimulationGanttQuickAnalysisOverall />
          </div>
          <div className="ax-gantt_analysis_col ax-gantt_analysis_col__toolgroup">
            <SimulationGanttQuickAnalysisToolGroup />
          </div>
          <div className="ax-gantt_analysis_col ax-gantt_analysis_col__violations">
            <SimulationGanttQuickAnalysisViolations />
          </div>
        </div>
      </div>
    </div>
  )
})
