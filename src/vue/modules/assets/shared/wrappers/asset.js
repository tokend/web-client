import safeGet from 'lodash/get'
import { ASSET_POLICIES } from '@tokend/js-sdk'

export class Asset {
  constructor (record, balance) {
    this.code = record.id
    this.name = safeGet(record, 'details.name')
    this.type = record.type

    this.issued = record.issued
    this.maxIssuanceAmount = record.maxIssuanceAmount
    this.availableForIssuance = record.availableForIssuance

    this.logo = safeGet(record, 'details.logo')
    this.logoKey = safeGet(record, 'details.logo.key')

    this.terms = safeGet(record, 'details.terms')
    this.termsKey = safeGet(record, 'details.terms.key')

    this.policy = safeGet(record, 'policies.value')
    this.policies = safeGet(record, 'policies.flags') || []

    this.owner = safeGet(record, 'owner.id')
    this.balance = balance
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  get isTransferable () {
    return Boolean(this.policy & ASSET_POLICIES.transferable)
  }

  get isWithdrawable () {
    return Boolean(this.policy & ASSET_POLICIES.withdrawable) ||
      Boolean(this.policy & ASSET_POLICIES.withdrawableV2)
  }
}
