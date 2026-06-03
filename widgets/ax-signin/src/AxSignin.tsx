import type { ReactElement } from 'react'
import { configure } from 'mobx'
import { ConfigProvider } from 'antd'
import { axColors, axTheme } from '@ax/common'
import type { AxSigninContainerProps } from '../typings/AxSigninProps'
import { AxSigninProvider } from './stores/context'
import { AxSigninStore } from './stores/AxSigninStore'
import { AxSigninSync } from './AxSigninSync'

import './styles/AxSignin.scss'

// Each Mendix widget bundle ships its own MobX copy, so several MobX instances can be active on
// one page. Isolate this bundle's global state to avoid the "multiple, different versions of MobX
// active" runtime error. Runs at module load, before any store/observable is created.
configure({ isolateGlobalState: true })

// Entry component: provides the per-instance MobX store (created once by the shared
// createWidgetContext Provider) and the AX brand theme. AxSigninSync syncs the widget props into the
// store and wires the event bus; the presentational card lives in AxSigninMain, which reads only store
// state.
export function AxSignin(props: AxSigninContainerProps): ReactElement {
  return (
    <AxSigninProvider createStore={() => new AxSigninStore()}>
      <ConfigProvider
        theme={axTheme}
        form={{
          requiredMark: (labelNode, { required }) => (
            <>
              {labelNode}
              {required && (
                <span aria-hidden="true" style={{ color: axColors.error, marginInlineStart: 4 }}>
                  *
                </span>
              )}
            </>
          ),
        }}
      >
        <AxSigninSync {...props} />
      </ConfigProvider>
    </AxSigninProvider>
  )
}
