import { useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Tag, Typography } from 'antd'
import { AxControlTable } from '@ax-cowork/control-table'
import type { ControlTableColumn, ControlTablePagination, ControlTableSort, ControlTableFilters, ControlTableChangeEvent } from '@ax-cowork/control-table'

const { Text } = Typography

type StackRow = {
  key: string
  category: string
  technology: string
  score: number
  runnerUp: string
  status: string
}

const stackData: StackRow[] = [
  { key: '1', category: 'Frontend Framework', technology: 'React 19 + Vite', score: 8.6, runnerUp: 'Vue.js 3', status: '✓' },
  { key: '2', category: 'Backend (AI)', technology: 'Python 3.11 + FastAPI', score: 8.7, runnerUp: 'Node.js 20', status: '✓' },
  { key: '3', category: 'Backend (Realtime)', technology: 'Node.js 20 + Express', score: 8.5, runnerUp: 'Elixir Phoenix', status: '✓' },
  { key: '4', category: 'Primary Database', technology: 'PostgreSQL 17', score: 8.9, runnerUp: 'MySQL 8', status: '✓' },
  { key: '5', category: 'Time-Series DB', technology: 'TimescaleDB 2', score: 8.7, runnerUp: 'InfluxDB', status: '✓' },
  { key: '6', category: 'Cache', technology: 'Redis 7', score: 9.1, runnerUp: 'Memcached', status: '✓' },
  { key: '7', category: 'Search Engine', technology: 'OpenSearch', score: 8.4, runnerUp: 'MeiliSearch', status: '✓' },
  { key: '8', category: 'Queue/Stream', technology: 'Apache Kafka', score: 8.6, runnerUp: 'NATS JetStream', status: '✓' },
  { key: '9', category: 'Background Jobs', technology: 'Sidekiq', score: 8.5, runnerUp: 'Celery', status: '✓' },
  { key: '10', category: 'Message Queue', technology: 'RabbitMQ 3.12', score: 8.4, runnerUp: 'NSQ', status: '✓' },
  { key: '11', category: 'CI/CD', technology: 'GitHub Actions + ArgoCD', score: 8.7, runnerUp: 'GitLab CI', status: '✓' },
  { key: '12', category: 'Infrastructure (IaC)', technology: 'Terraform', score: 9.0, runnerUp: 'Pulumi', status: '✓' },
  { key: '13', category: 'Monitoring', technology: 'Prometheus + Grafana', score: 8.9, runnerUp: 'Datadog', status: '✓' },
]

const categories = [...new Set(stackData.map((r) => r.category))]

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
    title: 'Technology',
    dataIndex: 'technology',
    key: 'technology',
    width: 220,
    fixed: 'left',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
    width: 100,
    align: 'right' as const,
    sorter: (a, b) => a.score - b.score,
    render: (v: number) => <Text strong>{v.toFixed(1)}</Text>,
  },
  {
    title: 'Runner-up',
    dataIndex: 'runnerUp',
    key: 'runnerUp',
    width: 180,
    render: (v: string) => <Tag>{v}</Tag>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    align: 'center' as const,
  },
]

export const DocumentView = observer(() => {
  const [columns, setColumns] = useState<ControlTableColumn<StackRow>[]>(initialColumns)
  const [pagination, setPagination] = useState<ControlTablePagination>({ current: 1, pageSize: 20, total: stackData.length })
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
    <AxControlTable<StackRow>
      columns={columns}
      dataSource={stackData}
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
  )
})
