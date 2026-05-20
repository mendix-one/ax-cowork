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

  utils.mixin(
    TextEditor.prototype,
    {
      show: function (id, column, config, placeholder) {
        var html = `<div role='cell'><input type='text' name='${column.name}' title='${column.name}'></div>`
        placeholder.innerHTML = html
      },
    },
    true,
  )

  return TextEditor
}
