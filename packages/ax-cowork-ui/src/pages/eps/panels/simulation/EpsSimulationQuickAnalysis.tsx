import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../../stores/eps.context'
import { EpsSimulationQuickAnalysisOverall } from './EpsSimulationQuickAnalysisOverall'
import { EpsSimulationQuickAnalysisToolGroup } from './EpsSimulationQuickAnalysisToolGroup'
import { EpsSimulationQuickAnalysisViolations } from './EpsSimulationQuickAnalysisViolations'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

export const EpsSimulationQuickAnalysis = observer(() => {
  const simulation = useEpsContext().simulation
  return (
    <div className="ax-simulation_analysis">
      <div className="ax-simulation_analysis_header">
        <span>Quick Analysis</span>
        <Button
          size="small"
          type="text"
          className="ax-antd-button-icon-small"
          icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
          onClick={() => simulation.toggleQuickAnalysis()}
        />
      </div>
      <div className="ax-simulation_analysis_body">
        <div className="ax-simulation_analysis_grid">
          <div className="ax-simulation_analysis_col ax-simulation_analysis_col__overall">
            <EpsSimulationQuickAnalysisOverall />
          </div>
          <div className="ax-simulation_analysis_col ax-simulation_analysis_col__toolgroup">
            <EpsSimulationQuickAnalysisToolGroup />
          </div>
          <div className="ax-simulation_analysis_col ax-simulation_analysis_col__violations">
            <EpsSimulationQuickAnalysisViolations />
          </div>
        </div>
      </div>
    </div>
  )
})
