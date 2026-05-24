import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'

// Single documented BusinessException case — code, the canonical error string the service
// throws, and an optional `data` payload example. Use one entry per distinct (code, scenario).
export interface BusinessErrorDoc {
  code: number
  error: string
  data?: unknown
  // Optional human description shown in Swagger UI's example label. Falls back to `error`.
  description?: string
}

// Documents an endpoint that returns either:
//   - a 200 with the typed success payload (per `successType`), OR
//   - a 200 with the BusinessException envelope `{ code, error, data? }` for one of the
//     documented cases listed in `businessErrors`.
//
// Use this INSTEAD of `@ApiOkResponse` on the route handler. Swagger UI renders the success
// schema as the response shape and surfaces the business cases under the "Examples" dropdown
// (one per listed code) so consumers can see all envelopes the endpoint may produce.
//
//   @ApiOkWithBusinessErrors(SigninResDto, [
//     { code: 1, error: 'Invalid credentials' },
//     { code: 2, error: 'Account is not active', data: { status: 'LOCKED' } },
//   ])
export function ApiOkWithBusinessErrors<T>(successType: Type<T>, businessErrors: BusinessErrorDoc[], description?: string): MethodDecorator & ClassDecorator {
  const examples: Record<string, { summary: string; value: unknown }> = {
    Success: { summary: 'Success — see schema for shape', value: undefined },
  }
  for (const e of businessErrors) {
    examples[`Business${e.code}`] = {
      summary: `Business ${e.code} — ${e.description ?? e.error}`,
      value: { code: e.code, error: e.error, ...(e.data !== undefined ? { data: e.data } : {}) },
    }
  }

  return applyDecorators(
    ApiExtraModels(successType),
    ApiResponse({
      status: 200,
      description:
        description ??
        'Operation result. May be the typed success payload or, when a business rule blocks the action, a `{ code, error, data? }` envelope (HTTP stays 200; the `code` HTTP header mirrors the body `code`).',
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(successType) },
          examples,
        },
      },
    }),
  )
}
