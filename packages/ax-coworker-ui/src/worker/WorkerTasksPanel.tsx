import { observer } from 'mobx-react-lite'
import { AxSimplePanel, type PanelControls } from '@/shared/simple-panel/AxSimplePanel.tsx'

export const WorkerTasksPanel = observer((props: PanelControls) => {
  return <AxSimplePanel icon="mdiProgressStarFourPoints" title="Progress" {...props} />
})
