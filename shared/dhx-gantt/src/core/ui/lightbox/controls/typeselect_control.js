import __extends from '../../../../utils/extends'

import Super from './select_control'

export default function (gantt) {
  const _super = Super(gantt)

  function TypeselectControl() {
    var self = _super.apply(this, arguments) || this

    return self
  }

  __extends(TypeselectControl, _super)

  TypeselectControl.prototype.render = function (sns) {
    var types = gantt.config.types,
      locale = gantt.locale.labels,
      options = []

    var filter =
      sns.filter ||
      function (typeKey, typeValue) {
        if (!types.placeholder || typeValue !== types.placeholder) {
          return true
        }
        return false
      }
    for (var i in types) {
      if (!filter(i, types[i]) === false) {
        options.push({ key: types[i], label: locale['type_' + i] })
      }
    }
    sns.options = options

    var oldOnChange = sns.onchange
    sns.onchange = function () {
      gantt._lightbox_current_type = this.value
      gantt.changeLightboxType(this.value)
      if (typeof oldOnChange == 'function') {
        oldOnChange.apply(this, arguments)
      }
    }

    return _super.prototype.render.apply(this, arguments)
  }

  return TypeselectControl
}
