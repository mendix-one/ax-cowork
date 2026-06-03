import type { ReactElement } from 'react'
import { configure } from 'mobx'
import type { AxDisplayPanelContainerProps } from '../typings/AxDisplayPanelProps'
import { AxDisplayPanelProvider } from './stores/context'
import { AxDisplayPanelStore, buildBridge } from './stores/AxDisplayPanelStore'
import { AxDisplayPanelMain } from './main/AxDisplayPanelMain'

import './styles/AxDisplayPanel.scss'

// Each Mendix widget bundle ships its own MobX copy, so several MobX instances can be active on one
// page. Isolate this bundle's global state to avoid the "multiple, different versions of MobX active"
// runtime error. Runs at module load, before any store/observable is created.
configure({ isolateGlobalState: true })

// Entry component: provides the per-instance MobX store (created once by the shared createWidgetContext
// Provider). The chrome, maximize state, and global-bus wiring live in the observer child.
export function AxDisplayPanel(props: AxDisplayPanelContainerProps): ReactElement {
  return (
    <AxDisplayPanelProvider createStore={() => new AxDisplayPanelStore(buildBridge(props))}>
      <AxDisplayPanelMain {...props} />
    </AxDisplayPanelProvider>
  )
}
