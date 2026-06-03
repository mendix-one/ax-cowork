import type { ReactElement } from 'react'
import { configure } from 'mobx'
import type { AxDisplayPanelContainerProps } from '../typings/AxDisplayPanelProps'
import { AxDisplayPanelProvider } from './stores/context'
import { AxDisplayPanelStore } from './stores/AxDisplayPanelStore'
import { AxDisplayPanelSync } from './AxDisplayPanelSync'

import './styles/AxDisplayPanel.scss'

// Each Mendix widget bundle ships its own MobX copy, so several MobX instances can be active on one
// page. Isolate this bundle's global state to avoid the "multiple, different versions of MobX active"
// runtime error. Runs at module load, before any store/observable is created.
configure({ isolateGlobalState: true })

// Entry component: provides the per-instance MobX store (created once by the shared createWidgetContext
// Provider). AxDisplayPanelSync syncs the widget props into the store and wires the event bus; the
// chrome + maximize state live in AxDisplayPanelMain, which reads only store state.
export function AxDisplayPanel(props: AxDisplayPanelContainerProps): ReactElement {
  return (
    <AxDisplayPanelProvider createStore={() => new AxDisplayPanelStore()}>
      <AxDisplayPanelSync {...props} />
    </AxDisplayPanelProvider>
  )
}
