import extensions from './ext/extensions_all'
import GanttFactory from './factory/gantt_factory'
import factoryMethod from './factory/make_instance_web'
// tslint:disable-next-line variable-name
const Gantt = new GanttFactory(factoryMethod, extensions)
const gantt = Gantt.getGanttInstance()

export { Gantt, gantt }

export type {
  GanttStatic,
  Task,
  Link,
  Baseline,
  Scale,
  GroupConfig,
  GanttConfigOptions,
  GanttTemplates,
  GanttPlugins,
  RouterFunction,
  GanttEventCallback,
} from './api'
