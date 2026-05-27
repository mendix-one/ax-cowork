import { useMemo } from 'react'
import { Empty, Progress, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxControlTable, type ControlTableColumn } from '@ax-cowork/control-table'
import { useSimulationContext } from '../../store/simulation.context'
import type { ProductionOrder, ScheduleMilestone } from '../../data/mock-plan'
import type { FlatRow } from './production-order.store'
import { MilestoneChips, PriorityChip, StatusChip } from './production-order-chips'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// The notes-store key matches the row's existing key for po/family/batch rows. Customer rows don't carry
// a planner note in this iteration (customers aren't editable nodes).
const noteKeyFor = (row: FlatRow): string | null => {
  if (row.kind === 'po') return `po::${row.poId}`
  if (row.kind === 'family' && row.familyId) return `family::${row.familyId}`
  if (row.kind === 'batch' && row.familyId && row.batchId) return `batch::${row.familyId}::${row.batchId}`
  return null
}

const milestonesFor = (orders: ProductionOrder[], row: FlatRow): ScheduleMilestone[] => {
  if (row.kind === 'batch') return []
  const po = orders.find((o) => o.id === row.poId)
  if (!po) return []
  if (row.kind === 'po') return po.milestones
  return po.milestones.filter((m) => m.familyId === row.familyId)
}

export const SimulationProductionOrderTable = observer(() => {
  const sim = useSimulationContext()
  const po = sim.productionOrder
  const notes = sim.notes

  const data = po.flatRows

  const columns = useMemo<ControlTableColumn<FlatRow>[]>(
    () => [
      {
        key: 'label',
        title: 'Production Order / Family / Batch',
        width: 320,
        sortable: false,
        sticky: 'left',
        accessor: (r) => r.label,
        render: (_v, row) => {
          const nk = noteKeyFor(row)
          const noteText = nk ? notes.get(nk) : ''
          return (
            <span className={`ax-po_label ax-po_label__${row.kind}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {row.label}
              {row.kind === 'po' && row.hotLot && (
                <Tooltip title="Hot lot">
                  <span className="ax-po_hotlot">★ HOT</span>
                </Tooltip>
              )}
              {nk && notes.has(nk) && (
                <Tooltip title={noteText}>
                  <AxMuiIcon icon="mdiNoteText" size={14} color="#faad14" />
                </Tooltip>
              )}
            </span>
          )
        },
      },
      {
        key: 'customer',
        title: 'Customer',
        width: 110,
        accessor: (r) => r.customerShort ?? '',
        render: (_v, row) => {
          if (row.kind !== 'po') return null
          const order = po.orders.find((o) => o.id === row.poId)
          if (!order) return row.customerShort ?? ''
          return (
            <Tooltip title={order.customer}>
              <span>{order.customerShort}</span>
            </Tooltip>
          )
        },
      },
      {
        key: 'priority',
        title: 'Priority',
        width: 90,
        accessor: (r) => r.priority ?? '',
        render: (_v, row) => <PriorityChip priority={row.priority} />,
      },
      {
        key: 'commitment',
        title: 'Commitment',
        kind: 'number',
        width: 120,
        accessor: (r) => r.commitment,
        render: (v) => (typeof v === 'number' ? v.toLocaleString() : String(v)),
      },
      {
        key: 'status',
        title: 'Status',
        width: 110,
        accessor: (r) => r.status ?? '',
        render: (_v, row) => (row.kind === 'po' ? <StatusChip status={row.status} /> : null),
      },
      {
        key: 'progress',
        title: 'Progress',
        width: 140,
        sortable: false,
        accessor: (r) => (r.commitment ? Math.round(((r.outWafers ?? 0) / r.commitment) * 100) : 0),
        render: (_v, row) => {
          if (row.kind === 'batch' || row.outWafers === undefined) return <span style={{ color: '#bfbfbf' }}>—</span>
          const pct = row.commitment ? Math.round((row.outWafers / row.commitment) * 100) : 0
          return <Progress percent={pct} size="small" style={{ marginInlineEnd: 0 }} />
        },
      },
      {
        key: 'startDate',
        title: 'Start Date',
        width: 110,
        accessor: (r) => r.startDate,
      },
      {
        key: 'endDate',
        title: 'End Date',
        width: 110,
        accessor: (r) => r.endDate,
      },
      {
        key: 'milestones',
        title: 'Milestones',
        width: 220,
        sortable: false,
        accessor: () => '',
        render: (_v, row) => {
          const milestones = milestonesFor(po.orders, row)
          return <MilestoneChips milestones={milestones} poId={row.poId} />
        },
      },
    ],
    [po, notes],
  )

  const selectedKey = po.selectedRowKey
  const selectedKeys = selectedKey ? [selectedKey] : []

  return (
    <div className="ax-po_table">
      <AxControlTable<FlatRow>
        data={data}
        columns={columns}
        rowKey={(r) => r.key}
        size="small"
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          const next = keys[keys.length - 1]
          if (next) po.selectRow(String(next))
        }}
        onRowClick={(row) => po.selectRow(row.key)}
        tree={{
          depth: (r) => r.depth,
          hasChildren: (r) => !!r.hasChildren,
          isExpanded: (r) => !!r.expanded,
          onToggle: (r) => {
            if (r.kind === 'customer' && r.customer) po.toggleCustomerExpanded(r.customer)
            else if (r.kind === 'po') po.toggleOrderExpanded(r.poId)
            else if (r.kind === 'family' && r.familyId) po.toggleFamilyExpanded(r.familyId)
          },
        }}
        empty={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No production orders match the current filters" />}
        showColumnFilter={false}
        showColumnToggle={false}
        showRowNumber={false}
      />
    </div>
  )
})
