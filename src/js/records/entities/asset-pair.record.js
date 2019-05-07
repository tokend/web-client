import { ASSET_PAIR_POLICIES } from '@tokend/js-sdk'
import safeGet from 'lodash/get'

export class AssetPairRecord {
  constructor (record = {}) {
    this._record = record

    this.baseAssetCode = safeGet(record, 'baseAsset.id')
    this.quoteAssetCode = safeGet(record, 'quoteAsset.id')

    this.price = record.price

    this.policies = this._policies()
    this.policy = this._policy()
  }

  _policies () {
    const policies = safeGet(this._record, 'policies.flags') || []
    return policies.map(policy => policy.value)
  }

  _policy () {
    return this._policies().reduce((s, p) => s | p, 0)
  }

  get baseAndQuote () {
    return `${this.baseAssetCode}/${this.quoteAssetCode}`
  }

  get isTradable () {
    return !!(this.policy & ASSET_PAIR_POLICIES.tradeableSecondaryMarket)
  }

  get isPhysicalPriceRestricted () {
    return !!(this.policy & ASSET_PAIR_POLICIES.physicalPriceRestriction)
  }

  get isCurrentPriceRestricted () {
    return !!(this.policy & ASSET_PAIR_POLICIES.currentPriceRestriction)
  }
}
