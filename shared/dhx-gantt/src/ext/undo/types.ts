export interface IUndoCommand {
  entity: TEntityType
  type: TActionType
  oldValue: any
  value: any
}
export interface IUndoCommands {
  commands: IUndoCommand[]
}

export type TActionType = 'update' | 'remove' | 'add' | 'move'
export type TEntityType = 'link' | 'task'
export type TUndoStack = IUndoCommands[]
export type TUndoValue = ITask | ILink
export type TBatchAction = null | IUndoCommands

export interface IInlineEditState {
  id: TaskID
  columnName: string
}

export interface IMonitor {
  isMoveEventsIgnored: () => boolean
  toggleIgnoreMoveEvents: (newValue?: boolean) => void
  startIgnore: () => void
  stopIgnore: () => void
  startBatchAction: () => void
  stopBatchAction: () => void
  onTaskAdded: (task: ITask) => void
  onTaskUpdated: (task: ITask) => void
  onTaskMoved: (task: ITask) => void
  onTaskDeleted: (task: ITask) => void
  onLinkAdded: (link: ILink) => void
  onLinkUpdated: (link: ILink) => void
  onLinkDeleted: (link: ILink) => void
  setNestedTasks: (id: TaskID, taskIds: TaskID[]) => void
  setInitialTask: (id: TaskID, overwrite?: boolean) => ITask
  getInitialTask: (id: TaskID) => ITask | object
  clearInitialTasks: () => void
  setInitialTaskObject: (id: TaskID, object: ITask) => void
  setInitialLink: (id: TaskID) => ILink
  getInitialLink: (id: TaskID) => ILink
  store: (id: TaskID | LinkID, type: TEntityType, overwrite: boolean) => boolean
}

export interface IUndo {
  maxSteps: number
  undoEnabled: boolean
  redoEnabled: boolean
  updateConfigs: () => void
  undo: () => void
  redo: () => void
  logAction: (action: IUndoCommands) => void
  getUndoStack: () => TUndoStack
  getRedoStack: () => TUndoStack
  clearUndoStack: () => void
  clearRedoStack: () => void
  action: IUndoPropAction
  command: IUndoPropCommand
}

export interface IUndoPropAction {
  create: (commands?: IUndoCommand[]) => IUndoCommands
  invert: (action: IUndoCommands) => IUndoCommands
}

export interface IUndoPropCommand {
  create: (value: TUndoValue, oldValue: TUndoValue, type: TActionType, entity: TEntityType) => IUndoCommand
  invert: (command: IUndoCommand) => IUndoCommand
  entity: any
  type: any
  inverseCommands: (command: TActionType) => TActionType
}
