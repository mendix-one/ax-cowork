import { Button, List, Modal, Radio, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { useMpsContext } from '../stores/mps.context'

export const ProductionLineModal = observer(() => {
  const simulation = useMpsContext()
  const { t } = useTranslation('app')

  return (
    <Modal
      title={t('productionLine.title')}
      open={simulation.productionLineModalOpen}
      onCancel={() => simulation.closeProductionLineModal()}
      footer={[
        <Button key="close" type="primary" onClick={() => simulation.closeProductionLineModal()}>
          {t('productionLine.close')}
        </Button>,
      ]}
      destroyOnHidden
      width={480}
    >
      <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
        {t('productionLine.description')}
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
