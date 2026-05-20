import autoscroll from './autoscroll'
import jquery_hooks from './jquery_hooks'
import dhtmlx_hooks from './dhtmlx_hooks'
import TimelineZoom from './timeline_zoom'

export default function (gantt) {
  if (!gantt.ext) {
    gantt.ext = {}
  }

  var modules = [autoscroll, jquery_hooks, dhtmlx_hooks]

  for (var i = 0; i < modules.length; i++) {
    if (modules[i]) modules[i](gantt)
  }

  gantt.ext.zoom = new TimelineZoom(gantt)
}
