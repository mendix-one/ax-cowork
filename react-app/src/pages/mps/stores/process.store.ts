import { makeAutoObservable } from 'mobx'
import { TECH_ROUTINGS } from '../data/mock-plan'

// UI state for the Production Processes view. Read-only against TECH_ROUTINGS — the planner picks a tech
// on the left and the right side shows the pipeline + routing matrix derived from that selection.
export class ProcessStore {
  selectedTech: string = TECH_ROUTINGS[0].tech

  // Adjustment sidebar visibility — uses the shared adjustment tree (simulation.checkedKeys) so the planner
  // can see the per-tech impact of the current selection (e.g. uncheck a 232L PO → 232L row disappears).
  filterSidebarOpen = false

  constructor() {
    makeAutoObservable(this)
  }

  selectTech(tech: string) {
    this.selectedTech = tech
  }

  toggleFilterSidebar() {
    this.filterSidebarOpen = !this.filterSidebarOpen
  }
}
