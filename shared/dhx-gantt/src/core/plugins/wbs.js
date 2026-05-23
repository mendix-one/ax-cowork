const createWbs = function (gantt) {
  return {
    _needRecalc: true,
    reset: function () {
      this._needRecalc = true
    },
    _isRecalcNeeded: function () {
      return !this._isGroupSort() && this._needRecalc
    },
    _isGroupSort: function () {
      return !!gantt.getState().group_mode
    },
    _getWBSCode: function (task) {
      if (!task) return ''

      if (this._isRecalcNeeded()) {
        this._calcWBS()
      }

      if (task.$virtual) return ''
      if (this._isGroupSort()) return task.$wbs || ''

      if (!task.$wbs) {
        this.reset()
        this._calcWBS()
      }
      return task.$wbs
    },
    _setWBSCode: function (task, value) {
      task.$wbs = value
    },
    getWBSCode: function (task) {
      return this._getWBSCode(task)
    },
    getByWBSCode: function (code) {
      let parts = code.split('.')
      let currentNode = gantt.config.root_id
      for (let i = 0; i < parts.length; i++) {
        const children = gantt.getChildren(currentNode)
        let index = parts[i] * 1 - 1
        if (gantt.isTaskExists(children[index])) {
          currentNode = children[index]
        } else {
          return null
        }
      }
      if (gantt.isTaskExists(currentNode)) {
        return gantt.getTask(currentNode)
      } else {
        return null
      }
    },
    _calcWBS: function () {
      if (!this._isRecalcNeeded()) return

      let _isFirst = true
      gantt.eachTask(
        function (ch) {
          if (ch.type == gantt.config.types.placeholder) return
          if (_isFirst) {
            _isFirst = false
            this._setWBSCode(ch, '1')
            return
          }
          const _prevSibling = this._getPrevNonPlaceholderSibling(ch.id)
          if (_prevSibling !== null) {
            this._increaseWBS(ch, _prevSibling)
          } else {
            let _parent = gantt.getParent(ch.id)
            this._setWBSCode(ch, gantt.getTask(_parent).$wbs + '.1')
          }
        },
        gantt.config.root_id,
        this,
      )

      this._needRecalc = false
    },
    _increaseWBS: function (task, siblingiId) {
      let _wbs = gantt.getTask(siblingiId).$wbs
      if (_wbs) {
        _wbs = _wbs.split('.')
        _wbs[_wbs.length - 1]++
        this._setWBSCode(task, _wbs.join('.'))
      }
    },
    _getPrevNonPlaceholderSibling: function (childId) {
      let prevSibling
      let currentId = childId
      do {
        prevSibling = gantt.getPrevSibling(currentId)
        currentId = prevSibling
      } while (prevSibling !== null && gantt.getTask(prevSibling).type == gantt.config.types.placeholder)
      return prevSibling
    },
  }
}

export default function (gantt) {
  const wbs = createWbs(gantt)
  gantt.getWBSCode = function getWBSCode(task) {
    return wbs.getWBSCode(task)
  }

  gantt.getTaskByWBSCode = function (code) {
    return wbs.getByWBSCode(code)
  }

  function resetCache() {
    wbs.reset()
    return true
  }

  gantt.attachEvent('onAfterTaskMove', resetCache)
  gantt.attachEvent('onBeforeParse', resetCache)
  gantt.attachEvent('onAfterTaskDelete', resetCache)
  gantt.attachEvent('onAfterTaskAdd', resetCache)
  gantt.attachEvent('onAfterSort', resetCache)
}
