import { Avatar, Button, Descriptions, Flex, Modal, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/acore/store/store.context'

export const AccountModal = observer(() => {
  const { ui, auth } = useStore()
  const { t } = useTranslation('app')

  const account = auth.currentAccount
  const display = account?.display ?? t('account.guest')
  const email = account?.email ?? '—'
  const initial = (account?.display ?? 'G').charAt(0).toUpperCase()

  const handleSignOut = async () => {
    await auth.signout()
    ui.closeAccountModal()
  }

  return (
    <Modal
      title={t('account.title')}
      open={ui.accountModalOpen}
      onCancel={() => ui.closeAccountModal()}
      footer={[
        <Button key="signout" danger disabled={!account || auth.loading} loading={auth.loading} onClick={() => void handleSignOut()}>
          {t('account.signOut')}
        </Button>,
        <Button key="close" type="primary" onClick={() => ui.closeAccountModal()}>
          {t('account.close')}
        </Button>,
      ]}
      destroyOnHidden
      width={480}
    >
      <Flex align="center" gap={16} style={{ marginTop: 8, marginBottom: 16 }}>
        <Avatar size={56} src={account?.avatar}>
          {initial}
        </Avatar>
        <Flex vertical>
          <Typography.Text type="secondary">{t('account.signedInAs')}</Typography.Text>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {display}
          </Typography.Title>
        </Flex>
      </Flex>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label={t('account.name')}>{display}</Descriptions.Item>
        <Descriptions.Item label={t('account.email')}>{email}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
})
