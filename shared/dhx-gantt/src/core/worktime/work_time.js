import CalendarManager from './calendar_manager'
import TimeCalculator from './time_calculator'
import worktimeFacadeFactory from '../facades/worktime_calendars'
import * as utils from '../../utils/utils'

export default function (gantt) {
  var manager = new CalendarManager(gantt),
    timeCalculator = new TimeCalculator(manager)
  var facade = worktimeFacadeFactory.create(manager, timeCalculator)
  utils.mixin(gantt, facade)
}
