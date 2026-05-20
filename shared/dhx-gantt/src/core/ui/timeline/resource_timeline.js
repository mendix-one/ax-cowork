import * as utils from '../../../utils/utils'
import Timeline from './timeline'
import resourceStoreMixin from '../resource_store_mixin'
import __extends from '../../../utils/extends'

var ResourceTimeline = (function (_super) {
  function ResourceTimeline(parent, config, factory, gantt) {
    var self = _super.apply(this, arguments) || this
    self.$config.bindLinks = null
    return self
  }

  __extends(ResourceTimeline, _super)

  utils.mixin(
    ResourceTimeline.prototype,
    {
      init: function () {
        if (this.$config.bind === undefined) {
          this.$config.bind = this.$getConfig().resource_store
        }
        _super.prototype.init.apply(this, arguments)
      },
      _createLayerConfig: function () {
        var self = this
        var taskFilter = function () {
          return self.isVisible()
        }

        var taskLayers = [
          {
            renderer: this.$gantt.$ui.layers.resourceRow(),
            container: this.$task_bars,
            filter: [taskFilter],
          },
          {
            renderer: this.$gantt.$ui.layers.taskBg(),
            container: this.$task_bg,
            filter: [taskFilter],
          },
        ]

        var linkLayers = []

        return {
          tasks: taskLayers,
          links: linkLayers,
        }
      },
    },
    true,
  )

  utils.mixin(ResourceTimeline.prototype, resourceStoreMixin(ResourceTimeline), true)

  return ResourceTimeline
})(Timeline)

export default ResourceTimeline
