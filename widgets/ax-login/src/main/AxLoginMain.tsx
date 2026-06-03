import type { ReactElement } from 'react'
import { Alert, Avatar, Button, Form, Input, theme, Typography } from 'antd'
import { LockOutlined, LoginOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons'

import cn from 'classnames'

const { Text } = Typography

export interface AxLoginLabels {
  account: string
  accountPlaceholder: string
  password: string
  submit: string
  signUpPrompt: string
  signUpLink: string
  sso: string
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
  canSso?: boolean
  labels: AxLoginLabels
  onAccountChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onAccountBlur?: () => void
  onPasswordBlur?: () => void
  onSignIn: () => void
  onSignUp?: () => void
  onSso?: () => void
}

// Presentational login card — a self-contained port of react-app's SignInPage + AuthLayout card.
// Holds no business logic: the container (AxLogin.tsx) maps Mendix Values-API props to these
// plain props, and the simulation drives them from local React state.
export function AxLoginMain(props: AxLoginMainProps): ReactElement {
  const { token } = theme.useToken()
  const { labels, busy, errorMessage, canSignUp, canSso, logoUrl } = props

  return (
    <div className={cn('ax-login', props.className)}>
      <div className="ax-login_card" style={{ background: token.colorBgContainer }}>
        <header className="ax-login_card_header">
          {logoUrl ? (
            <img className="ax-login_logo" src={logoUrl} alt="logo" />
          ) : (
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
          )}
        </header>
        <div className="ax-login_card_body">
          <Form
            layout="vertical"
            // Mirror SignInPage: stop the native submit so the host page never reloads, then
            // delegate to the Mendix sign-in action via onFinish.
            onSubmitCapture={(e) => e.preventDefault()}
            onFinish={() => props.onSignIn()}
            disabled={busy}
            className="ax-login_form"
          >
            <div className="ax-login_form_alert">{errorMessage && <Alert type="error" title={errorMessage} showIcon />}</div>
            <div className="ax-login_form_input">
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
            </div>
            <div className="ax-login_form_input">
              <Form.Item label={labels.password} required validateStatus={props.passwordError ? 'error' : undefined} help={props.passwordError}>
                <Input.Password
                  autoComplete="current-password"
                  prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                  value={props.password}
                  onChange={(e) => props.onPasswordChange(e.target.value)}
                  onBlur={() => props.onPasswordBlur?.()}
                />
              </Form.Item>
            </div>
            <div className="ax-login_form_action pt-2">
              <Button type="primary" htmlType="submit" block loading={busy} icon={<LoginOutlined />}>
                {labels.submit}
              </Button>
            </div>
            <div className="ax-login_form_action">
              {canSignUp && (
                <Text type="secondary">
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
            </div>
          </Form>
        </div>
      </div>
      {canSso && (
        <div className="ax-login_card" style={{ background: token.colorBgContainer }}>
          <div className="ax-login_card_body">
            <div className="ax-login_form_action">
              <Button block icon={<SafetyCertificateOutlined />} loading={busy} onClick={() => props.onSso?.()}>
                {labels.sso}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
