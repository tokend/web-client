import safeGet from 'lodash/get'

export class Asset {
  constructor (record) {
    this.code = record.id
    this.name = safeGet(record, 'details.name')

    this.availableForIssuance = record.availableForIssuance
    this.owner = safeGet(record, 'owner.id')
  }

  get nameAndCode () {
    const name = this.name || this.code
    return `${name} (${this.code})`
  }
}
