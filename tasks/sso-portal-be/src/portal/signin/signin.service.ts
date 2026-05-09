import { Op } from 'sequelize'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { STATUS } from '../../core/enum/status.enum'
import { ACTION } from '../../core/enum/action.enum'
import { Generator } from '../../core/util/generator'
import { HashingManager } from '../../core/manager/hashing.manager'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { Account } from '../../core/database/account.model'
import { Session } from '../../core/database/session.model'
import { SessionHistory } from '../../core/database/session-history.model'
import { BusinessException } from '../../core/exception/business.exception'
import { Authentication } from '../../core/interface/authentication.interface'
import { SigninReqBody } from './dto/signin.req-body'
import { CacheService } from '../../core/cache/cache.service'
import { Connection } from '../../core/database/connection.model'

@Injectable()
export class SigninService {
  constructor(
    private generator: Generator,
    private hashingManager: HashingManager,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    private cacheService: CacheService,
    @InjectModel(Account) private accountModel: typeof Account,
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
   * Attempt sign in
   *
   * @param auth
   * @param params
   */
  async attempt(auth: Authentication, params: SigninReqBody) {
    const transaction = await this.transactionManager.open()
    try {
      // Find account
      const account = await this.accountModel.findOne({
        attributes: ['cid', 'username', 'password', 'email', 'phoneNumber', 'status', 'avatar', 'displayName'],
        where: {
          [Op.or]: [{ username: params.username }, { email: params.username }, { phoneNumber: params.username }],
          status: [STATUS.ACTIVE, STATUS.LOCKED]
        },
        transaction,
        raw: true,
        nest: true
      })

      // Check account
      if (!account) {
        throw new BusinessException(1, 'Username or password is incorrect.')
      }

      // Check password
      if (!(await this.hashingManager.compare(params.password, account.password))) {
        throw new BusinessException(1, 'Username or password is incorrect.')
      }

      // Current DateTime
      const currentDateTime = await this.dateTimeManager.currentDateTime()

      // Update session
      await this.sessionModel.update(
        {
          cid: account.cid,
          signedAt: currentDateTime
        },
        {
          where: { sid: auth.sid },
          transaction
        }
      )

      // Session history
      const history = {
        id: this.generator.uuid(),
        issuedAt: currentDateTime,
        action: ACTION.SIGNIN,
        sid: auth.sid,
        cid: account.cid
      }

      // Create new session history
      await this.sessionHistoryModel.create(history, { transaction })

      // Clear session cache
      await this.clearCache(auth.sid)

      // Commit transaction
      await this.transactionManager.commit(transaction)

      // Return result
      return {
        sid: auth.sid,
        cid: account.cid,
        username: account.username,
        avatar: account.avatar,
        email: account.email,
        phoneNumber: account.phoneNumber,
        displayName: account.displayName
      }
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }
}
