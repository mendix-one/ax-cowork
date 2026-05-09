import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class SystemExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SystemExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    // Logging exception stack
    this.logger.error(`${exception.message || exception}:\n ${exception.stack}`)

    // Redirect to error page
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    return response.redirect(`/system-error`)
  }
}
