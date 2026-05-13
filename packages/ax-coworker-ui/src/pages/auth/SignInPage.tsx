import { observer } from 'mobx-react-lite'
import { Button, Form, Input, Typography } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<FormValues>()

  const from = (location.state as LocationState)?.from ?? '/'

  const onFinish = (values: FormValues) => {
    // TODO: thay bằng AuthStore.login() khi BE có endpoint /auth/signin
    auth.setUser({ id: '1', name: values.email.split('@')[0], email: values.email })
    void navigate(from, { replace: true })
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} disabled={auth.loading}>
      <Form.Item name="email" label={t('signIn.email')} rules={[{ required: true, type: 'email' }]}>
        <Input autoComplete="email" />
      </Form.Item>
      <Form.Item name="password" label={t('signIn.password')} rules={[{ required: true }]}>
        <Input.Password autoComplete="current-password" />
      </Form.Item>
      {auth.error && (
        <Text type="danger" style={{ display: 'block', marginBottom: 8 }}>
          {auth.error}
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
