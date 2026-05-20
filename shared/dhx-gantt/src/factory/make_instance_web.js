import '../css/dhtmlxgantt.less'

import factory from './make_instance_common'
import ui from '../core/ui_core'
import ajaxLoading from '../core/loading/ajax_loading'
import dynamicLoading from '../core/loading/dynamic_loading'

export default function (supportedExtensions) {
  var gantt = factory(supportedExtensions)

  if (!gantt.env.isNode) {
    ui(gantt)
    ajaxLoading(gantt)
    dynamicLoading(gantt)
  }

  return gantt
}
