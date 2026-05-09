import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ConfigService } from '@nestjs/config'
import { STATUS } from '../../core/enum/status.enum'
import { CODE_TYPE } from '../../core/enum/code-type.enum'
import { EMAIL_TYPE } from '../../core/enum/email-type.enum'
import { Formater } from '../../core/util/formater'
import { Generator } from '../../core/util/generator'
import { JwtManager } from '../../core/manager/jwt.manager'
import { HashingManager } from '../../core/manager/hashing.manager'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { ShortLinkManager } from '../../core/manager/short-link.manager'
import { Account } from '../../core/database/account.model'
import { Code } from '../../core/database/code.model'
import { BusinessException } from '../../core/exception/business.exception'
import { MailerService } from '../../core/connect/mailer.service'
import { RequestReqHeader } from './dto/request.req-header'

@Injectable()
export class ResetService {
  constructor(
    private formater: Formater,
    private generator: Generator,
    private jwtManager: JwtManager,
    private hashingManager: HashingManager,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    private shortLinkManager: ShortLinkManager,
    private configService: ConfigService,
    private mailerService: MailerService,
    @InjectModel(Account) private accountModel: typeof Account,
    @InjectModel(Code) private codeModel: typeof Code
  ) {}

  /**
   * Send OPT Email
   *
   * @param params
   * @private
   */
  private async sendOtpEmail(params: any) {
    const secret = await this.hashingManager.hash(params.secret)

    const link = await this.shortLinkManager.generate(
      `/reset/continue?key=${encodeURIComponent(params.key)}&secret=${encodeURIComponent(secret)}`,
      params.expiresIn
    )

    const payload = {
      name: params.name,
      code: params.code,
      link
    }

    return await this.mailerService.send(
      params.email,
      EMAIL_TYPE.SSO_SEND_RESET_PASSWORD_OTP,
      payload,
      params.lang,
      params.timezone
    )
  }

  /**
   * Send inform email
   *
   * @param params
   * @private
   */
  private async sendInformEmail(params: any) {
    const payload = {
      name: params.name,
      username: params.username,
      password: params.password,
      phoneNumber: params.phoneNumber,
      email: params.email
    }

    return await this.mailerService.send(
      params.email,
      EMAIL_TYPE.SSO_INFORM_CHANGE_PASSWORD_INFO,
      payload,
      params.lang,
      params.timezone
    )
  }

  /**
   * Make request with email
   *
   * @param email
   * @param headers
   */
  async request(email: string, headers: RequestReqHeader) {
    const transaction = await this.transactionManager.open()
    try {
      // Find account
      const account = await this.accountModel.findOne({
        where: { email, status: [STATUS.ACTIVE, STATUS.LOCKED] },
        transaction,
        nest: true,
        raw: true
      })

      // Check account
      if (!account) {
        throw new BusinessException(1, `The email [${email}] does not exist in the system.`, { email })
      }

      // Generate OTP Code
      const key = this.generator.key()
      const code = this.generator.code()
      const secret = this.generator.secret()

      const issuedAt = await this.dateTimeManager.currentDateTime()
      const expiresIn = +this.configService.get('OTP_RESET_PASSWORD_EXPIRES_IN')
      const expiredAt = new Date(issuedAt.getTime() + expiresIn)

      // Make OTP code
      const otpCodeData = {
        cid: account.cid,
        key,
        code,
        secret,
        type: CODE_TYPE.RESET_PASSWORD,
        status: STATUS.ACTIVE,
        issuedAt,
        expiresIn,
        expiredAt
      }

      // Insert OTP code into database
      await this.codeModel.create(otpCodeData, { transaction })

      // Send email
      await this.sendOtpEmail({ email, name: account.displayName, key, code, secret, expiresIn, ...headers })

      // Commit transaction
      await this.transactionManager.commit(transaction)
      return key
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }

  /**
   * Do verify OTP code
   *
   * @param key
   * @param code
   * @param headers
   */
  async verify(key: string, code: string, headers: RequestReqHeader) {
    const transaction = await this.transactionManager.open()
    try {
      // Find OTP code
      const data = await this.codeModel.findOne({
        where: { key, type: CODE_TYPE.RESET_PASSWORD, status: STATUS.ACTIVE },
        include: [{ model: Account, required: false }],
        transaction,
        nest: true,
        raw: true
      })

      // Check data
      if (!data) {
        throw new BusinessException(7, `The OTP was expired or was used.`, { key, code, ...headers })
      }

      // Check code
      if (data.code !== code) {
        throw new BusinessException(5, `The code is incorrect.`, { key, code, ...headers })
      }

      // Check account
      const account = data.account
      if (!account?.cid) {
        throw new BusinessException(9, `The account does not exist.`, { key, code, ...headers })
      } else if (account?.status !== STATUS.ACTIVE && account?.status !== STATUS.LOCKED) {
        throw new BusinessException(9, `The account is not ACTIVE or LOCKED.`, { key, code, ...headers })
      }

      // Hash secret
      const secret = await this.hashingManager.hash(data.secret)

      // Commit transaction
      await this.transactionManager.commit(transaction)
      return secret
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }

  /**
   * Check key and secret
   *
   * @param key
   * @param secret
   */
  async check(key: string, secret: string) {
    const transaction = await this.transactionManager.open()
    try {
      // Find OTP code
      const data = await this.codeModel.findOne({
        where: { key, type: CODE_TYPE.RESET_PASSWORD, status: STATUS.ACTIVE },
        include: [{ model: Account, required: false }],
        transaction,
        nest: true,
        raw: true
      })

      // Check data
      if (!data) {
        return undefined
      }

      // Check secret
      if (!(await this.hashingManager.compare(data.secret, secret))) {
        return undefined
      }

      // Check account
      const account = data.account
      if (!account?.cid) {
        throw new BusinessException(9, `The account does not exist.`, { key, secret })
      } else if (account?.status !== STATUS.ACTIVE && account?.status !== STATUS.LOCKED) {
        throw new BusinessException(9, `The account is not ACTIVE or LOCKED.`, { key, secret })
      }

      // Commit transaction
      await this.transactionManager.commit(transaction)
      return { key, secret }
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }

  /**
   * Submit reset form
   *
   * @param key
   * @param secret
   * @param password
   * @param headers
   */
  async submit(key: string, secret: string, password: string, headers: RequestReqHeader) {
    const transaction = await this.transactionManager.open()
    try {
      // Find OTP code
      const data = await this.codeModel.findOne({
        where: { key, type: CODE_TYPE.RESET_PASSWORD, status: STATUS.ACTIVE },
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

      // Hash password
      const hash = await this.hashingManager.hash(password)

      // Update account
      await this.accountModel.update({ password: hash }, { where: { cid: data.cid }, transaction })

      // Destroy OTP code
      const timestamp = await this.dateTimeManager.currentDateTime()
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

  /**
   * Just extract token
   *
   * @param token
   */
  async extract(token: string) {
    return await this.jwtManager.decode(token)
  }
}
