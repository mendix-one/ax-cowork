export default function (gantt) {
  // helpers for building chain of dependencies, used for critical path calculation and for auto scheduling

  gantt._get_linked_task = function (link, getTarget) {
    var task = null
    var taskId = getTarget ? link.target : link.source

    if (gantt.isTaskExists(taskId)) {
      task = gantt.getTask(taskId)
    }

    return task
  }
  gantt._get_link_target = function (link) {
    return gantt._get_linked_task(link, true)
  }

  gantt._get_link_source = function (link) {
    return gantt._get_linked_task(link, false)
  }

  var caching = false
  var formattedLinksStash = {}
  var inheritedSuccessorsStash = {}
  var inheritedPredecessorsStash = {}
  var getPredecessorsCache = {}

  gantt._isLinksCacheEnabled = function () {
    return caching
  }
  gantt._startLinksCache = function () {
    formattedLinksStash = {}
    inheritedSuccessorsStash = {}
    inheritedPredecessorsStash = {}
    getPredecessorsCache = {}
    caching = true
  }
  gantt._endLinksCache = function () {
    formattedLinksStash = {}
    inheritedSuccessorsStash = {}
    inheritedPredecessorsStash = {}
    getPredecessorsCache = {}
    caching = false
  }

  function isManuallyScheduledSummary(task) {
    return gantt.isSummaryTask(task) && task.auto_scheduling === false
  }

  gantt._formatLink = function (link, sourceDates, targetDates) {
    if (caching && formattedLinksStash[link.id]) {
      return formattedLinksStash[link.id]
    }

    var relations = []
    var target = this._get_link_target(link)
    var source = this._get_link_source(link)

    if (!(source && target)) {
      return relations
    }

    if ((gantt.isSummaryTask(target) && gantt.isChildOf(source.id, target.id)) || (gantt.isSummaryTask(source) && gantt.isChildOf(target.id, source.id))) {
      return relations
    }

    var backwardsScheduling = gantt.config.schedule_from_end && gantt.config.project_end
    var respectTargetOffset = gantt.config.auto_scheduling_move_projects
    if (!gantt.config.auto_scheduling_compatibility && gantt.config.auto_scheduling_strict) {
      respectTargetOffset = false
    }

    // there are three kinds of connections at this point
    // task -> task - regular link
    // task -> project - transform it into set of regular links (task -> [each subtask]), use offset beetween subtask and project dates as lag, in order not to change mutual positions of subtasks inside a project
    // project -> task - transform it into ([each subtask] -> task) links
    // project -> project - transform it into ([each subtask of p1] -> [each subtask of p2]) links
    sourceDates =
      sourceDates || (this.isSummaryTask(source) && !isManuallyScheduledSummary(source))
        ? this.getSubtaskDates(source.id)
        : {
            start_date: source.start_date,
            end_date: source.end_date,
          }

    var from = this._getImplicitLinks(
      link,
      source,
      function (c) {
        if (!respectTargetOffset || !backwardsScheduling) {
          return 0
        } else {
          if (!c.$source.length && !(gantt.getState('tasksDnd').drag_id == c.id)) {
            // drag_id - virtual lag shouldn't restrict task that is being moved inside project
            return gantt.calculateDuration({
              start_date: c.end_date,
              end_date: sourceDates.end_date,
              task: source,
            })
          } else {
            return 0
          }
        }
      },
      true,
    )

    if (!targetDates) {
      targetDates = {
        start_date: target.start_date,
        end_date: target.end_date,
      }
      if (this.isSummaryTask(target) && !isManuallyScheduledSummary(target)) {
        targetDates = this.getSubtaskDates(target.id)
        targetDates.start_date = targetDates.end_date
        // GS-2427. When a successor starts earlier its predecessor, we should
        // obtain the dates of the predecessor
        this.eachTask(function (child) {
          // exclude projects as their dates are unreliable until the scheduling is done
          if (child.type === this.config.types.project) {
            return
          }
          if (!child.$target.length && child.start_date < targetDates.start_date) {
            targetDates.start_date = child.start_date
          }
        }, target.id)
      }
    }

    var to = this._getImplicitLinks(link, target, function (actualTarget) {
      if (!respectTargetOffset || backwardsScheduling) {
        return 0
      } else {
        if (!actualTarget.$target.length && !(gantt.getState('tasksDnd').drag_id == actualTarget.id)) {
          // drag_id - virtual lag shouldn't restrict task that is being moved inside project
          return gantt.calculateDuration({
            start_date: targetDates.start_date,
            end_date: actualTarget.start_date,
            task: target,
          })
        } else {
          return 0
        }
      }
    })

    for (var i = 0, fromLength = from.length; i < fromLength; i++) {
      var fromTask = from[i]
      for (var j = 0, toLength = to.length; j < toLength; j++) {
        var toTask = to[j]

        var lag = fromTask.lag * 1 + toTask.lag * 1

        var subtaskLink = {
          id: link.id,
          type: link.type,
          source: fromTask.task,
          target: toTask.task,
          subtaskLink: fromTask.subtaskLink,
          lag: (link.lag * 1 || 0) + lag,
        }

        gantt._linkedTasks[subtaskLink.target] = gantt._linkedTasks[subtaskLink.target] || {}
        gantt._linkedTasks[subtaskLink.target][subtaskLink.source] = true

        relations.push(gantt._convertToFinishToStartLink(toTask.task, subtaskLink, source, target, fromTask.taskParent, toTask.taskParent))
      }
    }

    if (caching) formattedLinksStash[link.id] = relations

    return relations
  }

  gantt._isAutoSchedulable = function (task) {
    const scheduleTask = task.auto_scheduling !== false && task.unscheduled !== true
    if (!scheduleTask) {
      return false
    }
    // GS-2420. Don't auto-schedule project when it has only unscheduled children
    if (this.isSummaryTask(task)) {
      let unscheduledChildren = true
      this.eachTask(function (child) {
        if (unscheduledChildren) {
          const scheduleChild = gantt._isAutoSchedulable(child)
          if (scheduleChild) {
            unscheduledChildren = false
          }
        }
      }, task.id)
      if (unscheduledChildren) {
        return false
      }
    }
    return true
  }

  gantt._getImplicitLinks = function (link, parent, selectOffset, selectSourceLinks) {
    var relations = []

    if (this.isSummaryTask(parent) && !isManuallyScheduledSummary(parent)) {
      // if the summary task contains multiple chains of linked tasks - no need to consider every task of the chain,
      // it will be enough to check the first/last tasks of the chain
      // special conditions if there are unscheduled tasks in the chain, or negative lag values that put the end date of the successor task prior to its predecessors' date
      var children = {}
      this.eachTask(function (c) {
        if (!this.isSummaryTask(c) || isManuallyScheduledSummary(c)) {
          children[c.id] = c
        }
      }, parent.id)

      var skipChild

      for (var c in children) {
        var task = children[c]
        // don't create subtask links with unscheduled tasks
        if (!gantt._isAutoSchedulable(task)) {
          continue
        }
        var linksCollection = selectSourceLinks ? task.$source : task.$target

        skipChild = false

        for (var l = 0; l < linksCollection.length; l++) {
          // GS-2014 and GS-2588. If the link type is SS or SF, we shouldn't change the skipChild variable
          // because the target task should be moved to an earlier date
          if (link.type == gantt.config.links.start_to_start || link.type == gantt.config.links.start_to_finish) {
            break
          }
          var siblingLink = gantt.getLink(linksCollection[l])
          var siblingId = selectSourceLinks ? siblingLink.target : siblingLink.source
          var siblingTask = children[siblingId]
          if (siblingTask && gantt._isAutoSchedulable(task) && gantt._isAutoSchedulable(siblingTask)) {
            let linkLag = 0
            if (siblingLink.lag) {
              linkLag = Math.abs(siblingLink.lag)
            }
            // GS-2014 and GS-2588. If the link type is not FS, the actual lag will be different
            if (siblingLink.type != gantt.config.links.finish_to_start) {
              linkLag += gantt._convertToFinishToStartLink(null, {}, task, siblingTask).additionalLag
              continue
            }

            const sameTarget = siblingLink.target == siblingTask.id
            const insignificantTargetLag = sameTarget && linkLag && linkLag <= siblingTask.duration

            const sameSource = siblingLink.target == task.id
            const insignificantSourceLag = sameSource && linkLag && linkLag <= task.duration

            if (insignificantTargetLag || insignificantSourceLag) {
              skipChild = true
              break
            }
          }
        }
        if (!skipChild) {
          // GS-1689. If a task has links between other tasks within the project,
          // Gantt shouldn't try to keep the position within the project
          let calculateLag = true
          for (const predecessorId in gantt._linkedTasks[task.id]) {
            if (gantt.isChildOf(predecessorId, link.target)) {
              calculateLag = false
              break
            }
          }
          let offsetLag = 0
          if (calculateLag) {
            offsetLag = selectOffset(task)
          }
          relations.push({ task: task.id, taskParent: task.parent, lag: offsetLag, subtaskLink: true })
        }
      }
    } else {
      relations.push({ task: parent.id, taskParent: parent.parent, lag: 0 })
    }

    return relations
  }

  gantt._getDirectDependencies = function (task, selectSuccessors) {
    gantt._linkedTasks = gantt._linkedTasks || {}

    var links = [],
      successors = []

    var linksIds = selectSuccessors ? task.$source : task.$target

    for (var i = 0; i < linksIds.length; i++) {
      var link = this.getLink(linksIds[i])
      if (this.isTaskExists(link.source) && this.isTaskExists(link.target)) {
        var target = this.getTask(link.target)
        if (!this._isAutoSchedulable(target) || !this._isAutoSchedulable(task)) {
          continue
        } else if (gantt.config.auto_scheduling_use_progress) {
          if (target.progress == 1) {
            continue
          } else {
            links.push(link)
          }
        } else {
          links.push(link)
        }
      }
    }

    for (var i = 0; i < links.length; i++) {
      successors = successors.concat(this._formatLink(links[i]))
    }

    return successors
  }

  gantt._getInheritedDependencies = function (task, selectSuccessors) {
    //var successors = [];
    var stop = false
    var inheritedRelations = []
    var cacheCollection
    if (this.isTaskExists(task.id)) {
      this.eachParent(
        function (parent) {
          if (stop) return

          if (caching) {
            cacheCollection = selectSuccessors ? inheritedSuccessorsStash : inheritedPredecessorsStash
            if (cacheCollection[parent.id]) {
              inheritedRelations = inheritedRelations.concat(cacheCollection[parent.id])
              return
            }
          }

          var parentDependencies
          if (this.isSummaryTask(parent)) {
            if (!this._isAutoSchedulable(parent)) {
              stop = true
            } else {
              parentDependencies = this._getDirectDependencies(parent, selectSuccessors)
              if (caching) {
                cacheCollection[parent.id] = parentDependencies
              }

              inheritedRelations = inheritedRelations.concat(parentDependencies)
            }
          }
        },
        task.id,
        this,
      )
    }

    return inheritedRelations
  }

  gantt._getDirectSuccessors = function (task) {
    return this._getDirectDependencies(task, true)
  }

  gantt._getInheritedSuccessors = function (task) {
    return this._getInheritedDependencies(task, true)
  }

  gantt._getDirectPredecessors = function (task) {
    return this._getDirectDependencies(task, false)
  }

  gantt._getInheritedPredecessors = function (task) {
    return this._getInheritedDependencies(task, false)
  }

  gantt._getSuccessors = function (task, skipInherited) {
    var successors = this._getDirectSuccessors(task)
    if (skipInherited) {
      return successors
    } else {
      return successors.concat(this._getInheritedSuccessors(task))
    }
  }

  gantt._getPredecessors = function (task, skipInherited) {
    var key = String(task.id) + '-' + String(skipInherited)
    var result

    if (caching && getPredecessorsCache[key]) {
      return getPredecessorsCache[key]
    }

    var predecessors = this._getDirectPredecessors(task)
    if (skipInherited) {
      result = predecessors
    } else {
      result = predecessors.concat(this._getInheritedPredecessors(task))
    }
    if (caching) {
      getPredecessorsCache[key] = result
    }
    return result
  }

  gantt._convertToFinishToStartLink = function (id, link, sourceTask, targetTask, sourceParent, targetParent) {
    // convert finish-to-finish, start-to-finish and start-to-start to finish-to-start link and provide some additional properties
    var res = {
      target: id,
      link: gantt.config.links.finish_to_start,
      id: link.id,
      lag: link.lag || 0,
      sourceLag: 0,
      targetLag: 0,
      trueLag: link.lag || 0,
      source: link.source,
      preferredStart: null,
      sourceParent: sourceParent,
      targetParent: targetParent,
      hashSum: null,
      subtaskLink: link.subtaskLink,
    }
    // GS-148: switch uses strict comparison, so we need to convert the values to the same type
    var additionalLag = 0
    switch (String(link.type)) {
      case String(gantt.config.links.start_to_start):
        additionalLag = -sourceTask.duration
        res.sourceLag = additionalLag
        break
      case String(gantt.config.links.finish_to_finish):
        additionalLag = -targetTask.duration
        res.targetLag = additionalLag
        break
      case String(gantt.config.links.start_to_finish):
        additionalLag = -sourceTask.duration - targetTask.duration
        res.sourceLag = -sourceTask.duration
        res.targetLag = -targetTask.duration
        break
      default:
        additionalLag = 0
    }

    res.lag += additionalLag
    res.hashSum = res.lag + '_' + res.link + '_' + res.source + '_' + res.target
    return res
  }
}
