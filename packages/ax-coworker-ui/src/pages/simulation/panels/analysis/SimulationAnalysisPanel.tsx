import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationAnalysisPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiChartBar" title="Analysis View" {...props}>
      SimulationAnalysisPanel
    </AxDisplayPanel>
  )
})
