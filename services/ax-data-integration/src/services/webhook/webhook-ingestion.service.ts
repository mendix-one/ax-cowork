import { createHash } from 'crypto'
import { hostname } from 'os'

import { Inject, Injectable, Logger, Optional } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ObjectId } from 'mongodb'

import type { AdapterRecord } from '../../adapters'
import type { JobConfigDoc, RunStatus } from '../../domain/job-config'
import { type RawRecordChangelogInsert } from '../../domain/raw-record-changelog'
import { SourceMetadataRepository } from '../../domain/source-metadata'
import { SyncRunRepository, ZERO_COUNTS, type SyncRunCounts, type SyncRunErrorEntry } from '../../domain/sync-run'
import { stableStringify } from '../../workers/compute-record-key'
import { RecordClassifierService } from '../../workers/record-classifier.service'
import { SYNC_RUN_COMPLETED_EVENT, type SyncRunCompletedPayload } from '../../workers/sync-executor.service'
import { MetricsService } from '../metrics'
import { parseWebhookBody } from './webhook-body.parser'
import { inferWebhookSchema } from './webhook-schema.infer'

/**
 * Result returned from `WebhookController` once a payload has been processed. `runId` correlates
 * the push with the resulting `sync_runs` document.
 */
export interface WebhookIngestionResult {
  runId: ObjectId
}

/**
 * Inputs to `WebhookIngestionService.ingest`.
 *
 * - `jobConfig`: the resolved webhook-source job_config (controller already verified `source.type==='webhook'`)
 * - `body`: parsed JSON body. Type is `unknown` because the shape varies by `source.config.eventField` —
 *   {@link parseWebhookBody} owns the structural validation.
 * - `rawBody`: exact wire bytes. T2-B03 (HMAC verify) consumes this BEFORE `ingest` runs; kept on the
 *   input shape for future signature/diagnostic uses but unused here.
 * - `signatureHeader`: value of the configured signature header on the incoming request. Unused here
 *   (already validated by `WebhookSignatureVerifier`); kept on the input shape so callers don't have to
 *   strip it out.
 */
export interface WebhookIngestionInput {
  jobConfig: JobConfigDoc
  body: unknown
  rawBody: Buffer
  signatureHeader: string | undefined
}

/**
 * Persists one webhook payload as a full `sync_run` (T2-B04). Flow:
 *
 *   1. {@link parseWebhookBody} — split the body into an array of records (1 record OR N depending on
 *      `source.config.eventField`). Structural failures throw `BadRequestException` BEFORE any DB write.
 *   2. `sync_runs.insertRunning` — create the run with `triggeredBy='webhook'` and a per-worker label
 *      so the stale-run sweeper treats it the same as cron-driven runs.
 *   3. {@link inferWebhookSchema} + `sourceMetadata.insertIfNew` — best-effort schema metadata from the
 *      first 10 records of THIS payload (no upstream `discoverMetadata`). A persistence failure here
 *      is logged but does NOT abort the run — `raw_records` is the source-of-truth, schema is a debug aid.
 *   4. For each record → {@link RecordClassifierService.classifyAndWrite} — REUSES the executor's write
 *      path verbatim (insert / update / unchanged + audit-changelog buffering). Error threshold honoured
 *      identically: configured per-job, falls back to the same `DEFAULT_ERROR_THRESHOLD` token (we pull
 *      it via Optional + default to 100 to avoid hard-coupling WebhookModule to WorkersModule's
 *      providers).
 *   5. End-of-loop changelog flush; status computed (`success` / `partial` / `failed`).
 *   6. `runs.finalize(...)`; metrics + `SYNC_RUN_COMPLETED_EVENT` emitted with the same payload shape
 *      the cron-driven path emits, so listeners (T2-B09 drift, T2-B11 alerts) see webhook runs without
 *      special-casing.
 *
 * Concurrency: webhook ingestion does NOT take the `ConcurrencyService` lock — webhooks are inherently
 * receiver-driven and may arrive overlapping; the per-`recordKey` unique index in `raw_records` is the
 * actual safety net. A duplicate-key race within a run still maps to a `Duplicate recordKey within run`
 * error, same as the pull path; callers retry on 409 on their side if needed.
 */
@Injectable()
export class WebhookIngestionService {
  private readonly logger = new Logger(WebhookIngestionService.name)
  private readonly workerId = `${hostname()}:${process.pid}`

  constructor(
    private readonly runs: SyncRunRepository,
    private readonly sourceMetadata: SourceMetadataRepository,
    private readonly classifier: RecordClassifierService,
    @Optional() @Inject(MetricsService) private readonly metrics?: MetricsService,
    @Optional() @Inject(EventEmitter2) private readonly events?: EventEmitter2,
  ) {}

  async ingest(input: WebhookIngestionInput): Promise<WebhookIngestionResult> {
    const { jobConfig } = input
    // Step 1: split body into records. May throw BadRequestException — propagates as 400, no run created.
    const payloads = parseWebhookBody(input.body, jobConfig.source.config)

    // Step 2: create the sync_run.
    const run = await this.runs.insertRunning({
      jobConfigId: jobConfig._id,
      triggeredBy: 'webhook',
      workerId: this.workerId,
    })
    const runId = run._id
    const counts: SyncRunCounts = { ...ZERO_COUNTS }
    const errors: SyncRunErrorEntry[] = []
    const changelogBuffer: RawRecordChangelogInsert[] = []
    const auditChanges = jobConfig.options.auditChanges
    const errorThreshold = jobConfig.options.errorThreshold ?? 100
    let aborted = false

    try {
      // Step 3: best-effort schema persistence.
      await this.persistSchema(jobConfig._id, runId, payloads)

      // Step 4: classify & write each record.
      for (const payload of payloads) {
        counts.read++
        const record: AdapterRecord = { payload }
        try {
          await this.classifier.classifyAndWrite({
            record,
            jobConfig,
            runId,
            sourceFileIdForKey: undefined,
            counts,
            changelogBuffer,
            auditChanges,
          })
        } catch (err) {
          counts.errors++
          const message = err instanceof Error ? err.message : String(err)
          const stack = err instanceof Error ? err.stack : undefined
          errors.push({ stage: 'write', message, stack, occurredAt: new Date() })
          if (counts.errors >= errorThreshold) {
            this.logger.warn(`Error threshold reached (${counts.errors}/${errorThreshold}) — aborting webhook run ${runId.toHexString()}`)
            aborted = true
            break
          }
        }
      }

      // Step 5: drain audit buffer.
      await this.classifier.flushChangelog(changelogBuffer, errors)
    } catch (err) {
      // Top-level catch for the schema-persist branch and any unexpected throw inside the classifier
      // path that isn't already handled per-record. The run still finalizes as `failed` so operators
      // see the error trail in /sync-runs.
      const message = err instanceof Error ? err.message : String(err)
      const stack = err instanceof Error ? err.stack : undefined
      errors.push({ stage: 'other', message, stack, occurredAt: new Date() })
      aborted = true
    }

    // Step 6: finalize + emit.
    const status: RunStatus = aborted ? 'failed' : errors.length > 0 ? 'partial' : 'success'
    const finishedAt = new Date()
    await this.runs.finalize(runId, {
      status,
      counts,
      finishedAt,
      ...(errors.length > 0 ? { errors } : {}),
    })

    const durationMs = finishedAt.getTime() - run.startedAt.getTime()
    try {
      this.metrics?.observeSyncRunCompleted({
        jobConfigId: jobConfig._id.toHexString(),
        status,
        durationMs,
        counts,
      })
    } catch (err) {
      this.logger.warn(`metrics.observeSyncRunCompleted failed for webhook run ${runId.toHexString()}: ${String(err)}`)
    }

    try {
      const payload: SyncRunCompletedPayload = {
        jobConfigId: jobConfig._id,
        syncRunId: runId,
        status,
        counts,
        durationMs,
        triggeredBy: 'webhook',
        finishedAt,
      }
      this.events?.emit(SYNC_RUN_COMPLETED_EVENT, payload)
    } catch (err) {
      this.logger.warn(`sync.run.completed emit failed for webhook run ${runId.toHexString()}: ${String(err)}`)
    }

    return { runId }
  }

  private async persistSchema(jobConfigId: ObjectId, syncRunId: ObjectId, payloads: ReadonlyArray<Record<string, unknown>>): Promise<void> {
    if (payloads.length === 0) return
    try {
      const schema = inferWebhookSchema(payloads)
      const schemaHash = createHash('sha256').update(stableStringify(schema)).digest('hex')
      const now = new Date()
      await this.sourceMetadata.insertIfNew({
        jobConfigId,
        syncRunId,
        schemaHash,
        schema,
        detectedAt: now,
        createdAt: now,
      })
    } catch (err) {
      // Schema persistence is best-effort — never block ingestion on it. Log so an operator can
      // see drift if the index ever stops accepting writes; the run will still finalize correctly.
      this.logger.warn(`webhook schema persist failed for run ${syncRunId.toHexString()}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
}
