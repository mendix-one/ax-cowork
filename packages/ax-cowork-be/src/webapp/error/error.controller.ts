import { Controller, Get, Render } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Controller()
export class ErrorController {
  constructor(private readonly configService: ConfigService) {}

  @Get(['system-error', 'system-exception', 'access-denied', 'not-found'])
  @Render('index')
  index() {
    const scripts = this.configService.get<string[]>('WEBAPP_SCRIPTS')
    const styles = this.configService.get<string[]>('WEBPAGE_STYLES')

    return { meta: '{}', scripts, styles }
  }
}
