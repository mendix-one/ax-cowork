import { useState, type ReactElement } from 'react'
import { Form, Modal, Segmented, Select, Switch } from 'antd'

type SettingsModalProps = {
  onClose: () => void
}

export function SettingsModal(props: SettingsModalProps): ReactElement {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [language, setLanguage] = useState<'en' | 'ko'>('en')
  const [desktopNotifications, setDesktopNotifications] = useState(true)

  return (
    <Modal
      title="Settings"
      open
      onCancel={props.onClose}
      onOk={props.onClose}
      okText="Done"
      cancelText="Cancel"
      destroyOnHidden
      width={520}
      centered
    >
      <Form layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item label="Theme">
          <Segmented
            value={theme}
            onChange={(value: string | number) => setTheme(value as 'light' | 'dark')}
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Language">
          <Select
            value={language}
            style={{ width: 200 }}
            onChange={(value: string) => setLanguage(value as 'en' | 'ko')}
            options={[
              { label: 'English', value: 'en' },
              { label: 'Korean', value: 'ko' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Desktop notifications">
          <Switch checked={desktopNotifications} onChange={(checked: boolean) => setDesktopNotifications(checked)} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
