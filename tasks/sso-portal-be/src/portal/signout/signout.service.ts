import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ACTION } from '../../core/enum/action.enum'
import { Generator } from '../../core/util/generator'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { Session } from '../../core/database/session.model'
import { SessionHistory } from '../../core/database/session-history.model'
import { Authentication } from '../../core/interface/authentication.interface'
import { CacheService } from '../../core/cache/cache.service'
import { Connection } from '../../core/database/connection.model'

@Injectable()
export class SignoutService {
  constructor(
    private generator: Generator,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    private cacheService: CacheService,
    @InjectModel(Session) private sessionModel: typeof Session,
    @InjectModel(Connection) private connectionModel: typeof Connection,
    @InjectModel(SessionHistory) private sessionHistoryModel: typeof SessionHistory
  ) {}

  async clearCache(sid) {
    await this.cacheService.del(`SESSION_${sid}`)

    // Find all connection related to session
    const listConnection = await this.connectionModel.findAll({ where: { sid } })

    // Clear session cache tasks
    const listTasks = listConnection.map(x => {
      return this.cacheService.del(`CONNECTION_${x.key}`)
    })

    // Execute clear session cache
    await Promise.all([listTasks])
  }

  /**
   * Attempt sign out
   *
   * @param auth
   */
  async attempt(auth: Authentication) {
    const transaction = await this.transactionManager.open()
    try {
      // Remove cid from session
      const result = await this.sessionModel.update(
        {
          cid: null,
          signedAt: null
        },
        {
          where: {
            sid: auth.sid
          },
          transaction
        }
      )

      // Current DateTime
      const currentDateTime = await this.dateTimeManager.currentDateTime()

      // Session history
      const history = {
        id: this.generator.uuid(),
        issuedAt: currentDateTime,
        action: ACTION.SIGNOUT,
        sid: auth.sid,
        cid: auth.cid
      }

      // Create new session history
      await this.sessionHistoryModel.create(history, { transaction })

      // Clear old cache
      await this.clearCache(auth.sid)

      // Commit transaction
      await this.transactionManager.commit(transaction)
      return result
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }
}
