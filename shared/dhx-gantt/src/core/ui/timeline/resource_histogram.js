import * as utils from '../../../utils/utils'
import ResourceTimeline from './resource_timeline'
import resourceStoreMixin from '../resource_store_mixin'
import __extends from '../../../utils/extends'

var ResourceHistogram = (function (_super) {
  function ResourceHistogram(parent, config, factory, gantt) {
    var self = _super.apply(this, arguments) || this
    self.$config.bindLinks = null
    return self
  }

  __extends(ResourceHistogram, _super)

  utils.mixin(
    ResourceHistogram.prototype,
    {
      _createLayerConfig: function () {
        var self = this
        var taskFilter = function () {
          return self.isVisible()
        }

        var taskLayers = [
          {
            renderer: this.$gantt.$ui.layers.resourceHistogram(),
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

  utils.mixin(ResourceHistogram.prototype, resourceStoreMixin(_super), true)

  return ResourceHistogram
})(ResourceTimeline)

export default ResourceHistogram
