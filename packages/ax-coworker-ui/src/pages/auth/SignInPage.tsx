import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { App, Button, Form, Input, Typography } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ApiError } from '@/acore/api'
import { useStore } from '@/acore/store/store.context'

const { Text } = Typography

type FormValues = {
  email: string
  password: string
}

type LocationState = {
  from?: string
} | null

export const SignInPage = observer(() => {
  const { auth } = useStore()
  const { t } = useTranslation('auth')
  const { notification } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<FormValues>()

  // Inline error specific to this form, cleared on every submit. We keep it local (vs.
  // reading auth.error) so that a 401 surfaces inline while other failures route to the
  // system notification path and never bleed into the form.
  const [credentialError, setCredentialError] = useState<string | null>(null)

  const from = (location.state as LocationState)?.from ?? '/'

  const onFinish = async (values: FormValues) => {
    setCredentialError(null)
    try {
      await auth.signin({ username: values.email, password: values.password })
      void navigate(from, { replace: true })
    } catch (err) {
      // 401 from SSO means bad credentials — show inline so the user can correct the form.
      // Anything else (network, 5xx, gateway/SSO outage) is a system issue — toast it so the
      // user knows it isn't their typing.
      if (err instanceof ApiError && err.status === 401) {
        setCredentialError(t('errors.invalidCredentials'))
      } else {
        notification.error({
          message: t('errors.systemTitle'),
          description: err instanceof Error ? err.message : t('errors.systemMessage'),
        })
      }
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={(v) => void onFinish(v)} disabled={auth.loading}>
      <Form.Item name="email" label={t('signIn.email')} rules={[{ required: true }]}>
        <Input autoComplete="email" />
      </Form.Item>
      <Form.Item name="password" label={t('signIn.password')} rules={[{ required: true }]}>
        <Input.Password autoComplete="current-password" />
      </Form.Item>
      {credentialError && (
        <Text type="danger" style={{ display: 'block', marginBottom: 8 }}>
          {credentialError}
        </Text>
      )}
      <Button type="primary" htmlType="submit" block loading={auth.loading}>
        {t('signIn.submit')}
      </Button>
      <Text type="secondary" style={{ display: 'block', marginTop: 12, textAlign: 'center' }}>
        {t('signIn.noAccount')} <Link to="/auth/signup">{t('signIn.signUpLink')}</Link>
      </Text>
    </Form>
  )
})
