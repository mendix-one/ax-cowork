import { createHash } from 'crypto'
import { Readable } from 'stream'

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import type { ObjectId } from 'mongodb'

import { GridfsService } from '../../acore/mongo'
import { JobConfigRepository } from '../job-config/job-config.repository'
import { SourceFileRepository } from './source-file.repository'
import type { SourceFileDoc, SourceFileSummary } from './source-file.schema'

export interface UploadSourceFileInput {
  fileName: string
  contentType: string
  size: number
  content: Buffer
  uploadedBy: string
}

@Injectable()
export class SourceFilesService {
  constructor(
    private readonly repo: SourceFileRepository,
    private readonly gridfs: GridfsService,
    private readonly jobConfigs: JobConfigRepository,
  ) {}

  /**
   * Uploads a file to GridFS and records its metadata. If a file with the same sha256
   * checksum already exists, returns the existing metadata (no GridFS duplication).
   */
  async upload(input: UploadSourceFileInput): Promise<SourceFileSummary> {
    const checksum = createHash('sha256').update(input.content).digest('hex')

    const existing = await this.repo.findByChecksum(checksum)
    if (existing) return this.toSummary(existing)

    const gridFsFile = await this.gridfs.upload(Readable.from(input.content), input.fileName, {
      contentType: input.contentType,
      checksum,
    })

    const now = new Date()
    const doc = await this.repo.insert({
      fileName: input.fileName,
      contentType: input.contentType,
      size: input.size,
      checksum,
      gridFsFileId: gridFsFile._id,
      uploadedBy: input.uploadedBy,
      uploadedAt: now,
      createdAt: now,
    })
    return this.toSummary(doc)
  }

  async getById(id: ObjectId): Promise<SourceFileSummary> {
    const doc = await this.repo.findById(id)
    if (!doc) throw new NotFoundException(`Source file ${id.toHexString()} not found`)
    return this.toSummary(doc)
  }

  async list(): Promise<SourceFileSummary[]> {
    const docs = await this.repo.list()
    return docs.map((d) => this.toSummary(d))
  }

  /** Returns the metadata doc + a readable stream of the GridFS content. */
  async openDownload(id: ObjectId): Promise<{ meta: SourceFileDoc; stream: Readable }> {
    const doc = await this.repo.findById(id)
    if (!doc) throw new NotFoundException(`Source file ${id.toHexString()} not found`)
    return { meta: doc, stream: this.gridfs.download(doc.gridFsFileId) }
  }

  /** Rejects with 409 when any job_config still references the file via `source.config.sourceFileId`. */
  async delete(id: ObjectId): Promise<void> {
    const doc = await this.repo.findById(id)
    if (!doc) throw new NotFoundException(`Source file ${id.toHexString()} not found`)

    const refs = await this.jobConfigs.countBySourceFileRef(id)
    if (refs > 0) {
      throw new ConflictException(`Source file cannot be deleted: ${refs} job_config(s) still reference it`)
    }

    await this.gridfs.delete(doc.gridFsFileId)
    await this.repo.deleteById(id)
  }

  private toSummary(doc: SourceFileDoc): SourceFileSummary {
    return {
      id: doc._id.toHexString(),
      fileName: doc.fileName,
      contentType: doc.contentType,
      size: doc.size,
      checksum: doc.checksum,
      uploadedBy: doc.uploadedBy,
      uploadedAt: doc.uploadedAt,
      createdAt: doc.createdAt,
    }
  }
}
