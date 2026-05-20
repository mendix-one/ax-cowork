import isHeadless from '../../utils/is_headless'

const storeRenderCreator = function (name, gantt) {
  const store = gantt.getDatastore(name)

  const itemRepainter = {
    renderItem: function (id, renderer) {
      const renders = renderer.getLayers()

      const item = store.getItem(id)
      if (item && store.isVisible(id)) {
        for (let i = 0; i < renders.length; i++) renders[i].render_item(item)
      }
    },
    renderItems: function (renderer) {
      const renderers = renderer.getLayers()
      for (let i = 0; i < renderers.length; i++) {
        renderers[i].clear()
      }

      let allData = null

      const loadedRanges = {}
      for (let i = 0; i < renderers.length; i++) {
        const layer = renderers[i]
        let layerData
        if (layer.get_visible_range) {
          var range = layer.get_visible_range(store)
          if (range.start !== undefined && range.end !== undefined) {
            var key = range.start + ' - ' + range.end
            if (loadedRanges[key]) {
              layerData = loadedRanges[key]
            } else {
              layerData = store.getIndexRange(range.start, range.end)
              loadedRanges[key] = layerData
            }
          } else if (range.ids !== undefined) {
            layerData = range.ids.map(function (id) {
              return store.getItem(id)
            })
          } else {
            throw new Error("Invalid range returned from 'getVisibleRange' of the layer")
          }
        } else {
          if (!allData) {
            allData = store.getVisibleItems()
          }
          layerData = allData
        }

        if (layer.prepare_data) {
          // GS-1605. Highlight timeline cells below tasks and in an empty chart
          layer.prepare_data(layerData)
        }

        renderers[i].render_items(layerData)
      }
    },
    updateItems: function (layer) {
      if (layer.update_items) {
        let data = []
        if (layer.get_visible_range) {
          var range = layer.get_visible_range(store)
          if (range.start !== undefined && range.end !== undefined) {
            data = store.getIndexRange(range.start, range.end)
          }
          if (range.ids !== undefined) {
            let extraDataArr = range.ids.map(function (id) {
              return store.getItem(id)
            })
            // GS-2502: range.ids might not exist in other datastores
            if (extraDataArr.length > 0) {
              extraDataArr = extraDataArr.filter((element) => element !== undefined)
              data = data.concat(extraDataArr)
            }
          }
          if ((range.start == undefined || range.end == undefined) && range.ids == undefined) {
            throw new Error("Invalid range returned from 'getVisibleRange' of the layer")
          }
        } else {
          data = store.getVisibleItems()
        }

        if (layer.prepare_data) {
          // GS-1605. Highlight timeline cells below tasks and in an empty chart
          layer.prepare_data(data, layer)
        }
        layer.update_items(data)
      }
    },
  }

  store.attachEvent('onStoreUpdated', function (id, item, action) {
    if (isHeadless(gantt)) {
      return true
    }

    const renderer = gantt.$services.getService('layers').getDataRender(name)
    if (renderer) {
      renderer.onUpdateRequest = function (layer) {
        itemRepainter.updateItems(layer)
      }
    }
  })

  function skipRepaint(gantt) {
    const state = gantt.$services.getService('state')
    if (state.getState('batchUpdate').batch_update) {
      return true
    } else {
      return false
    }
  }

  store.attachEvent('onStoreUpdated', function (id, item, action) {
    if (skipRepaint(gantt)) {
      return
    }
    if (!id || action == 'move' || action == 'delete') {
      store.callEvent('onBeforeRefreshAll', [])
      store.callEvent('onAfterRefreshAll', [])
    } else {
      store.callEvent('onBeforeRefreshItem', [item.id])
      store.callEvent('onAfterRefreshItem', [item.id])
    }
  })

  store.attachEvent('onAfterRefreshAll', function () {
    if (isHeadless(gantt)) {
      return true
    }

    const renderer = gantt.$services.getService('layers').getDataRender(name)
    if (renderer && !skipRepaint(gantt)) {
      itemRepainter.renderItems(renderer)
    }
  })
  store.attachEvent('onAfterRefreshItem', function (id) {
    if (isHeadless(gantt)) {
      return true
    }

    const renderer = gantt.$services.getService('layers').getDataRender(name)
    if (renderer) {
      itemRepainter.renderItem(id, renderer)
    }
  })

  // TODO: probably can be done more in a more efficient way
  store.attachEvent('onItemOpen', function () {
    if (isHeadless(gantt) || store.isSilent()) {
      return true
    }

    gantt.render()
  })

  store.attachEvent('onItemClose', function () {
    if (isHeadless(gantt) || store.isSilent()) {
      return true
    }

    gantt.render()
  })

  function refreshId(renders, oldId, newId, item) {
    for (let i = 0; i < renders.length; i++) {
      renders[i].change_id(oldId, newId)
    }
  }

  store.attachEvent('onIdChange', function (oldId, newId) {
    if (isHeadless(gantt)) {
      return true
    }

    // in case of linked datastores (tasks <-> links), id change should recalculate something in linked datastore before any repaint
    // use onBeforeIdChange for this hook.
    // TODO: use something more reasonable instead
    store.callEvent('onBeforeIdChange', [oldId, newId])

    if (skipRepaint(gantt)) {
      return
    }
    if (!store.isSilent()) {
      const renderer = gantt.$services.getService('layers').getDataRender(name)
      if (renderer) {
        // missing check for renderer GS-1814
        refreshId(renderer.getLayers(), oldId, newId, store.getItem(newId))
        itemRepainter.renderItem(newId, renderer)
      } else {
        // GS-1814 repaint ui to apply new id when the datastore don't have own renderer
        gantt.render()
      }
    }
  })
}

export default {
  bindDataStore: storeRenderCreator,
}
