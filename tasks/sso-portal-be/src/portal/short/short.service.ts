import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { Short } from '../../core/database/short.model'

@Injectable()
export class ShortService {
  constructor(
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    @InjectModel(Short) private shortModel: typeof Short
  ) {}

  /**
   * Attempt target by code
   *
   * @param code
   */
  async attempt(code: string): Promise<string> {
    const transaction = await this.transactionManager.open()
    try {
      // Find short data
      const short = await this.shortModel.findOne({ where: { code }, transaction })

      // Update
      if (short) {
        short.attempt = short.attempt + 1
        short.lastUsedAt = await this.dateTimeManager.currentTimestamp()
        await short.save({ transaction })
      }

      // Commit transaction
      await this.transactionManager.commit(transaction)

      // Return target
      return short?.target || undefined
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }
}
