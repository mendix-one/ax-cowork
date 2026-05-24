import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const WorkerTasksPanel = observer((props: SubPanelControls) => {
  return <AxDisplayPanel type="sub" icon="mdiProgressStarFourPoints" title="Tasks Progress" {...props} />
})
