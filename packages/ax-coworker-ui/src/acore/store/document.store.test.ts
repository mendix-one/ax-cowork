import { describe, it, expect } from 'vitest'
import { DocumentStore, type Doc } from './document.store'

const STORAGE_KEY = 'ax-documents'

// src/test/setup.ts clears localStorage in beforeEach, so each test starts clean.

describe('DocumentStore', () => {
  it('seeds with the demo doc when localStorage is empty', () => {
    const store = new DocumentStore()
    const demo = store.getById('demo')
    expect(demo).toBeDefined()
    expect(demo!.title).toBe('Q1 status report')
  })

  it('hydrates from localStorage when a valid persisted array exists', () => {
    const stored: Doc[] = [{ id: 'x', title: 'Other', source: '# x', updatedAt: 1 }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    const store = new DocumentStore()
    expect(store.getById('x')?.title).toBe('Other')
    // Persisted array wins → demo seed is NOT injected on top.
    expect(store.getById('demo')).toBeUndefined()
  })

  it('falls back to seed when localStorage payload fails the type guard', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 'x' /* missing fields */ }]))
    const store = new DocumentStore()
    expect(store.getById('demo')).toBeDefined()
  })

  it('falls back to seed when localStorage is corrupted', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    const store = new DocumentStore()
    expect(store.getById('demo')).toBeDefined()
  })

  it('setSource updates the doc and persists the whole array', () => {
    const store = new DocumentStore()
    const before = store.getById('demo')!.updatedAt
    store.setSource('demo', '# brand new content')

    const after = store.getById('demo')!
    expect(after.source).toBe('# brand new content')
    expect(after.updatedAt).toBeGreaterThanOrEqual(before)

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as Doc[]
    expect(persisted.find((d) => d.id === 'demo')?.source).toBe('# brand new content')
  })

  it('setSource is a no-op for an unknown id', () => {
    const store = new DocumentStore()
    store.setSource('nope', 'whatever')
    expect(store.getById('nope')).toBeUndefined()
    // Nothing should have been persisted because there was nothing to mutate.
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
