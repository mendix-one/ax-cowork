import { createHash } from 'crypto'
import { hostname } from 'os'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { MongoServerError, ObjectId } from 'mongodb'

import { GridfsService } from '../acore/mongo'
import { SourceAdapterRegistry, type AdapterRecord, type SourceSchema } from '../adapters'
import type { CsvAdapterConfig } from '../adapters/csv/csv.adapter'
import type { ExcelAdapterConfig } from '../adapters/excel/excel.adapter'
import type { MssqlAdapterConfig } from '../adapters/mssql/mssql.adapter'
import type { MysqlAdapterConfig } from '../adapters/mysql/mysql.adapter'
import type { OracleAdapterConfig } from '../adapters/oracle/oracle.adapter'
import type { PostgresAdapterConfig } from '../adapters/postgres/postgres.adapter'
import type { RestApiAdapterConfig, RestPaginationConfig } from '../adapters/rest-api/rest-api.adapter'
import { JobConfigRepository, type JobConfigDoc, type RunStatus } from '../domain/job-config'
import { RawRecordChangelogRepository, type RawRecordChangelogInsert } from '../domain/raw-record-changelog'
import { RawRecordRepository, type RawRecordDoc } from '../domain/raw-record'
import { SecretsService } from '../domain/secret'
import { SourceFileRepository } from '../domain/source-file'
import { SourceMetadataRepository } from '../domain/source-metadata'
import { SyncRunRepository, ZERO_COUNTS, type SyncRunCounts, type SyncRunDoc, type SyncRunErrorEntry, type TriggerSource } from '../domain/sync-run'
import { ConcurrencyService } from './concurrency.service'
import { computeRecordKey, stableStringify } from './compute-record-key'

export const HEARTBEAT_INTERVAL_MS = 'HEARTBEAT_INTERVAL_MS'
export const DEFAULT_ERROR_THRESHOLD = 'DEFAULT_ERROR_THRESHOLD'
export const CHANGELOG_BUFFER_SIZE = 'CHANGELOG_BUFFER_SIZE'

const DUPLICATE_KEY = 11000
const COUNTS_FLUSH_INTERVAL = 1000

/** Outcome of a single `SyncExecutor.execute` call. */
export type ExecuteResult =
  | { kind: 'acquired'; runId: ObjectId; status: RunStatus }
  | { kind: 'skipped-inmem'; reason: string }
  | { kind: 'skipped-db'; reason: string }

/** Return shape of the work hook. `aborted: true` signals an internal abort (e.g. error threshold) that must finalize as `failed`. */
export interface SyncRunWorkResult {
  counts: SyncRunCounts
  errors?: SyncRunErrorEntry[]
  aborted?: boolean
}

/**
 * Orchestrates one sync run end-to-end (P002 §8 + §9).
 *
 * Flow:
 * 1. Fast-path + DB-level lock claim (`ConcurrencyService` + `sync_runs` partial unique index).
 * 2. Heartbeat `setInterval` to keep the run visible to the stale sweeper (P002 §8.3).
 * 3. `executeRun()` — discover schema, stream records, classify insert/update/unchanged, write `raw_records`.
 * 4. Finalize as `success` / `partial` / `failed` and release locks.
 *
 * Delete detection (T-E05) and changelog audit (T-E06) extend this in follow-up tasks.
 */
@Injectable()
export class SyncExecutorService {
  private readonly logger = new Logger(SyncExecutorService.name)
  private readonly workerId = `${hostname()}:${process.pid}`

  constructor(
    private readonly concurrency: ConcurrencyService,
    private readonly runs: SyncRunRepository,
    private readonly jobConfigs: JobConfigRepository,
    private readonly rawRecords: RawRecordRepository,
    private readonly sourceMetadata: SourceMetadataRepository,
    private readonly sourceFiles: SourceFileRepository,
    private readonly gridfs: GridfsService,
    private readonly secrets: SecretsService,
    private readonly adapters: SourceAdapterRegistry,
    private readonly changelogs: RawRecordChangelogRepository,
    @Inject(HEARTBEAT_INTERVAL_MS) private readonly heartbeatIntervalMs: number,
    @Inject(DEFAULT_ERROR_THRESHOLD) private readonly defaultErrorThreshold: number,
    @Inject(CHANGELOG_BUFFER_SIZE) private readonly changelogBufferSize: number,
  ) {
    if (!Number.isFinite(heartbeatIntervalMs) || heartbeatIntervalMs < 1) {
      throw new Error(`HEARTBEAT_INTERVAL_MS must be a positive number (got ${heartbeatIntervalMs})`)
    }
    if (!Number.isInteger(defaultErrorThreshold) || defaultErrorThreshold < 1) {
      throw new Error(`DEFAULT_ERROR_THRESHOLD must be a positive integer (got ${defaultErrorThreshold})`)
    }
    if (!Number.isInteger(changelogBufferSize) || changelogBufferSize < 1) {
      throw new Error(`CHANGELOG_BUFFER_SIZE must be a positive integer (got ${changelogBufferSize})`)
    }
  }

  async execute(jobConfigId: ObjectId, triggeredBy: TriggerSource, options: { parentRunId?: ObjectId } = {}): Promise<ExecuteResult> {
    const idHex = jobConfigId.toHexString()
    const handle = await this.concurrency.acquire(idHex)
    if (handle.kind === 'skipped-inmem') {
      return { kind: 'skipped-inmem', reason: handle.reason }
    }

    let runId: ObjectId | undefined
    let heartbeat: ReturnType<typeof setInterval> | undefined
    try {
      let run: SyncRunDoc
      try {
        run = await this.runs.insertRunning({
          jobConfigId,
          triggeredBy,
          workerId: this.workerId,
          ...(options.parentRunId ? { parentRunId: options.parentRunId } : {}),
        })
      } catch (err) {
        if (isDuplicateKey(err)) {
          return { kind: 'skipped-db', reason: 'another run is already in status=running for this job config' }
        }
        throw err
      }
      runId = run._id

      heartbeat = this.startHeartbeat(runId)

      let work: SyncRunWorkResult
      let status: RunStatus
      try {
        work = await this.executeRun(run, jobConfigId)
        status = work.aborted ? 'failed' : work.errors && work.errors.length > 0 ? 'partial' : 'success'
      } catch (err) {
        // Setup-time errors (missing job_config, missing source_file, unregistered adapter, …)
        // are recorded on the run and reported as `acquired + failed` rather than thrown,
        // so the caller can keep iterating other jobs without try/catch.
        const message = err instanceof Error ? err.message : String(err)
        const stack = err instanceof Error ? err.stack : undefined
        work = {
          counts: { ...ZERO_COUNTS },
          errors: [{ stage: 'other', message, stack, occurredAt: new Date() }],
          aborted: true,
        }
        status = 'failed'
      }

      await this.runs.finalize(runId, {
        status,
        counts: work.counts,
        finishedAt: new Date(),
        ...(work.errors && work.errors.length > 0 ? { errors: work.errors } : {}),
      })
      return { kind: 'acquired', runId, status }
    } finally {
      if (heartbeat) clearInterval(heartbeat)
      handle.release()
    }
  }

  /**
   * Discovers schema, streams records, and classifies each as insert / update / unchanged
   * against `raw_records`. Per-record errors are captured and trip an abort once they
   * exceed the configured threshold (P002 §9 step 2, §12.1).
   *
   * Marked `protected` so tests can substitute a slow implementation to exercise the
   * heartbeat path (see T-E03).
   */
  protected async executeRun(run: SyncRunDoc, jobConfigId: ObjectId): Promise<SyncRunWorkResult> {
    const runId = run._id
    const jobConfig = await this.jobConfigs.findById(jobConfigId)
    if (!jobConfig) throw new Error(`Job config ${jobConfigId.toHexString()} not found`)

    const adapter = this.adapters.get(jobConfig.source.type)
    const adapterConfig = await this.buildAdapterConfig(jobConfig)
    const credentials = await this.resolveCredentials(jobConfig.credentialsRef)

    const schema: SourceSchema = await adapter.discoverMetadata(adapterConfig, credentials)
    const schemaHash = createHash('sha256').update(stableStringify(schema)).digest('hex')
    await this.sourceMetadata.insertIfNew({
      jobConfigId,
      syncRunId: runId,
      schemaHash,
      schema,
      detectedAt: new Date(),
      createdAt: new Date(),
    })

    const counts: SyncRunCounts = { ...ZERO_COUNTS }
    const errors: SyncRunErrorEntry[] = []
    const changelogBuffer: RawRecordChangelogInsert[] = []
    const auditChanges = jobConfig.options.auditChanges
    const errorThreshold = jobConfig.options.errorThreshold ?? this.defaultErrorThreshold
    const sourceFileIdForKey = jobConfig.identity.strategy === 'row-number' ? this.extractSourceFileId(jobConfig) : undefined

    for await (const record of adapter.stream(adapterConfig, credentials, {})) {
      counts.read++
      try {
        await this.classifyAndWrite(record, jobConfig, runId, sourceFileIdForKey, counts, changelogBuffer, auditChanges)
      } catch (err) {
        counts.errors++
        const message = err instanceof Error ? err.message : String(err)
        const stack = err instanceof Error ? err.stack : undefined
        errors.push({ stage: 'write', message, stack, occurredAt: new Date() })
        if (counts.errors >= errorThreshold) {
          this.logger.warn(`Error threshold reached (${counts.errors}/${errorThreshold}) — aborting run ${runId.toHexString()}`)
          await this.flushChangelog(changelogBuffer, errors)
          return { counts, errors, aborted: true }
        }
      }

      if (changelogBuffer.length >= this.changelogBufferSize) {
        await this.flushChangelog(changelogBuffer, errors)
      }
      if (counts.read % COUNTS_FLUSH_INTERVAL === 0) {
        await this.runs.updateCounts(runId, counts).catch((err: unknown) => {
          this.logger.warn(`Periodic counts flush failed for run ${runId.toHexString()}: ${String(err)}`)
        })
      }
    }

    // End-of-main-loop mandatory flush (P002 §9.3).
    await this.flushChangelog(changelogBuffer, errors)

    // Delete detection (P002 §9 step 3). With auditChanges=true we iterate so each delete
    // gets a changelog entry; without audit we use the single-shot `updateMany`.
    if (jobConfig.options.detectDeleted) {
      if (auditChanges) {
        await this.detectDeletionsWithAudit(jobConfig._id, run, changelogBuffer, counts, errors)
      } else {
        counts.deleted = await this.rawRecords.markStaleAsDeleted(jobConfig._id, runId, run.startedAt)
      }
      // Final flush in case audit-aware delete left entries in the buffer.
      await this.flushChangelog(changelogBuffer, errors)
    }

    return { counts, errors }
  }

  private async detectDeletionsWithAudit(
    jobConfigId: ObjectId,
    run: SyncRunDoc,
    changelogBuffer: RawRecordChangelogInsert[],
    counts: SyncRunCounts,
    errors: SyncRunErrorEntry[],
  ): Promise<void> {
    const now = () => new Date()
    for await (const doc of this.rawRecords.findStaleActive(jobConfigId, run.startedAt)) {
      await this.rawRecords.markOneAsDeleted(doc._id, run._id)
      changelogBuffer.push({
        jobConfigId,
        rawRecordId: doc._id,
        recordKey: doc.recordKey,
        syncRunId: run._id,
        operation: 'delete',
        versionBefore: doc.version,
        versionAfter: doc.version,
        payloadBefore: doc.payload,
        payloadAfter: doc.payload,
        payloadHashBefore: doc.payloadHash,
        payloadHashAfter: doc.payloadHash,
        occurredAt: now(),
        createdAt: now(),
      })
      counts.deleted++
      if (changelogBuffer.length >= this.changelogBufferSize) {
        await this.flushChangelog(changelogBuffer, errors)
      }
    }
  }

  /**
   * Drains `changelogBuffer` into `raw_record_changelog`. Retries the batch once on failure
   * before recording an `audit`-stage entry in `sync_runs.errors`. Audit problems never
   * crash the surrounding run — the source-of-truth is `raw_records`, the audit trail is
   * best-effort.
   */
  private async flushChangelog(buffer: RawRecordChangelogInsert[], errors: SyncRunErrorEntry[]): Promise<void> {
    if (buffer.length === 0) return
    const batch = buffer.splice(0, buffer.length)
    try {
      await this.changelogs.insertMany(batch)
      return
    } catch (firstErr) {
      this.logger.warn(`changelog insertMany failed, retrying once: ${String(firstErr)}`)
    }
    try {
      await this.changelogs.insertMany(batch)
    } catch (retryErr) {
      const message = `changelog flush failed after retry (${batch.length} entries lost): ${retryErr instanceof Error ? retryErr.message : String(retryErr)}`
      const stack = retryErr instanceof Error ? retryErr.stack : undefined
      errors.push({ stage: 'audit', message, stack, occurredAt: new Date() })
      this.logger.error(message)
    }
  }

  private async classifyAndWrite(
    record: AdapterRecord,
    jobConfig: JobConfigDoc,
    runId: ObjectId,
    sourceFileIdForKey: string | undefined,
    counts: SyncRunCounts,
    changelogBuffer: RawRecordChangelogInsert[],
    auditChanges: boolean,
  ): Promise<void> {
    const recordKey = computeRecordKey({ identity: jobConfig.identity, record, sourceFileId: sourceFileIdForKey })
    const payloadHash = createHash('sha256').update(stableStringify(record.payload)).digest('hex')

    const existing = await this.rawRecords.findByKey(jobConfig._id, recordKey)
    const now = new Date()

    if (!existing) {
      let inserted: RawRecordDoc
      try {
        inserted = await this.rawRecords.insertNew({
          jobConfigId: jobConfig._id,
          recordKey,
          payloadHash,
          payload: record.payload,
          status: 'active',
          version: 1,
          firstSeenAt: now,
          lastSeenAt: now,
          firstSeenRunId: runId,
          lastUpdatedRunId: runId,
          createdAt: now,
        })
      } catch (err) {
        if (isDuplicateKey(err)) {
          // Adapter emitted the same recordKey twice within this run (P002 §9.4).
          throw new Error(`Duplicate recordKey within run: "${recordKey}"`)
        }
        throw err
      }
      counts.inserted++
      if (auditChanges) {
        changelogBuffer.push({
          jobConfigId: jobConfig._id,
          rawRecordId: inserted._id,
          recordKey,
          syncRunId: runId,
          operation: 'insert',
          versionBefore: null,
          versionAfter: 1,
          payloadBefore: null,
          payloadAfter: record.payload,
          payloadHashBefore: null,
          payloadHashAfter: payloadHash,
          occurredAt: now,
          createdAt: now,
        })
      }
    } else if (existing.payloadHash !== payloadHash) {
      await this.rawRecords.updateChanged(existing._id, {
        payload: record.payload,
        payloadHash,
        lastSeenAt: now,
        lastUpdatedRunId: runId,
      })
      counts.updated++
      if (auditChanges) {
        changelogBuffer.push({
          jobConfigId: jobConfig._id,
          rawRecordId: existing._id,
          recordKey,
          syncRunId: runId,
          operation: 'update',
          versionBefore: existing.version,
          versionAfter: existing.version + 1,
          payloadBefore: existing.payload,
          payloadAfter: record.payload,
          payloadHashBefore: existing.payloadHash,
          payloadHashAfter: payloadHash,
          occurredAt: now,
          createdAt: now,
        })
      }
    } else {
      await this.rawRecords.touchLastSeen(existing._id, now)
      counts.unchanged++
      // No changelog entry for unchanged — only lastSeenAt is touched (P002 §5.7).
    }
  }

  private async buildAdapterConfig(jobConfig: JobConfigDoc): Promise<unknown> {
    switch (jobConfig.source.type) {
      case 'excel':
        return this.buildExcelAdapterConfig(jobConfig)
      case 'csv':
        return this.buildCsvAdapterConfig(jobConfig)
      case 'rest':
        return this.buildRestApiAdapterConfig(jobConfig)
      case 'postgres':
        return this.buildPostgresAdapterConfig(jobConfig)
      case 'mysql':
        return this.buildMysqlAdapterConfig(jobConfig)
      case 'mssql':
        return this.buildMssqlAdapterConfig(jobConfig)
      case 'oracle':
        return this.buildOracleAdapterConfig(jobConfig)
      default:
        throw new Error(`Adapter for source.type='${jobConfig.source.type}' is not yet implemented in phase 1`)
    }
  }

  private buildOracleAdapterConfig(jobConfig: JobConfigDoc): OracleAdapterConfig {
    const cfg = jobConfig.source.config
    if (typeof cfg.host !== 'string' || cfg.host.length === 0) {
      throw new Error('source.config.host is required for oracle adapter')
    }
    if (typeof cfg.port !== 'number' || !Number.isFinite(cfg.port)) {
      throw new Error('source.config.port is required for oracle adapter')
    }
    if (typeof cfg.serviceName !== 'string' || cfg.serviceName.length === 0) {
      throw new Error('source.config.serviceName is required for oracle adapter')
    }
    if (typeof cfg.query !== 'string' || cfg.query.length === 0) {
      throw new Error('source.config.query is required for oracle adapter')
    }
    const opts = (cfg.options ?? {}) as Record<string, unknown>
    return {
      host: cfg.host,
      port: cfg.port,
      serviceName: cfg.serviceName,
      query: cfg.query,
      options: {
        connectionTimeoutMs: typeof opts.connectionTimeoutMs === 'number' ? opts.connectionTimeoutMs : undefined,
        thickMode: typeof opts.thickMode === 'boolean' ? opts.thickMode : undefined,
      },
    }
  }

  private buildMssqlAdapterConfig(jobConfig: JobConfigDoc): MssqlAdapterConfig {
    const cfg = jobConfig.source.config
    if (typeof cfg.host !== 'string' || cfg.host.length === 0) {
      throw new Error('source.config.host is required for mssql adapter')
    }
    if (typeof cfg.port !== 'number' || !Number.isFinite(cfg.port)) {
      throw new Error('source.config.port is required for mssql adapter')
    }
    if (typeof cfg.database !== 'string' || cfg.database.length === 0) {
      throw new Error('source.config.database is required for mssql adapter')
    }
    if (typeof cfg.query !== 'string' || cfg.query.length === 0) {
      throw new Error('source.config.query is required for mssql adapter')
    }
    const opts = (cfg.options ?? {}) as Record<string, unknown>
    return {
      host: cfg.host,
      port: cfg.port,
      database: cfg.database,
      schema: typeof cfg.schema === 'string' ? cfg.schema : undefined,
      query: cfg.query,
      options: {
        connectionTimeoutMs: typeof opts.connectionTimeoutMs === 'number' ? opts.connectionTimeoutMs : undefined,
        queryTimeoutMs: typeof opts.queryTimeoutMs === 'number' ? opts.queryTimeoutMs : undefined,
        ssl: typeof opts.ssl === 'boolean' ? opts.ssl : undefined,
        trustServerCertificate: typeof opts.trustServerCertificate === 'boolean' ? opts.trustServerCertificate : undefined,
      },
    }
  }

  private buildMysqlAdapterConfig(jobConfig: JobConfigDoc): MysqlAdapterConfig {
    const cfg = jobConfig.source.config
    if (typeof cfg.host !== 'string' || cfg.host.length === 0) {
      throw new Error('source.config.host is required for mysql adapter')
    }
    if (typeof cfg.port !== 'number' || !Number.isFinite(cfg.port)) {
      throw new Error('source.config.port is required for mysql adapter')
    }
    if (typeof cfg.database !== 'string' || cfg.database.length === 0) {
      throw new Error('source.config.database is required for mysql adapter')
    }
    if (typeof cfg.query !== 'string' || cfg.query.length === 0) {
      throw new Error('source.config.query is required for mysql adapter')
    }
    const opts = (cfg.options ?? {}) as Record<string, unknown>
    return {
      host: cfg.host,
      port: cfg.port,
      database: cfg.database,
      query: cfg.query,
      options: {
        connectionTimeoutMs: typeof opts.connectionTimeoutMs === 'number' ? opts.connectionTimeoutMs : undefined,
        queryTimeoutMs: typeof opts.queryTimeoutMs === 'number' ? opts.queryTimeoutMs : undefined,
        ssl: typeof opts.ssl === 'boolean' ? opts.ssl : undefined,
      },
    }
  }

  private buildPostgresAdapterConfig(jobConfig: JobConfigDoc): PostgresAdapterConfig {
    const cfg = jobConfig.source.config
    if (typeof cfg.host !== 'string' || cfg.host.length === 0) {
      throw new Error('source.config.host is required for postgres adapter')
    }
    if (typeof cfg.port !== 'number' || !Number.isFinite(cfg.port)) {
      throw new Error('source.config.port is required for postgres adapter')
    }
    if (typeof cfg.database !== 'string' || cfg.database.length === 0) {
      throw new Error('source.config.database is required for postgres adapter')
    }
    if (typeof cfg.query !== 'string' || cfg.query.length === 0) {
      throw new Error('source.config.query is required for postgres adapter')
    }
    const opts = (cfg.options ?? {}) as Record<string, unknown>
    return {
      host: cfg.host,
      port: cfg.port,
      database: cfg.database,
      schema: typeof cfg.schema === 'string' ? cfg.schema : undefined,
      query: cfg.query,
      options: {
        connectionTimeoutMs: typeof opts.connectionTimeoutMs === 'number' ? opts.connectionTimeoutMs : undefined,
        queryTimeoutMs: typeof opts.queryTimeoutMs === 'number' ? opts.queryTimeoutMs : undefined,
        ssl: typeof opts.ssl === 'boolean' ? opts.ssl : undefined,
      },
    }
  }

  private buildRestApiAdapterConfig(jobConfig: JobConfigDoc): RestApiAdapterConfig {
    const cfg = jobConfig.source.config
    if (typeof cfg.baseUrl !== 'string' || cfg.baseUrl.length === 0) {
      throw new Error('source.config.baseUrl is required for REST adapter')
    }
    if (typeof cfg.endpoint !== 'string') {
      throw new Error('source.config.endpoint is required for REST adapter')
    }
    const method = cfg.method === 'POST' ? 'POST' : 'GET'
    return {
      baseUrl: cfg.baseUrl,
      endpoint: cfg.endpoint,
      method,
      headers: cfg.headers as Record<string, string> | undefined,
      queryParams: cfg.queryParams as Record<string, unknown> | undefined,
      body: cfg.body,
      responsePath: typeof cfg.responsePath === 'string' ? cfg.responsePath : undefined,
      pagination: cfg.pagination as RestPaginationConfig | undefined,
      timeoutMs: typeof cfg.timeoutMs === 'number' ? cfg.timeoutMs : undefined,
      retryOnStatus: Array.isArray(cfg.retryOnStatus) ? (cfg.retryOnStatus as number[]) : undefined,
      rateLimit: jobConfig.options.rateLimit,
    }
  }

  /** Resolves the GridFS-backed `contentStream` factory for an Excel/CSV job. */
  private async resolveFileContentStream(jobConfig: JobConfigDoc): Promise<() => ReturnType<GridfsService['download']>> {
    const cfg = jobConfig.source.config
    const sourceFileIdHex = typeof cfg.sourceFileId === 'string' ? cfg.sourceFileId : ''
    if (!sourceFileIdHex || !ObjectId.isValid(sourceFileIdHex)) {
      throw new Error('source.config.sourceFileId must be a valid ObjectId hex string')
    }
    const sourceFileId = new ObjectId(sourceFileIdHex)
    const sourceFile = await this.sourceFiles.findById(sourceFileId)
    if (!sourceFile) {
      throw new Error(`source_file ${sourceFileIdHex} not found`)
    }
    return () => this.gridfs.download(sourceFile.gridFsFileId)
  }

  private async buildExcelAdapterConfig(jobConfig: JobConfigDoc): Promise<ExcelAdapterConfig> {
    const cfg = jobConfig.source.config
    return {
      contentStream: await this.resolveFileContentStream(jobConfig),
      sheetName: typeof cfg.sheetName === 'string' ? cfg.sheetName : undefined,
      headerRow: Number(cfg.headerRow ?? 1),
      startRow: Number(cfg.startRow ?? 2),
      fieldTypes: cfg.fieldTypes as ExcelAdapterConfig['fieldTypes'],
    }
  }

  private async buildCsvAdapterConfig(jobConfig: JobConfigDoc): Promise<CsvAdapterConfig> {
    const cfg = jobConfig.source.config
    return {
      contentStream: await this.resolveFileContentStream(jobConfig),
      headerRow: Number(cfg.headerRow ?? 1),
      startRow: Number(cfg.startRow ?? 2),
      delimiter: typeof cfg.delimiter === 'string' ? cfg.delimiter : undefined,
      fieldTypes: cfg.fieldTypes as CsvAdapterConfig['fieldTypes'],
    }
  }

  private async resolveCredentials(credentialsRef: ObjectId | undefined): Promise<unknown> {
    if (!credentialsRef) return null
    const plaintext = await this.secrets.revealPlaintext(credentialsRef)
    try {
      return JSON.parse(plaintext) as unknown
    } catch {
      return plaintext
    }
  }

  private extractSourceFileId(jobConfig: JobConfigDoc): string | undefined {
    const cfg = jobConfig.source.config
    return typeof cfg.sourceFileId === 'string' ? cfg.sourceFileId : undefined
  }

  private startHeartbeat(runId: ObjectId): ReturnType<typeof setInterval> {
    return setInterval(() => {
      this.runs.touchHeartbeat(runId).catch((err: unknown) => {
        this.logger.warn(`heartbeat update failed for run ${runId.toHexString()}: ${String(err)}`)
      })
    }, this.heartbeatIntervalMs)
  }
}

function isDuplicateKey(err: unknown): boolean {
  return err instanceof MongoServerError && err.code === DUPLICATE_KEY
}
