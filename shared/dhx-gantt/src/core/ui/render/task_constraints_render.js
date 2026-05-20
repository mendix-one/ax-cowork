import getVisibleRange from './viewport/get_visible_bars_range'
import areDatesInViewPort from './viewport/are_dates_in_viewport'
import { childrenHaveBaselines, getAdjustedPosition, isSplitParent } from './baseline_helper'

function isConstraintInViewPort(item, viewport, view, config, gantt) {
  if (gantt.config.auto_scheduling && gantt.config.auto_scheduling.show_constraints !== false) {
    const dateProperties = {
      start_date: 'constraint_date',
      end_date: 'constraint_date',
      additional_properties: ['constraint_type'],
    }
    return areDatesInViewPort(item, viewport, view, config, gantt, dateProperties)
  } else {
    // don't process constraints when they shouldn't be displayed
    return false
  }
}

function createTaskRenderer(gantt) {
  // we need that for the use case when the constraints have different names
  const constraintNames = {}
  for (let prop in gantt.config.constraint_types) {
    constraintNames[gantt.config.constraint_types[prop]] = prop
  }

  function getConstraintName(task) {
    const constraintValue = gantt.getConstraintType(task)
    const commonName = constraintNames[constraintValue].toLowerCase()
    return commonName
  }

  function generateConstraintNode(task, timeline, childBaselines) {
    const constraintType = getConstraintName(task)
    if (constraintType == 'asap' || constraintType == 'alap') {
      return false
    }
    const el = document.createElement('div')
    const sizes = gantt.getTaskPosition(task, task.constraint_date, task.constraint_date)

    const heightLimit = 30
    let { height, marginTop } = getAdjustedPosition(gantt, timeline, sizes, heightLimit, task, childBaselines)

    let width = height

    let marginLeft = 0
    switch (constraintType) {
      case 'snet':
      case 'fnet':
      case 'mso':
        if (gantt.config.rtl) {
          marginLeft = 1
        } else {
          marginLeft = -width - 1
        }

        break
      case 'snlt':
      case 'fnlt':
      case 'mfo':
        if (gantt.config.rtl) {
          marginLeft = -width - 1
        } else {
          marginLeft = 1
        }
        break
    }

    if (task.type === gantt.config.types.milestone) {
      marginTop -= 1
    }

    el.style.height = height + 'px'
    el.style.width = width + 'px'

    el.style.left = sizes.left + 'px'
    el.style.top = sizes.top + 'px'

    el.style.marginLeft = marginLeft + 'px'
    el.style.marginTop = marginTop + 'px'

    el.className = 'gantt_constraint_marker gantt_constraint_marker_' + constraintType

    switch (constraintType) {
      case 'snet':
      case 'snlt':
      case 'fnet':
      case 'fnlt':
        el.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Start No Later Than">
<line id="Line 3" x1="30.5" y1="6.92097e-08" x2="30.5" y2="32" stroke="#555D63" stroke-width="3" stroke-dasharray="3 3"/>
<path id="Vector" d="m 18.3979,23.5 v -6 H 3.05161 L 3,14.485 H 18.3979 V 8.5 L 27,16 Z" fill="#555D63"/>
</g>
</svg>
`
        break
      case 'mfo':
      case 'mso':
        el.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Must Start On ">
<path id="Vector" d="m 18.3979,23.5 v -6 H 3.05161 L 3,14.485 H 18.3979 V 8.5 L 27,16 Z" fill="#555D63"/>
<line id="line" x1="30.5" y1="-6.55671e-08" x2="30.5" y2="32" stroke="black" stroke-opacity="0.7" stroke-width="3"/>
</g>
</svg>
`
        break
    }

    el.setAttribute('data-task-id', task.id)

    return el
  }

  function renderConstraints(task, timeline, config, viewPort) {
    if (gantt.config.auto_scheduling_compatibility) {
      return
    }
    if (gantt.config.auto_scheduling && gantt.config.auto_scheduling.show_constraints !== false) {
      const constraintNodes = document.createElement('div')
      constraintNodes.className = 'gantt_constraint_nodes'
      constraintNodes.setAttribute('data-task-row-id', task.id)

      if (task.constraint_date && task.constraint_type) {
        const taskConstraint = generateConstraintNode(task, timeline)
        if (taskConstraint) {
          constraintNodes.appendChild(taskConstraint)
        }
      }

      if (isSplitParent(task)) {
        const childBaselines = childrenHaveBaselines(gantt, task.id)
        gantt.eachTask(function (child) {
          if (child.constraint_date && child.constraint_type) {
            const childConstraint = generateConstraintNode(child, timeline, childBaselines)
            if (childConstraint) {
              constraintNodes.appendChild(childConstraint)
            }
          }
        }, task.id)
      }

      if (constraintNodes.childNodes.length) {
        return constraintNodes
      }
    }
  }
  return {
    render: renderConstraints,
    isInViewPort: isConstraintInViewPort,
    getVisibleRange: getVisibleRange,
  }
}

export default createTaskRenderer
