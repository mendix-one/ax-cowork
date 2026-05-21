import { gantt, Gantt } from './dhtmlxgantt.web'
import * as watcher from './publish_helpers/void_script_first'
import scope from './utils/global'
;(scope as any).gantt = gantt
;(scope as any).Gantt = Gantt

Gantt.plugin(watcher.default)

export default gantt

export { gantt, Gantt }
