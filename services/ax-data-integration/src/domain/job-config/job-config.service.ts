import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { MongoServerError, ObjectId } from 'mongodb'

import { resolvePagination } from '../../acore/config/pagination'
import { validateJobConfigIdentity } from './identity.validator'
import { JobConfigRepository, type RepoUpdate } from './job-config.repository'

/** Emitted whenever a job config is created, updated, enabled/disabled, or soft-deleted. */
export const JOB_CONFIG_CHANGED_EVENT = 'jobConfig.changed'
export interface JobConfigChangedPayload {
  id: ObjectId
}
import type {
  JobConfigDoc,
  JobConfigIdentity,
  JobConfigOptions,
  JobConfigSchedule,
  JobConfigSource,
  JobConfigSummary,
  ListJobConfigsFilter,
  ListJobConfigsResult,
  RunStatus,
} from './job-config.schema'

export interface CreateJobConfigInput {
  name: string
  description?: string
  enabled?: boolean
  source: JobConfigSource
  schedule: JobConfigSchedule
  identity: JobConfigIdentity
  options?: Partial<JobConfigOptions>
  credentialsRef?: string
  createdBy: string
}

export interface UpdateJobConfigInput {
  name?: string
  description?: string | null
  source?: JobConfigSource
  schedule?: JobConfigSchedule
  identity?: JobConfigIdentity
  options?: Partial<JobConfigOptions>
  /** Pass `null` to clear the credentials reference, a hex string to set/replace. */
  credentialsRef?: string | null
}

export interface UpdateLastRunInput {
  lastRunId: ObjectId
  lastRunStatus: RunStatus
  lastRunAt: Date
}

const DUPLICATE_KEY = 11000

@Injectable()
export class JobConfigsService {
  private readonly logger = new Logger(JobConfigsService.name)
  private readonly events: EventEmitter2

  // `events` defaults to a fresh isolated EventEmitter2 so unit/e2e tests can construct
  // the service directly without wiring the global bus. NestJS DI injects the shared
  // EventEmitter2 (registered via EventEmitterModule.forRoot in MainModule) when this
  // service is resolved through the container.
  constructor(
    private readonly repo: JobConfigRepository,
    events?: EventEmitter2,
  ) {
    this.events = events ?? new EventEmitter2()
  }

  private emitChanged(id: ObjectId): void {
    const payload: JobConfigChangedPayload = { id }
    this.events.emit(JOB_CONFIG_CHANGED_EVENT, payload)
  }

  async create(input: CreateJobConfigInput): Promise<JobConfigSummary> {
    validateJobConfigIdentity(input.source, input.identity, this.logger)

    const existing = await this.repo.findByName(input.name)
    if (existing) throw new ConflictException(`Job config with name "${input.name}" already exists`)

    const now = new Date()
    const options: JobConfigOptions = {
      detectDeleted: input.options?.detectDeleted ?? true,
      auditChanges: input.options?.auditChanges ?? true,
    }
    if (input.options?.errorThreshold !== undefined) options.errorThreshold = input.options.errorThreshold
    if (input.options?.rateLimit !== undefined) options.rateLimit = input.options.rateLimit
    try {
      const doc = await this.repo.insert({
        name: input.name,
        description: input.description,
        enabled: input.enabled ?? true,
        source: input.source,
        schedule: input.schedule,
        identity: input.identity,
        options,
        credentialsRef: input.credentialsRef ? new ObjectId(input.credentialsRef) : undefined,
        createdAt: now,
        updatedAt: now,
        createdBy: input.createdBy,
      })
      this.emitChanged(doc._id)
      return this.toSummary(doc)
    } catch (err) {
      if (err instanceof MongoServerError && err.code === DUPLICATE_KEY) {
        throw new ConflictException(`Job config with name "${input.name}" already exists`)
      }
      throw err
    }
  }

  async update(id: ObjectId, input: UpdateJobConfigInput, expectedUpdatedAt?: Date): Promise<JobConfigSummary> {
    const repoUpdate: RepoUpdate = { set: {}, unset: [] }
    const set = repoUpdate.set as Record<string, unknown>

    // Fetch the current doc once if any field needs cross-checking against existing state.
    const needsExisting = input.options !== undefined || input.source !== undefined || input.identity !== undefined
    let existing: JobConfigDoc | null = null
    if (needsExisting) {
      existing = await this.repo.findById(id)
      if (!existing) throw new NotFoundException(`Job config ${id.toHexString()} not found`)
    }

    // Per-strategy identity validation runs against the COMBINED (new ∪ existing) state
    // so PATCH cannot leave the doc in an invalid configuration.
    if (input.source !== undefined || input.identity !== undefined) {
      validateJobConfigIdentity(input.source ?? existing!.source, input.identity ?? existing!.identity, this.logger)
    }

    if (input.name !== undefined) set.name = input.name
    if (input.source !== undefined) set.source = input.source
    if (input.schedule !== undefined) set.schedule = input.schedule
    if (input.identity !== undefined) set.identity = input.identity
    if (input.options !== undefined) {
      const merged: JobConfigOptions = {
        detectDeleted: input.options.detectDeleted ?? existing!.options.detectDeleted,
        auditChanges: input.options.auditChanges ?? existing!.options.auditChanges,
      }
      const errorThreshold = input.options.errorThreshold ?? existing!.options.errorThreshold
      if (errorThreshold !== undefined) merged.errorThreshold = errorThreshold
      const rateLimit = input.options.rateLimit ?? existing!.options.rateLimit
      if (rateLimit !== undefined) merged.rateLimit = rateLimit
      set.options = merged
    }
    if (input.description === null) repoUpdate.unset?.push('description')
    else if (input.description !== undefined) set.description = input.description

    if (input.credentialsRef === null) repoUpdate.unset?.push('credentialsRef')
    else if (input.credentialsRef !== undefined) set.credentialsRef = new ObjectId(input.credentialsRef)

    set.updatedAt = new Date()

    try {
      const doc = await this.repo.update(id, repoUpdate, expectedUpdatedAt)
      if (!doc) {
        // Disambiguate: stale optimistic-concurrency check vs truly missing doc.
        if (expectedUpdatedAt) {
          const current = await this.repo.findById(id)
          if (current) {
            throw new ConflictException(
              `updatedAt mismatch: expected ${expectedUpdatedAt.toISOString()} but stored value is ${current.updatedAt.toISOString()}`,
            )
          }
        }
        throw new NotFoundException(`Job config ${id.toHexString()} not found`)
      }
      this.emitChanged(doc._id)
      return this.toSummary(doc)
    } catch (err) {
      if (err instanceof MongoServerError && err.code === DUPLICATE_KEY) {
        throw new ConflictException(`Job config with name "${input.name ?? ''}" already exists`)
      }
      throw err
    }
  }

  async setEnabled(id: ObjectId, enabled: boolean): Promise<JobConfigSummary> {
    const doc = await this.repo.update(id, { set: { enabled, updatedAt: new Date() } })
    if (!doc) throw new NotFoundException(`Job config ${id.toHexString()} not found`)
    this.emitChanged(doc._id)
    return this.toSummary(doc)
  }

  /** Soft delete = disable. Hard removal is reserved for ops cleanup, not exposed via the standard DELETE endpoint. */
  async softDelete(id: ObjectId): Promise<JobConfigSummary> {
    return this.setEnabled(id, false)
  }

  /** Internal: invoked by SyncExecutor at run completion. Does NOT bump `updatedAt` — preserves optimistic-concurrency semantics for user edits. */
  async updateLastRun(id: ObjectId, run: UpdateLastRunInput): Promise<void> {
    const doc = await this.repo.update(id, {
      set: { lastRunId: run.lastRunId, lastRunStatus: run.lastRunStatus, lastRunAt: run.lastRunAt },
    })
    if (!doc) throw new NotFoundException(`Job config ${id.toHexString()} not found`)
  }

  async getById(id: ObjectId): Promise<JobConfigSummary> {
    const doc = await this.repo.findById(id)
    if (!doc) throw new NotFoundException(`Job config ${id.toHexString()} not found`)
    return this.toSummary(doc)
  }

  async list(filter: ListJobConfigsFilter): Promise<ListJobConfigsResult> {
    const { page, pageSize, skip, limit } = resolvePagination(filter)
    const { items, total } = await this.repo.list({
      enabled: filter.enabled,
      sourceType: filter.sourceType,
      skip,
      limit,
    })
    return { items: items.map((d) => this.toSummary(d)), total, page, pageSize }
  }

  /** Count of job configs that still reference a given secret. Drives the secret-delete guard. */
  async countReferencesToSecret(secretId: ObjectId): Promise<number> {
    return this.repo.countByCredentialsRef(secretId)
  }

  private toSummary(doc: JobConfigDoc): JobConfigSummary {
    return {
      id: doc._id.toHexString(),
      name: doc.name,
      description: doc.description,
      enabled: doc.enabled,
      source: doc.source,
      schedule: doc.schedule,
      identity: doc.identity,
      options: doc.options,
      credentialsRef: doc.credentialsRef?.toHexString(),
      lastRunId: doc.lastRunId?.toHexString(),
      lastRunStatus: doc.lastRunStatus,
      lastRunAt: doc.lastRunAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      createdBy: doc.createdBy,
    }
  }
}
