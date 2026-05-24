import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Alert, Button, Form, Input, Typography } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BusinessError } from '@/acore/axios'
import { useStore } from '@/acore/store/store.context'

const { Text } = Typography

// Business codes surfaced by the BE/SSO signin endpoint (mirrors `SIGNIN_ERR_*` constants
// in ax-sso-services). Kept inline here — signin only has two cases and they're stable.
const SIGNIN_CODE_INVALID_CREDENTIALS = 1
const SIGNIN_CODE_ACCOUNT_NOT_ACTIVE = 2

type FormValues = {
  // The field is labeled "Account" and accepts username / email / phone — the BE will
  // resolve which one it is. Kept as `account` here for self-documentation.
  account: string
  password: string
}

type LocationState = {
  from?: string
} | null

export const SignInPage = observer(() => {
  const { auth } = useStore()
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<FormValues>()

  // Inline error specific to this form, cleared on every submit. Business errors (code 1 / 2)
  // land here; system errors (network, 5xx) are already toasted by the axios interceptor so
  // we don't double-surface them.
  const [credentialError, setCredentialError] = useState<string | null>(null)

  const from = (location.state as LocationState)?.from ?? '/'

  const onSubmit = async (values: FormValues) => {
    setCredentialError(null)
    try {
      // BE signin currently expects `username` — pass the account value through as-is.
      // When the BE is extended to accept email / phone the call site stays the same.
      await auth.signin({ username: values.account, password: values.password })
      void navigate(from, { replace: true })
    } catch (err) {
      if (err instanceof BusinessError) {
        if (err.code === SIGNIN_CODE_INVALID_CREDENTIALS) {
          setCredentialError(t('errors.invalidCredentials'))
        } else if (err.code === SIGNIN_CODE_ACCOUNT_NOT_ACTIVE) {
          setCredentialError(t('errors.accountNotActive'))
        } else {
          // Unknown business code — surface the raw message inline rather than swallowing it.
          setCredentialError(err.message)
        }
      }
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      // Belt-and-suspenders: AntD's Form already prevents default on submit when `onFinish`
      // resolves, but the capture-phase handler short-circuits the native submit event before
      // any other listener can react — guarantees the page never reloads even if `onFinish`
      // fails validation or some async path throws synchronously.
      onSubmitCapture={(e) => e.preventDefault()}
      onFinish={(v) => void onSubmit(v)}
      disabled={auth.isLoading}
    >
      {credentialError && <Alert type="error" message={credentialError} showIcon style={{ marginBottom: 16 }} />}
      <Form.Item name="account" label={t('signIn.account')} rules={[{ required: true }]}>
        <Input autoComplete="username" placeholder={t('signIn.accountPlaceholder')} />
      </Form.Item>
      <Form.Item name="password" label={t('signIn.password')} rules={[{ required: true }]}>
        <Input.Password autoComplete="current-password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block loading={auth.isLoading}>
        {t('signIn.submit')}
      </Button>
      <Text type="secondary" style={{ display: 'block', marginTop: 12, textAlign: 'center' }}>
        {t('signIn.noAccount')} <Link to="/auth/signup">{t('signIn.signUpLink')}</Link>
      </Text>
    </Form>
  )
})
