export default function (item, viewport, view, config, gantt) {
  // GS-2481 and GS-1715, don't remove selected task when using keyboard shortcuts and when the inline editor is opened
  if (
    gantt.$ui.getView('grid') &&
    ((gantt.config.keyboard_navigation && gantt.getSelectedId()) || (gantt.ext.inlineEditors && gantt.ext.inlineEditors.getState().id))
  ) {
    //GS-2661: selected task might be collapsed
    if (!item.$expanded_branch) return false
    return true
  }
  var top = view.getItemTop(item.id)
  var height = view.getItemHeight(item.id)

  if (top > viewport.y_end || top + height < viewport.y) {
    return false
  }

  return true
}
