/**
 * Contract every source-type adapter must implement. Adapters are stateless and pure
 * w.r.t. their inputs (config + credentials are supplied per call by the sync executor),
 * so a single instance handles every job that uses its type.
 *
 * Phase 1 mirrors P002 §7.1.
 */
export interface SourceAdapter<TConfig = unknown, TWatermark = unknown> {
  /** Lower-case discriminator (e.g. `'excel'`, `'rest'`). Used as the registry key. */
  readonly type: string

  /**
   * Read the source schema. Throws on connect failure so the executor can mark the
   * run failed at the `discover` stage.
   */
  discoverMetadata(config: TConfig, credentials: unknown): Promise<SourceSchema>

  /**
   * Stream records one-by-one. Must be an async iterable (not a returned Array) so
   * the executor can process arbitrarily large sources without buffering everything.
   *
   * Adapters MUST honor `options.signal` — abort cleanly when it is aborted.
   */
  stream(config: TConfig, credentials: unknown, options: StreamOptions<TWatermark>): AsyncIterable<AdapterRecord>
}

export interface StreamOptions<TWatermark = unknown> {
  watermark?: TWatermark
  signal?: AbortSignal
}

/** One record emitted by an adapter. The executor computes `recordKey` + `payloadHash` downstream. */
export interface AdapterRecord {
  payload: Record<string, unknown>
  /** Adapter-specific positional context, e.g. file row number or API cursor offset. */
  sourceInfo?: AdapterSourceInfo
}

export interface AdapterSourceInfo {
  rowNumber?: number
  offset?: number
  [extra: string]: unknown
}

/** Schema discovered from the source. `fields` is the canonical view; `raw` keeps the adapter-native shape for debugging. */
export interface SourceSchema {
  fields: SourceField[]
  raw: Record<string, unknown>
}

export type SourceFieldType = 'string' | 'number' | 'integer' | 'boolean' | 'date' | 'object' | 'array' | 'unknown'

export interface SourceField {
  name: string
  type: SourceFieldType
  nullable?: boolean
  primaryKey?: boolean
}
