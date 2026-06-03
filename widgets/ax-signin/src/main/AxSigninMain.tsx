import type { ReactElement } from 'react'
import { Alert, Avatar, Button, Form, Input, theme, Typography } from 'antd'
import { LockOutlined, LoginOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons'
import cn from 'classnames'
import { observer } from 'mobx-react-lite'
import { useAxSigninStore } from '../stores/context'

const { Text } = Typography

// Presentational signin card — a self-contained port of react-app's SignInPage + AuthLayout card.
// Holds no widget props: every value + handler comes from the store (kept in sync with Mendix by
// AxSigninSync), so this component never touches a widget value.
export const AxSigninMain = observer((): ReactElement => {
  const { token } = theme.useToken()
  const store = useAxSigninStore()
  const { labels, busy, errorMessage, successMessage, canSignUp, canSso, logoUrl } = store

  return (
    <div className={cn('ax-signin', store.className)} style={store.style} tabIndex={store.tabIndex}>
      <div className="ax-signin_card" style={{ background: token.colorBgContainer }}>
        <header className="ax-signin_card_header">
          {logoUrl ? (
            <img className="ax-signin_logo" src={logoUrl} alt="logo" />
          ) : (
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
          )}
        </header>
        <div className="ax-signin_card_body">
          <Form
            layout="vertical"
            // Mirror SignInPage: stop the native submit so the host page never reloads, then
            // delegate to the store's sign-in action via onFinish.
            onSubmitCapture={(e) => e.preventDefault()}
            onFinish={() => store.submit()}
            disabled={busy}
            className="ax-signin_form"
          >
            <div className="ax-signin_form_alert">
              {errorMessage && <Alert type="error" title={errorMessage} showIcon />}
              {successMessage && <Alert type="success" title={successMessage} showIcon />}
            </div>
            <div className="ax-signin_form_input">
              <Form.Item label={labels.account} required validateStatus={store.accountError ? 'error' : undefined} help={store.accountError}>
                <Input
                  autoComplete="username"
                  placeholder={labels.accountPlaceholder}
                  prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                  value={store.account}
                  onChange={(e) => store.setAccount(e.target.value)}
                  onBlur={store.touchAccount}
                />
              </Form.Item>
            </div>
            <div className="ax-signin_form_input">
              <Form.Item label={labels.password} required validateStatus={store.passwordError ? 'error' : undefined} help={store.passwordError}>
                <Input.Password
                  autoComplete="current-password"
                  prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                  value={store.password}
                  onChange={(e) => store.setPassword(e.target.value)}
                  onBlur={store.touchPassword}
                />
              </Form.Item>
            </div>
            <div className="ax-signin_form_action pt-2">
              <Button type="primary" htmlType="submit" block loading={busy} icon={<LoginOutlined />}>
                {labels.submit}
              </Button>
            </div>
            <div className="ax-signin_form_action">
              {canSignUp && (
                <Text type="secondary">
                  {labels.signUpPrompt}{' '}
                  <a
                    onClick={() => store.signUp()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') store.signUp()
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
        <div className="ax-signin_card" style={{ background: token.colorBgContainer }}>
          <div className="ax-signin_card_body">
            <div className="ax-signin_form_action">
              <Button block icon={<SafetyCertificateOutlined />} loading={busy} onClick={() => store.sso()}>
                {labels.sso}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
