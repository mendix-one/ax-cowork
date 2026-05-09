import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class ConnectExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ConnectExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost) {
    // Logging exception stack
    this.logger.error(`${exception.message || exception}:\n ${exception.stack}`)

    // Redirect to error page
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // Redirect to error page
    if (exception.code) {
      return response.redirect(`/connect-error?code=${exception.code}&remark=${exception.message}`)
    } else {
      return response.redirect(`/system-error`)
    }
  }
}
