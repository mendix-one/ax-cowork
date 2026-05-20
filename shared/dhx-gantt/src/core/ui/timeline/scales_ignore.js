import ScaleHelper from './scales'

function ScaleIgnoreHelper(gantt) {
  var helper = new ScaleHelper(gantt)

  helper.processIgnores = function (config) {
    var display_count = config.count
    config.ignore_x = {}
    if (gantt.ignore_time || gantt.config.skip_off_time) {
      var ignore =
        gantt.ignore_time ||
        function () {
          return false
        }
      display_count = 0

      for (var i = 0; i < config.trace_x.length; i++) {
        if (ignore.call(gantt, config.trace_x[i]) || this._ignore_time_config.call(gantt, config.trace_x[i], config)) {
          config.ignore_x[config.trace_x[i].valueOf()] = true
          config.ignored_colls = true
        } else {
          display_count++
        }
      }
    }
    config.display_count = display_count
  }

  return helper
}

export default ScaleIgnoreHelper
