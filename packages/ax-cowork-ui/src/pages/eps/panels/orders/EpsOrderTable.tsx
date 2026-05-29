import { useMemo } from 'react'
import { Empty, Tooltip } from 'antd'
import { observer } from 'mobx-react-lite'
import { AxControlTable, type ControlTableColumn } from '@ax-cowork/control-table'
import { useEpsContext } from '../../stores/eps.context'
import { processPathLabel } from '../../data/mock-plan'
import type { FlatRow } from '../../stores/order.store'
import { formatMtoAnchor, stateForRow } from '../../helpers/order.helpers'
import { StateChip, SubTaskKindChip } from './order-chips'
import { EpsOrderTuneButton } from './EpsOrderTuneButton'
import { AxMuiIcon } from '@/shared/mui-icon/AxMuiIcon.tsx'

// Build a stable "PF band" parity so rows belonging to the same Production Family share a tint —
// makes the multi-level tree easier to scan.
const buildPfBandIndex = (rows: FlatRow[]): Map<string, number> => {
  const map = new Map<string, number>()
  let idx = 0
  for (const r of rows) {
    if (r.kind !== 'pf') continue
    if (r.pfId && !map.has(r.pfId)) {
      map.set(r.pfId, idx)
      idx += 1
    }
  }
  return map
}

export const EpsOrderTable = observer(() => {
  const sim = useEpsContext()
  const po = sim.order
  const notes = sim.notes
  const selectedKey = po.selectedRowKey

  const data = po.flatRows
  const pfBandIndex = useMemo(() => buildPfBandIndex(data), [data])

  const baseColumns = useMemo<ControlTableColumn<FlatRow>[]>(
    () => [
      // 1 — Selection indicator + table tune button in the header.
      {
        key: '_select',
        title: '',
        width: 32,
        sortable: false,
        sticky: 'left',
        align: 'center',
        accessor: () => '',
        headerRender: () => <EpsOrderTuneButton />,
        render: (_v, row) => {
          const isSelected = selectedKey === row.key
          return (
            <span className="ax-eps-order_select" title={isSelected ? 'Click row to deselect' : 'Click row to view info'}>
              <AxMuiIcon icon="mdiDragVertical" size={16} color={isSelected ? '#673AB7' : '#bfbfbf'} />
            </span>
          )
        },
      },
      // 2 — IA label tree (sticky-left).
      {
        key: 'label',
        title: 'Biz Group / Team / PFG / Family / Task / Sub-Task',
        width: 360,
        sortable: false,
        sticky: 'left',
        accessor: (r) => r.label,
        render: (_v, row) => {
          const nk =
            row.kind === 'pf'
              ? `pf::${row.pfId}`
              : row.kind === 'task'
                ? `task::${row.taskId}`
                : row.kind === 'subTask' && row.taskId && row.subTaskId
                  ? `sub::${row.taskId}::${row.subTaskId}`
                  : null
          const noteText = nk ? notes.get(nk) : ''
          return (
            <span className={`ax-eps-order_label ax-eps-order_label__${row.kind}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              {row.label}
              {row.kind === 'subTask' && <SubTaskKindChip kind={row.subTaskKind} />}
              {nk && notes.has(nk) && (
                <Tooltip title={noteText}>
                  <AxMuiIcon icon="mdiNoteText" size={14} color="#faad14" />
                </Tooltip>
              )}
            </span>
          )
        },
      },
      // 3 — State chip (sticky-left).
      {
        key: 'state',
        title: 'State',
        width: 92,
        sortable: false,
        sticky: 'left',
        align: 'center',
        accessor: (r) => stateForRow(r) ?? '',
        render: (_v, row) => <StateChip state={stateForRow(row)} />,
      },
      {
        key: 'bizTeam',
        title: 'Biz Team',
        width: 160,
        sortable: true,
        accessor: (r) => r.bizTeamName ?? '',
      },
      {
        key: 'processPath',
        title: 'Process Path',
        width: 260,
        sortable: false,
        accessor: (r) => (r.processPathLabel ? processPathLabel(r.processPathLabel.split(' / ')) : ''),
      },
      {
        key: 'spm',
        title: 'SPM (P/M)',
        width: 90,
        sortable: true,
        align: 'right',
        accessor: (r) => r.spm,
        render: (v) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Number(v).toLocaleString()}</span>,
      },
      {
        key: 'startDate',
        title: 'Start Date',
        width: 110,
        sortable: true,
        accessor: (r) => r.startDate ?? '',
      },
      {
        key: 'endDate',
        title: 'End Date',
        width: 110,
        sortable: true,
        accessor: (r) => r.endDate ?? '',
      },
      {
        key: 'mto',
        title: 'MTO Anchor',
        width: 110,
        sortable: true,
        accessor: (r) => r.pfMtoAnchor ?? '',
        render: (_v, row) => formatMtoAnchor(row.pfMtoAnchor),
      },
    ],
    [selectedKey, notes],
  )

  // Filter + reorder columns per the tune state.
  const activeColumns = useMemo<ControlTableColumn<FlatRow>[]>(() => {
    const byKey = new Map(baseColumns.map((c) => [c.key, c]))
    const out: ControlTableColumn<FlatRow>[] = []
    for (const t of po.tableTune) {
      if (!t.visible) continue
      const base = byKey.get(t.key)
      if (!base) continue
      out.push({ ...base, sortable: t.sortable, sticky: (t.sticky ?? base.sticky) ?? undefined })
    }
    return out
  }, [baseColumns, po.tableTune])

  if (data.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No production requirements" />

  return (
    <div className="ax-eps-order_table">
      <AxControlTable<FlatRow>
        rowKey={(r) => r.key}
        data={data}
        columns={activeColumns}
        tree={{
          columnId: 'label',
          depth: (r) => r.depth,
          isExpanded: (r) => r.expanded ?? false,
          hasChildren: (r) => r.hasChildren ?? false,
          onToggle: (r) => {
            if (r.kind === 'bizGroup') po.toggleBizGroupExpanded(r.key)
            else if (r.kind === 'bizTeam') po.toggleBizTeamExpanded(r.key)
            else if (r.kind === 'pfg') po.togglePfgExpanded(r.key)
            else if (r.kind === 'pf' && r.pfId) po.togglePfExpanded(r.pfId)
            else if (r.kind === 'task' && r.taskId) po.toggleTaskExpanded(r.taskId)
          },
        }}
        selectionMode="single"
        selectedKeys={po.selectedRowKey ? [po.selectedRowKey] : []}
        onRowClick={(r) => po.selectRow(r.key)}
        rowClassName={(r) => {
          const band = r.pfId ? `ax-eps-order_pfband__${(pfBandIndex.get(r.pfId) ?? 0) % 2 === 0 ? 'a' : 'b'}` : ''
          return `ax-eps-order_row ax-eps-order_row__${r.kind} ${band}`
        }}
      />
    </div>
  )
})
