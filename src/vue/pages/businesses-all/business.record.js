import _get from 'lodash/get'

export class BusinessRecord {
  constructor (record) {
    this._record = record

    this.id = record.id
    this.logoLink = _get(record, 'logoLink')
    this.name = _get(record, 'name')
    this.accountId = _get(record, 'accountId')
  }
}
