import { Op } from 'sequelize'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ConfigService } from '@nestjs/config'
import { Transaction } from 'sequelize/types/transaction'
import { STATUS } from '../../core/enum/status.enum'
import { GENDER } from '../../core/enum/gender.enum'
import { CODE_TYPE } from '../../core/enum/code-type.enum'
import { EMAIL_TYPE } from '../../core/enum/email-type.enum'
import { Formater } from '../../core/util/formater'
import { Generator } from '../../core/util/generator'
import { Normalizer } from '../../core/util/normalizer'
import { JwtManager } from '../../core/manager/jwt.manager'
import { HashingManager } from '../../core/manager/hashing.manager'
import { DateTimeManager } from '../../core/manager/date-time.manager'
import { TransactionManager } from '../../core/manager/transaction.manager'
import { ShortLinkManager } from '../../core/manager/short-link.manager'
import { User } from '../../core/database/user.model'
import { Setting } from '../../core/database/setting.model'
import { Account } from '../../core/database/account.model'
import { Code } from '../../core/database/code.model'
import { BusinessException } from '../../core/exception/business.exception'
import { MailerService } from '../../core/connect/mailer.service'
import { RequestReqHeader } from './dto/request.req-header'
import { RequestReqBody } from './dto/request.req-body'

@Injectable()
export class SignupService {
  constructor(
    private formater: Formater,
    private generator: Generator,
    private normalizer: Normalizer,
    private jwtManager: JwtManager,
    private hashingManager: HashingManager,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    private shortLinkManager: ShortLinkManager,
    private configService: ConfigService,
    private mailerService: MailerService,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Setting) private settingModel: typeof Setting,
    @InjectModel(Account) private accountModel: typeof Account,
    @InjectModel(Code) private codeModel: typeof Code
  ) {}

  /**
   * Send OTP code via email
   *
   * @param params
   * @private
   */
  private async sendOtpEmail(params: any) {
    const secret = await this.hashingManager.hash(params.secret)

    const link = await this.shortLinkManager.generate(
      `/signup/continue` + `?key=${encodeURIComponent(params.key)}&secret=${encodeURIComponent(secret)}`,
      params.expiresIn
    )

    const payload = {
      name: params.name,
      code: params.code,
      link
    }

    return await this.mailerService.send(
      params.email,
      EMAIL_TYPE.SSO_SEND_SIGNUP_ACCOUNT_OTP,
      payload,
      params.lang,
      params.timezone
    )
  }

  /**
   * Send inform email
   *
   * @param params
   */
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
      EMAIL_TYPE.SSO_INFORM_SIGNUP_ACCOUNT_INFO,
      payload,
      params.lang,
      params.timezone
    )
  }

  /**
   * Check duplicate data
   *
   * @param cid
   * @param username
   * @param email
   * @param phoneNumber
   * @param transaction
   * @private
   */
  private async checkDuplicated(
    cid: string,
    username: string,
    email: string,
    phoneNumber: string,
    transaction: Transaction
  ) {
    const where: any = { status: [STATUS.ACTIVE, STATUS.LOCKED] }

    // Add cid
    if (cid) {
      where.cid = {
        [Op.ne]: cid
      }
    }

    // Check username
    if (username) {
      const countUsername = await this.accountModel.count({ where: { ...where, username }, transaction })
      if (countUsername > 0) {
        throw new BusinessException(1, 'The username is duplicated.', { cid, username, email, phoneNumber })
      }
    }

    // Check email
    if (email) {
      const countEmail = await this.accountModel.count({ where: { ...where, email }, transaction })
      if (countEmail > 0) {
        throw new BusinessException(2, 'The email is duplicated.', { cid, username, email, phoneNumber })
      }
    }

    // Check username
    if (phoneNumber) {
      const countPhoneNumber = await this.accountModel.count({ where: { ...where, phoneNumber }, transaction })
      if (countPhoneNumber > 0) {
        throw new BusinessException(3, 'The phone number is duplicated.', { cid, username, email, phoneNumber })
      }
    }

    return
  }

  /**
   * Make default setting
   *
   * @param headers
   * @private
   */
  private makeDefaultSetting(headers: RequestReqHeader) {
    const setting = {
      lang: 'vi',
      language: 'Tiếng Việt (Vietnamese)',
      timezone: 'Asia/Ho_Chi_Minh',
      currency: 'VND',
      currencyName: 'Việt Nam Đồng',
      currencySymbol: 'đ',
      currencyDecimal: 0,
      currencyRounding: 0,
      numberType: 'NUMBER_TYPE_01',
      numberFormat: null,
      numberSample: '3.456.789,12',
      currencyType: 'CURRENCY_TYPE_01',
      currencyFormat: null,
      currencySample: '3.456.789đ',
      accountingType: 'ACCOUNTING_TYPE_01',
      accountingFormat: null,
      accountingSample: 'đ 3.456.789',
      dateOnlyType: 'DATE_ONLY_TYPE_01',
      dateOnlyFormat: 'DD-MM-YYYY',
      dateOnlySample: '20-08-1990',
      dateTimeType: 'DATE_TIME_TYPE_01',
      dateTimeFormat: 'HH:MM:SS DD-MM-YYYY',
      dateTimeSample: '21:12:21 20-08-1990'
    }

    setting.timezone = headers?.timezone || setting.timezone

    const lang = headers?.lang || this.configService.get('DEFAULT_LANG')
    const displayLanguages = this.configService.get('DISPLAY_LANGUAGES')
    const language = displayLanguages?.find(x => x.code === lang)

    setting.lang = language.code
    setting.language = `${language.name} (${language.globalName})`

    return setting
  }

  /**
   * Create signing up request
   *
   * @param params
   * @param headers
   */
  async request(params: RequestReqBody, headers: RequestReqHeader) {
    const transaction = await this.transactionManager.open()
    try {
      // Check duplicated
      await this.checkDuplicated(null, params.username, params.email, params.phoneNumber, transaction)

      // Generate CID
      const cid = this.generator.uuid()

      // Insert user
      const user = {
        cid: cid,
        fullName: params.displayName,
        gender: GENDER.UNKNOWN,
        email: params.email,
        phoneNumber: params.phoneNumber,
        createdBy: cid,
        updatedBy: cid
      }
      await this.userModel.create(user, { transaction })

      // Insert setting
      const setting = { cid, ...this.makeDefaultSetting(headers) }
      await this.settingModel.create(setting, { transaction })

      // Generate text search
      const textSearch = this.normalizer.textSearch(
        cid,
        params.username,
        params.displayName,
        params.email,
        params.phoneNumber
      )

      // Insert account
      const account = {
        cid: cid,
        status: STATUS.READY,
        username: params.username,
        displayName: params.displayName,
        email: params.email,
        phoneNumber: params.phoneNumber,
        textSearch,
        cdnOwnerId: this.generator.uuid(),
        createdBy: cid,
        updatedBy: cid
      }
      await this.accountModel.create(account, { transaction })

      // Generate OTP Code
      const key = this.generator.key()
      const code = this.generator.code()
      const secret = this.generator.secret()

      const issuedAt = await this.dateTimeManager.currentDateTime()
      const expiresIn = +this.configService.get('OTP_REGISTRY_ACCOUNT_EXPIRES_IN')
      const expiredAt = new Date(issuedAt.getTime() + expiresIn)

      // Make OTP code
      const otpCodeData = {
        cid: cid,
        key,
        code,
        secret,
        type: CODE_TYPE.REGISTRY_ACCOUNT,
        status: STATUS.ACTIVE,
        issuedAt,
        expiresIn,
        expiredAt
      }

      // Insert OTP code into database
      await this.codeModel.create(otpCodeData, { transaction })

      // Send email
      await this.sendOtpEmail({
        email: params.email,
        name: account.displayName,
        key,
        code,
        secret,
        expiresIn,
        ...headers
      })

      // Commit transaction
      await this.transactionManager.commit(transaction)
      return key
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }

  /**
   * Do verify OTP Code
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
        where: { key, type: CODE_TYPE.REGISTRY_ACCOUNT, status: STATUS.ACTIVE },
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
      } else if (account?.status !== STATUS.READY) {
        throw new BusinessException(9, `The account is not READY.`, { key, code, ...headers })
      }

      // Check duplicate
      await this.checkDuplicated(account.cid, account.username, account.email, account.phoneNumber, transaction)

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
        where: { key, type: CODE_TYPE.REGISTRY_ACCOUNT, status: STATUS.ACTIVE },
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
      } else if (account?.status !== STATUS.READY) {
        throw new BusinessException(9, `The account is not READY.`, { key, secret })
      }

      // Check duplicate
      await this.checkDuplicated(account.cid, account.username, account.email, account.phoneNumber, transaction)

      // Commit transaction
      await this.transactionManager.commit(transaction)
      return { key, secret }
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      return ex
    }
  }

  /**
   * Handle finale submit form
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
        where: { key, type: CODE_TYPE.REGISTRY_ACCOUNT, status: STATUS.ACTIVE },
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
      } else if (account?.status !== STATUS.READY) {
        throw new BusinessException(9, `The account is not READY.`, { key, secret })
      }

      // Current timestamp
      const timestamp = await this.dateTimeManager.currentDateTime()

      // Hash password
      const hash = await this.hashingManager.hash(password)

      // Update account
      await this.accountModel.update(
        { password: hash, status: STATUS.ACTIVE, verifiedAt: timestamp, emailVerifiedAt: timestamp },
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

  /**
   * Just extract token
   *
   * @param token
   */
  async extract(token: string) {
    return await this.jwtManager.decode(token)
  }
}
