import BaseFactory from './base'
import * as utils from '../../../../../utils/utils'
import __extends from '../../../../../utils/extends'

export default function (gantt) {
  var BaseEditor = BaseFactory(gantt)

  function NumberEditor() {
    var self = BaseEditor.apply(this, arguments) || this
    return self
  }

  __extends(NumberEditor, BaseEditor)

  utils.mixin(
    NumberEditor.prototype,
    {
      show: function (id, column, config, placeholder) {
        var min = config.min || 0,
          max = config.max || 100

        var html = `<div role='cell'><input type='number' min='${min}' max='${max}' name='${column.name}' title='${column.name}'></div>`
        placeholder.innerHTML = html

        // GS-1914. Do not allow entering alues beyond min and max via keyboard
        placeholder.oninput = function (e) {
          if (+e.target.value < min) {
            e.target.value = min
          }
          if (+e.target.value > max) {
            e.target.value = max
          }
        }
      },
      get_value: function (id, column, node) {
        return this.get_input(node).value || ''
      },
      is_valid: function (value, id, column, node) {
        return !isNaN(parseInt(value, 10))
      },
    },
    true,
  )

  return NumberEditor
}
