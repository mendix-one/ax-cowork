import { makeAutoObservable } from 'mobx'
import { readJson, writeJson } from '@/acore/storage'
import { NotesStore } from './notes.store'
import { SimulationStore } from './simulation.store'
import { AnalysisStore } from './analysis.store'
import { OrderStore } from './order.store'
import { ProcessStore } from './process.store'
import { CapacityStore } from './capacity.store'
import { ProcessTuningStore } from './process-tuning.store'
import { CapacityTuningStore } from './capacity-tuning.store'
import { IntegrationStore } from './integration.store'
import { CompareStore } from './compare.store'
import { AIChatStore } from './ai-chat.store'
import { BackgroundTasksStore } from './background.store'
import { HistoryStore } from './history.store'
import { RecommendationsStore } from './recommendations.store'

export type PanelId = 'regionLeft' | 'regionRight'
export type PanelState = 'normal' | 'maximized' | 'hidden'
export type PanelStates = Record<PanelId, PanelState>

export type MainPanelId = 'simulation' | 'analysis' | 'orders' | 'processes' | 'capacity' | 'processTuning' | 'capacityTuning' | 'integration'
export type SubPanelId = 'compare' | 'aiChat' | 'background' | 'history' | 'recommendations'

export type ProductionLine = {
  id: string
  name: string
  description?: string
}

export type EpsPlan = {
  id: string
  name: string
  description?: string
}

const MAIN_PANEL_ID: PanelId = 'regionLeft'
const SUB_REGION_ID: PanelId = 'regionRight'

const initialStates: PanelStates = {
  regionLeft: 'normal',
  regionRight: 'hidden',
}

// --- Shell-state persistence ----------------------------------------------------------------------------------------
// Only the UI shell (which panel is active + region layout) is persisted to localStorage so a reload
// doesn't bounce the user back to defaults. Business state (adjustment tree, date ranges, brush, etc.)
// stays in memory — it will live on the backend once the BE is wired in.
// The key is versioned so adding/removing a panel ID later invalidates stale entries via the guard.
const SHELL_STORAGE_KEY = 'ax.eps.shell.v1'

const MAIN_PANEL_IDS: readonly MainPanelId[] = ['simulation', 'analysis', 'orders', 'processes', 'capacity', 'processTuning', 'capacityTuning', 'integration']
const SUB_PANEL_IDS: readonly SubPanelId[] = ['compare', 'aiChat', 'background', 'history', 'recommendations']
const PANEL_REGION_IDS: readonly PanelId[] = ['regionLeft', 'regionRight']
const PANEL_STATE_VALUES: readonly PanelState[] = ['normal', 'maximized', 'hidden']

type PersistedShellState = {
  activeMainPanel: MainPanelId
  activeSubPanel: SubPanelId
  panelStates: PanelStates
}

const isPersistedShellState = (v: unknown): v is PersistedShellState => {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  if (!MAIN_PANEL_IDS.includes(o.activeMainPanel as MainPanelId)) return false
  if (!SUB_PANEL_IDS.includes(o.activeSubPanel as SubPanelId)) return false
  if (!o.panelStates || typeof o.panelStates !== 'object') return false
  const ps = o.panelStates as Record<string, unknown>
  for (const region of PANEL_REGION_IDS) {
    if (!PANEL_STATE_VALUES.includes(ps[region] as PanelState)) return false
  }
  return true
}

// EPS = IRIS Resource Planning workspace. A planning workspace is scoped to a Samsung DSR
// Business Unit + Site + Fiscal Year (e.g. Hwaseong · Memory BU · FY2026). The field stays
// named `ProductionLine` so the rest of the shell (modals, top header chip, store wiring)
// is identical to MPS; only the seed data and human label differ.
const PRODUCTION_LINES: ProductionLine[] = [
  { id: 'memory-hwaseong', name: 'Hwaseong · Memory BU', description: 'DRAM + NAND development — Hwaseong HQ' },
  { id: 'lsi-hwaseong', name: 'Hwaseong · System LSI', description: 'Exynos / Mobile AP roadmap — Hwaseong HQ' },
  { id: 'cis-hwaseong', name: 'Hwaseong · CIS', description: 'ISOCELL image sensor family — Hwaseong HQ' },
  { id: 'memory-pyeongtaek', name: 'Pyeongtaek · Memory BU', description: 'HBM + advanced packaging — Pyeongtaek' },
]

// Roadmap versions + simulation variants. Mirrors IRIS Concept D (Diff & Delta) + Concept B
// (Simulation Sandbox). V6 is the current approved baseline; S1-V2 is the in-flight HBM4
// acceleration what-if. V5 is kept so the planner can run a diff against the predecessor.
const EPS_PLANS: EpsPlan[] = [
  { id: 'v6-approved', name: 'Roadmap V6 (Approved)', description: 'Current approved baseline — last PROMIS-synced 2026-03-15' },
  { id: 'v7-draft', name: 'Roadmap V7 (Draft)', description: 'Working draft — pending Minho Kim approval' },
  { id: 's1-v2-hbm4', name: 'S1-V2 · HBM4 Acceleration', description: 'Sandbox — move 5 engineers NAND-V9 → HBM4-Dev from Sep 2026' },
  { id: 's2-v1-dram', name: 'S2-V1 · DDR5-Gen5 Pull-in', description: 'Sandbox — pull DDR5-Gen5 6 weeks earlier; 5% overtime model' },
  { id: 'v5-archived', name: 'Roadmap V5 (Archived)', description: 'Previous approved baseline — useful for V6↔V5 diff' },
]

export class EpsStore {
  panelStates: PanelStates = { ...initialStates }
  activeMainPanel: MainPanelId = 'simulation'
  activeSubPanel: SubPanelId = 'aiChat'

  productionLines: ProductionLine[] = PRODUCTION_LINES
  epsPlans: EpsPlan[] = EPS_PLANS
  activeProductionLineId: string = PRODUCTION_LINES[0].id
  activeEpsPlanId: string = EPS_PLANS[0].id
  productionLineModalOpen = false
  epsPlanModalOpen = false
  // Pre-flight Save validation — null = closed; string identifies which save flow triggered it so the
  // confirm action can dispatch to the right store.
  preflightTarget: 'simulation' | 'orders' | null = null

  simulation = new SimulationStore()
  analysis = new AnalysisStore()
  order = new OrderStore()
  process = new ProcessStore()
  capacity = new CapacityStore()
  processTuning = new ProcessTuningStore()
  capacityTuning = new CapacityTuningStore()
  integration = new IntegrationStore()

  notes = new NotesStore()

  compare = new CompareStore()
  aiChat = new AIChatStore()
  background = new BackgroundTasksStore()
  history = new HistoryStore()
  recommendations = new RecommendationsStore()

  private rightVisibleBeforeMaximize = false

  constructor() {
    // Hydrate shell-only state from localStorage. A failed guard (missing key, schema bump, tampered JSON)
    // falls through to the field initializers above.
    const persisted = readJson(SHELL_STORAGE_KEY, isPersistedShellState)
    if (persisted) {
      this.activeMainPanel = persisted.activeMainPanel
      this.activeSubPanel = persisted.activeSubPanel
      this.panelStates = { ...persisted.panelStates }
    }
    makeAutoObservable(this)
  }

  // Sync the persisted slice — called at the end of every mutator that touches shell state.
  private persistShell() {
    writeJson(SHELL_STORAGE_KEY, {
      activeMainPanel: this.activeMainPanel,
      activeSubPanel: this.activeSubPanel,
      panelStates: this.panelStates,
    })
  }

  get activeProductionLine(): ProductionLine {
    return this.productionLines.find((line) => line.id === this.activeProductionLineId) ?? this.productionLines[0]
  }

  get activeEpsPlan(): EpsPlan {
    return this.epsPlans.find((plan) => plan.id === this.activeEpsPlanId) ?? this.epsPlans[0]
  }

  // Aggregate dirty count across editable panels — drives the header "unsaved edits" chip so the planner has
  // the same signal whether they're on the Gantt, the Production Order table, or any other panel.
  get totalUnsavedEdits(): number {
    return this.simulation.unsavedEditsCount + this.order.unsavedEditsCount
  }

  setActiveProductionLine(id: string) {
    this.activeProductionLineId = id
  }

  setActiveEpsPlan(id: string) {
    this.activeEpsPlanId = id
  }

  openProductionLineModal() {
    this.productionLineModalOpen = true
  }

  closeProductionLineModal() {
    this.productionLineModalOpen = false
  }

  openEpsPlanModal() {
    this.epsPlanModalOpen = true
  }

  closeEpsPlanModal() {
    this.epsPlanModalOpen = false
  }

  isHidden(id: PanelId): boolean {
    return this.panelStates[id] === 'hidden'
  }

  // Main panel is considered "maximized" whenever no sub panel is on screen — the right region being hidden.
  isMaximized(id: PanelId): boolean {
    if (id === MAIN_PANEL_ID) return this.panelStates[SUB_REGION_ID] === 'hidden'
    return this.panelStates[id] === 'maximized'
  }

  maximize(id: PanelId) {
    if (id === MAIN_PANEL_ID) {
      this.rightVisibleBeforeMaximize = this.panelStates[SUB_REGION_ID] !== 'hidden'
      this.panelStates[SUB_REGION_ID] = 'hidden'
      this.persistShell()
      return
    }
    this.panelStates[id] = 'maximized'
    this.persistShell()
  }

  restore(id: PanelId) {
    if (id === MAIN_PANEL_ID) {
      if (!this.rightVisibleBeforeMaximize) this.activeSubPanel = 'aiChat'
      this.panelStates[SUB_REGION_ID] = 'normal'
      this.persistShell()
      return
    }
    this.panelStates[id] = 'normal'
    this.persistShell()
  }

  hide(id: PanelId) {
    if (id === SUB_REGION_ID) this.rightVisibleBeforeMaximize = false
    this.panelStates[id] = 'hidden'
    this.persistShell()
  }

  setActiveMainPanel(id: MainPanelId) {
    this.activeMainPanel = id
    this.persistShell()
  }

  toggleSubPanel(id: SubPanelId) {
    if (this.activeSubPanel === id && this.panelStates[SUB_REGION_ID] !== 'hidden') {
      this.rightVisibleBeforeMaximize = false
      this.panelStates[SUB_REGION_ID] = 'hidden'
    } else {
      this.activeSubPanel = id
      this.panelStates[SUB_REGION_ID] = 'normal'
    }
    this.persistShell()
  }

  // ---- Cross-view drill-through helpers --------------------------------------
  // Jump to Headcount Portfolio with the org node (cell/team/site/division) pre-selected.
  navigateToOrgNode(nodeId: string) {
    this.capacity.selectNode(nodeId)
    this.setActiveMainPanel('capacity')
  }

  // Jump to Engineering Process with the catalog node pre-selected.
  navigateToProcessNode(nodeId: string) {
    this.process.selectNode(nodeId)
    this.setActiveMainPanel('processes')
  }

  // Jump to Production Requirements with the PF pre-selected.
  navigateToProductionFamily(pfId: string, opts?: { openInfo?: boolean }) {
    this.order.selectRow(`pf::${pfId}`)
    if (opts?.openInfo !== false) this.order.infoPanelOpen = true
    this.setActiveMainPanel('orders')
  }

  // Jump to Production Requirements with a sub-task pre-selected.
  navigateToSubTask(pfId: string, taskId: string, subId: string) {
    this.order.selectRow(`sub::${taskId}::${subId}`)
    this.order.expandedPfIds.add(pfId)
    this.order.expandedTaskIds.add(taskId)
    this.order.infoPanelOpen = true
    this.setActiveMainPanel('orders')
  }

  // ---- Pre-flight Save flow --------------------------------------------------
  openPreflight(target: 'simulation' | 'orders') {
    this.preflightTarget = target
  }

  closePreflight() {
    this.preflightTarget = null
  }

  // Confirm the pending save: dispatches to the right per-panel save() then closes the modal.
  confirmPreflight() {
    if (this.preflightTarget === 'simulation') this.simulation.save()
    else if (this.preflightTarget === 'orders') this.order.save()
    this.preflightTarget = null
  }
}

export const epsStore = new EpsStore()
