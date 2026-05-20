import __extends from '../../../utils/extends'
import * as domHelpers from '../utils/dom_helpers'
import Cell from './cell'

var DHXWindow = (function (_super) {
  'use strict'

  __extends(DHXWindow, _super)
  function DHXWindow(parent, config, factory) {
    var _this = _super.apply(this, arguments) || this
    _this._moveHandler = function (e) {
      if (e.clientX <= 0 || e.clientY <= 0) {
        return
      }
      var x = e.pageX - _this._offsets.clickX
      var y = e.pageY - _this._offsets.clickY
      _this._moveWindow(x, y)
    }
    _this._upHandler = function (e) {
      if (e.which !== 1) {
        return
      }
      if (e.target === _this._closeBtn) {
        _this.close()
      }
      domHelpers.removeClassName(_this._header, 'gantt_window_drag')

      _this.$domEvents.detach(document, 'mousemove', _this._moveHandler)
      _this.$domEvents.detach(document, 'mousemove', _this._moveResizer)
      _this.$domEvents.detach(document, 'mouseup', _this._upHandler)

      if (_this._resizer) {
        _this._upResizer()
      }
    }
    _this._moveResizer = function (e) {
      var width = _this._resizerPos.resX - (_this._resizerPos.x - e.pageX)
      var height = _this._resizerPos.resY - (_this._resizerPos.y - e.pageY)
      if (Math.abs(width) < (_this.$config.minWidth || 100) || Math.abs(height) < (_this.$config.maxHeight || 100)) {
        return
      }
      _this._resizer.style.width = width + 'px'
      _this._resizer.style.height = height + 'px'
      _this.$config.width = _this._resizer.offsetWidth
      _this.$config.height = _this._resizer.offsetHeight
    }
    _this._render()
    return _this
  }
  DHXWindow.prototype.destructor = function () {
    if (this.$container && this.$view) {
      domHelpers.removeClassName(this.$container, 'gantt_window_modal gantt_noselect')
      domHelpers.removeNode(this._modalBackground)
      domHelpers.removeNode(this.$view)
    }
    _super.prototype.destructor.call(this)
  }
  DHXWindow.prototype.getLayout = function () {
    return null
  }
  DHXWindow.prototype.cellIndex = function () {
    return null
  }
  DHXWindow.prototype.getCells = function () {
    return null
  }
  DHXWindow.prototype.close = function () {
    this.destructor()
  }
  DHXWindow.prototype._render = function () {
    this.$container = document.body
    // let body = this.$config.content || {};
    // this.content = new ContentCell(null, body);
    var view = domHelpers.insertNode(this.$container, this.$toHTML())
    this._container = view.firstChild
    if (!this.$config.hideHeader) {
      this._header = this._container.childNodes[0]
    }
    if (this.$config.close) {
      this._closeBtn = this._header.childNodes[1].childNodes[0]
    }
    this._body = this._container.childNodes[1] || this._container.childNodes[0]
    if (this.$config.modal) {
      domHelpers.addClassName(this.$container, 'gantt_noselect', true)
      this._modalBackground = domHelpers.insertNode(this.$container, '<div class="gantt_window_modal"></div>')
    }
    if (this.$config.resize) {
      this._resizerBtn = domHelpers.insertNode(this._container, '<div class="gantt_window_content_resizer"></div>')
    }
    this.$fill(view, null)
    this.showAt({ x: this.$config.left, y: this.$config.top })
    this.resize()
  }
  DHXWindow.prototype.resize = function () {
    var windowSize = this.getSize()
    var x = windowSize.width
    var y = windowSize.height
    if (this.$config.fullscreen) {
      x = window.innerWidth
      y = window.innerHeight
      this._moveWindow(0, 0)
    }
    if (x < windowSize.minWidth) {
      x = windowSize.minWidth
    }
    if (x > windowSize.maxWidth) {
      x = windowSize.maxWidth
    }
    if (y < windowSize.minHeight) {
      y = windowSize.minHeight
    }
    if (y > windowSize.maxHeight) {
      y = windowSize.maxHeight
    }
    this.setSize(x, y)
    this._setPosition()
    if (this.$config.hide) {
      this.hide()
    }
  }
  DHXWindow.prototype.hide = function () {
    if (this.$view.parentNode) {
      this.$container.removeChild(this.$view)
      domHelpers.removeClassName(this.$container, 'gantt_window_modal gantt_noselect')
      domHelpers.removeNode(this._modalBackground)
    }
  }
  DHXWindow.prototype.show = function () {
    if (!this.$view.parentNode) {
      this.$config.hide = false
      this.$container.appendChild(this.$view)
      if (this.$config.modal) {
        domHelpers.addClassName(this.$container, 'gantt_noselect', true)
        this._modalBackground = domHelpers.insertNode(this.$container, '<div class="gantt_window_modal"></div>')
      }
      this.resize()
    }
  }
  DHXWindow.prototype.showFullscreen = function (mode) {
    this.$config.fullscreen = mode
    this.resize()
  }
  DHXWindow.prototype.showAt = function (data) {
    var coord = data
    var x
    var y
    var centerX = window.innerWidth / 2 - this.$config.width / 2
    var centerY = window.innerHeight / 2 - this.$config.height / 2
    if (!coord) {
      this._moveWindow(centerX, centerY)
      return
    }
    if (coord.position) {
      x = centerX
      y = centerY
      x += coord.x || 0
      y += coord.y || 0
    } else if (coord.event || coord.node) {
      var node = coord.event ? coord.event.target : coord.node
      var rect = node.getBoundingClientRect()
      var coords = domHelpers.getNodePosition(node)
      var width = this.$config.width
      var height = this.$config.height
      x = rect.left
      y = rect.top
      if (coord.side === 'auto') {
        var left = coords.left >= width
        var right = coords.right >= width
        if (left) {
          coord.side = 'left'
        } else if (right) {
          coord.side = 'right'
        }
        if (left && right) {
          coord.side = coords.left < coords.right ? 'right' : 'left'
        }
        var top = coords.top >= height
        var bottom = coords.bottom >= height
        if (bottom) {
          coord.side = 'bottom'
        } else if (top) {
          coord.side = 'top'
        }
        if (top && bottom) {
          coord.side = coords.top < coords.bottom ? 'bottom' : 'top'
        }
      }
      if (coord.side === 'top') {
        y = rect.top - height
      }
      if (coord.side === 'bottom') {
        y = rect.bottom
      }
      if (coord.side === 'left') {
        x = rect.left - width
      }
      if (coord.side === 'right') {
        x = rect.right
      }
      x += coord.x || 0
      y += coord.y || 0
    } else {
      x = coord.x || 0
      y = coord.y || 0
    }
    this.$config.left = x
    this.$config.top = y
    this._setPosition()
    this.show()
  }
  DHXWindow.prototype._setPosition = function () {
    if (this.$config.fullscreen) {
      return
    }
    this._moveWindow(this.$config.left, this.$config.top)
  }
  DHXWindow.prototype._moveWindow = function (x, y) {
    if (!this.$config.fullscreen) {
      this.$config.left = x
      this.$config.top = y
    }
    this.$view.style.top = y + 'px'
    this.$view.style.left = x + 'px'
  }
  DHXWindow.prototype._setResizer = function (e) {
    this._resizer = domHelpers.insertNode(this._container, '<div class="gantt_window_content_frame"></div>')
    domHelpers.addClassName(this.$view, 'gantt_window_resizing', true)
    this._resizerPos = {
      resX: this._resizer.offsetWidth,
      resY: this._resizer.offsetHeight,
      x: e.pageX,
      y: e.pageY,
    }

    this.$domEvents.attach(document, 'mousemove', this._moveResizer)
  }
  DHXWindow.prototype._upResizer = function () {
    this._container.removeChild(this._resizer)
    domHelpers.addClassName(this.$view, 'gantt_window_resizing')
    this._resizer = null
    this.$config.fullscreen = false
    this.resize()
  }
  DHXWindow.prototype.init = function () {
    var _this = this
    _this.$domEvents.attach(this.$view, 'mousedown', function (e) {
      if (e.which !== 1) {
        return
      }

      _this.$domEvents.attach(document, 'mouseup', _this._upHandler)

      if (e.target === _this._resizerBtn) {
        _this._setResizer(e)
      }
      if (_this.$config.move && !_this.$config.hideHeader) {
        if (e.target !== _this._header) {
          return
        }
        domHelpers.addClassName(_this._header, 'gantt_window_drag', true)
        domHelpers.addClassName(_this.$container, 'gantt_noselect', true)
        _this._offsets = {
          clickX: e.offsetX,
          clickY: e.offsetY,
        }

        _this.$domEvents.attach(document, 'mousemove', _this._moveHandler)
      }
      return false
    })
  }
  DHXWindow.prototype.$toHTML = function () {
    var obj = this.$config
    var content = '' // this.content.$toHTML();
    var closeBtn = this.$config.close ? '<div class="gantt_window_content_header_buttons"><i class="fa fa-close"></i></div>' : ''
    var header = ''
    if (!obj.hideHeader) {
      header = '<div class="gantt_window_content_header">' + obj.header + closeBtn + '</div>'
    }
    var html =
      '<div class=\'gantt_layout_cell gantt_window\'><div class="gantt_window_content">' +
      header +
      '<div class="gantt_window_body"> ' +
      content +
      ' </div></div></div>'
    return html
  }

  DHXWindow.prototype.getSize = function () {
    this._headerHeight = this._header ? this._header.offsetHeight : 0
    var childSize = null // this.content.$getSize();
    var self = _super.prototype.getSize.call(this)
    for (var size in childSize) {
      if (size === 'xw') {
        self[size] = Math.min(childSize[size], self[size])
        continue
      }
      if (size === 'xh') {
        self[size] = Math.min(childSize[size], self[size])
        continue
      }
      if (size === 'w') {
        self[size] = Math.max(childSize[size], self[size]) || 200
        continue
      }
      if (size === 'h') {
        self[size] = Math.max(childSize[size], self[size]) || 200
        continue
      }
      self[size] = Math.max(childSize[size], self[size])
    }
    return self
  }
  DHXWindow.prototype.setSize = function (x, y) {
    this.$view.style.width = x + 'px'
    this.$view.style.height = y + 'px'
    // this.content.setSize(x, y - this._headerHeight);
  }
  return DHXWindow
})(Cell)

export default DHXWindow
