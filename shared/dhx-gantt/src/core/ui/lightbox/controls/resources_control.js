import * as helpers from '../../../../utils/helpers'
import * as domHelpers from '../../utils/dom_helpers'
import htmlHelpers from '../../utils/html_helpers'
import __extends from '../../../../utils/extends'

import Super from './base_control'

export default function (gantt) {
  const _super = Super(gantt)
  var localCache = {
    resources: {},
    resourcesValues: {},
    filter: {},
    eventsInitialized: {},
  }

  gantt.attachEvent('onAfterLightbox', _clearCached)

  function ResourcesControl() {
    var self = _super.apply(this, arguments) || this

    return self
  }

  __extends(ResourcesControl, _super)

  ResourcesControl.prototype.render = function (sns) {
    if (!sns.options) {
      sns.options = gantt.serverList('resourceOptions')
    }

    if (!sns.map_to || sns.map_to == 'auto') {
      sns.map_to = gantt.config.resource_property
    }
    var html
    var resourceFilterPlaceholder = gantt.locale.labels.resources_filter_placeholder || sns.filter_placeholder || 'type to filter'
    var resourceFilterLabel = gantt.locale.labels.resources_filter_label || 'hide empty'
    // if set fixed height for this element, then resize of lightbox will be calculated improperly
    html = '<div' + (!isNaN(sns.height) ? " style='height: " + sns.height + "px;'" : '') + " class='gantt_section_" + sns.name + "'>"
    html +=
      "<div class='gantt_cal_ltext gantt_resources_filter'><input type='text' class='gantt_resources_filter_input' placeholder='" +
      resourceFilterPlaceholder +
      "'> <label><input class='switch_unsetted' type='checkbox'><span class='matherial_checkbox_icon'></span>" +
      resourceFilterLabel +
      '</label></div>'
    html += "<div class='gantt_cal_ltext gantt_resources' data-name='" + sns.name + "'></div>"
    html += '</div>'
    return html
  }

  ResourcesControl.prototype.set_value = function (node, value, ev, sns) {
    var resourcesElement = _setResourcesElement(node, sns)
    var htmlResourceRow = ''
    var data

    _setFilterCache(node, sns)
    _initEvents(node, ev, sns, this)
    helpers.forEach(sns.options, function (entry, index) {
      if (sns.unassigned_value == entry.key) {
        return
      }
      data = _getDisplayValues(sns, value, entry)

      htmlResourceRow += [
        "<label class='gantt_resource_row' data-item-id='" + entry.key + "' data-checked=" + (data.value ? 'true' : 'false') + '>',
        "<input class='gantt_resource_toggle' type='checkbox'",
        data.value ? " checked='checked'" : '',
        "><div class='gantt_resource_cell gantt_resource_cell_checkbox'><span class='matherial_checkbox_icon'></span></div>",
        "<div class='gantt_resource_cell gantt_resource_cell_label'>",
        entry.label,
        '</div>',
        "<div class='gantt_resource_cell gantt_resource_cell_value'>",
        _getAmountInput(entry, data.value, !data.value, data.id),
        '</div>',
        "<div class='gantt_resource_cell gantt_resource_cell_unit'>",
        entry.unit,
        '</div>',
        '</label>',
      ].join('')
    })
    resourcesElement.innerHTML = htmlResourceRow
    // weird element sizes in ie11 when display empty resource list, use zoom to force repaint
    resourcesElement.style.zoom = '1'
    resourcesElement._offsetSizes = resourcesElement.offsetHeight
    resourcesElement.style.zoom = ''

    gantt._center_lightbox(gantt.getLightbox())
  }

  ResourcesControl.prototype.get_value = function (node, ev, sns) {
    var amountElement = _getResourcesElement(sns)
    var result = []
    var selectorAdd = _getInputElementSelector(true)
    var selectorSub = _getInputElementSelector(false)
    var filterCache = _getFilterCache(sns)
    var settedValuesHash = gantt.copy(localCache.resourcesValues[sns.id]) || {}

    var itemsAdd = amountElement.querySelectorAll(selectorAdd)
    var itemsSub = amountElement.querySelectorAll(selectorSub)

    for (var i = 0; i < itemsSub.length; i++) {
      delete settedValuesHash[itemsSub[i].getAttribute('data-item-id')]
    }

    for (var i = 0; i < itemsAdd.length; i++) {
      var originalId = itemsAdd[i].getAttribute('data-assignment-id')
      var resourceId = itemsAdd[i].getAttribute('data-item-id')
      var amount = itemsAdd[i].value.trim()

      if (amount !== '' && amount !== '0') {
        delete settedValuesHash[resourceId]
        result[result.length] = { resource_id: resourceId, value: amount }
        if (originalId) {
          result[result.length - 1] = { ...result[result.length - 1], id: originalId }
        }
      }
    }

    if (filterCache.filterApplied) {
      for (var item in settedValuesHash) {
        result[result.length] = { resource_id: item, value: settedValuesHash[item].value, id: settedValuesHash[item].id }
      }
    }

    return result
  }

  ResourcesControl.prototype.focus = function (node) {
    gantt._focus(node.querySelector('.gantt_resources'))
  }

  function _getAmountInput(item, value, disabled, assignmentId) {
    var _attributes
    var innerHTML = ''

    if (!item) return

    _attributes = [
      { key: 'data-item-id', value: item.key },
      { key: 'data-assignment-id', value: assignmentId || '' },
      { key: 'class', value: 'gantt_resource_amount_input' },
    ]
    if (disabled) {
      _attributes.push({ key: 'disabled', value: 'disabled' })
    }

    if (item.options) {
      innerHTML += htmlHelpers.getHtmlSelect(item.options, _attributes, value)
    } else {
      _attributes[_attributes.length] = { key: 'value', value: value || '' }
      innerHTML += htmlHelpers.getHtmlInput(_attributes)
    }
    return innerHTML
  }

  function _getValue(el) {
    return el.value.trim()
  }

  function _initEvents(node, ev, sns, context) {
    if (localCache.eventsInitialized[sns.id]) return

    var _applyFilter = function (e) {
      _saveValues(sns, node)
      var resultSns
      var query
      var hideUnsetted
      var input
      var checkbox
      var filterCache = _getFilterCache(sns)

      checkbox = filterCache.checkbox
      input = filterCache.input

      hideUnsetted = checkbox.checked
      query = _getValue(input)
      filterCache.filterApplied = !!query
      if (gantt.getState().lightbox) {
        ev = gantt.getLightboxValues()
      }
      resultSns = _getSnsToHideUnsetted(sns, ev, query, hideUnsetted)
      var value = ev[sns.map_to]
      context.form_blocks.resources.set_value(node, value, ev, resultSns)
    }

    function _resourceChangeListener(e) {
      var target = e.target
      var parent
      var input

      if (e.target.type === 'checkbox') {
        parent = target.parentNode
        input = parent.querySelector(_getInputElementSelector())
        input.disabled = !target.checked
        var itemId = input.getAttribute('data-item-id')
        var row = domHelpers.locateClassName(e, 'gantt_resource_row')
        var valueInput = row.querySelector('.gantt_resource_amount_input')
        row.setAttribute('data-checked', target.checked)
        if (target.checked) {
          if (input.nodeName.toLowerCase() === 'select') {
            gantt.callEvent('onResourcesSelectActivated', [{ target: input }])
          }

          var resId = itemId
          var defaultValue = sns.default_value
          sns.options.forEach(function (option) {
            if (option.key == resId && option.default_value) {
              defaultValue = option.default_value
            }
          })

          if (valueInput && !valueInput.value && defaultValue !== undefined) {
            valueInput.value = defaultValue
            _saveValues(sns, this)
          }

          if (valueInput.select) {
            valueInput.select()
          } else if (valueInput.focus) {
            valueInput.focus()
          }
        } else {
          if (localCache.resourcesValues[sns.id]) {
            delete localCache.resourcesValues[sns.id][itemId]
          }
        }
      } else if (e.target.type === 'text' || e.target.nodeName.toLowerCase() === 'select') {
        parent = target.parentNode.parentNode

        input = e.target
        _saveValues(sns, this)
      }
    }

    function _saveValues(sns, domElement) {
      var selector = _getInputElementSelector()
      var inputs = domElement.querySelectorAll(selector)

      localCache.resourcesValues[sns.id] = localCache.resourcesValues[sns.id] || {}

      for (var i = 0; i < inputs.length; i++) {
        var key = inputs[i].getAttribute('data-item-id')
        var originalAssignmentId = inputs[i].getAttribute('data-assignment-id')
        if (!inputs[i].disabled) {
          localCache.resourcesValues[sns.id][key] = { value: inputs[i].value, id: originalAssignmentId }
        } else {
          delete localCache.resourcesValues[sns.id][key]
        }
      }
    }

    _applyFilter = helpers.throttle(_applyFilter, 100)

    _getFilterCache(sns).container.addEventListener('keyup', _applyFilter)
    _getFilterCache(sns).container.addEventListener('input', _applyFilter, true)
    _getFilterCache(sns).container.addEventListener('change', _applyFilter, true)
    _getResourcesElement(sns).addEventListener('input', _resourceChangeListener)
    _getResourcesElement(sns).addEventListener('change', _resourceChangeListener)
    gantt.attachEvent('onResourcesSelectActivated', gantt.bind(_resourceChangeListener, _getResourcesElement(sns)))
    localCache.eventsInitialized[sns.id] = true
  }

  function _getSnsToHideUnsetted(controlConfig, task, query, hideUnsetted) {
    var comparison
    var resultConfig

    if (!hideUnsetted) {
      if (query === '') {
        // show all
        return controlConfig
      }

      comparison = function (entry) {
        // show matching labels only
        if (entry.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          return entry
        }
      }
    } else {
      var collection = task[controlConfig.map_to] || []

      if (!helpers.isArray(collection)) {
        collection = [collection]
      }

      // copy section array in order not to modify ev[sns.map_to]
      collection = collection.slice()

      if (collection.length === 0) {
        //nothing setted
        collection = []
        resultConfig = gantt.copy(controlConfig)
        resultConfig.options = []
        for (var key in localCache.resourcesValues[controlConfig.id]) {
          var cachedValue = localCache.resourcesValues[controlConfig.id][key]
          if (cachedValue.value !== '') {
            collection.push({ resource_id: key, value: cachedValue.value, id: cachedValue.id })
          }
        }

        if (collection.length === 0) {
          return resultConfig
        }
      } else {
        for (var key in localCache.resourcesValues[controlConfig.id]) {
          var cachedValue = localCache.resourcesValues[controlConfig.id][key]
          if (cachedValue.value !== '') {
            var searchResult = helpers.arrayFind(collection, function (entry) {
              return entry.id == key
            })

            if (!searchResult) {
              collection.push({ resource_id: key, value: cachedValue.value, id: cachedValue.id })
            }
          }
        }
      }

      var itemIds = {}

      for (var i = 0; i < collection.length; i++) {
        itemIds[collection[i].resource_id] = true
      }
      comparison = function (entry) {
        //show setted and filtered if field is filled
        if (itemIds[String(entry.key)] && (query === '' || entry.label.toLowerCase().indexOf(query.toLowerCase()) >= 0)) {
          return entry
        }
      }
    }
    resultConfig = gantt.copy(controlConfig)
    resultConfig.options = helpers.arrayFilter(resultConfig.options, comparison)
    return resultConfig
  }

  function _getInputElementSelector(isChecked) {
    if (isChecked === undefined) {
      return '.gantt_resource_amount_input'
    } else {
      return "[data-checked='" + (isChecked ? 'true' : 'false') + "'] .gantt_resource_amount_input"
    }
  }

  function _setResourcesElement(node, sns) {
    if (!localCache.resources[sns.id]) {
      localCache.resources[sns.id] = node.querySelector('.gantt_resources')
    }
    return localCache.resources[sns.id]
  }

  function _getResourcesElement(sns) {
    return localCache.resources[sns.id]
  }

  function _setFilterCache(node, sns) {
    if (!localCache.filter[sns.id]) {
      var container = node.querySelector('.gantt_resources_filter')
      var input = container.querySelector('.gantt_resources_filter_input')
      var checkbox = container.querySelector('.switch_unsetted')

      localCache.filter[sns.id] = {
        container: container,
        input: input,
        checkbox: checkbox,
        filterApplied: false,
      }
    }
    return localCache.filter[sns.id]
  }

  function _getFilterCache(sns) {
    return localCache.filter[sns.id]
  }

  function _clearCached() {
    for (var key in localCache.filter) {
      localCache.filter[key].checkbox.checked = false
      localCache.filter[key].input.value = ''
      localCache.filter[key].filterApplied = false
    }
    localCache.resourcesValues = {}
  }

  function _getDisplayValues(sns, value, option) {
    var data = {}

    if (value) {
      var searchResult

      if (helpers.isArray(value)) {
        searchResult = helpers.arrayFind(value, function (val) {
          return val.resource_id == option.key
        })
      } else if (value.resource_id == option.key) {
        searchResult = value
      }

      if (searchResult) {
        data.value = searchResult.value
        data.id = searchResult.id
      }
    }
    if (localCache.resourcesValues[sns.id] && localCache.resourcesValues[sns.id][option.key]) {
      data.value = localCache.resourcesValues[sns.id][option.key].value
      data.id = localCache.resourcesValues[sns.id][option.key].id
    }
    return data
  }

  return ResourcesControl
}
