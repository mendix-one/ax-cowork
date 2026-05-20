export default function (gantt) {
  gantt.$keyboardNavigation.dispatcher = {
    isActive: false,
    activeNode: null,
    globalNode: new gantt.$keyboardNavigation.GanttNode(),

    enable: function () {
      this.isActive = true
      this.setActiveNode(this.getActiveNode())
    },

    disable: function () {
      this.isActive = false
    },

    isEnabled: function () {
      return !!this.isActive
    },

    getDefaultNode: function () {
      var node
      if (gantt.config.keyboard_navigation_cells) {
        node = new gantt.$keyboardNavigation.TaskCell()
      } else {
        node = new gantt.$keyboardNavigation.TaskRow()
      }

      if (!node.isValid()) {
        node = node.fallback()
      }
      return node
    },

    setDefaultNode: function () {
      this.setActiveNode(this.getDefaultNode())
    },

    getActiveNode: function () {
      var node = this.activeNode
      if (node && !node.isValid()) {
        node = node.fallback()
      }
      return node
    },

    fromDomElement: function (e) {
      var inputs = [gantt.$keyboardNavigation.TaskRow, gantt.$keyboardNavigation.TaskCell, gantt.$keyboardNavigation.HeaderCell]
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].prototype.fromDomElement) {
          var node = inputs[i].prototype.fromDomElement(e)
          if (node) return node
        }
      }
      return null
    },

    focusGlobalNode: function () {
      this.blurNode(this.globalNode)
      this.focusNode(this.globalNode)
    },

    setActiveNode: function (el) {
      //console.trace()
      var focusChanged = true
      if (this.activeNode) {
        if (this.activeNode.compareTo(el)) {
          focusChanged = false
        }
      }
      if (this.isEnabled()) {
        if (focusChanged) this.blurNode(this.activeNode)

        this.activeNode = el
        this.focusNode(this.activeNode, !focusChanged)
      }
    },

    focusNode: function (el, keptFocus) {
      if (el && el.focus) {
        el.focus(keptFocus)
      }
    },
    blurNode: function (el) {
      if (el && el.blur) {
        el.blur()
      }
    },

    keyDownHandler: function (e) {
      if (gantt.$keyboardNavigation.isModal()) return

      if (!this.isEnabled()) return

      if (e.defaultPrevented) {
        return
      }

      var ganttNode = this.globalNode

      var command = gantt.$keyboardNavigation.shortcuts.getCommandFromEvent(e)

      var activeElement = this.getActiveNode()
      var eventFacade = gantt.$keyboardNavigation.facade
      if (eventFacade.callEvent('onKeyDown', [command, e]) === false) {
        return
      }

      if (!activeElement) {
        this.setDefaultNode()
      } else if (activeElement.findHandler(command)) {
        activeElement.doAction(command, e)
      } else if (ganttNode.findHandler(command)) {
        ganttNode.doAction(command, e)
      }
    },
    _timeout: null,
    awaitsFocus: function () {
      return this._timeout !== null
    },
    delay: function (callback, delay) {
      clearTimeout(this._timeout)
      this._timeout = setTimeout(
        gantt.bind(function () {
          this._timeout = null
          callback()
        }, this),
        delay || 1,
      )
    },
    clearDelay: function () {
      clearTimeout(this._timeout)
    },
  }
}
