export default function () {
  var self = this
  var taskFilter = function () {
    return self.isVisible()
  }

  var barVisible = function (id, task) {
    return !task.hide_bar
  }

  const gantt = this.$gantt

  var taskLayers = [
    {
      expose: true,
      renderer: this.$gantt.$ui.layers.taskBar(),
      container: this.$task_bars,
      filter: [taskFilter, barVisible],
    },
  ]

  taskLayers.push({
    renderer: this.$gantt.$ui.layers.taskBg(),
    container: this.$task_bg,
    filter: [
      //function(){
      //	return !self.$getConfig().static_background;
      //},
      taskFilter,
    ],
  })

  var linkLayers = [
    {
      expose: true,
      renderer: this.$gantt.$ui.layers.link(),
      container: this.$task_links,
      filter: [taskFilter],
    },
  ]

  return {
    tasks: taskLayers,
    links: linkLayers,
  }
}
