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

export type MpsPlan = {
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
const SHELL_STORAGE_KEY = 'ax.simulation.shell.v1'

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

const PRODUCTION_LINES: ProductionLine[] = [
  { id: 'm-soc', name: 'M-SOC', description: 'Mobile SoC line' },
  { id: 'auto-sensor', name: 'Auto Sensor', description: 'Automotive sensor line' },
  { id: 'memory-x', name: 'Memory X', description: 'Memory packaging line' },
]

const MPS_PLANS: MpsPlan[] = [
  { id: 'plan-a', name: 'Plan A (Simulation)', description: 'Baseline scenario — Sarah’s default working plan' },
  { id: 'plan-b', name: 'Plan B (Simulation)', description: 'AI-proposed reroute around HARC overload' },
  { id: 'plan-c', name: 'Plan C (Simulation)', description: 'Cost-optimized scenario' },
  { id: 'published', name: 'Published Plan', description: 'Currently published plan on the floor' },
]

export class MpsStore {
  panelStates: PanelStates = { ...initialStates }
  activeMainPanel: MainPanelId = 'simulation'
  activeSubPanel: SubPanelId = 'aiChat'

  productionLines: ProductionLine[] = PRODUCTION_LINES
  mpsPlans: MpsPlan[] = MPS_PLANS
  activeProductionLineId: string = PRODUCTION_LINES[0].id
  activeMpsPlanId: string = MPS_PLANS[0].id
  productionLineModalOpen = false
  mpsPlanModalOpen = false
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

  get activeMpsPlan(): MpsPlan {
    return this.mpsPlans.find((plan) => plan.id === this.activeMpsPlanId) ?? this.mpsPlans[0]
  }

  // Aggregate dirty count across editable panels — drives the header "unsaved edits" chip so the planner has
  // the same signal whether they're on the Gantt, the Production Order table, or any other panel.
  get totalUnsavedEdits(): number {
    return this.simulation.unsavedEditsCount + this.order.unsavedEditsCount
  }

  setActiveProductionLine(id: string) {
    this.activeProductionLineId = id
  }

  setActiveMpsPlan(id: string) {
    this.activeMpsPlanId = id
  }

  openProductionLineModal() {
    this.productionLineModalOpen = true
  }

  closeProductionLineModal() {
    this.productionLineModalOpen = false
  }

  openMpsPlanModal() {
    this.mpsPlanModalOpen = true
  }

  closeMpsPlanModal() {
    this.mpsPlanModalOpen = false
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
  // These switch the active main panel *and* set the relevant sub-store selection in one call so any
  // place in the UI can do `simulation.navigateToToolGroup('HARC Etch')` without knowing the target store.
  navigateToToolGroup(toolGroupName: string) {
    const group = this.capacity.groups.find((g) => g.name === toolGroupName)
    if (group) this.capacity.selectGroup(group.id)
    this.setActiveMainPanel('capacity')
  }

  navigateToConstraint(constraintId: string) {
    // Constraints are scoped per tool group on the Shop Floor view; pick the group that owns the constraint.
    // The data lives in mock-plan but we don't want to import it here — the helpers expose enough.
    // Caller usually knows the tool group; fall through to Shop Floor either way.
    void constraintId
    this.setActiveMainPanel('capacity')
    this.capacity.setConstraintsScope('all')
  }

  navigateToTechRouting(tech: string) {
    this.process.selectTech(tech)
    this.setActiveMainPanel('processes')
  }

  navigateToOrder(poId: string, opts?: { openInfo?: boolean }) {
    this.order.selectRow(`po::${poId}`)
    if (opts?.openInfo !== false) this.order.infoPanelOpen = true
    this.setActiveMainPanel('orders')
  }

  navigateToBatch(poId: string, familyId: string, batchId: string) {
    this.order.selectRow(`batch::${familyId}::${batchId}`)
    this.order.expandedOrderIds.add(poId)
    this.order.expandedFamilyIds.add(familyId)
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

export const mpsStore = new MpsStore()
