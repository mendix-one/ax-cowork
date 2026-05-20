import { observer } from 'mobx-react-lite'
import { AxDisplayPanel, type SubPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

export const SplitViewPanel = observer((props: SubPanelControls) => {
  return <AxDisplayPanel type="sub" icon="mdiBookOpenOutline" title="Split View" {...props} />
})
