import { makeAutoObservable } from 'mobx'
import {
  HORIZON_DATES,
  HORIZON_LABELS,
  HORIZON_MONTH_GROUPS,
  HORIZON_TODAY,
  MOCK_PRODUCTION_ORDERS,
  WORKLOAD_STRIP,
  type MilestoneState,
  type ProductionOrder,
  type ScheduleClass,
  type ScheduleMilestone,
} from '../../data/mock-plan'
import { SCHEDULE_COLOR } from './gantt-styles'

export type GanttTaskRow = {
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
  // custom metadata for column / bar templates
  rowKind: 'po' | 'family' | 'batch'
  customerShort?: string
  techCode?: string
  priority?: string
  waferCount?: number
  note?: string
  scheduleClass: ScheduleClass
  // Drag-to-reschedule: dhx respects `readonly: true` to lock a task from drag/resize.
  // PO and family rows roll up children, batches that are already running are locked.
  readonly?: boolean
  // Index of the PO this row belongs to within the filtered list (0, 1, 2 …) — used by the bar template to
  // attach an alternating `ax-gantt-poband__{a|b}` class so the SCSS can zebra-band by PO group.
  poIndex: number
}

// Marker payload for the dhx-react-gantt `markers` prop — Today + per-PO milestones.
export type GanttMarker = {
  id: string
  start_date: Date
  css: string
  text: string
  title: string
  // additional metadata if downstream needs it
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

// Build a multi-line tooltip string for a milestone marker.
// `title` on dhx Marker becomes the HTML title attribute — newlines render as line breaks in the browser tooltip.
const buildMilestoneTooltip = (m: ScheduleMilestone): string => {
  const header = `${m.label} · ${m.date}`
  const commitments = (m.commitments ?? []).map((c) => `${c.po} — ${c.pf} — ${c.wafers.toLocaleString()} wafers`)
  const slipNote = m.slipDays ? `Slip +${m.slipDays}d${m.cause ? ` · ${m.cause}` : ''}` : null
  return [header, '', ...commitments, slipNote].filter(Boolean).join('\n')
}

export type GanttHorizon = 'day' | 'week' | 'month'

// Tree key conventions — `::` separators keep parsing trivial if we ever need it.
const poKey = (orderId: string) => `po::${orderId}`
const pfKey = (orderId: string, familyId: string) => `pf::${orderId}::${familyId}`
const mbKey = (orderId: string, familyId: string, batchId: string) => `mb::${orderId}::${familyId}::${batchId}`

// A batch is "running" once it is part of the locked-in / executing schedule (scheduleClass === 'fixed').
// A family/PO is "running" if any of its descendants is running. The Adjustment tree uses these flags to
// decide which checkboxes are disabled (running nodes cannot be unchecked).
const isBatchRunning = (cls: ScheduleClass) => cls === 'fixed'

const collectAllKeys = (orders: ProductionOrder[]): string[] => {
  const keys: string[] = []
  for (const order of orders) {
    keys.push(poKey(order.id))
    for (const family of order.schedule) {
      keys.push(pfKey(order.id, family.id))
      for (const batch of family.batches) {
        keys.push(mbKey(order.id, family.id, batch.id))
      }
    }
  }
  return keys
}

const ALL_TREE_KEYS = collectAllKeys(MOCK_PRODUCTION_ORDERS)

export class GanttStore {
  horizon: GanttHorizon = 'week'
  startDate = '2026-04-01'
  endDate = '2027-12-31'

  filterSidebarOpen = true
  quickAnalysisOpen = true
  // Risks strip — collapsed by default so the chart owns the most vertical space; the planner expands to see
  // the prioritized list of constraints + overloaded tool groups that affect the current horizon.
  risksStripOpen = true

  // Applied adjustment — list of checked tree keys (PO + PF + MB). Drives `filteredOrders` and the chart.
  checkedKeys: string[] = [...ALL_TREE_KEYS]

  // Pending adjustment — what the user is currently selecting in the sidebar.
  // Stays separate from the applied state until the user clicks Apply.
  pendingCheckedKeys: string[] = [...ALL_TREE_KEYS]

  orders: ProductionOrder[] = MOCK_PRODUCTION_ORDERS
  horizonLabels: string[] = HORIZON_LABELS
  horizonDates: string[] = HORIZON_DATES
  horizonMonthGroups = HORIZON_MONTH_GROUPS
  today: string = HORIZON_TODAY
  workloadStrip = WORKLOAD_STRIP
  expandedOrderIds = new Set<string>([MOCK_PRODUCTION_ORDERS[0].id, MOCK_PRODUCTION_ORDERS[1].id, MOCK_PRODUCTION_ORDERS[2].id])
  expandedFamilyIds = new Set<string>(MOCK_PRODUCTION_ORDERS.flatMap((o) => o.schedule.map((f) => f.id)))

  private historyCount = 0
  private futureCount = 0

  constructor() {
    makeAutoObservable(this)
  }

  setHorizon(value: GanttHorizon) {
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
      // Sync the sidebar's pending state with what is currently applied, so the user always sees
      // the live adjustment when they re-open the panel.
      this.pendingCheckedKeys = [...this.checkedKeys]
    }
  }

  toggleQuickAnalysis() {
    this.quickAnalysisOpen = !this.quickAnalysisOpen
  }

  toggleRisksStrip() {
    this.risksStripOpen = !this.risksStripOpen
  }

  // Tree onCheck handler — replaces the pending selection wholesale.
  setPendingCheckedKeys(keys: string[]) {
    this.pendingCheckedKeys = keys
  }

  // Apply — commit the pending selection to the applied state. Only after this does the chart re-filter.
  applyAdjustment() {
    this.checkedKeys = [...this.pendingCheckedKeys]
  }

  // One-shot include/exclude — bypasses the sidebar's pending/apply flow so quick actions in the
  // info panel (e.g. the Exclude button on a single PO) take effect immediately. Updates both
  // arrays so the sidebar stays in sync if it's opened next.
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

  // Reset — restore the default adjustment (everything selected) in both pending and applied state.
  resetAdjustment() {
    this.pendingCheckedKeys = [...ALL_TREE_KEYS]
    this.checkedKeys = [...ALL_TREE_KEYS]
  }

  // True when the pending selection differs from what is currently applied — used to enable the Apply button.
  get hasPendingAdjustmentChanges(): boolean {
    if (this.pendingCheckedKeys.length !== this.checkedKeys.length) return true
    const applied = new Set(this.checkedKeys)
    return this.pendingCheckedKeys.some((k) => !applied.has(k))
  }

  // Running-state helpers — exposed so the sidebar can show distinct labels if needed.
  isOrderRunning(orderId: string): boolean {
    const order = this.orders.find((o) => o.id === orderId)
    return order?.schedule.some((f) => f.batches.some((b) => isBatchRunning(b.scheduleClass))) ?? false
  }

  isFamilyRunning(orderId: string, familyId: string): boolean {
    const family = this.orders.find((o) => o.id === orderId)?.schedule.find((f) => f.id === familyId)
    return family?.batches.some((b) => isBatchRunning(b.scheduleClass)) ?? false
  }

  // Tree data fed to AntD <Tree treeData={...} />. Disabled checkboxes encode the business rule:
  //   • running MB     → cannot be unchecked (already in flight)
  //   • running PF/PO  → cannot be unchecked directly; children that aren't running can still toggle
  get adjustmentTreeData(): AdjustmentTreeNode[] {
    return this.orders.map((order) => {
      const orderRunning = this.isOrderRunning(order.id)
      return {
        key: poKey(order.id),
        title: `${order.id} · ${order.customerShort}`,
        disableCheckbox: orderRunning,
        children: order.schedule.map((family) => {
          const familyRunning = this.isFamilyRunning(order.id, family.id)
          return {
            key: pfKey(order.id, family.id),
            title: family.label,
            disableCheckbox: familyRunning,
            children: family.batches.map((batch) => ({
              key: mbKey(order.id, family.id, batch.id),
              title: `${batch.name} · ${batch.waferCount.toLocaleString()} w`,
              disableCheckbox: isBatchRunning(batch.scheduleClass),
              isLeaf: true,
            })),
          }
        }),
      }
    })
  }

  // Visibility is derived purely from checked batch keys: a family appears if any of its batches is checked,
  // a PO appears if any of its families is visible. This works regardless of the PF/PO key's checked state,
  // which is how a running-but-partially-unchecked PF stays visible with only its remaining batches.
  get filteredOrders(): ProductionOrder[] {
    const checked = new Set(this.checkedKeys)
    const out: ProductionOrder[] = []
    for (const order of this.orders) {
      const visibleFamilies = []
      for (const family of order.schedule) {
        const visibleBatches = family.batches.filter((b) => checked.has(mbKey(order.id, family.id, b.id)))
        if (visibleBatches.length === 0) continue
        visibleFamilies.push({ ...family, batches: visibleBatches })
      }
      if (visibleFamilies.length === 0) continue
      out.push({ ...order, schedule: visibleFamilies })
    }
    return out
  }

  // Flat dhx tasks array (PO → Family → Batch) for the @dhx/react-gantt component.
  // Milestones are NOT tasks anymore — they render as vertical marker lines (see `dhxMarkers`).
  get dhxTasks(): GanttTaskRow[] {
    const out: GanttTaskRow[] = []
    let poIndex = 0
    for (const order of this.filteredOrders) {
      out.push({
        id: order.id,
        text: `${order.id} · ${order.customerShort}`,
        start_date: order.waferStart,
        end_date: order.end,
        type: 'project',
        open: this.expandedOrderIds.has(order.id),
        rowKind: 'po',
        customerShort: order.customerShort,
        priority: order.priority,
        scheduleClass: order.scheduleClass,
        color: scheduleColor(order.scheduleClass),
        // Project rows are always readonly — their span is computed from children, not draggable.
        readonly: true,
        poIndex,
      })
      for (const family of order.schedule) {
        out.push({
          id: family.id,
          text: family.label,
          start_date: family.start,
          end_date: family.end,
          type: 'project',
          parent: order.id,
          open: this.expandedFamilyIds.has(family.id),
          rowKind: 'family',
          techCode: family.tech,
          priority: family.priority,
          scheduleClass: family.scheduleClass,
          color: scheduleColor(family.scheduleClass),
          readonly: true,
          poIndex,
        })
        for (const batch of family.batches) {
          out.push({
            id: `${family.id}::${batch.id}`,
            text: batch.name,
            start_date: batch.start,
            end_date: batch.end,
            duration: batch.durationDays,
            type: 'task',
            parent: family.id,
            rowKind: 'batch',
            waferCount: batch.waferCount,
            note: batch.note,
            scheduleClass: batch.scheduleClass,
            color: scheduleColor(batch.scheduleClass),
            // Running (fixed) batches are locked — already executing on the floor.
            readonly: batch.scheduleClass === 'fixed',
            poIndex,
          })
        }
      }
      poIndex += 1
    }
    return out
  }

  // Markers for dhx-react-gantt — the Today line plus one vertical line per milestone.
  // Each marker carries a rich `title` tooltip (name + date + PO/PF/wafer commitment list).
  get dhxMarkers(): GanttMarker[] {
    const out: GanttMarker[] = [
      {
        id: 'today',
        start_date: new Date(this.today),
        css: 'ax-gantt-today-marker',
        text: 'TODAY',
        title: `Today · ${this.today}`,
      },
    ]
    for (const order of this.filteredOrders) {
      for (const m of order.milestones) {
        out.push({
          id: `milestone::${order.id}::${m.id}`,
          start_date: new Date(m.date),
          css: `ax-gantt-milestone-marker ax-gantt-milestone-marker__${m.state}`,
          text: `${order.id} · ${m.label}`,
          title: buildMilestoneTooltip(m),
          state: m.state,
        })
      }
    }
    return out
  }

  isExpanded(id: string) {
    return this.expandedOrderIds.has(id)
  }

  toggleExpanded(id: string) {
    if (this.expandedOrderIds.has(id)) this.expandedOrderIds.delete(id)
    else this.expandedOrderIds.add(id)
  }

  isFamilyExpanded(id: string) {
    return this.expandedFamilyIds.has(id)
  }

  toggleFamilyExpanded(id: string) {
    if (this.expandedFamilyIds.has(id)) this.expandedFamilyIds.delete(id)
    else this.expandedFamilyIds.add(id)
  }

  collapseAll() {
    this.expandedOrderIds = new Set()
    this.expandedFamilyIds = new Set()
  }

  expandAll() {
    this.expandedOrderIds = new Set(this.orders.map((o) => o.id))
    this.expandedFamilyIds = new Set(this.orders.flatMap((o) => o.schedule.map((f) => f.id)))
  }

  get canUndo() {
    return this.historyCount > 0
  }

  get canRedo() {
    return this.futureCount > 0
  }

  // Number of unsaved edits since the last save — drives the header chip + the toolbar dirty indicator.
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

  // Mock helpers so the toolbar buttons reflect dirty state.
  markEdited() {
    this.historyCount += 1
    this.futureCount = 0
  }

  reset() {
    this.historyCount = 0
    this.futureCount = 0
    this.resetAdjustment()
    this.horizon = 'week'
  }

  save() {
    // Mock save — in a real flow this would push to the back-end.
    this.historyCount = 0
    this.futureCount = 0
  }

  // ---- Drag-to-reschedule cascade ---------------------------------------------
  // The dhx gantt batchSave callback hands us batch task ids in the form `${familyId}::${batchId}` together
  // with their new start/end dates. We persist into the underlying mock-plan structure and cascade the
  // window up to the family and PO.
  rescheduleBatch(familyTaskId: string, batchId: string, start: Date, end: Date) {
    const [familyId] = familyTaskId.split('::')
    const order = this.orders.find((o) => o.schedule.some((f) => f.id === familyId))
    if (!order) return
    const family = order.schedule.find((f) => f.id === familyId)
    if (!family) return
    const batch = family.batches.find((b) => b.id === batchId)
    if (!batch || batch.scheduleClass === 'fixed') return // running batches are readonly — extra guard

    const startStr = start.toISOString().slice(0, 10)
    const endStr = end.toISOString().slice(0, 10)
    batch.start = startStr
    batch.end = endStr
    batch.durationDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)))
    // Any move converts a previously-"new" batch into the "changes" class so the planner sees the modification.
    if (batch.scheduleClass !== 'new') batch.scheduleClass = 'changes'

    // Cascade — recompute family span from its batches and PO span from its families.
    family.start = family.batches.reduce((a, b) => (b.start < a ? b.start : a), family.batches[0].start)
    family.end = family.batches.reduce((a, b) => (b.end > a ? b.end : a), family.batches[0].end)
    family.durationDays = Math.max(1, Math.round((new Date(family.end).getTime() - new Date(family.start).getTime()) / (24 * 60 * 60 * 1000)))
    if (family.scheduleClass !== 'new') family.scheduleClass = 'changes'

    order.waferStart = order.schedule.reduce((a, f) => (f.start < a ? f.start : a), order.schedule[0].start)
    order.end = order.schedule.reduce((a, f) => (f.end > a ? f.end : a), order.schedule[0].end)
    if (order.scheduleClass !== 'new') order.scheduleClass = 'changes'

    this.markEdited()
  }
}
