import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationFactorPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiHubOutline" title="Factors Control" {...props}>
      SimulationFactorPanel
    </AxDisplayPanel>
  )
})
