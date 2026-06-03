import { useState } from 'react'
import { App as AntApp, Button, Card, Space, Switch, Typography } from 'antd'
import { AxLogin } from '@axlogin/AxLogin'
import type { AxLoginContainerProps } from '../../../widgets/ax-login/typings/AxLoginProps'
import { action, dynamic, editable, webImage } from '@/mock/mendix'
import { AX_BROADCAST, emitEvent } from '@ax/common'

// A toy credentials check that mirrors what the BE-backed signin microflow does in the
// real Mendix app. Lets the sim demonstrate the success path AND the inline error path.
const VALID_ACCOUNT = 'admin'
const VALID_PASSWORD = 'password'

export function AxLoginSimPage() {
  const { notification } = AntApp.useApp()

  // Form state owned by the simulation; the widget mutates this via EditableValue.setValue.
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [showLogo, setShowLogo] = useState(true)
  const [enableSignUp, setEnableSignUp] = useState(true)
  const [enableSso, setEnableSso] = useState(true)

  const handleSignIn = () => {
    setErrorMessage(null)
    setIsBusy(true)
    // Mimic a 600 ms BE round-trip.
    window.setTimeout(() => {
      if (account === VALID_ACCOUNT && password === VALID_PASSWORD) {
        notification.success({ message: 'Signed in', description: `Welcome, ${account}.` })
        setErrorMessage(null)
      } else {
        setErrorMessage('Invalid credentials. Try admin / password.')
      }
      setIsBusy(false)
    }, 600)
  }

  const handleSignUp = () => {
    notification.info({ message: 'Sign-up clicked', description: 'Real app would navigate to /auth/signup.' })
  }

  const handleSso = () => {
    notification.info({ message: 'SSO clicked', description: 'Real app would redirect to the identity provider.' })
  }

  const props: AxLoginContainerProps = {
    name: 'axlogin',
    class: '',
    prpAtrAccount: editable([account, setAccount]),
    prpAtrPassword: editable([password, setPassword]),
    prpActSignIn: action(handleSignIn),
    prpActSignUp: enableSignUp ? action(handleSignUp) : undefined,
    prpActSso: enableSso ? action(handleSso) : undefined,
    prpTxtErrorMessage: errorMessage ? dynamic(errorMessage) : undefined,
    prpExpIsBusy: dynamic(isBusy),
    prpImgLogoUrl: showLogo ? webImage('/aplanner-light.png') : undefined,
    prpTxtAccountLabel: dynamic('Account'),
    prpTxtAccountPlaceholder: dynamic('Username, email or phone'),
    prpTxtPasswordLabel: dynamic('Password'),
    prpTxtSubmitLabel: dynamic('Sign in'),
    prpTxtSignUpPrompt: dynamic("Don't have an account?"),
    prpTxtSignUpLinkLabel: dynamic('Sign up'),
    prpTxtSsoLabel: dynamic('Sign in with SSO'),
  }

  return (
    <AntApp>
      <Typography.Title level={3}>AxLogin</Typography.Title>
      <Typography.Paragraph type="secondary">
        Mendix props are mocked. Try <code>admin</code> / <code>password</code> for the success path; anything else surfaces the inline error.
      </Typography.Paragraph>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <Card title="Rendered widget" style={{ display: 'flex', justifyContent: 'center' }}>
          <AxLogin {...props} />
        </Card>
        <Card title="Sim controls" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space>
              <Switch checked={showLogo} onChange={setShowLogo} /> Show logo
            </Space>
            <Space>
              <Switch checked={enableSignUp} onChange={setEnableSignUp} /> Show sign-up link
            </Space>
            <Space>
              <Switch checked={enableSso} onChange={setEnableSso} /> Show SSO button
            </Space>
            <Button
              size="small"
              onClick={() => {
                setAccount('')
                setPassword('')
                setErrorMessage(null)
                setIsBusy(false)
              }}
            >
              Reset
            </Button>
            <Card type="inner" title="Global events (bus)" size="small">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 4 }}>
                  Emits on <code>ax:broadcast</code>; the widget handles it via useWidgetEvents.
                </Typography.Paragraph>
                <Space>
                  <Button size="small" onClick={() => emitEvent(AX_BROADCAST, { action: 'reset' })}>
                    Emit reset
                  </Button>
                  <Button size="small" onClick={() => emitEvent(AX_BROADCAST, { action: 'submit' })}>
                    Emit submit
                  </Button>
                </Space>
              </Space>
            </Card>
            <Card type="inner" title="Current state" size="small">
              <pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify({ account, password, errorMessage, isBusy }, null, 2)}</pre>
            </Card>
          </Space>
        </Card>
      </div>
    </AntApp>
  )
}
