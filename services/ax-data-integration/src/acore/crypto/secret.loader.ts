import * as fs from 'fs'

import type { MasterKeyRing } from './secret.types'

export const MASTER_KEY_BYTES = 32

const KEY_NAME_PATTERN = /^INTEGRATION_MASTER_KEY_V(\d+)$/
const KEY_FILE_NAME_PATTERN = /^INTEGRATION_MASTER_KEY_V(\d+)_FILE$/

/**
 * Reads a master-key from a file path. Used by the `_FILE` env-var path (T2-A10) so the
 * key can live outside `.env` — Docker secret, Kubernetes secret, Vault Agent sink, etc.
 *
 * Failure modes: missing file, unreadable file, decoded length != {@link MASTER_KEY_BYTES}.
 * Error messages NEVER include the file contents.
 */
function readKeyFromFile(envName: string, filePath: string): Buffer {
  let raw: string
  try {
    raw = fs.readFileSync(filePath, 'utf8')
  } catch (err) {
    const code = (err as { code?: string }).code ?? 'UNKNOWN'
    throw new Error(`${envName} points at "${filePath}" which could not be read (${code})`)
  }
  // Allow trailing newline / surrounding whitespace — Docker secret files conventionally
  // end with `\n` and Kubernetes secret mounts can introduce CR/LF on Windows.
  const trimmed = raw.trim()
  if (trimmed.length === 0) {
    throw new Error(`${envName} points at "${filePath}" which is empty`)
  }
  const buf = Buffer.from(trimmed, 'base64')
  if (buf.length !== MASTER_KEY_BYTES) {
    throw new Error(`${envName} file content must decode to ${MASTER_KEY_BYTES} bytes (got ${buf.length})`)
  }
  return buf
}

/**
 * Scans the provided env for two parallel name patterns:
 *
 *  - `INTEGRATION_MASTER_KEY_V<N>` (base64 of 32 bytes) — env-var path
 *  - `INTEGRATION_MASTER_KEY_V<N>_FILE` (path to a file whose contents are base64 of 32 bytes) — file path
 *
 * For each version `<N>` it accepts EITHER one but never both: when both are set for the
 * same version, startup throws. The file path lets the master key live outside `.env`
 * (Docker secret, Kubernetes secret, Vault Agent — T2-A10) without a code change downstream.
 *
 * Throws if the current version is not present in the loaded ring, if any matching env
 * entry fails decoding / length validation, or if a file-path entry's file is unreadable.
 */
export function loadMasterKeyRing(env: NodeJS.ProcessEnv, currentVersion: number): MasterKeyRing {
  if (!Number.isInteger(currentVersion) || currentVersion < 1) {
    throw new Error(`INTEGRATION_MASTER_KEY_CURRENT must be a positive integer (got ${String(currentVersion)})`)
  }

  const fromEnv = new Map<number, Buffer>()
  const fromFile = new Map<number, Buffer>()

  for (const [name, value] of Object.entries(env)) {
    if (value == null || value.length === 0) continue
    const envMatch = KEY_NAME_PATTERN.exec(name)
    if (envMatch) {
      const version = Number(envMatch[1])
      const buf = Buffer.from(value, 'base64')
      if (buf.length !== MASTER_KEY_BYTES) {
        throw new Error(`${name} must decode to ${MASTER_KEY_BYTES} bytes (got ${buf.length})`)
      }
      fromEnv.set(version, buf)
      continue
    }
    const fileMatch = KEY_FILE_NAME_PATTERN.exec(name)
    if (fileMatch) {
      const version = Number(fileMatch[1])
      fromFile.set(version, readKeyFromFile(name, value))
    }
  }

  // Same version supplied via both channels → ambiguous, refuse to boot.
  for (const version of fromFile.keys()) {
    if (fromEnv.has(version)) {
      throw new Error(`INTEGRATION_MASTER_KEY_V${version} and INTEGRATION_MASTER_KEY_V${version}_FILE are both set — pick one source per version`)
    }
  }

  const keys = new Map<number, Buffer>([...fromEnv, ...fromFile])
  if (!keys.has(currentVersion)) {
    throw new Error(`INTEGRATION_MASTER_KEY_V${currentVersion} (the current key) is not loaded`)
  }

  return { currentVersion, keys }
}
