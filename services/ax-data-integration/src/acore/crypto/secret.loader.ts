import type { MasterKeyRing } from './secret.types'

export const MASTER_KEY_BYTES = 32

const KEY_NAME_PATTERN = /^INTEGRATION_MASTER_KEY_V(\d+)$/

/**
 * Scans the provided env for `INTEGRATION_MASTER_KEY_V<N>` entries, decodes them as
 * base64, validates each is exactly {@link MASTER_KEY_BYTES} bytes, and returns a
 * {@link MasterKeyRing} pointing at the requested current version.
 *
 * Throws if the current version is not present in the loaded ring, or if any matching
 * env entry fails decoding / length validation.
 */
export function loadMasterKeyRing(env: NodeJS.ProcessEnv, currentVersion: number): MasterKeyRing {
  if (!Number.isInteger(currentVersion) || currentVersion < 1) {
    throw new Error(`INTEGRATION_MASTER_KEY_CURRENT must be a positive integer (got ${String(currentVersion)})`)
  }

  const keys = new Map<number, Buffer>()
  for (const [name, value] of Object.entries(env)) {
    const match = KEY_NAME_PATTERN.exec(name)
    if (!match || value == null || value.length === 0) continue
    const version = Number(match[1])
    const buf = Buffer.from(value, 'base64')
    if (buf.length !== MASTER_KEY_BYTES) {
      throw new Error(`${name} must decode to ${MASTER_KEY_BYTES} bytes (got ${buf.length})`)
    }
    keys.set(version, buf)
  }

  if (!keys.has(currentVersion)) {
    throw new Error(`INTEGRATION_MASTER_KEY_V${currentVersion} (the current key) is not loaded`)
  }

  return { currentVersion, keys }
}
