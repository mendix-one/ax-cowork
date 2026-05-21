import { Client, type ClientConfig } from 'pg'
// `pg-cursor` ships without TypeScript types; describe just the surface we use.
import CursorImport from 'pg-cursor'

interface PgCursorLike {
  read(rowCount: number, callback: (err: Error | undefined, rows: Record<string, unknown>[]) => void): void
  close(callback: (err?: Error) => void): void
}

interface PgCursorCtor {
  new (query: string): PgCursorLike
}

const Cursor = CursorImport as unknown as PgCursorCtor

/** Minimal connection abstraction PostgresAdapter consumes — implemented by both the real `pg` client and the test fakes. */
export interface PgConnection {
  /** Streams every row from `query` as a plain object. Honors `signal.aborted`. */
  stream(query: string, chunkSize: number, signal?: AbortSignal): AsyncIterable<Record<string, unknown>>
  close(): Promise<void>
}

export interface PgConnectConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  schema?: string
  connectionTimeoutMs?: number
  queryTimeoutMs?: number
  ssl?: boolean
}

export interface PgConnectionFactory {
  connect(config: PgConnectConfig): Promise<PgConnection>
}

/** Production factory backed by `pg` + `pg-cursor`. Tests pass a fake factory instead. */
export class RealPgConnectionFactory implements PgConnectionFactory {
  async connect(config: PgConnectConfig): Promise<PgConnection> {
    const clientConfig: ClientConfig = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      connectionTimeoutMillis: config.connectionTimeoutMs,
      query_timeout: config.queryTimeoutMs,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
    }
    const client = new Client(clientConfig)
    await client.connect()
    if (config.schema) {
      await client.query(`SET search_path TO ${quoteIdentifier(config.schema)}`)
    }
    return new RealPgConnection(client)
  }
}

class RealPgConnection implements PgConnection {
  constructor(private readonly client: Client) {}

  async *stream(query: string, chunkSize: number, signal?: AbortSignal): AsyncIterable<Record<string, unknown>> {
    const cursor = this.client.query(new Cursor(query) as unknown as never) as PgCursorLike
    try {
      while (true) {
        if (signal?.aborted) return
        const rows: Record<string, unknown>[] = await new Promise((resolve, reject) => {
          cursor.read(chunkSize, (err, fetched) => {
            if (err) reject(err)
            else resolve(fetched)
          })
        })
        if (rows.length === 0) return
        for (const row of rows) {
          if (signal?.aborted) return
          yield row
        }
      }
    } finally {
      await new Promise<void>((resolve) => {
        cursor.close((err) => {
          // Closing a stale cursor can throw — log via stderr but don't propagate.
          if (err) process.stderr.write(`pg-cursor close failed: ${String(err)}\n`)
          resolve()
        })
      })
    }
  }

  async close(): Promise<void> {
    await this.client.end()
  }
}

function quoteIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}
