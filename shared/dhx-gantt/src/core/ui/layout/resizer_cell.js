import __extends from '../../../utils/extends'
import * as domHelpers from '../utils/dom_helpers'
import * as utils from '../../../utils/utils'
import Cell from './cell'

var ResizerCell = (function (_super) {
  'use strict'

  __extends(ResizerCell, _super)
  function ResizerCell(parent, config, factory) {
    var _this = _super.apply(this, arguments) || this

    var startBackSize, startFrontSize

    function getPageCoordinates(e) {
      var x = e.pageX
      var y = e.pageY

      if (e.touches) {
        x = e.touches[0].pageX
        y = e.touches[0].pageY
      }

      return { x: x, y: y }
    }

    _this._moveHandler = function (e) {
      _this._moveResizer(_this._resizer, getPageCoordinates(e).x, getPageCoordinates(e).y)
    }
    _this._upHandler = function (e) {
      var newSizes = _this._getNewSizes()
      if (_this.callEvent('onResizeEnd', [startBackSize, startFrontSize, newSizes ? newSizes.back : 0, newSizes ? newSizes.front : 0]) !== false) {
        _this._setSizes()
      }

      _this._setBackground(false)
      _this._clearResizer()
      _this._clearListeneres()

      if (e.touches) _this.$gantt._prevent_touch_scroll = false
    }

    _this._clearListeneres = function () {
      this.$domEvents.detach(document, 'mouseup', _this._upHandler)
      this.$domEvents.detach(document, 'mousemove', _this._moveHandler)
      this.$domEvents.detach(document, 'mousemove', _this._startOnMove)
      this.$domEvents.detach(document, 'mouseup', _this._cancelDND)

      this.$domEvents.detach(document, 'touchend', _this._upHandler)
      this.$domEvents.detach(document, 'touchmove', _this._startOnMove)
      this.$domEvents.detach(document, 'touchstart', _this._downHandler)
    }

    _this._callStartDNDEvent = function () {
      if (this._xMode) {
        startBackSize = this._behind.$config.width || this._behind.$view.offsetWidth
        startFrontSize = this._front.$config.width || this._front.$view.offsetWidth
      } else {
        startBackSize = this._behind.$config.height || this._behind.$view.offsetHeight
        startFrontSize = this._front.$config.height || this._front.$view.offsetHeight
      }

      if (_this.callEvent('onResizeStart', [startBackSize, startFrontSize]) === false) {
        return false
      }
    }

    _this._startDND = function (e) {
      var res = this._callStartDNDEvent()
      if (res === false) {
        return
      }

      var stop = false
      this._eachGroupItem(function (resizer) {
        resizer._getSiblings()
        if (resizer._callStartDNDEvent() === false) {
          stop = true
        }
      })

      if (stop) {
        return
      }

      _this._moveHandler(e)

      _this.$domEvents.attach(document, 'mousemove', _this._moveHandler)
      _this.$domEvents.attach(document, 'mouseup', _this._upHandler)
    }

    _this._cancelDND = function () {
      _this._setBackground(false)
      _this._clearResizer()
      _this._clearListeneres()
    }

    _this._startOnMove = function (e) {
      // don't scroll the timeline on touch devices
      if (e.touches) {
        _this.$gantt._touch_drag = true
        // GS-45. Don't scroll the timeline while dragging something on touch devices (e.g. resizer)
        _this.$gantt._prevent_touch_scroll = true
      }

      if (_this._isPosChanged(e)) {
        _this._clearListeneres()
        _this._startDND(e)
      }
    }

    _this._downHandler = function (e) {
      _this._getSiblings()

      if (_this._behind.$config.collapsed || _this._front.$config.collapsed) {
        return
      }

      _this._setBackground(true)
      _this._resizer = _this._setResizer()

      _this._positions = {
        x: getPageCoordinates(e).x,
        y: getPageCoordinates(e).y,
        timestamp: Date.now(),
      }

      _this.$domEvents.attach(document, 'mousemove', _this._startOnMove)
      _this.$domEvents.attach(document, 'mouseup', _this._cancelDND)
    }
    _this.$name = 'resizer'
    return _this
  }
  ResizerCell.prototype.init = function () {
    var _this = this
    _super.prototype.init.call(this)
    this._xMode = this.$config.mode === 'x'
    if (this._xMode && !this.$config.width) {
      this.$config.width = this.$config.minWidth = 1
    } else if (!this._xMode && !this.$config.height) {
      this.$config.height = this.$config.minHeight = 1
    }

    this.$config.margin = -1

    this.$domEvents.attach(this.$view, 'mousedown', _this._downHandler)

    this.$domEvents.attach(this.$view, 'touchstart', _this._downHandler)
    this.$domEvents.attach(this.$view, 'touchmove', _this._startOnMove)
    this.$domEvents.attach(this.$view, 'touchend', _this._upHandler)
  }
  ResizerCell.prototype.$toHTML = function () {
    var mode = this.$config.mode
    var css = this.$config.css || ''
    return (
      "<div class='gantt_layout_cell gantt_resizer gantt_resizer_" +
      mode +
      "'><div class='gantt_layout_content gantt_resizer_" +
      mode +
      (css ? ' ' + css : '') +
      "'></div></div>"
    )
  }

  ResizerCell.prototype._clearResizer = function () {
    if (this._resizer) {
      if (this._resizer.parentNode) {
        this._resizer.parentNode.removeChild(this._resizer)
      }
      this._resizer = null
    }
  }

  ResizerCell.prototype._isPosChanged = function (e) {
    if (!this._positions) {
      return false
    }

    if (Math.abs(this._positions.x - e.pageX) > 3 || Math.abs(this._positions.y - e.pageY) > 3) {
      return true
    }

    if (Date.now() - this._positions.timestamp > 300) {
      return true
    }

    return false
  }

  ResizerCell.prototype._getSiblings = function () {
    var cells = this.$parent.getCells()

    if (this.$config.prev) {
      this._behind = this.$factory.getView(this.$config.prev)
      if (!(this._behind instanceof Cell)) {
        this._behind = this._behind.$parent
      }
    }
    if (this.$config.next) {
      this._front = this.$factory.getView(this.$config.next)
      if (!(this._front instanceof Cell)) {
        this._front = this._behind.$parent
      }
    }

    for (var i = 0; i < cells.length; i++) {
      if (this === cells[i]) {
        if (!this._behind) this._behind = cells[i - 1]
        if (!this._front) this._front = cells[i + 1]
      }
    }
  }
  ResizerCell.prototype._setBackground = function (state) {
    var classes = 'gantt_resizing'
    if (!state) {
      domHelpers.removeClassName(this._behind.$view, classes)
      domHelpers.removeClassName(this._front.$view, classes)
      document.body.classList.remove('gantt_noselect')
      return
    }
    domHelpers.addClassName(this._behind.$view, classes, true)
    domHelpers.addClassName(this._front.$view, classes, true)
    document.body.classList.add('gantt_noselect')
  }
  ResizerCell.prototype._setResizer = function () {
    var resizer = document.createElement('div')
    resizer.className = 'gantt_resizer_stick'
    this.$view.appendChild(resizer)
    this.$view.style.overflow = 'visible'
    resizer.style.height = this.$view.style.height
    return resizer
  }

  ResizerCell.prototype._getDirection = function (x, y) {
    var shift
    if (this._xMode) {
      shift = x - this._positions.x
    } else {
      shift = y - this._positions.y
    }
    return shift ? (shift < 0 ? -1 : 1) : 0
  }

  ResizerCell.prototype._getResizePosition = function (x, y) {
    var size
    var behindSide
    var behindMin
    var frontSide
    var frontMin
    if (this._xMode) {
      size = x - this._positions.x
      behindSide = this._behind.$config.width || this._behind.$view.offsetWidth
      frontSide = this._front.$config.width || this._front.$view.offsetWidth
      behindMin = this._behind.$config.minWidth
      frontMin = this._front.$config.minWidth
    } else {
      size = y - this._positions.y
      behindSide = this._behind.$config.height || this._behind.$view.offsetHeight
      frontSide = this._front.$config.height || this._front.$view.offsetHeight
      behindMin = this._front.$config.minHeight
      frontMin = this._front.$config.minHeight
    }
    var direction = this._getDirection(x, y)
    var newBehindSide, newFrontSide

    if (direction === -1) {
      newFrontSide = frontSide - size
      newBehindSide = behindSide - Math.abs(size)

      if (frontSide - size > this._front.$config.maxWidth) {
        return
      }
      if (Math.abs(size) >= behindSide) {
        size = -Math.abs(behindSide - 2)
      }
      // if min width
      if (behindSide - Math.abs(size) <= behindMin) {
        //this._resizer.style.background = "red";
        size = -Math.abs(behindSide - behindMin)
      }
    } else {
      newFrontSide = frontSide - Math.abs(size)
      newBehindSide = behindSide + size

      if (behindSide + size > this._behind.$config.maxWidth) {
        size = this._behind.$config.maxWidth - behindSide
        // return;
      }
      if (Math.abs(size) >= frontSide) {
        size = frontSide - 2
      }
      // if min width
      if (frontSide - Math.abs(size) <= frontMin) {
        size = Math.abs(frontSide - frontMin)
      }
    }

    if (direction === -1) {
      newFrontSide = frontSide - size
      newBehindSide = behindSide - Math.abs(size)
    } else {
      newFrontSide = frontSide - Math.abs(size)
      newBehindSide = behindSide + size
    }

    return {
      size: size,
      newFrontSide: newFrontSide,
      newBehindSide: newBehindSide,
    }
  }

  ResizerCell.prototype._getGroupName = function () {
    this._getSiblings()
    return this._front.$config.group || this._behind.$config.group
  }

  ResizerCell.prototype._eachGroupItem = function (callback, master) {
    var layout = this.$factory.getView('main')

    var group = this._getGroupName()

    var resizers = layout.getCellsByType('resizer')
    for (var i = 0; i < resizers.length; i++) {
      if (resizers[i]._getGroupName() == group && resizers[i] != this) {
        callback.call(master || this, resizers[i])
      }
    }
  }

  ResizerCell.prototype._getGroupResizePosition = function (x, y) {
    var sizes = this._getResizePosition(x, y)

    if (!this._getGroupName()) {
      return sizes
    }

    var positions = [sizes]

    this._eachGroupItem(function (resizer) {
      resizer._getSiblings()
      var pos = utils.copy(this._positions)
      if (this._xMode) {
        pos.x += resizer._behind.$config.width - this._behind.$config.width
      } else {
        pos.y += resizer._behind.$config.height - this._behind.$config.height
      }
      resizer._positions = pos
      positions.push(resizer._getResizePosition(x, y))
    })

    var minMax
    for (var i = 0; i < positions.length; i++) {
      if (!positions[i]) return
      if (minMax === undefined) {
        minMax = positions[i]
      } else if (positions[i].newBehindSide > minMax.newBehindSide) {
        minMax = positions[i]
      }
    }

    /*	if(minMax != sizes){
			minMax.size = minMax.size;
		}*/

    return minMax
  }

  ResizerCell.prototype._moveResizer = function (av, x, y) {
    if (x === 0) {
      return
    }

    var sizes = this._getGroupResizePosition(x, y)
    if (!sizes) return

    if (Math.abs(sizes.size) === 1) {
      return
    }
    if (this._xMode) {
      av.style.left = sizes.size + 'px'
      this._positions.nextX = sizes.size || 0
    } else {
      av.style.top = sizes.size + 'px'
      this._positions.nextY = sizes.size || 0
    }

    this.callEvent('onResize', [sizes.newBehindSide, sizes.newFrontSide])
  }
  ResizerCell.prototype._setGravity = function (cell) {
    var size = this._xMode ? 'offsetWidth' : 'offsetHeight'
    var position = this._xMode ? this._positions.nextX : this._positions.nextY
    var frontSize = this._front.$view[size]
    var behindSize = this._behind.$view[size]
    var frontG = this._front.getSize().gravity
    var behindG = this._behind.getSize().gravity
    var newFrontG = ((frontSize - position) / frontSize) * frontG
    var newBehindG = ((behindSize + position) / behindSize) * behindG
    if (cell !== 'front') {
      this._front.$config.gravity = newFrontG
    }
    if (cell !== 'behind') {
      this._behind.$config.gravity = newBehindG
    }
  }

  /*	ResizerCell.prototype.setSize = function(){
		_super.apply(this, arguments)
	};*/

  ResizerCell.prototype._getNewSizes = function () {
    var behindSize, frontSize, position

    if (this._xMode) {
      behindSize = this._behind.$config.width
      frontSize = this._front.$config.width
      position = this._positions.nextX
    } else {
      behindSize = this._behind.$config.height
      frontSize = this._front.$config.height
      position = this._positions.nextY
    }

    if (!frontSize && !behindSize) {
      return null
    }

    return {
      front: frontSize ? frontSize - position || 1 : 0,
      back: behindSize ? behindSize + position || 1 : 0,
    }
  }

  ResizerCell.prototype._assignNewSizes = function (newSizes) {
    this._getSiblings()
    var side = this._xMode ? 'width' : 'height'

    // if only gravity cells
    if (!newSizes) {
      this._setGravity()
    } else {
      if (!newSizes.front) {
        this._setGravity('behind')
      } else {
        this._front.$config[side] = newSizes.front
      }
      if (!newSizes.back) {
        this._setGravity('front')
      } else {
        this._behind.$config[side] = newSizes.back
      }
    }
  }

  ResizerCell.prototype._setSizes = function () {
    if (this._resizer) {
      this.$view.removeChild(this._resizer)
    }
    var newSizes = this._getNewSizes()

    if (this._positions.nextX || this._positions.nextY) {
      this._assignNewSizes(newSizes)

      var side = this._xMode ? 'width' : 'height'
      var resizeValue
      if (!newSizes || !newSizes.front) {
        if (this._front.$config.group) {
          resizeValue = {
            value: this._front.$config.gravity,
            isGravity: true,
          }
          this.$gantt.$layout._syncCellSizes(this._front.$config.group, resizeValue)
        }
      }
      if (!newSizes || !newSizes.back) {
        if (this._behind.$config.group) {
          resizeValue = {
            value: this._behind.$config.gravity,
            isGravity: true,
          }
          this.$gantt.$layout._syncCellSizes(this._behind.$config.group, resizeValue)
        }
      }

      if (newSizes) {
        if (newSizes.front) {
          if (this._front.$config.group) {
            resizeValue = {
              value: this._front.$config[side],
              isGravity: false,
            }
            this.$gantt.$layout._syncCellSizes(this._front.$config.group, resizeValue)
          }
        } else if (newSizes.back) {
          if (this._behind.$config.group) {
            resizeValue = {
              value: this._behind.$config[side],
              isGravity: false,
            }
            this.$gantt.$layout._syncCellSizes(this._behind.$config.group, resizeValue)
          }
        }
      }

      if (this._getGroupName()) {
        this.$factory.getView('main').resize()
      } else {
        this.$parent.resize()
      }
    }
  }
  return ResizerCell
})(Cell)

export default ResizerCell
