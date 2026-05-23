export default function (gantt) {
  return {
    getVirtualRoot: function () {
      return gantt.mixin(gantt.getSubtaskDates(), {
        id: gantt.config.root_id,
        type: gantt.config.types.project,
        $source: [],
        $target: [],
        $virtual: true,
      })
    },

    getLinkedTasks: function (id, includePredecessors) {
      var startIds = [id]

      //TODO: format links cache
      var clearCache = false
      if (!gantt._isLinksCacheEnabled()) {
        gantt._startLinksCache()
        clearCache = true
      }
      var relations = []
      var visited = {}
      var result = {}
      for (var i = 0; i < startIds.length; i++) {
        this._getLinkedTasks(startIds[i], visited, includePredecessors, result)
      }

      for (var i in result) {
        relations.push(result[i])
      }

      //TODO: remove redundant edges before continue https://en.wikipedia.org/wiki/Transitive_reduction
      if (clearCache) gantt._endLinksCache()
      return relations
    },

    _collectRelations: function (rootObj, isChild, includePredecessors, visitedLinks) {
      var successors = gantt._getSuccessors(rootObj, isChild)

      var predecessors = []
      if (includePredecessors) {
        predecessors = gantt._getPredecessors(rootObj, isChild)
      }

      var linkKey
      var relations = []
      for (var i = 0; i < successors.length; i++) {
        linkKey = successors[i].hashSum
        if (visitedLinks[linkKey]) {
          continue
        } else {
          visitedLinks[linkKey] = true
          relations.push(successors[i])
        }
      }
      for (var i = 0; i < predecessors.length; i++) {
        linkKey = predecessors[i].hashSum
        if (visitedLinks[linkKey]) {
          continue
        } else {
          visitedLinks[linkKey] = true
          relations.push(predecessors[i])
        }
      }
      return relations
    },
    _getLinkedTasks: function (rootTask, visitedTasks, includePredecessors, output) {
      var from = rootTask === undefined ? gantt.config.root_id : rootTask
      var visitedTasks = {}
      var visitedLinks = {}
      var rootObj

      var tasksStack = [{ from: from, includePredecessors: includePredecessors, isChild: false }]

      while (tasksStack.length) {
        var current = tasksStack.pop()
        var isChild = current.isChild

        from = current.from
        if (visitedTasks[from]) {
          continue
        }

        rootObj = gantt.isTaskExists(from) ? gantt.getTask(from) : this.getVirtualRoot()
        visitedTasks[from] = true

        var relations = this._collectRelations(rootObj, isChild, includePredecessors, visitedLinks)

        for (var i = 0; i < relations.length; i++) {
          var rel = relations[i]

          let includeRelation = true
          if (gantt.config.auto_scheduling_use_progress) {
            const target = gantt.getTask(rel.target)
            if (target.progress == 1) {
              includeRelation = false
            }
          }

          // don't process links for unscheduled tasks
          const target = gantt.getTask(rel.target)
          const source = gantt.getTask(rel.source)
          if (target.unscheduled || source.unscheduled) {
            includeRelation = false
          }

          if (includeRelation) {
            output[rel.hashSum] = rel
          }

          var isSameParent = rel.sourceParent == rel.targetParent
          var targetTask = rel.target
          if (!visitedTasks[targetTask]) tasksStack.push({ from: rel.target, includePredecessors: true, isChild: isSameParent })
        }

        if (gantt.hasChild(rootObj.id)) {
          var children = gantt.getChildren(rootObj.id)
          for (var i = 0; i < children.length; i++) {
            if (!visitedTasks[children[i]]) tasksStack.push({ from: children[i], includePredecessors: true, isChild: true })
          }
        }
      }

      return output
    },
  }
}
