import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

import type { AdapterRecord } from '../source-adapter.interface'
import { RestApiAdapter, type RestApiAdapterConfig } from './rest-api.adapter'

interface MockedAxios {
  request: jest.Mock<Promise<AxiosResponse>, [AxiosRequestConfig]>
}

function makeAdapter(): { adapter: RestApiAdapter; http: MockedAxios } {
  const request = jest.fn() as MockedAxios['request']
  const http: MockedAxios = { request }
  const adapter = new RestApiAdapter(http as unknown as AxiosInstance)
  return { adapter, http }
}

function ok(data: unknown): AxiosResponse {
  return { data, status: 200, statusText: 'OK', headers: {}, config: {} as AxiosRequestConfig }
}

function status(code: number, data: unknown = {}): AxiosResponse {
  return { data, status: code, statusText: `HTTP ${code}`, headers: {}, config: {} as AxiosRequestConfig }
}

const baseConfig: RestApiAdapterConfig = {
  baseUrl: 'https://api.example.com',
  endpoint: '/items',
  method: 'GET',
}

async function collect<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = []
  for await (const item of iter) out.push(item)
  return out
}

describe('RestApiAdapter', () => {
  describe('discoverMetadata', () => {
    it('infers field types from the first record', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok({ data: [{ id: 1, name: 'Alice', active: true, score: 99.5 }] }))

      const meta = await adapter.discoverMetadata({ ...baseConfig, responsePath: 'data' }, undefined)
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f.type]))
      expect(byName.id).toBe('integer')
      expect(byName.name).toBe('string')
      expect(byName.active).toBe('boolean')
      expect(byName.score).toBe('number')
    })

    it('returns empty fields when response array is empty', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok({ data: [] }))
      const meta = await adapter.discoverMetadata({ ...baseConfig, responsePath: 'data' }, undefined)
      expect(meta.fields).toEqual([])
    })
  })

  describe('stream', () => {
    it('issues a single request when pagination.type=none', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok([{ id: 1 }, { id: 2 }]))

      const records = await collect(adapter.stream({ ...baseConfig }, undefined))
      expect(http.request).toHaveBeenCalledTimes(1)
      expect(records.map((r) => r.payload)).toEqual([{ id: 1 }, { id: 2 }])
      expect(records[0].sourceInfo?.offset).toBe(0)
      expect(records[1].sourceInfo?.offset).toBe(1)
    })

    it('paginates by page until the response is short', async () => {
      const { adapter, http } = makeAdapter()
      http.request
        .mockResolvedValueOnce(ok([{ id: 1 }, { id: 2 }]))
        .mockResolvedValueOnce(ok([{ id: 3 }, { id: 4 }]))
        .mockResolvedValueOnce(ok([{ id: 5 }])) // short → loop ends

      const records = await collect(
        adapter.stream(
          {
            ...baseConfig,
            pagination: { type: 'page', pageParam: 'page', pageSize: 2, pageSizeParam: 'limit', pageStart: 1 },
          },
          undefined,
        ),
      )
      expect(http.request).toHaveBeenCalledTimes(3)
      expect(records.map((r) => (r.payload as { id: number }).id)).toEqual([1, 2, 3, 4, 5])

      const pages = http.request.mock.calls.map((c) => (c[0].params as { page?: number }).page)
      expect(pages).toEqual([1, 2, 3])
    })

    it('paginates by offset, increasing by pageSize each request', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok([{ id: 1 }, { id: 2 }])).mockResolvedValueOnce(ok([{ id: 3 }]))

      await collect(
        adapter.stream(
          {
            ...baseConfig,
            pagination: { type: 'offset', pageParam: 'offset', pageSize: 2, pageSizeParam: 'limit' },
          },
          undefined,
        ),
      )

      const offsets = http.request.mock.calls.map((c) => (c[0].params as { offset?: number }).offset)
      expect(offsets).toEqual([0, 2])
    })

    it('paginates by cursor until the cursor field is empty', async () => {
      const { adapter, http } = makeAdapter()
      http.request
        .mockResolvedValueOnce(ok({ items: [{ id: 1 }, { id: 2 }], meta: { next: 'abc' } }))
        .mockResolvedValueOnce(ok({ items: [{ id: 3 }], meta: { next: null } }))

      const records = await collect(
        adapter.stream(
          {
            ...baseConfig,
            responsePath: 'items',
            pagination: { type: 'cursor', pageSize: 2, cursorPath: 'meta.next', cursorParam: 'cursor' },
          },
          undefined,
        ),
      )
      expect(records.map((r) => (r.payload as { id: number }).id)).toEqual([1, 2, 3])

      const cursorParams = http.request.mock.calls.map((c) => (c[0].params as { cursor?: string }).cursor)
      expect(cursorParams).toEqual([undefined, 'abc'])
    })

    it('aborts cleanly when options.signal is already aborted', async () => {
      const { adapter, http } = makeAdapter()
      const controller = new AbortController()
      controller.abort()
      const records = await collect(adapter.stream({ ...baseConfig }, undefined, { signal: controller.signal }))
      expect(records).toEqual([])
      expect(http.request).not.toHaveBeenCalled()
    })

    it('adds Bearer auth header when credentials.scheme="bearer"', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok([]))
      await collect(adapter.stream({ ...baseConfig }, { scheme: 'bearer', value: 'secret-token' }))
      const headers = http.request.mock.calls[0][0].headers as Record<string, string>
      expect(headers.Authorization).toBe('Bearer secret-token')
    })

    it('uses the api-key header name when scheme="api-key"', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok([]))
      await collect(adapter.stream({ ...baseConfig }, { scheme: 'api-key', value: 'KEY', headerName: 'X-Custom' }))
      const headers = http.request.mock.calls[0][0].headers as Record<string, string>
      expect(headers['X-Custom']).toBe('KEY')
    })
  })

  describe('retry', () => {
    it('retries on configured status codes with backoff', async () => {
      const { adapter, http } = makeAdapter()
      http.request
        .mockResolvedValueOnce(status(503))
        .mockResolvedValueOnce(status(503))
        .mockResolvedValueOnce(ok([{ id: 1 }]))

      const records = await collect(adapter.stream({ ...baseConfig, retryOnStatus: [503] }, undefined))
      expect(records).toHaveLength(1)
      expect(http.request).toHaveBeenCalledTimes(3)
    })

    it('does not retry on status codes not in retryOnStatus', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(status(400))

      const records: AdapterRecord[] = []
      await expect(
        (async () => {
          for await (const r of adapter.stream({ ...baseConfig, retryOnStatus: [503] }, undefined)) records.push(r)
        })(),
      ).rejects.toThrow(/HTTP 400/)
      expect(http.request).toHaveBeenCalledTimes(1)
    })

    it('throws when retries exhaust', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(status(503)).mockResolvedValueOnce(status(503)).mockResolvedValueOnce(status(503))

      await expect(
        (async () => {
          for await (const _ of adapter.stream({ ...baseConfig, retryOnStatus: [503] }, undefined)) {
            // never reached
          }
        })(),
      ).rejects.toThrow(/HTTP 503/)
    })
  })

  describe('rateLimit', () => {
    it('sleeps between requests so they respect rps', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok([{ id: 1 }, { id: 2 }])).mockResolvedValueOnce(ok([{ id: 3 }]))

      const start = Date.now()
      await collect(
        adapter.stream(
          {
            ...baseConfig,
            pagination: { type: 'page', pageParam: 'page', pageSize: 2, pageSizeParam: 'limit' },
            rateLimit: { rps: 20 }, // 50 ms gap
          },
          undefined,
        ),
      )
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(45) // small slack for timer skew
    })
  })

  describe('url + extractRecords', () => {
    it('joins baseUrl + endpoint correctly with or without slashes', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok([]))
      await collect(adapter.stream({ baseUrl: 'https://api.example.com/', endpoint: 'items', method: 'GET' }, undefined))
      expect(http.request.mock.calls[0][0].url).toBe('https://api.example.com/items')
    })

    it('wraps a single-object response into one record', async () => {
      const { adapter, http } = makeAdapter()
      http.request.mockResolvedValueOnce(ok({ id: 42, name: 'solo' }))
      const records = await collect(adapter.stream({ ...baseConfig }, undefined))
      expect(records).toHaveLength(1)
      expect(records[0].payload).toEqual({ id: 42, name: 'solo' })
    })
  })
})
