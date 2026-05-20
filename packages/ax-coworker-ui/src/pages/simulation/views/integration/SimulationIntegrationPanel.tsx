import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationIntegrationPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiTransitConnectionVariant" title="System Integration" {...props}>
      SimulationIntegrationPanel
    </AxDisplayPanel>
  )
})
