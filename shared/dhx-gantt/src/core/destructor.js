function extend(gantt) {
  gantt.destructor = function () {
    this.clearAll()
    this.callEvent('onDestroy', [])

    this._getDatastores().forEach(function (store) {
      store.destructor()
    })

    if (this.$root) {
      delete this.$root.gantt
    }

    if (this._eventRemoveAll) {
      this._eventRemoveAll()
    }

    if (this.$layout) {
      this.$layout.destructor()
    }

    if (this.resetLightbox) {
      this.resetLightbox()
    }

    // GS-99. Call this here to detach the events
    if (this.ext.inlineEditors && this.ext.inlineEditors.destructor) {
      this.ext.inlineEditors.destructor()
    }

    if (this._dp && this._dp.destructor) {
      this._dp.destructor()
    }
    this.$services.destructor()

    // detachAllEvents should be called last, because in components may be attached events
    this.detachAllEvents()

    for (var i in this) {
      if (i.indexOf('$') === 0) {
        delete this[i]
      }
    }
    this.$destroyed = true
  }
}

export default extend
