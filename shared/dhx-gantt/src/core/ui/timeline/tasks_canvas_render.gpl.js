var createStaticBgHelper = function () {
  return {
    render: function () {},
    destroy: function () {},
  }
}

export default {
  create: function () {
    return createStaticBgHelper()
  },
}
