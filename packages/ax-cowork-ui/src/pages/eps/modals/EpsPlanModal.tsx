import { Button, List, Modal, Radio, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../stores/eps.context'

export const EpsPlanModal = observer(() => {
  const simulation = useEpsContext()

  return (
    <Modal
      title="Select R&D plan"
      open={simulation.epsPlanModalOpen}
      onCancel={() => simulation.closeEpsPlanModal()}
      footer={[
        <Button key="close" type="primary" onClick={() => simulation.closeEpsPlanModal()}>
          Close
        </Button>,
      ]}
      destroyOnHidden
      width={480}
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        Pick the engineering planning scenario to view. Switch between baseline, AI-optimized and aggressive variants to compare timeline and
        headcount load.
      </Typography.Paragraph>
      <Radio.Group
        value={simulation.activeEpsPlanId}
        onChange={(e) => simulation.setActiveEpsPlan(e.target.value as string)}
        style={{ width: '100%' }}
      >
        <List
          size="small"
          dataSource={simulation.epsPlans}
          renderItem={(plan) => (
            <List.Item onClick={() => simulation.setActiveEpsPlan(plan.id)} style={{ cursor: 'pointer' }}>
              <Radio value={plan.id} style={{ marginRight: 12 }} />
              <List.Item.Meta title={plan.name} description={plan.description} />
            </List.Item>
          )}
        />
      </Radio.Group>
    </Modal>
  )
})
