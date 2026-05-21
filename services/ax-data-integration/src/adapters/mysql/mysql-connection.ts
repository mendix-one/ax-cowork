import { Readable } from 'stream'

import mysql, { type Connection, type ConnectionOptions } from 'mysql2/promise'

/**
 * mysql2's promise wrapper holds the callback-style connection at `.connection`, but the
 * `.d.ts` does not expose it. The streaming API only lives on that callback connection.
 */
interface CallbackConnectionLike {
  query(opts: { sql: string; timeout?: number }): { stream(opts: { highWaterMark: number }): Readable }
}
interface PromiseConnectionInternal {
  connection: CallbackConnectionLike
}

/** Minimal connection abstraction MysqlAdapter consumes — implemented by both the real `mysql2` client and the test fakes. */
export interface MysqlConnection {
  /** Streams every row from `query` as a plain object. Honors `signal.aborted`. */
  stream(query: string, chunkSize: number, signal?: AbortSignal): AsyncIterable<Record<string, unknown>>
  close(): Promise<void>
}

export interface MysqlConnectConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  connectionTimeoutMs?: number
  queryTimeoutMs?: number
  ssl?: boolean
}

export interface MysqlConnectionFactory {
  connect(config: MysqlConnectConfig): Promise<MysqlConnection>
}

/** Production factory backed by `mysql2`. Tests pass a fake factory instead. */
export class RealMysqlConnectionFactory implements MysqlConnectionFactory {
  async connect(config: MysqlConnectConfig): Promise<MysqlConnection> {
    const opts: ConnectionOptions = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      connectTimeout: config.connectionTimeoutMs,
      // mysql2 has no global `query_timeout`; per-query timeout is set on the query object.
      ssl: config.ssl ? { rejectUnauthorized: false } : undefined,
    }
    const conn = await mysql.createConnection(opts)
    return new RealMysqlConnection(conn, config.queryTimeoutMs)
  }
}

class RealMysqlConnection implements MysqlConnection {
  constructor(
    private readonly conn: Connection,
    private readonly queryTimeoutMs: number | undefined,
  ) {}

  async *stream(query: string, chunkSize: number, signal?: AbortSignal): AsyncIterable<Record<string, unknown>> {
    const callbackConn = (this.conn as unknown as PromiseConnectionInternal).connection
    const stream = callbackConn.query({ sql: query, timeout: this.queryTimeoutMs }).stream({ highWaterMark: chunkSize })
    try {
      for await (const row of stream as AsyncIterable<Record<string, unknown>>) {
        if (signal?.aborted) return
        yield row
      }
    } finally {
      stream.destroy()
    }
  }

  async close(): Promise<void> {
    await this.conn.end()
  }
}
