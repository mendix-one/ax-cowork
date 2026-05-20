export default function () {
  var self = this
  var taskFilter = function () {
    return self.isVisible()
  }

  var barVisible = function (id, task) {
    return !task.hide_bar
  }

  const gantt = this.$gantt

  const isTimedProject = function (id, task) {
    return task.type === gantt.config.types.project && task.auto_scheduling === false
  }
  const isNotTimedProject = function (id, task) {
    return !isTimedProject(id, task)
  }

  var taskLayers = [
    {
      expose: true,
      renderer: this.$gantt.$ui.layers.taskBar(),
      container: this.$task_bars,
      filter: [taskFilter, barVisible, isNotTimedProject],
    },
    {
      renderer: this.$gantt.$ui.layers.timedProjectBar(),
      filter: [taskFilter, isTimedProject],
      container: this.$task_bars,
      append: true,
    },
    {
      renderer: this.$gantt.$ui.layers.taskSplitBar(),
      filter: [taskFilter],
      container: this.$task_bars,
      append: true,
    },
    {
      renderer: this.$gantt.$ui.layers.taskRollupBar(),
      filter: [taskFilter],
      container: this.$task_bars,
      append: true,
    },
    {
      renderer: this.$gantt.$ui.layers.taskConstraints(),
      filter: [taskFilter],
      container: this.$task_constraints,
      append: false,
    },
  ]

  if (gantt.config.deadlines) {
    taskLayers.push({
      renderer: this.$gantt.$ui.layers.taskDeadline(),
      filter: [taskFilter],
      container: this.$task_deadlines,
      append: false,
    })
  }

  if (gantt.config.baselines) {
    taskLayers.push({
      renderer: this.$gantt.$ui.layers.taskBaselines(),
      filter: [taskFilter],
      container: this.$task_baselines,
      append: false,
    })
  }

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
