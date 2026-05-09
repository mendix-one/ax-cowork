import { Response } from 'express'
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { BusinessException } from './business.exception'

@Catch(BusinessException)
export class BusinessExceptionFilter<BusinessException> implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name)

  catch(exception: BusinessException, host: ArgumentsHost) {
    // @ts-expect-error - Exception information
    this.logger.error(`${exception.message || exception}:\n ${exception.stack}`)

    // Redirect to error page
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // @ts-expect-error Just ignore
    const code = exception.code

    // @ts-expect-error Just ignore
    const reason = exception.reason

    // @ts-expect-error Just ignore
    const data = exception.data

    // Response error
    response.status(HttpStatus.OK.valueOf()).set('code', `${code}`).json({
      code: code,
      error: 'Business Logical Error',
      message: reason,
      data: data
    })
  }
}
