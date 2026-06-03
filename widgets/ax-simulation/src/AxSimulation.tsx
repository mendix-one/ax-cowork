import type { ReactElement } from 'react'
import { configure } from 'mobx'
import { ConfigProvider } from 'antd'
import { axTheme } from '@ax/common'
import type { AxSimulationContainerProps } from '../typings/AxSimulationProps'
import { AxSimulationProvider } from './stores/context'
import { AxSimulationStore } from './stores/AxSimulationStore'
import { AxSimulationSync } from './AxSimulationSync'

import './styles/AxSimulation.scss'

// Each Mendix widget bundle ships its own MobX copy, so several MobX instances can be active on
// one page. Isolate this bundle's global state to avoid the "multiple, different versions of MobX
// active" runtime error. Runs at module load, before any store/observable is created.
configure({ isolateGlobalState: true })

// Entry component: provides the per-instance MobX store (created once by the shared
// createWidgetContext Provider) and the AX brand theme. AxSimulationSync syncs the widget props into
// the store (per-group, via effects) and wires the event bus; the presentational layout lives in
// AxSimulationMain, which reads only store state.
export function AxSimulation(props: AxSimulationContainerProps): ReactElement {
  return (
    <AxSimulationProvider createStore={() => new AxSimulationStore()}>
      <ConfigProvider theme={axTheme}>
        <AxSimulationSync {...props} />
      </ConfigProvider>
    </AxSimulationProvider>
  )
}
