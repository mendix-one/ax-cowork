import { describe, it, expect } from 'vitest'
import { AuthStore } from './auth.store'

const STORAGE_KEY = 'ax-auth-user'

describe('AuthStore', () => {
  it('hydrates currentUser from localStorage on construction', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: '1', name: 'Lan', email: 'lan@ax.io' }))
    const store = new AuthStore()
    expect(store.currentUser).toEqual({ id: '1', name: 'Lan', email: 'lan@ax.io' })
    expect(store.isAuthed).toBe(true)
  })

  it('starts with null user when localStorage is empty', () => {
    const store = new AuthStore()
    expect(store.currentUser).toBeNull()
    expect(store.isAuthed).toBe(false)
  })

  it('ignores corrupted localStorage and starts with null', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    const store = new AuthStore()
    expect(store.currentUser).toBeNull()
  })

  it('setUser updates state and persists to localStorage', () => {
    const store = new AuthStore()
    store.setUser({ id: '2', name: 'Min', email: 'min@ax.io' })
    expect(store.isAuthed).toBe(true)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ id: '2', name: 'Min', email: 'min@ax.io' })
  })

  it('logout clears state and removes localStorage key', () => {
    const store = new AuthStore()
    store.setUser({ id: '3', name: 'Joon', email: 'joon@ax.io' })
    store.setError('old error')
    store.logout()
    expect(store.currentUser).toBeNull()
    expect(store.error).toBeNull()
    expect(store.isAuthed).toBe(false)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
