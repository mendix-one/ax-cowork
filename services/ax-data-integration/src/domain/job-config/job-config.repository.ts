import { Inject, Injectable } from '@nestjs/common'
import { type Collection, type Db, type Filter, ObjectId, type UpdateFilter } from 'mongodb'

import { MONGO_DB } from '../../acore/mongo'
import { JOB_CONFIGS_COLLECTION, type JobConfigDoc, type JobConfigInsert, type SourceType } from './job-config.schema'

export interface RepoUpdate {
  set?: Partial<Omit<JobConfigDoc, '_id' | 'createdAt' | 'createdBy'>>
  unset?: ('credentialsRef' | 'description' | 'lastRunId' | 'lastRunStatus' | 'lastRunAt')[]
}

export interface ListQuery {
  enabled?: boolean
  sourceType?: SourceType
  skip: number
  limit: number
}

@Injectable()
export class JobConfigRepository {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  private get collection(): Collection<JobConfigDoc> {
    return this.db.collection<JobConfigDoc>(JOB_CONFIGS_COLLECTION)
  }

  async findById(id: ObjectId): Promise<JobConfigDoc | null> {
    return this.collection.findOne({ _id: id })
  }

  async findByName(name: string): Promise<JobConfigDoc | null> {
    return this.collection.findOne({ name })
  }

  async list(query: ListQuery): Promise<{ items: JobConfigDoc[]; total: number }> {
    const filter: Filter<JobConfigDoc> = {}
    if (typeof query.enabled === 'boolean') filter.enabled = query.enabled
    if (query.sourceType) filter['source.type'] = query.sourceType

    const [items, total] = await Promise.all([
      this.collection.find(filter).sort({ createdAt: -1 }).skip(query.skip).limit(query.limit).toArray(),
      this.collection.countDocuments(filter),
    ])
    return { items, total }
  }

  async insert(doc: JobConfigInsert): Promise<JobConfigDoc> {
    const result = await this.collection.insertOne(doc as JobConfigDoc)
    return { ...doc, _id: result.insertedId }
  }

  async update(id: ObjectId, update: RepoUpdate, expectedUpdatedAt?: Date): Promise<JobConfigDoc | null> {
    const updateDoc: UpdateFilter<JobConfigDoc> = {}
    if (update.set && Object.keys(update.set).length > 0) {
      updateDoc.$set = update.set
    }
    if (update.unset && update.unset.length > 0) {
      updateDoc.$unset = Object.fromEntries(update.unset.map((k) => [k, ''])) as UpdateFilter<JobConfigDoc>['$unset']
    }
    if (!updateDoc.$set && !updateDoc.$unset) {
      return this.findById(id)
    }
    const filter: Filter<JobConfigDoc> = { _id: id }
    if (expectedUpdatedAt) filter.updatedAt = expectedUpdatedAt
    return this.collection.findOneAndUpdate(filter, updateDoc, { returnDocument: 'after' })
  }

  async deleteById(id: ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id })
    return result.deletedCount === 1
  }

  /** Count of job configs referencing a given secret. Used to gate secret deletion. */
  async countByCredentialsRef(secretId: ObjectId): Promise<number> {
    return this.collection.countDocuments({ credentialsRef: secretId })
  }

  /**
   * Count of job configs whose `source.config.sourceFileId` matches the given file id.
   * NOTE: source.config is stored as raw JSON (loose Record<string,unknown>), so
   * sourceFileId is expected to be a hex string. If a future change normalizes to
   * ObjectId at write time, this query must be updated too.
   */
  async countBySourceFileRef(sourceFileId: ObjectId): Promise<number> {
    return this.collection.countDocuments({ 'source.config.sourceFileId': sourceFileId.toHexString() })
  }
}
