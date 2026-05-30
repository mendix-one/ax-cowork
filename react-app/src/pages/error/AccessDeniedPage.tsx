import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// 403 — signed-in caller doesn't have the role(s) required for the requested resource.
// Distinct from /signin redirect (which is for the unauthenticated case).
export const AccessDeniedPage = () => {
  const { t } = useTranslation()
  return (
    <Result
      status="403"
      title={t('error.accessDeniedTitle')}
      subTitle={t('error.accessDeniedSubtitle')}
      extra={
        <Link to="/">
          <Button type="primary">{t('nav.home')}</Button>
        </Link>
      }
    />
  )
}
