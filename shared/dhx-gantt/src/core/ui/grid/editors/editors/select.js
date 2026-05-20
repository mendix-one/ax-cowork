import BaseFactory from './base'
import * as utils from '../../../../../utils/utils'
import __extends from '../../../../../utils/extends'

export default function (gantt) {
  var BaseEditor = BaseFactory(gantt)

  function SelectEditor() {
    var self = BaseEditor.apply(this, arguments) || this
    return self
  }

  __extends(SelectEditor, BaseEditor)

  utils.mixin(
    SelectEditor.prototype,
    {
      show: function (id, column, config, placeholder) {
        var html = `<div role='cell'><select name='${column.name}' title='${column.name}'>`
        var optionsHtml = [],
          options = config.options || []

        for (var i = 0; i < options.length; i++) {
          optionsHtml.push("<option value='" + config.options[i].key + "'>" + options[i].label + '</option>')
        }

        html += optionsHtml.join('') + '</select></div>'
        placeholder.innerHTML = html
      },
      get_input: function (node) {
        return node.querySelector('select')
      },
    },
    true,
  )

  return SelectEditor
}
