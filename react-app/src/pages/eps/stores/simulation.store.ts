import { makeAutoObservable } from 'mobx'
import {
  HORIZON_DATES,
  HORIZON_LABELS,
  HORIZON_MONTH_GROUPS,
  HORIZON_TODAY,
  MOCK_FAMILIES_BY_PFG,
  MOCK_PRODUCTION_FAMILIES,
  milestonesForFamily,
  type EngineeringSubTask,
  type EngineeringTask,
  type MilestoneState,
  type MtoMilestone,
  type ProductionFamily,
  type ProductionFamilyGroup,
  type ScheduleClass,
} from '../data/mock-plan'
import { SCHEDULE_COLOR } from '../helpers/simulation-styles'

// ============================================================================================
// dhx-react-gantt row & marker shapes
// ============================================================================================

// rowKind drives both the SCSS class and whether a bar should render.
// Per Update-2 spec: level 1 (pfg) and level 2 (pf) are summary rows — NO bar in the timeline.
// Bars are only drawn for level 3 (task) and level 4 (subtask).
export type SimulationRowKind = 'pfg' | 'pf' | 'task' | 'subtask'

export type SimulationTaskRow = {
  id: string
  text: string
  start_date: string
  end_date?: string
  duration?: number
  parent?: string
  type?: 'project' | 'task'
  open?: boolean
  color?: string
  progress?: number
  rowKind: SimulationRowKind
  scheduleClass: ScheduleClass
  // dhx respects `readonly: true` to lock a task from drag/resize. PFG/PF rollups and `fixed`
  // (already running) sub-tasks are locked.
  readonly?: boolean
  // The "Standard MTO Milestone" column (Col 2 in the spec). Only PF rows carry a string value;
  // task / sub-task / pfg rows leave it blank.
  mto?: string
  // Index of the Production Family inside the filtered set — drives PO-band zebra striping.
  pfIndex: number
  // Extra fields surfaced to the bar / tooltip templates.
  pfgGroup?: ProductionFamilyGroup
  bizTeamCode?: string
  processPathLabel?: string
  subTaskKind?: EngineeringSubTask['kind']
  spm?: number
  ownerCellIds?: string[]
  note?: string
}

// Marker payload — Today + per-PF MTO milestones.
export type SimulationMarker = {
  id: string
  start_date: Date
  css: string
  text: string
  title: string
  state?: MilestoneState
}

// AntD Tree node shape — kept narrow so we don't have to depend on antd type exports here.
export type AdjustmentTreeNode = {
  key: string
  title: string
  disableCheckbox?: boolean
  children?: AdjustmentTreeNode[]
  isLeaf?: boolean
}

const scheduleColor = (cls: ScheduleClass) => SCHEDULE_COLOR[cls]

// MTO milestone summary for a PF — rendered in the Gantt sidebar Col 2.
const buildMtoColumnLabel = (pf: ProductionFamily): string => {
  const m = milestonesForFamily(pf.id).find((x) => x.offset === 0)
  if (!m) return ''
  return `MTO(0) · ${m.date.slice(0, 7)}`
}

// Multi-line tooltip for a MTO milestone marker.
const buildMilestoneTooltip = (pf: ProductionFamily, m: MtoMilestone): string => {
  const parts = [`${pf.code} — ${m.label}`, `Date · ${m.date}`]
  if (m.cause) parts.push(`Cause · ${m.cause}`)
  if (m.slipDays) parts.push(`Slip · +${m.slipDays}d`)
  return parts.join('\n')
}

export type SimulationHorizon = 'day' | 'week' | 'month'

// Tree key conventions — `::` separators keep parsing trivial.
const pfgKey = (group: ProductionFamilyGroup) => `pfg::${group}`
const pfKey = (group: ProductionFamilyGroup, pfId: string) => `pf::${group}::${pfId}`
const tskKey = (group: ProductionFamilyGroup, pfId: string, taskId: string) => `task::${group}::${pfId}::${taskId}`
const subKey = (group: ProductionFamilyGroup, pfId: string, taskId: string, subId: string) => `sub::${group}::${pfId}::${taskId}::${subId}`

// "Running" = part of the locked-in / executing schedule.
const isSubRunning = (cls: ScheduleClass) => cls === 'fixed'

const collectAllKeys = (families: ProductionFamily[]): string[] => {
  const keys: string[] = []
  // We walk through the PFG-grouped families so the keys match what the adjustment tree emits.
  for (const { group, families: list } of MOCK_FAMILIES_BY_PFG) {
    keys.push(pfgKey(group))
    for (const pf of list) {
      keys.push(pfKey(group, pf.id))
      for (const t of pf.tasks) {
        keys.push(tskKey(group, pf.id, t.id))
        for (const s of t.subTasks) {
          keys.push(subKey(group, pf.id, t.id, s.id))
        }
      }
    }
  }
  // (`families` arg is the canonical set so the unused param check is satisfied)
  void families
  return keys
}

const ALL_TREE_KEYS = collectAllKeys(MOCK_PRODUCTION_FAMILIES)

export class SimulationStore {
  horizon: SimulationHorizon = 'month'
  // Default horizon — wide enough to cover the standard MTO-24 → MTO+18 window for the seeded PFs,
  // but tight enough that 1 month ≈ ~40px in a 1600px viewport. Older history (MTO-60) stays accessible
  // via scroll; the planner can also widen here when needed.
  startDate = '2025-01-01'
  endDate = '2029-06-30'

  filterSidebarOpen = true
  quickAnalysisOpen = true
  risksStripOpen = true

  // Applied adjustment — drives `filtered…` and the chart.
  checkedKeys: string[] = [...ALL_TREE_KEYS]
  // Pending adjustment — what the user is currently selecting in the sidebar.
  pendingCheckedKeys: string[] = [...ALL_TREE_KEYS]

  families: ProductionFamily[] = MOCK_PRODUCTION_FAMILIES
  horizonLabels: string[] = HORIZON_LABELS
  horizonDates: string[] = HORIZON_DATES
  horizonMonthGroups = HORIZON_MONTH_GROUPS
  today: string = HORIZON_TODAY

  // Expansion sets — every PFG / PF / Task open by default so the planner sees the full tree.
  expandedPfgKeys = new Set<string>(MOCK_FAMILIES_BY_PFG.map((g) => pfgKey(g.group)))
  expandedPfIds = new Set<string>(MOCK_PRODUCTION_FAMILIES.map((p) => p.id))
  expandedTaskIds = new Set<string>(MOCK_PRODUCTION_FAMILIES.flatMap((p) => p.tasks.map((t) => t.id)))

  private historyCount = 0
  private futureCount = 0

  constructor() {
    makeAutoObservable(this)
  }

  setHorizon(value: SimulationHorizon) {
    this.horizon = value
  }

  setStartDate(value: string) {
    this.startDate = value
  }

  setEndDate(value: string) {
    this.endDate = value
  }

  toggleFilterSidebar() {
    this.filterSidebarOpen = !this.filterSidebarOpen
    if (this.filterSidebarOpen) {
      this.pendingCheckedKeys = [...this.checkedKeys]
    }
  }

  toggleQuickAnalysis() {
    this.quickAnalysisOpen = !this.quickAnalysisOpen
  }

  toggleRisksStrip() {
    this.risksStripOpen = !this.risksStripOpen
  }

  setPendingCheckedKeys(keys: string[]) {
    this.pendingCheckedKeys = keys
  }

  applyAdjustment() {
    this.checkedKeys = [...this.pendingCheckedKeys]
  }

  // One-shot include/exclude — used by quick actions outside the sidebar.
  setKeyIncluded(key: string, included: boolean) {
    const applied = new Set(this.checkedKeys)
    const pending = new Set(this.pendingCheckedKeys)
    if (included) {
      applied.add(key)
      pending.add(key)
    } else {
      applied.delete(key)
      pending.delete(key)
    }
    this.checkedKeys = Array.from(applied)
    this.pendingCheckedKeys = Array.from(pending)
  }

  resetAdjustment() {
    this.pendingCheckedKeys = [...ALL_TREE_KEYS]
    this.checkedKeys = [...ALL_TREE_KEYS]
  }

  get hasPendingAdjustmentChanges(): boolean {
    if (this.pendingCheckedKeys.length !== this.checkedKeys.length) return true
    const applied = new Set(this.checkedKeys)
    return this.pendingCheckedKeys.some((k) => !applied.has(k))
  }

  // ---- Running-state helpers ----
  // A node is "running" if its OWN scheduleClass is 'fixed'. We deliberately do NOT cascade
  // from children — a PF in 'changes' state still has editable children that the planner needs
  // to be able to uncheck, even if one of its tasks is already locked in.
  isTaskRunning(taskId: string): boolean {
    for (const pf of this.families) {
      const t = pf.tasks.find((x) => x.id === taskId)
      if (!t) continue
      return t.scheduleClass === 'fixed'
    }
    return false
  }

  isFamilyRunning(pfId: string): boolean {
    return this.families.find((p) => p.id === pfId)?.scheduleClass === 'fixed'
  }

  // ---- Adjustment tree -------------------------------------------------------
  // 4 levels: Production Family Group → Production Family → Task → Sub-Task.
  // Per-spec the PFG row is a non-checkable grouping header (disableCheckbox=true) so the planner
  // can collapse a whole group but cannot mass-exclude. PF/Task/SubTask are checkable, with running
  // nodes disabled (their scheduleClass is 'fixed').
  get adjustmentTreeData(): AdjustmentTreeNode[] {
    return MOCK_FAMILIES_BY_PFG.map(({ group, families }) => ({
      key: pfgKey(group),
      title: `${group} Production Family Group`,
      // PFG itself is a header — checkbox stays disabled.
      disableCheckbox: true,
      children: families.map((pf) => ({
        key: pfKey(group, pf.id),
        title: `${pf.code} · ${pf.name}`,
        disableCheckbox: this.isFamilyRunning(pf.id),
        children: pf.tasks.map((t) => ({
          key: tskKey(group, pf.id, t.id),
          title: `${t.code} · ${t.name}`,
          disableCheckbox: this.isTaskRunning(t.id),
          children: t.subTasks.map((s) => ({
            key: subKey(group, pf.id, t.id, s.id),
            title: `${s.kind} · ${s.name}`,
            disableCheckbox: isSubRunning(s.scheduleClass),
            isLeaf: true,
          })),
        })),
      })),
    }))
  }

  // ---- Filtered production families -----------------------------------------
  // A SubTask appears if its sub key is in checkedKeys.
  // A Task appears if any of its sub-tasks appears (and its task key is in checkedKeys).
  // A PF appears if any of its tasks appears.
  get filteredFamiliesByPfg(): { group: ProductionFamilyGroup; families: ProductionFamily[] }[] {
    const checked = new Set(this.checkedKeys)
    const out: { group: ProductionFamilyGroup; families: ProductionFamily[] }[] = []
    for (const { group, families } of MOCK_FAMILIES_BY_PFG) {
      const visibleFams: ProductionFamily[] = []
      for (const pf of families) {
        if (!checked.has(pfKey(group, pf.id))) continue
        const visibleTasks: EngineeringTask[] = []
        for (const t of pf.tasks) {
          if (!checked.has(tskKey(group, pf.id, t.id))) continue
          const visibleSubs = t.subTasks.filter((s) => checked.has(subKey(group, pf.id, t.id, s.id)))
          // Task remains visible even when it has no checked sub-tasks (the Task itself is the planning unit).
          visibleTasks.push({ ...t, subTasks: visibleSubs })
        }
        if (visibleTasks.length === 0) continue
        visibleFams.push({ ...pf, tasks: visibleTasks })
      }
      if (visibleFams.length > 0) out.push({ group, families: visibleFams })
    }
    return out
  }

  get filteredFamilies(): ProductionFamily[] {
    return this.filteredFamiliesByPfg.flatMap((g) => g.families)
  }

  // ---- dhx flat task list (PFG → PF → Task → SubTask) ------------------------
  get dhxTasks(): SimulationTaskRow[] {
    const out: SimulationTaskRow[] = []
    let pfIndex = 0
    for (const { group, families } of this.filteredFamiliesByPfg) {
      const pfgRowKey = pfgKey(group)
      // PFG header row — no bar, just structure.
      out.push({
        id: pfgRowKey,
        text: `${group} Production Family Group`,
        start_date: this.startDate,
        end_date: this.endDate,
        type: 'project',
        open: this.expandedPfgKeys.has(pfgRowKey),
        rowKind: 'pfg',
        scheduleClass: 'fixed',
        readonly: true,
        pfgGroup: group,
        pfIndex,
      })
      for (const pf of families) {
        // PF summary row — no bar; carries the MTO column value.
        out.push({
          id: pf.id,
          text: `${pf.code} · ${pf.name}`,
          start_date: pf.tasks[0]?.start ?? this.startDate,
          end_date: pf.tasks[pf.tasks.length - 1]?.end ?? this.endDate,
          type: 'project',
          parent: pfgRowKey,
          open: this.expandedPfIds.has(pf.id),
          rowKind: 'pf',
          scheduleClass: pf.scheduleClass,
          color: scheduleColor(pf.scheduleClass),
          readonly: true,
          mto: buildMtoColumnLabel(pf),
          pfgGroup: group,
          bizTeamCode: pf.bizTeamId,
          pfIndex,
        })
        for (const t of pf.tasks) {
          out.push({
            id: t.id,
            text: `${t.code} · ${t.name}`,
            start_date: t.start,
            end_date: t.end,
            duration: t.durationDays,
            type: 'project',
            parent: pf.id,
            open: this.expandedTaskIds.has(t.id),
            rowKind: 'task',
            scheduleClass: t.scheduleClass,
            color: scheduleColor(t.scheduleClass),
            readonly: t.scheduleClass === 'fixed',
            spm: t.spm,
            ownerCellIds: t.ownerCellIds,
            processPathLabel: t.processPath.join(' / '),
            pfIndex,
          })
          for (const s of t.subTasks) {
            out.push({
              id: `${t.id}::${s.id}`,
              text: `${s.kind} · ${s.name}`,
              start_date: s.start,
              end_date: s.end,
              duration: s.durationDays,
              type: 'task',
              parent: t.id,
              rowKind: 'subtask',
              scheduleClass: s.scheduleClass,
              color: scheduleColor(s.scheduleClass),
              readonly: s.scheduleClass === 'fixed',
              subTaskKind: s.kind,
              spm: s.spm,
              ownerCellIds: s.ownerCellIds,
              note: s.note,
              pfIndex,
            })
          }
        }
        pfIndex += 1
      }
    }
    return out
  }

  // Today + MTO milestone markers (per filtered PF, at every standard offset).
  get dhxMarkers(): SimulationMarker[] {
    const out: SimulationMarker[] = [
      {
        id: 'today',
        start_date: new Date(this.today),
        css: 'ax-eps-simulation-today-marker',
        text: 'TODAY',
        title: `Today · ${this.today}`,
      },
    ]
    for (const pf of this.filteredFamilies) {
      for (const m of milestonesForFamily(pf.id)) {
        out.push({
          id: m.id,
          start_date: new Date(m.date),
          css: `ax-eps-simulation-milestone-marker ax-eps-simulation-milestone-marker__${m.state}`,
          text: `${pf.code} · ${m.label}`,
          title: buildMilestoneTooltip(pf, m),
          state: m.state,
        })
      }
    }
    return out
  }

  // ---- Expand / collapse helpers --------------------------------------------
  isPfgExpanded(key: string) {
    return this.expandedPfgKeys.has(key)
  }
  togglePfgExpanded(key: string) {
    if (this.expandedPfgKeys.has(key)) this.expandedPfgKeys.delete(key)
    else this.expandedPfgKeys.add(key)
  }
  isPfExpanded(id: string) {
    return this.expandedPfIds.has(id)
  }
  togglePfExpanded(id: string) {
    if (this.expandedPfIds.has(id)) this.expandedPfIds.delete(id)
    else this.expandedPfIds.add(id)
  }
  isTaskExpanded(id: string) {
    return this.expandedTaskIds.has(id)
  }
  toggleTaskExpanded(id: string) {
    if (this.expandedTaskIds.has(id)) this.expandedTaskIds.delete(id)
    else this.expandedTaskIds.add(id)
  }
  collapseAll() {
    this.expandedPfgKeys = new Set()
    this.expandedPfIds = new Set()
    this.expandedTaskIds = new Set()
  }
  expandAll() {
    this.expandedPfgKeys = new Set(MOCK_FAMILIES_BY_PFG.map((g) => pfgKey(g.group)))
    this.expandedPfIds = new Set(this.families.map((p) => p.id))
    this.expandedTaskIds = new Set(this.families.flatMap((p) => p.tasks.map((t) => t.id)))
  }

  // ---- Undo / redo / save (mock) --------------------------------------------
  get canUndo() {
    return this.historyCount > 0
  }
  get canRedo() {
    return this.futureCount > 0
  }
  get unsavedEditsCount() {
    return this.historyCount
  }
  undo() {
    if (this.historyCount > 0) {
      this.historyCount -= 1
      this.futureCount += 1
    }
  }
  redo() {
    if (this.futureCount > 0) {
      this.futureCount -= 1
      this.historyCount += 1
    }
  }
  markEdited() {
    this.historyCount += 1
    this.futureCount = 0
  }
  reset() {
    this.historyCount = 0
    this.futureCount = 0
    this.resetAdjustment()
    this.horizon = 'month'
  }
  save() {
    this.historyCount = 0
    this.futureCount = 0
  }

  // ---- Drag-to-reschedule cascade (Task / Sub-Task) -------------------------
  // dhx hands us batch task ids:
  //   • SubTask rows have id format `${taskId}::${subId}` — we resolve both and update the SubTask + cascade
  //     the parent Task window.
  //   • Task rows have id == task.id — we update the task window only when it isn't 'fixed'.
  rescheduleTaskOrSub(taskRowId: string, start: Date, end: Date) {
    const startStr = start.toISOString().slice(0, 10)
    const endStr = end.toISOString().slice(0, 10)
    const isSub = taskRowId.includes('::')
    if (isSub) {
      const [taskId, subId] = taskRowId.split('::')
      const pf = this.families.find((p) => p.tasks.some((t) => t.id === taskId))
      const task = pf?.tasks.find((t) => t.id === taskId)
      const sub = task?.subTasks.find((s) => s.id === subId)
      if (!task || !sub || sub.scheduleClass === 'fixed') return
      sub.start = startStr
      sub.end = endStr
      sub.durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)))
      if (sub.scheduleClass !== 'new') sub.scheduleClass = 'changes'
      // Cascade — task window may need to extend to wrap the sub.
      task.start = task.subTasks.reduce((a, s) => (s.start < a ? s.start : a), task.start)
      task.end = task.subTasks.reduce((a, s) => (s.end > a ? s.end : a), task.end)
      task.durationDays = Math.max(1, Math.round((new Date(task.end).getTime() - new Date(task.start).getTime()) / (24 * 60 * 60 * 1000)))
      if (task.scheduleClass !== 'new') task.scheduleClass = 'changes'
    } else {
      const pf = this.families.find((p) => p.tasks.some((t) => t.id === taskRowId))
      const task = pf?.tasks.find((t) => t.id === taskRowId)
      if (!task || task.scheduleClass === 'fixed') return
      task.start = startStr
      task.end = endStr
      task.durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)))
      if (task.scheduleClass !== 'new') task.scheduleClass = 'changes'
    }
    this.markEdited()
  }
}
