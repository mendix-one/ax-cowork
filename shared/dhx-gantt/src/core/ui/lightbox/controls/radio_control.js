import __extends from '../../../../utils/extends'
import Super from './base_control'

export default function (gantt) {
  const _super = Super(gantt)

  function RadioControl() {
    var self = _super.apply(this, arguments) || this

    return self
  }

  __extends(RadioControl, _super)

  RadioControl.prototype.render = function (sns) {
    const height = sns.height ? `${sns.height}px` : ''
    let html = `<div class='gantt_cal_ltext gantt_cal_lradio gantt_section_${sns.name}' ${height ? `style='height:${height};'` : ''}>`

    if (sns.options && sns.options.length) {
      for (var i = 0; i < sns.options.length; i++) {
        html += "<label><input type='radio' value='" + sns.options[i].key + "' name='" + sns.name + "'>" + sns.options[i].label + '</label>'
      }
    }

    html += '</div>'
    return html
  }

  RadioControl.prototype.set_value = function (node, value, ev, sns) {
    var radio

    if (!sns.options || !sns.options.length) return

    radio = node.querySelector("input[type=radio][value='" + value + "']") || node.querySelector("input[type=radio][value='" + sns.default_value + "']")

    if (!radio) return

    if (!node._dhx_onchange && sns.onchange) {
      node.onchange = sns.onchange
      node._dhx_onchange = true
    }

    radio.checked = true
  }

  RadioControl.prototype.get_value = function (node, ev) {
    var result = node.querySelector('input[type=radio]:checked')

    return result ? result.value : ''
  }

  RadioControl.prototype.focus = function (node) {
    gantt._focus(node.querySelector('input[type=radio]'))
  }

  return RadioControl
}
