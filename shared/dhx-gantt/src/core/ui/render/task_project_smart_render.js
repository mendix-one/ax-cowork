import isInViewPort from './viewport/is_project_bar_in_viewport'
import getVisibleRange from './viewport/get_visible_bars_range'
import createBaseBarRender from './task_project_render'

export default function createTaskRenderer(gantt) {
  var defaultRender = createBaseBarRender(gantt)
  return {
    render: defaultRender,
    update: null,
    //getRectangle: getBarRectangle
    isInViewPort: isInViewPort,
    getVisibleRange: getVisibleRange,
  }
}
