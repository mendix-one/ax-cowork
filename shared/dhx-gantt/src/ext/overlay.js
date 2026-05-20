export default function (gantt) {
  if (!gantt.ext) {
    gantt.ext = {}
  }

  gantt.ext.overlay = {}

  var overlays = {}

  function createOverlay(id, render) {
    var div = document.createElement('div')
    div.setAttribute('data-overlay-id', id)
    var css = 'gantt_overlay'
    div.className = css
    div.style.display = 'none'
    return {
      id: id,
      render: render,
      isVisible: false,
      isAttached: false,
      node: div,
    }
  }

  function initOverlayArea() {
    if (!gantt.$task_data) {
      return
    }
    gantt.event(gantt.$task_data, 'scroll', function (e) {
      if (!gantt.ext.$overlay_area) {
        return
      }
      gantt.ext.$overlay_area.style.top = e.target.scrollTop + 'px'
    })
    var overlayArea = document.createElement('div')
    overlayArea.className = 'gantt_overlay_area'
    gantt.$task_data.appendChild(overlayArea)
    gantt.ext.$overlay_area = overlayArea

    attachUnnattached()
  }

  function attachUnnattached() {
    for (var i in overlays) {
      var overlay = overlays[i]
      if (!overlay.isAttached) {
        attachOverlay(overlay)
      }
    }
  }

  function attachOverlay(overlay) {
    gantt.ext.$overlay_area.appendChild(overlay.node)
    overlay.isAttached = true
  }

  function showOverlayArea() {
    gantt.ext.$overlay_area.style.display = 'block'
  }

  function hideIfNoVisibleLayers() {
    var any = false
    for (var i in overlays) {
      var overlay = overlays[i]
      if (overlay.isVisible) {
        any = true
        break
      }
    }

    if (!any) {
      gantt.ext.$overlay_area.style.display = 'none'
    }
  }

  gantt.attachEvent('onBeforeGanttRender', function () {
    //GS-2230: in case if `getGanttInstance` created without container
    if (!gantt.$root) return
    if (!gantt.ext.$overlay_area) {
      initOverlayArea()
    }

    if (!gantt.ext.$overlay_area.isConnected) {
      gantt.ext.$overlay_area.innerHTML = ''
      gantt.ext.$overlay_area.remove()
      gantt.ext.$overlay_area = null
      initOverlayArea()

      for (var i in overlays) {
        overlays[i].isAttached = false
      }
    }

    attachUnnattached()
    hideIfNoVisibleLayers()
  })

  gantt.attachEvent('onGanttReady', function () {
    //GS-2230: in case if `getGanttInstance` created without container
    if (!gantt.$root) return
    initOverlayArea()
    attachUnnattached()
    hideIfNoVisibleLayers()
  })

  gantt.ext.overlay.addOverlay = function (render, id) {
    var id = id || gantt.uid()
    overlays[id] = createOverlay(id, render)
    return id
  }

  gantt.ext.overlay.deleteOverlay = function (id) {
    if (!overlays[id]) return false

    delete overlays[id]
    hideIfNoVisibleLayers()
    return true
  }

  gantt.ext.overlay.getOverlaysIds = function () {
    var ids = []
    for (var i in overlays) {
      ids.push(i)
    }
    return ids
  }

  gantt.ext.overlay.refreshOverlay = function (id) {
    showOverlayArea()
    overlays[id].isVisible = true
    overlays[id].node.innerHTML = ''
    overlays[id].node.style.display = 'block'
    overlays[id].render(overlays[id].node)
  }

  gantt.ext.overlay.showOverlay = function (id) {
    showOverlayArea()
    this.refreshOverlay(id)
  }

  gantt.ext.overlay.hideOverlay = function (id) {
    overlays[id].isVisible = false
    overlays[id].node.style.display = 'none'
    hideIfNoVisibleLayers()
  }
  gantt.ext.overlay.isOverlayVisible = function (id) {
    if (!id) {
      return false
    }
    return overlays[id].isVisible
  }
}
