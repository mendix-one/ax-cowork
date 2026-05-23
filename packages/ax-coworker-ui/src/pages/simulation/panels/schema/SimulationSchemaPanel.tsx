import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationSchemaPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiDatabaseOutline" title="Data Monitor" {...props}>
      SimulationSchemaPanel
    </AxDisplayPanel>
  )
})
