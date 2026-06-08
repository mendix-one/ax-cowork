import { observer } from 'mobx-react-lite'
import type { MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'
import { EpsPlaceholderPanel } from '../placeholder/EpsPlaceholderPanel.tsx'

// Standard PM — standard product/process master definitions. Placeholder until the real view lands.
export const EpsStandardPmPanel = observer((props: MainPanelControls) => {
  return (
    <EpsPlaceholderPanel icon="mdiClipboardCheckOutline" title="Standard PM" description="Standard PM definitions and templates — coming soon." {...props} />
  )
})
