import type { CSSProperties, Key, ReactNode } from 'react'

/** Cell value type — affects rendering (numeric cells get color-coded backgrounds, right-aligned, tabular-nums). */
export type ColumnKind = 'number' | 'string'

/** Selection model.
 *   • 'none'   — no selection UI (no checkbox column, no header checkbox).
 *   • 'single' — at most one row selected; no checkbox column, selection is row-click driven.
 *   • 'multi'  — checkbox column + header check-all (the original behaviour).
 *
 * When unset, defaults to `'multi'` if `onSelectionChange` is passed, otherwise `'none'`.
 */
export type SelectionMode = 'none' | 'single' | 'multi'

/** Predefined size presets — affect default header/row heights and cell padding. */
export type ControlTableSize = 'small' | 'middle' | 'large'

/** Tree-row options. When passed, one column gets an indent + chevron prefix in the cell render
 *  slot. By default, the prefix attaches to the first leaf column. Pass `columnId` to attach it
 *  to a specific column instead — useful when the first column is a selection-icon or row-chrome
 *  column that should NOT carry the tree decoration. */
export interface TreeOptions<T> {
  /** Depth of the row in the tree (0 = root). */
  depth: (row: T) => number
  /** Whether the row has children. When false, a spacer is rendered in place of the chevron. */
  hasChildren?: (row: T) => boolean
  /** Whether the row is currently expanded. */
  isExpanded?: (row: T) => boolean
  /** Fired when the chevron is clicked. Caller mutates its own data and re-renders. */
  onToggle?: (row: T) => void
  /** Pixels per depth level. Defaults to 16. */
  indent?: number
  /** Override which column the tree chevron + indent attach to. Defaults to the first leaf column. */
  columnId?: string
}

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
  /** Show the per-column filter popover in the header for this column. Only meaningful when the
   *  table-level `showColumnFilter` is also true. Defaults to `true` (i.e. when the global flag
   *  is on, every column shows the filter unless explicitly disabled here). */
  filterable?: boolean
  /** Cell kind. `'number'` triggers color-bucket backgrounds + right-aligned tabular-nums rendering. Defaults to `'string'`. */
  kind?: ColumnKind
  /** Pixel width. Defaults to the table's `defaultColumnWidth` (160). */
  width?: number
  /** Per-column custom render. If set, takes precedence over the table's `renderCell`. */
  render?: (value: string | number, row: T) => ReactNode
  /** Custom header render. When set, replaces the default title text + sort indicator + filter
   *  popover in the header cell — the consumer fully owns that cell (useful for a column whose
   *  header is just an icon button, e.g. a "table tune" trigger on a selection column). */
  headerRender?: () => ReactNode
  /** Cell text alignment. Defaults to `'left'` for string kind, `'right'` for number kind. */
  align?: 'left' | 'center' | 'right'
  /** Freeze this column to the left or right edge during horizontal scroll.
   *  Multiple sticky columns stack in declaration order. */
  sticky?: 'left' | 'right'
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
  /** Fired when selection changes. For 'single' mode, this fires with a 0- or 1-key array. */
  onSelectionChange?: (keys: Key[]) => void
  /** Selection model. See {@link SelectionMode}. */
  selectionMode?: SelectionMode
  /** Fired when the user clicks anywhere on a row's body cells (not header, checkbox, chevron, or filter popover).
   *  Works alongside any selection mode. */
  onRowClick?: (row: T, index: number) => void
  /** Custom render for string cells. Numeric cells are always rendered as plain numbers. */
  renderCell?: (value: string) => ReactNode
  /** Per-row class name. Merged with the table's own row classes. */
  rowClassName?: (row: T, index: number) => string | undefined
  /** Per-row inline style. Merged on top of the table's own row inline styles. */
  rowStyle?: (row: T, index: number) => CSSProperties | undefined
  /** Tree-row support. When set, the first leaf column gets an indent + chevron prefix. */
  tree?: TreeOptions<T>
  /** Rendered as an overlay when `data` is empty. Defaults to a built-in "No data" placeholder. */
  empty?: ReactNode
  /** Predefined density preset. Affects default row/header height + cell padding.
   *  Explicit `rowHeight` / `headerHeight` props win when set. */
  size?: ControlTableSize
  /** Numeric color-bucket thresholds. Defaults to `{ high: 10, low: 5 }`. */
  numberBuckets?: NumberBucketThresholds
  /** Numeric color-bucket background colors. Defaults to AntD-aligned tints (error/success/secondary). */
  numberColors?: NumberBucketColors
  /** Default column width if `column.width` not set. Defaults to 160. */
  defaultColumnWidth?: number
  /** Row height in pixels. Overrides the `size` preset. Defaults derive from `size`. */
  rowHeight?: number
  /** Header height in pixels. Overrides the `size` preset. Defaults derive from `size`. */
  headerHeight?: number
  /** Show the column-toggle button at the top-right of the grid. Defaults to `true`. */
  showColumnToggle?: boolean
  /** Show per-column filter dropdown in headers. Defaults to `true`. */
  showColumnFilter?: boolean
  /** Show a sticky-left row-number column ("#"). Reflects visible position (1-based) after sort/filter. Defaults to `false`. */
  showRowNumber?: boolean
}
