import { makeAutoObservable } from 'mobx'

export type TaskStatus = 'todo' | 'doing' | 'done'
export type TaskPriority = 'P1' | 'P2' | 'P3'

export type Task = {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
}

const mockTasks: Task[] = Array.from({ length: 12 }, (_, i) => ({
  id: `t-${i + 1}`,
  title: 'Sample task of change',
  status: i % 3 === 0 ? 'done' : i % 3 === 1 ? 'doing' : 'todo',
  priority: i % 2 === 0 ? 'P2' : 'P1',
}))

export class TaskStore {
  items: Task[] = mockTasks
  loading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setItems(items: Task[]) {
    this.items = items
  }

  setLoading(loading: boolean) {
    this.loading = loading
  }

  setError(error: string | null) {
    this.error = error
  }
}
