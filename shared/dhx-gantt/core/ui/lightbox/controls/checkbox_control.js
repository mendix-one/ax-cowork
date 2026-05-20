import * as helpers from '../../../../utils/helpers'
import __extends from '../../../../utils/extends'
import BaseConstrutor from './base_control'

export default function (gantt) {
  var _super = BaseConstrutor(gantt)

  function CheckboxControl() {
    var self = _super.apply(this, arguments) || this

    return self
  }

  __extends(CheckboxControl, _super)

  CheckboxControl.prototype.render = function (sns) {
    const height = sns.height ? `height:${sns.height}px;` : ''
    let html = `<div class='gantt_cal_ltext gantt_cal_lcheckbox gantt_section_${sns.name}' ${height ? `style='${height}'` : ''}>`

    if (sns.options && sns.options.length) {
      for (var i = 0; i < sns.options.length; i++) {
        html += "<label><input type='checkbox' value='" + sns.options[i].key + "' name='" + sns.name + "'>" + sns.options[i].label + '</label>'
      }
    } else {
      sns.single_value = true
      html += "<label><input type='checkbox' name='" + sns.name + "'></label>"
    }
    html += '</div>'
    return html
  }

  CheckboxControl.prototype.set_value = function (node, value, ev, sns) {
    var checkboxes = Array.prototype.slice.call(node.querySelectorAll('input[type=checkbox]'))

    if (!node._dhx_onchange && sns.onchange) {
      node.onchange = sns.onchange
      node._dhx_onchange = true
    }

    if (sns.single_value) {
      var box = checkboxes[0]
      box.checked = !!value
    } else {
      helpers.forEach(checkboxes, function (entry) {
        entry.checked = value ? value.indexOf(entry.value) >= 0 : false
      })
    }
  }

  CheckboxControl.prototype.get_value = function (node, task, sns) {
    if (sns.single_value) {
      var box = node.querySelector('input[type=checkbox]')
      return box.checked
    } else {
      return helpers.arrayMap(Array.prototype.slice.call(node.querySelectorAll('input[type=checkbox]:checked')), function (entry) {
        return entry.value
      })
    }
  }

  CheckboxControl.prototype.focus = function (node) {
    gantt._focus(node.querySelector('input[type=checkbox]'))
  }

  return CheckboxControl
}
