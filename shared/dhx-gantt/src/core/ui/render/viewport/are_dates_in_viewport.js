import isBarInViewport from './is_bar_in_viewport'
export default function areDatesInViewPort(task, viewport, view, config, gantt, dateProperties) {
  const bar = {
    id: task.id,
    parent: task.id,
  }

  function checkTaskProperties(task) {
    const hasAllDates = task[dateProperties.start_date] && task[dateProperties.end_date]
    if (!hasAllDates) {
      return false
    }

    for (let i = 0; i < dateProperties.length; i++) {
      if (!task[dateProperties[i]]) {
        return false
      }
    }
    return true
  }

  const taskProperties = checkTaskProperties(task)
  let childProperties = false

  if (taskProperties) {
    bar.start_date = task[dateProperties.start_date]
    bar.end_date = task[dateProperties.end_date]
  }

  if (task.render == 'split') {
    gantt.eachTask(function (child) {
      if (checkTaskProperties(child)) {
        childProperties = true
        bar.start_date = bar.start_date || child[dateProperties.start_date]
        bar.end_date = bar.end_date || child[dateProperties.end_date]

        if (bar.start_date < child[dateProperties.start_date]) {
          bar.start_date = child[dateProperties.start_date]
        }
        if (bar.end_date > child[dateProperties.end_date]) {
          bar.end_date = child[dateProperties.end_date]
        }
      }
    })
  }

  if (taskProperties || childProperties) {
    return isBarInViewport(bar, viewport, view, gantt)
  } else {
    return false
  }
}
