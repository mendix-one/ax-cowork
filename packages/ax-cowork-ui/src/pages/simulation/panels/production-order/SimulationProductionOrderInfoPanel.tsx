import { useEffect, useState } from 'react'
import { Button, Descriptions, Divider, Empty, Input, InputNumber, Popconfirm, Space, Tag, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useSimulationContext } from '../../store/simulation.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { MilestoneChips, PriorityChip, StatusChip } from './production-order-chips'

// Free-text planner note editor — drives the shared NotesStore, keyed by the same row key used by the PO table.
// Auto-trims on save; empty save clears the note.
const PlannerNoteEditor = observer(({ noteKey, label }: { noteKey: string; label: string }) => {
  const { notes } = useSimulationContext()
  const saved = notes.get(noteKey)
  const [draft, setDraft] = useState(saved)
  useEffect(() => setDraft(saved), [saved])
  const dirty = draft !== saved
  return (
    <div className="ax-po_note_editor">
      <div className="ax-po_note_editor_header">
        <AxMuiIcon icon="mdiNoteEditOutline" size={14} />
        <span>Planner note · {label}</span>
        {notes.has(noteKey) && (
          <Tag color="gold" style={{ marginLeft: 'auto' }}>
            Saved
          </Tag>
        )}
      </div>
      <Input.TextArea
        autoSize={{ minRows: 2, maxRows: 6 }}
        value={draft}
        placeholder="Leave a note for the next shift — context, customer calls, manual overrides…"
        onChange={(e) => setDraft(e.target.value)}
      />
      <Space size={6} style={{ marginTop: 6 }}>
        <Button size="small" type="primary" disabled={!dirty} icon={<AxMuiIcon icon="mdiContentSaveOutline" size={14} />} onClick={() => notes.set(noteKey, draft)}>
          Save note
        </Button>
        {notes.has(noteKey) && (
          <Button size="small" danger icon={<AxMuiIcon icon="mdiTrashCanOutline" size={14} />} onClick={() => notes.clear(noteKey)}>
            Clear
          </Button>
        )}
      </Space>
    </div>
  )
})

// Inline-edit affordance for batch target wafer out. Uncontrolled-ish: the InputNumber tracks a local draft;
// pressing Commit (or blur) writes back through the store.
const BatchTargetEdit = observer(({ poId, familyId, batchId, value }: { poId: string; familyId: string; batchId: string; value: number }) => {
  const po = useSimulationContext().productionOrder
  const [draft, setDraft] = useState<number>(value)
  // Re-sync draft when the upstream value changes (e.g. another action edited the batch).
  useEffect(() => setDraft(value), [value])
  const dirty = draft !== value
  return (
    <Space size={6}>
      <InputNumber size="small" min={0} step={25} value={draft} onChange={(v) => setDraft(typeof v === 'number' ? v : 0)} style={{ width: 120 }} />
      <Button
        size="small"
        type="primary"
        disabled={!dirty}
        icon={<AxMuiIcon icon="mdiContentSaveOutline" size={14} />}
        onClick={() => po.setBatchWaferCount(poId, familyId, batchId, draft)}
      >
        Commit
      </Button>
    </Space>
  )
})

export const SimulationProductionOrderInfoPanel = observer(() => {
  const po = useSimulationContext().productionOrder
  const row = po.selectedRow
  const order = row ? po.orders.find((o) => o.id === row.poId) : null
  const family = row?.familyId && order ? order.schedule.find((f) => f.id === row.familyId) : null
  const batch = row?.batchId && family ? family.batches.find((b) => b.id === row.batchId) : null

  const isBatchRunning = batch?.scheduleClass === 'fixed'

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
              <Descriptions.Item label="Remaining">{Math.max(0, order.qty - order.outWafers).toLocaleString()} wafers</Descriptions.Item>
              <Descriptions.Item label="Progress">
                {order.qty > 0 ? Math.round((order.outWafers / order.qty) * 100) : 0}%
              </Descriptions.Item>
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
            <Divider style={{ margin: '12px 0' }} />
            <Space>
              <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiPlusBoxOutline" size={14} />} onClick={() => po.addFamily(order.id)}>
                Add product family
              </Button>
              <Typography.Text type="secondary" className="text-sm">
                Adds a new family with one default 100-wafer batch.
              </Typography.Text>
            </Space>
            <Divider style={{ margin: '12px 0' }} />
            <PlannerNoteEditor noteKey={`po::${order.id}`} label={order.id} />
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
              <Descriptions.Item label="Target out">{family.batches.reduce((s, b) => s + b.waferCount, 0).toLocaleString()} wafers</Descriptions.Item>
              <Descriptions.Item label="Milestones" span={2}>
                <MilestoneChips milestones={order.milestones.filter((m) => m.familyId === family.id)} poId={order.id} />
              </Descriptions.Item>
            </Descriptions>
            <Divider style={{ margin: '12px 0' }} />
            <Space>
              <Button size="small" type="primary" icon={<AxMuiIcon icon="mdiPlusCircleOutline" size={14} />} onClick={() => po.addBatch(order.id, family.id)}>
                Add manufacturing batch
              </Button>
              <Typography.Text type="secondary" className="text-sm">
                Appends a 100-wafer batch with a 5-day window after the last batch.
              </Typography.Text>
            </Space>
            <Divider style={{ margin: '12px 0' }} />
            <PlannerNoteEditor noteKey={`family::${family.id}`} label={family.label} />
          </div>
        ) : row.kind === 'batch' && family && batch ? (
          <div className="ax-po_info_card">
            <Descriptions size="small" column={2} bordered title={`${batch.name} · ${family.label}`}>
              <Descriptions.Item label="Order">{order.id}</Descriptions.Item>
              <Descriptions.Item label="Family">{family.label}</Descriptions.Item>
              <Descriptions.Item label="Schedule class">
                <Tag color={batch.scheduleClass === 'fixed' ? 'blue' : batch.scheduleClass === 'changes' ? 'cyan' : 'green'}>
                  {batch.scheduleClass}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Duration">{batch.durationDays} days</Descriptions.Item>
              <Descriptions.Item label="Start">{batch.start}</Descriptions.Item>
              <Descriptions.Item label="End">{batch.end}</Descriptions.Item>
              {batch.toolGroup && <Descriptions.Item label="Tool group">{batch.toolGroup}</Descriptions.Item>}
              {batch.note && (
                <Descriptions.Item label="Note" span={2}>
                  {batch.note}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Target wafers out" span={2}>
                {isBatchRunning ? (
                  <Space>
                    <Typography.Text strong>{batch.waferCount.toLocaleString()} wafers</Typography.Text>
                    <Tag color="blue">Running · locked</Tag>
                  </Space>
                ) : (
                  <BatchTargetEdit poId={order.id} familyId={family.id} batchId={batch.id} value={batch.waferCount} />
                )}
              </Descriptions.Item>
            </Descriptions>
            <Divider style={{ margin: '12px 0' }} />
            <Space wrap>
              <Button
                size="small"
                icon={<AxMuiIcon icon="mdiCallSplit" size={14} />}
                disabled={isBatchRunning || batch.waferCount < 2}
                onClick={() => po.splitBatch(order.id, family.id, batch.id)}
              >
                Split batch
              </Button>
              <Popconfirm
                title={`Remove batch ${batch.name}?`}
                description="This only removes it from the current simulation."
                okText="Remove"
                okButtonProps={{ danger: true }}
                disabled={isBatchRunning}
                onConfirm={() => po.removeBatch(order.id, family.id, batch.id)}
              >
                <Button size="small" danger icon={<AxMuiIcon icon="mdiTrashCanOutline" size={14} />} disabled={isBatchRunning}>
                  Remove batch
                </Button>
              </Popconfirm>
              {isBatchRunning && (
                <Typography.Text type="secondary" className="text-sm">
                  Running batches can't be split or removed — they're already on the floor.
                </Typography.Text>
              )}
            </Space>
            <Divider style={{ margin: '12px 0' }} />
            <PlannerNoteEditor noteKey={`batch::${family.id}::${batch.id}`} label={batch.name} />
          </div>
        ) : null}
      </div>
    </div>
  )
})
