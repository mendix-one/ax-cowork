import type { ObjectId } from 'mongodb'

import type { RunStatus } from '../job-config'

export const SYNC_RUNS_COLLECTION = 'sync_runs'

export type TriggerSource = 'schedule' | 'manual' | 'retry'

export type SyncRunErrorStage = 'connect' | 'discover' | 'stream' | 'classify' | 'write' | 'detect-deleted' | 'audit' | 'heartbeat' | 'other'

export interface SyncRunErrorEntry {
  stage: SyncRunErrorStage
  recordKey?: string
  message: string
  stack?: string
  occurredAt: Date
}

export interface SyncRunCounts {
  read: number
  inserted: number
  updated: number
  unchanged: number
  deleted: number
  errors: number
}

export const ZERO_COUNTS: Readonly<SyncRunCounts> = Object.freeze({
  read: 0,
  inserted: 0,
  updated: 0,
  unchanged: 0,
  deleted: 0,
  errors: 0,
})

/** Mirrors P002 §5.4. */
export interface SyncRunDoc {
  _id: ObjectId
  jobConfigId: ObjectId
  triggeredBy: TriggerSource
  parentRunId?: ObjectId

  status: RunStatus

  startedAt: Date
  finishedAt?: Date
  heartbeatAt: Date
  workerId: string

  counts: SyncRunCounts
  errors: SyncRunErrorEntry[]

  metadataSnapshotId?: ObjectId

  createdAt: Date
}

export type SyncRunInsert = Omit<SyncRunDoc, '_id'>
