import * as domHelpers from '../utils/dom_helpers'

function createResizer(gantt, grid) {
  // renders resize elements in the grid header
  var _render_grid_header_resize = function () {
    var columns = grid.getGridColumns(),
      config = grid.$getConfig(),
      width = 0,
      totalWidth = grid.$config.width,
      lineHeigth = config.scale_height

    for (var i = 0; i < columns.length; i++) {
      var col = columns[i]

      var pos
      width += col.width
      if (config.rtl) {
        pos = totalWidth - width
      } else {
        pos = width
      }

      // GS-205. don't add resizer for the last column
      if (col.resize && i != columns.length - 1) {
        var resize_el = document.createElement('div')
        resize_el.className = 'gantt_grid_column_resize_wrap'
        resize_el.style.top = '0px'
        resize_el.style.height = lineHeigth + 'px'
        resize_el.innerHTML = "<div class='gantt_grid_column_resize'></div>"
        resize_el.setAttribute(config.grid_resizer_column_attribute, i)
        resize_el.setAttribute('column_index', i) // hardcoded for backward compatibility

        gantt._waiAria.gridSeparatorAttr(resize_el)

        grid.$grid_scale.appendChild(resize_el)

        resize_el.style.left = Math.max(0, pos) + 'px'
      }
    }
  }

  var _grid_resize = {
    column_before_start: gantt.bind(function (dnd, obj, e) {
      var config = grid.$getConfig()

      var el = domHelpers.locateAttribute(e, config.grid_resizer_column_attribute)
      if (!el) return false

      if (!domHelpers.closest(el, '.gantt_grid_column_resize_wrap')) {
        // column resize should work only when we use the resizer
        return false
      }

      var column_index = this.locate(e, config.grid_resizer_column_attribute),
        column = grid.getGridColumns()[column_index]

      if (grid.callEvent('onColumnResizeStart', [column_index, column]) === false) return false
    }, gantt),

    column_after_start: gantt.bind(function (dnd, obj, e) {
      var config = grid.$getConfig()

      var column_index = this.locate(e, config.grid_resizer_column_attribute)
      dnd.config.marker.innerHTML = ''
      dnd.config.marker.className += ' gantt_grid_resize_area'
      dnd.config.marker.style.height = grid.$grid.offsetHeight + 'px'
      dnd.config.marker.style.top = '0px'
      dnd.config.drag_index = column_index
    }, gantt),

    column_drag_move: gantt.bind(function (dnd, obj, e) {
      var config = grid.$getConfig()

      var dd = dnd.config,
        columns = grid.getGridColumns()
      var index = parseInt(dd.drag_index, 10)
      var target_column = columns[index]
      var pos = domHelpers.getNodePosition(grid.$grid_scale),
        pointerPosition = parseInt(dd.marker.style.left, 10),
        minPointerPosition = target_column.min_width ? target_column.min_width : config.min_grid_column_width,
        maxPointerPosition = grid.$grid_data.offsetWidth, // - config.min_grid_column_width * (columns.length - dd.drag_index - 2),// 1 for current column + 1 for last column
        markerStartPosition = 0,
        marker_width = 0

      /*	if(config.rtl){
				index = columns.length - 1 - index;
				columns = columns.reverse();
			}*/

      if (!config.rtl) {
        pointerPosition -= pos.x - 1
      } else {
        pointerPosition = pos.x + pos.width - 1 - pointerPosition
      }

      //pointerPosition -= pos.x - 1;
      for (var i = 0; i < index; i++) {
        minPointerPosition += columns[i].width
        markerStartPosition += columns[i].width
      }

      if (pointerPosition < minPointerPosition) {
        pointerPosition = minPointerPosition
      }

      if (config.keep_grid_width) {
        var limit_max = 0
        for (var i = index + 1; i < columns.length; i++) {
          if (columns[i].min_width) maxPointerPosition -= columns[i].min_width
          else if (config.min_grid_column_width) maxPointerPosition -= config.min_grid_column_width

          if (columns[i].max_width && limit_max !== false) limit_max += columns[i].max_width
          else limit_max = false
        }

        // we have to restrict min value if only ALL right-side columns have 'max_width' field
        if (limit_max) {
          minPointerPosition = grid.$grid_data.offsetWidth - limit_max
        }
        if (pointerPosition < minPointerPosition) {
          pointerPosition = minPointerPosition
        }

        if (pointerPosition > maxPointerPosition) {
          pointerPosition = maxPointerPosition
        }
      } else if (!grid.$config.scrollable) {
        var targetWidth = pointerPosition
        var maxWidth = gantt.$container.offsetWidth

        var rightColumnsWidth = 0
        // 25 is a scrollbar width. due to GS-1314 fix, the grid should always be visible
        // because of that, the internal grid width can be larger than the visible grid width
        if (grid.$grid_data.offsetWidth <= maxWidth - 25) {
          for (var i = index + 1; i < columns.length; i++) {
            rightColumnsWidth += columns[i].width
          }
        } else {
          // GS-627. When the grid is not scrollable and occupies almost all Gantt container's width
          for (var i = index + 1; i >= 0; i--) {
            rightColumnsWidth += columns[i].width
          }
          rightColumnsWidth = maxWidth - rightColumnsWidth
        }

        // in case if something went wrong in the previous part
        if (rightColumnsWidth > maxWidth) {
          rightColumnsWidth -= maxWidth
        }

        // prevent grid from occupying the whole layout cell, which would disable the timeline
        var parentLayout = grid.$parent.$parent
        if (parentLayout && parentLayout.$config.mode == 'y') {
          var parentWidth = parentLayout.$lastSize.x
          maxWidth = Math.min(maxWidth, parentWidth - (parentLayout.$cells.length - 1))
        }

        if (targetWidth + rightColumnsWidth > maxWidth) {
          pointerPosition = maxWidth - rightColumnsWidth
        }
      }

      dd.left = pointerPosition - 1 // -1 for border

      marker_width = Math.abs(pointerPosition - markerStartPosition)

      // column.max_width - maximum width of the column, user defined
      if (target_column.max_width && marker_width > target_column.max_width) marker_width = target_column.max_width

      if (config.rtl) {
        markerStartPosition = pos.width - markerStartPosition + 2 - marker_width
      }
      dd.marker.style.top = pos.y + 'px'
      dd.marker.style.left = pos.x - 1 + markerStartPosition + 'px'
      dd.marker.style.width = marker_width + 'px'

      grid.callEvent('onColumnResize', [index, columns[index], marker_width - 1])
      return true
    }, gantt),

    column_drag_end: gantt.bind(function (dnd, obj, e) {
      var config = grid.$getConfig()
      var columns = grid.getGridColumns(),
        columns_width = 0,
        index = parseInt(dnd.config.drag_index, 10),
        target_column = columns[index]

      // var colIndex = index;
      /*if(config.rtl){
				colIndex = columns.length - 1 - target_index;
				columns = columns.reverse();
			}*/

      for (var i = 0; i < index; i++) {
        columns_width += columns[i].width
      }

      var final_width =
        target_column.min_width && dnd.config.left - columns_width < target_column.min_width ? target_column.min_width : dnd.config.left - columns_width

      if (target_column.max_width && target_column.max_width < final_width)
        // TODO: probably can be omitted
        final_width = target_column.max_width

      if (grid.callEvent('onColumnResizeEnd', [index, target_column, final_width]) === false) return

      if (target_column.width == final_width) return

      target_column.width = final_width

      if (config.keep_grid_width) {
        columns_width = config.grid_width
      } else {
        // in other case we set a new grid width and call gantt render
        for (var i = index, l = columns.length; i < l; i++) {
          columns_width += columns[i].width
        }
      }

      grid.callEvent('onColumnResizeComplete', [columns, grid._setColumnsWidth(columns_width, index)])

      if (!grid.$config.scrollable) {
        gantt.$layout._syncCellSizes(grid.$config.group, { value: config.grid_width, isGravity: false })
      }
      //grid.callEvent("onColumnResizeComplete", [columns, columns_width]);

      this.render()
    }, gantt),
  }

  // calls the initialization of the D'n'D events for resize elements
  var _init_resize = function () {
    var DnD = gantt.$services.getService('dnd')

    var config = grid.$getConfig()

    var dnd = new DnD(grid.$grid_scale, { updates_per_second: 60 })
    if (gantt.defined(config.dnd_sensitivity)) dnd.config.sensitivity = config.dnd_sensitivity

    dnd.attachEvent('onBeforeDragStart', function (obj, e) {
      return _grid_resize.column_before_start(dnd, obj, e)
    })
    dnd.attachEvent('onAfterDragStart', function (obj, e) {
      return _grid_resize.column_after_start(dnd, obj, e)
    })
    dnd.attachEvent('onDragMove', function (obj, e) {
      return _grid_resize.column_drag_move(dnd, obj, e)
    })
    dnd.attachEvent('onDragEnd', function (obj, e) {
      return _grid_resize.column_drag_end(dnd, obj, e)
    })
  }

  return {
    init: _init_resize,
    doOnRender: _render_grid_header_resize,
  }
}

export default createResizer
