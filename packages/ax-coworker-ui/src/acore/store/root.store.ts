import { AuthStore } from './auth.store'
import { UiStore } from './ui.store'
import { TaskStore } from './task.store'
import { DocumentStore } from './document.store'
import { CommentStore } from './comment.store'

export class RootStore {
  auth = new AuthStore()
  ui = new UiStore()
  tasks = new TaskStore()
  documents = new DocumentStore()
  comments = new CommentStore()
}

export const rootStore = new RootStore()
