import * as utils from '../../../../../utils/utils'
import __extends from '../../../../../utils/extends'
import BaseFactory from './base'

export default function (gantt) {
  var BaseEditor = BaseFactory(gantt)

  var html5DateFormat = '%Y-%m-%d'

  var dateToStr = null
  var strToDate = null

  function init() {
    if (!dateToStr) {
      dateToStr = gantt.date.date_to_str(html5DateFormat)
    }
    if (!strToDate) {
      strToDate = gantt.date.str_to_date(html5DateFormat)
    }
  }

  function DateEditor() {
    var self = BaseEditor.apply(this, arguments) || this

    return self
  }

  __extends(DateEditor, BaseEditor)

  utils.mixin(
    DateEditor.prototype,
    {
      show: function (id, column, config, placeholder) {
        init()
        var minValue = null
        var maxValue = null

        if (typeof config.min === 'function') {
          minValue = config.min(id, column)
        } else {
          minValue = config.min
        }

        if (typeof config.max === 'function') {
          maxValue = config.max(id, column)
        } else {
          maxValue = config.max
        }

        var minAttr = minValue ? " min='" + dateToStr(minValue) + "' " : ''
        var maxAttr = maxValue ? " max='" + dateToStr(maxValue) + "' " : ''
        var html = `<div style='width:140px' role='cell'><input type='date' ${minAttr} ${maxAttr} name='${column.name}' title='${column.name}'></div>`
        placeholder.innerHTML = html

        // GS-1914. Do not allow entering alues beyond min and max via keyboard
        placeholder.oninput = function (e) {
          if (e.target.value && (minValue || maxValue)) {
            if (+gantt.date.str_to_date('%Y-%m-%d')(e.target.value) < +minValue) {
              e.target.value = gantt.date.date_to_str('%Y-%m-%d')(minValue)
            }
            if (+gantt.date.str_to_date('%Y-%m-%d')(e.target.value) > +maxValue) {
              e.target.value = gantt.date.date_to_str('%Y-%m-%d')(maxValue)
            }
          }
        }
      },
      set_value: function (value, id, column, node) {
        if (value && value.getFullYear) {
          this.get_input(node).value = dateToStr(value)
        } else {
          this.get_input(node).value = value
        }
      },
      is_valid: function (value, id, column, node) {
        if (!value || isNaN(value.getTime())) return false
        return true
      },
      get_value: function (id, column, node) {
        var parsed
        try {
          parsed = strToDate(this.get_input(node).value || '')
        } catch (e) {
          parsed = null // return null will cancel changes
        }

        return parsed
      },
    },
    true,
  )

  return DateEditor
}
