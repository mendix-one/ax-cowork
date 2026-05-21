import { Inject, Injectable } from '@nestjs/common'
import { type Collection, type Db, ObjectId } from 'mongodb'

import { MONGO_DB } from '../../acore/mongo'
import { SOURCE_FILES_COLLECTION, type SourceFileDoc, type SourceFileInsert } from './source-file.schema'

@Injectable()
export class SourceFileRepository {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  private get collection(): Collection<SourceFileDoc> {
    return this.db.collection<SourceFileDoc>(SOURCE_FILES_COLLECTION)
  }

  async findById(id: ObjectId): Promise<SourceFileDoc | null> {
    return this.collection.findOne({ _id: id })
  }

  async findByChecksum(checksum: string): Promise<SourceFileDoc | null> {
    return this.collection.findOne({ checksum })
  }

  async list(): Promise<SourceFileDoc[]> {
    return this.collection.find({}).sort({ uploadedAt: -1 }).toArray()
  }

  async insert(doc: SourceFileInsert): Promise<SourceFileDoc> {
    const result = await this.collection.insertOne(doc as SourceFileDoc)
    return { ...doc, _id: result.insertedId }
  }

  async deleteById(id: ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id })
    return result.deletedCount === 1
  }
}
