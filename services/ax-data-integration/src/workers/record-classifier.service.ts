import { createHash } from 'crypto'

import { Injectable, Logger } from '@nestjs/common'
import { MongoServerError, type ObjectId } from 'mongodb'

import type { AdapterRecord } from '../adapters'
import type { JobConfigDoc } from '../domain/job-config'
import { RawRecordChangelogRepository, type RawRecordChangelogInsert } from '../domain/raw-record-changelog'
import { RawRecordRepository, type RawRecordDoc } from '../domain/raw-record'
import type { SyncRunCounts, SyncRunErrorEntry } from '../domain/sync-run'
import { computeRecordKey, stableStringify } from './compute-record-key'

const DUPLICATE_KEY = 11000

export interface ClassifyInput {
  record: AdapterRecord
  jobConfig: JobConfigDoc
  runId: ObjectId
  sourceFileIdForKey: string | undefined
  counts: SyncRunCounts
  changelogBuffer: RawRecordChangelogInsert[]
  auditChanges: boolean
}

/**
 * Per-record classify-and-write path: lookup → insert / update / touch + audit-changelog buffering.
 * Extracted from `SyncExecutorService` so `WebhookIngestionService` (T2-B04) and any future push-driven
 * ingestion can reuse the SAME write semantics without duplicating the algorithm. Pure side-effect on
 * `counts` and `changelogBuffer` — caller controls the larger run loop, error threshold, and finalization.
 */
@Injectable()
export class RecordClassifierService {
  private readonly logger = new Logger(RecordClassifierService.name)

  constructor(
    private readonly rawRecords: RawRecordRepository,
    private readonly changelogs: RawRecordChangelogRepository,
  ) {}

  async classifyAndWrite(input: ClassifyInput): Promise<void> {
    const { record, jobConfig, runId, sourceFileIdForKey, counts, changelogBuffer, auditChanges } = input
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
          // Adapter emitted the same recordKey twice within this run (P002 §9.4). The webhook
          // ingestion path can also hit this when two simultaneous POSTs target the same
          // jobConfig + recordKey — same surface, treated identically.
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

  /**
   * Drains `buffer` into `raw_record_changelog`. Retries the batch once on failure before recording
   * an `audit`-stage entry in the supplied `errors` array. Audit problems never crash the surrounding
   * run — the source-of-truth is `raw_records`, the audit trail is best-effort.
   */
  async flushChangelog(buffer: RawRecordChangelogInsert[], errors: SyncRunErrorEntry[]): Promise<void> {
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
}

function isDuplicateKey(err: unknown): boolean {
  return err instanceof MongoServerError && err.code === DUPLICATE_KEY
}
