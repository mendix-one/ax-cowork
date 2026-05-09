import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { STATUS } from '../../core/enum/status.enum'
import { CODE_TYPE } from '../../core/enum/code-type.enum'
import { EMAIL_TYPE } from '../../core/enum/email-type.enum'
import { Formater } from '../../core/util/formater'
import { JwtManager } from '../../core/manager/jwt.manager'
import { HashingManager } from '../../core/manager/hashing.manager'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { Account } from '../../core/database/account.model'
import { Code } from '../../core/database/code.model'
import { BusinessException } from '../../core/exception/business.exception'
import { MailerService } from '../../core/connect/mailer.service'
import { WelcomeReqHeader } from './dto/welcome.req-header'

@Injectable()
export class WelcomeService {
  constructor(
    private formater: Formater,
    private jwtManager: JwtManager,
    private hashingManager: HashingManager,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    private mailerService: MailerService,
    @InjectModel(Account) private accountModel: typeof Account,
    @InjectModel(Code) private codeModel: typeof Code
  ) {}

  async sendInformEmail(params: any) {
    const payload = {
      name: params.name,
      username: params.username,
      password: params.password,
      phoneNumber: params.phoneNumber,
      email: params.email
    }

    return await this.mailerService.send(
      params.email,
      EMAIL_TYPE.SSO_INFORM_SETUP_ACCOUNT_INFO,
      payload,
      params.lang,
      params.timezone
    )
  }

  async extract(token: string) {
    return token ? await this.jwtManager.decode(token) : undefined
  }

  async check(token: string) {
    const payload = await this.jwtManager.decode(token)

    // Find OTP code
    const data = await this.codeModel.findOne({
      where: { key: payload.key, type: CODE_TYPE.INITIAL_ACCOUNT, status: STATUS.ACTIVE },
      include: [{ model: Account, required: false }],
      nest: true,
      raw: true
    })

    // Check data
    if (!data) {
      throw new BusinessException(7, `The account does not exist.`, { token })
    }

    // Check secret
    if (!(await this.hashingManager.compare(data.secret, payload.secret))) {
      throw new BusinessException(5, `The account does not exist.`, { token })
    }

    // Check account
    const account = data.account
    if (!account?.cid) {
      throw new BusinessException(9, `The account does not exist.`, { token })
    } else if (account?.status !== STATUS.ACTIVE && account?.status !== STATUS.LOCKED) {
      throw new BusinessException(9, `The account is not ACTIVE or LOCKED.`, { token })
    }

    return payload
  }

  async submit(key: string, secret: string, password: string, headers: WelcomeReqHeader) {
    const transaction = await this.transactionManager.open()
    try {
      // Find OTP code
      const data = await this.codeModel.findOne({
        where: { key, type: CODE_TYPE.INITIAL_ACCOUNT, status: STATUS.ACTIVE },
        include: [{ model: Account, required: false }],
        transaction,
        nest: true,
        raw: true
      })

      // Check data
      if (!data) {
        throw new BusinessException(7, `The OTP code was expired or was used.`, { key, secret, password, ...headers })
      }

      // Check secret
      if (!(await this.hashingManager.compare(data.secret, secret))) {
        throw new BusinessException(5, `The secret is incorrect.`, { key, secret, password, ...headers })
      }

      // Check account
      const account = data.account
      if (!account?.cid) {
        throw new BusinessException(9, `The account does not exist.`, { key, secret })
      } else if (account?.status !== STATUS.ACTIVE && account?.status !== STATUS.LOCKED) {
        throw new BusinessException(9, `The account is not ACTIVE or LOCKED.`, { key, secret })
      }

      // Current timestamp
      const timestamp = await this.dateTimeManager.currentDateTime()

      // Hash password
      const hash = await this.hashingManager.hash(password)

      // Update account
      await this.accountModel.update(
        { password: hash, verifiedAt: timestamp, emailVerifiedAt: timestamp },
        { where: { cid: data.cid }, transaction }
      )

      // Destroy OTP code
      await this.codeModel.update(
        {
          usedAt: timestamp,
          status: STATUS.EXPIRED
        },
        {
          where: { key },
          transaction
        }
      )
      await this.codeModel.destroy({
        where: { key },
        transaction
      })

      // Hidden password
      const hidden = this.formater.hidden(password)

      // Send email
      await this.sendInformEmail({
        cid: account.cid,
        name: account.displayName,
        username: account.username,
        password: hidden,
        displayName: account.displayName,
        email: account.email,
        phoneNumber: account.phoneNumber,
        ...headers
      })

      // JWT payload
      const payload: any = {
        cid: account.cid,
        username: account.username,
        password: hidden,
        displayName: account.displayName,
        email: account.email,
        phoneNumber: account.phoneNumber
      }

      const token = await this.jwtManager.signCode(payload)

      // Commit transaction
      await this.transactionManager.commit(transaction)
      return token
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }
}
