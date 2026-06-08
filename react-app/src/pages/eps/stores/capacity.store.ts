import { makeAutoObservable } from 'mobx'
import { MOCK_DIVISIONS, MOCK_FLAT_CELLS, type Division } from '../data/mock-plan'
import { aggregateSkills, cellsUnderNode, orgNodeMeta } from '../helpers/capacity.helpers'

// Capacity (Headcount Portfolio) store — the org tree on the left drives the per-node
// summary + detail table on the right. The portfolio is master data, synced from the HR system.

export type ConstraintsScope = 'node' | 'all'

export class CapacityStore {
  divisions: Division[] = MOCK_DIVISIONS

  // Default to the first division so the summary + detail table open on a rolled-up view.
  selectedNodeId: string = MOCK_DIVISIONS[0].id

  constraintsScope: ConstraintsScope = 'node'

  // The Headcount Portfolio is master data — owned by the HR system and synced in, not edited here.
  readonly source = 'GHRP'
  readonly syncedAt = '2026-05-04 06:00 KST'

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

  // ---- Master-data rollups for the selected org node --------------------------------------------
  get selectedMeta() {
    return orgNodeMeta(this.selectedNodeId)
  }

  // Every Cell under the selected org node — the rows of the detail table.
  get selectedCells() {
    return cellsUnderNode(this.selectedNodeId)
  }

  // Skill totals across the selected subtree, sorted by count (desc) — the skill axis of the matrix.
  get selectedSkillTotals() {
    return aggregateSkills(this.selectedCells)
  }

  get selectedHeadcount(): number {
    return this.selectedCells.reduce((sum, e) => sum + e.cell.headcount, 0)
  }
}
