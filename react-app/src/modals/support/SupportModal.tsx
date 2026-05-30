import { Button, Descriptions, Modal, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/acore/store/store.context'

export const SupportModal = observer(() => {
  const { app } = useStore()
  const { t } = useTranslation('app')

  return (
    <Modal
      title={t('support.title')}
      open={app.supportModalOpen}
      onCancel={() => app.closeSupportModal()}
      footer={[
        <Button key="close" type="primary" onClick={() => app.closeSupportModal()}>
          {t('support.close')}
        </Button>,
      ]}
      destroyOnHidden
      width={520}
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        {t('support.intro')}
      </Typography.Paragraph>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label={t('support.email')}>
          <Typography.Link href={`mailto:${t('support.emailAddress')}`}>{t('support.emailAddress')}</Typography.Link>
        </Descriptions.Item>
        <Descriptions.Item label={t('support.chat')}>{t('support.chatHours')}</Descriptions.Item>
        <Descriptions.Item label={t('support.status')}>
          <Tag color="success">{t('support.statusBody')}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
})
