import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Reflector } from '@nestjs/core'
import { Biding } from './binding.decorator'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class BindingInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService
  ) {}

  getSiteHost(req: Request): string {
    const host = req.get('host')
    const proto = host.includes('localhost') ? 'http' : 'https'
    return `${proto}://${host}`
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const binding = this.reflector.get<string[]>(Biding, context.getHandler())
    const siteHost = this.getSiteHost(request)

    return next.handle().pipe(
      map(result => {
        if (!binding || !result) {
          return result
        }

        const lang = request.session?.lang || this.configService.get('DEFAULT_LANG')
        const displayLanguages = this.configService.get('DISPLAY_LANGUAGES')
        const language = displayLanguages?.find(x => x.code === lang)

        // Default setting
        let setting = {
          lang: language?.code || lang,
          language: language?.name || 'English',
          timezone: request.session?.timezone || 'Asia/Ho_Chi_Minh',
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

        // Site configuration
        const config = {
          rootDomain: this.configService.get('ROOT_DOMAIN'),
          ssoPortal: this.configService.get('SSO_PORTAL'),
          userPortal: this.configService.get('USER_PORTAL'),
          mainPortal: this.configService.get('MAIN_PORTAL'),
          supportPortal: this.configService.get('SUPPORT_PORTAL'),
          siteIcon: this.configService.get('SITE_ICON'),
          siteLogo: this.configService.get('SITE_LOGO'),
          copyright: this.configService.get('COPYRIGHT'),
          version: this.configService.get('VERSION'),
          siteHost: siteHost
        }

        // Authentication
        const auth = request.auth

        // User setting
        if (auth?.account?.setting) {
          setting = { ...setting, ...auth.account.setting }
          delete auth.account.setting
        }

        // Request path
        const { path } = request

        // Biding meta data
        result.meta = {
          lang: setting.lang,
          title: this.configService.get('META_TITLE'),
          image: this.configService.get('META_IMAGE'),
          description: this.configService.get('META_DESCRIPTION'),
          keywords: this.configService.get('META_KEYWORDS'),
          author: this.configService.get('META_AUTHOR'),
          canonical: path?.trim() && path?.trim() != '/' ? `${siteHost}${path}` : siteHost
        }

        // Binding assets
        result.assets = this.configService.get('ASSETS')

        // Initial data
        if (this.configService.get('MODE') === 'prod' && auth) {
          delete auth.token
        }
        result.initial = JSON.stringify({ auth, setting, config })

        // Set session language & timezone
        request.session.lang = setting.lang
        request.session.timezone = setting.timezone

        // Final result
        return result
      })
    )
  }
}
