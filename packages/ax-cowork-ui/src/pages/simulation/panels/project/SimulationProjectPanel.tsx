import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SimulationProjectPanel = observer((props: MainPanelControls) => {
  return (
    <AxDisplayPanel type="main" icon="mdiFormatListBulletedType" title="Project List" {...props}>
      SimulationProjectPanel
    </AxDisplayPanel>
  )
})
