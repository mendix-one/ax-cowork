import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'

import { API_KEY_HEADER, PUBLIC_ROUTE_KEY } from './api-key.constants'
import { ApiKeyGuard } from './api-key.guard'

function buildContext(headers: Record<string, string | string[] | undefined>): ExecutionContext {
  const handler = (): void => undefined
  class Cls {}
  return {
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
      getResponse: () => ({}),
      getNext: () => ({}),
    }),
    getHandler: () => handler,
    getClass: () => Cls,
  } as unknown as ExecutionContext
}

function buildConfig(apiKeys: string): ConfigService {
  return { getOrThrow: (key: string) => (key === 'INTEGRATION_API_KEYS' ? apiKeys : undefined) } as unknown as ConfigService
}

function buildReflector(isPublic: boolean): { reflector: Reflector; mock: jest.Mock } {
  const mock = jest.fn().mockReturnValue(isPublic || undefined)
  return { reflector: { getAllAndOverride: mock } as unknown as Reflector, mock }
}

describe('ApiKeyGuard', () => {
  it('parses CSV into a Set of trimmed keys, rejecting empties', () => {
    const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a, key-b ,  , key-c'))
    expect(guard.canActivate(buildContext({ [API_KEY_HEADER]: 'key-b' }))).toBe(true)
    expect(guard.canActivate(buildContext({ [API_KEY_HEADER]: 'key-c' }))).toBe(true)
  })

  it('throws when INTEGRATION_API_KEYS contains no non-empty entries', () => {
    expect(() => new ApiKeyGuard(buildReflector(false).reflector, buildConfig(' , , '))).toThrow(/at least one non-empty key/)
  })

  it('bypasses when the route is marked @Public()', () => {
    const { reflector, mock } = buildReflector(true)
    const guard = new ApiKeyGuard(reflector, buildConfig('key-a'))
    expect(guard.canActivate(buildContext({}))).toBe(true)
    const firstCallArgs = mock.mock.calls[0] as unknown[]
    expect(firstCallArgs[0]).toBe(PUBLIC_ROUTE_KEY)
  })

  it('throws UnauthorizedException when the header is missing', () => {
    const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a'))
    expect(() => guard.canActivate(buildContext({}))).toThrow(UnauthorizedException)
  })

  it('throws UnauthorizedException when the header value is not a known key', () => {
    const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a'))
    expect(() => guard.canActivate(buildContext({ [API_KEY_HEADER]: 'wrong' }))).toThrow(UnauthorizedException)
  })

  it('accepts the first value when the header is provided as an array', () => {
    const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a'))
    expect(guard.canActivate(buildContext({ [API_KEY_HEADER]: ['key-a', 'wrong'] }))).toBe(true)
  })
})
