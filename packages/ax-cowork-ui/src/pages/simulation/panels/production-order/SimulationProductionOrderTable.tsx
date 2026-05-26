import { useMemo } from 'react'
import { Progress, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxControlTable, type ControlTableColumn } from '@ax-cowork/control-table'
import { useSimulationContext } from '../../store/simulation.context'
import type { ProductionOrder, ScheduleMilestone } from '../../data/mock-plan'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'
import type { FlatRow } from './production-order.store'
import { MilestoneChips, PriorityChip, StatusChip } from './production-order-chips'

const INDENT_PX = 18

// Build a per-row lookup of related milestones (PO milestones; family rows inherit by familyId; batch rows have none).
const milestonesFor = (orders: ProductionOrder[], row: FlatRow): ScheduleMilestone[] => {
  if (row.kind === 'batch') return []
  const po = orders.find((o) => o.id === row.poId)
  if (!po) return []
  if (row.kind === 'po') return po.milestones
  return po.milestones.filter((m) => m.familyId === row.familyId)
}

export const SimulationProductionOrderTable = observer(() => {
  const po = useSimulationContext().productionOrder

  const data = po.flatRows

  const columns = useMemo<ControlTableColumn<FlatRow>[]>(() => {
    return [
      {
        key: 'label',
        title: 'Production Order / Family / Batch',
        width: 320,
        sortable: false,
        accessor: (r) => r.label,
        render: (_v, row) => (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingLeft: row.depth * INDENT_PX, width: '100%' }}>
            {row.hasChildren ? (
              <button
                type="button"
                className="ax-po_tree_chevron"
                onClick={(e) => {
                  e.stopPropagation()
                  if (row.kind === 'po') po.toggleOrderExpanded(row.poId)
                  else if (row.kind === 'family' && row.familyId) po.toggleFamilyExpanded(row.familyId)
                }}
              >
                <AxMuiIcon icon={row.expanded ? 'mdiChevronDown' : 'mdiChevronRight'} size={14} />
              </button>
            ) : (
              <span className="ax-po_tree_chevron ax-po_tree_chevron__spacer" />
            )}
            <span className={`ax-po_label ax-po_label__${row.kind}`}>{row.label}</span>
            {row.kind === 'po' && row.hotLot && (
              <Tooltip title="Hot lot">
                <span className="ax-po_hotlot">★ HOT</span>
              </Tooltip>
            )}
          </span>
        ),
      },
      {
        key: 'customer',
        title: 'Customer',
        width: 120,
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
        width: 100,
        accessor: (r) => r.priority ?? '',
        render: (_v, row) => <PriorityChip priority={row.priority} />,
      },
      {
        key: 'commitment',
        title: 'Commitment',
        kind: 'number',
        width: 130,
        accessor: (r) => r.commitment,
        render: (v) => (typeof v === 'number' ? v.toLocaleString() : String(v)),
      },
      {
        key: 'status',
        title: 'Status',
        width: 120,
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
        width: 120,
        accessor: (r) => r.startDate,
      },
      {
        key: 'endDate',
        title: 'End Date',
        width: 120,
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
    ]
  }, [po])

  const selectedKey = po.selectedRowKey
  const selectedKeys = selectedKey ? [selectedKey] : []

  return (
    <div className="ax-po_table">
      <AxControlTable<FlatRow>
        data={data}
        columns={columns}
        rowKey={(r) => r.key}
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          // Only one row "selected" at a time for the info panel — use the last toggled key.
          const next = keys[keys.length - 1]
          if (next) po.selectRow(String(next))
        }}
        showColumnFilter={false}
        showColumnToggle={false}
        showRowNumber={false}
      />
    </div>
  )
})
