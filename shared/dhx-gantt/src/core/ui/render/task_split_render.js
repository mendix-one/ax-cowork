import createBaseBarRender from './task_bar_render'
//import isInViewPort from "./viewport/is_split_task_in_viewport";
import getVisibleRange from './viewport/get_visible_bars_range'

import isInViewPortParent from './viewport/is_split_task_in_viewport'
import isInViewPortChild from './viewport/is_bar_in_viewport'
import { childrenHaveBaselines, getMilestoneHeight, getInvertedMilestoneHeight } from './baseline_helper'

function createTaskRenderer(gantt) {
  const defaultRender = createBaseBarRender(gantt)

  const renderedNodes = {}

  function checkVisibility(child, viewPort, timeline, config, gantt) {
    let isVisible = !child.hide_bar
    // GS-1195. Don't render split tasks that are outside the viewport
    if (config.smart_rendering && isVisible) {
      isVisible = isInViewPortChild(child, viewPort, timeline, config, gantt)
    }
    return isVisible
  }

  function generateChildElement(task, child, timeline, sizes, childBaselines) {
    if (child.hide_bar) {
      return
    }

    const isProject = gantt.isSummaryTask(child)
    if (isProject) {
      gantt.resetProjectDates(child)
    }

    const childCopy = gantt.copy(gantt.getTask(child.id))
    childCopy.$rendered_at = task.id
    // a way to filter split tasks:
    const showSplitTask = gantt.callEvent('onBeforeSplitTaskDisplay', [childCopy.id, childCopy, task.id])
    if (showSplitTask === false) {
      return
    }

    const element = defaultRender(childCopy, timeline)
    if (!element) return

    const milestoneChild = child.type === gantt.config.types.milestone
    let milestoneWidth

    const parentHeight = sizes.rowHeight
    const childHeight = timeline.getBarHeight(childCopy.id, milestoneChild)
    let padding = Math.floor((timeline.getItemHeight(task.id) - childHeight) / 2)

    if (milestoneChild) {
      milestoneWidth = getMilestoneHeight(childHeight)
    }

    if (childBaselines /*|| (child.bar_height !== "full" && child.bar_height < child.row_height)*/) {
      if (milestoneChild) {
        padding = Math.floor((milestoneWidth - childHeight) / 2) + 2
      } else {
        padding = 2
      }
    }
    // GS-2270: Split children shouldn't exceed the parent row height
    const linkDragLeft = element.querySelector('.gantt_link_control.task_start_date')
    const linkDragRight = element.querySelector('.gantt_link_control.task_end_date')
    if (milestoneChild) {
      if (milestoneWidth > parentHeight) {
        padding = 2
        element.style.height = parentHeight - padding + 'px'
        const offsetHeight = getInvertedMilestoneHeight(parentHeight)
        const offsetMargin = (offsetHeight - parentHeight) / 2
        const taskContent = element.querySelector('.gantt_task_content')
        padding = Math.abs(offsetMargin)

        linkDragLeft.style.marginLeft = offsetMargin + 'px'
        linkDragRight.style.marginRight = offsetMargin + 'px'
        linkDragLeft.style.height = linkDragRight.style.height = offsetHeight + 'px'

        element.style.width = taskContent.style.height = taskContent.style.width = offsetHeight + 'px'
        element.style.left = timeline.getItemPosition(childCopy).left - offsetHeight / 2 + 'px'
      }
    } else if (childHeight + padding > parentHeight) {
      padding = 0
      element.style.height = element.style.lineHeight = linkDragLeft.style.height = linkDragRight.style.height = parentHeight + 'px'
    }

    element.style.top = sizes.top + padding + 'px'
    element.classList.add('gantt_split_child')
    if (isProject) {
      element.classList.add('gantt_split_subproject')
    }

    return element
  }

  function getKey(childId, renderParentId) {
    return childId + '_' + renderParentId
  }

  function shouldUseSplitRendering(task, config) {
    return gantt.isSplitTask(task) && ((config.open_split_tasks && !task.$open) || !config.open_split_tasks) && gantt.hasChild(task.id)
  }

  function renderSplitTask(task, timeline, config, viewPort) {
    if (shouldUseSplitRendering(task, config)) {
      const el = document.createElement('div'),
        sizes = gantt.getTaskPosition(task)

      const childBaselines = childrenHaveBaselines(gantt, task.id)

      if (gantt.hasChild(task.id)) {
        gantt.eachTask(function (child) {
          let isVisible = checkVisibility(child, viewPort, timeline, config, gantt)
          if (!isVisible) {
            return
          }

          const element = generateChildElement(task, child, timeline, sizes, childBaselines)
          if (element) {
            renderedNodes[getKey(child.id, task.id)] = element
            el.appendChild(element)
          } else {
            renderedNodes[getKey(child.id, task.id)] = false
          }
        }, task.id)
      }
      return el
    }
    return false
  }
  function repaintSplitTask(task, itemNode, timeline, config, viewPort) {
    if (shouldUseSplitRendering(task, config)) {
      const el = document.createElement('div'),
        sizes = gantt.getTaskPosition(task)

      const childBaselines = childrenHaveBaselines(gantt, task.id)
      gantt.eachTask(function (child) {
        const splitKey = getKey(child.id, task.id)
        let isVisible = checkVisibility(child, viewPort, timeline, config, gantt)
        if (isVisible !== !!renderedNodes[splitKey]) {
          if (isVisible) {
            const element = generateChildElement(task, child, timeline, sizes, childBaselines)
            renderedNodes[splitKey] = element || false
          } else {
            renderedNodes[splitKey] = false
          }
        }
        if (!!renderedNodes[splitKey]) {
          el.appendChild(renderedNodes[splitKey])
        }
        itemNode.innerHTML = ''
        itemNode.appendChild(el)
      }, task.id)
    }
  }
  return {
    render: renderSplitTask,
    update: repaintSplitTask,
    isInViewPort: isInViewPortParent,
    getVisibleRange: getVisibleRange,
  }
}

export default createTaskRenderer
