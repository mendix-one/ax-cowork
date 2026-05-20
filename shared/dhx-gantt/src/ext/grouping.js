import * as helpers from '../utils/helpers'

export default function (gantt) {
  gantt._groups = {
    relation_property: null,
    relation_id_property: '$group_id',
    group_id: null,
    group_text: null,
    loading: false,
    loaded: 0,
    dynamicGroups: false,
    set_relation_value: undefined,
    _searchCache: null,
    init: function (gantt) {
      var self = this

      gantt.attachEvent('onClear', function () {
        self.clear()
      })
      self.clear()

      var originalGetParent = gantt.$data.tasksStore.getParent // gantt._get_parent_id;
      this._searchCache = null
      gantt.attachEvent('onBeforeTaskMove', function (id, parent, tindex) {
        // GS-504: If we allow several owners/resources, the task should be moved to
        // a new position only if there is the function that handles that logic
        var invalidParent = parent === this.config.root_id
        var noRelationValueFunction = this._groups.dynamicGroups && !(this._groups.set_relation_value instanceof Function)

        if (self.is_active() && (invalidParent || noRelationValueFunction)) {
          return false
        }
        var task = gantt.getTask(id)
        // to allow reordering from regular task to virtual task in the group mode
        if (this._groups.save_tree_structure && gantt.isTaskExists(task.parent) && gantt.isTaskExists(parent)) {
          var oldParentTask = gantt.getTask(task.parent)
          var newParentTask = gantt.getTask(parent)
          if (newParentTask.$virtual && gantt.isChildOf(oldParentTask.id, newParentTask.id)) {
            task.parent = gantt.config.root_id
          }
          // avoid cyclic tree:
          let cyclicTree = false
          let parentTask = newParentTask
          while (parentTask) {
            if (id == parentTask.parent) {
              cyclicTree = true
            }
            if (gantt.isTaskExists(parentTask.parent)) {
              parentTask = gantt.getTask(parentTask.parent)
            } else {
              parentTask = null
            }
          }
          if (cyclicTree) {
            return false
          }
        }
        return true
      })

      // restore initial parent if the task is moved to a different group on the root level
      gantt.attachEvent('onRowDragStart', function (id, target) {
        var task = gantt.getTask(id)
        if (this._groups.save_tree_structure && gantt.isTaskExists(task.parent) && gantt.config.order_branch && gantt.config.order_branch != 'marker') {
          task.$initial_parent = task.parent
        }
        return true
      })

      gantt.attachEvent('onRowDragEnd', function (id, target) {
        if (gantt.config.order_branch && gantt.config.order_branch != 'marker') {
          var task = gantt.getTask(id)
          if (task.$initial_parent) {
            if (task.parent == gantt.config.root_id) {
              var renderedParent = gantt.getTask(task.$rendered_parent)
              var initialParent = gantt.getTask(task.$initial_parent)
              var restoreParent = false
              if (this._groups.dynamicGroups && renderedParent[this._groups.group_id] != initialParent[this._groups.group_id]) {
                restoreParent = true
              }
              if (!this._groups.dynamicGroups && renderedParent[this._groups.group_id] != initialParent[this._groups.relation_property]) {
                restoreParent = true
              }
              if (restoreParent) {
                task.parent = task.$initial_parent
              }
            }
            delete task.$initial_parent
          }
        }
      })

      gantt.$data.tasksStore._listenerToDrop = gantt.$data.tasksStore.attachEvent('onStoreUpdated', gantt.bind(_initBeforeDataRender, gantt))

      gantt.$data.tasksStore.getParent = function (task) {
        if (self.is_active()) {
          return self.get_parent(gantt, task)
        } else {
          return originalGetParent.apply(this, arguments)
        }
      }

      var originalSetParent = gantt.$data.tasksStore.setParent

      gantt.$data.tasksStore.setParent = function (task, new_pid) {
        if (!self.is_active()) {
          return originalSetParent.apply(this, arguments)
        } else if (self.set_relation_value instanceof Function && gantt.isTaskExists(new_pid)) {
          var parent = gantt.getTask(new_pid)
          var groupIds = parent[self.relation_id_property]
          if (!parent.$virtual) {
            var groupId = _getGroupId(parent, self.relation_property)
            if (!self._searchCache) {
              self._buildCache()
            }
            var virtualParentId = self._searchCache[groupId]
            var virtualParent = gantt.getTask(virtualParentId)
            groupIds = virtualParent[self.relation_id_property]
          }
          if (task[self.group_id] === undefined) {
            // to avoid nulling of relation_property if the group is not set
            task[self.group_id] = groupIds
          }

          if (self.save_tree_structure && task[self.group_id] != groupIds) {
            task[self.group_id] = groupIds
          }

          if (groupIds) {
            if (typeof groupIds == 'string') {
              groupIds = groupIds.split(',')
            } else {
              groupIds = [groupIds]
            }
          }
          // GS-504: This is a way to save the relation_property and customize the logic
          task[self.relation_property] = self.set_relation_value(groupIds, task.id, task[self.relation_property]) || groupIds
        } else if (gantt.isTaskExists(new_pid)) {
          var parent = gantt.getTask(new_pid)

          if (!self.dynamicGroups) {
            if (parent.$virtual) {
              task[self.relation_property] = parent[self.relation_id_property]
            } else {
              task[self.relation_property] = parent[self.relation_property]
            }
            // task[self.group_id] = parent[self.group_id] || task[self.group_id];
          }

          this._setParentInner.apply(this, arguments)
        } else if (self.dynamicGroups) {
          if (task[self.group_id] === undefined || (!task.$virtual && task[self.relation_property][0] === [][0])) {
            if (task[self.relation_property] !== self.group_id) {
              // GS:2547 dynamically added tasks could have relation_property
              task[self.relation_property] = task[self.relation_property] || 0
            } else {
              // GS-1332 the tasks without the group should be moved to the default group:
              task[self.relation_property] = 0
            }
          }
        }
        // GS-1449. Update the parent when it was changed in the group mode
        if (gantt.isTaskExists(new_pid)) {
          task.$rendered_parent = new_pid
          if (!gantt.getTask(new_pid).$virtual) {
            return originalSetParent.apply(this, arguments) || new_pid
          }
        }
      }

      gantt.attachEvent('onBeforeTaskDisplay', function (id, task) {
        if (self.is_active()) {
          if (task.type == gantt.config.types.project && !task.$virtual) return false
        }
        return true
      })

      gantt.attachEvent('onBeforeParse', function () {
        self.loading = true
        self._clearCache()
      })

      gantt.attachEvent('onTaskLoading', function () {
        if (self.is_active()) {
          self.loaded--
          if (self.loaded <= 0) {
            self.loading = false
            self._clearCache()
            gantt.eachTask(
              gantt.bind(function (t) {
                this.get_parent(gantt, t)
              }, self),
            )
          }
        }
        return true
      })
      gantt.attachEvent('onParse', function () {
        self.loading = false
        self.loaded = 0
      })
    },

    _clearCache: function () {
      this._searchCache = null
    },
    _buildCache: function () {
      this._searchCache = {}
      var items = gantt.$data.tasksStore.getItems()
      for (var i = 0; i < items.length; i++) {
        this._searchCache[items[i][this.relation_id_property]] = items[i].id
      }
    },
    get_parent: function (gantt, task, tasks) {
      if (task.id === undefined) {
        task = gantt.getTask(task)
      }

      var group_id = _getGroupId(task, this.relation_property)

      if (this.save_tree_structure && gantt.isTaskExists(task.parent)) {
        let parentTask = gantt.getTask(task.parent)

        const parent_group_id = _getGroupId(parentTask, this.relation_property)

        if (parentTask.type != 'project' && group_id == parent_group_id) {
          return task.parent
        }
      }

      if (this._groups_pull[group_id] === task.id) {
        return gantt.config.root_id
      }
      if (this._groups_pull[group_id] !== undefined) {
        return this._groups_pull[group_id]
      }

      var parent_id = gantt.config.root_id

      if (!this.loading && group_id !== undefined) {
        if (!this._searchCache) {
          this._buildCache()
        }
        var parent = this._searchCache[group_id]
        if (gantt.isTaskExists(parent) && parent != task.id) {
          parent_id = this._searchCache[group_id]
        }

        this._groups_pull[group_id] = parent_id
      }

      return parent_id
    },

    clear: function () {
      this._groups_pull = {}
      this.relation_property = null
      this.group_id = null
      this.group_text = null
      this._clearCache()
    },
    is_active: function () {
      return !!this.relation_property
    },
    generate_sections: function (list, groups_type) {
      var groups = []
      for (var i = 0; i < list.length; i++) {
        var group = gantt.copy(list[i])
        group.type = groups_type
        if (group.open === undefined) {
          group.open = true
        }
        group.$virtual = true
        group.readonly = true
        group[this.relation_id_property] = group[this.group_id]
        group.text = group[this.group_text]
        groups.push(group)
      }
      return groups
    },
    clear_temp_tasks: function (tasks) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].$virtual) {
          tasks.splice(i, 1)
          i--
        }
      }
    },

    generate_data: function (gantt, groups) {
      var links = gantt.getLinks()
      var tasks = gantt.getTaskByTime()

      this.clear_temp_tasks(tasks)

      tasks.forEach(function (task) {
        task.$calculate_duration = false // no need to recalculate durations of tasks after group by
      })

      var categories = []
      if (this.is_active() && groups && groups.length) {
        categories = this.generate_sections(groups, gantt.config.types.project)
      }

      var data = { links: links }
      data.data = categories.concat(tasks)

      return data
    },
    update_settings: function (relation, group_id, group_text) {
      this.clear()
      this.relation_property = relation
      this.group_id = group_id
      this.group_text = group_text
    },
    group_tasks: function (gantt, groups_array, relation_property, group_id, group_text) {
      this.update_settings(relation_property, group_id, group_text)
      var data = this.generate_data(gantt, groups_array)
      this.loaded = data.data.length

      // save task selection before grouping tasks
      // We need to iterate selected tasks with the "isSelectedTask" method
      // because it will work with and without the multiselect extension
      var selectedTasks = []
      gantt.eachTask(function (task) {
        if (gantt.isSelectedTask(task.id)) {
          selectedTasks.push(task.id)
        }
      })

      gantt._clear_data()
      var schedulingOnParse = gantt.config.auto_scheduling_initial
      gantt.config.auto_scheduling_initial = false
      gantt.parse(data)

      // restore task selection after grouping tasks
      selectedTasks.forEach(function (taskId) {
        if (gantt.isTaskExists(taskId)) {
          gantt.selectTask(taskId)
        }
      })

      gantt.config.auto_scheduling_initial = schedulingOnParse
    },
  }

  gantt._groups.init(gantt)

  function setRelationValueForAssignmentsArray(newGroupValues, id, oldRelationProperty) {
    if (!newGroupValues) {
      return 0
    }

    if (Array.isArray(oldRelationProperty) && !oldRelationProperty[0]) {
      return 0
    }

    if (newGroupValues && !Array.isArray(oldRelationProperty)) {
      const resources = []
      newGroupValues.map(function (id) {
        resources.push({ resource_id: id, value: 8 })
      })
      return resources
    }
    if (!oldRelationProperty[0].resource_id) {
      oldRelationProperty = [{ resource_id: oldRelationProperty, value: 8 }]
    }

    if (typeof newGroupValues == 'string') {
      newGroupValues = newGroupValues.split(',')
    }

    if (newGroupValues.length == 1) {
      oldRelationProperty[0].resource_id = newGroupValues[0]
      return [oldRelationProperty[0]]
    }

    const newRelationProperty = []
    // GS-2493: need to take into account that task could have assigments on different dates
    // with the same resource
    if (newGroupValues.length > 1) {
      newGroupValues = [...new Set(newGroupValues)] // need to remove repeated ids if they exist
    }

    for (let i = 0; i < newGroupValues.length; i++) {
      let new_value = newGroupValues[i]
      let arrOfResourceIds = oldRelationProperty.map(function (e) {
        return e.resource_id
      })
      // need to get the positions of the resources
      let pos = arrOfResourceIds.reduce(function (resourceAssignmentIndexes, resourceId, index) {
        if (resourceId === new_value) resourceAssignmentIndexes.push(index)
        return resourceAssignmentIndexes
      }, [])

      if (pos.length > 0) {
        pos.forEach((assignmentIndex) => {
          oldRelationProperty[assignmentIndex].resource_id = new_value
          newRelationProperty.push(oldRelationProperty[assignmentIndex])
        })
      } else {
        let copy = gantt.copy(oldRelationProperty[0])
        copy.resource_id = new_value
        newRelationProperty.push(copy)
      }
    }
    return newRelationProperty
  }

  function setRelationValueForPrimitivesArray(newGroupValues, id, oldRelationProperty) {
    return newGroupValues
  }

  function inspectRelationProperty(tasks, relationProperty) {
    var resourceAssignments = false
    var arrays = false
    for (var i = 0; i < tasks.length; i++) {
      var value = tasks[i][relationProperty]
      if (Array.isArray(value)) {
        arrays = true
        if (value.length) {
          if (value[0].resource_id !== undefined) {
            resourceAssignments = true
            break
          }
        }
      }
    }

    return {
      haveArrays: arrays,
      haveResourceAssignments: resourceAssignments,
    }
  }

  function selectRelationFunction(relationInfo) {
    if (relationInfo.haveResourceAssignments) {
      return setRelationValueForAssignmentsArray
    } else if (relationInfo.haveArrays) {
      return setRelationValueForPrimitivesArray
    }
    return null
  }

  gantt.groupBy = function (config) {
    var _this = this
    var tasks = gantt.getTaskByTime()

    this._groups.set_relation_value = config.set_relation_value
    this._groups.dynamicGroups = false
    this._groups.save_tree_structure = config.save_tree_structure

    var relationInfo = inspectRelationProperty(tasks, config.relation_property)

    if (relationInfo.haveArrays) {
      this._groups.dynamicGroups = true
    }

    if (!this._groups.set_relation_value) {
      this._groups.set_relation_value = selectRelationFunction(relationInfo)
    }

    config = config || {}
    config.default_group_label = config.default_group_label || this.locale.labels.default_group || 'None'

    var relation_property = config.relation_property || null
    var group_id = config.group_id || 'key'
    var group_text = config.group_text || 'label'

    this._groups.regroup = function () {
      var tasks = gantt.getTaskByTime()
      var groupOpenCloseState = {}
      var restoreOpenCloseState = false
      tasks.forEach(function (task) {
        if (task.$virtual && task.$open !== undefined) {
          groupOpenCloseState[task[group_id]] = task.$open
          restoreOpenCloseState = true
        }
      })
      var groups = _initGroups(config, tasks, gantt)
      if (groups && restoreOpenCloseState) {
        groups.forEach(function (group) {
          if (groupOpenCloseState[group[group_id]] !== undefined) {
            group.open = groupOpenCloseState[group[group_id]]
          }
        })
      }
      _this._groups.group_tasks(_this, groups, relation_property, group_id, group_text)
      return true
    }
    this._groups.regroup()
  }

  function _initGroups(config, tasks, gantt) {
    var groups
    if (config.groups) {
      if (gantt._groups.dynamicGroups) {
        groups = _getGroupForMultiItems(tasks, config)
      } else {
        groups = config.groups
      }
    } else {
      groups = null
    }
    return groups
  }

  function _getResourcesIds(resources) {
    return resources.map(_getEntryId).sort().join(',')
  }

  function _getEntryId(entry) {
    if (entry && typeof entry == 'object') {
      return String(entry.resource_id)
    } else {
      return String(entry)
    }
  }

  function _getGroupId(task, relationProperty) {
    var group_id
    if (task[relationProperty] instanceof Array) {
      // GS-1332 We want to assign tasks with the empty relationProperty to a default group
      if (!task[relationProperty].length) {
        group_id = 0
      } else {
        group_id = _getResourcesIds(task[relationProperty])
      }
    } else {
      group_id = task[relationProperty]
    }
    return group_id
  }

  function _getGroupForMultiItems(tasks, config) {
    var resultObj = {}
    var result = []
    var itemsByKey = {}
    var property = config.relation_property
    var delimiter = config.delimiter || ','

    var hasDefaultGroup = false
    var defaultGroupId = 0

    helpers.forEach(config.groups, function (entry) {
      if (entry.default) {
        hasDefaultGroup = true
        defaultGroupId = entry.group_id
      }
      itemsByKey[entry.key || entry[config.group_id]] = entry
    })

    for (var i = 0; i < tasks.length; i++) {
      var key
      var label
      var task = tasks[i]
      var taskGroupValue = task[property]

      if (helpers.isArray(taskGroupValue)) {
        if (taskGroupValue.length > 0) {
          key = _getResourcesIds(taskGroupValue)
          label = taskGroupValue
            .map(function (entry, index) {
              var key
              if (entry && typeof entry == 'object') {
                key = entry.resource_id
              } else {
                key = entry
              }
              entry = itemsByKey[key]
              return entry.label || entry.text
            })
            .sort()
          // GS-2493: need to take into account that task could have assigments on different dates
          // with the same resource
          label = [...new Set(label)].join(delimiter)
        } else {
          if (hasDefaultGroup) continue
          key = 0
          label = config.default_group_label
        }
      } else if (taskGroupValue) {
        key = taskGroupValue
        label = itemsByKey[key].label || itemsByKey[key].text
      } else {
        if (hasDefaultGroup) continue
        key = 0
        label = config.default_group_label
      }
      if (key === undefined || resultObj[key] !== undefined) {
        continue
      }
      resultObj[key] = { key: key, label: label }
      if (key === defaultGroupId) {
        resultObj[key].default = true
      }
      resultObj[key][config.group_text] = label
      resultObj[key][config.group_id] = key
    }
    result = helpers.hashToArray(resultObj)
    result.forEach(function (group) {
      if (group.key == defaultGroupId) {
        group.default = true
      }
    })
    return result
  }

  var state = gantt.$services.getService('state')
  state.registerProvider('groupBy', function () {
    return {
      group_mode: gantt._groups.is_active() ? gantt._groups.relation_property : null,
    }
  })

  function _initBeforeDataRender() {
    const _this = this
    if (this.$data.tasksStore._listenerToDrop) {
      this.$data.tasksStore.detachEvent(this.$data.tasksStore._listenerToDrop)
    }

    // updateTask can be called many times from batchUpdate or autoSchedule,
    // add a delay in order to perform grouping only once when everything is done
    const delayedFunction = helpers.delay(function () {
      // GS-2823: if the updated tasks change the relation property from primitive to array
      // need to regroup the tasks
      if (_this._groups.is_active()) {
        const tasks = gantt.getTaskByTime()
        const relationInfo = inspectRelationProperty(tasks, _this._groups.relation_property)
        if (relationInfo.haveArrays) {
          _this._groups.dynamicGroups = true
        }
      }
      if (_this._groups.regroup && gantt.getScrollState) {
        const scrollState = gantt.getScrollState()
        _this._groups.regroup()
        if (scrollState) {
          gantt.scrollTo(scrollState.x, scrollState.y)
        }
      }
      return true
    })

    this.$data.tasksStore.attachEvent('onAfterUpdate', function () {
      // do not reset delayed function each time since onAfterUpdate can be called huge number of times and clearTimeout/setTimeout gets expensive
      if (!delayedFunction.$pending) {
        delayedFunction()
      }
      return true
    })
    // GS:2547 dynamically added tasks need to regroup
    gantt.attachEvent('onParse', function () {
      if (!delayedFunction.$pending) {
        if (_this._groups.is_active()) {
          delayedFunction()
        }
      }
    })
  }
}
