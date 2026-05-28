import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import ReactGantt, { type BatchChanges, type GanttConfig } from '@dhx/react-gantt'
import '@dhx/react-gantt/dist/react-gantt.css'
import { useMpsContext } from '../../stores/mps.context'
import type { SimulationTaskRow } from '../../stores/simulation.store'

// Build per-row prefix label rendered inside the `text` column.
// Update 3: keep priority chip; HOT chip / overload chip removed.
const renderTaskText = (task: SimulationTaskRow): string => {
  if (task.rowKind === 'po') {
    const pri = `<span class="ax-mps-simulation-chip ax-mps-simulation-chip__pri-${task.priority?.toLowerCase()}">${task.priority}</span>`
    return `<span class="ax-mps-simulation-po-text">${task.id}</span> <span class="ax-mps-simulation-muted">${task.customerShort ?? ''}</span> ${pri}`
  }
  if (task.rowKind === 'family') {
    const pri = `<span class="ax-mps-simulation-chip ax-mps-simulation-chip__pri-${task.priority?.toLowerCase()}">${task.priority}</span>`
    return `<span class="ax-mps-simulation-family-text">${task.text}</span> <span class="ax-mps-simulation-muted">${task.techCode ?? ''}</span> ${pri}`
  }
  // batch
  const note = task.note ? ` <span class="ax-mps-simulation-muted">${task.note}</span>` : ''
  return `<span class="ax-mps-simulation-batch-text">${task.text}</span> <span class="ax-mps-simulation-muted">${task.waferCount ?? '?'} wafers</span>${note}`
}

const fmtDate = (date?: Date) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const MpsSimulationChart = observer(() => {
  const simulation = useMpsContext().simulation

  const config = useMemo<GanttConfig>(
    () => ({
      date_format: '%Y-%m-%d',
      start_date: new Date(simulation.startDate),
      end_date: new Date(new Date(simulation.endDate).getTime() + 24 * 60 * 60 * 1000),
      scale_height: 50,
      row_height: 28,
      bar_height: 20,
      columns: [
        {
          name: 'text',
          label: 'Production Order / Family / Batch',
          tree: true,
          width: 240,
          resize: true,
          template: renderTaskText as unknown as (task: unknown) => string,
        },
        { name: 'start_date', label: 'Start Date', align: 'center', width: 100 },
        { name: 'end_date', label: 'End Date', align: 'center', width: 100 },
      ],
      scales: [
        { unit: 'month', step: 1, format: '%F %Y' },
        { unit: 'day', step: 1, format: '%d' },
      ],
      grid_resizer_column_attribute: 'gridResizer',
    }),
    [simulation.startDate, simulation.endDate],
  )

  const tasks = simulation.dhxTasks
  // Today + milestone markers come from the store now.
  const markers = simulation.dhxMarkers

  // Bar class = schedule class + row kind + PO-band (Update 3: replaces lot-status / hot-lot classes).
  // The `ax-mps-simulation-poband__{a|b}` class alternates per PO so SCSS can zebra-band the timeline rows by group —
  // makes it obvious where one Production Order ends and the next begins, without printing a separator row.
  const rowBandClass = (task: SimulationTaskRow) => {
    const band = task.poIndex % 2 === 0 ? 'a' : 'b'
    return `ax-mps-simulation-poband__${band} ax-mps-simulation-poband-row__${task.rowKind}`
  }
  const templates = useMemo(
    () => ({
      task_class: (_start: Date, _end: Date, task: SimulationTaskRow) =>
        `ax-mps-simulation-row ax-mps-simulation-row__${task.scheduleClass} ax-mps-simulation-row__${task.rowKind} ${rowBandClass(task)}`,
      // Full-row zebra (timeline side) + accent rule for PO rows that mark a new group.
      task_row_class: (_start: Date, _end: Date, task: SimulationTaskRow) => rowBandClass(task),
      // Same alternation in the left grid so banding lines up perfectly across the splitter.
      grid_row_class: (_start: Date, _end: Date, task: SimulationTaskRow) => rowBandClass(task),
      task_text: (_start: Date, _end: Date, task: SimulationTaskRow) => {
        if (task.rowKind === 'batch' && task.note) return `${task.text} · ${task.note}`
        return task.text
      },
      tooltip_text: (start: Date, end: Date, task: SimulationTaskRow) =>
        `<b>${task.text}</b><br/>${fmtDate(start)} → ${fmtDate(end)}${task.note ? `<br/>${task.note}` : ''}`,
    }),
    [],
  )

  // dhx hands us a BatchChanges payload after each drag/resize. We translate update actions on batch tasks
  // (id format `${familyId}::${batchId}`) into a store mutation; the cascade recomputes PF/PO spans.
  const dataHandler = useMemo(
    () => ({
      batchSave: (changes: BatchChanges) => {
        for (const change of changes.tasks ?? []) {
          if (change.action !== 'update' && change.action !== 'edit') continue
          const id = String(change.id)
          if (!id.includes('::')) continue // skip PO / family updates — they're computed from children
          const [familyId, batchId] = id.split('::')
          const data = change.data as { start_date?: Date | string; end_date?: Date | string } | undefined
          if (!data?.start_date || !data?.end_date) continue
          const start = data.start_date instanceof Date ? data.start_date : new Date(data.start_date)
          const end = data.end_date instanceof Date ? data.end_date : new Date(data.end_date)
          simulation.rescheduleBatch(familyId, batchId, start, end)
        }
      },
    }),
    [simulation],
  )

  return (
    <div className="ax-mps-simulation_chart">
      <ReactGantt tasks={tasks} links={[]} markers={markers} config={config} templates={templates} theme="terrace" data={dataHandler} />
    </div>
  )
})
