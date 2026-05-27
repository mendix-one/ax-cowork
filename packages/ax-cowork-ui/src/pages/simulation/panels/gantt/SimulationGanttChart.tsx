import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import ReactGantt, { type BatchChanges, type GanttConfig } from '@dhx/react-gantt'
import '@dhx/react-gantt/dist/react-gantt.css'
import { useSimulationContext } from '../../store/simulation.context'
import type { GanttTaskRow } from './gantt.store'

// Build per-row prefix label rendered inside the `text` column.
// Update 3: keep priority chip; HOT chip / overload chip removed.
const renderTaskText = (task: GanttTaskRow): string => {
  if (task.rowKind === 'po') {
    const pri = `<span class="ax-gantt-chip ax-gantt-chip__pri-${task.priority?.toLowerCase()}">${task.priority}</span>`
    return `<span class="ax-gantt-po-text">${task.id}</span> <span class="ax-gantt-muted">${task.customerShort ?? ''}</span> ${pri}`
  }
  if (task.rowKind === 'family') {
    const pri = `<span class="ax-gantt-chip ax-gantt-chip__pri-${task.priority?.toLowerCase()}">${task.priority}</span>`
    return `<span class="ax-gantt-family-text">${task.text}</span> <span class="ax-gantt-muted">${task.techCode ?? ''}</span> ${pri}`
  }
  // batch
  const note = task.note ? ` <span class="ax-gantt-muted">${task.note}</span>` : ''
  return `<span class="ax-gantt-batch-text">${task.text}</span> <span class="ax-gantt-muted">${task.waferCount ?? '?'} wafers</span>${note}`
}

const fmtDate = (date?: Date) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const SimulationGanttChart = observer(() => {
  const gantt = useSimulationContext().gantt

  const config = useMemo<GanttConfig>(
    () => ({
      date_format: '%Y-%m-%d',
      start_date: new Date(gantt.startDate),
      end_date: new Date(new Date(gantt.endDate).getTime() + 24 * 60 * 60 * 1000),
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
    [gantt.startDate, gantt.endDate],
  )

  const tasks = gantt.dhxTasks
  // Today + milestone markers come from the store now.
  const markers = gantt.dhxMarkers

  // Bar class = schedule class + row kind (Update 3: replaces lot-status / hot-lot classes).
  const templates = useMemo(
    () => ({
      task_class: (_start: Date, _end: Date, task: GanttTaskRow) => `ax-gantt-row ax-gantt-row__${task.scheduleClass} ax-gantt-row__${task.rowKind}`,
      task_text: (_start: Date, _end: Date, task: GanttTaskRow) => {
        if (task.rowKind === 'batch' && task.note) return `${task.text} · ${task.note}`
        return task.text
      },
      tooltip_text: (start: Date, end: Date, task: GanttTaskRow) =>
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
          gantt.rescheduleBatch(familyId, batchId, start, end)
        }
      },
    }),
    [gantt],
  )

  return (
    <div className="ax-gantt_chart">
      <ReactGantt tasks={tasks} links={[]} markers={markers} config={config} templates={templates} theme="terrace" data={dataHandler} />
    </div>
  )
})
