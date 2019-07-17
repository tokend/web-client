import safeGet from 'lodash/get'
import { ASSET_POLICIES } from '@tokend/js-sdk'

export class Asset {
  constructor (record) {
    this.code = record.id
    this.name = safeGet(record, 'details.name')

    this.availableForIssuance = record.availableForIssuance
    this.policy = safeGet(record, 'policies.value')
    this.owner = safeGet(record, 'owner.id')
  }

  get isBaseAsset () {
    return Boolean(this.policy & ASSET_POLICIES.baseAsset)
  }

  get isDefaultQuoteAsset () {
    return Boolean(this.policy & ASSET_POLICIES.statsQuoteAsset)
  }

  get nameAndCode () {
    const name = this.name || this.code
    return `${name} (${this.code})`
  }
}
