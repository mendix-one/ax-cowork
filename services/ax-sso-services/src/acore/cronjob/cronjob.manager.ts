import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'

import { Cronjob } from '../database/schemas/cronjob.schema'

@Injectable()
export class CronjobManager {
  constructor(@InjectModel(Cronjob.name) private readonly cronjobModel: Model<Cronjob>) {}

  // Queue a new job in READY state.
  // When `checkDuplicated` is true and a job with the same `name` already exists, returns that existing
  // job instead of inserting a duplicate. Useful for idempotent enqueueing from schedulers.
  async create(name: string, parameters: Record<string, unknown> = {}, checkDuplicated = false): Promise<Cronjob> {
    if (checkDuplicated) {
      const existing = await this.cronjobModel.findOne({ name }).lean<Cronjob>().exec()
      if (existing) return existing
    }
    const doc = await this.cronjobModel.create({
      name,
      parameters,
      status: 'READY',
      retries: 0,
      issuedAt: new Date(),
    })
    return doc.toObject()
  }

  // Returns jobs eligible for pickup: READY (never run) and INTERRUPTED (mid-run failure).
  // `limit` is the max-retries cap — jobs whose `retries` exceeds it are considered exhausted and skipped.
  // Sorted by `issuedAt` ascending so older jobs go first (fair queue).
  async scan(limit = 5): Promise<Cronjob[]> {
    return this.cronjobModel
      .find({ status: { $in: ['READY', 'INTERRUPTED'] }, retries: { $lte: limit } })
      .sort({ issuedAt: 1 })
      .lean<Cronjob[]>()
      .exec()
  }

  // Picks the job up for execution. Only succeeds when its current status is READY or INTERRUPTED;
  // any other status (PROCESSING / COMPLETED / ABORTED) is a no-op and the caller gets `undefined`.
  // Each successful start increments `retries` so the counter doubles as "attempt #".
  async start(uuid: string): Promise<Cronjob | undefined> {
    const updated = await this.cronjobModel
      .findOneAndUpdate(
        { uuid, status: { $in: ['READY', 'INTERRUPTED'] } },
        { $set: { status: 'PROCESSING', startedAt: new Date() }, $inc: { retries: 1 } },
        { new: true },
      )
      .lean<Cronjob>()
      .exec()
    return updated ?? undefined
  }

  async complete(uuid: string): Promise<Cronjob> {
    return this.updateOrThrow(uuid, { $set: { status: 'COMPLETED', completedAt: new Date() } })
  }

  async abort(uuid: string, remark: string): Promise<Cronjob> {
    return this.updateOrThrow(uuid, { $set: { status: 'ABORTED', remark, completedAt: new Date() } })
  }

  // Interrupt = mid-run failure. Increments retry count so the next `scan()` can decide whether to re-run.
  async interrupt(uuid: string, errorMessage: string): Promise<Cronjob> {
    return this.updateOrThrow(uuid, {
      $set: { status: 'INTERRUPTED', message: errorMessage },
      $inc: { retries: 1 },
    })
  }

  private async updateOrThrow(uuid: string, update: Record<string, unknown>): Promise<Cronjob> {
    const updated = await this.cronjobModel.findOneAndUpdate({ uuid }, update, { new: true }).lean<Cronjob>().exec()
    if (!updated) throw new NotFoundException(`Cronjob ${uuid} not found`)
    return updated
  }
}
