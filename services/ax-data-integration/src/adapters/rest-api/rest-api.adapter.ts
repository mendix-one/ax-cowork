import { Injectable, Logger } from '@nestjs/common'
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

import type { AdapterRecord, SourceAdapter, SourceField, SourceFieldType, SourceSchema, StreamOptions } from '../source-adapter.interface'

export type RestPaginationType = 'none' | 'offset' | 'page' | 'cursor'

export interface RestPaginationConfig {
  type: RestPaginationType
  pageParam?: string
  pageSize: number
  pageSizeParam?: string
  totalPath?: string
  cursorPath?: string
  cursorParam?: string
  /** 1-indexed for type='page' (e.g. `?page=1` first). Defaults to 1 when omitted. */
  pageStart?: number
}

export interface RestApiAdapterConfig {
  baseUrl: string
  endpoint: string
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  queryParams?: Record<string, unknown>
  body?: unknown
  /** Dot path to the records array in the response body (e.g. `'data.items'`). Omit when records are at the root. */
  responsePath?: string
  pagination?: RestPaginationConfig
  timeoutMs?: number
  /** HTTP status codes that should trigger an exponential-backoff retry. */
  retryOnStatus?: number[]
  rateLimit?: { rps: number }
}

/** Decrypted shape stored in `secrets` for REST APIs. */
export interface RestApiCredentials {
  scheme: 'bearer' | 'basic' | 'api-key'
  value: string
  /** Header name for `api-key` scheme. Defaults to `X-API-Key`. */
  headerName?: string
}

const DEFAULT_TIMEOUT_MS = 30_000
const MAX_RETRY_ATTEMPTS = 3
const BASE_BACKOFF_MS = 250

@Injectable()
export class RestApiAdapter implements SourceAdapter<RestApiAdapterConfig> {
  readonly type = 'rest'
  private readonly logger = new Logger(RestApiAdapter.name)

  constructor(private readonly http: AxiosInstance = axios) {}

  async discoverMetadata(config: RestApiAdapterConfig, credentials: unknown): Promise<SourceSchema> {
    const headers = this.buildHeaders(config, credentials)
    const params = this.buildInitialParams(config)
    const response = await this.fetchOne(config, headers, params)
    const records = extractRecords(response.data, config.responsePath)

    if (records.length === 0) {
      return { fields: [], raw: { url: this.fullUrl(config), sampleSize: 0 } }
    }

    const first = records[0] as Record<string, unknown>
    const fields: SourceField[] = Object.entries(first).map(([name, value]) => ({
      name,
      type: inferType(value),
      nullable: value === null || value === undefined,
    }))
    return { fields, raw: { url: this.fullUrl(config), sampleSize: records.length } }
  }

  async *stream(config: RestApiAdapterConfig, credentials: unknown, options: StreamOptions = {}): AsyncIterable<AdapterRecord> {
    const headers = this.buildHeaders(config, credentials)
    const pagination = config.pagination
    const type: RestPaginationType = pagination?.type ?? 'none'

    let pageIndex = pagination?.pageStart ?? 1
    let offset = 0
    let cursor: unknown = undefined
    let rowNumber = 0
    let lastRequestAt = 0

    while (true) {
      if (options.signal?.aborted) return

      if (config.rateLimit?.rps && lastRequestAt > 0) {
        const interval = 1000 / config.rateLimit.rps
        const wait = interval - (Date.now() - lastRequestAt)
        if (wait > 0) await sleep(wait)
      }

      const params = this.buildPaginationParams(config, type, pageIndex, offset, cursor)
      lastRequestAt = Date.now()
      const response = await this.fetchOne(config, headers, params)
      const records = extractRecords(response.data, config.responsePath)

      for (const record of records) {
        yield { payload: record as Record<string, unknown>, sourceInfo: { offset: rowNumber } }
        rowNumber++
      }

      if (type === 'none') return
      if (records.length === 0) return

      if (type === 'cursor') {
        cursor = pagination?.cursorPath ? getByPath(response.data, pagination.cursorPath) : undefined
        if (cursor === null || cursor === undefined || cursor === '') return
      } else {
        if (pagination && records.length < pagination.pageSize) return
        if (type === 'page') pageIndex++
        else offset += pagination?.pageSize ?? records.length
      }
    }
  }

  private buildHeaders(config: RestApiAdapterConfig, credentials: unknown): Record<string, string> {
    const base: Record<string, string> = { ...(config.headers ?? {}) }
    const authHeaders = buildAuthHeaders(credentials)
    return { ...base, ...authHeaders }
  }

  private buildInitialParams(config: RestApiAdapterConfig): Record<string, unknown> {
    const params: Record<string, unknown> = { ...(config.queryParams ?? {}) }
    const pagination = config.pagination
    if (pagination && pagination.type !== 'none' && pagination.pageSizeParam) {
      params[pagination.pageSizeParam] = pagination.pageSize
    }
    return params
  }

  private buildPaginationParams(
    config: RestApiAdapterConfig,
    type: RestPaginationType,
    pageIndex: number,
    offset: number,
    cursor: unknown,
  ): Record<string, unknown> {
    const params = this.buildInitialParams(config)
    const pagination = config.pagination
    if (!pagination || type === 'none') return params

    if (type === 'page' && pagination.pageParam) params[pagination.pageParam] = pageIndex
    if (type === 'offset' && pagination.pageParam) params[pagination.pageParam] = offset
    if (type === 'cursor' && pagination.cursorParam && cursor !== undefined) {
      params[pagination.cursorParam] = cursor
    }
    return params
  }

  private async fetchOne(config: RestApiAdapterConfig, headers: Record<string, string>, params: Record<string, unknown>): Promise<AxiosResponse> {
    const retryStatuses = new Set(config.retryOnStatus ?? [])
    const maxAttempts = retryStatuses.size > 0 ? MAX_RETRY_ATTEMPTS : 1

    const requestConfig: AxiosRequestConfig = {
      url: this.fullUrl(config),
      method: config.method,
      headers,
      params,
      timeout: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      validateStatus: () => true,
    }
    if (config.method === 'POST' && config.body !== undefined) requestConfig.data = config.body

    // Network errors from axios bubble out naturally (no auto-retry). Retry only kicks in
    // when the response status is explicitly listed in `retryOnStatus`.
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) await sleep(BASE_BACKOFF_MS * 2 ** (attempt - 1))

      const response = await this.http.request(requestConfig)
      if (response.status >= 200 && response.status < 300) return response

      const message = `HTTP ${response.status}: ${response.statusText}`
      if (!retryStatuses.has(response.status)) {
        // Permanent failure — caller-configured retries don't apply.
        throw new Error(message)
      }
      if (attempt >= maxAttempts - 1) {
        throw new Error(`${message} (exhausted ${maxAttempts} attempts)`)
      }
      this.logger.warn(`${message} on ${requestConfig.url as string}; retrying ${attempt + 1}/${maxAttempts - 1}`)
    }
    // Unreachable — every loop iteration either returns or throws.
    throw new Error('REST request failed: retry loop ended unexpectedly')
  }

  private fullUrl(config: RestApiAdapterConfig): string {
    const base = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl
    const endpoint = config.endpoint.startsWith('/') ? config.endpoint : `/${config.endpoint}`
    return `${base}${endpoint}`
  }
}

function buildAuthHeaders(credentials: unknown): Record<string, string> {
  if (!credentials || typeof credentials !== 'object') return {}
  const c = credentials as Partial<RestApiCredentials>
  if (!c.scheme || typeof c.value !== 'string') return {}
  switch (c.scheme) {
    case 'bearer':
      return { Authorization: `Bearer ${c.value}` }
    case 'basic':
      return { Authorization: `Basic ${c.value}` }
    case 'api-key':
      return { [c.headerName ?? 'X-API-Key']: c.value }
    default:
      return {}
  }
}

function extractRecords(body: unknown, responsePath: string | undefined): unknown[] {
  const target = responsePath ? getByPath(body, responsePath) : body
  if (Array.isArray(target)) return target
  if (target === null || target === undefined) return []
  // Single-object response — wrap in array so downstream classify gets one record.
  return [target]
}

function getByPath(obj: unknown, path: string): unknown {
  if (!path) return obj
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return acc
    if (typeof acc !== 'object') return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

function inferType(value: unknown): SourceFieldType {
  if (value === null || value === undefined) return 'unknown'
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'string') return 'string'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return 'unknown'
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
