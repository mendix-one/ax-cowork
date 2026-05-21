import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { MongoServerError, ObjectId } from 'mongodb'

import { SecretService as CryptoSecretService } from '../../acore/crypto'
import { JobConfigRepository } from '../job-config'
import { SecretRepository } from './secret.repository'
import type { SecretDoc, SecretSummary, SecretType } from './secret.schema'

export interface CreateSecretInput {
  name: string
  type: SecretType
  plaintext: string
  createdBy: string
}

export interface UpdateSecretInput {
  name?: string
  type?: SecretType
  plaintext?: string
}

const DUPLICATE_KEY = 11000

@Injectable()
export class SecretsService {
  constructor(
    private readonly repo: SecretRepository,
    private readonly crypto: CryptoSecretService,
    private readonly jobConfigs: JobConfigRepository,
  ) {}

  async create(input: CreateSecretInput): Promise<SecretSummary> {
    const existing = await this.repo.findByName(input.name)
    if (existing) {
      throw new ConflictException(`Secret with name "${input.name}" already exists`)
    }
    const now = new Date()
    const encrypted = this.crypto.encrypt(input.plaintext)
    try {
      const doc = await this.repo.insert({
        name: input.name,
        type: input.type,
        encrypted,
        createdAt: now,
        updatedAt: now,
        createdBy: input.createdBy,
      })
      return this.toSummary(doc)
    } catch (err) {
      // Unique-name race lost to a concurrent insert.
      if (err instanceof MongoServerError && err.code === DUPLICATE_KEY) {
        throw new ConflictException(`Secret with name "${input.name}" already exists`)
      }
      throw err
    }
  }

  async update(id: ObjectId, input: UpdateSecretInput): Promise<SecretSummary> {
    if (!input.name && !input.type && input.plaintext == null) {
      // No-op update — just return current state.
      return this.getById(id)
    }
    const now = new Date()
    const update: Parameters<SecretRepository['updateById']>[1] = { updatedAt: now }
    if (input.name) update.name = input.name
    if (input.type) update.type = input.type
    if (input.plaintext != null) update.encrypted = this.crypto.encrypt(input.plaintext)

    try {
      const doc = await this.repo.updateById(id, update)
      if (!doc) throw new NotFoundException(`Secret ${id.toHexString()} not found`)
      return this.toSummary(doc)
    } catch (err) {
      if (err instanceof MongoServerError && err.code === DUPLICATE_KEY) {
        throw new ConflictException(`Secret with name "${input.name ?? ''}" already exists`)
      }
      throw err
    }
  }

  /** Rejects with 409 when any job_config still references the secret via `credentialsRef`. */
  async delete(id: ObjectId): Promise<void> {
    const refs = await this.jobConfigs.countByCredentialsRef(id)
    if (refs > 0) {
      throw new ConflictException(`Secret cannot be deleted: ${refs} job_config(s) still reference it`)
    }
    const ok = await this.repo.deleteById(id)
    if (!ok) throw new NotFoundException(`Secret ${id.toHexString()} not found`)
  }

  async list(): Promise<SecretSummary[]> {
    const docs = await this.repo.list()
    return docs.map((d) => this.toSummary(d))
  }

  async getById(id: ObjectId): Promise<SecretSummary> {
    const doc = await this.repo.findById(id)
    if (!doc) throw new NotFoundException(`Secret ${id.toHexString()} not found`)
    return this.toSummary(doc)
  }

  /**
   * Decrypts and returns the plaintext for one secret. INTERNAL USE ONLY — must never
   * be exposed through an HTTP route. Adapters call this immediately before connecting
   * to an external source; the returned value must not be cached or logged.
   */
  async revealPlaintext(id: ObjectId): Promise<string> {
    const doc = await this.repo.findById(id)
    if (!doc) throw new NotFoundException(`Secret ${id.toHexString()} not found`)
    return this.crypto.decrypt(doc.encrypted)
  }

  private toSummary(doc: SecretDoc): SecretSummary {
    return {
      id: doc._id.toHexString(),
      name: doc.name,
      type: doc.type,
      keyVersion: doc.encrypted.keyVersion,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      createdBy: doc.createdBy,
    }
  }
}
