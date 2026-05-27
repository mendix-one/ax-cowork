import { makeAutoObservable } from 'mobx'
import { readJson, writeJson } from '@/acore/storage'
import { GanttStore } from '../panels/gantt/gantt.store'
import { AnalysisStore } from '../panels/analysis/analysis.store'
import { ProductionOrderStore } from '../panels/production-order/production-order.store'
import { ShopFloorStore } from '../panels/shop-floor/shop-floor.store'
import { ProcessTuningStore } from '../panels/process-tuning/process-tuning.store'
import { CapacityTuningStore } from '../panels/capacity-tuning/capacity-tuning.store'
import { DataIntegrationStore } from '../panels/data-integration/data-integration.store'
import { CompareStore } from '../panels/compare/compare.store'
import { AIChatStore } from '../panels/ai-chat/ai-chat.store'
import { BackgroundTasksStore } from '../panels/background/background.store'
import { HistoryStore } from '../panels/history/history.store'
import { RecommendationsStore } from '../panels/recommendations/recommendations.store'

export type PanelId = 'regionLeft' | 'regionRight'
export type PanelState = 'normal' | 'maximized' | 'hidden'
export type PanelStates = Record<PanelId, PanelState>

export type MainPanelId = 'gantt' | 'analysis' | 'productionOrder' | 'shopFloor' | 'processTuning' | 'capacityTuning' | 'dataIntegration'
export type SubPanelId = 'compare' | 'aiChat' | 'background' | 'history' | 'recommendations'

export type ProductionLine = {
  id: string
  name: string
  description?: string
}

export type SimulationPlan = {
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

const MAIN_PANEL_IDS: readonly MainPanelId[] = ['gantt', 'analysis', 'productionOrder', 'shopFloor', 'processTuning', 'capacityTuning', 'dataIntegration']
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

const SIMULATION_PLANS: SimulationPlan[] = [
  { id: 'plan-a', name: 'Plan A (Simulation)', description: 'Baseline scenario — Sarah’s default working plan' },
  { id: 'plan-b', name: 'Plan B (Simulation)', description: 'AI-proposed reroute around HARC overload' },
  { id: 'plan-c', name: 'Plan C (Simulation)', description: 'Cost-optimized scenario' },
  { id: 'published', name: 'Published Plan', description: 'Currently published plan on the floor' },
]

export class SimulationStore {
  panelStates: PanelStates = { ...initialStates }
  activeMainPanel: MainPanelId = 'gantt'
  activeSubPanel: SubPanelId = 'aiChat'

  productionLines: ProductionLine[] = PRODUCTION_LINES
  simulationPlans: SimulationPlan[] = SIMULATION_PLANS
  activeProductionLineId: string = PRODUCTION_LINES[0].id
  activeSimulationPlanId: string = SIMULATION_PLANS[0].id
  productionLineModalOpen = false
  simulationPlanModalOpen = false

  gantt = new GanttStore()
  analysis = new AnalysisStore()
  productionOrder = new ProductionOrderStore()
  shopFloor = new ShopFloorStore()
  processTuning = new ProcessTuningStore()
  capacityTuning = new CapacityTuningStore()
  dataIntegration = new DataIntegrationStore()

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

  get activeSimulationPlan(): SimulationPlan {
    return this.simulationPlans.find((plan) => plan.id === this.activeSimulationPlanId) ?? this.simulationPlans[0]
  }

  setActiveProductionLine(id: string) {
    this.activeProductionLineId = id
  }

  setActiveSimulationPlan(id: string) {
    this.activeSimulationPlanId = id
  }

  openProductionLineModal() {
    this.productionLineModalOpen = true
  }

  closeProductionLineModal() {
    this.productionLineModalOpen = false
  }

  openSimulationPlanModal() {
    this.simulationPlanModalOpen = true
  }

  closeSimulationPlanModal() {
    this.simulationPlanModalOpen = false
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
}

export const simulationStore = new SimulationStore()
