import BaseFactory from './base'
import * as utils from '../../../../../utils/utils'
import __extends from '../../../../../utils/extends'

export default function (gantt) {
  var BaseEditor = BaseFactory(gantt)

  function TextEditor() {
    var self = BaseEditor.apply(this, arguments) || this
    return self
  }

  __extends(TextEditor, BaseEditor)

  function getFormatter(config) {
    return config.formatter || gantt.ext.formatters.durationFormatter()
  }
  utils.mixin(
    TextEditor.prototype,
    {
      show: function (id, column, config, placeholder) {
        var html = `<div role='cell'><input type='text' name='${column.name}' title='${column.name}'></div>`
        placeholder.innerHTML = html
      },
      set_value: function (value, id, column, node) {
        this.get_input(node).value = getFormatter(column.editor).format(value)
      },
      get_value: function (id, column, node) {
        return getFormatter(column.editor).parse(this.get_input(node).value || '')
      },
    },
    true,
  )

  return TextEditor
}
