import __extends from '../../../utils/extends'
import Cell from './cell'

var HostCell = (function (_super) {
  'use strict'

  __extends(HostCell, _super)
  function HostCell() {
    var _self = _super.apply(this, arguments) || this
    _self.$name = 'hostCell'
    return _self
  }
  HostCell.prototype.cellIndex = function (id) {
    return 0
  }
  HostCell.prototype.getCells = function () {
    return [this.$cell]
  }
  HostCell.prototype.moveView = function (view, ind) {
    this.$cell = view
    var body = this.$view.querySelector('.gantt_layout_cell')
    body.innerHTML = view.$toHTML()
    view.$fill(body, this)
  }
  HostCell.prototype.cell = function (id) {
    return this.$cell.cell(id)
  }
  HostCell.prototype.$toHTML = function () {
    return _super.prototype.$toHTML.call(this, this.$cell.$toHTML(), 'gantt_layout_z')
  }

  HostCell.prototype.setContentSize = function () {
    var size = this.$lastSize
    this.$cell.setSize(size.contentX, size.contentY)
  }

  HostCell.prototype.$fill = function (node, parent) {
    _super.prototype.$fill.call(this, node, parent)
    this.$cell.$fill(this.$view.querySelector('.gantt_layout_cell'), this)
  }
  return HostCell
})(Cell)

export default HostCell
