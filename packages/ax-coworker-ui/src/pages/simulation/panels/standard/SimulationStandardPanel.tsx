import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationStandardPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiAlarmPanelOutline" title="PM Standard" {...props}>
      SimulationStandardPanel
    </AxDisplayPanel>
  )
})
