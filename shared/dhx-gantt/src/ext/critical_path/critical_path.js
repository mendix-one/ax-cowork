export default function (gantt) {
  gantt._isProjectEnd = function (task) {
    return !this._hasDuration({
      start_date: task.end_date,
      end_date: this._getProjectEnd(),
      task: task,
    })
  }

  return {
    _cache: {},
    _slackHelper: null,
    reset: function () {
      this._cache = {}
    },
    _calculateCriticalPath: function () {
      this.reset()
    },

    isCriticalTask: function (task) {
      if (!task) return false

      if (gantt.config.auto_scheduling_use_progress && task.progress === 1) {
        this._cache[task.id] = false
        return false
      }

      if (task.unscheduled) {
        return false
      }

      if (this._cache[task.id] === undefined) {
        if (gantt.isSummaryTask(task)) {
          let hasCritical = false
          gantt.eachTask(
            function (child) {
              if (!hasCritical) {
                hasCritical = this.isCriticalTask(child)
              }
            }.bind(this),
            task.id,
          )

          this._cache[task.id] = hasCritical
        } else {
          this._cache[task.id] = this._slackHelper.getTotalSlack(task) <= 0
        }
      }

      return this._cache[task.id]
    },

    init: function (slackHelper) {
      this._slackHelper = slackHelper
      var resetCache = gantt.bind(function () {
        this.reset()
        return true
      }, this)

      var handleTaskIdChange = gantt.bind(function (oldId, newId) {
        if (this._cache) {
          this._cache[newId] = this._cache[oldId]
          delete this._cache[oldId]
        }
        return true
      }, this)

      gantt.attachEvent('onAfterLinkAdd', resetCache)
      gantt.attachEvent('onAfterLinkUpdate', resetCache)
      gantt.attachEvent('onAfterLinkDelete', resetCache)
      gantt.attachEvent('onAfterTaskAdd', resetCache)
      gantt.attachEvent('onTaskIdChange', handleTaskIdChange)
      gantt.attachEvent('onAfterTaskUpdate', resetCache)
      gantt.attachEvent('onAfterTaskDelete', resetCache)
      gantt.attachEvent('onParse', resetCache)
      gantt.attachEvent('onClear', resetCache)
      gantt.$data.tasksStore.attachEvent('onClearAll', resetCache)
      gantt.$data.linksStore.attachEvent('onClearAll', resetCache)

      var criticalPathHandler = function () {
        if (gantt.config.highlight_critical_path && !gantt.getState('batchUpdate').batch_update) gantt.render()
      }
      gantt.attachEvent('onAfterLinkAdd', criticalPathHandler)
      gantt.attachEvent('onAfterLinkUpdate', criticalPathHandler)
      gantt.attachEvent('onAfterLinkDelete', criticalPathHandler)
      gantt.attachEvent('onAfterTaskAdd', criticalPathHandler)
      gantt.attachEvent('onTaskIdChange', function (oldId, newId) {
        if (gantt.config.highlight_critical_path && gantt.isTaskExists(newId)) {
          gantt.refreshTask(newId)
        }
        return true
      })
      gantt.attachEvent('onAfterTaskUpdate', criticalPathHandler)
      gantt.attachEvent('onAfterTaskDelete', criticalPathHandler)
    },
  }
}
