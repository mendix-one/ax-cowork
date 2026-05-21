import { Injectable, Logger } from '@nestjs/common'

import type { AdapterRecord, SourceAdapter, SourceField, SourceFieldType, SourceSchema, StreamOptions } from '../source-adapter.interface'
import { type OracleConnectConfig, type OracleConnectionFactory, RealOracleConnectionFactory } from './oracle-connection'

export interface OracleAdapterConfig {
  host: string
  port: number
  /** Oracle service name (preferred) or SID — used to build the connect string `host:port/serviceName`. */
  serviceName: string
  query: string
  options?: {
    connectionTimeoutMs?: number
    /** Thick-mode opt-in. Defaults to false; thin mode supports Oracle DB 12.1+. */
    thickMode?: boolean
  }
}

/** Decrypted credentials shape stored in `secrets` for DB sources. */
export interface OracleCredentials {
  username: string
  password: string
}

const SAMPLE_LIMIT = 10
const STREAM_CHUNK = 100

@Injectable()
export class OracleAdapter implements SourceAdapter<OracleAdapterConfig> {
  readonly type = 'oracle'
  private readonly logger = new Logger(OracleAdapter.name)

  constructor(private readonly connectionFactory: OracleConnectionFactory = new RealOracleConnectionFactory()) {}

  async discoverMetadata(config: OracleAdapterConfig, credentials: unknown): Promise<SourceSchema> {
    const connectConfig = this.buildConnectConfig(config, credentials)
    const conn = await this.connectionFactory.connect(connectConfig)
    try {
      const samples: Record<string, unknown>[] = []
      for await (const row of conn.stream(config.query, SAMPLE_LIMIT)) {
        samples.push(row)
        if (samples.length >= SAMPLE_LIMIT) break
      }
      return this.buildSchema(samples)
    } finally {
      await conn.close()
    }
  }

  async *stream(config: OracleAdapterConfig, credentials: unknown, options: StreamOptions = {}): AsyncIterable<AdapterRecord> {
    const connectConfig = this.buildConnectConfig(config, credentials)
    const conn = await this.connectionFactory.connect(connectConfig)
    let rowNumber = 0
    try {
      for await (const row of conn.stream(config.query, STREAM_CHUNK, options.signal)) {
        if (options.signal?.aborted) return
        yield { payload: row, sourceInfo: { offset: rowNumber } }
        rowNumber++
      }
    } finally {
      await conn.close()
    }
  }

  private buildConnectConfig(config: OracleAdapterConfig, credentials: unknown): OracleConnectConfig {
    const creds = credentials as Partial<OracleCredentials> | null | undefined
    if (!creds || typeof creds.username !== 'string' || typeof creds.password !== 'string') {
      throw new Error('OracleAdapter requires credentials { username, password }')
    }
    return {
      host: config.host,
      port: config.port,
      serviceName: config.serviceName,
      user: creds.username,
      password: creds.password,
      connectionTimeoutMs: config.options?.connectionTimeoutMs,
      thickMode: config.options?.thickMode,
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
