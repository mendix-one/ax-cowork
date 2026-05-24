import { observer } from 'mobx-react-lite'
import { Result, Button } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const NotFoundPage = observer(function NotFoundView() {
  const { t } = useTranslation()
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('error.notFound')}
      extra={
        <Link to="/">
          <Button type="primary">{t('nav.home')}</Button>
        </Link>
      }
    />
  )
})
