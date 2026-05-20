export default function (gantt) {
  gantt.getTaskType = function (type) {
    var checkType = type
    if (type && typeof type == 'object') {
      checkType = type.type
    }

    for (var i in this.config.types) {
      if (this.config.types[i] == checkType) {
        return checkType
      }
    }
    return gantt.config.types.task
  }
}
