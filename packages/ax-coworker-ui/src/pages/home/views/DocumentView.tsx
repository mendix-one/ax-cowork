import { observer } from 'mobx-react-lite'
import { Tag, Typography } from 'antd'
import { AxControlTable, type ControlTableColumn } from '@ax-cowork/control-table'

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

const COLUMNS: ControlTableColumn<StackRow>[] = [
  { key: 'key', title: '#', accessor: (r) => r.key, width: 50 },
  { key: 'category', title: 'Category', accessor: (r) => r.category, width: 180 },
  { key: 'technology', title: 'Technology', accessor: (r) => r.technology, width: 220 },
  {
    key: 'score',
    title: 'Score',
    accessor: (r) => r.score,
    kind: 'number',
    width: 100,
    render: (v) => <Text strong>{(v as number).toFixed(1)}</Text>,
  },
  {
    key: 'runnerUp',
    title: 'Runner-up',
    accessor: (r) => r.runnerUp,
    width: 180,
    render: (v) => <Tag>{String(v)}</Tag>,
  },
  { key: 'status', title: 'Status', accessor: (r) => r.status, width: 80, align: 'center' },
]

export const DocumentView = observer(() => {
  return <AxControlTable<StackRow> data={stackData} columns={COLUMNS} rowKey={(row) => row.key} />
})
