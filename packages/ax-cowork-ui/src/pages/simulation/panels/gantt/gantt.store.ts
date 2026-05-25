import { makeAutoObservable } from 'mobx'
import { HORIZON_LABELS, MOCK_PRODUCTION_ORDERS, WORKLOAD_STRIP, type ProductionOrder } from '../../data/mock-plan'

export type GanttHorizon = 'day' | 'week' | 'month'

export class GanttStore {
  horizon: GanttHorizon = 'week'
  filter: 'all' | 'at-risk' | 'hot-lot' = 'all'
  orders: ProductionOrder[] = MOCK_PRODUCTION_ORDERS
  horizonLabels: string[] = HORIZON_LABELS
  workloadStrip = WORKLOAD_STRIP
  expandedOrderIds = new Set<string>([MOCK_PRODUCTION_ORDERS[0].id, MOCK_PRODUCTION_ORDERS[1].id, MOCK_PRODUCTION_ORDERS[2].id])

  constructor() {
    makeAutoObservable(this)
  }

  setHorizon(value: GanttHorizon) {
    this.horizon = value
  }

  setFilter(value: 'all' | 'at-risk' | 'hot-lot') {
    this.filter = value
  }

  isExpanded(id: string) {
    return this.expandedOrderIds.has(id)
  }

  toggleExpanded(id: string) {
    if (this.expandedOrderIds.has(id)) this.expandedOrderIds.delete(id)
    else this.expandedOrderIds.add(id)
  }
}
