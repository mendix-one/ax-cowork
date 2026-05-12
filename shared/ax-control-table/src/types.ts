import type { TableProps, TableColumnType } from 'antd'
import type { FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface'
import type { Key } from 'react'

/** Extended column definition with visibility control. */
export interface ControlTableColumn<T = unknown> extends TableColumnType<T> {
  /** Unique key for this column (required for visibility control). */
  key: Key
  /** Whether the column is visible. Defaults to `true`. */
  visible?: boolean
  /** Whether the user can toggle this column's visibility. Defaults to `true`. */
  toggleable?: boolean
}

/** Pagination state managed by the table. */
export interface ControlTablePagination {
  current: number
  pageSize: number
  total?: number
}

/** Sort state managed by the table. */
export interface ControlTableSort<T = unknown> {
  field: keyof T | string | undefined
  order: 'ascend' | 'descend' | undefined
}

/** Filter state managed by the table. */
export type ControlTableFilters = Record<string, FilterValue | null>

/** Callback payload emitted on every table state change. */
export interface ControlTableChangeEvent<T = unknown> {
  pagination: ControlTablePagination
  filters: ControlTableFilters
  sorter: SorterResult<T> | SorterResult<T>[]
}

/** Props for `<AxControlTable>`. */
export interface AxControlTableProps<T extends object = Record<string, unknown>>
  extends Omit<TableProps<T>, 'columns' | 'onChange' | 'pagination' | 'title'> {
  /** Column definitions with visibility control. */
  columns: ControlTableColumn<T>[]

  /** Controlled pagination state. Pass `false` to disable pagination. */
  pagination?: ControlTablePagination | false

  /** Controlled sort state. */
  sort?: ControlTableSort<T>

  /** Controlled filter state. */
  filters?: ControlTableFilters

  /** Fired whenever pagination, sorting, or filtering changes. */
  onChange?: (event: ControlTableChangeEvent<T>) => void

  /** Fired when column visibility changes. Returns the full column array with updated `visible` flags. */
  onColumnsChange?: (columns: ControlTableColumn<T>[]) => void

  /** Show the column-visibility toggle dropdown. Defaults to `true`. */
  showColumnToggle?: boolean

  /** Placeholder text for the column-toggle search input. */
  columnToggleSearchPlaceholder?: string

  /** Title displayed above the table (left side of the toolbar). */
  title?: React.ReactNode

  /** Extra toolbar content rendered to the right of the column toggle. */
  toolbar?: React.ReactNode

  /** Loading state. */
  loading?: boolean
}

/** Re-export antd types consumers will commonly need. */
export type { TablePaginationConfig, FilterValue, SorterResult }
