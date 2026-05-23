import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

interface RequestLike {
  headers: Record<string, string | string[] | undefined>
}

// `@GqlHeader('account')` — case-insensitive header reader inside GraphQL resolvers.
// The header value is whatever `SecurityCheckGuard` wrote onto the request after verifying the
// JWT (e.g. `account`, `session`, `state`), so callers can trust it without re-decoding the token.
export const GqlHeader = createParamDecorator((name: string, ctx: ExecutionContext): string | undefined => {
  const req = GqlExecutionContext.create(ctx).getContext<{ req?: RequestLike }>().req
  const raw = req?.headers[name.toLowerCase()]
  return Array.isArray(raw) ? raw[0] : raw
})
