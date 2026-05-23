import auto_scheduling_configs from './auto_scheduling_configs'
import links_common from '../core/relations/links_common'
import graph_helper from '../core/relations/graph_helper'

import LinksBuilder from '../core/relations/links_builder'
import { ConstraintTypes } from './auto_scheduling/constraint_types'
import { ConstraintsHelper } from './auto_scheduling/constraints'
import { AutoSchedulingPlanner } from './auto_scheduling/planner'
import { ConnectedGroupsHelper } from './auto_scheduling/connected_groups'
import { LoopsFinder } from './auto_scheduling/loops_finder'

import { attachUIHandlers } from './auto_scheduling/ui_handlers'

export default function (gantt) {
  auto_scheduling_configs(gantt)
  links_common(gantt)

  var linksBuilder = LinksBuilder(gantt)
  var graphHelper = graph_helper(gantt)

  var constraintsHelper = ConstraintsHelper.Create(gantt)

  var planner = new AutoSchedulingPlanner(gantt, graphHelper, constraintsHelper)

  var connectedGroups = new ConnectedGroupsHelper(gantt, linksBuilder)

  var loopsFinder = new LoopsFinder(gantt, graphHelper, linksBuilder)

  gantt.getConnectedGroup = connectedGroups.getConnectedGroup
  gantt.getConstraintType = constraintsHelper.getConstraintType
  gantt.getConstraintLimitations = function (task) {
    var plan = constraintsHelper.processConstraint(task, null)
    if (plan) {
      return {
        earliestStart: plan.earliestStart || null,
        earliestEnd: plan.earliestEnd || null,
        latestStart: plan.latestStart || null,
        latestEnd: plan.latestEnd || null,
      }
    } else {
      return {
        earliestStart: null,
        earliestEnd: null,
        latestStart: null,
        latestEnd: null,
      }
    }
  }

  gantt.isCircularLink = loopsFinder.isCircularLink
  gantt.findCycles = loopsFinder.findCycles

  gantt.config.constraint_types = ConstraintTypes
  gantt.config.auto_scheduling = false
  gantt.config.auto_scheduling_descendant_links = false
  gantt.config.auto_scheduling_initial = true
  gantt.config.auto_scheduling_strict = false
  gantt.config.auto_scheduling_move_projects = true
  gantt.config.project_start = null
  gantt.config.project_end = null
  gantt.config.schedule_from_end = false

  function preferInitialTaskDates(startTask, relations) {
    // TODO: remove in 7.0
    if (!gantt.config.auto_scheduling_compatibility) {
      return
    }

    // .preferredStart still exists only to emulate pre 6.1 auto scheduling behavior
    // will be removed in future versions
    for (var i = 0; i < relations.length; i++) {
      var rel = relations[i]
      var task = gantt.getTask(rel.target)

      if (!gantt.config.auto_scheduling_strict || rel.target == startTask) {
        rel.preferredStart = new Date(task.start_date)
      }
    }
  }

  var afterRenderBeforeFirstRepaint = false
  gantt.attachEvent('onParse', function () {
    afterRenderBeforeFirstRepaint = true
    return true
  })

  gantt.attachEvent('onBeforeGanttRender', function () {
    afterRenderBeforeFirstRepaint = false
    return true
  })

  function updateParentsAndCallEvents(updatedTasks) {
    if (!updatedTasks.length) {
      return
    }

    gantt.batchUpdate(function payload() {
      for (var i = 0; i < updatedTasks.length; i++) {
        gantt.updateTask(updatedTasks[i])
      }
    }, afterRenderBeforeFirstRepaint) // don't call repaint if auto scheduling on parse before initial repain
  }

  gantt._autoSchedule = function (id, relations) {
    if (gantt.callEvent('onBeforeAutoSchedule', [id]) === false) {
      return
    }
    gantt._autoscheduling_in_progress = true

    var constraints = constraintsHelper.getConstraints(id, gantt.isTaskExists(id) ? relations : null)

    var updatedTasks = []

    var cycles = graphHelper.findLoops(relations)
    if (cycles.length) {
      gantt.callEvent('onAutoScheduleCircularLink', [cycles])
    } else {
      preferInitialTaskDates(id, relations)

      // GS-2427. Auto-schedule twice when there are links with project tasks
      // as we cannot be sure that the project duration doesn't change
      for (let i = 0; i < relations.length; i++) {
        if (relations[i].subtaskLink) {
          planner._secondIterationRequired = true
          planner._secondIteration = false
          break
        }
      }

      var plan = planner.generatePlan(relations, constraints)
      updatedTasks = planner.applyProjectPlan(plan)

      updateParentsAndCallEvents(updatedTasks)
    }

    gantt._autoscheduling_in_progress = false
    gantt.callEvent('onAfterAutoSchedule', [id, updatedTasks])
  }

  gantt.autoSchedule = function (id, inclusive) {
    if (inclusive === undefined) {
      inclusive = true
    } else {
      inclusive = !!inclusive
    }

    var relations
    if (id !== undefined) {
      if (gantt.config.auto_scheduling_compatibility) {
        relations = linksBuilder.getLinkedTasks(id, inclusive)
      } else {
        relations = connectedGroups.getConnectedGroupRelations(id)
      }
    } else {
      relations = linksBuilder.getLinkedTasks()
    }

    gantt._autoSchedule(id, relations)
  }

  gantt.attachEvent('onTaskLoading', function (task) {
    if (task.constraint_date && typeof task.constraint_date === 'string') {
      task.constraint_date = gantt.date.parseDate(task.constraint_date, 'parse_date')
    }
    task.constraint_type = gantt.getConstraintType(task)
    return true
  })
  gantt.attachEvent('onTaskCreated', function (task) {
    task.constraint_type = gantt.getConstraintType(task)
    return true
  })

  attachUIHandlers(gantt, linksBuilder, loopsFinder, connectedGroups)
}
