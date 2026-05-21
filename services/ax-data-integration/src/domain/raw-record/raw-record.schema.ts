import type { ObjectId } from 'mongodb'

export const RAW_RECORDS_COLLECTION = 'raw_records'

export type RawRecordStatus = 'active' | 'deleted'

/** Mirrors P002 §5.3. */
export interface RawRecordDoc {
  _id: ObjectId
  jobConfigId: ObjectId
  recordKey: string
  payloadHash: string
  payload: Record<string, unknown>
  /** GridFS reference for payloads exceeding the 16 MB BSON limit. Not used in phase 1. */
  payloadRef?: ObjectId
  status: RawRecordStatus
  version: number
  firstSeenAt: Date
  lastSeenAt: Date
  firstSeenRunId: ObjectId
  lastUpdatedRunId: ObjectId
  deletedInRunId?: ObjectId
  createdAt: Date
}

export type RawRecordInsert = Omit<RawRecordDoc, '_id'>
