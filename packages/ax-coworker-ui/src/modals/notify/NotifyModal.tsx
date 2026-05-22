import { Button, Empty, Modal } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/acore/store/store.context'

export const NotifyModal = observer(() => {
  const { ui } = useStore()
  const { t } = useTranslation('app')

  return (
    <Modal
      title={t('notify.title')}
      open={ui.notifyModalOpen}
      onCancel={() => ui.closeNotifyModal()}
      footer={[
        <Button key="mark" disabled>
          {t('notify.markAllRead')}
        </Button>,
        <Button key="close" type="primary" onClick={() => ui.closeNotifyModal()}>
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
