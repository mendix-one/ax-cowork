import { Empty, Flex } from 'antd'
import { useTranslation } from 'react-i18next'

// Placeholder — wire fields when account settings are designed.
export const AccountSettingView = () => {
  const { t } = useTranslation('app')
  return (
    <Flex align="center" justify="center" style={{ height: '100%', padding: 12 }}>
      <Empty description={t('account.todo')} />
    </Flex>
  )
}
