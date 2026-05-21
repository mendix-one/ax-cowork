import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

import { Inject, Injectable } from '@nestjs/common'

import { MASTER_KEY_RING } from './secret.types'
import type { EncryptedPayload, MasterKeyRing } from './secret.types'

const ALGORITHM = 'aes-256-gcm'
const IV_BYTES = 12 // 96 bits — recommended for GCM

@Injectable()
export class SecretService {
  constructor(@Inject(MASTER_KEY_RING) private readonly ring: MasterKeyRing) {}

  /** Encrypts UTF-8 plaintext using the current master key. IV is freshly random per call. */
  encrypt(plaintext: string): EncryptedPayload {
    const key = this.requireKey(this.ring.currentVersion)
    const iv = randomBytes(IV_BYTES)
    const cipher = createCipheriv(ALGORITHM, key, iv)
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
    const authTag = cipher.getAuthTag()
    return {
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      ciphertext: ciphertext.toString('base64'),
      keyVersion: this.ring.currentVersion,
    }
  }

  /** Decrypts a previously-encrypted payload. Throws on unknown key version, tamper, or wrong key. */
  decrypt(payload: EncryptedPayload): string {
    const key = this.requireKey(payload.keyVersion)
    const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(payload.iv, 'base64'))
    decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'))
    const plaintext = Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, 'base64')), decipher.final()])
    return plaintext.toString('utf8')
  }

  /** The key version used for any new encryption. Useful for re-encrypt / rotation tooling. */
  get currentVersion(): number {
    return this.ring.currentVersion
  }

  private requireKey(version: number): Buffer {
    const key = this.ring.keys.get(version)
    if (!key) {
      throw new Error(`Master key version ${version} is not loaded`)
    }
    return key
  }
}
