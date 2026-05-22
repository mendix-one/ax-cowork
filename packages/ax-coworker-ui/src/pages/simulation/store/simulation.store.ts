import { makeAutoObservable } from 'mobx'
import { AnalysisStore } from '../panels/analysis/analysis.store'
import { DatasetStore } from '../panels/dataset/dataset.store'
import { FactorStore } from '../panels/factor/factor.store'
import { GanttStore } from '../panels/gantt/gantt.store'
import { IntegrationStore } from '../panels/integration/integration.store'
import { ProjectStore } from '../panels/project/project.store'
import { SchemaStore } from '../panels/schema/schema.store'
import { SettingStore } from '../panels/setting/setting.store'
import { StandardStore } from '../panels/standard/standard.store'
import { TuningStore } from '../panels/tuning/tuning.store'

export type PanelId = 'regionLeft' | 'regionRight'
export type PanelState = 'normal' | 'maximized' | 'hidden'
export type PanelStates = Record<PanelId, PanelState>

export type MainPanelId = 'gantt' | 'analysis' | 'project' | 'dataset' | 'tuning' | 'factor' | 'standard' | 'setting' | 'integration' | 'schema'
export type SubPanelId = 'splitView' | 'aiAssistant' | 'progress'

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

const PRODUCTION_LINES: ProductionLine[] = [
  { id: 'm-soc', name: 'M-SOC', description: 'Mobile SoC line' },
  { id: 'auto-sensor', name: 'Auto Sensor', description: 'Automotive sensor line' },
  { id: 'memory-x', name: 'Memory X', description: 'Memory packaging line' },
]

const SIMULATION_PLANS: SimulationPlan[] = [
  { id: 'plan-a', name: 'Plan A (Simulation)', description: 'Baseline scenario' },
  { id: 'plan-b', name: 'Plan B (Simulation)', description: 'Throughput-optimized' },
  { id: 'plan-c', name: 'Plan C (Simulation)', description: 'Cost-optimized' },
]

export class SimulationStore {
  panelStates: PanelStates = { ...initialStates }
  activeMainPanel: MainPanelId = 'gantt'
  activeSubPanel: SubPanelId = 'aiAssistant'

  productionLines: ProductionLine[] = PRODUCTION_LINES
  simulationPlans: SimulationPlan[] = SIMULATION_PLANS
  activeProductionLineId: string = PRODUCTION_LINES[0].id
  activeSimulationPlanId: string = SIMULATION_PLANS[0].id
  productionLineModalOpen = false
  simulationPlanModalOpen = false

  gantt = new GanttStore()
  analysis = new AnalysisStore()
  project = new ProjectStore()
  dataset = new DatasetStore()
  tuning = new TuningStore()
  factor = new FactorStore()
  standard = new StandardStore()
  setting = new SettingStore()
  integration = new IntegrationStore()
  schema = new SchemaStore()

  private rightVisibleBeforeMaximize = false

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
  // This way the menu icon and toggle stay in sync even when the right region is closed via a Close button
  // or sidebar toggle (paths that never call maximize() directly).
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
      if (!this.rightVisibleBeforeMaximize) this.activeSubPanel = 'splitView'
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
