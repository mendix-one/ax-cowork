import { createHash } from 'crypto'

import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'

import { API_KEY_HEADER, PUBLIC_ROUTE_KEY } from './api-key.constants'
import { ApiKeyGuard } from './api-key.guard'
import { PRINCIPAL_REQUEST_KEY, type Principal } from './principal'

interface FakeRequest {
  headers: Record<string, string | string[] | undefined>
  [PRINCIPAL_REQUEST_KEY]?: Principal
}

function buildContext(headers: Record<string, string | string[] | undefined>): { ctx: ExecutionContext; req: FakeRequest } {
  const handler = (): void => undefined
  class Cls {}
  const req: FakeRequest = { headers }
  const ctx = {
    switchToHttp: () => ({
      getRequest: () => req,
      getResponse: () => ({}),
      getNext: () => ({}),
    }),
    getHandler: () => handler,
    getClass: () => Cls,
  } as unknown as ExecutionContext
  return { ctx, req }
}

function buildConfig(apiKeys: string, labels?: string): ConfigService {
  return {
    getOrThrow: (key: string) => (key === 'INTEGRATION_API_KEYS' ? apiKeys : undefined),
    get: (key: string) => (key === 'INTEGRATION_API_KEY_LABELS' ? labels : undefined),
  } as unknown as ConfigService
}

function buildReflector(isPublic: boolean): { reflector: Reflector; mock: jest.Mock } {
  const mock = jest.fn().mockReturnValue(isPublic || undefined)
  return { reflector: { getAllAndOverride: mock } as unknown as Reflector, mock }
}

function expectedHash(key: string): string {
  return createHash('sha256').update(key).digest('hex').slice(0, 8)
}

describe('ApiKeyGuard', () => {
  describe('config parsing (phase-1 behaviour preserved)', () => {
    it('parses CSV into a Set of trimmed keys, rejecting empties', () => {
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a, key-b ,  , key-c'))
      const { ctx: ctxB } = buildContext({ [API_KEY_HEADER]: 'key-b' })
      const { ctx: ctxC } = buildContext({ [API_KEY_HEADER]: 'key-c' })
      expect(guard.canActivate(ctxB)).toBe(true)
      expect(guard.canActivate(ctxC)).toBe(true)
    })

    it('throws when INTEGRATION_API_KEYS contains no non-empty entries', () => {
      expect(() => new ApiKeyGuard(buildReflector(false).reflector, buildConfig(' , , '))).toThrow(/at least one non-empty key/)
    })

    it('bypasses when the route is marked @Public()', () => {
      const { reflector, mock } = buildReflector(true)
      const guard = new ApiKeyGuard(reflector, buildConfig('key-a'))
      const { ctx } = buildContext({})
      expect(guard.canActivate(ctx)).toBe(true)
      const firstCallArgs = mock.mock.calls[0] as unknown[]
      expect(firstCallArgs[0]).toBe(PUBLIC_ROUTE_KEY)
    })

    it('throws UnauthorizedException when the header is missing', () => {
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a'))
      const { ctx } = buildContext({})
      expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when the header value is not a known key', () => {
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a'))
      const { ctx } = buildContext({ [API_KEY_HEADER]: 'wrong' })
      expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException)
    })

    it('accepts the first value when the header is provided as an array', () => {
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a'))
      const { ctx } = buildContext({ [API_KEY_HEADER]: ['key-a', 'wrong'] })
      expect(guard.canActivate(ctx)).toBe(true)
    })
  })

  describe('principal attribution (T2-A03)', () => {
    it('attaches a principal with stable keyHash to the request on success', () => {
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-alpha'))
      const { ctx, req } = buildContext({ [API_KEY_HEADER]: 'key-alpha' })

      expect(guard.canActivate(ctx)).toBe(true)
      expect(req[PRINCIPAL_REQUEST_KEY]).toEqual({
        keyHash: expectedHash('key-alpha'),
        label: `key-${expectedHash('key-alpha')}`,
      })
    })

    it('keyHash is deterministic — same key, same hash across guard instances', () => {
      const g1 = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('shared-key'))
      const g2 = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('shared-key'))
      const { ctx: c1, req: r1 } = buildContext({ [API_KEY_HEADER]: 'shared-key' })
      const { ctx: c2, req: r2 } = buildContext({ [API_KEY_HEADER]: 'shared-key' })

      g1.canActivate(c1)
      g2.canActivate(c2)
      expect(r1[PRINCIPAL_REQUEST_KEY]?.keyHash).toBe(r2[PRINCIPAL_REQUEST_KEY]?.keyHash)
    })

    it('maps INTEGRATION_API_KEY_LABELS positionally onto keys', () => {
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('key-a,key-b,key-c', 'ci-deploy,humans,'))
      const cases: { key: string; expectedLabel: string }[] = [
        { key: 'key-a', expectedLabel: 'ci-deploy' },
        { key: 'key-b', expectedLabel: 'humans' },
        { key: 'key-c', expectedLabel: `key-${expectedHash('key-c')}` }, // blank → fallback
      ]
      for (const { key, expectedLabel } of cases) {
        const { ctx, req } = buildContext({ [API_KEY_HEADER]: key })
        guard.canActivate(ctx)
        expect(req[PRINCIPAL_REQUEST_KEY]?.label).toBe(expectedLabel)
      }
    })

    it('falls back to `key-<hash>` label when no labels env is set at all', () => {
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('lone-key'))
      const { ctx, req } = buildContext({ [API_KEY_HEADER]: 'lone-key' })
      guard.canActivate(ctx)
      expect(req[PRINCIPAL_REQUEST_KEY]?.label).toBe(`key-${expectedHash('lone-key')}`)
    })

    it('ignores extra labels beyond the key count (operator drift safety)', () => {
      // 2 keys, 4 labels — extras `extra-1`, `extra-2` are silently dropped.
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('k1,k2', 'one,two,extra-1,extra-2'))
      const { ctx, req } = buildContext({ [API_KEY_HEADER]: 'k1' })
      guard.canActivate(ctx)
      expect(req[PRINCIPAL_REQUEST_KEY]?.label).toBe('one')
    })

    it('does NOT attach a principal when the request hits a @Public() route', () => {
      const { reflector } = buildReflector(true)
      const guard = new ApiKeyGuard(reflector, buildConfig('key-a'))
      const { ctx, req } = buildContext({})
      guard.canActivate(ctx)
      expect(req[PRINCIPAL_REQUEST_KEY]).toBeUndefined()
    })

    it('never stores the raw key on the request — only the hash', () => {
      const guard = new ApiKeyGuard(buildReflector(false).reflector, buildConfig('super-secret-key'))
      const { ctx, req } = buildContext({ [API_KEY_HEADER]: 'super-secret-key' })
      guard.canActivate(ctx)
      const serialized = JSON.stringify(req[PRINCIPAL_REQUEST_KEY])
      expect(serialized).not.toContain('super-secret-key')
    })
  })
})
