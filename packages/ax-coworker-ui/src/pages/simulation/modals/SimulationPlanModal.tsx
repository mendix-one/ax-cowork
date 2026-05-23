import { Button, List, Modal, Radio, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useSimulationContext } from '../store/simulation.context'

export const SimulationPlanModal = observer(() => {
  const simulation = useSimulationContext()
  const { t } = useTranslation('app')

  return (
    <Modal
      title={t('simulationPlan.title')}
      open={simulation.simulationPlanModalOpen}
      onCancel={() => simulation.closeSimulationPlanModal()}
      footer={[
        <Button key="close" type="primary" onClick={() => simulation.closeSimulationPlanModal()}>
          {t('simulationPlan.close')}
        </Button>,
      ]}
      destroyOnHidden
      width={480}
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        {t('simulationPlan.description')}
      </Typography.Paragraph>
      <Radio.Group
        value={simulation.activeSimulationPlanId}
        onChange={(e) => simulation.setActiveSimulationPlan(e.target.value as string)}
        style={{ width: '100%' }}
      >
        <List
          size="small"
          dataSource={simulation.simulationPlans}
          renderItem={(plan) => (
            <List.Item onClick={() => simulation.setActiveSimulationPlan(plan.id)} style={{ cursor: 'pointer' }}>
              <Radio value={plan.id} style={{ marginRight: 12 }} />
              <List.Item.Meta title={plan.name} description={plan.description} />
            </List.Item>
          )}
        />
      </Radio.Group>
    </Modal>
  )
})
