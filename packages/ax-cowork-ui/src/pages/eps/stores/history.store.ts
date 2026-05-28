import { makeAutoObservable } from 'mobx'

export type HistoryEntry = {
  id: string
  group: 'Today' | 'Yesterday' | 'This Week'
  time: string
  type: 'commit' | 'replan' | 'tune' | 'import'
  actor: 'Sarah Chen' | 'AI' | 'system'
  label: string
  summary: string
  failed?: boolean
  canRevert?: boolean
}

const HISTORY: HistoryEntry[] = [
  { id: 'h1', group: 'Today', time: '06:18', type: 'commit', actor: 'Sarah Chen', label: 'Reroute ETC-44 → 07', summary: '12 lot moves', canRevert: true },
  { id: 'h2', group: 'Today', time: '06:04', type: 'replan', actor: 'AI', label: 'Yield Δ −1.4%', summary: '5 lot moves · Sarah approved' },
  { id: 'h3', group: 'Today', time: '04:48', type: 'replan', actor: 'AI', label: 'Qual expiry', summary: 'AI replan failed', failed: true },
  { id: 'h4', group: 'Yesterday', time: '18:22', type: 'commit', actor: 'Sarah Chen', label: 'End-of-day publish', summary: '47 lot moves', canRevert: true },
  { id: 'h5', group: 'Yesterday', time: '14:11', type: 'tune', actor: 'AI', label: 'SG-014 −8.2% HARC R-QLC-CH', summary: 'Sent to PE' },
]

export class HistoryStore {
  entries: HistoryEntry[] = HISTORY
  filter: 'all' | 'commit' | 'replan' | 'tune' | 'import' = 'all'

  constructor() {
    makeAutoObservable(this)
  }

  setFilter(f: 'all' | 'commit' | 'replan' | 'tune' | 'import') {
    this.filter = f
  }

  get filtered(): HistoryEntry[] {
    return this.filter === 'all' ? this.entries : this.entries.filter((e) => e.type === this.filter)
  }
}
