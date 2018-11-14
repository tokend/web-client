import config from '../../../src/config'

export class LocalStorageViewer {
  constructor (key = config.LOCAL_STORAGE_KEY) {
    this._key = key
    this._storage = {}
  }

  pop () {
    this._storage = JSON.parse(localStorage.getItem(this._key) || '{}')
  }

  push () {
    localStorage.setItem(this._key, JSON.stringify(this._storage))
  }

  set (key, value) {
    this._storage[key] = value
  }

  get (key) {
    return this._storage[key]
  }
}
