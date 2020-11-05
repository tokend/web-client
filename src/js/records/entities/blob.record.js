export class BlobRecord {
  constructor (raw = {}) {
    this._raw = raw

    this.id = raw.id || ''
    this.type = raw.type || ''
    this.value = raw.value || ''
  }

  get raw () {
    return this._raw
  }

  get valueAsObject () {
    return JSON.parse(this.value || '{}')
  }
}
