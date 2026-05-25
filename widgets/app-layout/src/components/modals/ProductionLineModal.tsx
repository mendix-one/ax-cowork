import type { ReactElement } from 'react'
import { Button, List, Modal, Radio, Typography } from 'antd'

type ProductionLineItem = {
  id: string
  name: string
  description?: string
}

type ProductionLineModalProps = {
  items: ProductionLineItem[]
  activeId: string
  onSelect: (id: string) => void
  onClose: () => void
}

export function ProductionLineModal(props: ProductionLineModalProps): ReactElement {
  return (
    <Modal
      title="Production Line"
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
        Select a production line for this simulation workspace.
      </Typography.Paragraph>
      <Radio.Group value={props.activeId} onChange={(e) => props.onSelect(e.target.value as string)} style={{ width: '100%' }}>
        <List
          size="small"
          dataSource={props.items}
          renderItem={(line) => (
            <List.Item onClick={() => props.onSelect(line.id)} style={{ cursor: 'pointer' }}>
              <Radio value={line.id} style={{ marginRight: 12 }} />
              <List.Item.Meta title={line.name} description={line.description} />
            </List.Item>
          )}
        />
      </Radio.Group>
    </Modal>
  )
}
