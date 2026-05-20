export const hasBaselinesBelow = function (gantt, task) {
  const baselines = task.baselines && task.baselines.length
  const baselinesOnDifferentRow = gantt.config.baselines.render_mode == 'separateRow' || gantt.config.baselines.render_mode == 'individualRow'
  if (baselines && baselinesOnDifferentRow) {
    return true
  }
}

export const childrenHaveBaselines = function (gantt, taskId) {
  let hasBaselines = false
  gantt.eachTask(function (child) {
    if (hasBaselines) {
      return
    }
    hasBaselines = hasBaselinesBelow(gantt, child)
  }, taskId)
  return hasBaselines
}

export const isSplitChild = function (gantt, id) {
  let splitChild = false
  gantt.eachParent(function (parent) {
    if (isSplitParent(parent)) {
      splitChild = true
    }
  }, id)
  return splitChild
}

export const isSplitParent = function (task) {
  return task.render && task.render == 'split' && !task.$open
}

export const getMaxParentHeight = function (gantt, view, task, heightLimit) {
  let maxHeight = heightLimit || view.$task_data.scrollHeight
  let shrinkHeight = false
  let splitChild = false

  gantt.eachParent(function (parent) {
    if (isSplitParent(parent)) {
      splitChild = true
      const parentSizes = view.getItemPosition(parent)
      const parentHeight = parentSizes.rowHeight
      if (parentHeight < maxHeight) {
        maxHeight = parentHeight
        shrinkHeight = true
      }
    }
  }, task.id)

  return { maxHeight, shrinkHeight, splitChild }
}

export const getMilestoneHeight = function (height) {
  return Math.sqrt(2 * height * height)
}

export const getInvertedMilestoneHeight = function (height) {
  return Math.round(height / Math.sqrt(2))
}

export const getAdjustedPosition = function (gantt, timeline, sizes, heightLimit, task, childBaselines) {
  const baselines = hasBaselinesBelow(gantt, task)

  const splitParams = getMaxParentHeight(gantt, timeline, task)
  let maxHeight = splitParams.maxHeight

  let height = sizes.height
  let largerHeight = height > heightLimit
  let noNeedToShrink = sizes.rowHeight >= heightLimit && !splitParams.splitChild && !baselines
  if (largerHeight || noNeedToShrink) {
    height = heightLimit
  }

  if (maxHeight < height) {
    height = maxHeight
  }

  let marginTop = Math.floor((sizes.rowHeight - height) / 2)

  if (splitParams.splitChild) {
    marginTop = Math.floor((maxHeight - height) / 2)
  }
  if (childBaselines || baselines) {
    let heightDiff = Math.min(sizes.height, maxHeight) - height

    let additionalMargin = 2
    let exceedBarHeight = baselines && task.bar_height >= task.row_height
    let exceedParentHeight = splitParams.splitChild && sizes.height >= maxHeight
    if (exceedBarHeight || exceedParentHeight) {
      additionalMargin = 0
    }

    marginTop = Math.floor(heightDiff / 2) + additionalMargin
    const bottom = height + marginTop
    if (bottom > sizes.rowHeight || bottom > maxHeight) {
      // marginTop = 0;
    }
  }

  return { height, marginTop }
}

export default {
  hasBaselinesBelow,
  childrenHaveBaselines,
  isSplitChild,
  isSplitParent,
  getMaxParentHeight,
  getMilestoneHeight,
  getInvertedMilestoneHeight,
  getAdjustedPosition,
}
