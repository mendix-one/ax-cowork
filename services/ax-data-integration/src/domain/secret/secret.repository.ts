import { Inject, Injectable } from '@nestjs/common'
import { type Collection, type Db, ObjectId } from 'mongodb'

import { MONGO_DB } from '../../acore/mongo'
import { SECRETS_COLLECTION, type SecretDoc, type SecretInsert } from './secret.schema'

export interface SecretUpdatableFields {
  name?: string
  type?: SecretDoc['type']
  encrypted?: SecretDoc['encrypted']
  updatedAt: Date
}

@Injectable()
export class SecretRepository {
  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  private get collection(): Collection<SecretDoc> {
    return this.db.collection<SecretDoc>(SECRETS_COLLECTION)
  }

  async findById(id: ObjectId): Promise<SecretDoc | null> {
    return this.collection.findOne({ _id: id })
  }

  async findByName(name: string): Promise<SecretDoc | null> {
    return this.collection.findOne({ name })
  }

  async list(): Promise<SecretDoc[]> {
    return this.collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async insert(doc: SecretInsert): Promise<SecretDoc> {
    const result = await this.collection.insertOne(doc as SecretDoc)
    return { ...doc, _id: result.insertedId }
  }

  async updateById(id: ObjectId, update: SecretUpdatableFields): Promise<SecretDoc | null> {
    return this.collection.findOneAndUpdate({ _id: id }, { $set: update }, { returnDocument: 'after' })
  }

  async deleteById(id: ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id })
    return result.deletedCount === 1
  }
}
