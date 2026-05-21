import { Injectable, Logger } from '@nestjs/common'

import type { AdapterRecord, SourceAdapter, SourceField, SourceFieldType, SourceSchema, StreamOptions } from '../source-adapter.interface'
import { type MssqlConnectConfig, type MssqlConnectionFactory, RealMssqlConnectionFactory } from './mssql-connection'

export interface MssqlAdapterConfig {
  host: string
  port: number
  database: string
  /** Informational — schema namespacing is typically baked into the SQL itself (e.g. `dbo.Customers`). */
  schema?: string
  query: string
  options?: {
    connectionTimeoutMs?: number
    queryTimeoutMs?: number
    ssl?: boolean
    trustServerCertificate?: boolean
  }
}

/** Decrypted credentials shape stored in `secrets` for DB sources. */
export interface MssqlCredentials {
  username: string
  password: string
}

const SAMPLE_LIMIT = 10

@Injectable()
export class MssqlAdapter implements SourceAdapter<MssqlAdapterConfig> {
  readonly type = 'mssql'
  private readonly logger = new Logger(MssqlAdapter.name)

  constructor(private readonly connectionFactory: MssqlConnectionFactory = new RealMssqlConnectionFactory()) {}

  async discoverMetadata(config: MssqlAdapterConfig, credentials: unknown): Promise<SourceSchema> {
    const connectConfig = this.buildConnectConfig(config, credentials)
    const conn = await this.connectionFactory.connect(connectConfig)
    try {
      const samples: Record<string, unknown>[] = []
      const controller = new AbortController()
      for await (const row of conn.stream(config.query, controller.signal)) {
        samples.push(row)
        if (samples.length >= SAMPLE_LIMIT) {
          // Cancel the in-flight request so we don't drain the full result set just to discover schema.
          controller.abort()
          break
        }
      }
      return this.buildSchema(samples)
    } finally {
      await conn.close()
    }
  }

  async *stream(config: MssqlAdapterConfig, credentials: unknown, options: StreamOptions = {}): AsyncIterable<AdapterRecord> {
    const connectConfig = this.buildConnectConfig(config, credentials)
    const conn = await this.connectionFactory.connect(connectConfig)
    let rowNumber = 0
    try {
      for await (const row of conn.stream(config.query, options.signal)) {
        if (options.signal?.aborted) return
        yield { payload: row, sourceInfo: { offset: rowNumber } }
        rowNumber++
      }
    } finally {
      await conn.close()
    }
  }

  private buildConnectConfig(config: MssqlAdapterConfig, credentials: unknown): MssqlConnectConfig {
    const creds = credentials as Partial<MssqlCredentials> | null | undefined
    if (!creds || typeof creds.username !== 'string' || typeof creds.password !== 'string') {
      throw new Error('MssqlAdapter requires credentials { username, password }')
    }
    return {
      host: config.host,
      port: config.port,
      database: config.database,
      user: creds.username,
      password: creds.password,
      schema: config.schema,
      connectionTimeoutMs: config.options?.connectionTimeoutMs,
      queryTimeoutMs: config.options?.queryTimeoutMs,
      ssl: config.options?.ssl,
      trustServerCertificate: config.options?.trustServerCertificate,
    }
  }

  private buildSchema(samples: Record<string, unknown>[]): SourceSchema {
    if (samples.length === 0) return { fields: [], raw: { sampleSize: 0 } }
    const first = samples[0]
    const fields: SourceField[] = Object.keys(first).map((name) => {
      const columnSamples = samples.map((row) => row[name]).filter((v) => v !== null && v !== undefined)
      return {
        name,
        type: inferType(columnSamples),
        nullable: samples.some((row) => row[name] === null || row[name] === undefined),
      }
    })
    return { fields, raw: { sampleSize: samples.length } }
  }
}

function inferType(samples: unknown[]): SourceFieldType {
  if (samples.length === 0) return 'unknown'
  const first = samples[0]
  if (typeof first === 'number') return Number.isInteger(first) ? 'integer' : 'number'
  if (typeof first === 'bigint') return 'integer'
  if (typeof first === 'boolean') return 'boolean'
  if (first instanceof Date) return 'date'
  if (typeof first === 'string') return 'string'
  if (Buffer.isBuffer(first)) return 'string'
  if (Array.isArray(first)) return 'array'
  if (typeof first === 'object') return 'object'
  return 'unknown'
}
