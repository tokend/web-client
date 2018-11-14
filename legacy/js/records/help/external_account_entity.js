import _get from 'lodash/get'

export class ExternalAccountEntity {
  constructor (data) {
    this._rawData = data
    this.type = this._deriveType()
    this.address = this._rawData.data
  }

  _deriveType () {
    return _get(this._rawData, 'type.value')
  }
}
