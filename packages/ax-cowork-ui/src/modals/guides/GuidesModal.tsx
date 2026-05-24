import { Button, Collapse, Modal, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/acore/store/store.context'

export const GuidesModal = observer(() => {
  const { app } = useStore()
  const { t } = useTranslation('app')

  return (
    <Modal
      title={t('guides.title')}
      open={app.guidesModalOpen}
      onCancel={() => app.closeGuidesModal()}
      footer={[
        <Button key="close" type="primary" onClick={() => app.closeGuidesModal()}>
          {t('guides.close')}
        </Button>,
      ]}
      destroyOnHidden
      width={560}
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        {t('guides.intro')}
      </Typography.Paragraph>
      <Collapse
        defaultActiveKey={['getting-started']}
        items={[
          {
            key: 'getting-started',
            label: t('guides.gettingStarted'),
            children: <Typography.Paragraph style={{ margin: 0 }}>{t('guides.gettingStartedBody')}</Typography.Paragraph>,
          },
          {
            key: 'shortcuts',
            label: t('guides.shortcuts'),
            children: <Typography.Paragraph style={{ margin: 0 }}>{t('guides.shortcutsBody')}</Typography.Paragraph>,
          },
          {
            key: 'docs',
            label: t('guides.docs'),
            children: <Typography.Paragraph style={{ margin: 0 }}>{t('guides.docsBody')}</Typography.Paragraph>,
          },
        ]}
      />
    </Modal>
  )
})
