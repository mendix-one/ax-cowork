import type { ReactElement } from 'react'
import { configure } from 'mobx'
import { ConfigProvider } from 'antd'
import { axTheme } from '@ax/common'
import type { AxAppLayoutContainerProps } from '../typings/AxAppLayoutProps'
import { AxAppProvider } from './stores/context'
import { AxAppStore } from './stores/AxAppStore'
import { AxAppSync } from './AxAppSync'

import './styles/AxApp.scss'

// Each Mendix widget bundle ships its own MobX copy, so several MobX instances can be active on
// one page. Isolate this bundle's global state to avoid the "multiple, different versions of MobX
// active" runtime error. Runs at module load, before any store/observable is created.
configure({ isolateGlobalState: true })

// Entry component: provides the per-instance MobX store (created once by the shared
// createWidgetContext Provider) and the AX brand theme. AxAppSync syncs the widget props into
// the store (per-group, via effects) and wires the event bus; the presentational layout lives in
// AxAppMain, which reads only store state.
export function AxAppLayout(props: AxAppLayoutContainerProps): ReactElement {
  return (
    <AxAppProvider createStore={() => new AxAppStore()}>
      <ConfigProvider theme={axTheme}>
        <AxAppSync {...props} />
      </ConfigProvider>
    </AxAppProvider>
  )
}
