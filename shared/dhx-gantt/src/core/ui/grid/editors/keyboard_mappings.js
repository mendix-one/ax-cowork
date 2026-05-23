import defaultMapping from './keyboard_mappings/default'
import keyNavMappings from './keyboard_mappings/keyboard_navigation'

export default function (gantt) {
  var mapping = null

  return {
    setMapping: function (map) {
      mapping = map
    },
    getMapping: function () {
      if (mapping) {
        return mapping
      } else if (gantt.config.keyboard_navigation_cells && gantt.ext.keyboardNavigation) {
        return keyNavMappings
      } else {
        return defaultMapping
      }
    },
  }
}
