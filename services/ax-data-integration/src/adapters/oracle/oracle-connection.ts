import oracledb, { type Connection, type ConnectionAttributes } from 'oracledb'

/** Minimal connection abstraction OracleAdapter consumes — implemented by both the real `oracledb` client and the test fakes. */
export interface OracleConnection {
  /** Streams every row from `query` as a plain object. Honors `signal.aborted`. */
  stream(query: string, chunkSize: number, signal?: AbortSignal): AsyncIterable<Record<string, unknown>>
  close(): Promise<void>
}

export interface OracleConnectConfig {
  host: string
  port: number
  /** Oracle service name (preferred) or SID. Used to build the connectString. */
  serviceName: string
  user: string
  password: string
  connectionTimeoutMs?: number
  /** Thick-mode opt-in. Defaults to false (pure-JS thin mode — no Instant Client required). */
  thickMode?: boolean
}

export interface OracleConnectionFactory {
  connect(config: OracleConnectConfig): Promise<OracleConnection>
}

let thickModeInitialized = false

/**
 * Production factory backed by `oracledb`. Defaults to thin mode (pure JS, Oracle DB 12.1+,
 * no Instant Client). Tests pass a fake factory instead.
 */
export class RealOracleConnectionFactory implements OracleConnectionFactory {
  async connect(config: OracleConnectConfig): Promise<OracleConnection> {
    if (config.thickMode === true && !thickModeInitialized) {
      // initOracleClient is idempotent only within a process; the guard prevents `NJS-077`.
      oracledb.initOracleClient()
      thickModeInitialized = true
    }
    // CLOBs as strings (vs. Lob streams) — keeps the row shape JSON-serializable for raw_records.
    oracledb.fetchAsString = [oracledb.CLOB]

    const attrs: ConnectionAttributes = {
      user: config.user,
      password: config.password,
      connectString: `${config.host}:${config.port}/${config.serviceName}`,
    }
    const conn = await oracledb.getConnection(attrs)
    if (typeof config.connectionTimeoutMs === 'number') {
      // Sets per-statement timeout (oracledb has no global setting); zero means no timeout.
      conn.callTimeout = config.connectionTimeoutMs
    }
    return new RealOracleConnection(conn)
  }
}

class RealOracleConnection implements OracleConnection {
  constructor(private readonly conn: Connection) {}

  async *stream(query: string, chunkSize: number, signal?: AbortSignal): AsyncIterable<Record<string, unknown>> {
    const stream = this.conn.queryStream<Record<string, unknown>>(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      fetchArraySize: chunkSize,
    })
    try {
      for await (const row of stream) {
        if (signal?.aborted) return
        yield row
      }
    } finally {
      stream.destroy()
    }
  }

  async close(): Promise<void> {
    await this.conn.close()
  }
}
