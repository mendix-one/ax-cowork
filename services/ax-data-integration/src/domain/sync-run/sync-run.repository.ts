import { Inject, Injectable } from '@nestjs/common'
import { type Collection, type Db, type Filter, ObjectId, type UpdateFilter } from 'mongodb'

import { MONGO_DB } from '../../acore/mongo'
import type { RunStatus } from '../job-config'
import { SYNC_RUNS_COLLECTION, ZERO_COUNTS, type SyncRunCounts, type SyncRunDoc, type SyncRunErrorEntry, type TriggerSource } from './sync-run.schema'

export interface ListSyncRunsQuery {
  jobConfigId?: ObjectId
  status?: RunStatus
  /** `startedAt >= from`. */
  from?: Date
  /** `startedAt <= to`. */
  to?: Date
  skip: number
  limit: number
}

export interface InsertRunningInput {
  jobConfigId: ObjectId
  triggeredBy: TriggerSource
  workerId: string
  parentRunId?: ObjectId
}

export interface FinalizeRunInput {
  status: Exclude<RunStatus, 'running'>
  counts: SyncRunCounts
  finishedAt: Date
  errors?: SyncRunErrorEntry[]
}

@Injectable()
export class SyncRunRepository {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  private get collection(): Collection<SyncRunDoc> {
    return this.db.collection<SyncRunDoc>(SYNC_RUNS_COLLECTION)
  }

  /**
   * Inserts a new `status: 'running'` doc. Relies on the partial unique index
   * `(jobConfigId, status)` with `partialFilter: { status: 'running' }` to throw
   * `MongoServerError` code 11000 when another run is already in flight for the
   * same job — this is how `SyncExecutor` detects a DB-level overlap (P002 §8.2).
   */
  async insertRunning(input: InsertRunningInput): Promise<SyncRunDoc> {
    const now = new Date()
    const doc: SyncRunDoc = {
      _id: new ObjectId(),
      jobConfigId: input.jobConfigId,
      triggeredBy: input.triggeredBy,
      ...(input.parentRunId ? { parentRunId: input.parentRunId } : {}),
      status: 'running',
      startedAt: now,
      heartbeatAt: now,
      workerId: input.workerId,
      counts: { ...ZERO_COUNTS },
      errors: [],
      createdAt: now,
    }
    await this.collection.insertOne(doc)
    return doc
  }

  /** Marks a run as terminated (success / partial / failed / stale). Returns the updated doc. */
  async finalize(id: ObjectId, update: FinalizeRunInput): Promise<SyncRunDoc | null> {
    const set: Partial<SyncRunDoc> = {
      status: update.status,
      counts: update.counts,
      finishedAt: update.finishedAt,
    }
    if (update.errors && update.errors.length > 0) set.errors = update.errors
    return this.collection.findOneAndUpdate({ _id: id }, { $set: set }, { returnDocument: 'after' })
  }

  /** Periodic heartbeat write used by SyncExecutor's setInterval (T-E03). */
  async touchHeartbeat(id: ObjectId, at: Date = new Date()): Promise<void> {
    await this.collection.updateOne({ _id: id }, { $set: { heartbeatAt: at } })
  }

  /** Periodic counts flush during the main loop (T-E04) so admins can watch progress live. */
  async updateCounts(id: ObjectId, counts: SyncRunCounts): Promise<void> {
    await this.collection.updateOne({ _id: id }, { $set: { counts } })
  }

  async findById(id: ObjectId): Promise<SyncRunDoc | null> {
    return this.collection.findOne({ _id: id })
  }

  async findRunning(jobConfigId: ObjectId): Promise<SyncRunDoc | null> {
    return this.collection.findOne({ jobConfigId, status: 'running' })
  }

  async list(query: ListSyncRunsQuery): Promise<{ items: SyncRunDoc[]; total: number }> {
    const filter: Filter<SyncRunDoc> = {}
    if (query.jobConfigId) filter.jobConfigId = query.jobConfigId
    if (query.status) filter.status = query.status
    if (query.from || query.to) {
      const range: Record<string, Date> = {}
      if (query.from) range.$gte = query.from
      if (query.to) range.$lte = query.to
      filter.startedAt = range
    }
    const [items, total] = await Promise.all([
      this.collection.find(filter).sort({ startedAt: -1 }).skip(query.skip).limit(query.limit).toArray(),
      this.collection.countDocuments(filter),
    ])
    return { items, total }
  }

  async countByJobConfig(jobConfigId: ObjectId): Promise<number> {
    return this.collection.countDocuments({ jobConfigId })
  }

  /**
   * Stale-run sweep (P002 §8.4). Transitions every `status='running'` doc whose
   * `heartbeatAt` predates `heartbeatBefore` to `status='stale'`, appends a
   * `heartbeat-timeout` error, and sets `finishedAt`. Returns the modified count.
   *
   * Releases the `running` partial-unique lock so the next scheduled fire can claim
   * a fresh run for the same `jobConfigId`.
   */
  async markStale(heartbeatBefore: Date): Promise<number> {
    const now = new Date()
    const error: SyncRunErrorEntry = { stage: 'heartbeat', message: 'heartbeat timeout', occurredAt: now }
    const update = {
      $set: { status: 'stale' as const, finishedAt: now },
      $push: { errors: error },
    } as unknown as UpdateFilter<SyncRunDoc>
    const result = await this.collection.updateMany({ status: 'running', heartbeatAt: { $lt: heartbeatBefore } }, update)
    return result.modifiedCount
  }
}
