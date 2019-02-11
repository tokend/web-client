import safeGet from 'lodash/get'

export class Asset {
  constructor (record) {
    this.code = record.id
    this.name = record.name
    this.issued = record.issued
    this.maxIssuanceAmount = record.maxIssuanceAmount
    this.availableForIssuance = record.availableForIssuance

    this.logoKey = safeGet(record, 'details.logo.key')
    this.termsKey = safeGet(record, 'details.terms.key')
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }
}
