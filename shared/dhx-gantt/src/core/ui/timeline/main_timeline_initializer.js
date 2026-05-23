import * as utils from '../../../utils/utils'
import taskDnD from './tasks_dnd'
import linkDnD from './links_dnd'
import * as domHelpers from '../utils/dom_helpers'
import MouseDelegates from '../mouse_event_container'

var initializer = (function () {
  return function (gantt) {
    var services = gantt.$services
    return {
      onCreated: function (timeline) {
        var config = timeline.$config
        config.bind = utils.defined(config.bind) ? config.bind : 'task'
        config.bindLinks = utils.defined(config.bindLinks) ? config.bindLinks : 'link'

        timeline._linksDnD = linkDnD.createLinkDND()
        timeline._tasksDnD = taskDnD.createTaskDND()
        timeline._tasksDnD.extend(timeline)

        this._mouseDelegates = MouseDelegates(gantt)
      },
      onInitialized: function (timeline) {
        this._attachDomEvents(gantt)

        this._attachStateProvider(gantt, timeline)

        timeline._tasksDnD.init(timeline, gantt)
        timeline._linksDnD.init(timeline, gantt)

        if (timeline.$config.id == 'timeline') {
          this.extendDom(timeline)
        }
      },
      onDestroyed: function (timeline) {
        this._clearDomEvents(gantt)
        this._clearStateProvider(gantt)
        if (timeline._tasksDnD) {
          timeline._tasksDnD.destructor()
        }
      },
      extendDom: function (timeline) {
        gantt.$task = timeline.$task
        gantt.$task_scale = timeline.$task_scale
        gantt.$task_data = timeline.$task_data
        gantt.$task_bg = timeline.$task_bg
        gantt.$task_links = timeline.$task_links
        gantt.$task_bars = timeline.$task_bars
      },

      _clearDomEvents: function () {
        this._mouseDelegates.destructor()
        this._mouseDelegates = null
      },

      _attachDomEvents: function (gantt) {
        function _delete_link_handler(id, e) {
          if (id && this.callEvent('onLinkDblClick', [id, e])) {
            var link = this.getLink(id)
            if (this.isReadonly(link)) return

            var title = ''
            var question = this.locale.labels.link + ' ' + this.templates.link_description(this.getLink(id)) + ' ' + this.locale.labels.confirm_link_deleting

            window.setTimeout(
              function () {
                gantt._delete_link_confirm({
                  link: link,
                  message: question,
                  title: title,
                  callback: function () {
                    gantt.deleteLink(id)
                  },
                })
              },
              this.config.touch ? 300 : 1,
            )
          }
        }

        this._mouseDelegates.delegate(
          'click',
          'gantt_task_link',
          gantt.bind(function (e, trg) {
            var id = this.locate(e, this.config.link_attribute)
            if (id) {
              this.callEvent('onLinkClick', [id, e])
            }
          }, gantt),
          this.$task,
        )

        this._mouseDelegates.delegate(
          'click',
          'gantt_scale_cell',
          gantt.bind(function (e, trg) {
            var pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data)
            var date = gantt.dateFromPos(pos.x)
            var coll = Math.floor(gantt.columnIndexByDate(date))

            var coll_date = gantt.getScale().trace_x[coll]

            gantt.callEvent('onScaleClick', [e, coll_date])
          }, gantt),
          this.$task,
        )

        this._mouseDelegates.delegate(
          'doubleclick',
          'gantt_task_link',
          gantt.bind(function (e, id, trg) {
            var id = this.locate(e, gantt.config.link_attribute)
            _delete_link_handler.call(this, id, e)
          }, gantt),
          this.$task,
        )

        this._mouseDelegates.delegate(
          'doubleclick',
          'gantt_link_point',
          gantt.bind(function (e, id, trg) {
            var id = this.locate(e),
              task = this.getTask(id)

            var link = null
            if (trg.parentNode && domHelpers.getClassName(trg.parentNode)) {
              if (domHelpers.getClassName(trg.parentNode).indexOf('_left') > -1) {
                link = task.$target[0]
              } else {
                link = task.$source[0]
              }
            }
            if (link) _delete_link_handler.call(this, link, e)
            return false
          }, gantt),
          this.$task,
        )
      },

      _attachStateProvider: function (gantt, timeline) {
        var self = timeline
        var state = services.getService('state')
        state.registerProvider('tasksTimeline', function () {
          return {
            scale_unit: self._tasks ? self._tasks.unit : undefined,
            scale_step: self._tasks ? self._tasks.step : undefined,
          }
        })
      },

      _clearStateProvider: function () {
        var state = services.getService('state')
        state.unregisterProvider('tasksTimeline')
      },
    }
  }
})()

export default initializer
