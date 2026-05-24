import { observer } from 'mobx-react-lite'
import { Avatar, Descriptions, Flex, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAccountStore } from '../store/account.context'

export const AccountProfileView = observer(() => {
  const { t } = useTranslation('app')
  const store = useAccountStore()
  const account = store.account

  const display = account?.display ?? t('account.guest')
  const initial = (account?.display ?? 'G').charAt(0).toUpperCase()
  const empty = '—'

  return (
    <Flex vertical gap={16} style={{ padding: 12 }}>
      <Flex justify="center">
        <Avatar size={96} src={account?.avatar}>
          {initial}
        </Avatar>
      </Flex>
      <Flex vertical align="center" gap={4}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {display}
        </Typography.Title>
        <Typography.Text type="secondary">@{account?.username ?? empty}</Typography.Text>
      </Flex>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label={t('account.username')}>{account?.username ?? empty}</Descriptions.Item>
        <Descriptions.Item label={t('account.display')}>{account?.display ?? empty}</Descriptions.Item>
        <Descriptions.Item label={t('account.email')}>{account?.email ?? empty}</Descriptions.Item>
        <Descriptions.Item label={t('account.phone')}>{account?.phone ?? empty}</Descriptions.Item>
      </Descriptions>
    </Flex>
  )
})
