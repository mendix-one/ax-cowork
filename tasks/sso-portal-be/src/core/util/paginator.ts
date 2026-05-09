import { Injectable } from '@nestjs/common'
import { Pagination } from '../interface/paginator.interface'

@Injectable()
export class Paginator {
  /**
   * Calculate pagination
   *
   * @param pageNo
   * @param pageSize
   * @param totalItems
   */
  calculate(pageNo: number = 1, pageSize: number = 10, totalItems: number = 0): Pagination {
    return {
      pageNo: pageNo,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize)
    }
  }

  /**
   * Calculate offset
   *
   * @param pageNo
   * @param pageSize
   */
  offset(pageNo: number = 1, pageSize: number = 10): number {
    return pageNo < 1 ? 0 : (pageNo - 1) * pageSize
  }
}
