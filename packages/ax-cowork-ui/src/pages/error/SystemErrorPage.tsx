import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// HTTP 5xx / unreachable BE. Linked-to from AxApp when `auth.isInterrupted` flips true —
// the session bootstrap couldn't complete and we don't want to spin on a broken router.
export const SystemErrorPage = () => {
  const { t } = useTranslation()
  return (
    <Result
      status="500"
      title={t('error.systemErrorTitle')}
      subTitle={t('error.systemErrorSubtitle')}
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
