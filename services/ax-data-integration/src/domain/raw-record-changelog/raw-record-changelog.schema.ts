import type { ObjectId } from 'mongodb'

export const RAW_RECORD_CHANGELOG_COLLECTION = 'raw_record_changelog'

export type ChangelogOperation = 'insert' | 'update' | 'delete'

/** Mirrors P002 §5.7. Append-only audit trail per raw_records state change. */
export interface RawRecordChangelogDoc {
  _id: ObjectId
  jobConfigId: ObjectId
  rawRecordId: ObjectId
  recordKey: string
  syncRunId: ObjectId
  operation: ChangelogOperation

  versionBefore: number | null
  versionAfter: number
  payloadBefore: Record<string, unknown> | null
  payloadAfter: Record<string, unknown>
  payloadHashBefore: string | null
  payloadHashAfter: string

  occurredAt: Date
  createdAt: Date
}

export type RawRecordChangelogInsert = Omit<RawRecordChangelogDoc, '_id'>
