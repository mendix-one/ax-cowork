import type { Key, ReactNode } from 'react'

/** Cell value type — affects rendering (numeric cells get color-coded backgrounds, right-aligned, tabular-nums). */
export type ColumnKind = 'number' | 'string'

/** Column definition for `<AxControlTable>`. */
export interface ControlTableColumn<T> {
  /** Stable column id; used as React key and TanStack column id. */
  key: string
  /** Header label (string for sort/click — pass a render prop via `headerRender` for custom JSX). */
  title: string
  /** Pull the cell value from a row. Returning `number` for numeric columns enables auto color-bucket background. */
  accessor: (row: T) => string | number
  /** Allow click-to-sort on this column. Defaults to `true`. */
  sortable?: boolean
  /** Cell kind. `'number'` triggers color-bucket backgrounds + right-aligned tabular-nums rendering. Defaults to `'string'`. */
  kind?: ColumnKind
  /** Pixel width. Defaults to the table's `defaultColumnWidth` (160). */
  width?: number
  /** Per-column custom render. If set, takes precedence over the table's `renderCell`. */
  render?: (value: string | number, row: T) => ReactNode
  /** Cell text alignment. Defaults to `'left'` for string kind, `'right'` for number kind. */
  align?: 'left' | 'center' | 'right'
}

/** Optional thresholds for numeric column color-bucket backgrounds. */
export interface NumberBucketThresholds {
  /** Value `> high` → `colorHigh` background. */
  high: number
  /** Value `>= low` and `<= high` → `colorMid` background. */
  low: number
}

/** Custom color mapping for numeric column backgrounds. Pass any RGBA/HEX. */
export interface NumberBucketColors {
  high: string
  mid: string
  low: string
}

/** Props for `<AxControlTable>`. */
export interface AxControlTableProps<T> {
  /** Row data. */
  data: T[]
  /** Column definitions. */
  columns: ControlTableColumn<T>[]
  /** Stable identity per row (used for selection state and React keys). */
  rowKey: (row: T) => Key
  /** Controlled selection — set of selected row keys. */
  selectedKeys?: Key[]
  /** Fired when selection changes (checkbox click, header select-all). */
  onSelectionChange?: (keys: Key[]) => void
  /** Custom render for string cells. Numeric cells are always rendered as plain numbers. */
  renderCell?: (value: string) => ReactNode
  /** Numeric color-bucket thresholds. Defaults to `{ high: 10, low: 5 }`. */
  numberBuckets?: NumberBucketThresholds
  /** Numeric color-bucket background colors. Defaults to AntD-aligned tints (error/success/secondary). */
  numberColors?: NumberBucketColors
  /** Default column width if `column.width` not set. Defaults to 160. */
  defaultColumnWidth?: number
  /** Row height in pixels. Defaults to 32. */
  rowHeight?: number
  /** Header height in pixels. Defaults to 36. */
  headerHeight?: number
  /** Show the column-toggle button at the top-right of the grid. Defaults to `true`. */
  showColumnToggle?: boolean
  /** Show per-column filter dropdown in headers. Defaults to `true`. */
  showColumnFilter?: boolean
  /** Show a sticky-left row-number column ("#"). Reflects visible position (1-based) after sort/filter. Defaults to `false`. */
  showRowNumber?: boolean
}
