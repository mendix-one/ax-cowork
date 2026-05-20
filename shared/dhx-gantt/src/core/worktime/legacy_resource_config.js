export default {
  isLegacyResourceCalendarFormat: function (resourceCalendarsProperty) {
    // modern format:
    //gantt.config.resource_calendars = {
    //	resourceId: calendarId,
    //	resourceId: calendarId,
    //	resourceId: calendarId
    //	};

    // legacy format:
    // gantt.config.resource_calendars = {
    //	"resourceProperty": {
    //		resourceId: calendarId,
    //		resourceId: calendarId,
    //		resourceId: calendarId
    //		}
    //	};

    if (!resourceCalendarsProperty) {
      return false
    }
    for (var i in resourceCalendarsProperty) {
      if (resourceCalendarsProperty[i] && typeof resourceCalendarsProperty[i] === 'object') {
        return true
      }
    }

    return false
  },
  getResourceProperty: function (config) {
    var resourceCalendarsConfig = config.resource_calendars
    var propertyName = config.resource_property
    if (this.isLegacyResourceCalendarFormat(resourceCalendarsConfig)) {
      for (var i in config) {
        propertyName = i
        break
      }
    }
    return propertyName
  },
  getCalendarIdFromLegacyConfig: function (task, config) {
    if (config) {
      for (var field in config) {
        var resource = config[field]
        if (task[field]) {
          var calendarId = resource[task[field]]
          if (calendarId) {
            return calendarId
          }
        }
      }
    }
    return null
  },
}
