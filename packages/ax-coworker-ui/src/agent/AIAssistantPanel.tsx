import { observer } from 'mobx-react-lite'
import { AxSimplePanel, type PanelControls } from '@/shared/simple-panel/AxSimplePanel.tsx'

export const AIAssistantPanel = observer((props: PanelControls) => {
  return <AxSimplePanel icon="mdiCreationOutline" title="AI Assistant" {...props} />
})
