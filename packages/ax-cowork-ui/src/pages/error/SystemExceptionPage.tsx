import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Catch-all for unhandled runtime exceptions surfaced by the router's errorElement or thrown
// from a loader / action that the SPA can't recover from in-place.
export const SystemExceptionPage = () => {
  const { t } = useTranslation()
  return (
    <Result
      status="warning"
      title={t('error.systemExceptionTitle')}
      subTitle={t('error.systemExceptionSubtitle')}
      extra={
        <>
          <Link to="/">
            <Button>{t('nav.home')}</Button>
          </Link>
        </>
      }
    />
  )
}
