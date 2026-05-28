import { makeAutoObservable } from 'mobx'

export type CapacityTune = {
  id: string
  toolGroup: string
  deltaPct: number
  confidence: number
  modeledWspm: number
  realizedWspm: number
  driverHypothesis: string
  impact: string[]
  trend: number[]
}

const PENDING: CapacityTune[] = [
  {
    id: 'CG-005',
    toolGroup: 'HARC Etch',
    deltaPct: 4.5,
    confidence: 91,
    modeledWspm: 24300,
    realizedWspm: 25400,
    driverHypothesis: 'OEE improvement on ETC-43 / ETC-48 (+3 pp Avail)',
    impact: ['Allows 4 more lots/wk on HARC', 'Removes Cust C M1 slip (06-01 +4d → on time)', 'Bottleneck role unchanged'],
    trend: [23000, 23200, 24800, 25100, 25400, 25400, 25400, 25400, 25600, 25800, 25700, 25500],
  },
  {
    id: 'CG-006',
    toolGroup: 'ONON CVD',
    deltaPct: -2.1,
    confidence: 77,
    modeledWspm: 30000,
    realizedWspm: 29400,
    driverHypothesis: 'Recipe mix shift, more TLC',
    impact: ['Tighten dispatch by 2%'],
    trend: [30000, 29900, 29800, 29700, 29500, 29400, 29400, 29400, 29400, 29400, 29400, 29400],
  },
  {
    id: 'CG-007',
    toolGroup: 'Probe E-Test',
    deltaPct: 6.8,
    confidence: 88,
    modeledWspm: 18000,
    realizedWspm: 19200,
    driverHypothesis: 'Sampling rule relaxation',
    impact: ['Unblocks 12 lots/wk through Probe'],
    trend: [18000, 18100, 18800, 19000, 19100, 19200, 19200, 19200, 19100, 19000, 19200, 19200],
  },
  {
    id: 'CG-008',
    toolGroup: 'Clean Wet-3',
    deltaPct: 1.8,
    confidence: 69,
    modeledWspm: 26000,
    realizedWspm: 26500,
    driverHypothesis: 'Faster bath turnover',
    impact: ['Minor capacity gain'],
    trend: [26000, 26100, 26200, 26300, 26500, 26500, 26400, 26500, 26500, 26500, 26500, 26500],
  },
]

export class CapacityTuningStore {
  pending: CapacityTune[] = PENDING
  selectedId = PENDING[0].id
  tab: 'pending' | 'accepted' | 'sent' = 'pending'

  constructor() {
    makeAutoObservable(this)
  }

  get selected(): CapacityTune | undefined {
    return this.pending.find((t) => t.id === this.selectedId)
  }

  select(id: string) {
    this.selectedId = id
  }

  setTab(tab: 'pending' | 'accepted' | 'sent') {
    this.tab = tab
  }
}
