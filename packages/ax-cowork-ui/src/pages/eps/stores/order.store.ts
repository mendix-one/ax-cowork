import { makeAutoObservable } from 'mobx'
import {
  MOCK_BIZ_TEAMS,
  MOCK_PRODUCTION_FAMILIES,
  PRODUCTION_FAMILY_GROUPS,
  type BizGroup,
  type BizTeam,
  type EngineeringSubTask,
  type EngineeringTask,
  type ProductionFamily,
  type ProductionFamilyGroup,
  type ScheduleClass,
} from '../data/mock-plan'
import { readJson, writeJson } from '@/acore/storage'

// Local date arithmetic helper.
const addDays = (start: string, days: number): string => {
  const d = new Date(start)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Production Requirements panel — operates on the BizGroup → BizTeam → PFG → PF → Task → SubTask
// tree. Status filter buckets by ScheduleClass (matches the simulation legend).
export type StatusFilter = 'all' | 'new' | 'changes' | 'fixed'

// Row kinds shown in the table. The first three levels (bizGroup / bizTeam / pfg) are pure rollups for
// browsing; pf / task / subTask are the editable planning units.
export type RowKind = 'bizGroup' | 'bizTeam' | 'pfg' | 'pf' | 'task' | 'subTask'

export type FlatRow = {
  key: string
  kind: RowKind
  depth: 0 | 1 | 2 | 3 | 4 | 5
  parentKey?: string
  expanded?: boolean
  hasChildren?: boolean
  // Display values
  label: string
  code?: string
  bizGroup?: BizGroup
  bizTeamName?: string
  pfgGroup?: ProductionFamilyGroup
  pfMtoAnchor?: string
  processPathLabel?: string
  subTaskKind?: EngineeringSubTask['kind']
  scheduleClass: ScheduleClass
  spm: number
  startDate?: string
  endDate?: string
  // Back-references for the info panel.
  pfId?: string
  taskId?: string
  subTaskId?: string
}

// ---- entity notes (list model) ------------------------------------------------------------------
export type PoNote = {
  id: string
  text: string
  createdAt: string
}
type PersistedEntityNotes = Record<string, PoNote[]>
const ENTITY_NOTES_STORAGE_KEY = 'ax.eps.entity-notes.v3'
const isPersistedEntityNotes = (v: unknown): v is PersistedEntityNotes => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  for (const list of Object.values(v as Record<string, unknown>)) {
    if (!Array.isArray(list)) return false
    for (const n of list) {
      const note = n as PoNote
      if (!note || typeof note !== 'object') return false
      if (typeof note.id !== 'string' || typeof note.text !== 'string' || typeof note.createdAt !== 'string') return false
    }
  }
  return true
}

// ---- table tune --------------------------------------------------------------
export type ColumnSticky = 'left' | 'right' | null
export type ColumnTune = {
  key: string
  label: string
  visible: boolean
  sortable: boolean
  filterable: boolean
  sticky: ColumnSticky
}

const PO_COLUMN_BASELINE: ColumnTune[] = [
  { key: '_select', label: 'Select', visible: true, sortable: false, filterable: false, sticky: 'left' },
  { key: 'label', label: 'Biz Group / Team / PFG / Family / Task / Sub-Task', visible: true, sortable: false, filterable: false, sticky: 'left' },
  { key: 'state', label: 'State', visible: true, sortable: false, filterable: false, sticky: 'left' },
  { key: 'bizTeam', label: 'Biz Team', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'processPath', label: 'Process Path', visible: true, sortable: false, filterable: false, sticky: null },
  { key: 'spm', label: 'SPM (P/M)', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'startDate', label: 'Start Date', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'endDate', label: 'End Date', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'mto', label: 'MTO Anchor', visible: true, sortable: true, filterable: false, sticky: null },
]

const BIZ_TEAM_BY_ID: Record<string, BizTeam> = Object.fromEntries(MOCK_BIZ_TEAMS.map((t) => [t.id, t]))
const familyTotalSpm = (pf: ProductionFamily): number =>
  pf.tasks.reduce((s, t) => s + t.spm + t.subTasks.reduce((ss, x) => ss + x.spm, 0), 0)
const taskTotalSpm = (t: EngineeringTask): number => t.spm + t.subTasks.reduce((ss, x) => ss + x.spm, 0)

// Find the earliest / latest date among a set of tasks (or subtasks).
const earliest = (vals: string[]): string => vals.reduce((a, v) => (v < a ? v : a), vals[0] ?? '')
const latest = (vals: string[]): string => vals.reduce((a, v) => (v > a ? v : a), vals[0] ?? '')

// Group tree: BizGroup → BizTeam → PFG → Production Family list (sourced from families).
type BizTeamBucket = { bizTeam: BizTeam; byPfg: { group: ProductionFamilyGroup; families: ProductionFamily[] }[] }
type BizGroupBucket = { bizGroup: BizGroup; teams: BizTeamBucket[] }

const buildTopology = (families: ProductionFamily[]): BizGroupBucket[] => {
  const byBizGroup = new Map<BizGroup, Map<string, ProductionFamily[]>>()
  for (const pf of families) {
    const team = BIZ_TEAM_BY_ID[pf.bizTeamId]
    if (!team) continue
    const g = byBizGroup.get(team.bizGroup) ?? new Map<string, ProductionFamily[]>()
    const list = g.get(team.id) ?? []
    list.push(pf)
    g.set(team.id, list)
    byBizGroup.set(team.bizGroup, g)
  }
  const out: BizGroupBucket[] = []
  for (const [bizGroup, teamMap] of byBizGroup) {
    const teams: BizTeamBucket[] = []
    for (const [teamId, pfs] of teamMap) {
      const team = BIZ_TEAM_BY_ID[teamId]
      if (!team) continue
      const byPfg: { group: ProductionFamilyGroup; families: ProductionFamily[] }[] = []
      for (const g of PRODUCTION_FAMILY_GROUPS) {
        const list = pfs.filter((p) => p.familyGroup === g)
        if (list.length > 0) byPfg.push({ group: g, families: list })
      }
      teams.push({ bizTeam: team, byPfg })
    }
    out.push({ bizGroup, teams })
  }
  return out
}

export class OrderStore {
  families: ProductionFamily[] = MOCK_PRODUCTION_FAMILIES

  // Toolbar
  statusFilter: StatusFilter = 'all'

  // Panel slots
  filterSidebarOpen = true
  infoPanelOpen = true

  // Tree expand state (default: expand everything so the planner sees the IA at first glance).
  expandedBizGroupKeys = new Set<string>()
  expandedBizTeamKeys = new Set<string>()
  expandedPfgKeys = new Set<string>()
  expandedPfIds = new Set<string>(MOCK_PRODUCTION_FAMILIES.map((p) => p.id))
  expandedTaskIds = new Set<string>(MOCK_PRODUCTION_FAMILIES.flatMap((p) => p.tasks.map((t) => t.id)))

  selectedRowKey: string | null = null

  tableTune: ColumnTune[] = PO_COLUMN_BASELINE.map((c) => ({ ...c }))

  // Entity notes (list). Persisted to localStorage; keys are namespaced ("pf::id", "task::id", "sub::id").
  private entityNotesStore: PersistedEntityNotes = readJson(ENTITY_NOTES_STORAGE_KEY, isPersistedEntityNotes) ?? {
    'pf::pf-flg-modap-1': [
      { id: 'seed-pf-1', text: 'Watch MTO(0) slip — PnR closure pending.', createdAt: '2026-05-10T08:30:00Z' },
    ],
  }

  private historyCount = 0
  private futureCount = 0

  constructor() {
    // Expand all biz groups / teams / pfgs by default so the table reads top-to-bottom on first paint.
    for (const bg of buildTopology(this.families)) {
      this.expandedBizGroupKeys.add(`bizGroup::${bg.bizGroup}`)
      for (const t of bg.teams) {
        this.expandedBizTeamKeys.add(`bizTeam::${t.bizTeam.id}`)
        for (const pfg of t.byPfg) {
          this.expandedPfgKeys.add(`pfg::${t.bizTeam.id}::${pfg.group}`)
        }
      }
    }
    makeAutoObservable(this)
  }

  // ---- toolbar setters -------------------------------------------------------
  setStatusFilter(value: StatusFilter) {
    this.statusFilter = value
  }

  // ---- panel slots -----------------------------------------------------------
  toggleFilterSidebar() {
    this.filterSidebarOpen = !this.filterSidebarOpen
  }

  toggleInfoPanel() {
    this.infoPanelOpen = !this.infoPanelOpen
  }

  closeInfoPanel() {
    this.infoPanelOpen = false
    this.selectedRowKey = null
  }

  // ---- tree expand / collapse ------------------------------------------------
  isBizGroupExpanded(key: string) {
    return this.expandedBizGroupKeys.has(key)
  }
  toggleBizGroupExpanded(key: string) {
    if (this.expandedBizGroupKeys.has(key)) this.expandedBizGroupKeys.delete(key)
    else this.expandedBizGroupKeys.add(key)
  }
  isBizTeamExpanded(key: string) {
    return this.expandedBizTeamKeys.has(key)
  }
  toggleBizTeamExpanded(key: string) {
    if (this.expandedBizTeamKeys.has(key)) this.expandedBizTeamKeys.delete(key)
    else this.expandedBizTeamKeys.add(key)
  }
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
    this.expandedBizGroupKeys = new Set()
    this.expandedBizTeamKeys = new Set()
    this.expandedPfgKeys = new Set()
    this.expandedPfIds = new Set()
    this.expandedTaskIds = new Set()
  }

  expandAll() {
    const topo = buildTopology(this.families)
    this.expandedBizGroupKeys = new Set(topo.map((b) => `bizGroup::${b.bizGroup}`))
    this.expandedBizTeamKeys = new Set(topo.flatMap((b) => b.teams.map((t) => `bizTeam::${t.bizTeam.id}`)))
    this.expandedPfgKeys = new Set(
      topo.flatMap((b) => b.teams.flatMap((t) => t.byPfg.map((g) => `pfg::${t.bizTeam.id}::${g.group}`))),
    )
    this.expandedPfIds = new Set(this.families.map((p) => p.id))
    this.expandedTaskIds = new Set(this.families.flatMap((p) => p.tasks.map((t) => t.id)))
  }

  // ---- selection -------------------------------------------------------------
  selectRow(key: string) {
    if (this.selectedRowKey === key) {
      this.selectedRowKey = null
      return
    }
    this.selectedRowKey = key
    if (!this.infoPanelOpen) this.infoPanelOpen = true
  }

  get selectedRow(): FlatRow | null {
    if (!this.selectedRowKey) return null
    return this.flatRows.find((r) => r.key === this.selectedRowKey) ?? null
  }

  // ---- table tune ------------------------------------------------------------
  private updateTuneAt(key: string, patch: Partial<ColumnTune>) {
    this.tableTune = this.tableTune.map((c) => (c.key === key ? { ...c, ...patch } : c))
  }
  setColumnVisible(key: string, visible: boolean) {
    this.updateTuneAt(key, { visible })
  }
  setColumnSticky(key: string, sticky: ColumnSticky) {
    this.updateTuneAt(key, { sticky })
  }
  setColumnSortable(key: string, sortable: boolean) {
    this.updateTuneAt(key, { sortable })
  }
  setColumnFilterable(key: string, filterable: boolean) {
    this.updateTuneAt(key, { filterable })
  }
  moveColumnUp(key: string) {
    const idx = this.tableTune.findIndex((c) => c.key === key)
    if (idx <= 0) return
    const next = [...this.tableTune]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    this.tableTune = next
  }
  moveColumnDown(key: string) {
    const idx = this.tableTune.findIndex((c) => c.key === key)
    if (idx < 0 || idx >= this.tableTune.length - 1) return
    const next = [...this.tableTune]
    ;[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]
    this.tableTune = next
  }
  resetTableTune() {
    this.tableTune = PO_COLUMN_BASELINE.map((c) => ({ ...c }))
  }

  // ---- entity notes ----------------------------------------------------------
  getNotes(key: string): PoNote[] {
    return this.entityNotesStore[key] ?? []
  }

  addNote(key: string, text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const note: PoNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: trimmed,
      createdAt: new Date().toISOString(),
    }
    const list = this.entityNotesStore[key] ?? []
    this.entityNotesStore = { ...this.entityNotesStore, [key]: [...list, note] }
    writeJson(ENTITY_NOTES_STORAGE_KEY, this.entityNotesStore)
  }

  removeNote(key: string, noteId: string) {
    const list = this.entityNotesStore[key] ?? []
    const next = list.filter((n) => n.id !== noteId)
    if (next.length === 0) {
      const copy = { ...this.entityNotesStore }
      delete copy[key]
      this.entityNotesStore = copy
    } else {
      this.entityNotesStore = { ...this.entityNotesStore, [key]: next }
    }
    writeJson(ENTITY_NOTES_STORAGE_KEY, this.entityNotesStore)
  }

  // ---- derived ---------------------------------------------------------------
  get filteredFamilies(): ProductionFamily[] {
    if (this.statusFilter === 'all') return this.families
    return this.families.filter((p) => p.scheduleClass === this.statusFilter)
  }

  // Flatten BizGroup → BizTeam → PFG → PF → Task → SubTask based on the current expand state.
  get flatRows(): FlatRow[] {
    const out: FlatRow[] = []
    const topo = buildTopology(this.filteredFamilies)
    for (const bg of topo) {
      const bizGroupKey = `bizGroup::${bg.bizGroup}`
      const bizGroupRow: FlatRow = {
        key: bizGroupKey,
        kind: 'bizGroup',
        depth: 0,
        expanded: this.isBizGroupExpanded(bizGroupKey),
        hasChildren: bg.teams.length > 0,
        label: `${bg.bizGroup} Biz Group`,
        bizGroup: bg.bizGroup,
        scheduleClass: 'fixed',
        spm: 0,
      }
      out.push(bizGroupRow)
      let bizGroupSpm = 0
      if (!this.isBizGroupExpanded(bizGroupKey)) continue
      for (const bt of bg.teams) {
        const bizTeamKey = `bizTeam::${bt.bizTeam.id}`
        let bizTeamSpm = 0
        out.push({
          key: bizTeamKey,
          kind: 'bizTeam',
          depth: 1,
          parentKey: bizGroupKey,
          expanded: this.isBizTeamExpanded(bizTeamKey),
          hasChildren: bt.byPfg.length > 0,
          label: `${bt.bizTeam.code} · ${bt.bizTeam.name}`,
          code: bt.bizTeam.code,
          bizGroup: bt.bizTeam.bizGroup,
          bizTeamName: bt.bizTeam.name,
          scheduleClass: 'fixed',
          spm: 0,
        })
        if (!this.isBizTeamExpanded(bizTeamKey)) continue
        for (const pfgBucket of bt.byPfg) {
          const pfgKey = `pfg::${bt.bizTeam.id}::${pfgBucket.group}`
          let pfgSpm = 0
          out.push({
            key: pfgKey,
            kind: 'pfg',
            depth: 2,
            parentKey: bizTeamKey,
            expanded: this.isPfgExpanded(pfgKey),
            hasChildren: pfgBucket.families.length > 0,
            label: `${pfgBucket.group} Production Family Group`,
            pfgGroup: pfgBucket.group,
            scheduleClass: 'fixed',
            spm: 0,
          })
          if (!this.isPfgExpanded(pfgKey)) continue
          for (const pf of pfgBucket.families) {
            const pfKey = `pf::${pf.id}`
            const pfSpm = familyTotalSpm(pf)
            pfgSpm += pfSpm
            const allStarts = pf.tasks.map((t) => t.start)
            const allEnds = pf.tasks.map((t) => t.end)
            out.push({
              key: pfKey,
              kind: 'pf',
              depth: 3,
              parentKey: pfgKey,
              expanded: this.isPfExpanded(pf.id),
              hasChildren: pf.tasks.length > 0,
              label: `${pf.code} · ${pf.name}`,
              code: pf.code,
              pfgGroup: pf.familyGroup,
              pfMtoAnchor: pf.mtoAnchor,
              scheduleClass: pf.scheduleClass,
              spm: pfSpm,
              startDate: allStarts.length ? earliest(allStarts) : undefined,
              endDate: allEnds.length ? latest(allEnds) : undefined,
              pfId: pf.id,
              bizTeamName: bt.bizTeam.name,
            })
            if (!this.isPfExpanded(pf.id)) continue
            for (const task of pf.tasks) {
              const taskKey = `task::${task.id}`
              out.push({
                key: taskKey,
                kind: 'task',
                depth: 4,
                parentKey: pfKey,
                expanded: this.isTaskExpanded(task.id),
                hasChildren: task.subTasks.length > 0,
                label: `${task.code} · ${task.name}`,
                code: task.code,
                processPathLabel: task.processPath.join(' / '),
                scheduleClass: task.scheduleClass,
                spm: taskTotalSpm(task),
                startDate: task.start,
                endDate: task.end,
                pfId: pf.id,
                taskId: task.id,
              })
              if (!this.isTaskExpanded(task.id)) continue
              for (const sub of task.subTasks) {
                out.push({
                  key: `sub::${task.id}::${sub.id}`,
                  kind: 'subTask',
                  depth: 5,
                  parentKey: taskKey,
                  label: `${sub.kind} · ${sub.name}`,
                  subTaskKind: sub.kind,
                  scheduleClass: sub.scheduleClass,
                  spm: sub.spm,
                  startDate: sub.start,
                  endDate: sub.end,
                  pfId: pf.id,
                  taskId: task.id,
                  subTaskId: sub.id,
                })
              }
            }
          }
          // Update rolled-up SPM on the PFG row in place.
          const pfgRow = out.find((r) => r.key === pfgKey)
          if (pfgRow) pfgRow.spm = pfgSpm
          bizTeamSpm += pfgSpm
        }
        const btRow = out.find((r) => r.key === bizTeamKey)
        if (btRow) btRow.spm = bizTeamSpm
        bizGroupSpm += bizTeamSpm
      }
      bizGroupRow.spm = bizGroupSpm
    }
    return out
  }

  // ---- undo / redo / reset / save (mock) -------------------------------------
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
    this.statusFilter = 'all'
  }
  save() {
    this.historyCount = 0
    this.futureCount = 0
  }

  // ---- planner mutations (in-memory only) ------------------------------------
  // Edit a sub-task's SPM (person-months). Triggers a 'changes' state transition unless already 'new'.
  setSubTaskSpm(pfId: string, taskId: string, subId: string, spm: number) {
    const pf = this.families.find((p) => p.id === pfId)
    const t = pf?.tasks.find((x) => x.id === taskId)
    const s = t?.subTasks.find((x) => x.id === subId)
    if (!s) return
    s.spm = Math.max(0, Math.round(spm))
    if (s.scheduleClass !== 'new') s.scheduleClass = 'changes'
    this.markEdited()
  }

  addSubTask(pfId: string, taskId: string) {
    const pf = this.families.find((p) => p.id === pfId)
    const t = pf?.tasks.find((x) => x.id === taskId)
    if (!t) return
    const start = t.subTasks[t.subTasks.length - 1]?.end ?? t.start
    const end = addDays(start, 30)
    t.subTasks.push({
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      kind: 'Other',
      name: 'New Sub-Task',
      start,
      end,
      durationDays: 30,
      scheduleClass: 'new',
      ownerCellIds: t.ownerCellIds.slice(),
      spm: 1,
    })
    this.markEdited()
  }

  removeSubTask(pfId: string, taskId: string, subId: string) {
    const pf = this.families.find((p) => p.id === pfId)
    const t = pf?.tasks.find((x) => x.id === taskId)
    if (!t) return
    const idx = t.subTasks.findIndex((x) => x.id === subId)
    if (idx < 0) return
    if (t.subTasks[idx].scheduleClass === 'fixed') return
    t.subTasks.splice(idx, 1)
    if (this.selectedRowKey === `sub::${taskId}::${subId}`) this.selectedRowKey = `task::${taskId}`
    this.markEdited()
  }
}
