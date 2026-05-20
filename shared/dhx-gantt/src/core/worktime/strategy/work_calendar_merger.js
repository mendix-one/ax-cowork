import * as utils from '../../../utils/utils'
function WorkTimeCalendarMerger() {}

WorkTimeCalendarMerger.prototype = {
  /**
   * convert hours array items into objects, e.g. [8, 12, 17, 18] -> [{start: 8, end: 12}, {start:17, end:18}]
   * @param {Array} hoursArray
   */
  _getIntervals: function (hoursArray) {
    var result = []
    for (var i = 0; i < hoursArray.length; i += 2) {
      result.push({
        start: hoursArray[i],
        end: hoursArray[i + 1],
      })
    }
    return result
  },

  /**
   * Convert ranges config into hours array
   * [{start: 8, end: 12}, {start:17, end:18}] --> [8, 12, 17, 18]
   * @param {*} intervalsArray
   */
  _toHoursArray: function (intervalsArray) {
    var result = []

    function toFixed(value) {
      var str = String(value)
      if (str.length < 2) {
        str = '0' + str
      }
      return str
    }
    function formatHHMM(secondsValue) {
      var hours = Math.floor(secondsValue / (60 * 60))
      var minutePart = secondsValue - hours * 60 * 60

      var minutes = Math.floor(minutePart / 60)
      return hours + ':' + toFixed(minutes)
    }
    for (var i = 0; i < intervalsArray.length; i++) {
      result.push(formatHHMM(intervalsArray[i].start) + '-' + formatHHMM(intervalsArray[i].end))
    }
    return result
  },

  /**
   * Build intersection of hour intervals. e.g.
   * first: [{start: 8, end: 12}, {start:13, end:18}]
   * second: [{start: 10, end: 15}]
   * result: [{start: 10, end: 12}, {start: 13, end: 15}]
   * @param {Array} first
   * @param {Array} second
   */
  _intersectHourRanges: function (first, second) {
    var result = []

    var baseArray = first.length > second.length ? first : second
    var overridesArray = first === baseArray ? second : first
    baseArray = baseArray.slice()
    overridesArray = overridesArray.slice()

    var result = []
    for (var i = 0; i < baseArray.length; i++) {
      var base = baseArray[i]

      for (var j = 0; j < overridesArray.length; j++) {
        var current = overridesArray[j]
        if (current.start < base.end && current.end > base.start) {
          result.push({
            start: Math.max(base.start, current.start),
            end: Math.min(base.end, current.end),
          })
          if (base.end > current.end) {
            overridesArray.splice(j, 1)
            j--
            i--
          }
        }
      }
    }
    return result
  },

  /**
   * Reduce the number of ranges in config when possible,
   * joins ranges that can be merged
   * parts: [{start: 8, end: 12}, {start:12, end:13}, {start: 15, end: 17}]
   * result: [{start: 8, end: 13}, {start: 15, end: 17}]
   * @param {Array} parts
   */
  _mergeAdjacentIntervals: function (parts) {
    var result = parts.slice()
    result.sort(function (a, b) {
      return a.start - b.start
    })
    var base = result[0]
    for (var i = 1; i < result.length; i++) {
      var current = result[i]
      if (current.start <= base.end) {
        if (current.end > base.end) {
          base.end = current.end
        }
        result.splice(i, 1)
        i--
      } else {
        base = current
      }
    }
    return result
  },

  _mergeHoursConfig: function (firstHours, secondHours) {
    //var firstIntervals = this._getIntervals(firstHours);
    //var secondIntervals = this._getIntervals(secondHours);

    return this._mergeAdjacentIntervals(this._intersectHourRanges(firstHours, secondHours))
  },

  merge: function (first, second) {
    const firstCalendar = utils.copy(first.getConfig())
    const secondCalendar = utils.copy(second.getConfig())

    const firstConfig = firstCalendar.parsed
    const secondConfig = secondCalendar.parsed

    // GS-2101. The customWeeks config shouldn't have parsed values as we'll parse them later
    firstConfig.customWeeks = firstCalendar.customWeeks
    secondConfig.customWeeks = secondCalendar.customWeeks

    var mergedSettings = {
      hours: this._toHoursArray(this._mergeHoursConfig(firstConfig.hours, secondConfig.hours)),
      dates: {},
      customWeeks: {},
    }

    const processCalendar = (config1, config2) => {
      for (let i in config1.dates) {
        const date1 = config1.dates[i]

        // dates contain day-of-week rules [0-7] and rules for specific dates (js date timestamps) - set false date rules initially
        if (+i > 1000) {
          mergedSettings.dates[i] = false
        }
        // Check if the key exists in the fisrt calendar object
        for (const key in config2.dates) {
          const date2 = config2.dates[key]

          // Logical AND for week days
          if (key == i) {
            mergedSettings.dates[i] = !!(date1 && date2)
          }

          // Handle case where dates are arrays
          if (Array.isArray(date1)) {
            const hours2 = Array.isArray(date2) ? date2 : config2.hours
            mergedSettings.dates[i] = this._toHoursArray(this._mergeHoursConfig(date1, hours2))
          }
        }
      }
    }

    // Check both calendars
    processCalendar(firstConfig, secondConfig)
    processCalendar(secondConfig, firstConfig)

    // transfer and overwrite custom week calendars
    if (firstConfig.customWeeks) {
      for (var i in firstConfig.customWeeks) {
        mergedSettings.customWeeks[i] = firstConfig.customWeeks[i]
      }
    }
    if (secondConfig.customWeeks) {
      for (var i in secondConfig.customWeeks) {
        // GS-2101. If both calendars have the same name for a period, we need to rename it
        if (mergedSettings.customWeeks[i]) {
          mergedSettings.customWeeks[i + '_second'] = secondConfig.customWeeks[i]
        } else {
          mergedSettings.customWeeks[i] = secondConfig.customWeeks[i]
        }
      }
    }

    return mergedSettings
  },
}

export default WorkTimeCalendarMerger
