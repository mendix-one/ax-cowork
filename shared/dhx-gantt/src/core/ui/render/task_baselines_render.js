import getVisibleRange from './viewport/get_visible_bars_range'
import areDatesInViewPort from './viewport/are_dates_in_viewport'
import { getMaxParentHeight, getMilestoneHeight, getInvertedMilestoneHeight, isSplitParent } from './baseline_helper'

function isBaselineInViewPort(task, viewport, view, config, gantt) {
  let inViewport = false
  const dateProperties = {
    start_date: 'start_date',
    end_date: 'end_date',
  }
  if (task.type == gantt.config.types.milestone) {
    dateProperties.end_date = dateProperties.start_date
  }

  if (task.baselines) {
    inViewport = iterateBaselines(task, viewport, view, config, gantt, dateProperties)
  }
  if (isSplitParent(task)) {
    gantt.eachTask(function (child) {
      if (inViewport) {
        return
      }
      if (child.baselines && child.baselines.length) {
        if (child.type == gantt.config.types.milestone) {
          dateProperties.end_date = dateProperties.start_date
        }
        if (iterateBaselines(child, viewport, view, config, gantt, dateProperties)) {
          inViewport = true
        }
      }
    }, task.id)
  }

  return inViewport
}

function iterateBaselines(task, viewport, view, config, gantt, dateProperties) {
  for (var i = 0; i < task.baselines.length; i++) {
    const baseline = {
      id: task.id,
      parent: task.parent,
      start_date: task.baselines[i].start_date,
      end_date: task.baselines[i].end_date,
    }
    if (areDatesInViewPort(baseline, viewport, view, config, gantt, dateProperties)) {
      return true
    }
  }
}

function createBaselineRenderer(gantt) {
  function generateBaselineNode(task, baseline, index, timeline, splitChild) {
    const el = document.createElement('div')
    let baselineEnd = baseline.end_date
    let milestoneTask = task.type === gantt.config.types.milestone
    if (milestoneTask) {
      baselineEnd = baseline.start_date
    }
    const sizes = gantt.getTaskPosition(task, baseline.start_date, baselineEnd)

    let milestoneMarginTop = 0
    let milestoneWidth
    if (milestoneTask) {
      let milestoneHeight = timeline.getBarHeight(task.id, true)
      milestoneWidth = getMilestoneHeight(milestoneHeight)
      milestoneMarginTop = Math.floor((milestoneWidth - milestoneHeight) / 4)
    }

    let parentHeight = getMaxParentHeight(gantt, timeline, task, sizes.rowHeight)
    let maxHeight = parentHeight.maxHeight

    let top = sizes.top + 1 + milestoneMarginTop
    let height = timeline.getBarHeight(task.id, task.type)
    const baselineSubrowHeight = gantt.config.baselines.row_height
    const baselineBarHeight = gantt.config.baselines.bar_height

    // between task and first baseline
    let siblingBaselinesSize
    let marginTop

    switch (gantt.config.baselines.render_mode) {
      case 'separateRow':
        top += sizes.height + (baselineSubrowHeight - baselineBarHeight) / 2
        height = baselineBarHeight
        break

      case 'individualRow':
        // betweenBaselines = 3 * (index + 1);
        siblingBaselinesSize = baselineSubrowHeight * index
        top += sizes.height + siblingBaselinesSize + (baselineSubrowHeight - baselineBarHeight) / 2

        height = baselineBarHeight
        break

      case 'taskRow':
      default:
        // TODO: simplify positioning
        marginTop = 1
        if (splitChild) {
          maxHeight = getMaxParentHeight(gantt, timeline, task).maxHeight
          if (milestoneMarginTop) {
            if (maxHeight >= milestoneWidth) {
              marginTop = (maxHeight - height) / 2 - 1 - milestoneMarginTop
            } else {
              height = getInvertedMilestoneHeight(maxHeight)
              top = sizes.top
              marginTop = Math.abs(height - maxHeight) / 2
              milestoneMarginTop = 0 // for maxBottom
            }
          } else {
            if (maxHeight > height) {
              marginTop = (maxHeight - height) / 2 - 1
            }
            marginTop -= milestoneMarginTop
          }
          if (!task.bar_height) {
            marginTop -= 1
          } else {
            // marginTop += 1;
          }
        } else {
          if (task.bar_height && sizes.rowHeight >= task.bar_height) {
            marginTop = (sizes.rowHeight - task.bar_height) / 2 - 1
          }
          marginTop += milestoneMarginTop

          if (!task.bar_height) {
            marginTop += 2
          }
          if (milestoneTask) {
            marginTop += 1
          }
        }
        break
    }

    let maxBottom = sizes.top + maxHeight + 1 - milestoneMarginTop

    // don't exceed maximal task row height
    if (top + height > maxBottom) {
      height -= top + height - maxBottom
      if (height <= 0) {
        return false
      }
    }

    el.style.left = sizes.left + 'px'
    el.style.width = sizes.width + 'px'
    el.style.top = top + 'px'
    el.style.height = Math.floor(height) + 'px'
    if (marginTop) {
      el.style.marginTop = marginTop + 'px'
    }
    el.className = `gantt_task_baseline gantt_task_baseline_${index} ${baseline.className || ''}`

    if (milestoneTask) {
      el.className += ' gantt_milestone_baseline'
      el.style.width = el.style.height = height + 'px'
      el.style.marginLeft = Math.floor(-height / 2) + 'px'
    } else {
      el.innerHTML = gantt.templates.baseline_text(task, baseline, index)
    }

    el.setAttribute('data-task-id', task.id)
    el.setAttribute('data-baseline-id', baseline.id)

    return el
  }

  function renderBaseline(task, timeline, config, viewPort) {
    if (!gantt.config.baselines.render_mode) {
      return
    }

    const baselineNodes = document.createElement('div')
    baselineNodes.className = 'gantt_baseline_nodes'
    baselineNodes.setAttribute('data-task-row-id', task.id)

    if (task.baselines && task.baselines.length) {
      task.baselines.forEach(function (baseline, index) {
        const taskBaseline = generateBaselineNode(task, baseline, index, timeline)
        if (taskBaseline) {
          baselineNodes.appendChild(taskBaseline)
        }
      })
    }
    if (isSplitParent(task)) {
      gantt.eachTask(function (child) {
        if (child.baselines && child.baselines.length) {
          child.baselines.forEach(function (baseline, index) {
            const childBaseline = generateBaselineNode(child, baseline, index, timeline, true)
            if (childBaseline) {
              baselineNodes.appendChild(childBaseline)
            }
          })
        }
      }, task.id)
    }

    if (baselineNodes.childNodes.length) {
      return baselineNodes
    }
  }
  return {
    render: renderBaseline,
    isInViewPort: isBaselineInViewPort,
    getVisibleRange: getVisibleRange,
  }
}

export default createBaselineRenderer
