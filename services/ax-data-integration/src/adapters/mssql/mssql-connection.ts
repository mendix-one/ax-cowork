import sql, { type ConnectionPool, type config as MssqlPoolConfig } from 'mssql'

/**
 * Narrow surface of `mssql.Request` we actually use. mssql's `Request` is an EventEmitter
 * subclass, but the type-aware lint cannot follow the inherited methods through the package
 * declaration files — declaring the shape locally keeps the call sites strictly typed.
 */
type MssqlRowHandler = (row: Record<string, unknown>) => void
type MssqlDoneHandler = () => void
type MssqlErrorHandler = (err: Error) => void
interface MssqlRequestLike {
  stream: boolean
  on(event: 'row', handler: MssqlRowHandler): void
  on(event: 'done', handler: MssqlDoneHandler): void
  on(event: 'error', handler: MssqlErrorHandler): void
  query(sql: string): void
  cancel(): void
}

/** Minimal connection abstraction MssqlAdapter consumes — implemented by both the real `mssql` client and the test fakes. */
export interface MssqlConnection {
  /** Streams every row from `query` as a plain object. Honors `signal.aborted`. */
  stream(query: string, signal?: AbortSignal): AsyncIterable<Record<string, unknown>>
  close(): Promise<void>
}

export interface MssqlConnectConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  /** SQL Server "schema" (e.g. `dbo`). Currently informational — `mssql` does not have a per-connection search path. */
  schema?: string
  connectionTimeoutMs?: number
  queryTimeoutMs?: number
  ssl?: boolean
  /** Trust self-signed server certs. Defaults to `true` (matches on-prem norms). */
  trustServerCertificate?: boolean
}

export interface MssqlConnectionFactory {
  connect(config: MssqlConnectConfig): Promise<MssqlConnection>
}

/** Production factory backed by `mssql` (which wraps `tedious`). Tests pass a fake factory instead. */
export class RealMssqlConnectionFactory implements MssqlConnectionFactory {
  async connect(config: MssqlConnectConfig): Promise<MssqlConnection> {
    const poolConfig: MssqlPoolConfig = {
      server: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      connectionTimeout: config.connectionTimeoutMs,
      requestTimeout: config.queryTimeoutMs,
      options: {
        encrypt: config.ssl ?? false,
        trustServerCertificate: config.trustServerCertificate ?? true,
      },
    }
    const pool = new sql.ConnectionPool(poolConfig)
    await pool.connect()
    return new RealMssqlConnection(pool)
  }
}

class RealMssqlConnection implements MssqlConnection {
  constructor(private readonly pool: ConnectionPool) {}

  async *stream(query: string, signal?: AbortSignal): AsyncIterable<Record<string, unknown>> {
    const request = this.pool.request() as unknown as MssqlRequestLike
    request.stream = true
    const queue: Record<string, unknown>[] = []
    let done = false
    let error: Error | null = null
    let resolveWaiter: (() => void) | null = null
    const wake = (): void => {
      const r = resolveWaiter
      resolveWaiter = null
      r?.()
    }

    request.on('row', (row) => {
      queue.push(row)
      wake()
    })
    request.on('done', () => {
      done = true
      wake()
    })
    request.on('error', (err) => {
      error = err
      wake()
    })

    request.query(query)

    try {
      while (true) {
        if (signal?.aborted) {
          request.cancel()
          return
        }
        if (queue.length > 0) {
          yield queue.shift() as Record<string, unknown>
          continue
        }
        if (error !== null) {
          const toThrow: Error = error
          throw toThrow
        }
        if (done) return
        await new Promise<void>((resolve) => {
          resolveWaiter = resolve
        })
      }
    } finally {
      // If the consumer breaks early, cancel the in-flight request to free the connection.
      if (!done && error === null) {
        request.cancel()
      }
    }
  }

  async close(): Promise<void> {
    await this.pool.close()
  }
}
