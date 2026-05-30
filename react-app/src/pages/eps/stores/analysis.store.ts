import { makeAutoObservable } from 'mobx'

// Heatmap granularity — drives bucket size in the workload-heatmap section.
export type HeatGranularity = 'day' | 'month' | 'quarter' | 'year'

// UI-only state for the Analysis view. All numeric analytics are *derived* in components
// from the simulation store (filtered orders) + the shared mock-plan capacity dataset, so the
// adjustment tree in the sidebar instantly propagates into every chart.
export class AnalysisStore {
  // Sidebar visibility — independent per view; the underlying adjustment state lives on SimulationStore.
  filterSidebarOpen = true

  // Toolbar date range — defaults are aligned with the master production planning horizon.
  // When the user brushes the shop-floor area chart we narrow only the *bar-chart* range
  // (capacityBrush), without touching this top-level range.
  startDate = '2026-04-29'
  endDate = '2026-05-12'

  // Range selected via the shop-floor area chart's brush — null means "use full horizon".
  // Only the tool-group bar chart consumes this; the area chart itself uses the toolbar range.
  capacityBrush: { start: string; end: string } | null = null

  // Workload heatmap bucket size.
  heatGranularity: HeatGranularity = 'day'

  constructor() {
    makeAutoObservable(this)
  }

  toggleFilterSidebar() {
    this.filterSidebarOpen = !this.filterSidebarOpen
  }

  setDateRange(start: string, end: string) {
    this.startDate = start
    this.endDate = end
  }

  setShopFloorBrush(range: { start: string; end: string } | null) {
    this.capacityBrush = range
  }

  clearShopFloorBrush() {
    this.capacityBrush = null
  }

  setHeatGranularity(value: HeatGranularity) {
    this.heatGranularity = value
  }
}
