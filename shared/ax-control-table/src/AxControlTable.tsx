import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { CSSProperties, Key, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { Checkbox, Empty } from 'antd'
import { CaretDownOutlined, CaretRightOutlined, CaretUpOutlined, SwapOutlined } from '@ant-design/icons'
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
import type { AxControlTableProps, ColumnKind, ControlTableSize, NumberBucketColors, NumberBucketThresholds, SelectionMode, TreeOptions } from './types'
import { ColumnFilterPopover, ColumnTogglePopover } from './GridPopovers'

const CHECKBOX_W = 48
const ROW_NUM_W = 56
const DEFAULT_COL_W = 160
const ROW_OVERSCAN = 20
const COL_OVERSCAN = 10
const DEFAULT_TREE_INDENT = 16

const DEFAULT_BUCKETS: NumberBucketThresholds = { high: 10, low: 5 }
// Default is no background. Numeric columns get tabular-nums + right-align, but the heatmap tint only kicks in
// when the consumer opts in by passing explicit `numberBuckets` + `numberColors`. The previous default painted
// every >10 value red, which is meaningless for raw counts (wafer counts, etc.) and was actively misleading.
const DEFAULT_COLORS: NumberBucketColors = {
  high: 'transparent',
  mid: 'transparent',
  low: 'transparent',
}

interface SizeMetrics {
  headerH: number
  rowH: number
  padX: number
}

const SIZE_METRICS: Record<ControlTableSize, SizeMetrics> = {
  small: { headerH: 32, rowH: 28, padX: 8 },
  middle: { headerH: 36, rowH: 32, padX: 12 },
  large: { headerH: 44, rowH: 40, padX: 16 },
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

interface ColumnMeta<T> {
  kind?: ColumnKind
  render?: (value: string | number, row: T) => ReactNode
  headerRender?: () => ReactNode
  align?: 'left' | 'center' | 'right'
  sticky?: 'left' | 'right'
}

export function AxControlTable<T>({
  data,
  columns,
  rowKey,
  selectedKeys,
  onSelectionChange,
  selectionMode,
  onRowClick,
  renderCell,
  rowClassName,
  rowStyle,
  tree,
  empty,
  size = 'middle',
  numberBuckets = DEFAULT_BUCKETS,
  numberColors = DEFAULT_COLORS,
  defaultColumnWidth = DEFAULT_COL_W,
  rowHeight,
  headerHeight,
  showColumnToggle = true,
  showColumnFilter = true,
  showRowNumber = false,
}: AxControlTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const sizeMetrics = SIZE_METRICS[size]
  const effHeaderH = headerHeight ?? sizeMetrics.headerH
  const effRowH = rowHeight ?? sizeMetrics.rowH
  const effPadX = sizeMetrics.padX

  // Derive the effective selection mode.
  // Legacy default: 'multi' when onSelectionChange is set, otherwise 'none'.
  const effSelectionMode: SelectionMode = selectionMode ?? (onSelectionChange ? 'multi' : 'none')
  const showCheckboxColumn = effSelectionMode === 'multi'

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
        // Per-column filter enable, gated by the table-level switch. Default `true` so the global
        // flag turns filters on for every column unless a column explicitly opts out (or the tune
        // popover does it dynamically).
        enableColumnFilter: showColumnFilter && col.filterable !== false,
        filterFn: startsWithAnyFilter as FilterFn<T>,
        size: col.width ?? defaultColumnWidth,
        meta: { kind: col.kind ?? 'string', render: col.render, headerRender: col.headerRender, align: col.align, sticky: col.sticky } satisfies ColumnMeta<T>,
      })),
    [columns, defaultColumnWidth, showColumnFilter],
  )

  const emitSelection = useCallback(
    (next: RowSelectionState) => {
      if (!onSelectionChange) return
      const keys: Key[] = []
      for (const [k, v] of Object.entries(next)) {
        if (v) keys.push(k)
      }
      onSelectionChange(keys)
    },
    [onSelectionChange],
  )

  const handleSelectionChange = useCallback(
    (updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      emitSelection(next)
    },
    [rowSelection, emitSelection],
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
    enableRowSelection: effSelectionMode !== 'none' && !!onSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const rows = table.getRowModel().rows
  const leafColumns = table.getVisibleLeafColumns()

  // Partition columns: sticky-left → flow → sticky-right. Sticky columns are kept out of the
  // virtualizer (they're always on-screen) and rendered with `position: sticky` instead.
  const { stickyLeftCols, flowCols, stickyRightCols, stickyLeftWidth, stickyRightWidth } = useMemo(() => {
    const left: typeof leafColumns = []
    const flow: typeof leafColumns = []
    const right: typeof leafColumns = []
    for (const col of leafColumns) {
      const meta = col.columnDef.meta as ColumnMeta<T> | undefined
      if (meta?.sticky === 'left') left.push(col)
      else if (meta?.sticky === 'right') right.push(col)
      else flow.push(col)
    }
    const sumW = (cols: typeof leafColumns) => cols.reduce((s, c) => s + c.getSize(), 0)
    return {
      stickyLeftCols: left,
      flowCols: flow,
      stickyRightCols: right,
      stickyLeftWidth: sumW(left),
      stickyRightWidth: sumW(right),
    }
  }, [leafColumns])

  // Row-number + checkbox sticky chrome width (always pinned to left edge).
  const showSelection = showCheckboxColumn && !!onSelectionChange
  const selectionW = showSelection ? CHECKBOX_W : 0
  const rowNumW = showRowNumber ? ROW_NUM_W : 0
  const chromeLeftW = selectionW + rowNumW
  // Total left-pinned width = row-num + checkbox + sticky-left data columns
  const leftPinnedW = chromeLeftW + stickyLeftWidth

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => effRowH,
    overscan: ROW_OVERSCAN,
  })

  const colVirtualizer = useVirtualizer({
    count: flowCols.length,
    getScrollElement: () => containerRef.current,
    estimateSize: (idx) => flowCols[idx]?.getSize() ?? defaultColumnWidth,
    horizontal: true,
    overscan: COL_OVERSCAN,
  })

  const totalHeight = rowVirtualizer.getTotalSize()
  const flowTotalWidth = colVirtualizer.getTotalSize()
  const totalGridWidth = leftPinnedW + flowTotalWidth + stickyRightWidth
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

  // ---- tree column helpers ----------------------------------------------------------------------------------------
  // The "tree-bearing" column defaults to the first leaf column (sticky or flow). Callers can override
  // via `tree.columnId` — useful when col 1 is a selection-icon or row-chrome column that shouldn't
  // carry the chevron + indent. If the override doesn't match any leaf column, we fall back to the default.
  const treeColumnId = tree ? (tree.columnId && leafColumns.some((c) => c.id === tree.columnId) ? tree.columnId : (leafColumns[0]?.id ?? null)) : null
  const treeIndent = tree?.indent ?? DEFAULT_TREE_INDENT

  // Pre-compute sticky-left column left-offsets (cumulative from chromeLeftW).
  const stickyLeftOffsets = useMemo(() => {
    const out: number[] = []
    let acc = chromeLeftW
    for (const col of stickyLeftCols) {
      out.push(acc)
      acc += col.getSize()
    }
    return out
  }, [stickyLeftCols, chromeLeftW])

  // Pre-compute sticky-right column right-offsets (cumulative from right edge).
  const stickyRightOffsets = useMemo(() => {
    const out: number[] = []
    let acc = 0
    for (let i = stickyRightCols.length - 1; i >= 0; i--) {
      out[i] = acc
      acc += stickyRightCols[i].getSize()
    }
    return out
  }, [stickyRightCols])

  return (
    <div className="ax-ct" style={{ position: 'relative', height: '100%', width: '100%' }}>
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
            width: totalGridWidth,
            height: effHeaderH + Math.max(totalHeight, effRowH),
            // Visual cushion: zebra row bands so fast-scroll un-rendered area shows a soft pattern.
            backgroundImage: `repeating-linear-gradient(
              to bottom,
              #ffffff 0,
              #ffffff ${effRowH}px,
              #f4f4f4 ${effRowH}px,
              #f4f4f4 ${2 * effRowH}px
            )`,
            backgroundPosition: `0 ${effHeaderH}px`,
            backgroundRepeat: 'repeat',
          }}
        >
          {/* ===== HEADER ROW ============================================================================= */}
          <div
            className="ax-ct-header"
            style={{
              position: 'sticky',
              top: 0,
              height: effHeaderH,
              zIndex: 3,
              width: totalGridWidth,
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
                  height: effHeaderH,
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
                  height: effHeaderH,
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
            {/* sticky-left data column headers */}
            {stickyLeftCols.map((col, i) => (
              <HeaderCell
                key={col.id}
                col={col}
                table={table}
                showColumnFilter={showColumnFilter}
                padX={effPadX}
                style={{
                  position: 'sticky',
                  left: stickyLeftOffsets[i],
                  top: 0,
                  width: col.getSize(),
                  height: effHeaderH,
                  zIndex: 4,
                  background: '#fafafa',
                }}
              />
            ))}
            {/* virtualized (flow) headers */}
            {virtualCols.map((vc) => {
              const col = flowCols[vc.index]
              return (
                <HeaderCell
                  key={col.id}
                  col={col}
                  table={table}
                  showColumnFilter={showColumnFilter}
                  padX={effPadX}
                  style={{
                    position: 'absolute',
                    left: leftPinnedW + vc.start,
                    top: 0,
                    width: vc.size,
                    height: effHeaderH,
                  }}
                />
              )
            })}
            {/* sticky-right data column headers */}
            {stickyRightCols.map((col, i) => (
              <HeaderCell
                key={col.id}
                col={col}
                table={table}
                showColumnFilter={showColumnFilter}
                padX={effPadX}
                style={{
                  position: 'sticky',
                  right: stickyRightOffsets[i],
                  top: 0,
                  width: col.getSize(),
                  height: effHeaderH,
                  zIndex: 4,
                  background: '#fafafa',
                }}
              />
            ))}
          </div>

          {/* ===== BODY ROWS ============================================================================= */}
          {virtualRows.map((vr) => {
            const row = rows[vr.index]
            const isSelected = rowSelection[row.id] === true
            const userRowClass = rowClassName?.(row.original, vr.index)
            const userRowStyle = rowStyle?.(row.original, vr.index)
            return (
              <BodyRow<T>
                key={row.id}
                top={effHeaderH + vr.start}
                height={vr.size}
                totalWidth={totalGridWidth}
                row={row}
                rowIndex={vr.index}
                rowNumW={rowNumW}
                showSelection={showSelection}
                showRowNumber={showRowNumber}
                rowNumber={vr.index + 1}
                isSelected={isSelected}
                onToggle={(checked) => row.toggleSelected(checked)}
                onRowClick={onRowClick}
                selectionMode={effSelectionMode}
                emitSelection={emitSelection}
                userRowClass={userRowClass}
                userRowStyle={userRowStyle}
                stickyLeftCols={stickyLeftCols}
                stickyLeftOffsets={stickyLeftOffsets}
                stickyRightCols={stickyRightCols}
                stickyRightOffsets={stickyRightOffsets}
                virtualCols={virtualCols.map((vc) => ({ col: flowCols[vc.index], left: leftPinnedW + vc.start, width: vc.size }))}
                tree={tree}
                treeColumnId={treeColumnId}
                treeIndent={treeIndent}
                renderCell={renderCell}
                numberBuckets={numberBuckets}
                numberColors={numberColors}
                padX={effPadX}
              />
            )
          })}
        </div>

        {rows.length === 0 && (
          <div
            className="ax-ct-empty"
            style={{
              position: 'absolute',
              top: effHeaderH,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              background: 'rgba(255,255,255,0.6)',
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>{empty ?? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ===== HEADER CELL =================================================================================================
interface HeaderCellProps<T> {
  col: ReturnType<ReturnType<typeof useReactTable<T>>['getVisibleLeafColumns']>[number]
  table: ReturnType<typeof useReactTable<T>>
  showColumnFilter: boolean
  padX: number
  style: CSSProperties
}

function HeaderCell<T>({ col, table, showColumnFilter, padX, style }: HeaderCellProps<T>) {
  const meta = col.columnDef.meta as ColumnMeta<T> | undefined
  // headerRender takes over the cell — the consumer owns whatever's inside (icon button, custom
  // chrome, etc.). We still keep the cell's outer click handler off so the custom content can be
  // interactive without flipping the sort.
  if (meta?.headerRender) {
    return (
      <div style={{ ...HEADER_CELL_STYLE, padding: `0 ${padX}px`, cursor: 'default', justifyContent: 'center', ...style }}>
        {meta.headerRender()}
      </div>
    )
  }
  const sortDir = col.getIsSorted()
  return (
    <div
      style={{
        ...HEADER_CELL_STYLE,
        padding: `0 ${padX}px`,
        ...style,
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
        {showColumnFilter && col.getCanFilter() && <ColumnFilterPopover<T> column={col} />}
      </span>
    </div>
  )
}

const HEADER_CELL_STYLE: CSSProperties = {
  // inline-flex (not flex) + vertical-align:top so adjacent sticky cells flow side-by-side instead
  // of stacking. Block-level display would force a line break between consecutive sticky headers
  // (e.g. selection-icon + label), pushing the second header down by one header-height. For
  // absolutely positioned (flow) headers, inline-flex behaves identically to flex.
  display: 'inline-flex',
  verticalAlign: 'top',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontWeight: 500,
  fontSize: 13,
  cursor: 'pointer',
  borderRight: '1px solid #f0f0f0',
  userSelect: 'none',
}

// ===== BODY ROW ====================================================================================================
type LeafColumn<T> = ReturnType<ReturnType<typeof useReactTable<T>>['getVisibleLeafColumns']>[number]
interface FlowVirtualCol<T> {
  col: LeafColumn<T>
  left: number
  width: number
}

interface BodyRowProps<T> {
  top: number
  height: number
  totalWidth: number
  row: Row<T>
  rowIndex: number
  rowNumW: number
  showSelection: boolean
  showRowNumber: boolean
  rowNumber: number
  isSelected: boolean
  onToggle: (checked: boolean) => void
  onRowClick?: (row: T, index: number) => void
  selectionMode: SelectionMode
  emitSelection: (next: RowSelectionState) => void
  userRowClass?: string
  userRowStyle?: CSSProperties
  stickyLeftCols: LeafColumn<T>[]
  stickyLeftOffsets: number[]
  stickyRightCols: LeafColumn<T>[]
  stickyRightOffsets: number[]
  virtualCols: FlowVirtualCol<T>[]
  tree?: TreeOptions<T>
  treeColumnId: string | null
  treeIndent: number
  renderCell?: (value: string) => ReactNode
  numberBuckets: NumberBucketThresholds
  numberColors: NumberBucketColors
  padX: number
}

const BodyRowInner = function BodyRow<T>(props: BodyRowProps<T>) {
  const {
    top,
    height,
    totalWidth,
    row,
    rowIndex,
    rowNumW,
    showSelection,
    showRowNumber,
    rowNumber,
    isSelected,
    onToggle,
    onRowClick,
    selectionMode,
    emitSelection,
    userRowClass,
    userRowStyle,
    stickyLeftCols,
    stickyLeftOffsets,
    stickyRightCols,
    stickyRightOffsets,
    virtualCols,
    tree,
    treeColumnId,
    treeIndent,
    renderCell,
    numberBuckets,
    numberColors,
    padX,
  } = props

  const baseBackground = isSelected ? '#e6f4ff' : 'transparent'

  // Row-level click handler: single-select toggles selection; onRowClick fires alongside.
  // We mark interactive descendants (chevron, checkbox, filter popover trigger) with stopPropagation
  // so they don't bubble to this handler.
  const handleRowClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    // If the click originated in an interactive zone, ignore.
    if ((e.target as HTMLElement).closest('[data-ax-ct-stop="true"]')) return
    if (selectionMode === 'single') {
      const next: RowSelectionState = { [row.id]: true }
      emitSelection(next)
    }
    onRowClick?.(row.original, rowIndex)
  }

  const rowIsClickable = selectionMode === 'single' || !!onRowClick

  return (
    <div
      className={['ax-ct-row', isSelected ? 'ax-ct-row__selected' : '', userRowClass ?? ''].filter(Boolean).join(' ')}
      style={{
        position: 'absolute',
        top,
        left: 0,
        width: totalWidth,
        height,
        cursor: rowIsClickable ? 'pointer' : undefined,
        ...(userRowStyle ?? {}),
      }}
      onClick={rowIsClickable ? handleRowClick : undefined}
    >
      {showRowNumber && (
        <RowChromeCell left={0} width={ROW_NUM_W} height={height} background={isSelected ? '#e6f4ff' : '#fff'}>
          <span style={{ fontSize: 12, color: '#8c8c8c', fontVariantNumeric: 'tabular-nums' }}>{rowNumber}</span>
        </RowChromeCell>
      )}
      {showSelection && (
        <RowChromeCell left={rowNumW} width={CHECKBOX_W} height={height} background={isSelected ? '#e6f4ff' : '#fff'}>
          <span data-ax-ct-stop="true">
            <Checkbox checked={isSelected} onChange={(e) => onToggle(e.target.checked)} />
          </span>
        </RowChromeCell>
      )}
      {/* sticky-left data cells */}
      {stickyLeftCols.map((col, i) => (
        <BodyCell<T>
          key={col.id}
          col={col}
          row={row}
          left={stickyLeftOffsets[i]}
          width={col.getSize()}
          height={height}
          background={baseBackground}
          isSticky
          tree={treeColumnId === col.id ? tree : undefined}
          treeIndent={treeIndent}
          renderCell={renderCell}
          numberBuckets={numberBuckets}
          numberColors={numberColors}
          padX={padX}
        />
      ))}
      {/* virtualized data cells */}
      {virtualCols.map((vc) => (
        <BodyCell<T>
          key={vc.col.id}
          col={vc.col}
          row={row}
          left={vc.left}
          width={vc.width}
          height={height}
          background={baseBackground}
          tree={treeColumnId === vc.col.id ? tree : undefined}
          treeIndent={treeIndent}
          renderCell={renderCell}
          numberBuckets={numberBuckets}
          numberColors={numberColors}
          padX={padX}
        />
      ))}
      {/* sticky-right data cells */}
      {stickyRightCols.map((col, i) => (
        <BodyCell<T>
          key={col.id}
          col={col}
          row={row}
          right={stickyRightOffsets[i]}
          width={col.getSize()}
          height={height}
          background={baseBackground}
          isSticky
          stickySide="right"
          tree={treeColumnId === col.id ? tree : undefined}
          treeIndent={treeIndent}
          renderCell={renderCell}
          numberBuckets={numberBuckets}
          numberColors={numberColors}
          padX={padX}
        />
      ))}
    </div>
  )
}

// Memoize generically: BodyRowInner's type param T does not survive memo's typing, so cast.
const BodyRow = memo(BodyRowInner) as <T>(props: BodyRowProps<T>) => React.JSX.Element

// ===== ROW CHROME CELL (row-number / checkbox) =====================================================================
interface RowChromeCellProps {
  left: number
  width: number
  height: number
  background: string
  children: ReactNode
}

const RowChromeCell = ({ left, width, height, background, children }: RowChromeCellProps) => (
  <div
    style={{
      position: 'sticky',
      left,
      width,
      height,
      display: 'inline-flex',
      verticalAlign: 'top',
      alignItems: 'center',
      justifyContent: 'center',
      background,
      zIndex: 1,
      borderBottom: '1px solid #f0f0f0',
      borderRight: '1px solid #f0f0f0',
    }}
  >
    {children}
  </div>
)

// ===== BODY CELL ===================================================================================================
interface BodyCellProps<T> {
  col: LeafColumn<T>
  row: Row<T>
  left?: number
  right?: number
  width: number
  height: number
  background: string
  isSticky?: boolean
  stickySide?: 'left' | 'right'
  tree?: TreeOptions<T>
  treeIndent: number
  renderCell?: (value: string) => ReactNode
  numberBuckets: NumberBucketThresholds
  numberColors: NumberBucketColors
  padX: number
}

function BodyCell<T>({
  col,
  row,
  left,
  right,
  width,
  height,
  background,
  isSticky = false,
  stickySide = 'left',
  tree,
  treeIndent,
  renderCell,
  numberBuckets,
  numberColors,
  padX,
}: BodyCellProps<T>) {
  const meta = col.columnDef.meta as ColumnMeta<T> | undefined
  const kind = meta?.kind ?? 'string'
  const value = row.getValue<string | number>(col.id)
  const numericBg = kind === 'number' && typeof value === 'number' ? pickBackground(value, numberBuckets, numberColors) : undefined
  const align = meta?.align ?? (kind === 'number' ? 'right' : 'left')
  const justify = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'
  const rendered = meta?.render ? meta.render(value, row.original) : undefined
  const fallback = kind === 'number' ? String(value) : renderCell ? renderCell(String(value)) : String(value)
  const content = rendered !== undefined ? rendered : fallback

  // Selected-row tint wins over the numeric color bucket so the row stays visually selected.
  const selectedBg = background !== 'transparent' ? background : undefined
  const cellBg = selectedBg ?? numericBg ?? '#fff'

  // Tree decoration: indent spacer + chevron, in front of the cell's content.
  let treePrefix: ReactNode = null
  if (tree) {
    const depth = tree.depth(row.original)
    const hasChildren = tree.hasChildren?.(row.original) ?? false
    const isExpanded = tree.isExpanded?.(row.original) ?? false
    const onToggle = tree.onToggle
    treePrefix = (
      <span style={{ display: 'inline-flex', alignItems: 'center', flex: '0 0 auto' }}>
        <span style={{ display: 'inline-block', width: depth * treeIndent }} />
        {hasChildren ? (
          <button
            type="button"
            className="ax-ct-tree-chevron"
            data-ax-ct-stop="true"
            onClick={(e) => {
              e.stopPropagation()
              onToggle?.(row.original)
            }}
            style={{
              width: 16,
              height: 16,
              padding: 0,
              border: 'none',
              background: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#595959',
            }}
          >
            {isExpanded ? <CaretDownOutlined style={{ fontSize: 10 }} /> : <CaretRightOutlined style={{ fontSize: 10 }} />}
          </button>
        ) : (
          <span style={{ display: 'inline-block', width: 16, height: 16 }} />
        )}
        <span style={{ display: 'inline-block', width: 4 }} />
      </span>
    )
  }

  const positionStyle: CSSProperties = isSticky
    ? stickySide === 'left'
      ? { position: 'sticky', left, zIndex: 2 }
      : { position: 'sticky', right, zIndex: 2 }
    : { position: 'absolute', left, top: 0 }

  return (
    <div
      className="ax-ct-cell"
      style={{
        ...positionStyle,
        ...(isSticky ? { top: 0 } : null),
        width,
        height,
        // inline-flex + vertical-align:top so adjacent sticky-left cells flow side-by-side. With
        // block `display: flex` a second sticky cell would wrap to a new line one rowHeight below.
        // Absolute (flow) cells are unaffected by the change.
        display: 'inline-flex',
        verticalAlign: 'top',
        alignItems: 'center',
        justifyContent: justify,
        padding: `0 ${padX}px`,
        background: cellBg,
        borderBottom: '1px solid #f0f0f0',
        borderRight: '1px solid #f5f5f5',
        fontSize: 13,
        fontVariantNumeric: kind === 'number' ? 'tabular-nums' : undefined,
        fontWeight: kind === 'number' ? 500 : undefined,
      }}
    >
      {treePrefix}
      <span style={{ flex: 1, minWidth: 0, display: 'inline-flex', alignItems: 'center', justifyContent: justify, overflow: 'hidden' }}>{content}</span>
    </div>
  )
}
