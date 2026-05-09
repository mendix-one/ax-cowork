import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ACTION } from '../enum/action.enum'
import { STATUS } from '../enum/status.enum'
import { Generator } from '../util/generator'
import { DateTimeManager } from './date-time.manager'
import { TransactionManager } from './transaction.manager'
import { Account } from '../database/account.model'
import { Session } from '../database/session.model'
import { SessionHistory } from '../database/session-history.model'
import { Authentication } from '../interface/authentication.interface'
import { HeaderParams } from '../interface/header-params.interface'
import { CacheService } from '../cache/cache.service'
import { Setting } from '../database/setting.model'

@Injectable()
export class SessionManager {
  private readonly logger = new Logger(SessionManager.name)

  constructor(
    private generator: Generator,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    private cacheService: CacheService,
    @InjectModel(Session) private sessionModel: typeof Session,
    @InjectModel(SessionHistory) private sessionHistoryModel: typeof SessionHistory
  ) {}

  /**
   * Get session & authentication
   *
   * @param sid
   */
  async get(sid): Promise<Authentication> {
    // Check key
    if (!sid) {
      return undefined
    }

    // Get from cache
    let session = await this.cacheService.get<any>(`SESSION_${sid}`)
    if (!!session) {
      this.logger.log(`Use cache session data: SESSION_${sid}`)
    }

    // Check cache data
    if (!session) {
      // Log info
      this.logger.log(`Session was not cached: SESSION_${sid}`)

      // Retrieve session
      session = await this.sessionModel.findOne({
        include: [
          {
            model: Account,
            required: false,
            where: { status: [STATUS.ACTIVE, STATUS.LOCKED] },
            include: [{ model: Setting, required: true }]
          }
        ],
        where: { sid, status: STATUS.ACTIVE },
        raw: true,
        nest: true
      })

      // Check session
      if (!session) {
        this.logger.warn(`Session does not exist in database: ${sid}`)
        return undefined
      }

      // Cache session data
      this.logger.log(`Cache session data: SESSION_${sid}`)
      await this.cacheService.set(`SESSION_${sid}`, session)
    }

    // Authentication
    return {
      sid: session.sid,
      cid: session.cid,
      account: session.cid ? session.account : undefined
    }
  }

  /**
   * Initial session & authentication
   *
   * @param headers
   */
  async initial(headers: HeaderParams): Promise<Authentication> {
    const transaction = await this.transactionManager.open()
    try {
      // Insert data
      const session = {
        sid: this.generator.uuid(),
        status: STATUS.ACTIVE,
        issuedAt: await this.dateTimeManager.currentDateTime(),
        ...headers
      }

      // Create new session
      await this.sessionModel.create(session, { transaction })

      // Session history
      const history = {
        id: this.generator.uuid(),
        issuedAt: session.issuedAt,
        action: ACTION.ISSUE,
        sid: session.sid,
        metadata: JSON.stringify(session)
      }

      // Create new session history
      await this.sessionHistoryModel.create(history, { transaction })

      // Commit transaction
      await this.transactionManager.commit(transaction)

      // Return authentication
      return { sid: session.sid }
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }
}
