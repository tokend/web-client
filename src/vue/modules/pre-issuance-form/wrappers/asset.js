import safeGet from 'lodash/get'

export class Asset {
  constructor (record) {
    this.code = record.id
    this.owner = safeGet(record, 'owner.id')
  }
}
