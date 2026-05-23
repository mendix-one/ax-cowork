import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import type { HydratedDocument } from 'mongoose'
import { v7 as uuidv7 } from 'uuid'

export type CronjobDocument = HydratedDocument<Cronjob>

export const CRONJOB_STATUSES = ['READY', 'PROCESSING', 'COMPLETED', 'ABORTED', 'INTERRUPTED'] as const
export type CronjobStatus = (typeof CRONJOB_STATUSES)[number]

@Schema({ collection: 'cronjobs', timestamps: true })
export class Cronjob {
  // UUIDv7 — time-ordered, sortable, stable external identifier for this job.
  @Prop({ required: true, unique: true, index: true, default: () => uuidv7() })
    uuid!: string

  // UUID of the parent cronjob, when this run was spawned by another. Null for root jobs.
  @Prop({ index: true })
    parent?: string

  @Prop({ required: true, index: true })
    name!: string

  @Prop({ type: String, required: true, enum: CRONJOB_STATUSES, default: 'READY', index: true })
    status!: CronjobStatus

  @Prop({ required: true, default: 0 })
    retries!: number

  // Free-form parameter bag — adapter-specific shape, not validated at the schema layer.
  @Prop({ type: Object, default: {} })
    parameters?: Record<string, unknown>

  @Prop()
    message?: string

  @Prop()
    remark?: string

  // When the job was queued.
  @Prop({ required: true, index: true })
    issuedAt!: Date

  // When the worker actually picked the job up.
  @Prop()
    startedAt?: Date

  // When the worker finished (regardless of terminal status).
  @Prop()
    completedAt?: Date

  // Populated automatically by `timestamps: true` on the @Schema decorator —
  // declared here so they show on the TypeScript surface.
  @Prop()
    createdAt?: Date

  @Prop()
    updatedAt?: Date
}

export const CronjobSchema = SchemaFactory.createForClass(Cronjob)
