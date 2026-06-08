import { makeAutoObservable } from 'mobx'

type CheckedMap = Record<string, string[]>

const cloneMap = (map: CheckedMap): CheckedMap => Object.fromEntries(Object.entries(map).map(([k, v]) => [k, [...v]]))

// True when two checked-maps differ. A group absent from a map means "all selected" (the default), so a
// group managed in one map but not the other counts as a difference.
const mapsDiffer = (a: CheckedMap, b: CheckedMap): boolean => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const k of keys) {
    const av = a[k]
    const bv = b[k]
    if (av === undefined || bv === undefined) return true
    if (av.length !== bv.length) return true
    const bset = new Set(bv)
    if (!av.every((x) => bset.has(x))) return true
  }
  return false
}

// Factor-filter state for the Simulation gantt. The panel mirrors the Factors Control dimensions: one group
// for the Organization hierarchy and one per Engineering Process hierarchy.
//
// Selections are edited in `pending`; Apply commits them to `applied` (what eventually drives the gantt),
// Reset clears everything back to the default. A hierarchy ABSENT from a map means "all selected", so we
// never enumerate every member up front and factors added in Factors Control are included automatically.
export class SimFilterStore {
  applied: CheckedMap = {}
  pending: CheckedMap = {}
  // Quick-search query (view-only — not part of the Apply cycle).
  query = ''

  constructor() {
    makeAutoObservable(this)
  }

  // ---- pending (what the tree binds to) ---------------------------------------------------------
  checkedFor(hierarchyId: string, allKeys: string[]): string[] {
    return hierarchyId in this.pending ? this.pending[hierarchyId] : allKeys
  }

  setChecked(hierarchyId: string, keys: string[]) {
    this.pending[hierarchyId] = keys
  }

  // Add (`on`) or remove (`!on`) a subset of member ids — used by the per-group All / None so that, while
  // searching, they act only on the matched (visible) items.
  setCheckedSubset(hierarchyId: string, keys: string[], on: boolean, allKeys: string[]) {
    const current = new Set(this.checkedFor(hierarchyId, allKeys))
    for (const k of keys) {
      if (on) current.add(k)
      else current.delete(k)
    }
    this.pending[hierarchyId] = [...current]
  }

  setQuery(q: string) {
    this.query = q
  }

  // ---- applied (what the gantt reads, once wired) -----------------------------------------------
  appliedFor(hierarchyId: string, allKeys: string[]): string[] {
    return hierarchyId in this.applied ? this.applied[hierarchyId] : allKeys
  }

  // ---- actions ----------------------------------------------------------------------------------
  apply() {
    this.applied = cloneMap(this.pending)
  }

  // Discard pending edits and clear the applied filter — back to "all selected".
  reset() {
    this.pending = {}
    this.applied = {}
    this.query = ''
  }

  // Enables Apply: the pending edits differ from what's currently applied.
  get hasPendingChanges(): boolean {
    return mapsDiffer(this.pending, this.applied)
  }

  // Enables Reset: there's something to clear (an edited/applied group or an active search).
  get anyFiltered(): boolean {
    return this.query.trim().length > 0 || Object.keys(this.pending).length > 0 || Object.keys(this.applied).length > 0
  }
}
