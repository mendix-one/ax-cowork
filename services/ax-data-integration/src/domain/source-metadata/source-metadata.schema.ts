import type { ObjectId } from 'mongodb'

import type { SourceField } from '../../adapters'

export const SOURCE_METADATA_COLLECTION = 'source_metadata'

export interface SourceMetadataDoc {
  _id: ObjectId
  jobConfigId: ObjectId
  syncRunId: ObjectId
  schemaHash: string
  schema: {
    fields: SourceField[]
    raw: Record<string, unknown>
  }
  detectedAt: Date
  createdAt: Date
}

export type SourceMetadataInsert = Omit<SourceMetadataDoc, '_id'>
