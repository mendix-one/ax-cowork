import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import ReactGantt, { type GanttConfig } from '@dhx/react-gantt'
import '@dhx/react-gantt/dist/react-gantt.css'
import { useSimulationContext } from '../../store/simulation.context'
import type { GanttTaskRow } from './gantt.store'

// Bridge mock-plan `LotStatus` to a CSS class consumed by the DHTMLX bar template.
const statusClass = (status?: string) => `ax-gantt-row ax-gantt-row__${status ?? 'on-track'}`

// Build per-row prefix label rendered inside the `text` column.
const renderTaskText = (task: GanttTaskRow): string => {
  if (task.rowKind === 'po') {
    const hot = task.hot ? '<span class="ax-gantt-chip ax-gantt-chip__hot">★ HOT</span>' : ''
    const pri = `<span class="ax-gantt-chip ax-gantt-chip__pri-${task.priority?.toLowerCase()}">${task.priority}</span>`
    return `<span class="ax-gantt-po-text">${task.id}</span> <span class="ax-gantt-muted">${task.customerShort ?? ''}</span> ${hot} ${pri}`
  }
  if (task.rowKind === 'family') {
    const hot = task.hot ? '<span class="ax-gantt-chip ax-gantt-chip__hot">★ HOT</span>' : ''
    const pri = `<span class="ax-gantt-chip ax-gantt-chip__pri-${task.priority?.toLowerCase()}">${task.priority}</span>`
    return `<span class="ax-gantt-family-text">${task.text}</span> <span class="ax-gantt-muted">${task.techCode ?? ''}</span> ${hot} ${pri}`
  }
  if (task.rowKind === 'batch') {
    const note = task.note ? ` <span class="ax-gantt-muted">${task.note}</span>` : ''
    return `<span class="ax-gantt-batch-text">${task.text}</span> <span class="ax-gantt-muted">${task.waferCount ?? '?'} wafers</span>${note}`
  }
  // milestone
  return `<span class="ax-gantt-milestone-text">◆ ${task.text}</span>`
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
      row_height: 30,
      bar_height: 14,
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
        { unit: 'day', step: 1, format: '%d %D' },
      ],
      grid_resizer_column_attribute: 'gridResizer',
    }),
    [gantt.startDate, gantt.endDate],
  )

  const tasks = gantt.dhxTasks

  // Today vertical marker uses dhx's marker mechanism (start_date marker line).
  const markers = useMemo(
    () => [
      {
        id: 'today',
        start_date: new Date(gantt.today),
        css: 'ax-gantt-today-marker',
        text: 'TODAY',
        title: `Today · ${gantt.today}`,
      },
    ],
    [gantt.today],
  )

  // Cell colour + custom class per task (status, kind).
  const templates = useMemo(
    () => ({
      task_class: (_start: Date, _end: Date, task: GanttTaskRow) => `${statusClass(task.status)} ax-gantt-row__${task.rowKind}`,
      task_text: (_start: Date, _end: Date, task: GanttTaskRow) => {
        if (task.rowKind === 'batch' && task.note) return `${task.text} · ${task.note}`
        return task.text
      },
      tooltip_text: (start: Date, end: Date, task: GanttTaskRow) => {
        if (task.rowKind === 'milestone') {
          return `<b>${task.text}</b><br/>${fmtDate(start)}<br/>Shipment: ${task.shipmentWafers?.toLocaleString() ?? ''} wafers${task.slipDays ? `<br/>Slip +${task.slipDays}d · ${task.cause ?? ''}` : ''}`
        }
        return `<b>${task.text}</b><br/>${fmtDate(start)} → ${fmtDate(end)}${task.note ? `<br/>${task.note}` : ''}`
      },
    }),
    [],
  )

  return (
    <div className="ax-gantt_chart">
      <ReactGantt tasks={tasks} links={[]} markers={markers} config={config} templates={templates} theme="terrace" />
    </div>
  )
})
