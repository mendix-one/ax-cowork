import { InjectModel } from '@nestjs/sequelize'
import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EVENT_NAME } from '../../core/event/event-name.enum'
import { Generator } from '../../core/util/generator'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { Access } from '../../core/database/access.model'
import { Connection } from '../../core/database/connection.model'

@Injectable()
export class AccessWorkerListener {
  private readonly logger = new Logger(AccessWorkerListener.name)

  constructor(
    private generator: Generator,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    @InjectModel(Access) private accessModel: typeof Access,
    @InjectModel(Connection) private connectionModel: typeof Connection
  ) {}

  @OnEvent(EVENT_NAME.ACCESSING)
  async handleInitializeSubject(payload: Partial<Access>) {
    const transaction = await this.transactionManager.open()
    try {
      // Update last request
      await this.connectionModel.update(
        {
          lastRequestedAt: await this.dateTimeManager.currentDateTime()
        },
        {
          where: { key: payload.key },
          transaction
        }
      )

      // Record accessing
      const access = {
        id: this.generator.uuid(),
        issuedAt: await this.dateTimeManager.currentDateTime(),
        ...payload
      }

      await this.accessModel.create(access, { transaction })
      await this.transactionManager.commit(transaction)
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      this.logger.error(ex)
    }
  }
}
