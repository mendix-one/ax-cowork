import type { DataNode } from 'antd/es/tree'

export type TaskItem = {
  id: string
  title: string
  status: 'todo' | 'doing' | 'done'
  priority: 'P1' | 'P2' | 'P3'
}

export type StackRow = {
  key: string
  category: string
  tech: string
  version: string
  runUp: string
  score: string
}

export type CommentItem = {
  id: string
  author: string
  initial: string
  body: string
  time: string
}

export const tasks: TaskItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `t-${i + 1}`,
  title: 'Sample task of change',
  status: i % 3 === 0 ? 'done' : i % 3 === 1 ? 'doing' : 'todo',
  priority: i % 2 === 0 ? 'P2' : 'P1',
}))

export const outlineTree: DataNode[] = [
  {
    title: 'Section name',
    key: 's1',
    children: [
      { title: 'Heading 1', key: 's1-h1' },
      { title: 'Heading 2', key: 's1-h2' },
    ],
  },
  {
    title: 'Section name',
    key: 's2',
    children: [
      { title: 'Heading 1', key: 's2-h1' },
      { title: 'Heading 2', key: 's2-h2' },
    ],
  },
  {
    title: 'Section name',
    key: 's3',
    children: [
      { title: 'Heading 1', key: 's3-h1' },
      { title: 'Heading 2', key: 's3-h2' },
      { title: 'Heading 3', key: 's3-h3' },
    ],
  },
  {
    title: 'Section name',
    key: 's4',
    children: [
      { title: 'Heading 1', key: 's4-h1' },
      { title: 'Heading 2', key: 's4-h2' },
    ],
  },
]

export const stack: StackRow[] = [
  { key: '1', category: 'Frontend Framework', tech: 'React 19 + Vite', version: '19.0', runUp: 'Vue 3', score: '9.2' },
  { key: '2', category: 'Backend (Node)', tech: 'NodeJS 20 + Fastify', version: '20.10', runUp: 'Express', score: '8.9' },
  { key: '3', category: 'Backend (Python)', tech: 'Python 3.12 + FastAPI', version: '3.12', runUp: 'Flask', score: '8.6' },
  { key: '4', category: 'Primary Database', tech: 'PostgreSQL', version: '16.2', runUp: 'MySQL 8', score: '9.4' },
  { key: '5', category: 'Time-Series DB', tech: 'TimescaleDB', version: '2.13', runUp: 'InfluxDB', score: '8.0' },
  { key: '6', category: 'Cache', tech: 'Redis', version: '7.2', runUp: 'Memcached', score: '8.8' },
  { key: '7', category: 'Search Engine', tech: 'Elasticsearch', version: '8.10', runUp: 'OpenSearch', score: '8.1' },
  { key: '8', category: 'Spec Visualization', tech: 'DHTMLX Gantt', version: '8.0', runUp: 'vis-timeline', score: '7.6' },
  { key: '9', category: 'Optimization Engine', tech: 'Google OR-Tools', version: '9.8', runUp: 'CPLEX *', score: '8.4' },
  { key: '10', category: 'Message Queue', tech: 'RabbitMQ', version: '3.12', runUp: 'Kafka', score: '8.3' },
  { key: '11', category: 'Container', tech: 'Docker + Compose', version: '24.0', runUp: 'Podman', score: '9.0' },
  { key: '12', category: 'Orchestration', tech: 'Kubernetes (GKE)', version: '1.27', runUp: 'Nomad', score: '8.7' },
  { key: '13', category: 'CI/CD', tech: 'GitHub Actions', version: '4', runUp: 'GitLab CI', score: '8.9' },
  { key: '14', category: 'Infrastructure (IaC)', tech: 'Terraform', version: '1.5', runUp: 'Pulumi', score: '8.5' },
  { key: '15', category: 'Monitoring', tech: 'Prometheus + Grafana', version: '2.45 / 10', runUp: 'Datadog *', score: '8.7' },
]

export const comments: CommentItem[] = [
  {
    id: 'c1',
    author: 'Lela K.',
    initial: 'L',
    body: 'Re: PostgreSQL — agreed on the JSONB choice, but flag the partitioning story before we commit.',
    time: '2h',
  },
  { id: 'c2', author: 'Marcus W.', initial: 'M', body: '@Lela good call. Adding a sub-section on partition keys.', time: '1h' },
  { id: 'c3', author: 'Priya N.', initial: 'P', body: 'Should we add a row for object storage? S3 vs GCS came up earlier.', time: '38m' },
  { id: 'c4', author: 'Marcus W.', initial: 'M', body: 'Yes — pulling that into row 16. Will note egress cost as a tiebreaker.', time: '12m' },
]
