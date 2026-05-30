import { Button, List, Modal, Radio, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../stores/eps.context'

const STATUS_TAG = (id: string): { color: string; label: string } => {
  if (id.startsWith('v6')) return { color: 'green', label: 'APPROVED' }
  if (id.startsWith('v7')) return { color: 'purple', label: 'DRAFT' }
  if (id.startsWith('v5')) return { color: 'default', label: 'ARCHIVED' }
  if (id.startsWith('s')) return { color: 'cyan', label: 'SANDBOX' }
  return { color: 'default', label: 'PLAN' }
}

export const EpsPlanModal = observer(() => {
  const simulation = useEpsContext()

  return (
    <Modal
      title="Switch roadmap version"
      open={simulation.epsPlanModalOpen}
      onCancel={() => simulation.closeEpsPlanModal()}
      footer={[
        <Button key="close" type="primary" onClick={() => simulation.closeEpsPlanModal()}>
          Close
        </Button>,
      ]}
      destroyOnHidden
      width={560}
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        Switch between the approved baseline, an in-flight draft, or a what-if simulation variant. Approved roadmaps sync to PROMIS; sandbox variants stay
        isolated until promoted.
      </Typography.Paragraph>
      <Radio.Group value={simulation.activeEpsPlanId} onChange={(e) => simulation.setActiveEpsPlan(e.target.value as string)} style={{ width: '100%' }}>
        <List
          size="small"
          dataSource={simulation.epsPlans}
          renderItem={(plan) => {
            const tag = STATUS_TAG(plan.id)
            return (
              <List.Item onClick={() => simulation.setActiveEpsPlan(plan.id)} style={{ cursor: 'pointer' }}>
                <Radio value={plan.id} style={{ marginRight: 12 }} />
                <List.Item.Meta
                  title={
                    <span>
                      {plan.name}{' '}
                      <Tag color={tag.color} style={{ marginLeft: 8 }}>
                        {tag.label}
                      </Tag>
                    </span>
                  }
                  description={plan.description}
                />
              </List.Item>
            )
          }}
        />
      </Radio.Group>
    </Modal>
  )
})
