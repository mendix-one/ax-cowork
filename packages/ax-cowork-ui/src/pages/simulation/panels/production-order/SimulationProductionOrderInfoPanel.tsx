import { Button, Descriptions, Empty } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { MilestoneChips, PriorityChip, StatusChip } from './production-order-chips'

export const SimulationProductionOrderInfoPanel = observer(() => {
  const po = useSimulationContext().productionOrder
  const row = po.selectedRow
  const order = row ? po.orders.find((o) => o.id === row.poId) : null
  const family = row?.familyId && order ? order.schedule.find((f) => f.id === row.familyId) : null
  const batch = row?.batchId && family ? family.batches.find((b) => b.id === row.batchId) : null

  return (
    <div className="ax-po_info">
      <div className="ax-po_info_header">
        <span>{row ? `Info · ${row.kind === 'po' ? 'Production Order' : row.kind === 'family' ? 'Production Family' : 'Manufacturing Batch'}` : 'Info'}</span>
        <Button
          size="small"
          type="text"
          className="ax-antd-button-icon-small"
          icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
          onClick={() => po.closeInfoPanel()}
        />
      </div>
      <div className="ax-po_info_body">
        {!row || !order ? (
          <Empty description="Select a row to see its details" />
        ) : row.kind === 'po' ? (
          <div className="ax-po_info_card">
            <Descriptions size="small" column={2} bordered title={`${order.id} · ${order.customer}`}>
              <Descriptions.Item label="Customer">{order.customer}</Descriptions.Item>
              <Descriptions.Item label="Family">{order.family}</Descriptions.Item>
              <Descriptions.Item label="Spec">{order.spec}</Descriptions.Item>
              <Descriptions.Item label="Lot size">{order.lotSize} wafers</Descriptions.Item>
              <Descriptions.Item label="Commitment">{order.qty.toLocaleString()} wafers</Descriptions.Item>
              <Descriptions.Item label="Out">{order.outWafers.toLocaleString()} wafers</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <PriorityChip priority={order.priority} />
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <StatusChip status={order.poStatus} />
              </Descriptions.Item>
              <Descriptions.Item label="Start">{order.waferStart}</Descriptions.Item>
              <Descriptions.Item label="End">{order.end}</Descriptions.Item>
              <Descriptions.Item label="Milestones" span={2}>
                <MilestoneChips milestones={order.milestones} poId={order.id} />
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : row.kind === 'family' && family ? (
          <div className="ax-po_info_card">
            <Descriptions size="small" column={2} bordered title={`${family.label} · ${family.tech}`}>
              <Descriptions.Item label="Order">{order.id}</Descriptions.Item>
              <Descriptions.Item label="Tech">{family.tech}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <PriorityChip priority={family.priority} />
              </Descriptions.Item>
              <Descriptions.Item label="Duration">{family.durationDays} days</Descriptions.Item>
              <Descriptions.Item label="Start">{family.start}</Descriptions.Item>
              <Descriptions.Item label="End">{family.end}</Descriptions.Item>
              <Descriptions.Item label="Batches">{family.batches.length}</Descriptions.Item>
              <Descriptions.Item label="Commitment">{family.batches.reduce((s, b) => s + b.waferCount, 0).toLocaleString()} wafers</Descriptions.Item>
              <Descriptions.Item label="Milestones" span={2}>
                <MilestoneChips milestones={order.milestones.filter((m) => m.familyId === family.id)} poId={order.id} />
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : row.kind === 'batch' && family && batch ? (
          <div className="ax-po_info_card">
            <Descriptions size="small" column={2} bordered title={`${batch.name} · ${family.label}`}>
              <Descriptions.Item label="Order">{order.id}</Descriptions.Item>
              <Descriptions.Item label="Family">{family.label}</Descriptions.Item>
              <Descriptions.Item label="Wafers">{batch.waferCount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Duration">{batch.durationDays} days</Descriptions.Item>
              <Descriptions.Item label="Start">{batch.start}</Descriptions.Item>
              <Descriptions.Item label="End">{batch.end}</Descriptions.Item>
              {batch.toolGroup && <Descriptions.Item label="Tool group">{batch.toolGroup}</Descriptions.Item>}
              {batch.note && (
                <Descriptions.Item label="Note" span={2}>
                  {batch.note}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        ) : null}
      </div>
    </div>
  )
})
