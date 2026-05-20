export default function getVisibleTasksRange(gantt, view, config, datastore, viewport) {
  var buffer = 1
  var start = view.getItemIndexByTopPosition(viewport.y) || 0
  var end = view.getItemIndexByTopPosition(viewport.y_end) || datastore.count()
  var indexStart = Math.max(0, start - buffer)
  var indexEnd = Math.min(datastore.count(), end + buffer)
  // GS-2481 and GS-1715, need to take into account selected task when using keyboard shortcuts and when the inline editor is opened
  const extraTasksIds = []
  if (gantt.config.keyboard_navigation && gantt.getSelectedId()) {
    let task = gantt.getTask(gantt.getSelectedId())
    // GS-2661 and GS-2835: The selected task shouldn't be a split child
    // and its parent shouldn't be collapsed
    if (task.$expanded_branch && !task.$split_subtask) {
      extraTasksIds.push(gantt.getSelectedId())
    }
  }
  if (gantt.$ui.getView('grid') && gantt.ext.inlineEditors && gantt.ext.inlineEditors.getState().id) {
    let inlineEditorId = gantt.ext.inlineEditors.getState().id
    if (datastore.exists(inlineEditorId)) {
      extraTasksIds.push(inlineEditorId)
    }
  }
  return {
    start: indexStart,
    end: indexEnd,
    ids: extraTasksIds,
  }
}
