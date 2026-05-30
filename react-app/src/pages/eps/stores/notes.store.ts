import { makeAutoObservable } from 'mobx'
import { readJson, writeJson } from '@/acore/storage'

// Free-text planner notes keyed by node identifier. Notes are persisted to localStorage so they survive
// reload (cross-shift handoff). The keying scheme is intentionally aligned with the PO panel's row keys
// so a row can pass its own key in without any translation:
//   "po::<poId>" / "family::<familyId>" / "batch::<familyId>::<batchId>"
// Plus a "tool::<groupName>" key for the Shop Floor panel.

const STORAGE_KEY = 'ax.simulation.notes.v1'

type PersistedNotes = Record<string, string>

const isPersistedNotes = (v: unknown): v is PersistedNotes => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof k !== 'string' || typeof val !== 'string') return false
  }
  return true
}

export class NotesStore {
  // Map kept as a plain object for clean JSON serialization; MobX still tracks the field reassignment.
  private notes: PersistedNotes = readJson(STORAGE_KEY, isPersistedNotes) ?? {}

  constructor() {
    makeAutoObservable(this)
  }

  get(key: string): string {
    return this.notes[key] ?? ''
  }

  has(key: string): boolean {
    return !!this.notes[key] && this.notes[key].trim().length > 0
  }

  set(key: string, value: string) {
    const trimmed = value.trim()
    // Avoid storing empty strings — equivalent to "no note".
    if (trimmed.length === 0) {
      const next = { ...this.notes }
      delete next[key]
      this.notes = next
    } else {
      this.notes = { ...this.notes, [key]: value }
    }
    writeJson(STORAGE_KEY, this.notes)
  }

  clear(key: string) {
    this.set(key, '')
  }
}
