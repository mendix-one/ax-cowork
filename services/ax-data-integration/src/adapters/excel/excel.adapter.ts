import { Readable } from 'stream'

import { Injectable, Logger } from '@nestjs/common'
import ExcelJS from 'exceljs'

import type { AdapterRecord, SourceAdapter, SourceField, SourceFieldType, SourceSchema, StreamOptions } from '../source-adapter.interface'

/**
 * Runtime config the {@link ExcelAdapter} consumes. Distinct from the persisted
 * `job_config.source.config` (which holds `sourceFileId`) — the sync executor resolves
 * the file from GridFS and supplies a `contentStream` factory before invoking the
 * adapter. This keeps the adapter free of any `domain/` dependency (CLAUDE.md import rules).
 *
 * NOTE on memory: phase 1 loads the full file into a Buffer before parsing because
 * exceljs's streaming `WorkbookReader` is racy against in-memory Readables. With the
 * 100 MiB upload cap (T-C03 controller), worst-case heap is ~300–500 MB during parse.
 * For larger files, revisit the streaming reader or chunk via a different parser.
 */
export interface ExcelAdapterConfig {
  /** Returns a fresh Readable for the file content. Called once per adapter method. */
  contentStream: () => Readable | Promise<Readable>
  /** Worksheet name. Defaults to the first worksheet. */
  sheetName?: string
  /** 1-based row index of the header. */
  headerRow: number
  /** 1-based row index of the first data row. */
  startRow: number
  /** Optional per-field type override applied to the discovered schema only (no value coercion). */
  fieldTypes?: Record<string, SourceFieldType>
}

const SAMPLE_LIMIT = 10

@Injectable()
export class ExcelAdapter implements SourceAdapter<ExcelAdapterConfig> {
  readonly type = 'excel'
  private readonly logger = new Logger(ExcelAdapter.name)

  async discoverMetadata(config: ExcelAdapterConfig, _credentials: unknown): Promise<SourceSchema> {
    const worksheet = await this.loadWorksheet(config)

    const headerRow = worksheet.getRow(config.headerRow)
    const headerNames = readRow(headerRow).map((v, i) => coerceHeaderName(v, i))
    if (headerNames.length === 0) {
      throw new Error(`Excel headerRow ${config.headerRow} is empty in sheet "${worksheet.name}"`)
    }

    const samples: unknown[][] = []
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      if (samples.length >= SAMPLE_LIMIT) return
      if (row.number < config.startRow) return
      samples.push(readRow(row))
    })

    return buildSchema(headerNames, samples, worksheet.name, config.fieldTypes)
  }

  async *stream(config: ExcelAdapterConfig, _credentials: unknown, options: StreamOptions = {}): AsyncIterable<AdapterRecord> {
    const worksheet = await this.loadWorksheet(config)

    const headerRow = worksheet.getRow(config.headerRow)
    const headerNames = readRow(headerRow).map((v, i) => coerceHeaderName(v, i))
    if (headerNames.length === 0) {
      throw new Error(`Excel headerRow ${config.headerRow} is empty in sheet "${worksheet.name}"`)
    }

    const lastRow = worksheet.rowCount
    let emitted = 0
    for (let r = config.startRow; r <= lastRow; r++) {
      if (options.signal?.aborted) return
      const row = worksheet.getRow(r)
      const values = readRow(row)
      if (values.length === 0 || values.every((v) => v == null)) continue
      const payload: Record<string, unknown> = {}
      for (let i = 0; i < headerNames.length; i++) {
        payload[headerNames[i]] = values[i] ?? null
      }
      yield { payload, sourceInfo: { rowNumber: row.number } }
      emitted++
    }

    if (emitted === 0) this.logger.warn(`Excel sheet "${worksheet.name}" produced no rows`)
  }

  private async loadWorksheet(config: ExcelAdapterConfig): Promise<ExcelJS.Worksheet> {
    const stream = await Promise.resolve(config.contentStream())
    const buffer = await streamToBuffer(stream)
    const workbook = new ExcelJS.Workbook()
    // @types/node 24 narrows Buffer to Buffer<ArrayBufferLike> with toStringTag 'Uint8Array',
    // but exceljs's bundled types still expect the legacy Buffer with toStringTag 'ArrayBuffer'.
    // Until exceljs updates its declarations, route through the lib's runtime API directly.
    type LoadFn = (data: unknown) => Promise<ExcelJS.Workbook>
    await (workbook.xlsx.load.bind(workbook.xlsx) as LoadFn)(buffer)

    const worksheet = config.sheetName ? workbook.getWorksheet(config.sheetName) : workbook.worksheets[0]
    if (!worksheet) {
      throw new Error(`Excel sheet "${config.sheetName ?? '(first)'}" not found`)
    }
    return worksheet
  }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array))
  }
  return Buffer.concat(chunks)
}

/** Returns the cell values for a row as a 0-indexed array. exceljs row.values is 1-indexed with a leading null. */
function readRow(row: ExcelJS.Row): unknown[] {
  const raw = row.values as unknown[] | undefined
  if (!raw) return []
  return raw.slice(1).map(unwrapFormula)
}

/** exceljs returns formula cells as `{ formula, result }`. Use `result` so downstream code sees the computed value. */
function unwrapFormula(value: unknown): unknown {
  if (value && typeof value === 'object' && 'result' in (value as Record<string, unknown>)) {
    return (value as { result: unknown }).result
  }
  return value
}

/** Safely stringify a header cell, falling back to `col_N` for null / object cells. */
function coerceHeaderName(value: unknown, index: number): string {
  if (value === null || value === undefined) return `col_${index + 1}`
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value)
  return `col_${index + 1}`
}

function buildSchema(fieldNames: string[], samples: unknown[][], sheetName: string, overrides: Record<string, SourceFieldType> | undefined): SourceSchema {
  const fields: SourceField[] = fieldNames.map((name, idx) => {
    const columnSamples = samples.map((row) => row[idx]).filter((v) => v != null)
    const inferred = inferType(columnSamples)
    const type = overrides?.[name] ?? inferred
    const nullable = samples.some((row) => row[idx] == null)
    return { name, type, nullable }
  })
  return { fields, raw: { sheetName, sampleRows: samples.length } }
}

function inferType(samples: unknown[]): SourceFieldType {
  if (samples.length === 0) return 'unknown'
  const first = samples[0]
  if (typeof first === 'number') return Number.isInteger(first) ? 'integer' : 'number'
  if (typeof first === 'boolean') return 'boolean'
  if (first instanceof Date) return 'date'
  if (typeof first === 'string') return 'string'
  if (Array.isArray(first)) return 'array'
  if (typeof first === 'object') return 'object'
  return 'unknown'
}
