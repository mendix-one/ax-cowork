import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { STATUS } from '../enum/status.enum'
import { DateTimeManager } from './date-time.manager'
import { TransactionManager } from './transaction.manager'
import { Short } from '../database/short.model'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ShortLinkManager {
  constructor(
    private configService: ConfigService,
    private dateTimeManager: DateTimeManager,
    private transactionManager: TransactionManager,
    @InjectModel(Short) private shortModel: typeof Short
  ) {}

  /**
   * Generate code
   *
   * @param length
   */
  private code(length: number = 18): string {
    let result = ''

    const characters = '0abc1def2ghi3jkl4mno5pq6rs7tu8vwx9yz0'
    const charactersLength = characters.length

    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }

    return result
  }

  /**
   * Generate short link
   *
   * @param path
   * @param expiresIn
   */
  async generate(path: string, expiresIn: number = 1000 * 60 * 60 * 24) {
    const transaction = await this.transactionManager.open()
    try {
      const code = this.code()
      const alias = `${this.configService.get('SSO_PORTAL')}/short/${code}`
      const temp = `/${path}`.replaceAll('//', '/').replace(this.configService.get('SSO_PORTAL'), '')
      const target = `${this.configService.get('SSO_PORTAL')}${temp}`

      const short = {
        code,
        alias,
        target,
        issuedAt: await this.dateTimeManager.currentTimestamp(),
        expiresIn: (expiresIn || 1) + 1000 * 60 * 60 * 24,
        status: STATUS.ACTIVE
      }

      await this.shortModel.create(short, { transaction })

      await this.transactionManager.commit(transaction)
      return alias
    } catch (ex) {
      await this.transactionManager.rollback(transaction)
      throw ex
    }
  }
}
