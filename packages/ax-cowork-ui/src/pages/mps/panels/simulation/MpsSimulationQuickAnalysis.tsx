import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { MpsSimulationQuickAnalysisOverall } from './MpsSimulationQuickAnalysisOverall'
import { MpsSimulationQuickAnalysisToolGroup } from './MpsSimulationQuickAnalysisToolGroup'
import { MpsSimulationQuickAnalysisViolations } from './MpsSimulationQuickAnalysisViolations'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const MpsSimulationQuickAnalysis = observer(() => {
  const simulation = useMpsContext().simulation
  return (
    <div className="ax-mps-simulation_analysis">
      <div className="ax-mps-simulation_analysis_header">
        <span>Quick Analysis</span>
        <Button
          size="small"
          type="text"
          className="ax-antd-button-icon-small"
          icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
          onClick={() => simulation.toggleQuickAnalysis()}
        />
      </div>
      <div className="ax-mps-simulation_analysis_body">
        <div className="ax-mps-simulation_analysis_grid">
          <div className="ax-mps-simulation_analysis_col ax-mps-simulation_analysis_col__overall">
            <MpsSimulationQuickAnalysisOverall />
          </div>
          <div className="ax-mps-simulation_analysis_col ax-mps-simulation_analysis_col__toolgroup">
            <MpsSimulationQuickAnalysisToolGroup />
          </div>
          <div className="ax-mps-simulation_analysis_col ax-mps-simulation_analysis_col__violations">
            <MpsSimulationQuickAnalysisViolations />
          </div>
        </div>
      </div>
    </div>
  )
})
