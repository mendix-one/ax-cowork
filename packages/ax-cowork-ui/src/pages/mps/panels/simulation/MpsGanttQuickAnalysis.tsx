import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../store/mps.context'
import { MpsGanttQuickAnalysisOverall } from './MpsGanttQuickAnalysisOverall'
import { MpsGanttQuickAnalysisToolGroup } from './MpsGanttQuickAnalysisToolGroup'
import { MpsGanttQuickAnalysisViolations } from './MpsGanttQuickAnalysisViolations'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const MpsGanttQuickAnalysis = observer(() => {
  const gantt = useMpsContext().gantt
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
            <MpsGanttQuickAnalysisOverall />
          </div>
          <div className="ax-gantt_analysis_col ax-gantt_analysis_col__toolgroup">
            <MpsGanttQuickAnalysisToolGroup />
          </div>
          <div className="ax-gantt_analysis_col ax-gantt_analysis_col__violations">
            <MpsGanttQuickAnalysisViolations />
          </div>
        </div>
      </div>
    </div>
  )
})
