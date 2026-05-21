import type { ObjectId } from 'mongodb'

export const SOURCE_FILES_COLLECTION = 'source_files'

/** Mirrors P002 §5.5. Metadata layer on top of GridFS. */
export interface SourceFileDoc {
  _id: ObjectId
  fileName: string
  contentType: string
  size: number
  checksum: string
  gridFsFileId: ObjectId
  uploadedBy: string
  uploadedAt: Date
  createdAt: Date
}

export type SourceFileInsert = Omit<SourceFileDoc, '_id'>

/** API-facing view. Excludes the GridFS file id (an internal storage detail). */
export interface SourceFileSummary {
  id: string
  fileName: string
  contentType: string
  size: number
  checksum: string
  uploadedBy: string
  uploadedAt: Date
  createdAt: Date
}
