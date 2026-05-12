import { useState, useCallback } from 'react'
import { Tag, Typography, theme } from 'antd'
import { AxControlTable } from '@ax-cowork/control-table'
import type { ControlTableColumn, ControlTablePagination, ControlTableSort, ControlTableFilters, ControlTableChangeEvent } from '@ax-cowork/control-table'
import { stack, type StackRow } from '../data'

const { Text } = Typography

const categories = [...new Set(stack.map((r) => r.category))]

const initialColumns: ControlTableColumn<StackRow>[] = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
    width: 50,
    fixed: 'left',
    toggleable: false,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 180,
    fixed: 'left',
    filters: categories.map((c) => ({ text: c, value: c })),
    onFilter: (value, record) => record.category === value,
  },
  {
    title: 'Tech Stack',
    dataIndex: 'tech',
    key: 'tech',
    width: 220,
    fixed: 'left',
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
    width: 110,
    sorter: (a, b) => a.version.localeCompare(b.version),
  },
  {
    title: 'Run-up',
    dataIndex: 'runUp',
    key: 'runUp',
    width: 160,
    render: (v: string) => <Tag>{v}</Tag>,
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    width: 100,
    align: 'right' as const,
    sorter: (a, b) => parseFloat(a.score) - parseFloat(b.score),
    render: (v: string) => <Text strong>{v}</Text>,
  },
]

export function ControlTablePanel() {
  const { token } = theme.useToken()

  const [columns, setColumns] = useState<ControlTableColumn<StackRow>[]>(initialColumns)
  const [pagination, setPagination] = useState<ControlTablePagination>({ current: 1, pageSize: 20, total: stack.length })
  const [sort, setSort] = useState<ControlTableSort<StackRow>>({ field: undefined, order: undefined })
  const [filters, setFilters] = useState<ControlTableFilters>({})

  const handleChange = useCallback((event: ControlTableChangeEvent<StackRow>) => {
    setPagination(event.pagination)
    setFilters(event.filters)

    const srt = Array.isArray(event.sorter) ? event.sorter[0] : event.sorter
    setSort({ field: srt?.field as string | undefined, order: srt?.order ?? undefined })
  }, [])

  const handleColumnsChange = useCallback((next: ControlTableColumn<StackRow>[]) => {
    setColumns(next)
  }, [])

  return (
    <section className="panel" style={{ background: token.colorBgContainer }}>
      <AxControlTable<StackRow>
        columns={columns}
        dataSource={stack}
        pagination={pagination}
        sort={sort}
        filters={filters}
        onChange={handleChange}
        onColumnsChange={handleColumnsChange}
        showColumnToggle
        size="small"
        bordered
        rowKey="key"
      />
    </section>
  )
}
