import safeGet from 'lodash/get'

export class Asset {
  constructor (record) {
    this.code = record.id
    this.owner = safeGet(record, 'owner.id')

    this.name = safeGet(record, 'details.name')
    this.logoKey = safeGet(record, 'details.logo.key')
  }

  get nameAndCode () {
    const name = this.name || this.code
    return `${name} (${this.code})`
  }
}
