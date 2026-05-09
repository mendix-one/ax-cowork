import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BusinessException } from '../exception/business.exception'

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name)

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {}

  async send(to, type, payload, lang, timezone) {
    try {
      // Make data
      const data = {
        to,
        type,
        payload
      }

      // Make headers
      const headers = {
        'sso-api-key': this.configService.get('SSO_API_KEY'),
        'sso-artifact-id': this.configService.get('SSO_ARTIFACT_ID'),
        'sso-artifact-key': this.configService.get('SSO_ARTIFACT_KEY'),
        'sso-client-id': this.configService.get('SSO_CLIENT_ID'),
        'sso-client-secret': this.configService.get('SSO_CLIENT_SECRET'),
        lang: lang,
        timezone: timezone
      }

      // Send request
      const url = `${this.configService.get('NOTIFY_SERVICES')}/email`
      const response = await this.httpService.axiosRef.post(url, data, { headers })
      if (response.headers?.code) {
        throw new BusinessException(response.headers?.code, response.data?.message)
      }

      // Return data
      return response.data
    } catch (ex) {
      this.logger.error(`${ex.message || ex} \n ${ex.stack} \n ${JSON.stringify(ex.response?.data)}`)
      throw ex
    }
  }
}
