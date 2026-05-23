import { Modal, Form, Segmented, Select, Switch } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/acore/store/store.context'
import type { ThemeMode } from '@/acore/store/ui.store'

export const SettingModal = observer(() => {
  const { ui } = useStore()
  const { t, i18n } = useTranslation('app')

  return (
    <Modal
      title={t('setting.title', { defaultValue: 'Settings' })}
      open={ui.settingModalOpen}
      onCancel={() => ui.closeSettingModal()}
      onOk={() => ui.closeSettingModal()}
      okText={t('setting.done', { defaultValue: 'Done' })}
      cancelText={t('setting.cancel', { defaultValue: 'Cancel' })}
      destroyOnHidden
      width={520}
    >
      <Form layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item label={t('setting.theme', { defaultValue: 'Theme' })}>
          <Segmented
            value={ui.theme}
            onChange={(value) => ui.setTheme(value as ThemeMode)}
            options={[
              { label: t('setting.themeLight', { defaultValue: 'Light' }), value: 'light' },
              { label: t('setting.themeDark', { defaultValue: 'Dark' }), value: 'dark' },
            ]}
          />
        </Form.Item>
        <Form.Item label={t('setting.language', { defaultValue: 'Language' })}>
          <Select
            value={i18n.resolvedLanguage}
            style={{ width: 200 }}
            onChange={(value) => void i18n.changeLanguage(value)}
            options={[
              { label: 'English', value: 'en' },
              { label: '한국어', value: 'ko' },
            ]}
          />
        </Form.Item>
        <Form.Item label={t('setting.notifications', { defaultValue: 'Desktop notifications' })}>
          <Switch defaultChecked />
        </Form.Item>
      </Form>
    </Modal>
  )
})
