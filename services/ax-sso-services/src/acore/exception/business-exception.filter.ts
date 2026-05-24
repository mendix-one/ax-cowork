import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import type { Response } from 'express'

import { BusinessException } from './business.exception'

// Custom HTTP header the gateway / SDK clients can read to branch on the business code
// without parsing the body. Lower-case to align with Express's case-normalized headers.
export const BUSINESS_CODE_HEADER = 'code'

// Translates a BusinessException into a 200 OK response with the in-band envelope:
//   - HTTP status: 200 (always, regardless of the business code's semantic)
//   - Header: `code: <number>`
//   - Body:   { code, error, data? }   // `data` only present when the thrower supplied one
//
// REST-only — GraphQL contexts skip this filter (their resolvers surface errors through the
// GraphQL `errors[]` field rather than the HTTP layer).
@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name)

  catch(exception: BusinessException, host: ArgumentsHost): void {
    if (host.getType<'http' | 'graphql'>() !== 'http') {
      // Let other filters / the framework handle non-HTTP transports. Re-throwing keeps the
      // original stack so GraphQL surfaces a meaningful error rather than swallowing it.
      throw exception
    }

    const res = host.switchToHttp().getResponse<Response>()
    const body: { code: number; error: string; data?: unknown } = {
      code: exception.code,
      error: exception.error,
    }
    if (exception.data !== undefined) {
      body.data = exception.data
    }

    this.logger.warn(`BusinessException ${exception.code}: ${exception.error}`)
    res.setHeader(BUSINESS_CODE_HEADER, String(exception.code))
    res.status(HttpStatus.OK).json(body)
  }
}
