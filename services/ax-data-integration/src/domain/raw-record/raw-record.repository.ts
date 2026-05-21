import { Inject, Injectable } from '@nestjs/common'
import { type Collection, type Db, type Filter, ObjectId } from 'mongodb'

import { MONGO_DB } from '../../acore/mongo'
import { RAW_RECORDS_COLLECTION, type RawRecordDoc, type RawRecordInsert, type RawRecordStatus } from './raw-record.schema'

export interface UpdateChangedInput {
  payload: Record<string, unknown>
  payloadHash: string
  lastSeenAt: Date
  lastUpdatedRunId: ObjectId
}

export interface ListRawRecordsQuery {
  jobConfigId: ObjectId
  status?: RawRecordStatus
  recordKey?: string
  /** Matches any of `firstSeenRunId | lastUpdatedRunId | deletedInRunId`. */
  runId?: ObjectId
  skip: number
  limit: number
}

@Injectable()
export class RawRecordRepository {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  private get collection(): Collection<RawRecordDoc> {
    return this.db.collection<RawRecordDoc>(RAW_RECORDS_COLLECTION)
  }

  async findByKey(jobConfigId: ObjectId, recordKey: string): Promise<RawRecordDoc | null> {
    return this.collection.findOne({ jobConfigId, recordKey })
  }

  async findById(id: ObjectId): Promise<RawRecordDoc | null> {
    return this.collection.findOne({ _id: id })
  }

  async list(query: ListRawRecordsQuery): Promise<{ items: RawRecordDoc[]; total: number }> {
    const filter: Filter<RawRecordDoc> = { jobConfigId: query.jobConfigId }
    if (query.status) filter.status = query.status
    if (query.recordKey) filter.recordKey = query.recordKey
    if (query.runId) {
      filter.$or = [{ firstSeenRunId: query.runId }, { lastUpdatedRunId: query.runId }, { deletedInRunId: query.runId }]
    }
    const [items, total] = await Promise.all([
      this.collection.find(filter).sort({ lastSeenAt: -1 }).skip(query.skip).limit(query.limit).toArray(),
      this.collection.countDocuments(filter),
    ])
    return { items, total }
  }

  /** Inserts a new active record. Throws MongoServerError E11000 if `(jobConfigId, recordKey)` already exists. */
  async insertNew(input: RawRecordInsert): Promise<RawRecordDoc> {
    const doc: RawRecordDoc = { _id: new ObjectId(), ...input }
    await this.collection.insertOne(doc)
    return doc
  }

  /** Replaces payload + bumps version. Resurrects status to 'active' even if previously deleted (per P002 §9 step 2). */
  async updateChanged(id: ObjectId, update: UpdateChangedInput): Promise<void> {
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          payload: update.payload,
          payloadHash: update.payloadHash,
          lastSeenAt: update.lastSeenAt,
          lastUpdatedRunId: update.lastUpdatedRunId,
          status: 'active' as RawRecordStatus,
        },
        $inc: { version: 1 },
      },
    )
  }

  /** Only bumps `lastSeenAt`; used for the unchanged branch so delete-detection in next run sees a recent timestamp. */
  async touchLastSeen(id: ObjectId, lastSeenAt: Date): Promise<void> {
    await this.collection.updateOne({ _id: id }, { $set: { lastSeenAt } })
  }

  async countByJobConfig(jobConfigId: ObjectId, filter: { status?: RawRecordStatus } = {}): Promise<number> {
    const query: Filter<RawRecordDoc> = { jobConfigId }
    if (filter.status) query.status = filter.status
    return this.collection.countDocuments(query)
  }

  /**
   * Fast-path delete detection (P002 §9 step 3). Marks every active record whose
   * `lastSeenAt` predates the current run's start as deleted, in a single `updateMany`.
   * Returns the number of records transitioned to `status: 'deleted'`.
   *
   * For the audit-aware slow path (one-by-one with changelog entries) use
   * `findStaleActive` + `markOneAsDeleted` (T-E06).
   */
  async markStaleAsDeleted(jobConfigId: ObjectId, runId: ObjectId, startedAt: Date): Promise<number> {
    const result = await this.collection.updateMany(
      {
        jobConfigId,
        status: 'active',
        lastSeenAt: { $lt: startedAt },
      },
      {
        $set: {
          status: 'deleted' as RawRecordStatus,
          deletedInRunId: runId,
          lastSeenAt: new Date(),
        },
      },
    )
    return result.modifiedCount
  }

  /** Iterates stale active records — used by the audit-aware delete path so the executor can read each doc before marking it deleted. */
  findStaleActive(jobConfigId: ObjectId, startedAt: Date): AsyncIterable<RawRecordDoc> {
    return this.collection.find({
      jobConfigId,
      status: 'active',
      lastSeenAt: { $lt: startedAt },
    })
  }

  async markOneAsDeleted(id: ObjectId, runId: ObjectId, lastSeenAt: Date = new Date()): Promise<void> {
    await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          status: 'deleted' as RawRecordStatus,
          deletedInRunId: runId,
          lastSeenAt,
        },
      },
    )
  }
}
