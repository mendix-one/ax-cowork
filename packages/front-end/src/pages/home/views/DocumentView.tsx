import { observer } from 'mobx-react-lite'
import { Table, Collapse } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type StackRow = {
  key: string
  category: string
  technology: string
  score: number
  runnerUp: string
  status: string
}

const stackColumns: ColumnsType<StackRow> = [
  { title: 'Category', dataIndex: 'category', width: 180 },
  { title: 'Technology', dataIndex: 'technology', width: 220 },
  { title: 'Score', dataIndex: 'score', width: 70, render: (v: number) => v.toFixed(1) },
  { title: 'Runner-up', dataIndex: 'runnerUp', width: 180 },
  { title: 'Status', dataIndex: 'status', width: 70 },
]

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

const headingRow = (label: string) => <div className="pl-4 py-0.5 text-neutral-700 hover:text-neutral-900 cursor-pointer">{label}</div>

const renderOutline = () => (
  <Collapse
    bordered={false}
    ghost
    size="small"
    defaultActiveKey={['s2', 's4']}
    items={[
      { key: 's1', label: <span className="font-medium">Section name</span> },
      {
        key: 's2',
        label: <span className="font-medium">Section name</span>,
        children: (
          <>
            {headingRow('Heading 1')}
            {headingRow('Heading 2')}
            {headingRow('Heading 1')}
            {headingRow('Heading 2')}
          </>
        ),
      },
      { key: 's3', label: <span className="font-medium">Section name</span> },
      {
        key: 's4',
        label: <span className="font-medium">Section name</span>,
        children: (
          <>
            {headingRow('Heading 1')}
            {headingRow('Heading 2')}
            {headingRow('Heading 1')}
          </>
        ),
      },
      { key: 's5', label: <span className="font-medium">Section name</span> },
    ]}
  />
)

export const DocumentView = observer(() => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 border-r border-gray-300 overflow-auto px-1 py-2">
          <div className="px-2 py-1 font-bold text-neutral-800">Outline</div>
          {renderOutline()}
        </div>
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-lg font-bold mb-2">2. Technology Stack Selection</h2>
          <p className="text-neutral-700 mb-4 leading-relaxed">
            Each technology was evaluated against five weighted criteria: team expertise (20%), ecosystem maturity (20%), performance (20%), operational cost
            (20%), and community support (10%).
          </p>
          <Table size="small" pagination={false} bordered columns={stackColumns} dataSource={stackData} className="mb-4" />
          <h3 className="text-base font-bold mb-2">Selection Rationale Highlights</h3>
          <ul className="list-disc pl-5 text-neutral-700 space-y-2">
            <li>
              <strong>Polyglot backend:</strong> Python dominates ML workloads (TensorFlow, OR-Tools, SimPy) while Node.js handles I/O-bound integration and
              user services efficiently. Splitting by domain avoids forcing one runtime to do both.
            </li>
            <li>
              <strong>PostgreSQL:</strong> Using TimescaleDB as a PostgreSQL extension avoids operating a separate time-series database while delivering strong
              time-series query performance. One operational footprint, two data models.
            </li>
            <li>
              <strong>DHTMLX Gantt:</strong> The only mature JavaScript Gantt library with drag-and-drop editing, critical path evaluation, and resource
              loading.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
})
