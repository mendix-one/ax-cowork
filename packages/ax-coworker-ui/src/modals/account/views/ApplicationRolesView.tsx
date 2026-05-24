import { Empty, Flex } from 'antd'
import { useTranslation } from 'react-i18next'

// Placeholder — will list the roles the signed-in account holds within each app it can
// access (data already lives in session.roles for the current app; cross-app lookup will
// hit the SSO /profile endpoint when exposed to gateway clients).
export const ApplicationRolesView = () => {
  const { t } = useTranslation('app')
  return (
    <Flex align="center" justify="center" style={{ height: '100%', padding: 12 }}>
      <Empty description={t('account.todo')} />
    </Flex>
  )
}
