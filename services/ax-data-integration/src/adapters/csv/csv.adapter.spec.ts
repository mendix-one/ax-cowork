import { Readable } from 'stream'

import type { AdapterRecord } from '../source-adapter.interface'
import { CsvAdapter, type CsvAdapterConfig } from './csv.adapter'

function csvBuffer(text: string): Buffer {
  return Buffer.from(text, 'utf-8')
}

function configFor(buffer: Buffer, overrides: Partial<CsvAdapterConfig> = {}): CsvAdapterConfig {
  return {
    contentStream: () => Readable.from(buffer),
    headerRow: 1,
    startRow: 2,
    ...overrides,
  }
}

async function collect<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const out: T[] = []
  for await (const item of iter) out.push(item)
  return out
}

describe('CsvAdapter', () => {
  describe('discoverMetadata', () => {
    it('reads header field names and infers types from the first non-null sample', async () => {
      const buf = csvBuffer('id,name,amount,active\n1,Alice,100.5,true\n2,Bob,200,false\n')
      const adapter = new CsvAdapter()
      const meta = await adapter.discoverMetadata(configFor(buf), {})

      expect(meta.fields.map((f) => f.name)).toEqual(['id', 'name', 'amount', 'active'])
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f]))
      expect(byName.id.type).toBe('integer')
      expect(byName.name.type).toBe('string')
      expect(byName.amount.type).toBe('number')
      expect(byName.active.type).toBe('boolean')
    })

    it('honors fieldTypes overrides', async () => {
      const buf = csvBuffer('code\n42\n')
      const adapter = new CsvAdapter()
      const meta = await adapter.discoverMetadata(configFor(buf, { fieldTypes: { code: 'string' } }), {})
      expect(meta.fields[0].type).toBe('string')
    })

    it('marks fields nullable when any sampled row has empty value', async () => {
      const buf = csvBuffer('id,optional\n1,x\n2,\n')
      const adapter = new CsvAdapter()
      const meta = await adapter.discoverMetadata(configFor(buf), {})
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f]))
      expect(byName.id.nullable).toBe(false)
      expect(byName.optional.nullable).toBe(true)
    })
  })

  describe('stream', () => {
    it('emits one AdapterRecord per data row with sourceInfo.rowNumber', async () => {
      const buf = csvBuffer('id,name\n1,Alice\n2,Bob\n')
      const adapter = new CsvAdapter()
      const records = await collect(adapter.stream(configFor(buf), {}))

      expect(records).toHaveLength(2)
      expect(records[0]).toEqual<AdapterRecord>({ payload: { id: 1, name: 'Alice' }, sourceInfo: { rowNumber: 2 } })
      expect(records[1]).toEqual<AdapterRecord>({ payload: { id: 2, name: 'Bob' }, sourceInfo: { rowNumber: 3 } })
    })

    it('respects custom headerRow / startRow', async () => {
      const buf = csvBuffer('(title)\n\nid,name\n10,X\n20,Y\n')
      const adapter = new CsvAdapter()
      const records = await collect(adapter.stream(configFor(buf, { headerRow: 3, startRow: 4 }), {}))
      expect(records.map((r) => r.payload)).toEqual([
        { id: 10, name: 'X' },
        { id: 20, name: 'Y' },
      ])
    })

    it('skips fully-blank rows', async () => {
      const buf = csvBuffer('id,name\n1,Alice\n,\n3,Carol\n')
      const adapter = new CsvAdapter()
      const records = await collect(adapter.stream(configFor(buf), {}))
      expect(records.map((r) => r.payload.id)).toEqual([1, 3])
    })

    it('coerces empty string to null in payload', async () => {
      const buf = csvBuffer('id,note\n1,\n')
      const adapter = new CsvAdapter()
      const records = await collect(adapter.stream(configFor(buf), {}))
      expect(records[0].payload).toEqual({ id: 1, note: null })
    })

    it('preserves header field names with spaces and special chars', async () => {
      const buf = csvBuffer('"Order #","Customer Name","Total ($)"\n1,Alice,100\n')
      const adapter = new CsvAdapter()
      const records = await collect(adapter.stream(configFor(buf), {}))
      expect(records[0].payload).toEqual({ 'Order #': 1, 'Customer Name': 'Alice', 'Total ($)': 100 })
    })

    it('honors a custom delimiter (semicolon)', async () => {
      const buf = csvBuffer('id;name\n1;Alice\n2;Bob\n')
      const adapter = new CsvAdapter()
      const records = await collect(adapter.stream(configFor(buf, { delimiter: ';' }), {}))
      expect(records.map((r) => r.payload)).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ])
    })

    it('aborts cleanly when options.signal is aborted', async () => {
      let csv = 'id\n'
      for (let i = 1; i <= 50; i++) csv += `${i}\n`
      const controller = new AbortController()
      controller.abort()
      const adapter = new CsvAdapter()
      const records = await collect(adapter.stream(configFor(csvBuffer(csv)), {}, { signal: controller.signal }))
      expect(records).toHaveLength(0)
    })
  })

  describe('round-trip', () => {
    it('processes a 1000-row CSV end-to-end', async () => {
      let csv = 'id,value\n'
      for (let i = 1; i <= 1000; i++) csv += `${i},v${i}\n`
      const adapter = new CsvAdapter()
      const meta = await adapter.discoverMetadata(configFor(csvBuffer(csv)), {})
      expect(meta.fields.map((f) => f.name)).toEqual(['id', 'value'])

      const records = await collect(adapter.stream(configFor(csvBuffer(csv)), {}))
      expect(records).toHaveLength(1000)
      expect(records[0].payload).toEqual({ id: 1, value: 'v1' })
      expect(records[999].payload).toEqual({ id: 1000, value: 'v1000' })
    })
  })
})
