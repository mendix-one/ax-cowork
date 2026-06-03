import type { ReactElement } from 'react'
import { ConfigProvider } from 'antd'
import { AxLoginMain } from '../main/AxLoginMain'

// Studio Pro design-mode preview. Renders the real card with representative static labels so
// the widget looks right on the page canvas; all handlers are no-ops (design time is inert).
export function AxLoginPreview(): ReactElement {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#3F51B5' } }}>
      <AxLoginMain
        account=""
        password=""
        canSignUp
        canSso
        labels={{
          account: 'Account',
          accountPlaceholder: 'Username, email or phone',
          password: 'Password',
          submit: 'Sign in',
          signUpPrompt: "Don't have an account?",
          signUpLink: 'Sign up',
          sso: 'Sign in with SSO',
        }}
        onAccountChange={() => undefined}
        onPasswordChange={() => undefined}
        onSignIn={() => undefined}
        onSignUp={() => undefined}
        onSso={() => undefined}
      />
    </ConfigProvider>
  )
}
