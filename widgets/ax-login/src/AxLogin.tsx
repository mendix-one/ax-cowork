import type { ReactElement } from 'react'
import { ConfigProvider } from 'antd'
import type { AxLoginContainerProps } from '../typings/AxLoginProps'
import { AxLoginMain } from './main/AxLoginMain'

// Container: maps the Mendix Values-API props (EditableValue / DynamicValue / ActionValue)
// onto the presentational AxLoginMain. Wraps in a ConfigProvider so the widget keeps the AX
// brand primary regardless of the host page's AntD theme.
export function AxLogin(props: AxLoginContainerProps): ReactElement {
  const { accountAttribute, passwordAttribute, signInAction, signUpAction, errorMessage, isBusy, logoUrl } = props

  const handleSignIn = () => {
    if (signInAction?.canExecute && !signInAction.isExecuting) {
      signInAction.execute()
    }
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#3F51B5' } }}>
      <AxLoginMain
        className={props.class}
        logoUrl={logoUrl?.value?.uri}
        account={accountAttribute.value ?? ''}
        password={passwordAttribute.value ?? ''}
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
        onSignIn={handleSignIn}
        onSignUp={signUpAction ? () => signUpAction.canExecute && signUpAction.execute() : undefined}
      />
    </ConfigProvider>
  )
}
