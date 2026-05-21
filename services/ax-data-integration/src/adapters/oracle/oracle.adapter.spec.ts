import type { AdapterRecord } from '../source-adapter.interface'
import { type OracleConnection, type OracleConnectionFactory, type OracleConnectConfig } from './oracle-connection'
import { OracleAdapter, type OracleAdapterConfig } from './oracle.adapter'

const baseConfig: OracleAdapterConfig = {
  host: 'oradb.local',
  port: 1521,
  serviceName: 'ORCLPDB1',
  query: 'SELECT id, name FROM customers',
}

const validCreds = { username: 'system', password: 'p' }

function fakeFactory(opts: {
  rows?: Record<string, unknown>[]
  onConnect?: (cfg: OracleConnectConfig) => void
  closeSpy?: jest.Mock
  streamError?: Error
}): OracleConnectionFactory {
  return {
    connect: (cfg) => {
      opts.onConnect?.(cfg)
      const rows = opts.rows ?? []
      const closeSpy = opts.closeSpy ?? jest.fn()
      const conn: OracleConnection = {
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

describe('OracleAdapter', () => {
  describe('credentials', () => {
    it('throws when credentials are missing', async () => {
      const adapter = new OracleAdapter(fakeFactory({}))
      await expect(adapter.discoverMetadata(baseConfig, null)).rejects.toThrow(/credentials/)
    })

    it('throws when username or password is not a string', async () => {
      const adapter = new OracleAdapter(fakeFactory({}))
      await expect(adapter.discoverMetadata(baseConfig, { username: 'system' })).rejects.toThrow(/credentials/)
    })
  })

  describe('discoverMetadata', () => {
    it('infers field types from sample rows', async () => {
      const rows = [
        { ID: 1, NAME: 'Alice', JOINED_AT: new Date('2026-01-01T00:00:00Z'), AMOUNT: 12.5 },
        { ID: 2, NAME: 'Bob', JOINED_AT: new Date('2026-02-01T00:00:00Z'), AMOUNT: 99.0 },
      ]
      const adapter = new OracleAdapter(fakeFactory({ rows }))
      const meta = await adapter.discoverMetadata(baseConfig, validCreds)
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f.type]))
      expect(byName.ID).toBe('integer')
      expect(byName.NAME).toBe('string')
      expect(byName.JOINED_AT).toBe('date')
      expect(byName.AMOUNT).toBe('number')
    })

    it('marks fields nullable when a sample row has null', async () => {
      const adapter = new OracleAdapter(
        fakeFactory({
          rows: [
            { ID: 1, OPTIONAL: 'x' },
            { ID: 2, OPTIONAL: null },
          ],
        }),
      )
      const meta = await adapter.discoverMetadata(baseConfig, validCreds)
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f.nullable]))
      expect(byName.ID).toBe(false)
      expect(byName.OPTIONAL).toBe(true)
    })

    it('returns empty fields list for empty result', async () => {
      const adapter = new OracleAdapter(fakeFactory({ rows: [] }))
      const meta = await adapter.discoverMetadata(baseConfig, validCreds)
      expect(meta.fields).toEqual([])
    })

    it('closes the connection even when stream throws', async () => {
      const closeSpy = jest.fn()
      const adapter = new OracleAdapter(fakeFactory({ closeSpy, streamError: new Error('boom') }))
      await expect(adapter.discoverMetadata(baseConfig, validCreds)).rejects.toThrow(/boom/)
      expect(closeSpy).toHaveBeenCalled()
    })
  })

  describe('stream', () => {
    it('yields one AdapterRecord per row with sourceInfo.offset', async () => {
      const rows = [{ ID: 1 }, { ID: 2 }, { ID: 3 }]
      const adapter = new OracleAdapter(fakeFactory({ rows }))
      const records = await collect(adapter.stream(baseConfig, validCreds))
      expect(records).toHaveLength(3)
      expect(records[0]).toEqual<AdapterRecord>({ payload: { ID: 1 }, sourceInfo: { offset: 0 } })
      expect(records[2]).toEqual<AdapterRecord>({ payload: { ID: 3 }, sourceInfo: { offset: 2 } })
    })

    it('aborts cleanly when options.signal is already aborted', async () => {
      const controller = new AbortController()
      controller.abort()
      const adapter = new OracleAdapter(fakeFactory({ rows: [{ ID: 1 }, { ID: 2 }] }))
      const records = await collect(adapter.stream(baseConfig, validCreds, { signal: controller.signal }))
      expect(records).toHaveLength(0)
    })

    it('closes the connection after streaming completes', async () => {
      const closeSpy = jest.fn()
      const adapter = new OracleAdapter(fakeFactory({ rows: [{ ID: 1 }], closeSpy }))
      await collect(adapter.stream(baseConfig, validCreds))
      expect(closeSpy).toHaveBeenCalled()
    })
  })

  describe('connection config', () => {
    it('builds connectString from host/port/serviceName and passes thickMode + timeout', async () => {
      const captured: OracleConnectConfig[] = []
      const adapter = new OracleAdapter(
        fakeFactory({
          onConnect: (cfg) => captured.push(cfg),
          rows: [],
        }),
      )
      await adapter.discoverMetadata({ ...baseConfig, options: { connectionTimeoutMs: 30000, thickMode: true } }, validCreds)
      expect(captured).toHaveLength(1)
      expect(captured[0]).toMatchObject({
        host: 'oradb.local',
        port: 1521,
        serviceName: 'ORCLPDB1',
        user: 'system',
        password: 'p',
        connectionTimeoutMs: 30000,
        thickMode: true,
      })
    })
  })
})
