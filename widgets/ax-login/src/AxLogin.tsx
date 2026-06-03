import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { configure } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ConfigProvider } from 'antd'
import { type AxEvent, executeAction, useWidgetEvents, axColors, axTheme } from '@ax/common'
import type { AxLoginContainerProps } from '../typings/AxLoginProps'
import { AxLoginProvider, useAxLoginStore } from './stores/context'
import { AxLoginStore, type AxLoginBridge } from './stores/AxLoginStore'
import { AxLoginMain } from './main/AxLoginMain'

import './styles/AxLogin.scss'

// Each Mendix widget bundle ships its own MobX copy, so several MobX instances can be active on
// one page. Isolate this bundle's global state to avoid the "multiple, different versions of MobX
// active" runtime error. Runs at module load, before any store/observable is created.
configure({ isolateGlobalState: true })

// Build the (non-observable) bridge of current Mendix values/callbacks the store reads at
// action time. executeAction guards canExecute/isExecuting for us.
function buildBridge(props: AxLoginContainerProps): AxLoginBridge {
  return {
    account: props.accountAttribute.value ?? '',
    password: props.passwordAttribute.value ?? '',
    busy: props.isBusy?.value === true,
    signIn: () => executeAction(props.signInAction),
    signUp: () => executeAction(props.signUpAction),
    sso: () => executeAction(props.ssoAction),
  }
}

// Entry component: provides the per-instance MobX store (created once by the shared
// createWidgetContext Provider) and the AX brand theme. State + event wiring lives in the
// observer child below.
export function AxLogin(props: AxLoginContainerProps): ReactElement {
  return (
    <AxLoginProvider createStore={() => new AxLoginStore(buildBridge(props))}>
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
        <AxLoginInner {...props} />
      </ConfigProvider>
    </AxLoginProvider>
  )
}

const AxLoginInner = observer((props: AxLoginContainerProps): ReactElement => {
  const store = useAxLoginStore()
  const account = props.accountAttribute.value ?? ''
  const password = props.passwordAttribute.value ?? ''

  // Refresh the store's bridge with the latest Mendix props on every render.
  store.syncBridge(buildBridge(props))

  // Global event handling: respond to events on the shared bus (broadcast + this widget's topic).
  // Emit from Mendix nanoflows or the console, e.g. window.__AX_EVENT_BUS__.emit('ax:broadcast', { action: 'reset' }).
  const handleEvent = useCallback(
    (event: AxEvent) => {
      if (event.action === 'reset') {
        props.accountAttribute.setValue('')
        props.passwordAttribute.setValue('')
        store.reset()
      } else if (event.action === 'submit') {
        store.submit()
      }
    },
    [props.accountAttribute, props.passwordAttribute, store],
  )
  // isLayout: ensure the bus exists even when the login widget stands alone (no layout widget).
  useWidgetEvents({ widgetName: props.name, onEvent: handleEvent, isLayout: true })

  return (
    <AxLoginMain
      className={props.class}
      logoUrl={props.logoUrl?.value?.uri}
      account={account}
      password={password}
      accountError={store.accountErrorFor(account)}
      passwordError={store.passwordErrorFor(password)}
      busy={props.isBusy?.value === true}
      errorMessage={props.errorMessage?.value || undefined}
      canSignUp={!!props.signUpAction}
      canSso={!!props.ssoAction}
      labels={{
        account: props.accountLabel?.value ?? '',
        accountPlaceholder: props.accountPlaceholder?.value ?? '',
        password: props.passwordLabel?.value ?? '',
        submit: props.submitLabel?.value ?? '',
        signUpPrompt: props.signUpPrompt?.value ?? '',
        signUpLink: props.signUpLinkLabel?.value ?? '',
        sso: props.ssoLabel?.value ?? '',
      }}
      onAccountChange={(value) => props.accountAttribute.setValue(value)}
      onPasswordChange={(value) => props.passwordAttribute.setValue(value)}
      onAccountBlur={store.touchAccount}
      onPasswordBlur={store.touchPassword}
      onSignIn={store.submit}
      onSignUp={props.signUpAction ? store.signUp : undefined}
      onSso={props.ssoAction ? store.sso : undefined}
    />
  )
})
