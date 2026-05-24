import { Empty, Flex } from 'antd'
import { useTranslation } from 'react-i18next'

// Placeholder — wire the active-sessions list when the SSO /profile endpoint is exposed.
export const ActiveSessionView = () => {
  const { t } = useTranslation('app')
  return (
    <Flex align="center" justify="center" style={{ height: '100%', padding: 12 }}>
      <Empty description={t('account.todo')} />
    </Flex>
  )
}
