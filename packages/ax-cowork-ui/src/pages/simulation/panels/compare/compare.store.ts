import { makeAutoObservable } from 'mobx'

export type DiffEntry = {
  id: string
  text: string
  reason: string
}

export class CompareStore {
  leftPlanId = 'published'
  rightPlanId = 'plan-b'

  metricsLeft = { commitsAtRisk: 3, bottleneck: '89% HARC', adherence: '87%' }
  metricsRight = { commitsAtRisk: 1, bottleneck: '76% HARC', adherence: '91%' }

  diffs: DiffEntry[] = [
    { id: 'd1', text: 'PO-119 HARC  ETC-44 chamber B → ETC-07 chamber A', reason: 'chamber drift' },
    { id: 'd2', text: 'PO-120 HARC  Start 05-08 → 05-09 (+1d)', reason: 'capacity' },
    { id: 'd3', text: 'PO-118 M1  on time, no change', reason: '—' },
    { id: 'd4', text: 'PO-122 WL  ETC-44 → ETC-09', reason: 'qual expiry' },
    { id: 'd5', text: 'PO-123 BEOL  Start 05-12 → 05-13', reason: 'sequencing' },
  ]

  constructor() {
    makeAutoObservable(this)
  }

  setLeftPlan(id: string) {
    this.leftPlanId = id
  }

  setRightPlan(id: string) {
    this.rightPlanId = id
  }
}
