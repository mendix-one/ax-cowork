export default function (item, view, config) {
  if (!item.start_date || !item.end_date) {
    return null
  }
  var startCoord = view.posFromDate(item.start_date)
  var endCoord = view.posFromDate(item.end_date)
  var left = Math.min(startCoord, endCoord)
  var right = Math.max(startCoord, endCoord)

  return {
    top: view.getItemTop(item.id),
    height: view.getItemHeight(item.id),
    left: left,
    width: right - left,
  }
}
