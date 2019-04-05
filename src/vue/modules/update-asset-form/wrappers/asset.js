import safeGet from 'lodash/get'

export class Asset {
  constructor (record) {
    this.code = record.id
    this.name = safeGet(record, 'details.name')

    this.policy = safeGet(record, 'policies.value')

    this.terms = safeGet(record, 'details.terms')
    this.termsKey = safeGet(record, 'details.terms.key')

    this.logo = safeGet(record, 'details.logo')
    this.logoKey = safeGet(record, 'details.logo.key')
  }
}
