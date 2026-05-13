import { makeAutoObservable } from 'mobx'

export type Comment = {
  id: string
  author: string
  initial: string
  body: string
  time: string
}

const mockComments: Comment[] = [
  {
    id: 'c1',
    author: 'Lela K.',
    initial: 'L',
    body: 'Re: PostgreSQL — agreed on the JSONB choice, but flag the partitioning story before we commit.',
    time: '2h',
  },
  { id: 'c2', author: 'Marcus W.', initial: 'M', body: '@Lela good call. Adding a sub-section on partition keys.', time: '1h' },
  { id: 'c3', author: 'Priya N.', initial: 'P', body: 'Should we add a row for object storage? S3 vs GCS came up earlier.', time: '38m' },
  { id: 'c4', author: 'Marcus W.', initial: 'M', body: 'Yes — pulling that into row 16. Will note egress cost as a tiebreaker.', time: '12m' },
]

export class CommentStore {
  items: Comment[] = mockComments
  loading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setItems(items: Comment[]) {
    this.items = items
  }

  setLoading(loading: boolean) {
    this.loading = loading
  }

  setError(error: string | null) {
    this.error = error
  }
}
