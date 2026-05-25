import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

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

  describe('T2-A10 — _FILE env var path', () => {
    let tmpDir: string

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ax-secret-loader-'))
    })

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    })

    function writeKeyFile(name: string, content: string): string {
      const filePath = path.join(tmpDir, name)
      fs.writeFileSync(filePath, content)
      return filePath
    }

    it('reads the key from a file when _FILE is set', () => {
      const filePath = writeKeyFile('master_v1.b64', validKey(0x42))
      const ring = loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1_FILE: filePath }, 1)
      expect(ring.keys.get(1)?.equals(Buffer.alloc(MASTER_KEY_BYTES, 0x42))).toBe(true)
    })

    it('accepts a file with a trailing newline (Docker secret convention)', () => {
      const filePath = writeKeyFile('master_v1_nl.b64', validKey(0x55) + '\n')
      const ring = loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1_FILE: filePath }, 1)
      expect(ring.keys.get(1)?.equals(Buffer.alloc(MASTER_KEY_BYTES, 0x55))).toBe(true)
    })

    it('mixes env-var and file-var sources across different versions', () => {
      const filePath = writeKeyFile('master_v2.b64', validKey(0x99))
      const ring = loadMasterKeyRing(
        {
          INTEGRATION_MASTER_KEY_V1: validKey(0x11),
          INTEGRATION_MASTER_KEY_V2_FILE: filePath,
        },
        2,
      )
      expect(ring.keys.size).toBe(2)
      expect(ring.currentVersion).toBe(2)
      expect(ring.keys.get(1)?.[0]).toBe(0x11)
      expect(ring.keys.get(2)?.[0]).toBe(0x99)
    })

    it('throws when both env-var and file-var are set for the same version', () => {
      const filePath = writeKeyFile('master_v1_dup.b64', validKey(0xaa))
      expect(() =>
        loadMasterKeyRing(
          {
            INTEGRATION_MASTER_KEY_V1: validKey(0x01),
            INTEGRATION_MASTER_KEY_V1_FILE: filePath,
          },
          1,
        ),
      ).toThrow(/V1 and INTEGRATION_MASTER_KEY_V1_FILE are both set/)
    })

    it('throws with a clear message when the file is missing (does not leak path internals beyond the configured value)', () => {
      const missing = path.join(tmpDir, 'no-such-file.b64')
      expect(() => loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1_FILE: missing }, 1)).toThrow(/INTEGRATION_MASTER_KEY_V1_FILE points at/)
      // The thrown error mentions the configured path (the operator already knows it from env)
      // but never the file contents.
    })

    it('throws when the file is empty', () => {
      const filePath = writeKeyFile('empty.b64', '')
      expect(() => loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1_FILE: filePath }, 1)).toThrow(/is empty/)
    })

    it('throws when the file content decodes to the wrong length (does not include the bytes in the error)', () => {
      const shortB64 = Buffer.alloc(16, 0xff).toString('base64')
      const filePath = writeKeyFile('short.b64', shortB64)
      const err = (() => {
        try {
          loadMasterKeyRing({ INTEGRATION_MASTER_KEY_V1_FILE: filePath }, 1)
          return null
        } catch (e) {
          return e instanceof Error ? e : new Error(String(e))
        }
      })()
      expect(err?.message).toMatch(/must decode to 32 bytes \(got 16\)/)
      expect(err?.message).not.toContain(shortB64)
    })
  })
})
