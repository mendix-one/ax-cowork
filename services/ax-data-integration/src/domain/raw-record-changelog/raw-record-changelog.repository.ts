import { Inject, Injectable } from '@nestjs/common'
import { type Collection, type Db, type Filter, ObjectId } from 'mongodb'

import { MONGO_DB } from '../../acore/mongo'
import {
  RAW_RECORD_CHANGELOG_COLLECTION,
  type ChangelogOperation,
  type RawRecordChangelogDoc,
  type RawRecordChangelogInsert,
} from './raw-record-changelog.schema'

@Injectable()
export class RawRecordChangelogRepository {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  private get collection(): Collection<RawRecordChangelogDoc> {
    return this.db.collection<RawRecordChangelogDoc>(RAW_RECORD_CHANGELOG_COLLECTION)
  }

  /** Bulk insert with `ordered: false` so a single bad doc does not abort the batch. */
  async insertMany(entries: RawRecordChangelogInsert[]): Promise<void> {
    if (entries.length === 0) return
    const docs: RawRecordChangelogDoc[] = entries.map((entry) => ({ _id: new ObjectId(), ...entry }))
    await this.collection.insertMany(docs, { ordered: false })
  }

  async countByJobConfig(jobConfigId: ObjectId, filter: { operation?: ChangelogOperation; syncRunId?: ObjectId } = {}): Promise<number> {
    const query: Filter<RawRecordChangelogDoc> = { jobConfigId }
    if (filter.operation) query.operation = filter.operation
    if (filter.syncRunId) query.syncRunId = filter.syncRunId
    return this.collection.countDocuments(query)
  }

  async findByRecord(jobConfigId: ObjectId, recordKey: string): Promise<RawRecordChangelogDoc[]> {
    return this.collection.find({ jobConfigId, recordKey }).sort({ occurredAt: 1 }).toArray()
  }
}
