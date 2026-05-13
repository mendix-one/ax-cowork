import { makeAutoObservable } from 'mobx'
import { readJson, writeJson } from '@/acore/storage'

export type User = {
  id: string
  name: string
  email: string
}

const STORAGE_KEY = 'ax-auth-user'

function isUser(v: unknown): v is User {
  if (typeof v !== 'object' || v === null) return false
  const u = v as Record<string, unknown>
  return typeof u.id === 'string' && typeof u.name === 'string' && typeof u.email === 'string'
}

export class AuthStore {
  currentUser: User | null = readJson(STORAGE_KEY, isUser)
  loading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get isAuthed(): boolean {
    return this.currentUser !== null
  }

  setUser(user: User | null) {
    this.currentUser = user
    writeJson(STORAGE_KEY, user)
  }

  setLoading(loading: boolean) {
    this.loading = loading
  }

  setError(error: string | null) {
    this.error = error
  }

  logout() {
    this.currentUser = null
    this.error = null
    writeJson(STORAGE_KEY, null)
  }
}
