import type { ReactElement } from 'react'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ConfigProvider } from 'antd'
import type { AxLoginContainerProps } from '../typings/AxLoginProps'
import { AxLoginMain } from './main/AxLoginMain'
import { AxLoginStore, type AxLoginBridge } from './stores/AxLoginStore'

// Container: maps the Mendix Values-API props (EditableValue / DynamicValue / ActionValue) onto
// the presentational AxLoginMain, mediated by a MobX store (AxLoginStore) that owns the form's
// interaction state. `observer` re-renders when the store's observables change; wrapped in a
// ConfigProvider so the widget keeps the AX brand primary regardless of the host page's theme.
export const AxLogin = observer((props: AxLoginContainerProps): ReactElement => {
  const { accountAttribute, passwordAttribute, signInAction, signUpAction, errorMessage, isBusy, logoUrl } = props

  const account = accountAttribute.value ?? ''
  const password = passwordAttribute.value ?? ''

  // Rebuilt each render so the store's actions always close over the current Mendix props.
  const bridge: AxLoginBridge = {
    account,
    password,
    busy: isBusy?.value === true,
    signIn: () => {
      if (signInAction?.canExecute && !signInAction.isExecuting) {
        signInAction.execute()
      }
    },
    signUp: () => {
      if (signUpAction?.canExecute) {
        signUpAction.execute()
      }
    },
  }

  // Create the store once; refresh its (non-observable) bridge on every render.
  const [store] = useState(() => new AxLoginStore(bridge))
  store.syncBridge(bridge)

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#3F51B5' } }}>
      <AxLoginMain
        className={props.class}
        logoUrl={logoUrl?.value?.uri}
        account={account}
        password={password}
        accountError={store.accountErrorFor(account)}
        passwordError={store.passwordErrorFor(password)}
        busy={isBusy?.value === true}
        errorMessage={errorMessage?.value || undefined}
        canSignUp={!!signUpAction}
        labels={{
          account: props.accountLabel?.value ?? '',
          accountPlaceholder: props.accountPlaceholder?.value ?? '',
          password: props.passwordLabel?.value ?? '',
          submit: props.submitLabel?.value ?? '',
          signUpPrompt: props.signUpPrompt?.value ?? '',
          signUpLink: props.signUpLinkLabel?.value ?? '',
        }}
        onAccountChange={(value) => accountAttribute.setValue(value)}
        onPasswordChange={(value) => passwordAttribute.setValue(value)}
        onAccountBlur={store.touchAccount}
        onPasswordBlur={store.touchPassword}
        onSignIn={store.submit}
        onSignUp={signUpAction ? store.signUp : undefined}
      />
    </ConfigProvider>
  )
})
