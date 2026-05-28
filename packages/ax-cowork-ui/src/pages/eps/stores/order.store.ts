import { makeAutoObservable } from 'mobx'
import { MOCK_PRODUCTION_ORDERS, type PoStatus, type ProductionOrder, type ScheduleBatch, type ScheduleClass, type ScheduleFamily } from '../data/mock-plan'
import { readJson, writeJson } from '@/acore/storage'

// Local date arithmetic helper — mock-plan exports HORIZON dates but not addDays.
const addDays = (start: string, days: number): string => {
  const d = new Date(start)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Toolbar status filter — derived from PO.scheduleClass.
//   • all              — no filter
//   • new              — scheduleClass === 'new'
//   • running-changes  — scheduleClass === 'changes'
//   • running-fixed    — scheduleClass === 'fixed'
export type StatusFilter = 'all' | 'new' | 'running-changes' | 'running-fixed'

// Flat row model fed into AxControlTable. The PO/Family/Batch tree is flattened
// based on the current expand state; the first column renders depth + chevron.
// In customer-pivot mode an extra 'customer' level is added at depth 0 (PO/PF/MB shift down 1).
export type RowKind = 'customer' | 'po' | 'family' | 'batch'
export type FlatRow = {
  key: string
  kind: RowKind
  depth: 0 | 1 | 2 | 3
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
  customer?: string
}

// Group-by mode for the table — drives flatRows builder selection.
export type GroupBy = 'po' | 'customer'

// ---- entity notes (list model) ------------------------------------------------------------------
// PO / Family / Batch / etc. each carry an ORDERED list of timestamped notes (vs the single free-text
// note on the global NotesStore, which is keyed by row and used by other panels). Stored separately
// so adding or removing notes here doesn't churn the legacy storage. Keys are namespaced:
//   "po::<poId>"          for production orders
//   "family::<familyId>"  for production families
// Bumped to v2 when the API genericized — old v1 data (bare poId keys) is ignored on first load.
export type PoNote = {
  id: string
  text: string
  createdAt: string // ISO timestamp
}
type PersistedEntityNotes = Record<string, PoNote[]>
const ENTITY_NOTES_STORAGE_KEY = 'ax.simulation.po-notes.v2'
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
// Per-column UI state exposed via the "tune" popover in the table header. The base column DEFINITIONS
// (renderers, accessors, widths) live in EpsOrderTable; this store only carries
// what the planner can flex at runtime — visibility, ordering, sticky pinning, sort/filter enablement.
export type ColumnSticky = 'left' | 'right' | null
export type ColumnTune = {
  key: string
  label: string // human-readable header text — used in the tune popover row labels
  visible: boolean
  sortable: boolean
  filterable: boolean
  sticky: ColumnSticky
}

// Baseline tune state — matches today's table layout. Initialised once and used both for first-load
// state and for the "Reset" action.
const PO_COLUMN_BASELINE: ColumnTune[] = [
  { key: '_select', label: 'Select', visible: true, sortable: false, filterable: false, sticky: 'left' },
  { key: 'label', label: 'Production Order / Family / Batch', visible: true, sortable: false, filterable: false, sticky: 'left' },
  { key: 'state', label: 'State', visible: true, sortable: false, filterable: false, sticky: 'left' },
  { key: 'customer', label: 'Customer', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'techSpec', label: 'Tech / Spec', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'commitment', label: 'Commitment', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'startDate', label: 'Start Date', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'endDate', label: 'End Date', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'milestones', label: 'Milestones', visible: true, sortable: false, filterable: false, sticky: null },
  { key: 'status', label: 'Status', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'progress', label: 'Progress', visible: true, sortable: false, filterable: false, sticky: null },
  { key: 'startedWafers', label: 'Started Wafers', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'processingWafers', label: 'Processing Wafers', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'completedWafers', label: 'Completed Wafers', visible: true, sortable: true, filterable: false, sticky: null },
  { key: 'remark', label: 'Remark', visible: true, sortable: false, filterable: false, sticky: null },
]

const uniq = <T>(arr: T[]): T[] => Array.from(new Set(arr))

const ALL_CUSTOMERS = uniq(MOCK_PRODUCTION_ORDERS.map((o) => o.customer))
const ALL_ORDERS = MOCK_PRODUCTION_ORDERS.map((o) => o.id)
const ALL_FAMILIES = uniq(MOCK_PRODUCTION_ORDERS.map((o) => o.family))

const familyCommitment = (family: ScheduleFamily): number => family.batches.reduce((s, b) => s + b.waferCount, 0)
const familyOut = (family: ScheduleFamily, poRatio: number): number => Math.round(familyCommitment(family) * poRatio)
const batchKey = (familyId: string, batch: ScheduleBatch) => `${familyId}::${batch.id}`

export class OrderStore {
  orders: ProductionOrder[] = MOCK_PRODUCTION_ORDERS

  // Toolbar state
  startDate = '2026-04-29'
  endDate = '2026-05-12'
  statusFilter: StatusFilter = 'all'
  // Pivot mode: 'po' = PO → PF → MB tree; 'customer' = Customer → PO → PF → MB tree.
  groupBy: GroupBy = 'po'
  // Customer-level expand set — populated lazily as the planner expands.
  expandedCustomers = new Set<string>()

  // Panel slots — both open by default so the planner sees filters + the summary/info dock immediately.
  filterSidebarOpen = true
  infoPanelOpen = true

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

  // Selected row for the info panel (null = nothing selected → info panel shows the plan summary).
  selectedRowKey: string | null = null

  // Per-column tune state — driven by the table-tune popover in the header. Initialised from the
  // baseline; the table component reads this to derive the active column list each render.
  tableTune: ColumnTune[] = PO_COLUMN_BASELINE.map((c) => ({ ...c }))

  // Entity notes (list). Persisted to localStorage so cross-shift handoff survives reload. Seeded
  // with a few example notes so the concept demo shows realistic content out of the box.
  private entityNotesStore: PersistedEntityNotes = readJson(ENTITY_NOTES_STORAGE_KEY, isPersistedEntityNotes) ?? {
    'po::PO-2025-118': [
      { id: 'seed-po-1', text: 'Customer A flagged urgency on M1 — keep buffer on QLC-A.', createdAt: '2026-05-10T08:30:00Z' },
    ],
    'family::fam-118-v9-qlc-a': [
      { id: 'seed-fam-1', text: 'V9-QLC-A tech: watch HARC Etch utilisation, recipe v3.4 runs hot.', createdAt: '2026-05-12T10:00:00Z' },
    ],
    'batch::fam-118-v9-qlc-a::b1': [
      { id: 'seed-batch-1', text: 'B-1 already in production — locked to HARC Etch group, do not reschedule.', createdAt: '2026-05-13T09:15:00Z' },
    ],
  }

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

  setGroupBy(value: GroupBy) {
    this.groupBy = value
    // When switching to customer pivot, auto-expand every customer so the planner sees POs immediately.
    if (value === 'customer') {
      const customers = new Set(this.orders.map((o) => o.customer))
      this.expandedCustomers = customers
    }
  }

  isCustomerExpanded(name: string) {
    return this.expandedCustomers.has(name)
  }

  toggleCustomerExpanded(name: string) {
    if (this.expandedCustomers.has(name)) this.expandedCustomers.delete(name)
    else this.expandedCustomers.add(name)
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

  // Close button on the info panel — hides the panel AND clears any row selection so reopening the
  // panel starts on the summary view. (The toolbar toggle stays visibility-only on purpose.)
  closeInfoPanel() {
    this.infoPanelOpen = false
    this.selectedRowKey = null
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
  // Click toggles: a click on the already-selected row unselects (info panel stays open in
  // summary mode); a click on a different row selects it (and reopens the info panel if hidden).
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
  // Mutate-by-replace so MobX picks up the reference change. We also reassign tableTune itself on
  // moves so observers re-render on order changes.
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
  // Reassign the underlying object on every mutation so MobX picks up the change. Persistence is
  // synchronous to localStorage — small payload, no debounce needed for this scope. The `key`
  // arg is the namespaced entity key ("po::id" / "family::id") so the same store backs both
  // PO and Family note lists (and any future entity that wants timestamped multi-note support).
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
  // When groupBy === 'customer' we wrap in a Customer level, shifting depths by 1.
  get flatRows(): FlatRow[] {
    return this.groupBy === 'customer' ? this.flatRowsByCustomer() : this.flatRowsByPo()
  }

  private flatRowsByPo(): FlatRow[] {
    const out: FlatRow[] = []
    for (const po of this.filteredOrders) {
      this.pushPoRows(out, po, 0)
    }
    return out
  }

  // Group POs under their customer. Customer rows summarise commitment + out across all visible POs.
  private flatRowsByCustomer(): FlatRow[] {
    const out: FlatRow[] = []
    // Group orders by customer, keeping first-seen ordering for stability.
    const byCustomer = new Map<string, ProductionOrder[]>()
    for (const po of this.filteredOrders) {
      const list = byCustomer.get(po.customer) ?? []
      list.push(po)
      byCustomer.set(po.customer, list)
    }
    for (const [customer, orders] of byCustomer) {
      const custKey = `customer::${customer}`
      const commitment = orders.reduce((s, o) => s + o.qty, 0)
      const outWafers = orders.reduce((s, o) => s + o.outWafers, 0)
      const earliestStart = orders.reduce((a, o) => (o.waferStart < a ? o.waferStart : a), orders[0].waferStart)
      const latestEnd = orders.reduce((a, o) => (o.end > a ? o.end : a), orders[0].end)
      out.push({
        key: custKey,
        kind: 'customer',
        depth: 0,
        expanded: this.isCustomerExpanded(customer),
        hasChildren: orders.length > 0,
        label: customer,
        customerShort: orders[0].customerShort,
        customer,
        commitment,
        outWafers,
        scheduleClass: 'fixed',
        startDate: earliestStart,
        endDate: latestEnd,
        poId: orders[0].id,
      })
      if (!this.isCustomerExpanded(customer)) continue
      for (const po of orders) {
        this.pushPoRows(out, po, 1, custKey)
      }
    }
    return out
  }

  private pushPoRows(out: FlatRow[], po: ProductionOrder, baseDepth: 0 | 1, parentKey?: string) {
    const poKey = `po::${po.id}`
    const poRatio = po.qty > 0 ? po.outWafers / po.qty : 0
    out.push({
      key: poKey,
      kind: 'po',
      depth: baseDepth,
      parentKey,
      expanded: this.expandedOrderIds.has(po.id),
      hasChildren: po.schedule.length > 0,
      label: po.id,
      customerShort: po.customerShort,
      customer: po.customer,
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
    if (!this.expandedOrderIds.has(po.id)) return
    const famDepth = (baseDepth + 1) as 1 | 2
    const batchDepth = (baseDepth + 2) as 2 | 3
    for (const family of po.schedule) {
      const famKey = `family::${family.id}`
      out.push({
        key: famKey,
        kind: 'family',
        depth: famDepth,
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
          depth: batchDepth,
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

  // ---- undo / redo / reset / save (mock) -------------------------------------
  get canUndo() {
    return this.historyCount > 0
  }

  get canRedo() {
    return this.futureCount > 0
  }

  // Mirrors SimulationStore.unsavedEditsCount so EpsScheduleActions can drive the
  // "N unsaved" chip + Submit-to-baseline enablement uniformly across panels.
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
    this.resetFilters()
    this.statusFilter = 'all'
  }

  save() {
    this.historyCount = 0
    this.futureCount = 0
  }

  // ---- planner mutations (in-memory only; will move to BE later) -----------------
  // Edit the target wafer-out for a single batch. The PO/family rollups recompute automatically
  // because flatRows derives commitment by summing batches.
  setBatchWaferCount(poId: string, familyId: string, batchId: string, count: number) {
    const order = this.orders.find((o) => o.id === poId)
    const family = order?.schedule.find((f) => f.id === familyId)
    const batch = family?.batches.find((b) => b.id === batchId)
    if (!batch) return
    batch.waferCount = Math.max(0, Math.floor(count))
    // Splitting/editing a batch transitions it into the 'changes' class — it's no longer "as planned".
    if (batch.scheduleClass === 'fixed') batch.scheduleClass = 'changes'
    this.markEdited()
  }

  // Split a batch in two equal halves, keeping the original schedule window. The first half keeps
  // the original id (renamed to "/A"), the second half is appended right after (id suffix "/B").
  splitBatch(poId: string, familyId: string, batchId: string) {
    const order = this.orders.find((o) => o.id === poId)
    const family = order?.schedule.find((f) => f.id === familyId)
    if (!family) return
    const idx = family.batches.findIndex((b) => b.id === batchId)
    if (idx < 0) return
    const original = family.batches[idx]
    if (original.waferCount < 2) return // nothing meaningful to split
    const half = Math.floor(original.waferCount / 2)
    const remainder = original.waferCount - half
    original.waferCount = remainder
    if (original.scheduleClass === 'fixed') original.scheduleClass = 'changes'
    // Strip any prior /A or /B suffix from the original name, then append /A.
    const baseName = original.name.replace(/\/[AB]$/, '')
    original.name = `${baseName}/A`
    const newBatch: ScheduleBatch = {
      id: `${baseName}_split_${Date.now()}`,
      name: `${baseName}/B`,
      waferCount: half,
      start: original.start,
      end: original.end,
      durationDays: original.durationDays,
      status: original.status,
      scheduleClass: 'new',
      toolGroup: original.toolGroup,
      note: `Split from ${baseName}`,
    }
    family.batches.splice(idx + 1, 0, newBatch)
    this.markEdited()
  }

  // Append a new batch at the end of a family. Defaults: 100 wafers, 5-day window starting right after
  // the previous batch ends (or the family start if there were no batches yet). Marked as 'new' schedule.
  addBatch(poId: string, familyId: string) {
    const order = this.orders.find((o) => o.id === poId)
    const family = order?.schedule.find((f) => f.id === familyId)
    if (!family) return
    const last = family.batches[family.batches.length - 1]
    const startDate = last?.end ?? family.start
    const endDate = addDays(startDate, 5)
    const newBatch: ScheduleBatch = {
      id: `b${family.batches.length + 1}_${Date.now()}`,
      name: `B-${family.batches.length + 1}`,
      waferCount: 100,
      start: startDate,
      end: endDate,
      durationDays: 5,
      status: 'on-track',
      scheduleClass: 'new',
    }
    family.batches.push(newBatch)
    this.markEdited()
  }

  // Append a new family to a PO with one default batch. Uses the first existing family's tech as a hint;
  // falls back to a sensible default for a fresh order.
  addFamily(poId: string) {
    const order = this.orders.find((o) => o.id === poId)
    if (!order) return
    const seedTech = order.schedule[0]?.tech ?? 'T-V9-128L'
    const newFamilyId = `fam-${order.id.slice(-3)}-new-${order.schedule.length + 1}`
    const startDate = order.waferStart
    const endDate = addDays(startDate, 7)
    const newFamily: ScheduleFamily = {
      id: newFamilyId,
      label: `${order.family}-N${order.schedule.length + 1}`,
      tech: seedTech,
      priority: order.priority,
      start: startDate,
      end: endDate,
      durationDays: 7,
      status: 'on-track',
      scheduleClass: 'new',
      batches: [
        {
          id: 'b1',
          name: 'B-1',
          waferCount: 100,
          start: startDate,
          end: addDays(startDate, 5),
          durationDays: 5,
          status: 'on-track',
          scheduleClass: 'new',
        },
      ],
    }
    order.schedule.push(newFamily)
    // Auto-expand the new family so the planner sees its (default) batch right away.
    this.expandedOrderIds.add(poId)
    this.expandedFamilyIds.add(newFamilyId)
    this.markEdited()
  }

  // Remove a batch. Used by the info panel "Remove batch" action — a running batch (scheduleClass === 'fixed')
  // is intentionally not removed; the UI should hide the action in that case.
  removeBatch(poId: string, familyId: string, batchId: string) {
    const order = this.orders.find((o) => o.id === poId)
    const family = order?.schedule.find((f) => f.id === familyId)
    if (!family) return
    const idx = family.batches.findIndex((b) => b.id === batchId)
    if (idx < 0) return
    if (family.batches[idx].scheduleClass === 'fixed') return
    family.batches.splice(idx, 1)
    if (this.selectedRowKey === `batch::${familyId}::${batchId}`) {
      this.selectedRowKey = `family::${familyId}`
    }
    this.markEdited()
  }
}
