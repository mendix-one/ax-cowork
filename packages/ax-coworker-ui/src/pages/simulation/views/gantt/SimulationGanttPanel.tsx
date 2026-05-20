import { observer } from 'mobx-react-lite'
import { AxSimplePanel, type PanelControls } from '@/shared/simple-panel/AxSimplePanel.tsx'

export const SimulationGanttPanel = observer((props: PanelControls) => {
  return (
    <AxSimplePanel icon="mdiChartGantt" title="Plan A (Simulation)" {...props}>
      SimulationGanttPanel
    </AxSimplePanel>
  )
})
