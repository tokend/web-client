import _get from 'lodash/get'

export class BusinessRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.name = _get(record, 'name')
    this.accountId = _get(record, 'accountId')
    this.industry = _get(record, 'industry')
    this.description = _get(record, 'description')

    try {
      this.logo = JSON.parse(_get(this._record, 'logo'))
      this.logoKey = _get(this.logo, 'key')
      this.logoName = _get(this.logo, 'name')
      this.logoType = _get(this.logo, 'type')
    } catch (error) {
      this.logo = undefined
      this.logoKey = undefined
      this.logoName = undefined
      this.logoType = undefined
    }
  }
}
