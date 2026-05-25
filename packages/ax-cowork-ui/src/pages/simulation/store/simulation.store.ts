import { makeAutoObservable } from 'mobx'
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
  regionRight: 'normal',
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

  private rightVisibleBeforeMaximize = true

  constructor() {
    makeAutoObservable(this)
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
      return
    }
    this.panelStates[id] = 'maximized'
  }

  restore(id: PanelId) {
    if (id === MAIN_PANEL_ID) {
      if (!this.rightVisibleBeforeMaximize) this.activeSubPanel = 'aiChat'
      this.panelStates[SUB_REGION_ID] = 'normal'
      return
    }
    this.panelStates[id] = 'normal'
  }

  hide(id: PanelId) {
    if (id === SUB_REGION_ID) this.rightVisibleBeforeMaximize = false
    this.panelStates[id] = 'hidden'
  }

  setActiveMainPanel(id: MainPanelId) {
    this.activeMainPanel = id
  }

  toggleSubPanel(id: SubPanelId) {
    if (this.activeSubPanel === id && this.panelStates[SUB_REGION_ID] !== 'hidden') {
      this.rightVisibleBeforeMaximize = false
      this.panelStates[SUB_REGION_ID] = 'hidden'
    } else {
      this.activeSubPanel = id
      this.panelStates[SUB_REGION_ID] = 'normal'
    }
  }
}

export const simulationStore = new SimulationStore()
