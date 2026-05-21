import { MASTER_KEY_BYTES } from './secret.loader'
import { SecretService } from './secret.service'
import type { MasterKeyRing } from './secret.types'

function buildRing(current: number, versions: number[]): MasterKeyRing {
  const keys = new Map<number, Buffer>()
  for (const v of versions) keys.set(v, Buffer.alloc(MASTER_KEY_BYTES, v))
  return { currentVersion: current, keys }
}

describe('SecretService', () => {
  it('round-trips arbitrary UTF-8 plaintext through encrypt + decrypt', () => {
    const svc = new SecretService(buildRing(1, [1]))
    for (const plaintext of ['', 'simple', 'với tiếng việt 🚀', JSON.stringify({ a: 1, b: [true, null] })]) {
      const enc = svc.encrypt(plaintext)
      expect(svc.decrypt(enc)).toBe(plaintext)
    }
  })

  it('produces different ciphertext for the same plaintext on each call (random IV)', () => {
    const svc = new SecretService(buildRing(1, [1]))
    const a = svc.encrypt('same')
    const b = svc.encrypt('same')
    expect(a.iv).not.toBe(b.iv)
    expect(a.ciphertext).not.toBe(b.ciphertext)
    expect(svc.decrypt(a)).toBe('same')
    expect(svc.decrypt(b)).toBe('same')
  })

  it('stamps payloads with the current key version', () => {
    const svc = new SecretService(buildRing(7, [7]))
    expect(svc.encrypt('x').keyVersion).toBe(7)
    expect(svc.currentVersion).toBe(7)
  })

  it('decrypts payloads encrypted under any loaded prior key version (rotation support)', () => {
    const v1Svc = new SecretService(buildRing(1, [1]))
    const enc = v1Svc.encrypt('legacy-value')

    // After rotation: V2 is current, but V1 is still loaded so older payloads decrypt.
    const rotatedSvc = new SecretService(buildRing(2, [1, 2]))
    expect(rotatedSvc.decrypt(enc)).toBe('legacy-value')
    expect(rotatedSvc.encrypt('new-value').keyVersion).toBe(2)
  })

  it('throws when the payload references a key version that is not loaded', () => {
    const svc = new SecretService(buildRing(1, [1]))
    const enc = svc.encrypt('value')
    const orphan = { ...enc, keyVersion: 99 }
    expect(() => svc.decrypt(orphan)).toThrow(/version 99 is not loaded/)
  })

  it('throws when the ciphertext is tampered with', () => {
    const svc = new SecretService(buildRing(1, [1]))
    const enc = svc.encrypt('value')
    const tamperedBytes = Buffer.from(enc.ciphertext, 'base64')
    tamperedBytes[0] ^= 0xff
    const tampered = { ...enc, ciphertext: tamperedBytes.toString('base64') }
    expect(() => svc.decrypt(tampered)).toThrow()
  })

  it('throws when the auth tag is tampered with', () => {
    const svc = new SecretService(buildRing(1, [1]))
    const enc = svc.encrypt('value')
    const tagBytes = Buffer.from(enc.authTag, 'base64')
    tagBytes[0] ^= 0xff
    const tampered = { ...enc, authTag: tagBytes.toString('base64') }
    expect(() => svc.decrypt(tampered)).toThrow()
  })

  it('throws when decrypting with the wrong key (different ring, same version number)', () => {
    const ringA = buildRing(1, [1]) // key = byte 0x01
    const ringB: MasterKeyRing = { currentVersion: 1, keys: new Map([[1, Buffer.alloc(MASTER_KEY_BYTES, 0x02)]]) }
    const encWithA = new SecretService(ringA).encrypt('value')
    expect(() => new SecretService(ringB).decrypt(encWithA)).toThrow()
  })

  it('emits an envelope with exactly the documented shape — contract test for storage format', () => {
    // Pinning the encrypted envelope shape: any change here is a storage-format break that
    // affects every secret already at rest. Bump the schema (and write a migration) intentionally.
    const enc = new SecretService(buildRing(1, [1])).encrypt('value')
    expect(Object.keys(enc).sort()).toEqual(['authTag', 'ciphertext', 'iv', 'keyVersion'])
    expect(typeof enc.ciphertext).toBe('string')
    expect(typeof enc.iv).toBe('string')
    expect(typeof enc.authTag).toBe('string')
    expect(enc.keyVersion).toBe(1)
    // GCM uses a 12-byte IV → 16 base64 chars; auth tag is 16 bytes → 24 base64 chars (incl. padding).
    expect(Buffer.from(enc.iv, 'base64')).toHaveLength(12)
    expect(Buffer.from(enc.authTag, 'base64')).toHaveLength(16)
  })
})
