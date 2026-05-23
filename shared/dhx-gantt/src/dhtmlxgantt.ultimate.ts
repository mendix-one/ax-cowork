import { gantt, Gantt } from './dhtmlxgantt.web'
import scope from './utils/global'
;(scope as any).gantt = gantt
;(scope as any).Gantt = Gantt

export default gantt

export { gantt, Gantt }
