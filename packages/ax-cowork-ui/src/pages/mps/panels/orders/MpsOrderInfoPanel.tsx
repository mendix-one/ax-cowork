import { useEffect, useState, type ReactNode } from 'react'
import { Button, Descriptions, Input, InputNumber, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMpsContext } from '../../stores/mps.context'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import { MilestoneChips, PriorityChip, StateChip, StatusChip } from './order-chips'
import { MpsOrderSummary } from './MpsOrderSummary'
import { simulationKeyForBatch, simulationKeyForFamily, simulationKeyForOrder, noteKeyForBatch, noteKeyForFamily, noteKeyForOrder, remarkForOrder, waferStatesForOrder, waferStatesForRow } from '../../helpers/order.helpers'

// Entity-scoped notes list (PO / Family / etc). Reads from po.getNotes (list model, separate from
// the single-note NotesStore). Renders existing notes oldest-first with delete buttons, plus an
// inline composer at the bottom. `entityKey` is the namespaced key — e.g. "po::PO-2025-118" or
// "family::v9-qlc-a" — built via noteKeyForOrder / noteKeyForFamily.
const EntityNotesList = observer(({ entityKey, placeholder }: { entityKey: string; placeholder: string }) => {
  const po = useMpsContext().order
  const notes = po.getNotes(entityKey)
  const [draft, setDraft] = useState('')
  const submit = () => {
    if (!draft.trim()) return
    po.addNote(entityKey, draft)
    setDraft('')
  }
  return (
    <div className="ax-order_pn">
      {notes.length === 0 ? (
        <Typography.Text type="secondary" className="text-sm">
          No notes yet — add one below.
        </Typography.Text>
      ) : (
        <div className="ax-order_pn_list">
          {notes.map((n) => (
            <div key={n.id} className="ax-order_pn_item">
              <div className="ax-order_pn_item_meta">
                <AxMuiIcon icon="mdiNoteTextOutline" size={12} />
                <span>{new Date(n.createdAt).toLocaleString()}</span>
                <Tooltip title="Delete note">
                  <Button
                    size="small"
                    type="text"
                    danger
                    className="ax-order_pn_item_del"
                    icon={<AxMuiIcon icon="mdiClose" size={12} />}
                    onClick={() => po.removeNote(entityKey, n.id)}
                  />
                </Tooltip>
              </div>
              <div className="ax-order_pn_item_text">{n.text}</div>
            </div>
          ))}
        </div>
      )}
      <Space.Compact style={{ width: '100%', marginTop: 8 }}>
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onPressEnter={submit}
        />
        <Button type="primary" disabled={!draft.trim()} onClick={submit} icon={<AxMuiIcon icon="mdiPlus" size={14} />}>
          Add
        </Button>
      </Space.Compact>
    </div>
  )
})

// Compact list of manufacturing batches belonging to the selected family. Mirrors FamiliesList:
// one row per batch with the key planning data, clickable to drill into the batch detail.
const BatchesList = observer(({ poId, familyId }: { poId: string; familyId: string }) => {
  const po = useMpsContext().order
  const order = po.orders.find((o) => o.id === poId)
  const family = order?.schedule.find((f) => f.id === familyId)
  if (!family || family.batches.length === 0) {
    return (
      <Typography.Text type="secondary" className="text-sm">
        No batches on this family.
      </Typography.Text>
    )
  }
  return (
    <div className="ax-order_fams">
      {family.batches.map((b) => (
        <button key={b.id} type="button" className="ax-order_fams_item" onClick={() => po.selectRow(`batch::${family.id}::${b.id}`)}>
          <div className="ax-order_fams_item_top">
            <span className="ax-order_fams_item_label">{b.name}</span>
            <Tag color="default" style={{ margin: 0 }}>
              {b.waferCount.toLocaleString()} wafers
            </Tag>
            <StateChip state={b.scheduleClass} />
          </div>
          <div className="ax-order_fams_item_meta">
            <span>{b.durationDays} days</span>
            <span>·</span>
            <span>{b.start} → {b.end}</span>
            {b.toolGroup && (
              <>
                <span>·</span>
                <span>{b.toolGroup}</span>
              </>
            )}
          </div>
        </button>
      ))}
    </div>
  )
})

// Compact list of production families belonging to the selected PO. One row per family with the
// key planning data — the planner can click the chip to drill into the family (selectRow).
const FamiliesList = observer(({ poId }: { poId: string }) => {
  const po = useMpsContext().order
  const order = po.orders.find((o) => o.id === poId)
  if (!order || order.schedule.length === 0) {
    return (
      <Typography.Text type="secondary" className="text-sm">
        No production families on this order.
      </Typography.Text>
    )
  }
  return (
    <div className="ax-order_fams">
      {order.schedule.map((f) => {
        const commitment = f.batches.reduce((s, b) => s + b.waferCount, 0)
        return (
          <button key={f.id} type="button" className="ax-order_fams_item" onClick={() => po.selectRow(`family::${f.id}`)}>
            <div className="ax-order_fams_item_top">
              <span className="ax-order_fams_item_label">{f.label}</span>
              <Tag color="default" style={{ margin: 0 }}>
                {f.tech}
              </Tag>
              <StateChip state={f.scheduleClass} />
            </div>
            <div className="ax-order_fams_item_meta">
              <span>{commitment.toLocaleString()} wafers</span>
              <span>·</span>
              <span>{f.batches.length} batches</span>
              <span>·</span>
              <span>{f.start} → {f.end}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
})

// Inline-edit affordance for batch target wafer out. Uncontrolled-ish: the InputNumber tracks a local draft;
// pressing Commit (or blur) writes back through the store.
const BatchTargetEdit = observer(({ poId, familyId, batchId, value }: { poId: string; familyId: string; batchId: string; value: number }) => {
  const po = useMpsContext().order
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

export const MpsOrderInfoPanel = observer(() => {
  const sim = useMpsContext()
  const po = sim.order
  const row = po.selectedRow
  const order = row ? po.orders.find((o) => o.id === row.poId) : null
  const family = row?.familyId && order ? order.schedule.find((f) => f.id === row.familyId) : null
  const batch = row?.batchId && family ? family.batches.find((b) => b.id === row.batchId) : null

  const isBatchRunning = batch?.scheduleClass === 'fixed'

  // Build the header bar contents once per render based on the row kind. The chip-rich title
  // (Code · Context · Priority · State) and the kind-specific action buttons live in the panel
  // HEADER — the body no longer renders its own title bar. Summary mode keeps the plain text label.
  let titleLeft: ReactNode = 'Summary'
  let titleActions: ReactNode = null

  if (row && order) {
    if (row.kind === 'po') {
      const gKey = simulationKeyForOrder(order.id)
      const isIncluded = sim.simulation.checkedKeys.includes(gKey)
      const isExcluded = !isIncluded
      const canToggleExclude = order.scheduleClass === 'new'
      const state = isExcluded ? 'exclude' : order.scheduleClass
      titleLeft = (
        <span className="ax-order_info_header_title">
          <span className="ax-order_info_header_title_code">{order.id}</span>
          <span className="ax-order_info_header_title_sep">·</span>
          <span className="ax-order_info_header_title_context">{order.customer}</span>
          <PriorityChip priority={order.priority} />
          <StateChip state={state} />
        </span>
      )
      titleActions = (
        <Tooltip
          title={
            canToggleExclude
              ? isExcluded
                ? 'Include this order back into the current schedule'
                : 'Exclude this order from the current schedule'
              : 'Only orders with State = New can be excluded'
          }
        >
          <Button
            size="small"
            danger={!isExcluded}
            disabled={!canToggleExclude}
            icon={<AxMuiIcon icon={isExcluded ? 'mdiPlaylistPlus' : 'mdiPlaylistRemove'} size={14} />}
            onClick={() => sim.simulation.setKeyIncluded(gKey, isExcluded)}
          >
            {isExcluded ? 'Include' : 'Exclude'}
          </Button>
        </Tooltip>
      )
    } else if (row.kind === 'family' && family) {
      const gKey = simulationKeyForFamily(order.id, family.id)
      const isIncluded = sim.simulation.checkedKeys.includes(gKey)
      const isExcluded = !isIncluded
      const canToggleExclude = family.scheduleClass === 'new'
      const state = isExcluded ? 'exclude' : family.scheduleClass
      titleLeft = (
        <span className="ax-order_info_header_title">
          <span className="ax-order_info_header_title_code">{family.label}</span>
          <span className="ax-order_info_header_title_sep">·</span>
          <span className="ax-order_info_header_title_context">{order.id}</span>
          <PriorityChip priority={family.priority} />
          <StateChip state={state} />
        </span>
      )
      titleActions = (
        <Tooltip
          title={
            canToggleExclude
              ? isExcluded
                ? 'Include this family back into the current schedule'
                : 'Exclude this family from the current schedule'
              : 'Only families with State = New can be excluded'
          }
        >
          <Button
            size="small"
            danger={!isExcluded}
            disabled={!canToggleExclude}
            icon={<AxMuiIcon icon={isExcluded ? 'mdiPlaylistPlus' : 'mdiPlaylistRemove'} size={14} />}
            onClick={() => sim.simulation.setKeyIncluded(gKey, isExcluded)}
          >
            {isExcluded ? 'Include' : 'Exclude'}
          </Button>
        </Tooltip>
      )
    } else if (row.kind === 'batch' && batch) {
      const gKey = simulationKeyForBatch(order.id, family!.id, batch.id)
      const isIncluded = sim.simulation.checkedKeys.includes(gKey)
      const isExcluded = !isIncluded
      const canToggleExclude = batch.scheduleClass === 'new'
      const state = isExcluded ? 'exclude' : batch.scheduleClass
      titleLeft = (
        <span className="ax-order_info_header_title">
          <span className="ax-order_info_header_title_code">{batch.name}</span>
          <span className="ax-order_info_header_title_sep">·</span>
          <span className="ax-order_info_header_title_context">{family!.label}</span>
          <StateChip state={state} />
        </span>
      )
      titleActions = (
        <Space size={4}>
          <Tooltip title={isBatchRunning ? 'Running batches cannot be split' : batch.waferCount < 2 ? 'Need at least 2 wafers to split' : 'Split batch in half'}>
            <Button
              size="small"
              icon={<AxMuiIcon icon="mdiCallSplit" size={14} />}
              disabled={isBatchRunning || batch.waferCount < 2}
              onClick={() => po.splitBatch(order.id, family!.id, batch.id)}
            >
              Split
            </Button>
          </Tooltip>
          <Popconfirm
            title={`Remove batch ${batch.name}?`}
            description="This only removes it from the current simulation."
            okText="Remove"
            okButtonProps={{ danger: true }}
            disabled={isBatchRunning}
            onConfirm={() => po.removeBatch(order.id, family!.id, batch.id)}
          >
            <Tooltip title={isBatchRunning ? 'Running batches cannot be removed' : 'Remove this batch from the simulation'}>
              <Button size="small" danger icon={<AxMuiIcon icon="mdiTrashCanOutline" size={14} />} disabled={isBatchRunning}>
                Remove
              </Button>
            </Tooltip>
          </Popconfirm>
          <Tooltip
            title={
              canToggleExclude
                ? isExcluded
                  ? 'Include this batch back into the current schedule'
                  : 'Exclude this batch from the current schedule'
                : 'Only batches with State = New can be excluded'
            }
          >
            <Button
              size="small"
              danger={!isExcluded}
              disabled={!canToggleExclude}
              icon={<AxMuiIcon icon={isExcluded ? 'mdiPlaylistPlus' : 'mdiPlaylistRemove'} size={14} />}
              onClick={() => sim.simulation.setKeyIncluded(gKey, isExcluded)}
            >
              {isExcluded ? 'Include' : 'Exclude'}
            </Button>
          </Tooltip>
        </Space>
      )
    }
  }

  // Height varies by mode — 12rem for the dense summary, 48rem (capped at 40% of body) for the
  // taller detail cards. Driven by a modifier class so the SCSS owns the values.
  const heightClass = row && order ? 'ax-order_info__detail' : 'ax-order_info__summary'

  return (
    <div className={`ax-order_info ${heightClass}`}>
      <div className="ax-order_info_header">
        <div className="ax-order_info_header_left">{titleLeft}</div>
        <div className="ax-order_info_header_right">
          {titleActions}
          <Button
            size="small"
            type="text"
            className="ax-antd-button-icon-small"
            icon={<AxMuiIcon icon="mdiClose" size="1.15rem" />}
            onClick={() => po.closeInfoPanel()}
          />
        </div>
      </div>
      <div className="ax-order_info_body">
        {!row || !order ? (
          <MpsOrderSummary />
        ) : row.kind === 'po' ? (
          (() => {
            // PO detail card sections: Meta → Families → Notes. (Title bar lives in the panel header.)
            const waf = waferStatesForOrder(order)
            const remaining = Math.max(0, order.qty - order.outWafers)
            const progressPct = order.qty > 0 ? Math.round((order.outWafers / order.qty) * 100) : 0
            const remark = remarkForOrder(order)
            return (
              <div className="ax-order_info_card">
                {/* ---- Meta Info ------------------------------------------------------------- */}
                <div className="ax-order_info_section">
                  <div className="ax-order_info_section_title">Meta Info</div>
                  <Descriptions
                    size="small"
                    column={2}
                    bordered
                    // Narrow + semibold labels so the value column gets most of the width and the
                    // label/value contrast reads cleanly without a heavier bold weight.
                    labelStyle={{ width: 110, fontWeight: 500, color: '#262626' }}
                  >
                    <Descriptions.Item label="Code">{order.id}</Descriptions.Item>
                    <Descriptions.Item label="Customer">{order.customer}</Descriptions.Item>
                    <Descriptions.Item label="Spec">{order.spec}</Descriptions.Item>
                    <Descriptions.Item label="Commitment">{order.qty.toLocaleString()} wafers</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{order.waferStart}</Descriptions.Item>
                    <Descriptions.Item label="End Date">{order.end}</Descriptions.Item>
                    <Descriptions.Item label="Milestones" span={2}>
                      <MilestoneChips milestones={order.milestones} poId={order.id} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <StatusChip status={order.poStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Progress">{progressPct}%</Descriptions.Item>
                    <Descriptions.Item label="Shipped">{order.outWafers.toLocaleString()} wafers</Descriptions.Item>
                    <Descriptions.Item label="Remaining">{remaining.toLocaleString()} wafers</Descriptions.Item>
                    <Descriptions.Item label="Processing" span={2}>
                      {waf.processing > 0 ? `${waf.processing.toLocaleString()} wafers` : '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Remark" span={2}>
                      {remark || <Typography.Text type="secondary">—</Typography.Text>}
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                {/* ---- Production Family ----------------------------------------------------- */}
                <div className="ax-order_info_section">
                  <div className="ax-order_info_section_title">
                    Production Family ({order.schedule.length})
                    <Button
                      size="small"
                      type="link"
                      icon={<AxMuiIcon icon="mdiPlusBoxOutline" size={14} />}
                      onClick={() => po.addFamily(order.id)}
                    >
                      Add family
                    </Button>
                  </div>
                  <FamiliesList poId={order.id} />
                </div>

                {/* ---- Notes ----------------------------------------------------------------- */}
                <div className="ax-order_info_section">
                  <div className="ax-order_info_section_title">Notes ({po.getNotes(noteKeyForOrder(order.id)).length})</div>
                  <EntityNotesList entityKey={noteKeyForOrder(order.id)} placeholder="Add a new note for this production order…" />
                </div>
              </div>
            )
          })()
        ) : row.kind === 'family' && family ? (
          (() => {
            // Family detail card — Meta → Batches → Notes. (Title bar lives in the panel header.)
            // Numbers (Shipped / Remaining / Processing / Progress) are proportional splits of the
            // parent PO's totals weighted by this family's share of commitment.
            const commitment = family.batches.reduce((s, b) => s + b.waferCount, 0)
            const familyWaf = waferStatesForRow(po.orders, row)
            const remaining = Math.max(0, commitment - familyWaf.completed)
            const progressPct = commitment > 0 ? Math.round((familyWaf.completed / commitment) * 100) : 0
            const familyMilestones = order.milestones.filter((m) => m.familyId === family.id)
            const remark = '' // Family-level remark not modelled yet — leave em-dash so layout stays consistent.
            const noteKey = noteKeyForFamily(family.id)
            return (
              <div className="ax-order_info_card">
                {/* ---- Meta Info ------------------------------------------------------------- */}
                <div className="ax-order_info_section">
                  <div className="ax-order_info_section_title">Meta Info</div>
                  <Descriptions size="small" column={2} bordered labelStyle={{ width: 110, fontWeight: 500, color: '#262626' }}>
                    <Descriptions.Item label="Code">{family.label}</Descriptions.Item>
                    <Descriptions.Item label="Order">{order.id}</Descriptions.Item>
                    <Descriptions.Item label="Tech">{family.tech}</Descriptions.Item>
                    <Descriptions.Item label="Commitment">{commitment.toLocaleString()} wafers</Descriptions.Item>
                    <Descriptions.Item label="Start Date">{family.start}</Descriptions.Item>
                    <Descriptions.Item label="End Date">{family.end}</Descriptions.Item>
                    <Descriptions.Item label="Milestones" span={2}>
                      <MilestoneChips milestones={familyMilestones} poId={order.id} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <StatusChip status={family.status} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Progress">{progressPct}%</Descriptions.Item>
                    <Descriptions.Item label="Shipped">{familyWaf.completed.toLocaleString()} wafers</Descriptions.Item>
                    <Descriptions.Item label="Remaining">{remaining.toLocaleString()} wafers</Descriptions.Item>
                    <Descriptions.Item label="Processing" span={2}>
                      {familyWaf.processing > 0 ? `${familyWaf.processing.toLocaleString()} wafers` : '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Remark" span={2}>
                      {remark || <Typography.Text type="secondary">—</Typography.Text>}
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                {/* ---- Production Batch ------------------------------------------------------ */}
                <div className="ax-order_info_section">
                  <div className="ax-order_info_section_title">
                    Production Batch ({family.batches.length})
                    <Button
                      size="small"
                      type="link"
                      icon={<AxMuiIcon icon="mdiPlusCircleOutline" size={14} />}
                      onClick={() => po.addBatch(order.id, family.id)}
                    >
                      Add batch
                    </Button>
                  </div>
                  <BatchesList poId={order.id} familyId={family.id} />
                </div>

                {/* ---- Notes ----------------------------------------------------------------- */}
                <div className="ax-order_info_section">
                  <div className="ax-order_info_section_title">Notes ({po.getNotes(noteKey).length})</div>
                  <EntityNotesList entityKey={noteKey} placeholder="Add a new note for this production family…" />
                </div>
              </div>
            )
          })()
        ) : row.kind === 'batch' && family && batch ? (
          (() => {
            // Batch detail card — Meta + Notes. (Title bar + actions live in the panel header.)
            const batchWaf = waferStatesForRow(po.orders, row)
            const remaining = Math.max(0, batch.waferCount - batchWaf.completed)
            const noteKey = noteKeyForBatch(family.id, batch.id)
            return (
              <div className="ax-order_info_card">
                {/* ---- Meta Info ------------------------------------------------------------- */}
                <div className="ax-order_info_section">
                  <div className="ax-order_info_section_title">Meta Info</div>
                  <Descriptions size="small" column={2} bordered labelStyle={{ width: 110, fontWeight: 500, color: '#262626' }}>
                    <Descriptions.Item label="Code">{batch.name}</Descriptions.Item>
                    <Descriptions.Item label="Family">{family.label}</Descriptions.Item>
                    <Descriptions.Item label="Order">{order.id}</Descriptions.Item>
                    <Descriptions.Item label="Tech">{family.tech}</Descriptions.Item>
                    <Descriptions.Item label="Commitment" span={2}>
                      {isBatchRunning ? (
                        <Space>
                          <Typography.Text strong>{batch.waferCount.toLocaleString()} wafers</Typography.Text>
                          <Tag color="blue">Running · locked</Tag>
                        </Space>
                      ) : (
                        <BatchTargetEdit poId={order.id} familyId={family.id} batchId={batch.id} value={batch.waferCount} />
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Start Date">{batch.start}</Descriptions.Item>
                    <Descriptions.Item label="End Date">{batch.end}</Descriptions.Item>
                    <Descriptions.Item label="Duration">{batch.durationDays} days</Descriptions.Item>
                    <Descriptions.Item label="Tool Group">{batch.toolGroup || <Typography.Text type="secondary">—</Typography.Text>}</Descriptions.Item>
                    <Descriptions.Item label="Shipped">{batchWaf.completed.toLocaleString()} wafers</Descriptions.Item>
                    <Descriptions.Item label="Remaining">{remaining.toLocaleString()} wafers</Descriptions.Item>
                    <Descriptions.Item label="Processing" span={2}>
                      {batchWaf.processing > 0 ? `${batchWaf.processing.toLocaleString()} wafers` : '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Remark" span={2}>
                      {batch.note || <Typography.Text type="secondary">—</Typography.Text>}
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                {/* ---- Notes ----------------------------------------------------------------- */}
                <div className="ax-order_info_section">
                  <div className="ax-order_info_section_title">Notes ({po.getNotes(noteKey).length})</div>
                  <EntityNotesList entityKey={noteKey} placeholder="Add a new note for this manufacturing batch…" />
                </div>
              </div>
            )
          })()
        ) : null}
      </div>
    </div>
  )
})
