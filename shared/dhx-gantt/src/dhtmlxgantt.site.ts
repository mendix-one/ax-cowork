import { gantt, Gantt } from './dhtmlxgantt.web'
import scope from './utils/global'

import message from './publish_helpers/site_warning'
;(scope as any).gantt = gantt
;(scope as any).Gantt = Gantt

Gantt.plugin(message)

export default gantt

export { gantt, Gantt }
