export default function (gantt) {
  gantt.load = function (url, type, callback) {
    this._load_url = url
    this.assert(arguments.length, 'Invalid load arguments')

    var tp = 'json',
      cl = null
    if (arguments.length >= 3) {
      tp = type
      cl = callback
    } else {
      if (typeof arguments[1] == 'string') tp = arguments[1]
      else if (typeof arguments[1] == 'function') cl = arguments[1]
    }

    this._load_type = tp

    this.callEvent('onLoadStart', [url, tp])

    return this.ajax.get(
      url,
      gantt.bind(function (l) {
        this.on_load(l, tp)
        this.callEvent('onLoadEnd', [url, tp])
        if (typeof cl == 'function') cl.call(this)
      }, this),
    )
  }
}
