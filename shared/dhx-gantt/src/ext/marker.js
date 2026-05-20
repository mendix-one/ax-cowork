export default function (gantt) {
  if (!gantt._markers) {
    gantt._markers = gantt.createDatastore({
      name: 'marker',
      initItem: function (marker) {
        marker.id = marker.id || gantt.uid()
        return marker
      },
    })
  }

  gantt.config.show_markers = true

  function render_marker(marker) {
    if (!gantt.config.show_markers) return false

    if (!marker.start_date) return false

    var state = gantt.getState()
    if (+marker.start_date > +state.max_date) return
    if ((!marker.end_date || +marker.end_date < +state.min_date) && +marker.start_date < +state.min_date) return

    var div = document.createElement('div')

    div.setAttribute('data-marker-id', marker.id)

    var css = 'gantt_marker'
    if (gantt.templates.marker_class) css += ' ' + gantt.templates.marker_class(marker)

    if (marker.css) {
      css += ' ' + marker.css
    }

    if (gantt.templates.marker_class) css += ' ' + gantt.templates.marker_class(marker)

    if (marker.title) {
      div.title = marker.title
    }
    div.className = css

    var start = gantt.posFromDate(marker.start_date)
    div.style.left = start + 'px'
    let markerHeight = Math.max(gantt.getRowTop(gantt.getVisibleTaskCount()), 0) + 'px'
    if (gantt.config.timeline_placeholder && gantt.$task_data) {
      markerHeight = gantt.$task_data.scrollHeight + 'px'
    }
    div.style.height = markerHeight
    if (marker.end_date) {
      var end = gantt.posFromDate(marker.end_date)
      div.style.width = Math.max(end - start, 0) + 'px'
    }

    if (marker.text) {
      let content = null
      if (typeof marker.text === 'function') {
        content = marker.text(marker)
      } else {
        content = marker.text
      }
      if (content) {
        if (gantt.config.external_render && gantt.config.external_render.isElement(content)) {
          div.innerHTML = "<div class='gantt_marker_content' ></div>"
          gantt.config.external_render.renderElement(content, div.querySelector('.gantt_marker_content'))
        } else {
          div.innerHTML = "<div class='gantt_marker_content' >" + marker.text + '</div>'
        }
      }
    }

    return div
  }

  function initMarkerArea() {
    // GS-481. Reset $marker_area if there is no timeline
    if (!gantt.$task_data || !gantt.$root.contains(gantt.$task_data)) {
      gantt.$marker_area = null
      return
    }

    // GS-2084. Don't add $marker_area when it already exists
    if (gantt.$marker_area && gantt.$task_data.contains(gantt.$marker_area)) {
      return
    }

    var markerArea = document.createElement('div')
    markerArea.className = 'gantt_marker_area'
    gantt.$task_data.appendChild(markerArea)
    gantt.$marker_area = markerArea
  }

  gantt.attachEvent('onBeforeGanttRender', function () {
    if (!gantt.$marker_area) initMarkerArea()
  })

  gantt.attachEvent('onDataRender', function () {
    if (!gantt.$marker_area) {
      initMarkerArea()
      gantt.renderMarkers()
    }
  })

  gantt.attachEvent('onGanttLayoutReady', function () {
    // GS-1304 - markers should attach when layout is initialized, both on gantt.init and gantt.resetLayout
    // wait for "onBeforeGanttRender", so all layout elements will be in DOM
    gantt.attachEvent(
      'onBeforeGanttRender',
      function () {
        // GS-882. If markers are rendered in the onDataRender handler,
        // they are not attached to the layer, so we need to remove the DOM elements
        if (gantt.$marker_area) {
          gantt.$marker_area.innerHTML = ''
        }
        initMarkerArea()

        var layers = gantt.$services.getService('layers')
        var markerRenderer = layers.createDataRender({
          name: 'marker',
          defaultContainer: function () {
            return gantt.$marker_area
          },
        })
        markerRenderer.addLayer(render_marker)
      },
      { once: true },
    )
  })

  gantt.getMarker = function (id) {
    if (!this._markers) return null

    return this._markers.getItem(id)
  }

  gantt.addMarker = function (marker) {
    return this._markers.addItem(marker)
  }

  gantt.deleteMarker = function (id) {
    if (!this._markers.exists(id)) return false

    this._markers.removeItem(id)
    return true
  }
  gantt.updateMarker = function (id) {
    this._markers.refresh(id)
  }

  gantt._getMarkers = function () {
    return this._markers.getItems()
  }

  gantt.renderMarkers = function () {
    this._markers.refresh()
  }
}
