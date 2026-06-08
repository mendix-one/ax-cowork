import { observer } from 'mobx-react-lite'
import type { MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { EpsPlaceholderPanel } from '../placeholder/EpsPlaceholderPanel.tsx'

// Settings — workspace / line configuration. Placeholder until the real view lands.
export const EpsSettingsPanel = observer((props: MainPanelControls) => {
  return <EpsPlaceholderPanel icon="mdiCogOutline" title="Settings" description="Workspace and production-line configuration — coming soon." {...props} />
})
