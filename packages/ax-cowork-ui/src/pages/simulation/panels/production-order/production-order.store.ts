import { makeAutoObservable } from 'mobx'
import { MOCK_PRODUCTION_ORDERS, type PoStatus, type ProductionOrder, type ScheduleBatch, type ScheduleClass, type ScheduleFamily } from '../../data/mock-plan'

// Toolbar status filter — derived from PO.scheduleClass.
//   • all              — no filter
//   • new              — scheduleClass === 'new'
//   • running-changes  — scheduleClass === 'changes'
//   • running-fixed    — scheduleClass === 'fixed'
export type StatusFilter = 'all' | 'new' | 'running-changes' | 'running-fixed'

// Flat row model fed into AxControlTable. The PO/Family/Batch tree is flattened
// based on the current expand state; the first column renders depth + chevron.
export type RowKind = 'po' | 'family' | 'batch'
export type FlatRow = {
  key: string
  kind: RowKind
  depth: 0 | 1 | 2
  parentKey?: string
  expanded?: boolean
  hasChildren?: boolean
  // Display values
  label: string
  customerShort?: string
  priority?: ProductionOrder['priority']
  hotLot?: boolean
  commitment: number
  outWafers?: number
  status?: PoStatus
  scheduleClass: ScheduleClass
  startDate: string
  endDate: string
  // Back-references for the info panel.
  poId: string
  familyId?: string
  batchId?: string
}

const uniq = <T>(arr: T[]): T[] => Array.from(new Set(arr))

const ALL_CUSTOMERS = uniq(MOCK_PRODUCTION_ORDERS.map((o) => o.customer))
const ALL_ORDERS = MOCK_PRODUCTION_ORDERS.map((o) => o.id)
const ALL_FAMILIES = uniq(MOCK_PRODUCTION_ORDERS.map((o) => o.family))

const familyCommitment = (family: ScheduleFamily): number => family.batches.reduce((s, b) => s + b.waferCount, 0)
const familyOut = (family: ScheduleFamily, poRatio: number): number => Math.round(familyCommitment(family) * poRatio)
const batchKey = (familyId: string, batch: ScheduleBatch) => `${familyId}::${batch.id}`

export class ProductionOrderStore {
  orders: ProductionOrder[] = MOCK_PRODUCTION_ORDERS

  // Toolbar state
  startDate = '2026-04-29'
  endDate = '2026-05-12'
  statusFilter: StatusFilter = 'all'

  // Panel slots
  filterSidebarOpen = false
  infoPanelOpen = false

  // Filter sidebar — pending (in-sidebar) vs applied (drives the table).
  customerFilters: string[] = [...ALL_CUSTOMERS]
  orderFilters: string[] = [...ALL_ORDERS]
  familyFilters: string[] = [...ALL_FAMILIES]
  pendingCustomerFilters: string[] = [...ALL_CUSTOMERS]
  pendingOrderFilters: string[] = [...ALL_ORDERS]
  pendingFamilyFilters: string[] = [...ALL_FAMILIES]

  allCustomers = ALL_CUSTOMERS
  allOrders = ALL_ORDERS
  allFamilies = ALL_FAMILIES

  // Tree expansion (default: all PO/Families expanded so the operator sees everything).
  expandedOrderIds = new Set<string>(MOCK_PRODUCTION_ORDERS.map((o) => o.id))
  expandedFamilyIds = new Set<string>(MOCK_PRODUCTION_ORDERS.flatMap((o) => o.schedule.map((f) => f.id)))

  // Selected row for the info panel (null = nothing selected).
  selectedRowKey: string | null = `po::${MOCK_PRODUCTION_ORDERS[0].id}`

  private historyCount = 0
  private futureCount = 0

  constructor() {
    makeAutoObservable(this)
  }

  // ---- toolbar setters -------------------------------------------------------
  setStartDate(value: string) {
    this.startDate = value
  }

  setEndDate(value: string) {
    this.endDate = value
  }

  setStatusFilter(value: StatusFilter) {
    this.statusFilter = value
  }

  // ---- panel slots -----------------------------------------------------------
  toggleFilterSidebar() {
    this.filterSidebarOpen = !this.filterSidebarOpen
    if (this.filterSidebarOpen) {
      this.pendingCustomerFilters = [...this.customerFilters]
      this.pendingOrderFilters = [...this.orderFilters]
      this.pendingFamilyFilters = [...this.familyFilters]
    }
  }

  toggleInfoPanel() {
    this.infoPanelOpen = !this.infoPanelOpen
  }

  closeInfoPanel() {
    this.infoPanelOpen = false
  }

  // ---- filter sidebar --------------------------------------------------------
  setPendingCustomerFilters(values: string[]) {
    this.pendingCustomerFilters = values
  }

  setPendingOrderFilters(values: string[]) {
    this.pendingOrderFilters = values
  }

  setPendingFamilyFilters(values: string[]) {
    this.pendingFamilyFilters = values
  }

  applyFilters() {
    this.customerFilters = [...this.pendingCustomerFilters]
    this.orderFilters = [...this.pendingOrderFilters]
    this.familyFilters = [...this.pendingFamilyFilters]
  }

  resetFilters() {
    this.pendingCustomerFilters = [...this.allCustomers]
    this.pendingOrderFilters = [...this.allOrders]
    this.pendingFamilyFilters = [...this.allFamilies]
    this.customerFilters = [...this.allCustomers]
    this.orderFilters = [...this.allOrders]
    this.familyFilters = [...this.allFamilies]
  }

  get hasPendingFilterChanges(): boolean {
    const same = (a: string[], b: string[]) => a.length === b.length && a.every((v) => b.includes(v))
    return (
      !same(this.pendingCustomerFilters, this.customerFilters) ||
      !same(this.pendingOrderFilters, this.orderFilters) ||
      !same(this.pendingFamilyFilters, this.familyFilters)
    )
  }

  // ---- tree expand / collapse ------------------------------------------------
  isOrderExpanded(id: string) {
    return this.expandedOrderIds.has(id)
  }

  isFamilyExpanded(id: string) {
    return this.expandedFamilyIds.has(id)
  }

  toggleOrderExpanded(id: string) {
    if (this.expandedOrderIds.has(id)) this.expandedOrderIds.delete(id)
    else this.expandedOrderIds.add(id)
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

  // ---- selection -------------------------------------------------------------
  selectRow(key: string) {
    this.selectedRowKey = key
    if (!this.infoPanelOpen) this.infoPanelOpen = true
  }

  get selectedRow(): FlatRow | null {
    if (!this.selectedRowKey) return null
    return this.flatRows.find((r) => r.key === this.selectedRowKey) ?? null
  }

  // ---- derived ---------------------------------------------------------------
  get filteredOrders(): ProductionOrder[] {
    const cs = new Set(this.customerFilters)
    const os = new Set(this.orderFilters)
    const fs = new Set(this.familyFilters)
    return this.orders.filter((o) => {
      if (!cs.has(o.customer) || !os.has(o.id) || !fs.has(o.family)) return false
      if (this.statusFilter === 'all') return true
      if (this.statusFilter === 'new') return o.scheduleClass === 'new'
      if (this.statusFilter === 'running-changes') return o.scheduleClass === 'changes'
      return o.scheduleClass === 'fixed'
    })
  }

  // Flatten PO → Family → Batch based on the current expand state.
  get flatRows(): FlatRow[] {
    const out: FlatRow[] = []
    for (const po of this.filteredOrders) {
      const poKey = `po::${po.id}`
      const poRatio = po.qty > 0 ? po.outWafers / po.qty : 0
      out.push({
        key: poKey,
        kind: 'po',
        depth: 0,
        expanded: this.expandedOrderIds.has(po.id),
        hasChildren: po.schedule.length > 0,
        label: po.id,
        customerShort: po.customerShort,
        priority: po.priority,
        hotLot: po.hotLot,
        commitment: po.qty,
        outWafers: po.outWafers,
        status: po.poStatus,
        scheduleClass: po.scheduleClass,
        startDate: po.waferStart,
        endDate: po.end,
        poId: po.id,
      })
      if (!this.expandedOrderIds.has(po.id)) continue
      for (const family of po.schedule) {
        const famKey = `family::${family.id}`
        out.push({
          key: famKey,
          kind: 'family',
          depth: 1,
          parentKey: poKey,
          expanded: this.expandedFamilyIds.has(family.id),
          hasChildren: family.batches.length > 0,
          label: family.label,
          priority: family.priority,
          hotLot: family.hotLot,
          commitment: familyCommitment(family),
          outWafers: familyOut(family, poRatio),
          scheduleClass: family.scheduleClass,
          startDate: family.start,
          endDate: family.end,
          poId: po.id,
          familyId: family.id,
        })
        if (!this.expandedFamilyIds.has(family.id)) continue
        for (const batch of family.batches) {
          out.push({
            key: `batch::${batchKey(family.id, batch)}`,
            kind: 'batch',
            depth: 2,
            parentKey: famKey,
            commitment: batch.waferCount,
            label: batch.name,
            scheduleClass: batch.scheduleClass,
            startDate: batch.start,
            endDate: batch.end,
            poId: po.id,
            familyId: family.id,
            batchId: batch.id,
          })
        }
      }
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
    this.resetFilters()
    this.statusFilter = 'all'
  }

  save() {
    this.historyCount = 0
    this.futureCount = 0
  }
}
