import type { Readable } from 'stream'

import { Injectable, Logger } from '@nestjs/common'
import Papa from 'papaparse'

import type { AdapterRecord, SourceAdapter, SourceField, SourceFieldType, SourceSchema, StreamOptions } from '../source-adapter.interface'

/**
 * Runtime config the {@link CsvAdapter} consumes. Distinct from the persisted
 * `job_config.source.config` — the sync executor resolves the GridFS file before
 * invoking the adapter so this adapter has no `domain/` dependency.
 *
 * NOTE on memory: phase 1 loads the full CSV into a string before parsing. With the
 * 100 MiB upload cap (T-C03), peak heap is comparable. For multi-hundred-MB CSVs,
 * revisit with `Papa.parse(stream, { chunk })` row callbacks.
 */
export interface CsvAdapterConfig {
  /** Returns a fresh Readable for the file content. Called once per adapter method. */
  contentStream: () => Readable | Promise<Readable>
  /** 1-based row index of the header. */
  headerRow: number
  /** 1-based row index of the first data row. */
  startRow: number
  /** Field separator. When omitted, papaparse auto-detects per chunk. */
  delimiter?: string
  /** Optional per-field type override applied to the discovered schema only. */
  fieldTypes?: Record<string, SourceFieldType>
}

const SAMPLE_LIMIT = 10

@Injectable()
export class CsvAdapter implements SourceAdapter<CsvAdapterConfig> {
  readonly type = 'csv'
  private readonly logger = new Logger(CsvAdapter.name)

  async discoverMetadata(config: CsvAdapterConfig, _credentials: unknown): Promise<SourceSchema> {
    const rows = await this.parse(config)

    const headerNames = (rows[config.headerRow - 1] ?? []).map((v, i) => coerceHeaderName(v, i))
    if (headerNames.length === 0) {
      throw new Error(`CSV headerRow ${config.headerRow} is empty`)
    }

    const samples: unknown[][] = []
    for (let i = config.startRow - 1; i < rows.length && samples.length < SAMPLE_LIMIT; i++) {
      const row = rows[i]
      if (!row || row.length === 0) continue
      if (row.every((c) => c == null || c === '')) continue
      samples.push(row)
    }

    return buildSchema(headerNames, samples, config.fieldTypes)
  }

  async *stream(config: CsvAdapterConfig, _credentials: unknown, options: StreamOptions = {}): AsyncIterable<AdapterRecord> {
    const rows = await this.parse(config)
    const headerNames = (rows[config.headerRow - 1] ?? []).map((v, i) => coerceHeaderName(v, i))
    if (headerNames.length === 0) {
      throw new Error(`CSV headerRow ${config.headerRow} is empty`)
    }

    let emitted = 0
    for (let i = config.startRow - 1; i < rows.length; i++) {
      if (options.signal?.aborted) return
      const row = rows[i]
      if (!row || row.length === 0) continue
      if (row.every((c) => c == null || c === '')) continue

      const payload: Record<string, unknown> = {}
      for (let j = 0; j < headerNames.length; j++) {
        const raw = row[j]
        payload[headerNames[j]] = raw === undefined || raw === '' ? null : raw
      }
      // CSV rows are 1-indexed when reported to users; align with Excel adapter semantics.
      yield { payload, sourceInfo: { rowNumber: i + 1 } }
      emitted++
    }

    if (emitted === 0) this.logger.warn('CSV file produced no rows')
  }

  private async parse(config: CsvAdapterConfig): Promise<unknown[][]> {
    const stream = await Promise.resolve(config.contentStream())
    const buffer = await streamToBuffer(stream)
    const text = buffer.toString('utf-8')

    const result = Papa.parse<unknown[]>(text, {
      header: false,
      dynamicTyping: true,
      skipEmptyLines: false,
      delimiter: config.delimiter,
    })
    // papaparse reports per-row warnings (delimiter auto-detect fallback, field mismatches,
    // …) via `result.errors`. Most are advisory; the parser still returns usable rows. We
    // surface them via the logger so they show up in run logs without aborting the run.
    if (result.errors.length > 0) {
      this.logger.warn(`CSV parser reported ${result.errors.length} warning(s): ${result.errors.map((e) => `${e.type}: ${e.message}`).join('; ')}`)
    }
    return result.data
  }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array))
  }
  return Buffer.concat(chunks)
}

function coerceHeaderName(value: unknown, index: number): string {
  if (value === null || value === undefined) return `col_${index + 1}`
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') return String(value)
  return `col_${index + 1}`
}

function buildSchema(fieldNames: string[], samples: unknown[][], overrides: Record<string, SourceFieldType> | undefined): SourceSchema {
  const fields: SourceField[] = fieldNames.map((name, idx) => {
    const columnSamples = samples.map((row) => row[idx]).filter((v) => v != null && v !== '')
    const inferred = inferType(columnSamples)
    const type = overrides?.[name] ?? inferred
    const nullable = samples.some((row) => row[idx] == null || row[idx] === '')
    return { name, type, nullable }
  })
  return { fields, raw: { sampleRows: samples.length } }
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
