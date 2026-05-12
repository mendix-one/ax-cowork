import { useMemo } from 'react'
import { Table } from 'antd'
import { ColumnToggle } from './ColumnToggle'
import type { AxControlTableProps, ControlTableColumn, ControlTableChangeEvent } from './types'
import type { TablePaginationConfig, FilterValue, SorterResult } from 'antd/es/table/interface'

export function AxControlTable<T extends object = Record<string, unknown>>({
  columns,
  pagination,
  sort,
  filters,
  onChange,
  onColumnsChange,
  showColumnToggle = true,
  columnToggleSearchPlaceholder,
  title,
  toolbar,
  loading,
  ...restProps
}: AxControlTableProps<T>) {
  // Filter to visible columns and apply controlled sort/filter state
  const resolvedColumns = useMemo(() => {
    return columns
      .filter((col) => col.visible !== false)
      .map((col: ControlTableColumn<T>) => {
        const patched = { ...col }

        // Apply controlled sort
        if (sort && sort.field !== undefined && String(sort.field) === String(col.key as string | number)) {
          patched.sortOrder = sort.order
        } else if (sort) {
          patched.sortOrder = undefined
        }

        // Apply controlled filters
        const colKey = String(col.key)
        if (filters && colKey in filters) {
          patched.filteredValue = filters[colKey]
        }

        return patched
      })
  }, [columns, sort, filters])

  // Map controlled pagination to antd format
  const antPagination: TablePaginationConfig | false = useMemo(() => {
    if (pagination === false) return false
    if (!pagination) return false
    return {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      showSizeChanger: true,
      showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total}`,
    }
  }, [pagination])

  const handleChange = (
    pag: TablePaginationConfig,
    flt: Record<string, FilterValue | null>,
    srt: SorterResult<T> | SorterResult<T>[],
  ) => {
    if (!onChange) return

    const event: ControlTableChangeEvent<T> = {
      pagination: {
        current: pag.current ?? 1,
        pageSize: pag.pageSize ?? 10,
        total: pag.total,
      },
      filters: flt,
      sorter: srt,
    }
    onChange(event)
  }

  const hasToolbar = title || showColumnToggle || toolbar

  return (
    <div className="ax-control-table">
      {hasToolbar && (
        <div className="ax-control-table-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="ax-control-table-toolbar-left">{title}</div>
          <div className="ax-control-table-toolbar-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {toolbar}
            {showColumnToggle && onColumnsChange && (
              <ColumnToggle<T> columns={columns} onColumnsChange={onColumnsChange} searchPlaceholder={columnToggleSearchPlaceholder} />
            )}
          </div>
        </div>
      )}
      <Table<T> {...restProps} columns={resolvedColumns} pagination={antPagination} loading={loading} onChange={handleChange} />
    </div>
  )
}
