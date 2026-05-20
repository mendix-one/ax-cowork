import batch_update from './batch_update'
import wbs from './wbs'
import resources from './resources'
import resource_assignments from './resource_assignments'
import new_task_placeholder from './new_task_placeholder'
import auto_task_types from './auto_task_types'
import formatters from './formatters'
import empty_state_screen from './empty_state_screen'
import baselines from './baselines'

export default function (gantt) {
  if (!gantt.ext) {
    gantt.ext = {}
  }

  var modules = [batch_update, wbs, resources, resource_assignments, new_task_placeholder, auto_task_types, formatters, empty_state_screen, baselines]

  for (var i = 0; i < modules.length; i++) {
    if (modules[i]) modules[i](gantt)
  }
}
