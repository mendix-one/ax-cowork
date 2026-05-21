import { Inject, Injectable, Logger } from '@nestjs/common'
import { type Collection, type Db, type Filter, MongoServerError, ObjectId } from 'mongodb'

import { MONGO_DB } from '../../acore/mongo'
import { SOURCE_METADATA_COLLECTION, type SourceMetadataDoc, type SourceMetadataInsert } from './source-metadata.schema'

const DUPLICATE_KEY = 11000

export interface ListSourceMetadataQuery {
  jobConfigId: ObjectId
  schemaHash?: string
  skip: number
  limit: number
}

@Injectable()
export class SourceMetadataRepository {
  private readonly logger = new Logger(SourceMetadataRepository.name)

  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  private get collection(): Collection<SourceMetadataDoc> {
    return this.db.collection<SourceMetadataDoc>(SOURCE_METADATA_COLLECTION)
  }

  /**
   * Inserts a new metadata snapshot ONLY if the `(jobConfigId, schemaHash)` pair is new.
   * The unique partial index does the heavy lifting — we just catch E11000 and report
   * that nothing changed. Returns the inserted doc's id, or `null` if it was a duplicate.
   */
  async insertIfNew(input: SourceMetadataInsert): Promise<ObjectId | null> {
    const doc: SourceMetadataDoc = { _id: new ObjectId(), ...input }
    try {
      await this.collection.insertOne(doc)
      return doc._id
    } catch (err) {
      if (err instanceof MongoServerError && err.code === DUPLICATE_KEY) {
        this.logger.debug(`schemaHash ${input.schemaHash} already recorded for jobConfig ${input.jobConfigId.toHexString()}`)
        return null
      }
      throw err
    }
  }

  async findLatest(jobConfigId: ObjectId): Promise<SourceMetadataDoc | null> {
    return this.collection.find({ jobConfigId }).sort({ detectedAt: -1 }).limit(1).next()
  }

  async findById(id: ObjectId): Promise<SourceMetadataDoc | null> {
    return this.collection.findOne({ _id: id })
  }

  async list(query: ListSourceMetadataQuery): Promise<{ items: SourceMetadataDoc[]; total: number }> {
    const filter: Filter<SourceMetadataDoc> = { jobConfigId: query.jobConfigId }
    if (query.schemaHash) filter.schemaHash = query.schemaHash
    const [items, total] = await Promise.all([
      this.collection.find(filter).sort({ detectedAt: -1 }).skip(query.skip).limit(query.limit).toArray(),
      this.collection.countDocuments(filter),
    ])
    return { items, total }
  }

  async countByJobConfig(jobConfigId: ObjectId): Promise<number> {
    return this.collection.countDocuments({ jobConfigId })
  }
}
