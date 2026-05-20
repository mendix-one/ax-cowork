import LinksBuilder from '../../core/relations/links_builder'
import GraphHelper from '../../core/relations/graph_helper'

export default function (gantt) {
  var linksBuilder = LinksBuilder(gantt)
  var graphHelper = GraphHelper(gantt)
  var _private = {
    _freeSlack: {},
    _totalSlack: {},
    _slackNeedCalculate: true,
    _linkedTasksById: {},
    _successorsByTaskId: {},
    _projectEnd: null,

    _calculateSlacks: function () {
      var linkedTasks = linksBuilder.getLinkedTasks()

      var loops = graphHelper.findLoops(linkedTasks)
      if (loops.length) {
        gantt.callEvent('onAutoScheduleCircularLink', [loops])
        var loopLinks = {}

        loops.forEach(function (loop) {
          // remove loop
          loop.linkKeys.forEach(function (key) {
            loopLinks[key] = true
          })
          //const problemLink = loop.linkKeys[0];
        })

        for (var i = 0; i < linkedTasks.length; i++) {
          if (linkedTasks[i].hashSum in loopLinks) {
            linkedTasks.splice(i, 1)
            i--
          }
        }
      }

      const reversedOrder = graphHelper.topologicalSort(linkedTasks).reverse()
      const successorsByTaskId = {}
      linkedTasks.forEach((entry) => {
        // get successors
        if (!successorsByTaskId[entry.source]) {
          successorsByTaskId[entry.source] = {
            linked: [],
          }
        }
        successorsByTaskId[entry.source].linked.push({
          target: entry.target,
          link: entry,
        })
      })

      const distCalculator = {
        _cache: {},
        getDist: function (source, target) {
          const key = `${source.id}_${target.id}`
          if (this._cache[key]) {
            return this._cache[key]
          } else {
            const dist = gantt.calculateDuration({
              start_date: source.end_date,
              end_date: target.start_date,
              task: source,
            })

            this._cache[key] = dist
            return dist
          }
        },
      }
      this._projectEnd = gantt.getSubtaskDates().end_date
      this._calculateFreeSlack(linkedTasks, reversedOrder, successorsByTaskId, distCalculator)
      this._calculateTotalSlack(linkedTasks, reversedOrder, successorsByTaskId, distCalculator)
    },
    _isCompletedTask: function (task) {
      return gantt.config.auto_scheduling_use_progress && task.progress == 1
    },
    _calculateFreeSlack: function (linkedTasks, orderedFromEnd, successorsMap, distCalculator) {
      const freeSlack = (this._freeSlack = {})
      const tasksToDo = {}
      gantt.eachTask(function (task) {
        if (!gantt.isSummaryTask(task)) {
          tasksToDo[task.id] = task
        }
      })
      const processedTasks = {}
      linkedTasks.forEach((entry) => {
        const task = tasksToDo[entry.source]
        // GS-1995: Don't calculate slack if the task's parent is not loaded
        if (!task) {
          return
        }
        processedTasks[entry.source] = true
        let ownSlack = distCalculator.getDist(task, gantt.getTask(entry.target))
        ownSlack -= entry.lag || 0

        if (freeSlack[entry.source] !== undefined) {
          freeSlack[entry.source] = Math.min(ownSlack, freeSlack[entry.source])
        } else {
          freeSlack[entry.source] = ownSlack
        }
      })
      for (const id in tasksToDo) {
        if (processedTasks[id]) {
          continue
        }
        const task = tasksToDo[id]
        if (this._isCompletedTask(task) || task.unscheduled) {
          freeSlack[task.id] = 0
        } else {
          freeSlack[task.id] = gantt.calculateDuration({ start_date: task.end_date, end_date: this._projectEnd, task: task })
        }
      }

      return this._freeSlack
    },
    _disconnectedTaskSlack(task) {
      if (this._isCompletedTask(task)) {
        return 0
      } else {
        return Math.max(gantt.calculateDuration(task.end_date, this._projectEnd), 0)
      }
    },
    _calculateTotalSlack: function (linkedTasks, orderedFromEnd, successorsMap, distCalculator) {
      this._totalSlack = {}
      this._slackNeedCalculate = false
      var totalSlackByTaskId = {}
      var tasks = gantt.getTaskByTime()

      for (var i = 0; i < orderedFromEnd.length; i++) {
        const task = gantt.getTask(orderedFromEnd[i])

        if (this._isCompletedTask(task)) {
          totalSlackByTaskId[task.id] = 0
        } else if (!successorsMap[task.id] && !gantt.isSummaryTask(task)) {
          totalSlackByTaskId[task.id] = this.getFreeSlack(task)
        } else {
          const successorLinks = successorsMap[task.id].linked
          let totalSlack = null
          for (var j = 0; j < successorLinks.length; j++) {
            const successorLink = successorLinks[j]
            const successor = gantt.getTask(successorLink.target)
            let successorSlack = 0

            if (totalSlackByTaskId[successor.id] !== undefined) {
              successorSlack += totalSlackByTaskId[successor.id]
            }

            successorSlack += distCalculator.getDist(task, successor)

            successorSlack -= successorLink.link.lag || 0

            if (totalSlack === null) {
              totalSlack = successorSlack
            } else {
              totalSlack = Math.min(totalSlack, successorSlack)
            }
          }

          totalSlackByTaskId[task.id] = totalSlack || 0
        }
      }

      tasks.forEach(
        function (task) {
          if (totalSlackByTaskId[task.id] === undefined && !gantt.isSummaryTask(task)) {
            totalSlackByTaskId[task.id] = this.getFreeSlack(task)
          }
        }.bind(this),
      )

      this._totalSlack = totalSlackByTaskId
      return this._totalSlack
    },

    _resetTotalSlackCache: function () {
      this._slackNeedCalculate = true
    },

    _shouldCalculateTotalSlack: function () {
      return this._slackNeedCalculate
    },

    getFreeSlack: function (task) {
      if (this._shouldCalculateTotalSlack()) {
        this._calculateSlacks()
      }
      if (!gantt.isTaskExists(task.id)) {
        return 0
      }

      if (this._isCompletedTask(task)) {
        return 0
      }
      if (gantt.isSummaryTask(task)) {
        return undefined
      }

      return this._freeSlack[task.id] || 0
    },

    getTotalSlack: function (task) {
      if (this._shouldCalculateTotalSlack()) {
        this._calculateSlacks()
      }
      if (task === undefined) {
        return this._totalSlack
      }

      var id
      if (task.id !== undefined) {
        id = task.id
      } else {
        id = task
      }

      if (this._isCompletedTask(task)) {
        return 0
      }

      if (this._totalSlack[id] === undefined) {
        if (gantt.isSummaryTask(gantt.getTask(id))) {
          var minSlack = null
          gantt.eachTask(
            function (child) {
              var childSlack = this._totalSlack[child.id]
              if (childSlack !== undefined && (minSlack === null || childSlack < minSlack)) {
                minSlack = childSlack
              }
            }.bind(this),
            id,
          )

          if (minSlack !== null) {
            this._totalSlack[id] = minSlack
          } else {
            this._totalSlack[id] = gantt.calculateDuration({
              start_date: task.end_date,
              end_date: this._projectEnd,
              task: task,
            })
          }
          return this._totalSlack[id]
        } else {
          return 0
        }
      } else {
        return this._totalSlack[id] || 0
      }
    },

    dropCachedFreeSlack: function () {
      this._freeSlack = {}
      this._resetTotalSlackCache()
    },

    init: function () {
      function slackHandler() {
        _private.dropCachedFreeSlack()
      }

      gantt.attachEvent('onAfterLinkAdd', slackHandler)
      gantt.attachEvent('onTaskIdChange', slackHandler)
      gantt.attachEvent('onAfterLinkUpdate', slackHandler)
      gantt.attachEvent('onAfterLinkDelete', slackHandler)
      gantt.attachEvent('onAfterTaskAdd', slackHandler)
      gantt.attachEvent('onAfterTaskUpdate', slackHandler)
      gantt.attachEvent('onAfterTaskDelete', slackHandler)
      gantt.attachEvent('onRowDragEnd', slackHandler)
      gantt.attachEvent('onAfterTaskMove', slackHandler)
      gantt.attachEvent('onParse', slackHandler)
      gantt.attachEvent('onClear', slackHandler)
      gantt.$data.tasksStore.attachEvent('onClearAll', slackHandler)
      gantt.$data.linksStore.attachEvent('onClearAll', slackHandler)
    },
  }

  return _private
}
