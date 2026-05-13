import { describe, it, expect } from 'vitest'
import { TaskStore, type Task } from './task.store'

describe('TaskStore', () => {
  it('seeds with 12 mock tasks on construction', () => {
    const store = new TaskStore()
    expect(store.items).toHaveLength(12)
    expect(store.items[0].id).toBe('t-1')
  })

  it('starts with loading=false and error=null', () => {
    const store = new TaskStore()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('setItems replaces the items array', () => {
    const store = new TaskStore()
    const next: Task[] = [{ id: 't-99', title: 'New task', status: 'todo', priority: 'P1' }]
    store.setItems(next)
    expect(store.items).toEqual(next)
  })

  it('setLoading and setError update flags', () => {
    const store = new TaskStore()
    store.setLoading(true)
    store.setError('boom')
    expect(store.loading).toBe(true)
    expect(store.error).toBe('boom')
  })
})
