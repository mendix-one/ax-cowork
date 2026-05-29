import { makeAutoObservable } from 'mobx'
import { MOCK_DIVISIONS, MOCK_FLAT_CELLS, type Division } from '../data/mock-plan'

// Capacity (Headcount Portfolio) store — the org tree on the left drives the per-node
// charts on the right. Scope toggle switches between selected-node and all-org views.

export type ConstraintsScope = 'node' | 'all'

export class CapacityStore {
  divisions: Division[] = MOCK_DIVISIONS

  // Default selection — the first cell in the first division so the detail charts are populated.
  selectedNodeId: string = MOCK_FLAT_CELLS[0]?.ref.cellId ?? MOCK_DIVISIONS[0].id

  constraintsScope: ConstraintsScope = 'node'

  constructor() {
    makeAutoObservable(this)
  }

  selectNode(id: string) {
    this.selectedNodeId = id
  }

  setConstraintsScope(scope: ConstraintsScope) {
    this.constraintsScope = scope
  }

  // Convenience getter — the cell entry for the selected node (when a cell is selected); used by
  // detail components that want the headcount/skills breakdown directly.
  get selectedCellEntry() {
    return MOCK_FLAT_CELLS.find((e) => e.cell.id === this.selectedNodeId)
  }
}
