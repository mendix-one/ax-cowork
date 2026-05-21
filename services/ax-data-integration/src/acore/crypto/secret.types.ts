/** DI token for the loaded master-key ring. Resolved by {@link loadMasterKeyRing}. */
export const MASTER_KEY_RING = Symbol('MASTER_KEY_RING')

/**
 * Set of master keys available to this process, plus the version used for new encryptions.
 * Every key is a 32-byte buffer (AES-256). Older versions are kept loaded so previously
 * encrypted secrets remain decryptable until rotation re-encrypts them.
 */
export interface MasterKeyRing {
  currentVersion: number
  keys: ReadonlyMap<number, Buffer>
}

/** Wire format for a stored secret. All byte fields are base64-encoded. */
export interface EncryptedPayload {
  iv: string
  authTag: string
  ciphertext: string
  keyVersion: number
}
