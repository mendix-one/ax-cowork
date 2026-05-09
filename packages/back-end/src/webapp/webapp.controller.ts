import { Controller, Get, Render, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Controller()
export class WebappController {
  constructor(private configService: ConfigService) {}

  @Get(['', '/*'])
  @Render('index')
  index() {
    const scripts = this.configService.get<string[]>('WEBAPP_SCRIPTS')
    const styles = this.configService.get<string[]>('WEBPAGE_STYLES')

    return {
      scripts,
      styles,
    }
  }
}
