// Stub for the optional `remote-client` runtime; the GPL build doesn't ship the
// real client, so RemoteEvents stays inert. Replace this stub at runtime if the
// host app provides the package.
export class Client {
  constructor() {}
  load() {
    return Promise.resolve(null)
  }
  headers() {
    return {}
  }
}
