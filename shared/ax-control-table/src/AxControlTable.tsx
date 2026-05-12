import { useMemo, useRef, useState, useLayoutEffect } from 'react'
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
  showColumnToggle = false,
  columnToggleSearchPlaceholder,
  loading,
  className,
  ...restProps
}: AxControlTableProps<T>) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState<number | undefined>(undefined)

  // Measure available height and subtract header + pagination to get body scroll height
  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const measure = () => {
      const containerH = el.clientHeight
      const header = el.querySelector<HTMLElement>('.ant-table-thead')
      const paginationEl = el.querySelector<HTMLElement>('.ant-table-pagination')
      const headerH = header?.offsetHeight ?? 0
      const paginationH = paginationEl ? paginationEl.offsetHeight + 16 : 0
      const body = containerH - headerH - paginationH
      if (body > 0) setScrollY(body)
    }

    // Measure after first paint
    const frame = requestAnimationFrame(measure)

    const observer = new ResizeObserver(measure)
    observer.observe(el)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  // Filter to visible columns and apply controlled sort/filter state
  const resolvedColumns = useMemo(() => {
    const cols = columns
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

    // Append column-toggle as last header column
    if (showColumnToggle && onColumnsChange) {
      cols.push({
        key: '__ax_col_toggle__',
        width: 40,
        fixed: 'right',
        title: () => <ColumnToggle<T> columns={columns} onColumnsChange={onColumnsChange} searchPlaceholder={columnToggleSearchPlaceholder} />,
        render: () => null,
      } as ControlTableColumn<T>)
    }

    return cols
  }, [columns, sort, filters, showColumnToggle, onColumnsChange, columnToggleSearchPlaceholder])

  // Map controlled pagination to antd format
  const antPagination: TablePaginationConfig | false = useMemo(() => {
    if (pagination === false) return false
    if (!pagination) return false
    return {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
      showSizeChanger: true,
      size: 'small' as const,
      showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} of ${total}`,
    }
  }, [pagination])

  const handleChange = (pag: TablePaginationConfig, flt: Record<string, FilterValue | null>, srt: SorterResult<T> | SorterResult<T>[]) => {
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

  return (
    <div ref={wrapRef} className={`ax-control-table${className ? ` ${className}` : ''}`} style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <Table<T>
        {...restProps}
        columns={resolvedColumns}
        pagination={antPagination}
        loading={loading}
        onChange={handleChange}
        sticky
        scroll={{ x: 'max-content', y: scrollY }}
      />
    </div>
  )
}
