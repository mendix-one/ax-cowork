import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { CSSProperties, Key } from 'react'
import { Checkbox } from 'antd'
import { CaretDownOutlined, CaretUpOutlined, SwapOutlined } from '@ant-design/icons'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { AxControlTableProps, ColumnKind, NumberBucketColors, NumberBucketThresholds } from './types'
import { ColumnFilterPopover, ColumnTogglePopover } from './GridPopovers'

const DEFAULT_HEADER_H = 36
const DEFAULT_ROW_H = 32
const CHECKBOX_W = 48
const ROW_NUM_W = 56
const DEFAULT_COL_W = 160
const ROW_OVERSCAN = 20
const COL_OVERSCAN = 10

const DEFAULT_BUCKETS: NumberBucketThresholds = { high: 10, low: 5 }
const DEFAULT_COLORS: NumberBucketColors = {
  high: 'rgba(244, 67, 54, 0.16)', // error
  mid: 'rgba(76, 175, 80, 0.16)', // success
  low: 'rgba(0, 150, 136, 0.16)', // secondary / teal
}

const startsWithAnyFilter: FilterFn<unknown> = (row: Row<unknown>, columnId: string, filterValue: string[]) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true
  const cellValue = String(row.getValue(columnId) ?? '')
  return filterValue.some((v) => cellValue.startsWith(v))
}

function pickBackground(value: number, b: NumberBucketThresholds, c: NumberBucketColors): string {
  if (value > b.high) return c.high
  if (value >= b.low) return c.mid
  return c.low
}

export function AxControlTable<T>({
  data,
  columns,
  rowKey,
  selectedKeys,
  onSelectionChange,
  renderCell,
  numberBuckets = DEFAULT_BUCKETS,
  numberColors = DEFAULT_COLORS,
  defaultColumnWidth = DEFAULT_COL_W,
  rowHeight = DEFAULT_ROW_H,
  headerHeight = DEFAULT_HEADER_H,
  showColumnToggle = true,
  showColumnFilter = true,
  showRowNumber = false,
}: AxControlTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const rowSelection = useMemo<RowSelectionState>(() => {
    const map: RowSelectionState = {}
    if (selectedKeys) for (const k of selectedKeys) map[String(k)] = true
    return map
  }, [selectedKeys])

  const tanstackColumns = useMemo<ColumnDef<T>[]>(
    () =>
      columns.map((col) => ({
        id: col.key,
        accessorFn: col.accessor,
        header: col.title,
        enableSorting: col.sortable !== false,
        enableColumnFilter: showColumnFilter,
        filterFn: startsWithAnyFilter as FilterFn<T>,
        size: col.width ?? defaultColumnWidth,
        meta: { kind: col.kind ?? 'string', render: col.render, align: col.align },
      })),
    [columns, defaultColumnWidth, showColumnFilter],
  )

  const handleSelectionChange = useCallback(
    (updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => {
      if (!onSelectionChange) return
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      const keys: Key[] = []
      for (const [k, v] of Object.entries(next)) {
        if (v) keys.push(k)
      }
      onSelectionChange(keys)
    },
    [rowSelection, onSelectionChange],
  )

  const table = useReactTable<T>({
    data,
    columns: tanstackColumns,
    state: { rowSelection, sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleSelectionChange,
    getRowId: (row) => String(rowKey(row)),
    enableRowSelection: !!onSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const rows = table.getRowModel().rows
  const leafColumns = table.getVisibleLeafColumns()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => rowHeight,
    overscan: ROW_OVERSCAN,
  })

  const colVirtualizer = useVirtualizer({
    count: leafColumns.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => defaultColumnWidth,
    horizontal: true,
    overscan: COL_OVERSCAN,
  })

  const totalHeight = rowVirtualizer.getTotalSize()
  const totalWidth = colVirtualizer.getTotalSize()
  const virtualRows = rowVirtualizer.getVirtualItems()
  const virtualCols = colVirtualizer.getVirtualItems()

  const allRowsSelected = rows.length > 0 && rows.every((r) => rowSelection[r.id])
  const someRowsSelected = rows.some((r) => rowSelection[r.id]) && !allRowsSelected

  const handleHeaderCheckboxChange = useCallback(
    (checked: boolean) => {
      if (!onSelectionChange) return
      onSelectionChange(checked ? rows.map((r) => r.id) : [])
    },
    [rows, onSelectionChange],
  )

  const showSelection = !!onSelectionChange
  const selectionW = showSelection ? CHECKBOX_W : 0
  const rowNumW = showRowNumber ? ROW_NUM_W : 0
  const stickyOffset = selectionW + rowNumW

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      {showColumnToggle && (
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 16,
            zIndex: 10,
            background: '#fafafa',
            borderRadius: 4,
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
          }}
        >
          <ColumnTogglePopover<T> table={table} />
        </div>
      )}
      <div ref={containerRef} className="ax-ct-scroll" style={{ position: 'relative', height: '100%', width: '100%', overflow: 'auto', background: '#fff' }}>
        <div
          style={{
            position: 'relative',
            width: stickyOffset + totalWidth,
            height: headerHeight + totalHeight,
            // Visual cushion: zebra row bands so fast-scroll un-rendered area
            // shows a soft pattern instead of pure white.
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              #ffffff 0,
              #ffffff ${rowHeight}px,
              #f4f4f4 ${rowHeight}px,
              #f4f4f4 ${2 * rowHeight}px
            )`,
            backgroundPosition: `0 ${headerHeight}px`,
            backgroundRepeat: 'repeat',
          }}
        >
          {/* Header row */}
          <div
            className="ax-ct-header"
            style={{
              position: 'sticky',
              top: 0,
              height: headerHeight,
              zIndex: 3,
              width: stickyOffset + totalWidth,
              background: '#fafafa',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            {showRowNumber && (
              <div
                style={{
                  position: 'sticky',
                  left: 0,
                  top: 0,
                  width: ROW_NUM_W,
                  height: headerHeight,
                  display: 'inline-flex',
                  verticalAlign: 'top',
                  background: '#fafafa',
                  zIndex: 4,
                  borderRight: '1px solid #f0f0f0',
                }}
              />
            )}
            {showSelection && (
              <div
                style={{
                  position: 'sticky',
                  left: rowNumW,
                  top: 0,
                  width: CHECKBOX_W,
                  height: headerHeight,
                  display: 'inline-flex',
                  verticalAlign: 'top',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fafafa',
                  zIndex: 4,
                  borderRight: '1px solid #f0f0f0',
                }}
              >
                <Checkbox checked={allRowsSelected} indeterminate={someRowsSelected} onChange={(e) => handleHeaderCheckboxChange(e.target.checked)} />
              </div>
            )}
            {virtualCols.map((vc) => {
              const col = leafColumns[vc.index]
              const sortDir = col.getIsSorted()
              return (
                <div
                  key={col.id}
                  style={{
                    position: 'absolute',
                    left: stickyOffset + vc.start,
                    top: 0,
                    width: vc.size,
                    height: headerHeight,
                    ...HEADER_CELL_STYLE,
                  }}
                  onClick={col.getCanSort() ? col.getToggleSortingHandler() : undefined}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {flexRender(col.columnDef.header, { column: col, header: col as never, table })}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#bfbfbf', fontSize: 12 }}>
                    {sortDir === 'asc' && <CaretUpOutlined style={{ color: '#3F51B5' }} />}
                    {sortDir === 'desc' && <CaretDownOutlined style={{ color: '#3F51B5' }} />}
                    {!sortDir && col.getCanSort() && <SwapOutlined rotate={90} />}
                    {showColumnFilter && <ColumnFilterPopover<T> column={col} />}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Body rows */}
          {virtualRows.map((vr) => {
            const row = rows[vr.index]
            const isSelected = rowSelection[row.id] === true
            return (
              <BodyRow
                key={row.id}
                top={headerHeight + vr.start}
                height={vr.size}
                totalWidth={stickyOffset + totalWidth}
                showSelection={showSelection}
                showRowNumber={showRowNumber}
                rowNumber={vr.index + 1}
                rowNumW={rowNumW}
                isSelected={isSelected}
                onToggle={(checked) => row.toggleSelected(checked)}
                virtualCols={virtualCols.map((vc) => {
                  const col = leafColumns[vc.index]
                  const value = row.getValue<string | number>(col.id)
                  const meta = col.columnDef.meta as
                    | { kind?: ColumnKind; render?: (value: string | number, row: T) => React.ReactNode; align?: 'left' | 'center' | 'right' }
                    | undefined
                  const kind = meta?.kind ?? 'string'
                  const background = kind === 'number' && typeof value === 'number' ? pickBackground(value, numberBuckets, numberColors) : undefined
                  const rendered = meta?.render ? meta.render(value, row.original) : undefined
                  return {
                    key: col.id,
                    left: stickyOffset + vc.start,
                    width: vc.size,
                    value,
                    kind,
                    background,
                    rendered,
                    align: meta?.align,
                  }
                })}
                renderCell={renderCell}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const HEADER_CELL_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px',
  fontWeight: 500,
  fontSize: 13,
  cursor: 'pointer',
  borderRight: '1px solid #f0f0f0',
  userSelect: 'none',
}

interface BodyRowCellInfo {
  key: string
  left: number
  width: number
  value: string | number
  kind: ColumnKind
  background?: string
  rendered?: React.ReactNode
  align?: 'left' | 'center' | 'right'
}

interface BodyRowProps {
  top: number
  height: number
  totalWidth: number
  showSelection: boolean
  showRowNumber: boolean
  rowNumber: number
  rowNumW: number
  isSelected: boolean
  onToggle: (checked: boolean) => void
  virtualCols: BodyRowCellInfo[]
  renderCell?: (value: string) => React.ReactNode
}

const BodyRow = memo(function BodyRow({
  top,
  height,
  totalWidth,
  showSelection,
  showRowNumber,
  rowNumber,
  rowNumW,
  isSelected,
  onToggle,
  virtualCols,
  renderCell,
}: BodyRowProps) {
  return (
    <div style={{ position: 'absolute', top, left: 0, width: totalWidth, height }}>
      {showRowNumber && (
        <div
          style={{
            position: 'sticky',
            left: 0,
            width: ROW_NUM_W,
            height,
            display: 'inline-flex',
            verticalAlign: 'top',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSelected ? '#e6f4ff' : '#fff',
            zIndex: 1,
            borderBottom: '1px solid #f0f0f0',
            borderRight: '1px solid #f0f0f0',
            fontSize: 12,
            color: '#8c8c8c',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {rowNumber}
        </div>
      )}
      {showSelection && (
        <div
          style={{
            position: 'sticky',
            left: rowNumW,
            width: CHECKBOX_W,
            height,
            display: 'inline-flex',
            verticalAlign: 'top',
            alignItems: 'center',
            justifyContent: 'center',
            background: isSelected ? '#e6f4ff' : '#fff',
            zIndex: 1,
            borderBottom: '1px solid #f0f0f0',
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <Checkbox checked={isSelected} onChange={(e) => onToggle(e.target.checked)} />
        </div>
      )}
      {virtualCols.map((vc) => {
        const baseBackground = isSelected ? '#e6f4ff' : '#fff'
        const cellBackground = vc.background ?? baseBackground
        const isNumber = vc.kind === 'number'
        const align = vc.align ?? (isNumber ? 'right' : 'left')
        const justify = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'
        const content = vc.rendered !== undefined ? vc.rendered : isNumber ? String(vc.value) : renderCell ? renderCell(String(vc.value)) : String(vc.value)
        return (
          <div
            key={vc.key}
            style={{
              position: 'absolute',
              left: vc.left,
              top: 0,
              width: vc.width,
              height,
              display: 'flex',
              alignItems: 'center',
              justifyContent: justify,
              padding: '0 12px',
              background: cellBackground,
              borderBottom: '1px solid #f0f0f0',
              borderRight: '1px solid #f5f5f5',
              fontSize: 13,
              fontVariantNumeric: isNumber ? 'tabular-nums' : undefined,
              fontWeight: isNumber ? 500 : undefined,
            }}
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}) as (props: BodyRowProps) => React.JSX.Element
