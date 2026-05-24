import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import ReactGantt, { type GanttConfig } from '@dhx/react-gantt'
import '@dhx/react-gantt/dist/react-gantt.css'

type Task = { id: number; text: string; start_date: string; duration: number; parent?: number; progress?: number; open?: boolean }
type Link = { id: number; source: number; target: number; type: string }
import { AxDisplayPanel, type MainPanelControls } from '@/shared/display-panel/AxDisplayPanel.tsx'

const SimulationGanttTools = observer(() => {
  return (
    <>
      <div>left</div>
      <div>right</div>
    </>
  )
})

const TASKS: Task[] = [
  { id: 1, text: 'Project plan', start_date: '2026-05-01', duration: 18, progress: 0.6, open: true },
  { id: 2, text: 'Discovery', start_date: '2026-05-01', duration: 5, parent: 1, progress: 1 },
  { id: 3, text: 'Design', start_date: '2026-05-06', duration: 6, parent: 1, progress: 0.7 },
  { id: 4, text: 'Implementation', start_date: '2026-05-12', duration: 8, parent: 1, progress: 0.3 },
  { id: 5, text: 'QA & rollout', start_date: '2026-05-20', duration: 4, parent: 1, progress: 0 },
]

const LINKS: Link[] = [
  { id: 1, source: 2, target: 3, type: '0' },
  { id: 2, source: 3, target: 4, type: '0' },
  { id: 3, source: 4, target: 5, type: '0' },
]

export const SimulationGanttPanel = observer((props: MainPanelControls) => {
  const config: GanttConfig = useMemo(
    () => ({
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
    }),
    [],
  )

  return (
    <AxDisplayPanel type="main" icon="mdiChartGantt" title="Plan A (Simulation)" tools={<SimulationGanttTools />} {...props}>
      <div style={{ height: '100%', width: '100%' }}>
        <ReactGantt tasks={TASKS} links={LINKS} config={config} />
      </div>
    </AxDisplayPanel>
  )
})
