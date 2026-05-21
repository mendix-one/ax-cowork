import { IInlineEditState, IMonitor, IUndo, IUndoCommand, TActionType, TEntityType, TUndoValue } from './types'

const noTrack = {
  onBeforeUndo: 'onAfterUndo',
  onBeforeRedo: 'onAfterRedo',
}

const batchActions = ['onTaskDragStart', 'onAfterTaskUpdate', 'onAfterParentExpand', 'onAfterTaskDelete', 'onBeforeBatchUpdate']

export class Monitor implements IMonitor {
  private _batchAction = null
  private _batchMode = false
  private _ignore = false
  private _ignoreMoveEvents = false
  private _initialTasks = {}
  private _initialLinks = {}
  private _nestedTasks = {}
  private _nestedLinks = {}
  private _timeout
  private _gantt: any
  private _undo: IUndo

  constructor(undo: IUndo, gantt: any) {
    this._undo = undo
    this._gantt = gantt
    this._attachEvents()
  }

  store(id: TaskID | LinkID, type: TEntityType, overwrite: boolean = false) {
    if (type === this._gantt.config.undo_types.task) {
      return this._storeTask(id, overwrite)
    }
    if (type === this._gantt.config.undo_types.link) {
      return this._storeLink(id, overwrite)
    }
    return false
  }
  isMoveEventsIgnored() {
    return this._ignoreMoveEvents
  }
  toggleIgnoreMoveEvents(newValue?: boolean) {
    this._ignoreMoveEvents = newValue || false
  }
  startIgnore() {
    this._ignore = true
  }
  stopIgnore() {
    this._ignore = false
  }
  startBatchAction() {
    // try catching updates made from event handlers using timeout
    if (!this._timeout) {
      this._timeout = setTimeout(() => {
        this.stopBatchAction()
        this._timeout = null
      }, 10)
    }

    if (this._ignore || this._batchMode) {
      return
    }

    this._batchMode = true
    this._batchAction = this._undo.action.create()
  }
  stopBatchAction() {
    if (this._ignore) {
      return
    }
    const undo = this._undo
    if (this._batchAction) {
      undo.logAction(this._batchAction)
    }
    this._batchMode = false
    this._batchAction = null
  }
  onTaskAdded(task: ITask) {
    if (!this._ignore) {
      this._storeTaskCommand(task, this._undo.command.type.add)
    }
  }
  onTaskUpdated(task: ITask) {
    if (!this._ignore) {
      this._storeTaskCommand(task, this._undo.command.type.update)
    }
  }
  onTaskMoved(task: ITask) {
    if (!this._ignore) {
      ;(task as any).$local_index = this._gantt.getTaskIndex(task.id)
      this._storeEntityCommand(task, this.getInitialTask(task.id), this._undo.command.type.move, this._undo.command.entity.task)
    }
  }
  onTaskDeleted(task: ITask) {
    if (!this._ignore) {
      this._storeTaskCommand(task, this._undo.command.type.remove)
      if (this._nestedTasks[task.id]) {
        const children = this._nestedTasks[task.id]
        for (let i = 0; i < children.length; i++) {
          this._storeTaskCommand(children[i], this._undo.command.type.remove)
        }
      }
      if (this._nestedLinks[task.id]) {
        const childrenLinks = this._nestedLinks[task.id]
        for (let i = 0; i < childrenLinks.length; i++) {
          this._storeLinkCommand(childrenLinks[i], this._undo.command.type.remove)
        }
      }
    }
  }
  onLinkAdded(link: ILink) {
    if (!this._ignore) {
      this._storeLinkCommand(link, this._undo.command.type.add)
    }
  }
  onLinkUpdated(link: ILink) {
    if (!this._ignore) {
      this._storeLinkCommand(link, this._undo.command.type.update)
    }
  }
  onLinkDeleted(link: ILink) {
    if (!this._ignore) {
      this._storeLinkCommand(link, this._undo.command.type.remove)
    }
  }
  setNestedTasks(id: TaskID, taskIds: TaskID[]) {
    const gantt = this._gantt
    let task = null
    const tasks = []
    let linkIds = this._getLinks(gantt.getTask(id))

    for (let i = 0; i < taskIds.length; i++) {
      task = this.setInitialTask(taskIds[i])
      linkIds = linkIds.concat(this._getLinks(task))
      tasks.push(task)
    }

    const uniqueLinks = {}
    for (let i = 0; i < linkIds.length; i++) {
      uniqueLinks[linkIds[i]] = true
    }
    const links = []
    for (const i in uniqueLinks) {
      links.push(this.setInitialLink(i))
    }
    this._nestedTasks[id] = tasks
    this._nestedLinks[id] = links
  }
  setInitialTask(id: TaskID, overwrite?: boolean) {
    const gantt = this._gantt
    if (overwrite || !this._initialTasks[id] || !this._batchMode) {
      const task = gantt.copy(gantt.getTask(id))
      task.$index = gantt.getGlobalTaskIndex(id)
      task.$local_index = gantt.getTaskIndex(id)
      this.setInitialTaskObject(id, task)
    }
    return this._initialTasks[id]
  }
  getInitialTask(id: TaskID) {
    return this._initialTasks[id]
  }
  clearInitialTasks() {
    this._initialTasks = {}
  }
  setInitialTaskObject(id: TaskID, object: ITask) {
    this._initialTasks[id] = object
  }
  setInitialLink(id: LinkID, overwrite?: boolean) {
    if (!this._initialLinks[id] || !this._batchMode) {
      this._initialLinks[id] = this._gantt.copy(this._gantt.getLink(id))
    }
    return this._initialLinks[id]
  }
  getInitialLink(id: LinkID) {
    return this._initialLinks[id]
  }
  clearInitialLinks() {
    this._initialLinks = {}
  }
  private _attachEvents() {
    let deleteCacheCooldown = null
    const gantt = this._gantt

    const saveInitialAll = () => {
      if (!deleteCacheCooldown) {
        deleteCacheCooldown = setTimeout(() => {
          deleteCacheCooldown = null
        })

        this.clearInitialTasks()
        gantt.eachTask((task: ITask) => {
          this.setInitialTask(task.id)
        })

        this.clearInitialLinks()
        gantt.getLinks().forEach((link: ILink) => {
          this.setInitialLink(link.id)
        })
      }
    }
    const getMoveObjectByTaskId = (id: TaskID) => {
      return gantt.copy(gantt.getTask(id))
    }

    for (const i in noTrack) {
      gantt.attachEvent(i, () => {
        this.startIgnore()
        return true
      })
      gantt.attachEvent(noTrack[i], () => {
        this.stopIgnore()
        return true
      })
    }

    for (let i = 0; i < batchActions.length; i++) {
      gantt.attachEvent(batchActions[i], () => {
        this.startBatchAction()
        return true
      })
    }

    gantt.attachEvent('onParse', () => {
      this._undo.clearUndoStack()
      this._undo.clearRedoStack()
      saveInitialAll()
    })
    gantt.attachEvent('onAfterTaskAdd', (id: TaskID, task: ITask) => {
      this.setInitialTask(id, true)
      this.onTaskAdded(task)
    })
    gantt.attachEvent('onAfterTaskUpdate', (id: TaskID, task: ITask) => {
      this.onTaskUpdated(task)
    })
    gantt.attachEvent('onAfterParentExpand', (id: TaskID, task: ITask) => {
      this.onTaskUpdated(task)
    })
    gantt.attachEvent('onAfterTaskDelete', (id: TaskID, task: ITask) => {
      this.onTaskDeleted(task)
    })
    gantt.attachEvent('onAfterLinkAdd', (id: LinkID, link: ILink) => {
      this.setInitialLink(id, true)
      this.onLinkAdded(link)
    })
    gantt.attachEvent('onAfterLinkUpdate', (id: LinkID, link: ILink) => {
      this.onLinkUpdated(link)
    })
    gantt.attachEvent('onAfterLinkDelete', (id: LinkID, link: ILink) => {
      this.onLinkDeleted(link)
    })
    gantt.attachEvent('onRowDragEnd', (id: TaskID, target: TaskID) => {
      this.onTaskMoved(getMoveObjectByTaskId(id))
      this.toggleIgnoreMoveEvents()
      return true
    })
    gantt.attachEvent('onBeforeTaskDelete', (id: TaskID) => {
      this.store(id, gantt.config.undo_types.task)
      const nested = []

      // remember task indexes in case their being deleted in a loop, so they could be restored in the correct order
      saveInitialAll()

      gantt.eachTask((task: ITask) => {
        nested.push(task.id)
      }, id)
      this.setNestedTasks(id, nested)
      return true
    })
    const datastore = gantt.getDatastore('task')

    datastore.attachEvent('onBeforeItemMove', (id: TaskID, parent: TaskID, tindex: number) => {
      if (!this.isMoveEventsIgnored()) {
        saveInitialAll()
      }
      return true
    })

    datastore.attachEvent('onAfterItemMove', (id: TaskID, parent: TaskID, tindex: number) => {
      if (!this.isMoveEventsIgnored()) {
        this.onTaskMoved(getMoveObjectByTaskId(id))
      }
      return true
    })

    gantt.attachEvent('onRowDragStart', (id: TaskID, target: TaskID, e: Event) => {
      this.toggleIgnoreMoveEvents(true)
      saveInitialAll()
      return true
    })

    let dragId = null
    let projectDrag = false
    gantt.attachEvent('onBeforeTaskDrag', (taskId: TaskID) => {
      dragId = gantt.getState().drag_id
      if (dragId === taskId) {
        const task = gantt.getTask(taskId)
        if (gantt.isSummaryTask(task) && gantt.config.drag_project) {
          projectDrag = true
        }
      }
      // GS-99. Store the initial task dates before multiple drag
      if (gantt.plugins().multiselect) {
        const selectedIds = gantt.getSelectedTasks()
        if (selectedIds.length > 1) {
          selectedIds.forEach((id) => {
            this.store(id, gantt.config.undo_types.task, true)
          })
        }
      }
      return this.store(taskId, gantt.config.undo_types.task)
    })

    gantt.attachEvent('onAfterTaskDrag', (taskId: TaskID) => {
      // if we drag multiple tasks and other tasks move to another date after that,
      // auto-scheduling/correct work time should occur in anoher command.
      // otherwise, when we undo the changes, the task constraint is not restored correctly
      const multipleDrag = projectDrag || (gantt.plugins().multiselect && gantt.getSelectedTasks().length > 1)
      if (multipleDrag && dragId === taskId) {
        projectDrag = false
        dragId = null
        this.stopBatchAction()
      }
      // GS-99. When dragging multiple tasks, we need to store the initial tasks
      this.store(taskId, gantt.config.undo_types.task, true)
    })

    gantt.attachEvent('onLightbox', (taskId: TaskID) => this.store(taskId, gantt.config.undo_types.task))

    gantt.attachEvent('onBeforeTaskAutoSchedule', (task: ITask) => {
      this.store(task.id, gantt.config.undo_types.task, true)
      return true
    })

    if (gantt.ext.inlineEditors) {
      // remove the onGanttLayoutReady wrapper when GS-1288 is merged
      let onBeforeEditStartId = null
      let onEditStart = null
      gantt.attachEvent('onGanttLayoutReady', () => {
        if (onBeforeEditStartId) {
          gantt.ext.inlineEditors.detachEvent(onBeforeEditStartId)
        }
        if (onEditStart) {
          gantt.ext.inlineEditors.detachEvent(onEditStart)
        }

        onEditStart = gantt.ext.inlineEditors.attachEvent('onEditStart', (state: IInlineEditState) => {
          this.store(state.id, gantt.config.undo_types.task)
        })

        // GS-99. If another inline editor is opened and we open a new inline editor,
        // we shouldn't use the batchAction
        onBeforeEditStartId = gantt.ext.inlineEditors.attachEvent('onBeforeEditStart', (state: IInlineEditState) => {
          this.stopBatchAction()
          return true
        })
      })
    }
  }

  private _storeCommand(command: IUndoCommand) {
    const undo = this._undo
    undo.updateConfigs()

    if (!undo.undoEnabled) {
      return
    }

    if (this._batchMode) {
      this._batchAction.commands.push(command)
    } else {
      const action = undo.action.create([command])
      undo.logAction(action)
    }
  }
  private _storeEntityCommand(obj: TUndoValue, old: TUndoValue, actionType: TActionType, entityType: TEntityType) {
    const undo = this._undo
    const command = undo.command.create(obj, old, actionType, entityType)
    this._storeCommand(command)
  }
  private _storeTaskCommand(obj: ITask, type: TActionType) {
    if (this._gantt.isTaskExists(obj.id)) {
      ;(obj as any).$local_index = this._gantt.getTaskIndex(obj.id)
    }

    this._storeEntityCommand(obj, this.getInitialTask(obj.id), type, this._undo.command.entity.task)
  }
  private _storeLinkCommand(obj: ILink, type: TActionType) {
    this._storeEntityCommand(obj, this.getInitialLink(obj.id), type, this._undo.command.entity.link)
  }
  private _getLinks(task: ITask) {
    return task.$source.concat(task.$target)
  }
  private _storeTask(taskId: TaskID, overwrite: boolean = false) {
    const gantt = this._gantt
    this.setInitialTask(taskId, overwrite)
    gantt.eachTask((child: ITask) => {
      this.setInitialTask(child.id)
    }, taskId)
    return true
  }
  private _storeLink(linkId: LinkID, overwrite: boolean = false) {
    this.setInitialLink(linkId, overwrite)
    return true
  }
}
