import type { ReactElement } from 'react'
import { Avatar, Button, Descriptions, Flex, Modal, Typography } from 'antd'

type AccountModalProps = {
  onClose: () => void
}

export function AccountModal(props: AccountModalProps): ReactElement {
  const user = {
    name: 'Guest User',
    email: 'guest@example.com',
  }
  const initial = user.name.charAt(0).toUpperCase()

  return (
    <Modal
      title="Account"
      open
      onCancel={props.onClose}
      footer={[
        <Button key="signout" danger>
          Sign out
        </Button>,
        <Button key="close" type="primary" onClick={props.onClose}>
          Close
        </Button>,
      ]}
      destroyOnHidden
      width={480}
      centered
    >
      <Flex align="center" gap={16} style={{ marginTop: 8, marginBottom: 16 }}>
        <Avatar size={56}>{initial}</Avatar>
        <Flex vertical>
          <Typography.Text type="secondary">Signed in as</Typography.Text>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {user.name}
          </Typography.Title>
        </Flex>
      </Flex>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
