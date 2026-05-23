import auto_scheduling_configs from './auto_scheduling_configs'
import links_common from '../core/relations/links_common'
import slackPrivate from './critical_path/slack'
import critical_path from './critical_path/critical_path'

export default function (gantt) {
  auto_scheduling_configs(gantt)
  links_common(gantt)

  var _private = slackPrivate(gantt)
  _private.init()

  gantt.getFreeSlack = function (task) {
    return _private.getFreeSlack(task)
  }

  gantt.getTotalSlack = function (task) {
    return _private.getTotalSlack(task)
  }

  var criticalPath = critical_path(gantt)
  gantt.config.highlight_critical_path = false
  criticalPath.init(_private)

  gantt.isCriticalTask = function (task) {
    gantt.assert(!!(task && task.id !== undefined), 'Invalid argument for gantt.isCriticalTask')
    return criticalPath.isCriticalTask(task)
  }

  gantt.isCriticalLink = function (link) {
    return this.isCriticalTask(gantt.getTask(link.source))
  }

  gantt.getSlack = function (task1, task2) {
    var minSlack = 0
    var relations = []
    var common = {}

    for (var i = 0; i < task1.$source.length; i++) {
      common[task1.$source[i]] = true
    }
    for (var i = 0; i < task2.$target.length; i++) {
      if (common[task2.$target[i]]) relations.push(task2.$target[i])
    }
    // there is at least one link
    if (relations[0]) {
      for (var i = 0; i < relations.length; i++) {
        var link = this.getLink(relations[i])
        var newSlack = this._getSlack(task1, task2, this._convertToFinishToStartLink(link.id, link, task1, task2, task1.parent, task2.parent))

        if (minSlack > newSlack || i === 0) {
          minSlack = newSlack
        }
      }
    } else {
      // there are no links, but we still need the slack (for the children of a project task)
      minSlack = this._getSlack(task1, task2, {})
    }
    return minSlack
  }

  gantt._getSlack = function (task, next_task, relation) {
    // relation - link expressed as finish-to-start (gantt._convertToFinishToStartLink)
    var types = this.config.types

    var from = null
    if (this.getTaskType(task.type) == types.milestone) {
      from = task.start_date
    } else {
      from = task.end_date
    }

    var to = next_task.start_date

    var duration = 0
    if (+from > +to) {
      duration = -this.calculateDuration({ start_date: to, end_date: from, task: task })
    } else {
      duration = this.calculateDuration({ start_date: from, end_date: to, task: task })
    }

    var lag = relation.lag
    if (lag && lag * 1 == lag) {
      duration -= lag
    }

    return duration
  }
}
