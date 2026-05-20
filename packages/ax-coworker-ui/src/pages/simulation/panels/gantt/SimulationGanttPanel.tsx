import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

const SimulationGanttTools = observer(() => {
  return (
    <>
      <div>left</div>
      <div>right</div>
    </>
  )
})

export const SimulationGanttPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title="Plan A (Simulation)" tools={<SimulationGanttTools />} {...props}>
      SimulationGanttPanel
    </AxDisplayPanel>
  )
})
