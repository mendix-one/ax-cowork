import { makeAutoObservable } from 'mobx'
import {
  HORIZON_DATES,
  HORIZON_LABELS,
  HORIZON_MONTH_GROUPS,
  HORIZON_TODAY,
  MOCK_PRODUCTION_ORDERS,
  WORKLOAD_STRIP,
  type ProductionOrder,
} from '../../data/mock-plan'

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

  customerFilters: string[] = [...ALL_CUSTOMERS]
  orderFilters: string[] = [...ALL_ORDERS]
  familyFilters: string[] = [...ALL_FAMILIES]

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
  }

  toggleQuickAnalysis() {
    this.quickAnalysisOpen = !this.quickAnalysisOpen
  }

  setCustomerFilters(values: string[]) {
    this.customerFilters = values
  }

  setOrderFilters(values: string[]) {
    this.orderFilters = values
  }

  setFamilyFilters(values: string[]) {
    this.familyFilters = values
  }

  resetFilters() {
    this.customerFilters = [...this.allCustomers]
    this.orderFilters = [...this.allOrders]
    this.familyFilters = [...this.allFamilies]
  }

  get filteredOrders(): ProductionOrder[] {
    const cs = new Set(this.customerFilters)
    const os = new Set(this.orderFilters)
    const fs = new Set(this.familyFilters)
    return this.orders.filter((o) => cs.has(o.customer) && os.has(o.id) && fs.has(o.family))
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

  clearFilters() {
    this.customerFilters = []
    this.orderFilters = []
    this.familyFilters = []
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
