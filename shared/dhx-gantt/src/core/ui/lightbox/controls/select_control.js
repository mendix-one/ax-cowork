import __extends from '../../../../utils/extends'
import htmlHelpers from '../../utils/html_helpers'

import Super from './base_control'

export default function (gantt) {
  const _super = Super(gantt)

  function SelectControl() {
    var self = _super.apply(this, arguments) || this

    return self
  }

  __extends(SelectControl, _super)

  SelectControl.prototype.render = function (sns) {
    const height = sns.height ? `height:${sns.height}px;` : ''
    let html = `<div class='gantt_cal_ltext gantt_section_${sns.name}' ${height ? `style='${height}'` : ''}>`

    html += htmlHelpers.getHtmlSelect(sns.options, [
      { key: 'style', value: 'width:100%;' },
      { key: 'title', value: sns.name },
    ])
    html += '</div>'
    return html
  }

  SelectControl.prototype.set_value = function (node, value, ev, sns) {
    var select = node.firstChild
    if (!select._dhx_onchange && sns.onchange) {
      select.onchange = sns.onchange
      select._dhx_onchange = true
    }
    if (typeof value === 'undefined') value = (select.options[0] || {}).value
    select.value = value || ''
  }

  SelectControl.prototype.get_value = function (node) {
    return node.firstChild.value
  }

  SelectControl.prototype.focus = function (node) {
    var a = node.firstChild
    gantt._focus(a, true)
  }

  return SelectControl
}
