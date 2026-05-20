import { hasBaselinesBelow, isSplitParent } from '../ui/render/baseline_helper'
import isHeadless from '../../utils/is_headless'

export default function (gantt) {
  gantt.config.baselines = {
    datastore: 'baselines',
    render_mode: false,
    dataprocessor_baselines: false,
    row_height: 16,
    bar_height: 8,
  }

  function initBaselineFields(item, task) {
    // don't add baseline if it doesn't belong to any task
    // or if doesn't have the dates
    if (!item.task_id || (!item.start_date && !item.end_date)) {
      return false
    }

    if (item.start_date) {
      item.start_date = gantt.date.parseDate(item.start_date, 'parse_date')
    } else {
      item.start_date = null
    }

    if (item.end_date) {
      item.end_date = gantt.date.parseDate(item.end_date, 'parse_date')
    } else {
      item.end_date = null
    }

    // set min baseline duration
    item.duration = item.duration || 1

    // GS-2636. Calculate the 3rd date parameter basing on existing date parameters
    if (item.start_date && !item.end_date) {
      item.end_date = gantt.calculateEndDate(item.start_date, item.duration)
    } else if (item.end_date && !item.start_date) {
      item.start_date = gantt.calculateEndDate(item.end_date, -item.duration)
    }
  }
  // gantt init
  const baselineStore = gantt.createDatastore({
    name: gantt.config.baselines.datastore,
    initItem: function (item) {
      if (!item.id) {
        item.id = gantt.uid()
      }

      initBaselineFields(item)

      return item
    },
  })

  gantt.$data.baselineStore = baselineStore

  function _syncBaselines(task) {
    let shouldRepaint = false
    const iteratedBaselines = {}

    const taskBaselines = task.baselines || []
    const exisingBaselines = gantt.getTaskBaselines(task.id)

    if (taskBaselines.length != exisingBaselines.length) {
      shouldRepaint = true
    }

    taskBaselines.forEach(function (baseline) {
      iteratedBaselines[baseline.id] = true
      const exisingBaseline = baselineStore.getItem(baseline.id)
      if (exisingBaseline) {
        const start = +exisingBaseline.start_date !== +baseline.start_date
        const end = +exisingBaseline.end_date !== +baseline.end_date
        if (start || end) {
          baselineStore.updateItem(baseline.id, baseline)
        }
      } else {
        baselineStore.addItem(baseline)
      }
    })

    exisingBaselines.forEach(function (baseline) {
      if (!iteratedBaselines[baseline.id]) {
        baselineStore.removeItem(baseline.id)
      }
    })

    if (shouldRepaint) {
      if (isSplitParent(task)) {
        // here we adjust the parent height, then adjust it with the total child height
        _adjustSplitParentHeight(task)
      } else {
        gantt.adjustTaskHeightForBaselines(task)
      }
      gantt.render()
    }
  }

  function _deleteOrphanBaselines() {
    baselineStore.eachItem(function (baseline) {
      if (!gantt.isTaskExists(baseline.task_id)) {
        baselineStore.removeItem(baseline.id)
      }
    })
  }

  function _adjustSplitParentHeight(task) {
    let maxParentHeight = 0

    gantt.adjustTaskHeightForBaselines(task)

    gantt.eachTask(function (child) {
      let childHeight = child.row_height || gantt.config.row_height

      maxParentHeight = maxParentHeight || childHeight
      if (childHeight > maxParentHeight) {
        maxParentHeight = childHeight
      }
    }, task.id)

    if (task.row_height < maxParentHeight) {
      task.row_height = maxParentHeight
    }
  }

  gantt.adjustTaskHeightForBaselines = function (task) {
    let height, baselineSize, betweenBaselines
    let margins = 2
    let baselineAmount = (task.baselines && task.baselines.length) || 0
    const subrowHeight = gantt.config.baselines.row_height
    //const baselineBarHeight = task?.baselines.bar_height

    const timelineView = gantt.getLayoutView('timeline')
    if (!timelineView || !gantt.config.show_chart) {
      return
    }

    switch (gantt.config.baselines.render_mode) {
      case 'taskRow':
        task.row_height = task.bar_height + 8
        break

      case 'separateRow':
        height = timelineView.getBarHeight(task.id)
        if (baselineAmount) {
          task.bar_height = task.bar_height || height

          if (task.bar_height > height) {
            height = task.bar_height
          }

          task.row_height = height + subrowHeight
        } else if (task.bar_height) {
          task.row_height = task.bar_height + 4
        }

        _increaseSplitParentHeight(task)
        break

      case 'individualRow':
        height = timelineView.getBarHeight(task.id)

        if (baselineAmount) {
          task.bar_height = task.bar_height || height

          if (task.bar_height > height) {
            height = task.bar_height
          }

          baselineSize = subrowHeight * baselineAmount
          //   betweenBaselines = 3 * (baselineAmount + 1);

          task.row_height = height + baselineSize + margins
        } else if (task.bar_height) {
          task.row_height = task.bar_height + 4
        }

        _increaseSplitParentHeight(task)
        break
      default:
        task.row_height = task.bar_height + 8
        break
    }
  }

  function _increaseSplitParentHeight(task) {
    gantt.eachParent(function (parent) {
      if (isSplitParent(parent)) {
        const parentHeight = parent.row_height || gantt.getLayoutView('timeline').getBarHeight(parent.id)
        let maxHeight = task.row_height

        // iterate only direct children
        const subtasks = gantt.getChildren(parent.id)
        subtasks.forEach(function (subtaskId) {
          const subtask = gantt.getTask(subtaskId)
          if (subtask.id == task.id) {
            return
          }
          const subtaskHeight = subtask.row_height || gantt.getLayoutView('timeline').getBarHeight(subtask.id)
          maxHeight = maxHeight || subtaskHeight
          if (subtaskHeight > maxHeight) {
            maxHeight = subtaskHeight
          }
        })

        parent.row_height = maxHeight
        parent.bar_height = parent.bar_height || parentHeight
      }
    }, task.id)
  }

  gantt.attachEvent(
    'onGanttReady',
    function () {
      if (!gantt.config.baselines) {
        return
      }

      gantt.attachEvent('onParse', function () {
        baselineStore.eachItem(function (baseline) {
          const taskId = baseline.task_id
          if (gantt.isTaskExists(taskId)) {
            const task = gantt.getTask(taskId)

            task.baselines = task.baselines || []

            let newBaseline = true
            for (let i = 0; i < task.baselines.length; i++) {
              let existingBaseline = task.baselines[i]
              if (existingBaseline.id == baseline.id) {
                newBaseline = false
                gantt.mixin(existingBaseline, baseline, true)
                break
              }
            }
            if (newBaseline) {
              task.baselines.push(baseline)
            }

            if (!isHeadless(gantt)) {
              if (isSplitParent(task)) {
                _adjustSplitParentHeight(task)
              } else {
                gantt.adjustTaskHeightForBaselines(task)
              }
            }
          }
        })
      })

      gantt.attachEvent('onBeforeTaskUpdate', function (id, task) {
        _syncBaselines(task)
        return true
      })

      gantt.attachEvent('onAfterUndo', function (action) {
        const baselinesRenderedBelow = gantt.config.baselines.render_mode == 'separateRow' || gantt.config.baselines.render_mode == 'individualRow'
        if (baselinesRenderedBelow && action) {
          let repaint = false
          action.commands.forEach(function (command) {
            if (command.entity == 'task') {
              const taskId = command.value.id
              if (gantt.isTaskExists(taskId)) {
                const task = gantt.getTask(taskId)
                if (task.parent && gantt.isTaskExists(task.parent)) {
                  const parent = gantt.getTask(task.parent)
                  if (isSplitParent(parent)) {
                    _adjustSplitParentHeight(parent)
                    repaint = true
                  }
                }
              }
            }
          })
          if (repaint) {
            gantt.render()
          }
        }
      })

      gantt.attachEvent('onAfterTaskDelete', function (id, task) {
        if (hasBaselinesBelow) {
          if (task.parent && gantt.isTaskExists(task.parent)) {
            const parent = gantt.getTask(task.parent)
            if (isSplitParent(parent)) {
              _adjustSplitParentHeight(parent)
            }
          }
        }
        _deleteOrphanBaselines()
      })

      gantt.getTaskBaselines = function (taskId) {
        const baselines = []
        baselineStore.eachItem(function (baseline) {
          if (baseline.task_id == taskId) {
            baselines.push(baseline)
          }
        })
        return baselines
      }
      gantt.$data.baselineStore.attachEvent('onClearAll', function () {
        gantt.eachTask(function (task) {
          if (task.baselines) {
            delete task.baselines
          }
        })
        // The data should not be repainted as otherwise it causes issues when we have resource
        // assignments and group tasks. It should be fixed when we add a repaint stack
        // gantt.refreshData();
        return true
      })

      gantt.$data.tasksStore.attachEvent('onClearAll', function () {
        baselineStore.clearAll()
        return true
      })
      gantt.attachEvent('onTaskIdChange', function (id, new_id) {
        const baselines = baselineStore.find(function (a) {
          return a.task_id == id
        })
        baselines.forEach(function (a) {
          a.task_id = new_id
          baselineStore.updateItem(a.id)
        })
      })
    },
    { once: true },
  )
}
