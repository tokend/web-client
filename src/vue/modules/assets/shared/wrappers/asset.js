import safeGet from 'lodash/get'

export class Asset {
  constructor (record, balance) {
    this.code = record.id
    this.name = safeGet(record, 'details.name')
    this.issued = record.issued
    this.maxIssuanceAmount = record.maxIssuanceAmount
    this.availableForIssuance = record.availableForIssuance

    this.logoKey = safeGet(record, 'details.logo.key')
    this.termsKey = safeGet(record, 'details.terms.key')

    this.balance = balance
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }
}
