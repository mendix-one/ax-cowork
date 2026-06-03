import { useState } from 'react'
import { App as AntApp } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AxSignin } from '@axsignin/AxSignin'
import type { AxSigninContainerProps } from '../../../../widgets/ax-signin/typings/AxSigninProps'
import { action, dynamic, editable } from '@/mock/mendix'
import './AxSigninPage.css'

// A "real page" host for the AxSignin widget at route /signin: full-viewport split
// layout (brand panel + centred widget), rendered outside the sim's dashboard chrome.
// The widget supplies the signin card; this page supplies everything around it and
// owns the form state, mutated by the widget through the mocked Mendix Values API —
// exactly as Studio Pro would drive it.

// Toy credentials, matching AxSigninSimPage so both demos behave the same.
const VALID_ACCOUNT = 'admin'
const VALID_PASSWORD = 'password'

export function AxSigninPage() {
  return (
    <AntApp className="ax-app">
      <div className="ax-signin-page">
        <SigninPanel />
      </div>
    </AntApp>
  )
}

// The widget + the form state it drives. Split out so it can read the AntApp
// notification context (the provider lives in AxSigninPage above).
function SigninPanel() {
  const { notification } = AntApp.useApp()
  const navigate = useNavigate()

  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)

  const handleSignIn = () => {
    setErrorMessage(null)
    setIsBusy(true)
    // Mimic a ~600 ms BE round-trip, then succeed (→ navigate home) or fail inline.
    window.setTimeout(() => {
      setIsBusy(false)
      if (account === VALID_ACCOUNT && password === VALID_PASSWORD) {
        notification.success({ message: 'Signed in', description: `Welcome back, ${account}.` })
        void navigate('/')
      } else {
        setErrorMessage('Invalid credentials. Try admin / password.')
      }
    }, 600)
  }

  const handleSignUp = () => {
    notification.info({ message: 'Create account', description: 'A real app would route to /auth/signup.' })
  }

  const handleSso = () => {
    notification.info({ message: 'SSO sign-in', description: 'A real app would redirect to the identity provider.' })
  }

  // Map the page's React state onto the widget's Mendix Values-API prop shape.
  // No logoUrl here: the light product logo lives on the brand panel, so the card
  // falls back to the widget's branded avatar.
  const props: AxSigninContainerProps = {
    name: 'axsignin',
    class: '',
    prpAtrAccount: editable([account, setAccount]),
    prpAtrPassword: editable([password, setPassword]),
    prpActSignIn: action(handleSignIn),
    prpActSignUp: action(handleSignUp),
    prpActSso: action(handleSso),
    prpTxtErrorMessage: errorMessage ? dynamic(errorMessage) : undefined,
    prpExpIsBusy: dynamic(isBusy),
    prpImgLogoUrl: undefined,
    prpTxtAccountLabel: dynamic('Account'),
    prpTxtAccountPlaceholder: dynamic('Username, email or phone'),
    prpTxtPasswordLabel: dynamic('Password'),
    prpTxtSubmitLabel: dynamic('Sign in'),
    prpTxtSignUpPrompt: dynamic("Don't have an account?"),
    prpTxtSignUpLinkLabel: dynamic('Sign up'),
    prpTxtSsoLabel: dynamic('Sign in with SSO'),
  }

  return <AxSignin {...props} />
}
