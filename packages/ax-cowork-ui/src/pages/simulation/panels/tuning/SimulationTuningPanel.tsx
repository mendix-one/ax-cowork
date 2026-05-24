import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationTuningPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiTicketPercentOutline" title="Tuning Logic" {...props}>
      SimulationTuningPanel
    </AxDisplayPanel>
  )
})
