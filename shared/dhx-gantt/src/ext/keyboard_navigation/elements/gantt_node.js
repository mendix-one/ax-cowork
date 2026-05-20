export default function (gantt) {
  gantt.$keyboardNavigation.GanttNode = function () {}

  gantt.$keyboardNavigation.GanttNode.prototype = gantt._compose(gantt.$keyboardNavigation.EventHandler, {
    focus: function () {
      gantt.focus()
    },

    blur: function () {},

    isEnabled: function () {
      return gantt.$container.hasAttribute('tabindex')
    },

    scrollHorizontal: function scrollHorizontal(dir) {
      var date = gantt.dateFromPos(gantt.getScrollState().x)
      var scale = gantt.getScale()
      var step = dir < 0 ? -scale.step : scale.step
      date = gantt.date.add(date, step, scale.unit)
      gantt.scrollTo(gantt.posFromDate(date))
    },

    scrollVertical: function scrollVertical(dir) {
      var top = gantt.getScrollState().y
      var step = gantt.config.row_height
      gantt.scrollTo(null, top + (dir < 0 ? -1 : 1) * step)
    },

    keys: {
      'alt+left': function (e) {
        this.scrollHorizontal(-1)
      },
      'alt+right': function (e) {
        this.scrollHorizontal(1)
      },
      'alt+up': function (e) {
        this.scrollVertical(-1)
      },
      'alt+down': function (e) {
        this.scrollVertical(1)
      },

      // undo
      'ctrl+z': function () {
        if (gantt.undo) gantt.undo()
      },

      // redo
      'ctrl+r': function () {
        if (gantt.redo) gantt.redo()
      },
    },
  })

  gantt.$keyboardNavigation.GanttNode.prototype.bindAll(gantt.$keyboardNavigation.GanttNode.prototype.keys)
}
