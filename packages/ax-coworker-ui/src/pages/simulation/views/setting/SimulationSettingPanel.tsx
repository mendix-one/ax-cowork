import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationSettingPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiCogs" title="Line Setting" {...props}>
      SimulationSettingPanel
    </AxDisplayPanel>
  )
})
