import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationDatasetPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiTableLarge" title="PM Data" {...props}>
      SimulationDatasetPanel
    </AxDisplayPanel>
  )
})
