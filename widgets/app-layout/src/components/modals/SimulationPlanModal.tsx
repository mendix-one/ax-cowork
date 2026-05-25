import type { ReactElement } from 'react'
import { Button, List, Modal, Radio, Typography } from 'antd'

type SimulationPlanItem = {
  id: string
  name: string
  description?: string
}

type SimulationPlanModalProps = {
  items: SimulationPlanItem[]
  activeId: string
  onSelect: (id: string) => void
  onClose: () => void
}

export function SimulationPlanModal(props: SimulationPlanModalProps): ReactElement {
  return (
    <Modal
      title="Simulation Plan"
      open
      onCancel={props.onClose}
      footer={[
        <Button key="close" type="primary" onClick={props.onClose}>
          Close
        </Button>,
      ]}
      destroyOnHidden
      width={480}
      centered
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        Choose a scenario plan for comparison and analysis.
      </Typography.Paragraph>
      <Radio.Group value={props.activeId} onChange={(e) => props.onSelect(e.target.value as string)} style={{ width: '100%' }}>
        <List
          size="small"
          dataSource={props.items}
          renderItem={(plan) => (
            <List.Item onClick={() => props.onSelect(plan.id)} style={{ cursor: 'pointer' }}>
              <Radio value={plan.id} style={{ marginRight: 12 }} />
              <List.Item.Meta title={plan.name} description={plan.description} />
            </List.Item>
          )}
        />
      </Radio.Group>
    </Modal>
  )
}
