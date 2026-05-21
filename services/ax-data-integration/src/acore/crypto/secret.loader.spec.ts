import { MASTER_KEY_BYTES, loadMasterKeyRing } from './secret.loader'

const validKey = (byte: number): string => Buffer.alloc(MASTER_KEY_BYTES, byte).toString('base64')

describe('loadMasterKeyRing', () => {
  it('loads every INTEGRATION_MASTER_KEY_V<N> entry and selects the current one', () => {
    const ring = loadMasterKeyRing(
      {
        INTEGRATION_MASTER_KEY_V1: validKey(0x01),
        INTEGRATION_MASTER_KEY_V2: validKey(0x02),
        UNRELATED: 'ignored',
      },
      2,
    )
    expect(ring.currentVersion).toBe(2)
    expect(ring.keys.size).toBe(2)
    expect(ring.keys.get(1)?.equals(Buffer.alloc(MASTER_KEY_BYTES, 0x01))).toBe(true)
    expect(ring.keys.get(2)?.equals(Buffer.alloc(MASTER_KEY_BYTES, 0x02))).toBe(true)
  })

  it('throws when currentVersion is not a positive integer', () => {
    expect(() => loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1: validKey(0x01) }, 0)).toThrow(/positive integer/)
    expect(() => loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1: validKey(0x01) }, 1.5)).toThrow(/positive integer/)
  })

  it('throws when the current key is not present in the env', () => {
    expect(() => loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1: validKey(0x01) }, 2)).toThrow(/V2 \(the current key\) is not loaded/)
  })

  it('throws when a key decodes to the wrong byte length', () => {
    const short = Buffer.alloc(16, 0xff).toString('base64')
    expect(() => loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1: short }, 1)).toThrow(/must decode to 32 bytes \(got 16\)/)
  })

  it('ignores empty values, non-matching names, and non-integer suffixes', () => {
    const ring = loadMasterKeyRing(
      {
        INTEGRATION_MASTER_KEY_V1: validKey(0x01),
        INTEGRATION_MASTER_KEY_V2: '',
        INTEGRATION_MASTER_KEY_VA: validKey(0x02),
        INTEGRATION_MASTER_KEY_OTHER: validKey(0x03),
      },
      1,
    )
    expect(ring.keys.size).toBe(1)
    expect(ring.keys.has(1)).toBe(true)
  })
})
