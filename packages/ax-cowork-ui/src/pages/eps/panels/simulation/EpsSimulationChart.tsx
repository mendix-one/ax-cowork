import { useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import ReactGantt, { type BatchChanges, type GanttConfig } from '@dhx/react-gantt'
import '@dhx/react-gantt/dist/react-gantt.css'
import { useEpsContext } from '../../stores/eps.context'
import type { SimulationTaskRow } from '../../stores/simulation.store'

// Per-row prefix label rendered inside the Gantt `text` column.
// Per Update-2 IA: 4 levels. PFG / PF rows are *summary* — no bar in the timeline (CSS hides the bar
// for rowKind=pfg|pf). Tasks (level 3) + Sub-Tasks (level 4) render bars.
const renderTaskText = (task: SimulationTaskRow): string => {
  if (task.rowKind === 'pfg') {
    return `<span class="ax-eps-simulation-pfg-text">${task.text}</span>`
  }
  if (task.rowKind === 'pf') {
    const biz = task.bizTeamCode ? ` <span class="ax-eps-simulation-muted">${task.bizTeamCode}</span>` : ''
    return `<span class="ax-eps-simulation-pf-text">${task.text}</span>${biz}`
  }
  if (task.rowKind === 'task') {
    const spm = task.spm != null ? ` <span class="ax-eps-simulation-chip">${task.spm} P/M</span>` : ''
    return `<span class="ax-eps-simulation-task-text">${task.text}</span>${spm}`
  }
  // subtask
  const kindChip = task.subTaskKind
    ? ` <span class="ax-eps-simulation-chip ax-eps-simulation-chip__sub-${task.subTaskKind.toLowerCase()}">${task.subTaskKind}</span>`
    : ''
  const spm = task.spm != null ? ` <span class="ax-eps-simulation-muted">${task.spm} P/M</span>` : ''
  return `<span class="ax-eps-simulation-subtask-text">${task.text}</span>${kindChip}${spm}`
}

// Standard MTO milestone column — only PF rows show a value, otherwise blank.
const renderMtoCell = (task: SimulationTaskRow): string => task.mto ?? ''

const fmtDate = (date?: Date) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const EpsSimulationChart = observer(() => {
  const simulation = useEpsContext().simulation

  const config = useMemo<GanttConfig>(
    () => ({
      date_format: '%Y-%m-%d',
      start_date: new Date(simulation.startDate),
      end_date: new Date(new Date(simulation.endDate).getTime() + 24 * 60 * 60 * 1000),
      scale_height: 48,
      row_height: 30,
      bar_height: 18,
      // Tight per-month column width so a 4-year horizon fits in ~1200px of timeline area.
      min_column_width: 44,
      columns: [
        // Col 1 — the IA tree: PFG ▸ PF ▸ Task ▸ Sub-Task.
        {
          name: 'text',
          label: 'Family Group / Family / Task / Sub-Task',
          tree: true,
          width: 300,
          resize: true,
          template: renderTaskText as unknown as (task: unknown) => string,
        },
        // Col 2 — Standard MTO Milestone (anchor per PF).
        {
          name: 'mto',
          label: 'MTO Anchor',
          align: 'center',
          width: 110,
          resize: true,
          template: renderMtoCell as unknown as (task: unknown) => string,
        },
      ],
      // Two-row scale: Year header, abbreviated month label below.
      scales: [
        { unit: 'year', step: 1, format: '%Y' },
        { unit: 'month', step: 1, format: '%M' },
      ],
      grid_resizer_column_attribute: 'gridResizer',
    }),
    [simulation.startDate, simulation.endDate],
  )

  const tasks = simulation.dhxTasks
  const markers = simulation.dhxMarkers

  // Row class composes schedule state + rowKind + PF zebra-band.
  // Critical: rowKind=pfg|pf get an extra `__no-bar` class — SCSS hides the bar div in those rows
  // so PFG / PF stay as visual *summary* rows without a Gantt segment.
  const rowBandClass = (task: SimulationTaskRow) => {
    const band = task.pfIndex % 2 === 0 ? 'a' : 'b'
    return `ax-eps-simulation-poband__${band} ax-eps-simulation-poband-row__${task.rowKind}`
  }
  const templates = useMemo(
    () => ({
      task_class: (_start: Date, _end: Date, task: SimulationTaskRow) => {
        const noBar = task.rowKind === 'pfg' || task.rowKind === 'pf' ? ' ax-eps-simulation-row__no-bar' : ''
        return `ax-eps-simulation-row ax-eps-simulation-row__${task.scheduleClass} ax-eps-simulation-row__${task.rowKind}${noBar} ${rowBandClass(task)}`
      },
      task_row_class: (_start: Date, _end: Date, task: SimulationTaskRow) => rowBandClass(task),
      grid_row_class: (_start: Date, _end: Date, task: SimulationTaskRow) => rowBandClass(task),
      task_text: (_start: Date, _end: Date, task: SimulationTaskRow) => task.text,
      tooltip_text: (start: Date, end: Date, task: SimulationTaskRow) => {
        if (task.rowKind === 'pfg' || task.rowKind === 'pf') return `<b>${task.text}</b>`
        const proc = task.processPathLabel ? `<br/>${task.processPathLabel}` : ''
        const spm = task.spm != null ? `<br/>${task.spm} person-months` : ''
        return `<b>${task.text}</b><br/>${fmtDate(start)} → ${fmtDate(end)}${proc}${spm}`
      },
    }),
    [],
  )

  // dhx batchSave → translate task / sub-task updates into store mutations.
  const dataHandler = useMemo(
    () => ({
      batchSave: (changes: BatchChanges) => {
        for (const change of changes.tasks ?? []) {
          if (change.action !== 'update' && change.action !== 'edit') continue
          const id = String(change.id)
          const data = change.data as { start_date?: Date | string; end_date?: Date | string } | undefined
          if (!data?.start_date || !data?.end_date) continue
          const start = data.start_date instanceof Date ? data.start_date : new Date(data.start_date)
          const end = data.end_date instanceof Date ? data.end_date : new Date(data.end_date)
          simulation.rescheduleTaskOrSub(id, start, end)
        }
      },
    }),
    [simulation],
  )

  return (
    <div className="ax-eps-simulation_chart">
      <ReactGantt tasks={tasks} links={[]} markers={markers} config={config} templates={templates} theme="terrace" data={dataHandler} />
    </div>
  )
})
