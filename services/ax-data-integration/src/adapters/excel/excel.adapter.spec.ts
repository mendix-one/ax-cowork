import { Readable } from 'stream'

import ExcelJS from 'exceljs'

import type { AdapterRecord } from '../source-adapter.interface'
import { ExcelAdapter, type ExcelAdapterConfig } from './excel.adapter'

async function buildWorkbook(populate: (wb: ExcelJS.Workbook) => void): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  populate(wb)
  const ab = await wb.xlsx.writeBuffer()
  return Buffer.from(ab)
}

function configFor(buffer: Buffer, overrides: Partial<ExcelAdapterConfig> = {}): ExcelAdapterConfig {
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

describe('ExcelAdapter', () => {
  describe('discoverMetadata', () => {
    it('reads header field names and infers types from the first non-null sample', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('Sales')
        ws.addRow(['id', 'name', 'amount', 'createdAt', 'active'])
        ws.addRow([1, 'Alice', 100.5, new Date('2026-01-01T00:00:00Z'), true])
        ws.addRow([2, 'Bob', 200, new Date('2026-01-02T00:00:00Z'), false])
      })

      const adapter = new ExcelAdapter()
      const meta = await adapter.discoverMetadata(configFor(buf, { sheetName: 'Sales' }), {})

      expect(meta.fields.map((f) => f.name)).toEqual(['id', 'name', 'amount', 'createdAt', 'active'])
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f]))
      expect(byName.id.type).toBe('integer')
      expect(byName.name.type).toBe('string')
      expect(byName.amount.type).toBe('number')
      expect(byName.createdAt.type).toBe('date')
      expect(byName.active.type).toBe('boolean')
    })

    it('marks fields nullable when any sampled row has null', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('S')
        ws.addRow(['id', 'optional'])
        ws.addRow([1, 'x'])
        ws.addRow([2, null])
      })

      const adapter = new ExcelAdapter()
      const meta = await adapter.discoverMetadata(configFor(buf), {})
      const byName = Object.fromEntries(meta.fields.map((f) => [f.name, f]))
      expect(byName.id.nullable).toBe(false)
      expect(byName.optional.nullable).toBe(true)
    })

    it('honors fieldTypes overrides over inferred types', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('S')
        ws.addRow(['code'])
        ws.addRow([42])
      })
      const adapter = new ExcelAdapter()
      const meta = await adapter.discoverMetadata(configFor(buf, { fieldTypes: { code: 'string' } }), {})
      expect(meta.fields[0].type).toBe('string')
    })

    it('throws when the named sheet is missing', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('OnlySheet')
        ws.addRow(['a'])
      })
      const adapter = new ExcelAdapter()
      await expect(adapter.discoverMetadata(configFor(buf, { sheetName: 'Missing' }), {})).rejects.toThrow(/not found/)
    })
  })

  describe('stream', () => {
    it('emits one AdapterRecord per data row with sourceInfo.rowNumber', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('Sales')
        ws.addRow(['id', 'name'])
        ws.addRow([1, 'Alice'])
        ws.addRow([2, 'Bob'])
      })

      const adapter = new ExcelAdapter()
      const records = await collect(adapter.stream(configFor(buf, { sheetName: 'Sales' }), {}))

      expect(records).toHaveLength(2)
      expect(records[0]).toEqual<AdapterRecord>({ payload: { id: 1, name: 'Alice' }, sourceInfo: { rowNumber: 2 } })
      expect(records[1]).toEqual<AdapterRecord>({ payload: { id: 2, name: 'Bob' }, sourceInfo: { rowNumber: 3 } })
    })

    it('respects custom headerRow and startRow (skips leading rows)', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('S')
        ws.addRow(['(title block — to skip)'])
        ws.addRow([])
        ws.addRow(['id', 'name'])
        ws.addRow([10, 'X'])
        ws.addRow([20, 'Y'])
      })

      const adapter = new ExcelAdapter()
      const records = await collect(adapter.stream(configFor(buf, { headerRow: 3, startRow: 4 }), {}))
      expect(records.map((r) => r.payload)).toEqual([
        { id: 10, name: 'X' },
        { id: 20, name: 'Y' },
      ])
    })

    it('skips fully-blank data rows', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('S')
        ws.addRow(['id', 'name'])
        ws.addRow([1, 'Alice'])
        ws.addRow([null, null])
        ws.addRow([3, 'Carol'])
      })
      const adapter = new ExcelAdapter()
      const records = await collect(adapter.stream(configFor(buf), {}))
      expect(records.map((r) => r.payload.id)).toEqual([1, 3])
    })

    it('preserves field names with spaces and special characters', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('S')
        ws.addRow(['Order #', 'Customer Name', 'Total ($)'])
        ws.addRow([1, 'Alice', 100])
      })
      const adapter = new ExcelAdapter()
      const records = await collect(adapter.stream(configFor(buf), {}))
      expect(records[0].payload).toEqual({ 'Order #': 1, 'Customer Name': 'Alice', 'Total ($)': 100 })
    })

    it('aborts cleanly when options.signal is aborted', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('S')
        ws.addRow(['id'])
        for (let i = 1; i <= 50; i++) ws.addRow([i])
      })
      const controller = new AbortController()
      controller.abort()
      const adapter = new ExcelAdapter()
      const records = await collect(adapter.stream(configFor(buf), {}, { signal: controller.signal }))
      expect(records.length).toBe(0)
    })
  })

  describe('round-trip with discoverMetadata + stream', () => {
    it('processes a 1000-row sheet end-to-end', async () => {
      const buf = await buildWorkbook((wb) => {
        const ws = wb.addWorksheet('Bulk')
        ws.addRow(['id', 'value'])
        for (let i = 1; i <= 1000; i++) ws.addRow([i, `v${i}`])
      })
      const adapter = new ExcelAdapter()
      const meta = await adapter.discoverMetadata(configFor(buf, { sheetName: 'Bulk' }), {})
      expect(meta.fields.map((f) => f.name)).toEqual(['id', 'value'])

      const records = await collect(adapter.stream(configFor(buf, { sheetName: 'Bulk' }), {}))
      expect(records).toHaveLength(1000)
      expect(records[0].payload).toEqual({ id: 1, value: 'v1' })
      expect(records[999].payload).toEqual({ id: 1000, value: 'v1000' })
    })
  })
})
