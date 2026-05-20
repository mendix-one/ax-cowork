import * as utils from '../../utils/utils'

var createLinksStoreFacade = function () {
  return {
    getLinkCount: function () {
      return this.$data.linksStore.count()
    },

    getLink: function (id) {
      return this.$data.linksStore.getItem(id)
    },

    getLinks: function () {
      return this.$data.linksStore.getItems()
    },

    isLinkExists: function (id) {
      return this.$data.linksStore.exists(id)
    },

    addLink: function (link) {
      return this.$data.linksStore.addItem(link)
    },

    updateLink: function (id, data) {
      if (!utils.defined(data)) data = this.getLink(id)
      this.$data.linksStore.updateItem(id, data)
    },

    deleteLink: function (id) {
      return this.$data.linksStore.removeItem(id)
    },

    changeLinkId: function (oldid, newid) {
      return this.$data.linksStore.changeId(oldid, newid)
    },
  }
}

export default createLinksStoreFacade
