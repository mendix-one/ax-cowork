import createLayerFactory from './render/layer_engine'

import getVisibleTaskRange from './render/viewport/get_visible_bars_range'
import getVisibleLinksRangeFactory from './render/viewport/factory/get_visible_link_range'

import isLinkInViewport from './render/viewport/is_link_in_viewport'

function initLayer(layer, gantt) {
  if (!layer.view) {
    return
  }

  var view = layer.view
  if (typeof view === 'string') {
    view = gantt.$ui.getView(view)
  }

  if (view && view.attachEvent) {
    view.attachEvent('onScroll', function () {
      var state = gantt.$services.getService('state')
      // don't repaint if we're inside batchUpdate, a complete repaint will be called afterwards
      if (!state.getState('batchUpdate').batch_update && !view.$config.$skipSmartRenderOnScroll) {
        if (layer.requestUpdate) {
          layer.requestUpdate()
        }
      }
    })
  }
}

var createLayerEngine = function (gantt) {
  var factory = createLayerFactory(gantt)
  return {
    getDataRender: function (name) {
      return gantt.$services.getService('layer:' + name) || null
    },
    createDataRender: function (config) {
      var name = config.name,
        defaultContainer = config.defaultContainer,
        previusSiblingContainer = config.defaultContainerSibling

      var layers = factory.createGroup(
        defaultContainer,
        previusSiblingContainer,
        function (itemId, item) {
          if (layers.filters) {
            for (var i = 0; i < layers.filters.length; i++) {
              if (layers.filters[i](itemId, item) === false) {
                return false
              }
            }
          } else {
            return true
          }
        },
        initLayer,
      )

      gantt.$services.setService('layer:' + name, function () {
        return layers
      })

      gantt.attachEvent('onGanttReady', function () {
        layers.addLayer() // init layers on start
      })

      return layers
    },
    init: function () {
      var taskLayers = this.createDataRender(
        {
          name: 'task',
          defaultContainer: function () {
            if (gantt.$task_data) {
              return gantt.$task_data
            } else if (gantt.$ui.getView('timeline')) {
              return gantt.$ui.getView('timeline').$task_data
            }
          },
          defaultContainerSibling: function () {
            if (gantt.$task_links) {
              return gantt.$task_links
            } else if (gantt.$ui.getView('timeline')) {
              return gantt.$ui.getView('timeline').$task_links
            }
          },
          filter: function (item) {},
        },
        gantt,
      )

      var linkLayers = this.createDataRender(
        {
          name: 'link',
          defaultContainer: function () {
            if (gantt.$task_data) {
              return gantt.$task_data
            } else if (gantt.$ui.getView('timeline')) {
              return gantt.$ui.getView('timeline').$task_data
            }
          },
        },
        gantt,
      )

      return {
        addTaskLayer: function (config) {
          const rangeFunction = getVisibleTaskRange
          if (typeof config === 'function') {
            config = {
              renderer: {
                render: config,
                getVisibleRange: rangeFunction,
              },
            }
          } else {
            if (config.renderer && !config.renderer.getVisibleRange) {
              config.renderer.getVisibleRange = rangeFunction
            }
          }
          config.view = 'timeline'

          return taskLayers.addLayer(config)
        },

        _getTaskLayers: function () {
          return taskLayers.getLayers()
        },
        removeTaskLayer: function (id) {
          taskLayers.removeLayer(id)
        },

        _clearTaskLayers: function () {
          taskLayers.clear()
        },
        addLinkLayer: function (config) {
          const rangeFunction = getVisibleLinksRangeFactory()
          if (typeof config === 'function') {
            config = {
              renderer: {
                render: config,
                getVisibleRange: rangeFunction,
              },
            }
          } else {
            if (config.renderer && !config.renderer.getVisibleRange) {
              config.renderer.getVisibleRange = rangeFunction
            }
          }
          config.view = 'timeline'
          if (config && config.renderer) {
            if (!config.renderer.getRectangle && !config.renderer.isInViewPort) {
              config.renderer.isInViewPort = isLinkInViewport
            }
          }
          return linkLayers.addLayer(config)
        },

        _getLinkLayers: function () {
          return linkLayers.getLayers()
        },
        removeLinkLayer: function (id) {
          linkLayers.removeLayer(id)
        },

        _clearLinkLayers: function () {
          linkLayers.clear()
        },
      }
    },
  }
}

export default createLayerEngine
