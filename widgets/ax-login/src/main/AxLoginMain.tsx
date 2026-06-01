import type { ReactElement } from 'react'
import cn from 'classnames'
import { Alert, Avatar, Button, Form, Input, theme, Typography } from 'antd'
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'
import '../styles/AxLogin.scss'

const { Text } = Typography

export interface AxLoginLabels {
  account: string
  accountPlaceholder: string
  password: string
  submit: string
  signUpPrompt: string
  signUpLink: string
}

export interface AxLoginMainProps {
  className?: string
  logoUrl?: string
  account: string
  password: string
  busy?: boolean
  errorMessage?: string
  accountError?: string
  passwordError?: string
  canSignUp?: boolean
  labels: AxLoginLabels
  onAccountChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onAccountBlur?: () => void
  onPasswordBlur?: () => void
  onSignIn: () => void
  onSignUp?: () => void
}

// Presentational login card — a self-contained port of react-app's SignInPage + AuthLayout card.
// Holds no business logic: the container (AxLogin.tsx) maps Mendix Values-API props to these
// plain props, and the simulation drives them from local React state.
export function AxLoginMain(props: AxLoginMainProps): ReactElement {
  const { token } = theme.useToken()
  const { labels, busy, errorMessage, canSignUp, logoUrl } = props

  return (
    <div className={cn('ax-login', props.className)}>
      <div className="ax-login__card w-full max-w-sm rounded-md shadow-md p-8" style={{ background: token.colorBgContainer }}>
        <header className="flex flex-col items-center mb-6">
          {logoUrl ? (
            <img className="ax-login__logo" src={logoUrl} alt="logo" />
          ) : (
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
          )}
        </header>
        <Form
          layout="vertical"
          // Mirror SignInPage: stop the native submit so the host page never reloads, then
          // delegate to the Mendix sign-in action via onFinish.
          onSubmitCapture={(e) => e.preventDefault()}
          onFinish={() => props.onSignIn()}
          disabled={busy}
        >
          {errorMessage && <Alert type="error" message={errorMessage} showIcon className="mb-4" />}
          <Form.Item label={labels.account} required validateStatus={props.accountError ? 'error' : undefined} help={props.accountError}>
            <Input
              autoComplete="username"
              placeholder={labels.accountPlaceholder}
              prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
              value={props.account}
              onChange={(e) => props.onAccountChange(e.target.value)}
              onBlur={() => props.onAccountBlur?.()}
            />
          </Form.Item>
          <Form.Item label={labels.password} required validateStatus={props.passwordError ? 'error' : undefined} help={props.passwordError}>
            <Input.Password
              autoComplete="current-password"
              prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
              value={props.password}
              onChange={(e) => props.onPasswordChange(e.target.value)}
              onBlur={() => props.onPasswordBlur?.()}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={busy} icon={<LoginOutlined />}>
            {labels.submit}
          </Button>
          {canSignUp && (
            <Text type="secondary" className="block text-center mt-3">
              {labels.signUpPrompt}{' '}
              <a
                onClick={() => props.onSignUp?.()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') props.onSignUp?.()
                }}
                role="button"
                tabIndex={0}
              >
                {labels.signUpLink}
              </a>
            </Text>
          )}
        </Form>
      </div>
    </div>
  )
}
