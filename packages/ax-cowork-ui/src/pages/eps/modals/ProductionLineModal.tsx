import { Button, List, Modal, Radio, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEpsContext } from '../stores/eps.context'

export const ProductionLineModal = observer(() => {
  const simulation = useEpsContext()

  return (
    <Modal
      title="Switch IRIS workspace"
      open={simulation.productionLineModalOpen}
      onCancel={() => simulation.closeProductionLineModal()}
      footer={[
        <Button key="close" type="primary" onClick={() => simulation.closeProductionLineModal()}>
          Close
        </Button>,
      ]}
      destroyOnHidden
      width={520}
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        A workspace is scoped to a <strong>Site · Business Unit · Fiscal Year</strong>. Resource roadmaps, headcount portfolio and PROMIS sync are
        all filtered to the selected workspace.
      </Typography.Paragraph>
      <Radio.Group
        value={simulation.activeProductionLineId}
        onChange={(e) => simulation.setActiveProductionLine(e.target.value as string)}
        style={{ width: '100%' }}
      >
        <List
          size="small"
          dataSource={simulation.productionLines}
          renderItem={(line) => (
            <List.Item onClick={() => simulation.setActiveProductionLine(line.id)} style={{ cursor: 'pointer' }}>
              <Radio value={line.id} style={{ marginRight: 12 }} />
              <List.Item.Meta title={line.name} description={line.description} />
            </List.Item>
          )}
        />
      </Radio.Group>
    </Modal>
  )
})
