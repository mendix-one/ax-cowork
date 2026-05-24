import { Button, Empty, Modal } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/acore/store/store.context'

export const NotifyModal = observer(() => {
  const { app } = useStore()
  const { t } = useTranslation('app')

  return (
    <Modal
      title={t('notify.title')}
      open={app.notifyModalOpen}
      onCancel={() => app.closeNotifyModal()}
      footer={[
        <Button key="mark" disabled>
          {t('notify.markAllRead')}
        </Button>,
        <Button key="close" type="primary" onClick={() => app.closeNotifyModal()}>
          {t('notify.close')}
        </Button>,
      ]}
      destroyOnHidden
      width={480}
    >
      <Empty description={t('notify.empty')} />
    </Modal>
  )
})
