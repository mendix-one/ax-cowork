// optimized checker for task bars smart rendering

// first check the vertical position since it's easier to calculate
export default function isBarInViewport(item, viewport, view, config, gantt) {
  if (!((item.start_date && item.end_date) || (item.$auto_start_date && item.$auto_end_date))) {
    return null
  }

  var top = view.getItemTop(item.id)
  var height = view.getItemHeight(item.id)

  if (top > viewport.y_end || top + height < viewport.y) {
    return false
  }

  var padding = 200

  const coords = []
  if (item.start_date) {
    coords.push(view.posFromDate(item.start_date))
  }
  if (item.end_date) {
    coords.push(view.posFromDate(item.end_date))
  }
  if (item.$auto_start_date) {
    coords.push(view.posFromDate(item.$auto_start_date))
  }
  if (item.$auto_end_date) {
    coords.push(view.posFromDate(item.$auto_end_date))
  }

  var left = Math.min(...coords) - padding
  var right = Math.max(...coords) + padding

  if (left > viewport.x_end || right < viewport.x) {
    return false
  }

  return true
}
