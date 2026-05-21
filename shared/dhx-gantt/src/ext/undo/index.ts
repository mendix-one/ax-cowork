import { Monitor } from './monitor'
import { IMonitor, IUndoCommand, TEntityType, TUndoStack } from './types'
import { Undo } from './undo'

export default function (gantt: any) {
  const _undo = new Undo(gantt)
  const monitor: IMonitor = new Monitor(_undo, gantt)

  gantt.config.undo = true
  gantt.config.redo = true

  /**
   * entities that require different processing for undoing-redoing changes
   * @type {{link: string, task: string}}
   */
  gantt.config.undo_types = {
    link: 'link',
    task: 'task',
  }

  /**
   * types of traced actions
   * @type {{update: string, remove: string, add: string}}
   */
  gantt.config.undo_actions = {
    update: 'update',
    remove: 'remove', // remove item from datastore
    add: 'add',
    move: 'move', // move task in grid
  }

  if (!gantt.ext) {
    gantt.ext = {}
  }

  gantt.ext.undo = {
    undo: () => _undo.undo(),
    redo: () => _undo.redo(),
    getUndoStack: () => _undo.getUndoStack(),
    setUndoStack: (stack: []) => _undo.setUndoStack(stack),
    getRedoStack: () => _undo.getRedoStack(),
    setRedoStack: (stack: []) => _undo.setRedoStack(stack),
    clearUndoStack: () => _undo.clearUndoStack(),
    clearRedoStack: () => _undo.clearRedoStack(),
    saveState: (id: TaskID | LinkID, type: TEntityType) => monitor.store(id, type, true),
    getInitialState: (id: TaskID | LinkID, type: TEntityType) => {
      if (type === gantt.config.undo_types.link) {
        return monitor.getInitialLink(id)
      } else {
        return monitor.getInitialTask(id)
      }
    },
  }

  gantt.undo = gantt.ext.undo.undo
  gantt.redo = gantt.ext.undo.redo
  gantt.getUndoStack = gantt.ext.undo.getUndoStack
  gantt.getRedoStack = gantt.ext.undo.getRedoStack
  gantt.clearUndoStack = gantt.ext.undo.clearUndoStack
  gantt.clearRedoStack = gantt.ext.undo.clearRedoStack

  function isEqualIds(first: TaskID, second: TaskID) {
    return String(first) === String(second)
  }

  function updTask(task: ITask, oldId: TaskID, newId: TaskID) {
    if (!task) {
      return
    }

    if (isEqualIds(task.id, oldId)) {
      task.id = newId
    }

    if (isEqualIds(task.parent, oldId)) {
      task.parent = newId
    }
  }

  function changeTaskCommandId(command: IUndoCommand, oldId: TaskID, newId: TaskID) {
    updTask(command.value, oldId, newId)
    updTask(command.oldValue, oldId, newId)
  }

  function updLink(link: ILink, oldTaskId: TaskID, newTaskId: TaskID) {
    if (!link) {
      return
    }
    if (isEqualIds(link.source, oldTaskId)) {
      link.source = newTaskId
    }
    if (isEqualIds(link.target, oldTaskId)) {
      link.target = newTaskId
    }
  }

  function changeLinkCommandId(command: IUndoCommand, oldId: LinkID, newId: LinkID) {
    updLink(command.value, oldId, newId)
    updLink(command.oldValue, oldId, newId)
  }

  function updateTasksIds(log: TUndoStack, oldId: TaskID, newId: TaskID) {
    const undo = _undo

    for (let i = 0; i < log.length; i++) {
      const entry = log[i]
      for (let j = 0; j < entry.commands.length; j++) {
        if (entry.commands[j].entity === undo.command.entity.task) {
          changeTaskCommandId(entry.commands[j], oldId, newId)
        } else if (entry.commands[j].entity === undo.command.entity.link) {
          changeLinkCommandId(entry.commands[j], oldId, newId)
        }
      }
    }
  }

  function updateLinksIds(log: TUndoStack, oldId: LinkID, newId: LinkID) {
    const undo = _undo

    for (let i = 0; i < log.length; i++) {
      const entry = log[i]
      for (let j = 0; j < entry.commands.length; j++) {
        const command = entry.commands[j]
        if (command.entity === undo.command.entity.link) {
          if (command.value && command.value.id === oldId) {
            command.value.id = newId
          }
          if (command.oldValue && command.oldValue.id === oldId) {
            command.oldValue.id = newId
          }
        }
      }
    }
  }

  gantt.attachEvent('onTaskIdChange', (oldId: TaskID, newId: TaskID) => {
    const undo = _undo
    updateTasksIds(undo.getUndoStack(), oldId, newId)
    updateTasksIds(undo.getRedoStack(), oldId, newId)
  })

  gantt.attachEvent('onLinkIdChange', (oldId: LinkID, newId: LinkID) => {
    const undo = _undo
    updateLinksIds(undo.getUndoStack(), oldId, newId)
    updateLinksIds(undo.getRedoStack(), oldId, newId)
  })

  gantt.attachEvent('onGanttReady', () => {
    _undo.updateConfigs()
  })
}
