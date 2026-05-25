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

const uniq = <T>(arr: T[]) => Array.from(new Set(arr))

const ALL_CUSTOMERS = uniq(MOCK_PRODUCTION_ORDERS.map((o) => o.customer))
const ALL_ORDERS = MOCK_PRODUCTION_ORDERS.map((o) => o.id)
const ALL_FAMILIES = uniq(MOCK_PRODUCTION_ORDERS.map((o) => o.family))

export class GanttStore {
  horizon: GanttHorizon = 'week'
  startDate = '2026-04-29'
  endDate = '2026-05-12'

  filterSidebarOpen = false
  quickAnalysisOpen = false

  // Applied filter state — drives `filteredOrders` (and therefore the chart).
  customerFilters: string[] = [...ALL_CUSTOMERS]
  orderFilters: string[] = [...ALL_ORDERS]
  familyFilters: string[] = [...ALL_FAMILIES]

  // Pending filter state — what the user is currently choosing in the sidebar.
  // Stays separate from the applied state until the user clicks Apply.
  pendingCustomerFilters: string[] = [...ALL_CUSTOMERS]
  pendingOrderFilters: string[] = [...ALL_ORDERS]
  pendingFamilyFilters: string[] = [...ALL_FAMILIES]

  allCustomers = ALL_CUSTOMERS
  allOrders = ALL_ORDERS
  allFamilies = ALL_FAMILIES

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
      // the live filter when they re-open the panel.
      this.pendingCustomerFilters = [...this.customerFilters]
      this.pendingOrderFilters = [...this.orderFilters]
      this.pendingFamilyFilters = [...this.familyFilters]
    }
  }

  toggleQuickAnalysis() {
    this.quickAnalysisOpen = !this.quickAnalysisOpen
  }

  // Mutate the *pending* selection — checkboxes call these and the chart is not re-filtered yet.
  setCustomerFilters(values: string[]) {
    this.pendingCustomerFilters = values
  }

  setOrderFilters(values: string[]) {
    this.pendingOrderFilters = values
  }

  setFamilyFilters(values: string[]) {
    this.pendingFamilyFilters = values
  }

  // Apply — commit the pending selection to the applied state. Only after this does the chart re-filter.
  applyFilters() {
    this.customerFilters = [...this.pendingCustomerFilters]
    this.orderFilters = [...this.pendingOrderFilters]
    this.familyFilters = [...this.pendingFamilyFilters]
  }

  // Reset — restore the default filter condition (all values selected) in both pending and applied state.
  resetFilters() {
    this.pendingCustomerFilters = [...this.allCustomers]
    this.pendingOrderFilters = [...this.allOrders]
    this.pendingFamilyFilters = [...this.allFamilies]
    this.customerFilters = [...this.allCustomers]
    this.orderFilters = [...this.allOrders]
    this.familyFilters = [...this.allFamilies]
  }

  // True when the pending selection differs from what is currently applied — used to enable the Apply button.
  get hasPendingFilterChanges(): boolean {
    const same = (a: string[], b: string[]) => a.length === b.length && a.every((v) => b.includes(v))
    return (
      !same(this.pendingCustomerFilters, this.customerFilters) ||
      !same(this.pendingOrderFilters, this.orderFilters) ||
      !same(this.pendingFamilyFilters, this.familyFilters)
    )
  }

  get filteredOrders(): ProductionOrder[] {
    const cs = new Set(this.customerFilters)
    const os = new Set(this.orderFilters)
    const fs = new Set(this.familyFilters)
    return this.orders.filter((o) => cs.has(o.customer) && os.has(o.id) && fs.has(o.family))
  }

  // Flat dhx tasks array (PO → Family → Batch) for the @dhx/react-gantt component.
  // Milestones are NOT tasks anymore — they render as vertical marker lines (see `dhxMarkers`).
  get dhxTasks(): GanttTaskRow[] {
    const out: GanttTaskRow[] = []
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
          })
        }
      }
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
    this.resetFilters()
    this.horizon = 'week'
  }

  save() {
    // Mock save — in a real flow this would push to the back-end.
    this.historyCount = 0
    this.futureCount = 0
  }
}
