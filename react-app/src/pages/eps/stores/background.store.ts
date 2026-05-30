import { makeAutoObservable } from 'mobx'

export type BackgroundTask = {
  id: string
  label: string
  trigger?: string
  startedAt: string
  status: 'running' | 'success' | 'warning' | 'failed'
  progress?: number
  eta?: string
  duration?: string
  result?: string
  action?: string
}

const RUNNING: BackgroundTask[] = [
  { id: 't1', label: 'Replan', trigger: 'HARC PM', startedAt: '06:18', status: 'running', progress: 60, eta: '~12s' },
  { id: 't2', label: 'Simulation — Plan B build', startedAt: '06:14', status: 'running', progress: 92, eta: '~3s' },
]

const RECENT: BackgroundTask[] = [
  { id: 'r1', label: 'Replan', trigger: 'yield Δ', startedAt: '06:04', status: 'success', duration: '41s', result: '12 moves', action: 'Open in Compare' },
  { id: 'r2', label: 'Export CSV', startedAt: '05:51', status: 'success', duration: '8s', action: 'Download' },
  { id: 'r3', label: 'Sync SAP', startedAt: '05:30', status: 'success', duration: '1.4s' },
  { id: 'r4', label: 'Sync KLA Yield', startedAt: '05:15', status: 'warning', duration: '16 min', result: 'delay (retry…)' },
  { id: 'r5', label: 'Replan', startedAt: '04:48', status: 'failed', result: 'qual matrix inconsistency', action: 'View logs' },
]

export class BackgroundTasksStore {
  running: BackgroundTask[] = RUNNING
  recent: BackgroundTask[] = RECENT

  constructor() {
    makeAutoObservable(this)
  }
}
