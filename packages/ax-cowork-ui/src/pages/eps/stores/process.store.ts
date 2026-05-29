import { makeAutoObservable } from 'mobx'
import { MOCK_PROCESS_NODES } from '../data/mock-plan'

// Engineering Process panel — left tree is the Stage → Block → Function → Activity catalog.
// Selecting a node drives the pipeline + detail tables on the right.
export class ProcessStore {
  // Default: the first Stage so the panel doesn't open empty.
  selectedNodeId: string = MOCK_PROCESS_NODES.find((p) => p.level === 'stage')?.id ?? MOCK_PROCESS_NODES[0].id

  // Adjustment sidebar visibility (uses the shared simulation.checkedKeys).
  filterSidebarOpen = false

  constructor() {
    makeAutoObservable(this)
  }

  selectNode(id: string) {
    this.selectedNodeId = id
  }

  toggleFilterSidebar() {
    this.filterSidebarOpen = !this.filterSidebarOpen
  }
}
