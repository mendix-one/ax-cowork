import type { ProductionOrder, ScheduleClass } from '../data/mock-plan'
import type { FlatRow } from '../stores/order.store'

// The simulation store's adjustment tree keys use po::/pf::/mb:: prefixes (one per node type), while the
// PO table rows use po::/family::/batch:: keys. Convert a PO-table row into its simulation tree key so we
// can ask `simulation.checkedKeys` whether the row is currently included in the schedule.
export const simulationKeyForRow = (row: FlatRow): string | null => {
  if (row.kind === 'po') return `po::${row.poId}`
  if (row.kind === 'family' && row.familyId) return `pf::${row.poId}::${row.familyId}`
  if (row.kind === 'batch' && row.familyId && row.batchId) return `mb::${row.poId}::${row.familyId}::${row.batchId}`
  return null
}

// Same key-building for direct order/family/batch references (used outside the row context — e.g. the
// info panel's Exclude button looks up the simulation key from the order object).
export const simulationKeyForOrder = (poId: string) => `po::${poId}`
export const simulationKeyForFamily = (poId: string, familyId: string) => `pf::${poId}::${familyId}`
export const simulationKeyForBatch = (poId: string, familyId: string, batchId: string) => `mb::${poId}::${familyId}::${batchId}`

// Per-entity notes key builders (used with po.getNotes / addNote / removeNote).
export const noteKeyForOrder = (poId: string) => `po::${poId}`
export const noteKeyForFamily = (familyId: string) => `family::${familyId}`
export const noteKeyForBatch = (familyId: string, batchId: string) => `batch::${familyId}::${batchId}`

// Effective state: 'exclude' when this row's simulation tree key isn't in checkedKeys; otherwise the row's
// own scheduleClass. Customer-pivot rows have no own state.
export const stateForRow = (row: FlatRow, checkedSet: Set<string>): ScheduleClass | 'exclude' | undefined => {
  if (row.kind === 'customer') return undefined
  const k = simulationKeyForRow(row)
  if (k && !checkedSet.has(k)) return 'exclude'
  return row.scheduleClass
}

// Mock wafer-state split. Backend will eventually return started/processing/completed per node;
// for now we synthesize plausible values from outWafers + scheduleClass so the columns are populated.
export type WaferStates = { started: number; processing: number; completed: number }
const ZERO: WaferStates = { started: 0, processing: 0, completed: 0 }
export const waferStatesForRow = (orders: ProductionOrder[], row: FlatRow): WaferStates => {
  const order = orders.find((o) => o.id === row.poId)
  if (!order) return ZERO

  // PO: completed = outWafers. processing = small chunk of remaining when running.
  if (row.kind === 'po') return waferStatesForOrder(order)

  // Family: proportional split of the PO numbers by family commitment.
  if (row.kind === 'family' && row.familyId) {
    const family = order.schedule.find((f) => f.id === row.familyId)
    if (!family || order.qty === 0) return ZERO
    const familyCommitment = family.batches.reduce((s, b) => s + b.waferCount, 0)
    const ratio = familyCommitment / order.qty
    const po = waferStatesForOrder(order)
    return {
      started: Math.round(po.started * ratio),
      processing: Math.round(po.processing * ratio),
      completed: Math.round(po.completed * ratio),
    }
  }

  // Batch: scheduleClass decides — fixed (already locked) = half done / half in flight; changes
  // (edited from baseline) = started but nothing complete; new (just added) = not started.
  if (row.kind === 'batch' && row.familyId && row.batchId) {
    const family = order.schedule.find((f) => f.id === row.familyId)
    const batch = family?.batches.find((b) => b.id === row.batchId)
    if (!batch) return ZERO
    if (batch.scheduleClass === 'fixed') {
      const half = Math.round(batch.waferCount * 0.5)
      return { started: batch.waferCount, processing: half, completed: batch.waferCount - half }
    }
    if (batch.scheduleClass === 'changes') {
      const half = Math.round(batch.waferCount * 0.5)
      return { started: half, processing: half, completed: 0 }
    }
    return ZERO
  }

  return ZERO
}

// Order-level wafer math — extracted so the info panel can call it directly with an order object.
export const waferStatesForOrder = (order: ProductionOrder): WaferStates => {
  const completed = order.outWafers
  const remaining = Math.max(0, order.qty - completed)
  const processing = order.poStatus === 'RUNNING' ? Math.min(remaining, Math.round(order.qty * 0.05)) : 0
  return { started: completed + processing, processing, completed }
}

// Planner-facing free-text remark for the row. Currently driven by hotLot / poStatus heuristics
// + per-batch note. Once the BE supports per-row remarks this will read from the store directly.
export const remarkForRow = (orders: ProductionOrder[], row: FlatRow): string => {
  if (row.kind === 'po') {
    const order = orders.find((o) => o.id === row.poId)
    return order ? remarkForOrder(order) : ''
  }
  if (row.kind === 'batch' && row.familyId && row.batchId) {
    const order = orders.find((o) => o.id === row.poId)
    const family = order?.schedule.find((f) => f.id === row.familyId)
    return family?.batches.find((b) => b.id === row.batchId)?.note ?? ''
  }
  return ''
}

export const remarkForOrder = (order: ProductionOrder): string => {
  if (order.hotLot) return 'Hot lot — escalated by customer'
  if (order.poStatus === 'at-risk') return 'At risk — review priorities'
  if (order.poStatus === 'slipped') return 'Slipped — recovery plan needed'
  if (order.poStatus === 'ON HOLD') return 'On hold — awaiting customer confirmation'
  // Mock per-PO operational notes so the column is populated for the concept.
  if (order.id.endsWith('118')) return 'Tool group HARC Etch high load for this PO'
  if (order.id.endsWith('119')) return 'Watch CMP utilisation in week 2'
  return ''
}
