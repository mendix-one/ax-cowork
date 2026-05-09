import { Controller, Get, Render } from '@nestjs/common'
import { Biding } from '../../core/interceptor/binding.decorator'

@Controller()
export class ErrorController {
  @Biding()
  @Get(['error', 'not-found', 'duplicated-info'])
  @Render('index')
  error() {
    return {}
  }

  @Biding()
  @Get('system-error')
  @Render('index')
  system() {
    return {}
  }

  @Biding()
  @Get('connect-error')
  @Render('index')
  connect() {
    return {}
  }

  @Biding()
  @Get('authorize-error')
  @Render('index')
  authorize() {
    return {}
  }

  @Biding()
  @Get('invalid-request')
  @Render('index')
  invalid() {
    return {}
  }

  @Biding()
  @Get('code-expired')
  @Render('index')
  expired() {
    return {}
  }
}
