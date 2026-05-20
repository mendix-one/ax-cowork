import * as utils from '../../../utils/utils'
import env from '../../../utils/env'

var createStaticBgHelper = function (utils, env) {
  var canvasBgCache = {}
  var staticBgStyleId = 'gantt-static-bg-styles-' + utils.uid()

  function renderBgCanvas(targetNode, config, scale, totalHeight, itemHeight) {
    if (!config.static_background && !config.timeline_placeholder) return

    var canvas = document.createElement('canvas')
    if (!canvas.getContext) return // if canvas is not supported (for IE8)

    // clear previous bg data
    targetNode.innerHTML = ''

    var styleParams = getCellStyles(targetNode)
    var png = createBackgroundTiles(styleParams, config, scale, itemHeight)
    var bgDivs = createBgDivs(png, config, scale, totalHeight)

    var fragment = document.createDocumentFragment()

    bgDivs.forEach(function (div) {
      fragment.appendChild(div)
    })

    targetNode.appendChild(fragment)
  }

  function getColumnWidths(scale) {
    var widths = scale.width
    var differentWidths = {}
    for (var i = 0; i < widths.length; i++) {
      if (widths[i] * 1) differentWidths[widths[i]] = true
    }
    return differentWidths
  }

  function parseRgb(rgbCss) {
    var result = /^rgba?\(([\d]{1,3}), *([\d]{1,3}), *([\d]{1,3}) *(,( *[\d.]+ *))?\)$/i.exec(rgbCss)
    return result
      ? {
          r: result[1] * 1,
          g: result[2] * 1,
          b: result[3] * 1,
          a: result[5] * 255 || 255,
        }
      : null
  }

  function getUrlFromCache(key) {
    return canvasBgCache[key] || null
  }

  function getHashKey(width, height, cellStyles) {
    return (width + '' + height + cellStyles.bottomBorderColor + cellStyles.rightBorderColor).replace(/[^\w\d]/g, '')
  }

  function getStyleElement() {
    var style = document.getElementById(staticBgStyleId)

    if (!style) {
      style = document.createElement('style')
      style.id = staticBgStyleId
      document.body.appendChild(style)
    }
    return style
  }

  function cleanup() {
    var style = document.getElementById(staticBgStyleId)
    if (style && style.parentNode) {
      style.parentNode.removeChild(style)
    }
  }

  function cacheUrl(key, url) {
    canvasBgCache[key] = url
  }

  function generateBgUrl(width, height, cellStyles) {
    // use relatively big bg image about 500*500px in order to reduce misalignments due browser zoom
    var cols = Math.floor(500 / width) || 1
    var rows = Math.floor(500 / height) || 1

    var canvas = document.createElement('canvas')
    canvas.height = height * rows
    canvas.width = width * cols

    var context = canvas.getContext('2d')

    drawGrid(height, width, rows, cols, context, cellStyles)

    return canvas.toDataURL()

    function drawGrid(rowHeight, colWidth, rows, cols, context, styles) {
      // paint pixels manually instead of using lineTo in order to prevent canvas aliasing
      var image = context.createImageData(colWidth * cols, rowHeight * rows)
      image.imageSmoothingEnabled = false

      var verticalLineWidth = styles.rightBorderWidth * 1
      var verticalLineColor = parseRgb(styles.rightBorderColor)

      var x = 0,
        y = 0,
        w = 0

      for (var col = 1; col <= cols; col++) {
        x = col * colWidth - 1
        for (w = 0; w < verticalLineWidth; w++) {
          for (y = 0; y < rowHeight * rows; y++) {
            drawDot(x - w, y, verticalLineColor, image)
          }
        }
      }

      var horizontalLineWidth = styles.bottomBorderWidth * 1
      var horizontalLineColor = parseRgb(styles.bottomBorderColor)

      y = 0
      for (var row = 1; row <= rows; row++) {
        y = row * rowHeight - 1
        for (w = 0; w < horizontalLineWidth; w++) {
          for (x = 0; x < colWidth * cols; x++) {
            drawDot(x, y - w, horizontalLineColor, image)
          }
        }
      }
      context.putImageData(image, 0, 0)
    }

    function drawDot(x, y, color, matrix) {
      var rowLength = width * cols

      var index = (y * rowLength + x) * 4

      matrix.data[index] = color.r
      matrix.data[index + 1] = color.g
      matrix.data[index + 2] = color.b
      matrix.data[index + 3] = color.a
    }
  }

  function getCssClass(key) {
    return 'gantt-static-bg-' + key
  }

  function createBackgroundTiles(cellStyles, config, scale, itemHeight) {
    var data = {}
    var widths = getColumnWidths(scale),
      height = itemHeight

    var styleHTML = ''
    for (var i in widths) {
      var width = i * 1
      var key = getHashKey(width, height, cellStyles)
      var cachedUrl = getUrlFromCache(key)

      if (!cachedUrl) {
        var bgImage = generateBgUrl(width, height, cellStyles)
        cacheUrl(key, bgImage)
        styleHTML += '.' + getCssClass(key) + "{ background-image: url('" + bgImage + "');}"
      }

      data[i] = getCssClass(key)
    }

    if (styleHTML) {
      var style = getStyleElement()
      style.innerHTML += styleHTML
    }

    return data
  }

  function createBgDivs(bgTiles, config, scale, dataHeight) {
    var divs = []
    var tile,
      prevWidth = 0,
      prevCell

    var widths = scale.width.filter(function (i) {
      return !!i
    })

    var leftPos = 0

    //TODO: fixme
    // bg image misalignments on horizontal scroll on very large time scales, especially in IE/Edge browsers
    // limiting max tile width seems to solve the issue, but can increase rendering time
    var maxTileSize = 100000
    if (env.isIE) {
      // special case for IE11 on win7x and probably 8x
      var appVersion = navigator.appVersion || ''
      if (appVersion.indexOf('Windows NT 6.2') != -1 || appVersion.indexOf('Windows NT 6.1') != -1 || appVersion.indexOf('Windows NT 6.0') != -1) {
        maxTileSize = 20000
      }
    }

    for (var i = 0; i < widths.length; i++) {
      //var currentWidth = cells[i].clientWidth;
      var cell = widths[i]

      if ((cell != prevCell && prevCell !== undefined) || i == widths.length - 1 || prevWidth > maxTileSize) {
        var totalHeight = dataHeight,
          currentTop = 0,
          rowHeight = Math.floor(maxTileSize / config.row_height) * config.row_height

        var tileWidth = prevWidth

        while (totalHeight > 0) {
          var currentHeight = Math.min(totalHeight, rowHeight)
          totalHeight -= rowHeight

          tile = document.createElement('div')

          tile.style.height = currentHeight + 'px'
          tile.style.position = 'absolute'
          tile.style.top = currentTop + 'px'
          tile.style.left = leftPos + 'px'
          tile.style.pointerEvents = 'none'

          tile.style.whiteSpace = 'no-wrap'
          tile.className = bgTiles[prevCell || cell]

          // if last - short by 1 px (bug fix)
          if (i == widths.length - 1) {
            tileWidth = cell + tileWidth - 1
          }
          tile.style.width = tileWidth + 'px'

          divs.push(tile)
          currentTop += currentHeight
        }
        prevWidth = 0
        leftPos += tileWidth

        //cell = 0;
      }
      if (cell) {
        prevWidth += cell
        prevCell = cell
      }
    }

    return divs
  }

  function createProbeElement() {
    var cell = document.createElement('div')
    cell.className = 'gantt_task_cell'
    var row = document.createElement('div')
    row.className = 'gantt_task_row'
    row.appendChild(cell)
    return row
  }
  function getCellStyles(targetNode) {
    // creating temp DOM structure for resolving style parameters. Will be removed after calculating.
    // Add two rows and read styles from the first one.
    // Some skins (e.g. material) define special styles for the last row, so we add a couple and read styles from one which is not the :last-child;
    var firstRow = createProbeElement()
    var secondRow = createProbeElement()

    targetNode.appendChild(firstRow)
    targetNode.appendChild(secondRow)

    var firstRowCell = firstRow.firstChild

    var rowStyles = getComputedStyle(firstRow),
      cellStyles = getComputedStyle(firstRowCell)

    var params = {
      bottomBorderWidth: rowStyles.getPropertyValue('border-bottom-width').replace('px', ''),
      rightBorderWidth: cellStyles.getPropertyValue('border-right-width').replace('px', ''),
      bottomBorderColor: rowStyles.getPropertyValue('border-bottom-color'),
      rightBorderColor: cellStyles.getPropertyValue('border-right-color'),
    }

    targetNode.removeChild(firstRow)
    targetNode.removeChild(secondRow)

    return params
  }

  return {
    render: renderBgCanvas,
    destroy: cleanup,
  }
}

export default {
  create: function () {
    return createStaticBgHelper(utils, env)
  },
}
