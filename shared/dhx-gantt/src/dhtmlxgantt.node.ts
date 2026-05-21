import extensions from './ext/extensions_node'
import GanttFactory from './factory/gantt_factory'
import factoryMethod from './factory/make_instance_common'
// tslint:disable-next-line variable-name
const Gantt = new GanttFactory(factoryMethod, extensions)
const gantt = Gantt.getGanttInstance()

export default gantt
export { Gantt, gantt }
