import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationGanttPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title="Plan A (Simulation)" {...props}>
      SimulationGanttPanel
    </AxDisplayPanel>
  )
})
