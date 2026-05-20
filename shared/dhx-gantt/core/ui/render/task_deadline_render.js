import getVisibleRange from './viewport/get_visible_bars_range'
import areDatesInViewPort from './viewport/are_dates_in_viewport'
import { childrenHaveBaselines, getAdjustedPosition, isSplitParent } from './baseline_helper'

function isDeadlineInViewPort(item, viewport, view, config, gantt) {
  const dateProperties = {
    start_date: 'deadline',
    end_date: 'deadline',
  }
  return areDatesInViewPort(item, viewport, view, config, gantt, dateProperties)
}

function createTaskRenderer(gantt) {
  function generateDeadlineNode(task, timeline, childBaselines) {
    const el = document.createElement('div')

    const sizes = gantt.getTaskPosition(task, task.deadline, task.deadline)

    const heightLimit = 20
    const { height, marginTop } = getAdjustedPosition(gantt, timeline, sizes, heightLimit, task, childBaselines)

    let width = height

    if (gantt.config.rtl) {
      sizes.left += width
    }

    el.style.left = sizes.left - width + 'px'
    el.style.top = sizes.top + 'px'
    el.style.marginTop = marginTop + 'px'

    el.style.width = width + 'px'
    el.style.height = height + 'px'

    el.style.fontSize = height + 'px'

    el.className = 'gantt_task_deadline'
    el.setAttribute('data-task-id', task.id)

    return el
  }

  function renderDeadline(task, timeline, config, viewPort) {
    const deadlineNodes = document.createElement('div')
    deadlineNodes.className = 'gantt_deadline_nodes'
    deadlineNodes.setAttribute('data-task-row-id', task.id)

    if (task.deadline) {
      const taskDeadline = generateDeadlineNode(task, timeline)
      deadlineNodes.appendChild(taskDeadline)
    }
    if (isSplitParent(task)) {
      const childBaselines = childrenHaveBaselines(gantt, task.id)
      gantt.eachTask(function (child) {
        if (child.deadline) {
          const childDeadline = generateDeadlineNode(child, timeline, childBaselines)
          deadlineNodes.appendChild(childDeadline)
        }
      }, task.id)
    }

    if (deadlineNodes.childNodes.length) {
      return deadlineNodes
    }
  }
  return {
    render: renderDeadline,
    isInViewPort: isDeadlineInViewPort,
    getVisibleRange: getVisibleRange,
  }
}

export default createTaskRenderer
