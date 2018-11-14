export class AppEvent {
  constructor (type, payload = '') {
    this._type = type
    this._payload = payload
  }

  get type () {
    return this._type
  }

  get payload () {
    return this._payload
  }

  set payload (value) {
    this._payload = value
  }
}
