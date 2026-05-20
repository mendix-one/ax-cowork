import * as domHelpers from '../utils/dom_helpers'
import * as utils from '../../../utils/utils'
import resourceStoreMixin from '../resource_store_mixin'
import Grid from './grid'
import __extends from '../../../utils/extends'

var ResourceGrid = (function (_super) {
  function ResourceGrid(parent, config, factory, gantt) {
    return _super.apply(this, arguments) || this
  }

  __extends(ResourceGrid, _super)

  utils.mixin(
    ResourceGrid.prototype,
    {
      init: function () {
        if (this.$config.bind === undefined) {
          this.$config.bind = this.$getConfig().resource_store
        }
        _super.prototype.init.apply(this, arguments)
      },

      _initEvents: function () {
        var gantt = this.$gantt
        _super.prototype._initEvents.apply(this, arguments)
        this._mouseDelegates.delegate(
          'click',
          'gantt_row',
          gantt.bind(function (e, id, trg) {
            var store = this.$config.rowStore
            if (!store) return true

            var target = domHelpers.locateAttribute(e, this.$config.item_attribute)
            if (target) {
              store.select(target.getAttribute(this.$config.item_attribute))
            }
            return false
          }, this),
          this.$grid,
        )
      },
    },
    true,
  )

  utils.mixin(ResourceGrid.prototype, resourceStoreMixin(ResourceGrid), true)

  return ResourceGrid
})(Grid)

export default ResourceGrid
