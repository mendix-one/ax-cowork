import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useState } from 'react'
import { App as AntApp, Button, Card, Space, Switch, Typography } from 'antd'
import { AxLogin } from '@axlogin/AxLogin'
import { action, dynamic, editable, webImage } from '@/mock/mendix'
// A toy credentials check that mirrors what the BE-backed signin microflow does in the
// real Mendix app. Lets the sim demonstrate the success path AND the inline error path.
const VALID_ACCOUNT = 'admin'
const VALID_PASSWORD = 'password'
export function AxLoginSimPage() {
  const { notification } = AntApp.useApp()
  // Form state owned by the simulation; the widget mutates this via EditableValue.setValue.
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [showLogo, setShowLogo] = useState(true)
  const [enableSignUp, setEnableSignUp] = useState(true)
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
  const props = {
    name: 'axlogin',
    class: '',
    accountAttribute: editable([account, setAccount]),
    passwordAttribute: editable([password, setPassword]),
    signInAction: action(handleSignIn),
    signUpAction: enableSignUp ? action(handleSignUp) : undefined,
    errorMessage: errorMessage ? dynamic(errorMessage) : undefined,
    isBusy: dynamic(isBusy),
    logoUrl: showLogo ? webImage('/aplanner-light.png') : undefined,
    accountLabel: dynamic('Account'),
    accountPlaceholder: dynamic('Username, email or phone'),
    passwordLabel: dynamic('Password'),
    submitLabel: dynamic('Sign in'),
    signUpPrompt: dynamic("Don't have an account?"),
    signUpLinkLabel: dynamic('Sign up'),
  }
  return _jsxs(AntApp, {
    children: [
      _jsx(Typography.Title, { level: 3, children: 'AxLogin' }),
      _jsxs(Typography.Paragraph, {
        type: 'secondary',
        children: [
          'Mendix props are mocked. Try ',
          _jsx('code', { children: 'admin' }),
          ' / ',
          _jsx('code', { children: 'password' }),
          ' for the success path; anything else surfaces the inline error.',
        ],
      }),
      _jsxs('div', {
        style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' },
        children: [
          _jsx(Card, { title: 'Rendered widget', style: { display: 'flex', justifyContent: 'center' }, children: _jsx(AxLogin, { ...props }) }),
          _jsx(Card, {
            title: 'Sim controls',
            size: 'small',
            children: _jsxs(Space, {
              direction: 'vertical',
              size: 'middle',
              style: { width: '100%' },
              children: [
                _jsxs(Space, { children: [_jsx(Switch, { checked: showLogo, onChange: setShowLogo }), ' Show logo'] }),
                _jsxs(Space, { children: [_jsx(Switch, { checked: enableSignUp, onChange: setEnableSignUp }), ' Show sign-up link'] }),
                _jsx(Button, {
                  size: 'small',
                  onClick: () => {
                    setAccount('')
                    setPassword('')
                    setErrorMessage(null)
                    setIsBusy(false)
                  },
                  children: 'Reset',
                }),
                _jsx(Card, {
                  type: 'inner',
                  title: 'Current state',
                  size: 'small',
                  children: _jsx('pre', { style: { margin: 0, fontSize: 12 }, children: JSON.stringify({ account, password, errorMessage, isBusy }, null, 2) }),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  })
}
