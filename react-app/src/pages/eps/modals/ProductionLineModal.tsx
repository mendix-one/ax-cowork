import { Button, List, Modal, Radio, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/acore/store/store.context'
import { useEpsContext } from '../stores/eps.context'

export const ProductionLineModal = observer(() => {
  const simulation = useEpsContext()
  const { productionLine } = useStore()

  // Switching the line inside EPS also updates the shared selection so HomePage and a later
  // reload stay scoped to the same line.
  const selectLine = (id: string) => {
    simulation.setActiveProductionLine(id)
    productionLine.setSelected(id)
  }

  return (
    <Modal
      title="Switch production line"
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
        The workspace is scoped to a <strong>production line</strong> (Business Team). Resource roadmaps, headcount portfolio and PROMIS sync are all filtered
        to the selected line.
      </Typography.Paragraph>
      <Radio.Group value={simulation.activeProductionLineId} onChange={(e) => selectLine(e.target.value as string)} style={{ width: '100%' }}>
        <List
          size="small"
          dataSource={simulation.productionLines}
          renderItem={(line) => (
            <List.Item onClick={() => selectLine(line.id)} style={{ cursor: 'pointer' }}>
              <Radio value={line.id} style={{ marginRight: 12 }} />
              <List.Item.Meta
                title={
                  <>
                    {line.name} <Tag style={{ marginInlineStart: 4 }}>{line.code}</Tag>
                  </>
                }
                description={line.description}
              />
            </List.Item>
          )}
        />
      </Radio.Group>
    </Modal>
  )
})
