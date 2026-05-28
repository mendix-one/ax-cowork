import { useMemo } from 'react'
import { Empty, Progress, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxControlTable, type ControlTableColumn } from '@ax-cowork/control-table'
import { useMpsContext } from '../../store/mps.context'
import type { ProductionOrder, ScheduleMilestone } from '../../data/mock-plan'
import type { FlatRow } from './production-order.store'
import { remarkForRow, stateForRow, waferStatesForRow } from './production-order.helpers'
import { MilestoneChips, StateChip, StatusChip } from './production-order-chips'
import { MpsProductionOrderTuneButton } from './MpsProductionOrderTuneButton'
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

// Tech / Spec for the row: spec at PO level (e.g. "SP-QLC-V9 v3.4"), tech at family/batch level
// (e.g. "T-V9-232L"). Customer-pivot rows have no recipe identity, so they're blank.
const techSpec = (orders: ProductionOrder[], row: FlatRow): string => {
  const order = orders.find((o) => o.id === row.poId)
  if (!order) return ''
  if (row.kind === 'po') return order.spec
  if ((row.kind === 'family' || row.kind === 'batch') && row.familyId) {
    return order.schedule.find((f) => f.id === row.familyId)?.tech ?? ''
  }
  return ''
}

// Stable PO-band parity so rows of the same PO share a background, alternating PO group-by group.
// Customer rows in customer-pivot mode pick up their first child's PO parity for a clean visual.
const buildPoBandIndex = (orders: ProductionOrder[]): Map<string, number> => {
  const map = new Map<string, number>()
  orders.forEach((o, i) => map.set(o.id, i))
  return map
}

export const MpsProductionOrderTable = observer(() => {
  const sim = useMpsContext()
  const po = sim.productionOrder
  const notes = sim.notes
  const selectedKey = po.selectedRowKey
  // Set of gantt-tree keys currently INCLUDED in the schedule — anything missing is "Exclude".
  // Read from sim.gantt so excluding from any view (PO / Gantt / Analysis) drives the same chip.
  const checkedSet = useMemo(() => new Set(sim.gantt.checkedKeys), [sim.gantt.checkedKeys])

  const data = po.flatRows
  const poBandIndex = useMemo(() => buildPoBandIndex(po.orders), [po.orders])

  // Base column definitions, keyed by `key`. The active columns array is derived from po.tableTune
  // (order + visibility + sticky/sortable/filterable overrides) below — so the tune popover can flex
  // any subset without us re-declaring renderers.
  const baseColumns = useMemo<ControlTableColumn<FlatRow>[]>(
    () => [
      // 1 — Selection indicator. Clicking anywhere on the row toggles selection via po.selectRow;
      // this column is the visual handle. We use mdiDragVertical (a 6-dot vertical glyph) so the
      // affordance reads as "row handle" — light grey at rest, Deep Purple when the row is selected.
      // The HEADER uses headerRender to host the mdiTune button — the table-tune entry point.
      // Tree decoration (chevron + indent) lives on the next column, NOT here — set via tree.columnId.
      {
        key: '_select',
        title: '',
        width: 32,
        sortable: false,
        sticky: 'left',
        align: 'center',
        accessor: () => '',
        headerRender: () => <MpsProductionOrderTuneButton />,
        render: (_v, row) => {
          const isSelected = selectedKey === row.key
          return (
            <span className="ax-po_select" title={isSelected ? 'Click row to deselect' : 'Click row to view info'}>
              <AxMuiIcon icon="mdiDragVertical" size={16} color={isSelected ? '#673AB7' : '#bfbfbf'} />
            </span>
          )
        },
      },
      // 2 — Production Order / Family / Batch (sticky-left tree column).
      {
        key: 'label',
        title: 'Production Order / Family / Batch',
        width: 300,
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
      // 3 — State (Fixed / Changes / New / Exclude). Sticky-left so it stays beside the label during
      // horizontal scroll. Driven by the gantt store's adjustment checkedKeys — un-checking a node
      // anywhere flips this chip to "Exclude" everywhere.
      {
        key: 'state',
        title: 'State',
        width: 92,
        sortable: false,
        sticky: 'left',
        align: 'center',
        accessor: (r) => stateForRow(r, checkedSet) ?? '',
        render: (_v, row) => <StateChip state={stateForRow(row, checkedSet)} />,
      },
      // 4 — Customer (only shown on PO rows; family/batch inherit visually via tree indent).
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
      // 4 — Tech / Spec.
      {
        key: 'techSpec',
        title: 'Tech / Spec',
        width: 140,
        accessor: (r) => techSpec(po.orders, r),
      },
      // 5 — Commitment.
      {
        key: 'commitment',
        title: 'Commitment',
        kind: 'number',
        width: 110,
        accessor: (r) => r.commitment,
        render: (v) => (typeof v === 'number' ? v.toLocaleString() : String(v)),
      },
      // 6/7 — Dates.
      { key: 'startDate', title: 'Start Date', width: 110, accessor: (r) => r.startDate },
      { key: 'endDate', title: 'End Date', width: 110, accessor: (r) => r.endDate },
      // 8 — Milestones.
      {
        key: 'milestones',
        title: 'Milestones',
        width: 200,
        sortable: false,
        accessor: () => '',
        render: (_v, row) => {
          const milestones = milestonesFor(po.orders, row)
          return <MilestoneChips milestones={milestones} poId={row.poId} />
        },
      },
      // 9 — Status (PO-level chip).
      {
        key: 'status',
        title: 'Status',
        width: 110,
        accessor: (r) => r.status ?? '',
        render: (_v, row) => (row.kind === 'po' ? <StatusChip status={row.status} /> : null),
      },
      // 10 — Progress (PO/Family only; batches show em-dash).
      {
        key: 'progress',
        title: 'Progress',
        width: 130,
        sortable: false,
        accessor: (r) => (r.commitment ? Math.round(((r.outWafers ?? 0) / r.commitment) * 100) : 0),
        render: (_v, row) => {
          if (row.kind === 'batch' || row.outWafers === undefined) return <span style={{ color: '#bfbfbf' }}>—</span>
          const pct = row.commitment ? Math.round((row.outWafers / row.commitment) * 100) : 0
          return <Progress percent={pct} size="small" style={{ marginInlineEnd: 0 }} />
        },
      },
      // 11/12/13 — Wafer-state breakdown.
      {
        key: 'startedWafers',
        title: 'Started Wafers',
        kind: 'number',
        width: 120,
        accessor: (r) => waferStatesForRow(po.orders, r).started,
        render: (v) => (typeof v === 'number' && v > 0 ? v.toLocaleString() : <span style={{ color: '#bfbfbf' }}>—</span>),
      },
      {
        key: 'processingWafers',
        title: 'Processing Wafers',
        kind: 'number',
        width: 140,
        accessor: (r) => waferStatesForRow(po.orders, r).processing,
        render: (v) => (typeof v === 'number' && v > 0 ? v.toLocaleString() : <span style={{ color: '#bfbfbf' }}>—</span>),
      },
      {
        key: 'completedWafers',
        title: 'Completed Wafers',
        kind: 'number',
        width: 140,
        accessor: (r) => waferStatesForRow(po.orders, r).completed,
        render: (v) => (typeof v === 'number' && v > 0 ? v.toLocaleString() : <span style={{ color: '#bfbfbf' }}>—</span>),
      },
      // 14 — Remark.
      {
        key: 'remark',
        title: 'Remark',
        width: 260,
        sortable: false,
        accessor: (r) => remarkForRow(po.orders, r),
        render: (_v, row) => {
          const text = remarkForRow(po.orders, row)
          if (!text) return <span style={{ color: '#bfbfbf' }}>—</span>
          return (
            <Tooltip title={text}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '100%' }}>{text}</span>
            </Tooltip>
          )
        },
      },
    ],
    [po, notes, selectedKey, checkedSet],
  )

  // Derive the active columns from tune state — apply order, visibility, and sticky/sortable/filterable
  // overrides on top of the base column definitions. Anything in tune that doesn't match a base column
  // is dropped silently (defensive in case the baseline and base-columns ever drift apart).
  const baseByKey = useMemo(() => {
    const m = new Map<string, ControlTableColumn<FlatRow>>()
    for (const c of baseColumns) m.set(c.key, c)
    return m
  }, [baseColumns])
  const columns = useMemo<ControlTableColumn<FlatRow>[]>(() => {
    const out: ControlTableColumn<FlatRow>[] = []
    for (const tune of po.tableTune) {
      if (!tune.visible) continue
      const base = baseByKey.get(tune.key)
      if (!base) continue
      out.push({
        ...base,
        sticky: tune.sticky ?? undefined,
        sortable: tune.sortable,
        filterable: tune.filterable,
      })
    }
    return out
  }, [po.tableTune, baseByKey])

  const selectedKeys = selectedKey ? [selectedKey] : []

  // PO-banded zebra — each row gets a class based on the parity of its PO group index, so all rows
  // belonging to the same PO share a background. Customer pivot rows have no poId of their own — they
  // inherit the band of their first child PO, which keeps the visual grouping continuous.
  const rowClassName = (row: FlatRow): string => {
    const idx = poBandIndex.get(row.poId) ?? 0
    return idx % 2 === 0 ? 'ax-po_row__band-a' : 'ax-po_row__band-b'
  }

  return (
    <div className="ax-po_table">
      <AxControlTable<FlatRow>
        data={data}
        columns={columns}
        rowKey={(r) => r.key}
        size="small"
        selectionMode="single"
        selectedKeys={selectedKeys}
        // AxControlTable fires both onSelectionChange AND onRowClick on every row click. Selection
        // toggle is driven by po.selectRow (click same row = unselect), so we keep selectRow on a
        // single callsite — onRowClick — and leave onSelectionChange inert. The visual highlight
        // still reacts because the table derives `rowSelection` from the controlled selectedKeys prop.
        onSelectionChange={() => {}}
        onRowClick={(row) => po.selectRow(row.key)}
        rowClassName={rowClassName}
        tree={{
          // Pin chevron + indent to the label column — col 1 is the selection handle.
          columnId: 'label',
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
        // Globally enable per-column filter so the tune popover's "Enable filter" toggle has effect.
        // Each base column defaults to filterable=false in the tune baseline; users opt-in per column.
        showColumnFilter={true}
        showColumnToggle={false}
        showRowNumber={false}
      />
    </div>
  )
})
