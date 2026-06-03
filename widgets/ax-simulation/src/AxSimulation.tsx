import type { ReactElement } from 'react'
import { configure } from 'mobx'
import { ConfigProvider } from 'antd'
import { axTheme } from '@ax/common'
import type { AxSimulationContainerProps } from '../typings/AxSimulationProps'
import { AxSimulationProvider } from './stores/context'
import { AxSimulationStore } from './stores/AxSimulationStore'
import { AxSimulationMain } from './main/AxSimulationMain'

import './styles/AxSimulation.scss'

// Each Mendix widget bundle ships its own MobX copy, so several MobX instances can be active on
// one page. Isolate this bundle's global state to avoid the "multiple, different versions of MobX
// active" runtime error. Runs at module load, before any store/observable is created.
configure({ isolateGlobalState: true })

// Entry component: provides the per-instance MobX store (created once by the shared
// createWidgetContext Provider) and the AX brand theme. The presentational layout + the
// active-view wiring live in the observer child.
export function AxSimulation(props: AxSimulationContainerProps): ReactElement {
  return (
    <AxSimulationProvider createStore={() => new AxSimulationStore()}>
      <ConfigProvider theme={axTheme}>
        <AxSimulationMain {...props} />
      </ConfigProvider>
    </AxSimulationProvider>
  )
}
