import DurationFormatter from '../common/duration_formatter'
import LinkFormatter from '../common/link_formatter'

export default function (gantt) {
  gantt.ext.formatters = {
    durationFormatter: function (settings) {
      if (!settings) {
        settings = {}
      }
      if (!settings.store) {
        settings.store = gantt.config.duration_unit
      }
      if (!settings.enter) {
        settings.enter = gantt.config.duration_unit
      }
      return DurationFormatter.create(settings, gantt)
    },
    linkFormatter: function (settings) {
      return LinkFormatter.create(settings, gantt)
    },
  }
}
