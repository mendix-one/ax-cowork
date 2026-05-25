import { makeAutoObservable } from 'mobx'
import {
  HORIZON_DATES,
  HORIZON_LABELS,
  HORIZON_MONTH_GROUPS,
  HORIZON_TODAY,
  MOCK_PRODUCTION_ORDERS,
  WORKLOAD_STRIP,
  type LotStatus,
  type ProductionOrder,
} from '../../data/mock-plan'
import { STATUS_COLOR } from './gantt-styles'

export type GanttTaskRow = {
  id: string
  text: string
  start_date: string
  end_date?: string
  duration?: number
  parent?: string
  type?: 'project' | 'task' | 'milestone'
  open?: boolean
  color?: string
  progress?: number
  // custom metadata for column / bar templates
  rowKind: 'po' | 'family' | 'batch' | 'milestone'
  customerShort?: string
  techCode?: string
  priority?: string
  hot?: boolean
  waferCount?: number
  note?: string
  shipmentWafers?: number
  slipDays?: number
  cause?: string
  status?: LotStatus
}

const statusColor = (status?: LotStatus) => (status ? STATUS_COLOR[status] : undefined)

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

  // Flat dhx tasks array (PO → Family → Batch → Milestone) for the @dhx/react-gantt component.
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
        hot: order.hotLot,
        status: order.status,
        color: statusColor(order.status),
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
          hot: family.hotLot,
          status: family.status,
          color: statusColor(family.status),
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
            status: batch.status,
            color: statusColor(batch.status),
          })
        }
      }
      for (const m of order.milestones) {
        out.push({
          id: `${order.id}::${m.id}`,
          text: `${m.label} · ${m.shipmentWafers.toLocaleString()} wafers out`,
          start_date: m.date,
          duration: 0,
          type: 'milestone',
          parent: m.familyId ?? order.id,
          rowKind: 'milestone',
          shipmentWafers: m.shipmentWafers,
          slipDays: m.slipDays,
          cause: m.cause,
          status: m.status,
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
