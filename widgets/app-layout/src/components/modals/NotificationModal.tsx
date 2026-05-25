import type { ReactElement } from 'react'
import { Button, Empty, Modal } from 'antd'

type NotificationModalProps = {
  onClose: () => void
}

export function NotificationModal(props: NotificationModalProps): ReactElement {
  return (
    <Modal
      title="Notifications"
      open
      onCancel={props.onClose}
      footer={[
        <Button key="mark" disabled>
          Mark all read
        </Button>,
        <Button key="close" type="primary" onClick={props.onClose}>
          Close
        </Button>,
      ]}
      destroyOnHidden
      width={480}
      centered
    >
      <Empty description="No notifications" />
    </Modal>
  )
}
