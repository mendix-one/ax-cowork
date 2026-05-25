import { useMemo, type ReactElement } from 'react'
import ReactGantt, { type GanttConfig } from '@dhx/react-gantt'
import '@dhx/react-gantt/dist/react-gantt.css'
import type { AxGanttContainerProps } from '../typings/AxGanttProps'
import './ui/AxGantt.css'

type Task = {
  id: number
  text: string
  start_date: string
  duration: number
  parent?: number
  progress?: number
  open?: boolean
}

type Link = {
  id: number
  source: number
  target: number
  type: string
}

const DEFAULT_TASKS: Task[] = [
  { id: 1, text: 'Project plan', start_date: '2026-05-01', duration: 18, progress: 0.6, open: true },
  { id: 2, text: 'Discovery', start_date: '2026-05-01', duration: 5, parent: 1, progress: 1 },
  { id: 3, text: 'Design', start_date: '2026-05-06', duration: 6, parent: 1, progress: 0.7 },
  { id: 4, text: 'Implementation', start_date: '2026-05-12', duration: 8, parent: 1, progress: 0.3 },
  { id: 5, text: 'QA & rollout', start_date: '2026-05-20', duration: 4, parent: 1, progress: 0 },
]

const DEFAULT_LINKS: Link[] = [
  { id: 1, source: 2, target: 3, type: '0' },
  { id: 2, source: 3, target: 4, type: '0' },
  { id: 3, source: 4, target: 5, type: '0' },
]

const DEFAULT_CONFIG: GanttConfig = {
  date_format: '%Y-%m-%d',
  scale_height: 50,
  row_height: 28,
  bar_height: 18,
  scales: [
    { unit: 'month', step: 1, format: '%F %Y' },
    { unit: 'day', step: 1, format: '%j %D' },
  ],
  columns: [
    { name: 'text', label: 'Task', tree: true, width: 200 },
    { name: 'start_date', label: 'Start', align: 'center', width: 90 },
    { name: 'duration', label: 'Days', align: 'center', width: 60 },
  ],
}

const parseJson = <T,>(value: string | undefined, fallback: T): { value: T; error: string | null } => {
  if (!value || value.trim().length === 0) {
    return { value: fallback, error: null }
  }

  try {
    return { value: JSON.parse(value) as T, error: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown JSON parse error'
    return { value: fallback, error: message }
  }
}

export function AxGantt(props: AxGanttContainerProps): ReactElement {
  const tasksResult = useMemo(() => parseJson<Task[]>(props.tasksJson, DEFAULT_TASKS), [props.tasksJson])
  const linksResult = useMemo(() => parseJson<Link[]>(props.linksJson, DEFAULT_LINKS), [props.linksJson])
  const configResult = useMemo(() => parseJson<Partial<GanttConfig>>(props.configJson, {}), [props.configJson])

  const config = useMemo<GanttConfig>(() => {
    return {
      ...DEFAULT_CONFIG,
      ...configResult.value,
    }
  }, [configResult.value])

  const height = props.height?.trim() || '100%'

  return (
    <div className={`ax-gantt ${props.class ?? ''}`.trim()} style={props.style} tabIndex={props.tabIndex}>
      {(tasksResult.error || linksResult.error || configResult.error) && (
        <div className="ax-gantt__error">
          {tasksResult.error ? <div>Invalid tasksJson: {tasksResult.error}</div> : null}
          {linksResult.error ? <div>Invalid linksJson: {linksResult.error}</div> : null}
          {configResult.error ? <div>Invalid configJson: {configResult.error}</div> : null}
          <div>Fallback sample data is being used.</div>
        </div>
      )}
      <div className="ax-gantt__canvas" style={{ height }}>
        <ReactGantt tasks={tasksResult.value} links={linksResult.value} config={config} />
      </div>
    </div>
  )
}
