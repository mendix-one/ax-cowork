import * as remote_client from 'remote-client'
export const remoteEvents = function (url, token) {
  const remote = new remote_client.Client({
    url,
    token,
  })

  // temporary patch, as we do not want credentials
  remote.fetch = function (url, body) {
    const req = {
      headers: this.headers(),
    }
    if (body) {
      req.method = 'POST'
      req.body = body
    }

    return fetch(url, req).then((res) => res.json())
  }

  this._ready = remote.load().then((back) => (this._remote = back))

  function ready() {
    return this._ready
  }

  function on(name, handler) {
    this.ready().then((back) => {
      if (typeof name === 'string') back.on(name, handler)
      else {
        for (const key in name) {
          back.on(key, name[key])
        }
      }
    })
  }

  this.ready = ready
  this.on = on
}
