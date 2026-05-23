import __extends from '../../../../utils/extends'

import Super from './base_control'

export default function (gantt) {
  const _super = Super(gantt)

  function TemplateControl() {
    var self = _super.apply(this, arguments) || this
    return self
  }

  __extends(TemplateControl, _super)

  TemplateControl.prototype.render = function (sns) {
    let height = sns.height ? `${sns.height}px` : ''
    return `<div class='gantt_cal_ltext gantt_cal_template gantt_section_${sns.name}' ${height ? `style='height:${height};'` : ''}></div>`
  }

  TemplateControl.prototype.set_value = function (node, value) {
    node.innerHTML = value || ''
  }

  TemplateControl.prototype.get_value = function (node) {
    return node.innerHTML || ''
  }

  TemplateControl.prototype.focus = function () {}

  return TemplateControl
}
