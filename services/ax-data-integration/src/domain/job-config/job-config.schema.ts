import type { ObjectId } from 'mongodb'

export const JOB_CONFIGS_COLLECTION = 'job_configs'

export type SourceType = 'excel' | 'csv' | 'mysql' | 'postgres' | 'mssql' | 'oracle' | 'rest' | 'graphql' | 'soap'
export type IdentityStrategy = 'primary-key' | 'composite' | 'hash' | 'row-number'
export type RunStatus = 'running' | 'success' | 'partial' | 'failed' | 'stale'

/**
 * The `source.config` shape varies per `source.type` (see P002 §6). Phase 1 stores it
 * loosely as a record; DTO-level validation per type lands in T-C02 / T-C04.
 */
export interface JobConfigSource {
  type: SourceType
  config: Record<string, unknown>
}

export interface JobConfigSchedule {
  cronExpression: string
  timezone?: string
}

export interface JobConfigIdentity {
  strategy: IdentityStrategy
  fields: string[]
  acknowledgeHashSemantics?: boolean
}

export interface JobConfigOptions {
  detectDeleted: boolean
  auditChanges: boolean
  errorThreshold?: number
  rateLimit?: { rps: number }
}

/** Persistence shape (mirrors P002 §5.1). */
export interface JobConfigDoc {
  _id: ObjectId
  name: string
  description?: string
  enabled: boolean
  source: JobConfigSource
  schedule: JobConfigSchedule
  identity: JobConfigIdentity
  options: JobConfigOptions
  credentialsRef?: ObjectId
  lastRunId?: ObjectId
  lastRunStatus?: RunStatus
  lastRunAt?: Date
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export type JobConfigInsert = Omit<JobConfigDoc, '_id'>

/** API-facing view: ObjectId fields are serialized as hex strings. */
export interface JobConfigSummary {
  id: string
  name: string
  description?: string
  enabled: boolean
  source: JobConfigSource
  schedule: JobConfigSchedule
  identity: JobConfigIdentity
  options: JobConfigOptions
  credentialsRef?: string
  lastRunId?: string
  lastRunStatus?: RunStatus
  lastRunAt?: Date
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface ListJobConfigsFilter {
  enabled?: boolean
  sourceType?: SourceType
  page?: number
  pageSize?: number
}

export interface ListJobConfigsResult {
  items: JobConfigSummary[]
  total: number
  page: number
  pageSize: number
}
