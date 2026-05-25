import { makeAutoObservable } from 'mobx'
import { MOCK_PRODUCTION_ORDERS, type ProductionOrder } from '../../data/mock-plan'

export class ProductionOrderStore {
  orders: ProductionOrder[] = MOCK_PRODUCTION_ORDERS
  selectedOrderId: string = MOCK_PRODUCTION_ORDERS[1].id

  constructor() {
    makeAutoObservable(this)
  }

  get selectedOrder(): ProductionOrder | undefined {
    return this.orders.find((o) => o.id === this.selectedOrderId)
  }

  selectOrder(id: string) {
    this.selectedOrderId = id
  }
}
