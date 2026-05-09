import { Injectable } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { Transaction } from 'sequelize/types/transaction'

@Injectable()
export class TransactionManager {
  constructor(private sequelize: Sequelize) {}

  /**
   * Open new transaction
   *
   * @param transaction
   */
  async open(transaction?: Transaction): Promise<Transaction> {
    if (!transaction) {
      transaction = await this.sequelize.transaction()
    }

    return transaction
  }

  /**
   * Check & commit transaction
   *
   * @param transaction
   */
  async commit(transaction: Transaction) {
    if (transaction) {
      await transaction.commit()
    } else {
      throw new Error('[Commit] Transaction was not opened yet.')
    }
  }

  /**
   * Check & rollback transaction
   *
   * @param transaction
   */
  async rollback(transaction: Transaction) {
    if (transaction) {
      await transaction.rollback()
    } else {
      throw new Error('[Rollback] Transaction was not opened yet.')
    }
  }
}
