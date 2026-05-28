import { Button, List, Modal, Radio, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMpsContext } from '../store/mps.context'

export const MpsPlanModal = observer(() => {
  const simulation = useMpsContext()
  const { t } = useTranslation('app')

  return (
    <Modal
      title={t('mpsPlan.title')}
      open={simulation.mpsPlanModalOpen}
      onCancel={() => simulation.closeMpsPlanModal()}
      footer={[
        <Button key="close" type="primary" onClick={() => simulation.closeMpsPlanModal()}>
          {t('mpsPlan.close')}
        </Button>,
      ]}
      destroyOnHidden
      width={480}
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        {t('mpsPlan.description')}
      </Typography.Paragraph>
      <Radio.Group
        value={simulation.activeMpsPlanId}
        onChange={(e) => simulation.setActiveMpsPlan(e.target.value as string)}
        style={{ width: '100%' }}
      >
        <List
          size="small"
          dataSource={simulation.mpsPlans}
          renderItem={(plan) => (
            <List.Item onClick={() => simulation.setActiveMpsPlan(plan.id)} style={{ cursor: 'pointer' }}>
              <Radio value={plan.id} style={{ marginRight: 12 }} />
              <List.Item.Meta title={plan.name} description={plan.description} />
            </List.Item>
          )}
        />
      </Radio.Group>
    </Modal>
  )
})
