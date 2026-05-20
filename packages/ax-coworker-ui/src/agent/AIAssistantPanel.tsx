import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const AIAssistantPanel = observer((props: SubPanelControls) => {
  return <AxDisplayPanel type="sub" icon="mdiCreationOutline" title="AI Assistant" {...props} />
})
