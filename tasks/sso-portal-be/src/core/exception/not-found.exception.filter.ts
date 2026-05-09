import { ArgumentsHost, Catch, ExceptionFilter, Logger, NotFoundException } from '@nestjs/common'
import { Response } from 'express'

@Catch(NotFoundException)
export class NotFoundExceptionFilter<NotFoundException> implements ExceptionFilter {
  private readonly logger = new Logger(NotFoundExceptionFilter.name)
  catch(exception: NotFoundException, host: ArgumentsHost) {
    // @ts-expect-error - Exception information
    this.logger.error(`${exception.message || exception}:\n ${exception.stack}`)

    // Redirect to error page
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    return response.redirect(`/not-found`)
  }
}
