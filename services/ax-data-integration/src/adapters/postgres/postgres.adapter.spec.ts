import type { AdapterRecord } from '../source-adapter.interface'
import { type PgConnection, type PgConnectionFactory, type PgConnectConfig } from './pg-connection'
import { PostgresAdapter, type PostgresAdapterConfig } from './postgres.adapter'

const baseConfig: PostgresAdapterConfig = {
  host: 'db.local',
  port: 5432,
  database: 'sales',
  query: 'SELECT id, name FROM customers',
}

const validCreds = { username: 'u', password: 'p' }

function fakeFactory(opts: {
  rows?: Record<string, unknown>[]
  onConnect?: (cfg: PgConnectConfig) => void
  closeSpy?: jest.Mock
  streamError?: Error
}): PgConnectionFactory {
  return {
    connect: (cfg) => {
      opts.onConnect?.(cfg)
      const rows = opts.rows ?? []
      const closeSpy = opts.closeSpy ?? jest.fn()
      const conn: PgConnection = {
        // eslint-disable-next-line @typescript-eslint/require-await
        stream: async function* (_query, _chunk, signal) {
          if (opts.streamError) throw opts.streamError
          for (const row of rows) {
            if (signal?.aborted) return
            yield row
          }
        },
        close: () => {
          closeSpy()
          return Promise.resolve()
        },
      }
      return Promise.resolve(conn)
    },
  }
}

async function collect<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = []
  for await (const item of iter) out.push(item)
  return out
}

describe('PostgresAdapter', () => {
  describe('credentials', () => {
    it('throws when credentials are missing', async () => {
      const adapter = new PostgresAdapter(fakeFactory({}))
      await expect(adapter.discoverMetadata(baseConfig, null)).rejects.toThrow(/credentials/)
    })

    it('throws when username or password is not a string', async () => {
      const adapter = new PostgresAdapter(fakeFactory({}))
      await expect(adapter.discoverMetadata(baseConfig, { username: 'u' })).rejects.toThrow(/credentials/)
    })
  })

  describe('discoverMetadata', () => {
    it('infers field types from sample rows', async () => {
      const rows = [
        { id: 1, name: 'Alice', joined_at: new Date('2026-01-01T00:00:00Z'), active: true },
        { id: 2, name: 'Bob', joined_at: new Date('2026-02-01T00:00:00Z'), active: false },
      ]
      const adapter = new PostgresAdapter(fakeFactory({ rows }))
      const meta = await adapter.discoverMetadata(baseConfig, validCreds)
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f.type]))
      expect(byName.id).toBe('integer')
      expect(byName.name).toBe('string')
      expect(byName.joined_at).toBe('date')
      expect(byName.active).toBe('boolean')
    })

    it('marks fields nullable when a sample row has null', async () => {
      const adapter = new PostgresAdapter(
        fakeFactory({
          rows: [
            { id: 1, optional: 'x' },
            { id: 2, optional: null },
          ],
        }),
      )
      const meta = await adapter.discoverMetadata(baseConfig, validCreds)
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f.nullable]))
      expect(byName.id).toBe(false)
      expect(byName.optional).toBe(true)
    })

    it('returns empty fields list for empty result', async () => {
      const adapter = new PostgresAdapter(fakeFactory({ rows: [] }))
      const meta = await adapter.discoverMetadata(baseConfig, validCreds)
      expect(meta.fields).toEqual([])
    })

    it('closes the connection even when stream throws', async () => {
      const closeSpy = jest.fn()
      const adapter = new PostgresAdapter(fakeFactory({ closeSpy, streamError: new Error('boom') }))
      await expect(adapter.discoverMetadata(baseConfig, validCreds)).rejects.toThrow(/boom/)
      expect(closeSpy).toHaveBeenCalled()
    })
  })

  describe('stream', () => {
    it('yields one AdapterRecord per row with sourceInfo.offset', async () => {
      const rows = [{ id: 1 }, { id: 2 }, { id: 3 }]
      const adapter = new PostgresAdapter(fakeFactory({ rows }))
      const records = await collect(adapter.stream(baseConfig, validCreds))
      expect(records).toHaveLength(3)
      expect(records[0]).toEqual<AdapterRecord>({ payload: { id: 1 }, sourceInfo: { offset: 0 } })
      expect(records[2]).toEqual<AdapterRecord>({ payload: { id: 3 }, sourceInfo: { offset: 2 } })
    })

    it('aborts cleanly when options.signal is already aborted', async () => {
      const controller = new AbortController()
      controller.abort()
      const adapter = new PostgresAdapter(fakeFactory({ rows: [{ id: 1 }, { id: 2 }] }))
      const records = await collect(adapter.stream(baseConfig, validCreds, { signal: controller.signal }))
      expect(records).toHaveLength(0)
    })

    it('closes the connection after streaming completes', async () => {
      const closeSpy = jest.fn()
      const adapter = new PostgresAdapter(fakeFactory({ rows: [{ id: 1 }], closeSpy }))
      await collect(adapter.stream(baseConfig, validCreds))
      expect(closeSpy).toHaveBeenCalled()
    })
  })

  describe('connection config', () => {
    it('passes host/port/database + ssl + credentials to the factory', async () => {
      const captured: PgConnectConfig[] = []
      const adapter = new PostgresAdapter(
        fakeFactory({
          onConnect: (cfg) => captured.push(cfg),
          rows: [],
        }),
      )
      await adapter.discoverMetadata({ ...baseConfig, options: { ssl: true, connectionTimeoutMs: 5000 } }, validCreds)
      expect(captured).toHaveLength(1)
      expect(captured[0]).toMatchObject({ host: 'db.local', port: 5432, database: 'sales', user: 'u', password: 'p', ssl: true, connectionTimeoutMs: 5000 })
    })
  })
})
